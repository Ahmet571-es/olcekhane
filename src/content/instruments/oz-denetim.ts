import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Öz-denetim
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) NEO-PI-R'ye benzeyen üç ön ölçeği. Kamu malıdır: izin ve ücret
 * gerektirmeden her amaçla kullanılabilir (https://ipip.ori.org/newPermission.htm: "for any purpose, commercial or
 * non-commercial") ve çevrilebilir (https://ipip.ori.org/).
 *  - IPIP-NEO "Cautiousness" (C6) → Düşünerek davranma (https://ipip.ori.org/newNEOFacetsKey.htm; 3 artı + 7 eksi madde, α .76,
 *    ortalama madde ilişkisi .24; NEO-PI-R'nin asıl "Deliberation" (C6) yönüyle ilişkisi .69, ölçüm hatası düzeltilince .95;
 *    tablo https://ipip.ori.org/newNEO_FacetsTable.htm).
 *  - IPIP-NEO "Self-Discipline" (C5) → Öz-disiplin (5 artı + 5 eksi madde, α .85, ortalama madde ilişkisi .36; NEO-PI-R'nin
 *    "Self-Discipline" yönüyle .76, düzeltilince .92).
 *  - IPIP-NEO "Immoderation" (N5), ters çevrilerek → Kendini tutabilme (5 artı + 5 eksi madde, α .77, ortalama madde
 *    ilişkisi .25; NEO-PI-R'nin "Impulsiveness" (N5) yönüyle .73, düzeltilince .98). Yemeyle ilgili iki madde sorulmaz:
 *    "Often eat too much." (gençlerde beden ve yeme konusunda hassas olabilir) ve "Love to eat." (yemekten hoşlanmayı sorar,
 *    kendini tutmayı değil). Sitedeki IPIP-NEO-120 (Ayrıntılı Kişilik Profili) bu yönün dört maddesinde de bu ikisini
 *    sormaz. Kalan sekiz maddenin güvenirliği ortalama madde ilişkisiyle (Spearman–Brown) yaklaşık .73 beklenir (8 × .25 /
 *    (1 + 7 × .25)); bu bizim hesabımızdır.
 * NEO tablosu örneklemi belirtmez (IPIP'in CPI, MPQ ve 6FPQ tabloları Eugene-Springfield Topluluk Örneklemi'nin
 * yetişkinleridir). IPIP bu ölçekleri "preliminary" (ön) ölçekler olarak sunar. Maddeler ve yönleri anahtar sayfasından iki
 * ayrı okumayla alındı; iki okuma bütün maddelerde (metin, sıra ve yön) aynı çıktı. Üç ölçek arasında ortak madde yoktur.
 *
 * Seçim: IPIP'in kavram dizininde öz-denetimle ilgili VIA dışı ölçekler (Self-control, Self-discipline, Impulse-control,
 * Cautiousness, Prudence, Deliberateness, Immoderation, Planfulness) karşılaştırıldı. HEXACO "Prudence" (α .80) maddelerinin
 * hepsi Altı Boyutlu Kişilik Profili'nde zaten var ve içerik dikkat, mahcubiyet ve planlamaya kayar; 6FPQ "Deliberateness"
 * C6 ve N5 ile altı madde paylaşır; MPQ "Planfulness" (Control) maddelerinin dokuzu Öğrenme ve Başarı Özellikleri'nde var;
 * CPI "Self-Control" (α .71) duygusal sakinlik ve görgü maddeleri ("Use swear words") karıştırır; TCI'nin dürtü denetimi
 * ölçeklerinin başlık ve güvenirlik değerleri IPIP sayfasından okunamadı. Üç NEO yönü ise ayrı, ortak maddesiz ve asıl
 * ölçekleriyle yüksek ilişkili ölçeklerdir; öz-denetimin iki bileşen ayrımına (dürtüsellik ve öz-disiplin; Türkçe Kısa
 * Öz-Kontrol Ölçeği, Nebioğlu ve ark., 2012) bir de ayartılara karşı kendini tutmayı ekler.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Sitedeki öteki testlerde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (23 madde).
 *  - Kalan 5 madde için iki ayrı çeviri taslağı hazırlandı (ikincisi birincisi görülmeden); ikisi karşılaştırılarak son hâl
 *    seçildi (bir maddede iki taslak aynıydı). "Choose my words with care" için "Sözlerimi" yerine "Kelimelerimi" ("söz"
 *    vaat diye de okunur); "Stick to my chosen path" için "yoldan şaşmam" yerine olumlu "yola bağlı kalırım" ("Hiç doğru
 *    değil" ile çift olumsuzluk olmasın); para maddelerinde "Never" korunarak "asla"; harçlıkla da dürüstçe cevaplanabilsin
 *    diye "bütçe", "gelir" gibi yetişkine özgü sözcükler kullanılmadı.
 *  - Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 *
 * Madde anahtarı: ölçeğin kısaltması (dus, dis, tut) + maddenin IPIP anahtar sayfasındaki sırası (sayfa her ölçekte önce
 * artı, sonra eksi yönlü maddeleri verir; N5'te sayfanın artı yönlü maddeleri ölçüsüzlüğü söyler, bu testte ters puanlanır;
 * sorulmayan iki yeme maddesi tut01 ve tut05'tir). Uygulama sırası: üç ölçek sırayla döner; art arda iki madde aynı ölçekten
 * değildir. Birbirine benzeyen ya da birbirinin tersini söyleyen maddeler birbirinden uzaktır (tests/oz-denetim.test.ts
 * denetler).
 *
 * Puanlama: her ölçek maddelerinin ortalamasıdır (1–5); en az dörtte üçü cevaplanmalıdır. Düzeyler öteki IPIP testlerindeki
 * gibi üçtür (2,6 ve 3,4 eşikleri). Toplam bir puan hesaplanmaz.
 *
 * Evet deme eğilimi: Düşünerek davranmanın on maddesinden yedisi ters yönlü, kendini tutabilmenin sekiz maddesinden beşi düz
 * yönlüdür; öz-disiplinde yarı yarıya. Birbirinin tersini söyleyen dört çift (`oppositePairs`) aynı uç cevabı yakalar: üçü
 * öz-disiplinde, biri kendini tutabilmede. Düşünerek davranmanın düz maddeleri (hata yapmaktan kaçınmak, kelimeleri özenle
 * seçmek, seçilen yola bağlı kalmak) ters maddelerinin tam karşıtı değildir; konuşurken özenli olup davranırken anlık
 * davranan biri ikisine de dürüstçe "doğru" diyebilir. Bu yüzden o alandan çift alınmadı.
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const DUS = 'deliberation';
const DIS = 'discipline';
const TUT = 'restraint';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { dus: DUS, dis: DIS, tut: TUT };

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['dus03', false, 'Seçtiğim yola bağlı kalırım.', 'Stick to my chosen path.'],
  ['dis01', false, 'Yapmam gereken işleri hemen hallederim.', 'Get chores done right away.'],
  ['tut07', false, 'Cazip gelen şeylere kolayca direnebilirim.', 'Easily resist temptations.'],
  ['dus04', true, 'Düşünmeden işlere atılırım.', 'Jump into things without thinking.'],
  ['dis06', true, 'Oturup çalışmaya başlamak bana zor gelir.', 'Find it difficult to get down to work.'],
  ['tut04', true, 'Kendimi kaptırıp aşırıya kaçarım.', 'Go on binges.'],
  ['dus02', false, 'Kelimelerimi özenle seçerim.', 'Choose my words with care.'],
  ['dis03', false, 'Görevlerime vakit kaybetmeden başlarım.', 'Start tasks right away.'],
  ['tut09', false, 'Paramın yettiğinden fazlasını asla harcamam.', 'Never spend more than I can afford.'],
  ['dus07', true, 'Bir işe acele edip hemen dalarım.', 'Rush into things.'],
  ['dis02', false, 'Her zaman hazırlıklı olurum.', 'Am always prepared.'],
  ['tut02', true, 'Yaptığım bazı şeyleri neden yaptığımı bilmiyorum.', "Don't know why I do some of the things I do."],
  ['dus08', true, 'Çılgınlıklar yaparım.', 'Do crazy things.'],
  ['dis08', true, 'Bir işe başlamam için birinin beni dürtmesi gerekir.', 'Need a push to get started.'],
  ['tut06', false, 'Nadiren aşırıya kaçarım.', 'Rarely overindulge.'],
  ['dus05', true, 'Aceleci kararlar veririm.', 'Make rash decisions.'],
  ['dis07', true, 'Zamanımı boşa harcarım.', 'Waste my time.'],
  ['tut03', true, 'Sonradan pişman olduğum şeyler yaparım.', 'Do things I later regret.'],
  ['dus01', false, 'Hata yapmaktan kaçınırım.', 'Avoid mistakes.'],
  ['dis04', false, 'Hemen işe koyulurum.', 'Get to work at once.'],
  ['tut08', false, 'Canım bir şeyi çok çektiğinde kendimi tutabilirim.', 'Am able to control my cravings.'],
  ['dus06', true, 'Aklıma estiği gibi davranmayı severim.', 'Like to act on a whim.'],
  ['dis10', true, 'Karar vermeyi ertelerim.', 'Postpone decisions.'],
  ['tut10', false, 'Asla savurganca para harcamam.', 'Never splurge.'],
  ['dus09', true, 'Düşünmeden hareket ederim.', 'Act without thinking.'],
  ['dis05', false, 'Yaptığım planları uygularım.', 'Carry out my plans.'],
  ['dus10', true, 'Planlarımı sık sık son dakikada yaparım.', 'Often make last-minute plans.'],
  ['dis09', true, 'İşlere başlamakta zorlanırım.', 'Have difficulty starting tasks.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const ozDenetim: LikertInstrument = {
  slug: 'oz-denetim',
  version: 1,
  engine: 'likert',
  name: 'Öz-denetim',
  shortName: 'Öz-denetim',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 15.98,
  tagline: 'Kendini yönetebilmeyi üç alanda gösterir: düşünerek davranma, işe koyulma ve isteklere karşı kendini tutabilme.',
  description:
    'Öz-denetim, o an cazip gelen ile uzun vadede daha değerli olan arasında ikincisini seçebilmektir. Bu test onu üç alanda gösterir: bir şeyi yapmadan önce düşünme ve aceleci kararlar vermeme; yapılacak işlere vakit kaybetmeden koyulma ve planları uygulama (öz-disiplin); cazip gelen şeylere karşı kendini tutabilme ve aşırıya kaçmama. Kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ölçeğine dayanır; 28 kısa cümleden oluşur ve yaklaşık 5 dakika sürer. Rapor, üç alanın birlikte ne anlatabileceğini ve gündelik hayatta denenebilecek küçük adımları da anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Sonuç kişinin kendini nasıl tanımladığını gösterir; ne kadar başarılı olduğunu ölçmez. Tanı koymaz.',
  intro: {
    title: 'Kendini ne kadar yönetebiliyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 28 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Cümleler karar vermekle, işlere koyulmakla ve cazip gelen şeylerle ilgili. Belirli bir günü değil, genellikle nasıl olduğunu düşünerek cevap ver.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar. Yaklaşık 5 dakika sürer.',
    ],
  },
  prompt: 'Bu cümle seni ne kadar doğru anlatıyor?',
  options: [
    { value: 1, label: 'Hiç doğru değil' },
    { value: 2, label: 'Pek doğru değil' },
    { value: 3, label: 'Ne doğru ne yanlış' },
    { value: 4, label: 'Oldukça doğru' },
    { value: 5, label: 'Tamamen doğru' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.75 },
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'very_low', min: 1 },
      { band: 'low', min: 1.8 },
      { band: 'average', min: 2.6 },
      { band: 'high', min: 3.4 },
      { band: 'very_high', min: 4.2 },
    ],
  },
  oppositePairs: [
    ['dis03', 'dis09'],
    ['dis04', 'dis06'],
    ['tut06', 'tut04'],
    ['dis01', 'dis08'],
  ],
  scales: [
    {
      key: DUS,
      name: 'Düşünerek davranma',
      plain:
        'Bir şeyi yapmadan ya da söylemeden önce düşünme: işlere düşünmeden atılmama, aceleci kararlar vermeme ve aklına estiği gibi davranmama; kelimelerini özenle seçme, hata yapmaktan kaçınma ve seçtiği yola bağlı kalma.',
      poles: { low: 'Anlık davranmaya yatkın', high: 'Düşünerek davranan' },
    },
    {
      key: DIS,
      name: 'Öz-disiplin',
      plain:
        'Yapılacak işlere vakit kaybetmeden koyulma, hazırlıklı olma ve yaptığı planları uygulama; başlamak için birinin dürtmesine ihtiyaç duymama, zamanını boşa harcamama ve kararları ertelememe.',
      poles: { low: 'İşe başlamakta zorlanan', high: 'İşe hemen koyulan' },
    },
    {
      key: TUT,
      name: 'Kendini tutabilme',
      plain:
        'Cazip gelen şeylere ve anlık isteklere karşı koyabilme: kendini kaptırıp aşırıya kaçmama, parasını savurganca harcamama ve sonradan pişman olacağı şeyleri yapmama; yaptıklarının nedenini bilme.',
      poles: { low: 'İsteklerine kolay kapılan', high: 'Kendini tutabilen' },
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) NEO Kişilik Envanteri’ne (NEO-PI-R) benzeyen üç ön ölçeği: temkinlilik (Cautiousness), öz-disiplin (Self-Discipline) ve ölçüsüzlük (Immoderation). IPIP’in kavram dizini ilk ikisini “Cautiousness” ve “Self-discipline” başlıkları altında listeler. Üçüncü ölçek bu testte yönü çevrilerek kullanılır: yüksek puan kendini tutabilmeyi gösterir. Maddeler IPIP’indir (Goldberg ve ark., 2006). İlk iki ölçeğin bütün maddeleri sorulur. Üçüncü ölçeğin yemeyle ilgili iki maddesi sorulmaz: biri yemekten hoşlanmayı sorar, kendini tutmayı değil; öteki gençlerde beden ve yeme konusunda hassas olabilir. Böylece 28 madde kalır; ölçekler arasında ortak madde yoktur.',
    whatItMeasures:
      'Öz-denetim, baskın tepki eğilimlerini değiştirebilme ya da durdurabilme ve davranışı, düşünceleri ve duyguları düzenleyebilme gücü olarak tanımlanır (de Ridder ve ark., 2012). Gündelik dille, “o an cazip gelen” ile “uzun vadede daha değerli olan” arasında ikincisini seçebilmektir (Duckworth ve ark., 2018). Sorumluluk denilen geniş kişilik özelliğinin ayırt edilebilen yönlerinden biri sayılır (Roberts ve ark., 2005). Türkçeye uyarlanan Kısa Öz-Kontrol Ölçeği’nde öz-denetim iki bileşene ayrılmıştır: dürtüsellik ve öz-disiplin (Nebioğlu ve ark., 2012). Bu test öz-denetimi üç alanda ayrı ayrı gösterir: bir şeyi yapmadan önce düşünme (düşünerek davranma), yapılacak işe koyulup sürdürme (öz-disiplin) ve cazip gelen şeylere karşı kendini tutabilme. Üç alan ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.\n\n102 çalışmayı (toplam 32.648 kişi) birleştiren bir incelemede öz-denetim ile birçok davranış arasında küçük ile orta büyüklükte ilişkiler bulunmuştur. En sık kullanılan öz-denetim ölçeğinde ortalama ilişki .26’dır; okul ve işle ilgili davranışlarda .36, iyi oluş ve uyumda .33, ilişkilerde .25’tir. Bu çalışmaların çoğu tek bir zamanda yapılmıştır ve bazı analizlerde davranış da anketle ölçüldüğünde ilişkiler daha güçlü çıkmıştır; bu yüzden sonuçlar neden-sonuç ilişkisi gibi okunmamalıdır (de Ridder ve ark., 2012). Yaklaşık 1.000 çocuğun doğumdan 32 yaşına kadar izlendiği bir çalışmada çocukluktaki öz-denetim yetişkinlikteki sağlığı, maddi durumu, madde bağımlılığını ve suça karışmayı basamaklı biçimde öngörmüştür; bu ilişki zekâdan ve ailenin toplumsal durumundan ayrı olarak da görülmüştür (Moffitt ve ark., 2011). 8. sınıf öğrencileriyle yapılan iki çalışmada öğrencinin kendisi, ailesi ve öğretmeni gibi birkaç kaynaktan ölçülen öz-disiplin yıl sonu notlarını öngörmüştür; zekâ testinin de uygulandığı ikinci çalışmada (164 öğrenci) öz-disiplin, yıl sonu notlarındaki farkların zekâ testinin iki katından fazlasını açıklamıştır (Duckworth ve Seligman, 2005). Yetişkinlerle yapılan üç çalışmada öz-denetimi yüksek olanların duygusal iyi oluşu ve yaşam doyumu daha yüksek bulunmuştur; bunun bir nedeni, hedefleri arasındaki çatışmaları daha iyi yönetmeleridir (Hofmann ve ark., 2014).\n\nÖz-denetim yalnızca dişini sıkıp direnmek demek değildir. Öz-denetimi yüksek olanlar gündelik hayatta daha az ayartı ve iç çatışma yaşadıklarını bildirmiştir (Hofmann ve ark., 2012’den aktaran Gillebaart, 2018). Öz-denetim ile iyi sonuçlar arasındaki bağ kısmen yararlı alışkanlıklardan geçiyor görünmektedir: toplam 2.274 kişiyle yapılan altı çalışmanın sonuçları bu görüşü desteklemiştir; örneğin bir çalışmada ödev alışkanlıkları, öz-denetim ile derse katılım ve ödevi bitirme arasındaki ilişkiye aracılık etmiştir (Galla ve Duckworth, 2015). Ortamı önceden düzenlemek de güçlü bir yol olabilir: kütüphaneye telefonsuz giden öğrenci gibi, isteği daha başında, güçlenmeden zayıflatan seçimler anlık bir isteğe direnmekten daha kolay ve etkili olabilir (Duckworth ve ark., 2016).\n\nYaş grupları karşılaştırıldığında dürtüsellik 10 yaşından itibaren düzenli olarak azalmaktadır (10–30 yaş arasındaki 935 kişi; Steinberg ve ark., 2008). 11 ülkeden 5.000’i aşkın kişiyle yapılan bir çalışmada kendini düzenleme ergenlikten genç yetişkinliğe doğru artmış ve 23–26 yaşları arasında düzleşmiştir (Steinberg ve ark., 2018). Öz-denetimi eğitimle artırmayı amaçlayan çalışmaları birleştiren bir incelemede etki küçük ile orta arası bulunmuş (g = 0,30), yayın yanlılığı için düzeltme yapılınca daha da küçülmüştür (g = 0,13–0,24; Friese ve ark., 2017). “Şu durum olursa şunu yapacağım” biçimindeki eğer-o zaman planlarının hedefe ulaşmaya etkisi ise 94 bağımsız sınamayı birleştiren bir incelemede ortalama d = 0,65 bulunmuştur (Gollwitzer ve Sheeran, 2006’dan aktaran Duckworth ve ark., 2018). İradenin her kullanımda azalan bir yakıt gibi tükendiği düşüncesi, birçok laboratuvarın, yöntemini önceden kaydederek yaptığı iki büyük tekrar çalışmasında desteklenmemiştir: bulunan etki sıfıra çok yakındır (Hagger ve ark., 2016; Vohs ve ark., 2021).',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki testlerde birebir aynı olan 23 maddenin çevirisi korundu; kalan 5 madde iki ayrı taslakla çevrilip karşılaştırıldı. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’de öz-denetimi ölçen başka ölçekler uyarlanmıştır: Kısa Öz-Kontrol Ölçeği psikiyatrik tanısı olmayan 523 kişiyle (Nebioğlu ve ark., 2012), iki öz-kontrol ölçeği üniversite öğrencileriyle (Şimşir ve Koç, 2022), Çok Boyutlu Özdenetim Ölçeği 308 lisans öğrencisiyle (Gülüm ve Tığrak, 2022); ergenlerde dürtüselliği ölçen Barratt Dürtüsellik Ölçeği’nin kısa formu psikiyatri polikliniğine başvuran ergenler ile ortaokul ve lise öğrencileriyle (Benk Durmuş ve ark., 2022). Bu testin maddeleri o ölçeklerin maddeleri değildir ve o çalışmaların sonuçları bu test için norm sayılmaz. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfasında iç tutarlılık (Cronbach α) şöyle bildirilir: temkinlilik (bu testte düşünerek davranma) .76; öz-disiplin .85; ölçüsüzlük (bu testte ters yönde: kendini tutabilme) .77. IPIP ölçeklerinin NEO-PI-R’deki karşılıklarıyla ilişkisi: temkinlilik, NEO-PI-R’nin “Deliberation” (düşünüp taşınma) yönüyle .69 (ölçüm hatası düzeltilince .95); öz-disiplin, NEO-PI-R’nin öz-disiplin yönüyle .76 (.92); ölçüsüzlük, NEO-PI-R’nin “Impulsiveness” (dürtüsellik) yönüyle .73 (.98). Tablo örneklemi belirtmez. Bu testte ölçüsüzlük ölçeğinin on maddesinden sekizi sorulur; tablodaki ortalama madde ilişkisine (.25) göre sekiz maddenin güvenirliğinin yaklaşık .73 olması beklenir (bizim hesabımız). Açık veriye bu çalışmada ulaşılamadığı için standart sapmalar hesaplanamadı; raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, başkalarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak ölçeklerin güvenirlik tablosu örneklemi belirtmez; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı. Öz-denetim gençlik yıllarında gelişmeye devam eder: dürtüsellik 10 yaşından itibaren azalır, kendini düzenleme yirmili yaşların ortasına kadar artar (Steinberg ve ark., 2008, 2018). Bu yüzden lise öğrencilerinde sonuç o dönemin bir resmi olarak düşünülmelidir. Elazığ’da 423 lise öğrencisiyle yapılan bir çalışmada ise öz-denetim sınıf düzeyine göre anlamlı bir fark göstermemiştir (Özgül, 2017).',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. O günkü ruh hâli ve kendini nasıl göstermek istediği cevapları etkileyebilir. Öz-denetim değer verilen bir özellik olduğu için insanlar kendilerini olduğundan biraz daha olumlu anlatabilir; “Her zaman hazırlıklı olurum.” cümlesi IPIP’te, insanların kendini olduğundan iyi gösterme eğilimini yakalayan bir ölçekte de yer alır.',
      'Test kişinin ne kadar başarılı ya da çalışkan olduğunu ölçmez. Araştırmalardaki ilişkiler küçük ile orta büyüklüktedir ve çoğu tek bir zamanda yapılmış çalışmalardan gelir (de Ridder ve ark., 2012).',
      'Düşünerek davranmanın on cümlesinden yedisi ters yöndedir: cümlelerin çoğuna “doğru” deme eğilimi bu alanın puanını biraz düşürebilir; kendini tutabilmenin sekiz cümlesinden beşi düz yönde olduğu için aynı eğilim o alanın puanını biraz yükseltebilir. Birbirinin tersini söyleyen dört cümle çiftinden (üçü öz-disiplinde, biri kendini tutabilmede) en az ikisinde iki cümleye de aynı yöndeki iki seçenekten biri (“Oldukça doğru” ya da “Tamamen doğru”; “Hiç doğru değil” ya da “Pek doğru değil”) verilirse raporda “evet ya da hayır deme eğilimi” uyarısı gösterilir.',
      '28 cümlenin 23’ü sitedeki öteki testlerde de sorulur: on ikisi Ayrıntılı Kişilik Profili’nde, onu Öğrenme ve Başarı Özellikleri’nde, beşi Altı Boyutlu Kişilik Profili’nde, dördü Kişiliğin 10 Yönü’nde, üçü Düşünme ve Çalışma Tarzı’nda, üçü Liderlik Eğilimleri’nde, ikisi Beş Faktör Kişilik Profili’nde ve ikisi Heyecan Arayışı’nda; birer cümle de Hızlı Kişilik Testi ile 16 Faktörlü Kişilik Profili’nde (bir cümle birden çok testte olabilir). Ayrıntılı Kişilik Profili bu testin üç alanını dörder cümleyle (öz disiplin, temkinlilik ve ölçülülük), bu test ise daha çok cümleyle ölçer. Heyecan Arayışı’ndaki iki cümle (“Çılgınlıklar yaparım.”, “Aklıma estiği gibi davranmayı severim.”) orada heyecan arayışını, burada düşünerek davranmanın tersini gösterir. Bu yüzden sonuçlar birbirine benzeyebilir.',
      'Sitedeki Erteleme ve Zaman Yönetimi testi işleri ertelemeyi ve zamanı yönetmeyi, Öğrenme ve Başarı Özellikleri’nin “İşe hemen koyulma” alanı da işe başlamayı ayrıca sorar; öz-disiplin puanı bunlarla benzer çıkabilir.',
      'Kendini tutabilmenin iki cümlesi parayla ilgilidir ve “asla” der. Kendi parası az olan gençler bu cümleleri harçlıklarını düşünerek cevaplayabilir; harcayacak parası pek olmayan biri için bu cümleler kolayca “doğru” olabilir. “Asla” sözcüğü de uç cevapları artırabilir.',
      'Tanı koymaz; dikkat eksikliği ve hiperaktivite bozukluğu ya da bağımlılık gibi durumların taraması değildir ve uzman değerlendirmesinin yerini tutmaz. Bir alışkanlığın kontrolden çıktığı ve günlük hayatı etkilediği düşünülüyorsa bir uzmandan destek almak iyi gelebilir.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır. Ölçüm payı hesaplanamadığı için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      { text: 'IPIP. NEO-PI-R’ye benzeyen IPIP ölçeklerinin anahtarları (temkinlilik, öz-disiplin, ölçüsüzlük).', url: 'https://ipip.ori.org/newNEOFacetsKey.htm' },
      { text: 'IPIP. NEO-PI-R yönlerinin özet tablosu (güvenirlik ve NEO-PI-R ile ilişki).', url: 'https://ipip.ori.org/newNEO_FacetsTable.htm' },
      { text: 'IPIP. Kavramların alfabetik dizini (öz-denetim, öz-disiplin, temkinlilik).', url: 'https://ipip.ori.org/newIndexofScaleLabels.htm' },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'de Ridder, D. T. D., Lensvelt-Mulders, G., Finkenauer, C., Stok, F. M. ve Baumeister, R. F. (2012). Taking stock of self-control: A meta-analysis of how trait self-control relates to a wide range of behaviors. Personality and Social Psychology Review, 16(1), 76–99.',
        url: 'https://doi.org/10.1177/1088868311418749',
      },
      {
        text: 'Duckworth, A. L., Milkman, K. L. ve Laibson, D. (2018). Beyond willpower: Strategies for reducing failures of self-control. Psychological Science in the Public Interest, 19(3), 102–129.',
        url: 'https://doi.org/10.1177/1529100618821893',
      },
      {
        text: 'Roberts, B. W., Chernyshenko, O. S., Stark, S. ve Goldberg, L. R. (2005). The structure of conscientiousness: An empirical investigation based on seven major personality questionnaires. Personnel Psychology, 58(1), 103–139.',
        url: 'https://doi.org/10.1111/j.1744-6570.2005.00301.x',
      },
      {
        text: 'Nebioğlu, M., Konuk, N., Akbaba, S. ve Eroğlu, Y. (2012). The investigation of validity and reliability of the Turkish version of the Brief Self-Control Scale. Klinik Psikofarmakoloji Bülteni–Bulletin of Clinical Psychopharmacology, 22(4), 340–351.',
        url: 'https://doi.org/10.5455/bcp.20120911042732',
      },
      {
        text: 'Moffitt, T. E., Arseneault, L., Belsky, D., Dickson, N., Hancox, R. J., Harrington, H., Houts, R., Poulton, R., Roberts, B. W., Ross, S., Sears, M. R., Thomson, W. M. ve Caspi, A. (2011). A gradient of childhood self-control predicts health, wealth, and public safety. Proceedings of the National Academy of Sciences, 108(7), 2693–2698.',
        url: 'https://doi.org/10.1073/pnas.1010076108',
      },
      {
        text: 'Duckworth, A. L. ve Seligman, M. E. P. (2005). Self-discipline outdoes IQ in predicting academic performance of adolescents. Psychological Science, 16(12), 939–944.',
        url: 'https://doi.org/10.1111/j.1467-9280.2005.01641.x',
      },
      {
        text: 'Hofmann, W., Luhmann, M., Fisher, R. R., Vohs, K. D. ve Baumeister, R. F. (2014). Yes, but are they happy? Effects of trait self-control on affective well-being and life satisfaction. Journal of Personality, 82(4), 265–277.',
        url: 'https://doi.org/10.1111/jopy.12050',
      },
      {
        text: 'Gillebaart, M. (2018). The ‘operational’ definition of self-control. Frontiers in Psychology, 9, 1231.',
        url: 'https://doi.org/10.3389/fpsyg.2018.01231',
      },
      {
        text: 'Galla, B. M. ve Duckworth, A. L. (2015). More than resisting temptation: Beneficial habits mediate the relationship between self-control and positive life outcomes. Journal of Personality and Social Psychology, 109(3), 508–525.',
        url: 'https://doi.org/10.1037/pspp0000026',
      },
      {
        text: 'Duckworth, A. L., Gendler, T. S. ve Gross, J. J. (2016). Situational strategies for self-control. Perspectives on Psychological Science, 11(1), 35–55.',
        url: 'https://doi.org/10.1177/1745691615623247',
      },
      {
        text: 'Steinberg, L., Albert, D., Cauffman, E., Banich, M. T., Graham, S. ve Woolard, J. (2008). Age differences in sensation seeking and impulsivity as indexed by behavior and self-report: Evidence for a dual systems model. Developmental Psychology, 44(6), 1764–1778.',
        url: 'https://doi.org/10.1037/a0012955',
      },
      {
        text: 'Steinberg, L., Icenogle, G., Shulman, E. P., Breiner, K., Chein, J. ve ark. (2018). Around the world, adolescence is a time of heightened sensation seeking and immature self-regulation. Developmental Science, 21(2), e12532.',
        url: 'https://doi.org/10.1111/desc.12532',
      },
      {
        text: 'Friese, M., Frankenbach, J., Job, V. ve Loschelder, D. D. (2017). Does self-control training improve self-control? A meta-analysis. Perspectives on Psychological Science, 12(6), 1077–1099.',
        url: 'https://doi.org/10.1177/1745691617697076',
      },
      {
        text: 'Gollwitzer, P. M. ve Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69–119.',
        url: 'https://doi.org/10.1016/S0065-2601(06)38002-1',
      },
      {
        text: 'Hagger, M. S., Chatzisarantis, N. L. D., Alberts, H., Anggono, C. O., Batailler, C. ve ark. (2016). A multilab preregistered replication of the ego-depletion effect. Perspectives on Psychological Science, 11(4), 546–573.',
        url: 'https://doi.org/10.1177/1745691616652873',
      },
      {
        text: 'Vohs, K. D., Schmeichel, B. J., Lohmann, S., Gronau, Q. F., Finley, A. J. ve ark. (2021). A multisite preregistered paradigmatic test of the ego-depletion effect. Psychological Science, 32(10), 1566–1581.',
        url: 'https://doi.org/10.1177/0956797621989733',
      },
      {
        text: 'Şimşir, Z. ve Koç, H. (2022). İki farklı öz-kontrol ölçeğinin Türkçeye uyarlanması. Bartın Üniversitesi Eğitim Fakültesi Dergisi, 11(2), 338–350.',
        url: 'https://doi.org/10.14686/buefad.942984',
      },
      {
        text: 'Gülüm, İ. V. ve Tığrak, A. (2022). Çok Boyutlu Özdenetim Ölçeği Türkçe formunun psikometrik özellikleri. Nesne Psikoloji Dergisi, 10(23), 89–104.',
        url: 'https://doi.org/10.7816/nesne-10-23-06',
      },
      {
        text: 'Benk Durmuş, F., Yusufoğlu Torlak, C., Tüğen, L. E. ve Güleç, H. (2022). Psychometric properties of the Turkish version of the Barratt Impulsiveness Scale-Brief in adolescents. Archives of Neuropsychiatry, 59(1), 48–53.',
        url: 'https://doi.org/10.29399/npa.27527',
      },
      {
        text: 'Özgül, O. (2017). Lise öğrencilerinde öz denetim ve anne-baba tutumu arasındaki ilişkinin bazı sosyo-demografik değişkenler açısından incelenmesi (Elazığ ili örneği) [Yüksek lisans tezi, Çağ Üniversitesi].',
        url: 'https://tezara.org/theses/477130',
      },
    ],
  },
};
