import type { DersBolumu } from '../../../types';

/** Kafatası ile omurganın birlikte görüldüğü sahnede yüzün kemikleri gizlenir; yalnızca atlas ve aksis kalır. */
const YUZ_KEMIKLERI = [
  'alt-cene-kemigi',
  'ust-cene-kemigi',
  'elmacik-kemigi',
  'burun-kemigi',
  'gozyasi-kemigi',
  'damak-kemigi',
  'sapan-kemigi',
  'alt-burun-kavkasi',
  'dil-kemigi',
];

/**
 * 02. bölüm: sert zarın yapısı. Katlar (endosteal, meningeal, sınır hücre katmanı), lifler ve lif tabakaları, kalınlık,
 * mekanik değerler ve yaş, kemiğe yapışma, hücreler, damarlar ve kan-zar engelinin olmaması, kafa içi ve omurilik sert
 * zarı farkı. Kıvrımlar 3. bölümde, sinüsler 4. bölümde, atardamar ve sinirler 5. bölümde, "subdural" yarığın tarihi
 * ve interdural aralığın tam anlatımı 8. bölümde, lenf damarları ve bağışıklık 9. bölümde, kanamalar 11. bölümde, cerrahi 13. bölümde işlenir. Bilgiler
 * S2/A notlarından; sınır hücre katmanı, kalınlık ve görüntüleme için S2/B, S2/C ve S2/D notlarındaki ilgili satırlar.
 */
export const sertZarinYapisi: DersBolumu = {
  id: 'sert-zarin-yapisi',
  baslik: 'Sert zar: yapısı',
  bloklar: [
    // ——— Sert zar nedir? (temel) ———
    {
      tur: 'metin',
      md: `İlk derste beyni saran üç zarı kısaca tanıdık. Bu bölümde en dıştakine, **sert zara** (*dura mater*) yakından bakıyoruz.

Sert zar kalın ve yoğun bir zardır. Esnemez (Gray, 1918). Bütün beyni ve omuriliği saran güçlü, lifli bir kılıftır. Kafatasının iç yüzüne ve omurga kanalının duvarına tutunur (OpenStax 13.3). Kafatasına ve omurga kanalına giren büyük damarları da sarar (OpenStax 13.3).

Kafatasının içinde sert zarın iki işi vardır. Birincisi, kemiklerin iç yüzünü döşer. Yani kafatası kemiklerinin iç kemik zarıdır. İkincisi, beyni koruyan bir örtüdür (Gray, 1918).

Kafatasındaki ve omurilikteki sert zar bazı yönlerden farklıdır. Ama ikisi tek ve kesintisiz bir zardır. Kafatası tabanındaki büyük delikte (*foramen magnum*) birbirine devam eder (Gray, 1918). Aradaki farkı bölümün sonunda göreceğiz.`,
    },
    {
      tur: 'metin',
      md: `Sert zar uzun süre damarsız ve pek iş görmeyen bir doku sayıldı (Kiss-Bodolay ve ark., 2023). Bugünkü bilgi bunun tersini söylüyor. Sert zar özelleşmiş, canlı bir dokudur. İçinde karmaşık bir lif ağı, yoğun ve çeşitli damarlar, lenf damarları ve geniş bir sinir ağı vardır (Joost ve ark., 2026). Lenf damarlarının insanda var olduğu doğrudan gözlemlerle gösterildi (Ishikawa ve ark., 2026). Ama insanda nasıl ve ne kadar çalıştıkları henüz az biliniyor (Ishikawa ve ark., 2026). Sert zar beynin gelişimine, damarların işleyişine ve hastalıklara da katılır (Ishikawa ve ark., 2026).

Sert zarın yapı taşları basittir. Bir yanda bağ dokusunun hücreleri vardır. Bunlara **fibroblast** denir. Öte yanda bu hücrelerin çevresini dolduran sağlam bir ara madde vardır. Bu ara madde **kolajen** adlı protein liflerinden çok zengindir (Joost ve ark., 2026). Sert zarın gücü bu liflerden gelir.`,
    },
    {
      tur: 'metin',
      md: `Sert zar ilk bakışta tek bir yaprak gibi görünür. Mikroskopla bakınca kat kat olduğu anlaşılır.

Klasik kitaplar kafatasındaki sert zarı **iki kat** sayar (Gray, 1918):

- **Endosteal kat** dıştadır ve kemiğe bakar. Kafatası kemiklerinin iç kemik zarıdır. Kemikleri besleyen damarlar bu katta uzanır (Gray, 1918). Ona **periostal kat** da denir.
- **Meningeal kat** içtedir ve beyne bakar. Beyni saran asıl örtü budur (Ishikawa ve ark., 2026). Gray ona “destek katı” der (Gray, 1918).

Bu iki kat çoğu yerde sıkıca kaynaşmıştır (Gray, 1918). Yalnızca iki tür yerde birbirinden ayrılır (Ishikawa ve ark., 2026). Birincisi, beynin kanını toplayan toplardamar kanallarıdır. Bunlara **toplardamar sinüsü** ya da **sert zar sinüsü** (*sinus durae matris*) denir. Sinüsler iki katın arasında uzanır (Gray, 1918). İkincisi, sert zarın içeri doğru kıvrıldığı yerlerdir. Bu kıvrımları meningeal kat yapar (Joost ve ark., 2026).

Bugünkü anlatım bir kat daha sayar. Meningeal katın altında çok ince bir hücre katı vardır. Adı **sert zar sınır hücre katmanıdır** (*dural border cell layer*). Böylece sert zarın dıştan içe üç katı olur: endosteal kat, meningeal kat ve sınır hücre katmanı (Ishikawa ve ark., 2026).

Bu katları dersin başındaki “Kemikten kabuğa” çiziminde, “Sert zarın katları” düğmesiyle görebilirsin.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- Sert zar kalın, lifli ve esnemeyen bir kılıftır. Beyni ve omuriliği sarar.
- Kafatasında iki işi vardır: kemiğin iç kemik zarıdır ve beyni korur.
- Klasik anlatımda iki katı vardır: dışta endosteal, içte meningeal kat. Bugünkü anlatım en içe ince bir sınır hücre katmanı ekler.
- İki kat yalnızca toplardamar sinüslerinin olduğu yerde ve kıvrımlarda ayrılır. Öteki her yerde kaynaşıktır.`,
    },

    // ——— Ne kadar kalın, ne kadar sağlam? (temel) ———
    {
      tur: 'metin',
      md: `Öteki iki zar ince ve narindir (Joost ve ark., 2026). Sert zar onlardan kalındır, ama yine de incedir. Bir derlemeye göre ortalama kalınlığı 0,33 ile 0,56 mm arasındadır (Ishikawa ve ark., 2026). Yani yaklaşık yarım milimetre kalınlığındadır. Kalınlık her yerde aynı değildir. Türkiye’de 30 otopside yapılan bir çalışmada yan kafa ve art kafa bölgesindeki sert zar, şakaktakinden daha kalın çıktı (Çavdar ve ark., 2022).

Sert zar çekilince çok az uzar. Şakak bölgesinden alınan parçalar kopmadan önce boylarının ancak yüzde 11 kadarı uzayabildi (Zwirner ve ark., 2019). Bu, sert zarın neden “esnemeyen” bir zar diye anlatıldığını gösterir.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Sert zar kemik de yapabilir',
      md: 'Sert zar yalnızca bir örtü değildir. Gelişim sırasında, kafatasının tepesindeki sagital dikişin altında bulunan sert zar hücreleri göç eder. Bu hücreler kemik yapan hücrelere (osteoblast) dönüşür ve kafatası kubbesinin oluşmasına katkıda bulunur. Sert zar bu yeteneğini erişkinde de korur. Kafatasında bir kemik eksiği olunca kemiğin onarılmasını destekler (Ishikawa ve ark., 2026).',
    },

    // ——— Kemiğe yapışma (temel) ———
    {
      tur: 'metin',
      md: `Sert zar kafatasına her yerde aynı sıkılıkta yapışmaz. En sıkı yapıştığı iki yer vardır: kafatası kemiklerinin birleştiği çizgilerin, yani **dikişlerin** karşısı ve kafatasının tabanı (Gray, 1918). Dikiş yerlerinde endosteal katın kolajen demetleri kemiğin dikiş dokusuna doğrudan devam eder (Ishikawa ve ark., 2026).

Bu yapışma yaşla değişir. Yaş ilerledikçe endosteal kat kalınlaşır, sertleşir ve kafatasına daha sıkı tutunur (Ishikawa ve ark., 2026).

Sağlıklı insanda sert zar kafatasına yapışıktır. Bu yüzden kafatasının içinde kemik ile sert zar arasında doğal bir boşluk yoktur (FIPAT, 2019). Böyle bir aralık ancak bir darbe ya da hastalık sert zarı kemikten ayırınca açılır (FIPAT, 2019).`,
    },

    // ——— Lisans: katmanların ayrıntısı ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Endosteal kat.** Kafatasının iç yüzünü döşeyen kemik zarıdır ve çoğunlukla fibroblastlardan oluşur (Ishikawa ve ark., 2026). Kolajen demetleri kafatasının iç yüzüne, özellikle dikiş yerlerinde, sıkıca tutunur. Endosteal kat kafatasının dışına da uzanır. Kafatasını delip geçen küçük toplardamarların deliklerinden (emissary delikler) ve büyük delikten geçerek kafatasının dış yüzündeki kemik zarına devam eder (Ishikawa ve ark., 2026). Gray de sert zarın kafa tabanındaki deliklerden dışarı çıktığını yazar. Orada kafatasının dış kemik zarına (*pericranium*) karışır (Gray, 1918). Gray’e göre sert zarın dış yüzü pürüzlü ve liflidir, iç yüzü ise düzdür (Gray, 1918).

**Meningeal kat.** Merkezî sinir sistemini saran asıl örtüdür. Mikroskopta endosteal kata benzer, ama birim alanda daha çok fibroblast taşır (Ishikawa ve ark., 2026). Kolajeni daha azdır. Lifleri kalın demetler yerine yaprak gibi lif tabakaları hâlindedir. Bu yüzden endosteal kattan daha esnektir (Ishikawa ve ark., 2026). Sert zarın kıvrımlarını bu kat yapar. Meningeal kat yer yer içeri doğru katlanır. Beyin orağı ve beyincik çadırı gibi kıvrımlar böyle oluşur ve beyni mekanik olarak destekler (Joost ve ark., 2026). Kıvrımları bir sonraki bölümde inceleyeceğiz.

**Gray’in tarifi.** Gray sert zarı beyaz lifli doku ile elastik liflerin oluşturduğu yassı lif tabakaları olarak anlatır. Bu lif tabakalarını aralarındaki boşluklar ve damarlar iki kata ayırır. Ama bu ayrılma tam değildir (Gray, 1918). UTHealth ders kitabı da sert zarı yoğun, kolajenden zengin bir bağ dokusu kılıfı olarak tanımlar (Dafny, 2020).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın üç katı',
      sutunlar: ['Kat', 'Yeri', 'Yapısı', 'Önemi'],
      satirlar: [
        [
          'Endosteal (periostal) kat',
          'En dışta, kemiğe yapışık',
          'Çoğunlukla fibroblast. Aralarında kolajen, ince lif ve elastik lif örgüsü',
          'Kafatasının iç kemik zarıdır. Kemiği besleyen damarlar buradadır. Dikişlerde kemiğe kaynaşır. Yaşla kalınlaşır ve sertleşir.',
        ],
        [
          'Meningeal kat (*dura propria*)',
          'Ortada',
          'Ishikawa’ya göre yaklaşık 78–82 lif tabakası. Birim alanda daha çok fibroblast',
          'Beyni saran asıl örtüdür. Kıvrımları yapar. Endosteal kattan daha esnektir.',
        ],
        [
          'Sınır hücre katmanı',
          'En içte, örümcek ağı zara dayanır',
          '10 µm’den ince. 3–8 sıra yassı hücre. Kolajen çok az, sıkı bağlantı yok',
          'Mekanik olarak zayıftır. Darbe ya da ameliyat bu katı yarabilir; “subdural” denen yarık böyle açılır.',
        ],
      ],
      not: 'µm (mikrometre), milimetrenin binde biridir. TA2 kafatasındaki sert zarda iki kısım adlandırır: periostal kısım (*pars periostea durae cranialis*; eş anlamlısı *endocranium*) ve meningeal kısım (*pars meningea durae cranialis*). Sınır hücre katmanı için TA2’de terim yoktur. Kaynaklar: Gray (1918); FIPAT (2019); Ishikawa ve ark. (2026); Joost ve ark. (2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sınır hücre katmanı.** Sert zarın en iç katıdır. Örümcek ağı zarla buluşan yüzü oluşturur (Ishikawa ve ark., 2026). Hücreleri sert zarın öteki fibroblastlarından daha dallıdır. Birbirlerine sıkı bağlantılarla (*tight junction*) kenetlenmezler (Joost ve ark., 2026). Hücrelerin arasında görece geniş, açık yarıklar vardır. Bu yarıklarda kolajen lifi bulunmaz. Onların yerine ince taneli bir ara madde vardır (Joost ve ark., 2026).

Bu yapı onu zayıf kılar. Sert zar da örümcek ağı zar da mekanik olarak sağlamdır. Ama aradaki bu sınır, olağan dışı bir zorlamada kolayca ayrılır (Joost ve ark., 2026). Küçük bir darbenin ya da ameliyatın kesme kuvveti bu katı yarabilir. Klinikte “subdural boşluk” denen şey, sert zarın içinde böyle açılan bir yarıktır. Normal yaşamda böyle bir boşluk yoktur (Ishikawa ve ark., 2026). “Subdural” boşluğun tarihini ve bugünkü tanımını “Zarlar arası boşluklar ve sisternalar” bölümünde göreceğiz.`,
    },

    // ——— Lisans: kalınlık ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Sert zarın kalınlığı için tek bir sayı vermek zordur. Sayı ölçülen bölgeye, kişinin yaşına ve ölçüm yöntemine göre değişir. Aşağıdaki tablo farklı çalışmaları bir araya getiriyor. Bunların ikisi Türkiye’den.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zar ne kadar kalın?',
      sutunlar: ['Çalışma', 'Kimlerde', 'Bölge', 'Kalınlık'],
      satirlar: [
        ['Ishikawa ve ark. (2026)', 'Derleme', 'Genel ortalama', '0,33–0,56 mm'],
        ['Zwirner ve ark. (2019), Almanya (Leipzig)', '75 kadavra, 2–94 yaş', 'Şakak', '0,68 ± 0,20 mm (0,40–1,40)'],
        [
          'Çavdar ve ark. (2022), İstanbul',
          '30 otopsi',
          'Dört bölge',
          'Şakak 0,35 ± 0,11; alın 0,38 ± 0,12; yan kafa 0,44 ± 0,13; art kafa 0,46 ± 0,18 mm',
        ],
        ['Kizmazoglu ve ark. (2019), İzmir', '10 otopsi, 31–54 yaş', 'Sağ alın', '0,65 ± 0,07 mm'],
        ['Fam ve ark. (2018)', '20 kadavra', 'Kafa tabanı (şakak kemiğinin kayalık kısmının tepesi)', 'Ortalama 0,36 mm (0,27–0,46)'],
        ['Kinaci ve ark. (2020)', 'İnsan ve 10 hayvan türü', 'Türler arası karşılaştırma', 'İnsan 564 µm; at 313, sığır 311, domuz 304 µm'],
      ],
      not: '± işaretinden sonraki sayı standart sapmadır: ölçümlerin ortalama çevresinde ne kadar dağıldığını gösterir. Parantez içindeki sayılar en küçük ve en büyük ölçümlerdir. Ölçümler farklı bölgelerden ve farklı yöntemlerle alındı. Kaynaklar tablodaki çalışmalardır.',
    },

    // ——— Lisans: lifler ve mekanik ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Lifler nasıl dizilir?** Kafatasındaki sert zarda kolajen lifleri paralel demetler hâlinde dizilmez. İç içe geçen, çok yönlü ve eş merkezli bir örgü kurar. Bu düzen dokuyu biçim bozulmasına karşı dayanıklı kılar (Chirica ve ark., 2026).

**Kaç lif tabakası var?** Kaynaklar farklı sayılar verir. Ishikawa ve arkadaşlarının derlemesine göre meningeal kat yaklaşık 78–82 ince lif tabakasından (lamel) oluşur (Ishikawa ve ark., 2026). Zu ve arkadaşları ise dokuz kadavranın sert zarını boyayarak inceledi. Bütün kafatası sert zarında dört-beş iç içe lif tabakası saydılar. Omurilik sert zarında ise çoğunlukla uzunlamasına uzanan üç lif tabakası gördüler (Zu ve ark., 2026). Yani ilk sayı yalnızca meningeal kata, ikincisi bütün kafatası sert zarına aittir.

Kafatası sert zarında tip I kolajen baskındır. Elastik lif azdır ve en azı kafa tabanındadır (Zu ve ark., 2026).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Şakaktaki sert zar ne kadar sağlam?',
      ogeler: [
        {
          deger: '70 ± 44',
          birim: 'MPa',
          aciklama: 'Esneklik katsayısı: dokunun gerilmeye karşı ne kadar katı olduğu. Kişiden kişiye çok değişir.',
        },
        { deger: '7 ± 4', birim: 'MPa', aciklama: 'Çekme dayanımı: dokunun kopmadan taşıyabildiği en büyük çekme gerilimi.' },
        { deger: '%11 ± 3', aciklama: 'En büyük uzama: kopmadan önce boyunun ne kadar uzayabildiği.' },
        { deger: '%73 ± 8', aciklama: 'Taze sert zarın ağırlıkça su oranı.' },
      ],
      not: 'MPa (megapaskal), bir yüzeye düşen kuvvetin, yani gerilimin birimidir. Mekanik değerler 73 kadavradan alınan 117 şakak örneğinde ölçüldü. Su oranı ise 30 kadavradan alınan taze örneklerde ölçüldü (Zwirner ve ark., 2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yön önemli olabilir.** Bazı çalışmalarda sert zar her yöne aynı direnci göstermedi. Buna **yöne bağımlılık** (anizotropi) denir. Çin’de 29 erişkinden alınan 275 örnekte, ön-arka (sagital) yönde çekilen sert zar, enine (koronal) yönde çekilenden daha katı çıktı (Wang ve ark., 2025). Türkiye’de 30 otopsilik bir çalışmada da sonuç benzerdi. Alın, şakak ve art kafa sert zarında ön-arka yöndeki en büyük çekme kuvveti, enine yöndekinden büyüktü (Çavdar ve ark., 2022).

Ama konu tartışmalıdır. Zwirner ve arkadaşlarının aktardığına göre sert zar genellikle her yöne aynı davranan bir doku sayılır. Kendileri ise şakak sert zarının kemiğe bakan yüzünde lifleri belli yönlere dizilmiş buldu (Zwirner ve ark., 2019). Bir haritalama çalışması ise önceki ölçümlerde görülen bu “her yöne aynı” davranışın lif yönleriyle açıklanabileceğini öne sürer (Niestrawska ve ark., 2023).

**Yaş da önemlidir.** Sert zarın mekanik özellikleri yaşla azalır. Sağ ve sol taraf ya da cinsiyet ise anlamlı bir fark yaratmaz (Zwirner ve ark., 2019). Mikroskopta da yaşın izi görülür. Gençlerde kolajen demetleri yoğun, düzenli ve dalgalıdır. Elastik lifler bu demetlere paralel ve bütündür (Wang ve ark., 2025). Yaşlılarda kolajen solgunlaşır. Lifli düzenini ve dalgalılığını yitirip şekilsizleşir. Elastik lifler azalır ve parçalanır (Wang ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kemiğe yapışma kanamanın biçimini belirler',
      md: 'Sert zarın periostal yaprağı dikişlere sıkıca yapışıktır. Bu yüzden kemik ile sert zar arasına dolan kan, yani **epidural kanama**, dikiş çizgilerini geçmez. Kan dikişte durur ve kalınlaşır. Bilgisayarlı tomografide (BT) mercek biçiminde, iki yüzü dışbükey görünür (Kim ve Gean, 2011). Bebeklerde sert zar kafatasına, özellikle dikişlerin çevresinde, çok sıkı yapışıktır. Bu yüzden küçük bebeklerde akut epidural kanama görece nadirdir (Araki ve ark., 2017). Kanamaların ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümünde.',
    },

    // ——— Lisans: damarlar ve engel ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Damarlar.** Sert zar damarca çok zengindir. Dinlenme hâlinde sert zar dokusu, aynı miktardaki beyin dokusunun aldığı kanın en az %80’i kadar kan alır. Birim dokuya düşen bu kan akımına doku perfüzyonu denir. Değer, kana verilen çok küçük kürelerle yapılan ölçümlerden gelir (Ishikawa ve ark., 2026). Büyük atardamar ve toplardamarlar daha çok kemiğe bakan endosteal taraftadır. Meningeal tarafta ise sık bir kılcal damar ağı ve küçük toplardamarlardan bir ağ vardır (Ishikawa ve ark., 2026). Sert zarı besleyen atardamarları “Sert zarın atardamarları, sinirleri ve ağrı” bölümünde göreceğiz.

**Kan-zar engeli yok.** Beynin yüzeyindeki damarlar, örümcek ağı zarın altındaki boşluktan (subaraknoid boşluk) geçer. Bu damarların hücreleri sıkı bağlantılarla kenetlidir. Sert zarın damarları öyle değildir (Joost ve ark., 2026). Duvarlarında küçük pencereler vardır. Bunlara **pencereli** (fenestralı) damar denir. Hücreleri birbirine sıkı bağlantılarla kenetlenmez (Joost ve ark., 2026). Bu yüzden sert zarda kan ile zar dokusu arasında bir engel yoktur (Absinta ve ark., 2017). Kanda dolaşan sıvılar ve küçük maddeler sert zarın dokusuna sızabilir (Absinta ve ark., 2017). Bu özellik sert zarın bağışıklık gözetimindeki ve beyin-omurilik sıvısının (BOS) boşaltılmasındaki rolüyle uyumludur (Joost ve ark., 2026). Bu rolleri “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde göreceğiz.

Peki kandan sızan maddeler beynin çevresindeki sıvıya neden geçmez? Onları sert zar değil, örümcek ağı zarın engel katmanı durdurur (Brøchner ve ark., 2015). Bu engeli ve onu gösteren boya deneyini “Örümcek ağı zar” bölümünde inceleyeceğiz.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'MR’da sağlıklı sert zar da boyanır',
      md: 'Beyin damarlarında kan ile beyin dokusu arasında bir engel vardır: kan-beyin engeli (Absinta ve ark., 2017). Sert zarda bu engel yoktur. Bu yüzden damardan verilen kontrast madde sert zarı normalde boyar (Mahendru ve Chong, 2009). MR’da kullanılan gadolinyumlu boya da sert zarın damarlarından sızar. Sağlıklı kişide görülen ince ve çoğu kez kesintili sert zar boyanması bundandır (Absinta ve ark., 2017). Normal boyanma ince, düzgün ve kesintilidir. Beyin yarımkürelerinin dış yüzünü örten sert zarda, kafa tabanındakinden daha belirgin görülür (Mahendru ve Chong, 2009). Boyanma örüntülerinin ayrıntısı “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Türkiye’den: sert zarın ölçüldüğü çalışmalar',
      md: `- Koç Üniversitesi’nden (İstanbul) Çavdar ve arkadaşları 30 otopside sert zarı dört bölgeden ölçtü. Yan kafa ve art kafa sert zarı şakaktakinden anlamlı olarak kalındı. Art kafa sert zarı alındakinden de belirgin biçimde kalındı. Erkeklerde alın ve şakak sert zarı kadınlarınkinden kalındı (Çavdar ve ark., 2022).
- Aynı çalışma, ameliyatta sert zarın yerine konan malzemeleri de ölçtü: kas zarından alınan yamalar (fasya lata ve şakak fasyası), kafa derisinin altındaki sıkı zar (galea) ve yapay sert zar. Bunların kalınlığı ve mekanik özellikleri insan sert zarına benzemedi (Çavdar ve ark., 2022).
- Dokuz Eylül Üniversitesi’nden (İzmir) Kizmazoglu ve arkadaşları 10 otopsinin sağ alın bölgesinden sert zar aldı. Kişiler 31–54 yaşındaydı. Ortalama kalınlık 0,65 ± 0,07 mm, çekme dayanımı 7,01 ± 0,77 MPa idi. Esneklik katsayısı (Young katsayısı) 60,18 ± 10,77 MPa ölçüldü (Kizmazoglu ve ark., 2019).
- Sert zarın yerine konan malzemelerin ayrıntısı “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },

    // ——— Kafatasında ve omurgada (temel) ———
    {
      tur: 'metin',
      md: `**Kafatasında ve omurgada sert zar.** Sert zar büyük delikten aşağı iner ve omuriliği bir kese gibi sarar. Ama yolda bir katını bırakır. Kemiğe yapışan endosteal kat büyük delikte biter. Omurga kanalını onun yerine omurların kendi kemik zarı döşer (Gray, 1918). Yani omurilikteki sert zar, kafatasındaki sert zarın yalnızca iç (meningeal) katına karşılık gelir (Gray, 1918).

Bunun önemli bir sonucu var. Kafatasında sert zar kemiğe yapışıktır ve arada doğal bir boşluk yoktur (FIPAT, 2019). Omurgada ise sert zar ile kemik arasında gerçek bir aralık vardır. Bu aralığa **epidural boşluk** denir. İçinde gevşek bağ dokusu ve bir toplardamar ağı bulunur (Gray, 1918). Yağ da içerir (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Kafatasından omurgaya: sert zarın değiştiği yer',
      aciklama:
        'Kafatası ve beyin orta hattan ikiye ayrıldı. Sol yarıya içeriden bakıyoruz: yüz sağda, ense solda. Yüzün kemikleri gizlendi; boynun ilk iki omuru (atlas ve aksis) görünür. Modelde sert zar yalnızca beyincik çadırı olarak vardır; açık krem renkli yaprak odur. Kafatasının iç yüzündeki sert zar burada görünmez, ama kemiğin hemen içinde, kemiğe yapışık durur. Büyük delikte kafatasındaki sert zar omurga kanalına iner. Kemiğe yapışan dış katı orada biter. Modelde omurilik yoktur; omurilik soğanının altındaki kanal boş görünür. Renkler gerçeğe yakın.',
      sahne: {
        katmanlar: ['kemik', 'yuz', 'kabuk', 'beyaz', 'derin', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir', ...YUZ_KEMIKLERI],
        yarim: 'sol',
        bakis: 'ic-sol',
        vurgula: ['katman:kemik', 'katman:yuz', 'katman:kabuk', 'katman:beyaz', 'katman:derin', 'katman:sap', 'katman:zar'],
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı (sert zar)' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'atlas', metin: 'Atlas: omurga kanalı' },
        ],
        noktalar: [{ nokta: 'buyuk-delik', metin: 'Büyük delik' }],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      md: '“Epidural boşluk” sözü iki yerde farklı anlam taşır. Omurgada sert zar ile kemik arasında gerçek bir boşluk vardır. İçinde yağ ve toplardamarlar bulunur. Kafatasında ise sert zar kemiğe yapışıktır. Orada bir aralık ancak darbe ya da hastalıkla açılır (FIPAT, 2019; Byrne ve Dafny, 2026).',
    },

    // ——— Lisans: kafatasında ve omurgada ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kafatasında ve omurgada sert zar',
      sutunlar: ['Özellik', 'Kafatasında', 'Omurgada'],
      satirlar: [
        ['Katlar', 'Endosteal kat + meningeal kat + sınır hücre katmanı', 'Yalnızca meningeal kat + sınır hücre katmanı'],
        [
          'Kemikle ilişkisi',
          'Kemiğe yapışık; en sıkı dikişlerde ve kafa tabanında',
          'Kemikten ayrı; omurga kanalını omurların kendi kemik zarı döşer',
        ],
        [
          'Epidural boşluk',
          'Doğal değil; TA2 “her zaman bulunmayan” diye işaretler',
          'Gerçek; gevşek bağ dokusu, yağ ve toplardamar ağı içerir',
        ],
        ['Toplardamarlar', 'Sinüsler sert zarın iki katı arasında', 'Toplardamar ağı sert zar ile omurların kemik zarı arasında'],
        [
          'Lif düzeni (Zu ve ark., 2026)',
          'Dört-beş iç içe lif tabakası; tip I kolajen baskın; elastik lif az',
          'Çoğunlukla uzunlamasına üç lif tabakası; tip III/tip I kolajen oranı daha yüksek',
        ],
        ['Damar ve sinir', 'Damarca çok zengin', 'Damarca fakir; içine az sayıda sinir izlenmiş'],
        ['Sinir kılıfları', 'Lifli katı, kafa tabanındaki deliklerden çıkan sinirlere kılıf yapar', 'Sinir köklerine kılıf olur'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Ishikawa ve ark. (2026); Joost ve ark. (2026); Zu ve ark. (2026); Byrne ve Dafny (2026).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Klasik anlatım: iki kat (endosteal + meningeal). Güncel anlatım: üç kat (+ sınır hücre katmanı).
- İki kat yalnızca sinüslerde ve kıvrımlarda ayrılır. Kıvrımları meningeal kat yapar.
- Sınır hücre katmanında sıkı bağlantı yoktur ve kolajen çok azdır. “Subdural” yarık bu katmanda açılır.
- Kafatasında epidural ve subdural boşluk doğal değildir. TA2 ikisini de “her zaman bulunmayan” diye işaretler.
- Omurilik sert zarında endosteal kat yoktur. Bu yüzden omurgada gerçek bir epidural boşluk vardır.
- Sert zar damarları pencerelidir; kan ile zar arasında engel yoktur. MR’da ince, kesintili sert zar boyanması normaldir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'MR’da boyanan sert zar',
      oyku: '34 yaşında bir kadın, ara ara olan baş ağrısı nedeniyle kontrastlı beyin MR’ı çektiriyor. Raporda beynin dış yüzü boyunca, kafatasının iç yüzünde ince, düzgün ve yer yer kesintili bir sert zar boyanması yazıyor. Kafa tabanında boyanma daha az belirgin. Başka bir bulgu yok. Hasta bu boyanmanın bir hastalık işareti olup olmadığını soruyor.',
      soru: 'Sağlıklı bir kişide sert zar neden boyanır ve bu görünüm normal sayılabilir mi?',
      cozum: `**Neden boyanır?** Sert zarın damarları pencerelidir ve hücreleri sıkı bağlantılarla kenetlenmez (Joost ve ark., 2026). Yani sert zarda, beyin damarlarındaki gibi bir engel (kan-beyin engeli) yoktur. Bu yüzden damardan verilen kontrast madde sert zarı normalde boyar (Mahendru ve Chong, 2009). Gadolinyumlu MR boyası da sert zarın damarlarından dokuya sızar (Absinta ve ark., 2017).

**Normal görünüm nedir?** Normal sert zar boyanması ince, düzgün ve kesintilidir. Beyin yarımkürelerinin dış yüzünde, kafa tabanındakinden daha belirgindir (Mahendru ve Chong, 2009). Bu hastadaki görünüm bu tarife uyuyor.

**Neden beyin dokusu boyanmıyor?** Kandan sızan madde sert zarda kalır. Beynin çevresindeki sıvıya geçişini örümcek ağı zarın engel katmanı durdurur (Brøchner ve ark., 2015).

Boyanmanın biçimine göre yorum “Zarları görüntülemek ve ameliyatta zarlar” bölümünde ayrıntısıyla anlatılır. Tanı kararı hekime aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Uzman: ince yapı ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**İnce yapı.** Sert zarı elektron mikroskobunda incelersek kat sayısı artar. Kolajenin düzenine, damar yoğunluğuna ve hücrelerine göre beşe kadar ayrı kat sayılabilir (Joost ve ark., 2026). Bir mekanik çalışma da insan sert zarını beş katlı bir doku olarak tanımlar. Bu dokuda sık ve yoğun bir kolajen ağı vardır. Ağın içinde birkaç dağınık fibroblast ve elastin lifi bulunur (Zwirner ve ark., 2019).

Endosteal kattaki fibroblastların çoğu yassıdır. Altlarındaki beyin dokusunun eksenine paralel dizilirler (Ishikawa ve ark., 2026). Hücrelerin arasında kolajen lifleri, çok ince lifler (mikrolif) ve elastik lifler örülüdür. Katın mekanik gücünü bunlar sağlar (Ishikawa ve ark., 2026).

Meningeal kattaki 78–82 lif tabakasının (lamel) her biri demetlenmiş kolajen liflerinden yapılmıştır (Ishikawa ve ark., 2026). Komşu lif tabakalarındaki kolajen plakları farklı yönlere uzanır. Ishikawa ve arkadaşlarına göre beyin orağında ve beyincik çadırında sık görülen küçük deliklerin (fenestrasyon) bir nedeni budur (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kolajen hangi yöne uzanır?** Taramalı elektron mikroskobu sert zarın iki yüzü arasında bir fark gösterir. Şakak sert zarının örümcek ağı zara bakan yüzünde kolajen çoğunlukla gelişigüzel dağılmıştır. Yalnızca damarların geçtiği yerlerde lifler hizalanır. Kemiğe bakan yüzde ise kolajen belirgin biçimde hizalıdır. Üst üste binen lif tabakaları birbirine neredeyse dik uzanır (Zwirner ve ark., 2019). Yazarlar bu düzene ve ölçümlerdeki büyük farklara bakarak şakak sert zarını yöne bağımlı bir doku sayar (Zwirner ve ark., 2019).

Lif yönü bölgeden bölgeye de değişir. Bir haritalama çalışmasında kolajen yüksek ölçüde hizalı çıktı. Ama çoğu bölgede ana lif yönü ne ön-arka ne de iç-dış eksenine denk geliyordu. Yazarlara göre bu, önceki çalışmalarda görülen “her yöne aynı” (izotrop) davranışı açıklayabilir (Niestrawska ve ark., 2023). Öte yandan Wang ve arkadaşlarının örneklerinde sert zar açıkça yöne bağımlıydı. Kolajen liflerine bağlı ortanca katılık ön-arka yönde 27,0 MPa, enine yönde 18,1 MPa idi (Wang ve ark., 2025).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sert zarın mekanik ölçümleri',
      sutunlar: ['Çalışma', 'Örnekler', 'Bulgular'],
      satirlar: [
        [
          'Zwirner ve ark. (2019)',
          '73 kadavradan 117 şakak örneği (2–94 yaş); su oranı için 30 kadavra',
          'Esneklik 70 ± 44 MPa; dayanım 7 ± 4 MPa; uzama %11 ± 3. Taraf ve cinsiyetle değişmez, yaşla azalır. Su %73 ± 8. 4 °C’de saklanan dokuda ölümden sonraki 139 saat içinde bozulma izi yok.',
        ],
        [
          'Zwirner ve ark. (2020)',
          'Aynı ekip: 75 kişiden 124 şakak örneği (3 haftalık–94 yaş)',
          'Ortanca çekme dayanımı 5,56 MPa; en küçük 1,23, en büyük 21,68 MPa. Yani değerler ortancanın %22’si ile %390’ı arasında. Dayanım yaşla azalır.',
        ],
        ['Kizmazoglu ve ark. (2019), İzmir', '10 otopsi, sağ alın', 'Dayanım 7,01 ± 0,77 MPa; Young katsayısı 60,18 ± 10,77 MPa.'],
        [
          'Wang ve ark. (2025), Çin',
          '29 erişkin (20–86 yaş), 275 örnek',
          'Kolajen liflerine bağlı katılık gençte 28,0, yaşlıda 15,3 MPa (ortanca). Ön-arka yön enine yönden katı. Yan kafa sert zarı art kafadakinden katı ve dayanıklı. Cinsiyet farkı yok.',
        ],
        [
          'Çavdar ve ark. (2022), İstanbul',
          '30 otopsi',
          'Alın, şakak ve art kafada ön-arka yöndeki en büyük çekme kuvveti enine yöndekinden büyük. Erkekte alın ve şakak sert zarı daha kalın.',
        ],
        [
          'Pearcy ve ark. (2022)',
          'Sistematik derleme',
          'Kafa modellerinde en çok kullanılan esneklik değeri (31,5 MPa) yalnızca iki kadavradan 11 teste dayanır. Omurilik sert zarının mekaniği üzerine veri çok azdır.',
        ],
      ],
      not: 'Ortanca: sıraya dizilen değerlerin tam ortasındaki değer. Kaynaklar tablodaki çalışmalardır.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sert zar yaşla kalınlaşır mı, incelir mi?',
      md: `Kaynaklar farklı sonuçlar bildirir. Leipzig’de alınan şakak sert zarı örneklerinde kalınlık ile yaş arasında zayıf bir pozitif ilişki bulundu (r = 0,288). Yani yaşlılarda şakak sert zarı biraz daha kalındı (Zwirner ve ark., 2019). Kafa tabanında ise tersi görüldü. Şakak kemiğinin kayalık kısmının tepesinden alınan 20 örnekte, yaşlılarda sert zar anlamlı olarak daha inceydi (Fam ve ark., 2018).

Cinsiyet için de tablo karışıktır. İstanbul’daki 30 otopside erkeklerin alın ve şakak sert zarı daha kalındı (Çavdar ve ark., 2022). Kafa tabanında kadınlarda incelme eğilimi vardı, ama bu eğilim anlamlılık sınırında kaldı (p = 0,06). Kilo, boy, boyun çevresi ve beden kitle indeksiyle güçlü bir ilişki çıkmadı (Fam ve ark., 2018).

Bir derleme bu farkları çelişki saymaz. Bazı çalışmalar yaşla kolajen birikimine bağlı kalınlaşma bulmuştur. Başkaları özellikle kafa tabanında ve sinüs komşuluğunda incelme bulmuştur. Derlemeye göre bu, sert zarın farklı bölgelerinin yaşla farklı yollardan yeniden biçimlenmesini yansıtır (Chirica ve ark., 2026). Yaşla sert zarda kolajen birikir, liflerin düzeni bozulur ve lifler arasında çapraz bağlar artar. Buna **zar fibrozu** (*meningeal fibrosis*) denir. Sonuçta doku daha katı ve daha az esnek olur (Chirica ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Mekanik sayılara ne kadar güvenilir?',
      md: `Kafa yaralanmalarını bilgisayarda canlandıran modeller sert zar için bir sayı kullanır. En sık kullanılan esneklik değeri 31,5 MPa’dır. Bu değer 1970’te yalnızca iki kadavradan yapılan 11 teste dayanır (Pearcy ve ark., 2022). Oysa yeni ölçümler sert zarın kişiden kişiye çok değiştiğini gösterir. Şakak sert zarında esneklik katsayısı 70 ± 44 MPa çıktı (Zwirner ve ark., 2019). Aynı ekibin 124 şakak örneğinde en zayıf örneğin dayanımı 1,23 MPa, en güçlü örneğinki 21,68 MPa çıktı (Zwirner ve ark., 2020).

Ölüm sonrası zaman ise sanıldığı kadar sorun olmayabilir. 4 °C’de saklanan sert zar, ölümden sonraki 139 saat içinde mekanik bir bozulma izi göstermedi (Zwirner ve ark., 2019). Omurilik sert zarı için durum daha zayıftır. Mekanik verisi azdır ve tek bir çalışmada en çok yedi kadavra incelenmiştir (Pearcy ve ark., 2022).`,
    },

    // ——— Uzman: sınır hücre katmanı ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Sınır hücre katmanının ince yapısı.** Bu katı ilk kez 1975’te Nabeshima ve arkadaşları tanımladı (Ishikawa ve ark., 2026). Ona zamanla birçok ad verildi: mezotel katmanı, nörotelyum, yüzeyel bölge, iç sert zar hücre katmanı ve subdural hücre katmanı. Bugün standart ad “sert zar sınır hücre katmanı”dır (Ishikawa ve ark., 2026). Gray ise sert zarın iç yüzünü yassı bir hücre katının (mezotel) döşediğini yazmıştı (Gray, 1918). Bugün bu yüzün mezotel olmadığı biliniyor.

Bu kat 10 µm’den incedir. 3–8 sıra yassı, fibroblast benzeri hücreden oluşur (Ishikawa ve ark., 2026). Kolajen lifi azdır ve hücre dışı madde düzensizdir (Ishikawa ve ark., 2026). Haines ve arkadaşlarına göre hücrelerin dışında hiç kolajen yoktur (Haines ve ark., 1993). Hücreler arasındaki bağlantılar öteki sert zar katlarından azdır. Bağlantı varsa hücreleri noktasal olarak tutturan dezmozom, iki hücreyi kanalla bağlayan oluklu bağlantı (*gap junction*) ya da ara bağlantıdır. Sıkı bağlantı yoktur (Ishikawa ve ark., 2026). Hücreler uzun, kıvrımlı ve birbirine geçen uzantılar taşır. Düzenli bir kolajen ve elastik lif çatıları yoktur (De Simone ve ark., 2026).

Bu katın iki yüzü farklı davranır. Üstteki meningeal katla arasında hücre bağlantısı yoktur. Alttaki örümcek ağı zarın engel hücreleriyle ise bağlantılar vardır (Ishikawa ve ark., 2026). Küçük bir zorlamada yarık, sert zar ile örümcek ağı zarın arasında değil, sınır hücre katmanının içinde açılır (Ishikawa ve ark., 2026). Hemen dışında, meningeal katta, zengin bir mikro damar ağı bulunur (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: '“Subdural” kanama gerçekte nerede?',
      md: `Haines 1991’de bu sınırı ayrıntılı olarak inceledi. Örümcek ağı zarın engel hücre katmanı ile sert zarın sınır hücre katmanı arasında bir boşluk kanıtı bulmadı (Haines, 1991). Ona göre “subdural hematom” denen kanama çoğu zaman sınır hücre katmanının içinde yer alır (Haines, 1991). 1993’te Haines ve arkadaşları bir adım daha attı: bir boşluk oluşursa, bu “subdural” değil, ayrı bir hücre katmanının içindedir (Haines ve ark., 1993).

Bu görüş bugün de sürüyor. Bir 2026 derlemesi, bazı yazarların “subdural hematom” adını yanıltıcı bulduğunu aktarır. Bu yazarlara göre “sert zar sınır hematomu” adı kanamanın yerini daha doğru gösterir (De Simone ve ark., 2026). Ölümden sonra örümcek ağı zar ile sert zarın arayüzü bozulur ve iki zar birbirinden ayrılır. Tarihte “subdural boşluk” sanılan yarık, bu yapay ayrılmadır (Joost ve ark., 2026). Kanamaların kliniği “Kanamalar ve fıtıklaşmalar” bölümünde, boşluğun tarihçesi “Zarlar arası boşluklar ve sisternalar” bölümünde.`,
    },

    // ——— Uzman: damar düzeni ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Sert zarın içindeki damar düzeni.** Kaynaklar bu düzeni biraz farklı anlatır:

- **Ishikawa ve arkadaşları:** Büyük atardamar ve toplardamarlar endosteal taraftadır. Meningeal tarafta zengin bir kılcal ağ vardır. Orada bir de çapı ~42 µm’ye kadar olan küçük damarlardan bir toplardamar ağı bulunur. Bu ağlar özellikle üst sagital sinüsün çevresinde gelişmiştir (Ishikawa ve ark., 2026).
- **Joost ve arkadaşları:** Sınır hücre katmanının yalnızca birkaç mikrometre üstünde yoğun bir kılcal yatak vardır. Bu yatak kıvrımlar dahil bütün sert zara yayılır (Joost ve ark., 2026).
- **Ota:** Damarları üç kata yerleştirir. Dışta, kemik zarı katında görece büyük damarlar uzanır. İçte, sınır hücre katmanında narin bir kılcal ağ vardır. İkisini meningeal katı geçen delici atardamarcıklar bağlar. Ota’ya göre meningeal kat, iki ağı ayıran görece damarsız, lifli bir ara yapraktır (Ota, 2026).
- **Kiss-Bodolay ve arkadaşları:** Her katın kendi damar ağı vardır: dış ağ, geçiş ağı ve iç ağ (Kiss-Bodolay ve ark., 2023).

Kaynaklar kılcal ağın varlığında birleşir. Ayrıldıkları nokta, meningeal katın ne kadar damarlı olduğudur. Damarların çapları ve bu ağın hastalıktaki rolü “Sert zarın atardamarları, sinirleri ve ağrı” bölümünde.`,
    },

    // ——— Uzman: katmanlar arası düzlemler ———
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Katlar arasındaki düzlemler',
      md: `- **İnterdural aralık.** Endosteal ile meningeal kat arasındaki düzleme interdural aralık denir. Omurilik epidural boşluğu bu aralığın karşılığı sayılabilir (Ishikawa ve ark., 2026). Aralığın nerede gösterildiği ve orada nadiren biriken kanama “Zarlar arası boşluklar ve sisternalar” bölümünde.
- **Omurgadan göze bir bölme.** Göz çukurunda, kemik zarı (periorbita) ile göz sinirinin sert zar kılıfı arasında bir düzlem vardır. Bu düzlem omurilik epidural boşluğuna ve kavernöz sinüse benzer. Omurga kanalından göz çukuruna uzanan sürekli bir “sert zar dışı sinir ekseni bölmesi” olarak düşünülür (Ishikawa ve ark., 2026).
- **Türkiye’den bir teknik.** Ege Üniversitesi’nden (İzmir) Biçeroğlu ve arkadaşları Chiari tip I malformasyonu ameliyatında sert zarı ince katlara ayırdı. Meningeal katı mikroskop altında baklava yufkası inceliğine dek, BOS’un atımı görülene kadar incelttiler. 32 hastada ameliyattan sonra BOS sızıntısı (fistül), sıvı cebi (psödomeningosel), yara enfeksiyonu ya da yeniden ameliyat olmadı (Biçeroğlu ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Sert zarın içinde kalan kan',
      oyku: '58 yaşında bir erkek düşüp başını çarpıyor. BT’de kafatası tepesinde, iki yüzü dışbükey bir kan toplantısı görülüyor. Görünüm ilk bakışta epidural kanamaya benziyor. Ameliyatta cerrah kemiği kaldırınca kanın kemiğin hemen altında olmadığını görüyor. Kan sert zarın içinde, sert zarın iki yaprağı arasında toplanmış. İçteki yaprak kalın ve sağlam.',
      soru: 'Kan sert zarın hangi katları arasında toplanmış olabilir ve bu düzlem anatomide nasıl tanımlanır?',
      cozum: `**Katlar:** Kafatasındaki sert zarın dışta kemiğe yapışan endosteal (periostal) katı, içte meningeal katı vardır. Bu iki kat sinüsler ve kıvrımlar dışında sıkıca kaynaşıktır (Ishikawa ve ark., 2026). Yani normalde aralarında açık bir boşluk yoktur.

**Düzlem ve kanama:** İki kat arasındaki düzleme interdural aralık denir. Kafatası kubbesinde periostal kat ile kalın meningeal kat arasında kalan, iki yüzü dışbükey kanamalara “interdural hematom” denir. Bu kanamalar çok nadir bildirilmiştir (Kiss-Bodolay ve ark., 2023). Bu hastanın bulguları bu tarife uyar. Aralığın anatomisi ve bildirilen olgular “Zarlar arası boşluklar ve sisternalar” bölümünde.

Tanı ve tedavi kararı beyin cerrahisi ekibine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
