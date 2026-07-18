'use client';

import { SectionReveal } from '@/components/motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';
import { useState, useEffect, useMemo } from 'react';

type AccentColor = 'cyan' | 'violet' | 'magenta';

interface PortfolioCardProps {
  slug: string;
  accent: AccentColor;
  category: {
    en: string;
    fa: string;
  };
  title: {
    en: string;
    fa: string;
  };
  description: {
    en: string;
    fa: string;
  };
  tags: string[];
  demoUrl?: string;
  images?: string[];
  locale: Locale;
  index: number;
}

const accentColors = {
  cyan: {
    text: 'text-cyan-primary',
    category: 'bg-cyan-primary/15 border-cyan-primary/30 text-cyan-primary',
    tag: 'bg-cyan-primary/10 text-cyan-primary/90',
    glow: 'hover:shadow-cyan-glow',
    dotActive: 'bg-cyan-primary',
    dotInactive: 'bg-cyan-primary/30',
    placeholderBg: 'bg-cyan-primary/10',
    placeholderIcon: 'text-cyan-primary/60',
  },
  violet: {
    text: 'text-violet-core',
    category: 'bg-violet-core/15 border-violet-core/30 text-violet-core',
    tag: 'bg-violet-core/10 text-violet-core/90',
    glow: 'hover:shadow-violet-glow',
    dotActive: 'bg-violet-core',
    dotInactive: 'bg-violet-core/30',
    placeholderBg: 'bg-violet-core/10',
    placeholderIcon: 'text-violet-core/60',
  },
  magenta: {
    text: 'text-magenta-glow',
    category: 'bg-magenta-glow/15 border-magenta-glow/30 text-magenta-glow',
    tag: 'bg-magenta-glow/10 text-magenta-glow/90',
    glow: 'hover:shadow-magenta-glow',
    dotActive: 'bg-magenta-glow',
    dotInactive: 'bg-magenta-glow/30',
    placeholderBg: 'bg-magenta-glow/10',
    placeholderIcon: 'text-magenta-glow/60',
  },
} as const;

const borderClasses = {
  cyan: 'service-card-animated-border-cyan',
  violet: 'service-card-animated-border-violet',
  magenta: 'service-card-animated-border-magenta',
} as const;

// Project type icons
const projectIcons = {
  'telegram-bot': (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
      <path
        d="M32 8L8 20v16c0 15 10 29 24 32 14-3 24-17 24-32V20L32 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 32l4 4 8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'shahmaghz': (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
      <path d="M32 12c-6 0-16 8-16 20s10 20 16 20 16-8 16-20S38 12 32 12z" stroke="currentColor" strokeWidth="2" />
      <path d="M32 12c-3 4-5 12-5 20s2 16 5 20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 12c3 4 5 12 5 20s-2 16-5 20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 32h28" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  'armco': (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
      <path
        d="M18 48V24l14-8 14 8v24M18 32h28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="28" y="38" width="8" height="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  'ai-outreach': (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
      <circle cx="32" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M32 28v8M24 40l8-4 8 4M20 48l12-8 12 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'portfolio-os': (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
      <rect x="12" y="16" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M12 26h40" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="21" r="1.5" fill="currentColor" />
      <circle cx="24" cy="21" r="1.5" fill="currentColor" />
      <circle cx="30" cy="21" r="1.5" fill="currentColor" />
      <path
        d="M22 34l-4 4 4 4M30 34l4 4-4 4M34 42l4-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'forma': (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden="true">
      <rect x="16" y="12" width="32" height="40" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 20h16M24 28h16M24 36h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="44" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
} as const;

// Neural pattern SVG
const NeuralPattern = () => (
  <svg className="h-full w-full opacity-20" viewBox="0 0 400 300" fill="none">
    <circle cx="80" cy="60" r="4" fill="currentColor" />
    <circle cx="160" cy="80" r="4" fill="currentColor" />
    <circle cx="240" cy="60" r="4" fill="currentColor" />
    <circle cx="320" cy="80" r="4" fill="currentColor" />
    <circle cx="120" cy="150" r="4" fill="currentColor" />
    <circle cx="200" cy="140" r="4" fill="currentColor" />
    <circle cx="280" cy="150" r="4" fill="currentColor" />
    <circle cx="80" cy="220" r="4" fill="currentColor" />
    <circle cx="160" cy="240" r="4" fill="currentColor" />
    <circle cx="240" cy="220" r="4" fill="currentColor" />
    <circle cx="320" cy="240" r="4" fill="currentColor" />
    <line x1="80" y1="60" x2="160" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="160" y1="80" x2="240" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="240" y1="60" x2="320" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="80" y1="60" x2="120" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="160" y1="80" x2="200" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="240" y1="60" x2="280" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="120" y1="150" x2="200" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="200" y1="140" x2="280" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="120" y1="150" x2="160" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="280" y1="150" x2="240" y2="220" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

export function PortfolioCard({
  slug,
  accent,
  category,
  title,
  description,
  tags,
  demoUrl,
  images,
  locale,
  index,
}: PortfolioCardProps) {
  const isFa = locale === 'fa';
  const colors = accentColors[accent];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use provided images or default to placeholders
  const slideImages = useMemo(
    () => images && images.length > 0 ? images : ['placeholder-1', 'placeholder-2', 'placeholder-3'],
    [images]
  );
  const totalSlides = slideImages.length;
  const isSingleImage = totalSlides === 1;
  const isPlaceholder = slideImages[0]?.startsWith('placeholder');
  
  const iconKey = slug as keyof typeof projectIcons;
  const projectIcon = projectIcons[iconKey];

// Auto-advance slideshow only if multiple images and not reduced motion
   useEffect(() => {
    if (isSingleImage) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides, isSingleImage]);

  // Preload first image for faster display
  useEffect(() => {
    if (!isPlaceholder && slideImages[0]) {
      const img = new window.Image();
      img.src = slideImages[0];
    }
  }, [isPlaceholder, slideImages]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <SectionReveal transition={{ delay: index * 0.1, duration: 0.65 }}>
      <div
        className="group/portfolio-card service-card-enter h-full"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div
          className={cn(
            'service-card-shell relative flex h-full flex-col overflow-hidden rounded-glass bg-glass-bg shadow-glass-lift backdrop-blur-xl transition duration-300 ease-premium group-hover/portfolio-card:bg-white/[0.055] motion-reduce:transition-none',
            colors.glow
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

          {/* Image Slideshow */}
          <div className="relative h-[220px] overflow-hidden bg-bg-deep">
            {slideImages.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
                style={{ opacity: currentSlide === idx ? 1 : 0 }}
              >
                {isPlaceholder ? (
                  // Placeholder slides
                  <div className="flex h-full w-full items-center justify-center">
                    {idx === 0 ? (
                      // Slide 1: Gradient with icon
                      <div className={cn('flex h-full w-full items-center justify-center', colors.placeholderBg)}>
                        <div className={colors.placeholderIcon}>{projectIcon}</div>
                      </div>
                    ) : idx === 1 ? (
                      // Slide 2: Neural pattern
                      <div className="flex h-full w-full items-center justify-center bg-bg-deep text-text-muted">
                        <NeuralPattern />
                      </div>
                    ) : (
                      // Slide 3: Tech tags display
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-bg-deep px-8">
                        {tags.slice(0, 4).map((tag, tagIdx) => (
                          <div
                            key={tagIdx}
                            className={cn(
                              'rounded-full px-4 py-2 text-center text-sm font-medium',
                              colors.tag
                            )}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Simple image with object-fit cover - eager loading for slideshow
                  <img
                    src={img}
                    alt={`${title[locale]} - slide ${idx + 1}`}
                    className="h-full w-full object-cover object-top"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                )}
              </div>
            ))}

            {/* Navigation Arrows - only show if multiple images */}
            {!isSingleImage && (
              <>
                <button
                  onClick={prevSlide}
                  className={cn(
                    'absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white',
                    isFa && 'left-auto right-2'
                  )}
                  aria-label={isFa ? 'تصویر قبلی' : 'Previous image'}
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                    <path
                      d={isFa ? 'M6 4l4 4-4 4' : 'M10 4L6 8l4 4'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className={cn(
                    'absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white',
                    isFa && 'left-2 right-auto'
                  )}
                  aria-label={isFa ? 'تصویر بعدی' : 'Next image'}
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                    <path
                      d={isFa ? 'M10 4L6 8l4 4' : 'M6 4l4 4-4 4'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Dot Indicators - only show if multiple images */}
            {!isSingleImage && (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {slideImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all',
                      currentSlide === idx ? colors.dotActive : colors.dotInactive
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="relative z-10 flex flex-1 flex-col p-6">
            {/* Category Tag */}
            <div className={cn('mb-3', isFa ? 'text-right' : 'text-left')}>
              <span
                className={cn(
                  'inline-block rounded-full border px-3 py-1 text-xs font-semibold',
                  colors.category
                )}
              >
                {category[locale]}
              </span>
            </div>

            {/* Title */}
            <h3
              className={cn(
                'text-lg font-bold leading-7 text-text-primary md:text-xl',
                isFa && 'text-right'
              )}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {title[locale]}
            </h3>

            {/* Description */}
            <p
              className={cn(
                'mt-2 text-[13px] leading-6 text-text-muted md:text-sm',
                isFa && 'text-right'
              )}
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {description[locale]}
            </p>

            {/* Tech Tags */}
            <div
              className={cn(
                'mt-4 flex flex-wrap gap-2',
                isFa ? 'justify-end' : 'justify-start'
              )}
            >
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-white/[0.07] px-2 py-1 text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Demo Button */}
            {demoUrl && (
              <div className="mt-auto pt-6">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-full border border-glass-border bg-transparent px-6 py-2.5 text-sm font-medium text-text-primary transition-all duration-300 hover:border-white/20 hover:bg-white/[0.055]',
                    isFa && 'w-full flex-row-reverse'
                  )}
                >
                  <span>{isFa ? 'مشاهده دمو' : 'View Demo'}</span>
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                    <path
                      d={isFa ? 'M10 4L6 8l4 4' : 'M6 4l4 4-4 4'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
