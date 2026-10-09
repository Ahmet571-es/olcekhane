import type { Fold, Pt } from './folding';
/**
 * Test tanımları için ortak türler.
 *
 * Testlerin kaynağı koddur: maddeler, puanlama anahtarları ve bilim kartları burada sürümlü olarak
 * tutulur. Bir tanım değiştiğinde (madde, anahtar ya da puanlama) sürüm numarası artırılmalıdır.
 */

export type Domain = 'personality' | 'career' | 'academic' | 'reading' | 'cognitive' | 'wellbeing' | 'skills';
/**
 * draft: hazırlanıyor, sitede yok · review: uzman incelemesinde; yalnızca doğrudan bağlantıyla açılır, listelerde ve
 * site haritasında yer almaz, arama motorlarına kapalıdır · pilot / active: yayında · retired: kullanımdan kalktı.
 */
export type InstrumentStatus = 'draft' | 'review' | 'pilot' | 'active' | 'retired';
export type LicenseStatus =
  | 'public_domain'
  | 'open_license'
  | 'permission_granted'
  | 'permission_pending'
  | 'original';

export type Band = 'very_low' | 'low' | 'average' | 'high' | 'very_high';
export const BANDS: Band[] = ['very_low', 'low', 'average', 'high', 'very_high'];

export interface Citation {
  text: string;
  url?: string;
}

/** Her testin sayfasında ve raporunda gösterilen "bilim kartı". */
export interface ScienceCard {
  basedOn: string;
  whatItMeasures: string;
  turkishVersion: string;
  reliability: string;
  normStatus: 'none' | 'provisional' | 'final';
  normNote: string;
  ageNote: string;
  license: string;
  licenseUrl?: string;
  limitations: string[];
  citations: Citation[];
}

export interface ScaleDef {
  key: string;
  name: string;
  /** Tek cümlelik, çocuğun ve velinin anlayacağı tanım. */
  plain: string;
  /** Ölçeğin iki ucu: düşük ve yüksek puanın gündelik dildeki karşılığı. */
  poles?: { low: string; high: string };
  /** Grafikte adın yerine gösterilen kısa ad (ör. kişilerarası çemberde "Sıcak"). */
  short?: string;
  /** Kişilerarası çemberdeki yeri (derece; 0 = sağ, 90 = üst, saat yönünün tersine artar). */
  angle?: number;
  /** Kaynak çalışmada bildirilen iç tutarlılık (Cronbach α); ölçüm payını hesaplamak için. */
  alpha?: number;
  /** Ortalama puan ölçeğinde başvuru standart sapması; ölçüm payını hesaplamak için. */
  sdRef?: number;
  /**
   * Bileşik ölçek: puanı, listelenen ölçeklerin bütün maddelerinden hesaplanır (ör. bir kişilik boyutu,
   * alt özelliklerinin maddelerinden). Bileşik ölçeğe doğrudan madde bağlanmaz.
   */
  of?: string[];
}

export interface LikertOption {
  value: number;
  label: string;
}

export interface LikertItemDef {
  key: string;
  text: string;
  scale: string;
  /**
   * Kaynaktaki anahtarda madde birden çok ölçekte yer alıyorsa öteki ölçekler (ör. hobi ölçeklerinde "Şiir yazmak"
   * hem yaratıcı etkinliklerde hem yazma ölçeğinde). Madde bir kez sorulur, her ölçeğin puanına katılır.
   */
  alsoScales?: string[];
  reverse?: boolean;
  /** Özgün madde metni (çeviri denetimi için belgelenir, kullanıcıya gösterilmez). */
  source?: string;
}

/**
 * Norm yokken puanı ölçeğin kendi aralığına göre yorumlama eşikleri.
 * Değerler madde ortalaması (ya da toplam puan) ölçeğindedir, alt sınır dahildir.
 */
export interface AnchoredBands {
  basis: 'mean' | 'sum';
  thresholds: { band: Band; min: number }[];
}

interface InstrumentBase {
  slug: string;
  version: number;
  name: string;
  shortName: string;
  domain: Domain;
  status: InstrumentStatus;
  licenseStatus: LicenseStatus;
  isFree: boolean;
  minGrade: number;
  maxGrade: number;
  /**
   * Yetişkinler de (18 yaş ve üzeri) kendileri için çözebilir: çözme sayfasında "Yetişkinim" seçeneği çıkar ve
   * yetişkine öğrenci ve veli raporu yerine tek, kişisel rapor hazırlanır (rapor şablonundaki `adult` metinleri,
   * yoksa öğrenci metinleri). Yalnızca maddeleri ve rapor metinleri yetişkinlere de uyan testlerde açılır.
   */
  adults?: boolean;
  estimatedMinutes: number;
  /** Katalogda tek satırlık açıklama. */
  tagline: string;
  /** Test tanıtım sayfasındaki giriş paragrafı. */
  description: string;
  /** Öğrenciye test başında gösterilen yönerge. */
  intro: { title: string; paragraphs: string[] };
  scales: ScaleDef[];
  science: ScienceCard;
  sortOrder: number;
}

export interface LikertInstrument extends InstrumentBase {
  engine: 'likert';
  /**
   * Özel rapor düzeni. "riasec": ilgi profili (altıgen grafik, ilgi kodu, meslek örnekleri).
   * "interests": sıralı ilgi profili (alanlar en yüksekten en düşüğe; en belirgin alanların açıklaması).
   * "facets": ayrıntılı profil (bileşik ölçekler genel bakışta; her birinin altında alt ölçeklerin cetvelleri).
   * "circumplex": kişilerarası çember (ölçekler `angle` açılarıyla bir çember üzerinde; her biri için düzey metni).
   * "activities": sıralı etkinlik profili (serbest zaman alanları, etkinliklerin ne sıklıkla yapıldığına göre en sıktan
   * en seyreğe; en çok zaman ayrılan alanların açıklaması).
   * "motivation": motivasyon haritası (iki bileşik ölçek, ör. kendi isteğiyle ve baskıyla çalışma, bir düzlemde; profil adı
   * ve yorumu) ve bileşik ölçeklerin altında alt ölçeklerin cetvelleri; metinler rapor şablonunun `motivation` alanındadır.
   * "values": sıralı değer profili (bir işte neyin ne kadar önemli olduğu, en önemliden en az önemliye; en önemli
   * değerlerin açıklaması, birbirine ters yönde çekebilen değerler ve daha az önem verilenler; metinler rapor şablonunun
   * `values` alanındadır). Çoğu kişi birçok değeri önemli bulduğu için asıl bilgi kişinin kendi içindeki sıralamadır.
   * Verilmezse her ölçek için cetvel ve düzey metni gösterilir.
   */
  profile?: 'riasec' | 'interests' | 'facets' | 'circumplex' | 'activities' | 'motivation' | 'values';
  prompt: string;
  options: LikertOption[];
  items: LikertItemDef[];
  scoring: {
    method: 'mean' | 'sum';
    /** Bir ölçek puanı hesaplanabilmesi için cevaplanması gereken en az madde oranı. */
    minAnsweredRatio: number;
  };
  anchoredBands: AnchoredBands;
  /** Toplam puan da hesaplanacaksa (ör. öz-saygı tek boyutludur). */
  totalScale?: string;
  /**
   * Birbirinin tersini söyleyen madde çiftleri (aynı ölçekte, biri düz biri ters yönlü). Çiftlerin çoğuna aynı uç cevap
   * verilirse (ikisine de en yüksek ya da ikisine de en düşük seçenek; beş ya da daha çok seçenekte uçtaki iki seçenek)
   * cümlelerin içeriğinden bağımsız olarak katılma ya da katılmama eğilimi düşünülür ve raporda uyarı gösterilir
   * (lib/scoring/likert.ts, likertQuality). Bu eğilim çocuklarda daha belirgindir (Soto ve ark., 2008).
   */
  oppositePairs?: [string, string][];
}

export interface ReadingQuestion {
  key: string;
  text: string;
  options: { key: string; text: string }[];
  answer: string;
  /** Sorunun ölçtüğü beceri. */
  skill: 'literal' | 'inference' | 'vocabulary' | 'main_idea';
}

export interface ReadingPassage {
  key: string;
  title: string;
  /** Hangi sınıf düzeyleri için. */
  minGrade: number;
  maxGrade: number;
  paragraphs: string[];
  questions: ReadingQuestion[];
}

export interface ReadingInstrument extends InstrumentBase {
  engine: 'reading';
  passages: ReadingPassage[];
  /** Sınıf düzeyine göre başvuru okuma hızları (dakikada kelime), yalnızca yayımlanmış Türkiye verisi. */
  referenceRates: { grade: number; wpm: number; sd?: number; source: string; mode: 'oral' | 'silent' }[];
}

/* ---------- Sesli okuma ---------- */

/**
 * Sesli okuma metninin bir sorusu (metin kapandıktan sonra, çoktan seçmeli). 1–2. sınıfta üç, üst sınıflarda dört
 * seçenek vardır.
 */
export interface OralQuestion {
  key: string;
  text: string;
  options: { key: string; text: string }[];
  answer: string;
  skill: ReadingQuestion['skill'];
}

/** Yeniden anlatmada söylenmesi beklenen anlam birimi; `core`, metni anlamış birinin mutlaka söyleyeceği temel fikir. */
export interface OralIdea {
  key: string;
  text: string;
  core: boolean;
}

export interface OralPassage {
  /** Benzersiz anahtar: "g<sınıf>-" ile başlar. */
  key: string;
  /** Metnin yazıldığı sınıf düzeyi. */
  grade: number;
  genre: 'narrative' | 'informational';
  title: string;
  paragraphs: string[];
  questions: OralQuestion[];
  ideas: OralIdea[];
}

/**
 * Sesli okuma değerlendirmesi: öğrenci sınıf düzeyindeki bir metni sesli okur (ses yalnızca cihazda kaydedilir),
 * metni kendi cümleleriyle anlatır ve soruları cevaplar; bir yetişkin kaydı dinleyerek okuma hatalarını işaretler,
 * anlatmada söylenen fikirleri ve okumanın akıcılığını değerlendirir.
 */
export interface OralReadingInstrument extends InstrumentBase {
  engine: 'oral';
  passages: OralPassage[];
  /**
   * Sınıf düzeyine göre başvuru sesli okuma hızları, yalnızca yayımlanmış Türkiye verisi: dakikada doğru okunan
   * kelimenin ortalaması (`wpm`) ve standart sapması (`sd`).
   */
  referenceRates: { grade: number; wpm: number; sd: number; source: string }[];
}

/* ---------- Bilişsel görevler ---------- */

export type TaskKind =
  | 'digit_span'
  | 'spatial_span'
  | 'flanker'
  | 'symbol_match'
  | 'cancellation'
  | 'color_word'
  | 'go_nogo'
  | 'trail'
  | 'n_back'
  | 'mental_rotation'
  | 'reaction_time'
  | 'matrix_reasoning'
  | 'number_series'
  | 'verbal_reasoning'
  | 'vocabulary'
  | 'rule_switch'
  | 'word_list'
  | 'paper_folding';

interface TaskBase {
  /** Görevin anahtarı: tarayıcının gönderdiği denemeler bu anahtarla gelir. */
  key: string;
  kind: TaskKind;
  name: string;
  /** Öğrenciye gösterilen kısa açıklama. */
  measures: string;
  instructions: string[];
}

/** Sayı dizisi: ileri ya da geri tekrar. Her uzunlukta iki deneme; ikisi de yanlışsa görev biter. */
export interface DigitSpanTask extends TaskBase {
  kind: 'digit_span';
  direction: 'forward' | 'backward';
  /** Her rakamın ekranda kalma ve aradaki boşluk süreleri (ms). */
  onMs: number;
  offMs: number;
  /** Geri bildirimli alıştırma dizisi (puanlanmaz). */
  practice: number[];
  /** İlk test dizisinin uzunluğu; sequences[i] bu uzunluk + i rakamlık iki diziyi içerir. */
  startLength: number;
  sequences: number[][][];
}

/** Kutu dizisi: ekrandaki kutuların yanma sırasını tekrar etme (görsel-uzamsal bellek). */
export interface SpatialSpanTask extends TaskBase {
  kind: 'spatial_span';
  onMs: number;
  offMs: number;
  /** Kutuların konumları (0–100 arası yüzde koordinatlar). */
  boxes: { x: number; y: number }[];
  practice: number[];
  startLength: number;
  sequences: number[][][];
}

/** Ok görevi: ortadaki okun yönünü, kenardaki oklara aldırmadan bildirme (seçici dikkat). */
export interface FlankerTask extends TaskBase {
  kind: 'flanker';
  fixationMs: number;
  timeoutMs: number;
  itiMs: [number, number];
  practice: { dir: 'L' | 'R'; congruent: boolean }[];
  trials: { dir: 'L' | 'R'; congruent: boolean }[];
}

/** Sembol eşleştirme: anahtardaki sembole karşılık gelen rakamı olabildiğince hızlı bulma (işlem hızı). */
export interface SymbolMatchTask extends TaskBase {
  kind: 'symbol_match';
  durationMs: number;
  /** Sembol anahtarları (1–9 rakamlarına eşlenir, sırayla). */
  symbols: string[];
  practice: number[];
  /** Gösterilecek sembollerin sırası (0–8, anahtardaki sıra). */
  sequence: number[];
}

/**
 * Harf işaretleme (Burdon tipi sürekli dikkat görevi): süreli bölümlerde, satır satır dizilmiş harfler
 * arasında aranan harfler işaretlenir. Harf sayfaları her uygulama için uygulama kimliğinden
 * belirlenimci olarak üretilir (src/lib/instruments/cancellation.ts): öğrenci sayfayı ezberleyemez,
 * sunucu aynı sayfayı yeniden üretip puanlar. Her bölümde hedef sayısı ve harflerin dağılımı aynıdır.
 */
export interface CancellationTask extends TaskBase {
  kind: 'cancellation';
  /** Aranan harfler. */
  targets: string[];
  /** Çeldirici harfler (aranan harflere benzeyen işaretli harfler, ör. ğ, bilerek dışarıda bırakılır). */
  distractors: string[];
  /** Satırdaki harf sayısı. */
  columns: number;
  /** Bir bölümdeki satır sayısı; kimse süre bitmeden bitiremesin diye uzun tutulur. */
  rows: number;
  /** Satır başına hedef sayısı: her değer eşit sayıda satırda kullanılır (ortalaması sabit kalır). */
  targetsPerRow: number[];
  sections: number;
  sectionMs: number;
  /** Alıştırma satırları (sabit, puanlanmaz). */
  practice: string[][];
  /** Sayfa üretim kuralının sürümü; kural değişirse test sürümü de artırılmalı. */
  generator: 1;
}

/**
 * Renk-kelime görevi (Stroop düzeni): renk adları farklı renklerde yazılır; kelimenin anlamına değil, yazının
 * rengine göre cevap verilir. Kelimeyle rengin aynı olduğu (uyumlu) ve farklı olduğu (uyumsuz) denemeler eşit
 * sayıdadır. Deneme sırası sabittir (tohumla üretilir): herkes aynı denemeleri görür.
 */
export interface ColorWordTask extends TaskBase {
  kind: 'color_word';
  /** Renkler: ad (kelime olarak da yazılır) ve yazı rengi. Sıra, cevap düğmelerinin sırasıdır. */
  colors: { name: string; ink: string }[];
  fixationMs: number;
  timeoutMs: number;
  itiMs: [number, number];
  /** Denemeler bu kadar eşit bölüme ayrılır; bölümler arasında kısa mola verilir. */
  blocks: number;
  /**
   * Renk denemesi (alıştırmadan önce): kelime olmadan yalnızca renkli bir şerit gösterilir ve aynı düğmelerle rengi
   * bulunur. Değerler `colors` içindeki sıradır. Tarayıcı bu denemeleri, asıl denemelerden sonra gelen sıra
   * numaralarıyla (trials.length + k) gönderir; puana katılmaz, yalnızca rapordaki uyarı için kullanılır.
   */
  check: number[];
  /** Renk denemesinde bu kadar ya da daha çok yanlış cevap, renklerin bu ekranda ayırt edilmekte zorlanıldığını düşündürür. */
  checkLimit: number;
  /** Alıştırma denemeleri (geri bildirimli, puanlanmaz): kelime ve yazı renginin `colors` içindeki sırası. */
  practice: { word: number; ink: number }[];
  trials: { word: number; ink: number }[];
}

/**
 * Dur-git görevi (go/no-go düzeni): ekranda harfler art arda belirir; her harfte düğmeye basılır, yalnızca
 * durma harfinde basılmaz. Durma harfi denemelerin dörtte biridir; basma alışkanlığı oluştuğu için durmak çaba ister.
 */
export interface GoNoGoTask extends TaskBase {
  kind: 'go_nogo';
  /** Durma harfi (basılmaz). */
  stop: string;
  /** Uyaranın ekranda kalma süresi (ms). */
  stimulusMs: number;
  /** Cevap penceresi: uyaranın başlangıcından itibaren (ms). */
  responseMs: number;
  itiMs: [number, number];
  blocks: number;
  practice: { letter: string; go: boolean }[];
  trials: { letter: string; go: boolean }[];
}

/**
 * Sırayla birleştirme (iz sürme düzeni): ekrana dağılmış daireler sırayla dokunularak birleştirilir. Birinci
 * bölümde yalnızca sayılar (1, 2, 3…), ikinci bölümde sayılar ve harfler sırayla (1, A, 2, B…). Yerleşimler
 * Ölçekhane'nindir; konumlar 0–100 arası yüzde koordinatlardır. İki bölümün daire sayısı ve yol uzunluğu aynıdır.
 */
export interface TrailPart {
  key: 'a' | 'b';
  name: string;
  /** Dairelerin sırası: labels[i], sıradaki i. dairedir. */
  labels: string[];
  points: { x: number; y: number }[];
  practice: { labels: string[]; points: { x: number; y: number }[] };
}

export interface TrailTask extends TaskBase {
  kind: 'trail';
  parts: TrailPart[];
  /** Bir bölümün en uzun süresi (ms); süre dolunca bölüm biter. */
  maxMs: number;
  /** Yerleşim üretim kuralının sürümü; kural değişirse test sürümü de artırılmalı. */
  generator: 1;
}

/**
 * Geriye dönük hatırlama (n-geri düzeni): harfler sabit bir hızla art arda gösterilir; harf, n adım önceki harfle
 * aynıysa düğmeye basılır, değilse basılmaz. Bölümler sırayla yapılır (önce bir geri, sonra iki geri); her yeni n
 * düzeyinden önce geri bildirimli bir alıştırma vardır. Hedefler (n önceki harfle aynı) harflerden belirlenir:
 * tarayıcı yalnızca basılıp basılmadığını gönderir, doğruluk sunucuda hesaplanır.
 */
export interface NBackBlock {
  n: 1 | 2;
  /** Bölümdeki harfler, gösterilme sırasıyla. */
  letters: string[];
}

export interface NBackTask extends TaskBase {
  kind: 'n_back';
  /** Harfin ekranda kalma süresi (ms). */
  stimulusMs: number;
  /** Bir denemenin süresi: harfin belirmesinden bir sonraki harfin belirmesine kadar (ms); cevap penceresi de budur. */
  trialMs: number;
  /** Alıştırmalar (geri bildirimli, puanlanmaz): her n düzeyi için bir dizi; o düzeyin ilk bölümünden önce yapılır. */
  practice: NBackBlock[];
  /** Asıl bölümler, yapılma sırasıyla; denemeler bölümler boyunca 0'dan başlayarak numaralanır. */
  blocks: NBackBlock[];
}

/**
 * Zihinde döndürme: yan yana iki şekil gösterilir; sağdaki, soldakinin döndürülmüş hâli ya da döndürülmüş ayna
 * görüntüsüdür. "Aynı" ya da "Ayna görüntüsü" düğmesine basılır. Şekiller birim karelerden oluşan özgün şekillerdir;
 * hiçbirinin döndürme ya da ayna simetrisi yoktur (ayna görüntüsü, döndürülerek şeklin kendisi yapılamaz).
 */
export interface RotationShape {
  /** Karelerin ızgaradaki konumları (x sağa, y aşağı doğru). */
  cells: [number, number][];
}

export interface RotationTrial {
  /** Şeklin `shapes` içindeki sırası. */
  shape: number;
  /** Sağdaki şeklin döndürülme açısı (derece; artı saat yönünde). */
  angle: number;
  /** Sağdaki şekil soldakinin ayna görüntüsü mü (önce yansıtılır, sonra döndürülür)? */
  mirror: boolean;
}

export interface MentalRotationTask extends TaskBase {
  kind: 'mental_rotation';
  shapes: RotationShape[];
  /** Alıştırmada kullanılan, asıl görevde olmayan şekil. */
  practiceShape: RotationShape;
  /** Alıştırma denemeleri (geri bildirimli, puanlanmaz). */
  practice: { angle: number; mirror: boolean }[];
  trials: RotationTrial[];
  /** Denemeler bu kadar eşit bölüme ayrılır; bölümler arasında kısa mola verilir. */
  blocks: number;
  /** Cevap için en uzun süre (ms); şekiller bu süre boyunca ekranda kalır. */
  timeoutMs: number;
  itiMs: [number, number];
}

/**
 * Tepki hızı: kutuda bir daire belirince olabildiğince hızlı basılır. Basit bölümde tek kutu ve tek düğme; seçmeli
 * bölümde iki kutu, daire hangi kutuda belirirse o taraftaki düğmeye basılır. Daire, bir önceki tepkiden sonra
 * değişken bir beklemeyle belirir; daire belirmeden basmak o denemeyi geçersiz kılar.
 */
export interface ReactionTrial {
  /** Dairenin belirmesinden önceki bekleme (ms). */
  waitMs: number;
  /** Dairenin belirdiği kutu: 0 sol (basit bölümde tek kutu), 1 sağ. */
  box: number;
}

export interface ReactionPart {
  key: 'simple' | 'choice';
  /** Kutu sayısı. */
  boxes: 1 | 2;
  /** Alıştırma denemeleri (geri bildirimli, puanlanmaz). */
  practice: ReactionTrial[];
  trials: ReactionTrial[];
}

export interface ReactionTimeTask extends TaskBase {
  kind: 'reaction_time';
  /** Bölümler sırayla: önce basit, sonra seçmeli. Denemelerin sırası (index) bölümler boyunca birleşik sayılır. */
  parts: ReactionPart[];
  /** Daire belirdikten sonra tepki için en uzun süre (ms); daire bu süre boyunca kutuda kalır. */
  timeoutMs: number;
}

/**
 * Şekil akıl yürütme (matris düzeni): 3×3'lük bir tablonun sağ alttaki parçası eksiktir; tablodaki kuralı bulup eksik
 * parçayı sekiz seçenek arasından seçmek gerekir. Bir parça (hücre) şu düzenlerden birini taşır: aynı şekillerden bir
 * ya da birkaçı; büyük bir çerçeve ve içinde küçük bir şekil; çizgiler; ya da sekiz yuvalı bir halka ve halkadaki
 * noktalar (ortasında küçük bir şekil olabilir). Bütün sorular ve seçenekler Ölçekhane'nindir
 * (lib/instruments/matrix.ts).
 */
export type MatrixShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'cross' | 'arrow';
export type MatrixFill = 'empty' | 'gray' | 'black';
export type MatrixFrame = 'circle' | 'square' | 'triangle' | 'diamond';

export interface MatrixCell {
  /** Şekil: tek başına ya da (çerçeve ve halka düzenlerinde) ortadaki küçük şekil. */
  shape?: MatrixShape;
  /** Aynı şekillerden kaç tane (1–5); verilmezse 1. */
  count?: number;
  /** Büyüklük: 1 küçük, 2 orta, 3 büyük (yalnızca tek şekilli sorularda değişir). */
  size?: 1 | 2 | 3;
  fill?: MatrixFill;
  /** Okun yönü: derece, saat yönünde; 0 yukarı. */
  angle?: number;
  /** Dıştaki büyük çerçeve (içi boş). */
  frame?: MatrixFrame;
  /** Çizgiler: 0 üst, 1 sağ, 2 alt, 3 sol kenar, 4 sol üstten sağ alta, 5 sağ üstten sol alta çapraz, 6 ortadaki yatay, 7 ortadaki dikey. */
  lines?: number[];
  /** Halkadaki siyah noktaların yuvaları: 0 üstte, saat yönünde 0–7. */
  dots?: number[];
  /** Halkadaki gri noktaların yuvaları. */
  grayDots?: number[];
}

/**
 * Kural türleri (Carpenter, Just ve Shell, 1990): değişmeyen özellik, düzenli değişim (sayı, büyüklük, yön ya da yer
 * adım adım değişir), üçlü dağılım (üç değer her satırda birer kez), ekleme-çıkarma (üçüncü parça ilk ikisinin
 * birleşimi, farkı ya da toplamıdır), ortak olanın silinmesi (iki parçada da olan öğeler silinir, yalnızca birinde
 * olanlar kalır; "iki değerin dağılımı").
 */
export type MatrixRule = 'constant' | 'progression' | 'distribution' | 'addition' | 'xor';

export interface MatrixItem {
  key: string;
  /** Zorluk düzeyi (1–5): izlenmesi gereken kuralların sayısına ve türüne göre. */
  level: 1 | 2 | 3 | 4 | 5;
  /** Sorudaki en zor kural (raporda kural türlerine göre sonuçlar bununla hesaplanır). */
  rule: MatrixRule;
  /** Tablonun ilk sekiz parçası, satır satır; dokuzuncusu (sağ alttaki) eksiktir. */
  cells: MatrixCell[];
  /** Sekiz seçenek, ekranda gösterilme sırasıyla. */
  options: MatrixCell[];
}

export interface MatrixPracticeItem extends MatrixItem {
  /** Doğru seçeneğin sırası (1–8). Alıştırma puanlanmadığı için tarayıcıya gider. */
  answer: number;
  /** Cevaptan sonra gösterilen açıklama. */
  explain: string;
}

export interface MatrixReasoningTask extends TaskBase {
  kind: 'matrix_reasoning';
  /** Geri bildirimli alıştırma soruları (puanlanmaz). */
  practice: MatrixPracticeItem[];
  /** Asıl sorular, kolaydan zora. */
  items: MatrixItem[];
  /**
   * Cevap anahtarı: items[i] sorusunun doğru seçeneğinin sırası (1–8). Puanlama sunucuda yapılır; tarayıcıya giden
   * test bilgisinde bu liste boş gönderilir (testler/[slug]/coz).
   */
  answers: number[];
  /**
   * Her sorunun her seçeneğinin doğru cevaptan kaç özellikte ayrıldığı (0–3; doğru cevapta 0). Yanlış cevapların
   * "yakın" (tek özellikte ayrılan) olup olmadığı raporda bununla anlatılır. Cevap anahtarını içerdiği için o da
   * tarayıcıya boş gönderilir.
   */
  optionDistance: number[][];
  /** Zorluk düzeylerinin adları ve kısa açıklamaları (raporda). */
  levels: { level: number; name: string; plain: string }[];
  /** Düzeyi 3 ve üstündeki sorularda bu süreden (ms) kısa cevaplar "çok hızlı" sayılır: soruya bakmadan seçilmiş olabilir. */
  rapidMs: number;
}

/**
 * Sayı dizileri: bir kurala göre ilerleyen sayı dizisinin eksik sayısını (çoğunlukla sonuncusunu, bazen ortadakini)
 * bulmak. Cevap ekrandaki tuş takımıyla yazılır; "Bilmiyorum" da denebilir (yanlış sayılır). Bütün sorular
 * Ölçekhane'nindir (content/instruments/sayi-dizileri.ts).
 *
 * Kural türleri: sabit artış ya da azalış (her adımda aynı sayıyı ekleme ya da çıkarma), çarpma ve bölme (her adımda aynı
 * sayıyla çarpma ya da bölme), değişen artış (artışların kendisi düzenli büyür ya da küçülür), iç içe diziler (sırayla
 * değişen iki işlem ya da iç içe geçmiş iki dizi), birleşik kurallar (iki adımlı kurallar, önceki iki ya da üç sayının
 * toplamı, artışların kendi kuralı olan bir dizi oluşturması).
 */
export type NumberSeriesRule = 'step' | 'ratio' | 'growing' | 'alternating' | 'combined';

export interface NumberSeriesItem {
  key: string;
  /** Zorluk düzeyi (1–5): kuralın türüne ve izlenmesi gereken adım sayısına göre. */
  level: 1 | 2 | 3 | 4 | 5;
  rule: NumberSeriesRule;
  /** Dizinin sayıları; eksik olan (bulunacak) sayının yerinde `null` vardır (tam bir tane). */
  terms: (number | null)[];
}

export interface NumberSeriesPracticeItem extends NumberSeriesItem {
  /** Eksik sayı. Alıştırma puanlanmadığı için tarayıcıya gider. */
  answer: number;
  /** Cevaptan sonra gösterilen açıklama. */
  explain: string;
}

export interface NumberSeriesTask extends TaskBase {
  kind: 'number_series';
  practice: NumberSeriesPracticeItem[];
  /** Asıl sorular, kolaydan zora. */
  items: NumberSeriesItem[];
  /** Cevap anahtarı: items[i] sorusunun eksik sayısı. Tarayıcıya giden test bilgisinde boş gönderilir (testler/[slug]/coz). */
  answers: number[];
  /**
   * Her sorunun "basit kural tuzakları": dizinin yalnızca bir bölümüne uyan daha basit bir kuralla bulunan yanlış
   * cevaplar (ör. artış büyürken son artışı sürdürmek). Yanlış cevapların ne kadarının böyle olduğu raporda anlatılır.
   * Tarayıcıya boş gönderilir.
   */
  traps: number[][];
  levels: { level: number; name: string; plain: string }[];
  /** Düzeyi 3 ve üstündeki sorularda bu süreden (ms) kısa cevaplar "çok hızlı" sayılır: diziye bakmadan yazılmış olabilir. */
  rapidMs: number;
  /** Cevabın en çok kaç basamaklı olabileceği (tuş takımı bundan uzun sayı yazdırmaz). */
  maxDigits: number;
}

/**
 * Sözel akıl yürütme: dört soru türü (Ölçekhane'nin özgün soruları, content/instruments/sozel-akil-yurutme.ts).
 *  - Kelime ilişkileri (`analogy`): iki kelime arasındaki ilişkiyi bulup üçüncü kelimeyle aynı ilişkiyi kuran kelimeyi seçmek.
 *  - Sınıflama (`classification`): üç kelimenin ortak özelliğini bulup bu özelliği taşıyan kelimeyi seçmek.
 *  - Sıralama (`ordering`): karşılaştırmaları birleştirip bir sıralama kurmak; bilgiler yetmiyorsa bunu fark etmek.
 *  - Mantıksal çıkarım (`deduction`): verilen bilgilerden kesinlikle çıkan cümleyi "olabilir" olanlardan ayırmak.
 */
export type VerbalItemType = 'analogy' | 'classification' | 'ordering' | 'deduction';

export interface VerbalItem {
  key: string;
  /** Zorluk düzeyi (1–5). */
  level: 1 | 2 | 3 | 4 | 5;
  type: VerbalItemType;
  /**
   * Kelime ilişkilerinde üç kelime (ilk ikisi örnek çift, üçüncüsü eksik çiftin ilk kelimesi); sınıflamada gruptaki üç
   * kelime; sıralama ve mantıksal çıkarımda verilen bilgiler (her biri bir cümle).
   */
  stem: string[];
  /** Sıralama sorularının sorusu (ör. "En yavaş koşan kimdir?"); öteki türlerde soru türün sabit yönergesidir. */
  question?: string;
  /** Beş seçenek. */
  options: string[];
}

export interface VerbalPracticeItem extends VerbalItem {
  /** Doğru seçeneğin sırası (1–5). Alıştırma puanlanmadığı için tarayıcıya gider. */
  answer: number;
  /** Cevaptan sonra gösterilen açıklama. */
  explain: string;
}

export interface VerbalReasoningTask extends TaskBase {
  kind: 'verbal_reasoning';
  practice: VerbalPracticeItem[];
  /** Asıl sorular, kolaydan zora. */
  items: VerbalItem[];
  /** Cevap anahtarı: items[i] sorusunun doğru seçeneğinin sırası (1–5). Tarayıcıya giden test bilgisinde boş gönderilir. */
  answers: number[];
  /**
   * Her sorunun "ilk bakışta doğru görünen" yanlış seçeneği (1–5): kelime ilişkilerinde üçüncü kelimeyle ilgili ama aynı
   * ilişkiyi kurmayan kelime, sınıflamada gruba bir yönüyle benzeyen ama ortak özelliği taşımayan kelime, sıralamada
   * bilgilerin yalnızca bir bölümüne uyan ya da olabilir ama kesin olmayan cevap, mantıksal çıkarımda olabilir (ya da
   * gerçekte doğru) ama verilen bilgilerden kesin olarak çıkmayan cümle. Yanlışların ne kadarının böyle olduğu raporda
   * anlatılır. Tarayıcıya boş gönderilir.
   */
  lures: number[];
  levels: { level: number; name: string; plain: string }[];
}

/**
 * Kâğıt katlama: kare bir kâğıt katlanıp delinir; kâğıt açılınca deliklerin nerede olacağı beş seçenekten seçilir
 * (content/instruments/kagit-katlama.ts, geometri lib/instruments/folding.ts). Türler sorudaki en zor katlamaya göredir:
 * ortadan (`half`), kenardan (`partial`; kâğıdın bir kısmı tek kat kalır), çapraz (`diagonal`).
 */
export type FoldingType = 'half' | 'partial' | 'diagonal';
/**
 * Çeldiricinin yanılgısı: bir katlamayı açmayı unutmak (`skip`), deliği aynalamak yerine kaydırmak (`slide`), kenardan
 * katlamayı kâğıdın ortasından katlanmış gibi açmak (`half`), kenardan katlamada tek kat olan yeri iki kat sanmak
 * (`single`), deliği yanlış çizgiye göre aynalamak (`axis`).
 */
export type FoldingLure = 'skip' | 'slide' | 'half' | 'single' | 'axis';

export interface FoldingItem {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: FoldingType;
  folds: Fold[];
  /** Katlanmış kâğıtta delinen yerler. */
  punches: Pt[];
  /** Beş seçenek: kâğıt açılınca deliklerin yerleri. */
  options: Pt[][];
}

export interface FoldingPracticeItem extends FoldingItem {
  /** Doğru seçeneğin sırası (1–5). Alıştırma puanlanmadığı için tarayıcıya gider. */
  answer: number;
  explain: string;
}

export interface PaperFoldingTask extends TaskBase {
  kind: 'paper_folding';
  practice: FoldingPracticeItem[];
  items: FoldingItem[];
  /** Cevap anahtarı (1–5). Tarayıcıya boş gönderilir. */
  answers: number[];
  /**
   * Her sorunun "ilk bakışta doğru görünen" yanlış seçeneği (1–5): bir katın deliğini unutmak, deliği aynalamak yerine
   * kaydırmak, kenardan katlamada tek kat olan yerde de delik var sanmak gibi. Tarayıcıya boş gönderilir.
   */
  lures: number[];
  /** Çeldiricilerin yanılgısı (raporda anlatılır). Tarayıcıya boş gönderilir. */
  lureKinds: FoldingLure[];
  levels: { level: number; name: string; plain: string }[];
}

/**
 * Kelime bilgisi: dört soru türü (Ölçekhane'nin özgün soruları, content/instruments/kelime-bilgisi.ts).
 *  - Eş anlam (`synonym`): kelimeye anlamca en yakın kelimeyi seçmek.
 *  - Zıt anlam (`antonym`): kelimenin zıt anlamlısını seçmek.
 *  - Cümlede anlam (`context`): birden çok anlamı olan bir kelimenin cümlede hangi anlamda kullanıldığını seçmek.
 *  - Deyimler (`idiom`): cümlede geçen deyimin anlamını seçmek.
 */
export type VocabularyType = 'synonym' | 'antonym' | 'context' | 'idiom';
/**
 * Çeldiricinin yanılgısı: eş anlamlıyla zıt anlamlıyı karıştırmak (`swap`), aynı konuyla ilgili ama anlamı farklı bir
 * kelimeyle karıştırmak (`related`), sesçe benzeyen bir kelimeyle karıştırmak (`sound`), kelimenin cümledeki anlamı yerine
 * başka (çoğu zaman en bilinen) anlamını seçmek (`meaning`), deyimi içindeki kelimelerin gerçek anlamıyla düşünmek
 * (`literal`).
 */
export type VocabularyLure = 'swap' | 'related' | 'sound' | 'meaning' | 'literal';

export interface VocabularyItem {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: VocabularyType;
  /** Eş ve zıt anlamda sorulan kelime; cümlede anlam ve deyimlerde cümle. */
  stem: string;
  /** Cümlede vurgulanan kısım (cümlede geçtiği biçimiyle); eş ve zıt anlamda yok. */
  mark?: string;
  /** Soruda adı geçen biçim: kelimenin ya da deyimin sözlükteki biçimi (ör. "göz", "kulak asmamak"). */
  lemma: string;
  /** Beş seçenek. */
  options: string[];
}

export interface VocabularyPracticeItem extends VocabularyItem {
  /** Doğru seçeneğin sırası (1–5). Alıştırma puanlanmadığı için tarayıcıya gider. */
  answer: number;
  explain: string;
}

export interface VocabularyTask extends TaskBase {
  kind: 'vocabulary';
  practice: VocabularyPracticeItem[];
  items: VocabularyItem[];
  /** Cevap anahtarı (1–5). Tarayıcıya boş gönderilir. */
  answers: number[];
  /** Her sorunun "ilk bakışta doğru görünen" yanlış seçeneği (1–5). Tarayıcıya boş gönderilir. */
  lures: number[];
  /** Çeldiricilerin yanılgısı (raporda anlatılır). Tarayıcıya boş gönderilir. */
  lureKinds: VocabularyLure[];
  levels: { level: number; name: string; plain: string }[];
}

/**
 * Kural değiştirme (görev değiştirme düzeni): her denemede mavi ya da turuncu bir daire ya da kare görünür; üstündeki
 * işaret (RENK ya da ŞEKİL) hangi kurala göre cevap verileceğini söyler (lib/instruments/rule-switch.ts). Önce iki tek
 * kurallı bölüm, sonra iki kuralın karıştığı iki bölüm gelir.
 */
export type RuleSwitchRule = 'color' | 'shape';

export interface RuleSwitchTrial {
  rule: RuleSwitchRule;
  /** 0 mavi (sol düğme), 1 turuncu (sağ düğme). */
  color: 0 | 1;
  /** 0 daire (sol düğme), 1 kare (sağ düğme). */
  shape: 0 | 1;
  /** Bölüm: 0 yalnızca renk, 1 yalnızca şekil, 2 ve 3 karışık. */
  block: number;
}

export interface RuleSwitchTask extends TaskBase {
  kind: 'rule_switch';
  /** Alıştırmalar (geri bildirimli, puanlanmaz): renk kuralı, şekil kuralı ve karışık bölümden önce. */
  practice: { color: RuleSwitchTrial[]; shape: RuleSwitchTrial[]; mixed: RuleSwitchTrial[] };
  /** Asıl denemeler bölüm sırasıyla; denemelerin sırası (index) bölümler boyunca birleşik sayılır. */
  trials: RuleSwitchTrial[];
  /** Kural işaretinin şekilden önce ekranda kaldığı süre (ms); işaret şekille birlikte de kalır. */
  cueMs: number;
  /** Şekil göründükten sonra cevap için en uzun süre (ms). */
  timeoutMs: number;
  itiMs: [number, number];
}

/**
 * Kelime listesi hatırlama (sözel liste öğrenme düzeni): 15 kelimelik bir liste üç kez gösterilir ve her seferinden sonra
 * hatırlanan kelimeler yazılır; sonra yeni bir liste bir kez gösterilip hatırlanır, ilk liste yeniden gösterilmeden bir
 * kez daha hatırlanır ve en sonda tanıma bölümü gelir (lib/instruments/word-list.ts).
 */
export type WordListLure = 'b' | 'semantic' | 'sound' | 'new';

export interface WordListTask extends TaskBase {
  kind: 'word_list';
  /** Alıştırma listesi (geri bildirimli, puanlanmaz). */
  practice: string[];
  /** Öğrenilen liste (15 kelime); her denemede aynı sırayla gösterilir. */
  listA: string[];
  /** Araya giren liste (15 kelime); bir kez gösterilir. */
  listB: string[];
  /** İlk listenin kaç kez gösterilip hatırlanacağı. */
  learningTrials: number;
  /** Tanıma bölümünde gösterilen kelimeler, gösterilme sırasıyla. */
  recognition: string[];
  /**
   * Tanıma bölümünün anahtarı (`recognition` ile aynı sırada): ilk listedeki kelime (`target`, `of` listedeki yeri) ya da
   * yanılgı türü: ikinci listeden (`b`, `of` ikinci listedeki yeri), ilk listedeki bir kelimeyle anlamca yakın
   * (`semantic`) ya da sesi ve yazılışı benzer (`sound`) yeni kelime (`of` o kelimenin yeri), ilgisiz yeni kelime (`new`).
   * Tarayıcıya boş gönderilir.
   */
  recognitionKey: { kind: 'target' | WordListLure; of?: number }[];
  /** Her kelimenin ekranda kaldığı süre ve iki kelime arasındaki boşluk (ms). */
  wordMs: number;
  gapMs: number;
}

export type CognitiveTask =
  | DigitSpanTask
  | SpatialSpanTask
  | FlankerTask
  | SymbolMatchTask
  | CancellationTask
  | ColorWordTask
  | GoNoGoTask
  | TrailTask
  | NBackTask
  | MentalRotationTask
  | ReactionTimeTask
  | MatrixReasoningTask
  | NumberSeriesTask
  | VerbalReasoningTask
  | PaperFoldingTask
  | VocabularyTask
  | RuleSwitchTask
  | WordListTask;

export interface TaskInstrument extends InstrumentBase {
  engine: 'tasks';
  tasks: CognitiveTask[];
}

/* ---------- Akademik konu tarama testleri (çoktan seçmeli, cevap anahtarlı) ---------- */

export type QuizOptionKey = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  key: QuizOptionKey;
  text: string;
  /** Bu seçeneği seçmek hangi yaygın hataya işaret ediyor (varsa). */
  misconception?: string;
}

export interface QuizTable {
  caption?: string;
  head: string[];
  rows: string[][];
}

/**
 * Soruda kullanılan grafik. Değerler verilerden çizilir; sütunlar ve noktalar ölçeğe tam oturur.
 * `showValues` kapalıysa değerler yazılmaz ve grafik eksendeki sayılardan okunur.
 */
export interface QuizChart {
  kind: 'bar' | 'line' | 'pie';
  title: string;
  labels: string[];
  values: number[];
  /** Dikey eksenin adı ve ölçeği (sütun ve çizgi grafiklerinde). */
  yLabel?: string;
  step?: number;
  max?: number;
  showValues?: boolean;
}

/** İki paralel doğru ve bir kesen. Kesen soldan sağa yükselir; `slope` yatayla yaptığı açıdır. */
export interface ParallelFigure {
  kind: 'parallel';
  slope: number;
  marks: {
    at: 'top' | 'bottom';
    region: 'above-right' | 'above-left' | 'below-left' | 'below-right';
    label: string;
  }[];
  /** Ekran okuyucular için şeklin sözlü anlatımı. */
  alt: string;
}

/** Yarıçapları eşit, her biri diğerinin merkezinden geçen iki çember ve merkezlerle üstteki kesişim noktasının oluşturduğu üçgen. */
export interface TwoCirclesFigure {
  kind: 'two-circles';
  alt: string;
}

export type QuizFigure = ParallelFigure | TwoCirclesFigure;

export interface QuizItem {
  key: string;
  domain: string;
  /** Soru metni. Kesirler {3/4}, tam sayılı kesirler {1 3/4} biçiminde yazılır. */
  text: string;
  table?: QuizTable;
  chart?: QuizChart;
  figure?: QuizFigure;
  options: QuizOption[];
  answer: QuizOptionKey;
  /** Doğru cevabın kısa açıklaması: raporda yanlış yapılan soruların altında gösterilir. */
  explain: string;
}

export interface QuizForm {
  key: string;
  /** Formu çözen öğrencinin sınıfı. */
  grade: number;
  /** Soruların ait olduğu sınıf düzeyi (bir önceki sınıf). */
  contentGrade: number;
  domains: { key: string; name: string; plain: string }[];
  items: QuizItem[];
}

export interface Misconception {
  name: string;
  /** Hatanın ne olduğu, veliye ve öğrenciye anlaşılır biçimde. */
  explain: string;
  /** Bu hatayı gidermek için somut öneri. */
  tip: string;
}

export interface QuizInstrument extends InstrumentBase {
  engine: 'quiz';
  subject: string;
  forms: QuizForm[];
  misconceptions: Record<string, Misconception>;
}

export type InstrumentDef = LikertInstrument | ReadingInstrument | OralReadingInstrument | TaskInstrument | QuizInstrument;
