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
import type { InstrumentDef, LikertInstrument, ReadingInstrument, TaskInstrument } from '@/lib/instruments/types';
import { buildReport, type Audience, type ReportContent, type StoredScore } from '@/lib/reports/build';
import { likertQuality, scoreLikert, type LikertAnswer, type NormStat } from '@/lib/scoring/likert';
import { formForGrade, isQuizChoice, scoreQuiz, type QuizAnswer, type QuizChoice } from '@/lib/scoring/quiz';
import { passageForGrade, scoreReading } from '@/lib/scoring/reading';
import {
  TaskInputError,
  scoreFlanker,
  scoreSpan,
  scoreSymbol,
  taskQualityNotes,
  type FlankerResult,
  type FlankerTrialInput,
  type SpanTrialInput,
  type SymbolResult,
  type SymbolTrialInput,
} from '@/lib/scoring/tasks';

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

/* ---------- Bilişsel görevler ---------- */

type TrialRow = typeof taskTrials.$inferInsert;

/** Bir görevin denemelerini puanlayıp veritabanı satırlarına çevirir. Geçersiz veri AssessmentError fırlatır. */
function taskRows(def: TaskInstrument, attemptId: string, block: string, input: unknown[]): TrialRow[] {
  const task = def.tasks.find((t) => t.key === block);
  if (!task) throw new AssessmentError('invalid', 'Geçersiz görev.');
  try {
    if (task.kind === 'digit_span' || task.kind === 'spatial_span') {
      const { trials } = scoreSpan(task, input as SpanTrialInput[]);
      return trials.map((t) => ({
        attemptId,
        block,
        trialIndex: (t.length - task.startLength) * 2 + t.index,
        stimulus: { length: t.length, index: t.index, seq: t.stimulus },
        response: { seq: t.response },
        correct: t.correct,
        rtMs: t.rtMs === null ? null : Math.round(t.rtMs),
      }));
    }
    if (task.kind === 'flanker') {
      const { trials } = scoreFlanker(task, input as FlankerTrialInput[]);
      return trials.map((t) => ({
        attemptId,
        block,
        trialIndex: t.index,
        stimulus: { dir: t.dir, congruent: t.congruent },
        response: { key: t.response },
        correct: t.correct,
        rtMs: t.rtMs === null ? null : Math.round(t.rtMs),
      }));
    }
    const { trials } = scoreSymbol(task, input as SymbolTrialInput[]);
    return trials.map((t) => ({
      attemptId,
      block,
      trialIndex: t.index,
      stimulus: { symbol: t.symbol },
      response: { digit: t.response },
      correct: t.correct,
      rtMs: t.rtMs === null ? null : Math.round(t.rtMs),
    }));
  } catch (err) {
    if (err instanceof TaskInputError) throw new AssessmentError('invalid', err.message);
    throw err;
  }
}

/** Bir görevin bütün denemelerini kaydeder. Aynı görev yeniden gönderilirse öncekinin yerini alır. */
export async function saveTaskBlock(attemptId: string, block: string, input: unknown[]): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'in_progress') {
    throw new AssessmentError('not_in_progress', 'Bu uygulama tamamlanmış ya da kapatılmış.');
  }
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'tasks') throw new AssessmentError('invalid', 'Geçersiz istek.');
  const rows = taskRows(def, attemptId, block, input);
  if (rows.length === 0) throw new AssessmentError('invalid', 'Görevde kaydedilecek deneme yok.');
  await db.transaction(async (tx) => {
    await tx.delete(taskTrials).where(and(eq(taskTrials.attemptId, attemptId), eq(taskTrials.block, block)));
    await tx.insert(taskTrials).values(rows);
    await tx.update(attempts).set({ lastActivityAt: new Date() }).where(eq(attempts.id, attemptId));
  });
}

/** Tamamlanmış görevlerin anahtarları (yarıda kalan uygulamayı kaldığı yerden sürdürmek için). */
export async function taskProgress(attemptId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ block: taskTrials.block })
    .from(taskTrials)
    .where(eq(taskTrials.attemptId, attemptId));
  return rows.map((r) => r.block);
}

export async function completeTaskAttempt(attemptId: string): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new AssessmentError('not_found', 'Uygulama bulunamadı.');
  if (attempt.status === 'completed') return;
  if (attempt.status !== 'in_progress') throw new AssessmentError('not_in_progress', 'Bu uygulama kapatılmış.');
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'tasks') throw new AssessmentError('invalid', 'Geçersiz istek.');

  const rows = await db.select().from(taskTrials).where(eq(taskTrials.attemptId, attemptId));
  const byBlock = new Map<string, typeof rows>();
  for (const r of rows) byBlock.set(r.block, [...(byBlock.get(r.block) ?? []), r]);
  const missing = def.tasks.filter((t) => !byBlock.has(t.key));
  if (missing.length) throw new AssessmentError('invalid', 'Görevlerin hepsi tamamlanmadan sonuç hesaplanamaz.');

  const scoreRows: (typeof scores.$inferInsert)[] = [];
  let flankerRes: FlankerResult | undefined;
  let symbolRes: SymbolResult | undefined;
  const scaleOf: Record<string, string> = {};
  for (const t of def.tasks) {
    if (t.kind === 'digit_span') scaleOf[t.key] = t.direction === 'forward' ? 'digit_forward' : 'digit_backward';
    else if (t.kind === 'spatial_span') scaleOf[t.key] = 'spatial';
    else if (t.kind === 'flanker') scaleOf[t.key] = 'attention';
    else scaleOf[t.key] = 'speed';
  }

  for (const task of def.tasks) {
    const tr = byBlock.get(task.key)!;
    if (task.kind === 'digit_span' || task.kind === 'spatial_span') {
      const input: SpanTrialInput[] = tr.map((r) => ({
        length: Number((r.stimulus as { length: number }).length),
        index: Number((r.stimulus as { index: number }).index),
        response: ((r.response as { seq: number[] }).seq ?? []).map(Number),
        rtMs: r.rtMs,
      }));
      const { result } = scoreSpan(task, input);
      scoreRows.push({
        attemptId,
        scaleKey: scaleOf[task.key],
        raw: result.span,
        mean: null,
        nAnswered: result.correctTrials,
        nItems: result.totalTrials,
        band: null,
        extra: result as unknown as Record<string, unknown>,
      });
    } else if (task.kind === 'flanker') {
      const input: FlankerTrialInput[] = tr.map((r) => ({
        index: r.trialIndex,
        response: ((r.response as { key: 'L' | 'R' | null }).key ?? null) as 'L' | 'R' | null,
        rtMs: r.rtMs,
      }));
      const { result } = scoreFlanker(task, input);
      flankerRes = result;
      scoreRows.push({
        attemptId,
        scaleKey: 'attention',
        raw: Math.round(result.accuracy * 1000) / 10,
        mean: result.meanRt,
        nAnswered: result.n - result.timeouts,
        nItems: task.trials.length,
        band: null,
        extra: result as unknown as Record<string, unknown>,
      });
    } else {
      const input: SymbolTrialInput[] = tr.map((r) => ({
        index: r.trialIndex,
        response: Number((r.response as { digit: number }).digit),
        rtMs: r.rtMs,
      }));
      const { result } = scoreSymbol(task, input);
      symbolRes = result;
      scoreRows.push({
        attemptId,
        scaleKey: 'speed',
        raw: result.perMinute,
        mean: null,
        nAnswered: result.correct,
        nItems: result.attempted,
        band: null,
        extra: result as unknown as Record<string, unknown>,
      });
    }
  }

  const notes = taskQualityNotes({ flanker: flankerRes, symbol: symbolRes });
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values(scoreRows);
    await tx
      .update(attempts)
      .set({
        status: 'completed',
        completedAt: now,
        durationMs: now.getTime() - attempt.startedAt.getTime(),
        qualityFlags: { notes },
      })
      .where(eq(attempts.id, attemptId));
  });
  await generateReports(attemptId);
}

/* ---------- Akademik tanı testleri ---------- */

/**
 * Bir sorunun cevabını kaydeder. Doğru olup olmadığı sunucuda, cevap anahtarıyla hesaplanır; cevap
 * anahtarı tarayıcıya hiç gönderilmez. "X", öğrencinin “Bilmiyorum” dediği anlamına gelir.
 */
export async function saveQuizAnswer(attemptId: string, itemKey: string, choice: QuizChoice, rtMs: number | null) {
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'in_progress') {
    throw new AssessmentError('not_in_progress', 'Bu uygulama tamamlanmış ya da kapatılmış.');
  }
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'quiz') throw new AssessmentError('invalid', 'Geçersiz istek.');
  if (!isQuizChoice(choice)) throw new AssessmentError('invalid', 'Geçersiz cevap.');
  const form = formForGrade(def, attempt.gradeAtAttempt);
  const item = form.items.find((i) => i.key === itemKey);
  if (!item) throw new AssessmentError('invalid', 'Bu soru öğrencinin formunda yok.');
  const [row] = await db
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.versionId, attempt.versionId), eq(items.key, itemKey)))
    .limit(1);
  if (!row) throw new AssessmentError('invalid', 'Geçersiz madde.');
  const rt = rtMs !== null && Number.isFinite(rtMs) ? Math.max(0, Math.min(Math.round(rtMs), 3_600_000)) : null;
  const value = choice === item.answer ? 1 : 0;

  await db
    .insert(responses)
    .values({ attemptId, itemId: row.id, itemKey, value, valueText: choice, rtMs: rt })
    .onConflictDoUpdate({
      target: [responses.attemptId, responses.itemId],
      set: {
        value,
        valueText: choice,
        rtMs: rt,
        answeredAt: new Date(),
        changedCount: sql`${responses.changedCount} + 1`,
      },
    });
  await db.update(attempts).set({ lastActivityAt: new Date() }).where(eq(attempts.id, attemptId));
}

export async function completeQuizAttempt(attemptId: string): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new AssessmentError('not_found', 'Uygulama bulunamadı.');
  if (attempt.status === 'completed') return;
  if (attempt.status !== 'in_progress') throw new AssessmentError('not_in_progress', 'Bu uygulama kapatılmış.');
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine !== 'quiz') throw new AssessmentError('invalid', 'Geçersiz istek.');
  const form = formForGrade(def, attempt.gradeAtAttempt);

  const rows = await db
    .select({ itemKey: responses.itemKey, valueText: responses.valueText, rtMs: responses.rtMs })
    .from(responses)
    .where(eq(responses.attemptId, attemptId));
  const answers: Record<string, QuizAnswer> = {};
  for (const r of rows) if (isQuizChoice(r.valueText)) answers[r.itemKey] = { choice: r.valueText, rtMs: r.rtMs };
  const unanswered = form.items.filter((i) => !answers[i.key]).length;
  if (unanswered > 0) {
    throw new AssessmentError(
      'invalid',
      `Testi bitirmek için bütün soruları cevaplaman ya da “Bilmiyorum” olarak işaretlemen gerekiyor (${unanswered} soru kaldı).`,
    );
  }

  const result = scoreQuiz(form, answers);
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values([
      {
        attemptId,
        scaleKey: 'total',
        raw: result.correct,
        mean: result.ratio,
        nAnswered: result.n - result.dontKnow - result.missing,
        nItems: result.n,
        band: result.band,
        extra: result as unknown as Record<string, unknown>,
      },
      ...result.domains.map((d) => ({
        attemptId,
        scaleKey: d.key,
        raw: d.correct,
        mean: d.ratio,
        nAnswered: d.n - d.dontKnow,
        nItems: d.n,
        band: d.band,
        extra: { wrong: d.wrong, dontKnow: d.dontKnow, formKey: form.key } as Record<string, unknown>,
      })),
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

/** Motor türüne göre uygulamayı tamamlar (ölçekler, akademik testler ve bilişsel görevler). */
export async function completeAttempt(attemptId: string): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new AssessmentError('not_found', 'Uygulama bulunamadı.');
  const { def } = await versionDefinition(attempt.versionId);
  if (def.engine === 'likert') return completeLikertAttempt(attemptId);
  if (def.engine === 'tasks') return completeTaskAttempt(attemptId);
  if (def.engine === 'quiz') return completeQuizAttempt(attemptId);
  throw new AssessmentError('invalid', 'Bu test bu yolla tamamlanamaz.');
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
