import type {
  NumericItem,
  NumericKind,
  NumericLureKind,
  NumericPracticeItem,
  NumericRatio,
  NumericalReasoningTask,
  TaskInstrument,
} from '@/lib/instruments/types';

/**
 * Sayısal akıl yürütme: her soruda bir durumdaki ya da bir eşitlikteki eksik sayı yazılır (seçenek yoktur). Bütün sorular
 * Ölçekhane'nindir.
 *
 * 24 soru, üç grup (her grupta 8):
 *  - Orantılı durumlar (`p`): iki nicelik aynı oranda büyür. Dördünde sayılar birbirinin tam katıdır (`int`), dördünde
 *    değildir (`frac`). Yanılgı cevabı: aradaki farkı korumak (ör. 4 bardak suya 6 kaşık → 10 bardak suya 12 kaşık).
 *  - Orantılı olmayan durumlar: aradaki farkın korunduğu dört durum (`a`; ikisi tam katlı, ikisi değil), miktar artsa da
 *    sonucun değişmediği iki durum (`c`) ve başlangıç miktarı olan iki durum (`f`). Yanılgı cevabı: orantı kurmak.
 *    Orantılı ve fark korunan durumlar araştırmalardaki gibi eş kurulur: "aynı anda başladılar, biri daha hızlı" orantı,
 *    "aynı hızla gidiyorlar, biri daha önce başladı" farkın korunmasıdır (Fernández ve ark., 2012).
 *  - Eşitlik ve denge: eşittir işaretinin iki yanı (`eq`, 2), bir sayı değişince ötekinin nasıl değişeceği (`comp`, 4;
 *    toplama, çıkarma, çarpma, bölme) ve terazi (`bal`, 2). Yanılgı cevapları: solundaki işlemin sonucu ya da bütün
 *    sayıların toplamı (`operational`; Knuth ve ark., 2006), ters yönde denkleştirme (`reverse`) ve terazinin iki
 *    kefesindeki ortak şeyi hesaba katmamak (`partial`).
 *
 * Sayılar tam katlı olduğunda orantı, olmadığında fark daha sık kullanıldığı için (Fernández ve ark., 2012) tam katlı
 * olmayan orantılı durumlar ile tam katlı fark korunan durumlarda sayılar yanlış yönteme çeker; raporda bu altı soru ayrıca
 * sayılır. Cevaplar ve yanılgı cevapları tests/helpers/numeric-check.ts'te sorunun sayılarından bağımsızca yeniden
 * hesaplanır. Her yarıda her gruptan dört soru vardır.
 */

interface Spec {
  key: string;
  kind: NumericKind;
  ratio?: NumericRatio;
  stem: string[];
  question: string;
  unit?: string;
  answer: number;
  lures: Partial<Record<NumericLureKind, number[]>>;
}

const EQ_QUESTION = 'Kutunun yerine hangi sayı gelmeli?';

/** Uygulama sırası: üç grup karışık; her yarıda her gruptan dört soru. */
const SPECS: Spec[] = [
  {
    key: 'sy01',
    kind: 'p',
    ratio: 'int',
    stem: ['Bir fırında 3 simit 15 lira.'],
    question: 'Aynı simitlerden 9 tane kaç lira?',
    unit: 'lira',
    answer: 45,
    lures: { additive: [21] },
  },
  { key: 'sy02', kind: 'eq', stem: ['7 + 8 = □ + 6'], question: EQ_QUESTION, answer: 9, lures: { operational: [15, 21] } },
  {
    key: 'sy03',
    kind: 'a',
    ratio: 'int',
    stem: ['Ece 3 yaşındayken ablası 9 yaşındaydı.'],
    question: 'Ece 12 yaşına geldiğinde ablası kaç yaşında olur?',
    unit: 'yaş',
    answer: 18,
    lures: { proportional: [36] },
  },
  {
    key: 'sy04',
    kind: 'p',
    ratio: 'frac',
    stem: ['Bir limonata için 4 bardak suya 6 kaşık limon suyu konuyor.'],
    question: 'Aynı tatta limonata için 10 bardak suya kaç kaşık limon suyu konmalı?',
    unit: 'kaşık',
    answer: 15,
    lures: { additive: [12] },
  },
  {
    key: 'sy05',
    kind: 'c',
    stem: ['Uzun bir ipe asılan 3 gömlek 5 saatte kuruyor.', 'İpte yer bol; gömlekler birbirine değmiyor.'],
    question: 'Aynı ipe aynı anda 6 gömlek asılırsa hepsi kaç saatte kurur?',
    unit: 'saat',
    answer: 5,
    lures: { proportional: [10] },
  },
  { key: 'sy06', kind: 'comp', stem: ['38 + 27 = 40 + □'], question: EQ_QUESTION, answer: 25, lures: { operational: [65, 105], reverse: [29] } },
  {
    key: 'sy07',
    kind: 'p',
    ratio: 'int',
    stem: ['Bir kek tarifinde 2 yumurtaya 6 kaşık şeker konuyor.'],
    question: 'Aynı tatta, daha büyük bir kek için 8 yumurta kullanılırsa kaç kaşık şeker gerekir?',
    unit: 'kaşık',
    answer: 24,
    lures: { additive: [12] },
  },
  {
    key: 'sy08',
    kind: 'f',
    stem: ['Bir taksiye binince ücret 20 liradan başlıyor ve her kilometrede aynı miktar artıyor.', '2 kilometrelik bir yolculuk 40 lira tuttu.'],
    question: '6 kilometrelik bir yolculuk kaç lira tutar?',
    unit: 'lira',
    answer: 80,
    lures: { proportional: [120] },
  },
  {
    key: 'sy09',
    kind: 'a',
    ratio: 'frac',
    stem: ['İki fidan her hafta birbiriyle aynı miktarda uzuyor.', 'Birinci fidan 6 cm iken ikinci fidan 8 cm’ydi.'],
    question: 'Birinci fidan 9 cm olduğunda ikinci fidan kaç cm olur?',
    unit: 'cm',
    answer: 11,
    lures: { proportional: [12] },
  },
  { key: 'sy10', kind: 'eq', stem: ['9 + 6 = 8 + □'], question: EQ_QUESTION, answer: 7, lures: { operational: [15, 23] } },
  {
    key: 'sy11',
    kind: 'p',
    ratio: 'frac',
    stem: ['Deniz ile Efe aynı anda koşmaya başlıyor. İkisi de hızını hiç değiştirmiyor ama Efe daha hızlı.', 'Deniz 4 tur attığında Efe 10 tur atmış oluyor.'],
    question: 'Deniz 14 tur attığında Efe kaç tur atmış olur?',
    unit: 'tur',
    answer: 35,
    lures: { additive: [20] },
  },
  { key: 'sy12', kind: 'comp', stem: ['73 − 28 = 75 − □'], question: EQ_QUESTION, answer: 30, lures: { operational: [45], reverse: [26] } },
  {
    key: 'sy13',
    kind: 'c',
    stem: ['20 kişilik bir koro bir şarkıyı 6 dakikada söylüyor.'],
    question: '60 kişilik bir koro aynı şarkıyı kaç dakikada söyler?',
    unit: 'dakika',
    answer: 6,
    lures: { proportional: [18], inverse: [2] },
  },
  {
    key: 'sy14',
    kind: 'p',
    ratio: 'int',
    stem: [
      'Ayşe ile Kerem aynı anda kitap okumaya başlıyor. İkisi de hızını hiç değiştirmiyor ama Kerem daha hızlı.',
      'Ayşe 10 sayfa okuduğunda Kerem 30 sayfa okumuş oluyor.',
    ],
    question: 'Ayşe 50 sayfa okuduğunda Kerem kaç sayfa okumuş olur?',
    unit: 'sayfa',
    answer: 150,
    lures: { additive: [70] },
  },
  {
    key: 'sy15',
    kind: 'a',
    ratio: 'int',
    stem: ['Zeynep ile Arda aynı hızla koşuyor ama Arda koşmaya daha önce başladı.', 'Zeynep 2 tur attığında Arda 10 tur atmış oluyor.'],
    question: 'Zeynep 6 tur attığında Arda kaç tur atmış olur?',
    unit: 'tur',
    answer: 14,
    lures: { proportional: [30] },
  },
  { key: 'sy16', kind: 'comp', stem: ['6 × 8 = 12 × □'], question: EQ_QUESTION, answer: 4, lures: { operational: [48], reverse: [16] } },
  {
    key: 'sy17',
    kind: 'f',
    stem: ['Ali’nin kumbarasında başta 15 lira vardı. Ali her hafta kumbarasına aynı miktarda para atıyor.', '3 hafta sonra kumbarada 30 lira vardı.'],
    question: '9 hafta sonra kumbarada kaç lira olur?',
    unit: 'lira',
    answer: 60,
    lures: { proportional: [90] },
  },
  {
    key: 'sy18',
    kind: 'p',
    ratio: 'frac',
    stem: ['Bir fotoğraf, şekli bozulmadan büyütülüyor.', 'Fotoğrafın eni 6 cm, boyu 8 cm.'],
    question: 'Büyütülen fotoğrafın eni 15 cm olursa boyu kaç cm olur?',
    unit: 'cm',
    answer: 20,
    lures: { additive: [17] },
  },
  {
    key: 'sy19',
    kind: 'a',
    ratio: 'frac',
    stem: ['Mert ile Selin aynı hızla kitap okuyor ama Selin okumaya daha önce başladı.', 'Mert 40 sayfa okuduğunda Selin 90 sayfa okumuş oluyor.'],
    question: 'Mert 60 sayfa okuduğunda Selin kaç sayfa okumuş olur?',
    unit: 'sayfa',
    answer: 110,
    lures: { proportional: [135] },
  },
  { key: 'sy20', kind: 'comp', stem: ['48 ÷ 6 = 24 ÷ □'], question: EQ_QUESTION, answer: 3, lures: { operational: [8], reverse: [12] } },
  {
    key: 'sy21',
    kind: 'p',
    ratio: 'frac',
    stem: ['Bir boyacı, 6 kutu mavi boyaya 14 kutu beyaz boya karıştırarak açık mavi bir renk elde ediyor.'],
    question: 'Aynı rengi elde etmek için 9 kutu mavi boyaya kaç kutu beyaz boya karıştırmalı?',
    unit: 'kutu',
    answer: 21,
    lures: { additive: [17] },
  },
  {
    key: 'sy22',
    kind: 'bal',
    stem: ['Bir terazinin bir kefesinde aynı ağırlıkta 4 paket, öbür kefesinde bu paketlerden 1 tane ve 12 kiloluk bir ağırlık var.', 'Terazi dengede.'],
    question: 'Bir paket kaç kilodur?',
    unit: 'kilo',
    answer: 4,
    lures: { partial: [3] },
  },
  {
    key: 'sy23',
    kind: 'p',
    ratio: 'int',
    stem: ['Bir bisikletli hep aynı hızla gidiyor ve 3 kilometreyi 12 dakikada alıyor.'],
    question: '15 kilometreyi kaç dakikada alır?',
    unit: 'dakika',
    answer: 60,
    lures: { additive: [24] },
  },
  {
    key: 'sy24',
    kind: 'bal',
    stem: [
      'Bir terazinin bir kefesinde 2 elma, öbür kefesinde 1 kavun var; terazi dengede.',
      'Başka bir terazinin bir kefesinde aynı kavun ile 1 elma, öbür kefesinde 600 gramlık bir ağırlık var; bu terazi de dengede.',
      'Elmaların hepsi aynı ağırlıkta.',
    ],
    question: 'Bir elma kaç gramdır?',
    unit: 'gram',
    answer: 200,
    lures: { partial: [300] },
  },
];

export const NUMERIC_SPECS: readonly Spec[] = SPECS;

/** Alıştırma: biri durum, biri eşitlik (yalnızca cevabın nasıl yazılacağını gösterir; orantı ya da eşitlik yanılgılarına ipucu vermez). */
const PRACTICE: NumericPracticeItem[] = [
  {
    key: 'syp1',
    stem: ['Bir otobüste 14 yolcu vardı. Durakta 5 yolcu indi, 3 yolcu bindi.'],
    question: 'Otobüste şimdi kaç yolcu var?',
    unit: 'yolcu',
    answer: 12,
    explain: '14 yolcudan 5’i inince 9 yolcu kalır; 3 yolcu binince 12 yolcu olur.',
  },
  {
    key: 'syp2',
    stem: ['□ + 3 = 10'],
    equation: true,
    question: EQ_QUESTION,
    answer: 7,
    explain: 'Kutuya 7 yazılınca 7 + 3 = 10 olur.',
  },
];

const task: NumericalReasoningTask = {
  key: 'sayisal-akil-yurutme',
  kind: 'numerical_reasoning',
  name: 'Sayısal Akıl Yürütme',
  measures: 'Bir durumdaki sayıların birbiriyle nasıl ilişkili olduğunu görüp eksik sayıyı bulabilmeyi ölçer.',
  instructions: [
    'Her soruda kısa bir durum ya da eksik sayısı olan bir eşitlik göreceksin.',
    'Soruyu dikkatle oku ve cevabı tuşlarla yaz. Cevaplar kesirli ya da virgüllü değildir.',
    'Cevabı bulamadığın bir soruda “Bilmiyorum” diyebilirsin.',
  ],
  practice: PRACTICE,
  items: SPECS.map((s): NumericItem => ({
    key: s.key,
    stem: [...s.stem],
    ...(s.kind === 'eq' || s.kind === 'comp' ? { equation: true } : {}),
    question: s.question,
    ...(s.unit ? { unit: s.unit } : {}),
  })),
  answers: SPECS.map((s) => s.answer),
  kinds: SPECS.map((s) => s.kind),
  ratios: SPECS.map((s) => s.ratio ?? null),
  lures: SPECS.map((s) => s.lures),
  maxDigits: 4,
};

export const sayisalAkilYurutme: TaskInstrument = {
  slug: 'sayisal-akil-yurutme',
  version: 1,
  engine: 'tasks',
  name: 'Sayısal Akıl Yürütme',
  shortName: 'Sayısal akıl yürütme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 20,
  sortOrder: 49.8,
  tagline: 'Sayılar arasındaki ilişkiyi doğru kurabilmeyi ölçer: orantıyı farktan ayırmayı ve eşitliğin iki yanını dengelemeyi.',
  description:
    'Bu test sayılarla akıl yürütmeyi, yani bir durumdaki sayıların birbiriyle nasıl ilişkili olduğunu görüp eksik sayıyı bulabilmeyi ölçer. Soruların üçte ikisi günlük hayattan kısa durumlardır: bazılarında iki nicelik aynı oranda büyür (orantı), bazılarında aradaki fark korunur, bir başlangıç miktarı vardır ya da miktar artsa da sonuç değişmez. Üçte biri eksik sayısı olan eşitlikler ve terazi sorularıdır. Cevaplar seçeneklerden seçilmez, yazılır. Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, orantılı ve orantılı olmayan durumların ayırt edilip edilmediğini, eşittir işaretinin nasıl okunduğunu ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Sayılarla düşün',
    paragraphs: [
      'Birazdan günlük hayattan kısa durumlar ve eksik sayısı olan eşitlikler göreceksin. Her soruda bir sayı bulup yazacaksın.',
      `Test ${SPECS.length} sorudan oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok. İstersen kâğıt ve kalem kullanabilirsin; hesap makinesi kullanma.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'sy_dogru', name: 'Doğru cevaplar', plain: 'Eksik sayının doğru bulunduğu soruların sayısı.' },
    {
      key: 'sy_oranti',
      name: 'Orantı mı, fark mı?',
      plain:
        'İki niceliğin aynı oranda büyüdüğü durumları, aradaki farkın korunduğu, başlangıç miktarı olan ya da sonucun değişmediği durumlardan ayırt edebilmek.',
    },
    { key: 'sy_esitlik', name: 'Eşitlik ve denge', plain: 'Eşitliğin iki yanının aynı değerde olduğunu kullanarak eksik sayıyı bulabilmek.' },
    { key: 'sy_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve kaç soruda “Bilmiyorum” dendiği.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Sayılarla akıl yürütme araştırmalarında üzerinde çok durulan iki konu: orantılı ve orantılı olmayan durumları ayırt etmek (Van Dooren ve ark., 2004; Fernández ve ark., 2012) ve eşittir işaretini iki yanın aynı değerde olduğu biçiminde anlamak (Knuth ve ark., 2006). Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı test setlerinin soruları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Bir durumdaki sayıların birbiriyle nasıl ilişkili olduğunu görüp eksik sayıyı bulabilmeyi ölçer. Rapor iki şeye ayrıca bakar. Birincisi orantılı bir durumda aradaki farkı korumak ya da orantılı olmayan bir durumda orantı kurmaktır. İspanya’da 4.–10. sınıf öğrencileriyle yapılan bir çalışmada orantılı problemlerde farkı koruyan cevaplar 6. sınıfta %57, 10. sınıfta %21 oranında görülmüş; farkın korunduğu problemlerde orantı kuran cevaplar ise 4. sınıfta %3’ten 10. sınıfta %64’e çıkmıştır. Aynı çalışmada sayılar birbirinin tam katı olduğunda orantı, olmadığında fark daha sık kullanılmıştır (Fernández ve ark., 2012). Belçika’da 2.–6. sınıf öğrencileriyle yapılan bir çalışmada orantılı olmayan problemlere verilen cevapların %38,5’i orantı kuran cevaplardı (Van Dooren ve ark., 2004). İkincisi eşittir işaretini “sonuç şudur” anlamında okumaktır: ABD’de 6.–8. sınıf öğrencileriyle yapılan bir çalışmada öğrencilerin yalnızca %31–43’ü eşittir işaretini iki yanın aynı değerde olduğu biçiminde tanımlamış; böyle tanımlayanlar denklemleri daha sık doğru çözmüştür (Knuth ve ark., 2006).',
    turkishVersion: 'Özgün test. Sorular ve yönergeler Türkçe olarak yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her sorunun doğru cevabı ve yanılgı cevapları, sorudaki sayılardan bağımsızca yeniden hesaplanarak doğrulanmıştır.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi tür sorularda ne kadar doğru cevap verildiği ve hangi yanılgıların görüldüğüyle anlatılır. Zekâ puanı (IQ) verilmez. Sayılarla akıl yürütme yaşla ve öğrenilen matematikle değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '5. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Sorular okumayı ve dört işlemi gerektirir; okumakta ya da işlemlerde zorlanan biri için sonuç akıl yürütmeyi tam yansıtmayabilir.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Sayılarla akıl yürütmenin yalnızca iki yönüne (orantı ile farkı ayırt etmek ve eşitliği dengelemek) bakar; matematik başarısını ya da konu bilgisini ölçmez.',
      'Her tür birkaç soruyla ölçülür; türlere göre sonuçlar kaba bir göstergedir.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat, okuma ve işlem hızından etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Fernández, C., Llinares, S., Van Dooren, W., De Bock, D. ve Verschaffel, L. (2012). The development of students’ use of additive and proportional methods along primary and secondary school. European Journal of Psychology of Education, 27(3), 421–438.',
        url: 'https://doi.org/10.1007/s10212-011-0087-0',
      },
      {
        text: 'Knuth, E. J., Stephens, A. C., McNeil, N. M. ve Alibali, M. W. (2006). Does understanding the equal sign matter? Evidence from solving equations. Journal for Research in Mathematics Education, 37(4), 297–312.',
        url: 'https://www.nctm.org/Publications/journal-for-research-in-mathematics-education/2006/Vol37/Issue4/Does-Understanding-the-Equal-Sign-Matter_-Evidence-from-Solving-Equations/',
      },
      {
        text: 'Van Dooren, W., De Bock, D., Hessels, A., Janssens, D. ve Verschaffel, L. (2004). Students’ overreliance on proportionality: Evidence from primary school pupils solving arithmetic word problems. M. J. Høines ve A. B. Fuglestad (Ed.), Proceedings of the 28th Conference of the International Group for the Psychology of Mathematics Education (C. 4, s. 385–392). Bergen University College.',
        url: 'https://emis.univie.ac.at/proceedings/PME28/RR/RR005_VanDooren.pdf',
      },
    ],
  },
};
