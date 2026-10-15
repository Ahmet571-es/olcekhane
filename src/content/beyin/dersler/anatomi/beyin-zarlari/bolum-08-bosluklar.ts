import type { DersBolumu } from '../../../types';

const ATARDAMAR = '#e5484d';
const BEYIN_SAPI = '#b08ae6';
const BEYINCIK = '#f28a52';
const CADIR = '#efe6d2';
const ARA_BEYIN = '#f2b544';
const KALLOZUM = '#5b9bd5';
const KARINCIK = '#25b9a3';

/**
 * 08. bölüm: zarlar arası boşluklar ve sisternalar. Epidural boşluk (kafa içi ve omurilik), subdural "boşluk" (sert
 * zar sınır hücre katmanındaki yarık; Gray 1918 ile bugünkü görüş), subaraknoid boşluk (sınırları, içindekiler,
 * genişliği, BOS hacmi), sisternalar (tablo, iki sahne, çizim), bel sisternası ve bel delmenin anatomik temeli,
 * sisternaların cerrahideki yerine kısa gönderme. Bilgiler S2 kaynak notlarından (B, D, A).
 */
export const bosluklarVeSisternalar: DersBolumu = {
  id: 'bosluklar-ve-sisternalar',
  baslik: 'Zarlar arası boşluklar ve sisternalar',
  bloklar: [
    // ——— Giriş ———
    {
      tur: 'metin',
      md: `Beyni üç zar sarar. Dışta **sert zar** (*dura mater*), ortada **örümcek ağı zar** (*arachnoidea mater*), içte **yumuşak zar** (*pia mater*) vardır. Bu bölümde zarların kendisine değil, **aralarına** bakıyoruz.

Kitaplarda üç boşluk adı geçer. **Epidural boşluk**, sert zarın dışında, kemiğe bakan yüzündedir. **Subdural boşluk**, sert zarın altında sanılan aralıktır. **Subaraknoid boşluk** ise örümcek ağı zarın altındadır. Ama bu üç addan yalnızca biri, kafanın içinde gerçek bir boşluğa karşılık gelir.

Uluslararası anatomi terimleri listesine Terminologia Anatomica denir; bugünkü 2. baskısının kısa adı TA2’dir. TA2’nin bir notu açıktır. Normalde örümcek ağı zar sert zara, sert zar da kafatasına yapışıktır. Bu yüzden bu iki sınırda doğal bir boşluk yoktur (FIPAT, 2019). Böyle bir boşluk ancak bir travma ya da hastalık zarları birbirinden ayırınca açılır (FIPAT, 2019).

Gerçek boşluk, örümcek ağı zar ile yumuşak zarın arasıdır. İçi **beyin-omurilik sıvısıyla** (BOS) doludur (Gray, 1918). Beynin tabanında bu boşluk yer yer genişler. Bu geniş yerlere **sisterna** denir (Gray, 1918). Omurilikte ise bir boşluk daha gerçektir: sert zar ile omurga kanalının duvarı arasındaki epidural boşluk (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Kafanın içinde:** Epidural ve subdural boşluk normalde yoktur. İkisi de ancak travma ya da hastalıkla açılır.

**Gerçek boşluk:** Subaraknoid boşluk. Örümcek ağı zar ile yumuşak zarın arasındadır, içi BOS doludur. Beynin tabanında genişleyip sisternaları yapar.

**Omurilikte:** Epidural boşluk gerçektir; içinde yağ ve toplardamarlar vardır. Subaraknoid boşluk belde genişler ve bel sisternasını yapar. Bel delme (lomber ponksiyon) bu sisternadan yapılır.`,
    },

    // ——— Epidural boşluk ———
    {
      tur: 'metin',
      md: `**Epidural boşluk: kafada yok, omurilikte var.** Kafanın içinde sert zar kemiğe sıkıca yapışır. Gray’e göre bu yapışma iki yerde en güçlüdür. Biri kafatası kemiklerinin birleştiği dikişlerin karşısıdır, öteki kafa tabanıdır (Gray, 1918). Sert zar, kafatası kemiklerinin iç yüzünü döşeyen kemik zarı (periost) görevini de görür (Gray, 1918). Bu yüzden TA2, kafa içi epidural boşluğu “her zaman bulunmayan” (*inconstant*) diye işaretler (FIPAT, 2019).

Omurilikte durum başkadır. Sert zar burada omurların kemik zarından ayrılır. Aradaki boşlukta yağ bulunur (Joost ve ark., 2026). Toplardamarlar da bu boşluktadır. Omurilik sinirlerinin kökleri de buradan geçer. Bu yüzden uyuşturan ilaçlar (lokal anestezikler) bu boşluğa etkili biçimde verilebilir (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İki sert zar, iki farklı düzen.** Klasik anlatımda kafa içindeki sert zarın iki katı vardır. Kemiğe bakan kata **endosteal kat**, beyne bakan kata **meningeal kat** denir. Kafa içinde bu iki kat birbirine sıkıca bitişiktir. Omurga kanalında ise meningeal kat omurların kemik zarından ayrılır. Böylece yağ dolu epidural boşluk oluşur (Joost ve ark., 2026).

Neden böyledir? Endosteal kat büyük delikte (*foramen magnum*) dışa döner. Bu yüzden omurilik sert zarı yalnızca meningeal kattan ve en içteki sınır hücre katmanından oluşur (Ishikawa ve ark., 2026). Buradan ilginç bir eşleşme çıkar. Omurilikteki epidural boşluk, kafa içinde iki kat arasındaki düzlemin karşılığı sayılabilir. Bu düzleme **interdural düzlem**, yani sert zar katları arası düzlem denir (Ishikawa ve ark., 2026).

Gray de benzer bir eşleşme yapar. Omurilik epidural boşluğunda gevşek bir bağ dokusu ve bir toplardamar ağı bulunur (Gray, 1918). Gray’e göre bu toplardamarların yeri, kafadaki toplardamar sinüslerinin yerine denk düşer (Gray, 1918). Kafadaki bu sinüslere **sert zar sinüsleri** (*sinus durae matris*) denir. Sert zar sinüsleri, sert zarın iki katı arasında uzanan toplardamar kanallarıdır (Gray, 1918). Onları burun çevresindeki hava boşluklarıyla karıştırma.

TA2 bu farkı adlarla da gösterir. Kafa içi epidural boşluk (*spatium epidurale craniale*) “her zaman bulunmayan” diye işaretlidir. Omurilik epidural boşluğu (*spatium epidurale spinale*) ise böyle işaretlenmemiştir (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sert zarın iki katı arasında: interdural aralık',
      md: `Kafa içinde sert zarın iki katı birbirine sıkıca yapışıktır. Bu iki kat, kemiğe bakan endosteal (periostal) kat ile beyne bakan meningeal kattır. İki kat yalnızca sinüslerin ve sert zar kıvrımlarının olduğu yerlerde ayrılır (Ishikawa ve ark., 2026).

- **Aralığın yeri.** İki kat arasında bir aralık, kavernöz sinüs düzeyinde anatomik olarak gösterildi. Aralığın büyük deliğe, juguler deliğin sert zar kıvrımlarına ve beyin orağına dek sürdüğü tarif edildi (Kiss-Bodolay ve ark., 2023). Kavernöz sinüsün çevresindeki aralık “Sert zarın kıvrımları ve bölmeleri” bölümünde anlatıldı.
- **Omurga kanalından göz çukuruna.** Göz çukurunda da benzer bir düzlem vardır. Bu düzlem, kemik zarı (periorbita) ile görme sinirinin sert zar kılıfı arasındadır. Ishikawa ve arkadaşları onu, omurga kanalından göz çukuruna uzanan kesintisiz bir “sert zar dışı sinir ekseni bölmesi”nin parçası sayar (Ishikawa ve ark., 2026).
- **İnterdural hematom.** Nadiren kan, kafa kubbesindeki sert zarın periostal katı ile kalın meningeal katı arasında toplanır. İki yüzü dışbükey bu kanamaya “interdural hematom” denir. 10 yayında 11 olgu bildirildi (Kiss-Bodolay ve ark., 2023). Bu olguların çoğu, biçimi yüzünden epidural kanama ya da menenjiyom sanıldı. Tanı ameliyatta, kemiğin altında beklenmedik bir sert zar katı görülünce kondu (Kiss-Bodolay ve ark., 2023).
- **Açık soru.** Kubbedeki sert zarda böyle bir aralığın bazı kişilerde bulunup bulunmadığı henüz gösterilmedi (Kiss-Bodolay ve ark., 2023).

Epidural ve “subdural” kanamalar “Kanamalar ve fıtıklaşmalar” bölümünde anlatılır.`,
    },

    // ——— Subdural "boşluk" ———
    {
      tur: 'metin',
      md: `**Subdural boşluk: bir yanılgının öyküsü.** Sert zarın en iç yüzünde ince bir hücre katı vardır: **sert zar sınır hücre katmanı**. Bu katın hücreleri birbirine sıkıca bağlı değildir. Aralarında görece geniş yarıklar vardır (Joost ve ark., 2026). Bu yüzden kat zayıftır ve olağan dışı bir zorlamada kolayca ayrılır (Joost ve ark., 2026). Bu katmanın yapısını “Sert zar: yapısı” bölümünde gördük.

Sağlıklı insanda gerçek bir subdural boşluk yoktur. Böyle bir boşluk yalnızca hastalıkta oluşur (Joost ve ark., 2026). Bir örnek düşün: beyin yüzeyinden sert zara uzanan **köprü toplardamarları** yırtılır. Kan bu zayıf katmana dolar ve onu açar. Böylece yapay bir “subdural boşluk” oluşur (Joost ve ark., 2026).

“Subdural” denen kanamalar bu yüzden çoğu zaman aslında sert zarın içindedir, yani sınır hücre katmanındadır (Haines, 1991). Kanamaların ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Eski kitaplar neden bir boşluk gördü?',
      md: 'Ölümden sonra dokular bozulur. Örümcek ağı zar ile sert zarın sınırı da bozulur ve iki zar birbirinden ayrılır. Aralarında yapay bir yarık oluşur. Tarihte “subdural boşluk” sanılan şey bu yarıktır (Joost ve ark., 2026). Proulx’a göre 1914’te Lewis Weed’in kedi kesitlerinde görülen geniş subdural boşluk da dokunun hazırlanmasının yarattığı yapay bir görüntüdür (Proulx, 2021). Bir resimde iki zarın arasında boşluk görürsen, dokunun nasıl hazırlandığını da sor.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gray ne diyordu?** Gray, omurilikte sert zar ile örümcek ağı zar arasında “olası bir boşluk” tanımlar ve ona *subdural cavity* der. Ama iki zarın aslında birbirine değdiğini de ekler (Gray, 1918). Gray subdural boşluğu çok küçük bir boşluk ve BOS yollarının bir parçası sayar (Gray, 1918). Onu bir seröz boşluğa da benzetir (Gray, 1918). Seröz boşluk, iki ince zar arasında az bir sıvının bulunduğu kapalı bir aralıktır. Bu görüş bugün geçerli değildir.

**Bugünkü görüş.** Haines 1991’de bu sınırın ince yapısını inceledi. Örümcek ağı zarın engel hücre katmanı ile sert zarın sınır hücre katmanı arasında bir boşluğa dair kanıt bulmadı (Haines, 1991). Haines’e göre burası “olası” (potansiyel) bir boşluk bile değildir. Çünkü buradaki yarık ancak doku hasarıyla oluşur (Haines, 1991). 1993’te Haines ve arkadaşları şunu ekledi: Bir boşluk oluşsa bile bu “subdural” değildir. Ayrı bir hücre katmanının içindedir (Haines ve ark., 1993). Ameliyatla alınmış insan omurilik zarlarında da sert zar ile örümcek ağı zar sıkıca yapışık bulundu. Aralarında doğal bir boşluk yoktu (Vandenabeele ve ark., 1996).

Ishikawa ve arkadaşları da aynı sonuca varır. Küçük bir travmanın ya da ameliyatın kesme kuvveti sınır hücre katmanını yarabilir. Böylece sert zarın içinde bir ayrılma düzlemi açılır. Klinikte “subdural boşluk” diye görülen yer budur (Ishikawa ve ark., 2026).

Sınır hücreleri komşu katlara nasıl tutunur? Hücreleri birbirine bağlayan küçük yapılara hücre bağlantısı (*junction*) denir. Ishikawa ve arkadaşlarına göre sınır hücreleri ile üstteki meningeal kat arasında hücre bağlantısı yoktur. Alttaki örümcek ağı zarın engel katmanıyla ise bu bağlantılar vardır (Ishikawa ve ark., 2026). Haines’in anlatımı biraz farklıdır. Ona göre sınır hücre katmanı, sert zarın meningeal kısmıyla kesintisiz sürer. Alttaki örümcek ağı zara ise ancak ara sıra bir hücre bağlantısıyla tutunabilir (Haines, 1991).

Kronik subdural kanamada ilk kanamanın, bu katmanı geçen köprü toplardamarlarından olduğu genel olarak kabul edilir (Nouri ve ark., 2021). Toplardamarın duvarı en ince yerinde, sınır hücre katmanında, tek kat endotel kadar olabilir (Nouri ve ark., 2021). Bu yüzden bazı yazarlar “subdural hematom” yerine **sert zar sınır hematomu** adını önerir (De Simone ve ark., 2026).

**Eski dil hâlâ yaşıyor.** Bazı güncel kaynaklar sert zar ile örümcek ağı zar arasına hâlâ subdural boşluk der (Dafny, 2020). StatPearls’ün bir özeti epidural, subdural ve subaraknoid alanları “boşluk ya da olası boşluk” diye sayar (Ghannam ve Al Kharazi, 2023). Bir laboratuvar sayfası omurilikteki subdural boşluk için “gerçek olmaktan çok olası” der (Byrne ve Dafny, 2026). 2025 tarihli bir derleme de “olası boşluk” sözünü kullanır (Zedde ve Pascarella, 2025a). Bu kaynakları okurken bugünkü anatomiyi akılda tut.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Boşluklar: gerçek mi, olası mı, yapay mı?',
      sutunlar: ['Boşluk', 'Gray’in görüşü (1918)', 'Bugünkü görüş', 'Sonuç', 'Klinikte karşılığı'],
      satirlar: [
        [
          'Kafa içi epidural (*spatium epidurale craniale*)',
          'Sert zar kemiklerin iç yüzüne sıkıca yapışır ve onların iç kemik zarıdır. Yapışma dikişlerin karşısında ve kafa tabanında en belirgindir',
          'TA2: “her zaman bulunmayan”. Sert zar kafatasına yapışıktır; bu sınırda doğal boşluk yoktur',
          'Yapay: travma ya da hastalıkla açılır',
          'Epidural kanama (“Kanamalar ve fıtıklaşmalar” bölümü)',
        ],
        [
          'Omurilik epidural (*spatium epidurale spinale*)',
          'Gerçek bir boşluk: gevşek bağ dokusu ve toplardamar ağı. Bu toplardamarlar kafadaki sinüslerin karşılığıdır',
          'Gerçek. Yağ ve toplardamar içerir. Kafa içindeki interdural düzlemin karşılığı sayılabilir',
          'Gerçek',
          'Uyuşturan ilaçlar buraya verilebilir (epidural blok)',
        ],
        [
          'Subdural (*spatium subdurale*)',
          'Omurilikte “olası boşluk”; iki zar birbirine değer. BOS yollarının bir parçası, seröz boşluğa benzer',
          'Normalde yok. Yarık, sert zarın sınır hücre katmanının içinde açılır. Haines’e göre “olası” bile değildir',
          'Yapay: doku hasarıyla açılır',
          '“Subdural” kanamalar çoğu zaman sınır hücre katmanının içindedir; “sert zar sınır hematomu” adı önerilmiştir',
        ],
        [
          'Subaraknoid (*spatium subarachnoidale*)',
          'Örümcek ağı zar ile yumuşak zar arası. BOS dolu; süngerimsi bir trabekül dokusu ve birbirine açılan kanallar içerir',
          'Gerçek. TA2 notuna göre en doğru ad “leptomeningeal boşluk” olurdu',
          'Gerçek',
          'Subaraknoid kanama, menenjit; bel delmeyle BOS alınır',
        ],
        [
          'Damar çevresi (Virchow–Robin)',
          'Yumuşak zar bu boşluğa bir astar gibi girer. Bu yollardan sinir hücrelerinden subaraknoid boşluğa olasılıkla az bir sıvı akar',
          'Var; ama subaraknoid boşlukla sürekli olup olmadığı tartışmalıdır',
          'Gerçek; bağlantısı tartışmalı',
          'MR’da görülür (“Yumuşak zar ve damar çevresi boşluklar” bölümü)',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Joost ve ark. (2026); Ishikawa ve ark. (2026); Haines (1991); Haines ve ark. (1993); De Simone ve ark. (2026); Byrne ve Dafny (2026). Gray’in subdural boşluk anlatımı bugün eskimiştir; tabloya yalnızca karşılaştırma için alındı.',
    },

    // ——— Subaraknoid boşluk ———
    {
      tur: 'metin',
      md: `**Subaraknoid boşluk: beynin su yatağı.** Örümcek ağı zar beynin bütün yüzeyini örter. Ama derin girintilere inmez; büyük aralıkların üstünden köprü kurar. Yumuşak zar ise her yarığa girer. Damarları en küçük dallarına kadar izler (Villanueva ve ark., 2023). İki zarın arasında kalan aralık subaraknoid boşluktur. İçi BOS doludur (Gray, 1918).

Bu yüzden boşluğun genişliği her yerde aynı değildir. Bir kıvrımın (girusun) tepesinde iki zar birbirine değer. Kıvrımların arasındaki oluklarda ise üçgen biçimli boşluklar kalır (Gray, 1918). Beynin yumuşak zara doğrudan dayandığı yerde boşluk hiç yoktur (Zedde ve Pascarella, 2025a).

Bu boşluktaki BOS, beyne ve omuriliğe sıvı bir yastık olur (OpenStax 13.3). Başını çevirdiğinde ya da bir darbe aldığında beynin biçimini ve yerini korur (Saboori ve Sadegh, 2015). Boşlukta irili ufaklı atardamarlar ve toplardamarlar vardır, ama kılcal damar yoktur (Joost ve ark., 2026). Örümcek ağına benzeyen ince iplikler de iki zarı birbirine bağlar (OpenStax 13.3; Joost ve ark., 2026). Kafatası, omurga, zarlar ve bu boşluk birlikte beyni darbelere ve enfeksiyonlara karşı korur (Joost ve ark., 2026).

Subaraknoid boşluk kapalı bir torba değildir. Dördüncü karıncığa Magendie ve Luschka delikleriyle bağlanır (Zedde ve Pascarella, 2025a). Büyük delikte de omuriliğin subaraknoid boşluğuyla kesintisiz sürer (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla zarlar arası boşluklar',
      ogeler: [
        {
          deger: '1',
          aciklama: 'Kitaplardaki üç zar arası boşluktan kafanın içinde gerçekten var olanların sayısı: yalnızca subaraknoid boşluk.',
        },
        { deger: '~170', birim: 'cm³', aciklama: 'Sağlıklı erişkinde MR ile ölçülen kafa içi subaraknoid BOS hacmi.' },
        { deger: 'S2', aciklama: 'Omurilik subaraknoid boşluğunun bittiği omur: 2. sağrı (sakral) omuru.' },
        {
          deger: '15,9',
          birim: 'mm',
          aciklama: 'Büyük delik hizasında, omurilik soğanının arkasındaki subaraknoid boşluğun önden arkaya ortalama uzunluğu (60 MR).',
        },
      ],
      not: 'Kaynaklar: FIPAT (2019); Wu ve ark. (2021); Gray (1918); Li ve ark. (2023). Hacim değeri erkeklerde 173,9, kadınlarda 168,9 cm³’tür; kaynaklar arasındaki farklar aşağıdaki tabloda.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Adı ve sınırları.** TA2 bu boşluğa *spatium subarachnoidale* der. Resmî bir notu bir inceliği hatırlatır: Boşluğun iç sınırı yumuşak zarın dış katıdır. Bu yüzden en doğru ad *spatium leptomeningeum*, yani “leptomeningeal boşluk” olurdu (FIPAT, 2019). Leptomeninks, örümcek ağı zar ile yumuşak zarın ortak adıdır (Joost ve ark., 2026). Boşluğun tavanını örümcek ağı zarın engel hücreleri, tabanını yumuşak zar yapar (Derk ve ark., 2021).

**İçinde ne var?** Gray’e göre boşluğu süngerimsi bir doku doldurur. Bu doku ince bağ dokusu çubuklarından (trabekül) ve birbirine açılan kanallardan oluşur. Sıvı bu kanallardadır (Gray, 1918). Beyin toplardamarları dokudan çıkıp bu boşlukta birleşir. Sonra köprü toplardamarlarıyla sert zar sinüslerine dökülür (Joost ve ark., 2026). Örümcek ağı zar, kafa ve omurilik sinirlerini de gevşek kılıflarla sarar. Bu kılıflar sinirlerin kafatasından ve omurga kanalından çıktığı yere kadar uzanır (Gray, 1918).

**Ne kadar geniş?** Bir mühendislik çalışması, insan kafasında subaraknoid boşluğun yaklaşık 2–3 mm genişliğinde olduğunu yazar. Ama bu sayıyı yöntem bölümünde kaynak göstermeden verir (Saboori ve Sadegh, 2015). Gerçek genişlik yerden yere çok değişir. Kıvrım tepelerinde iki zar birbirine değer; sisternalarda ise boşluk geniştir (Gray, 1918). Erişkinde yaşa göre normal genişlik veren açık erişimli bir kaynak bulamadık. Bebekler için ise ölçümler var (görüntüleme kutusu).

**Ne kadar BOS taşır?** Bu sorunun yanıtı ölçüm yöntemine göre değişir (aşağıdaki tablo). Gray, BOS’un yaşlılarda en bol olduğunu yazmıştı (Gray, 1918). 81 kişilik bir MR çalışması da BOS hacmi ile yaş arasında güçlü bir ilişki buldu (Albayram ve ark., 2022).

**Omurilikte.** Omurilik subaraknoid boşluğu geniştir. En geniş yeri omurga kanalının alt kısmıdır. Orada örümcek ağı zar, at kuyruğunu (*cauda equina*) yapan sinir köklerini sarar (Gray, 1918). Boşluk 2. sağrı omurunun alt kenarında biter (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kafanın içinde ne kadar BOS var? Yönteme göre değişir',
      sutunlar: ['Kaynak', 'Yöntem', 'Ne ölçüldü?', 'Değer'],
      satirlar: [
        [
          'Hall ve ark., 2025',
          'Klinik başvuru kaynağı (StatPearls)',
          'Subaraknoid boşluktaki BOS / karıncıklardaki BOS',
          '125–150 mL / 25 mL',
        ],
        [
          'Villanueva ve ark., 2023',
          'Cerrahi anatomi derlemesi; sayıyı başka bir kaynaktan aktarır (kendi ölçümü değil)',
          'Sisternalardaki BOS (yaklaşık %75’i omurilikte, %25’i kafada) / karıncıklardaki BOS',
          '~125 mL / 25 mL',
        ],
        [
          'Wu ve ark., 2021',
          'MR (SPACE dizisi), sağlıklı gönüllüler',
          'Kafa içi subaraknoid BOS (erkek / kadın)',
          '173,9 ± 37,9 / 168,9 ± 37,0 cm³',
        ],
        [
          'Wu ve ark., 2021',
          'Aynı çalışma',
          'Kafa içindeki bütün BOS (erkek / kadın); karıncıklardaki BOS (erkek / kadın)',
          '206,9 ± 47,7 / 199,7 ± 44,9 cm³; 33,0 ± 10,7 / 30,8 ± 9,4 cm³',
        ],
        [
          'Albayram ve ark., 2022',
          'MR; 81 kişi, 15–80 yaş',
          'BOS hacmi (erkek / kadın)',
          '201,6 / 158,7 cm³; yaşla güçlü artış (r = 0,75)',
        ],
        [
          'Eide ve ark., 2025',
          'MR; 76 hasta',
          'BOS hacmi: kontrol grubu (46 kişi: kafa içi kisti ya da demansı olanlar ile nörolojik hastalığı bulunmayanlar) / BOS hastalığı grubu (30 kişi: kafa içi basınç bozukluğu ya da hidrosefali)',
          '257,1 ± 68,5 / 343,4 ± 227,9 mL',
        ],
      ],
      not: '1 cm³, 1 mL’ye eşittir. Kaynak kitaplardaki 125–150 mL, MR ile ölçülen değerlerden küçüktür. Fark ölçüm yönteminden, yaştan ve örneklemden gelebilir. Eide ve arkadaşlarının kontrol grubu sağlıklı gönüllülerden oluşmaz. Wu ve arkadaşları cinsiyetler arasında fark bulmadı; Albayram ve arkadaşları erkeklerde daha yüksek değer buldu. BOS’un yapılışı ve dolaşımı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Bebekte subaraknoid boşluğu ölçmek',
      md: `- **Ultrason, 0–3 ay.** İzmir’de 125 sağlıklı bebekte ultrasonla ölçüm yapıldı. Önerilen üst sınırlar (95. yüzdelik) şunlardır: kafatası ile kabuk arası 3,1 mm, sinüs ile kabuk arası 3,8 mm, iki yarımküre arası 4,2 mm (Çolak ve ark., 2026). 95. yüzdelik, sağlıklı bebeklerin yüzde 95’inin bu değerin altında kaldığı anlamına gelir.
- **Yaş önemli.** Aynı çalışmada genişlikler yaşla düzenli arttı. İlk iki ölçümle bağımsız ilişkili tek değişken yaştı (Çolak ve ark., 2026).
- **Kesit önemli.** 4 günlük ile 24 aylık 63 bebekte MR’da ölçüm yapıldı. Koronal (önden alınan) T2 kesitteki ölçüm, aksiyel kesittekinden daha tekrarlanabilir ve doğru bulundu (Zhang ve ark., 2022a). Bu genişliği ölçmek için BT ilk kez 1979’da kullanıldı (Zhang ve ark., 2022a).
- **Doğumdan önce.** İstanbul’da 28–36. haftalarda 281 gebelikte ölçüm yapıldı. Sinüs ile kabuk arası genişlik, büyümesi geri kalan fetüslerde 2,26 ± 0,86 mm, yaşına uygun büyüyenlerde 2,68 ± 0,96 mm’ydi (Selvi ve ark., 2026).`,
    },

    // ——— Sisternalar ———
    {
      tur: 'metin',
      md: `**Sisternalar: subaraknoid boşluğun genişlediği yerler.** Beynin tabanı düz değildir. Beyin sapı, sinirler ve damarlar burada girinti çıkıntı yapar. Örümcek ağı zar bu girintilere inmez, üstlerinden geçer. Yumuşak zar ise beynin yüzeyini sıkıca izler. Böylece iki zar arasında yer yer geniş aralıklar kalır. Bu aralıklar birbirine serbestçe açılır. Gray onlara **subaraknoid sisternalar** der (Gray, 1918).

Sisternalar adlarını komşu oldukları beyin yapılarından alır (Zedde ve Pascarella, 2025a). Birkaç örneğe bak:

- **Büyük sisterna**, omurilik soğanı ile beyincik arasındadır. Subaraknoid sisternaların en büyüğüdür (Zedde ve Pascarella, 2025a).
- **İnterpedinküler sisterna**, orta beynin iki ayağını, yani serebral pedinkülleri (*pedunculi cerebri*) sarar. Gray’e göre beynin tabanındaki atardamar halkası, yani **Willis halkası**, bu sisternanın içindedir (Gray, 1918). Bugünkü cerrahi anatomi ise halkanın parçalarını birkaç komşu sisternaya dağıtır (Villanueva ve ark., 2023).
- **Köprünün (*pons*) önündeki sisternada** baziler atardamar uzanır (Gray, 1918).
- **Şakak lobunun önünde**, örümcek ağı zar yan yarığın (Sylvius yarığı) üstünden geçer ve bir sisterna yapar. İçinde orta beyin atardamarı vardır (Gray, 1918).

Sisternalar kesin duvarlı odalar değildir. Yerlerine göre adlandırılırlar, ama anatomik olarak kesin ayrılmazlar. Aralarında değişik büyüklükte delikleri olan, süzgeç gibi bir doku vardır (Joost ve ark., 2026). BOS bu deliklerden bir sisternadan ötekine geçebilir (Villanueva ve ark., 2023).`,
    },
    {
      tur: 'animasyon',
      ad: 'sisternalar',
      baslik: 'Sisternalar: subaraknoid boşluğun genişlediği yerler',
      aciklama:
        'Orta hattan, tabandan ve belden bakarak sisternaları bul; birine dokununca adı, yeri ve içinden geçenler çıkar. Liliequist zarı da var.',
    },
    {
      tur: 'sahne',
      baslik: 'Alttan bakış: sisternaların komşuları',
      aciklama:
        'Beyne alttan bakıyoruz: ön taraf ekranın üstünde, hastanın sağı ekranın solunda. Sisternalar modelde yok; etiketler, onları çevreleyen yapıları gösterir. Etiketteki sisterna, işaretli yapının hemen çevresindeki BOS dolu aralıktır. Büyük beyin saydam. Kırmızı: atardamarlar. Mor: beyin sapı. Turuncu: beyincik. Krem: beyincik çadırı. Sarı: görme kiazması, görme sinirleri ve mamiller cisimler. Bakış düğmesiyle beyni yandan da gör.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'sap', 'damar', 'zar'],
        goster: [
          'katman:kabuk',
          'katman:sap',
          'katman:damar',
          'katman:zar',
          'optik-kiazma',
          'optik-sinir',
          'optik-traktus',
          'mamiller-cisimler',
        ],
        saydam: ['katman:kabuk'],
        renk: 'dogal',
        boya: [
          { secici: ['katman:damar'], renk: ATARDAMAR },
          { secici: ['bolge:beyin-sapi'], renk: BEYIN_SAPI },
          { secici: ['beyincik'], renk: BEYINCIK },
          { secici: ['beyincik-cadiri'], renk: CADIR },
          { secici: ['optik-kiazma', 'optik-sinir', 'optik-traktus', 'mamiller-cisimler'], renk: ARA_BEYIN },
        ],
        bakis: 'alt',
        etiketler: [
          { yapi: 'optik-kiazma', metin: 'Kiazma sisternası' },
          { yapi: 'orta-beyin-arteri-sag', metin: 'Sylvius sisternası: orta beyin atardamarı' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Pedinküller arası: interpedinküler sisterna' },
          { yapi: 'baziler-arter', metin: 'Prepontin sisterna: baziler atardamar' },
          { yapi: 'beyincik', metin: 'Soğan ile beyincik arası: büyük sisterna' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'İğneyle büyük sisternaya',
      md: 'Büyük sisternadan iğneyle BOS almayı 1920’de Amerikalı nörolog James Bourne Ayer kliniğe soktu. Hayvanlarda bu işlemi ilk kez 1913’te Dixon ve Halliburton tanımlamıştı (Lutters ve Koehler, 2020). Sisterna kavramını ise 1690’larda Humphrey Ridley getirdi (Zedde ve Pascarella, 2025a).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sisternaları ne ayırır?** Sisternaların arasında çoğu zaman örümcek ağı zar perdeleri vardır. Bu perdeler BOS’un sisternalar arasındaki akışını düzenler (Zedde ve Pascarella, 2025a). En iyi bilinen perde **Liliequist zarıdır**. Zarın seyri ve yaprakları “Örümcek ağı zar” bölümünde anlatıldı. Burada şu kadarı yeter: Bu zar kiazma, interpedinküler ve prepontin sisternaları birbirinden ayırır (Zedde ve Pascarella, 2025a).

**BOS’un yolu.** BOS dördüncü karıncıktan Luschka delikleriyle köprü–beyincik açısına çıkar. Oradan ön köprü zarlarındaki açıklıklarla prepontin sisternaya geçer. Sonra interpedinküler sisternaya yükselir (Zedde ve Pascarella, 2025a).

**Çadır çentiği ve üç sisterna.** Beyincik çadırının ön kenarında büyük, oval bir açıklık vardır: **çadır çentiği** (*incisura tentorii*). Orta beynin ayakları bu açıklıktan geçer (Gray, 1918). Çentik ön, orta ve arka diye üç kısma ayrılır. Her kısma bir sisterna karşılık gelir: önde interpedinküler, ortada ambiens, arkada kuadrigeminal sisterna (Villanueva ve ark., 2023).

**Willis halkası hangi sisternada?** Burada kaynaklar sisternaları farklı genişlikte tanımlar. Gray interpedinküler sisternayı geniş tutar ve ona bazal sisterna da der. Ona göre bu sisterna iki şakak lobu arasında uzanır. Öne doğru görme kiazmasının üstünden geçer ve kiazma sisternasını yapar. Willis halkası da bu geniş sisternanın içindedir (Gray, 1918). Bugünkü cerrahi anatomi sisternaları daha küçük parçalara ayırır. Buna göre halkanın parçaları farklı sisternalardadır (Villanueva ve ark., 2023):

- iç karotis atardamarı ve arka bağlantı atardamarının başlangıcı karotis sisternasında,
- ön bağlantı atardamarı lamina terminalis sisternasında,
- arka bağlantı atardamarının sonu ile baziler atardamarın tepesi ve çatallanması interpedinküler sisternada.

**Adlar.** TA2 kafa sisternalarını tek tek sayar. Listede şunlar vardır: perikallozal, yan çukur (Sylvius), lamina terminalis, kiazma, interpedinküler, ambiens, kuadrigeminal, köprü–beyincik ve iki serebellomedüller sisterna (FIPAT, 2019). Büyük sisternanın resmî adı *cisterna cerebellomedullaris posterior*’dur. *Cisterna magna* ise eş anlamlı olarak verilir (FIPAT, 2019).

Klinikte çok kullanılan bazı adlar bu listede yoktur. Prepontin sisterna için Gray *cisterna pontis* der (Gray, 1918). Krural sisternayı klasik kaynaklar tanımlar, ama TA2 ona ayrı bir ad vermez (Villanueva ve ark., 2023). Bugünkü adlandırma büyük ölçüde Yaşargil’in 1970’lerin ortasındaki ayrıntılı tanımına dayanır (Villanueva ve ark., 2023).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kafa sisternaları: yeri, sınırları, içindekiler',
      sutunlar: ['Sisterna', 'TA2 Latince adı', 'Yeri', 'Sınırları', 'İçindekiler'],
      satirlar: [
        [
          'Büyük sisterna (arka serebellomedüller)',
          '*Cisterna cerebellomedullaris posterior*; eş anlamlısı *cisterna magna*',
          'Omurilik soğanı ile beyincik yarımkürelerinin alt yüzü arasında. Sisternaların en büyüğü',
          'Sagital kesitte üçgen. Örümcek ağı zar, soğan ile beyincik arasındaki aralığın üstünden geçer. Klasik tanımda beyincik solucanının (vermis) alt kenarından büyük delik hizasına uzanır. Aşağıda omuriliğin subaraknoid boşluğuyla sürer',
          'Bazı kafa sinirleri ve atardamarlar',
        ],
        [
          'Prepontin (köprü önü)',
          'TA2 listesinde yok; Gray’de *cisterna pontis*',
          'Köprünün ön yüzünde, geniş bir aralık',
          'Önde klivus (kafa tabanının eğik iç yüzü), arkada köprü. Tavanı Liliequist zarının mezensefalik yaprağı. Yanlarda ön köprü zarları onu köprü–beyincik sisternalarından ayırır',
          'Baziler atardamar (sisternanın ekseni), abdusens siniri (Dorello kanalına giderken), ön alt beyincik atardamarının başlangıcı',
        ],
        [
          'İnterpedinküler (Gray’de bazal sisterna)',
          '*Cisterna interpeduncularis*',
          'İki şakak lobu arasında; serebral pedinkülleri sarar. Çadır çentiğinin ön kısmında',
          'Liliequist zarının diensefalik yaprağı onu öndeki kiazma sisternasından, mezensefalik yaprağı alttaki prepontin sisternadan ayırır',
          'Baziler atardamarın tepesi ve çatallanması, arka bağlantı atardamarının sonu, arka beyin ve üst beyincik atardamarları, göz hareket siniri (okülomotor). Gray Willis halkasının bütününü bu sisternaya koyar',
        ],
        [
          'Kiazma',
          '*Cisterna chiasmatica*',
          'Orta hatta; sisternaların kavşağı',
          'Yukarıda lamina terminalis, yanlarda karotis. Arkada interpedinküler sisterna; araya Liliequist zarının diensefalik yaprağı girer',
          'Görme sinirleri ve kiazma, hipofiz ve infundibulum atardamarları, hipofiz sapı ve bunların toplardamar ağı',
        ],
        [
          'Sylvius (yan çukur)',
          '*Cisterna fossae lateralis cerebri*; ilişkili ad *cisterna Sylvii*',
          'Şakak lobunun önünde',
          'Örümcek ağı zarın yan yarığın üstünden geçmesiyle oluşur',
          'Orta beyin atardamarı',
        ],
        [
          'Karotis',
          'TA2 listesinde yok',
          'Sylvius sisternasının iç yanında',
          'Eşkenar dörtgen biçimli bir alan',
          'Klinoid çıkıntının üstündeki iç karotis atardamarı; arka bağlantı atardamarının başlangıcı; ön koroid atardamar',
        ],
        [
          'Ambiens',
          '*Cisterna ambiens*',
          'Beyin sapını sarar. Çadır çentiğinin orta kısmında',
          'İçte orta beynin yan yüzü; dışta şakak lobunun iç yüzü (unkusun arkası, parahipokampal girus, dentat girus, forniks saçağı)',
          '—',
        ],
        ['Krural', 'TA2 listesinde yok', 'Ambiens sisternanın önünde, interpedinküler sisternanın yanında', '—', '—'],
        [
          'Kuadrigeminal (büyük beyin toplardamarı sisternası)',
          '*Cisterna quadrigeminalis*; eş anlamlısı *cisterna venae magnae cerebri*',
          'Çadır çentiğinin arka kısmında',
          'Korpus kallozumun arka ucu (splenyum) ile beyinciğin üst yüzü arasındaki aralığı doldurur',
          'Büyük beyin toplardamarı; çok sayıda atardamar ve toplardamar',
        ],
        [
          'Köprü–beyincik',
          '*Cisterna pontocerebellaris*; ilişkili ad “Hilton’un su yatağı”',
          'Köprü–beyincik açısında',
          'İç yanda, baziler atardamar boyunca uzanan ön köprü zarları onu prepontin sisternadan ayırır',
          'Luschka deliklerinden çıkan BOS buraya gelir',
        ],
        ['Perikallozal', '*Cisterna pericallosa*', 'Korpus kallozumun çevresinde (adından)', '—', '—'],
        [
          'Bel sisternası',
          '*Cisterna lumbalis*',
          '2. bel omurunun altından 2. sağrı omuruna kadar',
          'Omurilik üst bel omurları hizasında biter; örümcek ağı zar sert zarla birlikte 2. sağrı omuruna iner',
          'At kuyruğunu yapan sinir kökleri ve BOS',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Villanueva ve ark. (2023); Zedde ve Pascarella (2025a); Li ve ark. (2023); Byrne ve Dafny (2026). “—”: açtığımız kaynaklarda bu bilgi yok. TA2 iki sisternayı daha sayar: lamina terminalis sisternası (*cisterna laminae terminalis*) ve yan serebellomedüller sisterna (*cisterna cerebellomedullaris lateralis*).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Orta hattan: sisternaların sırası',
      aciklama:
        'Sağ yarım kaldırıldı; sol yarıma orta hattan, içeriden bakıyoruz. Ön taraf ekranın sağında, tepe yukarıda. Sisternalar modelde yok; etiketler, orta hattaki sisternaların komşu yapılarını gösterir. Önden arkaya sırayla kiazma, interpedinküler ve prepontin sisternayı, sonra arkada kuadrigeminal ve büyük sisternayı bul. Mavi: korpus kallozum. Sarı: görme kiazması, mamiller cisimler ve epifiz. Mor: beyin sapı. Turuncu: beyincik. Krem: beyincik çadırı. Yeşil: dördüncü karıncık.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'karincik', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        boya: [
          { secici: ['korpus-kallozum'], renk: KALLOZUM },
          { secici: ['optik-kiazma', 'mamiller-cisimler', 'epifiz'], renk: ARA_BEYIN },
          { secici: ['bolge:beyin-sapi'], renk: BEYIN_SAPI },
          { secici: ['beyincik'], renk: BEYINCIK },
          { secici: ['beyincik-cadiri'], renk: CADIR },
          { secici: ['dorduncu-karincik'], renk: KARINCIK },
        ],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Çevresinde: perikallozal sisterna' },
          { yapi: 'optik-kiazma', metin: 'Çevresinde: kiazma sisternası' },
          { yapi: 'mamiller-cisimler', metin: 'Arkasında: interpedinküler sisterna' },
          { yapi: 'pons', metin: 'Önünde: prepontin sisterna' },
          { yapi: 'epifiz', metin: 'Arkasında: kuadrigeminal sisterna' },
          { yapi: 'omurilik-sogani', metin: 'Arkasında: büyük sisterna' },
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sisternalar kanamayı ve akımı yönlendirir',
      md: `- **Kanamanın sınırı.** Sisternaları ayıran perdeler, kanın komşu sisternalara yayılmasını da zorlaştırabilir. Bu yüzden ilk BT’de kanın nerede toplandığı, patlayan anevrizmanın yeri için çoğu zaman ipucu verir (Zedde ve Pascarella, 2025a). Anevrizmasız kanamada kanın Liliequist zarının altında kalması “Örümcek ağı zar” bölümünde anlatıldı. Kanamaların ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümünde.
- **Tıkanan perdeler.** Kanama ya da iltihapla kalınlaşan perdeler prepontin ve interpedinküler sisternalarda BOS akımını engelleyebilir. Bu, dört karıncığın da genişlediği bir hidrosefaliye, yani beyinde sıvı birikmesine yol açabilir. Yazarlara göre daha doğru ad “karıncık dışında, sisterna içinde tıkanmaya bağlı hidrosefali”dir (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Sisternaları MR’da görmek',
      md: `- **Perdeler.** Sisternalar arasındaki ince perdeleri gösteren MR dizileri “Örümcek ağı zar” bölümünde anlatıldı. Perdenin varlığı çoğu zaman dolaylı anlaşılır: komşu sisternalardaki BOS akım izleri birbirinden ayrı kalır (Zedde ve Pascarella, 2025a).
- **Genişlik de bir bulgudur.** Kendiliğinden kafa içi düşük basınçta bir puanlama kullanılır. Bu puanlamada hipofiz üstü (suprasellar) sisterna 4 mm ya da daha darsa “silinmiş” sayılır (Orru ve ark., 2026). Ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde; görüntülemenin ayrıntısı “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Gerçek boşluklar:** subaraknoid boşluk (kafada ve omurilikte) ve omurilik epidural boşluğu. Kafa içi epidural ve subdural boşluk normalde yoktur; TA2 ikisini de “her zaman bulunmayan” diye işaretler.
- **“Subdural” yarık:** sert zarın sınır hücre katmanının içinde açılır.
- **TA2 notu:** subaraknoid boşluğun en doğru adı “leptomeningeal boşluk” olurdu.
- **En büyük sisterna:** büyük sisterna (*cisterna cerebellomedullaris posterior*), soğan ile beyincik arası.
- **İçerikler:** baziler atardamar prepontin sisternada, orta beyin atardamarı Sylvius sisternasında, büyük beyin toplardamarı kuadrigeminal sisternada.
- **Willis halkası:** Gray’e göre interpedinküler sisternada. Bugünkü cerrahi anatomiye göre parçaları karotis, lamina terminalis ve interpedinküler sisternalara dağılır.
- **Çadır çentiği:** önde interpedinküler, ortada ambiens, arkada kuadrigeminal sisterna.
- **Bel sisternası:** 2. bel omurunun altından 2. sağrı omuruna kadar; omurilik yoktur, sinir kökleri vardır.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Büyük sisterna nerede biter?',
      md: `Klasik tanıma göre büyük sisterna, beyincik solucanının (vermis) alt kenarından büyük delik hizasına kadar uzanır (Li ve ark., 2023). Çin’den (Dalian Tıp Üniversitesi) araştırmacılar bu tanımı genişletmeyi önerdi. Büyük delikten 2. boyun omurunun üst kenarına uzanan geniş arka subaraknoid boşluğa **oksipito-atlantal sisterna** adını verdiler (Li ve ark., 2023).

60 MR’da bu boşluğun önden arkaya çapı aşağı doğru daralıyordu (Li ve ark., 2023):

- büyük delik hizasında 15,92 ± 4,20 mm,
- 1. boyun omuru (atlas) hizasında 4,49 ± 1,25 mm,
- 2. boyun omuru (aksis) hizasında 2,88 ± 0,77 mm.

Bu bir öneridir; TA2’nin sisterna listesinde böyle bir ad yoktur (FIPAT, 2019).

**Gelişimde.** Fetüslerin %92’sinde 13. ile 36. haftalar arasında büyük sisternada geçici bölmeler görülür (Ishikawa ve ark., 2026). Türkiye’den iki ultrason çalışması fetüste büyük sisternayı ölçtü (aşağıdaki tablo).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sisternalar: cerrahın doğal yolları',
      md: `- **Doğal bir ağ.** Mikroskop altında beyin; olukların, yarıkların ve sisternaların düzenli bir ağı gibi görünür. Damarlar bu doğal yolları izler (Serra ve ark., 2025).
- **Yaşargil’in dersi.** Yaşargil, örümcek ağı zar perdelerinin sisternalar arasında yol bulmadaki önemini vurguladı. Perdelerin gözenekliliğinin değişken olduğunu ve kanamadan sonra tıkanabileceklerini de belirtti (Zedde ve Pascarella, 2025a). Anevrizma ameliyatında zarlarla ilgili uyarısı ve trabekül yapışıklıkları “Örümcek ağı zar” bölümünde anlatıldı.
- **Beyni gevşetmek.** Taban sisternalarından erken BOS boşaltmak beyni gevşetir. Böylece sert zar nazikçe açılabilir (Ciobanu-Caraus ve ark., 2024).
- **Sisternostomi.** Ağır kafa travmasında taban sisternalarını açıp BOS boşaltan ameliyata sisternostomi denir. Kanıtları hâlâ toplanmaktadır (Villanueva ve ark., 2023). Çalışmaların sonuçları “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },

    // ——— Bel sisternası ve bel delme ———
    {
      tur: 'metin',
      md: `**Bel sisternası ve bel delme.** Omurilik, omurga kanalının sonuna kadar inmez; üst bel omurları hizasında biter. Ama örümcek ağı zar, sert zarla birlikte 2. sağrı (sakral) omuruna kadar iner (Byrne ve Dafny, 2026). Bu yüzden 2. bel omurunun altında büyük, BOS dolu bir sisterna kalır. Buna **bel sisternası** (*cisterna lumbalis*) denir (Byrne ve Dafny, 2026; FIPAT, 2019). Burada omurilik yoktur. Yalnızca at kuyruğunu (*cauda equina*) yapan sinir kökleri vardır ve örümcek ağı zar onları sarar (Gray, 1918).

BOS almak için iğne bu sisternaya sokulur. İğne sert zarı ve örümcek ağı zarı geçerek subaraknoid boşluğa ulaşır (OpenStax 13.3). Bu işleme **bel delme** denir. Omurilik orada olmadığı için ona zarar verme tehlikesi önlenir (OpenStax 13.3).

Belden alınan sıvı neden beyin hakkında bilgi verir? Çünkü kafadaki ve omurilikteki zarlar ve subaraknoid boşluklar büyük delikte kesintisiz sürer. Beynin çevresindeki bir kanama, enfeksiyon ya da iltihap bu yüzden belden alınan BOS’ta görülebilir (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kesenin alt ucu.** Omurilik subaraknoid boşluğunun Gray’e göre 2. sağrı omurunun alt kenarında bittiğini yukarıda gördük. Bu hizanın kişiden kişiye değiştiğini ilk derste görmüştük. TA2 bel sisternasını omurilik örümcek ağı zarının bir parçası olarak sayar (FIPAT, 2019).

**Başka bir yol: büyük sisterna.** Weed, büyük sisterna ponksiyonunu hayvan deneylerinde çok kullandı. Bu, Bostonlu genç nörolog James Ayer’e esin verdi (Lutters ve Koehler, 2020). Kadavra denemelerinde iğne ortalama 4–5 cm derinlikte önce art kafa kemiği ile atlas arasındaki bağı, sonra sert zarı geçiyordu. Sert zar geçilince direnç birden kayboluyordu (Lutters ve Koehler, 2020).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Ateş, baş ağrısı ve bel delme',
      oyku: '19 yaşında bir üniversite öğrencisi iki gündür ateş ve şiddetli baş ağrısıyla acil servise geliyor. Ensesi sert. Hekim, beyni saran zarlarda bir iltihaptan şüpheleniyor ve BOS incelemesi istiyor. Hasta yan yatırılıyor. İğne belin alt bölümünden, omurganın orta hattından sokulacak.',
      soru: 'İğne hangi katmanları geçerek BOS’a ulaşır, neden omuriliğe zarar vermez ve beldeki sıvı neden beyni yansıtır?',
      cozum: `**Katmanlar:** Omurga kanalına girince iğne önce epidural boşluğa gelir. Burada yağ ve toplardamarlar vardır (Byrne ve Dafny, 2026). Sonra sert zarı ve örümcek ağı zarı deler ve subaraknoid boşluğa ulaşır (OpenStax 13.3). Arada gerçek bir subdural boşluk yoktur. Omurilikte iki zar birbirine sıkıca yapışıktır (Vandenabeele ve ark., 1996).

**Neden güvenli?** Omurilik üst bel omurları hizasında biter. Örümcek ağı zar ise 2. sağrı omuruna kadar iner. Böylece 2. bel omurunun altında bel sisternası oluşur (Byrne ve Dafny, 2026). Burada yalnızca at kuyruğunun sinir kökleri vardır (Gray, 1918).

**Neden beyni yansıtır?** Kafadaki ve omurilikteki subaraknoid boşluklar büyük delikte kesintisizdir. Bu yüzden beyin çevresindeki enfeksiyon ya da kanama belden alınan BOS’ta görülebilir (Byrne ve Dafny, 2026). Menenjitin ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümündedir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Türkiye'den çalışmalar ve uzman vakası ———
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den çalışmalar: boşluklar ve sisternalar',
      sutunlar: ['Çalışma', 'Yer ve örneklem', 'Ne bulundu?'],
      satirlar: [
        [
          'Koktener ve ark., 2007',
          'Ankara (Fatih Üniversitesi); 16–24. haftalarda 194 fetüs; ultrason',
          'Büyük sisterna ölçüleriyle bir başvuru eğrisi (normogram) kuruldu. Ölçüm gebelik haftasıyla doğrusal ilişkiliydi (R² = 0,75)',
        ],
        [
          'Serhatlioglu ve ark., 2003',
          'Elazığ; 16–38. haftalarda 130 normal fetüs; ultrason',
          'Büyük sisternanın önden arkaya çapı ikinci ve üçüncü üç aylık dönem arasında anlamlı farklıydı. Sayılar özette kesik',
        ],
        [
          'Karadaş ve ark., 2026',
          'Ankara ve İstanbul; 131 kişi (71 trigeminal nevralji, yani üçüz sinir ağrısı, 60 kontrol); 3 tesla MR, 1 mm kesit',
          'Prepontin sisterna nevraljili tarafta daha kısaydı: kontrollerde 7,046 mm iken nevraljili tarafta 6,417 mm. Bu fark, yazarların çoklu karşılaştırma için kullandığı sıkı ölçütü (Holm düzeltmeli p < 0,01) geçmedi. Yazarlar damar dışı sisterna anatomisinin hastalığa katkısını öne sürdü',
        ],
        [
          'Çolak ve ark., 2026',
          'İzmir; 0–3 aylık 125 sağlıklı bebek; ultrason',
          'Subaraknoid boşluk genişliği için üst sınırlar önerildi; genişlik yaşla arttı',
        ],
        [
          'Selvi ve ark., 2026',
          'İstanbul; 28–36. haftalarda 281 gebelik; ultrason',
          'Büyümesi geri kalan fetüslerde sinüs ile kabuk arası boşluk daha dardı',
        ],
      ],
      not: 'Kaynaklar: Koktener ve ark. (2007); Serhatlioglu ve ark. (2003); Karadaş ve ark. (2026); Çolak ve ark. (2026); Selvi ve ark. (2026). Koktener, Serhatlioglu, Çolak ve Selvi çalışmalarının yalnızca özeti okundu. Liliequist zarı ve sisterna perdeleriyle ilgili Türkiye’den çalışmalar “Örümcek ağı zar” bölümündeki tabloda.',
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Başı iri bir bebek',
      oyku: 'İki aylık bir bebeğin baş çevresi rutin kontrolde yaşıtlarından büyük ölçülüyor. Bebek iyi besleniyor, gelişimi yaşına uygun. Ultrasonda kafatası ile beyin kabuğu arasındaki subaraknoid boşluk 2,8 mm, iki yarımküre arası 3,9 mm ölçülüyor. Aile, bebeğin beyninin çevresinde “fazla su” olup olmadığını soruyor.',
      soru: 'Bu ölçümler yaşıtlarına göre nasıl okunabilir ve ölçümde nelere dikkat etmek gerekir?',
      cozum: `**Başvuru değerleri:** İzmir’de 0–3 aylık 125 sağlıklı bebekte önerilen üst sınırlar (95. yüzdelik) şunlardır: kafatası ile kabuk arası 3,1 mm, sinüs ile kabuk arası 3,8 mm, yarımküreler arası 4,2 mm (Çolak ve ark., 2026). Bu bebeğin iki ölçümü de bu sınırların altındadır.

**Yaş:** Aynı çalışmada genişlikler yaşla düzenli arttı. Kafatası–kabuk ve sinüs–kabuk genişliğiyle bağımsız ilişkili tek değişken yaştı (Çolak ve ark., 2026). Bu yüzden ölçüm bebeğin yaşına göre okunmalıdır.

**Teknik:** MR’da koronal T2 kesitte yapılan ölçüm, aksiyel kesittekinden daha tekrarlanabilir ve doğru bulundu (Zhang ve ark., 2022a). Bu yüzden ölçümün hangi yöntemle ve hangi kesitte yapıldığı da önemlidir.

**Sınır:** Bu üst sınırlar tek bir çalışmanın özetinden gelir. Tanı ve izlem kararı bebeği izleyen çocuk hekimine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
