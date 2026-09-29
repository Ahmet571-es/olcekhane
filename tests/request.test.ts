import { describe, expect, it } from 'vitest';
import { clientIp, userAgent } from '@/lib/request';

// Zamanlanmış temizlik görevi ve betikler rıza ve denetim yardımcılarını istek dışında çağırır. Next.js
// bu durumda başlık okumayı özel bir hatayla (E251) reddeder; yardımcılar null döndürmelidir. Next.js
// sürümü hata kodunu değiştirirse bu test bunu hemen yakalar.
describe('istek dışında başlık yardımcıları', () => {
  it('clientIp ve userAgent null döndürür', async () => {
    await expect(clientIp()).resolves.toBeNull();
    await expect(userAgent()).resolves.toBeNull();
  });
});
