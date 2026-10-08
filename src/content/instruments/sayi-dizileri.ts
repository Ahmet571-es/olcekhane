import type { NumberSeriesItem, NumberSeriesPracticeItem, NumberSeriesRule, NumberSeriesTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Sayı dizileri: bir kurala göre ilerleyen dizideki eksik sayıyı bulmak. Bütün sorular Ölçekhane'nindir.
 *
 * Her sorunun tek doğru cevabı olduğu tests/sayi-dizileri.test.ts'te bağımsız bir çözücüyle denetlenir: sık kullanılan
 * dizi kurallarından (sabit fark, sabit oran, düzenli değişen farklar, ax+b, önceki iki ya da üç sayının toplamı, iç içe iki
 * dizi, sırayla değişen işlemler) dizinin bilinen sayılarına uyan her biri aynı eksik sayıyı vermelidir.
 *
 * Tuzaklar: daha basit bir kuralla bulunan yanlış cevaplar. Ya dizinin yalnızca bir bölümüne uyan bir kural (son farkı ya da
 * son işlemi aynen tekrarlamak, dizinin başına uyan ikiyle çarpmayı sürdürmek, iç içe dizilerde öteki dizinin sıradaki
 * sayısını yazmak) ya da kuralın bir adımını atlamak ("iki katının bir fazlası" yerine iki katı, önceki üç sayı yerine iki
 * sayının toplamı). Raporda yanlışların ne kadarının böyle olduğu anlatılır; tests/sayi-dizileri.test.ts her tuzağın bu
 * yollardan biriyle bulunduğunu denetler.
 */
interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  rule: NumberSeriesRule;
  terms: (number | null)[];
  answer: number;
  traps: number[];
}

const _ = null;

const SPECS: Spec[] = [
  // 1. düzey: küçük, sabit artış ya da azalış.
  { key: 'sd01', level: 1, rule: 'step', terms: [3, 5, 7, 9, 11, _], answer: 13, traps: [] },
  { key: 'sd02', level: 1, rule: 'step', terms: [4, 9, 14, 19, 24, _], answer: 29, traps: [] },
  { key: 'sd03', level: 1, rule: 'step', terms: [21, 18, 15, 12, 9, _], answer: 6, traps: [] },
  { key: 'sd04', level: 1, rule: 'step', terms: [6, 10, 14, 18, 22, _], answer: 26, traps: [] },
  // 2. düzey: daha büyük adımlar, ikiyle çarpma ve ikiye bölme, her adımda bir fazlasını ekleme.
  { key: 'sd05', level: 2, rule: 'step', terms: [12, 20, 28, 36, 44, _], answer: 52, traps: [] },
  { key: 'sd06', level: 2, rule: 'step', terms: [95, 86, 77, 68, 59, _], answer: 50, traps: [] },
  { key: 'sd07', level: 2, rule: 'ratio', terms: [3, 6, 12, 24, 48, _], answer: 96, traps: [72] },
  { key: 'sd08', level: 2, rule: 'ratio', terms: [160, 80, 40, 20, 10, _], answer: 5, traps: [0] },
  { key: 'sd09', level: 2, rule: 'growing', terms: [1, 2, 4, 7, 11, _], answer: 16, traps: [15] },
  // 3. düzey: düzenli büyüyen ya da küçülen artışlar, üçle çarpma, iç içe iki basit dizi, ortadaki eksik sayı.
  { key: 'sd10', level: 3, rule: 'growing', terms: [2, 4, 8, 14, 22, _], answer: 32, traps: [30, 44] },
  { key: 'sd11', level: 3, rule: 'ratio', terms: [2, 6, 18, 54, _], answer: 162, traps: [90] },
  { key: 'sd12', level: 3, rule: 'alternating', terms: [1, 10, 2, 20, 3, 30, _], answer: 4, traps: [40] },
  { key: 'sd13', level: 3, rule: 'step', terms: [19, 26, _, 40, 47], answer: 33, traps: [] },
  { key: 'sd14', level: 3, rule: 'growing', terms: [50, 49, 47, 44, 40, _], answer: 35, traps: [36] },
  // 4. düzey: sırayla değişen iki işlem, farklı kurallarla ilerleyen iç içe iki dizi, iki adımlı kurallar.
  { key: 'sd15', level: 4, rule: 'alternating', terms: [2, 5, 10, 13, 26, 29, _], answer: 58, traps: [32] },
  { key: 'sd16', level: 4, rule: 'alternating', terms: [3, 20, 6, 18, 9, 16, _], answer: 12, traps: [14] },
  { key: 'sd17', level: 4, rule: 'combined', terms: [1, 3, 7, 15, 31, _], answer: 63, traps: [47, 62] },
  { key: 'sd18', level: 4, rule: 'combined', terms: [3, 4, 6, 10, 18, _], answer: 34, traps: [26, 36] },
  { key: 'sd19', level: 4, rule: 'alternating', terms: [3, 6, 5, 10, 9, 18, _], answer: 17, traps: [36, 27] },
  // 5. düzey: önceki iki ya da üç sayının toplamı, kendi kuralı olan artışlar, "üç katının bir eksiği", çarpma ve
  // çıkarmayla ilerleyen iç içe iki dizi.
  { key: 'sd20', level: 5, rule: 'combined', terms: [1, 4, 5, 9, 14, 23, _], answer: 37, traps: [32] },
  { key: 'sd21', level: 5, rule: 'combined', terms: [1, 2, 5, 14, 41, _], answer: 122, traps: [68, 123] },
  { key: 'sd22', level: 5, rule: 'alternating', terms: [2, 60, 4, 54, 8, 48, 16, _], answer: 42, traps: [32] },
  { key: 'sd23', level: 5, rule: 'combined', terms: [1, 2, 2, 5, 9, 16, 30, _], answer: 55, traps: [46, 44] },
  { key: 'sd24', level: 5, rule: 'combined', terms: [1, 2, 6, 15, 31, _], answer: 56, traps: [47] },
];

const PRACTICE: NumberSeriesPracticeItem[] = [
  {
    key: 'sdp1',
    level: 1,
    rule: 'step',
    terms: [10, 20, 30, 40, _],
    answer: 50,
    explain: 'Her sayı bir öncekinden 10 fazla: 10, 20, 30, 40. Bu yüzden eksik sayı 40 + 10 = 50.',
  },
  {
    key: 'sdp2',
    level: 1,
    rule: 'step',
    terms: [30, 26, _, 18, 14],
    answer: 22,
    explain:
      'Her adımda 4 azalıyor: 30’dan 26’ya, 18’den 14’e. Eksik sayı 26 − 4 = 22; 22 − 4 = 18 de tutuyor. Eksik sayı bazen dizinin ortasında olabilir.',
  },
];

export const NUMBER_SERIES_SPECS: readonly Spec[] = SPECS;

const series: NumberSeriesTask = {
  key: 'sayi-dizileri',
  kind: 'number_series',
  name: 'Sayı Dizileri',
  measures: 'Bir kurala göre ilerleyen sayı dizisinde kuralı bulup eksik sayıyı yazabilmeyi (sayılarla akıl yürütme) ölçer.',
  instructions: [
    'Her soruda bir kurala göre ilerleyen bir sayı dizisi göreceksin. Dizideki sayılardan biri eksik: çoğunlukla sonuncusu, bazen ortadaki bir sayı.',
    'Sayıların nasıl değiştiğine bak ve kuralı bul. Sonra eksik sayıyı ekrandaki tuşlarla (ya da klavyeyle) yaz ve “Cevabı ver” düğmesine bas. Kâğıt ve kalem kullanabilirsin; hesap makinesi kullanma.',
    'Sorular kolaydan zora doğru gider; sona doğru zorlanman olağandır. Bulamadığın bir soruda “Bilmiyorum” diyebilirsin. Süre sınırı yok.',
    'Önce doğru cevabı gösterilen iki alıştırma sorusu çözeceksin.',
  ],
  practice: PRACTICE,
  items: SPECS.map(({ key, level, rule, terms }): NumberSeriesItem => ({ key, level, rule, terms })),
  answers: SPECS.map((s) => s.answer),
  traps: SPECS.map((s) => s.traps),
  levels: [
    { level: 1, name: '1. düzey', plain: 'Her adımda aynı küçük sayıyı ekleyerek ya da çıkararak ilerleyen bir diziyi sürdürmek.' },
    {
      level: 2,
      name: '2. düzey',
      plain: 'Daha büyük adımlarla aynı sayıyı ekleme ya da çıkarma, ikiyle çarpma ya da ikiye bölme ya da her adımda bir öncekinden 1 fazlasını ekleme gibi tek bir kuralı bulmak.',
    },
    {
      level: 3,
      name: '3. düzey',
      plain: 'Artışları düzenli büyüyen ya da küçülen dizileri ve iç içe geçmiş iki basit diziyi çözmek, her adımda üçle çarpıldığını görmek ya da dizinin ortasındaki eksik sayıyı bulmak.',
    },
    {
      level: 4,
      name: '4. düzey',
      plain: 'Sırayla değişen iki işlemi, farklı kurallarla ilerleyen iç içe iki diziyi ya da “iki katının bir fazlası” gibi iki adımlı bir kuralı bulmak.',
    },
    {
      level: 5,
      name: '5. düzey',
      plain: 'Her sayının önceki iki ya da üç sayının toplamı olduğu ya da artışların kendi kuralı olan bir dizi oluşturduğu dizileri, “üç katının bir eksiği” gibi kuralları ve çarpma ile çıkarmayla ilerleyen iç içe iki diziyi çözmek.',
    },
  ],
  rapidMs: 2500,
  maxDigits: 4,
};

export const sayiDizileri: TaskInstrument = {
  slug: 'sayi-dizileri',
  version: 1,
  engine: 'tasks',
  name: 'Sayı Dizileri',
  shortName: 'Sayı dizileri',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 49.5,
  tagline: 'Bir kurala göre ilerleyen sayı dizilerinde kuralı bulup eksik sayıyı yazabilmeyi, yani sayılarla akıl yürütebilmeyi ölçer.',
  description:
    'Bu test, akıl yürütmeyi ölçmek için sık kullanılan “sayı dizisi” sorularına dayanır: bir kurala göre ilerleyen dizideki eksik sayıyı bulmak gerekir. Sorular seçenekli değildir, cevap yazılır; bu yüzden tahminle doğru bulmak çok zordur. Sorular kolaydan zora doğru beş düzeyde ilerler ve toplama, çıkarma, çarpma ve bölme bilgisi gerektirir. Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi tür kuralların daha kolay bulunduğunu, yanlış cevapların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Eksik sayıyı bul',
    paragraphs: [
      'Birazdan bir kurala göre ilerleyen sayı dizileri göreceksin. Her dizide bir sayı eksik; kuralı bulup eksik sayıyı yazacaksın.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler. Süre sınırı yok. Yanında kâğıt ve kalem bulunsun; hesap makinesi kullanma.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'sd_dogru', name: 'Doğru cevaplar', plain: 'Kuralı bulup eksik sayının doğru yazıldığı soruların sayısı.' },
    { key: 'sd_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'sd_kural', name: 'Kural türleri', plain: 'Hangi tür kuralların daha kolay, hangilerinin daha zor bulunduğu.' },
    { key: 'sd_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı, kaç soruda “Bilmiyorum” dendiği ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [series],
  science: {
    basedOn:
      'Sayı dizisi soruları: akıl yürütmeyi, yani örneklerden bir kural çıkarıp onu sürdürebilmeyi ölçmek için sık kullanılan bir soru türü (LeFevre ve Bisanz, 1986). Sorular; sabit artış ya da azalış, çarpma ve bölme, değişen artış, iç içe diziler ve birleşik kurallar olmak üzere beş kural türüyle Ölçekhane tarafından özgün olarak yazılmıştır; ticari testlerin soruları, puanlama kuralları ya da normları kullanılmaz. Cevaplar seçeneklerden seçilmez, yazılır.',
    whatItMeasures:
      'Sayılarla akıl yürütmeyi, yani bir dizideki sayılar arasındaki ilişkiyi bulup kuralı sürdürebilmeyi ölçer. Bunun için sayılar arasındaki ilişkileri (ör. “her adımda 3 fazla”, “bir öncekinin iki katı”) fark etmek, bulunan kuralı dizinin bütün sayılarında denemek ve hesabı doğru yapmak gerekir. LeFevre ve Bisanz’ın (1986) çalışmasında, bir sayı dizisi testinde yüksek ve düşük puan alanların, ezbere bilinen sayı dizilerini (ör. beşer beşer sayma) tanımada ve hesaplamada ne kadar verimli olduklarıyla ayrıldığı görülmüştür; yani sayı bilgisi ve hesap rahatlığı bu sorulardaki sonuçla ilişkilidir. Üniversite öğrencileriyle yapılan bir çalışmada, sayılar arasındaki ilişkileri (ör. “+3”) kâğıda yazarak çözülen soruların sayısıyla toplam puan arasında güçlü bir ilişki bulunmuş; bu tür not almayı anlatan yaklaşık 15 dakikalık bir video izleyenlerin, başka bir video izleyenlerden daha yüksek puan aldığı ve bu farkın daha çok soruda not almalarıyla açıklandığı görülmüştür (Schneider ve Sparfeldt, 2021).',
    turkishVersion: 'Özgün test. Sorular sayılarla yazılmıştır; yönergeler Türkçedir.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sorular, kuralın türüne ve izlenmesi gereken adım sayısına göre kolaydan zora beş düzeye ayrılmıştır; bu sıralama Ölçekhane’nin tasarımıdır ve soruların bu testteki gerçek zorluk sırası henüz veriyle denetlenmedi. Her sorunun tek doğru cevabı olduğu, sık kullanılan dizi kurallarını (sabit fark, sabit oran, düzenli değişen farklar, önceki sayılardan hesaplama, iç içe iki dizi, sırayla değişen işlemler) tek tek deneyen bir bilgisayar programıyla denetlenmiştir: denenen kurallardan dizinin bilinen sayılarına uyanların hepsi aynı eksik sayıyı verir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ve hangi tür kurallarda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Akıl yürütme becerisi erken ve orta çocuklukta hızla gelişir, gençliğin ilk yıllarına kadar daha yavaş da olsa gelişmeyi sürdürür ve gençlik yıllarının ortasıyla sonu arasında durağanlaşır (Ferrer, O’Hare ve Bunge, 2009); sayı dizilerinde ayrıca öğrenilmiş işlemler de rol oynar. Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir. Bir norm Türkiye’de, yaş gruplarına göre ayrı ayrı oluşturulmalıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. İlk düzeylerde toplama ve çıkarma, üst düzeylerde çarpma, bölme ve birkaç adımlı hesaplar gerekir; küçük sınıflarda henüz rahatça yapılamayan işlemlerin gerektiği sorularda zorlanmak beklenen bir durumdur. Telefonla da çözülebilir; yanında kâğıt ve kalem bulunması önerilir.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Akıl yürütmenin yalnızca sayılarla yapılan yönünü ölçer ve sonuç sayı bilgisi ve hesap rahatlığıyla da ilişkilidir (LeFevre ve Bisanz, 1986). Şekillerle ve sözcüklerle akıl yürütme, bilgi, bellek ve hız gibi öteki beceriler hakkında bilgi vermez.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve kâğıt kalem kullanılıp kullanılmadığından etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu tür soruları çözme yollarını bilmek sonucu etkileyebilir: sayılar arasındaki ilişkileri not almayı anlatan yaklaşık 15 dakikalık bir video izleyenlerin, başka bir video izleyenlerden daha yüksek puan aldığı gösterilmiştir (Schneider ve Sparfeldt, 2021).',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'LeFevre, J.-A. ve Bisanz, J. (1986). A cognitive analysis of number-series problems: Sources of individual differences in performance. Memory & Cognition, 14(4), 287–298.',
        url: 'https://doi.org/10.3758/BF03202506',
      },
      {
        text: 'Schneider, B. ve Sparfeldt, J. R. (2021). How to get better: Taking notes mediates the effect of a video tutorial on number series. Journal of Intelligence, 9(4), 55.',
        url: 'https://doi.org/10.3390/jintelligence9040055',
      },
      {
        text: 'Ferrer, E., O’Hare, E. D. ve Bunge, S. A. (2009). Fluid reasoning and the developing brain. Frontiers in Neuroscience, 3(1), 46–51.',
        url: 'https://doi.org/10.3389/neuro.01.003.2009',
      },
    ],
  },
};
