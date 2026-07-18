import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {Locale} from '@/types/locale';

const rootDirectory = process.cwd();

type ContentKind = 'case-studies' | 'blog';

type RawFrontmatter = Record<string, unknown>;

export type ContentStatus = 'published' | 'placeholder' | 'draft';

export type CaseStudyFrontmatter = {
  title: string;
  summary: string;
  service: string;
  status: ContentStatus;
  cover: string;
  client: string;
  year: string;
  metrics: Array<{label: string; value: string}>;
};

export type BlogFrontmatter = {
  title: string;
  summary: string;
  date: string;
  status: ContentStatus;
  tags: string[];
};

export type MdxContent<TFrontmatter> = {
  slug: string;
  locale: Locale;
  frontmatter: TFrontmatter;
  source: string;
};

function contentDirectory(kind: ContentKind, locale: Locale) {
  return path.join(rootDirectory, 'content', kind, locale);
}

function assertString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function assertStatus(value: unknown): ContentStatus {
  return value === 'published' || value === 'draft' || value === 'placeholder' ? value : 'placeholder';
}

function parseMetrics(value: unknown): Array<{label: string; value: string}> {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    if (!item || typeof item !== 'object') {
      return {label: '', value: ''};
    }

    const metric = item as RawFrontmatter;
    return {
      label: assertString(metric.label),
      value: assertString(metric.value)
    };
  }).filter((metric) => metric.label && metric.value);
}

function parseTags(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function parseCaseStudyFrontmatter(data: RawFrontmatter): CaseStudyFrontmatter {
  return {
    title: assertString(data.title, 'Untitled case study'),
    summary: assertString(data.summary),
    service: assertString(data.service),
    status: assertStatus(data.status),
    cover: assertString(data.cover, 'gradient-block-cyan-violet'),
    client: assertString(data.client, 'Placeholder Client'),
    year: assertString(data.year, '2026'),
    metrics: parseMetrics(data.metrics)
  };
}

function parseBlogFrontmatter(data: RawFrontmatter): BlogFrontmatter {
  return {
    title: assertString(data.title, 'Untitled post'),
    summary: assertString(data.summary),
    date: assertString(data.date, '2026-06-30'),
    status: assertStatus(data.status),
    tags: parseTags(data.tags)
  };
}

function readMdxFiles<TFrontmatter>(kind: ContentKind, locale: Locale, parseFrontmatter: (data: RawFrontmatter) => TFrontmatter): Array<MdxContent<TFrontmatter>> {
  const directory = contentDirectory(kind, locale);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.mdx'))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(directory, file), 'utf8');
      const {data, content} = matter(raw);

      return {
        slug,
        locale,
        frontmatter: parseFrontmatter(data),
        source: content.trim()
      };
    });
}

export function getCaseStudies(locale: Locale) {
  return readMdxFiles('case-studies', locale, parseCaseStudyFrontmatter);
}

export function getCaseStudy(locale: Locale, slug: string) {
  return getCaseStudies(locale).find((study) => study.slug === slug);
}

export function getCaseStudySlugs() {
  const slugs = new Set<string>();
  for (const locale of ['en', 'fa'] as const) {
    for (const study of getCaseStudies(locale)) {
      slugs.add(study.slug);
    }
  }
  return [...slugs].sort();
}

export function getBlogPosts(locale: Locale) {
  return readMdxFiles('blog', locale, parseBlogFrontmatter).sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getBlogPost(locale: Locale, slug: string) {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}
