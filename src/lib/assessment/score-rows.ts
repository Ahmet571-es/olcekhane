import { cancellationSheet } from '@/lib/instruments/cancellation';
import type { CognitiveTask, QuizForm, TaskInstrument } from '@/lib/instruments/types';
import type { StoredScore } from '@/lib/reports/build';
import type { ScaleScore } from '@/lib/scoring/likert';
import type { QuizResult } from '@/lib/scoring/quiz';
import type { ReadingResult } from '@/lib/scoring/reading';
import {
  TaskInputError,
  scoreCancellation,
  scoreFlanker,
  scoreSpan,
  scoreSymbol,
  taskQualityNotes,
  type CancellationResult,
  type CancellationSectionInput,
  type FlankerResult,
  type FlankerTrialInput,
  type SpanTrialInput,
  type SymbolResult,
  type SymbolTrialInput,
} from '@/lib/scoring/tasks';

/**
 * Ölçek puanı satırları: puanlamanın veritabanından bağımsız sonucu. Hesaplı uygulamada `scores`
 * tablosuna yazılır; hızlı testte (hiçbir şey saklanmadan) doğrudan rapora verilir. Aynı fonksiyonlar
 * iki yolda da kullanıldığı için iki yolun puanları birebir aynıdır.
 */
export interface ScoreRow {
  scaleKey: string;
  raw: number | null;
  mean: number | null;
  nAnswered: number;
  nItems: number;
  band: string | null;
  z?: number | null;
  t?: number | null;
  percentile?: number | null;
  normSetId?: string | null;
  ciLow?: number | null;
  ciHigh?: number | null;
  extra?: Record<string, unknown> | null;
}

/** Rapor oluşturucunun beklediği biçim. */
export function toStored(r: ScoreRow): StoredScore {
  return {
    scaleKey: r.scaleKey,
    raw: r.raw,
    mean: r.mean,
    band: r.band,
    percentile: r.percentile ?? null,
    ciLow: r.ciLow ?? null,
    ciHigh: r.ciHigh ?? null,
    nAnswered: r.nAnswered,
    nItems: r.nItems,
    normSetId: r.normSetId ?? null,
    extra: r.extra ?? null,
  };
}

export function likertRows(scaleScores: ScaleScore[]): ScoreRow[] {
  return scaleScores.map((s) => ({
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
  }));
}

export function quizRows(form: QuizForm, result: QuizResult): ScoreRow[] {
  return [
    {
      scaleKey: 'total',
      raw: result.correct,
      mean: result.ratio,
      nAnswered: result.n - result.dontKnow - result.missing,
      nItems: result.n,
      band: result.band,
      extra: result as unknown as Record<string, unknown>,
    },
    ...result.domains.map((d) => ({
      scaleKey: d.key,
      raw: d.correct,
      mean: d.ratio,
      nAnswered: d.n - d.dontKnow,
      nItems: d.n,
      band: d.band,
      extra: { wrong: d.wrong, dontKnow: d.dontKnow, formKey: form.key } as Record<string, unknown>,
    })),
  ];
}

export function readingRows(result: ReadingResult, answered: number): ScoreRow[] {
  return [
    {
      scaleKey: 'comprehension',
      raw: result.correct,
      mean: result.comprehensionPct / 100,
      nAnswered: answered,
      nItems: result.total,
      band: result.band,
      extra: result as unknown as Record<string, unknown>,
    },
    {
      scaleKey: 'speed',
      raw: result.wpm,
      mean: null,
      nAnswered: 1,
      nItems: 1,
      band: null,
      extra: { wpm: result.wpm, effectiveWpm: result.effectiveWpm, wordCount: result.wordCount },
    },
  ];
}

/** Bir görevin tarayıcıdan gelen denemeleri (ya da kayıtlı denemelerden kurulan aynı biçim). */
export type TaskInputs = SpanTrialInput[] | FlankerTrialInput[] | SymbolTrialInput[] | CancellationSectionInput[];

function spanScale(t: CognitiveTask): string {
  if (t.kind === 'digit_span') return t.direction === 'forward' ? 'digit_forward' : 'digit_backward';
  return 'spatial';
}

/**
 * Bilişsel görevlerin ölçek puanları ve cevap kalitesi notları. Bütün görevlerin denemeleri gerekir.
 * `seed`, harf işaretleme sayfalarının üretildiği kimliktir (hesaplı uygulamada uygulama kimliği).
 * Geçersiz veri TaskInputError fırlatır.
 */
export function taskScoreRows(def: TaskInstrument, inputs: Map<string, TaskInputs>, seed: string): { rows: ScoreRow[]; notes: string[] } {
  const rows: ScoreRow[] = [];
  let flankerRes: FlankerResult | undefined;
  let symbolRes: SymbolResult | undefined;
  let cancellationRes: CancellationResult | undefined;

  for (const task of def.tasks) {
    const input = inputs.get(task.key);
    if (!input) throw new TaskInputError('Görevlerin hepsi tamamlanmadan sonuç hesaplanamaz.');
    if (task.kind === 'digit_span' || task.kind === 'spatial_span') {
      const { result } = scoreSpan(task, input as SpanTrialInput[]);
      rows.push({
        scaleKey: spanScale(task),
        raw: result.span,
        mean: null,
        nAnswered: result.correctTrials,
        nItems: result.totalTrials,
        band: null,
        extra: result as unknown as Record<string, unknown>,
      });
    } else if (task.kind === 'flanker') {
      const { result } = scoreFlanker(task, input as FlankerTrialInput[]);
      flankerRes = result;
      rows.push({
        scaleKey: 'attention',
        raw: Math.round(result.accuracy * 1000) / 10,
        mean: result.meanRt,
        nAnswered: result.n - result.timeouts,
        nItems: task.trials.length,
        band: null,
        extra: result as unknown as Record<string, unknown>,
      });
    } else if (task.kind === 'cancellation') {
      const { result } = scoreCancellation(task, cancellationSheet(task, seed), input as CancellationSectionInput[]);
      cancellationRes = result;
      const n = task.rows * task.columns * task.sections;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "tempo" satırında, diğerlerinde özet durur.
      rows.push(
        { scaleKey: 'tempo', raw: result.perMinute, mean: null, nAnswered: result.processed, nItems: n, band: null, extra: result as unknown as Record<string, unknown> },
        {
          scaleKey: 'isabet',
          raw: Math.round(result.hitRate * 1000) / 10,
          mean: null,
          nAnswered: result.hits,
          nItems: result.hits + result.omissions,
          band: null,
          extra: { hits: result.hits, omissions: result.omissions, commissions: result.commissions, falseAlarmRate: result.falseAlarmRate },
        },
        { scaleKey: 'net', raw: result.net, mean: null, nAnswered: result.hits, nItems: result.processed, band: null, extra: { net: result.net } },
        {
          scaleKey: 'surdurme',
          raw: result.sustainChange,
          mean: null,
          nAnswered: result.sections.length,
          nItems: task.sections,
          band: null,
          extra: { sections: result.sections.map((s) => ({ net: s.net, ms: s.ms })) },
        },
      );
    } else {
      const { result } = scoreSymbol(task, input as SymbolTrialInput[]);
      symbolRes = result;
      rows.push({
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
  return { rows, notes: taskQualityNotes({ flanker: flankerRes, symbol: symbolRes, cancellation: cancellationRes }) };
}
