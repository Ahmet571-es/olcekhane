import 'server-only';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { instrumentVersions, instruments, normSets, normStats, responses, scores } from '@/db/schema';
import type { QualityFlags } from '@/db/schema/assessment';
import type { InstrumentDef } from '@/lib/instruments/types';
import { activeConsentSql } from '@/lib/school/queries';

/** Bir testin şu anki sürümü ve o sürümün veritabanında saklanan tanımı. */
export async function currentVersionDef(slug: string) {
  const [row] = await db
    .select({
      instrumentId: instruments.id,
      versionId: instrumentVersions.id,
      version: instrumentVersions.version,
      definition: instrumentVersions.definition,
    })
    .from(instruments)
    .innerJoin(instrumentVersions, eq(instrumentVersions.instrumentId, instruments.id))
    .where(and(eq(instruments.slug, slug), eq(instrumentVersions.isCurrent, true)))
    .limit(1);
  if (!row) return null;
  return { instrumentId: row.instrumentId, versionId: row.versionId, version: row.version, def: row.definition as unknown as InstrumentDef };
}

export interface SampleRow {
  attemptId: string;
  grade: number;
  completedAt: Date;
  gender: string | null;
  /** Çok hızlı cevaplama ya da hep aynı seçeneği işaretleme gibi geçerlik sorunu işaretlenmiş mi? */
  flagged: boolean;
}

/**
 * Araştırma örneklemi: ölçme ve araştırma rızası şu anda geçerli olan öğrencilerin bu sürümdeki
 * ilk tamamlanmış uygulaması. Tekrar uygulamalar alıştırma etkisi taşıdığı için dışarıda kalır;
 * rızasını geri alanların verisi yeni analizlere girmez (açık rıza metni).
 */
export async function researchSample(versionId: string): Promise<SampleRow[]> {
  const rows = await db.execute<{
    id: string;
    grade_at_attempt: number;
    completed_at: Date;
    gender: string | null;
    quality_flags: QualityFlags | null;
  }>(sql`
    select distinct on (a.student_id) a.id, a.grade_at_attempt, a.completed_at, s.gender, a.quality_flags
    from attempts a
    join students s on s.id = a.student_id and s.deleted_at is null
    where a.version_id = ${versionId} and a.status = 'completed' and a.mode <> 'demo'
      and ${activeConsentSql(sql`a.student_id`)}
      and ${activeConsentSql(sql`a.student_id`, 'consent_research')}
    order by a.student_id, a.completed_at asc
  `);
  return rows.map((r) => ({
    attemptId: r.id,
    grade: r.grade_at_attempt,
    completedAt: new Date(r.completed_at),
    gender: r.gender,
    flagged: !!(r.quality_flags?.tooFast || r.quality_flags?.straightLining),
  }));
}

/** Sürümdeki bütün tamamlanmış uygulamalar (rıza durumundan bağımsız, yalnızca sayı). */
export async function versionTotals(versionId: string) {
  const [row] = await db.execute<{ attempts: number; students: number }>(sql`
    select count(*)::int as attempts, count(distinct student_id)::int as students
    from attempts where version_id = ${versionId} and status = 'completed'
  `);
  return row ?? { attempts: 0, students: 0 };
}

const CHUNK = 5000;

/** Uygulamaların cevapları: uygulama → madde anahtarı → { sayısal değer, seçenek }. */
export async function responsesFor(attemptIds: string[]) {
  const out = new Map<string, Record<string, { value: number | null; text: string | null }>>();
  for (let i = 0; i < attemptIds.length; i += CHUNK) {
    const part = attemptIds.slice(i, i + CHUNK);
    const rows = await db
      .select({ attemptId: responses.attemptId, itemKey: responses.itemKey, value: responses.value, text: responses.valueText })
      .from(responses)
      .where(inArray(responses.attemptId, part));
    for (const r of rows) {
      const m = out.get(r.attemptId) ?? {};
      m[r.itemKey] = { value: r.value, text: r.text };
      out.set(r.attemptId, m);
    }
  }
  return out;
}

/** Uygulamaların ölçek puanları: uygulama → ölçek → puan satırı. */
export async function scoresFor(attemptIds: string[]) {
  const out = new Map<string, Record<string, { raw: number | null; mean: number | null; extra: Record<string, unknown> | null }>>();
  for (let i = 0; i < attemptIds.length; i += CHUNK) {
    const part = attemptIds.slice(i, i + CHUNK);
    const rows = await db
      .select({ attemptId: scores.attemptId, scaleKey: scores.scaleKey, raw: scores.raw, mean: scores.mean, extra: scores.extra })
      .from(scores)
      .where(inArray(scores.attemptId, part));
    for (const r of rows) {
      const m = out.get(r.attemptId) ?? {};
      m[r.scaleKey] = { raw: r.raw, mean: r.mean, extra: r.extra };
      out.set(r.attemptId, m);
    }
  }
  return out;
}

export async function normSetsFor(versionId: string) {
  const sets = await db.select().from(normSets).where(eq(normSets.versionId, versionId)).orderBy(desc(normSets.createdAt));
  if (!sets.length) return [];
  const stats = await db
    .select()
    .from(normStats)
    .where(
      inArray(
        normStats.normSetId,
        sets.map((s) => s.id),
      ),
    );
  return sets.map((s) => ({ ...s, stats: stats.filter((x) => x.normSetId === s.id) }));
}
