import { ContactForm } from '@/components/forms';
import { ContactFAQ } from '@/components/sections';
import { SectionReveal } from '@/components/motion';
import { GlassCard, GradientText, Heading } from '@/components/ui';
import { pageContent } from '@/lib/pages';
import type { Locale } from '@/types/locale';
import { cn } from '@/lib/utils';

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const hero = pageContent.contact.hero[locale];
  const faq = pageContent.contact.faq;

  // TODO: Replace with real contact handles
  const contactLinks = [
    { type: 'email', label: isFa ? 'ایمیل' : 'Email', value: '', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { type: 'telegram', label: isFa ? 'تلگرام' : 'Telegram', value: '', icon: 'M21 5L2 12.5l7 1M21 5l-2.5 15L9 13M21 5L9 13m0 0l1 5.5M9 13l4.5 4.5' },
    { type: 'whatsapp', label: isFa ? 'واتساپ' : 'WhatsApp', value: '', icon: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z' },
    { type: 'bale', label: isFa ? 'بله' : 'Bale', value: '', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  ].filter(link => link.value); // Only show links with real values

  const nextSteps = isFa
    ? ['۱. درخواست شما را بررسی می‌کنیم', '۲. یک پیشنهاد شفاف با قیمت و زمان‌بندی ارسال می‌کنیم', '۳. اگر تأیید کردید، شروع می‌کنیم']
    : ['1. We review your request', '2. We send a clear proposal with price and timeline', '3. Once confirmed, we get to work'];

  return (
    <main>
      {/* Section Header - centered intro */}
      <section className="relative px-5 pb-12 pt-36 sm:px-8 sm:pb-16 sm:pt-40 lg:px-12 lg:pb-20 lg:pt-44">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-primary/10 blur-3xl"
        />
        <SectionReveal className="mx-auto max-w-5xl text-center">
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
          <p
            className={cn(
              'mx-auto mt-6 max-w-3xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8',
              isFa && 'text-center'
            )}
            dir={isFa ? 'rtl' : 'ltr'}
          >
            {hero.body}
          </p>
        </SectionReveal>
      </section>

      {/* Two-column layout: Form + Contact info */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left column - Form */}
          <GlassCard glow="magenta">
            <ContactForm locale={locale} />
          </GlassCard>

          {/* Right column - Contact links + What happens next */}
          <div className="space-y-6">
            {/* Direct contact links */}
            {contactLinks.length > 0 && (
              <div className="space-y-3">
                {contactLinks.map((link) => (
                  <a
                    key={link.type}
                    href={link.type === 'email' ? `mailto:${link.value}` : link.value}
                    target={link.type !== 'email' ? '_blank' : undefined}
                    rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-glass border border-glass-border bg-glass-bg p-4 shadow-glass-lift backdrop-blur-xl transition duration-300 hover:border-cyan-primary/30 hover:bg-white/[0.06] motion-reduce:transition-none"
                    dir={isFa ? 'rtl' : 'ltr'}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-cyan-primary" fill="none" aria-hidden="true">
                      <path d={link.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-primary">{link.label}</div>
                      <div className="text-xs text-text-muted" dir="ltr">{link.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* What happens next */}
            <GlassCard glow="violet">
              <h3
                className={cn(
                  'text-lg font-bold text-text-primary',
                  isFa && 'text-right'
                )}
                dir={isFa ? 'rtl' : 'ltr'}
              >
                {isFa ? 'مراحل بعدی' : 'What happens next'}
              </h3>
              <ul
                className={cn(
                  'mt-4 space-y-3 text-sm leading-7 text-text-muted',
                  isFa && 'text-right'
                )}
                dir={isFa ? 'rtl' : 'ltr'}
              >
                {nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FAQ - with gradient top border */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div
          className="h-px w-full"
          style={{
            background: 'linear-gradient(to right, #3FE8F4, #9D5CFF, #E63CD8)',
          }}
        />
      </div>
      <ContactFAQ items={faq} locale={locale} />
    </main>
  );
}
