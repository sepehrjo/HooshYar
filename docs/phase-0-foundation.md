# Phase 0 — Foundation & Planning

## Scope from README

- Finalize sitemap & page count
- Collect/organize assets: hero video, logo, project case study content, copywriting EN + FA
- Confirm CMS choice for portfolio/blog
- Set up design tokens as a Tailwind-ready config

## Confirmed brand direction

Hoosh Yar (هوش‌یار) is a premium, futuristic, bilingual digital studio for:

1. AI Services
2. Automation
3. Web Development

The visual system must stay close to the banner/logo aesthetic:

- Dark space backgrounds using `#05060F` and `#0A0E1F`
- Cyan → blue → violet → magenta gradients
- Glassmorphic panels with soft borders and glow
- Neural network / node-and-line motifs
- Floating code/cloud/AI/automation interface cards
- Subtle starfield/particle depth
- Smooth premium motion with `prefers-reduced-motion` respected

## Final sitemap for implementation

The README lists 8 routes with Blog optional. For implementation, Phase 0 locks the launch sitemap as 7 primary pages plus an optional Blog route that can ship empty later if desired:

1. Home `/`
2. About `/about`
3. Services `/services`
4. Work / Portfolio `/work`
5. Process `/process`
6. Pricing `/pricing`
7. Contact / Get a Quote `/contact`
8. Blog `/blog` — optional, placeholder-only until content cadence is ready

All pages must support EN/FA and LTR/RTL routing from the start.

## CMS decision

Default Phase 0 decision: **start with local structured content + MDX-ready architecture**, then integrate a hosted CMS only if frequent non-developer edits are required.

Reasoning:

- No external account, API key, or monthly service dependency is required for early phases.
- Placeholder strategy in `/content/placeholders` works naturally with local structured content.
- Portfolio/blog can later migrate to Sanity or Contentful in Phase 4 without changing the visual component system.

Open confirmation for owner: if you already know you want Sanity or Contentful, replace this decision before Phase 4.

## Asset intake structure

- `assets/incoming/` — raw assets provided by owner before optimization
- `assets/source/` — editable/source design assets retained for reference
- `content/placeholders/` — all missing real content represented as bilingual placeholder data

## Current asset status

| Asset | Status | Expected location / format |
|---|---|---|
| Logo | Missing from workspace; README says received | Put source in `assets/incoming/hoosh-yar-logo-source.svg` if possible, or PNG/JPEG if SVG is unavailable |
| Hero video | Missing | `assets/incoming/hero-video.mp4`, 16:9, 10 sec, H.264, seamless loop |
| Case studies | Placeholder | Add each real study under `assets/incoming/case-studies/<slug>/` plus EN/FA text |
| About bio/story | Placeholder | Replace `about` in `content/placeholders/site-content.json` |
| Pricing | Placeholder custom quote | Replace `pricing` in `content/placeholders/site-content.json` or add tiers later |
| Copy/taglines | Placeholder EN/FA drafted | Replace relevant sections in `content/placeholders/site-content.json` |

## Phase 0 deliverables created

- `design/brand-tokens.json` — source-of-truth brand tokens
- `design/tailwind-brand-preset.cjs` — Tailwind-ready token preset for Phase 1
- `content/placeholders/site-content.json` — centralized bilingual placeholder content
- `content/placeholders/README.md` — content replacement rules and asset expectations
- `assets/incoming/` and `assets/source/` — asset intake folders

## Notes for Phase 1

- Scaffold Next.js with App Router, TypeScript, Tailwind.
- Import or merge `design/tailwind-brand-preset.cjs` into `tailwind.config`.
- Configure EN/FA route structure and set document direction per locale.
- Use `content/placeholders/site-content.json` as initial content source.
