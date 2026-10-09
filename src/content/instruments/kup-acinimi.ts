import { COLOR_NAMES, SYMBOL_NAMES, lureOf, optionView, type Cell, type CubeColor, type CubeFace, type CubeLure, type CubeSymbol, type OptionSpec } from '@/lib/instruments/cube';
import type { CubeItem, CubeNetTask, CubePracticeItem, CubeType, TaskInstrument } from '@/lib/instruments/types';

/**
 * Küp açınımı: altı kareli bir açınım gösterilir; açınım katlanınca oluşan küpün hangi görünüşü olabileceği dört
 * seçenekten seçilir. Bütün sorular Ölçekhane'nindir; seçenekler katlamanın geometrisinden hesaplanır
 * (lib/instruments/cube.ts).
 *
 * Her sorunun bir doğru seçeneği ve üç yanlış seçeneği vardır. Yanlış seçenekler küpün bir duruşundan tek bir
 * değişiklikle üretilir; bu yüzden ilk bakışta olası görünürler:
 *  - karşılıklı yüzler yan yana (opposite): küpte birbirinin karşısına gelen iki yüz yan yana çizilir;
 *  - köşedeki sıra ters (order): üç yüz doğrudur ama köşedeki sıraları ayna görüntüsündeki gibidir;
 *  - şeklin yönü yanlış (turn): bir yüzdeki şekil döndürülmüştür.
 * Soruların yarısında (place) bütün şekiller dönünce değişmez; yalnızca yüzlerin yeri önemlidir. Öteki yarısında
 * (turn) ok, bayrak, köşe gibi yönü olan şekiller vardır; şeklin yönü de izlenmelidir.
 *
 * Düzeyler açınımın biçimine ve doğru seçenekte görünen üç yüzün açınımda birbirinden ne kadar uzak olduğuna göredir
 * (açınımda birinden ötekine geçilen kare sayısı): 1. düzey dört kare yan yana olan açınımlarda en çok iki, 2. düzey
 * aynı açınımlarda üç kare; 3. düzey basamaklı (2–3–1), 4. düzey zikzak (2–2–2 ve 3–3) açınımlarda en az üç ve dört kare.
 * Katlanması gereken kare sayısı arttıkça zihinde katlamanın zorlaştığı bilinir (Shepard ve Feng, 1972; aktaran Hilton
 * ve ark., 2022). Doğru seçeneklerin yeri dengelidir (her harf beş kez).
 *
 * tests/kup-acinimi.test.ts doğru seçeneği bağımsız bir yolla (açınımı kâğıt gibi katlayarak) yeniden hesaplar,
 * yanlış seçeneklerin hiçbirinin küpün bir duruşu olmadığını ve kestirme yolların (seçenekleri birbirine benzerliğine
 * göre seçmek gibi) doğru seçeneği bulamadığını denetler.
 */

/** Açınımlar: altı kare [sütun, satır]. */
const NETS: Record<string, Cell[]> = {
  // Dört kare yan yana (1–4–1): haç ve öteki biçimler.
  N1: [
    [1, 1],
    [0, 1],
    [2, 1],
    [3, 1],
    [1, 0],
    [1, 2],
  ],
  N2: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [0, 0],
    [0, 2],
  ],
  N3: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [0, 0],
    [1, 2],
  ],
  N4: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [0, 0],
    [2, 2],
  ],
  N5: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [0, 0],
    [3, 2],
  ],
  N6: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 0],
    [2, 2],
  ],
  // Basamaklı (2–3–1).
  S1: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
  ],
  S2: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [2, 2],
  ],
  S3: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
  ],
  // Zikzak (2–2–2 ve 3–3).
  Z2: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2],
  ],
  Z3: [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 1],
    [4, 1],
  ],
};

interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4;
  type: CubeType;
  net: keyof typeof NETS;
  /** Açınımdaki sırayla altı yüz: "şekil:renk". */
  faces: string;
  /** Dört seçenek; değişikliği olmayan doğru seçenektir. */
  options: OptionSpec[];
}

const SPECS: Spec[] = [
  { key: 'kp01', level: 1, type: 'place', net: 'N1', faces: 'circle:blue plus:orange square:teal ring:purple frame:amber four:rose', options: [{ top: 0, left: 2, change: 'opp:right:left' }, { top: 0, left: 1 }, { top: 5, left: 0, change: 'swap:left-right' }, { top: 3, left: 2, change: 'opp:right:left' }] },
  { key: 'kp02', level: 1, type: 'place', net: 'N1', faces: 'frame:teal circle:rose ring:amber plus:blue four:purple square:orange', options: [{ top: 4, left: 1, change: 'swap:left-right' }, { top: 4, left: 0, change: 'opp:top:right' }, { top: 5, left: 1, change: 'opp:top:left' }, { top: 0, left: 4 }] },
  { key: 'kp03', level: 1, type: 'turn', net: 'N1', faces: 'arrow:blue circle:amber plus:teal square:rose half:purple ring:orange', options: [{ top: 2, left: 4 }, { top: 5, left: 2, change: 'swap:top-left' }, { top: 1, left: 5, change: 'opp:top:left' }, { top: 0, left: 1, change: 'turn:top:1' }] },
  { key: 'kp04', level: 1, type: 'place', net: 'N6', faces: 'square:purple ring:blue four:amber circle:teal plus:rose frame:orange', options: [{ top: 1, left: 0, change: 'swap:top-left' }, { top: 3, left: 4, change: 'swap:top-left' }, { top: 1, left: 4 }, { top: 4, left: 1, change: 'opp:right:left' }] },
  { key: 'kp05', level: 1, type: 'turn', net: 'N2', faces: 'corner:orange plus:blue circle:purple bar:teal arrow:rose ring:amber', options: [{ top: 3, left: 0, change: 'swap:top-left' }, { top: 0, left: 1 }, { top: 0, left: 4, change: 'turn:left:2' }, { top: 2, left: 5, change: 'turn:right:1' }] },
  { key: 'kp06', level: 2, type: 'turn', net: 'N3', faces: 'triangle:teal circle:orange dots:blue square:amber arrow:purple plus:rose', options: [{ top: 4, left: 1 }, { top: 4, left: 2, change: 'swap:top-right' }, { top: 3, left: 0, change: 'turn:right:1' }, { top: 1, left: 0, change: 'turn:left:2' }] },
  { key: 'kp07', level: 2, type: 'place', net: 'N4', faces: 'plus:amber frame:blue circle:rose square:teal ring:orange four:purple', options: [{ top: 4, left: 1, change: 'swap:top-right' }, { top: 2, left: 5, change: 'opp:left:top' }, { top: 1, left: 5, change: 'opp:top:left' }, { top: 1, left: 2 }] },
  { key: 'kp08', level: 2, type: 'turn', net: 'N5', faces: 'half:blue ring:teal arrow:orange plus:purple circle:amber flag:rose', options: [{ top: 2, left: 4, change: 'opp:top:right' }, { top: 2, left: 3, change: 'swap:left-right' }, { top: 2, left: 1 }, { top: 2, left: 4, change: 'turn:top:2' }] },
  { key: 'kp09', level: 2, type: 'place', net: 'N3', faces: 'ring:rose square:blue four:teal frame:orange circle:purple plus:amber', options: [{ top: 5, left: 0 }, { top: 1, left: 5, change: 'opp:right:top' }, { top: 1, left: 0, change: 'opp:left:top' }, { top: 2, left: 5, change: 'swap:left-right' }] },
  { key: 'kp10', level: 2, type: 'place', net: 'N5', faces: 'circle:teal four:orange ring:blue plus:purple square:rose frame:amber', options: [{ top: 5, left: 0, change: 'opp:right:left' }, { top: 2, left: 4 }, { top: 1, left: 2, change: 'swap:top-left' }, { top: 3, left: 5, change: 'swap:top-left' }] },
  { key: 'kp11', level: 3, type: 'place', net: 'S1', faces: 'frame:purple circle:amber plus:teal ring:rose square:blue four:orange', options: [{ top: 0, left: 2, change: 'swap:top-right' }, { top: 1, left: 3, change: 'opp:top:right' }, { top: 1, left: 2, change: 'opp:left:top' }, { top: 0, left: 4 }] },
  { key: 'kp12', level: 3, type: 'turn', net: 'S2', faces: 'flag:teal plus:blue corner:amber circle:rose bar:orange arrow:purple', options: [{ top: 5, left: 4, change: 'turn:left:1' }, { top: 0, left: 2, change: 'swap:top-left' }, { top: 0, left: 5 }, { top: 5, left: 3, change: 'opp:left:right' }] },
  { key: 'kp13', level: 3, type: 'turn', net: 'S3', faces: 'arrow:amber square:purple triangle:blue ring:teal half:rose circle:orange', options: [{ top: 2, left: 1, change: 'opp:left:top' }, { top: 0, left: 1 }, { top: 5, left: 0, change: 'swap:top-right' }, { top: 1, left: 2, change: 'turn:left:3' }] },
  { key: 'kp14', level: 3, type: 'place', net: 'S2', faces: 'four:blue ring:orange circle:purple frame:teal plus:rose square:amber', options: [{ top: 4, left: 1, change: 'opp:top:left' }, { top: 1, left: 0, change: 'swap:top-left' }, { top: 2, left: 3, change: 'swap:top-right' }, { top: 1, left: 4 }] },
  { key: 'kp15', level: 3, type: 'turn', net: 'S1', faces: 'corner:rose circle:teal arrow:blue dots:amber flag:orange plus:purple', options: [{ top: 5, left: 2 }, { top: 3, left: 5, change: 'opp:right:left' }, { top: 0, left: 4, change: 'swap:top-right' }, { top: 3, left: 1, change: 'turn:top:1' }] },
  { key: 'kp16', level: 4, type: 'turn', net: 'Z2', faces: 'half:orange plus:teal arrow:rose ring:blue triangle:amber circle:purple', options: [{ top: 5, left: 3, change: 'opp:right:top' }, { top: 3, left: 2, change: 'swap:left-right' }, { top: 0, left: 5 }, { top: 5, left: 3, change: 'turn:right:2' }] },
  { key: 'kp17', level: 4, type: 'place', net: 'Z3', faces: 'square:orange frame:rose ring:teal circle:blue four:amber plus:purple', options: [{ top: 2, left: 5 }, { top: 1, left: 2, change: 'swap:left-right' }, { top: 4, left: 2, change: 'opp:left:right' }, { top: 3, left: 0, change: 'swap:top-right' }] },
  { key: 'kp18', level: 4, type: 'turn', net: 'Z3', faces: 'arrow:teal circle:rose flag:purple bar:amber corner:blue ring:orange', options: [{ top: 0, left: 4, change: 'turn:right:1' }, { top: 0, left: 4, change: 'swap:top-left' }, { top: 3, left: 1, change: 'opp:left:top' }, { top: 0, left: 4 }] },
  { key: 'kp19', level: 4, type: 'turn', net: 'Z2', faces: 'triangle:purple corner:teal circle:orange plus:amber arrow:blue half:rose', options: [{ top: 2, left: 3, change: 'turn:right:1' }, { top: 4, left: 2 }, { top: 5, left: 3, change: 'swap:top-left' }, { top: 2, left: 0, change: 'opp:right:left' }] },
  { key: 'kp20', level: 4, type: 'place', net: 'Z2', faces: 'ring:amber four:teal frame:blue square:purple plus:orange circle:rose', options: [{ top: 0, left: 5, change: 'opp:top:left' }, { top: 4, left: 0, change: 'opp:right:top' }, { top: 0, left: 1 }, { top: 0, left: 4, change: 'swap:top-right' }] },
];

export const CUBE_SPECS: readonly Spec[] = SPECS;
export const CUBE_NETS: Readonly<Record<string, readonly Cell[]>> = NETS;

const parseFaces = (s: string): CubeFace[] =>
  s.split(' ').map((x) => {
    const [symbol, color] = x.split(':');
    return { symbol: symbol as CubeSymbol, color: color as CubeColor };
  });

function build(spec: Spec): CubeItem {
  const cells = NETS[spec.net];
  return {
    key: spec.key,
    level: spec.level,
    type: spec.type,
    cells: cells.map((c) => [c[0], c[1]] as const),
    faces: parseFaces(spec.faces),
    options: spec.options.map((o) => optionView(cells, o)),
  };
}

/** Bir yüzün adı: "mavi daire" gibi. */
export const faceName = (f: CubeFace) => `${COLOR_NAMES[f.color]} ${SYMBOL_NAMES[f.symbol]}`;

/** Alıştırma: biri yalnızca yüzlerin yerini, biri şeklin yönünü de gerektirir. */
const PRACTICE_SPECS: (Spec & { explain: string })[] = [
  {
    key: 'kpp1',
    level: 1,
    type: 'place',
    net: 'N1',
    faces: 'circle:blue square:orange ring:teal plus:purple four:amber frame:rose',
    options: [{ top: 4, left: 0, change: 'opp:right:left' }, { top: 4, left: 0 }, { top: 4, left: 0, change: 'swap:left-right' }, { top: 4, left: 0, change: 'opp:top:right' }],
    explain:
      'Açınım katlanınca ortadaki mavi dairenin üstündeki sarı noktalar küpün üstüne, sağındaki yeşil halka sağına gelir. Açınımda düz bir sırada aralarında tek bir kare olan yüzler küpte karşı karşıya gelir; bu yüzden mavi daire ile mor artı (A), turuncu kare ile yeşil halka (D) hiçbir zaman birlikte görünmez. C’de aynı üç yüz var ama sıraları ters: sarı noktalar üstteyken mavi daire solda, yeşil halka sağda olmalıdır.',
  },
  {
    key: 'kpp2',
    level: 1,
    type: 'turn',
    net: 'N1',
    faces: 'arrow:blue circle:orange square:teal ring:purple plus:amber four:rose',
    options: [{ top: 4, left: 0, change: 'turn:left:2' }, { top: 4, left: 0, change: 'opp:top:left' }, { top: 4, left: 0 }, { top: 4, left: 0, change: 'swap:left-right' }],
    explain:
      'Açınımda mavi ok, sağındaki yeşil kareyi gösteriyor. Küp katlanınca da ok yeşil kareye doğru bakar; A’da ok ters yöne baktığı için o küp bu açınımdan olamaz. B’de mor halka ile mavi ok birlikte görünüyor ama bunlar karşılıklı yüzlerdir. D’de ok ile yeşil kare yer değiştirmiş: köşedeki sıra ters.',
  },
];

export const CUBE_PRACTICE_SPECS: readonly (Spec & { explain: string })[] = PRACTICE_SPECS;

const PRACTICE: CubePracticeItem[] = PRACTICE_SPECS.map((s) => ({ ...build(s), answer: s.options.findIndex((o) => !o.change) + 1, explain: s.explain }));

const task: CubeNetTask = {
  key: 'kup-acinimi',
  kind: 'cube_net',
  name: 'Küp Açınımı',
  measures: 'Bir küp açınımını zihinde katlayıp oluşan küpün nasıl görüneceğini bulabilmeyi ölçer.',
  instructions: [
    'Her soruda bir küpün açınımını ve dört küp göreceksin.',
    'Açınımı zihninde katla: dört küpten hangisi bu açınımdan oluşabilir? Açınım, şekiller küpün dışında kalacak biçimde katlanır.',
    'Küp eğik çizildiği için yüzlerdeki şekiller yatık görünür: artı çarpı gibi, kare baklava gibi, daire yumurta gibi görünebilir.',
    'Yüzlerin yerine ve şekillerin yönüne dikkat et. Kâğıt ya da kalem kullanmadan, zihninde çöz.',
  ],
  practice: PRACTICE,
  items: SPECS.map(build),
  answers: SPECS.map((s) => s.options.findIndex((o) => !o.change) + 1),
  optionLures: SPECS.map((s) => s.options.map((o): CubeLure | null => lureOf(o.change))),
  levels: [
    { level: 1, name: 'Yakın yüzler', plain: 'Açınımda birbirine yakın duran üç yüzün küpte nasıl yan yana geleceğini görmek.' },
    { level: 2, name: 'Uzak yüzler', plain: 'Açınımda birbirinden uzak duran yüzlerin küpte yan yana gelebileceğini görmek.' },
    { level: 3, name: 'Basamaklı açınımlar', plain: 'Basamaklı açınımlarda birkaç katlamayı arka arkaya zihinde yapmak.' },
    { level: 4, name: 'Zikzak açınımlar', plain: 'Zikzak açınımlarda katlamaları adım adım izleyip uzaktaki yüzleri doğru yere getirmek.' },
  ],
};

export const kupAcinimi: TaskInstrument = {
  slug: 'kup-acinimi',
  version: 1,
  engine: 'tasks',
  name: 'Küp Açınımı',
  shortName: 'Küp açınımı',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 49.85,
  tagline: 'Bir açınımı zihinde katlayıp küpün nasıl görüneceğini bulabilmeyi ölçer: yüzlerin yerini ve şekillerin yönünü.',
  description:
    'Bu test zihinde katlamayı, yani düz bir açınımı zihinde katlayıp oluşan küpün nasıl görüneceğini bulabilmeyi ölçer. Her soruda bir küp açınımı ve dört küp vardır; açınımdan hangi küpün oluşabileceği seçilir. Soruların yarısında yalnızca yüzlerin yeri, öteki yarısında yüzlerdeki şekillerin yönü de önemlidir. Sorular kolaydan zora doğru dört düzeyde ilerler ve Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar soruların çoğunun doğru bulunduğunu, yanlışlarda hangi yanılgıların (karşılıklı yüzleri yan yana görmek, köşedeki sırayı ters görmek, şeklin yönünü yanlış görmek) beklenenden sık görüldüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Açınımı zihninde katla',
    paragraphs: [
      'Birazdan bir küpün açınımını, yani küp açılıp düz bir yere serilince oluşan altı kareyi göreceksin. Açınımı zihninde katlayıp dört küpten hangisinin bu açınımdan oluşabileceğini bulacaksın.',
      `Test ${SPECS.length} sorudan oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok. Kâğıt ya da kalem kullanmadan, zihninde çöz.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'kp_dogru', name: 'Doğru cevaplar', plain: 'Açınımdan oluşabilecek küpün seçildiği soruların sayısı.' },
    { key: 'kp_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'kp_tur', name: 'Yüzlerin yeri ve şekillerin yönü', plain: 'Yalnızca yüzlerin yerinin önemli olduğu sorularla şekillerin yönünün de önemli olduğu soruların karşılaştırması ve yanlışlardaki yanılgılar.' },
    { key: 'kp_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve cevapların hep aynı sıradaki seçeneğe kayıp kaymadığı.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Zihinde katlama araştırmalarında kullanılan küp açınımı soruları (Shepard ve Feng, 1972; aktaran Hilton ve ark., 2022) ve açınımla küpün eşleştirildiği uzamsal görselleştirme soruları (Pawlak-Jakubowska ve Terczyńska, 2023). Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı test setlerinin soruları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Düz bir açınımı zihinde katlayıp oluşan küpün nasıl görüneceğini bulabilmeyi ölçer. Zihinde katlamanın zorluğu, her katlamada taşınması gereken kare sayısıyla artar (Shepard ve Feng, 1972; aktaran Hilton ve ark., 2022): yetişkinlerle yapılan bir çalışmada, açınımdaki iki işaretli kenarın küp katlanınca birleşip birleşmeyeceğine ekranda zihinden karar verilen sorular üç katlamada ortalama 4, beş katlamada ortalama 7,5 saniyede cevaplanmıştır (Dahm ve Sachse, 2025); katlama sayısı arttıkça doğru cevapların da azaldığı bilinmektedir (Shepard ve Feng, 1972; aktaran Dahm ve Sachse, 2025). Basit şekilleri zihinde katlama 5,5 yaş dolaylarında görülmeye başlar ve kişiler arasında büyük farklar vardır (Harris ve ark., 2013). 7–11 yaşındaki çocuklarla yapılan bir çalışmada zihinde katlama, yaş ve sözel beceri hesaba katıldıktan sonra da fen başarısıyla ilişkili bulunmuştur (Hodgkiss ve ark., 2018). Üniversite öğrencileriyle yapılan bir çalışmada açınımla küpün eşleştirildiği 16 soruluk bir testte soruların ortalama %55’i doğru cevaplanmıştır (Pawlak-Jakubowska ve Terczyńska, 2023). Türkiye’de geometrik cisimlerin açınımları ve karşılıklı yüzler arasındaki ilişki 4. sınıf matematik öğretim programında yer alır.',
    turkishVersion: 'Özgün test. Sorular ve yönergeler Türkçe olarak yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her sorunun doğru seçeneği, açınım kâğıt gibi katlanarak bağımsız ikinci bir hesapla yeniden bulunmuş; yanlış seçeneklerin hiçbirinin bu açınımdan oluşan küpün bir görünüşü olmadığı doğrulanmıştır.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki ve hangi türdeki sorularda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Uzamsal beceriler yaşla ve deneyimle değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '5. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Sorular renkli şekillerle çizilmiştir; her yüz hem şekliyle hem rengiyle ayırt edilebilir.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Uzamsal becerinin yalnızca bir yönünü (zihinde katlamayı) ölçer; zihinde döndürme ya da yön bulma hakkında bilgi vermez.',
      'Her soruda dört seçenek olduğu için rastgele seçen biri de soruların yaklaşık dörtte birini doğru bulabilir.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenebilir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Dahm, S. F. ve Sachse, P. (2025). Let’s do it: Response times in Mental Paper Folding and its execution. Quarterly Journal of Experimental Psychology, 78(4), 731–743.',
        url: 'https://doi.org/10.1177/17470218241249727',
      },
      {
        text: 'Harris, J., Newcombe, N. S. ve Hirsh-Pasek, K. (2013). A new twist on studying the development of dynamic spatial transformations: Mental paper folding in young children. Mind, Brain, and Education, 7(1), 49–55.',
        url: 'https://doi.org/10.1111/mbe.12007',
      },
      {
        text: 'Hilton, C., Raddatz, L. ve Gramann, K. (2022). A general spatial transformation process? Assessing the neurophysiological evidence on the similarity of mental rotation and folding. NeuroImage: Reports, 2(2), 100092.',
        url: 'https://doi.org/10.1016/j.ynirp.2022.100092',
      },
      {
        text: 'Hodgkiss, A., Gilligan, K. A., Tolmie, A. K., Thomas, M. S. C. ve Farran, E. K. (2018). Spatial cognition and science achievement: The contribution of intrinsic and extrinsic spatial skills from 7 to 11 years. British Journal of Educational Psychology, 88(4), 675–697.',
        url: 'https://doi.org/10.1111/bjep.12211',
      },
      {
        text: 'Pawlak-Jakubowska, A. ve Terczyńska, E. (2023). Evaluation of STEM students’ spatial abilities based on a novel net cube imagination test. Scientific Reports, 13, Article 17296.',
        url: 'https://doi.org/10.1038/s41598-023-44371-5',
      },
      {
        text: 'Shepard, R. N. ve Feng, C. (1972). A chronometric study of mental paper folding. Cognitive Psychology, 3(2), 228–243.',
        url: 'https://doi.org/10.1016/0010-0285(72)90005-9',
      },
    ],
  },
};
