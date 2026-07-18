import { NextRequest, NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/auth';
import {
  clearChatLogs,
  getDemoMode,
  isKvConfigured,
  resetContent,
} from '@/lib/kv';
import {
  getContentBundle,
  getStoredContentStore,
  saveContentStore,
} from '@/lib/content/loader';
import {
  deepMerge,
  getDefaultContent,
  type SiteContentData,
} from '@/lib/content/utils';

function maskGroqKey(key: string | undefined): string | null {
  if (!key) return null;
  if (key.length <= 8) return 'gsk_****';
  return `gsk_${key.slice(4, 8)}****...****${key.slice(-4)}`;
}

async function checkKvConnection(): Promise<boolean> {
  if (!(await isKvConfigured())) return false;

  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) return false;
    const client = new Redis({ url, token });
    await client.get('demo_mode');
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [demoMode, bundle, kvConnected] = await Promise.all([
      getDemoMode(),
      getContentBundle(),
      checkKvConnection(),
    ]);

    return NextResponse.json({
      demoMode,
      social: {
        instagram: bundle.site.social.instagram,
        telegram: bundle.site.social.telegram,
        whatsapp: bundle.site.social.whatsapp,
        bale: bundle.site.social.bale,
        email: bundle.site.social.email,
      },
      contactEmail: bundle.site.contact.email,
      groq: {
        configured: Boolean(process.env.GROQ_API_KEY),
        masked: maskGroqKey(process.env.GROQ_API_KEY),
      },
      kv: {
        connected: kvConnected,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

interface SocialLinksBody {
  instagram: string;
  telegram: string;
  whatsapp: string;
  bale: string;
  email: string;
  contactEmail: string;
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAdminToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as SocialLinksBody;
    const isDemo = await getDemoMode();

    if (isDemo) {
      return NextResponse.json({ success: true, demo: true });
    }

    const defaults = getDefaultContent();
    const stored = await getStoredContentStore();
    const currentSite = deepMerge(
      defaults.site,
      (stored?.site ?? {}) as Partial<SiteContentData>
    );

    currentSite.social = {
      ...currentSite.social,
      instagram: body.instagram ?? currentSite.social.instagram,
      telegram: body.telegram ?? currentSite.social.telegram,
      whatsapp: body.whatsapp ?? currentSite.social.whatsapp,
      bale: body.bale ?? currentSite.social.bale,
      email: body.email ?? currentSite.social.email,
    };

    if (body.contactEmail) {
      currentSite.contact = {
        ...currentSite.contact,
        email: body.contactEmail,
      };
    }

    const nextStore = {
      lastModified: new Date().toISOString(),
      site: currentSite as Partial<SiteContentData>,
      pages: stored?.pages ?? {},
      history: stored?.history ?? [],
    };

    await saveContentStore(nextStore);

    const { updateDashboardStats } = await import('@/lib/kv');
    await updateDashboardStats({ lastContentUpdate: nextStore.lastModified });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

interface DangerActionBody {
  action: 'clear-chat-logs' | 'reset-content';
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAdminToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = (await request.json()) as DangerActionBody;

    if (action !== 'clear-chat-logs' && action !== 'reset-content') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const isDemo = await getDemoMode();
    if (isDemo) {
      return NextResponse.json({ success: true, demo: true });
    }

    if (action === 'clear-chat-logs') {
      await clearChatLogs();
    } else {
      await resetContent();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error performing settings action:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
