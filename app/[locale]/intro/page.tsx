import {
  FinalCta,
  IntroHeroSection,
  ProcessTimeline,
  SectionHeader,
  ServiceCards,
  TrustBar,
  WorkGrid,
} from "@/components/sections";
import { GlassCard, SectionHeading } from "@/components/ui";
import { getCaseStudies } from "@/lib/content";
import { pageContent } from "@/lib/pages";
import type { Locale } from "@/types/locale";

export default async function IntroPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const studies = getCaseStudies(locale);

  return (
    <main>
      <IntroHeroSection locale={locale} />
      <TrustBar locale={locale} />
      <SectionHeader
        title={
          locale === "fa"
            ? "سه مسیر برای ساخت آینده"
            : "Three ways to build the future"
        }
        body={
          locale === "fa"
            ? "خدمات اصلی هوش‌یار از یک سیستم طراحی و مهندسی مشترک تغذیه می‌شوند."
            : "Hoosh Yar’s core services share one design and engineering system."
        }
      />
      <ServiceCards locale={locale} />
      <SectionHeader
        title={pageContent.home.featuredWorkTitle[locale]}
        body={pageContent.home.featuredWorkIntro[locale]}
      />
      <WorkGrid locale={locale} studies={studies} limit={4} />
      <SectionHeader
        title={
          locale === "fa"
            ? "فرآیند کوتاه، خروجی روشن"
            : "A focused process, clear output"
        }
        body={
          locale === "fa"
            ? "از شناخت تا راه‌اندازی، مسیر همکاری قابل مشاهده و قابل اندازه‌گیری است."
            : "From discovery to launch, the collaboration path stays visible and measurable."
        }
      />
      <ProcessTimeline locale={locale} compact />
      <Testimonials locale={locale} />
      <FinalCta locale={locale} />
    </main>
  );
}

function Testimonials({ locale }: { locale: Locale }) {
  return (
    <section className="px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading>
          {pageContent.home.testimonialsTitle[locale]}
        </SectionHeading>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {pageContent.home.testimonials.map((quote, index) => (
            <GlassCard key={quote.en} glow={index === 0 ? "cyan" : "magenta"}>
              <p className="text-xl leading-9 text-text-primary">
                “{quote[locale]}”
              </p>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.28em] text-text-muted">
                Placeholder testimonial
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
