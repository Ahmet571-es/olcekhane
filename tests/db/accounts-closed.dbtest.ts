import { randomUUID } from 'node:crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { forgotPasswordAction, loginAction } from '@/app/(auth)/actions';
import { contactAction } from '@/app/(site)/iletisim/actions';
import { db } from '@/db';
import { authTokens, contactMessages, emailOutbox, loginAttempts, rateLimits, users } from '@/db/schema';
import { guardAttempt } from '@/lib/api-guard';
import { requireAccountsOpen } from '@/lib/auth/dal';
import { hashPassword } from '@/lib/auth/password';
import { ACCOUNTS_CLOSED_MESSAGE } from '@/lib/site';

// Veritabanı gerektirir: npm run test:db. Hesaplar kapalıyken (varsayılan) veli, okul ve öğrenci hesapları
// kullanılamaz: giriş yalnızca yöneticilere açıktır, şifre yenileme bağlantısı yöneticilere gider, hesapla
// test çözme uçları reddeder. İletişim formunun bildirim e-postası mesajın içeriğini taşımaz.
const tag = randomUUID().slice(0, 8);
const parentEmail = `kapali-veli-${tag}@ornek.test`;
const PASSWORD = `Uzun-ve-guclu-sifre-${tag}`;

function form(values: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(values)) f.set(k, v);
  return f;
}

describe('hesaplar kapalıyken', () => {
  let parentId = '';
  beforeAll(async () => {
    vi.stubEnv('ACCOUNTS_ENABLED', '');
    const [u] = await db
      .insert(users)
      .values({ email: parentEmail, passwordHash: await hashPassword(PASSWORD), fullName: 'Kapalı Veli', role: 'parent' })
      .returning({ id: users.id });
    parentId = u.id;
  });
  afterEach(() => vi.stubEnv('ACCOUNTS_ENABLED', ''));
  afterAll(async () => {
    vi.unstubAllEnvs();
    await db.delete(authTokens).where(eq(authTokens.userId, parentId));
    await db.delete(loginAttempts).where(eq(loginAttempts.key, parentEmail));
    await db.delete(rateLimits).where(inArray(rateLimits.key, [`giris-deneme:${parentEmail}`, `sifre:${parentEmail}`, 'sifre-ip:bilinmiyor', 'iletisim:bilinmiyor']));
    await db.delete(users).where(eq(users.id, parentId));
  });

  it('veli doğru şifreyle de giriş yapamaz; oturum açılmaz', async () => {
    const res = await loginAction({}, form({ email: parentEmail, password: PASSWORD }));
    expect(res.message).toBe(ACCOUNTS_CLOSED_MESSAGE);
    // Yanlış şifre yine "hatalı" der (hesabın varlığı ve türü belli edilmez).
    const wrong = await loginAction({}, form({ email: parentEmail, password: 'yanlis-sifre-12345' }));
    expect(wrong.message).toBe('E-posta adresi ya da şifre hatalı.');
  });

  it('veliye şifre yenileme bağlantısı gönderilmez; ileti hesabın varlığını belli etmez', async () => {
    const res = await forgotPasswordAction({}, form({ email: parentEmail }));
    expect(res.ok).toBe(true);
    const tokens = await db.select({ id: authTokens.id }).from(authTokens).where(eq(authTokens.userId, parentId));
    expect(tokens).toHaveLength(0);
  });

  it('veli, okul ve test sayfaları ile hesapla test çözme uçları kapalı', async () => {
    expect(() => requireAccountsOpen()).toThrow();
    const req = new NextRequest('http://localhost:3000/api/attempts/x/answer', { method: 'POST' });
    const g = await guardAttempt(req, randomUUID());
    expect('error' in g && g.error ? g.error.status : null).toBe(403);
    vi.stubEnv('ACCOUNTS_ENABLED', 'true');
    expect(() => requireAccountsOpen()).not.toThrow();
  });

  it('iletişim formu: mesaj veritabanında; bildirim e-postası içeriği ve göndereni taşımaz', async () => {
    vi.stubEnv('COMPANY_EMAIL', `sirket-${tag}@ornek.test`);
    const message = `Merhaba, okulumuz için bilgi almak istiyoruz ${tag}.`;
    const res = await contactAction({}, form({ topic: 'school', name: `Ayşe Deneme ${tag}`, email: `ayse-${tag}@ornek.test`, message }));
    expect(res.ok).toBe(true);
    const [row] = await db.select().from(contactMessages).where(eq(contactMessages.message, message));
    expect(row?.name).toBe(`Ayşe Deneme ${tag}`);
    const mails = await db.select().from(emailOutbox).where(eq(emailOutbox.toEmail, `sirket-${tag}@ornek.test`));
    expect(mails).toHaveLength(1);
    const all = `${mails[0].subject} ${mails[0].text} ${mails[0].html}`;
    expect(all).not.toContain(tag);
    expect(all).not.toContain('Ayşe');
    expect(mails[0].text).toContain('/yonetim/mesajlar');
    await db.delete(emailOutbox).where(and(eq(emailOutbox.toEmail, `sirket-${tag}@ornek.test`)));
    await db.delete(contactMessages).where(eq(contactMessages.id, row.id));
  });
});
