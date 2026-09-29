import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, deletedAt, id, updatedAt } from './_common';
import { users } from './auth';
import { classes, organizations } from './org';

export const genderEnum = pgEnum('gender', ['female', 'male', 'unspecified']);

/**
 * Öğrenci profili. Veri en aza indirme ilkesi gereği yalnızca raporlama ve normlar için
 * gereken bilgiler tutulur: ad, sınıf düzeyi, doğum yılı. Öğrencinin e-posta adresi istenmez.
 *
 * `grade`: 1–12 arası sınıf düzeyi; 13 = mezun / üniversiteye hazırlanıyor.
 */
export const students = pgTable(
  'students',
  {
    id: id(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    birthYear: integer('birth_year'),
    grade: integer('grade').notNull(),
    gender: genderEnum('gender'),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'set null' }),
    schoolStudentNo: text('school_student_no'),
    /** Okul hesabıyla giriş yapan öğrenciler için kısa giriş kodunun özeti (HMAC). Kodun kendisi saklanmaz. */
    loginCodeHash: text('login_code_hash'),
    loginCodeIssuedAt: timestamp('login_code_issued_at', { withTimezone: true }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    index('students_org_idx').on(t.orgId),
    uniqueIndex('students_login_code_uq').on(t.loginCodeHash),
  ],
);

export const guardianRelation = pgEnum('guardian_relation', ['mother', 'father', 'legal_guardian', 'other']);

export const guardianships = pgTable(
  'guardianships',
  {
    id: id(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    relation: guardianRelation('relation').notNull(),
    isPrimary: boolean('is_primary').notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('guardianships_uq').on(t.studentId, t.userId),
    index('guardianships_user_idx').on(t.userId),
  ],
);

export const classStudents = pgTable(
  'class_students',
  {
    classId: uuid('class_id')
      .notNull()
      .references(() => classes.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    /** Okulun veliyle iletişimi için; yalnızca onay bağlantısı göndermek amacıyla kullanılır. */
    guardianEmail: text('guardian_email'),
  },
  (t) => [primaryKey({ columns: [t.classId, t.studentId] })],
);
