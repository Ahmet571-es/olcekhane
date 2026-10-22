import type {
  CancellationTask,
  ColorWordTask,
  DigitSpanTask,
  FlankerTask,
  GoNoGoTask,
  MatrixReasoningTask,
  MatrixRule,
  MentalRotationTask,
  MentalRotation3dTask,
  ComplexSpanTask,
  NBackTask,
  NumberSeriesRule,
  NumberSeriesTask,
  ReactionTimeTask,
  SpatialSpanTask,
  SymbolMatchTask,
  TrailTask,
  VerbalItemType,
  VerbalReasoningTask,
  FoldingLure,
  FoldingType,
  PaperFoldingTask,
  VocabularyLure,
  VocabularyTask,
  VocabularyType,
  RuleSwitchTask,
  WordListLure,
  WordListTask,
  LogicForm,
  LogicalReasoningTask,
  NumericKind,
  NumericLureKind,
  NumericalReasoningTask,
  CubeNetTask,
  CubeType,
  CognitiveReflectionTask,
  TowerTask,
  PerspectiveTask,
  HiddenFiguresTask,
  PatternMemoryTask,
  LetterSeriesRule,
  LetterSeriesTask,
} from '@/lib/instruments/types';
import { TURKISH_ALPHABET } from '@/lib/instruments/types';
import type { CubeLure } from '@/lib/instruments/cube';
import type { HiddenLure } from '@/lib/instruments/hidden';
import { LOGIC_CONDITIONAL, LOGIC_CONFLICT, logicRapidMs } from '@/lib/instruments/logic';
import { NUMERIC_EQUAL, NUMERIC_KINDS, NUMERIC_NONPROP, NUMERIC_PROP, numericRapidMs } from '@/lib/instruments/numeric';
import { DISPARITIES, disparity } from '@/lib/instruments/rotation';
import { reflectionRapidMs } from '@/lib/instruments/reflection';
import { TOWER_MAX_MOVES, towerDecode, towerMove, towerSame } from '@/lib/instruments/tower';
import { verbalRapidMs } from '@/lib/instruments/verbal';
import { vocabularyRapidMs } from '@/lib/instruments/vocabulary';
import { ruleAnswer, ruleCongruent, ruleSwitchKinds } from '@/lib/instruments/rule-switch';
import { WORD_RECOGNITION_FAST_MS, matchWord, normalizeWord, wordListRecalls } from '@/lib/instruments/word-list';
import { nBackRoles } from '@/lib/instruments/sequences';
import { blankOf, opTrue } from '@/lib/instruments/complex-span';
import { cellsAdjacent } from '@/lib/instruments/pattern';
import {
  PA_CLOSE,
  PA_EGO_MIN_SHIFT,
  PA_SHIFT_BINS,
  PA_SMALL_MAX,
  PA_ZONE,
  angleDiff,
  correctAngle,
  egocentricAngle,
  headingOf,
  mirrorAngle,
  normDeg,
  shiftBin,
} from '@/lib/instruments/perspective';
import { median, round } from './stats';

/**
 * Bilişsel görevlerin puanlanması. Doğruluk her zaman sunucuda, görev tanımındaki uyaranlardan
 * yeniden hesaplanır; tarayıcının bildirdiği "doğru/yanlış" bilgisine güvenilmez.
 */

export class TaskInputError extends Error {}

/* ---------- Dizi görevleri (sayı ve kutu) ---------- */

export interface SpanTrialInput {
  length: number;
  index: number;
  response: number[];
  rtMs: number | null;
}

export interface SpanTrialScored extends SpanTrialInput {
  stimulus: number[];
  correct: boolean;
}

export interface SpanResult {
  /** Art arda başarılı olunan en uzun dizi (her uzunlukta en az bir doğru). En kısa düzeyde başarı yoksa 0. */
  span: number;
  /** En kısa test düzeyinde de başarı yoksa true. */
  belowFloor: boolean;
  /** Görevin sunabildiği en uzun diziye ulaşıldı mı? */
  ceiling: boolean;
  correctTrials: number;
  totalTrials: number;
  ladder: { length: number; results: boolean[] }[];
}

export function spanStimulus(task: DigitSpanTask | SpatialSpanTask, length: number, index: number): number[] | null {
  const row = task.sequences[length - task.startLength];
  return row?.[index] ?? null;
}

export function expectedSpanResponse(task: DigitSpanTask | SpatialSpanTask, stimulus: number[]): number[] {
  return task.kind === 'digit_span' && task.direction === 'backward' ? [...stimulus].reverse() : stimulus;
}

export function scoreSpan(task: DigitSpanTask | SpatialSpanTask, input: SpanTrialInput[]): { trials: SpanTrialScored[]; result: SpanResult } {
  const maxLength = task.startLength + task.sequences.length - 1;
  const [lo, hi] = task.kind === 'digit_span' ? [1, 9] : [0, task.boxes.length - 1];
  const seen = new Set<string>();
  const trials: SpanTrialScored[] = [];
  for (const t of input) {
    if (!Number.isInteger(t.length) || t.length < task.startLength || t.length > maxLength) throw new TaskInputError('Geçersiz dizi uzunluğu.');
    if (t.index !== 0 && t.index !== 1) throw new TaskInputError('Geçersiz deneme.');
    if (!Array.isArray(t.response) || t.response.length > 12 || t.response.some((v) => !Number.isInteger(v) || v < lo || v > hi)) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    const id = `${t.length}.${t.index}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const stimulus = spanStimulus(task, t.length, t.index)!;
    const expected = expectedSpanResponse(task, stimulus);
    const correct = t.response.length === expected.length && t.response.every((v, i) => v === expected[i]);
    trials.push({ ...t, stimulus, correct });
  }
  trials.sort((a, b) => a.length - b.length || a.index - b.index);

  const ladder: SpanResult['ladder'] = [];
  let span = 0;
  for (let len = task.startLength; len <= maxLength; len++) {
    const here = trials.filter((t) => t.length === len);
    if (here.length === 0) break;
    const results = here.map((t) => t.correct);
    ladder.push({ length: len, results });
    if (results.some(Boolean)) span = len;
    else break;
  }
  return {
    trials,
    result: {
      span,
      belowFloor: span === 0,
      ceiling: span === maxLength,
      correctTrials: trials.filter((t) => t.correct).length,
      totalTrials: trials.length,
      ladder,
    },
  };
}

/* ---------- Ok görevi ---------- */

export interface FlankerTrialInput {
  index: number;
  response: 'L' | 'R' | null;
  rtMs: number | null;
}

export interface FlankerTrialScored extends FlankerTrialInput {
  dir: 'L' | 'R';
  congruent: boolean;
  correct: boolean;
  anticipation: boolean;
  timeout: boolean;
}

export interface FlankerResult {
  n: number;
  accuracy: number;
  accCongruent: number;
  accIncongruent: number;
  /** Doğru denemelerde ortalama tepki süresi (ms). */
  meanRt: number | null;
  meanRtCongruent: number | null;
  meanRtIncongruent: number | null;
  anticipations: number;
  timeouts: number;
}

/** 150 ms'den kısa tepkiler uyarandan önce verilmiş sayılır (tahmin). */
export const ANTICIPATION_MS = 150;

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function scoreFlanker(task: FlankerTask, input: FlankerTrialInput[]): { trials: FlankerTrialScored[]; result: FlankerResult } {
  const seen = new Set<number>();
  const trials: FlankerTrialScored[] = [];
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= task.trials.length) throw new TaskInputError('Geçersiz deneme.');
    if (t.response !== null && t.response !== 'L' && t.response !== 'R') throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0 || t.rtMs > 60_000)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    const stim = task.trials[t.index];
    const timeout = t.response === null || t.rtMs === null || t.rtMs > task.timeoutMs;
    const anticipation = !timeout && (t.rtMs as number) < ANTICIPATION_MS;
    const correct = !timeout && !anticipation && t.response === stim.dir;
    trials.push({ ...t, dir: stim.dir, congruent: stim.congruent, correct, anticipation, timeout });
  }
  trials.sort((a, b) => a.index - b.index);
  const acc = (xs: FlankerTrialScored[]) => (xs.length ? round(xs.filter((t) => t.correct).length / xs.length, 3) : 0);
  const rt = (xs: FlankerTrialScored[]) => {
    const m = mean(xs.filter((t) => t.correct).map((t) => t.rtMs as number));
    return m === null ? null : Math.round(m);
  };
  const cong = trials.filter((t) => t.congruent);
  const inc = trials.filter((t) => !t.congruent);
  return {
    trials,
    result: {
      n: trials.length,
      accuracy: acc(trials),
      accCongruent: acc(cong),
      accIncongruent: acc(inc),
      meanRt: rt(trials),
      meanRtCongruent: rt(cong),
      meanRtIncongruent: rt(inc),
      anticipations: trials.filter((t) => t.anticipation).length,
      timeouts: trials.filter((t) => t.timeout).length,
    },
  };
}

/* ---------- Sembol eşleştirme ---------- */

export interface SymbolTrialInput {
  index: number;
  /** Basılan rakam (1–9). */
  response: number;
  rtMs: number | null;
}

export interface SymbolTrialScored extends SymbolTrialInput {
  symbol: number;
  correct: boolean;
}

export interface SymbolResult {
  attempted: number;
  correct: number;
  errors: number;
  accuracy: number;
  /** Dakikada doğru eşleştirme. */
  perMinute: number;
  medianRt: number | null;
}

export function scoreSymbol(task: SymbolMatchTask, input: SymbolTrialInput[]): { trials: SymbolTrialScored[]; result: SymbolResult } {
  const seen = new Set<number>();
  const trials: SymbolTrialScored[] = [];
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= task.sequence.length) throw new TaskInputError('Geçersiz deneme.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.symbols.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0 || t.rtMs > task.durationMs)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    const symbol = task.sequence[t.index];
    trials.push({ ...t, symbol, correct: t.response === symbol + 1 });
  }
  trials.sort((a, b) => a.index - b.index);
  const correct = trials.filter((t) => t.correct).length;
  const rts = trials.map((t) => t.rtMs).filter((v): v is number => typeof v === 'number');
  return {
    trials,
    result: {
      attempted: trials.length,
      correct,
      errors: trials.length - correct,
      accuracy: trials.length ? round(correct / trials.length, 3) : 0,
      perMinute: round(correct / (task.durationMs / 60_000), 1),
      medianRt: rts.length ? Math.round(median(rts)) : null,
    },
  };
}

/* ---------- Harf işaretleme (sürekli dikkat) ---------- */

export interface CancellationSectionInput {
  /** Bölüm sırası (0'dan başlar). */
  index: number;
  response: {
    /** Bölüm bittiğinde işaretli olan harflerin sayfadaki sırası. */
    marks: number[];
    /** Her işaretin bölüm başından itibaren zamanı (ms), marks ile aynı sırada. */
    times: number[];
    /** İşaretin kaldırılma sayısı (düzeltmeler). */
    unmarks: number;
  };
  /** Bölümde geçen süre (ms); sayfa süre bitmeden bitirilirse daha kısadır. */
  rtMs: number | null;
}

export interface CancellationSectionScored {
  index: number;
  /**
   * Taranan harf: sayfanın başından, kesintisiz çalışmanın son işaretine kadar. Bu çalışmanın çok ilerisinde tek
   * başına kalan bir iki işaret (ör. telefonda kaydırırken yanlışlıkla dokunma) taranan kısmı uzatmaz.
   */
  processed: number;
  /** Taranan kısımdaki hedef sayısı. */
  targets: number;
  hits: number;
  /** Taranan kısımda işaretlenmeyen hedefler. */
  omissions: number;
  /** İşaretlenen çeldiriciler. */
  commissions: number;
  /** Doğru işaretlerden yanlış işaretler çıkınca kalan. */
  net: number;
  ms: number;
  unmarks: number;
  /** Taranan kısmın ötesinde kalan, yanlışlıkla dokunma sayılan işaretler (puana girmez). */
  strays: number;
}

/** İki işaret arasında bu kadar satırdan uzun boşluk varsa sonraki işaretler ayrı bir öbektir. */
const STRAY_GAP_ROWS = 3;
/** Uzun bir boşluktan sonra en az bu kadar işaretlik öbek gerçek çalışmadır (ör. satır atlayıp devam etmek). */
const MIN_RUN = 3;

/**
 * Taranan kısmın son harfi. İşaretler sayfadaki sıralarına göre öbeklere ayrılır: aralarında üç satırdan uzun boşluk
 * olan işaretler ayrı öbektir. Taranan kısım, en az üç işaretli son öbeğin sonunda biter; ondan sonra gelen küçük
 * öbekler yanlışlıkla dokunma sayılır. Her satırda en az bir aranan harf olduğu için kesintisiz çalışan biri üç satır
 * boyunca hiç işaret koymaz. Hiçbir öbek üç işaretli değilse ilk öbeğin sonu alınır.
 */
export function scannedEnd(marks: number[], columns: number): number {
  if (!marks.length) return -1;
  const sorted = [...marks].sort((a, b) => a - b);
  const gap = STRAY_GAP_ROWS * columns;
  const runs: number[][] = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] > gap) runs.push([sorted[i]]);
    else runs[runs.length - 1].push(sorted[i]);
  }
  let end = 0;
  for (let k = 1; k < runs.length; k++) if (runs[k].length >= MIN_RUN) end = k;
  return runs[end][runs[end].length - 1];
}

export interface CancellationResult {
  sections: CancellationSectionScored[];
  processed: number;
  hits: number;
  omissions: number;
  commissions: number;
  net: number;
  /** Dakikada taranan harf. */
  perMinute: number;
  /** Taranan kısımdaki hedeflerden bulunanların oranı (0–1). */
  hitRate: number;
  /** Taranan çeldiricilerden yanlışlıkla işaretlenenlerin oranı (0–1). */
  falseAlarmRate: number;
  /**
   * İkinci yarıdaki bölümlerin dakikadaki net doğrusunun ilk yarıya göre değişimi (%). İlk yarıda net
   * doğru yoksa hesaplanmaz.
   */
  sustainChange: number | null;
  /**
   * Değişim ölçümün kendi oynaklığını aşıyor mu: iki yarının dakikadaki net doğrusu arasındaki fark, işaret sayılarından
   * hesaplanan standart hatanın iki katından büyük (sayım verisinde bir sayının varyansı yaklaşık kendisidir; net
   * doğrunun varyansı doğru ve yanlış işaretlerin toplamıdır). Az işaret yapan küçük öğrencilerde bölümler arası
   * farkların büyük kısmı rastlantıdır; yalnızca bu sınırı aşan değişim yorumlanır.
   */
  sustainClear: boolean;
  /** Taranan kısmın ötesinde kalan, puana katılmayan işaretlerin toplamı. */
  strays: number;
  /** Bir bölümün sayfası son satırına kadar tarandı (sayfa bu kişi için kısa kaldı). */
  ceiling: boolean;
}

/** Harf işaretlemede bundan az doğru işaret varsa görev yarıda kalmış ya da yönerge anlaşılmamış sayılır; sonuç yorumlanmaz. */
export const CANCELLATION_FEW_HITS = 10;

export function scoreCancellation(
  task: CancellationTask,
  sheet: string[][],
  input: CancellationSectionInput[],
): { sections: CancellationSectionScored[]; result: CancellationResult } {
  const n = task.rows * task.columns;
  const maxMs = task.sectionMs + 5_000;
  const seen = new Set<number>();
  const sections: CancellationSectionScored[] = [];
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= task.sections) throw new TaskInputError('Geçersiz bölüm.');
    const r = t.response;
    if (!r || !Array.isArray(r.marks) || !Array.isArray(r.times) || r.marks.length !== r.times.length || r.marks.length > n) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    if (r.marks.some((m) => !Number.isInteger(m) || m < 0 || m >= n) || new Set(r.marks).size !== r.marks.length) {
      throw new TaskInputError('Geçersiz işaret.');
    }
    if (r.times.some((v) => !Number.isFinite(v) || v < 0 || v > maxMs)) throw new TaskInputError('Geçersiz süre.');
    if (!Number.isInteger(r.unmarks) || r.unmarks < 0 || r.unmarks > 100_000) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0 || t.rtMs > maxMs)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);

    const letters = sheet[t.index];
    const marked = new Set(r.marks);
    const last = scannedEnd(r.marks, task.columns);
    let targets = 0;
    let hits = 0;
    let commissions = 0;
    for (let i = 0; i <= last; i++) {
      const isT = task.targets.includes(letters[i]);
      if (isT) {
        targets++;
        if (marked.has(i)) hits++;
      } else if (marked.has(i)) commissions++;
    }
    const ms = Math.min(task.sectionMs, Math.max(1_000, Math.round(t.rtMs ?? task.sectionMs)));
    const strays = r.marks.filter((m) => m > last).length;
    sections.push({ index: t.index, processed: last + 1, targets, hits, omissions: targets - hits, commissions, net: hits - commissions, ms, unmarks: r.unmarks, strays });
  }
  if (sections.length !== task.sections) throw new TaskInputError('Bölümlerin hepsi gönderilmedi.');
  sections.sort((a, b) => a.index - b.index);

  const sum = (f: (s: CancellationSectionScored) => number) => sections.reduce((a, s) => a + f(s), 0);
  const processed = sum((s) => s.processed);
  const hits = sum((s) => s.hits);
  const omissions = sum((s) => s.omissions);
  const commissions = sum((s) => s.commissions);
  const minutes = sum((s) => s.ms) / 60_000;
  const distractorsSeen = processed - sum((s) => s.targets);
  const rate = (s: CancellationSectionScored) => s.net / (s.ms / 60_000);
  const half = Math.floor(sections.length / 2);
  const first = sections.slice(0, half).map(rate);
  const second = sections.slice(half).map(rate);
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const base = first.length ? avg(first) : 0;
  // İki yarının dakikadaki net doğru hızı ve sayım oynaklığından standart hata.
  const halfOf = (xs: CancellationSectionScored[]) => {
    const mins = xs.reduce((a, s) => a + s.ms, 0) / 60_000;
    const marks = xs.reduce((a, s) => a + s.hits + s.commissions, 0);
    const netSum = xs.reduce((a, s) => a + s.net, 0);
    return { rate: mins > 0 ? netSum / mins : 0, varRate: mins > 0 ? marks / (mins * mins) : 0 };
  };
  const h1 = halfOf(sections.slice(0, half));
  const h2 = halfOf(sections.slice(half));
  const sustainClear = base > 0 && second.length > 0 && Math.abs(h2.rate - h1.rate) > 2 * Math.sqrt(h1.varRate + h2.varRate);
  return {
    sections,
    result: {
      sections,
      processed,
      hits,
      omissions,
      commissions,
      net: hits - commissions,
      perMinute: round(processed / minutes, 1),
      hitRate: hits + omissions ? round(hits / (hits + omissions), 3) : 0,
      falseAlarmRate: distractorsSeen > 0 ? round(commissions / distractorsSeen, 3) : 0,
      sustainChange: base > 0 && second.length ? round(((avg(second) - base) / base) * 100, 1) : null,
      sustainClear,
      strays: sum((s) => s.strays),
      // Son satıra ulaşıldıysa sayfa bu kişi için kısa kalmıştır: çalışma hızı olduğundan düşük görünür.
      ceiling: sections.some((s) => s.processed > n - task.columns),
    },
  };
}

/* ---------- Renk-kelime (Stroop düzeni) ---------- */

export interface ColorWordTrialInput {
  /** Asıl denemelerde 0…trials.length-1; renk denemesinde trials.length + k. */
  index: number;
  /** Basılan düğme: renklerin sırasıyla 1, 2, 3, 4. Süre içinde basılmadıysa null. */
  response: number | null;
  rtMs: number | null;
}

export interface ColorWordTrialScored extends ColorWordTrialInput {
  congruent: boolean;
  correct: boolean;
  anticipation: boolean;
  timeout: boolean;
}

export interface ColorWordResult {
  n: number;
  accuracy: number;
  accCongruent: number;
  accIncongruent: number;
  /** Doğru cevaplarda tipik (ortanca) cevap süresi (ms); yeterince doğru cevap yoksa null. */
  medianRt: number | null;
  medianRtCongruent: number | null;
  medianRtIncongruent: number | null;
  /** Uyumsuz ve uyumlu denemelerdeki tipik cevap süreleri arasındaki fark (ms): renk-kelime etkisi. */
  interferenceMs: number | null;
  anticipations: number;
  timeouts: number;
  /** Doğru cevap sayısı (bütün asıl denemelerde). */
  correct: number;
  /** Uyumsuz denemelerde doğru olmayan bütün cevaplar: kelime hatası, başka renk, süre aşımı ya da çok erken cevap. */
  incongruentErrors: number;
  /** Uyumlu denemelerde yanlış düğmeye basılan cevaplar (süre içinde verilen, erken olmayan cevaplarda). */
  congruentErrors: number;
  /** Uyumsuz denemelerde kelimenin söylediği renge basılan cevaplar: okuma alışkanlığının öne geçmesi. */
  wordErrors: number;
  /** Uyumsuz denemelerde ne yazının rengine ne de kelimeye basılan cevaplar: renkler karışmış ya da düğme kaçmış olabilir. */
  otherErrors: number;
  /** Renk denemesindeki deneme sayısı ve yanlış düğmeye basılan deneme sayısı. */
  checkTrials: number;
  checkErrors: number;
  /** Renk denemesindeki yanlışlar görev tanımındaki sınıra ulaştı: renkler bu ekranda ayırt edilmekte zorlanılmış olabilir. */
  checkFlag: boolean;
}

/** Dört seçenekli bu görevde 200 ms'den kısa cevaplar uyaranı görmeden verilmiş sayılır. */
export const COLOR_WORD_ANTICIPATION_MS = 200;
/** Tipik süre, en az bu kadar doğru cevaptan hesaplanır; daha azından hesaplanan ortanca yorumlanamaz. */
export const COLOR_WORD_MIN_CORRECT = 10;

const medianOrNull = (xs: number[], min = 1) => (xs.length >= Math.max(1, min) ? Math.round(median(xs)) : null);

/**
 * Renk-kelime görevinde doğru olmayan cevapların yarısından çoğu süre aşımı ya da çok erken cevap: yazının rengini bulmakta
 * zorlanmaktan çok görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir (rapordaki kart ve not aynı ölçütü kullanır).
 */
export const colorWordMostlyMissed = (r: ColorWordResult) => r.n - r.correct > 0 && r.timeouts + r.anticipations > (r.n - r.correct) / 2;

export function scoreColorWord(task: ColorWordTask, input: ColorWordTrialInput[]): { trials: ColorWordTrialScored[]; result: ColorWordResult } {
  const seen = new Set<number>();
  const trials: ColorWordTrialScored[] = [];
  const n = task.trials.length;
  let checkSeen = 0;
  let checkErrors = 0;
  let congruentErrors = 0;
  let wordErrors = 0;
  let otherErrors = 0;
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n + task.check.length) throw new TaskInputError('Geçersiz deneme.');
    if (t.response !== null && (!Number.isInteger(t.response) || t.response < 1 || t.response > task.colors.length)) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    // Süre dolduktan sonra gelen (tarayıcının zamanlayıcısı gecikmiş) cevap, süre aşımı sayılır.
    const timeout = t.response === null || t.rtMs === null || t.rtMs > task.timeoutMs;
    const anticipation = !timeout && (t.rtMs as number) < COLOR_WORD_ANTICIPATION_MS;
    const valid = !timeout && !anticipation;
    if (t.index >= n) {
      checkSeen++;
      if (valid && t.response !== task.check[t.index - n] + 1) checkErrors++;
      continue;
    }
    const stim = task.trials[t.index];
    const congruent = stim.word === stim.ink;
    const correct = valid && t.response === stim.ink + 1;
    if (valid && !correct) {
      if (congruent) congruentErrors++;
      else if (t.response === stim.word + 1) wordErrors++;
      else otherErrors++;
    }
    trials.push({ ...t, congruent, correct, anticipation, timeout });
  }
  if (trials.length !== n || checkSeen !== task.check.length) throw new TaskInputError('Denemelerin hepsi gönderilmedi.');
  trials.sort((a, b) => a.index - b.index);
  const acc = (xs: ColorWordTrialScored[]) => (xs.length ? round(xs.filter((t) => t.correct).length / xs.length, 3) : 0);
  const rt = (xs: ColorWordTrialScored[]) =>
    medianOrNull(
      xs.filter((t) => t.correct).map((t) => t.rtMs as number),
      COLOR_WORD_MIN_CORRECT,
    );
  const cong = trials.filter((t) => t.congruent);
  const inc = trials.filter((t) => !t.congruent);
  const rtC = rt(cong);
  const rtI = rt(inc);
  return {
    trials,
    result: {
      n: trials.length,
      accuracy: acc(trials),
      accCongruent: acc(cong),
      accIncongruent: acc(inc),
      medianRt: rt(trials),
      medianRtCongruent: rtC,
      medianRtIncongruent: rtI,
      interferenceMs: rtC !== null && rtI !== null ? rtI - rtC : null,
      anticipations: trials.filter((t) => t.anticipation).length,
      timeouts: trials.filter((t) => t.timeout).length,
      correct: trials.filter((t) => t.correct).length,
      incongruentErrors: inc.filter((t) => !t.correct).length,
      congruentErrors,
      wordErrors,
      otherErrors,
      checkTrials: task.check.length,
      checkErrors,
      checkFlag: checkErrors >= task.checkLimit,
    },
  };
}

/* ---------- Dur-git (go/no-go düzeni) ---------- */

export interface GoNoGoTrialInput {
  index: number;
  /** 1: cevap penceresinde düğmeye basıldı; null: basılmadı. */
  response: number | null;
  rtMs: number | null;
}

export interface GoNoGoResult {
  goTrials: number;
  stopTrials: number;
  /** Bas harfinde zamanında basış. */
  hits: number;
  /** Bas harfinde basılmayan. */
  omissions: number;
  /** Durma harfinde (X) basılan. */
  commissions: number;
  /** Harf görünür görünmez, ona bakmadan (150 ms'den önce) basılan bas denemeleri. */
  anticipations: number;
  /** Durma harflerinden basılmadan geçilenlerin oranı (0–1). */
  stopRate: number;
  /** Bas harflerinden zamanında basılanların oranı (0–1). */
  hitRate: number;
  /** Doğru basışlarda tipik (ortanca) tepki süresi (ms); yeterince doğru basış yoksa null. */
  medianRt: number | null;
}

/** Harf göründükten sonra bu süreden önceki basışlar harfe bakılmadan yapılmış sayılır. */
export const GO_ANTICIPATION_MS = 150;
/** Tipik tepki süresi en az bu kadar doğru basıştan hesaplanır. */
export const GO_MIN_HITS = 10;

export function scoreGoNoGo(task: GoNoGoTask, input: GoNoGoTrialInput[]): { result: GoNoGoResult } {
  const seen = new Set<number>();
  let hits = 0;
  let omissions = 0;
  let commissions = 0;
  let anticipations = 0;
  const rts: number[] = [];
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= task.trials.length) throw new TaskInputError('Geçersiz deneme.');
    if (t.response !== null && t.response !== 1) throw new TaskInputError('Geçersiz cevap.');
    if (t.response === 1 && (t.rtMs === null || !Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    const stim = task.trials[t.index];
    // Cevap penceresinden sonra gelen (tarayıcının zamanlayıcısı gecikmiş) basış sayılmaz.
    const pressed = t.response === 1 && (t.rtMs as number) <= task.responseMs + 200;
    if (!stim.go) {
      if (pressed) commissions++;
    } else if (!pressed) omissions++;
    else if ((t.rtMs as number) < GO_ANTICIPATION_MS) anticipations++;
    else {
      hits++;
      rts.push(t.rtMs as number);
    }
  }
  if (seen.size !== task.trials.length) throw new TaskInputError('Denemelerin hepsi gönderilmedi.');
  const goTrials = task.trials.filter((t) => t.go).length;
  const stopTrials = task.trials.length - goTrials;
  return {
    result: {
      goTrials,
      stopTrials,
      hits,
      omissions,
      commissions,
      anticipations,
      stopRate: stopTrials ? round((stopTrials - commissions) / stopTrials, 3) : 0,
      hitRate: goTrials ? round(hits / goTrials, 3) : 0,
      medianRt: medianOrNull(rts, GO_MIN_HITS),
    },
  };
}

/* ---------- Sırayla birleştirme (iz sürme düzeni) ---------- */

export interface TrailPartInput {
  /** Bölüm sırası: 0 birinci (sayılar), 1 ikinci (sayılar ve harfler). */
  index: number;
  response: {
    /** Dokunulan dairelerin sıradaki yeri (0: ilk daire), dokunuş sırasıyla; yanlış dokunuşlar dahil. */
    taps: number[];
    /** Her dokunuşun bölüm başından itibaren zamanı (ms), taps ile aynı sırada. */
    times: number[];
  };
  /** Bölümde geçen süre (ms). */
  rtMs: number | null;
}

export interface TrailPartScored {
  index: number;
  key: 'a' | 'b';
  /** Daire sayısı. */
  n: number;
  /** Doğru sırayla ulaşılan daire sayısı. */
  reached: number;
  completed: boolean;
  /** Sıradaki daire dışındaki (henüz birleştirilmemiş) bir daireye dokunuş. */
  errors: number;
  /** Tamamlandıysa son daireye dokunulan an; tamamlanmadıysa bölümün en uzun süresi (ms). */
  timeMs: number;
}

export interface TrailResult {
  parts: TrailPartScored[];
  /** İkinci bölümün süresinin birinci bölüme oranı; iki bölüm de tamamlandıysa. */
  ratio: number | null;
  /** İkinci bölümün süresi eksi birinci bölümün süresi (ms); iki bölüm de tamamlandıysa. */
  diffMs: number | null;
}

export function scoreTrail(task: TrailTask, input: TrailPartInput[]): { result: TrailResult } {
  const parts: TrailPartScored[] = [];
  const seen = new Set<number>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= task.parts.length) throw new TaskInputError('Geçersiz bölüm.');
    const part = task.parts[t.index];
    const n = part.labels.length;
    const r = t.response;
    if (!r || !Array.isArray(r.taps) || !Array.isArray(r.times) || r.taps.length !== r.times.length || r.taps.length > 400) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    if (r.taps.some((v) => !Number.isInteger(v) || v < 0 || v >= n)) throw new TaskInputError('Geçersiz dokunuş.');
    if (r.times.some((v) => !Number.isFinite(v) || v < 0)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    let next = 0;
    let errors = 0;
    let doneAt: number | null = null;
    let prev = 0;
    r.taps.forEach((tap, i) => {
      // Zamanlar geriye gidemez; tarayıcının zamanlayıcısındaki küçük kaymalar düzeltilir.
      const time = Math.max(prev, r.times[i]);
      prev = time;
      if (doneAt !== null) return;
      if (tap === next) {
        next++;
        // Bölümün en uzun süresinden sonra gelen dokunuş bölümü tamamlamış sayılmaz.
        if (next === n && time <= task.maxMs) doneAt = time;
      } else if (tap > next) errors++;
      // Daha önce birleştirilmiş bir daireye dokunmak yok sayılır.
    });
    parts.push({
      index: t.index,
      key: part.key,
      n,
      reached: next,
      completed: doneAt !== null,
      errors,
      timeMs: doneAt !== null ? Math.max(1, Math.round(doneAt)) : task.maxMs,
    });
  }
  if (parts.length !== task.parts.length) throw new TaskInputError('Bölümlerin hepsi gönderilmedi.');
  parts.sort((a, b) => a.index - b.index);
  const [a, b] = parts;
  const both = !!(a && b && a.completed && b.completed);
  return {
    result: {
      parts,
      ratio: both ? round(b.timeMs / a.timeMs, 2) : null,
      diffMs: both ? b.timeMs - a.timeMs : null,
    },
  };
}

/* ---------- Geriye dönük hatırlama (n-geri düzeni) ---------- */

export interface NBackTrialInput {
  /** Denemenin sırası: bölümler boyunca 0'dan başlayarak (birinci bölümün ilk harfi 0). */
  index: number;
  /** 1: cevap penceresinde düğmeye basıldı; null: basılmadı. */
  response: number | null;
  /** Basıldıysa harfin görünmesinden basışa kadar geçen süre (ms). */
  rtMs: number | null;
}

export interface NBackLevelResult {
  n: 1 | 2;
  /** Hedef harf sayısı: n önceki harfle aynı olan (basılması gereken) harfler. */
  targets: number;
  /** Hedef olmayan harf sayısı (tuzaklar dahil). */
  nonTargets: number;
  /** Tuzak harf sayısı: iki geride bir önceki harfle aynı olan (ama iki önceki harfle aynı olmayan) harfler. */
  lures: number;
  /** Hedefte zamanında basış. */
  hits: number;
  /** Hedefte basılmayan. */
  misses: number;
  /** Hedef olmayan harfte basılan (tuzaklar dahil). */
  falseAlarms: number;
  /** Tuzak harfte basılan. */
  lureFalseAlarms: number;
  /** Harf görünür görünmez (150 ms'den önce) yapılan basışlar: harfe verilmiş cevap sayılmaz. */
  anticipations: number;
  /** Hedeflerden yakalananların oranı (0–1). */
  hitRate: number;
  /** Hedef olmayan harflerden basılanların oranı (0–1). */
  falseAlarmRate: number;
  /**
   * Ayırt etme: yakalama oranı eksi yanlış basma oranı (−1 ile 1 arası). Hiç yanılmayan biri 1, rastgele basan ya da
   * hiç basmayan biri 0 civarında alır.
   */
  pr: number;
  /** Yakalanan hedeflerde tipik (ortanca) tepki süresi (ms); yeterince yakalama yoksa null. */
  medianRt: number | null;
}

/** Tek bir bölümün özeti: bölüm yarıda bırakıldı mı (hiç basılmadı mı) anlaşılsın diye. */
export interface NBackBlockResult {
  /** Bölümün sırası (0: birinci bölüm). */
  index: number;
  n: 1 | 2;
  targets: number;
  hits: number;
  falseAlarms: number;
}

export interface NBackResult {
  /** Düzeyler, n'e göre sıralı (önce bir geri, sonra iki geri); aynı n'deki bölümler birleştirilir. */
  levels: NBackLevelResult[];
  /** Bölüm bölüm özet, yapılma sırasıyla. */
  blocks: NBackBlockResult[];
}

/**
 * Harf göründükten sonra bu süreden önceki basışlar harfe bakılmadan yapılmış (çoğunlukla bir önceki harfe geç kalmış)
 * sayılır. Sitenin görev ekranı bu basışları zaten yok sayar ve göndermez; sunucudaki sayım, başka biçimde gelen
 * isteklerde de aynı kuralın uygulanması içindir.
 */
export const NBACK_ANTICIPATION_MS = 150;
/** Tipik tepki süresi en az bu kadar yakalamadan hesaplanır. */
export const NBACK_MIN_HITS = 5;
/** Aynı olmayan harflerin bundan çoğunda basıldıysa sonuç, aynı harfleri ayırt edebilmeyi göstermez. */
export const NBACK_RANDOM_FA = 0.5;

/** Düzeyde ya da bölümde hiç basılmadı mı? */
export const nBackSilent = (x: { hits: number; falseAlarms: number }) => x.hits + x.falseAlarms === 0;

/**
 * İki geride bir geri kuralına göre basılmaya devam edilmiş olabilir mi? Tuzakların (bir önceki harfle aynı olan
 * harfler) en az yarısında basılıp hedeflerin çoğu kaçırıldıysa.
 */
export const nBackKeptOneBack = (l: NBackLevelResult) => l.n === 2 && l.lures > 0 && l.lureFalseAlarms / l.lures >= 0.5 && l.hitRate < 0.3;

export function scoreNBack(task: NBackTask, input: NBackTrialInput[]): { result: NBackResult } {
  // Bütün bölümlerin harfleri tek bir sırada: her denemenin bölümü, rolü ve n'i.
  const cells = task.blocks.flatMap((b, block) => nBackRoles(b.letters, b.n).map((role) => ({ n: b.n, role, block })));
  const blocks: NBackBlockResult[] = task.blocks.map((b, index) => ({
    index,
    n: b.n,
    targets: nBackRoles(b.letters, b.n).filter((r) => r === 'target').length,
    hits: 0,
    falseAlarms: 0,
  }));
  const seen = new Set<number>();
  type Acc = { targets: number; nonTargets: number; lures: number; hits: number; falseAlarms: number; lureFalseAlarms: number; anticipations: number; rts: number[] };
  const acc = new Map<1 | 2, Acc>();
  for (const c of cells) {
    if (!acc.has(c.n)) acc.set(c.n, { targets: 0, nonTargets: 0, lures: 0, hits: 0, falseAlarms: 0, lureFalseAlarms: 0, anticipations: 0, rts: [] });
    const a = acc.get(c.n)!;
    if (c.role === 'target') a.targets++;
    else {
      a.nonTargets++;
      if (c.role === 'lure') a.lures++;
    }
  }
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= cells.length) throw new TaskInputError('Geçersiz deneme.');
    if (t.response !== null && t.response !== 1) throw new TaskInputError('Geçersiz cevap.');
    if (t.response === 1 && (t.rtMs === null || !Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    const c = cells[t.index];
    const a = acc.get(c.n)!;
    const rt = t.rtMs as number;
    // Cevap penceresinden sonra gelen (tarayıcının zamanlayıcısı gecikmiş) basış sayılmaz.
    if (t.response !== 1 || rt > task.trialMs + 100) continue;
    if (rt < NBACK_ANTICIPATION_MS) {
      a.anticipations++;
      continue;
    }
    if (c.role === 'target') {
      a.hits++;
      a.rts.push(rt);
      blocks[c.block].hits++;
    } else {
      a.falseAlarms++;
      blocks[c.block].falseAlarms++;
      if (c.role === 'lure') a.lureFalseAlarms++;
    }
  }
  if (seen.size !== cells.length) throw new TaskInputError('Denemelerin hepsi gönderilmedi.');
  const levels = [...acc.entries()]
    .sort(([x], [y]) => x - y)
    .map(([n, a]): NBackLevelResult => {
      const hitRate = a.targets ? a.hits / a.targets : 0;
      const falseAlarmRate = a.nonTargets ? a.falseAlarms / a.nonTargets : 0;
      return {
        n,
        targets: a.targets,
        nonTargets: a.nonTargets,
        lures: a.lures,
        hits: a.hits,
        misses: a.targets - a.hits,
        falseAlarms: a.falseAlarms,
        lureFalseAlarms: a.lureFalseAlarms,
        anticipations: a.anticipations,
        hitRate: round(hitRate, 3),
        falseAlarmRate: round(falseAlarmRate, 3),
        pr: round(hitRate - falseAlarmRate, 3),
        medianRt: medianOrNull(a.rts, NBACK_MIN_HITS),
      };
    });
  return { result: { levels, blocks } };
}

/* ---------- Zihinde döndürme ---------- */

export interface RotationTrialInput {
  index: number;
  /** 1: "Aynı", 2: "Ayna görüntüsü"; null: süre içinde cevap verilmedi. */
  response: number | null;
  rtMs: number | null;
}

export interface RotationAngleResult {
  /** Döndürme farkı (derece, 0–180). */
  angle: number;
  /** Bu farktaki deneme sayısı ("aynı" ve "ayna görüntüsü" birlikte). */
  n: number;
  correct: number;
  accuracy: number;
  /** Bu farkta doğru bulunan "aynı" şekillerde tipik (ortanca) karar süresi (ms); yeterince doğru cevap yoksa null. */
  medianRt: number | null;
}

export interface RotationResult {
  n: number;
  correct: number;
  accuracy: number;
  /** "Aynı" şekillerde ve ayna görüntülerinde doğru cevap oranı. */
  accSame: number;
  accMirror: number;
  timeouts: number;
  /** Şekiller görünür görünmez (300 ms'den önce) verilen cevaplar: doğru sayılmaz. */
  anticipations: number;
  /** Süre içinde verilen cevaplardan "Aynı" olanların oranı (0–1); hiç cevap yoksa null. */
  sameShare: number | null;
  /** Aynı şekillerde süre içinde ve erken olmadan "Ayna görüntüsü" denen denemeler; bunlardan 135–180 derecede olanlar. */
  sameSaidMirror: number;
  sameSaidMirrorLarge: number;
  /** Ayna görüntülerinde süre içinde ve erken olmadan "Aynı" denen denemeler. */
  mirrorSaidSame: number;
  byAngle: RotationAngleResult[];
  /** Doğru bulunan "aynı" şekillerde tipik karar süresi (ms), bütün açılarda. */
  medianRt: number | null;
  /** Az (0 ve 45 derece) ve çok (135 ve 180 derece) döndürülmüş, doğru bulunan "aynı" şekillerde tipik karar süresi (ms). */
  rtSmall: number | null;
  rtLarge: number | null;
  /** Çok ve az döndürülmüş şekillerdeki tipik karar süreleri arasındaki fark (ms): döndürme etkisi. */
  rotationCostMs: number | null;
}

/** İki şekli karşılaştırmak zaman alır: 300 ms'den kısa cevaplar şekillere bakmadan verilmiş sayılır. */
export const ROTATION_ANTICIPATION_MS = 300;
/** Bütün açılardaki tipik süre en az bu kadar doğru cevaptan hesaplanır. */
export const ROTATION_MIN_CORRECT = 10;
/** Bir açıdaki tipik süre en az bu kadar, az ve çok döndürülmüş gruplarınki en az bu kadar doğru cevaptan hesaplanır. */
export const ROTATION_MIN_PER_ANGLE = 3;
export const ROTATION_MIN_PER_GROUP = 6;

export function scoreRotation(task: MentalRotationTask, input: RotationTrialInput[]): { result: RotationResult } {
  const seen = new Set<number>();
  type Scored = { angle: number; mirror: boolean; correct: boolean; timeout: boolean; anticipation: boolean; response: number | null; rt: number | null };
  const trials: Scored[] = [];
  let sameSaidMirror = 0;
  let sameSaidMirrorLarge = 0;
  let mirrorSaidSame = 0;
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= task.trials.length) throw new TaskInputError('Geçersiz deneme.');
    if (t.response !== null && t.response !== 1 && t.response !== 2) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    const stim = task.trials[t.index];
    // Süre dolduktan sonra gelen (tarayıcının zamanlayıcısı gecikmiş) cevap, süre aşımı sayılır.
    const timeout = t.response === null || t.rtMs === null || t.rtMs > task.timeoutMs;
    const anticipation = !timeout && (t.rtMs as number) < ROTATION_ANTICIPATION_MS;
    const correct = !timeout && !anticipation && t.response === (stim.mirror ? 2 : 1);
    trials.push({ angle: disparity(stim.angle), mirror: stim.mirror, correct, timeout, anticipation, response: timeout ? null : t.response, rt: t.rtMs });
    if (!timeout && !anticipation && !correct) {
      if (stim.mirror) mirrorSaidSame++;
      else {
        sameSaidMirror++;
        if (disparity(stim.angle) >= 135) sameSaidMirrorLarge++;
      }
    }
  }
  if (trials.length !== task.trials.length) throw new TaskInputError('Denemelerin hepsi gönderilmedi.');
  const acc = (xs: Scored[]) => (xs.length ? round(xs.filter((t) => t.correct).length / xs.length, 3) : 0);
  const rtOf = (xs: Scored[], min: number) =>
    medianOrNull(
      xs.filter((t) => t.correct && !t.mirror).map((t) => t.rt as number),
      min,
    );
  const answered = trials.filter((t) => t.response !== null);
  const rtSmall = rtOf(
    trials.filter((t) => t.angle <= 45),
    ROTATION_MIN_PER_GROUP,
  );
  const rtLarge = rtOf(
    trials.filter((t) => t.angle >= 135),
    ROTATION_MIN_PER_GROUP,
  );
  return {
    result: {
      n: trials.length,
      correct: trials.filter((t) => t.correct).length,
      accuracy: acc(trials),
      accSame: acc(trials.filter((t) => !t.mirror)),
      accMirror: acc(trials.filter((t) => t.mirror)),
      timeouts: trials.filter((t) => t.timeout).length,
      anticipations: trials.filter((t) => t.anticipation).length,
      sameShare: answered.length ? round(answered.filter((t) => t.response === 1).length / answered.length, 3) : null,
      sameSaidMirror,
      sameSaidMirrorLarge,
      mirrorSaidSame,
      byAngle: DISPARITIES.map((angle) => {
        const here = trials.filter((t) => t.angle === angle);
        return { angle, n: here.length, correct: here.filter((t) => t.correct).length, accuracy: acc(here), medianRt: rtOf(here, ROTATION_MIN_PER_ANGLE) };
      }),
      medianRt: rtOf(trials, ROTATION_MIN_CORRECT),
      rtSmall,
      rtLarge,
      rotationCostMs: rtSmall !== null && rtLarge !== null ? rtLarge - rtSmall : null,
    },
  };
}

/* ---------- Tepki hızı ---------- */

export interface ReactionTrialInput {
  index: number;
  /** Basılan düğme: 1 (basit bölümde tek düğme, seçmeli bölümde sol), 2 (seçmeli bölümde sağ); null: süre içinde basılmadı. */
  response: number | null;
  /** Dairenin ekrana çizildiği andan basışa kadar geçen süre (ms); daire belirmeden basıldıysa 0. */
  rtMs: number | null;
  /** Cevabın nasıl verildiği: fareyle verilen cevaplarda seçmeli bölümün süresine imlecin yolu da eklenir. */
  input?: 'mouse' | 'touch' | 'pen' | 'key';
}

export interface ReactionPartResult {
  key: 'simple' | 'choice';
  n: number;
  /** Süre içinde ve çok erken olmadan verilen tepkiler (seçmeli bölümde doğru ya da öteki taraf). */
  answered: number;
  /** Bunlardan (seçmeli bölümde) dairenin olduğu taraftaki düğmeye basılanlar; basit bölümde hepsi. */
  correct: number;
  /** Seçmeli bölümde öteki taraftaki düğmeye basılan denemeler. */
  wrong: number;
  /** Daire belirmeden ya da belirdikten sonraki 100 ms içinde basılan denemeler: tepki sayılmaz. */
  early: number;
  /** Süre içinde basılmayan denemeler. */
  misses: number;
  /** Süre içinde ve çok erken olmadan verilen tepkilerden sol (ya da basit bölümdeki tek) düğmeye basılanlar. */
  left: number;
  /** Süre içinde ve çok erken olmadan verilen tepkilerden fareyle verilenler. */
  mouse: number;
  /** Doğru tepkilerde tipik (ortanca) süre (ms); yeterince doğru tepki yoksa null. */
  medianRt: number | null;
  /**
   * Doğru tepkiler sıralandığında, iki uçtan dörtte birer (aşağı yuvarlanmış) atıldıktan sonra kalanların en kısası ve
   * en uzunu (ms): doğru tepkilerin en az yarısı bu ikisinin arasındadır. Tepkilerin ne kadar tutarlı olduğunu gösterir.
   */
  midLow: number | null;
  midHigh: number | null;
}

export interface ReactionResult {
  simple: ReactionPartResult;
  choice: ReactionPartResult;
  /** Seçmeli ile basit bölümün tipik süreleri arasındaki fark (ms): seçimin etkisi. */
  choiceCostMs: number | null;
}

/**
 * Daireyi görüp tepki vermek zaman alır: 150 ms'den kısa tepkiler (daire belirmeden basışlar dahil) daireye bakmadan
 * verilmiş sayılır. Tarayıcıda ölçülen süreler gerçek süreden uzun çıktığı için bu sınır, bir çocuğun gerçek bir tepkisini
 * "çok erken" saymaz (öteki görevlerdeki sınırla aynı).
 */
export const REACTION_EARLY_MS = 150;
/** Bir bölümün tipik süresi ve tutarlılığı en az bu kadar doğru tepkiden hesaplanır. */
export const REACTION_MIN_VALID = 10;
/** Seçmeli bölümde cevapların en az bu kadarı fareyle verildiyse süreye imlecin yolu da karışmıştır. */
export const REACTION_MOUSE_SHARE = 0.25;

export function scoreReaction(task: ReactionTimeTask, input: ReactionTrialInput[]): { result: ReactionResult } {
  const cells = task.parts.flatMap((p) => p.trials.map((t) => ({ part: p.key, boxes: p.boxes, box: t.box })));
  const tally = new Map(
    task.parts.map((p) => [p.key, { n: p.trials.length, answered: 0, correct: 0, wrong: 0, early: 0, misses: 0, left: 0, mouse: 0, rts: [] as number[] }]),
  );
  const seen = new Set<number>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= cells.length) throw new TaskInputError('Geçersiz deneme.');
    const cell = cells[t.index];
    if (t.response !== null && (!Number.isInteger(t.response) || t.response < 1 || t.response > cell.boxes)) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (seen.has(t.index)) continue;
    seen.add(t.index);
    const part = tally.get(cell.part)!;
    // Süre dolduktan sonra gelen (tarayıcının zamanlayıcısı gecikmiş) basış, süre aşımı sayılır.
    if (t.response === null || t.rtMs === null || t.rtMs > task.timeoutMs) part.misses++;
    else if (t.rtMs < REACTION_EARLY_MS) part.early++;
    else {
      part.answered++;
      if (t.response === 1) part.left++;
      if (t.input === 'mouse') part.mouse++;
      if (t.response === cell.box + 1) {
        part.correct++;
        part.rts.push(t.rtMs);
      } else part.wrong++;
    }
  }
  if (seen.size !== cells.length) throw new TaskInputError('Denemelerin hepsi gönderilmedi.');
  const result = (key: 'simple' | 'choice'): ReactionPartResult => {
    const p = tally.get(key);
    if (!p) throw new TaskInputError('Görevde basit ve seçmeli bölümler bulunmalı.');
    const s = [...p.rts].sort((a, b) => a - b);
    const enough = s.length >= REACTION_MIN_VALID;
    const k = Math.floor(s.length / 4);
    return {
      key,
      n: p.n,
      answered: p.answered,
      correct: p.correct,
      wrong: p.wrong,
      early: p.early,
      misses: p.misses,
      left: p.left,
      mouse: p.mouse,
      medianRt: medianOrNull(s, REACTION_MIN_VALID),
      midLow: enough ? Math.round(s[k]) : null,
      midHigh: enough ? Math.round(s[s.length - 1 - k]) : null,
    };
  };
  const simple = result('simple');
  const choice = result('choice');
  return {
    result: {
      simple,
      choice,
      choiceCostMs: simple.medianRt !== null && choice.medianRt !== null ? choice.medianRt - simple.medianRt : null,
    },
  };
}

/* ---------- Şekil akıl yürütme ---------- */

export interface MatrixTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–8). */
  response: number;
  /** Sorunun ekrana çizildiği andan cevabın verildiği ana kadar geçen süre (ms); tarayıcı 2 dakikada keser. */
  rtMs: number | null;
}

export interface MatrixLevelResult {
  level: number;
  n: number;
  correct: number;
}

export interface MatrixRuleResult {
  rule: MatrixRule;
  n: number;
  correct: number;
}

export interface MatrixResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Kural türlerine göre (sorudaki en zor kural); soruları olmayan türler listede yoktur. */
  rules: MatrixRuleResult[];
  /**
   * Ulaşılan düzey: soruların en az %60'ının doğru olduğu en yüksek düzey; o düzeye kadarki bütün sorularda da en az %60
   * doğru olmalıdır (üst düzeylerdeki şans eseri doğrular düzeyi yükseltmesin, alt düzeylerdeki bir iki dikkatsizlik de
   * düşürmesin). Hiçbir düzey bu ölçüte uymuyorsa 0.
   */
  reached: number;
  /** Bütün sorularda tipik (ortanca) cevap süresi (ms). */
  medianRt: number | null;
  /** 1–2. düzey ve 4–5. düzey sorularda tipik cevap süresi (ms). */
  rtEasy: number | null;
  rtHard: number | null;
  /**
   * 3. düzey ve üstündeki sorularda `rapidMs`'den kısa sürede verilen yanlış cevaplar ve bu soruların sayısı (hızlı ama
   * doğru bulunan cevap tahmin sayılmaz).
   */
  rapid: number;
  rapidOf: number;
  /** Yanlış cevaplar ve bunlardan doğru cevaptan tek özellikte ayrılan seçeneklerin seçildikleri ("yakın" hatalar). */
  wrong: number;
  nearMisses: number;
  /** En sık seçilen seçenek sırasının seçilme sayısı (hep aynı yere basılıp basılmadığı). */
  samePosition: number;
}

/** Ulaşılan düzey için o düzeydeki ve o düzeye kadarki soruların en az bu kadarı doğru olmalı. */
export const MATRIX_LEVEL_PASS = 0.6;
/**
 * Bu kadar ya da daha az doğru, sekiz seçenekli 24 soruda rastgele seçimle de ulaşılabilir: rastgele seçen birinin 7 ya
 * da daha çok doğru bulma olasılığı %5'in altındadır (binom dağılımı, p = 1/8).
 */
export const MATRIX_CHANCE_MAX = 6;
/** Rastgele seçimde yanlış cevapların yaklaşık 3/7'si yakın hatadır; yakın hataların payı bunun belirgin üstündeyse yorumlanır. */
export const MATRIX_NEAR_SHARE = 0.7;
export const MATRIX_NEAR_MIN = 4;

export function scoreMatrix(task: MatrixReasoningTask, input: MatrixTrialInput[]): { result: MatrixResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.optionDistance.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, MatrixTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > 8) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    return { item, correct: t.response === task.answers[i], distance: task.optionDistance[i][t.response - 1], response: t.response, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const RULES: MatrixRule[] = ['constant', 'progression', 'distribution', 'addition', 'xor'];
  const rules = RULES.flatMap((rule) => {
    const here = scored.filter((s) => s.item.rule === rule);
    return here.length ? [{ rule, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardOnes = scored.filter((s) => s.item.level >= 3);
  const wrong = scored.filter((s) => !s.correct);
  const positions = new Map<number, number>();
  for (const s of scored) positions.set(s.response, (positions.get(s.response) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      rules,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 4))),
      rapid: hardOnes.filter((s) => !s.correct && s.rt !== null && s.rt < task.rapidMs).length,
      rapidOf: hardOnes.length,
      wrong: wrong.length,
      nearMisses: wrong.filter((s) => s.distance === 1).length,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/* ---------- Sayı dizileri ---------- */

export interface NumberSeriesTrialInput {
  index: number;
  /** Yazılan sayı; "Bilmiyorum" denirse `null`. */
  response: { answer: number } | null;
  /** Dizinin ekrana çizildiği andan cevabın verildiği ana kadar geçen süre (ms); tarayıcı 2 dakikada keser. */
  rtMs: number | null;
}

export interface NumberSeriesRuleResult {
  rule: NumberSeriesRule;
  n: number;
  correct: number;
}

export interface NumberSeriesResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Kural türlerine göre; soruları olmayan türler listede yoktur. */
  rules: NumberSeriesRuleResult[];
  /** Ulaşılan düzey: şekil akıl yürütmedeki ölçütle aynı (o düzeyde ve o düzeye kadarki sorularda en az %60 doğru). */
  reached: number;
  medianRt: number | null;
  /** 1–2. düzey ve 4–5. düzey sorularda tipik cevap süresi (ms). */
  rtEasy: number | null;
  rtHard: number | null;
  /**
   * 3. düzey ve üstündeki sorularda `rapidMs`'den kısa sürede yazılan yanlış cevaplar ve bu düzeylerde cevap yazılan soru
   * sayısı. Doğru cevaplar sayılmaz: cevap yazıldığı için hızlı ama doğru bir cevap tahminle bulunmuş olamaz.
   */
  rapid: number;
  rapidOf: number;
  /** "Bilmiyorum" denen sorular. */
  skipped: number;
  /** Yazılan ama yanlış olan cevaplar. */
  wrong: number;
  /** Yanlışlardan, dizinin bir bölümüne uyan daha basit bir kuralla bulunanlar (sorunun tuzak cevapları). */
  traps: number;
  /**
   * Yanlışlardan, tuzak olmayan ve doğru cevaba çok yakın olanlar (hesaplamada küçük bir kayma olabilir). Dizide zaten
   * görünen bir sayıyı yazmak (ör. son sayıyı tekrarlamak) yakın cevap sayılmaz.
   */
  nearMisses: number;
  /** En sık yazılan sayının kaç soruda yazıldığı (hep aynı sayının yazılıp yazılmadığı). */
  sameAnswer: number;
}

/** "Yakın" cevap: doğru cevaptan en çok bu kadar uzak (en az 2, büyük sayılarda doğru cevabın %5'i). */
export const nearMissTolerance = (answer: number) => Math.max(2, Math.round(answer * 0.05));
/** Yanlışların yorumlanması için en az bu kadar ve yanlışların en az yarısı aynı türden olmalı. */
export const NUMBER_PATTERN_MIN = 3;

export function scoreNumberSeries(task: NumberSeriesTask, input: NumberSeriesTrialInput[]): { result: NumberSeriesResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.traps.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, NumberSeriesTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (t.response !== null) {
      const a = t.response?.answer;
      if (typeof a !== 'number' || !Number.isInteger(a) || a < 0 || a >= 10 ** task.maxDigits) throw new TaskInputError('Geçersiz cevap.');
    }
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const value = t.response === null ? null : t.response.answer;
    const answer = task.answers[i];
    const correct = value === answer;
    const trap = value !== null && !correct && task.traps[i].includes(value);
    const near = value !== null && !correct && !trap && !item.terms.includes(value) && Math.abs(value - answer) <= nearMissTolerance(answer);
    return { item, value, correct, trap, near, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const RULES: NumberSeriesRule[] = ['step', 'ratio', 'growing', 'alternating', 'combined'];
  const rules = RULES.flatMap((rule) => {
    const here = scored.filter((s) => s.item.rule === rule);
    return here.length ? [{ rule, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardAnswered = scored.filter((s) => s.item.level >= 3 && s.value !== null);
  const values = new Map<number, number>();
  for (const s of scored) if (s.value !== null) values.set(s.value, (values.get(s.value) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      rules,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 4))),
      rapid: hardAnswered.filter((s) => !s.correct && s.rt !== null && s.rt < task.rapidMs).length,
      rapidOf: hardAnswered.length,
      skipped: scored.filter((s) => s.value === null).length,
      wrong: scored.filter((s) => s.value !== null && !s.correct).length,
      traps: scored.filter((s) => s.trap).length,
      nearMisses: scored.filter((s) => s.near).length,
      sameAnswer: Math.max(0, ...values.values()),
    },
  };
}

/* ---------- Harf dizileri ---------- */

export interface LetterSeriesTrialInput {
  index: number;
  /** Seçilen harf (Türk alfabesinin büyük harflerinden biri); "Bilmiyorum" denirse `null`. */
  response: { answer: string } | null;
  /** Dizinin ekrana çizildiği andan cevabın verildiği ana kadar geçen süre (ms); tarayıcı 2 dakikada keser. */
  rtMs: number | null;
}

export interface LetterSeriesRuleResult {
  rule: LetterSeriesRule;
  n: number;
  correct: number;
}

/** Harf dizilerinin sonucu: sayı dizileriyle aynı yapı (düzeyler, ulaşılan düzey, süreler, yanlışların türü). */
export interface LetterSeriesResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Kural türlerine göre; soruları olmayan türler listede yoktur. */
  rules: LetterSeriesRuleResult[];
  /** Ulaşılan düzey: şekil akıl yürütmedeki ölçütle aynı (o düzeyde ve o düzeye kadarki sorularda en az %60 doğru). */
  reached: number;
  medianRt: number | null;
  /** 1–2. düzey ve 4–5. düzey sorularda tipik cevap süresi (ms). */
  rtEasy: number | null;
  rtHard: number | null;
  /**
   * 3. düzey ve üstündeki sorularda `rapidMs`'den kısa sürede verilen yanlış cevaplar ve bu düzeylerde cevap verilen soru
   * sayısı. Doğru cevaplar sayılmaz.
   */
  rapid: number;
  rapidOf: number;
  /** "Bilmiyorum" denen sorular. */
  skipped: number;
  /** Verilen ama yanlış olan cevaplar. */
  wrong: number;
  /** Yanlışlardan, dizinin bir bölümüne uyan daha basit bir kuralla bulunanlar (sorunun tuzak cevapları). */
  traps: number;
  /**
   * Yanlışlardan, tuzak olmayan ve alfabede doğru cevabın hemen önündeki ya da arkasındaki harf olanlar (harfleri sayarken
   * bir kayma olabilir). Dizide zaten görünen bir harfi yazmak yakın cevap sayılmaz.
   */
  nearMisses: number;
  /** En sık verilen harfin kaç soruda verildiği (hep aynı harfin seçilip seçilmediği). */
  sameAnswer: number;
}

/** Yanlışların yorumlanması için en az bu kadar ve yanlışların en az yarısı aynı türden olmalı. */
export const LETTER_PATTERN_MIN = 3;

export function scoreLetterSeries(task: LetterSeriesTask, input: LetterSeriesTrialInput[]): { result: LetterSeriesResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.traps.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const alphabet: readonly string[] = TURKISH_ALPHABET;
  const byIndex = new Map<number, LetterSeriesTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (t.response !== null) {
      const a = t.response?.answer;
      if (typeof a !== 'string' || !alphabet.includes(a)) throw new TaskInputError('Geçersiz cevap.');
    }
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const value = t.response === null ? null : t.response.answer;
    const answer = task.answers[i];
    const correct = value === answer;
    const trap = value !== null && !correct && task.traps[i].includes(value);
    const near = value !== null && !correct && !trap && !item.terms.includes(value) && Math.abs(alphabet.indexOf(value) - alphabet.indexOf(answer)) === 1;
    return { item, value, correct, trap, near, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const RULES: LetterSeriesRule[] = ['next', 'repeat', 'interleaved', 'group', 'growing'];
  const rules = RULES.flatMap((rule) => {
    const here = scored.filter((s) => s.item.rule === rule);
    return here.length ? [{ rule, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardAnswered = scored.filter((s) => s.item.level >= 3 && s.value !== null);
  const values = new Map<string, number>();
  for (const s of scored) if (s.value !== null) values.set(s.value, (values.get(s.value) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      rules,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 4))),
      rapid: hardAnswered.filter((s) => !s.correct && s.rt !== null && s.rt < task.rapidMs).length,
      rapidOf: hardAnswered.length,
      skipped: scored.filter((s) => s.value === null).length,
      wrong: scored.filter((s) => s.value !== null && !s.correct).length,
      traps: scored.filter((s) => s.trap).length,
      nearMisses: scored.filter((s) => s.near).length,
      sameAnswer: Math.max(0, ...values.values()),
    },
  };
}

/* ---------- Sözel akıl yürütme ---------- */

export interface VerbalTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–5). */
  response: number;
  /** Sorunun ekrana çizildiği andan cevabın verildiği ana kadar geçen süre (ms); tarayıcı 2 dakikada keser. */
  rtMs: number | null;
}

export interface VerbalTypeResult {
  type: VerbalItemType;
  n: number;
  correct: number;
}

export interface VerbalResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Soru türlerine göre (kelime ilişkileri, sınıflama, sıralama, mantıksal çıkarım). */
  types: VerbalTypeResult[];
  /** Ulaşılan düzey: şekil akıl yürütmedeki ölçütle aynı (o düzeyde ve o düzeye kadarki sorularda en az %60 doğru). */
  reached: number;
  medianRt: number | null;
  /** 1–2. düzey ve 4–5. düzey sorularda tipik cevap süresi (ms). */
  rtEasy: number | null;
  rtHard: number | null;
  /**
   * 3. düzey ve üstündeki sorulardan, soru ve seçenekler okunamayacak kadar kısa sürede (`verbalRapidMs`) yanlış
   * cevaplananlar ve bu soruların sayısı. Doğru cevaplar sayılmaz: kısa kelime sorularını hızla doğru cevaplayan biri
   * uyarı almaz.
   */
  rapid: number;
  rapidOf: number;
  wrong: number;
  /** Yanlışlardan, sorunun "ilk bakışta doğru görünen" seçeneğinin seçildikleri; türlere göre de sayılır. */
  lures: number;
  luresByType: Record<VerbalItemType, number>;
  /** En sık seçilen seçenek sırasının seçilme sayısı (hep aynı yere basılıp basılmadığı). */
  samePosition: number;
}

export const VERBAL_TYPES_ORDER: VerbalItemType[] = ['analogy', 'classification', 'ordering', 'deduction'];
/** Seçenek sayısı. */
export const VERBAL_OPTIONS = 5;
/**
 * Bu kadar ya da daha az doğru, beş seçenekli 24 soruda rastgele seçimle de ulaşılabilir: rastgele seçen birinin 9 ya
 * da daha çok doğru bulma olasılığı %5'in altındadır (binom dağılımı, p = 1/5; %3,6).
 */
export const VERBAL_CHANCE_MAX = 8;
/**
 * Rastgele seçimde yanlış cevapların dörtte biri çeldiricidir (dört yanlış seçenekten biri); yanlışların en az %60'ı
 * ve en az 4 yanlış çeldiriciyse bu yorumlanır (rastgele seçimde 5 yanlıştan en az 4'ünün çeldirici olma olasılığı %2'nin altındadır).
 */
export const VERBAL_LURE_SHARE = 0.6;
export const VERBAL_LURE_MIN = 4;

export function scoreVerbal(task: VerbalReasoningTask, input: VerbalTrialInput[]): { result: VerbalResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.lures.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, VerbalTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.items[t.index].options.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const correct = t.response === task.answers[i];
    return { item, correct, lure: !correct && t.response === task.lures[i], response: t.response, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const types = VERBAL_TYPES_ORDER.flatMap((type) => {
    const here = scored.filter((s) => s.item.type === type);
    return here.length ? [{ type, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardOnes = scored.filter((s) => s.item.level >= 3);
  const positions = new Map<number, number>();
  for (const s of scored) positions.set(s.response, (positions.get(s.response) ?? 0) + 1);
  const luresByType = Object.fromEntries(VERBAL_TYPES_ORDER.map((type) => [type, scored.filter((s) => s.lure && s.item.type === type).length])) as Record<
    VerbalItemType,
    number
  >;
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      types,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 4))),
      rapid: hardOnes.filter((s) => !s.correct && s.rt !== null && s.rt < verbalRapidMs(s.item)).length,
      rapidOf: hardOnes.length,
      wrong: n - correct,
      lures: scored.filter((s) => s.lure).length,
      luresByType,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/* ---------- Kâğıt katlama ---------- */

export interface FoldingTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–5). */
  response: number;
  rtMs: number | null;
}

export interface FoldingTypeResult {
  type: FoldingType;
  n: number;
  correct: number;
}

export interface FoldingResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Katlama türlerine göre (ortadan, kenardan, çapraz). */
  types: FoldingTypeResult[];
  reached: number;
  medianRt: number | null;
  rtEasy: number | null;
  rtHard: number | null;
  /** 3. düzey ve üstündeki sorulardan `FOLDING_RAPID_MS`'den kısa sürede yanlış cevaplananlar ve bu soruların sayısı. */
  rapid: number;
  rapidOf: number;
  wrong: number;
  /** Yanlışlardan, sorunun "ilk bakışta doğru görünen" seçeneğinin seçildikleri; yanılgı türüne göre de sayılır. */
  lures: number;
  luresByKind: Record<FoldingLure, number>;
  samePosition: number;
}

export const FOLDING_LURES_ORDER: FoldingLure[] = ['skip', 'slide', 'half', 'single', 'axis'];
export const FOLDING_TYPES_ORDER: FoldingType[] = ['half', 'partial', 'diagonal'];
/** Katlamaları izleyip beş seçeneğe bakmak için bundan kısa bir süre yetmez (3. düzey ve üstünde en az iki katlama vardır). */
export const FOLDING_RAPID_MS = 2500;
/** Beş seçenekli 24 soruda rastgele seçimle ulaşılabilecek doğru sayısı (sözel akıl yürütmedeki gibi; %5 sınırı). */
export const FOLDING_CHANCE_MAX = 8;

export function scoreFolding(task: PaperFoldingTask, input: FoldingTrialInput[]): { result: FoldingResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.lures.length !== n || task.lureKinds.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, FoldingTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.items[t.index].options.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const correct = t.response === task.answers[i];
    return { item, correct, lure: !correct && t.response === task.lures[i], kind: task.lureKinds[i], response: t.response, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const luresByKind = Object.fromEntries(FOLDING_LURES_ORDER.map((k) => [k, scored.filter((s) => s.lure && s.kind === k).length])) as Record<FoldingLure, number>;
  const types = FOLDING_TYPES_ORDER.flatMap((type) => {
    const here = scored.filter((s) => s.item.type === type);
    return here.length ? [{ type, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardOnes = scored.filter((s) => s.item.level >= 3);
  const positions = new Map<number, number>();
  for (const s of scored) positions.set(s.response, (positions.get(s.response) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      types,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 4))),
      rapid: hardOnes.filter((s) => !s.correct && s.rt !== null && s.rt < FOLDING_RAPID_MS).length,
      rapidOf: hardOnes.length,
      wrong: n - correct,
      lures: scored.filter((s) => s.lure).length,
      luresByKind,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/* ---------- Kelime bilgisi ---------- */

export interface VocabularyTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–5). */
  response: number;
  rtMs: number | null;
}

export interface VocabularyTypeResult {
  type: VocabularyType;
  n: number;
  correct: number;
}

export interface VocabularyResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Soru türlerine göre (eş anlam, zıt anlam, cümlede anlam, deyimler). */
  types: VocabularyTypeResult[];
  reached: number;
  medianRt: number | null;
  rtEasy: number | null;
  rtHard: number | null;
  /** 3. düzey ve üstündeki sorulardan okunamayacak kadar kısa sürede (`vocabularyRapidMs`) yanlış cevaplananlar ve bu soruların sayısı. */
  rapid: number;
  rapidOf: number;
  wrong: number;
  /** Yanlışlardan, sorunun "ilk bakışta doğru görünen" seçeneğinin seçildikleri; yanılgı türüne göre de sayılır. */
  lures: number;
  luresByKind: Record<VocabularyLure, number>;
  samePosition: number;
}

export const VOCABULARY_LURES_ORDER: VocabularyLure[] = ['swap', 'related', 'sound', 'meaning', 'literal'];
export const VOCABULARY_TYPES_ORDER: VocabularyType[] = ['synonym', 'antonym', 'context', 'idiom'];
/** Beş seçenekli 24 soruda rastgele seçimle ulaşılabilecek doğru sayısı (sözel akıl yürütmedeki gibi; %5 sınırı). */
export const VOCABULARY_CHANCE_MAX = 8;

export function scoreVocabulary(task: VocabularyTask, input: VocabularyTrialInput[]): { result: VocabularyResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.lures.length !== n || task.lureKinds.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, VocabularyTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.items[t.index].options.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const correct = t.response === task.answers[i];
    return { item, correct, lure: !correct && t.response === task.lures[i], kind: task.lureKinds[i], response: t.response, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const luresByKind = Object.fromEntries(VOCABULARY_LURES_ORDER.map((k) => [k, scored.filter((s) => s.lure && s.kind === k).length])) as Record<VocabularyLure, number>;
  const types = VOCABULARY_TYPES_ORDER.flatMap((type) => {
    const here = scored.filter((s) => s.item.type === type);
    return here.length ? [{ type, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardOnes = scored.filter((s) => s.item.level >= 3);
  const positions = new Map<number, number>();
  for (const s of scored) positions.set(s.response, (positions.get(s.response) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      types,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 4))),
      rapid: hardOnes.filter((s) => !s.correct && s.rt !== null && s.rt < vocabularyRapidMs(s.item)).length,
      rapidOf: hardOnes.length,
      wrong: n - correct,
      lures: scored.filter((s) => s.lure).length,
      luresByKind,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/* ---------- Kural değiştirme ---------- */

export interface RuleSwitchTrialInput {
  index: number;
  /** Basılan düğme: 1 sol, 2 sağ; null: süre içinde basılmadı. */
  response: number | null;
  /** Şeklin ekrana çizildiği andan basışa kadar geçen süre (ms). */
  rtMs: number | null;
}

export interface RuleSwitchCondition {
  /** Bu türdeki deneme sayısı. */
  n: number;
  correct: number;
  accuracy: number;
  /** Tipik (ortanca) cevap süresi: geçerli doğru cevaplardan; yeterli cevap yoksa null. */
  medianRt: number | null;
  /** Ortancaya katılan cevap sayısı. */
  nRt: number;
}

export interface RuleSwitchResult {
  n: number;
  correct: number;
  accuracy: number;
  /** Tek kurallı bölümler (her bölümün ilk denemesi süreye katılmaz). */
  pure: RuleSwitchCondition;
  /** Karışık bölümlerde kuralın sürdüğü ve değiştiği denemeler (bölümün ilk denemesi sayılmaz). */
  repeat: RuleSwitchCondition;
  switch: RuleSwitchCondition;
  /** Kural değiştirmenin bedeli: kuralın değiştiği ve sürdüğü denemelerin tipik süreleri arasındaki fark (ms). */
  switchCost: number | null;
  /** İki kuralı birlikte akılda tutmanın bedeli: karışık bölümde kuralın sürdüğü denemeler ile tek kurallı bölümlerin farkı (ms). */
  mixingCost: number | null;
  /** Bütün geçerli doğru cevapların tipik süresi (ms). */
  medianRt: number | null;
  answered: number;
  timeouts: number;
  /** `RULE_TOO_FAST_MS`'den kısa cevaplar (şekle bakmadan basılmış olabilir); doğru sayılmaz. */
  tooFast: number;
  /** Karışık bölümde iki kuralın farklı düğmeyi istediği şekillerde öteki kurala göre basılan düğme sayısı ve bu şekillerdeki cevap sayısı. */
  ruleErrors: number;
  ruleErrorsOf: number;
  /** Karışık bölümde iki kuralın aynı düğmeyi istediği şekillerdeki yanlışlar ve bu şekillerdeki cevap sayısı. */
  otherErrors: number;
  otherErrorsOf: number;
  /** En çok basılan düğmenin basılma sayısı. */
  sameSide: number;
}

/** Bundan kısa cevaplar şekle bakmadan basılmış sayılır. */
export const RULE_TOO_FAST_MS = 200;
/** Bir koşulun tipik süresi için en az bu kadar geçerli doğru cevap gerekir. */
export const RULE_MIN_RTS = 5;
/** İki düğmeli görevde doğruluk bunun altında ya da eşitse rastgele basmaktan ayırt edilemez (98 denemede en çok 58 doğru; rastgele basan birinin 59 ya da daha çok doğru yapma olasılığı %3'ün altındadır). */
export const RULE_CHANCE_ACC = 0.6;

const ruleCond = (xs: { correct: boolean; rt: number | null }[]): RuleSwitchCondition => {
  const correct = xs.filter((x) => x.correct).length;
  const rts = xs.flatMap((x) => (x.correct && x.rt !== null ? [x.rt] : []));
  return { n: xs.length, correct, accuracy: xs.length ? round(correct / xs.length, 3) : 0, medianRt: rts.length >= RULE_MIN_RTS ? medianOrNull(rts) : null, nRt: rts.length };
};

export function scoreRuleSwitch(task: RuleSwitchTask, input: RuleSwitchTrialInput[]): { result: RuleSwitchResult } {
  const n = task.trials.length;
  const byIndex = new Map<number, RuleSwitchTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz deneme.');
    if (t.response !== null && (!Number.isInteger(t.response) || t.response < 1 || t.response > 2)) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Denemelerin hepsi gelmedi.');
  const kinds = ruleSwitchKinds(task.trials);
  const scored = task.trials.map((trial, i) => {
    const t = byIndex.get(i)!;
    const answered = t.response !== null;
    const fast = answered && t.rtMs !== null && t.rtMs < RULE_TOO_FAST_MS;
    const correct = answered && !fast && t.response === ruleAnswer(trial) + 1;
    return { trial, kind: kinds[i], answered, fast, correct, response: t.response, rt: answered && !fast ? t.rtMs : null };
  });
  const correct = scored.filter((s) => s.correct).length;
  // Süre için: tek kurallı bölümün ilk denemesi ve bir hatadan (ya da cevapsız, çok erken denemeden) hemen sonraki deneme katılmaz.
  const timed = scored.map((s, i) => {
    const prev = scored[i - 1];
    const afterError = !!prev && prev.trial.block === s.trial.block && !prev.correct;
    const firstOfBlock = !prev || prev.trial.block !== s.trial.block;
    return { correct: s.correct, rt: afterError || firstOfBlock ? null : s.rt };
  });
  const cond = (kind: string) => ruleCond(scored.flatMap((s, i) => (s.kind === kind ? [{ correct: s.correct, rt: timed[i].rt }] : [])));
  const pure = cond('pure');
  const repeat = cond('repeat');
  const sw = cond('switch');
  const mixed = scored.filter((s) => s.kind === 'repeat' || s.kind === 'switch' || s.kind === 'first');
  const inc = mixed.filter((s) => !ruleCongruent(s.trial) && s.answered && !s.fast);
  const con = mixed.filter((s) => ruleCongruent(s.trial) && s.answered && !s.fast);
  const sides = [1, 2].map((r) => scored.filter((s) => s.response === r).length);
  const allRts = scored.flatMap((s, i) => (s.correct && timed[i].rt !== null ? [timed[i].rt as number] : []));
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      pure,
      repeat,
      switch: sw,
      switchCost: sw.medianRt !== null && repeat.medianRt !== null ? Math.round(sw.medianRt - repeat.medianRt) : null,
      mixingCost: repeat.medianRt !== null && pure.medianRt !== null ? Math.round(repeat.medianRt - pure.medianRt) : null,
      medianRt: allRts.length >= RULE_MIN_RTS ? medianOrNull(allRts) : null,
      answered: scored.filter((s) => s.answered).length,
      timeouts: scored.filter((s) => !s.answered).length,
      tooFast: scored.filter((s) => s.fast).length,
      ruleErrors: inc.filter((s) => !s.correct).length,
      ruleErrorsOf: inc.length,
      otherErrors: con.filter((s) => !s.correct).length,
      otherErrorsOf: con.length,
      sameSide: Math.max(...sides),
    },
  };
}

/* ---------- Kelime listesi hatırlama ---------- */

export interface WordListTrialInput {
  /** 0–4 hatırlama denemeleri (ilk listenin üç denemesi, ikinci liste, ilk liste yeniden); 5 ve sonrası tanıma bölümü. */
  index: number;
  /** Hatırlamada yazılan kelimeler (ve liste gösterilirken sayfa gizlendiği için listenin baştan gösterilme sayısı); tanımada 1 evet, 2 hayır. */
  response: { words: string[]; restarts?: number } | number | null;
  /** Hatırlamada yazmaya ayrılan süre; tanımada kelimenin göründüğü andan cevaba kadar geçen süre (ms). */
  rtMs: number | null;
}

export interface WordListRecall {
  /** Hangi liste hatırlandı: A ilk liste, B ikinci (araya giren) liste. */
  list: 'A' | 'B';
  /** Doğru hatırlanan kelimelerin listedeki yerleri (küçükten büyüğe). */
  recalled: number[];
  correct: number;
  /** Yazılan kelime sayısı (öteki listeden ve listede olmayanlar dahil). */
  entries: number;
  /** Öteki listeden yazılan kelimeler: ilk listeyi yazarken ikinci listeden ya da ikinci listeyi yazarken ilk listeden. */
  otherList: number;
  /** Hiçbir listede olmayan kelimeler. */
  extra: number;
  /** Aynı denemede ikinci kez yazılan liste kelimeleri (ör. biri çoğul). */
  repeats: number;
  ms: number | null;
  /** Liste gösterilirken sayfa gizlendiği için listenin baştan gösterilme sayısı. */
  restarts: number;
}

type WordListLureCounts = Record<WordListLure, number>;

export interface WordListResult {
  listLength: number;
  /** İlk listenin öğrenme denemeleri (sırayla). */
  trials: WordListRecall[];
  /** İkinci (araya giren) liste. */
  b: WordListRecall;
  /** İlk liste, ikinci listeden sonra ve yeniden gösterilmeden. */
  delayed: WordListRecall;
  /** Öğrenme denemelerinde hatırlanan kelimelerin toplamı ve en çok olabileceği. */
  total: number;
  totalMax: number;
  /** Son öğrenme denemesi ile ilki arasındaki fark. */
  gain: number;
  /** Araya giren listeden sonra hatırlanan / son öğrenme denemesinde hatırlanan (son denemede hiç kelime yoksa null). */
  retention: number | null;
  /** Öğrenme denemelerinde listenin başından, ortasından ve sonundan hatırlananlar; her biri `of` fırsattan. */
  positions: { begin: number; middle: number; end: number; of: number };
  /** Öğrenme denemelerinde hiçbir listede olmayan kelimeler. */
  extraLearning: number;
  /** Hiç kelime yazılmayan hatırlama denemeleri. */
  emptyRecalls: number;
  /** Yazılan bütün kelimeler (bütün hatırlama denemelerinde). */
  entries: number;
  restarts: number;
  recognition: {
    n: number;
    /** İlk listedeki kelimeler ve onlara verilen "evet" cevapları. */
    targets: number;
    hits: number;
    /** Yanılgı türlerinin kelime sayıları ve onlara verilen "evet" cevapları. */
    lures: WordListLureCounts;
    falseYes: WordListLureCounts;
    /** "Evet" denen anlamca yakın ve sesi benzer yanılgılar ile ilişkili oldukları kelimeler (raporda örnek için). */
    falseYesPairs: { kind: 'semantic' | 'sound'; word: string; of: string }[];
    yes: number;
    hitRate: number;
    falseRate: number;
    /** Ayırt etme: "evet" oranı ilk listedeki kelimelerde eksi yanılgılarda. */
    discrimination: number;
    /** `WORD_RECOGNITION_FAST_MS`'den kısa cevaplar. */
    tooFast: number;
    medianRt: number | null;
  };
}

/** Bir hatırlama denemesinde en çok bu kadar kelime alınır. */
export const WORD_LIST_MAX_ENTRIES = 40;

export function scoreWordList(task: WordListTask, input: WordListTrialInput[]): { result: WordListResult } {
  const recalls = wordListRecalls(task);
  const nRecog = task.recognition.length;
  const n = recalls.length + nRecog;
  const byIndex = new Map<number, WordListTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz deneme.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (t.index < recalls.length) {
      const r = t.response;
      if (r === null || typeof r !== 'object' || !Array.isArray(r.words) || r.words.length > WORD_LIST_MAX_ENTRIES) throw new TaskInputError('Geçersiz cevap.');
      if (r.words.some((w) => typeof w !== 'string' || w.length > 30)) throw new TaskInputError('Geçersiz cevap.');
      if (r.restarts !== undefined && (!Number.isInteger(r.restarts) || r.restarts < 0)) throw new TaskInputError('Geçersiz cevap.');
    } else if (t.response !== 1 && t.response !== 2) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Denemelerin hepsi gelmedi.');

  const all = [...task.listA, ...task.listB];
  const recallOf = (i: number): WordListRecall => {
    const kind = recalls[i];
    const t = byIndex.get(i)!;
    const resp = t.response as { words: string[]; restarts?: number };
    const words = resp.words.filter((w) => normalizeWord(w).length > 0);
    const own = new Set<number>();
    let otherList = 0;
    let extra = 0;
    let repeats = 0;
    for (const w of words) {
      const m = matchWord(w, all);
      if (m === null) extra++;
      else {
        const inA = m < task.listA.length;
        const pos = inA ? m : m - task.listA.length;
        if ((kind.list === 'A') !== inA) otherList++;
        else if (own.has(pos)) repeats++;
        else own.add(pos);
      }
    }
    const recalled = [...own].sort((a, b) => a - b);
    return { list: kind.list, recalled, correct: recalled.length, entries: words.length, otherList, extra, repeats, ms: t.rtMs, restarts: resp.restarts ?? 0 };
  };
  const scored = recalls.map((_, i) => recallOf(i));
  const trials = scored.slice(0, task.learningTrials);
  const b = scored[task.learningTrials];
  const delayed = scored[task.learningTrials + 1];
  const L = task.listA.length;
  const third = Math.floor(L / 3);
  const inRange = (lo: number, hi: number) => trials.reduce((s, t) => s + t.recalled.filter((p) => p >= lo && p < hi).length, 0);
  const last = trials[trials.length - 1];

  const zero = (): WordListLureCounts => ({ b: 0, semantic: 0, sound: 0, new: 0 });
  const lures = zero();
  const falseYes = zero();
  const falseYesPairs: WordListResult['recognition']['falseYesPairs'] = [];
  let hits = 0;
  let targets = 0;
  let yes = 0;
  let tooFast = 0;
  const rts: number[] = [];
  task.recognitionKey.forEach((key, j) => {
    const t = byIndex.get(recalls.length + j)!;
    const said = t.response === 1;
    if (said) yes++;
    if (t.rtMs !== null) {
      if (t.rtMs < WORD_RECOGNITION_FAST_MS) tooFast++;
      rts.push(t.rtMs);
    }
    if (key.kind === 'target') {
      targets++;
      if (said) hits++;
    } else {
      lures[key.kind]++;
      if (said) {
        falseYes[key.kind]++;
        if ((key.kind === 'semantic' || key.kind === 'sound') && key.of !== undefined) falseYesPairs.push({ kind: key.kind, word: task.recognition[j], of: task.listA[key.of] });
      }
    }
  });
  const nLures = nRecog - targets;
  const nFalse = falseYes.b + falseYes.semantic + falseYes.sound + falseYes.new;
  const hitRate = targets ? hits / targets : 0;
  const falseRate = nLures ? nFalse / nLures : 0;

  return {
    result: {
      listLength: L,
      trials,
      b,
      delayed,
      total: trials.reduce((s, t) => s + t.correct, 0),
      totalMax: L * trials.length,
      gain: last.correct - trials[0].correct,
      retention: last.correct > 0 ? round(delayed.correct / last.correct, 3) : null,
      positions: { begin: inRange(0, third), middle: inRange(third, L - third), end: inRange(L - third, L), of: third * trials.length },
      extraLearning: trials.reduce((s, t) => s + t.extra, 0),
      emptyRecalls: scored.filter((t) => t.entries === 0).length,
      entries: scored.reduce((s, t) => s + t.entries, 0),
      restarts: scored.reduce((s, t) => s + t.restarts, 0),
      recognition: {
        n: nRecog,
        targets,
        hits,
        lures,
        falseYes,
        falseYesPairs,
        yes,
        hitRate: round(hitRate, 3),
        falseRate: round(falseRate, 3),
        discrimination: round(hitRate - falseRate, 3),
        tooFast,
        medianRt: medianOrNull(rts),
      },
    },
  };
}

/* ---------- Cevap kalitesi ---------- */

const ORDINALS_LOWER = ['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci', 'altıncı'];
const ordinalLower = (i: number) => ORDINALS_LOWER[i] ?? `${i + 1}.`;

/* ---------- Mantıksal akıl yürütme ---------- */

export interface LogicTrialInput {
  index: number;
  /** 1: evet, kesin olarak doğru; 2: hayır, kesin değil. */
  response: number;
  rtMs: number | null;
}

/** Bir soru grubunda soru sayısı, doğru cevap ve "evet" cevabı sayısı. */
export interface LogicGroup {
  n: number;
  correct: number;
  yes: number;
}

export interface LogicResult {
  n: number;
  correct: number;
  accuracy: number;
  /** Soru türlerine göre (koşullu: mp, mt, ac, da; kategorik: vb, vu, ib, iu). */
  forms: Record<LogicForm, LogicGroup>;
  /** Koşullu sorular: hepsi, kesin olanlar (mp, mt) ve kesin olmayanlar (ac, da). */
  conditional: LogicGroup;
  condValid: LogicGroup;
  condInvalid: LogicGroup;
  /** Kategorik sorular: hepsi, bilgi ile inancın çatışmadığı (vb, iu) ve çatıştığı (vu, ib) sorular. */
  categorical: LogicGroup;
  noConflict: LogicGroup;
  conflict: LogicGroup;
  /**
   * Kategorik sorularda inandırıcılık etkisi: inandırıcı sonuçların "evet" oranından inandırıcı olmayanlarınki çıkarılır
   * (−1 ile 1 arası; Evans ve ark., 1983'teki "belief" etkisi). Mantık etkisi: geçerli sonuçların "evet" oranından
   * geçersizlerinki çıkarılır.
   */
  beliefIndex: number;
  logicIndex: number;
  /** Bütün sorulardaki "evet" cevabı sayısı (cevapların yarısı "evet"tir). */
  yes: number;
  medianRt: number | null;
  /** Sorunun uzunluğuna göre okunamayacak kadar kısa sürede verilen cevaplar (doğru ya da yanlış) ve bunların doğruları. */
  rapid: number;
  rapidCorrect: number;
}

export const LOGIC_FORMS_ORDER: LogicForm[] = ['mp', 'mt', 'ac', 'da', 'vb', 'vu', 'ib', 'iu'];
/** Hep aynı yöne: 32 sorunun en az 28'inde "evet" ya da en az 28'inde "hayır" (cevapların yarısı "evet"tir). */
export const LOGIC_SAME_SIDE = 28;
/** Sekiz soruluk bir grupta "çoğunu doğru" (en az 6) ve "zorlanma" (en çok 4; iki seçenekte rastgele seçimin düzeyi). */
export const LOGIC_GOOD = 6;
export const LOGIC_WEAK = 4;
/** 32 sorunun en çok 10'u doğru: iki seçenekte rastgele seçimin de altında (yönerge ters anlaşılmış olabilir). */
export const LOGIC_BELOW_CHANCE = 10;

export function scoreLogic(task: LogicalReasoningTask, input: LogicTrialInput[]): { result: LogicResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.forms.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, LogicTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (t.response !== 1 && t.response !== 2) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    return {
      item,
      form: task.forms[i],
      correct: t.response === task.answers[i],
      yes: t.response === 1,
      rt: t.rtMs,
    };
  });
  const group = (forms: LogicForm[]): LogicGroup => {
    const here = scored.filter((s) => forms.includes(s.form));
    return {
      n: here.length,
      correct: here.filter((s) => s.correct).length,
      yes: here.filter((s) => s.yes).length,
    };
  };
  const forms = Object.fromEntries(LOGIC_FORMS_ORDER.map((f) => [f, group([f])])) as Record<LogicForm, LogicGroup>;
  const rate = (g: LogicGroup) => (g.n ? g.yes / g.n : 0);
  const correct = scored.filter((s) => s.correct).length;
  const rts = scored.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const fast = scored.filter((s) => s.rt !== null && s.rt < logicRapidMs(s.item));
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      forms,
      conditional: group(LOGIC_CONDITIONAL),
      condValid: group(['mp', 'mt']),
      condInvalid: group(['ac', 'da']),
      categorical: group(['vb', 'vu', 'ib', 'iu']),
      noConflict: group(['vb', 'iu']),
      conflict: group(LOGIC_CONFLICT),
      beliefIndex: round(rate(group(['vb', 'ib'])) - rate(group(['vu', 'iu'])), 3),
      logicIndex: round(rate(group(['vb', 'vu'])) - rate(group(['ib', 'iu'])), 3),
      yes: scored.filter((s) => s.yes).length,
      medianRt: medianOrNull(rts),
      rapid: fast.length,
      rapidCorrect: fast.filter((s) => s.correct).length,
    },
  };
}

/** Cevapların neredeyse hepsi aynı yönde ("evet" ya da "hayır"): türlere göre yorum yapılmaz. */
export const logicSameSide = (r: LogicResult): 'yes' | 'no' | null => (r.yes >= LOGIC_SAME_SIDE ? 'yes' : r.n - r.yes >= LOGIC_SAME_SIDE ? 'no' : null);
/**
 * Okunamayacak kadar hızlı cevaplar: soruların en az dörtte biri ve bu cevapların dörtte üçünden azı doğru. Hızlı ama
 * çoğu doğru cevaplar, soruların hızlı okunduğunu gösterir; uyarı verilmez.
 */
export const logicRapid = (r: LogicResult) => r.rapid >= Math.ceil(r.n / 4) && r.rapidCorrect < 0.75 * r.rapid;
/** Rastgele seçimin de altında doğru (hep aynı cevap verilmemişken). */
export const logicBelowChance = (r: LogicResult) => !logicSameSide(r) && r.correct <= LOGIC_BELOW_CHANCE;

/** Mantıksal akıl yürütmede sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, logicBlocks aynı eşikleri kullanır). */
export function logicQualityNotes(r: LogicResult): string[] {
  const notes: string[] = [];
  const side = logicSameSide(r);
  if (side) {
    notes.push(
      `Mantıksal akıl yürütme testinde ${r.n} sorunun ${side === 'yes' ? r.yes : r.n - r.yes} tanesine “${side === 'yes' ? 'Evet, kesin olarak doğru' : 'Hayır, kesin değil'}” denmiş; oysa soruların yarısının cevabı “evet”, yarısının “hayır”dır. Sorulara bakılmadan hep aynı cevap verilmiş ya da yönerge farklı anlaşılmış olabilir; soru türlerine göre sonuçlar yorumlanmadı.`,
    );
  }
  if (logicBelowChance(r)) {
    notes.push(
      `Mantıksal akıl yürütme testinde ${r.n} sorunun yalnızca ${r.correct} tanesi doğru cevaplanmış; bu, iki seçenek arasından rastgele seçimde beklenenden de azdır. Yönerge farklı anlaşılmış ya da seçenekler ters kullanılmış olabilir; sonuç dikkatle yorumlanmalıdır.`,
    );
  }
  if (logicRapid(r)) {
    notes.push(
      `Mantıksal akıl yürütme testinde ${r.n} sorunun ${r.rapid} tanesinde cevap, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verilmiş ve bu cevapların yalnızca ${r.rapidCorrect} tanesi doğru; bu sorularda okumadan seçilmiş olabilir.`,
    );
  }
  return notes;
}
/* ---------- Sayısal akıl yürütme ---------- */

export interface NumericTrialInput {
  index: number;
  /** Yazılan sayı; "Bilmiyorum" denirse `null`. */
  response: { answer: number } | null;
  rtMs: number | null;
}

/** Bir soru grubunda soru sayısı, doğru cevap ve "Bilmiyorum" sayısı. */
export interface NumericGroup {
  n: number;
  correct: number;
  blank: number;
}

export const NUMERIC_LURE_KINDS: NumericLureKind[] = ['additive', 'proportional', 'inverse', 'operational', 'reverse', 'partial'];

export interface NumericResult {
  n: number;
  correct: number;
  accuracy: number;
  /** "Bilmiyorum" denen sorular. */
  blank: number;
  /** Soru türlerine göre (p, a, c, f, eq, comp, bal). */
  kinds: Record<NumericKind, NumericGroup>;
  /** Orantılı durumlar (p), orantılı olmayan durumlar (a, c, f) ve eşitlik ve denge soruları (eq, comp, bal). */
  prop: NumericGroup;
  nonProp: NumericGroup;
  equal: NumericGroup;
  /** Orantılı ve fark korunan durumlar, sayıların birbirinin tam katı olup olmamasına göre. */
  pInt: NumericGroup;
  pFrac: NumericGroup;
  aInt: NumericGroup;
  aFrac: NumericGroup;
  /**
   * Sayıların doğru yönteme çektiği sorular (tam katlı orantılı, tam katlı olmayan fark korunan) ve yanlış yönteme
   * çektiği sorular (tam katlı olmayan orantılı, tam katlı fark korunan; Fernández ve ark., 2012).
   */
  congruent: NumericGroup;
  incongruent: NumericGroup;
  /** Yanılgı cevaplarının sayısı, türüne göre. */
  lures: Record<NumericLureKind, number>;
  /** Orantı kuran cevaplar, orantılı olmayan durumun türüne göre (fark korunan, değişmeyen, başlangıçlı). */
  propLures: { a: number; c: number; f: number };
  /** Sayıların yanlış yönteme çektiği sorulardaki yanılgı cevapları: tam katlı olmayan orantılıda fark, tam katlı fark korunanda orantı. */
  fracAdditive: number;
  intProportional: number;
  medianRt: number | null;
  /** Sorunun uzunluğuna göre okunamayacak kadar kısa sürede verilen cevaplar ("Bilmiyorum" dahil) ve bunların doğruları. */
  rapid: number;
  rapidCorrect: number;
}

/** Sekiz soruluk bir grupta "çoğunu doğru" en az 6; bir yanılgı türü en az iki cevapta görülünce anlatılır. */
export const NUMERIC_GOOD = 6;
export const NUMERIC_LURE_NOTE = 2;
/** "Bilmiyorum" soruların yarısında ya da daha çoğunda denmişse sonuç dikkatle yorumlanır. */
export const NUMERIC_BLANK_MANY = 12;

export function scoreNumeric(task: NumericalReasoningTask, input: NumericTrialInput[]): { result: NumericResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.kinds.length !== n || task.ratios.length !== n || task.lures.length !== n) {
    throw new TaskInputError('Cevap anahtarı eksik.');
  }
  const byIndex = new Map<number, NumericTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (t.response !== null) {
      const a = t.response?.answer;
      if (typeof a !== 'number' || !Number.isInteger(a) || a < 0 || a >= 10 ** task.maxDigits) throw new TaskInputError('Geçersiz cevap.');
    }
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const value = t.response === null ? null : t.response.answer;
    const correct = value === task.answers[i];
    const lure = value === null || correct ? null : (NUMERIC_LURE_KINDS.find((k) => task.lures[i][k]?.includes(value)) ?? null);
    return { item, kind: task.kinds[i], ratio: task.ratios[i], value, correct, lure, rt: t.rtMs };
  });
  type Scored = (typeof scored)[number];
  const group = (pick: (s: Scored) => boolean): NumericGroup => {
    const here = scored.filter(pick);
    return { n: here.length, correct: here.filter((s) => s.correct).length, blank: here.filter((s) => s.value === null).length };
  };
  const kinds = Object.fromEntries(NUMERIC_KINDS.map((k) => [k, group((s) => s.kind === k)])) as Record<NumericKind, NumericGroup>;
  const lures = Object.fromEntries(NUMERIC_LURE_KINDS.map((k) => [k, scored.filter((s) => s.lure === k).length])) as Record<NumericLureKind, number>;
  const isIncongruent = (s: Scored) => (s.kind === 'p' && s.ratio === 'frac') || (s.kind === 'a' && s.ratio === 'int');
  const isCongruent = (s: Scored) => (s.kind === 'p' && s.ratio === 'int') || (s.kind === 'a' && s.ratio === 'frac');
  const correct = scored.filter((s) => s.correct).length;
  const rts = scored.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const fast = scored.filter((s) => s.rt !== null && s.rt < numericRapidMs(s.item));
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      blank: scored.filter((s) => s.value === null).length,
      kinds,
      prop: group((s) => NUMERIC_PROP.includes(s.kind)),
      nonProp: group((s) => NUMERIC_NONPROP.includes(s.kind)),
      equal: group((s) => NUMERIC_EQUAL.includes(s.kind)),
      pInt: group((s) => s.kind === 'p' && s.ratio === 'int'),
      pFrac: group((s) => s.kind === 'p' && s.ratio === 'frac'),
      aInt: group((s) => s.kind === 'a' && s.ratio === 'int'),
      aFrac: group((s) => s.kind === 'a' && s.ratio === 'frac'),
      congruent: group(isCongruent),
      incongruent: group(isIncongruent),
      lures,
      propLures: {
        a: scored.filter((s) => s.kind === 'a' && s.lure === 'proportional').length,
        c: scored.filter((s) => s.kind === 'c' && s.lure === 'proportional').length,
        f: scored.filter((s) => s.kind === 'f' && s.lure === 'proportional').length,
      },
      fracAdditive: scored.filter((s) => s.kind === 'p' && s.ratio === 'frac' && s.lure === 'additive').length,
      intProportional: scored.filter((s) => s.kind === 'a' && s.ratio === 'int' && s.lure === 'proportional').length,
      medianRt: medianOrNull(rts),
      rapid: fast.length,
      rapidCorrect: fast.filter((s) => s.correct).length,
    },
  };
}

/** Okunamayacak kadar hızlı cevaplar: soruların en az dörtte biri ve bu cevapların dörtte üçünden azı doğru. */
export const numericRapid = (r: NumericResult) => r.rapid >= Math.ceil(r.n / 4) && r.rapidCorrect < 0.75 * r.rapid;
/**
 * Sayılara göre yöntem seçme: sayıların doğru yönteme çektiği altı sorunun en az beşi doğru; tam katlı olmayan dört
 * orantılı durumun en az üçünde fark, tam katlı iki fark korunan durumun en az birinde orantı kurulmuş.
 */
export const numericNumberDriven = (r: NumericResult) => r.congruent.correct >= r.congruent.n - 1 && r.fracAdditive >= 3 && r.intProportional >= 1;

/** Sayısal akıl yürütmede sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, numericBlocks aynı eşikleri kullanır). */
export function numericQualityNotes(r: NumericResult): string[] {
  const notes: string[] = [];
  if (r.blank >= NUMERIC_BLANK_MANY) {
    notes.push(
      `Sayısal akıl yürütme testinde ${r.n} sorunun ${r.blank} tanesinde “Bilmiyorum” denmiş; cevaplanan soru az olduğu için soru türlerine göre sonuçlar dikkatle yorumlanmalıdır.`,
    );
  }
  if (numericRapid(r)) {
    notes.push(
      `Sayısal akıl yürütme testinde ${r.n} sorunun ${r.rapid} tanesinde cevap, soruyu okumaya yetmeyecek kadar kısa sürede verilmiş ve ${r.rapidCorrect === 0 ? 'bu cevapların hiçbiri doğru değil' : `bu cevapların yalnızca ${r.rapidCorrect} tanesi doğru`}; bu sorulara okumadan cevap verilmiş olabilir.`,
    );
  }
  return notes;
}

/* ---------- Küp açınımı ---------- */

export interface CubeTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–4). */
  response: number;
  rtMs: number | null;
}

export interface CubeTypeResult {
  type: CubeType;
  n: number;
  correct: number;
}

export interface CubeResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  /** Yalnızca yüzlerin yerinin önemli olduğu ve şekillerin yönünün de önemli olduğu sorular. */
  types: CubeTypeResult[];
  reached: number;
  medianRt: number | null;
  rtEasy: number | null;
  rtHard: number | null;
  /** 3. düzey ve üstündeki sorulardan `CUBE_RAPID_MS`'den kısa sürede yanlış cevaplananlar ve bu soruların sayısı. */
  rapid: number;
  rapidOf: number;
  wrong: number;
  /** Yanlışlarda seçilen seçeneğin yanılgı türü ve her türün seçeneklerde kaç kez bulunduğu. */
  luresByKind: Record<CubeLure, number>;
  offeredByKind: Record<CubeLure, number>;
  /**
   * Her yanılgı türü için, yanlışlarda rastgele seçilmiş olsaydı en az bu kadar sık görülme olasılığı. Yanlış
   * seçeneklerin türleri dengeli değildir (karşılıklı yüzler ve köşedeki sıra 24'er, şeklin yönü 12 seçenekte); bu
   * yüzden bir türün sıklığı, yanlış cevaplanan sorularda o türden kaç seçenek bulunduğuna göre değerlendirilir.
   */
  lureP: Record<CubeLure, number>;
  samePosition: number;
}

export const CUBE_LURES_ORDER: CubeLure[] = ['opposite', 'order', 'turn'];
export const CUBE_TYPES_ORDER: CubeType[] = ['place', 'turn'];
/** Açınımı katlayıp dört küpe bakmak için bundan kısa bir süre yetmez (3. düzey ve üstünde birkaç katlama gerekir). */
export const CUBE_RAPID_MS = 3000;
/** Dört seçenekli 20 soruda rastgele seçimle ulaşılabilecek doğru sayısı (%5 sınırı: 9 ya da daha çok doğrunun olasılığı %4). */
export const CUBE_CHANCE_MAX = 8;

export function scoreCube(task: CubeNetTask, input: CubeTrialInput[]): { result: CubeResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.optionLures.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, CubeTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.items[t.index].options.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const correct = t.response === task.answers[i];
    return { item, correct, lure: correct ? null : task.optionLures[i][t.response - 1], response: t.response, rt: t.rtMs };
  });
  const correct = scored.filter((s) => s.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((s) => s.item.level === level);
      return { level, n: here.length, correct: here.filter((s) => s.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const luresByKind = Object.fromEntries(CUBE_LURES_ORDER.map((k) => [k, scored.filter((s) => s.lure === k).length])) as Record<CubeLure, number>;
  const offeredByKind = Object.fromEntries(CUBE_LURES_ORDER.map((k) => [k, task.optionLures.flat().filter((x) => x === k).length])) as Record<CubeLure, number>;
  // Yanlış cevaplanan her soruda yanlış seçeneklerden biri rastgele seçilseydi: türün o sorudaki payı (Poisson-binom).
  const wrongIdx = scored.flatMap((s, i) => (s.correct ? [] : [i]));
  const lureP = Object.fromEntries(
    CUBE_LURES_ORDER.map((k) => {
      const ps = wrongIdx.map((i) => {
        const wrongs = task.optionLures[i].filter((x) => x !== null);
        return wrongs.filter((x) => x === k).length / wrongs.length;
      });
      let dist = [1];
      for (const q of ps) dist = [...dist, 0].map((v, j) => v * (1 - q) + (j > 0 ? dist[j - 1] * q : 0));
      return [k, round(Math.min(1, dist.slice(luresByKind[k]).reduce((a, b) => a + b, 0)), 4)];
    }),
  ) as Record<CubeLure, number>;
  const types = CUBE_TYPES_ORDER.flatMap((type) => {
    const here = scored.filter((s) => s.item.type === type);
    return here.length ? [{ type, n: here.length, correct: here.filter((s) => s.correct).length }] : [];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const hardOnes = scored.filter((s) => s.item.level >= 3);
  const positions = new Map<number, number>();
  for (const s of scored) positions.set(s.response, (positions.get(s.response) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      types,
      reached,
      medianRt: medianOrNull(rts(scored)),
      rtEasy: medianOrNull(rts(scored.filter((s) => s.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((s) => s.item.level >= 3))),
      rapid: hardOnes.filter((s) => !s.correct && s.rt !== null && s.rt < CUBE_RAPID_MS).length,
      rapidOf: hardOnes.length,
      wrong: n - correct,
      luresByKind,
      offeredByKind,
      lureP,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/** Zor sorularda çok hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri. */
/** Küp açınımında şans düzeyi (şekil akıl yürütmedeki gibi: hiçbir düzeye ulaşılmadıysa). */
export const cubeChance = (r: CubeResult) => r.correct <= CUBE_CHANCE_MAX && r.reached === 0;
export const cubeRapid = (r: CubeResult) => r.rapidOf > 0 && r.rapid >= Math.max(2, Math.ceil(r.rapidOf / 4));
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const CUBE_SAME_MAX_CORRECT = 12;
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada ve doğru cevaplar çok değil. */
export const cubeSamePosition = (r: CubeResult) => r.samePosition >= Math.ceil(r.n / 2) && r.correct <= CUBE_SAME_MAX_CORRECT;
/** Bir yanılgı türü yanlışlarda en az üç kez ve rastgele seçimde beklenenden belirgin sık (olasılık en çok %5) görülünce anlatılır. */
export const CUBE_LURE_NOTE = 3;
export const CUBE_LURE_P = 0.05;
export const cubeLureStandsOut = (r: CubeResult, k: CubeLure) => r.luresByKind[k] >= CUBE_LURE_NOTE && r.lureP[k] <= CUBE_LURE_P;

/** Küp açınımında sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, cubeBlocks aynı eşikleri kullanır). */
export function cubeQualityNotes(r: CubeResult): string[] {
  const notes: string[] = [];
  if (cubeChance(r)) {
    notes.push(
      'Küp açınımı testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da sorulara bakılmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (cubeRapid(r)) {
    notes.push(
      `Küp açınımı testinde 3. düzey ve üstündeki ${r.rapidOf} sorunun ${r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`} yanlış bir cevap 3 saniyeden kısa sürede verilmiş; bu sorularda açınıma bakılmadan seçilmiş olabilir.`,
    );
  }
  if (cubeSamePosition(r)) {
    notes.push('Küp açınımı testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/* ---------- Gizli şekiller ---------- */

export interface HiddenTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–4). */
  response: number;
  rtMs: number | null;
}

export interface HiddenResult {
  n: number;
  correct: number;
  accuracy: number;
  levels: MatrixLevelResult[];
  reached: number;
  medianRt: number | null;
  /** Doğru cevaplanan sorularda tipik süre (şeklin bulunma süresi). */
  medianRtCorrect: number | null;
  rtEasy: number | null;
  rtHard: number | null;
  /** 3. düzey ve üstündeki sorulardan `HIDDEN_RAPID_MS`'den kısa sürede yanlış cevaplananlar ve bu soruların sayısı. */
  rapid: number;
  rapidOf: number;
  wrong: number;
  /** Yanlışlarda seçilen seçeneğin yanılgı türü ve her türün seçeneklerde kaç kez bulunduğu. */
  luresByKind: Record<HiddenLure, number>;
  offeredByKind: Record<HiddenLure, number>;
  /** Her yanılgı türü için, yanlışlarda rastgele seçilmiş olsaydı en az bu kadar sık görülme olasılığı (Poisson-binom). */
  lureP: Record<HiddenLure, number>;
  samePosition: number;
}

export const HIDDEN_LURES_ORDER: HiddenLure[] = ['turned', 'changed'];
/** Dört karmaşık çizimde şekli aramak için bundan kısa bir süre yetmez (3. düzey ve üstünde şekil iyice gizlenmiştir). */
export const HIDDEN_RAPID_MS = 3000;
/** Dört seçenekli 20 soruda rastgele seçimle ulaşılabilecek doğru sayısı (%5 sınırı: 9 ya da daha çok doğrunun olasılığı %4). */
export const HIDDEN_CHANCE_MAX = 8;

export function scoreHidden(task: HiddenFiguresTask, input: HiddenTrialInput[]): { result: HiddenResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.optionLures.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, HiddenTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.items[t.index].options.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const correct = t.response === task.answers[i];
    return { item, correct, lure: correct ? null : task.optionLures[i][t.response - 1], response: t.response, rt: t.rtMs };
  });
  const correct = scored.filter((x) => x.correct).length;
  const levels = [...new Set(task.items.map((it) => it.level))]
    .sort((a, b) => a - b)
    .map((level) => {
      const here = scored.filter((x) => x.item.level === level);
      return { level, n: here.length, correct: here.filter((x) => x.correct).length };
    });
  let reached = 0;
  let upToCorrect = 0;
  let upToN = 0;
  for (const l of levels) {
    upToCorrect += l.correct;
    upToN += l.n;
    if (l.correct / l.n >= MATRIX_LEVEL_PASS && upToCorrect / upToN >= MATRIX_LEVEL_PASS) reached = l.level;
  }
  const luresByKind = Object.fromEntries(HIDDEN_LURES_ORDER.map((k) => [k, scored.filter((x) => x.lure === k).length])) as Record<HiddenLure, number>;
  const offeredByKind = Object.fromEntries(HIDDEN_LURES_ORDER.map((k) => [k, task.optionLures.flat().filter((x) => x === k).length])) as Record<HiddenLure, number>;
  // Yanlış cevaplanan her soruda yanlış seçeneklerden biri rastgele seçilseydi: türün o sorudaki payı (Poisson-binom).
  const wrongIdx = scored.flatMap((x, i) => (x.correct ? [] : [i]));
  const lureP = Object.fromEntries(
    HIDDEN_LURES_ORDER.map((k) => {
      const ps = wrongIdx.map((i) => {
        const wrongs = task.optionLures[i].filter((x) => x !== null);
        return wrongs.filter((x) => x === k).length / wrongs.length;
      });
      let dist = [1];
      for (const q of ps) dist = [...dist, 0].map((v, j) => v * (1 - q) + (j > 0 ? dist[j - 1] * q : 0));
      return [k, round(Math.min(1, dist.slice(luresByKind[k]).reduce((a, b) => a + b, 0)), 4)];
    }),
  ) as Record<HiddenLure, number>;
  const rts = (xs: typeof scored) => xs.flatMap((x) => (x.rt === null ? [] : [x.rt]));
  const hardOnes = scored.filter((x) => x.item.level >= 3);
  const positions = new Map<number, number>();
  for (const x of scored) positions.set(x.response, (positions.get(x.response) ?? 0) + 1);
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      levels,
      reached,
      medianRt: medianOrNull(rts(scored)),
      medianRtCorrect: medianOrNull(rts(scored.filter((x) => x.correct))),
      rtEasy: medianOrNull(rts(scored.filter((x) => x.item.level <= 2))),
      rtHard: medianOrNull(rts(scored.filter((x) => x.item.level >= 3))),
      rapid: hardOnes.filter((x) => !x.correct && x.rt !== null && x.rt < HIDDEN_RAPID_MS).length,
      rapidOf: hardOnes.length,
      wrong: n - correct,
      luresByKind,
      offeredByKind,
      lureP,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/** Zor sorularda çok hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri. */
/** Gizli şekillerde şans düzeyi (şekil akıl yürütmedeki gibi: hiçbir düzeye ulaşılmadıysa). */
export const hiddenChance = (r: HiddenResult) => r.correct <= HIDDEN_CHANCE_MAX && r.reached === 0;
export const hiddenRapid = (r: HiddenResult) => r.rapidOf > 0 && r.rapid >= Math.max(2, Math.ceil(r.rapidOf / 4));
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const HIDDEN_SAME_MAX_CORRECT = 12;
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada ve doğru cevaplar çok değil. */
export const hiddenSamePosition = (r: HiddenResult) => r.samePosition >= Math.ceil(r.n / 2) && r.correct <= HIDDEN_SAME_MAX_CORRECT;
/** Bir yanılgı türü yanlışlarda en az üç kez ve rastgele seçimde beklenenden belirgin sık (olasılık en çok %5) görülünce anlatılır. */
export const HIDDEN_LURE_NOTE = 3;
export const HIDDEN_LURE_P = 0.05;
export const hiddenLureStandsOut = (r: HiddenResult, k: HiddenLure) => r.luresByKind[k] >= HIDDEN_LURE_NOTE && r.lureP[k] <= HIDDEN_LURE_P;

/** Gizli şekillerde sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, hiddenBlocks aynı eşikleri kullanır). */
export function hiddenQualityNotes(r: HiddenResult): string[] {
  const notes: string[] = [];
  if (hiddenChance(r)) {
    // Yanlışların çoğu döndürülmüş biçimse (ve çalışma biçiminde kuşku yoksa) yönerge farklı anlaşılmış olabilir.
    const turnedMost = !hiddenRapid(r) && !hiddenSamePosition(r) && r.luresByKind.turned >= Math.max(6, 0.6 * (r.n - r.correct));
    notes.push(
      turnedMost
        ? 'Gizli şekiller testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; yanlışların çoğunda aranan şeklin döndürülmüş ya da ters çevrilmiş biçimi seçilmiş. Yönerge farklı anlaşılmış olabilir: döndürülmüş ya da ters çevrilmiş şekil doğru cevap sayılmaz. Bu sonuç tek başına yorumlanmamalıdır.'
        : 'Gizli şekiller testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da çizimlere bakılmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (hiddenRapid(r)) {
    notes.push(
      `Gizli şekiller testinde 3. düzey ve üstündeki ${r.rapidOf} sorunun ${r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`} yanlış bir cevap 3 saniyeden kısa sürede verilmiş; bu sorularda çizimlere bakılmadan seçilmiş olabilir.`,
    );
  }
  if (hiddenSamePosition(r)) {
    notes.push('Gizli şekiller testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/* ---------- Desen hatırlama ---------- */

export interface PatternTrialInput {
  /** Denemenin sırası: düzey × 3 + desen (0'dan). */
  index: number;
  /**
   * İşaretlenen kareler (satır satır, 0'dan); "Hatırlamıyorum" denirse boş. `restarts`: desen gösterilirken sayfa gizlendiği
   * için desenin baştan gösterilme sayısı.
   */
  response: { cells: number[]; restarts?: number };
  rtMs: number | null;
}

export interface PatternTrialResult {
  index: number;
  /** Desendeki dolu kare sayısı (düzey). */
  size: number;
  correct: boolean;
  /** "Hatırlamıyorum" dendi (hiç kare işaretlenmedi). */
  skipped: boolean;
  marked: number;
  /** Doğru işaretlenen, işaretlenmeyen (eksik) ve desende olmayan (fazla) kareler. */
  hits: number;
  missed: number;
  extra: number;
  /** Yanlış ama yalnızca bir kare farklı: bir kare eksik, bir kare fazla ya da bir karenin yeri farklı. */
  near: boolean;
  /**
   * Bir karenin yeri, doğru yerinin hemen yanına (kenar komşusu) kaymış: kare sayısı doğru, tek bir kare farklı. Yalnızca
   * 7 ve daha büyük desenlerde sayılır: küçük ızgarada rastgele konan bir karenin de doğru yerin yanına düşme olasılığı
   * yüksektir.
   */
  shifted: boolean;
  /** Desen gösterilirken sayfa gizlendiği için desenin baştan gösterilme sayısı. */
  restarts: number;
  rt: number | null;
}

export interface PatternLevelResult {
  size: number;
  n: number;
  correct: number;
}

export interface PatternResult {
  /** Testteki en küçük ve en büyük desen (dolu kare). */
  start: number;
  max: number;
  /** Tam doğru hatırlanan en büyük desen (dolu kare; Della Sala ve ark., 1999'daki puan). En küçük düzeyde de doğru yoksa 0. */
  span: number;
  /** Görevin bittiği düzey (üç deseni de yanlış); en büyük düzeye kadar her düzeyde en az bir doğru varsa `null`. */
  stoppedAt: number | null;
  trials: number;
  correct: number;
  /** Gösterilen düzeyler, küçükten büyüğe. */
  levels: PatternLevelResult[];
  /**
   * Gösterilen desenlerdeki dolu kareler, bunlardan doğru işaretlenenler ve kısmi puan: her desende doğru işaretlenen
   * kareler eksi desende olmayan işaretli kareler (en az 0). Bütün kareleri işaretleyen biri kısmi puan almaz.
   */
  cellsShown: number;
  cellsHit: number;
  cellsCredit: number;
  /** Yanlış desenler ("Hatırlamıyorum" dahil) ve "Hatırlamıyorum" denenler. */
  wrong: number;
  skipped: number;
  /** "Hatırlamıyorum" denmeyen yanlış desenler ve bunlarda: yalnızca bir kare farklı olanlar; işaretlenen kare sayısı desendekinden az, fazla ya da aynı olanlar. */
  attemptedWrong: number;
  near: number;
  fewer: number;
  more: number;
  same: number;
  /** Bu desenlerde toplam eksik ve fazla kareler; bir karesi doğru yerinin hemen yanına kaymış desenler. */
  missed: number;
  extra: number;
  shifted: number;
  /** "Hatırlamıyorum" denmeyen desenlerde işaretleme süresinin ortancası. */
  medianRt: number | null;
  /**
   * Bakılmadan işaretlenmiş olabilecek desenler: yanlış, tek kare farkı değil, karelerin yarısından azı doğru ve
   * `PATTERN_RAPID_BASE_MS` + `PATTERN_RAPID_MS_PER_CELL` × işaretlenen kare süresinden kısa sürede işaretlenmiş.
   */
  rapid: number;
  /** Desen gösterilirken sayfa gizlendiği için desenlerin baştan gösterilme sayısı (toplam). */
  restarts: number;
  /**
   * Testin bittiği büyüklük (görevin bittiği ya da test sonuna kadar sürdüyse en büyük büyüklük) dışındaki desenler ve
   * bunlarda "Hatırlamıyorum" denenler.
   */
  beforeStop: number;
  skippedBeforeStop: number;
  items: PatternTrialResult[];
}

/**
 * Bakmadan işaretleme: desen ekrandan kalktıktan sonra `PATTERN_RAPID_BASE_MS` + kare başına `PATTERN_RAPID_MS_PER_CELL`
 * süreden kısa sürede işaretlenen ve karelerinin çoğu yanlış olan desenler (hızlı ama doğru yakın işaretleme sayılmaz).
 */
export const PATTERN_RAPID_BASE_MS = 800;
export const PATTERN_RAPID_MS_PER_CELL = 200;
/** Kayma (bir karenin doğru yerinin yanına konması) yalnızca bu büyüklükten başlayarak sayılır. */
export const PATTERN_SHIFT_MIN_SIZE = 7;
/** Raporda "büyük desen" sayılan en küçük büyüklük: yanlışlar bu büyüklükte ya da sonra başladıysa olağan olduğu söylenir. */
export const PATTERN_LARGE = 7;
/** Bir düzeyde gösterilen desen sayısı. */
export const PATTERN_PER_LEVEL = 3;

export function scorePattern(task: PatternMemoryTask, input: PatternTrialInput[]): { result: PatternResult } {
  const flat = task.levels.flatMap((l, li) => l.items.map((item, k) => ({ item, size: l.cells, level: li, k })));
  const byIndex = new Map<number, PatternTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= flat.length) throw new TaskInputError('Geçersiz desen.');
    const { item } = flat[t.index];
    const cells = t.response?.cells;
    if (!Array.isArray(cells) || cells.length > item.rows * item.cols) throw new TaskInputError('Geçersiz cevap.');
    const restarts = t.response.restarts;
    if (restarts !== undefined && (!Number.isInteger(restarts) || restarts < 0 || restarts > 50)) throw new TaskInputError('Geçersiz cevap.');
    if (cells.some((c) => !Number.isInteger(c) || c < 0 || c >= item.rows * item.cols) || new Set(cells).size !== cells.length) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  const shown = byIndex.size;
  if (shown < PATTERN_PER_LEVEL || shown % PATTERN_PER_LEVEL !== 0) throw new TaskInputError('Desenlerin hepsi cevaplanmadı.');
  for (let i = 0; i < shown; i++) if (!byIndex.has(i)) throw new TaskInputError('Desenlerin hepsi cevaplanmadı.');

  const items: PatternTrialResult[] = flat.slice(0, shown).map(({ item, size }, index) => {
    const t = byIndex.get(index)!;
    const target = new Set(item.cells);
    const marked = new Set(t.response.cells);
    const hits = [...marked].filter((c) => target.has(c)).length;
    const missedCells = item.cells.filter((c) => !marked.has(c));
    const extraCells = [...marked].filter((c) => !target.has(c));
    const correct = missedCells.length === 0 && extraCells.length === 0;
    const skipped = marked.size === 0;
    return {
      index,
      size,
      correct,
      skipped,
      marked: marked.size,
      hits,
      missed: missedCells.length,
      extra: extraCells.length,
      near: !correct && !skipped && missedCells.length <= 1 && extraCells.length <= 1,
      shifted:
        size >= PATTERN_SHIFT_MIN_SIZE && missedCells.length === 1 && extraCells.length === 1 && cellsAdjacent(extraCells[0], missedCells[0], item.cols),
      restarts: t.response.restarts ?? 0,
      rt: t.rtMs,
    };
  });

  // Düzeyler: bir düzeyin üç deseninin hiçbiri doğru değilse görev orada biter; daha sonraki desenler gelmemiş olmalı.
  const levels: PatternLevelResult[] = [];
  for (let li = 0; li * PATTERN_PER_LEVEL < shown; li++) {
    const here = items.slice(li * PATTERN_PER_LEVEL, (li + 1) * PATTERN_PER_LEVEL);
    levels.push({ size: task.levels[li].cells, n: here.length, correct: here.filter((x) => x.correct).length });
  }
  levels.forEach((l, i) => {
    if (l.correct === 0 && i < levels.length - 1) throw new TaskInputError('Geçersiz deneme dizisi.');
  });
  const last = levels[levels.length - 1];
  if (last.correct > 0 && levels.length < task.levels.length) throw new TaskInputError('Desenlerin hepsi cevaplanmadı.');
  const stoppedAt = last.correct === 0 ? last.size : null;
  const passed = levels.filter((l) => l.correct > 0);
  const wrongs = items.filter((x) => !x.correct && !x.skipped);
  const rts = items.flatMap((x) => (x.rt === null || x.skipped ? [] : [x.rt]));
  // Testin bittiği büyüklük: üç deseni de yanlış olan büyüklük ya da test sonuna kadar sürdüyse en büyük büyüklük.
  const beforeStop = items.filter((x) => x.size !== last.size);
  return {
    result: {
      start: task.levels[0].cells,
      max: task.levels[task.levels.length - 1].cells,
      span: passed.length ? passed[passed.length - 1].size : 0,
      stoppedAt,
      trials: shown,
      correct: items.filter((x) => x.correct).length,
      levels,
      cellsShown: items.reduce((a, x) => a + x.size, 0),
      cellsHit: items.reduce((a, x) => a + x.hits, 0),
      cellsCredit: items.reduce((a, x) => a + Math.max(0, x.hits - x.extra), 0),
      wrong: items.filter((x) => !x.correct).length,
      skipped: items.filter((x) => x.skipped).length,
      attemptedWrong: wrongs.length,
      near: wrongs.filter((x) => x.near).length,
      fewer: wrongs.filter((x) => x.marked < x.size).length,
      more: wrongs.filter((x) => x.marked > x.size).length,
      same: wrongs.filter((x) => x.marked === x.size).length,
      missed: wrongs.reduce((a, x) => a + x.missed, 0),
      extra: wrongs.reduce((a, x) => a + x.extra, 0),
      shifted: wrongs.filter((x) => x.shifted).length,
      medianRt: medianOrNull(rts),
      rapid: wrongs.filter((x) => !x.near && 2 * x.hits < x.size && x.rt !== null && x.rt < PATTERN_RAPID_BASE_MS + PATTERN_RAPID_MS_PER_CELL * x.marked).length,
      restarts: items.reduce((a, x) => a + x.restarts, 0),
      beforeStop: beforeStop.length,
      skippedBeforeStop: beforeStop.filter((x) => x.skipped).length,
      items,
    },
  };
}

/** En küçük düzeydeki desenlerin de hiçbiri doğru hatırlanmadı: sonuç yorumlanmaz. */
export const patternFloor = (r: PatternResult) => r.span === 0;
/**
 * Testin bittiği büyüklükten önceki desenlerin (en az altı desen) yarısında ya da daha çoğunda "Hatırlamıyorum" dendi.
 * Testin bittiği büyüklükte "Hatırlamıyorum" demek, düğmenin amacına uygundur ve sayılmaz.
 */
export const patternManySkipped = (r: PatternResult) => r.beforeStop >= 2 * PATTERN_PER_LEVEL && 2 * r.skippedBeforeStop >= r.beforeStop;
/** Bakılmadan işaretlenmiş olabilecek desenler: en az üç desen ve yanlışların en az üçte biri. */
export const patternRapid = (r: PatternResult) => r.rapid >= 3 && 3 * r.rapid >= r.attemptedWrong;
/** Desen gösterilirken başka bir uygulamaya geçildiği için en az iki kez desen baştan gösterildi. */
export const PATTERN_RESTARTS_NOTE = 2;

/** Desen hatırlamada sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, patternBlocks aynı eşikleri kullanır). */
export function patternQualityNotes(r: PatternResult): string[] {
  const notes: string[] = [];
  if (patternFloor(r)) {
    notes.push(
      `Desen hatırlama testinde en küçük (${r.start} kareli) desenlerin hiçbiri doğru hatırlanmadı; yönerge tam anlaşılmamış, desenlere bakılmamış ya da görev yarıda bırakılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
    );
  } else if (patternManySkipped(r)) {
    notes.push(
      `Desen hatırlama testinde, testin bittiği büyüklükten önceki ${r.beforeStop} desenin ${r.skippedBeforeStop === r.beforeStop ? 'hepsinde' : `${r.skippedBeforeStop} tanesinde`} “Hatırlamıyorum” denmiş; görev yarıda bırakılmış ya da dikkat başka yere kaymış olabilir. Sonuç dikkatle yorumlanmalıdır.`,
    );
  }
  if (!patternFloor(r) && patternRapid(r)) {
    notes.push(
      `Desen hatırlama testinde ${r.rapid} desen çok kısa sürede işaretlenmiş ve karelerinin çoğu yanlış; bu desenlerde kareler dikkatle işaretlenmemiş olabilir.`,
    );
  }
  if (r.restarts >= PATTERN_RESTARTS_NOTE) {
    notes.push(
      `Desen hatırlama testinde desen gösterilirken ${r.restarts} kez başka bir uygulamaya geçilmiş; bu desenler yeniden gösterildi. Desenleri birden çok kez görmek sonucu biraz yükseltebilir.`,
    );
  }
  return notes;
}

/* ---------- Üç boyutlu zihinde döndürme ---------- */

export interface Rotation3dTrialInput {
  index: number;
  /** Seçilen iki seçeneğin sırası (1–4). */
  response: number[];
  rtMs: number | null;
}

export interface Rotation3dPartResult {
  part: 1 | 2;
  n: number;
  /** İki doğru seçeneğin birlikte bulunduğu sorular. */
  correct: number;
  /** Bir doğru seçenekle bir ayna görüntüsünün seçildiği sorular. */
  half: number;
  /** İki ayna görüntüsünün birden seçildiği sorular. */
  none: number;
  medianRt: number | null;
}

export interface Rotation3dResult {
  n: number;
  correct: number;
  accuracy: number;
  half: number;
  none: number;
  /** Doğru seçilen şekiller (her soruda 0, 1 ya da 2; en çok 2n). */
  figures: number;
  parts: Rotation3dPartResult[];
  medianRt: number | null;
  /** `ROTATION3D_RAPID_MS`'den kısa sürede verilen yanlış cevaplar. */
  rapid: number;
  /** En sık seçilen yer çiftinin (ör. A ile B) kaç soruda seçildiği. */
  samePair: number;
}

/**
 * Rastgele seçimde (her soruda altı çiftten biri, doğru olma olasılığı 1/6) 20 soruda 7 ya da daha çok doğrunun olasılığı
 * %3,7'dir: 6 ya da daha az doğru, rastgele seçen birinin de bulabileceği kadar azdır.
 */
export const ROTATION3D_CHANCE_MAX = 6;
/**
 * İki ayna görüntüsünün birden seçildiği sorular: rastgele seçimde de her soruda 1/6 olasılıkla olur; 20 soruda 7 ya da
 * daha çok olmasının olasılığı %3,7'dir. Bu kadar sık görülürse ayna görüntüleri bilerek seçilmiş, yönerge ters anlaşılmış
 * ya da şekillerin derinliği ters görülmüş olabilir.
 */
export const ROTATION3D_MIRROR_NOTE = 7;
/** Beş şekle bakıp ikisini seçmek için bundan kısa bir süre yetmez. */
export const ROTATION3D_RAPID_MS = 4000;
/** İki bölümün doğru sayıları arasında en az bu kadar fark varsa bölümler arasında belirgin bir fark sayılır. */
export const ROTATION3D_PART_GAP = 3;

export function scoreRotation3d(task: MentalRotation3dTask, input: Rotation3dTrialInput[]): { result: Rotation3dResult } {
  const n = task.items.length;
  if (task.answers.length !== n) throw new TaskInputError('Cevap anahtarı eksik.');
  const byIndex = new Map<number, Rotation3dTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    const r = t.response;
    const k = task.items[t.index].options.length;
    if (!Array.isArray(r) || r.length !== 2 || r.some((x) => !Number.isInteger(x) || x < 1 || x > k) || r[0] === r[1])
      throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const hits = t.response.filter((x) => task.answers[i].includes(x)).length;
    return { part: item.part, hits, rt: t.rtMs, pair: [...t.response].sort((a, b) => a - b).join('-') };
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const parts = ([1, 2] as const).flatMap((part) => {
    const here = scored.filter((s) => s.part === part);
    return here.length
      ? [
          {
            part,
            n: here.length,
            correct: here.filter((s) => s.hits === 2).length,
            half: here.filter((s) => s.hits === 1).length,
            none: here.filter((s) => s.hits === 0).length,
            medianRt: medianOrNull(rts(here)),
          },
        ]
      : [];
  });
  const pairs = new Map<string, number>();
  for (const s of scored) pairs.set(s.pair, (pairs.get(s.pair) ?? 0) + 1);
  const correct = scored.filter((s) => s.hits === 2).length;
  return {
    result: {
      n,
      correct,
      accuracy: round(correct / n, 3),
      half: scored.filter((s) => s.hits === 1).length,
      none: scored.filter((s) => s.hits === 0).length,
      figures: scored.reduce((a, s) => a + s.hits, 0),
      parts,
      medianRt: medianOrNull(rts(scored)),
      rapid: scored.filter((s) => s.hits < 2 && s.rt !== null && s.rt < ROTATION3D_RAPID_MS).length,
      samePair: Math.max(0, ...pairs.values()),
    },
  };
}

/** Çok hızlı yanlış cevaplar: soruların en az dörtte biri. */
export const rotation3dRapid = (r: Rotation3dResult) => r.rapid >= Math.max(3, Math.ceil(r.n / 4));
/** Bundan çok doğru cevap verende aynı yer çiftinin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const ROTATION3D_SAME_MAX_CORRECT = 10;
/** Hep aynı yerdeki iki seçeneği seçme: cevapların en az yarısı aynı çift ve doğru cevaplar çok değil. */
export const rotation3dSamePair = (r: Rotation3dResult) => r.samePair >= Math.ceil(r.n / 2) && r.correct <= ROTATION3D_SAME_MAX_CORRECT;
/** İki ayna görüntüsünün birden seçildiği sorular rastgele seçimde beklenenden belirgin sık. */
export const rotation3dMirrorPick = (r: Rotation3dResult) => r.none >= ROTATION3D_MIRROR_NOTE;

/** Üç boyutlu zihinde döndürmede sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, rotation3dBlocks aynı eşikleri kullanır). */
export function rotation3dQualityNotes(r: Rotation3dResult): string[] {
  const notes: string[] = [];
  // Bazı sorularda bakmadan seçilmiş olabilirse (çok hızlı ya da hep aynı çift) iki aynalı seçimler yorumlanmaz.
  const doubt = rotation3dRapid(r) || rotation3dSamePair(r);
  const low = r.correct <= ROTATION3D_CHANCE_MAX;
  const which = r.none === r.n ? 'hepsinde' : `${r.none} tanesinde`;
  if (rotation3dMirrorPick(r) && low && !doubt) {
    notes.push(
      `Üç boyutlu zihinde döndürme testinde ${r.n} sorunun ${which} iki ayna görüntüsü birden seçilmiş; rastgele seçimde bu kadar sık olması pek beklenmez. Yönerge ters anlaşılmış, yani döndürülmüş şekiller yerine ayna görüntüleri aranmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
    );
  } else if (rotation3dMirrorPick(r) && !low && !doubt) {
    notes.push(
      `Üç boyutlu zihinde döndürme testinde ${r.n} sorunun ${which} iki ayna görüntüsü birden seçilmiş; rastgele seçimde bu kadar sık olması pek beklenmez. Bu sorularda şeklin derinliği, yani hangi kolun öne, hangisinin arkaya uzandığı ters görülmüş olabilir. Sonuç dikkatle yorumlanmalıdır.`,
    );
  } else if (low) {
    notes.push(
      'Üç boyutlu zihinde döndürme testinde doğru cevaplar, seçenekleri rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da şekillere bakılmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (rotation3dRapid(r)) {
    notes.push(
      `Üç boyutlu zihinde döndürme testinde ${r.n} sorunun ${r.rapid === r.n ? 'hepsinde' : `${r.rapid} tanesinde`} yanlış bir cevap 4 saniyeden kısa sürede verilmiş; bu sorularda şekillere bakılmadan seçilmiş olabilir.`,
    );
  }
  if (rotation3dSamePair(r)) {
    notes.push(
      'Üç boyutlu zihinde döndürme testinde cevapların yarısında ya da daha çoğunda aynı yerdeki iki seçenek seçilmiş; birçok soruda bakılmadan aynı yerlere basılmış olabilir.',
    );
  }
  return notes;
}

/* ---------- Hesapla ve hatırla (karmaşık bellek aralığı) ---------- */

export interface ComplexSpanTrialInput {
  /** Dizinin sırası (0'dan). */
  index: number;
  response: {
    /** Seçilen harfler, sırayla (harflerin listedeki sırası; "Boş" için harf sayısı). */
    recall: number[];
    /** Dizideki işlemlere verilen cevaplar: doğru/yanlış (süre dolduysa null) ve süre (ms). */
    ops: { a: boolean | null; ms: number | null }[];
    /** O dizide kullanılan işlem süre sınırı (ms). */
    limitMs: number;
  };
  /** Hatırlama ekranında geçen süre. */
  rtMs: number | null;
}

export interface ComplexSpanSizeResult {
  size: number;
  sets: number;
  letters: number;
  /** Doğru yerde hatırlanan harfler. */
  correct: number;
  /** Bütün harfleri doğru sırayla hatırlanan diziler. */
  perfect: number;
}

export interface ComplexSpanOpsResult {
  n: number;
  correct: number;
  wrong: number;
  /** Süre içinde cevaplanmayan işlemler (yanlış sayılır). */
  timeouts: number;
  accuracy: number;
  medianMs: number | null;
  /** `CS_RAPID_MS`'den kısa sürede verilen cevaplar. */
  rapid: number;
}

export interface ComplexSpanResult {
  sets: number;
  letters: number;
  /** Doğru yerde hatırlanan harfler (kısmi puan: her harf, dizinin tamamı doğru olmasa da sayılır). */
  correct: number;
  accuracy: number;
  /** Bütün harfleri doğru sırayla hatırlanan diziler ve bunlardaki harfler (tam puan). */
  perfectSets: number;
  absolute: number;
  /** Bütün harfleri doğru sırayla hatırlanan en uzun dizi. */
  longest: number | null;
  bySize: ComplexSpanSizeResult[];
  /** Doğru yerde olmayan harf yerleri: dizide olan ama yeri karışan harf, dizide olmayan harf, boş kalan yer. */
  order: number;
  intrusion: number;
  blank: number;
  ops: ComplexSpanOpsResult;
  /** İşlem süre sınırı (ms). */
  limitMs: number | null;
  medianRecallMs: number | null;
}

/** Bu testteki düzende işlemlerin en az %85'inin doğru olması beklenir (Unsworth ve ark., 2005; aktaran Đokić ve ark., 2018). */
export const CS_OPS_TARGET = 0.85;
/**
 * Rastgele basan biri her işlemi 1/2 olasılıkla doğru cevaplar: 50 işlemde 32 ya da daha çok doğrunun olasılığı %3,2'dir.
 * 31 ya da daha az doğru, rastgele basan birinin de bulabileceği kadar azdır.
 */
export const CS_OPS_CHANCE_MAX = 31;
/**
 * Harfleri rastgele seçen biri bir yeri yaklaşık 1/12 olasılıkla doğru bulur: 50 yerde 9 ya da daha çok doğrunun olasılığı
 * %2,1'dir. 8 ya da daha az doğru, rastgele seçimde de görülebilir.
 */
export const CS_RECALL_CHANCE_MAX = 8;
/** Bir işlemi okuyup hesaplamak için bundan kısa bir süre yetmez. */
export const CS_RAPID_MS = 500;

export function scoreComplexSpan(task: ComplexSpanTask, input: ComplexSpanTrialInput[]): { result: ComplexSpanResult } {
  const n = task.sets.length;
  const blank = blankOf(task);
  const byIndex = new Map<number, ComplexSpanTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz dizi.');
    const set = task.sets[t.index];
    const r = t.response;
    if (!r || typeof r !== 'object' || !Array.isArray(r.recall) || !Array.isArray(r.ops)) throw new TaskInputError('Geçersiz cevap.');
    if (r.recall.length > set.letters.length || r.recall.some((x) => !Number.isInteger(x) || x < 0 || x > blank)) throw new TaskInputError('Geçersiz cevap.');
    if (r.ops.length !== set.ops.length) throw new TaskInputError('Geçersiz cevap.');
    for (const o of r.ops) {
      if (!o || (o.a !== null && typeof o.a !== 'boolean')) throw new TaskInputError('Geçersiz cevap.');
      if (o.ms !== null && (!Number.isFinite(o.ms) || o.ms < 0)) throw new TaskInputError('Geçersiz süre.');
    }
    if (!Number.isFinite(r.limitMs) || r.limitMs < task.limit.minMs || r.limitMs > task.limit.maxMs) throw new TaskInputError('Geçersiz süre sınırı.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Dizilerin hepsi cevaplanmadı.');

  let correct = 0;
  let order = 0;
  let intrusion = 0;
  let blankN = 0;
  const sizes = new Map<number, ComplexSpanSizeResult>();
  const opMs: number[] = [];
  const recallMs: number[] = [];
  const ops = { n: 0, correct: 0, wrong: 0, timeouts: 0, rapid: 0 };
  let limitMs: number | null = null;
  task.sets.forEach((set, i) => {
    const t = byIndex.get(i)!;
    const size = set.letters.length;
    let here = 0;
    for (let k = 0; k < size; k++) {
      const x = t.response.recall[k];
      if (x === set.letters[k]) here++;
      else if (x === undefined || x === blank) blankN++;
      else if (set.letters.includes(x)) order++;
      else intrusion++;
    }
    correct += here;
    const s = sizes.get(size) ?? { size, sets: 0, letters: 0, correct: 0, perfect: 0 };
    s.sets++;
    s.letters += size;
    s.correct += here;
    if (here === size) s.perfect++;
    sizes.set(size, s);
    set.ops.forEach((op, k) => {
      const o = t.response.ops[k];
      ops.n++;
      if (o.a === null) ops.timeouts++;
      else if (o.a === opTrue(op)) ops.correct++;
      else ops.wrong++;
      if (o.a !== null && o.ms !== null) {
        opMs.push(o.ms);
        if (o.ms < CS_RAPID_MS) ops.rapid++;
      }
    });
    if (t.rtMs !== null) recallMs.push(t.rtMs);
    limitMs = t.response.limitMs;
  });
  const bySize = [...sizes.values()].sort((a, b) => a.size - b.size);
  const letters = task.sets.reduce((s, x) => s + x.letters.length, 0);
  const perfect = bySize.filter((s) => s.perfect > 0);
  return {
    result: {
      sets: n,
      letters,
      correct,
      accuracy: round(correct / letters, 3),
      perfectSets: bySize.reduce((s, x) => s + x.perfect, 0),
      absolute: bySize.reduce((s, x) => s + x.perfect * x.size, 0),
      longest: perfect.length ? perfect[perfect.length - 1].size : null,
      bySize,
      order,
      intrusion,
      blank: blankN,
      ops: { ...ops, accuracy: round(ops.correct / ops.n, 3), medianMs: medianOrNull(opMs) },
      limitMs,
      medianRecallMs: medianOrNull(recallMs),
    },
  };
}

/** İşlemler rastgele basan birinin de bulabileceği kadar az doğru. */
export const complexSpanOpsChance = (r: ComplexSpanResult) => r.ops.correct <= CS_OPS_CHANCE_MAX;
/** İşlemlerin en az beşte birine yarım saniyeden kısa sürede cevap verilmiş. */
export const complexSpanRapid = (r: ComplexSpanResult) => r.ops.rapid >= Math.ceil(r.ops.n / 5);
/** Doğru yerde hatırlanan harfler rastgele seçimde de görülebilecek kadar az. */
export const complexSpanRecallChance = (r: ComplexSpanResult) => r.correct <= CS_RECALL_CHANCE_MAX;

/**
 * Hesapla ve hatırlada sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, complexSpanBlocks aynı eşikleri
 * kullanır). Harfler rastgele seçimdeki kadar azsa harf sonucu zaten yorumlanmaz; işlem notları o zaman harf sonucu için
 * ayrıca bir şey söylemez.
 */
export function complexSpanQualityNotes(r: ComplexSpanResult): string[] {
  const notes: string[] = [];
  const recallChance = complexSpanRecallChance(r);
  if (recallChance) {
    notes.push(
      'Hesapla ve hatırla testinde doğru yerde hatırlanan harfler, harfleri rastgele seçen birinin de bulabileceği kadar az; yönerge tam anlaşılmamış, harfler boş bırakılmış ya da görev yarıda bırakılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (complexSpanOpsChance(r)) {
    notes.push(
      `Hesapla ve hatırla testinde ${r.ops.n} işlemin ${r.ops.correct === 0 ? 'hiçbiri süresi içinde doğru cevaplanmamış' : `yalnızca ${r.ops.correct === 1 ? 'biri' : `${r.ops.correct} tanesi`} süresi içinde doğru cevaplanmış`}; bu, rastgele basan birinin de bulabileceği kadar az.${
        recallChance ? '' : ' İşlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu yorumlanmamalıdır.'
      }`,
    );
  } else if (complexSpanRapid(r)) {
    notes.push(
      `Hesapla ve hatırla testinde ${r.ops.n} işlemin ${r.ops.rapid === r.ops.n ? 'hepsine' : `${r.ops.rapid} tanesine`} yarım saniyeden kısa sürede cevap verilmiş; bu işlemlere bakılmadan basılmış olabilir.${
        recallChance ? '' : ' İşlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu dikkatle yorumlanmalıdır.'
      }`,
    );
  }
  return notes;
}

/* ---------- Bakış açısı alma ---------- */

export interface PerspectiveTrialInput {
  /** Sorunun sırası (0'dan). */
  index: number;
  /** Gösterilen yön (derece, −180–180; 0 ileri, saat yönünde) ya da cevapsız (`null`). */
  response: { deg: number } | null;
  rtMs: number | null;
}

export interface PerspectiveItemResult {
  index: number;
  /** Zihinde dönülmesi gereken açı (işaretli; bakılan nesnenin ekranın yukarısıyla yaptığı açı). */
  shift: number;
  correct: number;
  response: number | null;
  /** Mutlak açı hatası (0–180); cevapsız soruda 90 (rastgele düzeyi). */
  error: number;
  /** Cevap, haritaya göre cevabın ±`PA_ZONE` yakınında ve doğru cevaptan uzak (yalnızca dönüşü en az 45 derece olan sorularda). */
  ego: boolean;
  /** Cevap, sağ ile solun karıştırıldığı yönün ±`PA_ZONE` yakınında ve doğru cevaptan uzak. */
  mirror: boolean;
  rt: number | null;
}

export interface PerspectiveGroupResult {
  n: number;
  /** Ortalama mutlak hata (derece, bir ondalık). */
  meanError: number;
}

export interface PerspectiveResult {
  n: number;
  answered: number;
  meanError: number;
  /** Hatası `PA_CLOSE` derece ya da daha az olan sorular. */
  close: number;
  /** Dönüşü en çok 90 derece olan sorular ve 90 dereceden büyük olanlar. */
  small: PerspectiveGroupResult;
  large: PerspectiveGroupResult;
  /** Dönüş açısı gruplarına göre (0–45, 45–90, 90–135, 135–180). */
  bins: (PerspectiveGroupResult & { from: number; to: number })[];
  ego: { eligible: number; count: number };
  mirror: { eligible: number; count: number };
  /** Hata türlerinden birine girmeyen sorular (cevapsızlar dahil) ve ortalama hataları: yüksek hatayı hata türü mü açıklıyor? */
  rest: PerspectiveGroupResult;
  medianRt: number | null;
  /** `PA_RAPID_MS`'den kısa sürede verilen ve 45 dereceden çok hatalı cevaplar (cevapsız sorular sayılmaz). */
  rapid: number;
  /**
   * En kalabalık 30 derecelik dilimdeki cevap sayısı: bir cevabın 15 derece sağı ve solu içinde kalan cevaplar (o cevap
   * dahil), en çoğu alınır (hep aynı yönü göstermek).
   */
  sameDir: number;
  items: PerspectiveItemResult[];
}

/**
 * Rastgele gösterilen bir yönün hatası 0–180 arasında eşit olasılıklıdır (ortalama 90). 12 soruda rastgele gösterilen
 * yönlerin ortalama hatasının 65 derece ya da altında olma olasılığı %4,8'dir (Irwin–Hall dağılımı; testte hesaplanır):
 * 65'in üstündeki bir ortalama, rastgele gösterilen yönlerden belirgin biçimde ayrılmaz.
 */
export const PA_CHANCE_MEAN = 65;
/**
 * Rastgele bir cevabın belirli bir 40 derecelik dilime düşme olasılığı 1/9'dur. Haritaya göre cevap (10 uygun soruda) ya da
 * sağ-sol karışıklığı (12 soruda) en az 4 soruda görülürse rastlantı pek açıklamaz (olasılık %1,8 ve %3,6).
 */
export const PA_PATTERN_MIN = 4;
/** Yüksek hatanın hata türüyle açıklanıp açıklanmadığına bakarken bir cevabın o türe uyduğu sayılan genişlik (derece). */
export const PA_FIT = 45;
/** Soruyu okuyup oku yerleştirmek için bundan kısa süre yetmez. */
export const PA_RAPID_MS = 3000;
/** Hep aynı yönü gösterme: cevapların en az bu kadarı birbirine 15 dereceden yakın. */
export const PA_SAME_DIR = 8;

const mean1 = (xs: number[]) => (xs.length ? round(xs.reduce((a, b) => a + b, 0) / xs.length, 1) : 0);
/** "12 sorunun hepsinde" ya da "12 sorunun 5 tanesinde" (rapor kartları da aynı biçimi kullanır). */
export const paOf = (k: number, n: number) => `${n} sorunun ${k === n ? 'hepsinde' : `${k} tanesinde`}`;

export function scorePerspective(task: PerspectiveTask, input: PerspectiveTrialInput[]): { result: PerspectiveResult } {
  const n = task.items.length;
  const byIndex = new Map<number, PerspectiveTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (t.response !== null && (typeof t.response !== 'object' || !Number.isFinite(t.response.deg) || t.response.deg < -180 || t.response.deg > 180))
      throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const items: PerspectiveItemResult[] = task.items.map((item, index) => {
    const t = byIndex.get(index)!;
    const shift = headingOf(task.objects, item);
    const correct = correctAngle(task.objects, item);
    const response = t.response === null ? null : t.response.deg;
    const error = response === null ? 90 : angleDiff(response, correct);
    const far = error > PA_ZONE;
    const ego = response !== null && Math.abs(shift) >= PA_EGO_MIN_SHIFT && far && angleDiff(response, egocentricAngle(task.objects, item)) <= PA_ZONE;
    const mirror = response !== null && far && angleDiff(response, mirrorAngle(task.objects, item)) <= PA_ZONE;
    return { index, shift: round(shift, 1), correct: round(correct, 1), response, error: round(error, 1), ego, mirror, rt: t.rtMs };
  });
  const errs = (xs: PerspectiveItemResult[]) => xs.map((x) => x.error);
  const small = items.filter((x) => Math.abs(x.shift) <= PA_SMALL_MAX);
  const large = items.filter((x) => Math.abs(x.shift) > PA_SMALL_MAX);
  const answers = items.flatMap((x) => (x.response === null ? [] : [x.response]));
  const sameDir = Math.max(0, ...answers.map((a) => answers.filter((b) => angleDiff(a, b) <= 15).length));
  const rts = items.flatMap((x) => (x.rt === null ? [] : [x.rt]));
  return {
    result: {
      n,
      answered: answers.length,
      meanError: mean1(errs(items)),
      close: items.filter((x) => x.error <= PA_CLOSE).length,
      small: { n: small.length, meanError: mean1(errs(small)) },
      large: { n: large.length, meanError: mean1(errs(large)) },
      bins: PA_SHIFT_BINS.map(([from, to], k) => {
        const here = items.filter((x) => shiftBin(x.shift) === k);
        return { from, to, n: here.length, meanError: mean1(errs(here)) };
      }),
      ego: { eligible: items.filter((x) => Math.abs(x.shift) >= PA_EGO_MIN_SHIFT).length, count: items.filter((x) => x.ego).length },
      mirror: { eligible: n, count: items.filter((x) => x.mirror).length },
      rest: (() => {
        // Belirgin bir hata türü varsa (en az PA_PATTERN_MIN soru), o türün yönüne ±PA_FIT derece içinde kalan ve doğru
        // yöne ondan daha uzak olan cevaplar da o türe uyar sayılır: aynı yolla çözen birinin oku her soruda tam o yöne
        // düşmeyebilir. Sayım ±PA_ZONE ile yapılır; bu yalnızca yüksek hatanın hata türüyle açıklanıp açıklanmadığı içindir.
        const egoOn = items.filter((x) => x.ego).length >= PA_PATTERN_MIN;
        const mirrorOn = items.filter((x) => x.mirror).length >= PA_PATTERN_MIN;
        const fits = (x: PerspectiveItemResult, dir: number) =>
          x.response !== null && angleDiff(x.response, dir) <= PA_FIT && angleDiff(x.response, dir) < x.error;
        const rest = items.filter(
          (x) =>
            !(egoOn && Math.abs(x.shift) >= PA_EGO_MIN_SHIFT && fits(x, normDeg(x.correct + x.shift))) && !(mirrorOn && fits(x, normDeg(-x.correct))),
        );
        return { n: rest.length, meanError: mean1(errs(rest)) };
      })(),
      medianRt: medianOrNull(rts),
      rapid: items.filter((x) => x.response !== null && x.rt !== null && x.rt < PA_RAPID_MS && x.error > 45).length,
      sameDir,
      items,
    },
  };
}

/** Haritaya göre cevaplar rastlantının pek açıklamayacağı kadar sık. */
export const perspectiveEgo = (r: PerspectiveResult) => r.ego.count >= PA_PATTERN_MIN;
/** Sağ ile solun karıştırıldığı cevaplar rastlantının pek açıklamayacağı kadar sık. */
export const perspectiveMirror = (r: PerspectiveResult) => r.mirror.count >= PA_PATTERN_MIN;
/** Çok hızlı ve çok hatalı cevaplar: soruların en az dörtte biri. */
export const perspectiveRapid = (r: PerspectiveResult) => r.rapid >= Math.max(3, Math.ceil(r.n / 4));
/** Hep aynı yönü gösterme. */
export const perspectiveSameDir = (r: PerspectiveResult) => r.sameDir >= PA_SAME_DIR;
/** Bazı sorularda düşünmeden ya da soruya bakmadan cevap verilmiş olabilir: hata türleri ve karşılaştırmalar yorumlanmaz. */
export const perspectiveDoubt = (r: PerspectiveResult) => perspectiveRapid(r) || perspectiveSameDir(r);
/**
 * Yüksek hatayı hata türü açıklıyor: türe giren cevaplar çıkarılınca kalan soruların ortalama hatası rastgele düzeyinin
 * altında (ör. dört soruda haritaya göre yön, sekiz soruda rastgele yönler gösterildiyse açıklamaz).
 */
const perspectiveExplained = (r: PerspectiveResult) => r.rest.n === 0 || r.rest.meanError <= PA_CHANCE_MEAN;
/**
 * Ortalama hata rastgele gösterilen yönlerden belirgin biçimde ayrılmıyor ve bunu açıklayan bir hata türü de yok (ya da
 * bazı sorularda düşünmeden cevap verilmiş olabileceği için hata türü yorumlanmıyor).
 */
export const perspectiveChance = (r: PerspectiveResult) =>
  r.meanError > PA_CHANCE_MEAN && (perspectiveDoubt(r) || (!perspectiveEgo(r) && !perspectiveMirror(r)) || !perspectiveExplained(r));
/** Ortalama hata yüksek ama yanlışlar belirli bir türde toplanıyor: yönerge farklı anlaşılmış olabilir. */
export const perspectivePatternHigh = (r: PerspectiveResult) => r.meanError > PA_CHANCE_MEAN && !perspectiveChance(r);

/** Bakış açısı almada sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, perspectiveBlocks aynı eşikleri kullanır). */
export function perspectiveQualityNotes(r: PerspectiveResult): string[] {
  const notes: string[] = [];
  if (perspectiveChance(r)) {
    notes.push(
      'Bakış açısı alma testinde gösterilen yönler, rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da yönler düşünülmeden gösterilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  } else if (perspectivePatternHigh(r)) {
    const ego = `zihinde en az ${PA_EGO_MIN_SHIFT} derece dönmeyi gerektiren ${paOf(r.ego.count, r.ego.eligible)} haritaya yukarıdan bakar gibi`;
    const mirror = `${paOf(r.mirror.count, r.n)} doğru açıyla ama ters tarafa (sağ yerine sol ya da sol yerine sağ)`;
    const both = perspectiveEgo(r) && perspectiveMirror(r);
    notes.push(
      `Bakış açısı alma testinde yön, ${both ? `${ego}, ${mirror}` : perspectiveEgo(r) ? ego : mirror} gösterilmiş. ${
        both ? 'Yönerge farklı anlaşılmış ya da sağ ile sol karıştırılmış' : perspectiveEgo(r) ? 'Yönerge farklı anlaşılmış' : 'Sağ ile sol karıştırılmış'
      } olabileceği için ortalama hata yorumlanmamalıdır; yalnızca yanlışların türü anlatılır.`,
    );
  }
  if (perspectiveRapid(r)) {
    notes.push(
      `Bakış açısı alma testinde ${paOf(r.rapid, r.n)} çok hatalı bir yön 3 saniyeden kısa sürede gösterilmiş; bu sorularda düşünmeden cevap verilmiş olabilir.`,
    );
  }
  if (perspectiveSameDir(r)) {
    notes.push(
      `Bakış açısı alma testinde ${paOf(r.sameDir, r.n)} hemen hemen aynı yön gösterilmiş; sorulara bakılmadan cevap verilmiş olabilir.`,
    );
  }
  return notes;
}

/* ---------- Düşünerek karar verme ---------- */

export interface ReflectionTrialInput {
  index: number;
  /** Seçilen seçeneğin sırası (1–4). */
  response: number;
  rtMs: number | null;
}

/** Bir soru grubunda doğru, tuzak (tuzaklı soruda ilk akla gelen cevap; tuzaksız soruda tuzak varmış gibi cevap) ve başka yanlış sayıları. */
export interface ReflectionGroup {
  n: number;
  correct: number;
  lure: number;
  other: number;
}

export interface ReflectionResult {
  n: number;
  correct: number;
  /** Tuzaklı sorular: hepsi, sayısal ve sözel. */
  lure: ReflectionGroup;
  numLure: ReflectionGroup;
  verbLure: ReflectionGroup;
  /** Tuzaksız eş sorular: hepsi, sayısal ve sözel. */
  control: ReflectionGroup;
  numControl: ReflectionGroup;
  verbControl: ReflectionGroup;
  /** Eşli soru sayısı; tuzaksızı doğru, tuzaklısında ilk akla gelen cevap; ikisi de doğru. */
  pairs: number;
  pairControlOnly: number;
  pairBoth: number;
  medianRt: number | null;
  /** Tuzaklı sorularda doğru cevapların ve ilk akla gelen cevapların tipik süresi (en az üç cevap varsa). */
  rtLureCorrect: number | null;
  rtLureIntuitive: number | null;
  /** Soru ve seçenekleri okumaya yetmeyecek kadar kısa sürede verilen cevaplar ve bunların doğru olanları. */
  rapid: number;
  rapidCorrect: number;
  samePosition: number;
}

/** Tuzaksız eş sorularda bu kadar ya da daha az doğru: sonuç dikkatle yorumlanır. */
export const REFLECTION_CONTROL_LOW = 5;
/** Tuzaksız eş sorularda bu kadar ya da daha az doğru (ve yanlışlar çoğunlukla tuzak aramaktan değilse): sonuç yorumlanmaz. */
export const REFLECTION_CONTROL_NONE = 3;
/** Tuzaksız sorularda tuzak varmış gibi en az bu kadar ve başka yanlışlardan çok cevap: "her yerde tuzak aramak" anlatılır. */
export const REFLECTION_TRAP_NOTE = 2;
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const REFLECTION_SAME_MAX_CORRECT = 15;
/** Tipik sürelerin karşılaştırılması için en az bu kadar cevap gerekir. */
export const REFLECTION_RT_MIN = 3;

export function scoreReflection(task: CognitiveReflectionTask, input: ReflectionTrialInput[]): { result: ReflectionResult } {
  const n = task.items.length;
  if (task.answers.length !== n || task.roles.length !== n || task.domains.length !== n || task.lures.length !== n || task.pairs.length !== n) {
    throw new TaskInputError('Cevap anahtarı eksik.');
  }
  const byIndex = new Map<number, ReflectionTrialInput>();
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz soru.');
    if (!Number.isInteger(t.response) || t.response < 1 || t.response > task.items[t.index].options.length) throw new TaskInputError('Geçersiz cevap.');
    if (t.rtMs !== null && (!Number.isFinite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Soruların hepsi cevaplanmadı.');
  const scored = task.items.map((item, i) => {
    const t = byIndex.get(i)!;
    const kind: 'correct' | 'lure' | 'other' = t.response === task.answers[i] ? 'correct' : t.response === task.lures[i] ? 'lure' : 'other';
    return { i, item, kind, role: task.roles[i], domain: task.domains[i], response: t.response, rt: t.rtMs };
  });
  const group = (xs: typeof scored): ReflectionGroup => ({
    n: xs.length,
    correct: xs.filter((s) => s.kind === 'correct').length,
    lure: xs.filter((s) => s.kind === 'lure').length,
    other: xs.filter((s) => s.kind === 'other').length,
  });
  const lures = scored.filter((s) => s.role === 'lure');
  const controls = scored.filter((s) => s.role === 'control');
  const pairsOf = controls.flatMap((c) => {
    const j = task.pairs[c.i];
    return j === null ? [] : [{ control: c, lure: scored[j] }];
  });
  const rts = (xs: typeof scored) => xs.flatMap((s) => (s.rt === null ? [] : [s.rt]));
  const enough = (xs: number[]) => (xs.length >= REFLECTION_RT_MIN ? medianOrNull(xs) : null);
  const fast = scored.filter((s) => s.rt !== null && s.rt < reflectionRapidMs(s.item));
  const positions = new Map<number, number>();
  for (const s of scored) positions.set(s.response, (positions.get(s.response) ?? 0) + 1);
  return {
    result: {
      n,
      correct: scored.filter((s) => s.kind === 'correct').length,
      lure: group(lures),
      numLure: group(lures.filter((s) => s.domain === 'num')),
      verbLure: group(lures.filter((s) => s.domain === 'verb')),
      control: group(controls),
      numControl: group(controls.filter((s) => s.domain === 'num')),
      verbControl: group(controls.filter((s) => s.domain === 'verb')),
      pairs: pairsOf.length,
      pairControlOnly: pairsOf.filter((p) => p.control.kind === 'correct' && p.lure.kind === 'lure').length,
      pairBoth: pairsOf.filter((p) => p.control.kind === 'correct' && p.lure.kind === 'correct').length,
      medianRt: medianOrNull(rts(scored)),
      rtLureCorrect: enough(rts(lures.filter((s) => s.kind === 'correct'))),
      rtLureIntuitive: enough(rts(lures.filter((s) => s.kind === 'lure'))),
      rapid: fast.length,
      rapidCorrect: fast.filter((s) => s.kind === 'correct').length,
      samePosition: Math.max(0, ...positions.values()),
    },
  };
}

/**
 * Tuzaksız eş soruların da çoğu yanlış ve bu yanlışlar çoğunlukla tuzak aramaktan değil: sonuç yorumlanmaz. Rastgele seçen
 * biri tuzaksız soruların yaklaşık dörtte birinde tuzak seçeneğini de seçer; bu yüzden tuzak seçeneği başka yanlışlardan
 * çok olmadıkça tuzak arama sayılmaz.
 */
export const reflectionChance = (r: ReflectionResult) => r.control.correct <= REFLECTION_CONTROL_NONE && r.control.lure <= r.control.other;
/** Tuzaksız sorularda tuzak varmış gibi cevap: en az iki ve başka yanlışlardan çok. */
export const reflectionSuspicious = (r: ReflectionResult) => !reflectionChance(r) && r.control.lure >= REFLECTION_TRAP_NOTE && r.control.lure > r.control.other;
/** Tuzaksız eş soruların bir kısmı da yanlış: sonuç dikkatle yorumlanır. */
export const reflectionControlLow = (r: ReflectionResult) => !reflectionChance(r) && r.control.correct <= REFLECTION_CONTROL_LOW;
/** Soruların en az dörtte biri okumaya yetmeyecek kadar kısa sürede ve bu cevapların dörtte üçünden azı doğru. */
export const reflectionRapid = (r: ReflectionResult) => r.rapid >= Math.ceil(r.n / 4) && r.rapidCorrect < 0.75 * r.rapid;
/** Cevapların en az yarısı aynı sırada ve doğru cevaplar çok değil. */
export const reflectionSamePosition = (r: ReflectionResult) => r.samePosition >= Math.ceil(r.n / 2) && r.correct <= REFLECTION_SAME_MAX_CORRECT;

/** Düşünerek karar vermede sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, reflectionBlocks aynı eşikleri kullanır). */
export function reflectionQualityNotes(r: ReflectionResult): string[] {
  const notes: string[] = [];
  if (reflectionChance(r)) {
    notes.push(
      `Düşünerek karar verme testinde tuzaksız eş soruların da çoğu (${r.control.n} sorunun ${r.control.n - r.control.correct} tanesi) yanlış cevaplanmış; sorular dikkatle okunmamış ya da rastgele seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
    );
  } else if (reflectionControlLow(r)) {
    notes.push(
      reflectionSuspicious(r)
        ? `Düşünerek karar verme testinde tuzaksız eş soruların ${r.control.n - r.control.correct} tanesi yanlış cevaplanmış; bunların ${r.control.other === 0 ? 'hepsinde' : `${r.control.lure} tanesinde`} tuzak olmadığı hâlde tuzak varmış gibi cevap verilmiş. Sonuç dikkatle yorumlanmalıdır.`
        : `Düşünerek karar verme testinde tuzaksız eş soruların ${r.control.n - r.control.correct} tanesi yanlış cevaplanmış; tuzaklı sorulardaki yanlışların bir kısmı da dikkatin dağılmasından ya da soruyu yanlış okumaktan kaynaklanmış olabilir. Sonuç dikkatle yorumlanmalıdır.`,
    );
  }
  if (reflectionRapid(r)) {
    notes.push(
      `Düşünerek karar verme testinde ${r.n} sorunun ${r.rapid} tanesinde cevap, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verilmiş ve ${r.rapidCorrect === 0 ? 'bu cevapların hiçbiri doğru değil' : `bu cevapların yalnızca ${r.rapidCorrect} tanesi doğru`}; bu sorulara okumadan cevap verilmiş olabilir.`,
    );
  }
  if (reflectionSamePosition(r)) {
    notes.push('Düşünerek karar verme testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/* ---------- Kule görevi ---------- */

export interface TowerTrialInput {
  index: number;
  /**
   * Hamleler (10 × nereden + nereye, çubuklar 1–3), her hamlenin bittiği an ve ilk topun alındığı an (problem ekrana
   * geldikten sonra geçen ms; sayfa gizliyken geçen süre sayılmaz). Hedefe ulaşılınca problem biter.
   */
  response: { moves: number[]; times: number[]; pick: number | null };
  rtMs: number | null;
}

/** Problemin sonucu: en az hamlede çözüldü, fazla hamleyle çözüldü ya da süre içinde çözülemedi. */
export type TowerOutcome = 'optimal' | 'extra' | 'unsolved';

export interface TowerLevel {
  /** Problemlerin en az hamle sayısı. */
  moves: number;
  n: number;
  optimal: number;
  extra: number;
  unsolved: number;
  /** Hiç top taşınmadan süresi dolan problemler. */
  idle: number;
}

export interface TowerResult {
  n: number;
  optimal: number;
  extra: number;
  unsolved: number;
  /** Hiç top taşınmadan süresi dolan problemler. */
  idle: number;
  levels: TowerLevel[];
  /** Kısa (en çok 4 hamle) ve uzun (en az 6 hamle) problemlerde en az hamlede çözülenler ve hiç top taşınmayanlar. */
  short: { n: number; optimal: number; idle: number };
  long: { n: number; optimal: number; idle: number };
  /** Fazla hamleyle çözülen problemlerde en az hamlenin üstünde yapılan hamlelerin toplamı. */
  excessMoves: number;
  /** İlk topun alınmasına kadar geçen tipik süre (ms): bütün problemlerde, kısa ve uzun problemlerde. */
  medianPick: number | null;
  pickShort: number | null;
  pickLong: number | null;
  /**
   * Ön planlama payı (%): çözülen her problemde ilk topa kadar geçen sürenin bütün çözüm süresine oranı, problemlerin
   * ortalaması (Schumacher ve ark., 2026). En az `TOWER_PREPLAN_MIN` problem çözülmediyse `null`.
   */
  prePlan: number | null;
  /** 5 hamle ve üstündeki problemler; bunlardan ilk topun `TOWER_RAPID_MS`'den önce alındığı ve en az hamlede çözülemeyenler. */
  rapidOf: number;
  rapid: number;
  /** Problem başına sonuç (sırayla). */
  outcomes: TowerOutcome[];
}

/** Kısa problemler en çok bu kadar, uzun problemler en az `TOWER_LONG` hamlelik problemlerdir. */
export const TOWER_SHORT = 4;
export const TOWER_LONG = 6;
/** Bu kadar ya da daha uzun problemlerde ilk topu çok çabuk almak "düşünmeden başlamak" sayılabilir. */
export const TOWER_RAPID_FROM = 5;
/** İlk topun alınması için bundan kısa süre, 5 hamle ve üstündeki bir problemi kafada çözmeye yetmez. */
export const TOWER_RAPID_MS = 2000;
/** Tipik sürenin hesaplanması için en az bu kadar problem gerekir. */
export const TOWER_PICK_MIN = 3;
/** Ön planlama payı için en az bu kadar çözülmüş problem gerekir. */
export const TOWER_PREPLAN_MIN = 5;
/** Bu kadar problemde hiç top taşınmadıysa sonuç dikkatle yorumlanır. */
export const TOWER_IDLE_NOTE = 3;

export function scoreTower(task: TowerTask, input: TowerTrialInput[]): { result: TowerResult } {
  const n = task.items.length;
  const byIndex = new Map<number, TowerTrialInput>();
  const finite = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
  for (const t of input) {
    if (!Number.isInteger(t.index) || t.index < 0 || t.index >= n) throw new TaskInputError('Geçersiz problem.');
    const r = t.response as Partial<TowerTrialInput['response']> | null;
    if (!r || typeof r !== 'object' || !Array.isArray(r.moves) || !Array.isArray(r.times) || r.moves.length !== r.times.length) {
      throw new TaskInputError('Geçersiz cevap.');
    }
    if (r.moves.length > TOWER_MAX_MOVES) throw new TaskInputError('Geçersiz cevap.');
    if (r.pick !== null && (!finite(r.pick) || r.pick < 0 || r.pick > task.limitMs)) throw new TaskInputError('Geçersiz süre.');
    let prev = r.pick ?? 0;
    for (const x of r.times) {
      if (!finite(x) || x < prev || x > task.limitMs) throw new TaskInputError('Geçersiz süre.');
      prev = x;
    }
    // İlk top süresi, taşınan ilk topun alındığı andır: hamle varsa vardır, hamle yoksa yoktur.
    if ((r.moves.length > 0) !== (r.pick !== null)) throw new TaskInputError('Geçersiz süre.');
    if (t.rtMs !== null && (!finite(t.rtMs) || t.rtMs < 0)) throw new TaskInputError('Geçersiz süre.');
    if (!byIndex.has(t.index)) byIndex.set(t.index, t);
  }
  if (byIndex.size !== n) throw new TaskInputError('Problemlerin hepsi tamamlanmadı.');

  const scored = task.items.map((item, i) => {
    const { moves, times, pick } = byIndex.get(i)!.response;
    let state = item.start;
    let solved = false;
    for (const code of moves) {
      if (solved) throw new TaskInputError('Hedefe ulaşıldıktan sonra hamle yapılamaz.');
      const mv = towerDecode(code);
      const next = mv ? towerMove(state, mv[0], mv[1]) : null;
      if (!next) throw new TaskInputError('Kurala aykırı hamle.');
      state = next;
      solved = towerSame(state, item.goal);
    }
    // En az hamleden kısa bir çözüm olamaz: olursa problemin en az hamle sayısı yanlıştır.
    if (solved && moves.length < item.minMoves) throw new TaskInputError('Geçersiz çözüm.');
    const outcome: TowerOutcome = !solved ? 'unsolved' : moves.length === item.minMoves ? 'optimal' : 'extra';
    return { item, outcome, moves: moves.length, pick, end: solved ? times[times.length - 1] : null };
  });

  const count = (xs: typeof scored, o: TowerOutcome) => xs.filter((s) => s.outcome === o).length;
  const idleOf = (xs: typeof scored) => xs.filter((s) => s.moves === 0).length;
  const levels = [...new Set(task.items.map((it) => it.minMoves))]
    .sort((a, b) => a - b)
    .map((moves) => {
      const here = scored.filter((s) => s.item.minMoves === moves);
      return { moves, n: here.length, optimal: count(here, 'optimal'), extra: count(here, 'extra'), unsolved: count(here, 'unsolved'), idle: idleOf(here) };
    });
  const picks = (xs: typeof scored) => xs.flatMap((s) => (s.pick === null ? [] : [s.pick]));
  const shortOnes = scored.filter((s) => s.item.minMoves <= TOWER_SHORT);
  const longOnes = scored.filter((s) => s.item.minMoves >= TOWER_LONG);
  const hard = scored.filter((s) => s.item.minMoves >= TOWER_RAPID_FROM);
  const shares = scored.flatMap((s) => (s.end !== null && s.end > 0 && s.pick !== null ? [s.pick / s.end] : []));
  return {
    result: {
      n,
      optimal: count(scored, 'optimal'),
      extra: count(scored, 'extra'),
      unsolved: count(scored, 'unsolved'),
      idle: idleOf(scored),
      levels,
      short: { n: shortOnes.length, optimal: count(shortOnes, 'optimal'), idle: idleOf(shortOnes) },
      long: { n: longOnes.length, optimal: count(longOnes, 'optimal'), idle: idleOf(longOnes) },
      excessMoves: scored.reduce((sum, s) => sum + (s.outcome === 'extra' ? s.moves - s.item.minMoves : 0), 0),
      medianPick: medianOrNull(picks(scored), TOWER_PICK_MIN),
      pickShort: medianOrNull(picks(shortOnes), TOWER_PICK_MIN),
      pickLong: medianOrNull(picks(longOnes), TOWER_PICK_MIN),
      prePlan: shares.length >= TOWER_PREPLAN_MIN ? Math.round((100 * shares.reduce((a, b) => a + b, 0)) / shares.length) : null,
      rapidOf: hard.length,
      rapid: hard.filter((s) => s.pick !== null && s.pick < TOWER_RAPID_MS && s.outcome !== 'optimal').length,
      outcomes: scored.map((s) => s.outcome),
    },
  };
}

/**
 * Problemlerin yarısında ya da daha çoğunda ve kısa problemlerin de yarısında (ya da bütün problemlerin dörtte üçünde) hiç
 * top taşınmadı: sonuç yorumlanmaz. Hiç top taşınmayan problemler yalnızca uzun problemlerse, çözüm kafada aranırken süre
 * yetmemiş olabilir (yönergeye uygun olarak önce düşünen biri); birkaç kısa problemde top taşınmayıp ötekiler çözüldüyse de
 * görev anlaşılmıştır. Bu durumlarda sonuç dikkatle yorumlanır (`towerIdle`).
 */
export const towerNone = (r: TowerResult) =>
  (r.idle >= Math.ceil(r.n / 2) && r.short.idle >= Math.ceil(r.short.n / 2)) || r.idle >= Math.ceil((3 * r.n) / 4);
/** Birkaç problemde hiç top taşınmadı: sonuç dikkatle yorumlanır. */
export const towerIdle = (r: TowerResult) => !towerNone(r) && r.idle >= TOWER_IDLE_NOTE;
/** 5 hamle ve üstündeki problemlerin en az üçte birinde ilk top çok çabuk alındı ve problem en az hamlede çözülemedi. */
export const towerRapid = (r: TowerResult) => r.rapidOf > 0 && r.rapid >= Math.max(2, Math.ceil(r.rapidOf / 3));

/** Kule görevinde sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, towerBlocks aynı eşikleri kullanır). */
export function towerQualityNotes(r: TowerResult): string[] {
  if (towerNone(r)) {
    return [
      `Kule görevinde ${r.n} problemin ${r.idle} tanesinde hiç top taşınmadan süre dolmuş; bunların ${r.short.idle} tanesi 3 ve 4 hamlelik kısa problemlerdir. Testte ara verilmiş, görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
    ];
  }
  if (towerIdle(r)) {
    return [
      r.short.idle === 0
        ? `Kule görevinde ${r.idle} problemde hiç top taşınmadan süre dolmuş; bu problemlerde çözüm kafada aranırken süre yetmemiş ya da ara verilmiş olabilir.`
        : `Kule görevinde ${r.idle} problemde hiç top taşınmadan süre dolmuş; bu problemlerde çözüm kafada aranırken süre yetmemiş, ara verilmiş ya da yönerge anlaşılmamış olabilir.`,
    ];
  }
  return [];
}

export function taskQualityNotes(parts: {
  flanker?: FlankerResult;
  symbol?: SymbolResult;
  cancellation?: CancellationResult;
  colorWord?: ColorWordResult;
  goNoGo?: GoNoGoResult;
  trail?: TrailResult;
  nBack?: NBackResult;
  rotation?: RotationResult;
  reaction?: ReactionResult;
  matrix?: MatrixResult;
  numberSeries?: NumberSeriesResult;
  letterSeries?: LetterSeriesResult;
  verbal?: VerbalResult;
  folding?: FoldingResult;
  logic?: LogicResult;
  numeric?: NumericResult;
  cube?: CubeResult;
  hidden?: HiddenResult;
  pattern?: PatternResult;
  reflection?: ReflectionResult;
  tower?: TowerResult;
  rotation3d?: Rotation3dResult;
  complexSpan?: ComplexSpanResult;
  perspective?: PerspectiveResult;
  vocabulary?: VocabularyResult;
  ruleSwitch?: RuleSwitchResult;
  wordList?: WordListResult;
}): string[] {
  const notes: string[] = [];
  const f = parts.flanker;
  if (f && f.n > 0) {
    if (f.accuracy < 0.6) notes.push('Ok görevinde doğruluk düşük; yönerge tam anlaşılmamış ya da düğmelere rastgele basılmış olabilir.');
    if (f.anticipations / f.n > 0.1) notes.push('Ok görevinde bazı cevaplar oklar görünür görünmez, onlara bakmadan verilmiş.');
    if (f.timeouts / f.n > 0.2) notes.push('Ok görevinde denemelerin bir kısmında süre içinde cevap verilmemiş.');
  }
  const s = parts.symbol;
  if (s) {
    if (s.attempted === 0) notes.push('Sembol eşleştirme görevinde hiç cevap verilmedi.');
    else if (s.attempted < 10) notes.push('Sembol eşleştirme görevinde çok az cevap verilmiş; görev yarıda bırakılmış olabilir.');
    else if (s.accuracy < 0.7) notes.push('Sembol eşleştirme görevinde hata oranı yüksek; hızdan çok doğruluğa odaklanmak gerekebilir.');
  }
  const c = parts.cancellation;
  if (c) {
    if (c.hits < CANCELLATION_FEW_HITS) notes.push('Harf işaretleme görevinde çok az harf işaretlenmiş; görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.');
    else if (c.commissions > c.hits) notes.push('Harf işaretleme görevinde yanlış işaretler doğru işaretlerden fazla; harflere rastgele dokunulmuş olabilir.');
    else if (c.hitRate < 0.5) notes.push('Harf işaretleme görevinde aranan harflerin yarısından azı bulunmuş; satırlar atlanmış ya da çok hızlı gidilmiş olabilir.');
    if (c.ceiling) notes.push('Harf işaretleme görevinde en az bir bölümde sayfanın sonuna ulaşılmış; çalışma hızı olduğundan düşük görünebilir.');
  }
  const cw = parts.colorWord;
  if (cw && cw.n > 0 && cw.accuracy < 0.6 && colorWordMostlyMissed(cw)) {
    // Doğru olmayan cevapların çoğu süre aşımı ya da çok erken cevap: tek bir not (renk körlüğü ya da süre notu yinelenmez).
    notes.push(
      `Renk-kelime görevinde ${cw.timeouts + cw.anticipations > cw.n / 2 ? 'denemelerin çoğunda' : 'denemelerin bir kısmında'} süre içinde cevap verilmemiş ya da kelimeye bakmadan çok erken basılmış; görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir. Bu görevin sonucu yorumlanmamalıdır.`,
    );
  } else if (cw && cw.n > 0) {
    if (cw.checkFlag) {
      notes.push(
        `Renk-kelime görevinin başındaki renk denemesinde ${cw.checkTrials} denemenin ${cw.checkErrors} tanesinde başka bir rengin düğmesine basıldı. Renkler birbirine karışmış ya da düğmelere yanlışlıkla basılmış olabilir.`,
      );
    }
    if (cw.accuracy < 0.6) {
      notes.push('Renk-kelime görevinde doğruluk düşük; yönerge tam anlaşılmamış, düğmelere rastgele basılmış ya da renkler ayırt edilememiş (renk körlüğü) olabilir.');
    } else if (cw.otherErrors >= 6 && !cw.checkFlag) {
      notes.push('Renk-kelime görevinde bazı hatalarda ne yazının rengine ne de kelimeye basılmış; renkler birbirine karıştırılmış ya da düğmelere yanlışlıkla basılmış olabilir.');
    }
    if (cw.anticipations / cw.n > 0.1) notes.push('Renk-kelime görevinde bazı cevaplar kelime görünür görünmez, ona bakmadan verilmiş.');
    if (cw.timeouts / cw.n > 0.2) {
      notes.push(`Renk-kelime görevinde denemelerin ${cw.timeouts > cw.n / 2 ? 'yarısından çoğunda' : 'bir kısmında'} süre içinde cevap verilmemiş.`);
    }
  }
  const g = parts.goNoGo;
  if (g && g.goTrials > 0) {
    if (g.hits === 0 && g.anticipations === 0) {
      notes.push('Dur-git görevinde basılması gereken harflerin hiçbirinde basılmamış; görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.');
    } else if (g.hitRate < 0.5) {
      const late = 'Dur-git görevinde basılması gereken harflerin yarısından çoğunda zamanında basılmamış';
      notes.push(
        g.anticipations > g.goTrials / 2
          ? 'Dur-git görevinde basılması gereken harflerin yarısından çoğunda harfe bakılmadan, çok erken basılmış; düğmeye harfi beklemeden sürekli basılmış olabilir.'
          : g.anticipations > g.omissions
            ? `${late}; bunların çoğunda harfe bakılmadan, çok erken basılmış. Düğmeye harfi beklemeden basılmış olabilir.`
            : `${late}; görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.`,
      );
    } else if (g.stopRate < 0.2) notes.push('Dur-git görevinde X harflerinin çoğunda da basılmış; yönerge anlaşılmamış olabilir.');
    if (g.hitRate >= 0.5 && g.anticipations / g.goTrials > 0.1) {
      notes.push('Dur-git görevinde bazı basışlar harf görünür görünmez, ona bakmadan yapılmış; düğmeye harfi beklemeden basılmış olabilir.');
    }
  }
  const tr = parts.trail;
  if (tr) {
    for (const p of tr.parts) {
      const which = p.index === 0 ? 'birinci' : 'ikinci';
      if (!p.completed) notes.push(`Sırayla birleştirme görevinin ${which} bölümü süre dolmadan tamamlanamadı; bu bölümün süresi yorumlanmamalıdır.`);
      else if (p.errors > p.n) notes.push(`Sırayla birleştirme görevinin ${which} bölümünde çok sayıda yanlış daireye dokunulmuş; dairelere rastgele dokunulmuş olabilir.`);
    }
  }
  const nb = parts.nBack;
  if (nb) {
    for (const l of nb.levels) {
      const where = l.n === 1 ? 'Geriye dönük hatırlama görevinin bir geri bölümünde' : 'Geriye dönük hatırlama görevinin iki geri bölümlerinde';
      if (nBackSilent(l)) {
        notes.push(
          `${where} hiç basılmamış; yönerge anlaşılmamış ya da görev yarıda bırakılmış olabilir. ${l.n === 1 ? 'Bu bölümün' : 'Bu bölümlerin'} sonucu yorumlanmamalıdır.`,
        );
        continue;
      }
      // Düzeyin bir bölümünde hiç basılmadıysa (ör. son bölüm yarıda bırakıldıysa) düzeyin birleşik sonucu yanıltır.
      for (const b of nb.blocks.filter((x) => x.n === l.n && nBackSilent(x))) {
        notes.push(
          `Geriye dönük hatırlama görevinin ${ordinalLower(b.index)} bölümünde hiç basılmamış; bu bölüm yarıda bırakılmış olabilir. ${l.n === 1 ? 'Bir' : 'İki'} geri sonucu dikkatle yorumlanmalıdır.`,
        );
      }
      if (l.falseAlarmRate > NBACK_RANDOM_FA) {
        notes.push(`${where} aynı olmayan harflerin yarısından çoğunda da basılmış; düğmeye harflere bakılmadan basılmış ya da yönerge anlaşılmamış olabilir.`);
      } else if (nBackKeptOneBack(l)) {
        notes.push(
          `${where} bir önceki harfle aynı olan harflerde sık basılmış, iki önceki harfle aynı olanlar ise çoğunlukla kaçırılmış: bir geri kuralına göre basılmaya devam edilmiş olabilir.`,
        );
      }
    }
  }
  const ro = parts.rotation;
  if (ro && ro.n > 0) {
    const errors = ro.n - ro.correct;
    const wrong = ro.sameSaidMirror + ro.mirrorSaidSame;
    const low = ro.accuracy < 0.6;
    // Rapordaki doğruluk kartıyla aynı ayrım: düşük doğrulukta doğru sayılmayan denemelerin çoğu süre aşımı ya da çok
    // erken basışsa düğmelerin karıştırıldığı ya da rastgele basıldığı söylenmez.
    const mostlyMissed = errors > 0 && ro.timeouts + ro.anticipations > errors / 2;
    const mostlyTimeouts = errors > 0 && ro.timeouts > errors / 2;
    const mostlyEarly = errors > 0 && ro.anticipations > errors / 2;
    if (ro.timeouts / ro.n > 0.5) {
      notes.push('Zihinde döndürme görevinde denemelerin yarısından çoğunda süre içinde cevap verilmemiş; görev yarıda bırakılmış olabilir. Bu görevin sonucu yorumlanmamalıdır.');
    } else {
      if (low && mostlyMissed) {
        if (mostlyTimeouts) {
          notes.push('Zihinde döndürme görevinde denemelerin birçoğunda süre içinde cevap verilmemiş; doğru cevaplar bu yüzden az.');
        } else if (!mostlyEarly) {
          notes.push('Zihinde döndürme görevinde doğru sayılmayan denemelerin çoğunda ya süre içinde cevap verilmemiş ya da çok erken basılmış; doğru cevaplar bu yüzden az.');
        }
        // Çoğu çok erken basışsa aşağıdaki erken basış uyarısı bunu söyler.
      } else if (ro.accuracy < 0.4 && wrong > ro.correct) {
        notes.push('Zihinde döndürme görevinde cevapların çoğu yanlış: “Aynı” ile “Ayna görüntüsü” düğmeleri birbirine karıştırılmış olabilir.');
      } else if (low) {
        notes.push('Zihinde döndürme görevinde doğru cevaplar yarıya yakın: rastgele basan biri de yaklaşık yarısını doğru bulur. Yönerge anlaşılmamış ya da düğmelere rastgele basılmış olabilir.');
      }
      if (ro.sameShare !== null && (ro.sameShare > 0.85 || ro.sameShare < 0.15)) {
        notes.push('Zihinde döndürme görevinde cevapların çoğunda aynı düğmeye basılmış; yönerge anlaşılmamış olabilir.');
      }
      if (ro.timeouts / ro.n > 0.2 && !(low && mostlyTimeouts)) {
        notes.push('Zihinde döndürme görevinde denemelerin bir kısmında süre içinde cevap verilmemiş.');
      }
    }
    if (ro.anticipations / ro.n > 0.5) notes.push('Zihinde döndürme görevinde cevapların çoğu şekiller görünür görünmez, onlara bakmadan verilmiş.');
    else if (ro.anticipations / ro.n > 0.1) notes.push('Zihinde döndürme görevinde bazı cevaplar şekiller görünür görünmez, onlara bakmadan verilmiş.');
  }
  const re = parts.reaction;
  if (re) {
    // Rapordaki kartlarla aynı sıra ve eşikler (lib/reports/build.ts, reactionStatus).
    for (const p of [re.simple, re.choice]) {
      if (!p.n) continue;
      const where = `Tepki hızı görevinin ${p.key === 'simple' ? 'basit' : 'seçmeli'} bölümünde`;
      if (p.misses > p.n / 2) {
        notes.push(`${where} denemelerin yarısından çoğunda süre içinde basılmamış; görev yarıda bırakılmış olabilir. Bu bölümün sonucu yorumlanmamalıdır.`);
        continue;
      }
      if (p.early > p.n / 2) {
        notes.push(
          `${where} denemelerin yarısından çoğunda daire belirmeden ya da belirir belirmez basılmış; düğmeye daireyi beklemeden basılmış olabilir. Bu bölümün sonucu yorumlanmamalıdır.`,
        );
        continue;
      }
      if (p.early + p.misses > p.n / 2) {
        notes.push(
          `${where} denemelerin yarısından çoğunda ya daire belirmeden ya da belirir belirmez basılmış ya da süre içinde basılmamış. Bu bölümün sonucu yorumlanmamalıdır.`,
        );
        continue;
      }
      if (p.key === 'choice' && p.answered >= REACTION_MIN_VALID) {
        const acc = p.correct / p.answered;
        const left = p.left / p.answered;
        if (acc < 0.4) notes.push(`${where} cevapların çoğunda dairenin olmadığı taraftaki düğmeye basılmış; yönerge anlaşılmamış olabilir.`);
        else if (left > 0.85 || left < 0.15) notes.push(`${where} cevapların çoğunda aynı düğmeye basılmış; yönerge anlaşılmamış olabilir.`);
        else if (acc < 0.6) {
          notes.push(`${where} dairenin olduğu taraftaki düğmeye cevapların yarıya yakınında basılmış: rastgele basan biri de yaklaşık yarısını doğru bulur. Düğmelere rastgele basılmış olabilir.`);
        } else if (acc < 0.8) notes.push(`${where} öteki taraftaki düğmeye sık basılmış; acele edilmiş ya da sol ile sağ karıştırılmış olabilir.`);
      }
      if (p.misses / p.n > 0.25) notes.push(`${where} denemelerin birçoğunda süre içinde basılmamış; sonuç dikkatle yorumlanmalıdır.`);
      else if (p.misses / p.n > 0.1) notes.push(`${where} denemelerin bir kısmında süre içinde basılmamış.`);
      if (p.early / p.n > 0.25) notes.push(`${where} denemelerin birçoğunda daire belirmeden ya da belirir belirmez basılmış; sonuç dikkatle yorumlanmalıdır.`);
      else if (p.early / p.n > 0.1) notes.push(`${where} bazı denemelerde daire belirmeden ya da belirir belirmez basılmış.`);
      if (p.key === 'choice' && p.answered && p.mouse / p.answered >= REACTION_MOUSE_SHARE) {
        const who = p.mouse === p.answered ? 'cevaplar' : p.mouse / p.answered > 0.5 ? 'cevapların çoğu' : 'cevapların bir kısmı';
        notes.push(
          `${where} ${who} fareyle verilmiş; fareyle verilen cevaplarda süreye imlecin iki düğme arasındaki yolu da eklenir. Bilgisayarda ok tuşlarıyla yapılırsa daha doğru ölçülür.`,
        );
      }
    }
  }
  const mx = parts.matrix;
  if (mx) notes.push(...matrixQualityNotes(mx));
  const ns = parts.numberSeries;
  if (ns) notes.push(...numberSeriesQualityNotes(ns));
  const hd = parts.letterSeries;
  if (hd) notes.push(...letterSeriesQualityNotes(hd));
  const vr = parts.verbal;
  if (vr) notes.push(...verbalQualityNotes(vr));
  const kf = parts.folding;
  if (kf) notes.push(...foldingQualityNotes(kf));
  const kb = parts.vocabulary;
  if (kb) notes.push(...vocabularyQualityNotes(kb));
  const kd = parts.ruleSwitch;
  if (kd) notes.push(...ruleSwitchQualityNotes(kd));
  const kl = parts.wordList;
  if (kl) notes.push(...wordListQualityNotes(kl));
  const ma = parts.logic;
  if (ma) notes.push(...logicQualityNotes(ma));
  const sy = parts.numeric;
  if (sy) notes.push(...numericQualityNotes(sy));
  const kp = parts.cube;
  if (kp) notes.push(...cubeQualityNotes(kp));
  const gs = parts.hidden;
  if (gs) notes.push(...hiddenQualityNotes(gs));
  const dh = parts.pattern;
  if (dh) notes.push(...patternQualityNotes(dh));
  const dk = parts.reflection;
  if (dk) notes.push(...reflectionQualityNotes(dk));
  const kg = parts.tower;
  if (kg) notes.push(...towerQualityNotes(kg));
  const ud = parts.rotation3d;
  if (ud) notes.push(...rotation3dQualityNotes(ud));
  const hb = parts.complexSpan;
  if (hb) notes.push(...complexSpanQualityNotes(hb));
  const ba = parts.perspective;
  if (ba) notes.push(...perspectiveQualityNotes(ba));
  return notes;
}

/** Kâğıt katlamada sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, foldingBlocks aynı eşikleri kullanır). */
export function foldingQualityNotes(kf: FoldingResult): string[] {
  const notes: string[] = [];
  if (foldingChance(kf)) {
    notes.push(
      'Kâğıt katlama testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da sorulara bakılmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (foldingRapid(kf)) {
    notes.push(
      `Kâğıt katlama testinde 3. düzey ve üstündeki ${kf.rapidOf} sorunun ${kf.rapid === kf.rapidOf ? 'hepsinde' : `${kf.rapid} tanesinde`} yanlış bir cevap 2,5 saniyeden kısa sürede verilmiş; bu sorularda katlamalara bakılmadan seçilmiş olabilir.`,
    );
  }
  if (foldingSamePosition(kf)) {
    notes.push('Kâğıt katlama testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda çok hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri (en az 2). */
/**
 * Kâğıt katlamada doğru cevaplar rastgele seçimle de ulaşılabilecek kadar az ve hiçbir düzeye ulaşılmamış: sonuç yorumlanmaz. En kolay
 * düzeyin çoğu doğruysa (ulaşılan düzey en az 1) toplam az olsa da sonuç rastgele seçim sayılmaz: kolay sorular gerçekten
 * çözülmüştür, daha zor sorular zor gelmiştir.
 */
export const foldingChance = (kf: FoldingResult) => kf.correct <= FOLDING_CHANCE_MAX && kf.reached === 0;
export const foldingRapid = (kf: FoldingResult) => kf.rapidOf > 0 && kf.rapid >= Math.max(2, Math.ceil(kf.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const FOLDING_SAME_MAX_CORRECT = 12;
export const foldingSamePosition = (kf: FoldingResult) => kf.samePosition >= Math.ceil(kf.n / 2) && kf.correct <= FOLDING_SAME_MAX_CORRECT;
/** Yanlışların yorumlanması: sözel akıl yürütmedeki eşikler (en az 4 çeldirici ve yanlışların en az %60'ı). */
export const foldingLurePattern = (kf: FoldingResult) => kf.lures >= VERBAL_LURE_MIN && kf.lures >= VERBAL_LURE_SHARE * kf.wrong;

/** Kural değiştirmede doğruluk rastgele basmaktan ayırt edilemiyor. */
export const ruleSwitchChance = (r: RuleSwitchResult) => r.correct <= RULE_CHANCE_ACC * r.n;
/** Denemelerin en az dörtte birinde süre içinde cevap verilmedi. */
export const ruleSwitchTimeouts = (r: RuleSwitchResult) => r.timeouts >= 0.25 * r.n;
/** Çok erken basışlar: denemelerin en az onda biri (en az 3). */
export const ruleSwitchFast = (r: RuleSwitchResult) => r.tooFast >= Math.max(3, Math.ceil(0.1 * r.n));
/** Cevapların en az %85'inde aynı düğme. */
export const ruleSwitchOneSide = (r: RuleSwitchResult) => r.answered >= 20 && r.sameSide >= 0.85 * r.answered;

/** Kural değiştirmede sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, ruleSwitchBlocks aynı eşikleri kullanır). */
export function ruleSwitchQualityNotes(r: RuleSwitchResult): string[] {
  const notes: string[] = [];
  if (ruleSwitchChance(r)) {
    notes.push(
      'Kural değiştirme görevinde doğru cevaplar, iki düğmeden birine rastgele basan birinin de yapabileceği kadar az; yönerge tam anlaşılmamış ya da şekillere bakılmadan basılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (ruleSwitchTimeouts(r)) notes.push(`Kural değiştirme görevinde ${r.n} denemenin ${r.timeouts} tanesinde süre içinde cevap verilmedi; görev yarıda bırakılmış ya da dikkat dağılmış olabilir.`);
  if (ruleSwitchFast(r)) notes.push(`Kural değiştirme görevinde ${r.tooFast} denemede şekil göründükten sonraki 0,2 saniye içinde basıldı; bu denemelerde şekle bakmadan basılmış olabilir.`);
  if (ruleSwitchOneSide(r)) notes.push('Kural değiştirme görevinde cevapların çoğunda aynı düğmeye basıldı; şekillere bakılmadan hep aynı düğmeye basılmış olabilir.');
  return notes;
}

/** Kelime listesinde hiçbir hatırlama bölümünde kelime yazılmadı. */
export const wordListNoInput = (r: WordListResult) => r.entries === 0;
/** Araya giren listeden sonra ilk listenin yeniden yazıldığı bölümde hiç kelime yazılmadı (öteki bölümlerde yazıldı). */
export const wordListDelayedSkipped = (r: WordListResult) => r.entries > 0 && r.delayed.entries === 0;
/** Öğrenme denemelerinde listede olmayan çok sayıda kelime: en az 9 ve doğru hatırlananlar kadar ya da daha çok. */
export const wordListManyExtra = (r: WordListResult) => r.extraLearning >= 9 && r.extraLearning >= r.total;
/** Tanımada hemen hep aynı cevap: cevapların en az %90'ı "evet" ya da en az %90'ı "hayır". */
export const wordListRecogOneSided = (r: WordListResult) => Math.max(r.recognition.yes, r.recognition.n - r.recognition.yes) >= Math.ceil(0.9 * r.recognition.n);
/** Tanımada çok hızlı cevaplar: kelimelerin en az %15'i (en az 4). */
export const wordListRecogFast = (r: WordListResult) => r.recognition.tooFast >= Math.max(4, Math.ceil(0.15 * r.recognition.n));
/** Tanımada ayırt etme yok denecek kadar az: "evet" oranı ilk listedeki kelimelerde, yanılgılardakinden en çok 0,1 fazla. */
export const wordListRecogChance = (r: WordListResult) => r.recognition.discrimination <= 0.1;
/** Tanıma sonucu yorumlanabilir mi? */
export const wordListRecogValid = (r: WordListResult) => !wordListRecogOneSided(r) && !wordListRecogFast(r) && !wordListRecogChance(r);

/** Kelime listesinde sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, wordListBlocks aynı eşikleri kullanır). */
export function wordListQualityNotes(r: WordListResult): string[] {
  const notes: string[] = [];
  if (wordListNoInput(r)) {
    notes.push('Kelime listesi görevinde hiçbir hatırlama bölümünde kelime yazılmadı; yönerge anlaşılmamış ya da görev yarıda bırakılmış olabilir. Hatırlama sonuçları yorumlanmadı.');
  } else {
    if (wordListManyExtra(r)) {
      notes.push(
        `Kelime listesi görevinin öğrenme denemelerinde hiçbir listede olmayan ${r.extraLearning} kelime yazıldı; yönerge tam anlaşılmamış ya da akla gelen başka kelimeler de yazılmış olabilir. Hatırlama sonuçları dikkatle yorumlanmalıdır.`,
      );
    }
    if (r.emptyRecalls >= 2) notes.push(`Kelime listesi görevinde ${r.emptyRecalls} hatırlama bölümünde hiç kelime yazılmadı; o bölümler yarıda bırakılmış olabilir.`);
    if (wordListDelayedSkipped(r)) {
      notes.push('Kelime listesi görevinde ilk listenin yeniden yazıldığı bölümde hiç kelime yazılmadı; bu bölüm atlanmış olabilir. Öğrenileni koruma sonucu yorumlanmadı.');
    }
  }
  if (r.restarts > 0) {
    notes.push(
      `Kelime listesi görevinde başka bir sekmeye ya da uygulamaya geçildiği için liste ${r.restarts} kez baştan gösterildi; kelimeler bir kez daha görüldüğü için hatırlanan kelime sayısı biraz yüksek çıkmış olabilir.`,
    );
  }
  if (wordListRecogOneSided(r)) notes.push('Kelime listesi görevinin tanıma bölümünde hemen her kelimeye aynı cevap verildi; tanıma sonucu yorumlanmadı.');
  else if (wordListRecogFast(r)) {
    notes.push(`Kelime listesi görevinin tanıma bölümünde ${r.recognition.tooFast} kelimede 0,3 saniyeden kısa sürede cevap verildi; kelimeye bakılmadan cevap verilmiş olabilir. Tanıma sonucu yorumlanmadı.`);
  } else if (wordListRecogChance(r)) {
    notes.push('Kelime listesi görevinin tanıma bölümünde ilk listedeki ve ilk listede olmayan kelimelere benzer oranda “evet” dendi; tahminle cevap verilmiş olabilir. Tanıma sonucu yorumlanmadı.');
  }
  return notes;
}

/** Kelime bilgisinde sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, vocabularyBlocks aynı eşikleri kullanır). */
export function vocabularyQualityNotes(kb: VocabularyResult): string[] {
  const notes: string[] = [];
  if (vocabularyChance(kb)) {
    notes.push(
      'Kelime bilgisi testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da sorular okunmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (vocabularyRapid(kb)) {
    notes.push(
      `Kelime bilgisi testinde 3. düzey ve üstündeki ${kb.rapidOf} sorunun ${kb.rapid === kb.rapidOf ? 'hepsinde' : `${kb.rapid} tanesinde`} yanlış bir cevap, soru ve seçenekler okunamayacak kadar kısa sürede verilmiş; bu sorularda okunmadan seçilmiş olabilir.`,
    );
  }
  if (vocabularySamePosition(kb)) {
    notes.push('Kelime bilgisi testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda okunamayacak kadar hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri (en az 2). */
/** Kelime bilgisinde şans düzeyi (şekil akıl yürütmedeki gibi: hiçbir düzeye ulaşılmadıysa). */
export const vocabularyChance = (kb: VocabularyResult) => kb.correct <= VOCABULARY_CHANCE_MAX && kb.reached === 0;
export const vocabularyRapid = (kb: VocabularyResult) => kb.rapidOf > 0 && kb.rapid >= Math.max(2, Math.ceil(kb.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const VOCABULARY_SAME_MAX_CORRECT = 12;
export const vocabularySamePosition = (kb: VocabularyResult) => kb.samePosition >= Math.ceil(kb.n / 2) && kb.correct <= VOCABULARY_SAME_MAX_CORRECT;
/** Yanlışların yorumlanması: sözel akıl yürütmedeki eşikler (en az 4 çeldirici ve yanlışların en az %60'ı). */
export const vocabularyLurePattern = (kb: VocabularyResult) => kb.lures >= VERBAL_LURE_MIN && kb.lures >= VERBAL_LURE_SHARE * kb.wrong;

/**
 * Sözel akıl yürütmede sonucu dikkatle yorumlamayı gerektiren durumlar. Rapordaki kartlar aynı eşikleri kullanır
 * (lib/reports/build.ts, verbalBlocks).
 */
export function verbalQualityNotes(vr: VerbalResult): string[] {
  const notes: string[] = [];
  if (verbalChance(vr)) {
    notes.push(
      'Sözel akıl yürütme testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da sorular okunmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (verbalRapid(vr)) {
    notes.push(
      `Sözel akıl yürütme testinde 3. düzey ve üstündeki ${vr.rapidOf} sorunun ${vr.rapid === vr.rapidOf ? 'hepsinde' : `${vr.rapid} tanesinde`} yanlış bir cevap, soru ve seçenekler okunamayacak kadar kısa sürede verilmiş; bu sorularda okunmadan seçilmiş olabilir.`,
    );
  }
  if (verbalSamePosition(vr)) {
    notes.push('Sözel akıl yürütme testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda okunamayacak kadar hızlı cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri (en az 2). */
export const verbalRapid = (vr: VerbalResult) => vr.rapidOf > 0 && vr.rapid >= Math.max(2, Math.ceil(vr.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
/** Sözel akıl yürütmede şans düzeyi (şekil akıl yürütmedeki gibi: hiçbir düzeye ulaşılmadıysa). */
export const verbalChance = (vr: VerbalResult) => vr.correct <= VERBAL_CHANCE_MAX && vr.reached === 0;
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const VERBAL_SAME_MAX_CORRECT = 12;
export const verbalSamePosition = (vr: VerbalResult) => vr.samePosition >= Math.ceil(vr.n / 2) && vr.correct <= VERBAL_SAME_MAX_CORRECT;
/** Yanlışların yorumlanması: en az 4 çeldirici ve yanlışların en az %60'ı çeldirici. */
export const verbalLurePattern = (vr: VerbalResult) => vr.lures >= VERBAL_LURE_MIN && vr.lures >= VERBAL_LURE_SHARE * vr.wrong;

/**
 * Sayı dizilerinde sonucu dikkatle yorumlamayı gerektiren durumlar. Rapordaki kartlar aynı eşikleri kullanır
 * (lib/reports/build.ts, numberSeriesBlocks).
 */
export function numberSeriesQualityNotes(ns: NumberSeriesResult): string[] {
  const notes: string[] = [];
  if (numberSeriesMostlySkipped(ns)) {
    notes.push(
      `Sayı dizileri testinde ${ns.n} sorunun ${ns.skipped === ns.n ? 'hepsinde' : `${ns.skipped} tanesinde`} “Bilmiyorum” denmiş; sorular çok zor gelmiş ya da test yarıda bırakılmak istenmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
    );
  }
  if (numberSeriesRapid(ns)) {
    notes.push(
      `Sayı dizileri testinde 3. düzey ve üstündeki sorulardan cevap yazılan ${ns.rapidOf} sorunun ${ns.rapid === ns.rapidOf ? 'hepsinde' : `${ns.rapid} tanesinde`} yanlış cevap 2,5 saniyeden kısa sürede yazılmış; bu sorularda diziye bakılmadan tahmin edilmiş olabilir.`,
    );
  }
  if (numberSeriesSameAnswer(ns)) {
    notes.push('Sayı dizileri testinde cevapların yarısında ya da daha çoğunda aynı sayı yazılmış; sorulara bakmadan cevap verilmiş olabilir.');
  }
  return notes;
}

/**
 * Harf dizilerinde sonucu dikkatle yorumlamayı gerektiren durumlar. Eşikler sayı dizileriyle aynıdır; rapordaki kartlar
 * aynı eşikleri kullanır (lib/reports/build.ts, letterSeriesBlocks).
 */
export function letterSeriesQualityNotes(hs: LetterSeriesResult): string[] {
  const notes: string[] = [];
  if (letterSeriesMostlySkipped(hs)) {
    notes.push(
      `Harf dizileri testinde ${hs.n} sorunun ${hs.skipped === hs.n ? 'hepsinde' : `${hs.skipped} tanesinde`} “Bilmiyorum” denmiş; sorular çok zor gelmiş ya da test yarıda bırakılmak istenmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
    );
  }
  if (letterSeriesRapid(hs)) {
    notes.push(
      `Harf dizileri testinde 3. düzey ve üstündeki sorulardan cevap verilen ${hs.rapidOf} sorunun ${hs.rapid === hs.rapidOf ? 'hepsinde' : `${hs.rapid} tanesinde`} yanlış cevap 2,5 saniyeden kısa sürede verilmiş; bu sorularda diziye bakılmadan tahmin edilmiş olabilir.`,
    );
  }
  if (letterSeriesSameAnswer(hs)) {
    notes.push('Harf dizileri testinde cevapların yarısında ya da daha çoğunda aynı harf seçilmiş; sorulara bakmadan cevap verilmiş olabilir.');
  }
  return notes;
}

/** Harf dizilerinde soruların yarısından çoğunda "Bilmiyorum". */
export const letterSeriesMostlySkipped = (hs: LetterSeriesResult) => hs.skipped > hs.n / 2;
/** Harf dizilerinde zor sorularda çok hızlı verilen yanlış cevaplar: 3. düzey ve üstünde cevap verilen soruların en az dörtte biri (en az 2). */
export const letterSeriesRapid = (hs: LetterSeriesResult) => hs.rapidOf > 0 && hs.rapid >= Math.max(2, Math.ceil(hs.rapidOf / 4));
/** Harf dizilerinde hep aynı harfi seçme: soruların en az yarısında aynı harf (en az 6 cevapta). */
export const letterSeriesSameAnswer = (hs: LetterSeriesResult) => hs.sameAnswer >= Math.max(6, Math.ceil(hs.n / 2));

/** Soruların yarısından çoğunda "Bilmiyorum". */
export const numberSeriesMostlySkipped = (ns: NumberSeriesResult) => ns.skipped > ns.n / 2;
/** Zor sorularda çok hızlı yazılan yanlış cevaplar: 3. düzey ve üstünde cevap yazılan soruların en az dörtte biri (en az 2). */
export const numberSeriesRapid = (ns: NumberSeriesResult) => ns.rapidOf > 0 && ns.rapid >= Math.max(2, Math.ceil(ns.rapidOf / 4));
/** Hep aynı sayıyı yazma: soruların en az yarısında aynı sayı (en az 6 cevapta). */
export const numberSeriesSameAnswer = (ns: NumberSeriesResult) => ns.sameAnswer >= Math.max(6, Math.ceil(ns.n / 2));

/**
 * Şekil akıl yürütmede sonucu dikkatle yorumlamayı gerektiren durumlar. Rapordaki kartlar aynı eşikleri kullanır
 * (lib/reports/build.ts, matrixBlocks).
 */
export function matrixQualityNotes(mx: MatrixResult): string[] {
  const notes: string[] = [];
  if (matrixChance(mx)) {
    notes.push(
      'Şekil akıl yürütme testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da sorulara bakmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (matrixRapid(mx)) {
    notes.push(
      `Şekil akıl yürütme testinde 3. düzey ve üstündeki ${mx.rapidOf} sorunun ${mx.rapid === mx.rapidOf ? 'hepsinde' : `${mx.rapid} tanesinde`} yanlış bir cevap 2,5 saniyeden kısa sürede verilmiş; bu sorularda tabloya bakılmadan seçilmiş olabilir.`,
    );
  }
  if (matrixSamePosition(mx)) {
    notes.push('Şekil akıl yürütme testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; birçok soruda bakılmadan aynı yere basılmış olabilir.');
  }
  return notes;
}

/**
 * Doğru cevaplar rastgele seçimle de ulaşılabilecek kadar az ve hiçbir düzeye ulaşılmamış: sonuç yorumlanmaz. En kolay
 * düzeyin çoğu doğruysa (ulaşılan düzey en az 1) toplam az olsa da sonuç rastgele seçim sayılmaz: kolay sorular gerçekten
 * çözülmüştür, daha zor sorular zor gelmiştir.
 */
export const matrixChance = (mx: MatrixResult) => mx.correct <= MATRIX_CHANCE_MAX && mx.reached === 0;
/** Zor sorularda çok hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri. */
export const matrixRapid = (mx: MatrixResult) => mx.rapidOf > 0 && mx.rapid >= Math.max(2, Math.ceil(mx.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
/** Bundan çok doğru cevap verende aynı sıradaki seçeneğin sık seçilmesi bakmadan seçmeye bağlanmaz. */
export const MATRIX_SAME_MAX_CORRECT = 12;
export const matrixSamePosition = (mx: MatrixResult) => mx.samePosition >= Math.ceil(mx.n / 2) && mx.correct <= MATRIX_SAME_MAX_CORRECT;
