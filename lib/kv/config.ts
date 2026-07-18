const KV_URL_VAR = 'KV_REST_API_URL';
const KV_TOKEN_VAR = 'KV_REST_API_TOKEN';

/**
 * Returns true if the Vercel KV / Upstash Redis env vars are present.
 * Uses `process.env` directly on every call so that Vercel's runtime-injected
 * env vars are always visible (no module-level caching that can lock in `false`
 * during build time).
 */
export async function isKvConfigured(): Promise<boolean> {
  return Boolean(process.env[KV_URL_VAR] && process.env[KV_TOKEN_VAR]);
}

export function isKvConfiguredSync(): boolean {
  return Boolean(process.env[KV_URL_VAR] && process.env[KV_TOKEN_VAR]);
}
