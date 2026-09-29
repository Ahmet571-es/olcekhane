import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from './_common';
import { users } from './auth';
import { instruments } from './instruments';
import { students } from './students';

/* ---------- İçerik: uzmanlar ve rehber yazıları ---------- */

export const experts = pgTable(
  'experts',
  {
    id: id(),
    slug: text('slug').notNull(),
    fullName: text('full_name').notNull(),
    title: text('title').notNull(),
    credentials: text('credentials'),
    bio: text('bio'),
    photoUrl: text('photo_url'),
    isActive: boolean('is_active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('experts_slug_uq').on(t.slug)],
);

export const contentStatus = pgEnum('content_status', ['draft', 'published']);

export const contentPages = pgTable(
  'content_pages',
  {
    id: id(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    excerpt: text('excerpt'),
    bodyMd: text('body_md').notNull(),
    authorExpertId: uuid('author_expert_id').references(() => experts.id, { onDelete: 'set null' }),
    reviewerExpertId: uuid('reviewer_expert_id').references(() => experts.id, { onDelete: 'set null' }),
    status: contentStatus('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('content_pages_slug_uq').on(t.slug)],
);

/* ---------- Ticaret: paketler, haklar, siparişler (ödeme açılınca kullanılacak) ---------- */

export const packageAudience = pgEnum('package_audience', ['parent', 'school']);

export const packages = pgTable(
  'packages',
  {
    id: id(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    audience: packageAudience('audience').notNull().default('parent'),
    /** Kuruş cinsinden, KDV dahil. Ödeme açılana kadar boş kalabilir. */
    priceKurus: integer('price_kurus'),
    isActive: boolean('is_active').notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('packages_slug_uq').on(t.slug)],
);

export const packageInstruments = pgTable(
  'package_instruments',
  {
    packageId: uuid('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    instrumentId: uuid('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.packageId, t.instrumentId] })],
);

export const orderStatus = pgEnum('order_status', ['pending', 'paid', 'failed', 'refunded', 'cancelled']);

export const orders = pgTable(
  'orders',
  {
    id: id(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    packageId: uuid('package_id').references(() => packages.id),
    studentId: uuid('student_id').references(() => students.id, { onDelete: 'set null' }),
    amountKurus: integer('amount_kurus').notNull(),
    currency: text('currency').notNull().default('TRY'),
    status: orderStatus('status').notNull().default('pending'),
    provider: text('provider'),
    providerRef: text('provider_ref'),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('orders_user_idx').on(t.userId)],
);

export const entitlementSource = pgEnum('entitlement_source', ['free', 'package', 'school', 'admin', 'pilot']);

/** Bir öğrencinin hangi testi çözebileceği. */
export const entitlements = pgTable(
  'entitlements',
  {
    id: id(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    instrumentId: uuid('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'cascade' }),
    source: entitlementSource('source').notNull(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
    remainingUses: integer('remaining_uses').notNull().default(1),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('entitlements_student_idx').on(t.studentId)],
);

/* ---------- İşletim: denetim kaydı, e-posta kuyruğu, lisans kayıt defteri, site ayarları ---------- */

/**
 * Zamanlanmış görevlerin çalışma kayıtları (ör. günlük temizlik). Yönetim panelinde son çalışma ve
 * sonuç gösterilir; zamanlayıcı son başarılı çalışmaya bakarak görevin yeniden gerekip gerekmediğine karar verir.
 */
export const jobRuns = pgTable(
  'job_runs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    job: text('job').notNull(),
    /** Çalıştıran: zamanlayıcı ya da yönetici. */
    trigger: text('trigger').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    ok: boolean('ok'),
    report: jsonb('report').$type<Record<string, number>>(),
    error: text('error'),
  },
  (t) => [index('job_runs_job_idx').on(t.job, t.startedAt)],
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    actorStudentId: uuid('actor_student_id').references(() => students.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entity: text('entity').notNull(),
    entityId: text('entity_id'),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    ip: text('ip'),
    createdAt: createdAt(),
  },
  (t) => [index('audit_logs_entity_idx').on(t.entity, t.entityId), index('audit_logs_created_idx').on(t.createdAt)],
);

export const emailStatus = pgEnum('email_status', ['queued', 'sent', 'failed', 'logged']);

export const emailOutbox = pgTable(
  'email_outbox',
  {
    id: id(),
    toEmail: text('to_email').notNull(),
    subject: text('subject').notNull(),
    html: text('html').notNull(),
    text: text('text').notNull(),
    status: emailStatus('status').notNull().default('queued'),
    error: text('error'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('email_outbox_status_idx').on(t.status, t.createdAt)],
);

/** Her ölçeğin kullanım izninin kaydı: kimden, ne zaman, hangi kapsamda. */
export const licenseRegister = pgTable('license_register', {
  id: id(),
  instrumentSlug: text('instrument_slug').notNull(),
  holder: text('holder').notNull(),
  licenseType: text('license_type').notNull(),
  scope: text('scope'),
  grantedAt: timestamp('granted_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  documentRef: text('document_ref'),
  notes: text('notes'),
  createdAt: createdAt(),
});

/** Şirket unvanı, MERSIS, adres gibi yönetim panelinden düzenlenen site bilgileri. */
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').$type<unknown>().notNull(),
  updatedAt: updatedAt(),
});

/* ---------- İletişim formu ve okul başvuruları ---------- */

export const contactTopic = pgEnum('contact_topic', ['parent', 'school', 'press', 'kvkk', 'other']);

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: id(),
    topic: contactTopic('topic').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    organization: text('organization'),
    message: text('message').notNull(),
    ip: text('ip'),
    handledAt: timestamp('handled_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('contact_messages_created_idx').on(t.createdAt)],
);
