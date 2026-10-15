import type { DersBolumu } from '../../../types';

const KOROID = '#d1495b';
const TIP1 = '#e8833a';
const TIP3 = '#c2417a';

/**
 * 07. bölüm: yumuşak zar ve damar çevresi boşluklar. Yumuşak zarın yapısı ve katları, glia limitans ve pia–glia sınırı,
 * yumuşak zar ile damarların ilişkisi, damar çevresi (Virchow–Robin) boşluklar (yapı, MR ölçütleri ve sınıflamalar,
 * subaraknoid boşlukla süreklilik tartışması, dev boşluklar, Türkiye’den çalışmalar), koroid tela ve koroid pleksus (yapı;
 * yan karıncığın koroid pleksusu üç boyutlu sahnede), omurilikte yumuşak zar kısaca (dişli bağlar, linea splendens, filum
 * terminale; kafa-omurga birleşimindeki ilk dişli bağ). BOS yapımı ve glenfatik tartışma başka bölüm ve derslerdedir;
 * burada yalnızca gönderme yapılır.
 */
export const yumusakZar: DersBolumu = {
  id: 'yumusak-zar',
  baslik: 'Yumuşak zar ve damar çevresi boşluklar',
  bloklar: [
    // ——— Yumuşak zar: temel ———
    {
      tur: 'metin',
      md: `Yumuşak zar (*pia mater*) en içteki zardır. Beyni ve omuriliği doğrudan sarar ve sinir dokusuna sıkıca tutunur (Joost ve ark., 2026). Beynin kıvrımlarını ve oluklarını birebir izler; her oluğun içine iner (OpenStax 13.3). Beyinciğin ince kıvrımlarına da girer (OpenStax 13.3). Örümcek ağı zar ise kıvrımdan kıvrıma atlar, oluklara inmez (Mahendru ve Chong, 2009). Bu yüzden iki zar kıvrımların tepesinde birbirine değer. Oluklarda ise aralarında üçgen biçimli boşluklar kalır (Gray, 1918).

Yumuşak zar çok incedir. Dokuda bir ya da iki hücre kalınlığında bir tabakadır (Joost ve ark., 2026). Beyin yüzeyindeki büyük damarlar bu zarın üstünde, sıvı dolu subaraknoid boşlukta uzanır (Dafny, 2020). Omurilikte de durum benzerdir: omuriliğin damarları yumuşak zarın yüzeyinde uzanır (Byrne ve Dafny, 2026).

Yumuşak zar ile beyin dokusu arasında ince bir sınır tabakası vardır: **glia limitans**. Bu ad “sınırlayan glia” demektir; tabakayı beynin destek hücreleri olan astrositler kurar (Joost ve ark., 2026). Dersin başındaki zar katmanları çiziminde yumuşak zar en alttadır: beyin kabuğuna yapışır ve oluklara iner.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: `Yumuşak zar yalnızca beyni ve omuriliği sarmaz. Kafa ve omurilik sinirlerine de birer kılıf verir. Bu kılıflar sinirlere sıkıca bağlanır ve sinirlerin kendi zar örtüleriyle kaynaşır (Gray, 1918).`,
    },

    // ——— Yumuşak zarın yapısı: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dokuda yumuşak zar.** Mikroskopta yumuşak zar, bir ya da iki katlı bir leptomeningeal hücre tabakasıdır. Hücrelerin uzun, ince uzantıları vardır. Birbirlerine başlıca desmozomlarla ve oluklu bağlantılarla (*gap junction*) bağlanırlar (Joost ve ark., 2026). Farede yumuşak zar, glia limitansa komşu tek kat fibroblasttan oluşur (Derk ve ark., 2021).

**Sıvı geçirir mi?** OpenStax’e göre yumuşak zarın, sıvı geçirmeyen sürekli bir hücre katı olduğu düşünülür (OpenStax 13.3). Hutchings ve Weller insan zarlarını elektron mikroskobuyla inceledi. Onlara göre yumuşak zar hücreleri bağlantı kompleksleriyle sürekli bir tabaka oluşturur. Bu tabaka bir yanda subaraknoid boşluğu, öbür yanda pia altı ve damar çevresi boşlukları ayırır (Hutchings ve Weller, 1986). Aynı çalışmaya göre yumuşak zar beyin yüzeyinden yansır ve subaraknoid boşluktaki damarların dış örtüsünü yapar (Hutchings ve Weller, 1986).

**Beyinde ve beyincikte.** Gray 1918’e göre beyincikte yumuşak zar daha incedir. Derin yüzünden çıkan damarlar daha kısadır ve zar kabuğa daha az sıkı bağlıdır (Gray, 1918). Gray yumuşak zarı “damarlı bir zar” diye anlatır. Ona göre zar, çok ince ve gevşek bir dokunun bir arada tuttuğu küçük bir damar ağıdır (Gray, 1918). Joost ve arkadaşları da onu ince ve bol damarlı bir zar diye tanımlar. Mikroskopta görülen bir-iki katlı hücre tabakası bu zarın kendisidir. Büyük damarlar zarın üstünde, subaraknoid boşlukta uzanır. Zarın altındaki pia altı boşlukta da damarlar vardır (Joost ve ark., 2026).

**Adlar.** Uluslararası anatomi terimleri listesinin bugünkü baskısına kısaca TA2 denir. TA2’de yumuşak zarın resmî adı *pia*dır; *pia mater* eş anlamlısıdır (FIPAT, 2019). TA2 kafa piasını (*pia cranialis*) ve omurilik piasını (*pia spinalis*) ayrı terimler olarak verir (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beyin yüzeyinde dıştan içe: yumuşak zar ve komşuları',
      sutunlar: ['Kat', 'Ne var?', 'Kaynak'],
      satirlar: [
        ['Subaraknoid boşluk', 'BOS; farklı çaplarda atardamarlar ve toplardamarlar; kılcal damar yok', '(Joost ve ark., 2026)'],
        ['Epipial kat (yumuşak zarın dış katı)', 'Kollajen lifler; trabeküllerle örümcek ağı zara bağlıdır', '(Joost ve ark., 2026)'],
        [
          'İntima pia (yumuşak zarın iç katı)',
          'Elastik ve retiküler lifler; beyin dokusunun en dış katına sıkıca yapışır',
          '(Joost ve ark., 2026)',
        ],
        ['Pia altı boşluk', 'Kollajen demetleri, fibroblast benzeri hücreler ve damarlar', '(Joost ve ark., 2026)'],
        [
          'Bazal zar',
          'Laminin, kollajen IV, heparan sülfat proteoglikanları ve nidojen içeren hücre dışı madde tabakası',
          '(Zedde ve Pascarella, 2025a)',
        ],
        [
          'Glia limitans',
          'Astrositlerin yaptığı bazal zar ve astrosit uç ayakları; yetişkin kabuğunda 20–40 µm kalınlığında',
          '(Joost ve ark., 2026; Brøchner ve ark., 2015)',
        ],
        ['Beyin kabuğu', 'Sinir dokusu', '—'],
      ],
      not: 'Joost ve arkadaşlarına göre yumuşak zar, glia limitansın bazal zarı üzerinde durur; ikisinin arasında pia altı boşluk vardır (Joost ve ark., 2026). Zedde ve Pascarella ise yumuşak zarın hemen altındaki tabakaya “yumuşak zar bazal zarı” der. Onu zarlar ile beyin dokusu arasında bir engel sayarlar (Zedde ve Pascarella, 2025a). İki kaynak bu bölgeyi farklı sözcüklerle anlatır.',
    },

    // ——— Glia limitans: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Glia limitans: beynin dış sınırı.** Glia limitans, yumuşak zar ile beyin dokusu arasındaki doğrudan sınırdır. Beynin ve omuriliğin bütün yüzeyini, damar çevresi boşluklar dahil, örter (Joost ve ark., 2026). İki kısmı vardır: yüzeydeki *glia limitans superficialis* ve damarların çevresindeki *glia limitans perivascularis* (Joost ve ark., 2026).

Yapısı iki parçalıdır: astrositlerin yaptığı bir bazal zar ve astrositlerin uç ayakları (Joost ve ark., 2026). Sağlıklı beyinde bu sınırdan su geçişini akuaporin-4 adlı su kanalı düzenler. Bu kanal en çok astrositlerin uç ayaklarında toplanır. Buna kutuplaşmış dağılım denir (Joost ve ark., 2026). Glia limitans bağışıklık hücrelerinin geçişini de denetler. Bu hücrelerin subaraknoid ve damar çevresi boşluklardan beyin dokusuna serbestçe girmesini sınırlar (Joost ve ark., 2026).

Yetişkin insan beyin kabuğunda glia limitans 20–40 µm kalınlığındadır. Astrosit uzantılarının oluşturduğu sık bir ağdır. Bu uzantılar GFAP proteinini taşır (Brøchner ve ark., 2015). GFAP, “glia lifli asidik proteini” adının kısaltmasıdır.`,
    },

    // ——— Glia limitans: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Beynin dış engelleri',
      md: `- **Üç arayüz:** Brøchner ve arkadaşları beynin dış engellerinin en az üç arayüzden oluştuğunu önerir. Birincisi araknoid engel hücre katmanıdır. İkincisi yumuşak zar mikrodamarlarındaki engeldir. Üçüncüsü glia ayakları ve yumuşak zarın yüzey katının kurduğu dış BOS-beyin engelidir (Brøchner ve ark., 2015).
- **Kan-beyin engeli değil:** Aynı yazarlara göre yumuşak zar damarlarındaki engeli kan-beyin engeliyle bir tutmak yanlıştır. Tam kan-beyin engelini kuran sinir-damar birimi subaraknoid boşlukta yoktur (Brøchner ve ark., 2015). Yumuşak zar damarlarının çevresinde astrosit ayakları da bulunmaz. Oysa kan-beyin engelinde bu ayaklar her yerdedir (Derk ve ark., 2021).
- **Karışık adlar:** Dış BOS-beyin engeli için literatürde birbirine karışan pek çok ad kullanılmıştır. Glia sınırlayıcı zar, dış pia sınırlayıcı zar ve glia ayak engeli bunlardan birkaçıdır (Brøchner ve ark., 2015).
- **Gelişimde:** Yumuşak zarın bazal zarı, radyal glia uzantılarının tutunduğu yerdir. Bu zarı bozuk fare mutantlarında uzantılar erken kopar. Sinir hücreleri kabukta ve beyincikte yanlış yerleşir (Zedde ve Pascarella, 2025a). Embriyodaki yumuşak zar hücreleri, örümcek ağı zar ve sert zar fibroblastlarında görülmeyen genler taşır; S100a6 ve Ngfr bunlardandır (Derk ve ark., 2021). İnsanda yüzeydeki radyal glia ayak katmanı, gebeliğin 25–28. haftaları arasında pia altı glia limitansa dönüşmeye başlar (Brøchner ve ark., 2015).

Zarların gelişiminin geri kalanı “Zarların gelişimi ve keşif tarihi” bölümündedir.`,
    },

    // ——— Yumuşak zar ve damarlar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yüzeydeki damarlar.** Subaraknoid boşlukta farklı çaplarda atardamarlar ve toplardamarlar vardır, ama kılcal damar yoktur (Joost ve ark., 2026). Yumuşak zar atardamarları kabuk yüzeyinde ve oluklarda tekrar tekrar dallanır. Böylece çapı yaklaşık 30–40 µm’ye kadar inen geniş bir ağ kurarlar (Joost ve ark., 2026). Subaraknoid boşluktaki atardamarlar ve toplardamarlar, yumuşak zarla sürekli bir leptomeningeal hücre kılıfıyla sarılıdır (Joost ve ark., 2026).

**Beyne dalan damarlar.** Zhang ve arkadaşları 6 hastanın beyin kabuğu biyopsisini inceledi; hastalar 18–53 yaşındaydı. İnce bir yumuşak zar kılıfı atardamarları ve arteriyolleri, yani en ince atardamar dallarını, tümüyle sarıyordu. Bu kılıf beyin içinde, pia altında ve subaraknoid boşlukta görüldü (Zhang ve ark., 1990). Beyin içindeki ve pia altındaki venüllerin çevresinde ise benzer bir kılıf yoktu (Zhang ve ark., 1990). Arteriyoller incelip düz kas katlarını yitirdikçe kılıf da eksikleşir (Zhang ve ark., 1990).

**Kaynaklar burada ayrışır.** OpenStax, beyin dokusunu besleyen damarların yumuşak zar ile sinir dokusu arasında olduğunu yazar (OpenStax 13.3). UTHealth ders kitabı ve Joost ve arkadaşları ise büyük yüzey damarlarını yumuşak zarın üstünde, subaraknoid boşlukta gösterir (Dafny, 2020; Joost ve ark., 2026). Pia altı boşlukta da damarlar vardır (Joost ve ark., 2026). Ama beyin yüzeyindeki büyük damarlar subaraknoid boşluktadır. Bu ders ikinci anlatımı esas alır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Damarın çevresinde yumuşak zar kılıfı var mı?',
      sutunlar: ['Damar', 'Kılıf', 'Kaynak'],
      satirlar: [
        [
          'Subaraknoid boşluktaki atardamarlar ve toplardamarlar',
          'Var: yumuşak zarla sürekli bir leptomeningeal hücre kılıfı',
          '(Joost ve ark., 2026)',
        ],
        ['Beyin içindeki atardamarlar ve arteriyoller', 'Var: ince bir yumuşak zar kılıfı damarı tümüyle sarar', '(Zhang ve ark., 1990)'],
        ['Beyin içindeki ve pia altındaki venüller', 'Benzer bir kılıf görülmedi', '(Zhang ve ark., 1990)'],
        [
          'Kılcal damar düzeyi',
          'Kılıf ve damar çevresi boşluk burada biter: damarın iç örtüsü glia bazal zarıyla kaynaşır',
          '(Joost ve ark., 2026)',
        ],
      ],
      not: 'Joost ve arkadaşlarına göre toplardamarlarda kılıfın uzandığı bölüm atardamarlardakinden kısadır (Joost ve ark., 2026). Zhang ve arkadaşlarının çalışması yalnızca özetinden okundu.',
    },

    // ——— Damar çevresi boşluklar: temel ———
    {
      tur: 'metin',
      md: `Yumuşak zar beyin yüzeyinde kalmaz. Beynin içine dik olarak giren ve çıkan damarların çevresine bir kılıf gibi iner. Damar duvarı ile bu kılıf arasında sıvı dolu bir aralık kalır. Bu aralığa **damar çevresi boşluk** ya da **Virchow–Robin boşluğu** denir (Joost ve ark., 2026). Bu boşluklar dışta glia limitansla sınırlanır (Barisano ve ark., 2022).

Bu boşlukları ilk kez 1840’larda Durand-Fardel ve Pestalozzi anlattı. Ama adlarını, 1850’lerde onları tanımlayan iki bilim insanından alırlar: Alman patolog Rudolf Virchow ve Fransız anatomist Charles Philippe Robin (Barisano ve ark., 2022).

MR’da bu boşluklar kesit düzlemine dik gelirse nokta, paralel gelirse çizgi gibi görünür (Barisano ve ark., 2022). En sık bazal ganglionlarda ve yarımkürelerin derin ak maddesinde (*centrum semiovale*) görülürler (Barisano ve ark., 2022). Bazal ganglionlar, beynin derinindeki gri cevher çekirdekleridir. Bu boşluklar sağlıklı insanlarda da görülür. 1–30 yaş arası 125 sağlıklı kişinin hepsinde yüksek çözünürlüklü MR’da seçildiler (Groeschel ve ark., 2006). Yazarlara göre sağlıklı kişide MR’da görülen bu boşluklar, genişlemiş olsalar bile normal bir bulgudur (Groeschel ve ark., 2006).

Damar çevresi boşluklar 150 yılı aşkın süre önce tanımlandı. Son yıllarda beyin dokusu arasındaki sıvının ve atıkların temizlenmesindeki rolleri yüzünden yeniden öne çıktılar; bu temizliğin özellikle uykuda önemli olduğu düşünülür (Wardlaw ve ark., 2020). Bu temizlik tartışması “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümündedir.`,
    },

    // ——— Damar çevresi boşluklar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kabukta ve derinde farklı.** Leptomeningeal kılıf ve damar çevresi boşluk, delici atardamarlar boyunca kılcal damar düzeyine kadar uzanır. Orada damarın iç örtüsü glia bazal zarıyla kaynaşır ve boşluk kapanır (Joost ve ark., 2026). Beyin kabuğundaki atardamarların çevresindeki boşluk normalde çoğunlukla sıkıdır ve pek açık değildir. Bazal ganglionlarda ve ak maddede ise boşluk daha açıktır. Burada damarı iki eş merkezli leptomeningeal kat sarar; boşluk bu iki katın arasındadır (Joost ve ark., 2026).

Weller ve arkadaşları daha keskin bir ayrım yapar. Kabukta atardamar duvarına tek kat leptomeningeal hücre yapışır. Bu yüzden kabuktaki atardamarların çevresinde damar çevresi boşluk yoktur (Weller ve ark., 2018). Ak maddede ve bazal ganglionlarda ise iki katlı kılıf bu boşluğu oluşturur (Weller ve ark., 2018). Parillo ve arkadaşlarına göre de beyin tabanından bazal ganglionlara giren arteriyoller iki kat ince zarla sarılır. Aradaki boşluk subaraknoid boşlukla bağlantılıdır (Parillo ve ark., 2024). Bu bağlantının gerçekten var olup olmadığı ise tartışmalıdır.

**Gray’in anlatımı.** Gray 1918’e göre yumuşak zar boşluğa, dış yüzünü döşeyen bir mezotel örtü olarak girer. Dışarıdan değişen bir uzaklıkta bu hücreler tanınmaz olur ve yerlerini glia alır (Gray, 1918). Gray bu kanallardan, sinir hücresinden subaraknoid boşluğa doğru az miktarda sıvı aktığını düşünür (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Damar çevresi boşluklar MR’da nerede görülür?',
      aciklama:
        'Beynin derin yapılarına soldan bakıyoruz: ön taraf ekranın solunda, tepe yukarıda. Kabuk gizlendi; yarımkürelerin ak maddesi saydam çizildi. Damar çevresi boşluklar modelde görülmez; etiketler MR’da en sık görüldükleri yerleri gösterir. Turuncu: putamen ve globus pallidus (bazal ganglionlar; tip I). Pembe: orta beyin ve beyin ayakları (tip III). Saydam ak madde: yarımkürelerin derin ak maddesi (tip II).',
      sahne: {
        katmanlar: ['beyaz', 'derin', 'sap'],
        renk: 'dogal',
        goster: [
          'beyaz-cevher',
          'putamen',
          'globus-pallidus',
          'kaudat-cekirdek',
          'talamus',
          'hipokampus',
          'amigdala',
          'orta-beyin',
          'serebral-pedinkul',
          'pons',
          'omurilik-sogani',
        ],
        saydam: ['beyaz-cevher'],
        boya: [
          { secici: ['putamen', 'globus-pallidus'], renk: TIP1 },
          { secici: ['orta-beyin', 'serebral-pedinkul'], renk: TIP3 },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'putamen-sol', metin: 'Tip I: bazal ganglionlar' },
          { yapi: 'beyaz-cevher-sol', metin: 'Tip II: derin ak madde (centrum semiovale)' },
          { yapi: 'orta-beyin', metin: 'Tip III: orta beyin' },
          { yapi: 'hipokampus-sol', metin: 'Hipokampus: Potter ölçeğine alınmaz' },
          { yapi: 'pons', metin: 'Köprü: burada da görülebilir' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**MR’da nasıl tanınır?** Normalde damar çevresi boşluğun MR’daki kesit çapı 2 mm’den küçüktür (Barisano ve ark., 2022). Ramaswamy ve arkadaşlarına göre boşluk damara dik kesitte yuvarlak ya da ovaldir; çapı genellikle 3 mm’den küçüktür (Ramaswamy ve ark., 2022). BT’de boyanmaz, kireç içermez ve BOS yoğunluğundadır. MR’da T1 ve FLAIR görüntülerinde karanlık, T2’de parlaktır ve çevresine baskı yapmaz. Boşluklar birbiriyle bağlantılı olduğu için difüzyon görüntülerinde kısıtlanma göstermez (Parillo ve ark., 2024). Kontrast madde de almazlar. Kan ile beyin dokusu arasında kan-beyin engeli vardır. Bu engel, klinikte kullanılan gadolinyumlu maddeleri bu boşluklara geçirmez (Absinta ve ark., 2017).

**Potter ölçeği.** Potter ve arkadaşları MR’da görülen boşluğu şöyle tanımladı: BOS sinyalinde, keskin sınırlı, kesit çapı 3 mm’den küçük ve delici damarın yolunu izleyen küçük yapılar (Potter ve ark., 2015). Ölçek üç bölgeye bakar: bazal ganglionlar, yarımküre ak maddesi (*centrum semiovale*) ve orta beyin. Bazal ganglionlarda ve ak maddede boşluklar sayılır ve 0–4 arası puan verilir. Orta beyinde ise yalnızca boşluk görünüp görünmediğine bakılır: 0 yok, 1 var demektir (Potter ve ark., 2015).

**Yaşla değişim.** Küçük Virchow–Robin boşlukları her yaşta görülür. Yaş ilerledikçe daha sık ve daha büyük görünürler. Gözle bakıldığında sinyalleri bütün MR dizilerinde BOS ile aynıdır (Kwee ve Kwee, 2007). Yaşları 8 ile 90 arasında olan yaklaşık 1400 sağlıklı kişide de yaşla birlikte boşluklar genişledi ve sayıca arttı. Erkeklerde boşluk yükü kadınlardan fazlaydı (Lynch ve ark., 2023). 3 tesla ve üstü güçlü MR’lar, genişlememiş boşlukları bile neredeyse herkeste gösterebilir. Buna sağlıklı ergenler ve genç erişkinler de dahildir (Barisano ve ark., 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Damar çevresi boşlukların tipik yerleri',
      sutunlar: ['Tip', 'Yer', 'Hangi damar boyunca?', 'Not'],
      satirlar: [
        [
          'Tip I',
          'Bazal ganglionlar',
          'Ön delikli maddeden giren lentikülostriat atardamarlar (Kwee ve Kwee, 2007)',
          'MR’da en sık görüldükleri iki yerden biri (Barisano ve ark., 2022)',
        ],
        [
          'Tip II',
          'Yüksek konveksitede yarımküre ak maddesi (centrum semiovale)',
          'Kabuğa girip ak maddeye uzanan delici medüller atardamarlar (Kwee ve Kwee, 2007)',
          '7 tesla MR’a göre burada görülenlerin çoğu atardamar çevresindedir (Barisano ve ark., 2022)',
        ],
        [
          'Tip III',
          'Orta beyin (Kwee ve Kwee, 2007); orta beyin-talamus bölgesi (Parillo ve ark., 2024)',
          '—',
          'Dev boşlukların en sık yeri; beyin su yoluna basabilir (Parillo ve ark., 2024)',
        ],
        ['Tip IV', 'Şakak lobunun ön-üst bölümü (Parillo ve ark., 2024)', '—', '—'],
      ],
      not: 'Kwee ve Kwee üç tip tanımlar; dördüncü tip Parillo ve arkadaşlarının sınıflamasındadır. Boşluklar hipokampusta, orta beyinde, köprüde ve beyincikte de görülebilir (Barisano ve ark., 2022). Kwee ve Kwee’nin çalışması yalnızca özetinden okundu.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Aynı boşluk, farklı eşikler',
      sutunlar: ['Kaynak', 'Ölçüt', 'Ne için?'],
      satirlar: [
        ['(Barisano ve ark., 2022)', 'Kesit çapı normalde 2 mm’den küçük', 'Normal sınır'],
        [
          '(Potter ve ark., 2015)',
          'Kesit çapı 3 mm’den küçük, BOS sinyali, keskin sınır, delici damarın yolu',
          'MR’da görünür boşluğun tanımı; bazal ganglion ve ak maddede sayıya göre 0–4, orta beyinde var ya da yok (0/1)',
        ],
        ['Heier sınıflaması (Parillo ve ark., 2024)', '2 mm’den küçük hafif, 2–3 mm orta, 3 mm’den büyük ağır', 'Çapa göre derece'],
        ['(Zedde ve Pascarella, 2025a)', '1 mm’den büyük', '“Genişlemiş” boşluk'],
        ['(Ermiş ve ark., 2026)', '3 mm’den büyük', '“Genişlemiş” boşluk (sağlıklı genç erişkin çalışması)'],
        ['(Parillo ve ark., 2024)', '15 mm ve üstü; kitle etkisi ve kistik görünüm', '“Dev” boşluk'],
        ['(Conforti ve ark., 2023)', '1,5 cm’den büyük ve kitle etkisi', '“Dev” ya da tümör benzeri boşluk'],
      ],
      not: 'Eşikler çalışmadan çalışmaya değişir. Bu derste temel tanım olarak Potter ölçeğinin 3 mm’lik sınırı alındı. Potter ve arkadaşları ölçeğe ayrıca boyut ölçütü koymadı; çünkü rutin görüntülerde 2 mm’den küçük ve 2–3 mm’lik boşlukları ayırmak zordu (Potter ve ark., 2015). Ermiş ve arkadaşlarının çalışması yalnızca özetinden okundu.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Damar çevresi boşluk mu, lakün mü?',
      sutunlar: ['Özellik', 'Damar çevresi boşluk', 'Lakün (eski, küçük bir enfarkt)'],
      satirlar: [
        [
          'Boyut',
          'Genellikle 3 mm’den küçük (Ramaswamy ve ark., 2022)',
          'Çoğunlukla 3–15 mm (Barisano ve ark., 2022); 5 mm’den büyük olma olasılığı daha yüksek (Ramaswamy ve ark., 2022)',
        ],
        [
          'Bazal ganglionlardaki yeri',
          'Daha çok alt üçte birde, ön komissüre yakın (Barisano ve ark., 2022)',
          'Daha çok üst üçte ikide (Barisano ve ark., 2022; Ramaswamy ve ark., 2022)',
        ],
        ['Simetri', '—', 'Simetrik olmama eğilimi (Barisano ve ark., 2022)'],
        ['FLAIR görüntü', 'Karanlık (Parillo ve ark., 2024)', 'Çevresinde parlak bir halka (Ramaswamy ve ark., 2022)'],
        [
          'Başka yerler',
          'Hipokampus, orta beyin, köprü, beyincik (Barisano ve ark., 2022)',
          'Kabuk ve beyin sapı (Ramaswamy ve ark., 2022)',
        ],
      ],
      not: 'Kural kesin değildir. Genişlemiş bir damar çevresi boşluk 1 cm’yi aşabilir ve enfarkta benzeyen parlak bir halka taşıyabilir. Bu durumda proton yoğunluğu görüntüleri ayırmaya yardım eder (Ramaswamy ve ark., 2022). Enfarkt, beslenmesi kesilen dokunun ölmesiyle kalan alandır; ayrıntısı damar derslerinde anlatılacak.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Potter ölçeğinin ayrıntıları',
      md: `- **Puanlama:** Bazal ganglionlarda ve yarımküre ak maddesinde sayı şöyle puanlanır: 0 = yok, 1 = 1–10, 2 = 11–20, 3 = 21–40, 4 = 40’tan fazla. Orta beyin yalnızca 0 (görünür boşluk yok) ya da 1 (var) alır (Potter ve ark., 2015).
- **Uyum:** İki nöroradyoloğun puanları bazal ganglionlarda en tutarlıydı. Gözlemciler arası uyum (kappa) burada 0,8–0,9 idi. Yarımküre ak maddesinde 0,61–0,8’e indi. Orta beyinde en düşüktü: 0,51–0,52 (Potter ve ark., 2015).
- **Hipokampus neden yok?** Hipokampus ölçekten çıkarıldı. Eksenel görüntülerde değişken görünür ve hipokampus yarığının küçük kistleriyle karışabilir (Potter ve ark., 2015).
- **Hangi damar?** 7 tesla çalışmalarına göre yarımküre ak maddesinde MR’da görülen boşlukların çoğu toplardamar değil, atardamar çevresindedir (Barisano ve ark., 2022).
- **MR’da görülen gerçekten orada mı?** Canlı MR’da görülen boşluklar ölüm sonrası MR ile karşılaştırıldı. Çadır üstü ak maddede ortanca %80’i yeniden gösterilebildi. Bazal ganglionlarda bu oran ortanca %47 idi (Haider ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Boşluklar ne zaman önem kazanır?',
      md: `- Bazal ganglionlarda MR’da görülen boşlukların artışı daha çok küçük damar hastalığı ve yüksek tansiyonla ilişkilidir. Ak maddedekiler ise amiloid birikimiyle ilişkili hastalıklarla daha çok ilişkilidir (Lynch ve ark., 2023). Bazal ganglionlarda çok sayıda genişlemiş boşluk, yüksek tansiyona bağlı beyin kanamasıyla ilişkilidir (Zedde ve Pascarella, 2025a).
- Boşluklar anormal ölçüde genişleyebilir. Nadiren beyinde su birikmesine (hidrosefali) yol açarlar. Kistik tümörleri ve enfeksiyonları taklit edebilirler (Rudie ve ark., 2018).
- Kafa tabanında yumuşak zar ile örümcek ağı zar arasındaki boşluk, küçük damarların çevresinde Virchow–Robin boşlukları olarak sürer (Mahendru ve Chong, 2009). Kanser yayılımının (metastaz) ve kriptokok mantar enfeksiyonunun bu yola eğilimli olduğu bilinir (Mahendru ve Chong, 2009).

Rudie ve arkadaşlarının çalışması yalnızca özetinden okundu.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Noktalar mı, eski bir inme mi?',
      oyku: 'Altmış sekiz yaşında, yıllardır yüksek tansiyonu olan bir erkek baş dönmesi yakınmasıyla MR çektiriyor. Nörolojik muayenesi normal. T2 görüntülerde iki yanda, bazal ganglionların alt kısmında, ön komissüre yakın çok sayıda küçük nokta ve çizgi var. Bunlar keskin sınırlı ve BOS gibi parlak. Çoğu 2 mm dolayında; FLAIR’de karanlık. Sol putamenin üst kısmında ise 8 mm’lik, düzensiz bir boşluk var. Çevresinde FLAIR’de parlak bir halka seçiliyor.',
      soru: 'Hangi bulgular damar çevresi boşluğa, hangisi eski bir lakün enfarktına uyar?',
      cozum:
        'Alt kısımdaki küçük noktalar damar çevresi boşluğa uyar. Bu boşluklar BOS sinyalinde ve keskin sınırlıdır. Kesit çapları 3 mm’den küçüktür ve delici damarların yolunu izler (Potter ve ark., 2015). FLAIR’de karanlıktırlar (Parillo ve ark., 2024). Bazal ganglionlarda daha çok alt üçte birde, ön komissüre yakın yerleşirler (Barisano ve ark., 2022). Üstteki 8 mm’lik boşluk ise lakünü düşündürür. Lakünler genellikle 3–15 mm’dir, simetrik olmama eğilimindedir ve bazal ganglionların üst üçte ikisinde daha sıktır (Barisano ve ark., 2022). Eski enfarktta FLAIR’de parlak bir halka görülebilir (Ramaswamy ve ark., 2022). Ama tek bir ölçüt yetmez: genişlemiş boşluk da 1 cm’yi aşabilir ve halka taşıyabilir (Ramaswamy ve ark., 2022). Bazal ganglionlardaki boşluk yükü küçük damar hastalığı ve yüksek tansiyonla ilişkilidir (Lynch ve ark., 2023). *Vaka eğitim için kurgulanmıştır.*',
    },

    // ——— Damar çevresi boşluklar: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Uzun bir tartışma: boşluk subaraknoid boşluğa açılır mı?** Bu soru 19. yüzyıldan beri sorulur. Virchow 1851’de küçük beyin damarlarının iç ve orta katları ile dış katı (adventisya) arasında boşluklar tanımladı. Ona göre bu boşluklar subaraknoid boşlukla doğrudan iletişimdeydi (Gouveia-Freitas ve Bastos-Leite, 2021). Robin 1859’da benzer boşlukları anlattı. Ama onları damarın dış katının içinde kapalı kanallar olarak gördü (Gouveia-Freitas ve Bastos-Leite, 2021). His 1865’te beyin dokusuna mürekkep verdi ve delici damarların çevresinde boşluklar gördü. Bunları “sinir sisteminin lenf yolları” sandı. Woollam ve Millen ise bu boşlukları sonradan yapay saydı (Gouveia-Freitas ve Bastos-Leite, 2021). Key ve Retzius 1875’te delici damarların çevresinde BOS içeren huni biçimli boşluklar tanımladı. Bunlara “Piatrichter”, yani pia hunisi dediler (Gouveia-Freitas ve Bastos-Leite, 2021).

**Kapalı diyenler.** Hutchings ve Weller’e göre ne yumuşak zar ne de subaraknoid boşluk, damarların yanında kabuğun içine uzanır (Hutchings ve Weller, 1986). Yeni subaraknoid kanaması olan beyinlerde kırmızı kan hücreleri damar çevresi boşluklara girmemişti. Ölüm sonrası subaraknoid boşluğa verilen Çin mürekkebi de geçmedi (Hutchings ve Weller, 1986). Joost ve arkadaşlarının özetlediği modele göre damar çevresi boşluk subaraknoid boşluğa değil, pia altı boşluğa bağlanır. Bazı insan MR çalışmaları bunu destekler (Joost ve ark., 2026). Ankara’dan Öztürk ve Aydingöz 44 kişide boşlukların T2 sinyalini ölçtü. Sinyal BOS’unkinden anlamlı farklıydı. Bu, boşlukların BOS dolu bir subaraknoid kılıf değil, hapsolmuş doku arası sıvı olduğu görüşüyle uyumludur (Öztürk ve Aydingöz, 2002).

**Açık diyenler.** Zhang ve arkadaşlarına göre yumuşak zar kılıfı bir sürekliliği düşündürür. Beyin içindeki atardamarların çevresindeki boşluklar, subaraknoid atardamarların çevresindekilerle doğrudan sürekli olabilir (Zhang ve ark., 1990). Derk ve arkadaşları subaraknoid boşluğun beyin içindeki damar çevresi boşluklarla sürekli olduğunu yazar. Böylece BOS’taki moleküller beyin dokusuna ulaşabilir (Derk ve ark., 2021). Eskişehir’den Saylisoy ve arkadaşları doğrudan iletişim olmadığını kabul eder. Ama 4 hasta bildirirler. Bunların 3’ünde subaraknoid kanama, 1’inde bel bölgesine verilen kontrast, iki yanda bazal ganglionların damar çevresi boşluklarına geçmişti (Saylisoy ve ark., 2014). Joost ve arkadaşlarına göre başka çalışmalar da iki bölme arasında işaretleyici alışverişi bildirir (Joost ve ark., 2026).

Kaynaklar “sürekli” sözcüğünü aynı anlamda kullanmayabilir. Kimi doğrudan bir açıklığı, kimi bir sızıntıyı, kimi molekül alışverişini anlatır. Soru bugün de açıktır; kesin bir hüküm verilemez (Joost ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Damar çevresi boşluk subaraknoid boşluğa açılır mı? İki görüş',
      sutunlar: ['Görüş', 'Kim, ne zaman?', 'Dayanak'],
      satirlar: [
        [
          'Bağlantılı',
          'Virchow, 1851 (Gouveia-Freitas ve Bastos-Leite, 2021)',
          'Damar katları arasındaki boşluklar subaraknoid boşluğa açılır',
        ],
        [
          'Bağlantılı',
          'Key ve Retzius, 1875 (Gouveia-Freitas ve Bastos-Leite, 2021)',
          'Delici damarların çevresinde BOS içeren huni biçimli boşluklar (Piatrichter)',
        ],
        ['Bağlantılı', '(Zhang ve ark., 1990)', 'Yumuşak zar kılıfı beyin içi ve subaraknoid atardamar çevresini sürekli kılar'],
        ['Bağlantılı', '(Mahendru ve Chong, 2009)', 'Kafa tabanında zarlar arası boşluk küçük damarların çevresinde sürer'],
        ['Bağlantılı', '(Parillo ve ark., 2024)', 'Bazal ganglionlarda iki kat arasındaki boşluk subaraknoid boşlukla iletişimdedir'],
        ['Bağlantılı', '(Derk ve ark., 2021)', 'BOS’taki moleküller bu yolla beyin dokusuna ulaşabilir'],
        ['Kapalı kanal', 'Robin, 1859 (Gouveia-Freitas ve Bastos-Leite, 2021)', 'Boşluklar damarın dış katının içinde kapalı kanallardır'],
        ['Kapalı', '(Hutchings ve Weller, 1986)', 'Kan hücreleri ve ölüm sonrası verilen Çin mürekkebi boşluklara geçmedi'],
        ['Kapalı', '(Weller ve ark., 2018)', 'Kabuktaki atardamarların çevresinde boşluk yok'],
        ['Kapalı', '(Öztürk ve Aydingöz, 2002)', 'MR sinyali BOS’tan farklı: hapsolmuş doku arası sıvı'],
        [
          'Pia altına açılır',
          '(Joost ve ark., 2026)',
          'Boşluk subaraknoid boşluğa değil, pia altı boşluğa bağlanır; bazı insan MR çalışmaları destekler',
        ],
        [
          'Ara durum',
          '(Saylisoy ve ark., 2014)',
          'Doğrudan iletişim yok sayılır, ama kan ve kontrast bazal ganglion boşluklarına geçebilir',
        ],
      ],
      not: 'Hutchings ve Weller, Zhang ve arkadaşları, Weller ve arkadaşları, Öztürk ve Aydingöz ile Saylisoy ve arkadaşlarının çalışmaları yalnızca özetinden okundu.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Neden bu kadar tartışmalı?',
      md: `- **Sabitleme boşluğu küçültür:** Canlı farede damar çevresi boşluğun kesit alanı, atardamarınkinin ortalama 1,4 katıdır. Doku sabitlenince bu oran 0,14’e düşer; yani boşluk çöker (Mestre ve ark., 2018). Bu yüzden ölü dokuda dar görünen bir boşluk, canlıda çok daha geniş olabilir.
- **Akım:** Canlı farede bu boşluklardaki sıvı akımı da ölçüldü. Bu ölçümler ve beyin temizliği tartışması “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümündedir.
- **Yapay bulgu riski:** Joost ve arkadaşlarına göre elektron mikroskobu ve işaretleyici çalışmaları yapay bulgulara açıktır. Bu yüzden zar bölmeleri arasındaki süreklilik sorusu hâlâ önemlidir (Joost ve ark., 2026). Benzer bir sorun örümcek ağı zarda da görülür: formalin bazı ince zarları kısmen eritir (Volovici ve ark., 2020).
- **Göz mü, ölçüm mü?** Kwee ve Kwee’ye göre gözle bakıldığında boşlukların sinyali bütün dizilerde BOS ile aynıdır (Kwee ve Kwee, 2007). Ölçerek yapılan Ankara çalışması ise T2’de anlamlı bir fark buldu (Öztürk ve Aydingöz, 2002). Gözle değerlendirme ile ölçüm her zaman aynı sonucu vermez.

Mestre ve arkadaşlarının ölçümleri farede yapıldı; insana doğrudan aktarılamaz.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Dev damar çevresi boşluklar.** Damar çevresi boşluklar bazen çok büyür. Parillo ve arkadaşlarına göre 15 mm ve üstü çapta, kitle etkisi yapan ve kist gibi görünen boşluklar “dev” sayılır. Bunların öteki kistik hastalıklardan ayrılması gerekir (Parillo ve ark., 2024). Conforti ve arkadaşları ise 1,5 cm’yi aşan ve kitle etkisi yapanlara “dev ya da tümör benzeri” boşluk der (Conforti ve ark., 2023).

Dev boşluklar en sık orta beyin-talamus bölgesindedir (tip III). Burada beyin su yoluna (Sylvius kanalı) basabilir ve tıkayıcı hidrosefaliye yol açabilirler (Parillo ve ark., 2024). Tip 3 dev boşluklar, beyin su yoluna ya da üçüncü karıncığa bastıkları için hastaların en az %75’inde belirti verir (Conforti ve ark., 2023). İnce yapılarını göstermede 3B CISS dizisi temel önemdedir (Conforti ve ark., 2023). Dev boşluklar genellikle durağandır; bazı olgular 7 yıla kadar izlendi (Okar ve ark., 2023).

**Neden genişler?** Okar ve arkadaşları dört olası neden sayar. Birincisi doku arası sıvı dolaşımının bozulmasıdır. İkincisi atardamarların sarmal biçimde uzamasıdır. Üçüncüsü beyin dokusunun küçülmesi ya da damar çevresindeki miyelin kaybıdır. Dördüncüsü bağışıklık hücrelerinin birikmesidir (Okar ve ark., 2023). Bazal ganglionlarda yaygın genişlemiş boşluklar delik delik bir görünüm verir. Durand-Fardel bu görünüme “état criblé” (*status cribrosum*), yani kalbur görünümü dedi (Parillo ve ark., 2024).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den çalışmalar: damar çevresi boşluklar',
      sutunlar: ['Nerede, kimler?', 'Yöntem', 'Ne buldu?'],
      satirlar: [
        [
          'Ankara; 44 kişi (Öztürk ve Aydingöz, 2002)',
          '3B T2 MR’da boşlukların ve BOS’un sinyali ölçüldü',
          'Boşlukların sinyali BOS’unkinden anlamlı farklı: hapsolmuş doku arası sıvı görüşüyle uyumlu',
        ],
        [
          'Eskişehir; 4 hasta (Saylisoy ve ark., 2014)',
          'Olgu bildirimi',
          '3 hastada subaraknoid kanama, 1 hastada bel bölgesine verilen kontrast bazal ganglion boşluklarına geçti',
        ],
        [
          'İstanbul; 24 sağlıklı genç erişkin, yaş 32,3 ± 6,2 (Ermiş ve ark., 2026)',
          '3 tesla MR; difüzyon tensör görüntülemeden hesaplanan DTI-ALPS indeksi',
          'Boşluk yükü ile indeks arasında güçlü ters ilişki: puan için ρ = −0,869, sayı için ρ = −0,888; genişlemiş boşluk sınırı 3 mm',
        ],
      ],
      not: 'Ermiş ve arkadaşlarına göre bu ilişki beyin temizliğiyle ilgili olası bir gösterge olabilir, ama henüz doğrulanmamıştır (Ermiş ve ark., 2026). Üç çalışma da yalnızca özetinden okundu.',
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Orta beyinde büyük bir kist',
      oyku: 'Elli iki yaşında bir kadın, birkaç aydır artan baş ağrısı ve yürürken dengesizlik yakınmasıyla başvuruyor. MR’da sağ orta beyin-talamus bölgesinde 17 mm’lik, birkaç bölmeli, BOS ile aynı sinyalde kistik bir yapı var. Yapı beyin su yoluna basıyor; yan karıncıklar ve üçüncü karıncık genişlemiş. Kontrast tutulumu yok. İlk rapor “kistik tümör olabilir” diye yazılmış.',
      soru: 'Bu görüntü hangi normal yapının aşırı genişlemesi olabilir, ve hangi özellikler bunu destekler?',
      cozum:
        'Bu, dev bir damar çevresi boşluk olabilir. Parillo ve arkadaşlarına göre 15 mm ve üstü, kitle etkisi yapan, kistik görünen boşluklar “dev” sayılır (Parillo ve ark., 2024). Dev boşluklar en sık orta beyin-talamus bölgesinde (tip III) görülür. Burada beyin su yoluna basıp tıkayıcı hidrosefaliye yol açabilirler (Parillo ve ark., 2024). Tip 3 dev boşluklar hastaların en az %75’inde belirti verir (Conforti ve ark., 2023). Damar çevresi boşluklar kontrast almaz; çünkü kan-beyin engeli gadolinyumu bu boşluklara geçirmez (Absinta ve ark., 2017). Genişlemiş boşluklar kistik tümörleri ve enfeksiyonları taklit edebilir (Rudie ve ark., 2018). İnce yapıyı göstermede 3B CISS dizisi önemlidir (Conforti ve ark., 2023). Dev boşluklar çoğunlukla durağandır (Okar ve ark., 2023). Bu hastadaki beyin su yolu basısı ise tip III dev boşlukların bilinen bir sonucudur (Parillo ve ark., 2024). *Vaka eğitim için kurgulanmıştır.*',
    },

    // ——— Koroid tela ve koroid pleksus: temel ———
    {
      tur: 'metin',
      md: `Yumuşak zar bazı yerlerde beyin yüzeyinden ayrılır ve beynin içine, karıncıklara doğru katlanır. Gray 1918’e göre üçüncü karıncığın **koroid telasını** ve yan ve üçüncü karıncıkların **koroid pleksuslarını** bu içe katlanma yapar (Gray, 1918). Koroid tela, karıncık tavanındaki ince örtüyü dıştan saran, damardan zengin bir bağ dokusu yaprağıdır (FIPAT, 2019). Koroid pleksus ise karıncıkların içinde, damardan zengin, kıvrımlı bir dokudur.

İlk derste BOS’un çoğunu koroid pleksusun yaptığını gördük. Bu sıvıyı nasıl yaptığı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak. Burada yalnızca onun bir zar yapısı olduğunu akılda tut.

Aşağıdaki sahnede yan karıncıkların içindeki koroid pleksusu görüyorsun. Karıncıklar saydam çizildi; böylece içlerindeki koroid pleksus seçilebiliyor.`,
    },
    {
      tur: 'sahne',
      baslik: 'Yan karıncığın koroid pleksusu',
      aciklama:
        'Karıncıklara soldan bakıyoruz: ön taraf ekranın solunda, tepe yukarıda. Karıncıklar saydam çizildi. İçlerindeki kırmızı şerit yan karıncığın koroid pleksusudur. Talamus doğal renginde. Koroid pleksus, yumuşak zarın karıncığa katlanmasıyla oluşan, damardan zengin bir dokudur. Modelde yalnızca yan karıncıkların koroid pleksusu var; üçüncü ve dördüncü karıncıklarınki gösterilmedi.',
      sahne: {
        katmanlar: ['karincik', 'derin'],
        renk: 'dogal',
        goster: [
          'yan-karincik',
          'koroid-pleksus',
          'karinciklar-arasi-delik',
          'ucuncu-karincik',
          'beyin-su-yolu',
          'dorduncu-karincik',
          'talamus',
        ],
        saydam: ['yan-karincik', 'karinciklar-arasi-delik', 'ucuncu-karincik', 'beyin-su-yolu', 'dorduncu-karincik'],
        boya: [{ secici: ['koroid-pleksus'], renk: KOROID }],
        bakis: 'sol',
        etiketler: [
          { yapi: 'koroid-pleksus-sol', metin: 'Koroid pleksus (yan karıncık)' },
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Koroid tela ve koroid pleksus: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Resmî adlar.** TA2’de koroid tela (*tela chorioidea*) ve koroid pleksus (*plexus chorioideus*), kafa piasının alt terimleridir (FIPAT, 2019). Yani resmî terim listesi de onları yumuşak zarın bir parçası sayar.

**Karıncık tavanı.** TA2’nin bir notu 1895 tarihli eski Basel listesinden (BNA) gelir. Bu nota göre üçüncü ve dördüncü karıncığın tavanında sinir dokusu gelişmez. Orada ince bir epitel yaprağı vardır. Bu yaprağın dış yüzü baştan sona, damardan zengin bağ dokusu yapraklarıyla örtülüdür; bunlar koroid telalardır (FIPAT, 2019).

**Kenar çizgileri.** Beynin sıkı dokusu bazı keskin kenarlar boyunca koroid telanın epitel örtüsüne geçer. TA2’nin notu bu kenarlara “tenya” (*taenia*) adını verir (FIPAT, 2019). Bu kenarlardan biri koroid tenyadır (*taenia chorioidea*) (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Koroid yapılar: adlar',
      sutunlar: ['Türkçe', 'TA2 adı (kimlik)', 'Nedir?'],
      satirlar: [
        ['Koroid tenya', 'taenia chorioidea (5407)', 'Beynin sıkı dokusunun koroid tela epiteline geçtiği kenar çizgisi'],
        ['Koroid tela', 'tela chorioidea (5408)', 'Karıncık tavanındaki epiteli dıştan örten, damardan zengin bağ dokusu yaprağı'],
        ['Koroid pleksus', 'plexus chorioideus (5409)', 'Karıncık içindeki kıvrımlı, damardan zengin doku; kafa piasının alt terimi'],
      ],
      not: 'Bütün satırlar TA2’den ve TA2’nin notlarından alındı (FIPAT, 2019). Koroid pleksusun BOS yapımı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak.',
    },

    // ——— Koroid tela ve koroid pleksus: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Koroid pleksus zarlardan ayrı değil',
      md: `Koroid pleksus ile zarlar arasındaki bağ yalnızca bir ad benzerliği değildir. Koroid pleksusun doku iskeleti (stroma) subaraknoid boşlukla süreklidir. Pleksusu birçok noktada örümcek ağı zar bölmesine bağlar (Joost ve ark., 2026). Yan karıncığın koroid pleksusunun stromasında fibroblastlar ve damarlar bulunur. Bunlar komşu zarlarla uzayda kesintisiz bir bütün oluşturur (Dorrier ve ark., 2022).

Gray 1918’e göre yumuşak zar eksik bir zardır. Magendie ve iki Luschka deliğinde büyük olasılıkla bulunmaz. Bütün damarlar onu kendine özgü bir biçimde deler (Gray, 1918). Bu delikler dördüncü karıncığı subaraknoid boşluğa bağlar (Zedde ve Pascarella, 2025a). Ayrıntısı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak.`,
    },

    // ——— Omurilikte yumuşak zar: temel ———
    {
      tur: 'metin',
      md: `Yumuşak zar omuriliği de sarar. Omuriliğe sıkıca yapışır ve omuriliğin damarları onun yüzeyinde uzanır (Byrne ve Dafny, 2026). Omurilikte yumuşak zar beyindekinden daha kalın, daha sıkı ve daha az damarlıdır. Çünkü dışında ek bir lifli kat taşır (Gray, 1918).

Omuriliğin iki yanında yumuşak zar, sert zara doğru diş diş uzanan ince bağlar yapar: **dişli bağlar** (*ligamenta denticulata*). Bu bağlar omuriliği kanalın ortasında tutar. Omurilik adeta kanalın içinde “yüzer” (Byrne ve Dafny, 2026).

Omurilik belin üst kısmında biter. Yumuşak zar onun ucundan aşağıya ince bir iplik gibi devam eder: **filum terminale**. Bu iplik sert zarı deler ve kuyruk sokumuna doğru bir bağ olarak sürer (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Yumuşak zar:** En içteki zardır. Beyne ve omuriliğe sıkıca yapışır ve her oluğa iner.

**Glia limitans:** Yumuşak zarın hemen altındaki, astrositlerin kurduğu sınırdır.

**Damarlar:** Beyin yüzeyindeki büyük damarlar yumuşak zarın üstünde, subaraknoid boşluktadır.

**Damar çevresi boşluk (Virchow–Robin):** Beyne dalan damarların çevresindeki sıvı dolu aralıktır. MR’da nokta ya da çizgi gibi görünür ve sağlıklı kişide de görülür.

**Koroid pleksus:** Yumuşak zarın karıncıklara katlanmasıyla oluşan, damardan zengin dokudur.

**Omurilikte:** Dişli bağlar omuriliği yanlardan sert zara bağlar. Filum terminale omuriliğin ucundan aşağı iner.`,
    },

    // ——— Omurilikte yumuşak zar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dişli bağlar.** Dişli bağlar, omuriliğin yan yüzünden sert zarın iç yüzüne uzanan çift katlı yumuşak zar kıvrımlarıdır. Her yanda yaklaşık 21 diş gibi uzantıyla sert zara tutunurlar (Byrne ve Dafny, 2026). Gray de dişleri her yanda 21 sayar. İlki büyük deliğin kenarı hizasında, omurga atardamarı ile dil altı siniri arasında tutunur (Gray, 1918). Yani dişli bağların ilki kafatası ile omurganın birleştiği yerdedir.

**Parlak çizgi.** Omuriliğin ön yüzünde, orta hatta boylamasına lifli bir bant uzanır: **linea splendens** (Gray, 1918). TA2’nin notuna göre bu, ön omurilik atardamarının çevresinde yumuşak zarın kalınlaşmasıdır (FIPAT, 2019).

**Filum terminale.** TA2 filum terminaleyi iki parçaya ayırır. Sert zar kesesinin içindeki parça *filum terminale internum*dur; yumuşak zardan yapılır. Kesenin dışındaki parça *filum terminale externum*dur; buna koksigeal bağ da denir (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Yumuşak zar: bir-iki katlı leptomeningeal hücre tabakası; desmozom ve oluklu bağlantılar (Joost ve ark., 2026).
- Glia limitans: astrosit ayakları ve bazal zar; yüzeyel ve damar çevresi kısım; yetişkin kabuğunda 20–40 µm (Joost ve ark., 2026; Brøchner ve ark., 2015).
- Subaraknoid boşlukta atardamar ve toplardamar var, kılcal damar yok (Joost ve ark., 2026).
- Damar çevresi boşluk normalde 2 mm’den küçük (Barisano ve ark., 2022). Potter tanımı: 3 mm’den küçük. Bazal ganglion ve ak maddede 0–4 puan, orta beyinde 0 ya da 1 (Potter ve ark., 2015).
- Tipler: I bazal ganglionlar, II yarımküre ak maddesi, III orta beyin (Kwee ve Kwee, 2007).
- Koroid tela ve koroid pleksus TA2’de kafa piasının alt terimleridir (FIPAT, 2019).
- Dişli bağ: her yanda yaklaşık 21 (Gray, 1918; Byrne ve Dafny, 2026). Linea splendens: ön omurilik atardamarı çevresinde yumuşak zar kalınlaşması (FIPAT, 2019).
- Filum terminale: internum (yumuşak zar) ve externum (koksigeal bağ) (FIPAT, 2019).`,
    },

    // ——— Omurilikte yumuşak zar: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kafa-omurga birleşiminde ilk dişli bağ',
      md: `Tubbs ve arkadaşları 15 kadavrada kafa içinde kalan ilk dişli bağı inceledi. Bağ, yalnızca bir sol yanda yoktu (Tubbs ve ark., 2011). Sert zara, omurga atardamarının sert zarı deldiği yerin hemen üstünde tutunuyordu. Her zaman omurga atardamarı ile aksesuar sinir arasında seyrediyordu. Dil altı siniri ise her zaman bağın üstündeydi (Tubbs ve ark., 2011). Gray ise ilk dişin tutunduğu yeri omurga atardamarı ile dil altı siniri arasında verir (Gray, 1918).

Bağ tek yanda kesilince omurilik-soğan birleşiminin dönmesi yaklaşık %25 arttı (Tubbs ve ark., 2011). Yazarlara göre bu komşulukları bilmek, kafa-omurga birleşimindeki ameliyatlarda işe yarayabilir (Tubbs ve ark., 2011).

Tubbs ve arkadaşlarının çalışması yalnızca özetinden okundu.`,
    },
  ],
};
