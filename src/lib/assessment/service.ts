import 'server-only';
import { and, desc, eq, gt, gte, isNull, lte, or, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  attempts,
  entitlements,
  instrumentVersions,
  instruments,
  items,
  normSets,
  normStats,
  reports,
  responses,
  scores,
  students,
  taskTrials,
} from '@/db/schema';
import { getInstrumentDef } from '@/content/instruments';
import { hasActiveConsent } from '@/lib/consent';
import type { InstrumentDef, LikertInstrument, ReadingInstrument } from '@/lib/instruments/types';
import { buildReport, type Audience, type ReportContent, type StoredScore } from '@/lib/reports/build';
import { likertQuality, scoreLikert, type LikertAnswer, type NormStat } from '@/lib/scoring/likert';
import { passageForGrade, scoreReading } from '@/lib/scoring/reading';

export class AssessmentError extends Error {
  constructor(
    public code:
      | 'not_found'
      | 'no_consent'
      | 'grade'
      | 'not_available'
      | 'no_entitlement'
      | 'not_in_progress'
      | 'invalid',
    message: string,
  ) {
    super(message);
  }
}

export async function currentVersion(slug: string) {
  const [row] = await db
    .select({ instrumentId: instruments.id, versionId: instrumentVersions.id, status: instruments.status })
    .from(instruments)
    .innerJoin(instrumentVersions, eq(instrumentVersions.instrumentId, instruments.id))
    .where(and(eq(instruments.slug, slug), eq(instrumentVersions.isCurrent, true)))
    .limit(1);
  return row ?? null;
}

async function versionDefinition(versionId: string): Promise<{ def: InstrumentDef; instrumentId: string }> {
  const [row] = await db
    .select({ definition: instrumentVersions.definition, instrumentId: instrumentVersions.instrumentId })
    .from(instrumentVersions)
    .where(eq(instrumentVersions.id, versionId))
    .limit(1);
  if (!row) throw new AssessmentError('not_found', 'Test sürümü bulunamadı.');
  return { def: row.definition as unknown as InstrumentDef, instrumentId: row.instrumentId };
}

/**
 * Bir öğrenci için testi başlatır ya da yarım kalmış uygulamayı sürdürür.
 * Kontroller: açık rıza, sınıf aralığı, testin yayında olması, ücretli testlerde hak.
 */
export async function startOrResumeAttempt(input: {
  studentId: string;
  grade: number;
  slug: string;
  startedByUserId: string | null;
  assignmentId?: string | null;
}): Promise<string> {
  const def = getInstrumentDef(input.slug);
  if (!def) throw new AssessmentError('not_found', 'Test bulunamadı.');
  if (def.status !== 'active' && def.status !== 'pilot') {
    throw new AssessmentError('not_available', 'Bu test şu anda uygulanmıyor.');
  }
  if (input.grade < def.minGrade || input.grade > def.maxGrade) {
    throw new AssessmentError('grade', 'Bu test öğrencinin sınıf düzeyine uygun değil.');
  }
  if (!(await hasActiveConsent(input.studentId, 'consent_assessment'))) {
    throw new AssessmentError('no_consent', 'Test çözülebilmesi için velinin açık rızası gerekiyor.');
  }
  const cv = await currentVersion(input.slug);
  if (!cv) throw new AssessmentError('not_found', 'Test sürümü bulunamadı.');

  const [open] = await db
    .select({ id: attempts.id })
    .from(attempts)
    .where(
      and(
        eq(attempts.studentId, input.studentId),
        eq(attempts.versionId, cv.versionId),
        eq(attempts.status, 'in_progress'),
      ),
    )
    .orderBy(desc(attempts.startedAt))
    .limit(1);
  if (open) return open.id;

  if (!def.isFree) {
    const now = new Date();
    const [ent] = await db
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(
        and(
          eq(entitlements.studentId, input.studentId),
          eq(entitlements.instrumentId, cv.instrumentId),
          gt(entitlements.remainingUses, 0),
          or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
        ),
      )
      .limit(1);
    if (!ent) throw new AssessmentError('no_entitlement', 'Bu test için kullanım hakkı bulunmuyor.');
    await db
      .update(entitlements)
      .set({ remainingUses: sql`${entitlements.remainingUses} - 1` })
      .where(eq(entitlements.id, ent.id));
  }

  const research = await hasActiveConsent(input.studentId, 'consent_research');
  const [created] = await db
    .insert(attempts)
    .values({
      studentId: input.studentId,
      versionId: cv.versionId,
      assignmentId: input.assignmentId ?? null,
      startedByUserId: input.startedByUserId,
      mode: def.status === 'pilot' ? 'pilot' : 'standard',
      gradeAtAttempt: input.grade,
      researchConsent: research,
    })
    .returning({ id: attempts.id });
  return created.id;
}

export async function getAttempt(attemptId: string) {
  const [a] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);
  return a ?? null;
}

/** Test ekranı için gereken her şey: tanım (öğrenciye gösterilecek kısım), mevcut cevaplar. */
export async function loadRunnerState(attemptId: string) {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new AssessmentError('not_found', 'Uygulama bulunamadı.');
  const { def } = await versionDefinition(attempt.versionId);
  const answered = await db
    .select({ itemKey: responses.itemKey, value: responses.value, valueText: responses.valueText })
    .from(responses)
    .where(eq(responses.attemptId, attemptId));
  return { attempt, def, answered };
}

export async function saveLikertAnswer(attemptId: string, itemKey: string, value: number, rtMs: number | null) {
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'in_progress') {
    throw new AssessmentError('not_in_progress', 'Bu uygulama tamamlanmış ya da kapatılmış.');
  }
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'likert') throw new AssessmentError('invalid', 'Geçersiz istek.');
  if (!def.options.some((o) => o.value === value)) throw new AssessmentError('invalid', 'Geçersiz cevap.');
  const [item] = await db
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.versionId, attempt.versionId), eq(items.key, itemKey)))
    .limit(1);
  if (!item) throw new AssessmentError('invalid', 'Geçersiz madde.');
  const rt = rtMs !== null && Number.isFinite(rtMs) ? Math.max(0, Math.min(Math.round(rtMs), 600000)) : null;

  await db
    .insert(responses)
    .values({ attemptId, itemId: item.id, itemKey, value, rtMs: rt })
    .onConflictDoUpdate({
      target: [responses.attemptId, responses.itemId],
      set: {
        value,
        rtMs: rt,
        answeredAt: new Date(),
        changedCount: sql`${responses.changedCount} + 1`,
      },
    });
  await db.update(attempts).set({ lastActivityAt: new Date() }).where(eq(attempts.id, attemptId));
}

async function activeNorms(versionId: string, grade: number): Promise<Record<string, NormStat>> {
  const [set] = await db
    .select({ id: normSets.id })
    .from(normSets)
    .where(
      and(
        eq(normSets.versionId, versionId),
        eq(normSets.isActive, true),
        lte(normSets.gradeMin, grade),
        gte(normSets.gradeMax, grade),
      ),
    )
    .orderBy(desc(normSets.createdAt))
    .limit(1);
  if (!set) return {};
  const stats = await db.select().from(normStats).where(eq(normStats.normSetId, set.id));
  return Object.fromEntries(
    stats.map((s) => [s.scaleKey, { normSetId: set.id, mean: s.mean, sd: s.sd, reliability: s.reliability }]),
  );
}

export async function completeLikertAttempt(attemptId: string): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new AssessmentError('not_found', 'Uygulama bulunamadı.');
  if (attempt.status === 'completed') return;
  if (attempt.status !== 'in_progress') throw new AssessmentError('not_in_progress', 'Bu uygulama kapatılmış.');
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'likert') throw new AssessmentError('invalid', 'Geçersiz istek.');
  const likert = def as LikertInstrument;

  const rows = await db
    .select({ itemKey: responses.itemKey, value: responses.value, rtMs: responses.rtMs })
    .from(responses)
    .where(eq(responses.attemptId, attemptId));
  const answers: Record<string, LikertAnswer> = {};
  for (const r of rows) if (r.value !== null) answers[r.itemKey] = { value: r.value, rtMs: r.rtMs };
  if (Object.keys(answers).length < Math.ceil(likert.items.length * likert.scoring.minAnsweredRatio)) {
    throw new AssessmentError('invalid', 'Testi bitirmek için maddelerin çoğunu cevaplamak gerekiyor.');
  }

  const norms = await activeNorms(attempt.versionId, attempt.gradeAtAttempt);
  const scaleScores = scoreLikert(likert, answers, norms);
  const quality = likertQuality(likert, answers);
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values(
      scaleScores.map((s) => ({
        attemptId,
        scaleKey: s.scaleKey,
        raw: s.raw,
        mean: s.mean,
        nAnswered: s.nAnswered,
        nItems: s.nItems,
        z: s.z ?? null,
        t: s.t ?? null,
        percentile: s.percentile ?? null,
        band: s.band,
        normSetId: s.normSetId ?? null,
        ciLow: s.ciLow ?? null,
        ciHigh: s.ciHigh ?? null,
      })),
    );
    await tx
      .update(attempts)
      .set({
        status: 'completed',
        completedAt: now,
        durationMs: now.getTime() - attempt.startedAt.getTime(),
        qualityFlags: {
          tooFast: quality.tooFast,
          straightLining: quality.straightLining,
          incomplete: quality.incomplete,
          notes: quality.notes,
        },
      })
      .where(eq(attempts.id, attemptId));
  });
  await generateReports(attemptId);
}

export async function completeReadingAttempt(
  attemptId: string,
  payload: { passageKey: string; readingMs: number; answers: Record<string, string> },
): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new AssessmentError('not_found', 'Uygulama bulunamadı.');
  if (attempt.status === 'completed') return;
  if (attempt.status !== 'in_progress') throw new AssessmentError('not_in_progress', 'Bu uygulama kapatılmış.');
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'reading') throw new AssessmentError('invalid', 'Geçersiz istek.');
  const rDef = def as ReadingInstrument;
  const passage = passageForGrade(rDef, attempt.gradeAtAttempt);
  if (payload.passageKey !== passage.key) throw new AssessmentError('invalid', 'Metin bu sınıf düzeyine ait değil.');
  if (!Number.isFinite(payload.readingMs) || payload.readingMs < 1000 || payload.readingMs > 3600_000) {
    throw new AssessmentError('invalid', 'Okuma süresi geçersiz.');
  }

  const result = scoreReading(passage, payload.readingMs, payload.answers);
  const itemRows = await db
    .select({ id: items.id, key: items.key })
    .from(items)
    .where(eq(items.versionId, attempt.versionId));
  const itemIdByKey = new Map(itemRows.map((i) => [i.key, i.id]));
  const now = new Date();

  await db.transaction(async (tx) => {
    for (const q of passage.questions) {
      const key = `${passage.key}.${q.key}`;
      const itemId = itemIdByKey.get(key);
      const chosen = payload.answers[q.key];
      if (!itemId || !chosen) continue;
      await tx
        .insert(responses)
        .values({ attemptId, itemId, itemKey: key, valueText: chosen, value: chosen === q.answer ? 1 : 0 })
        .onConflictDoNothing();
    }
    await tx
      .insert(taskTrials)
      .values({
        attemptId,
        block: 'reading',
        trialIndex: 0,
        stimulus: { passage: passage.key, words: result.wordCount },
        response: { readingMs: result.readingMs },
        rtMs: result.readingMs,
      })
      .onConflictDoNothing();
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values([
      {
        attemptId,
        scaleKey: 'comprehension',
        raw: result.correct,
        mean: result.comprehensionPct / 100,
        nAnswered: Object.keys(payload.answers).length,
        nItems: result.total,
        band: result.band,
        extra: result as unknown as Record<string, unknown>,
      },
      {
        attemptId,
        scaleKey: 'speed',
        raw: result.wpm,
        mean: null,
        nAnswered: 1,
        nItems: 1,
        band: null,
        extra: { wpm: result.wpm, effectiveWpm: result.effectiveWpm, wordCount: result.wordCount },
      },
    ]);
    await tx
      .update(attempts)
      .set({
        status: 'completed',
        completedAt: now,
        durationMs: now.getTime() - attempt.startedAt.getTime(),
        qualityFlags: { tooFast: result.flags.tooFast, notes: result.flags.notes },
      })
      .where(eq(attempts.id, attemptId));
  });
  await generateReports(attemptId);
}

async function loadScores(attemptId: string): Promise<StoredScore[]> {
  const rows = await db.select().from(scores).where(eq(scores.attemptId, attemptId));
  return rows.map((r) => ({
    scaleKey: r.scaleKey,
    raw: r.raw,
    mean: r.mean,
    band: r.band,
    percentile: r.percentile,
    ciLow: r.ciLow,
    ciHigh: r.ciHigh,
    nAnswered: r.nAnswered,
    nItems: r.nItems,
    normSetId: r.normSetId,
    extra: r.extra ?? null,
  }));
}

/** Öğrenci ve veli raporlarını oluşturup o anki hâliyle saklar. */
export async function generateReports(attemptId: string, studentName?: string): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'completed') return;
  const { def } = await versionDefinition(attempt.versionId);
  const stored = await loadScores(attemptId);
  const [st] = await db
    .select({ firstName: students.firstName })
    .from(students)
    .where(eq(students.id, attempt.studentId))
    .limit(1);
  const name = studentName ?? st?.firstName ?? '';
  const hasNorms = stored.some((s) => s.normSetId);
  for (const audience of ['student', 'parent'] as Audience[]) {
    const content = buildReport({
      def,
      scores: stored,
      audience,
      studentName: name,
      grade: attempt.gradeAtAttempt,
      completedAt: attempt.completedAt ?? new Date(),
      qualityNotes: attempt.qualityFlags?.notes ?? [],
      hasNorms,
    });
    await db
      .insert(reports)
      .values({
        attemptId,
        audience,
        templateVersion: content.templateVersion,
        content: content as unknown as Record<string, unknown>,
      })
      .onConflictDoUpdate({
        target: [reports.attemptId, reports.audience],
        set: {
          templateVersion: content.templateVersion,
          content: content as unknown as Record<string, unknown>,
          createdAt: new Date(),
        },
      });
  }
}

export async function getReport(attemptId: string, audience: Audience): Promise<ReportContent | null> {
  const [row] = await db
    .select({ content: reports.content })
    .from(reports)
    .where(and(eq(reports.attemptId, attemptId), eq(reports.audience, audience)))
    .limit(1);
  return (row?.content as unknown as ReportContent) ?? null;
}
