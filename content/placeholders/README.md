# Hoosh Yar Placeholder Content

This folder is the single source for placeholder content until real launch assets/copy are provided.

## Files

- `site-content.json` — bilingual EN/FA placeholder copy, navigation labels, service text, hero copy, case study placeholders, about placeholder, and pricing placeholder.

## Replacement rules

- Keep every content item bilingual from the start: provide both `en` and `fa` values.
- Keep Farsi content RTL-ready. Code in later phases will set `dir="rtl"` for `fa` routes.
- Replace content here before changing layout code whenever possible.
- Case studies should keep stable `slug` values once published.
- Assets should be placed in `assets/incoming` first for review/optimization, then moved into the app/public asset structure during implementation phases.

## Expected real assets

- Hero video: `assets/incoming/hero-video.mp4`
  - 16:9, 1920×1080 minimum, 10 seconds, seamless loop, muted/no audio required, H.264 `.mp4`, target source size under 8–10MB.
- Logo source: `assets/incoming/hoosh-yar-logo-source.*`
  - SVG preferred. High-resolution PNG/JPEG acceptable if SVG is unavailable.
- Case study images: `assets/incoming/case-studies/<case-study-slug>/`
  - Include cover image, supporting screenshots, and any metrics/results text in EN/FA.
