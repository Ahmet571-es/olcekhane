import {
  bigserial,
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
import { createdAt, id } from './_common';
import { users } from './auth';
import { instruments, instrumentVersions, items, normSets } from './instruments';
import { classes, organizations } from './org';
import { students } from './students';

export const assignmentStatus = pgEnum('assignment_status', ['assigned', 'started', 'completed', 'cancelled']);

/** Okulun ya da velinin bir öğrenciye atadığı test. */
export const assignments = pgTable(
  'assignments',
  {
    id: id(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    instrumentId: uuid('instrument_id')
      .notNull()
      .references(() => instruments.id),
    assignedByUserId: uuid('assigned_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'set null' }),
    dueAt: timestamp('due_at', { withTimezone: true }),
    status: assignmentStatus('status').notNull().default('assigned'),
    createdAt: createdAt(),
  },
  (t) => [index('assignments_student_idx').on(t.studentId)],
);

/**
 * Okulda bir sınıfa atanan test. Sınıftaki bütün öğrenciler (sonradan eklenenler de) için geçerlidir;
 * tamamlanma, atamadan sonra tamamlanan uygulamalardan hesaplanır.
 */
export const classAssignments = pgTable(
  'class_assignments',
  {
    id: id(),
    classId: uuid('class_id')
      .notNull()
      .references(() => classes.id, { onDelete: 'cascade' }),
    instrumentId: uuid('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'cascade' }),
    assignedByUserId: uuid('assigned_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    dueAt: timestamp('due_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('class_assignments_class_idx').on(t.classId)],
);

export const attemptStatus = pgEnum('attempt_status', ['in_progress', 'completed', 'abandoned', 'invalidated']);
export const attemptMode = pgEnum('attempt_mode', ['standard', 'pilot', 'demo']);

export type QualityFlags = {
  tooFast?: boolean; // maddelere ortalama cevap süresi çok kısa
  straightLining?: boolean; // arka arkaya aynı cevap
  incomplete?: boolean;
  notes?: string[];
};

export const attempts = pgTable(
  'attempts',
  {
    id: id(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    versionId: uuid('version_id')
      .notNull()
      .references(() => instrumentVersions.id),
    assignmentId: uuid('assignment_id').references(() => assignments.id, { onDelete: 'set null' }),
    startedByUserId: uuid('started_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    status: attemptStatus('status').notNull().default('in_progress'),
    mode: attemptMode('mode').notNull().default('standard'),
    /** Başlangıçtaki sınıf düzeyi: normlar sınıfa göre seçilir, öğrenci sonra sınıf atlasa da bu değişmez. */
    gradeAtAttempt: integer('grade_at_attempt').notNull(),
    /** Bu uygulamanın verisi, isteğe bağlı araştırma rızası varsa norm çalışmalarına katılır. */
    researchConsent: boolean('research_consent').notNull().default(false),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    durationMs: integer('duration_ms'),
    deviceInfo: jsonb('device_info').$type<Record<string, unknown>>(),
    qualityFlags: jsonb('quality_flags').$type<QualityFlags>(),
    createdAt: createdAt(),
  },
  (t) => [
    index('attempts_student_idx').on(t.studentId),
    index('attempts_version_idx').on(t.versionId, t.status),
  ],
);

export const responses = pgTable(
  'responses',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id),
    itemKey: text('item_key').notNull(),
    value: doublePrecision('value'),
    valueText: text('value_text'),
    rtMs: integer('rt_ms'),
    changedCount: integer('changed_count').notNull().default(0),
    answeredAt: timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('responses_uq').on(t.attemptId, t.itemId)],
);

/** Okuma ve bilişsel görevlerde deneme düzeyinde ham veri (tepki süresi, doğruluk). */
export const taskTrials = pgTable(
  'task_trials',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    block: text('block').notNull(),
    trialIndex: integer('trial_index').notNull(),
    stimulus: jsonb('stimulus').$type<Record<string, unknown>>(),
    response: jsonb('response').$type<Record<string, unknown>>(),
    correct: boolean('correct'),
    rtMs: integer('rt_ms'),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('task_trials_uq').on(t.attemptId, t.block, t.trialIndex)],
);

export const scores = pgTable(
  'scores',
  {
    id: id(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    scaleKey: text('scale_key').notNull(),
    raw: doublePrecision('raw'),
    mean: doublePrecision('mean'),
    nAnswered: integer('n_answered').notNull(),
    nItems: integer('n_items').notNull(),
    z: doublePrecision('z'),
    t: doublePrecision('t'),
    percentile: doublePrecision('percentile'),
    band: text('band'),
    normSetId: uuid('norm_set_id').references(() => normSets.id, { onDelete: 'set null' }),
    ciLow: doublePrecision('ci_low'),
    ciHigh: doublePrecision('ci_high'),
    extra: jsonb('extra').$type<Record<string, unknown>>(),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('scores_uq').on(t.attemptId, t.scaleKey)],
);

export const reportAudience = pgEnum('report_audience', ['student', 'parent', 'teacher']);

/** Oluşturulan raporun o anki hâli: denetim ve tutarlılık için saklanır. */
export const reports = pgTable(
  'reports',
  {
    id: id(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    audience: reportAudience('audience').notNull(),
    templateVersion: text('template_version').notNull(),
    content: jsonb('content').$type<Record<string, unknown>>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('reports_uq').on(t.attemptId, t.audience)],
);

/**
 * Öğretmenlere gösterilen grup raporunun yayımlanmış hâli. Rapor her yeni sonuçla yeniden
 * hesaplanırsa, önceki ve sonraki rapor karşılaştırılarak tek bir öğrencinin sonucu bulunabilir
 * (fark alma). Bu yüzden öğretmen görünümü, yeni sonuçlar en az birkaç öğrencilik gruplar hâlinde
 * eklendiğinde güncellenen bu kayıtlardan okunur.
 */
export const groupReportSnapshots = pgTable(
  'group_report_snapshots',
  {
    id: id(),
    classId: uuid('class_id')
      .notNull()
      .references(() => classes.id, { onDelete: 'cascade' }),
    instrumentId: uuid('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'cascade' }),
    /** Rapora giren uygulamalar (sıralı). Fark hesabı için tutulur. */
    attemptIds: jsonb('attempt_ids').$type<string[]>().notNull(),
    n: integer('n').notNull(),
    report: jsonb('report').$type<Record<string, unknown>>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('group_report_snapshots_idx').on(t.classId, t.instrumentId, t.createdAt)],
);
