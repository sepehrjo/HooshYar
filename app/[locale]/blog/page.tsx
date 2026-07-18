import { PageHero } from "@/components/sections";
import { GlassCard, SectionHeading } from "@/components/ui";
import { getBlogPosts } from "@/lib/content";
import { pageContent } from "@/lib/pages";
import type { Locale } from "@/types/locale";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const hero = pageContent.blog.hero[locale];
  const posts = getBlogPosts(locale);

  return (
    <main>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="block h-full rounded-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void"
            >
              <GlassCard glow="violet" className="h-full">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-primary">
                  {post.frontmatter.status} · {post.frontmatter.date}
                </p>
                <SectionHeading className="mt-5 text-3xl">
                  {post.frontmatter.title}
                </SectionHeading>
                <p className="mt-4 leading-7 text-text-muted">
                  {post.frontmatter.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-glass-border bg-bg-void/60 px-3 py-1 text-xs text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
