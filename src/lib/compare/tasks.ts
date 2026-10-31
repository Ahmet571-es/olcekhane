import type { ScoreRow } from '@/lib/assessment/score-rows';
import type { CognitiveTask, TaskInstrument } from '@/lib/instruments/types';
import type { ReportContent } from '@/lib/reports/build';
import type { CompareInfo, CompareScale, CompareUnit } from './record';

/**
 * Gelişimini karşılaştır: görev (zekâ ve dikkat) testleri. Her testte karşılaştırılan sayılar, raporun ana sonuçlarıdır:
 * doğru sayısı ya da oranı, ulaşılan düzey, en uzun dizi, tipik süre. Kural ve soru türleri gibi dökümler ve iki ölçümün
 * farkından hesaplanan etkiler (renk-kelime etkisi, kural değiştirme, döndürme ve seçim etkisi, sayı-harf geçişi, zorluk
 * artınca değişim, dikkati sürdürme) karşılaştırılmaz: iki ölçümün farkı olduğu için tek ölçümden çok daha oynaktırlar.
 *
 * Bir sayı, raporda kartı yorumlandıysa (kartın grafiği varsa) karşılaştırılır; "Yorumlanmadı" ya da hesaplanamayan
 * kartın sayısı özete yazılmaz. Hiçbir sayı karşılaştırılamıyorsa raporda karşılaştırma bölümü olmaz.
 *
 * Aralıklar (`min`, `max`) testin sürümü boyunca sabittir: karşılaştırmada önceki puan bu aralıkta değilse bozuk sayılır.
 * Süreler için üst sınır yalnızca bozuk değeri ayıklar (çizimde aralık iki süreye göre seçilir).
 */

/** Görev testlerinin özetlerinin PDF'e yazılmaya başlandığı gün (bu sürüm). */
export const TASK_COMPARE_SINCE = '2026-10-31';

/** Süre ölçeklerinde bozuk değeri ayıklayan üst sınır (saniye). */
const TIME_CAP = 3600;

/** Her uygulamada aynı soruların (ya da aynı kelime listesinin) geldiği görev türleri: hatırlananlar sonucu etkileyebilir. */
const SAME_ITEMS = new Set<CognitiveTask['kind']>([
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

interface Spec {
  /** Ölçeğin anahtarı (raporda aynı anahtarlı kart). */
  key: string;
  /** Aynı karttan ikinci bir sayı (ör. doğruluğun yanında süre): özette `${key}.${sub}`. */
  sub?: string;
  label: string;
  unit: CompareUnit;
  decimals: 0 | 1 | 2;
  /** Süre (saniye): büyümesi yavaşlamak demektir; panel "Süre uzadı/kısaldı" der. */
  time?: true;
  min?: number;
  max: (def: TaskInstrument, row: ScoreRow) => number;
  value: (row: ScoreRow) => number | null;
}

const round = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;
const task = <T extends CognitiveTask['kind']>(def: TaskInstrument, kind: T) =>
  def.tasks.find((t): t is Extract<CognitiveTask, { kind: T }> => t.kind === kind)!;
const levelsOf = (def: TaskInstrument) => ((def.tasks[0] as unknown as { levels: unknown[] }).levels ?? []).length;

/** Yüzde olarak tutulan doğru oranından doğru sayısı (soru sayısı sabit). */
const correctFromPct = (row: ScoreRow) => (row.raw === null ? null : Math.round((row.raw * row.nItems) / 100));
const rawValue = (row: ScoreRow) => row.raw;
const secs = (d: number) => (row: ScoreRow) => (row.raw === null ? null : round(row.raw / 1000, d));

const correct = (key: string, label = 'Doğru cevaplar'): Spec => ({ key, label, unit: '', decimals: 0, max: (_, r) => r.nItems, value: correctFromPct });
const level = (key: string): Spec => ({ key, label: 'Ulaşılan düzey', unit: '', decimals: 0, max: (d) => levelsOf(d), value: rawValue });
const perItem = (key: string, label = 'Soru başına tipik süre'): Spec => ({ key, label, unit: 'sn', decimals: 0, time: true, max: () => TIME_CAP, value: secs(0) });
const percent = (key: string, label: string): Spec => ({ key, label, unit: '%', decimals: 0, max: () => 100, value: (r) => (r.raw === null ? null : round(r.raw, 0)) });
const quick = (key: string, label: string, d: 1 | 2 = 2): Spec => ({ key, label, unit: 'sn', decimals: d, time: true, max: () => TIME_CAP, value: secs(d) });
/** Yakalama oranı eksi yanlış basma oranı (yüzde puanı; −100 ile 100 arası). */
const discrimination = (key: string, label: string): Spec => ({ key, label, unit: '', decimals: 0, min: -100, max: () => 100, value: (r) => (r.raw === null ? null : round(r.raw, 0)) });

const reasoning = (p: string): Spec[] => [correct(`${p}_dogru`), level(`${p}_duzey`), perItem(`${p}_calisma`)];

const spanMax = (def: TaskInstrument, kind: 'digit_span' | 'spatial_span', direction?: 'forward' | 'backward') => {
  const t = def.tasks.find((x) => x.kind === kind && (!direction || (x as { direction?: string }).direction === direction)) as { sequences: number[][][] } | undefined;
  return t ? Math.max(...t.sequences.flat().map((s) => s.length)) : 9;
};

/** Testlerin karşılaştırılan sayıları, testin ölçek sırasıyla. */
export const TASK_COMPARE: Record<string, Spec[]> = {
  'sekil-akil-yurutme': reasoning('sa'),
  'sekil-benzetmeleri': reasoning('sb'),
  'sayi-dizileri': reasoning('sd'),
  'harf-dizileri': reasoning('hd'),
  'sozel-akil-yurutme': reasoning('sz'),
  'kagit-katlama': reasoning('kk'),
  'kup-acinimi': reasoning('kp'),
  'gizli-sekiller': reasoning('gs'),
  'kelime-bilgisi': reasoning('kb'),
  'mantiksal-akil-yurutme': [correct('ma_dogru'), perItem('ma_calisma')],
  'sayisal-akil-yurutme': [correct('sy_dogru'), perItem('sy_calisma')],
  'uc-boyutlu-zihinde-dondurme': [correct('ud_dogru'), perItem('ud_calisma')],
  'dusunerek-karar-verme': [correct('dk_dogru', 'Tuzaklı sorularda doğru'), perItem('dk_calisma')],
  'bakis-acisi-alma': [
    { key: 'ba_hata', label: 'Ortalama yön hatası', unit: '°', decimals: 1, max: () => 180, value: (r) => (r.raw === null ? null : round(r.raw, 1)) },
    perItem('ba_calisma'),
  ],
  'zihinden-hesaplama-hizi': [
    { key: 'zh_genel', label: 'Dört işlemde doğru işlem', unit: '', decimals: 0, max: (_, r) => r.nItems, value: rawValue },
    ...(
      [
        ['zh_toplama', 'Toplama: doğru işlem'],
        ['zh_cikarma', 'Çıkarma: doğru işlem'],
        ['zh_carpma', 'Çarpma: doğru işlem'],
        ['zh_bolme', 'Bölme: doğru işlem'],
      ] as const
    ).map(([key, label]): Spec => ({ key, label, unit: '', decimals: 0, max: (_, r) => r.nItems, value: rawValue })),
    percent('zh_dogruluk', 'Doğruluk'),
    quick('zh_hiz', 'Temel işlemlerde tipik süre', 1),
  ],
  'planlama-kule-gorevi': [correct('kg_dogru', 'En az hamlede çözülen problem'), perItem('kg_plan', 'İlk hamleden önce tipik süre')],
  'dikkat-ve-bellek': [
    { key: 'digit_forward', label: 'Sayı dizisi (ileri): en uzun dizi', unit: '', decimals: 0, max: (d) => spanMax(d, 'digit_span', 'forward'), value: rawValue },
    { key: 'digit_backward', label: 'Sayı dizisi (geri): en uzun dizi', unit: '', decimals: 0, max: (d) => spanMax(d, 'digit_span', 'backward'), value: rawValue },
    { key: 'spatial', label: 'Kutu dizisi: en uzun dizi', unit: '', decimals: 0, max: (d) => spanMax(d, 'spatial_span'), value: rawValue },
    percent('attention', 'Ok görevi: doğruluk'),
    { key: 'attention', sub: 'sure', label: 'Ok görevi: ortalama süre', unit: 'sn', decimals: 2, time: true, max: () => TIME_CAP, value: (r) => (r.mean === null ? null : round(r.mean / 1000, 2)) },
    { key: 'speed', label: 'Sembol eşleştirme: doğru eşleştirme', unit: '', decimals: 0, max: (d) => task(d, 'symbol_match').sequence.length, value: (r) => r.nAnswered },
  ],
  'surekli-dikkat': [
    {
      key: 'tempo',
      label: 'Dakikada taranan harf',
      unit: '',
      decimals: 0,
      max: (d) => {
        const t = task(d, 'cancellation');
        return Math.ceil((t.rows * t.columns) / (t.sectionMs / 60_000));
      },
      value: (r) => (r.raw === null ? null : round(r.raw, 0)),
    },
    percent('isabet', 'Hedefleri bulma oranı'),
    {
      key: 'net',
      label: 'Net doğru',
      unit: '',
      decimals: 0,
      max: (d) => {
        const t = task(d, 'cancellation');
        return Math.ceil((t.rows * t.sections * t.targetsPerRow.reduce((a, b) => a + b, 0)) / t.targetsPerRow.length);
      },
      value: rawValue,
    },
  ],
  'renk-kelime-gorevi': [percent('renk_dogruluk', 'Doğru cevaplar'), quick('renk_hiz', 'Tipik cevap süresi')],
  'dur-git-gorevi': [percent('dg_durma', 'Durma oranı'), percent('dg_tepki', 'Basma oranı'), quick('dg_hiz', 'Tipik tepki süresi')],
  'sirayla-birlestirme-gorevi': [
    { key: 'iz_a', label: 'Sayılarla birleştirme süresi', unit: 'sn', decimals: 1, time: true, max: () => TIME_CAP, value: (r) => r.raw },
    { key: 'iz_b', label: 'Sayı ve harflerle birleştirme süresi', unit: 'sn', decimals: 1, time: true, max: () => TIME_CAP, value: (r) => r.raw },
  ],
  'geriye-donuk-hatirlama': [discrimination('gh_bir', 'Bir geri: ayırt etme puanı'), discrimination('gh_iki', 'İki geri: ayırt etme puanı')],
  'hesapla-ve-hatirla': [
    { key: 'hb_harf', label: 'Doğru yerde hatırlanan harf', unit: '', decimals: 0, max: (_, r) => r.nItems, value: rawValue },
    {
      key: 'hb_uzunluk',
      label: 'Bütün harfleri doğru en uzun dizi',
      unit: '',
      decimals: 0,
      max: (d) => Math.max(...task(d, 'complex_span').sets.map((s) => s.letters.length)),
      value: rawValue,
    },
    percent('hb_islem', 'İşlem doğruluğu'),
  ],
  'harf-sayi-siralama': [
    { key: 'hs_aralik', label: 'En uzun doğru dizi', unit: '', decimals: 0, max: (d) => Math.max(...task(d, 'letter_number').levels.map((l) => l.length)), value: rawValue },
    {
      key: 'hs_dizi',
      label: 'Doğru sıralanan dizi',
      unit: '',
      decimals: 0,
      max: (d) => task(d, 'letter_number').levels.reduce((a, l) => a + l.items.length, 0),
      value: rawValue,
    },
    perItem('hs_calisma', 'Dizi başına tipik süre'),
  ],
  'desen-hatirlama': [
    { key: 'dh_aralik', label: 'En büyük doğru desen', unit: '', decimals: 0, max: (d) => Math.max(...task(d, 'pattern_memory').levels.map((l) => l.cells)), value: rawValue },
    {
      key: 'dh_desen',
      label: 'Doğru hatırlanan desen',
      unit: '',
      decimals: 0,
      max: (d) => task(d, 'pattern_memory').levels.reduce((a, l) => a + l.items.length, 0),
      value: rawValue,
    },
    perItem('dh_calisma', 'Desen başına tipik süre'),
  ],
  'kelime-listesi-hatirlama': [
    { key: 'kl_ogrenme', label: 'Üç denemede hatırlanan kelime', unit: '', decimals: 0, max: (_, r) => r.nItems, value: rawValue },
    { key: 'kl_koruma', label: 'Araya liste girdikten sonra hatırlanan kelime', unit: '', decimals: 0, max: (_, r) => r.nItems, value: rawValue },
    discrimination('kl_tanima', 'Tanıma: ayırt etme puanı'),
  ],
  'zihinde-dondurme': [percent('zd_dogruluk', 'Doğru cevaplar'), quick('zd_hiz', 'Tipik karar süresi')],
  'tepki-hizi': [quick('th_basit', 'Basit tepki süresi'), quick('th_secmeli', 'Seçmeli tepki süresi')],
  'simge-bulma': [
    { key: 'sg_hiz', label: 'Doğru karar (2 dakikada)', unit: '', decimals: 0, max: (d) => task(d, 'symbol_search').trials, value: rawValue },
    { key: 'sg_hiz', sub: 'sure', label: 'Tipik karar süresi', unit: 'sn', decimals: 1, time: true, max: () => TIME_CAP, value: (r) => (r.mean === null ? null : round(r.mean / 1000, 1)) },
    percent('sg_dogruluk', 'Doğruluk'),
  ],
  'kural-degistirme': [percent('kd_dogruluk', 'Doğruluk'), quick('kd_calisma', 'Tipik cevap süresi')],
};

/** Raporda kartı yorumlanmamış (grafiksiz ya da sonuç yerine "Yorumlanmadı" gibi bir başlık taşıyan) ölçekler. */
const UNREAD = /^(Yorumlanmadı|Hesaplanamadı|Süre hesaplanamadı|Cevap verilmedi|Hiç basılmadı|Süre içinde tamamlanamadı|Düzey belirtilmedi)$/;

/** Görev testinin karşılaştırma bilgisi: raporda yorumlanan ana sonuçlar. Hiçbiri yoksa undefined. */
export function taskCompareInfo(def: TaskInstrument, content: ReportContent, rows: ScoreRow[]): CompareInfo | undefined {
  const specs = TASK_COMPARE[def.slug];
  if (!specs || !content.cognitive) return undefined;
  const blocks = new Map(content.cognitive.blocks.map((b) => [b.key, b]));
  const scales: CompareScale[] = [];
  for (const s of specs) {
    const row = rows.find((r) => r.scaleKey === s.key);
    const block = blocks.get(s.key);
    if (!row || !block || !block.visual || UNREAD.test(block.headline)) continue;
    const value = s.value(row);
    const min = s.min ?? 0;
    const max = s.max(def, row);
    if (value === null || !Number.isFinite(value) || value < min || value > max) continue;
    scales.push({
      key: s.sub ? `${s.key}.${s.sub}` : s.key,
      label: s.label,
      value,
      min,
      max,
      sem: null,
      decimals: s.decimals,
      band: null,
      ...(s.unit ? { unit: s.unit } : {}),
      ...(s.time ? { time: true as const } : {}),
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
