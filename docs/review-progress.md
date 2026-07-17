# Hoosh Yar — Review Progress

> Track page-by-page review and completion status.

---

## Pages Checklist

### 1. Home (Landing) ✅ COMPLETE

- [x] Hero section with video frame placeholder
- [x] 4 moto cards with animated gradient border (cyan → violet → magenta)
- [x] Scroll-snap sections for all page previews
- [x] Trust/stats bar with animated counters
- [x] Services overview section
- [x] Featured work grid (case study placeholders)
- [x] Process timeline teaser
- [x] Pricing preview cards
- [x] Contact form section
- [x] Footer
- [x] Responsive layout (mobile/tablet/desktop)
- [x] RTL support for Farsi
- [x] Reduced motion support
- [x] Accessibility basics (skip link, focus states)

**Notes:**
- Animated gradient border on moto cards completed (4s loop, 2px stroke)
- Hero video placeholder ready for real asset

---

### 2. About ✅ COMPLETE

- [x] Hero statement with gradient text
- [x] Origin story section (two-column layout)
- [x] Three differentiator cards with animated gradient borders
- [x] Four principle cards (flat glass tiles)
- [x] Stats bar with animated counters
- [x] Final CTA section
- [x] Responsive layout (mobile/tablet/desktop)
- [x] RTL support for Farsi
- [x] Reduced motion support
- [x] Scroll reveal animations

**Status:** Complete

**Notes:**
- Reused moto-card-animated-border animation for differentiator cards
- All sections use existing design tokens and glass-morphism style
- Secondary CTA links to /services as specified

---

### 3. Services ✅ COMPLETE

- [x] Page hero section
- [x] Service cards (AI, Automation, Web Dev)
- [x] Service detail sections
- [x] Responsive layout
- [x] RTL support
- [x] Reduced motion support

**Status:** Complete

---

### 4. Work / Portfolio ✅ COMPLETE

- [x] Embedded portfolio section with id="portfolio" anchor
- [x] Section header with gradient text matching Services/About
- [x] 6 project cards with real images and optimized performance
- [x] Interactive image slideshow (auto-advance + manual navigation)
- [x] Project categories with accent colors (AI, Automation, Web Dev)
- [x] Tech tag chips and demo links
- [x] Responsive layout (mobile/tablet/desktop)
- [x] RTL support for Farsi
- [x] Reduced motion support
- [x] Animated gradient borders

**Status:** Complete

**Notes:**
- 6 projects: Telegram Bot, Ariana B2B, Armco, AI Outreach, Portfolio OS, FORMA Studio
- All images optimized (600px, 70% quality, ~530KB total)
- Section embedded in main scroll page at #portfolio
- Demo links for Ariana B2B, Armco, and FORMA Studio

---

### 5. Process ✅ COMPLETE (Embedded)

- [x] Embedded as scroll section with id="process"
- [x] Gradient header matching Services/Portfolio pattern
- [x] Horizontal connecting timeline (gradient line)
- [x] 3 step cards with animated borders and centered text
- [x] Step 02 title updated: راه‌حل (Solution)
- [x] All step body copy rewritten for credibility
- [x] Responsive layout (3-col desktop → 1-col mobile)
- [x] RTL support with timeline direction reversal
- [x] Reduced motion support
- [x] Navigation smooth-scrolls to #process
- [x] Standalone /process redirects to /#process

**Status:** Complete and embedded

**Notes:**
- Embedded in main scroll page after Portfolio, before Contact
- Gradient header (فرآیند/Process) with 800 weight matching خدمات
- Horizontal timeline with cyan→violet→magenta gradient (RTL aware)
- 3 cards: شناخت (cyan), راه‌حل (violet), ساخت (magenta)
- Step 02 changed from معماری to راه‌حل with new body copy
- All cards use centered glass card pattern with animated single-color borders
- Navigation already configured via SectionNavLink

---

### 7. Contact

- [ ] Page hero section
- [ ] Contact form with validation
- [ ] API endpoint ready
- [ ] Before-you-send guidance card
- [ ] Responsive layout
- [ ] RTL support
- [ ] Reduced motion support

**Status:** Pending review

---

### 8. Blog (Optional)

- [ ] Blog listing page
- [ ] Individual blog post template (MDX-powered)
- [ ] Responsive layout
- [ ] RTL support

**Status:** Placeholder only — pending content

---

## Global Components

- [x] Navigation (sticky, glass effect, language switch)
- [x] Footer
- [x] Custom cursor glow
- [x] Neural background
- [x] Smooth scroll provider (Lenis)
- [x] Skip link (accessibility)

---

## Assets Pending

| Asset | Status | Location |
|-------|--------|----------|
| Logo | Missing | Expected: `assets/incoming/hoosh-yar-logo-source.svg` |
| Hero video | Placeholder | Expected: `public/media/hero-video.mp4` |
| Case studies | Placeholder | `content/case-studies/{en,fa}/*.mdx` |
| Real copy (EN/FA) | Placeholder | `content/placeholders/site-content.json` |

---

## Deployment Checklist

- [ ] Connect repo to Vercel
- [ ] Configure custom domain + SSL
- [ ] Set environment variables:
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] `RESEND_API_KEY`
  - [ ] `CONTACT_TO_EMAIL`
  - [ ] `CONTACT_FROM_EMAIL` (optional)
- [ ] Set up analytics
- [ ] Final production smoke test

---

## Review History

| Date | Page | Changes |
|------|------|---------|
| 2026-07-01 | Process | Embedded in main scroll page: gradient header, horizontal timeline, 3 centered cards, راه‌حل title, new body copy |
| 2026-07-01 | Process | Complete rebuild: gradient header, 3 process cards with animated borders, RTL support |
| 2026-07-01 | Portfolio | Complete: 6 projects, optimized images, interactive slideshow, gradient header |
| 2026-07-01 | About | Complete rebuild: hero statement, origin story, differentiators, principles, stats, CTA |
| 2026-07-01 | Services | Fixed خدمات gradient (RTL direction), centered final CTA text |
| 2026-07-01 | Services | Marked complete after review |
| 2026-06-30 | Home | Added animated gradient border to moto cards |
| 2026-06-30 | Home | Marked complete after review |

---

*Last updated: 2026-07-01*
