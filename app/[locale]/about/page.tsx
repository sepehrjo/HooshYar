import { DifferentiatorCard, PrincipleCard } from '@/components/sections';
import { SectionReveal } from '@/components/motion';
import { GlassCard, GradientText, Heading } from '@/components/ui';
import { pageContent } from '@/lib/pages';
import type { Locale } from '@/types/locale';
import { cn } from '@/lib/utils';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const content = pageContent.about;

  return (
    <main>
      {/* SECTION 1 — Hero Statement */}
      <section className="relative px-5 pb-12 pt-36 sm:px-8 sm:pb-16 sm:pt-40 lg:px-12 lg:pb-20 lg:pt-44">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-primary/10 blur-3xl"
        />
        <SectionReveal className="mx-auto max-w-5xl text-center">
          <Heading className="text-4xl sm:text-5xl lg:text-6xl">
            <GradientText>{content.hero[locale].title}</GradientText>
          </Heading>
          <p
            className={cn(
              'mx-auto mt-6 max-w-3xl text-base leading-8 text-text-muted sm:text-lg',
              isFa && 'text-center'
            )}
            dir={isFa ? 'rtl' : 'ltr'}
          >
            {content.hero[locale].subtitle}
          </p>
        </SectionReveal>
      </section>

      {/* SECTION 2 — Origin Story */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <SectionReveal className="mx-auto max-w-7xl">
          <GlassCard glow="cyan">
            <div className="flex flex-col items-center justify-center text-center">
              <h2
                className={cn(
                  'font-heading text-3xl font-bold tracking-wide uppercase text-cyan-primary md:text-4xl',
                  isFa ? 'font-extrabold' : 'font-bold'
                )}
                style={{ letterSpacing: isFa ? 'normal' : '0.1em', fontWeight: 800 }}
                dir={isFa ? 'rtl' : 'ltr'}
              >
                {content.origin.label[locale]}
              </h2>
              <div
                className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed text-text-muted sm:text-base sm:leading-8"
                dir={isFa ? 'rtl' : 'ltr'}
              >
                {content.origin.body[locale].split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </GlassCard>
        </SectionReveal>
      </section>

      {/* SECTION 3 — Three Differentiator Cards */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <SectionReveal className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {content.differentiators.map((diff, index) => (
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

      {/* SECTION 4 — How We Work (4 Principles) */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <SectionReveal className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.principles.map((principle, index) => (
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
    </main>
  );
}
