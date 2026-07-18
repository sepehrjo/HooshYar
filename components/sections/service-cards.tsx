import {SectionReveal} from '@/components/motion';
import {GlassCard, SectionHeading} from '@/components/ui';
import {siteContent} from '@/lib/pages';
import type {Locale} from '@/types/locale';

const serviceMeta = {
  'ai-services': {glow: 'cyan', code: 'AI.AGENTS'},
  automation: {glow: 'violet', code: 'FLOW.RUN'},
  'web-development': {glow: 'magenta', code: 'WEB.BUILD'}
} as const;

export function ServiceCards({
  locale,
  detailed = false,
  embedded = false,
}: {
  locale: Locale;
  detailed?: boolean;
  embedded?: boolean;
}) {
  return (
    <section
      className={
        embedded ? "px-5 pb-4 sm:px-8 lg:px-12" : "px-5 py-16 sm:px-8 lg:px-12"
      }
    >
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {siteContent.services.map((service, index) => {
          const meta = serviceMeta[service.slug as keyof typeof serviceMeta];
          const copy = service[locale];

          return (
            <SectionReveal key={service.slug} transition={{delay: index * 0.08, duration: 0.65}}>
              <GlassCard glow={meta.glow} className="h-full">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-primary">{meta.code}</p>
                <SectionHeading className="mt-5 text-3xl">{copy.title}</SectionHeading>
                <p className="mt-4 leading-7 text-text-muted">{copy.description}</p>
                {detailed ? (
                  <ul className="mt-6 grid gap-3 text-sm text-text-muted">
                    <li>• {locale === 'fa' ? 'طراحی دامنه و معماری راهکار' : 'Solution architecture and scope design'}</li>
                    <li>• {locale === 'fa' ? 'پیاده‌سازی با تمرکز روی عملکرد' : 'Performance-focused implementation'}</li>
                    <li>• {locale === 'fa' ? 'تحویل قابل توسعه و قابل اندازه‌گیری' : 'Measurable, maintainable delivery'}</li>
                  </ul>
                ) : null}
              </GlassCard>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}
