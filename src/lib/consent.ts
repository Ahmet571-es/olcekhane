import 'server-only';
import { and, desc, eq, inArray, isNull, ne, sql } from 'drizzle-orm';
import { db, type Exec, type Tx } from '@/db';
import { attempts, consentRecords, legalDocuments } from '@/db/schema';
import { clientIp, userAgent } from '@/lib/request';

export type DocKind = (typeof legalDocuments.$inferSelect)['kind'];

/** Bir hukuki metnin yürürlükteki (en yüksek sürümlü, etkin) kaydı. */
export async function currentDocument(kind: DocKind, exec: Exec = db) {
  const [doc] = await exec
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
export async function hasActiveConsent(studentId: string, kind: DocKind, exec: Exec = db): Promise<boolean> {
  const [latest] = await exec
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
}, exec: Exec = db) {
  const doc = await currentDocument(entry.docKind, exec);
  await exec.insert(consentRecords).values({
    // İşlemin başlangıç zamanı değil, yazma anı: kayıtlar kilit sırasıyla sıralanmalı (hasActiveConsent).
    createdAt: sql`clock_timestamp()`,
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

type Actor = string | { userId?: string | null; email?: string | null; method?: 'form' | 'email_link'; meta?: Record<string, unknown> };

/**
 * Geri alma: yeni bir "verilmedi" kaydı eklenir ve açık kayıtlar geri alınmış olarak işaretlenir.
 * `actor`: veli hesabının kimliği ya da (okul üzerinden gelen veliler için) e-posta bağlantısı bilgisi.
 *
 * Ölçme rızası geri alınınca (ya da okul onayı geçersiz sayınca) öğrencinin bütün uygulamaları
 * "geçersiz" olur: raporlarda, grup özetlerinde ve araştırma verisinde bir daha kullanılmaz, rıza
 * sonradan yeniden verilse de geri gelmez ve günlük temizlik görevinde kalıcı olarak silinir.
 * Yeni rızayla yapılan uygulamalar yeni kayıtlardır.
 */
export async function revokeConsent(studentId: string, docKind: DocKind, actor: Actor, exec: Exec = db) {
  const a = typeof actor === 'string' ? { userId: actor } : actor;
  const doc = await currentDocument(docKind, exec);
  const docs = await exec.select({ id: legalDocuments.id }).from(legalDocuments).where(eq(legalDocuments.kind, docKind));
  await exec
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
  await exec.insert(consentRecords).values({
    createdAt: sql`clock_timestamp()`,
    kind: 'explicit_consent',
    documentId: doc.id,
    subjectStudentId: studentId,
    actorUserId: a.userId ?? null,
    actorEmail: a.email ?? null,
    method: a.method ?? 'form',
    granted: false,
    ip: await clientIp(),
    userAgent: await userAgent(),
    meta: a.meta,
  });
  if (docKind === 'consent_assessment') {
    await exec
      .update(attempts)
      .set({ status: 'invalidated' })
      .where(and(eq(attempts.studentId, studentId), ne(attempts.status, 'invalidated')));
  }
}

/**
 * Öğrencinin rıza durumunu ve veli bağlarını değiştiren işlemleri sıraya sokar (kilit işlem bitene
 * kadar tutulur): okulun onayı geçersiz sayması, velinin bağlantıdan ya da panelden karar vermesi,
 * hesap bağlama ve bağ kaldırma aynı anda çalışıp birbirinin denetimini boşa çıkaramaz. Denetimler
 * kilitten sonra, aynı işlem içinde yapılmalıdır.
 */
export async function lockStudentConsent(tx: Tx, studentId: string): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`consent:${studentId}`}, 0))`);
}

/** Öğrencinin en son rıza kaydının zamanı ve durumu (veli onayı sayfasında göstermek için). */
export async function latestConsent(studentId: string, kind: DocKind) {
  const [latest] = await db
    .select({ granted: consentRecords.granted, revokedAt: consentRecords.revokedAt, createdAt: consentRecords.createdAt })
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
  return latest ?? null;
}
