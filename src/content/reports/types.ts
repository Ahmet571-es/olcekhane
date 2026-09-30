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
  scales: Record<string, ScaleTexts>;
}
