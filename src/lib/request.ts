import 'server-only';
import { headers } from 'next/headers';

/** İstemci IP adresi. Üretimde Caddy ters vekil sunucusu X-Forwarded-For başlığını ekler. */
export async function clientIp(): Promise<string | null> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip');
}

export async function userAgent(): Promise<string | null> {
  const h = await headers();
  return h.get('user-agent')?.slice(0, 400) ?? null;
}

export function appUrl(path = ''): string {
  const base = (process.env.APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${path}`;
}
