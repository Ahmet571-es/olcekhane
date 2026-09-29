import { randomUUID } from 'node:crypto';
import { and, eq, inArray, sql } from 'drizzle-orm';
import type { Transporter } from 'nodemailer';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { emailOutbox } from '@/db/schema';
import { MAX_ATTEMPTS, processEmailQueue, retryEmail, sendEmail, setTransportForTests } from '@/lib/email/send';

// Veritabanı gerektirir: npm run test:db. E-postalar sahte bir aktarıcıyla "gönderilir"; gönderim sınırı
// saatte 3 e-posta (öncelikliler için +1) olarak ayarlanır.
const tag = randomUUID().slice(0, 8);
const to = (n: number | string) => `kuyruk-${tag}-${n}@ornek.test`;
const ids: string[] = [];
const sent: string[] = [];
let fail: ((to: string) => unknown) | null = null;
const fake = {
  sendMail: async (m: { to: string }) => {
    const err = fail?.(m.to);
    if (err) throw err;
    sent.push(m.to);
    return {};
  },
} as unknown as Transporter;

const msg = (n: number | string) => ({ to: to(n), subject: `Deneme ${n}`, html: `<p>${n}</p>`, text: String(n) });
async function send(n: number | string, opts?: Parameters<typeof sendEmail>[1]) {
  const r = await sendEmail(msg(n), opts);
  ids.push(r.id);
  return r;
}
async function row(id: string) {
  const [r] = await db.select().from(emailOutbox).where(eq(emailOutbox.id, id));
  return r;
}
/** Bir saat geçmiş gibi: bu testin gönderdiği e-postaların denemeleri saatlik sınırdan düşer. */
async function birSaatSonra() {
  await db
    .update(emailOutbox)
    .set({ lastAttemptAt: sql`now() - interval '2 hours'` })
    .where(and(eq(emailOutbox.status, 'sent'), inArray(emailOutbox.id, ids)));
}
const smtpError = (code: number, response: string) => Object.assign(new Error(response), { responseCode: code, response });

describe('e-posta kuyruğu', () => {
  beforeEach(async () => {
    sent.length = 0;
    fail = null;
    setTransportForTests(fake);
    process.env.MAIL_RATE_PER_HOUR = '3';
    process.env.MAIL_RATE_PER_DAY = '100';
    if (ids.length) await db.delete(emailOutbox).where(inArray(emailOutbox.id, ids.splice(0)));
    // Sınır, son denemelerin sayısıyla hesaplanır: önceki testlerin denemeleri sayılmasın.
    await db.execute(sql`update email_outbox set last_attempt_at = null where last_attempt_at is not null`);
  });
  afterAll(async () => {
    setTransportForTests(undefined);
    delete process.env.MAIL_RATE_PER_HOUR;
    delete process.env.MAIL_RATE_PER_DAY;
    if (ids.length) await db.delete(emailOutbox).where(inArray(emailOutbox.id, ids));
  });

  it('sınır dolunca e-posta sıraya girer; öncelikli e-postalar ayrılan paydan gider', async () => {
    expect((await send(1)).status).toBe('sent');
    expect((await send(2)).status).toBe('sent');
    expect((await send(3)).status).toBe('sent');
    const q = await send(4);
    expect(q.status).toBe('queued');
    expect((await send('oncelikli-1', { priority: true })).status).toBe('sent');
    expect((await send('oncelikli-2', { priority: true })).status).toBe('queued');
    expect(sent).toEqual([to(1), to(2), to(3), to('oncelikli-1')]);
    const r = await row(q.id);
    expect(r.attempts).toBe(0);
    expect(r.html).toBe('<p>4</p>');
    expect((await row(ids[0])).html).toBe('');
  });

  it('kuyruk, sınır açılınca en eskisinden başlayarak gönderilir', async () => {
    for (const n of [1, 2, 3]) await send(n);
    const a = await send('a');
    const b = await send('b');
    expect([a.status, b.status]).toEqual(['queued', 'queued']);
    expect(await processEmailQueue()).toBe(0);
    await birSaatSonra();
    expect(await processEmailQueue()).toBe(2);
    expect(sent.slice(-2)).toEqual([to('a'), to('b')]);
    expect((await row(a.id)).status).toBe('sent');
    expect((await row(b.id)).status).toBe('sent');
  });

  it('günlük sınır da uygulanır', async () => {
    process.env.MAIL_RATE_PER_DAY = '2';
    await send(1);
    await send(2);
    expect((await send(3, { priority: true })).status).toBe('queued');
  });

  it('geçici hatada artan aralıkla yeniden denenir; kalıcı hata ve deneme sınırı başarısız sayılır', async () => {
    fail = () => smtpError(421, '421 4.7.0 Try again later');
    const g = await send('gecici');
    expect(g.status).toBe('queued');
    const r = await row(g.id);
    expect(r.attempts).toBe(1);
    expect(r.error).toContain('421');
    const wait = (r.nextAttemptAt!.getTime() - Date.now()) / 60_000;
    expect(wait).toBeGreaterThan(4);
    expect(wait).toBeLessThan(6);
    expect(await processEmailQueue()).toBe(0); // henüz zamanı gelmedi

    fail = () => smtpError(550, '550 5.1.1 <x@ornek.test>: Recipient address rejected: User unknown');
    const k = await send('kalici');
    expect(k.status).toBe('failed');
    expect((await row(k.id)).nextAttemptAt).toBeNull();

    fail = () => smtpError(451, '451 4.3.0 Temporary failure');
    const [son] = await db
      .insert(emailOutbox)
      .values({ toEmail: to('son'), subject: 'Son deneme', html: 'x', text: 'x', attempts: MAX_ATTEMPTS - 1 })
      .returning({ id: emailOutbox.id });
    ids.push(son.id);
    expect(await processEmailQueue()).toBe(1);
    const s = await row(son.id);
    expect(s.status).toBe('failed');
    expect(s.attempts).toBe(MAX_ATTEMPTS);
  });

  it('aynı anda gönderilen e-postalar sınırı birlikte aşmaz', async () => {
    const results = await Promise.all(Array.from({ length: 10 }, (_, i) => send(`es-${i}`)));
    expect(results.filter((r) => r.status === 'sent')).toHaveLength(3);
    expect(results.filter((r) => r.status === 'queued')).toHaveLength(7);
    expect(sent).toHaveLength(3);
  });

  it('gönderilince alıcı adresi silinir (kapatılan hesabın bildirimi), sırada beklerken silinmez', async () => {
    const hemen = await send('kapanis-1', { redactAfterSend: true });
    expect(hemen.status).toBe('sent');
    expect((await row(hemen.id)).toEmail).toBe(`gonderildi-${hemen.id}@hesap.invalid`);
    await send(2);
    await send(3);
    const bekleyen = await send('kapanis-2', { redactAfterSend: true });
    expect(bekleyen.status).toBe('queued');
    expect((await row(bekleyen.id)).toEmail).toBe(to('kapanis-2'));
    await birSaatSonra();
    expect(await processEmailQueue()).toBe(1);
    expect(sent).toContain(to('kapanis-2'));
    expect((await row(bekleyen.id)).toEmail).toBe(`gonderildi-${bekleyen.id}@hesap.invalid`);
  });

  it('başarısız e-posta yönetim panelinden yeniden kuyruğa alınıp gönderilir', async () => {
    fail = () => smtpError(550, '550 5.1.1 User unknown');
    const f = await send('tekrar');
    expect(f.status).toBe('failed');
    fail = null;
    expect(await retryEmail(f.id)).toBe('sent');
    const r = await row(f.id);
    expect(r.status).toBe('sent');
    expect(r.attempts).toBe(1);
    expect(await retryEmail(f.id)).toBe('not_found');
  });

  it('SMTP tanımlı değilse e-posta yalnızca kaydedilir', async () => {
    setTransportForTests(null);
    const r = await send('kayit');
    expect(r.status).toBe('logged');
    expect(await processEmailQueue()).toBe(0);
  });
});
