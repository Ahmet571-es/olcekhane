import type { DigitSpanTask, FlankerTask, SpatialSpanTask, SymbolMatchTask } from '@/lib/instruments/types';
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

/* ---------- Cevap kalitesi ---------- */

export function taskQualityNotes(parts: { flanker?: FlankerResult; symbol?: SymbolResult }): string[] {
  const notes: string[] = [];
  const f = parts.flanker;
  if (f && f.n > 0) {
    if (f.accuracy < 0.6) notes.push('Ok görevinde doğruluk düşük; yönerge tam anlaşılmamış ya da düğmelere rastgele basılmış olabilir.');
    if (f.anticipations / f.n > 0.1) notes.push('Ok görevinde bazı cevaplar oklar görünmeden verilmiş.');
    if (f.timeouts / f.n > 0.2) notes.push('Ok görevinde denemelerin bir kısmında süre içinde cevap verilmemiş.');
  }
  const s = parts.symbol;
  if (s) {
    if (s.attempted < 10) notes.push('Sembol eşleştirme görevinde çok az cevap verilmiş; görev yarıda bırakılmış olabilir.');
    else if (s.accuracy < 0.7) notes.push('Sembol eşleştirme görevinde hata oranı yüksek; hızdan çok doğruluğa odaklanmak gerekebilir.');
  }
  return notes;
}
