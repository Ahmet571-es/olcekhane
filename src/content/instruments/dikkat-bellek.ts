import type { FlankerTask, SymbolMatchTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Dikkat ve Çalışma Belleği Görevleri
 *
 * Bilişsel psikolojinin klasik deney düzenlerine (sayı dizisi, blok dizisi, ok/flanker görevi, sembol
 * eşleştirme) dayanan özgün görevlerdir. Uyaranlar (diziler, kutu yerleşimi, semboller, deneme sıraları)
 * Ölçekhane tarafından üretilmiştir; herhangi bir ticari testin maddeleri, uyaranları ya da normları
 * kullanılmaz. Bu bir zekâ (IQ) testi değildir ve tanı koymaz.
 *
 * Uyaranlar sabit bir tohumla (seed) belirlenimci olarak üretilir: her öğrenci aynı dizileri görür,
 * böylece sonuçlar karşılaştırılabilir ve ileride norm oluşturulabilir. Üretim kuralları değişirse
 * testin sürüm numarası artırılmalıdır.
 */

/** Küçük, belirlenimci rastgele sayı üreteci (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Rakam dizisi: 1–9 arası, dizide tekrar yok, art arda gelen iki rakam ardışık sayı değil (ör. 4-5),
 * böylece dizi kolay bir örüntüyle akılda tutulamaz.
 */
function digitSequence(length: number, rand: () => number): number[] {
  for (;;) {
    const seq = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rand).slice(0, length);
    if (seq.every((d, i) => i === 0 || Math.abs(d - seq[i - 1]) !== 1)) return seq;
  }
}

/** Kutu dizisi: 9 kutudan tekrarsız seçim. */
function boxSequence(length: number, rand: () => number): number[] {
  return shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], rand).slice(0, length);
}

/** Her uzunluk için iki farklı dizi. */
function ladder(from: number, to: number, make: (len: number) => number[]): number[][][] {
  const out: number[][][] = [];
  for (let len = from; len <= to; len++) {
    const a = make(len);
    let b = make(len);
    while (b.join() === a.join()) b = make(len);
    out.push([a, b]);
  }
  return out;
}

/** Alıştırma dizisi, aynı uzunluktaki test dizilerinden farklı olmalı. */
function practiceFrom(make: () => number[], avoid: number[][]): number[] {
  for (;;) {
    const s = make();
    if (!avoid.some((a) => a.join() === s.join())) return s;
  }
}

const r1 = rng(20260929);
const forwardSeqs = ladder(3, 9, (n) => digitSequence(n, r1));
const forwardPractice = practiceFrom(() => digitSequence(2, r1), []);
const r2 = rng(20260930);
const backwardSeqs = ladder(2, 8, (n) => digitSequence(n, r2));
const backwardPractice = practiceFrom(() => digitSequence(2, r2), backwardSeqs[0]);
const r3 = rng(20261001);
const spatialSeqs = ladder(2, 9, (n) => boxSequence(n, r3));
const spatialPractice = practiceFrom(() => boxSequence(2, r3), spatialSeqs[0]);

/**
 * Ok görevi deneme sırası: her yön × uyum koşulundan eşit sayıda; aynı cevap ya da aynı koşul
 * üç kereden fazla art arda gelmez.
 */
function flankerTrials(perCell: number, rand: () => number): FlankerTask['trials'] {
  const cells: FlankerTask['trials'] = [];
  for (const dir of ['L', 'R'] as const)
    for (const congruent of [true, false]) for (let i = 0; i < perCell; i++) cells.push({ dir, congruent });
  for (;;) {
    const s = shuffle(cells, rand);
    let ok = true;
    for (let i = 3; i < s.length && ok; i++) {
      const w = s.slice(i - 3, i + 1);
      if (w.every((t) => t.dir === w[0].dir) || w.every((t) => t.congruent === w[0].congruent)) ok = false;
    }
    if (ok) return s;
  }
}

/** Sembol sırası: 0–8, art arda aynı sembol gelmez; her sembol eşit sıklıkta. */
function symbolSequence(length: number, rand: () => number): number[] {
  const out: number[] = [];
  while (out.length < length) {
    for (const s of shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], rand)) {
      if (out.length && out[out.length - 1] === s) continue;
      out.push(s);
    }
  }
  return out.slice(0, length);
}

const r4 = rng(20261002);
const r5 = rng(20261003);

/** Özgün, basit geometrik semboller (24×24 görünüm alanında çizgi yolları). */
const SYMBOLS = [
  'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 4v16',
  'M12 4L20 19H4ZM8 14h8',
  'M5 5h14v14H5ZM5 19L19 5',
  'M5 5L19 19M19 5L5 19',
  'M3 12c3-6 6-6 9 0s6 6 9 0',
  'M12 20V5M6 11l6-6 6 6',
  'M15 4a8 8 0 1 0 0 16a6 6 0 1 1 0-16Z',
  'M5 8h14M5 16h14M12 4v16',
  'M12 3L21 12L12 21L3 12Z',
];

const symbolTask: SymbolMatchTask = {
  key: 'sembol',
  kind: 'symbol_match',
  name: 'Sembol Eşleştirme',
  measures: 'İşlem hızı: basit bir işi hem hızlı hem doğru yapabilme.',
  instructions: [
    'Üstte, her sembolün altında bir rakam var. Ortada bir sembol belirecek.',
    'O sembolün altındaki rakama olabildiğince hızlı ve doğru bas.',
    'Önce kısa bir alıştırma yapacaksın. Sonra 90 saniye boyunca yapabildiğin kadarını yap.',
  ],
  durationMs: 90_000,
  symbols: SYMBOLS,
  practice: symbolSequence(6, r5),
  sequence: symbolSequence(160, r4),
};

export const dikkatBellek: TaskInstrument = {
  slug: 'dikkat-ve-bellek',
  version: 1,
  engine: 'tasks',
  name: 'Dikkat ve Çalışma Belleği Görevleri',
  shortName: 'Dikkat ve bellek',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 4,
  maxGrade: 13,
  estimatedMinutes: 15,
  sortOrder: 50,
  tagline: 'Beş kısa görevle çalışma belleğini, seçici dikkati ve işlem hızını ölçer. Bir zekâ testi değildir.',
  description:
    'Bu görevler, bilişsel psikolojide onlarca yıldır kullanılan deney düzenlerine dayanır: sayı ve kutu dizilerini akılda tutmak, dikkat dağıtan uyaranlara rağmen doğru cevabı vermek ve basit bir işi hızlı yapmak. Görevler oyun gibi hissettirir ve yaklaşık 15 dakika sürer; görevler arasında dinlenilebilir. Rapor, her görevde ne yapıldığını sade bir dille anlatır; bir zekâ puanı vermez, tanı koymaz.',
  intro: {
    title: 'Beş kısa görev',
    paragraphs: [
      'Birazdan beş kısa görev yapacaksın: sayıları sırayla ve tersten hatırlamak, kutuların sırasını hatırlamak, okların yönünü bulmak ve sembolleri eşleştirmek.',
      'Her görevin başında ne yapacağını anlatacağız. Görevler arasında dinlenebilirsin.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'digit_forward', name: 'Sayı dizisi (ileri)', plain: 'Görülen ya da duyulan bilgiyi kısa süre akılda tutabilme.' },
    { key: 'digit_backward', name: 'Sayı dizisi (geri)', plain: 'Bilgiyi akılda tutarken üzerinde işlem yapabilme (çalışma belleği).' },
    { key: 'spatial', name: 'Kutu dizisi', plain: 'Yerleri ve sıraları akılda tutabilme (görsel-uzamsal bellek).' },
    { key: 'attention', name: 'Ok görevi', plain: 'Dikkat dağıtan şeylere rağmen önemli olana odaklanabilme (seçici dikkat).' },
    { key: 'speed', name: 'Sembol eşleştirme', plain: 'Basit bir işi hem hızlı hem doğru yapabilme (işlem hızı).' },
  ],
  tasks: [
    {
      key: 'sayi-ileri',
      kind: 'digit_span',
      direction: 'forward',
      name: 'Sayı Dizisi',
      measures: 'Kısa süreli bellek: gördüğün sayıları sırasıyla akılda tutabilme.',
      instructions: [
        'Ekranda sayılar tek tek belirecek. Hepsi bittikten sonra aynı sırayla tuşlara bas.',
        'Diziler giderek uzayacak. Aynı uzunluktaki iki dizinin ikisini de yanlış yaparsan görev biter; bu çok normal.',
      ],
      onMs: 800,
      offMs: 250,
      practice: forwardPractice,
      startLength: 3,
      sequences: forwardSeqs,
    },
    {
      key: 'sayi-geri',
      kind: 'digit_span',
      direction: 'backward',
      name: 'Sayı Dizisi: Tersten',
      measures: 'Çalışma belleği: sayıları akılda tutarken sıralarını tersine çevirebilme.',
      instructions: [
        'Bu kez sayıları sondan başa doğru, ters sırayla gir.',
        'Örneğin ekranda 3, 8 görürsen 8, 3 yazmalısın.',
      ],
      onMs: 800,
      offMs: 250,
      practice: backwardPractice,
      startLength: 2,
      sequences: backwardSeqs,
    },
    {
      key: 'kutu',
      kind: 'spatial_span',
      name: 'Kutu Dizisi',
      measures: 'Görsel-uzamsal bellek: yerleri ve sıralarını akılda tutabilme.',
      instructions: [
        'Ekranda dokuz kutu göreceksin. Kutular sırayla yanıp sönecek.',
        'Hepsi bittikten sonra kutulara aynı sırayla dokun.',
      ],
      onMs: 800,
      offMs: 250,
      boxes: [
        { x: 16, y: 14 },
        { x: 58, y: 8 },
        { x: 84, y: 28 },
        { x: 38, y: 34 },
        { x: 10, y: 54 },
        { x: 66, y: 52 },
        { x: 32, y: 76 },
        { x: 86, y: 78 },
        { x: 56, y: 90 },
      ],
      practice: spatialPractice,
      startLength: 2,
      sequences: spatialSeqs,
    },
    {
      key: 'ok',
      kind: 'flanker',
      name: 'Ok Görevi',
      measures: 'Seçici dikkat: yanlardaki oklara aldırmadan ortadaki okun yönünü bulabilme.',
      instructions: [
        'Ekranda yan yana beş ok göreceksin. Yalnızca ortadaki oka bak.',
        'Ortadaki ok sola bakıyorsa sol düğmeye (ya da F tuşuna), sağa bakıyorsa sağ düğmeye (ya da J tuşuna) bas.',
        'Hem hızlı hem doğru olmaya çalış. Önce kısa bir alıştırma yapacaksın.',
      ],
      fixationMs: 500,
      timeoutMs: 2000,
      itiMs: [300, 700],
      practice: [
        { dir: 'L', congruent: true },
        { dir: 'R', congruent: false },
        { dir: 'R', congruent: true },
        { dir: 'L', congruent: false },
        { dir: 'R', congruent: false },
        { dir: 'L', congruent: true },
        { dir: 'L', congruent: false },
        { dir: 'R', congruent: true },
      ],
      trials: flankerTrials(12, rng(20261004)),
    },
    symbolTask,
  ],
  science: {
    basedOn:
      'Bilişsel psikolojinin klasik deney düzenleri: sayı dizisi, blok dizisi (Corsi), ok/flanker görevi (Eriksen ve Eriksen, 1974) ve sembol eşleştirme. Uyaranlar ve görevler Ölçekhane tarafından özgün olarak hazırlanmıştır.',
    whatItMeasures:
      'Kısa süreli ve çalışma belleğini (sayı ve kutu dizileri), seçici dikkati (ok görevi) ve işlem hızını (sembol eşleştirme) ölçer. Çalışma belleği, çok adımlı yönergeleri takip etmek ya da zihinden işlem yapmak gibi gündelik okul işlerinde kullanılır.',
    turkishVersion:
      'Özgün görevler. Yönergeler Türkçe yazılmıştır; görevlerin kendisi dilden büyük ölçüde bağımsızdır.',
    reliability:
      'Pilot aşamasındadır. Bu tür görevlerde tek bir uygulamanın güvenirliği sınırlıdır; özellikle iki koşul arasındaki farklara dayanan puanlar bireyleri ayırt etmede zayıf kalır. Bu yüzden raporda fark puanları yerine doğruluk, dizi uzunluğu ve ortalama tepki süresi verilir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok; sonuçlar akranlarla karşılaştırılmadan, yapılan işin kendisiyle anlatılır. Çalışma belleği çocukluk ve ergenlik boyunca yaşla birlikte belirgin biçimde gelişir; bu yüzden normlar sınıf düzeyine göre oluşturulacaktır.',
    ageNote: '4. sınıftan itibaren uygulanır. Dokunmatik ekranlı bir cihazda ya da klavye ve fareyle yapılabilir.',
    license: 'Özgün görevler. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Bir zekâ (IQ) testi değildir ve dikkat eksikliği gibi durumlar için tanı koymaz.',
      'Sonuç; yorgunluk, uykusuzluk, ortamdaki gürültü ve cihaz gibi etkenlerden etkilenebilir.',
      'Tek bir uygulama sınırlı bilgi verir. Endişe varsa uzman değerlendirmesi gerekir.',
      'Pilot aşamasındadır: güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Eriksen, B. A. ve Eriksen, C. W. (1974). Effects of noise letters upon the identification of a target letter in a nonsearch task. Perception & Psychophysics, 16(1), 143–149.',
        url: 'https://doi.org/10.3758/BF03203267',
      },
      {
        text: 'Gathercole, S. E., Pickering, S. J., Ambridge, B. ve Wearing, H. (2004). The structure of working memory from 4 to 15 years of age. Developmental Psychology, 40(2), 177–190.',
        url: 'https://doi.org/10.1037/0012-1649.40.2.177',
      },
      {
        text: 'Hedge, C., Powell, G. ve Sumner, P. (2018). The reliability paradox: Why robust cognitive tasks do not produce reliable individual differences. Behavior Research Methods, 50(3), 1166–1186.',
        url: 'https://doi.org/10.3758/s13428-017-0935-1',
      },
      {
        text: 'Kessels, R. P. C., van Zandvoort, M. J. E., Postma, A., Kappelle, L. J. ve de Haan, E. H. F. (2000). The Corsi block-tapping task: Standardization and normative data. Applied Neuropsychology, 7(4), 252–258.',
        url: 'https://doi.org/10.1207/S15324826AN0704_8',
      },
      {
        text: 'Melby-Lervåg, M. ve Hulme, C. (2013). Is working memory training effective? A meta-analytic review. Developmental Psychology, 49(2), 270–291.',
        url: 'https://doi.org/10.1037/a0028228',
      },
    ],
  },
};
