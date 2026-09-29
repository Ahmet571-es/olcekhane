import 'server-only';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, classAssignments, classStudents, classes, instrumentVersions, instruments, organizations } from '@/db/schema';

/**
 * Öğrencinin sınıflarına atanmış açık testler. Aynı test birden fazla sınıfa atanmışsa bir kez
 * gösterilir. Durum, atamadan sonra başlayan ya da tamamlanan uygulamaya göre belirlenir.
 */
export async function studentAssignments(studentId: string, grade: number) {
  const rows = await db
    .select({
      assignmentId: classAssignments.id,
      createdAt: classAssignments.createdAt,
      dueAt: classAssignments.dueAt,
      className: classes.name,
      instrumentId: instruments.id,
      slug: instruments.slug,
      name: instruments.name,
      estimatedMinutes: instruments.estimatedMinutes,
      minGrade: instruments.minGrade,
      maxGrade: instruments.maxGrade,
      status: instruments.status,
    })
    .from(classStudents)
    .innerJoin(classes, eq(classes.id, classStudents.classId))
    .innerJoin(classAssignments, eq(classAssignments.classId, classes.id))
    .innerJoin(instruments, eq(instruments.id, classAssignments.instrumentId))
    .where(and(eq(classStudents.studentId, studentId), isNull(classAssignments.closedAt)))
    .orderBy(asc(classAssignments.createdAt));

  const seen = new Set<string>();
  const out: (typeof rows[number] & { state: 'todo' | 'started' | 'done'; attemptId: string | null })[] = [];
  for (const r of rows) {
    if (seen.has(r.instrumentId)) continue;
    if (grade < r.minGrade || grade > r.maxGrade) continue;
    if (r.status !== 'active' && r.status !== 'pilot') continue;
    seen.add(r.instrumentId);
    const [a] = await db
      .select({ id: attempts.id, status: attempts.status })
      .from(attempts)
      .innerJoin(instrumentVersions, eq(instrumentVersions.id, attempts.versionId))
      .where(
        and(
          eq(attempts.studentId, studentId),
          eq(instrumentVersions.instrumentId, r.instrumentId),
          sql`${attempts.status} in ('completed', 'in_progress')`,
          // Tarih, sütun eşlemesi olmayan ham SQL'de parametre olarak geçtiği için ISO metnine çevrilir.
          sql`coalesce(${attempts.completedAt}, ${attempts.startedAt}) >= ${r.createdAt.toISOString()}::timestamptz`,
        ),
      )
      .orderBy(desc(attempts.startedAt))
      .limit(1);
    out.push({ ...r, state: a ? (a.status === 'completed' ? 'done' : 'started') : 'todo', attemptId: a?.id ?? null });
  }
  return out;
}

/** Öğrencinin tamamladığı bütün uygulamalar (kendi raporları için). */
export async function studentCompleted(studentId: string) {
  return db
    .select({ id: attempts.id, completedAt: attempts.completedAt, name: instruments.name, slug: instruments.slug })
    .from(attempts)
    .innerJoin(instrumentVersions, eq(instrumentVersions.id, attempts.versionId))
    .innerJoin(instruments, eq(instruments.id, instrumentVersions.instrumentId))
    .where(and(eq(attempts.studentId, studentId), eq(attempts.status, 'completed')))
    .orderBy(desc(attempts.completedAt));
}

export async function studentOrgName(orgId: string | null) {
  if (!orgId) return null;
  const [o] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
  return o?.name ?? null;
}
