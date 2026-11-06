import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Ders Çalışırken Telefon ve Dikkat
 * Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; Rosen ve arkadaşlarının (2013) teknoloji ve çalışma
 * ölçeklerinin, Akıllı Telefon Bağımlılığı Ölçeği'nin (Türkçe kısa formu: Noyan ve ark., 2015) ya da başka bir ölçeğin
 * maddeleri kullanılmamış, çevrilmemiştir. Bir bağımlılık ölçeği değildir: telefonla ilişki alışkanlık düzeyinde, çalışırken
 * dikkati ne sıklıkla böldüğüyle anlatılır; "bağımlılık" ya da klinik bir sözcük yoktur (tests/telefon-ve-dikkat.test.ts).
 *
 * Yapı. Çalışırken telefonun dikkati bölmesi üzerine yapılan araştırmaların ayırdığı yollar ve bunun önüne geçmek için
 * kullanılan yollar. Dört alan:
 *  - Bildirimlerin çekimi (notify): bildirim gelince işi bırakıp bakma, ekran yanınca gözün kayması, bakmasa da aklın bir süre
 *    bildirimde kalması (Stothart ve ark., 2015: bakılmayan bildirim de dikkat isteyen bir işte hatayı artırdı), mesajlara
 *    hemen cevap verme isteği, bildirime bakarken başka şeylere de bakmaya başlama; ters: bildirim gelse de aklın işte kalması
 *    (N2'nin karşıtı). Yüksek puan bildirimlerin çalışmayı sık böldüğünü gösterir.
 *  - Ekranlar arası geçiş (switching): iş ile telefon ya da başka bir ekran arasında gidip gelme, bir yandan mesajlaşma, işle
 *    ilgisiz sayfalara geçme, bir yandan işle ilgisiz video izleme, döndükten sonra nerede kalındığını bulmanın zaman alması
 *    (Rosen ve ark., 2013; May ve Elder, 2018); ters: ekranlara ancak mola verince bakma (S1'in karşıtı). Yüksek puan sık gidip
 *    gelmeyi gösterir.
 *  - Telefona dönme isteği (pull): bildirim gelmeden telefona uzanma, bir de bakınca telefonu elinde bulma, telefonda yeni bir
 *    şey olup olmadığını merak etme, aklına gelen bir şeye hemen telefondan bakma, zorlanınca telefona uzanma; ters: çalışırken
 *    telefonun akla gelmemesi (R1'in karşıtı). Yüksek puan bu isteğin sık duyulduğunu gösterir. Bağımsız inceleme (2026-11-06):
 *    "telefona düşündüğünden uzun bakma" (Akıllı Telefon Bağımlılığı Ölçeği'ndeki "niyet ettiğinden uzun kullanma" ölçütüne
 *    yakın) ve "telefon yanında değilken bir şeyleri kaçırıyormuş gibi hissetme" (telefonu hep yanında olan biri bu durumu
 *    yaşamaz) çıkarıldı.
 *  - Kendini durdurma yolları (control): telefonu sessizde tutma, görmeyeceği bir yere koyma, ne zaman bakılacağını önceden
 *    belirleme, dikkati dağıtan ekranları kapatma, oyalayan uygulamalar için süre sınırı ya da ayar kullanma (Kushlev ve ark.,
 *    2016; Fitz ve ark., 2019; durumu önceden düzenleyen yollar: Duckworth ve ark., 2016); ters: telefonun yanında, elinin
 *    altında durması. Yüksek puan bu yolların sık kullanıldığını gösterir.
 * İlk üç alanda yüksek puan bölünmenin sık yaşandığını, sonuncusunda yüksek puan yolların sık kullanıldığını gösterir; toplam
 * puan yoktur. Rapor değerlendirici değildir ve bütün alanlar günlük hayat örneklerinde gelişim tonundadır
 * (lib/reports/daily-parts.ts, `GROWTH_SLUGS`).
 *
 * Telefonu olmayanlar: yönerge, çalışırken yanında olan tableti, bilgisayarı ya da evdeki telefonu düşünmeyi söyler; hiçbiri
 * yoksa testin pek bir şey söylemeyebileceğini açıkça yazar ("yaşamadığın durumda Hiçbir zaman'ı seç" demez: ters cümleler
 * de "Hiçbir zaman" alır, cevaplar karşıt çiftlerde çelişirdi). Karşıt çiftler birbirinin tam tersidir (N2–N6: bildirimden
 * sonra akıl; S1–S6: ekranlara ne zaman bakıldığı; R1–R6: telefonun akla gelmesi) ve ters cümleleri, telefonu çalışmasını
 * pek bölmeyen birinin "Her zaman" diyeceği cümlelerdir: böyle biri ya da telefonu başka odada duran biri tutarlı cevaplarla
 * evet ya da hayır deme uyarısı almaz. Kendini durdurma yollarının ters cümlesi (K6, "telefonum yanımda durur") telefonu yanında olmayan biri için de
 * "Hiçbir zaman" olduğundan karşıt çift değildir. Telefonu çalışmasını pek bölmeyen ve bu yolları az kullanan birinin dört
 * alanı da düşük çıkar; birlikte yorum bunu ayrıca söyler.
 *
 * Maddeler "çalışırken" der, okula özgü sözcük taşımaz: yetişkinlere de açıktır (bir şey öğrenen, okuyan ya da odaklanması
 * gereken bir işi yapan herkes). Her alanda altı madde ve bir ters madde (24 maddenin 4'ü); birbirinin tersini söyleyen üç
 * çift. Testin adındaki "ders çalışırken" site sahibinin seçtiği addır; yetişkine giden yönerge, soru ve rapor metinleri
 * "çalışırken" der.
 *
 * Puanlama: her alan maddelerinin ortalamasıdır (1–5); en az %80'i cevaplanmalıdır. Düzeyler bir ondalıklı ortalamaya
 * göredir: 1,0–2,4 düşük ("nadiren" ve daha seyrek), 2,5–3,4 orta ("bazen"), 3,5–5,0 yüksek ("sık sık" ve daha sık).
 * Destek kutusu yoktur (bir sağlık ya da ruh sağlığı ölçümü değildir); sınırlılıklar telefon kullanımı günlük hayatı belirgin
 * biçimde zorlaştırıyorsa bir uzmanla görüşmeyi anar. Durum: pilot.
 */

const N = 'notify';
const S = 'switching';
const R = 'pull';
const K = 'control';

/**
 * Uygulama sırası: her dörtlükte alanlar sırayla döner (kendini durdurma, bildirimler, geçiş, dönme isteği). Çalışırken
 * telefonu pek bölünmeyen biri düz cümlelerin çoğuna "Hiçbir zaman" ya da "Nadiren", S6, N6 ve R6'ya "Sık sık" ya da "Her
 * zaman" der: bu üç cümle 7., 14. ve 20. sıradadır ki böyle biri en çok altı cümle üst üste aynı seçeneği işaretlesin ("hep
 * aynı seçenek" uyarısı 12'de başlar). Karşıt çiftlerin cümleleri en az 12 sıra arayla gelir.
 */
const RAW: { key: string; scale: string; text: string; reverse?: boolean }[] = [
  { key: 'K1', scale: K, text: 'Çalışırken telefonumu sessizde tutarım.' },
  { key: 'N2', scale: N, text: 'Çalışırken gelen bir bildirime bakmasam da aklım bir süre ona gider.' },
  { key: 'S2', scale: S, text: 'Çalışırken bir yandan mesajlaşırım.' },
  { key: 'R1', scale: R, text: 'Çalışırken bir bildirim gelmese de “Bir bakayım” diye telefonu elime alırım.' },

  { key: 'K2', scale: K, text: 'Çalışırken telefonumu göremeyeceğim bir yere (çantaya, başka bir odaya) koyarım.' },
  { key: 'N1', scale: N, text: 'Çalışırken bir bildirim sesi duyunca elimdeki işi bırakıp telefona bakarım.' },
  { key: 'S6', scale: S, reverse: true, text: 'Çalışırken ekranlara ancak mola verince bakarım.' },
  { key: 'R2', scale: R, text: 'Çalışırken bir de bakarım ki telefonu elime almışım.' },

  { key: 'K3', scale: K, text: 'Telefona ne zaman bakacağımı önceden belirlerim, örneğin bir bölümü bitirince.' },
  { key: 'N3', scale: N, text: 'Çalışırken gelen mesajlara hemen cevap vermem gerektiğini hissederim.' },
  { key: 'S3', scale: S, text: 'Bilgisayarda ya da tablette çalışırken işimle ilgisi olmayan sayfalara geçerim.' },
  { key: 'R3', scale: R, text: 'Çalışırken telefonumda yeni bir şey olup olmadığını merak ederim.' },

  { key: 'K4', scale: K, text: 'Çalışmaya başlamadan önce dikkatimi dağıtabilecek ekranları kapatırım.' },
  { key: 'N6', scale: N, reverse: true, text: 'Çalışırken bir bildirim gelse de aklım işimde kalır.' },
  { key: 'S4', scale: S, text: 'Çalışırken bir yandan işimle ilgisi olmayan bir video ya da dizi izlerim.' },
  { key: 'R4', scale: R, text: 'Çalışırken işimle ilgisi olmayan bir şey aklıma gelince hemen telefondan bakarım.' },

  { key: 'K6', scale: K, reverse: true, text: 'Çalışırken telefonum yanımda, elimin altında durur.' },
  { key: 'N4', scale: N, text: 'Çalışırken telefonumun ekranı yanınca gözüm ona kayar.' },
  { key: 'S1', scale: S, text: 'Çalışırken işimle telefon ya da başka bir ekran arasında gidip gelirim.' },
  { key: 'R6', scale: R, reverse: true, text: 'Çalışırken telefon aklıma gelmez.' },

  { key: 'K5', scale: K, text: 'Çalışırken beni oyalayan uygulamalar için bir süre sınırı ya da ayar kullanırım.' },
  { key: 'N5', scale: N, text: 'Bir bildirime bakmak için telefonu elime alınca başka şeylere de bakmaya başlarım.' },
  { key: 'S5', scale: S, text: 'Telefona bakıp işime döndüğümde nerede kaldığımı bulmam zaman alır.' },
  { key: 'R5', scale: R, text: 'Çalışırken zorlandığım bir yere gelince telefona uzanırım.' },
];

export const telefonVeDikkat: LikertInstrument = {
  slug: 'ders-calisirken-telefon-ve-dikkat',
  version: 1,
  engine: 'likert',
  name: 'Ders Çalışırken Telefon ve Dikkat',
  shortName: 'Telefon ve dikkat',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 4,
  sortOrder: 35.9,
  tagline:
    'Çalışırken bildirimlerin, ekranlar arasında gidip gelmenin ve telefona dönme isteğinin dikkatini ne sıklıkla böldüğünü ve bunun önüne geçmek için hangi yolları kullandığını gösterir.',
  description:
    'Bu test çalışırken telefonun ve ekranların dikkati nasıl böldüğünü dört alanda inceler: gelen bildirimlerin çekimi, telefon ya da başka ekranlar ile iş arasında gidip gelme, bildirim gelmeden de telefona dönme isteği ve bunların önüne geçmek için kullanılan yollar (sessizde tutmak, telefonu görmeyeceği bir yere koymak, ne zaman bakacağını önceden belirlemek gibi). Rapor her alanı ayrı ayrı anlatır, ardından birlikte yorumlar ve araştırmaların ne bulduğunu abartmadan söyler. Bir bağımlılık testi değildir; telefon kullanımını yargılamaz, alışkanlıkları anlatır. Maddeler sıfırdan yazılmıştır; test yaklaşık 4 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Sonuç bir tanı değildir.',
  intro: {
    title: 'Çalışırken telefon dikkatini ne kadar bölüyor?',
    paragraphs: [
      'Birazdan çalışırken telefonla ve ekranlarla ilgili 24 cümle göreceksin: bildirimler, ekranlar arasında gidip gelme, telefona dönme isteği ve kendini durdurmak için kullandığın yollar. Her birinin senin için ne sıklıkla doğru olduğunu seç.',
      '“Çalışırken” deyince bir şey öğrendiğin, okuduğun, yazdığın ya da odaklanman gereken bir işi yaptığın zamanları düşün. Kendi telefonun yoksa çalışırken yanında olan bir tableti, bilgisayarı ya da evde ortak kullanılan bir telefonu düşünebilirsin. Çalışırken yanında hiçbiri olmuyorsa bu test sana pek bir şey söylemeyebilir.',
      'Doğru ya da yanlış cevap yok; bu bir başarı testi değil ve telefon kullanımını yargılamaz. Olması gerekeni değil, gerçekte nasıl olduğunu seçersen rapor sana en çok yarar.',
    ],
  },
  prompt: 'Bu senin için ne sıklıkla doğru?',
  options: [
    { value: 1, label: 'Hiçbir zaman' },
    { value: 2, label: 'Nadiren' },
    { value: 3, label: 'Bazen' },
    { value: 4, label: 'Sık sık' },
    { value: 5, label: 'Her zaman' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.8 },
  // Bir ondalıklı ortalamaya göre: 1,0–2,4 düşük ("nadiren" ve daha seyrek), 2,5–3,4 orta ("bazen"), 3,5–5,0 yüksek
  // ("sık sık" ve daha sık).
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'low', min: 1 },
      { band: 'average', min: 2.5 },
      { band: 'high', min: 3.5 },
    ],
  },
  oppositePairs: [
    ['N2', 'N6'],
    ['S1', 'S6'],
    ['R1', 'R6'],
  ],
  scales: [
    {
      key: N,
      name: 'Bildirimlerin çekimi',
      plain:
        'Çalışırken gelen bildirimlerin dikkati ne kadar çektiği: sesi duyunca ya da ekran yanınca telefona bakma, bakmasa da aklın bir süre bildirimde kalması, mesajlara hemen cevap verme isteği. Puan yüksekse bildirimler çalışmayı sık böler.',
      poles: { low: 'Bildirimler pek bölmez', high: 'Bildirimler sık böler' },
    },
    {
      key: S,
      name: 'Ekranlar arası geçiş',
      plain:
        'Çalışırken iş ile telefon ya da başka bir ekran arasında gidip gelme, bir yandan mesajlaşma, işle ilgisi olmayan sayfalara ya da videolara geçme ve işe dönünce nerede kalındığını bulmanın zaman alması. Puan yüksekse iş ile ekranlar arasında sık gidip gelinir.',
      poles: { low: 'Dikkati işte kalır', high: 'Ekranlara sık geçer' },
    },
    {
      key: R,
      name: 'Telefona dönme isteği',
      plain:
        'Bildirim gelmeden de telefona uzanma: bir de bakınca telefonu elinde bulma, telefonda yeni bir şey olup olmadığını merak etme, aklına gelen bir şeye hemen telefondan bakma, zorlanınca telefona uzanma. Puan yüksekse bu istek sık duyulur.',
      poles: { low: 'Telefon pek akla gelmez', high: 'Telefona sık uzanır' },
    },
    {
      key: K,
      name: 'Kendini durdurma yolları',
      plain:
        'Telefonun ve ekranların çalışmayı bölmemesi için kullanılan yollar: telefonu sessizde tutmak, görmeyeceği bir yere koymak, ne zaman bakılacağını önceden belirlemek, dikkati dağıtan ekranları kapatmak, oyalayan uygulamalar için süre sınırı kullanmak. Puan yüksekse bu yollar sık kullanılır.',
      poles: { low: 'Bu yolları az kullanır', high: 'Bu yolları sık kullanır' },
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; başka bir ölçeğin maddeleri kullanılmamış ve çevrilmemiştir. Yapısı, çalışırken telefonun dikkati bölmesi üzerine yapılan araştırmaların ayırdığı yollara dayanır: gelen bildirimler (Stothart ve ark., 2015; Kushlev ve ark., 2016), iş ile ekranlar arasında gidip gelme ve aynı anda birden çok şeyle uğraşma (Rosen ve ark., 2013; May ve Elder, 2018) ve bildirim gelmeden de telefona dönme. Dördüncü alan, bu bölünmenin önüne geçmek için kullanılan yollardır: bildirimleri kapatmak (Kushlev ve ark., 2016) ya da belirli zamanlarda toplu almak (Fitz ve ark., 2019), telefonu görmeyeceği bir yere koymak ve isteğin doğacağı durumu önceden düzenlemek (Duckworth ve ark., 2016). Bir bağımlılık ölçeği değildir: telefonla ilişkiyi alışkanlık düzeyinde, çalışırken dikkati ne sıklıkla böldüğüyle anlatır.',
    whatItMeasures:
      'Bu test çalışırken telefonun ve ekranların dikkati ne sıklıkla böldüğünü dört alanda ölçer: gelen bildirimlerin çekimi (sesi duyunca ya da ekran yanınca bakmak, bakmasa da aklın bildirimde kalması, mesajlara hemen cevap verme isteği); ekranlar arası geçiş (iş ile ekranlar arasında gidip gelmek, bir yandan mesajlaşmak, işe dönünce nerede kalındığını bulmanın zaman alması); telefona dönme isteği (bildirim gelmeden de telefona uzanmak, telefonda yeni bir şey olup olmadığını merak etmek, aklına gelen bir şeye hemen telefondan bakmak) ve kendini durdurma yolları (sessizde tutmak, telefonu görmeyeceği bir yere koymak, ne zaman bakacağını önceden belirlemek, uygulamalara süre sınırı koymak). İlk üç alanda yüksek puan bölünmenin sık yaşandığını, sonuncusunda yolların sık kullanıldığını gösterir; toplam bir puan yoktur.\n\nBir deneyde katılımcıların telefonlarına, onlar dikkat isteyen bir bilgisayar görevini yaparken arama ya da mesaj bildirimi gönderilmiştir; bildirime bakmayan ya da cevap vermeyen katılımcılar da görevde daha çok hata yapmıştır; bu dikkat dağınıklığı, önceki çalışmalarda telefonla konuşurken ya da mesajlaşırken görülen dikkat dağınıklığına yakın büyüklüktedir (Stothart ve ark., 2015). 221 üniversite öğrencisiyle yapılan bir çalışmada öğrenciler bir hafta bildirimleri açık ve telefonu yakında, bir hafta bildirimleri kapalı ve telefonu uzakta tutmuştur; bildirimlerin açık olduğu haftada dikkatlerinin daha sık dağıldığını ve daha huzursuz olduklarını bildirmişlerdir; etki orta büyüklüktedir; ölçümler öğrencilerin kendi bildirimine dayanır ve öğrenciler hangi haftada olduklarını biliyordu (Kushlev ve ark., 2016). Evinde 15 dakika çalışırken dakika dakika gözlenen 263 ortaokul, lise ve üniversite öğrencisi, ortalama altı dakikadan kısa sürede çalışmayı bırakıp başka bir şeye geçmiştir; en sık nedenler mesajlar, sosyal medya ve işler arasında geçmeyi sevmektir. Çalışma sırasında Facebook’a girenlerin not ortalaması daha düşük, çalışma yöntemlerini sık kullananların işte kalma olasılığı daha yüksektir (Rosen ve ark., 2013). Büyük bir üniversite örnekleminde ders çalışırken Facebook’ta vakit geçirmek ve mesajlaşmak daha düşük not ortalamasıyla birlikte görülmüş, e-posta ve internette arama yapmak görülmemiştir (Junco ve Cotten, 2012). 38 çalışmayı inceleyen bir derlemeye göre çalışırken ya da derste aynı anda medya kullanmak dikkati ve çalışma belleğini zorlar; daha düşük notlar, test sonuçları, hatırlama ve okuduğunu anlamayla birlikte görülür; öğrenciler bu etkiyi çoğu zaman olduğundan küçük görür. Bu çalışmaların çoğu üniversite öğrencileriyle yapılmıştır (May ve Elder, 2018).\n\nTelefonun yalnızca yanda durmasının da kullanılabilir zihinsel kapasiteyi (çalışma belleği gibi) azalttığı ileri sürülmüştür (Ward ve ark., 2017); ancak aynı deneyi önceden kaydedilmiş yöntemle tekrarlayan bir çalışma bu etkiyi bulamamıştır (Ruiz Pardo ve Minda, 2022) ve 56 etkiyi birleştiren bir incelemede yalnızca çalışma belleğinde küçük bir etki görülmüş, öteki ölçümlerde görülmemiştir; çalışmaların çoğu küçüktür (Parry, 2024). Bu yüzden test, telefonun yalnızca yanda durmasının dikkati azalttığını varsaymaz; telefonu uzağa koymayı, bölünmenin önüne geçmek için kullanılan yollardan biri olarak sorar. PISA 2022’de OECD ülkelerindeki 15 yaşındaki öğrencilerin %65’i matematik derslerinin en azından bazılarında dijital cihaz kullanırken dikkatinin dağıldığını, %45’i dijital cihazları yanında olmayınca gergin ya da kaygılı hissettiğini söylemiştir. OECD ortalamasında, matematik derslerinin en azından bazılarında başka öğrencilerin cihazları yüzünden dikkatinin dağıldığını söyleyenlerin matematik puanı, bunun hiç ya da neredeyse hiç olmadığını söyleyenlerden, öğrencilerin ve okulların sosyoekonomik durumu hesaba katıldıktan sonra da 15 puan düşüktür; bu bir ilişkidir, neden-sonuç göstermez (OECD, 2023).\n\nKendini durdurma yollarında: 237 kişiyle yapılan bir alan deneyinde bildirimlerini günde üç kez toplu alanlar kendilerini daha dikkatli, daha verimli ve telefonlarını daha çok denetliyor hissetmiştir; bildirimleri saatte bir toplu almanın etkisi az olmuş, hiç bildirim almayanlar ise daha çok kaygı ve bir şeyleri kaçırma korkusu bildirmiştir (Fitz ve ark., 2019). İsteğin doğacağı durumu önceden düzenleyen yollar (telefonu başka bir odada bırakmak gibi), istek doğduktan sonra ona direnmekten daha kolay olabilir (Duckworth ve ark., 2016). Bu test çalışma başarısını ölçmez ve öngörmez.',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Türkiye’de akıllı telefon kullanımını ölçen uyarlanmış ölçekler daha çok bağımlılık kavramıyla çalışır; örneğin Akıllı Telefon Bağımlılığı Ölçeği’nin kısa formu üniversite öğrencileriyle Türkçeye uyarlanmıştır (Noyan ve ark., 2015). Bu test bağımlılığı ölçmez; maddeleri o ölçeklerin maddeleri değildir ve o çalışmaların sonuçları bu test için norm sayılmaz. Üç alanda birbirinin tersini söyleyen birer cümle çifti vardır; üç çiftten en az ikisinde iki cümleye de aynı yöndeki iki seçenekten biri (“Sık sık” ya da “Her zaman”; “Hiçbir zaman” ya da “Nadiren”) verilirse raporda uyarı gösterilir.',
    reliability: 'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar cevapların ortalamasına göre (1: hiçbir zaman, 5: her zaman) yorumlanır; kişi başkalarıyla karşılaştırılmaz.',
    ageNote:
      '5. sınıftan itibaren; mezunlar ve yetişkinler de çözebilir (bir şey öğrenen, okuyan ya da odaklanması gereken bir işi yapan herkes). Kendi telefonu olmayanlar çalışırken yanında olan tableti, bilgisayarı ya da evde ortak kullanılan bir telefonu düşünerek cevaplayabilir; çalışırken yanında hiçbir ekran olmayan biri için test pek bir şey söylemeyebilir. Bu konudaki araştırmaların önemli bir kısmı üniversite öğrencileriyle yapılmıştır (May ve Elder, 2018); ortaokul ve lise öğrencilerini de içeren çalışmalar daha azdır (Rosen ve ark., 2013 bunlardan biridir).',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Kişinin kendi bildirimine dayanır. İnsanlar telefonu ne kadar ve ne sıklıkla kullandıklarını çoğu zaman tam kestiremez: kendi bildirimleri ile cihazın kayıtları yalnızca orta düzeyde örtüşür (Parry ve ark., 2021).',
      'Bir bağımlılık ölçeği değildir. Tanı koymaz; bir ruh sağlığı taraması değildir. Telefon ya da ekran kullanımı uzun süredir uykuyu, okula ya da işe gitmeyi ya da günlük hayatı belirgin biçimde zorlaştırıyorsa okulun rehberlik servisiyle ya da bir uzmanla görüşmek iyi gelebilir.',
      'Telefonun her kullanımı dikkati bölmez: çalışırken sözlüğe bakmak, hesap yapmak ya da konuyla ilgili bir videoyu izlemek bu testin sorduğu bölünme değildir. Cümleler işle ilgisi olmayan bakışları ve geçişleri sorar.',
      'Kendini durdurma yollarının puanı bir yolun ne sıklıkla kullanıldığını gösterir, işe yarayıp yaramadığını göstermez. Telefonu çalışmasını pek bölmeyen ya da telefonu olmayan biri bu yolları az kullanabilir; bu bir eksiklik değildir.',
      'Araştırmaların çoğu bir ilişkiyi gösterir, neden-sonucu değil: çalışırken telefona sık bakmak ile daha düşük notlar arasındaki ilişkinin başka nedenleri de olabilir. Bu test çalışma başarısını ölçmez ve öngörmez.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı. Her alan altı cümleyle ölçüldüğü için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      {
        text: 'Stothart, C., Mitchum, A. ve Yehnert, C. (2015). The attentional cost of receiving a cell phone notification. Journal of Experimental Psychology: Human Perception and Performance, 41(4), 893–897.',
        url: 'https://doi.org/10.1037/xhp0000100',
      },
      {
        text: 'Kushlev, K., Proulx, J. ve Dunn, E. W. (2016). “Silence your phones”: Smartphone notifications increase inattention and hyperactivity symptoms. Proceedings of the 2016 CHI Conference on Human Factors in Computing Systems (s. 1011–1020). ACM.',
        url: 'https://doi.org/10.1145/2858036.2858359',
      },
      {
        text: 'Rosen, L. D., Carrier, L. M. ve Cheever, N. A. (2013). Facebook and texting made me do it: Media-induced task-switching while studying. Computers in Human Behavior, 29(3), 948–958.',
        url: 'https://doi.org/10.1016/j.chb.2012.12.001',
      },
      {
        text: 'Junco, R. ve Cotten, S. R. (2012). No A 4 U: The relationship between multitasking and academic performance. Computers & Education, 59(2), 505–514.',
        url: 'https://doi.org/10.1016/j.compedu.2011.12.023',
      },
      {
        text: 'May, K. E. ve Elder, A. D. (2018). Efficient, helpful, or distracting? A literature review of media multitasking in relation to academic performance. International Journal of Educational Technology in Higher Education, 15, 13.',
        url: 'https://doi.org/10.1186/s41239-018-0096-z',
      },
      {
        text: 'Ward, A. F., Duke, K., Gneezy, A. ve Bos, M. W. (2017). Brain drain: The mere presence of one’s own smartphone reduces available cognitive capacity. Journal of the Association for Consumer Research, 2(2), 140–154.',
        url: 'https://doi.org/10.1086/691462',
      },
      {
        text: 'Ruiz Pardo, A. C. ve Minda, J. P. (2022). Reexamining the “brain drain” effect: A replication of Ward et al. (2017). Acta Psychologica, 230, 103717.',
        url: 'https://doi.org/10.1016/j.actpsy.2022.103717',
      },
      {
        text: 'Parry, D. A. (2024). Does the mere presence of a smartphone impact cognitive performance? A meta-analysis of the “brain drain effect”. Media Psychology, 27(5), 737–762.',
        url: 'https://doi.org/10.1080/15213269.2023.2286647',
      },
      {
        text: 'OECD (2023). PISA 2022 results (Volume II): Learning during – and from – disruption. OECD Publishing.',
        url: 'https://doi.org/10.1787/a97db61c-en',
      },
      {
        text: 'Fitz, N., Kushlev, K., Jagannathan, R., Lewis, T., Paliwal, D. ve Ariely, D. (2019). Batching smartphone notifications can improve well-being. Computers in Human Behavior, 101, 84–94.',
        url: 'https://doi.org/10.1016/j.chb.2019.07.016',
      },
      {
        text: 'Duckworth, A. L., Gendler, T. S. ve Gross, J. J. (2016). Situational strategies for self-control. Perspectives on Psychological Science, 11(1), 35–55.',
        url: 'https://doi.org/10.1177/1745691615623247',
      },
      {
        text: 'Parry, D. A., Davidson, B. I., Sewall, C. J. R., Fisher, J. T., Mieczkowski, H. ve Quintana, D. S. (2021). A systematic review and meta-analysis of discrepancies between logged and self-reported digital media use. Nature Human Behaviour, 5(11), 1535–1547.',
        url: 'https://doi.org/10.1038/s41562-021-01117-5',
      },
      {
        text: 'Noyan, C. O., Enez Darçın, A., Nurmedov, S., Yılmaz, O. ve Dilbaz, N. (2015). Validity and reliability of the Turkish version of the Smartphone Addiction Scale-Short Version among university students. Anadolu Psikiyatri Dergisi, 16(Özel sayı 1), 73–81.',
        url: 'https://doi.org/10.5455/apd.176101',
      },
    ],
  },
};
