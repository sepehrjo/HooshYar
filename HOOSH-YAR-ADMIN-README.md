# Hoosh Yar Admin Panel — README

---

## Overview

A private, password-protected admin dashboard at `/admin` for managing the Hoosh Yar website. Same design system as the public site (dark space, cyan/violet/magenta palette, glass cards, Vazirmatn/Space Grotesk fonts) but with a sidebar layout optimised for data management. Never linked from the public site. Excluded from search engines via `robots.txt`.

---

## Architecture

### Authentication
- **Provider:** NextAuth.js with Credentials provider
- **Storage:** Single admin account — username + hashed password in `.env.local`
- **Session:** 24-hour expiry, JWT-based
- **Protection:** All `/admin/*` routes protected via Next.js middleware — redirect to `/admin/login` if no valid session
- **No external auth service required**

### Data Storage
- **Provider:** Vercel KV (Redis-compatible key-value store, free tier)
- **What's stored:** Editable site content, contact form submissions, chatbot logs
- **Real-time:** Frontend reads from Vercel KV on every request — changes appear live within seconds, no redeployment needed
- **Fallback:** If KV is unavailable, falls back to `site-content.json` (read-only)

### Demo Mode
- Toggle in Settings panel
- When ON: all save/delete actions show full UI feedback but write nothing to Vercel KV
- Stored in admin session only — never affects public site
- Clearly indicated by an orange "DEMO MODE" banner across the top of every admin page
- Safe to show to clients live

---

## Pages & Sections

### 1. Login (`/admin/login`)
- Full-page, same dark space background as public site
- Centered glass card: logo badge + `هوش‌یار Admin` title
- Username + password fields (same glass input style as Contact form)
- Submit button with gradient (cyan→magenta)
- Error state: red glow on fields + error message
- No "forgot password" (solo use — reset via `.env`)
- Animated border trace on the login card (same as moto cards)

---

### 2. Dashboard (`/admin`)
**Layout:** Sidebar (left, fixed) + main content area (right)

**Sidebar:**
- Logo badge + `Admin Panel` label at top
- Nav items with icons:
  - داشبورد / Dashboard
  - محتوا / Content
  - لیدها / Leads
  - چت‌بات / Chatbot
  - تنظیمات / Settings
- Active item: gradient left border + cyan text
- Bottom: logged-in user label + logout button
- Sidebar background: `rgba(255,255,255,0.03)`, right border `1px solid rgba(255,255,255,0.08)`

**Dashboard Main Content:**
Four stat cards (same glass card style, animated border trace):
- 📥 New Leads Today (count, cyan accent)
- 📊 Total Leads (count, violet accent)
- 💬 Chatbot Sessions Today (count, magenta accent)
- 🕐 Last Content Update (timestamp, muted)

Below stats: two columns
- Left: Recent Leads (last 5, name + service + time, click to open full lead)
- Right: Recent Chatbot Activity (last 5 sessions, language flag + message count + time)

Quick action buttons:
- "مشاهده سایت" → opens public site in new tab
- "Preview Mode" → opens site preview panel (iframe) alongside admin

---

### 3. Content Manager (`/admin/content`)

**Left panel:** Tree of editable sections
- Hero Moto Cards (4 items)
- Services (3 categories × 3 cards = 9 items)
- About Section (origin story, 3 differentiators, 4 principles)
- Section Headlines & Subheads
- Contact Placeholders (email, Telegram, WhatsApp, Bale, Instagram)
- Pricing (per service)

**Right panel:** Inline editor for selected item
- FA field + EN field side by side (both editable)
- Character count indicator
- "Save" button → writes to Vercel KV instantly
- "Reset to default" → restores original value from `site-content.json`
- Live preview strip below each field showing rendered text with actual site fonts/styles

**Split-screen Preview toggle:**
- Button in top-right: "Preview Site"
- Splits the screen: editor left 50%, site iframe right 50%
- Iframe shows the public site — after saving, user can refresh iframe to see change live

**Change History:**
- Last 10 edits shown in a collapsible drawer: field name + old value + new value + timestamp
- "Undo" button per item (restores previous value)

---

### 4. Leads Manager (`/admin/leads`)

**Layout:** Full-width data table

**Table columns:**
- Date/Time
- Name
- Email (clickable → opens mailto)
- Service Requested (tag pill in service accent color)
- Message preview (truncated, click to expand)
- Status (New / Read / Replied — toggleable)

**Features:**
- Filter by: status, service type, date range
- Search by name or email
- Click any row → full lead detail in a slide-in panel (right side)
- Mark as Read / Replied buttons in detail panel
- Reply button → opens default email client with pre-filled recipient
- Export to CSV button (top right)
- Unread leads show a cyan dot indicator in sidebar nav badge

**Empty state:** Branded illustration (neural network pattern) + "هنوز لیدی دریافت نشده"

**Storage:** Each form submission POSTs to `/api/leads` → saves to Vercel KV with timestamp key

---

### 5. Chatbot Logs (`/admin/chatbot`)

**Layout:** Session list (left) + conversation view (right)

**Session list:**
- Each session: language flag (FA/EN) + first message preview + message count + timestamp
- Unread badge (sessions not yet viewed by admin)
- Filter by: language, date, message count

**Conversation view:**
- Full message history in the same bubble style as the public chatbot (bot left, user right)
- Timestamp per message
- "Flag" button — mark interesting conversations for review
- Shows which quick-reply chips were used vs typed messages

**Analytics strip (top of page):**
- Most asked topics (word frequency from user messages)
- FA vs EN session ratio
- Average messages per session
- Peak hours chart (simple bar chart, brand colors)

**Storage:** Each chatbot API call logs to Vercel KV with session ID + message + response + timestamp

---

### 6. Settings (`/admin/settings`)

**Sections:**

**Demo Mode:**
- Large toggle switch (cyan when off / orange when on)
- Clear explanation of what Demo Mode does
- Warning banner when enabled

**Admin Credentials:**
- Change password form (current password + new password + confirm)
- Updates hashed password in Vercel env vars via API

**Social Links & Contact:**
- Edit all placeholder social links in one place
- Fields: Instagram URL, Telegram handle, WhatsApp number, Bale handle, Email
- Saves to Vercel KV → footer and contact page update instantly

**API Status:**
- Groq API key: masked display + "Test Connection" button → pings Groq and shows ✅ or ❌
- Vercel KV: connection status indicator

**Danger Zone:**
- "Clear all chatbot logs" (with confirmation modal)
- "Reset all content to defaults" (with confirmation modal — restores `site-content.json` values)

---

## Design System (Admin-specific additions)

Same tokens as public site, plus:

| Element | Style |
|---|---|
| Sidebar | `rgba(255,255,255,0.03)` bg, `1px solid rgba(255,255,255,0.08)` right border |
| Active nav item | Cyan left border `3px`, cyan text `#3FE8F4` |
| Table rows | Alternating `rgba(255,255,255,0.02)` / transparent, hover `rgba(255,255,255,0.04)` |
| Status badges | New: cyan · Read: muted · Replied: violet |
| Demo Mode banner | `rgba(255,140,0,0.15)` bg, orange border, full-width top of page |
| Success toast | Glass card, green-cyan glow, slides in from top-right |
| Error toast | Glass card, magenta glow, slides in from top-right |
| Confirmation modal | Glass panel, backdrop blur, magenta confirm button |
| Data table header | `rgba(255,255,255,0.06)` bg, muted text, bold |

---

## Environment Variables Required

Add to `.env.local` and Vercel project settings:

```env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=         # bcrypt hash of your chosen password
NEXTAUTH_SECRET=             # random 32-char string (generate with: openssl rand -base64 32)
NEXTAUTH_URL=                # https://your-domain.com (or http://localhost:3000 for dev)

# Vercel KV (get from Vercel dashboard → Storage → Create KV)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Already existing
GROQ_API_KEY=
```

---

## Setup Steps (after implementation)

1. Create Vercel KV store: Vercel Dashboard → Storage → Create Database → KV
2. Copy KV credentials to `.env.local` and Vercel env vars
3. Generate `NEXTAUTH_SECRET`: run `openssl rand -base64 32` in terminal
4. Generate password hash: run `node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 10).then(h => console.log(h))"`
5. Add all env vars to Vercel project settings
6. Deploy — admin panel available at `yourdomain.com/admin`

---

## Security Notes

- `/admin` and all sub-routes are protected by Next.js middleware — no page renders without valid session
- Admin URL is not linked anywhere on public site
- Added to `robots.txt`: `Disallow: /admin`
- Password is bcrypt-hashed — never stored in plain text
- Demo Mode prevents accidental production changes during client demos
- Vercel KV tokens are server-side only — never exposed to browser

---

## Files Structure

```
/app
  /admin
    /login
      page.tsx
    /leads
      page.tsx
    /content
      page.tsx
    /chatbot
      page.tsx
    /settings
      page.tsx
    layout.tsx          ← sidebar + auth check
    page.tsx            ← dashboard
  /api
    /admin
      /leads
        route.ts        ← save + fetch leads from KV
      /content
        route.ts        ← read + write content to KV
      /chatbot-logs
        route.ts        ← save + fetch chatbot sessions from KV
      /settings
        route.ts        ← update settings in KV
    /auth
      [...nextauth]
        route.ts        ← NextAuth handler
    /chat
      route.ts          ← existing Groq route (add logging here)

/components
  /admin
    Sidebar.tsx
    StatCard.tsx
    LeadsTable.tsx
    ContentEditor.tsx
    ChatLogViewer.tsx
    DemoModeBanner.tsx
    Toast.tsx
    ConfirmModal.tsx

/middleware.ts           ← protect /admin/* routes
/content
  knowledge.txt         ← existing
  site-content.json     ← existing (default fallback)
```
