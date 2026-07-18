import { SectionReveal } from "@/components/motion";
import { GlassCard } from "@/components/ui";
import type { MdxContent, CaseStudyFrontmatter } from "@/lib/content";
import type { Locale } from "@/types/locale";

export function WorkGrid({
  locale,
  studies,
  limit,
  embedded = false,
}: {
  locale: Locale;
  studies: Array<MdxContent<CaseStudyFrontmatter>>;
  limit?: number;
  embedded?: boolean;
}) {
  const visibleStudies = limit ? studies.slice(0, limit) : studies;

  return (
    <section
      className={
        embedded ? "px-5 pb-4 sm:px-8 lg:px-12" : "px-5 py-16 sm:px-8 lg:px-12"
      }
    >
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {visibleStudies.map((study, index) => {
          const copy = study.frontmatter;
          return (
            <SectionReveal
              key={study.slug}
              transition={{ delay: index * 0.07, duration: 0.65 }}
            >
              <a
                href={`/${locale}/work/${study.slug}`}
                className="block h-full rounded-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void"
              >
                <GlassCard
                  glow={index % 2 === 0 ? "cyan" : "magenta"}
                  className="h-full p-0"
                >
                  <div className="h-44 rounded-t-glass bg-brand-beam opacity-85" />
                  <div className="p-6">
                    <span className="rounded-full border border-glass-border bg-bg-void/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cyan-primary">
                      {copy.status === "placeholder"
                        ? "Case Study Coming Soon"
                        : copy.service}
                    </span>
                    <h3 className="mt-5 font-heading text-2xl font-bold tracking-[-0.04em] text-text-primary">
                      {copy.title}
                    </h3>
                    <p className="mt-3 leading-7 text-text-muted">
                      {copy.summary}
                    </p>
                  </div>
                </GlassCard>
              </a>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}
