# Vercel Migration Revert

This file documents the changes made to revert the project from Cloudflare Workers (via `@opennextjs/cloudflare`) back to a native Vercel deployment.

## What was changed and why

### 1. KV store: Cloudflare Workers KV → Upstash Redis

**Files changed:**
- `lib/kv/config.ts` — Changed dynamic import from `@vercel/kv` → `@upstash/redis`
- `lib/kv/index.ts` — Same; changed `createClient({ url, token })` → `new Redis({ url, token })`
- `lib/content/loader.ts` — Same
- `app/api/admin/settings/route.ts` — Same
- `package.json` — Replaced `@vercel/kv: ^3.0.0` with `@upstash/redis: ^1.34.3`

**Why:** The code was already migrated from `getCloudflareContext().env.KV` to `@vercel/kv`, but `@vercel/kv` is now deprecated by Vercel. The `@upstash/redis` SDK provides the exact same API (`get`, `set`, `del`, `keys`) and uses the same environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`). All exported function signatures (`isKvConfigured`, `getDemoMode`, `setDemoMode`, etc.) are preserved unchanged.

### 2. Removed stale Cloudflare comments & labels

**Files changed:**
- `app/admin/login/page.tsx` — Stripped Cloudflare-specific comment about `detectOrigin()` (line 37-39)
- `app/api/auth/[...nextauth]/route.ts` — Rewrote the AUTH_TRUST_HOST comment block to reference Vercel's edge network instead of Cloudflare Workers (lines 5-14)
- `lib/admin-i18n.ts` — Changed two translation entries from `'Cloudflare KV'` → `'Vercel KV'` (lines 116, 282)
- `app/admin/settings/page.tsx` — Changed UI label from `Cloudflare KV` → `Vercel KV` (lines 360, 362)
- `components/sections/hero-section.tsx` — Changed two comments referencing "Cloudflare Workers" to "serverless platforms" (lines 17, 23)

### 3. Regenerated `package-lock.json`

The old lockfile still contained `@opennextjs/cloudflare`, `wrangler`, and all their Cloudflare transitive dependencies from the initial migration. After cleaning `package.json` (which was already done), `npm install` was run to produce a clean lockfile with only the current dependency tree.

### 4. `.env.example` update

Updated the comment header for the KV section to reference Upstash Redis directly instead of Vercel KV.

## No changes needed

The following were **already clean** — the previous developer had already removed Cloudflare-specific code:

- `next.config.mjs` — No `@opennextjs/cloudflare` import; no Cloudflare configuration
- `package.json` — No `@opennextjs/cloudflare`, no `wrangler`, no Cloudflare scripts
- `wrangler.jsonc` / `open-next.config.ts` — These files did not exist on disk
- `middleware.ts` — `secureCookie` already derived from `NODE_ENV`; `AUTH_TRUST_HOST` kept (works on Vercel)
- `lib/auth.ts` — Same; already has correct `secureCookie` logic
- `vercel.json` — Already correct (`next build`, `nextjs` framework, `iad1` region)
- `.gitignore` — No Cloudflare-specific entries
- `docs/cloudflare-migration-progress.md`, `docs/vercel-deployment-fix.md` — Left in place as historical records

## Required Vercel environment variables

Before deploying, add the following in Vercel Project Settings → Environment Variables:

| Variable | Source | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production URL | Yes |
| `NEXTAUTH_URL` | Same as above, no trailing slash | Yes |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` | Yes |
| `ADMIN_USERNAME` | Your admin username | Yes |
| `ADMIN_PASSWORD_HASH_BASE64` | `echo -n "your-bcrypt-hash" \| base64` | Yes |
| `KV_REST_API_URL` | From Vercel KV or Upstash Redis dashboard | Yes |
| `KV_REST_API_TOKEN` | From Vercel KV or Upstash Redis dashboard | Yes |
| `GROQ_API_KEY` | From Groq console | Yes |
| `RESEND_API_KEY` | From Resend dashboard | Yes |
| `CONTACT_TO_EMAIL` | Recipient email for contact form | Yes |
| `CONTACT_FROM_EMAIL` | Sender email for contact form | Yes |
| `KV_REST_API_READ_ONLY_TOKEN` | From Vercel KV / Upstash (optional) | No |

## Manual steps required

1. **Create a KV database** in the Vercel dashboard (Storage → KV) or add an Upstash Redis integration from the Vercel Marketplace.
2. Copy the `KV_REST_API_URL` and `KV_REST_API_TOKEN` from the database dashboard into Vercel environment variables.
3. Deploy normally — no special build command or build step is needed.
