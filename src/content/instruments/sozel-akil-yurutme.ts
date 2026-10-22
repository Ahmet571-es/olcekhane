import type { TaskInstrument, VerbalItem, VerbalItemType, VerbalPracticeItem, VerbalReasoningTask } from '@/lib/instruments/types';
import { VERBAL_UNKNOWN } from '@/lib/instruments/verbal';

/**
 * Sözel akıl yürütme: kelime ilişkileri, sınıflama, sıralama ve mantıksal çıkarım. Bütün sorular Ölçekhane'nindir.
 *
 * Her türde altı soru vardır ve türler düzeylere yayılır (kelime ilişkileri 1, 2, 2, 3, 4, 5; sınıflama 1, 2, 3, 3, 4, 5;
 * sıralama 1, 2, 3, 4, 4, 5; mantıksal çıkarım 1, 2, 3, 4, 5, 5). Zorluk az bilinen kelimelerden değil, ilişkinin ve
 * çıkarımın zorluğundan gelir.
 *
 * Tek doğru cevap: sıralama ve mantıksal çıkarım sorularında bilgilere uyan bütün olasılıkları deneyen bir program
 * (tests/helpers/verbal-logic.ts) yalnızca doğru seçeneğin her olasılıkta doğru olduğunu gösterir. Kelime ilişkileri ve
 * sınıflama sorularında böyle bir program kullanılamaz; sorular cevap anahtarı görülmeden ayrı ayrı çözülerek ve her
 * seçenek için savunulabilir bir gerekçe aranarak denetlendi (2026-10-08; üç ayrı çözümde de bütün cevaplar anahtarla
 * aynıydı; bulunan belirsizlikler düzeltildi: çıkarım yönergesi, fotoğrafta sol ve sağ, "rüzgâr", "radyo", "bariyer").
 *
 * Çeldirici ("ilk bakışta doğru görünen" seçenek, `lure`): kelime ilişkilerinde üçüncü kelimeyle ilgili ama aynı ilişkiyi
 * kurmayan kelime; sınıflamada gruba bir yönüyle benzeyen ama ortak özelliği taşımayan kelime; sıralamada bilgilerin
 * yalnızca bir bölümüne uyan ya da olabilir ama kesin olmayan cevap; mantıksal çıkarımda olabilir (ya da gerçek hayatta
 * doğru) ama verilen bilgilerden kesin olarak çıkmayan cümle. Doğru cevapların ve çeldiricilerin yerleri beş seçeneğe
 * dengeli dağılır (testte denetlenir).
 */
interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: VerbalItemType;
  stem: string[];
  question?: string;
  options: string[];
  answer: number;
  lure: number;
  /** Çeldiricinin neden çekici olduğu (yalnızca bu dosyada; raporda genel anlatılır). */
  why: string;
}

const U = VERBAL_UNKNOWN;

const SPECS: Spec[] = [
  // 1. düzey
  {
    key: 'sz01',
    level: 1,
    type: 'analogy',
    stem: ['köpek', 'kulübe', 'at'],
    options: ['nal', 'ahır', 'eyer', 'saman', 'tay'],
    answer: 2,
    lure: 4,
    why: 'Saman atla ilgilidir ama atın kaldığı yer değil, yediği şeydir.',
  },
  {
    key: 'sz02',
    level: 1,
    type: 'ordering',
    stem: ['Kerem, Defne’den daha hızlı koşar.', 'Defne, Umut’tan daha hızlı koşar.', 'Umut, Sena’dan daha hızlı koşar.'],
    question: 'En yavaş koşan kimdir?',
    options: ['Defne', 'Kerem', 'Sena', 'Umut', U],
    answer: 3,
    lure: 4,
    why: 'İkinci bilgiye göre Umut, Defne’den yavaştır; üçüncü bilgi Sena’nın ondan da yavaş olduğunu söyler.',
  },
  {
    key: 'sz03',
    level: 1,
    type: 'classification',
    stem: ['elma', 'armut', 'kiraz'],
    options: ['erik', 'sepet', 'havuç', 'ağaç', 'ekmek'],
    answer: 1,
    lure: 3,
    why: 'Havuç da yenen bir bitkidir ama meyve değil, sebzedir.',
  },
  {
    key: 'sz04',
    level: 1,
    type: 'deduction',
    stem: ['Bir kutudaki bütün toplar kırmızıydı.', 'Ela bu kutudan bir top aldı.'],
    options: ['Ela kırmızı rengi sever.', 'Ela’nın aldığı top büyüktür.', 'Kutuda mavi bir top vardı.', 'Kutudaki bütün oyuncaklar toptu.', 'Ela’nın aldığı top kırmızıdır.'],
    answer: 5,
    lure: 1,
    why: 'Ela’nın kırmızıyı sevdiği olabilir ama bilgilerde böyle bir şey yoktur.',
  },
  // 2. düzey
  {
    key: 'sz05',
    level: 2,
    type: 'classification',
    stem: ['çekiç', 'testere', 'tornavida'],
    options: ['tahta', 'pense', 'kutu', 'marangoz', 'çivi'],
    answer: 2,
    lure: 5,
    why: 'Çivi çekiçle birlikte kullanılır ama bir alet değildir.',
  },
  {
    key: 'sz06',
    level: 2,
    type: 'analogy',
    stem: ['makas', 'kesmek', 'kalem'],
    options: ['okumak', 'kâğıt', 'kırmak', 'yazmak', 'defter'],
    answer: 4,
    lure: 2,
    why: 'Kâğıt kalemle ilgilidir ama kalemin işi değil, üzerine yazılan şeydir.',
  },
  {
    key: 'sz07',
    level: 2,
    type: 'deduction',
    stem: ['Yusuf, yağmur yağan her gün şemsiyesini yanına alır.', 'Dün yağmur yağdı.'],
    options: [
      'Yusuf dün şemsiyesini yanına aldı.',
      'Yusuf dün evden çıkmadı.',
      'Yağmur yağmayan günlerde Yusuf şemsiyesini yanına almaz.',
      'Yusuf her gün şemsiyesini yanına alır.',
      'Bugün de yağmur yağacak.',
    ],
    answer: 1,
    lure: 3,
    why: 'Kural yalnızca yağmurlu günleri anlatır; yağmursuz günlerde ne yaptığı bilinmez.',
  },
  {
    key: 'sz08',
    level: 2,
    type: 'ordering',
    stem: ['Kırmızı kalem, mavi kalemden uzundur.', 'Yeşil kalem, kırmızı kalemden uzundur.', 'Sarı kalem, mavi kalemden kısadır.'],
    question: 'En uzun kalem hangisidir?',
    options: ['Kırmızı kalem', 'Mavi kalem', 'Sarı kalem', 'Yeşil kalem', U],
    answer: 4,
    lure: 1,
    why: 'İlk bilgiye göre kırmızı kalem uzundur; ikinci bilgi yeşil kalemin ondan da uzun olduğunu söyler.',
  },
  {
    key: 'sz09',
    level: 2,
    type: 'analogy',
    stem: ['doktor', 'hastane', 'öğretmen'],
    options: ['kitap', 'ders', 'okul', 'tebeşir', 'öğrenci'],
    answer: 3,
    lure: 5,
    why: 'Öğrenci öğretmenle ilgilidir ama öğretmenin çalıştığı yer değildir (doktor için hastanın karşılığıdır).',
  },
  // 3. düzey
  {
    key: 'sz10',
    level: 3,
    type: 'ordering',
    stem: ['Dört kardeş bu sabah farklı saatlerde uyandı.', 'Deniz, Zeynep’ten önce uyandı.', 'Murat, Deniz’den önce uyandı.', 'Selin, Deniz’den sonra uyandı.'],
    question: 'Buna göre hangisi kesinlikle doğrudur?',
    options: ['Zeynep en son uyanan kardeştir.', 'Selin, Zeynep’ten sonra uyandı.', 'Deniz ilk uyanan kardeştir.', 'Selin, Murat’tan önce uyandı.', 'Murat, Selin’den önce uyandı.'],
    answer: 5,
    lure: 2,
    why: 'Selin en son anılır ama Zeynep’le hangisinin önce uyandığı bilinmez; bu yalnızca olabilir.',
  },
  {
    key: 'sz11',
    level: 3,
    type: 'classification',
    stem: ['kar', 'yağmur', 'sulu sepken'],
    options: ['şimşek', 'dolu', 'gökkuşağı', 'bulut', 'rüzgâr'],
    answer: 2,
    lure: 4,
    why: 'Bulut yağışın geldiği yerdir ama kendisi yağmaz.',
  },
  {
    key: 'sz12',
    level: 3,
    type: 'analogy',
    stem: ['gün', 'hafta', 'ay'],
    options: ['yıl', 'gün', 'yıldız', 'dakika', 'gece'],
    answer: 1,
    lure: 3,
    why: '“Ay” gökyüzündeki Ay olarak okunursa yıldız akla gelir; burada ay, yılın bir parçasıdır.',
  },
  {
    key: 'sz13',
    level: 3,
    type: 'deduction',
    stem: ['Bütün balıklar ağaçlara tırmanabilir.', 'Hamsi bir balıktır.'],
    options: ['Bazı balıklar ağaçlara tırmanamaz.', 'Hamsi denizde yaşar.', 'Hamsi bir balık değildir.', 'Hamsi ağaçlara tırmanabilir.', 'Hiçbir balık yüzemez.'],
    answer: 4,
    lure: 2,
    why: 'Hamsinin denizde yaşadığı gerçek hayatta doğrudur ama verilen bilgilerden çıkmaz.',
  },
  {
    key: 'sz14',
    level: 3,
    type: 'classification',
    stem: ['kitap', 'gazete', 'mektup'],
    options: ['kütüphane', 'zarf', 'dergi', 'kalem', 'resim'],
    answer: 3,
    lure: 1,
    why: 'Kütüphane kitapla ilgilidir ama okunan bir yazı değil, bir yerdir.',
  },
  // 4. düzey
  {
    key: 'sz15',
    level: 4,
    type: 'analogy',
    stem: ['fısıltı', 'bağırış', 'esinti'],
    options: ['fırtına', 'yaprak', 'yelpaze', 'bulut', 'serinlik'],
    answer: 1,
    lure: 5,
    why: 'Esinti serinlik getirir; ama örnek çift sesin en hafif ve en güçlü hâlidir, rüzgârda bunun karşılığı fırtınadır.',
  },
  {
    key: 'sz16',
    level: 4,
    type: 'ordering',
    stem: [
      'Ceren, Duru, Okan, Pelin ve Tolga bir fotoğrafta yan yana duruyor. Sağ ve sol, fotoğrafa bakan kişiye göredir.',
      'Tolga tam ortada duruyor.',
      'Ceren, Tolga’nın hemen solunda duruyor.',
      'Okan, Pelin’in hemen solunda duruyor.',
    ],
    question: 'Fotoğrafta en solda kim duruyor?',
    options: ['Ceren', 'Duru', 'Okan', 'Pelin', U],
    answer: 2,
    lure: 1,
    why: 'Ceren solda anılır ama Tolga’nın hemen solundadır; en solda adı bilgilerde hiç geçmeyen Duru kalır.',
  },
  {
    key: 'sz17',
    level: 4,
    type: 'deduction',
    stem: ['Bu maçta kırmızı kart gören her oyuncu oyundan atıldı.', 'Kaan bu maçta oynadı ve maçın sonuna kadar sahada kaldı.'],
    options: [
      'Kaan bu maçta kırmızı kart gördü.',
      'Kaan bu maçta sarı kart gördü.',
      'Kaan’ın takımı maçı kazandı.',
      'Kaan bu maçta kırmızı kart görmedi.',
      'Bu maçta sahadan çıkan her oyuncu kırmızı kart görmüştü.',
    ],
    answer: 4,
    lure: 5,
    why: 'Kural tersine çevrilmiştir: sahadan başka nedenlerle (ör. oyuncu değişikliği) çıkan da olabilir.',
  },
  {
    key: 'sz18',
    level: 4,
    type: 'classification',
    stem: ['fren', 'kırmızı ışık', 'dur levhası'],
    options: ['araba kornası', 'direksiyon simidi', 'tren geçidi bariyeri', 'yeşil ışık', 'otoyol yön tabelası'],
    answer: 3,
    lure: 4,
    why: 'Yeşil ışık da bir trafik ışığıdır ama taşıtları durdurmaz, geçirir.',
  },
  {
    key: 'sz19',
    level: 4,
    type: 'ordering',
    stem: ['Melis, Ozan’dan yaşça büyüktür.', 'Nehir, Ozan’dan yaşça büyüktür.', 'Tuna, Melis’ten yaşça büyüktür.'],
    question: 'Yaşça en büyük olan kimdir?',
    options: ['Melis', 'Nehir', 'Ozan', 'Tuna', U],
    answer: 5,
    lure: 4,
    why: 'Tuna, Melis’ten ve Ozan’dan büyüktür ama Nehir’le karşılaştırılmamıştır.',
  },
  // 5. düzey
  {
    key: 'sz20',
    level: 5,
    type: 'deduction',
    stem: ['Bir masal ülkesinde şunlar doğrudur:', 'Hiçbir su ejderhası ateş püskürmez.', 'Bütün dağ ejderhaları ateş püskürür.'],
    options: [
      'Hiçbir dağ ejderhası su ejderhası değildir.',
      'Bazı su ejderhaları dağ ejderhasıdır.',
      'Ateş püskürenlerin hepsi dağ ejderhasıdır.',
      'Su ejderhaları uçamaz.',
      'Bazı dağ ejderhaları ateş püskürmez.',
    ],
    answer: 1,
    lure: 3,
    why: '“Bütün dağ ejderhaları ateş püskürür” bilgisi tersine çevrilmiştir; başka ateş püskürenler de olabilir.',
  },
  {
    key: 'sz21',
    level: 5,
    type: 'analogy',
    stem: ['şemsiye', 'ıslanma', 'baraj'],
    options: ['elektrik', 'su', 'göl', 'sel', 'beton'],
    answer: 4,
    lure: 2,
    why: 'Baraj suyu tutar ama örnek çiftte ikinci kelime önlenen şeydir: şemsiye ıslanmayı, baraj seli önler.',
  },
  {
    key: 'sz22',
    level: 5,
    type: 'ordering',
    stem: [
      'Arda, Begüm, Cansu, Doruk ve Efe beş katlı bir apartmanda oturuyor; her katta yalnızca bir kişi oturuyor. 1. kat en alttaki, 5. kat en üstteki kattır.',
      'Arda, Begüm’ün bir üst katında oturuyor.',
      'Cansu, Arda’dan daha üst bir katta oturuyor.',
      'Efe, Begüm’den daha alt bir katta oturuyor.',
      'Doruk 1. katta oturmuyor.',
    ],
    question: 'Buna göre hangisi kesinlikle doğrudur?',
    options: [
      'Arda 3. katta oturuyor.',
      'Doruk, Cansu’dan daha üst bir katta oturuyor.',
      'Efe 1. katta oturuyor.',
      'Begüm, Arda’dan daha üst bir katta oturuyor.',
      'Cansu en üst katta oturuyor.',
    ],
    answer: 3,
    lure: 5,
    why: 'Bilgilere uyan üç yerleşimin ikisinde Cansu en üst kattadır ama birinde Doruk oradadır.',
  },
  {
    key: 'sz23',
    level: 5,
    type: 'classification',
    stem: ['tohum', 'yumurta', 'tomurcuk'],
    options: ['ağaç', 'tırtıl', 'kelebek', 'yaprak', 'tavuk'],
    answer: 2,
    lure: 3,
    why: 'Kelebek tırtılın dönüştüğü şeydir; gruptakiler ise henüz gelişip başka bir şeye dönüşecek olanlardır.',
  },
  {
    key: 'sz24',
    level: 5,
    type: 'deduction',
    stem: ['Hiçbir böceğin kemiği yoktur.', 'Bütün arılar böcektir.', 'Bazı uçan hayvanların kemiği vardır.'],
    options: [
      'Arıların kemiği vardır.',
      'Bazı uçan hayvanlar böcektir.',
      'Bütün uçan hayvanların kemiği vardır.',
      'Hiçbir arı uçamaz.',
      'Bazı uçan hayvanlar arı değildir.',
    ],
    answer: 5,
    lure: 2,
    why: 'Bazı uçan hayvanların böcek olduğu gerçek hayatta doğrudur ama verilen bilgilerden çıkmaz.',
  },
];

const PRACTICE: VerbalPracticeItem[] = [
  {
    key: 'szp1',
    level: 1,
    type: 'analogy',
    stem: ['ayak', 'ayakkabı', 'el'],
    options: ['parmak', 'eldiven', 'çorap', 'kalem', 'tırnak'],
    answer: 2,
    explain: 'Ayakkabı ayağa giyilir. Ele giyilen şey de eldivendir. Parmak elin bir parçasıdır, ele giyilmez; çorap ise ayağa giyilir.',
  },
  {
    key: 'szp2',
    level: 1,
    type: 'classification',
    stem: ['aslan', 'kaplan', 'zürafa'],
    options: ['kartal', 'yılan', 'zebra', 'balık', 'orman'],
    answer: 3,
    explain:
      'Aslan, kaplan ve zürafa dört ayaklı yabani hayvanlardır; zebra da öyledir. Kartal ve yılan da yabani hayvandır ama dört ayaklı değildir: gruba yalnızca bir yönüyle benzerler.',
  },
  {
    key: 'szp3',
    level: 1,
    type: 'ordering',
    stem: ['Mavi kutu, kırmızı kutudan ağırdır.', 'Kırmızı kutu, sarı kutudan ağırdır.'],
    question: 'En hafif kutu hangisidir?',
    options: ['Mavi kutu', 'Kırmızı kutu', 'Sarı kutu', 'Üç kutu aynı ağırlıktadır', U],
    answer: 3,
    explain:
      'Ağırdan hafife sıralarsak: mavi, kırmızı, sarı. En hafif kutu sarı kutudur. Bazı sorularda bilgiler cevabı bulmaya yetmez; o zaman “Bu bilgilerle bilinemez” seçeneğini seçersin.',
  },
  {
    key: 'szp4',
    level: 1,
    type: 'deduction',
    stem: ['Bütün kuşların tüyü vardır.', 'Maviş bir kuştur.'],
    options: ['Maviş şarkı söyler.', 'Maviş bir kedidir.', 'Bütün hayvanların tüyü vardır.', 'Maviş’in tüyü vardır.', 'Maviş’in rengi mavidir.'],
    answer: 4,
    explain:
      'Bütün kuşların tüyü vardır ve Maviş bir kuştur; öyleyse Maviş’in tüyü vardır. Maviş’in şarkı söylemesi ya da mavi olması olabilir ama bilgilerden kesin olarak çıkmaz. Gerçek hayatta doğru olsa bile, bilgilerden çıkmayan bir cümle doğru cevap değildir.',
  },
];

export const VERBAL_SPECS: readonly Spec[] = SPECS;

const verbal: VerbalReasoningTask = {
  key: 'sozel-akil-yurutme',
  kind: 'verbal_reasoning',
  name: 'Sözel Akıl Yürütme',
  measures:
    'Kelimeler arasındaki ilişkileri bulmayı, kelimeleri gruplamayı, karşılaştırmalardan sıralama kurmayı ve verilen bilgilerden kesin sonuç çıkarmayı (sözcüklerle akıl yürütme) ölçer.',
  instructions: [
    'Her soruda beş seçenek göreceksin; yalnızca biri doğrudur. Dört tür soru var: kelime ilişkileri, sınıflama, sıralama ve mantıksal çıkarım. Her sorunun üstünde ne yapacağın yazar.',
    `Sıralama ve mantıksal çıkarım sorularında yalnızca verilen bilgileri kullan; bilgiler gerçeğe uymasa bile doğruymuş gibi düşün. Bilgiler cevabı bulmaya yetmiyorsa “${U}” seçeneğini seç.`,
    'Sorular kolaydan zora doğru gider; sona doğru zorlanman olağandır. Süre sınırı yok; kâğıt ve kalem kullanabilirsin. Emin olamadığında sana en uygun gelen seçeneği seç.',
    'Önce her soru türünden birer tane olmak üzere, doğru cevabı gösterilen dört alıştırma sorusu çözeceksin.',
  ],
  practice: PRACTICE,
  items: SPECS.map(({ key, level, type, stem, question, options }): VerbalItem => ({ key, level, type, stem, ...(question ? { question } : {}), options })),
  answers: SPECS.map((s) => s.answer),
  lures: SPECS.map((s) => s.lure),
  levels: [
    {
      level: 1,
      name: '1. düzey',
      plain: 'Bir hayvanın barınağı gibi çok bilinen bir ilişkiyi ve meyveler gibi tanıdık bir grubu bulmak, sırayla verilen karşılaştırmalardan bir sıralama kurmak ve tek adımlı bir çıkarım yapmak.',
    },
    {
      level: 2,
      name: '2. düzey',
      plain: 'Bir aletin işini ya da bir mesleğin çalışma yerini bulmak, aletler gibi bir grubu tanımak, karışık sırayla verilen karşılaştırmaları birleştirmek ve “her … gün” biçiminde verilen bir kuralı uygulamak.',
    },
    {
      level: 3,
      name: '3. düzey',
      plain: 'Bir parçanın ait olduğu bütünü bulmak (ör. gün ve hafta), kar ve yağmur gibi yağışları ya da kitap ve gazete gibi okunan yazıları bir grupta toplamak, birden çok sıralamaya uyan bilgilerden kesin olanı seçmek ve gerçekte doğru olmayan bir bilgiyi doğru sayıp sonuç çıkarmak.',
    },
    {
      level: 4,
      name: '4. düzey',
      plain: 'Bir şeyin en hafif ve en güçlü hâlini başka bir şeye uygulamak, aynı işi yapanları (ör. bir şeyi durduranları) bir grupta toplamak, sıralamada adı hiç geçmeyen birinin yerini bulmak, bilgilerin cevaba yetmediğini fark etmek ve bir kuralın sonucu gerçekleşmediğinde bundan ne çıktığını bulmak.',
    },
    {
      level: 5,
      name: '5. düzey',
      plain: 'Bir şeyin neyi önlediği gibi soyut ilişkileri ve gelişip başka bir şeye dönüşenler gibi soyut grupları bulmak, birden çok sıralamaya uyan bilgilerden (ör. kimin hangi katta oturduğu) kesin olanı seçmek ve iki ya da üç bilgiyi birleştirerek “hiçbir”, “bütün” ve “bazı” içeren çıkarımlar yapmak.',
    },
  ],
};

export const sozelAkilYurutme: TaskInstrument = {
  slug: 'sozel-akil-yurutme',
  version: 1,
  engine: 'tasks',
  name: 'Sözel Akıl Yürütme',
  shortName: 'Sözel akıl yürütme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 15,
  sortOrder: 49.7,
  tagline:
    'Kelimeler arasındaki ilişkileri bulmayı, kelimeleri gruplamayı, karşılaştırmalardan sıralama kurmayı ve verilen bilgilerden kesin sonuç çıkarmayı, yani sözcüklerle akıl yürütebilmeyi ölçer.',
  description:
    'Bu test, akıl yürütmeyi sözcüklerle ölçen dört tür sorudan oluşur: kelime ilişkileri, sınıflama, sıralama ve mantıksal çıkarım. Her soruda beş seçenek vardır ve yalnızca biri doğrudur. Sorular kolaydan zora doğru beş düzeyde ilerler ve Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi soru türlerinin daha kolay geldiğini, yanlış cevapların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Doğru seçeneği bul',
    paragraphs: [
      'Birazdan dört tür soru göreceksin: kelimeler arasındaki ilişkiyi bulma, kelimeleri gruplama, sıralama ve verilen bilgilerden sonuç çıkarma. Her soruda beş seçenekten doğru olanı seçeceksin.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler. Süre sınırı yok. Yanında kâğıt ve kalem bulunsun.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'sz_dogru', name: 'Doğru cevaplar', plain: 'Doğru seçeneğin seçildiği soruların sayısı.' },
    { key: 'sz_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'sz_tur', name: 'Soru türleri', plain: 'Kelime ilişkileri, sınıflama, sıralama ve mantıksal çıkarım sorularından hangilerinin daha kolay, hangilerinin daha zor geldiği.' },
    { key: 'sz_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [verbal],
  science: {
    basedOn:
      'Akıl yürütmeyi sözcüklerle ölçmek için sık kullanılan dört soru türü: kelime ilişkileri (benzetme), sınıflama, sıralama ve mantıksal çıkarım. Sorular Ölçekhane tarafından özgün olarak yazılmıştır; ticari testlerin soruları, puanlama kuralları ya da normları kullanılmaz. Kelimeler çoğunlukla günlük kelimelerden seçilmiştir; zorluk asıl olarak ilişkinin ve çıkarımın zorluğundan gelir.',
    whatItMeasures:
      'Sözcüklerle akıl yürütmeyi, yani kelimeler arasındaki ilişkileri ve verilen bilgiler arasındaki bağlantıları kullanarak sonuca ulaşabilmeyi ölçer. Kelime ilişkileri ve sınıflama sorularında iki ya da üç kelimenin ortak yönünü bulup başka bir kelimeye uygulamak; sıralama ve mantıksal çıkarım sorularında birkaç bilgiyi birleştirip kesin olanı yalnızca olası olandan ayırmak gerekir. Şekil ve renklerle kurulan benzetme sorularıyla çocuklarla yapılan bir çalışmada, üçüncü öğeyle şekil ya da renk bakımından ortak bir özelliği olan yanlış seçeneklerin sık seçildiği, 14 yaşındakilerin ise bu seçeneklerden çok daha az etkilendiği görülmüş; bu durum yürütücü işlevlerin yaşla gelişmesiyle açıklanmıştır (Thibaut, French ve Vezneva, 2010). Bu testteki kelime sorularında da çeldiriciler, üçüncü kelimeyle ilgili ama aynı ilişkiyi kurmayan kelimelerdir. Yetişkinler de inandırıcı buldukları sonuçları, verilen bilgilerden çıkmasalar bile kabul etmeye yatkındır (inanç yanlılığı); bu etki sonuç bilgilerden çıkmadığında daha belirgindir, ama bilgilerden neyin çıktığı da kararı güçlü biçimde etkiler (Evans, Barston ve Pollard, 1983). Bu yüzden testte her sorunun bir seçeneği, ilk bakışta doğru görünen ama sorudaki bilgilerin hepsine uymayan bir seçenektir; raporda yanlışların ne kadarının bu seçenekler olduğu anlatılır.',
    turkishVersion: 'Özgün test. Sorular Türkçe yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sorular, ilişkinin ve çıkarımın zorluğuna göre kolaydan zora beş düzeye ayrılmıştır; bu sıralama Ölçekhane’nin tasarımıdır ve soruların gerçek zorluk sırası henüz veriyle denetlenmedi. Sıralama ve mantıksal çıkarım sorularının tek doğru cevabı olduğu, verilen bilgilere uyan bütün olasılıkları tek tek deneyen bir bilgisayar programıyla denetlenmiştir. Kelime ilişkileri ve sınıflama sorularında böyle bir program kullanılamadığı için sorular cevap anahtarı görülmeden ayrı ayrı çözülerek ve her seçenek için savunulabilir bir gerekçe aranarak denetlenmiştir; bu soruların uzmanlarca incelenmesi henüz yapılmadı.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ve hangi soru türlerinde ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Akıl yürütme becerisi çocuklukta hızla, gençlikte daha yavaş gelişir; gençlik yıllarının sonuna doğru artık pek değişmez (Ferrer, O’Hare ve Bunge, 2009). Sözel sorularda kelime bilgisi ve okuma rahatlığı da rol oynar. Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Soruları okuyabilmek gerekir; 3. ve 4. sınıflarda uzun sıralama ve çıkarım sorularında zorlanmak beklenen bir durumdur. Telefonla da çözülebilir; yanında kâğıt ve kalem bulunması önerilir.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Akıl yürütmenin yalnızca sözcüklerle yapılan yönünü ölçer; sonuç kelime bilgisi ve okuma rahatlığıyla da ilişkilidir. Şekillerle ve sayılarla akıl yürütme, bellek ve hız gibi öteki beceriler hakkında bilgi vermez.',
      'Her soru türü altı soruya dayanır; türler arasındaki karşılaştırma kaba bir göstergedir.',
      'Sonuç; o günkü yorgunluk, isteklilik ve dikkatten etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Thibaut, J.-P., French, R. ve Vezneva, M. (2010). The development of analogy making in children: Cognitive load and executive functions. Journal of Experimental Child Psychology, 106(1), 1–19.',
        url: 'https://doi.org/10.1016/j.jecp.2010.01.001',
      },
      {
        text: 'Evans, J. St. B. T., Barston, J. L. ve Pollard, P. (1983). On the conflict between logic and belief in syllogistic reasoning. Memory & Cognition, 11(3), 295–306.',
        url: 'https://doi.org/10.3758/BF03196976',
      },
      {
        text: 'Ferrer, E., O’Hare, E. D. ve Bunge, S. A. (2009). Fluid reasoning and the developing brain. Frontiers in Neuroscience, 3(1), 46–51.',
        url: 'https://doi.org/10.3389/neuro.01.003.2009',
      },
    ],
  },
};
