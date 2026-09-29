import 'server-only';
import { and, desc, eq, gt, gte, isNull, lte, or, sql } from 'drizzle-orm';
import { db, type Tx } from '@/db';
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
import { hasActiveConsent, lockStudentConsent } from '@/lib/consent';
import { cancellationSheet } from '@/lib/instruments/cancellation';
import type { InstrumentDef, LikertInstrument, ReadingInstrument, TaskInstrument } from '@/lib/instruments/types';
import { buildReport, type Audience, type NormInfo, type ReportContent, type StoredScore } from '@/lib/reports/build';
import { likertQuality, scoreLikert, type LikertAnswer, type NormStat } from '@/lib/scoring/likert';
import { formForGrade, isQuizChoice, scoreQuiz, type QuizAnswer, type QuizChoice } from '@/lib/scoring/quiz';
import { passageForGrade, scoreReading } from '@/lib/scoring/reading';
import {
  TaskInputError,
  scoreCancellation,
  scoreFlanker,
  scoreSpan,
  scoreSymbol,
  type CancellationSectionInput,
  type FlankerTrialInput,
  type SpanTrialInput,
  type SymbolTrialInput,
} from '@/lib/scoring/tasks';
import { likertRows, quizRows, readingRows, taskScoreRows, type TaskInputs } from './score-rows';

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

/** Aynı uygulama için ikinci bir bitirme isteği geldiğinde (çift tıklama) işlemi sessizce bırakmak için. */
class AlreadyFinished extends Error {}


/**
 * Uygulamayı yalnızca hâlâ sürüyorsa "tamamlandı" yapar. Puanlar hesaplanırken velinin rızası geri
 * alındıysa (uygulama geçersiz sayıldıysa) işlem bütünüyle geri alınır ve puan kaydedilmez.
 */
async function finishAttempt(tx: Tx, attemptId: string, set: Omit<Partial<typeof attempts.$inferInsert>, 'status'>): Promise<void> {
  const done = await tx
    .update(attempts)
    .set({ ...set, status: 'completed' })
    .where(and(eq(attempts.id, attemptId), eq(attempts.status, 'in_progress')))
    .returning({ id: attempts.id });
  if (done.length > 0) return;
  const [current] = await tx.select({ status: attempts.status }).from(attempts).where(eq(attempts.id, attemptId));
  if (current?.status === 'completed') throw new AlreadyFinished();
  throw new AssessmentError('not_in_progress', 'Bu uygulama kapatılmış.');
}

/**
 * Bitirme işlemini öğrencinin rıza kilidiyle tek bir veritabanı işleminde yapar ve raporları üretir.
 * Rıza bu arada geri alındıysa uygulama geçersiz sayılır ve puan kaydedilmez.
 */
async function runFinish(attempt: { id: string; studentId: string }, work: (tx: Tx) => Promise<void>): Promise<void> {
  let outcome: 'done' | 'no_consent';
  try {
    outcome = await db.transaction(async (tx) => {
      await lockStudentConsent(tx, attempt.studentId);
      if (!(await hasActiveConsent(attempt.studentId, 'consent_assessment', tx))) {
        await tx
          .update(attempts)
          .set({ status: 'invalidated' })
          .where(and(eq(attempts.id, attempt.id), eq(attempts.status, 'in_progress')));
        return 'no_consent' as const;
      }
      await work(tx);
      return 'done' as const;
    });
  } catch (err) {
    if (err instanceof AlreadyFinished) return;
    throw err;
  }
  if (outcome === 'no_consent') {
    throw new AssessmentError('no_consent', 'Velinin açık rızası geri alındığı için bu uygulama tamamlanamadı.');
  }
  await generateReports(attempt.id);
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

  // Rıza denetimi ve uygulamanın oluşturulması öğrencinin rıza kilidiyle tek işlemde yapılır: aynı anda
  // rıza geri alınırsa yeni uygulama ya geri almadan önce oluşur (ve geri almayla geçersiz sayılır) ya
  // da hiç oluşmaz.
  return db.transaction(async (tx) => {
    await lockStudentConsent(tx, input.studentId);
    if (!(await hasActiveConsent(input.studentId, 'consent_assessment', tx))) {
      throw new AssessmentError('no_consent', 'Test çözülebilmesi için velinin açık rızası gerekiyor.');
    }
    const [open] = await tx
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
      const [ent] = await tx
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
      // Hak eksiye düşmesin: yalnızca hâlâ hak varsa azaltılır.
      const used = await tx
        .update(entitlements)
        .set({ remainingUses: sql`${entitlements.remainingUses} - 1` })
        .where(and(eq(entitlements.id, ent.id), gt(entitlements.remainingUses, 0)))
        .returning({ id: entitlements.id });
      if (used.length === 0) throw new AssessmentError('no_entitlement', 'Bu test için kullanım hakkı bulunmuyor.');
    }

    const research = await hasActiveConsent(input.studentId, 'consent_research', tx);
    const [created] = await tx
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
  });
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

/** Sürümün, öğrencinin sınıfını kapsayan etkin norm grubu (yoksa boş). */
export async function activeNorms(versionId: string, grade: number): Promise<Record<string, NormStat>> {
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

  await runFinish(attempt, async (tx) => {
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values(likertRows(scaleScores).map((r) => ({ attemptId, ...r })));
    await finishAttempt(tx, attemptId, {
      completedAt: now,
      durationMs: now.getTime() - attempt.startedAt.getTime(),
      qualityFlags: {
        tooFast: quality.tooFast,
        straightLining: quality.straightLining,
        incomplete: quality.incomplete,
        notes: quality.notes,
      },
    });
  });
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

  await runFinish(attempt, async (tx) => {
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
    await tx.insert(scores).values(readingRows(result, Object.keys(payload.answers).length).map((r) => ({ attemptId, ...r })));
    await finishAttempt(tx, attemptId, {
      completedAt: now,
      durationMs: now.getTime() - attempt.startedAt.getTime(),
      qualityFlags: { tooFast: result.flags.tooFast, notes: result.flags.notes },
    });
  });
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
    if (task.kind === 'cancellation') {
      // Sayfa uygulama kimliğinden yeniden üretilir; tarayıcının gönderdiği harflere güvenilmez. Kayda
      // sayfanın kendisi de yazılır: üretim kuralı ileride değişse de eski veriler yorumlanabilsin.
      const sheet = cancellationSheet(task, attemptId);
      const { sections } = scoreCancellation(task, sheet, input as CancellationSectionInput[]);
      // Aynı bölüm iki kez geldiyse puanlamadaki gibi ilki kullanılır.
      const byIndex = new Map<number, CancellationSectionInput>();
      for (const t of input as CancellationSectionInput[]) if (!byIndex.has(t.index)) byIndex.set(t.index, t);
      return sections.map((sec) => {
        const t = byIndex.get(sec.index)!;
        return {
          attemptId,
          block,
          trialIndex: sec.index,
          stimulus: { section: sec.index, letters: sheet[sec.index].join('') },
          response: { marks: t.response.marks, times: t.response.times.map((v) => Math.round(v)), unmarks: t.response.unmarks },
          correct: null,
          rtMs: sec.ms,
        };
      });
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

  // Kayıtlı denemeler, tarayıcının gönderdiği biçime çevrilip hızlı testle aynı fonksiyonla puanlanır.
  const inputs = new Map<string, TaskInputs>();
  for (const task of def.tasks) {
    const tr = byBlock.get(task.key)!;
    if (task.kind === 'digit_span' || task.kind === 'spatial_span') {
      inputs.set(
        task.key,
        tr.map((r) => ({
          length: Number((r.stimulus as { length: number }).length),
          index: Number((r.stimulus as { index: number }).index),
          response: ((r.response as { seq: number[] }).seq ?? []).map(Number),
          rtMs: r.rtMs,
        })),
      );
    } else if (task.kind === 'flanker') {
      inputs.set(
        task.key,
        tr.map((r) => ({
          index: r.trialIndex,
          response: ((r.response as { key: 'L' | 'R' | null }).key ?? null) as 'L' | 'R' | null,
          rtMs: r.rtMs,
        })),
      );
    } else if (task.kind === 'cancellation') {
      inputs.set(
        task.key,
        tr.map((r) => {
          const resp = r.response as { marks?: number[]; times?: number[]; unmarks?: number };
          return {
            index: r.trialIndex,
            response: { marks: (resp.marks ?? []).map(Number), times: (resp.times ?? []).map(Number), unmarks: Number(resp.unmarks ?? 0) },
            rtMs: r.rtMs,
          };
        }),
      );
    } else {
      inputs.set(
        task.key,
        tr.map((r) => ({ index: r.trialIndex, response: Number((r.response as { digit: number }).digit), rtMs: r.rtMs })),
      );
    }
  }
  const { rows: rowsOut, notes } = taskScoreRows(def, inputs, attemptId);
  const scoreRows = rowsOut.map((r) => ({ attemptId, ...r }));
  const now = new Date();
  await runFinish(attempt, async (tx) => {
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values(scoreRows);
    await finishAttempt(tx, attemptId, {
      completedAt: now,
      durationMs: now.getTime() - attempt.startedAt.getTime(),
      qualityFlags: { notes },
    });
  });
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
  await runFinish(attempt, async (tx) => {
    await tx.delete(scores).where(eq(scores.attemptId, attemptId));
    await tx.insert(scores).values(quizRows(form, result).map((r) => ({ attemptId, ...r })));
    await finishAttempt(tx, attemptId, {
      completedAt: now,
      durationMs: now.getTime() - attempt.startedAt.getTime(),
      qualityFlags: { tooFast: result.flags.tooFast, straightLining: result.flags.sameLetter, notes: result.flags.notes },
    });
  });
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

/** Raporun norm açıklaması için norm grubunun özeti. */
export async function normInfo(normSetId: string | null): Promise<NormInfo | null> {
  if (!normSetId) return null;
  const [norm] = await db
    .select({ status: normSets.status, n: normSets.n, gradeMin: normSets.gradeMin, gradeMax: normSets.gradeMax, source: normSets.source })
    .from(normSets)
    .where(eq(normSets.id, normSetId))
    .limit(1);
  return norm && (norm.status === 'provisional' || norm.status === 'final') ? (norm as NormInfo) : null;
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
  const norm = await normInfo(stored.find((s) => s.normSetId)?.normSetId ?? null);
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
      norm,
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
