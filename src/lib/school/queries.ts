import 'server-only';
import { and, asc, eq, inArray, isNull, sql, type SQL } from 'drizzle-orm';
import { db, type Exec } from '@/db';
import {
  attempts,
  classAssignments,
  classStudents,
  classTeachers,
  classes,
  consentRequests,
  guardianships,
  instrumentVersions,
  instruments,
  memberships,
  students,
  users,
} from '@/db/schema';
import type { OrgContext } from './access';

/**
 * Öğrencinin ölçme verileri için açık rızası geçerli mi? `hasActiveConsent` ile aynı kural: o türdeki
 * metinlerle ilgili en son kayıt “verildi” ve geri alınmamış olmalı. Listelerde öğrenci başına ayrı
 * sorgu atmamak için SQL parçası olarak yazılmıştır.
 */
export function activeConsentSql(
  studentId: SQL | typeof students.id,
  kind: 'consent_assessment' | 'consent_research' = 'consent_assessment',
): SQL<boolean> {
  return sql<boolean>`coalesce((
    select cr.granted and cr.revoked_at is null
    from consent_records cr
    join legal_documents d on d.id = cr.document_id
    where cr.subject_student_id = ${studentId}
      and d.kind = ${kind}
      and cr.kind in ('explicit_consent', 'child_assent')
    order by cr.created_at desc
    limit 1
  ), false)`;
}

export async function orgClasses(ctx: OrgContext) {
  const base = db
    .select({
      id: classes.id,
      name: classes.name,
      grade: classes.grade,
      academicYear: classes.academicYear,
      students: sql<number>`(select count(*)::int from class_students cs join students s on s.id = cs.student_id and s.deleted_at is null where cs.class_id = ${classes.id})`,
      consented: sql<number>`(select count(*)::int from class_students cs join students s on s.id = cs.student_id and s.deleted_at is null where cs.class_id = ${classes.id} and ${activeConsentSql(sql`s.id`)})`,
      openAssignments: sql<number>`(select count(*)::int from class_assignments ca where ca.class_id = ${classes.id} and ca.closed_at is null)`,
    })
    .from(classes);
  const where = ctx.can.seeAllClasses
    ? eq(classes.orgId, ctx.org.id)
    : and(
        eq(classes.orgId, ctx.org.id),
        sql`exists (select 1 from class_teachers ct where ct.class_id = ${classes.id} and ct.user_id = ${ctx.user.id})`,
      );
  return base.where(where).orderBy(asc(classes.grade), asc(classes.name));
}

/** Okul geneli katılım: öğrenci sayısı, rızası olanlar, tamamlanan uygulamalar. Puan içermez. */
export async function orgParticipation(orgId: string) {
  const [row] = await db
    .select({
      students: sql<number>`count(*)::int`,
      consented: sql<number>`count(*) filter (where ${activeConsentSql(students.id)})::int`,
      completed: sql<number>`(select count(*)::int from attempts a join students s2 on s2.id = a.student_id where s2.org_id = ${orgId} and s2.deleted_at is null and a.status = 'completed')`,
    })
    .from(students)
    .where(and(eq(students.orgId, orgId), isNull(students.deletedAt)));
  return row ?? { students: 0, consented: 0, completed: 0 };
}

export type RosterRow = Awaited<ReturnType<typeof classRoster>>[number];

export async function classRoster(classId: string) {
  return db
    .select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      schoolStudentNo: students.schoolStudentNo,
      grade: students.grade,
      guardianEmail: classStudents.guardianEmail,
      loginCodeIssuedAt: students.loginCodeIssuedAt,
      consent: activeConsentSql(students.id),
      lastRequestAt: sql<Date | null>`(select max(r.created_at) from consent_requests r where r.student_id = ${students.id})`,
      lastDecision: sql<string | null>`(select r.decision from consent_requests r where r.student_id = ${students.id} and r.responded_at is not null order by r.responded_at desc limit 1)`,
      completed: sql<number>`(select count(*)::int from attempts a where a.student_id = ${students.id} and a.status = 'completed')`,
    })
    .from(classStudents)
    .innerJoin(students, eq(students.id, classStudents.studentId))
    .where(and(eq(classStudents.classId, classId), isNull(students.deletedAt)))
    .orderBy(asc(students.firstName), asc(students.lastName));
}

/** Sınıfa atanmış testler ve ilerleme: atamadan sonra tamamlayan ve başlayan öğrenci sayıları. */
export async function classAssignmentProgress(classId: string) {
  return db
    .select({
      id: classAssignments.id,
      createdAt: classAssignments.createdAt,
      dueAt: classAssignments.dueAt,
      closedAt: classAssignments.closedAt,
      instrumentId: instruments.id,
      slug: instruments.slug,
      name: instruments.name,
      shortName: instruments.shortName,
      minGrade: instruments.minGrade,
      maxGrade: instruments.maxGrade,
      students: sql<number>`(select count(*)::int from class_students cs join students s on s.id = cs.student_id and s.deleted_at is null where cs.class_id = ${classAssignments.classId})`,
      completed: sql<number>`(select count(distinct a.student_id)::int
        from attempts a
        join instrument_versions v on v.id = a.version_id
        join class_students cs on cs.student_id = a.student_id and cs.class_id = ${classAssignments.classId}
        join students s on s.id = a.student_id and s.deleted_at is null
        where v.instrument_id = ${classAssignments.instrumentId} and a.status = 'completed' and a.completed_at >= ${classAssignments.createdAt})`,
      started: sql<number>`(select count(distinct a.student_id)::int
        from attempts a
        join instrument_versions v on v.id = a.version_id
        join class_students cs on cs.student_id = a.student_id and cs.class_id = ${classAssignments.classId}
        join students s on s.id = a.student_id and s.deleted_at is null
        where v.instrument_id = ${classAssignments.instrumentId} and a.status = 'in_progress' and a.started_at >= ${classAssignments.createdAt})`,
    })
    .from(classAssignments)
    .innerJoin(instruments, eq(instruments.id, classAssignments.instrumentId))
    .where(eq(classAssignments.classId, classId))
    .orderBy(asc(classAssignments.createdAt));
}

/** Öğrenci başına atanan testlerin durumu: tamamlandı / başladı. Anahtar: `${studentId}:${assignmentId}`. */
export async function assignmentStatusMap(classId: string): Promise<Map<string, 'done' | 'started'>> {
  const rows = await db
    .select({
      studentId: attempts.studentId,
      assignmentId: classAssignments.id,
      status: attempts.status,
    })
    .from(classAssignments)
    .innerJoin(classStudents, eq(classStudents.classId, classAssignments.classId))
    .innerJoin(instrumentVersions, eq(instrumentVersions.instrumentId, classAssignments.instrumentId))
    .innerJoin(
      attempts,
      and(
        eq(attempts.versionId, instrumentVersions.id),
        eq(attempts.studentId, classStudents.studentId),
        sql`coalesce(${attempts.completedAt}, ${attempts.startedAt}) >= ${classAssignments.createdAt}`,
      ),
    )
    .where(and(eq(classAssignments.classId, classId), inArray(attempts.status, ['completed', 'in_progress'])));
  const map = new Map<string, 'done' | 'started'>();
  for (const r of rows) {
    const k = `${r.studentId}:${r.assignmentId}`;
    if (r.status === 'completed') map.set(k, 'done');
    else if (!map.has(k)) map.set(k, 'started');
  }
  return map;
}

export async function classTeacherList(classId: string) {
  return db
    .select({ userId: users.id, fullName: users.fullName, email: users.email })
    .from(classTeachers)
    .innerJoin(users, eq(users.id, classTeachers.userId))
    .where(eq(classTeachers.classId, classId))
    .orderBy(asc(users.fullName));
}

export async function orgMembers(orgId: string) {
  const rows = await db
    .select({ userId: users.id, fullName: users.fullName, email: users.email, role: memberships.role, membershipId: memberships.id })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(and(eq(memberships.orgId, orgId), isNull(users.deletedAt)))
    .orderBy(asc(users.fullName));
  return rows;
}

/** Ekip sayfası için: hangi öğretmen hangi sınıflara bağlı (öğretmen kimliği → sınıf adları). */
export async function orgTeacherClasses(orgId: string): Promise<Map<string, string[]>> {
  const rows = await db
    .select({ userId: classTeachers.userId, name: classes.name })
    .from(classTeachers)
    .innerJoin(classes, eq(classes.id, classTeachers.classId))
    .where(eq(classes.orgId, orgId))
    .orderBy(asc(classes.name));
  const out = new Map<string, string[]>();
  for (const r of rows) out.set(r.userId, [...(out.get(r.userId) ?? []), r.name]);
  return out;
}

/** Bir öğrencinin bu okuldaki sınıfları (rehber öğretmen görünümü için). */
export async function studentClassesInOrg(studentId: string, orgId: string) {
  return db
    .select({ id: classes.id, name: classes.name, grade: classes.grade, guardianEmail: classStudents.guardianEmail })
    .from(classStudents)
    .innerJoin(classes, eq(classes.id, classStudents.classId))
    .where(and(eq(classStudents.studentId, studentId), eq(classes.orgId, orgId)))
    .orderBy(asc(classes.name));
}

export interface ConsentSource {
  email: string;
  /** link: okulun gönderdiği onay bağlantısından; account: bağlı veli hesabından verildi. */
  via: 'link' | 'account';
}

/**
 * Geçerli veli onayının kimden geldiği: onay bağlantısından verildiyse bağlantının gönderildiği adres,
 * veli hesabından verildiyse o hesabın adresi. Belirlenemezse null.
 */
export async function activeConsentSource(studentId: string, exec: Exec = db): Promise<ConsentSource | null> {
  const rows = await exec.execute<{ req_email: string | null; user_email: string | null; actor_email: string | null }>(sql`
    select req.email as req_email, u.email as user_email, cr.actor_email
    from consent_records cr
    join legal_documents d on d.id = cr.document_id
    left join consent_requests req on req.id::text = cr.meta->>'requestId'
    left join users u on u.id = cr.actor_user_id
    where cr.subject_student_id = ${studentId} and d.kind = 'consent_assessment'
      and cr.kind = 'explicit_consent' and cr.granted and cr.revoked_at is null
    order by cr.created_at desc
    limit 1`);
  const r = rows[0];
  if (!r) return null;
  if (r.req_email) return { email: r.req_email, via: 'link' };
  if (r.user_email) return { email: r.user_email, via: 'account' };
  if (r.actor_email) return { email: r.actor_email, via: 'link' };
  return null;
}

/** Okulun eklediği öğrenciye bağlanmış veli hesapları (rehber öğretmen görünümü için). */
export async function linkedGuardians(studentId: string) {
  return db
    .select({ id: guardianships.id, fullName: users.fullName, email: users.email, relation: guardianships.relation, createdAt: guardianships.createdAt })
    .from(guardianships)
    .innerJoin(users, eq(users.id, guardianships.userId))
    .where(and(eq(guardianships.studentId, studentId), isNull(users.deletedAt)))
    .orderBy(asc(guardianships.createdAt));
}

/** Öğrencinin veli e-postasının en son ne zaman ve kim tarafından değiştirildiği (denetim kaydından). */
export async function lastGuardianEmailChange(studentId: string) {
  const [r] = await db.execute<{ created_at: Date; full_name: string | null }>(sql`
    select a.created_at, u.full_name from audit_logs a left join users u on u.id = a.actor_user_id
    where a.action = 'student.guardian_email_change' and a.entity_id = ${studentId}
    order by a.id desc limit 1
  `);
  return r ? { at: new Date(r.created_at), by: r.full_name } : null;
}

export async function lastConsentRequest(studentId: string) {
  const [r] = await db
    .select({ createdAt: consentRequests.createdAt, decision: consentRequests.decision, respondedAt: consentRequests.respondedAt, email: consentRequests.email })
    .from(consentRequests)
    .where(eq(consentRequests.studentId, studentId))
    .orderBy(sql`${consentRequests.createdAt} desc`)
    .limit(1);
  return r ?? null;
}
