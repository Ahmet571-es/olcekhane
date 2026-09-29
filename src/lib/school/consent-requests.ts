import 'server-only';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { db, type Exec } from '@/db';
import { consentRequests, organizations, students } from '@/db/schema';
import { hashToken } from '@/lib/auth/tokens';

export interface ConsentRequestInfo {
  id: string;
  studentId: string;
  orgId: string | null;
  email: string;
  expiresAt: Date;
  openedAt: Date | null;
  studentFirstName: string;
  orgName: string | null;
  /** Onay vermek, reddetmek ya da hesaba bağlamak için: en son bağlantı, güncel adres, süresi dolmamış. */
  canDecide: boolean;
  /** Rızayı geri almak için: rıza bu bağlantıdan verildiyse her zaman; değilse bağlantı en son bağlantıysa ve güncel adrese gittiyse. */
  canRevoke: boolean;
}

/**
 * Veli onayı bağlantısının isteği.
 * - Onay vermek, reddetmek ve hesaba bağlamak yalnızca öğrenci için gönderilmiş EN SON bağlantıyla,
 *   bağlantının gittiği adres okulun kayıtlarındaki güncel veli e-postasıyken ve süresi dolmamışken
 *   yapılabilir. Böylece yanlış adrese gitmiş eski bir bağlantı, okul adresi düzeltip yeniden
 *   gönderdiğinde işe yaramaz.
 * - Rıza hangi bağlantıdan verildiyse o bağlantıdan her zaman geri alınabilir (adres değişse ya da
 *   süre dolsa bile): geri almak, vermek kadar kolay olmalıdır. Rıza başka yoldan verildiyse (ör. bağlı
 *   veli hesabından), geri alma yalnızca en son bağlantıyla ve bu bağlantı okulun kayıtlı veli adresine
 *   gittiyse yapılabilir. Geri alma öğrencinin uygulamalarını kalıcı olarak geçersiz kıldığı için eski
 *   ya da artık kayıtlı olmayan bir adrese gitmiş bağlantıya bu yetki verilmez.
 */
export async function consentRequestByToken(token: string, exec: Exec = db): Promise<ConsentRequestInfo | null> {
  if (!token || token.length > 100) return null;
  const [r] = await exec
    .select({
      id: consentRequests.id,
      studentId: consentRequests.studentId,
      orgId: consentRequests.orgId,
      email: consentRequests.email,
      expiresAt: consentRequests.expiresAt,
      openedAt: consentRequests.openedAt,
      studentFirstName: students.firstName,
      orgName: organizations.name,
      latest: sql<boolean>`not exists (
        select 1 from consent_requests newer
        where newer.student_id = ${consentRequests.studentId} and newer.created_at > ${consentRequests.createdAt}
      )`,
      emailMatches: sql<boolean>`exists (
        select 1 from class_students cs join classes c on c.id = cs.class_id
        where cs.student_id = ${consentRequests.studentId} and c.org_id = ${consentRequests.orgId}
          and lower(cs.guardian_email) = lower(${consentRequests.email})
      )`,
      usedHere: sql<boolean>`exists (
        select 1 from consent_records cr
        where cr.subject_student_id = ${consentRequests.studentId} and cr.meta->>'requestId' = ${consentRequests.id}::text
      )`,
      grantedHere: sql<boolean>`exists (
        select 1 from consent_records cr join legal_documents d on d.id = cr.document_id
        where cr.subject_student_id = ${consentRequests.studentId} and d.kind = 'consent_assessment'
          and cr.kind = 'explicit_consent' and cr.granted and cr.revoked_at is null
          and cr.meta->>'requestId' = ${consentRequests.id}::text
      )`,
    })
    .from(consentRequests)
    .innerJoin(students, eq(students.id, consentRequests.studentId))
    .leftJoin(organizations, eq(organizations.id, consentRequests.orgId))
    .where(and(eq(consentRequests.tokenHash, hashToken(token)), isNull(students.deletedAt)))
    .limit(1);
  if (!r) return null;
  const canDecide = r.latest && r.emailMatches && r.expiresAt.getTime() > Date.now();
  const canRevoke = r.grantedHere || (r.latest && r.emailMatches);
  // Bu bağlantıyla daha önce karar verildiyse sayfa, durumu göstermek için açık kalır.
  if (!canDecide && !canRevoke && !r.usedHere) return null;
  return {
    id: r.id,
    studentId: r.studentId,
    orgId: r.orgId,
    email: r.email,
    expiresAt: r.expiresAt,
    openedAt: r.openedAt,
    studentFirstName: r.studentFirstName,
    orgName: r.orgName,
    canDecide,
    canRevoke,
  };
}

export async function markConsentRequestOpened(id: string) {
  await db.update(consentRequests).set({ openedAt: new Date() }).where(and(eq(consentRequests.id, id), isNull(consentRequests.openedAt)));
}
