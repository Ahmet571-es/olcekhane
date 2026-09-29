import 'server-only';
import { headers } from 'next/headers';
import { ipBucket } from './ip';

/**
 * İsteğin başlıkları. Bir isteğin dışında (zamanlanmış temizlik görevi, betik) çağrılırsa null döner.
 * Yalnızca Next.js'in "istek dışında çağrıldı" hatası (E251) yutulur; akış hataları (statik
 * oluşturmada dinamik kullanım, yönlendirme) ve diğer hatalar olduğu gibi iletilir.
 */
async function requestHeaders(): Promise<Awaited<ReturnType<typeof headers>> | null> {
  try {
    return await headers();
  } catch (err) {
    if ((err as { __NEXT_ERROR_CODE?: string } | null)?.__NEXT_ERROR_CODE === 'E251') return null;
    throw err;
  }
}

/**
 * İstemcinin IP adresi. Uygulama tek bir güvenilir ters vekilin (Caddy) arkasında çalışır; vekil
 * X-Forwarded-For başlığına gördüğü adresi ekler. İstemcinin kendisi de bu başlığı gönderebileceği
 * için ilk değer değil, vekilin eklediği son değer kullanılır.
 */
export async function clientIp(): Promise<string | null> {
  const h = await requestHeaders();
  if (!h) return null;
  const fwd = h.get('x-forwarded-for');
  if (fwd) {
    const parts = fwd
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return h.get('x-real-ip');
}

/** Hız sınırlarında kullanılan IP kovası (IPv6’da /64). */
export async function clientIpBucket(): Promise<string> {
  return ipBucket(await clientIp());
}

export async function userAgent(): Promise<string | null> {
  const h = await requestHeaders();
  return h?.get('user-agent')?.slice(0, 400) ?? null;
}

export function appUrl(path = ''): string {
  const base = (process.env.APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${path}`;
}
