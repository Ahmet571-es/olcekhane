import type { ItemVisual } from './visuals';

/**
 * Raporun ek bölümleri (site sahibinin 2026-10-31 isteği: raporlar daha kapsamlı ve yol gösterici olsun; her açıklamanın
 * kendi içeriğine uyan bir grafiği olsun; ses asistanı raporu eksiksiz okusun). Bütün test türleri için ortak bir model:
 * bir bölüm başlık, giriş ve kartlardan oluşur; kartlar gruplanabilir (ör. bir kişilik boyutu ve alt özellikleri). Kartın
 * grafiği öteki kart grafikleriyle aynı geometriyle ekranda (components/report/report-parts.tsx) ve PDF'te
 * (lib/pdf/simple-report.tsx) çizilir; ses asistanı bölümleri lib/speech/report-text.ts'te okur.
 *
 * Anket testlerinde (lib/reports/likert-parts.ts) üç bölüm: "Düzeylerin anlamı", "Cevapların tek tek", "Cevaplarına ne
 * kadar güvenebiliriz?". Sonraki aşamalarda görev, okuma, sesli okuma ve matematik testleri aynı modeli kullanır.
 * Görev testlerinde (lib/reports/task-parts.ts) "Düzeylerin ve ölçülerin anlamı", "Soru soru cevapların" (hızlı görevlerde
 * "Deneme deneme sonuçların") ve "Sonuca ne kadar güvenebiliriz?".
 */

export type PartKey = 'levels' | 'answers' | 'quality';

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
  rows?: PartRow[];
  /** Satırların başlıkları ("cümle", "Cevabın"); satırlar sesli okunurken de kullanılır ("12. cümle … Cevabın: …"). */
  rowsHead?: { item: string; value: string };
  /** Grafiğin sözle anlatımı (sesli okuma): değerler, görünüşü değil. */
  spoken?: string[];
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
