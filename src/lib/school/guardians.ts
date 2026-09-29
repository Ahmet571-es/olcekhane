import 'server-only';
import { and, eq, inArray } from 'drizzle-orm';
import { db, type Exec } from '@/db';
import { classStudents, classes, guardianships, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { lockStudentConsent } from '@/lib/consent';
import { sendEmail } from '@/lib/email/send';
import { guardianUnlinkedTemplate } from '@/lib/email/templates';
import { activeConsentSource } from './queries';

export interface UnlinkTarget {
  id: string;
  userId: string;
  email: string;
  deletedAt: Date | null;
}

type UnlinkReason = 'school' | 'email_change' | 'void';

/** Öğrencinin okuldaki bütün sınıf kayıtlarındaki veli adresleri (küçük harfle). */
export async function guardianEmailsOnFile(studentId: string, orgId: string, exec: Exec = db): Promise<Set<string>> {
  const rows = await exec
    .select({ email: classStudents.guardianEmail })
    .from(classStudents)
    .innerJoin(classes, eq(classes.id, classStudents.classId))
    .where(and(eq(classStudents.studentId, studentId), eq(classes.orgId, orgId)));
  return new Set(rows.flatMap((r) => (r.email ? [r.email.toLowerCase()] : [])));
}

/**
 * Kaldırılacak veli bağları.
 * - `guardianshipIds` verilirse yalnızca o bağlar (rehber öğretmenin elle kaldırması).
 * - Verilmezse adresi okulun kayıtlı veli adreslerinden hiçbiriyle eşleşmeyen bağlar. Kural: bağlı veli
 *   hesabının adresi okulun kayıtlarında olmalıdır; okul adresi değiştirince eski adresin hesabı
 *   çocuğun raporlarını görmeye devam etmemeli.
 * - `keepConsentSource`: geçerli onayı veren hesap (onayın geldiği adresle aynı adresli hesap) bu
 *   kuraldan muaf tutulur. Veli adresini değiştirdiğinde ya da okul iletişim adresini diğer veliyle
 *   değiştirdiğinde onayı veren veli hesabını kaybetmemeli; onay yanlış kişiden alındıysa okul onayı
 *   geçersiz sayar ve o işlem bu hesabın bağını da kaldırır. `keptSource`, böyle bir hesap bırakıldıysa true.
 */
export async function findUnlinkTargets(
  exec: Exec,
  p: { studentId: string; orgId: string; guardianshipIds?: string[]; keepConsentSource?: boolean },
): Promise<{ targets: UnlinkTarget[]; keptSource: boolean }> {
  const linked = await exec
    .select({ id: guardianships.id, userId: guardianships.userId, email: users.email, deletedAt: users.deletedAt })
    .from(guardianships)
    .innerJoin(users, eq(users.id, guardianships.userId))
    .where(and(eq(guardianships.studentId, p.studentId), p.guardianshipIds ? inArray(guardianships.id, p.guardianshipIds) : undefined));
  if (p.guardianshipIds) return { targets: linked, keptSource: false };
  const onFile = await guardianEmailsOnFile(p.studentId, p.orgId, exec);
  let offFile = linked.filter((g) => !onFile.has(g.email.toLowerCase()));
  let keptSource = false;
  if (p.keepConsentSource && offFile.length > 0) {
    const source = await activeConsentSource(p.studentId, exec);
    const key = source?.email.toLowerCase();
    if (key && offFile.some((g) => g.email.toLowerCase() === key)) {
      keptSource = true;
      offFile = offFile.filter((g) => g.email.toLowerCase() !== key);
    }
  }
  return { targets: offFile, keptSource };
}

/** Bağları siler; gerçekten silinenleri döndürür. */
export async function deleteGuardianships(exec: Exec, studentId: string, targets: UnlinkTarget[]): Promise<UnlinkTarget[]> {
  if (targets.length === 0) return [];
  const removed = await exec
    .delete(guardianships)
    .where(and(eq(guardianships.studentId, studentId), inArray(guardianships.id, targets.map((g) => g.id))))
    .returning({ id: guardianships.id });
  const ids = new Set(removed.map((r) => r.id));
  return targets.filter((g) => ids.has(g.id));
}

/** Kaldırılan bağları denetim kaydına yazar ve hesap sahiplerine bildirir (işlem tamamlandıktan sonra). */
export async function reportUnlinked(
  p: { studentId: string; orgId: string; orgName: string; studentFirstName: string; actorUserId: string; reason: UnlinkReason },
  removed: UnlinkTarget[],
): Promise<void> {
  for (const g of removed) {
    await audit({
      actorUserId: p.actorUserId,
      action: 'guardian.unlink_by_school',
      entity: 'student',
      entityId: p.studentId,
      meta: { userId: g.userId, orgId: p.orgId, reason: p.reason },
    });
    if (!g.deletedAt) {
      await sendEmail({
        to: g.email,
        ...guardianUnlinkedTemplate({ orgName: p.orgName, studentName: p.studentFirstName, emailChanged: p.reason === 'email_change' }),
      });
    }
  }
}

/**
 * Okulun eklediği bir öğrencinin veli hesabı bağlarını kaldırır (kurallar için bkz. findUnlinkTargets),
 * her birini denetim kaydına yazar ve hesap sahibine e-postayla bildirir.
 */
export async function unlinkGuardians(p: {
  studentId: string;
  orgId: string;
  orgName: string;
  studentFirstName: string;
  actorUserId: string;
  reason: UnlinkReason;
  guardianshipIds?: string[];
  keepConsentSource?: boolean;
}): Promise<{ removed: string[]; keptSource: boolean }> {
  const { removed, keptSource } = await db.transaction(async (tx) => {
    await lockStudentConsent(tx, p.studentId);
    const found = await findUnlinkTargets(tx, p);
    return { removed: await deleteGuardianships(tx, p.studentId, found.targets), keptSource: found.keptSource };
  });
  await reportUnlinked(p, removed);
  return { removed: removed.map((g) => g.userId), keptSource };
}
