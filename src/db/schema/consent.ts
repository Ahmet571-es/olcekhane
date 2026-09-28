import {
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
import { createdAt, id } from './_common';
import { users } from './auth';
import { students } from './students';

/**
 * Hukuki metin türleri. KVKK Kurulu'nun 2026/347 sayılı ilke kararı uyarınca aydınlatma metni
 * ile açık rıza metni ayrı belgelerdir ve ayrı beyanlarla alınır.
 */
export const legalDocKind = pgEnum('legal_doc_kind', [
  'privacy_notice', // KVKK aydınlatma metni ("okudum, anladım")
  'consent_assessment', // açık rıza: çocuğun psikometrik ölçüm verilerinin işlenmesi
  'consent_research', // açık rıza (isteğe bağlı): anonimleştirilmiş verinin norm/geçerlik çalışmalarında kullanımı
  'child_info', // çocuğa yönelik sade bilgilendirme ve kendi onayı
  'terms', // kullanım koşulları
  'cookie_policy',
  'preliminary_info', // ön bilgilendirme formu (ödeme açılınca)
  'distance_sales', // mesafeli satış sözleşmesi (ödeme açılınca)
]);

export const legalDocuments = pgTable(
  'legal_documents',
  {
    id: id(),
    kind: legalDocKind('kind').notNull(),
    version: integer('version').notNull(),
    title: text('title').notNull(),
    bodyMd: text('body_md').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('legal_documents_kind_version_uq').on(t.kind, t.version)],
);

/**
 * - notice_ack: aydınlatma metninin okunduğu beyanı (rıza değildir)
 * - explicit_consent: açık rıza (verilebilir / geri alınabilir)
 * - child_assent: çocuğun kendi yaşına uygun bilgilendirme sonrası onayı
 */
export const consentKind = pgEnum('consent_kind', ['notice_ack', 'explicit_consent', 'child_assent']);
export const consentMethod = pgEnum('consent_method', ['form', 'email_link']);

export const consentRecords = pgTable(
  'consent_records',
  {
    id: id(),
    kind: consentKind('kind').notNull(),
    documentId: uuid('document_id')
      .notNull()
      .references(() => legalDocuments.id),
    subjectStudentId: uuid('subject_student_id').references(() => students.id, { onDelete: 'cascade' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    actorEmail: text('actor_email'),
    granted: boolean('granted').notNull(),
    method: consentMethod('method').notNull().default('form'),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    ip: text('ip'),
    userAgent: text('user_agent'),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [
    index('consent_records_student_idx').on(t.subjectStudentId),
    index('consent_records_actor_idx').on(t.actorUserId),
  ],
);
