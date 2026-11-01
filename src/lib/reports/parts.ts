import type { ItemVisual } from './visuals';

/**
 * Raporun ek bölümleri (site sahibinin 2026-10-31 isteği: raporlar daha kapsamlı ve yol gösterici olsun; her açıklamanın
 * kendi içeriğine uyan bir grafiği olsun; ses asistanı raporu eksiksiz okusun). Bütün test türleri için ortak bir model:
 * bir bölüm başlık, giriş ve kartlardan oluşur; kartlar gruplanabilir (ör. bir kişilik boyutu ve alt özellikleri). Kartın
 * grafiği öteki kart grafikleriyle aynı geometriyle ekranda (components/report/report-parts.tsx) ve PDF'te
 * (lib/pdf/simple-report.tsx) çizilir; ses asistanı bölümleri lib/speech/report-text.ts'te okur.
 *
 * Anket testlerinde (lib/reports/likert-parts.ts) üç bölüm: "Düzeylerin anlamı", "Cevapların tek tek", "Cevaplarına ne
 * kadar güvenebiliriz?". Görev testlerinde (lib/reports/task-parts.ts) "Düzeylerin ve ölçülerin anlamı", "Soru soru
 * cevapların" (hızlı görevlerde "Deneme deneme sonuçların") ve "Sonuca ne kadar güvenebiliriz?". Okuma ve sesli okumada
 * (lib/reports/reading-parts.ts) ve konu taramada (lib/reports/quiz-parts.ts) aynı üç bölüm: "Düzeylerin ve ölçülerin
 * anlamı", soru soru (sesli okumada cümle cümle) cevaplar, "Sonuca ne kadar güvenebiliriz?".
 *
 * Bütün test türlerinde ilk bölümün ardından "Günlük hayatta nasıl görünür" (`daily`; lib/reports/daily-parts.ts, metinler
 * src/content/gunluk/): anket testlerinde her ölçeğin kişinin düzeyindeki örnekleri, öteki testlerde becerinin günlük hayatta
 * nerede kullanıldığı; kartlarda ortam ortam satırlar (`lines`).
 */

export type PartKey = 'levels' | 'daily' | 'answers' | 'quality';

/** Kartın rozetinin anlamı (kalite denetimlerinde): uygun, dikkat ya da denetim yapılamadı. */
export type PartStatus = 'ok' | 'warn' | 'none';

/** Bir düzeyin anlamı ("Düzeylerin anlamı"): düzeyin adı, kısa anlatımı ve kişinin düzeyi olup olmadığı. */
export interface PartLevel {
  label: string;
  text: string;
  active: boolean;
  /**
   * Puan bu (komşu) düzeyin sınırına yakın: ölçümün doğal payı bu düzeye de uzanıyor. Ekranda ve PDF'te "Bu da uyabilir"
   * etiketi; sesli okumada `spoken` cümlesi düzeyin hemen ardından okunur.
   */
  near?: boolean;
  spoken?: string;
}

/** Satır satır liste ("Cevapların tek tek"): madde numarası, metni, verilen cevap ve etiketler. */
export interface PartRow {
  /** Maddenin testteki sıra numarası (1'den başlar; grafikteki satır adı). */
  no: number;
  text: string;
  /** Verilen cevap ("Oldukça doğru") ya da "Cevaplanmadı". */
  value: string;
  /** Kısa etiketler ("ters puanlanır"). */
  tags: string[];
  /** Cevaplanmadı: soluk gösterilir. */
  muted?: boolean;
  /** Metnin sesli okunuşu, ekrandakinden farklıysa (ör. "2, 4, 8, ?" → "2, 4, 8 ve eksik sayı"). */
  say?: string;
  /**
   * Sesli okumada metnin yerine okunan (boşsa yalnızca numara ve satırın adı okunur; `say`dan önce gelir). Konu taramada soru
   * metinleri (kesirler, tablolar, şekiller) sesli okunmaz: "3. soru." ve cevap okunur.
   */
  spoken?: string;
  /** Numaranın yerine yazılan ad (ör. birleştirilmiş satırda "7.–18."); verilirse sesli okumada yalnızca `spoken` okunur. */
  label?: string;
  /**
   * Sesli okumada okunmaz (çok uzun listelerde doğru cevaplanan satırlar ya da bütün satırlar); kartın `spoken`'ı neyin tek tek
   * okunmadığını söyler. Ekranda ve PDF'te satır yine yazılır.
   */
  silent?: boolean;
}

export interface PartCard {
  /** Kartın anahtarı (ölçek ya da denetim). */
  key: string;
  title: string;
  badge?: string;
  status?: PartStatus;
  /** Açıklama; paragraflar "\n\n" ile ayrılır. Grafikteki sayılar metinde yinelenmez. */
  text?: string;
  /** Grafiğin nasıl okunacağı (sesli okunmaz; sesli okumada grafiğin değerleri `spoken` ile okunur). */
  note?: string;
  visual?: ItemVisual;
  levels?: PartLevel[];
  /**
   * Kişinin düzeyinin etiketi (verilmezse "Senin düzeyin" ya da "Çocuğunuzun düzeyi"); ör. okuma hızında "Senin hızın", sesli
   * okumanın veli ve öğretmen raporunda "Öğrencinin düzeyi".
   */
  activeLabel?: string;
  rows?: PartRow[];
  /** Satırların başlıkları ("cümle", "Cevabın"); satırlar sesli okunurken de kullanılır ("12. cümle … Cevabın: …"). */
  rowsHead?: {
    item: string;
    value: string;
    /** false: satırlar sesli okunurken numara ve ad okunmaz (satırın adı kendini anlatır: "Basit bölüm, ilk yarı"). */
    numbered?: false;
  };
  /** Grafiğin sözle anlatımı (sesli okuma): değerler, görünüşü değil. */
  spoken?: string[];
  /**
   * Ortam ortam örnekler ("Günlük hayatta nasıl görünür"): ortamın adı ("Okulda") ve örnek. Ekranda ve PDF'te adıyla alt alta,
   * sesli okumada "Okulda: …" diye okunur.
   */
  lines?: { label: string; text: string }[];
}

export interface PartGroup {
  /** Grup başlığı (ör. bir kişilik boyutu); verilmezse kartlar başlıksız sıralanır. */
  title?: string;
  cards: PartCard[];
}

export interface ReportPart {
  key: PartKey;
  title: string;
  /** Giriş; paragraflar "\n\n" ile ayrılır. */
  intro: string;
  /** Girişin grafiklerin nasıl okunacağını anlatan kısmı (sesli okunmaz). */
  introNote?: string;
  groups: PartGroup[];
  /**
   * Uzun bölüm: ekranda her kart açılır kapanır bir kutu olarak kapalı başlar; kutunun başlığında kartın adı ve rozeti
   * görünür. PDF ve sesli okuma bölümün hepsini verir.
   */
  collapsed?: boolean;
  /** Bölümde anılan araştırmalar (APA künyesi ve bağlantısı). */
  sources?: { text: string; url?: string }[];
  /** PDF'te ek olarak: yol haritasından sonra, kendi sayfalarında (ekrandaki sıra değişmez). */
  appendix?: boolean;
  /** PDF'te kartların grafikleri çizilmez (çok uzun testlerde PDF hızlı üretilsin; satırlar yine yazılır). */
  pdfVisuals?: false;
}

/** Bölümün bütün kartları (gruplarıyla birlikte, sırayla). */
export const partCards = (p: ReportPart): PartCard[] => p.groups.flatMap((g) => g.cards);
