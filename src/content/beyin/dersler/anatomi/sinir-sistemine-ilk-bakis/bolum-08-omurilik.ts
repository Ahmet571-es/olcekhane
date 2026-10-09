import type { DersBolumu } from '../../../types';

/** Omurga bölgelerinin renkleri (yalnızca tanıtır; omurilik-sinirleri çizimindeki renklerle aynı). */
const BOYUN_RENGI = '#4f7cf0';
const GOGUS_RENGI = '#25a993';
const BEL_RENGI = '#e0a32e';
const SAGRI_RENGI = '#ef5d7b';

const BOYUN = ['atlas', 'aksis', 'boyun-omuru-3', 'boyun-omuru-4', 'boyun-omuru-5', 'boyun-omuru-6', 'boyun-omuru-7'];
const GOGUS = Array.from({ length: 12 }, (_, i) => `gogus-omuru-${i + 1}`);
const BEL = Array.from({ length: 5 }, (_, i) => `bel-omuru-${i + 1}`);
/** Atlas–aksis arasında disk yoktur; model C2–C3 diskinden L5–S1 diskine kadar 23 disk içerir. */
const DISKLER = [
  'disk-c2-c3',
  'disk-c3-c4',
  'disk-c4-c5',
  'disk-c5-c6',
  'disk-c6-c7',
  'disk-c7-t1',
  ...Array.from({ length: 11 }, (_, i) => `disk-t${i + 1}-t${i + 2}`),
  'disk-t12-l1',
  'disk-l1-l2',
  'disk-l2-l3',
  'disk-l3-l4',
  'disk-l4-l5',
  'disk-l5-s1',
];

/** 8. bölüm: omurilik genel bakış düzeyinde ve omurgayla ilişkisi; konusun düzeyi, at kuyruğu, bel ponksiyonu. */
export const omurilikVeOmurga: DersBolumu = {
  id: 'omurilik-ve-omurga',
  baslik: 'Omurilik ve omurga: kısa bir kablo, uzun bir kılıf',
  bloklar: [
    {
      tur: 'metin',
      md: `**Omurilik** (*medulla spinalis*), merkezî sinir sisteminin omurga kanalındaki parçasıdır. Kafatası tabanındaki büyük delikte, **foramen magnumda**, omurilik soğanının (*medulla oblongata*) devamı olarak başlar ve aşağıda çoğunlukla 1. ya da 2. bel omuru hizasına kadar iner (Dafny, 2026). Yani omurga kanalını boydan boya doldurmaz; Gray’in (1918) anlatımıyla kanalın yalnızca üst üçte ikisini kaplar.

Yetişkinde omurilik 40–50 cm uzunluğunda ve 1–1,5 cm çapındadır (Dafny, 2026); ortalama uzunluk erkekte yaklaşık 45 cm, kadında yaklaşık 42 cm’dir (Nene ve Jilani, 2023). Gray (1918) ağırlığını yaklaşık 30 g olarak verir. Bu ince kablo merkezî sinir sisteminin yalnızca yaklaşık %2’sidir, ama işlevleri yaşamsaldır (Dafny, 2026).

Omurilikten **31 çift omurilik siniri** (*nervi spinales*) çıkar: 8 boyun (C), 12 göğüs (T), 5 bel (L), 5 sağrı (S) ve 1 kuyruk (Co) siniri (Gray, 1918; Dafny, 2026). Her sinir, omuriliğin hangi düzeyinden çıkıyorsa o düzeyin adını taşır (OpenStax 13.4). Omuriliğin sivri alt ucuna **konus medullaris** (*conus medullaris*) denir. Konusun altında omurga kanalında artık omurilik yoktur; aşağı doğru uzanan bel ve sağrı kökleri vardır. Bu uzun kök demetine, görünüşü ve uzunluğu yüzünden **at kuyruğu** (*cauda equina*) adı verilmiştir (Gray, 1918).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla omurilik',
      ogeler: [
        { deger: '40–50', birim: 'cm', aciklama: 'Yetişkin omuriliğinin foramen magnumdan konusa uzunluğu; çapı 1–1,5 cm.' },
        { deger: '≈30', birim: 'g', aciklama: 'Gray’in verdiği ağırlık. Omurilik merkezî sinir sisteminin yaklaşık %2’sidir.' },
        { deger: '31', birim: 'çift', aciklama: 'Omurilik siniri: 8 boyun, 12 göğüs, 5 bel, 5 sağrı ve 1 kuyruk siniri.' },
        {
          deger: '197–222',
          birim: 'milyon',
          aciklama: 'İnsan omuriliğindeki nöron sayısı; omurilik hücrelerinin yalnızca %13,4’ü nörondur.',
        },
      ],
      not: 'Kaynaklar: Dafny (2026); Gray (1918); Bahney ve von Bartheld (2018).',
    },
    {
      tur: 'animasyon',
      ad: 'omurilik-sinirleri',
      baslik: 'Omurga, omurilik ve 31 çift sinir',
      aciklama:
        'Bir bölgeye dokunarak o bölgedeki omur ve sinir sayısını gör: boyunda 7 omura karşılık 8 çift sinir vardır. Çizimde omurilik 1. bel omurunun altında biter; altında at kuyruğunun kökleri uzanır. Sağdaki enine kesitte sarı nokta arka kökten giren duyu sinyalini, kırmızı nokta ön kökten çıkan hareket komutunu gösterir.',
    },
    {
      tur: 'sahne',
      baslik: 'Omurga yandan: omuriliğin kemik kılıfı',
      aciklama:
        'Beyin kutusuna ve omurgaya soldan bakıyoruz; ön (yüz) taraf solda, yüz kemikleri gizlendi. Renkler yalnızca bölgeleri tanıtır: mavi 7 boyun omuru (en üstteki ikisi atlas ve aksis), yeşil 12 göğüs omuru, turuncu 5 bel omuru, pembe sağrı kemiği; omurlar arasındaki açık mavi parçalar omurlar arası disklerdir. Modelde omurilik ve sinirler yoktur: omurilik bu kemik kanalın içinde foramen magnumdan başlar ve çoğu yetişkinde etiketli T12–L1 diski ile L1 omuru dolayında biter. Kuyruk sokumu kemiği modelde yoktur. “Liste” ile omurları tek tek bulabilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz', 'omurga'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['katman:kemik', 'atlas', 'aksis', 'katman:omurga'],
        boya: [
          { secici: BOYUN, renk: BOYUN_RENGI },
          { secici: GOGUS, renk: GOGUS_RENGI },
          { secici: BEL, renk: BEL_RENGI },
          { secici: ['sakrum'], renk: SAGRI_RENGI },
        ],
        etiketler: [
          { yapi: 'atlas', metin: 'C1 (atlas)' },
          { yapi: 'boyun-omuru-7', metin: 'C7' },
          { yapi: 'gogus-omuru-12', metin: 'T12' },
          { yapi: 'disk-t12-l1', metin: 'T12–L1 diski' },
          { yapi: 'bel-omuru-5', metin: 'L5' },
          { yapi: 'sakrum', metin: 'Sağrı kemiği' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: `Omurilik neden omurgadan kısadır? Cevap gelişimdedir. Gebeliğin ilk üç ayında omurilik omurga kanalını boydan boya doldurur ve ikisi aşağı yukarı aynı hızla büyür (Gray, 1918; Dafny, 2026). Sonra omurga daha hızlı uzar ve omuriliğin alt ucu kanalın içinde gittikçe yukarıda kalır; doğumda konus yaklaşık 2. bel omuru hizasına gelmiştir (Costa Almeida ve ark., 2022). Ders kitapları bunu, omuriliğin bir-iki yaşından sonra pek uzamadığı hâlde iskeletin büyümeyi sürdürmesiyle açıklar (OpenStax 13.2).

Bunun iki önemli sonucu vardır:

- **Omurilik bölümleri, aynı adı taşıyan omurlardan yukarıdadır.** Örneğin omuriliğin sağrı bölümleri, üst bel omurlarının hizasında durur (OpenStax 13.2). Aşağıdaki sinir kökleri bu yüzden çıkacakları deliğe ulaşmak için omurga kanalında aşağı doğru uzun bir yol alır; at kuyruğu bu köklerdir.
- **Bel bölgesinin alt kısmında omurga kanalında omurilik yoktur.** Bu yüzden beyin-omurilik sıvısından örnek almak gerektiğinde iğne alt bel bölgesinden girilir; sert zar ve örümcek ağı zar geçilerek sıvıya ulaşılır (OpenStax 13.3). Bu işleme **bel ponksiyonu** (lomber ponksiyon) denir.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Omurilik = merkezî sinir sisteminin omurga kanalındaki parçası.** Foramen magnumda başlar, yetişkinde çoğunlukla **L1–L2** hizasında **konus medullaris** ile biter.\n\n**31 çift sinir:** 8 C, 12 T, 5 L, 5 S, 1 Co.\n\nKonusun altında yalnızca kökler vardır: **at kuyruğu**. Bel ponksiyonu bu yüzden **alt bel bölgesinden** yapılır.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Omurilik bölümü ile omur aynı şey değildir',
      md: '“T10” dendiğinde iki ayrı şey kastedilebilir: 10. göğüs **omuru** ya da omuriliğin 10. göğüs **bölümü**. Bu ikisi aynı hizada değildir. Göğüs ve üst bel bölgesinde bir omurun arkasındaki omurilik bölümü, adı yaklaşık üç basamak aşağıdaki bölümdür (Dafny, 2026). Bu kaba bir kuraldır; kişiden kişiye fark vardır. Bir görüntüleme raporunu ya da bir yaralanmanın düzeyini okurken hangisinin söylendiğine dikkat et.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Omurilik yalnızca 30 gram kadardır (Gray, 1918), ama içinden çıkan bazı aksonlar çok uzundur: ön boynuzdaki bir hareket nöronunun aksonu, ayak başparmağını hareket ettiren kasa kadar uzanmak için bir metreyi bulabilir (OpenStax 13.2). Omurga kanalında aşağı doğru topluca uzanan bel ve sağrı kökleri, görünüşleri ve uzunlukları yüzünden *cauda equina*, yani “at kuyruğu” adını almıştır (Gray, 1918).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bölüm (segment) nedir?** Omuriliğin yüzeyinde enine bir bölümlenme izi görülmez; “bölüm”, bir çift omurilik sinirinin bağlandığı omurilik uzunluğu olarak tanımlanan bir kavramdır (Gray, 1918). Bölümler eşit uzunlukta değildir: Gray (1918) boyunda ortalama 13 mm, göğsün ortasında 26 mm verir ve bel ile sağrı bölgesinde hızla kısaldığını yazar. Güncel bir derleme göğüs bölümlerini 2 cm’nin epey üstünde, boyun bölümlerini yaklaşık 1,5 cm bulur (Frostell ve ark., 2016).

**Sinirler omurganın neresinden çıkar?** İlk boyun siniri (C1) kafatası ile 1. boyun omuru (atlas) arasından, C8 ise 7. boyun omuru ile 1. göğüs omuru arasından çıkar. Göğüs ve bel sinirlerinin her biri, aynı adı taşıyan omur ile bir alttaki omur arasından çıkar (OpenStax 13.4). Boyunda 7 omura karşılık 8 sinir olması bu kuralın sonucudur. Her sinir omuriliğe ön ve arka iki kökle bağlanır; arka kökün üzerindeki **arka kök gangliyonu** (*ganglion spinale*) çoğunlukla omurlar arası delikte, köklerin sert zarı deldiği yerin hemen dışındadır (Gray, 1918). Kökçükler boyunda omuriliğe neredeyse dik açıyla girip çıkar; göğüs ve bel bölgesinde ise omuriliğe daha paralel seyreder (Mendez ve ark., 2021).

**İki genişleme.** Kol ve bacak sinirlerinin bağlandığı yerlerde omurilik kalınlaşır; en büyük kökler ve sinirler bu iki genişlemeye bağlanır (Gray, 1918). Gray (1918) genişlemeleri **omur hizasıyla** verir: **boyun genişlemesi** (*intumescentia cervicalis*) yaklaşık 3. boyun omurundan 2. göğüs omuruna uzanır ve en kalın yeri (çevresi yaklaşık 38 mm) 6. boyun sinirinin bağlandığı düzeydedir; **bel genişlemesi** (*intumescentia lumbosacralis*) yaklaşık 9. göğüs omuru hizasında başlar ve en kalın yerine (çevresi yaklaşık 33 mm) son göğüs omurunun karşısında ulaşır. UTHealth kitabı aynı genişlemeleri **omurilik bölümleriyle** verir: C3–T1 ve L1–S2 (Dafny, 2026). İki anlatım çelişmez; biri omuru, öteki omurilik bölümünü ölçüt alır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Omurga bölgeleri, omurlar ve omurilik sinirleri',
      sutunlar: ['Bölge', 'Omur', 'Sinir çifti', 'Sinirin çıktığı yer', 'Not'],
      satirlar: [
        [
          'Boyun (C)',
          '7',
          '8',
          'C1 kafatası ile atlas arasından; C2–C7 aynı adlı omurun üstünden; C8 C7 ile T1 arasından',
          'C1’in arka kökü olguların %8’inde yoktur',
        ],
        [
          'Göğüs (T)',
          '12',
          '12',
          'Aynı adlı omur ile bir alttaki omur arasından',
          'T2–T11 sinir ağı yapmaz, kaburgalar arası sinirleri verir',
        ],
        ['Bel (L)', '5', '5', 'Aynı adlı omur ile bir alttaki omur arasından', 'Kökleri at kuyruğunda uzun yol alır'],
        ['Sağrı (S)', 'Sağrı kemiği', '5', '—', 'Arka kök gangliyonları omurga kanalının içindedir'],
        ['Kuyruk (Co)', 'Kuyruk sokumu', '1', '—', 'TA2’de ayrı terimdir (*nervus coccygeus*)'],
      ],
      not: 'Kaynaklar: Gray (1918); OpenStax 13.4; Dafny (2026); FIPAT (2019). UTHealth kitabının aynı paragrafında “ilki dışındaki bütün sinirler omurlarının altından çıkar” cümlesi ile “C1–C7 omurlarının üstünden çıkar” cümlesi yan yanadır; doğrusu ikincisidir.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'İki genişleme hangi omurların arkasında?',
      aciklama:
        'Boyun ve göğüs omurlarına soldan bakıyoruz; ön taraf solda. Gray’e (1918) göre omuriliğin iki kalın kesimi şu omurların arkasında durur: mavi omurlar (C3–T2) boyun genişlemesinin, turuncu omurlar (T9–T12) bel genişlemesinin hizasıdır. Modelde omurilik yoktur; renkler yalnızca hizayı gösterir. C7–T1 diskinin hizasındaki delikten C8 siniri çıkar; boyunda 7 omura karşılık 8 sinir olmasının nedeni budur.',
      sahne: {
        katmanlar: ['yuz', 'omurga'],
        renk: 'dogal',
        bakis: 'sol',
        goster: [...BOYUN, ...GOGUS, 'bel-omuru-1', ...DISKLER.slice(0, DISKLER.indexOf('disk-t12-l1') + 1)],
        boya: [
          {
            secici: ['boyun-omuru-3', 'boyun-omuru-4', 'boyun-omuru-5', 'boyun-omuru-6', 'boyun-omuru-7', 'gogus-omuru-1', 'gogus-omuru-2'],
            renk: BOYUN_RENGI,
          },
          { secici: ['gogus-omuru-9', 'gogus-omuru-10', 'gogus-omuru-11', 'gogus-omuru-12'], renk: BEL_RENGI },
        ],
        etiketler: [
          { yapi: 'atlas', metin: 'Atlas (C1)' },
          { yapi: 'boyun-omuru-3', metin: 'C3' },
          { yapi: 'disk-c7-t1', metin: 'C7–T1: C8 siniri' },
          { yapi: 'gogus-omuru-2', metin: 'T2' },
          { yapi: 'gogus-omuru-9', metin: 'T9' },
          { yapi: 'gogus-omuru-12', metin: 'T12: bel genişlemesinin en kalın yeri' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Konusun altında neler var?** Konusun ucundan aşağı, yaklaşık 20 cm’lik ince bir iplik uzanır: **filum terminale** (Gray, 1918). Hindistan’da 30 kadavrada filumun ortalama uzunluğu 221,8 mm bulundu ve filum sert zar kesesiyle çoğunlukla 2. sağrı omurunun üst üçte birinde birleşiyordu (Sharma ve ark., 2026). Omuriliği saran **sert zar kesesi** (*dura spinalis*) omuriliğin bittiği yerin altına uzanır ve 2. sağrı omurunun alt kenarı dolayında kör bir uçla sonlanır; beyin-omurilik sıvısıyla dolu **subaraknoid aralık** da aynı hizada biter (Gray, 1918). 635 erişkinin MR’ında kesenin ortalama bitiş yeri 2. sağrı omurunun üst üçte biriydi; aralık 3. bel omurunun alt üçte birinden 5. sağrı omurunun üst üçte birine kadar uzanıyordu (Soleiman ve ark., 2005). Subaraknoid aralık en geniş yerine omurga kanalının alt kısmında, örümcek ağı zarın at kuyruğunun köklerini sardığı yerde ulaşır (Gray, 1918). Konus ile kesenin ucu arasındaki bu sıvı dolu bölümün TA2’deki adı **bel sarnıcı**dır (*cisterna lumbalis*; FIPAT, 2019).

Sert zar ile omurga kanalının duvarı arasında gevşek bağ dokusu ve bir toplardamar ağı içeren **epidural aralık** (*spatium epidurale spinale*) vardır (Gray, 1918). Omurilik yanlarından, yumuşak zarın kıvrımlarından çıkan **dişli bağlarla** sert zara tutturulur (Dafny, 2026). Zarların ayrıntısı “Beyin zarları ve zarlar arası boşluklar” dersindedir.

**İçeride ne var?** Enine kesitte gri cevher, aradaki gri komissürle birlikte H harfine benzer (Gray, 1918). Ön boynuz iskelet kaslarına giden hareket nöronlarını taşır; göğüs ve üst bel bölgesindeki yan boynuzda otonom sistemin hareket nöronlarının gövdeleri bulunur (OpenStax 13.2). Ak cevher ön, yan ve arka olmak üzere üç kordona (*funiculus*) ayrılır (Gray, 1918). Aşağı inildikçe ak cevherin payı azalır, çünkü alt düzeylerde daha az çıkan ve inen lif vardır (Dafny, 2026). Gri ve ak cevherin ayrıntısı Anatomi bölümünün “Omurilik”, “Çıkan duyu yolları” ve “İnen hareket yolları” derslerindedir.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Omurilik:** foramen magnumdan L1–L2 omuruna; 40–50 cm; 31 çift sinir (8 C, 12 T, 5 L, 5 S, 1 Co).
- **Çıkış kuralı:** C1 kafatası–atlas arası; C8 C7–T1 arası; T ve L sinirleri aynı adlı omurun altından.
- **Genişlemeler:** omur hizasıyla boyunda C3–T2, belde T9–T12 (Gray); omurilik bölümüyle C3–T1 ve L1–S2 (UTHealth).
- **Konus:** yetişkinde ortalama L1 dolayı; Hacettepe serisinde en sık T12–L1 diski; Düzce serisinde kadınlarda L1–L2, erkeklerde T12–L1 diski. **Dura kesesi ve subaraknoid aralık:** S2 dolayına kadar.
- **Filum terminale:** konustan aşağı ~20 cm (Gray); kadavrada ortalama 221,8 mm.
- **Göğüs ve üst bel bölgesinde** omur ile omurilik bölümü arasında yaklaşık **üç bölüm** fark (kaba kural).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Konus nerede biter?** Gray (1918) erişkinde omuriliğin 1. bel omurunun alt kenarı ile 2. bel omurunun üst kenarı arasında bittiğini yazar. Canlı insanlarda yapılan MR çalışmaları bu bilgiyi doğrular, ama geniş bir yelpaze gösterir. 504 erişkinde konusun ortalama yeri L1 omurunun alt üçte biriydi; aralık T12’nin orta üçte birinden L3’ün üst üçte birine uzanıyordu ve cinsiyet ya da yaşla anlamlı fark yoktu (Saifuddin ve ark., 1998). 635 erişkinde ortalama L1’in orta üçte biri, aralık T11’in alt üçte birinden L3’ün üst üçte birine kadardı; bu seride konus düzeyi yaş ve cinsiyetle küçük ama anlamlı bir ilişki gösterdi (Soleiman ve ark., 2005).

**Türkiye’den iki seri.** Ankara’da Hacettepe Üniversitesi Tıp Fakültesi Anatomi Anabilim Dalı’ndan araştırmacılar, 0,5 tesla lomber MR’ında belirgin omurga kanalı hastalığı olmayan **639 kişiyi** inceledi: konus en sık **T12–L1 diski** hizasındaydı ve yaşla değişmiyordu (Demiryürek ve ark., 2002). Düzce Tıp Fakültesi’nden bir ekip ise 18–80 yaşlarında (ortalama 45) **364 ardışık hastanın** (207 kadın, 157 erkek) lomber MR’ını inceledi: en sık düzey kadınlarda **L1–L2 diski**, erkeklerde **T12–L1 diski** idi; dağılım T11–T12 diskinden L2–L3 diskine uzanıyordu (Sevinç ve ark., 2006).

**Çocuklar ve bebekler.** Yenidoğandan 20 yaşa 184 çocuğun MR’ında normal konus T12 ile L3 arasındaydı; yazarlar konusun çocukluk boyunca yükselmediğini, erişkin düzeyine yaşamın ilk birkaç ayında ulaştığını gösterdi (Wilson ve Prince, 1989). 105 sağlıklı yenidoğanın ultrasonunda ortalama düzey L1–L2 diski ile L2 omurunun ortası arasındaydı (Hill ve Gibson, 1995). Sakarya Üniversitesi Eğitim ve Araştırma Hastanesi’nde 6 aydan küçük **1125 term bebeğin** (672 kız, 453 erkek) lumbosakral ultrasonunda konus L1 ile L3 omurları arasında bitiyordu ve cinsiyet bitiş düzeyini etkilemiyordu (Asil ve Yaldız, 2018).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Omurilik nerede biter? Konus medullaris serileri',
      sutunlar: ['Seri ve yöntem', 'Örneklem', 'Ortalama ya da en sık düzey', 'Aralık'],
      satirlar: [
        [
          'Hacettepe Ü., Ankara; 0,5 T lomber MR (Demiryürek ve ark., 2002)',
          'Belirgin kanal hastalığı olmayan 639 kişi',
          'En sık T12–L1 diski; yaşla değişmiyor',
          '—',
        ],
        [
          'Düzce Tıp Fakültesi; lomber MR, T1 ağırlıklı sagital (Sevinç ve ark., 2006)',
          '364 ardışık hasta (207 kadın, 157 erkek; 18–80 yaş)',
          'Kadında L1–L2, erkekte T12–L1 diski',
          'T11–T12 diski – L2–L3 diski',
        ],
        [
          'Erişkin MR serisi (Saifuddin ve ark., 1998)',
          '504 erişkin (16–85 yaş)',
          'Ortalama L1’in alt üçte biri',
          'T12’nin orta üçte biri – L3’ün üst üçte biri',
        ],
        [
          'Erişkin MR serisi (Soleiman ve ark., 2005)',
          '635 erişkin',
          'Ortalama L1’in orta üçte biri',
          'T11’in alt üçte biri – L3’ün üst üçte biri',
        ],
        ['Kore; MR (Moon ve ark., 2019)', '187 hasta (2–94 yaş)', 'En sık L1 (%52,4)', 'T12’nin üst kesimi – L2–L3 diski'],
        [
          'Doğu Afrika; MR (Nekyon ve ark., 2025)',
          '331 hasta',
          'Ortanca L1’in alt üçte biri; %97,9’u L2’de ya da üstünde',
          'T12’nin üst üçte biri – L3’ün alt üçte biri',
        ],
        [
          'Suudi Arabistan; MR (Hiware ve ark., 2022)',
          '179 kişi',
          'En sık L1 (%51,4)',
          'T12 – L5–S1 (L2’nin altında 4 kişi: L3, L3–L4, L5 ve L5–S1’de birer kişi)',
        ],
        [
          'Lübnan; MR (Moussallem ve ark., 2014)',
          '141 kişi',
          'En sık L1’in üst üçte biri (%32,6)',
          'T12’nin üst üçte biri – L2’nin üst üçte biri',
        ],
        ['İran; MR (Rahmani ve ark., 2011)', '189 erişkin', 'Ortanca L1’in üst kesimi', 'T12’nin üst kesimi – L2’nin orta kesimi'],
        ['Çocuklar; lomber MR (Wilson ve Prince, 1989)', 'Yenidoğandan 20 yaşa 184 çocuk', 'Çocukluk boyunca yükselmiyor', 'T12 – L3'],
        [
          'Çocuklar; tüm omurga MR (Kesler ve ark., 2007)',
          '—',
          'Ortalama L1’in alt üçte biri; en sık L1–L2 diski',
          'Hiçbiri L2’nin ortasının altında değil',
        ],
        [
          'Yenidoğanlar; ultrason (Hill ve Gibson, 1995)',
          '105 sağlıklı yenidoğan',
          'L1–L2 diski ile L2 ortası arası; en sık L1–L2 (%47,6)',
          'T12–L1 – L3',
        ],
        [
          'Sakarya EAH; lumbosakral ultrason (Asil ve Yaldız, 2018)',
          '6 aydan küçük 1125 term bebek (672 kız, 453 erkek)',
          'Cinsiyet düzeyi etkilemiyor',
          'L1 – L3',
        ],
        [
          'Fetüs; sistematik derleme ve meta-analiz (Costa Almeida ve ark., 2022)',
          '18 çalışma, 3189 fetüs (33. hafta–doğum grubunda 344 fetüs)',
          '33. hafta–doğum: %82’si L2’de ya da üstünde; doğumda yaklaşık L2 kabul edilir',
          '—',
        ],
        ['Üçüncü trimester fetüsleri; Hindistan (Gupta ve ark., 2022)', '30 fetüs', 'L2’de 16, L3’te 8, L4’te 6 fetüs', 'L2 – L4'],
      ],
      not: 'Yöntem (MR, ultrason), örneklem ve konusun ucunun nasıl tanımlandığı farklı olduğu için seriler doğrudan karşılaştırılamaz. Gray’in (1918) erişkin değeri bu serilerle uyumludur; “doğumda L3” değeri ise eskimiştir: fetüs meta-analizi ve yenidoğan serileri doğumda yaklaşık L2’yi gösterir (Costa Almeida ve ark., 2022; Hill ve Gibson, 1995). Sakarya serisinin sonuç cümlesi omuriliğin “L3’ün altında” saptandığını yazar, ama makalenin bulgularındaki en alt düzey L3’tür; tabloda bulgular izlendi.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Bel bölgesi: konusun hizası ve alt aralıklar',
      aciklama:
        'Göğüs-bel geçişine ve bel omurlarına soldan bakıyoruz; ön taraf solda. Mavi diskler (T12–L1 ve L1–L2), yetişkinde omuriliğin en sık bittiği hizayı gösterir. Yeşil diskler (L3–L4 ve L4–L5), bu bölümde aktarılan erişkin serilerinin çoğunda konusun en alt sınırının (L3 omuru) da altında kalır: bu hizada çoğu erişkinde omurga kanalında omurilik değil, at kuyruğunun kökleri vardır. Daha aşağıda biten seyrek olgular da bildirilmiştir (Hiware ve ark., 2022). Sert zar kesesi ve içindeki sıvı aşağıda 2. sağrı omuru dolayına kadar uzanır. Omurilik, kökler ve zarlar modelde yoktur; renkler yalnızca hizaları tanıtır.',
      sahne: {
        katmanlar: ['omurga'],
        renk: 'dogal',
        bakis: 'sol',
        goster: [
          'gogus-omuru-11',
          'gogus-omuru-12',
          ...BEL,
          'sakrum',
          'disk-t11-t12',
          'disk-t12-l1',
          'disk-l1-l2',
          'disk-l2-l3',
          'disk-l3-l4',
          'disk-l4-l5',
          'disk-l5-s1',
        ],
        boya: [
          { secici: ['disk-t12-l1', 'disk-l1-l2'], renk: BOYUN_RENGI },
          { secici: ['disk-l3-l4', 'disk-l4-l5'], renk: GOGUS_RENGI },
        ],
        etiketler: [
          { yapi: 'gogus-omuru-12', metin: 'T12' },
          { yapi: 'disk-t12-l1', metin: 'T12–L1 diski' },
          { yapi: 'bel-omuru-1', metin: 'L1' },
          { yapi: 'disk-l2-l3', metin: 'L2–L3 diski' },
          { yapi: 'disk-l3-l4', metin: 'L3–L4 diski' },
          { yapi: 'disk-l4-l5', metin: 'L4–L5 diski' },
          { yapi: 'sakrum', metin: 'Sağrı kemiği: kese S2 dolayında biter' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Bel ponksiyonu neden aşağıdan yapılır?',
      md: `Menenjitte temel tanı testi bel ponksiyonudur (OpenStax 13.3). İğnenin omuriliğe zarar vermeden sıvıya ulaşması için, girildiği hizada omurilik bulunmamalıdır; omurilik alt bel bölgesine inmediği için örnek oradan alınır (OpenStax 13.3).

Konusun yeri kişiden kişiye değiştiği için “ortalama” yetmez. Doğu Afrika’da 331 hastanın MR’ında konusların %97,9’u L2 omurunda ya da daha yukarıda bitiyordu. Aynı çalışmanın hesabına göre iğne L1–L2 aralığından girilseydi omuriliklerin %33,5’i, L2–L3 aralığından girilseydi %2,1’i olası bir yaralanma riskiyle karşılaşacaktı (Nekyon ve ark., 2025). Aşağı inildikçe risk azalır; konusun altında kesede yalnızca kökler vardır ve kese 2. sağrı omuru dolayına kadar sürer (Gray, 1918; Soleiman ve ark., 2005). Alınan sıvının nasıl incelendiği, beyni koruyan ve besleyen yapılar bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Konusu görüntüde bulmak',
      md: `- **Erişkinde MR:** Konusun ucu sagital kesitlerde bulunur ve komşu omur gövdesinin üst, orta ya da alt üçte birine ya da komşu diske göre tanımlanır (Saifuddin ve ark., 1998; Soleiman ve ark., 2005). Türk serilerinde T1 ağırlıklı sagital görüntüler (Sevinç ve ark., 2006) ve 0,5 tesla MR (Demiryürek ve ark., 2002) kullanıldı.
- **Omurları saymak:** Düzeyi doğru vermek için omurların doğru numaralanması gerekir; çocuklarda tüm omurga MR’ı ile yapılan bir çalışmada konus düzeyleri dar bir aralıkta toplandı (Kesler ve ark., 2007).
- **Bebekte ultrason:** Yenidoğan ve küçük bebekte konusun yeri lumbosakral ultrasonla belirlenebilir (Hill ve Gibson, 1995; Asil ve Yaldız, 2018).
- **Kesenin ucu:** MR’da konusla birlikte sert zar kesesinin bitiş yeri de ölçülebilir; ortalama 2. sağrı omurunun üst üçte biridir (Soleiman ve ark., 2005).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Menenjit kuşkusu ve iğnenin hizası',
      oyku: `29 yaşında bir erkek yüksek ateş ve şiddetli baş ağrısıyla acil servise getiriliyor. Hekim menenjitten kuşkulanıyor ve beyin-omurilik sıvısından örnek almaya karar veriyor. Hastanın bel bölgesini yoklayan asistan, iğneyi kolay hissettiği L1–L2 aralığından girmeyi öneriyor.`,
      soru: 'Sıvı örneği neden alt bel bölgesinden alınır ve L1–L2 aralığı neden iyi bir seçim değildir?',
      cozum: `**Neden aşağıdan?** Bel ponksiyonu menenjitin temel tanı testidir (OpenStax 13.3). İğne sert zarı ve örümcek ağı zarı geçerek sıvıya ulaşır; bunu güvenle yapmanın koşulu, iğnenin girdiği hizada omurilik bulunmamasıdır. Omurilik alt bel bölgesine inmediği için örnek bu bölgeden alınır (OpenStax 13.3).

**L1–L2 neden riskli?** Konusun bittiği yer kişiden kişiye değişir: büyük erişkin serilerinde ortalama L1 dolayıdır, ama aralık T11’den L3’e kadar uzanır (Saifuddin ve ark., 1998; Soleiman ve ark., 2005). Hacettepe serisinde en sık düzey T12–L1 diskidir; Düzce serisinde erkeklerde T12–L1, kadınlarda L1–L2 diskidir (Demiryürek ve ark., 2002; Sevinç ve ark., 2006). Doğu Afrika’daki 331 hastalık seride iğne L1–L2 aralığından girilseydi omuriliklerin %33,5’i, L2–L3 aralığından girilseydi %2,1’i olası bir yaralanma riskiyle karşılaşacaktı (Nekyon ve ark., 2025). Bu yüzden L1–L2 aralığı, omuriliklerin önemli bir kısmının hâlâ bulunduğu bir hizadır.

**Daha aşağıda ne var?** Konusun altında sert zar kesesi ve sıvı dolu aralık 2. sağrı omuru dolayına kadar sürer ve içinde yalnızca at kuyruğunun kökleri bulunur (Gray, 1918; Soleiman ve ark., 2005). İğne, büyük erişkin serilerinde bildirilen en alt sınırın (L3) altında kalan alt bel aralıklarından birinden girilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Konus ne zaman yükselir? Ders kitabı, Gray ve görüntüleme',
      md: `**Gray’in döneminde** omuriliğin doğumda 3. bel omuru hizasında bittiği yazılıyordu (Gray, 1918). Güncel veriler bu değeri desteklemez. Fetüs çalışmalarının meta-analizinde 13–18. haftadaki fetüslerin hiçbirinde konus L2’ye ulaşmamıştı; L2’de ya da daha yukarıda bulunma sıklığı 19–25. haftada %16, 26–32. haftada %42, 33. haftadan doğuma kadar %82’ydi. Yazarlar doğumdaki son yeri yaklaşık L2 kabul eder (Costa Almeida ve ark., 2022). 105 yenidoğanda ortalama düzey L1–L2 diski ile L2 ortası arasındaydı ve erişkinlerle fark yalnızca yaklaşık çeyrek omurdu; yazarlar doğumdan sonraki yükselmenin az olduğunu vurgular (Hill ve Gibson, 1995). Çocuk MR’ı da konusun çocukluk boyunca yükselmediğini, erişkin düzeyine ilk birkaç ayda ulaştığını gösterdi (Wilson ve Prince, 1989).

Bu bulgular, ders kitabındaki “omurilik bir-iki yaşından sonra uzamaz, iskelet büyür” açıklamasının (OpenStax 13.2) basitleştirme olduğunu düşündürür: konus ile omurga arasındaki kaymanın büyük kısmı doğumdan önce tamamlanır. Üçüncü trimesterdeki 30 fetüste bitiş düzeyinin L2–L4 olması ve gebelik ilerledikçe yükselmesi (Gupta ve ark., 2022) fetüse aittir; doğumdaki değerle karıştırılmamalıdır.

**Bölüm–omur eşlemesi de kesin değildir.** Göğüs ve üst bel bölgesindeki “üç bölüm fark” kuralı (Dafny, 2026) kabadır. Boyunda yapılan bir MR çalışması omurilik bölümlerinin yukarı-aşağı yerinin kişiden kişiye belirgin değiştiğini ve önceki tahmin yöntemlerinin kesin olmadığını gösterdi (Cadotte ve ark., 2015). Frostell ve ark. (2016) hesabına göre, kuyruk bölümü sayılmadığında 30 omurilik bölümü yalnızca 20 omur boyuna yayılır.

**Sayıların tanımı.** 40–50 cm (Dafny, 2026) ve 42–45 cm (Gray, 1918; Nene ve Jilani, 2023) değerleri foramen magnumdan konusa kadardır. Hindistan’da formalinle sabitlenmiş 30 erişkin kadavrada konusa kadar uzunluk ortalama 391,5 ± 33,4 mm bulundu (Sharma ve ark., 2026); kadavra ve sabitleme farkı yüzünden tek bir “doğru” sayı yerine aralık verilmelidir. İnsan omuriliğinde 1,5–1,7 milyar hücre ve 197–222 milyon nöron sayıldı; glia hücrelerinin nöronlara oranı 5,6–7,1’dir ve boyun, göğüs ve bel düzeyleri arasında hücre bileşimi bakımından anlamlı fark bulunmadı (Bahney ve von Bartheld, 2018). Bazı kaynaklardaki farklı sayılar bu derste kullanılmadı: bir psikoloji ders kitabı omuriliği 30 bölümle anlatır (Spielman ve ark., 2020; öteki kaynaklar 31), UTHealth kitabının genel bakış bölümü ise omuriliğe yaklaşık 150 cm³ hacim verir (Dafny, 2020); bu, yaklaşık 30 gramlık bir organla bağdaşmaz.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Omurga kanalında hizalar: işlem öncesi akılda tutulacaklar',
      md: `- **Konusun alt sınırı:** Erişkin serilerinde konus L3’ün üst ya da alt üçte birine kadar inebilir (Saifuddin ve ark., 1998; Soleiman ve ark., 2005; Nekyon ve ark., 2025). Suudi serisinde 179 kişiden 3’ünde konus L3’ün de altında (L3–L4, L5 ve L5–S1 hizasında) bitiyordu (Hiware ve ark., 2022). Doğu Afrika serisinde konusların %97,9’u L2’de ya da üstünde bitti; L1–L2 aralığında omuriliklerin üçte biri risk altındaydı (Nekyon ve ark., 2025).
- **Kesenin ucu değişkendir:** Sert zar kesesinin bitiş yeri 3. bel omurunun alt üçte birinden 5. sağrı omurunun üst üçte birine kadar değişebilir (Soleiman ve ark., 2005); filum terminale keseyle çoğunlukla 2. sağrı omurunun üst üçte birinde birleşir ve ortalama 221,8 mm uzunluğundadır (Sharma ve ark., 2026).
- **Epidural aralık:** Omurilik durası kafatası durasının yalnızca iç (meningeal) katmanına karşılık gelir; dış katman foramen magnumda biter. Dura ile kanal duvarı arasında gevşek bağ dokusu ve toplardamar ağı içeren epidural aralık vardır (Gray, 1918).
- **Omuriliğin askıları:** Dişli bağlar omuriliği iki yandan sert zara tutturur (Dafny, 2026); Gray (1918) bu bağın dişlerini her yanda 21 olarak sayar.
- **Kökçüklerin yönü:** Kökçükler boyunda omuriliğe neredeyse dik, göğüs ve belde daha paralel seyreder (Mendez ve ark., 2021). Çalışmanın amacı da omuriliğin tedavi amaçlı hedeflenmesidir: kökleri hedefleyen bir işlemde geometri bölgeden bölgeye değişir.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Bebekte L3’te biten konus',
      oyku: `7 aylık bir bebeğin bel bölgesinde başka bir nedenle çekilen MR’da konus medullarisin ucu L3 omurunun gövdesi hizasında görülüyor. Bebeğin nörolojik muayenesi olağan; ailesi “omurilik aşağıda mı kalmış?” diye soruyor.`,
      soru: 'Bu düzey normal kabul edilebilir mi; karar verirken hangi verilere dayanırsın?',
      cozum: `**Tek başına kesin yanıt vermez.** Çocuk MR’ı serisine göre konus çocukluk boyunca yükselmez, erişkin düzeyine yaşamın ilk birkaç ayında ulaşır. L2–L3 ya da daha yukarısı her yaşta normal sayılır; L3 düzeyi ise belirsizdir, çünkü bu hizada hem normal hem gergin (*tethered*) bir omurilik bitebilir (Wilson ve Prince, 1989).

**Öteki veriler ne diyor?** Tüm omurga MR’ı yapılan çocuklarda konus ortalama L1’in alt üçte birinde bitmiş, hiçbiri L2 omurunun ortasının altında bitmemiştir; yazarlara göre gergin omurilik yoksa konus L2 gövdesinin ortasının altında neredeyse hiç bitmez ve görüntüde daha aşağıda görünen bir konus gergin omurilik kabul edilmelidir (Kesler ve ark., 2007). Buna karşılık yenidoğan serilerinde aralık L3’e kadar uzanır: 105 sağlıklı yenidoğanda T12–L1’den L3’e (Hill ve Gibson, 1995), Sakarya’da 1125 term bebekte L1’den L3’e (Asil ve Yaldız, 2018). Doğumdan sonra konusun yükselmesi azdır; yenidoğanla erişkin arasındaki fark yaklaşık çeyrek omurdur (Hill ve Gibson, 1995). Yani 7 aylık bir bebekte konusun daha fazla yükselmesini beklemek doğru değildir.

**Sonuç:** Kaynaklar L3 düzeyini farklı yorumlar: çocuk tüm omurga MR’ı serisi bu düzeyi gergin omurilik sayar (Kesler ve ark., 2007), lomber MR serisi belirsiz sayar (Wilson ve Prince, 1989), yenidoğan serilerinde ise L3 normal aralığın alt ucudur (Hill ve Gibson, 1995; Asil ve Yaldız, 2018). Bu yüzden L3 düzeyi sınırda bir bulgudur ve gergin omurilik yönünden dikkatle değerlendirilmeyi gerektirir. Görüntü klinik bulgularla birlikte yorumlanır. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
