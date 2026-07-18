import {getBlogPosts, getCaseStudies} from '@/lib/content';
import type {Locale} from '@/types/locale';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hoosh-yar.com';

export type SeoRoute = {
  path: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly';
};

export const staticSeoRoutes: SeoRoute[] = [
  {path: '', priority: 1, changeFrequency: 'weekly'},
  {path: '/intro', priority: 0.95, changeFrequency: 'weekly'},
  {path: '/about', priority: 0.8, changeFrequency: 'monthly'},
  {path: '/services', priority: 0.9, changeFrequency: 'monthly'},
  {path: '/work', priority: 0.85, changeFrequency: 'weekly'},
  {path: '/process', priority: 0.75, changeFrequency: 'monthly'},
  {path: '/pricing', priority: 0.75, changeFrequency: 'monthly'},
  {path: '/contact', priority: 0.8, changeFrequency: 'monthly'},
  {path: '/blog', priority: 0.65, changeFrequency: 'weekly'}
];

export function absoluteUrl(path = '') {
  return new URL(path, siteUrl).toString();
}

export function localizedPath(locale: Locale, path = '') {
  return `/${locale}${path}`;
}

export function getDynamicSeoRoutes(locale: Locale): SeoRoute[] {
  const caseStudyRoutes = getCaseStudies(locale).map((study) => ({
    path: `/work/${study.slug}`,
    priority: study.frontmatter.status === 'published' ? 0.75 : 0.35,
    changeFrequency: 'monthly' as const
  }));

  const blogRoutes = getBlogPosts(locale).map((post) => ({
    path: `/blog/${post.slug}`,
    priority: post.frontmatter.status === 'published' ? 0.65 : 0.3,
    changeFrequency: 'monthly' as const
  }));

  return [...caseStudyRoutes, ...blogRoutes];
}

export function localizedAlternates(path = '') {
  return {
    en: absoluteUrl(localizedPath('en', path)),
    fa: absoluteUrl(localizedPath('fa', path))
  };
}
