import { cancellationSheet } from '@/lib/instruments/cancellation';
import { symbolSearchTrials } from '@/lib/instruments/symbol-search';
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
  scoreLetterSeries,
  scoreVerbal,
  scoreFolding,
  scoreVocabulary,
  scoreRuleSwitch,
  scoreWordList,
  scoreLogic,
  scoreNumeric,
  scoreCube,
  scoreHidden,
  scoreAnalogy,
  scorePattern,
  scoreLetterNumber,
  letterNumberQualityNotes,
  scoreSymbolSearch,
  symbolSearchQualityNotes,
  scoreReflection,
  scoreTower,
  scoreRotation3d,
  scoreComplexSpan,
  scorePerspective,
  scoreReaction,
  scoreRotation,
  scoreSpan,
  scoreSymbol,
  scoreArithmetic,
  combineArithmetic,
  arithQualityNotes,
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
  type LetterSeriesResult,
  type LetterSeriesTrialInput,
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
  type HiddenResult,
  type HiddenTrialInput,
  type AnalogyResult,
  type AnalogyTrialInput,
  type PatternResult,
  type PatternTrialInput,
  type LetterNumberResult,
  type LetterNumberTrialInput,
  type SymbolSearchResult,
  type SymbolSearchTrialInput,
  type ReflectionResult,
  type ReflectionTrialInput,
  type TowerResult,
  type TowerTrialInput,
  type Rotation3dResult,
  type Rotation3dTrialInput,
  type ComplexSpanResult,
  type ComplexSpanTrialInput,
  type PerspectiveResult,
  type PerspectiveTrialInput,
  type ReactionResult,
  type ReactionTrialInput,
  type RotationResult,
  type RotationTrialInput,
  type SpanTrialInput,
  type SymbolResult,
  type SymbolTrialInput,
  type ArithSectionResult,
  type ArithTrialInput,
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
  | LetterSeriesTrialInput[]
  | VerbalTrialInput[]
  | FoldingTrialInput[]
  | VocabularyTrialInput[]
  | RuleSwitchTrialInput[]
  | WordListTrialInput[]
  | LogicTrialInput[]
  | NumericTrialInput[]
  | CubeTrialInput[]
  | HiddenTrialInput[]
  | AnalogyTrialInput[]
  | PatternTrialInput[]
  | LetterNumberTrialInput[]
  | SymbolSearchTrialInput[]
  | ReflectionTrialInput[]
  | TowerTrialInput[]
  | Rotation3dTrialInput[]
  | ComplexSpanTrialInput[]
  | PerspectiveTrialInput[]
  | ArithTrialInput[];

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
  let letterSeriesRes: LetterSeriesResult | undefined;
  let verbalRes: VerbalResult | undefined;
  let logicRes: LogicResult | undefined;
  let numericRes: NumericResult | undefined;
  let cubeRes: CubeResult | undefined;
  let hiddenRes: HiddenResult | undefined;
  let analogyRes: AnalogyResult | undefined;
  let patternRes: PatternResult | undefined;
  let letterNumberRes: LetterNumberResult | undefined;
  let symbolSearchRes: SymbolSearchResult | undefined;
  let reflectionRes: ReflectionResult | undefined;
  let towerRes: TowerResult | undefined;
  let rotation3dRes: Rotation3dResult | undefined;
  let complexSpanRes: ComplexSpanResult | undefined;
  let perspectiveRes: PerspectiveResult | undefined;
  let foldingRes: FoldingResult | undefined;
  let vocabularyRes: VocabularyResult | undefined;
  let ruleSwitchRes: RuleSwitchResult | undefined;
  let wordListRes: WordListResult | undefined;
  const arithSections: ArithSectionResult[] = [];
  const pct = (x: number) => Math.round(x * 1000) / 10;

  for (const task of def.tasks) {
    const input = inputs.get(task.key);
    if (!input) throw new TaskInputError('Görevlerin hepsi tamamlanmadan sonuç hesaplanamaz.');
    // Yalnızca süreli görevlerde (sembol eşleştirme, simge bulma, zihinden hesaplama) hiç cevap verilmemiş olabilir; öteki görevler her
    // denemeyi kaydeder.
    if (input.length === 0 && task.kind !== 'symbol_match' && task.kind !== 'symbol_search' && task.kind !== 'mental_arithmetic') throw new TaskInputError('Görevlerin hepsi tamamlanmadan sonuç hesaplanamaz.');
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
    } else if (task.kind === 'letter_series') {
      const { result } = scoreLetterSeries(task, input as LetterSeriesTrialInput[]);
      letterSeriesRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "hd_dogru" satırında durur.
      rows.push(
        { scaleKey: 'hd_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'hd_duzey', raw: result.reached, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'hd_kural', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'hd_calisma', raw: result.medianRt, mean: null, nAnswered: result.n - result.skipped, nItems: result.n, band: null },
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
    } else if (task.kind === 'hidden_figures') {
      const { result } = scoreHidden(task, input as HiddenTrialInput[]);
      hiddenRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "gs_dogru" satırında durur.
      rows.push(
        { scaleKey: 'gs_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'gs_duzey', raw: result.reached, mean: null, nAnswered: result.n, nItems: result.n, band: null },
        { scaleKey: 'gs_yanilgi', raw: null, mean: null, nAnswered: result.wrong, nItems: result.n, band: null },
        { scaleKey: 'gs_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'figural_analogy') {
      const { result } = scoreAnalogy(task, input as AnalogyTrialInput[]);
      analogyRes = result;
      // Beş ölçek tek görevden hesaplanır; ayrıntının tamamı "sb_dogru" satırında durur.
      rows.push(
        { scaleKey: 'sb_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'sb_duzey', raw: result.reached, mean: null, nAnswered: result.n, nItems: result.n, band: null },
        { scaleKey: 'sb_tur', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'sb_yanilgi', raw: null, mean: null, nAnswered: result.wrong, nItems: result.n, band: null },
        { scaleKey: 'sb_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'pattern_memory') {
      const { result } = scorePattern(task, input as PatternTrialInput[]);
      patternRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "dh_aralik" satırında durur.
      rows.push(
        { scaleKey: 'dh_aralik', raw: result.span, mean: null, nAnswered: result.correct, nItems: result.trials, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'dh_desen', raw: result.correct, mean: null, nAnswered: result.correct, nItems: result.trials, band: null },
        { scaleKey: 'dh_hata', raw: null, mean: null, nAnswered: result.wrong, nItems: result.trials, band: null },
        { scaleKey: 'dh_calisma', raw: result.medianRt, mean: null, nAnswered: result.trials, nItems: result.trials, band: null },
      );
    } else if (task.kind === 'letter_number') {
      const { result } = scoreLetterNumber(task, input as LetterNumberTrialInput[]);
      letterNumberRes = result;
      // Beş ölçek tek görevden hesaplanır; ayrıntının tamamı "hs_aralik" satırında durur.
      rows.push(
        { scaleKey: 'hs_aralik', raw: result.span, mean: null, nAnswered: result.correct, nItems: result.trials, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'hs_dizi', raw: result.correct, mean: null, nAnswered: result.correct, nItems: result.trials, band: null },
        { scaleKey: 'hs_hata', raw: null, mean: null, nAnswered: result.wrong, nItems: result.trials, band: null },
        { scaleKey: 'hs_turler', raw: null, mean: null, nAnswered: result.itemsRecalled, nItems: result.itemsShown, band: null },
        { scaleKey: 'hs_calisma', raw: result.medianRt, mean: null, nAnswered: result.trials, nItems: result.trials, band: null },
      );
    } else if (task.kind === 'symbol_search') {
      const { result } = scoreSymbolSearch(task, symbolSearchTrials(task, seed), input as SymbolSearchTrialInput[]);
      symbolSearchRes = result;
      // Beş ölçek tek görevden hesaplanır; ayrıntının tamamı "sg_hiz" satırında durur.
      rows.push(
        { scaleKey: 'sg_hiz', raw: result.correct, mean: result.medianRt, nAnswered: result.answered, nItems: task.trials, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'sg_dogruluk', raw: Math.round(result.accuracy * 1000) / 10, mean: null, nAnswered: result.correct, nItems: result.answered, band: null },
        { scaleKey: 'sg_benzer', raw: null, mean: null, nAnswered: result.look.correct, nItems: result.look.n, band: null },
        { scaleKey: 'sg_varyok', raw: null, mean: null, nAnswered: result.absent.correct, nItems: result.absent.n, band: null },
        { scaleKey: 'sg_denge', raw: null, mean: null, nAnswered: result.fast.correct, nItems: result.fast.n, band: null },
      );
    } else if (task.kind === 'cognitive_reflection') {
      const { result } = scoreReflection(task, input as ReflectionTrialInput[]);
      reflectionRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "dk_dogru" satırında durur.
      rows.push(
        { scaleKey: 'dk_dogru', raw: pct(result.lure.correct / result.lure.n), mean: null, nAnswered: result.lure.correct, nItems: result.lure.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'dk_yanlis', raw: null, mean: null, nAnswered: result.lure.lure, nItems: result.lure.n - result.lure.correct, band: null },
        { scaleKey: 'dk_es', raw: null, mean: null, nAnswered: result.control.correct, nItems: result.control.n, band: null },
        { scaleKey: 'dk_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'mental_rotation_3d') {
      const { result } = scoreRotation3d(task, input as Rotation3dTrialInput[]);
      rotation3dRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "ud_dogru" satırında durur.
      rows.push(
        { scaleKey: 'ud_dogru', raw: pct(result.accuracy), mean: null, nAnswered: result.correct, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'ud_bolum', raw: null, mean: null, nAnswered: result.correct, nItems: result.n, band: null },
        { scaleKey: 'ud_ayna', raw: null, mean: null, nAnswered: result.n - result.correct, nItems: result.n, band: null },
        { scaleKey: 'ud_calisma', raw: result.medianRt, mean: null, nAnswered: result.n, nItems: result.n, band: null },
      );
    } else if (task.kind === 'perspective') {
      const { result } = scorePerspective(task, input as PerspectiveTrialInput[]);
      perspectiveRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "ba_hata" satırında durur. Ham puan ortalama açı hatasıdır
      // (derece; küçük olan daha isabetli).
      rows.push(
        { scaleKey: 'ba_hata', raw: result.meanError, mean: null, nAnswered: result.close, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'ba_donus', raw: Math.round((result.large.meanError - result.small.meanError) * 10) / 10, mean: null, nAnswered: result.small.n, nItems: result.n, band: null },
        { scaleKey: 'ba_tur', raw: null, mean: null, nAnswered: result.ego.count + result.mirror.count, nItems: result.n, band: null },
        { scaleKey: 'ba_calisma', raw: result.medianRt, mean: null, nAnswered: result.answered, nItems: result.n, band: null },
      );
    } else if (task.kind === 'complex_span') {
      const { result } = scoreComplexSpan(task, input as ComplexSpanTrialInput[]);
      complexSpanRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "hb_harf" satırında durur.
      rows.push(
        { scaleKey: 'hb_harf', raw: result.correct, mean: null, nAnswered: result.correct, nItems: result.letters, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'hb_uzunluk', raw: result.longest, mean: null, nAnswered: result.perfectSets, nItems: result.sets, band: null },
        { scaleKey: 'hb_islem', raw: pct(result.ops.accuracy), mean: null, nAnswered: result.ops.correct, nItems: result.ops.n, band: null },
        { scaleKey: 'hb_hata', raw: null, mean: null, nAnswered: result.order + result.intrusion + result.blank, nItems: result.letters, band: null },
      );
    } else if (task.kind === 'tower') {
      const { result } = scoreTower(task, input as TowerTrialInput[]);
      towerRes = result;
      // Dört ölçek tek görevden hesaplanır; ayrıntının tamamı "kg_dogru" satırında durur.
      rows.push(
        { scaleKey: 'kg_dogru', raw: pct(result.optimal / result.n), mean: null, nAnswered: result.optimal, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> },
        { scaleKey: 'kg_uzunluk', raw: null, mean: null, nAnswered: result.long.optimal, nItems: result.long.n, band: null },
        { scaleKey: 'kg_cozum', raw: null, mean: null, nAnswered: result.extra, nItems: result.n, band: null },
        { scaleKey: 'kg_plan', raw: result.medianPick, mean: null, nAnswered: result.n - result.idle, nItems: result.n, band: null },
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
    } else if (task.kind === 'mental_arithmetic') {
      // Her işlem ayrı bir görevdir; bölümün ayrıntısı kendi satırında, dört bölümün birleşimi döngüden sonra "zh_genel"
      // satırında durur.
      const { result } = scoreArithmetic(task, input as ArithTrialInput[]);
      arithSections.push(result);
      const key = { add: 'zh_toplama', sub: 'zh_cikarma', mul: 'zh_carpma', div: 'zh_bolme' }[task.op];
      rows.push({ scaleKey: key, raw: result.correct, mean: null, nAnswered: result.answered, nItems: result.n, band: null, extra: result as unknown as Record<string, unknown> });
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
  const arith = arithSections.length ? combineArithmetic(arithSections) : null;
  if (arith) {
    const read = (k: number | null) => (k === null ? null : Math.round(k * 1000) / 10);
    rows.push(
      { scaleKey: 'zh_genel', raw: arith.correct, mean: null, nAnswered: arith.answered, nItems: arithSections.reduce((t, s) => t + s.n, 0), band: null, extra: arith as unknown as Record<string, unknown> },
      { scaleKey: 'zh_dogruluk', raw: read(arith.accuracy), mean: null, nAnswered: arith.correct, nItems: arith.answered, band: null },
      { scaleKey: 'zh_hiz', raw: arith.factMedianRt, mean: null, nAnswered: arith.correct, nItems: arith.answered, band: null },
    );
  }
  return {
    rows,
    notes: [...(arith ? arithQualityNotes(arith) : []), ...(letterNumberRes ? letterNumberQualityNotes(letterNumberRes) : []), ...(symbolSearchRes ? symbolSearchQualityNotes(symbolSearchRes) : []), ...taskQualityNotes({
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
      letterSeries: letterSeriesRes,
      verbal: verbalRes,
      folding: foldingRes,
      vocabulary: vocabularyRes,
      ruleSwitch: ruleSwitchRes,
      wordList: wordListRes,
      logic: logicRes,
      numeric: numericRes,
      cube: cubeRes,
      hidden: hiddenRes,
      analogy: analogyRes,
      pattern: patternRes,
      reflection: reflectionRes,
      tower: towerRes,
      rotation3d: rotation3dRes,
      complexSpan: complexSpanRes,
      perspective: perspectiveRes,
    })],
  };
}
