'use client';

import { SectionReveal } from '@/components/motion';
import { GradientText, Heading } from '@/components/ui';
import { pageContent } from '@/lib/pages';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';

interface ProcessSectionProps {
  locale: Locale;
}

type AccentColor = 'cyan' | 'violet' | 'magenta';

export function ProcessSection({ locale }: ProcessSectionProps) {
  const isFa = locale === 'fa';
  const hero = pageContent.process.hero[locale];
  const steps = pageContent.process.steps;

  // Assign accent colors: شناخت=cyan, راه‌حل=violet, ساخت=magenta
  const stepAccents: Array<AccentColor> = ['cyan', 'violet', 'magenta'];

  return (
    <div>
      {/* Section Header - matching Services/Portfolio pattern */}
      <section className="relative px-5 pb-12 pt-36 sm:px-8 sm:pb-16 sm:pt-40 lg:px-12 lg:pb-20 lg:pt-44">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-primary/10 blur-3xl"
        />
        <SectionReveal className="mx-auto max-w-5xl text-center">
          {/* Gradient label */}
          <Heading className="text-5xl sm:text-6xl lg:text-7xl">
            <GradientText
              style={{
                fontWeight: 800,
                letterSpacing: isFa ? 'normal' : '-0.065em',
              }}
            >
              {hero.eyebrow}
            </GradientText>
          </Heading>
          {/* Title */}
          <h3
            className={cn(
              'mx-auto mt-6 max-w-3xl font-heading text-2xl font-bold leading-tight text-text-primary sm:text-3xl',
              isFa && 'text-center'
            )}
            dir={isFa ? 'rtl' : 'ltr'}
          >
            {hero.title}
          </h3>
          {/* Subhead */}
          <p
            className={cn(
              'mx-auto mt-4 max-w-3xl text-sm leading-7 text-text-muted sm:text-base sm:leading-8',
              isFa && 'text-center'
            )}
            dir={isFa ? 'rtl' : 'ltr'}
          >
            {hero.body}
          </p>
        </SectionReveal>
      </section>

      {/* Process Cards with Horizontal Timeline */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          {/* Timeline container */}
          <div className="relative">
            {/* Horizontal gradient line - desktop */}
            <div
              aria-hidden="true"
              className={cn(
                'absolute left-1/2 top-8 hidden h-0.5 w-[75%] -translate-x-1/2 opacity-50 md:block',
                isFa
                  ? 'bg-gradient-to-l from-cyan-primary via-violet-core to-magenta-glow'
                  : 'bg-gradient-to-r from-cyan-primary via-violet-core to-magenta-glow'
              )}
            />

            {/* Vertical gradient line - mobile */}
            <div
              aria-hidden="true"
              className="absolute left-8 top-16 h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-cyan-primary via-violet-core to-magenta-glow opacity-50 md:hidden"
            />

            {/* Cards Grid */}
            <div className="grid gap-12 md:grid-cols-3 md:gap-6">
              {steps.map((step, index) => {
                const stepCopy = step[locale];
                const accent = stepAccents[index];
                const colors = {
                  cyan: {
                    text: 'text-cyan-primary',
                    bg: 'bg-cyan-primary/[0.08]',
                    glow: 'before:bg-cyan-primary/30',
                  },
                  violet: {
                    text: 'text-violet-core',
                    bg: 'bg-violet-core/[0.08]',
                    glow: 'before:bg-violet-core/30',
                  },
                  magenta: {
                    text: 'text-magenta-glow',
                    bg: 'bg-magenta-glow/[0.08]',
                    glow: 'before:bg-magenta-glow/30',
                  },
                }[accent];

                return (
                  <SectionReveal
                    key={stepCopy.title}
                    transition={{ delay: index * 0.12, duration: 0.65 }}
                  >
                    <div
                      className="group/process-card process-card-enter relative flex flex-col items-center text-center"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      {/* Step number badge */}
                      <div
                        className={cn(
                          'relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-glass-border bg-bg-void font-mono text-2xl font-bold',
                          colors.text,
                          {
                            'shadow-cyan-glow': accent === 'cyan',
                            'shadow-violet-glow': accent === 'violet',
                            'shadow-magenta-glow': accent === 'magenta',
                          }
                        )}
                      >
                        0{index + 1}
                      </div>

                      {/* Card */}
                      <div
                        className={cn(
                          'process-card-shell relative flex h-full min-h-[16rem] w-full flex-col items-center justify-center overflow-hidden rounded-glass p-6 shadow-glass-lift backdrop-blur-xl transition duration-300 ease-premium group-hover/process-card:bg-white/[0.055] motion-reduce:transition-none',
                          colors.bg
                        )}
                      >
                        {/* Animated gradient border */}
                        <div
                          className={cn(
                            'pointer-events-none absolute inset-0 rounded-glass',
                            {
                              'service-card-animated-border-cyan': accent === 'cyan',
                              'service-card-animated-border-violet': accent === 'violet',
                              'service-card-animated-border-magenta': accent === 'magenta',
                            }
                          )}
                          aria-hidden="true"
                        />

                        {/* Top glow */}
                        <div
                          aria-hidden="true"
                          className={cn(
                            'pointer-events-none absolute inset-x-8 -top-16 h-32 rounded-full opacity-60 blur-3xl transition-opacity duration-300',
                            colors.glow
                          )}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                          {/* Title */}
                          <h3
                            className={cn(
                              'font-heading text-2xl font-bold leading-tight tracking-[-0.02em]',
                              colors.text
                            )}
                            dir={isFa ? 'rtl' : 'ltr'}
                          >
                            {stepCopy.title}
                          </h3>

                          {/* Body */}
                          <p
                            className={cn(
                              'mt-4 text-[0.9375rem] leading-relaxed text-text-muted'
                            )}
                            dir={isFa ? 'rtl' : 'ltr'}
                          >
                            {stepCopy.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
