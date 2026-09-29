// Platform yöneticisi hesabını oluşturur ya da günceller (sunucuda, Docker içinde çalışır):
//
//   docker compose run --rm -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... app node dist/create-admin.mjs
//
// - ADMIN_EMAIL, ADMIN_PASSWORD (en az 12 karakter) zorunlu; ADMIN_NAME isteğe bağlı.
// - Hesap varsa yönetici yetkisi verilir ve şifresi yenilenir.
// - ADMIN_RESET_2FA=1: iki aşamalı doğrulamayı sıfırlar ve bütün oturumları kapatır (telefonunu ve
//   kurtarma kodlarını kaybeden son yönetici için; sunucuya erişim gerektirdiği için güvenlidir).
// Şifre ekrana ya da kayıtlara yazılmaz.
import { hash } from '@node-rs/argon2';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? '';
const name = (process.env.ADMIN_NAME ?? 'Platform Yöneticisi').trim();
const reset2fa = process.env.ADMIN_RESET_2FA === '1';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}
if (!url) fail('DATABASE_URL tanımlı değil.');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('ADMIN_EMAIL geçerli bir e-posta adresi olmalı.');
if (password.length < 12) fail('ADMIN_PASSWORD en az 12 karakter olmalı.');

// src/lib/auth/password.ts ile aynı Argon2id ayarları.
const passwordHash = await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  const [existing] = await sql`select id from users where email = ${email} and deleted_at is null limit 1`;
  let id;
  if (existing) {
    id = existing.id;
    await sql`update users set role = 'admin', password_hash = ${passwordHash}, email_verified_at = coalesce(email_verified_at, now()), updated_at = now() where id = ${id}`;
    console.log(`Yönetici güncellendi: ${email}`);
  } else {
    const [row] = await sql`
      insert into users (email, password_hash, full_name, role, email_verified_at)
      values (${email}, ${passwordHash}, ${name}, 'admin', now())
      returning id`;
    id = row.id;
    console.log(`Yönetici hesabı oluşturuldu: ${email}`);
  }
  if (reset2fa) {
    await sql`update users set totp_secret = null, totp_pending_secret = null, totp_enabled_at = null, totp_last_step = null where id = ${id}`;
    await sql`delete from recovery_codes where user_id = ${id}`;
    await sql`delete from sessions where user_id = ${id}`;
    console.log('İki aşamalı doğrulama sıfırlandı; ilk girişte yeniden kurulacak.');
  }
  await sql`
    insert into audit_logs (actor_user_id, action, entity, entity_id, meta)
    values (${id}, 'admin.bootstrap', 'user', ${id}, ${sql.json({ existing: !!existing, reset2fa })})`;
  console.log('İlk girişte iki aşamalı doğrulamayı kurmanız istenecek.');
} finally {
  await sql.end();
}
