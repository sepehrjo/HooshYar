import defaultSite from '@/content/placeholders/site-content.json';
import defaultPages from '@/content/placeholders/pages.json';

export type SiteContentData = typeof defaultSite;
export type PagesContentData = typeof defaultPages;

export interface ContentHistoryEntry {
  id: string;
  fieldId: string;
  fieldLabel: string;
  oldFa: string;
  oldEn: string;
  newFa: string;
  newEn: string;
  timestamp: string;
}

export interface ContentStore {
  lastModified: string;
  site: Partial<SiteContentData>;
  pages: Partial<PagesContentData>;
  history: ContentHistoryEntry[];
}

export const CONTENT_ALL_KEY = 'content:all';

export function getDefaultContent(): {
  site: SiteContentData;
  pages: PagesContentData;
} {
  return {
    site: structuredClone(defaultSite) as SiteContentData,
    pages: structuredClone(defaultPages) as PagesContentData,
  };
}

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>
): T {
  const result = structuredClone(base) as T;

  for (const key of Object.keys(override) as Array<keyof T>) {
    const overrideVal = override[key];
    const baseVal = result[key];

    if (
      overrideVal &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal) &&
      baseVal &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>
      ) as T[keyof T];
    } else if (overrideVal !== undefined) {
      result[key] = structuredClone(overrideVal) as T[keyof T];
    }
  }

  return result;
}

export function getPathValue(obj: unknown, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    const key: string | number = /^\d+$/.test(part) ? Number(part) : part;
    return (acc as Record<string | number, unknown>)[key];
  }, obj);

  return typeof value === 'string' ? value : '';
}

export function setPathValue(
  obj: Record<string, unknown>,
  path: string,
  value: string
): void {
  const parts = path.split('.');
  let current: Record<string | number, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    const key: string | number = /^\d+$/.test(part) ? Number(part) : part;
    const nextPart = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(nextPart);

    if (current[key] == null) {
      current[key] = nextIsIndex ? [] : {};
    }
    current = current[key] as Record<string | number, unknown>;
  }

  const last = parts[parts.length - 1];
  const lastKey: string | number = /^\d+$/.test(last) ? Number(last) : last;
  current[lastKey] = value;
}
