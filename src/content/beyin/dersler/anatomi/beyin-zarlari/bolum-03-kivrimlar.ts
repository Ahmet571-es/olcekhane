import type { DersBolumu } from '../../../types';

/** Beyincik çadırının sahnelerdeki rengi (açık krem): sert zarın tek modellenmiş parçası öteki yapılardan ayrılsın. */
const CADIR_RENGI = '#e9e4d6';

/** Çadır çentiği sahnelerinde yalnızca arka beyin ve üst beyincik atardamarları kalır; öteki atardamarlar gizlenir. */
const OTEKI_ATARDAMARLAR = [
  'ic-karotis-arter',
  'vertebral-arter',
  'baziler-arter',
  'on-beyin-arteri',
  'on-baglanti-arteri',
  'orta-beyin-arteri',
  'arka-baglanti-arteri',
];

/**
 * 03. bölüm: sert zarın kıvrımları ve bölmeleri. Beyin orağı, beyincik çadırı ve çadır çentiği (ölçüler, tipler,
 * beyin sapının çentikteki yeri, Türkiye'den ölçümler), beyincik orağı, hipofiz çadırı, Meckel boşluğu ve sert zarın
 * sinirlere kılıf oluşu; kıvrımların ayırdığı bölmeler. Fıtıklaşmanın kliniği 11. bölümde, sinüsler 4. bölümde,
 * sinirler ve atardamarlar 5. bölümde, kıvrımların gelişimi 10. bölümde işlenir. Modelde sert zardan yalnızca beyincik
 * çadırı vardır; beyin orağı ve öteki kıvrımlar etiket, metin ve tabloyla anlatılır. Bilgiler S2/A notlarından
 * (ayrıca S2/C ve S2/D'deki ilgili satırlar).
 */
export const sertZarinKivrimlari: DersBolumu = {
  id: 'sert-zarin-kivrimlari',
  baslik: 'Sert zarın kıvrımları ve bölmeleri',
  bloklar: [
    // ——— Dört kıvrım (temel) ———
    {
      tur: 'metin',
      md: `Sert zar beynin çevresinde düz bir torba gibi durmaz. İç katı, yani meningeal katı, yer yer içeri doğru katlanır. Bu katlar beynin bölümleri arasına girer. Böylece dört kıvrım oluşur (Gray, 1918):

- **beyin orağı** (*falx cerebri*): iki beyin yarımküresinin arasında,
- **beyincik çadırı** (*tentorium cerebelli*): büyük beyin ile beyinciğin arasında,
- **beyincik orağı** (*falx cerebelli*): beyinciğin iki yarısının arasında,
- **hipofiz çadırı** (*diaphragma sellae*): hipofiz bezinin üstünde.

İlk derste bu kıvrımları adlarıyla tanıdık. Şimdi her birine yakından bakacağız.

Kıvrımlar kafatasının içini bölmelere ayırır. Bu bölmeler birbirine kapalı değildir, birbirine açılır. Her birinde beynin bir bölümü korunarak yerleşir (Gray, 1918). Kıvrımların bir işi daha vardır. Baş birden hızlanınca ya da durunca beynin aşırı sallanmasını azaltır ve onu yerinde tutar (Ishikawa ve ark., 2026). Beyin orağı ve beyincik çadırı gergin yapılardır. Beynin hareketini sınırlar ve orta hat boyunca biçiminin bozulmasını azaltır (Rai ve ark., 2018).`,
    },

    // ——— Beyin orağı (temel) ———
    {
      tur: 'metin',
      md: `**Beyin orağı** adını biçiminden alır: bir orak gibi kavislidir. İki beyin yarımküresini ayıran derin, boylamasına yarığa dikey olarak iner. Güçlü ve kemerli bir yapraktır (Gray, 1918).

Önde dardır. Kafatası tabanındaki küçük bir kemik çıkıntısına, **horoz ibiğine** (*crista galli*) tutunur. Arkada genişler ve beyincik çadırının üst yüzüne bağlanır (Gray, 1918). Üst kenarı dışa doğru kavislidir ve kafatasının iç yüzüne orta hat boyunca tutunur. Alt kenarı serbesttir ve içe doğru kavislidir (Gray, 1918). Bu serbest kenar, iki yarımküreyi birbirine bağlayan **nasırlı cismin** (*corpus callosum*) hemen üstünde durur (Munakomi ve Jozsa, 2026).

Orağın iki kenarı boyunca toplardamar sinüsleri uzanır. Üst kenarda üst sagital sinüs, alt kenarda alt sagital sinüs vardır (Gray, 1918). Sinüsleri “Sert zarın toplardamar sinüsleri” bölümünde göreceğiz.`,
    },

    // ——— Beyincik çadırı ve çentiği (temel) ———
    {
      tur: 'metin',
      md: `**Beyincik çadırı** sert zarın en büyük ikinci kıvrımıdır. Büyük beyni beyincikten ayırır (Ishikawa ve ark., 2026). Ortası yüksek, kenarlarına doğru aşağı eğilen kemerli bir yapraktır. Beyinciğin üst yüzünü örter. Büyük beynin arkadaki art kafa loblarını üstünde taşır (Gray, 1918). Biçimi beyinciğin üstüne kurulmuş bir çadırı andırır. “Çadır” adını ilk kez 1732’de Fransız anatomist Winslow kullandı (Ita ve Bordoni, 2023).

Çadır kafatasının içini iki kata ayırır. Üstteki kata **çadır üstü** (*supratentoryal*) bölme, alttaki kata **çadır altı** (*infratentoryal*) bölme denir (Ishikawa ve ark., 2026). Çadırın üstünde büyük beynin art kafa ve şakak lobları, altında beyincik ve beyin sapının alt bölümü bulunur (Rai ve ark., 2018).

Çadırın ön kenarı serbesttir ve içe doğru kavislidir. Bu kenar büyük, oval bir açıklığı çevreler. Bu açıklığa **çadır çentiği** (*incisura tentorii*) denir (Gray, 1918). Beyin sapının üst bölümü, yani **orta beyin**, bu çentikten geçer (Ishikawa ve ark., 2026). Çentik, çadırın üstündeki ve altındaki bölmeler arasındaki dar geçittir. Orta beyinle birlikte bazı sinirler ve atardamarlar da buradan geçer (Hall ve Munakomi, 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Arkadan: çadır, büyük beyin ile beyinciğin arasında',
      aciklama:
        'Beyne arkadan bakıyoruz: hastanın solu ekranın solunda. Renkler lobları tanıtır: pembe art kafa lobu, sarı yan kafa lobu, yeşil şakak lobu. Turuncu beyincik, mor beyin sapıdır. Açık krem renkli yaprak beyincik çadırıdır: art kafa lobları onun üstünde durur, beyincik altında kalır. Modelde sert zardan yalnızca çadır vardır. İki art kafa lobunun arasındaki dikey yarığa beyin orağı iner; orak modelde yoktur. Gerçekte orak, çadırın üst yüzüne tam orta hatta bağlanır (Gray, 1918).',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'zar'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        bakis: 'arka',
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR_RENGI }],
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'oksipital-lob-sol', metin: 'Art kafa lobu (çadır üstü)' },
          { yapi: 'beyincik', metin: 'Beyincik (çadır altı)' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Beyincik orağı ve hipofiz çadırı (temel) ———
    {
      tur: 'metin',
      md: `Öteki iki kıvrım küçüktür.

**Beyincik orağı** üçgen biçimli küçük bir yapraktır. Beyinciğin iki yarısı arasındaki arka çentiğe yerleşir (Gray, 1918).

**Hipofiz çadırı** küçük, yuvarlak ve yataydır. Kafatası tabanındaki eyer biçimli çukurun, **Türk eyerinin** (*sella turcica*), çatısını oluşturur. Bu çukurda oturan **hipofiz bezini** neredeyse tümüyle örter. Ortasında küçük bir delik vardır. Hipofizin sapı bu delikten geçer (Gray, 1918). Latince adı *diaphragma sellae*, yani “eyerin diyaframı”dır. “Diyafram” sözcüğü Yunanca “arasından” ve “çit” sözcüklerinden gelir (Shah ve Mohamed Elsanafiry, 2018).

Dört kıvrımın yerini orta hattan bakınca daha iyi görürüz.`,
    },
    {
      tur: 'sahne',
      baslik: 'Orta hattan: kıvrımların tutunduğu yerler',
      aciklama:
        'Kafatası ve beyin orta hattan ikiye ayrıldı. Sol yarıya içeriden bakıyoruz: yüz sağda, ense solda. Renkler gerçeğe yakın. Modelde sert zardan yalnızca beyincik çadırı vardır; beyinciğin üstündeki açık renkli yaprak odur. Beyin orağı bu iç yüzün hemen önünde durur: önde horoz ibiğinden başlar, kafatasının tepesi boyunca arkaya uzanır ve arkada çadıra bağlanır. Üst kenarı arkada iç art kafa çıkıntısına kadar uzanır. Alt kenarı nasırlı cismin hemen üstündedir. Hipofiz bezinin üstünü hipofiz çadırı örter; bu yaprak önde eyer tümseğine, arkada eyer sırtına tutunur. Orta beyin çadır çentiğinden geçer.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'beyaz', 'derin', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        vurgula: ['katman:kemik', 'katman:kabuk', 'katman:beyaz', 'katman:derin', 'katman:sap', 'katman:zar'],
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'korpus-kallozum', metin: 'Nasırlı cisim' },
          { yapi: 'hipofiz', metin: 'Hipofiz bezi' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
        ],
        noktalar: [
          { nokta: 'horoz-ibigi', metin: 'Horoz ibiği' },
          { nokta: 'ic-art-kafa-cikintisi', metin: 'İç art kafa çıkıntısı' },
          { nokta: 'eyer-sirti', metin: 'Eyer sırtı' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- Sert zarın dört kıvrımı vardır: beyin orağı, beyincik çadırı, beyincik orağı ve hipofiz çadırı.
- Beyin orağı iki yarımküreyi, beyincik çadırı büyük beyni beyincikten ayırır.
- Çadır kafatasının içini iki kata böler: çadır üstü ve çadır altı.
- Çadırın ön kenarındaki çentikten orta beyin geçer.
- Kıvrımlar beyni yerinde tutar. Baş hızla hareket edince beynin sallanmasını azaltır.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Çadır büyük beynin yükünü taşır',
      md: 'Erişkin beyni yaklaşık 1355 g, beyincik yaklaşık 150 g gelir. Yani çadırın üstünde yaklaşık 1200 g’lık bir beyin durur. Çadır bu ağırlığı yanlara, kafatasının duvarına aktarır. Böylece yük aşağıdaki büyük deliğe doğru binmez (Rai ve ark., 2018). Çadır her canlıda da yoktur. Klintworth’un 1968 karşılaştırmasına göre amfibi, balık ve sürüngenlerde bulunmaz; kuşlarda ve memelilerde vardır. Yetişkin kedide çadırın tamamı kemikleşmiştir (Rai ve ark., 2018).',
    },
    {
      tur: 'metin',
      md: `Kafa içinde basınç çok artarsa beynin bir bölümü bu sert kıvrımların altından ya da yanından kayabilir. Beyin dokusu orağın altından ya da çadır çentiğinden öteki bölmeye itilebilir. Büyük delikten de aşağıya, omurga kanalına doğru inebilir (Knight ve De Jesus, 2023). Buna **fıtıklaşma** (herniasyon) denir (Munakomi ve Das, 2026). Fıtıklaşmayı “Kanamalar ve fıtıklaşmalar” bölümünde ayrıntısıyla göreceğiz.`,
    },

    // ——— Lisans: kıvrımların yapısı ve tutunma yerleri ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kıvrımlar neyden yapılır?** Gray dört kıvrımın dördünü de meningeal katın ikiye katlanması olarak anlatır (Gray, 1918). Ishikawa ve arkadaşları ise bir ayrım yapar. İlk üç kıvrım (beyin orağı, beyincik çadırı ve beyincik orağı) iki kat meningeal sert zardan oluşur. Bunlar gelişen beyin bölümlerinin arasında sıkışıp katlanan ilkel zar dokusundan doğar. Hipofiz çadırı ise onlara göre tek katlı bir sert zar yaprağıdır (Ishikawa ve ark., 2026). Başka bir derleme hipofiz çadırını iki katlı anlatır (Shah ve Mohamed Elsanafiry, 2018). Kıvrımların embriyodaki oluşumunu “Zarların gelişimi ve keşif tarihi” bölümünde göreceğiz.

Kafatasının içindeki ana bölmeler üç tanedir: sağ ve sol çadır üstü bölmeler ile çadırın altındaki arka kafa çukuru. Sağ ve sol çadır üstü bölmeyi beyin orağı ayırır (Knight ve Rayi, 2023). Arka kafa çukurunun iki açıklığı vardır: büyük delik ve çadır çentiği (Knight ve De Jesus, 2023).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın dört kıvrımı',
      sutunlar: ['Kıvrım', 'Nerede', 'Nereye tutunur', 'Kenarındaki sinüs'],
      satirlar: [
        [
          'Beyin orağı',
          'İki yarımküre arasındaki boylamasına yarıkta',
          'Önde horoz ibiği. Üst kenarı orta hatta kafatasının iç yüzü, iç art kafa çıkıntısına dek. Arkada çadırın üst yüzü',
          'Üst kenarda üst sagital, alt kenarda alt sagital sinüs. Çadırla birleşme çizgisinde düz sinüs',
        ],
        [
          'Beyincik çadırı',
          'Art kafa lobları ile beyincik arasında',
          'Arkada art kafa kemiğinin iç yüzündeki enine çıkıntılar. Önde şakak kemiğinin kayalık kısmının üst kenarı. Uçları ön ve arka klinoid çıkıntılar',
          'Arka kenarda transvers sinüs, ön-yan kenarda üst petrozal sinüs',
        ],
        [
          'Beyincik orağı',
          'Beyinciğin iki yarısı arasındaki arka çentikte',
          'Tabanı çadırın alt-arka yüzü. Arka kenarı art kafa kemiğindeki dikey çıkıntının alt kısmı',
          'Arka katlarında oksipital sinüs',
        ],
        ['Hipofiz çadırı', 'Türk eyerinin üstünde', 'Önde eyer tümseği (*tuberculum sellae*), arkada eyer sırtı (*dorsum sellae*)', '—'],
      ],
      not: 'TA2 adları: *falx cerebri*, *tentorium cerebelli*, *incisura tentorii* (çadır çentiği), *falx cerebelli*, *diaphragma sellae*. Kaynaklar: Gray (1918); FIPAT (2019); Ishikawa ve ark. (2026); Munakomi ve Jozsa (2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beyin orağı.** Orağın ön bölümünde sık sık küçük delikler bulunur (Ishikawa ve ark., 2026). Normalde orak, sert zarın sınır hücre katmanında biriken kanı, yani subdural kanamayı, tek bir yarımkürede tutar (Ishikawa ve ark., 2026). Çadır da aynı kanamayı aşağıdan sınırlar (Kim ve Gean, 2011).

**Çadırın tutunma yerleri.** Çadır arkada, dışa doğru kavisli kenarıyla art kafa kemiğinin iç yüzündeki enine çıkıntılara tutunur. Orada transvers sinüsleri içine alır. Önde iki yanda şakak kemiğinin kayalık kısmının üst kenarına tutunur. Orada da üst petrozal sinüsleri sarar (Gray, 1918). Kayalık kısmın ucunda çadırın iki kenarı birbirini çaprazlar. Serbest kenar öne uzanıp ön klinoid çıkıntıya, tutunan kenar arka klinoid çıkıntıya bağlanır (Gray, 1918). Klinoid çıkıntılar, Türk eyerinin çevresindeki küçük kemik çıkıntılarıdır. Kenarların çaprazlaştığı yerde göz hareket siniri (III. kafa siniri) ve makara siniri (IV. kafa siniri) kavernöz sinüsün yan duvarına doğru geçer (Rai ve ark., 2018).

Çadırın üst yüzünün orta hattına beyin orağının arka kenarı tutunur. Düz sinüs ikisinin birleşme çizgisinde uzanır (Gray, 1918). Çadır U biçimlidir. Ön-iç kenarındaki açıklık çadır çentiğidir (Ishikawa ve ark., 2026).`,
    },

    // ——— Lisans: çadır çentiği ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Çentikte neler var?** Orta beyin çentiğin ön kısmını doldurur. Çentiğin arka yarısında beyinciğin üst orta bölümü (üst vermis) ya da nasırlı cismin arka ucu (splenium) bulunur. Geri kalan yerde beyin-omurilik sıvısı (BOS), damarlar ve sinirler vardır (Rai ve ark., 2018). Çentikten geçen önemli yapılar şunlardır: orta beyin, göz hareket siniri, arka beyin atardamarları ve üst beyincik atardamarları (Hall ve Munakomi, 2026).

Çentiğin serbest kenarının hemen üstünde iki komşu durur. Biri şakak lobunun iç yüzündeki **parahipokampal kıvrımdır** (hipokampus çevresi kıvrımı). Öteki **arka beyin atardamarıdır** (Rai ve ark., 2018). Bu komşuluk, beynin çentikten aşağı kaydığı fıtıklaşmada önemlidir (Rai ve ark., 2018).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Üstten: çadır çentiği ve içinden geçen orta beyin',
      aciklama:
        'Büyük beyin ve ara beyin gizlendi; kalan yapılara yukarıdan bakıyoruz. Ön taraf ekranın üstünde, hastanın sağı ekranın sağında. Açık krem renkli yaprak beyincik çadırıdır; ortasındaki açıklık çadır çentiğidir. Mor orta beyin çentiğin ön kısmını doldurur. Beyincik çadırın altında kalır; bu bakıştan görünmez. Kırmızı damarlar arka beyin ve üst beyincik atardamarlarıdır. Modelde çadırın yalnızca sağ yarısı gerçek veriden gelir; sol yarısı onun ayna kopyasıdır ve beyinciğe oturması için yer yer biraz yukarı alınmıştır. Gerçekte de çadır beyinciğin üst yüzünü örter (Gray, 1918).',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'zar', 'damar'],
        renk: 'bolge',
        gizle: ['bolge:sinir', 'bolge:serebrum', 'bolge:diensefalon', ...OTEKI_ATARDAMARLAR],
        bakis: 'ust',
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR_RENGI }],
        etiketler: [
          { yapi: 'beyincik-cadiri-sag', metin: 'Beyincik çadırı' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin atardamarı' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Çentik herkeste aynı değildir.** Corsellis’in çalışmasında çentiğin alanı 10 ile 23 cm² arasında değişiyordu. En büyük çentik, en küçüğün iki katıydı. Corsellis’e göre gelişim tamamlanınca çadır, gerilip genişlemeyecek kadar güçlüdür ve kafatasına sıkı tutunmuştur. Yani bu fark sonradan oluşmaz. Normal gelişimin bir çeşitliliğidir (Rai ve ark., 2018).

**Beyin sapı da çentikte herkeste aynı yerde durmaz.** Adler ve Milhorat 100 otopside (18–80 yaş) çentiği ve beyin sapını ölçtü. Beyin sapının yerini anlatmak için bir uzaklık kullandılar. Bu, beyin sapının iki ayağı arasındaki çukur ile eyer sırtının (*dorsum sellae*) üst-arka kenarı arasındaki uzaklıktır. Eyer sırtı, Türk eyerinin arka duvarıdır. Bu uzaklık ortalama 20,4 ± 3,2 mm idi. Beyin sapı olguların %28’inde öne yakındı (öne yerleşik). %36’sında arkaya yakındı (arkaya yerleşik). %36’sında ise ortadaydı (Adler ve Milhorat, 2002).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Çadır ve çentiği: ölçüler',
      sutunlar: ['Ölçü', 'Değer', 'Çalışma'],
      satirlar: [
        ['Çentiğin uzunluğu', '57,7 ± 5,6 mm', 'Adler ve Milhorat (2002): 100 otopsi'],
        ['Çentiğin en büyük genişliği', '29,6 ± 3 mm', 'Adler ve Milhorat (2002)'],
        ['Çentiğin uzunluğu', '54,9 ± 5,2 mm', 'Staquet ve ark. (2021): 40 BT’den üç boyutlu ölçüm'],
        ['Çentiğin ön genişliği', '25,5 ± 3,5 mm', 'Staquet ve ark. (2021)'],
        ['Çentiğin en büyük genişliği', '30,9 ± 2,5 mm', 'Staquet ve ark. (2021)'],
        ['Çentiğin alanı', '13,26 ± 1,6 cm²', 'Staquet ve ark. (2021)'],
        ['Çentiğin alanı', '10–23 cm²; en büyüğü en küçüğün iki katı', 'Corsellis (Rai ve ark., 2018 aktarır)'],
        ['Çadırın genişliği', '99,64 ± 4,79 mm', 'Staquet ve ark. (2021)'],
        ['Çadırın yüzey alanı', '57,6 ± 5,8 cm²', 'Staquet ve ark. (2021)'],
        [
          'Çadırın orta hat (sagital) kesitteki uzunluğu (Türkiye)',
          'Erkek 3,95 ± 0,65 cm; kadın 3,72 ± 0,6 cm',
          'Vatansever ve ark. (2026): 594 BT anjiyografi',
        ],
        ['Çadır açısı (Türkiye)', 'Erkek 41,94 ± 7,57°; kadın 40,87 ± 7,65°', 'Vatansever ve ark. (2026)'],
      ],
      not: '± işaretinden sonraki sayı standart sapmadır: ölçümlerin ortalama çevresinde ne kadar dağıldığını gösterir. Ölçümler farklı yöntemlerle alındı: otopsi, BT’den üç boyutlu çizim ve damarları gösteren BT (BT anjiyografi). Çalışmalar “uzunluk” gibi ölçüleri farklı tanımlayabilir; bu yüzden sayılar yan yana konunca dikkatle okunmalıdır.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Çentiğin komşuları neden önemli?',
      md: 'Çentiğin serbest kenarının hemen üstünde parahipokampal kıvrım ve arka beyin atardamarı durur (Rai ve ark., 2018). Kafa içi basınç artınca bu kıvrım çadırın serbest kenarı üzerinden aşağı kayabilir. O zaman göz hareket sinirini sıkıştırır. Bu doğrudan baskı göz bebeğinin genişlemesine yol açar (Rai ve ark., 2018). Çentik dar bir geçittir. Orta beyin, göz hareket siniri ve iki çift atardamar bu geçitten birlikte geçer (Hall ve Munakomi, 2026). Fıtıklaşmanın türleri ve belirtileri “Kanamalar ve fıtıklaşmalar” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Çadır BT’de nasıl görünür?',
      md: 'Kontrast maddeyle çekilen bilgisayarlı tomografi (BT) çadırı olguların %99’unda gösterir. Kontrastsız görüntülerde ise çadırı seçmek zordur (Rai ve ark., 2018). Kesitin açısına göre çadır dört biçimde görünür (Rai ve ark., 2018):\n\n- **Gotik kemer:** çentik düzleminden geçen kesit. Çadırın bütün kenarı ön klinoid çıkıntıdan çentiğin tepesine dek görülür.\n- **V biçimi:** sinüslerin birleştiği yerden geçen kesit. Çadır içe doğru uzanır.\n- **Ayrılan bantlar:** bu birleşme yerinin altından geçen kesit. Çadır arkaya ve yana, tutunduğu yerlere doğru açılır.\n- **M biçimi:** yine sinüslerin birleştiği yerden geçen bir kesit.',
    },

    // ——— Lisans: beyincik orağı ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beyincik orağı.** Tabanı çadırın alt-arka yüzüne tutunur. Arka kenarı art kafa kemiğinin iç yüzündeki dikey çıkıntının alt kısmına yapışır. İnerken bazen iki küçük kıvrıma ayrılır. Bu kıvrımlar büyük deliğin kenarlarında kaybolur (Gray, 1918). Orağın arka katları arasında oksipital sinüs uzanır. Bu sinüsün iki tane olması gibi farklı biçimleri bilinir (Ishikawa ve ark., 2026).

Beyincik orağının sayısı kişiden kişiye değişir. Türkiye’den ve Hindistan’dan iki çalışmanın sonuçları aşağıdadır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beyincik orağı: kaç tane?',
      sutunlar: ['Bulgu', 'Çavdar ve ark. (2021), İstanbul: 49 sert zar', 'Hosapatna ve ark. (2024), Hindistan: 48 kadavra'],
      satirlar: [
        ['Tek (normal) orak', '36 olgu (%73,5)', '%87,5'],
        ['İki kıvrım', '5 olgu (%10,2)', '%8,3'],
        ['Üç kıvrım', '5 olgu (%10,2)', '—'],
        ['Dört ya da daha çok kıvrım', 'Dört: 1 olgu (%2); beş: 1 olgu (%2)', 'Beş ya da yedi kıvrım: %4,2'],
        ['Orak yok', '1 olgu (%2)', '—'],
        ['Normal orağın boyutları', 'Uzunluk 3,7 cm; genişlik 1,0 cm; derinlik 0,4 cm', '—'],
        [
          'Oksipital sinüsle ilişkisi',
          'Orak sayısı arttıkça oksipital sinüs sayısı da artıyordu',
          'Tek orakların çoğunda oksipital sinüs vardı. Örnek kesitte iç yüzü endotelle döşeli büyük bir kanaldı',
        ],
      ],
      not: 'Çavdar ve arkadaşlarının sert zarları adli tıp kurumundan alındı. Endotel: damarların iç yüzünü döşeyen ince hücre katı. Kaynaklar: Çavdar ve ark. (2021); Hosapatna ve ark. (2024).',
    },

    // ——— Lisans: hipofiz çadırı ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hipofiz çadırı.** Bu sert zar yaprağı Türk eyerinin çatısıdır. Önde eyer tümseğine, arkada eyer sırtına tutunur (Ishikawa ve ark., 2026). Kaç katlı olduğu kaynaklar arasında tartışmalıdır; bunu yukarıda gördük. İlk derste kısaca gördüğümüz gibi diyafram eyeri her zaman tam örtmez. Olguların %39’unda yaprakta 5 mm ya da daha geniş bir açıklık vardır. %10’unda yaprak o kadar incedir ki eyerin içi yukarıdan görülür (Ishikawa ve ark., 2026).

Örümcek ağı zar bu açıklıktan eyerin içine inebilir. Böylece diyaframın altında küçük bir sıvı cebi oluşur. Buna **diyafram altı sisternası** denir. Bu cebin genişliği kişiden kişiye değişir: hiç olmayabilir de, geniş de olabilir. Cebin hastalık düzeyinde genişlemesine **boş sella sendromu** denir. Bunu ilk kez 1951’de Busch tanımladı (Ishikawa ve ark., 2026).

Diyafram deliğinin büyüklüğü ve biçimi çalışmadan çalışmaya farklı bulunmuştur. Bu çalışmalar farklı yöntemler kullandı: taze kadavra, kadavra başı ve MR.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Hipofiz çadırının deliği',
      sutunlar: ['Çalışma', 'Yöntem', 'Bulgu'],
      satirlar: [
        ['Ishikawa ve ark. (2026)', 'Derleme', '%39’unda ≥5 mm açıklık; %10’unda yaprak çok ince, eyerin içi yukarıdan görülür'],
        ['Cabuk ve ark. (2020), Kocaeli', '24 taze erişkin kadavra', 'Delik 5 örnekte (%21) dar, 19 örnekte (%79) daha geniş'],
        [
          'Ay ve ark. (2024), İstanbul',
          '20 kadavra başı',
          'Deliğin biçimi: %45 düzensiz, %20 yuvarlak, %20 ön-arka oval, %15 enine oval. Hipofiz sapı çoğunlukla deliğin arka yarısından geçiyor',
        ],
        [
          'Tsutsumi ve ark. (2019a)',
          '84 hastada ince kesitli MR',
          '%4’ünde diyafram görünür deliği olmayan tam bir yaprak; %30’unda diyafram altı sisternası seçilemedi',
        ],
      ],
      not: 'Kaynaklar tablodaki çalışmalardır. Cabuk ve ark. (2020), Ay ve ark. (2024) ve Tsutsumi ve ark. (2019a) yalnızca özetinden okundu.',
    },

    // ——— Lisans: Meckel boşluğu ve sinir kılıfları ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Meckel boşluğu.** Beşinci kafa siniri, yani **üçlü sinir** (*nervus trigeminus*), kafatası tabanında bir sert zar cebine girer. Bu cebe **Meckel boşluğu** ya da **trigeminal mağara** (*cavum trigeminale*) denir (Wysiadecki ve ark., 2023). TA2 onu sert zarın bir parçası olarak sayar. TA2’nin notuna göre bu boşluk, sinirin gangliyonunu ve dallarını saran parmak biçimli bir sert zar cebidir (FIPAT, 2019).

Meckel boşluğu Türk eyerinin yanındaki bölgenin arka-yan kısmındadır. İçinde BOS vardır. Sinir bu cebe beyin sapının önündeki sisternadan (köprü önü sisternası) girer (Wysiadecki ve ark., 2023). Boşlukta sinirin üçgen biçimli lif ağı ve **trigeminal gangliyon** bulunur. Gangliyona Gasser ya da yarımay gangliyonu da denir. Sinirin üç ana dalı buradan çıkar (Wysiadecki ve ark., 2023). Gangliyon ince, hilal biçimli bir yapıdır ve orta kafa çukurunda durur (Yu ve ark., 2023).

**Sert zar sinirlere kılıf olur.** Kafa sinirleri kafatasının deliklerinden çıkarken sert zar onlarla birlikte dışarı uzanır. Gray’e göre sert zarın lifli katı bu sinirlere kılıf yapar (Gray, 1918). Ishikawa ve arkadaşlarına göre meningeal kat sinirin çevresinde bir kılıf oluşturur. Kafatasının dışında bu kılıf sinirin dış kılıfına (epinöryum) devam eder (Ishikawa ve ark., 2026). Göz siniri özel bir örnektir. Meningeal kat göz sinirine eşlik ederek göz küresine kadar gider. Orada gözün beyaz dış duvarıyla (sklera) kaynaşır. Periostal kat ise göz çukurunun kemik zarı (periorbita) olur (Ishikawa ve ark., 2026). TA2 göz sinirinin dış ve iç kılıflarını ayrı terimler olarak verir (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Dört kıvrım: beyin orağı, beyincik çadırı, beyincik orağı, hipofiz çadırı. İlk üçü iki kat meningeal sert zardır. Hipofiz çadırı Ishikawa’ya göre tek katlı, Shah ve Mohamed Elsanafiry’ye göre iki katlıdır.
- Beyin orağı: önde horoz ibiği, arkada çadır. Üst kenarda üst sagital, alt kenarda alt sagital sinüs; orak-çadır birleşiminde düz sinüs.
- Çadır: arkada transvers sinüs, önde üst petrozal sinüs. Serbest kenar ön klinoide, tutunan kenar arka klinoide gider.
- Çadır çentiğinden orta beyin, III. sinir, arka beyin ve üst beyincik atardamarları geçer. Serbest kenarın üstünde parahipokampal kıvrım ve arka beyin atardamarı durur.
- Beyin sapı çentikte öne yerleşik (%28), arkaya yerleşik (%36) ya da orta konumlu (%36) olabilir (Adler ve Milhorat).
- Hipofiz çadırı: önde eyer tümseği, arkada eyer sırtı; ortasından hipofiz sapı geçer.
- Meckel boşluğu (*cavum trigeminale*): trigeminal gangliyonu saran, BOS içeren sert zar cebi.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Orta hattı geçen kanama',
      oyku: '62 yaşında bir erkek, evde düştükten iki hafta sonra artan baş ağrısıyla başvuruyor. BT’de iki yarımküreyi birlikte saran bir subdural kanama görülüyor. Kanama orta hattı aşıp öteki tarafa geçmiş. MR’da ne beyin orağı ne de üst sagital sinüs seçilebiliyor.',
      soru: 'Subdural kanama normalde neden orta hattı geçmez ve bu hastada neden geçmiş olabilir?',
      cozum: `**Normalde:** Beyin orağı iki yarımkürenin arasına iner. Subdural kanamayı içe doğru orak, aşağı doğru çadır sınırlar (Kim ve Gean, 2011). Bu yüzden normalde orak, subdural kanamayı tek bir yarımkürede tutar (Ishikawa ve ark., 2026).

**Bu hastada:** Orak yoksa bu sınır da yoktur. Beyin orağının doğuştan yokluğu nadirdir. Çoğunlukla ön beynin iki yarıma ayrılamadığı bir gelişim bozukluğunda (holoprosensefali) görülür. Orak yoksa alt sagital sinüs de zorunlu olarak yoktur. Üst sagital sinüs ise yine de oluşabilir: üç olgudan birinde bildirilmiştir (Ishikawa ve ark., 2026).

**Türkiye’den bir olgu:** Bu olgu İstanbul Üniversitesi Cerrahpaşa Tıp Fakültesi’nden bildirildi. 49 yaşında bir kadında hem beyin orağı hem üst sagital sinüs tümüyle yoktu. Subdural kanama orta hattı geçmişti. Yazarlara göre orak yokluğu tanıyı karıştırabilir, çünkü kanama orta hattı aşabilir (Kocak ve ark., 2013).

Tanı ve tedavi kararı hekime aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Uzman: çentik tipleri ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Adler ve Milhorat sınıflaması.** Adler ve Milhorat 100 otopside çadır çentiğini ve çevresini ölçtü. Çentiğin uzunluğunu ve en büyük genişliğini (yukarıdaki ölçü tablosu) dörde bölünmüş gruplara (çeyreklere) ayırdılar. Uzunluğa göre çentikler uzun, kısa ve orta; genişliğe göre geniş, dar ve orta diye adlandırıldı. Bu gruplardan sekiz çentik tipi tanımlandı (Adler ve Milhorat, 2002).

Aynı çalışma göz hareket sinirini de ölçtü. Sinirin sisterna içindeki uzunluğu solda 26,7 ± 2,9 mm, sağda 26,1 ± 3,2 mm idi. İki sinirin arasındaki açı 57,3 ± 7,3 derece ölçüldü (Adler ve Milhorat, 2002). Yazarlara göre bu sınıflama, benzer hastalığı olan kişilerde fıtıklaşma tablosunun neden farklı olduğunu açıklamaya yardım eder (Adler ve Milhorat, 2002).

Sınıflama sonra canlı insanlarda da denendi. 34 yoğun bakım hastasında çentiğin BT ve MR ölçümleri birbiriyle uyumlu çıktı (Grille ve ark., 2021). Yaşayan kişilerde MR ile yapılan başka bir çalışmada göz hareket sinirinin ölçüleri kadavralardakinden farklı çıktı. Yazarlar farkı, ölümden sonra beynin su kaybetmesine bağlar. Bu kayıp siniri uzatabilir (Arrambide-Garza ve ark., 2023).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Çadır çentiğinin sekiz tipi',
      sutunlar: ['Tip', 'Otopside sıklık (100 olgu)', 'Yoğun bakım hastalarında (34 hasta, BT ve MR)'],
      satirlar: [
        ['Tipik', '%24', '4 hasta'],
        ['Dar', '%15', '3 hasta'],
        ['Uzun', '%15', '1 hasta'],
        ['Geniş', '%12', '2 hasta'],
        ['Küçük', '%10', '7 hasta'],
        ['Büyük', '%9', '2 hasta'],
        ['Kısa', '%8', '15 hasta'],
        ['Karışık', '%7', 'Bildirilmedi'],
      ],
      not: 'Otopsi sütunu Adler ve Milhorat (2002), hasta sütunu Grille ve ark. (2021) verisidir. Grille ve arkadaşlarının hastalarında en sık tip kısa çentikti: 34 hastanın 15’i (%44). Makalenin özeti bu oranı yanlışlıkla %58 diye yazar; öteki yüzdeler hasta sayılarıyla uyuşur. Bu yüzden hasta sütununda hasta sayısı verildi. Her iki çalışma da yalnızca özetinden okundu.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Çentiğin biçimi fıtıklaşmayı nasıl etkiler?',
      md: `Rai ve arkadaşlarının derlemesine göre uzun ve geniş çentikler, kısa ve dar çentiklere göre beyincik dokusunu daha çok açıkta bırakır. Bu, beyincik ya da büyük beyin dokusunun yukarı ya da aşağı doğru fıtıklaşma eğilimini açıklayabilir (Rai ve ark., 2018). Göz bebeğinin genişlemesi de her hastada aynı görülmez. Bu tutarsızlık, göz hareket sinirinin uzunluğundaki ve gidişindeki farklara bağlanmıştır (Rai ve ark., 2018).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Türkiye’den: 594 kişide beyincik çadırı',
      md: `Bursa Uludağ ve Hacettepe üniversitelerinden Vatansever ve arkadaşları 594 kişinin BT anjiyografisinde çadırı ölçtü. Kişiler 25–82 yaşındaydı. Ortalama yaş 57,99 ± 14,15 idi (Vatansever ve ark., 2026).

- Çadırın uzunluğu orta hat (sagital) kesitlerinde ölçüldü. Uzunluk erkeklerde 3,95 ± 0,65 cm, kadınlarda 3,72 ± 0,6 cm idi. Erkeklerde anlamlı olarak daha uzundu (Vatansever ve ark., 2026).
- Çadırın açısı, kafa tabanındaki büyük deliğin ön ve arka kenarını birleştiren çizgiye (McRae çizgisi: bazion ile opistion arası) göre ölçüldü. Açı erkeklerde 41,94 ± 7,57, kadınlarda 40,87 ± 7,65 derece idi (Vatansever ve ark., 2026).
- Kişilerin %70,5’i kısa-geniş kafalı (brakisefal), %21’i orta kafalı (mezosefal), %8,4’ü uzun kafalı (dolikosefal) idi. Çadır açısı orta kafalılarda kısa-geniş kafalılardan büyüktü (Vatansever ve ark., 2026).
- Makalenin özetine göre yaş çadırın ölçülerini etkilemedi. Ama bulgular bölümünde yaş arttıkça çadır açısının çok az daraldığı görüldü (R = −0,089). Kadınlarda çadırın uzunluğu ve açısı da yaşla biraz azalıyordu. Bu ilişkilerin hepsi zayıftı (Vatansever ve ark., 2026).

Yazarlara göre farklar ve ilişkiler zayıftır. Klinikte yararları da büyük olasılıkla sınırlıdır (Vatansever ve ark., 2026). Makalenin metninde bir cümlede açı yanlışlıkla “cm” birimiyle yazılmıştır. Burada yalnızca makalenin tablolarıyla uyuşan değerler kullanıldı.`,
    },

    // ——— Uzman: orak ve çadırın çeşitliliği ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Orak ve çadır kişiden kişiye değişir.** 40 kişinin BT görüntülerinden orak ve çadır üç boyutlu olarak yeniden çizildi. Beyin orağının yüksekliği 34,9 ± 3,9 mm, yüzey alanı 56,5 ± 7,7 cm² bulundu. Orağın altındaki açıklığın (orak çentiği) ortalama uzunluğu 96,9 ± 8 mm, yüksekliği 41,8 ± 5,9 mm idi. Alanı 28,8 ± 5,8 cm² ölçüldü; en küçüğü 15,8, en büyüğü 40,5 cm² idi (Staquet ve ark., 2021). Yazarlara göre orakta, çadırda ve çentiklerinde büyük anatomik farklar vardır. Bu farklar, kafa yaralanmalarının bilgisayarda canlandırılmasında kişiye özel modeller için önemlidir (Staquet ve ark., 2021).

**Yokluk ve az gelişme.** Beyin orağının doğuştan yokluğu nadirdir ve çoğunlukla holoprosensefalide görülür (Ishikawa ve ark., 2026). Çadırın tamamen yokluğu ise hiç bildirilmemiştir. Kısmi az gelişme görülür ve çoğu kez Chiari malformasyonuyla birliktedir (Ishikawa ve ark., 2026). Chiari malformasyonunda beyincik orağı ve art kafa kemiğinin içindeki dikey çıkıntı da bulunmayabilir. Yazarlara göre küçük kalan arka kafa çukuru, iki yarım arasında kalacak ilkel zar dokusunu dışarı itiyor olabilir (Ishikawa ve ark., 2026).

**Orağın içindeki toplardamarlar.** Orağın bağ dokusunda bir toplardamar ağı vardır. İstanbul’dan Tatarli ve arkadaşları 16 olguda bu ağı lateks boyasıyla ve elektron mikroskobuyla inceledi. Damarlar arkaya doğru genişliyordu. Ortalama çapları orağın ön üçte birinde 0,42 ± 0,1 mm, ortasında 0,87 ± 0,17 mm idi. Arka üçte birde 1,38 ± 0,21 mm’ye ulaşıyordu. Arka üçte birdeki yoğun ağ yalnızca alt sagital sinüse bağlanıyordu, üst sagital sinüse bağlanmıyordu (Tatarli ve ark., 2013). Japonya’dan 91 hastalık bir MR çalışmasında ise %21’inde orakta belirgin bir toplardamar kanalı (orak sinüsü) görüldü. Bunların çoğu üst sagital sinüsün arka üçte birini düz sinüsün üst ucuna bağlıyordu (Tsutsumi ve ark., 2019b).`,
    },

    // ——— Uzman: sella ve Meckel boşluğu ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Hipofiz çadırı tek katlı mı, iki katlı mı?** Kaynaklar burada ayrılır. Ishikawa ve arkadaşları hipofiz çadırını tek katlı bir sert zar yaprağı olarak anlatır (Ishikawa ve ark., 2026). Doku incelemelerine göre, birçok ders kitabındaki çizimin aksine, Türk eyerinin yalnızca üst yüzünü meningeal sert zar örter. Kavernöz sinüsün hipofize bakan iç duvarı da meningeal sert zar değildir. Bu duvar lifli bir dokudur: hipofizin kapsülü (Ishikawa ve ark., 2026). Gelişimde de benzer bir tablo görülür. 12. haftada orak ve çadır oluşmuş olsa da hipofiz hâlâ gevşek bir ara doku içindedir. Yalnızca çatısı, yani geleceğin hipofiz çadırı, farklılaşmış sert zarla örtülüdür (Ishikawa ve ark., 2026).

Shah ve Mohamed Elsanafiry ise hipofiz çadırını iki katlı bir sert zar yaprağı olarak anlatır. Bu yaprak önde, Türk eyerinin önündeki düzlüğü ve ön kafa çukurunu örten sert zarla birleşir. Yüzeydeki katın kavernöz sinüsün çatısı ve yan duvarı olarak devam ettiğini yazarlar (Shah ve Mohamed Elsanafiry, 2018).

**Kavernöz sinüse giren sinirler.** Kafa sinirleri kavernöz sinüse girerken meningeal katı delip geçmez. Onu yanlarında taşıyarak sinüsün içine doğru bir girinti yaparlar (Ishikawa ve ark., 2026). Kavernöz sinüsten Türk eyerine uzanan bölge, gerçek bir interdural aralıktan çok omurilik epidural boşluğuna benzer. Bu bölge meningeal ve periostal bileşenler arasında görece geniş bir aralıktır (Ishikawa ve ark., 2026). Damarların sert zara girdiği yerlerde de meningeal kat damar duvarının en dış katıyla (adventisya) kaynaşır (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Meckel boşluğunun duvarı.** Polonya’dan Wysiadecki ve arkadaşları 26 Meckel boşluğunu mikroskopla inceledi (Wysiadecki ve ark., 2023):

- Boşluğun tamamı bir sert zar kılıfıyla sarılıydı. Bu kılıf boşluğu Türk eyerinin yanındaki bölmeden ayırıyordu.
- Kılıfın ön ucu kalbur gibi delikliydi. Sinir dallarının demetleri bu delikleri ayrı ayrı geçiyordu. Kılıf sinirin hem dış kılıfına (epinöryum) hem demet kılıfına (perinöryum) devam ediyordu.
- Boşluğun üst-yan duvarı kalındı. Değişik yönlerde örülmüş kolajen demetlerinden oluşuyordu.
- Yazarlara göre bu kılıf, arka kafa çukurunun meningeal katının içeri doğru girmesiyle oluşur.
- Sinirin boşluğa girdiği sert zar deliği (*porus trigeminus*) üstten bir sert zar kıvrımıyla sınırlanır: arka petroklinoid kıvrım. Üst petrozal sinüs bu kıvrım boyunca uzanır. 26 örneğin 2’sinde (%7,7) bu kıvrım kemikleşmişti.
- Bütün örneklerde boşluğun çevresinde araknoid granülasyon vardı. Örneklerin çoğunda (18/26; %69,2) bu granülasyonlar sinirin ikinci ve üçüncü dalları arasındaki üçgen alanda kümelenmişti.

Yazarlara göre ders kitaplarındaki “ucu açık üç parmaklı eldiven” modeli bir basitleştirmedir (Wysiadecki ve ark., 2023). Dokunun reçineyle sertleştirilip ince yapraklara ayrıldığı bir çalışma (plastinasyon) başka bir ayrıntı gösterdi. Örümcek ağı zar trigeminal kökçükleri sarıyordu. Hareket köklerinde de demet kılıfının oluşmasına katılıyordu (Xu ve ark., 2025). Ishikawa ve arkadaşlarına göre sinir meningeal katı geçerken kat bitmez, sinirin dış kılıfına devam eder. Bu geçişte sinirin çevresinde subaraknoid boşluğun bir uzantısı oluşur. Meckel boşluğu budur (Ishikawa ve ark., 2026).

Türkiye’den Karadaş ve arkadaşları, MR ile iki grubu karşılaştırdı. Birinci grupta üçlü sinire bağlı, nedeni bilinmeyen sinir ağrısı (idiyopatik trigeminal nevralji) olan 71 hasta vardı. İkinci grupta yüz ağrısı olmayan 60 kişi vardı. Hastalarda Meckel boşluğunun alanları ve yüksekliği daha büyüktü. Sinir, sert zar deliği düzeyinde daha inceydi (Karadaş ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kıvrımlar ameliyatta',
      md: `- **Orak bir yol göstericidir.** Beyin orağı, iki yarımkürenin arasından girilen ameliyatlarda sert bir orta hat işaretidir. Beynin ameliyat sırasında kaymasını ve yol bulma sistemlerinin (navigasyon) doğruluğunu etkiler (Munakomi ve Jozsa, 2026).
- **Çadırın az sinirli bölgesi.** Çadırın ön kenarından çentiğe uzanan bölge az sinir taşır ve güvenli bir giriş noktası sayılır (Ishikawa ve ark., 2026). Bir çalışmaya göre çadırın sinirleri çentikte ve düz sinüsün ön yarısında en seyrektir (Rai ve ark., 2018). Sert zarın sinirleri “Sert zarın atardamarları, sinirleri ve ağrı” bölümünde.
- **Çentiğin iç yanı kalabalıktır.** Çentiğin hemen iç yanında, bazal toplardamar (Rosenthal toplardamarı) gibi çok sayıda sinir ve damar yapısı bulunur (Rai ve ark., 2018).
- **Çadırın kesilmesi.** Keles ve arkadaşları çentikteki bir zar tümörüne (menenjiyom) beyinciğin üstünden ve çadırı geçerek ulaştı. Çadırı tümörün tabanı boyunca kestiler; böylece ameliyat koridoru genişledi. Bu sırada şakak lobunun arka-iç bölümü, arka beyin atardamarının dalları ve şakak lobunun tabanındaki toplardamarlar korunmalıdır (Keles ve ark., 2021). Rai ve arkadaşları ise bir kaynaktan başka bir yol aktarır. Buna göre çadırın iç yanındaki çentik tümörlerine en iyi art kafadan çadırı geçen yolla (oksipital transtentoryal yol) yaklaşılır (Rai ve ark., 2018). Keles ve arkadaşlarına göre her hastalıkta yolların artısı ve eksisi ayrıca tartılmalıdır (Keles ve ark., 2021).
- **Çadırın içindeki toplardamarlar.** Çadırın içinde toplardamar kanalları (çadır sinüsleri) uzanır. İç grup orta hattan 1,5–2,5 cm ve transvers sinüsten 1,0–2,5 cm uzakta başlar. Dış grup orta hattan 3–4 cm, transvers sinüsten 2–10 mm ve kayalık kısmın kenarından 1 cm uzaktadır (Rai ve ark., 2018). Sinüslerin ayrıntısı “Sert zarın toplardamar sinüsleri” bölümünde.
- **Ön klinoidin çevresi.** Göz çukurunun kemik zarından alın ve şakak sert zarına uzanan karmaşık bir sert zar bandı vardır: meningo-orbital bant. Bu bant ön klinoid çıkıntıya sıkıca tutunur ve orta meningeal atardamarın bir dalıyla beslenir (Manfrellotti ve ark., 2025).`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'Alttan: çentiğin serbest kenarı ve komşuları',
      aciklama:
        'Beyincik, köprü (pons) ve omurilik soğanı gizlendi; beyne alttan bakıyoruz. Ön taraf ekranın üstünde, hastanın sağı ekranın solunda. Açık krem renkli yaprak beyincik çadırının alt yüzüdür. Ortadaki açıklık çadır çentiğidir; mor orta beyin oradan geçer. Mavi büyük beyindir. Çentiğin kenarında, şakak lobunun iç yüzündeki parahipokampal kıvrım görünür. Kırmızı damarlar arka beyin ve üst beyincik atardamarlarıdır. Modelde göz hareket siniri yoktur; bu sinir çentiğin bu bölgesinden geçer.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'zar', 'damar'],
        renk: 'bolge',
        gizle: ['bolge:sinir', 'beyincik', 'pons', 'omurilik-sogani', ...OTEKI_ATARDAMARLAR],
        bakis: 'alt',
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR_RENGI }],
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'parahipokampal-girus-sol', metin: 'Parahipokampal kıvrım' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin atardamarı' },
          { yapi: 'ust-beyincik-arteri-sol', metin: 'Üst beyincik atardamarı' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Benzer kanama, farklı tablo',
      oyku: 'Aynı gün iki hasta acile geliyor. İkisinde de bir yarımkürenin üstünde benzer büyüklükte, kitle etkisi yapan bir kanama var. Birinci hastada kanama tarafındaki göz bebeği erkenden genişliyor ve ışığa yanıt vermiyor. İkinci hastada kitle etkisi benzer olduğu hâlde göz bebekleri uzun süre eşit kalıyor. Asistan hekim aradaki farkın nereden gelebileceğini soruyor.',
      soru: 'Çadır çentiğinin ve göz hareket sinirinin anatomisi bu farkı nasıl açıklayabilir?',
      cozum: `**Çentiğin komşuları:** Çadırın serbest kenarının hemen üstünde parahipokampal kıvrım ve arka beyin atardamarı durur (Rai ve ark., 2018). Bu kıvrım kenarın üzerinden aşağı kayınca göz hareket sinirini sıkıştırır ve göz bebeği genişler (Rai ve ark., 2018).

**Kişiden kişiye fark:** Çentiğin alanı 10 ile 23 cm² arasında değişebilir (Rai ve ark., 2018). Adler ve Milhorat 100 otopside sekiz çentik tipi tanımladı. Beyin sapı da çentikte öne yerleşik (%28), arkaya yerleşik (%36) ya da ortada (%36) olabilir. Göz hareket sinirinin sisternadaki uzunluğu solda ortalama 26,7, sağda 26,1 mm idi (Adler ve Milhorat, 2002). Yazarlar bu sınıflamayı, benzer hastalığı olan kişilerde fıtıklaşma tablosunun neden farklı olduğunu açıklamak için önerdi (Adler ve Milhorat, 2002).

**Göz bebeği neden tutarsız?** Göz bebeği bulgusunun fıtıklaşmada her hastada aynı çıkmaması, sinirin uzunluğundaki ve gidişindeki farklara bağlanmıştır (Rai ve ark., 2018). Bu iki hastadaki fark da çentiğin ve sinirin kişisel anatomisinden kaynaklanabilir.

Fıtıklaşmanın türleri ve tedavisi “Kanamalar ve fıtıklaşmalar” bölümünde. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
