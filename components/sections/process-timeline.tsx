import {SectionReveal} from '@/components/motion';
import {GlassCard, SectionHeading} from '@/components/ui';
import {pageContent} from '@/lib/pages';
import type {Locale} from '@/types/locale';

export function ProcessTimeline({
  locale,
  compact = false,
  embedded = false,
}: {
  locale: Locale;
  compact?: boolean;
  embedded?: boolean;
}) {
  const steps = compact ? pageContent.process.steps.slice(0, 3) : pageContent.process.steps;

  return (
    <section
      className={
        embedded ? "px-5 pb-4 sm:px-8 lg:px-12" : "px-5 py-16 sm:px-8 lg:px-12"
      }
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative grid gap-5">
          <div aria-hidden="true" className="absolute bottom-10 top-10 hidden w-px bg-gradient-to-b from-cyan-primary via-violet-core to-magenta-glow opacity-50 md:left-8 md:block" />
          {steps.map((step, index) => {
            const copy = step[locale];
            return (
              <SectionReveal key={copy.title} transition={{delay: index * 0.09, duration: 0.65}}>
                <div className="grid gap-4 md:grid-cols-[4rem_1fr] md:items-start">
                  <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-glass-border bg-bg-void font-mono text-cyan-primary shadow-cyan-glow">
                    0{index + 1}
                  </div>
                  <GlassCard glow={index % 2 === 0 ? 'cyan' : 'violet'}>
                    <SectionHeading className="text-2xl md:text-3xl">{copy.title}</SectionHeading>
                    <p className="mt-3 leading-7 text-text-muted">{copy.body}</p>
                  </GlassCard>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
