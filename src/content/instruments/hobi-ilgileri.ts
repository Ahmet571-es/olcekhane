import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Hobi ve Serbest Zaman İlgileri
 * Kaynak: Oregon Hobi İlgileri Ölçekleri, ORAIS (Oregon Avocational Interest Scales; Goldberg, 2010). Uluslararası
 * Kişilik Madde Havuzu (IPIP) kapsamında yayımlanmıştır ve kamu malıdır: izin ve ücret gerektirmeden her amaçla
 * kullanılabilir, çevrilebilir (https://ipip.ori.org/). Ölçek, insanların ilgi duydukları etkinliklere daha çok zaman
 * ayırdığı fikrine dayanır: kişiye 209 etkinliği ne sıklıkla yaptığı sorulur ve etkinlikler 33 alanda (200 madde
 * yuvası; "Wrote poetry" iki alanda) puanlanır. Maddeler ve alanlar IPIP'in anahtar sayfasından
 * (https://ipip.ori.org/newORAISKey.htm) alındı, anket sayfasıyla (https://ipip.ori.org/newORAISSurvey.htm) karşılaştırıldı;
 * iki sayfada da kullanılan 92 maddenin metni ve numarası aynı. Bütün maddeler düz yönlüdür (IPIP: "All items are
 * +keyed"). Ölçek, ABD'de çoğu 50 yaşın üzerindeki ev sahibi yetişkinlerden oluşan Eugene-Springfield topluluk
 * örnekleminde geliştirilmiştir; geliştiricisi alanları "ön ölçekler" (preliminary scales) olarak tanıtır (Goldberg, 2008).
 *
 * Kullanılan alanlar: 33 alandan 16'sı (siteye ve 7. sınıftan yetişkinlere kadar herkese uyanlar).
 *  - Din ve siyaset (bilgi istememe ilkemiz): Religious/Spiritual Practices, Political/Organizational.
 *  - 18 yaşından küçükler için uygun değil: Drinking, Gambling, Romance.
 *  - Çoğunlukla yetişkinlere özgü etkinlikler: Financial (borsa, emeklilik), Vehicles (taşıt almak), Being Alone (tek
 *    başına seyahat ve tatil).
 *  - Güvenirliği çok düşük: Green Activities (α .52). (Başka nedenlerle alınmayan Vehicles .50 ve Romance .57 de düşük.)
 *  - Hobi olmaktan çok gündelik alışkanlık ya da ev işi: Food-Related, Housekeeping, Shopping, TV, Computing,
 *    Social-Networking, Music, Understanding (bazı maddeleri bugün pek kullanılmayan araçları anar: mp3 çalar, gazete
 *    ilanı, ansiklopedi).
 * Kalan 16 alanın maddelerinin hepsi kullanılır (93 yuva, 92 madde): "Wrote poetry" (82) hem yaratıcı etkinliklerde hem
 * yazma alanında puanlanır (`alsoScales`); madde bir kez sorulur.
 *
 * Uygulama: kaynaktaki yönerge ve beş cevap ("Never in my life" … "More than ten times in the past year"); maddeler
 * kaynaktaki numara sırasıyla sorulur (alanlar iç içe geçer). Yönergeye, eğitim ya da iş gereği zorunlu olarak yapılan
 * etkinliklerin sayılmaması gerektiği eklendi (ortaokul ve lise öğrencilerinde ör. beden eğitimi dersi, okul gezisi hobi
 * sıklığına karışmasın diye); ailecek ya da arkadaşlarla yapılanların ve evde üstlenilen işlerin (evcil hayvanı beslemek,
 * küçük bir çocuğa bakmak) sayıldığı ayrıca söylenir: kaynak bunları da sayar. Yönergede okula özgü sözcük yoktur
 * (yetişkinler de görür).
 *
 * Puanlama: her alanın puanı etkinliklerinin ortalamasıdır (1–5). Türkiye normu yoktur; alanlar kişinin kendi profili
 * içinde en sıktan en seyreğe sıralanır (profil: activities). Düzey sınırları sıklık cevaplarına göredir (aşağıda,
 * `anchoredBands`). Kaynakta alanların iç tutarlılığı .65–.86'dır (kitap okuma için değer verilmemiş); ortalama ve
 * standart sapmalar yayımlanmadığı için ölçüm payı gösterilmez. Etkinlik testlerinde "hiç yapmadım" ve "son bir yılda
 * yapmadım" cevaplarının üst üste gelmesi düz çizgi sayılmaz (lib/scoring/likert.ts).
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı ve kaynaktaki numarası durur. İki ayrı çeviri taslağı
 * hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi. Maddeler, cevap seçenekleriyle ("Bunu ne sıklıkla
 * yaptın?") uyumlu olsun diye etkinlik adı biçiminde yazıldı ("Müze gezmek"). Uyarlamalar ve açıklamalar:
 *  - Çocuklarla ilgili maddelerde "küçük bir çocuk" (cevap veren de çocuk olabilir); 112 "baby sitter": anne babası
 *    yanında değilken küçük bir çocuğa bakmak.
 *  - "Party" (46, 78, 111): "kutlama ya da eğlence" (sitedeki öteki testlerle aynı uyarlama); 106 "motel": pansiyon;
 *    119 "board game": tavla ya da kutu oyunu gibi bir masa oyunu; 86 "played cards": kart oyunu ("kâğıt oynamak"
 *    kumar çağrıştırır); 149 evcil hayvan "satın almak ya da sahiplenmek"; 171 "garden or yard": bahçe ya da balkon;
 *    175 "the comics": çizgi roman; 76 "beach": kumsal (sahil, şehirdeki deniz kenarı yürüyüş yollarını da kapsar).
 *  - Bugüne uyarlama: 35 "televised sports event": televizyonda ya da internette.
 *  - Açıklamalar: 74 "yard work" örneklerle (42 "gardened" ile karışmasın), 128 "studied some subject" merak edilen bir
 *    konuyu kendi isteğiyle, 141 "backpacking" birkaç günlük doğa gezisi, 170 "cruise" birkaç günlük gemi gezisi (173
 *    tekne gezintisiyle karışmasın), 199 "read in bed" kitap, 52 "fed a pet" yemek vermek ("beslemek" evcil hayvan sahibi
 *    olmak anlamına da gelir), 12 "diary or journal" günlük ("anı defteri" arkadaşların not yazdığı defter anlamına
 *    gelir), 142 basılı fotoğraflar (kaynaktaki gibi), 104 bir seferde; 50, 71 ve 129 çocukların anlayacağı örneklerle
 *    ("sanat eseri" yerine sanat çalışması; koşu bandı; tempolu yürüyüş), 208 halk ya da belediye kütüphanesi.
 *  - Bağımsız inceleme: madde çevirileri, düzey sınırları, yönerge ve rapor dili bu incelemeyle düzeltildi.
 *  - Yaptığımız aramada ORAIS'in yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 * Durum: uzman incelemesinde. Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const CH = 'children';
const CO = 'collecting';
const CR = 'creativity';
const CU = 'culture';
const EX = 'exercise';
const FA = 'fashion';
const GA = 'games';
const GR = 'gardening';
const GT = 'gatherings';
const PE = 'pets';
const RE = 'reading';
const SI = 'self_improvement';
const SP = 'sports';
const OU = 'outdoors';
const TR = 'travel';
const WR = 'writing';

/**
 * [kaynaktaki numara, alan (birden çoksa ilki asıl), Türkçe, İngilizce aslı] — kaynaktaki (ve uygulamadaki) sırayla.
 * Kaynaktaki alan adları: CH Child-Related, CO Collecting, CR Creativity, CU Culture, EX Exercise, FA Fashion,
 * GA Game-Playing, GR Gardening, GT Partying, PE Pets, RE Reading, SI Self-Improvement, SP Sports, OU Summer Activities,
 * TR Travel, WR Writing/Remembering.
 */
const ITEMS: [number, string | [string, string], string, string][] = [
  [4, SP, 'Spor hakkında sohbet etmek', 'Discussed sports.'],
  [6, EX, 'Koşuya çıkmak', 'Went running or jogging.'],
  [7, CU, 'Herkese açık bir konferansa ya da söyleşiye gitmek', 'Attended a public lecture.'],
  [8, TR, 'Seyahate çıkmak', 'Took a trip.'],
  [9, GR, 'Saksıdaki bir bitkinin bakımını yapmak', 'Cared for a potted plant.'],
  [11, OU, 'Pikniğe gitmek', 'Went on a picnic.'],
  [12, WR, 'Günlüğe bir şeyler yazmak', 'Made an entry in a diary or journal.'],
  [13, GT, 'Evine akşam yemeğine misafir çağırmak', 'Had someone over for dinner.'],
  [14, CH, 'Küçük bir çocukla oyun oynamak', 'Played with a child.'],
  [17, CR, 'Tamamen yeni bir şey denemek', 'Tried something completely new.'],
  [28, PE, 'Evcil bir hayvanla oynamak', 'Played with a pet animal.'],
  [29, FA, 'Ne giyeceğini 10 dakikadan fazla düşünmek', 'Spent more than 10 minutes thinking about what to wear.'],
  [31, CO, 'Koleksiyonunla uğraşmak', 'Worked on my collection.'],
  [35, SP, 'Televizyonda ya da internette bir spor karşılaşması izlemek', 'Watched a televised sports event.'],
  [39, EX, 'Ağırlık çalışmak', 'Lifted weights.'],
  [40, CU, 'Sanat sergisi gezmek', 'Visited an art exhibition.'],
  [41, TR, 'Görülmeye değer yerleri gezmek', 'Went sightseeing.'],
  [42, GR, 'Bahçede bitkilerle uğraşmak', 'Gardened.'],
  [44, OU, 'Doğa yürüyüşüne çıkmak', 'Went on a hike.'],
  [45, WR, 'Kartpostal yazmak', 'Wrote a postcard.'],
  [46, GT, 'Az kişilik bir kutlamaya ya da eğlenceye gitmek', 'Went to a small party.'],
  [47, CH, 'Bir oyunda küçük bir çocuğun kazanmasına izin vermek', 'Let a child win a game.'],
  [50, CR, 'Heykel, seramik ya da çizim gibi bir sanat çalışması yapmak', 'Produced a work of art.'],
  [52, PE, 'Evcil bir hayvana yemek vermek', 'Fed a pet animal.'],
  [54, GA, 'Yapboz yapmak', 'Worked on a jigsaw puzzle.'],
  [63, SI, 'Kişisel gelişim kitabı okumak', 'Read a self-help book.'],
  [64, CO, 'Koleksiyonun için bir şey satın almak', 'Bought something for my collection.'],
  [67, FA, 'Ne giyeceğini bir saatten fazla düşünmek', 'Spent more than an hour thinking about what to wear.'],
  [68, SP, 'Bir spor karşılaşmasını izlemeye gitmek', 'Attended an athletic event.'],
  [71, EX, 'Koşu bandı ya da kondisyon bisikleti gibi bir spor aleti kullanmak', 'Used an exercise machine.'],
  [72, CU, 'Müze gezmek', 'Visited a museum.'],
  [73, TR, 'Seyahatte fotoğraf çekmek', 'Took travel photographs.'],
  [74, GR, 'Çim biçme, yaprak toplama gibi bahçe işleri yapmak', 'Did yard work.'],
  [76, OU, 'Kumsalda yürümek', 'Walked on a beach.'],
  [77, WR, 'Elle mektup yazmak', 'Wrote a handwritten letter.'],
  [78, GT, 'Kalabalık bir kutlamaya ya da eğlenceye gitmek', 'Went to a large party.'],
  [79, CH, 'Küçük bir çocuğu gezmeye götürmek', 'Took a child on an outing.'],
  [82, [CR, WR], 'Şiir yazmak', 'Wrote poetry.'],
  [84, PE, 'Evcil bir hayvanın bakımını yapmak', 'Cared for a pet animal.'],
  [86, GA, 'Kart oyunu oynamak', 'Played cards.'],
  [89, CO, 'Koleksiyonundaki bir şeyi takas etmek', 'Traded something in my collection.'],
  [94, FA, 'Modayla ilgili bir dergi okumak', 'Read a fashion-related magazine.'],
  [95, SI, 'Kişisel gelişim kitabı satın almak', 'Bought a self-help book.'],
  [100, SP, 'Bir takım sporu oynamak', 'Played a team sport.'],
  [104, EX, 'Bir seferde en az 40 dakika egzersiz yapmak', 'Exercised for 40 minutes or longer.'],
  [105, CU, 'Bir bale gösterisine gitmek', 'Attended a ballet performance.'],
  [106, TR, 'Otelde, pansiyonda ya da tatil köyünde kalmak', 'Stayed in a hotel, motel, or resort.'],
  [107, GR, 'Bir bitki dikmek ya da bir bitkinin saksısını değiştirmek', 'Planted or transplanted a plant.'],
  [109, OU, 'Yüzmeye gitmek', 'Went swimming.'],
  [110, WR, 'Birine teşekkür etmek için not ya da kart yazmak', 'Wrote a thank-you note.'],
  [111, GT, 'Bir kutlama ya da eğlence düzenlemek', 'Planned a party.'],
  [112, CH, 'Anne babası yanında değilken küçük bir çocuğa bakmak', 'Served as a baby sitter.'],
  [113, RE, 'Kitap okumak', 'Read a book.'],
  [115, CR, 'Bir tiyatro oyununda rol almak', 'Acted in a play.'],
  [117, PE, 'Evcil bir hayvanı yıkamak ya da tüylerini taramak', 'Bathed or groomed a pet animal.'],
  [119, GA, 'Tavla ya da kutu oyunu gibi bir masa oyunu oynamak', 'Played a board game.'],
  [127, FA, 'Modayla ilgili bir kitap okumak', 'Read a fashion-related book.'],
  [128, SI, 'Merak ettiğin bir konuyu kendi isteğinle çalışmak', 'Studied some subject.'],
  [129, EX, 'Tempolu yürüyüş, bisiklete binme ya da ip atlama gibi aerobik egzersiz yapmak', 'Did aerobic exercise.'],
  [133, SP, 'Basketbol oynamak', 'Played basketball.'],
  [136, CO, 'Koleksiyonunu yaptığın şeylerle ilgili bir kitap okumak', 'Read a book about the things that I collect.'],
  [137, CU, 'Bir operaya ya da konsere gitmek', 'Attended an opera or a concert.'],
  [138, TR, 'Trenle ya da uçakla seyahat etmek', 'Traveled by train or plane.'],
  [139, GR, 'Çiçek satın almak ya da toplamak', 'Bought or picked flowers.'],
  [140, CH, 'Küçük bir çocuğa hikâye okumak', 'Read a story to a child.'],
  [141, OU, 'Sırt çantasıyla birkaç günlük doğa gezisine çıkmak ya da kamp yapmak', 'Went backpacking or camping.'],
  [142, WR, 'Basılı fotoğrafları bir albüme yerleştirmek', 'Put pictures in a photo album.'],
  [143, GT, 'Altı ya da daha fazla misafir ağırlamak', 'Entertained six or more people.'],
  [147, CR, 'Resim yapmak', 'Painted a picture.'],
  [149, PE, 'Evcil bir hayvan satın almak ya da sahiplenmek', 'Purchased a pet animal.'],
  [151, GA, 'Satranç ya da dama oynamak', 'Played chess or checkers.'],
  [159, FA, 'Modaya uygun bir kıyafet satın almak', 'Bought a fashionable item of clothing.'],
  [160, SI, 'Yeni bir beceri öğrenmek', 'Learned a new skill.'],
  [161, CO, 'Koleksiyonunu yaptığın şeylerle ilgili bir kitap satın almak', 'Bought a book about the things that I collect.'],
  [165, SP, 'Tenis ya da golf oynamak', 'Played tennis or golf.'],
  [168, EX, 'Yoga ya da benzeri egzersizler yapmak', 'Did yoga or other movement exercises.'],
  [169, CU, 'Bir tiyatro oyununa ya da müzikale gitmek', 'Attended a stage play or musical.'],
  [170, TR, 'Birkaç günlük bir gemi gezisine ya da organize bir tura katılmak', 'Went on a cruise or tour.'],
  [171, GR, 'Bahçe ya da balkon için bitki satın almak', 'Bought plants for a garden or yard.'],
  [173, OU, 'Tekneyle gezintiye çıkmak ya da rafting yapmak', 'Went boating or rafting.'],
  [174, WR, 'Fotoğraf, bilet gibi hatıraları bir deftere yapıştırmak', 'Worked on a scrap book.'],
  [175, CH, 'Küçük bir çocuğa çizgi roman okumak', 'Read the comics to a child.'],
  [176, RE, 'Kitap satın almak', 'Bought a book.'],
  [178, CR, 'Bir müzik aleti çalmak', 'Played a musical instrument.'],
  [182, GA, 'Yeni bir masa oyunu ya da kart oyunu öğrenmek', 'Learned a new board or card game.'],
  [190, SI, 'Bir kursa kaydolmak', 'Enrolled in a course of study.'],
  [194, OU, 'Balık tutmaya ya da ava gitmek', 'Went fishing or hunting.'],
  [196, EX, 'Bir egzersiz programına katılmak', 'Participated in an exercise program.'],
  [199, RE, 'Uyumadan önce yatakta kitap okumak', 'Read in bed before going to sleep.'],
  [200, CR, 'Topluluk önünde şarkı söylemek ya da müzik aleti çalmak', 'Sang or played an instrument in public.'],
  // Kaynakta 209, 208'den önce gelir (IPIP anahtarındaki sıra); anket sayfasındaki numara sırasıyla sorulur.
  [208, RE, 'Halk kütüphanesine ya da belediye kütüphanesine gitmek', 'Visited a public library.'],
  [209, RE, 'Bir kitabı tek oturuşta baştan sona okumak', 'Read an entire book in one sitting.'],
];

/** Kaynakta uyarlanan maddelerin numaraları (inceleme belgesi ve testler için). */
export const ORAIS_ADAPTED = [35, 46, 76, 78, 86, 106, 111, 119, 149, 171, 175];

const items: LikertItemDef[] = ITEMS.map(([n, scale, text, source]) => ({
  key: `h${String(n).padStart(3, '0')}`,
  scale: Array.isArray(scale) ? scale[0] : scale,
  ...(Array.isArray(scale) ? { alsoScales: scale.slice(1) } : {}),
  text,
  source,
}));

export const hobiIlgileri: LikertInstrument = {
  slug: 'hobi-ve-serbest-zaman-ilgileri',
  version: 1,
  engine: 'likert',
  profile: 'activities',
  name: 'Hobi ve Serbest Zaman İlgileri',
  shortName: 'Hobi ilgileri',
  domain: 'career',
  status: 'review',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 7,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 10,
  sortOrder: 32,
  tagline: 'Boş zamanında 16 alandaki (spor, sanat, kitap, doğa, oyunlar ve daha fazlası) etkinliklere ne sıklıkla zaman ayırdığını gösterir.',
  description:
    'Kamu malı Oregon Hobi İlgileri Ölçekleri’ne (ORAIS; Goldberg, 2010) dayanan bu test, insanların boş zamanlarında yaptığı 92 etkinliğin her birinin son bir yılda ne sıklıkla yapıldığını sorar ve sonuçları 16 alanda toplar: çocuklarla ilgilenme, koleksiyon, yaratıcı etkinlikler, kültür ve sanat, egzersiz, moda ve giyim, masa ve kart oyunları, bahçe ve bitkiler, davetler ve kutlamalar, evcil hayvanlar, kitap okuma, kendini geliştirme, spor, açık hava etkinlikleri, gezi ve seyahat ile yazma ve anı biriktirme. Sonuçta alanlar en sıktan en seyreğe sıralanır ve en sık uğraşılan alanlar açıklanır. Yaklaşık 10 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Boş zamanında neler yapıyorsun?',
    paragraphs: [
      'Birazdan insanların boş zamanlarında yaptığı 92 etkinlik göreceksin. Her birini ne sıklıkla yaptığını seç: hiç yapmadıysan ilk seçeneği, daha önce yapıp son bir yılda yapmadıysan ikinci seçeneği, son bir yılda yaptıysan kaç kez yaptığını işaretle.',
      'Zorunlu olarak yaptıklarını, örneğin eğitiminin ya da işinin gereği olarak yaptıklarını sayma. Ailecek, yakınlarınla ya da arkadaşlarınla birlikte yaptıkların ve evde üstlendiğin işler (ör. evcil hayvanı beslemek, küçük bir çocuğa bakmak) sayılır.',
      'Doğru ya da yanlış cevap yok. Tam sayıyı hatırlaman gerekmez; yaklaşık bir tahmin yeterli. Etkinliklerin bir kısmını hiç yapmamış olman çok olağan.',
    ],
  },
  prompt: 'Bunu ne sıklıkla yaptın?',
  options: [
    { value: 1, label: 'Hayatımda hiç yapmadım' },
    { value: 2, label: 'Daha önce yaptım, son bir yılda yapmadım' },
    { value: 3, label: 'Son bir yılda 1 ya da 2 kez' },
    { value: 4, label: 'Son bir yılda 3 ile 10 kez arası' },
    { value: 5, label: 'Son bir yılda 10 kezden fazla' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.75 },
  // Sıklık cevaplarına göre sınırlar (katılma ölçeklerindeki eşit aralıklar yerine): "Sık" için etkinliklerin çoğu son bir
  // yılda 3–10 kez (ortalama 3,8 ve üzeri), "Az" için çoğu son bir yılda hiç yapılmamış ya da yalnızca birkaçı 1–2 kez
  // yapılmış olmalı (2,8'in altı). Rapor üç düzey gösterir: az (çok düşük ve düşük), ara sıra, sık (yüksek ve çok yüksek).
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'very_low', min: 1 },
      { band: 'low', min: 2 },
      { band: 'average', min: 2.8 },
      { band: 'high', min: 3.8 },
      { band: 'very_high', min: 4.4 },
    ],
  },
  // Kaynaktaki (İngilizce adlara göre alfabetik) sırayla; aynı puandaki alanlar raporda bu sırayı korur.
  scales: [
    { key: CH, name: 'Çocuklarla ilgilenme', plain: 'Küçük çocuklarla oynamak, onlara hikâye okumak, onları gezmeye götürmek ve onlara bakmak.' },
    { key: CO, name: 'Koleksiyon', plain: 'Bir koleksiyonla uğraşmak, ona yeni parçalar eklemek, takas etmek ve koleksiyonla ilgili kitaplar okumak.' },
    { key: CR, name: 'Yaratıcı etkinlikler', plain: 'Resim yapmak, şiir yazmak, bir tiyatro oyununda rol almak, müzik aleti çalmak ve yeni şeyler denemek.' },
    { key: CU, name: 'Kültür ve sanat', plain: 'Müze ve sergi gezmek; konser, tiyatro, bale ve opera gibi gösterilere ve konferanslara gitmek.' },
    { key: EX, name: 'Egzersiz', plain: 'Koşu, ağırlık çalışması, yoga ve egzersiz programları gibi beden çalışmaları yapmak.' },
    { key: FA, name: 'Moda ve giyim', plain: 'Ne giyeceğini düşünmeye zaman ayırmak, moda hakkında okumak ve modaya uygun kıyafetler almak.' },
    { key: GA, name: 'Masa ve kart oyunları', plain: 'Yapboz yapmak; satranç, dama, tavla, kutu ve kart oyunları oynamak ve yeni oyunlar öğrenmek.' },
    { key: GR, name: 'Bahçe ve bitkiler', plain: 'Bitki yetiştirmek ve bitkilere bakmak, bahçe işleri yapmak, çiçek ve bitki almak.' },
    { key: GT, name: 'Davetler ve kutlamalar', plain: 'Kutlamalara ve eğlencelere gitmek, bunları düzenlemek ve evinde misafir ağırlamak.' },
    { key: PE, name: 'Evcil hayvanlar', plain: 'Evcil hayvanlarla oynamak, onları beslemek, bakımlarını yapmak ve evcil hayvan edinmek.' },
    { key: RE, name: 'Kitap okuma', plain: 'Kitap okumak ve almak, uyumadan önce okumak ve kütüphaneye gitmek.' },
    { key: SI, name: 'Kendini geliştirme', plain: 'Yeni beceriler öğrenmek, bir konuyu kendi isteğiyle çalışmak, kurslara katılmak ve kişisel gelişim kitapları okumak.' },
    { key: SP, name: 'Spor', plain: 'Takım sporları, basketbol ve tenis gibi sporlar yapmak; spor karşılaşmalarını izlemek ve spor üzerine sohbet etmek.' },
    { key: OU, name: 'Açık hava etkinlikleri', plain: 'Piknik, doğa yürüyüşü, yüzme, kamp, tekne gezisi ve balık tutma gibi açık havada yapılan etkinlikler.' },
    { key: TR, name: 'Gezi ve seyahat', plain: 'Seyahate çıkmak, görülmeye değer yerleri gezmek, otelde kalmak ve trenle ya da uçakla yolculuk etmek.' },
    {
      key: WR,
      name: 'Yazma ve anı biriktirme',
      plain: 'Günlük, mektup, kartpostal, şiir ve teşekkür notu yazmak; fotoğrafları ve hatıraları albümde ya da defterde biriktirmek.',
    },
  ],
  items,
  science: {
    basedOn:
      'Oregon Hobi İlgileri Ölçekleri, ORAIS (Goldberg, 2010): insanların boş zamanlarında yaptığı etkinlikleri, son bir yılda ne sıklıkla yapıldıklarına göre 33 alanda ölçen, Uluslararası Kişilik Madde Havuzu (IPIP) kapsamında yayımlanmış kamu malı bir ölçek. Ölçeğin geliştiricisi bu alanları “ön ölçekler” olarak tanıtmıştır. Bu testte 33 alandan 16’sı ve onların bütün etkinlikleri (92 madde) kullanılır. Din ve siyasetle ilgili iki alan, bu tür bilgileri istememe ilkemiz gereği; alkol, kumar ve flörtle ilgili üç alan 18 yaşından küçükler için uygun olmadığından; çoğunlukla yetişkinlere özgü etkinlikleri (yatırım, taşıt, tek başına tatil) soran üç alan; güvenirliği çok düşük bir alan (çevreci etkinlikler) ve hobi olmaktan çok gündelik alışkanlıkları ya da ev işlerini soran sekiz alan (yeme, ev işleri, alışveriş, televizyon, bilgisayar, sosyal ağlar, müzik dinleme, bilgi edinme) alınmadı.',
    whatItMeasures:
      'Son bir yılda 16 serbest zaman alanındaki etkinliklere ne sıklıkla zaman ayrıldığını ölçer: çocuklarla ilgilenme, koleksiyon, yaratıcı etkinlikler, kültür ve sanat, egzersiz, moda ve giyim, masa ve kart oyunları, bahçe ve bitkiler, davetler ve kutlamalar, evcil hayvanlar, kitap okuma, kendini geliştirme, spor, açık hava etkinlikleri, gezi ve seyahat ile yazma ve anı biriktirme. Ölçek, insanların ilgi duydukları etkinliklere daha çok zaman ayırdığı fikrine dayanır: bir alandaki etkinliklerin sıklığı o alana duyulan ilgi hakkında fikir verir; ama sıklık zamana, imkânlara ve yaşanan yere de bağlıdır. Her alan, etkinliklerinin ortalamasıyla puanlanır.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi: iki ayrı çeviri taslağı hazırlandı ve ikisi karşılaştırılarak her maddenin son hâli seçildi. Bazı maddeler Türkiye’ye uyarlandı: “parti” yerine “kutlama ya da eğlence”, “motel” yerine “pansiyon” denildi; evcil hayvan edinmeye sahiplenme, bitki almaya balkon, masa oyunlarına tavla örneği eklendi. Cevap veren de çocuk olabileceği için çocuklarla ilgili maddelerde “küçük bir çocuk” denildi. Yönergeye, eğitim ya da iş gereği zorunlu olarak yapılan etkinliklerin sayılmaması gerektiği eklendi. Yaptığımız aramada bu ölçeğin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in anahtar sayfasında bildirilen iç tutarlılık katsayıları (Cronbach α), kullanılan 16 alandan 15’i için .65 ile .86 arasındadır: yaratıcı etkinlikler, masa ve kart oyunları, kendini geliştirme ile yazma ve anı biriktirme alanlarında .65–.69, öteki 11 alanda .74–.86. Kitap okuma alanı için değer verilmemiştir. Ölçek, ABD’de çoğu 50 yaşın üzerindeki yetişkinlerden oluşan bir topluluk örnekleminde geliştirilmiştir. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre ve kişinin kendi profili içinde, en sıktan en seyreğe sıralanarak yorumlanır; sonuç başkalarıyla karşılaştırılmaz.',
    ageNote:
      '7. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Ölçek çoğu 50 yaşın üzerindeki yetişkinlerle geliştirilmiştir; ortaokul ve lise öğrencileriyle yapılmış bir çalışmaya ulaşılamadı. Öğrencilerde bazı etkinlikler (ör. seyahat, kurs, konser) ailenin imkânlarına ve kararlarına daha çok bağlıdır.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Sonuç, etkinliklerin son bir yılda ne sıklıkla yapıldığını gösterir; ilginin kendisini doğrudan ölçmez. Sıklık zamana, paraya, yaşanan yere, mevsime ve aileye de bağlıdır; az yapılan bir alana ilgi duyuluyor olabilir.',
      'Bir yetenek ya da başarı ölçümü değildir; bir alanın sık ya da az çıkması iyi ya da kötü anlamına gelmez.',
      'Testte kaynaktaki 33 alanın 16’sı vardır; müzik dinleme, bilgisayar ve sosyal medya, televizyon gibi bugün yaygın uğraşlar ve ev işleri kapsanmaz.',
      'Her alan beş ile yedi etkinlikle ölçülür ve bazı alanların güvenirliği orta düzeydedir (.65–.69); tek bir alana bakarak kesin sonuç çıkarılmamalıdır.',
      'Yazma ve anı biriktirme alanındaki bazı etkinlikler (kartpostal, elle yazılan mektup, basılı fotoğraf albümü) bugün eskisi kadar yaygın değildir; bu alan bu yüzden düşük çıkabilir.',
      'Maddelerin bir kısmı ABD’deki yaşamdan örnekler içerir (ör. golf, bale, gemi gezisi); bu etkinlikler Türkiye’de daha seyrek olduğu için bazı alanlar düşük çıkabilir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Goldberg, L. R. (2010). Personality, demographics, and self-reported behavioral acts: The development of avocational interest scales from estimates of the amount of time spent in interest-related activities. C. R. Agnew, D. E. Carlston, W. G. Graziano ve J. R. Kelly (Ed.), Then a miracle occurs: Focusing on behavior in social psychological theory and research. Oxford University Press.',
        url: 'https://doi.org/10.1093/acprof:oso/9780195377798.003.0011',
      },
      {
        text: 'Oregon Hobi İlgileri Ölçekleri: etkinlikler ve alanların anahtarı (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newORAISKey.htm',
      },
      {
        text: 'Goldberg, L. R. (2008). The Eugene-Springfield Community Sample: Information available from the research participants. Oregon Research Institute, teknik rapor.',
        url: 'https://darkwing.uoregon.edu/~gsaucier/ORI_TechnicalReport_ESCS_Mar08.pdf',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
    ],
  },
};
