import { cancellationSheet } from '@/lib/instruments/cancellation';
import type { CognitiveTask, QuizForm, TaskInstrument } from '@/lib/instruments/types';
import type { ReportScore } from '@/lib/reports/build';
import type { ScaleScore } from '@/lib/scoring/likert';
import type { QuizResult } from '@/lib/scoring/quiz';
import type { ReadingResult } from '@/lib/scoring/reading';
import {
  TaskInputError,
  scoreCancellation,
  scoreColorWord,
  scoreFlanker,
  scoreGoNoGo,
  scoreNBack,
  scoreRotation,
  scoreSpan,
  scoreSymbol,
  scoreTrail,
  taskQualityNotes,
  type CancellationResult,
  type CancellationSectionInput,
  type ColorWordResult,
  type ColorWordTrialInput,
  type FlankerResult,
  type FlankerTrialInput,
  type GoNoGoResult,
  type GoNoGoTrialInput,
  type NBackResult,
  type NBackTrialInput,
  type RotationResult,
  type RotationTrialInput,
  type SpanTrialInput,
  type SymbolResult,
  type SymbolTrialInput,
  type TrailPartInput,
  type TrailResult,
} from '@/lib/scoring/tasks';

/** Ölçek puanı satırları: puanlamanın sonucu. Hiçbir yere yazılmaz, doğrudan rapora verilir. */
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
export function toReportScore(r: ScoreRow): ReportScore {
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
export type TaskInputs =
  | SpanTrialInput[]
  | FlankerTrialInput[]
  | SymbolTrialInput[]
  | CancellationSectionInput[]
  | ColorWordTrialInput[]
  | GoNoGoTrialInput[]
  | TrailPartInput[]
  | NBackTrialInput[]
  | RotationTrialInput[];

function spanScale(t: CognitiveTask): string {
  if (t.kind === 'digit_span') return t.direction === 'forward' ? 'digit_forward' : 'digit_backward';
  return 'spatial';
}

/**
 * Bilişsel görevlerin ölçek puanları ve cevap kalitesi notları. Bütün görevlerin denemeleri gerekir.
 * `seed`, harf işaretleme sayfalarının üretildiği tohumdur (tarayıcıda rastgele üretilir).
 * Geçersiz veri TaskInputError fırlatır.
 */
export function taskScoreRows(def: TaskInstrument, inputs: Map<string, TaskInputs>, seed: string): { rows: ScoreRow[]; notes: string[] } {
  const rows: ScoreRow[] = [];
  let flankerRes: FlankerResult | undefined;
  let symbolRes: SymbolResult | undefined;
  let cancellationRes: CancellationResult | undefined;
  let colorWordRes: ColorWordResult | undefined;
  let goNoGoRes: GoNoGoResult | undefined;
  let trailRes: TrailResult | undefined;
  let nBackRes: NBackResult | undefined;
  let rotationRes: RotationResult | undefined;
  const pct = (x: number) => Math.round(x * 1000) / 10;

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
    } else if (task.kind === 'color_word') {
      const { result } = scoreColorWord(task, input as ColorWordTrialInput[]);
      colorWordRes = result;
      const correct = Math.round(result.accuracy * result.n);
      // Üç ölçek tek görevden hesaplanır; ayrıntının tamamı "renk_dogruluk" satırında durur.
      rows.push(
        { scaleKey: 'renk_dogruluk', raw: pct(result.accuracy), mean: null, nAnswered: correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'renk_hiz', raw: result.medianRt, mean: null, nAnswered: correct, nItems: result.n, band: null },
        { scaleKey: 'renk_etki', raw: result.interferenceMs, mean: null, nAnswered: correct, nItems: result.n, band: null },
      );
    } else if (task.kind === 'go_nogo') {
      const { result } = scoreGoNoGo(task, input as GoNoGoTrialInput[]);
      goNoGoRes = result;
      rows.push(
        {
          scaleKey: 'dg_durma',
          raw: pct(result.stopRate),
          mean: null,
          nAnswered: result.stopTrials - result.commissions,
          nItems: result.stopTrials,
          band: null,
          extra: result as unknown as Record<string, unknown>,
        },
        { scaleKey: 'dg_tepki', raw: pct(result.hitRate), mean: null, nAnswered: result.hits, nItems: result.goTrials, band: null },
        { scaleKey: 'dg_hiz', raw: result.medianRt, mean: null, nAnswered: result.hits, nItems: result.goTrials, band: null },
      );
    } else if (task.kind === 'trail') {
      const { result } = scoreTrail(task, input as TrailPartInput[]);
      trailRes = result;
      const [a, b] = result.parts;
      const secs = (p: typeof a) => (p.completed ? Math.round(p.timeMs / 100) / 10 : null);
      rows.push(
        { scaleKey: 'iz_a', raw: secs(a), mean: null, nAnswered: a.reached, nItems: a.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'iz_b', raw: secs(b), mean: null, nAnswered: b.reached, nItems: b.n, band: null },
        { scaleKey: 'iz_gecis', raw: result.ratio, mean: null, nAnswered: a.reached + b.reached, nItems: a.n + b.n, band: null },
      );
    } else if (task.kind === 'n_back') {
      const { result } = scoreNBack(task, input as NBackTrialInput[]);
      nBackRes = result;
      const one = result.levels.find((l) => l.n === 1);
      const two = result.levels.find((l) => l.n === 2);
      if (!one || !two) throw new TaskInputError('Görevde bir geri ve iki geri bölümleri bulunmalı.');
      // Üç ölçek tek görevden hesaplanır; ayrıntının tamamı "gh_bir" satırında durur. Puanlar ayırt etmedir (yakalama
      // oranı eksi yanlış basma oranı, yüzde olarak); yükün etkisi bir geriden iki geriye düşüştür.
      rows.push(
        { scaleKey: 'gh_bir', raw: pct(one.pr), mean: null, nAnswered: one.hits, nItems: one.targets, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'gh_iki', raw: pct(two.pr), mean: null, nAnswered: two.hits, nItems: two.targets, band: null },
        { scaleKey: 'gh_yuk', raw: pct(one.pr - two.pr), mean: null, nAnswered: one.hits + two.hits, nItems: one.targets + two.targets, band: null },
      );
    } else if (task.kind === 'mental_rotation') {
      const { result } = scoreRotation(task, input as RotationTrialInput[]);
      rotationRes = result;
      // Üç ölçek tek görevden hesaplanır; ayrıntının tamamı "zd_dogruluk" satırında durur.
      rows.push(
        { scaleKey: 'zd_dogruluk', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'zd_hiz', raw: result.medianRt, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'zd_aci', raw: result.rotationCostMs, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
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
  return {
    rows,
    notes: taskQualityNotes({
      flanker: flankerRes,
      symbol: symbolRes,
      cancellation: cancellationRes,
      colorWord: colorWordRes,
      goNoGo: goNoGoRes,
      trail: trailRes,
      nBack: nBackRes,
      rotation: rotationRes,
    }),
  };
}
