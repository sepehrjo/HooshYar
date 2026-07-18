import {SectionReveal} from '@/components/motion';
import {Eyebrow, GradientText, Heading, Lead} from '@/components/ui';

export function PageHero({
  eyebrow,
  title,
  body,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  compact?: boolean;
}) {
  const words = title.split(' ');
  const highlight = words.slice(-2).join(' ');
  const start = words.slice(0, -2).join(' ');

  return (
    <section className={`relative px-5 sm:px-8 lg:px-12 ${compact ? 'pb-8 pt-28' : 'pb-16 pt-36'}`}>
      <div aria-hidden="true" className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-primary/10 blur-3xl" />
      <SectionReveal className="mx-auto max-w-5xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading className="mt-6">
          {start} <GradientText>{highlight}</GradientText>
        </Heading>
        <Lead className="mx-auto mt-6">{body}</Lead>
      </SectionReveal>
    </section>
  );
}
