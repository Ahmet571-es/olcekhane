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
      md: `**Omurilik** (*medulla spinalis*), merkezî sinir sisteminin omurga kanalındaki parçasıdır. Omurga kanalı, üst üste dizilmiş omurların ortasından geçen boşluktur. Omurilik, kafatası tabanındaki büyük delikte başlar. Bu deliğin adı **foramen magnum**dur. Omurilik burada, beyin sapının en alt parçası olan omurilik soğanının (*medulla oblongata*) devamıdır. Aşağıda çoğunlukla 1. ya da 2. bel omuru hizasına kadar iner (Dafny, 2026). Yani omurga kanalını boydan boya doldurmaz. Gray’in (1918) anlatımıyla kanalın yalnızca üst üçte ikisini kaplar.

Yetişkinde omurilik 40–50 cm uzunluğunda, 1–1,5 cm kalınlığındadır (Dafny, 2026). Ortalama uzunluk erkekte yaklaşık 45 cm, kadında yaklaşık 42 cm’dir (Nene ve Jilani, 2023). Gray (1918) ağırlığını yaklaşık 30 g olarak verir. Bu ince kablo, merkezî sinir sisteminin yalnızca yaklaşık %2’sidir. Ama yaptığı işler yaşamsaldır (Dafny, 2026).

Omurilikten **31 çift omurilik siniri** (*nervi spinales*) çıkar. Bunlar 8 boyun (C), 12 göğüs (T), 5 bel (L), 5 sağrı (S) ve 1 kuyruk (Co) siniridir (Gray, 1918; Dafny, 2026). Her sinir, omurilikte çıktığı düzeyin adını taşır (OpenStax 13.4). Omuriliğin sivri alt ucuna **konus medullaris** (*conus medullaris*) denir. Konusun altında, omurga kanalında artık omurilik yoktur. Orada aşağı doğru uzanan bel ve sağrı kökleri vardır. Bu uzun kök demeti görünüşü ve uzunluğu yüzünden **at kuyruğu** (*cauda equina*) adını almıştır (Gray, 1918).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla omurilik',
      ogeler: [
        {
          deger: '40–50',
          birim: 'cm',
          aciklama: 'Yetişkin omuriliğinin boyu: foramen magnumdan alt uca (konusa) kadar. Kalınlığı 1–1,5 cm.',
        },
        { deger: '≈30', birim: 'g', aciklama: 'Gray’in verdiği ağırlık. Bu, merkezî sinir sisteminin yaklaşık %2’sidir.' },
        { deger: '31', birim: 'çift', aciklama: 'Omurilik siniri: 8 boyun, 12 göğüs, 5 bel, 5 sağrı ve 1 kuyruk siniri.' },
        {
          deger: '197–222',
          birim: 'milyon',
          aciklama: 'İnsan omuriliğindeki nöron sayısı. Omurilik hücrelerinin yalnızca %13,4’ü nörondur.',
        },
      ],
      not: 'Kaynaklar: Dafny (2026); Gray (1918); Bahney ve von Bartheld (2018).',
    },
    {
      tur: 'animasyon',
      ad: 'omurilik-sinirleri',
      baslik: 'Omurga, omurilik ve 31 çift sinir',
      aciklama:
        'Bir bölgeye dokun; o bölgedeki omur ve sinir sayısını gör. Boyunda 7 omura karşılık 8 çift sinir vardır. Çizimde omurilik 1. bel omurunun altında biter. Daha aşağıda at kuyruğunun kökleri uzanır. Sağda omuriliğin enine kesiti var. Sarı nokta, arka kökten giren duyu sinyalidir. Kırmızı nokta, ön kökten çıkan hareket komutudur.',
    },
    {
      tur: 'sahne',
      baslik: 'Omurga yandan: omuriliğin kemik kılıfı',
      aciklama:
        'Beyin kutusuna ve omurgaya soldan bakıyoruz. Ön (yüz) taraf solda; yüz kemikleri gizlendi. Renkler yalnızca bölgeleri tanıtır. Mavi: 7 boyun omuru (en üstteki ikisi atlas ve aksis). Yeşil: 12 göğüs omuru. Turuncu: 5 bel omuru. Pembe: sağrı kemiği. Omurların arasındaki açık mavi parçalar, omurlar arası disklerdir. Modelde omurilik ve sinirler yoktur. Omurilik bu kemik kanalın içinde, foramen magnumdan başlar. Çoğu yetişkinde etiketli T12–L1 diski ile L1 omuru dolayında biter. Kuyruk sokumu kemiği de modelde yoktur. “Liste” ile omurları tek tek bulabilirsin.',
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
      md: `Omurilik neden omurgadan kısadır? Cevap gelişimdedir. Gebeliğin ilk üç ayında omurilik omurga kanalını boydan boya doldurur ve ikisi aşağı yukarı aynı hızla büyür (Gray, 1918; Dafny, 2026). Sonra omurga daha hızlı uzar. Omuriliğin alt ucu da kanalın içinde gittikçe yukarıda kalır. Doğumda konus yaklaşık 2. bel omuru hizasına gelmiştir (Costa Almeida ve ark., 2022). Ders kitapları bunu şöyle açıklar: omurilik bir-iki yaşından sonra pek uzamaz, ama iskelet büyümeyi sürdürür (OpenStax 13.2).

Bunun iki önemli sonucu vardır:

- **Omurilik bölümleri, aynı adı taşıyan omurlardan daha yukarıdadır.** Örneğin omuriliğin sağrı bölümleri, üst bel omurlarının hizasında durur (OpenStax 13.2). Bu yüzden alttaki sinir kökleri, çıkacakları deliğe ulaşmak için kanalda aşağı doğru uzun bir yol alır. At kuyruğu bu köklerdir.
- **Alt bel bölgesinde omurga kanalında omurilik yoktur.** Bazen beyin-omurilik sıvısından örnek almak gerekir. Bu sıvı beyni ve omuriliği çevreleyen sıvıdır. İğne bu yüzden alt bel bölgesinden girilir. İğne, omuriliği saran iki zarı (sert zar ve örümcek ağı zar) geçip sıvıya ulaşır (OpenStax 13.3). Bu işleme **bel ponksiyonu** (lomber ponksiyon) denir.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Omurilik = merkezî sinir sisteminin omurga kanalındaki parçası.** Foramen magnumda başlar. Yetişkinde çoğunlukla **L1–L2** hizasında, **konus medullaris** denen sivri uçla biter.

**31 çift sinir:** 8 C, 12 T, 5 L, 5 S, 1 Co.

Konusun altında yalnızca kökler vardır: **at kuyruğu**. Bel ponksiyonu bu yüzden **alt bel bölgesinden** yapılır.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Omurilik bölümü ile omur aynı şey değildir',
      md: '“T10” iki ayrı şey olabilir: 10. göğüs **omuru** ya da omuriliğin 10. göğüs **bölümü**. Bu ikisi aynı hizada değildir. Göğüs ve üst bel bölgesinde bir omurun arkasında, adı yaklaşık üç basamak aşağıda olan omurilik bölümü durur (Dafny, 2026). Bu kaba bir kuraldır; kişiden kişiye fark vardır. Bir görüntüleme raporunu ya da bir yaralanmanın düzeyini okurken hangisinin kastedildiğine dikkat et.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Omurilik yalnızca 30 gram kadardır (Gray, 1918). Ama içinden çıkan bazı aksonlar çok uzundur. Omuriliğin ön boynuzundaki bir hareket nöronunu düşün. Aksonu, ayak başparmağını oynatan kasa kadar uzanır. Bu uzunluk bir metreyi bulabilir (OpenStax 13.2). Bel ve sağrı kökleri de omurga kanalında topluca aşağı uzanır. Görünüşleri ve uzunlukları yüzünden bu köklere *cauda equina*, yani “at kuyruğu” denir (Gray, 1918).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bölüm (segment) nedir?** Omuriliğin yüzeyinde enine bir bölünme izi görülmez. “Bölüm” bir tanımdır: bir çift omurilik sinirinin bağlandığı omurilik uzunluğu (Gray, 1918). Bölümler eşit uzunlukta değildir. Gray (1918) boyunda ortalama 13 mm, göğsün ortasında 26 mm verir. Bel ve sağrı bölgesinde bölümlerin hızla kısaldığını yazar. Güncel bir derlemeye göre göğüs bölümleri 2 cm’nin epey üstündedir. Boyun bölümleri ise yaklaşık 1,5 cm’dir (Frostell ve ark., 2016).

**Sinirler omurganın neresinden çıkar?** İlk boyun siniri (C1), kafatası ile 1. boyun omuru (atlas) arasından çıkar. C8 ise 7. boyun omuru ile 1. göğüs omuru arasından çıkar. Göğüs ve bel sinirlerinin her biri, aynı adlı omur ile bir alttaki omur arasından çıkar (OpenStax 13.4). Boyunda 7 omura karşılık 8 sinir olması bu kuralın sonucudur.

Her sinir omuriliğe iki kökle bağlanır: ön kök ve arka kök. Arka kökün üzerinde, duyu nöronlarının gövdelerini taşıyan bir şişkinlik vardır. Buna **arka kök gangliyonu** (*ganglion spinale*) denir. Gangliyon çoğunlukla omurlar arası deliktedir. Köklerin sert zarı deldiği yerin hemen dışında durur (Gray, 1918). Kökler omurilikten ince iplikler hâlinde çıkar; bunlara kökçük denir. Kökçükler boyunda omuriliğe neredeyse dik açıyla girip çıkar. Göğüs ve bel bölgesinde ise omuriliğe daha paralel ilerler (Mendez ve ark., 2021).

**İki genişleme.** Omurilik, kol ve bacak sinirlerinin bağlandığı yerlerde kalınlaşır. En büyük kökler ve sinirler bu iki genişlemeye bağlanır (Gray, 1918). Gray (1918) genişlemelerin yerini **omur hizasıyla** verir:

- **Boyun genişlemesi** (*intumescentia cervicalis*) yaklaşık 3. boyun omurundan 2. göğüs omuruna uzanır. En kalın yeri, 6. boyun sinirinin bağlandığı düzeydir. Orada çevresi yaklaşık 38 mm’dir.
- **Bel genişlemesi** (*intumescentia lumbosacralis*) yaklaşık 9. göğüs omuru hizasında başlar. En kalın yerine son göğüs omurunun karşısında ulaşır. Orada çevresi yaklaşık 33 mm’dir.

UTHealth kitabı aynı genişlemeleri **omurilik bölümleriyle** verir: C3–T1 ve L1–S2 (Dafny, 2026). İki anlatım çelişmez. Biri omuru ölçü alır, öteki omurilik bölümünü.`,
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
        ['Kuyruk (Co)', 'Kuyruk sokumu', '1', '—', 'TA2’de ayrı bir terimi vardır (*nervus coccygeus*)'],
      ],
      not: 'Kaynaklar: Gray (1918); OpenStax 13.4; Dafny (2026); FIPAT (2019). UTHealth kitabının bir paragrafında iki cümle çelişir. Biri “ilki dışındaki bütün sinirler omurlarının altından çıkar” der. Öteki “C1–C7 omurlarının üstünden çıkar” der. Doğrusu ikincisidir.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'İki genişleme hangi omurların arkasında?',
      aciklama:
        'Boyun ve göğüs omurlarına soldan bakıyoruz; ön taraf solda. Gray’e (1918) göre omuriliğin iki kalın kesimi şu omurların arkasında durur. Mavi omurlar (C3–T2) boyun genişlemesinin hizasıdır. Turuncu omurlar (T9–T12) bel genişlemesinin hizasıdır. Modelde omurilik yoktur; renkler yalnızca hizayı gösterir. C7–T1 diskinin hizasındaki delikten C8 siniri çıkar. Boyunda 7 omura karşılık 8 sinir olmasının nedeni budur.',
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
      md: `**Konusun altında neler var?** Konusun ucundan aşağı, yaklaşık 20 cm’lik ince bir iplik uzanır: **filum terminale** (Gray, 1918). Hindistan’da 30 kadavrada filumun ortalama uzunluğu 221,8 mm bulundu. Filum, sert zar kesesiyle çoğunlukla 2. sağrı omurunun üst üçte birinde birleşiyordu (Sharma ve ark., 2026).

Omuriliği saran **sert zar kesesi** (*dura spinalis*), omuriliğin bittiği yerden daha aşağı uzanır. 2. sağrı omurunun alt kenarı dolayında kapalı bir uçla (kör uç) biter. Kesenin içinde beyin-omurilik sıvısıyla dolu bir aralık vardır: **subaraknoid aralık**. Bu aralık da aynı hizada biter (Gray, 1918). 635 erişkinin MR’ında kesenin ortalama bitiş yeri 2. sağrı omurunun üst üçte biriydi. Bitiş yeri kişiden kişiye değişiyordu: 3. bel omurunun alt üçte birinden 5. sağrı omurunun üst üçte birine kadar (Soleiman ve ark., 2005). Subaraknoid aralık en geniş yerine omurga kanalının alt kısmında ulaşır. Burada örümcek ağı zar at kuyruğunun köklerini sarar (Gray, 1918). Konus ile kesenin ucu arasında sıvı dolu bir bölüm kalır. Uluslararası terim listesi TA2’de bunun adı **bel sarnıcı**dır (*cisterna lumbalis*; FIPAT, 2019).

Sert zar ile omurga kanalının duvarı arasında da bir aralık vardır: **epidural aralık** (*spatium epidurale spinale*). İçinde gevşek bağ dokusu ve bir toplardamar ağı bulunur (Gray, 1918). Omurilik, iki yanından sert zara tutturulur. Bunu, yumuşak zarın kıvrımlarından çıkan **dişli bağlar** yapar (Dafny, 2026). Zarların ayrıntısı “Beyin zarları ve zarlar arası boşluklar” dersindedir.

**İçeride ne var?** Omuriliği enine kesersen gri cevherin H harfine benzediğini görürsün. H’nin ortadaki çizgisi, iki yarıyı bağlayan gri komissürdür (Gray, 1918). H’nin öne bakan kollarına ön boynuz denir. Ön boynuz, iskelet kaslarına giden hareket nöronlarını taşır. Göğüs ve üst bel bölgesinde bir de yan boynuz vardır. Burada otonom sistemin hareket nöronlarının gövdeleri bulunur (OpenStax 13.2). Ak cevher üç kordona (*funiculus*) ayrılır: ön, yan ve arka (Gray, 1918). Aşağı inildikçe ak cevherin payı azalır. Çünkü alt düzeylerde daha az çıkan ve inen lif vardır (Dafny, 2026). Gri ve ak cevherin ayrıntısı Anatomi bölümünün “Omurilik”, “Çıkan duyu yolları” ve “İnen hareket yolları” derslerindedir.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Omurilik:** foramen magnumdan L1–L2 omuruna; 40–50 cm; 31 çift sinir (8 C, 12 T, 5 L, 5 S, 1 Co).
- **Çıkış kuralı:** C1 kafatası–atlas arası; C8 C7–T1 arası; T ve L sinirleri aynı adlı omurun altından.
- **Genişlemeler:** omur hizasıyla boyunda C3–T2, belde T9–T12 (Gray); omurilik bölümüyle C3–T1 ve L1–S2 (UTHealth).
- **Konus:** yetişkinde ortalama L1 dolayı. Hacettepe serisinde en sık T12–L1 diski. Düzce serisinde kadınlarda L1–L2, erkeklerde T12–L1 diski.
- **Sert zar (dura) kesesi ve subaraknoid aralık:** S2 dolayına kadar.
- **Filum terminale:** konustan aşağı ~20 cm (Gray); kadavrada ortalama 221,8 mm.
- **Göğüs ve üst bel bölgesinde** omur ile omurilik bölümü arasında yaklaşık **üç bölüm** fark (kaba kural).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Konus nerede biter?** Gray (1918) şöyle yazar: erişkinde omurilik, 1. bel omurunun alt kenarı ile 2. bel omurunun üst kenarı arasında biter. Canlı insanlarda yapılan MR çalışmaları bu bilgiyi doğrular. Ama kişiden kişiye geniş bir yelpaze gösterir.

- 504 erişkinde konusun ortalama yeri L1 omurunun alt üçte biriydi. Bitiş yeri T12’nin orta üçte birinden L3’ün üst üçte birine kadar değişiyordu. Cinsiyet ya da yaşla anlamlı fark yoktu (Saifuddin ve ark., 1998).
- 635 erişkinde ortalama yer L1’in orta üçte biriydi. Bitiş yeri T11’in alt üçte birinden L3’ün üst üçte birine kadar değişiyordu. Bu seride konusun düzeyi yaş ve cinsiyetle küçük ama anlamlı bir ilişki gösterdi (Soleiman ve ark., 2005).

**Türkiye’den iki seri.** İlki Ankara’dandır. Hacettepe Üniversitesi Tıp Fakültesi Anatomi Anabilim Dalı’ndan araştırmacılar **639 kişinin** bel MR’ını inceledi. Bu kişilerde belirgin bir omurga kanalı hastalığı yoktu. Çekimler 0,5 tesla gücünde bir MR cihazıyla yapılmıştı. Konus en sık **T12–L1 diski** hizasındaydı ve yaşla değişmiyordu (Demiryürek ve ark., 2002).

İkinci seri Düzce Tıp Fakültesi’ndendir. Ekip, **364 ardışık hastanın**, yani sırayla gelen hastaların, bel MR’ını inceledi. Hastaların 207’si kadın, 157’si erkekti. Yaşları 18–80 arasındaydı (ortalama 45). En sık düzey kadınlarda **L1–L2 diski**, erkeklerde **T12–L1 diski** idi. Dağılım T11–T12 diskinden L2–L3 diskine uzanıyordu (Sevinç ve ark., 2006).

**Çocuklar ve bebekler.** Bir çalışmada yenidoğandan 20 yaşa kadar 184 çocuğun MR’ı incelendi. Normal konus T12 ile L3 arasında bitiyordu. Yazarlar şunu gösterdi: konus çocukluk boyunca yükselmez, erişkin düzeyine yaşamın ilk birkaç ayında ulaşır (Wilson ve Prince, 1989). 105 sağlıklı yenidoğanın ultrasonunda ortalama düzey, L1–L2 diski ile L2 omurunun ortası arasındaydı (Hill ve Gibson, 1995). Sakarya Üniversitesi Eğitim ve Araştırma Hastanesi’nde de bir ultrason çalışması yapıldı. Bel-sağrı bölgesi incelenen bebekler 6 aydan küçüktü ve zamanında doğmuştu (term bebek). **1125 bebeğin** 672’si kız, 453’ü erkekti. Konus L1 ile L3 omurları arasında bitiyordu. Cinsiyet, bitiş düzeyini etkilemiyordu (Asil ve Yaldız, 2018).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Omurilik nerede biter? Konus medullaris serileri',
      sutunlar: ['Çalışma ve yöntem', 'Kimler incelendi', 'Ortalama ya da en sık düzey', 'En üst – en alt düzey'],
      satirlar: [
        [
          'Hacettepe Ü., Ankara; 0,5 T bel MR’ı (Demiryürek ve ark., 2002)',
          'Belirgin kanal hastalığı olmayan 639 kişi',
          'En sık T12–L1 diski; yaşla değişmiyor',
          '—',
        ],
        [
          'Düzce Tıp Fakültesi; bel MR’ı, T1 ağırlıklı yandan kesitler (Sevinç ve ark., 2006)',
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
        ['Çocuklar; bel MR’ı (Wilson ve Prince, 1989)', 'Yenidoğandan 20 yaşa 184 çocuk', 'Çocukluk boyunca yükselmiyor', 'T12 – L3'],
        [
          'Çocuklar; tüm omurga MR’ı (Kesler ve ark., 2007)',
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
          'Sakarya EAH; bel-sağrı ultrasonu (Asil ve Yaldız, 2018)',
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
        ['Gebeliğin son üç ayındaki fetüsler; Hindistan (Gupta ve ark., 2022)', '30 fetüs', 'L2’de 16, L3’te 8, L4’te 6 fetüs', 'L2 – L4'],
      ],
      not: 'Seriler doğrudan karşılaştırılamaz. Yöntemleri (MR, ultrason) ve incelenen kişiler farklıdır. Konusun ucunu tanımlama biçimleri de farklıdır. Gray’in (1918) erişkin değeri bu serilerle uyumludur. Ama onun “doğumda L3” değeri eskimiştir. Fetüs meta-analizi ve yenidoğan serileri doğumda yaklaşık L2’yi gösterir (Costa Almeida ve ark., 2022; Hill ve Gibson, 1995). Sakarya serisinin sonuç cümlesi, omuriliğin “L3’ün altında” bulunduğunu yazar. Ama makalenin bulgularındaki en alt düzey L3’tür. Tabloda bulgular esas alındı.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Bel bölgesi: konusun hizası ve alt aralıklar',
      aciklama:
        'Göğüs-bel geçişine ve bel omurlarına soldan bakıyoruz; ön taraf solda. Mavi diskler (T12–L1 ve L1–L2), yetişkinde omuriliğin en sık bittiği hizadır. Yeşil diskler (L3–L4 ve L4–L5) daha aşağıdadır. Bu bölümdeki erişkin serilerinin çoğunda konus en aşağıda (L3 omuru) biter. Yeşil diskler bu sınırın da altında kalır. Bu hizada çoğu erişkinde omurga kanalında omurilik yoktur; at kuyruğunun kökleri vardır. Daha aşağıda biten seyrek olgular da bildirilmiştir (Hiware ve ark., 2022). Sert zar kesesi ve içindeki sıvı, aşağıda 2. sağrı omuru dolayına kadar uzanır. Omurilik, kökler ve zarlar modelde yoktur; renkler yalnızca hizaları tanıtır.',
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
      md: `Menenjitte temel tanı testi bel ponksiyonudur (OpenStax 13.3). İğne, omuriliğe zarar vermeden sıvıya ulaşmalıdır. Bunun için iğnenin girdiği hizada omurilik bulunmamalıdır. Omurilik alt bel bölgesine inmez; örnek bu yüzden oradan alınır (OpenStax 13.3).

Konusun yeri kişiden kişiye değişir; bu yüzden “ortalama” yetmez. Doğu Afrika’da 331 hastanın MR’ı incelendi. Konusların %97,9’u L2 omurunda ya da daha yukarıda bitiyordu. Çalışma, iğnenin hangi aralıktan girdiğine göre riski de hesapladı. İğne L1–L2 aralığından girilseydi, omuriliklerin %33,5’i olası bir yaralanma riski altında olacaktı. L2–L3 aralığında bu oran %2,1 olacaktı (Nekyon ve ark., 2025). Aşağı inildikçe risk azalır. Konusun altında kesede yalnızca kökler vardır. Kese de 2. sağrı omuru dolayına kadar sürer (Gray, 1918; Soleiman ve ark., 2005). Alınan sıvının nasıl incelendiği, beyni koruyan ve besleyen yapılar bölümündedir.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Konusu görüntüde bulmak',
      md: `- **Erişkinde MR:** Konusun ucu, bedeni yandan kesen görüntülerde (sagital kesit) bulunur. Yeri ya komşu omur gövdesine göre (üst, orta ya da alt üçte bir) ya da komşu diske göre verilir (Saifuddin ve ark., 1998; Soleiman ve ark., 2005). Türk serilerinde iki yöntem kullanıldı: T1 ağırlıklı yandan kesitler (Sevinç ve ark., 2006) ve 0,5 tesla MR (Demiryürek ve ark., 2002).
- **Omurları saymak:** Düzeyi doğru vermek için omurları doğru numaralamak gerekir. Çocuklarda tüm omurga MR’ıyla yapılan bir çalışmada konus düzeyleri dar bir aralıkta toplandı (Kesler ve ark., 2007).
- **Bebekte ultrason:** Yenidoğan ve küçük bebekte konusun yeri, bel-sağrı bölgesinin ultrasonuyla belirlenebilir (Hill ve Gibson, 1995; Asil ve Yaldız, 2018).
- **Kesenin ucu:** MR’da sert zar kesesinin bitiş yeri de ölçülebilir. Ortalama yer, 2. sağrı omurunun üst üçte biridir (Soleiman ve ark., 2005).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Menenjit kuşkusu ve iğnenin hizası',
      oyku: `29 yaşında bir erkek, yüksek ateş ve şiddetli baş ağrısıyla acil servise getiriliyor. Hekim menenjitten kuşkulanıyor ve beyin-omurilik sıvısından örnek almaya karar veriyor. Asistan hastanın bel bölgesini yokluyor. İğneyi L1–L2 aralığından girmeyi öneriyor, çünkü bu aralığı kolay hissediyor.`,
      soru: 'Sıvı örneği neden alt bel bölgesinden alınır? L1–L2 aralığı neden iyi bir seçim değildir?',
      cozum: `**Neden aşağıdan?** Bel ponksiyonu menenjitin temel tanı testidir (OpenStax 13.3). İğne sert zarı ve örümcek ağı zarı geçerek sıvıya ulaşır. Bunu güvenle yapmanın koşulu şudur: iğnenin girdiği hizada omurilik bulunmamalıdır. Omurilik alt bel bölgesine inmez; örnek bu yüzden oradan alınır (OpenStax 13.3).

**L1–L2 neden riskli?** Konusun bittiği yer kişiden kişiye değişir. Büyük erişkin serilerinde ortalama L1 dolayıdır, ama aralık T11’den L3’e kadar uzanır (Saifuddin ve ark., 1998; Soleiman ve ark., 2005). Hacettepe serisinde en sık düzey T12–L1 diskidir (Demiryürek ve ark., 2002). Düzce serisinde erkeklerde T12–L1, kadınlarda L1–L2 diskidir (Sevinç ve ark., 2006). Doğu Afrika’da 331 hastalık bir seri incelendi. İğne L1–L2 aralığından girilseydi, omuriliklerin %33,5’i olası bir yaralanma riski altında olacaktı. L2–L3 aralığında bu oran %2,1 olacaktı (Nekyon ve ark., 2025). Yani L1–L2 aralığı, omuriliklerin önemli bir kısmının hâlâ bulunduğu bir hizadır.

**Daha aşağıda ne var?** Konusun altında sert zar kesesi ve sıvı dolu aralık, 2. sağrı omuru dolayına kadar sürer. İçlerinde yalnızca at kuyruğunun kökleri bulunur (Gray, 1918; Soleiman ve ark., 2005). Büyük erişkin serilerinde konusun bildirilen en alt sınırı L3’tür. İğne, bu sınırın altında kalan alt bel aralıklarından birinden girilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Konus ne zaman yükselir? Ders kitabı, Gray ve görüntüleme',
      md: `**Gray’in döneminde** omuriliğin doğumda 3. bel omuru hizasında bittiği yazılıyordu (Gray, 1918). Güncel veriler bu değeri desteklemez. Fetüs çalışmalarını bir araya getiren bir analiz (meta-analiz) yapıldı. Bu analizde 13–18. haftadaki fetüslerin hiçbirinde konus L2’ye ulaşmamıştı. Konusun L2’de ya da daha yukarıda bulunma sıklığı şöyleydi:

- 19–25. haftada %16
- 26–32. haftada %42
- 33. haftadan doğuma kadar %82

Yazarlar doğumdaki son yeri yaklaşık L2 kabul eder (Costa Almeida ve ark., 2022). 105 yenidoğanda ortalama düzey, L1–L2 diski ile L2 ortası arasındaydı. Erişkinlerle fark yalnızca yaklaşık çeyrek omurdu. Yazarlar doğumdan sonraki yükselmenin az olduğunu vurgular (Hill ve Gibson, 1995). Çocuk MR’ı da aynı şeyi gösterdi: konus çocukluk boyunca yükselmez, erişkin düzeyine ilk birkaç ayda ulaşır (Wilson ve Prince, 1989).

Ders kitabı bu farkı şöyle açıklar: omurilik bir-iki yaşından sonra uzamaz, iskelet büyür (OpenStax 13.2). Bu bulgular, bu açıklamanın bir basitleştirme olduğunu düşündürür. Konus ile omurga arasındaki kaymanın büyük kısmı doğumdan önce tamamlanır. Gebeliğin son üç ayındaki (üçüncü trimester) 30 fetüste konus L2–L4 düzeyinde bitiyordu. Gebelik ilerledikçe de yükseliyordu (Gupta ve ark., 2022). Bu değerler fetüse aittir; doğumdaki değerle karıştırılmamalıdır.

**Bölümlerin hangi omurun arkasında olduğu da kesin değildir.** Göğüs ve üst bel bölgesindeki “üç bölüm fark” kuralı (Dafny, 2026) kabadır. Boyunda yapılan bir MR çalışması iki şey gösterdi. Omurilik bölümlerinin yukarı-aşağı yeri kişiden kişiye belirgin değişir. Önceki tahmin yöntemleri de kesin değildir (Cadotte ve ark., 2015). Frostell ve ark. (2016) bir hesap da yaptı: kuyruk bölümü sayılmazsa, 30 omurilik bölümü yalnızca 20 omur boyuna yayılır.

**Sayılar neyi ölçüyor?** 40–50 cm (Dafny, 2026) ve 42–45 cm (Gray, 1918; Nene ve Jilani, 2023) değerleri foramen magnumdan konusa kadardır. Hindistan’da 30 erişkin kadavrası incelendi. Kadavralar formalinle sabitlenmişti, yani bozulmasın diye kimyasalla korunmuştu. Konusa kadar uzunluk ortalama 391,5 ± 33,4 mm bulundu (Sharma ve ark., 2026). Kadavra ve sabitleme farkı yüzünden tek bir “doğru” sayı yerine aralık verilmelidir.

İnsan omuriliğinde 1,5–1,7 milyar hücre ve 197–222 milyon nöron sayıldı. Destek hücreleri olan glia hücrelerinin sayısı, nöron sayısının 5,6–7,1 katıdır. Boyun, göğüs ve bel düzeyleri arasında hücre bileşimi bakımından anlamlı fark bulunmadı (Bahney ve von Bartheld, 2018).

Bazı kaynaklardaki farklı sayılar bu derste kullanılmadı. Bir psikoloji ders kitabı omuriliği 30 bölümle anlatır (Spielman ve ark., 2020; öteki kaynaklar 31). UTHealth kitabının genel bakış bölümü ise omuriliğe yaklaşık 150 cm³ hacim verir (Dafny, 2020). Bu, yaklaşık 30 gramlık bir organla bağdaşmaz.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Omurga kanalında hizalar: işlem öncesi akılda tutulacaklar',
      md: `- **Konusun alt sınırı:** Erişkin serilerinde konus, L3’ün üst ya da alt üçte birine kadar inebilir (Saifuddin ve ark., 1998; Soleiman ve ark., 2005; Nekyon ve ark., 2025). Suudi serisinde 179 kişiden 3’ünde konus L3’ün de altında bitiyordu: L3–L4, L5 ve L5–S1 hizasında (Hiware ve ark., 2022). Doğu Afrika serisinde konusların %97,9’u L2’de ya da üstünde bitti. L1–L2 aralığında omuriliklerin üçte biri risk altındaydı (Nekyon ve ark., 2025).
- **Kesenin ucu değişkendir:** Sert zar kesesi 3. bel omurunun alt üçte birinden 5. sağrı omurunun üst üçte birine kadar herhangi bir yerde bitebilir (Soleiman ve ark., 2005). Filum terminale keseyle çoğunlukla 2. sağrı omurunun üst üçte birinde birleşir. Ortalama uzunluğu 221,8 mm’dir (Sharma ve ark., 2026).
- **Epidural aralık:** Omurilikteki sert zar (dura), kafatasındaki duranın yalnızca iç katına (meningeal kat) karşılık gelir. Dış kat foramen magnumda biter. Dura ile kanal duvarı arasında epidural aralık vardır. İçinde gevşek bağ dokusu ve toplardamar ağı bulunur (Gray, 1918).
- **Omuriliğin askıları:** Dişli bağlar omuriliği iki yandan sert zara tutturur (Dafny, 2026). Gray (1918) bu bağın dişlerini her yanda 21 olarak sayar.
- **Kökçüklerin yönü:** Kökçükler boyunda omuriliğe neredeyse dik girer. Göğüs ve belde daha paralel ilerler (Mendez ve ark., 2021). Çalışmanın amacı da omuriliği tedavi için hedeflemektir. Kökleri hedefleyen bir işlemde köklerin yönü ve açısı bölgeden bölgeye değişir.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Bebekte L3’te biten konus',
      oyku: `7 aylık bir bebeğe başka bir nedenle bel MR’ı çekiliyor. MR’da konus medullarisin ucu, L3 omurunun gövdesi hizasında görülüyor. Bebeğin sinir sistemi muayenesi olağan. Ailesi “omurilik aşağıda mı kalmış?” diye soruyor.`,
      soru: 'Bu düzey normal kabul edilebilir mi? Karar verirken hangi verilere dayanırsın?',
      cozum: `**Tek başına kesin yanıt vermez.** Çocuk MR’ı serisine göre konus çocukluk boyunca yükselmez. Erişkin düzeyine yaşamın ilk birkaç ayında ulaşır. L2–L3 ya da daha yukarısı her yaşta normal sayılır. L3 düzeyi ise belirsizdir. Çünkü bu hizada hem normal hem de gergin (*tethered*) bir omurilik bitebilir (Wilson ve Prince, 1989). Gergin omurilik, alt ucu aşağıda bir yere bağlı kalan omurilik demektir.

**Öteki veriler ne diyor?** Bir çalışmada çocuklara tüm omurga MR’ı yapıldı. Konus ortalama L1’in alt üçte birinde bitiyordu. Hiçbiri L2 omurunun ortasının altında bitmiyordu. Yazarlara göre gergin omurilik yoksa, konus L2 gövdesinin ortasının altında neredeyse hiç bitmez. Görüntüde daha aşağıda görünen bir konus, gergin omurilik kabul edilmelidir (Kesler ve ark., 2007).

Buna karşılık yenidoğan serilerinde aralık L3’e kadar uzanır. 105 sağlıklı yenidoğanda konus T12–L1’den L3’e kadar bitiyordu (Hill ve Gibson, 1995). Sakarya’da 1125 term bebekte bu aralık L1’den L3’e kadardı (Asil ve Yaldız, 2018). Doğumdan sonra konus az yükselir. Yenidoğanla erişkin arasındaki fark yaklaşık çeyrek omurdur (Hill ve Gibson, 1995). Yani 7 aylık bir bebekte konusun daha fazla yükselmesini beklemek doğru değildir.

**Sonuç:** Kaynaklar L3 düzeyini farklı yorumlar:

- Çocuklarda tüm omurga MR’ı serisi bu düzeyi gergin omurilik sayar (Kesler ve ark., 2007).
- Bel MR’ı serisi belirsiz sayar (Wilson ve Prince, 1989).
- Yenidoğan serilerinde ise L3, normal aralığın alt ucudur (Hill ve Gibson, 1995; Asil ve Yaldız, 2018).

Bu yüzden L3 düzeyi sınırda bir bulgudur. Gergin omurilik yönünden dikkatle değerlendirilmelidir. Görüntü, klinik bulgularla birlikte yorumlanır. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
