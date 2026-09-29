import { randomUUID } from 'node:crypto';
import { eq, inArray, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import {
  attempts,
  classStudents,
  classes,
  consentRecords,
  emailOutbox,
  groupReportSnapshots,
  guardianships,
  instrumentVersions,
  jobRuns,
  legalDocuments,
  organizations,
  rateLimits,
  students,
  users,
} from '@/db/schema';
import { runPurgeJob } from '@/lib/jobs/purge';

// Veritabanı gerektirir: npm run test:db. Temizlik görevi bütün veritabanında çalışır; test kendi
// kayıtlarını oluşturur, sonuçlarını denetler ve kalanları siler.
const DAY = 86400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY);
const tag = randomUUID().slice(0, 8);

describe('günlük temizlik görevi', () => {
  const ids: Record<string, string> = {};

  beforeAll(async () => {
    const [version] = await db.select({ id: instrumentVersions.id, instrumentId: instrumentVersions.instrumentId }).from(instrumentVersions).limit(1);
    if (!version) throw new Error('Test tanımları veritabanında yok: önce uygulamayı bir kez çalıştırın ya da npm run db:seed.');
    const [doc] = await db.select({ id: legalDocuments.id }).from(legalDocuments).where(eq(legalDocuments.kind, 'consent_assessment')).limit(1);
    const [org] = await db.insert(organizations).values({ name: `Temizlik ${tag}`, slug: `temizlik-${tag}` }).returning({ id: organizations.id });
    const [cls] = await db.insert(classes).values({ orgId: org.id, name: '7-T', grade: 7, academicYear: '2026-2027' }).returning({ id: classes.id });
    const [parent] = await db
      .insert(users)
      .values({ email: `temizlik-${tag}@ornek.test`, passwordHash: 'x', fullName: 'Temizlik Veli' })
      .returning({ id: users.id });
    ids.org = org.id;
    ids.parent = parent.id;

    // Etkin öğrenci: geçerli, geçersiz, uzun süredir yarım ve eski yarıda bırakılmış uygulamalar.
    const [active] = await db.insert(students).values({ firstName: 'Etkin', grade: 7, orgId: org.id }).returning({ id: students.id });
    ids.active = active.id;
    await db.insert(classStudents).values({ classId: cls.id, studentId: active.id, guardianEmail: `veli-${tag}@ornek.test` });
    const mk = (status: 'completed' | 'invalidated' | 'in_progress' | 'abandoned', last: Date) =>
      db
        .insert(attempts)
        .values({ studentId: active.id, versionId: version.id, gradeAtAttempt: 7, status, startedAt: last, lastActivityAt: last })
        .returning({ id: attempts.id })
        .then((r) => r[0].id);
    ids.valid = await mk('completed', ago(1));
    ids.invalid = await mk('invalidated', ago(1));
    ids.stalled = await mk('in_progress', ago(40));
    ids.oldAbandoned = await mk('abandoned', ago(100));
    ids.recentAbandoned = await mk('abandoned', ago(5));

    // Grup raporu kayıtları: eskisi silinmeli, en sonuncusunun içeriği (geçersiz uygulamayı içerdiği için) boşaltılmalı.
    const snap = (at: Date, attemptIds: string[]) =>
      db
        .insert(groupReportSnapshots)
        .values({ classId: cls.id, instrumentId: version.instrumentId, attemptIds, n: attemptIds.length, report: { format: 2, n: attemptIds.length }, createdAt: at })
        .returning({ id: groupReportSnapshots.id })
        .then((r) => r[0].id);
    ids.oldSnap = await snap(ago(3), [ids.valid]);
    ids.latestSnap = await snap(ago(1), [ids.valid, ids.invalid]);

    // Yakın zamanda silinmiş profil: bağları kalkmalı, kimliği anonimleşmeli, rıza kaydı kalmalı.
    const [recent] = await db
      .insert(students)
      .values({ firstName: 'Silinecek', lastName: 'Profil', birthYear: 2013, grade: 7, schoolStudentNo: '9999', deletedAt: ago(1) })
      .returning({ id: students.id });
    ids.recentDeleted = recent.id;
    await db.insert(guardianships).values({ studentId: recent.id, userId: parent.id, relation: 'mother' });
    await db.insert(attempts).values({ studentId: recent.id, versionId: version.id, gradeAtAttempt: 7, status: 'completed' });
    if (doc) await db.insert(consentRecords).values({ kind: 'explicit_consent', documentId: doc.id, subjectStudentId: recent.id, granted: true, method: 'form' });

    // Saklama süresi dolmuş silinmiş profil: bütünüyle silinmeli.
    const [expired] = await db.insert(students).values({ firstName: 'Eski', grade: 7, deletedAt: ago(800) }).returning({ id: students.id });
    ids.expiredDeleted = expired.id;
    if (doc) await db.insert(consentRecords).values({ kind: 'explicit_consent', documentId: doc.id, subjectStudentId: expired.id, granted: true, method: 'form' });

    // E-postalar ve sayaçlar.
    const mail = (status: 'sent' | 'failed', at: Date, body: string) =>
      db
        .insert(emailOutbox)
        .values({ toEmail: `mail-${tag}@ornek.test`, subject: `Temizlik ${tag}`, html: body, text: body, status, createdAt: at })
        .returning({ id: emailOutbox.id })
        .then((r) => r[0].id);
    ids.failedOld = await mail('failed', ago(40), 'gizli bağlantı');
    ids.failedNew = await mail('failed', ago(2), 'gizli bağlantı');
    ids.veryOld = await mail('sent', ago(100), '');
    await db.insert(rateLimits).values({ key: `temizlik-${tag}`, count: 3, windowStart: ago(3) });
  });

  afterAll(async () => {
    await db.delete(students).where(inArray(students.id, [ids.active, ids.recentDeleted, ids.expiredDeleted].filter(Boolean)));
    if (ids.org) await db.delete(organizations).where(eq(organizations.id, ids.org));
    if (ids.parent) await db.delete(users).where(eq(users.id, ids.parent));
    await db.delete(emailOutbox).where(eq(emailOutbox.subject, `Temizlik ${tag}`));
    await db.delete(rateLimits).where(eq(rateLimits.key, `temizlik-${tag}`));
  });

  it('saklama kurallarını uygular ve çalışmayı kaydeder', async () => {
    const report = await runPurgeJob('yönetici');
    expect(report).not.toBeNull();

    const left = await db.select({ id: attempts.id, status: attempts.status }).from(attempts).where(eq(attempts.studentId, ids.active));
    const status = Object.fromEntries(left.map((a) => [a.id, a.status]));
    expect(status[ids.valid]).toBe('completed');
    expect(status[ids.invalid]).toBeUndefined();
    expect(status[ids.stalled]).toBe('abandoned');
    expect(status[ids.oldAbandoned]).toBeUndefined();
    expect(status[ids.recentAbandoned]).toBe('abandoned');

    const snaps = await db.select({ id: groupReportSnapshots.id, report: groupReportSnapshots.report }).from(groupReportSnapshots).where(inArray(groupReportSnapshots.id, [ids.oldSnap, ids.latestSnap]));
    expect(snaps.map((x) => x.id)).toEqual([ids.latestSnap]);
    expect(snaps[0].report).toEqual({ format: 0, purged: true });

    const [recent] = await db.select().from(students).where(eq(students.id, ids.recentDeleted));
    expect(recent).toMatchObject({ firstName: 'Silinmiş profil', lastName: null, birthYear: null, schoolStudentNo: null });
    expect(await db.select().from(guardianships).where(eq(guardianships.studentId, ids.recentDeleted))).toHaveLength(0);
    expect(await db.select().from(attempts).where(eq(attempts.studentId, ids.recentDeleted))).toHaveLength(0);
    const evidence = await db.select().from(consentRecords).where(eq(consentRecords.subjectStudentId, ids.recentDeleted));
    expect(evidence.length).toBeGreaterThan(0);

    expect(await db.select().from(students).where(eq(students.id, ids.expiredDeleted))).toHaveLength(0);
    expect(await db.select().from(consentRecords).where(eq(consentRecords.subjectStudentId, ids.expiredDeleted))).toHaveLength(0);

    const mails = await db.select({ id: emailOutbox.id, html: emailOutbox.html }).from(emailOutbox).where(eq(emailOutbox.subject, `Temizlik ${tag}`));
    const body = Object.fromEntries(mails.map((m) => [m.id, m.html]));
    expect(body[ids.failedOld]).toBe('');
    expect(body[ids.failedNew]).toBe('gizli bağlantı');
    expect(body[ids.veryOld]).toBeUndefined();
    expect(await db.select().from(rateLimits).where(eq(rateLimits.key, `temizlik-${tag}`))).toHaveLength(0);

    const [run] = await db.select().from(jobRuns).where(eq(jobRuns.job, 'temizlik')).orderBy(sql`started_at desc`).limit(1);
    expect(run).toMatchObject({ ok: true, trigger: 'yönetici' });
    expect(run.finishedAt).not.toBeNull();
  });

  it('başka bir çalışma sürerken hiçbir şey yapmaz ve kayıt bırakmaz', async () => {
    let release!: () => void;
    const hold = new Promise<void>((r) => (release = r));
    let acquired!: () => void;
    const locked = new Promise<void>((r) => (acquired = r));
    const holder = db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('job:temizlik', 0))`);
      acquired();
      await hold;
    });
    await locked;
    const runsBefore = await db.$count(jobRuns);
    const result = await runPurgeJob('yönetici');
    release();
    await holder;
    expect(result).toBeNull();
    expect(await db.$count(jobRuns)).toBe(runsBefore);
  });
});
