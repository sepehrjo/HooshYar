import { Redis } from '@upstash/redis';
import { isKvConfigured } from '@/lib/kv/config';

export { isKvConfigured, isKvConfiguredSync } from '@/lib/kv/config';

// Module-level singleton — created once per server instance, not per request.
let _client: Redis | null = null;

function getClient(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!_client) {
    _client = new Redis({ url, token });
  }
  return _client;
}

async function kvGetJSON<T>(key: string): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch {
    return null;
  }
}

async function kvSetJSON(key: string, value: unknown): Promise<void> {
  const client = getClient();
  if (!client) throw new Error('KV not available');
  await client.set(key, value);
}

async function kvDelete(key: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client.del(key);
}

async function kvListKeys(prefix: string): Promise<string[]> {
  const client = getClient();
  if (!client) return [];
  try {
    return await client.keys(`${prefix}*`);
  } catch {
    return [];
  }
}

const defaultStats = (): DashboardStats => ({
  newLeadsToday: 0,
  totalLeads: 0,
  chatbotSessionsToday: 0,
  lastContentUpdate: 'Never',
});

export async function getDemoMode(): Promise<boolean> {
  if (!(await isKvConfigured())) return false;
  try {
    const enabled = await kvGetJSON<boolean>('demo_mode');
    return enabled || false;
  } catch (error) {
    console.error('Error getting demo mode:', error);
    return false;
  }
}

export async function setDemoMode(enabled: boolean): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    await kvSetJSON('demo_mode', enabled);
  } catch (error) {
    console.error('Error setting demo mode:', error);
    throw error;
  }
}

export interface DashboardStats {
  newLeadsToday: number;
  totalLeads: number;
  chatbotSessionsToday: number;
  lastContentUpdate: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!(await isKvConfigured())) return defaultStats();
  try {
    const stats = await kvGetJSON<DashboardStats>('dashboard_stats');
    return stats || defaultStats();
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return defaultStats();
  }
}

export async function updateDashboardStats(
  stats: Partial<DashboardStats>
): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    const current = await getDashboardStats();
    await kvSetJSON('dashboard_stats', { ...current, ...stats });
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    throw error;
  }
}

export interface Lead {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  locale: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export async function saveLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<string> {
  if (!(await isKvConfigured())) return '';
  try {
    const id = `lead:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const leadData: Lead = {
      ...lead,
      id,
      status: lead.status || 'new',
      createdAt: new Date().toISOString()
    };

    await kvSetJSON(id, leadData);

    const stats = await getDashboardStats();
    await updateDashboardStats({
      totalLeads: stats.totalLeads + 1,
      newLeadsToday: stats.newLeadsToday + 1
    });

    return id;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (!(await isKvConfigured())) return [];
  try {
    const keys = await kvListKeys('lead:');
    if (keys.length === 0) return [];

    const leads = await Promise.all(
      keys.map(key => kvGetJSON<Lead>(key))
    );

    return leads
      .filter((lead): lead is Lead => lead !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting leads:', error);
    return [];
  }
}

export async function updateLeadStatus(
  leadId: string,
  status: Lead['status']
): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    const lead = await kvGetJSON<Lead>(leadId);
    if (lead) {
      await kvSetJSON(leadId, { ...lead, status });
    }
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
}

export interface ChatSession {
  id: string;
  sessionId: string;
  locale: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  lastActivityAt: string;
  read: boolean;
  flagged: boolean;
}

export async function saveChatSession(
  sessionId: string,
  locale: string,
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    const key = `chat:${sessionId}`;
    const existing = await kvGetJSON<ChatSession>(key);
    const now = new Date().toISOString();

    const message = {
      role: 'user' as const,
      content: userMessage,
      timestamp: now,
    };

    const assistantMsg = {
      role: 'assistant' as const,
      content: assistantMessage,
      timestamp: now,
    };

    if (existing) {
      existing.messages.push(message, assistantMsg);
      existing.lastActivityAt = now;
      existing.read = false;
      await kvSetJSON(key, existing);
    } else {
      const session: ChatSession = {
        id: key,
        sessionId,
        locale,
        messages: [message, assistantMsg],
        createdAt: now,
        lastActivityAt: now,
        read: false,
        flagged: false,
      };
      await kvSetJSON(key, session);

      const stats = await getDashboardStats();
      await updateDashboardStats({
        chatbotSessionsToday: stats.chatbotSessionsToday + 1,
      });
    }
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
}

export async function updateChatSession(
  sessionId: string,
  updates: Partial<Pick<ChatSession, 'read' | 'flagged'>>
): Promise<ChatSession | null> {
  if (!(await isKvConfigured())) return null;
  try {
    const key = `chat:${sessionId}`;
    const existing = await kvGetJSON<ChatSession>(key);
    if (!existing) return null;

    const updated: ChatSession = { ...existing, ...updates };
    await kvSetJSON(key, updated);
    return updated;
  } catch (error) {
    console.error('Error updating chat session:', error);
    throw error;
  }
}

export async function getChatSessions(): Promise<ChatSession[]> {
  if (!(await isKvConfigured())) return [];
  try {
    const keys = await kvListKeys('chat:');
    if (keys.length === 0) return [];

    const sessions = await Promise.all(
      keys.map(key => kvGetJSON<ChatSession>(key))
    );

    return sessions
      .filter((session): session is ChatSession => session !== null)
      .map(session => ({
        ...session,
        lastActivityAt: session.lastActivityAt ?? session.createdAt,
        read: session.read ?? true,
        flagged: session.flagged ?? false,
      }))
      .sort(
        (a, b) =>
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
      );
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return [];
  }
}

export async function getContent<T = unknown>(key: string, fallback: T): Promise<T> {
  if (!(await isKvConfigured())) return fallback;
  try {
    const content = await kvGetJSON<T>(`content:${key}`);
    return content || fallback;
  } catch (error) {
    console.error(`Error getting content for ${key}:`, error);
    return fallback;
  }
}

export async function setContent<T = unknown>(key: string, value: T): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    await kvSetJSON(`content:${key}`, value);
    await updateDashboardStats({
      lastContentUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error setting content for ${key}:`, error);
    throw error;
  }
}

export async function clearChatLogs(): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    const keys = await kvListKeys('chat:');
    if (keys.length > 0) {
      await Promise.all(keys.map(key => kvDelete(key)));
    }
  } catch (error) {
    console.error('Error clearing chat logs:', error);
    throw error;
  }
}

export async function resetContent(): Promise<void> {
  if (!(await isKvConfigured())) return;
  try {
    const keys = await kvListKeys('content:');
    if (keys.length > 0) {
      await Promise.all(keys.map(key => kvDelete(key)));
    }
  } catch (error) {
    console.error('Error resetting content:', error);
    throw error;
  }
}

/**
 * Performs a live connectivity test against KV by issuing a real GET.
 * Used by the admin settings panel to report status.
 */
export async function checkKvConnection(): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    await client.get('demo_mode');
    return true;
  } catch {
    return false;
  }
}
