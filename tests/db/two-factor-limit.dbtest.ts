import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { secondFactorAttemptAllowed } from '@/lib/auth/two-factor';

// Veritabanı gerektirir: npm run test:db (DATABASE_URL, .env.local’dan okunur).
// Kod tahminine karşı sınır, doğrulamadan önce atomik bir sayaçla uygulanır: aynı anda gönderilen
// istekler "say, doğrula, kaydet" arasındaki boşluğu kullanıp sınırı aşamamalıdır.
describe('ikinci adım deneme sınırı', () => {
  const userId = randomUUID();
  afterAll(async () => {
    await db.execute(sql`delete from rate_limits where key in (${`iki-asama-deneme:${userId}`}, ${`iki-asama-gun:${userId}`})`);
  });

  it('aynı anda gelen 40 denemeden yalnızca 8’i kabul edilir', async () => {
    const results = await Promise.all(Array.from({ length: 40 }, () => secondFactorAttemptAllowed(userId)));
    expect(results.filter(Boolean)).toHaveLength(8);
  });
});
