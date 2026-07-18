'use client';

import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';

type AccentColor = 'cyan' | 'violet' | 'magenta';

interface PrincipleCardProps {
  title: string;
  body: string;
  accent: AccentColor;
  icon: string;
  locale: Locale;
}

const iconPaths: Record<string, string> = {
  message: 'M40 10H8a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h8l8 6 8-6h8a4 4 0 0 0 4-4V14a4 4 0 0 0-4-4ZM16 24h16',
  tag: 'M42 24L26 8H10a2 2 0 0 0-2 2v16l16 16 18-18ZM16 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z',
  clock: 'M24 44c11 0 20-9 20-20S35 4 24 4 4 13 4 24s9 20 20 20Zm0-28v12l8 4',
  support: 'M24 44c11 0 20-9 20-20S35 4 24 4 4 13 4 24s9 20 20 20Zm0-12a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
};

const iconColorClasses: Record<AccentColor, string> = {
  cyan: 'text-cyan-primary',
  violet: 'text-violet-primary',
  magenta: 'text-magenta-primary',
};

export function PrincipleCard({
  title,
  body,
  accent,
  icon,
  locale,
}: PrincipleCardProps) {
  const isFa = locale === 'fa';

  return (
    <div
      className={cn(
        'group/principle-card relative flex min-h-[10rem] flex-col items-center justify-center overflow-hidden rounded-glass bg-glass-bg p-5 text-center shadow-glass backdrop-blur-xl transition duration-300 ease-premium hover:bg-white/[0.045] motion-reduce:transition-none'
      )}
    >
      {/* Icon */}
      <svg
        className={cn(
          'mb-3 h-8 w-8 shrink-0 transition-transform duration-300 ease-premium group-hover/principle-card:scale-110',
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
        className="mb-2 font-heading text-base font-bold leading-tight tracking-[-0.01em] text-text-primary"
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {title}
      </h3>
      {/* Body */}
      <p
        className="text-sm leading-relaxed text-text-muted"
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {body}
      </p>
    </div>
  );
}
