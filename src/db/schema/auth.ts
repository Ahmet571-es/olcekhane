import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, deletedAt, id, updatedAt } from './_common';
import { students } from './students';

/**
 * Platform rolleri. Okul içindeki görevler (rehber öğretmen, öğretmen, okul yöneticisi)
 * `memberships` tablosunda tutulur; bu alan kişinin platform genelindeki yetkisidir.
 */
export const userRole = pgEnum('user_role', ['parent', 'staff', 'admin']);

export const users = pgTable(
  'users',
  {
    id: id(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    role: userRole('role').notNull().default('parent'),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    /** İki aşamalı doğrulama (TOTP) sırrı; APP_SECRET’ten türetilen anahtarla AES-256-GCM ile şifreli. */
    totpSecret: text('totp_secret'),
    totpEnabledAt: timestamp('totp_enabled_at', { withTimezone: true }),
    /** En son kabul edilen zaman adımı: aynı kod ikinci kez kullanılamaz. */
    totpLastStep: bigint('totp_last_step', { mode: 'number' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [uniqueIndex('users_email_uq').on(t.email)],
);

/** İki aşamalı doğrulama için tek kullanımlık kurtarma kodları (yalnızca HMAC özetleri saklanır). */
export const recoveryCodes = pgTable(
  'recovery_codes',
  {
    id: id(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    codeHash: text('code_hash').notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('recovery_codes_uq').on(t.userId, t.codeHash)],
);

export const sessionKind = pgEnum('session_kind', ['user', 'student']);

/**
 * Oturumlar veritabanında tutulur; tarayıcıda yalnızca rastgele bir belirteç bulunur,
 * veritabanında o belirtecin SHA-256 özeti saklanır.
 */
export const sessions = pgTable(
  'sessions',
  {
    id: id(),
    tokenHash: text('token_hash').notNull(),
    kind: sessionKind('kind').notNull().default('user'),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    ip: text('ip'),
    userAgent: text('user_agent'),
    /**
     * Bu oturumda ikinci adım (kod ya da kurtarma kodu) doğrulandıysa, kodun ait olduğu kurulumun
     * zamanı (kurulumu yapan oturumda kurulum anı). Oturum ancak bu zaman kullanıcının şu anki kurulum
     * zamanından (totp_enabled_at) eski değilse "iki aşamalı" sayılır: yeni cihaza taşıma ya da yeniden
     * kurulum eski oturumları düşürür.
     */
    twoFactorAt: timestamp('two_factor_at', { withTimezone: true }),
    /** Kurulum sürerken, kod doğrulanana kadar bekleyen yeni sır (şifreli): yalnızca kurulumu başlatan oturum görür. */
    totpPendingSecret: text('totp_pending_secret'),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('sessions_token_uq').on(t.tokenHash),
    index('sessions_user_idx').on(t.userId),
  ],
);

export const authTokenKind = pgEnum('auth_token_kind', [
  'email_verify',
  'password_reset',
  'consent_request',
  'invite',
  /** Şifre doğrulandıktan sonra iki aşamalı doğrulamanın ikinci adımını bekleyen giriş. */
  'login_2fa',
]);

/** E-posta doğrulama, şifre yenileme, veli onayı ve davet bağlantıları için tek kullanımlık belirteçler. */
export const authTokens = pgTable(
  'auth_tokens',
  {
    id: id(),
    kind: authTokenKind('kind').notNull(),
    tokenHash: text('token_hash').notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    email: text('email'),
    payload: jsonb('payload').$type<Record<string, unknown>>(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('auth_tokens_hash_uq').on(t.tokenHash)],
);

/** Giriş denemeleri: kaba kuvvet saldırılarına karşı hız sınırı için. */
export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: id(),
    key: text('key').notNull(),
    ip: text('ip'),
    success: boolean('success').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('login_attempts_key_idx').on(t.key, t.createdAt)],
);

/** Genel amaçlı hız sınırı sayaçları (form gönderimleri, e-posta istekleri). */
export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull().default(0),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull().defaultNow(),
});
