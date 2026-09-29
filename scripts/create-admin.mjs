// Platform yöneticisi hesabını oluşturur ya da günceller (sunucuda, çalışan uygulama kapsayıcısının içinde):
//
//   docker compose exec app node dist/create-admin.mjs
//
// - E-posta adresi ve şifre (en az 12 karakter) sorulur; şifre ekranda görünmez. Etkileşimsiz kullanım
//   için ADMIN_EMAIL ve ADMIN_PASSWORD ortam değişkenleriyle de verilebilir; ADMIN_NAME isteğe bağlı.
// - Hesap varsa yönetici yetkisi verilir ve şifresi yenilenir.
// - ADMIN_RESET_2FA=1: iki aşamalı doğrulamayı sıfırlar ve bütün oturumları kapatır (telefonunu ve
//   kurtarma kodlarını kaybeden son yönetici için; sunucuya erişim gerektirdiği için güvenlidir):
//     docker compose exec -e ADMIN_RESET_2FA=1 app node dist/create-admin.mjs
// Şifre ekrana ya da kayıtlara yazılmaz.
import { hash } from '@node-rs/argon2';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import postgres from 'postgres';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

async function askLine(question) {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

/** Şifreyi ekranda göstermeden okur (terminal ham kipte; yapıştırma çalışır). */
function askHidden(question) {
  return new Promise((resolve, reject) => {
    stdout.write(question);
    const chars = [];
    let esc = 0; // ok tuşları gibi kaçış dizileri yok sayılır: 1 = ESC geldi, 2 = dizinin içindeyiz
    const finish = (err) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      if (err) reject(err);
      else resolve(chars.join(''));
    };
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (esc === 1) {
          esc = ch === '[' || ch === 'O' ? 2 : 0;
          continue;
        }
        if (esc === 2) {
          if (ch >= '@' && ch <= '~') esc = 0;
          continue;
        }
        if (ch === '\u001b') esc = 1;
        else if (ch === '\r' || ch === '\n' || ch === '\u0004') return finish();
        else if (ch === '\u0003') return finish(new Error('Vazgeçildi.'));
        else if (ch === '\u007f' || ch === '\b') chars.pop();
        else if (ch >= ' ') chars.push(ch);
      }
    };
    stdin.setEncoding('utf8');
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', onData);
  });
}

const url = process.env.DATABASE_URL;
if (!url) fail('DATABASE_URL tanımlı değil.');
const interactive = !!stdin.isTTY;
let email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
let password = process.env.ADMIN_PASSWORD ?? '';
const name = (process.env.ADMIN_NAME ?? 'Platform Yöneticisi').trim();
const reset2fa = process.env.ADMIN_RESET_2FA === '1';

if (!interactive && (!email || !password)) {
  fail('E-posta ve şifre sorulamıyor (etkileşimli terminal yok). Komutu -T olmadan çalıştırın ya da ADMIN_EMAIL ve ADMIN_PASSWORD verin.');
}
try {
  if (!email) email = (await askLine('Yöneticinin e-posta adresi: ')).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Geçerli bir e-posta adresi yazın.');
  if (!password) {
    password = await askHidden('Şifre (en az 12 karakter, ekranda görünmez): ');
    if (password.length < 12) fail('Şifre en az 12 karakter olmalı.');
    if ((await askHidden('Şifre (tekrar): ')) !== password) fail('İki şifre aynı değil.');
  }
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
if (password.length < 12) fail('ADMIN_PASSWORD en az 12 karakter olmalı.');

// src/lib/auth/password.ts ile aynı Argon2id ayarları.
const passwordHash = await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  const messages = await sql.begin(async (tx) => {
    const out = [];
    const [existing] = await tx`select id from users where email = ${email} and deleted_at is null limit 1`;
    let id;
    if (existing) {
      id = existing.id;
      await tx`update users set role = 'admin', password_hash = ${passwordHash}, email_verified_at = coalesce(email_verified_at, now()), updated_at = now() where id = ${id}`;
      // Şifre değişti: açık oturumlar ve eski şifreyle başlatılıp kodu girilmemiş girişler kapanır.
      await tx`delete from sessions where user_id = ${id}`;
      await tx`update auth_tokens set used_at = now() where user_id = ${id} and kind = 'login_2fa' and used_at is null`;
      out.push(`Yönetici güncellendi: ${email} (şifre yenilendi, açık oturumlar kapatıldı).`);
    } else {
      const [row] = await tx`
        insert into users (email, password_hash, full_name, role, email_verified_at)
        values (${email}, ${passwordHash}, ${name}, 'admin', now())
        returning id`;
      id = row.id;
      out.push(`Yönetici hesabı oluşturuldu: ${email}`);
    }
    if (reset2fa) {
      await tx`update users set totp_secret = null, totp_enabled_at = null, totp_last_step = null where id = ${id}`;
      await tx`delete from recovery_codes where user_id = ${id}`;
      out.push('İki aşamalı doğrulama sıfırlandı.');
    }
    await tx`
      insert into audit_logs (actor_user_id, action, entity, entity_id, meta)
      values (${id}, 'admin.bootstrap', 'user', ${id}, ${tx.json({ existing: !!existing, reset2fa })})`;
    const [u] = await tx`select totp_enabled_at from users where id = ${id}`;
    if (!u.totp_enabled_at) out.push('İlk girişte iki aşamalı doğrulamayı kurmanız istenecek.');
    return out;
  });
  for (const m of messages) console.log(m);
} catch (err) {
  if (err?.code === '42P01') fail('Veritabanı şeması henüz kurulmamış: önce uygulamayı başlatın (docker compose up -d) ve açılmasını bekleyin.');
  throw err;
} finally {
  await sql.end();
}
