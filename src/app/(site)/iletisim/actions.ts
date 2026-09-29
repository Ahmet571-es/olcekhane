'use server';

import { z } from 'zod';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { sendEmail } from '@/lib/email/send';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp, clientIpBucket } from '@/lib/request';

export type ContactState = { ok?: boolean; message?: string; errors?: Record<string, string>; values?: Record<string, string> };

const schema = z.object({
  topic: z.enum(['parent', 'school', 'press', 'kvkk', 'other'], { message: 'Konu seçin.' }),
  name: z.string().trim().min(3, 'Adınızı ve soyadınızı yazın.').max(120),
  email: z.email('Geçerli bir e-posta adresi yazın.').max(200),
  phone: z.string().trim().max(30).optional(),
  organization: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, 'Mesajınız en az 10 karakter olmalı.').max(4000, 'Mesaj en fazla 4000 karakter olabilir.'),
});

const TOPIC_LABELS: Record<string, string> = {
  parent: 'Veli',
  school: 'Okul başvurusu',
  press: 'Basın',
  kvkk: 'KVKK başvurusu',
  other: 'Diğer',
};

export async function contactAction(_: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { topic: raw.topic ?? '', name: raw.name ?? '', email: raw.email ?? '', phone: raw.phone ?? '', organization: raw.organization ?? '', message: raw.message ?? '' };
  // Bot tuzağı: görünmeyen bu alan doluysa sessizce başarılı gibi davran.
  if (raw.website) return { ok: true, message: 'Mesajınız alındı.' };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  const ip = (await clientIp()) ?? 'bilinmiyor';
  if (!(await rateLimit(`iletisim:${await clientIpBucket()}`, 5, 3600))) {
    return { message: 'Kısa sürede çok fazla mesaj gönderildi. Lütfen daha sonra tekrar deneyin.', values };
  }
  const d = parsed.data;
  await db.insert(contactMessages).values({
    topic: d.topic,
    name: d.name,
    email: d.email.toLowerCase(),
    phone: d.phone || null,
    organization: d.organization || null,
    message: d.message,
    ip,
  });
  const to = process.env.COMPANY_EMAIL;
  if (to) {
    const text = `Konu: ${TOPIC_LABELS[d.topic]}\nAd: ${d.name}\nE-posta: ${d.email}\nTelefon: ${d.phone || '-'}\nKurum: ${d.organization || '-'}\n\n${d.message}`;
    await sendEmail({
      to,
      subject: `İletişim formu: ${TOPIC_LABELS[d.topic]} (${d.name})`,
      text,
      html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)}</pre>`,
    });
  }
  return { ok: true, message: 'Mesajınız alındı. En geç iki iş günü içinde e-postayla dönüş yapacağız.' };
}
