import { notFound } from "next/navigation";
import { MdxContent } from "@/components/content";
import { FinalCta, PageHero } from "@/components/sections";
import { GlassCard, SectionHeading } from "@/components/ui";
import { getCaseStudies, getCaseStudy, getCaseStudySlugs } from "@/lib/content";
import type { Locale } from "@/types/locale";

export function generateStaticParams() {
  return getCaseStudySlugs().flatMap((slug) => [
    { locale: "en", slug },
    { locale: "fa", slug },
  ]);
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const study = getCaseStudy(locale, slug);

  if (!study) {
    notFound();
  }

  const copy = study.frontmatter;
  const related = getCaseStudies(locale)
    .filter((item) => item.slug !== slug)
    .slice(0, 2);

  return (
    <main>
      <PageHero eyebrow={copy.service} title={copy.title} body={copy.summary} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <MdxContent source={study.source} />
          <aside className="grid gap-5 self-start">
            <GlassCard glow="magenta">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-primary">
                {copy.status}
              </p>
              <SectionHeading className="mt-5 text-3xl">
                {copy.client}
              </SectionHeading>
              <p className="mt-3 text-text-muted">{copy.year}</p>
              <div className="mt-6 grid gap-3">
                {copy.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-glass-border bg-bg-void/60 p-4"
                  >
                    <p className="font-heading text-2xl font-bold text-text-primary">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
            {related.length ? (
              <GlassCard glow="cyan">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-primary">
                  {locale === "fa" ? "مطالعات دیگر" : "More studies"}
                </p>
                <div className="mt-4 grid gap-3">
                  {related.map((item) => (
                    <a
                      key={item.slug}
                      href={`/${locale}/work/${item.slug}`}
                      className="rounded-2xl border border-glass-border bg-bg-void/50 p-4 text-sm text-text-muted transition hover:border-cyan-primary/60 hover:text-text-primary motion-reduce:transition-none"
                    >
                      {item.frontmatter.title}
                    </a>
                  ))}
                </div>
              </GlassCard>
            ) : null}
          </aside>
        </div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
