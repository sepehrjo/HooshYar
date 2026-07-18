import type {HTMLAttributes, ReactNode} from 'react';
import {cn} from '@/lib/utils';

export function Eyebrow({className, ...props}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-mono text-xs font-semibold uppercase tracking-[0.32em] text-cyan-primary',
        className
      )}
      {...props}
    />
  );
}

export function Heading({className, children, ...props}: HTMLAttributes<HTMLHeadingElement> & {children: ReactNode}) {
  return (
    <h1
      className={cn(
        'font-heading text-hero font-bold text-text-primary text-balance',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({className, ...props}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'font-heading text-3xl font-bold tracking-[-0.04em] text-text-primary md:text-5xl',
        className
      )}
      {...props}
    />
  );
}

export function Lead({className, ...props}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('max-w-3xl text-base leading-8 text-text-muted md:text-lg', className)}
      {...props}
    />
  );
}

export function GradientText({className, ...props}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('bg-brand-beam bg-clip-text text-transparent', className)}
      {...props}
    />
  );
}
