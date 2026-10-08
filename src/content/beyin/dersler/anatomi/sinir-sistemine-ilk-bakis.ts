import type { Ders, Sahne } from '../../types';

/** Ara beyni gösteren sahnede gizlenen, büyük beynin derindeki yapıları. */
const DERIN_SEREBRUM = [
  'kaudat-cekirdek',
  'putamen',
  'globus-pallidus',
  'hipokampus',
  'amigdala',
  'forniks',
  'forniks-komissuru',
  'korpus-kallozum',
  'on-komissur',
  'ic-kapsul',
];

const KESIT_KATMANLARI: Sahne['katmanlar'] = ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'];

export const sinirSistemineIlkBakis: Ders = {
  dal: 'anatomi',
  slug: 'sinir-sistemine-ilk-bakis',
  sira: 1,
  seviye: 'temel',
  baslik: 'Sinir sistemine ilk bakış ve anatominin dili',
  aciklama:
    'Sinir sistemini sıfırdan tanıyın: merkezî ve çevresel bölümler, beynin bölümleri, loblar, gri ve beyaz cevher, yön terimleri, kesitler ve MR gösterimi.',
  giris:
    'Beynin ayrıntılarına dalmadan önce haritanın tamamına bakalım: sinir sistemi hangi parçalardan oluşur, beyin bu sistemin neresindedir, onu ne korur ve besler, anatomistler bir yapının yerini nasıl tarif eder?',
  hedefler: [
    'Merkezî ve çevresel sinir sistemini; somatik ve otonom sistemi ayırt etmek',
    'Omurilik sinirlerinin sayısını, köklerini ve karma yapısını açıklamak',
    'Beynin büyük bölümlerini ve gelişimdeki kökenlerini üç boyutlu modelde bulmak',
    'Büyük yarıkları, olukları ve lobları tanımak',
    'Gri ve beyaz cevheri, beyaz cevherin üç lif türünü ayırt etmek',
    'Yön terimlerini ve kesit düzlemlerini doğru kullanmak; MR’da sağı ve solu okumak',
    'Beyni koruyan ve besleyen yapılara ilk kez bakmak',
  ],
  bolumler: [
    {
      id: 'haberlesme-agi',
      baslik: 'Sinir sistemi: bedenin haberleşme ağı',
      bloklar: [
        {
          tur: 'metin',
          md: `Elindeki telefon titrediğinde neler olur? Parmak ucundaki duyu almaçları titreşimi fark eder, bu bilgi sinirlerle omuriliğe ve beyne ulaşır, beyin ne yapacağına karar verir ve kolundaki kaslara komut gönderir. Bu yolculuğun hepsi saniyenin küçük bir bölümünde tamamlanır. Bunu yöneten sistem **sinir sistemidir**.

Sinir sisteminin üç temel işi vardır:

- **Algılama:** Bedenin içinden ve dışından bilgi toplamak. Görme, işitme, dokunma, tat ve koku bunun en bilinen örnekleridir.
- **Birleştirme:** Gelen bilgiyi anılarla, o anki duygu durumuyla ve daha önce öğrenilenlerle bir araya getirip ne yapılacağına karar vermek.
- **Tepki:** Kasları kasmak ya da bezlere salgı yaptırmak.

Anatomistler sinir sistemini iki büyük bölüme ayırır:

- **Merkezî sinir sistemi (MSS):** beyin ve omurilik. Bilginin işlendiği ve kararların verildiği yer burasıdır.
- **Çevresel (periferik) sinir sistemi (ÇSS):** merkezî sinir sisteminin dışında kalan her şey. Beyinden çıkan **12 çift kafa siniri**, omurilikten çıkan **31 çift omurilik siniri** ve sinirlerin üzerindeki küçük nöron kümeleri olan **gangliyonlar** bu bölüme girer.

Bu sınır kesin bir duvar değildir: Çevresel sinir sisteminin bazı parçaları kafatasının ya da omurga kanalının içinde durur. Yine de bu ayrım, sinir sistemini öğrenmek için iyi bir başlangıç haritasıdır.

Sinir dokusunda iki büyük hücre ailesi vardır. **Nöronlar** sinir sisteminin hesaplamasını ve haberleşmesini yapar; elektrik ve kimyasal sinyalleri onlar taşır. **Glia hücreleri** ise nöronları destekler, besler ve korur. İkisini de 2. bölümün ilk derslerinde ayrıntılı göreceğiz.`,
        },
        {
          tur: 'animasyon',
          ad: 'sinir-sistemi-haritasi',
          baslik: 'Sinir sisteminin haritası',
          aciklama:
            'Mavi bölüm merkezî, sarı-turuncu bölüm çevresel sinir sistemidir. Başlat düğmesiyle bir uyarının bedende nasıl dolaştığını izle: algılama, iletim, birleştirme ve tepki.',
        },
        {
          tur: 'kutu',
          cesit: 'derinles',
          baslik: 'Getirici ve götürücü: afferent ve efferent',
          md: `Sinirbilimde yön, merkezî sinir sistemine göre söylenir. **Afferent (getirici)** lifler sinyali merkezî sinir sistemine doğru taşır; çoğu duyu lifidir. **Efferent (götürücü)** lifler sinyali merkezî sinir sisteminden uzağa, kaslara ve bezlere taşır. Latince *ferre* "taşımak" demektir: *af-* "içeri doğru", *ef-* "dışarı doğru" anlamı katar.

Hedefe göre de iki ayrım yapılır. **Somatik** sistem iskelet kaslarını kasar ve bilinçli algıyı taşır. **Otonom (visseral)** sistem kalp kasını, iç organlardaki düz kasları ve bezleri yönetir.`,
        },
        {
          tur: 'metin',
          md: `Omurilikten çıkan sinirler omurganın bölgelerine göre adlandırılır. Her omurilik siniri omuriliğe iki kökle bağlanır: **arka (dorsal) kök** duyu bilgisini içeri getirir, **ön (ventral) kök** hareket komutunu dışarı götürür. İki kök birleşince ortaya çıkan omurilik siniri hem duyu hem hareket lifi taşır; bu yüzden bütün omurilik sinirleri **karma** sinirdir.`,
        },
        {
          tur: 'animasyon',
          ad: 'omurilik-sinirleri',
          baslik: 'Omurga, omurilik ve 31 çift sinir',
          aciklama:
            'Bir bölgeye dokunarak o bölgedeki omur ve sinir sayısını gör. Omuriliğin enine kesitinde sarı nokta arka kökten içeri giren duyu sinyalini, kırmızı nokta ön kökten çıkan hareket komutunu gösterir.',
        },
        {
          tur: 'kutu',
          cesit: 'biliyor-muydun',
          md: 'Omurilik omurga kadar uzun değildir. Bebeklikten sonra omurilik pek uzamaz ama omurga büyümeyi sürdürür. Bu yüzden yetişkinde omurilik bel omurlarının üst hizasında biter; altındaki sinir demetine, at kuyruğuna benzediği için **at kuyruğu** (cauda equina) denir.',
        },
        {
          tur: 'metin',
          md: 'Sinir sistemi bir de **yaptığı işe göre** bölümlere ayrılır:',
        },
        {
          tur: 'tablo',
          baslik: 'Sinir sisteminin işlevsel bölümleri',
          sutunlar: ['Bölüm', 'Ne yapar?', 'Örnek'],
          satirlar: [
            ['Somatik sinir sistemi', 'Bilinçli algıyı ve istemli hareketleri yönetir.', 'Bir topu görüp ona uzanmak'],
            [
              'Otonom sinir sistemi',
              'İstem dışı çalışır: kalp kasını, iç organlardaki düz kasları ve bezleri yönetir; vücudun iç dengesini korur.',
              'Koşarken kalbin hızlanması',
            ],
            [
              'Enterik sinir sistemi',
              'Sindirim kanalının kaslarını ve bezlerini yönetir. Çoğu zaman otonom sistemin bir parçası sayılır.',
              'Bağırsakların yiyeceği ilerletmesi',
            ],
          ],
          not: 'Somatik sistem de bazı refleksleri bilinçli bir karar vermeden yürütür.',
        },
        {
          tur: 'metin',
          md: 'Otonom sistemin iki kolu vardır. **Sempatik** kol "savaş ya da kaç" yanıtıyla, **parasempatik** kol "dinlen ve sindir" hâliyle anılır. İki kol çoğu organda birbirinin tersini yapar:',
        },
        {
          tur: 'animasyon',
          ad: 'otonom-terazi',
          baslik: 'Otonom sistemin iki kolu',
          aciklama: 'Düğmeyle kolu değiştir: göz bebeği, tükürük, hava yolları, kalp, sindirim ve mesane nasıl değişiyor?',
        },
        {
          tur: 'kutu',
          cesit: 'aklinda-kalsin',
          md: '**MSS** = beyin + omurilik.\n\n**ÇSS** = kafa sinirleri (12 çift) + omurilik sinirleri (31 çift) + gangliyonlar.\n\nOtonom sistem: **sempatik** "savaş ya da kaç", **parasempatik** "dinlen ve sindir".',
        },
        {
          tur: 'kutu',
          cesit: 'sinav-notu',
          md: `- 31 çift omurilik siniri: **8 boyun (C), 12 göğüs (T), 5 bel (L), 5 sağrı (S), 1 kuyruk (Co)**. Boyunda omur 7, sinir 8 çifttir.
- 12 çift kafa sinirinin 3'ü yalnız duyu, 5'i yalnız hareket, 4'ü karma sinirdir.
- **Arka kök duyu, ön kök hareket** taşır; duyu nöronlarının gövdeleri arka kök gangliyonundadır. Bütün omurilik sinirleri karmadır.
- Yetişkinde omurilik bel omurlarının üst hizasında biter; altında at kuyruğu uzanır.`,
        },
        {
          tur: 'kutu',
          cesit: 'klinik',
          baslik: 'Hasarın yeri belirtiyi belirler',
          md: `Sinir sistemini öğrenmenin en önemli nedenlerinden biri, bir belirtiden hasarın yerini çıkarabilmektir. Örneğin omurilikten çıkıp omuza, kola ve ele giden sinir ağı (brakiyal pleksus) zarar görürse kol güçsüzleşebilir ya da felç olabilir; kolda ve elde his kaybı olabilir. Belirti, o sinirin hizmet ettiği bölgeyle sınırlıdır.

Beynin bir yarısı zarar gördüğünde ise vücudun **karşı** yanı etkilenir: Sağ yarımküreyi etkileyen bir inme sol kolda ve bacakta felce yol açabilir. Bu "yer belirleme" mantığı, Klinik Nörobilim bölümündeki nörolojik muayene dersinin temelidir.`,
        },
      ],
    },
    {
      id: 'beynin-bolumleri',
      baslik: 'Beynin büyük bölümleri',
      bloklar: [
        {
          tur: 'metin',
          md: `Beyin, kafatasının içinde duran ve merkezî sinir sisteminin üst ucunu oluşturan organdır. Anatomide dört büyük bölümde incelenir:

1. **Büyük beyin (serebrum):** Beynin en büyük bölümü. Kıvrımlı dış yüzüne **beyin kabuğu** (korteks) denir. Derin bir yarık onu sağ ve sol **yarımküre** diye ikiye ayırır; iki yarımküreyi en büyük lif köprüsü olan **korpus kallozum** birbirine bağlar. Bellek, duygular ve bilinç gibi en karmaşık işler büyük beynin çalışmasıyla ortaya çıkar.
2. **Ara beyin (diensefalon):** Büyük beynin altında, içeride saklıdır. En büyük parçası **talamustur**: koku dışındaki bütün duyusal bilgiler kabuğa ulaşmadan önce talamustan geçer. Talamusun altındaki **hipotalamus** vücudun iç dengesini korur; otonom sinir sistemini ve hormon sistemini yönetir.
3. **Beyin sapı:** **Orta beyin**, **pons** ve **omurilik soğanından** oluşur; beyni omuriliğe bağlar. Solunumu, kalp atışını ve kan basıncını düzenleyen merkezler buradadır.
4. **Beyincik (serebellum):** Büyük beynin arkasında ve altında duran "küçük beyin". Beyin kütlesinin yaklaşık onda biri kadardır. Hareketleri düzenler: büyük beynin planladığı hareketi bedenden gelen bilgilerle karşılaştırır ve gerekirse düzeltir.`,
        },
        {
          tur: 'sahne',
          baslik: 'Dört bölüm bir arada',
          aciklama:
            'Renkler dört bölümü gösterir: mavi büyük beyin, turkuaz ara beyin, mor beyin sapı, turuncu beyincik. Beyni parmağınla döndür; bir parçaya dokununca adı ve görevi açılır. Ara beyin içeride saklı olduğu için en iyi alttan görünür.',
          sahne: {
            katmanlar: ['kabuk', 'derin', 'sap'],
            renk: 'bolge',
            gizle: ['bolge:sinir'],
            bakis: 'sol',
            etiketler: [
              { yapi: 'ust-parietal-lobul-sol', metin: 'Büyük beyin' },
              { yapi: 'beyincik', metin: 'Beyincik' },
              { yapi: 'pons', metin: 'Beyin sapı' },
            ],
          },
          araclar: ['bakis', 'liste'],
        },
        {
          tur: 'sahne',
          baslik: 'Kabuğu saydamlaştıralım: içerideki ara beyin',
          aciklama:
            'Büyük beyin yarı saydam yapıldı. Ortada, beyin sapının hemen üstünde turkuaz renkli ara beyin görünür: iki yanda talamuslar, altlarında hipotalamus. Hipotalamusun altında sarkan küçük yapı hipofiz bezidir.',
          sahne: {
            katmanlar: ['kabuk', 'derin', 'sap'],
            renk: 'bolge',
            saydam: ['bolge:serebrum'],
            gizle: ['bolge:sinir', ...DERIN_SEREBRUM],
            bakis: 'egik',
            etiketler: [
              { yapi: 'talamus-sol', metin: 'Talamus' },
              { yapi: 'hipotalamus', metin: 'Hipotalamus' },
              { yapi: 'orta-beyin', metin: 'Orta beyin' },
              { yapi: 'pons', metin: 'Pons' },
              { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
              { yapi: 'beyincik', metin: 'Beyincik' },
            ],
          },
          araclar: ['bakis', 'liste'],
        },
        {
          tur: 'kutu',
          cesit: 'derinles',
          baslik: 'Adlar nereden geliyor? Gelişimdeki kesecikler',
          md: `Embriyoda sinir sistemi içi boş bir boru olarak başlar: **sinir borusu**. Borunun ön ucu beyni, arka bölümü omuriliği oluşturur. Ön uçta önce üç kesecik belirir, sonra bunlardan beşi oluşur. Yetişkin beyindeki adlar bu keseciklerden gelir:

| Birinci kesecikler | İkinci kesecikler | Yetişkindeki karşılığı |
| --- | --- | --- |
| Ön beyin (prosensefalon) | Telensefalon | Büyük beyin |
| | Diensefalon | Ara beyin: talamus, hipotalamus |
| Orta beyin (mezensefalon) | Mezensefalon | Orta beyin |
| Arka beyin (rombensefalon) | Metensefalon | Pons ve beyincik |
| | Miyelensefalon | Omurilik soğanı |

Orta beyin, pons ve omurilik soğanına birlikte **beyin sapı** denir; beyincik metensefalondan gelse de beyin sapına sayılmaz. Borunun içi de boş kalır ve beynin içindeki sıvı dolu boşlukları, yani **karıncıkları** oluşturur.`,
        },
        {
          tur: 'sayilar',
          baslik: 'Sayılarla beyin',
          ogeler: [
            { deger: '≈1,4', birim: 'kg', aciklama: 'Yetişkin bir beynin yaklaşık ağırlığı (üç libre kadar).' },
            {
              deger: '86',
              birim: 'milyar',
              aciklama: 'Yetişkin bir erkek beynindeki ortalama nöron sayısı. Nöron olmayan hücreler de (glia ve diğerleri) yaklaşık bu kadardır: 85 milyar.',
            },
            { deger: '%2 → %20', aciklama: 'Beyin vücut kütlesinin yalnızca %2’si kadardır ama vücudun enerjisinin yaklaşık %20’sini kullanır.' },
            { deger: '%15–20', aciklama: 'Kalbin her dakika pompaladığı kanın beyne giden yaklaşık payı.' },
            {
              deger: '%10 → %80',
              aciklama: 'Beyincik beyin kütlesinin yaklaşık %10’udur ama 86 milyar nöronun yaklaşık 69 milyarını, yani beşte dördünü taşır.',
            },
            { deger: '2,5', birim: 'mm', aciklama: 'Beyin kabuğunun ortalama kalınlığı. Yerden yere 1 ile 4,5 mm arasında değişir.' },
          ],
          not: 'Sayılar ortalamadır ve kişiden kişiye değişir. Kaynaklar dersin sonundadır.',
        },
        {
          tur: 'kutu',
          cesit: 'biliyor-muydun',
          md: 'Uzun yıllar "beyinde 100 milyar nöron ve bunun on katı glia hücresi var" diye anlatıldı. Hücreleri tek tek sayan yeni bir yöntem gerçek sayıları ölçtü: yaklaşık **86 milyar nöron** ve onlarla aşağı yukarı aynı sayıda nöron olmayan hücre. Yani glia hücreleri nöronlardan on kat fazla değildir.',
        },
      ],
    },
    {
      id: 'yariklar-ve-loblar',
      baslik: 'Büyük beynin yüzü: yarıklar, oluklar ve loblar',
      bloklar: [
        {
          tur: 'metin',
          md: `Büyük beynin yüzü kıvrım kıvrımdır. Her kabarık kıvrıma **girus** (çoğulu girusler), iki kıvrım arasındaki çukura **sulkus** (oluk), derin oluklara **fissür** (yarık) denir. Bu kıvrılma, kafatasının sınırlı hacmine çok daha geniş bir kabuk sığdırmayı sağlar: kabuk yüzeyinin yaklaşık üçte ikisi oyukların içinde gizlidir.

Dört büyük işaret yüzeyi haritalamaya yeter:

- **Uzunlamasına yarık:** iki yarımküreyi birbirinden ayırır.
- **Lateral oluk (yan yarık):** temporal lobu, üstündeki frontal ve parietal loblardan ayırır.
- **Merkezî oluk:** frontal lobu parietal lobdan ayırır. Önündeki **presantral girus** hareket kabuğunu, arkasındaki **postsentral girus** bedensel duyu kabuğunu taşır.
- **Parieto-oksipital oluk:** beynin iç yüzünde, parietal lobu oksipital lobdan ayırır.

Bu sınırlar dört lobu belirler: **frontal (alın)**, **parietal (yan kafa)**, **temporal (şakak)** ve **oksipital (art kafa)** lob. Lateral oluğun derininde, dışarıdan görünmeyen beşinci bir kabuk bölgesi daha vardır: **insula**. İç yüzde ise korpus kallozumu kuşak gibi saran **limbik lob** bulunur. Her lobu Anatomi bölümünde ayrı bir derste işleyeceğiz.`,
        },
        {
          tur: 'sahne',
          baslik: 'Dört lob ve iki merkez kıvrımı',
          aciklama:
            'Her lob ayrı renkte: mavi frontal, sarı parietal, yeşil temporal, pembe oksipital. Merkezî oluk, presantral ve postsentral girusların arasındadır. Bakış düğmesiyle beyni üstten de incele.',
          sahne: {
            katmanlar: ['kabuk', 'sap'],
            renk: 'lob',
            bakis: 'sol',
            etiketler: [
              { yapi: 'orta-frontal-girus-sol', metin: 'Frontal lob' },
              { yapi: 'ust-parietal-lobul-sol', metin: 'Parietal lob' },
              { yapi: 'orta-temporal-girus-sol', metin: 'Temporal lob' },
              { yapi: 'oksipital-lob-sol', metin: 'Oksipital lob' },
              { yapi: 'presantral-girus-sol', metin: 'Presantral girus' },
              { yapi: 'postsentral-girus-sol', metin: 'Postsentral girus' },
            ],
          },
          araclar: ['bakis', 'liste'],
        },
        {
          tur: 'sahne',
          baslik: 'Üstten bakış: uzunlamasına yarık',
          aciklama: 'Beyne tepeden bakınca iki yarımküreyi ayıran uzunlamasına yarık ön-arka yönde uzanır. Ön taraf ekranın üstündedir.',
          sahne: {
            katmanlar: ['kabuk'],
            renk: 'lob',
            bakis: 'ust',
            etiketler: [
              { yapi: 'ust-frontal-girus-sol', metin: 'Sol yarımküre' },
              { yapi: 'ust-frontal-girus-sag', metin: 'Sağ yarımküre' },
              { yapi: 'presantral-girus-sol', metin: 'Merkezî oluğun önü' },
            ],
          },
          araclar: ['bakis'],
        },
        {
          tur: 'sahne',
          baslik: 'Gizli lob: insula',
          aciklama:
            'Sol yarımkürede lateral oluğu örten kıvrımlar kaldırıldı: alt frontal girus, üst temporal girus ve supramarjinal girus. Altlarındaki mor insula görünür hâle geldi; kaldırılan kıvrımların yerinde krem renkli beyaz cevher görünür.',
          ileri: true,
          sahne: {
            katmanlar: ['kabuk', 'beyaz', 'sap'],
            renk: 'lob',
            gizle: ['alt-frontal-girus-sol', 'ust-temporal-girus-sol', 'supramarjinal-girus-sol'],
            bakis: 'sol',
            etiketler: [{ yapi: 'insula-sol', metin: 'İnsula' }],
          },
          araclar: ['bakis', 'liste'],
        },
        {
          tur: 'kutu',
          cesit: 'sinav-notu',
          md: `- **Uzunlamasına yarık** iki yarımküreyi, **lateral oluk** temporal lobu frontal ve parietal loblardan, **merkezî oluk** frontal lobu parietal lobdan, **parieto-oksipital oluk** (iç yüzde) parietal lobu oksipital lobdan ayırır.
- Presantral girus = birincil hareket kabuğu; postsentral girus = birincil bedensel duyu kabuğu.
- İnsula lateral oluğun derinindedir; frontal, parietal ve temporal lobların kapakçıkları (operkulum) onu örter.`,
        },
      ],
    },
    {
      id: 'gri-ve-beyaz-cevher',
      baslik: 'Gri cevher ve beyaz cevher',
      bloklar: [
        {
          tur: 'metin',
          md: `Beyin kesildiğinde iki ayrı renk görülür. **Gri cevher**, nöronların gövdelerinin ve dendritlerinin yoğun olduğu bölgelerdir; aslında pembemsi ya da açık kahverengidir, beyaz cevherin yanında koyu durduğu için bu adı alır. **Beyaz cevher** ise aksonların yoğun olduğu bölgelerdir: aksonları saran, yağdan zengin **miyelin** kılıfı bu bölgeye beyaz rengini verir.

Büyük beyinde gri cevher dışta, kabukta; beyaz cevher içte durur. Beyaz cevherin derinliklerinde de gri cevher adacıkları, yani **çekirdekler** bulunur. Omurilikte düzen tersinedir: gri cevher içte, kelebek biçiminde; beyaz cevher dıştadır.`,
        },
        {
          tur: 'animasyon',
          ad: 'gri-beyaz-cevher',
          baslik: 'Kabuktan geçen bir kesit',
          aciklama:
            'Gri cevherdeki nöron gövdelerinden çıkan aksonlar, miyelinle sarılı olarak beyaz cevherden geçer: kimisi komşu kıvrıma, kimisi aşağıya, beyin sapına ve omuriliğe gider. Sarı noktalar akan sinyalleri gösterir.',
        },
        {
          tur: 'metin',
          md: 'Aynı türden yapılar merkezî ve çevresel sinir sisteminde farklı adlar alır:',
        },
        {
          tur: 'tablo',
          baslik: 'Aynı yapı, iki ayrı ad',
          sutunlar: ['Yapı', 'Merkezî sinir sisteminde', 'Çevresel sinir sisteminde'],
          satirlar: [
            ['Nöron gövdelerinin kümesi', 'Çekirdek (nukleus)', 'Gangliyon'],
            ['Akson demeti', 'Yol (traktus)', 'Sinir'],
          ],
          not: 'İki istisnayı bil: Beynin derinindeki "bazal gangliyonlar" merkezî sinir sisteminde olduğu hâlde eski adını korur; bu yüzden birçok kaynak onlara "bazal çekirdekler" der. Görme siniri de optik kiazmada çaprazlaştıktan sonra adını değiştirir ve "görme yolu" (optik traktus) olur.',
        },
        {
          tur: 'sahne',
          baslik: 'Gerçek bir kesitte gri ve beyaz',
          aciklama:
            'Beyin önden arkaya doğru (koronal) kesildi; gerçeğe yakın renkler kullanıldı. Dıştaki pembemsi kabuk gri cevher, içteki krem renkli bölge beyaz cevher, derindeki koyu adacıklar gri cevher çekirdekleri, mavi boşluklar karıncıklardır. Kesitin yerini kaydırarak değiştir.',
          sahne: {
            katmanlar: KESIT_KATMANLARI,
            renk: 'dogal',
            gizle: ['bolge:sinir'],
            kesit: { duzlem: 'koronal', konum: 0.12 },
            bakis: 'on',
          },
          araclar: ['kesit', 'bakis', 'liste'],
        },
        {
          tur: 'kutu',
          cesit: 'derinles',
          baslik: 'Beyaz cevherin üç lif türü',
          md: `Beyaz cevherdeki akson demetleri, bağladıkları yerlere göre üç türe ayrılır:

- **Komissür lifleri** iki yarımküre arasında karşıya geçer. Bu liflerin büyük çoğunluğu **korpus kallozumdan** geçer; ön komissür de küçük bir komissürdür.
- **Bağlantı (asosiyasyon) lifleri** aynı yarımkürenin farklı bölgelerini birbirine bağlar.
- **Projeksiyon lifleri** kabuk ile alttaki yapılar (talamus, beyin sapı, omurilik) arasında aşağı yukarı uzanır. Beyin sapının üstünde, talamus ile bazal çekirdekler arasında yoğun bir tabaka oluştururlar: **iç kapsül**.`,
        },
        {
          tur: 'sahne',
          baslik: 'Lif türleri modelde',
          aciklama:
            'Kabuk kaldırıldı; derindeki çekirdekler ve beyin sapı soluk bırakıldı. Sarı: iki yarımküreyi bağlayan komissür lifleri (korpus kallozum ve ön komissür). Mavi: kabuktan aşağı inen ve yukarı çıkan projeksiyon liflerinin geçtiği iç kapsül. Bağlantı lifleri modelde ayrı bir parça olarak bulunmaz.',
          ileri: true,
          sahne: {
            katmanlar: ['derin', 'sap'],
            renk: 'yapi',
            goster: ['bolge:beyin-sapi', 'korpus-kallozum', 'on-komissur', 'ic-kapsul', 'talamus', 'kaudat-cekirdek', 'putamen'],
            vurgula: ['korpus-kallozum', 'on-komissur', 'ic-kapsul'],
            boya: [
              { secici: ['korpus-kallozum', 'on-komissur'], renk: '#f2b544' },
              { secici: ['ic-kapsul'], renk: '#5b84f2' },
            ],
            bakis: 'egik',
            etiketler: [
              { yapi: 'korpus-kallozum', metin: 'Korpus kallozum (komissür)' },
              { yapi: 'on-komissur', metin: 'Ön komissür' },
              { yapi: 'ic-kapsul-sol', metin: 'İç kapsül (projeksiyon)' },
            ],
          },
          araclar: ['bakis', 'liste'],
        },
        {
          tur: 'kutu',
          cesit: 'klinik',
          baslik: 'Miyelin hastalanınca: multipl skleroz',
          md: `**Multipl skleroz (MS)**, bağışıklık sisteminin merkezî sinir sistemindeki miyeline saldırdığı bir hastalıktır: iltihap gelişir ve miyelin yıkılır. Beynin ve omuriliğin beyaz cevherinde çok sayıda iz (skar) bulunur; hastalık sinir hücrelerinin gövdelerine ve aksonlarına da zarar verir. Belirtiler, hasarın nerede olduğuna ve ne kadar büyük olduğuna göre kişiden kişiye değişir.

Bu yüzden beyaz cevherin bir "kablo ağı" olduğunu bilmek, MS gibi hastalıkların belirtilerini anlamanın ilk adımıdır. Konunun ayrıntısı Klinik Nörobilim bölümündedir.`,
        },
      ],
    },
    {
      id: 'yon-terimleri',
      baslik: 'Yön terimleri: beyinde “nerede”?',
      bloklar: [
        {
          tur: 'metin',
          md: `Anatomide yönler hep aynı başlangıç duruşuna göre söylenir: **anatomik duruş**. Kişi dik durur; ayakları omuz genişliğinde ve paralel, yüzü ve ayak parmakları öne dönüktür. Bu duruşa göre:

- **Üst (superior)** başa, **alt (inferior)** ayaklara doğrudur.
- **Ön (anterior)** yüze, **arka (posterior)** sırta doğrudur.
- **İç (medial)** orta hatta, **dış (lateral)** yana doğrudur.
- **Yüzeysel** yüzeye yakın, **derin** yüzeyden uzak demektir.

Sinirbilimde dört terim daha sık geçer: **rostral** (burna doğru), **kaudal** (kuyruğa doğru), **dorsal** (sırta doğru) ve **ventral** (karına doğru). Püf noktası şudur: Dik durduğumuz için sinir sisteminin ekseni orta beyin hizasında yaklaşık 90 derece bükülür. Bu yüzden aynı terim beyinde ve omurilikte farklı yönleri gösterir.`,
        },
        {
          tur: 'animasyon',
          ad: 'yon-pusulasi',
          baslik: 'Yön pusulası',
          aciklama: 'Düğmelere basınca pusula sinir ekseni boyunca beyinden omuriliğe kayar ve eksenle birlikte döner.',
        },
        {
          tur: 'kutu',
          cesit: 'dikkat',
          baslik: 'Karıştırmamak için',
          md: 'Beyinde **dorsal = üst**, omurilikte **dorsal = arka**.\n\nBeyinde **rostral = ön**, omurilikte **rostral = üst**.',
        },
        {
          tur: 'kutu',
          cesit: 'biliyor-muydun',
          md: 'Her yarımküre ağırlıklı olarak vücudun **karşı** yarısını yönetir: sağ yarımküredeki hareket kabuğu sol kolu ve bacağı, soldaki sağ yanı yönetir. Aynı tarafa **ipsilateral**, karşı tarafa **kontralateral** denir. Bu çaprazlaşma kesin bir kural değildir: bazı yollar aynı tarafta kalır.',
        },
      ],
    },
    {
      id: 'kesit-duzlemleri',
      baslik: 'Kesit düzlemleri ve MR’da sağ-sol',
      bloklar: [
        {
          tur: 'metin',
          md: `Beynin içini görmenin en iyi yolu onu hayalî düzlemlerle dilimlemektir. MR görüntüleri de bu düzlemlerde çekilir:

- **Sagital düzlem** beyni **sağ ve sol** diye ayırır. Tam orta hattan geçene **orta sagital** (median) düzlem, ondan yana kaymış olanlara **parasagital** düzlem denir.
- **Koronal (frontal) düzlem** beyni **ön ve arka** diye ayırır.
- **Aksiyel (horizontal, transvers) düzlem** beyni **üst ve alt** diye ayırır.`,
        },
        {
          tur: 'sahne',
          baslik: 'Kendi kesitini al',
          aciklama:
            'Önce bir düzlem seç, sonra kaydırıcıyla kesitin yerini değiştir. Kesilen yüzeyde gri ve beyaz cevher, derin çekirdekler ve karıncıklar görünür. Katmanlar düğmesiyle kafatasını da ekleyebilirsin.',
          sahne: {
            katmanlar: KESIT_KATMANLARI,
            renk: 'dogal',
            gizle: ['bolge:sinir'],
            kesit: { duzlem: 'aksiyel', konum: 0.3 },
            bakis: 'ust',
          },
          araclar: ['kesit', 'bakis', 'katman', 'liste'],
        },
        {
          tur: 'sahne',
          baslik: 'Orta sagital kesit: beynin iç yüzü',
          aciklama:
            'Sağ yarımküre kaldırıldı; sol yarımküreye içeriden bakıyorsun. Korpus kallozum, talamus, beyin sapının üç bölümü ve beyinciğin kesit yüzü bu görünümde bir arada izlenir.',
          sahne: {
            katmanlar: KESIT_KATMANLARI,
            renk: 'yapi',
            gizle: ['bolge:sinir'],
            yarim: 'sol',
            bakis: 'ic-sol',
            etiketler: [
              { yapi: 'korpus-kallozum' },
              { yapi: 'singulat-girus-sol', metin: 'Singulat girus' },
              { yapi: 'talamus-sol', metin: 'Talamus' },
              { yapi: 'orta-beyin' },
              { yapi: 'pons' },
              { yapi: 'omurilik-sogani' },
              { yapi: 'beyincik' },
            ],
          },
          araclar: ['bakis', 'yarim', 'liste'],
        },
        {
          tur: 'metin',
          md: 'Kesit görüntüsüne bakarken bir sorun daha var: ekranın solu hastanın solu mudur, sağı mı? Bunun için iki kural kullanılır.',
        },
        {
          tur: 'animasyon',
          ad: 'mr-gosterimi',
          baslik: 'MR’da sağ ve sol',
          ileri: true,
          aciklama:
            'Radyolojik gösterimde aksiyel kesite hastanın ayak ucundan bakılır; hastanın sağı ekranın solunda görünür. Düğmeyle nörolojik gösterime geçince görüntü aynalanır.',
        },
        {
          tur: 'kutu',
          cesit: 'sinav-notu',
          md: `- **Sagital:** sağ ve sol · **Koronal:** ön ve arka · **Aksiyel:** üst ve alt.
- **Radyolojik gösterim:** aksiyel kesitlere ayak ucundan, koronal kesitlere hastanın karşısından bakılır; hastanın **sağı ekranın solundadır**.
- Bazı araştırma programları ters kuralı (nörolojik gösterim) kullanır. Görüntüdeki **R (sağ)** ve **L (sol)** harflerine bakmadan taraf söylenmez.`,
        },
      ],
    },
    {
      id: 'koruyanlar-ve-besleyenler',
      baslik: 'Beyni koruyanlar ve besleyenler: ilk bakış',
      bloklar: [
        {
          tur: 'metin',
          md: `Beyin vücudun en korunaklı organlarından biridir. Dışarıdan içeriye doğru:

- **Kafatası:** Beyni saran kemik kutuyu sekiz kemik oluşturur: alın kemiği, iki yan kafa kemiği, iki şakak kemiği, art kafa kemiği, kama kemiği ve kalbur kemiği.
- **Beyin zarları (meninksler):** En dışta kalın ve sağlam **sert zar** (dura mater), ortada ince **örümcek ağı zar** (araknoid mater), en içte kıvrımların ve olukların içine kadar uzanan ince **yumuşak zar** (pia mater).
- **Beyin-omurilik sıvısı:** Örümcek ağı zarın altındaki boşluğu doldurur ve beyni ile omuriliği bir sıvı yastık gibi sarar. Karıncıkların içinde, özel bir zar (koroid pleksus) tarafından yapılır.

Beyin çok kan ister: iki çift atardamar onu besler. Boynun iki yanından **iç karotis arterler**, omurların içinden yükselen **vertebral arterler**. Vertebral arterler birleşip **baziler arteri** oluşturur. İç karotis arterler ile baziler arterin dalları beynin tabanında birbirine bağlanarak bir halka oluşturur: **Willis halkası**. Bu konuların her biri Anatomi bölümünün sonraki derslerinde ayrıntılı işlenecek.`,
        },
        {
          tur: 'sahne',
          baslik: 'Kafatası ve beyin',
          aciklama:
            'Kafatası kemikleri ile beyin bir arada. "Kesit" düğmesiyle ikisini birlikte kesip kemiğin beyni nasıl sardığını görebilir, "Katmanlar" ile kafatasını kapatıp altındaki beyne bakabilirsin.',
          sahne: {
            katmanlar: ['kemik', 'kabuk', 'sap'],
            renk: 'dogal',
            bakis: 'sol',
            etiketler: [
              { yapi: 'alin-kemigi' },
              { yapi: 'yan-kafa-kemigi-sol', metin: 'Yan kafa kemiği' },
              { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
              { yapi: 'art-kafa-kemigi' },
            ],
          },
          araclar: ['bakis', 'katman', 'kesit', 'liste'],
        },
        {
          tur: 'sahne',
          baslik: 'Alttan bakış: beynin atardamarları',
          aciklama:
            'Beyin yarı saydam; atardamarlar kırmızı. Alttan bakınca iç karotis arterler, baziler arter ve beynin tabanındaki Willis halkası görünür.',
          sahne: {
            katmanlar: ['damar', 'kabuk', 'sap'],
            renk: 'dogal',
            saydam: ['katman:kabuk', 'katman:sap'],
            bakis: 'alt',
            etiketler: [
              { yapi: 'ic-karotis-arter-sol', metin: 'İç karotis arter' },
              { yapi: 'baziler-arter' },
              { yapi: 'vertebral-arter-sol', metin: 'Vertebral arter' },
              { yapi: 'orta-beyin-arteri-sol', metin: 'Orta beyin arteri' },
              { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin arteri' },
            ],
          },
          araclar: ['bakis', 'katman', 'liste'],
        },
        {
          tur: 'kutu',
          cesit: 'aklinda-kalsin',
          md: 'Beyni dışarıdan içeriye **kafatası**, **üç zar** (sert zar, örümcek ağı zar, yumuşak zar) ve **beyin-omurilik sıvısı** korur. Kanı **iç karotis** ve **vertebral** arterler getirir.',
        },
        {
          tur: 'kutu',
          cesit: 'klinik',
          baslik: 'Beyin kansız kalırsa',
          md: 'Nöronlar oksijen yokluğuna çok duyarlıdır: oksijensiz kaldıklarında bir iki dakika içinde bozulmaya başlarlar, kalıcı hasar (hücre ölümü) birkaç saat içinde gelişebilir. İnmede beynin bir bölgesinin kan akımı durur ya da azalır; bazı beyin hücreleri oksijen ve besin alamadığı için ölür ve kalıcı hasar dakikalar ya da saatler içinde oluşur. Bu yüzden inme acil bir durumdur.',
        },
      ],
    },
  ],
  sozluk: [
    { terim: 'Merkezî sinir sistemi (MSS)', tanim: 'Beyin ve omurilik.' },
    { terim: 'Çevresel sinir sistemi (ÇSS)', tanim: 'Merkezî sinir sisteminin dışında kalan sinirler ve gangliyonlar.' },
    { terim: 'Nöron', tanim: 'Sinir sisteminin sinyal taşıyan, hesaplama ve haberleşme yapan temel hücresi.' },
    { terim: 'Glia', tanim: 'Nöronları destekleyen, besleyen ve koruyan hücreler.' },
    { terim: 'Akson', tanim: 'Nöronun sinyali başka hücrelere ileten uzun uzantısı.' },
    { terim: 'Miyelin', tanim: 'Birçok aksonu saran, yağdan zengin yalıtkan kılıf; beyaz cevhere rengini verir.' },
    { terim: 'Afferent (getirici)', tanim: 'Sinyali merkezî sinir sistemine doğru taşıyan; çoğunlukla duyu lifleri.' },
    { terim: 'Efferent (götürücü)', tanim: 'Sinyali merkezî sinir sisteminden kaslara ve bezlere taşıyan.' },
    { terim: 'Somatik sinir sistemi', tanim: 'Bilinçli algıyı ve iskelet kaslarının hareketini yöneten bölüm.' },
    { terim: 'Otonom sinir sistemi', tanim: 'Kalp kasını, düz kasları ve bezleri istem dışı yöneten bölüm.' },
    { terim: 'Sempatik sistem', tanim: 'Otonom sistemin "savaş ya da kaç" kolu.' },
    { terim: 'Parasempatik sistem', tanim: 'Otonom sistemin "dinlen ve sindir" kolu.' },
    { terim: 'Arka (dorsal) kök', latince: 'Radix posterior', tanim: 'Omurilik sinirinin duyu liflerini taşıyan kökü; gangliyonu duyu nöronlarının gövdelerini içerir.' },
    { terim: 'Ön (ventral) kök', latince: 'Radix anterior', tanim: 'Omurilik sinirinin hareket liflerini taşıyan kökü.' },
    { terim: 'At kuyruğu', latince: 'Cauda equina', tanim: 'Omuriliğin bittiği yerin altında uzanan sinir kökleri demeti.' },
    { terim: 'Gri cevher', latince: 'Substantia grisea', tanim: 'Nöron gövdelerinin ve dendritlerin yoğun olduğu bölge.' },
    { terim: 'Beyaz cevher', latince: 'Substantia alba', tanim: 'Miyelinli aksonların yoğun olduğu bölge.' },
    { terim: 'Çekirdek', latince: 'Nucleus', tanim: 'Merkezî sinir sisteminde nöron gövdelerinin oluşturduğu küme.' },
    { terim: 'Gangliyon', latince: 'Ganglion', tanim: 'Çevresel sinir sisteminde nöron gövdelerinin oluşturduğu küme.' },
    { terim: 'Yol', latince: 'Tractus', tanim: 'Merkezî sinir sisteminde akson demeti.' },
    { terim: 'Büyük beyin', latince: 'Cerebrum', tanim: 'İki yarımküreden oluşan, beynin en büyük bölümü.' },
    { terim: 'Ara beyin', latince: 'Diencephalon', tanim: 'Talamus ve hipotalamusu içeren, büyük beynin altındaki bölüm.' },
    { terim: 'Beyin sapı', latince: 'Truncus encephali', tanim: 'Orta beyin, pons ve omurilik soğanı; beyni omuriliğe bağlar.' },
    { terim: 'Beyincik', latince: 'Cerebellum', tanim: 'Hareketi düzenleyen, büyük beynin arkasında ve altında duran bölüm.' },
    { terim: 'Girus', latince: 'Gyrus', tanim: 'Beyin kabuğundaki kabarık kıvrım.' },
    { terim: 'Sulkus', latince: 'Sulcus', tanim: 'İki kıvrım arasındaki oluk.' },
    { terim: 'Uzunlamasına yarık', latince: 'Fissura longitudinalis cerebri', tanim: 'İki yarımküreyi ayıran derin yarık.' },
    { terim: 'Lateral oluk', latince: 'Sulcus lateralis', tanim: 'Temporal lobu frontal ve parietal loblardan ayıran derin oluk.' },
    { terim: 'Merkezî oluk', latince: 'Sulcus centralis', tanim: 'Frontal lobu parietal lobdan ayıran oluk.' },
    { terim: 'İnsula', latince: 'Insula', tanim: 'Lateral oluğun derininde gizli kalan kabuk bölgesi.' },
    { terim: 'Komissür lifleri', tanim: 'İki yarımküre arasında karşıya geçen lifler; çoğu korpus kallozumdan geçer.' },
    { terim: 'Bağlantı (asosiyasyon) lifleri', tanim: 'Aynı yarımkürenin bölgelerini birbirine bağlayan lifler.' },
    { terim: 'Projeksiyon lifleri', tanim: 'Kabuk ile alttaki yapılar arasında uzanan lifler; iç kapsülden geçer.' },
    { terim: 'Rostral / kaudal', tanim: 'Burna doğru / kuyruğa doğru. Beyinde öne ve arkaya, omurilikte yukarı ve aşağı.' },
    { terim: 'Dorsal / ventral', tanim: 'Sırta doğru / karına doğru. Beyinde yukarı ve aşağı, omurilikte arkaya ve öne.' },
    { terim: 'Medial / lateral', tanim: 'Orta hatta doğru / yana doğru.' },
    { terim: 'İpsilateral / kontralateral', tanim: 'Aynı taraf / karşı taraf.' },
    { terim: 'Sagital düzlem', tanim: 'Sağı soldan ayıran düzlem; orta hattan geçene orta sagital (median) denir.' },
    { terim: 'Koronal düzlem', tanim: 'Önü arkadan ayıran düzlem; frontal düzlem de denir.' },
    { terim: 'Aksiyel düzlem', tanim: 'Üstü alttan ayıran düzlem; horizontal ya da transvers düzlem de denir.' },
    { terim: 'Radyolojik gösterim', tanim: 'Kesit görüntüsünde hastanın sağının ekranın solunda gösterildiği kural.' },
    { terim: 'Beyin zarları', latince: 'Meninges', tanim: 'Beyni ve omuriliği saran üç zar: sert zar, örümcek ağı zar ve yumuşak zar.' },
    { terim: 'Beyin-omurilik sıvısı', tanim: 'Karıncıklarda yapılan, beyni ve omuriliği yastık gibi saran sıvı.' },
    { terim: 'Willis halkası', latince: 'Circulus arteriosus cerebri', tanim: 'Beynin tabanında iç karotis arterleri ve baziler arterin dallarını birbirine bağlayan atardamar halkası.' },
  ],
  sorular: [
    {
      soru: 'Aşağıdakilerden hangisi merkezî sinir sisteminin bir parçasıdır?',
      secenekler: ['Koldaki bir sinir', 'Omurilik', 'Bir gangliyon', 'Bir kafa siniri'],
      dogru: 1,
      aciklama: 'Merkezî sinir sistemi beyin ve omurilikten oluşur. Sinirler ve gangliyonlar çevresel sinir sistemine girer.',
      seviye: 'temel',
    },
    {
      soru: 'Beyin sapı hangi üç bölümden oluşur?',
      secenekler: ['Talamus, hipotalamus, pons', 'Orta beyin, pons, omurilik soğanı', 'Beyincik, pons, orta beyin', 'Korteks, talamus, omurilik'],
      dogru: 1,
      aciklama: 'Beyin sapı yukarıdan aşağıya orta beyin, pons ve omurilik soğanından oluşur. Talamus ve hipotalamus ara beyne aittir.',
      seviye: 'temel',
    },
    {
      soru: 'Koku dışındaki bütün duyusal bilgiler beyin kabuğuna ulaşmadan önce nereden geçer?',
      secenekler: ['Hipotalamus', 'Beyincik', 'Talamus', 'Omurilik soğanı'],
      dogru: 2,
      aciklama: 'Talamus, duyusal bilgileri kabuğa aktaran bir istasyondur. Koku bilgisi bu kuralın dışındadır.',
      seviye: 'temel',
    },
    {
      soru: 'Beyaz cevher neden beyaz görünür?',
      secenekler: [
        'Aksonları saran yağdan zengin miyelin kılıfı yüzünden',
        'İçinde kan damarı olmadığı için',
        'Nöron gövdeleri beyaz olduğu için',
        'Beyin-omurilik sıvısıyla dolu olduğu için',
      ],
      dogru: 0,
      aciklama: 'Beyaz cevherde aksonlar yoğundur ve bu aksonları saran miyelin yağdan zengindir; bölgeye beyaz rengini o verir.',
      seviye: 'temel',
    },
    {
      soru: 'Tehlike anında sempatik sistem öne çıkınca göz bebeğine ne olur?',
      secenekler: ['Küçülür', 'Değişmez', 'Kapanır', 'Büyür'],
      dogru: 3,
      aciklama: 'Sempatik sistem göz bebeğini büyütür; parasempatik sistem küçültür. Sempatik kol ayrıca kalbi hızlandırır, sindirimi yavaşlatır.',
      seviye: 'temel',
    },
    {
      soru: 'Lateral oluk hangi lobu ötekilerden ayırır?',
      secenekler: ['Oksipital lobu', 'Temporal lobu', 'Frontal lobu parietal lobdan', 'İki yarımküreyi'],
      dogru: 1,
      aciklama: 'Lateral oluk temporal lobu üstündeki frontal ve parietal loblardan ayırır. Frontal ile parietal lobu merkezî oluk, iki yarımküreyi uzunlamasına yarık ayırır.',
      seviye: 'temel',
    },
    {
      soru: 'Beyni saran kemik kutuyu (beyin kafatasını) kaç kemik oluşturur?',
      secenekler: ['4', '6', '8', '22'],
      dogru: 2,
      aciklama: 'Sekiz kemik: alın kemiği, iki yan kafa kemiği, iki şakak kemiği, art kafa kemiği, kama kemiği ve kalbur kemiği.',
      seviye: 'temel',
    },
    {
      soru: 'Beyni sağ ve sol diye ayıran düzlem hangisidir?',
      secenekler: ['Sagital', 'Koronal', 'Aksiyel', 'Transvers'],
      dogru: 0,
      aciklama: 'Sagital düzlem sağı soldan ayırır. Koronal düzlem önü arkadan, aksiyel (transvers) düzlem üstü alttan ayırır.',
      seviye: 'temel',
    },
    {
      soru: 'Beyincik, beyin kütlesinin yaklaşık %10’u kadardır. Nöron sayısı bakımından hangisi doğrudur?',
      secenekler: [
        'Beynin nöronlarının yaklaşık %10’unu taşır',
        'Hiç nöron taşımaz, yalnızca glia içerir',
        'Nöronların tam yarısını taşır',
        'Beynin nöronlarının çoğunu (yaklaşık beşte dördünü) taşır',
      ],
      dogru: 3,
      aciklama: 'Yaklaşık 86 milyar nöronun 69 milyarı kadarı beyincikte bulunur. Beyincik küçüktür ama nöronları çok sık dizilmiştir.',
      seviye: 'lisans',
    },
    {
      soru: 'Merkezî sinir sisteminde nöron gövdelerinin oluşturduğu kümeye ne ad verilir?',
      secenekler: ['Gangliyon', 'Çekirdek (nukleus)', 'Sinir', 'Yol (traktus)'],
      dogru: 1,
      aciklama: 'Merkezî sinir sisteminde nöron gövdesi kümesine çekirdek denir; aynı şeyin çevresel sinir sistemindeki adı gangliyondur.',
      seviye: 'lisans',
    },
    {
      soru: 'Omurilikte “dorsal” hangi yönü gösterir?',
      secenekler: ['Yukarıyı', 'Aşağıyı', 'Önü (karnı)', 'Arkayı (sırtı)'],
      dogru: 3,
      aciklama: 'Omurilikte dorsal sırta, yani arkaya doğrudur. Beyinde ise eksen büküldüğü için dorsal yukarıyı gösterir.',
      seviye: 'lisans',
    },
    {
      soru: 'Omurilik sinirlerinin bölgelere göre dağılımı hangisidir?',
      secenekler: [
        '7 boyun, 12 göğüs, 5 bel, 5 sağrı, 1 kuyruk',
        '8 boyun, 12 göğüs, 5 bel, 5 sağrı, 1 kuyruk',
        '8 boyun, 10 göğüs, 6 bel, 5 sağrı, 2 kuyruk',
        '7 boyun, 12 göğüs, 6 bel, 5 sağrı, 1 kuyruk',
      ],
      dogru: 1,
      aciklama: '31 çift: 8 boyun, 12 göğüs, 5 bel, 5 sağrı, 1 kuyruk siniri. Boyunda omur 7, sinir 8 çifttir; ilk şık bu yüzden yanlıştır.',
      seviye: 'lisans',
    },
    {
      soru: 'Omurilik sinirinin arka (dorsal) kökü ne taşır?',
      secenekler: ['Yalnızca duyu nöronlarının aksonlarını', 'Yalnızca hareket nöronlarının aksonlarını', 'Hem duyu hem hareket liflerini', 'Otonom sistemin bütün liflerini'],
      dogru: 0,
      aciklama: 'Arka kökte yalnızca duyu nöronlarının aksonları, ön kökte yalnızca hareket nöronlarının aksonları vardır. İkisi birleşince karma omurilik siniri oluşur.',
      seviye: 'lisans',
    },
    {
      soru: 'Korpus kallozum hangi lif türüne örnektir?',
      secenekler: ['Projeksiyon lifleri', 'Bağlantı (asosiyasyon) lifleri', 'Komissür lifleri', 'Çevresel sinir lifleri'],
      dogru: 2,
      aciklama: 'Korpus kallozum iki yarımküreyi birbirine bağlayan en büyük komissürdür. İç kapsül projeksiyon liflerini taşır.',
      seviye: 'lisans',
    },
    {
      soru: 'Radyolojik gösterimdeki bir aksiyel MR kesitinde ekranın sol yanında görülen bir lezyon hastanın hangi yanındadır?',
      secenekler: ['Sol yanında', 'Sağ yanında', 'Orta hatta', 'Bu bilgiyle söylenemez'],
      dogru: 1,
      aciklama: 'Radyolojik gösterimde kesite ayak ucundan bakılır; hastanın sağı ekranın solundadır. Yine de görüntüdeki R ve L harflerine bakmak gerekir.',
      seviye: 'ileri',
    },
    {
      soru: 'Multipl skleroz (MS) için hangisi doğrudur?',
      secenekler: [
        'Yalnızca çevresel sinirleri etkiler',
        'Bağışıklık sistemi merkezî sinir sistemindeki miyeline saldırır',
        'Belirtiler her hastada aynıdır',
        'Yalnızca gri cevherde iz bırakır',
      ],
      dogru: 1,
      aciklama: 'MS’de bağışıklık sistemi MSS’deki miyeline saldırır; izler en çok beyaz cevherdedir ama nöronlar ve aksonlar da zarar görür. Belirtiler hasarın yerine ve büyüklüğüne göre değişir.',
      seviye: 'ileri',
    },
  ],
  kaynaklar: [
    {
      metin:
        'Betts, J. G., Young, K. A., Wise, J. A., Johnson, E., Poe, B., Kruse, D. H., Korol, O., Johnson, J. E., Womble, M., & DeSaix, P. (2022). Anatomy and physiology 2e (Bölüm 1.6, 7.2, 7.3, 12.1, 12.2, 13.1–13.4, 14.1, 14.3, 15.1–15.3, 16.1, 22.2, 23.1, 23.3, 25.2). OpenStax.',
      url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/12-1-basic-structure-and-function-of-the-nervous-system',
    },
    {
      metin:
        'Biga, L. M., Bronson, S., Dawson, S., Harwell, A., Hopkins, R., Kaufmann, J., LeMaster, M., Matern, P., Morrison-Graham, K., Oja, K., Quick, D., Runyeon, J., & OpenStax. (2025). Anatomy & physiology 2e (Bölüm 13.3: Spinal and cranial nerves). Oregon State University.',
      url: 'https://open.oregonstate.education/anatomy2e/chapter/spinal-cranial-nerves/',
    },
    {
      metin: 'Henley, C. (2021). Foundations of neuroscience (Bölüm: Anatomical terminology; External brain anatomy). Michigan State University Libraries.',
      url: 'https://openbooks.lib.msu.edu/neuroscience/chapter/anatomical-terminology/',
    },
    {
      metin: 'LibreTexts. (t.y.). 9.6C: White matter of the cerebrum. In A&P for STEM educators. Medicine LibreTexts.',
      url: 'https://med.libretexts.org/Courses/James_Madison_University/A_and_P_for_STEM_Educators/09%3A_Central_Nervous_System/9.06%3A_The_Cerebrum/9.6C%3A_White_Matter_of_the_Cerebrum',
    },
    {
      metin: 'National Institute of Neurological Disorders and Stroke. (2025). Brain basics: Know your brain. National Institutes of Health.',
      url: 'https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-know-your-brain',
    },
    {
      metin: 'National Institute of Neurological Disorders and Stroke. (2025). Multiple sclerosis (MS). National Institutes of Health.',
      url: 'https://www.ninds.nih.gov/health-information/disorders/multiple-sclerosis',
    },
    {
      metin: 'National Institute of Neurological Disorders and Stroke. (2026). Stroke overview. National Institutes of Health.',
      url: 'https://www.ninds.nih.gov/health-information/stroke/stroke-overview',
    },
    {
      metin: 'National Institute of Neurological Disorders and Stroke. (2026). Brachial plexus injury. National Institutes of Health.',
      url: 'https://www.ninds.nih.gov/health-information/disorders/brachial-plexus-injuries',
    },
    {
      metin:
        'Azevedo, F. A. C., Carvalho, L. R. B., Grinberg, L. T., Farfel, J. M., Ferretti, R. E. L., Leite, R. E. P., Jacob Filho, W., Lent, R., & Herculano-Houzel, S. (2009). Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain. Journal of Comparative Neurology, 513(5), 532–541.',
      url: 'https://doi.org/10.1002/cne.21974',
    },
    {
      metin: 'Herculano-Houzel, S. (2009). The human brain in numbers: A linearly scaled-up primate brain. Frontiers in Human Neuroscience, 3, 31.',
      url: 'https://doi.org/10.3389/neuro.09.031.2009',
    },
    {
      metin:
        'Herculano-Houzel, S. (2011). Scaling of brain metabolism with a fixed energy budget per neuron: Implications for neuronal activity, plasticity and evolution. PLoS ONE, 6(3), e17514.',
      url: 'https://doi.org/10.1371/journal.pone.0017514',
    },
    {
      metin: 'Venkat, P., Chopp, M., & Chen, J. (2016). New insights into coupling and uncoupling of cerebral blood flow and metabolism in the brain. Croatian Medical Journal, 57(3), 223–228.',
      url: 'https://doi.org/10.3325/cmj.2016.57.223',
    },
    {
      metin:
        'von Bartheld, C. S., Bahney, J., & Herculano-Houzel, S. (2016). The search for true numbers of neurons and glial cells in the human brain: A review of 150 years of cell counting. Journal of Comparative Neurology, 524(18), 3865–3895.',
      url: 'https://doi.org/10.1002/cne.24040',
    },
    {
      metin: 'Zilles, K. (2018). Brodmann: A pioneer of human brain mapping—His impact on concepts of cortical organization. Brain, 141(11), 3262–3278.',
      url: 'https://doi.org/10.1093/brain/awy273',
    },
    {
      metin: 'BioNumbers. (t.y.). Thickness of cerebral cortex (BNID 110098). Harvard Medical School.',
      url: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110098',
    },
    {
      metin: 'NiBabel developers. (t.y.). Radiological vs neurological conventions. In NiBabel documentation.',
      url: 'https://nipy.org/nibabel/neuro_radio_conventions.html',
    },
    {
      metin: 'Tıp Dekanları Konseyi. (2020). Mezuniyet öncesi tıp eğitimi ulusal çekirdek eğitim programı (UÇEP 2020). Yükseköğretim Kurulu.',
      url: 'https://tip.bakircay.edu.tr/Yuklenenler/TIP%20FAK%C3%9CLTES%C4%B0/mezuniyet_oncesi_tip_egitimi_cek.pdf',
    },
  ],
  ucep: [
    { no: 154, ad: 'İnme', duzey: 'A-K-İ' },
    { no: 224, ad: 'Multipl skleroz', duzey: 'ÖnT' },
  ],
  yayin: '2026-10-08',
  guncelleme: '2026-10-08',
};
