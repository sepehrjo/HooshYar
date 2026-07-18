"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { siteContent as defaultSiteContent } from "@/lib/site";
import type { SiteContentData } from "@/lib/content/utils";
import type { Locale } from "@/types/locale";

export function ConditionalFooter({
  locale,
  site = defaultSiteContent as SiteContentData,
}: {
  locale: Locale;
  site?: SiteContentData;
}) {
  const pathname = usePathname();
  const homePath = `/${locale}`;

  if (pathname === homePath || pathname === `${homePath}/`) {
    return null;
  }

  return <Footer locale={locale} site={site} />;
}
