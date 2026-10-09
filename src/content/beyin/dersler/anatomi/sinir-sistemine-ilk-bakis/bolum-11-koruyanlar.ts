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
      md: `Beyin hem çok iyi korunan hem de çok iyi beslenen bir organdır. Dış dünyaya karşı onu üç engel korur: **kafatası**, **beyin zarları** (*meninges*) ve **beyin-omurilik sıvısı** (BOS; *liquor cerebrospinalis*) (Dafny, 2020). Beslenme tarafındaki tablo ise şaşırtıcıdır: beyin vücut ağırlığının yalnızca %2’si kadardır, ama vücuda dağıtılan glikozun %25’ini ve oksijenin yaklaşık %20’sini kullanır (Siwicka-Gieroba ve ark., 2022). Bu yakıtı iki çift atardamar getirir; kan ile beyin dokusu arasında da neyin geçip neyin geçemeyeceğini seçen bir sınır durur: **kan-beyin engeli**.

Bu bölüm koruyan ve besleyen yapıların haritasıdır: zarlar ve aralarındaki aralıklar, BOS’un yapılışı ve yolculuğu, beynin atıklarını nasıl temizlediği, kan-beyin engeli, beynin atardamarları ve toplardamarları, son olarak kafa içi basıncı. Her konunun bütün ayrıntısı Anatomi bölümünün kendi derslerinde işlenecek: Beyin zarları, Karıncıklar ve beyin-omurilik sıvısı, Beynin atardamarları ve Willis halkası, Atardamar alanları ve toplardamarlar.`,
    },
    {
      tur: 'metin',
      md: `**Kafatası** ilk ve en sert engeldir; kemiklerini, dikişlerini ve deliklerini [kafatası ünitesinde](/beyin-akademisi/anatomi/kafatasi) tek tek işledik. Burada yalnızca beyni besleyen kapıları hatırlayalım: iç karotis arter kafatasına şakak kemiğindeki karotis kanalından, vertebral arterler art kafa kemiğinin büyük deliğinden (*foramen magnum*) girer (OpenStax 13.3). Kafatası beyne yalnızca dışarıdan bir kask gibi değmez. İç yüzündeki küçük çukurcukları, büyüdükçe kemiği eriten araknoid granülasyonlar açar (Gray, 1918); kemiğin kanallarından da sert zarın toplardamar sinüslerini yüzeydeki toplardamarlara bağlayan **emisser venler** geçer ve kemiğin ilik boşluğuna ulaşır (Joost ve ark., 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Kafatası ve beyin',
      aciklama:
        'Kafatası kemikleri ile beyin bir arada, soldan bakış; ön taraf solda, renkler gerçeğe yakın. "Kesit" ile ikisini birlikte kesip kemiğin beyni nasıl sardığını görebilir, "Katmanlar" ile kafatasını kapatıp altındaki beyne bakabilirsin. Modelde beyin zarları ve BOS yoktur: kemikle beyin arasındaki ince aralığı gerçekte onlar doldurur.',
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
      md: `Kemiğin altında beyni ve omuriliği dıştan içe üç zar sarar: **sert zar** (*dura mater*), **örümcek ağı zar** (*arachnoidea mater*) ve **yumuşak zar** (*pia mater*) (Gray, 1918).

- **Sert zar** kalın, lifli ve sağlam bir kılıftır; bütün beyni ve omuriliği sarar. Latince adı “sert ana” demektir (OpenStax 13.3).
- **Örümcek ağı zar** incedir. Adını, altındaki örümcek ağına benzeyen ince lif ağından, **araknoid trabeküllerden** alır (OpenStax 13.3).
- **Yumuşak zar** beynin yüzeyine yapışık, ince bir örtüdür; Latince adı “şefkatli ana” demektir (OpenStax 13.3). Kıvrımlar arasındaki olukların içine kadar iner; örümcek ağı zar ise olukların üstünden bir kıvrımdan ötekine köprü kurar (Gray, 1918).

Örümcek ağı zar ile yumuşak zar arasındaki **subaraknoid aralık** (*spatium subarachnoidale*) dolaşan BOS ile doludur. Beyin ve omurilik bu sıvının içinde bir yastığa oturmuş gibi durur (OpenStax 13.3).`,
    },
    {
      tur: 'metin',
      md: `Sert zar beynin çevresinde düz bir torba gibi durmaz; içeri doğru kıvrılarak kafatasının içini bölmelere ayırır. Dört ana kıvrımı vardır: **beyin orağı** (*falx cerebri*), **beyincik çadırı** (*tentorium cerebelli*), **beyincik orağı** (*falx cerebelli*) ve **sella diyaframı** (*diaphragma sellae*) (Ishikawa ve ark., 2026). En büyüğü beyin orağıdır: iki beyin yarımküresini ayıran derin yarığa iner. İkinci büyük kıvrım olan beyincik çadırı, büyük beyin ile beyinciğin arasına bir çatı gibi gerilir ve kafatasının içini **çadır üstü** ve **çadır altı** diye iki kata ayırır (Ishikawa ve ark., 2026).

Sert zarın iki katmanı arasında, beynin kanını toplayan kapakçıksız toplardamar kanalları uzanır: **dural venöz sinüsler** (Gray, 1918). Kan tepedeki **üst sagital sinüsten** (*sinus sagittalis superior*) arkadaki **sinüslerin birleşim yerine** (*confluens sinuum*) gelir, oradan **transvers sinüslere**, **sigmoid sinüslere** ve sonunda boyundaki **iç juguler venlere** (*vena jugularis interna*) akar (OpenStax 13.3).`,
    },
    {
      tur: 'sahne',
      baslik: 'Orta hattan: sert zar kıvrımlarının yeri',
      aciklama:
        'Kafatası ve beyin orta hattan ikiye ayrıldı; sol yarıya içeriden bakıyoruz, yüz sağda. Modelde zarlar yoktur, ama kıvrımların yeri bellidir: beyin orağı bu iç yüzün hemen önünde, iki yarımküre arasındaki yarığa iner; beyincik çadırı oksipital lobun alt yüzü ile beyinciğin üstü arasına bir çatı gibi gerilir ve ön kenarındaki çentikten orta beyin geçer. Renkler gerçeğe yakın.',
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
      md: '**Dıştan içe:** kafatası → sert zar → örümcek ağı zar → BOS dolu subaraknoid aralık → yumuşak zar → beyin.\n\n**Sert zarın kıvrımları:** beyin orağı (iki yarımküre arası), beyincik çadırı (büyük beyin ile beyincik arası), beyincik orağı, sella diyaframı.\n\n**Toplardamar dönüşü:** beyin yüzeyinin toplardamarları → üst sagital sinüs → sinüslerin birleşim yeri → transvers sinüs → sigmoid sinüs → iç juguler ven.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Kitaplardaki “subdural aralık”',
      md: 'Birçok kitapta sert zar ile örümcek ağı zar arasında ince bir “subdural aralık” çizilir. Güncel anatomi bunu sağlıklı insanda var olan bir boşluk saymaz: normalde örümcek ağı zar sert zara, sert zar da kafatasına yapışıktır ve bu arayüzlerde doğal bir aralık yoktur (FIPAT, 2019). “Subdural aralık” denen yer, ancak bir travma ya da kanama sert zarın en iç hücre katmanını yarınca açılır (Ishikawa ve ark., 2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sert zar.** Kalınlığı ortalama 0,33–0,56 mm’dir (Ishikawa ve ark., 2026). Klasik anlatımda kafatası durası iki katmanlıdır: kemiğe bakan **endosteal (periostal) katman** ve beyne bakan **meningeal katman** (Gray, 1918). Terminologia Anatomica (TA2) da kafatası durasında yalnızca bu iki kısmı adlandırır: *pars periostea* ve *pars meningea durae cranialis* (FIPAT, 2019). Güncel görüş ise sert zarı dıştan içe üç katmanlı sayar: endosteal katman, meningeal katman (*dura propria*) ve en içte **dural sınır hücre katmanı** (Ishikawa ve ark., 2026); bu en iç katman örümcek ağı zarın engel hücrelerine komşudur (Castro Dias ve ark., 2019). İki anlatım çelişmez, ayrıntı düzeyleri farklıdır. Omurilikte sert zar yalnızca meningeal katmanın devamıdır: endosteal katman foramen magnumda sona erer (Gray, 1918).

Sert zarın kıvrımları meningeal katmanın ikiye katlanmasıyla oluşur (Gray, 1918). Kafatasının içini bölmelere ayırır ve baş ani hızlanıp yavaşladığında beynin aşırı hareketini azaltarak onu yerinde tutarlar (Ishikawa ve ark., 2026). Sert zar hem duyu hem sempatik sinir lifi alır; çadır üstündeki sert zara, özellikle beyin orağına ve beyincik çadırına esas olarak trigeminal sinirin üç dalı sinir verir (Ishikawa ve ark., 2026). Damarları her yanda üç meningeal arterdir (ön, orta ve arka); bu arterler toplardamarlarıyla birlikte sert zarın dış (periostal) yüzünde, yani kemiğe bakan tarafta uzanır (Joost ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın dört kıvrımı',
      sutunlar: ['Kıvrım', 'Latince (TA2)', 'Yeri ve yapısı', 'Sinüsler ve komşuluk'],
      satirlar: [
        [
          'Beyin orağı',
          '*Falx cerebri*',
          'En büyük kıvrım; iki yarımküre arasındaki yarıkta. Önde alın kristasına ve horoz ibiğine (*crista galli*), arkada beyincik çadırına tutunur',
          'Üst (dışbükey) kenarında üst sagital sinüs, alt kenarında alt sagital sinüs',
        ],
        [
          'Beyincik çadırı',
          '*Tentorium cerebelli*',
          'İkinci büyük kıvrım; büyük beyin ile beyincik arasında, U biçimli. Ön-iç kenarında çadır çentiği (*incisura tentorii*)',
          'Çentikten orta beyin geçer; yan tutunma yerlerinde transvers sinüs, beyin orağıyla birleştiği yerde düz sinüs (*sinus rectus*)',
        ],
        [
          'Beyincik orağı',
          '*Falx cerebelli*',
          'Meningeal katmanın ikiye katlanmasıyla oluşur',
          'Arka yaprakları arasında oksipital sinüs; ikilenme gibi varyantları bilinir',
        ],
        [
          'Sella diyaframı',
          '*Diaphragma sellae*',
          'Selanın (Türk eyerinin) üstünde; öteki kıvrımların aksine tek katlı bir dura yaprağı',
          'Selayı her zaman tam örtmez: olguların %39’unda 5 mm ya da daha geniş açıklık',
        ],
      ],
      not: 'Kaynaklar: Ishikawa ve ark. (2026); Gray (1918); FIPAT (2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Örümcek ağı zar ve yumuşak zar.** Örümcek ağı zar iki katmandan oluşur: dışta hücreleri yaygın ve kesintisiz **sıkı bağlantılarla** (*tight junction*) kenetlenmiş **araknoid engel hücre katmanı**, içte subaraknoid aralığa uzanan araknoid trabeküller (Castro Dias ve ark., 2019). Damarsız araknoid epiteli, kan-beyin engeli ve kan-BOS engelinden sonra beynin **üçüncü engeli** sayılır (Kadry ve ark., 2020). Yumuşak zarın hücreleri arasında ise sıkı bağlantı yoktur; yumuşak zar suda çözünmüş maddelere engel olmaz (Castro Dias ve ark., 2019). Yumuşak zar ile beyin dokusu arasında, dokunun bazal zarı ve astrositlerin uç ayakçıklarından oluşan **glia limitans** bulunur (Castro Dias ve ark., 2019). Yumuşak zar ile örümcek ağı zar birlikte **leptomeninks** (*leptomeninges*) diye anılır (Pietilä ve ark., 2023).

**Sarnıçlar.** Beynin tabanında örümcek ağı zar yumuşak zardan yer yer geniş aralıklarla ayrılır; birbiriyle serbestçe bağlantılı bu genişliklere **subaraknoid sarnıçlar** denir (Gray, 1918). Örneğin **interpedinküler sarnıç** (*cisterna interpeduncularis*) beyin saplarını (*pedunculi cerebri*) sarar ve Willis halkasını içinde taşır (Gray, 1918). Eski adıyla *cisterna magna* olan büyük sarnıcın TA2’deki adı *cisterna cerebellomedullaris posterior*’dur (FIPAT, 2019).

**Omurilikte.** Subaraknoid aralık, onu saran sert zar kesesiyle birlikte aşağıda 2. sakral (sağrı) omur dolayında biter. Gray (1918) bu hizayı omurun alt kenarı olarak verir; 635 erişkinin MR’ında ise kesenin ortalama bitiş yeri 2. sakral omurun üst üçte biriydi ve kişiden kişiye 3. bel omurunun alt üçte birinden 5. sakral omurun üst üçte birine kadar değişiyordu (Soleiman ve ark., 2005). Omurilik belin alt bölümüne kadar uzanmadığı için BOS buradan, sert zar ve örümcek ağı zar iğneyle geçilerek alınabilir: **lomber ponksiyon** (OpenStax 13.3). Omurilikte sert zar ile omurga kanalının duvarı arasında gevşek bağ dokusu ve bir toplardamar ağı içeren gerçek bir **epidural aralık** vardır (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zarların arasındaki aralıklar: hangisi gerçekten var?',
      sutunlar: ['Aralık', 'Latince (TA2)', 'Sağlıklı insanda', 'İçinde ne var, klinikte ne anlamı var?'],
      satirlar: [
        [
          'Kafa içi epidural aralık',
          '*Spatium epidurale craniale*',
          'Yok: sert zar kafatasına yapışıktır; aralık ancak travma ya da hastalıkla açılır',
          'Meningeal arterler ve toplardamarları sert zarın kemiğe bakan dış yüzünde uzanır',
        ],
        [
          'Subdural aralık',
          '*Spatium subdurale*',
          'Yok: TA2 “sabit olmayan” diye işaretler; güncel görüşte sert zarın en iç (dural sınır hücre) katmanında açılan bir yarıktır',
          'Kronik subdural hematom bu yarıkta gelişir; beyin orağı subdural hematomu normalde tek yarımkürede tutar',
        ],
        [
          'Subaraknoid aralık',
          '*Spatium subarachnoidale*',
          'Var',
          'Dolaşan BOS; tabanda sarnıçlar; interpedinküler sarnıçta Willis halkası',
        ],
        [
          'Omurilik epidural aralığı',
          '*Spatium epidurale spinale*',
          'Var',
          'Gevşek bağ dokusu ve toplardamar ağı; kafa içinde endosteal ve meningeal katmanlar arasındaki (interdural) düzlemin karşılığı sayılabilir',
        ],
      ],
      not: 'Kaynaklar: FIPAT (2019); Ishikawa ve ark. (2026); Joost ve ark. (2026); Gray (1918). Gray (1918) kafa içinde epidural aralık tanımlamaz, sert zarın kemiğe sıkıca yapıştığını yazar; subdural aralığı ise doğal bir aralık gibi anlatır (omurilikte “potansiyel boşluk” der, kafada BOS yollarının bir parçası sayar). Bazı güncel ders kitapları (Dafny, 2020) kafatası ile sert zar arasındaki epidural aralığı da, sert zar ile örümcek ağı zar arasındaki subdural aralığı da doğal bir aralık gibi tanımlar. Bu ders TA2’nin notunu ve güncel anatomi çalışmalarını esas alır.',
    },
    {
      tur: 'animasyon',
      ad: 'kafa-ici-kanamalar',
      duzey: 'lisans',
      baslik: 'Katmanlar ve kafa içindeki üç kanama',
      aciklama:
        'Kafatasının yanından alınmış şematik bir kesit. Önce katmanları tanı, sonra bir kanama seç ve kanın hangi düzlemde toplandığını izle. Çizim subdural kanamayı sert zar ile örümcek ağı zar arasında gösterir; yukarıdaki tabloda anlatıldığı gibi bu düzlem, sert zarın en iç hücre katmanında açılan bir yarıktır. Çizimdeki kanama bilgilerinin kaynakları: Stalons ve ark. (2022); Shetty ve ark. (2016); Nouri ve ark. (2021); Griswold ve ark. (2022); NINDS (2026a). Kanamaların ayrıntısı Beyin zarları dersinde.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sert zarın katmanları ve cerrahi düzlemler',
      md: `- **Dural sınır hücre katmanı** 10 μm’den incedir ve 3–8 sıra yassı, fibroblast benzeri hücreden oluşur. Bu kırılgan katman küçük bir travmanın ya da cerrahinin kesme kuvvetiyle yarılabilir; klinikte “subdural aralık” diye görülen şey, sert zarın içinde açılan bu yarık düzlemdir. Bu yüzden normal fizyolojide subdural aralık yoktur (Ishikawa ve ark., 2026).
- **Kronik subdural hematom:** yarılmış katmana tekrarlayan kanama ve süregen iltihap lifli zarlar oluşturur ve sonunda kronik subdural hematoma yol açar (Ishikawa ve ark., 2026).
- **Epidural düzlemler:** omurilikteki epidural aralık, kafa içinde endosteal ve meningeal katmanlar arasındaki “interdural” aralığın karşılığı sayılabilir (Ishikawa ve ark., 2026).
- **Arka çukurun sert zarı** C1–C3 dallarından ve sempatik liflerden sinir alır; bu lifler foramen magnum, hipoglossal kanal ve juguler delikten girer (Ishikawa ve ark., 2026).
- **Sella diyaframı** tek katlı bir dura yaprağıdır; olguların %39’unda 5 mm ya da daha geniş bir açıklık vardır, %10’unda diyafram selanın içeriği yukarıdan görülecek kadar incedir. Bu aralığın patolojik genişlemesi **boş sella sendromudur**; ilk kez 1951’de Busch tanımlamıştır (Ishikawa ve ark., 2026). Gray dört kıvrımın da meningeal katmanın ikiye katlanmasıyla oluştuğunu yazar (Gray, 1918); diyaframın tek katlı olduğu güncel kaynağın bilgisidir.
- **Oksipital sinüs** beyincik orağının arka yaprakları arasında uzanır; ikilenme gibi varyantları bilinir (Ishikawa ve ark., 2026).
- İnsanda **Liliequist zarları** taban sarnıçlarını tam olmayan biçimde bölmelere ayırır (Neuhuber, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Dördüncü bir zar mı? SLYM tartışması',
      md: `2023’te bir grup, fare ve insan beyninde subaraknoid aralığı bölmelere ayıran **dördüncü bir zar** tanımladı ve ona **SLYM** (subaraknoid lenfatik benzeri zar) adını verdi. Tanımlayanlara göre SLYM vücut boşluklarını döşeyen mezotele benzer, damarları sarar ve bağışıklık hücreleri taşır (Møllgård ve ark., 2023). Aynı grubun izlem çalışmasında SLYM omurilikte ve dorsal kabuğun bir kısmında araknoid engel katmanıyla kaynaşık, beyin sapının tabanında ise 1–3 hücre kalınlığında ayrı bir zar olarak görüldü (fare); yazarlar klasik elektron mikroskobu literatüründe SLYM’in **iç (retiküler) araknoid** diye bilindiğini de kabul eder (Plá ve ark., 2023). Bir derlemeye göre farede SLYM’in kalınlığı 14,2 ± 0,5 μm’dir, yani sert zardan incedir; derleme onu 3 kilodaltondan büyük molekülleri sınırlayan yarı geçirgen bir engel olarak aktarır. Bu bilgiler esas olarak fareden gelir; insandaki karşılığı büyük ölçüde araştırılmamıştır (Zedde ve Pascarella, 2025). Derleme eleştirilere yer vermez; aşağıdakilerle birlikte okunmalıdır.

**Eleştiriler.** Neuhuber’e göre ayrı “dış” ve “iç” subaraknoid aralıklar, dokunun tespiti ve kireçten arındırılması sırasında hiperozmotik stresin yarattığı yapay bir görüntü olabilir; “dördüncü zar” büyük olasılıkla bu işlemle ayrılmış iç araknoidden başka bir şey değildir (Neuhuber, 2024). Siegenthaler ve Betsholtz’a göre öne sürülen zar ayrı bir yapı değil örümcek ağı zarın parçasıdır; “dış subaraknoid aralık” deney işlemlerinin yarattığı yapay bir subdural aralıktır ve SLYM’e atfedilen engel özelliği aslında araknoid engel katmanına aittir. Kendi verilerinde Prox1 taşıyan hücreler iç araknoidde dağınık durur, ayrı bir zar oluşturmaz; bu yüzden “SLYM” adını yanıltıcı bulurlar (Siegenthaler ve Betsholtz, 2024). SLYM’i savunanlar, zar katmanlarının bilinen bütün histolojik tanımlarının da tespit edilmiş ve yapay yer değiştirmeye uğramış dokuya dayandığını hatırlatır (Plá ve ark., 2024).

**Tek hücre düzeyinde.** Bir transkriptom çalışması leptomeninkste beş ayrı fibroblast benzeri hücre tipi ayırmış ve bunları yumuşak zara, iç araknoide, dış araknoid engeline ve dural sınır katmanına bağlamıştır (fare) (Pietilä ve ark., 2023). 2026 tarihli bir derleme bu varsayılan dördüncü katmanın varlığının ve rolünün hâlâ yoğun tartışma konusu olduğunu yazar (Joost ve ark., 2026). Kısacası “dördüncü zar keşfedildi” demek bugün için erkendir.

**Köprü venlerin kapısı.** Bir fare çalışmasında köprü venlerin araknoid engelini geçtiği yerlerde engelde kesintiler bulundu ve bunlara **araknoid manşet çıkış noktaları** adı verildi; sağlıklı gönüllülerde de MR izleyicileri köprü venler boyunca benzer biçimde subaraknoid aralığa geçti (Smyth ve ark., 2024).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Altı hafta önceki küçük çarpma',
      oyku: `79 yaşında bir adam, altı hafta önce evde başını kapı pervazına hafifçe çarpmış; o gün hiçbir yakınması olmamış. Son iki haftada baş ağrısı ve dalgınlığı giderek artmış. BT’de sol yarımkürenin dış yüzünü örten, orta hattı geçmeyen ve içinde ince zar benzeri bölmeler bulunan bir sıvı toplanması görülüyor.`,
      soru: 'Kan anatomik olarak hangi düzlemde toplanmıştır, neden kronikleşmiştir ve neden karşı yarımküreye geçmemiştir?',
      cozum: `**Düzlem:** Klasik kitaplar bu yeri sert zar ile örümcek ağı zar arasındaki “subdural aralık” diye anlatır. Güncel anatomiye göre sağlıklı insanda böyle bir aralık yoktur (FIPAT, 2019; Ishikawa ve ark., 2026). Sert zarın en iç katmanı olan dural sınır hücre katmanı 10 μm’den incedir ve 3–8 sıra yassı hücreden oluşur; küçük bir travmanın kesme kuvveti bile bu kırılgan katmanı yarabilir ve klinikte “subdural aralık” diye görülen yarık düzlemi açılır (Ishikawa ve ark., 2026). Hafif bir çarpmanın öyküde önemsiz görünmesi bu yüzden şaşırtıcı değildir.

**Neden kronikleşir?** Yarılmış katmana tekrarlayan kanama ve süregen iltihap lifli zarlar oluşturur ve kronik subdural hematom gelişir (Ishikawa ve ark., 2026); BT’deki ince bölmeler bu zarlara uyar.

**Neden orta hattı geçmez?** Normal koşullarda beyin orağı subdural hematomu tek yarımkürede sınırlar (Ishikawa ve ark., 2026). Tanı ve tedavi kararı beyin cerrahisi ekibine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Beyin-omurilik sıvısı ———
    {
      tur: 'metin',
      md: `**Beyin-omurilik sıvısı** berrak ve renksizdir (Tumani ve ark., 2020); %99’u sudur, kalan %1’i proteinler, iyonlar, haberci maddeler (nörotransmiterler) ve glikozdur (Khasawneh ve ark., 2018). Ortalama bir yetişkinde herhangi bir anda yaklaşık **150 mL** BOS dolaşır (Khasawneh ve ark., 2018). Oysa günde yaklaşık **500 mL** yapılır (OpenStax 13.3): dakikada 0,3–0,4 mL, saatte 18–25 mL, günde 430–530 mL (Khasawneh ve ark., 2018). Bu yüzden BOS bir günde birkaç kez baştan sona yenilenir: bir kaynak 24 saatte yaklaşık dört kez der (Sakka ve ark., 2011), yapım ve hacim sayılarından hesaplayınca da günde 3–4 kez çıkar.

BOS’un çoğunu dört karıncığın hepsinde bulunan **koroid pleksus** (*plexus choroideus*) yapar (OpenStax 13.3; Brinker ve ark., 2014). Sıvının yolu bellidir (Khasawneh ve ark., 2018):

1. Yan karıncıklardan sağ ve sol **karıncıklar arası delikle** (Monro deliği; *foramen interventriculare*) üçüncü karıncığa,
2. oradan **beyin su yoluyla** (Sylvius kanalı; *aquaeductus mesencephali*) dördüncü karıncığa,
3. dördüncü karıncıktan yanlardaki **Luschka** (*apertura lateralis ventriculi quarti*) ve ortadaki **Magendie** (*apertura mediana ventriculi quarti*) açıklıklarıyla subaraknoid aralığa geçer.

Klasik anlatıma göre BOS sonunda örümcek ağı zarın sert zar sinüslerinin içine uzanan çıkıntılarından, **araknoid granülasyonlardan** (*granulationes arachnoideae*) kana geri döner (OpenStax 13.3). Yolculuğu boyunca sinir dokusunun metabolik atıklarını da alıp merkezî sinir sisteminin dışına taşır (OpenStax 13.3).`,
    },
    {
      tur: 'sahne',
      baslik: 'Karıncık sistemi',
      aciklama:
        'Beyin yarı saydam yapıldı; içteki karıncıklar renkli. Mavi yan karıncıklar, sarı karıncıklar arası delik (Monro), turkuaz üçüncü karıncık, mor beyin su yolu (Sylvius), pembe dördüncü karıncık. BOS bu sırayla akar ve dördüncü karıncıktan subaraknoid aralığa çıkar. Karıncıklardaki sıvı toplam BOS’un küçük bir bölümüdür; çoğu beynin dışındaki aralıklardadır.',
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
        { deger: '3–4', birim: 'kez/gün', aciklama: 'BOS’un bir günde baştan sona yenilenme sayısı.' },
        { deger: '%99', aciklama: 'BOS’taki suyun payı; kalan %1 protein, iyon, haberci madde ve glikoz.' },
      ],
      not: 'Kaynaklar: Khasawneh ve ark. (2018); Brinker ve ark. (2014); OpenStax 13.3; Sakka ve ark. (2011).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Araknoid granülasyonlar bebeklikte görülmez ve üç yaşından önce çok seyrektir; genellikle yedi yaşından sonra bulunur ve yaş ilerledikçe sayıları da boyları da artar (Gray, 1918). Doğumda tam gelişmedikleri için bebekte BOS’un emilmesi daha çok sert zarın iç yüzündeki, bebekte daha gelişkin olan toplardamar ağına dayanır (Khasawneh ve ark., 2018).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**BOS:** ~150 mL var, günde ~500 mL yapılır, günde 3–4 kez yenilenir; berrak, renksiz, %99 su.\n\n**Yol:** yan karıncık → Monro deliği → üçüncü karıncık → beyin su yolu (Sylvius) → dördüncü karıncık → Luschka (yanlar) ve Magendie (orta) → subaraknoid aralık → (klasik görüşte) araknoid granülasyonlar → sert zar sinüsleri.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hacim.** Derlemeler yetişkin toplam BOS hacmini 90–150 mL aralığında verir (Brinker ve ark., 2014). Bunun yaklaşık %17’si karıncıklarda, kalanı sarnıçlarda ve subaraknoid aralıktadır (Khasawneh ve ark., 2018); bir başka kaynağa göre 150 mL’nin 25 mL’si karıncıklarda, 125 mL’si subaraknoid aralıklardadır (Sakka ve ark., 2011). Yani BOS’un çoğu karıncıkların içinde değil, beynin ve omuriliğin çevresindedir.

**Koroid pleksusun payı.** Geleneksel anlatıma göre BOS’un çoğunu koroid pleksus salgılar, kalanını beyin dokusu gibi başka kaynaklar ekler. Bu payın kendisi kaynaktan kaynağa değişir: %75 (Khasawneh ve ark., 2018), %80 (Brinker ve ark., 2014); 1996’daki klasik derlemede %90 koroid pleksus, %10 kan-beyin engeli boyunca salgılanan doku arası sıvı (Hladky ve Barrand, 2014). Tek bir yüzdeyi kesin bilgi gibi ezberlemek yerine “çoğunu koroid pleksus yapar” demek doğrudur. Yan karıncıkta koroid pleksus orta kısmın tabanından başlar ve temporal boynuza uzanır; ön ve arka boynuzlarda bulunmaz (MacAulay ve ark., 2022).

**Süzülme değil salgı.** Bazı ders kitapları BOS’u kanın “süzülmesiyle” oluşmuş gibi anlatır ve bu işi karıncıkları döşeyen ependim hücrelerine verir (OpenStax 13.3). Güncel derlemeye göre BOS plazmanın süzüntüsü (ultrafiltratı) değildir; etkin bir sıvı salgısıyla oluşur. Karıncıkları döşeyen ependim duvarı salgı yapmaz ve yetişkinde bir difüzyon engeli de değildir (MacAulay ve ark., 2022). Koroid pleksusun epitel hücreleri tepe yüzlerinde birbirine sıkı bağlantılarla kenetlenir; bu kenet **kan-BOS engelini** kurar (Khasawneh ve ark., 2018).

**Akışı ne sürer?** BOS’u karıncıklar boyunca sürekli yapımdan doğan hidrostatik basınç, atardamar atımları, solunum döngüsü ve ependim hücrelerinin kirpiklerinin yönlü çırpınması iter (MacAulay ve ark., 2022); yapım yerinden emilim yerine akışın büyük kısmı atardamar nabız dalgasına bağlıdır (Sakka ve ark., 2011). Klasik anlayış bu akımı **“üçüncü dolaşım”** diye adlandırır (Brinker ve ark., 2014). Dördüncü karıncıktan omuriliğin merkez kanalına da sıvı inebilir, ama bu kanal kör bir çıkmazdır (OpenStax 13.3).

**Emilim.** Gray’in anlatımında BOS esas olarak araknoid villuslardan büyük sert zar sinüslerine hızla boşalır, küçük bir kısmı da yavaşça gerçek lenf damarlarına geçer (Gray, 1918). Güncel bir derleme de BOS’un bir kısmının kafa sinirlerinin çevresindeki aralıklar boyunca boyun lenf damarlarına aktığını yazar (Brinker ve ark., 2014).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Normal BOS: başvuru değerleri',
      sutunlar: ['Ölçüm', 'Başvuru değeri', 'Açıklama'],
      satirlar: [
        ['Görünüm', 'Berrak, renksiz', 'Gözle değerlendirilir'],
        ['Çekirdekli hücre', 'Mikrolitrede 5’ten az', 'Lenfosit ve monosit; oranları 2:1 ile 3:1 arası'],
        ['Toplam protein', '500 mg/L’den az', 'Nefelometri ya da türbidimetriyle ölçülür'],
        ['Glikoz', 'BOS/serum oranı 0,50’nin üstünde', 'BOS glikozu serum glikozuna oranlanır'],
        ['Laktat', '0,9–2,7 mmol/L', 'Yaşa bağlıdır'],
      ],
      not: 'Kaynak: Tumani ve ark. (2020), “Lomber ponksiyon ve BOS analizi” S1 kılavuzu (kısaltılmış İngilizce sürüm).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Lomber ponksiyonda ne ölçülür?',
      md: `Omurilik belin alt bölümüne kadar inmez; subaraknoid aralık ise 2. sakral omur dolayına kadar uzanır (OpenStax 13.3; Gray, 1918; Soleiman ve ark., 2005). İğne bu yüzden belin alt bölümünden, sert zarı ve örümcek ağı zarı geçerek BOS’a ulaşır; iğnenin hizası ve omuriliğin nerede bittiği “Omurilik ve omurga” bölümünde. Alınan sıvının görünümü, hücreleri, proteini, glikoz oranı ve laktatı başvuru değerleriyle karşılaştırılır (Tumani ve ark., 2020). Ponksiyon sırasında basınç da ölçülebilir: belden ölçülen BOS basıncının başvuru aralığı yan yatarken 7,2–16,8 mmHg’dir (Norager ve ark., 2021).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Bir BOS sonucunu okumak',
      oyku: `34 yaşında bir kadın iki haftadır süren baş ağrısı nedeniyle inceleniyor; nörolog BOS incelemesi istiyor. Hasta yan yatarken belin alt bölümünden yapılan ponksiyonda BOS basıncı 14 mmHg ölçülüyor. Sıvı berrak ve renksiz. Laboratuvar sonucu: mikrolitrede 2 çekirdekli hücre (çoğu lenfosit), toplam protein 380 mg/L, BOS/serum glikoz oranı 0,62, laktat 1,6 mmol/L.`,
      soru: 'İğne neden belin alt bölümünden girildi ve bu sonuçlar başvuru değerlerine göre nasıl yorumlanır?',
      cozum: `**Neden belden?** Omurilik belin alt bölümüne kadar uzanmaz, subaraknoid aralık ise 2. sakral omur dolayına kadar iner (OpenStax 13.3; Gray, 1918; Soleiman ve ark., 2005). İğne bu düzeyde sert zarı ve örümcek ağı zarı geçerek omuriliğe değmeden BOS’a ulaşır (OpenStax 13.3).

**Basınç:** Belden ölçülen BOS basıncının başvuru aralığı yan yatarken 7,2–16,8 mmHg, sırtüstü 5,7–15,5 mmHg’dir (Norager ve ark., 2021). Ölçüm yan yatarken yapıldığı için ilk aralık kullanılır; 14 mmHg bu aralığın içindedir. Bu yüzden bir basınç değeri her zaman ölçüldüğü duruşla birlikte yazılmalıdır.

**Sıvı:** Berrak ve renksiz görünüm, mikrolitrede 5’ten az hücre (2:1–3:1 oranında lenfosit ve monosit), 500 mg/L’nin altında protein, 0,50’nin üstünde glikoz oranı ve 0,9–2,7 mmol/L aralığındaki laktat başvuru değerleridir (Tumani ve ark., 2020). Bu hastanın bütün değerleri bu aralıklar içindedir. Normal bir BOS sonucu baş ağrısının nedenini tek başına açıklamaz ya da dışlamaz; yorum hekimin öykü ve muayeneyle birlikte yaptığı değerlendirmenin parçasıdır. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Hacim** 90–150 mL; karıncıklarda ~%17 (ya da 150 mL’nin 25 mL’si). **Yapım** 0,3–0,4 mL/dk = 430–530 mL/gün; günde 3–4 kez yenilenir.
- **Koroid pleksus** dört karıncıkta; yan karıncığın ön ve arka boynuzunda yok. BOS **etkin salgıdır**, ultrafiltrat değildir; ependim salgı yapmaz.
- **Yol:** yan karıncık → Monro → III. karıncık → Sylvius → IV. karıncık → Luschka (yanlar) + Magendie (orta) → subaraknoid aralık. Merkez kanal kör çıkmazdır.
- **Emilim:** klasik olarak araknoid granülasyonlar → sert zar sinüsleri; ayrıca kafa siniri kılıfları → boyun lenf damarları. Granülasyonlar bebekte yok ya da gelişmemiş.
- **Normal BOS:** berrak, renksiz; <5 hücre/μL; protein <500 mg/L; BOS/serum glikoz >0,50; laktat 0,9–2,7 mmol/L.
- **Subaraknoid aralık** sert zar kesesiyle birlikte yaklaşık S2 hizasında biter (Gray: alt kenarı; MR’da ortalama üst üçte biri; kişiden kişiye değişir); lomber ponksiyon omuriliğin inmediği düzeyden yapılır.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'BOS’un klasik ve güncel modelleri',
      md: `- **Klasik model:** BOS’un çoğu koroid pleksusta yapılır, karıncıklardan subaraknoid aralığa tek yönde akar ve granülasyonlardan emilir. Bu modelin dayandığı Cushing ve Dandy’nin koroid pleksus deneylerinin tasarımı son yıllarda eleştirilmektedir (Khasawneh ve ark., 2018).
- **Orešković–Klarica kuramı:** BOS belirli salgı organlarında değil, dolaşım yolunun her yerinde sürekli oluşur; hacmindeki değişiklikleri BOS’un ozmolaritesi belirler. Klasik kuramla bağdaşmayan bir gözlem: koroid pleksusu çıkarılan hastaların üçte ikisinde hidrosefali yinelediği için yine de şant gerekmiştir (Khasawneh ve ark., 2018).
- **Doku arası sıvının payı:** beyin interstisyel sıvısı birçok yerde BOS ile serbestçe karışır; BOS’a katkısı %10 ile %60 arasında tahmin edilir (Kadry ve ark., 2020). Sağlam kan-beyin engeli boyunca sıvı geri emilemez (Hladky ve Barrand, 2014).
- **Salgının gücü:** koroid pleksus epiteli, iki yanı arasında ozmotik fark yokken, hatta ozmotik farka karşı da sıvı salgılayabilir (MacAulay ve ark., 2022). Bir başka derleme ise salgının ilk aşamasını pencereli kılcallardan pasif bir süzülme olarak anlatır (Khasawneh ve ark., 2018); bu ders etkin salgı modelini esas alır.
- **Akım mı, çalkantı mı?** Güncel görüşe göre BOS dolaşımı yalnızca yönlü bir akım değildir; beynin her yerinde ileri-geri atımlı bir hareket ve kan, doku arası sıvı ve BOS arasında yerel sıvı alışverişi de içerir (Brinker ve ark., 2014). Bir grup iki yaşından küçük çocuklarda beyin su yolunda ters akım bildirmiş ve bunun bu yaş için olağan olabileceğini öne sürmüştür (Hladky ve Barrand, 2014).
- **Sayılar ve tanımlar:** 1996’daki klasik derlemede insanda yapım günde yaklaşık 400 mL kabul ediliyordu (Hladky ve Barrand, 2014); güncel bir derleme 430–530 mL verir (Khasawneh ve ark., 2018). Bir kafa içi basıncı derlemesi BOS hacmini yaklaşık 75 mL olarak verir (Wilson, 2016); bu sayı öteki kaynakların 90–150 mL’sinden çok düşüktür ve derleme neyi ölçtüğünü tanımlamaz, bu yüzden toplam hacim için kullanılmamalıdır.
- **Bir Türk serisi ve bir birim sorunu:** Bolu’da (Abant İzzet Baysal Üniversitesi) beyaz cevher hiperintensitesi olan, inme öyküsü bulunmayan 45 yaş üstü 236 hastada MR ile BOS hacmi ölçülmüş; medyan hacim Fazekas 0–1 grubunda 119, Fazekas 2–3 grubunda 193 bulunmuş ve makalede birim “mm³” yazılmıştır (Kalfaoglu ve ark., 2025). Bu sayılar mm³ olamaz (119 mm³ yaklaşık 0,12 mL’dir) ve örneklem sağlıklı değildir: seri bir norm olarak kullanılamaz.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**BOS nereden çıkar? Tür farkı.** Deneysel veriler kafa ve omurilik sinirlerinin kılıflarını, kalbur kemiğinin delikli levhasını (kribriform plak) ve beyin atardamarlarının dış katmanını (adventisya) BOS’un lenf sistemine çıkışının önemli yolları olarak gösterir (Sakka ve ark., 2011). Kemirgenlerde emilim esas olarak kafa sinirlerinin, özellikle görme ve koku sinirlerinin kılıfları boyunca (koku sinirinde kribriform plaktan geçerek) kafatası dışındaki lenf düğümlerine olur (MacAulay ve ark., 2022); tavşan ve koyun modellerinde de BOS’un önemli bir kısmının boyun lenf damarlarıyla emilebildiği gösterilmiştir (Khasawneh ve ark., 2018). İnsanda ise canlıda yapılan bir BOS izleyici çalışması kribriform plaktan burun mukozasına bir çıkış saptamamıştır; izleyicinin BOS’tan temizlenmesi insanda günler, sıçanda birkaç saat sürer (Ringstad ve Eide, 2024). Kemirgen bulgularını insana taşırken bu fark akılda tutulmalıdır.

**Yaşlanma.** Yaşla birlikte BOS’un yenilenme hızının azalması, bazı nörodejeneratif hastalıklarda da görülen yıkım ürünlerinin beyinde ve BOS’ta birikmesine yol açar (Sakka ve ark., 2011).`,
    },

    // ——— Atık temizliği: glimfatik hipotez ve menenjiyal lenf damarları ———
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '“Beyin uykuda yıkanır” haberleri',
      md: 'Farelerde yapılan bazı çalışmalar, beyindeki atık temizliğinin uykuda hızlandığını öne sürdü (Bohr ve ark., 2022). 2024’teki başka bir fare çalışması ise temizliğin uykuda ve anestezide artmadığını, tersine belirgin biçimde azaldığını buldu (Miao ve ark., 2024). Konu tartışmalıdır ve verilerin çoğu farelerden gelir: “beyin her gece yıkanır” cümlesi bugün kanıtlanmış bir bilgi değildir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beyin atıklarını nasıl temizler?** Klasik yanıt BOS’tur: sıvı sinir dokusunun metabolik atıklarını alıp merkezî sinir sisteminin dışına taşır (OpenStax 13.3). 2012’de bir kemirgen çalışması daha ayrıntılı bir düzen önerdi: BOS, beyin dokusuna dalan atardamarları saran **damar çevresi (paravasküler) aralıklar** boyunca dokuya girer, doku arası sıvı da toplardamarların çevresindeki yollarla temizlenir (Iliff ve ark., 2012; Bohr ve ark., 2022). Bu düzen astrositlerdeki **aquaporin-4** (AQP4) su kanallarına bağımlı göründüğü ve işlevce vücudun lenf sistemine benzediği için **glimfatik sistem** diye adlandırıldı (Bohr ve ark., 2022). Fikri savunan grup da beyne yeni bir “tesisat sistemi” eklemenin tartışma yarattığını kabul eder (Mestre ve ark., 2020). Glimfatik sistem bugün kanıtlanmış bir anatomik sistem değil, büyük kısmı kemirgen verisine dayanan ve tartışılan bir **hipotezdir**.

İkinci gelişme daha sağlam bir zemine oturur: **menenjiyal lenf damarları**. 2015’te iki bağımsız grup farede beyin zarlarında lenf damarları gösterdi (Ishikawa ve ark., 2026). Bu damarlar lenf damarı endotelinin bütün moleküler işaretlerini taşır, BOS’tan hem sıvı hem bağışıklık hücresi taşıyabilir ve boyundaki derin lenf düğümlerine bağlanır (Louveau ve ark., 2015). İnsanda ve marmoset maymununda da gösterilmiş ve yüksek çözünürlüklü klinik MR ile canlıda görüntülenmiştir; primatlarda da sert zar toplardamar sinüslerinin yanında uzanırlar ve kemirgenlerdeki düzeni tekrarlarlar (Absinta ve ark., 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Glimfatik hipotez: lehte, aleyhte; lenf damarlarının sınırı',
      md: `- **Lehte:** Astrositlerinde aquaporin-4 bulunmayan deney hayvanlarında BOS girişi yavaşlamış ve doku arası madde temizliği yaklaşık %70 azalmıştır (Iliff ve ark., 2012). Savunan gruba göre atardamar çevresinden BOS girişi ve toplardamar çevresinden çıkış 1985–1990’da Rennels ve arkadaşlarınca da tanımlanmış, ama o dönem histolojik işlemin yarattığı yapay bir görüntü sayılıp reddedilmişti (Bohr ve ark., 2022). Aynı gruba göre damar çevresinden giriş ve temizlik uykuda daha hızlıdır ve günlük (sirkadiyen) ritimle düzenlenir (Bohr ve ark., 2022).
- **Aleyhte:** 2024’te bir fare çalışmasında beyin temizliği uykuda ve anestezide artmamış, belirgin biçimde azalmıştır (Miao ve ark., 2024). Bağımsız bir test, dokudaki madde taşınmasının akımla (konveksiyon) değil difüzyonla uyumlu olduğunu ve *Aqp4* geninin silinmesinin subaraknoid aralıktan beyne madde taşınmasını bozmadığını bulmuştur (fare, sıçan) (Smith ve ark., 2017). Eleştirel bir derlemeye göre maddelerin hem girişinin hem çıkışının atardamar çevresinden olduğuna iyi kanıt vardır, ama ana çıkışın toplardamar çevresinden olduğuna kanıt yoktur; dokudaki olası bir akımın hızı, difüzyonun yanında maddeyi etkili biçimde taşıyamayacak kadar küçüktür. Derlemenin sonucu: ne glimfatik hipotez ne de ondan önceki klasik hipotez, sıvı ve maddelerin beyne girişini, içinde ilerleyişini ve çıkışını yeterince açıklayabilir (Hladky ve Barrand, 2022).
- **Menenjiyal lenf damarlarının tarihi:** 18. yüzyılın sonunda Paolo Mascagni beyin zarlarında lenf damarları tanımlamış, ama bu bulgu sonraki yüzyıllarda kabul görmemişti (Aspelund ve ark., 2015).
- **Yapı var, işlev ne kadar?** İnsanda “yapının varlığı” ile “işlevin ölçülmesi” ayrı tutulmalıdır (Ishikawa ve ark., 2026). Bir insan izleyici çalışmasında BOS’tan sagital sinüs çevresindeki sert zara 48 saat boyunca doğrudan çıkış görülmüş, ama izleyici hiçbir borusal yapıda toplanmamış, yalnızca yaygın bir boyanma olmuştur (Ringstad ve Eide, 2024). Yine de bu damarların keşfi, merkezî sinir sisteminin sıvı alışverişi, atık temizliği, bağışıklık hücresi trafiği ve “bağışıklık ayrıcalığı” anlayışını değiştirmiştir (Salvador ve ark., 2024).`,
    },

    // ——— Kan-beyin engeli ve sirkumventriküler organlar ———
    {
      tur: 'metin',
      md: `Kandaki her şey beyne giremez. 1880’lerde Paul Ehrlich, toplardamardan verdiği bazı boyaların beyin ve omurilik dışındaki bütün organları boyadığını gördü (Dash, 2026). Bunun nedeni **kan-beyin engelidir**: beyin kılcallarının duvarı, kandaki maddelerin çoğunu geri çevirir. Oksijen kandan beyne, karbondioksit de beyinden kana hızla ve serbestçe geçer (Kadry ve ark., 2020). Beynin başlıca enerji kaynağı olan glikoz ve amino asitler de geçebilir; ama başka maddelerin çoğu, vücudun başlıca savunma hücrelerinden olan akyuvarlar bile geçemez (OpenStax 12.2).

Bu seçicilik beyni korur, ama ilaçla tedaviyi zorlaştırır. Örneğin Parkinson hastalığında hastalara dopaminin kendisi değil, onun öncülü **L-DOPA** verilir; çünkü L-DOPA engeldeki bir taşıyıcıya (L tipi taşıyıcı) bağlanabilir (Dash, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Beynin pencereleri',
      md: 'Kan-beyin engeli her yerde aynı değildir. Karıncıkların çevresindeki birkaç küçük bölgede kılcallar pencerelidir ve engel yoktur (Castro Dias ve ark., 2019). Bu bölgeler kandaki iyonları, çözünmüş madde yoğunluğunu (ozmolalite), asitliği (pH) ve bazı peptitleri izler ya da kana nöropeptit ya da melatonin salar. Karıncıkların çevresinde bulundukları için bunlara **sirkumventriküler organlar** (“karıncık çevresi organlar”), kandaki maddeleri algılayıp kana salgı yapabildikleri için de “beynin pencereleri” denir (Miyata, 2022).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Keşif.** 1913’te Ehrlich’in çalışma arkadaşı Edwin Goldmann aynı boyaları doğrudan BOS’a verdiğinde sinir dokusunun boyandığını, öteki dokuların boyanmadığını gösterdi (Dash, 2026; Kadry ve ark., 2020). Demek ki engel kan ile beyin arasındaydı.

**Üç arayüz.** Beyin kandan üç ayrı arayüzle ayrılır: beyin kılcallarındaki **kan-beyin engeli**, koroid pleksustaki **kan-BOS engeli** ve beyin zarlarındaki **araknoid engel** (Kadry ve ark., 2020). Koroid pleksusun kılcalları pencerelidir ve kandan gelen moleküllerin geçişine izin verir; bu yüzden orada engeli damar değil, onu saran epitel hücreleri kurar (Castro Dias ve ark., 2019).

**Kan-beyin engelinin yapısı.** Engelin asıl yeri beyin kılcallarının **endotel hücreleridir**; komşu hücrelerle etkileşim ise engelin gelişmesi için gerekli görünür (Dash, 2026). Beyin endotelinde pencere yoktur; hücreler kesintisiz ve karmaşık **sıkı bağlantılarla** birbirine bağlanır ve hücreler arasından serbest geçişi önler; veziküllerle taşıma (pinositoz) da çevresel damarlara göre çok azdır (Castro Dias ve ark., 2019). Endotelin fiziksel, taşıyıcı ve metabolik özellikleri engeli birlikte kurar (Daneman ve Prat, 2015). Kılcalın dış yüzünün yaklaşık %99’unu **astrositlerin uç ayakçıkları** örter (Kadry ve ark., 2020). Endotel, bazal zar, bazal zara gömülü **perisitler**, astrositler, mikroglia ve nöronlar birlikte **nörovasküler birim** diye anılır (Kadry ve ark., 2020).

**Kim geçer, kim geçemez?** Yağda çözünen birçok molekül engelden pasif olarak geçebilir (Kadry ve ark., 2020). Glikoz ise bir taşıyıcıyla girer: glikoz taşıyıcısı **GLUT-1** engelin endotelinde çok boldur (Castro Dias ve ark., 2019). Tersine **P-glikoprotein** pompası, zararlı olabilecek yağda çözünen molekülleri beyinden kana geri atar (Castro Dias ve ark., 2019). Sonuçta engel, büyük moleküllü ilaçların neredeyse tamamını ve küçük moleküllü ilaçların %98’inden fazlasını beyne sokmaz (Pardridge, 2005).`,
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
          'Endotel hücreleri: pencere yok, kesintisiz sıkı bağlantılar, az pinositoz',
          'Astrosit ayakçıkları kılcal yüzünün ~%99’unu örter; perisitler bazal zara gömülüdür',
        ],
        [
          'Kan-BOS engeli',
          'Koroid pleksus',
          'Epitel hücreleri ve tepe yüzlerindeki sıkı bağlantılar',
          'Kılcallar pencerelidir; engeli damar değil epitel kurar',
        ],
        [
          'Araknoid engel',
          'Sert zarın hemen altı',
          'Araknoid engel hücreleri: yaygın, kesintisiz sıkı bağlantılar',
          'Damarsızdır; “üçüncü engel” sayılır',
        ],
        ['Yumuşak zar (engel değil)', 'Beyin yüzeyi', '—', 'Hücreleri arasında sıkı bağlantı yoktur; çözünmüş maddelere engel olmaz'],
        [
          'Sirkumventriküler organlar (engel yok)',
          'Karıncıkların çevresi',
          '—',
          'Kılcallar pencerelidir; kandaki maddeler sinir-hormon ve duyu işlevli özel nöronlara ulaşır',
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
        ['Koroid pleksus', '*Plexus choroideus*', 'Miyata’nın listesinde var; BOS’u yapar'],
        [
          'Subkomissural organ',
          '*Organum subcommissurale*',
          'TA2 üçüncü karıncığın periventriküler organları arasında sayar; Miyata’nın listesinde yok',
        ],
      ],
      not: 'Duyusal organlar kandaki iyonları, ozmolaliteyi, pH’yi, bazı amino asitleri ve nöropeptitleri izler; salgı organları nöropeptit ya da melatonin salar (Miyata, 2022). Latince adlar: FIPAT (2019).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Beynin pencereleri: karıncıkların çevresi',
      aciklama:
        'Sağ yarı kaldırıldı; sol yarıya içeriden bakıyoruz, yüz sağda. Kabuk ve beyin sapı yarı saydam. Turkuaz: üçüncü karıncık, beyin su yolu ve dördüncü karıncık; sarı: epifiz ve hipofiz bezi. Sirkumventriküler organlar karıncıkların çevresindeki küçük bölgelerdir; modelde bunlardan yalnızca epifiz ve hipofiz bezi ayrı yapı olarak bulunur. Hipofiz bezinden bu gruba yalnızca nörohipofiz (arka lob ve hipofiz sapı) girer; modelde bez tek parça olarak durur. Hipotalamus yön bulmak için işaretlendi.',
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
      md: `- **Taşıyıcıdan yararlanmak:** dopaminin öncülü L-DOPA engeldeki L tipi taşıyıcıya bağlanabilir; Parkinson hastalarına bu yüzden dopamin yerine L-DOPA verilir (Dash, 2026).
- **Dışarı atılmak:** P-glikoprotein pompası zararlı olabilecek yağda çözünen molekülleri beyinden kana geri atar (Castro Dias ve ark., 2019); engel küçük moleküllü ilaçların %98’inden fazlasını beyne sokmaz (Pardridge, 2005).
- **Suyu çekmek:** su beyne kolayca girer; bu yüzden toplardamardan verilen ve engelden zor geçen **mannitol** beyni ozmotik olarak susuzlaştırır ve kafa içi basıncını düşürür (Dash, 2026).
- **Engel yıkılınca:** beyin tümörleri engeli yıkar ve tümörün çevresinde ödeme yol açar (Dash, 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Engelin ayrıntısı.** “Kan-beyin engeli” terimini 1898’de Lewandowsky kullanmıştır (Dash, 2026). Perisitler endotelle aynı bazal zarı paylaşır ve N-kaderin ile konneksinler üzerinden endotelle doğrudan “çivi-yuva” temasları kurar; düz kas hücrelerine benzeyen kasılma özellikleri sayesinde kılcal çapını ve beyin kan akımını bir ölçüde düzenleyebilirler (Kadry ve ark., 2020). Engelin toplam yüzeyi, doku gramı başına 150–200 cm² mikrodamar yüzeyinden hesaplanınca yetişkinde 12–18 m² bulunur (Kadry ve ark., 2020). Beyin mikrodamarlarının Na⁺ ve Cl⁻ geçirgenliği çevresel mikrodamarlarınkinden 1000 kattan fazla düşüktür (Hladky ve Barrand, 2014). İlaç tasarımında kutupsal yüzey alanı 80 Å²’yi aşan ve altıdan fazla hidrojen bağı kurma eğilimindeki bileşiklerin merkezî sinir sistemine girişinin sınırlı olduğu kabul edilir (Kadry ve ark., 2020).

**Pencerelerin de sınırı var.** Sirkumventriküler organların damarları da boyut seçicidir: yalnızca molekül ağırlığı 10.000’in altındaki maddeleri geçirir (kemirgen verisi). Bu organların uç bölgelerinde astrositler ve tanisitler yoğun bir engel kurarak kandan gelen maddelerin komşu beyin dokusuna serbestçe yayılmasını önler (Miyata, 2022). Hangi yapının bu gruba girdiği de tanıma bağlıdır: Miyata koroid pleksusu sirkumventriküler organ sayar ama subkomissural organı saymaz (Miyata, 2022); TA2 subkomissural organı üçüncü karıncığın periventriküler organları arasında listeler (FIPAT, 2019).`,
    },

    // ——— Beyin dolaşımı ———
    {
      tur: 'metin',
      md: `Beynin kanını iki çift atardamar getirir: **iç karotis arterler** (*arteria carotis interna*) ve **vertebral arterler** (*arteria vertebralis*) (OpenStax 20.5). İç karotis arter kafatasına şakak kemiğindeki karotis kanalından, vertebral arterler foramen magnumdan girer; iki vertebral arter birleşerek **baziler arteri** (*arteria basilaris*) yapar, bu arter de beyin sapına ve beyinciğe dal verir (OpenStax 13.3). Kabaca kural şudur: büyük beynin ön bölümünü iç karotisler, geri kalan beyni vertebral arterlerle ilişkili dallar besler (OpenStax 20.5). İç karotisin dallarından **ön beyin arteri** (*arteria anterior cerebri*) frontal lobu, **orta beyin arteri** (*arteria media cerebri*) temporal ve parietal lobları besler; bu iki lob, beyin damar olaylarının (inmenin) en sık görüldüğü yerlerdir (OpenStax 20.5).

Beynin tabanında iki sistem birbirine bağlanarak bir halka kurar: **Willis halkası** (Willis çemberi; *circulus arteriosus cerebri*). Halka, bir parçası daralsa ya da tıkansa bile beynin beslenmesini sürdürebilen bir atardamar kavşağıdır (OpenStax 13.3). Beyinden dönen kan ise yukarıda gördüğümüz sert zar sinüsleriyle iç juguler venlere akar.`,
    },
    {
      tur: 'sahne',
      baslik: 'Alttan bakış: beynin atardamarları',
      aciklama:
        'Beyin yarı saydam; atardamarlar kırmızı. Alttan bakıyoruz, ön taraf ekranın üstünde. İç karotis arterler ve vertebral arterler görünür; vertebral arterler birleşerek baziler arteri yapar. Beynin tabanında bu atardamarlar Willis halkasıyla birbirine bağlanır.',
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
        { deger: '5–10', birim: 'saniye', aciklama: 'Beynin kan akımı tümüyle durursa bilincin kaybolduğu süre.' },
      ],
      not: 'Kaynaklar: Siwicka-Gieroba ve ark. (2022); Dash (2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Willis halkasının parçaları.** Bu derste sayıldığı biçimiyle tam bir halkayı yedi atardamar parçası kurar (parça sayısı sayım yöntemine göre değişir; halkayı 9 ya da 10 parçalı sayan anlatımlar da vardır: Karatas ve ark., 2016): iki ön beyin arterinin başlangıç (A1) bölümleri, bu ikisini birleştiren **ön bağlantı arteri** (*arteria communicans anterior*) (OpenStax 20.5), iki arka beyin arterinin başlangıç (P1) bölümleri ve iç karotisi arka beyin arterine bağlayan iki **arka bağlantı arteri** (*arteria communicans posterior*) (Karatas ve ark., 2015). Halka, beyin tabanındaki interpedinküler sarnıcın içinde durur (Gray, 1918). Vertebral arterlerden çıkan dallar ayrıca birleşerek omuriliğin ön yüzünü besleyen **ön spinal arteri** yapar (OpenStax 13.3).

**Akımın sayıları.** Dinlenmede beyin kalp debisinin yaklaşık %14’ünü, dakikada ~700 mL kan alır (Wilson, 2016); başka bir kaynak bu payı %20 olarak verir (Kızılgöz ve ark., 2022). Kaynaklar arasındaki bu farkı akılda tutmak için payı %14–20 diye bilmek yeterlidir. Normal koşullarda beyin kan akımı 100 g doku başına dakikada yaklaşık 50 mL’dir (Siwicka-Gieroba ve ark., 2022); genç yetişkinde gri cevherde ~80, beyaz cevherde ~20 mL/100 g/dk (Khartabil ve ark., 2026). Uyanık sağlıklı insanda beynin oksijen tüketimi (CMRO₂) ortalama 3,3 mL/100 g/dk’dır (Siwicka-Gieroba ve ark., 2022).

**Otoregülasyon.** Beyin, perfüzyon basıncı belirli bir aralıkta değişse de kan akımını görece sabit tutar. Aralık kaynağa göre değişir: 50–150 mmHg (Peterson ve ark., 2011) ya da 60–160 mmHg (Siwicka-Gieroba ve ark., 2022); aralığın dışında akım basınçla birlikte belirgin biçimde değişir (Peterson ve ark., 2011). Perfüzyon basıncının 50 mmHg’nin altına düşmesi beyin iskemisine yol açar (Siwicka-Gieroba ve ark., 2022). Kan akımının düzenlenmesi üç ana ilkeyle anlatılır: basınç otoregülasyonu, **akım-metabolizma eşleşmesi** (beynin akımı o andaki metabolik etkinliğe göre ayarlaması) ve sinirsel düzenleme (Peterson ve ark., 2011); güncel bir derleme konuyu dört ana başlıkta toplar (Claassen ve ark., 2021).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Willis halkası: ön ve arka dolaşım',
      aciklama:
        'Yalnızca atardamarlar, alttan bakış; ön taraf ekranın üstünde. Kırmızı: iç karotisten beslenen ön dolaşım (ön ve orta beyin arterleri). Mor: vertebral ve baziler arterden beslenen arka dolaşım. Sarı: bağlantı arterleri. Ön bağlantı arteri sağ ve sol ön beyin arterlerini birbirine, arka bağlantı arterleri iç karotisi arka beyin arterine, yani ön dolaşımı arka dolaşıma bağlar. Halkanın parçaları öne çıkarıldı, besleyen büyük arterler soluk. Modeldeki halka tamdır; gerçekte halkanın bir ya da birkaç parçası birçok kişide ince ya da eksiktir ve “tam halka” oranı tanıma göre seriden seriye çok değişir (Karatas ve ark., 2016).',
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
        ['25–35', 'EEG’de önce hızlı dalgalar kaybolur'],
        [
          '17–18',
          'Yavaş dalgalar artar; nöronların zar gradyanlarını yitirmeye başladığı kritik iskemi eşiği. Bu düzeyde enfarkt saatlerce gecikebilir',
        ],
        ['10–12 ve altı', 'Enfarkt eşiği: EEG susar, hücre hasarı geri dönüşsüz olur'],
      ],
      not: 'Kaynaklar: Khartabil ve ark. (2026); Siwicka-Gieroba ve ark. (2022); Foreman ve Claassen (2012). Eşikler, iskeminin nicel EEG ile saptanması üzerine bir derlemeden alınmıştır ve yaklaşık değerlerdir.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kansız kalan beyin: saniyeler, dakikalar, saatler',
      md: `Beynin kan akımı tümüyle durursa 5–10 saniyede bilinç kaybolur; akım birkaç dakika içinde yeniden başlamazsa kalıcı beyin hasarı oluşur (Dash, 2026). Akım tümüyle durmayıp azaldığında ise tablo kademelidir: kritik iskemi eşiği olan 17–18 mL/100 g/dk düzeyinde enfarkt saatlerce gecikebilir, 10–12 mL/100 g/dk ve altında hasar geri dönüşsüz olur (Foreman ve Claassen, 2012). Akımı azalmış ama henüz ölmemiş dokunun varlığı, beyin damar tıkanmalarında zamanın neden bu kadar önemli olduğunu açıklar.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Toplardamar dönüşü.** Beynin toplardamarlarında kapakçık yoktur ve duvarları kas dokusu içermediği için çok incedir (Gray, 1918). Çadır üstündeki toplardamarlar yüzeyel ve derin iki sisteme ayrılır (Ota, 2024). Kabuğun toplardamarları **köprü venler** aracılığıyla üst sagital sinüse, oradan sinüslerin birleşim yerine (torkula) ve çoğu kişide sağ transvers sinüse akar (Wilson, 2016); üst sagital sinüs iç art kafa çıkıntısı yakınında bir yana, genellikle sağa sapar ve o yanın transvers sinüsü olarak devam eder (Gray, 1918). Derin toplardamarların çoğu **iç serebral vene** (*vena interna cerebri*), bir kısmı **Rosenthal’in bazal venine** (*vena basalis*) dökülür; ikisi de **Galen’in büyük serebral venine** (*vena magna cerebri*) yönelir (Ota, 2024). Galen veni düz sinüs yoluyla birleşim yerine, oradan çoğu kişide sol transvers sinüse boşalır (Wilson, 2016). Daha derin (ön) bölgelerin toplardamarları **kavernöz sinüslere** (*sinus cavernosus*), onlar da üst ve alt petrozal sinüsler yoluyla juguler bulbusa boşalır (Wilson, 2016).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**“Tam halka” çoğu tanımda bir azınlıktır; ama ne kadar azınlık?** Hipoplazik arter içermeyen tam halka olguların yarısından azında görülür; bildirilen oranlar %4,6 ile %72,2 arasında değişir ve bu genişliğin nedeni tam halkanın ve hipoplazinin farklı tanımlanmasıdır (Karatas ve ark., 2016). Norveç’teki Tromsø çalışması 40–87 yaşlarında 1.864 kişiyi 3T TOF-MR anjiyografiyle incelemiş ve 1 mm’den ince parçaları eksik ya da hipoplazik saymıştır: tam halka yalnızca %11,9’da vardı; en sık varyant (%27,8) iki arka bağlantı arterinin birden olmamasıydı; 47 ayrı varyant bulundu ve bunların beşi örneklemin %68,5’ini oluşturuyordu; yaş arttıkça eksik parça sayısı artma eğilimindeydi (Hindenes ve ark., 2020). Aşağıdaki tablodaki seriler, çoğu Türkiye’den, aynı sorunun yanıtının tanıma ne kadar bağlı olduğunu gösterir.`,
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
        ['Muğla (tek merkez)', '384 kişi', 'MR anjiyografi', 'Yalnızca agenezi “normal dışı” sayıldı', '%85,4 “normal”'],
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
      md: `**Erişkin, fetal, geçiş tipi.** Halkanın düzeni erişkin, fetal ve geçiş tipi diye de sınıflanır (tanımlar Beynin atardamarları dersinde): İzmir kadavra serisinde %87 erişkin, %9 fetal, %4 geçiş tipi (Karatas ve ark., 2016); İzmir BT anjiyografi serisinde %82, %17 ve %1 (Karatas ve ark., 2015); Muğla MR anjiyografi serisinde %85, %13 ve %2 bulunmuştur (Yeniçeri ve ark., 2017). Kadavra serisinde en sık varyasyon hipoplazidir ve en çok arka bağlantı arterinde (%85) görülür (Karatas ve ark., 2016).

**Ön bölüm.** İstanbul Adli Tıp Kurumu’nda incelenen 182 taze kadavrada ön bağlantı arteri olguların %47,25’inde tipik yapıdaydı, %52,75’inde varyasyon vardı (Nteli Chatzioglou ve ark., 2025). Ankara’da Etlik Şehir Hastanesi’ndeki 1.537 MR anjiyografide ön bağlantı arteri kompleksinin varyantları olguların %60’ında görüldü; en sık ön dolaşım varyantları A1 bölümünün hipoplazisi ve aplazisiydi (Kaplanoglu ve Kurtulus Ozturk, 2024).

**Toplumlar arasında fark var mı?** İran’dan bir kadavra serisine ve literatür taramasına dayanan bir görüşe göre varyasyonların dağılımının toplumlar arasında farklı olduğuna kanıt yoktur (Eftekhar ve ark., 2006); Muğla serisinin yazarları ise varyasyonların coğrafi ve etnik farklılık gösterebileceğini yazar (Yeniçeri ve ark., 2017). Soru tartışmalıdır; seriler arasındaki farkların önemli bir kısmı yöntem ve tanım farkıdır. 42 çalışmayı tarayan sistematik bir derleme 82 varyasyonu beş grupta toplayan yeni bir sınıflama önermiştir (Ayre ve ark., 2022). Parça sayısı bile sayıma bağlıdır: aynı makale halkayı bir yerde “9 kenarlı bir dokuzgen”, birkaç satır sonra “10 atardamar parçasından” oluşan bir yapı diye anlatır (Karatas ve ark., 2016); bu derste sayılan yedi parça, İzmir BT anjiyografi çalışmasının saydığı parçalardır (Karatas ve ark., 2015).

**Damarların sinirleri.** Beyin damarlarının dışarıdan gelen sinirleri üç kaynaktandır: trigeminal gangliyon (duyusal), üst servikal gangliyon (sempatik) ve sfenopalatin gangliyon (parasempatik) (Peterson ve ark., 2011).

**Toplardamarlar kişiye özgüdür.** Beynin toplardamar drenajı kişilerin yaklaşık yarısında belirgin biçimde asimetriktir; transvers sinüs drenajı yaklaşık %40’ında sağda, %18’inde solda baskındır (Wilson, 2016). Beyin toplardamarlarında temelde kapakçık yoktur ve kafa içindeki akımın yönü sabit değildir; her toplardamarın işlevi kişiden kişiye, aynı kişide de beyin kan akımına göre değişir (Ota, 2024). Sinüslerin kas duvarı yoktur; sert zar katlantıları üçgen bir boşluk (lümen) oluşturur ve bu, sinüsleri basıya karşı atardamarlardan daha savunmasız kılar (Wilson, 2016).`,
    },

    // ——— Kafa içi basıncı ———
    {
      tur: 'metin',
      md: `**Kapalı kutudaki üç hacim.** Yetişkinde kafatası esnemeyen bir kutudur ve içinde üç şey vardır: beyin, kan ve BOS. **Monro–Kellie öğretisine** göre kafatası sağlamken bu üç hacmin toplamı sabittir: biri artarsa (örneğin bir kanama yer kaplarsa) öteki ikisinden biri ya da ikisi birden azalmak zorundadır (Wilson, 2016). Kafa içindeki basıncın, yani **kafa içi basıncının** (KİB) nasıl değiştiğini anlamak için bu basit ilkeden başlanır.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Besleyenler:** iç karotisler (ön) ve vertebral–baziler sistem (arka); beynin tabanında **Willis halkası** ikisini bağlar.\n\n**Engel:** beyin kılcallarının endoteli kan-beyin engelini kurar; oksijen, karbondioksit ve glikoz geçer, maddelerin çoğu geçemez.\n\n**Basınç:** kafatası esnemez; beyin + kan + BOS = sabit (Monro–Kellie).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Normal kafa içi basıncı kaç?** Sanıldığı kadar kesin bir sayı yoktur. Sistematik bir derlemeye göre başvuru değerleri sırtüstü yatarken 0,9–16,3 mmHg, ayaktayken −5,9 ile 8,3 mmHg arasındadır: basınç duruşla değişir ve ayakta eksiye bile inebilir. Belden ölçülen BOS basıncının başvuru aralığı yan yatarken 7,2–16,8, sırtüstü 5,7–15,5 mmHg’dir (Norager ve ark., 2021). Bir başka kaynak fizyolojik KİB’i bir yaşından önce 3–4 mmHg, yetişkinde 10–15 mmHg olarak verir (Sakka ve ark., 2011). Sağlıklı insanda yapılmış normal ölçümler azdır (Norager ve ark., 2021); bu yüzden bir KİB değeri duruş ve ölçüm yeri belirtilmeden yorumlanmamalıdır.

**Kan, BOS’tan çok daha hızlı değişen bir hacimdir.** Herhangi bir anda kafa içinde ~100–130 mL kan bulunur (~%15’i atardamarlarda, ~%40’ı toplardamarlarda, ~%45’i mikrodolaşımda). BOS ise dakikada yalnızca ~0,35 mL yapılır ve bu yavaş yapım, beyne sürekli giren ve çıkan büyük kan akımının yanında çok küçük kalır (Wilson, 2016). Bu yüzden BOS boşaltmak KİB’i düşürebilse de travma gibi ani bir durumda yüksek KİB’in nedeni nadiren BOS birikmesidir (Wilson, 2016).`,
    },
    {
      tur: 'animasyon',
      ad: 'monro-kellie',
      duzey: 'lisans',
      baslik: 'Monro–Kellie ilkesi ve basınç–hacim eğrisi',
      aciklama:
        'Kaydırıcıyla kafatasına hacim ekle ya da kitleyi kendiliğinden büyüt: önce BOS ve toplardamar kanı yer açar, tampon azaldıkça basınç hızla yükselir. Eğri şematiktir. Yeşil bant sırtüstü başvuru aralığıdır (0,9–16,3 mmHg): sırtüstü yatarken kafa içinden ölçülen basıncın, kafa içi basıncı bakımından sağlıklı sayılan ve başka bir nedenle beyin cerrahisi girişimi gereken her yaştan hastada bulunan aralığı. Tamamen sağlıklı insanda bu ölçüm yapılmadığı ve örneklem küçük olduğu (6 çalışma, 62 kişi) için derleme bu aralığı klinikte kullanılabilecek bir başvuru aralığı saymaz (Norager ve ark., 2021). Yukarıda anlatıldığı gibi basınç duruşa göre de değişir. 22 mmHg çizgisi, ağır kafa travmasında KİB’in altında tutulması hedeflenen değerdir (Schizodimos ve ark., 2020). Perfüzyon basıncı, ortalama arter basıncından KİB çıkarılarak hesaplanır (Wilson, 2016).',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Görüntülemede zarlar, damarlar ve basınç',
      md: `- **Menenjiyal lenf damarları** insanda ve marmoset maymununda yüksek çözünürlüklü klinik MR ile canlıda görüntülenebilmiştir (Absinta ve ark., 2017).
- **Willis halkası** MR anjiyografi ve BT anjiyografiyle incelenir; hangi parçanın “eksik” sayılacağı seçilen eşiğe bağlıdır: Tromsø çalışması 3T TOF-MR anjiyografide 1 mm’den ince parçaları eksik ya da hipoplazik saydı (Hindenes ve ark., 2020; Karatas ve ark., 2015).
- **Optik sinir kılıfı çapı** 5 mm’yi aştığında, birçok çalışmada KİB’in 20 mmHg ya da üstünde olmasıyla ilişkili bulunmuştur (Schizodimos ve ark., 2020).
- **İzleyiciyle MR:** sağlıklı gönüllülerde MR izleyicileri köprü venler boyunca subaraknoid aralığa geçer (Smyth ve ark., 2024); BOS’a verilen izleyicinin 48 saat boyunca sagital sinüs çevresindeki sert zara doğrudan geçtiği görülmüştür (Ringstad ve Eide, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Arayüzler:** kan-beyin engeli (endotel), kan-BOS engeli (koroid pleksus epiteli), araknoid engel; yumuşak zar engel değildir.
- **Sirkumventriküler organlar:** duyusal OVLT, subfornikal organ, area postrema; salgı median eminens, nörohipofiz, epifiz.
- **Willis halkası:** 2 × A1 + ön bağlantı arteri + 2 × P1 + 2 × arka bağlantı arteri; arka bağlantı arteri iç karotisi arka beyin arterine bağlar; halka interpedinküler sarnıçtadır.
- **Kan akımı:** ~50 mL/100 g/dk (gri ~80, beyaz ~20); kalp debisinin %14–20’si. Eşikler: 25–35 (EEG hızlı dalgalar kaybolur), 17–18 (kritik iskemi), 10–12 ve altı (enfarkt).
- **Otoregülasyon:** perfüzyon basıncı 50–150 (ya da 60–160) mmHg; 50’nin altı iskemi.
- **KİB:** sırtüstü 0,9–16,3, ayakta −5,9 ile 8,3 mmHg; ağır kafa travmasında hedef KİB < 22, perfüzyon basıncı > 60 mmHg (önerilen aralık 60–70).
- **Toplardamarlar:** üst sagital sinüs → birleşim yeri → (çoğunlukla sağ) transvers → sigmoid → iç juguler ven; derin sistem → Galen veni → düz sinüs.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kafa içi basıncı: eşikler ve tuzaklar',
      md: `- **Kılavuz hedefi:** ağır kafa travmasında tedavinin birincil amacı KİB’i 22 mmHg’nin altında, beyin perfüzyon basıncını 60 mmHg’nin üstünde tutmaktır; kılavuzun önerdiği perfüzyon basıncı aralığı 60–70 mmHg’dir (Schizodimos ve ark., 2020).
- **İki eşik, iki amaç:** optik sinir kılıfı çalışmalarındaki ≥20 mmHg bir ilişki eşiğidir, 22 mmHg ise kılavuzun tedavi hedefidir (Schizodimos ve ark., 2020); ikisi birbirinin yerine kullanılmamalıdır.
- **Normal değer duruşa bağlıdır:** sırtüstü 0,9–16,3, ayakta −5,9 ile 8,3 mmHg; sağlıklı insanda normal ölçümler azdır (Norager ve ark., 2021).
- **Hacimlerin ölçeği:** erkekte ortalama kafa içi hacmi (beyin ve BOS dahil) 1.473 mL’dir; beynin dinlenmede dakikada aldığı ~700 mL kan bu hacmin yarısına yakındır (Wilson, 2016).
- **BOS mu, kan mı?** BOS boşaltmak KİB’i düşürebilir, ama travmada yüksek KİB’in nedeni nadiren BOS birikmesidir (Wilson, 2016).
- **Ozmotik tedavi:** toplardamardan verilen mannitol beyni ozmotik olarak susuzlaştırarak KİB’i düşürür (Dash, 2026).
- **Toplardamar tarafı:** sinüslerin kas duvarı yoktur ve basıya atardamarlardan daha açıktır. Transvers sinüslerden biri baskınsa bu çoğunlukla sağdakidir (kişilerin yaklaşık %40’ında sağ, %18’inde sol); baskın sinüsün tıkanması, baskın olmayanınkinden çok daha fazla etki yapar (Wilson, 2016).
- **Tarih:** kafa içi basıncının “bilimi” ilk kez 1783’te öne sürülmüştür (Wilson, 2016).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Gece yükselen basınç',
      oyku: `42 yaşında bir motosiklet sürücüsü, kazadan sonra yoğun bakımda izleniyor. Kafa içi basıncı sürekli ölçülüyor: ilk saatlerde 14–16 mmHg olan değer gece 24–26 mmHg’ye çıkıyor. Optik sinir kılıfı çapı iki gözde de 5,8 mm ölçülüyor. Görüntülemede kafa içinde yer kaplayan bir kanama var; karıncıklar bir gün önceki görüntüye göre daralmış.`,
      soru: 'Bu sayılar ne anlatıyor ve Monro–Kellie öğretisiyle tablo nasıl açıklanır?',
      cozum: `**Eşikler:** Ağır kafa travması kılavuzu KİB’i 22 mmHg’nin altında, perfüzyon basıncını 60 mmHg’nin üstünde tutmayı hedefler (Schizodimos ve ark., 2020); 24–26 mmHg bu hedefin üstündedir. Optik sinir kılıfı çapının 5 mm’yi aşması birçok çalışmada KİB’in 20 mmHg ya da üstünde olmasıyla ilişkili bulunmuştur (Schizodimos ve ark., 2020); iki bulgu birbirini destekler, ama iki eşik farklı amaçlarla konmuştur.

**Mekanizma:** Kafatası sağlamken beyin, kan ve BOS hacimlerinin toplamı sabittir; kanamanın eklediği hacim ötekilerden birinin ya da ikisinin azalmasıyla dengelenir (Wilson, 2016). Daralan karıncıklar BOS’un yerinden itildiğini düşündürür. BOS boşaltmak KİB’i düşürebilir, ama travmada yüksek KİB’in nedeni nadiren BOS birikmesidir: kafa içindeki ~100–130 mL kan, dakikada yalnızca ~0,35 mL yapılan BOS’a göre çok daha hızlı değişen bir hacimdir (Wilson, 2016).

**Tedavi seçeneklerinden biri:** toplardamardan verilen mannitol, engelden zor geçtiği için beyni ozmotik olarak susuzlaştırır ve KİB’i düşürür (Dash, 2026). Tedavi kararını yoğun bakım ve beyin cerrahisi ekibi verir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
