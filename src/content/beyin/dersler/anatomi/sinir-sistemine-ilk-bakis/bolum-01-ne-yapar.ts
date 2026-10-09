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
      md: `Gray’in anatomi kitabının 1918 baskısı sinir sistemini, bedeni oluşturan sistemlerin **en karmaşık ve en yüksek düzeyde örgütlenmiş** olanı diye tanıtır. İşi, bedenin süreçlerini birbirine bağlamak ve canlıyı çevresine uydurmaktır; bilinçli yaşam da beyin kabuğuyla ilgilidir (Gray, 1918).

Bugünkü ders kitapları bu işi üç adımda özetler (OpenStax 12.1):

- **Duyu (algılama):** Bedenin içinden ve dışından gelen uyaranları fark etmek.
- **Bütünleştirme:** Gelen bilgiyi öteki duyularla, anılarla, o anki duygu durumuyla ve öğrenilenlerle birleştirip ne yapılacağına karar vermek.
- **Yanıt (tepki):** Kasları kasmak ve bezleri çalıştırmak. Sinir sistemi üç kas türünün üçünü de kasabilir: iskelet kasını, kalp kasını ve iç organlardaki düz kası; bezlerin salgısını da yönetir.

Elindeki telefon titrediğinde bu üç adım art arda gerçekleşir. Aşağıdaki çizimde bu yolculuğu adım adım izleyebilirsin.`,
    },
    {
      tur: 'animasyon',
      ad: 'sinir-sistemi-haritasi',
      baslik: 'Sinir sisteminin haritası ve bir uyarının yolculuğu',
      aciklama:
        'Mavi bölüm merkezî sinir sistemi (beyin ve omurilik), turuncu bölüm çevresel sinir sistemidir (beyinden ve omurilikten çıkan sinirler ile gangliyonlar). “Başlat” ile titreşen telefon örneğini izle: algılama (duyu), iletim, birleştirme (bütünleştirme) ve tepki (yanıt).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Duyu mu, algı mı?** Duyu (*sensation*), almaç (reseptör) hücrelerinin uyaranın bulunduğu yerde etkinleşmesidir; algı (*perception*) ise bu uyarıların merkezde anlamlı bir örüntüye dönüştürülmesidir (OpenStax 14.1). Almaçlar üç ölçüte göre sınıflanır: hücre türü, konum ve işlev. Kendine ayrılmış bir organı olan duyulara (göz, iç kulak, dil, burun) **özel duyu**, bedene yayılmış olanlara **genel duyu** denir (OpenStax 14.1).

**MSS’nin üç işlevsel bileşeni.** UTHealth ders kitabı merkezî sinir sistemini işlevce üçe ayırır: duyu sistemi, motor sistem ve homeostatik ve yüksek beyin işlevleri (Dafny, 2020). Bu ayrım, ilerideki derslerin de iskeletidir: duyu yolları, motor yollar, hipotalamus ve beyin kabuğu ayrı ayrı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Sinir sistemi ve hormonlar',
      md: `Sinir sistemi bedeni tek başına yönetmez; **endokrin sistemle** (hormon sistemi) iç içe çalışır. İki örnek bu bağı açıkça gösterir:

- Ara beyindeki **hipotalamus**, hem otonom sinir sisteminin hem de ön hipofizi düzenleyerek endokrin sistemin yönetici bölgesidir (OpenStax 13.2).
- Böbrek üstü bezinin iç kısmı (medulla) işlevce bir sempatik gangliyon sayılır (OpenStax 15.1). Sempatik etkinlik sırasında adrenalin kana karışır (Spielman ve ark., 2020): sinirsel bir komut böylece kanla taşınan bir habere dönüşür. Ayrıntısı “Otonom ve enterik sinir sistemi” bölümünde.`,
    },

    // ——— Yerine göre: MSS ve ÇSS ———
    {
      tur: 'metin',
      md: `Anatomistler sinir sistemini önce **yerine göre** ikiye ayırır (Gray, 1918; OpenStax 12.1):

- **Merkezî sinir sistemi** (MSS; *systema nervosum centrale*): kafatasının içindeki **beyin** (*encephalon*) ile omurga kanalının içindeki **omurilik** (*medulla spinalis*). İkisi kesintisiz tek bir yapıdır: beyin, birinci boyun omurunun (atlas) üst kenarı hizasında omuriliğe devam eder (Gray, 1918).
- **Çevresel sinir sistemi** (ÇSS; *systema nervosum periphericum*): MSS’nin dışında kalan her şey (OpenStax 12.1). MSS’yi bedenin dokularına bağlayan sinirler dizisidir (Gray, 1918). UTHealth ders kitabına göre bu bölüme 12 çift **kafa siniri**, 31 çift **omurilik siniri**, otonom sinir sistemi ve bunlarla ilişkili **gangliyonlar**, yani MSS’nin dışındaki sinir hücresi kümeleri girer; duyu almaçları da buradadır (Dafny, 2020).

İki bölüm birbirinden ayrı çalışmaz: duyu bilgisini birlikte bütünleştirir, hareketi ve bilişsel işlevleri birlikte denetler (Dafny, 2020).`,
    },
    {
      tur: 'sahne',
      baslik: 'Merkezî sinir sisteminin üst ucu: beyin',
      aciklama:
        'Beyne soldan bakıyoruz; kafatası çok soluk bırakıldı. Renkler bölgeleri tanıtır: mavi büyük beyin, mor beyin sapı (orta beyin, pons ve omurilik soğanı), turuncu beyincik; fildişi renkli halkalar ilk iki boyun omurudur. Merkezî sinir sistemi burada bitmez: omurilik soğanı, atlasın üst kenarı hizasında omuriliğe devam eder (Gray, 1918). Bu modelde omurilik, omurilik sinirleri ve kafatası dışındaki sinirler yoktur; onları yukarıdaki çizimde görebilirsin.',
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
      md: '“Kafatasının ve omurga kanalının içi MSS, dışı ÇSS” demek işe yarar bir başlangıçtır ama bir basitleştirmedir: ÇSS’nin bazı parçaları bu boşlukların içinde durur (OpenStax 12.1). Örneğin yüzün genel duyusunu taşıyan trigeminal sinirin (OpenStax 14.1) duyusal gangliyonu kafatasının içinde, sert zarın oluşturduğu bir cepte yer alır (Gray, 1918; FIPAT, 2019). Merkezî ile çevresel arasındaki çizgi, sinir sisteminin hangi özelliğine bakıldığına göre de değişebilir (OpenStax 12.1).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Adlar ve sınırlar.** Terminologia Anatomica’nın 2. baskısı (TA2) iki bölümü *systema nervosum centrale* (eş anlamlısı *pars centralis systematis nervosi*) ve *systema nervosum periphericum* (*pars peripherica systematis nervosi*) diye adlandırır; otonom sistemi de çevresel sistemin bir bölümü olarak listeler: *divisio autonomica systematis nervosi peripherici* (FIPAT, 2019). Oysa otonom sistem işlevce iki bölüm arasında bir arayüzdür: bir kısmı ÇSS’de, bir kısmı MSS’dedir (Dafny, 2020). Aynı terminoloji optik siniri de kafa sinirleri arasında, çevresel sistemin başlığı altında sayar (FIPAT, 2019); oysa optik sinir dokusu bakımından MSS’nin bir uzantısıdır ve miyelinini oligodendrositler yapar (Romano ve ark., 2019). Adı ile dokusu ayrışan bu örneği aşağıdaki sahnede göreceğiz.

**Gray’in ikili ayrımı.** Gray (1918) çevresel sinirleri “serebrospinal” ve “sempatik” diye iki gruba ayırır, ama bu ayrımın keyfî olduğunu, iki grubun birbirine sıkıca bağlı ve iç içe olduğunu kendisi yazar. Her yanda 43 serebrospinal sinir sayar: beyne bağlı 12 kafa ve omuriliğe bağlı 31 omurilik siniri. Onun “sempatik” dediği sistem iç organların hareketini, damarların çapını ve salgıları düzenler (Gray, 1918); yani bugünkü otonom sistemin bütünüdür. Gray’in kitabındaki terim tablosu bile Langley’nin aynı sisteme “otonom”, kraniyosakral kısmına “parasempatik” dediğini gösterir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **MSS** = beyin + omurilik; ikisi atlasın üst kenarı hizasında birbirine devam eder (Gray, 1918).
- **ÇSS** = 12 çift kafa siniri + 31 çift omurilik siniri + otonom sistem + gangliyonlar; duyu almaçları da ÇSS’dedir (Dafny, 2020).
- **TA2:** otonom bölüm ÇSS’nin bir bölümüdür (*divisio autonomica systematis nervosi peripherici*); optik sinir de kafa sinirleri arasında sayılır (FIPAT, 2019).
- **Tuzak:** “Kafa siniri gangliyonları kafatasının dışındadır” genellemesi yanlıştır; trigeminal gangliyon kafatasının içinde, sert zarın oluşturduğu boşluktadır (*cavum trigeminale*) (Gray, 1918; FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Merkezî ile çevreselin buluştuğu yer: geçiş bölgesi.** Bir sinir kökçüğü beyin sapından ya da omurilikten çıkarken bir süre iki dokuyu birden taşır; bu kesime **MSS–ÇSS geçiş bölgesi** denir (Fraher, 2000). Sınırın merkez tarafında miyelini oligodendrositler yapar ve destek dokusu astrositlerden oluşur; çevre tarafında miyelini, endonöryumla sarılı Schwann hücreleri yapar (Fraher, 2000).

Omurilikte bu sınır önde **motor çıkış noktalarında**, arkada **arka kök giriş bölgelerinde** (DREZ) bulunur; omuriliği çevreleyen sınır, astrositlerin yaptığı bir bariyerdir: **glia limitans** (Fontenas, 2023). Kafa sinirlerinde aynı miyelin geçişine **Obersteiner–Redlich bölgesi** denir: merkezi kesimi oligodendrositler, çevresel kesimi Schwann hücreleri miyelinler (Okuhata ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kafa sinirlerinde merkezi miyelin ve geçiş bölgesi',
      sutunlar: ['Sinir', 'Ölçülen', 'Değer', 'Kaynak'],
      satirlar: [
        ['Trigeminal (V)', 'Sinirin sarnıç (sisternal) kesiminin uzunluğu', '8–15 mm (ortalama 12,3 mm)', 'Peker ve ark. (2006)'],
        ['Trigeminal (V)', 'Merkezi miyelinin ponstan uzanımı, iç (medial) yüz', '0,1–2,5 mm (ortalama 1,13 mm)', 'Peker ve ark. (2006)'],
        [
          'Trigeminal (V)',
          'Merkezi miyelinin ponstan uzanımı, dış (lateral) yüz',
          '0,17–6,75 mm (ortalama 2,47 mm)',
          'Peker ve ark. (2006)',
        ],
        ['Trigeminal (V)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '4,19 ± 0,81 mm', 'Guclu ve ark. (2011)'],
        ['Fasiyal (VII)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '2,86 ± 1,19 mm', 'Guclu ve ark. (2011)'],
        ['Glossofaringeal (IX)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '1,51 ± 0,39 mm', 'Guclu ve ark. (2011)'],
        ['Vagus (X)', 'Geçiş bölgesinin beyin sapına en uzak noktası', '1,63 ± 1,15 mm', 'Guclu ve ark. (2011)'],
      ],
      not: 'Peker ve arkadaşları (2006) İstanbul’da 100 trigeminal sinir inceledi; merkezi miyelin sinir boyunun yalnızca ilk dörtte birini kaplıyordu. Guclu ve arkadaşları (2011) Lyon’da 6 taze kadavrada dört siniri karşılaştırdı. İki çalışmanın yöntemi ve örneklemi farklıdır; değerler ortalamadır.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kök giriş bölgesi ile geçiş bölgesi aynı yer değildir',
      md: `Peker ve arkadaşlarının (2006) kadavra ölçümlerinde trigeminal sinirin merkezi miyelini, sinirin ponsa girdiği yerden iç yüzde ortalama 1,13 mm, dış yüzde ortalama 2,47 mm (en çok 6,75 mm) dışarı uzanıyordu. Yani sinirin beyin sapına girdiği yer (kök giriş bölgesi) ile merkezi ve çevresel miyelinin buluştuğu yer (geçiş bölgesi) aynı nokta değildir ve aradaki uzaklık sinirin iki yüzünde bile farklıdır (Peker ve ark., 2006).

Merkezi kesimin uzanımı da sinire göre değişir: geçiş bölgesinin beyin sapına en uzak noktası trigeminalde yaklaşık 4,2 mm, fasiyal sinirde 2,9 mm, glossofaringeal ve vagus sinirlerinde 1,5–1,6 mm uzaktadır (Guclu ve ark., 2011). Bu ölçümler, **trigeminal nevralji** ve **hemifasiyal spazm** gibi damar basısı sendromlarının anatomisini anlamak için yapılmıştır (Guclu ve ark., 2011). Güncel bir derlemede Okuhata ve arkadaşları (2026) çevresel kesimin basıya merkezi kesimden daha dayanıklı olduğunu ve bunun geçiş bölgesini komşu damarların basısına karşı kırılgan kıldığını yazar. Kafa sinirlerinin cerrahi anatomisi, Anatomi bölümünün kafa siniri derslerinde ayrıntılı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Geçiş bölgesi rejenerasyonun sınırıdır',
      md: 'Geçiş bölgesindeki Ranvier düğümleri merkezi ve çevresel tipin karışık özelliklerini taşır; astrositlerin oluşturduğu yüzeyi yalnızca aksonlar geçer (Fraher, 2000). Erişkin hayvanlarda aksonlar kökün endonöral tüpleri içinde iyi rejenere olur, ama geçiş bölgesindeki gliotik dokuya ulaşınca büyümeyi durdurur (Fraher, 2000). Sıçan arka kök geçiş bölgesi, MSS’de akson rejenerasyonunu incelemek için yaygın bir modeldir; deneylerin genel amacı aksonları bu engelden geçirip omuriliğin arka kesimine ulaştırabilmektir (Fraher, 2000). Sınırın iki yanındaki glia hücrelerinin esnekliği, geçiş bölgeleri üzerine güncel bir derlemenin konusudur (Fontenas, 2023).',
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Kopan arka kökler',
      oyku: '24 yaşında bir motosiklet sürücüsü kazada sol omzunun üzerine düşüyor. Aylar sonra sol kolunun bir bölümünde dokunma ve ağrı duyusu hâlâ yok. Görüntülemede bazı arka köklerin omurilikle birleştikleri yerden koptuğu düşünülüyor. Ekip, kopan köklerin omuriliğe yeniden yaklaştırılmasının duyu liflerinin geri büyümesine yetip yetmeyeceğini tartışıyor.',
      soru: 'Kopan arka kök yerine getirilse bile duyu aksonlarının omuriliğe geri girmesinin önünde hangi anatomik engel vardır?',
      cozum: `**Engel, MSS–ÇSS geçiş bölgesidir.** Arka kökçükler omuriliğe arka kök giriş bölgesinden (DREZ) girer; omuriliğin yüzeyini astrositlerin yaptığı glia limitans sınırlar (Fontenas, 2023). Bu sınırın çevre tarafında aksonları endonöryumla sarılı Schwann hücreleri miyelinler; merkez tarafında miyelini oligodendrositler yapar ve destek dokusu astrositiktir (Fraher, 2000).

**Neden durur?** Erişkin hayvan deneylerinde aksonlar kökün endonöral tüpleri içinde iyi rejenere olur, ama geçiş bölgesindeki gliotik dokuya ulaşınca büyümeyi bırakır (Fraher, 2000). Duyu nöronlarının gövdeleri arka kök gangliyonunda, yani çevresel sistemde durur (OpenStax 12.2; OpenStax 13.4); büyüyen uzantıları omuriliğin sınırına kadar gelebilir, ama o sınırı geçemez.

**Karşılaştırma:** Aynı nöronun çevresel sinirdeki uzantısı ezilseydi ve sinirin bağ dokusu kılıfları sağlam kalsaydı (**aksonotmezis**), aksonlar günde yaklaşık 1 mm hızla yeniden büyüyebilirdi; sinir tümüyle kesilseydi (**nörotmezis**) cerrahi onarım olmadan kendiliğinden rejenerasyon olmazdı (Grinsell ve Keating, 2014). Sorun aksonun büyüme yeteneğinde değil, sınırın kendisindedir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— İşine göre: somatik, otonom, enterik ———
    {
      tur: 'metin',
      md: `Sinir sistemi bir de **yaptığı işe göre** bölünür; ama anatomik bölümler ile işlevsel bölümler aynı şey değildir (OpenStax 12.1):

- **Somatik sinir sistemi:** bilinçli algıdan ve istemli hareketlerden sorumludur; iskelet kaslarını kasar (OpenStax 12.1; OpenStax 15.1).
- **Otonom sinir sistemi:** bedeni istem dışı yönetir, çoğunlukla iç ortamın dengesi (**homeostaz**) için; kalp kasını, düz kasları ve bezleri denetler (OpenStax 12.1; OpenStax 15.1). İki kolu vardır: **sempatik** kol “savaş ya da kaç”, **parasempatik** kol “dinlen ve sindir” tepkisiyle anılır (OpenStax 15.1).
- **Enterik sinir sistemi:** sindirim kanalının duvarındaki sinir ağıdır; kanalın düz kasını ve bezlerini yönetir ve çalışmak için MSS’ye muhtaç değildir (OpenStax 12.1).

Bilginin yönü de ad verir. MSS’ye bilgi getiren liflere **afferent** (getirici), MSS’den komut götüren liflere **efferent** (götürücü) lif denir; Latincede afferent “doğru taşıyan”, efferent “uzağa taşıyan” demektir (Dafny, 2020). Gray (1918) duyu sinirlerine bu yüzden afferent sinir de der. Akılda tutmanın kolay yolu: **a**fferent **a**lır ve içeri getirir, **e**fferent **e**tki için dışarı götürür.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Yerine göre:** MSS = beyin + omurilik; ÇSS = kafa sinirleri (12 çift) + omurilik sinirleri (31 çift) + gangliyonlar.\n\n**İşine göre:** somatik (bilinçli algı, istemli hareket, iskelet kası), otonom (istem dışı; kalp kası, düz kas, bezler; sempatik “savaş ya da kaç”, parasempatik “dinlen ve sindir”), enterik (sindirim kanalının kendi ağı).\n\n**Yöne göre:** afferent = MSS’ye getiren, efferent = MSS’den götüren.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**“Somatik = istemli” tam doğru değildir.** Somatik motor yanıtların bir kısmı reflekstir ve çoğu zaman bilinçli bir karar olmadan gerçekleşir (OpenStax 12.1).

**Otonom sistemin alt bölümleri.** UTHealth otonom sistemi üç alt bölüme ayırır: sempatik (torakolomber), parasempatik (kraniyosakral) ve enterik (Dafny, 2020). Çıkış düzeyleri, iki nöronlu zincir, gangliyonlar ve haberci maddeler bu dersin “Otonom ve enterik sinir sistemi” bölümünde.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sinir sisteminin işlevsel bölümleri',
      sutunlar: ['Bölüm', 'Neyi yönetir?', 'Çıkış ya da yer', 'TA2 adı'],
      satirlar: [
        [
          'Somatik',
          'İskelet kası; bilinçli algı ve istemli hareket (bir kısmı refleks)',
          'Kafa siniri motor çekirdekleri ve omuriliğin ön boynuzu; kafa ve omurilik sinirleri',
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
          'Beyin sapı (III, VII, IX ve X. kafa sinirleri) ve sakral omurilik (S2–S4)',
          '*Pars craniosacralis divisionis autonomicae*',
        ],
        [
          'Enterik',
          'Sindirim kanalının düz kası ve bezleri',
          'Kanal duvarındaki miyenterik ve submukozal pleksuslar',
          '*Plexus entericus*',
        ],
      ],
      not: 'Kaynaklar: OpenStax 12.1, 15.1; Gray (1918); Dafny (2020); FIPAT (2019). Sempatik çıkışın alt sınırı kaynağa göre değişir: Gray bir yerde T1–L1, başka bir yerde T1–L2/L3 verir; TA2 notu intermediolateral çekirdeğin olağan uzanımını T1–L1/L2 olarak yazar; OpenStax yalnızca “göğüs ve üst bel” der.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'İşlevsel bileşenler: bir lifi iki soruyla sınıflamak',
      md: `Bir sinir lifi iki soruyla sınıflanabilir: bilgi MSS’ye mi geliyor, MSS’den mi çıkıyor (**afferent / efferent**), beden duvarına mı yoksa iç organlara mı ait (**somatik / visseral**)? Gray (1918) bu düşüncenin erken bir biçimini verir: hem serebrospinal hem “sempatik” sinirlerin MSS’de **çıkış çekirdekleri** (somatik ve sempatik efferent) ve **sonlanma çekirdekleri** (somatik ve sempatik afferent) vardır. Ona göre tipik bir omurilik sinirinde en az dört lif türü bulunur (Gray, 1918):

| Lif türü (Gray’in “sempatik” dediği bugün visseraldir) | Ne taşır? |
| --- | --- |
| Somatik duyusal (afferent) | Beden duvarından MSS’ye gelen duyu |
| Visseral afferent | İç organlardan MSS’ye gelen duyu |
| Somatik motor (efferent) | İskelet kasına giden komut |
| Visseral efferent (pregangliyoner) | Düz kas, kalp kası ve bezlere giden otonom yolun MSS’den çıkan ilk lifi |

Kafa sinirlerinin bileşimi daha çeşitlidir: bu dörde ek olarak koku, görme, işitme, denge ve tat gibi **özel duyuların** sinirleri de vardır (Gray, 1918). Üç kafa siniri (III, VII, IX) otonom gangliyonlara giden lifler de taşır; vagus (X) ise esas olarak göğüs ve üst karın boşluğundaki otonom gangliyonlara gider ve OpenStax onu “neredeyse tümüyle otonom” diye anar (OpenStax 13.4). Yine de vagus karma bir sinirdir: aynı kitap onu hem duyu hem motor lif taşıyan sinirler arasında sayar (OpenStax 13.4), Gray de motor liflerini aşağıda anılan lateral dizide verir (Gray, 1918).

**Gövdeler nerede?** Motor kafa sinirleri beynin içindeki çıkış çekirdeklerinden doğar; duyusal kafa sinirleri ise beynin dışındaki hücre gruplarından, yani gangliyonlardaki ya da duyu organlarındaki hücrelerden çıkar (Gray, 1918). İç organ reflekslerinin afferent nöronlarının gövdeleri de duyusal gangliyonlardadır: bir kafa siniri gangliyonunda ya da arka kök gangliyonunda (OpenStax 15.2). Gray’in bazı visseral afferent gövdelerini sempatik gangliyonlara koyması (Gray, 1918) bugünkü bilgiyle uyuşmaz.

**Gelişimden gelen düzen.** Duyu ile hareketin ayrımı embriyoda başlar: nöral tüpün karın taraftaki bazal plağı motor nöronları, sırt taraftaki alar plağı çevreden duyu alacak nöronları yapar (OpenStax 13.2); ayrıntısı “Sinir borusundan beyne” bölümünde. Gray motor kafa sinirlerini bazal laminanın iki dizisine ayırır: **medial dizi** okülomotor (III), troklear (IV), abdusens (VI) ve hipoglossal (XII) sinirleri; **lateral dizi** aksesuar (XI) siniri ile trigeminal, fasiyal, glossofaringeal ve vagus (V, VII, IX, X) sinirlerinin motor liflerini verir (Gray, 1918).

OpenStax’in “3 kafa siniri yalnız duyusal, 5’i yalnız motor, 4’ü karma” sınıflaması (OpenStax 13.4) sade bir öğretim aracıdır; kafa sinirlerinin ayrıntılı anlatımında ise işlevsel bileşenler kullanılır. Bileşenlerin sinir sinir dökümü Anatomi bölümünün kafa siniri derslerinde.`,
    },

    // ——— Gri ve beyaz cevher; çekirdek–gangliyon, yol–sinir ———
    {
      tur: 'metin',
      md: `Beyin ya da omurilik kesildiğinde iki ayrı renkte doku görülür (OpenStax 12.1):

- **Gri cevher** (*substantia grisea*): nöron gövdelerinin ve dendritlerin yoğun olduğu bölgeler.
- **Beyaz cevher** (*substantia alba*): aksonların yoğun olduğu bölgeler. Rengini, aksonları saran, yağdan zengin **miyelin** kılıfından alır.

Adı “gri” olsa da taze dokuda gri cevher kan içeriğine göre pembemsi, saklanma süresine göre açık kahverengi görünebilir (OpenStax 12.1). Büyük beyinde gri cevher dışta, kabukta (korteks) toplanır; beyaz cevherin derinine gömülü gri adacıklara **subkortikal çekirdekler** denir (Dafny, 2020). Omurilikte düzen tersinedir: gri cevher içtedir ve kesitte H harfine benzer; beyaz cevher onu dıştan sarar ve ön, yan ve arka **funikuluslara** ayrılır (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Gerçek bir kesitte gri ve beyaz',
      aciklama:
        'Beyin önden arkaya doğru (koronal) kesildi; gerçeğe yakın renkler kullanıldı. Dıştaki pembemsi kabuk gri cevher, içteki krem renkli bölge beyaz cevherdir; beyaz cevherin derinindeki koyu pembe adacıklar subkortikal çekirdekler, mavi boşluklar karıncıklardır. Kesitin yerini kaydırarak gri ve beyaz cevherin dağılımının nasıl değiştiğini izle.',
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
      md: 'Aynı türden yapılar MSS’de ve ÇSS’de farklı adlar alır. Nöron gövdelerinin kümesine MSS’de **çekirdek** (*nucleus*), ÇSS’de **gangliyon** (*ganglion*) denir; akson demetine MSS’de **yol** (*tractus*), ÇSS’de **sinir** (*nervus*) denir (OpenStax 12.1). Yani bir sinir, nöronların değil, aksonların oluşturduğu bir demettir.',
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
      md: `**İstisnalar.** Beynin derinindeki “bazal gangliyonlar” MSS’de oldukları hâlde bu adı, gangliyon sözcüğü çevresel yapılar için yerleşmeden önce almıştır; karışıklığı önlemek için bazı kaynaklar **bazal çekirdekler** der (OpenStax 12.1). Aynı aksonlar konumlarına göre ad değiştirebilir: retina aksonları gözden optik kiazmaya kadar **optik sinir**, kiazmadan sonra **optik yol** (traktus) adını alır; ad kiazmada değişir (OpenStax 12.1). Yani optik sinirin kafatasının içinde de bir kesimi vardır: yaklaşık 50 mm’lik sinirin son 16 mm’si kiazmanın önünde, kafa içinde uzanır (Romano ve ark., 2019).

**Yolların adı.** Yollar (traktuslar, fasiküller) kökeni ve dağılımı benzer olan akson gruplarıdır. Adlarında önce kökenin, sonra sonlanma yerinin adı yazılır (Gray, 1918): **kortikospinal** yol kabuktan (korteks) omuriliğe (spinal), **spinotalamik** yol omurilikten talamusa uzanır. Bu kural, adını ilk kez duyduğun bir yolun nereden nereye gittiğini hemen söyler.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sinir mi, yol mu? Görme liflerinin adı',
      aciklama:
        'Beyne alttan bakıyoruz. Turuncu: gözlerden gelen iki optik sinir; mavi: iki sinirin ortada birleştiği optik kiazma ve kiazmadan geriye uzanan iki optik yol (traktus). Talamus, hipotalamus, hipofiz ve beyin sapı soluk bırakıldı. Aynı aksonlar kiazmaya kadar sinir, kiazmadan sonra yol adını alır (OpenStax 12.1); beynin tabanında kiazmanın önünde görülen kesim de bu yüzden hâlâ optik sinirdir. Renkler yalnızca adı gösterir (sinir ÇSS’deki, yol MSS’deki adlandırmadır): optik sinir dokusu bakımından MSS’nin uzantısıdır ve miyelinini oligodendrositler yapar (Romano ve ark., 2019); TA2 ise onu kafa sinirleri arasında sayar (FIPAT, 2019).',
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
      md: 'Beyaz cevher miyelin nedeniyle yağdan zengindir, gri cevher değildir; bu fark sayesinde iki doku MR görüntülerinde kolayca ayırt edilir (OpenStax 12.1). Gri–beyaz cevher sınırının, derin gri adacıkların ve beyaz cevher hastalıklarının MR’da okunması Anatomi bölümünün kesit anatomisi dersinde ve İnceleme Yöntemleri bölümünün MR derslerinde işlenecek.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Gri cevher = nöron gövdeleri + dendritler; beyaz cevher = aksonlar, rengi miyelinden (OpenStax 12.1).
- MSS’de **çekirdek / yol**, ÇSS’de **gangliyon / sinir** (OpenStax 12.1).
- İstisna: “bazal gangliyonlar” MSS’dedir; doğru adı **bazal çekirdekler** (OpenStax 12.1).
- Yol adı = **köken + sonlanma**: kortikospinal, spinotalamik (Gray, 1918).
- Retina aksonları kiazmaya kadar **optik sinir**, kiazmadan sonra **optik yol** adını alır (OpenStax 12.1). Optik sinirin adı sinirdir ama dokusu MSS’dir; oligodendrositlerle miyelinlenir (Romano ve ark., 2019).
- Sinir bir **akson** demetidir, “nöron demeti” değildir (OpenStax 12.1).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Funikulus, fasikül, traktus: terimlerin tarihi',
      md: `Bir beyaz cevher alanı nadiren saf bir yoldur; çoğunda farklı sistemlerin lifleri karışıktır (Gray, 1918). Terminoloji de bu karmaşayla uğraşmıştır. TA2’nin aktardığı 1895 tarihli BNA notuna göre omurilikteki büyük beyaz cevher bölümlerine *funiculus*, tek tek demetlere *fasciculus* deniyordu; 1955 tarihli PNA ise aynı işlevsel öneme sahip lif demetleri için *fasciculus* sözcüğünü neredeyse tümüyle bırakıp yerine *tractus*’u koydu (FIPAT, 2019). Bugünkü adlar *substantia grisea* ve *substantia alba*’dır (FIPAT, 2019).

Gray (1918) gri maddeyi izlenimlerin alındığı, depolandığı ve efferent uyarılara dönüştürüldüğü, beyaz maddeyi ise yalnızca ileten doku olarak anlatır; bu, döneminin işlev görüşüdür. Bugün beyaz cevherin de değişen bir doku olduğu biliniyor: miyelinleşme ergenlik boyunca, erişkinliğe dek kendine özgü bir zaman ve yer düzeniyle sürer (Williamson ve Lyons, 2018). Miyelinleşmenin takvimi “Sayılarla sinir sistemi” bölümünde.`,
    },
  ],
};
