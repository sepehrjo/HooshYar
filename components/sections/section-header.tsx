import {SectionReveal} from '@/components/motion';
import {Lead, SectionHeading} from '@/components/ui';

export function SectionHeader({title, body}: {title: string; body?: string}) {
  return (
    <SectionReveal className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:px-12">
      <SectionHeading>{title}</SectionHeading>
      {body ? <Lead className="mt-4">{body}</Lead> : null}
    </SectionReveal>
  );
}
