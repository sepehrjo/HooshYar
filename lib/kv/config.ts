let cachedKvAvailable: boolean | null = null;

const KV_URL_VAR = 'KV_REST_API_URL';
const KV_TOKEN_VAR = 'KV_REST_API_TOKEN';

export async function isKvConfigured(): Promise<boolean> {
  if (cachedKvAvailable !== null) return cachedKvAvailable;

  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env[KV_URL_VAR];
    const token = process.env[KV_TOKEN_VAR];
    cachedKvAvailable = Boolean(url && token && Redis);
  } catch {
    cachedKvAvailable = false;
  }
  return cachedKvAvailable;
}

export function isKvConfiguredSync(): boolean {
  return Boolean(process.env[KV_URL_VAR] && process.env[KV_TOKEN_VAR]);
}
