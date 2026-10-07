/**
 * Gelişim yol haritası: raporun sonundaki öneri bölümleri (nasıl çalışmalı, hangi ortamlarda rahat edilebilir,
 * dört haftalık küçük adımlar). Öneri niteliğindedir; tanı koymaz, kesin hüküm vermez.
 */

/** Düzey grupları: çok düşük ve düşük → düşük, orta → orta, yüksek ve çok yüksek → yüksek. */
export type BandGroup = 'low' | 'average' | 'high';

/**
 * Bir metnin kime yazıldığı: öğrenciye ve yetişkine ikinci tekil şahısla, veliye çocuğunu anlatarak. Yetişkin metni
 * yalnızca öğrenci metni okula özgü olduğunda yazılır; verilmezse öğrenci metni kullanılır.
 */
export interface AudienceText {
  student: string;
  parent: string;
  adult?: string;
}

export interface RoadmapScale {
  /** Üç boyutlu grafikteki renk (globals.css: --dim-*; PDF için onaltılık). */
  color: string;
  /** Nasıl çalışmalı: bu düzeyde etkili yöntemleri hangi düzende kullanmanın kolay olacağı. */
  study: Record<BandGroup, AudienceText>;
  /** Bu hafta dene: dört haftalık yol haritasında bir haftalık küçük deneme. */
  action: Record<BandGroup, AudienceText>;
  /** Kendini rahat hissedebileceği ortamlar (kişiye göre değişmeyen dil); orta düzeyde belirgin bir yön yoktur. */
  settings: Partial<Record<BandGroup, string>>;
}

export interface RoadmapTemplate {
  version: string;
  scales: Record<string, RoadmapScale>;
  /** Dört haftalık yol haritasının 2. haftası ("Çalışma düzeni") bu boyutun denemesidir. */
  planningScale: string;
  /**
   * Bu boyut bu düzey grubundayken 3. hafta iyi oluşa ayrılır ve "Sınav kaygısı" yazısına bağlantı verilir
   * (ör. Duygusal Denge düşük, Duygusallık yüksek).
   */
  wellbeing?: { scale: string; group: BandGroup };
  /**
   * Veliye yaklaşım önerileri. Verilmezse rapor şablonundaki veli önerilerinin ilki kullanılır (Beş Faktör); rapor
   * şablonunda öneri yazılmamış testlerde burada verilir.
   */
  approach?: Record<string, Record<BandGroup, string>>;
  /** "Nasıl çalışmalı?" bölümünün girişi: etkili yöntemler herkes için aynıdır. */
  studyIntro: AudienceText;
  /** "Okul ve meslek planı için" bölümünün sonundaki uyarı: kişilik tek başına meslek seçtirmez. */
  settingsNote: AudienceText;
  /** Dört haftalık yol haritasının ilk ve son haftası (ortadaki iki hafta profilden seçilir). */
  firstWeek: AudienceText;
  lastWeek: AudienceText;
  /** Son haftada önerilecek testler (yalnızca yayındakiler ve kişinin sınıfına uyanlar gösterilir). */
  nextTests: string[];
  sources: { text: string; url?: string }[];
}
