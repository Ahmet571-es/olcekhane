import type {
  CancellationTask,
  ColorWordTask,
  DigitSpanTask,
  FlankerTask,
  GoNoGoTask,
  MatrixReasoningTask,
  MatrixRule,
  MentalRotationTask,
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
} from '@/lib/instruments/types';
import { DISPARITIES, disparity } from '@/lib/instruments/rotation';
import { verbalRapidMs } from '@/lib/instruments/verbal';
import { vocabularyRapidMs } from '@/lib/instruments/vocabulary';
import { nBackRoles } from '@/lib/instruments/sequences';
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
  /** 3. düzey ve üstündeki sorularda `rapidMs`'den kısa cevapların sayısı ve bu soruların sayısı. */
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
      rapid: hardOnes.filter((s) => s.rt !== null && s.rt < task.rapidMs).length,
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

/* ---------- Cevap kalitesi ---------- */

const ORDINALS_LOWER = ['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci', 'altıncı'];
const ordinalLower = (i: number) => ORDINALS_LOWER[i] ?? `${i + 1}.`;

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
  verbal?: VerbalResult;
  folding?: FoldingResult;
  vocabulary?: VocabularyResult;
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
    if (s.attempted === 0) notes.push('Sembol eşleştirme görevinde hiç cevap verilmedi; bu görevin sonucu yorumlanmadı.');
    else if (s.attempted < 10) notes.push('Sembol eşleştirme görevinde çok az cevap verilmiş; görev yarıda bırakılmış olabilir.');
    else if (s.accuracy < 0.7) notes.push('Sembol eşleştirme görevinde hata oranı yüksek; hızdan çok doğruluğa odaklanmak gerekebilir.');
  }
  const c = parts.cancellation;
  if (c) {
    if (c.hits < 10) notes.push('Harf işaretleme görevinde çok az harf işaretlenmiş; görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.');
    else if (c.commissions > c.hits) notes.push('Harf işaretleme görevinde yanlış işaretler doğru işaretlerden fazla; harflere rastgele dokunulmuş olabilir.');
    else if (c.hitRate < 0.5) notes.push('Harf işaretleme görevinde aranan harflerin yarısından azı bulunmuş; satırlar atlanmış ya da çok hızlı gidilmiş olabilir.');
    if (c.ceiling) notes.push('Harf işaretleme görevinde en az bir bölümde sayfanın sonuna ulaşılmış; çalışma hızı olduğundan düşük görünebilir.');
  }
  const cw = parts.colorWord;
  if (cw && cw.n > 0) {
    if (cw.checkFlag) {
      notes.push(
        `Renk-kelime görevinin başındaki renk denemesinde ${cw.checkTrials} denemenin ${cw.checkErrors} tanesinde başka bir rengin düğmesine basılmış: renkler birbirinden ayırt edilmekte zorlanılmış ya da düğmelere yanlışlıkla basılmış olabilir. Renkleri ayırt etmekte zorlanan biri için bu görevin sonucu geçerli değildir.`,
      );
    }
    if (cw.accuracy < 0.6) {
      notes.push('Renk-kelime görevinde doğruluk düşük; yönerge tam anlaşılmamış, düğmelere rastgele basılmış ya da renkler ayırt edilememiş (renk körlüğü) olabilir.');
    } else if (cw.otherErrors >= 6 && !cw.checkFlag) {
      notes.push('Renk-kelime görevinde bazı hatalarda ne yazının rengine ne de kelimeye basılmış; renkler birbirine karıştırılmış ya da düğmelere yanlışlıkla basılmış olabilir.');
    }
    if (cw.anticipations / cw.n > 0.1) notes.push('Renk-kelime görevinde bazı cevaplar kelime görünür görünmez, ona bakmadan verilmiş.');
    if (cw.timeouts / cw.n > 0.2) notes.push('Renk-kelime görevinde denemelerin bir kısmında süre içinde cevap verilmemiş.');
  }
  const g = parts.goNoGo;
  if (g && g.goTrials > 0) {
    if (g.hitRate < 0.5) {
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
  const vr = parts.verbal;
  if (vr) notes.push(...verbalQualityNotes(vr));
  const kf = parts.folding;
  if (kf) notes.push(...foldingQualityNotes(kf));
  const kb = parts.vocabulary;
  if (kb) notes.push(...vocabularyQualityNotes(kb));
  return notes;
}

/** Kâğıt katlamada sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, foldingBlocks aynı eşikleri kullanır). */
export function foldingQualityNotes(kf: FoldingResult): string[] {
  const notes: string[] = [];
  if (kf.correct <= FOLDING_CHANCE_MAX) {
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
    notes.push('Kâğıt katlama testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; sorulara bakmadan hep aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda çok hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri (en az 2). */
export const foldingRapid = (kf: FoldingResult) => kf.rapidOf > 0 && kf.rapid >= Math.max(2, Math.ceil(kf.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
export const foldingSamePosition = (kf: FoldingResult) => kf.samePosition >= Math.ceil(kf.n / 2);
/** Yanlışların yorumlanması: sözel akıl yürütmedeki eşikler (en az 4 çeldirici ve yanlışların en az %60'ı). */
export const foldingLurePattern = (kf: FoldingResult) => kf.lures >= VERBAL_LURE_MIN && kf.lures >= VERBAL_LURE_SHARE * kf.wrong;

/** Kelime bilgisinde sonucu dikkatle yorumlamayı gerektiren durumlar (lib/reports/build.ts, vocabularyBlocks aynı eşikleri kullanır). */
export function vocabularyQualityNotes(kb: VocabularyResult): string[] {
  const notes: string[] = [];
  if (kb.correct <= VOCABULARY_CHANCE_MAX) {
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
    notes.push('Kelime bilgisi testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; sorulara bakmadan hep aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda okunamayacak kadar hızlı yanlış cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri (en az 2). */
export const vocabularyRapid = (kb: VocabularyResult) => kb.rapidOf > 0 && kb.rapid >= Math.max(2, Math.ceil(kb.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
export const vocabularySamePosition = (kb: VocabularyResult) => kb.samePosition >= Math.ceil(kb.n / 2);
/** Yanlışların yorumlanması: sözel akıl yürütmedeki eşikler (en az 4 çeldirici ve yanlışların en az %60'ı). */
export const vocabularyLurePattern = (kb: VocabularyResult) => kb.lures >= VERBAL_LURE_MIN && kb.lures >= VERBAL_LURE_SHARE * kb.wrong;

/**
 * Sözel akıl yürütmede sonucu dikkatle yorumlamayı gerektiren durumlar. Rapordaki kartlar aynı eşikleri kullanır
 * (lib/reports/build.ts, verbalBlocks).
 */
export function verbalQualityNotes(vr: VerbalResult): string[] {
  const notes: string[] = [];
  if (vr.correct <= VERBAL_CHANCE_MAX) {
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
    notes.push('Sözel akıl yürütme testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; sorulara bakmadan hep aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda okunamayacak kadar hızlı cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri (en az 2). */
export const verbalRapid = (vr: VerbalResult) => vr.rapidOf > 0 && vr.rapid >= Math.max(2, Math.ceil(vr.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
export const verbalSamePosition = (vr: VerbalResult) => vr.samePosition >= Math.ceil(vr.n / 2);
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
      `Sayı dizileri testinde 3. düzey ve üstündeki sorulardan cevap yazılan ${ns.rapidOf} sorunun ${ns.rapid === ns.rapidOf ? 'hepsinde' : `${ns.rapid} tanesinde`} yanlış bir cevap 2,5 saniyeden kısa sürede yazılmış; bu sorularda diziye bakmadan yazılmış olabilir.`,
    );
  }
  if (numberSeriesSameAnswer(ns)) {
    notes.push('Sayı dizileri testinde cevapların yarısında ya da daha çoğunda aynı sayı yazılmış; sorulara bakmadan cevap verilmiş olabilir.');
  }
  return notes;
}

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
  if (mx.correct <= MATRIX_CHANCE_MAX) {
    notes.push(
      'Şekil akıl yürütme testinde doğru cevaplar, seçeneklerden rastgele seçen birinin de bulabileceği kadar az; sorular çok zor gelmiş, yönerge tam anlaşılmamış ya da sorulara bakmadan seçilmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  }
  if (matrixRapid(mx)) {
    notes.push(
      `Şekil akıl yürütme testinde 3. düzey ve üstündeki ${mx.rapidOf} sorunun ${mx.rapid === mx.rapidOf ? 'hepsinde' : `${mx.rapid} tanesinde`} 2,5 saniyeden kısa sürede cevap verilmiş; bu sorularda tabloya bakmadan seçilmiş olabilir.`,
    );
  }
  if (matrixSamePosition(mx)) {
    notes.push('Şekil akıl yürütme testinde cevapların yarısında ya da daha çoğunda aynı sıradaki seçenek seçilmiş; sorulara bakmadan hep aynı yere basılmış olabilir.');
  }
  return notes;
}

/** Zor sorularda çok hızlı cevaplar: 3. düzey ve üstündeki soruların en az dörtte biri. */
export const matrixRapid = (mx: MatrixResult) => mx.rapidOf > 0 && mx.rapid >= Math.max(2, Math.ceil(mx.rapidOf / 4));
/** Hep aynı sıradaki seçeneği seçme: cevapların en az yarısı aynı sırada. */
export const matrixSamePosition = (mx: MatrixResult) => mx.samePosition >= Math.ceil(mx.n / 2);
