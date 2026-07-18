import { cache } from 'react';
import { isKvConfigured } from '@/lib/kv/config';
import {
  CONTENT_ALL_KEY,
  type ContentStore,
  type PagesContentData,
  type SiteContentData,
  deepMerge,
  getDefaultContent,
} from '@/lib/content/utils';

function getClient(): Promise<import('@upstash/redis').Redis | null> {
  return (async () => {
    try {
      const { Redis } = await import('@upstash/redis');
      const url = process.env.KV_REST_API_URL;
      const token = process.env.KV_REST_API_TOKEN;
      if (!url || !token) return null;
      return new Redis({ url, token });
    } catch {
      return null;
    }
  })();
}

async function kvGetJSON<T>(key: string): Promise<T | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch {
    return null;
  }
}

async function kvSetJSON(key: string, value: unknown): Promise<void> {
  const client = await getClient();
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
    const stored = await kvGetJSON<ContentStore>(CONTENT_ALL_KEY);
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
    return await kvGetJSON<ContentStore>(CONTENT_ALL_KEY);
  } catch {
    return null;
  }
}

export async function saveContentStore(store: ContentStore): Promise<void> {
  if (!(await isKvConfigured())) return;
  await kvSetJSON(CONTENT_ALL_KEY, store);
}
