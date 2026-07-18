'use client';

import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';

type AccentColor = 'cyan' | 'violet' | 'magenta';

interface DifferentiatorCardProps {
  title: string;
  body: string;
  accent: AccentColor;
  icon: string;
  locale: Locale;
  index: number;
}

const iconPaths: Record<string, string> = {
  code: 'M16 12h16m-16 8h16M8 8l-4 4 4 4m32-8l4 4-4 4',
  link: 'M20 24h8m-8-8a8 8 0 0 1 8-8h4a8 8 0 0 1 0 16h-4a8 8 0 0 1-8-8Zm0 16a8 8 0 0 0 8 8h4a8 8 0 0 0 0-16h-4a8 8 0 0 0-8 8Z',
  shield: 'M24 42c8-4 16-10 16-20V10L24 6 8 10v12c0 10 8 16 16 20Z',
};

const glowBeforeClasses: Record<AccentColor, string> = {
  cyan: 'bg-cyan-primary/30',
  violet: 'bg-violet-primary/30',
  magenta: 'bg-magenta-primary/30',
};

const iconColorClasses: Record<AccentColor, string> = {
  cyan: 'text-cyan-primary',
  violet: 'text-violet-primary',
  magenta: 'text-magenta-primary',
};

export function DifferentiatorCard({
  title,
  body,
  accent,
  icon,
  locale,
  index,
}: DifferentiatorCardProps) {
  const isFa = locale === 'fa';

  return (
    <div className="group/differentiator-card h-full">
      <div
        className={cn(
          'differentiator-card-shell relative flex h-full min-h-[14rem] flex-col items-center justify-center overflow-hidden rounded-glass bg-glass-bg p-6 text-center shadow-glass-lift backdrop-blur-xl transition duration-300 ease-premium group-hover/differentiator-card:bg-white/[0.055] motion-reduce:transition-none'
        )}
        style={{
          animationDelay: `0s, ${index * 0.15}s`,
        }}
      >
        {/* Animated gradient border - same as moto cards */}
        <div
          className="moto-card-animated-border pointer-events-none absolute inset-0 rounded-glass"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-8 -top-16 h-32 rounded-full opacity-60 blur-3xl transition-opacity duration-300',
            glowBeforeClasses[accent]
          )}
        />
        {/* Icon */}
        <svg
          className={cn(
            'relative mb-4 h-10 w-10 shrink-0',
            iconColorClasses[accent]
          )}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={iconPaths[icon]}
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Title */}
        <h3
          className="relative mb-3 font-heading text-xl font-bold leading-tight tracking-[-0.02em] text-text-primary"
          dir={isFa ? 'rtl' : 'ltr'}
        >
          {title}
        </h3>
        {/* Body */}
        <p
          className="relative text-[0.9375rem] leading-relaxed text-text-muted"
          dir={isFa ? 'rtl' : 'ltr'}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
