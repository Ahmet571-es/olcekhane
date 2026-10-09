import type { Band } from '@/lib/instruments/types';

/** Bir ölçeğin bir düzeyi için rapor metinleri. */
export interface BandText {
  /** Kısa başlık: "Sosyal ve enerjik" gibi. */
  summary: string;
  /** Öğrenciye, ikinci tekil şahısla. */
  student: string;
  /** Veliye, çocuğu üçüncü şahısla anlatarak. */
  parent: string;
  /**
   * Testi kendisi için çözen yetişkine (ikinci tekil şahısla). Yalnızca öğrenci metni okula ya da ergenliğe özgü
   * olduğunda yazılır; verilmezse öğrenci metni kullanılır.
   */
  adult?: string;
  tipsStudent: string[];
  tipsParent: string[];
  /** true ise raporda "destek almak için" kutusu gösterilir. */
  support?: boolean;
}

export type ScaleTexts = Partial<Record<Band, BandText>>;

export interface ReportTemplate {
  version: string;
  bandLabels: Partial<Record<Band, string>>;
  /** Çok ölçekli raporlarda "Genel bakış" başlığının altındaki açıklama. Verilmezse kişilik metni kullanılır. */
  overview?: { student: string; parent: string; adult?: string };
  /**
   * Yüksek puanın gelişmiş bir beceri anlamına geldiği ölçekler (ör. çalışma alışkanlıkları). Bu durumda
   * "Öne çıkanlar" yerine "Güçlü yanlar" ve "Geliştirilebilecek alanlar" ayrı ayrı gösterilir.
   * Kişilik gibi uçları iyi ya da kötü olmayan ölçeklerde kullanılmaz.
   */
  evaluative?: boolean;
  /** Motivasyon haritası ve profil metinleri (profil: motivation). */
  motivation?: MotivationTemplate;
  scales: Record<string, ScaleTexts>;
}

/** Öğrenciye ve veliye ayrı yazılmış metin. */
export interface PairText {
  student: string;
  parent: string;
}

/**
 * Motivasyon haritası (profil: motivation). Yatay ve dikey eksen iki bileşik ölçektir (ör. kendi isteğiyle çalışma ve
 * baskıyla çalışma); düzeyleri (düşük, orta, yüksek) birleşerek dokuz profilden birini verir. Köşelerdeki dört profil
 * araştırmalardaki dört gruptur (ör. Vansteenkiste ve ark., 2009); aradaki beşi bu gruplar arasındaki geçişlerdir.
 */
export interface MotivationTemplate {
  /** Yatay eksendeki bileşik ölçek (kendi isteğiyle çalışma). */
  x: string;
  /** Dikey eksendeki bileşik ölçek (baskıyla çalışma). */
  y: string;
  /** Haritada yer almayan, kendi grubunda gösterilen ölçek (isteksizlik). */
  alone: string;
  /** Gruplarda başlığın altındaki açıklama: anahtar bileşik ölçek ya da `alone`. */
  groupText: Record<string, PairText>;
  /** Profiller: anahtar "<yatay düzey>-<dikey düzey>" (ör. "high-low"); ad ve yorum. */
  patterns: Record<string, PairText & { name: string }>;
  /**
   * Bileşik ölçeğin iki parçası arasında belirgin fark varsa (bir ondalıklı ortalamalar arasında en az 1 puan ve baskın
   * parça düşük düzeyde değilse) profil yorumunun sonuna eklenen cümle; anahtar baskın parçadır.
   */
  lean: Record<string, PairText>;
  /**
   * Bileşik ölçek yüksek değilken parçalarından biri tek başına yüksekse `lean` yerine eklenen cümle (ör. baskıya dayalı
   * nedenler genel olarak az, ama iç baskı yüksek); anahtar yüksek parçadır. "{düzey}" yerine bileşik ölçeğin düzeyi
   * yazılır ("az" ya da "orta düzeyde").
   */
  hidden: Record<string, PairText>;
  /** Haritanın nasıl okunacağı. */
  chartNote: PairText;
  /**
   * Kendi isteğiyle çalışma (yatay eksen ya da parçalarından biri) yüksek ve `alone` (isteksizlik) yüksekse uyarı:
   * cevaplar birbirine ters düşüyor.
   */
  contradiction: PairText;
}
