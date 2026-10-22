import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Hızlı Kişilik Testi
 * Kaynak: Mini-IPIP (Donnellan, Oswald, Baird ve Lucas, 2006). Kişiliğin beş temel boyutunu her biri dört maddeyle ölçen
 * 20 maddelik kısa form. Maddeler Uluslararası Kişilik Madde Havuzu'ndaki (IPIP) 50 maddelik Beş Faktör belirteçlerinden
 * (Goldberg, 1992) seçilmiştir; kamu malıdır. Maddeler, yönleri ve iç tutarlılıklar IPIP'in anahtar sayfasından
 * (https://ipip.ori.org/MiniIPIPKey.htm) alındı. Kaynaktaki 20 maddenin hepsi kullanılır.
 *
 * Uygulama sırası kaynaktaki sıradır (madde 1–20; Martínez-Molina ve Arias, 2018, Ek A ve B): beş boyut sırayla döner
 * (dışadönüklük, uyumluluk, sorumluluk, duygusal denge, merak ve hayal gücü), art arda iki madde aynı boyuttan değildir.
 * Madde anahtarı kaynaktaki sıra numarasıdır (m01–m20).
 *
 * Puanlama: her boyut dört maddesinin ortalamasıdır (1–5).
 *  - Duygusal Denge: Donnellan ve ark. bu boyutu Nevrotiklik adıyla puanlamıştır; burada IPIP'in kaynak ölçeğindeki gibi
 *    ters yönde puanlanır (yüksek puan = daha dengeli; IPIP'in Mini-IPIP sayfasındaki not), sitedeki öteki kişilik
 *    testleriyle aynı düzende. Bu yüzden "sık sık iniş çıkış" ve "kolayca bozulurum" maddeleri ters puanlanır.
 *  - Düzeyler: düşük, orta, yüksek (Kişiliğin 10 Yönü gibi). Dört maddelik ölçekte ortalama 0,25'lik adımlarla değişir;
 *    2,6 ve 3,4 eşikleriyle orta düzey 2,75–3,25'tir (toplam 11–13), iki yanı simetriktir. Bir madde boş kalırsa (üç madde)
 *    de simetrik kalır (2,7–3,3 orta).
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur. Sitedeki öteki kişilik testlerinde
 * birebir aynı İngilizce maddeler için kullanılan çeviriler korundu: 17 madde Beş Faktör Kişilik Profili'ndeki çeviriyle
 * aynıdır. Bir maddenin sitede iki çevirisi varsa 9. sınıftan başlayan testlerdeki çeviri kullanılır (Kişiliğin 10 Yönü'ndeki
 * kural); bu üç maddede Beş Faktör'deki çeviri yerine:
 *  - "Have a vivid imagination": "Canlı bir hayal gücüm vardır" (Ayrıntılı Kişilik Profili, Altı Boyutlu Kişilik Profili;
 *    Beş Faktör'de "Hayal gücüm çok canlıdır").
 *  - "Get upset easily": "Küçük şeylere kolayca bozulurum" (Altı Boyutlu Kişilik Profili, Kişiliğin 10 Yönü). Beş
 *    Faktör'deki "Kolayca üzülürüm" hüzün anlatır; Martínez-Molina ve Arias (2018, Ek A) bu maddeyi öfke (Anger) alt
 *    özelliğinde gösterir. Hüzün zaten "Seldom feel blue" maddesiyle sorulur.
 *  - "Have difficulty understanding abstract ideas": "Soyut fikirleri anlamakta zorlanırım" (Ayrıntılı Kişilik Profili,
 *    Kişiliğin 10 Yönü). Beş Faktör 6. sınıftan başladığı için orada "yani elle tutulamayan düşünceleri" açıklaması vardır.
 * Bu kısa formun yayımlanmış bir Türkçe uyarlamasına ulaşılamadı (Ekim 2026; Crossref ve Europe PMC taraması).
 *
 * Ölçüm payı için güvenirlik (α): IPIP'in Mini-IPIP sayfasındaki değerler (dışadönüklük .77, uyumluluk .70, sorumluluk
 * .69, nevrotiklik .68, merak ve hayal gücü .65); Donnellan ve ark. (2006) beş çalışmada .60 ya da üzerinde bildirir.
 * Başvuru standart sapmaları (sdRef, 1–5 madde ortalaması): Martínez-Molina ve Arias'ın (2018) açık paylaştığı veri
 * (PeerJ ek dosyası, CC BY 4.0; "Mini-IPIP_CL_CLPW_US_170901.dat"), ABD örneklemi (Grupo 3; 367 yetişkin, 18–72 yaş,
 * İngilizce özgün maddeler). Dört maddenin ortalamasının standart sapması Ölçekhane'de hesaplandı: dışadönüklük 0,95,
 * uyumluluk 0,70, sorumluluk 0,80, nevrotiklik 0,92 (Duygusal Denge'de aynı), merak ve hayal gücü 0,77. Madde ortalamaları
 * makalenin Ek A'sındaki ABD değerleriyle karşılaştırıldı: 19 maddede ortalamalar aynı, standart sapmalar en çok 0,01
 * farklı (yuvarlama); "Talk to a lot of different people at parties" maddesinde ek 2,99 ve 1,05 yazar, veri 2,59 ve 1,16
 * verir. Güvenirlik bilerek ABD verisinden (α .75–.85) değil, daha düşük olan IPIP değerlerinden alındı: çevirinin güvenirliği bilinmediği için ölçüm payı geniş tutulur.
 *
 * Birbirinin tersini söyleyen beş madde çifti (`oppositePairs`): çoğuna aynı uç cevap verilirse raporda uyarı çıkar.
 * Sorumlulukta birbirinin tam tersi olan bir çift yoktur (düzeni seven biri de eşyalarını yerine koymayı unutabilir).
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const E = 'extraversion';
const A = 'agreeableness';
const C = 'conscientiousness';
const ES = 'emotional_stability';
const I = 'intellect';

/** [anahtar, ölçek, ters puanlanır mı, Türkçe metin, İngilizce aslı]: kaynaktaki sırayla (1–20). */
const ITEMS: [string, string, boolean, string, string][] = [
  ['m01', E, false, 'Arkadaş ortamlarında havayı canlandıran kişi genellikle benim.', 'Am the life of the party.'],
  ['m02', A, false, 'Başkalarının duygularını anlar, onlara ortak olurum.', "Sympathize with others' feelings."],
  ['m03', C, false, 'Yapmam gereken işleri hemen hallederim.', 'Get chores done right away.'],
  ['m04', ES, true, 'Duygularım gün içinde sık sık iniş çıkış yapar.', 'Have frequent mood swings.'],
  ['m05', I, false, 'Canlı bir hayal gücüm vardır.', 'Have a vivid imagination.'],
  ['m06', E, true, 'Çok konuşmam.', "Don't talk a lot."],
  ['m07', A, true, 'Başkalarının sorunları beni ilgilendirmez.', "Am not interested in other people's problems."],
  ['m08', C, true, 'Kullandığım şeyleri yerine koymayı sık sık unuturum.', 'Often forget to put things back in their proper place.'],
  ['m09', ES, false, 'Çoğu zaman rahat ve sakinimdir.', 'Am relaxed most of the time.'],
  ['m10', I, true, 'Soyut fikirler ilgimi çekmez.', 'Am not interested in abstract ideas.'],
  ['m11', E, false, 'Kalabalık ortamlarda birçok farklı kişiyle konuşurum.', 'Talk to a lot of different people at parties.'],
  ['m12', A, false, 'Başkalarının ne hissettiğini içimde hissederim.', "Feel others' emotions."],
  ['m13', C, false, 'Düzeni severim.', 'Like order.'],
  ['m14', ES, true, 'Küçük şeylere kolayca bozulurum.', 'Get upset easily.'],
  ['m15', I, true, 'Soyut fikirleri anlamakta zorlanırım.', 'Have difficulty understanding abstract ideas.'],
  ['m16', E, true, 'Kalabalıkta geri planda kalmayı tercih ederim.', 'Keep in the background.'],
  ['m17', A, true, 'Aslında diğer insanlara pek ilgi duymam.', 'Am not really interested in others.'],
  ['m18', C, true, 'İşleri birbirine karıştırırım.', 'Make a mess of things.'],
  ['m19', ES, false, 'Kendimi nadiren hüzünlü hissederim.', 'Seldom feel blue.'],
  ['m20', I, true, 'Hayal gücüm pek güçlü değildir.', 'Do not have a good imagination.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, scale, reverse, text, source]) => ({
  key,
  scale,
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const hizliKisilikTesti: LikertInstrument = {
  slug: 'hizli-kisilik-testi',
  version: 1,
  engine: 'likert',
  name: 'Hızlı Kişilik Testi',
  shortName: 'Hızlı kişilik testi',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 3,
  sortOrder: 10.5,
  tagline: 'Kişiliğin en çok araştırılmış beş boyutunu 20 kısa cümleyle, yaklaşık 3 dakikada gösterir.',
  description:
    'Kişiliğin en çok araştırılmış beş boyutunu yalnızca 20 kısa cümleyle, yaklaşık 3 dakikada gösterir: dışadönüklük, uyumluluk, sorumluluk, duygusal denge ile merak ve hayal gücü. Test, araştırmalarda yaygın olarak kullanılan kısa bir kişilik ölçeğine, Mini-IPIP’e (Donnellan ve ark., 2006) dayanır; maddeleri kamu malı olan Uluslararası Kişilik Madde Havuzu’ndan (IPIP) alınmıştır. Her boyut dört cümleyle ölçüldüğü için sonuç bir ilk bakıştır; daha ayrıntılı bir sonuç için sitedeki daha uzun kişilik testleri çözülebilir. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Bir yetenek ya da zekâ testi değildir; tanı koymaz.',
  intro: {
    title: 'Kendini nasıl tanımlıyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 20 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar.',
      'Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur. Yaklaşık 3 dakika sürer.',
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
    ['m01', 'm16'],
    ['m11', 'm06'],
    ['m02', 'm07'],
    ['m09', 'm04'],
    ['m05', 'm20'],
  ],
  scales: [
    {
      key: E,
      name: 'Dışadönüklük',
      plain: 'Arkadaş ortamlarında ve kalabalıkta konuşkan, canlı ve görünür olma eğilimi.',
      poles: { low: 'Sakin, geri planda kalmayı seven', high: 'Konuşkan, ortamı canlandıran' },
      alpha: 0.77,
      sdRef: 0.95,
    },
    {
      key: A,
      name: 'Uyumluluk',
      plain: 'Başkalarının duygularını anlama, onlara ortak olma ve insanların sorunlarıyla ilgilenme eğilimi.',
      poles: { low: 'Başkalarının sorunlarına mesafeli', high: 'Başkalarının duygularına yakın' },
      alpha: 0.7,
      sdRef: 0.7,
    },
    {
      key: C,
      name: 'Sorumluluk',
      plain: 'İşleri hemen halletme, düzeni sevme ve eşyalarını yerli yerinde tutma eğilimi.',
      poles: { low: 'Esnek, düzene pek takılmayan', high: 'Düzenli, işini hemen yapan' },
      alpha: 0.69,
      sdRef: 0.8,
    },
    {
      key: ES,
      name: 'Duygusal Denge',
      plain: 'Çoğu zaman rahat ve sakin olma, duyguların sık sık inip çıkmaması, küçük şeylere kolay kolay bozulmama ve nadiren hüzünlü hissetme eğilimi.',
      poles: { low: 'Duyguları sık değişen, çabuk etkilenen', high: 'Çoğu zaman rahat ve sakin' },
      alpha: 0.68,
      sdRef: 0.92,
    },
    {
      key: I,
      name: 'Merak ve Hayal Gücü',
      plain: 'Canlı bir hayal gücüne sahip olma ve soyut fikirlerle, yani adalet ya da sonsuzluk gibi elle tutulamayan kavramlarla ilgilenme eğilimi.',
      poles: { low: 'Somut ve pratik düşünen', high: 'Hayal gücü canlı, fikirlere meraklı' },
      alpha: 0.65,
      sdRef: 0.77,
    },
  ],
  items,
  science: {
    basedOn:
      'Mini-IPIP (Donnellan, Oswald, Baird ve Lucas, 2006): kişiliğin beş temel boyutunu her biri dört maddeyle ölçen 20 maddelik kısa form. Maddeleri, kamu malı olan Uluslararası Kişilik Madde Havuzu’ndaki (IPIP; Goldberg ve ark., 2006) 50 maddelik Beş Faktör ölçeğinden (Goldberg, 1992) seçilmiştir. Kaynaktaki 20 maddenin hepsi aynı sırayla kullanılır.',
    whatItMeasures:
      'Kişilik psikolojisinde en geniş araştırma desteğine sahip beş boyutun her birini dört cümleyle ölçer: kalabalıkta konuşkan ve canlı olma (dışadönüklük), başkalarının duygularına ve sorunlarına ilgi (uyumluluk), işleri hemen halletme ve düzen (sorumluluk), çoğu zaman rahat olma ve duyguların sık sık inip çıkmaması (duygusal denge), hayal gücü ve soyut fikirlere ilgi (merak ve hayal gücü). Geliştirenlerin bir çalışmasında bu kısa ölçekler, boyutların alt özelliklerini başka beş faktör ölçeklerine benzer ölçüde kapsamış; dört çalışmada da başka ölçümlerle, öteki beş faktör ölçeklerininkine benzer ilişkiler göstermiştir (Donnellan ve ark., 2006). Bağımsız araştırmacılar ise maddelerin boyutları dar bir açıdan yansıtıyor olabileceğini belirtmiştir (Martínez-Molina ve Arias, 2018). Örneğin bu araştırmacıların ek tablosunda uyumluluğun dört maddesi de aynı alt özellikte, başkalarının duygularına duyarlılıkta toplanır.',
    turkishVersion:
      'Maddeler, sitedeki öteki kişilik testlerinde aynı İngilizce maddeler için kullanılan çevirilerle sunulur; 17 madde Beş Faktör Kişilik Profili’ndeki çeviriyle birebir aynıdır. Üç madde, 9. sınıftan başlayan öteki kişilik testlerindeki gibi çevrildi. Bunlardan “Get upset easily” maddesi, Martínez-Molina ve Arias’ın (2018) ek tablosunda öfke alt özelliğinde gösterilir; bu yüzden Kişiliğin 10 Yönü’ndeki gibi “Küçük şeylere kolayca bozulurum” diye çevrildi. Geliştirenler bir boyutu Nevrotiklik (olumsuz duygulara yatkınlık) adıyla puanlamıştır; burada aynı boyut, IPIP’in kaynak ölçeğindeki gibi ters yönde ve “Duygusal Denge” adıyla puanlanır: yüksek puan daha dengeli demektir. Bu kısa formun yayımlanmış bir Türkçe uyarlamasına ulaşılamadı; bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfasında bu dört maddelik ölçeklerin iç tutarlılığı (Cronbach α) .65 (merak ve hayal gücü) ile .77 (dışadönüklük) arasında verilir. Geliştirenler beş çalışmada iç tutarlılığın .60 ya da üzerinde olduğunu, birkaç hafta ve birkaç ay arayla yapılan tekrar ölçümlerde sonuçların 50 maddelik ana ölçeğe oldukça benzer bir tutarlılık gösterdiğini bildirmiştir (Donnellan ve ark., 2006). ABD’de 15.701 genç yetişkinle yapılan geniş bir çalışmada da ölçeğin beş boyutlu bir yapı gösterdiği ve ölçeklerin çoğunun güvenirliğinin kabul edilebilir olduğu bulunmuştur (Baldasaro ve ark., 2013). Ölçüm payı, IPIP’teki güvenirlik değerleriyle ve Ölçekhane’nin, Martínez-Molina ile Arias’ın (2018) herkese açık olarak paylaştığı verideki ABD örnekleminden (367 yetişkin) hesapladığı standart sapmalarla bulunur. Dört cümlelik ölçekler uzun ölçeklerden daha az kesin olduğu için ölçüm payı geniştir. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç, kişinin kendini nasıl tanımladığını gösterir; başkalarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Burada anılan doğrulama çalışmaları (Baldasaro ve ark., 2013; Martínez-Molina ve Arias, 2018) yetişkinlerle ve üniversite öğrencileriyle yapılmıştır; ölçeğin lise çağındaki gençlerde güvenirliğini ve geçerliğini inceleyen yayımlanmış bir çalışmaya ulaşılamadı. Kişilik ergenlikte gelişmeye devam ettiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır.',
      'Her boyut yalnızca dört cümleyle ölçülür: sonuç bir ilk bakıştır ve uzun kişilik testlerinden daha az kesindir; ölçüm payı bu yüzden geniştir.',
      'Kısa olduğu için bir boyutun bütün yönlerini kapsamaz. Beş Faktör Kişilik Profili ile aynı boyutları daha az cümleyle ölçtüğünden iki testin sonuçları farklı çıkabilir; bir boyut iki testte farklı düzeyde görünebilir.',
      'Merak ve hayal gücü boyutu zekâyı ölçmez: kişinin hayal gücünü ve soyut fikirlere ilgisini nasıl gördüğünü sorar.',
      'Doğrulama çalışmalarının çoğunda ölçeğin yapısı istatistik modellere tam uymamış, beş boyut yine de birbirinden ayrı çıkmıştır (Martínez-Molina ve Arias, 2018).',
      'Geniş bir çalışmada birçok ölçekte kadınlarla erkekler ya da ırk ve etnik kökene göre ayrılan gruplar arasındaki puan farklarının dikkatle yorumlanması gerektiği görülmüştür (Baldasaro ve ark., 2013); bu test kişileri gruplarla karşılaştırmaz.',
      'Kişilik zamanla değişebilir; sonuç kalıcı bir etiket değildir.',
      'Tanı koymaz; ruh sağlığı ya da kişilik bozukluğu değerlendirmesi değildir. Duygusal Denge bir tarama aracı değildir.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynak çalışmalardaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Donnellan, M. B., Oswald, F. L., Baird, B. M. ve Lucas, R. E. (2006). The Mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 18(2), 192–203.',
        url: 'https://doi.org/10.1037/1040-3590.18.2.192',
      },
      { text: 'IPIP. Mini-IPIP: maddeler ve anahtar.', url: 'https://ipip.ori.org/MiniIPIPKey.htm' },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. Psychological Assessment, 4(1), 26–42.',
        url: 'https://doi.org/10.1037/1040-3590.4.1.26',
      },
      {
        text: 'Baldasaro, R. E., Shanahan, M. J. ve Bauer, D. J. (2013). Psychometric properties of the Mini-IPIP in a large, nationally representative sample of young adults. Journal of Personality Assessment, 95(1), 74–84.',
        url: 'https://doi.org/10.1080/00223891.2012.700466',
      },
      {
        text: 'Martínez-Molina, A. ve Arias, V. B. (2018). Balanced and positively worded personality short-forms: Mini-IPIP validity and cross-cultural invariance. PeerJ, 6, e5542.',
        url: 'https://doi.org/10.7717/peerj.5542',
      },
    ],
  },
};
