import 'server-only';
import { headers } from 'next/headers';
import { ipBucket } from './ip';

/**
 * İstemcinin IP adresi. Uygulama tek bir güvenilir ters vekilin (Caddy) arkasında çalışır; vekil
 * X-Forwarded-For başlığına gördüğü adresi ekler. İstemcinin kendisi de bu başlığı gönderebileceği
 * için ilk değer değil, vekilin eklediği son değer kullanılır.
 */
export function clientIpFrom(h: Pick<Headers, 'get'>): string | null {
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

/** Hız sınırlarında kullanılan IP kovası (IPv6’da /64). Yalnızca bellekte kullanılır. */
export async function clientIpBucket(): Promise<string> {
  return ipBucket(clientIpFrom(await headers()));
}
