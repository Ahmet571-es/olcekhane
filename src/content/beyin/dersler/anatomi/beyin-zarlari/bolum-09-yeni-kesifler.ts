import type { DersBolumu } from '../../../types';

/**
 * 09. bölüm: yeni keşifler. Zar lenf damarları (fare ve insan; sırt ve taban damarları; MR), glenfatik hipotezin
 * derinleştirilmesi (ilk dersteki anlatım tekrarlanmaz; damar çevresi pompalama, insanda dolaylı ölçümler), SLYM ve
 * itirazlar (kanıtlanmış dördüncü zar diye anlatılmaz), ACE noktaları, kafatası kemik iliği ile zarlar arasındaki
 * kanallar (yalnızca bağışıklık açısından), zarlardaki bağışıklık hücreleri. Her keşifte canlı, yöntem, kesinlik ve
 * itiraz ayrı verilir. Bilgiler S2 kaynak notlarından (B, D, A).
 */
export const yeniKesifler: DersBolumu = {
  id: 'yeni-kesifler',
  baslik: 'Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar',
  bloklar: [
    // ——— Giriş ———
    {
      tur: 'metin',
      md: `Beyin zarları uzun süre basit bir örtü sanıldı. Bugün beynin gelişimi, dengesi ve birçok hastalık için gerekli bir arayüz olarak görülüyor (Derk ve ark., 2021). Bir derlemeye göre zarlar edilgen bir kılıf değil, etkin bir sinir-bağışıklık organıdır. İltihabı, madde temizliğini ve hastalıkların gidişini etkiler (Joost ve ark., 2026).

Bu bölümde son yıllardaki keşiflere bakıyoruz:

- zarlardaki lenf damarları,
- beynin atıklarını nasıl temizlediğine dair glenfatik hipotez,
- “dördüncü zar” tartışması,
- zarlar arasındaki yeni geçitler,
- zarlarda yaşayan bağışıklık hücreleri.

Bu keşiflerin bazıları sağlam, bazıları tartışmalıdır. Her birinde üç soru soracağız: Hangi canlıda bulundu? Hangi yöntemle? Ne kadar kesin?`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Fare insan değildir',
      md: 'Bu bölümdeki bulguların çoğu farede yapılan deneylerden gelir. Zarların yapısı türden türe değişir: engel özellikleri, damarları ve bağışıklık hücreleri farklıdır. Bu yüzden hayvan bulguları insana dikkatle aktarılmalıdır (Joost ve ark., 2026). Bir örnek: insanda ve sıçanda örümcek ağı zarın iplikleri kollajen sütunlardır. Farede ise böyle sütunlar görülmez (Derk ve ark., 2021). Her bulguda “Hangi canlıda?” diye sor.',
    },

    // ——— Zar lenf damarları ———
    {
      tur: 'metin',
      md: `**Beynin lenf damarları var mı?** Lenf damarları, dokulardaki fazla sıvıyı ve bağışıklık hücrelerini toplayıp lenf düğümlerine taşıyan ince damarlardır. 1787’de Mascagni insan sert zarında lenf damarları bildirmişti (Ishikawa ve ark., 2026). Ama bilim dünyası sonra uzun süre beyinde ve omurilikte hiç lenf damarı olmadığını yazdı. Bu görüş 2015’teki “yeniden keşfe” kadar sürdü (Derk ve ark., 2021).

2015’te iki bağımsız ekip, farenin beyin zarlarında lenf damarları gösterdi (Ishikawa ve ark., 2026). Bu damarlar sert zarda, toplardamar sinüslerinin yanında uzanır. Bu sinüslere sert zar sinüsleri (*sinus durae matris*) denir. Lenf damarları boyundaki derin lenf düğümlerine bağlanır (Louveau ve ark., 2015). Farede beyin dokusunun içinde ve yumuşak zarın üstünde ise lenf damarı görülmedi (Aspelund ve ark., 2015).

2017’de aynı damarlar insanda ve marmoset maymununda gösterildi. Üstelik hastanelerde kullanılan türden bir MR ile canlıda görüntülendi (Absinta ve ark., 2017). Bugün sert zarda lenf damarı bulunduğu, birkaç önemli çalışmayla kesinleşmiş sayılır (Joost ve ark., 2026).

Ama bir ayrım önemlidir. İnsanda bu damarların **var olduğu** gösterildi. Ne kadar sıvı taşıdıklarını, yani **işlevlerini** ölçen veriler ise hâlâ sınırlıdır (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Zar lenf damarları nerede uzanır?',
      aciklama:
        'Beyne yukarıdan bakıyoruz: ön taraf ekranın üstünde, hastanın sağı ekranın sağında. Renkler lobları ayırır. Modelde beyincik çadırı dışında sert zar yoktur. Sinüsler ve lenf damarları da yoktur; etiketler yerlerini söyler. İki yarımkürenin arasındaki orta hattın tam üstünde, sert zarda üst sagital sinüs uzanır. Art kafa loblarının altında beyincik çadırı vardır. Enine sinüs çadırın arkadaki dışbükey kenarında, düz sinüs ise çadırın beyin orağıyla birleştiği orta hatta uzanır (Gray, 1918). Zar lenf damarları başlıca üst sagital ve enine sinüs boyunca, kafatasının yan ve taban bölgelerinde bulunur (Joost ve ark., 2026). Bakış düğmesiyle beyne arkadan ve alttan da bak.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'zar'],
        renk: 'lob',
        bakis: 'ust',
        etiketler: [
          { yapi: 'ust-frontal-girus-sol', metin: 'Orta hattın üstünde: üst sagital sinüs ve lenf damarları' },
          { yapi: 'oksipital-lob-sol', metin: 'Altında: beyincik çadırı ve enine sinüs' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'sayilar',
      baslik: 'Zar lenf damarlarının kısa tarihi',
      ogeler: [
        { deger: '1787', aciklama: 'Mascagni insan sert zarında lenf damarları bildirdi; bulgu sonra uzun süre kabul görmedi.' },
        { deger: '2015', aciklama: 'Farede iki bağımsız ekip zar lenf damarlarını yeniden gösterdi.' },
        { deger: '5/5', aciklama: 'MR’da sert zar lenf damarlarının görüldüğü sağlıklı gönüllü sayısı (2017).' },
        { deger: '~1', birim: 'mm', aciklama: 'MR’da görülen en büyük lenf damarı çapı.' },
      ],
      not: 'Kaynaklar: Ishikawa ve ark. (2026); Derk ve ark. (2021); Absinta ve ark. (2017).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Lenf damarları:** Sert zarda, toplardamar sinüslerinin yanında lenf damarları vardır. Farede 2015’te gösterildi, insanda 2017’de MR ile görüldü. Varlıkları kesin, insandaki işlevleri henüz az ölçüldü.
- **Glenfatik hipotez:** BOS’un damarların çevresinden beyin dokusuna girip çıktığını öne sürer. Tartışmalıdır; verilerin çoğu fareden gelir.
- **SLYM:** Önerilmiş bir “dördüncü zar”. Kanıtlanmış değildir.
- **Yeni geçitler:** Köprü toplardamarlarının çevresindeki ACE noktaları ve kafatası iliğinden zarlara uzanan kanallar.
- **Bağışıklık:** Zarlar bağışıklık hücreleriyle doludur. En çeşitli hücre topluluğu sert zardadır.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**2015: iki ekip, iki yol.** Louveau ve arkadaşları T hücrelerinin zarlara nereden girip çıktığını arıyordu. Bu sırada sert zar sinüslerini döşeyen, çalışan lenf damarları buldular (Louveau ve ark., 2015). Bu damarlar BOS’tan sıvı ve bağışıklık hücresi taşıyabilir ve derin boyun lenf düğümlerine bağlanır (Louveau ve ark., 2015). Yazarlara göre damarların alışılmadık yeri, uzun süre gözden kaçmalarına yol açmış olabilir (Louveau ve ark., 2015).

Aspelund ve arkadaşları da aynı yıl farenin sert zarında bir lenf damarı ağı bildirdi. Bu damarlar komşu subaraknoid boşluktaki BOS’u ve beyin dokusunun arasındaki sıvıyı emer. Sonra kafa tabanındaki deliklerden derin boyun lenf düğümlerine taşır (Aspelund ve ark., 2015). Ekip, zar lenf damarları hiç gelişmeyen fareler de inceledi. Bu farelerde büyük moleküllerin temizlenmesi azaldı. Ama beyin dokusundaki sıvı basıncı ve su miktarı değişmedi (Aspelund ve ark., 2015).

**Kimlik kartı.** Bu damarların iç yüzündeki hücreler, lenf damarlarına özgü işaret proteinlerini taşır. Bunlar arasında VEGFR3, Prox1, podoplanin ve Lyve1 vardır. Damarların temel zarı (bazal membran) kesintilidir (Joost ve ark., 2026). Zar lenf damarları insanda, öteki primatlarda, sıçanda, farede ve hatta balıkta tanımlanmıştır (Joost ve ark., 2026).

**BOS hangi yoldan çıkıyor? (fare)** Farede izleyici ölçümleri, BOS’un büyük ve küçük moleküller için en çok lenf damarlarıyla dışarı çıktığını gösterdi. Ama izleyiciler kafatası tabanındaki deliklerden, sinirlerin çevresinden geçti. Böylece kafatası dışındaki lenf damarlarına ulaştı. Aynı çalışmada sert zarın lenf damarlarına izleyici geçişi görülmedi. BOS’un bu lenf yoluyla çıkışı yaşlı farelerde azalıyordu (Ma ve ark., 2017).

**Gelişim ve esneklik (fare).** Zar lenf damarları doğumdan sonra gelişir. Önce kafa tabanındaki ve omurga kanalındaki deliklerin çevresinde belirir. Sonra kan damarları ve sinirler boyunca filizlenir (Antila ve ark., 2017). Sert zardaki lenf sistemi, vücudun öteki lenf damarlarından ve zarların kan damarlarından çok daha geç oluşur (Derk ve ark., 2021). Doğumdan sonraki yaklaşık 20. günde tam işler hâle gelir (Derk ve ark., 2021). Yetişkin farede de bu damarlar değişebilir. Lenf damarı büyüme sinyali VEGF-C ya da onun alıcısı VEGFR3 silinince damarlar geriler. Fazla VEGF-C ise yeni lenf damarı oluşturur (Antila ve ark., 2017).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sırttaki ve tabandaki zar lenf damarları',
      sutunlar: ['Özellik', 'Sırt (dorsal) lenf damarları', 'Taban (ventral, bazal) lenf damarları'],
      satirlar: [
        [
          'Yer',
          'Üst sagital ve enine sinüs boyunca. İnsanda düz sinüse paralel de uzanır',
          'Kafa tabanı; kafa tabanındaki deliklerin çevresi',
        ],
        ['Ağın yaygınlığı (fare)', 'Görece seyrek', 'Daha yaygın'],
        ['Kapakçık', 'Yok (fare). Daha az dallıdır', 'Var. Kılcalları subaraknoid boşluğa komşudur (fare)'],
        ['Kalınlık (insan, kontrastsız MR)', 'Ortanca 2,23 mm', 'Ortanca 1,95 mm'],
        [
          'İnsan kadavrasında (İstanbul)',
          'Sırt sinüslerine eşlik edenler daha büyük',
          'Kafa tabanı sinüslerine (kavernöz, sfenoparietal, üst ve alt petrozal) eşlik edenler daha çok sayıda',
        ],
        [
          'Öne sürülen görev',
          'Bağışıklık gözetimi',
          'BOS boşaltımı ve atık temizliği; farede BOS’taki büyük moleküllerin temizlendiği “sıcak noktalar”',
        ],
        ['Yaşla', 'İnsanda kalınlık yaşla artar (r = 0,69)', 'Farede yaşla bozulur'],
      ],
      not: 'Kaynaklar: Joost ve ark. (2026); Absinta ve ark. (2017); Albayram ve ark. (2025); Aspelund ve ark. (2015); Antila ve ark. (2017); Ahn ve ark. (2019); Albayram ve ark. (2022); Çavdar ve ark. (2023); Ying ve ark. (2026). Görev farkı, Ying ve arkadaşlarının literatür özetinden alındı; insanda doğrudan ölçülmüş değildir. İnsanda orta meningeal atardamarın dallarının yanında da lenf damarları ya da lenf benzeri yapılar görüldü (Absinta ve ark., 2017; Albayram ve ark., 2025).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İnsanda neler gösterildi?** Absinta ve arkadaşları beş sağlıklı gönüllüyü inceledi: üçü kadın, yaşları 28–53. MR cihazı 3 teslaydı (Absinta ve ark., 2017). Lenf damarları beş gönüllünün beşinde, marmosetlerin de üçte üçünde görüldü. Görünen en büyük çap yaklaşık 1 mm’ydi (Absinta ve ark., 2017). Damarlar özellikle üst sagital ve düz sinüse paralel uzanıyordu. Orta meningeal atardamarın dallarının yanında da vardı (Absinta ve ark., 2017). İnsan dokusunda doğrulama ise başka kişilerin otopsisinden yapıldı (Absinta ve ark., 2017).

Sonraki çalışmalar tabloyu genişletti:

- **Akış yönü.** Altı sağlıklı gönüllüde üst sagital sinüsün yanındaki lenf akımı arkadan öne doğruydu. Bu, sinüsteki kanın akış yönünün tersidir (Kuo ve ark., 2018).
- **Kontrastsız MR.** 15–80 yaş arası 81 kişide, kontrast madde vermeden zar lenf yapıları ve boyun lenf düğümlerine bağlantıları gösterildi (Albayram ve ark., 2022). Sagital sinüs boyunca uzanan ağın ön ve orta kısmı herkeste görüldü. Arka kısmı ise 81 kişinin 59’unda görüldü (Albayram ve ark., 2022).
- **Orta meningeal atardamar çevresi.** Beş sağlıklı kişide bu atardamarın çevresindeki taban sert zarı, kontrastlı MR’da gecikmeli parladı. Parlama 90. dakikada en yüksekti. Doku incelemesinde de bu atardamar boyunca lenf işaretleri taşıyan yapılar bulundu (Albayram ve ark., 2025).
- **Çocuklar.** 4 aylık ile 12 yaş arası 90 çocukta, lenf damarlarının kalınlığı ve sinyali yaşla anlamlı ilişki gösterdi (Ying ve ark., 2026).
- **Ölüm sonrası beyin.** Lenf işaretli hücreler zarlarda, damar duvarlarında, damar çevresi boşluklarda ve sinir lifleri arasında bulundu (Mezey ve ark., 2021).
- **Fare ile benzerlik.** Fare ve insanda lenf damarlarının üç boyutlu yerleşimi benzerdir. Damarlar sert zar sinüslerini izler; kavernöz sinüsün çevresinde öne doğru bir ağ da vardır (Jacob ve ark., 2022).
- **Türkiye’den.** İstanbul’dan (Koç Üniversitesi) bir çalışma 3 kadavra ve 3 otopside lenf damarlarını aradı. Damarlar yalnız sırttaki sinüslere değil, kafa tabanı sinüslerine de eşlik ediyordu (Çavdar ve ark., 2023). Aynı merkezin 6 kadavralık çalışmasında kafa tabanı deliklerinin üstündeki sert zarda lenf damarı bulundu. Yalnızca iç kulak yolunun üstünde bulunmadı. En büyükleri Meckel boşluğunun üstündeydi (Altınöz ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Zar lenf damarlarını MR’da görmek',
      md: `- **Neden görünür?** Sert zar damarlarında kan ile zar arasında bir engel yoktur. Bu yüzden kandaki küçük moleküller, gadolinyumlu kontrast maddeler de dahil, dokuya sızar (Absinta ve ark., 2017).
- **İki kontrast maddeyle sınama.** Lenf damarları, damardan dokuya kolay sızan gadobutrolle parladı. Kan damarının içinde kalan gadofosvesetle ise parlamadı. Bu, görülen yapının kan damarı değil lenf damarı olduğunu destekler (Absinta ve ark., 2017).
- **Diziler.** Kontrast sonrası yüksek çözünürlüklü T2-FLAIR ve kanı karanlık gösteren T1 dizileri kullanıldı. Düzlem içi çözünürlük 270 × 270 μm ya da daha iyiydi (Absinta ve ark., 2017).
- **Önerilen düzenek.** Sert zar damarlarından sızan küçük moleküller dokuda toplanır. Sonra basınç farkıyla, gevşek lenf endoteli üzerinden lenf kılcallarına geçer (Absinta ve ark., 2017).
- **Neden kontrastsız?** Gadolinyum vücutta birikebilir. Ayrıca yalnızca ulaşabildiği bölmeleri gösterir (Albayram ve ark., 2022).
- **Sınır.** 1 mm’lik vokselle çekilen görüntülerde, lenf damarına benzeyen boru biçimli yapılar ayırt edilemedi. Parasagital sert zarda bunlar öteki boyanan dokuyla karışıyordu (Ringstad ve Eide, 2020). Görüntülemenin ayrıntısı “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'BOS sert zardaki lenf damarlarına nasıl ulaşır?',
      md: `Burada bir bilmece var. Örümcek ağı zarın engel katmanı, BOS dolu subaraknoid boşluğu damarlı sert zardan ayırır (Joost ve ark., 2026). Kana verilen boyalar sert zarı boyar, örümcek ağı zarı boyamaz (Brøchner ve ark., 2015). Farede yapılan bir çalışmada da BOS’a verilen izleyici sert zarın lenf damarlarına geçmemişti (Ma ve ark., 2017). O hâlde BOS bu damarlara nereden ulaşır? Üç olası yol öne sürülür:

- **Kafa tabanından.** Farede tabandaki lenf damarlarının kılcalları subaraknoid boşluğa komşudur (Ahn ve ark., 2019).
- **Parasagital sert zardan.** Üst sagital sinüsün iki yanındaki sert zara parasagital sert zar denir. Oslo’da BOS hastalığı şüphesi olan 18 kişide BOS’a gadobutrol verildi. İzleyici, üst sagital sinüs boyunca parasagital sert zara geçti. Geçiş, kabuk toplardamarlarının sinüse girdiği yerlerin yakınındaydı (Ringstad ve Eide, 2020). Görüntüler 3, 6, 24 ve 48. saatlerde alındı. Kafatası boşluğunu burun boşluğundan delikli levha ayırır (Ma ve ark., 2017). Bu levhanın altında, yani burun tarafında, izleyici 18 hastanın yalnızca 2’sinde görüldü (Ringstad ve Eide, 2020). Yazarlara göre parasagital sert zar, beyin ile sert zar lenf damarları arasında bir köprü olabilir (Ringstad ve Eide, 2020).
- **Köprü toplardamarlarının kapılarından.** ACE noktaları da olası bir yoldur (aşağıda).

Parasagital sert zarın hacmi kişiden kişiye çok değişir. 76 hastada ortalama 4,188 ± 2,073 mL’ydi; en küçüğü 0,588, en büyüğü 9,654 mL (Melin ve ark., 2023). Melin ve arkadaşlarına göre bu yapı BOS temizliğinde büyük rol oynamayabilir. Daha çok bir sinir-bağışıklık arayüzü olabilir (Melin ve ark., 2023). Başka bir çalışmada kandaki iltihap göstergesi CRP yükseldikçe parasagital sert zarın hacmi küçüktü (Eide ve ark., 2025).

**İltihap ve lenf akışı.** Deneysel çalışmalarda sert zarda iltihap habercisi moleküllerin (sitokinlerin) artması, zar lenf akışını ve BOS çıkışını bozdu (Chirica ve ark., 2026).

**Tarihten bir not.** 1869’da Schwalbe köpekte BOS’a verdiği izleyicinin kafatası dışındaki lenf damarlarına ulaştığını gösterdi (Mezey ve ark., 2021).`,
    },

    // ——— Glenfatik hipotez ———
    {
      tur: 'metin',
      md: `**Glenfatik hipotez: ilk dersten bir adım ileri.** İlk derste bu hipotezi kısaca gördük; orada “glimfatik” diye yazdık. Adı 2012’de ortaya atıldı. Bu görüşe göre BOS, atardamarların çevresindeki ince boşluklardan beyin dokusuna girer. Dokudan geçer ve toplardamarların çevresinden çıkar (Hladky ve Barrand, 2022).

Bu fikir hâlâ tartışmalıdır ve verilerin çoğu fareden gelir. Burada iki yeni soruya bakıyoruz. Birincisi: Damarların çevresindeki sıvıyı ne iter? Farede yapılan bir deneye göre itici güç, kalp atımıyla oynayan atardamar duvarı olabilir (Mestre ve ark., 2018). Bu görüş de tartışmalıdır (Hladky ve Barrand, 2022). İkincisi: İnsanda bu işlev ölçülebilir mi? İnsanda kullanılan dolaylı bir MR göstergesi var, ama glenfatik işlevi yansıttığı henüz doğrulanmadı (Ermiş ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Akımı ne sürer?** 2018’de canlı farenin büyük sisternasına çok küçük boncuklar (mikroküre) verildi. Boncukların beyin yüzeyindeki damar çevresi boşluklarda hareketi izlendi. Akım nabız gibiydi: kalp atımıyla aynı sıklıkta ve kan akımıyla aynı yöndeydi (Mestre ve ark., 2018). Atardamar duvarının hareket hızı da BOS’un hızına uyuyordu. Yazarlar bu yüzden asıl itici gücün atardamar duvarının hareketi olduğunu öne sürdü. Buna **damar çevresi pompalama** dediler (Mestre ve ark., 2018). Aynı çalışmada ilaçla oluşturulan yüksek tansiyon ortalama akım hızını yaklaşık %40 azalttı (Mestre ve ark., 2018).

Ölçülen şey, akımın nabız gibi olmasıdır. Akımı atardamar duvarının ittiği ise bir çıkarımdır ve tartışmalıdır. Hladky ve Barrand bir modelleme çalışmasını aktarır. Buna göre atardamar çapındaki gerçekçi değişimler, gözlenebilir bir net akım yaratamayacak kadar küçüktür (Hladky ve Barrand, 2022).

Bu bulgular damar çevresi boşluktaki akımla ilgilidir. Asıl tartışma ise beyin dokusunun içindedir. İlk derste gördüğümüz eleştiri burada da geçerlidir: dokuda bir akım olsa bile hızı difüzyonun yanında çok küçük kalır (Hladky ve Barrand, 2022).

**Lenf damarlarıyla bağ.** BOS’un çevredeki lenf damarları ve lenf düğümleriyle temizlendiği iyi belgelenmiştir. Ama hangi yollardan ve ne hızla aktığı tartışmalıdır (Betsholtz ve ark., 2024). 2025 tarihli bir derlemeye göre beyin ile zarların sınırında özel yapılar vardır. Bu yapılar BOS’un bölmeler arasında sürekli alışverişine izin verir. Bu da beyinde madde taşınmasına dair alışılmış görüşleri zorlar (Pinho-Correia ve ark., 2025). Damar çevresi boşlukların subaraknoid boşlukla sürekli olup olmadığı da hâlâ açık bir sorudur (Joost ve ark., 2026). Bu boşlukların yapısı “Yumuşak zar ve damar çevresi boşluklar” bölümünde anlatıldı.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Zarlar neden bu kadar tartışmalı?',
      md: `Zar araştırmalarında aynı soru tekrar tekrar çıkar: Gördüğümüz şey canlıda da var mı? Çünkü doku hazırlığı ince zarları ve boşlukları bozabilir.

- **Ölüm sonrası ayrışma.** Ölümden sonra örümcek ağı zar sert zardan ayrılır. Eskiden “subdural boşluk” sanılan yarık budur (Joost ve ark., 2026).
- **Çöken boşluklar.** Canlı farede geniş olan damar çevresi boşluk, doku sabitlenince çöker ve çok daralır (Mestre ve ark., 2018).
- **Büzen sıvılar.** Suyu çeken (hiperozmotik) sabitleme sıvıları dokuyu büzer. Narin zarlar bu sırada yerinden kayabilir (Plá ve ark., 2023).
- **Eriyen perdeler.** Liliequist zarında birden çok yaprak bulan çalışmalar formalinle sabitlenmiş kafalarda yapıldı. Formalin örümcek ağı zarın perdelerini kısmen eritir. Volovici ve arkadaşlarına göre zardan çıkan bazı trabeküller de fazladan yaprak sanılmış olabilir (Volovici ve ark., 2020).

Bu yüzden her bulguda dokunun nasıl hazırlandığına ve canlıda görülüp görülmediğine bak.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'İnsanda glenfatik işlev ölçülebilir mi?',
      md: `- **Dolaylı bir MR göstergesi.** Sağlıklı genç erişkinlerde damar çevresi boşluk yükü fazla olanlarda DTI-ALPS adlı MR göstergesi daha düşüktü (Ermiş ve ark., 2026). Çalışmanın sayıları ve sınırları “Yumuşak zar ve damar çevresi boşluklar” bölümünde.
- **Örümcek ağı zarı geçen moleküller.** İnsanda BOS’a verilen izleyici parasagital sert zara geçti. Bu, örümcek ağı zar boyunca molekül geçişinin insanda da olduğunu gösterir (Ringstad ve Eide, 2020).
- **Yöntemin tuzağı.** Damar çevresi boşlukların ve zarlar arası bölmelerin birbirine açılıp açılmadığı sorusu önemlidir. Bağışıklık hücrelerinin girişini, madde alışverişini ve mikropların yayılmasını anlamak buna bağlıdır. Ama elektron mikroskobu ve izleyici çalışmaları yapay bulgulara açıktır (Joost ve ark., 2026).
- **Türden türe.** Zar lenf damarları insanda ve öteki primatlarda da görüldü. Ama yapıları ve görüntülenebilmeleri türlere göre farklıdır. Kemirgen bulguları primatlara doğrudan aktarılamaz (Joost ve ark., 2026).`,
    },

    // ——— SLYM ———
    {
      tur: 'metin',
      md: `**Dördüncü bir zar mı?** 2023’te bir ekip, subaraknoid boşluğu ikiye bölen dördüncü bir zar bildirdi. Ona **SLYM** adını verdiler: subaraknoid lenf benzeri zar (Møllgård ve ark., 2023). İlk derste bu tartışmayı kısaca gördük.

Birçok araştırmacı bu yoruma itiraz etti. Onlara göre bu yapı ayrı bir zar değil, örümcek ağı zarın bir parçasıdır (Siegenthaler ve Betsholtz, 2024). 2026 tarihli bir derlemeye göre bu dördüncü katmanın varlığı ve görevi hâlâ yoğun biçimde tartışılıyor (Joost ve ark., 2026). Yani bugün “beynin dört zarı var” demek doğru olmaz. Doğrusu şudur: üç zar kesin, dördüncüsü bir öneri.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Ne iddia edildi?** Møllgård ve arkadaşları SLYM’in fare ve insan beyninde subaraknoid boşluğu bölmelere ayırdığını yazdı (Møllgård ve ark., 2023). Onlara göre SLYM, vücut boşluklarını döşeyen ince örtüye, yani mezotele benzer. Damarları sarar ve bağışıklık hücreleri taşır. Sinüs endoteline yakın durduğu için farede araknoid granülasyonların karşılığıdır (Møllgård ve ark., 2023).

**Ölçüler ve işaretler.** Bir derlemeye göre canlı farede iki foton mikroskobuyla ölçülen SLYM kalınlığı 14,2 ± 0,5 μm’dir. Aynı ölçümde sert zar 21,8 ± 1,3 μm’dir (6 fare) (Zedde ve Pascarella, 2025a). SLYM bazı lenf işaretlerini taşır: Prox1 ve podoplanin. Bazılarını taşımaz: LYVE1 ve VEGFR3 (Zedde ve Pascarella, 2025a). Örümcek ağı zarın engel katmanının iki işareti, Claudin-11 ve E-kaderin de SLYM’de yoktur (Zedde ve Pascarella, 2025a). SLYM’in 3 kilodaltondan büyük moleküllerin geçişini kısıtlayan yarı geçirgen bir engel olduğu öne sürüldü (Almohaimede ve ark., 2025). Kilodalton, molekül kütlesinin birimidir.

**Savunanların da kabul ettikleri.** Plá ve arkadaşları iki şeyi kabul eder. Birincisi, suyu çeken sabitleme sıvıları dokuyu büzer ve narin zarları yerinden oynatabilir (Plá ve ark., 2023). İkincisi, eski elektron mikroskobu kitaplarındaki “iç” ya da “retiküler” araknoid büyük olasılıkla SLYM ile aynı yapıdır (Plá ve ark., 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'SLYM: itirazlar ve yanıtlar',
      md: `- **Üç itiraz.** Siegenthaler ve Betsholtz eleştirileri üç noktada toplar. Birincisi, öne sürülen zar ayrı bir yapı değil, örümcek ağı zarın bir parçasıdır. İkincisi, “dış subaraknoid boşluk” yapay bir subdural boşluktur. Üçüncüsü, engel özelliği örümcek ağı zarın engel katmanına aittir (Siegenthaler ve Betsholtz, 2024).
- **Hücreler birbirine değiyor.** Eleştirmenlere göre engel hücreleri ile iç araknoid hücreleri arasında yapışma ve oluklu bağlantılar vardır. Bu bağlantılar yalnızca birbirine değen hücreler arasında oluşur. Yani canlıda aralarında boşluk yoktur (Siegenthaler ve Betsholtz, 2024).
- **İşaretin sınırı.** SLYM’i engel katmanından ayırmak için Claudin-11 kullanıldı. Ama bu proteinin geni sert zar fibroblastlarında da çalışır (Siegenthaler ve Betsholtz, 2024).
- **Sıvının derişimi.** Neuhuber’e göre SLYM, engel katmanı ile yumuşak zar arasında “yüzüyor” gibi görünür. Kemikteki kireci çözmek için %10 EDTA çözeltisi kullanıldı. Bu çözeltinin ozmolaritesi, yani içinde çözünmüş tanecik derişimi, 806 mOsm’dir. Bu, vücut sıvısının olağan değerinin (yaklaşık 300 mOsm) neredeyse üç katıdır. Neuhuber’e göre bu sıvı, özellikle üç hafta boyunca uygulanınca zarları yerinden oynatabilir (Neuhuber, 2024).
- **Eski kitaplarda.** Sistematik bir derleme, beyinde ya da omurilikte bir ara leptomeningeal katman gösteren en az sekiz çalışma buldu. Bu katmana “epipial”, “ara meningeal”, “dış pia katı” ya da “ara lamel” gibi adlar verilmişti (Kumar ve ark., 2025). Örneğin insan omurilik zarlarında örümcek ağı zarın iç yüzüne tutunan, delikli bir ara katman tanımlanmıştı (Nicholas ve Weller, 1988).
- **Savunanların yanıtı.** Plá ve arkadaşlarına göre Krisch 1983’te yeni terimler önermişti: “pia” ve “araknoid” yerine iç, ara ve dış leptomeninks. Yani subaraknoid boşluğun iki bölmeli olduğu 40 yılı aşkın süre önce kabul edilmişti (Plá ve ark., 2024).
- **Yeni bir işaret.** Farede VE-kaderin adlı bağlantı proteini, örümcek ağı zarın içinde ayrı bir hücre katmanını gösterdi. Bu katman Prox1 taşıyordu ve E-kaderin taşıyan engel hücrelerinin altında, onlardan ayrı duruyordu (Mapunda ve ark., 2023).
- **Bir varsayım.** Mezotelin, dokuların birbiri üzerinde kaydığı yerlerde sürtünmeyi azalttığı düşünülür. Bu yüzden SLYM’in de beyin ile kafatası arasındaki sürtünmeyi azaltabileceği öne sürülür. Bu bir varsayımdır (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Kan nerede durdu?',
      oyku: '54 yaşında bir kadın ani ve çok şiddetli bir baş ağrısıyla getiriliyor. BT’de beyin sapının çevresindeki sisternalarda kan var. Anjiyografide bir anevrizma bulunuyor. Radyolog, kanın beyin sapı boyunca yumuşak zara bitişik kısımda toplandığını not ediyor. Sert zara bitişik dış kısımda ise neredeyse hiç kan yok. Bir asistan “Bu SLYM’in kanıtı mı?” diye soruyor.',
      soru: 'Bu dağılım, subaraknoid boşluğu ikiye ayıran ayrı bir zarın varlığını kanıtlar mı?',
      cozum: `**Bulgu ne diyor?** 97 anevrizmal subaraknoid kanama hastasının BT’si incelendi. Kan hastaların %64,9’unda yalnızca beyin sapı boyunca, yumuşak zara bitişik “derin” bölmedeydi. Yalnızca sert zara bitişik “yüzeyel” bölmede kanama hiç görülmedi (Almohaimede ve ark., 2025). Ağır kanamalarda kanın yüzeyel bölmede bulunma olasılığı yaklaşık 7,6 kat yüksekti (Almohaimede ve ark., 2025). Yazarlar bu dağılımı SLYM’in olası bir görüntüleme karşılığı olarak yorumladı (Almohaimede ve ark., 2025).

**Neden kanıt değil?** Gadolinyumlu ya da iyotlu kontrast maddeler küçük moleküllüdür. Bu yüzden SLYM’i canlıda göstermek için kullanılamaz; bu çalışmada kan doğal bir kontrast gibi davrandı (Almohaimede ve ark., 2025). Yani bulgu dolaylıdır. Subaraknoid boşluğu bölen başka perdeler de vardır: örümcek ağı zarın iç zarları boşluğu bölmelere ayırır ve BOS akımını yönlendirir (Zedde ve Pascarella, 2025a). Eleştirmenlere göre ise “dış subaraknoid boşluk” yapay bir yarıktır ve SLYM örümcek ağı zarın bir parçasıdır (Siegenthaler ve Betsholtz, 2024).

**Sonuç:** Bu dağılım ilginçtir, ama ayrı bir dördüncü zarı kanıtlamaz. Kanamanın kendisi “Kanamalar ve fıtıklaşmalar” bölümünde anlatılır. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Yeni geçitler: ACE noktaları ve kafatası kanalları ———
    {
      tur: 'metin',
      md: `**Zarlar arasında geçitler.** Örümcek ağı zarın dış katı sıkı bir engeldir. Ama beyin yüzeyinden sert zar sinüslerine uzanan köprü toplardamarları bu engeli geçmek zorundadır. 2024’te bir ekip, toplardamarların engeli geçtiği yerlerde süreksizlikler buldu. Bunlara **araknoid manşet çıkış noktaları** (ACE noktaları) dendi. Bu açıklıklardan sıvı ve molekül geçebilir. Farede, iltihap sırasında bağışıklık hücreleri de bu yolu kullandı (Smyth ve ark., 2024). Bulgu yenidir ve doğrulanması gerekir (Joost ve ark., 2026).

**Kafatasının iliğinden zarlara kanallar.** Kafatası kemiğinin içinde de kan hücresi yapan bir ilik vardır (Liu ve ark., 2025). Farede bu ilik ile sert zar arasında, kemiğin iç yüzünü geçen çok küçük damar kanalları bulundu. İlikte yapılan bağışıklık hücreleri bu kanallardan geçerek zarlara, oradan da komşu beyin dokusuna ulaşabilir (Herisson ve ark., 2018). İnsanda da kafatası ile zarlar arasındaki bağlantılar ölüm sonrası dokuda üç boyutlu görüntülendi (Kolabas ve ark., 2023). Bu alan yaklaşık altı yıllık, çok yeni bir alandır (Liu ve ark., 2025).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**ACE noktaları yakından.** Örümcek ağı zarın engel katmanı, kanla gelen maddelerin subaraknoid boşluğa girmesini önler (Brøchner ve ark., 2015). Smyth ve arkadaşları köprü toplardamarlarının bu engeli geçtiği yerlerde süreksizlikler buldu (Smyth ve ark., 2024). Bu açıklıklar subaraknoid boşluk ile sert zar arasında sıvı ve molekül alışverişine izin verir. BOS buradan dışarı süzülebilir. Sert zardan subaraknoid boşluğa da sınırlı bir molekül girişi olur (Smyth ve ark., 2024).

Farede deneysel bir beyin ve omurilik iltihabı modelinde bağışıklık hücreleri bu noktalardan subaraknoid boşluğa doğrudan girdi (Smyth ve ark., 2024). Sağlıklı gönüllülerde de MR izleyicileri köprü toplardamarları boyunca benzer biçimde ilerleyip subaraknoid boşluğa ulaştı (Smyth ve ark., 2024). Joost ve arkadaşlarına göre bu noktalarda örümcek ağı zar, toplardamarın çevresinde bir manşet gibi uzanır. Engel burada incelir ya da kesilir. Bulgu doğrulanırsa, engel boyunca iletişimin sanılandan daha düzenli olduğunu gösterecektir (Joost ve ark., 2026).

**Kafatası kanalları yakından (fare).** Herisson ve arkadaşları inme ve mikropsuz menenjit modellerinde çalıştı. Kafatası iliğinden gelen nötrofiller, kaval kemiğinin iliğinden gelenlere göre komşu beyin dokusuna daha çok göç etti (Herisson ve ark., 2018). Kafatası ile sert zarın sınırında, kemiğin iç yüzünü geçen mikroskobik damar kanalları görüldü (Herisson ve ark., 2018).

Kanallar iki yönlü çalışıyor gibi görünür. Farede BOS bu kanallardan kafatası iliğine ulaşır. BOS’taki proteinler de ilikteki hücrelere sinyal verir (Mazzitelli ve ark., 2022). Büyük sisternaya verilen izleyiciler önce sert zar damarlarının çevresinden ilerler. Sonra milimetreden küçük yüzlerce kanaldan kafatası iliğine geçer. Bakteriyel menenjitte bakteriler de bu yolu kullandı (Pulous ve ark., 2022). Omurilik yaralanmasından sonra BOS’tan gelen sinyaller ilikte bağışıklık hücresi yapımını artırdı. Bu hücrelerin zarlara göçü de arttı (Mazzitelli ve ark., 2022).

Zarlardaki B hücreleri, yani antikor yapan hücrelerin öncülleri, farede kafatası iliğinden gelir. Özel damar bağlantılarıyla zarlara ulaşırlar. Yaşlı farelerde bunların bir kısmı kandan gelir (Brioschi ve ark., 2021). Joost ve arkadaşlarına göre ilikten çıkan hücreler, emisser ve köprü toplardamarlarının çevresindeki hücre dışı madde boyunca ilerliyor olabilir. Bu henüz bir öneridir (Joost ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Engelden geçişi canlı insanda zamanlamak',
      md: `Canlı insanda, damara verilen kontrast maddenin örümcek ağı zarın engelinden geçişi saniyelerle zamanlanabildi. Geçiş bölgeye göre farklı hızda başladı: köprü toplardamarlarının çevresinde, üst sagital sinüsün çevresinden daha geç (Li ve ark., 2026). Bu çalışmanın sayıları “Örümcek ağı zar” bölümünde verildi. Çalışmanın yalnızca özeti okundu.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kafatası ile zarlar arasındaki kanallar: fare ve insan',
      sutunlar: ['Özellik', 'Fare', 'İnsan'],
      satirlar: [
        ['Genişlik', 'Yaklaşık 18–25 μm', '40–90 μm; bazıları 150 μm’yi aşar'],
        [
          'Yapı',
          '—',
          'Fareden daha karmaşık. Sert zarı delip araknoid granülasyonlara bağlanabilir. Ölüm sonrası dokuda üç boyutlu görüntülendi',
        ],
        [
          'BOS ile bağı',
          'BOS kanallardan iliğe ulaşır; büyük sisternaya verilen izleyiciler yüzlerce kanaldan geçer',
          'BOS’a verilen gadobutrol, parasagital sert zarın yakınında kafatası iliğinde birikti (53 hasta)',
        ],
        ['Bağışıklıkla bağı', 'İlik kökenli nötrofiller ve B hücreleri zarlara bu yollarla ulaşır', '—'],
      ],
      not: 'Kaynaklar: Liu ve ark. (2025); Kolabas ve ark. (2023); Mazzitelli ve ark. (2022); Pulous ve ark. (2022); Ringstad ve Eide (2022); Herisson ve ark. (2018); Brioschi ve ark. (2021). Fare genişlik değerleri Liu ve arkadaşlarının tablosundandır. “—”: açtığımız kaynaklarda bu bilgi yok. Kafatası ve omurga kemik iliğini zarlara bağlayan kemik kanalların keşfi, sinir-bağışıklık ilişkisine yeni bir katman ekledi (Mazzitelli ve ark., 2023).',
    },

    // ——— Bağışıklık hücreleri ———
    {
      tur: 'metin',
      md: `**Zarlar bir bağışıklık organı mı?** Zarlarda birçok bağışıklık hücresi yaşar. En çeşitli topluluk sert zardadır. Burada makrofajlar, B ve T lenfositleri, dendritik hücreler, mast hücreleri, doğal öldürücü hücreler ve plazma hücreleri bulunur (Chirica ve ark., 2026). Bu hücreler sert zarda eşit dağılmaz; toplardamar sinüslerinin çevresinde toplanır (Derk ve ark., 2021). Damarların, sinüslerin ve lenf kanallarının yakınında dururlar. Böylece kandan ve BOS’tan gelen yabancı parçaları (antijenleri) yakalayabilirler (Chirica ve ark., 2026).

Sert zarın kan damarları da buna uygundur. Bu damarlar pencerelidir ve hücreleri arasında sıkı bağlantı yoktur. Bu özellik bağışıklık gözetimi ve BOS boşaltımı görevleriyle uyumludur (Joost ve ark., 2026). Yani sert zar, beynin hemen dışında duran bir gözetleme kulesi gibidir.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zar bölmelerinde bağışıklık hücreleri',
      sutunlar: ['Bölme', 'Başlıca hücreler', 'Yenilenme', 'Not'],
      satirlar: [
        [
          'Sert zar',
          'Makrofaj, mast hücresi, B ve T hücreleri, nötrofil, doğal lenfoid hücreler; merkezî sinir sisteminin en büyük dendritik hücre topluluğu',
          'Sınır makrofajları kandaki monositlerle sürekli yenilenir',
          'Hücreler sinüslerin çevresinde toplanır. Canlı farede makrofaj yoğunluğu ~400 hücre/mm²',
        ],
        [
          'İnce zarlar (leptomeninks)',
          'Başlıca makrofaj ve göç etmeyen dendritik hücre. İnsanda üç tür sınır makrofajı, dokuya yerleşik CD4 ve CD8 T hücreleri, monosit ve B hücreleri',
          'Sınır makrofajları uzun ömürlüdür',
          'Canlı farede yumuşak zarda makrofaj yoğunluğu ~300 hücre/mm²',
        ],
        ['Subaraknoid boşluk', '—', '—', 'Canlı farede makrofajlar bu boşlukta yoğun değildir'],
      ],
      not: 'Kaynaklar: Derk ve ark. (2021); Joost ve ark. (2026); Rua ve McGavern (2018). Kaynaklar yenilenmeyi farklı vurgular: Joost ve arkadaşları iki bölmedeki bağışıklık hücrelerinin de kemik iliği kökenli öncüllerle sürekli yenilendiğini yazar. Derk ve arkadaşları ise leptomeninksteki sınır makrofajlarının uzun ömürlü olduğunu vurgular. “—”: açtığımız kaynaklarda bu bilgi yok.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Yeni keşifler klinikte neyi düşündürüyor?',
      md: `- **Menenjit.** Bakteriler subaraknoid boşluğa ulaşınca ince zarların yüzeyinde hızla çoğalır ve yayılır. BOS akımı bu yayılmayı kolaylaştırır (Joost ve ark., 2026). Farede bakteriyel menenjitte bakteriler, BOS’tan kafatası iliğine uzanan kanalları da kullandı (Pulous ve ark., 2022). Sıçanda deneysel menenjit önce kan-beyin engelini ya da koroid pleksusu değil, örümcek ağı zarın kan-BOS engelini daha geçirgen yaptı (Brøchner ve ark., 2015). Ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.
- **Multipl skleroz.** İkincil ilerleyici multipl sklerozlu hastaların ölüm sonrası beyinleri incelendi. Bunların yaklaşık %40’ında ince zarlarda lenf düğümcüğüne benzer bağışıklık hücresi kümeleri bulunur (Joost ve ark., 2026). Kollajenden zengin trabekül ağının bu hücreleri tutan bir iskele olabileceği öne sürülür. Bu bir varsayımdır (Joost ve ark., 2026).
- **Yaşlanma.** Farede lenf yoluyla BOS çıkışı yaşla azalır (Ma ve ark., 2017). Yaşlanan sert zarda lenf damarlarının çevresinde kollajen birikir ve lenf akışı bozulur. TGFβ1 adlı sinyal molekülü bu değişimin önemli bir düzenleyicisidir. Bu bulgu insan sert zar hücrelerinden ve fare modelinden gelir (Hitpass Romero ve ark., 2025).
- **Ölçülü ol.** İnsanda bu yapıların var olduğunu göstermek ile işlevlerini ölçmek ayrı şeylerdir (Ishikawa ve ark., 2026). Bulguların çoğu fareden ya da ölüm sonrası dokudan gelir.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Zar bağışıklığı: antijenler, sinirler, davranış',
      md: `- **Antijen örnekleme (fare).** BOS’taki beyin kaynaklı antijenler sert zar sinüslerinin çevresinde birikir. Oradaki antijen sunan hücreler onları yakalar ve devriye gezen T hücrelerine sunar (Rustenhoven ve ark., 2021).
- **Sinirlerle komşuluk.** Sert zardaki makrofaj ve dendritik hücrelerin yaklaşık %30–40’ı, TRPV1 adlı algılayıcıyı taşıyan sinir liflerinin hemen yanındadır (Rua ve McGavern, 2018).
- **Davranış.** Farede ince zarlardaki bağışıklık hücreleri azaltılınca öğrenme, sosyal davranış ve strese yanıt değişti (Joost ve ark., 2026).`,
    },

    // ——— Özet tablo ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Keşifler: hangi canlıda, hangi yöntemle, ne kadar kesin?',
      sutunlar: ['Keşif ya da görüş', 'Yıl ve ekip', 'Canlı', 'Yöntem', 'Ne kadar kesin?', 'İtiraz ya da sınır'],
      satirlar: [
        [
          'İnsan sert zarında lenf damarları',
          '1787; Mascagni',
          'İnsan',
          'Anatomik tanım',
          'Uzun süre kabul görmedi',
          'Bilim dünyası 2015’e kadar beyinde lenf damarı olmadığını yazdı',
        ],
        [
          'Sert zar lenf damarları',
          '2015; Louveau ve ark.; Aspelund ve ark.',
          'Fare',
          'Lenf işaret proteinleri, mikroskopi, izleyici madde, lenf damarı gelişmeyen fare',
          'Yapı sağlam biçimde gösterildi',
          'Farede bir çalışma (Ma ve ark., 2017) BOS izleyicisinin bu damarlara geçişini göremedi',
        ],
        [
          'İnsanda zar lenf damarları',
          '2017; Absinta ve ark.',
          'İnsan (5 gönüllü) ve marmoset',
          '3 tesla MR, iki kontrast madde; otopside doku boyaması',
          'Var olduğu gösterildi; kontrastsız MR ve çocuklarda da görüldü',
          'İşlev ölçümü sınırlı. 1 mm’lik vokselde boru biçimli yapılar ayırt edilemedi',
        ],
        [
          'Glenfatik yol',
          '2012; Iliff ve ark.',
          'Fare',
          'İki foton mikroskobu, izleyici madde, AQP4 su kanalı olmayan fare',
          'Tartışmalı bir hipotez',
          'Taşınma difüzyonla uyumlu, AQP4’e bağlı değil (fare ve sıçan). Ana çıkışın toplardamar çevresinden olduğuna kanıt yok',
        ],
        [
          'Damar çevresi pompalama',
          '2018; Mestre ve ark.',
          'Fare',
          'Canlıda mikroküre izleme',
          'Nabız gibi akım farede ölçüldü; pompalama düzeneği tartışmalı',
          'Modellemeye göre atardamar çapındaki değişim net akım için yetersiz. Bulgu damar çevresi boşluğa aittir; beyin dokusunun içindeki akım tartışmalı kalır',
        ],
        [
          'BOS’tan parasagital sert zara geçiş',
          '2020; Ringstad ve Eide',
          'İnsan (18 hasta)',
          'BOS’a gadobutrol, 48 saate kadar MR',
          'Örümcek ağı zar boyunca geçişi insanda gösterdi',
          'Hastalarda yapıldı; lenf damarları boru biçiminde seçilemedi',
        ],
        [
          'Kafatası iliği ile zarlar arasında kanallar',
          '2018; Herisson ve ark.',
          'Fare; insanda ölüm sonrası doku',
          'Konfokal mikroskopi; insanda doku saydamlaştırma ve 3B görüntüleme',
          'Farede güçlü; insanda yapı gösterildi',
          'Alan yaklaşık altı yıllık',
        ],
        [
          'Zar B hücrelerinin kafatası iliğinden gelmesi',
          '2021; Brioschi ve ark.',
          'Fare',
          'Tek hücre analizi, konfokal görüntüleme, kemik iliği nakli, iki farenin kan dolaşımını birleştirme (parabiyoz)',
          'Farede gösterildi',
          'Yaşlı farede bir kısmı kandan gelir',
        ],
        [
          'SLYM (“dördüncü zar”)',
          '2023; Møllgård ve ark.',
          'Fare ve insan',
          'Prox1 işaretli fare, iki foton mikroskobu, doku kesitleri',
          'Tartışmalı; kanıtlanmış bir zar değil',
          'İç araknoidin parçası; “dış boşluk” yapay; işaret ve sabitleme sorunları',
        ],
        [
          'ACE noktaları',
          '2024; Smyth ve ark.',
          'Fare; sağlıklı insanda MR',
          'Gen etkinliği verisine (transkriptom) dayanan, genleri değiştirilmiş (transgenik) fare; insanda MR izleyicisi',
          'Yeni bir bulgu',
          'Doğrulanması gerekiyor',
        ],
      ],
      not: 'Kaynaklar: Ishikawa ve ark. (2026); Derk ve ark. (2021); Louveau ve ark. (2015); Aspelund ve ark. (2015); Joost ve ark. (2026); Ringstad ve Eide (2020); Absinta ve ark. (2017); Albayram ve ark. (2022); Ying ve ark. (2026); Iliff ve ark. (2012); Smith ve ark. (2017); Hladky ve Barrand (2022); Mestre ve ark. (2018); Herisson ve ark. (2018); Kolabas ve ark. (2023); Liu ve ark. (2025); Brioschi ve ark. (2021); Møllgård ve ark. (2023); Siegenthaler ve Betsholtz (2024); Neuhuber (2024); Smyth ve ark. (2024); Ma ve ark. (2017). SLYM satırındaki yöntem bilgisi Zedde ve Pascarella’nın (2025a) aktarımındandır; Møllgård ve arkadaşlarının çalışmasının yalnızca özeti okundu.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Zar lenf damarları:** sert zarda, sinüslerin yanında; farede derin boyun lenf düğümlerine boşalır. İşaret proteinleri: VEGFR3, Prox1, podoplanin, Lyve1. Beyin dokusunda ve yumuşak zarda yoktur (fare).
- **Sırt ve taban:** sırttakiler kapakçıksız; tabandakiler kapakçıklı ve subaraknoid boşluğa komşu (fare).
- **İnsanda ilk MR gösterimi:** Absinta 2017. Gadobutrolle parlar, gadofosvesetle parlamaz.
- **Glenfatik hipotez (2012):** tartışmalı. Farede damar çevresi akımın kalp atımıyla eş zamanlı olduğu ölçüldü. Akımı atardamar duvarının ittiği görüşü (damar çevresi pompalama) tartışmalıdır.
- **SLYM (2023):** kanıtlanmış dördüncü zar değil.
- **ACE noktaları (2024):** köprü toplardamarlarının araknoid engeli geçtiği yerlerdeki açıklıklar.
- **Bağışıklık:** en çeşitli hücre topluluğu sert zarda; hücreler sinüslerin çevresinde toplanır.`,
    },
  ],
};
