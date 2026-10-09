import { ITEM_NOUN_PLURAL, likertItemNoun } from '@/lib/instruments/nouns';
import type { AnchoredBands, Band, LikertInstrument, LikertItemDef, ScaleDef } from '@/lib/instruments/types';
import { clamp, median, normalCdf, round, standardError, Z90 } from './stats';

/**
 * Bir ölçeğin maddeleri; bileşik ölçekte (`of`) alt ölçeklerin bütün maddeleri. Birden çok ölçekte yer alan madde
 * (`alsoScales`) her ölçeğin listesine bir kez girer.
 */
export function scaleItems(def: LikertInstrument, scale: ScaleDef): LikertItemDef[] {
  const keys = scale.of ?? [scale.key];
  return def.items.filter((i) => keys.includes(i.scale) || !!i.alsoScales?.some((k) => keys.includes(k)));
}

export interface NormStat {
  normSetId: string;
  mean: number;
  sd: number;
  reliability?: number | null;
}

export interface ScaleScore {
  scaleKey: string;
  /** Ters maddeler çevrildikten sonraki toplam; eksik madde varsa orantılanmış toplam. */
  raw: number | null;
  /** Madde ortalaması. */
  mean: number | null;
  nAnswered: number;
  nItems: number;
  valid: boolean;
  /** Yorumda kullanılan değer: ölçek ortalama puanlıysa `mean`, toplam puanlıysa `raw`. */
  value: number | null;
  valueMin: number;
  valueMax: number;
  band: Band | null;
  basis: 'anchored' | 'norm';
  z?: number;
  t?: number;
  percentile?: number;
  normSetId?: string;
  /** %90 güven aralığı (value ile aynı ölçekte). */
  ciLow?: number;
  ciHigh?: number;
}

export interface LikertAnswer {
  value: number;
  rtMs?: number | null;
}

export interface QualityReport {
  tooFast: boolean;
  straightLining: boolean;
  incomplete: boolean;
  /** Birbirinin tersi olan madde çiftlerinden ikisine de en yüksek (agree) ya da en düşük (disagree) seçenek verilenler. */
  oppositeAgree: number;
  oppositeDisagree: number;
  medianRtMs: number | null;
  longestRun: number;
  notes: string[];
}

/** Yüzdelik değeri beş düzeye çevirir (norm varken kullanılır). */
export function percentileBand(p: number): Band {
  if (p < 10) return 'very_low';
  if (p < 30) return 'low';
  if (p <= 70) return 'average';
  if (p <= 90) return 'high';
  return 'very_high';
}

export function anchoredBand(value: number, bands: AnchoredBands): Band {
  const sorted = [...bands.thresholds].sort((a, b) => a.min - b.min);
  let current = sorted[0].band;
  for (const th of sorted) {
    if (value >= th.min - 1e-9) current = th.band;
  }
  return current;
}

export function scoreLikert(
  def: LikertInstrument,
  answers: Record<string, LikertAnswer>,
  norms: Record<string, NormStat> = {},
): ScaleScore[] {
  const values = def.options.map((o) => o.value);
  const optMin = Math.min(...values);
  const optMax = Math.max(...values);

  return def.scales.map((scale) => {
    const items = scaleItems(def, scale);
    const nItems = items.length;
    const keyed: number[] = [];
    for (const item of items) {
      const a = answers[item.key];
      if (!a || !Number.isFinite(a.value)) continue;
      const v = clamp(a.value, optMin, optMax);
      keyed.push(item.reverse ? optMin + optMax - v : v);
    }
    const nAnswered = keyed.length;
    const valid = nItems > 0 && nAnswered / nItems >= def.scoring.minAnsweredRatio - 1e-9;
    const valueMin = def.scoring.method === 'mean' ? optMin : optMin * nItems;
    const valueMax = def.scoring.method === 'mean' ? optMax : optMax * nItems;

    if (!valid) {
      return {
        scaleKey: scale.key,
        raw: null,
        mean: null,
        nAnswered,
        nItems,
        valid: false,
        value: null,
        valueMin,
        valueMax,
        band: null,
        basis: 'anchored' as const,
      };
    }

    const itemMean = keyed.reduce((s, v) => s + v, 0) / nAnswered;
    const raw = itemMean * nItems; // eksik maddeler ortalamayla orantılanır
    const value = def.scoring.method === 'mean' ? itemMean : raw;

    const norm = norms[scale.key];
    if (norm && norm.sd > 0) {
      const z = (value - norm.mean) / norm.sd;
      const percentile = normalCdf(z) * 100;
      const rel = norm.reliability ?? scale.alpha;
      const sem = rel ? standardError(norm.sd, rel) : undefined;
      return {
        scaleKey: scale.key,
        raw: round(raw, 3),
        mean: round(itemMean, 3),
        nAnswered,
        nItems,
        valid: true,
        value: round(value, 3),
        valueMin,
        valueMax,
        band: percentileBand(percentile),
        basis: 'norm' as const,
        z: round(z, 3),
        t: round(50 + 10 * z, 1),
        percentile: round(percentile, 1),
        normSetId: norm.normSetId,
        ciLow: sem !== undefined ? round(clamp(value - Z90 * sem, valueMin, valueMax), 3) : undefined,
        ciHigh: sem !== undefined ? round(clamp(value + Z90 * sem, valueMin, valueMax), 3) : undefined,
      };
    }

    const sem = scale.alpha && scale.sdRef ? standardError(scale.sdRef, scale.alpha) : undefined;
    return {
      scaleKey: scale.key,
      raw: round(raw, 3),
      mean: round(itemMean, 3),
      nAnswered,
      nItems,
      valid: true,
      value: round(value, 3),
      valueMin,
      valueMax,
      // Ortalama puan raporda bir ondalıkla gösterilir (ör. 2,6 / 5); düzey de gösterilen sayıdan belirlenir. Yoksa 8 ya da 9
      // maddelik bir ölçekte 23/9 = 2,556 "2,6 / 5 · Düşük" diye görünürdü (eşik 2,6).
      band: anchoredBand(def.scoring.method === 'mean' ? round(round(itemMean, 3), 1) : value, def.anchoredBands),
      basis: 'anchored' as const,
      ciLow: sem !== undefined ? round(clamp(value - Z90 * sem, valueMin, valueMax), 3) : undefined,
      ciHigh: sem !== undefined ? round(clamp(value + Z90 * sem, valueMin, valueMax), 3) : undefined,
    };
  });
}

/**
 * Cevap kalitesi göstergeleri. Sonucu geçersiz kılmaz; raporda dikkat notu olarak gösterilir.
 * - Çok hızlı: madde başına ortanca cevap süresi 700 ms'den kısa (cümleyi okumaya yetmeyecek kadar).
 * - Düz çizgi: 12 veya daha fazla madde üst üste aynı seçenek (ters maddeler olduğu için anlamlı değildir). Sıklık
 *   soran etkinlik testlerinde (profil: activities) "hiç yapmadım" ve "son bir yılda yapmadım" cevaplarının üst üste
 *   gelmesi olağandır (az etkinlik yapan biri için); bu iki cevabın dizileri sayılmaz.
 */
export function likertQuality(def: LikertInstrument, answers: Record<string, LikertAnswer>): QualityReport {
  const ordered = def.items.map((i) => answers[i.key]);
  const answered = ordered.filter((a): a is LikertAnswer => !!a && Number.isFinite(a.value));
  const rts = answered.map((a) => a.rtMs).filter((v): v is number => typeof v === 'number' && v > 0);
  const medianRtMs = rts.length ? median(rts) : null;
  const lowest = Math.min(...def.options.map((o) => o.value));
  const ignoredRun = (v: number) => def.profile === 'activities' && v <= lowest + 1;

  let longestRun = 0;
  let run = 0;
  let prev: number | undefined;
  for (const a of ordered) {
    if (!a || ignoredRun(a.value)) {
      run = 0;
      prev = undefined;
      continue;
    }
    run = a.value === prev ? run + 1 : 1;
    prev = a.value;
    longestRun = Math.max(longestRun, run);
  }

  // Birbirinin tersi olan çiftler: ikisine de aynı uç cevap.
  const highest = Math.max(...def.options.map((o) => o.value));
  const pairs = (def.oppositePairs ?? []).map(([x, y]) => [answers[x]?.value, answers[y]?.value]);
  // Beş ya da daha çok seçenekli ölçekte uçtaki iki seçenek birlikte sayılır ("Sık sık" ve "Her zaman"): evet deme
  // eğilimi olan biri her cümleye en uç seçeneği vermeyebilir; az seçenekli ölçekte (ör. üç seçenek) yalnızca en uç.
  const wide = def.options.length >= 5 ? 1 : 0;
  const agrees = (v: number | undefined) => v !== undefined && v >= highest - wide;
  const disagrees = (v: number | undefined) => v !== undefined && v <= lowest + wide;
  const oppositeAgree = pairs.filter(([x, y]) => agrees(x) && agrees(y)).length;
  const oppositeDisagree = pairs.filter(([x, y]) => disagrees(x) && disagrees(y)).length;
  const tendency = (n: number) => def.oppositePairs !== undefined && n >= Math.ceil(def.oppositePairs.length / 2);
  const label = (v: number) => def.options.find((o) => o.value === v)?.label ?? '';
  const labels = (v: number, toward: number) => (wide ? `“${label(Math.min(v, v + toward))}” ya da “${label(Math.max(v, v + toward))}”` : `“${label(v)}”`);

  const notes: string[] = [];
  const tooFast = medianRtMs !== null && rts.length >= 5 && medianRtMs < 700;
  const straightLining = def.items.length >= 20 && longestRun >= 12;
  const incomplete = answered.length < def.items.length;
  if (tooFast) notes.push(`Cevaplar çok hızlı verilmiş; bazı ${ITEM_NOUN_PLURAL[likertItemNoun(def)]} okunmadan işaretlenmiş olabilir.`);
  if (straightLining) notes.push('Uzun bir bölümde hep aynı seçenek işaretlenmiş.');
  if (incomplete) notes.push('Bazı maddeler cevaplanmamış.');
  for (const [n, v, toward, what] of [
    [oppositeAgree, highest, -1, 'evet'],
    [oppositeDisagree, lowest, 1, 'hayır'],
  ] as const) {
    if (!tendency(n)) continue;
    notes.push(
      `Birbirinin tersini söyleyen ${def.oppositePairs!.length} cümle çiftinden ${n} tanesinde iki cümleye de ${labels(v, toward)} denmiş. Bu, cümlelerin ne söylediğine bakmadan çoğuna “${what}” deme eğiliminden kaynaklanabilir; bu yüzden sonuçlar dikkatle yorumlanmalıdır.`,
    );
  }
  return { tooFast, straightLining, incomplete, oppositeAgree, oppositeDisagree, medianRtMs, longestRun, notes };
}
