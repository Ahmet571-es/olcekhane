/**
 * Sesli okuma kaydının cihazda çözümlenmesi. Yalnızca ses örnekleri üzerinde sayısal işlem yapılır; yapay zekâ ya da
 * konuşma tanıma kullanılmaz ve ses hiçbir yere gönderilmez. Sunucuya yalnızca buradaki özet sayılar (süre,
 * duraklamaların başlangıç ve bitişleri, kaba ses yüksekliği eğrisi) gider: bunlardan ses geri üretilemez.
 *
 * - Yeniden örnekleme: mikrofonun örnekleme hızı (çoğunlukla 44,1 ya da 48 kHz) konuşma için yeterli olan 16 kHz'e
 *   indirilir (önce alçak geçiren süzgeç, sonra ara değer bulma). Bellekte daha az yer tutar.
 * - WAV: kayıt sıkıştırılmadan (16 bit PCM) dinlenir; her tarayıcıda çalınır ve istenen saniyeye tam atlanır.
 * - Çözümleme: 20 ms'lik çerçevelerin ses düzeyi; arka plan düzeyi ile konuşma düzeyi arasındaki eşiğe göre konuşma
 *   ve sessizlik bölümleri; okumanın başlangıcı ve bitişi; duraklamalar; kayıt kalitesi.
 */

export const TARGET_RATE = 16000;
export const FRAME_MS = 20;

/** Akış hâlinde yeniden örnekleme (alçak geçiren FIR süzgeç + doğrusal ara değer). */
export class Resampler {
  private readonly ratio: number;
  private readonly taps: Float32Array;
  private hist: Float32Array;
  private lastFiltered = 0;
  /** Bu parçanın ilk örneğinin akış içindeki sırası. */
  private n0 = 0;
  /** Sıradaki çıkış örneğinin giriş akışındaki (kesirli) yeri. */
  private next = 0;

  constructor(
    readonly inRate: number,
    readonly outRate = TARGET_RATE,
  ) {
    this.ratio = inRate / outRate;
    const cutoff = (0.45 * Math.min(inRate, outRate)) / inRate; // örnekleme hızına oranla
    const n = 31;
    const taps = new Float32Array(n);
    let sum = 0;
    for (let k = 0; k < n; k++) {
      const m = k - (n - 1) / 2;
      const sinc = m === 0 ? 2 * cutoff : Math.sin(2 * Math.PI * cutoff * m) / (Math.PI * m);
      const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / (n - 1));
      taps[k] = sinc * hann;
      sum += taps[k];
    }
    for (let k = 0; k < n; k++) taps[k] /= sum;
    this.taps = taps;
    this.hist = new Float32Array(n - 1);
  }

  push(x: Float32Array): Float32Array {
    if (this.inRate === this.outRate) return x.slice();
    const L = this.taps.length;
    const len = x.length;
    if (len === 0) return new Float32Array(0);
    const buf = new Float32Array(L - 1 + len);
    buf.set(this.hist, 0);
    buf.set(x, L - 1);
    const y = new Float32Array(len);
    for (let n = 0; n < len; n++) {
      let acc = 0;
      for (let k = 0; k < L; k++) acc += this.taps[k] * buf[n + L - 1 - k];
      y[n] = acc;
    }
    this.hist = buf.slice(buf.length - (L - 1));
    const out: number[] = [];
    const end = this.n0 + len - 1;
    while (Math.floor(this.next) + 1 <= end) {
      const i = Math.floor(this.next);
      const f = this.next - i;
      const a = i < this.n0 ? this.lastFiltered : y[i - this.n0];
      const b = y[i + 1 - this.n0];
      out.push(a + (b - a) * f);
      this.next += this.ratio;
    }
    this.lastFiltered = y[len - 1];
    this.n0 += len;
    return Float32Array.from(out);
  }
}

/** Parçaları tek diziye birleştirir. */
export function joinChunks(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Float32Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

/** 16 bit PCM, tek kanallı WAV dosyası. */
export function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buffer);
  const text = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  text(0, 'RIFF');
  v.setUint32(4, 36 + samples.length * 2, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  text(36, 'data');
  v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

/** Bir parçanın ses düzeyi (dBFS) ve tepe değeri: seviye göstergesi için. */
export function chunkLevel(x: Float32Array): { db: number; peak: number } {
  let sum = 0;
  let peak = 0;
  for (let i = 0; i < x.length; i++) {
    const a = Math.abs(x[i]);
    sum += x[i] * x[i];
    if (a > peak) peak = a;
  }
  const rms = x.length ? Math.sqrt(sum / x.length) : 0;
  return { db: toDb(rms), peak };
}

export const toDb = (rms: number) => Math.max(-100, 20 * Math.log10(rms + 1e-10));

/** 20 ms'lik çerçevelerin ses düzeyleri (dBFS). */
export function frameLevels(samples: Float32Array, sampleRate: number, frameMs = FRAME_MS): Float32Array {
  const size = Math.max(1, Math.round((sampleRate * frameMs) / 1000));
  const n = Math.floor(samples.length / size);
  const out = new Float32Array(n);
  for (let f = 0; f < n; f++) {
    let sum = 0;
    for (let i = f * size; i < (f + 1) * size; i++) sum += samples[i] * samples[i];
    out[f] = toDb(Math.sqrt(sum / size));
  }
  return out;
}

function percentile(values: Float32Array, p: number): number {
  if (values.length === 0) return -100;
  const s = Array.from(values).sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))));
  return s[idx];
}

/**
 * Kaydın tamamı için kaba ses yüksekliği eğrisi (0–100, `points` nokta): dinleme ekranındaki zaman çizelgesi için.
 * Her nokta, o aralıktaki en yüksek çerçeve düzeyidir; arka plan ile konuşma düzeyi arasına yayılır.
 */
export function overviewContour(samples: Float32Array, sampleRate: number, points = 160): number[] {
  const levels = frameLevels(samples, sampleRate);
  if (levels.length === 0) return [];
  const lo = percentile(levels, 10);
  const hi = Math.max(lo + 1, percentile(levels, 98));
  const out: number[] = [];
  const n = Math.min(points, levels.length);
  for (let b = 0; b < n; b++) {
    const a = Math.floor((b * levels.length) / n);
    const z = Math.max(a + 1, Math.floor(((b + 1) * levels.length) / n));
    let m = -100;
    for (let i = a; i < z; i++) m = Math.max(m, levels[i]);
    out.push(Math.round(Math.max(0, Math.min(100, ((m - lo) / (hi - lo)) * 100))));
  }
  return out;
}

export type AudioQuality = 'good' | 'quiet' | 'noisy' | 'clipped' | 'silent';

export interface AudioAnalysis {
  durationMs: number;
  /** Arka plan (sessizlik) düzeyi ve konuşma düzeyi (dBFS), aradaki fark. */
  noiseDb: number;
  speechDb: number;
  snrDb: number;
  /** Örneklerin kaçta kaçı tepe değerine (kırpılma) ulaştı. */
  clipRatio: number;
  /** Okumanın başladığı ve bittiği an (ilk ve son konuşma); konuşma bulunamazsa null. */
  speechStartMs: number | null;
  speechEndMs: number | null;
  /** Okuma boyunca konuşulan toplam süre. */
  speechMs: number;
  /** Okuma içindeki sessizlikler (en az 250 ms): [başlangıç, bitiş], okumanın başından itibaren. */
  pauses: [number, number][];
  /** Okuma boyunca kaba ses yüksekliği eğrisi (0–100), eşit aralıklı 120 nokta. */
  contour: number[];
  quality: AudioQuality;
}

/** Konuşma sayılacak en kısa bölüm ve iki konuşma bölümü arasındaki en kısa sessizlik. */
const MIN_VOICE_MS = 60;
const BRIDGE_MS = 160;
export const MIN_PAUSE_MS = 250;
const CONTOUR_POINTS = 120;

export function analyzeRecording(samples: Float32Array, sampleRate: number): AudioAnalysis {
  const durationMs = (samples.length / sampleRate) * 1000;
  const levels = frameLevels(samples, sampleRate);
  let clipped = 0;
  for (let i = 0; i < samples.length; i++) if (Math.abs(samples[i]) >= 0.985) clipped++;
  const clipRatio = samples.length ? clipped / samples.length : 0;
  const noiseDb = percentile(levels, 10);
  const speechDb = percentile(levels, 95);
  const snrDb = speechDb - noiseDb;
  const empty: AudioAnalysis = {
    durationMs,
    noiseDb,
    speechDb,
    snrDb,
    clipRatio,
    speechStartMs: null,
    speechEndMs: null,
    speechMs: 0,
    pauses: [],
    contour: [],
    quality: 'silent',
  };
  // Hiç ses yoksa ya da konuşma ile arka plan ayırt edilemiyorsa konuşma bölümleri aranmaz.
  if (levels.length === 0 || speechDb < -60 || snrDb < 6) return empty;

  const threshold = Math.min(noiseDb + Math.min(15, Math.max(6, 0.3 * snrDb)), speechDb - 6);
  const voiced = Array.from(levels, (d) => d > threshold);
  // Kısa sessizlikleri (kelime içindeki duraklar) köprüle, çok kısa sesleri (tık, çıtırtı) at.
  const bridge = Math.round(BRIDGE_MS / FRAME_MS);
  const minVoice = Math.round(MIN_VOICE_MS / FRAME_MS);
  const runs = (arr: boolean[]) => {
    const out: { v: boolean; s: number; e: number }[] = [];
    for (let i = 0; i < arr.length; ) {
      let j = i;
      while (j < arr.length && arr[j] === arr[i]) j++;
      out.push({ v: arr[i], s: i, e: j });
      i = j;
    }
    return out;
  };
  for (const r of runs(voiced)) if (!r.v && r.s > 0 && r.e < voiced.length && r.e - r.s <= bridge) voiced.fill(true, r.s, r.e);
  for (const r of runs(voiced)) if (r.v && r.e - r.s < minVoice) voiced.fill(false, r.s, r.e);
  const segs = runs(voiced).filter((r) => r.v);
  if (segs.length === 0) return { ...empty, quality: 'silent' };

  const start = segs[0].s;
  const end = segs[segs.length - 1].e;
  const speechStartMs = start * FRAME_MS;
  const speechEndMs = end * FRAME_MS;
  const speechMs = segs.reduce((n, r) => n + (r.e - r.s) * FRAME_MS, 0);
  const pauses: [number, number][] = [];
  for (let k = 1; k < segs.length; k++) {
    const gs = segs[k - 1].e * FRAME_MS;
    const ge = segs[k].s * FRAME_MS;
    if (ge - gs >= MIN_PAUSE_MS) pauses.push([gs - speechStartMs, ge - speechStartMs]);
  }
  const contour: number[] = [];
  const span = end - start;
  for (let b = 0; b < CONTOUR_POINTS; b++) {
    const a = start + Math.floor((b * span) / CONTOUR_POINTS);
    const z = Math.max(a + 1, start + Math.floor(((b + 1) * span) / CONTOUR_POINTS));
    let sum = 0;
    for (let i = a; i < z; i++) sum += levels[i];
    const mean = sum / (z - a);
    contour.push(Math.round(Math.max(0, Math.min(100, ((mean - noiseDb) / Math.max(1, speechDb - noiseDb)) * 100))));
  }
  let quality: AudioQuality = 'good';
  if (clipRatio > 0.003) quality = 'clipped';
  else if (speechDb < -42) quality = 'quiet';
  else if (snrDb < 15) quality = 'noisy';
  return { durationMs, noiseDb, speechDb, snrDb, clipRatio, speechStartMs, speechEndMs, speechMs, pauses, contour, quality };
}
