# Hoosh Yar Content Layer

Phase 4 uses a git-based MDX content system instead of a hosted CMS. This keeps the site launchable without external accounts or API keys, while preserving a clean path to migrate to Sanity/Contentful later.

## Structure

```txt
content/
├── blog/
│   ├── en/*.mdx
│   └── fa/*.mdx
├── case-studies/
│   ├── en/*.mdx
│   └── fa/*.mdx
└── placeholders/
```

## Case study naming

Each case study must have matching EN and FA files with the same slug:

```txt
content/case-studies/en/my-project-slug.mdx
content/case-studies/fa/my-project-slug.mdx
```

Required frontmatter:

```yaml
---
title: "Project title"
summary: "Short grid/card summary"
service: "AI Services"
status: "published" # or "placeholder"
cover: "gradient-block-cyan-violet" # or future asset path
client: "Client name or Placeholder"
year: "2026"
metrics:
  - label: "Time saved"
    value: "40%"
---
```

## Blog naming

Each blog post must have matching EN and FA files with the same slug:

```txt
content/blog/en/post-slug.mdx
content/blog/fa/post-slug.mdx
```

Required frontmatter:

```yaml
---
title: "Post title"
summary: "Short excerpt"
date: "2026-06-30"
status: "published" # or "placeholder"
tags:
  - "AI"
---
```

## Asset convention

Put raw assets in:

```txt
assets/incoming/case-studies/<slug>/
```

Later phases will optimize and move production assets into the app/public structure.
