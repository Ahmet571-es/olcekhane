/**
 * Test tanımları için ortak türler.
 *
 * Testlerin kaynağı koddur: maddeler, puanlama anahtarları ve bilim kartları burada sürümlü olarak
 * tutulur. Bir tanım değiştiğinde (madde, anahtar ya da puanlama) sürüm numarası artırılmalıdır.
 */

export type Domain = 'personality' | 'career' | 'academic' | 'cognitive' | 'wellbeing' | 'skills';
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
   * Verilmezse her ölçek için cetvel ve düzey metni gösterilir.
   */
  profile?: 'riasec' | 'interests' | 'facets';
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
  referenceRates: { grade: number; wpm: number; source: string; mode: 'oral' | 'silent' }[];
}

/* ---------- Bilişsel görevler ---------- */

export type TaskKind = 'digit_span' | 'spatial_span' | 'flanker' | 'symbol_match' | 'cancellation' | 'color_word' | 'go_nogo' | 'trail';

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

export type CognitiveTask =
  | DigitSpanTask
  | SpatialSpanTask
  | FlankerTask
  | SymbolMatchTask
  | CancellationTask
  | ColorWordTask
  | GoNoGoTask
  | TrailTask;

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

export type InstrumentDef = LikertInstrument | ReadingInstrument | TaskInstrument | QuizInstrument;
