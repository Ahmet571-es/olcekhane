'use server';

import { and, asc, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { db } from '@/db';
import {
  classAssignments,
  classStudents,
  classTeachers,
  classes,
  consentRequests,
  memberships,
  orgInvites,
  sessions,
  students,
  users,
} from '@/db/schema';
import { currentVersion } from '@/lib/assessment/service';
import { audit } from '@/lib/audit';
import { newLoginCode } from '@/lib/auth/codes';
import { hashToken, randomToken } from '@/lib/auth/tokens';
import { sendEmail } from '@/lib/email/send';
import { consentRequestTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl } from '@/lib/request';
import { currentAcademicYear, requireClass, requireOrg } from '@/lib/school/access';
import { hasActiveConsent, lockStudentConsent, revokeConsent } from '@/lib/consent';
import { deleteGuardianships, findUnlinkTargets, reportUnlinked, unlinkGuardians } from '@/lib/school/guardians';
import { sendInvite } from '@/lib/school/invites';
import { parseStudentList } from '@/lib/school/import';
import { activeConsentSource, activeConsentSql } from '@/lib/school/queries';
import { isUuid } from '@/lib/uuid';

export type SchoolFormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  lines?: { line: number; message: string }[];
};

const CONSENT_REQUEST_DAYS = 365;

/* ---------- Sınıflar ---------- */

const classSchema = z.object({
  name: z.string().trim().min(1, 'Sınıfın adını yazın (ör. 7-A).').max(40, 'En fazla 40 karakter.'),
  grade: z.coerce.number().int().min(1, 'Sınıf düzeyini seçin.').max(12, 'Sınıf düzeyini seçin.'),
  academicYear: z.string().trim().regex(/^\d{4}-\d{4}$/, 'Öğretim yılını 2026-2027 biçiminde yazın.'),
});

export async function createClassAction(slug: string, _: SchoolFormState, formData: FormData): Promise<SchoolFormState> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) return { message: 'Sınıf oluşturma yetkiniz yok.' };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { name: raw.name ?? '', grade: raw.grade ?? '', academicYear: raw.academicYear ?? currentAcademicYear() };
  const parsed = classSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  const [dup] = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.orgId, ctx.org.id), eq(classes.name, parsed.data.name), eq(classes.academicYear, parsed.data.academicYear)))
    .limit(1);
  if (dup) return { errors: { name: 'Bu öğretim yılında aynı adla bir sınıf var.' }, values };
  const [cls] = await db
    .insert(classes)
    .values({ orgId: ctx.org.id, name: parsed.data.name, grade: parsed.data.grade, academicYear: parsed.data.academicYear })
    .returning({ id: classes.id });
  await audit({ actorUserId: ctx.user.id, action: 'class.create', entity: 'class', entityId: cls.id, meta: { orgId: ctx.org.id } });
  redirect(`/okul/${slug}/sinif/${cls.id}?yeni=1`);
}

export async function deleteClassAction(slug: string, classId: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) redirect(`/okul/${slug}`);
  const cls = await requireClass(ctx, classId);
  if (formData.get('confirm') !== cls.name) redirect(`/okul/${slug}/sinif/${classId}?hata=silme-onayi`);
  // Öğrenciler silinmez: başka sınıflarda olabilirler ve sonuçları velinin rızasıyla saklanır.
  await db.delete(classes).where(eq(classes.id, classId));
  await audit({ actorUserId: ctx.user.id, action: 'class.delete', entity: 'class', entityId: classId, meta: { orgId: ctx.org.id, name: cls.name } });
  redirect(`/okul/${slug}?silindi=1`);
}

/* ---------- Öğrenci aktarma ---------- */

export async function importStudentsAction(slug: string, classId: string, _: SchoolFormState, formData: FormData): Promise<SchoolFormState> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) return { message: 'Öğrenci ekleme yetkiniz yok.' };
  const cls = await requireClass(ctx, classId);
  const text = String(formData.get('list') ?? '');
  const values = { list: text };
  if (!text.trim()) return { message: 'Listeyi kutuya yapıştırın.', values };
  if (text.length > 60_000) return { message: 'Liste çok uzun. Bir seferde en fazla 200 öğrenci aktarabilirsiniz.', values };
  if (!(await rateLimit(`aktar:${ctx.org.id}`, 60, 3600))) return { message: 'Çok sık aktarma yapıldı. Bir saat sonra tekrar deneyin.', values };

  const { rows, errors } = parseStudentList(text);
  if (rows.length === 0) return { message: 'Listede aktarılabilecek öğrenci bulunamadı.', lines: errors, values };

  let added = 0;
  let existing = 0;
  let gradeChanged = 0;
  const emailChanges: { studentId: string; from: string; to: string }[] = [];
  const withEmail = new Map<string, string>();
  await db.transaction(async (tx) => {
    for (const r of rows) {
      // Önce okul numarasıyla (okul içinde), yoksa bu sınıftaki ad-soyadla eşleştir.
      let studentId: string | null = null;
      if (r.schoolNo) {
        const [s] = await tx
          .select({ id: students.id, grade: students.grade })
          .from(students)
          .where(and(eq(students.orgId, ctx.org.id), eq(students.schoolStudentNo, r.schoolNo), isNull(students.deletedAt)))
          .limit(1);
        studentId = s?.id ?? null;
        if (s && s.grade !== cls.grade) gradeChanged++;
      }
      if (!studentId) {
        const [s] = await tx
          .select({ id: students.id, grade: students.grade })
          .from(classStudents)
          .innerJoin(students, eq(students.id, classStudents.studentId))
          .where(
            and(
              eq(classStudents.classId, classId),
              eq(students.firstName, r.firstName),
              r.lastName ? eq(students.lastName, r.lastName) : isNull(students.lastName),
              isNull(students.deletedAt),
            ),
          )
          .limit(1);
        studentId = s?.id ?? null;
      }
      if (studentId) {
        existing++;
        await tx
          .update(students)
          .set({ grade: cls.grade, firstName: r.firstName, lastName: r.lastName, ...(r.schoolNo ? { schoolStudentNo: r.schoolNo } : {}) })
          .where(eq(students.id, studentId));
      } else {
        added++;
        const [s] = await tx
          .insert(students)
          .values({
            firstName: r.firstName,
            lastName: r.lastName,
            grade: cls.grade,
            orgId: ctx.org.id,
            schoolStudentNo: r.schoolNo,
            createdByUserId: ctx.user.id,
          })
          .returning({ id: students.id });
        studentId = s.id;
      }
      if (r.guardianEmail) {
        // Okulun herhangi bir sınıfında bu öğrenci için kayıtlı olmayan yeni bir adres, onay kararı
        // verebilecek yeni bir kişi demektir: başka sınıftaki kayıtlar da karşılaştırılır.
        const prev = await tx
          .select({ email: classStudents.guardianEmail })
          .from(classStudents)
          .innerJoin(classes, eq(classes.id, classStudents.classId))
          .where(and(eq(classStudents.studentId, studentId), eq(classes.orgId, ctx.org.id), isNotNull(classStudents.guardianEmail)));
        const known = [...new Set(prev.flatMap((p) => (p.email ? [p.email.toLowerCase()] : [])))];
        if (known.length > 0 && !known.includes(r.guardianEmail.toLowerCase())) {
          emailChanges.push({ studentId, from: known.join(', '), to: r.guardianEmail });
        }
        withEmail.set(studentId, r.firstName);
      }
      await tx
        .insert(classStudents)
        .values({ classId, studentId, guardianEmail: r.guardianEmail })
        .onConflictDoUpdate({
          target: [classStudents.classId, classStudents.studentId],
          set: r.guardianEmail ? { guardianEmail: r.guardianEmail } : { classId },
        });
    }
  });
  // Veli e-postası değişikliği, veli onayını kimin alacağını belirlediği için ayrıca kayda geçer ve
  // rehber öğretmenin öğrenci sayfasında görünür.
  for (const c of emailChanges) {
    await audit({ actorUserId: ctx.user.id, action: 'student.guardian_email_change', entity: 'student', entityId: c.studentId, meta: { classId, from: c.from, to: c.to } });
  }
  // Adresi artık okulun kayıtlarında olmayan veli hesaplarının bağı kaldırılır (ör. yanlış adres düzeltildi).
  // Onayı veren hesap bırakılır: onay yanlış kişiden alındıysa bu, öğrencinin sayfasından onayı geçersiz
  // sayarak düzeltilir.
  let unlinked = 0;
  let keptSources = 0;
  for (const [studentId, firstName] of withEmail) {
    const r = await unlinkGuardians({
      studentId,
      orgId: ctx.org.id,
      orgName: ctx.org.name,
      studentFirstName: firstName,
      actorUserId: ctx.user.id,
      reason: 'email_change',
      keepConsentSource: true,
    });
    unlinked += r.removed.length;
    if (r.keptSource) keptSources++;
  }
  await audit({
    actorUserId: ctx.user.id,
    action: 'class.import',
    entity: 'class',
    entityId: classId,
    meta: { orgId: ctx.org.id, added, existing, errors: errors.length },
  });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
  const parts = [`${added} öğrenci eklendi`];
  if (existing) parts.push(`${existing} öğrenci zaten kayıtlıydı, bilgileri güncellendi`);
  // Okul numarasıyla eşleşen öğrencinin sınıf düzeyi bu sınıfınkine çekilir (ör. yeni öğretim yılında 7’den 8’e).
  if (gradeChanged) parts.push(`${gradeChanged} öğrencinin sınıf düzeyi ${cls.grade}. sınıf olarak değiştirildi`);
  if (emailChanges.length) {
    parts.push(`${emailChanges.length} öğrencinin veli e-postası değişti (kayıtlarda artık bulunmayan adreslere giden bağlantılarla onay verilemez)`);
  }
  if (unlinked) parts.push(`adresi artık kayıtlı olmayan ${unlinked} veli hesabının öğrenciyle bağı kaldırıldı`);
  if (keptSources) {
    parts.push(
      `${keptSources} öğrencide onayı veren veli hesabı eski adresle bağlı kaldı; adres yanlış kişiye aitse öğrencinin sayfasından onayı geçersiz sayın`,
    );
  }
  return {
    ok: true,
    message: `${parts.join('; ')}.${errors.length ? ` ${errors.length} satır aktarılamadı.` : ''}`,
    lines: errors,
    values: errors.length ? values : { list: '' },
  };
}

export async function removeStudentFromClassAction(slug: string, classId: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) redirect(`/okul/${slug}`);
  await requireClass(ctx, classId);
  const studentId = String(formData.get('studentId') ?? '');
  if (!isUuid(studentId)) redirect(`/okul/${slug}/sinif/${classId}`);
  await db.delete(classStudents).where(and(eq(classStudents.classId, classId), eq(classStudents.studentId, studentId)));
  await audit({ actorUserId: ctx.user.id, action: 'class.remove_student', entity: 'class', entityId: classId, meta: { studentId } });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
}

/**
 * Rehber öğretmen, okulun öğrencisine bağlanmış bir veli hesabının bağını kaldırabilir (ör. yanlış
 * kişi bağlandıysa). Veli hesabı ve rıza kayıtları silinmez.
 */
export async function unlinkGuardianAction(slug: string, studentId: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.seeIndividual || !isUuid(studentId)) redirect(`/okul/${slug}`);
  const guardianshipId = String(formData.get('guardianshipId') ?? '');
  if (!isUuid(guardianshipId)) redirect(`/okul/${slug}/ogrenci/${studentId}`);
  const [st] = await db
    .select({ id: students.id, firstName: students.firstName })
    .from(students)
    .where(and(eq(students.id, studentId), eq(students.orgId, ctx.org.id), isNull(students.deletedAt)))
    .limit(1);
  if (!st) redirect(`/okul/${slug}`);
  await unlinkGuardians({
    studentId,
    orgId: ctx.org.id,
    orgName: ctx.org.name,
    studentFirstName: st.firstName,
    actorUserId: ctx.user.id,
    reason: 'school',
    guardianshipIds: [guardianshipId],
  });
  revalidatePath(`/okul/${slug}/ogrenci/${studentId}`);
}

/* ---------- Öğrenci giriş kodları ---------- */

export type IssuedCode = { studentId: string; name: string; code: string };
export type CodesState = { codes?: IssuedCode[]; className?: string; message?: string };

/**
 * Giriş kodu üretir. Kodlar veritabanında yalnızca özet olarak tutulduğu için yalnızca bu ekranda,
 * bir kez gösterilir; kaybolursa yenisi üretilir (eskisi geçersiz olur).
 */
export async function issueCodesAction(slug: string, classId: string, _: CodesState, formData: FormData): Promise<CodesState> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.issueCodes) return { message: 'Giriş kodu oluşturma yetkiniz yok.' };
  const cls = await requireClass(ctx, classId);
  const mode = formData.get('mode') === 'all' ? 'all' : 'missing';
  const onlyStudent = String(formData.get('studentId') ?? '');
  if (onlyStudent && !isUuid(onlyStudent)) return { message: 'Öğrenci bulunamadı.' };
  if (!(await rateLimit(`kod:${ctx.org.id}`, 100, 3600))) return { message: 'Çok sık kod üretildi. Bir saat sonra tekrar deneyin.' };

  const roster = await db
    .select({ id: students.id, firstName: students.firstName, lastName: students.lastName, issuedAt: students.loginCodeIssuedAt })
    .from(classStudents)
    .innerJoin(students, eq(students.id, classStudents.studentId))
    .where(and(eq(classStudents.classId, classId), isNull(students.deletedAt)))
    .orderBy(students.firstName, students.lastName);
  const targets = roster.filter((s) => (onlyStudent ? s.id === onlyStudent : mode === 'all' || !s.issuedAt));
  if (targets.length === 0) {
    return { message: mode === 'missing' ? 'Bu sınıftaki bütün öğrencilerin kodu zaten var. Kodu kaybolan öğrenciler için “Bütün kodları yenile” seçeneğini kullanın.' : 'Sınıfta öğrenci yok.' };
  }
  const codes: IssuedCode[] = [];
  await db.transaction(async (tx) => {
    for (const s of targets) {
      // Çakışma olasılığı çok düşük olsa da benzersizlik kısıtı ihlal edilirse yeniden dene.
      for (let attempt = 0; attempt < 5; attempt++) {
        const c = newLoginCode();
        const clash = await tx.select({ id: students.id }).from(students).where(eq(students.loginCodeHash, c.hash)).limit(1);
        if (clash.length) continue;
        await tx.update(students).set({ loginCodeHash: c.hash, loginCodeIssuedAt: new Date() }).where(eq(students.id, s.id));
        // Eski kodla açılmış oturumlar da kapanır (kod kaybolduysa başkasının elinde olabilir).
        await tx.delete(sessions).where(eq(sessions.studentId, s.id));
        codes.push({ studentId: s.id, name: `${s.firstName} ${s.lastName ?? ''}`.trim(), code: c.display });
        break;
      }
    }
  });
  await audit({
    actorUserId: ctx.user.id,
    action: 'class.issue_codes',
    entity: 'class',
    entityId: classId,
    meta: { orgId: ctx.org.id, count: codes.length, mode: onlyStudent ? 'single' : mode },
  });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
  return { codes, className: cls.name };
}

/* ---------- Veli onayı istekleri ---------- */

export async function sendConsentRequestsAction(slug: string, classId: string, _: SchoolFormState, formData: FormData): Promise<SchoolFormState> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.sendConsent) return { message: 'Onay isteği gönderme yetkiniz yok.' };
  await requireClass(ctx, classId);
  const onlyStudent = String(formData.get('studentId') ?? '');

  if (onlyStudent && !isUuid(onlyStudent)) return { message: 'Öğrenci bulunamadı.' };
  const roster = await db
    .select({
      id: students.id,
      firstName: students.firstName,
      email: classStudents.guardianEmail,
      consent: activeConsentSql(students.id),
      // Velinin daha önce verdiği karar (onay vermedi ya da geri aldı) toplu gönderimde yeniden sorulmaz.
      decided: sql<boolean>`exists (
        select 1 from consent_records cr join legal_documents d on d.id = cr.document_id
        where cr.subject_student_id = ${students.id} and d.kind = 'consent_assessment' and cr.kind in ('explicit_consent', 'child_assent')
      )`,
      recent: sql<boolean>`exists (select 1 from consent_requests r where r.student_id = ${students.id} and r.created_at > now() - interval '3 days')`,
      today: sql<boolean>`exists (select 1 from consent_requests r where r.student_id = ${students.id} and r.created_at > now() - interval '1 day')`,
    })
    .from(classStudents)
    .innerJoin(students, eq(students.id, classStudents.studentId))
    .where(and(eq(classStudents.classId, classId), isNull(students.deletedAt)));
  const list = onlyStudent ? roster.filter((r) => r.id === onlyStudent) : roster;
  const noEmail = list.filter((r) => !r.consent && !r.email).length;
  const consented = list.filter((r) => r.consent).length;
  // Tek öğrenci için: velinin önceki kararından bağımsız, günde en fazla bir istek. Toplu gönderim:
  // yalnızca hiç karar vermemiş velilere, üç günde en fazla bir kez.
  const declined = onlyStudent ? 0 : list.filter((r) => !r.consent && r.email && r.decided).length;
  const recent = onlyStudent ? list.filter((r) => !r.consent && r.email && r.today).length : list.filter((r) => !r.consent && r.email && !r.decided && r.recent).length;
  const targets = onlyStudent ? list.filter((r) => !r.consent && r.email && !r.today) : list.filter((r) => !r.consent && r.email && !r.decided && !r.recent);
  if (targets.length === 0) {
    return {
      message:
        consented === list.length
          ? 'Bu öğrencilerin hepsinin velisi zaten onay vermiş.'
          : onlyStudent && recent > 0
            ? 'Bu veliye son 24 saat içinde zaten istek gönderildi.'
            : declined > 0 && recent === 0 && noEmail === 0
              ? 'Onay bekleyen velilerin hepsi daha önce karar vermiş (onay vermedi ya da geri aldı). Bu velilere toplu istek gönderilmez; gerekirse öğrenci sayfasından tek tek gönderebilirsiniz.'
              : noEmail > 0 && recent === 0
                ? 'Onay bekleyen öğrencilerin veli e-postası kayıtlı değil. Listeyi veli e-postalarıyla yeniden aktarabilirsiniz.'
                : 'Onay bekleyen velilere son üç gün içinde zaten istek gönderildi.',
    };
  }
  if (!(await rateLimit(`onay:${ctx.org.id}`, 600, 86400))) return { message: 'Bugün çok sayıda onay isteği gönderildi. Yarın tekrar deneyin.' };

  let queued = 0;
  for (const t of targets) {
    const token = randomToken();
    await db.insert(consentRequests).values({
      studentId: t.id,
      orgId: ctx.org.id,
      email: t.email!,
      tokenHash: hashToken(token),
      requestedByUserId: ctx.user.id,
      expiresAt: new Date(Date.now() + CONSENT_REQUEST_DAYS * 86400_000),
    });
    const mail = consentRequestTemplate({
      orgName: ctx.org.name,
      studentName: t.firstName,
      link: appUrl(`/veli-onayi/${token}`),
      days: CONSENT_REQUEST_DAYS,
    });
    if ((await sendEmail({ to: t.email!, ...mail })).status === 'queued') queued++;
  }
  await audit({
    actorUserId: ctx.user.id,
    action: 'consent.request',
    entity: 'class',
    entityId: classId,
    meta: { orgId: ctx.org.id, sent: targets.length },
  });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
  const notes: string[] = [];
  if (noEmail) notes.push(`${noEmail} öğrencinin veli e-postası kayıtlı değil`);
  if (recent) notes.push(`${recent} veliye son üç gün içinde zaten gönderilmişti`);
  if (declined) notes.push(`${declined} veli daha önce karar verdiği için yeniden sorulmadı`);
  if (queued) notes.push(`${queued} e-posta, e-posta sağlayıcısının saatlik gönderim sınırı nedeniyle sırada; birkaç saat içinde kendiliğinden gönderilecek`);
  return { ok: true, message: `${targets.length} veliye onay isteği gönderildi.${notes.length ? ` ${notes.join('; ')}.` : ''}` };
}

/**
 * Veli e-postası yanlış kaydedildiği için onayı başka biri verdiyse rehber öğretmen onayı geçersiz
 * sayar ve güncel adrese yeni bir bağlantı gönderir. Geçersiz sayılan onaya dayanan ölçme verileri,
 * geri alınan rızalardaki gibi silinmek üzere işaretlenir; yeni onay gelene kadar test çözülemez.
 */
/**
 * Onay yanlış kişiden alındıysa (okul yanlış veli adresi kaydetmiş ve o adresin sahibi onay vermişse)
 * rehber öğretmen onayı geçersiz sayar. Tek bir veritabanı işleminde ve öğrencinin rıza kilidiyle:
 * 1. onayın geldiği adres (bağlantının gittiği adres ya da onayı veren veli hesabının adresi) okulun
 *    bütün sınıf kayıtlarından silinir;
 * 2. adresi okulun kayıtlarında kalmayan veli hesaplarının bağı kaldırılır (onayı veren hesap dahil);
 * 3. rıza geri alınmış sayılır ve öğrencinin bu onaya dayanan uygulamaları geçersiz olur;
 * 4. kayıtlarda doğru bir veli adresi kaldıysa (önce seçilen sınıfınki) o adrese yeni onay bağlantısı gider.
 * Bağlar rızadan önce kaldırılır: arada eski hesaptan yeniden onay verilemez.
 */
export async function voidConsentAction(slug: string, studentId: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.seeIndividual || !isUuid(studentId)) redirect(`/okul/${slug}`);
  const back = `/okul/${slug}/ogrenci/${studentId}`;
  if (formData.get('confirm') !== 'on') redirect(`${back}?hata=onay-kutusu`);
  const classId = String(formData.get('classId') ?? '');
  if (!isUuid(classId)) redirect(back);
  await requireClass(ctx, classId);
  const [row] = await db
    .select({ firstName: students.firstName })
    .from(classStudents)
    .innerJoin(students, eq(students.id, classStudents.studentId))
    .where(and(eq(classStudents.classId, classId), eq(classStudents.studentId, studentId), eq(students.orgId, ctx.org.id), isNull(students.deletedAt)))
    .limit(1);
  if (!row) redirect(back);
  if (!(await hasActiveConsent(studentId, 'consent_assessment'))) redirect(`${back}?hata=onay-yok`);
  // Aynı formun iki kez gönderilmesine karşı (ikinci bağlantı birincisini geçersiz kılardı) ve okulun
  // günlük onay isteği sınırı.
  if (!(await rateLimit(`onay-gecersiz:${studentId}`, 1, 600)) || !(await rateLimit(`onay:${ctx.org.id}`, 600, 86400))) {
    redirect(`${back}?hata=cok-deneme`);
  }

  const token = randomToken();
  const result = await db.transaction(async (tx) => {
    await lockStudentConsent(tx, studentId);
    if (!(await hasActiveConsent(studentId, 'consent_assessment', tx))) return null;
    const source = await activeConsentSource(studentId, tx);
    let clearedClassIds: string[] = [];
    if (source) {
      const cleared = await tx
        .update(classStudents)
        .set({ guardianEmail: null })
        .where(
          and(
            eq(classStudents.studentId, studentId),
            sql`lower(${classStudents.guardianEmail}) = lower(${source.email})`,
            inArray(classStudents.classId, tx.select({ id: classes.id }).from(classes).where(eq(classes.orgId, ctx.org.id))),
          ),
        )
        .returning({ classId: classStudents.classId });
      clearedClassIds = cleared.map((c) => c.classId);
    }
    const { targets } = await findUnlinkTargets(tx, { studentId, orgId: ctx.org.id });
    const removed = await deleteGuardianships(tx, studentId, targets);
    const actor = { userId: ctx.user.id, meta: { voided: true, orgId: ctx.org.id } };
    await revokeConsent(studentId, 'consent_assessment', actor, tx);
    if (await hasActiveConsent(studentId, 'consent_research', tx)) await revokeConsent(studentId, 'consent_research', actor, tx);
    // Yeni bağlantı: önce seçilen sınıftaki, yoksa başka bir sınıftaki kayıtlı adrese.
    const remaining = await tx
      .select({ classId: classStudents.classId, email: classStudents.guardianEmail })
      .from(classStudents)
      .innerJoin(classes, eq(classes.id, classStudents.classId))
      .where(and(eq(classStudents.studentId, studentId), eq(classes.orgId, ctx.org.id), isNotNull(classStudents.guardianEmail)))
      .orderBy(asc(classes.name));
    const to = (remaining.find((r) => r.classId === classId) ?? remaining[0])?.email ?? null;
    if (to) {
      await tx.insert(consentRequests).values({
        studentId,
        orgId: ctx.org.id,
        email: to,
        tokenHash: hashToken(token),
        requestedByUserId: ctx.user.id,
        expiresAt: new Date(Date.now() + CONSENT_REQUEST_DAYS * 86400_000),
      });
    }
    return { source, clearedClassIds, removed, to };
  });
  if (!result) redirect(`${back}?hata=onay-yok`);

  const { source, clearedClassIds, removed, to } = result;
  if (source && clearedClassIds.length > 0) {
    await audit({
      actorUserId: ctx.user.id,
      action: 'student.guardian_email_change',
      entity: 'student',
      entityId: studentId,
      meta: { classIds: clearedClassIds, from: source.email, to: null, reason: 'void' },
    });
  }
  await audit({
    actorUserId: ctx.user.id,
    action: 'consent.void_by_school',
    entity: 'student',
    entityId: studentId,
    meta: { orgId: ctx.org.id, source: source?.email ?? null, clearedClassIds, newEmail: to, unlinkedGuardians: removed.map((g) => g.userId) },
  });
  await reportUnlinked(
    { studentId, orgId: ctx.org.id, orgName: ctx.org.name, studentFirstName: row.firstName, actorUserId: ctx.user.id, reason: 'void' },
    removed,
  );
  revalidatePath(back);
  if (!to) redirect(`${back}?onay=gecersiz`);
  await sendEmail({
    to,
    ...consentRequestTemplate({ orgName: ctx.org.name, studentName: row.firstName, link: appUrl(`/veli-onayi/${token}`), days: CONSENT_REQUEST_DAYS }),
  });
  redirect(`${back}?onay=yenilendi`);
}

/* ---------- Test atama ---------- */

export async function assignTestAction(slug: string, classId: string, _: SchoolFormState, formData: FormData): Promise<SchoolFormState> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.assign) return { message: 'Test atama yetkisi yalnızca rehber öğretmendedir.' };
  const cls = await requireClass(ctx, classId);
  const instrumentSlug = String(formData.get('slug') ?? '');
  const def = getInstrumentDef(instrumentSlug);
  if (!def || !publicInstruments().some((i) => i.slug === instrumentSlug)) return { message: 'Test seçin.' };
  if (cls.grade < def.minGrade || cls.grade > def.maxGrade) return { message: `${def.name} bu sınıf düzeyine uygun değil.` };
  const dueRaw = String(formData.get('dueAt') ?? '');
  const dueAt = dueRaw ? new Date(`${dueRaw}T23:59:00+03:00`) : null;
  if (dueAt && (Number.isNaN(dueAt.getTime()) || dueAt.getTime() < Date.now())) return { message: 'Son tarih bugünden sonra olmalı.' };
  const cv = await currentVersion(instrumentSlug);
  if (!cv) return { message: 'Test henüz hazır değil.' };
  const [open] = await db
    .select({ id: classAssignments.id })
    .from(classAssignments)
    .where(and(eq(classAssignments.classId, classId), eq(classAssignments.instrumentId, cv.instrumentId), isNull(classAssignments.closedAt)))
    .limit(1);
  if (open) return { message: `${def.name} bu sınıfa zaten atanmış.` };
  const [a] = await db
    .insert(classAssignments)
    .values({ classId, instrumentId: cv.instrumentId, assignedByUserId: ctx.user.id, dueAt })
    .returning({ id: classAssignments.id });
  await audit({ actorUserId: ctx.user.id, action: 'class.assign', entity: 'class', entityId: classId, meta: { assignmentId: a.id, slug: instrumentSlug } });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
  return { ok: true, message: `${def.name} atandı. Öğrenciler kendi kodlarıyla giriş yaptıklarında testi görecek.` };
}

export async function closeAssignmentAction(slug: string, classId: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.assign) redirect(`/okul/${slug}/sinif/${classId}`);
  await requireClass(ctx, classId);
  const id = String(formData.get('assignmentId') ?? '');
  if (!isUuid(id)) redirect(`/okul/${slug}/sinif/${classId}`);
  await db
    .update(classAssignments)
    .set({ closedAt: new Date() })
    .where(and(eq(classAssignments.id, id), eq(classAssignments.classId, classId)));
  await audit({ actorUserId: ctx.user.id, action: 'class.assignment_close', entity: 'class', entityId: classId, meta: { assignmentId: id } });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
}

/* ---------- Sınıf öğretmenleri ---------- */

export async function setClassTeacherAction(slug: string, classId: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) redirect(`/okul/${slug}`);
  await requireClass(ctx, classId);
  const userId = String(formData.get('userId') ?? '');
  if (!isUuid(userId)) redirect(`/okul/${slug}/sinif/${classId}`);
  const remove = formData.get('remove') === '1';
  const [m] = await db
    .select({ id: memberships.id })
    .from(memberships)
    .where(and(eq(memberships.orgId, ctx.org.id), eq(memberships.userId, userId)))
    .limit(1);
  if (!m) redirect(`/okul/${slug}/sinif/${classId}`);
  if (remove) {
    await db.delete(classTeachers).where(and(eq(classTeachers.classId, classId), eq(classTeachers.userId, userId)));
  } else {
    await db.insert(classTeachers).values({ classId, userId }).onConflictDoNothing();
  }
  await audit({ actorUserId: ctx.user.id, action: remove ? 'class.teacher_remove' : 'class.teacher_add', entity: 'class', entityId: classId, meta: { userId } });
  revalidatePath(`/okul/${slug}/sinif/${classId}`);
}

/* ---------- Ekip ve davetler ---------- */

const inviteSchema = z.object({
  email: z.email('Geçerli bir e-posta adresi yazın.').max(200).transform((v) => v.trim().toLowerCase()),
  role: z.enum(['org_admin', 'counselor', 'teacher'], { message: 'Görevi seçin.' }),
});

export async function inviteMemberAction(slug: string, _: SchoolFormState, formData: FormData): Promise<SchoolFormState> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageMembers) return { message: 'Ekip yönetimi yetkisi yalnızca okul yöneticisindedir.' };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { email: raw.email ?? '', role: raw.role ?? '' };
  const parsed = inviteSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  const { email, role } = parsed.data;
  const base = (e: string) => e.toLowerCase().replace(/\+[^@]*@/, '@');
  if (base(email) === base(ctx.user.email)) {
    return {
      errors: { email: 'Kendinize davet gönderemezsiniz. Görevler, okulda o işi yapan kişiye verilir; rehber öğretmen görevi bireysel sonuçları görür.' },
      values,
    };
  }
  const [already] = await db
    .select({ id: memberships.id })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(and(eq(memberships.orgId, ctx.org.id), eq(users.email, email), eq(memberships.role, role)))
    .limit(1);
  if (already) return { errors: { email: 'Bu kişi bu görevle zaten ekipte.' }, values };
  if (!(await rateLimit(`davet:${ctx.org.id}`, 50, 86400))) return { message: 'Bugün çok sayıda davet gönderildi. Yarın tekrar deneyin.', values };
  await sendInvite({ orgId: ctx.org.id, orgName: ctx.org.name, email, role, inviterId: ctx.user.id, inviterName: ctx.user.fullName });
  await audit({ actorUserId: ctx.user.id, action: 'org.invite', entity: 'organization', entityId: ctx.org.id, meta: { email, role } });
  revalidatePath(`/okul/${slug}/ekip`);
  return { ok: true, message: `${email} adresine davet gönderildi.`, values: { email: '', role: '' } };
}

export async function revokeInviteAction(slug: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageMembers) redirect(`/okul/${slug}`);
  const id = String(formData.get('inviteId') ?? '');
  if (!isUuid(id)) redirect(`/okul/${slug}/ekip`);
  await db
    .update(orgInvites)
    .set({ revokedAt: new Date() })
    .where(and(eq(orgInvites.id, id), eq(orgInvites.orgId, ctx.org.id), isNull(orgInvites.acceptedAt)));
  await audit({ actorUserId: ctx.user.id, action: 'org.invite_revoke', entity: 'organization', entityId: ctx.org.id, meta: { inviteId: id } });
  revalidatePath(`/okul/${slug}/ekip`);
}

export async function removeMemberAction(slug: string, formData: FormData): Promise<void> {
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageMembers) redirect(`/okul/${slug}`);
  const membershipId = String(formData.get('membershipId') ?? '');
  if (!isUuid(membershipId)) redirect(`/okul/${slug}/ekip`);
  const [m] = await db
    .select({ id: memberships.id, userId: memberships.userId, role: memberships.role })
    .from(memberships)
    .where(and(eq(memberships.id, membershipId), eq(memberships.orgId, ctx.org.id)))
    .limit(1);
  if (!m) redirect(`/okul/${slug}/ekip`);
  // Son yönetici kaldırılamaz. Yönetici satırları kilitlenerek sayılır; aynı anda iki yöneticinin
  // birbirini kaldırması okulu yöneticisiz bırakamaz.
  const removed = await db.transaction(async (tx) => {
    if (m.role === 'org_admin') {
      const admins = await tx.execute(sql`select id from memberships where org_id = ${ctx.org.id} and role = 'org_admin' for update`);
      if (admins.length <= 1) return false;
    }
    await tx.delete(memberships).where(eq(memberships.id, m.id));
    return true;
  });
  if (!removed) redirect(`/okul/${slug}/ekip?hata=son-yonetici`);
  // Başka görevi kalmadıysa sınıf öğretmenliği kayıtları da kaldırılır.
  const [still] = await db
    .select({ id: memberships.id })
    .from(memberships)
    .where(and(eq(memberships.orgId, ctx.org.id), eq(memberships.userId, m.userId)))
    .limit(1);
  if (!still) {
    const orgClassIds = db.select({ id: classes.id }).from(classes).where(eq(classes.orgId, ctx.org.id));
    await db.delete(classTeachers).where(and(eq(classTeachers.userId, m.userId), inArray(classTeachers.classId, orgClassIds)));
  }
  await audit({ actorUserId: ctx.user.id, action: 'org.member_remove', entity: 'organization', entityId: ctx.org.id, meta: { userId: m.userId, role: m.role } });
  revalidatePath(`/okul/${slug}/ekip`);
  redirect(`/okul/${slug}/ekip`);
}
