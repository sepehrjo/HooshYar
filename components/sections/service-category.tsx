'use client';

import { SectionReveal } from '@/components/motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';
import { ServiceCard } from './service-card';

type AccentColor = 'cyan' | 'violet' | 'magenta';

interface ServiceData {
  slug: string;
  popular?: boolean;
  en: {
    badge?: string;
    problem: string;
    title: string;
    explanation: string;
    deliverables: string[];
    price: string;
  };
  fa: {
    badge?: string;
    problem: string;
    title: string;
    explanation: string;
    deliverables: string[];
    price: string;
  };
}

interface ServiceCategoryProps {
  slug: string;
  accent: AccentColor;
  title: string;
  oneLiner: string;
  services: ServiceData[];
  locale: Locale;
  embedded?: boolean;
}

const accentGlowClasses = {
  cyan: 'shadow-cyan-glow',
  violet: 'shadow-violet-glow',
  magenta: 'shadow-magenta-glow',
} as const;

const accentTextClasses = {
  cyan: 'text-cyan-primary',
  violet: 'text-violet-core',
  magenta: 'text-magenta-glow',
} as const;

const accentBorderClasses = {
  cyan: 'border-cyan-primary/30 hover:border-cyan-primary/50',
  violet: 'border-violet-core/30 hover:border-violet-core/50',
  magenta: 'border-magenta-glow/30 hover:border-magenta-glow/50',
} as const;

const accentBackgroundClasses = {
  cyan: 'bg-cyan-primary/8',
  violet: 'bg-violet-core/8',
  magenta: 'bg-magenta-glow/8',
} as const;

// Icons for each category
const categoryIcons = {
  'ai-services': (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M16 8v16M8 16h16M12 12l-4 4 4 4M20 12l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  automation: (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M8 16h2m12 0h2M16 8v2m0 12v2M12 12l-1.5-1.5M21.5 12L20 12M12 20l-1.5 1.5M20 20l1.5 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'web-development': (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M10 12l-4 4 4 4M22 12l4 4-4 4M18 8l-4 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
} as const;

export function ServiceCategory({
  slug,
  accent,
  title,
  oneLiner,
  services,
  locale,
  embedded = false,
}: ServiceCategoryProps) {
  const isFa = locale === 'fa';
  const icon = categoryIcons[slug as keyof typeof categoryIcons];

  return (
    <section className={embedded ? "px-5 pb-20 sm:px-8 lg:px-12" : "px-5 py-20 sm:px-8 lg:px-12"}>
      <div className="mx-auto max-w-7xl">
        {/* Category Header */}
        <SectionReveal>
          <div
            className={cn(
              'mb-12 flex flex-col items-center gap-4 rounded-2xl border p-8 backdrop-blur-xl transition-all duration-300',
              accentBorderClasses[accent],
              accentBackgroundClasses[accent],
              accentGlowClasses[accent]
            )}
          >
            <div className={cn('flex flex-col items-center gap-4', accentTextClasses[accent])}>
              {icon}
              <h2
                className={cn(
                  'font-heading text-3xl font-bold tracking-wide uppercase md:text-4xl',
                  accentTextClasses[accent],
                  isFa ? 'font-extrabold' : 'font-bold'
                )}
                style={{ letterSpacing: isFa ? 'normal' : '0.1em' }}
              >
                {title}
              </h2>
            </div>
            <p
              className={cn(
                'max-w-2xl text-center text-base leading-7 text-text-muted md:text-lg',
                isFa && 'text-right'
              )}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {oneLiner}
            </p>
          </div>
        </SectionReveal>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const copy = service[locale];
            return (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                accent={accent}
                problem={copy.problem}
                title={copy.title}
                explanation={copy.explanation}
                deliverables={copy.deliverables}
                price={copy.price}
                badge={copy.badge}
                locale={locale}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
