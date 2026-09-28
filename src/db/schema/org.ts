import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, deletedAt, id, updatedAt } from './_common';
import { users } from './auth';

export const orgKind = pgEnum('org_kind', ['school', 'institution']);

export const organizations = pgTable(
  'organizations',
  {
    id: id(),
    name: text('name').notNull(),
    kind: orgKind('kind').notNull().default('school'),
    slug: text('slug').notNull(),
    city: text('city'),
    district: text('district'),
    email: text('email'),
    phone: text('phone'),
    /** Okul düzeyindeki ayarlar: öğretmenlerin göreceği en küçük grup büyüklüğü vb. */
    settings: jsonb('settings').$type<{ minGroupSize?: number }>().notNull().default({}),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [uniqueIndex('organizations_slug_uq').on(t.slug)],
);

/**
 * Okul içi görevler:
 * - org_admin: okul yöneticisi (hesapları ve sınıfları yönetir, bireysel sonuç görmez)
 * - counselor: rehber öğretmen / psikolojik danışman (bireysel sonuçları görür)
 * - teacher: öğretmen (yalnızca grup özetlerini görür)
 */
export const membershipRole = pgEnum('membership_role', ['org_admin', 'counselor', 'teacher']);

export const memberships = pgTable(
  'memberships',
  {
    id: id(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: membershipRole('role').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('memberships_uq').on(t.orgId, t.userId, t.role),
    index('memberships_user_idx').on(t.userId),
  ],
);

export const classes = pgTable(
  'classes',
  {
    id: id(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    grade: integer('grade').notNull(),
    academicYear: text('academic_year').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('classes_org_idx').on(t.orgId)],
);

export const classTeachers = pgTable(
  'class_teachers',
  {
    classId: uuid('class_id')
      .notNull()
      .references(() => classes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.classId, t.userId] })],
);
