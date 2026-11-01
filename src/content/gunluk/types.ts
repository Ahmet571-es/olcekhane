import type { LevelGroup } from '@/content/reports/types';

/**
 * "Günlük hayatta nasıl görünür" metinleri (site sahibinin 2026-10-31 isteği; raporun ek bölümü, aşama d). Her test için
 * bir dosya: src/content/gunluk/<testin adresi>.ts; kayıt src/content/gunluk/index.ts. Bölümü lib/reports/daily-parts.ts
 * kurar; denetim tests/gunluk-hayat.test.ts.
 *
 * İki tür içerik var:
 *  - Anket testleri (`SurveyDaily`): her ölçek için iki ucun günlük karşılığı (`poles`, grafiğin iki ucu) ve her düzey grubu
 *    (düşük, orta, yüksek) için üç ortamda birer örnek: öğrenciye ve yetişkine "sen", veliye "çocuğunuz". Kişinin düzeyi
 *    raporun kartındaki düzeyin aynısıdır; örnekler o düzeyin grubundan seçilir.
 *  - Görev, okuma, sesli okuma ve konu tarama testleri (`SkillsDaily`): her beceri (ya da konu alanı) için tanımı ve üç
 *    ortamda nerede kullanıldığı. Sonuca göre değişmez; herkes aynı metni görür.
 *
 * ============================== YAZARIN DENETİM LİSTESİ ==============================
 *
 * Kaynak: örnekler testin kendi maddelerinden ve sitedeki metinlerden çıkar; yeni bir psikolojik ya da bilimsel iddia
 * eklenmez, yeni araştırma anılmaz.
 *  1. Önce testin maddelerini oku (src/content/instruments/<test>.ts): her ölçeğin düz ve ters puanlanan maddeleri hangi
 *     günlük davranışları soruyor? Sonra rapor metinlerini oku (src/content/reports/<test>.ts: düzeylerin `summary`,
 *     `student`, `parent`, `adult` metinleri ve öneriler) ve dosyanın başındaki ilkeleri (ör. Merak'ta bilgi merakının
 *     kartları değişiklikten söz etmez). Görev testlerinde testin tanıtımını ve yol haritasındaki "nerede kullanılır"
 *     cümlelerini oku (src/content/roadmaps/gorevler.ts, okuma.ts, matematik.ts).
 *  2. Her örnek bir ya da iki maddeye dayanır ve okuyan onu tanıyabilmeli: "Yeni yerler görmeyi severim" → "Arkadaşların
 *     yeni bir yer önerince hemen katılabilirsin." Maddede olmayan bir davranış (ör. "kitap kurdu", "lider") yazılmaz.
 *     Dosyada her ölçeğin üstüne hangi maddelere dayandığını kısa bir yorumla yaz.
 *  3. Hassas ölçekler (rapor şablonunda `support: true` olan düzeyler: duygusal denge, ruh hâli, öz-saygı…) çok yumuşak
 *     yazılır: belirti listesi, korkutan ya da klinik sözcük yok; zor anı anlatan örneğin yanında bir dayanak (ör.
 *     "güvendiğin biriyle konuşmak iyi gelebilir") olabilir. Destek kutusunu bu bölüm açmaz, anmaz.
 *
 * Temkinli dil: her anket örneği bir olasılık söyler: "-abilir / -ebilir", "çoğu zaman", "bazen", "genellikle", "…e daha
 * yatkın olabilirsin" (test her satırda arar). "Her zaman", "asla", "kesinlikle" ve kişiyi tanımlayan ad ("içe dönük
 * biri", "dağınık") kullanılmaz; davranış anlatılır.
 *
 * Değerlendirici olmayan ölçekler (kişilik, merak, ilgi, değer; şablonda `evaluative` yok): iki uç da eşittir. Düşük ve
 * yüksek düzeyin üç örneğinden en az biri gerçek bir güçlü yan, en az biri gerçek ama yumuşak bir zorluk söyler; orta düzey
 * "duruma göre" iki yanı birlikte anlatır. `poles`'un iki ucu da tarafsızdır ("Bildiği yolu seçer" ↔ "Yeniyi dener");
 * hiçbir uç eksiklik gibi okunmaz.
 * Değerlendirici ölçekler (şablonda `evaluative: true`: çalışma alışkanlıkları, erteleme…): düşük uç "henüz" diye okunur,
 * utandırmaz ("Henüz plan yapmadan başlar" ↔ "Önceden plan yapar"); düşük düzey örnekleri bugünkü durumu anlatır ve
 * değişebileceğini sezdirir, suçlamaz.
 * İlgi, değer ve motivasyon testleri: ilginin günlük hayatta nerede göründüğü anlatılır; meslek önerilmez, yetenek
 * söylenmez ("İlgi, yetenek demek değildir"). Düşük ilgi bir eksiklik değildir ("başka alanlara daha çok zaman
 * ayırabilirsin").
 *
 * Görev, okuma ve konu tarama testleri: tanımlayıcı yazılır, kestirimde bulunulmaz: "Bu tür işlerdir", "bu beceriyi
 * kullanır", "… gerektiren işlerde kullanılır". Sonuç, puan, zorlanma ve başarı anılmaz (test "zorlan", "başarı", "puan",
 * "sonuç" sözcüklerini arar); düşük sonucun hayatta zorlanmak demek olduğu ima edilmez; geliştirme ya da "beyni
 * çalıştırma" vaadi verilmez.
 *
 * Kime yazıldığı:
 *  - Öğrenci (`student`): "sen". Veli (`parent`): "çocuğunuz", üçüncü kişi; her düzeyin üç satırından en az birinde
 *    "çocuğunuz" geçer ve hiçbir satırda "sen" eki yoktur. Sesli okumanın veli ve öğretmen raporu "öğrenci" der.
 *  - Yetişkin (`adult`; test yetişkinlere açıksa zorunlu): ilk ortam okul değil "İşte ya da günlük işlerde" (`work`);
 *    arkadaş ve ev satırları öğrenci metninde okul sözcüğü yoksa yazılmaz (öğrencininki kullanılır). Yetişkin metninde
 *    okul, ders, sınav, öğretmen, ödev, sınıf gibi sözcükler geçmez (test denetler).
 *  - Sınıf aralığı: test 3–4. sınıfa açıksa öğrenci metni 8–9 yaşındaki bir çocuğun anlayacağı kadar somut ve kısa olur
 *    (teneffüs, oyun, ödev, sofra); lise testlerinde ergenin hayatından örnekler (kulüp, proje, sınav haftası).
 *  - Aile yapısı, cinsiyet, kültür ve gelir varsayılmaz: "annen, baban" yerine "evdekiler, ailen"; "kendi odan", pahalı
 *    uğraşlar (yurt dışı gezisi, özel ders) yok; kız ya da erkek işi diye bir örnek yok. Başkalarıyla karşılaştırma yok
 *    ("arkadaşlarından daha…").
 *
 * Biçim: her örnek bir cümle (en çok iki); cümle ortalama 10–13, en çok 22 sözcük. Sade Türkçe; Türkçesi olan yabancı sözcük
 * yok; "seviye" değil "düzey"; kesme işareti TDK'ye göre ("Türkiye'de"). Ortamın adı satırın başına yazılmaz (bölüm ekler).
 * `poles` ve dallar 2–4 sözcük; uç en çok POLE_MAX_CHARS, dal en çok BRANCH_MAX_CHARS, kutudaki kısa ad en çok
 * CENTER_MAX_CHARS karakter (lib/reports/visual-daily.ts). "tanı", "teşhis", "bozukluk", "hastalık", "normal", "zekâ puanı",
 * "IQ" ve kişiyi yargılayan sözcükler yazılmaz.
 *
 * Yeni dosya: örneklere bak (anket: merak.ts tek ölçekli olmayan, yetişkinli; bes-faktor-kisilik.ts beş boyutlu, beş
 * düzeyli; görev: simge-bulma.ts, sekil-akil-yurutme.ts; okuma: okuma-hizi-ve-anlama.ts; konu tarama:
 * matematik-konu-tarama-testi.ts). Dosyayı index.ts'e ekle ve tests/gunluk-hayat.test.ts'teki `DAILY_PENDING` listesinden
 * testin adresini sil; test bütün ölçekleri, düzeyleri, ortamları ve kitleleri, dili ve grafikleri dener.
 */

/** Öğrenci ve veli metninde üç ortam: okulda, arkadaşlarla (görevlerde: oyunda ve arkadaşlarla), evde. */
export interface DailyLines {
  school: string;
  friends: string;
  home: string;
}

/**
 * Yetişkin metninde okul yerine iş ya da günlük işler (`work`); arkadaş ve ev satırları öğrenci metninde okul sözcüğü yoksa
 * yazılmaz (öğrenci metni kullanılır).
 */
export interface AdultLines {
  work: string;
  friends?: string;
  home?: string;
}

/** Bir düzey grubunun örnekleri. */
export interface DailyBand {
  student: DailyLines;
  parent: DailyLines;
  /** Test yetişkinlere açıksa zorunlu. */
  adult?: AdultLines;
}

/** Bir ölçeğin günlük hayattaki görünüşü. */
export interface ScaleDaily {
  /** Grafiğin iki ucu: düşük ve yüksek puanın günlük karşılığı (2–4 sözcük; değerlendirici ölçekte düşük uç "henüz"). */
  poles: { low: string; high: string };
  /** Düşük (çok düşük dahil), orta ve yüksek (çok yüksek dahil) düzeyin örnekleri. */
  bands: Record<LevelGroup, DailyBand>;
}

/**
 * Anket testi: sonuç kartı olan her ölçek için (`dailyScales`: ayrıntılı profilde ve motivasyon profilinde boyutlar ve kendi
 * grubundaki ölçek, ötekilerde bütün ölçekler); anahtarlar testin ölçek anahtarlarıdır.
 */
export interface SurveyDaily {
  kind: 'survey';
  version: string;
  scales: Record<string, ScaleDaily>;
}

/** Grafikteki dalların kısa örnekleri (2–4 sözcük). */
export interface SkillBranches {
  school: string;
  friends: string;
  home: string;
  /** Yetişkinde okul dalının yerine (test yetişkinlere açıksa zorunlu). */
  work?: string;
}

/** Bir becerinin (ya da konu alanının) günlük hayatta nerede kullanıldığı. */
export interface SkillDaily {
  /** Kartın anahtarı. */
  key: string;
  /**
   * Kartın anlattığı sonuç parçaları (`dailySources`: görevin anahtarı; okuma ve sesli okumada testin ölçek anahtarları:
   * okumada `comprehension`, `speed`, sesli okumada `accuracy`, `rate`, `prosody`, `comprehension`, `retell`; konu taramada
   * konu alanının anahtarı); verilmezse [`key`]. Birden çok görevli testte birkaç görev, sesli okumada birkaç ölçü tek bir
   * kartta anlatılabilir.
   */
  covers?: string[];
  /** Konu taramada yalnızca bu formlarda (ör. ['mat-7']): konu alanının içeriği formdan forma değişiyorsa. */
  forms?: string[];
  /** Kartın başlığı; verilmezse sonuç parçasının adı (görevin ya da konu alanının adı). */
  title?: string;
  /** Grafiğin ortasındaki kısa ad (en çok CENTER_MAX_CHARS). */
  short: string;
  /** Tanım: becerinin ne olduğu ve hangi işlerde kullanıldığı (kişisiz, herkese aynı; en çok iki cümle). */
  text: string;
  branches: SkillBranches;
  student: DailyLines;
  parent: DailyLines;
  adult?: AdultLines;
}

export interface SkillsDaily {
  kind: 'skills';
  version: string;
  skills: SkillDaily[];
}

export type DailyContent = SurveyDaily | SkillsDaily;
