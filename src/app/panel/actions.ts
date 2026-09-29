'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { guardianships, students } from '@/db/schema';
import { AssessmentError, startOrResumeAttempt } from '@/lib/assessment/service';
import { audit } from '@/lib/audit';
import { requireUser, studentAccess } from '@/lib/auth/dal';
import { hasActiveConsent, lockStudentConsent, recordConsent, revokeConsent } from '@/lib/consent';
import { rateLimit } from '@/lib/rate-limit';

export type ActionState = { ok?: boolean; message?: string; errors?: Record<string, string>; values?: Record<string, string> };

const childSchema = z.object({
  firstName: z.string().trim().min(2, 'Adını yazın.').max(60, 'En fazla 60 karakter.'),
  lastName: z
    .string()
    .trim()
    .max(60, 'En fazla 60 karakter.')
    .optional()
    .transform((v) => (v ? v : null)),
  grade: z.coerce.number().int().min(1, 'Sınıf seçin.').max(13, 'Sınıf seçin.'),
  birthYear: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= new Date().getFullYear() - 22 && v <= new Date().getFullYear() - 5), {
      message: 'Doğum yılını kontrol edin.',
    }),
  gender: z.enum(['female', 'male', 'unspecified']).optional().nullable(),
  relation: z.enum(['mother', 'father', 'legal_guardian', 'other'], { message: 'Yakınlık derecesini seçin.' }),
  guardian: z.literal('on', { message: 'Devam etmek için bu beyanı onaylamanız gerekiyor.' }),
});

export async function createChildAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser('/panel/cocuk/yeni');
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = {
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    grade: raw.grade ?? '',
    birthYear: raw.birthYear ?? '',
    gender: raw.gender ?? '',
    relation: raw.relation ?? '',
  };
  const parsed = childSchema.safeParse({ ...raw, gender: raw.gender || null });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  if (!(await rateLimit(`cocuk:${user.id}`, 20, 86400))) {
    return { message: 'Bugün çok sayıda profil oluşturuldu. Lütfen yarın tekrar deneyin ya da bizimle iletişime geçin.', values };
  }
  const d = parsed.data;
  const [child] = await db
    .insert(students)
    .values({
      firstName: d.firstName,
      lastName: d.lastName,
      grade: d.grade,
      birthYear: d.birthYear,
      gender: d.gender ?? null,
      createdByUserId: user.id,
    })
    .returning({ id: students.id });
  await db.insert(guardianships).values({ studentId: child.id, userId: user.id, relation: d.relation });
  if (formData.get('consentAssessment') === 'on') {
    await recordConsent({
      kind: 'explicit_consent',
      docKind: 'consent_assessment',
      granted: true,
      studentId: child.id,
      actorUserId: user.id,
    });
  }
  if (formData.get('consentAssessment') === 'on' && formData.get('consentResearch') === 'on') {
    await recordConsent({
      kind: 'explicit_consent',
      docKind: 'consent_research',
      granted: true,
      studentId: child.id,
      actorUserId: user.id,
    });
  }
  await audit({ actorUserId: user.id, action: 'student.create', entity: 'student', entityId: child.id });
  redirect(`/panel/cocuk/${child.id}?yeni=1`);
}

export async function startTestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const studentId = String(formData.get('studentId') ?? '');
  const slug = String(formData.get('slug') ?? '');
  const access = await studentAccess(studentId);
  if (!access.allowed || access.via !== 'guardian') redirect('/panel');
  // Okulun eklediği öğrencinin testlerini okul atar; veli panelinden test başlatılmaz.
  if (access.student.orgId) redirect(`/panel/cocuk/${studentId}?hata=okul`);
  if (!user.emailVerified) redirect(`/panel/cocuk/${studentId}?hata=dogrulama`);
  let attemptId: string;
  try {
    attemptId = await startOrResumeAttempt({
      studentId,
      grade: access.student.grade,
      slug,
      startedByUserId: user.id,
    });
  } catch (err) {
    if (err instanceof AssessmentError) redirect(`/panel/cocuk/${studentId}?hata=${err.code}`);
    throw err;
  }
  redirect(`/uygulama/${attemptId}`);
}

export async function setConsentAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const studentId = String(formData.get('studentId') ?? '');
  const kind = String(formData.get('kind') ?? '');
  const grant = formData.get('grant') === '1';
  if (kind !== 'consent_assessment' && kind !== 'consent_research') redirect('/panel');
  const access = await studentAccess(studentId);
  if (!access.allowed || access.via !== 'guardian') redirect('/panel');
  if (grant && formData.get('confirm') !== 'on') redirect(`/panel/cocuk/${studentId}?hata=onay`);
  // Öğrencinin rıza kilidiyle: okul aynı anda bu hesabın bağını kaldırıyor ya da onayı geçersiz sayıyorsa
  // bağ kilitten sonra yeniden denetlenir.
  const ok = await db.transaction(async (tx) => {
    await lockStudentConsent(tx, studentId);
    const [link] = await tx
      .select({ id: guardianships.id })
      .from(guardianships)
      .where(and(eq(guardianships.studentId, studentId), eq(guardianships.userId, user.id)))
      .limit(1);
    if (!link) return false;
    const active = await hasActiveConsent(studentId, kind, tx);
    if (grant && !active) {
      await recordConsent({ kind: 'explicit_consent', docKind: kind, granted: true, studentId, actorUserId: user.id }, tx);
    } else if (!grant && active) {
      // Ölçme rızası geri alınınca çocuğun uygulamaları geçersiz sayılır ve silinir (revokeConsent).
      await revokeConsent(studentId, kind, user.id, tx);
    }
    return true;
  });
  if (!ok) redirect('/panel');
  await audit({
    actorUserId: user.id,
    action: grant ? 'consent.grant' : 'consent.revoke',
    entity: 'student',
    entityId: studentId,
    meta: { kind },
  });
  revalidatePath(`/panel/cocuk/${studentId}`);
  redirect(`/panel/cocuk/${studentId}?riza=${grant ? 'verildi' : 'geri-alindi'}`);
}

const updateSchema = z.object({
  firstName: z.string().trim().min(2, 'Adını yazın.').max(60),
  lastName: z
    .string()
    .trim()
    .max(60)
    .optional()
    .transform((v) => (v ? v : null)),
  grade: z.coerce.number().int().min(1).max(13),
});

export async function updateChildAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const studentId = String(formData.get('studentId') ?? '');
  const access = await studentAccess(studentId);
  if (!access.allowed || access.via !== 'guardian') return { message: 'Bu profili düzenleme yetkiniz yok.' };
  if (access.student.orgId) return { message: 'Bu öğrencinin bilgilerini okul yönetir.' };
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: 'Bilgileri kontrol edin.' };
  await db
    .update(students)
    .set({ firstName: parsed.data.firstName, lastName: parsed.data.lastName, grade: parsed.data.grade })
    .where(eq(students.id, studentId));
  revalidatePath(`/panel/cocuk/${studentId}`);
  return { ok: true, message: 'Profil güncellendi.' };
}

/**
 * Profili siler: kayıt hemen görünmez olur ve oturumlar kapanır. Ölçme verileri ile profil
 * bilgileri günlük temizlik görevinde 30 gün içinde kalıcı olarak silinir (aydınlatma metni m.6).
 */
export async function deleteChildAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const studentId = String(formData.get('studentId') ?? '');
  if (formData.get('confirm') !== 'SİL') redirect(`/panel/cocuk/${studentId}?hata=silme-onayi`);
  const access = await studentAccess(studentId);
  if (!access.allowed || access.via !== 'guardian') redirect('/panel');
  // Okulun eklediği öğrenci veli tarafından silinmez; veli bağını kaldırabilir ya da rızasını geri alabilir.
  if (access.student.orgId) redirect(`/panel/cocuk/${studentId}`);
  await db
    .update(students)
    .set({ deletedAt: new Date() })
    .where(and(eq(students.id, studentId), isNull(students.deletedAt)));
  await revokeConsent(studentId, 'consent_assessment', user.id);
  await audit({ actorUserId: user.id, action: 'student.delete', entity: 'student', entityId: studentId });
  redirect('/panel?silindi=1');
}

/** Okulun eklediği öğrenciyi veli panelinden kaldırır (yalnızca veli bağı silinir). */
export async function unlinkChildAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const studentId = String(formData.get('studentId') ?? '');
  const access = await studentAccess(studentId);
  if (!access.allowed || access.via !== 'guardian') redirect('/panel');
  // Velinin kendi açtığı profil bağdan koparılmaz (sahipsiz kalır); o profil “Profili sil” ile silinir.
  if (!access.student.orgId) redirect(`/panel/cocuk/${studentId}`);
  await db.delete(guardianships).where(and(eq(guardianships.studentId, studentId), eq(guardianships.userId, user.id)));
  await audit({ actorUserId: user.id, action: 'guardian.unlink', entity: 'student', entityId: studentId });
  redirect('/panel?kaldirildi=1');
}
