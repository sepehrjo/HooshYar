# Quick Visual Testing Guide — Header & Footer

Run `npm run dev` and check these items:

## Header (Navigation)

### At Top of Page
- [ ] Background is **fully transparent**
- [ ] No blur effect
- [ ] Logo badge is **48px** circular with violet glow
- [ ] Brand text "هوش‌یار" shows gradient (magenta → violet → cyan, right-to-left)
- [ ] Logo + text click goes to top of page

### After Scrolling 80px Down
- [ ] Background transitions to dark glass: `rgba(5,6,15,0.75)`
- [ ] Blur effect appears (20px)
- [ ] Thin bottom border visible: 1px white at 8% opacity
- [ ] Transition is smooth (0.3s)

### Navigation Links (Center)
- [ ] Links: خانه · درباره ما · خدمات · نمونه‌کارها · فرآیند · تماس
- [ ] Default color: muted gray (#8A91B0)
- [ ] Hover: brightens to white
- [ ] Active section: white text + **2px gradient underline** (cyan→violet→magenta)
- [ ] Underline animates in smoothly

### Right Side (FA) / Left Side (EN)
- [ ] Language toggle pill: FA / EN
- [ ] CTA button: "شروع همکاری" with gradient background
- [ ] CTA links to #contact section

### Mobile (< 1024px)
- [ ] Logo stays 48px
- [ ] Nav links hidden
- [ ] Hamburger menu button shows
- [ ] Logo + language toggle + CTA visible

---

## Footer

### Column 1 (Right on FA, Left on EN) — Brand
- [ ] Logo badge 48px with violet glow (same as header)
- [ ] Brand text "هوش‌یار" with gradient (same as header)
- [ ] Tagline below: "خدمات هوش مصنوعی، اتوماسیون و توسعه وب با هویت آینده‌نگر"
- [ ] 5 social icons in a row: Instagram, Telegram, WhatsApp, Bale (B), Email
- [ ] Icons are 24px with 12px gap
- [ ] Icons animate in with stagger (50ms between each)
- [ ] Hover on icon: brightens to cyan with glow

### Column 2 (Center) — Navigation
- [ ] Label: "صفحات" (11px, bold, uppercase, muted)
- [ ] 6 links: خانه, درباره ما, خدمات, نمونه‌کارها, فرآیند, تماس
- [ ] Link style: 13px, muted, hover to white
- [ ] Links work and scroll to correct sections

### Column 3 (Left on FA, Right on EN) — Contact
- [ ] Label: "تماس با ما" (11px, bold, uppercase, muted)
- [ ] 3 contact items with icons:
  - ایمیل: info@hooshyar.com
  - تلگرام: @hooshyar
  - واتساپ: +98 ...
- [ ] CTA button below: "شروع همکاری" (ghost style)
- [ ] CTA links to #contact

### Bottom Bar
- [ ] Thin divider line at top (1px, white 8% opacity)
- [ ] Left: "© ۱۴۰۵ هوش‌یار" (12px, muted)
- [ ] Right: "ساخته‌شده با هوش و دقت" (12px, italic, muted)

### Background & Effects
- [ ] Background: near-opaque dark `rgba(5,6,15,0.95)`
- [ ] Top border: 1px white 8% opacity
- [ ] Subtle violet glow at top edge (very faint radial gradient)
- [ ] Footer fades up on scroll into view

---

## RTL/LTR Testing

### Switch to English (EN)
- [ ] Language toggle: Click "EN"
- [ ] Logo gradient direction changes (now left-to-right)
- [ ] Header layout flips: logo left, actions right
- [ ] Nav links in English: Home · About · Services · Work · Process · Contact
- [ ] Footer layout flips: brand left, contact right
- [ ] All text in English
- [ ] CTA: "Get Started"

### Back to Farsi (FA)
- [ ] Click "FA" to switch back
- [ ] Logo gradient back to right-to-left
- [ ] All layout and text in Farsi/RTL mode

---

## Responsive Testing

### Desktop (> 1024px)
- [ ] 3-column footer layout
- [ ] Full navigation visible in header
- [ ] All spacing comfortable

### Tablet (640px - 1024px)
- [ ] Footer stacks to single column
- [ ] Header nav hidden, hamburger shows
- [ ] Logo and CTA still visible

### Mobile (< 640px)
- [ ] Footer single column, centered
- [ ] Header compact: logo + hamburger + lang toggle
- [ ] Social icons wrap if needed
- [ ] All text readable

---

## Animation Testing

### Header
- [ ] Scroll transition smooth at 80px mark
- [ ] Active underline fades in (not instant)
- [ ] No jank or flicker

### Footer
- [ ] Social icons stagger in on scroll (check dev tools animations tab)
- [ ] Footer content fades up smoothly
- [ ] Reduced motion: animations disabled in browser settings

---

## Quick Fixes If Needed

**Logo too small?** → Check LogoMark component, h-12 w-12 classes (48px)  
**Wrong gradient direction?** → Check locale condition in LogoMark  
**Footer not RTL?** → Check isRTL condition and order-X classes  
**Social icons not hovering?** → Check hover:text-cyan-primary class  
**Header not sticky?** → Check position: fixed on header element  

---

*Test on Chrome/Safari/Firefox at minimum. Check both FA and EN locales.*