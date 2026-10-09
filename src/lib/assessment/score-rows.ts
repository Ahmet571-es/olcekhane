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
  scoreMatrix,
  scoreNBack,
  scoreNumberSeries,
  scoreVerbal,
  scoreFolding,
  scoreVocabulary,
  scoreRuleSwitch,
  scoreWordList,
  scoreLogic,
  scoreNumeric,
  scoreCube,
  scoreReaction,
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
  type MatrixResult,
  type MatrixTrialInput,
  type NBackResult,
  type NBackTrialInput,
  type NumberSeriesResult,
  type NumberSeriesTrialInput,
  type VerbalResult,
  type VerbalTrialInput,
  type FoldingResult,
  type FoldingTrialInput,
  type VocabularyResult,
  type VocabularyTrialInput,
  type RuleSwitchResult,
  type RuleSwitchTrialInput,
  type WordListResult,
  type WordListTrialInput,
  type LogicResult,
  type LogicTrialInput,
  type NumericResult,
  type NumericTrialInput,
  type CubeResult,
  type CubeTrialInput,
  type ReactionResult,
  type ReactionTrialInput,
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
  | RotationTrialInput[]
  | ReactionTrialInput[]
  | MatrixTrialInput[]
  | NumberSeriesTrialInput[]
  | VerbalTrialInput[]
  | FoldingTrialInput[]
  | VocabularyTrialInput[]
  | RuleSwitchTrialInput[]
  | WordListTrialInput[]
  | LogicTrialInput[]
  | NumericTrialInput[]
  | CubeTrialInput[];

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
  let reactionRes: ReactionResult | undefined;
  let matrixRes: MatrixResult | undefined;
  let numberSeriesRes: NumberSeriesResult | undefined;
  let verbalRes: VerbalResult | undefined;
  let logicRes: LogicResult | undefined;
  let numericRes: NumericResult | undefined;
  let cubeRes: CubeResult | undefined;
  let foldingRes: FoldingResult | undefined;
  let vocabularyRes: VocabularyResult | undefined;
  let ruleSwitchRes: RuleSwitchResult | undefined;
  let wordListRes: WordListResult | undefined;
  const pct = (x: number) => Math.round(x * 1000) / 10;

  for (const task of def.tasks) {
    const input = inputs.get(task.key);
    if (!input) throw new TaskInputError('Görevlerin hepsi tamamlanmadan sonuç hesaplanamaz.');
    // Yalnızca süreli sembol eşleştirmede hiç cevap verilmemiş olabilir; öteki görevler her denemeyi kaydeder.
    if (input.length === 0 && task.kind !== 'symbol_match') throw new TaskInputError('Görevlerin hepsi tamamlanmadan sonuç hesaplanamaz.');
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
    } else if (task.kind === 'reaction_time') {
      const { result } = scoreReaction(task, input as ReactionTrialInput[]);
      reactionRes = result;
      const { simple, choice } = result;
      // Üç ölçek tek görevden hesaplanır; ayrıntının tamamı "th_basit" satırında durur.
      rows.push(
        { scaleKey: 'th_basit', raw: simple.medianRt, mean: null, nAnswered: simple.correct, nItems: simple.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'th_secmeli', raw: choice.medianRt, mean: null, nAnswered: choice.correct, nItems: choice.n, band: null },
        { scaleKey: 'th_fark', raw: result.choiceCostMs, mean: null, nAnswered: simple.correct + choice.correct, nItems: simple.n + choice.n, band: null },
      );
    } else if (task.kind === 'matrix_reasoning') {
      const { result } = scoreMatrix(task, input as MatrixTrialInput[]);
      matrixRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "sa_dogru" satırında durur.
      rows.push(
        { scaleKey: 'sa_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'sa_duzey', raw: result.reached, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sa_kural', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sa_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'number_series') {
      const { result } = scoreNumberSeries(task, input as NumberSeriesTrialInput[]);
      numberSeriesRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "sd_dogru" satırında durur.
      rows.push(
        { scaleKey: 'sd_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'sd_duzey', raw: result.reached, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sd_kural', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sd_calisma', raw: result.medianRt, mean: null, nAnswered: result.n - result.skipped, nItems: result.n, band: null },
      );
    } else if (task.kind === 'verbal_reasoning') {
      const { result } = scoreVerbal(task, input as VerbalTrialInput[]);
      verbalRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "sz_dogru" satırında durur.
      rows.push(
        { scaleKey: 'sz_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'sz_duzey', raw: result.reached, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sz_tur', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sz_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'paper_folding') {
      const { result } = scoreFolding(task, input as FoldingTrialInput[]);
      foldingRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "kk_dogru" satırında durur.
      rows.push(
        { scaleKey: 'kk_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'kk_duzey', raw: result.reached, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'kk_tur', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'kk_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'vocabulary') {
      const { result } = scoreVocabulary(task, input as VocabularyTrialInput[]);
      vocabularyRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "kb_dogru" satırında durur.
      rows.push(
        { scaleKey: 'kb_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'kb_duzey', raw: result.reached, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'kb_tur', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'kb_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'rule_switch') {
      const { result } = scoreRuleSwitch(task, input as RuleSwitchTrialInput[]);
      ruleSwitchRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "kd_dogruluk" satırında durur.
      rows.push(
        { scaleKey: 'kd_dogruluk', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'kd_degisim', raw: result.switchCost, mean: null, nAnswered: result.switch.nRt, nItems: result.switch.n, band: null },
        { scaleKey: 'kd_karisik', raw: result.mixingCost, mean: null, nAnswered: result.repeat.nRt, nItems: result.repeat.n, band: null },
        { scaleKey: 'kd_calisma', raw: result.medianRt, mean: null, nAnswered: result.answered, nItems: result.n, band: null },
      );
    } else if (task.kind === 'logical_reasoning') {
      const { result } = scoreLogic(task, input as LogicTrialInput[]);
      logicRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "ma_dogru" satırında durur.
      rows.push(
        { scaleKey: 'ma_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'ma_kosul', raw: null, mean: null, nAnswered: result.conditional.correct, nItems: result.conditional.n, band: null },
        { scaleKey: 'ma_inanc', raw: result.beliefIndex, mean: null, nAnswered: result.categorical.correct, nItems: result.categorical.n, band: null },
        { scaleKey: 'ma_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'numerical_reasoning') {
      const { result } = scoreNumeric(task, input as NumericTrialInput[]);
      numericRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "sy_dogru" satırında durur.
      rows.push(
        { scaleKey: 'sy_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'sy_oranti', raw: null, mean: null, nAnswered: result.prop.correct + result.nonProp.correct, nItems: result.prop.n + result.nonProp.n, band: null },
        { scaleKey: 'sy_esitlik', raw: null, mean: null, nAnswered: result.equal.correct, nItems: result.equal.n, band: null },
        { scaleKey: 'sy_calisma', raw: result.medianRt, mean: null, nAnswered: result.n - result.blank, nItems: result.n, band: null },
      );
    } else if (task.kind === 'cube_net') {
      const { result } = scoreCube(task, input as CubeTrialInput[]);
      cubeRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "kp_dogru" satırında durur.
      rows.push(
        { scaleKey: 'kp_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'kp_duzey', raw: result.reached, mean: null, nAnswered: result.n, nItems: result.n, band: null },
        { scaleKey: 'kp_tur', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'kp_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'word_list') {
      const { result } = scoreWordList(task, input as WordListTrialInput[]);
      wordListRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "kl_ogrenme" satırında durur.
      const last = result.trials[result.trials.length - 1];
      rows.push(
        { scaleKey: 'kl_ogrenme', raw: result.total, mean: null, nAnswered: last.correct, nItems: result.totalMax, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'kl_koruma', raw: result.delayed.correct, mean: null, nAnswered: result.delayed.correct, nItems: result.listLength, band: null },
        { scaleKey: 'kl_tanima', raw: pct(result.recognition.discrimination), mean: null, nAnswered: result.recognition.hits, nItems: result.recognition.n, band: null },
        { scaleKey: 'kl_calisma', raw: result.extraLearning, mean: null, nAnswered: result.entries, nItems: result.totalMax, band: null },
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
      reaction: reactionRes,
      matrix: matrixRes,
      numberSeries: numberSeriesRes,
      verbal: verbalRes,
      folding: foldingRes,
      vocabulary: vocabularyRes,
      ruleSwitch: ruleSwitchRes,
      wordList: wordListRes,
      logic: logicRes,
      numeric: numericRes,
      cube: cubeRes,
    }),
  };
}
