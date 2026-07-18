import {NextRequest, NextResponse} from 'next/server';
import {getAdminToken} from '@/lib/auth';
import {
  getDemoMode,
  getChatSessions,
  updateChatSession,
  type ChatSession,
} from '@/lib/kv';

export interface ChatAnalytics {
  totalSessions: number;
  faCount: number;
  enCount: number;
  faEnRatio: string;
  avgMessagesPerSession: number;
}

function computeAnalytics(sessions: ChatSession[]): ChatAnalytics {
  const totalSessions = sessions.length;
  const faCount = sessions.filter(s => s.locale === 'fa').length;
  const enCount = sessions.filter(s => s.locale === 'en').length;
  const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
  const avgMessagesPerSession =
    totalSessions > 0 ? Math.round((totalMessages / totalSessions) * 10) / 10 : 0;

  const faEnRatio =
    totalSessions === 0
      ? '0 / 0'
      : `${Math.round((faCount / totalSessions) * 100)}% / ${Math.round((enCount / totalSessions) * 100)}%`;

  return {
    totalSessions,
    faCount,
    enCount,
    faEnRatio,
    avgMessagesPerSession,
  };
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const sessions = await getChatSessions();
    const unreadCount = sessions.filter(s => !s.read).length;
    const analytics = computeAnalytics(sessions);

    return NextResponse.json({sessions, unreadCount, analytics});
  } catch (error) {
    console.error('Error fetching chatbot logs:', error);
    return NextResponse.json(
      {error: 'Failed to fetch chatbot logs'},
      {status: 500}
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {sessionId, action, flagged} = await request.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({error: 'sessionId is required'}, {status: 400});
    }

    const isDemo = await getDemoMode();

    if (action === 'read') {
      if (isDemo) {
        return NextResponse.json({success: true, demo: true, read: true});
      }
      const updated = await updateChatSession(sessionId, {read: true});
      if (!updated) {
        return NextResponse.json({error: 'Session not found'}, {status: 404});
      }
      return NextResponse.json({success: true, session: updated});
    }

    if (action === 'toggleFlag') {
      if (isDemo) {
        return NextResponse.json({
          success: true,
          demo: true,
          flagged: typeof flagged === 'boolean' ? !flagged : true,
        });
      }
      const sessions = await getChatSessions();
      const existing = sessions.find(s => s.sessionId === sessionId);
      if (!existing) {
        return NextResponse.json({error: 'Session not found'}, {status: 404});
      }
      const updated = await updateChatSession(sessionId, {
        flagged: !existing.flagged,
      });
      return NextResponse.json({success: true, session: updated});
    }

    return NextResponse.json({error: 'Invalid action'}, {status: 400});
  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      {error: 'Failed to update session'},
      {status: 500}
    );
  }
}
