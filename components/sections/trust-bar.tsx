import {AnimatedCounter, SectionReveal} from '@/components/motion';
import {pageContent} from '@/lib/pages';
import type {Locale} from '@/types/locale';

export function TrustBar({locale}: {locale: Locale}) {
  return (
    <section className="px-5 py-8 sm:px-8 lg:px-12">
      <SectionReveal className="mx-auto grid max-w-7xl gap-3 rounded-panel border border-glass-border bg-glass-bg p-4 shadow-glass-lift backdrop-blur-2xl md:grid-cols-3">
        {pageContent.home.trust.map((item) => (
          <div key={item.en} className="rounded-3xl bg-bg-void/40 p-5 text-center">
            <p className="font-heading text-4xl font-bold text-text-primary"><AnimatedCounter value={item.value} suffix={item.suffix} /></p>
            <p className="mt-2 text-sm text-text-muted">{item[locale]}</p>
          </div>
        ))}
      </SectionReveal>
    </section>
  );
}
