import {SectionReveal} from '@/components/motion';
import {ButtonLink, GlassCard, GradientText, SectionHeading} from '@/components/ui';
import {pageContent} from '@/lib/pages';
import type {Locale} from '@/types/locale';

export function FinalCta({locale}: {locale: Locale}) {
  const copy = pageContent.home.finalCta[locale];

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-12">
      <SectionReveal className="mx-auto max-w-7xl">
        <GlassCard glow="magenta" className="flex flex-col items-center justify-center overflow-hidden p-8 text-center md:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-primary">HOOSH YAR</p>
          <SectionHeading className="mx-auto mt-5 max-w-3xl text-center">
            <GradientText>{copy.title}</GradientText>
          </SectionHeading>
          <p className="mx-auto mt-5 max-w-2xl text-center leading-8 text-text-muted">{copy.body}</p>
          <ButtonLink href={`/${locale}/contact`} size="lg" className="mt-8">
            {copy.cta}
          </ButtonLink>
        </GlassCard>
      </SectionReveal>
    </section>
  );
}
