import type { DersBolumu } from '../../../types';

/** Sahnede beyincik çadırının boyası (yalnızca tanıtır; anlam taşımaz). */
const CADIR = '#e8a33d';

/**
 * 04. bölüm: sert zarın toplardamar sinüsleri. Sinüsün yapısı, bütün sinüsler ve bağlantıları, ölçüler ve
 * varyasyonlar, köprü toplardamarları (sayı, tip, duvar), emisser ve diploik toplardamarlar, venöz lakünler,
 * granülasyonların sinüse açılması (kısa), MR'da dolma kusurları ve tromboz tuzağı (kısa). Sinüslerin hangi beyin
 * bölgesini boşalttığı "Atardamar alanları ve toplardamarlar" dersinde; BOS emilimi "Karıncıklar ve beyin-omurilik
 * sıvısı" dersinde. Bilgiler kaynak notlarından (S2/A, B, C, D).
 */
export const toplardamarSinusleri: DersBolumu = {
  id: 'toplardamar-sinusleri',
  baslik: 'Sert zarın toplardamar sinüsleri',
  bloklar: [
    // ——— Temel: sinüs nedir, kanın yolu ———
    {
      tur: 'metin',
      md: `Beyinden çıkan kan toplardamarlarla geri döner. Bu dönüş yolunun ana kanalları sert zarın içindedir. Bunlara **sert zar sinüsleri** (*sinus durae matris*) denir. Kısaca **toplardamar sinüsleri** de diyeceğiz. Burun çevresindeki hava boşluklarıyla, yani gündelik dildeki “sinüslerle” karıştırma. Bunlar hava değil, kan taşıyan kanallardır.

İlk derste bu kanalları kısaca gördük. Burada onları tek tek tanıyacağız: duvarlarını, yollarını, ölçülerini ve kişiden kişiye değişen biçimlerini.

Sert zarın iki katı vardır. Dıştaki kat kemiğe yapışır (endosteal kat). İçteki kat beyne bakar (meningeal kat). Bu iki kat çoğu yerde sıkıca birleşiktir. Sinüslerin ve kıvrımların olduğu yerlerde ise ayrılır (Ishikawa ve ark., 2026). Aradaki boşluk bir kan kanalı olur. Kanalın içini, toplardamarlarınkiyle kesintisiz süren ince bir örtü döşer: **endotel** (Gray, 1918). Sinüslerde kapakçık yoktur (Gray, 1918). Duvarlarında kas katmanı da yoktur (Levin-Carrion ve ark., 2026).`,
    },
    {
      tur: 'animasyon',
      ad: 'sinus-haritasi',
      baslik: 'Toplardamar sinüsleri haritası',
      aciklama:
        'Sinüsleri yandan, kafa tabanından ve köprü toplardamarlarıyla gör. Bir yapı seçince yeri, kanın yolu ve ölçüleri kaynağıyla yazar.',
    },
    {
      tur: 'metin',
      md: `**Kanın ana yolu.** Sinüsler birbirine bağlı bir ağ kurar. Ana yol tepeden başlar, arkadan aşağı iner:

1. **Üst sagital sinüs** (*sinus sagittalis superior*). İki yarımküreyi ayıran yarığın üstünde, önden arkaya uzanır (OpenStax 13.3). Beyin orağının kafatasına tutunan üst kenarındadır. Arkaya gittikçe genişler (Gray, 1918).
2. **Sinüslerin birleşim yeri** (*confluens sinuum*). Üst sagital sinüsün arkadaki genişlemiş ucudur. Kafatasının iç yüzündeki iç art kafa çıkıntısının bir yanında durur. Bu yan çoğunlukla sağdır (Gray, 1918).
3. **Enine sinüs** (*sinus transversus*; transvers sinüs). Arkadan iki yana doğru uzanır. Beyincik çadırının kemiğe tutunan dış kenarı onu sarar (Gray, 1918).
4. **Sigmoid sinüs** (*sinus sigmoideus*). Enine sinüs çadırdan ayrılınca aşağı ve içe kıvrılır. Bu S biçimli kısma sigmoid sinüs denir (Gray, 1918).
5. **İç juguler toplardamar** (*vena jugularis interna*). Kafatası tabanındaki juguler delikte sinüsün yerini alır. Kan buradan boyna iner (Gray, 1918).

Orta hatta iki sinüs daha vardır. **Alt sagital sinüs** (*sinus sagittalis inferior*) beyin orağının serbest alt kenarında uzanır (Gray, 1918). Orağın bu serbest kenarı, iki yarımküreyi bağlayan nasırlı cismin (*corpus callosum*) hemen üstündedir (Munakomi ve Jozsa, 2026). **Düz sinüs** (*sinus rectus*) beyin orağının beyincik çadırına kavuştuğu çizgidedir. Alt sagital sinüs düz sinüse açılır. Düz sinüs, beynin derinlerinden gelen **büyük beyin toplardamarını** da alır. Bu toplardamarın öbür adı **Galen venidir** (Gray, 1918). Düz sinüs de sonunda bir enine sinüse dökülür (Gray, 1918).

Kafatasının tabanında da sinüsler vardır. Bunlardan biri **kavernöz sinüstür** (*sinus cavernosus*). Bir klinik kaynağa göre klinikte en önemli sinüs budur (Bayot ve ark., 2023). Kama kemiğinin gövdesinin iki yanında durur. İçinden çok sayıda ince iplik geçer; bu iplikler ona ağ gibi bir görünüm verir. Adını bu görünümden alır (Gray, 1918). İç karotis atardamarı ve uzaklaştırıcı sinir (abdusens siniri) bu sinüsün içinden geçer (Mosteiro ve ark., 2024). Birkaç kafa siniri de yan duvarında uzanır (Gray, 1918; Mosteiro ve ark., 2024). İki kavernöz sinüs, hipofiz bezinin önünden ve arkasından geçen küçük sinüslerle birbirine bağlanır (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Orta hattan: sinüslerin geçtiği yerler',
      aciklama:
        'Sağ yarım kaldırıldı; sol yarıma içeriden bakıyoruz. Ön taraf sağda, tepe yukarıda. Kafatası yarı saydam, beyincik çadırı sarı. Modelde sinüsler ve beyin orağı yoktur; yerlerini noktalar gösterir. Üst sagital sinüs, bregma ve lambdanın altından geçerek iç art kafa çıkıntısına uzanır. Alt sagital sinüs nasırlı cismin üstünde, orağın serbest kenarındadır. Düz sinüs, orağın çadıra kavuştuğu çizgidedir.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'beyaz', 'derin', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR }],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Nasırlı cisim' },
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'beyincik' },
        ],
        noktalar: [
          { nokta: 'horoz-ibigi', metin: 'Horoz ibiği' },
          { nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' },
          { nokta: 'yan-kafa-art-kafa-kosesi-sol', metin: 'Lambda' },
          { nokta: 'ic-art-kafa-cikintisi', metin: 'İç art kafa çıkıntısı' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Arkadan: enine ve sigmoid sinüslerin olukları',
      aciklama:
        'Başa arkadan bakıyoruz; hastanın solu ekranın solunda. Kafatası yarı saydam, beyincik çadırı sarı. Sinüsler modelde yoktur; kemiğin iç yüzündeki olukları yerlerini gösterir. Enine sinüs, çadırın kemiğe tutunan dış kenarı boyunca uzanır. Sonra sigmoid sinüs olarak aşağı kıvrılır. Birleşim yeri, iç art kafa çıkıntısının yanındadır. Sigmoid oluk noktası yaklaşıktır.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR }],
        bakis: 'arka',
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'beyincik' },
          { yapi: 'oksipital-lob-sol', metin: 'Art kafa lobu' },
        ],
        noktalar: [
          { nokta: 'yan-kafa-art-kafa-kosesi-sol', metin: 'Lambda' },
          { nokta: 'ic-art-kafa-cikintisi', metin: 'İç art kafa çıkıntısı' },
          { nokta: 'enine-sinus-olugu-sol', metin: 'Enine sinüs oluğu' },
          { nokta: 'sigmoid-olugu-sol', metin: 'Sigmoid sinüs oluğu (yaklaşık)' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Beyinden sinüse: köprü toplardamarları.** Beynin yüzündeki toplardamarlar önce örümcek ağı zarın altındaki boşlukta toplanır. Sonra zarları geçip sinüse açılır. Bu kısa bağlantılara **köprü toplardamarları** denir (Joost ve ark., 2026). Beyin ile sinüs arasında bir köprü gibi uzandıkları için bu adı alırlar. Bir erişkinde yalnızca üst sagital sinüse ortalama 19 köprü toplardamarı açılır (Juskys ve ark., 2022).

Beyin toplardamarlarının duvarında kas dokusu yoktur. Bu yüzden duvarları çok incedir (Gray, 1918). Köprü toplardamarı, beynin yüzü ile sert zara sabitlenmiş sinüs arasında uzanır (Pierre ve ark., 2026). Beyin küçüldükçe beyin ile sert zar arasındaki uzaklık artar. Bu hem gelişen hem yaşlanan beyinde olabilir. Köprü toplardamarları gerilir ve kolay yırtılır hâle gelir (Pierre ve ark., 2026). Bebeklerde de bu aralık geniş olabilir. Geniş aralık köprü toplardamarlarını gerilmeye yatkın kılar (Araki ve ark., 2017).

Bir köprü toplardamarı yırtılırsa kan, sert zarın en iç hücre katına dolar. Bu kat zayıftır; kan onu yararak bir yarık açar (Joost ve ark., 2026). Kitaplardaki “subdural kanama” budur. Ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'animasyon',
      ad: 'kopru-toplardamarlari',
      baslik: 'Köprü toplardamarları: beyinden sinüse',
      aciklama:
        'Görünümleri sırayla seç: köprünün zarları geçişi, sinüse bağlanış tipleri, erişkin ile bebek farkı, beyin küçülünce gerilip yırtılması ve kronik subdural kanamanın zarları.',
    },
    {
      tur: 'metin',
      md: `**Kafatasının içinden dışına kestirme yollar.** Sinüsler yalnızca boyuna boşalmaz. Kafatası duvarındaki küçük deliklerden geçen toplardamarlar, onları kafanın dışındaki toplardamarlara da bağlar. Bunlara **emisser toplardamarlar** (*venae emissariae*) denir. Bazıları hemen herkeste vardır, bazıları ara sıra bulunur (Gray, 1918).

Emisser toplardamarların kapakçığı yoktur. Bu yüzden kan iki yönde de akabilir (Klein ve Bordoni, 2023). Bu iki yönlü yol bir tehlike de taşır. Bir enfeksiyon bu yolla kafa içinin derinlerine ulaşabilir (Klein ve Bordoni, 2023).

Kafatası kemiğinin ortasında süngerimsi bir kat vardır. Buna **diploe** denir. İçinde de toplardamarlar uzanır: **diploik toplardamarlar** (*venae diploicae*). Bunlar hem sinüslerle hem kafa derisinin toplardamarlarıyla bağlantılıdır (Gray, 1918). Böylece sinüsler, kemik ve kafa derisi kesintisiz bir toplardamar ağı kurar (Joost ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Sinüs:** sert zarın iki katı arasında açılan, endotelle döşeli, kapakçıksız ve kassız kan kanalı.

**Ana yol:** üst sagital sinüs → sinüslerin birleşim yeri → enine sinüs → sigmoid sinüs → iç juguler toplardamar.

**Orta hat:** alt sagital sinüs (orağın alt kenarı) → düz sinüs (orak ile çadırın kavuştuğu yer). Düz sinüs Galen venini de alır.

**Köprü toplardamarları:** beyin yüzünden sinüse uzanan ince duvarlı kısa toplardamarlar. Beyin küçülünce gerilir.

**Emisser ve diploik toplardamarlar:** sinüsleri kemiğe ve kafa derisine bağlar.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Sinüslerin içinde lifli bantlar vardır. Bunları ilk kez 1664’te Thomas Willis tanımladı. Bu yüzden onlara **Willis bantları** (*chordae Willisii*) denir (Zedde ve Pascarella, 2025b). En sık görülen türü bir kapakçığa benzer. Üst beyin toplardamarlarının sinüse açılan ağızlarını örter (Zedde ve Pascarella, 2025b). Sinüslerin birleşim yeri de eski bir hekimin adını taşır. Eski kitaplar ona *torcular Herophili* der (Gray, 1918). Herophilos, MÖ 335–280 yılları arasında yaşamış bir hekimdi (Dzierżanowski ve ark., 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Kitaptaki çizim herkesin sinüsü değildir',
      md: 'Kitaplar sinüsleri genellikle iki yanda eşit çizer. Gerçekte öyle değildir. Nepal’de 109 erişkinin MR’ında iki enine sinüs yalnızca %73,4’ünde simetrikti (Paudel ve ark., 2024). Türkiye’de çocuklarla yapılan bir MR çalışmasında, sinüs pıhtısı olmayan çocukların %50’sinde bir sinüs varyantı vardı (Bingol ve Ozdemir, 2026). Erzurum’daki bir çalışmaya göre, MR’da enine sinüsün bir bölümünde akımın görünmemesi ya da sinüsün hiç görünmemesi normal insanların yaklaşık %24’ünde olabilir. Bu görüntü pıhtı sanılabilir (Alper ve ark., 2004). Yani MR’da ince ya da görünmeyen bir sinüs her zaman hastalık değildir. Kararı hekim verir.',
    },

    // ——— Lisans: duvar, bütün sinüsler, kavernöz sinüs ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sinüsün duvarı.** Sinüsler, sert zarın endosteal (periostal) ve meningeal katları arasındadır (Bayot ve ark., 2023). İçlerini döşeyen endotel, toplardamarların endoteliyle kesintisizdir (Gray, 1918). Üst sagital sinüsün kapakçığı ve kas tabakası (*tunica muscularis*) yoktur (Letchuman ve Donohoe, 2023). Sinüs duvarı sıkı ve tabaka tabaka dizilmiş kolajen liflerden yapılır (Ye ve ark., 2024).

Beyin toplardamarları sinüse ulaşmak için iki zarı deler. Önce örümcek ağı zarı, sonra sert zarın iç (meningeal) katını geçer (Gray, 1918).

**Resmî adlar.** Uluslararası anatomi terimleri listesinin bugünkü baskısına kısaca TA2 denir. TA2 sinüslerin hepsine birlikte *sinus venosi durales* der. Eski ad *sinus durae matris* bunun eş anlamlısıdır (FIPAT, 2019).

**İki grup, yedi büyük sinüs.** Gray sinüsleri iki gruba ayırır (Gray, 1918):

- **Üst-arka grup:** üst sagital, alt sagital, düz, iki enine ve oksipital sinüs.
- **Ön-alt grup (kafa tabanı):** iki kavernöz, iki interkavernöz, iki üst petrozal, iki alt petrozal sinüs ve baziler pleksus.

Bir klinik kaynak ise yedi büyük sinüs sayar: üst sagital, alt sagital, düz, enine, sigmoid, kavernöz ve üst petrozal (Bayot ve ark., 2023). Gray sigmoid sinüsü ayrı saymaz. Onu enine sinüsün mastoid oluğundaki kısmı olarak anlatır (Gray, 1918). TA2 ise sigmoid sinüsü ayrı bir sinüs olarak verir. Bu terim listeye 1955’te eklenmiştir (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın sinüsleri: tek tek',
      sutunlar: ['Sinüs', 'Latince (TA2)', 'Nerede uzanır?', 'Neyi alır, nereye açılır?'],
      satirlar: [
        [
          'Üst sagital sinüs',
          '*Sinus sagittalis superior*',
          'Beyin orağının kafatasına tutunan üst kenarında. Önde kör delikte (*foramen cecum*) başlar, arkaya gider. Kesiti üçgendir, arkaya doğru genişler',
          'Üst beyin toplardamarlarını, diploe ve sert zar toplardamarlarını alır. İç art kafa çıkıntısı yakınında genellikle sağa sapar ve o yanın enine sinüsü olur',
        ],
        [
          'Alt sagital sinüs',
          '*Sinus sagittalis inferior*',
          'Beyin orağının serbest alt kenarının arka yarısında ya da üçte ikisinde. Silindir biçimlidir',
          'Arkaya doğru genişler ve düz sinüse açılır',
        ],
        [
          'Düz sinüs',
          '*Sinus rectus*',
          'Beyin orağının beyincik çadırına kavuştuğu çizgide. Kesiti üçgendir',
          'Alt sagital sinüsü, Galen venini ve üst beyincik toplardamarlarını alır. Genellikle üst sagital sinüsün gitmediği yandaki enine sinüse gider',
        ],
        [
          'Sinüslerin birleşim yeri',
          '*Confluens sinuum* (ilişkili ad: *torcular Herophili*)',
          'İç art kafa çıkıntısının bir yanında, genellikle sağında. Biçimi düzensizdir',
          'Üst sagital sinüsün genişlemiş ucudur. Oksipital sinüsün kanını da alır. Orta hattın öbür yanındaki enine sinüsle bağlantılıdır',
        ],
        [
          'Enine sinüs',
          '*Sinus transversus*',
          'Beyincik çadırının art kafa kemiğine tutunan dış kenarında',
          'Biri (genellikle sağdaki) üst sagital sinüsün, öbürü düz sinüsün devamıdır. Çadırdan ayrılınca sigmoid sinüs olarak sürer',
        ],
        [
          'Sigmoid sinüs',
          '*Sinus sigmoideus*',
          'Şakak kemiğinin mastoid kısmındaki S biçimli olukta',
          'Juguler delikte iç juguler toplardamara açılır',
        ],
        [
          'Oksipital sinüs',
          '*Sinus occipitalis*',
          'Beyincik orağının tutunan kenarında. Genellikle tektir, bazen iki tanedir',
          'Sinüslerin en küçüğüdür. Büyük delik çevresinde başlar, omurga içindeki arka toplardamar ağıyla bağlantılıdır. Birleşim yerinde biter',
        ],
        ['Marjinal sinüs', '*Sinus marginalis*', 'TA2’de ayrı bir sinüs olarak geçer', 'Gelişimde oksipital sinüsle birlikte ortaya çıkar'],
        [
          'Kavernöz sinüs',
          '*Sinus cavernosus*',
          'Kama kemiğinin gövdesinin iki yanında; üst göz yarığından şakak kemiğinin kayalık kısmının tepesine uzanır',
          'Üst petrozal sinüsle enine sinüse, alt petrozal sinüsle iç juguler toplardamara bağlanır',
        ],
        [
          'İnterkavernöz sinüsler',
          '*Sinus intercavernosi*',
          'Hipofiz bezinin önünde ve arkasında',
          'İki kavernöz sinüsü bağlar ve hipofiz çevresinde bir halka kurar. Öndeki genellikle daha büyüktür',
        ],
        [
          'Üst petrozal sinüs',
          '*Sinus petrosus superior*',
          'Beyincik çadırının şakak kemiğine tutunan kenarında; trigeminal sinirin üstünden geçer',
          'Kavernöz sinüsü enine sinüse bağlar',
        ],
        [
          'Alt petrozal sinüs',
          '*Sinus petrosus inferior*',
          'Şakak kemiğinin kayalık kısmı ile art kafa kemiğinin taban kısmı arasındaki olukta',
          'Juguler deliğin ön kısmından geçip iç juguler toplardamarın üst genişliğine (bulbus) açılır',
        ],
        [
          'Baziler pleksus',
          '*Plexus venosus basilaris*',
          'Klivusun üstünde, sert zarın katları arasında örülü kanallar',
          'İki alt petrozal sinüsü birbirine bağlar',
        ],
        [
          'Sfenoparietal sinüs',
          '*Sinus sphenoparietalis* (ilişkili ad: Breschet sinüsü)',
          'Kama kemiğinin küçük kanadının alt yüzü boyunca',
          'Kavernöz sinüse açılır. Varlığı ve bağlantıları tartışmalıdır',
        ],
        [
          'Petroskuamöz sinüs',
          '*Sinus petrosquamosus*',
          'Varsa, şakak kemiğinin pul ve kayalık kısımlarının birleşim çizgisinde',
          'Enine sinüse açılır',
        ],
        [
          'Çadır sinüsleri',
          '—',
          'Beyincik çadırının içinde uzanan her toplardamar kanalı',
          'Çadırın üstünden ve altından köprü toplardamarlarıyla kan toplar. Enine–sigmoid sinüse, düz sinüse, birleşim yerine ya da üst petrozal sinüse açılır',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Hosapatna ve ark. (2024) (marjinal sinüsün gelişimi); Mori ve ark. (2026) (çadır sinüsleri). “—”: TA2’de ayrı terim yok. TA2, kavernöz sinüsün üst ve alt petrozal sinüslere boşaldığını not eder (FIPAT, 2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kavernöz sinüs ve kafa tabanının sinüsleri.** Bir klinik kaynağa göre kavernöz sinüs yaklaşık 1 cm genişliğinde ve 2 cm uzunluğundadır (Ngnitewe Massa ve ark., 2023). İçinden ve duvarlarından geçen yapılar şöyledir:

- **Sinüsün içinden geçenler:** iç karotis atardamarı ve hemen yanında uzaklaştırıcı sinir (abdusens siniri, VI). Bu sinir tümüyle sinüsün içindedir ve atardamara sıkıca dayanır (Mosteiro ve ark., 2024). Gray bu ikisini sinüsün iç duvarında anlatır; bu tarihsel bir anlatımdır (Gray, 1918).
- **Yan duvar:** yukarıdan aşağıya göz hareket ettirici sinir (okülomotor, III) ve makara siniri (troklear, IV). Altlarında trigeminal sinirin göz ve üst çene dalları uzanır (V1 ve V2) (Gray, 1918; Mosteiro ve ark., 2024). Alt çene dalı (V3) yan duvara katılmaz (Mosteiro ve ark., 2024).

Kavernöz sinüs birçok yöne bağlanır. Üst petrozal sinüsle enine sinüse, alt petrozal sinüsle iç juguler toplardamara açılır (Gray, 1918). Kafatası tabanındaki birkaç delikten de yüzün derinindeki bir toplardamar ağına (pterigoid pleksus) bağlanır (Gray, 1918). Sfenoparietal sinüs de kavernöz sinüse açılır (Gray, 1918).

Hipofiz bezi bu ağın tam ortasındadır. Beyin toplardamarlarından farklı olarak, hipofiz zengin bir toplardamar ağı korur. Bu ağ hem kavernöz hem interkavernöz sinüslere doğrudan bağlanır (Ishikawa ve ark., 2026). İki interkavernöz sinüs, hipofizin önünden ve arkasından geçer. Kavernöz sinüslerle birlikte bir halka kurar (Gray, 1918). TA2’nin bir notuna göre küçük bir alt interkavernöz sinüs olguların %17’sinde bulunmuştur. Bu not, Tubbs ve arkadaşlarının 2014 çalışmasına dayanır (FIPAT, 2019).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Sayılarla sinüsler',
      ogeler: [
        { deger: '7', aciklama: 'Bir klinik kaynağın saydığı büyük sinüs sayısı (Gray iki grupta daha çok sinüs sayar).' },
        { deger: '26,4', birim: 'cm', aciklama: 'Üst sagital sinüsün eğrisi boyunca ortalama uzunluğu (500 kişinin BT anjiyografisi).' },
        { deger: '19', aciklama: 'Bir erişkinde üst sagital sinüse açılan ortalama köprü toplardamarı sayısı (10 kadavra).' },
        { deger: '%46,7–50', aciklama: 'Türkiye’deki bir çocuk MR çalışmasında sinüs varyantı görülen çocukların oranı.' },
      ],
      not: 'Kaynaklar: Bayot ve ark. (2023); Gray (1918); Zhao ve ark. (2024); Juskys ve ark. (2022); Bingol ve Ozdemir (2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sağ mı, sol mu? Asimetri.** İki enine sinüs çoğu kez eşit değildir. Üst sagital sinüsün devamı olan daha büyüktür (Gray, 1918). Bu da genellikle sağdakidir. Bunun başlıca nedeni, üst sagital sinüsün kanının sağa yönelmesidir (Rai ve ark., 2018). 500 kişinin BT anjiyografisinde üst sagital sinüs 351 kişide sağa, 79 kişide sola sapıyordu; 70 kişide ortadaydı (Zhao ve ark., 2024).

Asimetri sık görülür. Nepal’de 109 erişkinin MR venografisi (toplardamarları gösteren MR) şunu buldu (Paudel ve ark., 2024):

- İki enine sinüs %73,4’ünde simetrikti.
- En sık varyant, sol enine sinüsün az gelişmesiydi (%18,35).
- Sol enine sinüs %2,75’inde hiç yoktu.

Az gelişmiş sinüse **hipoplastik**, hiç gelişmemiş sinüse **aplastik** sinüs denir. Türkiye’den bir çocuk çalışmasında da en sık varyant sol enine sinüsün az gelişmesiydi (Bingol ve Ozdemir, 2026). Ankara’dan bir çalışma ilginç bir ipucu buldu. Nörolojik yakınması olmayan 264 kişinin %27’sinde art kafa lopları sağa doğru bükülmüştü. Bu kişilerin %72’sinde sağ enine sinüs daha büyüktü (Arsava ve ark., 2019). Bu bilgi çalışmanın özetinden alındı.

Kemik de bu asimetriyi taşır. 70 kuru kafatasında enine sinüs oluğu solda %54,3, sağda %11,4 oranında yoktu (Cardona ve ark., 2024).`,
    },

    // ——— Lisans: köprü toplardamarları ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Köprü toplardamarları: sayı ve dağılım.** Gray’e göre üst beyin toplardamarları 8–12 tanedir. Yarımkürenin üst, yan ve iç yüzlerini boşaltır (Gray, 1918). Öndekiler sinüse dik açıyla açılır. Arkadaki büyük toplardamarlar ise öne doğru eğik uzanır. Sinüse, içindeki kan akımına az çok karşı yönde girerler (Gray, 1918). TA2 bunlara *venae superiores cerebri* der. “Köprü toplardamarı” için TA2’de ayrı bir terim yoktur (FIPAT, 2019).

Litvanya’da 10 kadavrada üst sagital sinüse açılan 191 köprü toplardamarı sayıldı. Kişi başına ortalama 19,1 ± 2,5 tane düşüyordu (12–28) (Juskys ve ark., 2022). Bu çalışma sinüsü kafatası üstündeki noktalara göre üç parçaya böldü. Nasion burun kökündeki çukurdur. Bregma ve lambda kafatasının tepesindeki dikiş birleşimleridir. Inion ense üstündeki kemik çıkıntıdır. Toplardamarların dağılımı şöyleydi (Juskys ve ark., 2022):

- nasion–bregma arası: %41,9,
- bregma–lambda arası: %53,3,
- lambda–inion arası: %4,7.

Ortalama çap sağda 1,4 ± 0,9 mm, solda 1,1 ± 0,8 mm idi (Juskys ve ark., 2022). Çin’de 500 kişinin BT anjiyografisinde her yanda ortalama 5,6 ± 1,5 köprü toplardamarı gövdesi sayıldı (Zhao ve ark., 2024). İki çalışma farklı şeyleri sayar. Biri kadavrada sinüse açılan bütün köprü toplardamarlarını sayar. Öbürü görüntüde seçilebilen ana gövdeleri sayar.

**Duvarın en ince yeri.** Bir köprü toplardamarının üç parçası vardır: örümcek ağı zarın altındaki parça, “subdural” parça ve sinüs duvarındaki parça (Ye ve ark., 2024). Duvar en ince yerinde, sert zarın sınır hücre katını geçerken tek kat endotele kadar inebilir (Nouri ve ark., 2021).

Kronik subdural kanama nerede başlar? Bir derlemeye göre ilk kanama köprü toplardamarının bu ince yerinden olur. Yazarlar bu görüşün genel kabul gördüğünü yazar (Nouri ve ark., 2021). Ama görüş tartışmalıdır. Bir başka derleme, bu kanın beyin kubbesi boyunca yayıldığını hatırlatır. Köprü toplardamarları ise orta hattaki sinüslerin yanındadır. Bu yüzden yayılım, köprü toplardamarından gelen bir kanamaya uymaz (Edlmann ve ark., 2017). Bu kanamada uzun süren bir iltihap vardır. Aynı derlemeye göre bu iltihabı başlatan, kanamanın kendisinden çok sınır hücrelerinin hasarı olabilir (Edlmann ve ark., 2017). Ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Yandan: üst sagital sinüsün bölümleri',
      aciklama:
        'Sol yandan bakıyoruz; ön taraf solda. Kafatası yarı saydam. Beyin loblara göre boyandı: mavi alın lobu, sarı yan kafa lobu, yeşil şakak lobu, pembe art kafa lobu. Etiketli presantral kıvrım (*gyrus precentralis*) yön bulmana yardım eder: merkez oluğun hemen önündeki kıvrımdır. Üst sagital sinüs modelde yoktur. Orta hatta, nasiondan inion’a uzanan çizginin altında yer alır. Köprü toplardamarlarının çoğu bregma ile lambda arasına açılır. Arkada çadırın dış kenarındaki enine sinüs oluğu ve sigmoid oluk görünür.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'sap', 'zar'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        bakis: 'sol',
        etiketler: [
          { yapi: 'presantral-girus-sol', metin: 'Presantral kıvrım' },
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
        ],
        noktalar: [
          { nokta: 'nasion', metin: 'Nasion' },
          { nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' },
          { nokta: 'yan-kafa-art-kafa-kosesi-sol', metin: 'Lambda' },
          { nokta: 'dis-art-kafa-cikintisi', metin: 'Inion' },
          { nokta: 'enine-sinus-olugu-sol', metin: 'Enine sinüs oluğu' },
          { nokta: 'sigmoid-olugu-sol', metin: 'Sigmoid oluk (yaklaşık)' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Köprü toplardamarları: sayı, tip ve duvar',
      sutunlar: ['Özellik', 'Değer', 'Örneklem ve yöntem', 'Kaynak'],
      satirlar: [
        ['Üst sagital sinüse açılan sayı (erişkin)', 'Ortalama 19,1 ± 2,5 (12–28)', '10 kadavra, Litvanya', 'Juskys ve ark. (2022)'],
        ['Her yanda ana gövde sayısı', '5,6 ± 1,5 (3–10)', '500 BT anjiyografi, Çin', 'Zhao ve ark. (2024)'],
        [
          'Beyin ile sert zar arası sayı (bebek)',
          'Beyin başına ortalama 54,1; en çok 94',
          '43 bebek ve küçük çocuk otopsisi',
          'Cheshire ve ark. (2018)',
        ],
        ['Çap (erişkin)', 'Sağda 1,4 ± 0,9 mm, solda 1,1 ± 0,8 mm', '10 kadavra', 'Juskys ve ark. (2022)'],
        ['Çap (bebek)', 'Ortalama 0,93 mm (0,05–3,07 mm)', 'Otopsi', 'Cheshire ve ark. (2018)'],
        [
          'Önceki çalışmalarda bildirilen çap',
          '1–7 mm; diseksiyonda seyrek olarak 0,1 mm’ye inen damarlar',
          'Çeşitli yöntemler (Cheshire’in aktardığı)',
          'Cheshire ve ark. (2018)',
        ],
        [
          'Rolando bölgesindeki köprü toplardamarının çapı',
          'Yaşlılarda 3,6 ± 0,8 mm, yaşlı olmayanlarda 3,9 ± 1,1 mm',
          '500 BT anjiyografi',
          'Zhao ve ark. (2024)',
        ],
        [
          'Büyük delik çevresinde',
          '57 hastanın 55’inde (%96) var; ortanca 2 tane (0–5); ortalama çap 0,6 mm (beyincik–soğan sisternası tipinde 0,8 mm)',
          'Üç boyutlu anjiyografi, çok merkezli',
          'Hiramatsu ve ark. (2024)',
        ],
        [
          'Tip A: sinüse doğrudan girer',
          '%52,17; duvar 238 ± 63 µm; ağzında kapakçık benzeri lifli kordonlar',
          '10 kadavra, 86 hasta',
          'Ye ve ark. (2024)',
        ],
        [
          'Tip B: sert zar duvarının altında bir süre ilerler',
          '%29,59; duvar 53 ± 34 µm (en ince); ağzında trabekül benzeri kordonlar',
          '10 kadavra, 86 hasta',
          'Ye ve ark. (2024)',
        ],
        [
          'Tip C: yan cep (venöz lakün) üzerinde ilerler',
          '%18,24; duvar 333 ± 77 µm; ağzında granülasyonlar',
          '10 kadavra, 86 hasta',
          'Ye ve ark. (2024)',
        ],
        [
          'Bebeklerde duvar',
          'Bazıları yalnızca 5–7 µm; çevredeki destek zarı yok ya da çok az',
          'Gözle ve mikroskopla inceleme',
          'Cheshire ve ark. (2024)',
        ],
      ],
      not: 'Tip A çoğunlukla bregmanın önünde ya da lambdanın arkasında, tip B ve C bregma ile lambda arasında bulunur (Ye ve ark., 2024). Cheshire ve ark. (2024) için yalnızca özet okundu. Sayılar yönteme göre değişir: kadavrada sinüse açılan bütün köprü toplardamarları, anjiyografide ise seçilebilen ana gövdeler sayılır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Emisser toplardamarlar.** Gray birkaçını adıyla verir (Gray, 1918):

- **Mastoid emisser toplardamar:** Genellikle vardır. Mastoid delikten geçer. Enine sinüsü kulak arkası ya da art kafa toplardamarına bağlar.
- **Parietal emisser toplardamar:** Yan kafa kemiğindeki delikten geçer. Üst sagital sinüsü kafa derisinin toplardamarlarına bağlar.
- **Kondiler emisser toplardamar:** Mastoid emisserle birlikte enine sinüsü kafatası dışındaki toplardamarlara bağlar.

TA2 bunlara *emissaria* der; *venae emissariae* eş anlamlısıdır (FIPAT, 2019). Kan bu kapakçıksız damarlarda iki yönde akabilir. Bir klinik kaynağa göre bu, kafa içi basıncın dengelenmesine ve beynin seçici soğutulmasına katkıda bulunur (Klein ve Bordoni, 2023). Emisser toplardamarlar çocuklukta daha sık bulunur, delikleri de daha geniştir (Klein ve Bordoni, 2023). Ameliyatta kanama ve pıhtı kaynağı olabilirler (Klein ve Bordoni, 2023).

**Diploik toplardamarlar** geniştir ve yer yer kese gibi genişlemeler gösterir. Duvarları incedir: elastik bir doku üstünde yalnızca endotel (Gray, 1918). Sert zarın toplardamarlarıyla, sinüslerle ve kafa derisinin toplardamarlarıyla bağlantılıdır (Gray, 1918).

**Venöz lakünler.** Sert zarın kendi toplardamarlarının birçoğu sinüse doğrudan açılmaz. Önce sinüsün yanındaki keselere dökülür. Bunlara **venöz lakünler** (yan cepler; *lacunae laterales*) denir. Özellikle üst sagital sinüsün orta kısmının iki yanında bulunurlar (Gray, 1918). Gray’e göre her yanda genellikle üç lakün vardır: küçük bir alın, büyük bir yan kafa ve ara büyüklükte bir art kafa lakünü (Gray, 1918). Lakünler enine ve düz sinüslerin yakınında da bulunur (Gray, 1918). TA2’nin notu ilginçtir: lakünleri “her anatomist bilir”, ama 1955 listesinde unutulmuşlardır (FIPAT, 2019). Yaşlılarda lakünler sık sık birleşir. Her yanda ince lifli bantlarla geçilen tek ve uzun bir yapı oluşturur (Zedde ve Pascarella, 2025b).

**Granülasyonlar sinüse açılır.** Örümcek ağı zarın küçük çıkıntıları sert zarı delerek sinüslere ve lakünlere uzanır. Bunlara **araknoid granülasyonlar** denir (Gray, 1918). Kadavraların üçte ikisinde görülürler; en çok üst sagital ve enine sinüste bulunurlar (Zedde ve Pascarella, 2025b). Bir derleme, 100 kişilik bir MR çalışmasını aktarır. Bu çalışmada granülasyonların yaklaşık %96’sının (431’in 414’ü) içine bir ya da daha çok toplardamar giriyordu (Zedde ve Pascarella, 2025b). Yapıları ve yaşla değişimleri “Örümcek ağı zar” bölümünde anlatılıyor.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sinüs anatomisi neden klinikte önemli?',
      md: `- **Pıhtı ve az gelişmiş sinüs.** Meksika’dan bir vaka–kontrol çalışmasında enine sinüsün az gelişmesi, aynı yandaki sinüs pıhtısıyla (trombozla) ilişkili bulundu (Arauz ve ark., 2018). Türkiye’den bir çocuk çalışmasında ise varyant sıklığı, pıhtısı olan ve olmayan çocuklarda benzerdi: %46,7 ve %50 (Bingol ve Ozdemir, 2026).
- **Yaralanma.** Sinüs yaralanmaları kafa travmasının en ağır sonuçlarındandır. Sinüsü tutan travmalarda ölüm oranının %40’ı aştığı tahmin edilir (Levin-Carrion ve ark., 2026). Cerrahi yönü “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.
- **Fistül.** Atardamarlar ile sinüsler arasında doğrudan kısa devreler oluşabilir. Bunlara sert zar atardamar-toplardamar fistülü denir (Heit ve ark., 2017). En sık yeri enine ve sigmoid sinüsün birleştiği yerdir; solda biraz daha sıktır (Zyck ve ark., 2023). Ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.
- **Enfeksiyon yolu.** Kapakçıksız emisser toplardamarlar, kafatası dışındaki bir enfeksiyonun kafa içine ilerlemesi için yol olabilir (Klein ve Bordoni, 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'MR’da sinüs: pıhtı sanılabilecek normal görüntüler',
      md: `MR venografide sinüsün kanla dolu görünmesi gereken bir yerde boşluk gibi duran alana **dolma kusuru** denir. Pıhtı böyle görünebilir. Ama aşağıdaki normal durumlar da böyle görünebilir:

- **Akım boşlukları ve az gelişmiş sinüs.** Erzurum’da 105 normal MR’da, enine sinüste akım boşluğu ya da aplazi toplumun yaklaşık %24’ünde görülebilirdi. Bunlar pıhtı sanılabilir (Alper ve ark., 2004).
- **Yönteme bağlı kusurlar.** Muğla’da 136 hastada faz kontrast MR venografi kullanıldı. Hastaların %27,2’sinde fizyolojik dolma kusuru görüldü. Çoğu enine sinüsün orta kısmındaydı (Doğan ve Apaydın, 2022). Bu kusurlar yokluk ya da pıhtı sanılabilir (Doğan ve Apaydın, 2022). Aynı yöntem alt sagital sinüsü hastaların yalnızca %41,2’sinde gösterdi. Oysa bu sinüs anatomik olarak hemen herkeste vardır (Doğan ve Apaydın, 2022).
- **Granülasyonlar.** Pıhtı genellikle bir sinüs bölümünün tamamını tutar. Granülasyon ise odaklı, sınırları belli, düğüm gibi bir kusur yapar (Ayaz ve ark., 2017). Enine sinüste en sık yeri, sinüsün orta ve dış üçte birinin birleşimidir. Burası yüzeyel toplardamarların girdiği yerin yakınıdır (Ayaz ve ark., 2017). Dev granülasyonlar “Örümcek ağı zar” bölümünde.

Sinüsün biçimi de bir ipucu verir. Kafa içi basıncı düştüğünde sinüsler genişleyip yuvarlaklaşabilir. Bu, düşük basıncın tipik bulgularındandır (Patel ve ark., 2024). Ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Yer:** Sinüsler sert zarın endosteal ve meningeal katları arasındadır. Endotelle döşelidir; kapakçık ve kas tabakası yoktur.
- **Gray’in iki grubu:** üst-arka grup (üst sagital, alt sagital, düz, iki enine, oksipital). Ön-alt grup (kavernöz, interkavernöz, üst ve alt petrozal, baziler pleksus).
- **Üst sagital sinüs** orağın tutunan kenarında; kesiti üçgen; genellikle sağ enine sinüse devam eder. **Düz sinüs** orak–çadır birleşiminde; alt sagital sinüsü ve Galen venini alır; genellikle sol enine sinüse gider.
- **Enine sinüs** çadırın tutunan kenarında; **üst petrozal sinüs** çadırın şakak kemiğine tutunan kenarında.
- **Kavernöz sinüs:** iç karotis ve VI sinüsün içinden geçer; yan duvarda III, IV, V1, V2.
- **Köprü toplardamarları:** erişkinde üst sagital sinüse ~19; en çok bregma–lambda arası. Duvar en ince yerinde sınır hücre katında.
- **Emisser:** mastoid, parietal, kondiler; kapakçıksız, iki yönlü akım.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Enine sinüste bir boşluk',
      oyku: `27 yaşında bir kadın, birkaç aydır ara ara olan baş ağrısı nedeniyle MR’a giriyor. Beyin dokusu normal. MR venografide sağ enine sinüs geniş ve düzgün. Sol enine sinüs ise ince; orta kısmında kısa bir bölümde akım görünmüyor. Ayrıca sağ enine sinüsün içinde, sınırları belli, birkaç milimetrelik yuvarlak bir boşluk var.`,
      soru: 'Bu görüntülerin her biri pıhtı mı demektir? Hangi normal yapılar böyle görünebilir?',
      cozum: `**Sol enine sinüsteki incelik ve akım boşluğu.** Sol enine sinüsün az gelişmesi en sık sinüs varyantıdır. Nepal’de 109 erişkinin %18,35’inde görüldü (Paudel ve ark., 2024). Erzurum’daki bir çalışmaya göre, enine sinüste akım boşluğu ya da aplazi normal toplumun yaklaşık %24’ünde görülebilir. Bunlar pıhtı sanılabilir (Alper ve ark., 2004). Faz kontrast yöntemi enine sinüsün orta kısmında fizyolojik dolma kusurları da yapabilir (Doğan ve Apaydın, 2022).

**Sağ enine sinüsteki yuvarlak boşluk.** Pıhtı genellikle bir sinüs bölümünün tamamını tutar. Granülasyon ise odaklı, sınırları belli, düğüm gibi bir kusur yapar. Enine sinüste en sık yeri, sinüsün orta ve dış üçte birinin birleşimidir (Ayaz ve ark., 2017).

**Sonuç.** Görüntüler normal varyantlara uyabilir. Ama ayırım her zaman öykü, muayene ve gerekirse ek görüntülemeyle yapılır. Kararı hekim verir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Uzman: duvar, ölçüler, varyasyonlar, tartışmalar ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Duvarın iç yapısı ve dayanıklılığı.** Domuz sinüslerinde duvarın %84–94’ü kolajenden oluşur (Walsh ve ark., 2020). Aynı çalışmada boyuna esneklik katsayısı 33–58 MPa ölçüldü. Bu değer sinüslerin çevredeki sert zardan daha katı olduğunu gösterir (domuz) (Walsh ve ark., 2020). İnsan üst sagital sinüsünde daha önce ölçülen kolajen oranı ise yaklaşık %60’tır. Yazarlar farkı yöntem farkına bağlar (Walsh ve ark., 2020).

Arka kafa çukurunda 59 insan sinüsü mikroskopla incelendi. Kemiğe bakan duvar en kalın sinüslerin birleşim yerindeydi. En ince ise juguler bulbusta ve sigmoid sinüsteydi (Balik ve ark., 2019). Bu bilgi yalnızca çalışmanın özetinden alındı.

**Willis bantları.** Gray, üst sagital sinüsün alt açısında enine uzanan çok sayıda lifli bant tarif eder. Düz sinüsün içinde de birkaç enine bant vardır (Gray, 1918). Bir derleme bu bantları üç ana türe ayırır. En sık olanlar kapakçık benzeri bantlardır (%45–49); üst beyin toplardamarlarının ağızlarını örterler. Boyuna levhalar bantların %20–23’ünü oluşturur. Üst sagital sinüsün içini iki ya da üç kanala bölerler (Zedde ve Pascarella, 2025b).

**Köprü toplardamarının sinüse girdiği yer.** Mikroskop altında bu birleşimde üç şey görülür (Ye ve ark., 2024):

- toplardamarın endoteli, sinüsün endotelinin ötesine uzanır,
- kolajen liflerinin yönü değişir,
- toplardamarın içi daralır ve ovalleşir.

Köprü toplardamarının duvarı düzenli dizilmiş dalgalı kolajenden yapılır. Sinüsün duvarı ise sıkı ve tabakalıdır (Ye ve ark., 2024).

**Sinüs duvarı edilgen bir boru değildir.** Bir derlemeye göre sinüs duvarı, sert zara gömülü, endotelle döşeli bir doku ortamıdır. Bu ortam, antijenlerin örneklenmesini ve bağışıklık hücrelerinin etkileşimini destekler (Chirica ve ark., 2026). Bu bilginin bir kısmı fare çalışmalarına dayanır (Rustenhoven ve ark., 2021). Ayrıntısı “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sinüslerin ölçüleri: yönteme göre',
      sutunlar: ['Ölçü', 'Değer', 'Örneklem ve yöntem', 'Kaynak'],
      satirlar: [
        ['Üst sagital sinüs uzunluğu', '26,4 ± 2,6 cm (14,3–33,4)', '500 kişi, BT anjiyografi, Çin', 'Zhao ve ark. (2024)'],
        [
          'Üst sagital sinüs genişliği (ortanca)',
          'Nasion–bregma ortası 7,3; bregma 10,2; lambda 13; inion 15,6 mm',
          '10 kadavra, Litvanya',
          'Juskys ve ark. (2022)',
        ],
        [
          'Üst sagital sinüs genişliği',
          'Bregma 5,2 ± 1,2; lambda 8,6 ± 1,3; inion 7,7 ± 1,5 mm',
          '500 BT anjiyografi',
          'Zhao ve ark. (2024)',
        ],
        ['Üst sagital sinüs çapı', '6,4 ± 1 mm', '109 erişkin, MR venografi, Nepal', 'Paudel ve ark. (2024)'],
        ['Üst sagital sinüs genişliği', '6,73 ± 2,34 mm', '15 kadavra, Kırşehir', 'Kamaşak Arpaçay ve Aycan (2026)'],
        ['Üst sagital sinüs çapı', '4,8 ± 0,6 mm', '67 sağlıklı kişi, MR, Sakarya', 'Tunç ve ark. (2024)'],
        ['Üst sagital sinüs çapı (derleme)', '3,0–4,5 mm', 'Literatür derlemesi', 'Zedde ve Pascarella (2025b)'],
        ['Düz sinüs uzunluğu', '51 ± 5,2 mm', '108 kontrol olgu (Hasegawa ve ark.)', 'Zedde ve Pascarella (2025b)'],
        ['Düz sinüs çapı', '3 ± 0,8 mm; 4 ± 0,7 mm', 'MR venografi (Nepal); MR (Sakarya)', 'Paudel ve ark. (2024); Tunç ve ark. (2024)'],
        ['Enine sinüs çapı ya da genişliği', 'Sol 5,1 ± 1,3, sağ 5,9 ± 1 mm', 'MR venografi, Nepal', 'Paudel ve ark. (2024)'],
        ['Enine sinüs genişliği', 'Sol 5,71 ± 2,45, sağ 5,33 ± 2,05 mm', '15 kadavra, Kırşehir', 'Kamaşak Arpaçay ve Aycan (2026)'],
        ['Enine sinüs çapı', 'Sağ 4,8 ± 1,4, sol 3,7 ± 1,4 mm', '67 sağlıklı kişi, MR, Sakarya', 'Tunç ve ark. (2024)'],
        ['Enine sinüs uzunluğu', 'Sol 78,3 ± 10,2, sağ 72,9 ± 9,2 mm', '100 sağlıklı kişi, 3T MR venografi, Çin', 'Zhou ve Yu (2024)'],
        ['Enine sinüs başlangıç çapı', 'Sol 6,4 ± 2,8, sağ 7,9 ± 2,1 mm', '3T MR venografi', 'Zhou ve Yu (2024)'],
        [
          'Enine ve sigmoid sinüs uzunluğu',
          'Enine 60,2 mm, sigmoid 55,1 mm; en dar kesit enine sinüsün ortasında (21,3 mm²)',
          'Üç boyutlu dönen venografi',
          'Anand ve ark. (2022)',
        ],
        ['Sigmoid sinüs sonu (juguler bulbus) çapı', 'Sol 5,9 ± 1,9, sağ 7,3 ± 1,9 mm', '3T MR venografi', 'Zhou ve Yu (2024)'],
        [
          'Sigmoid sinüs derinliği ve genişliği',
          'Sağ 6,57 ± 1,73 ve 14,55 ± 4,06 mm; sol 6,33 ± 1,52 ve 15,18 ± 4,93 mm',
          '241 hastanın şakak kemiği BT’si (iki yan), Kocaeli',
          'Medişoğlu ve Öçbe (2026)',
        ],
        ['Kavernöz sinüs', 'Yaklaşık 1 cm genişlik, 2 cm uzunluk', 'Klinik kaynak', 'Ngnitewe Massa ve ark. (2023)'],
        ['Birleşim açıları', 'Üst sagital–enine 116°; enine–sigmoid 108° (içten) ve 114° (üstten)', 'Kadavra', 'Cardona ve ark. (2025)'],
      ],
      not: 'Ölçüm yeri ve yöntemi verilmeden tek bir sayı kullanılmamalı. Derlemedeki 3,0–4,5 mm’lik üst sagital sinüs çapı, doğrudan ölçümlerin hepsinden küçüktür. Kırşehir kadavra çalışmasında sol enine sinüs ortalamada sağdan genişti; bu çalışmanın örneklemi küçüktür (15 kadavra). Sakarya’daki MR çalışmasında ise sağ enine sinüs hem sağlıklılarda hem hastalarda soldan genişti (Tunç ve ark., 2024). Kocaeli BT çalışmasında sol sigmoid sinüs sağdan anlamlı olarak genişti; derinlik farkı yoktu (Medişoğlu ve Öçbe, 2026). Ngnitewe Massa ve ark. (2023) için yalnızca özet okundu.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sinüslerin birleşme düzeni: sınıflamalar',
      sutunlar: ['Çalışma ya da sınıflama', 'Örneklem', 'En sık düzen', 'Not'],
      satirlar: [
        [
          'Fukusumi (derlemede)',
          '—',
          'Üst sagital sinüs tümüyle sağ enine sinüse açılır: %44,2',
          'Dört sinüsün tam birleştiği “gerçek birleşim” yalnızca %20',
        ],
        ['Singh (derlemede)', '—', 'Sağ baskın tip: %41', 'Üst sagital sinüs yalnızca sağ enine sinüse açılır'],
        [
          'Kobayashi (derlemede)',
          '—',
          'Üst sagital, düz ve enine sinüslerin birleşmesi: %32,7',
          'Üst sagital sinüsün tümüyle sağ enine sinüse gitmesi: %31,5',
        ],
        ['Woodhall (derlemede)', '—', 'Ağ (pleksiform) tipi: %56', 'İki yan arasında birden çok kanal bağlantı kurar'],
        ['Browder ve Kaplan (derlemede)', '—', 'Sağ enine sinüs baskın: %33', 'Eşit %16, sol baskın %8'],
        ['Surendrababu (derlemede)', '—', 'Birleşim yerine (torkula) açılır: %46', 'Sağ enine sinüse %39, sol enine sinüse %15'],
        [
          'Nepal MR venografi',
          '109 erişkin',
          'Gerçek birleşim (tip III): %65,14',
          'Düz sinüs %65,1 birleşim yerine, %18,3 sol enine sinüse açılır',
        ],
        [
          'Kırşehir kadavra',
          '15 kadavra, 60–76 yaş',
          'Birleşim yeri dört sinüsten (üst sagital, iki enine ve oksipital sinüs) oluşur: %46,66',
          'Birleşim yeri %20’de yok; yerinde üçgen bir sert zar parçası görülebilir',
        ],
      ],
      not: 'Kaynaklar: Zedde ve Pascarella (2025b) (Fukusumi, Singh, Kobayashi, Woodhall, Browder ve Kaplan, Surendrababu); Paudel ve ark. (2024) (Fukusumi’nin %20’lik gerçek birleşim oranı ve Nepal verisi); Kamaşak Arpaçay ve Aycan (2026). Kırşehir çalışmasının yazarları sade bir sınıflama önerir: tip I tam birleşim, tip II kısmi birleşim, tip III birleşim yok (sinüsler ayrı ya da başka yollarla boşalır). “Gerçek birleşim” oranının %20 ile %65 arasında değişmesinin nedeni tanım ve yöntem farkıdır. Nepal çalışması tip III’ü yalnızca “gerçek birleşim” diye adlandırır, ayrıntılı tanımlamaz. “Dört sinüs” sözü de her çalışmada aynı sinüsleri anlatmaz. Paudel’in aktardığına göre Fukusumi gerçek birleşimde dört sinüsün birleştiğini yazar. Kırşehir çalışması ise dört sinüs olarak üst sagital, iki enine ve oksipital sinüsü sayar.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Varyasyonlar ne sıklıkta?',
      sutunlar: ['Varyasyon', 'Sıklık', 'Örneklem ve yöntem', 'Kaynak'],
      satirlar: [
        ['Sol enine sinüs: az gelişmiş / yok', '%18,35 / %2,75', '109 erişkin, MR venografi', 'Paudel ve ark. (2024)'],
        ['Sağ enine sinüs: az gelişmiş / yok', '%4,59 / %0,92', '109 erişkin, MR venografi', 'Paudel ve ark. (2024)'],
        ['Sol enine sinüs: yok / az gelişmiş', '%20 / %39 (simetrik %31)', '105 normal MR, TOF venografi, Erzurum', 'Alper ve ark. (2004)'],
        ['Sağ enine sinüs: yok / az gelişmiş', '%4 / %6', '105 normal MR, TOF venografi, Erzurum', 'Alper ve ark. (2004)'],
        [
          'Sağ enine sinüs: görülmedi / az gelişmiş',
          '10 olgu (%4,73) / 37 olgu (%17,53)',
          '211 hasta, faz kontrast MR venografi, Hatay',
          'Bayaroğulları ve ark. (2018)',
        ],
        [
          'Sol enine sinüs: görülmedi / az gelişmiş',
          '26 olgu (%12,32) / 85 olgu',
          '211 hasta, faz kontrast MR venografi, Hatay',
          'Bayaroğulları ve ark. (2018)',
        ],
        ['Enine sinüs oluğu yok', 'Solda %54,3, sağda %11,4', '70 kuru kafatası (140 taraf)', 'Cardona ve ark. (2024)'],
        ['Oksipital sinüs var', '%13,8 (Nepal); çocuklarda %18; Fukusumi’de %57,5', 'MR venografi ve literatür', 'Paudel ve ark. (2024)'],
        ['Oksipital sinüs yok', '%26,66', '15 kadavra, Kırşehir', 'Kamaşak Arpaçay ve Aycan (2026)'],
        ['Eğik oksipital sinüs', '%2 (önce %7 sanıldı)', '100 hasta, görüntüleme', 'Senger ve ark. (2026)'],
        ['Düz sinüs ikili', '%13,85', '43 kadavra (Saxena ve ark.)', 'Zedde ve Pascarella (2025b)'],
        ['Alt sagital sinüs yok', '76 olgunun 1’inde', 'Saxena ve ark.', 'Zedde ve Pascarella (2025b)'],
        ['Alt sagital sinüs görülmedi', '500 kişinin 249’unda; yaşla giderek kapanıyor', 'BT anjiyografi', 'Zhao ve ark. (2024)'],
        ['Üst sagital sinüsün ön kısmı az gelişmiş', '%7', '100 hasta', 'Zedde ve Pascarella (2025b)'],
        ['Belirgin sfenoparietal sinüs', 'Tarafların %70’i', '10 kadavra başı (20 taraf)', 'Posey ve ark. (2023)'],
        ['Çadır sinüsleri', '%86', '80 kadavra (Muthukumar ve Palaniappan)', 'Zedde ve Pascarella (2025b)'],
        ['Alt interkavernöz sinüs', '%17', 'Tubbs ve ark. 2014 (TA2 notunda)', 'FIPAT (2019)'],
        ['Alt petrozal sinüs kesintisiz', '200 tarafın %59,5’i', '3T MR venografi', 'Zhou ve Yu (2024)'],
      ],
      not: 'Hatay çalışmasının özetinde sol enine sinüsün az gelişmesi için “85 olgu (%49,09)” yazar. 85/211 aslında yaklaşık %40 eder; bu yüzden yalnızca olgu sayısı verildi (Bayaroğulları ve ark., 2018). Alper ve ark. (2004) ile Bayaroğulları ve ark. (2018) için yalnızca özet okundu. Oranların bu kadar farklı olmasının nedenleri: yöntem (kadavra, BT, farklı MR teknikleri), “az gelişmiş” tanımı ve örneklem. Örneğin bir çalışma az gelişmiş enine sinüsü, çapı üst sagital sinüsün uç kısmının yarısından küçük olan sinüs diye tanımlar (Arauz ve ark., 2018).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Sfenoparietal sinüs gerçekten var mı?** Gray ve TA2 onu kavernöz sinüse açılan bir sinüs olarak verir (Gray, 1918; FIPAT, 2019). Eponim adı Breschet’tir. Breschet 1829 atlasında onu çizdi ama metinde açıkça tanımlamadı. Cruveilhier 1852’de onu kavernöz sinüse boşalan bir toplayıcı olarak tanımladı (Serioli ve ark., 2026).

San Millán Ruíz ve arkadaşları 2004’te 15 örnek inceledi. Onlara göre sfenoparietal sinüs iki ayrı yapının yapay birleşimidir. Biri orta meningeal toplardamarların ön dalının bir parçasıdır. Öbürü küçük kanadın altındaki bir sert zar kanalıdır. Yazarlar, yüzeyel orta beyin toplardamarının bu sinüse açıldığı bilgisini “hatalı” bulur (San Millán Ruíz ve ark., 2004). Bu bilgiler yalnızca özetten alındı.

2023’te 10 kadavra başında (20 taraf) yapılan bir çalışma farklı sonuç verdi. Tarafların %70’inde belirgin bir sfenoparietal sinüs bulundu. Hepsi kavernöz sinüse açılıyordu (Posey ve ark., 2023). Dokusu incelenen örneklerin %85’i bir toplardamar değil, sinüs yapısındaydı (Posey ve ark., 2023). 2026 tarihli bir yazı iki görüşü uzlaştırmayı önerir. Ona göre iki yapı arasındaki bağlantı seyrek bir varyant olabilir. Ya da yalnızca hastalıkta işlev kazanan “olası” bir bağlantı olabilir (Serioli ve ark., 2026).

**Kavernöz sinüsün duvarları.** Yan duvar iki katlı bir sert zar kıvrımıdır. Cerrah, sinüse girmeden bu iki kat arasından ilerleyebilir (Mosteiro ve ark., 2024). İç duvar ise birçok kitaptakinin aksine sert zar değildir. Hipofize bakan bu duvar lifli bir dokudur: hipofizin kapsülü (Ishikawa ve ark., 2026). Kavernöz sinüsün içindeki toplardamar kanallarının endoteli vardır ama düz kas katı yoktur (Toma, 2020). Kafa sinirleri sinüse girerken meningeal katı delmez; onu yanlarında taşıyarak sinüsün içine girinti yapar (Ishikawa ve ark., 2026). Bir görüşe göre bu alan, gerçek bir sert zar içi aralıktan çok omurilikteki epidural boşluğa benzer (Ishikawa ve ark., 2026).

**Çadır sinüsleri.** Çadırın içinde uzanan her toplardamar kanalına çadır sinüsü denir (Mori ve ark., 2026). Bir derlemeye göre iç gruptakiler orta hattan 1,5–2,5 cm, enine sinüsten 1,0–2,5 cm uzaktadır. Dış gruptakiler orta hattan 3–4 cm, enine sinüsten 2–10 mm uzaktadır (Rai ve ark., 2018). Seyrek bir düzende ise bir kabuk toplardamarı çadır üstündeki sert zara paralel uzanır. Sonra sert zara girer ve enine sinüse açılır (Mizushima ve ark., 2026).

**Gelişim.** Sinüslerin gelişimi kıvrımlara bağlıdır. Çadır yataylaştıkça enine sinüs de erişkindeki enine konumunu alır (Ishikawa ve ark., 2026). Derindeki sagital toplardamar ağı alt sagital sinüse, yüzeydeki üst sagital sinüse dönüşür. Yaklaşık 11. haftada sırttaki sinüsler erişkin düzenine benzer (Ishikawa ve ark., 2026). Bir fetüs çalışmasının özetine göre 10–16. haftalarda düz sinüs, iki yandan gelen yumuşak zar toplardamarlarının birleşmesiyle başlar. Bu dönemde üst sagital sinüs az gelişmiştir; alt sagital sinüs henüz yoktur (Oyanagi ve ark., 2021). Bir görüşe göre enine sinüsler hızla genişlerken sigmoid sinüs ve iç juguler toplardamar aynı ölçüde genişlemez. Oksipital ve marjinal sinüsler bu yüzden oluşur (Hosapatna ve ark., 2024). Kavernöz sinüs ise trigeminal gangliyonun iç yanındaki ağsı kanallardan gelişir (Toma, 2020).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den sinüs ve köprü toplardamarı çalışmaları',
      sutunlar: ['Yer', 'Örneklem ve yöntem', 'Ana bulgu', 'Kaynak'],
      satirlar: [
        [
          'Kırşehir (Ahi Evran Üniversitesi)',
          '15 kadavra, 60–76 yaş',
          'Birleşim yeri %20’de yok; sade bir birleşim sınıflaması önerildi',
          'Kamaşak Arpaçay ve Aycan (2026)',
        ],
        [
          'Ankara (Hacettepe Üniversitesi)',
          '264 nörolojik yakınması olmayan kişi',
          'Art kafa lobunun bükülme yönü, baskın enine sinüsün yanını %70–72 öngördü',
          'Arsava ve ark. (2019)',
        ],
        [
          'Erzincan ve Ankara',
          '124 çocuk (62 pıhtılı, 62 kontrol), MR venografi',
          'Varyant sıklığı iki grupta benzer (%46,7 ve %50); en sık sol enine sinüsün az gelişmesi',
          'Bingol ve Ozdemir (2026)',
        ],
        ['Sakarya', '67 sağlıklı kişi ve 79 multipl skleroz hastası, MR', 'Hastalarda sinüs çapları daha büyük', 'Tunç ve ark. (2024)'],
        [
          'Kocaeli',
          '241 hastanın şakak kemiği BT’si (iki yan)',
          'Sol sigmoid sinüs sağdan geniş; yaşla sol sigmoid sinüs daha içe yerleşiyor',
          'Medişoğlu ve Öçbe (2026)',
        ],
        ['İstanbul (Kartal)', '52 kuru kafatası', 'Enine oluğun başlangıç genişliği sağda 6,43, solda 6,15 mm', 'Suslu ve ark. (2010)'],
        [
          'İstanbul (Bahçeşehir ve İstanbul Medeniyet üniversiteleri)',
          '30 kadavra başı',
          'Sinüs olukları çap ve orta hatta uzaklık bakımından asimetrik',
          'El Youssef ve ark. (2024)',
        ],
        ['Erzurum (Atatürk Üniversitesi)', '105 normal MR', 'Enine sinüste akım boşluğu ya da aplazi ~%24', 'Alper ve ark. (2004)'],
        [
          'Hatay (Mustafa Kemal Üniversitesi)',
          '211 hasta, MR venografi',
          'Sağ enine sinüs 10, sol enine sinüs 26 olguda görülmedi',
          'Bayaroğulları ve ark. (2018)',
        ],
        [
          'Muğla (Sıtkı Koçman Üniversitesi)',
          '136 hasta, faz kontrast MR venografi',
          'Fizyolojik dolma kusuru %27,2; alt sagital sinüs yalnızca %41,2’de görüldü',
          'Doğan ve Apaydın (2022)',
        ],
        [
          'Ankara',
          '300 hasta, kontrastlı 3B T1 MR',
          '889 granülasyon: 265 üst sagital, 222 sol enine, 185 düz, 183 sağ enine sinüste, 34 birleşim yerinde',
          'Kaplanoğlu ve ark. (2023)',
        ],
        [
          'Alanya',
          '154 kişi, MR venografi',
          'Üst bağlantı toplardamarı (Trolard) sağ yarımkürelerin %88,3’ünde, sol yarımkürelerin %76,6’sında görüldü',
          'Ozkal ve ark. (2025)',
        ],
      ],
      not: 'Arsava ve ark. (2019), Suslu ve ark. (2010), El Youssef ve ark. (2024), Alper ve ark. (2004), Bayaroğulları ve ark. (2018), Doğan ve Apaydın (2022) ve Ozkal ve ark. (2025) için yalnızca özet okundu.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sinüsler ve köprü toplardamarları çevresinde cerrahi',
      md: `- **Üst sagital sinüs orta hatta durmaz.** Litvanya kadavralarında sinüs çoğu olguda orta hattan sapıyordu. Sapma lambdanın önünde 13 mm’ye, birleşim yeri bölgesinde 20 mm’ye kadar çıktı (Juskys ve ark., 2022). Köprü toplardamarlarının sert zara giriş noktaları nasion–bregma bölümünde orta hattan 33,6 mm’ye kadar uzaklaşabiliyordu. Arkaya doğru orta hatta yaklaşıyordu: ortalama 10,9 mm (nasion–bregma), 7,3 mm (bregma–lambda), 1,6 mm (lambda–inion) (Juskys ve ark., 2022).
- **Yarımküreler arası yaklaşımlar.** Bu ameliyatlarda köprü toplardamarı zarar görebilir. Bu, kanamaya, toplardamar kaynaklı beyin hasarına (venöz enfarkt) ya da yarım felce yol açabilir (Ye ve ark., 2024). En ince duvarlı tip B, bregma ile lambda arasında toplanır (Ye ve ark., 2024).
- **Venöz lakünler.** 20 kadavranın 40 yarımküresinde, koronal dikiş ile postsantral oluk arasındaki toplardamarların çoğu önce bir venöz laküne açılıyordu. Trolard toplardamarlarının %73’ü de böyleydi (Karatas ve ark., 2024). Koronal dikişin önünde en sık düzen, tek toplardamarın doğrudan sert zara açılmasıydı (%57) (Karatas ve ark., 2024). Bu bilgiler yalnızca özetten alındı.
- **Kafa–boyun birleşimi.** Büyük delik çevresinde köprü toplardamarları hastaların %96’sında vardı (Hiramatsu ve ark., 2024). Bu bölgede altı köprü toplardamarı grubu tanımlandı. En büyükleri sigmoid sinüse ve suboksipital kavernöz sinüse bağlanır (Miyauchi ve ark., 2024).
- **Enine sinüsün yeri.** İstanbul’dan bir kafatası çalışması orta hattan beyinciğin üstüne yapılan yaklaşımı inceledi. Ona göre ilk delik alt ense çizgisinin yaklaşık 1 cm altına açılırsa enine sinüse zarar verilmez (Suslu ve ark., 2010).
- **Kavernöz sinüs.** Yan duvarın iki katı arasından sinüse girmeden ilerlenebilir (Mosteiro ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sinüs kenarındaki sert zar: BOS nereden çıkıyor?',
      md: `Ders kitapları BOS’un granülasyonlardan sinüslere süzüldüğünü yazar (OpenStax 13.3). Bu görüş, 1914’te Lewis Weed’in çalışmasıyla yerleşti (Proulx, 2021). Bugün tartışmalıdır.

- **Granülasyonu olmayanlar.** Zagreb’de 120 kişinin MR’ında yenidoğanların ve 2 yaşındakilerin %85’inde sinüslerde görünür granülasyon yoktu. Yazarlara göre, BOS sistemi normal olan pek çok kişide granülasyon olmaması, granülasyonların temel rolünü sorgulatır (Radoš ve ark., 2021).
- **Anatomik boşluk.** Bir derlemeye göre anatomi çalışmaları, gözlenen serbest BOS çıkışını açıklayacak bir yapıyı sinüslere uzanırken henüz gösteremedi (Proulx, 2021).
- **Parasagital sert zar.** 18 kişide BOS’a verilen izleyici madde, üst sagital sinüs boyunca sinüsün yanındaki sert zara geçti. Bu geçiş, kabuk toplardamarlarının sinüse girdiği yerlerin yakınındaydı (Ringstad ve Eide, 2020). Bu sert zarda lakünlere birleşen bir kanal ağı vardır. Yazarlara göre burası beyin ile sert zarın lenf damarları arasında bir köprü olabilir (Ringstad ve Eide, 2020).
- **Sert zar içi kanallar.** 8 kadavra başında bazı granülasyonlar sinüse doğrudan açılmıyordu. Lenf damarı işaretleriyle boyanan sert zar içi kanallarla toplardamar dolaşımına bağlanıyordu (Yağmurlu ve ark., 2022). Bu bilgi yalnızca özetten alındı.
- **Sinüs çapı ve hastalık.** Sakarya’daki bir MR çalışmasında multipl skleroz hastalarında sinüs çapları kontrollerden büyüktü (Tunç ve ark., 2024). Bu bir ilişkidir; neden-sonuç değildir.

Bu sorular henüz kapanmadı. BOS’un emilimi “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak. Lenf damarları “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Yarımküreler arasından girmeden önce',
      oyku: `Bir beyin cerrahisi ekibi, nasırlı cismin üstüne yarımküreler arasından ulaşmayı planlıyor. Giriş, bregmanın birkaç santimetre arkasından olacak. Ameliyat öncesi toplardamar görüntülemesinde bu bölgede üst sagital sinüse açılan üç köprü toplardamarı görülüyor. Biri sinüse doğrudan giriyor gibi. Öbür ikisi sinüsün yan duvarı boyunca bir süre ilerliyor.`,
      soru: 'Bu bölgedeki köprü toplardamarları hakkında anatomi ne söyler? Ekip hangi riskleri göz önüne almalıdır?',
      cozum: `**Yoğunluk.** Köprü toplardamarlarının yarıdan fazlası (%53,3) bregma ile lambda arasında sinüse açılır (Juskys ve ark., 2022). Giriş noktaları orta hattan uzakta olabilir. Bregma–lambda bölümünde bu uzaklık ortalama 7,3 mm’dir (Juskys ve ark., 2022).

**Tip ve duvar.** Sinüs duvarının altında bir süre ilerleyen toplardamarlar tip B’dir. Tip C ise sinüsün yan cebi üzerinde ilerler. Tip B ve C bregma ile lambda arasında toplanır (Ye ve ark., 2024). Tip B’nin duvarı en incedir: 53 ± 34 µm (Ye ve ark., 2024). Bu bölgede toplardamarların çoğu önce bir venöz laküne de açılabilir (Karatas ve ark., 2024).

**Risk.** Köprü toplardamarı hasarı kanama, toplardamar kaynaklı beyin hasarı ya da yarım felçle sonuçlanabilir (Ye ve ark., 2024). Bu yüzden toplardamarların yeri ve tipi, yaklaşım planının önemli bir parçasıdır. Kararı ve yöntemi cerrahi ekip belirler. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
