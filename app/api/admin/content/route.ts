import {NextRequest, NextResponse} from 'next/server';
import {getAdminToken} from '@/lib/auth';
import {getDemoMode} from '@/lib/kv';
import {getFieldById} from '@/lib/content/content-tree';
import {
  getContentBundle,
  getStoredContentStore,
  saveContentStore,
} from '@/lib/content/loader';
import {
  type ContentHistoryEntry,
  type ContentStore,
  getDefaultContent,
  getPathValue,
  setPathValue,
  deepMerge,
  type PagesContentData,
  type SiteContentData,
} from '@/lib/content/utils';

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken(request);

    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const defaults = getDefaultContent();
    const bundle = await getContentBundle();
    const stored = await getStoredContentStore();

    return NextResponse.json({
      site: bundle.site,
      pages: bundle.pages,
      defaults,
      history: stored?.history ?? [],
      lastModified: bundle.lastModified,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({error: 'Failed to fetch content'}, {status: 500});
  }
}

interface PutBody {
  fieldId: string;
  fa: string;
  en: string;
  undoEntryId?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAdminToken(request);

    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const body = (await request.json()) as PutBody;
    const {fieldId, fa, en, undoEntryId} = body;

    if (!fieldId) {
      return NextResponse.json({error: 'fieldId is required'}, {status: 400});
    }

    const field = getFieldById(fieldId);
    if (!field) {
      return NextResponse.json({error: 'Unknown field'}, {status: 400});
    }

    const defaults = getDefaultContent();
    const isDemo = await getDemoMode();

    if (undoEntryId) {
      const stored = await getStoredContentStore();
      const entry = stored?.history.find(h => h.id === undoEntryId);
      if (!entry) {
        return NextResponse.json({error: 'History entry not found'}, {status: 404});
      }

      if (isDemo) {
        return NextResponse.json({success: true, demo: true});
      }

      await applyFieldUpdate(
        fieldId,
        entry.oldFa,
        entry.oldEn,
        entry.fieldLabel,
        defaults,
        stored ?? undefined
      );
      return NextResponse.json({success: true});
    }

    if (isDemo) {
      return NextResponse.json({success: true, demo: true});
    }

    const label = field.labelEn;
    await applyFieldUpdate(fieldId, fa, en, label, defaults);
    return NextResponse.json({success: true});
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({error: 'Failed to save content'}, {status: 500});
  }
}

async function applyFieldUpdate(
  fieldId: string,
  fa: string,
  en: string,
  fieldLabel: string,
  defaults: ReturnType<typeof getDefaultContent>,
  existingStore?: ContentStore | null
) {
  const field = getFieldById(fieldId);
  if (!field) return;

  const stored =
    existingStore ??
    (await getStoredContentStore()) ??
    ({
      lastModified: new Date().toISOString(),
      site: {},
      pages: {},
      history: [],
    } as ContentStore);

  const currentSite = deepMerge(
    defaults.site,
    stored.site as Partial<SiteContentData>
  );
  const currentPages = deepMerge(
    defaults.pages,
    stored.pages as Partial<PagesContentData>
  );

  const rootObj = field.root === 'site' ? currentSite : currentPages;
  const oldFa = getPathValue(rootObj, field.pathFa);
  const oldEn = getPathValue(rootObj, field.pathEn);

  if (field.type === 'single') {
    setPathValue(rootObj as Record<string, unknown>, field.pathEn, en || fa);
  } else {
    setPathValue(rootObj as Record<string, unknown>, field.pathFa, fa);
    setPathValue(rootObj as Record<string, unknown>, field.pathEn, en);
  }

  const historyEntry: ContentHistoryEntry = {
    id: `${Date.now()}-${fieldId}`,
    fieldId,
    fieldLabel,
    oldFa,
    oldEn,
    newFa: fa,
    newEn: en,
    timestamp: new Date().toISOString(),
  };

  const history = [historyEntry, ...(stored.history ?? [])].slice(0, 10);

  const nextStore: ContentStore = {
    lastModified: new Date().toISOString(),
    site: currentSite as Partial<SiteContentData>,
    pages: currentPages as Partial<PagesContentData>,
    history,
  };

  await saveContentStore(nextStore);

  const {updateDashboardStats} = await import('@/lib/kv');
  await updateDashboardStats({lastContentUpdate: nextStore.lastModified});
}

interface ResetBody {
  fieldId: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getAdminToken(request);

    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {fieldId} = (await request.json()) as ResetBody;
    const field = getFieldById(fieldId);

    if (!field) {
      return NextResponse.json({error: 'Unknown field'}, {status: 400});
    }

    const defaults = getDefaultContent();
    const rootDefaults = field.root === 'site' ? defaults.site : defaults.pages;
    const fa = getPathValue(rootDefaults, field.pathFa);
    const en = getPathValue(rootDefaults, field.pathEn);

    const isDemo = await getDemoMode();
    if (isDemo) {
      return NextResponse.json({success: true, demo: true, fa, en});
    }

    await applyFieldUpdate(fieldId, fa, en, `${field.labelEn} (reset)`, defaults);
    return NextResponse.json({success: true, fa, en});
  } catch (error) {
    console.error('Error resetting content field:', error);
    return NextResponse.json({error: 'Failed to reset field'}, {status: 500});
  }
}
