import { MDXRemote } from "next-mdx-remote/rsc";
import type { HTMLAttributes } from "react";
import { GlassCard, SectionHeading } from "@/components/ui";

const components = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <SectionHeading className="mt-10 text-3xl first:mt-0" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-8 font-heading text-2xl font-bold text-text-primary"
      {...props}
    />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-8 text-text-muted" {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 grid gap-3 text-text-muted" {...props} />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li
      className="leading-7 before:me-2 before:text-cyan-primary before:content-['•']"
      {...props}
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <GlassCard glow="cyan" className="prose-invert max-w-none">
      <MDXRemote source={source} components={components} />
    </GlassCard>
  );
}
