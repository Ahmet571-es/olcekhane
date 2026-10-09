import type { DersBolumu } from '../../../types';

/**
 * 01. bölüm: sinir sistemi ne yapar ve nasıl bölünür: duyu–bütünleştirme–yanıt, MSS ve ÇSS, somatik–otonom–enterik,
 * afferent–efferent, işlevsel bileşenler, gri ve beyaz cevher, çekirdek–gangliyon ve yol–sinir adları, MSS–ÇSS geçiş bölgesi.
 */
export const neYapar: DersBolumu = {
  id: 'sinir-sistemi-ne-yapar',
  baslik: 'Sinir sistemi ne yapar, nasıl bölünür?',
  bloklar: [
    // ——— Ne yapar? ———
    {
      tur: 'metin',
      md: `Gray’in anatomi kitabının 1918 baskısı sinir sistemini şöyle tanıtır: bedendeki sistemlerin **en karmaşık ve en yüksek düzeyde örgütlenmiş** olanı. Görevi, bedenin süreçlerini birbirine bağlamak ve canlıyı çevresine uydurmaktır. Bilinçli yaşam da beyin kabuğuyla ilgilidir (Gray, 1918).

Bugünkü ders kitapları bu işi üç adımda özetler (OpenStax 12.1):

- **Duyu (algılama):** Bedenin içinden ve dışından gelen uyaranları fark etmek.
- **Bütünleştirme:** Gelen bilgiyi tartıp ne yapılacağına karar vermek. Bunun için bilgi öteki duyularla, anılarla, o anki duygu durumuyla ve öğrenilenlerle birleştirilir.
- **Yanıt (tepki):** Kasları kasmak ve bezleri çalıştırmak. Sinir sistemi üç kas türünün üçünü de kasabilir: iskelet kası, kalp kası ve iç organlardaki düz kas. Bezlerin salgısını da yönetir.

Elindeki telefon titrediğinde bu üç adım art arda olur. Aşağıdaki çizimde bu yolculuğu adım adım izleyebilirsin.`,
    },
    {
      tur: 'animasyon',
      ad: 'sinir-sistemi-haritasi',
      baslik: 'Sinir sisteminin haritası ve bir uyarının yolculuğu',
      aciklama:
        'Mavi bölüm merkezî sinir sistemidir: beyin ve omurilik. Turuncu bölüm çevresel sinir sistemidir: beyinden ve omurilikten çıkan sinirler ile gangliyonlar (sinir hücresi kümeleri). “Başlat” düğmesine bas ve titreşen telefon örneğini izle. Sırayla algılama (duyu), iletim, birleştirme (bütünleştirme) ve tepki (yanıt) adımlarını görürsün.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Duyu mu, algı mı?** İkisi aynı şey değildir. Duyu (*sensation*), uyaranı yakalayan hücrelerin (almaç ya da reseptör) uyaranın olduğu yerde etkinleşmesidir. Algı (*perception*) ise bu uyarıların merkezde anlamlı bir örüntüye dönüştürülmesidir (OpenStax 14.1). Almaçlar üç ölçüte göre sınıflanır: hücre türü, konum ve işlev. Bazı duyuların kendine ayrılmış bir organı vardır: göz, iç kulak, dil, burun. Bunlara **özel duyu** denir. Bedene yayılmış olanlara **genel duyu** denir (OpenStax 14.1).

**Merkezî sinir sisteminin üç işi.** UTHealth ders kitabı merkezî sinir sistemini (MSS) yaptığı işe göre üçe ayırır (Dafny, 2020):

- duyu sistemi,
- hareket (motor) sistemi,
- iç dengeyi koruyan (homeostatik) işlevler ile yüksek beyin işlevleri.

Bu ayrım ilerideki derslerin de iskeletidir. Duyu yolları, motor yollar, hipotalamus ve beyin kabuğu ayrı ayrı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Sinir sistemi ve hormonlar',
      md: `Sinir sistemi bedeni tek başına yönetmez. Hormon sistemiyle (**endokrin sistem**) iç içe çalışır. İki örnek bu bağı açıkça gösterir:

- Ara beyindeki **hipotalamus** iki sistemin de yönetici bölgesidir. Otonom sinir sistemini, yani istem dışı işleri yöneten sistemi düzenler. Ön hipofizi düzenleyerek hormon sistemini de yönetir (OpenStax 13.2).
- Böbrek üstü bezinin iç kısmı (medulla) işlevce bir sempatik gangliyon sayılır (OpenStax 15.1). Sempatik sistem, otonom sistemin “savaş ya da kaç” diye anılan koludur. Bu sistem çalışırken adrenalin kana karışır (Spielman ve ark., 2020). Böylece sinirsel bir komut, kanla taşınan bir habere dönüşür. Ayrıntısı “Otonom ve enterik sinir sistemi” bölümünde.`,
    },

    // ——— Yerine göre: MSS ve ÇSS ———
    {
      tur: 'metin',
      md: `Anatomistler sinir sistemini önce **yerine göre** ikiye ayırır (Gray, 1918; OpenStax 12.1):

- **Merkezî sinir sistemi** (MSS; *systema nervosum centrale*): beyin ve omurilik. **Beyin** (*encephalon*) kafatasının içindedir. **Omurilik** (*medulla spinalis*) omurganın içindeki kanalda uzanır. İkisi kesintisiz tek bir yapıdır. Beyin, birinci boyun omurunun (atlas) üst kenarı hizasında omuriliğe devam eder (Gray, 1918).
- **Çevresel sinir sistemi** (ÇSS; *systema nervosum periphericum*): MSS’nin dışında kalan her şey (OpenStax 12.1). MSS’yi bedenin dokularına bağlayan sinirlerdir (Gray, 1918). UTHealth ders kitabı bu bölüme şunları koyar: 12 çift **kafa siniri**, 31 çift **omurilik siniri**, otonom sinir sistemi ve bunlara bağlı **gangliyonlar**. Gangliyon, MSS’nin dışındaki sinir hücresi kümesidir. Duyu almaçları, yani uyaranı yakalayan yapılar da bu bölümdedir (Dafny, 2020).

İki bölüm birbirinden ayrı çalışmaz. Duyu bilgisini birlikte bütünleştirir, hareketi ve bilişsel işlevleri birlikte denetler (Dafny, 2020).`,
    },
    {
      tur: 'sahne',
      baslik: 'Merkezî sinir sisteminin üst ucu: beyin',
      aciklama:
        'Beyne soldan bakıyoruz. Kafatası çok soluk bırakıldı. Renkler bölgeleri tanıtır: mavi büyük beyin, mor beyin sapı, turuncu beyincik. Beyin sapının parçaları orta beyin, pons ve omurilik soğanıdır. Fildişi renkli halkalar ilk iki boyun omurudur. Merkezî sinir sistemi burada bitmez. Omurilik soğanı, atlasın üst kenarı hizasında omuriliğe devam eder (Gray, 1918). Bu modelde omurilik, omurilik sinirleri ve kafatası dışındaki sinirler yoktur. Onları yukarıdaki çizimde görebilirsin.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'kemik', 'yuz'],
        renk: 'bolge',
        goster: ['katman:kabuk', 'katman:sap', 'katman:kemik', 'atlas', 'aksis'],
        vurgula: ['katman:kabuk', 'katman:sap', 'atlas', 'aksis'],
        bakis: 'sol',
        etiketler: [
          { yapi: 'ust-parietal-lobul-sol', metin: 'Büyük beyin' },
          { yapi: 'beyincik', metin: 'Beyincik' },
          { yapi: 'pons', metin: 'Pons (beyin sapı)' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'atlas', metin: 'Atlas (1. boyun omuru)' },
          { yapi: 'aksis', metin: 'Aksis (2. boyun omuru)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Sınır bir harita çizgisidir',
      md: '“Kafatasının ve omurga kanalının içi MSS, dışı ÇSS” demek işe yarar bir başlangıçtır. Ama bu bir basitleştirmedir: ÇSS’nin bazı parçaları bu boşlukların içinde durur (OpenStax 12.1). Bir örnek trigeminal sinirdir. Yüzün genel duyusunu bu sinir taşır (OpenStax 14.1). Bu sinirin duyu gangliyonu kafatasının içindedir. Beyni saran sert zarın oluşturduğu bir cepte durur (Gray, 1918; FIPAT, 2019). Merkezî ile çevresel arasındaki çizgi, sinir sisteminin hangi özelliğine bakıldığına göre de değişebilir (OpenStax 12.1).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Adlar ve sınırlar.** Anatomi terimlerinin uluslararası listesine Terminologia Anatomica denir. Bugünkü 2. baskısının kısa adı TA2’dir. Bu liste merkezî sinir sistemine *systema nervosum centrale*, çevresel sinir sistemine *systema nervosum periphericum* der. İki adın birer eş anlamlısı da vardır: *pars centralis systematis nervosi* ve *pars peripherica systematis nervosi*. Liste otonom sistemi de çevresel sistemin bir parçası olarak sayar. Verdiği ad bunu açıkça söyler: *divisio autonomica systematis nervosi peripherici*, yani “çevresel sinir sisteminin otonom bölümü” (FIPAT, 2019). Oysa işlev bakımından otonom sistem iki bölümün arasında durur. Bir kısmı ÇSS’de, bir kısmı MSS’dedir (Dafny, 2020).

Aynı liste görme sinirini (optik sinir) de kafa sinirleri arasında, yani çevresel sistemde sayar (FIPAT, 2019). Oysa optik sinirin dokusu MSS’ye aittir; sinir, MSS’nin bir uzantısıdır. Aksonlarını saran yağlı kılıfa miyelin denir. Optik sinirde bu kılıfı, MSS’ye özgü oligodendrosit hücreleri yapar (Romano ve ark., 2019). Adı ile dokusu uyuşmayan bu örneği aşağıdaki sahnede göreceğiz.

**Gray’in ikili ayrımı.** Gray (1918) çevresel sinirleri iki gruba ayırır: “serebrospinal” (beyin-omurilik) sinirler ve “sempatik” sinirler. Ama bu ayrımın keyfî olduğunu kendisi yazar: iki grup birbirine sıkıca bağlıdır ve iç içedir. Her yanda 43 serebrospinal sinir sayar: beyne bağlı 12 kafa siniri ve omuriliğe bağlı 31 omurilik siniri. Onun “sempatik” dediği sistem iç organların hareketini, damarların çapını ve salgıları düzenler (Gray, 1918). Yani bugünkü otonom sistemin bütünüdür. Gray’in kitabındaki terim tablosunda Langley’nin adları da yer alır. Langley aynı sisteme “otonom”, kafa-sağrı (kraniyosakral) kısmına “parasempatik” der (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **MSS** = beyin + omurilik. İkisi atlasın üst kenarı hizasında birbirine devam eder (Gray, 1918).
- **ÇSS** = 12 çift kafa siniri + 31 çift omurilik siniri + otonom sistem + gangliyonlar. Duyu almaçları da ÇSS’dedir (Dafny, 2020).
- **TA2:** Otonom bölüm ÇSS’nin bir parçasıdır (*divisio autonomica systematis nervosi peripherici*). Optik sinir de kafa sinirleri arasında sayılır (FIPAT, 2019).
- **Tuzak:** “Kafa siniri gangliyonları kafatasının dışındadır” demek yanlıştır. Trigeminal gangliyon kafatasının içinde, sert zarın oluşturduğu bir cepte durur (*cavum trigeminale*) (Gray, 1918; FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Merkezî ile çevreselin buluştuğu yer: geçiş bölgesi.** Sinir kökçüğü, sinir kökünü oluşturan ince ipliklerden biridir. Kökçük beyin sapından ya da omurilikten çıkarken bir süre iki dokuyu birden taşır. Bu kesime **MSS–ÇSS geçiş bölgesi** denir (Fraher, 2000). Sınırın iki yanı farklıdır:

- **Merkez tarafı:** Miyelini oligodendrositler yapar. Destek dokusu astrositlerden oluşur.
- **Çevre tarafı:** Miyelini Schwann hücreleri yapar. Bu hücreleri ince bir bağ dokusu (endonöryum) sarar (Fraher, 2000).

Omurilikte bu sınır iki yerde bulunur. Önde hareket liflerinin çıktığı yerlerdedir (**motor çıkış noktaları**). Arkada duyu köklerinin girdiği yerlerdedir (**arka kök giriş bölgeleri**, İngilizce kısaltmasıyla DREZ). Omuriliği saran sınır, astrositlerin yaptığı bir engeldir. Adı **glia limitans**, yani “glia sınırı”dır (Fontenas, 2023). Kafa sinirlerinde aynı miyelin geçişine **Obersteiner–Redlich bölgesi** denir. Bu bölgenin merkezi kesimini oligodendrositler, çevresel kesimini Schwann hücreleri miyelinler (Okuhata ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kafa sinirlerinde merkezi miyelin ve geçiş bölgesi',
      sutunlar: ['Sinir', 'Ölçülen', 'Değer', 'Kaynak'],
      satirlar: [
        [
          'Trigeminal (V)',
          'Sinirin sıvı dolu sarnıçta (sisternal) uzanan kesiminin uzunluğu',
          '8–15 mm (ortalama 12,3 mm)',
          'Peker ve ark. (2006)',
        ],
        [
          'Trigeminal (V)',
          'Merkezi miyelinin ponstan dışarı uzanımı, iç (medial) yüz',
          '0,1–2,5 mm (ortalama 1,13 mm)',
          'Peker ve ark. (2006)',
        ],
        [
          'Trigeminal (V)',
          'Merkezi miyelinin ponstan dışarı uzanımı, dış (lateral) yüz',
          '0,17–6,75 mm (ortalama 2,47 mm)',
          'Peker ve ark. (2006)',
        ],
        ['Trigeminal (V)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '4,19 ± 0,81 mm', 'Guclu ve ark. (2011)'],
        ['Fasiyal (VII)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '2,86 ± 1,19 mm', 'Guclu ve ark. (2011)'],
        ['Glossofaringeal (IX)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '1,51 ± 0,39 mm', 'Guclu ve ark. (2011)'],
        ['Vagus (X)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '1,63 ± 1,15 mm', 'Guclu ve ark. (2011)'],
      ],
      not: 'Peker ve arkadaşları (2006) İstanbul’da 100 trigeminal sinir inceledi. Merkezi miyelin sinir boyunun yalnızca ilk dörtte birini kaplıyordu. Guclu ve arkadaşları (2011) Lyon’da 6 taze kadavrada dört siniri karşılaştırdı. İki çalışmanın yöntemi ve incelediği örnekler farklıdır. Değerler ortalamadır.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kök giriş bölgesi ile geçiş bölgesi aynı yer değildir',
      md: `Peker ve arkadaşları (2006) kadavralarda trigeminal siniri ölçtü. Sinirin ponsa girdiği yerden merkezi miyelin bir süre dışarı uzanıyordu. Bu uzanım iç yüzde ortalama 1,13 mm, dış yüzde ortalama 2,47 mm idi (en çok 6,75 mm). Demek ki iki yer aynı nokta değildir. Biri, sinirin beyin sapına girdiği yerdir (kök giriş bölgesi). Öteki, merkezi ve çevresel miyelinin buluştuğu yerdir (geçiş bölgesi). Aradaki uzaklık sinirin iki yüzünde bile farklıdır (Peker ve ark., 2006).

Merkezi kesimin uzanımı sinire göre de değişir. Geçiş bölgesinin beyin sapına en uzak noktası şu mesafededir (Guclu ve ark., 2011):

- trigeminal sinirde yaklaşık 4,2 mm,
- yüz sinirinde (fasiyal sinir) 2,9 mm,
- dil-yutak (glossofaringeal) ve vagus sinirlerinde 1,5–1,6 mm.

Bu ölçümlerin amacı, damar basısının yol açtığı hastalıkların anatomisini anlamaktı. Bunlara örnek **trigeminal nevralji** (yüz ağrısı nöbetleri) ve **hemifasiyal spazmdır** (yüzün bir yarısının istemsiz kasılması) (Guclu ve ark., 2011). Okuhata ve arkadaşlarının (2026) güncel derlemesi bir açıklama daha verir. Sinirin çevresel kesimi basıya merkezi kesimden daha dayanıklıdır. Bu yüzden geçiş bölgesi, komşu damarların basısına karşı kırılgandır. Kafa sinirlerinin cerrahi anatomisi, Anatomi bölümünün kafa siniri derslerinde ayrıntılı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Geçiş bölgesi: yeniden büyümenin sınırı',
      md: 'Miyelin kılıfındaki boşluklara Ranvier düğümü denir. Geçiş bölgesindeki düğümler, merkezi ve çevresel tipin özelliklerini karışık olarak taşır. Astrositlerin oluşturduğu yüzeyi yalnızca aksonlar geçer (Fraher, 2000). Erişkin hayvanlarda aksonlar, kökün içindeki bağ dokusu tüplerinde (endonöral tüpler) iyi yeniden büyür. Ama geçiş bölgesindeki gliotik dokuya, yani glia hücrelerinin sıklaştığı dokuya ulaşınca durur (Fraher, 2000). MSS’de aksonların yeniden büyümesini (rejenerasyon) incelemek için sık kullanılan bir model vardır: sıçanın arka kök geçiş bölgesi. Deneylerin genel amacı, aksonları bu engelden geçirip omuriliğin arka kesimine ulaştırmaktır (Fraher, 2000). Sınırın iki yanındaki glia hücreleri ne kadar esnektir? Bu soru, geçiş bölgeleri üzerine güncel bir derlemenin konusudur (Fontenas, 2023).',
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Kopan arka kökler',
      oyku: '24 yaşında bir motosiklet sürücüsü kazada sol omzunun üzerine düşüyor. Aylar sonra sol kolunun bir bölümünde dokunma ve ağrı duyusu hâlâ yok. Görüntülemeye göre bazı arka kökler, omurilikle birleştikleri yerden kopmuş olabilir. Ekip şunu tartışıyor: Kopan kökleri omuriliğe yeniden yaklaştırmak, duyu liflerinin geri büyümesine yeter mi?',
      soru: 'Kopan arka kök yerine konsa bile, duyu aksonlarının omuriliğe girmesini hangi anatomik engel önler?',
      cozum: `**Engel, MSS–ÇSS geçiş bölgesidir.** Arka kökçükler omuriliğe arka kök giriş bölgesinden (DREZ) girer. Omuriliğin yüzeyini astrositlerin yaptığı bir sınır kaplar: glia limitans (Fontenas, 2023). Bu sınırın çevre tarafında aksonları Schwann hücreleri miyelinler. Bu hücreleri ince bir bağ dokusu (endonöryum) sarar. Merkez tarafında miyelini oligodendrositler yapar ve destek dokusu astrositlerden oluşur (Fraher, 2000).

**Neden durur?** Erişkin hayvan deneylerinde aksonlar, kökün içindeki bağ dokusu tüplerinde (endonöral tüpler) iyi büyür. Ama geçiş bölgesindeki gliotik dokuya ulaşınca büyümeyi bırakır (Fraher, 2000). Duyu nöronlarının gövdeleri arka kök gangliyonundadır, yani çevresel sistemdedir (OpenStax 12.2; OpenStax 13.4). Büyüyen uzantıları omuriliğin sınırına kadar gelebilir, ama o sınırı geçemez.

**Karşılaştırma:** Aynı nöronun çevresel sinirdeki uzantısı ezilmiş olsaydı ne olurdu? Sinirin bağ dokusu kılıfları sağlam kalsaydı, aksonlar günde yaklaşık 1 mm hızla yeniden büyüyebilirdi. Bu hasarın adı **aksonotmezistir**. Sinir tümüyle kesilseydi (**nörotmezis**), cerrahi onarım olmadan kendiliğinden yeniden büyüme olmazdı (Grinsell ve Keating, 2014). Sorun aksonun büyüme yeteneğinde değil, sınırın kendisindedir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— İşine göre: somatik, otonom, enterik ———
    {
      tur: 'metin',
      md: `Sinir sistemi bir de **yaptığı işe göre** bölünür. Ama yere göre bölümler ile işe göre bölümler aynı şey değildir (OpenStax 12.1):

- **Somatik sinir sistemi:** Bilinçli algıyı ve istemli hareketleri yönetir. İskelet kaslarını kasar (OpenStax 12.1; OpenStax 15.1).
- **Otonom sinir sistemi:** Bedeni istem dışı yönetir. Çoğunlukla iç ortamın dengesi (**homeostaz**) için çalışır. Kalp kasını, düz kasları ve bezleri denetler (OpenStax 12.1; OpenStax 15.1). İki kolu vardır. **Sempatik** kol “savaş ya da kaç”, **parasempatik** kol “dinlen ve sindir” tepkisiyle anılır (OpenStax 15.1).
- **Enterik sinir sistemi:** Sindirim kanalının duvarındaki sinir ağıdır. Kanalın düz kasını ve bezlerini yönetir. Çalışmak için MSS’ye muhtaç değildir (OpenStax 12.1).

Bilginin yönü de ad verir. MSS’ye bilgi getiren liflere **afferent** (getirici) lif denir. MSS’den komut götüren liflere **efferent** (götürücü) lif denir. Latincede afferent “doğru taşıyan”, efferent “uzağa taşıyan” demektir (Dafny, 2020). Gray (1918) bu yüzden duyu sinirlerine afferent sinir de der. Akılda tutmanın kolay yolu: **a**fferent **a**lır ve içeri getirir, **e**fferent **e**tki için dışarı götürür.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Yerine göre:** MSS = beyin + omurilik. ÇSS = kafa sinirleri (12 çift) + omurilik sinirleri (31 çift) + gangliyonlar.

**İşine göre:**

- Somatik: bilinçli algı, istemli hareket, iskelet kası.
- Otonom: istem dışı; kalp kası, düz kas, bezler. Sempatik kol “savaş ya da kaç”, parasempatik kol “dinlen ve sindir”.
- Enterik: sindirim kanalının kendi ağı.

**Yöne göre:** afferent = MSS’ye getiren, efferent = MSS’den götüren.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**“Somatik = istemli” tam doğru değildir.** Somatik hareket yanıtlarının bir kısmı reflekstir. Çoğu zaman bilinçli bir karar olmadan gerçekleşir (OpenStax 12.1).

**Otonom sistemin alt bölümleri.** UTHealth otonom sistemi üç alt bölüme ayırır (Dafny, 2020):

- sempatik bölüm (torakolomber, yani göğüs-bel bölümü),
- parasempatik bölüm (kraniyosakral, yani kafa-sağrı bölümü),
- enterik bölüm.

Çıkış düzeyleri, iki nöronlu zincir, gangliyonlar ve haberci maddeler bu dersin “Otonom ve enterik sinir sistemi” bölümünde.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sinir sisteminin işlevsel bölümleri',
      sutunlar: ['Bölüm', 'Neyi yönetir?', 'Çıktığı yer ya da bulunduğu yer', 'TA2 adı'],
      satirlar: [
        [
          'Somatik',
          'İskelet kası; bilinçli algı ve istemli hareket (bir kısmı refleks)',
          'Kafa sinirlerinin motor çekirdekleri ve omuriliğin ön boynuzu; kafa ve omurilik sinirleri',
          '—',
        ],
        [
          'Otonom: sempatik',
          'Kalp kası, düz kas, bezler; “savaş ya da kaç”',
          'Göğüs ve üst bel omuriliği: T1–L2 (kaynağa göre L1–L3)',
          '*Pars thoracolumbalis divisionis autonomicae*',
        ],
        [
          'Otonom: parasempatik',
          'Kalp kası, düz kas, bezler; “dinlen ve sindir”',
          'Beyin sapı (III, VII, IX ve X. kafa sinirleri) ve sağrı omuriliği (S2–S4)',
          '*Pars craniosacralis divisionis autonomicae*',
        ],
        [
          'Enterik',
          'Sindirim kanalının düz kası ve bezleri',
          'Kanal duvarındaki miyenterik ve submukozal sinir ağları (pleksuslar)',
          '*Plexus entericus*',
        ],
      ],
      not: 'Kaynaklar: OpenStax 12.1, 15.1; Gray (1918); Dafny (2020); FIPAT (2019). Sempatik çıkışın alt sınırı kaynağa göre değişir. Gray bir yerde T1–L1, başka bir yerde T1–L2/L3 verir. TA2’nin notu, ara-yan (intermediolateral) çekirdeğin olağan uzanımını T1–L1/L2 olarak yazar. OpenStax yalnızca “göğüs ve üst bel” der.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'İşlevsel bileşenler: bir lifi iki soruyla sınıflamak',
      md: `Bir sinir lifi iki soruyla sınıflanabilir:

- Bilgi MSS’ye mi geliyor, yoksa MSS’den mi çıkıyor? Buna göre lif **afferent** ya da **efferent** olur.
- Lif beden duvarına mı ait, yoksa iç organlara mı? Buna göre lif **somatik** ya da **visseral** (iç organa ait) olur.

Gray (1918) bu düşüncenin erken bir biçimini verir. Ona göre hem serebrospinal hem “sempatik” sinirlerin MSS’de iki tür çekirdeği vardır. Efferent lifler **çıkış çekirdeklerinden** doğar (somatik ve sempatik efferent). Afferent lifler **sonlanma çekirdeklerinde** biter (somatik ve sempatik afferent). Tipik bir omurilik sinirinde en az dört lif türü bulunur (Gray, 1918):

| Lif türü (Gray’in “sempatik” dediğine bugün visseral denir) | Ne taşır? |
| --- | --- |
| Somatik duyusal (afferent) | Beden duvarından MSS’ye gelen duyu |
| Visseral afferent | İç organlardan MSS’ye gelen duyu |
| Somatik motor (efferent) | İskelet kasına giden komut |
| Visseral efferent (pregangliyoner, yani gangliyon öncesi) | Otonom yolun MSS’den çıkan ilk lifi; düz kasa, kalp kasına ve bezlere giden yolu başlatır |

Kafa sinirlerinin bileşimi daha çeşitlidir. Bu dört türe ek olarak **özel duyuların** sinirleri de vardır: koku, görme, işitme, denge ve tat (Gray, 1918). Üç kafa siniri (III, VII, IX) otonom gangliyonlara giden lifler de taşır. Vagus (X) ise esas olarak göğüs ve üst karın boşluğundaki otonom gangliyonlara gider. OpenStax onu “neredeyse tümüyle otonom” diye anar (OpenStax 13.4). Yine de vagus karma bir sinirdir. Aynı kitap onu hem duyu hem motor lif taşıyan sinirler arasında sayar (OpenStax 13.4). Gray de vagusun motor liflerini aşağıda anılan yan (lateral) dizide verir (Gray, 1918).

**Gövdeler nerede?** Motor kafa sinirleri beynin içindeki çıkış çekirdeklerinden doğar. Duyusal kafa sinirleri ise beynin dışındaki hücre gruplarından çıkar: gangliyonlardaki ya da duyu organlarındaki hücrelerden (Gray, 1918). İç organ reflekslerinde bilgiyi getiren (afferent) nöronların gövdeleri de duyusal gangliyonlardadır. Bu, bir kafa siniri gangliyonu ya da arka kök gangliyonu olabilir (OpenStax 15.2). Gray bazı visseral afferent gövdeleri sempatik gangliyonlara koyar (Gray, 1918). Bu, bugünkü bilgiyle uyuşmaz.

**Gelişimden gelen düzen.** Duyu ile hareketin ayrımı embriyoda başlar. Nöral tüpün (embriyodaki sinir borusu) karın taraftaki bölümüne bazal plak denir. Motor nöronları bu bölüm yapar. Sırt taraftaki alar plak ise çevreden duyu alacak nöronları yapar (OpenStax 13.2). Ayrıntısı “Sinir borusundan beyne” bölümünde. Gray motor kafa sinirlerini bazal plağın (bazal lamina) iki dizisine ayırır (Gray, 1918):

- **İç (medial) dizi:** okülomotor (III), troklear (IV), abdusens (VI) ve hipoglossal (XII) sinirler.
- **Yan (lateral) dizi:** aksesuar (XI) sinir ile trigeminal, fasiyal, glossofaringeal ve vagus (V, VII, IX, X) sinirlerinin motor lifleri.

OpenStax kafa sinirlerini basitçe üçe ayırır: 3’ü yalnız duyusal, 5’i yalnız motor, 4’ü karma (OpenStax 13.4). Bu, sade bir öğretim aracıdır. Kafa sinirlerinin ayrıntılı anlatımında ise işlevsel bileşenler kullanılır. Bileşenlerin sinir sinir dökümü Anatomi bölümünün kafa siniri derslerinde.`,
    },

    // ——— Gri ve beyaz cevher; çekirdek–gangliyon, yol–sinir ———
    {
      tur: 'metin',
      md: `Beyin ya da omurilik kesildiğinde iki ayrı renkte doku görülür (OpenStax 12.1):

- **Gri cevher** (*substantia grisea*): Sinir hücresi (nöron) gövdelerinin ve onların kısa dallarının (dendrit) yoğun olduğu bölgeler.
- **Beyaz cevher** (*substantia alba*): Nöronların uzantılarının (akson) yoğun olduğu bölgeler. Rengini, aksonları saran yağdan zengin bir kılıftan alır: **miyelin**.

Adı “gri” olsa da taze gri cevher her zaman gri görünmez. Kan içeriğine göre pembemsi, saklanma süresine göre açık kahverengi olabilir (OpenStax 12.1). Büyük beyinde gri cevher dışta, kabukta (korteks) toplanır. Beyaz cevherin derinine gömülü gri adacıklar da vardır. Bunlara kabuk altı çekirdekler (**subkortikal çekirdekler**) denir (Dafny, 2020). Omurilikte düzen tersinedir. Gri cevher içtedir ve kesitte H harfine benzer. Beyaz cevher onu dıştan sarar ve üç kordona ayrılır: ön, yan ve arka **funikuluslar** (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Gerçek bir kesitte gri ve beyaz',
      aciklama:
        'Beyin koronal düzlemde kesildi: bu düzlem beyni ön ve arka diye ayırır. Gerçeğe yakın renkler kullanıldı. Dıştaki pembemsi kabuk gri cevherdir. İçteki krem renkli bölge beyaz cevherdir. Beyaz cevherin derinindeki koyu pembe adacıklar kabuk altı (subkortikal) çekirdeklerdir. Mavi boşluklar karıncıklardır, yani beynin içindeki sıvı dolu odacıklar. Kesitin yerini kaydır ve gri ile beyaz cevherin dağılımının nasıl değiştiğini izle.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'koronal', konum: 0.12 },
        bakis: 'on',
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: 'Aynı türden yapılar MSS’de ve ÇSS’de farklı adlar alır. Nöron gövdelerinin kümesine MSS’de **çekirdek** (*nucleus*), ÇSS’de **gangliyon** (*ganglion*) denir. Akson demetine MSS’de **yol** (*tractus*), ÇSS’de **sinir** (*nervus*) denir (OpenStax 12.1). Yani bir sinir nöronlardan değil, aksonlardan oluşan bir demettir.',
    },
    {
      tur: 'tablo',
      baslik: 'Aynı yapı, iki ad',
      sutunlar: ['Yapı', 'MSS’de', 'ÇSS’de'],
      satirlar: [
        ['Nöron gövdelerinin kümesi', 'Çekirdek (*nucleus*)', 'Gangliyon (*ganglion*)'],
        ['Akson demeti', 'Yol (*tractus*)', 'Sinir (*nervus*)'],
        ['Miyelini yapan glia hücresi', 'Oligodendrosit', 'Schwann hücresi'],
      ],
      not: 'Kaynak: OpenStax 12.1 ve 12.2. Bu kuralın istisnaları lisans düzeyinde.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İstisnalar.** Beynin derinindeki “bazal gangliyonlar” MSS’dedir. Bu adı, gangliyon sözcüğü çevresel yapılar için yerleşmeden önce almışlardır. Karışıklığı önlemek için bazı kaynaklar **bazal çekirdekler** der (OpenStax 12.1). Aynı aksonlar bulundukları yere göre ad da değiştirebilir. Gözün ağ tabakasından (retina) gelen aksonlar, optik kiazmaya kadar **optik sinir** adını alır. Optik kiazma, iki optik sinirin ortada birleştiği yerdir. Kiazmadan sonra aynı aksonlara **optik yol** (traktus) denir (OpenStax 12.1). Yani optik sinirin kafatasının içinde de bir kesimi vardır. Yaklaşık 50 mm’lik sinirin son 16 mm’si kiazmanın önünde, kafa içinde uzanır (Romano ve ark., 2019).

**Yolların adı.** Yollar (traktuslar, fasiküller), kökeni ve dağılımı benzer olan akson gruplarıdır. Adlarında önce başladığı yer, sonra bittiği yer yazılır (Gray, 1918). **Kortikospinal** yol kabuktan (korteks) omuriliğe (spinal) uzanır. **Spinotalamik** yol omurilikten talamusa uzanır. Bu kural sayesinde, adını ilk kez duyduğun bir yolun nereden nereye gittiğini hemen anlarsın.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sinir mi, yol mu? Görme liflerinin adı',
      aciklama:
        'Beyne alttan bakıyoruz. Turuncu: gözlerden gelen iki optik sinir. Mavi: iki sinirin ortada birleştiği optik kiazma ve kiazmadan geriye uzanan iki optik yol (traktus). Talamus, hipotalamus, hipofiz ve beyin sapı soluk bırakıldı. Aynı aksonlar kiazmaya kadar sinir, kiazmadan sonra yol adını alır (OpenStax 12.1). Bu yüzden beynin tabanında kiazmanın önünde görülen kesim hâlâ optik sinirdir. Renkler yalnızca adı gösterir: sinir ÇSS’deki, yol MSS’deki addır. Dokusuna bakılırsa optik sinir MSS’nin bir uzantısıdır ve miyelinini oligodendrositler yapar (Romano ve ark., 2019). TA2 ise onu kafa sinirleri arasında sayar (FIPAT, 2019).',
      sahne: {
        katmanlar: ['derin', 'sap'],
        renk: 'yapi',
        goster: [
          'optik-sinir',
          'optik-kiazma',
          'optik-traktus',
          'talamus',
          'hipotalamus',
          'mamiller-cisimler',
          'hipofiz',
          'bolge:beyin-sapi',
        ],
        vurgula: ['optik-sinir', 'optik-kiazma', 'optik-traktus'],
        boya: [
          { secici: ['optik-sinir'], renk: '#e09a24' },
          { secici: ['optik-kiazma', 'optik-traktus'], renk: '#4f7cf0' },
        ],
        bakis: 'alt',
        etiketler: [
          { yapi: 'optik-sinir-sol', metin: 'Optik sinir (kiazmaya kadar)' },
          { yapi: 'optik-kiazma', metin: 'Optik kiazma (ad değişir)' },
          { yapi: 'optik-traktus-sol', metin: 'Optik yol (kiazmadan sonra)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      md: 'Beyaz cevher miyelin sayesinde yağdan zengindir, gri cevher değildir. Bu fark sayesinde iki doku manyetik rezonans (MR) görüntülerinde kolayca ayırt edilir (OpenStax 12.1). MR’da neye bakılacağı ileride işlenecek: gri–beyaz cevher sınırı, derindeki gri adacıklar ve beyaz cevher hastalıkları. Bunlar Anatomi bölümünün kesit anatomisi dersinde ve İnceleme Yöntemleri bölümünün MR derslerinde.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Gri cevher = nöron gövdeleri + dendritler. Beyaz cevher = aksonlar; rengi miyelinden gelir (OpenStax 12.1).
- MSS’de **çekirdek / yol**, ÇSS’de **gangliyon / sinir** (OpenStax 12.1).
- İstisna: “bazal gangliyonlar” MSS’dedir. Doğru adı **bazal çekirdeklerdir** (OpenStax 12.1).
- Yol adı = **köken + sonlanma**: kortikospinal, spinotalamik (Gray, 1918).
- Retina aksonları kiazmaya kadar **optik sinir**, kiazmadan sonra **optik yol** adını alır (OpenStax 12.1). Optik sinirin adı sinirdir ama dokusu MSS’dir. Oligodendrositlerle miyelinlenir (Romano ve ark., 2019).
- Sinir bir **akson** demetidir, “nöron demeti” değildir (OpenStax 12.1).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Funikulus, fasikül, traktus: terimlerin tarihi',
      md: `Bir beyaz cevher alanı nadiren tek bir saf yoldur. Çoğunda farklı sistemlerin lifleri karışıktır (Gray, 1918). Anatomi terimleri de bu karmaşayla uğraşmıştır. TA2 eski bir notu aktarır. Bu not, Basel’de kabul edilen 1895 tarihli anatomi adları listesine (BNA) aittir. O zaman omurilikteki büyük beyaz cevher bölümlerine *funiculus* (kordon), tek tek demetlere *fasciculus* (demetçik) deniyordu. Paris’te kabul edilen 1955 tarihli liste (PNA) bunu değiştirdi. İşlevce aynı öneme sahip lif demetleri için *fasciculus* sözcüğünü neredeyse tümüyle bıraktı, yerine *tractus*’u koydu (FIPAT, 2019). Gri ve beyaz cevherin bugünkü adları *substantia grisea* ve *substantia alba*’dır (FIPAT, 2019).

Gray (1918) iki dokuyu kendi döneminin işlev görüşüyle anlatır. Ona göre gri madde izlenimlerin alındığı, depolandığı ve dışarı giden (efferent) uyarılara dönüştürüldüğü dokudur. Beyaz madde ise yalnızca iletir. Bugün beyaz cevherin de değişen bir doku olduğu biliniyor. Miyelinleşme, kendine özgü bir zaman ve yer düzeniyle ergenlik boyunca, erişkinliğe dek sürer (Williamson ve Lyons, 2018). Miyelinleşmenin takvimi “Sayılarla sinir sistemi” bölümünde.`,
    },
  ],
};
