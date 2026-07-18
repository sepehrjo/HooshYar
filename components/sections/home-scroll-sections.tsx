import { ContactForm } from "@/components/forms";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/motion";
import {
  ContactFAQ,
  DifferentiatorCard,
  LandingSection,
  PortfolioSection,
  PrincipleCard,
  ProcessSection,
  ServiceCategory,
  SnapPanel,
} from "@/components/sections";
import { GlassCard, GradientText, Heading } from "@/components/ui";
import { getContentBundle } from "@/lib/content/loader";
import type { Locale } from "@/types/locale";
import { cn } from "@/lib/utils";

export async function HomeScrollSections({ locale }: { locale: Locale }) {
  const { site, pages } = await getContentBundle();
  const aboutHero = pages.about.hero[locale];
  const contactHero = pages.contact.hero[locale];

  return (
    <>
      <SnapPanel id="home" className="justify-stretch">
        <LandingSection locale={locale} site={site} />
      </SnapPanel>

      <SnapPanel id="about">
        <div className="px-5 sm:px-8 lg:px-12">
          {/* Hero Statement */}
          <section className="relative pb-12 pt-36 sm:pb-16 sm:pt-40 lg:pb-20 lg:pt-44">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-primary/10 blur-3xl"
            />
            <SectionReveal className="mx-auto max-w-5xl text-center">
              <Heading className="text-4xl sm:text-5xl lg:text-6xl">
                <GradientText>{aboutHero.title}</GradientText>
              </Heading>
              <p
                className="mx-auto mt-6 max-w-3xl text-base leading-8 text-text-muted sm:text-lg text-center"
                dir={locale === 'fa' ? 'rtl' : 'ltr'}
              >
                {aboutHero.subtitle}
              </p>
            </SectionReveal>
          </section>

          {/* Origin Story */}
          <section className="py-12 sm:py-16 lg:py-20">
            <SectionReveal className="mx-auto max-w-7xl">
              <GlassCard glow="cyan">
                <div className="flex flex-col items-center justify-center text-center">
                  <h2
                    className={cn(
                      'font-heading text-3xl font-bold tracking-wide uppercase text-cyan-primary md:text-4xl',
                      locale === 'fa' ? 'font-extrabold' : 'font-bold'
                    )}
                    style={{ letterSpacing: locale === 'fa' ? 'normal' : '0.1em', fontWeight: 800 }}
                    dir={locale === 'fa' ? 'rtl' : 'ltr'}
                  >
                    {pages.about.origin.label[locale]}
                  </h2>
                  <div
                    className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed text-text-muted sm:text-base sm:leading-8"
                    dir={locale === 'fa' ? 'rtl' : 'ltr'}
                  >
                    {pages.about.origin.body[locale].split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </SectionReveal>
          </section>

          {/* Differentiator Cards */}
          <section className="py-12 sm:py-16 lg:py-20">
            <SectionReveal className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
              {pages.about.differentiators.map((diff, index) => (
                <DifferentiatorCard
                  key={index}
                  title={diff.title[locale]}
                  body={diff.body[locale]}
                  accent={diff.accent as 'cyan' | 'violet' | 'magenta'}
                  icon={diff.icon}
                  locale={locale}
                  index={index}
                />
              ))}
            </SectionReveal>
          </section>

          {/* Principles */}
          <section className="py-12 sm:py-16 lg:py-20">
            <SectionReveal className="mx-auto max-w-7xl">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {pages.about.principles.map((principle, index) => (
                  <PrincipleCard
                    key={index}
                    title={principle.title[locale]}
                    body={principle.body[locale]}
                    accent={principle.accent as 'cyan' | 'violet' | 'magenta'}
                    icon={principle.icon}
                    locale={locale}
                  />
                ))}
              </div>
            </SectionReveal>
          </section>
        </div>
      </SnapPanel>

      <SnapPanel id="services">
        <div>
          {/* Services section header - single gradient word */}
          <section className="relative px-5 pb-8 pt-36 sm:px-8 lg:px-12">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-primary/10 blur-3xl"
            />
            <SectionReveal className="mx-auto max-w-5xl text-center">
              <h2
                className="font-heading text-5xl font-extrabold md:text-6xl lg:text-7xl"
                style={{
                  background: 'linear-gradient(to left, #3FE8F4, #9D5CFF, #E63CD8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {locale === "fa" ? "خدمات" : "Services"}
              </h2>
            </SectionReveal>
          </section>
          {/* Embed all service categories inline */}
          {site.servicesPage.categories.map((category) => {
            const categoryCopy = category[locale];
            return (
              <ServiceCategory
                key={category.slug}
                slug={category.slug}
                accent={category.accent as 'cyan' | 'violet' | 'magenta'}
                title={categoryCopy.title}
                oneLiner={categoryCopy.oneLiner}
                services={category.services}
                locale={locale}
                embedded
              />
            );
          })}
        </div>
      </SnapPanel>

      <SnapPanel id="portfolio">
        <div>
          <PortfolioSection locale={locale} />
        </div>
      </SnapPanel>

      <SnapPanel id="process">
        <div>
          <ProcessSection locale={locale} />
        </div>
      </SnapPanel>

      <SnapPanel id="contact">
        <div>
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
                    letterSpacing: locale === 'fa' ? 'normal' : '-0.065em',
                  }}
                >
                  {contactHero.eyebrow}
                </GradientText>
              </Heading>
              <p
                className={cn(
                  'mx-auto mt-6 max-w-3xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8',
                  locale === 'fa' && 'text-center'
                )}
                dir={locale === 'fa' ? 'rtl' : 'ltr'}
              >
                {contactHero.body}
              </p>
            </SectionReveal>
          </section>

          {/* Two-column layout: Form + Contact info */}
          <section className="px-5 pb-12 sm:px-8 lg:px-12">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr]">
              {/* Left column - Form */}
              <GlassCard glow="magenta">
                <ContactForm locale={locale} />
              </GlassCard>

              {/* Right column - What happens next */}
              <GlassCard glow="violet">
                <h3
                  className={cn(
                    'text-lg font-bold text-text-primary',
                    locale === 'fa' && 'text-right'
                  )}
                  dir={locale === 'fa' ? 'rtl' : 'ltr'}
                >
                  {locale === 'fa' ? 'مراحل بعدی' : 'What happens next'}
                </h3>
                <ul
                  className={cn(
                    'mt-4 space-y-3 text-sm leading-7 text-text-muted',
                    locale === 'fa' && 'text-right'
                  )}
                  dir={locale === 'fa' ? 'rtl' : 'ltr'}
                >
                  {(locale === 'fa'
                    ? ['۱. درخواست شما را بررسی می‌کنیم', '۲. یک پیشنهاد شفاف با قیمت و زمان‌بندی ارسال می‌کنیم', '۳. اگر تأیید کردید، شروع می‌کنیم']
                    : ['1. We review your request', '2. We send a clear proposal with price and timeline', '3. Once confirmed, we get to work']
                  ).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </section>

          {/* FAQ - with gradient top border */}
          <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-8 lg:px-12">
            <div
              className="h-px w-full"
              style={{
                background: 'linear-gradient(to right, #3FE8F4, #9D5CFF, #E63CD8)',
              }}
            />
          </div>
          <ContactFAQ items={pages.contact.faq} locale={locale} />
        </div>
      </SnapPanel>

      <SnapPanel id="footer" className="min-h-[70vh] justify-end pb-6">
        <Footer locale={locale} site={site} />
      </SnapPanel>
    </>
  );
}
