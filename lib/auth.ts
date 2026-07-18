import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

process.env.AUTH_TRUST_HOST = 'true';

export async function getAdminToken(req: NextRequest) {
  const secureCookie =
    process.env.NODE_ENV === 'production' ||
    (process.env.NEXTAUTH_URL ?? '').startsWith('https://');

  return getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  });
}
