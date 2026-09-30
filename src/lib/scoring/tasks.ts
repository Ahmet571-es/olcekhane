import type {
  CancellationTask,
  ColorWordTask,
  DigitSpanTask,
  FlankerTask,
  GoNoGoTask,
  SpatialSpanTask,
  SymbolMatchTask,
  TrailTask,
} from '@/lib/instruments/types';
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
  /** Taranan harf: sayfanın başından son işarete kadar. */
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
    const last = r.marks.length ? Math.max(...r.marks) : -1;
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
    sections.push({ index: t.index, processed: last + 1, targets, hits, omissions: targets - hits, commissions, net: hits - commissions, ms, unmarks: r.unmarks });
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

/* ---------- Cevap kalitesi ---------- */

export function taskQualityNotes(parts: {
  flanker?: FlankerResult;
  symbol?: SymbolResult;
  cancellation?: CancellationResult;
  colorWord?: ColorWordResult;
  goNoGo?: GoNoGoResult;
  trail?: TrailResult;
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
    if (s.attempted < 10) notes.push('Sembol eşleştirme görevinde çok az cevap verilmiş; görev yarıda bırakılmış olabilir.');
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
  return notes;
}
