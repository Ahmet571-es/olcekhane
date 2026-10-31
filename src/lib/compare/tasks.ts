import type { ScoreRow } from '@/lib/assessment/score-rows';
import type { CognitiveTask, TaskInstrument } from '@/lib/instruments/types';
import {
  arithMedian,
  arithPct,
  degreesValue,
  pctValue,
  sec1Value,
  secondsValue,
  sgPct,
  sgSecValue,
  snValue,
  towerTenths,
  type CognitiveBlock,
  type ReportContent,
} from '@/lib/reports/build';
import { arithRead, type ArithSectionResult } from '@/lib/scoring/tasks';
import type { CompareFormat, CompareInfo, CompareScale, CompareUnit } from './record';

/**
 * Gelişimini karşılaştır: görev (zekâ ve dikkat) testleri. Her testte karşılaştırılan sayılar raporda yazan ana sonuçlardır
 * (doğru sayısı ya da oranı, ulaşılan düzey, en uzun dizi, tipik süre) ve raporun kendi yuvarlamasıyla hesaplanır (aynı
 * yardımcılar: lib/reports/build.ts). Kural ve soru türü dökümleri ve iki ölçümün farkından hesaplanan etkiler (renk-kelime
 * etkisi, kural değiştirme, döndürme ve seçim etkisi, sayı-harf geçişi, zorluk artınca değişim, dikkati sürdürme)
 * karşılaştırılmaz: iki ölçümün farkı olduğu için tek ölçümden çok daha oynaktırlar.
 *
 * Bir sayı yalnızca raporda kartı yorumlandıysa özete yazılır (`CognitiveBlock.interpreted`; kartı kuran işlev "Yorumlanmadı",
 * hesaplanamadı ya da sonucun rastgele cevaplarla da çıkabileceğini yazdığı yerde false yapar). Hiçbir sayı yazılamıyorsa
 * raporda karşılaştırma bölümü olmaz.
 *
 * Anahtarlar ve anlamları kalıcıdır: eski PDF'lerdeki özet bu anahtarlarla eşleşir. Bir sayının anlamı (ne sayıldığı,
 * birimi, yuvarlaması) değişirse testin sürümü (`version`) artırılır; böylece eski özetle karşılaştırılmaz.
 * `tests/karsilastirma.test.ts` tablonun bir kopyasını tutar: değişiklik bilerek yapılmalıdır.
 */

/** Görev testlerinin özetlerinin PDF'e yazılmaya başlandığı gün (bu sürüm). */
export const TASK_COMPARE_SINCE = '2026-10-31';

/** Üst sınırı yalnızca bozuk değeri ayıklayan sayılar (süreler, dakikadaki harf): çizimde aralık iki değere göre seçilir. */
const OPEN_CAP = 100_000;

/** Her uygulamada aynı soruların (ya da aynı kelime listesinin) geldiği görev türleri: hatırlananlar sonucu etkileyebilir. */
export const SAME_ITEMS = new Set<CognitiveTask['kind']>([
  'matrix_reasoning',
  'figural_analogy',
  'number_series',
  'letter_series',
  'verbal_reasoning',
  'logical_reasoning',
  'paper_folding',
  'numerical_reasoning',
  'cube_net',
  'mental_rotation_3d',
  'perspective',
  'hidden_figures',
  'cognitive_reflection',
  'vocabulary',
  'tower',
  'word_list',
]);

interface Ctx {
  def: TaskInstrument;
  row: ScoreRow;
  rows: ScoreRow[];
}

export interface TaskCompareSpec {
  /** Ölçeğin anahtarı (raporda aynı anahtarlı kart; kart yorumlanmadıysa sayı alınmaz). */
  key: string;
  /** Aynı karttan ikinci bir sayı: özette `${key}.${sub}`. */
  sub?: string;
  label: string;
  unit: CompareUnit;
  decimals: 0 | 1 | 2;
  /** Gösterim: "clock" tam saniye (0 → "1 sn’den kısa", 60 ve üstü dakikayla), "trim" ondalık sıfırlar yazılmaz. */
  format?: CompareFormat;
  /** Süre: büyümesi yavaşlamak demektir. */
  time?: true;
  /** "18/24" gibi gösterilir (en çok `max`). */
  outOf?: true;
  /** Üst sınır yalnızca bozuk değeri ayıklar. */
  open?: true;
  min?: number;
  max: (c: Ctx) => number;
  value: (c: Ctx) => number | null;
}

const task = <T extends CognitiveTask['kind']>(def: TaskInstrument, kind: T) =>
  def.tasks.find((t): t is Extract<CognitiveTask, { kind: T }> => t.kind === kind)!;
const levelsOf = (def: TaskInstrument) => ((def.tasks[0] as unknown as { levels?: unknown[] }).levels ?? []).length;
const extraOf = <T>(rows: ScoreRow[], key: string) => rows.find((r) => r.scaleKey === key)?.extra as unknown as T | undefined;

const raw = (c: Ctx) => c.row.raw;
/** Doğru sayısı (nAnswered) / soru sayısı (nItems): "24 soruda 18 doğru". */
const correct = (key: string, label = 'Doğru cevaplar'): TaskCompareSpec => ({ key, label, unit: '', decimals: 0, outOf: true, max: (c) => c.row.nItems, value: (c) => c.row.nAnswered });
const level = (key: string): TaskCompareSpec => ({ key, label: 'Ulaşılan düzey', unit: '', decimals: 0, max: (c) => levelsOf(c.def), value: raw });
/** `seconds` ile yazılan süre: "18 saniye", "bir saniyeden kısa", "1 dakika 15 saniye". */
const clock = (key: string, label = 'Soru başına tipik süre'): TaskCompareSpec => ({
  key,
  label,
  unit: 'sn',
  decimals: 0,
  format: 'clock',
  time: true,
  open: true,
  max: () => OPEN_CAP,
  value: (c) => (c.row.raw === null ? null : secondsValue(c.row.raw)),
});
/** `sn` ile yazılan süre (saniyenin yüzde biri): "0,73 saniye". */
const hundredths = (key: string, label: string, ms: (c: Ctx) => number | null = raw): TaskCompareSpec => ({
  key,
  label,
  unit: 'sn',
  decimals: 2,
  time: true,
  open: true,
  max: () => OPEN_CAP,
  value: (c) => {
    const m = ms(c);
    return m === null ? null : snValue(m);
  },
});
/** `pct` ile yazılan yüzde (oran kartın sonucundan). */
const percent = (key: string, label: string, rate: (c: Ctx) => number | null | undefined): TaskCompareSpec => ({
  key,
  label,
  unit: '%',
  decimals: 0,
  max: () => 100,
  value: (c) => {
    const x = rate(c);
    return x === null || x === undefined ? null : pctValue(x);
  },
});

const reasoning = (p: string): TaskCompareSpec[] => [correct(`${p}_dogru`), level(`${p}_duzey`), clock(`${p}_calisma`)];

const spanMax = (def: TaskInstrument, kind: 'digit_span' | 'spatial_span', direction?: 'forward' | 'backward') => {
  const t = def.tasks.find((x) => x.kind === kind && (!direction || (x as { direction?: string }).direction === direction)) as { sequences: number[][][] } | undefined;
  return t ? Math.max(...t.sequences.flat().map((s) => s.length)) : 9;
};

/** Zihinden hesaplamanın dört bölümü: toplamlar yalnızca dört bölüm de yorumlandıysa (yoksa eksik bölümle karşılaştırılırdı). */
const ARITH_KEYS = ['zh_toplama', 'zh_cikarma', 'zh_carpma', 'zh_bolme'] as const;
function arithAll(rows: ScoreRow[]): ArithSectionResult[] | null {
  const sections = ARITH_KEYS.map((k) => extraOf<ArithSectionResult>(rows, k));
  return sections.every((s): s is ArithSectionResult => !!s && arithRead(s)) ? sections : null;
}

interface NBackLevelLike {
  n: number;
  hitRate: number;
  falseAlarmRate: number;
}
const nBackLevel = (rows: ScoreRow[], n: number) => extraOf<{ levels: NBackLevelLike[] }>(rows, 'gh_bir')?.levels.find((l) => l.n === n);

interface RecognitionLike {
  hits: number;
  targets: number;
  lures: Record<string, number>;
  falseYes: Record<string, number>;
}
const recognition = (rows: ScoreRow[]) => extraOf<{ recognition: RecognitionLike }>(rows, 'kl_ogrenme')?.recognition;
const sumOf = (x: Record<string, number>) => Object.values(x).reduce((a, b) => a + b, 0);

/** Testlerin karşılaştırılan sayıları, testin ölçek sırasıyla. */
export const TASK_COMPARE: Record<string, TaskCompareSpec[]> = {
  'sekil-akil-yurutme': reasoning('sa'),
  'sekil-benzetmeleri': reasoning('sb'),
  'sayi-dizileri': reasoning('sd'),
  'harf-dizileri': reasoning('hd'),
  'sozel-akil-yurutme': reasoning('sz'),
  'kagit-katlama': reasoning('kk'),
  'kup-acinimi': reasoning('kp'),
  'gizli-sekiller': reasoning('gs'),
  'kelime-bilgisi': reasoning('kb'),
  'mantiksal-akil-yurutme': [correct('ma_dogru'), clock('ma_calisma')],
  'sayisal-akil-yurutme': [correct('sy_dogru'), clock('sy_calisma')],
  'uc-boyutlu-zihinde-dondurme': [correct('ud_dogru'), clock('ud_calisma')],
  'dusunerek-karar-verme': [correct('dk_dogru', 'Tuzaklı sorularda doğru'), clock('dk_calisma')],
  'bakis-acisi-alma': [
    { key: 'ba_hata', label: 'Ortalama hata', unit: 'derece', decimals: 1, format: 'trim', max: () => 180, value: (c) => (c.row.raw === null ? null : degreesValue(c.row.raw)) },
    clock('ba_calisma'),
  ],
  'zihinden-hesaplama-hizi': [
    {
      key: 'zh_genel',
      label: 'Dört bölümde doğru işlem',
      unit: '',
      decimals: 0,
      max: (c) => c.row.nItems,
      value: (c) => arithAll(c.rows)?.reduce((t, s) => t + s.correct, 0) ?? null,
    },
    ...(
      [
        ['zh_toplama', 'Toplama: 60 saniyede doğru işlem'],
        ['zh_cikarma', 'Çıkarma: 60 saniyede doğru işlem'],
        ['zh_carpma', 'Çarpma: 60 saniyede doğru işlem'],
        ['zh_bolme', 'Bölme: 60 saniyede doğru işlem'],
      ] as const
    ).map(([key, label]): TaskCompareSpec => ({ key, label, unit: '', decimals: 0, max: (c) => c.row.nItems, value: raw })),
    {
      key: 'zh_dogruluk',
      label: 'Doğruluk (dört bölüm)',
      unit: '%',
      decimals: 0,
      max: () => 100,
      value: (c) => {
        const all = arithAll(c.rows);
        if (!all) return null;
        const correctN = all.reduce((t, s) => t + s.correct, 0);
        const answered = all.reduce((t, s) => t + s.answered, 0);
        const wrong = all.reduce((t, s) => t + s.wrong, 0);
        return answered === 0 ? null : wrong === 0 ? 100 : arithPct(correctN, answered);
      },
    },
    {
      key: 'zh_hiz',
      label: 'Temel işlemlerde tipik süre (dört bölüm)',
      unit: 'sn',
      decimals: 1,
      time: true,
      open: true,
      max: () => OPEN_CAP,
      value: (c) => {
        const all = arithAll(c.rows);
        if (!all) return null;
        // Raporla aynı hesap: süresi olan bölümlerin temel işlem süreleri birlikte.
        const timed = all.filter((s) => s.factMedianRt !== null);
        const m = timed.length === 0 ? null : timed.length === 1 ? timed[0].factMedianRt! : arithMedian(timed.flatMap((s) => s.factRts));
        return m === null ? null : sec1Value(m);
      },
    },
  ],
  'planlama-kule-gorevi': [
    correct('kg_dogru', 'En az hamlede çözülen problem'),
    {
      key: 'kg_plan',
      label: 'İlk hamleden önce tipik süre',
      unit: 'sn',
      decimals: 1,
      format: 'trim',
      time: true,
      open: true,
      max: () => OPEN_CAP,
      value: (c) => (c.row.raw === null ? null : towerTenths(c.row.raw)),
    },
  ],
  'dikkat-ve-bellek': [
    { key: 'digit_forward', label: 'Sayı dizisi (ileri): en uzun dizi', unit: '', decimals: 0, max: (c) => spanMax(c.def, 'digit_span', 'forward'), value: raw },
    { key: 'digit_backward', label: 'Sayı dizisi (geri): en uzun dizi', unit: '', decimals: 0, max: (c) => spanMax(c.def, 'digit_span', 'backward'), value: raw },
    { key: 'spatial', label: 'Kutu dizisi: en uzun dizi', unit: '', decimals: 0, max: (c) => spanMax(c.def, 'spatial_span'), value: raw },
    percent('attention', 'Ok görevi: doğruluk', (c) => (c.row.extra as { accuracy?: number } | null)?.accuracy),
    { ...hundredths('attention', 'Ok görevi: doğru cevaplarda ortalama süre', (c) => (c.row.extra as { meanRt?: number | null } | null)?.meanRt ?? null), sub: 'sure' },
    { key: 'speed', label: 'Sembol eşleştirme: doğru eşleştirme', unit: '', decimals: 0, max: (c) => task(c.def, 'symbol_match').sequence.length, value: (c) => c.row.nAnswered },
  ],
  'surekli-dikkat': [
    {
      key: 'tempo',
      label: 'Dakikada taranan harf',
      unit: '',
      decimals: 0,
      open: true,
      max: () => OPEN_CAP,
      value: (c) => {
        const x = (c.row.extra as { perMinute?: number } | null)?.perMinute;
        return x === undefined ? null : Math.round(x);
      },
    },
    percent('isabet', 'Hedefleri bulma oranı', (c) => extraOf<{ hitRate: number }>(c.rows, 'tempo')?.hitRate),
    {
      key: 'net',
      label: 'Net doğru',
      unit: '',
      decimals: 0,
      max: (c) => {
        const t = task(c.def, 'cancellation');
        return Math.ceil((t.rows * t.sections * t.targetsPerRow.reduce((a, b) => a + b, 0)) / t.targetsPerRow.length);
      },
      value: raw,
    },
  ],
  'renk-kelime-gorevi': [percent('renk_dogruluk', 'Doğru cevaplar', (c) => (c.row.extra as { accuracy?: number } | null)?.accuracy), hundredths('renk_hiz', 'Tipik cevap süresi')],
  'dur-git-gorevi': [
    percent('dg_durma', 'Durma oranı', (c) => extraOf<{ stopRate: number }>(c.rows, 'dg_durma')?.stopRate),
    percent('dg_tepki', 'Basma oranı', (c) => extraOf<{ hitRate: number }>(c.rows, 'dg_durma')?.hitRate),
    hundredths('dg_hiz', 'Tipik tepki süresi'),
  ],
  'sirayla-birlestirme-gorevi': [
    { key: 'iz_a', label: 'Sayılarla birleştirme süresi', unit: 'sn', decimals: 1, time: true, open: true, max: () => OPEN_CAP, value: raw },
    { key: 'iz_b', label: 'Sayı ve harflerle birleştirme süresi', unit: 'sn', decimals: 1, time: true, open: true, max: () => OPEN_CAP, value: raw },
  ],
  'geriye-donuk-hatirlama': [
    { ...percent('gh_bir', 'Bir geri: yakalama', (c) => nBackLevel(c.rows, 1)?.hitRate), sub: 'yakalama' },
    { ...percent('gh_bir', 'Bir geri: yanlış basma', (c) => nBackLevel(c.rows, 1)?.falseAlarmRate), sub: 'yanlisBasma' },
    { ...percent('gh_iki', 'İki geri: yakalama', (c) => nBackLevel(c.rows, 2)?.hitRate), sub: 'yakalama' },
    { ...percent('gh_iki', 'İki geri: yanlış basma', (c) => nBackLevel(c.rows, 2)?.falseAlarmRate), sub: 'yanlisBasma' },
  ],
  'hesapla-ve-hatirla': [
    { key: 'hb_harf', label: 'Doğru yerde hatırlanan harf', unit: '', decimals: 0, outOf: true, max: (c) => c.row.nItems, value: raw },
    // Öne çıkan sayı "Bütün harfleri doğru dizi": bütün harfleri doğru yerde hatırlanan dizi / dizi sayısı.
    { key: 'hb_uzunluk', label: 'Bütün harfleri doğru dizi', unit: '', decimals: 0, outOf: true, max: (c) => c.row.nItems, value: (c) => c.row.nAnswered },
    percent('hb_islem', 'İşlem doğruluğu', (c) => extraOf<{ ops: { accuracy: number } }>(c.rows, 'hb_harf')?.ops.accuracy),
  ],
  'harf-sayi-siralama': [
    { key: 'hs_aralik', label: 'En uzun doğru dizi', unit: '', decimals: 0, max: (c) => Math.max(...task(c.def, 'letter_number').levels.map((l) => l.length)), value: raw },
    { key: 'hs_dizi', label: 'Doğru sıralanan dizi', unit: '', decimals: 0, max: (c) => task(c.def, 'letter_number').levels.reduce((a, l) => a + l.items.length, 0), value: raw },
    clock('hs_calisma', 'Dizi başına tipik süre'),
  ],
  'desen-hatirlama': [
    { key: 'dh_aralik', label: 'En büyük doğru desen', unit: '', decimals: 0, max: (c) => Math.max(...task(c.def, 'pattern_memory').levels.map((l) => l.cells)), value: raw },
    { key: 'dh_desen', label: 'Doğru hatırlanan desen', unit: '', decimals: 0, max: (c) => task(c.def, 'pattern_memory').levels.reduce((a, l) => a + l.items.length, 0), value: raw },
    clock('dh_calisma', 'Desen başına tipik süre'),
  ],
  'kelime-listesi-hatirlama': [
    { key: 'kl_ogrenme', label: 'Üç denemede toplam hatırlanan kelime', unit: '', decimals: 0, max: (c) => c.row.nItems, value: raw },
    { key: 'kl_koruma', label: 'Araya giren listeden sonra hatırlanan kelime', unit: '', decimals: 0, outOf: true, max: (c) => c.row.nItems, value: raw },
    { key: 'kl_tanima', sub: 'taninan', label: 'Tanıma: tanınan kelime', unit: '', decimals: 0, outOf: true, max: (c) => recognition(c.rows)?.targets ?? 0, value: (c) => recognition(c.rows)?.hits ?? null },
    {
      key: 'kl_tanima',
      sub: 'yanlisEvet',
      label: 'Tanıma: yanlış “evet”',
      unit: '',
      decimals: 0,
      max: (c) => {
        const r = recognition(c.rows);
        return r ? sumOf(r.lures) : 0;
      },
      value: (c) => {
        const r = recognition(c.rows);
        return r ? sumOf(r.falseYes) : null;
      },
    },
  ],
  'zihinde-dondurme': [percent('zd_dogruluk', 'Doğru cevaplar', (c) => (c.row.extra as { accuracy?: number } | null)?.accuracy), hundredths('zd_hiz', 'Tipik karar süresi')],
  'tepki-hizi': [hundredths('th_basit', 'Basit tepki süresi'), hundredths('th_secmeli', 'Seçmeli tepki süresi')],
  'simge-bulma': [
    { key: 'sg_hiz', label: 'Doğru karar', unit: '', decimals: 0, max: (c) => task(c.def, 'symbol_search').trials, value: raw },
    {
      key: 'sg_hiz',
      sub: 'sure',
      label: 'Tipik karar süresi',
      unit: 'sn',
      decimals: 1,
      time: true,
      open: true,
      max: () => OPEN_CAP,
      value: (c) => (c.row.mean === null ? null : sgSecValue(c.row.mean)),
    },
    {
      key: 'sg_dogruluk',
      label: 'Doğruluk',
      unit: '%',
      decimals: 0,
      max: () => 100,
      value: (c) => {
        const r = extraOf<{ correct: number; answered: number }>(c.rows, 'sg_hiz');
        return r ? sgPct(r.correct, r.answered) : null;
      },
    },
  ],
  'kural-degistirme': [percent('kd_dogruluk', 'Doğruluk', (c) => (c.row.extra as { accuracy?: number } | null)?.accuracy), hundredths('kd_calisma', 'Tipik cevap süresi')],
};

export const specKey = (s: Pick<TaskCompareSpec, 'key' | 'sub'>) => (s.sub ? `${s.key}.${s.sub}` : s.key);

/** Görev testinin karşılaştırma bilgisi: raporda yorumlanan ana sonuçlar. Hiçbiri yoksa undefined. */
export function taskCompareInfo(def: TaskInstrument, content: ReportContent, rows: ScoreRow[]): CompareInfo | undefined {
  const specs = TASK_COMPARE[def.slug];
  if (!specs || !content.cognitive) return undefined;
  const blocks = new Map<string, CognitiveBlock>(content.cognitive.blocks.map((b) => [b.key, b]));
  const scales: CompareScale[] = [];
  for (const s of specs) {
    const row = rows.find((r) => r.scaleKey === s.key);
    const block = blocks.get(s.key);
    if (!row || !block || block.interpreted === false) continue;
    const c = { def, row, rows };
    const value = s.value(c);
    const min = s.min ?? 0;
    const max = s.max(c);
    if (value === null || !Number.isFinite(value) || value < min || value > max) continue;
    scales.push({
      key: specKey(s),
      label: s.label,
      value,
      min,
      max,
      sem: null,
      decimals: s.decimals,
      band: null,
      ...(s.unit ? { unit: s.unit } : {}),
      ...(s.format ? { format: s.format } : {}),
      ...(s.time ? { time: true as const } : {}),
      ...(s.outOf ? { outOf: true as const } : {}),
      ...(s.open ? { open: true as const } : {}),
    });
  }
  if (!scales.length) return undefined;
  return {
    slug: def.slug,
    version: def.version,
    date: content.completedAt,
    scales,
    retest: def.tasks.some((t) => SAME_ITEMS.has(t.kind)) ? 'items' : 'practice',
    since: TASK_COMPARE_SINCE,
  };
}
