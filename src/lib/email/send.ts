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
 * E-postayı kuyruğa yazar ve SMTP tanımlıysa hemen gönderir.
 * SMTP yoksa (geliştirme ortamı) e-posta yalnızca yönetim panelindeki e-posta kutusunda görünür.
 */
export async function sendEmail(msg: { to: string; subject: string; html: string; text: string }): Promise<void> {
  const [row] = await db
    .insert(emailOutbox)
    .values({ toEmail: msg.to, subject: msg.subject, html: msg.html, text: msg.text })
    .returning({ id: emailOutbox.id });
  const transport = getTransport();
  if (!transport) {
    await db.update(emailOutbox).set({ status: 'logged' }).where(eq(emailOutbox.id, row.id));
    return;
  }
  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM ?? 'Ölçekhane <bilgi@olcekhane.com>',
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    });
    await db.update(emailOutbox).set({ status: 'sent', sentAt: new Date() }).where(eq(emailOutbox.id, row.id));
  } catch (err) {
    await db
      .update(emailOutbox)
      .set({ status: 'failed', error: String(err).slice(0, 500) })
      .where(eq(emailOutbox.id, row.id));
    console.error('e-posta gönderilemedi', err);
  }
}
