import type { DersBolumu } from '../../../types';

/** Sahne renkleri (yalnızca tanıtır; iyi ya da kötü anlamı yoktur). İlk dersteki renklerle aynıdır. */
const HAREKET = '#e5484d';
const DUYU = '#4f8de0';
const BROCA = '#f2b544';
const ISITME = '#25b98f';
const YAN_KARINCIK = '#4f8de0';
const MONRO = '#f2b544';
const UCUNCU = '#25b9a3';
const SU_YOLU = '#8a6fd8';
const DORDUNCU = '#ee6a92';

/**
 * 08. bölüm: kafanın dışından beyni bulmak. Kafatası noktaları yalnızca başvuru (adres) olarak kullanılır; konu beyindir:
 * oluk ve lobların kafa üzerindeki izdüşümü (Gray 1918, Taylor–Haughton, doğrulukları), karıncığa giriş noktaları ve
 * doğrulukları, EEG 10–20 sistemi ve elektrotların altındaki kabuk, TMS'de hedef bulma, Türkiye'den çalışmalar.
 */
export const yuzeydenBeyin: DersBolumu = {
  id: 'yuzeyden-beyni-bulmak',
  baslik: 'Kafanın dışından beyni bulmak',
  bloklar: [
    // ——— 1. Adresler ve kafadan beyne izdüşüm ———
    {
      tur: 'metin',
      md: `Beyni dışarıdan göremeyiz. Ama çoğu zaman yerini dışarıdan bulmak zorundayız. Beyin cerrahı kafatasını doğru yerden açmak ister. **EEG** (beyin dalgalarını kafa derisinden kaydeden yöntem) çeken kişi, elektrotları herkeste aynı bölgenin üstüne koymak ister. **TMS** (kafaya tutulan bir mıknatıs bobiniyle kabuğu uyaran yöntem) uygulayan hekim de bobini doğru kıvrımın üstüne tutmalıdır. Hepsinin sorusu aynıdır: Kafanın dışındaki bu nokta, beynin hangi yapısının üstünde?

Bu ilişkiye **kafa–beyin izdüşümü** (kraniyoserebral topografi) denir. Kafatasındaki ölçüm noktalarına **kraniometrik noktalar** denir (Vigo ve ark., 2020). Broca 1876’da bu noktaları altlarındaki oluk ve kıvrımlarla ilk kez ilişkilendirdi (Vigo ve ark., 2020). 19. yüzyılın sonunda noktalar ameliyatta kullanılmaya başlandı. Böylece kafatasındaki açıklık, ilgilenilen bölgeye göre biçimlendirilebildi. Bu, modern beyin cerrahisinin temellerinden biri oldu (Vigo ve ark., 2020).`,
    },
    {
      tur: 'metin',
      md: `**Kafadaki adresler.** Kafanın dışında elle bulunan ya da ölçülen birkaç sabit nokta vardır. Bu bölümde onları yalnızca **adres** olarak kullanacağız. Kemiklerin kendisi bu dersin konusu değil. Her biri kısaca şöyle:

- **Nasion:** burun kökünün hemen üstünde, iki göz arasındaki çukur (Vigo ve ark., 2020).
- **Inion:** kafanın arkasında, ense derisinin baş derisine kavuştuğu yerde elle hissedilen kemik çıkıntı (Gray, 1918).
- **Bregma:** kafatasının üstünde, öndeki enine dikişin ortadaki boyuna dikişle kesiştiği nokta (Gray, 1918). Bu enine dikişe **koronal dikiş** denir.
- **Lambda:** kafatasının arka-üst kısmında, ortadaki boyuna dikişin arkadaki dikişle buluştuğu nokta (Gray, 1918).
- **Verteks:** kafatasının en üst noktası; orta hatta, bregma ile lambda arasındadır (Vigo ve ark., 2020).
- **Pterion:** şakakta dört kemiğin buluştuğu, büyük H harfine benzeyen küçük bölge (OpenStax 7.2).
- **Asterion:** kulak deliğinin arka-üstünde, üç dikişin buluştuğu nokta (Gray, 1918).
- **Kulak önü noktası:** kulak deliğinin hemen önünde, elmacık kemerinin (kulağın önünde elle hissedilen kemik kemer) arka kökü üzerindeki nokta (Gray, 1918).

Gerçek kafada bu noktaların üstünde saçlı deri vardır.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kafatasının içinde beyin: adresler',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Kafatası yarı saydam bırakıldı. Beyin loblara göre boyandı: mavi frontal, sarı parietal, yeşil temporal, pembe oksipital lob. Arkada, altta beyincik görünür. İşaretli noktalar kafatasındaki adreslerdir. Nasion ile inion arasındaki orta hat, iki yarımküreyi ayıran yarığın üstünden geçer. Pterion, lateral oluğun ön kısmının üstüne düşer. Modelde saçlı deri yoktur. Gerçek kafada bu noktalar deri ve kasın altında kalır.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'kemik'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        bakis: 'sol',
        noktalar: [
          { nokta: 'nasion', metin: 'Nasion' },
          { nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' },
          { nokta: 'yan-kafa-art-kafa-kosesi-sol', metin: 'Lambda' },
          { nokta: 'dis-art-kafa-cikintisi', metin: 'Inion' },
          { nokta: 'yan-kafa-kama-kosesi-sol', metin: 'Pterion' },
          { nokta: 'yan-kafa-mastoid-kosesi-sol', metin: 'Asterion' },
          { nokta: 'dis-kulak-yolu-sol', metin: 'Kulak yolu' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Kafadan beyne üç kural.** Eski ve yeni anatomi kaynakları, beynin büyük oluklarını kafanın üstüne çizgilerle taşır:

1. **İki yarımkürenin arası.** Nasiondan iniona, saçlı derinin tam ortasından bir çizgi çek. Bu çizgi yarımkürenin üst sınırını gösterir (Gray, 1918). İki yarımküreyi ayıran **boylamsal yarık** (*fissura longitudinalis cerebri*) bu çizginin altındadır (Gray, 1918).
2. **Merkezî oluk** (*sulcus centralis*; Rolando oluğu). Oluğun önündeki kıvrım presantral girustur; onu ilk derste [hareket kabuğu](/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis#yariklar-ve-loblar) olarak tanıdık. Oluğun üst ucu, nasion–inion çizgisinin ortasının biraz arkasındadır. Gray bu uzaklığı 1,25 cm verir (Gray, 1918). Taylor–Haughton yönteminde uzaklık 2 cm’dir (Vigo ve ark., 2020). Bregmadan ölçersen oluğun üst ucu, orta hat boyunca bregmanın yaklaşık 5 cm arkasındadır (Vigo ve ark., 2020).
3. **Lateral oluk** (*sulcus lateralis*; Sylvius yarığı). Taylor–Haughton yönteminde bir çizgiyle gösterilir. Çizgi göz çukurunun ortasından başlar. Nasion–inion yayının %75 noktasına uzanır (Vigo ve ark., 2020). Oluğun ön kısmı şakaktaki pterionun altındadır (Vigo ve ark., 2020). Gray de lateral yarığın dallara ayrıldığı noktanın pratikte pteriona denk geldiğini yazar (Gray, 1918).

Pterionun altında alt frontal girusun en ön-alt kısmı bulunur. Dili asıl işleyen yarımkürede (baskın yarımküre) burası, konuşma hareketlerini programlayan **Broca alanıdır** (Vigo ve ark., 2020). Sağ elini kullananların çoğunda bu yarımküre soldur (Lee ve ark., 2020).

Beyincik ise derinde durur. Gray’e göre beyincik için güvenilir bir yüzey işareti yoktur (Gray, 1918). Inion, beyincik çadırının (tentoryum) yerini ve arka kafa çukurunun başlangıcını gösterir (Vigo ve ark., 2020).

Gray bu yöntemlerin ancak **yaklaşık** doğru olduğunu açıkça yazar. Yine de onları cerrahi amaçlar için yeterli sayar (Gray, 1918). Bu kitap 1918’de, yani BT ve MR’dan çok önce yayımlandı. Gray’in kurallarından bugünkü çalışmalarla doğrulanmamış olanlar **tarihsel yöntem** olarak okunmalıdır.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Ortalama, kişinin kendisi değildir',
      md: 'Kitaplardaki uzaklıklar ortalamadır. Kişiden kişiye fark olduğu için olduğu gibi uygulanmaz. Yine de ameliyattan önce ve ameliyat sırasında pratik bir yön bulma aracıdır (Vigo ve ark., 2020). Bugün ameliyatlarda görüntüye dayalı yön bulma cihazları (**nöronavigasyon**) da kullanılır. Bu teknoloji bile kafa ile beyin arasındaki üç boyutlu ilişkiyi kavramanın yerini tam tutamaz (Vigo ve ark., 2020).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Taylor ve Haughton 1900’de saçlı deride merkezî oluğun tam üstünü gösteren bir çizgi tanımladı. 1980’de yayımlanan bir çalışma bu çizgiyi bilgisayarlı tomografide (BT) merkezî oluğu bulmak için kullandı. Çizgiyi kadavra beyinlerinde de sınadı. Çizgi oluğun yerine iyi bir yaklaşık değer verdi (Taylor ve ark., 1980). Bu noktaları öğrenmenin yeni yolları da var. Lise öğrencileriyle yapılan bir ön çalışmada öğrenciler, kafatasındaki noktaları artırılmış gerçeklik desteğiyle daha doğru buldu (Olexa ve ark., 2025).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Orta hat:** nasion–inion çizgisi, iki yarımküreyi ayıran boylamsal yarığın üstündedir.
- **Merkezî oluk:** üst ucu nasion–inion ortasının 1,25–2 cm arkasında; bregmanın yaklaşık 5 cm arkasında.
- **Lateral oluk:** göz çukurunun ortasından %75 noktasına; ön kısmı pterionun altında.
- **Broca alanı:** dili asıl işleyen yarımkürede (sağ elini kullananların çoğunda sol) pterionun altında.
- **Hepsi yaklaşıktır:** ölçüler ortalamadır, kişiden kişiye değişir.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Resmî adlar.** Uluslararası anatomi terimleri listesinin bugünkü baskısına TA2 denir. TA2 merkezî oluğa *sulcus centralis*, lateral oluğa *sulcus lateralis* der. Rolando ve Sylvius adlarını resmî ad saymaz. Onları kişi adından gelen ilişkili terimler (eponim) olarak anar (FIPAT, 2019).

**Gray’in çizimi.** Gray merkezî oluğu iki noktayla çizer (Gray, 1918):

- **Üst nokta:** nasion–inion çizgisinin ortasının 1,25 cm arkası.
- **Alt nokta:** önce lateral yarığın arka dalı çizilir. Sonra kulak önü noktasından **Reid taban çizgisine** dik bir çizgi çekilir. İki çizginin kesiştiği yer alt noktadır. Reid taban çizgisi, göz çukurunun alt kenarından kulak noktasına uzanır. Kulak noktası, dış kulak yolu ağzının ortasıdır (Gray, 1918).
- **Oluk:** iki noktayı birleştiren çizginin üst 9 cm’si merkezî oluğun üstündedir. Bu çizgi orta hatla öne açık, yaklaşık 70°’lik bir açı yapar (Gray, 1918).

Presantral ve postsantral oluklar merkezî oluğa pratikte paraleldir. Biri yaklaşık 15 mm önünde, öteki 15 mm arkasındadır (Gray, 1918).

Bu çizim BT ve MR’dan önceye aittir. Bu dersin açtığı kaynaklarda Gray’in bu çizimini doğrudan sınayan bir çalışma bulunamadı. Bu yüzden onu tarihsel bir yöntem olarak oku.

**Sylvius noktası.** Gray bu noktayı iki yolla bulur. Birincisi ölçüdür: alın–elmacık dikişinin 35 mm arkası ve 12 mm üstü. Bu nokta pratikte pteriona denk gelir (Gray, 1918). İkincisi çizimdir. Nasion–inion uzaklığı dört eşit parçaya bölünür. 3. ve 4. çeyreğin birleşiminden alın–elmacık dikişine bir çizgi çekilir. 1. ve 2. çeyreğin birleşiminden kulak noktasına ikinci bir çizgi çekilir. İki çizgi Sylvius noktasında kesişir. Birinci çizginin bu noktanın arkasında kalan parçası, lateral yarığın arka dalının üstüne düşer (Gray, 1918).

**Taylor–Haughton çizgileri.** Bu yöntem dört başlangıç çizgisi kullanır (Vigo ve ark., 2020):

- **Frankfurt düzlemi:** göz çukurunun alt kenarından dış kulak yolunun üst kenarına.
- **Nasion–inion yayı:** kafanın üstünden ölçülür ve dörde bölünür (%25, %50, %75).
- **Arka kulak çizgisi:** mastoid çıkıntıdan yukarı çıkan dik çizgi.
- **Kondil çizgisi:** alt çene ekleminin başından yukarı çıkan dik çizgi.

Sylvius çizgisi, göz çukurunun ortasından %75 işaretine çizilir. Merkezî oluk %50 işaretinin 2 cm arkasından iner; burası **üst Rolando noktasıdır**. Oluk, Sylvius çizgisinin kondil çizgisiyle kesiştiği yerde biter; burası **alt Rolando noktasıdır** (Vigo ve ark., 2020). Başka bir kaynak Sylvius çizgisini dış göz köşesinden başlatır (Kim ve ark., 2025).

**Reid mi, Frankfurt mu?** İki çizgi birbirine benzer ama aynı değildir. Reid çizgisi dış kulak yolunun ortasından geçer (Gray, 1918). Frankfurt düzlemi ise yolun üst kenarından geçer (Vigo ve ark., 2020). Gray kafatasları karşılaştırılırken Frankfurt’a benzeyen çizginin yatay tutulmasını önerir (Gray, 1918). Yüzey çizimlerinde ise Reid çizgisini kullanır (Gray, 1918). Bir yöntemi uygularken hangi çizginin istendiğine dikkat et.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Merkezî ve lateral oluğun çevresi',
      aciklama:
        'Sol yarımküreye yandan bakıyoruz; ön taraf solda. Kafatası yarı saydam. Kırmızı: presantral girus. Mavi: postsantral girus. İkisinin arasındaki oluk merkezî oluktur. Sarı: alt frontal girus. Ön-alt kısmı pterionun altındadır. Yeşil: üst temporal girus. Lateral oluğun hemen altında uzanır. Nasion, inion, bregma ve kulak yolu klasik çizgilerin başlangıç noktalarıdır. Bakış düğmesiyle yukarıdan da bak. Merkezî oluğun üst ucu bregmanın birkaç santimetre arkasındadır.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'kemik'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        boya: [
          { secici: ['presantral-girus'], renk: HAREKET },
          { secici: ['postsentral-girus'], renk: DUYU },
          { secici: ['alt-frontal-girus'], renk: BROCA },
          { secici: ['ust-temporal-girus'], renk: ISITME },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'presantral-girus-sol', metin: 'Presantral girus' },
          { yapi: 'postsentral-girus-sol', metin: 'Postsantral girus' },
          { yapi: 'alt-frontal-girus-sol', metin: 'Alt frontal girus' },
        ],
        noktalar: [
          { nokta: 'nasion', metin: 'Nasion' },
          { nokta: 'dis-art-kafa-cikintisi', metin: 'Inion' },
          { nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' },
          { nokta: 'yan-kafa-kama-kosesi-sol', metin: 'Pterion' },
          { nokta: 'dis-kulak-yolu-sol', metin: 'Kulak yolu' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kafadan beyne: klasik kurallar',
      sutunlar: ['Beyindeki yapı', 'Kafadaki karşılığı', 'Kaynak'],
      satirlar: [
        ['Boylamsal yarık (iki yarımküre arası)', 'Nasion–inion orta hattı', 'Gray (1918)'],
        ['Merkezî oluğun üst ucu', 'Nasion–inion ortasının 1,25 cm arkası', 'Gray (1918)'],
        [
          'Merkezî oluğun üst ucu (üst Rolando noktası)',
          'Nasion–inion yayının %50 işaretinin 2 cm arkası',
          'Taylor–Haughton; Vigo ve ark. (2020)',
        ],
        ['Merkezî oluğun üst ucu', 'Sagital dikiş boyunca bregmanın 5 cm arkası', 'Vigo ve ark. (2020)'],
        ['Presantral girus', 'Bregmanın yaklaşık 4,5 cm arkası', 'Vigo ve ark. (2020)'],
        ['Merkezî oluk', 'Koronal dikişin yaklaşık 5 cm arkası', 'Vigo ve ark. (2020)'],
        ['Merkezî oluğun eğimi', 'Üst 9 cm’si orta hatla öne açık ~70°', 'Gray (1918)'],
        ['Presantral ve postsantral oluk', 'Merkezî oluğa paralel; ~15 mm önde ve arkada', 'Gray (1918)'],
        ['Lateral oluk', 'Göz çukurunun ortasından %75 işaretine çizgi', 'Taylor–Haughton; Vigo ve ark. (2020)'],
        [
          'Lateral yarığın dallandığı yer (Sylvius noktası)',
          'Pratikte pterion: alın–elmacık dikişinin 35 mm arkası, 12 mm üstü',
          'Gray (1918)',
        ],
        ['Parieto-oksipital yarığın dış kısmı', 'Lambdanın 5 mm önünden başlar, orta hatta dik ~2,5 cm yana uzanır', 'Gray (1918)'],
        [
          'Beyincik',
          'Güvenilir yüzey işareti yok. Gray’in tarihsel noktası: kulak noktasının 4 cm arkası, 1,5 cm altı (açılan kaynaklarda bugünkü bir doğrulaması yok)',
          'Gray (1918)',
        ],
      ],
      not: 'Gray (1918) bu kuralların yaklaşık olduğunu, ama cerrahi amaçlar için yeterli sayıldığını yazar. Bu yargı BT ve MR öncesi döneme aittir. Beyincik noktası gibi bugünkü bir doğrulaması bulunmayan kurallar tarihsel yöntemdir. Ölçüler ortalamadır ve kişiden kişiye değişir (Vigo ve ark., 2020).',
    },
    {
      tur: 'animasyon',
      ad: 'kafa-beyin-cizgileri',
      duzey: 'lisans',
      baslik: 'Kafadan beyne: çizgiler ve noktalar',
      aciklama:
        'Taylor–Haughton ve Gray çizgileri, karıncığa giriş noktaları, EEG 10–20 ve TMS hedefi: kafa yüzeyindeki noktalar ve altlarındaki beyin, beş görünümde.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Çizgiler BT’de sınandı',
      md: `Taylor–Haughton çizgisi 1980’de BT görüntülerinde merkezî oluğu bulmak için kullanıldı (Taylor ve ark., 1980). Daha yeni bir BT çalışması doğrudan bregmadan ölçtü. Buenos Aires’te 71 erişkinin BT’si incelendi. Merkezî oluk bregmanın ortalama 47,8 mm arkasındaydı. Kadın ve erkek arasında fark yoktu (Oberman ve ark., 2018). Bu sayı, kitaplardaki “bregmanın 5 cm arkası” kuralına yakındır (Vigo ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Pterionun altında ne var?',
      md: `Şakaktan yapılan **pteriyonal kraniyotomi** (kafatasında açılan pencere) pteriona ortalanır. Pterion, lateral oluğun (Sylvius yarığı) üstündedir (Vigo ve ark., 2020). Altında alt frontal girusun ön-alt kısmı (Brodmann 44–45) bulunur. Dili asıl işleyen yarımkürede bu bölge Broca alanıdır (Vigo ve ark., 2020). Sağ elini kullananların çoğunda bu yarımküre soldur (Lee ve ark., 2020). Pterion başka önemli yapılarla da komşu sayılır: insula, lateral oluk, ön Sylvius noktası ve beyin tabanının öndeki sıvı havuzları (sisternalar) (Triantafyllou ve ark., 2025).

Yani baskın yarımkürede pterion çevresindeki bir yaralanma ya da ameliyat, konuşma hareketlerini programlayan bölgenin hemen üstündedir. Broca alanının yerini ilk dersteki [işlev haritasında](/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis?duzey=lisans#yariklar-ve-loblar) görebilirsin.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Üst Rolando noktası:** nasion–inion %50 işaretinin 2 cm arkası (Taylor–Haughton) ya da bregmanın 5 cm arkası (Vigo ve ark., 2020). Gray’de ortanın 1,25 cm arkası (Gray, 1918).
- **Alt Rolando noktası:** Sylvius çizgisi ile kondil çizgisinin kesişimi (Vigo ve ark., 2020).
- **Sylvius çizgisi:** göz çukurunun ortası → %75 işareti (Vigo ve ark., 2020).
- **Merkezî oluğun eğimi:** orta hatla öne açık ~70° (Gray, 1918).
- **Reid çizgisi** dış kulak yolunun ortasından, **Frankfurt düzlemi** üst kenarından geçer.
- TA2: *sulcus centralis* (Rolando), *sulcus lateralis* (Sylvius) (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Klasik çizgiler ne kadar tutuyor?',
      md: `**Beş yöntem, bir kadavra çalışması.** Reis ve arkadaşları 12 kadavra kafa yarısında beş yöntemi karşılaştırdı: Broca, Reid, Poirier, Taylor–Haughton ve Rhoton. Özete göre gerçek üst Rolando noktası, çoğu yöntemin tahmininden 4–5 mm öndeydi. Reid yönteminde önde ya da arkada kalabildi. Gerçek alt Rolando noktası bütün tahminlerin ön-altındaydı. Lateral oluk tahmin edilen noktaya yaklaşık 2 mm uzaktı. Yazarlara göre bu yöntemler olukları birkaç milimetre içinde bulduğu için hâlâ güvenilirdir (Reis ve ark., 2008).

**Bregma mı, nasion mu?** Buenos Aires’teki BT çalışmasında üç oluk ölçüldü (Oberman ve ark., 2018):

- Bregmadan presantral oluğa 26,8 ± 7,2 mm.
- Bregmadan merkezî oluğa 47,8 ± 5,9 mm.
- Bregmadan postsantral oluğa 60,6 ± 5,7 mm.

Nasion–bregma uzaklığı 137,4 ± 7,8 mm, nasiondan merkezî oluğa uzaklık 185,2 ± 9,6 mm idi (Oberman ve ark., 2018). Nasiona dayalı ölçüler cinsiyete göre değişti. Bu yüzden yazarlar bregmanın kullanılmasını önerir (Oberman ve ark., 2018). Merkezî oluk presantral oluğun 20,9 ± 5,9 mm arkasındaydı. Postsantral oluk ise merkezî oluğun 12,7 ± 4,5 mm arkasındaydı. Merkezî oluğun en arka konumları, postsantral oluğun en ön konumlarına tehlikeli derecede yakındı (Oberman ve ark., 2018). Yazarlar ameliyatta önce presantral oluğun bulunmasını önerir (Oberman ve ark., 2018).

**Nerede daha çok değişir?** 16 gönüllünün MR’ında kafa–beyin değişkenliği ölçüldü. Değişkenlik, görece sabit olan merkezî ve lateral oluk bölgesinden uzak alanlarda en belirgindi (Steinmetz ve ark., 1989).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Beş yöntem: gerçek nokta tahminden ne kadar uzakta?',
      sutunlar: ['Yöntem', 'Üst Rolando noktası', 'Alt Rolando noktası (hep ön-altta)', 'Lateral oluk'],
      satirlar: [
        ['Broca', '4,6 ± 2,9 mm önde', '6,97 ± 3,55 mm', '—'],
        ['Reid', '3,26 ± 3,17 mm önde ya da arkada', '7,61 mm', '2,00 mm'],
        ['Poirier', '4,3 ± 2,13 mm önde', '7,64 mm', '2,33 mm'],
        ['Taylor–Haughton', '4,3 ± 2,13 mm önde', '7,61 mm', '2,00 mm'],
        ['Rhoton', '4,3 ± 2,13 mm önde', '5,87 ± 3,1 mm', '2,00 mm'],
      ],
      not: 'Kaynak: Reis ve ark. (2008), 12 kadavra kafa yarısı; yalnızca özeti okundu. Broca yönteminin lateral oluk sapması özette verilmez. Broca yönteminde iki yatay ve iki dikey çizgi kullanılır. Dikey çizgilerden biri kulak–bregma çizgisi, öteki onun 45 mm arkasıdır. Rhoton yönteminde Sylvius çizgisi alın kemiğinin dış açısal çıkıntısından %75 işaretine çizilir (Vigo ve ark., 2020).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Oluk anahtar noktaları',
      md: `Ribas ve arkadaşları ameliyatta olukları bulmaya yarayan “oluk anahtar noktaları” tanımladı. 16 kadavranın 32 yarımküresinde on nokta incelendi. Özete göre noktalar hem beyinle hem kafatasıyla düzenli ilişki gösterdi. Yazarlar onları tutarlı mikrocerrahi işaretler sayar (Ribas ve ark., 2006).

Bunların başında **ön Sylvius noktası** gelir. Nokta, pul dikişinin ön ucunun hemen altında, pterionun hemen arkasındadır. Kolay tanınır ve güvenilir bir ilk işarettir. Örneklerin %94’ünde bir sıvı havuzu (sisterna) görünümündeydi. Her zaman alt frontal girusun üçgen kısmının altındaydı (Ribas ve ark., 2005). Aşağıdaki tablo, noktaların kafadaki karşılıklarını özetler.

Kafatası dikişleri, kemik zarı düzgünce sıyrılınca çoğu olguda ameliyatta tanınabilir. Bu ilişkiler navigasyon cihazının “iç kontrolü” olarak da kullanılabilir (Oberman ve ark., 2018). Yani cihaz yanılırsa cerrah anatomiyle karşılaştırarak bunu fark edebilir.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Beyindeki anahtar nokta ve kafadaki karşılığı',
      sutunlar: ['Beyindeki nokta', 'Kafadaki karşılığı', 'Not'],
      satirlar: [
        [
          'Üst Rolando noktası (merkezî oluğun orta hattaki ucu)',
          'Sagital dikiş boyunca bregmanın 5 cm arkası',
          'Korpus kallozumun splenyumu ile aynı koronal düzlemde',
        ],
        [
          'Üst frontal oluk ile presantral oluğun birleşimi',
          'Arka koronal nokta: bregmanın 1,5 cm arkası, orta hattın 3 cm yanı',
          'El hareket alanının (“omega”) işareti',
        ],
        [
          'Alt frontal oluk ile presantral oluğun birleşimi',
          'Çoğu zaman stephanionun hemen altı. Vigo bir yerde noktayı stephanionun 0,5 cm arkasında verir; başka yerde presantral oluğu 0,34 ± 0,71 cm arkada verir',
          'Stephanion, şakak çizgisinin koronal dikişi kestiği yer; Broca alanıyla aynı koronal düzlemde',
        ],
        ['Ön Sylvius noktası', 'Pterionun en arka kısmının altı', 'Pul dikişinin sfenoparietal dikişi kestiği yer'],
        [
          'Alt Rolando noktası (merkezî oluk ile lateral yarığın buluştuğu yer)',
          'Pul dikişinin en yüksek yeri ile kulak önü çukurundan çıkan dikey çizginin kesişimi',
          'Ön Sylvius noktasından 2–2,5 cm uzakta; Heschl girusunun ve Wernicke alanının başlangıcının işareti',
        ],
        [
          'İntraparietal oluk ile postsantral oluğun birleşimi',
          'Lambdanın 6 cm önü, orta hattın 5 cm yanı',
          'Koronal izdüşümü yan karıncığın atriyumu',
        ],
        ['Supramarjinal girusun arka kısmı (Brodmann 40)', 'Euryon (yan kafa tümseğinin ortası)', 'Her zaman postsantral oluğun arkasında'],
        ['Üst temporal oluğun arka ucu', 'Parietomastoid ve pul dikişlerinin buluşmasından 3 cm yukarı', '“Arka temporal nokta”'],
        ['Parieto-oksipital oluk', 'Lambdanın alt-yanı', 'İki yarımküre arasındaki yarıktan yüzeye çıktığı yer'],
        ['Kalkarin yarık ve kuneusun tabanı (Brodmann 17)', 'Opisthokranion (orta hatta en arka çıkıntı)', 'Aynı aksiyel düzlemde'],
        ['Korpus kallozum', 'Nasion ile aynı aksiyel düzlem', 'Genu nasionun 12,6 ± 0,44 cm, splenyum 19,8 ± 0,82 cm arkasında'],
      ],
      not: 'Kaynak: Vigo ve ark. (2020); ön Sylvius noktası için ayrıca Ribas ve ark. (2005). Ribas ve ark. (2006) bu noktaların çoğunu “oluk anahtar noktası” olarak tanımlar. Ölçüler ortalamadır; navigasyonun yerini tutmaz, onu denetlemeye yardım eder.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Ankara’dan iki çalışma: kafatasının pencereleri',
      md: `Ankara Üniversitesi Anatomi Anabilim Dalı’ndan Kendir ve arkadaşları 10 formalinli erişkin kafayı inceledi. Dikişler ve kraniometrik noktalarla kafatasını 8 pencereye böldüler: üst ve alt frontal, üst ve alt parietal, sfenoidal, temporal, üst ve alt oksipital. Sonra önemli kıvrımların hangi pencerenin altına düştüğüne baktılar (Kendir ve ark., 2009). Özete göre:

- Presantral ve postsantral girusların dörtte üçü üst parietal pencerenin altındaydı.
- Alt frontal girusun üç önemli kısmı bütün yarımkürelerde üst şakak çizgisinin altındaydı. Orbital ve üçgen kısım alt frontal pencerede, operküler kısım alt parietal penceredeydi.
- Supramarjinal ve angular girus genellikle üst ve alt parietal pencerelerdeydi.
- Heschl girusunun en ön noktası genellikle alt parietal penceredeydi (Kendir ve ark., 2009).

Yine Ankara Üniversitesi’nden Uz ve arkadaşları 50 kuru kafada pterion bölgesini dört çeyreğe böldü. Özete göre Sylvius yarığının başlangıcı arka-alt çeyrekteydi (Uz ve ark., 2020).`,
    },

    // ——— 2. Karıncığa giden yol ———
    {
      tur: 'metin',
      md: `**Karıncığa giden yol.** Beynin içinde sıvıyla dolu boşluklar vardır: **karıncıklar**. İçlerindeki sıvıya **beyin-omurilik sıvısı** (BOS) denir. Karıncık sistemini ilk derste [beyni koruyanlar ve besleyenler](/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis#koruyanlar-ve-besleyenler) bölümünde görmüştük.

Bazen bu sıvıyı dışarı almak ya da basıncını ölçmek gerekir. Cerrah o zaman kafatasında küçük bir delik açar. İnce bir tüpü (**kateter**) beynin içinden yan karıncığa ilerletir. Bu işleme **ventrikülostomi** denir. Tüp kafanın dışındaki bir sisteme açılırsa **dış ventrikül drenajı** (EVD) adını alır. Bu sistemin bir basınç ölçeri de vardır (ElBadway ve ark., 2026). Sıvıyı karın boşluğuna yönlendiren kalıcı tüpe ise **ventrikülo-peritoneal şant** (VP şant) denir (Kesilmez ve ark., 2026).

Tüpün gireceği yer kafanın dışındaki ölçülerle bulunur. Navigasyon cihazı yoksa cerrahın başka yolu yoktur (Morone ve ark., 2020).

**Kocher noktası.** Yan karıncığa önden girişte en çok kullanılan noktadır (Vigo ve ark., 2020). Ölçüsü kaynaktan kaynağa değişir. Birkaç örnek:

- Koronal dikişin 1–2 cm önü, orta hattın 2–3 cm yanı (Vigo ve ark., 2020).
- Nasionun 11 cm arkası, orta hattın 3 cm yanı ve koronal dikişin 1 cm önü (ElBadway ve ark., 2026).
- Nasionun 10 cm arkası, orta hattın 3 cm yanı. Bir çalışma bu tarif için “geniş uzlaşı” olduğunu yazar (Pascual-Diaz ve ark., 2019).

Vigo ve arkadaşlarına göre nokta, göz bebeğinin üstünden geçen çizgiye (orta pupil çizgisi) düşer. Böylece beynin üstündeki büyük toplardamar kanalının (üst sagital sinüs) yanında kalır. Birincil hareket alanının da her zaman önündedir (Vigo ve ark., 2020).

Tüp yan karıncığın ön boynuzuna girer. Yolun sonu **Monro deliğinin** hemen önüdür (ElBadway ve ark., 2026). Monro deliğinin resmî adı *foramen interventriculare*, yani karıncıklar arası deliktir (FIPAT, 2019).

Çoğu zaman sağ taraf seçilir. Sağ elini kullananların %90’ında dil bu yarımkürede değildir (Lee ve ark., 2020). Önden girmek olanaksızsa örneğin arkadaki Frazier noktası kullanılır (ElBadway ve ark., 2026). Arkadaki başlıca noktalar **Keen**, **Frazier** ve **Dandy** noktalarıdır. Bunlar yan karıncığın arka kısmına ulaşır (Vigo ve ark., 2020).`,
    },
    {
      tur: 'sahne',
      baslik: 'Karıncıklar kafanın neresinde?',
      aciklama:
        'Sağ yarım kaldırıldı. Sol yarıma içeriden bakıyoruz; ön taraf sağda. Beyin ve kafatası yarı saydam. Mavi: yan karıncık. Sarı: Monro deliği. Turkuaz: üçüncü karıncık. Mor: orta beyin su yolu. Pembe: dördüncü karıncık. Kocher noktası koronal dikişin biraz önünde ve orta hattın 2–3 cm yanındadır; tam ölçüsü kaynağa göre değişir. Yani bregmanın biraz önünde ve yanındadır; modelde ayrıca işaretlenmedi. Tüp oradan aşağı inerek ön boynuza girer. Kulak yolunun yerine de bak: sırtüstü yatan hastada Monro deliği dış kulak yolu hizasına düşer (Muralidharan, 2015).',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'karincik', 'kemik'],
        renk: 'bolge',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kabuk', 'katman:sap', 'katman:kemik'],
        boya: [
          { secici: ['yan-karincik'], renk: YAN_KARINCIK },
          { secici: ['karinciklar-arasi-delik'], renk: MONRO },
          { secici: ['ucuncu-karincik'], renk: UCUNCU },
          { secici: ['beyin-su-yolu'], renk: SU_YOLU },
          { secici: ['dorduncu-karincik'], renk: DORDUNCU },
        ],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
          { yapi: 'karinciklar-arasi-delik', metin: 'Monro deliği' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
        noktalar: [
          { nokta: 'nasion', metin: 'Nasion' },
          { nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' },
          { nokta: 'dis-art-kafa-cikintisi', metin: 'Inion' },
          { nokta: 'dis-kulak-yolu-sol', metin: 'Kulak yolu' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla Kocher noktası',
      ogeler: [
        { deger: '1–2', birim: 'cm', aciklama: 'Koronal dikişin önünde (Vigo ve arkadaşlarının tarifi)' },
        { deger: '2–3', birim: 'cm', aciklama: 'Orta hattın yanında (aynı tarif)' },
        { deger: '10–11', birim: 'cm', aciklama: 'Nasionun arkasında (nasiondan ölçen tarifler)' },
        { deger: '5–7', birim: 'cm', aciklama: 'Erişkinde tüpün Monro deliğine doğru ilerletildiği derinlik' },
        { deger: '%90', aciklama: 'Sağ elini kullananlarda dilin sağ yarımkürede olmama oranı; bu yüzden çoğu zaman sağ taraf seçilir' },
      ],
      not: 'Kaynaklar: Vigo ve ark. (2020); ElBadway ve ark. (2026); Pascual-Diaz ve ark. (2019); Lee ve ark. (2020). Kocher noktasının ölçüleri kaynaktan kaynağa değişir. Tek bir doğru ölçü yoktur; konumla ilgili ilk üç sayı yukarıdaki listedeki tariflerden alındı.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Kocher noktası Theodor Kocher’in adını taşır. Kocher karıncığa giden güvenli bir yol tanımladı. Bu yol, önemli işlevli beyin bölgelerinin çevresinden dolaşıyordu. Ayrıca döneminde Keen noktasıyla görülen karıncık çökmesi sorununu çözüyordu. Bugünkü basit yöntemi ise oğlu Albert Kocher geliştirdi. Albert kokainle yerel uyuşturma yaptı. Deriyi ve kemiği doğrudan Kocher noktasından deldi ve bir şırınga soktu (Kanter ve ark., 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Kocher noktası:** önden giriş; koronal dikişin önünde, orta hattın 2–3 cm yanında. Tam ölçüsü kaynağa göre değişir. Hareket alanının önünde, üst sagital sinüsün yanında kalır.
- **Hedef:** yan karıncığın ön boynuzu, Monro deliğinin önü.
- **Taraf:** çoğu zaman sağ; sağ elini kullananların çoğunda dil bu yarımkürede değildir.
- **Arka girişler:** Keen, Frazier ve Dandy noktaları.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kocher noktası: tek bir ölçü yok.** Kaynaklar “Kocher noktası” adı altında çok farklı ölçüler verir. Kocher’in kendisi ise neredeyse hiç kaynak gösterilmez (Sannwald ve ark., 2026). Kocher karıncığı şöyle deliyordu: nasion–inion çizgisinin ön ve orta üçte birinin birleşimini buluyor, bu noktanın 2,5–3,0 cm yanından giriyordu (Sannwald ve ark., 2026). Bugünkü tarifler aşağıdaki tabloda.

Sannwald ve arkadaşlarına göre Kocher’in özgün noktası, girişi koronal dikişin üstünde ya da önünde tutar. Böylece hareket kabuğuna, köprü toplardamarlarına ve toplardamar ceplerine zarar riski en aza iner (Sannwald ve ark., 2026). Aşağıdaki tablodaki bugünkü tariflerin çoğu da girişi koronal dikişin önüne koyar. Vigo ve arkadaşlarına göre nokta orta pupil çizgisindedir, üst sagital sinüsün yanındadır ve birincil hareket alanının önündedir (Vigo ve ark., 2020).

**Kim neye “uzlaşı” diyor?** Pascual-Diaz ve arkadaşları, Kocher noktasının farklı tarifleri olduğunu kabul eder. Yine de nasionun 10 cm arkası ve orta hattın 3 cm yanı için geniş uzlaşı bulunduğunu yazar (Pascual-Diaz ve ark., 2019). Travmadaki Cusco uzlaşısı ise ölçüden çok tarafı söyler: baskın olmayan taraftaki Kocher noktası tercih edilir (Rubiano ve ark., 2026).

**Yön ve derinlik.** Klasik yönlendirme iki düzlemde yapılır (Muralidharan, 2015):

- **Koronal düzlemde** tüp, aynı taraftaki iç göz köşesine yöneltilir.
- **Ön–arka düzlemde** aynı taraftaki tragusun 1,5 cm önüne yöneltilir. Tragus, kulak deliğinin önündeki küçük çıkıntıdır. Bu yön Monro deliğine gider.

Tüp erişkinde 5–7 cm derinliğe ilerletilir (ElBadway ve ark., 2026). Vigo derinliği deriden yaklaşık 6 cm verir (Vigo ve ark., 2020). Muralidharan tüpün 7 cm’den fazla ilerletilmemesini söyler (Muralidharan, 2015).

**Monro deliğinin dıştaki izdüşümü.** Drenaj sisteminin basınç ölçeri tragus hizasına ayarlanır. Tragus, Monro deliğinin yaklaşık izdüşümüdür (ElBadway ve ark., 2026). Sırtüstü yatan hastada Monro deliği dış kulak yolu hizasına düşer. Yan yatan hastada iki kaş arasındaki orta çizgiye düşer (Muralidharan, 2015).

**Arka noktalar.** Keen noktası arka parietal yüzeydedir. Tüp şakak kabuğuna dik tutulur ve atriyuma (trigon) ulaşır (Vigo ve ark., 2020). TA2 atriyuma *atrium ventriculi lateralis* der (FIPAT, 2019). Frazier ve Dandy noktaları inionun üstündedir. Bu noktalardan giren tüp arka boynuza ve gövdeye ulaşır (Vigo ve ark., 2020). Ölçüler aşağıdaki ikinci tabloda.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kocher noktası: kaynağa göre ölçüler',
      sutunlar: ['Kaynak', 'Ön–arka konumu', 'Orta hattan uzaklığı'],
      satirlar: [
        ['Kocher’in özgün tarifi (Sannwald ve ark., 2026)', 'Nasion–inion çizgisinin ön ve orta üçte birinin birleşimi', '2,5–3,0 cm'],
        ['Vigo ve ark. (2020)', 'Nasionun 11 cm arkası ya da koronal dikişin 1–2 cm önü', '2–3 cm'],
        ['ElBadway ve ark. (2026)', 'Nasionun 11 cm arkası, koronal dikişin 1 cm önü', '3 cm'],
        ['Muralidharan (2015)', 'Orta hatta nasiondan 10 cm geri', '3 cm (orta pupil çizgisi boyunca)'],
        [
          'Pascual-Diaz ve ark. (2019)',
          'Nasionun 10 cm arkası; yazarlara göre bu tarif için “geniş uzlaşı” var',
          '3 cm (yaklaşık orta pupil çizgisi)',
        ],
        ['Chen ve ark. (2024), Çin', 'Koronal dikişin 1 cm önü', '2,5 cm'],
        ['Katano ve ark. (2026), Japonya', 'Koronal dikişin 20–30 mm önü', '20–30 mm'],
        ['Kesilmez ve ark. (2026), Kahramanmaraş', 'Koronal dikişin 1–2 cm önü', '2–3 cm'],
      ],
      not: 'Tek bir “doğru” ölçü yoktur. Vigo ve ark. (2020) noktayı orta pupil çizgisine, üst sagital sinüsün yanına ve hareket alanının önüne koyar. Sannwald ve ark. (2026), Kocher’in özgün tarifinin girişi koronal dikişin üstünde ya da önünde tuttuğunu yazar.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Öteki giriş noktaları',
      sutunlar: ['Nokta', 'Kafadaki yeri', 'Yön ve derinlik', 'Hedef'],
      satirlar: [
        [
          'Keen',
          'Kulak kepçesinin 2–3 cm üstü ve arkası (Vigo); 3 cm üstü ve 3 cm arkası (Safdar)',
          'Şakak kabuğuna dik; atriyum 4–5 cm derinde',
          'Atriyum (trigon)',
        ],
        [
          'Frazier',
          'İnionun 6 cm üstü; orta hattın 3–4 cm (Vigo), 3 cm (Kocaman) ya da 2,5–3,5 cm (Safdar) yanı',
          'Karşı iç göz köşesinin 4 cm üstüne; 5 cm',
          'Arka boynuz ve gövde (Vigo); atriyum–gövde bileşkesi (Kocaman)',
        ],
        ['Dandy', 'İnionun 3 cm üstü, 2 cm yanı', 'Glabellanın 2 cm üstüne; 4–5 cm', 'Arka boynuz ve gövde'],
        [
          'Oksipital-parietal nokta',
          'Keen ve Frazier noktalarının birkaç milimetre içinde ortası',
          'Orta hatta, nasionun 4 cm üstüne',
          'Atriyuma en kısa beyin dokusu yolu',
        ],
        ['Kaufman', 'Nasionun 5 cm üstü, orta hattın 3 cm yanı', '—', 'Seyrek kullanılır: kozmetik sonuç kötü, başarı düşük'],
      ],
      not: 'Kaynaklar: Vigo ve ark. (2020); Safdar ve ark. (2025); Kocaman ve ark. (2026); ElBadway ve ark. (2026) (oksipital-parietal nokta); Sulaiman (2024) (Kaufman). Glabella, iki kaş kemeri (kaşın altındaki kemik çıkıntı) arasındaki düzgün, üçgenimsi alandır (Gray, 1918).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Tüp nereye oturdu?',
      md: `Yerleşim, işlemden sonra çekilen görüntüyle değerlendirilir (van Doormaal ve ark., 2025). Yaygın ölçütlerden biri, Kakarla ve arkadaşlarının 2008’de önerdiği **Kakarla derecelendirmesidir** (Kakarla ve ark., 2008):

- **Derece 1 (en uygun):** aynı taraftaki ön boynuz ya da üçüncü karıncık.
- **Derece 2 (işlevsel):** karşı taraftaki yan karıncık ya da önemli bir işlevi olmayan kabuk.
- **Derece 3 (yetersiz):** önemli işlevli kabuk ya da hedef dışı bir sıvı boşluğu.

Bir derleme, görüntü kılavuzunu sınayan ve ClinicalTrials.gov’a kayıtlı yedi çalışmayı taradı. En sık kullanılan sonuç ölçütleri Kakarla derecesi ve geçiş sayısıydı (Bohner ve ark., 2026).

Tüpten BOS’un rahatça gelmesi doğru yerleşimin kanıtı değildir. Uçların önemli bir kısmı ön boynuz dışındaki sıvı boşluklarında bulunur (Lee ve ark., 2020). Bir derlemeye göre Kocher noktasından serbest elle girişte karıncığa ulaşma oranı %85–90’dır. Görüntü kılavuzu ya da stereotaksiyle bu oran %95’i aşar (ElBadway ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Kocher:** ölçüsü kaynağa göre değişir. Örneğin koronal dikişin 1–2 cm önü ve orta hattın 2–3 cm yanı (Vigo ve ark., 2020). Başka bir tarif: nasionun 10 cm arkası ve orta hattın 3 cm yanı (Pascual-Diaz ve ark., 2019). Hedef ön boynuz ve Monro deliği. Erişkinde derinlik 5–7 cm (ElBadway ve ark., 2026).
- **Klasik yön:** koronal düzlemde aynı taraf iç göz köşesi; ön–arka düzlemde tragusun 1,5 cm önü (Muralidharan, 2015).
- **Keen:** kulak kepçesinin 2–3 cm üstü ve arkası → atriyum. **Frazier:** inionun 6 cm üstü, 3–4 cm yanı. **Dandy:** inionun 3 cm üstü, 2 cm yanı (Vigo ve ark., 2020).
- **Monro’nun dıştaki izdüşümü:** tragus (ElBadway ve ark., 2026).
- **Kakarla:** 1 en uygun, 2 işlevsel, 3 yetersiz (Kakarla ve ark., 2008).
- TA2: Monro deliği *foramen interventriculare*, ön boynuz *cornu frontale* (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Yön, derinlik ve yolun bedeli',
      md: `**Hangi yöne?** Ponksiyon, bir boşluğa iğne ya da tüple delerek girmektir. Çin’de karıncıkları normal olan 206 hastanın BT’sinde 412 sanal ponksiyon yapıldı. Giriş Kocher noktası, ön–arka hedef dış kulak yoluydu. Koronal hedefe göre sonuç çok değişti (Chen ve ark., 2024):

- Aynı taraf iç göz köşesine yönelen yol karıncığa yalnızca %13,3 oranında girdi. Ortalama derinlik 41,8 ± 4,6 mm idi.
- İki kulak yolunun orta noktasına yönelen yol %74,5 doğruluk verdi.
- Kafaya dik yol %90,5 doğruluk verdi. Ama olguların %9,0’ında karşı karıncığa girdi. İşlevsel doğruluğu %99,5’ti.
- Karşı taraf iç göz köşesine yönelen yol %100 doğruluk verdi. Ortalama derinlik 47,2 ± 5,2 mm idi.

Bu sonuçlar yalnızca karıncıkları normal olan hastalar için geçerlidir. Hastaların hepsi Çinliydi. Yazarlara göre iki iç göz köşesi arası Asyalılarda daha geniştir. Bu yüzden aynı taraf iç göz köşesi yolu Asyalılarda, Avrupa kökenlilere göre daha dışa düşer ve daha az tutar (Chen ve ark., 2024).

Sonuç ön boynuzların genişliğine de bağlıydı. Yazarlar iki ön boynuzun BT’de ölçülen en büyük genişliğine baktı. Bu genişlik 45 mm’nin altındayken aynı taraf iç göz köşesi yolu karıncığa %8,2 oranında girdi. Genişlik 45 mm’yi aşınca oran %73,5’e çıktı (Chen ve ark., 2024). Yazarlar bu yolu önermez. Ancak genişlik 45 mm’yi aşıyorsa ya da giriş noktası içe kaydırılmışsa kullanılabilir (Chen ve ark., 2024). Klasik tarifin bu yolu söylediğini hatırla (Muralidharan, 2015).

**Ne kadar derine?** Yazarlar derinlik için iki uyarı da verir. 60 mm’den derinde BOS gelirse karşı karıncığa girilmiş olabilir. 65 mm’yi geçip BOS gelmezse tüp çekilmeli ve yön düzeltilmelidir (Chen ve ark., 2024).

**Travmada uzlaşı.** WFNS’in (Dünya Nöroşirürji Dernekleri Federasyonu) nörotravma komitesi Cusco’da bir uzlaşı yayımladı. Uzlaşı, travmatik beyin hasarı olan hastalar içindir. Buna göre baskın olmayan taraftaki Kocher noktası tercih edilir. Yol kafatasına dik ve Monro deliğine yönelik olmalıdır. Derinliğe sabit bir ölçüyle değil, BOS’un gelişiyle karar verilir (Rubiano ve ark., 2026). Aynı yazının çizim açıklaması ise yönü klasik biçimde tarif eder. Koronal düzlemde aynı taraf iç göz köşesi, ön–arka düzlemde dış kulak yolu gösterilir (Rubiano ve ark., 2026).

**Kaç deneme?** Klinik serilerde aynı taraf iç göz köşesi yolunun doğruluğu %64,3 ile %83,0 arasında bildirilir. Yazarlara göre bir neden, deneyimli cerrahın karıncığın yerini gözünde canlandırıp yönü ayarlamasıdır. Bir başka neden, ilk deneme başarısız olunca açıyı değiştirip yeniden denemesidir (Chen ve ark., 2024). Yani klinik serilerdeki doğruluk yöntemi tam yansıtmaz. Bir ankete göre ventrikülostomi başına ortalama 1,4–2,4 ponksiyon yapılır (Chen ve ark., 2024).

**Yolun bedeli.** Kocher–Monro yolu beyaz cevherde bir kesinti yaratır. Bir benzetim çalışmasında sağ yolda, kesilen yarımkürenin ön singulat girusunda bağlantı gücü azaldı (Pascual-Diaz ve ark., 2019). Frazier noktası toplardamar sinüslerine ve kabuk toplardamarlarına yakındır. Bu yüzden kanama riski daha yüksektir. Ön yol olanaksızsa kullanılır; örneğin frontal tümörde ya da travmada (ElBadway ve ark., 2026). Dandy noktasında tüp görme ışınımına yakın ya da içinden geçer. Görme ışınımı, görme bilgisini kabuğa taşıyan lif demetidir. Görme alanı hasarı bu yüzden kuramsal bir kaygıdır (Baregzai ve ark., 2024). Dandy noktası kötü görüş ve elverişsiz açılar nedeniyle bugün seyrek kullanılır (ElBadway ve ark., 2026). Bazı yazarlar arka girişi nöbet açısından da yeğler. Onlara göre frontal lobun nöbet eşiği daha düşüktür (Junaid ve ark., 2018). Bir görüşe göre önden giren tüp karıncığa tavandan girip “avize gibi” sarkar. Bu yüzden karıncık duvarına ve koroid pleksusa daha az değer (Baregzai ve ark., 2024).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Serbest el mi, navigasyon mu? Doğruluk serileri',
      sutunlar: ['Çalışma', 'Örneklem', 'Sonuç'],
      satirlar: [
        [
          'Kakarla ve ark. (2008)',
          '346 ardışık yatak başı EVD',
          'Derece 1 %77, Derece 2 %10, Derece 3 %13; kanama %5, belirti veren kanama %1,2 (özet)',
        ],
        ['Toma ve ark. (2009)', '183 BT', 'Uçların %39,9’u hedefte (aynı taraf ön boynuz); %9,8’i beyin dokusunda (özet)'],
        [
          'Huyette ve ark. (2008)',
          '98 serbest el yerleşimi',
          '%22,4 karıncık dışında; başarı genellikle 2 deneme; uç Monro deliğinden ortalama 1,6 cm uzakta (özet)',
        ],
        ['Lee ve ark. (2020), Singapur', '77 serbest el EVD', '%83,1 aynı taraf ön boynuzda'],
        ['Nielsen ve ark. (2025), Danimarka', '249 hasta', 'Derece 1: elektromanyetik navigasyon %93,0, serbest el %84,0'],
        [
          'Charcos ve ark. (2025), ABD',
          '44 yatak başı EVD',
          'Görüntü kılavuzlu: hepsi tek geçiş ve Derece 1. Serbest el: tek geçiş %73,5, Derece 1 %88,2',
        ],
        [
          'Katano ve ark. (2026), Japonya',
          '106 ön yol kateteri',
          'Doğru %76,4; yanlış yerleşim yenidoğan ve süt çocuğunda %39,3, çocukta %7,7, erişkinde %4,2',
        ],
        ['Stahl ve ark. (2023)', 'Çocuklarda 36 acil EVD', '28 Derece 1, 8 Derece 2; Derece 3 yok'],
        ['Baregzai ve ark. (2024), Katar', '94 şant', 'Uç aynı taraf yan karıncıkta: Dandy %90, Frazier %85,7, Keen %76,7, Kocher %60'],
        ['Duong ve ark. (2019)', '93 erişkin şant', 'Yetersiz yerleşim: oksipital-parietal nokta %15,1, klasik noktalar %32,5'],
        [
          'Kocaman ve ark. (2026), İzmir',
          '52 erişkin VP şant',
          'Bileşik başarı (iki koşul birlikte: ilk denemede karıncığa giriş ve 1. gün BT’de Derece 3 olmaması): navigasyon %100, serbest el %64,3. Derece 3 (yazarların kendi sınıflaması): %0 ve %32,1',
        ],
        [
          'Kesilmez ve ark. (2026), Kahramanmaraş',
          '164 çocukta VP şant',
          'En uygun yerleşim (Yim sınıflamasında Derece I): navigasyon destekli (ameliyat içi ultrason ya da nöronavigasyon) %81,25, klasik %60,34. Şantın yeniden ameliyat edilmesi (revizyon): %16,67 ve %38,79',
        ],
        [
          'van Doormaal ve ark. (2025)',
          'Yapay model (fantom). Çapraz deneme: her katılımcı iki yöntemi de uyguladı, hangisiyle başlayacağını kura belirledi',
          'Derece 1: artırılmış gerçeklik %57,6, serbest el %37,3; süre 7 dk 30 sn ve 1 dk 11 sn',
        ],
      ],
      not: '“Doğru” her çalışmada başka tanımlanır. Kimi aynı taraf ön boynuzu, kimi aynı taraf yan karıncığı ölçüt alır. Kimi de Kakarla ya da başka bir derecelendirmeyi kullanır: Yim sınıflaması ya da yazarların kendi sınıflaması. Yim sınıflamasında Derece I, kateter ucunun aynı taraf ön boynuzda ya da Monro deliği yakınında, duvara değmeden durmasıdır (Kesilmez ve ark., 2026). Bu yüzden satırlar doğrudan karşılaştırılmamalıdır. Aynı taraf yan karıncığın gövdesi de doğru sayılınca oranların alt sınırı belirgin yükselir (Lee ve ark., 2020).',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sayılar neden bu kadar farklı?',
      md: `Genel kabule göre “doğru” yerleşimde tüp ucu aynı taraf ön boynuzda ya da üçüncü karıncığın ucundadır. Bu tanımı kullanan merkezlerde bile serbest elle doğru yerleşim %39,9 ile %97,8 arasında bildirilir. Aynı taraf yan karıncığın gövdesi de doğru sayılırsa alt sınır belirgin yükselir (Lee ve ark., 2020). Başka bir derleme EVD doğruluğunu %12 ile %83 arasında verir (Charcos ve ark., 2025). Serbest elle yanlış yerleşim oranı %35–45 diye bildirilir (Katano ve ark., 2026). Klinik pratikte ameliyat sonrası görüntülerde yaklaşık %26–28 yetersiz ya da yanlış yerleşim görülür (van Doormaal ve ark., 2025). Bir meta-analize göre serbest elle ilk geçişte başarı %78, son yerleşimde en uygun konum %72’dir (Nielsen ve ark., 2025).

**Tanım farkına bir örnek.** Katar serisinde tüp ucunun aynı taraf yan karıncıkta olma oranı en düşük Kocher grubundaydı (%60). Ama bu gruptaki uçların %25’i üçüncü karıncıktaydı; öteki gruplarda hiç yoktu (Baregzai ve ark., 2024). Kakarla ölçütünde ise üçüncü karıncık da Derece 1, yani en uygun yerleşimdir (Kakarla ve ark., 2008). Aynı sonuç, ölçüte göre başarısız ya da başarılı görünebilir.

**Kimde zorlaşır?** Yetersiz yerleşim en çok orta hat kayması olanlarda ve travmada görüldü (Kakarla ve ark., 2008). Japonya’daki seride küçük yaş ve giriş yerinde kafanın büyük eğimi (37,2°’den fazla) yanlış yerleşimi öngördü. İdeal yoldan 12,9°’den fazla sapma şantın ömrünü kısalttı (Katano ve ark., 2026).

**Navigasyonun bedeli.** Nöronavigasyon yetersiz yerleşim riskini %10’un altına indirir. Ama pahalıdır, kurulumu karmaşıktır ve çoğu zaman kafa kıskacı gerektirir (van Doormaal ve ark., 2025). Pakistan’daki rastgele olmayan bir çalışmada 438 hastada şantın etkinliği Frazier grubunda %79,9, Keen grubunda %60,7 bulundu (Safdar ve ark., 2025). Aynı çalışma Choudhary noktasını da anar: 6 cm yukarıda ve orta hattın 3,5–4,5 cm yanında. Makale neyin 6 cm üstü olduğunu açıkça yazmaz (Safdar ve ark., 2025).

**Gray’in döneminde.** Görüntüleme yokken yan karıncık kafa üzerinde bir dörtgenle çizilirdi. Üst sınır elmacık kemerinin 5 cm üstündeki yatay çizgiydi; karıncığın tavanını gösterirdi. Alt sınır kemerin 1 cm üstüydü; alt boynuzun ucunu gösterirdi. Dikey sınırlardan biri kemerin ön ve orta üçte birinin birleşiminden geçerdi; ön boynuzun ucunu gösterirdi. Öteki mastoid ucunun 5 cm arkasından geçerdi; arka boynuzu gösterirdi (Gray, 1918). Bu çizim için açılan kaynaklarda bugünkü bir doğrulama yoktur. Tarihsel bir yöntem olarak okunmalıdır.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: 66 mm’de hâlâ sıvı yok',
      oyku: `52 yaşında, sağ elini kullanan bir kadın trafik kazasında ağır kafa travması geçiriyor. Kafa içi basıncı yüksek; BOS boşaltmak için gece acil dış ventrikül drenajı gerekiyor. BT’de karıncıklar normal genişlikte. İki ön boynuzun BT’de ölçülen en büyük genişliği 38 mm. Orta hatta kayma yok. Navigasyon cihazı o gece kullanılamıyor. Asistan hekim sağ Kocher noktasını işaretliyor: koronal dikişin 1 cm önü, orta hattın 3 cm yanı. Kateteri koronal düzlemde aynı taraf iç göz köşesine, ön–arka düzlemde tragusun önüne yöneltiyor. Kateter 66 mm derinliğe ulaşıyor, ama BOS gelmiyor.`,
      soru: 'Sorun büyük olasılıkla neden kaynaklanıyor, şimdi ne yapılmalı ve yerleşim nasıl doğrulanmalı?',
      cozum: `**Yön.** Çin’de karıncıkları normal olan 206 hastanın BT’sinde sanal ponksiyonlar, yani bilgisayarda karıncığa delerek girme denemeleri yapıldı. Giriş noktası koronal dikişin 1 cm önü, orta hattın 2,5 cm yanıydı. Kocher noktasından aynı taraf iç göz köşesine yönelen yol karıncığa yalnızca %13,3 oranında girdi (Chen ve ark., 2024). Sonuç ön boynuzların genişliğine bağlıydı. İki ön boynuzun genişliği 45 mm’nin altındayken bu yol %8,2, üstündeyken %73,5 oranında karıncığa girdi (Chen ve ark., 2024). Bu hastada genişlik 38 mm; yani hasta, yolun en az tuttuğu gruptadır. Giriş yeri de bu yolu zorlaştırır. Chen’e göre giriş orta hatta ne kadar yakınsa bu yol o kadar iyi tutar (Chen ve ark., 2024). Bu hastada giriş daha dışta, orta hattın 3 cm yanında. Chen’in aktardığı bir çalışma, karıncıkları normal 50 hastada iki giriş yeri denedi. İkisi de koronal dikişin 1 cm önündeydi: biri orta hattın 2 cm, öteki 3 cm yanında. İki girişte de aynı taraf iç göz köşesine yönelen yolların en çok %3’ü karıncığa girdi. Chen’in metnine göre 3 cm yandan girişte hiçbiri girmedi. Makalenin tablosu ise iki girişin sonuçlarını ters sırayla verir (Raabe ve ark., 2018; aktaran Chen ve ark., 2024). Chen’in çizimlerinde bu yol, dört yolun en dışta kalanıdır ve karıncığı ıskalama olasılığı en yüksektir (Chen ve ark., 2024). Kateter büyük olasılıkla karıncığın dış yanından geçti.

**Şimdi ne yapılmalı?** 65 mm’yi geçip BOS gelmiyorsa kateter çekilmeli ve yön düzeltilmelidir (Chen ve ark., 2024). Aynı çalışmada karşı taraf iç göz köşesine yönelen yol karıncığa %100, kafaya dik yol %90,5 oranında girdi. Dik yol olguların %9,0’ında karşı karıncığa ulaştı (Chen ve ark., 2024). Bu oranlar orta hattın 2,5 cm yanındaki giriş içindir. Chen’e göre başka bir giriş noktasında oranlar değişir (Chen ve ark., 2024). Bu yüzden yeni geçişte de dikkat: 60 mm’den derinde BOS gelirse karşı karıncığa girilmiş olabilir (Chen ve ark., 2024). Bu hasta bir travma hastası. Travmatik beyin hasarı için yayımlanan Cusco uzlaşısının metni, yolun kafatasına dik ve Monro deliğine yönelik olmasını önerir. Derinliğe sabit bir ölçüyle değil, BOS’un gelişiyle karar verilir (Rubiano ve ark., 2026).

**Doğrulama.** BOS gelmesi tek başına doğru yerleşimin kanıtı değildir. Uçların önemli bir kısmı ön boynuz dışındaki sıvı boşluklarında bulunur (Lee ve ark., 2020). Yerleşim işlemden sonraki görüntüyle değerlendirilir ve Kakarla derecesiyle yazılır. Aynı taraf ön boynuz ya da üçüncü karıncık Derece 1’dir. Bir seride yetersiz yerleşimin en sık görüldüğü gruplardan biri travmalı hastalardı (Kakarla ve ark., 2008).

**Ders.** Yönü seçmeden önce BT’de ön boynuzların genişliğine bak. Genişlik 45 mm’yi aşmıyorsa ve giriş içe kaydırılmamışsa yazarlar aynı taraf iç göz köşesi yolunu önermez (Chen ve ark., 2024). Bir sonraki girişimde navigasyon olanaklıysa düşünülmelidir. Elektromanyetik navigasyonla Derece 1 oranı %93,0, serbest elle %84,0 bulundu (Nielsen ve ark., 2025). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— 3. EEG 10–20 sistemi ———
    {
      tur: 'metin',
      md: `**EEG elektrotları nereye konur?** Elektrotları her kişide aynı bölgenin üstüne koymak için **10–20 sistemi** kullanılır. Bu sistemi Jasper tanımladı. Sistem orantılıdır. Kafada dört başlangıç noktası seçilir. Öteki noktalar bunlara belirli oranlardaki uzaklıklarla bulunur (Xiao ve ark., 2017).

- **Dört başlangıç noktası:** nasion, inion ve iki kulak önü noktası (Xiao ve ark., 2017).
- **Bölmeler:** bu noktalar arasındaki uzaklıklar %10 ve %20’lik parçalara bölünür (Theodoroff ve ark., 2018). Sistemin adındaki 10 ve 20 bu yüzdelerdir.
- **Sayı:** sistem bütün başı kaplayan 21 noktadan oluşur (Xiao ve ark., 2017).
- **Merkez:** ortadaki **Cz** elektrotu yaklaşık başın tepesine (verteks) denk gelir (Scrivener ve Reader, 2022).

Ölçüler santimetreyle değil yüzdeyle verilir. Sistemin “orantılı” olması bu demektir. Klasik yöntem mezurayla ölçmektir (Fabregat-Sanjuan ve ark., 2023).

**Elektrotun altında ne var?** Bir çalışmada 21 kişide elektrot noktaları navigasyonla beyne eşlendi. F3 noktası alın lobunun dorsolateral prefrontal kabuğuna karşılık geldi. T3 üst temporal girusa, P3 alt parietal loba düştü. Ölçümlerin yaklaşık %10’unda ise komşu bölgelere ulaşıldı (Herwig ve ark., 2003). Kafa ile beyin arasındaki bu ilişki tutarlıdır. EEG elektrotlarını alttaki kabuğa eşlemeyi bu sağlar (Tsuzuki ve ark., 2017).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**10–10 ve 10–5.** Kanal sayısı arttıkça sistem sıklaştırılır. Yaklaşık 21 kanal için 10–20, 64–85 kanal için 10–10, 300’den fazla kanal için 10–5 sistemi kullanılır (Scrivener ve Reader, 2022). 10–5 sisteminde 329 nokta vardır. Ayrıntılı bir kural verilirse bunların 241’i komşusuyla çakışmadan kurulabilir. 10–10 noktaları ise kafa üzerinde iyi ayrışır (Jurcak ve ark., 2007).

**Klinik standart genişledi.** Uluslararası Klinik Nörofizyoloji Federasyonu (IFCN) 2017’de 25 elektrotluk bir temel dizi önerdi. Çünkü standart kayıtlar temporal lobun ön ve taban kısmını kapsamıyordu. Yeni diziye alt temporal zincir eklendi. Adlandırması 10–10 ile uyumludur (Seeck ve ark., 2017). Amerikan Klinik Nörofizyoloji Derneği (ACNS) kılavuzu da 10–10 adlandırmasının her yerde kullanılmadığını belirtir (Acharya ve ark., 2016).

**Elle ölçmek.** Jasper’in kuralıyla 21 nokta dört adımda tek tek bulunur. Sonraki noktalar öncekilere dayanır. Orta deneyimli birinin işi yaklaşık 16 dakika sürer (Xiao ve ark., 2017). Bu yüzden hata birikir. Nasion–inion ve tragus–tragus çizgilerinin dışındaki noktalarda konum hatası daha büyüktür. Örnekler F3, F4, CP3, CP4, P3 ve P4’tür (Fabregat-Sanjuan ve ark., 2023).

**Kulak önü noktası her yerde aynı değil.** Gray onu elmacık kemerinin arka kökü üzerinde tanımlar (Gray, 1918). Bir MR çalışması onu tragusun ön kökünde işaretledi (Tsuzuki ve ark., 2017). Bazı yöntemler tragustan tragusa uzaklığı kullanır (Fabregat-Sanjuan ve ark., 2023). Başlangıç noktası kayınca, ona göre ölçülen bütün noktalar da kayar.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Elektrotların altındaki kabuk',
      sutunlar: ['Elektrot', 'Altındaki bölge', 'Kaynak'],
      satirlar: [
        ['FP1, FP2, FC1, FC2', 'Üst frontal girus (katılımcıların %100’ünde)', 'Koessler verisi; Scrivener ve Reader (2022)'],
        ['F3', 'Dorsolateral prefrontal kabuk, Brodmann 8/9', 'Herwig ve ark. (2003)'],
        ['F8', 'Sağ alt frontal girusun üçgen kısmı (Brodmann 45)', 'Scrivener ve Reader (2022)'],
        ['C1 ve C2', 'C1 birincil hareket kabuğu (Brodmann 4); C2 premotor kabuğa (Brodmann 6) daha yakın', 'Scrivener ve Reader (2022)'],
        [
          'C3 ve C4',
          'Presantral girusa olguların yalnızca %13’ünde düştü; ortalama yerleri postsantral girusa daha yakın',
          'Okamoto verisi ve Scrivener ve Reader (2022)',
        ],
        ['T3', 'Üst temporal girus, Brodmann 22/42', 'Herwig ve ark. (2003)'],
        ['T8', 'Sağ arka üst temporal girus (Brodmann 22)', 'Scrivener ve Reader (2022)'],
        [
          'P3',
          'Alt parietal lob, Brodmann 7/40 (Herwig); P3/P4 üst parietal lobül ve prekuneus (Okamoto)',
          'Herwig ve ark. (2003); Scrivener ve Reader (2022)',
        ],
        ['CP5', 'Sol Brodmann 39', 'Scrivener ve Reader (2022)'],
        [
          'O1 ve O2',
          'Oksipital girus ve kuneus (Okamoto); hep oksipital girus: Brodmann 18 %81, 19 %19 (Koessler)',
          'Scrivener ve Reader (2022)',
        ],
        ['PO7 ve PO8', 'PO7 Brodmann 18, PO8 Brodmann 19: simetrik çift, simetrik olmayan bölge', 'Scrivener ve Reader (2022)'],
      ],
      not: 'Herwig ve ark. (2003) yalnızca özetten. Okamoto ve Koessler verileri Scrivener ve Reader’ın (2022) derlemesinden aktarıldı. Bir elektrotun altı kişiden kişiye değişir; tablo en sık eşleşmeyi gösterir.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Elektrot ile kabuk arasındaki sapma',
      md: `**Ne kadar değişir?** 17 erişkinde 10–20 noktaları kabuğa izdüşürüldü. Noktaların standart beyin uzayındaki yeri ortalama 8 mm standart sapmayla kestirilebildi (Okamoto ve ark., 2004). 10–10 sistemi 16 kişide incelendi. Genel standart sapma x’te 4,6, y’de 7,1, z’de 7,8 mm idi. Değişkenlik merkezî bölge ve parietal lobda en büyük, frontal ve temporal lobda en küçüktü (Koessler ve ark., 2009). Bu sonuç ilk bakışta Steinmetz’in bulgusuyla çelişir. Steinmetz’te değişkenlik, merkezî ve lateral oluk bölgesinden uzakta en belirgindi (Steinmetz ve ark., 1989). Bu fark, iki çalışmanın farklı şeyler ölçmesinden gelebilir. Koessler elektrot izdüşümlerinin dağılımını ölçtü. Steinmetz ise 10–20 sistemi içindeki kafa–beyin ilişkisini inceledi.

**Başlık da kayar.** Sabit 64 kanallı bir başlık 20 kişide incelendi. Elektrot yerlerinin genel standart sapması x’te 3,94, y’de 5,55, z’de 7,17 mm idi. En büyük değişkenlik parietal ve oksipital elektrotlardaydı (Scrivener ve Reader, 2022). Başka bir çalışmada 72 kanallı bir başlıktaki 15 elektrot incelendi. Standart sapmalar 3 ile 12,7 mm arasındaydı. En büyükleri başlığın kenarındaki elektrotlardı: M1, M2, FPz ve Iz (Atcherson ve ark.; aktaran Scrivener ve Reader, 2022). Scrivener ve Reader ise kendi verisinde kenardaki elektrotlarda daha büyük bir sapma bulmadı (Scrivener ve Reader, 2022). Standart bir başlıkta her deliğin gerçek 10–20 noktasından yaklaşık 0–13 mm rastgele sapması beklenir (Xiao ve ark., 2017).

**Elle mi, navigasyonla mı?** Manken başında dört uygulayıcıyla elle ölçümün toplam değişkenliği 6,41 ± 1,14 mm idi. Yarı otomatik navigasyonla 2,93 ± 0,73 mm’ye indi. Elle ölçümde uygulayıcılar arası değişkenlik, aynı kişinin tekrarlarından çok yüksekti: 5,67 mm’ye karşı 2,20 mm (Xiao ve ark., 2017). İki saat eğitim alan acemilerde C3/C4’ün kulak önü noktasına uzaklığı için ölçüm hatası 1 cm’nin altındaydı. Ama ölçümler arası uyum düşük–orta düzeydeydi (Rich ve Gillick, 2019).

**Bebekler.** 3–17 haftalık bebeklerde O1–O2 ve T5–T6, erişkine göre daha aşağıdaki yapılara düştü (Kabdebon ve ark., 2014). Sağ Sylvius yarığı yukarı ve öne itildiği için P3 ve P4 bu yarığın arka ucuna eşit uzaklıkta değildi. Yazarlar bunu Yakovlev torku denen yarımküre asimetrisiyle açıklar (Kabdebon ve ark., 2014). 3–22 aylık 16 bebeğin MR’ında oluk kesişimlerinin yeri çoğunlukla birkaç milimetre değişti. Komşu 10–10 noktaları arası ise ~23 mm idi. Yani 10–10 sistemi bebekte de alttaki büyük yapıları öngörmeye yeter (Tsuzuki ve ark., 2017). Bebeklik boyunca merkezî oluğun alt kökü öne kaydı, üst ucu ise yerinde kaldı (Tsuzuki ve ark., 2017). IFCN’e göre küçük çocuklarda en az erişkin kadar elektrot kullanılmalıdır. Çünkü kafatasları incedir ve uzamsal örtüşme riski vardır (Seeck ve ark., 2017).`,
    },

    // ——— 4. TMS'de hedef bulma ———
    {
      tur: 'metin',
      md: `**TMS bobini nereye tutulur?** Depresyon tedavisinde bobinin istenen yeri çoğu zaman sol **dorsolateral prefrontal kabuktur** (DLPFC). Bu bölge 10–20 sisteminde F3 noktasına karşılık gelir (Beam ve ark., 2009). DLPFC, alın lobunun üst-yan yüzünde, bilişsel denetimle ilgili kabuktur (Cardenas ve ark., 2022). Hedefi bulmanın üç yolu vardır:

- **5 cm kuralı.** Önce kafa üzerinde bir nokta aranır: TMS buraya uygulanınca başparmak kasılır. Buna **motor sıcak nokta** denir. Tedavi bu noktanın sabit bir uzaklık önüne uygulanır (Cardenas ve ark., 2022). İlk klinik uygulamalar 5 cm öne gitti. ABD’de onaya (FDA) götüren büyük çalışmalar da bu kuralı kullandı (Caulfield ve ark., 2022).
- **Beam F3 yöntemi.** F3 noktasını yalnızca üç baş ölçüsüyle bulur (Beam ve ark., 2009).
- **Nöronavigasyon.** Kişinin MR’ını kafasıyla eşleyerek bobini yönlendirir (Caulfield ve ark., 2022).

Basit kural her zaman tutmaz. 5 cm kuralı DLPFC’yi olguların üçte birinden fazlasında ıskalar (Mir-Moghtadaei ve ark., 2015). MR’a dayalı navigasyon ise DLPFC’deki belirli bir noktayı doğrudan hedefleyebilir (Mir-Moghtadaei ve ark., 2015). Ayrıca bobini her seansta seçilen hedefe çok daha yakın koyar (Caulfield ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **10–20 sistemi:** dört başlangıç noktası var: nasion, inion ve iki kulak önü noktası. Uzaklıklar %10 ve %20’lik parçalara bölünür. Toplam 21 nokta. Cz yaklaşık verteksin üstünde.
- **Elektrotun altı kişiden kişiye değişir.** Örneğin C3/C4 her zaman hareket kabuğunun üstüne düşmez.
- **TMS’de depresyon hedefi:** sol DLPFC ≈ F3.
- **Doğruluk sırası:** 5 cm kuralı < Beam F3 < nöronavigasyon.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hedefin tanımı.** Klasik DLPFC, Brodmann 9 ve 46. alanlara atfedilir (Cardenas ve ark., 2022). F3 bölgesi ise sol DLPFC’de 8, 9 ve 46. alanların bölümlerine karşılık gelir (Deng ve ark., 2023).

**5 cm kuralı nereye düşer?** 5 cm kuralı en az doğru yöntemdi. Hedeflerin çoğu 8. alana ve 6–8 arasındaki geçiş bölgesine düştü. Kural öne kaydıkça hedefler klasik DLPFC’ye (9 ve 46) yöneldi (Cardenas ve ark., 2022). MR kılavuzlu çalışmalar, sıcak noktanın yaklaşık 7 cm önüne gitmenin daha doğru olduğunu düşündürdü (Cardenas ve ark., 2022).

**Beam F3 nasıl çalışır?** Üç uzaklık ölçülür: baş çevresi, nasion–inion ve tragus–tragus. Bir web arayüzü F3’ün iki uzaklığını hesaplar. Biri orta hattan çevre boyuncadır, öteki verteksten (Atmaram ve ark., 2025). 100 MR’da Beam F3 ile MR’a dayalı hedef arasındaki fark ölçüldü (Mir-Moghtadaei ve ark., 2015):

- Kişilerin %50’sinde 0,65 cm’nin altındaydı.
- %75’inde 0,99 cm’nin altındaydı.
- %95’inde 1,36 cm’nin altındaydı.

Beam F3, baş büyüklüğüne 5 cm kuralından daha iyi uyar (Deng ve ark., 2023).

**Verteks nasıl bulunur?** Bir çalışmada verteks, nasion–inion çizgisi ile kulaktan kulağa çizginin kesişimi olarak işaretlendi (Caulfield ve ark., 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sol DLPFC’yi bulmanın yolları',
      sutunlar: ['Yöntem', 'Nasıl?', 'Ne kadar tutuyor?'],
      satirlar: [
        [
          '5 cm kuralı',
          'Motor sıcak noktanın 5 cm önü',
          'DLPFC’yi olguların üçte birinden fazlasında ıskalar; hedeflerin çoğu 8. alanda ve 6–8 geçiş bölgesinde',
        ],
        ['Sıcak noktanın ~7 cm önü', 'MR kılavuzlu çalışmaların önerisi', '5 cm’den daha doğru'],
        [
          'Başlık işaretiyle',
          'Hedef (ör. Beam F3) esnek bir başlığa kalemle çizilir; bobin her seansta bu işarete konur',
          'Seanslar boyunca bobin, ilk seanstan önce kaydedilen hedeften ortalama 10,66 mm uzağa kondu',
        ],
        ['Beam F3', 'Üç baş ölçüsü ve hesap', 'MR hedefinden fark kişilerin %95’inde 1,36 cm’nin altında'],
        [
          'Nöronavigasyon',
          'Kişinin MR’ı kafayla eşlenir',
          'DLPFC’deki belirli bir noktayı doğrudan hedefleyebilir; bobini aynı hedefe yeniden koymada ortalama 0,3 mm sapma',
        ],
      ],
      not: 'Kaynaklar: Mir-Moghtadaei ve ark. (2015); Cardenas ve ark. (2022); Caulfield ve ark. (2022). Sabit uzaklık kurallarının hata elipsi daha büyüktür. Baş boyutuna göre ayarlanan kurallarınkinin yaklaşık iki katıdır: 654 ± 17 mm³’e karşı 301 ± 75 mm³ (Cardenas ve ark., 2022).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Depresyon için TMS, ama hangi noktaya?',
      oyku: `34 yaşında bir kadın, ilaçlarla düzelmeyen depresyon nedeniyle TMS tedavisine başlayacak. Merkezde nöronavigasyon cihazı yok. Ekip iki yolu tartışıyor. Birinde başparmağı kasan nokta bulunacak ve 5 cm öne gidilecek. Ötekinde baş çevresi ile iki uzaklık mezurayla ölçülecek ve F3 noktası hesaplanacak.`,
      soru: 'Hangi yol sol DLPFC’ye daha güvenilir ulaşır ve neden?',
      cozum: `**Hedef.** Depresyonda bobinin istenen yeri çoğu zaman sol DLPFC’nin üstüdür. Bu bölge 10–20 sisteminde F3’e karşılık gelir (Beam ve ark., 2009). Klasik DLPFC, Brodmann 9 ve 46. alanlara atfedilir (Cardenas ve ark., 2022).

**5 cm kuralı.** Bu kural ilk klinik uygulamalarda ve onaya götüren büyük çalışmalarda kullanıldı (Caulfield ve ark., 2022). Ama DLPFC’yi olguların üçte birinden fazlasında ıskalar (Mir-Moghtadaei ve ark., 2015). Hedeflerin çoğu, daha gerideki 8. alana ve 6–8 geçiş bölgesine düşer (Cardenas ve ark., 2022).

**Beam F3.** Bu yöntem baş çevresi, nasion–inion ve tragus–tragus uzaklıklarıyla F3’ü hesaplar (Atmaram ve ark., 2025). 100 MR’lık bir çalışmada MR’a dayalı hedefle farkı kişilerin %95’inde 1,36 cm’nin altındaydı (Mir-Moghtadaei ve ark., 2015). Baş büyüklüğüne de 5 cm kuralından iyi uyar (Deng ve ark., 2023).

**Sonuç.** Bu koşullarda Beam F3 daha güvenilir bir seçimdir. MR’a dayalı navigasyon olsaydı DLPFC’deki belirli bir noktayı doğrudan hedefleyebilirdi (Mir-Moghtadaei ve ark., 2015). Bobini her seansta aynı hedefe en tutarlı koyan yöntem de nöronavigasyondur (Caulfield ve ark., 2022). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Iskalama oranları neden farklı?',
      md: `**Hedef tanımı.** Bir çalışmaya göre 5 cm kuralı DLPFC’yi olguların üçte birinden fazlasında ıskalar (Mir-Moghtadaei ve ark., 2015). Başka bir kaynak, kuralın erişkinlerin üçte ikisinden fazlasında sol DLPFC’deki 9. alanı ıskaladığını yazar. Bobinin merkezi çoğu zaman 6. ya da 8. alana düşer (Deng ve ark., 2023). Fark hedefin tanımından gelir: biri DLPFC’nin tamamını, öteki yalnızca 9. alanı hedef alır.

**Ergenler.** Depresyonlu ergenlerde hedef MR’dan türetildi. 5 cm kuralı bu hedeften ortalama 3,9 cm, Beam F3 ise 2,5 cm uzaktaydı (Deng ve ark., 2023). Hindistan’da 10–15 yaşında 20 ergende Beam F3 ile 10–20 F3 karşılaştırıldı. Ortalama fark 1,10 ± 0,81 cm idi (0–3 cm). Ergenlerin %70’inde fark 1 cm ya da daha fazlaydı (Atmaram ve ark., 2025).

**Başlık ve navigasyon.** Bir çalışma, bobini her seansta aynı yere koymanın iki yolunu karşılaştırdı. Hedef, ilk seanstan önce Beam F3 yöntemiyle bulundu ve navigasyon cihazına kaydedildi. Her seansta bobin önce yalnızca esnek başlıktaki işarete göre, sonra navigasyona göre kondu. İki konumun da kaydedilen hedefe uzaklığı ölçüldü. 42 katılımcıda 3408 uzaklık ölçümü yapıldı. Başlık işaretiyle bobin, kaydedilen Beam F3 hedefinden ortalama 10,66 mm uzağa kondu; nöronavigasyonla 0,3 mm (Caulfield ve ark., 2022). Hedef dışı yerleşim, kabuktaki hedefe ulaşan elektrik alanını düşürdü. Bazı kişilerde hedefe ulaşan elektrik alanı, amaçlananın yalnızca %48,6’sı kadardı (Caulfield ve ark., 2022). Aynı yazı, MR’a dayalı hedef ile Beam F3’ün çoğu hastada aynı DLPFC hedefinde buluştuğunu da aktarır (Caulfield ve ark., 2022).

**Başka hedefler.** Kulak çınlaması tedavisinde işitme kabuğunu bulmak için 10–20’ye dayalı Langguth yöntemi kullanılır. 12 kişide bu yöntem bobini MR’daki en iyi yerin ortalama 10,8 mm arkasına ve 10,4 mm üstüne koydu (Theodoroff ve ark., 2018). 12 olgunun 6’sında bobin lateral oluğun üstündeydi, 1’inde altındaydı, 5’inde hizasındaydı (Theodoroff ve ark., 2018). İnmede birincil hareket alanı yer değiştirmiş olabilir. Bu durumda kafa ölçümüne dayalı konumlama yanıltabilir; TMS ile doğrulama önerilir (Rich ve Gillick, 2019).

**Ucuz ama kaba.** 10–20 ile TMS konumlaması ucuzdur ve geniş ölçekte istenen bölgeye ulaşır. Daha ince bir hedef için görüntülemeye dayalı yöntemler düşünülmelidir (Herwig ve ark., 2003). MR olmadan yapılan beyin haritalamada 10–20 sistemi yaygın kullanılır (Xiao ve ark., 2017). Bu tekniklerden biri fNIRS’tir: beyin etkinliğini kafa derisinden yakın kızılötesi ışıkla ölçer. fNIRS ve TMS’de Okamoto’nun kafa–beyin karşılık verisi temel başvurudur (Xiao ve ark., 2017).`,
    },

    // ——— 5. Türkiye'den çalışmalar ———
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den çalışmalar: kafadan beyne',
      sutunlar: ['Çalışma', 'Kurum ve şehir', 'Örneklem', 'Beyni bulmakla ilgili bulgu'],
      satirlar: [
        [
          'Kendir ve ark. (2009)',
          'Ankara Üniversitesi Anatomi Anabilim Dalı, Ankara',
          '10 formalinli erişkin kafa',
          'Kafatası 8 pencereye bölündü; presantral ve postsantral girusların dörtte üçü üst parietal pencerede (özet)',
        ],
        [
          'Uz ve ark. (2020)',
          'Ankara Üniversitesi, Ankara',
          '50 kuru kafa',
          'Pterion bölgesi dört çeyreğe bölündü; Sylvius yarığının başlangıcı arka-alt çeyrekte (özet)',
        ],
        [
          'Kocaman ve ark. (2026)',
          'İzmir Bakırçay Üniversitesi Tıp Fakültesi Beyin Cerrahisi ve Çiğli Eğitim ve Araştırma Hastanesi, İzmir',
          '52 erişkin VP şant; tek cerrah, önce–sonra',
          'Bileşik başarı (ilk denemede giriş ve 1. gün BT’de Derece 3 olmaması): navigasyon %100, serbest el %64,3. Derece 1 (yazarların kendi sınıflaması; uç aynı taraf Monro deliğinin önünde): %70,8 ve %32,1. Frazier noktası: inionun 6 cm üstü, 3 cm yanı',
        ],
        [
          'Kesilmez ve ark. (2026)',
          'Kahramanmaraş Sütçü İmam Üniversitesi Beyin ve Sinir Cerrahisi Kliniği, Kahramanmaraş',
          '164 çocukta (18 yaş altı) VP şant',
          'En uygun yerleşim (Yim Derece I): navigasyon destekli (ameliyat içi ultrason ya da nöronavigasyon) %81,25, klasik %60,34. Yeniden ameliyat (revizyon): %16,67 ve %38,79. Hedef derinlik küçük çocukta 4–5 cm, süt çocuğunda 3–4 cm',
        ],
      ],
      not: 'Kendir ve ark. (2009) ile Uz ve ark. (2020) yalnızca özetten. Kocaman ve ark. (2026) ile Kesilmez ve ark. (2026) tam metinden. Bu dört çalışma kafatasının yalnızca kemik ölçülerini değil, beynin ya da karıncığın yerini de ele aldığı için seçildi.',
    },
  ],
};
