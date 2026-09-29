/**
 * Klasik test kuramına dayalı madde ve güvenirlik analizleri. Saf fonksiyonlardır (veritabanı yok);
 * psikometri laboratuvarı sayfası ve birim testleri kullanır.
 *
 * Eşikler ve dayanakları:
 * - Düzeltilmiş madde-toplam korelasyonu (likert) ve nokta çift serili korelasyon (doğru/yanlış
 *   maddeler) .20’nin altındaysa madde zayıf ayırt ediyor sayılır (Ebel ve Frisbie, 1991).
 * - Güçlük (p) .90’ın üstünde “çok kolay”, .20’nin altında “çok zor”.
 * - Öğrencilerin %5’inden azının seçtiği çeldirici “işlemeyen çeldirici”dir (Haladyna ve Downing, 1993).
 * - Çeldiriciyi seçmek toplam puanla pozitif ilişkiliyse (güçlü öğrenciler o seçeneğe gidiyorsa)
 *   anahtar ya da seçenek metni gözden geçirilmelidir.
 * - 30’dan az kişiyle hesaplanan korelasyonlar kararsızdır; sayfada ayrıca belirtilir.
 * - Güvenirlik ve norm grubu büyüklüğü, EFPA test değerlendirme modelinin (sürüm 4.2.6, 2013) düşük
 *   riskli kullanım ölçütleriyle derecelendirilir: alfa < .70 yetersiz, .70–.79 yeterli, .80–.89 iyi,
 *   ≥ .90 çok iyi; norm grubu < 200 yetersiz, 200–299 yeterli, 300–999 iyi, ≥ 1000 çok iyi.
 */
import type { LikertInstrument, QuizForm } from '@/lib/instruments/types';
import { cronbachAlpha, mean, pearson, standardError, variance } from '@/lib/scoring/stats';

export const THRESHOLDS = {
  discrimination: 0.2,
  easy: 0.9,
  hard: 0.2,
  nonFunctioning: 0.05,
  alphaGain: 0.01,
  minStableN: 30,
  /** Bir seçeneğin toplandığı taban/tavan etkisi. */
  extremeShare: 0.8,
} as const;

/** Norm grubu için en az kişi sayısı: ön norm EFPA’ya göre “yeterli”, kesin norm “iyi” düzeyinde olmalı. */
export const NORM_MIN_N = { provisional: 200, final: 300 } as const;

export type Rating = 'inadequate' | 'adequate' | 'good' | 'excellent';

export const RATING_LABELS: Record<Rating, string> = {
  inadequate: 'Yetersiz',
  adequate: 'Yeterli',
  good: 'İyi',
  excellent: 'Çok iyi',
};

export function reliabilityRating(r: number): Rating {
  if (r >= 0.9) return 'excellent';
  if (r >= 0.8) return 'good';
  if (r >= 0.7) return 'adequate';
  return 'inadequate';
}

export function normSizeRating(n: number): Rating {
  if (n >= 1000) return 'excellent';
  if (n >= 300) return 'good';
  if (n >= 200) return 'adequate';
  return 'inadequate';
}

/* ---------- Temel istatistikler ---------- */

export function sd(xs: number[]): number | null {
  return xs.length >= 2 ? Math.sqrt(variance(xs)) : null;
}

/** Düzeltilmiş çarpıklık katsayısı (G1). */
export function skewness(xs: number[]): number | null {
  const n = xs.length;
  if (n < 3) return null;
  const m = mean(xs);
  const s = Math.sqrt(variance(xs));
  if (s === 0) return null;
  const sum = xs.reduce((acc, x) => acc + ((x - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

/** Her madde çıkarıldığında kalan maddelerin alfa katsayısı. */
export function alphaIfDeleted(rows: number[][]): (number | null)[] {
  if (!rows.length) return [];
  const k = rows[0].length;
  return Array.from({ length: k }, (_, j) => (k > 2 ? cronbachAlpha(rows.map((r) => r.filter((_, i) => i !== j))) : null));
}

/** Düzeltilmiş madde-toplam korelasyonu: madde ile diğer maddelerin toplamı arasındaki korelasyon. */
export function correctedItemTotal(rows: number[][]): (number | null)[] {
  if (!rows.length) return [];
  const k = rows[0].length;
  const totals = rows.map((r) => r.reduce((s, v) => s + v, 0));
  return Array.from({ length: k }, (_, j) =>
    pearson(
      rows.map((r) => r[j]),
      rows.map((r, i) => totals[i] - r[j]),
    ),
  );
}

/**
 * Ayırt edicilik indeksi (D): toplam puana göre en üstteki %27 ile en alttaki %27’nin maddeyi
 * doğru cevaplama oranları farkı.
 */
export function discriminationIndex(item: number[], totals: number[]): number | null {
  const n = item.length;
  if (n < 10 || totals.length !== n) return null;
  const g = Math.max(1, Math.round(n * 0.27));
  const order = totals.map((t, i) => [t, i] as const).sort((a, b) => a[0] - b[0]);
  const low = order.slice(0, g).map(([, i]) => item[i]);
  const high = order.slice(n - g).map(([, i]) => item[i]);
  return mean(high) - mean(low);
}

/** Spearman-Brown düzeltmeli tek-çift yarılama güvenirliği. */
export function splitHalf(odd: number[], even: number[]): number | null {
  const r = pearson(odd, even);
  if (r === null || r <= -1) return null;
  return (2 * r) / (1 + r);
}

/* ---------- Likert ölçekleri ---------- */

export interface LikertItemStat {
  key: string;
  text: string;
  reverse: boolean;
  n: number;
  mean: number | null;
  sd: number | null;
  /** Seçeneklerin (tanımdaki sırayla) seçilme oranları. */
  dist: number[];
  citc: number | null;
  alphaIfDeleted: number | null;
  flags: string[];
}

export interface LikertScaleStat {
  key: string;
  name: string;
  nItems: number;
  /** Bütün maddeleri cevaplayan kişi sayısı (alfa bu kişilerle hesaplanır). */
  nComplete: number;
  alpha: number | null;
  items: LikertItemStat[];
  flags: string[];
}

/**
 * `people`: her kişinin madde anahtarı → işaretlenen değer (ters çevrilmemiş) eşlemesi.
 * Alfa ve madde-toplam korelasyonları ters maddeler çevrildikten sonra, maddelerin hepsini
 * cevaplayan kişilerle hesaplanır.
 */
export function analyzeLikert(def: LikertInstrument, people: Record<string, number>[]): LikertScaleStat[] {
  const values = def.options.map((o) => o.value);
  const optMin = Math.min(...values);
  const optMax = Math.max(...values);
  return def.scales.map((scale) => {
    const items = def.items.filter((i) => i.scale === scale.key);
    const keyed = (key: string, v: number) => (items.find((i) => i.key === key)?.reverse ? optMin + optMax - v : v);
    const complete = people
      .filter((p) => items.every((i) => Number.isFinite(p[i.key])))
      .map((p) => items.map((i) => keyed(i.key, p[i.key])));
    const alpha = cronbachAlpha(complete);
    const citc = correctedItemTotal(complete);
    const aid = alphaIfDeleted(complete);
    const itemStats: LikertItemStat[] = items.map((it, j) => {
      const vs = people.map((p) => p[it.key]).filter((v): v is number => Number.isFinite(v));
      const dist = values.map((v) => (vs.length ? vs.filter((x) => x === v).length / vs.length : 0));
      const flags: string[] = [];
      const c = complete.length >= 3 ? citc[j] : null;
      if (c !== null && c < THRESHOLDS.discrimination) flags.push(c < 0 ? 'Toplamla ters yönde ilişkili: anahtar yönünü kontrol edin' : 'Zayıf madde-toplam ilişkisi');
      if (alpha !== null && aid[j] !== null && aid[j]! > alpha + THRESHOLDS.alphaGain) flags.push('Çıkarılınca güvenirlik artıyor');
      if (vs.length >= 10 && Math.max(dist[0], dist[dist.length - 1]) >= THRESHOLDS.extremeShare) flags.push('Cevaplar bir uçta toplanmış');
      return {
        key: it.key,
        text: it.text,
        reverse: !!it.reverse,
        n: vs.length,
        mean: vs.length ? mean(vs) : null,
        sd: sd(vs),
        dist,
        citc: c,
        alphaIfDeleted: complete.length >= 3 ? aid[j] : null,
        flags,
      };
    });
    const flags: string[] = [];
    if (alpha !== null && alpha < 0.7) flags.push('Güvenirlik EFPA ölçütüne göre yetersiz (alfa < .70)');
    if (complete.length < THRESHOLDS.minStableN) flags.push(`Kişi sayısı ${THRESHOLDS.minStableN}’dan az: değerler kararsız`);
    return { key: scale.key, name: scale.name, nItems: items.length, nComplete: complete.length, alpha, items: itemStats, flags };
  });
}

/* ---------- Doğru/yanlış puanlanan maddeler (akademik testler, okuma soruları) ---------- */

export interface ChoiceStat {
  key: string;
  label: string;
  isKey: boolean;
  share: number;
  /** Bu seçeneği seçmek (1/0) ile maddenin dışındaki toplam puan arasındaki korelasyon. */
  pbis: number | null;
  note?: string;
}

export interface DichotomousItemStat {
  key: string;
  no: number;
  text: string;
  group?: string;
  n: number;
  p: number | null;
  pbis: number | null;
  d: number | null;
  choices: ChoiceStat[];
  flags: string[];
}

export interface DichotomousStat {
  n: number;
  k: number;
  /** KR-20 (iki kategorili maddelerde Cronbach alfaya eşittir). */
  kr20: number | null;
  meanCorrect: number | null;
  sdCorrect: number | null;
  sem: number | null;
  items: DichotomousItemStat[];
}

export interface DichotomousItemSpec {
  key: string;
  text: string;
  group?: string;
  answer: string;
  choices: { key: string; label: string; note?: string }[];
}

/**
 * `people`: her kişinin madde anahtarı → seçtiği seçenek eşlemesi. Boş bırakılan ya da
 * “Bilmiyorum” (X) denen madde yanlış sayılır. Nokta çift serili korelasyon, maddenin kendisi
 * çıkarılmış toplamla hesaplanır (düzeltilmiş).
 */
export function analyzeDichotomous(spec: DichotomousItemSpec[], people: Record<string, string | undefined>[]): DichotomousStat {
  const matrix: number[][] = people.map((p) => spec.map((it) => (p[it.key] === it.answer ? 1 : 0)));
  const totals = matrix.map((r) => r.reduce((s, v) => s + v, 0));
  const n = people.length;
  const kr20 = cronbachAlpha(matrix);
  const sdc = sd(totals);
  const items: DichotomousItemStat[] = spec.map((it, j) => {
    const col = matrix.map((r) => r[j]);
    const rest = totals.map((t, i) => t - col[i]);
    const p = n ? mean(col) : null;
    const pbis = pearson(col, rest);
    const choices: ChoiceStat[] = it.choices.map((c) => {
      const chose: number[] = people.map((pp) => (pp[it.key] === c.key ? 1 : 0));
      const share = n ? mean(chose) : 0;
      return { key: c.key, label: c.label, isKey: c.key === it.answer, share, pbis: pearson(chose, rest), note: c.note };
    });
    const flags: string[] = [];
    if (p !== null && n >= 10) {
      if (p > THRESHOLDS.easy) flags.push('Çok kolay');
      if (p < THRESHOLDS.hard) flags.push('Çok zor');
    }
    if (pbis !== null && pbis < THRESHOLDS.discrimination) flags.push(pbis < 0 ? 'Güçlü öğrenciler daha sık yanlış yapıyor: anahtarı kontrol edin' : 'Ayırt edicilik düşük');
    if (n >= 20) {
      for (const c of choices) {
        if (c.isKey || c.key === 'X' || c.key === '') continue;
        if (c.share < THRESHOLDS.nonFunctioning) flags.push(`${c.label} seçeneği işlemiyor (%${Math.round(c.share * 100)})`);
        else if (c.pbis !== null && c.pbis > 0.05) flags.push(`${c.label} seçeneği güçlü öğrencileri çekiyor`);
      }
    }
    return { key: it.key, no: j + 1, text: it.text, group: it.group, n, p, pbis, d: discriminationIndex(col, rest), choices, flags };
  });
  return {
    n,
    k: spec.length,
    kr20,
    meanCorrect: n ? mean(totals) : null,
    sdCorrect: sdc,
    sem: sdc !== null && kr20 !== null ? standardError(sdc, kr20) : null,
    items,
  };
}

/** Akademik tanı testi formunu doğru/yanlış madde tanımlarına çevirir. */
export function quizSpec(form: QuizForm, misconceptionNames: Record<string, string>): DichotomousItemSpec[] {
  const domainName = new Map(form.domains.map((d) => [d.key, d.name]));
  return form.items.map((it) => ({
    key: it.key,
    text: it.text,
    group: domainName.get(it.domain) ?? it.domain,
    answer: it.answer,
    choices: [
      ...it.options.map((o) => ({
        key: o.key,
        label: o.key,
        note: o.misconception ? misconceptionNames[o.misconception] ?? o.misconception : undefined,
      })),
      { key: 'X', label: 'Bilmiyorum' },
    ],
  }));
}

/* ---------- Norm istatistikleri ---------- */

export interface NormPreview {
  scaleKey: string;
  name: string;
  n: number;
  mean: number | null;
  sd: number | null;
  skew: number | null;
  alpha: number | null;
  flags: string[];
}

/** Norm grubunun ölçek istatistikleri; çarpık dağılımlarda normal yaklaşımın yanıltabileceği belirtilir. */
export function normPreview(scale: { key: string; name: string }, values: number[], alpha: number | null): NormPreview {
  const flags: string[] = [];
  const skew = skewness(values);
  if (skew !== null && Math.abs(skew) > 1) flags.push('Dağılım belirgin biçimde çarpık: yüzdelikler normal dağılım varsayımıyla hesaplandığı için uçlarda sapabilir');
  const s = sd(values);
  if (s !== null && s === 0) flags.push('Puanların hepsi aynı');
  return { scaleKey: scale.key, name: scale.name, n: values.length, mean: values.length ? mean(values) : null, sd: s, skew, alpha, flags };
}
