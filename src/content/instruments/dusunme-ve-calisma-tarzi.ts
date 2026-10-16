import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Düşünme ve Çalışma Tarzı
 * Kaynak: IPIP'in Jackson Kişilik Envanteri'ne (JPI-R; Jackson, 1994) benzeyen 15 ön ölçeği
 * (https://ipip.ori.org/newJPI-RKey.htm; karşılaştırma tablosu https://ipip.ori.org/newJPI-RTable.htm). Kamu malıdır.
 * Beş ölçek alındı; her birinin kaynaktaki 10 maddesinin hepsi kullanılır (50 madde):
 *  - Intellectual Complexity (JPI: Complexity) → Soyut ve felsefi konulara ilgi (sayfada α .82)
 *  - Ingenuity (JPI: Innovation) → Yenilikçilik (.84)
 *  - Conformity (JPI: Cooperativeness) → Başkalarının görüşüne önem verme (.71)
 *  - Activity-Level (JPI: Energy Level) → Enerji ve tempo (.81)
 *  - Organization (JPI: Organization) → Düzen ve plan (.79)
 * Ölçek adları bir beceri değil, bir ilgi ya da eğilim anlatır: "soyut düşünme" Türkçede bir zihinsel becerinin adıdır,
 * "yenilikçi düşünme" de beceri gibi okunabilir; bu yüzden "konulara ilgi" ve "Yenilikçilik" denir.
 * Alınmayanlar: Traditionalism (din ve siyaset görüşü: "Believe in one true religion", "Tend to vote for conservative
 * political candidates"), Tolerance ("Believe in equality between all races", "Believe in an eye for an eye"),
 * Responsibility ("Would never cheat on my taxes", "Cheat to get ahead"), Machiavellianism ("Find it easy to manipulate
 * others"); Intellectual Breadth bir maddede siyasi tartışmaları sorar ("Find political discussions interesting"); o madde
 * çıkarıldığında bile açık veride (aşağıda) Complexity ile r = .74 (on maddeyle .76; ölçüm hatası düzeltilince ≈ .92):
 * iki ölçek aynı raporda ayrı özellikler gibi anlatılsa aralarındaki farklar çoğunlukla ölçüm hatası olurdu. Anxiety,
 * Empathy, Sociability, Social-Confidence ve Risk-Taking düşünme ve çalışma tarzı değil; duyguları, insan ilişkilerini ve
 * heyecan arayışını anlatır. Conformity alındı: maddeleri kişinin görüşlerini kendisinin mi oluşturduğunu, yoksa
 * başkalarının görüşüne ve onayına mı göre hareket ettiğini sorar.
 *
 * Madde anahtarı: ölçeğin kısaltması (JPI-R'deki adlarından: cpx, inv, cpr, enl, org) + maddenin IPIP sayfasındaki sırası
 * (01–05 artı, 06–10 eksi yönlü; Ingenuity'de 01–06 artı, 07–10 eksi). Uygulama sırası: beş ölçek sırayla döner
 * (yenilikçilik, düzen, soyut, görüş, enerji); art arda iki madde aynı ölçekten değildir, aynı yönde en çok üç madde art
 * arda gelir. Aynı ölçekte birbirine benzeyen ya da birbirinin tersini söyleyen maddeler en az dört tur (20 madde) arayla
 * durur (ör. üç hayal gücü maddesi, üç fikir maddesi, soyut-teorik-felsefi üçlüsü, "kafama takarım" / "umursamam" /
 * "izlenim"). Farklı ölçeklerdeki benzer maddeler de birbirinden uzaktır: "Zamanımı boşa harcarım" ile "Hiçbir şey yapmadan
 * boş boş vakit geçiririm" 22, "Gereğinden az çalışırım" ile 12; "Cesur planlar kurarım" ile iki plan maddesi en az 9;
 * "Bir işe başlamam için birinin beni dürtmesi gerekir" ile "Hoşa gitmeyen işleri ertelerim" 7, "Yapmam gereken işleri
 * hemen hallederim" 18 madde arayla.
 *
 * Puanlama: her ölçek on maddesinin ortalamasıdır (1–5); en az sekiz madde cevaplanmalıdır. Düzeyler Öğrenme ve Başarı
 * Özellikleri'ndeki gibi üçtür (2,6 ve 3,4 eşikleri). Uçların iyi ya da kötü anlamı yoktur.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur. 34 madde sitedeki öteki kişilik
 * testlerinde aynı İngilizce madde için kullanılan çeviriyle birebir aynıdır (bir maddenin iki çevirisi varsa 9. sınıftan
 * başlayan testlerdeki). Kalan 16 madde için birbirinden bağımsız üç çeviri taslağı hazırlandı; son hâl çoğunluğa ve
 * şu kararlara göre seçildi: "Come up with bold plans" → "Cesur planlar kurarım" ("plan yapmak" düzen ölçeğindeki "Plan
 * yapar ve planıma bağlı kalırım" ile karışmasın); "Feel it's OK that some people don't like me" → "Bazı insanların beni
 * sevmemesini doğal karşılarım" (çift olumsuzluk olmasın); "Have a slow pace to my life" → "Hayatımın temposu yavaştır".
 * Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı (Ekim 2026; web ve Europe PMC taraması).
 *
 * Güvenirlik ve ölçüm payı: IPIP sayfasındaki α değerleri Eugene-Springfield Topluluk Örneklemi'ndeki 471 yetişkinden
 * (karşılaştırma tablosunun notu). Ölçekhane aynı örneklemin herkese açık IPIP verisinde (Goldberg, 2018, Harvard
 * Dataverse, doi:10.7910/DVN/UF52WY, CC0; 1.142 kişi; Goldberg ve Saucier, 2016) on maddenin hepsini cevaplayanlarla
 * hesapladı (bağımsız bir denetimde aynı sonuçlar bulundu):
 *  - Soyut: X123, H1276, E133, E47, E173, X228, E171, X248, X239, X45 → 570 kişi, α .814, ortalama 3,68, ss 0,679
 *  - Yenilikçilik: X225, X14, H53, H1227, H447, H1313, X272, H1382, H1392, H1380 → 600 kişi, α .829, 3,69, ss 0,644
 *  - Görüş: P420, H1056, H974, P436, H1049, E134, P397, P354, H1221, H510 → 587 kişi, α .699, 2,85, ss 0,521
 *  - Enerji: H457, H58, H79, H54, H554, H969, H647, P385, H627, P477 → 623 kişi, α .794, 3,78, ss 0,655
 *  - Düzen: E119, X263, X179, E11, X118, X82, H1186, H823, E7, E132 → 570 kişi, α .795, 3,67, ss 0,639
 * Ölçüm payında iki değerden (sayfa, açık veri) düşük olan α kullanılır (çevirinin güvenirliği bilinmediği için pay geniş
 * tutulur); sdRef açık veriden, iki ondalık. Aynı veride kişilerin "yüksek" düzeye düşme oranı: soyut %69, yenilikçilik
 * %71,5, enerji %75, düzen %71; görüşte kişilerin %28'i düşük, %56'sı orta, %17'si yüksek (bilim kartının norm notu).
 * Öteki testlerle en güçlü ilişkiler (aynı veri, IPIP'in 50 maddelik beş faktör ölçeği, Goldberg 1992; her ölçekte en az
 * %75 cevap): düzen–sorumluluk .90 (beş madde ortak); yenilikçilik–merak ve hayal gücü .83 (dört madde ortak),
 * –dışadönüklük .42; soyut–merak ve hayal gücü .75 (iki madde ortak), –dışadönüklük .35; enerji–sorumluluk .49,
 * –dışadönüklük .32; görüş–merak ve hayal gücü −.32, –duygusal denge −.30.
 *
 * Birbirinin tersini söyleyen beş madde çifti (`oppositePairs`): hayal gücü (inv02, inv07), fikirler (inv03, inv10), meşgul
 * olmak (enl02, enl09), iş çıkarmak (enl05, enl08), görüş (cpr02, cpr09). Açık veride beş çiftin en az üçünde iki maddeye de
 * aynı uçtan ("Oldukça" ya da "Tamamen doğru"; "Hiç" ya da "Pek doğru değil") cevap veren yetişkin oranı %0,9'dur (531 kişi;
 * iki yön ayrı sayılır, uyarı kuralı da öyle sayar): uyarı dürüst cevaplarda nadiren çıkar. Görüş çifti en zayıfıdır
 * (r = −.21; yetişkinlerin %14'ü ikisine de katılır), ama tek başına uyarı vermez. Düzende birbirinin tam tersi olan bir çift
 * yoktur ("Düzeni severim" ile "Dağınıklık beni rahatsız etmez" maddelerine yetişkinlerin %19'u birlikte katılır).
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const CPX = 'complexity';
const INV = 'ingenuity';
const CPR = 'conformity';
const ENL = 'activity';
const ORG = 'organization';

/** [anahtar, ölçek, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, string, boolean, string, string][] = [
  ['inv03', INV, false, 'Aklım fikirlerle doludur.', 'Am full of ideas.'],
  ['org06', ORG, true, 'Kullandığım şeyleri yerine koymayı sık sık unuturum.', 'Often forget to put things back in their proper place.'],
  ['cpx01', CPX, false, 'Sanatın önemli olduğuna inanırım.', 'Believe in the importance of art.'],
  ['cpr06', CPR, true, 'Başkalarının ne düşündüğünü umursamam.', "Don't care what others think."],
  ['enl04', ENL, false, 'Sürekli hareket hâlindeyim.', 'Am always on the go.'],
  ['inv07', INV, true, 'Hayal gücüm pek güçlü değildir.', 'Do not have a good imagination.'],
  ['org02', ORG, false, 'Plan yapar ve planıma bağlı kalırım.', 'Make plans and stick to them.'],
  ['cpx06', CPX, true, 'Soyut fikirler ilgimi çekmez.', 'Am not interested in abstract ideas.'],
  ['cpr03', CPR, false, 'Başkalarının onayına ihtiyaç duyarım.', 'Need the approval of others.'],
  ['enl09', ENL, true, 'Hiçbir şey yapmadan boş boş vakit geçiririm.', 'Hang around doing nothing.'],
  ['inv01', INV, false, 'İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim.', 'Love to think up new ways of doing things.'],
  ['org09', ORG, true, 'Dağınıklık beni rahatsız etmez.', 'Am not bothered by disorder.'],
  ['cpx03', CPX, false, 'Kendimi ve hayatımı incelemekten hoşlanırım.', 'Enjoy examining myself and my life.'],
  ['cpr09', CPR, true, 'Kendi görüşlerimi kendim oluşturmak isterim.', 'Want to form my own opinions.'],
  ['enl01', ENL, false, 'Aynı anda birçok şeyi idare edebilirim.', 'Can manage many things at the same time.'],
  ['inv05', INV, false, 'Cesur planlar kurarım.', 'Come up with bold plans.'],
  ['org01', ORG, false, 'Yapmam gereken işleri hemen hallederim.', 'Get chores done right away.'],
  ['cpx07', CPX, true, 'Karmaşık insanlardan uzak durmaya çalışırım.', 'Try to avoid complex people.'],
  ['cpr05', CPR, false, 'Başkaları ne yapıyorsa onu yaparım.', 'Do what others do.'],
  ['enl08', ENL, true, 'Gereğinden az çalışırım.', 'Do too little work.'],
  ['inv10', INV, true, 'Yeni fikirler bulamam.', "Can't come up with new ideas."],
  ['org08', ORG, true, 'Eşyalarımı ortada bırakırım.', 'Leave my belongings around.'],
  ['cpx04', CPX, false, 'Başkalarıyla filmler ve kitaplar hakkında konuşmaktan hoşlanırım.', 'Enjoy discussing movies and books with others.'],
  ['cpr01', CPR, false, 'İnsanların hakkımda ne düşündüğünü kafama takarım.', 'Worry about what people think of me.'],
  ['enl10', ENL, true, 'Hayatımın temposu yavaştır.', 'Have a slow pace to my life.'],
  ['inv02', INV, false, 'Canlı bir hayal gücüm vardır.', 'Have a vivid imagination.'],
  ['org03', ORG, false, 'Bir plana ya da programa göre hareket ederim.', 'Follow a schedule.'],
  ['cpx08', CPX, true, 'Felsefi tartışmalardan kaçınırım.', 'Avoid philosophical discussions.'],
  ['cpr08', CPR, true, 'Bazı insanların beni sevmemesini doğal karşılarım.', "Feel it's OK that some people don't like me."],
  ['enl02', ENL, false, 'Hep bir şeylerle meşgulümdür.', 'Am always busy.'],
  ['inv09', INV, true, 'Bir konunun derinine inmem.', 'Will not probe deeply into a subject.'],
  ['org07', ORG, true, 'Zamanımı boşa harcarım.', 'Waste my time.'],
  ['cpx05', CPX, false, 'Kendimi tarafsız bir gözle incelemeye çalışırım.', 'Try to examine myself objectively.'],
  ['cpr02', CPR, false, 'Başkalarının görüşlerine uyarım.', "Conform to others' opinions."],
  ['enl06', ENL, true, 'Bir işe başlamam için birinin beni dürtmesi gerekir.', 'Need a push to get started.'],
  ['inv04', INV, false, 'Sohbetin seviyesini yükseltirim.', 'Carry the conversation to a higher level.'],
  ['org04', ORG, false, 'Her şeyin tam yerli yerinde olmasını isterim.', 'Want everything to be "just right."'],
  ['cpx10', CPX, true, 'Şiiri sevmem.', 'Do not like poetry.'],
  ['cpr10', CPR, true, 'Başkalarından farklı olmak isterim.', 'Want to be different from others.'],
  ['enl05', ENL, false, 'Çok iş çıkarırım.', 'Accomplish a lot of work.'],
  ['inv06', INV, false, 'Çok iyi fikirler bulurum.', 'Have excellent ideas.'],
  ['org10', ORG, true, 'Hoşa gitmeyen işleri ertelerim.', 'Put off unpleasant tasks.'],
  ['cpx02', CPX, false, 'Kelime dağarcığım zengindir.', 'Have a rich vocabulary.'],
  ['cpr07', CPR, true, 'İyi bir izlenim bırakma derdinde değilim.', 'Am not concerned with making a good impression.'],
  ['enl07', ENL, true, 'Cesaretim çabuk kırılır.', 'Am easily discouraged.'],
  ['inv08', INV, true, 'Bir şeyleri hayal etmekte zorlanırım.', 'Have difficulty imagining things.'],
  ['org05', ORG, false, 'Düzeni severim.', 'Like order.'],
  ['cpx09', CPX, true, 'Teorik tartışmalar ilgimi çekmez.', 'Am not interested in theoretical discussions.'],
  ['cpr04', CPR, false, 'Başkalarının gözünde özel biri olmak isterim.', "Want to amount to something special in others' eyes."],
  ['enl03', ENL, false, 'Boş zamanlarımda birçok şey yaparım.', 'Do a lot in my spare time.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, scale, reverse, text, source]) => ({
  key,
  scale,
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const dusunmeVeCalismaTarzi: LikertInstrument = {
  slug: 'dusunme-ve-calisma-tarzi',
  version: 1,
  engine: 'likert',
  name: 'Düşünme ve Çalışma Tarzı',
  shortName: 'Düşünme ve çalışma tarzı',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 7,
  sortOrder: 15.7,
  tagline:
    'Düşünürken ve çalışırken kendini nasıl tanımladığını beş özellikte gösterir: soyut konulara ilgi, yenilikçilik, başkalarının görüşüne önem verme, enerji ve tempo, düzen ve plan.',
  description:
    'Düşünürken ve çalışırken kendini nasıl tanımladığını beş özellikte gösterir: soyut ve felsefi konulara ilgi, yeni fikirler ve yollar arama (yenilikçilik), başkalarının görüşüne ve onayına önem verme, enerji ve tempo, düzen ve plan. Test, kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) Jackson Kişilik Envanteri’ne benzeyen ölçeklerinden beşine dayanır; 50 kısa cümleden oluşur ve yaklaşık 7 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Bir yetenek ya da zekâ testi değildir; tanı koymaz.',
  intro: {
    title: 'Nasıl düşünür, nasıl çalışırsın?',
    paragraphs: [
      'Birazdan seni anlatan 50 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar.',
      'Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur. Yaklaşık 7 dakika sürer.',
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
    ['inv02', 'inv07'],
    ['inv03', 'inv10'],
    ['enl02', 'enl09'],
    ['enl05', 'enl08'],
    ['cpr02', 'cpr09'],
  ],
  scales: [
    {
      key: CPX,
      name: 'Soyut ve felsefi konulara ilgi',
      plain:
        'Soyut, felsefi ve teorik konular üzerine düşünmekten ve kendini incelemekten hoşlanma; sanatı önemseme, şiiri sevme, film ve kitaplar üzerine konuşmaktan hoşlanma.',
      poles: { low: 'Soyut ve felsefi konulara az ilgi duyan', high: 'Soyut ve felsefi konular üzerine düşünmeyi seven' },
      alpha: 0.81,
      sdRef: 0.68,
    },
    {
      key: INV,
      name: 'Yenilikçilik',
      plain: 'Yeni fikirler bulma, işleri yapmanın yeni yollarını düşünme, canlı bir hayal gücüne sahip olma ve cesur planlar kurma.',
      poles: { low: 'Yeni fikir aramaya az yönelen', high: 'Yeni fikirler ve yollar arayan' },
      alpha: 0.83,
      sdRef: 0.64,
    },
    {
      key: CPR,
      name: 'Başkalarının görüşüne önem verme',
      plain:
        'İnsanların ne düşündüğüne, onayına ve görüşlerine önem verme; çevresindekiler gibi davranma. Düşük puan, kendi görüşünü kendisi oluşturmak istemeyi ve başkalarının ne düşündüğünü daha az dert etmeyi gösterir.',
      poles: { low: 'Kendi görüşüne göre hareket eden', high: 'Başkalarının görüşüne ve onayına önem veren' },
      alpha: 0.7,
      sdRef: 0.52,
    },
    {
      key: ENL,
      name: 'Enerji ve tempo',
      plain: 'Hep bir şeylerle meşgul olma, aynı anda birçok şeyi idare edebilme, çok iş çıkarma ve hareketli bir tempoda yaşama.',
      poles: { low: 'Sakin bir tempoda ilerleyen', high: 'Hareketli ve yoğun bir tempoda yaşayan' },
      alpha: 0.79,
      sdRef: 0.65,
    },
    {
      key: ORG,
      name: 'Düzen ve plan',
      plain: 'Düzeni sevme, plan ve programa göre hareket etme, yapılacak işleri hemen halletme ve eşyalarını yerli yerinde tutma.',
      poles: { low: 'Düzene pek takılmayan', high: 'Düzenli ve planlı' },
      alpha: 0.79,
      sdRef: 0.64,
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) Jackson Kişilik Envanteri’ne (JPI-R; Jackson, 1994) benzeyen 15 ön ölçeğinden beşi: düşünsel karmaşıklık (Intellectual Complexity), yenilikçilik (Ingenuity), uyma (Conformity), etkinlik düzeyi (Activity-Level) ve düzen (Organization). Envanterin kendi maddeleri kullanılmaz; benzer özellikler kamu malı IPIP maddeleriyle ölçülür (Goldberg ve ark., 2006). Seçilen beş ölçeğin bütün maddeleri (50 madde) kullanılır. Öteki ölçekler şu nedenlerle alınmadı: gelenekçilik ölçeği din ve siyaset görüşünü, hoşgörü ölçeği ırk eşitliği ve cezalandırma gibi konulardaki görüşleri, sorumluluk ölçeği vergi ve hile gibi ahlaki davranışları, Makyavelcilik ölçeği başkalarını kendi çıkarı için yönlendirmeyi sorar. Düşünsel genişlik ölçeğinin bir maddesi siyasi tartışmaları sorar; o madde çıkarıldığında bile bu ölçek açık veride düşünsel karmaşıklıkla çok güçlü ilişkilidir (r = .74), bu yüzden ikisinden yalnızca biri alındı. Kaygı, empati, sosyallik, sosyal özgüven ve risk alma ölçekleri ise düşünme ve çalışma tarzından çok duyguları, insan ilişkilerini ve heyecan arayışını anlatır. Uyma ölçeği alındı, çünkü kişinin görüşlerini kendisinin mi oluşturduğunu, yoksa başkalarının görüşüne ve onayına göre mi hareket ettiğini sorar.',
    whatItMeasures:
      'Kişinin düşünürken ve çalışırken kendini nasıl tanımladığını beş özellikte ölçer: soyut, felsefi ve teorik konular üzerine düşünmekten ve kendini incelemekten hoşlanma (soyut ve felsefi konulara ilgi); yeni fikirler ve yollar bulma, cesur planlar kurma (yenilikçilik); insanların ne düşündüğüne, onayına ve görüşlerine önem verme (başkalarının görüşüne önem verme); hep bir şeylerle meşgul olma ve çok iş çıkarma (enerji ve tempo); işleri hemen halletme, plan yapma ve düzeni sevme (düzen ve plan). IPIP’in karşılaştırmasında, ABD’deki Eugene-Springfield Topluluk Örneklemi’nden 471 yetişkinde bu beş ölçeğin JPI-R’deki karşılıklarıyla ilişkisi .59 (etkinlik düzeyi) ile .74 (yenilikçilik) arasındadır; iki ölçümün de hatası hesaba katıldığında .74 ile .95 arasına çıkar. Ölçekhane, aynı örneklemin herkese açık verisinde ölçeklerin IPIP’in 50 maddelik beş faktör ölçeğiyle (Goldberg, 1992) ilişkisini de hesapladı. En güçlü ilişkiler şunlardır: düzen ve plan ile sorumluluk (r = .90); yenilikçilik ile merak ve hayal gücü (r = .83) ve dışadönüklük (r = .42); soyut ve felsefi konulara ilgi ile merak ve hayal gücü (r = .75) ve dışadönüklük (r = .35); enerji ve tempo ile sorumluluk (r = .49) ve dışadönüklük (r = .32). Başkalarının görüşüne önem verme ise merak ve hayal gücüyle (r = −.32) ve duygusal dengeyle (r = −.30) ters yönde ilişkilidir. Bu ilişkilerin bir kısmı ortak cümlelerden gelir: düzen ve plan ölçeğinin beş, yenilikçiliğin dört, soyut ve felsefi konulara ilginin iki cümlesi o ölçekte de vardır. Bu test bir yetenek ya da zekâ testi değildir; sonuç, kişinin kendini nasıl gördüğünü gösterir. Beş ölçek ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Ölçekhane’nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (34 madde); bir maddenin sitede birden çok çevirisi varsa 9. sınıftan başlayan testlerdeki çeviri kullanıldı. Kalan 16 madde için birbirinden bağımsız üç çeviri taslağı hazırlandı ve taslaklar karşılaştırılarak her maddenin son hâli seçildi. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfasında, Eugene-Springfield Topluluk Örneklemi’ndeki 471 yetişkinle hesaplanan iç tutarlılık (Cronbach α) şöyledir: soyut ve felsefi konulara ilgi (düşünsel karmaşıklık) .82, yenilikçilik .84, başkalarının görüşüne önem verme (uyma) .71, enerji ve tempo (etkinlik düzeyi) .81, düzen ve plan .79. Ölçekhane, bu örneklemin herkese açık verisinde (Goldberg, 2018; Goldberg ve Saucier, 2016) her ölçeğin on cümlesinin hepsini cevaplayan 570–623 yetişkinde benzer değerler buldu: sırasıyla .81, .83, .70, .79 ve .80. Ölçüm payı, iki güvenirlik değerinden düşük olanıyla ve bu veriden hesaplanan standart sapmalarla bulunur. Başkalarının görüşüne önem verme ölçeğinin güvenirliği ötekilerden düşüktür. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz. Yorumlamaya yardım için: ABD’deki bir yetişkin örnekleminin açık verisinde (Goldberg, 2018) soyut ve felsefi konulara ilgi, yenilikçilik, enerji ve tempo, düzen ve plan ölçeklerinde kişilerin çoğu (%69–75) “yüksek” düzeydedir; başkalarının görüşüne önem vermede ise yarıdan fazlası (%56) “orta” düzeydedir. Türkiye için böyle bir bilgi yoktur.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Bu IPIP ölçeklerinin güvenirliği ve JPI-R ile ilişkisi yetişkinlerde hesaplanmıştır; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı. Düşünme ve çalışma alışkanlıkları gençlik yıllarında gelişmeye devam edebildiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Bir yeteneği ölçmez; zekâ puanı vermez. Yenilikçilik yaratıcılık becerisini değil, kişinin kendini yeni fikirler bulan biri olarak ne ölçüde gördüğünü gösterir.',
      'Ölçekler 10 cümleden oluşan kısa ölçeklerdir; tek bir ölçeğe bakarak kesin sonuç çıkarılmamalıdır.',
      'Bu test Jackson Kişilik Envanteri’nin (JPI-R) kendisi değildir: benzer özellikleri kamu malı IPIP maddeleriyle ölçen ön ölçeklerdir ve kaynaktaki 15 ölçekten yalnızca beşini içerir. İki envanterin sonuçları farklı çıkabilir.',
      'Ölçeklerin bazıları sitedeki öteki kişilik testlerinin boyutlarıyla çok güçlü ilişkilidir ve bazı cümleler ortaktır (ör. düzen ve plan ile sorumluluk); bu testlerin sonuçları birbirine benzer çıkabilir.',
      'Başkalarının görüşüne önem verme ölçeğinin güvenirliği ötekilerden düşüktür (.70); bu ölçeğin sonucu daha dikkatle yorumlanmalıdır.',
      'Ölçeklerin uçları iyi ya da kötü değildir; her tarzın kendine özgü güçlü yanları vardır.',
      'Bu özellikler zamanla değişebilir: alışkanlıklar ve çevre, kişinin nasıl düşündüğünü ve çalıştığını etkiler.',
      'Tanı koymaz; dikkat ya da öğrenme güçlüğü taraması değildir.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      { text: 'IPIP. JPI-R’ye benzeyen 15 ön IPIP ölçeğinin maddeleri.', url: 'https://ipip.ori.org/newJPI-RKey.htm' },
      { text: 'IPIP. JPI-R ile 15 ön IPIP ölçeğinin karşılaştırması.', url: 'https://ipip.ori.org/newJPI-RTable.htm' },
      { text: 'Jackson, D. N. (1994). Jackson Personality Inventory–Revised manual. Sigma Assessment Systems.' },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. Psychological Assessment, 4(1), 26–42.',
        url: 'https://doi.org/10.1037/1040-3590.4.1.26',
      },
      {
        text: 'Goldberg, L. R. (2018). (2,8,10 & others) International Personality Item Pool (IPIP) [Veri seti]. Eugene-Springfield Community Sample, Harvard Dataverse.',
        url: 'https://doi.org/10.7910/DVN/UF52WY',
      },
      {
        text: 'Goldberg, L. R. ve Saucier, G. (2016). The Eugene-Springfield Community Sample: Information available from the research participants (ORI Technical Report, 56(1)). Oregon Research Institute.',
        url: 'https://ipip.ori.org/ESCS_TechnicalReport_January2016.pdf',
      },
    ],
  },
};
