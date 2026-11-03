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
 * (T) işaretli kuralları tests/gunluk-hayat.test.ts denetler (yalnızca bir kısmı denetleniyorsa hangi kısmı olduğu yazar);
 * ötekiler yazarın ve dosyayı yazmamış ikinci bir okurun işidir (24. madde).
 *
 * Kaynak
 *  1. İzlenebilirlik. Örnekler testin kendi maddelerinden ve sitedeki metinlerden çıkar; yeni bir psikolojik ya da bilimsel
 *     iddia eklenmez, yeni araştırma anılmaz. Önce testin maddelerini oku (src/content/instruments/<test>.ts): her ölçeğin düz
 *     ve ters maddeleri hangi günlük davranışları soruyor? Her anket satırı bir ya da iki maddeye dayanır ve okuyan onu
 *     tanıyabilir ("Yeni yerler görmeyi severim" → "Arkadaşların yeni bir yer önerince hemen katılabilirsin"). Dayandığı
 *     maddelerin anahtarları `from`'a yazılır (yetişkinin iş satırı için `work`; T: anahtar testte var ve o ölçeğin ya da
 *     boyutun alt özelliğinin maddesi). Düzeyin yönü maddenin yönüne uyar: düşük düzeyin örneği ya düz bir maddenin düşük
 *     cevabından ya ters bir maddenin yüksek cevabından gelir. Maddede olmayan bir davranış ("kitap kurdu", "lider", "eşya
 *     onarmak") yazılmaz; maddeye doğrudan dayanmayan bir uzantı (bir dayanak cümlesi, bir bedel) dosyanın başında adıyla anılır.
 *  2. Rapor metinleri (src/content/reports/<test>.ts: `summary`, `student`, `parent`, öneriler) yalnızca tonu verir: hiçbir
 *     maddeye dayanmayan bir öneri ya da yorum ("dinlenme zamanı", "elle yapılan etkinlikler", "konuşmadan önce düşünür")
 *     örneğe taşınmaz.
 *  3. Maddeler aynen aktarılmaz (T): bir satır testin bir maddesinin bütününü ya da bir maddeden art arda dört sözcüğü içermez
 *     (büyük-küçük harf gözetilmez; dört sözcüğün en çok biri içerik sözcüğüyse "ne zaman ve nerede" gibi bir kalıptır,
 *     sayılmaz). Örnek, maddenin konusundan bir günlük sahnedir; maddeyi yineleyen satır o maddeye verilen cevabı anlatıyormuş
 *     gibi okunur, oysa düzeye göre seçilir ve kişinin o maddeye cevabı tersi olabilir.
 *  4. Destek kutusunu açan bir madde (testte `supportItems`) hiçbir satırın dayanağı olmaz (T): kutuyu açtıysa kart örnek
 *     göstermez; açmadıysa kişi o cümleye eşiğin altında cevap vermiştir ve onu yineleyen bir örnek cevabıyla çelişirdi.
 *  5. Aynı sayfadaki kartlar birbiriyle çelişmez. Şablon ölçeklerin birbirinin konusuna girmediğini söylüyorsa (Empati,
 *     Öz-yeterlik, Öz-denetim) örnekler de girmez. Bir bileşik ölçeğin (`of`) alt ölçekleri kendi kartlarında örnekleniyor ve
 *     bileşiğin örnekleri onlarla çelişebiliyorsa (bileşik ile bir alt ölçek ayrı gruplara düşebilir; destek kutusunu alt
 *     ölçekteki bir madde açar, bileşik işaretlenmez) bileşiğe örnek yerine yönlendirme yazılır (`pointer`; T: ya `bands` ya
 *     `pointer`, yönlendirme yalnızca alt ölçekleri kendi kartında örneklenen bileşikte): "Bu toplam puanın örnekleri aşağıdaki
 *     üç konunun kartlarında." (İyimserlik). Motivasyon bileşikleri için 11. madde.
 *
 * Ne yazılmaz
 *  6. Kesin hüküm: her anket cümlesi bir olasılık söyler ("-abilir / -ebilir", "çoğu zaman", "bazen", "genellikle", "…e daha
 *     yatkın olabilirsin"; T: her cümlede). "Her zaman", "asla", "kesinlikle", "hiçbir zaman", "daima", "mutlaka", "her
 *     seferinde", "hiç" yok (T); kişiyi tanımlayan bir ad ("içe dönük biri", "dağınık") yerine davranış anlatılır.
 *  7. Karşılaştırma ve yaygınlık yok: başkalarıyla ("arkadaşlarından daha…"; T: "-den daha"), yaygınlık ("bu düzeydeki birçok
 *     kişide", "çoğu çocuk"; T; "birçok kişiyle tanışmak" bir sahnedir), gruptaki rol ("ortamı neşelendiren kişi sen
 *     olabilirsin", "ilk … sen"; T: "kişi sen olabilir").
 *  8. Bir duygu ya da tercih beceriye çevrilmez ("hemen fark edersin", "kolayca uyum sağlarsın", "sunumda rahatsın"); komşu bir
 *     yapı getirilmez (duygusunu saklamak, bir şeyi uzun uzun düşünüp durmak, söz almadan önce düşünmek, işe başlayamamak).
 *     Yetenek, zekâ ya da üstünlük söylenmez (T: "yetenekli", "zeki", "üstün"; "zekâ oyunu" bir oyun adıdır).
 *  9. Öğrenme stili yok: bir düzey bir öğretme ya da çalışma biçimiyle eşleştirilmez (kişiliğe göre "öğrenme stili" yoktur;
 *     "somut örnekle daha iyi öğrenirsin" yazılmaz). Etkili çalışma yöntemleri herkese aynıdır.
 *
 * Ton (lib/reports/daily-parts.ts, `scaleTone`; T: yayındaki her ölçeğin tonu testteki GROWTH tablosunda tek tek listelenir)
 * 10. Özellik tonu (kişilik, merak, tarz; ilgi, değer ve hobide 12. madde): iki uç eşittir ve tarafsız adlandırılır ("Bildiği
 *     yolu seçer" ↔ "Yeniyi dener"). Düşük ve yüksek düzeyin üç örneğinden en az biri gerçek bir güçlü yan, en az biri gerçek
 *     ama yumuşak bir zorluk söyler; orta düzey "duruma göre" iki yanı birlikte anlatır.
 * 11. Gelişim tonu: ölçek şunlardan biriyse örnekler bugünkü durumu anlatır ve değişebileceğini sezdirir; suçlamaz, utandırmaz:
 *     - şablonu değerlendirici (`evaluative`: Çalışma Alışkanlıkları, Erteleme ve Zaman Yönetimi; düşük uç "Henüz" diye başlar,
 *       T): "Henüz plan yapmadan başlar" ↔ "Önceden plan yapar";
 *     - düzeylerinden biri destek kutusu açabilen ölçek (şablonda `support`; ayrıntılı profilde boyutun alt özellikleri de);
 *     - `GROWTH_SLUGS`'taki testler (öz-saygı, iyimserlik, öz-yeterlik, zihniyet, duygusal zekâ, empati, öz-denetim) ve
 *       `GROWTH_SCALES`'teki tek tek ölçekler (motivasyonda isteksizlik, Öğrenme ve Başarı'da zorlukla başa çıkma, 16 Faktörlü'de
 *       gerginlik ve düşünsel özgüven, Liderlik'te kararlılık ve sorumluluk);
 *     - maddeleri yalnızca bir ucu zorluk olarak soran tek yönlü ölçek: yeni böyle bir ölçek `GROWTH_SCALES`'e ve testteki
 *       GROWTH tablosuna yazılır.
 *     Zor uç sıkıntının olduğu uçtur: duygusal dengede ve ruh hâlinde düşük uç; HEXACO duygusallıkta (Altı Boyutlu
 *     `emotionality`), kaygıda ve gerginlikte yüksek uç. Zor uca uydurma bir güçlü yan, rahat uca uydurma bir zorluk yazılmaz
 *     (rahat uçta sıkıntıyı varsayan bir öğüt de yazılmaz). Hassas ölçekler çok yumuşak yazılır: belirti listesi, klinik ya da
 *     korkutan sözcük yok (T); zor anı anlatan örneğin yanında bir dayanak olur ("güvendiğin biriyle konuşmak iyi gelebilir";
 *     dayanaklar birbirini yinelemez). Bölüm destek kutusunu açmaz ve anmaz; destek önerisini bu ölçekteki bir cevap açtıysa
 *     (`flagged`) kart örnek göstermez ve yalnızca o cevabın destek kutusunda ele alındığını söyler (T).
 * 12. Motivasyon profilinin bileşik ölçekleri (kendi isteğiyle çalışma, baskıyla çalışma): iki uç da tarafsız betimlenir;
 *     maddeler bir nedenin ne kadar uyduğunu sorar, bir uca güçlü yan ya da bedel eklemek bir nedeni yargılamak olurdu (10.
 *     maddedeki "her uçta bir kolaylık ve bir zorluk" aranmaz). Bileşiğin iki parçasından biri yüksek, öteki düşükse kart örnek
 *     göstermez ve profil yorumuna yönlendirir (`motivationPartsSplit`; T): satırlar parçaların maddelerinden yazıldığı için biri
 *     parçasının kendi kartıyla çelişirdi.
 * 13. İlgi, değer ve hobi:
 *     - İlgi (Holland, mesleki ilgi alanları): ilginin günlük hayatta nerede göründüğü anlatılır; meslek önerilmez, meslek adı
 *       öneri gibi geçmez; ilgi yetenek demek değildir (giriş bunu söyler). Düşük uç tarafsızdır: "pek çekici gelmeyebilir",
 *       "başka alanlara daha çok zaman ayırabilirsin"; uydurma bir bedel yazılmaz.
 *     - Değer: hiçbir değer ötekinden üstün ya da daha olgun gösterilmez (uçlarda da); düşük önem bir eksiklik değildir ve "işin
 *       kendisi" gibi bir iç değerle açıklanmaz. Değerler (ya da ilgi ve hobi alanları) arasındaki farklar küçükse giriş
 *       örneklerin birbirine benzeyebileceğini söyler (`flatSentence`; T).
 *     - Hobi ve serbest zaman (profil `activities`) ilgiyi değil son bir yıldaki sıklığı sorar: satırlar sıklığı ya da ayrılan
 *       zamanı söyler ("sık sık … -ebilirsin", "seyrek yer alabilir"); beğeni ("keyifli gelebilir", "hoşuna gidebilir",
 *       "isteyebilirsin") ve imkân ("pahalı", "harçlık") yok (T: sözcükler). Düşük uç yenilik, bilgi eksiği ya da ailenin
 *       imkânıyla açıklanmaz (yer anılabilir: "her yerde kolay bulunmaz"); sıklığın zamana ve imkânlara bağlı olduğunu girişi bir
 *       kez söyler. Yüksek ucun bedeli zamandır.
 *
 * Kapsayıcılık
 * 14. Kimsenin hayatı varsayılmaz: kendi odası, asansör, bahçe, araba, tatil, yurt dışı gezisi, özel ders, yakın arkadaş, kardeş
 *     (T: sözcükler); para, harçlık, evcil hayvan, gezi ve kurs yalnızca maddenin konusuysa anılır. "Annen, baban" yerine
 *     "evdekiler" (T: anne, baba); kız ya da erkek işi diye bir örnek yok (T: kız, erkek). Arkadaş anılırken "bir iki yakın
 *     arkadaş" değil "az kişi", "biri".
 * 15. Telefon ve mesaj: 1–4. sınıfa açık testte telefon, mesaj, tablet, internet yok (T: satırlar, tanım, kısa ad, başlık ve
 *     dallar). Daha büyüklere açık testte bir madde telefonu ya da mesajı sorarsa satır koşullu yazılır ("Yanında telefon varsa
 *     …"): telefonu olmayan biri de her düzeye düşebilir. "Ekran" telefon varsaymaz. İlkokulda yazılı sınav yapılmaz (MEB,
 *     2023): 1–4. sınıfa açık testte okul satırı sınav yerine gösteri, ödev, etkinlik anlatır.
 * 16. Herkesin evinde başkası yoktur (T): yetişkinin gördüğü hiçbir satır evdekilerden, evdeki birinden ya da aileden söz
 *     etmez. Yetişkinlere açık testte öğrencinin ev (ya da arkadaş) satırı evde başka birini varsayıyorsa yetişkine kendi satırı
 *     yazılır (`adult.home`, `adult.friends`; "yakınların", ya da herkese uyan bir sahne). "Evdeki bir iş", "evdeki bir sorun"
 *     herkesin evinde olur.
 * 17. Mezun (13. sınıf) okul satırlarını "Okulda ya da derslerde" başlığıyla görür: 13. sınıfa açık testte öğrenci ve veli
 *     metinlerinde "sınıf", "sınıf arkadaşı", "teneffüs" yok (T: satırlar, yönlendirmeler, tanım ve dallar); "derste", "ders
 *     arkadaşı", "ders aralarında" denir. Okul satırı sınava hazırlanan bir mezun için de anlamlıdır.
 * 18. Sınıf aralığı: 3–4. sınıfa açık testte öğrenci metni 8–9 yaşındaki bir çocuğun anlayacağı kadar somut ve kısadır
 *     (teneffüs, oyun, ödev, sofra); lise testlerinde ergenin hayatından örnekler (kulüp, proje, sınav haftası).
 *
 * Görev, okuma ve konu tarama testleri (`SkillsDaily`)
 * 19. Tanımlayıcı yazılır, kestirimde bulunulmaz: "Bu tür işlerdir", "bu beceriyi kullanır", "… gerektiren işlerde
 *     kullanılır". Sonuç, puan, zorlanma, başarı, test ve geliştirme anılmaz (T: "zorlan", "başarı", "sonucun", "puanın", "daha
 *     iyi", "geliştir", "güçlendir", "test"); düşük sonucun hayatta zorlanmak demek olduğu ima edilmez; "beyni çalıştırma" vaadi
 *     verilmez. Kartın metni başlığıyla başlamaz (T: "İşlem hızı" kartında "Bu beceri, …").
 * 20. Önce testin `whatItMeasures` ve `limitations` metnini oku. Bir örnek testin "bilgi vermez" dediği bir beceriye ya da sitede
 *     başka bir testin ölçtüğü beceriye (Sayı Dizileri, Kule Görevi, Görsel Algı Hızı, Kelime Bilgisi…) dayanmaz (T: testteki
 *     `EXCLUDED` tablosu; her satırın gerekçesi sınırlılık metninde geçer ya da kardeş test yayındadır). Kardeş testlerin
 *     örnekleri birbirinden farklıdır. Örnek testin nasıl çözüldüğüne uyar (Okuma'da sorular metne bakmadan cevaplanır:
 *     "bulmak" değil "hatırlamak").
 * 21. Her seferinde aynı soruların geldiği testlerde (Sayısal Akıl Yürütme, Düşünerek Karar Verme, Kule, Kelime Listesi, Desen)
 *     soruların konuları, nesneleri ve kelimeleri örneğe girmez (T: `EXCLUDED` tablosundaki `rule` satırları). Oyun örneği
 *     becerinin kendisini ister: sudoku ve satrançta kurallar verilir, kural bulmayı değil uygulamayı ister (T: Şekil Akıl
 *     Yürütme).
 * 22. Matematik ve gerçek dünya bilgisi: her örnek, formun konu tanımındaki (`plain`) bir konunun doğru bir örneğidir; kartın
 *     metni gösterildiği her forma uyar (konular formdan forma değişiyorsa kart forma göre bölünür: `forms`; T: her formun her
 *     alanı tek bir kartta). Sayıları elle hesapla. Hiçbir örnek misconceptions.ts'teki bir yanılgıyı beslemez (tek bir zarda
 *     bir sayının "daha olası" olması gibi). Bölmeyle çözülen bir problem cebir örneği değildir.
 *
 * Kime yazıldığı ve biçim
 * 23. Öğrenci (`student`) ve yetişkin (`adult`) "sen" der: ankette her satırda kesin ya da belirsiz bir "sen" işareti vardır
 *     (T: "sen", "sana", -sın, -dığın, -man, "kafan", "arkadaşlarınla", "hoşuna"…), "siz" yoktur (T). Veli (`parent`):
 *     "çocuğunuz", üçüncü kişi; her düzeyin üç satırından en az birinde "çocuğunuz" geçer ve hiçbir satırda kesin bir "sen"
 *     işareti yoktur (T: "seni", -sın, -dığın, -acağın, "kafan", "ilgini", "sözlerin"…; "hoşuna", "ne yapacağını" üçüncü kişide
 *     de doğrudur). Sesli okumanın veli ve öğretmen raporu "öğrenci" der (T). Aynı ölçeğin bir kitledeki dokuz satırı
 *     birbirinden farklıdır (T); anket satırı öğrenci ve veli için aynı olamaz (T; görevde yalnızca kişisiz bir satır aynı
 *     olabilir).
 *     Yetişkin (test yetişkinlere açıksa zorunlu, T): ilk ortam okul değil "İşte ya da günlük işlerde" (`work`); arkadaş ve ev
 *     satırları yalnızca öğrencininki yetişkine uymuyorsa yazılır (okul sözcüğü ya da 16. madde), yoksa öğrencininki
 *     kullanılır. Yetişkin metninde, kısa adda, başlıkta ve dallarda okul, ders, sınav, öğretmen, ödev, sınıf, teneffüs, karne,
 *     kantin, dershane, etüt gibi sözcükler geçmez (T: tests/helpers/school.ts).
 *     Uçlar (`poles`) bir maddeyi değil bütün ölçeği anlatır: testin `poles` metninden ve şablondaki `summary`'den başla; 2–4
 *     sözcük, en çok POLE_MAX_CHARS karakter (T); değer taşıyan fiil yok ("yetinir", "kaçınır"; T: sözcük listesi). Sor: bu uç
 *     senin için söylense incitir mi? Görevde dallar 2–4 sözcük (en çok BRANCH_MAX_CHARS), kutudaki kısa ad en çok
 *     CENTER_MAX_CHARS karakter ve sözcükleri en çok CENTER_WORD_MAX_CHARS karakter (lib/reports/visual-daily.ts; T).
 *     Dil: her örnek bir cümle (en çok iki; T); cümle en çok 22 sözcük (T), testin cümlelerinin ortalaması en çok 13 sözcük (T).
 *     Sade Türkçe; Türkçesi olan yabancı sözcük yok; "seviye" değil "düzey" (T); "tanı", "teşhis", "bozukluk", "hastalık",
 *     "normal", "zekâ puanı", "IQ" ve kişiyi yargılayan sözcükler yok (T). Yazım ve noktalama TDK'ye göre ("Türkiye'de", "hâl",
 *     "hikâye"; özneden sonra virgül: "Bu beceri, …"). Ortamın adı satırın başına yazılmaz (T; bölüm ekler).
 *
 * Süreç
 * 24. Yayından önce dosyayı yazmamış bir ajan her satırı dayandığı maddelerle ve bu listeyle karşılaştırır (Beyin
 *     Akademisi'ndeki gibi); bulduğu yanlışlar düzeltilir.
 * 25. Yeni dosya: örneklere bak (anket: merak.ts tek ölçekli olmayan, yetişkinli; bes-faktor-kisilik.ts beş boyutlu, beş
 *     düzeyli; görev: simge-bulma.ts, sekil-akil-yurutme.ts; okuma: okuma-hizi-ve-anlama.ts; konu tarama:
 *     matematik-konu-tarama-testi.ts). Dosyayı index.ts'e ekle; testin adresi tests/gunluk-hayat.test.ts'teki `DAILY_PENDING`
 *     listesindeyse oradan sil; ölçeklerin tonunu testteki GROWTH tablosuna yaz (gerekirse `GROWTH_SCALES`), görev testinde
 *     dışarıda bırakılan becerileri `EXCLUDED`'a. Test bütün ölçekleri, düzeyleri, ortamları ve kitleleri, dili ve grafikleri
 *     dener.
 */

/** Öğrenci ve veli metninde üç ortam: okulda, arkadaşlarla (görevlerde: oyunda ve arkadaşlarla), evde. */
export interface DailyLines {
  school: string;
  friends: string;
  home: string;
}

/**
 * Yetişkin metninde okul yerine iş ya da günlük işler (`work`); arkadaş ve ev satırları yalnızca öğrencininki yetişkine
 * uymuyorsa yazılır: okul sözcüğü geçiyorsa ya da evde başka birini (evdekiler, aile) varsayıyorsa (denetim listesinin 16. ve
 * 23. maddeleri). Yazılmazsa öğrencininki kullanılır.
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
   * yetişkinin iş satırı `work`). Anahtar testte bulunmalı, bu ölçeğin (ayrıntılı profilde boyutun alt özelliklerinin)
   * maddesi olmalı ve destek kutusunu açan bir madde olmamalıdır (denetim listesinin 1. ve 4. maddeleri).
   */
  from: { school: string[]; friends: string[]; home: string[]; work?: string[] };
  student: DailyLines;
  parent: DailyLines;
  /** Test yetişkinlere açıksa zorunlu. */
  adult?: AdultLines;
}

/** Örnek yerine kartta gösterilen yönlendirme (`ScaleDaily.pointer`; yetişkin metni verilmezse öğrencininki). */
export interface DailyPointer {
  student: string;
  parent: string;
  adult?: string;
}

/** Grafiğin iki ucu: düşük ve yüksek puanın günlük karşılığı (2–4 sözcük; değerlendirici testte düşük uç "Henüz" ile başlar). */
interface ScalePoles {
  poles: { low: string; high: string };
}

/**
 * Bir ölçeğin günlük hayattaki görünüşü: ya düzeylerin örnekleri (`bands`) ya da örnek yerine bir yönlendirme (`pointer`).
 * Yönlendirme, alt ölçekleri kendi kartlarında örneklenen ve kendi örnekleri onlarla çelişebilecek bileşik ölçek içindir
 * (denetim listesinin 5. maddesi): kartta rozet ve iki uç kalır, satırların yerine bu metin yazar.
 */
export type ScaleDaily =
  | (ScalePoles & {
      /** Düşük (çok düşük dahil), orta ve yüksek (çok yüksek dahil) düzeyin örnekleri. */
      bands: Record<LevelGroup, DailyBand>;
      pointer?: undefined;
    })
  | (ScalePoles & {
      /** Örnek yerine kartta yazan metin (ör. "Bu toplam puanın örnekleri aşağıdaki üç konunun kartlarında."). */
      pointer: DailyPointer;
      bands?: undefined;
    });

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
