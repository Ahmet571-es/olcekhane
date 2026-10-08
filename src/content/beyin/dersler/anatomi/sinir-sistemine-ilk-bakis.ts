import type { Ders, Sahne } from '../../types';

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
  baslik: 'Sinir sistemine ilk bakış ve anatominin dili',
  aciklama:
    'Sinir sistemini sıfırdan tanıyın: merkezî ve çevresel bölümler, beynin dört ana bölümü, gri ve beyaz cevher, yön terimleri ve kesit düzlemleri.',
  giris:
    'Beynin ayrıntılarına dalmadan önce haritanın tamamına bakalım: sinir sistemi hangi parçalardan oluşur, beyin bu sistemin neresindedir ve anatomistler bir yapının yerini nasıl tarif eder?',
  hedefler: [
    'Merkezî ve çevresel sinir sistemini ayırt etmek',
    'Beynin dört ana bölümünü üç boyutlu modelde bulmak',
    'Gri cevher ile beyaz cevherin farkını açıklamak',
    'Yön terimlerini (rostral, kaudal, dorsal, ventral, medial, lateral) doğru kullanmak',
    'Üç kesit düzlemini (sagital, koronal, aksiyel) tanımak',
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

Bu sınır kesin bir duvar değildir: Çevresel sinir sisteminin bazı parçaları kafatasının ya da omurga kanalının içinde durur. Yine de bu ayrım, sinir sistemini öğrenmek için iyi bir başlangıç haritasıdır.`,
        },
        {
          tur: 'animasyon',
          ad: 'sinir-sistemi-haritasi',
          baslik: 'Sinir sisteminin haritası',
          aciklama:
            'Mavi bölüm merkezî, sarı-turuncu bölüm çevresel sinir sistemidir. Başlat düğmesiyle bir uyarının bedende nasıl dolaştığını izle: algılama, iletim, birleştirme ve tepki.',
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
          tur: 'kutu',
          cesit: 'aklinda-kalsin',
          md: '**MSS** = beyin + omurilik.\n\n**ÇSS** = kafa sinirleri (12 çift) + omurilik sinirleri (31 çift) + gangliyonlar.',
        },
      ],
    },
    {
      id: 'dort-bolum',
      baslik: 'Beynin dört ana bölümü',
      bloklar: [
        {
          tur: 'metin',
          md: `Beyin, kafatasının içinde duran ve merkezî sinir sisteminin üst ucunu oluşturan organdır. Anatomide dört ana bölümde incelenir:

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
            {
              deger: '%10 → %80',
              aciklama: 'Beyincik beyin kütlesinin yaklaşık %10’udur ama 86 milyar nöronun yaklaşık 69 milyarını, yani beşte dördünü taşır.',
            },
            { deger: '2,5', birim: 'mm', aciklama: 'Beyin kabuğunun ortalama kalınlığı. Yerden yere 1 ile 4,5 mm arasında değişir.' },
            { deger: '⅔', aciklama: 'Beyin kabuğu yüzeyinin yaklaşık üçte ikisi oyukların içinde gizlidir; dışarıdan bakınca görünmez.' },
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
          md: 'Her yarımküre ağırlıklı olarak vücudun **karşı** yarısını yönetir: Sağ yarımküredeki hareket kabuğu sol kolu ve bacağı, soldaki sağ yanı yönetir. Bu yüzden sağ yarımküreyi etkileyen bir inme sol tarafta güçsüzlüğe yol açabilir. Aynı tarafa **ipsilateral**, karşı tarafa **kontralateral** denir.',
        },
      ],
    },
    {
      id: 'kesit-duzlemleri',
      baslik: 'Kesit düzlemleri: beyni dilimlemenin üç yolu',
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
          tur: 'kutu',
          cesit: 'aklinda-kalsin',
          md: '**Sagital:** sağ ve sol · **Koronal:** ön ve arka · **Aksiyel:** üst ve alt.',
        },
      ],
    },
  ],
  sozluk: [
    { terim: 'Merkezî sinir sistemi (MSS)', tanim: 'Beyin ve omurilik.' },
    { terim: 'Çevresel sinir sistemi (ÇSS)', tanim: 'Merkezî sinir sisteminin dışında kalan sinirler ve gangliyonlar.' },
    { terim: 'Nöron', tanim: 'Sinir sisteminin bilgi taşıyan temel hücresi.' },
    { terim: 'Akson', tanim: 'Nöronun sinyali başka hücrelere ileten uzun uzantısı.' },
    { terim: 'Miyelin', tanim: 'Birçok aksonu saran, yağdan zengin yalıtkan kılıf; beyaz cevhere rengini verir.' },
    { terim: 'Gri cevher', latince: 'Substantia grisea', tanim: 'Nöron gövdelerinin ve dendritlerin yoğun olduğu bölge.' },
    { terim: 'Beyaz cevher', latince: 'Substantia alba', tanim: 'Miyelinli aksonların yoğun olduğu bölge.' },
    { terim: 'Çekirdek', latince: 'Nucleus', tanim: 'Merkezî sinir sisteminde nöron gövdelerinin oluşturduğu küme.' },
    { terim: 'Gangliyon', latince: 'Ganglion', tanim: 'Çevresel sinir sisteminde nöron gövdelerinin oluşturduğu küme.' },
    { terim: 'Yol', latince: 'Tractus', tanim: 'Merkezî sinir sisteminde akson demeti.' },
    { terim: 'Büyük beyin', latince: 'Cerebrum', tanim: 'İki yarımküreden oluşan, beynin en büyük bölümü.' },
    { terim: 'Ara beyin', latince: 'Diencephalon', tanim: 'Talamus ve hipotalamusu içeren, büyük beynin altındaki bölüm.' },
    { terim: 'Beyin sapı', latince: 'Truncus encephali', tanim: 'Orta beyin, pons ve omurilik soğanı; beyni omuriliğe bağlar.' },
    { terim: 'Beyincik', latince: 'Cerebellum', tanim: 'Hareketi düzenleyen, büyük beynin arkasında ve altında duran bölüm.' },
    { terim: 'Rostral', tanim: 'Burna doğru. Beyinde öne, omurilikte yukarıya doğru.' },
    { terim: 'Kaudal', tanim: 'Kuyruğa doğru. Beyinde arkaya, omurilikte aşağıya doğru.' },
    { terim: 'Dorsal', tanim: 'Sırta doğru. Beyinde yukarıya, omurilikte arkaya doğru.' },
    { terim: 'Ventral', tanim: 'Karına doğru. Beyinde aşağıya, omurilikte öne doğru.' },
    { terim: 'Medial / lateral', tanim: 'Orta hatta doğru / yana doğru.' },
    { terim: 'İpsilateral / kontralateral', tanim: 'Aynı taraf / karşı taraf.' },
    { terim: 'Sagital düzlem', tanim: 'Sağı soldan ayıran düzlem; orta hattan geçene orta sagital (median) denir.' },
    { terim: 'Koronal düzlem', tanim: 'Önü arkadan ayıran düzlem; frontal düzlem de denir.' },
    { terim: 'Aksiyel düzlem', tanim: 'Üstü alttan ayıran düzlem; horizontal ya da transvers düzlem de denir.' },
  ],
  sorular: [
    {
      soru: 'Aşağıdakilerden hangisi merkezî sinir sisteminin bir parçasıdır?',
      secenekler: ['Koldaki bir sinir', 'Omurilik', 'Bir gangliyon', 'Bir kafa siniri'],
      dogru: 1,
      aciklama: 'Merkezî sinir sistemi beyin ve omurilikten oluşur. Sinirler ve gangliyonlar çevresel sinir sistemine girer.',
    },
    {
      soru: 'Beyin sapı hangi üç bölümden oluşur?',
      secenekler: ['Talamus, hipotalamus, pons', 'Orta beyin, pons, omurilik soğanı', 'Beyincik, pons, orta beyin', 'Korteks, talamus, omurilik'],
      dogru: 1,
      aciklama: 'Beyin sapı yukarıdan aşağıya orta beyin, pons ve omurilik soğanından oluşur. Talamus ve hipotalamus ara beyne aittir.',
    },
    {
      soru: 'Koku dışındaki bütün duyusal bilgiler beyin kabuğuna ulaşmadan önce nereden geçer?',
      secenekler: ['Hipotalamus', 'Beyincik', 'Talamus', 'Omurilik soğanı'],
      dogru: 2,
      aciklama: 'Talamus, duyusal bilgileri kabuğa aktaran bir istasyondur. Koku bilgisi bu kuralın dışındadır.',
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
    },
    {
      soru: 'Merkezî sinir sisteminde nöron gövdelerinin oluşturduğu kümeye ne ad verilir?',
      secenekler: ['Gangliyon', 'Çekirdek (nukleus)', 'Sinir', 'Yol (traktus)'],
      dogru: 1,
      aciklama: 'Merkezî sinir sisteminde nöron gövdesi kümesine çekirdek denir; aynı şeyin çevresel sinir sistemindeki adı gangliyondur.',
    },
    {
      soru: 'Omurilikte “dorsal” hangi yönü gösterir?',
      secenekler: ['Yukarıyı', 'Aşağıyı', 'Önü (karnı)', 'Arkayı (sırtı)'],
      dogru: 3,
      aciklama: 'Omurilikte dorsal sırta, yani arkaya doğrudur. Beyinde ise eksen büküldüğü için dorsal yukarıyı gösterir.',
    },
    {
      soru: 'Beyni sağ ve sol diye ayıran düzlem hangisidir?',
      secenekler: ['Sagital', 'Koronal', 'Aksiyel', 'Transvers'],
      dogru: 0,
      aciklama: 'Sagital düzlem sağı soldan ayırır. Koronal düzlem önü arkadan, aksiyel (transvers) düzlem üstü alttan ayırır.',
    },
    {
      soru: 'Sağ yarımküredeki hareket kabuğunu etkileyen bir inme en çok hangi tarafı etkiler?',
      secenekler: ['Vücudun sağ yarısını', 'Vücudun sol yarısını', 'İki yanı eşit olarak', 'Yalnızca yüzü'],
      dogru: 1,
      aciklama: 'Her yarımküre ağırlıklı olarak vücudun karşı (kontralateral) yarısını yönetir; sağ yarımküre sol yanı yönetir.',
    },
  ],
  kaynaklar: [
    {
      metin:
        'Betts, J. G., Young, K. A., Wise, J. A., Johnson, E., Poe, B., Kruse, D. H., Korol, O., Johnson, J. E., Womble, M., & DeSaix, P. (2022). Anatomy and physiology 2e (Bölüm 1.6, 12.1, 13.1, 13.2 ve 14.3). OpenStax.',
      url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/12-1-basic-structure-and-function-of-the-nervous-system',
    },
    {
      metin:
        'Biga, L. M., Bronson, S., Dawson, S., Harwell, A., Hopkins, R., Kaufmann, J., LeMaster, M., Matern, P., Morrison-Graham, K., Oja, K., Quick, D., Runyeon, J., & OpenStax. (2025). Anatomy & physiology 2e (Bölüm 13.3: Spinal and cranial nerves). Oregon State University.',
      url: 'https://open.oregonstate.education/anatomy2e/chapter/spinal-cranial-nerves/',
    },
    {
      metin: 'Henley, C. (2021). Foundations of neuroscience (Bölüm 16: Anatomical terminology). Michigan State University Libraries.',
      url: 'https://openbooks.lib.msu.edu/neuroscience/chapter/anatomical-terminology/',
    },
    {
      metin: 'National Institute of Neurological Disorders and Stroke. (2025). Brain basics: Know your brain. National Institutes of Health.',
      url: 'https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-know-your-brain',
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
  ],
  yayin: '2026-10-08',
  guncelleme: '2026-10-08',
};
