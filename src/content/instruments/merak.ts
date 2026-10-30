import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Merak
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) iki ölçeği. Kamu malıdır: izin ve ücret gerektirmeden her amaçla
 * kullanılabilir (https://ipip.ori.org/newPermission.htm: "for any purpose, commercial or non-commercial") ve çevrilebilir
 * (https://ipip.ori.org/).
 *  - IPIP-HEXACO "Inquisitiveness" (O: Inqu; Ashton, Lee ve Goldberg, 2007) → Bilgi merakı
 *    (https://ipip.ori.org/newHEXACO_PI_key.htm; 6 artı + 4 eksi madde, α .78). Maddeler ve yönleri resmî anahtar sayfasından
 *    okundu (2026-10-30). Sitedeki Altı Boyutlu Kişilik Profili'nin "Merak" alt özelliğiyle aynı on maddedir; çeviriler de
 *    aynıdır. HEXACO-PI'nin asıl merak ölçeğiyle ilişkisi .73, ölçüm hatası düzeltilince .94 (o ölçeğin α'sı .78; tablo
 *    https://ipip.ori.org/newHEXACO_PI_table.htm; tablodaki karşılaştırma ölçeği HEXACO-PI'nin 2004 sürümündeki 7 maddelik
 *    merak ölçeğidir).
 *  - IPIP-NEO "Adventurousness" (O4) → Yenilik merakı (https://ipip.ori.org/newNEOFacetsKey.htm; 4 artı + 6 eksi madde,
 *    α .77; NEO-PI-R'nin asıl "Actions" (O4) yönüyle ilişkisi .71, düzeltilince .99; o yönün α'sı .64; tablo
 *    https://ipip.ori.org/newNEO_FacetsTable.htm).
 * Kaynak doğrulaması: IPIP'in NEO anahtar sayfası ile HEXACO tablo sayfası 2026-10-30'da otomatik okumaya kapalıydı (robots).
 * Bu sayfalar IPIP sitesinin bir arşiv kopyasından okundu
 * (https://ipip-remaster.vercel.app/archive/ipip-mirror/ipip.ori.org/newNEOFacetsKey.htm ve aynı klasördeki tablo sayfaları);
 * O4'ün on maddesi metin, sıra ve yönleriyle birebir karşılaştırıldı. NEO tablo sayfası resmî adresinde de açıldı ve aynı
 * değerleri verir (.77, .64, .71 [.99]; kaynak incelemesi). Ayrıca on maddenin sekizi IPIP'in resmî sayfalarında birebir aynı
 * metinle yer alır: new6FPQKey.htm'de yedisi ("Prefer variety to routine", "Like to visit new places", "Am interested in many
 * things", "Prefer to stick with things that I know", "Dislike changes", "Am a creature of habit", "Am attached to
 * conventional ways"); newJPI-RKey.htm'de üçü (ikisi 6FPQ'dakilerle aynı; ayrıca "Don't like the idea of change" Tolerance
 * ölçeğinde eksi yönlü). Sitedeki IPIP-NEO-120 (Ayrıntılı Kişilik Profili) bu yönün
 * dört maddesini sorar; dördü de bu anahtardaki yönleriyle aynıdır. Tablolar örneklemi belirtmez. IPIP bu NEO ölçeklerini
 * "preliminary" (ön) ölçekler olarak sunar. İki ölçek arasında ortak madde yoktur.
 *
 * Seçim: IPIP'te VIA dışında merakı tek başına ölçen ölçeklerin hiçbiri hem bilgiyi hem yeniliği temiz biçimde ayırmıyordu.
 * HEXACO "Inquisitiveness" bilgiye, bilime ve derin konulara merakı; NEO "Adventurousness" yeni yerlere, yeni işlere,
 * çeşitliliğe ve değişikliğe isteği sorar. İkisi birlikte merakın iki yönünü verir (Kashdan ve ark., 2009'daki iki yöne ve
 * deneyime açıklığın düşünce ve deneyim yönlerine benzer; bilim kartında yazılı). İki model de bu ölçekleri deneyime
 * açıklığın altında sayar.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Sitedeki öteki testlerde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (15 madde: bilgi merakının
 *    onu Altı Boyutlu Kişilik Profili'nden; yenilik merakının beşi Ayrıntılı Kişilik Profili ile Öğrenme ve Başarı
 *    Özellikleri'nden).
 *  - Kalan 5 madde için iki ayrı çeviri taslağı hazırlandı (ikincisi birincisi görülmeden); ikisi karşılaştırılarak son hâl
 *    seçildi:
 *    "Like to visit new places": "Yeni yerler görmeyi severim." / "Daha önce gitmediğim yerlere gitmeyi severim." → birincisi
 *    (kısa; gezip görmeyi anlatır).
 *    "Like to begin new things": "Yeni şeylere başlamayı severim." / "Yeni işlere girişmekten hoşlanırım." → birincisi ("iş"
 *    görev ya da meslek diye okunabilir).
 *    "Don't like the idea of change": "Değişim fikri hoşuma gitmez." / "Bir şeylerin değişecek olması hoşuma gitmez." →
 *    ikincisinden "Bir şeylerin değişecek olması canımı sıkar." ("fikir" soyut; "hoşuma gitmez", "Dislike changes" maddesinin
 *    çevirisi "Değişiklikten hoşlanmam" ile neredeyse aynı okunurdu).
 *    "Am a creature of habit": "Alışkanlıklarımdan kolay kolay vazgeçmem." / "Her şeyi hep alıştığım gibi yaparım." →
 *    ikincisinden "Çoğu şeyi alıştığım biçimde yaparım." ("Her şeyi" fazla kesin; olumlu fiil "Hiç doğru değil" ile çift
 *    olumsuzluk yapmaz; "bağlı" sözcüğü "Alışılmış yöntemlere bağlıyım" ve "Bildiğim şeylere bağlı kalmayı..." maddelerinde var).
 *    "Dislike new foods": "Daha önce tatmadığım yemeklerden hoşlanmam." / "Tanımadığım yemekleri denemeyi sevmem." →
 *    ikincisinden "Tanımadığım yemekleri denemekten çekinirim." (birincisi tadılmamış bir yemekten hoşlanmamayı söyleyerek
 *    çelişkili okunabilirdi; "yeni yiyecek" taze ya da yeni çıkmış ürün diye de okunabilirdi).
 *  - Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 *
 * Madde anahtarı: ölçeğin kısaltması (bil, yen) + maddenin IPIP anahtar sayfasındaki sırası (sayfa her ölçekte önce artı, sonra
 * eksi yönlü maddeleri verir; bil anahtarları Altı Boyutlu'daki inqu anahtarlarıyla aynı sıradadır). Uygulama sırası: iki ölçek
 * dönüşümlü gelir (art arda iki madde aynı ölçekten değildir); aynı yönde en çok üç madde art arda gelir; ilk madde yumuşak bir
 * başlangıçtır. Birbirine benzeyen ya da birbirinin tersini söyleyen maddeler birbirinden uzaktır: iki okuma maddesi, iki siyaset
 * maddesi, çeşitlilik ile bildiklerine bağlı kalma ve iki değişiklik maddesi en az 10; alışkanlık ve alışılmış düzen maddeleri
 * kendi aralarında, iki yer maddesi, iki "ilgi duyarım" maddesi, iki derinlik maddesi ve "kafa yormam" sözü iki ayrı anlamda
 * geçen iki madde (siyasi sorunlara kafa yormam / kafa yormam gereken metinler) en az 6 madde arayla (tests/merak.test.ts
 * denetler).
 *
 * Puanlama: her ölçek maddelerinin ortalamasıdır (1–5); en az dörtte üçü cevaplanmalıdır. Düzeyler öteki IPIP testlerindeki
 * gibi üçtür (2,6 ve 3,4 eşikleri). Toplam bir puan hesaplanmaz. Güvenirlik (α) IPIP sayfalarındaki değerdir; standart sapma
 * bilinmediği için `sdRef` yoktur ve raporda ölçüm payı gösterilmez.
 *
 * Evet deme eğilimi: bilgi merakının on maddesinden altısı düz, yenilik merakının altısı ters yönlüdür. Birbirinin tersini
 * söyleyen üç çift (`oppositePairs`) aynı uç cevabı yakalar: zor metinleri okumayı sevmek / onlardan kaçınmak, siyasi
 * tartışmaları ilginç bulmak / siyasi ve toplumsal sorunlara kafa yormamak (bilgi merakı); çeşitliliği tercih etmek / bildiklerine
 * bağlı kalmayı tercih etmek (yenilik merakı). Uyarı en az ikisinde (likert.ts: çiftlerin yarısı).
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const BIL = 'knowledge';
const YEN = 'novelty';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { bil: BIL, yen: YEN };

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['bil02', false, 'Alışılmadık yerleri keşfetmeyi çok isterdim.', 'Would love to explore strange places.'],
  ['yen01', false, 'Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim.', 'Prefer variety to routine.'],
  ['bil09', true, 'Siyasi ve toplumsal sorunlara kafa yormam.', "Don't bother worrying about political and social problems."],
  ['yen03', false, 'Pek çok şeye ilgi duyarım.', 'Am interested in many things.'],
  ['bil06', false, 'Kelime dağarcığım zengindir.', 'Have a rich vocabulary.'],
  ['yen06', true, 'Değişiklikten hoşlanmam.', 'Dislike changes.'],
  ['bil08', true, 'Okuması zor metinlerden kaçınırım.', 'Avoid difficult reading material.'],
  ['yen08', true, 'Çoğu şeyi alıştığım biçimde yaparım.', 'Am a creature of habit.'],
  ['bil03', false, 'Zekâ oyunlarından hoşlanırım.', 'Enjoy intellectual games.'],
  ['yen02', false, 'Yeni yerler görmeyi severim.', 'Like to visit new places.'],
  ['bil01', false, 'Bilime ilgi duyarım.', 'Am interested in science.'],
  ['yen09', true, 'Tanımadığım yemekleri denemekten çekinirim.', 'Dislike new foods.'],
  ['bil10', true, 'Bir konunun derinine inmem.', 'Will not probe deeply into a subject.'],
  ['yen05', true, 'Bildiğim şeylere bağlı kalmayı tercih ederim.', 'Prefer to stick with things that I know.'],
  ['bil05', false, 'Siyasi tartışmaları ilginç bulurum.', 'Find political discussions interesting.'],
  ['yen04', false, 'Yeni şeylere başlamayı severim.', 'Like to begin new things.'],
  ['bil07', true, 'Tarih hakkında pek bir şey bilmem.', "Don't know much about history."],
  ['yen07', true, 'Bir şeylerin değişecek olması canımı sıkar.', "Don't like the idea of change."],
  ['bil04', false, 'Anlamak için kafa yormam gereken metinler okumayı severim.', 'Love to read challenging material.'],
  ['yen10', true, 'Alışılmış yöntemlere bağlıyım.', 'Am attached to conventional ways.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const merak: LikertInstrument = {
  slug: 'merak',
  version: 1,
  engine: 'likert',
  name: 'Merak',
  shortName: 'Merak',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 4,
  sortOrder: 15.99,
  tagline: 'Merakını iki yönde gösterir: yeni bilgiler öğrenmeye ilgi ve yeni deneyimlere, değişikliğe ilgi.',
  description:
    'Merak, kişinin bilmediği bir şeyi öğrenme ya da yeni bir şeyi deneme isteğidir. Bu test onu iki yönde gösterir. Birincisi yeni bilgiler öğrenmeye ilgidir: bilim, tarih ya da toplumsal konular, anlamak için kafa yormayı gerektiren metinler ve zekâ oyunları. İkincisi yeni deneyimlere ilgidir: yeni yerler, yeni başlangıçlar, çeşitlilik ve değişiklik. Kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) iki ölçeğine dayanır; 20 kısa cümleden oluşur ve yaklaşık 4 dakika sürer. Rapor, iki yönün birlikte ne anlatabileceğini ve gündelik hayatta denenebilecek küçük adımları da anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Sonuç kişinin kendini nasıl tanımladığını gösterir; zekâyı ya da bilgiyi ölçmez. Tanı koymaz.',
  intro: {
    title: 'Neyi merak ediyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 20 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Cümleler öğrenmekle, okumakla, yeni yerlerle ve değişiklikle ilgili. Belirli bir günü değil, genellikle nasıl olduğunu düşünerek cevap ver.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar. Yaklaşık 4 dakika sürer.',
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
    ['bil04', 'bil08'],
    ['bil05', 'bil09'],
    ['yen01', 'yen05'],
  ],
  scales: [
    {
      key: BIL,
      name: 'Bilgi merakı',
      plain:
        'Yeni bilgiler öğrenme isteği: bilime, tarihe, siyasete ve toplumsal konulara ilgi duyma; anlamak için kafa yormayı gerektiren metinleri okumayı ve zekâ oyunlarını sevme, bir konunun derinine inme; alışılmadık yerleri keşfetmeyi isteme ve zengin bir kelime dağarcığı.',
      poles: { low: 'Bilgi peşine pek düşmeyen', high: 'Bilgi peşine düşen' },
      alpha: 0.78,
    },
    {
      key: YEN,
      name: 'Yenilik merakı',
      plain:
        'Yeni deneyimlere isteklilik: çeşitliliği tercih etme, yeni yerler görmeyi ve yeni şeylere başlamayı sevme, pek çok şeye ilgi duyma; değişiklikten hoşlanma, alışkanlıklara ve alışılmış yöntemlere sıkı sıkıya bağlı olmama ve tanımadığı yemekleri denemekten çekinmeme.',
      poles: { low: 'Bildiğini ve alıştığını seven', high: 'Yeniyi ve değişikliği seven' },
      alpha: 0.77,
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) iki ölçeği: IPIP-HEXACO ölçeklerinden merak (Inquisitiveness; Ashton, Lee ve Goldberg, 2007) ve NEO Kişilik Envanteri’ne (NEO-PI-R) benzeyen IPIP ölçeklerinden yeniliğe isteklilik (Adventurousness). Bu testte birincisi “Bilgi merakı”, ikincisi “Yenilik merakı” adıyla kullanılır. Maddeler IPIP’indir (Goldberg ve ark., 2006). İki ölçeğin bütün maddeleri sorulur: 20 madde; ölçekler arasında ortak madde yoktur. İki model de bu ölçekleri deneyime açıklık boyutunun altında sayar. Yenilik merakının maddeleri IPIP sitesinin bir arşiv kopyasından alındı ve IPIP’in öteki resmî sayfalarıyla karşılaştırıldı.',
    whatItMeasures:
      'Merak, yeni bilgi ve deneyim arama isteğidir. Etkili bir açıklamaya göre merak, kişi bilgisinde bir boşluk fark edince ortaya çıkar: bir konuyu biraz bilmek, gerisini merak ettirir (Loewenstein, 1994). Merakın birden çok yüzü vardır. Örneğin Merak ve Keşif Envanteri’nin gözden geçirilmiş biçiminde iki yön ayrışmıştır (Kashdan ve ark., 2009). Biri yeni bilgi ve deneyim aramak, öteki hayatın yeni, belirsiz ve öngörülemeyen yanlarını kabullenmektir. Kişilik araştırmalarında da deneyime açıklığın iki yönü ayırt edilir: düşünceye ve bilgiye dönük yön ile deneyime, duyulara ve sanata dönük yön. İki yön birbiriyle orta düzeyde ilişkilidir (.3 ile .5 arası); ortak özleri bilgiyi ve deneyimi keşfetme isteğidir (Oleynick ve ark., 2017). Bu test de merakı iki yönde ayrı ayrı gösterir: yeni bilgiler öğrenmeye ilgi (bilgi merakı) ve yeni deneyimlere, değişikliğe ilgi (yenilik merakı). Bu iki yön o araştırmalardaki yönlerle birebir aynı değildir. İki yön ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.\n\nMerak ile okul başarısı arasında genellikle küçük ilişkiler bulunmuştur; merakı da içine alan deneyime açıklıkta bu ilişki küçük yaşlarda daha güçlü, lise ve üniversitede daha zayıftır. 228 çalışmayı (yaklaşık 413.000 kişi) birleştiren bir incelemede, merakı da içine alan geniş deneyime açıklık boyutu ile okul başarısı arasındaki ilişki ortalama .16’dır. Bu ilişki ilkokul ve ortaokulda .40, ortaöğretimde .22, üniversitede .10 bulunmuştur (Mammadov, 2022). Almanya’da çoğu 14–22 yaş arasındaki 1.964 gençle beş yıl süren bir çalışma yapılmıştır. Bu çalışmada merak ile okul not ortalaması arasındaki ilişki .20 bulunmuş (zihinsel yetenekte .39), okul sonrası eğitimin notlarıyla ise anlamlı bir ilişki görülmemiştir (Mussel, 2022). İstanbul’un da yer aldığı 10 şehirde 10 ve 15 yaşındaki öğrencilerle bir OECD araştırması yapılmıştır. Bu araştırmada merak ve sebat, notlarla en güçlü ilişkili sosyal ve duygusal beceriler olarak çıkmıştır. Rapora göre ailesinin durumu, cinsiyeti ve zihinsel yeteneği benzer öğrenciler arasında da bu beceriler güçlü olanların notları genellikle daha iyidir (OECD, 2021). Bu çalışmalar bir ilişki gösterir; meraklı olmanın tek başına notları yükselttiğini göstermez.\n\nMerak öğrenmeyi de etkileyebilir. Deneylerde kişilerin cevabını çok merak ettiği soruların cevapları hem hemen hem de bir gün sonra daha iyi hatırlanmıştır (Gruber ve ark., 2014). 10–14 yaş arasındaki çocuk ve gençlerle yapılan bir deneyde de merak, cevapların hatırlanmasını artırmıştır (Fandakova ve Gruber, 2021). Üniversite öğrencileriyle (29 kişi) yapılan bir deneyde, cevabı görmeden önce tahminde bulunmak, bir örnek düşünmeye göre o soruya duyulan merakı artırmıştır. Ama hatırlanan bilgi miktarını değiştirmemiştir (Brod ve Breitwieser, 2019). Bir çalışmada 97 üniversite öğrencisi 21 gün boyunca günlük tutmuştur. Merakı genel olarak yüksek olanlar, kendini daha meraklı hissettikleri günlerde kendini geliştiren davranışları daha sık bildirmiştir. O günlerde hayatı daha anlamlı bulmuş ve yaşamlarından daha memnun olmuşlardır. Bu bir ilişkidir, neden-sonuç değildir (Kashdan ve Steger, 2007).\n\nOkul yılları boyunca ilgi ve içten gelen istek ortalamada biraz azalır. 107 boylamsal çalışmayı birleştiren bir incelemede en çok azalan özelliklerden biri içten gelen istektir; ilgi de bu özelliğe dahil edilmiştir (Scherrer ve Preckel, 2019). Aynı OECD araştırmasında 15 yaşındakilerin merakı 10 yaşındakilerden düşük bulunmuştur; ancak bu sonuç aynı kişilerin yıllar boyunca izlenmesinden değil, iki yaş grubunun karşılaştırılmasından gelir (OECD, 2021). Merakın nasıl geliştiği ve okulun buna etkisi hakkında sağlam kanıt ise azdır (Jirout ve Klahr, 2012).',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki testlerde birebir aynı olan 15 maddenin çevirisi korundu. Bilgi merakının on maddesi Altı Boyutlu Kişilik Profili’ndekiyle, yenilik merakının beş maddesi Ayrıntılı Kişilik Profili ve Öğrenme ve Başarı Özellikleri’ndekiyle aynıdır. Kalan 5 madde iki ayrı taslakla çevrilip karşılaştırıldı. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’de merakı ölçen başka ölçekler uyarlanmıştır; örneğin Beş Boyutlu Merak Ölçeği’nin gözden geçirilmiş biçimi 18–60 yaş arasındaki 336 yetişkinle Türkçeye uyarlanmıştır (Tanlası ve ark., 2026). Bu testin maddeleri o ölçeğin maddeleri değildir ve o çalışmanın sonuçları bu test için norm sayılmaz. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfalarında iç tutarlılık (Cronbach α) şöyle bildirilir: merak (bu testte bilgi merakı) .78; yeniliğe isteklilik (bu testte yenilik merakı) .77. IPIP ölçeklerinin asıl envanterlerdeki karşılıklarıyla ilişkisi: bilgi merakı, HEXACO Kişilik Envanteri’nin merak ölçeğiyle .73 (ölçüm hatası düzeltilince .94; o ölçeğin kendi α’sı .78); yenilik merakı, NEO-PI-R’nin “Actions” (davranışta yeniliğe açıklık) yönüyle .71 (ölçüm hatası düzeltilince .99; o ölçeğin kendi α’sı .64). Tablolar örneklemi belirtmez. Yenilik merakının anahtarı ile HEXACO ilişki tablosu IPIP sitesinin bir arşiv kopyasından alındı; NEO ilişki tablosu IPIP’in resmî sayfasında da aynı değerleri verir. Yenilik merakının on maddesinden sekizi IPIP’in öteki resmî sayfalarında da birebir aynı metinle yer alır; Ayrıntılı Kişilik Profili’nin bu yönden sorduğu dört madde de anahtardaki yönleriyle aynıdır. Açık veriye bu çalışmada ulaşılamadığı için standart sapmalar hesaplanamadı; raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, başkalarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak ölçeklerin güvenirlik tabloları örneklemi belirtmez; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı. Okul yıllarında ilgi ve içten gelen istek ortalamada biraz azalır (Scherrer ve Preckel, 2019); bu yüzden lise öğrencilerinde sonuç o dönemin bir resmi olarak düşünülmelidir.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Merak anketlerinin cümleleri çoğu zaman ne sorduğunu açıkça belli eder ve kişinin kendini olumlu gösterme eğiliminden etkilenebilir. Bu yüzden insanlar kendilerini olduğundan biraz daha meraklı anlatabilir (Shin ve Kim, 2019).',
      'Merak anketlerinin sonucu, insanların gerçekte nasıl bilgi aradığıyla her zaman örtüşmez. Bir çalışmada 820 kişi 15 kişilik ölçeğini (aralarında merak ölçekleri de var) doldurmuş ve dokuz bilgi arama görevi yapmıştır. Davranışı en iyi öngörenler, merakı en doğrudan ölçen ölçekler değil; düşünmeyi sevme, heyecan arama ve strese dayanma gibi ölçeklerdi (Jach ve ark., 2024).',
      'Test zekâyı, bilgiyi ya da ne kadar başarılı olduğunu ölçmez. Lise ve sonrasında merakın okul başarısıyla ilişkisi küçüktür ve bu ilişki meraklı olmanın notları yükselttiğini göstermez.',
      'Bilgi merakının on cümlesinden altısı düz, dördü ters yöndedir; yenilik merakında ise dördü düz, altısı ters yöndedir. Cümlelerin çoğuna “doğru” deme eğilimi bilgi merakının puanını biraz yükseltip yenilik merakının puanını biraz düşürebilir. Birbirinin tersini söyleyen üç cümle çiftinden (ikisi bilgi merakında, biri yenilik merakında) en az ikisinde iki cümleye de “Oldukça doğru” ya da “Tamamen doğru” denirse raporda bir uyarı gösterilir. Aynı uyarı, en az iki çiftte iki cümleye de “Hiç doğru değil” ya da “Pek doğru değil” denirse de gösterilir.',
      'Bilgi merakının iki cümlesi siyasete ve toplumsal sorunlara ilgiyi sorar; kişinin görüşünü sormaz. Bu konuların çevresinde pek konuşulmadığı biri bu iki cümleye daha düşük cevap verebilir.',
      'Bilgi merakının iki cümlesi (tarih bilgisi ve kelime dağarcığı) kişinin kendi bilgisini nasıl gördüğünü sorar; bu cümlelere cevap, o konularla ne kadar karşılaşıldığına da bağlı olabilir.',
      'Alışılmadık yerleri keşfetmeyi isteme cümlesi bir yer merakını sorsa da kaynak ölçekte (HEXACO’nun merak ölçeği) bilgi merakının bir parçasıdır; bu testte de bilgi merakına sayılır.',
      'Yenilik merakının bir cümlesi tanımadığı yemekleri denemeyi sorar. Sağlık, alerji ya da inanç nedeniyle bazı yiyecekleri yemeyen biri bu cümleye yeniliğe ilgisinden bağımsız bir cevap verebilir.',
      '20 cümlenin 15’i sitedeki öteki testlerde de sorulur: onu Altı Boyutlu Kişilik Profili’nde, beşi Ayrıntılı Kişilik Profili’nde, beşi Öğrenme ve Başarı Özellikleri’nde, ikisi Kişiliğin 10 Yönü’nde, ikisi Düşünmeyi Sevme Ölçeği’nde, ikisi Düşünme ve Çalışma Tarzı’nda; birer cümle de Beş Faktör Kişilik Profili, 16 Faktörlü Kişilik Profili ve Heyecan Arayışı’nda (bir cümle birden çok testte olabilir). Bilgi merakının on cümlesinin hepsi Altı Boyutlu Kişilik Profili’nin “Merak” alt özelliğidir; o testi çözen biri burada aynı cümleleri görür ve iki sonuç çok benzer çıkar. Yenilik merakının dört cümlesi Ayrıntılı Kişilik Profili’nin “Değişime açıklık” özelliğinde, üçü Öğrenme ve Başarı Özellikleri’nin “Öğrenmeye açıklık” alanında da vardır. Bu yüzden sonuçlar birbirine benzeyebilir.',
      'Tanı koymaz ve uzman değerlendirmesinin yerini tutmaz.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır. Ölçüm payı hesaplanamadığı için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      { text: 'IPIP. IPIP-HEXACO ölçeklerinin anahtarı (merak: Inquisitiveness).', url: 'https://ipip.ori.org/newHEXACO_PI_key.htm' },
      { text: 'IPIP. IPIP-HEXACO ölçeklerinin özet tablosu (güvenirlik ve HEXACO-PI ile ilişki).', url: 'https://ipip.ori.org/newHEXACO_PI_table.htm' },
      { text: 'IPIP. NEO-PI-R’ye benzeyen IPIP ölçeklerinin anahtarları (yeniliğe isteklilik: Adventurousness).', url: 'https://ipip.ori.org/newNEOFacetsKey.htm' },
      { text: 'IPIP. NEO-PI-R yönlerinin özet tablosu (güvenirlik ve NEO-PI-R ile ilişki).', url: 'https://ipip.ori.org/newNEO_FacetsTable.htm' },
      {
        text: 'IPIP sitesinin arşiv kopyası: NEO-PI-R’ye benzeyen ölçeklerin anahtarı (tablolar aynı klasörde).',
        url: 'https://ipip-remaster.vercel.app/archive/ipip-mirror/ipip.ori.org/newNEOFacetsKey.htm',
      },
      { text: 'IPIP. 6FPQ ölçeklerinin anahtarı (yenilik merakının on maddesinden yedisi burada da birebir aynı metinle yer alır).', url: 'https://ipip.ori.org/new6FPQKey.htm' },
      { text: 'IPIP. JPI-R ölçeklerinin anahtarı (yenilik merakının üç maddesi burada da birebir aynı metinle yer alır).', url: 'https://ipip.ori.org/newJPI-RKey.htm' },
      {
        text: 'Ashton, M. C., Lee, K. ve Goldberg, L. R. (2007). The IPIP–HEXACO scales: An alternative, public-domain measure of the personality constructs in the HEXACO model. Personality and Individual Differences, 42(8), 1515–1526.',
        url: 'https://doi.org/10.1016/j.paid.2006.10.027',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Loewenstein, G. (1994). The psychology of curiosity: A review and reinterpretation. Psychological Bulletin, 116(1), 75–98.',
        url: 'https://doi.org/10.1037/0033-2909.116.1.75',
      },
      {
        text: 'Kashdan, T. B., Gallagher, M. W., Silvia, P. J., Winterstein, B. P., Breen, W. E., Terhar, D. ve Steger, M. F. (2009). The Curiosity and Exploration Inventory-II: Development, factor structure, and psychometrics. Journal of Research in Personality, 43(6), 987–998.',
        url: 'https://doi.org/10.1016/j.jrp.2009.04.011',
      },
      {
        text: 'Oleynick, V. C., DeYoung, C. G., Hyde, E., Kaufman, S. B., Beaty, R. E. ve Silvia, P. J. (2017). Openness/Intellect: The core of the creative personality. G. J. Feist, R. Reiter-Palmon ve J. C. Kaufman (Ed.), The Cambridge handbook of creativity and personality research içinde (s. 9–27). Cambridge University Press.',
        url: 'https://doi.org/10.1017/9781316228036.002',
      },
      {
        text: 'Mammadov, S. (2022). Big Five personality traits and academic performance: A meta-analysis. Journal of Personality, 90(2), 222–255.',
        url: 'https://doi.org/10.1111/jopy.12663',
      },
      {
        text: 'Mussel, P. (2022). Processes underlying the relation between cognitive ability and curiosity with academic performance: A mediation analysis for epistemic behavior in a five-year longitudinal study. Journal of Intelligence, 10(2), 23.',
        url: 'https://doi.org/10.3390/jintelligence10020023',
      },
      {
        text: 'OECD (2021). Beyond academic learning: First results from the Survey of Social and Emotional Skills 2019. OECD Publishing.',
        url: 'https://doi.org/10.1787/92a11084-en',
      },
      {
        text: 'Gruber, M. J., Gelman, B. D. ve Ranganath, C. (2014). States of curiosity modulate hippocampus-dependent learning via the dopaminergic circuit. Neuron, 84(2), 486–496.',
        url: 'https://doi.org/10.1016/j.neuron.2014.08.060',
      },
      {
        text: 'Fandakova, Y. ve Gruber, M. J. (2021). States of curiosity and interest enhance memory differently in adolescents and in children. Developmental Science, 24(1), e13005.',
        url: 'https://doi.org/10.1111/desc.13005',
      },
      {
        text: 'Brod, G. ve Breitwieser, J. (2019). Lighting the wick in the candle of learning: Generating a prediction stimulates curiosity. npj Science of Learning, 4, 17.',
        url: 'https://doi.org/10.1038/s41539-019-0056-y',
      },
      {
        text: 'Kashdan, T. B. ve Steger, M. F. (2007). Curiosity and pathways to well-being and meaning in life: Traits, states, and everyday behaviors. Motivation and Emotion, 31(3), 159–173.',
        url: 'https://doi.org/10.1007/s11031-007-9068-7',
      },
      {
        text: 'Scherrer, V. ve Preckel, F. (2019). Development of motivational variables and self-esteem during the school career: A meta-analysis of longitudinal studies. Review of Educational Research, 89(2), 211–258.',
        url: 'https://doi.org/10.3102/0034654318819127',
      },
      {
        text: 'Jirout, J. ve Klahr, D. (2012). Children’s scientific curiosity: In search of an operational definition of an elusive concept. Developmental Review, 32(2), 125–160.',
        url: 'https://doi.org/10.1016/j.dr.2012.04.002',
      },
      {
        text: 'Shin, D. D. ve Kim, S. (2019). Homo curious: Curious or interested? Educational Psychology Review, 31(4), 853–874.',
        url: 'https://doi.org/10.1007/s10648-019-09497-x',
      },
      {
        text: 'Jach, H. K. ve ark. (2024). Individual differences in information demand have a low dimensional structure predicted by some curiosity traits. Proceedings of the National Academy of Sciences, 121(45), e2415236121.',
        url: 'https://doi.org/10.1073/pnas.2415236121',
      },
      {
        text: 'Tanlası, B., Saka, R. Ş., Demirci, İ., Ümmet, D. ve Ekşi, H. (2026). Revize Edilmiş Beş Boyutlu Merak Ölçeği’nin (5BMÖ-R) Türkçeye uyarlanması. Batı Anadolu Eğitim Bilimleri Dergisi, 17(1), 827–849.',
        url: 'https://doi.org/10.51460/baebd.1560858',
      },
    ],
  },
};
