'use client';

import { SectionReveal } from '@/components/motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';

type AccentColor = 'cyan' | 'violet' | 'magenta';

interface ServiceCardProps {
  slug: string;
  accent: AccentColor;
  problem: string;
  title: string;
  explanation: string;
  deliverables: string[];
  price: string;
  badge?: string;
  locale: Locale;
  index: number;
}

const accentColors = {
  cyan: {
    text: 'text-cyan-primary',
    badge: 'bg-cyan-primary/15 border-cyan-primary text-cyan-primary',
    check: 'text-cyan-primary',
    glow: 'before:bg-cyan-primary/20',
  },
  violet: {
    text: 'text-violet-core',
    badge: 'bg-violet-core/15 border-violet-core text-violet-core',
    check: 'text-violet-core',
    glow: 'before:bg-violet-core/20',
  },
  magenta: {
    text: 'text-magenta-glow',
    badge: 'bg-magenta-glow/15 border-magenta-glow text-magenta-glow',
    check: 'text-magenta-glow',
    glow: 'before:bg-magenta-glow/20',
  },
} as const;

const borderClasses = {
  cyan: 'service-card-animated-border-cyan',
  violet: 'service-card-animated-border-violet',
  magenta: 'service-card-animated-border-magenta',
} as const;

const glowClasses = {
  cyan: 'hover:shadow-cyan-glow',
  violet: 'hover:shadow-violet-glow',
  magenta: 'hover:shadow-magenta-glow',
} as const;

export function ServiceCard({
  slug,
  accent,
  problem,
  title,
  explanation,
  deliverables,
  price,
  badge,
  locale,
  index,
}: ServiceCardProps) {
  const isFa = locale === 'fa';
  const colors = accentColors[accent];

  return (
    <SectionReveal transition={{ delay: index * 0.1, duration: 0.65 }}>
      <div
        className="group/service-card service-card-enter h-full"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Badge - positioned outside and above the card */}
        {/* Reserve space for badge on all cards to maintain alignment */}
        <div className={cn("mb-2 flex", isFa ? "justify-start" : "justify-start")} style={{ minHeight: '28px' }}>
          {badge ? (
            <span
              className={cn(
                'inline-block rounded-full border px-3 py-1 text-xs font-semibold',
                colors.badge
              )}
            >
              {badge}
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            'service-card-shell relative flex h-full flex-col overflow-hidden rounded-glass bg-glass-bg p-6 shadow-glass-lift backdrop-blur-xl transition duration-300 ease-premium group-hover/service-card:bg-white/[0.055] motion-reduce:transition-none',
            colors.glow,
            glowClasses[accent]
          )}
        >
          {/* Animated border */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 rounded-glass',
              borderClasses[accent]
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
          <div className="relative z-10 flex h-full flex-col">
            {/* Problem statement */}
            <p
              className={cn(
                'text-[15px] font-bold leading-7 text-text-primary md:text-base',
                isFa && 'text-right'
              )}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {problem}
            </p>

            {/* Service title */}
            <h3
              className={cn(
                'mt-3 text-lg font-semibold leading-7 md:text-xl',
                colors.text,
                isFa && 'text-right'
              )}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {title}
            </h3>

            {/* Explanation */}
            <p
              className={cn(
                'mt-2 text-sm leading-7 text-text-muted',
                isFa && 'text-right'
              )}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {explanation}
            </p>

            {/* Deliverables */}
            <ul
              className={cn('mt-4 grid gap-2 text-sm text-text-muted', isFa && 'text-right')}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {deliverables.map((item, i) => (
                <li key={`${slug}-${i}`} className="flex items-start gap-2">
                  <svg
                    className={cn('mt-1 h-4 w-4 shrink-0', colors.check)}
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M13.5 4.5L6.5 11.5L2.5 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mt-auto pt-6">
              <p
                className={cn('text-sm text-text-muted', isFa && 'text-right')}
                dir={isFa ? 'rtl' : 'ltr'}
              >
                <span className="opacity-60">{isFa ? 'قیمت: ' : 'Price: '}</span>
                <span className="font-semibold text-text-primary">{price}</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-4">
              <a
                href={`/${locale}/contact`}
                className={cn(
                  'inline-flex items-center justify-center rounded-full border border-glass-border bg-transparent px-6 py-2.5 text-sm font-medium text-text-primary transition-all duration-300 hover:bg-white/[0.055] hover:border-white/20',
                  isFa && 'w-full'
                )}
              >
                {isFa ? 'درخواست مشاوره' : 'Get a Quote'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
