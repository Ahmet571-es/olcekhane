import {
  all,
  arith,
  buildMatrixItem,
  byCol,
  byRow,
  change,
  cycle,
  latin,
  prog,
  rotate,
  setOp,
  shift,
  swapDots,
  toggle,
  turn,
  type MatrixSpec,
} from '@/lib/instruments/matrix';
import { constrainedOrder, rng } from '@/lib/instruments/sequences';
import type { MatrixItem, MatrixPracticeItem, MatrixReasoningTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Şekil Akıl Yürütme
 *
 * Matris akıl yürütme düzenine dayanan özgün bir testtir: 3×3'lük tablonun sağ alttaki parçası eksiktir; satırlardaki
 * kuralı bulup eksik parçayı sekiz seçenekten seçmek gerekir. Sorular, Carpenter, Just ve Shell'in (1990) Raven
 * matrislerinde tanımladığı beş kural türüyle Ölçekhane tarafından yazılmıştır: değişmeyen özellik, düzenli değişim,
 * üçlü dağılım, ekleme-çıkarma ve iki değerin dağılımı (burada "ortak olanı silme"). Ticari testlerin soruları,
 * puanlama kuralları ya da normları kullanılmaz.
 *
 * Düzeyler (her biri 4–5 soru): 1) tek kural, bütün satırlarda aynı düzen; 2) dönme, ilerleme ya da üçlü dağılım gibi
 * satırdan satıra değişen tek bir kural; 3) iki kural; 4) ekleme-çıkarma ya da ortak olanı silme, ya da ters yönlerde
 * ilerleyen iki nokta; 5) üç kural, bu kuralların başka bir kuralla birlikte kullanılması ya da çok sayıda çizgi.
 * Zorluk, izlenmesi gereken kural sayısına ve kuralın türüne göre sıralanmıştır (Carpenter ve ark., 1990; Matzen ve
 * ark., 2010); gerçek zorluk sırası henüz veriyle denetlenmedi.
 *
 * Seçenekler (lib/instruments/matrix.ts): doğru cevaba üç değişiklik uygulanarak 2 × 2 × 2 = 8 seçenek üretilir (Hu ve
 * ark., 2021); yanlış değerler olabildiğince tablodaki değerlerden seçilir. Doğru cevabın yeri her sırada (1–8) üçer kez olacak biçimde sabit bir tohumla
 * belirlenir. Her sorunun tek doğru cevabı olduğu tests/sekil-akil-yurutme.test.ts'teki bağımsız çözücüyle denetlenir.
 * Sorular ya da üretim kuralı değişirse testin sürüm numarası artırılmalıdır. Sürüm 2 (2026-10-08): 4. ve 5. düzeyin
 * soruları düzey tanımlarına göre yeniden sıralandı, yanlış seçeneklerde tablodaki değerler daha çok kullanıldı.
 *
 * Puanlama (lib/scoring/tasks.ts, scoreMatrix): doğru sayısı; düzeylere ve kural türlerine göre doğrular; ulaşılan
 * düzey (soruların en az %60'ının doğru olduğu en yüksek düzey; o düzeye kadarki sorularda da en az %60 doğru); soru
 * başına tipik süre; 3. düzey ve üstündeki sorularda 2,5 saniyeden kısa cevaplar ("çok hızlı"); doğru cevaptan tek
 * özellikte ayrılan seçeneklerin seçildiği yanlışlar ("yakın hatalar"). 24 soruda 6 ya da daha az doğru, rastgele
 * seçimle de ulaşılabilecek bir sonuçtur: düzey ve kural türleri yorumlanmaz.
 */

const PRACTICE_SPECS: { spec: MatrixSpec; answerAt: number; explain: string }[] = [
  {
    spec: {
      key: 'p1',
      level: 1,
      rule: 'constant',
      grid: { shape: byRow(['circle', 'square', 'triangle']), fill: all('black'), size: all(2) },
      variants: [change('shape', 'square'), change('size', 3), change('fill', 'gray')],
    },
    answerAt: 2,
    explain:
      'Her satırda aynı şekil üç kez yer alıyor: birinci satırda daireler, ikincide kareler, üçüncüde üçgenler. Hepsi siyah ve aynı büyüklükte. Eksik parça bu yüzden ötekilerle aynı büyüklükte, siyah bir üçgen.',
  },
  {
    spec: {
      key: 'p2',
      level: 1,
      rule: 'progression',
      grid: { shape: byRow(['star', 'circle', 'square']), count: byCol([1, 2, 3]), fill: all('black') },
      variants: [change('count', 2), change('shape', 'circle'), change('fill', 'gray')],
    },
    answerAt: 5,
    explain:
      'Her satırda şekillerin sayısı soldan sağa birer artıyor: 1, 2, 3. Üçüncü satırdaki şekiller kare. Eksik parça bu yüzden 3 siyah kare.',
  },
];

const SPECS: MatrixSpec[] = [
  /* ---------- 1. düzey: tek kural ---------- */
  {
    key: 'sa01',
    level: 1,
    rule: 'constant',
    grid: { shape: all('square'), fill: byRow(['empty', 'gray', 'black']), size: all(2) },
    variants: [change('fill', 'gray'), change('size', 1), change('shape', 'diamond')],
  },
  {
    key: 'sa02',
    level: 1,
    rule: 'progression',
    grid: { shape: byRow(['circle', 'triangle', 'diamond']), size: byCol([1, 2, 3]), fill: all('black') },
    variants: [change('size', 2), change('shape', 'triangle'), change('fill', 'gray')],
  },
  {
    key: 'sa03',
    level: 1,
    rule: 'constant',
    grid: { shape: byCol(['star', 'diamond', 'cross']), size: byRow([1, 2, 3]), fill: all('black') },
    variants: [change('size', 2), change('shape', 'diamond'), change('fill', 'gray')],
  },
  {
    key: 'sa04',
    level: 1,
    rule: 'constant',
    grid: { shape: byCol(['triangle', 'circle', 'star']), count: byRow([2, 4, 3]), fill: all('black') },
    variants: [change('count', 4), change('shape', 'circle'), change('fill', 'gray')],
  },

  /* ---------- 2. düzey: dönme, ilerleme ya da üçlü dağılım ---------- */
  {
    key: 'sa05',
    level: 2,
    rule: 'progression',
    grid: { shape: all('arrow'), angle: prog([0, 90, 180], 90, 360), fill: all('black'), size: all(2) },
    variants: [rotate(90), rotate(180), change('fill', 'gray')],
  },
  {
    key: 'sa06',
    level: 2,
    rule: 'distribution',
    grid: { shape: latin(['circle', 'square', 'triangle'], 1), fill: all('black'), size: all(2) },
    variants: [cycle('shape', ['square', 'circle', 'triangle', 'diamond'], 1), cycle('shape', ['square', 'circle', 'triangle', 'diamond'], 2), change('fill', 'gray')],
  },
  {
    key: 'sa07',
    level: 2,
    rule: 'progression',
    grid: { shape: all('square'), count: prog([1, 2, 3], 1), fill: all('gray') },
    variants: [cycle('count', [5, 4, 3, 2], 1), cycle('count', [5, 4, 3, 2], 2), change('fill', 'black')],
  },
  {
    key: 'sa08',
    level: 2,
    rule: 'progression',
    grid: { dots: turn([[0], [2], [4]], 1), grayDots: all([]) },
    variants: [shift('dots', -1), shift('dots', 2), swapDots()],
  },
  {
    key: 'sa09',
    level: 2,
    rule: 'distribution',
    grid: { shape: byRow(['star', 'circle', 'square']), fill: latin(['empty', 'gray', 'black'], 2), size: all(2) },
    variants: [change('fill', 'black'), change('shape', 'circle'), change('size', 3)],
  },

  /* ---------- 3. düzey: iki kural ---------- */
  {
    key: 'sa10',
    level: 3,
    rule: 'distribution',
    grid: { shape: latin(['triangle', 'circle', 'cross'], 1), count: byCol([1, 2, 3]), fill: all('black') },
    variants: [change('count', 2), cycle('shape', ['circle', 'triangle', 'cross', 'star'], 1), cycle('shape', ['circle', 'triangle', 'cross', 'star'], 2)],
  },
  {
    key: 'sa11',
    level: 3,
    rule: 'distribution',
    grid: { shape: latin(['square', 'diamond', 'star'], 1), fill: latin(['black', 'empty', 'gray'], 2), size: all(2) },
    variants: [cycle('shape', ['diamond', 'square', 'star', 'circle'], 1), cycle('shape', ['diamond', 'square', 'star', 'circle'], 2), change('fill', 'gray')],
  },
  {
    key: 'sa12',
    level: 3,
    rule: 'distribution',
    grid: { shape: all('arrow'), angle: prog([0, 90, 180], 45, 360), fill: latin(['black', 'gray', 'empty'], 1), size: all(2) },
    variants: [change('angle', 225), rotate(90), change('fill', 'black')],
  },
  {
    key: 'sa13',
    level: 3,
    rule: 'distribution',
    grid: { frame: latin(['circle', 'square', 'triangle'], 1), shape: latin(['star', 'cross', 'diamond'], 2), fill: all('black') },
    variants: [cycle('frame', ['square', 'circle', 'triangle', 'diamond'], 1), cycle('frame', ['square', 'circle', 'triangle', 'diamond'], 2), change('shape', 'diamond')],
  },
  {
    key: 'sa14',
    level: 3,
    rule: 'distribution',
    grid: { shape: all('circle'), count: byCol([3, 2, 1]), fill: latin(['gray', 'black', 'empty'], 1) },
    variants: [cycle('count', [1, 2, 3, 4], 1), cycle('count', [1, 2, 3, 4], 2), change('fill', 'gray')],
  },

  /* ---------- 4. düzey: ekleme-çıkarma, ortak olanı silme ya da ters yönlerde ilerleyen iki nokta ---------- */
  {
    key: 'sa15',
    level: 4,
    rule: 'addition',
    grid: {
      lines: setOp(
        [
          [[0, 4], [4, 7]],
          [[3, 6], [1, 6]],
          [[2, 5], [5, 7]],
        ],
        'or',
      ),
    },
    variants: [toggle('lines', 5), toggle('lines', 2), toggle('lines', 1)],
  },
  {
    key: 'sa16',
    level: 4,
    rule: 'addition',
    grid: { shape: byRow(['square', 'triangle', 'circle']), count: arith([[1, 2], [2, 2], [2, 3]], '+'), fill: all('black') },
    variants: [cycle('count', [5, 4, 3, 2], 1), cycle('count', [5, 4, 3, 2], 2), change('shape', 'triangle')],
  },
  {
    key: 'sa17',
    level: 4,
    rule: 'addition',
    grid: { shape: byRow(['diamond', 'cross', 'circle']), count: arith([[5, 2], [4, 1], [3, 1]], '-'), fill: all('black') },
    variants: [cycle('count', [2, 4, 3, 1], 1), cycle('count', [2, 4, 3, 1], 2), change('shape', 'cross')],
  },
  {
    key: 'sa18',
    level: 4,
    rule: 'xor',
    grid: {
      lines: setOp(
        [
          [[0, 3, 4], [0, 1]],
          [[6, 7], [2, 7]],
          [[1, 5], [3, 5]],
        ],
        'xor',
      ),
    },
    variants: [toggle('lines', 5), toggle('lines', 3), toggle('lines', 6)],
  },
  {
    key: 'sa19',
    level: 4,
    rule: 'progression',
    grid: { dots: turn([[0], [3], [5]], 1), grayDots: turn([[5], [1], [2]], -1) },
    variants: [change('dots', [6]), change('grayDots', [1]), swapDots()],
  },

  /* ---------- 5. düzey: üç kural, zor bir kuralla birlikte başka bir kural ya da çok sayıda çizgi ---------- */
  {
    key: 'sa20',
    level: 5,
    rule: 'distribution',
    grid: { shape: latin(['circle', 'triangle', 'square'], 1), fill: latin(['black', 'gray', 'empty'], 2), count: byCol([1, 2, 3]) },
    variants: [change('shape', 'circle'), change('fill', 'empty'), change('count', 2)],
  },
  {
    key: 'sa21',
    level: 5,
    rule: 'xor',
    grid: {
      dots: setOp(
        [
          [[0, 2], [2, 5]],
          [[1, 4, 6], [4, 7]],
          [[3, 6], [0, 6]],
        ],
        'xor',
      ),
      grayDots: all([]),
      shape: latin(['circle', 'square', 'triangle'], 2),
      fill: all('black'),
    },
    variants: [toggle('dots', 6), change('shape', 'triangle'), toggle('dots', 3)],
  },
  {
    key: 'sa22',
    level: 5,
    rule: 'addition',
    grid: {
      shape: latin(['star', 'circle', 'triangle'], 1),
      count: arith([[1, 3], [2, 1], [2, 2]], '+'),
      fill: byRow(['gray', 'black', 'empty']),
    },
    variants: [change('count', 3), change('shape', 'star'), change('fill', 'gray')],
  },
  {
    key: 'sa23',
    level: 5,
    rule: 'xor',
    grid: {
      lines: setOp(
        [
          [[0, 1, 4, 7], [1, 2, 4, 6]],
          [[0, 3, 5, 6], [0, 1, 5, 7]],
          [[2, 3, 5, 7], [1, 3, 4, 7]],
        ],
        'xor',
      ),
    },
    variants: [toggle('lines', 3), toggle('lines', 7), toggle('lines', 4)],
  },
  {
    key: 'sa24',
    level: 5,
    rule: 'distribution',
    grid: {
      frame: latin(['diamond', 'circle', 'square'], 2),
      shape: latin(['cross', 'triangle', 'circle'], 1),
      fill: byCol(['empty', 'gray', 'black']),
    },
    variants: [change('frame', 'square'), change('shape', 'cross'), change('fill', 'gray')],
  },
];

/** Doğru cevabın yeri: her sıra (1–8) üç kez; art arda iki soruda aynı sıra olmaz. */
const ANSWER_AT = constrainedOrder(
  Array.from({ length: SPECS.length }, (_, i) => i % 8),
  rng(20261008),
  (before, next) => before[before.length - 1] !== next,
);

const ORDER_RAND = rng(20261009);
const BUILT = SPECS.map((s, i) => buildMatrixItem(s, ANSWER_AT[i], ORDER_RAND));
const PRACTICE: MatrixPracticeItem[] = PRACTICE_SPECS.map(({ spec, answerAt, explain }) => {
  const { item, answer } = buildMatrixItem(spec, answerAt, ORDER_RAND);
  return { ...item, answer, explain };
});

export const MATRIX_ITEMS: MatrixItem[] = BUILT.map((b) => b.item);
export const MATRIX_SPECS: readonly MatrixSpec[] = SPECS;
export const MATRIX_PRACTICE_SPECS = PRACTICE_SPECS.map((p) => p.spec);

const matrix: MatrixReasoningTask = {
  key: 'sekil-akil-yurutme',
  kind: 'matrix_reasoning',
  name: 'Şekil Akıl Yürütme',
  measures: 'Şekillerdeki kuralı bulup eksik parçayı tamamlayabilmeyi (akıl yürütme) ölçer.',
  instructions: [
    'Her soruda 3 satır ve 3 sütundan oluşan bir tablo göreceksin. Tablonun sağ alttaki parçası eksik.',
    'Satırlarda şekillerin nasıl değiştiğine bak ve kuralı bul. Sonra eksik parçayı aşağıdaki sekiz seçenekten seç ve “Cevabı ver” düğmesine bas.',
    'Sorular kolaydan zora doğru gider; sona doğru zorlanman olağandır. Emin olamadığında sana en uygun gelen seçeneği seç. Süre sınırı yok.',
    'Önce doğru cevabı gösterilen iki alıştırma sorusu çözeceksin.',
  ],
  practice: PRACTICE,
  items: MATRIX_ITEMS,
  answers: BUILT.map((b) => b.answer),
  optionDistance: BUILT.map((b) => b.distance),
  levels: [
    { level: 1, name: '1. düzey', plain: 'Bir özelliğin satır boyunca aynı kaldığını ya da her satırda aynı biçimde değiştiğini fark etmek.' },
    {
      level: 2,
      name: '2. düzey',
      plain: 'Okun dönmesi, sayının ya da noktanın adım adım ilerlemesi, üç şeklin ya da rengin her satırda birer kez yer alması gibi tek bir kuralı bulmak.',
    },
    { level: 3, name: '3. düzey', plain: 'Aynı parçada iki özelliğin iki ayrı kurala göre değiştiğini görüp ikisini birlikte izlemek.' },
    {
      level: 4,
      name: '4. düzey',
      plain: 'Parçaları üst üste koyma, sayıları toplama ya da çıkarma, ortak olanı silme gibi kuralları bulmak ya da ters yönlerde ilerleyen iki noktayı birlikte izlemek.',
    },
    {
      level: 5,
      name: '5. düzey',
      plain: 'Üç kuralı birlikte izlemek, ortak olanı silme ya da toplama gibi bir kuralı başka bir kuralla birlikte kullanmak ya da çok sayıda çizgiyi tek tek karşılaştırmak.',
    },
  ],
  rapidMs: 2500,
};

export const sekilAkilYurutme: TaskInstrument = {
  slug: 'sekil-akil-yurutme',
  version: 2,
  engine: 'tasks',
  name: 'Şekil Akıl Yürütme',
  shortName: 'Şekil akıl yürütme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 15,
  sortOrder: 49,
  tagline: 'Şekillerle kurulmuş tablolarda kuralı bulup eksik parçayı tamamlayabilmeyi, yani şekillerle akıl yürütebilmeyi ölçer.',
  description:
    'Bu test, akıl yürütmeyi ölçmek için psikolojide yaygın olarak kullanılan “matris” düzenine dayanır: üç satır ve üç sütundan oluşan bir tablonun son parçası eksiktir; satırlardaki kuralı bulup eksik parçayı seçeneklerden seçmek gerekir. Sorular okuma bilgisi gerektirmez (yalnızca birkaç soruda şekilleri saymak ve küçük sayıları toplayıp çıkarmak gerekir) ve kolaydan zora doğru beş düzeyde ilerler. Sorular ve seçenekler Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi tür kuralların daha kolay bulunduğunu ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Eksik parçayı bul',
    paragraphs: [
      'Birazdan şekillerden oluşan tablolar göreceksin. Her tablonun bir parçası eksik; tablodaki kuralı bulup eksik parçayı seçeceksin.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler. Süre sınırı yok; her soruyu acele etmeden düşünebilirsin.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'sa_dogru', name: 'Doğru cevaplar', plain: 'Kuralı bulup eksik parçanın doğru seçildiği soruların sayısı.' },
    { key: 'sa_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'sa_kural', name: 'Kural türleri', plain: 'Hangi tür kuralların daha kolay, hangilerinin daha zor bulunduğu.' },
    { key: 'sa_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [matrix],
  science: {
    basedOn:
      'Matris akıl yürütme düzeni: Raven Progresif Matrisler Testi’nden bu yana akıl yürütmeyi ölçmek için yaygın olarak kullanılan düzen (Raven, 2000); 3×3’lük bir tablodaki kuralı bulup eksik parçayı seçeneklerden seçmek. Sorular, Carpenter, Just ve Shell’in (1990) bu tür sorularda tanımladığı beş kural türüyle (değişmeyen özellik, düzenli değişim, üçlü dağılım, ekleme-çıkarma ve iki değerin dağılımı, bu testte “ortak olanı silme”) Ölçekhane tarafından özgün olarak yazılmıştır; ticari testlerin soruları, puanlama kuralları ya da normları kullanılmaz. Seçenekler, tabloya bakmadan yalnızca seçeneklerden doğru cevabın bulunamayacağı bir düzenle üretilmiştir (Hu ve ark., 2021).',
    whatItMeasures:
      'Şekillerle akıl yürütmeyi, yani daha önce görülmemiş bir düzende kuralı bulup onu yeni bir duruma uygulayabilmeyi ölçer. Carpenter ve arkadaşlarına (1990) göre bu tür sorularda kişiler arasındaki farkları en çok iki beceri belirler: soyut ilişkileri (kuralları) bulabilmek ve birden çok kuralı aynı anda akılda tutup yönetebilmek. Bu yüzden sorular, izlenmesi gereken kural sayısı arttıkça ve kural türü zorlaştıkça zorlaşır. Üniversite öğrencileriyle yapılan bir göz hareketi çalışmasında, tabloyu inceleyip cevabı önce zihinde kuranların (seçenekler arasında daha az gidip gelenlerin) daha çok soruyu doğru cevapladığı görülmüştür (Laurence ve ark., 2018). Sorular okuma bilgisi gerektirmez; yalnızca birkaç soruda şekilleri saymak ve küçük sayıları toplayıp çıkarmak gerekir. Hiçbir test kültürden ve eğitimden tümüyle bağımsız değildir.',
    turkishVersion: 'Özgün test. Sorular şekillerle yazılmıştır; yönergeler Türkçedir.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sorular, izlenmesi gereken kural sayısına ve kuralın türüne göre kolaydan zora beş düzeye ayrılmıştır. Bu sıralama araştırma bulgularına dayanır: Raven matrislerinde soruların zorluğu kural sayısıyla birlikte artar (Carpenter ve ark., 1990); benzer kurallarla üretilen sorularda da ilişki sayısı arttıkça doğru cevap oranı düşer (Matzen ve ark., 2010). Soruların bu testteki gerçek zorluk sırası henüz veriyle denetlenmedi. Her sorunun tek doğru cevabı olduğu, bu kural türlerinin satırlardaki, sütunlardaki ve çaprazlardaki yorumlarını her özellik (şekil, sayı, büyüklük, renk, yön, çizgiler, noktalar) için ayrı ayrı deneyen bir bilgisayar programıyla denetlenmiştir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ve hangi tür kurallarda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Akıl yürütme becerisi çocuklukta hızla, gençlikte daha yavaş gelişir; gençlik yıllarının sonuna doğru artık pek değişmez (Ferrer, O’Hare ve Bunge, 2009). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir. Bu tür testlerin sonuçları ülkeye ve eğitime göre de değişir (Brouwers, Van de Vijver ve Van Hemert, 2009).',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Sorular beş düzeyde kolaydan zora gider; en üst düzeylerdeki sorular yetişkinleri de zorlayabilir, küçük yaştakilerin bu sorularda zorlanması beklenen bir durumdur. Telefonla da çözülebilir; şekillerin rahat görülmesi için büyük bir ekran önerilir.',
    license: 'Özgün test. Sorular, seçenekler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Akıl yürütmenin yalnızca şekillerle yapılan yönünü ölçer; sözel ve sayısal akıl yürütme, bilgi, bellek ve hız gibi öteki beceriler hakkında bilgi vermez.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Okul deneyimi ve bu tür bulmacalara alışkın olmak sonucu etkileyebilir; test kültürden ve eğitimden tümüyle bağımsız değildir (Brouwers ve ark., 2009).',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Carpenter, P. A., Just, M. A. ve Shell, P. (1990). What one intelligence test measures: A theoretical account of the processing in the Raven Progressive Matrices Test. Psychological Review, 97(3), 404–431.',
        url: 'https://doi.org/10.1037/0033-295X.97.3.404',
      },
      {
        text: 'Raven, J. (2000). The Raven’s Progressive Matrices: Change and stability over culture and time. Cognitive Psychology, 41(1), 1–48.',
        url: 'https://doi.org/10.1006/cogp.1999.0735',
      },
      {
        text: 'Matzen, L. E., Benz, Z. O., Dixon, K. R., Posey, J., Kroger, J. K. ve Speed, A. E. (2010). Recreating Raven’s: Software for systematically generating large numbers of Raven-like matrix problems with normed properties. Behavior Research Methods, 42(2), 525–541.',
        url: 'https://doi.org/10.3758/BRM.42.2.525',
      },
      {
        text: 'Hu, S., Ma, Y., Liu, X., Wei, Y. ve Bai, S. (2021). Stratified rule-aware network for abstract visual reasoning. Proceedings of the AAAI Conference on Artificial Intelligence, 35(2), 1567–1574.',
        url: 'https://doi.org/10.1609/aaai.v35i2.16248',
      },
      {
        text: 'Laurence, P. G., Mecca, T. P., Serpa, A., Martin, R. ve Macedo, E. C. (2018). Eye movements and cognitive strategy in a fluid intelligence test: Item type analysis. Frontiers in Psychology, 9, 380.',
        url: 'https://doi.org/10.3389/fpsyg.2018.00380',
      },
      {
        text: 'Ferrer, E., O’Hare, E. D. ve Bunge, S. A. (2009). Fluid reasoning and the developing brain. Frontiers in Neuroscience, 3(1), 46–51.',
        url: 'https://doi.org/10.3389/neuro.01.003.2009',
      },
      {
        text: 'Brouwers, S. A., Van de Vijver, F. J. R. ve Van Hemert, D. A. (2009). Variation in Raven’s Progressive Matrices scores across time and place. Learning and Individual Differences, 19(3), 330–338.',
        url: 'https://doi.org/10.1016/j.lindif.2008.10.006',
      },
    ],
  },
};
