import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Düşünmeyi Sevme Ölçeği
 * Kaynak: IPIP'in Need for Cognition ölçeği (https://ipip.ori.org/newSingleConstructsKey.htm; Cacioppo ve Petty'nin, 1982,
 * "bilişsel ihtiyaç" kavramına karşılık gelen 10 madde, sayfada α .84). Kamu malıdır. Kaynaktaki 10 maddenin hepsi kullanılır.
 * Aynı 10 madde Öğrenme ve Başarı Özellikleri testinde "Düşünmekten hoşlanma" ölçeğidir; bu test o tek özelliği kısa
 * sürede ve daha ayrıntılı anlatır.
 *
 * Madde anahtarı: n + maddenin IPIP sayfasındaki sırası (sayfa önce altı artı, sonra dört eksi yönlü maddeyi verir).
 * Uygulama sırası ve çeviriler Öğrenme ve Başarı Özellikleri'ndekiyle aynıdır (orada ncog01–ncog10): kaynaktaki sırayla
 * bir artı bir eksi yönlü madde; artılar fazla olduğu için son iki madde artı yönlüdür. Benzer iki madde ("Love to read
 * challenging material" ve "Avoid difficult reading material") birbirinden uzaktadır.
 *
 * Tek ölçek: Altı madde düşünmeyi gerektiren işlerden hoşlanmayı ya da kaçınmayı, dört madde ("Need things explained only
 * once", "Can handle a lot of information", "Am quick to understand things", "Have difficulty understanding abstract ideas")
 * kişinin bir şeyleri ne kadar kolay ve çabuk kavradığını düşündüğünü sorar. Eugene-Springfield verisinde (aşağıda) iki
 * kümenin iç tutarlılığı .77 ve .71, aralarındaki ilişki .66; ölçüm hatası düzeltildiğinde .90. Bu yüzden ayrı puan verilmez.
 * Raporun her düzeyinde ölçeğin zekâyı ölçmediği söylenir; yüksek düzeyde bu dört cümle kişinin kendi görüşü olarak
 * ("düşünüyorsun") anlatılır; bilim kartında dört cümlenin gerçek beceriyi değil kişinin kendini nasıl gördüğünü yansıttığı yazar.
 *
 * Düzeyler: Öğrenme ve Başarı Özellikleri'ndeki eşiklerle aynı (2,6 ve 3,4; üç düzey): aynı on cevap iki testte aynı düzeyi
 * verir.
 *
 * Güvenirlik ve ölçüm payı: Eugene-Springfield Topluluk Örneklemi'nin herkese açık IPIP verisi (Goldberg, 2018, Harvard
 * Dataverse, doi:10.7910/DVN/UF52WY, CC0; "IPIP2539-1.tab", özgün biçimi SPSS taşınabilir dosyası "IPIP2539-1.por"; 1.142 kişi). Örneklem 1993'te Eugene ve
 * Springfield'de (Oregon, ABD) ev sahibi listelerinden gönüllü olarak katılan, o yıl 18–85 yaşlarındaki yetişkinlerdir
 * (Goldberg ve Saucier, 2016). Maddelerin verideki adları: X201, H1311, H1322, X225, X100 ("Quick to understand things."),
 * X211, X176, E171, X109, X248 (1994–1996'da uygulandı). On maddenin hepsini cevaplayan 570 kişide Ölçekhane'nin hesabı:
 * α = .839 (IPIP sayfasındaki .84 ile aynı), madde ortalamasının ortalaması 3,64, standart sapması 0,695 → sdRef 0,70.
 * Aynı yolla IPIP'in Kontrol Odağı (rasyonel) ölçeği .604 bulundu (sayfada .61); hesap yolu IPIP sayfasındaki değerleri
 * yaklaşık olarak yeniden üretir.
 *
 * Karşılıklı çiftler (`oppositePairs`) yoktur: birbirinin tam tersini söyleyen tek çift ("Love to read challenging material"
 * ve "Avoid difficult reading material") vardır; tek çiftle uyarı, dürüst cevaplarda da sık çıkardı. Madde sayısı 20'den az
 * olduğu için "hep aynı seçenek" denetimi çalışmaz; çok hızlı cevap ve eksik madde denetlenir. Dört madde ters yönlü olduğu
 * için bütün cümlelere aynı (ortada olmayan) cevap ayrıca kalite notu verir (`sameAnswerCheck`; 2026-10-22 incelemesi).
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır). Türkçe çevirinin
 * güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const NFC = 'need_for_cognition';

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['n01', false, 'Karmaşık problemleri çözmeyi severim.', 'Like to solve complex problems.'],
  ['n07', true, 'Soyut fikirleri anlamakta zorlanırım.', 'Have difficulty understanding abstract ideas.'],
  ['n02', false, 'Bir şeyin bana bir kez anlatılması yeter.', 'Need things explained only once.'],
  ['n08', true, 'Karmaşık insanlardan uzak durmaya çalışırım.', 'Try to avoid complex people.'],
  ['n03', false, 'Çok miktarda bilgiyle başa çıkabilirim.', 'Can handle a lot of information.'],
  ['n09', true, 'Okuması zor metinlerden kaçınırım.', 'Avoid difficult reading material.'],
  ['n04', false, 'İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim.', 'Love to think up new ways of doing things.'],
  ['n10', true, 'Felsefi tartışmalardan kaçınırım.', 'Avoid philosophical discussions.'],
  ['n05', false, 'Bir şeyleri çabuk kavrarım.', 'Am quick to understand things.'],
  ['n06', false, 'Anlamak için kafa yormam gereken metinler okumayı severim.', 'Love to read challenging material.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: NFC,
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const dusunmeyiSevme: LikertInstrument = {
  slug: 'dusunmeyi-sevme-olcegi',
  version: 1,
  engine: 'likert',
  name: 'Düşünmeyi Sevme Ölçeği',
  shortName: 'Düşünmeyi sevme',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 2,
  sortOrder: 15.5,
  tagline:
    'Karmaşık problemler, kafa yoran metinler ve felsefi tartışmalar gibi düşünmeyi gerektiren işlerden ne kadar hoşlandığını 10 kısa cümleyle gösterir.',
  description:
    'Araştırmacılar, düşünmeyi gerektiren işlere girişme ve bunlardan keyif alma eğilimine “bilişsel ihtiyaç” der (Cacioppo ve Petty, 1982). Bu kısa ölçek, kamu malı olan Uluslararası Kişilik Madde Havuzu’ndaki (IPIP) 10 maddelik karşılığına dayanır: karmaşık problemleri çözmekten, kafa yoran metinler okumaktan ve felsefi tartışmalardan ne kadar hoşlandığını, ayrıca bir şeyleri ne kadar kolay ve çabuk kavradığını düşündüğünü sorar. Yaklaşık 2 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Aynı 10 cümle Öğrenme ve Başarı Özellikleri testinde de “Düşünmekten hoşlanma” ölçeği olarak yer alır ve aynı cevaplar iki testte aynı düzeyi verir; bu test o tek özelliği daha ayrıntılı anlatır ve sonucu ölçüm payıyla gösterir. Bir yetenek ya da zekâ testi değildir; tanı koymaz.',
  intro: {
    title: 'Düşünmeyi ne kadar seviyorsun?',
    paragraphs: [
      'Birazdan düşünmeyle ilgili 10 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok; bu bir yetenek ya da zekâ testi değil. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar.',
      'Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur. Yaklaşık 2 dakika sürer.',
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
  sameAnswerCheck: true,
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
  scales: [
    {
      key: NFC,
      name: 'Düşünmeyi sevme',
      plain: 'Karmaşık problemler, kafa yoran metinler ve felsefi tartışmalar gibi düşünmeyi gerektiren işlere girişme ve bunlardan keyif alma eğilimi.',
      poles: { low: 'Kafa yoran işlere daha az istekli', high: 'Kafa yoran işlerden hoşlanan' },
      alpha: 0.84,
      sdRef: 0.7,
    },
  ],
  items,
  science: {
    basedOn:
      'IPIP’teki Need for Cognition ölçeği: Cacioppo ve Petty’nin (1982) “bilişsel ihtiyaç” kavramına karşılık gelen, Uluslararası Kişilik Madde Havuzu’nda (IPIP; Goldberg ve ark., 2006) yayımlanan 10 maddelik kamu malı ölçek. Kaynaktaki 10 maddenin hepsi kullanılır.',
    whatItMeasures:
      'Düşünmeyi gerektiren işlere girişme ve bunlardan keyif alma eğilimini ölçer. Altı cümle bu işlerden hoşlanmayı ya da kaçınmayı sorar: karmaşık problemler, işleri yapmanın yeni yolları, kafa yoran metinler, felsefi tartışmalar ve karmaşık insanlar. Dört cümle ise kişinin bir şeyleri ne kadar kolay ve çabuk kavradığını düşündüğünü sorar. İki kümenin puanları birbiriyle çok yakından ilişkili olduğu için tek puan hesaplanır. Bu eğilimin okul başarısıyla ilişkisi küçüktür: 53.258 kişiyi kapsayan bir meta-analizde ilişki r = .20 bulunmuş; ilişkinin büyüklüğü sınıf düzeyine, bölgeye ve başarının nasıl ölçüldüğüne göre değişmiştir (Liu ve Nesbit, 2024). Zekâ testleriyle ilişkisi de küçük ile orta arasındadır (akıl yürütme testleriyle r = .19, genel bilgi ve kelime testleriyle r = .24; Schweitzer ve ark., 2025); yani zekâ ile aynı şey değildir. Almanya’da 5–7. sınıflarda izlenen 922 öğrencide bu eğilim, derslere ilginin sonraki gelişimini küçük ölçüde de olsa öngörmüş; tersi görülmemiştir (Matthes ve ark., 2025).',
    turkishVersion:
      'Maddeler, Öğrenme ve Başarı Özellikleri testindeki “Düşünmekten hoşlanma” ölçeğinin çevirileriyle birebir aynıdır; uygulama sırası da o testteki sıradır. “Have difficulty understanding abstract ideas” maddesi, 9. sınıftan başlayan öteki kişilik testlerindeki gibi “Soyut fikirleri anlamakta zorlanırım” diye çevrildi. Bu IPIP maddelerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı; bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfasında ölçeğin iç tutarlılığı (Cronbach α) .84 olarak verilir. Ölçekhane, IPIP maddelerinin uygulandığı ABD’deki bir topluluk örnekleminin herkese açık verisinde (Eugene-Springfield Topluluk Örneklemi; on cümlenin hepsini cevaplayan 570 yetişkin; Goldberg, 2018; Goldberg ve Saucier, 2016) aynı değeri buldu (.84). Ölçüm payı, bu veriden hesaplanan standart sapmayla (0,70) bulunur. Belçika’da ergenlerle başka bir bilişsel ihtiyaç ölçeğiyle yapılan bir çalışmada, gençlerin 7. ve 11. sınıflardaki puanları arasındaki ilişki (r = .50) beş temel kişilik özelliğininkine benzer bulunmuştur (Lavrijsen ve ark., 2024). Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Bu IPIP ölçeğinin güvenirliği yetişkinlerde hesaplanmıştır; aynı maddelerle ergenlerde yapılmış bir güvenirlik çalışmasına ulaşılamadı. Bilişsel ihtiyaç başka ölçeklerle ergenlerde de incelenmiştir: Belçika’da 3.409 ergenle yapılan bir çalışmada bu eğilim 7. sınıftan 11. sınıfa görece kararlı kalmış, ama gençler arasında farklı seyirler de görülmüştür (Lavrijsen ve ark., 2024).',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır.',
      'Dört cümle kişinin bir şeyleri ne kadar kolay ve çabuk kavradığını düşündüğünü sorar; bu, gerçek beceriyi değil kişinin kendini nasıl gördüğünü gösterir. Ölçek zekâyı ölçmez.',
      'Okul başarısıyla ilişkisi küçüktür; tek başına başarı tahmini ya da yönlendirme için kullanılmamalıdır.',
      'Ölçüm payı ABD’deki yetişkinlerden hesaplanır; ergenlerde ve Türkçe çeviride farklı olabilir.',
      'Bu eğilim zamanla değişebilir; sonuç kalıcı bir etiket değildir.',
      'Aynı 10 cümle Öğrenme ve Başarı Özellikleri testinde de vardır; iki testi çözen kişi aynı cümleleri iki kez görür.',
      'Tanı koymaz; bir yetenek ya da zekâ testi değildir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynak çalışmalardaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Cacioppo, J. T. ve Petty, R. E. (1982). The need for cognition. Journal of Personality and Social Psychology, 42(1), 116–131.',
        url: 'https://doi.org/10.1037/0022-3514.42.1.116',
      },
      { text: 'IPIP. Tek yapılı ölçekler: Need for Cognition maddeleri ve anahtarı.', url: 'https://ipip.ori.org/newSingleConstructsKey.htm' },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Goldberg, L. R. (2018). (2,8,10 & others) International Personality Item Pool (IPIP) [Veri seti]. Eugene-Springfield Community Sample, Harvard Dataverse.',
        url: 'https://doi.org/10.7910/DVN/UF52WY',
      },
      {
        text: 'Goldberg, L. R. ve Saucier, G. (2016). The Eugene-Springfield Community Sample: Information available from the research participants (ORI Technical Report, 56(1)). Oregon Research Institute.',
        url: 'https://ipip.ori.org/ESCS_TechnicalReport_January2016.pdf',
      },
      {
        text: 'Liu, Q. ve Nesbit, J. C. (2024). The relation between need for cognition and academic achievement: A meta-analysis. Review of Educational Research, 94(2), 155–192.',
        url: 'https://doi.org/10.3102/00346543231160474',
      },
      {
        text: 'Schweitzer, F. M., Lindenberg, N. M., Fleischhauer, M. ve Enge, S. (2025). The relationship of need for cognition and typical intellectual engagement with intelligence and executive functions: A multi-level meta-analysis. Journal of Intelligence, 13(11), 142.',
        url: 'https://doi.org/10.3390/jintelligence13110142',
      },
      {
        text: 'Lavrijsen, J., Aerts, E., Preckel, F., Ramos, A. ve Verschueren, K. (2024). Becoming a “hungry mind”: Stability and change in need for cognition across adolescence. Journal of Intelligence, 12(10), 103.',
        url: 'https://doi.org/10.3390/jintelligence12100103',
      },
      {
        text: 'Matthes, J., Scherrer, V. ve Preckel, F. (2025). Need for cognition predicts academic interest development but not the other way around: A longitudinal study of secondary school students. Child Development, 96(5), 1675–1687.',
        url: 'https://doi.org/10.1111/cdev.14262',
      },
    ],
  },
};
