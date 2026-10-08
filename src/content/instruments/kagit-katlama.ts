import { hFold, lineFold, roundHoles, sameHoles, unfold, vFold, variant, type Fold, type Pt, type Variant } from '@/lib/instruments/folding';
import type { FoldingItem, FoldingLure, FoldingPracticeItem, FoldingType, PaperFoldingTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Kâğıt katlama: kare bir kâğıt bir, iki ya da üç kez katlanır, katlanmış kâğıt delinir; kâğıt açılınca deliklerin nerede
 * olacağı beş seçenekten seçilir. Bütün sorular Ölçekhane'nindir (ETS'nin araştırma setindeki "Paper Folding Test"in
 * soruları kullanılmaz; soru türü genel bir uzamsal görselleştirme sorusudur).
 *
 * Doğru seçenek ve yanlış seçenekler katlamalardan hesaplanır (lib/instruments/folding.ts): doğru seçenek kâğıdı adım adım
 * açarak, yanlış seçenekler olası yanılgılarla (hiç açmamak, bir katı unutmak, aynalamak yerine kaydırmak, yanlış çizgiye
 * göre aynalamak, kenardan katlamayı ortadan sanmak, tek kat olan yerde de delik var sanmak, deliğin yerini yanlış görmek)
 * ve kâğıdı ters çevirmek ya da döndürmekle. Doğru seçenek delik sayısından ya da öteki seçeneklere benzerliğinden
 * bulunamaz: her soruda doğru seçenekle aynı sayıda delikli bir yanlış seçenek vardır; seçenekleri delik sayısına, ortak
 * deliklere, simetriye ya da birbirini kapsamasına göre sıralayıp hep aynı sıradakini seçen biri, 24 soruda rastgele
 * seçmekten belirgin biçimde daha çok doğru bulamaz. tests/kagit-katlama.test.ts bunları denetler ve doğru seçeneği bağımsız bir yolla (kâğıdın her
 * noktasını katlayıp deliğe düşenleri bularak) yeniden hesaplar.
 *
 * Türler sorudaki en zor katlamaya göredir: ortadan katlama (`half`), kenardan katlama (`partial`; kâğıdın bir kısmı tek
 * kat kalır), çapraz katlama (`diagonal`).
 */

/** Yanlış seçenek: bir yanılgıyla (`variant`) üretilir ya da delik yerleri doğrudan verilir. */
type Wrong = Variant | readonly Pt[];

interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: FoldingType;
  folds: Fold[];
  punches: Pt[];
  /** Doğru seçeneğin sırası (1–5). */
  answer: number;
  /** "İlk bakışta doğru görünen" yanlış seçeneğin yanılgısı ve sırası. */
  lure: Variant;
  lurePos: number;
  /** Öteki üç yanlış seçenek (boş kalan sıralara bu sırayla): bir yanılgı ya da doğrudan delik yerleri. */
  others: [Wrong, Wrong, Wrong];
}

const D_MAIN = (moving: Pt) => lineFold([0, 0], [12, 12], moving);
const D_ANTI = (moving: Pt) => lineFold([12, 0], [0, 12], moving);

const SPECS: Spec[] = [
  // 1. düzey: tek katlama, tek delik.
  { key: 'kk01', level: 1, type: 'half', folds: [hFold(6, 'top')], punches: [[4, 10]], answer: 2, lure: 'slide:0', lurePos: 4, others: ['flipV', 'turn', 'slide:0+diag'] },
  { key: 'kk02', level: 1, type: 'diagonal', folds: [D_MAIN([10, 2])], punches: [[2, 8]], answer: 3, lure: 'cross:0', lurePos: 4, others: ['at:4,10', 'flipV', 'none+turn2'] },
  { key: 'kk03', level: 1, type: 'partial', folds: [vFold(8, 'right')], punches: [[6, 3]], answer: 1, lure: 'none', lurePos: 3, others: ['flipH', 'turn2', 'none+flipH'] },
  { key: 'kk04', level: 1, type: 'half', folds: [vFold(6, 'left')], punches: [[8, 9]], answer: 5, lure: 'slide:0', lurePos: 1, others: ['flipH', 'none+flipH', 'slide:0+flipH'] },
  // 2. düzey: iki ortadan katlama; tek katlamada iki delik; kenardan katlamada tek kat kalan yer.
  { key: 'kk05', level: 2, type: 'half', folds: [vFold(6, 'right'), hFold(6, 'bottom')], punches: [[2, 4]], answer: 2, lure: 'skip:1', lurePos: 5, others: ['at:4,2', 'slide:1', 'cross:1'] },
  { key: 'kk06', level: 2, type: 'partial', folds: [hFold(8, 'bottom')], punches: [[4, 2]], answer: 4, lure: 'mid:0', lurePos: 2, others: ['flipV', 'flipH', 'mid:0+flipV'] },
  { key: 'kk07', level: 2, type: 'diagonal', folds: [D_ANTI([10, 10])], punches: [[2, 4], [6, 3]], answer: 1, lure: 'cross:0', lurePos: 3, others: ['at:4,2', 'flipV', 'turn2'] },
  { key: 'kk08', level: 2, type: 'half', folds: [vFold(6, 'right')], punches: [[2, 2], [4, 10]], answer: 4, lure: 'slide:0', lurePos: 1, others: ['cross:0', 'flipH', 'turn3'] },
  { key: 'kk09', level: 2, type: 'partial', folds: [vFold(4, 'left')], punches: [[5, 3], [10, 9]], answer: 3, lure: 'mid:0', lurePos: 5, others: ['slide:0', 'cross:0', 'turn'] },
  // 3. düzey: iki katlama, tek delik.
  { key: 'kk10', level: 3, type: 'half', folds: [hFold(6, 'top'), hFold(9, 'bottom')], punches: [[4, 8]], answer: 5, lure: 'skip:0', lurePos: 2, others: ['cross:0', 'flipV', 'turn3'] },
  { key: 'kk11', level: 3, type: 'diagonal', folds: [D_MAIN([10, 2]), D_ANTI([4, 11])], punches: [[2, 5]], answer: 2, lure: 'skip:0', lurePos: 4, others: ['at:2,7', 'skip:0+flipV', 'skip:1+flipV'] },
  { key: 'kk12', level: 3, type: 'partial', folds: [vFold(6, 'right'), hFold(8, 'bottom')], punches: [[2, 2]], answer: 1, lure: 'mid:1', lurePos: 3, others: ['at:2,5', 'slide:0', 'at:2,5+flipH'] },
  { key: 'kk13', level: 3, type: 'diagonal', folds: [D_MAIN([10, 2]), vFold(6, 'right')], punches: [[4, 10]], answer: 4, lure: 'skip:0', lurePos: 2, others: ['at:2,8', 'cross:0', 'turn2'] },
  { key: 'kk14', level: 3, type: 'diagonal', folds: [D_MAIN([10, 2]), hFold(4, 'top')], punches: [[1, 5]], answer: 3, lure: 'skip:1', lurePos: 1, others: ['mid:1', 'flipV', 'flipH'] },
  // 4. düzey: üç katlama ya da iki katlamada iki delik.
  { key: 'kk15', level: 4, type: 'half', folds: [vFold(6, 'right'), hFold(6, 'bottom'), vFold(3, 'right')], punches: [[1, 3]], answer: 1, lure: 'skip:2', lurePos: 5, others: ['at:1,5', 'turn', 'skip:0+turn'] },
  { key: 'kk16', level: 4, type: 'partial', folds: [vFold(6, 'right'), hFold(6, 'bottom'), vFold(4.5, 'right')], punches: [[1.5, 2]], answer: 2, lure: 'all', lurePos: 1, others: ['slide:0', 'slide:1', 'cross:1'] },
  { key: 'kk17', level: 4, type: 'diagonal', folds: [vFold(6, 'right'), hFold(6, 'bottom'), lineFold([0, 0], [6, 6], [5, 1])], punches: [[1, 3]], answer: 4, lure: 'skip:2', lurePos: 5, others: ['at:3,5', 'slide:0', 'slide:1'] },
  { key: 'kk18', level: 4, type: 'partial', folds: [hFold(4, 'top'), vFold(6, 'right')], punches: [[2, 5], [4, 10]], answer: 3, lure: 'mid:0', lurePos: 4, others: ['slide:0', 'turn', 'turn3'] },
  { key: 'kk19', level: 4, type: 'half', folds: [hFold(6, 'top'), vFold(6, 'left'), hFold(9, 'bottom')], punches: [[8, 7]], answer: 5, lure: 'skip:2', lurePos: 4, others: ['none', 'slide:1', 'cross:2'] },
  // 5. düzey: üç katlama; çapraz ve kenardan katlamalar; iki delik.
  { key: 'kk20', level: 5, type: 'diagonal', folds: [D_MAIN([10, 2]), hFold(4, 'top')], punches: [[1, 5], [6, 9]], answer: 1, lure: 'skip:1', lurePos: 3, others: ['slide:1', 'cross:1', 'flipV'] },
  { key: 'kk21', level: 5, type: 'partial', folds: [vFold(8, 'right'), hFold(6, 'top'), vFold(4, 'left')], punches: [[5, 8]], answer: 4, lure: 'mid:0', lurePos: 2, others: ['skip:0', 'slide:0', 'cross:2'] },
  { key: 'kk22', level: 5, type: 'half', folds: [hFold(6, 'top'), vFold(6, 'right'), vFold(3, 'left')], punches: [[4, 10]], answer: 3, lure: 'skip:2', lurePos: 5, others: ['slide:0', 'cross:1', 'cross:2'] },
  { key: 'kk23', level: 5, type: 'diagonal', folds: [D_ANTI([10, 10]), D_MAIN([10, 2]), hFold(6, 'bottom')], punches: [[1, 5]], answer: 2, lure: 'skip:2', lurePos: 3, others: ['at:1,3', 'slide:2', 'cross:2'] },
  { key: 'kk24', level: 5, type: 'partial', folds: [hFold(8, 'bottom'), vFold(6, 'left')], punches: [[8, 7], [10, 2]], answer: 5, lure: 'mid:0', lurePos: 2, others: ['slide:1', 'cross:1', 'turn'] },
];

/** Seçenekler: doğru delik kümesi `answer` sırasında, çeldirici `lurePos` sırasında, ötekiler kalan sıralarda. */
function options(s: { folds: Fold[]; punches: Pt[]; answer: number; lure: Variant; lurePos: number; others: readonly Wrong[] }): Pt[][] {
  const holes = (w: Wrong) => roundHoles(dedupe(typeof w === 'string' ? variant(s.folds, s.punches, w) : [...w]));
  const rest = s.others.map(holes);
  return [1, 2, 3, 4, 5].map((pos) => (pos === s.answer ? roundHoles(unfold(s.folds, s.punches)) : pos === s.lurePos ? holes(s.lure) : rest.shift()!));
}

/** Çeldiricinin yanılgı türü. */
function lureKind(v: Variant, folds: Fold[]): FoldingLure {
  const kind = v.split(':')[0];
  if (v.includes('+')) throw new Error(`Çeldirici tek bir yanılgı olmalı: ${v}`);
  // Hiç açmamak, tek katlamalı soruda o katlamayı atlamaktır.
  if (kind === 'none' && folds.length === 1) return 'skip';
  if (kind === 'skip') return 'skip';
  if (kind === 'slide') return 'slide';
  if (kind === 'mid') return 'half';
  if (kind === 'all') return 'single';
  if (kind === 'cross') return 'axis';
  throw new Error(`Çeldirici olarak kullanılmayan yanılgı: ${v}`);
}

/** Aynı yere düşen delikler bir kez sayılır. */
function dedupe(pts: Pt[]): Pt[] {
  return pts.filter((p, i) => !pts.slice(0, i).some((q) => sameHoles([p], [q])));
}

const PRACTICE_SPECS: (Omit<Spec, 'level'> & { explain: string })[] = [
  {
    key: 'kkp1',
    type: 'half',
    folds: [vFold(6, 'right')],
    punches: [[2, 4]],
    answer: 3,
    lure: 'slide:0',
    lurePos: 2,
    others: ['none', 'cross:0', 'flipH'],
    explain:
      'Kâğıdın sağ yarısı sol yarısının üstüne katlandı. Delik iki kattan da geçer; kâğıt açılınca katlama çizgisinin iki yanında, aynı yükseklikte ve çizgiye aynı uzaklıkta iki delik olur.',
  },
  {
    key: 'kkp2',
    type: 'partial',
    folds: [vFold(8, 'right')],
    punches: [[2, 6]],
    answer: 1,
    lure: 'mid:0',
    lurePos: 4,
    others: ['flipV', 'move:0,-3', 'add:6,6'],
    explain:
      'Yalnızca sağdaki dar parça katlandı. Delik, kâğıdın tek kat olduğu yerden açıldı; bu yüzden açınca yalnızca bir delik olur. Delik iki kattan geçseydi, katlama çizgisinin öbür yanında da bir delik olurdu.',
  },
  {
    key: 'kkp3',
    type: 'diagonal',
    folds: [D_ANTI([10, 10])],
    punches: [[2, 5]],
    answer: 4,
    lure: 'cross:0',
    lurePos: 2,
    others: ['none', 'flipV', 'flipH'],
    explain:
      'Kâğıt, sağ üst köşeden sol alt köşeye uzanan çapraz çizgi boyunca katlandı: sağ alttaki üçgen, sol üstteki üçgenin üstüne geldi. Delik iki kattan da geçer. Kâğıt açılınca ikinci delik çapraz çizginin öbür yanında olur: katlama çizgisini bir ayna gibi düşün; iki delik bu aynaya aynı uzaklıktadır ve iki deliği birleştiren çizgi katlama çizgisine diktir.',
  },
];

export const FOLDING_SPECS: readonly Spec[] = SPECS;

const practice: FoldingPracticeItem[] = PRACTICE_SPECS.map((p) => ({
  key: p.key,
  level: 1,
  type: p.type,
  folds: p.folds,
  punches: p.punches,
  options: options(p),
  answer: p.answer,
  explain: p.explain,
}));

const task: PaperFoldingTask = {
  key: 'kagit-katlama',
  kind: 'paper_folding',
  name: 'Kâğıt Katlama',
  measures: 'Katlanıp delinen bir kâğıdın açılınca nasıl görüneceğini zihinde canlandırabilmeyi (uzamsal görselleştirme) ölçer.',
  instructions: [
    'Her soruda kare bir kâğıdın nasıl katlandığını adım adım göreceksin: kesik çizgi kâğıdın katlanan parçasının katlanmadan önceki yerini, ok katlanma yönünü gösterir. Katlanan parçanın kâğıdın üstüne geldiği yer renkli ince bir çizgiyle görünür. Son resimde katlanmış kâğıt bir ya da iki yerden delinir.',
    'Delik, kâğıdın o yerdeki bütün katlarından geçer. Kâğıt yeniden açılınca deliklerin nerede olacağını beş seçenekten seç.',
    'Sorular kolaydan zora doğru gider; sona doğru zorlanman olağandır. Süre sınırı yok. Kâğıt ya da kalem kullanmadan, zihninde çöz.',
    `Önce doğru cevabı gösterilen ${PRACTICE_SPECS.length === 3 ? 'üç' : PRACTICE_SPECS.length} alıştırma sorusu çözeceksin.`,
  ],
  practice,
  items: SPECS.map((s): FoldingItem => ({ key: s.key, level: s.level, type: s.type, folds: s.folds, punches: s.punches, options: options(s) })),
  answers: SPECS.map((s) => s.answer),
  lures: SPECS.map((s) => s.lurePos),
  lureKinds: SPECS.map((s) => lureKind(s.lure, s.folds)),
  levels: [
    { level: 1, name: '1. düzey', plain: 'Bir kez ortadan, çapraz ya da kenardan katlanıp tek yerden delinen kâğıt açılınca deliklerin nerede olacağını bulmak.' },
    {
      level: 2,
      name: '2. düzey',
      plain: 'İki kez ortadan katlanan ya da bir kez katlanıp iki yerden delinen kâğıdı izlemek ve kenardan katlamada kâğıdın tek kat kaldığı yerleri fark etmek.',
    },
    { level: 3, name: '3. düzey', plain: 'İki katlamayı (ortadan, çapraz ya da kenardan) sondan başa doğru açarak her katlamanın eklediği delikleri bulmak.' },
    { level: 4, name: '4. düzey', plain: 'Üç kez katlanan ya da iki kez katlanıp iki yerden delinen kâğıdı izlemek; bir katlamanın hangi deliklere ulaştığını ayırt etmek.' },
    {
      level: 5,
      name: '5. düzey',
      plain: 'Üç kez katlanan ya da iki kez katlanıp iki yerden delinen kâğıdı, farklı katlama türleri aynı soruda bir arada olduğunda da adım adım açarak izlemek.',
    },
  ],
};

export const kagitKatlama: TaskInstrument = {
  slug: 'kagit-katlama',
  version: 1,
  engine: 'tasks',
  name: 'Kâğıt Katlama',
  shortName: 'Kâğıt katlama',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 49.8,
  tagline: 'Katlanıp delinen bir kâğıdın açılınca nasıl görüneceğini zihinde canlandırabilmeyi, yani uzamsal görselleştirmeyi ölçer.',
  description:
    'Bu test, uzamsal görselleştirmeyi ölçmek için uzun süredir kullanılan "kâğıt katlama" sorularına dayanır: kare bir kâğıt bir, iki ya da üç kez katlanır ve delinir; kâğıt açılınca deliklerin nerede olacağı beş seçenekten seçilir. Sorular kolaydan zora doğru beş düzeyde ilerler ve Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi tür katlamaların daha kolay geldiğini, yanlış cevapların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Kâğıdı aç, delikleri bul',
    paragraphs: [
      'Birazdan katlanıp delinen kâğıtlar göreceksin. Kâğıt açılınca deliklerin nerede olacağını beş seçenekten seçeceksin.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler. Süre sınırı yok.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'kk_dogru', name: 'Doğru cevaplar', plain: 'Delikleri doğru gösteren seçeneğin seçildiği soruların sayısı.' },
    { key: 'kk_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'kk_tur', name: 'Katlama türleri', plain: 'Ortadan, kenardan ve çapraz katlamalardan hangilerinin daha kolay, hangilerinin daha zor geldiği.' },
    { key: 'kk_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Kâğıt katlama soruları: uzamsal görselleştirmeyi, yani bir şekli zihinde canlandırıp dönüştürebilmeyi ölçmek için kullanılan bir soru türü. Uttal ve arkadaşlarına (2013) göre bu tür görevlerde bir nesnenin zihinde dönüştürülmesi gerekir. Sorular ortadan, kenardan ve çapraz katlamalarla Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı test setlerinin soruları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Uzamsal görselleştirmeyi ölçer: kâğıdın katlanmış hâlini adım adım izlemeyi, deliğin kaç kattan geçtiğini bulmayı ve kâğıt açılınca deliklerin katlama çizgilerine göre aynalandığı yerleri zihinde canlandırmayı. Uttal ve arkadaşlarının (2013) incelediği çalışmalarda uzamsal becerilerin bilim, teknoloji, mühendislik ve matematik alanlarındaki başarıyı ve bu alanlarda ilerlemeyi güçlü biçimde yordadığı; uzun yıllar süren bir izleme çalışmasında da gençlikte ölçülen uzamsal yeteneğin bu alanlarda uzmanlaşmada önemli bir rol oynadığı bildirilmiştir (Wai, Lubinski ve Benbow, 2009).',
    turkishVersion: 'Özgün test. Sorular şekillerle hazırlanmıştır; yönergeler Türkçedir.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sorular, katlama sayısına ve türüne göre kolaydan zora beş düzeye ayrılmıştır; bu sıralama Ölçekhane’nin tasarımıdır ve soruların gerçek zorluk sırası henüz veriyle denetlenmedi. Her sorunun doğru seçeneği iki ayrı yolla hesaplanmıştır: kâğıdı adım adım açarak ve kâğıdın her noktasını katlanmış hâline taşıyıp deliğe düşen noktaları bularak; iki yol da yalnızca doğru seçeneği verir. Yanlış seçenekler olası yanılgılardan, deliğin yerini yanlış görmekten ve kâğıdı ters çevirmekten ya da döndürmekten üretilmiştir; delik sayısına ya da seçeneklerin birbirine benzerliğine bakan basit tahmin yolları, rastgele seçmekten belirgin biçimde daha çok doğru cevap vermez.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ve hangi tür katlamalarda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Uzamsal beceriler yaşla ve deneyimle değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir; bir norm Türkiye’de, yaş gruplarına göre ayrı ayrı oluşturulmalıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Küçük sınıflarda üç katlamalı sorularda zorlanmak beklenen bir durumdur. Telefonla da çözülebilir; şekiller büyük ekranda daha rahat görülür.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Uzamsal becerilerin yalnızca bir yönünü (görselleştirme) ölçer; şekilleri zihinde döndürme, yön bulma ya da sözel ve sayısal akıl yürütme hakkında bilgi vermez.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenir. Bu tür sorulara alışkın olmak ve test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bir meta analizde uzamsal becerilerin alıştırmayla gelişebildiği ve kazanımın alıştırılmayan başka uzamsal görevlere de yansıyabildiği görülmüştür (Uttal ve ark., 2013); bu yüzden bu sonuç değişmez bir özellik olarak görülmemelidir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Uttal, D. H., Meadow, N. G., Tipton, E., Hand, L. L., Alden, A. R., Warren, C. ve Newcombe, N. S. (2013). The malleability of spatial skills: A meta-analysis of training studies. Psychological Bulletin, 139(2), 352–402.',
        url: 'https://doi.org/10.1037/a0028446',
      },
      {
        text: 'Wai, J., Lubinski, D. ve Benbow, C. P. (2009). Spatial ability for STEM domains: Aligning over 50 years of cumulative psychological knowledge solidifies its importance. Journal of Educational Psychology, 101(4), 817–835.',
        url: 'https://doi.org/10.1037/a0016127',
      },
    ],
  },
};
