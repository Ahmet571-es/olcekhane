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
 * (T) işaretli kuralları tests/gunluk-hayat.test.ts denetler; ötekiler yazarın ve dosyayı yazmamış ikinci bir okurun işidir.
 *
 * Kaynak: örnekler testin kendi maddelerinden ve sitedeki metinlerden çıkar; yeni bir psikolojik ya da bilimsel iddia
 * eklenmez, yeni araştırma anılmaz.
 *  1. Önce testin maddelerini oku (src/content/instruments/<test>.ts): her ölçeğin düz ve ters puanlanan maddeleri hangi
 *     günlük davranışları soruyor? Her anket örneği bir ya da iki maddeye dayanır ve okuyan onu tanıyabilmeli ("Yeni yerler
 *     görmeyi severim" → "Arkadaşların yeni bir yer önerince hemen katılabilirsin"). Dayandığı maddelerin anahtarları
 *     satırın yanına yazılır (`from`; yetişkinin iş satırı için `work`) (T: anahtar testte var ve o ölçeğin ya da boyutun alt
 *     özelliğinin maddesi). Düzeyin yönü maddenin yönüne uyar: düşük düzeyin örneği ya düz bir maddenin düşük cevabından ya
 *     ters bir maddenin yüksek cevabından gelir. Maddede olmayan bir davranış (ör. "kitap kurdu", "lider", "eşya onarmak")
 *     yazılmaz.
 *  2. Rapor metinleri (src/content/reports/<test>.ts: `summary`, `student`, `parent`, öneriler) yalnızca tonu verir. Rapordaki
 *     bir öneri ya da yorum hiçbir maddeye dayanmıyorsa ("dinlenme zamanı", "elle yapılan etkinlikler", "somut örnek işini
 *     kolaylaştırır", "konuşmadan önce düşünür") örneğe taşınmaz.
 *  3. Bir duyguyu ya da tercihi beceriye çevirme ("hemen fark edersin", "kolayca uyum sağlarsın", "sunumda rahatsın"). Komşu
 *     bir yapıyı getirme (duygusunu saklamak, bir şeyi uzun uzun düşünüp durmak, söz almadan önce düşünmek, işe başlayamamak).
 *     Bir düzeyi bir öğretme biçimiyle eşleştirme (kişiliğe göre "öğrenme stili" yoktur; "somut örnekle daha iyi öğrenirsin"
 *     yazılmaz).
 *  4. Karşılaştırma yok: başkalarıyla ("arkadaşlarından daha…"; T: "-den daha"), yaygınlık ("bu düzeydeki birçok kişide";
 *     T), gruptaki rol ("… kişi sen olabilirsin", "ilk … sen"; T).
 *  5. Ton (lib/reports/daily-parts.ts, `scaleTone`; T: her ölçeğin tonu testte listelenir):
 *     - Özellik tonu (kişilik, merak, ilgi, değer, tarz): iki uç da eşittir. Düşük ve yüksek düzeyin üç örneğinden en az biri
 *       gerçek bir güçlü yan, en az biri gerçek ama yumuşak bir zorluk söyler; orta düzey "duruma göre" iki yanı birlikte
 *       anlatır. Uçlar tarafsızdır ("Bildiği yolu seçer" ↔ "Yeniyi dener").
 *     - Gelişim tonu (şablonu değerlendirici testler, destek kutusu açabilen ölçekler ve öz-saygı, iyimserlik, öz-yeterlik,
 *       zihniyet, duygusal zekâ, empati, öz-denetim, motivasyonda isteksizlik): örnekler bugünkü durumu anlatır ve
 *       değişebileceğini sezdirir; suçlamaz, utandırmaz. Düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk
 *       yazılmaz. Değerlendirici testte düşük uç "Henüz" diye başlar (T): "Henüz plan yapmadan başlar" ↔ "Önceden plan yapar".
 *     - Hassas ölçekler (şablonda `support: true` olan düzeyler: duygusal denge, ruh hâli, öz-saygı…) çok yumuşak yazılır:
 *       belirti listesi, korkutan ya da klinik sözcük yok (T); zor anı anlatan örneğin yanında bir dayanak (ör. "güvendiğin
 *       biriyle konuşmak iyi gelebilir") olur. Bu bölüm destek kutusunu açmaz ve anmaz; destek önerisini bu ölçekteki bir
 *       cevap açtıysa (`flagged`) kart örnek göstermez ve yalnızca o cevabın destek kutusunda ele alındığını söyler (T).
 *  6. Görev, okuma ve konu tarama testleri: önce testin `whatItMeasures` ve `limitations` metnini oku. Bir örnek, testin
 *     "bilgi vermez" dediği bir beceriye ya da sitede başka bir testin ölçtüğü beceriye (Sayı Dizileri, Kule Görevi, Görsel
 *     Algı Hızı, Kelime Bilgisi…) dayanmaz (T: tests/gunluk-hayat.test.ts'teki `EXCLUDED` tablosu). Örnek testin nasıl
 *     çözüldüğüne uyar (Okuma'da sorular metne bakmadan cevaplanır: "bulmak" değil "hatırlamak"). Oyun örneği becerinin
 *     kendisini ister (sudoku ve satrançta kurallar verilir: kural bulmayı değil uygulamayı ister). Kardeş testlerin
 *     örnekleri birbirinden farklıdır.
 *  7. Matematik ve gerçek dünya bilgisi: her örnek, formun konu tanımındaki (`plain`) bir konunun doğru bir örneğidir; kartın
 *     metni gösterildiği her forma uyar (konular formdan forma değişiyorsa kart forma göre bölünür: `forms`). Sayıları elle
 *     hesapla. Hiçbir örnek misconceptions.ts'teki bir yanılgıyı beslemez (tek bir zarda bir sayının "daha olası" olması
 *     gibi). Bölmeyle çözülen bir problem cebir örneği değildir.
 *  8. Kapsayıcılık: telefon, mesaj, tablet ya da internet varsayılmaz (1–4. sınıfa açık testte T); kendi odası, asansör,
 *     bahçe, araba, tatil, yurt dışı gezisi, özel ders, yakın arkadaş ya da kardeş varsayılmaz (T: sözcükler); "annen, baban"
 *     yerine "evdekiler"; kız ya da erkek işi diye bir örnek yok. Arkadaş anılırken "bir iki yakın arkadaş" değil "az kişi",
 *     "biri".
 *  9. Uçlar (`poles`) bir maddeyi değil bütün ölçeği anlatır: testin `poles` metninden ve şablondaki `summary`'den başla.
 *     Değer taşıyan fiil yok ("yetinir", "kaçınır"; T: sözcük listesi). Sor: bu uç senin için söylense incitir mi?
 * 10. Yayından önce dosyayı yazmamış bir ajan her satırı dayandığı maddelerle karşılaştırır (Beyin Akademisi'ndeki gibi).
 *
 * Temkinli dil (anket): her cümle bir olasılık söyler: "-abilir / -ebilir", "çoğu zaman", "bazen", "genellikle", "…e daha
 * yatkın olabilirsin" (T: her cümlede). "Her zaman", "asla", "kesinlikle", "hiçbir zaman", "daima", "mutlaka", "her
 * seferinde", "hiç" (T) ve kişiyi tanımlayan ad ("içe dönük biri", "dağınık") kullanılmaz; davranış anlatılır. Yetenek,
 * zekâ ya da üstünlük söylenmez ("yetenekli", "zeki", "üstün"; T; "zekâ oyunu" bir oyun adıdır).
 * İlgi, değer ve motivasyon testleri: ilginin günlük hayatta nerede göründüğü anlatılır; meslek önerilmez ("İlgi, yetenek
 * demek değildir"). Düşük ilgi bir eksiklik değildir ("başka alanlara daha çok zaman ayırabilirsin").
 *
 * Görev, okuma ve konu tarama testleri: tanımlayıcı yazılır, kestirimde bulunulmaz: "Bu tür işlerdir", "bu beceriyi
 * kullanır", "… gerektiren işlerde kullanılır". Sonuç, puan, zorlanma, başarı, test ve geliştirme anılmaz (T: "zorlan",
 * "başarı", "sonucun", "puanın", "daha iyi", "geliştir", "güçlendir", "test"); düşük sonucun hayatta zorlanmak demek olduğu
 * ima edilmez; "beyni çalıştırma" vaadi verilmez. Kartın metni başlığıyla başlamaz (T: "İşlem hızı" kartında "Bu beceri, …").
 *
 * Kime yazıldığı:
 *  - Öğrenci (`student`) ve yetişkin (`adult`): "sen"; ankette her satırda "sen" eki ya da sözcüğü vardır (T), "siz" yoktur
 *    (T). Veli (`parent`): "çocuğunuz", üçüncü kişi; her düzeyin üç satırından en az birinde "çocuğunuz" geçer ve hiçbir
 *    satırda "sen" eki, "-dığın" ortacı ya da "ilgin, canın, eşyaların…" gibi ikinci kişi iyelik eki yoktur (T). Sesli
 *    okumanın veli ve öğretmen raporu "öğrenci" der (T).
 *  - Aynı ölçeğin bir kitledeki dokuz satırı birbirinden farklıdır (T: düzeyler kopyalanmaz); anket satırı öğrenci ve veli
 *    için aynı olamaz (T).
 *  - Yetişkin (`adult`; test yetişkinlere açıksa zorunlu, T): ilk ortam okul değil "İşte ya da günlük işlerde" (`work`);
 *    arkadaş ve ev satırları öğrenci metninde okul sözcüğü yoksa yazılmaz (öğrencininki kullanılır). Yetişkin metninde,
 *    kısa adda, başlıkta ve dallarda okul, ders, sınav, öğretmen, ödev, sınıf, teneffüs, karne, kantin, dershane, etüt gibi
 *    sözcükler geçmez (T: tests/helpers/school.ts).
 *  - Mezun (13. sınıf): yetişkinlere açık olmayan testte ilk ortamın adı "Okulda ya da derslerde" olur; örnekler aynıdır.
 *    Bu yüzden okul satırı sınava hazırlanan bir mezun için de anlamlı olmalıdır (ders, çalışma, sınav).
 *  - Sınıf aralığı: test 3–4. sınıfa açıksa öğrenci metni 8–9 yaşındaki bir çocuğun anlayacağı kadar somut ve kısa olur
 *    (teneffüs, oyun, ödev, sofra); lise testlerinde ergenin hayatından örnekler (kulüp, proje, sınav haftası).
 *
 * Biçim: her örnek bir cümle (en çok iki); cümle ortalama 10–13, en çok 22 sözcük (T). Sade Türkçe; Türkçesi olan yabancı
 * sözcük yok; "seviye" değil "düzey"; noktalama ve kesme işareti TDK'ye göre ("Türkiye'de"; özneden sonra virgül: "Bu beceri,
 * …"). Ortamın adı satırın başına yazılmaz (T; bölüm ekler). `poles` ve dallar 2–4 sözcük; uç en çok POLE_MAX_CHARS, dal en
 * çok BRANCH_MAX_CHARS, kutudaki kısa ad en çok CENTER_MAX_CHARS karakter ve sözcükleri en çok CENTER_WORD_MAX_CHARS
 * karakter (lib/reports/visual-daily.ts; T). "tanı", "teşhis", "bozukluk", "hastalık", "normal", "zekâ puanı", "IQ" ve kişiyi
 * yargılayan sözcükler yazılmaz (T).
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
  /**
   * Her ortamın örneğinin dayandığı maddelerin anahtarları (öğrenci, veli ve yetişkin aynı örneği kendi diliyle söyler;
   * yetişkinin iş satırı `work`). Anahtar testte bulunmalı ve bu ölçeğin (ayrıntılı profilde boyutun alt özelliklerinin)
   * maddesi olmalıdır.
   */
  from: { school: string[]; friends: string[]; home: string[]; work?: string[] };
  student: DailyLines;
  parent: DailyLines;
  /** Test yetişkinlere açıksa zorunlu. */
  adult?: AdultLines;
}

/** Bir ölçeğin günlük hayattaki görünüşü. */
export interface ScaleDaily {
  /** Grafiğin iki ucu: düşük ve yüksek puanın günlük karşılığı (2–4 sözcük; değerlendirici testte düşük uç "Henüz" ile başlar). */
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
