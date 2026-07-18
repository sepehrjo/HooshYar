import type {HTMLAttributes} from 'react';
import {cn} from '@/lib/utils';

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  glow?: 'cyan' | 'violet' | 'magenta' | 'none';
};

const glowClasses = {
  cyan: 'before:bg-cyan-primary/20 hover:border-cyan-primary/50',
  violet: 'before:bg-violet-core/20 hover:border-violet-core/50',
  magenta: 'before:bg-magenta-glow/20 hover:border-magenta-glow/50',
  none: 'before:bg-transparent'
};

export function GlassCard({className, glow = 'cyan', children, ...props}: GlassCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-glass border border-glass-border bg-glass-bg p-6 shadow-glass-lift backdrop-blur-xl transition duration-300 ease-premium before:absolute before:inset-x-8 before:-top-16 before:h-32 before:rounded-full before:blur-3xl before:transition-opacity before:duration-300 hover:-translate-y-1 hover:bg-white/[0.055] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
