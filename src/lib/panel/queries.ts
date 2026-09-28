import 'server-only';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, guardianships, instrumentVersions, instruments, students } from '@/db/schema';
import { hasActiveConsent } from '@/lib/consent';

export async function listChildren(userId: string) {
  const rows = await db
    .select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      grade: students.grade,
      createdAt: students.createdAt,
      completed: sql<number>`(select count(*)::int from ${attempts} a where a.student_id = ${students.id} and a.status = 'completed')`,
      lastCompletedAt: sql<Date | null>`(select max(a.completed_at) from ${attempts} a where a.student_id = ${students.id} and a.status = 'completed')`,
    })
    .from(guardianships)
    .innerJoin(students, eq(students.id, guardianships.studentId))
    .where(and(eq(guardianships.userId, userId), isNull(students.deletedAt)))
    .orderBy(students.createdAt);
  return Promise.all(
    rows.map(async (r) => ({ ...r, hasConsent: await hasActiveConsent(r.id, 'consent_assessment') })),
  );
}

export async function studentAttempts(studentId: string) {
  return db
    .select({
      id: attempts.id,
      status: attempts.status,
      startedAt: attempts.startedAt,
      completedAt: attempts.completedAt,
      slug: instruments.slug,
      name: instruments.name,
      shortName: instruments.shortName,
    })
    .from(attempts)
    .innerJoin(instrumentVersions, eq(instrumentVersions.id, attempts.versionId))
    .innerJoin(instruments, eq(instruments.id, instrumentVersions.instrumentId))
    .where(eq(attempts.studentId, studentId))
    .orderBy(desc(attempts.startedAt));
}
