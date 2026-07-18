import { PageHero, WorkGrid } from "@/components/sections";
import { getCaseStudies } from "@/lib/content";
import type { Locale } from "@/types/locale";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const studies = getCaseStudies(locale);

  return (
    <main>
      <PageHero
        eyebrow={locale === "fa" ? "نمونه‌کارها" : "Work"}
        title={
          locale === "fa"
            ? "مطالعات موردی از MDX تغذیه می‌شوند."
            : "Case studies now run on MDX."
        }
        body={
          locale === "fa"
            ? "تا زمان دریافت پروژه‌های واقعی، فایل‌های MDX جایگزین با کاورهای گرادیانی و متن قابل ویرایش فعال هستند."
            : "Until real projects arrive, editable MDX placeholders power the portfolio grid and detail pages."
        }
      />
      <WorkGrid locale={locale} studies={studies} />
    </main>
  );
}
