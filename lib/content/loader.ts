import { cache } from 'react';
import { Redis } from '@upstash/redis';
import { isKvConfigured } from '@/lib/kv/config';
import {
  CONTENT_ALL_KEY,
  type ContentStore,
  type PagesContentData,
  type SiteContentData,
  deepMerge,
  getDefaultContent,
} from '@/lib/content/utils';

// Re-use the same env vars as lib/kv/index.ts.
// We instantiate our own client here to avoid a circular import with lib/kv,
// which exports high-level helpers that use a `content:` key prefix
// (content:${key}). Since CONTENT_ALL_KEY is already 'content:all', using
// those helpers would double-prefix the key to 'content:content:all'.
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

async function kvGet<T>(key: string): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const client = getClient();
  if (!client) throw new Error('KV not available');
  await client.set(key, value);
}

export const getContentBundle = cache(async (): Promise<{
  site: SiteContentData;
  pages: PagesContentData;
  lastModified: string | null;
}> => {
  const defaults = getDefaultContent();

  if (!(await isKvConfigured())) {
    return {
      site: defaults.site,
      pages: defaults.pages,
      lastModified: null,
    };
  }

  try {
    const stored = await kvGet<ContentStore>(CONTENT_ALL_KEY);
    if (stored?.site || stored?.pages) {
      return {
        site: deepMerge(defaults.site, (stored.site ?? {}) as Partial<SiteContentData>),
        pages: deepMerge(defaults.pages, (stored.pages ?? {}) as Partial<PagesContentData>),
        lastModified: stored.lastModified ?? null,
      };
    }
  } catch (error) {
    console.error('Error loading content from KV:', error);
  }

  return {
    site: defaults.site,
    pages: defaults.pages,
    lastModified: null,
  };
});

export async function getStoredContentStore(): Promise<ContentStore | null> {
  if (!(await isKvConfigured())) return null;

  try {
    return await kvGet<ContentStore>(CONTENT_ALL_KEY);
  } catch {
    return null;
  }
}

export async function saveContentStore(store: ContentStore): Promise<void> {
  if (!(await isKvConfigured())) return;
  await kvSet(CONTENT_ALL_KEY, store);
}
