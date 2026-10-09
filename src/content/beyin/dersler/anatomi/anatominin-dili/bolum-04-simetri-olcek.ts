import type { DersBolumu } from '../../../types';

const TEK = '#f2b544';
const CIFT = '#5aa9e6';

/**
 * 04. bölüm: iki yarım, birçok ölçek: iki yanlı simetri, orta hatta tek yapılar ve çift yapılar, orta hat kayması,
 * yarımküreler arası asimetriler (ENIGMA, planum temporale, tork ve petalya, Türkiye’den çalışmalar), ölçek merdiveni
 * (mm, µm, nm), ölçek dilindeki eski ve abartılı sayılar, kemirgen beyniyle karşılaştırma. Model tek bir kişiden
 * türetildiği için asimetri modelden okutulmaz; sahne yalnızca tek ve çift yapıları gösterir.
 */
export const simetriVeOlcek: DersBolumu = {
  id: 'simetri-ve-olcek',
  baslik: 'İki yarım, birçok ölçek',
  bloklar: [
    // ——— İki yanlı simetri, tek ve çift yapılar: temel ———
    {
      tur: 'metin',
      md: `Beyne yukarıdan bakınca ilk gördüğün şey iki yarımdır. Derin bir yarık beyni sağ ve sol **yarımküreye** ayırır. Bu yarığın adı **boylamsal yarıktır** (*fissura longitudinalis cerebri*) (FIPAT, 2019). İnsan başı kabaca **iki yanlı simetriktir**: sağ yarı, sol yarının ayna görüntüsüne benzer. Yarımküreler arasında işlev farkları vardır, ama kaba biçim bu kurala uyar (Liao ve ark., 2018). Büyük beyinde ve beyincikte loblar, karıncıklar ve derin çekirdekler iki yanda benzer boyut ve biçimdedir (Liao ve ark., 2018).

İki yarım birbirinden kopuk değildir. Onları **komissür** denen lif köprüleri bağlar. Korpus kallozum ile ön komissür, iki yarımküreyi birbirine bağlayan beyaz cevher yollarıdır (Henley, 2021b). Korpus kallozum yarımküreler arasındaki ana köprüdür ve 200 milyondan fazla lif taşır (Arda ve Akay, 2019).`,
    },
    {
      tur: 'metin',
      md: `Beyindeki yapıların çoğu **çifttir**: her yanda bir tane bulunur. Talamus, putamen, kaudat çekirdek, hipokampus ve amigdala böyledir. Hatta bunların sol ve sağ hacimleri ayrı ayrı ölçülür (Kong ve ark., 2022). Bazı yapılar ise **tektir** ve orta hatta durur. Epifiz bezi, üçüncü karıncık ve **septum pellucidum** bunlardandır. Septum pellucidum, iki yan karıncığın ön boynuzları arasındaki ince bir zardır (Liao ve ark., 2018).

Orta hattaki tek yapılar, beyin görüntülerinde bir cetvel gibi kullanılır. Bu yapılar ideal orta hattan saparsa buna **orta hat kayması** denir (Liao ve ark., 2018). Aşağıdaki sahnede tek ve çift yapıları ayrı renklerle görüyorsun.`,
    },
    {
      tur: 'sahne',
      baslik: 'Orta hatta tek, iki yanda çift',
      aciklama:
        'Kabuk ve beyaz cevher kaldırıldı. Derin yapılara önden bakıyoruz, bu yüzden hastanın sağı ekranın solunda. Sarı: orta hatta duran tek yapılar. Korpus kallozum, üçüncü karıncık, optik kiazma, hipofiz ve beyin sapı bunlardandır. Mavi: her yanda bir tane bulunan çift yapılar. Kaudat çekirdek, putamen, globus pallidus, amigdala, hipokampus, talamus ve beyin ayakları bunlardandır. Sarılar ortadan bir eksen gibi geçer, maviler bu eksenin iki yanında ayna gibi dizilir. Bu model tek bir kişiden türetildi. Bu yüzden iki yan arasındaki küçük farkları modelden okumaya çalışma.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik'],
        renk: 'dogal',
        goster: [
          'korpus-kallozum',
          'ucuncu-karincik',
          'optik-kiazma',
          'hipofiz',
          'orta-beyin',
          'pons',
          'omurilik-sogani',
          'kaudat-cekirdek',
          'putamen',
          'globus-pallidus',
          'amigdala',
          'hipokampus',
          'talamus',
          'serebral-pedinkul',
        ],
        boya: [
          { secici: ['korpus-kallozum', 'ucuncu-karincik', 'optik-kiazma', 'hipofiz', 'orta-beyin', 'pons', 'omurilik-sogani'], renk: TEK },
          {
            secici: ['kaudat-cekirdek', 'putamen', 'globus-pallidus', 'amigdala', 'hipokampus', 'talamus', 'serebral-pedinkul'],
            renk: CIFT,
          },
        ],
        bakis: 'on',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum (tek)' },
          { yapi: 'optik-kiazma', metin: 'Optik kiazma (tek)' },
          { yapi: 'pons', metin: 'Pons (tek)' },
          { yapi: 'kaudat-cekirdek-sag', metin: 'Kaudat çekirdek (çift)' },
          { yapi: 'putamen-sol', metin: 'Putamen (çift)' },
          { yapi: 'amigdala-sag', metin: 'Amigdala (çift)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },

    // ——— Asimetriler: temel ———
    {
      tur: 'metin',
      md: `Yine de iki yarım tıpatıp aynı değildir. En bilinen fark dildedir. İşlevsel MR çalışmalarına göre insanların en az %85’inde dil sol yarımkürede baskındır. Aşağı yukarı aynı oranda insan sağ ellidir (Kong ve ark., 2022). Nüfusun kabaca %1’inde ise dil sağ yarımkürede baskındır (Kong ve ark., 2022).

Biçimde de küçük farklar vardır. Dünyanın dört bir yanından 17.141 sağlıklı kişinin MR’ı incelendi. Sol yarımkürede kabuk genel olarak daha kalın bulundu. Ama soldaki kabuğun yüzey alanı daha küçüktü (Kong ve ark., 2018). Bunlar çok sayıda kişinin ortalamasında görülen, nüfus düzeyindeki farklardır (Kong ve ark., 2022). Klinikte tanı amaçlı beyin görüntülemede ise ince yapısal asimetrilerin bir rolü yoktur (Liao ve ark., 2018).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: `Sağ ile sol arasındaki farklar yalnızca insana özgü değildir. Beyin ve davranıştaki sol-sağ farkları hayvanlar âleminin her yerinde görülür. Bu farklar duyu, düşünme ve hareket işlerinde verim kazandırır (Güntürkün ve ark., 2020).`,
    },

    // ——— Ölçek merdiveni: temel ———
    {
      tur: 'metin',
      md: `Beyni anlatırken çok farklı büyüklüklerle karşılaşırız. Bir milimetre (mm), cetveldeki en küçük aralıktır. Bir **mikrometre** (µm), milimetrenin binde biridir (OpenStax 12.2). Bir **nanometre** (nm) de mikrometrenin binde biridir. Şimdi bu merdivenden aşağı inelim:

- Erişkin beyni 1200 ile 1500 g arasında gelir ve yaklaşık 1400 cm³ yer kaplar (Dafny, 2020).
- Kabuğun en kalın yeri, hareket kabuğunu taşıyan presantral kıvrımdır. BigBrain’de, dokudaki büzülme düzeltilince burada kalınlık 4,5 mm’yi geçer (Wagstyl ve ark., 2020).
- Kabuktan kabuğa giden aksonların ortalama çapı çoğunlukla 1 µm’nin altındadır (Liewald ve ark., 2014).
- Dendritlerin üstündeki küçük çıkıntılara **dendritik diken** denir. Dikenin başı genellikle 1 µm’den küçüktür. Boynu yaklaşık 100 nm genişliğindedir (Adrian ve ark., 2014).
- İki nöronun buluştuğu yerde, aralarında dar bir boşluk kalır: **sinaptik aralık**. Kuramsal bir hesaba göre bu aralığın en uygun yüksekliği yaklaşık 12–20 nm’dir (Savtchenko ve Rusakov, 2007).

Beyinden sinaptik aralığa inerken boyut milyonlarca kat küçülür. Aşağıdaki çizimde merdiveni basamak basamak in. Lisans düzeyinde bu merdivenin ayrıntılı bir tablosu da var.`,
    },
    {
      tur: 'animasyon',
      ad: 'olcek-merdiveni',
      baslik: 'Ölçek merdiveni: beyinden sinaptik aralığa',
      aciklama:
        'Basamakları sırayla seç. Her basamakta neye baktığını, büyüklüğünü, bir önceki basamağın kaçta biri olduğunu ve nasıl görüldüğünü okursun.',
    },
    {
      tur: 'sayilar',
      baslik: 'Bir milimetreküp kabukta neler var?',
      ogeler: [
        { deger: '57.000', aciklama: 'hücre (yaklaşık)' },
        { deger: '230', birim: 'mm', aciklama: 'kan damarı (yaklaşık)' },
        { deger: '150 milyon', aciklama: 'sinaps (yaklaşık)' },
        { deger: '1,4', birim: 'petabayt', aciklama: 'bu küçük parçanın görüntü verisi' },
      ],
      not: 'Bir epilepsi ameliyatında çıkarılan bir milimetreküp şakak kabuğu, hücrelerin ince yapısını gösterecek çözünürlükte yeniden kuruldu (Shapson-Coe ve ark., 2024). Bir milimetreküp, kenarı 1 mm olan küçük bir küptür.',
    },

    // ——— Kemirgen beyni: temel ———
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Fare deneyini okurken',
      md: `Beyin hakkındaki pek çok bilgi fare ve sıçan deneylerinden gelir. Dört ayaklı bir hayvanda merkezî sinir sisteminin ekseni düz bir çizgide uzanır. Bu yüzden yön terimleri bütün sinir sisteminde aynı yönü gösterir (Henley, 2021a). İnsanda ise eksen bükülür. Bir hayvan deneyindeki “dorsal” ya da “ventral” sözünü insana aktarırken dikkat et. Örneğin kemirgendeki hipokampus ekseni ventral–dorsal diye anılır. İnsanda buna karşılık gelen eksenin ön–arka eksen olduğu düşünülür (Vogel ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**İki yanlı simetri:** Beynin iki yarısı kabaca birbirinin ayna görüntüsüdür. Boylamsal yarık onları ayırır; korpus kallozum ve ön komissür birbirine bağlar.

**Tek ve çift yapılar:** Epifiz, üçüncü karıncık ve septum pellucidum orta hatta tektir. Talamus, hipokampus ve bazal çekirdekler çifttir.

**Asimetri:** İnsanların en az %85’inde dil solda baskındır. Yapısal farklar küçüktür ve çok sayıda kişinin ortalamasında görülür.

**Ölçek:** 1 mm = 1000 µm, 1 µm = 1000 nm. Beyin santimetrelerle, aksonun kalınlığı mikrometrelerle, sinaptik aralık nanometrelerle ölçülür.`,
    },

    // ——— Orta hat: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Orta hat bir ölçüdür.** Orta hat kaymasını ölçmek için epifiz bezi, üçüncü karıncık ya da septum pellucidum kullanılabilir. Bunlardan hangisi kullanılırsa kullanılsın, yapının ideal orta hattan sapmasına orta hat kayması denir (Liao ve ark., 2018). Çoğu yazar bilgisayarlı tomografide (BT) septum pellucidumun yer değiştirmesini ölçer (Liao ve ark., 2018).

Orta hattaki yapılar en iyi median (orta sagital) düzlemde görülür. Ankara’daki Gülhane Eğitim ve Araştırma Hastanesinde 436 ardışık sağlıklı kişinin MR’ı geriye dönük incelendi (Arda ve Akay, 2019). Korpus kallozumun ölçüleri orta sagital düzlemdeki T1 ağırlıklı kesitlerde alındı (Arda ve Akay, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Orta hat kayması nasıl ölçülür?',
      md: `Orta hat kayması kafa içi basıncın arttığını gösteren bir işarettir. Kafa içindeki bir kitle ya da kitle etkisi beynin kanlanmasını azaltıyor olabilir. Kayma bunun da göstergesidir (Liao ve ark., 2018).

Ölçüm için önce **ideal orta hat** çizilir. Kafatası her zaman simetrik değildir ve hasta cihaza tam hizalı yatmayabilir. Bu yüzden birçok uzman ideal orta hattı şöyle çizer: beyin orak zarının (*falx cerebri*) görünen en ön ve en arka noktalarını birleştirir (Liao ve ark., 2018). Sonra septum pellucidum gibi bir orta hat yapısının bu çizgiden ne kadar saptığına bakılır (Liao ve ark., 2018).`,
    },

    // ——— Orta hat: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Tek yapılar, adlar ve simetri varsayımı',
      md: `- **Tek yapıların adları:** TA2’nin notuna göre üst medüller velum (*velum medullare superius*) orta hatta tek, çift olmayan bir yapıdır (FIPAT, 2019). Epifiz ise birçok adla bilinir: *epiphysis cerebri*, *corpus pineale*, *conarium* gibi. TA2 *glandula pinealis* adını yeğler (FIPAT, 2019).
- **Simetri bir varsayım olduğunda:** Talairach atlası tek bir kadavra beyninden hazırlandı. Yönelimi yalnızca sagital ve koronal kesitlerle sınırlıydı. Ayrıca yarımkürelerin simetrik olduğunu varsayıyordu (Selvaraj ve ark., 2026). Gerçek beyinlerdeki asimetriler bu varsayıma uymayabilir.
- **Korpus kallozum ne kadar uzun?** Gray 1918’e göre median kesitte korpus kallozum yaklaşık 10 cm uzunluğunda, kemerli bir yapıdır. Ön ucu ön kutuptan yaklaşık 4 cm, arka ucu art kafa kutbundan yaklaşık 6 cm uzaktadır (Gray, 1918). Ankara’daki MR çalışmasında ise uzunluk erkeklerde 68,56 ± 4,98 mm, kadınlarda 67,53 ± 4,9 mm bulundu. Fark anlamlıydı (P = 0,029) (Arda ve Akay, 2019). Grupta 204 erkek ve 232 kadın vardı; yaş ortalaması 47,05 ± 19,8 idi (Arda ve Akay, 2019). İki kaynak aynı şeyi ölçmüyor olabilir: kemerin boyu mu, önden arkaya düz uzunluk mu, açık değildir. Makale ayrıca bu uzunluk için bir yerde “yükseklik” (*height*) sözcüğünü kullanır (Arda ve Akay, 2019).`,
    },

    // ——— Asimetriler: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Nüfustaki asimetriler.** ENIGMA, beyin görüntülerini dünyanın her yerinden toplayan bir araştırma ortaklığıdır. Ortaklığın bir çalışması 99 veri setinden 17.141 sağlıklı kişinin MR’ını inceledi. Ölçülenler kabuğun kalınlığı ve yüzey alanıydı (Kong ve ark., 2018). Asimetriler hem yarımküre düzeyinde hem bölge düzeyinde yaygındı. Bölgesel asimetriler dört yerde öne çıktı: alt frontal kıvrım, transvers temporal kıvrım, parahipokampal kıvrım ve entorinal kabuk (Kong ve ark., 2018). Asimetrilerle el tercihi arasında anlamlı bir ilişki bulunmadı (Kong ve ark., 2018).

**Planum temporale.** Sylvius yarığının arka ucunda bir kabuk alanı vardır: planum temporale. Nüfusun %11’e varan bir bölümünde bu alan sağda soldakinden büyüktür (Kong ve ark., 2022). Kaynak bu bulgu için Geschwind ve Levitsky’nin 1968 tarihli çalışmasını anar. TA2’de planum temporale, üst temporal kıvrımın bir parçasıdır. Heschl’in transvers temporal kıvrımları ise TA2’de *gyri temporales transversi* adıyla geçer (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beynin iki yanı arasındaki bazı farklar',
      sutunlar: ['Ne ölçüldü?', 'Bulgu', 'Kimlerde?'],
      satirlar: [
        ['Dil baskınlığı', 'En az %85’inde sol; kabaca %1’inde sağ (Kong ve ark., 2022)', 'İşlevsel MR çalışmaları'],
        ['El tercihi', 'Aşağı yukarı aynı oranda sağ el (Kong ve ark., 2022)', '—'],
        [
          'Kabuk kalınlığı ve yüzey alanı',
          'Solda kabuk genel olarak daha kalın, yüzey alanı daha küçük (Kong ve ark., 2018)',
          '17.141 sağlıklı kişi, 99 veri seti',
        ],
        [
          'Bölgesel asimetriler',
          'Alt frontal, transvers temporal ve parahipokampal kıvrımlar; entorinal kabuk (Kong ve ark., 2018)',
          'Aynı ENIGMA grubu',
        ],
        ['Planum temporale', 'Nüfusun %11’e varan kısmında sağdaki daha büyük (Kong ve ark., 2022)', '—'],
        [
          'Yan karıncıklar',
          'Asimetrik yan karıncık sıklığı %6,1; ölçüm ön boynuz düzeyinde (Kiroğlu ve ark., 2008)',
          'BT; Pamukkale Üniversitesi, Denizli',
        ],
      ],
      not: 'ENIGMA bulguları nüfus ortalamalarıdır; tek bir kişide aynı yönde olmayabilir. Kong ve arkadaşlarının 2018 çalışması ve Kiroğlu ve arkadaşlarının çalışması yalnızca özetinden okundu.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Küçük karıncık mı, kayan orta hat mı?',
      oyku: 'Yetmiş yaşında bir kadın evde düşüyor ve başını çarpıyor. Bilinci açık, konuşması akıcı. Acil serviste beyin BT’si çekiliyor. Görüntüde sağ yan karıncığın ön boynuzu soldakinden biraz küçük. Kanama ya da kitle görülmüyor. Septum pellucidum, epifiz ve üçüncü karıncık orta hatta duruyor. Stajyer öğrenci bulguyu “orta hat kayması” diye not etmek istiyor.',
      soru: 'Karıncıklar arasındaki bu fark tek başına orta hat kayması mıdır, ve neye bakmak gerekir?',
      cozum:
        'Orta hat kayması, orta hat yapılarının ideal orta hattan sapmasıdır. Bu yapılar epifiz, üçüncü karıncık ya da septum pellucidumdur (Liao ve ark., 2018). BT’de kayma çoğu zaman septum pellucidumun yer değiştirmesiyle ölçülür. İdeal orta hat, beyin orak zarının görünen en ön ve en arka noktaları birleştirilerek çizilir (Liao ve ark., 2018). Bu hastada orta hat yapıları yerinde duruyor; yani kayma yoktur. Yan karıncıklar arasındaki boyut farkı ayrı bir bulgudur. Pamukkale Üniversitesindeki bir BT çalışmasında, incelenen grupta asimetrik yan karıncık sıklığı %6,1 bulundu (Kiroğlu ve ark., 2008). Hekim bu farkı yine de not eder ve hastanın bulgularıyla birlikte değerlendirir. Ama onu orta hat kayması diye yazmaz. *Vaka eğitim için kurgulanmıştır.*',
    },

    // ——— Asimetriler: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Tork: beynin hafif burulması.** İnsan beyninde en belirgin yapısal asimetri **serebral torktur**. Torkta sağ frontal kutup ile sol oksipital kutup, karşı taraftakilerden daha çok taşar. Bu taşmaya **petalya** denir. Ayrıca sol oksipital kutup sağdakine göre aşağı kayar ve sağa doğru bükülür (Xiang ve ark., 2019). Xiang ve arkadaşları torku üç özellikle ölçtü: petalya, kayma ve iki yarımküre arasındaki yarığın bükülmesi. Çalışmada 91 insanın ve bir grup şempanzenin MR’ı kullanıldı (Xiang ve ark., 2019). Sağ frontal ile sol oksipital petalyanın birlikte görülmesi insanlarda en tipik örüntüydü (%60). Şempanzelerde ise petalyaların düzeni rastgele dağılıyordu (%31) (Xiang ve ark., 2019). Yazarlara göre tork insana özgüdür ve beyin büyüklüğüyle ilişkisizdir (Xiang ve ark., 2019).

**Türkiye’den çalışmalar.** Hacettepe Üniversitesinde (Ankara) yapılan bir MR çalışması **oksipital petalyayı** inceledi. Oksipital petalya, bir oksipital lobun karşı tarafa doğru çıkıntı yapmasıdır (Arsava ve ark., 2019). Nörolojik yakınması olmayan 264 kişide sağa bükülme %27, sola bükülme %4 oranında görüldü. Bükülmenin varlığı da yönü de el ya da göz baskınlığıyla ilişkili bulunmadı (Arsava ve ark., 2019). Bükülmenin yönü, aynı taraftaki enine toplardamar sinüsünün (*sinus transversus*) baskın olacağını öngördü. Sağa bükülmede bu öngörünün doğru çıkma oranı %72’ydi (Arsava ve ark., 2019).

Atatürk Üniversitesinde (Erzurum) normal MR’ı olan 105 kişinin MR venografisi incelendi. Sol enine sinüs kişilerin %20’sinde yoktu (aplazi), %39’unda dardı (hipoplazi). Sağ sinüs %6’sında dar, %4’ünde yoktu. Sinüsler yalnızca %31’inde simetrikti (Alper ve ark., 2004).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kabuk altı yapılar ve asimetrinin kökeni.** ENIGMA’nın kabuk altı ölçümlerinde bütün yapılarda nüfus düzeyinde bir hacim asimetrisi vardır. Talamus, putamen ve pallidum ortalama olarak solda daha büyüktür. Hipokampus, amigdala, nükleus akumbens ve kaudat çekirdek ise sağda daha büyüktür (Kong ve ark., 2022). Bu çok büyük örneklemde bile el tercihi kabuk altı asimetrilerle ilişkili bulunmadı (Kong ve ark., 2022). Kabuk asimetrisinin el tercihiyle karşılaştırıldığı analizde 555–608 solak ile 6.222–7.243 sağlak vardı. Yazarlara göre bu, yapısal ve işlevsel yan farklarının birbirinden büyük ölçüde bağımsız değişebildiğini gösterir (Kong ve ark., 2022).

Ortalama asimetri örüntüsü doğumdan önce kurulur (Kong ve ark., 2022). Birçok türde yan farkı, Nodal adlı bir sinyal zincirindeki genlerin iki yanda farklı çalışmasıyla başlar (Güntürkün ve ark., 2020). Asimetri hücrelerin ölçeğine de iner. Elektron mikroskobuyla yapılan bir çalışma, kabuktan kabuğa giden akson çaplarında bir insan beyninde sol-sağ farkı buldu (Liewald ve ark., 2014).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Saat yönünde mi, tersine mi?',
      md: `Kong ve arkadaşları torku “alttan bakıldığında saat yönünde bir burulma” diye tanımlar (Kong ve ark., 2022). Xiang ve arkadaşları aynı asimetriyi “saat yönünün tersine tork” diye anar ve bakış yönünü belirtmez (Xiang ve ark., 2019). İki tanım çelişmez. Bir dönmeye alttan bakınca saat yönünde görünen hareket, üstten bakınca saatin tersine görünür. Bakış yönü yazılmazsa aynı asimetri zıt adlarla okunur. Bu, önceki bölümlerde gördüğümüz kuralın bir örneğidir: yön, ancak bakış yönüyle birlikte anlam taşır.

Klinik ve araştırma bakışını da ayırmak gerekir. Klinik tanı amaçlı nöroradyolojide ince yapısal asimetrinin bir rolü yoktur (Liao ve ark., 2018). ENIGMA ise binlerce kişide nüfus düzeyindeki asimetrileri gösterir (Kong ve ark., 2022). İki görüş çelişmez; bağlamları farklıdır.`,
    },

    // ——— Ölçek: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Ölçek merdiveni: beyinden sinaptik aralığa',
      sutunlar: ['Basamak', 'Boyut', 'Bir önceki basamağın kabaca kaçta biri?'],
      satirlar: [
        ['Beynin önden arkaya çapı', '152 mm; tek bir beyinde ölçüldü (Park ve ark., 2010)', '—'],
        ['Kabuğun en kalın yeri (presantral kıvrım)', '4,5 mm’nin üstü (Wagstyl ve ark., 2020)', 'Yaklaşık 34’te biri'],
        [
          'Kabuktan kabuğa giden akson',
          'Ortalama çap çoğunlukla 1 µm’nin altında (Liewald ve ark., 2014)',
          'Kabaca 4500’de biri (4,5 mm = 4500 µm; akson 1 µm alınırsa)',
        ],
        ['Dendritik diken boynu', 'Yaklaşık 100 nm genişlik (Adrian ve ark., 2014)', 'Yaklaşık 10’da biri'],
        ['Sinaptik aralık', 'Kuramsal en uygun yükseklik 12–20 nm (Savtchenko ve Rusakov, 2007)', 'Yaklaşık 5’te biri (20 nm alınırsa)'],
      ],
      not: 'Oranlar yuvarlak değerlerle hesaplandı: 152 mm, 4,5 mm, 1 µm, 100 nm ve 20 nm. Aksonların ortalama çapı çoğunlukla 1 µm’nin altındadır (Liewald ve ark., 2014). Tabloda akson basamağı yuvarlak bir sayıyla 1 µm alındı. Daha ince bir akson için oran daha da büyür. 152 mm’lik bir beyinden 20 nm’lik bir aralığa inerken boyut yaklaşık 7,6 milyon kat küçülür. Aynı beynin yüksekliği beyin sapıyla birlikte 134 mm, sağ-sol çapı 138 mm’dir (Park ve ark., 2010).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Ölçek dili ve eski sayılar.** Gray 1918 mikrometreyi yalnızca “µ” harfiyle yazar. Kitap, kabuktaki hücreleri Cajal’a dayanan eski bir şemayla dört katmanda anlatır (Gray, 1918). Bugün kabuk altı katmanlı anlatılır (Wagstyl ve ark., 2020). Gray’in şemasına göre küçük piramit hücrelerinin ortalama uzunluğu 10–15 µ, büyüklerinki 20–30 µ’dur (Gray, 1918). Bu ders bu hücre boylarını güncel bir ölçüyle karşılaştıramadı. Onları Gray’in 1918’deki ölçüsü olarak oku. Bu yüzden yukarıdaki ölçek merdiveninde piramit hücresine ayrı bir basamak ayrılmadı.

Gray’de miyelin kılıflı sinir liflerinin çapı 2–16 µ arasındadır. Miyelin kılıf, aksonu saran yağlı örtüdür. Gray lif çapındaki farkı esas olarak bu kılıfın kalınlığına bağlar (Gray, 1918). Liewald ve arkadaşları ise elektron mikroskobuyla kılıfın içindeki aksonun çapını ölçtü. Örnekler, kabuğun uzak bölgelerini birbirine bağlayan beyaz cevher liflerindendi. İnsan beyninde bu aksonların iç çapı 0,16 ile 9 µm arasındaydı. Ortalama değerlerin çoğu 1 µm’nin altındaydı (Liewald ve ark., 2014). İki sayı aynı şeyi ölçmez. Gray kılıfıyla birlikte bütün lifi, Liewald ve arkadaşları kılıfın içindeki aksonu ölçer. Bu yüzden Gray’in alt sınırı bugünkü ölçülerle doğrudan karşılaştırılamaz. Memeli sinir sisteminde akson çapı 100 kattan fazla değişebilir. Büyük beyin ve beyincik kabuğunda 0,1 µm kadar ince aksonlar vardır (Liewald ve ark., 2014).

**Ders kitabında abartılı sayılar.** Ders kitapları da bazen sayıyı yuvarlar ya da abartır. OpenStax akson çaplarını “1 ile 20 mikrometre kadar küçük” diye verir (OpenStax 12.2). Oysa beyaz cevherde kabuktan kabuğa giden aksonların ortalama çapları çoğunlukla 1 µm’nin altındadır (Liewald ve ark., 2014). OpenStax, omurilikten çok uzağa uzanan bir hareket nöronu için şunu da yazar: aksonu bir metreyi bulabilir, gövdesi “belki birkaç yüz mikrometre” çapında olabilir (OpenStax 13.2). UTHealth ise omuriliğin ön boynuzundaki bu hareket nöronlarının gövdesini “25 µm’yi aşan” diye tanımlar (Dafny, 2026). UTHealth’in sayısı açık bir alt sınırdır. OpenStax’inki ise “belki” diye verilmiş bir tahmindir. Bir sayıyı okurken üç soru sor: Ölçüldü mü, tahmin mi? Hangi yöntemle? Hangi yapıda?`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- 1 mm = 1000 µm; 1 µm = 1000 nm (OpenStax 12.2).
- Erişkin beyni 1200–1500 g, yaklaşık 1400 cm³ (Dafny, 2020).
- Kabuğun en kalın yeri presantral kıvrımdır: büzülme düzeltilince BigBrain’de 4,5 mm’nin üstü, von Economo’da 3,5–4,5 mm (Wagstyl ve ark., 2020).
- Kabuktan kabuğa giden miyelinli aksonların iç çapı 0,16–9 µm; ortalamaların çoğu 1 µm’nin altında (Liewald ve ark., 2014).
- Diken başı 1 µm’den küçük; boynu yaklaşık 100 nm genişlikte, yaklaşık 1 µm uzunlukta (Adrian ve ark., 2014).
- Sinaptik aralığın kuramsal en uygun yüksekliği yaklaşık 12–20 nm (Savtchenko ve Rusakov, 2007).
- ENIGMA: solda kabuk daha kalın, yüzey alanı daha küçük; el tercihiyle ilişki yok (Kong ve ark., 2018).
- Orta hat kayması: epifiz, üçüncü karıncık ya da septum pellucidumun ideal orta hattan sapması (Liao ve ark., 2018).`,
    },

    // ——— Ölçek: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kabuk kalınlığını ölçmek',
      md: `- MR ölçümleri hareket kabuğunun kalınlığını sık sık olduğundan düşük gösterir (Wagstyl ve ark., 2020).
- Kabuğun yüzeyi ana eksenlerden hiçbirine dik değilse, elle yapılan kalınlık ölçümü hatalı olur (Fischl ve Dale, 2000). Yani düzlem seçimi ölçümün kendisini etkiler.
- Otomatik bir MR yöntemiyle ölçülen kabuk kalınlığında kişiler arası standart sapma 0,5 mm’nin altındadır (Fischl ve Dale, 2000).
- İstanbul Üniversitesi Aziz Sancar Deneysel Tıp Araştırma Enstitüsünde 417 sağlıklı kişinin kabuk kalınlığı iki yazılımla ölçüldü: FreeSurfer ve CAT12. İki yöntemin sonuçları ilişkiliydi. Ama 68 bölgenin 32’sinde FreeSurfer, 31’inde CAT12 daha yüksek değer verdi (Ay ve ark., 2022). Yazarlar, iki yöntemin aynı çalışmada birbirine karıştırılmaması gerektiğini vurgular (Ay ve ark., 2022).

Fischl ve Dale ile Ay ve arkadaşlarının çalışmaları yalnızca özetinden okundu.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Nanometre ölçeğinde görmek',
      md: `- **Işığın sınırı:** Dendritik diken boynu 50–400 nm inceliğinde bir zar tüpüdür (Adrian ve ark., 2014). İki foton mikroskobunun çözünürlüğü ise ışığın kırınımı yüzünden 400–500 nm ile sınırlıdır (Adrian ve ark., 2014). Diken boynu bu sınırın altında kalır.
- **Bir milimetreküpün içi:** Yeniden kurulan bir milimetreküp şakak kabuğunda glia hücreleri nöronlardan iki kat fazlaydı. En sık hücre oligodendrositti (Shapson-Coe ve ark., 2024).
- **Kuramdan gelen sayı:** Sinaptik aralığın 12–20 nm’lik “en uygun” yüksekliği bir kuramsal hesaptan gelir. Yazarlara göre bu aralık, elektron mikroskobunda görülen merkezî sinaps yapısıyla uyumludur (Savtchenko ve Rusakov, 2007).

Shapson-Coe ve arkadaşları ile Savtchenko ve Rusakov’un çalışmaları yalnızca özetinden okundu.`,
    },

    // ——— Kemirgen beyni: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemirgen ve insan.** Dört ayaklı hayvanlarda merkezî sinir sisteminin ekseni düz bir çizgide uzanır. Bu yüzden yön terimleri bütün sinir sisteminde aynı yönü gösterir (Henley, 2021a). Kemirgen atlas geleneğinde frontal kesitler beyin sapı eksenine diktir (Radtke-Schuller ve ark., 2016). Swanson’ın sıçan atlasındaki beyin de Paxinos ve Watson’ın stereotaktik sıçan atlasıyla neredeyse aynı transvers düzlemde kesildi (Swanson, 2018). Kemirgen atlaslarında “frontal” ve “transvers” bu yüzden aynı tür dilimi anlatabilir. İnsanda ise ön beyin ile beyin sapı farklı eksenlere göre kesilir. Bunu eksenleri anlatan bölümde gördük.

**Hipokampus örneği.** Yukarıdaki “Fare deneyini okurken” kutusunda gördüğümüz gibi kemirgende hipokampusun uzun eksenine genellikle ventral–dorsal eksen denir. İnsanda benzer değişimin ön–arka eksen boyunca olduğu düşünülür (Vogel ve ark., 2020). Kemirgende ventral hipokampus prefrontal kabuk, bazolateral amigdala ve hipotalamusla bağlantılıdır (Vogel ve ark., 2020). Kemirgen hipokampusunda yer hücrelerinin tepki verdiği alan (yer alanı) dorsalden ventrale doğru büyür (Collin ve ark., 2015).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kemirgen makalesi okurken',
      sutunlar: ['Konu', 'Kemirgende', 'İnsanda'],
      satirlar: [
        [
          'Sinir sisteminin ekseni',
          'Düz bir çizgi; yön terimleri her yerde aynı yönü gösterir (Henley, 2021a)',
          'Orta beyin hizasında bükülür (Henley, 2021a)',
        ],
        [
          'Frontal kesit',
          'Beyin sapı eksenine dik (Radtke-Schuller ve ark., 2016)',
          'Ön beyin ve beyin sapı için ayrı eksenler (Grinberg ve ark., 2011; Coulombe ve ark., 2021)',
        ],
        [
          'Hipokampusun uzun ekseni',
          'Ventral–dorsal (Vogel ve ark., 2020)',
          'Ön–arka; benzer değişimin bu eksende olduğu düşünülür (Vogel ve ark., 2020)',
        ],
        [
          'Sağ–sol koordinatı',
          'Bir gerbil atlasında: orta hatta sıfır, sağa eksi, sola artı (Radtke-Schuller ve ark., 2016)',
          'Talairach, Schaltenbrand ve MNI uzaylarında +x sağdır (Selvaraj ve ark., 2026)',
        ],
        [
          'Ön–arka koordinatının başlangıcı',
          'Bregma, lambda, iki kulak çizgisi ya da art kafa kabarıklığı (Radtke-Schuller ve ark., 2016)',
          'AC–PC çizgisi y eksenidir (Selvaraj ve ark., 2026)',
        ],
        [
          '“Prefrontal kabuk”',
          'Ad ve sınırlar araştırmacıya göre değişir (Laubach ve ark., 2018)',
          'Kemirgen alanları primatların ön kuşak kabuğu çerçevesiyle karşılaştırılabilir (Laubach ve ark., 2018)',
        ],
      ],
      not: 'Her satırdaki bilgi, hücredeki kaynaktan alındı. Bregma ve lambda kafatasının üstündeki işaretlerdir; gerbil atlası onları kemik dikişlerinin kesiştiği noktalarla tanımlar (Radtke-Schuller ve ark., 2016). Bir kemirgen bulgusunu insana aktarırken eksenin, kesit düzleminin, koordinat başlangıcının ve işaretin hangisi olduğunu ayrı ayrı denetle.',
    },

    // ——— Kemirgen beyni: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Koordinat ve ad tuzakları',
      md: `- **Başlangıç noktaları:** Bir gerbil atlası ön–arka koordinatları birkaç başlangıç noktasına göre verir: bregma, lambda, iki kulak çizgisi ve art kafa kabarıklığı (Radtke-Schuller ve ark., 2016). Gerbilde lambda ile bregmayı birleştiren çizgi, lambdadan art kafa kabarıklığına giden çizgiden sapar. Bu yüzden yatay kılavuz olarak kullanılmamalıdır (Radtke-Schuller ve ark., 2016). Geleneksel kafatası işaretleri çoğu zaman zor seçilir ve bireyden bireye değişir (Radtke-Schuller ve ark., 2016).
- **İşaretin yönü:** Aynı gerbil atlasında sağ–sol koordinatı orta sagital düzlemde sıfırdır. Sağa doğru eksi, sola doğru artı değer alır (Radtke-Schuller ve ark., 2016). Talairach, Schaltenbrand ve MNI uzaylarında ise +x sağdır (Selvaraj ve ark., 2026). İki sistemden gelen sayıları karıştırmak sağı ve solu ters çevirir.
- **Şablonlar:** Waxholm sıçan atlası iki şablon kullanır: 39 µm’lik eş kenarlı (izotropik) hacim birimli bir MR şablonu ve 78 µm’lik bir difüzyon şablonu. Beynin iç işaretlerine dayanan bu uzay, kafatası dikişleri ve stereotaktik işaretler aracılığıyla yaygın stereotaktik koordinat sistemine bağlandı (Papp ve ark., 2014). Allen fare ortak koordinat çerçevesi 10 µm’lik hacim birimli bir ortalama şablondur. Şablon 1.675 genç erişkin fareden üretildi (Wang ve ark., 2020).
- **Adlar:** “Prefrontal kabuk” farklı araştırmacılar için farklı anlamlar taşır. Ad ve sınır tutarsızlıkları türler arası karşılaştırmayı zorlaştırır (Laubach ve ark., 2018). Laubach ve arkadaşları kemirgen alanlarını primatların ön kuşak kabuğu çerçevesinde üç bölge olarak okumayı önerir: dorsal, genu önü (pregenual) ve genu altı (subgenual). Kafa karıştıran “dmPFC” ve “vmPFC” adları yerine deneyin tam olarak nerede yapıldığının yazılmasını isterler (Laubach ve ark., 2018).
- **Genler:** Fare ve insan yaklaşık 80 milyon yıl önce ortak bir atadan ayrıldı. Bu yüzden bulguları bir türden ötekine çevirmek kolay değildir (Beauchamp ve ark., 2022). 2835 ortak (homolog) genin ifadesine göre 67 fare ve 88 insan bölgesi karşılaştırıldı. Gen ifadesi bakımından fare izokorteksi genel olarak insan beyin kabuğuna benzedi. Hipokampal oluşum bunun dışında kaldı (Beauchamp ve ark., 2022).

Papp ve arkadaşları ile Wang ve arkadaşlarının çalışmaları yalnızca özetinden okundu.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Farenin dorsal hipokampusu, insanın hangi hipokampusu?',
      oyku: 'Bir nörobilim araştırmacısı bir fare çalışması okuyor. Çalışmada hayvanların “dorsal hipokampusuna” ilaç verilmiş ve davranış değişmiş. Koordinatlar bregmaya göre milimetre olarak yazılmış: ön–arka, sağ–sol ve derinlik. Araştırmacı bulguyu insanla karşılaştırmak ve koordinatları bir insan beyni şablonuyla yan yana koymak istiyor.',
      soru: 'Araştırmacı insanda hipokampusun hangi bölgesine bakmalı, ve koordinatları aktarırken nelere dikkat etmelidir?',
      cozum:
        'Kemirgende hipokampusun uzun eksenine ventral–dorsal eksen denir. İnsanda benzer değişimin ön–arka eksen boyunca olduğu düşünülür (Vogel ve ark., 2020). Kemirgendeki ventral hipokampusun insanda ön hipokampusa karşılık geldiği düşünülür. Öyleyse dorsal hipokampus için insanda arka hipokampusa bakmak gerekir. Koordinatlar ise doğrudan aktarılamaz. Kemirgen atlasları ön–arka koordinatları bregma gibi kafatası işaretlerine göre verir. Bu işaretler zor seçilir ve bireyden bireye değişir (Radtke-Schuller ve ark., 2016). Sağ–sol işareti de atlastan atlasa değişebilir. Bir gerbil atlasında sağa doğru değerler eksidir; insan uzaylarında ise +x sağdır (Radtke-Schuller ve ark., 2016; Selvaraj ve ark., 2026). Üstelik fare ile insan yaklaşık 80 milyon yıl önce ortak atadan ayrılmıştır (Beauchamp ve ark., 2022). Bu yüzden karşılaştırma koordinatla değil, yapının kendisiyle ve eksen boyunca konumuyla yapılmalıdır. *Vaka eğitim için kurgulanmıştır.*',
    },
  ],
};
