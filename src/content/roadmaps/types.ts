/**
 * Gelişim yol haritası: raporun sonundaki öneri bölümleri (nasıl çalışmalı, hangi ortamlarda rahat edilebilir,
 * dört haftalık küçük adımlar). Öneri niteliğindedir; tanı koymaz, kesin hüküm vermez.
 */

/** Düzey grupları: çok düşük ve düşük → düşük, orta → orta, yüksek ve çok yüksek → yüksek. */
export type BandGroup = 'low' | 'average' | 'high';

/**
 * Yol haritasının son haftasındaki "Bir sonraki adım olarak … için … testini çözebilirsin" cümlesinin amacı. Önerilen
 * testlerden biri kişinin sınıfına uymadığı (ya da yayında olmadığı) için elenirse amaç yalnızca `general` ise
 * (önerilen testlerin her birine tek başına da uyuyorsa) yazılır; yoksa kalan test amaçsız önerilir.
 */
export interface NextPurpose {
  you: string;
  parent: string;
  general?: boolean;
}

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
  /**
   * Kendini rahat hissedebileceği ortamlar (kişiye göre değişmeyen dil); orta düzeyde belirgin bir yön yoktur. Kişilik
   * dışındaki testlerde (ör. çalışma alışkanlıkları, öz-saygı) verilmez; o zaman ortamlar bölümü gösterilmez.
   */
  settings?: Partial<Record<BandGroup, string>>;
}

/**
 * Bu boyut bu düzey grubundayken 3. hafta iyi oluşa ayrılır. Birden çok verilirse ilk uyan kullanılır (ör. Duygusal denge
 * düşük, sonra Endişeye yatkınlık yüksek).
 */
export interface Wellbeing {
  scale: string;
  group: BandGroup;
  /** Rehber yazısı bağlantısı: verilmezse öğrenciye ve veliye "Sınav kaygısı" yazısıdır; `null` ise bağlantı verilmez. */
  link?: { label: string; href: string } | null;
}

export interface RoadmapTemplate {
  version: string;
  scales: Record<string, RoadmapScale>;
  /** Dört haftalık yol haritasının 2. haftası bu boyutun denemesidir. */
  planningScale: string;
  /** 2. haftanın başlığı; verilmezse "Çalışma düzeni" (ör. Sorumluluk). */
  planningTitle?: string;
  /**
   * 3. haftanın boyutu (iyi oluş haftası yoksa): "farthest" (varsayılan) 2. hafta dışında ortadan en uzak boyut;
   * "lowest" en düşük puanlı boyut (ör. çalışma alışkanlıkları: en çok geliştirilebilecek alışkanlık).
   */
  thirdWeek?: 'farthest' | 'lowest';
  /**
   * "Kısaca" kartlarında önce gösterilecek boyutlar: bu boyut bu düzey grubundayken öne çıkanların başına alınır (ör.
   * motivasyonda yüksek isteksizlik; ortadan aynı uzaklıktaki bir "merak" puanının arkasında kalmasın).
   */
  standoutFirst?: { scale: string; group: BandGroup }[];
  /**
   * 3. haftaya seçilmeyecek boyut ve düzeyler: üzerinde çalışmayı gerektirmeyen bir sonuç (ör. düşük isteksizlik) "en
   * belirgin boyut" diye bir haftaya başlık olmasın.
   */
  thirdWeekSkip?: { scale: string; group: BandGroup }[];
  /** Tek boyutlu testlerde 3. hafta: 2. hafta dışında boyut olmadığında bu deneme verilir. */
  extraWeek?: { title: string; text: AudienceText };
  /** "Etkili ders çalışma yöntemleri"nin ardından her raporda verilen rehber yazıları. */
  links?: { label: string; href: string }[];
  /**
   * Bu boyut bu düzey grubundayken 3. hafta iyi oluşa ayrılır ve bir rehber yazısına bağlantı verilir (ör. Duygusal
   * Denge düşük, Duygusallık yüksek). Birden çok verilirse şablondaki sırayla ilk uyan kullanılır. Bağlantı verilmezse
   * öğrenciye ve veliye "Sınav kaygısı" yazısıdır (yetişkine verilmez); `null` ise bağlantı verilmez.
   */
  wellbeing?: Wellbeing | Wellbeing[];
  /**
   * Çok boyutlu testlerde (ör. 16 özellik) "Nasıl çalışabilirsin?" kartları, ortamlar ve veliye yaklaşım önerileri
   * yalnızca ortadan en uzak `count` boyut için verilir (en belirgin olandan başlayarak); grafik bütün boyutları gösterir.
   * Hesaplanan boyut sayısı `count`tan fazlaysa `note` ("{n}" yerine sayı yazılır) çalışma bölümünün girişine eklenir.
   */
  focus?: { count: number; note: AudienceText };
  /**
   * Yol haritasındaki ölçeklerin adı, verilmezse "boyut" (ör. Kişiliğin 10 Yönü'nde yol haritası yönlerle kurulur: "yön",
   * "yönlere"). Dengeli profil cümlesinde ve test sayfasındaki tanıtımda kullanılır.
   */
  unit?: { one: string; toPlural: string };
  /**
   * Hiçbir ölçek orta düzeyin dışında değilken gösterilen cümle; verilmezse "Profilin dengeli: hiçbir boyut belirgin
   * biçimde öne çıkmıyor…" (kişilik testleri). Kişilik dışındaki testlerde "yönlerini kullanabiliyorsun" uymaz (ör. iyimserlik).
   */
  balancedNote?: AudienceText;
  /**
   * Veliye yaklaşım önerileri. Verilmezse rapor şablonundaki veli önerilerinin ilki kullanılır (Beş Faktör); rapor
   * şablonunda öneri yazılmamış testlerde burada verilir.
   */
  approach?: Record<string, Record<BandGroup, string>>;
  /** "Nasıl çalışmalı?" bölümünün girişi: etkili yöntemler herkes için aynıdır. */
  studyIntro: AudienceText;
  /** "Okul ve meslek planı için" bölümünün sonundaki uyarı: kişilik tek başına meslek seçtirmez (ortamı olan şablonda). */
  settingsNote?: AudienceText;
  /** Dört haftalık yol haritasının ilk ve son haftası (ortadaki iki hafta profilden seçilir). */
  firstWeek: AudienceText;
  lastWeek: AudienceText;
  /** Son haftada önerilecek testler (yalnızca yayındakiler ve kişinin sınıfına uyanlar gösterilir). */
  nextTests: string[];
  /** Önerilen testlerin ne için önerildiği; verilmezse "ilgilerini görmek" (kişilik testlerinden sonra ilgi testleri). */
  nextPurpose?: NextPurpose;
  sources: { text: string; url?: string }[];
}

/**
 * İlgi testlerinin (meslek ilgileri, serbest zaman etkinlikleri) gelişim yol haritası. Ders çalışma yerine ilgilerin
 * nasıl keşfedileceğini anlatır: en belirgin alanlar için keşif önerileri, (meslek ilgilerinde) ilişkili eğitim yolları,
 * veliye yaklaşım ve dört haftalık keşif planı. Raporun en belirgin alanları (ilgi profili ya da sıralama) kullanılır.
 */
export interface InterestArea {
  /** Üç boyutlu grafikteki renk. */
  color: string;
  /** "Nasıl keşfedebilirsin?" kartı: yalnızca en belirgin alanlarda gösterilir. */
  explore: AudienceText;
  /** Dört haftalık planda bu alanın bir haftalık keşif denemesi. */
  action: AudienceText;
  /** Veliye yaklaşım önerisi (en belirgin alanlarda). */
  approach: string;
  /** Okul ve meslek planı için: bu alanla ilişkili eğitim yolları (yalnızca meslek ilgi testlerinde). */
  paths?: AudienceText;
}

export interface InterestRoadmapTemplate {
  version: string;
  areas: Record<string, InterestArea>;
  /** Serbest zaman testi: girişte "meslek seçimi değildir" denmez (öneriler meslekle ilgili değildir). */
  leisure?: boolean;
  /** Yol haritasının girişinde ve test sayfasının tanıtımında bu bölümün ne olduğu. */
  what: AudienceText & { summary: string };
  /** Keşif bölümünün başlığı. */
  studyTitle: { you: string; parent: string };
  studyIntro: AudienceText;
  /** Öne çıkan alan yoksa (ilgiler henüz ayrışmamışsa) "Kısaca" bölümündeki cümle. */
  openNote: AudienceText;
  /**
   * Bütün alanlar düşük düzeydeyken `openNote`un yerine geçen not; verilmezse etkinliklerden hoşlanma (ya da serbest
   * zamanda sıklık) cümlesi ve `openNote` kullanılır. Değer testinde değerlerin hepsinin az önemli bulunduğu söylenir.
   */
  lowNote?: AudienceText;
  /** Eğitim yolları bölümünün sonundaki uyarı (yolu olan şablonda). */
  pathsNote?: AudienceText;
  firstWeek: AudienceText;
  /** Öne çıkan ikinci (ya da hiç) alan yoksa 2. ve 3. haftanın genel denemeleri. */
  openWeeks: [{ title: string; text: AudienceText }, { title: string; text: AudienceText }];
  lastWeek: AudienceText;
  /** Son haftada önerilecek testler ve neden önerildikleri (ör. "kişilik özelliklerini görmek"). */
  nextTests: string[];
  nextPurpose: NextPurpose;
  links: { label: string; href: string }[];
  sources: { text: string; url?: string }[];
}

/** Öğrenciye ve veliye ayrı yazılmış madde listesi (ör. haftalık çalışma düzeni). */
export interface AudienceList {
  student: string[];
  parent: string[];
  /** Yetişkine; verilmezse öğrenci listesi kullanılır. */
  adult?: string[];
}

/** Ortamlar bölümünün yerine geçen bilgi kutusu: başlık, giriş, maddeler ve sondaki not. */
export interface InfoBox {
  title: string;
  intro: AudienceText;
  items: AudienceList;
  note: AudienceText;
}

/** Konu tarama testinde bir konu alanının metinleri (sınıf formuna göre). */
export interface AcademicDomainText {
  /** Pekiştirilmeli ya da öncelikli alanda nasıl çalışılabileceği. */
  need: AudienceText;
  /** Haftalık deneme. */
  action: AudienceText;
  /** Veliye: evde nasıl destek olunabileceği. */
  approach: string;
}

/**
 * Konu tarama testlerinin (ör. matematik) yol haritası: konu alanlarına göre nasıl çalışılacağı, haftalık çalışma
 * düzeni ve yanlış yapılan sorulardan başlayan dört haftalık plan.
 */
export interface AcademicRoadmapTemplate {
  version: string;
  /** Konu alanının anahtarına göre renk (bütün formlarda aynı). */
  colors: Record<string, string>;
  /** Formun içerik sınıfına göre (ör. 5. sınıf formunda 4) alan metinleri. */
  forms: Record<number, Record<string, AcademicDomainText>>;
  /** Sağlam alanlar için ileri taşıma önerisi (bütün formlarda). */
  solid: Record<string, AudienceText>;
  /** Öncelikli ve pekiştirilmeli alanlarda alan metninden önce gelen cümle. */
  lead: { low: AudienceText; average: AudienceText };
  studyTitle: { you: string; parent: string };
  studyIntro: AudienceText;
  routine: InfoBox;
  /** 1. hafta: yanlış ya da boş bırakılan soru varsa ({k}: sayısı) ve hiç yoksa. */
  firstWeek: { wrong: AudienceText; none: AudienceText };
  /** Pekiştirilecek alan yoksa 2. hafta, ikinci alan yoksa 3. hafta. */
  extraWeeks: [{ title: string; text: AudienceText }, { title: string; text: AudienceText }];
  lastWeek: AudienceText;
  /** Pekiştirilecek alan yoksa veliye yaklaşım önerileri. */
  approachSolid: { title: string; text: string }[];
  nextTests: string[];
  nextPurpose: NextPurpose;
  links: { label: string; href: string }[];
  sources: { text: string; url?: string }[];
}

/** Okuma testinde bir soru türünün (beceri) metinleri. */
export interface ReadingSkillText {
  color: string;
  /** Bazı soruları yanlışsa nasıl çalışılabileceği. */
  need: AudienceText;
  /** Hepsi doğruysa ileri taşıma önerisi. */
  full: AudienceText;
  /** Haftalık deneme. */
  action: AudienceText;
}

/** Okuma hızı ve anlama düzenine göre öneri: metin çok hızlı geçildiyse, anlama gelişiyorsa ya da iyiyse. */
/** rush: rapor metnin çok hızlı geçildiğini söylüyor; quick: anlama düşükken hız yüksek (yalnızca olasılık olarak söylenir). */
export type ReadingPace = 'rush' | 'quick' | 'build' | 'extend';

export interface ReadingRoadmapTemplate {
  version: string;
  /** Soru türünün anahtarına göre (literal, inference, vocabulary, main_idea). */
  skills: Record<string, ReadingSkillText>;
  pace: Record<ReadingPace, { text: AudienceText; week: { title: string; text: AudienceText } }>;
  studyTitle: { you: string; parent: string };
  studyIntro: AudienceText;
  habits: InfoBox;
  /** Veliye yaklaşım, anlama düzeyine göre. */
  approach: Record<BandGroup, { title: string; text: string }[]>;
  firstWeek: AudienceText;
  /** Bütün soru türleri doğruysa 2. hafta. */
  extraWeek: { title: string; text: AudienceText };
  lastWeek: AudienceText;
  nextTests: string[];
  nextPurpose: NextPurpose;
  links: { label: string; href: string }[];
  sources: { text: string; url?: string }[];
}

/**
 * Zihinsel görevlerin yol haritası: becerinin günlük hayatta nerede kullanıldığı ve o işleri kolaylaştıran yollar.
 * Puanı yükseltmeyi ya da "beyni çalıştırmayı" vaat etmez; sonuç raporun kendi kartlarından özetlenir.
 */
export interface TaskRoadmapTemplate {
  version: string;
  /** Girişte ve test sayfasının tanıtımında bu bölümün ne olduğu. */
  what: AudienceText & { summary: string };
  studyTitle: { you: string; parent: string };
  studyIntro: AudienceText;
  /** Günlük hayatı kolaylaştıran yollar (kartlar). */
  supports: { key: string; title: string; tag: string; color: string; text: AudienceText }[];
  facts: InfoBox;
  approach: { title: string; text: string }[];
  /** 1., 2. ve 3. hafta. */
  weeks: [{ title: string; text: AudienceText }, { title: string; text: AudienceText }, { title: string; text: AudienceText }];
  lastWeek: AudienceText;
  nextTests: string[];
  nextPurpose: NextPurpose;
  links: { label: string; href: string }[];
  sources: { text: string; url?: string }[];
}
