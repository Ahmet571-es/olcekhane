import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { hasActiveConsent, lockStudentConsent, recordConsent, revokeConsent } from '@/lib/consent';

// Veritabanı gerektirir: npm run test:db (DATABASE_URL, .env.local’dan okunur).
// Rıza işlemleri öğrenci başına kilitle sıraya girer ve kilitli işlemin içindeki her sorgu aynı
// bağlantıyı kullanmalıdır; yoksa havuz boyutu kadar eşzamanlı işlem bağlantı havuzunu kilitler.
describe('öğrenci rıza kilidi', () => {
  let studentId = '';
  beforeAll(async () => {
    const [st] = await db.execute<{ id: string }>(sql`insert into students (first_name, grade) values ('Kilit Testi', 7) returning id`);
    studentId = st.id;
  });
  afterAll(async () => {
    if (studentId) await db.execute(sql`delete from students where id = ${studentId}`);
  });

  it('havuzun üç katı eşzamanlı işlem takılmadan ve sırayla uygulanır', async () => {
    const n = 3 * Number(process.env.DATABASE_POOL_SIZE ?? 10);
    await Promise.all(
      Array.from({ length: n }, () =>
        db.transaction(async (tx) => {
          await lockStudentConsent(tx, studentId);
          if (await hasActiveConsent(studentId, 'consent_assessment', tx)) {
            await revokeConsent(studentId, 'consent_assessment', { email: 'test@ornek.test' }, tx);
          } else {
            await recordConsent(
              { kind: 'explicit_consent', docKind: 'consent_assessment', granted: true, studentId, actorEmail: 'test@ornek.test' },
              tx,
            );
          }
        }),
      ),
    );
    const rows = await db.execute<{ granted: boolean; n: number }>(
      sql`select granted, count(*)::int as n from consent_records where subject_student_id = ${studentId} group by granted`,
    );
    const count = Object.fromEntries(rows.map((r) => [String(r.granted), r.n]));
    expect(count).toEqual({ true: n / 2, false: n / 2 });
    expect(await hasActiveConsent(studentId, 'consent_assessment')).toBe(false);
  }, 30_000);
});
