import placeholderContent from '@/content/placeholders/site-content.json';
import type { Locale } from '@/types/locale';

/** Static fallback — prefer `getContentBundle()` for KV-aware content on the server */
export const siteContent = placeholderContent;

export function getLocalizedValue<T extends Record<Locale, unknown>>(value: T, locale: Locale) {
  return value[locale];
}
