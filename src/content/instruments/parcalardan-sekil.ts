import type { AssemblyItem, AssemblyLure, AssemblyPracticeItem, AssemblyType, ShapeAssemblyTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Parçalardan Şekil: üstte iki ila beş düz parça dağınık durur (her biri kendi yönünde), altta dört bütün şekil vardır;
 * parçalar kaydırılıp döndürülerek (ters çevrilmeden) birleştirilince hangi bütünün oluştuğu seçilir. Bu, uzamsal
 * görselleştirmeyi ölçmekte uzun süredir kullanılan "kâğıt şekil tahtası" (paper form board) türü bir sorudur (Embretson,
 * 1996; Ivie ve Embretson, 2010). Ad, WISC-R'nin Türkçe sürümündeki "Parça Birleştirme" alt testiyle karışmasın diye
 * seçildi. Bütün parçalar, şekiller ve sorular Ölçekhane'nindir; WISC-R "Parça Birleştirme", WAIS-IV/WISC-V "Visual Puzzles",
 * ASVAB "Assembling Objects", Minnesota Kâğıt Şekil Tahtası ya da ETS "Form Board" testinin soruları ve malzemeleri
 * kullanılmaz.
 *
 * Geometri (lib/instruments/assembly.ts): şekiller birim karelerden ve köşegeniyle ikiye bölünmüş yarım karelerden oluşur.
 * Seçeneklerde parçaların sınırları ince çizgiyle çizilir; doğru seçenekte her parça üstteki parçalardan biriyle (döndürülerek)
 * tıpatıp aynıdır. Sorular bir üreticiyle hazırlandı (scratchpad'de, depoda değil): bütün şekil, köşeleri yontulmuş bir
 * dikdörtgendir (her satır ve sütun en çok 1,5 birim kısalır; her yatay ve dikey çizgi şekli tek bir aralıkta keser: oyuk,
 * çentik ya da ok ucu yok; böylece harfe ya da rakama benzeyen bütünler çıkmaz) ve parçalara bölünür; parçalar da aynı
 * kurala uyar.
 *
 * Yanlış seçenekler (türü `lures`'ta):
 *  - `piece` (bir parçası farklı): parçalardan biri aynı büyüklükte ama başka biçimdedir; parçalar bu şekli ne döndürerek
 *    ne de ters çevirerek oluşturabilir;
 *  - `mirror` (ayna): parçalardan biri ters çevrilmiştir; parçalar bu şekli ancak ters çevrilerek oluşturur;
 *  - `cut` (başka parçalara bölünmüş): dış hattı doğru şekille aynıdır (başka yöne döndürülmüş gösterilir) ama parçalara
 *    başka yerlerden bölünmüştür; beş soruda vardır;
 *  - `size` (büyüklüğü farklı; yalnızca 1. ve 2. düzeyde): bir parça bir kare büyük ya da küçüktür;
 *  - `odd` (parça sayısı farklı; yalnızca 1. düzeyde, kolayca elenen seçenek): parçalardan biri ikiye bölünmüştür.
 * 3. düzeyden itibaren dört seçeneğin alanı ve parça sayısı aynıdır. Doğru seçeneklerin yeri dengelidir (her harf beş kez,
 * art arda aynı harf yok). Yanlış seçenekler, geniş bir aday havuzundan, doğru seçenek "ötekilere en çok benzeyen" seçenek olmasın
 * diye seçildi (her yanlış seçenek parçalardan yalnızca birini değiştirerek kurulduğu için doğru şekil kendiliğinden ortada kalmaya
 * yatkındır). Basit tahmin
 * yolları (en büyük, en simetrik, ötekilere en benzer seçenek gibi) 20 soruda en çok 7 doğru verir (rastgele seçim: 5).
 *
 * Soru türleri (`type`): `slide` (yalnızca kaydırma: parçalar doğru şekildeki yönleriyle gösterilir; 1. düzeyin hepsi ve
 * 3–4. düzeyde birer soru), `turn` (döndürme gereken: 2. ve 3. düzeyde bir, 4. düzeyde iki, 5. düzeyde bütün parçalar
 * döndürülmüş gösterilir), `mirror` (ayna tuzaklı: bir yanlış seçenek, parçalardan birinin ters çevrilmiş hâliyle kurulmuştur; 3–5.
 * düzeylerde ikişer soru). Düzeyler parça sayısına (1. düzeyde iki, 5. düzeyde dört ya da beş), parçaların döndürülmesine ve
 * dağınıklığına, yanlış seçeneklerin benzerliğine göre kolaydan zora gider; parçaların yerinden oynatılması ve döndürülmesi
 * soruyu zorlaştıran başlıca etkenlerdendir (Ivie ve Embretson, 2010; Shi ve ark., 2023).
 *
 * tests/parcalardan-sekil.test.ts bütün bu koşulları bağımsız bir yolla (parçaları döndürerek, ayrıca ters çevirerek
 * yerleştiren kesin bir döşeme denetimiyle) yeniden denetler ve basit tahmin yollarının (en büyük, en simetrik, ötekilere en
 * benzer seçenek gibi) rastgele seçmekten belirgin biçimde iyi olmadığını gösterir.
 */

interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: AssemblyType;
  /** Görünen parçalar: simge dizisi ve üstten kayma (birim). */
  pieces: [string, number][];
  /** Dört bütün şekil (parçaların sınırlarıyla). */
  options: [string, string, string, string];
  /** Seçeneklerin yanılgı türü; doğru seçenekte `null`. */
  lures: (AssemblyLure | null)[];
}

interface PracticeSpec extends Spec {
  explain: string;
}

const EXPLAIN = [
  'Üstteki iki parça döndürülmeden, yalnızca yan yana kaydırılınca doğru şekli oluşturur: şekildeki her parça üstteki parçalardan biriyle tıpatıp aynıdır. Öteki seçeneklerden birinde parça sayısı farklıdır, birinde bir parça daha büyük ya da daha küçüktür, birinde de parçalardan biri başka biçimdedir.',
  'Parçalardan biri döndürülmüş gösterildi; zihninde çevirince yerine oturur. Bir seçeneğin dış hattı doğru şekle benziyor ama ince çizgilere bakınca parçalarının başka biçimde olduğu görülür; o seçenek doğru değildir.',
  'Bir seçenek, parçalardan birinin ters çevrilmiş (ayna görüntüsü) hâliyle kurulmuş. Parçalar döndürülebilir ama ters çevrilemez; bu yüzden o seçenek doğru değildir. Doğru şekilde her parça, yalnızca döndürülerek yerine oturur.',
];

const SPECS: Spec[] = [
  {
    key: 'ps01',
    level: 1,
    type: 'slide',
    pieces: [['1 1D/. 1', 0], ['1 1 ./1B 1 1', 0]],
    options: [
      '1 1 ./1B 1 1/. 2B 2',
      '. 1 1D/2 2 1/2B 2 2',
      '. 1 1/2 1 1/2B 2 1A',
      '1 1 1D/2 1 1/3 3A .',
    ],
    lures: ['size', null, 'piece', 'odd'],
  },
  {
    key: 'ps02',
    level: 1,
    type: 'slide',
    pieces: [['1 1/1 1', 0], ['1 ./1B 1', 0]],
    options: [
      '. 1 1/2 1 1/2B 2 .',
      '1 1D ./2 3 3/. 3 3',
      '1C 1 ./1 2 2/2 2 2',
      '1C 1 2D/1 2 2/. 2 2A',
    ],
    lures: [null, 'odd', 'size', 'piece'],
  },
  {
    key: 'ps03',
    level: 1,
    type: 'slide',
    pieces: [['. . 1/1B 1 1', 0], ['1 1D/1 1', 0]],
    options: [
      '. 1C 1/2 1 1/3B 3 3',
      '. 2 2/1C 2 2/1 1 1A',
      '2 2D ./2 2 1/1B 1 1',
      '1C 2 ./1 2 2/1 1 2A',
    ],
    lures: ['odd', 'cut', null, 'piece'],
  },
  {
    key: 'ps04',
    level: 1,
    type: 'slide',
    pieces: [['1C 1 1D/1 1 1', 0], ['1B 1', 0]],
    options: [
      '1C 1 1D/1 1 1/2B 2 .',
      '1 1 ./1 1 1/. 2B 2',
      '. 1 1D/2 1 1/2A3C 3 .',
      '1 1 1D/2 2 2/2B 2 2A',
    ],
    lures: [null, 'piece', 'odd', 'size'],
  },
  {
    key: 'ps05',
    level: 2,
    type: 'turn',
    pieces: [['1 1/1 1A', 0.5], ['. . 1/1B 1 1A', 0.5]],
    options: [
      '1C 1 ./1 1A2C 2/. 2 2',
      '1C 1 2/1 1 2/2B 2 2A',
      '2 2D ./2 2 1/1B 1 1A',
      '. 1C 1/2C 2 1/2 2 1A',
    ],
    lures: ['piece', 'size', null, 'piece'],
  },
  {
    key: 'ps06',
    level: 2,
    type: 'turn',
    pieces: [['1 1', 0.5], ['1C 1/1 1', 0], ['1 1D/1A .', 0]],
    options: [
      '2 2 2/3 1 1/3B 3 .',
      '1 1 2/1 1A3C 2/3B 3 2',
      '1C 2 2/1 3 3/1B 3 3A',
      '. 1 1D/2 1A3C 3/2 3 3',
    ],
    lures: ['cut', 'size', 'piece', null],
  },
  {
    key: 'ps07',
    level: 2,
    type: 'turn',
    pieces: [['1 1', 1], ['1 1D/1 1/1 1A', 1]],
    options: [
      '1C 1 1D/1 1 1/2 2 1',
      '1C 1 1D/1 1 1/2 2 .',
      '. 1C 1/2 1 1/2B 1B2D 1',
      '1 1A2C 2/1B 2 2/. 2B 2',
    ],
    lures: ['size', null, 'piece', 'piece'],
  },
  {
    key: 'ps08',
    level: 2,
    type: 'turn',
    pieces: [['1B 1 1', 1], ['. 1C/1 1', 0.5], ['1 1', 0.5]],
    options: [
      '1 1 ./1A2C 3 3/2B 2 2A',
      '1B2D 1 1/2B 2 3/. 2B 3',
      '. 1C 2/1 1 2/3B 3 3',
      '1 1 ./2B 2 2/. 3B 3',
    ],
    lures: ['piece', 'piece', null, 'size'],
  },
  {
    key: 'ps09',
    level: 3,
    type: 'slide',
    pieces: [['1C 1/1 1', 1], ['1C 1/. 1/. 1', 0.5], ['1/1/1', 0.5]],
    options: [
      '1 1 1 2/1B 3 2B3D 2/. 3 3 2A',
      '. 2C 2 3/1C 1 2 3/1 1 2 3',
      '3 3 1/3 1 1/3B 2 2/. 2B 2',
      '1C 1 1/2 3 1B3D/2 3 3/2 2A .',
    ],
    lures: ['piece', null, 'cut', 'piece'],
  },
  {
    key: 'ps10',
    level: 3,
    type: 'turn',
    pieces: [['1C 1/1 1', 0], ['1 . ./1 1 1A', 1], ['1 1/1A .', 1]],
    options: [
      '3 3 ./2C3A 2 1D/2 2 1/. 1 1',
      '1C 1 1 ./1 2 2D3B 3/. 2 2 3',
      '1 1 2 2D/1B 3 2 2/. 3 3 3A',
      '1 1 2 ./1 1A3C 2 2D/. 3 3 3',
    ],
    lures: [null, 'piece', 'piece', 'piece'],
  },
  {
    key: 'ps11',
    level: 3,
    type: 'mirror',
    pieces: [['1 1 1/1B . .', 0], ['1 1', 0.5], ['1 1/1 1', 0.5]],
    options: [
      '. 1 1 1/2 2 2 1/2B 3 3 .',
      '1 2 2D ./1 2 3 3/. 2 3 3',
      '. 1C 1/2 2 1/3 3 1/3B 3 3A',
      '. 2 2/1 2 2/1 3 3/1 1A .',
    ],
    lures: ['piece', 'mirror', 'piece', null],
  },
  {
    key: 'ps12',
    level: 3,
    type: 'mirror',
    pieces: [['1 ./1 1D/1 1', 0.5], ['1/1/1', 0.5], ['1/1/1A', 0.5]],
    options: [
      '1 1 1 2D/1 1A2C 2 2/3B 3 3 .',
      '1 1 1D/2 2 2/3 3 3/. 3B 3',
      '1 1 2 3/1B 1 2 3/. 1 2 3A',
      '1 2 2 2/1 1D3B 3 3A/1 1 3A .',
    ],
    lures: ['piece', 'mirror', null, 'piece'],
  },
  {
    key: 'ps13',
    level: 4,
    type: 'slide',
    pieces: [['1C 1/. 1', 0.5], ['1 ./1 1', 0.5], ['. 1C/1B 1', 1], ['1D/1/1A', 1]],
    options: [
      '1 2 2 ./1 1A3C 2 4D/. 3 3D4B 4',
      '1 1 2D/1 2 2/3B 3 4/. 3A4C 4A',
      '. 1C 1 1A2C/3 3 2B4D 2/3 4 4 .',
      '1C 1 3D/2 1 3/2 2 3A4C/. 4B 4',
    ],
    lures: ['piece', 'piece', 'piece', null],
  },
  {
    key: 'ps14',
    level: 4,
    type: 'turn',
    pieces: [['1 1/1 .', 0.5], ['1 1 1D/. . 1', 1], ['1 1 1', 0.5], ['1 1 1D/. 1 .', 0]],
    options: [
      '. 1 1 2/3C 1 2 2/3 3 3 2A/4 4 4 .',
      '3 3 3 ./2 4 4 4D/2 2 1 4/. 1B 1 1',
      '1C 2 2 ./1 1A3C 2 4/1 3 3 4/. 3 4 4A',
      '. 2C 2 2/1 1 3 3/4 1 3 3A/4 4 4 .',
    ],
    lures: ['piece', null, 'piece', 'cut'],
  },
  {
    key: 'ps15',
    level: 4,
    type: 'mirror',
    pieces: [['1D/1/1', 0], ['. 1/1B 1', 0], ['1 1 1', 1], ['1C/1/1A', 1]],
    options: [
      '1C 1D2B 2 2D/1 3 3 3/1A4C 4 4 .',
      '1 1D ./1 2 3/2 2 3/4B 4 3B4D',
      '. 1C 2/3C 1 2/3 1A4C 2/3 4 4',
      '2C 2 2 ./4 4 4 1/3B 3 1B3D 1',
    ],
    lures: ['piece', 'piece', 'mirror', null],
  },
  {
    key: 'ps16',
    level: 4,
    type: 'mirror',
    pieces: [['1 ./1 1/1B .', 0], ['1 1/. 1A', 0.5], ['1 1/1 .', 0.5], ['1 1D ./1 1 1A', 1]],
    options: [
      '. 1 1 2D/3 3 1A2C 2/3 4 2 2/4B 4 4 .',
      '3 1 1 ./3 3 1 2/3B 4 2B4D 2/. 4 4 4A',
      '. 1 2 2/1 1 1A3C 2/4 3B4D 3 3A/4 4 4A .',
      '1 2 2 ./1 1 2 3D/1B 4 3C4A 3/. 4 3 3',
    ],
    lures: ['mirror', null, 'piece', 'piece'],
  },
  {
    key: 'ps17',
    level: 5,
    type: 'turn',
    pieces: [['1 ./1 1D/1B 1', 0], ['1 1 ./. 1 1', 1], ['1/1/1', 0.5], ['1 ./1 1A', 0]],
    options: [
      '1 1 1 2D/3 3 2 2/3B 3 3A4C 4/. 4 4 4A',
      '. 4 4 4/2 2 1 1/2 3 3 1/2B 3 3 .',
      '. 4 1 1D/4 4 1B3D 1/4 3 3 1/2 2 2 .',
      '1 2 2 ./1 3 2 2/1 3 3D4B 4/. 3B 3 4',
    ],
    lures: ['piece', 'cut', null, 'piece'],
  },
  {
    key: 'ps18',
    level: 5,
    type: 'turn',
    pieces: [['1 1D/1 ./1B .', 0], ['1/1/1', 0], ['1 ./1 1A', 0], ['1/1', 0.5], ['1C 1 1', 0.5]],
    options: [
      '1C 5 5 ./1 1 1A4C 4/2 2 2 4/. 3 3 3A',
      '1 2 3 ./1 2 3B4D 3/1B 2 4 5/. 4B 4 5',
      '1 1A2C 2 ./1 3 2 4D/1B 3 5 4/. 3 5 4',
      '1 1D2B 2D ./1 3 2 4/1B 3 2B5D 4/. 5 5 4',
    ],
    lures: [null, 'piece', 'piece', 'piece'],
  },
  {
    key: 'ps19',
    level: 5,
    type: 'mirror',
    pieces: [['1/1/1B', 0.5], ['1 1 1D/1 . .', 1], ['1 ./1 ./1 1', 1], ['1 1/1 1A', 1]],
    options: [
      '1 1 1D ./1 2 2 3/4 4 2 3/4B 4 2 3A',
      '. 1 1 2D/3 1 1A4C 2/3 4 4 2/3 3 4 .',
      '1C 1 2 2D/1 1 3 2/3 3 3 2/. 4 4 4A',
      '3C 3 1 1/3 3 4 1/4 4 4 1A/2 2 2A .',
    ],
    lures: ['mirror', 'piece', 'piece', null],
  },
  {
    key: 'ps20',
    level: 5,
    type: 'mirror',
    pieces: [['1D ./1 1/. 1', 1], ['1 1 1A', 0], ['1 1/. 1', 0], ['1C 1/. 1', 1], ['1/1', 0]],
    options: [
      '3C 3 3 1/5 5 1 1/4 4 2 2A/4B 2 2 .',
      '. 1 1A2C 2/1 1 3 2/4 4 3 3/5B 5 5 .',
      '1C 1 1 2D/3 3 2 2/4 3 5 5/4B 4A5C 5 .',
      '1 1 2D ./1 2 2 3D/4 4 5 3/4B 4 5 3',
    ],
    lures: [null, 'mirror', 'piece', 'piece'],
  },
];

const PRACTICE_SPECS: PracticeSpec[] = [
  {
    key: 'psp1',
    level: 1,
    type: 'slide',
    pieces: [['1 1/. 1B', 0], ['1 1 1D', 0]],
    options: [
      '1 1 1D/2 3 3A',
      '1 1D/2 2/. 2B',
      '. 1 1/2 2 1B2D',
      '1C 1A2C/1 2/1B 2',
    ],
    lures: ['odd', 'size', null, 'piece'],
    explain: EXPLAIN[0],
  },
  {
    key: 'psp2',
    level: 2,
    type: 'turn',
    pieces: [['1 1D/1 1/1 .', 1], ['1 1/1B .', 0]],
    options: [
      '1 1 2/1B 2 2/. 2B 2',
      '. 1 1D/2C 2 1/2 2 2',
      '2 1 1/2 1 1A/2 1A .',
      '. 1 2D/1 1 2/1B 1 .',
    ],
    lures: [null, 'piece', 'cut', 'size'],
    explain: EXPLAIN[1],
  },
  {
    key: 'psp3',
    level: 3,
    type: 'mirror',
    pieces: [['1 1/1 .', 0], ['1 1/1B 1', 0.5], ['. 1D/1C 1/1 .', 0]],
    options: [
      '1C 1 1D/2 2 1/2 3 3/. 3 3A',
      '1 1D ./2 1 1A3C/2 2 3/. 3 3',
      '1 1 ./1 2 2D/2 2A3C 3/. 3 3',
      '1 1 ./1 2 2/3 2B3D 2/. 3 3A',
    ],
    lures: ['piece', 'piece', 'mirror', null],
    explain: EXPLAIN[2],
  },
];

export const ASSEMBLY_SPECS: readonly Spec[] = SPECS;
export const ASSEMBLY_PRACTICE_SPECS: readonly PracticeSpec[] = PRACTICE_SPECS;

const build = (s: Spec): AssemblyItem => ({
  key: s.key,
  level: s.level,
  type: s.type,
  pieces: s.pieces.map(([shape, dy]) => ({ shape, dy })),
  options: [...s.options],
});

const PRACTICE: AssemblyPracticeItem[] = PRACTICE_SPECS.map((s) => ({ ...build(s), answer: s.lures.indexOf(null) + 1, explain: s.explain }));

const task: ShapeAssemblyTask = {
  key: 'parcalardan-sekil',
  kind: 'shape_assembly',
  name: 'Parçalardan Şekil',
  measures: 'Ayrı ayrı gösterilen parçaları zihinde bir araya getirip hangi bütün şekli oluşturduklarını görebilmeyi ölçer.',
  instructions: [
    'Her soruda üstte birkaç parça, altında dört bütün şekil göreceksin.',
    'Parçaların hepsi birleşince hangi şeklin oluşacağını bul. Parçaları zihninde kaydırabilir ve döndürebilirsin ama ters çeviremezsin.',
    'Bütün şekillerde parçaların birleştiği yerler ince çizgilerle gösterilir: doğru şekilde her parça, üstteki parçalardan biriyle tıpatıp aynıdır.',
  ],
  practice: PRACTICE,
  items: SPECS.map(build),
  answers: SPECS.map((s) => s.lures.indexOf(null) + 1),
  optionLures: SPECS.map((s) => [...s.lures]),
  levels: [
    { level: 1, name: '1. düzey', plain: 'Döndürülmeden gösterilen iki parçanın, yalnızca yan yana kaydırılınca hangi şekli oluşturduğunu bulmak.' },
    { level: 2, name: '2. düzey', plain: 'İki ya da üç parçadan biri döndürülmüş gösterildiğinde, onu zihinde çevirip bütünü bulmak.' },
    { level: 3, name: '3. düzey', plain: 'Dağınık duran üç parçayı birleştirmek ve ters çevrilmiş bir parçayla kurulan şekli doğru şekilden ayırmak.' },
    { level: 4, name: '4. düzey', plain: 'Dört parçayı (çoğu soruda ikisi döndürülmüşken) birleştirmek ve birbirine çok benzeyen seçenekleri ayırmak.' },
    { level: 5, name: '5. düzey', plain: 'Hepsi farklı yönlere döndürülmüş dört ya da beş parçayı birleştirmek; yanlış seçenekler doğru şekilden tek bir ayrıntıda ayrılır.' },
  ],
};

export const parcalardanSekil: TaskInstrument = {
  slug: 'parcalardan-sekil',
  version: 1,
  engine: 'tasks',
  name: 'Parçalardan Şekil',
  shortName: 'Parçalardan şekil',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 8,
  sortOrder: 49.85,
  tagline: 'Ayrı ayrı gösterilen parçaları zihinde birleştirip hangi bütün şekli oluşturduklarını görebilmeyi, yani uzamsal görselleştirmeyi ölçer.',
  description:
    'Bu test, uzamsal görselleştirmeyi ölçmek için uzun süredir kullanılan “kâğıt şekil tahtası” türü sorulara dayanır: üstte birkaç parça dağınık durur; parçalar zihinde kaydırılıp döndürülerek birleştirilince hangi bütün şeklin oluşacağı dört seçenekten seçilir. Parçalar ters çevrilemez. Sorular kolaydan zora doğru beş düzeyde ilerler: parça sayısı artar, parçalar döndürülmüş durur ve yanlış seçenekler doğru şekle giderek daha çok benzer. Bütün parçalar, şekiller ve sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi tür sorularda zorlanıldığını, yanlış cevapların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Parçaları birleştir',
    paragraphs: [
      'Birazdan üstte birkaç parça, altında dört bütün şekil göreceksin. Parçaların hepsi birleşince hangi şeklin oluşacağını bulacaksın.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'ps_dogru', name: 'Doğru cevaplar', plain: 'Parçaların oluşturduğu şeklin seçildiği soruların sayısı.' },
    { key: 'ps_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    {
      key: 'ps_tur',
      name: 'Soru türleri',
      plain: 'Yalnızca kaydırma gereken, döndürme gereken ve ayna tuzaklı sorulardan hangilerinin daha kolay, hangilerinin daha zor geldiği.',
    },
    {
      key: 'ps_yanilgi',
      name: 'Yanlışlarda seçilen şekiller',
      plain: 'Yanlış cevaplarda parçalarından biri farklı, bir parçası ters çevrilmiş ya da başka parçalara bölünmüş şekillerden hangisinin seçildiği.',
    },
    { key: 'ps_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Kâğıt şekil tahtası (paper form board) türü sorular: ayrı ayrı gösterilen parçaların birleşince hangi bütünü oluşturacağını seçmek. Bu soru türü uzamsal görselleştirmeyi ölçmek için uzun süredir kullanılır (Embretson, 1996; Ivie ve Embretson, 2010). Bu testteki bütün parçalar, şekiller ve sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Test, Wechsler Çocuklar İçin Zekâ Ölçeği’nin (WISC-R) Türkçe sürümündeki “Parça Birleştirme” alt testi değildir (Soysal, Tan ve Aldemir, 2012). WAIS-IV ve WISC-V’teki “Visual Puzzles”, ASVAB’daki “Assembling Objects”, Minnesota Kâğıt Şekil Tahtası Testi ya da ETS’nin “Form Board” testi de değildir. Bu testlerin soruları, malzemeleri, puanlama kuralları ve normları kullanılmaz.',
    whatItMeasures:
      'Uzamsal görselleştirmeyi ölçer: ayrı ayrı gösterilen parçaları zihinde kaydırıp döndürerek bir bütüne yerleştirmeyi ve parça ile bütün arasındaki ilişkiyi görmeyi (Shi, Wind ve Lakin, 2023). Bu tür sorularda zorluğu büyük ölçüde parçaların yerinden ne kadar oynatıldığı ve yanlış seçeneklerin ne kadar kolay elendiği belirler (Ivie ve Embretson, 2010; Shi ve ark., 2023). Parçaların döndürülmüş gösterilmesi bir araştırmada soruları zorlaştırmış, ötekinde zorlaştırmamıştır. Okul öncesinde, iki parçanın hangi şekli oluşturduğunu bulma becerisi 4 ile 7 yaş arasında belirgin biçimde gelişir (Levine, Huttenlocher, Taylor ve Langrock, 1999). Yapboz oynayan küçük çocukların uzamsal görevlerde daha başarılı olduğu da gözlenmiştir; bu bir gözleme dayanır ve oyunun beceriyi tek başına artırdığını göstermez (Levine, Ratliff, Huttenlocher ve Cannon, 2012). Uzun yıllar süren bir izleme çalışmasında, bilim, mühendislik ve matematik alanlarında ileri düzeye ulaşan kişilerin çoğunun lise yıllarında uzamsal becerisinin yüksek olduğu görülmüştür (Wai, Lubinski ve Benbow, 2009). Bu bir ilişkidir; bu testin sonucu kimin hangi mesleğe uygun olduğunu söylemez.',
    turkishVersion: 'Özgün test. Parçalar, şekiller ve yönergeler Ölçekhane tarafından hazırlanmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her sorunun yalnızca bir doğru cevabı olduğu, bağımsız ikinci bir hesapla doğrulanmıştır: parçalar döndürülerek yerleştirilince yalnızca doğru seçeneği tıpatıp oluşturur. 3. düzeyden itibaren dört seçeneğin alanı ve parça sayısı aynıdır. Seçenekler, parçaları saymakla ya da şekillerin büyüklüğüne ve simetrisine bakmakla elenemeyecek biçimde kurulmuştur (Embretson, 1996). Bu tür basit tahmin yolları, rastgele seçmekten belirgin biçimde daha çok doğru cevap vermez.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki ve hangi türdeki sorularda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Uzamsal beceriler yaşla ve deneyimle değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Bu türden özgün soruları 3–7. sınıftaki çocuklar da çözebilmiştir; en zor sorular küçük sınıflar için çok zor olabilir (Shi ve ark., 2023). Süre sınırı yoktur. Telefonla da çözülebilir; şekiller büyük ekranda daha rahat görülür.',
    license: 'Özgün test. Parçalar, şekiller, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Uzamsal becerilerin yalnızca bir yönünü (parçaları zihinde birleştirmeyi) ölçer; yön bulma ya da sözel ve sayısal akıl yürütme hakkında bilgi vermez.',
      'Her soruda dört seçenek olduğu için rastgele seçen biri de soruların yaklaşık dörtte birini doğru bulabilir.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenebilir. Araştırmalarda uzamsal testleri yeniden çözen kişilerin sonuçları, arada alıştırma yapmasalar da yükselmiştir (Uttal ve ark., 2013); bu testte aynı sorular geldiği için soruları hatırlamak da sonucu yükseltebilir.',
      'Bir meta analizde uzamsal becerilerin alıştırmayla gelişebildiği ve kazanımın alıştırılmayan başka uzamsal görevlere de yansıyabildiği görülmüştür (Uttal ve ark., 2013). Bu yüzden bu sonuç değişmez bir özellik olarak görülmemelidir.',
      'Düzeyler parça sayısına, parçaların döndürülmesine ve yanlış seçeneklerin benzerliğine göre kurulmuştur; soruların gerçek zorluk sırası henüz katılımcı verileriyle sınanmadı.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Embretson, S. E. (1996). Cognitive design principles and the successful performer: A study on spatial ability. Journal of Educational Measurement, 33(1), 29–39.',
        url: 'https://core.ac.uk/download/4740316.pdf',
      },
      {
        text: 'Ivie, J. L. ve Embretson, S. E. (2010). Cognitive process modeling of spatial ability: The assembling objects task. Intelligence, 38, 324–335.',
        url: 'https://doi.org/10.1016/j.intell.2010.02.002',
      },
      {
        text: 'Levine, S. C., Huttenlocher, J., Taylor, A. ve Langrock, A. (1999). Early sex differences in spatial skill. Developmental Psychology, 35(4), 940–949.',
        url: 'https://doi.org/10.1037/0012-1649.35.4.940',
      },
      {
        text: 'Levine, S. C., Ratliff, K. R., Huttenlocher, J. ve Cannon, J. (2012). Early puzzle play: A predictor of preschoolers’ spatial transformation skill. Developmental Psychology, 48(2), 530–542.',
        url: 'https://doi.org/10.1037/a0025913',
      },
      {
        text: 'Shi, Q., Wind, S. A. ve Lakin, J. M. (2023). Exploring the influence of item characteristics in a spatial reasoning task. Journal of Intelligence, 11(8), 152.',
        url: 'https://doi.org/10.3390/jintelligence11080152',
      },
      {
        text: 'Soysal, Ş., Tan, S. ve Aldemir, S. (2012). WISC-R ve Raven Standart Progresif Matrisler Testinin DEHB tanısı alan çocuklarda matematik başarısını belirleme gücü. Düşünen Adam, 25(1), 17–26.',
        url: 'https://doi.org/10.5350/DAJPN2012250102',
      },
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
