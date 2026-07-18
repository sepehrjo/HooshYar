import { ScrollSnapShell } from "@/components/layout";
import { HomeScrollSections } from "@/components/sections";
import type { Locale } from "@/types/locale";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <ScrollSnapShell>
      <HomeScrollSections locale={locale} />
    </ScrollSnapShell>
  );
}
