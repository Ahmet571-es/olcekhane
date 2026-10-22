import { ARITH_NAME } from '@/lib/instruments/arithmetic';
import type { ArithItem, ArithOp, MentalArithmeticTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Zihinden Hesaplama Hızı (aritmetik akıcılık): dört işlemin her biri için 60 saniyelik bir bölüm. İşlemler tek tek
 * gösterilir, sonuç tuş takımıyla (ya da klavyeyle) yazılır; "Geç" de denebilir. Her bölüm altı düzeyden oluşur, her
 * düzeyde 8 işlem vardır (48 işlem): ilk düzeyler temel işlemler (tek basamaklı toplama ve çıkarma, çarpım tablosu),
 * sonrakiler iki basamaklı sayılarla eldesiz ve eldeli (bozmasız ve bozmalı) işlemlerdir. Süreli ve kolaydan zora giden
 * bölümler, araştırmalarda kullanılan aritmetik akıcılık testlerinin düzenine benzer; işlemler, düzenleri, puanlama ve rapor
 * Ölçekhane'nindir. Ticari ya da araştırma amaçlı testlerin maddeleri, puanlama kuralları ya da normları kullanılmaz.
 *
 * İşlemlerin kuralları (tests/zihinden-hesaplama.test.ts her işlemde denetler):
 *  - Toplama: 1) iki tek basamaklı sayı, toplamı 10'a kadar; 2) iki tek basamaklı sayı, onluğu geçen; 3) iki basamaklıya tek
 *    basamaklı, eldesiz; 4) aynısı eldeli; 5) iki basamaklı iki sayı, eldesiz; 6) aynısı eldeli. Bütün toplamlar 100'den küçük.
 *  - Çıkarma: 1) 10'a kadar; 2) 11–18'den tek basamaklı, sonucu tek basamaklı (onluğu geçen); 3) iki basamaklıdan tek
 *    basamaklı, onluk bozmadan; 4) aynısı onluk bozarak; 5) iki basamaklı iki sayı, bozmadan; 6) aynısı bozarak.
 *  - Çarpma: 1) 2, 5 ve 10 ile; 2) 3 ve 4 ile; 3) 6–9 birbiriyle; 4) iki basamaklı × tek basamaklı, eldesiz; 5) aynısı
 *    eldeli, sonucu 100'den küçük; 6) sonucu 100 ya da büyük.
 *  - Bölme (hepsi kalansız): 1) 2'ye, 5'e ve 10'a; 2) 3'e ve 4'e; 3) 6–9'a, bölüm 6–9; 4) bölümü iki basamaklı, her basamak
 *    tam bölünür; 5) bölümü iki basamaklı, ilk basamakta kalan var; 6) üç basamaklı bölünen.
 * Bir bölümde aynı işlem iki kez yoktur (toplamada ve çarpmada yer değiştirmiş biçimi de); bir düzeyde aynı sonuç en çok iki
 * kez geçer; art arda iki işlemin sonucu ya da ikinci sayısı aynı değildir. Alıştırma işlemleri asıl işlemlerde yoktur.
 * Yanlışların türü ayırt edilebilsin diye (lib/instruments/arithmetic.ts): eldeli toplamada ve onluk bozarak çıkarmada tek
 * basamaklı sayı 5 değildir (47 + 5 için 42 hem eldenin unutulması hem 47 − 5 olurdu); ilk düzeyin toplamalarında çarpım,
 * toplamdan bir fazla ya da eksik değildir (3 + 2 için 6). Bölmenin 4. ve 5. düzeyindeki işlemler, çarpma bölümündeki
 * işlemlerin tersi değildir.
 */

const ADD: ArithItem[][] = [
  [[3, 4], [2, 6], [5, 5], [3, 3], [5, 2], [6, 3], [4, 4], [2, 7]],
  [[9, 4], [6, 8], [4, 7], [8, 8], [7, 7], [3, 9], [9, 8], [7, 6]],
  [[32, 5], [64, 3], [21, 6], [45, 4], [73, 5], [16, 3], [52, 7], [81, 6]],
  [[47, 8], [36, 7], [57, 6], [29, 4], [65, 9], [18, 6], [74, 8], [39, 6]],
  [[23, 34], [41, 26], [52, 35], [16, 72], [33, 45], [61, 18], [24, 52], [45, 32]],
  [[27, 46], [38, 45], [19, 37], [56, 28], [64, 29], [17, 58], [35, 47], [46, 19]],
];

const SUB: ArithItem[][] = [
  [[9, 4], [7, 3], [8, 5], [10, 6], [6, 4], [10, 3], [9, 7], [8, 2]],
  [[13, 8], [12, 6], [15, 7], [13, 9], [11, 4], [17, 8], [12, 9], [16, 8]],
  [[47, 3], [68, 5], [29, 4], [86, 2], [35, 3], [59, 7], [76, 4], [93, 2]],
  [[52, 7], [34, 6], [81, 7], [63, 8], [45, 9], [72, 4], [96, 8], [27, 9]],
  [[68, 23], [79, 35], [87, 52], [56, 14], [95, 61], [48, 26], [97, 43], [69, 17]],
  [[52, 27], [83, 46], [61, 34], [74, 28], [95, 67], [43, 19], [86, 39], [92, 56]],
];

const MUL: ArithItem[][] = [
  [[2, 7], [5, 6], [10, 4], [8, 2], [5, 9], [9, 2], [3, 10], [4, 5]],
  [[3, 6], [4, 7], [8, 3], [4, 9], [7, 3], [6, 4], [9, 3], [4, 8]],
  [[7, 8], [6, 9], [9, 7], [8, 6], [7, 7], [8, 9], [6, 7], [9, 9]],
  [[12, 3], [21, 4], [14, 2], [32, 3], [23, 2], [13, 3], [41, 2], [22, 4]],
  [[16, 4], [27, 3], [18, 5], [14, 6], [13, 7], [17, 4], [19, 3], [12, 8]],
  [[36, 4], [47, 3], [25, 6], [34, 5], [18, 7], [53, 4], [29, 6], [46, 3]],
];

const DIV: ArithItem[][] = [
  [[14, 2], [40, 5], [60, 10], [18, 2], [35, 5], [90, 10], [12, 2], [25, 5]],
  [[24, 3], [28, 4], [18, 3], [36, 4], [21, 3], [16, 4], [27, 3], [32, 4]],
  [[56, 8], [63, 7], [48, 6], [42, 7], [72, 9], [36, 6], [81, 9], [49, 7]],
  [[48, 4], [69, 3], [84, 2], [44, 4], [63, 3], [62, 2], [99, 3], [86, 2]],
  [[72, 4], [98, 7], [51, 3], [96, 6], [75, 5], [78, 6], [92, 4], [84, 7]],
  [[156, 6], [252, 7], [184, 4], [135, 5], [168, 8], [117, 9], [192, 6], [224, 8]],
];

/** Düzeylerin adları (raporda "Düzeylere göre doğrular" grafiğinde); örnekler o düzeyin işlemlerindendir. */
const LEVELS: Record<ArithOp, string[]> = {
  add: [
    'Toplamı 10’a kadar (3 + 4)',
    'Onluğu geçen (9 + 4)',
    'İki basamaklıya tek basamaklı, eldesiz (32 + 5)',
    'İki basamaklıya tek basamaklı, eldeli (47 + 8)',
    'İki basamaklı iki sayı, eldesiz (23 + 34)',
    'İki basamaklı iki sayı, eldeli (27 + 46)',
  ],
  sub: [
    '10’a kadar (9 − 4)',
    'Onluğu geçen (13 − 8)',
    'İki basamaklıdan tek basamaklı, onluk bozmadan (47 − 3)',
    'İki basamaklıdan tek basamaklı, onluk bozarak (52 − 7)',
    'İki basamaklı iki sayı, onluk bozmadan (68 − 23)',
    'İki basamaklı iki sayı, onluk bozarak (52 − 27)',
  ],
  mul: [
    '2, 5 ve 10 ile (2 × 7)',
    '3 ve 4 ile (3 × 6)',
    '6, 7, 8 ve 9 birbiriyle (7 × 8)',
    'İki basamaklı × tek basamaklı, eldesiz (12 × 3)',
    'İki basamaklı × tek basamaklı, eldeli (16 × 4)',
    'Sonucu 100 ya da daha büyük (36 × 4)',
  ],
  div: [
    '2’ye, 5’e ve 10’a bölme (14 ÷ 2)',
    '3’e ve 4’e bölme (24 ÷ 3)',
    '6, 7, 8 ve 9’a bölme (56 ÷ 8)',
    'Bölümü iki basamaklı, her basamak tam bölünür (48 ÷ 4)',
    'Bölümü iki basamaklı, ilk basamakta kalan var (72 ÷ 4)',
    'Üç basamaklı bir sayıyı bölme (156 ÷ 6)',
  ],
};

/** Alıştırma: biri tek basamaklı, biri iki basamaklı (asıl işlemlerde yoktur). */
const PRACTICE: Record<ArithOp, ArithItem[]> = {
  add: [
    [4, 2],
    [42, 5],
  ],
  sub: [
    [7, 4],
    [56, 3],
  ],
  mul: [
    [3, 5],
    [21, 3],
  ],
  div: [
    [20, 4],
    [66, 3],
  ],
};

/** Her işlemin işlemleri (düzeyler sırayla). Testler ve rapor örnekleri buradan okur. */
export const ARITH_ITEMS: Record<ArithOp, ArithItem[][]> = { add: ADD, sub: SUB, mul: MUL, div: DIV };
export const ARITH_LEVELS = LEVELS;
export const ARITH_PRACTICE = PRACTICE;

const DURATION_MS = 60_000;
const PER_LEVEL = 8;

const MEASURES: Record<ArithOp, string> = {
  add: 'Toplama işlemlerini zihinden, doğru ve hızlı yapabilmeyi ölçer.',
  sub: 'Çıkarma işlemlerini zihinden, doğru ve hızlı yapabilmeyi ölçer.',
  mul: 'Çarpma işlemlerini zihinden, doğru ve hızlı yapabilmeyi ölçer.',
  div: 'Bölme işlemlerini zihinden, doğru ve hızlı yapabilmeyi ölçer.',
};

/** "toplama" → "Ekranda bir toplama işlemi göreceksin." */
const NOUN: Record<ArithOp, string> = { add: 'toplama', sub: 'çıkarma', mul: 'çarpma', div: 'bölme' };

function task(op: ArithOp): MentalArithmeticTask {
  return {
    key: `zh-${op}`,
    kind: 'mental_arithmetic',
    name: ARITH_NAME[op],
    measures: MEASURES[op],
    instructions: [
      `Ekranda bir ${NOUN[op]} işlemi göreceksin. Sonucu zihninden bul, tuşlarla yaz ve “Tamam” düğmesine bas.`,
      `İşlemler kolaydan zora gider. ${DURATION_MS / 1000} saniye boyunca yapabildiğin kadar işlem yap; olabildiğince hızlı ama dikkatli çalış. Bütün işlemleri bitirmen beklenmez.`,
      'Yapamadığın bir işlemde “Geç” diyebilirsin. Kâğıt, kalem ya da hesap makinesi kullanma. Önce iki alıştırma işlemi yapacaksın.',
    ],
    op,
    durationMs: DURATION_MS,
    practice: PRACTICE[op],
    items: ARITH_ITEMS[op].flat(),
    levels: LEVELS[op],
    perLevel: PER_LEVEL,
    // Temel işlemler: toplamada ve çıkarmada tek basamaklı işlemler (ilk iki düzey), çarpmada ve bölmede çarpım tablosu
    // (ilk üç düzey).
    factLevels: op === 'add' || op === 'sub' ? 2 : 3,
    maxDigits: 3,
  };
}

export const zihindenHesaplama: TaskInstrument = {
  slug: 'zihinden-hesaplama-hizi',
  version: 1,
  engine: 'tasks',
  name: 'Zihinden Hesaplama Hızı',
  shortName: 'Zihinden hesaplama',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 4,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 8,
  sortOrder: 49.82,
  tagline: 'Dört işlemi zihinden ne kadar doğru ve hızlı yapabildiğini ölçer: toplama, çıkarma, çarpma ve bölme.',
  description:
    'Bu test aritmetik akıcılığı, yani dört işlemi zihinden doğru ve hızlı yapabilmeyi ölçer. Toplama, çıkarma, çarpma ve bölme için 60’ar saniyelik dört bölüm vardır. İşlemler kolaydan zora gider: tek basamaklı işlemler ve çarpım tablosuyla başlar, iki basamaklı sayılarla eldeli ve onluk bozmalı işlemlerle sürer. Cevaplar tuşlarla yazılır; test yaklaşık 8 dakika sürer. Rapor, her işlemde 60 saniyede kaç işlemin doğru yapıldığını ve hangi düzeye gelindiğini anlatır. Yanlışların türünü (ör. eldeyi atlamak) ve temel işlemlerde doğru cevap başına süreyi de sade bir dille açıklar. İşlemler Ölçekhane tarafından özgün olarak hazırlanmıştır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Zihinden hesapla',
    paragraphs: [
      'Birazdan dört kısa bölümde toplama, çıkarma, çarpma ve bölme işlemleri göreceksin. Her bölüm 60 saniye sürer.',
      'İşlemler kolaydan zora gider; herkesin bütün işlemleri bitirmesi beklenmez. Olabildiğince hızlı ama dikkatli çalış: yanlış yazmaktansa bir an düşünmek daha iyidir.',
      'Kâğıt, kalem ve hesap makinesi kullanma. Sessiz bir yerde, dikkatini dağıtacak bir şey olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'zh_genel', name: 'Dört işlemde doğru cevaplar', plain: 'Her işlemin 60 saniyelik bölümünde doğru yapılan işlem sayısı.' },
    { key: 'zh_toplama', name: 'Toplama', plain: '60 saniyede doğru yapılan toplama işlemleri ve ulaşılan düzey.' },
    { key: 'zh_cikarma', name: 'Çıkarma', plain: '60 saniyede doğru yapılan çıkarma işlemleri ve ulaşılan düzey.' },
    { key: 'zh_carpma', name: 'Çarpma', plain: '60 saniyede doğru yapılan çarpma işlemleri ve ulaşılan düzey.' },
    { key: 'zh_bolme', name: 'Bölme', plain: '60 saniyede doğru yapılan bölme işlemleri ve ulaşılan düzey.' },
    { key: 'zh_dogruluk', name: 'Doğruluk ve hata türleri', plain: 'Yazılan cevapların ne kadarının doğru olduğu ve yanlışların türü.' },
    {
      key: 'zh_hiz',
      name: 'Temel işlemlerin hızı',
      plain: 'Her bölümün ilk düzeylerindeki temel işlemlerde (tek basamaklı sayılarla toplama, 20’ye kadar çıkarma, çarpım tablosu ve ona dayanan bölmeler) doğru cevap başına tipik süre.',
    },
  ],
  tasks: (['add', 'sub', 'mul', 'div'] as const).map(task),
  science: {
    basedOn:
      'Aritmetik akıcılık testlerinin düzenine dayanır: her işlem için kısa, süreli bir bölüm ve kolaydan zora giden işlemler. Örneğin Hollanda’da geliştirilen Tempo-Test-Rekenen’de toplama, çıkarma, çarpma, bölme ve karışık işlemler için kırkar işlemlik beş sütun vardır; her sütuna bir dakika verilir (Lafay ve ark., 2015); puan, süre içinde doğru yapılan işlemlerin sayısıdır (Vanbinst ve ark., 2019). İsrail’de 1–6. sınıf öğrencileriyle denenen bilgisayarlı bir akıcılık testinde de işlemler ekranda tek tek gösterilir ve cevap yazılır (Gliksman ve ark., 2022). Bu testin işlemleri, düzenleri, puanlaması ve raporu Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı testlerin maddeleri, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Aritmetik akıcılığı, yani dört işlemi zihinden hem doğru hem hızlı yapabilmeyi ölçer. İşlemler önce sayarak hesaplanır; beceri geliştikçe sonuç bellekten doğrudan hatırlanmaya başlar (Koponen ve ark., 2016; Soltanlou ve ark., 2015). Akıcı hesaplama, zihni daha karmaşık problemlere ayırmaya yardım eder (Koponen ve ark., 2016). Türkiye’de 5. ve 6. sınıf öğrencileriyle yapılan bir çalışmada Tempo-Test-Rekenen puanları sözel problem çözme başarısını yordamıştır (Sarı ve ark., 2014). İngiltere’de yapılan bir çalışmada da toplama ve çıkarmadaki akıcılık matematik başarısıyla güçlü biçimde ilişkiliydi. Ama öteki etkenler hesaba katılınca akıcılığın tek başına açıkladığı pay küçüktü (Cowan ve ark., 2011). Rapor ayrıca yanlışların türüne bakar. Çok basamaklı çıkarmada her basamakta büyükten küçüğü çıkarmak bilinen bir onluk bozma yanlışıdır (Vermeulen ve ark., 2020). Çarpım tablosundaki işlemlerde çocukların yanlışlarının yaklaşık dörtte üçünün, çarpanlardan birinin tablosundaki başka bir sonuç olduğu bildirilmiştir (ör. 7 × 8 için 7 × 9 = 63) (Soltanlou ve ark., 2015’te aktarılan bir araştırma). Sayılar büyüdükçe işlemler daha uzun sürer ve daha sık yanlış yapılır (Prado ve ark., 2013).',
    turkishVersion: 'Özgün test. İşlemler ve yönergeler Türkçe olarak hazırlanmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her işlemin sonucu ve her düzeyin kuralı, işlemlerin sayılarından bağımsızca yeniden hesaplanarak denetlenir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan anlatılır: her işlemde doğru yapılan işlem sayısı, ulaşılan düzey, yanlışların türü ve temel işlemlerde doğru cevap başına süre. Zekâ puanı (IQ) verilmez. Bir araştırmada büyük çocuklar küçüklerden daha çok işlemi doğru ve daha hızlı yaptı. Bölmedeki doğruluk, araştırmadaki en büyük çocuklarda bile öteki işlemlerden düşüktü (Gliksman ve ark., 2022). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelebilir.',
    ageNote:
      '4. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Çarpım tablosu 3. sınıfta 10’a kadar (10 dâhil) oluşturulur (Millî Eğitim Bakanlığı, 2026). Her bölüm 60 saniye sürer. Süreye cevabı tuşlarla yazmak da dahildir; tuş takımına ya da klavyeye alışkın olmak süreyi biraz etkileyebilir.',
    license: 'Özgün test. İşlemler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; matematik bilgisinin ya da problem çözmenin tamamını ölçmez.',
      'Süre sınırı bazı kişileri gerebilir. Süre baskısı daha zayıf yöntemlere yönelmeye yol açabilir; matematik kaygısı olan çocuklar süre baskısında daha düşük sonuç alabilir (Caviola ve ark., 2017).',
      'Her bölüm 60 saniyedir; düzeylere ve yanlış türlerine göre sonuçlar az sayıda işleme dayanır ve kaba bir göstergedir.',
      'Bölümlerdeki zorluk basamakları işlemden işleme farklıdır; işlemler arasındaki farklar kaba bir karşılaştırmadır.',
      'Sonuç; o günkü yorgunluk, isteklilik ve kullanılan cihazdan etkilenir. Test yeniden çözüldüğünde işlemleri hatırlamak sonucu yükseltebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Caviola, S., Carey, E., Mammarella, I. C. ve Szucs, D. (2017). Stress, time pressure, strategy selection and math anxiety in mathematics: A review of the literature. Frontiers in Psychology, 8, 1488.',
        url: 'https://doi.org/10.3389/fpsyg.2017.01488',
      },
      {
        text: 'Cowan, R., Donlan, C., Shepherd, D.-L., Cole-Fletcher, R., Saxton, M. ve Hurry, J. (2011). Basic calculation proficiency and mathematics achievement in elementary school children. Journal of Educational Psychology, 103(4), 786–803.',
        url: 'https://doi.org/10.1037/a0024556',
      },
      {
        text: 'Gliksman, Y., Berebbi, S. ve Henik, A. (2022). Math fluency during primary school. Brain Sciences, 12(3), 371.',
        url: 'https://doi.org/10.3390/brainsci12030371',
      },
      {
        text: 'Koponen, T., Salmi, P., Torppa, M., Eklund, K., Aro, T., Aro, M., Poikkeus, A.-M., Lerkkanen, M.-K. ve Nurmi, J.-E. (2016). Counting and rapid naming predict the fluency of arithmetic and reading skills. Contemporary Educational Psychology, 44–45, 83–94.',
        url: 'https://doi.org/10.1016/j.cedpsych.2016.02.004',
      },
      {
        text: 'Lafay, A., St-Pierre, M.-C. ve Macoir, J. (2015). Validation franco-québécoise du Tempo Test Rekenen pour l’évaluation des habiletés mathématiques auprès d’enfants de 8-9 ans. Glossa, 118, 27–39.',
        url: 'https://glossa.fr/index.php/glossa/article/download/606/600/593',
      },
      {
        text: 'Millî Eğitim Bakanlığı. (2026). İlkokul matematik dersi 3. sınıf, 3. tema: İşlemlerden cebirsel düşünmeye. Türkiye Yüzyılı Maarif Modeli.',
        url: 'https://tymm.meb.gov.tr/ilkokul-matematik-dersi/unite/264',
      },
      {
        text: 'Prado, J., Lu, J., Liu, L., Dong, Q., Zhou, X. ve Booth, J. R. (2013). The neural bases of the multiplication problem-size effect across countries. Frontiers in Human Neuroscience, 7, 189.',
        url: 'https://doi.org/10.3389/fnhum.2013.00189',
      },
      {
        text: 'Sarı, M. H., Olkun, S., Yıldız, E., Uçar, A. ve Turan, N. (2014). Ortaokul öğrencilerinde işlemsel akıcılık, çarpım tablosu ve sözel problemlerde başarı. İlköğretim Online, 13(4), 1542–1553.',
        url: 'https://doi.org/10.17051/io.2014.12588',
      },
      {
        text: 'Soltanlou, M., Pixner, S. ve Nuerk, H.-C. (2015). Contribution of working memory in multiplication fact network in children may shift from verbal to visuo-spatial: A longitudinal investigation. Frontiers in Psychology, 6, 1062.',
        url: 'https://doi.org/10.3389/fpsyg.2015.01062',
      },
      {
        text: 'Vanbinst, K., Ghesquière, P. ve De Smedt, B. (2019). Is the long-term association between symbolic numerical magnitude processing and arithmetic bi-directional? Journal of Numerical Cognition, 5(3), 358–370.',
        url: 'https://doi.org/10.5964/jnc.v5i3.202',
      },
      {
        text: 'Vermeulen, J. A., Béguin, A., Scheltens, F. ve Eggen, T. J. H. M. (2020). Evaluating the characteristics of diagnostic items for bridging errors in multi-digit subtraction. Frontiers in Education, 5, 537531.',
        url: 'https://doi.org/10.3389/feduc.2020.537531',
      },
    ],
  },
};
