import 'server-only';
import { and, asc, eq, isNull, lte, or, sql } from 'drizzle-orm';
import nodemailer, { type Transporter } from 'nodemailer';
import { db } from '@/db';
import { emailOutbox } from '@/db/schema';

let transporter: Transporter | null = null;
let testTransport: Transporter | null | undefined;

function getTransport(): Transporter | null {
  if (testTransport !== undefined) return testTransport;
  if (!process.env.SMTP_URL) return null;
  transporter ??= nodemailer.createTransport(process.env.SMTP_URL);
  return transporter;
}

/** Yalnızca testler için: SMTP yerine sahte bir aktarıcı (null: SMTP yokmuş gibi; undefined: gerçek). */
export function setTransportForTests(t: Transporter | null | undefined): void {
  testTransport = t;
}

/**
 * Gönderilen e-postanın gövdesi kuyrukta saklanmaz: gövdelerde tek kullanımlık bağlantılar (şifre
 * yenileme, davet, veli onayı) bulunur. Kayıtta yalnızca alıcı, konu ve durum kalır.
 */
const SENT_BODY = '';

function positiveInt(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

/**
 * Gönderim sınırları: e-posta sağlayıcıları saatlik ve günlük gönderimi sınırlar (ör. saatte 100). Sınırı
 * aşan e-posta reddedilir; bu yüzden sınırın biraz altında kalınır, aşan e-postalar kuyrukta bekleyip
 * sonra gönderilir. Öncelikli e-postalar (doğrulama, şifre yenileme, güvenlik bildirimleri) toplu
 * gönderimler bütçeyi doldursa da gidebilsin diye saatlik sınırın %10'u (en az 1) onlara ayrılır.
 */
function limits() {
  const hour = positiveInt(process.env.MAIL_RATE_PER_HOUR, 90);
  const day = positiveInt(process.env.MAIL_RATE_PER_DAY, 900);
  const reserve = Math.max(1, Math.ceil(hour / 10));
  return { hour, day, reserve };
}

/** Geçici hatalardan sonra yeniden deneme aralıkları (dakika): toplam yaklaşık iki gün. */
const BACKOFF_MINUTES = [5, 15, 60, 180, 360, 720, 1440];
export const MAX_ATTEMPTS = BACKOFF_MINUTES.length + 1;
/** Gönderim sürerken e-posta bu süre boyunca başka bir işleme verilmez (işlem yarıda kalırsa sonra denenir). */
const LEASE_MINUTES = 10;

type Msg = { to: string; subject: string; html: string; text: string };
type Claimed = Msg & { id: string; attempts: number; redactAfterSend: boolean };
export type SendStatus = 'sent' | 'failed' | 'logged' | 'queued';

const claimFields = {
  id: emailOutbox.id,
  to: emailOutbox.toEmail,
  subject: emailOutbox.subject,
  html: emailOutbox.html,
  text: emailOutbox.text,
  attempts: emailOutbox.attempts,
  redactAfterSend: emailOutbox.redactAfterSend,
};

/**
 * Gönderim hakkı varsa bir e-postayı alır: deneme zamanı yazılır ve kısa bir süre başka işlem almaz.
 * Hak, son bir saatteki ve son bir gündeki denemelerin sayısına bakılarak verilir; aynı anda çalışan
 * istekler bütçeyi birlikte aşmasın diye işlem bir veritabanı kilidiyle sıraya girer.
 */
async function claim(opts: { id?: string; priority?: boolean }): Promise<Claimed | null> {
  const { hour, day, reserve } = limits();
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('olcekhane-eposta'))`);
    const [used] = await tx.execute<{ hour: number; day: number }>(sql`
      select count(*) filter (where last_attempt_at > now() - interval '1 hour')::int as hour,
             count(*)::int as day
        from email_outbox where last_attempt_at > now() - interval '1 day'`);
    if (used.day >= day || used.hour >= hour + (opts.priority ? reserve : 0)) return null;
    const due = or(isNull(emailOutbox.nextAttemptAt), lte(emailOutbox.nextAttemptAt, sql`now()`));
    const [row] = opts.id
      ? await tx
          .select(claimFields)
          .from(emailOutbox)
          .where(and(eq(emailOutbox.id, opts.id), eq(emailOutbox.status, 'queued')))
          .for('update', { skipLocked: true })
      : await tx
          .select(claimFields)
          .from(emailOutbox)
          .where(and(eq(emailOutbox.status, 'queued'), due))
          .orderBy(asc(emailOutbox.createdAt))
          .limit(1)
          .for('update', { skipLocked: true });
    if (!row) return null;
    await tx
      .update(emailOutbox)
      .set({
        attempts: sql`${emailOutbox.attempts} + 1`,
        lastAttemptAt: sql`now()`,
        nextAttemptAt: sql`now() + make_interval(mins => ${LEASE_MINUTES}::int)`,
      })
      .where(eq(emailOutbox.id, row.id));
    return { ...row, attempts: row.attempts + 1 };
  });
}

/** Kalıcı hata: alıcı adresi geçersiz ya da yok (yeniden denemek işe yaramaz). Diğer hatalar geçici sayılır. */
function isPermanent(err: unknown): boolean {
  const e = err as { code?: unknown; responseCode?: unknown; response?: unknown };
  if (e?.code === 'EENVELOPE') return true;
  const rc = Number(e?.responseCode);
  return [550, 551, 553].includes(rc) && / 5\.1\.\d/.test(String(e?.response ?? ''));
}

async function deliver(m: Claimed, transport: Transporter): Promise<'sent' | 'failed' | 'queued'> {
  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM ?? 'Ölçekhane <bilgi@olcekhane.com>',
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
    });
    await db
      .update(emailOutbox)
      .set({
        status: 'sent',
        sentAt: sql`now()`,
        nextAttemptAt: null,
        error: null,
        html: SENT_BODY,
        text: SENT_BODY,
        ...(m.redactAfterSend ? { toEmail: `gonderildi-${m.id}@hesap.invalid` } : {}),
      })
      .where(eq(emailOutbox.id, m.id));
    return 'sent';
  } catch (err) {
    const giveUp = isPermanent(err) || m.attempts >= MAX_ATTEMPTS;
    const wait = BACKOFF_MINUTES[Math.min(m.attempts, BACKOFF_MINUTES.length) - 1];
    await db
      .update(emailOutbox)
      .set({
        status: giveUp ? 'failed' : 'queued',
        error: String(err).slice(0, 500),
        nextAttemptAt: giveUp ? null : sql`now() + make_interval(mins => ${wait}::int)`,
      })
      .where(eq(emailOutbox.id, m.id));
    // SMTP hata iletisi alıcı adresini içerebilir: ayrıntı e-posta kutusundaki kayıtta (saklama süresiyle)
    // durur, sunucu günlüğüne yalnızca hata türü yazılır.
    const e = err as { code?: unknown; responseCode?: unknown; command?: unknown };
    console.error(
      `e-posta gönderilemedi (kayıt ${m.id}, deneme ${m.attempts}${giveUp ? ', vazgeçildi' : `, ${wait} dk sonra yeniden`}): ${[e?.code, e?.command, e?.responseCode].filter(Boolean).join(' ') || 'bilinmeyen hata'}`,
    );
    return giveUp ? 'failed' : 'queued';
  }
}

/**
 * E-postayı kuyruğa yazar ve gönderim sınırı izin veriyorsa hemen gönderir; vermiyorsa ya da geçici bir
 * hata olursa e-posta kuyrukta kalır ve zamanlayıcı (processEmailQueue) sonra gönderir.
 * SMTP yoksa (geliştirme ortamı) e-posta yalnızca yönetim panelindeki e-posta kutusunda görünür.
 *
 * priority: doğrulama, şifre yenileme ve güvenlik bildirimleri gibi kişinin beklediği e-postalar.
 * redactAfterSend: gönderilince kayıttaki alıcı adresi silinir (kapatılan hesabın bildirimi).
 */
export async function sendEmail(
  msg: Msg,
  opts: { priority?: boolean; redactAfterSend?: boolean } = {},
): Promise<{ id: string; status: SendStatus }> {
  const [row] = await db
    .insert(emailOutbox)
    .values({ toEmail: msg.to, subject: msg.subject, html: msg.html, text: msg.text, redactAfterSend: !!opts.redactAfterSend })
    .returning({ id: emailOutbox.id });
  const transport = getTransport();
  if (!transport) {
    await db.update(emailOutbox).set({ status: 'logged' }).where(eq(emailOutbox.id, row.id));
    return { id: row.id, status: 'logged' };
  }
  const claimed = await claim({ id: row.id, priority: opts.priority });
  if (!claimed) return { id: row.id, status: 'queued' };
  return { id: row.id, status: await deliver(claimed, transport) };
}

/**
 * Kuyruktaki e-postaları sırayla (en eskisi önce) gönderim sınırı izin verdiği kadar gönderir.
 * Zamanlayıcı dakikada bir çağırır; bir çağrıda en fazla `max` e-posta gönderilir.
 */
export async function processEmailQueue(max = 20): Promise<number> {
  const transport = getTransport();
  if (!transport) return 0;
  let n = 0;
  while (n < max) {
    const claimed = await claim({});
    if (!claimed) break;
    await deliver(claimed, transport);
    n++;
  }
  return n;
}

/** Gönderilemeyen bir e-postayı yeniden kuyruğa alır ve sınır izin veriyorsa hemen dener (yönetim panelinden). */
export async function retryEmail(id: string): Promise<'sent' | 'failed' | 'queued' | 'no_smtp' | 'not_found'> {
  const transport = getTransport();
  const [row] = await db.select({ status: emailOutbox.status }).from(emailOutbox).where(eq(emailOutbox.id, id)).limit(1);
  if (!row || row.status !== 'failed') return 'not_found';
  if (!transport) return 'no_smtp';
  await db
    .update(emailOutbox)
    .set({ status: 'queued', attempts: 0, nextAttemptAt: null, error: null })
    .where(and(eq(emailOutbox.id, id), eq(emailOutbox.status, 'failed')));
  const claimed = await claim({ id, priority: true });
  if (!claimed) return 'queued';
  return deliver(claimed, transport);
}
