import {
  boolean,
  doublePrecision,
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
import { createdAt, id, updatedAt } from './_common';

export const instrumentDomain = pgEnum('instrument_domain', [
  'personality',
  'career',
  'academic',
  'cognitive',
  'wellbeing',
  'skills',
]);

/**
 * - draft: yalnızca yöneticiler görür
 * - pilot: Türkçe geçerlik/norm çalışması sürüyor; ücretsizdir ve raporda "ön sürüm" etiketi taşır
 * - active: yayında
 * - retired: yeni uygulama yapılmaz, eski raporlar görüntülenir
 */
export const instrumentStatus = pgEnum('instrument_status', ['draft', 'pilot', 'active', 'retired']);

export const licenseStatus = pgEnum('license_status', [
  'public_domain',
  'open_license',
  'permission_granted',
  'permission_pending',
  'original',
]);

export const instruments = pgTable(
  'instruments',
  {
    id: id(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    shortName: text('short_name').notNull(),
    domain: instrumentDomain('domain').notNull(),
    status: instrumentStatus('status').notNull().default('draft'),
    /** Test motoru: 'likert', 'reading', 'task:digit-span' gibi. */
    engine: text('engine').notNull(),
    minGrade: integer('min_grade').notNull(),
    maxGrade: integer('max_grade').notNull(),
    estimatedMinutes: integer('estimated_minutes').notNull(),
    licenseStatus: licenseStatus('license_status').notNull(),
    isFree: boolean('is_free').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('instruments_slug_uq').on(t.slug)],
);

/**
 * Her test sürümlüdür. Maddeler veya puanlama değişirse yeni sürüm oluşur;
 * eski cevaplar her zaman kendi sürümünün anahtarıyla puanlanır.
 */
export const instrumentVersions = pgTable(
  'instrument_versions',
  {
    id: id(),
    instrumentId: uuid('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    definition: jsonb('definition').$type<Record<string, unknown>>().notNull(),
    contentHash: text('content_hash').notNull(),
    isCurrent: boolean('is_current').notNull().default(true),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('instrument_versions_uq').on(t.instrumentId, t.version)],
);

export const scales = pgTable(
  'scales',
  {
    id: id(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => instrumentVersions.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    name: text('name').notNull(),
    parentKey: text('parent_key'),
  },
  (t) => [uniqueIndex('scales_uq').on(t.versionId, t.key)],
);

export const items = pgTable(
  'items',
  {
    id: id(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => instrumentVersions.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    position: integer('position').notNull(),
    text: text('text').notNull(),
    scaleKey: text('scale_key'),
    reverse: boolean('reverse').notNull().default(false),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
  },
  (t) => [uniqueIndex('items_uq').on(t.versionId, t.key), index('items_version_idx').on(t.versionId)],
);

export const normStatus = pgEnum('norm_status', ['provisional', 'final']);

/** Norm grupları: Türkiye örneklemlerinden (pilot verisi veya yayımlanmış çalışmalar) elde edilir. */
export const normSets = pgTable(
  'norm_sets',
  {
    id: id(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => instrumentVersions.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    gradeMin: integer('grade_min').notNull(),
    gradeMax: integer('grade_max').notNull(),
    n: integer('n').notNull(),
    status: normStatus('status').notNull().default('provisional'),
    source: text('source').notNull(),
    isActive: boolean('is_active').notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index('norm_sets_version_idx').on(t.versionId)],
);

export const normStats = pgTable(
  'norm_stats',
  {
    id: id(),
    normSetId: uuid('norm_set_id')
      .notNull()
      .references(() => normSets.id, { onDelete: 'cascade' }),
    scaleKey: text('scale_key').notNull(),
    n: integer('n').notNull(),
    mean: doublePrecision('mean').notNull(),
    sd: doublePrecision('sd').notNull(),
    reliability: doublePrecision('reliability'),
  },
  (t) => [uniqueIndex('norm_stats_uq').on(t.normSetId, t.scaleKey)],
);
