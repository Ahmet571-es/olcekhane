import 'server-only';
import { eq } from 'drizzle-orm';
import nodemailer, { type Transporter } from 'nodemailer';
import { db } from '@/db';
import { emailOutbox } from '@/db/schema';

let transporter: Transporter | null = null;
function getTransport(): Transporter | null {
  if (!process.env.SMTP_URL) return null;
  transporter ??= nodemailer.createTransport(process.env.SMTP_URL);
  return transporter;
}

/**
 * Gönderilen e-postanın gövdesi kuyrukta saklanmaz: gövdelerde tek kullanımlık bağlantılar (şifre
 * yenileme, davet, veli onayı) bulunur. Kayıtta yalnızca alıcı, konu ve durum kalır.
 */
const SENT_BODY = '';

async function deliver(id: string, msg: { to: string; subject: string; html: string; text: string }, transport: Transporter): Promise<boolean> {
  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM ?? 'Ölçekhane <bilgi@olcekhane.com>',
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    });
    await db.update(emailOutbox).set({ status: 'sent', sentAt: new Date(), error: null, html: SENT_BODY, text: SENT_BODY }).where(eq(emailOutbox.id, id));
    return true;
  } catch (err) {
    await db
      .update(emailOutbox)
      .set({ status: 'failed', error: String(err).slice(0, 500) })
      .where(eq(emailOutbox.id, id));
    // SMTP hata iletisi alıcı adresini içerebilir: ayrıntı e-posta kutusundaki kayıtta (saklama süresiyle)
    // durur, sunucu günlüğüne yalnızca hata türü yazılır.
    const e = err as { code?: unknown; responseCode?: unknown; command?: unknown };
    console.error(`e-posta gönderilemedi (kayıt ${id}): ${[e?.code, e?.command, e?.responseCode].filter(Boolean).join(' ') || 'bilinmeyen hata'}`);
    return false;
  }
}

/**
 * E-postayı kuyruğa yazar ve SMTP tanımlıysa hemen gönderir.
 * SMTP yoksa (geliştirme ortamı) e-posta yalnızca yönetim panelindeki e-posta kutusunda görünür.
 */
export async function sendEmail(msg: { to: string; subject: string; html: string; text: string }): Promise<{ id: string; status: 'sent' | 'failed' | 'logged' }> {
  const [row] = await db
    .insert(emailOutbox)
    .values({ toEmail: msg.to, subject: msg.subject, html: msg.html, text: msg.text })
    .returning({ id: emailOutbox.id });
  const transport = getTransport();
  if (!transport) {
    await db.update(emailOutbox).set({ status: 'logged' }).where(eq(emailOutbox.id, row.id));
    return { id: row.id, status: 'logged' };
  }
  return { id: row.id, status: (await deliver(row.id, msg, transport)) ? 'sent' : 'failed' };
}

/** Gönderilemeyen bir e-postayı yeniden dener (yönetim panelinden). */
export async function retryEmail(id: string): Promise<'sent' | 'failed' | 'no_smtp' | 'not_found'> {
  const [row] = await db.select().from(emailOutbox).where(eq(emailOutbox.id, id)).limit(1);
  if (!row || row.status !== 'failed') return 'not_found';
  const transport = getTransport();
  if (!transport) return 'no_smtp';
  return (await deliver(row.id, { to: row.toEmail, subject: row.subject, html: row.html, text: row.text }, transport)) ? 'sent' : 'failed';
}
