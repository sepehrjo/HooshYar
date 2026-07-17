# Hoosh Yar (هوش‌یار) — Website Project Roadmap

> AI Services · Automation · Web Development
> A premium, futuristic, bilingual (EN/FA) digital studio website.

---

## 0. Brand Foundation

**Name:** Hoosh Yar (هوش‌یار) — Persian for "Conscious / Aware Intelligence"
**Core services:**
1. AI Services (custom AI solutions, agents, integrations)
2. Automation (workflow/business process automation)
3. Web Development (custom builds)

**Visual identity — extracted from banner:**

| Token | Value | Usage |
|---|---|---|
| `--bg-void` | `#05060F` | Page background, near-black space |
| `--bg-deep` | `#0A0E1F` | Section backgrounds |
| `--cyan-primary` | `#3FE8F4` | Brain/neural network, primary accent, EN headings |
| `--blue-electric` | `#5B7FFF` | Mid-gradient, links, icons |
| `--violet-core` | `#9D5CFF` | Gradient core, glow accents |
| `--magenta-glow` | `#E63CD8` | Logo right side, CTAs, highlights |
| `--glass-bg` | `rgba(255,255,255,0.04)` | Card backgrounds |
| `--glass-border` | `rgba(255,255,255,0.12)` | Card borders |
| `--text-primary` | `#F2F4FF` | Body text |
| `--text-muted` | `#8A91B0` | Secondary text |

**Typography:**
- Latin: `Space Grotesk` or `Sora` (geometric, futuristic) for headings; `Inter` for body.
- Persian/Farsi: `Vazirmatn` (modern, designed for UI, pairs well with geometric Latin fonts).
- Mono accent (for code/terminal motifs from banner): `JetBrains Mono` or `Fira Code`.

**Visual motifs to carry through the site (from banner):**
- Neural network / node-and-line patterns (as SVG line-art backgrounds, low opacity)
- Glassmorphic floating panels (code editor, terminal, cloud, AI chip cards)
- Glowing gradient edges (cyan → violet → magenta)
- Cracked/floating rock platform → can become a "stage" motif for hero CTA
- 3D robot mascot → potential recurring brand character for empty states, onboarding, chat widget
- Particle/starfield background, parallax dust

---

## 1. Tech Stack

- **Framework:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS + CSS variables for the brand tokens above
- **Animation:** Framer Motion (page/element transitions), GSAP + ScrollTrigger (scroll-driven storytelling, inspired by prypco.com-style reveals), Lenis (smooth scroll)
- **3D/visual flourishes (optional, phase 2):** React Three Fiber for a lightweight neural-network/particle hero background
- **i18n:** `next-intl` or `next-i18next` for EN/FA, with `dir="rtl"` switching for Farsi
- **Forms/leads:** Resend or Formspree/EmailJS for contact & quote forms → later upgrade to a proper CRM webhook
- **CMS (for portfolio/blog):** Sanity.io or Contentful (headless) — lets you update projects/blog without redeploying code; or MDX-based if you prefer git-based content
- **Hosting/Deployment:** Vercel
- **Video:** Self-hosted via Vercel/Cloudflare Stream or Mux for the hero video (better performance/control than raw `<video>` for large files)
- **Analytics:** Vercel Analytics + Plausible/GA4

---

## 2. Sitemap (5–7 pages)

1. **Home (Landing)** — hero video + 4 moto/banner cards, services overview, featured work, CTA
2. **About** — story, mission, the "Hoosh Yar" concept, team/founder
3. **Services** — AI Services / Automation / Web Development, each with sub-sections or anchors
4. **Portfolio / Work** — case studies grid, filterable by service type
5. **Process** — how you work, step-by-step (discovery → build → launch), timeline-style scroll animation
6. **Pricing** — packages/tiers or "request custom quote" structure
7. **Blog** — AI/automation/dev insights (optional at launch, can ship empty + add later)
8. **Contact / Get a Quote** — form, calendar booking link, socials

*(Could merge Process into About or Services if you want exactly 5 pages — flexible.)*

---

## 3. Landing Page Structure (Detailed)

```
┌─────────────────────────────────────────┐
│ Sticky Nav (glass, logo, EN/FA switch)   │
├─────────────────────────────────────────┤
│ HERO                                     │
│  - Full-bleed background video (yours)   │
│  - Dark gradient overlay (brand colors)  │
│  - Animated headline + subhead           │
│  - Primary CTA: "Get a Quote" / "هوش‌یار"  │
│  - 4 floating moto/banner cards around   │
│    hero (glass cards, like banner's      │
│    floating UI panels — AI / </> / Cloud │
│    / Automation icons), each with        │
│    micro-animation on hover/scroll       │
├─────────────────────────────────────────┤
│ TRUST / STATS BAR (animated counters)    │
├─────────────────────────────────────────┤
│ SERVICES OVERVIEW (3 cards: AI,          │
│  Automation, Web Dev) w/ scroll reveal   │
├─────────────────────────────────────────┤
│ FEATURED WORK (horizontal scroll or      │
│  grid, 3-4 case study previews)          │
├─────────────────────────────────────────┤
│ PROCESS TEASER (timeline, 3-4 steps)     │
├─────────────────────────────────────────┤
│ TESTIMONIALS / LOGOS                     │
├─────────────────────────────────────────┤
│ FINAL CTA (gradient glow panel)          │
├─────────────────────────────────────────┤
│ FOOTER (glass, links, socials, EN/FA)    │
└─────────────────────────────────────────┘
```

**The "4 moto/banner" cards** — directly inspired by your banner's floating glass panels (code editor, AI chip, terminal, cloud). Suggest these represent your 4 core value props, e.g.:
1. "AI-Powered" 2. "Automated Workflows" 3. "Custom Built" 4. "Future-Ready"
Each as a small glass card with icon, label, subtle glow border, gentle float animation (idle motion), and parallax on scroll.

---

## 4. Interaction & Motion Plan

- **Page load:** logo/brain network draws itself in (SVG line animation), then fades to hero
- **Scroll-driven reveals:** sections fade/slide up with stagger (Framer Motion `whileInView`)
- **Cursor interactions:** custom cursor glow that follows mouse (subtle, premium feel), magnetic buttons on CTAs
- **Hover states:** glass cards lift + border glow intensifies + slight tilt (3D tilt via `react-parallax-tilt` or custom)
- **Background:** persistent low-opacity particle/neural network canvas, slow drift, reacts subtly to scroll position
- **Page transitions:** smooth fade/slide between routes (Framer Motion `AnimatePresence`)
- **Language switch:** smooth cross-fade + RTL/LTR layout flip, not a jarring reload
- **Micro-interactions:** number counters animating on scroll-into-view, progress bar on Process page, form field focus glows

Inspiration reference (prypco.com): large cinematic hero, confident whitespace, scroll-triggered section reveals, restrained color use against dark/neutral base, clear single CTA hierarchy — we'll apply the same restraint but with your neon palette instead of their muted one.

---

## 5. Phased Roadmap

### Phase 0 — Foundation & Planning *(complete)*
- [x] Finalize sitemap & page count — 7 primary pages plus optional Blog route
- [x] Create asset intake folders (`/assets/incoming`, `/assets/source`)
- [x] Confirm CMS choice for portfolio/blog — git-based MDX for now; CMS can be swapped later
- [x] Set up design tokens (colors, type scale, spacing) as Tailwind-ready config
- [x] Centralize placeholder strategy under `/content/placeholders`

### Phase 1 — Project Setup *(complete)*
- [x] Scaffold Next.js (TypeScript, App Router, Tailwind)
- [x] Configure i18n (EN/FA routing, RTL support)
- [x] Set up folder structure (`/app`, `/components`, `/lib`, `/content`)
- [x] Install motion libraries (Framer Motion, GSAP, Lenis)
- [x] Build design system: buttons, glass cards, typography components, color tokens

### Phase 2 — Core Components *(complete)*
- [x] Navigation (sticky, glass, mobile menu, language switch)
- [x] Hero section with animated placeholder background + 4 floating/value cards
- [x] Reusable: GlassCard, Button/ButtonLink, SectionReveal wrapper, AnimatedCounter
- [x] Background particle/neural canvas component
- [x] Footer
- [x] Temporary inline logo mark until real logo asset is provided

### Phase 3 — Page Build-out *(complete with placeholders where real content is pending)*
- [x] Home (full assembly)
- [x] About
- [x] Services
- [x] Portfolio (grid + individual case study template)
- [x] Process
- [x] Pricing
- [x] Contact (form + validation + email integration-ready API)
- [x] Blog (optional at launch, currently placeholder/MDX-powered)

### Phase 4 — Content & CMS Integration *(complete as MDX-based content layer)*
- [x] Connect portfolio/blog to MDX content files
- [x] Add editable EN/FA case study placeholder MDX files
- [x] Add editable EN/FA blog placeholder MDX files
- [ ] Populate real project case studies — pending owner-provided content/assets
- [ ] Write/finalize EN + FA copy throughout — placeholders currently active

### Phase 5 — Polish & Motion Pass *(complete for current placeholder build)*
- [x] Full animation pass on pages/components built so far (scroll reveals, transitions, hover states)
- [x] Custom cursor glow and magnetic buttons
- [x] Video performance preparation documented (`webm`/`mp4`/poster convention)
- [x] Responsive pass for hero cards/mobile layout
- [x] Accessibility pass: reduced-motion support, skip link, keyboard/focus improvements, form live regions
- [ ] Real hero video compression/lazy-load/poster pass — pending actual video asset

### Phase 6 — Pre-Launch QA *(automated basics complete; manual browser QA pending)*
- [ ] Cross-browser testing — pending manual QA or browser automation tool install
- [ ] Full visual RTL layout QA for all Farsi pages — pending owner/manual review
- [x] Form submission testing — API validates success/error paths; real email delivery pending env vars
- [x] SEO basics (localized metadata baseline, generated OG image, sitemap.xml, robots.txt)
- [ ] Lighthouse performance/accessibility audit — pending manual run in browser/production preview
- [x] QA checklist/report added at `docs/phase-6-qa.md`

### Phase 7 — Deployment
- [ ] Connect repo to Vercel
- [ ] Configure custom domain + SSL
- [ ] Set environment variables (CMS keys, email service keys)
- [ ] Set up analytics
- [ ] Final smoke test on production URL

### Phase 8 — Post-Launch
- [ ] Monitor analytics, form submissions
- [ ] Add blog content cadence
- [ ] Iterate on case studies as new projects complete

---

## 6. Assets Status

- [ ] **Logo** — README originally noted a received `Hoosh_Yar_Logo.jpeg`, but no logo file is currently present in the workspace. The site uses a temporary inline SVG mark. Preferred replacement: `assets/incoming/hoosh-yar-logo-source.svg`.
- [ ] **Hero video** — placeholder until provided. Spec below. Future production files expected at `public/media/hero-video.webm`, `public/media/hero-video.mp4`, and `public/images/hero-poster.jpg` after optimization.
- [ ] **3–4 real project case studies** — MDX placeholder cards/templates exist; real project content/assets pending.
- [ ] **About page bio/story** — placeholder until provided.
- [ ] **Pricing structure** — placeholder custom-quote model until provided.
- [ ] **Copy/taglines (EN+FA)** — placeholder EN/FA copy exists in `/content/placeholders` and MDX files; replace with final approved copy later.
- [ ] **Testimonials/social links/contact details** — placeholders until provided.
- [ ] **Email service credentials** — contact API is ready, but real delivery requires `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and optional `CONTACT_FROM_EMAIL`.

### Hero Video Spec (10 sec)

| Spec | Recommendation |
|---|---|
| Aspect ratio | **16:9** (1920×1080 min, 3840×2160 ideal) — full-bleed hero, crops via `object-fit: cover` on mobile |
| Orientation | Landscape, key visual centered (mobile crops left/right edges) |
| Duration | 10s, seamless loop (first/last frame should match or fade-match) |
| Format | `.mp4` (H.264) source → site will also generate `.webm` + static poster JPG for instant load |
| File size | Aim under ~8–10MB for the 10s clip; further compressed for web regardless |
| Motion style | Slow, ambient (drifting particles, slow push, pulsing glow) — avoid fast cuts since it loops behind text/UI |
| Audio | Not needed — autoplay hero videos are muted by default |

Until the real video is delivered, the site uses an **animated placeholder** (particle/neural canvas background, same dark+gradient treatment) so the layout and motion are fully testable. Phase 5 prepared the production convention for optimized `.webm`/`.mp4` plus poster image; the real video can be swapped in later after compression.

---

## 7. Placeholder Strategy (applies across all phases)

Every piece of missing content gets a clearly marked placeholder so the site is fully functional and demo-able at every phase, and swapping in real content later never requires touching layout/animation code:

- **Hero video** → animated particle/gradient background + dev-only placeholder label; production media convention is documented under `public/media/README.md`
- **Case studies** → editable EN/FA MDX placeholder files under `/content/case-studies/{en,fa}` with gradient-block cover art and "Case Study Coming Soon" tags
- **About bio** → placeholder bio in `/content/placeholders/site-content.json`, clearly editable
- **Pricing** → custom-quote CTA structure by default (safest placeholder; easy to replace with real tiers later)
- **Copy/taglines** → EN/FA placeholder copy exists in `/content/placeholders` and MDX files, marked for review by content status/wording
- **Blog** → editable EN/FA MDX placeholder files under `/content/blog/{en,fa}`
- **Footer/social/contact details** → placeholder until final links/contact info are provided

Placeholder content/assets currently live in `/content/placeholders`, `/content/case-studies`, `/content/blog`, and `/assets/incoming`. Swapping real content should usually be a content/asset edit, not a layout or animation-code change.

---

## 8. Current Next Step

Implementation is complete through **Phase 6**. The owner will now test the current build and request redesign/adjustments if needed.

When ready, the next planned phase is **Phase 7 — Deployment**:

- Connect the repo/project to Vercel
- Configure final domain + SSL
- Set required environment variables (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL`)
- Set up analytics
- Run final production smoke test

Do **not** proceed to Phase 7 until testing/review feedback is complete.
