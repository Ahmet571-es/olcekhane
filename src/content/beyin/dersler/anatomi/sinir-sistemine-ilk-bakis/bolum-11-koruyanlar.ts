import type { DersBolumu } from '../../../types';

const ON_DOLASIM = '#e5484d';
const ARKA_DOLASIM = '#8a6fd8';
const BAGLANTI = '#f2b544';
const KARINCIK = '#25b9a3';
const BEZ = '#f2b544';

/**
 * 11. bölüm: beyni koruyanlar ve besleyenler. Kafatası (kısa), zarlar ve aralıklar, sert zarın kıvrımları ve
 * sinüsleri, BOS'un yapılışı, dolaşımı ve emilimi, atık temizliği (glimfatik hipotez, menenjiyal lenf damarları),
 * kan-beyin engeli ve sirkumventriküler organlar, beyin dolaşımı ve Willis halkası, kafa içi basıncı. Bilgiler
 * kaynak notlarından (S0/D ve S0/A); her konunun ayrıntısı Anatomi bölümünün kendi derslerinde.
 */
export const koruyanlarVeBesleyenler: DersBolumu = {
  id: 'koruyanlar-ve-besleyenler',
  baslik: 'Beyni koruyanlar ve besleyenler',
  bloklar: [
    // ——— Giriş ve kafatası ———
    {
      tur: 'metin',
      md: `Beyin hem çok iyi korunan hem de çok iyi beslenen bir organdır. Onu dış dünyaya karşı üç engel korur: **kafatası**, **beyin zarları** (*meninges*) ve **beyin-omurilik sıvısı** (BOS; *liquor cerebrospinalis*) (Dafny, 2020).

Beslenme tarafında şaşırtıcı bir tablo var. Beyin, vücut ağırlığının yalnızca %2’si kadardır. Ama vücuda dağıtılan glikozun %25’ini, oksijenin de yaklaşık %20’sini kullanır (Siwicka-Gieroba ve ark., 2022). Bu yakıtı iki çift atardamar getirir. Kan ile beyin dokusu arasında da bir sınır vardır. Bu sınır, kandan beyne neyin geçip neyin geçemeyeceğini seçer. Adı **kan-beyin engelidir**.

Bu bölüm, beyni koruyan ve besleyen yapıların haritasıdır. Önce zarlara ve aralarındaki aralıklara bakacağız. Sonra BOS’un nasıl yapıldığını ve nereye aktığını göreceğiz. Ardından beynin atıklarını nasıl temizlediğini ve kan-beyin engelini anlatacağız. En sonda beynin atardamarları, toplardamarları ve kafa içi basıncı var. Her konunun bütün ayrıntısı Anatomi bölümünün kendi derslerinde işlenecek. Bu dersler şunlardır: Beyin zarları, Karıncıklar ve beyin-omurilik sıvısı, Beynin atardamarları ve Willis halkası, Atardamar alanları ve toplardamarlar.`,
    },
    {
      tur: 'metin',
      md: `**Kafatası** ilk ve en sert engeldir. Burada yalnızca beyni besleyen atardamarların girdiği kapıları hatırlayalım. İç karotis arter kafatasına şakak kemiğindeki karotis kanalından girer. Vertebral arterler ise art kafa kemiğinin büyük deliğinden (*foramen magnum*) girer (OpenStax 13.3).

Kafatası beyne yalnızca dışarıdan bir kask gibi değmez. İç yüzünde küçük çukurcuklar vardır. Bunları, beyin zarlarından birinin küçük çıkıntıları açar: araknoid granülasyonlar. Bu çıkıntılar büyüdükçe kemiği eritir (Gray, 1918). Kemiğin kanallarından da **emisser venler** geçer. Bu toplardamarlar, sert zarın içindeki toplardamar kanallarını (sinüsleri) kafanın yüzeyindeki toplardamarlara bağlar. Kemiğin ilik boşluğuna da ulaşırlar (Joost ve ark., 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Kafatası ve beyin',
      aciklama:
        'Kafatası kemikleri ve beyin bir arada. Soldan bakıyoruz. Ön taraf solda, renkler gerçeğe yakın. "Kesit" ile ikisini birlikte kesebilir, kemiğin beyni nasıl sardığını görebilirsin. "Katmanlar" ile kafatasını kapatıp altındaki beyne bakabilirsin. Modelde beyin zarları ve BOS yoktur. Kemikle beyin arasındaki ince aralığı gerçekte onlar doldurur.',
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

    // ——— Zarlar, aralıklar, kıvrımlar, sinüsler ———
    {
      tur: 'metin',
      md: `Kemiğin altında beyni ve omuriliği üç zar sarar. Dıştan içe: **sert zar** (*dura mater*), **örümcek ağı zar** (*arachnoidea mater*) ve **yumuşak zar** (*pia mater*) (Gray, 1918).

- **Sert zar** kalın, lifli ve sağlam bir kılıftır. Bütün beyni ve omuriliği sarar. Latince adı “sert ana” demektir (OpenStax 13.3).
- **Örümcek ağı zar** incedir. Altında, örümcek ağına benzeyen ince bir lif ağı vardır. Bu liflere **araknoid trabeküller** denir; zar adını bu ağdan alır (OpenStax 13.3).
- **Yumuşak zar** beynin yüzeyine yapışık, ince bir örtüdür. Latince adı “şefkatli ana” demektir (OpenStax 13.3). Kıvrımların arasındaki olukların içine kadar iner. Örümcek ağı zar ise olukların üstünden geçer ve bir kıvrımdan ötekine köprü kurar (Gray, 1918).

Örümcek ağı zar ile yumuşak zarın arasında bir aralık vardır: **subaraknoid aralık** (*spatium subarachnoidale*). Bu aralık dolaşan BOS ile doludur. Beyin ve omurilik bu sıvının içinde, bir yastığa oturmuş gibi durur (OpenStax 13.3).`,
    },
    {
      tur: 'metin',
      md: `Sert zar, beynin çevresinde düz bir torba gibi durmaz. İçeri doğru kıvrılır ve kafatasının içini bölmelere ayırır. Dört ana kıvrımı vardır:

- **beyin orağı** (*falx cerebri*),
- **beyincik çadırı** (*tentorium cerebelli*),
- **beyincik orağı** (*falx cerebelli*),
- **sella diyaframı** (*diaphragma sellae*) (Ishikawa ve ark., 2026).

En büyüğü beyin orağıdır. İki beyin yarımküresini ayıran derin yarığa iner. İkinci büyük kıvrım beyincik çadırıdır. Büyük beyin ile beyinciğin arasına bir çatı gibi gerilir. Böylece kafatasının içini iki kata ayırır: **çadır üstü** ve **çadır altı** (Ishikawa ve ark., 2026).

Sert zarın iki katmanı arasında toplardamar kanalları uzanır. Bu kanallar beynin kanını toplar ve kapakçıkları yoktur. Adları **dural venöz sinüslerdir** (Gray, 1918). Kan, tepedeki **üst sagital sinüsten** (*sinus sagittalis superior*) arkadaki **sinüslerin birleşim yerine** (*confluens sinuum*) gelir. Sonra **transvers sinüslere** ve **sigmoid sinüslere** geçer. En sonunda boyundaki **iç juguler venlere** (*vena jugularis interna*) akar (OpenStax 13.3).`,
    },
    {
      tur: 'sahne',
      baslik: 'Orta hattan: sert zar kıvrımlarının yeri',
      aciklama:
        'Kafatası ve beyin orta hattan ikiye ayrıldı. Sol yarıya içeriden bakıyoruz; yüz sağda. Modelde zarlar yoktur, ama kıvrımların yeri bellidir. Beyin orağı bu iç yüzün hemen önünde, iki yarımküre arasındaki yarığa iner. Beyincik çadırı, oksipital lobun alt yüzü ile beyinciğin üstü arasına bir çatı gibi gerilir. Çadırın ön kenarında bir çentik vardır; orta beyin bu çentikten geçer. Renkler gerçeğe yakın.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        vurgula: ['katman:kemik', 'katman:kabuk', 'katman:beyaz', 'katman:derin', 'katman:sap'],
        etiketler: [
          { yapi: 'korpus-kallozum' },
          { yapi: 'oksipital-lob-sol', metin: 'Oksipital lob' },
          { yapi: 'beyincik' },
          { yapi: 'orta-beyin' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Dıştan içe:** kafatası → sert zar → örümcek ağı zar → BOS dolu subaraknoid aralık → yumuşak zar → beyin.

**Sert zarın kıvrımları:** beyin orağı (iki yarımküre arası), beyincik çadırı (büyük beyin ile beyincik arası), beyincik orağı, sella diyaframı.

**Kanın dönüş yolu:** beyin yüzeyinin toplardamarları → üst sagital sinüs → sinüslerin birleşim yeri → transvers sinüs → sigmoid sinüs → iç juguler ven.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Kitaplardaki “subdural aralık”',
      md: 'Birçok kitapta sert zar ile örümcek ağı zarın arasına ince bir “subdural aralık” çizilir. Güncel anatomi ise sağlıklı insanda böyle bir boşluk olduğunu kabul etmez. Normalde örümcek ağı zar sert zara yapışıktır. Sert zar da kafatasına yapışıktır. Bu yüzden aralarında doğal bir aralık yoktur (FIPAT, 2019). “Subdural aralık” denen yer ancak bir travma ya da kanamayla açılır. O zaman sert zarın en iç hücre katmanı yarılır (Ishikawa ve ark., 2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sert zar.** Sert zarın kalınlığı ortalama 0,33–0,56 mm’dir (Ishikawa ve ark., 2026). Klasik anlatımda kafatasındaki sert zarın iki katmanı vardır. Kemiğe bakan katmana **endosteal (periostal) katman**, beyne bakan katmana **meningeal katman** denir (Gray, 1918). Uluslararası anatomi terimleri listesi Terminologia Anatomica (TA2) de kafatasındaki sert zarda yalnızca bu iki kısmı adlandırır. Latince adları *pars periostea* ve *pars meningea durae cranialis*’tir (FIPAT, 2019).

Bugünkü anlatımda ise sert zarın üç katmanı vardır. Dıştan içe: kemiğe yapışan endosteal katman, asıl sert zar olan meningeal katman (*dura propria*) ve en içte ince bir hücre katmanı. Bu en içtekine **dural sınır hücre katmanı** denir (Ishikawa ve ark., 2026). Bu katman, örümcek ağı zarın engel hücrelerine komşudur (Castro Dias ve ark., 2019). İki anlatım çelişmez. Yalnızca biri daha ayrıntılıdır. Omurilikteki sert zar ise yalnızca meningeal katmanın devamıdır. Endosteal katman, kafatasının büyük deliğinde (foramen magnum) sona erer (Gray, 1918).

Sert zarın kıvrımları, meningeal katmanın ikiye katlanmasıyla oluşur (Gray, 1918). Bu kıvrımlar kafatasının içini bölmelere ayırır. Baş birden hızlanıp yavaşladığında beynin aşırı hareketini azaltır ve onu yerinde tutar (Ishikawa ve ark., 2026). Sert zar hem duyu hem sempatik sinir lifi alır. Çadır üstündeki sert zarın sinirleri esas olarak trigeminal sinirin üç dalından gelir. Bu, özellikle beyin orağı ve beyincik çadırı için geçerlidir (Ishikawa ve ark., 2026). Sert zarı her yanda üç atardamar besler: ön, orta ve arka meningeal arterler. Bu atardamarlar toplardamarlarıyla birlikte sert zarın dış (periostal) yüzünde uzanır, yani kemiğe bakan tarafta (Joost ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın dört kıvrımı',
      sutunlar: ['Kıvrım', 'Latince (TA2)', 'Yeri ve yapısı', 'Sinüsler ve komşuları'],
      satirlar: [
        [
          'Beyin orağı',
          '*Falx cerebri*',
          'En büyük kıvrım. İki yarımkürenin arasındaki yarığa iner. Önde alın kristasına ve horoz ibiğine (*crista galli*), arkada beyincik çadırına tutunur',
          'Üst kenarında (dışa bombeli kenar) üst sagital sinüs, alt kenarında alt sagital sinüs',
        ],
        [
          'Beyincik çadırı',
          '*Tentorium cerebelli*',
          'İkinci büyük kıvrım. Büyük beyin ile beyincik arasında durur, U biçimlidir. Ön-iç kenarında bir çentik vardır: çadır çentiği (*incisura tentorii*)',
          'Çentikten orta beyin geçer. Yan tutunma yerlerinde transvers sinüs uzanır. Beyin orağıyla birleştiği yerde düz sinüs (*sinus rectus*) vardır',
        ],
        [
          'Beyincik orağı',
          '*Falx cerebelli*',
          'Meningeal katmanın ikiye katlanmasıyla oluşur',
          'Arka yapraklarının arasında oksipital sinüs uzanır. Bu sinüsün iki tane olması (ikilenme) gibi farklı biçimleri bilinir',
        ],
        [
          'Sella diyaframı',
          '*Diaphragma sellae*',
          'Türk eyerinin (sella) üstünde durur. Öteki kıvrımlardan farklı olarak tek katlı bir sert zar yaprağıdır',
          'Türk eyerini her zaman tam örtmez. Olguların %39’unda 5 mm ya da daha geniş bir açıklık vardır',
        ],
      ],
      not: 'Kaynaklar: Ishikawa ve ark. (2026); Gray (1918); FIPAT (2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Örümcek ağı zar ve yumuşak zar.** Örümcek ağı zarın iki katmanı vardır. Dıştaki katmana **araknoid engel hücre katmanı** denir. Bu katmanın hücreleri, **sıkı bağlantılarla** (*tight junction*) birbirine kenetlenmiştir. Bu bağlantılar yaygın ve kesintisizdir. İçteki katman ise subaraknoid aralığa uzanan araknoid trabeküllerdir (Castro Dias ve ark., 2019). Örümcek ağı zarın damarsız dış örtüsüne araknoid epiteli denir. Bu örtü, beynin **üçüncü engeli** sayılır. Öteki ikisi kan-beyin engeli ve kan-BOS engelidir (Kadry ve ark., 2020).

Yumuşak zarın hücreleri arasında ise sıkı bağlantı yoktur. Yumuşak zar bu yüzden suda çözünmüş maddeleri durdurmaz (Castro Dias ve ark., 2019). Yumuşak zar ile beyin dokusunun arasında ince bir sınır tabakası vardır: **glia limitans**. Bu tabaka, dokunun bazal zarından ve astrositlerin uç ayakçıklarından oluşur (Castro Dias ve ark., 2019). Yumuşak zar ile örümcek ağı zara birlikte **leptomeninks** (*leptomeninges*), yani “ince zarlar” denir (Pietilä ve ark., 2023).

**Sarnıçlar.** Beynin tabanında örümcek ağı zar, yumuşak zardan yer yer epey uzaklaşır. Aradaki bu geniş yerlere **subaraknoid sarnıçlar** denir; sarnıç, su biriken yer demektir. Sarnıçlar birbiriyle serbestçe bağlantılıdır (Gray, 1918). Örneğin **interpedinküler sarnıç** (*cisterna interpeduncularis*) beyin saplarını (*pedunculi cerebri*) sarar. Willis halkası da bu sarnıcın içindedir (Gray, 1918). Bir de büyük sarnıç vardır. Eski adı *cisterna magna*’dır. TA2’deki adı ise *cisterna cerebellomedullaris posterior*’dur (FIPAT, 2019).

**Omurilikte.** Subaraknoid aralık, onu saran sert zar kesesiyle birlikte aşağıda biter. Bitiş yeri 2. sakral (sağrı) omur dolayıdır. Gray (1918) bu hizayı omurun alt kenarı olarak verir. Bir çalışmada 635 erişkinin MR’ına bakıldı. Kesenin ortalama bitiş yeri 2. sakral omurun üst üçte biriydi. Bu yer kişiden kişiye değişiyordu: en yukarıda 3. bel omurunun alt üçte biri, en aşağıda 5. sakral omurun üst üçte biri (Soleiman ve ark., 2005).

Omurilik belin alt bölümüne kadar uzanmaz. Bu yüzden BOS belin alt bölümünden alınabilir. İğne sert zarı ve örümcek ağı zarı geçerek sıvıya ulaşır. Bu işleme **lomber ponksiyon** denir (OpenStax 13.3). Omurilikte sert zar ile omurga kanalının duvarı arasında gerçek bir **epidural aralık** vardır. İçinde gevşek bağ dokusu ve bir toplardamar ağı bulunur (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zarların arasındaki aralıklar: hangisi gerçekten var?',
      sutunlar: ['Aralık', 'Latince (TA2)', 'Sağlıklı insanda', 'İçinde ne var? Klinikte anlamı ne?'],
      satirlar: [
        [
          'Kafa içi epidural aralık',
          '*Spatium epidurale craniale*',
          'Yok. Sert zar kafatasına yapışıktır. Aralık ancak travma ya da hastalıkla açılır',
          'Meningeal arterler ve toplardamarları sert zarın kemiğe bakan dış yüzünde uzanır',
        ],
        [
          'Subdural aralık',
          '*Spatium subdurale*',
          'Yok. TA2 bu aralığı “sabit olmayan” diye işaretler. Güncel görüşe göre sert zarın en iç katmanında (dural sınır hücre katmanı) açılan bir yarıktır',
          'Uzun süren (kronik) subdural kan birikimi (hematom) bu yarıkta gelişir. Beyin orağı, subdural hematomu normalde tek yarımkürede tutar',
        ],
        [
          'Subaraknoid aralık',
          '*Spatium subarachnoidale*',
          'Var',
          'Dolaşan BOS. Beynin tabanında sarnıçlar. İnterpedinküler sarnıçta Willis halkası',
        ],
        [
          'Omurilik epidural aralığı',
          '*Spatium epidurale spinale*',
          'Var',
          'Gevşek bağ dokusu ve toplardamar ağı. Kafa içindeki karşılığı, endosteal ve meningeal katmanların arasındaki düzlem (interdural düzlem) sayılabilir',
        ],
      ],
      not: 'Kaynaklar: FIPAT (2019); Ishikawa ve ark. (2026); Joost ve ark. (2026); Gray (1918). Kitaplar bu konuda farklı anlatır. Gray (1918) kafa içinde epidural aralık tanımlamaz. Sert zarın kemiğe sıkıca yapıştığını yazar. Subdural aralığı ise doğal bir aralık gibi anlatır: omurilikte ona “potansiyel boşluk” der, kafada BOS yollarının bir parçası sayar. Bazı güncel ders kitapları (Dafny, 2020) iki aralığı da doğal bir aralık gibi tanımlar. Biri kafatası ile sert zar arasındaki epidural aralıktır. Öteki sert zar ile örümcek ağı zar arasındaki subdural aralıktır. Bu ders, TA2’nin notunu ve güncel anatomi çalışmalarını esas alır.',
    },
    {
      tur: 'animasyon',
      ad: 'kafa-ici-kanamalar',
      duzey: 'lisans',
      baslik: 'Katmanlar ve kafa içindeki üç kanama',
      aciklama:
        'Kafatasının yanından alınmış şematik bir kesit. Önce katmanları tanı. Sonra bir kanama seç ve kanın hangi düzlemde toplandığını izle. Çizim, subdural kanamayı sert zar ile örümcek ağı zarın arasında gösterir. Yukarıdaki tabloda anlatıldığı gibi, bu düzlem aslında sert zarın en iç hücre katmanında açılan bir yarıktır. Çizimdeki kanama bilgilerinin kaynakları: Stalons ve ark. (2022); Shetty ve ark. (2016); Nouri ve ark. (2021); Griswold ve ark. (2022); NINDS (2026a). Kanamaların ayrıntısı Beyin zarları dersinde.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sert zarın katmanları ve cerrahi düzlemler',
      md: `- **Dural sınır hücre katmanı** 10 μm’den incedir. Bu katmanda 3–8 sıra yassı hücre bulunur; hücreler bağ dokusu hücrelerine (fibroblast) benzer. Katman kırılgandır. Küçük bir travmanın ya da cerrahinin kesme kuvveti onu yarabilir. Klinikte “subdural aralık” diye görülen şey, sert zarın içinde açılan bu yarıktır. Bu yüzden sağlıklı insanda (normal fizyolojide) subdural aralık yoktur (Ishikawa ve ark., 2026).
- **Kronik subdural hematom:** Yarılmış katmanda kanama tekrar tekrar olur. Süregen bir iltihap da eklenir. Bu ikisi lifli zarlar oluşturur. Sonunda uzun süren bir kan birikimi, yani kronik subdural hematom gelişir (Ishikawa ve ark., 2026).
- **Epidural düzlemler:** Omurilikteki epidural aralık, kafa içindeki “interdural” aralığın karşılığı sayılabilir. İnterdural aralık, endosteal ve meningeal katmanların arasındaki düzlemdir (Ishikawa ve ark., 2026).
- **Arka çukurun sert zarı**, yani kafatası tabanının arka bölmesini döşeyen sert zar, C1–C3 dallarından ve sempatik liflerden sinir alır. Bu lifler kafatasına üç yerden girer: büyük delik (foramen magnum), hipoglossal kanal ve juguler delik (Ishikawa ve ark., 2026).
- **Sella diyaframı** tek katlı bir sert zar yaprağıdır. Olguların %39’unda bu yaprakta 5 mm ya da daha geniş bir açıklık vardır. Olguların %10’unda ise diyafram o kadar incedir ki Türk eyerinin içi yukarıdan görülür. Bu açıklığın hastalık düzeyinde genişlemesine **boş sella sendromu** denir. Bunu ilk kez 1951’de Busch tanımlamıştır (Ishikawa ve ark., 2026). Kaynaklar burada ayrılır. Gray, dört kıvrımın da meningeal katmanın ikiye katlanmasıyla oluştuğunu yazar (Gray, 1918). Diyaframın tek katlı olduğu ise güncel kaynağın bilgisidir.
- **Oksipital sinüs**, beyincik orağının arka yaprakları arasında uzanır. İki tane olması (ikilenme) gibi farklı biçimleri bilinir (Ishikawa ve ark., 2026).
- İnsanda **Liliequist zarları**, beyin tabanındaki sarnıçları bölmelere ayırır. Ama bu bölmeler tam kapalı değildir (Neuhuber, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Dördüncü bir zar mı? SLYM tartışması',
      md: `2023’te bir grup, fare ve insan beyninde **dördüncü bir zar** tanımladı. Bu zar subaraknoid aralığı bölmelere ayırıyordu. Grup ona **SLYM** adını verdi: subaraknoid lenfatik benzeri zar. Tanımlayanlara göre SLYM mezotele benzer; mezotel, vücut boşluklarını döşeyen ince örtüdür. SLYM damarları sarar ve bağışıklık hücreleri taşır (Møllgård ve ark., 2023).

Aynı grup farede bir izlem çalışması yaptı. SLYM, omurilikte ve dorsal kabuğun (kabuğun üst yüzü) bir kısmında araknoid engel katmanıyla kaynaşık görüldü. Beyin sapının tabanında ise 1–3 hücre kalınlığında ayrı bir zardı. Yazarlar bir şeyi de kabul eder: klasik elektron mikroskobu yayınlarında SLYM’e **iç (retiküler) araknoid** denir (Plá ve ark., 2023).

Bir derlemeye göre farede SLYM’in kalınlığı 14,2 ± 0,5 μm’dir. Yani sert zardan incedir. Derleme onu yarı geçirgen bir engel olarak aktarır: 3 kilodaltondan büyük molekülleri sınırlar. Kilodalton, molekül kütlesinin birimidir. Bu bilgiler esas olarak fareden gelir. İnsandaki karşılığı büyük ölçüde araştırılmamıştır (Zedde ve Pascarella, 2025). Bu derleme eleştirilere yer vermez. Bu yüzden aşağıdaki eleştirilerle birlikte okunmalıdır.

**Eleştiriler.** Neuhuber’e göre ayrı “dış” ve “iç” subaraknoid aralıklar yapay bir görüntü olabilir. Bu görüntü, dokunun tespiti (sabitlenmesi) ve kireçten arındırılması sırasında ortaya çıkabilir. O sırada doku, çevresindeki yoğun sıvı yüzünden su kaybeder (hiperozmotik stres). “Dördüncü zar” da büyük olasılıkla bu işlemle ayrılmış iç araknoidden başka bir şey değildir (Neuhuber, 2024).

Siegenthaler ve Betsholtz da benzer düşünür. Onlara göre öne sürülen zar ayrı bir yapı değildir, örümcek ağı zarın bir parçasıdır. “Dış subaraknoid aralık” ise deney işlemlerinin yarattığı yapay bir subdural aralıktır. SLYM’e verilen engel özelliği de aslında araknoid engel katmanına aittir. Kendi verilerinde Prox1 adlı işaret proteinini taşıyan hücreler iç araknoidde dağınık durur. Bu hücreler ayrı bir zar oluşturmaz. Bu yüzden “SLYM” adını yanıltıcı bulurlar (Siegenthaler ve Betsholtz, 2024). SLYM’i savunanlar ise şunu hatırlatır: zar katmanlarının bilinen bütün histolojik tanımları da tespit edilmiş dokuya dayanır. O dokular da yapay yer değiştirmeye uğramıştır (Plá ve ark., 2024).

**Tek hücre düzeyinde.** Bir çalışma, hücrelerde hangi genlerin çalıştığına bakarak (transkriptom) ince zarlardaki hücreleri ayırdı. Leptomeninkste beş ayrı fibroblast benzeri hücre tipi buldu. Bunları yumuşak zara, iç araknoide, dış araknoid engeline ve dural sınır katmanına bağladı (fare) (Pietilä ve ark., 2023). 2026 tarihli bir derleme ise bu varsayılan dördüncü katmanın hâlâ yoğun biçimde tartışıldığını yazar. Hem var olup olmadığı hem de görevi tartışılmaktadır (Joost ve ark., 2026). Kısacası “dördüncü zar keşfedildi” demek bugün için erkendir.

**Köprü venlerin kapısı.** Köprü venler, beyin yüzeyinden sert zar sinüslerine uzanan toplardamarlardır. Bir fare çalışmasında, köprü venlerin araknoid engeli geçtiği yerlerde engelde kesintiler bulundu. Bunlara **araknoid manşet çıkış noktaları** adı verildi. Sağlıklı gönüllülerde de MR’da görünen izleyici maddeler köprü venler boyunca subaraknoid aralığa benzer biçimde geçti (Smyth ve ark., 2024).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Altı hafta önceki küçük çarpma',
      oyku: `79 yaşında bir adam, altı hafta önce evde başını kapı pervazına hafifçe çarpmış. O gün hiçbir yakınması olmamış. Son iki haftada baş ağrısı ve dalgınlığı giderek artmış. BT’de sol yarımkürenin dış yüzünü örten bir sıvı toplanması görülüyor. Sıvı orta hattı geçmiyor. İçinde ince, zar benzeri bölmeler var.`,
      soru: 'Kan hangi düzlemde toplanmıştır? Neden kronikleşmiş ve neden karşı yarımküreye geçmemiştir?',
      cozum: `**Düzlem:** Klasik kitaplar bu yeri “subdural aralık” diye anlatır: sert zar ile örümcek ağı zarın arası. Güncel anatomiye göre sağlıklı insanda böyle bir aralık yoktur (FIPAT, 2019; Ishikawa ve ark., 2026). Sert zarın en iç katmanı dural sınır hücre katmanıdır. Bu katman 10 μm’den incedir ve 3–8 sıra yassı hücreden oluşur. Kırılgandır: küçük bir travmanın kesme kuvveti bile onu yarabilir. O zaman klinikte “subdural aralık” diye görülen yarık açılır (Ishikawa ve ark., 2026). Bu yüzden öyküdeki hafif çarpmanın önemsiz görünmesi şaşırtıcı değildir.

**Neden kronikleşir?** Yarılmış katmanda kanama tekrar tekrar olur. Süregen bir iltihap da eklenir. Bunlar lifli zarlar oluşturur ve kronik subdural hematom gelişir (Ishikawa ve ark., 2026). BT’deki ince bölmeler bu zarlara uyar.

**Neden orta hattı geçmez?** Normal koşullarda beyin orağı, subdural hematomu tek yarımkürede tutar (Ishikawa ve ark., 2026). Tanı ve tedavi kararı beyin cerrahisi ekibine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Beyin-omurilik sıvısı ———
    {
      tur: 'metin',
      md: `**Beyin-omurilik sıvısı** berrak ve renksizdir (Tumani ve ark., 2020). %99’u sudur. Kalan %1’inde proteinler, iyonlar, haberci maddeler (nörotransmiterler) ve glikoz bulunur (Khasawneh ve ark., 2018). Ortalama bir yetişkinde herhangi bir anda yaklaşık **150 mL** BOS dolaşır (Khasawneh ve ark., 2018). Oysa günde yaklaşık **500 mL** BOS yapılır (OpenStax 13.3). Daha ayrıntılı sayılar şöyle: dakikada 0,3–0,4 mL, saatte 18–25 mL, günde 430–530 mL (Khasawneh ve ark., 2018).

Demek ki BOS bir günde birkaç kez baştan sona yenilenir. Bir kaynak bunun 24 saatte yaklaşık dört kez olduğunu söyler (Sakka ve ark., 2011). Yapım ve hacim sayılarından hesaplayınca da günde 3–4 kez çıkar.

BOS’un çoğunu **koroid pleksus** (*plexus choroideus*) yapar. Bu damarlı yapı dört karıncığın hepsinde bulunur (OpenStax 13.3; Brinker ve ark., 2014). Sıvının yolu bellidir (Khasawneh ve ark., 2018):

1. Yan karıncıklardan sağ ve sol **karıncıklar arası delikle** (Monro deliği; *foramen interventriculare*) üçüncü karıncığa geçer.
2. Oradan **beyin su yoluyla** (Sylvius kanalı; *aquaeductus mesencephali*) dördüncü karıncığa iner.
3. Dördüncü karıncıktan iki tür açıklıkla subaraknoid aralığa çıkar: yanlardaki **Luschka** (*apertura lateralis ventriculi quarti*) ve ortadaki **Magendie** (*apertura mediana ventriculi quarti*) açıklıkları.

Klasik anlatıma göre BOS sonunda kana geri döner. Bunu **araknoid granülasyonlar** (*granulationes arachnoideae*) sağlar. Bunlar, örümcek ağı zarın sert zar sinüslerinin içine uzanan çıkıntılarıdır (OpenStax 13.3). BOS bu yolculuk boyunca hücrelerin çıkardığı atıkları (metabolik atıklar) da alır. Onları merkezî sinir sisteminin dışına taşır (OpenStax 13.3).`,
    },
    {
      tur: 'sahne',
      baslik: 'Karıncık sistemi',
      aciklama:
        'Beyin yarı saydam yapıldı; içteki karıncıklar renkli. Renkler şöyle: mavi yan karıncıklar, sarı karıncıklar arası delik (Monro), turkuaz üçüncü karıncık, mor beyin su yolu (Sylvius), pembe dördüncü karıncık. BOS bu sırayla akar. Dördüncü karıncıktan da subaraknoid aralığa çıkar. Karıncıklardaki sıvı, toplam BOS’un küçük bir bölümüdür. Çoğu beynin dışındaki aralıklardadır.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'karincik'],
        renk: 'bolge',
        saydam: ['katman:kabuk', 'katman:sap'],
        gizle: ['bolge:sinir'],
        vurgula: ['katman:karincik'],
        boya: [
          { secici: ['yan-karincik'], renk: '#4f8de0' },
          { secici: ['karinciklar-arasi-delik'], renk: '#f2b544' },
          { secici: ['ucuncu-karincik'], renk: '#25b9a3' },
          { secici: ['beyin-su-yolu'], renk: '#8a6fd8' },
          { secici: ['dorduncu-karincik'], renk: '#ee6a92' },
        ],
        bakis: 'egik',
        etiketler: [
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
          { yapi: 'karinciklar-arasi-delik', metin: 'Monro deliği' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'beyin-su-yolu', metin: 'Beyin su yolu' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla beyin-omurilik sıvısı',
      ogeler: [
        { deger: '~150', birim: 'mL', aciklama: 'Yetişkinde herhangi bir anda dolaşan BOS (kaynaklarda 90–150 mL).' },
        { deger: '~500', birim: 'mL/gün', aciklama: 'Günlük yapım: dakikada 0,3–0,4 mL, günde 430–530 mL.' },
        { deger: '3–4', birim: 'kez/gün', aciklama: 'BOS bir günde bu kadar kez baştan sona yenilenir.' },
        { deger: '%99', aciklama: 'BOS’taki suyun payı. Kalan %1 protein, iyon, haberci madde ve glikozdur.' },
      ],
      not: 'Kaynaklar: Khasawneh ve ark. (2018); Brinker ve ark. (2014); OpenStax 13.3; Sakka ve ark. (2011).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Araknoid granülasyonlar bebeklikte görülmez. Üç yaşından önce çok seyrektir. Genellikle yedi yaşından sonra bulunur. Yaş ilerledikçe hem sayıları hem boyları artar (Gray, 1918). Doğumda tam gelişmemiş oldukları için bebekte BOS’un emilmesi başka bir yola dayanır. Bu iş daha çok sert zarın iç yüzündeki toplardamar ağına düşer. Bu ağ bebekte daha gelişkindir (Khasawneh ve ark., 2018).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**BOS:** Her an ~150 mL vardır. Günde ~500 mL yapılır ve günde 3–4 kez yenilenir. Berrak, renksiz ve %99’u sudur.

**Yol:** yan karıncık → Monro deliği → üçüncü karıncık → beyin su yolu (Sylvius) → dördüncü karıncık. Sonra Luschka (yanlar) ve Magendie (orta) açıklıklarından subaraknoid aralığa çıkar. Klasik görüşe göre oradan araknoid granülasyonlarla sert zar sinüslerine geçer.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hacim.** Derlemelere göre yetişkinde toplam BOS hacmi 90–150 mL arasındadır (Brinker ve ark., 2014). Bunun yaklaşık %17’si karıncıklardadır. Kalanı sarnıçlarda ve subaraknoid aralıktadır (Khasawneh ve ark., 2018). Bir başka kaynak bunu mililitreyle verir: 150 mL’nin 25 mL’si karıncıklarda, 125 mL’si subaraknoid aralıklardadır (Sakka ve ark., 2011). Yani BOS’un çoğu karıncıkların içinde değildir. Çoğu, beynin ve omuriliğin çevresindedir.

**Koroid pleksusun payı.** Geleneksel anlatıma göre BOS’un çoğunu koroid pleksus salgılar. Kalanını beyin dokusu gibi başka kaynaklar ekler. Ama bu pay kaynaktan kaynağa değişir. Bir kaynak %75 der (Khasawneh ve ark., 2018). Bir başkası %80 der (Brinker ve ark., 2014). 1996’daki klasik derlemede ise pay şöyle bölünür: %90 koroid pleksus, %10 doku arası sıvı. Bu doku arası sıvı kan-beyin engeli boyunca salgılanır (Hladky ve Barrand, 2014). Bu yüzden tek bir yüzdeyi kesin bilgi gibi ezberleme. “Çoğunu koroid pleksus yapar” demek doğrudur. Yan karıncıkta koroid pleksus, orta kısmın tabanından başlar. Oradan temporal (şakak) boynuza uzanır. Ön ve arka boynuzlarda bulunmaz (MacAulay ve ark., 2022).

**Süzülme değil salgı.** Bazı ders kitapları BOS’u, kanın “süzülmesiyle” oluşmuş gibi anlatır. Bu işi de karıncıkları döşeyen ependim hücrelerine verir (OpenStax 13.3). Güncel derleme ise başka bir şey söyler. BOS, kan sıvısının (plazmanın) süzüntüsü, yani ultrafiltratı değildir. Etkin bir sıvı salgısıyla oluşur. Karıncıkları döşeyen ependim duvarı salgı yapmaz. Yetişkinde bir difüzyon engeli de değildir; yani maddelerin kendiliğinden yayılmasını durdurmaz (MacAulay ve ark., 2022). Koroid pleksusun epitel hücreleri, tepe yüzlerinde birbirine sıkı bağlantılarla kenetlenir. Bu kenet **kan-BOS engelini** kurar (Khasawneh ve ark., 2018).

**Akışı ne sürer?** BOS’u karıncıklar boyunca dört şey iter:

- Sürekli yapımdan doğan sıvı basıncı (hidrostatik basınç).
- Atardamar atımları.
- Solunum döngüsü.
- Ependim hücrelerinin kirpiklerinin hep aynı yöne çırpması (MacAulay ve ark., 2022).

Yapıldığı yerden emildiği yere akışın büyük kısmı ise atardamar nabız dalgasına bağlıdır (Sakka ve ark., 2011). Klasik anlayış bu akıma **“üçüncü dolaşım”** der (Brinker ve ark., 2014). Sıvı dördüncü karıncıktan omuriliğin merkez kanalına da inebilir. Ama bu kanal kör bir çıkmazdır (OpenStax 13.3).

**Emilim.** Gray’in anlatımına göre BOS esas olarak araknoid villuslardan büyük sert zar sinüslerine hızla boşalır. Küçük bir kısmı da yavaşça gerçek lenf damarlarına geçer (Gray, 1918). Güncel bir derleme de benzer bir yol yazar. BOS’un bir kısmı, kafa sinirlerinin çevresindeki aralıklar boyunca boyun lenf damarlarına akar (Brinker ve ark., 2014).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Normal BOS: başvuru değerleri',
      sutunlar: ['Ölçüm', 'Başvuru değeri', 'Açıklama'],
      satirlar: [
        ['Görünüm', 'Berrak, renksiz', 'Gözle değerlendirilir'],
        ['Çekirdekli hücre', 'Mikrolitrede 5’ten az', 'Lenfosit ve monosit (iki tür akyuvar). Oranları 2:1 ile 3:1 arası'],
        ['Toplam protein', '500 mg/L’den az', 'Sıvının bulanıklığına bakan yöntemlerle ölçülür (nefelometri ya da türbidimetri)'],
        ['Glikoz', 'BOS/serum oranı 0,50’nin üstünde', 'BOS’taki glikoz, kandaki (serumdaki) glikozla karşılaştırılır'],
        ['Laktat', '0,9–2,7 mmol/L', 'Yaşa bağlıdır'],
      ],
      not: 'Kaynak: Tumani ve ark. (2020), “Lomber ponksiyon ve BOS analizi” S1 kılavuzu (kısaltılmış İngilizce sürüm).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Lomber ponksiyonda ne ölçülür?',
      md: `Omurilik belin alt bölümüne kadar inmez. Subaraknoid aralık ise 2. sakral omur dolayına kadar uzanır (OpenStax 13.3; Gray, 1918; Soleiman ve ark., 2005). Bu yüzden iğne belin alt bölümünden girer. Sert zarı ve örümcek ağı zarı geçerek BOS’a ulaşır. İğnenin hizasını ve omuriliğin nerede bittiğini “Omurilik ve omurga” bölümünde anlattık. Alınan sıvının görünümüne, hücrelerine, proteinine, glikoz oranına ve laktatına bakılır. Bunlar başvuru değerleriyle karşılaştırılır (Tumani ve ark., 2020). Ponksiyon sırasında basınç da ölçülebilir. Belden ölçülen BOS basıncının başvuru aralığı, yan yatarken 7,2–16,8 mmHg’dir (Norager ve ark., 2021).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Bir BOS sonucunu okumak',
      oyku: `34 yaşında bir kadın, iki haftadır süren baş ağrısı nedeniyle inceleniyor. Nörolog BOS incelemesi istiyor. Hasta yan yatarken belin alt bölümünden ponksiyon yapılıyor. BOS basıncı 14 mmHg ölçülüyor. Sıvı berrak ve renksiz. Laboratuvar sonucu: mikrolitrede 2 çekirdekli hücre (çoğu lenfosit), toplam protein 380 mg/L, BOS/serum glikoz oranı 0,62, laktat 1,6 mmol/L.`,
      soru: 'İğne neden belin alt bölümünden girildi? Bu sonuçlar başvuru değerlerine göre nasıl yorumlanır?',
      cozum: `**Neden belden?** Omurilik belin alt bölümüne kadar uzanmaz. Subaraknoid aralık ise 2. sakral omur dolayına kadar iner (OpenStax 13.3; Gray, 1918; Soleiman ve ark., 2005). İğne bu düzeyde sert zarı ve örümcek ağı zarı geçer. Böylece omuriliğe değmeden BOS’a ulaşır (OpenStax 13.3).

**Basınç:** Belden ölçülen BOS basıncının başvuru aralığı duruşa göre değişir. Yan yatarken 7,2–16,8 mmHg, sırtüstü yatarken 5,7–15,5 mmHg’dir (Norager ve ark., 2021). Ölçüm yan yatarken yapıldı. Bu yüzden ilk aralık kullanılır. 14 mmHg bu aralığın içindedir. Demek ki bir basınç değeri her zaman ölçüldüğü duruşla birlikte yazılmalıdır.

**Sıvı:** Başvuru değerleri şunlardır:

- Görünüm berrak ve renksizdir.
- Mikrolitrede 5’ten az hücre vardır (2:1–3:1 oranında lenfosit ve monosit).
- Protein 500 mg/L’nin altındadır.
- Glikoz oranı 0,50’nin üstündedir.
- Laktat 0,9–2,7 mmol/L aralığındadır (Tumani ve ark., 2020).

Bu hastanın bütün değerleri bu aralıklar içindedir. Ama normal bir BOS sonucu, baş ağrısının nedenini tek başına açıklamaz ya da dışlamaz. Sonucu hekim yorumlar ve öykü ile muayeneyle birlikte değerlendirir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Hacim:** 90–150 mL. Karıncıklarda ~%17 (ya da 150 mL’nin 25 mL’si). **Yapım:** 0,3–0,4 mL/dk = 430–530 mL/gün. Günde 3–4 kez yenilenir.
- **Koroid pleksus** dört karıncıkta da var; yan karıncığın ön ve arka boynuzunda yok. BOS **etkin salgıdır**, süzüntü (ultrafiltrat) değildir. Ependim salgı yapmaz.
- **Yol:** yan karıncık → Monro → III. karıncık → Sylvius → IV. karıncık → Luschka (yanlar) + Magendie (orta) → subaraknoid aralık. Merkez kanal kör çıkmazdır.
- **Emilim:** Klasik yol araknoid granülasyonlar → sert zar sinüsleri. Ayrıca kafa siniri kılıfları → boyun lenf damarları. Granülasyonlar bebekte yok ya da gelişmemiş.
- **Normal BOS:** berrak, renksiz; <5 hücre/μL; protein <500 mg/L; BOS/serum glikoz >0,50; laktat 0,9–2,7 mmol/L.
- **Subaraknoid aralık**, sert zar kesesiyle birlikte yaklaşık S2 hizasında biter. Kesin yer kaynağa ve kişiye göre değişir: Gray’e göre omurun alt kenarı, MR’da ortalama üst üçte biri. Lomber ponksiyon, omuriliğin inmediği düzeyden yapılır.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'BOS’un klasik ve güncel modelleri',
      md: `- **Klasik model:** BOS’un çoğu koroid pleksusta yapılır. Karıncıklardan subaraknoid aralığa tek yönde akar ve granülasyonlardan emilir. Bu model, Cushing ve Dandy’nin koroid pleksus deneylerine dayanır. Bu deneylerin tasarımı son yıllarda eleştirilmektedir (Khasawneh ve ark., 2018).
- **Orešković–Klarica kuramı:** Bu kurama göre BOS belirli salgı organlarında oluşmaz. Dolaşım yolunun her yerinde sürekli oluşur. Hacmindeki değişiklikleri de BOS’un ozmolaritesi, yani içindeki çözünmüş madde yoğunluğu belirler. Klasik kuramla bağdaşmayan bir gözlem de vardır. Koroid pleksusu çıkarılan hastaların üçte ikisinde hidrosefali (beyinde su birikmesi) yinelemiştir. Bu hastalara yine de şant, yani sıvıyı başka yere akıtan ince bir boru gerekmiştir (Khasawneh ve ark., 2018).
- **Doku arası sıvının payı:** Beyin hücrelerinin arasındaki sıvı (interstisyel sıvı), birçok yerde BOS ile serbestçe karışır. Bu sıvının BOS’a katkısı %10 ile %60 arasında tahmin edilir (Kadry ve ark., 2020). Sağlam kan-beyin engeli boyunca sıvı geri emilemez (Hladky ve Barrand, 2014).
- **Salgının gücü:** Ozmotik fark, suyu bir yandan öbür yana çeken yoğunluk farkıdır. Koroid pleksus epiteli, iki yanı arasında böyle bir fark yokken de sıvı salgılayabilir. Hatta bu farka karşı da salgılayabilir (MacAulay ve ark., 2022). Bir başka derleme ise salgının ilk aşamasını farklı anlatır: pencereli kılcallardan pasif bir süzülme (Khasawneh ve ark., 2018). Bu ders etkin salgı modelini esas alır.
- **Akım mı, çalkantı mı?** Güncel görüşe göre BOS dolaşımı yalnızca yönlü bir akım değildir. Beynin her yerinde ileri-geri atımlı bir hareket de vardır. Kan, doku arası sıvı ve BOS arasında yerel sıvı alışverişi de olur (Brinker ve ark., 2014). Bir grup, iki yaşından küçük çocuklarda beyin su yolunda ters akım bildirmiştir. Grup, bunun bu yaş için olağan olabileceğini öne sürmüştür (Hladky ve Barrand, 2014).
- **Sayılar kaynağa göre değişir:** 1996’daki klasik derlemede insanda günlük yapım yaklaşık 400 mL kabul ediliyordu (Hladky ve Barrand, 2014). Güncel bir derleme 430–530 mL verir (Khasawneh ve ark., 2018). Bir kafa içi basıncı derlemesi ise BOS hacmini yaklaşık 75 mL olarak verir (Wilson, 2016). Bu sayı, öteki kaynakların 90–150 mL’sinden çok düşüktür. Derleme neyi ölçtüğünü de tanımlamaz. Bu yüzden toplam hacim için kullanılmamalıdır.
- **Türkiye’den bir seri ve bir birim sorunu:** Bolu’da (Abant İzzet Baysal Üniversitesi) 236 hastada MR ile BOS hacmi ölçülmüş. Hastalar 45 yaş üstüydü ve inme öyküleri yoktu. Hepsinin MR’ında beyaz cevherde parlak lekeler (beyaz cevher hiperintensitesi) vardı. Lekelerin derecesi Fazekas puanıyla gruplanmış. Ortanca (medyan) hacim Fazekas 0–1 grubunda 119, Fazekas 2–3 grubunda 193 bulunmuş. Makalede birim “mm³” yazılmıştır (Kalfaoglu ve ark., 2025). Bu sayılar mm³ olamaz: 119 mm³ yaklaşık 0,12 mL’dir. Ayrıca örneklem sağlıklı insanlardan oluşmaz. Bu yüzden seri bir norm olarak kullanılamaz.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**BOS nereden çıkar? Hayvanda ve insanda farklı.** Deney verileri, BOS’un lenf sistemine çıkışı için üç önemli yol gösterir:

- kafa ve omurilik sinirlerinin kılıfları,
- kalbur kemiğinin delikli levhası (kribriform plak),
- beyin atardamarlarının dış katmanı (adventisya) (Sakka ve ark., 2011).

Kemirgenlerde emilim esas olarak kafa sinirlerinin kılıfları boyunca olur. Bunların başında görme ve koku sinirleri gelir. Koku sinirinde sıvı kribriform plaktan geçer. Sıvı sonunda kafatası dışındaki lenf düğümlerine ulaşır (MacAulay ve ark., 2022). Tavşan ve koyun modellerinde de BOS’un önemli bir kısmının boyun lenf damarlarıyla emilebildiği gösterilmiştir (Khasawneh ve ark., 2018).

İnsanda ise canlıda yapılan bir çalışma farklı bir sonuç buldu. BOS’a izleyici madde verildi, ama kribriform plaktan burun mukozasına bir çıkış görülmedi. İzleyicinin BOS’tan temizlenmesi insanda günler, sıçanda birkaç saat sürer (Ringstad ve Eide, 2024). Kemirgen bulgularını insana taşırken bu farkı akılda tut.

**Yaşlanma.** Yaş ilerledikçe BOS daha yavaş yenilenir. Bu yüzden yıkım ürünleri beyinde ve BOS’ta birikir. Bu ürünler, sinir hücrelerinin yavaş yavaş yıkıldığı bazı hastalıklarda (nörodejeneratif hastalıklar) da görülür (Sakka ve ark., 2011).`,
    },

    // ——— Atık temizliği: glimfatik hipotez ve menenjiyal lenf damarları ———
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '“Beyin uykuda yıkanır” haberleri',
      md: 'Farelerde yapılan bazı çalışmalar, beyindeki atık temizliğinin uykuda hızlandığını öne sürdü (Bohr ve ark., 2022). 2024’teki başka bir fare çalışması ise tersini buldu. Temizlik uykuda ve anestezide artmamış, tersine belirgin biçimde azalmıştı (Miao ve ark., 2024). Konu tartışmalıdır ve verilerin çoğu farelerden gelir. “Beyin her gece yıkanır” cümlesi bugün kanıtlanmış bir bilgi değildir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beyin atıklarını nasıl temizler?** Klasik yanıt BOS’tur. Bu sıvı sinir dokusunun metabolik atıklarını alır ve merkezî sinir sisteminin dışına taşır (OpenStax 13.3).

2012’de bir kemirgen çalışması daha ayrıntılı bir düzen önerdi. Beyin dokusuna dalan atardamarların çevresinde ince aralıklar vardır: **damar çevresi (paravasküler) aralıklar**. Bu öneriye göre BOS bu aralıklar boyunca dokuya girer. Doku arası sıvı da toplardamarların çevresindeki yollarla temizlenir (Iliff ve ark., 2012; Bohr ve ark., 2022).

Bu düzen, astrositlerdeki su kanallarına bağlı görünüyordu. Bu kanalların adı **aquaporin-4**’tür (AQP4). Düzen, işlev bakımından vücudun lenf sistemine de benziyordu. Bu iki nedenle ona **glimfatik sistem** adı verildi (Bohr ve ark., 2022). Ad, “glia” ve “lenfatik” sözcüklerinden gelir. Fikri savunan grup da bir şeyi kabul eder: beyne yeni bir “tesisat sistemi” eklemek tartışma yaratmıştır (Mestre ve ark., 2020). Bugün glimfatik sistem kanıtlanmış bir anatomik sistem değildir. Tartışılan bir **hipotezdir** ve büyük kısmı kemirgen verisine dayanır.

İkinci gelişme daha sağlam bir zemine oturur: beyin zarlarındaki lenf damarları, yani **menenjiyal lenf damarları**. 2015’te iki bağımsız grup, farede beyin zarlarında lenf damarları gösterdi (Ishikawa ve ark., 2026). Bu damarlar, lenf damarlarının iç yüzeyini döşeyen hücrelerin (endotel) bütün moleküler işaretlerini taşır. BOS’tan hem sıvı hem bağışıklık hücresi taşıyabilir. Boyundaki derin lenf düğümlerine bağlanır (Louveau ve ark., 2015). Bu damarlar insanda ve marmoset maymununda da gösterildi. Yüksek çözünürlüklü klinik MR ile canlıda görüntülendi. Primatlarda da sert zar toplardamar sinüslerinin yanında uzanırlar. Yani kemirgenlerdeki düzeni tekrarlarlar (Absinta ve ark., 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Glimfatik hipotez: lehte, aleyhte; lenf damarlarının sınırı',
      md: `- **Lehte:** Bazı deney hayvanlarının astrositlerinde aquaporin-4 yoktu. Bu hayvanlarda BOS girişi yavaşladı. Doku arası madde temizliği de yaklaşık %70 azaldı (Iliff ve ark., 2012). Savunan grup eski bir gözlemi de hatırlatır. Atardamar çevresinden BOS girişini ve toplardamar çevresinden çıkışı, 1985–1990’da Rennels ve arkadaşları da tanımlamıştı. Ama o dönem bu bulgu, doku hazırlığının yarattığı yapay bir görüntü sayılıp reddedilmişti (Bohr ve ark., 2022). Aynı gruba göre damar çevresinden giriş ve temizlik uykuda daha hızlıdır. Günlük ritimle (sirkadiyen ritim) de düzenlenir (Bohr ve ark., 2022).
- **Aleyhte:** 2024’te bir fare çalışmasında beyin temizliği uykuda ve anestezide artmadı. Tersine belirgin biçimde azaldı (Miao ve ark., 2024). Bağımsız bir test iki şey buldu. Dokudaki madde taşınması bir akımla (konveksiyon) değil, kendiliğinden yayılmayla (difüzyon) uyumluydu. *Aqp4* geninin silinmesi de subaraknoid aralıktan beyne madde taşınmasını bozmadı (fare, sıçan) (Smith ve ark., 2017). Eleştirel bir derlemeye göre maddelerin hem girişinin hem çıkışının atardamar çevresinden olduğuna iyi kanıt vardır. Ama ana çıkışın toplardamar çevresinden olduğuna kanıt yoktur. Dokuda bir akım olsa bile hızı çok küçüktür. Difüzyonun yanında maddeyi etkili biçimde taşıyamaz. Derlemenin sonucu şudur: ne glimfatik hipotez ne de ondan önceki klasik hipotez yeterli bir açıklama verir. İkisi de sıvı ve maddelerin beyne girişini, içinde ilerleyişini ve çıkışını tam açıklayamaz (Hladky ve Barrand, 2022).
- **Menenjiyal lenf damarlarının tarihi:** 18. yüzyılın sonunda Paolo Mascagni beyin zarlarında lenf damarları tanımlamıştı. Ama bu bulgu sonraki yüzyıllarda kabul görmedi (Aspelund ve ark., 2015).
- **Yapı var, işlev ne kadar?** İnsanda “yapının varlığı” ile “işlevin ölçülmesi” ayrı tutulmalıdır (Ishikawa ve ark., 2026). Bir insan çalışmasında BOS’a izleyici madde verildi. İzleyici 48 saat boyunca BOS’tan sagital sinüs çevresindeki sert zara doğrudan geçti. Ama hiçbir boru biçimli yapıda toplanmadı. Yalnızca yaygın bir boyanma oldu (Ringstad ve Eide, 2024). Yine de bu damarların keşfi, merkezî sinir sistemiyle ilgili birçok anlayışı değiştirmiştir: sıvı alışverişi, atık temizliği, bağışıklık hücrelerinin trafiği ve “bağışıklık ayrıcalığı” (Salvador ve ark., 2024).`,
    },

    // ——— Kan-beyin engeli ve sirkumventriküler organlar ———
    {
      tur: 'metin',
      md: `Kandaki her şey beyne giremez. 1880’lerde Paul Ehrlich toplardamardan bazı boyalar verdi. Boyalar beyin ve omurilik dışındaki bütün organları boyadı (Dash, 2026). Bunun nedeni **kan-beyin engelidir**. Beyin kılcallarının duvarı, kandaki maddelerin çoğunu geri çevirir.

Ama bazı maddeler kolayca geçer. Oksijen kandan beyne, karbondioksit de beyinden kana hızla ve serbestçe geçer (Kadry ve ark., 2020). Glikoz ve amino asitler de geçebilir. Glikoz, beynin başlıca enerji kaynağıdır. Başka maddelerin çoğu ise geçemez. Vücudun başlıca savunma hücrelerinden olan akyuvarlar bile geçemez (OpenStax 12.2).

Bu seçicilik beyni korur, ama ilaçla tedaviyi zorlaştırır. Parkinson hastalığı buna bir örnektir. Bu hastalara dopaminin kendisi verilmez. Onun öncülü, yani vücutta dopamine dönüşen **L-DOPA** verilir. Çünkü L-DOPA, engeldeki bir taşıyıcıya (L tipi taşıyıcı) bağlanabilir (Dash, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Beynin pencereleri',
      md: 'Kan-beyin engeli her yerde aynı değildir. Karıncıkların çevresinde birkaç küçük bölge vardır. Bu bölgelerde kılcalların duvarında küçük delikler (pencereler) bulunur ve engel yoktur (Castro Dias ve ark., 2019). Bu bölgelerin bir kısmı kanı izler: iyonları, çözünmüş madde yoğunluğunu (ozmolalite), asitliği (pH) ve bazı peptitleri. Bir kısmı da kana nöropeptit ya da melatonin salar. Karıncıkların çevresinde bulundukları için bunlara **sirkumventriküler organlar** denir: “karıncık çevresi organlar”. Kandaki maddeleri algılayıp kana salgı yapabildikleri için de “beynin pencereleri” diye anılırlar (Miyata, 2022).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Keşif.** 1913’te Ehrlich’in çalışma arkadaşı Edwin Goldmann aynı boyaları bu kez doğrudan BOS’a verdi. Bu kez sinir dokusu boyandı, öteki dokular boyanmadı (Dash, 2026; Kadry ve ark., 2020). Demek ki engel kan ile beyin arasındaydı.

**Üç arayüz.** Beyin kandan üç ayrı arayüzle (sınırla) ayrılır:

- beyin kılcallarındaki **kan-beyin engeli**,
- koroid pleksustaki **kan-BOS engeli**,
- beyin zarlarındaki **araknoid engel** (Kadry ve ark., 2020).

Koroid pleksusun kılcalları pencerelidir ve kandan gelen moleküllerin geçişine izin verir. Bu yüzden orada engeli damar kurmaz. Engeli, damarı saran epitel hücreleri kurar (Castro Dias ve ark., 2019).

**Kan-beyin engelinin yapısı.** Engelin asıl yeri, beyin kılcallarının iç yüzünü döşeyen **endotel hücreleridir**. Komşu hücrelerle etkileşim ise engelin gelişmesi için gerekli görünür (Dash, 2026). Beyin endotelinde pencere yoktur. Hücreler birbirine kesintisiz ve karmaşık **sıkı bağlantılarla** bağlanır. Bu bağlantılar, hücrelerin arasından serbest geçişi önler. Küçük keseciklerle taşıma (pinositoz) da vücudun öteki damarlarına göre çok azdır (Castro Dias ve ark., 2019). Engeli endotelin üç özelliği birlikte kurar: fiziksel, taşıyıcı ve metabolik özellikleri (Daneman ve Prat, 2015). Kılcalın dış yüzünün yaklaşık %99’unu **astrositlerin uç ayakçıkları** örter (Kadry ve ark., 2020). Bütün bu yapılara birlikte **nörovasküler birim** denir. Birimde endotel, bazal zar, bazal zara gömülü **perisitler**, astrositler, mikroglia ve nöronlar bulunur (Kadry ve ark., 2020).

**Kim geçer, kim geçemez?** Yağda çözünen birçok molekül engelden kendiliğinden (pasif olarak) geçebilir (Kadry ve ark., 2020). Glikoz ise bir taşıyıcıyla girer. Bu taşıyıcının adı **GLUT-1**’dir ve engelin endotelinde çok boldur (Castro Dias ve ark., 2019). Ters yönde çalışan bir pompa da vardır: **P-glikoprotein**. Bu pompa, zararlı olabilecek yağda çözünen molekülleri beyinden kana geri atar (Castro Dias ve ark., 2019). Sonuçta engel, büyük moleküllü ilaçların neredeyse tamamını beyne sokmaz. Küçük moleküllü ilaçların da %98’inden fazlasını sokmaz (Pardridge, 2005).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kan ile beyin arasındaki arayüzler',
      sutunlar: ['Arayüz', 'Yeri', 'Engeli kuran', 'Ayrıntı'],
      satirlar: [
        [
          'Kan-beyin engeli',
          'Beyin kılcalları',
          'Endotel hücreleri. Pencere yok, sıkı bağlantılar kesintisiz, kesecikle taşıma (pinositoz) az',
          'Astrosit ayakçıkları kılcal yüzünün ~%99’unu örter. Perisitler bazal zara gömülüdür',
        ],
        [
          'Kan-BOS engeli',
          'Koroid pleksus',
          'Epitel hücreleri ve tepe yüzlerindeki sıkı bağlantılar',
          'Kılcallar pencerelidir. Engeli damar değil, epitel kurar',
        ],
        [
          'Araknoid engel',
          'Sert zarın hemen altı',
          'Araknoid engel hücreleri. Aralarında yaygın, kesintisiz sıkı bağlantılar var',
          'Damarsızdır. “Üçüncü engel” sayılır',
        ],
        ['Yumuşak zar (engel değil)', 'Beyin yüzeyi', '—', 'Hücreleri arasında sıkı bağlantı yoktur. Çözünmüş maddeleri durdurmaz'],
        [
          'Sirkumventriküler organlar (engel yok)',
          'Karıncıkların çevresi',
          '—',
          'Kılcallar pencerelidir. Kandaki maddeler özel nöronlara ulaşır. Bu nöronların sinir-hormon ve duyu işlevi vardır',
        ],
      ],
      not: 'Kaynaklar: Kadry ve ark. (2020); Castro Dias ve ark. (2019); Dash (2026); Khasawneh ve ark. (2018); Miyata (2022).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sirkumventriküler organlar',
      sutunlar: ['Organ', 'Latince (TA2)', 'Grup'],
      satirlar: [
        ['Lamina terminalisin damarlı organı (OVLT)', '*Organum vasculosum laminae terminalis*', 'Duyusal'],
        ['Subfornikal organ', '*Organum subfornicale*', 'Duyusal'],
        ['Area postrema', '*Area postrema*', 'Duyusal'],
        ['Median eminens', '*Eminentia mediana*', 'Salgı'],
        ['Nörohipofiz', '*Neurohypophysis*', 'Salgı'],
        ['Epifiz', '*Glandula pinealis*', 'Salgı'],
        ['Koroid pleksus', '*Plexus choroideus*', 'Miyata’nın listesinde var. BOS’u yapar'],
        [
          'Subkomissural organ',
          '*Organum subcommissurale*',
          'TA2 bunu üçüncü karıncığın çevresindeki (periventriküler) organlar arasında sayar. Miyata’nın listesinde yok',
        ],
      ],
      not: 'Duyusal organlar kanı izler: iyonları, ozmolaliteyi, pH’yi, bazı amino asitleri ve nöropeptitleri. Salgı organları ise nöropeptit ya da melatonin salar (Miyata, 2022). Latince adlar: FIPAT (2019).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Beynin pencereleri: karıncıkların çevresi',
      aciklama:
        'Sağ yarı kaldırıldı. Sol yarıya içeriden bakıyoruz; yüz sağda. Kabuk ve beyin sapı yarı saydam. Turkuaz: üçüncü karıncık, beyin su yolu ve dördüncü karıncık. Sarı: epifiz ve hipofiz bezi. Sirkumventriküler organlar, karıncıkların çevresindeki küçük bölgelerdir. Modelde bunlardan yalnızca epifiz ve hipofiz bezi ayrı yapı olarak bulunur. Hipofiz bezinin yalnızca bir kısmı bu gruba girer: nörohipofiz (arka lob ve hipofiz sapı). Modelde ise bez tek parça olarak durur. Hipotalamus yön bulmak için işaretlendi.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'karincik', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        saydam: ['katman:kabuk', 'katman:sap'],
        vurgula: ['epifiz', 'hipofiz', 'hipotalamus', 'ucuncu-karincik', 'beyin-su-yolu', 'dorduncu-karincik'],
        boya: [
          { secici: ['epifiz', 'hipofiz'], renk: BEZ },
          { secici: ['ucuncu-karincik', 'beyin-su-yolu', 'dorduncu-karincik'], renk: KARINCIK },
        ],
        etiketler: [
          { yapi: 'epifiz' },
          { yapi: 'hipofiz' },
          { yapi: 'hipotalamus' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'İlaçlar, ödem ve engel',
      md: `- **Taşıyıcıdan yararlanmak:** Dopaminin öncülü L-DOPA, engeldeki L tipi taşıyıcıya bağlanabilir. Parkinson hastalarına bu yüzden dopamin yerine L-DOPA verilir (Dash, 2026).
- **Dışarı atılmak:** P-glikoprotein pompası, zararlı olabilecek yağda çözünen molekülleri beyinden kana geri atar (Castro Dias ve ark., 2019). Engel, küçük moleküllü ilaçların %98’inden fazlasını beyne sokmaz (Pardridge, 2005).
- **Suyu çekmek:** Su beyne kolayca girer. **Mannitol** ise engelden zor geçer. Toplardamardan verilen mannitol, ozmoz yoluyla beyinden su çeker. Böylece beyni susuzlaştırır ve kafa içi basıncını düşürür (Dash, 2026).
- **Engel yıkılınca:** Beyin tümörleri engeli yıkar. Bu da tümörün çevresinde ödeme, yani sıvı birikmesine yol açar (Dash, 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Engelin ayrıntısı.** “Kan-beyin engeli” terimini 1898’de Lewandowsky kullanmıştır (Dash, 2026).

Perisitler endotelle aynı bazal zarı paylaşır. Endotelle doğrudan “çivi-yuva” biçiminde temas kurarlar. Bu temaslarda N-kaderin ve konneksin adlı bağlantı molekülleri görev alır. Perisitlerin, düz kas hücrelerine benzeyen kasılma özellikleri vardır. Bu sayede kılcalın çapını ve beyin kan akımını bir ölçüde düzenleyebilirler (Kadry ve ark., 2020).

Engelin toplam yüzeyi de hesaplanmıştır. Bir gram beyin dokusunda 150–200 cm² mikrodamar yüzeyi vardır. Buradan yetişkinde toplam 12–18 m² bulunur (Kadry ve ark., 2020). Beyin mikrodamarları sodyum (Na⁺) ve klorür (Cl⁻) iyonlarını çok az geçirir. Geçirgenlikleri, vücudun öteki mikrodamarlarınınkinden 1000 kattan fazla düşüktür (Hladky ve Barrand, 2014). İlaç tasarımında şu kabul edilir: bazı bileşiklerin merkezî sinir sistemine girişi sınırlıdır. Bunlar, kutupsal yüzey alanı 80 Å²’yi aşan ve altıdan fazla hidrojen bağı kurma eğiliminde olan bileşiklerdir (Kadry ve ark., 2020).

**Pencerelerin de sınırı var.** Sirkumventriküler organların damarları da boyuta göre seçer. Yalnızca molekül ağırlığı 10.000’in altındaki maddeleri geçirir (kemirgen verisi). Bu organların uç bölgelerinde astrositler ve tanisitler (özel bir glia hücresi) yoğun bir engel kurar. Bu engel, kandan gelen maddelerin komşu beyin dokusuna serbestçe yayılmasını önler (Miyata, 2022). Hangi yapının bu gruba girdiği de tanıma bağlıdır. Miyata koroid pleksusu sirkumventriküler organ sayar, ama subkomissural organı saymaz (Miyata, 2022). TA2 ise subkomissural organı üçüncü karıncığın çevresindeki (periventriküler) organlar arasında listeler (FIPAT, 2019).`,
    },

    // ——— Beyin dolaşımı ———
    {
      tur: 'metin',
      md: `Beynin kanını iki çift atardamar getirir: **iç karotis arterler** (*arteria carotis interna*) ve **vertebral arterler** (*arteria vertebralis*) (OpenStax 20.5). İç karotis arter kafatasına şakak kemiğindeki karotis kanalından girer. Vertebral arterler ise kafatasının büyük deliğinden (foramen magnum) girer. İki vertebral arter birleşir ve **baziler arteri** (*arteria basilaris*) yapar. Baziler arter beyin sapına ve beyinciğe dal verir (OpenStax 13.3).

Kabaca kural şudur: büyük beynin ön bölümünü iç karotisler besler. Geri kalan beyni ise vertebral arterlerle ilişkili dallar besler (OpenStax 20.5). İç karotisin dallarından ikisine bakalım. **Ön beyin arteri** (*arteria anterior cerebri*) frontal lobu (alın lobu) besler. **Orta beyin arteri** (*arteria media cerebri*) temporal ve parietal lobları besler. Beyin damar olayları (inme) en sık bu iki lobda görülür (OpenStax 20.5).

Beynin tabanında bu iki sistem birbirine bağlanır ve bir halka kurar: **Willis halkası** (Willis çemberi; *circulus arteriosus cerebri*). Bu halka bir atardamar kavşağıdır. Bir parçası daralsa ya da tıkansa bile beynin beslenmesini sürdürebilir (OpenStax 13.3). Beyinden dönen kan ise yukarıda gördüğümüz sert zar sinüslerinden geçer. Oradan iç juguler venlere akar.`,
    },
    {
      tur: 'sahne',
      baslik: 'Alttan bakış: beynin atardamarları',
      aciklama:
        'Beyin yarı saydam; atardamarlar kırmızı. Alttan bakıyoruz; ön taraf ekranın üstünde. İç karotis arterler ve vertebral arterler görünür. Vertebral arterler birleşerek baziler arteri yapar. Beynin tabanında bu atardamarlar Willis halkasıyla birbirine bağlanır.',
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
      tur: 'sayilar',
      baslik: 'Beynin yakıt hesabı',
      ogeler: [
        { deger: '%2', aciklama: 'Beynin vücut ağırlığındaki payı.' },
        { deger: '%25', aciklama: 'Vücuda dağıtılan glikozdan beynin kullandığı pay.' },
        { deger: '~%20', aciklama: 'Vücuda dağıtılan oksijenden beynin kullandığı pay.' },
        { deger: '5–10', birim: 'saniye', aciklama: 'Beynin kan akımı tümüyle durursa bilinç bu sürede kaybolur.' },
      ],
      not: 'Kaynaklar: Siwicka-Gieroba ve ark. (2022); Dash (2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Willis halkasının parçaları.** Halkanın kaç parçadan oluştuğu, sayım yöntemine göre değişir (halkayı 9 ya da 10 parçalı sayan anlatımlar da vardır: Karatas ve ark., 2016). Bu derste tam bir halkayı yedi atardamar parçası kurar:

- İki ön beyin arterinin başlangıç bölümleri (A1).
- Bu ikisini birleştiren **ön bağlantı arteri** (*arteria communicans anterior*) (OpenStax 20.5).
- İki arka beyin arterinin başlangıç bölümleri (P1).
- İki **arka bağlantı arteri** (*arteria communicans posterior*). Bunlar iç karotisi arka beyin arterine bağlar (Karatas ve ark., 2015).

Halka, beyin tabanındaki interpedinküler sarnıcın içinde durur (Gray, 1918). Vertebral arterlerden çıkan dallar ayrıca birleşir ve **ön spinal arteri** yapar. Bu atardamar omuriliğin ön yüzünü besler (OpenStax 13.3).

**Akımın sayıları.** Kalbin bir dakikada pompaladığı kana kalp debisi denir. Dinlenmede beyin bu kanın yaklaşık %14’ünü alır, yani dakikada ~700 mL (Wilson, 2016). Başka bir kaynak bu payı %20 olarak verir (Kızılgöz ve ark., 2022). Bu farkı akılda tutmak için payı %14–20 diye bilmek yeterlidir. Normal koşullarda beyin kan akımı, 100 g doku başına dakikada yaklaşık 50 mL’dir (Siwicka-Gieroba ve ark., 2022). Genç yetişkinde bu değer gri cevherde ~80, beyaz cevherde ~20 mL/100 g/dk’dır (Khartabil ve ark., 2026). Uyanık sağlıklı insanda beynin oksijen tüketimi (CMRO₂) ortalama 3,3 mL/100 g/dk’dır (Siwicka-Gieroba ve ark., 2022).

**Otoregülasyon (kendi kendini ayarlama).** Perfüzyon basıncı, beyni besleyen kanın itme gücüdür. Bu basınç belli bir aralıkta değişse de beyin kan akımını görece sabit tutar. Bu aralık kaynağa göre değişir: 50–150 mmHg (Peterson ve ark., 2011) ya da 60–160 mmHg (Siwicka-Gieroba ve ark., 2022). Aralığın dışında ise akım, basınçla birlikte belirgin biçimde değişir (Peterson ve ark., 2011). Perfüzyon basıncı 50 mmHg’nin altına düşerse beyin iskemisi, yani dokunun yeterince kan alamaması başlar (Siwicka-Gieroba ve ark., 2022).

Kan akımının düzenlenmesi üç ana ilkeyle anlatılır. Birincisi basınç otoregülasyonudur. İkincisi **akım-metabolizma eşleşmesidir**. Beyin, akımı o anda ne kadar çalıştığına (metabolik etkinliğine) göre ayarlar. Üçüncüsü sinirsel düzenlemedir (Peterson ve ark., 2011). Güncel bir derleme ise konuyu dört ana başlıkta toplar (Claassen ve ark., 2021).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Willis halkası: ön ve arka dolaşım',
      aciklama:
        'Yalnızca atardamarlar görünüyor; alttan bakıyoruz. Ön taraf ekranın üstünde. Kırmızı: iç karotisten beslenen ön dolaşım (ön ve orta beyin arterleri). Mor: vertebral ve baziler arterden beslenen arka dolaşım. Sarı: bağlantı arterleri. Ön bağlantı arteri, sağ ve sol ön beyin arterlerini birbirine bağlar. Arka bağlantı arterleri ise iç karotisi arka beyin arterine, yani ön dolaşımı arka dolaşıma bağlar. Halkanın parçaları öne çıkarıldı; besleyen büyük arterler soluk. Modeldeki halka tamdır. Gerçekte ise halkanın bir ya da birkaç parçası birçok kişide ince ya da eksiktir. “Tam halka” oranı da tanıma göre seriden seriye çok değişir (Karatas ve ark., 2016).',
      sahne: {
        katmanlar: ['damar'],
        renk: 'dogal',
        vurgula: ['on-beyin-arteri', 'on-baglanti-arteri', 'arka-baglanti-arteri', 'arka-beyin-arteri', 'baziler-arter'],
        boya: [
          { secici: ['ic-karotis-arter', 'on-beyin-arteri', 'orta-beyin-arteri'], renk: ON_DOLASIM },
          { secici: ['vertebral-arter', 'baziler-arter', 'arka-beyin-arteri', 'ust-beyincik-arteri'], renk: ARKA_DOLASIM },
          { secici: ['on-baglanti-arteri', 'arka-baglanti-arteri'], renk: BAGLANTI },
        ],
        bakis: 'alt',
        etiketler: [
          { yapi: 'on-beyin-arteri-sol', metin: 'Ön beyin arteri (ACA)' },
          { yapi: 'on-baglanti-arteri', metin: 'Ön bağlantı arteri' },
          { yapi: 'arka-baglanti-arteri-sol', metin: 'Arka bağlantı arteri' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin arteri (PCA)' },
          { yapi: 'baziler-arter', metin: 'Baziler arter' },
          { yapi: 'ic-karotis-arter-sag', metin: 'İç karotis arter' },
          { yapi: 'orta-beyin-arteri-sag', metin: 'Orta beyin arteri (MCA)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beyin kan akımı: sayılar ve eşikler',
      sutunlar: ['Kan akımı (mL/100 g/dk)', 'Ne anlama gelir?'],
      satirlar: [
        ['~80 (gri cevher), ~20 (beyaz cevher)', 'Genç yetişkinde ortalama değerler'],
        ['~50', 'Normal koşullarda ortalama beyin kan akımı'],
        ['25–35', 'Beyin dalgalarında (EEG) önce hızlı dalgalar kaybolur'],
        [
          '17–18',
          'Yavaş dalgalar artar. Kritik iskemi eşiği: nöronlar zar gradyanlarını, yani zarlarının iki yanındaki iyon farkını yitirmeye başlar. Bu düzeyde doku ölümü (enfarkt) saatlerce gecikebilir',
        ],
        ['10–12 ve altı', 'Enfarkt eşiği. EEG susar, hücre hasarı geri dönüşsüz olur'],
      ],
      not: 'Kaynaklar: Khartabil ve ark. (2026); Siwicka-Gieroba ve ark. (2022); Foreman ve Claassen (2012). Eşikler yaklaşık değerlerdir. İskeminin nicel EEG ile saptanması üzerine bir derlemeden alınmıştır.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kansız kalan beyin: saniyeler, dakikalar, saatler',
      md: `Beynin kan akımı tümüyle durursa 5–10 saniyede bilinç kaybolur. Akım birkaç dakika içinde yeniden başlamazsa kalıcı beyin hasarı oluşur (Dash, 2026). Akım tümüyle durmayıp yalnızca azalırsa tablo kademelidir. Kritik iskemi eşiği 17–18 mL/100 g/dk’dır. Bu düzeyde doku ölümü (enfarkt) saatlerce gecikebilir. 10–12 mL/100 g/dk ve altında ise hasar geri dönüşsüz olur (Foreman ve Claassen, 2012). Demek ki bazı dokuların akımı azalmıştır, ama doku henüz ölmemiştir. Beyin damarı tıkandığında zamanın bu kadar önemli olmasının nedeni budur.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Toplardamar dönüşü.** Beynin toplardamarlarında kapakçık yoktur. Duvarlarında kas dokusu bulunmaz, bu yüzden çok incedirler (Gray, 1918). Çadır üstündeki toplardamarlar iki sisteme ayrılır: yüzeyel ve derin (Ota, 2024).

Kabuğun toplardamarları **köprü venler** aracılığıyla üst sagital sinüse akar. Kan oradan sinüslerin birleşim yerine (torkula) gelir. Çoğu kişide de sağ transvers sinüse geçer (Wilson, 2016). Gray bunu şöyle anlatır: üst sagital sinüs, iç art kafa çıkıntısının yakınında bir yana sapar. Bu yan genellikle sağdır. Sinüs, o yanın transvers sinüsü olarak devam eder (Gray, 1918).

Derin toplardamarların çoğu **iç serebral vene** (*vena interna cerebri*) dökülür. Bir kısmı da **Rosenthal’in bazal venine** (*vena basalis*) dökülür. İkisi de **Galen’in büyük serebral venine** (*vena magna cerebri*) yönelir (Ota, 2024). Galen veni, düz sinüs yoluyla birleşim yerine boşalır. Oradan çoğu kişide sol transvers sinüse geçer (Wilson, 2016). Daha derin (ön) bölgelerin toplardamarları **kavernöz sinüslere** (*sinus cavernosus*) boşalır. Bu sinüsler de üst ve alt petrozal sinüsler yoluyla juguler bulbusa, yani iç juguler venin başındaki genişliğe açılır (Wilson, 2016).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**“Tam halka” çoğu tanıma göre azınlıktadır. Ama ne kadar azınlık?** Hipoplazik atardamar, yeterince gelişmemiş ve ince kalmış atardamardır. Böyle bir atardamar içermeyen tam halka, olguların yarısından azında görülür. Bildirilen oranlar %4,6 ile %72,2 arasında değişir. Bu genişliğin nedeni, tam halkanın ve hipoplazinin farklı tanımlanmasıdır (Karatas ve ark., 2016).

Norveç’teki Tromsø çalışması 40–87 yaşlarında 1.864 kişiyi inceledi. Yöntem 3T TOF-MR anjiyografiydi. 1 mm’den ince parçalar eksik ya da hipoplazik sayıldı. Sonuçlar şöyleydi:

- Tam halka yalnızca %11,9’da vardı.
- En sık farklı biçim (varyant), iki arka bağlantı arterinin birden olmamasıydı (%27,8).
- 47 ayrı varyant bulundu. Bunların beşi, örneklemin %68,5’ini oluşturuyordu.
- Yaş arttıkça eksik parça sayısı artma eğilimindeydi (Hindenes ve ark., 2020).

Aşağıdaki tablodaki serilerin çoğu Türkiye’dendir. Hepsi aynı şeyi gösterir: bu sorunun yanıtı tanıma çok bağlıdır.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Willis halkası: “tam halka” oranı tanıma göre değişir',
      sutunlar: ['Seri', 'Örneklem', 'Yöntem', 'Neyi “tam” saydı?', 'Tam halka'],
      satirlar: [
        [
          'Tromsø, Norveç',
          '1.864 kişi, 40–87 yaş, toplum örneklemi',
          '3T TOF-MR anjiyografi',
          '1 mm’den ince parça eksik/hipoplazik sayıldı',
          '%11,9',
        ],
        ['İzmir (Adli Tıp Kurumu)', '100 taze yetişkin kadavra', 'Kadavra incelemesi', 'Hipoplazik arter içermeyen “tipik” yapı', '%8'],
        ['İzmir (yazar kurumları)', '100 yetişkin hasta', 'BT anjiyografi', 'Tam çokgen yapı', '%28'],
        [
          'Erzincan ve Erzurum (yazar kurumları)',
          '867 hasta',
          'MR anjiyografi',
          'Tam / kısmen tam / eksik diye üç grup',
          '%41,3 tam (%48,1 kısmen tam, %10,6 eksik)',
        ],
        [
          'Muğla (tek merkez)',
          '384 kişi',
          'MR anjiyografi',
          'Yalnızca hiç gelişmemiş parça (agenezi) “normal dışı” sayıldı',
          '%85,4 “normal”',
        ],
        [
          'Çocuk serisi (yalnızca özet okundu; yer belirtilmez)',
          'Bütün çocuk yaşlarından 273 MR anjiyografi',
          'MR anjiyografi',
          'Özette tanım verilmez',
          '%56,1',
        ],
        ['Literatür', '—', '—', '—', '%4,6–72,2'],
      ],
      not: 'Kaynaklar: Hindenes ve ark. (2020); Karatas ve ark. (2016); Karatas ve ark. (2015); Kızılgöz ve ark. (2022); Yeniçeri ve ark. (2017); Solak ve ark. (2021; yalnızca özet okunabildi, özette yer ve kurum belirtilmez).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Erişkin, fetal, geçiş tipi.** Halkanın düzeni üç tipe de ayrılır: erişkin, fetal ve geçiş tipi. Tanımlar Beynin atardamarları dersinde. Serilerde bulunan oranlar şöyle:

- İzmir kadavra serisi: %87 erişkin, %9 fetal, %4 geçiş tipi (Karatas ve ark., 2016).
- İzmir BT anjiyografi serisi: %82, %17 ve %1 (Karatas ve ark., 2015).
- Muğla MR anjiyografi serisi: %85, %13 ve %2 (Yeniçeri ve ark., 2017).

Kadavra serisinde en sık farklılık hipoplazidir. En çok da arka bağlantı arterinde görülür (%85) (Karatas ve ark., 2016).

**Ön bölüm.** İstanbul Adli Tıp Kurumu’nda 182 taze kadavra incelendi. Ön bağlantı arteri olguların %47,25’inde tipik yapıdaydı. %52,75’inde ise farklı bir yapı (varyasyon) vardı (Nteli Chatzioglou ve ark., 2025). Ankara’da Etlik Şehir Hastanesi’nde 1.537 MR anjiyografi incelendi. Ön bağlantı arteri bölgesindeki (kompleksindeki) varyantlar olguların %60’ında görüldü. Ön dolaşımda en sık görülenler, A1 bölümünün ince kalması (hipoplazi) ve hiç olmamasıydı (aplazi) (Kaplanoglu ve Kurtulus Ozturk, 2024).

**Toplumlar arasında fark var mı?** İran’dan bir görüş, bir kadavra serisine ve literatür taramasına dayanır. Bu görüşe göre varyasyonların toplumdan topluma farklı dağıldığına dair kanıt yoktur (Eftekhar ve ark., 2006). Muğla serisinin yazarları ise varyasyonların coğrafyaya ve etnik kökene göre değişebileceğini yazar (Yeniçeri ve ark., 2017). Soru tartışmalıdır. Seriler arasındaki farkların önemli bir kısmı, yöntem ve tanım farkından gelir. 42 çalışmayı tarayan sistematik bir derleme yeni bir sınıflama önermiştir. Bu sınıflama 82 varyasyonu beş grupta toplar (Ayre ve ark., 2022).

Parça sayısı bile sayıma bağlıdır. Aynı makale halkayı bir yerde “9 kenarlı bir dokuzgen” diye anlatır. Birkaç satır sonra ise “10 atardamar parçasından” oluşan bir yapı der (Karatas ve ark., 2016). Bu derste sayılan yedi parça, İzmir BT anjiyografi çalışmasının saydığı parçalardır (Karatas ve ark., 2015).

**Damarların sinirleri.** Beyin damarlarına dışarıdan gelen sinirlerin üç kaynağı vardır: trigeminal gangliyon (duyusal), üst servikal gangliyon (sempatik) ve sfenopalatin gangliyon (parasempatik) (Peterson ve ark., 2011).

**Toplardamarlar kişiye özgüdür.** Kişilerin yaklaşık yarısında beynin toplardamar akışı (drenajı) iki yanda belirgin biçimde farklıdır. Transvers sinüs akışı kişilerin yaklaşık %40’ında sağda, %18’inde solda baskındır (Wilson, 2016). Beyin toplardamarlarında temelde kapakçık yoktur. Kafa içindeki akımın yönü de sabit değildir. Her toplardamarın işlevi kişiden kişiye değişir. Aynı kişide de beyin kan akımına göre değişir (Ota, 2024). Sinüslerin kas duvarı yoktur. Sert zarın katlantıları, sinüsün içinde üçgen bir boşluk (lümen) oluşturur. Bu yüzden sinüsler, dışarıdan basıya atardamarlardan daha açıktır (Wilson, 2016).`,
    },

    // ——— Kafa içi basıncı ———
    {
      tur: 'metin',
      md: `**Kapalı kutudaki üç hacim.** Yetişkinde kafatası esnemeyen bir kutudur. İçinde üç şey vardır: beyin, kan ve BOS. **Monro–Kellie öğretisine** göre kafatası sağlamken bu üç hacmin toplamı sabittir. Biri artarsa, öteki ikisinden biri ya da ikisi birden azalmak zorundadır. Bir kanamanın yer kaplaması buna örnektir (Wilson, 2016). Kafa içindeki basınca **kafa içi basıncı** (KİB) denir. Bu basıncın nasıl değiştiğini anlamak için bu basit ilkeden başlanır.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Besleyenler:** iç karotisler (ön) ve vertebral–baziler sistem (arka). Beynin tabanında **Willis halkası** ikisini bağlar.

**Engel:** Beyin kılcallarının endoteli kan-beyin engelini kurar. Oksijen, karbondioksit ve glikoz geçer; maddelerin çoğu geçemez.

**Basınç:** Kafatası esnemez. Beyin + kan + BOS = sabit (Monro–Kellie).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Normal kafa içi basıncı kaç?** Sanıldığı kadar kesin bir sayı yoktur. Sistematik bir derlemeye göre başvuru değerleri duruşa göre değişir:

- sırtüstü yatarken 0,9–16,3 mmHg,
- ayaktayken −5,9 ile 8,3 mmHg arası.

Yani basınç ayakta eksiye bile inebilir. Belden ölçülen BOS basıncının başvuru aralığı da duruşa bağlıdır: yan yatarken 7,2–16,8, sırtüstü 5,7–15,5 mmHg (Norager ve ark., 2021). Bir başka kaynak, normal (fizyolojik) KİB’i yaşa göre verir: bir yaşından önce 3–4 mmHg, yetişkinde 10–15 mmHg (Sakka ve ark., 2011). Sağlıklı insanda yapılmış normal ölçümler azdır (Norager ve ark., 2021). Bu yüzden bir KİB değerini yorumlarken iki şey bilinmelidir: duruş ve ölçüm yeri.

**Kan, BOS’tan çok daha hızlı değişen bir hacimdir.** Herhangi bir anda kafa içinde ~100–130 mL kan bulunur. Bunun ~%15’i atardamarlarda, ~%40’ı toplardamarlarda, ~%45’i en küçük damarlardadır (mikrodolaşım). BOS ise dakikada yalnızca ~0,35 mL yapılır. Bu yavaş yapım, beyne sürekli giren ve çıkan büyük kan akımının yanında çok küçük kalır (Wilson, 2016). BOS boşaltmak KİB’i düşürebilir. Ama travma gibi ani bir durumda yüksek KİB’in nedeni nadiren BOS birikmesidir (Wilson, 2016).`,
    },
    {
      tur: 'animasyon',
      ad: 'monro-kellie',
      duzey: 'lisans',
      baslik: 'Monro–Kellie ilkesi ve basınç–hacim eğrisi',
      aciklama:
        'Kaydırıcıyla kafatasına hacim ekle ya da kitleyi kendiliğinden büyüt. Önce BOS ve toplardamar kanı yer açar. Bu yedek alan (tampon) azaldıkça basınç hızla yükselir. Eğri şematiktir. Yeşil bant, sırtüstü başvuru aralığıdır (0,9–16,3 mmHg). Bu aralık, sırtüstü yatarken kafanın içinden ölçülen basınçtan gelir. Ölçülenler, kafa içi basıncı bakımından sağlıklı sayılan hastalardır. Her yaştan bu hastalar başka bir nedenle beyin cerrahisi girişimi gerektiriyordu. Tamamen sağlıklı insanda bu ölçüm yapılmadı. Örneklem de küçüktü (6 çalışma, 62 kişi). Bu yüzden derleme, bu aralığı klinikte kullanılabilecek bir başvuru aralığı saymaz (Norager ve ark., 2021). Yukarıda anlatıldığı gibi basınç duruşa göre de değişir. 22 mmHg çizgisi, ağır kafa travmasında KİB’in altında tutulması hedeflenen değerdir (Schizodimos ve ark., 2020). Perfüzyon basıncı, ortalama arter basıncından KİB çıkarılarak hesaplanır (Wilson, 2016).',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Görüntülemede zarlar, damarlar ve basınç',
      md: `- **Menenjiyal lenf damarları**, insanda ve marmoset maymununda canlıda görüntülenebilmiştir. Bunun için yüksek çözünürlüklü klinik MR kullanılmıştır (Absinta ve ark., 2017).
- **Willis halkası** MR anjiyografi ve BT anjiyografiyle incelenir. Hangi parçanın “eksik” sayılacağı seçilen eşiğe bağlıdır. Örneğin Tromsø çalışması, 3T TOF-MR anjiyografide 1 mm’den ince parçaları eksik ya da hipoplazik saydı (Hindenes ve ark., 2020; Karatas ve ark., 2015).
- **Optik sinir kılıfı çapı:** Görme sinirini saran kılıfın çapı 5 mm’yi aşabilir. Birçok çalışmada bu durum, KİB’in 20 mmHg ya da üstünde olmasıyla ilişkili bulunmuştur (Schizodimos ve ark., 2020).
- **İzleyiciyle MR:** Sağlıklı gönüllülerde MR izleyicileri köprü venler boyunca subaraknoid aralığa geçer (Smyth ve ark., 2024). BOS’a verilen izleyicinin, 48 saat boyunca sagital sinüs çevresindeki sert zara doğrudan geçtiği görülmüştür (Ringstad ve Eide, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Arayüzler:** kan-beyin engeli (endotel), kan-BOS engeli (koroid pleksus epiteli), araknoid engel. Yumuşak zar engel değildir.
- **Sirkumventriküler organlar:** Duyusal olanlar OVLT, subfornikal organ, area postrema. Salgı yapanlar median eminens, nörohipofiz, epifiz.
- **Willis halkası:** 2 × A1 + ön bağlantı arteri + 2 × P1 + 2 × arka bağlantı arteri. Arka bağlantı arteri, iç karotisi arka beyin arterine bağlar. Halka interpedinküler sarnıçtadır.
- **Kan akımı:** ~50 mL/100 g/dk (gri ~80, beyaz ~20); kalp debisinin %14–20’si. Eşikler: 25–35 (EEG’de hızlı dalgalar kaybolur), 17–18 (kritik iskemi), 10–12 ve altı (enfarkt).
- **Otoregülasyon:** perfüzyon basıncı 50–150 (ya da 60–160) mmHg. 50’nin altı iskemi.
- **KİB:** sırtüstü 0,9–16,3, ayakta −5,9 ile 8,3 mmHg. Ağır kafa travmasında hedef: KİB < 22, perfüzyon basıncı > 60 mmHg (önerilen aralık 60–70).
- **Toplardamarlar:** üst sagital sinüs → birleşim yeri → (çoğunlukla sağ) transvers → sigmoid → iç juguler ven. Derin sistem → Galen veni → düz sinüs.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kafa içi basıncı: eşikler ve tuzaklar',
      md: `- **Kılavuz hedefi:** Ağır kafa travmasında tedavinin birincil amacı şudur: KİB’i 22 mmHg’nin altında, beyin perfüzyon basıncını 60 mmHg’nin üstünde tutmak. Kılavuzun önerdiği perfüzyon basıncı aralığı 60–70 mmHg’dir (Schizodimos ve ark., 2020).
- **İki eşik, iki amaç:** Optik sinir kılıfı çalışmalarındaki ≥20 mmHg bir ilişki eşiğidir. 22 mmHg ise kılavuzun tedavi hedefidir (Schizodimos ve ark., 2020). İkisini birbirinin yerine kullanma.
- **Normal değer duruşa bağlıdır:** sırtüstü 0,9–16,3, ayakta −5,9 ile 8,3 mmHg. Sağlıklı insanda normal ölçümler azdır (Norager ve ark., 2021).
- **Hacimlerin ölçeği:** Erkekte ortalama kafa içi hacmi (beyin ve BOS dahil) 1.473 mL’dir. Beyin dinlenmede dakikada ~700 mL kan alır. Bu miktar, o hacmin yarısına yakındır (Wilson, 2016).
- **BOS mu, kan mı?** BOS boşaltmak KİB’i düşürebilir. Ama travmada yüksek KİB’in nedeni nadiren BOS birikmesidir (Wilson, 2016).
- **Ozmotik tedavi:** Toplardamardan verilen mannitol, beyinden ozmoz yoluyla su çeker ve KİB’i düşürür (Dash, 2026).
- **Toplardamar tarafı:** Sinüslerin kas duvarı yoktur. Bu yüzden basıya atardamarlardan daha açıktır. Transvers sinüslerden biri baskınsa bu çoğunlukla sağdakidir: kişilerin yaklaşık %40’ında sağ, %18’inde sol baskındır. Baskın sinüsün tıkanması, öbürünün tıkanmasından çok daha fazla etki yapar (Wilson, 2016).
- **Tarih:** Kafa içi basıncının “bilimi” ilk kez 1783’te öne sürülmüştür (Wilson, 2016).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Gece yükselen basınç',
      oyku: `42 yaşında bir motosiklet sürücüsü, kazadan sonra yoğun bakımda izleniyor. Kafa içi basıncı sürekli ölçülüyor. İlk saatlerde 14–16 mmHg olan değer, gece 24–26 mmHg’ye çıkıyor. Optik sinir kılıfı çapı iki gözde de 5,8 mm ölçülüyor. Görüntülemede kafa içinde yer kaplayan bir kanama var. Karıncıklar bir gün önceki görüntüye göre daralmış.`,
      soru: 'Bu sayılar ne anlatıyor? Monro–Kellie öğretisiyle tablo nasıl açıklanır?',
      cozum: `**Eşikler:** Ağır kafa travması kılavuzu iki hedef koyar: KİB 22 mmHg’nin altında, perfüzyon basıncı 60 mmHg’nin üstünde kalmalıdır (Schizodimos ve ark., 2020). 24–26 mmHg bu hedefin üstündedir. Optik sinir kılıfı çapının 5 mm’yi aşması da önemlidir. Birçok çalışmada bu, KİB’in 20 mmHg ya da üstünde olmasıyla ilişkili bulunmuştur (Schizodimos ve ark., 2020). İki bulgu birbirini destekler. Ama iki eşik farklı amaçlarla konmuştur.

**Nasıl oluyor?** Kafatası sağlamken beyin, kan ve BOS hacimlerinin toplamı sabittir. Kanamanın eklediği hacim, ötekilerden birinin ya da ikisinin azalmasıyla dengelenir (Wilson, 2016). Daralan karıncıklar, BOS’un yerinden itildiğini düşündürür. BOS boşaltmak KİB’i düşürebilir. Ama travmada yüksek KİB’in nedeni nadiren BOS birikmesidir. Çünkü kafa içindeki ~100–130 mL kan, çok daha hızlı değişen bir hacimdir. BOS ise dakikada yalnızca ~0,35 mL yapılır (Wilson, 2016).

**Tedavi seçeneklerinden biri:** Toplardamardan verilen mannitol engelden zor geçer. Bu yüzden beyinden ozmoz yoluyla su çeker ve KİB’i düşürür (Dash, 2026). Tedavi kararını yoğun bakım ve beyin cerrahisi ekibi verir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
