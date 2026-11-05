import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Sınav Kaygısı ve Baş Etme
 * Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; Spielberger'in Sınav Kaygısı Envanteri'nin (TAI), Sarason'un
 * "Reactions to Tests" ölçeğinin, Hodapp'ın TAI-G'sinin, Cassady ve Johnson'ın Bilişsel Sınav Kaygısı Ölçeği'nin, Stöber'in
 * COPEAU'sunun ya da Türkiye'de kullanılan sınav kaygısı envanterlerinin maddeleri kullanılmamış, çevrilmemiştir.
 *
 * Yapı. Sınav kaygısı araştırmalarında düşünce yanı (endişe) ile bedensel yan (heyecan, bedensel tepkiler) ayrı ölçülür
 * (Liebert ve Morris, 1967). Sonraki çalışmalar düşünce yanını ikiye ayırır: sınav öncesi ve sırasındaki endişeli düşünceler
 * ve sınav sırasında dikkatin sorudan kayması, bilinenin o an hatırlanamaması (Sarason, 1984'teki sınavla ilgisiz düşünceler;
 * Hodapp'ın TAI-G'sinde "interference"; Stöber, 2004'ün özetiyle). Baş etme tarafı Stöber'in (2004) sınav öncesi kaygıyla baş
 * etme yollarına dayanır: göreve yönelme ve hazırlık, destek arama ve kaçınma. Beş alan:
 *  - Endişeli düşünceler (worry): sonucun kötü olacağı, yeterince hazır olmama, başkalarının bakışı, başarısızlığın büyük
 *    sonuçları. Yüksek puan endişenin sık olduğunu gösterir.
 *  - Bedensel tepkiler (body): mide, kalp, ellerde terleme ya da titreme; ters: sınavdan önceki gece rahat uyuma, sınav
 *    sırasında bedenen rahat olma. Yüksek puan tepkilerin sık olduğunu gösterir.
 *  - Sınav sırasında takılma (block): bileni o an hatırlayamama, aklın sorudan kayıp kaygıya gitmesi, bir soruda takılınca
 *    sonrakilere odaklanamama, gerilince soruyu tekrar tekrar okuyup kavrayamama. Yüksek puan takılmanın sık olduğunu
 *    gösterir. Araştırmalardaki "interference" (dikkati dağıtan düşünceler) bu alanın bir parçasıdır (T2, T5).
 *  - Sınava hazırlık (prep): çalışmayı günlere yayma, kendini sınama (Dunlosky ve ark., 2013'te en yararlı bulunan iki
 *    yöntem), neyin sorulacağına göre plan; ters: son geceye bırakma, sınavı düşünmemek için başka şeylerle oyalanma
 *    (Stöber'deki kaçınma).
 *  - Baş etme yolları (calm): yavaş nefesle toparlanma, sınavla ilgili duyguları güvenilen biriyle konuşma (Stöber'deki
 *    destek arama), takılan soruyu geçip sonra dönme, kendine sakinleştirici sözler söyleme; ters: takılan soruda uzun süre
 *    kalma. Nefes, kendine söylenen sözler ve soruyu geçme Stöber'in ayrımları değildir; araştırmalarda ve rehber yazısında
 *    anlatılan yollardır. Maddeler kaygıyı varsaymaz ("gerildiğimde" yok): sınavlarda pek kaygılanmayan biri de cevaplayabilir;
 *    karşıt çift (C3–C5) de kaygısı olmayan biri için anlamlıdır.
 * İlk üç alanda yüksek puan kaygının o yanının sık yaşandığını, son iki alanda yüksek puan baş etme yolunun sık
 * kullanıldığını gösterir; bu yüzden rapor değerlendirici değildir (güçlü yan ya da eksik yan diye ayırmaz) ve bütün
 * alanlar günlük hayat örneklerinde gelişim tonundadır (lib/reports/daily-parts.ts, `GROWTH_SLUGS`).
 *
 * Maddeler belirli bir sınava değil, genel olarak sınavlara yöneliktir; okula özgü sözcük taşımaz (yalnızca "sınav"):
 * yetişkinlere de açıktır (üniversite, ehliyet ya da iş sınavlarına hazırlananlar). Her alanda beş madde; hazırlıkta ve
 * bedende iki, ötekilerde birer ters madde (25 maddenin 7'si); birbirinin tersini söyleyen beş çift (her alanda bir).
 * Bağımsız inceleme (2026-11-05): Sarason'un ölçeğindeki kalp ve mide maddelerine benzeyen iki cümle yeniden yazıldı; "olur"
 * ve "pek" gibi sıklık ölçeğiyle çakışan sözler, iki şeyi birden soran cümleler ve kaygıyı varsayan baş etme cümleleri
 * düzeltildi (tests/sinav-kaygisi.test.ts denetler).
 *
 * Puanlama: her alan maddelerinin ortalamasıdır (1–5); en az %80'i cevaplanmalıdır. Düzeyler bir ondalıklı ortalamaya
 * göredir: 1,0–2,4 düşük ("nadiren" ve daha seyrek), 2,5–3,4 orta ("bazen"), 3,5–5,0 yüksek ("sık sık" ve daha sık).
 *
 * Destek notu: kaygının üç yanından biri yüksekse raporda "Konuşmak istersen / Destek almak isterseniz" kutusu açılır
 * (rapor şablonundaki `support`) ve yol haritasının 3. haftası o yana ayrılır; rehberdeki "Sınav kaygısı" yazısına (yetişkine
 * de) bağlantı verilir. Durum: pilot.
 */

const W = 'worry';
const B = 'body';
const T = 'block';
const P = 'prep';
const C = 'calm';

/**
 * Uygulama sırası: her beşlikte alanlar sırayla döner (hazırlık, endişe, beden, takılma, baş etme). Ters maddeler 2.–5.
 * beşliklere dağıtılır; karşıt çiftlerin ikinci cümlesi en az iki beşlik sonra gelir.
 */
const RAW: { key: string; scale: string; text: string; reverse?: boolean }[] = [
  { key: 'P1', scale: P, text: 'Sınava çalışmaya erkenden başlar, çalışmayı günlere yayarım.' },
  { key: 'W1', scale: W, text: 'Bir sınav yaklaşınca “Ya kötü geçerse?” diye düşünüp dururum.' },
  { key: 'B2', scale: B, text: 'Sınav kâğıdı önüme gelince kalbim küt küt atar.' },
  { key: 'T2', scale: T, text: 'Sınav sırasında aklım sorulardan kayıp kaygılarıma gider.' },
  { key: 'C1', scale: C, text: 'Sınavdan önce birkaç yavaş nefes alarak kendimi toparlarım.' },

  { key: 'P2', scale: P, text: 'Sınava çalışırken soru çözerek ya da bakmadan anlatarak kendimi sınarım.' },
  { key: 'W2', scale: W, text: 'Sınav sonucumun başkalarının bana bakışını değiştireceğinden endişelenirim.' },
  { key: 'B4', scale: B, reverse: true, text: 'Önemli bir sınavdan önceki gece rahatça uyurum.' },
  { key: 'T1', scale: T, text: 'Sınavda bildiğim bir şeyi o an hatırlayamam.' },
  { key: 'C2', scale: C, text: 'Sınavlarla ilgili duygularımı güvendiğim biriyle konuşurum.' },

  { key: 'P4', scale: P, reverse: true, text: 'Sınava çalışmayı son geceye bırakırım.' },
  { key: 'W3', scale: W, text: 'Sınava hazırlanırken çalıştıklarımın yetmeyeceğinden endişelenirim.' },
  { key: 'B3', scale: B, text: 'Sınav sırasında ellerim terler ya da titrer.' },
  { key: 'T3', scale: T, text: 'Sınavda bir soruda takılınca sonraki sorulara odaklanamam.' },
  { key: 'C3', scale: C, text: 'Sınavda takıldığım bir soruyu geçip sonra ona geri dönerim.' },

  { key: 'P3', scale: P, text: 'Sınavda nelerin sorulacağını öğrenip çalışmamı buna göre planlarım.' },
  { key: 'W5', scale: W, reverse: true, text: 'Bir sınav yaklaşırken sonuç konusunda içim rahattır.' },
  { key: 'B1', scale: B, text: 'Sınav yaklaşınca midemde bir sıkışma hissederim.' },
  { key: 'T5', scale: T, reverse: true, text: 'Sınav sırasında dikkatimi sorulara verebilirim.' },
  { key: 'C4', scale: C, text: 'Sınavdan önce kendime “Elimden geleni yapacağım” gibi sakinleştirici sözler söylerim.' },

  { key: 'P5', scale: P, reverse: true, text: 'Sınavı düşünmemek için başka şeylerle oyalanırım.' },
  { key: 'W4', scale: W, text: 'Bir sınavda başarısız olursam her şeyin kötüye gideceğini düşünürüm.' },
  { key: 'B5', scale: B, reverse: true, text: 'Sınav sırasında kendimi bedenen rahat hissederim.' },
  { key: 'T4', scale: T, text: 'Sınavda gerildiğimde aynı soruyu tekrar tekrar okurum ama aklıma girmez.' },
  { key: 'C5', scale: C, reverse: true, text: 'Sınavda takıldığım bir soruyu geçmek yerine onda uzun süre kalırım.' },
];

export const sinavKaygisiBasEtme: LikertInstrument = {
  slug: 'sinav-kaygisi-ve-bas-etme',
  version: 1,
  engine: 'likert',
  name: 'Sınav Kaygısı ve Baş Etme',
  shortName: 'Sınav kaygısı',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 35.8,
  tagline:
    'Sınav kaygısının üç yanını (endişeli düşünceler, bedensel tepkiler, sınav sırasında takılma) ve kaygıyla nasıl baş ettiğini gösterir.',
  description:
    'Bu test sınav kaygısını üç yanıyla, onunla baş etmeyi de iki yanıyla inceler: sınav yaklaşınca akla gelen endişeli düşünceler, bedendeki tepkiler (mide, kalp, eller, uyku), sınav sırasında takılma (bilineni o an hatırlayamamak, dikkatin sorudan kayması), sınava hazırlık ve sakinleşme, güvenilen biriyle konuşma gibi baş etme yolları. Rapor her alanı ayrı ayrı anlatır, ardından birlikte yorumlar ve araştırmaların ne bulduğunu abartmadan söyler. Kaygının bir yanı yüksek çıkarsa rapora bir destek notu eklenir ve rehberdeki “Sınav kaygısı” yazısına bağlantı verilir. Maddeler sıfırdan yazılmıştır; test yaklaşık 5 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Sonuç bir tanı değildir.',
  intro: {
    title: 'Sınavlar seni nasıl etkiliyor?',
    paragraphs: [
      'Birazdan sınavlarla ilgili 25 cümle göreceksin: sınavdan önceki düşüncelerin, bedenindeki tepkiler, sınav sırasında yaşadıkların ve kaygıyla nasıl baş ettiğin. Her birinin senin için ne sıklıkla doğru olduğunu seç.',
      'Belirli bir sınavı değil, genellikle girdiğin ya da hazırlandığın sınavları düşün. Sınavlarda pek kaygılanmıyorsan bazı cümlelere “Hiçbir zaman” demen olağandır.',
      'Doğru ya da yanlış cevap yok; bu bir başarı testi değil. Olması gerekeni değil, gerçekte nasıl olduğunu seçersen rapor sana en çok yarar.',
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
    ['P1', 'P4'],
    ['W1', 'W5'],
    ['B2', 'B5'],
    ['T2', 'T5'],
    ['C3', 'C5'],
  ],
  scales: [
    {
      key: W,
      name: 'Endişeli düşünceler',
      plain:
        'Sınav yaklaşınca sonucun kötü olacağını, çalıştıklarının yetmeyeceğini ya da başkalarının bakışının değişeceğini düşünme. Puan yüksekse bu düşünceler sık gelir.',
      poles: { low: 'Sınavı pek dert etmez', high: 'Sık sık endişelenir' },
    },
    {
      key: B,
      name: 'Bedensel tepkiler',
      plain:
        'Sınavdan önce ve sınav sırasında bedende hissedilen heyecan: midede sıkışma, hızlı atan kalp, terleyen ya da titreyen eller, sınavdan önceki gece rahat uyuyamama. Puan yüksekse bu tepkiler sık olur.',
      poles: { low: 'Bedeni rahat', high: 'Heyecanı bedeninde hisseder' },
    },
    {
      key: T,
      name: 'Sınav sırasında takılma',
      plain:
        'Sınav sırasında bilineni o an hatırlayamama, aklın sorulardan kayıp kaygıya gitmesi, bir soruda takılınca sonrakilere odaklanamama. Puan yüksekse bunlar sık yaşanır.',
      poles: { low: 'Dikkatini sorulara verir', high: 'Sınavda sık takılır' },
    },
    {
      key: P,
      name: 'Sınava hazırlık',
      plain:
        'Sınava erkenden başlayıp çalışmayı günlere yayma, soru çözerek ya da bakmadan anlatarak kendini sınama, neyin sorulacağına göre plan yapma. Puan yüksekse hazırlık daha önceden ve planlıdır.',
      poles: { low: 'Hazırlığı daha az planlı', high: 'Önceden ve planlı hazırlanır' },
    },
    {
      key: C,
      name: 'Baş etme yolları',
      plain:
        'Yavaş nefesle toparlanma, sınavla ilgili duygularını güvendiği biriyle konuşma, takıldığı soruyu geçip sonra dönme ve kendine sakinleştirici sözler söyleme. Puan yüksekse bu yollar sık kullanılır.',
      poles: { low: 'Bu yolları az kullanır', high: 'Bu yolları sık kullanır' },
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; başka bir sınav kaygısı ölçeğinin maddeleri kullanılmamış ve çevrilmemiştir. Yapısı sınav kaygısı araştırmalarının iki ayrımına dayanır: kaygının düşünce yanı ile bedensel yanı (Liebert ve Morris, 1967) ve düşünce yanının içinde endişe ile sınav sırasında dikkati dağıtan düşünceler (Sarason, 1984; Stöber, 2004). Baş etme tarafında hazırlık, güvenilen biriyle konuşma ve sınavı düşünmemek için oyalanma, Stöber’in (2004) incelediği yollara (hazırlık, destek arama, kaçınma) karşılık gelir; yavaş nefes, kendine söylenen sakinleştirici sözler ve takılan soruyu geçip sonra dönme o çalışmanın ayrımları değildir, sınav kaygısı üzerine yazılmış önerilerde anlatılan yollardır.',
    whatItMeasures:
      'Sınav kaygısı, değerlendirilme durumlarında ortaya çıkan ve sınav anını zorlaştırabilen endişe, gerginlik ve bedensel tepkilerdir. Bu test onu üç yanıyla ölçer: sınav yaklaşınca akla gelen endişeli düşünceler; bedendeki tepkiler (mide, kalp, eller, uyku); sınav sırasında takılma, yani bilineni o an hatırlayamamak ve dikkatin sorudan kayması. Yanında kaygıyla baş etmenin iki yanını ölçer: sınava hazırlık (çalışmayı günlere yaymak, kendini sınamak, son geceye bırakmamak) ve baş etme yolları (yavaş nefes, güvenilen biriyle konuşmak, takılan soruyu geçip sonra dönmek, kendine sakinleştirici sözler söylemek). İlk üç alanda yüksek puan kaygının o yanının sık yaşandığını, son ikisinde baş etme yolunun sık kullanıldığını gösterir; toplam bir puan yoktur.\n\nAraştırmaları birleştiren incelemelerde sınav kaygısı ile sınav sonuçları arasında küçük ile orta büyüklükte ters yönde bir ilişki bulunmuştur; ilişki en çok ortaokul yıllarında belirgindir. Aynı incelemede düşük öz-saygı daha yüksek sınav kaygısıyla güçlü biçimde ilişkilidir; sınavın zor görülmesi ve önemli sonuçları olması da daha yüksek kaygıyla ilişkilidir (von der Embse ve ark., 2018). Sınav sonuçlarıyla kaygının düşünce yanı, bedensel yanından daha çok ilişkilidir (Hembree, 1988; von der Embse ve ark., 2018; aktaran Schillinger ve ark., 2021). 730 üniversite öğrencisiyle, çoğu matematikte yapılan ölçümlerde sonuçlarla en tutarlı ilişkili yanlar sınav sırasında dikkati dağıtan düşünceler ve kendine güvensizlik olmuştur; endişe hiçbir ölçümle ayrıca ilişkili çıkmamış, bedendeki heyecan test puanlarıyla ilişkili çıkmamış, lise matematik notuyla ise olumlu yönde ilişkili çıkmıştır (Schillinger ve ark., 2021). Başka bir çalışmada orta düzeydeki bedensel heyecan genellikle daha yüksek sınav puanlarıyla birlikte görülmüştür (Cassady ve Johnson, 2002); 730 öğrencilik çalışmada ise heyecanın orta düzeyde en yararlı olduğunu gösteren böyle bir ilişki bulunmamıştır (Schillinger ve ark., 2021).\n\nYanlar baş etmeyle farklı ilişkilidir: 162 öğrenciyle yapılan bir çalışmada endişe daha çok hazırlanmaya yönelmekle, sınav sırasında takılma ise kaçınmayla ve daha az hazırlanmaya yönelmekle birlikte görülmüştür (Stöber, 2004). Sınav kaygısını azaltmaya yönelik programların kaygıyı azalttığı görülmüştür: 56 çalışmayı birleştiren bir incelemede en etkili programlar çalışma becerilerini davranışçı ya da bilişsel yöntemlerle birleştirenlerdir; okul çağındaki öğrencilerle yapılmış çalışma azdır (Ergene, 2003). Sınav kaygısı yüksek üniversite öğrencileriyle yapılan kontrollü çalışmalarda programlar kaygıyı azaltmış ve sınav sonuçlarını biraz yükseltmiştir; çalışmaların çoğu küçüktür ve kanıtın niteliği sınırlıdır (Huntley ve ark., 2019).\n\nRaporun önerileri bu araştırmalarda ve sınav kaygısı üzerine yazılmış önerilerde anlatılan küçük adımlardır: çalışmayı günlere yaymak ve kendini sınamak (Dunlosky ve ark., 2013), sınav öncesindeki heyecanın zarar vermediğini, yardım edebileceğini düşünmek (Jamieson ve ark., 2010) ve sınavdan hemen önce endişeleri kâğıda yazmak. Bu sonuncusu bir çalışmada sınav puanlarını yükseltmiş (Ramirez ve Beilock, 2011), ancak o araştırmanın deneylerinden birini daha büyük bir örneklemle tekrarlayan bir çalışmada aynı etki bulunamamıştır (Camerer ve ark., 2018). Bu test sınav başarısını ölçmez ve öngörmez.',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Türkiye’de sınav kaygısını ölçen uyarlanmış ölçekler vardır; örneğin Bilişsel Sınav Kaygısı Ölçeği’nin yenilenmiş sürümü Türkçeye uyarlanmıştır (Bozkurt ve ark., 2017). Bu testin maddeleri o ölçeklerin maddeleri değildir ve o çalışmaların sonuçları bu test için norm sayılmaz. Her alanda birbirinin tersini söyleyen bir cümle çifti vardır; beş çiftten en az üçünde iki cümleye de aynı yöndeki iki seçenekten biri (“Sık sık” ya da “Her zaman”; “Hiçbir zaman” ya da “Nadiren”) verilirse raporda uyarı gösterilir.',
    reliability: 'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar cevapların ortalamasına göre (1: hiçbir zaman, 5: her zaman) yorumlanır; kişi başkalarıyla karşılaştırılmaz.',
    ageNote:
      '5. sınıftan itibaren; mezunlar ve yetişkinler de çözebilir (üniversite, ehliyet ya da iş sınavlarına hazırlananlar gibi). Maddeler belirli bir sınava değil, genel olarak sınavlara yöneliktir. Araştırmalarda sınav kaygısı ile sınav sonuçları arasındaki ilişki en çok ortaokul yıllarında belirgin bulunmuştur (von der Embse ve ark., 2018). İngiltere’de 14–16 yaşlarındaki öğrencilerle yapılan geniş bir çalışmada öğrencilerin yaklaşık %16’sı kendini yüksek düzeyde sınav kaygılı olarak tanımlamış; oran kızlarda daha yüksek bulunmuştur (Putwain ve Daly, 2014).',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Kişinin kendi bildirimine dayanır. Yaklaşan önemli bir sınav, o günkü ruh hâli ve kendini nasıl göstermek istediği cevapları etkileyebilir.',
      'Tanı koymaz; bir ruh sağlığı taraması değildir ve uzman değerlendirmesinin yerini tutmaz. Kaygı uzun süredir uykuyu, okula ya da işe gitmeyi ya da günlük hayatı belirgin biçimde etkiliyorsa okulun rehberlik servisiyle ya da bir uzmanla görüşmek iyi gelebilir.',
      'Cümleler genel olarak sınavları sorar. Kişi bir derste, bir sınav türünde (ör. sözlü sınav, büyük bir giriş sınavı) daha çok kaygılanabilir; rapor bu farkları göstermez.',
      'Baş etme yollarının puanı bir yolun ne sıklıkla kullanıldığını gösterir, işe yarayıp yaramadığını göstermez. Sınavlarda pek kaygılanmayan biri bu yolları az kullanabilir; bu bir eksiklik değildir.',
      'Sınav kaygısı ile sınav sonuçları arasındaki ilişki küçük ile orta büyüklüktedir (von der Embse ve ark., 2018): kaygısı yüksek biri de iyi sonuç alabilir. Bu test sınav başarısını ölçmez ve öngörmez.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı. Her alan beş cümleyle ölçüldüğü için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      {
        text: 'Liebert, R. M. ve Morris, L. W. (1967). Cognitive and emotional components of test anxiety: A distinction and some initial data. Psychological Reports, 20(3), 975–978.',
        url: 'https://doi.org/10.2466/pr0.1967.20.3.975',
      },
      {
        text: 'Sarason, I. G. (1984). Stress, anxiety, and cognitive interference: Reactions to tests. Journal of Personality and Social Psychology, 46(4), 929–938.',
        url: 'https://doi.org/10.1037/0022-3514.46.4.929',
      },
      {
        text: 'Stöber, J. (2004). Dimensions of test anxiety: Relations to ways of coping with pre-exam anxiety and uncertainty. Anxiety, Stress & Coping, 17(3), 213–226.',
        url: 'https://doi.org/10.1080/10615800412331292615',
      },
      {
        text: 'Hembree, R. (1988). Correlates, causes, effects, and treatment of test anxiety. Review of Educational Research, 58(1), 47–77.',
        url: 'https://doi.org/10.3102/00346543058001047',
      },
      {
        text: 'von der Embse, N., Jester, D., Roy, D. ve Post, J. (2018). Test anxiety effects, predictors, and correlates: A 30-year meta-analytic review. Journal of Affective Disorders, 227, 483–493.',
        url: 'https://doi.org/10.1016/j.jad.2017.11.048',
      },
      {
        text: 'Schillinger, F. L., Mosbacher, J. A., Brunner, C., Vogel, S. E. ve Grabner, R. H. (2021). Revisiting the role of worries in explaining the link between test anxiety and test performance. Educational Psychology Review, 33(4), 1887–1906.',
        url: 'https://doi.org/10.1007/s10648-021-09601-0',
      },
      {
        text: 'Cassady, J. C. ve Johnson, R. E. (2002). Cognitive test anxiety and academic performance. Contemporary Educational Psychology, 27(2), 270–295.',
        url: 'https://doi.org/10.1006/ceps.2001.1094',
      },
      {
        text: 'Ergene, T. (2003). Effective interventions on test anxiety reduction: A meta-analysis. School Psychology International, 24(3), 313–328.',
        url: 'https://doi.org/10.1177/01430343030243004',
      },
      {
        text: 'Huntley, C. D., Young, B., Temple, J., Longworth, M., Tudur Smith, C., Jha, V. ve Fisher, P. L. (2019). The efficacy of interventions for test-anxious university students: A meta-analysis of randomized controlled trials. Journal of Anxiety Disorders, 63, 36–50.',
        url: 'https://doi.org/10.1016/j.janxdis.2019.01.007',
      },
      {
        text: 'Putwain, D. W. ve Daly, A. L. (2014). Test anxiety prevalence and gender differences in a sample of English secondary school students. Educational Studies, 40(5), 554–570.',
        url: 'https://doi.org/10.1080/03055698.2014.953914',
      },
      {
        text: 'Bozkurt, S., Ekitli, G. B., Thomas, C. L. ve Cassady, J. C. (2017). Validation of the Turkish version of the Cognitive Test Anxiety Scale–Revised. SAGE Open, 7(1), 2158244016669549.',
        url: 'https://doi.org/10.1177/2158244016669549',
      },
      {
        text: 'Ramirez, G. ve Beilock, S. L. (2011). Writing about testing worries boosts exam performance in the classroom. Science, 331(6014), 211–213.',
        url: 'https://doi.org/10.1126/science.1199427',
      },
      {
        text: 'Camerer, C. F., Dreber, A., Holzmeister, F., Ho, T.-H., Huber, J., Johannesson, M., Kirchler, M., Nave, G., Nosek, B. A., Pfeiffer, T. ve ark. (2018). Evaluating the replicability of social science experiments in Nature and Science between 2010 and 2015. Nature Human Behaviour, 2(9), 637–644.',
        url: 'https://doi.org/10.1038/s41562-018-0399-z',
      },
      {
        text: 'Jamieson, J. P., Mendes, W. B., Blackstock, E. ve Schmader, T. (2010). Turning the knots in your stomach into bows: Reappraising arousal improves performance on the GRE. Journal of Experimental Social Psychology, 46(1), 208–212.',
        url: 'https://doi.org/10.1016/j.jesp.2009.08.015',
      },
      {
        text: 'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J. ve Willingham, D. T. (2013). Improving students’ learning with effective learning techniques: Promising directions from cognitive and educational psychology. Psychological Science in the Public Interest, 14(1), 4–58.',
        url: 'https://doi.org/10.1177/1529100612453266',
      },
    ],
  },
};
