import 'server-only';
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { consentRecords, legalDocuments } from '@/db/schema';
import { clientIp, userAgent } from '@/lib/request';

export type DocKind = (typeof legalDocuments.$inferSelect)['kind'];

/** Bir hukuki metnin yürürlükteki (en yüksek sürümlü, etkin) kaydı. */
export async function currentDocument(kind: DocKind) {
  const [doc] = await db
    .select()
    .from(legalDocuments)
    .where(and(eq(legalDocuments.kind, kind), eq(legalDocuments.isActive, true)))
    .orderBy(desc(legalDocuments.version))
    .limit(1);
  if (!doc) throw new Error(`Hukuki metin bulunamadı: ${kind}`);
  return doc;
}

/**
 * Öğrenci için belirli türdeki açık rızanın geçerli olup olmadığı.
 * Kural: o türdeki metinlerle ilgili en son kayıt "verildi" ve geri alınmamış olmalı.
 */
export async function hasActiveConsent(studentId: string, kind: DocKind): Promise<boolean> {
  const [latest] = await db
    .select({ granted: consentRecords.granted, revokedAt: consentRecords.revokedAt })
    .from(consentRecords)
    .innerJoin(legalDocuments, eq(legalDocuments.id, consentRecords.documentId))
    .where(
      and(
        eq(consentRecords.subjectStudentId, studentId),
        eq(legalDocuments.kind, kind),
        inArray(consentRecords.kind, ['explicit_consent', 'child_assent']),
      ),
    )
    .orderBy(desc(consentRecords.createdAt))
    .limit(1);
  return !!latest && latest.granted && !latest.revokedAt;
}

export async function recordConsent(entry: {
  kind: 'notice_ack' | 'explicit_consent' | 'child_assent';
  docKind: DocKind;
  granted: boolean;
  studentId?: string | null;
  actorUserId?: string | null;
  actorEmail?: string | null;
  method?: 'form' | 'email_link';
  meta?: Record<string, unknown>;
}) {
  const doc = await currentDocument(entry.docKind);
  await db.insert(consentRecords).values({
    kind: entry.kind,
    documentId: doc.id,
    subjectStudentId: entry.studentId ?? null,
    actorUserId: entry.actorUserId ?? null,
    actorEmail: entry.actorEmail ?? null,
    granted: entry.granted,
    method: entry.method ?? 'form',
    ip: await clientIp(),
    userAgent: await userAgent(),
    meta: entry.meta,
  });
}

/** Geri alma: yeni bir "verilmedi" kaydı eklenir ve açık kayıtlar geri alınmış olarak işaretlenir. */
export async function revokeConsent(studentId: string, docKind: DocKind, actorUserId: string) {
  const doc = await currentDocument(docKind);
  const docs = await db.select({ id: legalDocuments.id }).from(legalDocuments).where(eq(legalDocuments.kind, docKind));
  await db
    .update(consentRecords)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(consentRecords.subjectStudentId, studentId),
        inArray(
          consentRecords.documentId,
          docs.map((d) => d.id),
        ),
        isNull(consentRecords.revokedAt),
      ),
    );
  await db.insert(consentRecords).values({
    kind: 'explicit_consent',
    documentId: doc.id,
    subjectStudentId: studentId,
    actorUserId,
    granted: false,
    ip: await clientIp(),
    userAgent: await userAgent(),
  });
}
