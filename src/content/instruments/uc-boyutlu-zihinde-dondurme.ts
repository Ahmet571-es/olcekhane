import {
  LATTICE_ROTATIONS,
  apply,
  cellsOf,
  mirrorAxisFor,
  mirrorCells,
  mul,
  rotX,
  rotY,
  rotZ,
  transpose,
  turnOf,
  type Arm,
  type Cell3,
  type Mat3,
} from '@/lib/instruments/rotation3d';
import type { MentalRotation3dTask, Rotation3dFigure, Rotation3dItem, Rotation3dPracticeItem, TaskInstrument } from '@/lib/instruments/types';

/**
 * Üç Boyutlu Zihinde Döndürme
 *
 * Zihinde döndürme testlerinin düzenine dayanan özgün bir testtir (Vandenberg ve Kuse, 1978; aktaran Caissie ve ark.,
 * 2009): her soruda küplerden yapılmış bir şekil ve dört seçenek vardır; iki seçenek şeklin döndürülmüş hâli, ikisi
 * döndürülmüş ayna görüntüsüdür. Döndürülmüş iki seçenek seçilir; bir soru, iki doğru seçenek birlikte bulunursa doğru
 * sayılır (Vandenberg ve Kuse'nin puanlaması; aktaran Caissie ve ark., 2009). Şekiller, duruşlar, sorular ve rapor
 * Ölçekhane'nindir.
 *
 * Şekiller: Shepard ve Metzler'in (1971) şekilleri gibi yüz yüze birleşmiş küplerden bir zincir: dört kol, üç dik kıvrım,
 * 9–10 küp (aktaran Ganis ve Kievit, 2015). On şeklin hepsi ayna simetrisizdir: ayna görüntüsü döndürülerek şeklin
 * kendisi yapılamaz; hiçbiri kendi üstüne döndürülemez (döndürme simetrisi yoktur), böylece bir çizimin duruşu tektir.
 * Şekillerden dördünün iki uçtaki kolu eşit uzunluktadır; bu şekillerde kolları ayırt etmek daha
 * zor (Caissie ve ark., 2009) ya da daha kolay (Rajeb ve ark., 2025) bulunmuştur. Yanlış seçeneklerin hepsi ayna
 * görüntüsüdür: yapısı farklı seçenekler şekil döndürülmeden parçalarına bakılarak ayırt edilebilir (Frick ve Pichelmann, 2023).
 *
 * Bölümler: 1. bölümde (10 soru) seçenekler hedef şeklin yalnızca dik eksen çevresinde (bir döner tabla gibi) 50–180°
 * döndürülmüş hâlidir. 2. bölümde (10 soru, aynı on şekil başka duruşlarda) seçenekler ayrıca resim düzleminde (kameranın
 * bakış ekseni çevresinde) 40–140° yan yatırılmıştır. Ayna görüntüleri de aynı türden dönüşlerle çizilir; doğru
 * seçeneklerin ve ayna görüntülerinin ortalama dönüş açıları birbirine yakındır. Ayna görüntüsü, şekil dik bir düzleme
 * göre yansıtılarak yapılır: küplerin yükseklikleri şekildekilerle aynı kalır (yatay bir düzleme göre yansıtılsaydı ayna
 * görüntüsü baş aşağı dururdu ve 1. bölümde bir bakışta elenirdi). Bir sorudaki dört seçeneğin duruşları birbirinden en az
 * 25° (2. bölümde 35°), aynı türden iki seçeneğinki en az 40° ayrıdır. Hiçbir çizim, hedefin ya da başka bir seçeneğin düz bir resim gibi
 * döndürülmüş ya da çevrilmiş hâli değildir: resim düzleminde yapılabilecek en iyi döndürme ya da çevirmeden sonra
 * aralarında en az 25° üç boyutlu dönüş kalır; yoksa aynı mı ayna mı olduğu, şekil zihinde döndürülmeden iki resim
 * karşılaştırılarak anlaşılırdı.
 *
 * Çizim: şekiller gölgelendirilmiş ve hafif perspektifle çizilir (lib/instruments/rotation3d.ts). Bütün görünüşlerde her
 * küpün en az yaklaşık dörtte biri (biri dışında hepsinin en az yaklaşık üçte biri), iki uçtaki küplerin en az yarısı görünür; hiçbir kol kameraya doğru uzanıp
 * kısalmaz, birbirine bağlı olmayan iki kol (ör. 1. ve 3. kol) ekranda üst üste binmez, küplerin üç yüz yönü de görünür
 * (şekil düz bir resim gibi görünmez) ve ışık ekranın üstünden ve biraz solundan geldiği için en az bir yüz yönü belirgin
 * biçimde açık renktedir.
 * Kolun ya da küpün gizlenmesi soruyu döndürmeden bağımsız olarak zorlaştırır (Caissie ve ark., 2009).
 *
 * Doğru seçeneklerin yerleri dengelidir: dört yerin her biri 10 soruda doğrudur ve altı yer çiftinin her biri 3 ya da 4
 * soruda doğru çifttir. Siluetçe hedefe en benzer iki seçenek ya da en az benzer iki seçenek, şans düzeyinden (20 soruda
 * yaklaşık 3) daha sık doğru çift değildir; birbirine siluetçe en çok ya da en az benzeyen iki seçenek ve onların
 * dışında kalan iki seçenek de şans düzeyinden daha sık doğru çift değildir.
 *
 * Tarayıcıya her şekil, küplerinin konumları ve bir duruş matrisiyle gider; cevap anahtarı gitmez. Doğru seçenekler
 * hedefle aynı küp listesini taşımasın diye her şekil ızgaranın 24 döndürmesinden biriyle yeniden yazılır, matris buna
 * göre düzeltilir ve küplerin sırası karıştırılır (çizim değişmez). Çizilen her şekil gibi bu veriden de şeklin ayna
 * görüntüsü olup olmadığı hesaplanabilir; test bir sınav olmadığı için bu kabul edilir.
 * tests/uc-boyutlu-zihinde-dondurme.test.ts doğru seçenekleri tarayıcıya giden bu veriden bağımsız bir yolla yeniden
 * bulur, görünürlüğü bir derinlik tamponuyla denetler (tests/helpers/rotation3d-check.ts).
 */

/** Şekiller: kollar (yön ve küp sayısı; ilk kol başlangıç küpünü de içerir). */
const FIGURES: Record<string, string> = {
  F1: 'x+2 y+2 z+3 x+3',
  F2: 'x+2 y+3 z+3 x+2',
  F3: 'x+3 y+2 z+3 x+2',
  F4: 'x+2 y+3 z+3 y+2',
  F5: 'x+3 y+2 z+3 y-2',
  F6: 'x+3 y+2 z+2 y+3',
  F7: 'x+2 y+3 x+3 z+2',
  F8: 'x+2 y+3 x-3 z+2',
  F9: 'x+3 y+3 x+2 z+2',
  F10: 'x+3 y+2 z+2 y+2',
  // Alıştırma ve yönergedeki örnek: asıl sorularda olmayan şekiller.
  P1: 'x+2 y+2 z+2 x+3',
  P2: 'x+2 y+2 z+3 y+2',
  E: 'x+2 y+2 z+2 y+3',
};

const arms = (s: string): Arm[] => s.split(' ').map((x) => ({ dir: x.slice(0, 2) as Arm['dir'], n: Number(x.slice(2)) }));

interface OptionSpec {
  /** Ayna görüntüsü mü? */
  mirror: boolean;
  /** Dik eksen çevresinde dönüş (derece). */
  yaw: number;
  /** Ardından resim düzleminde yan yatırma (derece; yalnızca 2. bölümde). */
  roll?: number;
}

interface Spec {
  key: string;
  part: 1 | 2;
  figure: keyof typeof FIGURES;
  /** Hedef şekil, şeklin ayna görüntüsü mü? (Bir şekil bir bölümde kendisi, öbüründe ayna görüntüsüyle de çıkabilir.) */
  flip: boolean;
  /** Hedefin duruşu: önce x, sonra y ekseni çevresinde çeyrek turlar ve z ekseni çevresinde çeyrek tur [x, y, z]; ardından dik eksen çevresinde `yaw` derece. */
  base: [number, number, number];
  yaw: number;
  options: [OptionSpec, OptionSpec, OptionSpec, OptionSpec];
}

const S = (mirror: boolean, yaw: number, roll = 0): OptionSpec => ({ mirror, yaw, ...(roll ? { roll } : {}) });

const SPECS: Spec[] = [
  // 1. bölüm: yalnızca dik eksen çevresinde döndürülmüş.
  { key: 'ud01', part: 1, figure: 'F6', flip: true, base: [0, 1, 3], yaw: 305, options: [S(true, 165), S(false, 85), S(true, 115), S(false, -150)] },
  { key: 'ud02', part: 1, figure: 'F9', flip: true, base: [1, 0, 3], yaw: 225, options: [S(true, -115), S(true, -75), S(false, 70), S(false, 110)] },
  { key: 'ud03', part: 1, figure: 'F3', flip: false, base: [1, 2, 0], yaw: 130, options: [S(true, 65), S(false, -110), S(false, 95), S(true, 170)] },
  { key: 'ud04', part: 1, figure: 'F4', flip: false, base: [3, 0, 2], yaw: 300, options: [S(true, 85), S(true, 170), S(false, -165), S(false, -85)] },
  { key: 'ud05', part: 1, figure: 'F5', flip: true, base: [3, 3, 3], yaw: 30, options: [S(false, 80), S(true, -100), S(false, -150), S(true, -175)] },
  { key: 'ud06', part: 1, figure: 'F8', flip: false, base: [0, 0, 2], yaw: 225, options: [S(false, 160), S(true, -170), S(true, 75), S(false, -70)] },
  { key: 'ud07', part: 1, figure: 'F1', flip: false, base: [2, 2, 2], yaw: 130, options: [S(false, 90), S(false, -105), S(true, 170), S(true, 65)] },
  { key: 'ud08', part: 1, figure: 'F10', flip: true, base: [0, 3, 3], yaw: 110, options: [S(true, 135), S(false, 105), S(false, -135), S(true, -75)] },
  { key: 'ud09', part: 1, figure: 'F7', flip: true, base: [2, 3, 0], yaw: 335, options: [S(false, 90), S(true, -95), S(false, -120), S(true, 65)] },
  { key: 'ud10', part: 1, figure: 'F2', flip: true, base: [2, 2, 3], yaw: 125, options: [S(true, 180), S(false, -105), S(true, -60), S(false, -150)] },
  // 2. bölüm: dik eksen çevresinde döndürülmüş ve resim düzleminde yan yatırılmış.
  {
    key: 'ud11',
    part: 2,
    figure: 'F5',
    flip: true,
    base: [2, 2, 1],
    yaw: 210,
    options: [S(false, -60, 140), S(false, 180, 100), S(true, 80, -140), S(true, 40, -140)],
  },
  {
    key: 'ud12',
    part: 2,
    figure: 'F6',
    flip: false,
    base: [0, 0, 1],
    yaw: 325,
    options: [S(false, -80, -60), S(true, -80, 120), S(false, -120, 120), S(true, -120, -60)],
  },
  {
    key: 'ud13',
    part: 2,
    figure: 'F10',
    flip: true,
    base: [2, 3, 1],
    yaw: 145,
    options: [S(false, -120, -100), S(true, 60, -80), S(true, 100, 120), S(false, -80, 80)],
  },
  {
    key: 'ud14',
    part: 2,
    figure: 'F3',
    flip: false,
    base: [0, 0, 1],
    yaw: 125,
    options: [S(true, -60, 140), S(false, 130, 100), S(false, 90, 100), S(true, -100, -100)],
  },
  {
    key: 'ud15',
    part: 2,
    figure: 'F9',
    flip: false,
    base: [1, 0, 1],
    yaw: 320,
    options: [S(false, 150, -80), S(false, 110, 140), S(true, -170, 40), S(true, 70, -100)],
  },
  {
    key: 'ud16',
    part: 2,
    figure: 'F8',
    flip: false,
    base: [2, 2, 0],
    yaw: 320,
    options: [S(true, -120, -80), S(false, 60, 80), S(true, 170, 40), S(false, 100, 120)],
  },
  {
    key: 'ud17',
    part: 2,
    figure: 'F2',
    flip: false,
    base: [2, 0, 1],
    yaw: 30,
    options: [S(true, -150, -140), S(true, 130, 80), S(false, -140, -80), S(false, 130, 140)],
  },
  {
    key: 'ud18',
    part: 2,
    figure: 'F7',
    flip: false,
    base: [3, 2, 3],
    yaw: 115,
    options: [S(false, 90, -100), S(true, 180, -80), S(true, 120, -60), S(false, -60, -60)],
  },
  {
    key: 'ud19',
    part: 2,
    figure: 'F1',
    flip: false,
    base: [2, 1, 3],
    yaw: 25,
    options: [S(true, -150, 80), S(true, -80, 120), S(false, 40, 100), S(false, -40, -80)],
  },
  {
    key: 'ud20',
    part: 2,
    figure: 'F4',
    flip: false,
    base: [2, 2, 1],
    yaw: 25,
    options: [S(false, 40, 140), S(false, -70, -80), S(true, 120, 100), S(true, -160, 100)],
  },
];

const PRACTICE_SPECS: (Spec & { explain: string })[] = [
  {
    key: 'udp1',
    part: 1,
    figure: 'P1',
    flip: false,
    base: [0, 0, 3],
    yaw: 310,
    options: [S(false, 105), S(true, 175), S(false, -110), S(true, 65)],
    explain:
      'A ve C, şeklin döndürülmüş hâlidir: şekil bir döner tablanın üstündeymiş gibi çevrilince bu iki görünüşe gelir. B ve D ise ayna görüntüsüdür; ne kadar döndürülürse döndürülsün şekille çakışmaz. Aşağıda şeklin A’ya ve C’ye nasıl döndüğünü izleyebilirsin.',
  },
  {
    key: 'udp2',
    part: 2,
    figure: 'P2',
    flip: true,
    base: [0, 2, 3],
    yaw: 295,
    options: [S(true, 90, -40), S(false, 90, 60), S(true, 180, 60), S(false, -90, 60)],
    explain:
      'B ve D, şeklin döndürülmüş hâlidir: şekil hem döner tablada çevrilmiş hem de yan yatırılmıştır. A ve C ise ayna görüntüsüdür. Yan yatırılmış bir şekilde önce iki uçtaki kolu bulup üstteki şeklin uçlarıyla eşleştirmeyi deneyebilirsin. Aşağıda şeklin B’ye ve D’ye nasıl döndüğünü izleyebilirsin.',
  },
];

/** Yönergedeki örnek: şekil, döner tablada çevrilmiş hâli ve aynı duruşta ayna görüntüsü. */
const EXAMPLE = { figure: 'E', base: [0, 1, 2] as [number, number, number], yaw: 45, turn: -80 };

const baseOf = (b: readonly number[]): Mat3 => mul(rotY(90 * b[1]), mul(rotX(90 * b[0]), rotZ(90 * b[2])));

/** Basit bir karma: aynı anahtar her zaman aynı yeniden yazımı seçer. */
function hash(s: string): number {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

const round4 = (x: number) => Math.round(x * 1e4) / 1e4 + 0;

/** Anahtara bağlı karıştırma: aynı anahtar her zaman aynı sırayı verir. */
function shuffled<T>(xs: readonly T[], key: string): T[] {
  let seed = hash(key);
  const next = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Tarayıcıya giden şekil: küpler ızgaranın bir döndürmesiyle yeniden yazılır, matris buna göre düzeltilir ve küplerin
 * sırası karıştırılır (küpler zincir sırasıyla gitmez).
 */
function figure(cells: readonly Cell3[], m: Mat3, key: string): Rotation3dFigure {
  const q = LATTICE_ROTATIONS[hash(key) % LATTICE_ROTATIONS.length];
  const moved = cells.map((c) => apply(q, c).map((x) => Math.round(x)) as [number, number, number]);
  const mn = [0, 1, 2].map((k) => Math.min(...moved.map((c) => c[k])));
  return {
    cells: shuffled(
      moved.map((c) => c.map((x, k) => x - mn[k]) as [number, number, number]),
      `${key}:sira`,
    ),
    m: mul(m, transpose(q)).map(round4),
  };
}

function baseCells(spec: Pick<Spec, 'figure' | 'flip'>): Cell3[] {
  const cells = cellsOf(arms(FIGURES[spec.figure]));
  return spec.flip ? mirrorCells(cells) : cells;
}

function build(spec: Spec): Rotation3dItem {
  const cells = baseCells(spec);
  const t = mul(rotY(spec.yaw), baseOf(spec.base));
  return {
    key: spec.key,
    part: spec.part,
    target: figure(cells, t, `${spec.key}:t`),
    // Ayna görüntüsü dik bir düzleme göre yansıtılır: küplerin yükseklikleri şekildekilerle aynı kalır (mirrorAxisFor).
    options: spec.options.map((o, i) => figure(o.mirror ? mirrorCells(cells, mirrorAxisFor(t)) : cells, turnOf(t, o.yaw, o.roll), `${spec.key}:${i}`)),
  };
}

const answerOf = (spec: Spec): [number, number] => {
  const right = spec.options.flatMap((o, i) => (o.mirror ? [] : [i + 1]));
  return [right[0], right[1]];
};

/** İçerik denetimi için: soruların tanımı (tests/uc-boyutlu-zihinde-dondurme.test.ts). */
export const ROTATION3D_SPECS: readonly Spec[] = SPECS;
export const ROTATION3D_PRACTICE_SPECS: readonly Spec[] = PRACTICE_SPECS;
export const ROTATION3D_FIGURES: Readonly<Record<string, string>> = FIGURES;
export const ROTATION3D_EXAMPLE = EXAMPLE;

const exampleCells = cellsOf(arms(FIGURES[EXAMPLE.figure]));
const exampleTarget = mul(rotY(EXAMPLE.yaw), baseOf(EXAMPLE.base));

const PRACTICE: Rotation3dPracticeItem[] = PRACTICE_SPECS.map((s) => ({
  ...build(s),
  answer: answerOf(s),
  explain: s.explain,
  turns: s.options.filter((o) => !o.mirror).map((o) => ({ yaw: o.yaw, roll: o.roll ?? 0 })),
}));

const task: MentalRotation3dTask = {
  key: 'uc-boyutlu-zihinde-dondurme',
  kind: 'mental_rotation_3d',
  name: 'Üç Boyutlu Zihinde Döndürme',
  measures: 'Küplerden yapılmış şekilleri zihinde döndürüp ayna görüntülerinden ayırabilmeyi ölçer.',
  instructions: [
    'Her soruda küplerden yapılmış bir şekil ve altında dört şekil göreceksin.',
    'Dört şekilden ikisi, üstteki şeklin döndürülmüş hâlidir: aynı şekildir, yalnızca başka bir yönden görünür. Öteki ikisi ayna görüntüsüdür: ne kadar döndürülse de üstteki şekille çakışmaz.',
    'Döndürülmüş iki şekli seç. Her soruda tam iki doğru vardır; bir sorunun doğru sayılması için ikisini de bulmalısın.',
    'Şekiller ekranda dönmez; onları zihninde döndür. Kâğıt ya da kalem kullanma.',
  ],
  example: {
    target: figure(exampleCells, exampleTarget, 'ornek:t'),
    rotated: figure(exampleCells, turnOf(exampleTarget, EXAMPLE.turn), 'ornek:r'),
    mirrored: figure(mirrorCells(exampleCells, mirrorAxisFor(exampleTarget)), turnOf(exampleTarget, EXAMPLE.turn), 'ornek:a'),
  },
  practice: PRACTICE,
  items: SPECS.map(build),
  answers: SPECS.map(answerOf),
  parts: [
    {
      part: 1,
      name: 'Dik eksende döndürülmüş şekiller',
      intro: 'Bu bölümde şekiller, bir döner tablanın üstündeymiş gibi yalnızca dik bir eksen çevresinde döndürülmüştür.',
    },
    {
      part: 2,
      name: 'Yan yatırılmış şekiller',
      intro:
        'Bu bölümde şekiller hem dik bir eksen çevresinde döndürülmüş hem de bir resim çevrilir gibi sağa ya da sola çevrilmiştir; bazıları neredeyse baş aşağı görünür. Yine iki doğru şekli bulacaksın.',
    },
  ],
};

export const ucBoyutluZihindeDondurme: TaskInstrument = {
  slug: 'uc-boyutlu-zihinde-dondurme',
  version: 1,
  engine: 'tasks',
  name: 'Üç Boyutlu Zihinde Döndürme',
  shortName: 'Üç boyutlu döndürme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 49.86,
  tagline: 'Küplerden yapılmış bir şeklin döndürülmüş hâllerini ayna görüntülerinden ayırabilmeyi, yani üç boyutlu şekilleri zihinde döndürebilmeyi ölçer.',
  description:
    'Bu test, uzamsal beceriyi ölçmek için yaygın olarak kullanılan zihinde döndürme testlerinin düzenine dayanır. Her soruda küplerden yapılmış bir şekil ve dört seçenek vardır: seçeneklerden ikisi şeklin döndürülmüş hâli, ikisi döndürülmüş ayna görüntüsüdür; döndürülmüş iki seçeneği bulmak gerekir. İlk bölümde şekiller yalnızca dik bir eksen çevresinde döndürülmüş, ikinci bölümde ayrıca bir resim çevrilir gibi sağa ya da sola çevrilmiştir. Şekiller ve sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, iki bölümün karşılaştırmasını, yanlış cevaplarda ayna görüntülerinin nasıl seçildiğini ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Hangi ikisi aynı şekil?',
    paragraphs: [
      'Birazdan küplerden yapılmış bir şekil ve altında dört şekil daha göreceksin. Dört şekilden ikisi, üstteki şeklin döndürülmüş hâlidir; öteki ikisi ayna görüntüsüdür. Döndürülmüş iki şekli bulacaksın.',
      `Test ${SPECS.length} soru ve iki bölümden oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok. Kâğıt ya da kalem kullanmadan, zihninde çöz.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır. Şekiller büyük bir ekranda daha rahat görünür.',
    ],
  },
  scales: [
    { key: 'ud_dogru', name: 'Doğru cevaplar', plain: 'Döndürülmüş iki şeklin ikisinin de bulunduğu soruların sayısı.' },
    {
      key: 'ud_bolum',
      name: 'Dik eksen ve yan yatırma',
      plain: 'Yalnızca dik bir eksen çevresinde döndürülmüş şekillerle ayrıca yan yatırılmış şekillerin karşılaştırması.',
    },
    {
      key: 'ud_ayna',
      name: 'Ayna görüntüleri',
      plain: 'Yanlış cevaplanan sorularda ayna görüntülerinin nasıl seçildiği: bir doğru şekille birlikte mi, ikisi birden mi?',
    },
    { key: 'ud_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve cevapların hep aynı yerlerdeki seçeneklere kayıp kaymadığı.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Zihinde döndürme testlerinin düzeni: Shepard ve Metzler’in (1971) küplerden yapılmış şekilleri ve bu şekillerle kurulan kâğıt kalem testi; bu testte her soruda bir şekil ve dört seçenek vardır, seçeneklerden şeklin döndürülmüş hâli olan ikisi bulunur (Vandenberg ve Kuse, 1978; Peters ve ark., 1995; aktaran Caissie ve ark., 2009). Bir sorunun yalnızca iki doğru seçenek birlikte bulunursa doğru sayılması bu testlerin puanlamasıyla aynıdır (Vandenberg ve Kuse, 1978; aktaran Caissie ve ark., 2009). Şekiller, duruşlar, sorular ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; başka test setlerinden şekil, soru ya da norm alınmamıştır.',
    whatItMeasures:
      'Zihinde döndürmeyi, yani bir cismin döndürülünce nasıl görüneceğini zihinde canlandırıp onu ayna görüntüsünden ayırabilmeyi ölçer. Küplerden yapılmış iki şeklin aynı mı farklı mı olduğuna karar verilirken şekiller arasındaki açı büyüdükçe karar süresi ve yanlışlar artar (Shepard ve Metzler, 1971; aktaran Ganis ve Kievit, 2015): gölgelendirilmiş şekillerle 54 yetişkinle yapılan bir çalışmada açı 0’dan 150 dereceye çıkınca ortalama süre yaklaşık 1,8 saniyeden 3,2 saniyeye uzamış, yanlışlar %5’ten %19’a çıkmıştır (Ganis ve Kievit, 2015). Bir şeklin döndürülmüş hâllerinin seçenekler arasından seçildiği testlerde ise bir sorunun zorluğunu yalnızca dönüş açısı değil, şeklin görünüşü de etkileyebilir; bulgular çalışmadan çalışmaya değişir. Üniversite öğrencileriyle yapılan bir çalışmada bir kolun öbürünü kapattığı sorular ile iki uçtaki kolu eşit uzunlukta olan sorular daha zor bulunmuş, dönüş açısının zorlukla ilişkisi bulunmamıştır (Caissie ve ark., 2009). 3–8. sınıflardan 129 öğrenciyle yapılan bir çalışmada ise daha çok küplü ve birden çok yönde döndürülmüş şekiller daha zor, bir kolun öbürünü kapattığı ve iki uçtaki kolu eşit uzunlukta olan şekiller daha kolay bulunmuştur (Rajeb ve ark., 2025). Seçeneklerin birlikte gösterildiği sorularla yapılan bir deneyde de dönüş açısı büyüdükçe doğru cevaplar azalmıştır (Jost ve Jansen, 2024). Shepard ve Metzler’in (1971) şekilleri gölgesiz çizgi çizimleriydi; bu testteki şekiller, derinliği daha iyi göstermek için gölgelendirilerek çizilmiştir (Ganis ve Kievit, 2015) ve her küpün en az yaklaşık dörtte biri görünür. Yapısı farklı yanlış seçenekler, şekil döndürülmeden parçalarına bakılarak ayırt edilebildiği için bu testte yanlış seçeneklerin hepsi ayna görüntüsüdür (Frick ve Pichelmann, 2023). Zihinde döndürme becerisinin matematik başarısıyla ilişkisi çocuklukta gösterilmiştir ama bu ilişki yaşa ve matematik konusuna göre değişir (Gilligan ve ark., 2020); uzamsal beceriler alıştırmayla da gelişebilir: 217 çalışmayı birleştiren bir meta analizde alıştırma yapan gruplar, yapmayanlardan ortalama olarak yaklaşık yarım standart sapma kadar daha çok ilerlemiştir (Uttal ve ark., 2013; aktaran Gilligan ve ark., 2020).',
    turkishVersion: 'Özgün test. Sorular şekillerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Benzer düzendeki (ama süre sınırlı ve yanlış seçeneklerinin bir kısmı yapıca farklı olan) 24 soruluk bir kâğıt kalem testinin 624 üniversite öğrencisindeki iç tutarlılığı yüksek bulunmuştur (Cronbach α = .91; Caissie ve ark., 2009); bu değer, sorular farklı olduğu için bu test için geçerli sayılamaz. Şu denetimler güvenirlik kanıtı değil, soruların doğruluğu için yapılmıştır: her sorunun doğru seçenekleri ayrı bir hesapla yeniden bulunmuş; ayna görüntülerinin hiçbirinin döndürülerek şekille çakışmadığı ve her küpün görünür olduğu denetlenmiştir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, kaç sorunun doğru cevaplandığıyla ve iki bölümün karşılaştırmasıyla anlatılır. Zekâ puanı (IQ) verilmez. Uzamsal beceriler yaşla ve deneyimle değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '5. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Bu düzendeki bir test 10 yaşından büyük çocuk ve ergenler için uygun kabul edilir (Peters ve ark., 1995; aktaran Jansen ve ark., 2019). 11–17 yaşlarındaki 120 ergenle yapılan bir çalışmada, bu düzendeki süre sınırlı, 24 soruluk bir testte iki ülkenin ortalaması yaklaşık 10 ve 13 doğru bulunmuştur (Jansen ve ark., 2019). Ölçekhane’nin testi 20 sorudur ve süre sınırı yoktur; bu sayılar bu testle karşılaştırılamaz. Yetişkinlerde bu tür testlerin sonuçları, 20 yaşın üstündeki yaş gruplarında yaş ilerledikçe düşme eğilimindedir (Jost ve Jansen, 2024).',
    license: 'Özgün test. Şekiller, sorular ve rapor Ölçekhane tarafından geliştirilmiştir; puanlama kuralı bu düzendeki testlerinkiyle aynıdır.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Uzamsal becerinin yalnızca bir yönünü (üç boyutlu şekilleri zihinde döndürmeyi) ölçer; zihinde katlama ya da yön bulma hakkında bilgi vermez.',
      'Her soruda dört seçenekten iki doğru seçilir; rastgele seçen biri de yaklaşık her altı sorudan birini doğru bulabilir.',
      'Bu düzendeki testlerde soruların zorluğunu yalnızca zihinde döndürme değil, şeklin parçalarını görüp karşılaştırmak da etkiler (Caissie ve ark., 2009); seçeneklerin sayısı ve ayna görüntüleriyle çiftler hâlinde mi, karışık sırayla mı gösterildiği gibi düzen özellikleri de sonucu değiştirebilir (Jost ve Jansen, 2024).',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenebilir. Zihinde döndürme testi yeniden çözüldüğünde sonuçlar yükselebilir (bir çalışmada iki grupta da ikinci ölçümde yükselmiştir; Timm ve ark., 2024).',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Caissie, A. F., Vigneau, F. ve Bors, D. A. (2009). What does the Mental Rotation Test measure? An analysis of item difficulty and item characteristics. The Open Psychology Journal, 2, 94–102.',
        url: 'https://doi.org/10.2174/1874350100902010094',
      },
      {
        text: 'Frick, A. ve Pichelmann, S. (2023). Measuring spatial abilities in children: A comparison of mental-rotation and perspective-taking tasks. Journal of Intelligence, 11(8), 165.',
        url: 'https://doi.org/10.3390/jintelligence11080165',
      },
      {
        text: 'Ganis, G. ve Kievit, R. (2015). A new set of three-dimensional shapes for investigating mental rotation processes: Validation data and stimulus set. Journal of Open Psychology Data, 3(1), e3.',
        url: 'https://doi.org/10.5334/jopd.ai',
      },
      {
        text: 'Gilligan, K. A., Thomas, M. S. C. ve Farran, E. K. (2020). First demonstration of effective spatial training for near transfer to spatial performance and far transfer to a range of mathematics skills at 8 years. Developmental Science, 23(4), e12909.',
        url: 'https://doi.org/10.1111/desc.12909',
      },
      {
        text: 'Jansen, P., Paes, F., Hoja, S. ve Machado, S. (2019). Mental rotation test performance in Brazilian and German adolescents: The role of sex, processing speed, and physical activity in two different cultures. Frontiers in Psychology, 10, 945.',
        url: 'https://doi.org/10.3389/fpsyg.2019.00945',
      },
      {
        text: 'Jost, L. ve Jansen, P. (2024). The influence of the design of mental rotation trials on performance and possible differences between sexes: A theoretical review and experimental investigation. Quarterly Journal of Experimental Psychology, 77(6), 1250–1271.',
        url: 'https://doi.org/10.1177/17470218231200127',
      },
      {
        text: 'Peters, M., Laeng, B., Latham, K., Jackson, M., Zaiyouna, R. ve Richardson, C. (1995). A redrawn Vandenberg and Kuse mental rotations test: Different versions and factors that affect performance. Brain and Cognition, 28(1), 39–58.',
        url: 'https://doi.org/10.1006/brcg.1995.1032',
      },
      {
        text: 'Rajeb, M., Krist, A. T., Shi, Q., Oyeniran, D. O., Wind, S. A. ve Lakin, J. M. (2025). Mental rotation performance: Contribution of item features to difficulties and functional adaptation. Journal of Intelligence, 13(1), 2.',
        url: 'https://doi.org/10.3390/jintelligence13010002',
      },
      {
        text: 'Shepard, R. N. ve Metzler, J. (1971). Mental rotation of three-dimensional objects. Science, 171(3972), 701–703.',
        url: 'https://doi.org/10.1126/science.171.3972.701',
      },
      {
        text: 'Timm, J. D., Huff, M., Schwan, S. ve Papenmeier, F. (2024). Short-term transfer effects of Tetris on mental rotation: Review and registered report — A Bayesian approach. Attention, Perception, & Psychophysics, 86(3), 1056–1064.',
        url: 'https://doi.org/10.3758/s13414-024-02855-0',
      },
      {
        text: 'Uttal, D. H., Meadow, N. G., Tipton, E., Hand, L. L., Alden, A. R., Warren, C. ve Newcombe, N. S. (2013). The malleability of spatial skills: A meta-analysis of training studies. Psychological Bulletin, 139(2), 352–402.',
        url: 'https://doi.org/10.1037/a0028446',
      },
      {
        text: 'Vandenberg, S. G. ve Kuse, A. R. (1978). Mental rotations, a group test of three-dimensional spatial visualization. Perceptual and Motor Skills, 47(2), 599–604.',
        url: 'https://doi.org/10.2466/pms.1978.47.2.599',
      },
    ],
  },
};
