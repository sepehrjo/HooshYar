# Hoosh Yar — Admin Panel Implementation Prompt

Read `HOOSH-YAR-ADMIN-README.md` completely before writing a single line of code. Implement the admin panel exactly as specified. Do not change any existing public-facing page, component, API route (except `/api/chat` where logging is added), design token, or global style.

Build one section at a time in this order, stopping after each to confirm before continuing:

---

## PHASE 1 — Foundation & Auth

1. Install required packages:
```bash
npm install next-auth bcryptjs @vercel/kv
npm install --save-dev @types/bcryptjs
```

2. Create `/middleware.ts` at project root:
- Protect all routes matching `/admin/:path*`
- If no valid NextAuth session → redirect to `/admin/login`
- Public site routes are completely unaffected

3. Create `/app/api/auth/[...nextauth]/route.ts`:
- Credentials provider only
- Validate against `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` (bcrypt compare) from `.env`
- Session strategy: JWT, 24-hour expiry
- No database adapter needed

4. Create `/app/admin/login/page.tsx`:
- Full-page dark background (`#05060F`), same as public site
- Centered glass card (`rgba(255,255,255,0.04)`, `border-radius: 20px`, `backdrop-filter: blur(20px)`)
- Animated border trace (full gradient cyan→violet→magenta, same ~4s loop as moto cards)
- Logo badge (`Hoosh_Yar_Logo.jpeg`, 48px circular) + title `هوش‌یار | Admin` in gradient text
- Username input + password input — same glass input style as Contact page form fields
- Submit button — full gradient background (cyan→magenta), white text, same border-radius as site buttons
- Error state: magenta glow on fields + error message below
- No registration, no forgot password link
- After successful login → redirect to `/admin`

5. Add to `.env.local` (show user exactly what to add):
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=        # bcrypt hash — generate with step below
NEXTAUTH_SECRET=            # run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

6. Add to `robots.txt`:
```
Disallow: /admin
```

**Stop here. Confirm login page renders, login works, and middleware redirects correctly before proceeding.**

---

## PHASE 2 — Admin Layout & Dashboard

1. Create `/app/admin/layout.tsx`:
- Server component — checks session, redirects to login if none
- Renders: fixed sidebar (left, 240px wide) + main content area (right, fills remaining width)
- Demo Mode banner: reads `DEMO_MODE` from KV — if true, shows full-width orange banner `rgba(255,140,0,0.15)` with text `⚠ Demo Mode Active — changes will not be saved`

2. Create `/components/admin/Sidebar.tsx`:
- Fixed left sidebar, full height, `background: rgba(255,255,255,0.03)`, `border-right: 1px solid rgba(255,255,255,0.08)`
- Top: logo badge (32px) + `Admin Panel` in muted text
- Nav items (with Lucide icons):
  - داشبورد (LayoutDashboard icon) → `/admin`
  - محتوا (FileEdit icon) → `/admin/content`
  - لیدها (Inbox icon) → `/admin/leads`
  - چت‌بات (MessageSquare icon) → `/admin/chatbot`
  - تنظیمات (Settings icon) → `/admin/settings`
- Active item: `border-right: 3px solid #3FE8F4` (RTL: border-left), text color `#3FE8F4`
- Inactive: muted `#8A91B0`, hover brightens to `#F2F4FF`
- Bottom: username label + logout button (ghost, magenta on hover)
- Leads nav item shows unread count badge (cyan pill) if unread leads exist

3. Create `/app/admin/page.tsx` (Dashboard):
- Four stat cards in a 2×2 grid using the standard glass card + animated border trace:
  - New Leads Today (cyan accent) — reads from KV
  - Total Leads (violet accent) — reads from KV
  - Chatbot Sessions Today (magenta accent) — reads from KV
  - Last Content Update (muted) — timestamp from KV
- Below: two-column layout
  - Left: Recent Leads (last 5) — name + service tag + relative time
  - Right: Recent Chatbot Sessions (last 5) — FA/EN flag + message count + time
- Quick action buttons row: `مشاهده سایت` (opens `/fa` in new tab) + `Toggle Demo Mode`

**Stop here. Confirm layout, sidebar navigation, and dashboard render correctly.**

---

## PHASE 3 — Leads Manager

1. Create `/app/api/admin/leads/route.ts`:
- `POST`: saves new lead to Vercel KV with key `lead:{timestamp}:{uuid}`, value = `{name, email, service, message, date, status: "new", locale}`
- `GET`: returns all leads sorted by date descending
- Update existing `/app/api/contact/route.ts` (or wherever the contact form submits) to also call this KV save after sending email

2. Create `/app/admin/leads/page.tsx`:
- Full-width data table
- Columns: Date · Name · Email · Service (accent color tag) · Message preview · Status badge
- Status options: New (cyan) / Read (muted) / Replied (violet) — click status to cycle through
- Row click → slide-in detail panel from right (full message + reply button → mailto link)
- Filter bar: All / New / Read / Replied + date range picker + search input
- Export CSV button (top right) — client-side CSV generation from loaded data
- Empty state: neural network SVG pattern + `هنوز لیدی دریافت نشده` in muted text
- Table row hover: `rgba(255,255,255,0.04)` background
- Alternating rows: every other row `rgba(255,255,255,0.02)`

**Stop here. Confirm leads table renders, contact form submissions appear in table.**

---

## PHASE 4 — Chatbot Logs

1. Update `/app/api/chat/route.ts` — add logging (do not change any existing logic):
- After successful Groq response, save to KV: key `chat:{sessionId}:{timestamp}`, value = `{sessionId, userMessage, botReply, locale, timestamp}`
- Session ID: generate on first message, pass from client in request body, client stores in sessionStorage
- If logging fails, silently continue — never let logging break the chat

2. Create `/app/admin/chatbot/page.tsx`:
- Two-panel layout: session list (left, 300px) + conversation view (right)
- Session list: language flag emoji (🇮🇷/🇬🇧) + first message truncated + message count badge + relative timestamp
- Unread sessions (not yet clicked by admin) show cyan left border
- Conversation view: same bubble style as public chatbot (bot bubbles left, user bubbles right), timestamps per message
- Analytics strip at top: total sessions · FA/EN ratio · avg messages/session — simple stat pills
- Flag button per session (star icon, toggles yellow) — for saving interesting conversations
- Empty state: same branded treatment as leads

**Stop here. Confirm chatbot sessions appear after sending test messages on the public site.**

---

## PHASE 5 — Content Manager

1. Create `/app/api/admin/content/route.ts`:
- `GET`: reads content from KV key `content:all` — falls back to `site-content.json` if KV empty
- `PUT`: writes updated field to KV, updates `lastModified` timestamp
- Frontend `site-content.json` reading logic: update to check KV first (server-side), fallback to JSON

2. Create `/app/admin/content/page.tsx`:
- Left panel (280px): tree list of editable sections grouped by page section:
  - 🏠 Hero (4 moto cards)
  - ⚙️ Services (9 service cards — name, description, price per card)
  - 👤 About (origin story, 3 differentiators, 4 principles)
  - 📋 Headlines (section labels and subheads)
  - 📞 Contact (email, Telegram, WhatsApp, Bale, Instagram placeholders)
- Right panel: editor for selected item
  - FA textarea + EN textarea side by side
  - Character count below each
  - Preview strip: renders the text with actual site fonts (Vazirmatn/Space Grotesk)
  - Save button → PUT to `/api/admin/content` → success toast slides in from top-right
  - Reset to default button → restores value from `site-content.json`
- Change history drawer (collapsible, bottom): last 10 edits with undo button per item
- Split preview button (top right): adds iframe showing `/fa` beside editor at 50/50 split

**Stop here. Confirm editing a service price updates it on the public site within seconds.**

---

## PHASE 6 — Settings

Create `/app/admin/settings/page.tsx` with four sections:

**Demo Mode:**
- Large toggle switch (cyan = off, orange = on)
- Saves `DEMO_MODE: true/false` to KV
- Explanation text below toggle

**Social Links & Contact:**
- Input fields: Instagram URL, Telegram handle, WhatsApp number, Bale URL, Email
- Pre-filled from KV (or placeholders if not set)
- Single "Save All" button → updates KV → footer/contact update instantly

**API Status:**
- Groq API key: masked (`gsk_****...****`) + "Test Connection" button → GET `/api/admin/test-groq` → shows ✅ Connected or ❌ Failed with error
- Vercel KV: green/red status dot, auto-checked on page load

**Danger Zone:**
- "پاک کردن لاگ‌های چت‌بات" → confirmation modal → deletes all `chat:*` keys from KV
- "بازنشانی محتوا به پیش‌فرض" → confirmation modal → deletes `content:all` from KV (restores JSON defaults)
- Confirmation modal: glass panel, backdrop blur, red/magenta confirm button, cancel button

---

## DESIGN RULES FOR ALL ADMIN PAGES

- Background: `#05060F` — identical to public site
- All cards: same glass style (`rgba(255,255,255,0.04)`, `border-radius: 12px`, `backdrop-filter: blur(10px)`)
- Stat cards on dashboard: animated border trace (same Prompt A implementation as public site)
- Fonts: Vazirmatn for FA labels, Space Grotesk for EN, same weights as public site
- Color tokens: identical — use the same CSS variables already defined
- Toasts: glass card, slide in from top-right, auto-dismiss after 3s, success=cyan glow / error=magenta glow
- All tables, inputs, buttons follow the existing design system — reuse existing component styles where possible
- Admin is English-primary (labels in EN, since it's a solo internal tool) but FA content fields shown as-is
- No animations as heavy as the public site — keep admin interactions snappy (`0.15-0.2s` transitions max)
- Mobile: sidebar collapses to a hamburger menu — admin is primarily a desktop tool but must be usable on tablet

## DO NOT CHANGE

Any existing public page, section, component, API route output (only add logging to `/api/chat`), color tokens, fonts, global styles, routing for public pages, or the Groq chatbot functionality.
