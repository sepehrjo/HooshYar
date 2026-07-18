'use client';

import { useState } from 'react';
import { SectionReveal } from '@/components/motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/locale';

interface FAQItem {
  question: { en: string; fa: string };
  answer: { en: string; fa: string };
}

interface ContactFAQProps {
  items: FAQItem[];
  locale: Locale;
}

export function ContactFAQ({ items, locale }: ContactFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isFa = locale === 'fa';

  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <SectionReveal
                key={item.question.en}
                transition={{ delay: index * 0.1, duration: 0.65 }}
              >
                <div className="overflow-hidden rounded-glass border border-glass-border bg-glass-bg shadow-glass-lift backdrop-blur-xl">
                  {/* Question - clickable */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-white/[0.03] motion-reduce:transition-none"
                    aria-expanded={isOpen}
                  >
                    <h3
                      className={cn(
                        'text-base font-bold leading-7 text-text-primary md:text-lg',
                        isFa && 'text-right'
                      )}
                      dir={isFa ? 'rtl' : 'ltr'}
                    >
                      {item.question[locale]}
                    </h3>
                    <svg
                      className={cn(
                        'h-5 w-5 shrink-0 text-text-muted transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Answer - expandable */}
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={cn(
                          'px-6 pb-6 text-sm leading-7 text-text-muted',
                          isFa && 'text-right'
                        )}
                        dir={isFa ? 'rtl' : 'ltr'}
                      >
                        {item.answer[locale]}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
