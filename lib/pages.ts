import pages from '@/content/placeholders/pages.json';
import placeholderContent from '@/content/placeholders/site-content.json';
import type {Locale} from '@/types/locale';

/** Static fallbacks — prefer `getContentBundle()` for KV-aware content on the server */
export const pageContent = pages;
export const siteContent = placeholderContent;

export function localized<T extends Record<Locale, unknown>>(value: T, locale: Locale) {
  return value[locale];
}

export function getCaseStudy(slug: string) {
  return placeholderContent.caseStudies.find((study) => study.slug === slug);
}
