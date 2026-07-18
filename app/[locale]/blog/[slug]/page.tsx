import {notFound} from 'next/navigation';
import {MdxContent} from '@/components/content';
import {FinalCta, PageHero} from '@/components/sections';
import {GlassCard} from '@/components/ui';
import {getBlogPost, getBlogPosts} from '@/lib/content';
import type {Locale} from '@/types/locale';

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const locale of ['en', 'fa'] as const) {
    for (const post of getBlogPosts(locale)) {
      slugs.add(post.slug);
    }
  }

  return [...slugs].flatMap((slug) => [
    {locale: 'en', slug},
    {locale: 'fa', slug}
  ]);
}

export default async function BlogPostPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const post = getBlogPost(locale, slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <PageHero eyebrow={post.frontmatter.date} title={post.frontmatter.title} body={post.frontmatter.summary} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-6">
          <GlassCard glow="violet">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-primary">{post.frontmatter.status}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-glass-border bg-bg-void/60 px-3 py-1 text-xs text-text-muted">{tag}</span>
              ))}
            </div>
          </GlassCard>
          <MdxContent source={post.source} />
        </div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
