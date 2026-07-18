import type {MetadataRoute} from 'next';
import {absoluteUrl, getDynamicSeoRoutes, localizedAlternates, localizedPath, staticSeoRoutes} from '@/lib/seo';
import {locales} from '@/types/locale';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) => {
    const routes = [...staticSeoRoutes, ...getDynamicSeoRoutes(locale)];

    return routes.map((route) => ({
      url: absoluteUrl(localizedPath(locale, route.path)),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: localizedAlternates(route.path)
      }
    }));
  });
}
