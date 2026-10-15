import type { DersBolumu } from '../../../types';

const GORME = '#e09a24';

/**
 * 13. bölüm: Zarları görüntülemek ve ameliyatta zarlar. BT ve MR’da normal zarlar, kalın zar ve ince zar boyanması,
 * FLAIR’de oluk içi parlaklık ve tuzakları, kafa içi düşük basıncın MR bulguları, sisternaların ince kesitli MR’ı,
 * sinüs görüntüleme tuzakları, zar lenf damarlarının MR’ı; cerrahi: kraniyotomi, sert zarın açılması ve kapatılması,
 * yama malzemeleri, BOS kaçağı ve psödomeningosel, sisternalar yoluyla cerrahi ve M. Gazi Yaşargil, sisternostomi,
 * sinüs yaralanması, köprü toplardamarları, menenjiyom cerrahisinde sert zar. Bilgiler S2 kaynak notlarından (D, C, A, B).
 */
export const goruntulemeVeCerrahi: DersBolumu = {
  id: 'goruntuleme-ve-cerrahi',
  baslik: 'Zarları görüntülemek ve ameliyatta zarlar',
  bloklar: [
    // ——— Giriş ———
    {
      tur: 'metin',
      md: `Hekim zarları iki yerde görür: görüntülerde ve ameliyat masasında. Bu bölüm ikisini birlikte anlatır. Önce zarların bilgisayarlı tomografide (BT) ve manyetik rezonans görüntülemede (MR) nasıl göründüğüne bakacağız. Sonra beyin cerrahının zarlarla nasıl çalıştığını göreceğiz. Cerrah sert zarı nasıl açar, nasıl kapatır? Beynin derinine, zarların arasındaki doğal yollardan nasıl ulaşır?

Sağlıklı zarlar çok incedir. Sert zarın kalınlığı ortalama 0,33–0,56 mm’dir (Ishikawa ve ark., 2026). Örümcek ağı zar, subaraknoid boşluğun içinde ince perdeler de yapar. Sağlıklı kişide bu perdelerin birçoğu, güçlü MR cihazlarında bile seçilemez (Zedde ve Pascarella, 2025a). Bu yüzden sağlıklı bir zar görüntüde ya ince bir çizgi gibi görünür ya da hiç görünmez. Kanama, iltihap ya da tümör perdeleri kalınlaştırınca onlar daha kolay görülür (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'metin',
      md: `**Boyalı çekim.** MR çekilirken bazen damardan bir ilaç verilir. Bu ilaca **kontrast madde** denir. Kan-beyin engeli olmayan dokularda kontrast madde damardan dokuya sızar. O doku da görüntüde parlar (Absinta ve ark., 2017). Sert zarda kan-beyin engeli yoktur. Bu yüzden kontrast verilince sağlıklı sert zar da biraz boyanır (Mahendru ve Chong, 2009). Bu normal boyanma ince, düzgün ve yer yer kesiklidir. Beynin üst yüzünü örten sert zarda, tabandakinden daha belirgindir (Mahendru ve Chong, 2009).

**BT mi, MR mı?** Zar boyanmasını aramak için bugün kontrastlı MR kullanılır. BT’de kafatasının iç yüzünün hemen altında bir görüntü bozulması (artefakt) oluşur. Bu bozulma, zarın boyanmasını görmeyi zorlaştırır (Mahendru ve Chong, 2009). BT’nin güçlü olduğu yer başkadır: taze kanı iyi gösterir. Kafatası ile sert zar arasında biriken taze kan, BT’de beyaz bir birikim olarak görülür (Heit ve ark., 2017). Subaraknoid boşluğa sızan taze kanı da ilk saatlerde neredeyse her zaman yakalar (Heit ve ark., 2017).

**FLAIR.** MR’ın bir çekim türü olan FLAIR’de beyin-omurilik sıvısı (BOS) karanlık görünür. Çünkü BOS’tan gelen sinyal bastırılır. Bu yüzden FLAIR, subaraknoid boşluğa karışan şeylere çok duyarlıdır (Mahendru ve Chong, 2009). Kıvrımların arasındaki oluklar FLAIR’de normalde karanlıktır. Bir oluğun içi parlarsa oraya bir şey karışmış olabilir: kan, iltihap ya da kanser hücreleri (Yazdani ve ark., 2019).

**İnce kesitler.** Bazı MR çekimleri çok ince kesitler alır. Bunlarda örümcek ağı zarın perdeleri, BOS’u kesen ince ve karanlık çizgiler olarak görülebilir (Zedde ve Pascarella, 2025a). Bu perdeler sisternaları birbirinden kısmen ayırır. Sisterna, subaraknoid boşluğun genişlediği yerdir.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Her parlaklık hastalık değildir',
      md: 'Görüntüde zarın parlaması tek başına hastalık demek değildir. Sağlıklı sert zar da kontrastla biraz boyanır (Mahendru ve Chong, 2009). Beyin ameliyatından sonra zarlardaki boyanma uzun süre kalabilir. Bu boyanma her zaman iltihap ya da tümör göstermez (Mahendru ve Chong, 2009). FLAIR’de olukların parlaması bile bazen yalnızca yüksek oranda oksijen solunmasından olur. Propofol adlı uyutma (anestezi) ilacı da aynı görüntüyü verebilir (Yazdani ve ark., 2019). Görüntüyü hekim, kişinin öyküsü ve muayenesiyle birlikte yorumlar.',
    },

    // ——— Normal boyanma ve iki örüntü ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Neden boyanır?** Sert zarda kan-beyin engeli yoktur (Mahendru ve Chong, 2009). Sert zar damarlarından kontrast madde gibi küçük moleküller dokuya sızabilir (Absinta ve ark., 2017). Beyinde ise kan-beyin engeli, klinikte kullanılan gadolinyumlu kontrast maddeyi geçirmez. Bu yüzden beyin dokusu ve damar çevresi (Virchow–Robin) boşluklar normalde boyanmaz (Absinta ve ark., 2017). Normal sert zar boyanması ince, düzgün ve kesintilidir. Beynin üst yüzünde (konveksite) tabandakinden daha çok görülür (Mahendru ve Chong, 2009).

**Anatomi örüntüyü belirler.** Örümcek ağı zar dıştan sert zara yaslanır (Mahendru ve Chong, 2009). Yumuşak zar ise beyne yapışıktır ve olukların içine kadar iner. Örümcek ağı zar oluklara inmez; bir kıvrımdan ötekine köprü kurar (Mahendru ve Chong, 2009). Zar boyanmasının iki ana örüntüsü bu anatomiden çıkar. Meltzer ve arkadaşları onları şöyle ayırdı (Mahendru ve Chong, 2009):

- **Sert zar–örümcek ağı zar örüntüsü.** Kısaca kalın zar (pakimeningeal) boyanması denir. Pakimeninks, sert zarın öteki adıdır ve “kalın zar” demektir (Mahendru ve Chong, 2009). Boyanma kafatasının iç yüzü boyunca uzanır. Yaygın olabilir ya da sert zara oturan odaksal bir kitle gibi görünür (Mahendru ve Chong, 2009).
- **Yumuşak zar–subaraknoid örüntü.** Kısaca ince zar (leptomeningeal) boyanması denir. Leptomeninks, örümcek ağı zar ile yumuşak zarın ortak adıdır; “ince zarlar” demektir (Mahendru ve Chong, 2009). Boyanma beyin yüzeyini yakından izler. Olukların dibine kadar dalgalı bir çizgi gibi iner (Mahendru ve Chong, 2009).

Bu ayrım hekime yol gösterir. Yumuşak zar örüntüsünde BOS’ta tümör hücresi daha sık bulunur. Bunun nedeni muhtemelen bu örüntünün subaraknoid boşluğa komşu olmasıdır (Mahendru ve Chong, 2009). Yalnızca sert zar tutulduğunda ise BOS incelemesi tekrar tekrar temiz çıkabilir. O zaman MR, doku örneğinin (biyopsi) nereden alınacağını gösterir (Mahendru ve Chong, 2009).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zar boyanmasının üç görünümü',
      sutunlar: ['Görünüm', 'Hangi zar?', 'Nasıl görünür?', 'Örnek nedenler'],
      satirlar: [
        [
          'Normal boyanma',
          'Sert zar',
          'İnce, düzgün, kesintili. Beynin üst yüzünde tabandakinden belirgin',
          'Sağlıklı kişi. Sert zarda kan-beyin engeli yoktur',
        ],
        [
          'Kalın zar (pakimeningeal) boyanması',
          'Sert zar ve ona yaslanan örümcek ağı zar',
          'Kafatasının iç yüzü boyunca yaygın boyanma ya da odaksal kitle',
          'Kafa içi düşük basınç; tümörün sert zarı tutması; kalın zar iltihabı (hipertrofik pakimenenjit); kraniyotomi ve şant sonrası; iyileşmiş subdural hematom ya da iltihap kesesi (ampiyem)',
        ],
        [
          'İnce zar (leptomeningeal) boyanması',
          'Yumuşak zar ve subaraknoid boşluk',
          'Beyin yüzeyini izleyen, olukların dibine inen dalgalı boyanma',
          'Menenjit; kanserin zarlara yayılması; subaraknoid kanama ve alt akut enfarkt (geçici); moyamoya hastalığında “sarmaşık işareti”',
        ],
      ],
      not: 'Kaynaklar: Mahendru ve Chong (2009); Patel ve ark. (2024). Kalın zar iltihabının kesin tanısı için doku örneği (biyopsi) gerekir (Mahendru ve Chong, 2009). Kafa içi düşük basınçtaki boyanma, damar dolgunluğu ve sert zara sızan sıvıyla olur (Patel ve ark., 2024).',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Hangi çekim, hangi soruya?',
      md: `- **Zar hastalığı aranıyorsa:** En duyarlı inceleme, üç düzlemde alınan kontrastlı T1 ağırlıklı MR’dır. Kontrast sonrası FLAIR, BOS sinyalini bastırdığı için subaraknoid hastalığa çok duyarlı bir yardımcıdır (Mahendru ve Chong, 2009).
- **Tüberküloz menenjiti:** İnce zar boyanması çoğunlukla düzgündür ve taban sisternalarında yoğunlaşır. Ağır olguda sisternalarda boyanan bir iltihap sıvısı (eksüda) birikir (Patel ve ark., 2024).
- **Viral menenjit:** İnce zar boyanması hiç olmayabilir ya da olukları yaygın tutabilir. En iyi kontrastlı FLAIR’de görülür (Patel ve ark., 2024).
- **Kafa içi düşük basınç:** BOS azalınca kafa içindeki damar hacmi artar. Toplardamar sinüsleri genişler ve yuvarlaklaşır. Sert zar, damar dolgunluğu ve sızan sıvı yüzünden boyanır (Patel ve ark., 2024). Bu tablonun kliniği “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kanamayı görmek',
      md: `- **BT ve taze subaraknoid kanama:** İki kaynak farklı süre verir. Bir derleme, BT’nin belirtiden sonraki ilk 6–24 saatte neredeyse %100 duyarlı olduğunu yazar (Heit ve ark., 2017). Kanada’daki büyük bir çalışmaya 3132 yetişkin alındı. Hepsinin nörolojik muayenesi normaldi ve baş ağrısı bir saat içinde en şiddetli hâline ulaşmıştı. Baş ağrısının ilk 6 saatinde çekilen BT kanamaların hepsini buldu. Bu sonuç yeni kuşak BT ve deneyimli bir radyoloğun yorumuyla alındı. Yazarlara göre 6 saatten sonra çekilen BT’nin duyarlılığı kabul edilemeyecek kadar düşüktür. Bütün zaman aralıkları birlikte alınınca duyarlılık %92,9’du (Perry ve ark., 2011).
- **MR:** Taze subaraknoid kan FLAIR’de oluklarda parlak görünür. GRE (gradyan eko) ve SWI (duyarlılık ağırlıklı görüntüleme) denen çekimlerde ise karanlıktır. FLAIR ile SWI birlikte, taze kanamayı BT’den daha iyi gösterir (Heit ve ark., 2017).
- **Kanın yeri ipucu verir:** Anevrizma kanaması taban sisternalarını tutar. Çünkü anevrizmaların çoğu oradadır (Heit ve ark., 2017).
- **Küçük subdural kan:** Kemiğe yakın olduğu için gözden kaçabilir. Görüntünün parlaklık ayarı değiştirilir; buna “subdural pencere” denir. Heit ve arkadaşlarının metni pencere genişliği 130, düzeyi 30 önerir. Aynı makalenin şekil açıklaması 150 ve 30 yazar. Koronal kesitler de yardım eder (Heit ve ark., 2017).

Kanamaların biçimi ve kliniği “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Tekniğin etkisi.** Normal sert zar boyanmasının görünüşü üç şeye bağlıdır: mıknatısın gücü, çekim türü (sekans) ve kontrast dozu. Alan gücü ve doz yükseldikçe sert zarın daha uzun bölümleri boyanmış görünür (Mahendru ve Chong, 2009). Kontrastlı gradyan eko çekimi, sağlıklı kişide bile yaygın zar boyanması gösterebilir. Spin eko çekiminde ise normal boyanma ince ve kesintilidir (Mahendru ve Chong, 2009). Olukların içindeki normal zar damarları da boyanır. Bunlar yumuşak zar boyanması sanılmamalıdır (Mahendru ve Chong, 2009).

**İşlemden sonra.** Kraniyotomiden sonra odaksal ya da yaygın zar boyanması uzun süre kalabilir. Bunun, ameliyatta subaraknoid boşluğa sızan kana bir tepki olduğu düşünülür. Her zaman enfeksiyon göstermez (Mahendru ve Chong, 2009). Şant da zarlarda lif oluşumuyla (fibroz) boyanma yapabilir (Mahendru ve Chong, 2009). BOS incelemesi için bel delme (lomber ponksiyon) yapılmış bir hastada yaygın kalın zar boyanması görülebilir. Buna subdural sıvı ve beyincik bademciklerinin aşağı inmesi eşlik ediyorsa kafa içi düşük basınç düşünülmelidir (Mahendru ve Chong, 2009).

**Geçici ve kalıcı boyanmalar.** Alt akut evredeki bir enfarkt ve subaraknoid kanama, geçici ince zar boyanması yapabilir. İyileşmiş subdural hematom ya da ampiyem ise kafatası tavanının yanında kalıcı bir sert zar kalınlaşması ve boyanması bırakabilir (Mahendru ve Chong, 2009). Nedeni bulunamayan kalın zar iltihabı (idiyopatik hipertrofik pakimenenjit) sert zarı yaygın olarak kalınlaştırır ve boyar. Kesin tanı için biyopsi gerekir (Mahendru ve Chong, 2009).

**Çocuklarda.** Tümörün zarlara yayılması kontrastlı T1’de, kontrastlı FLAIR’den daha iyi görülür. Enfeksiyon menenjitinde ise tersi geçerlidir (Patel ve ark., 2024). Çocuk menenjiyomlarında sert zar kuyruğu daha az görülür. Kuyruğun olmaması menenjiyomu dışlamaz (Patel ve ark., 2024). Moyamoya hastalığındaki ince zar boyanmasına “sarmaşık işareti” denir. Yeni damar oluşumu ve tıkalı yumuşak zar damarlarındaki ters akım bu görüntüyü yapar (Patel ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kafa travmasından sonra zar boyanması',
      md: `- Kontrastlı MR çekilen kafa travmalı hastaların yaklaşık %50–80’inde zar boyanması görülür. Yani bu, sık bir bulgudur (Arbona-Lampaya ve ark., 2025).
- Bu boyanma esasen bir kalın zar olayıdır. En çok sert zarda ve sert zar sınır hücre katmanında görülür: beyin orağında, beyincik çadırında ve beynin üst yüzünü örten sert zarda (Arbona-Lampaya ve ark., 2025).
- Turtzo ve arkadaşları boyanmayı ilk 48 saatte hastaların yaklaşık %53’ünde buldu (Arbona-Lampaya ve ark., 2025). Rizk ve arkadaşlarının çalışmasında boyanma bir yıl sonra da sürüyordu: hafif travmada %17, orta-ağır travmada %63 (Arbona-Lampaya ve ark., 2025).
- Burada kontrastlı FLAIR çok daha duyarlıdır. FLAIR’de görülen boyanmaların %38’i T1’de görülmedi. İki gözlemcinin uyumunu gösteren kappa değeri FLAIR’de 0,90, T1’de −0,24 idi (Arbona-Lampaya ve ark., 2025).
- Zarların damar arayüzüne kan–zar engeli denir. Bu engelde, kan-beyin engelindeki kadar karmaşık sıkı bağlantılar yoktur (Arbona-Lampaya ve ark., 2025).
- Kronik subdural hematomun boyanması farklıdır. Kafatasına bitişik dış zarda yerel ve düzenlidir. Travmatik boyanma ise yaygındır (Arbona-Lampaya ve ark., 2025).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kronik subdural hematomun zarları.** “Subdural” kanama, sert zarın sınır hücre katmanında açılan bir yarıkta birikir. Bu katmanın hemen dışında zengin bir küçük damar ağı vardır. O ağdan yarığa tekrar tekrar kanama olur. Süregen iltihapla birlikte lifli zarlar oluşur ve kronik subdural hematom gelişir (Ishikawa ve ark., 2026).

Kontrastlı MR ve çift enerjili BT çalışmaları bir sıra gösterdi. Önce dış zar kalınlaşır, geç evrede iç zarlar gelişir. İç zarın boyanması, olgun zarlı ileri bir evreyi gösterir (Chen ve ark., 2024). “Spandrel işareti”, dış ve iç zarın birleştiği yerdeki üçgen biçimli, kalınlaşmış iyileşme (granülasyon) dokusudur (Chen ve ark., 2024).

Bu görüntüler ameliyatı da yönlendirir. Zarların eksik çıkarılması nüksle ilişkilidir. Bu, özellikle alt şakak ve alın loblarının üstündeki, ulaşılması zor kısımlar için geçerlidir. Zar görüntülemesi bu yüzden kraniyotominin yerini ve genişliğini belirlemeye yardım eder (Chen ve ark., 2024). Hematomun kliniği ve orta meningeal atardamar embolizasyonu “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Düşük basınçta görüntüyle izlem.** Kafa içi düşük basıncın MR bulguları “Zar iltihapları, tümörler ve basınç bozuklukları” bölümündeki tablodadır. Bu bulgulardan hesaplanan Bern puanı da orada anlatılır. Omurgadaki kaçağın yerini MR ile bulan bir Türkiye çalışması da oradadır.

Bulgular tedaviyle geriler. BOS–toplardamar fistülü kapatıldıktan 24 saat sonra kalın zar boyanması hastaların yarısından fazlasında geriledi. Sinüs dolgunluğu yaklaşık %40’ında, öteki bulgular yaklaşık %30’unda geriledi (Orru ve ark., 2026). Bir çalışmada Bern puanının ortancası (ortadaki değer) tedaviden önce 6 idi. Bu değer 24 saatte 3,5’e, 3 ayda 2’ye indi (Orru ve ark., 2026).`,
    },

    // ——— FLAIR’de oluk içi parlaklık ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Oluk içi FLAIR parlaklığı.** FLAIR’de oluklar normalde karanlıktır, çünkü içlerindeki BOS’un sinyali bastırılır. Oluğun parlak görünmesi sık bir bulgudur. Ama tek başına bir hastalığı göstermez (Yazdani ve ark., 2019). En iyi bilinen üç nedeni subaraknoid kanama, menenjit ve kanserin BOS’a yayılmasıdır (Yazdani ve ark., 2019).

Bu nedenlerin ortak noktası, BOS’un içeriğinin değişmesidir. Örneğin mantar menenjitinde subaraknoid boşlukta protein birikir. Protein, sıvının T1 süresini kısaltır. T1 süresi, MR sinyalini belirleyen zaman değerlerinden biridir. Sonuçta FLAIR’de parlaklık görülür (Patel ve ark., 2024). Beynin üst yüzündeki bir olukta, travma olmadan da kanama görülebilir. Bu, damar iltihabının (vaskülit) en sık kanama biçimidir. FLAIR’de oluk parlaklığı olarak görülebilir (Heit ve ark., 2017).

**İşlemden doğan tuzaklar.** Bazı parlaklıklar hastalıktan değil, hastaya yapılan bir işlemden doğar. Tıpta bunlara iatrojenik nedenler denir. İki örnek, yüksek oranda oksijen solunması ve propofol verilmesidir (Yazdani ve ark., 2019). Bir başka tuzak BOS’un dışarı alınmasıdır. Yazdani ve arkadaşları kafa içi basıncı yüksek iki hastayı anlattı. BOS boşaltıldıktan sonra kafa içi basınç düştü ve FLAIR’de olukların içi parladı (Yazdani ve ark., 2019).

**Neden parlar?** Yazarların önerdiği açıklama şöyledir. FLAIR, BOS’un sinyalini bir “ters çevirme” (inversiyon) darbesiyle siler. BOS azalınca, görüntüdeki bir noktanın (voksel) sinyalini çoğunlukla kan havuzu verir. Kan bu darbeyle silinmez. Bu yüzden oluk parlak görünür (Yazdani ve ark., 2019). Bel delmeden (lomber ponksiyon) sonra azalan BOS’un çoğu da beynin üst yüzündeki olukların BOS’udur (Yazdani ve ark., 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'FLAIR’de oluk içi parlaklık: neden ve ipucu',
      sutunlar: ['Neden', 'Ne olur?', 'Ayırmaya yardım eden ipucu'],
      satirlar: [
        [
          'Subaraknoid kanama',
          'Kan oluklara ve sisternalara karışır',
          'GRE ve SWI’de karartı. FLAIR ile SWI birlikte taze kanamada BT’den üstündür',
        ],
        [
          'Bakteriyel ya da viral menenjit',
          'İltihap BOS’un içeriğini değiştirir',
          'Viral menenjitte boyanma en iyi kontrastlı FLAIR’de görülür',
        ],
        ['Mantar menenjiti', 'Subaraknoid boşlukta protein birikir', 'Protein T1 süresini kısaltır ve FLAIR’de parlaklık yapar'],
        [
          'Kanserin BOS’a yayılması',
          'Tümör hücreleri yumuşak zara ve BOS’a yayılır',
          'Yumuşak zar örüntüsünde BOS’ta tümör hücresi daha sık bulunur',
        ],
        [
          'Konveksite oluğunda kanama',
          'Travmasız kanama; vaskülitte en sık kanama biçimi',
          'Kan beynin üst yüzündeki oluktadır; FLAIR’de oluk parlaklığı olarak görülür',
        ],
        ['Yüksek oranda oksijen', 'İşlemden doğan (iatrojenik) neden', 'Hastalık değildir'],
        ['Propofol', 'İşlemden doğan (iatrojenik) neden', 'Hastalık değildir'],
        [
          'BOS’un boşaltılması',
          'BOS azalınca oluktaki sinyali kan havuzu verir',
          'Bir hastada bir ay sonra parlaklık ve boyanma kaybolmuştu',
        ],
      ],
      not: 'Kaynaklar: Yazdani ve ark. (2019); Heit ve ark. (2017); Patel ve ark. (2024); Mahendru ve Chong (2009).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: BOS boşaltıldıktan sonra parlayan oluklar',
      oyku: `52 yaşında bir kadın, kafa içi basıncı yüksek olduğu için yoğun bakımda izleniyor. Basıncı düşürmek için ekip BOS boşaltıyor. Ertesi gün kontrastlı MR çekiliyor. FLAIR’de beynin üst yüzündeki olukların içi parlak görünüyor. Oluklarda hafif bir boyanma da var. Radyoloji asistanı raporuna “menenjit ya da subaraknoid kanama?” yazmak üzere.`,
      soru: 'Bu görüntü mutlaka menenjit ya da kanama mı demektir? Başka hangi açıklamalar akla gelmelidir?',
      cozum: `**Bulgu özgül değildir.** FLAIR’de oluk içi parlaklık sık görülür, ama tek başına tanı koydurmaz. En bilinen nedenleri subaraknoid kanama, menenjit ve kanserin BOS’a yayılmasıdır (Yazdani ve ark., 2019).

**İşlemden doğan nedenler.** Yüksek oranda oksijen solunması ve propofol verilmesi de oluk içi parlaklık yapar (Yazdani ve ark., 2019). Bu yüzden hastaya o sırada verilenler de gözden geçirilir.

**BOS boşaltılması.** Yazdani ve arkadaşları, kafa içi basıncı yüksek iki hastada tam bu tabloyu anlattı. BOS boşaltıldıktan sonra basınç düştü ve FLAIR’de olukların içi parladı. Bir hastada bir ay sonraki MR’da parlaklık da boyanma da kaybolmuştu (Yazdani ve ark., 2019). Önerilen açıklama şudur: BOS azalınca oluktaki sinyalin çoğunu kan havuzu verir. FLAIR’in ters çevirme darbesi kanı silmez (Yazdani ve ark., 2019).

**Ayırmak için.** Taze kan GRE ve SWI çekimlerinde karanlık görünür. FLAIR ile SWI birlikte, taze subaraknoid kanamayı BT’den iyi gösterir (Heit ve ark., 2017). Belden BOS alınan hastalarda yaygın kalın zar boyanması da görülebilir. Buna subdural sıvı ve beyincik bademciklerinin inmesi eşlik ederse kafa içi düşük basınç düşünülür (Mahendru ve Chong, 2009). Son kararı hekim, hastanın bütün bulgularıyla verir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Sisternaların ince kesitli MR’ı ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Perdeleri görmek.** Örümcek ağı zarın sisternaları ayıran ince perdeleri, yüksek çözünürlüklü ve ince kesitli MR çekimleriyle aranır. Liliequist zarı gibi ince perdeler için bugün tercih edilen çekim CISS’tir (Zedde ve Pascarella, 2025a). Çekimlerin adları ve perdelerin MR’daki görünümü “Örümcek ağı zar” bölümünde anlatıldı.

**Kanın yeri bir ipucudur.** Anevrizmaya bağlı olmayan, beyin sapı çevresindeki (perimezensefalik) kanamada kan genellikle kiazma sisternasına geçmez. Bunda büyük olasılıkla Liliequist zarının üst (diensefalik) yaprağının rolü vardır (Zedde ve Pascarella, 2025a). Zarın yapısı ve bu kanamadaki rolü “Örümcek ağı zar” bölümünde.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Görünmez olan perdeler.** Perdelerin varlığı çoğu kez dolaylı olarak anlaşılır. Komşu sisternalardaki BOS akım izleri birbirinden ayrı duruyorsa arada bir perde vardır (Zedde ve Pascarella, 2025a). Görüntülemede bu perdeler ilk kez eski bir yöntemle tanındı. Bu yöntemde sisternalara hava verilerek görüntü alınırdı; adı pnömoensefalografidir. Walter Dandy onu 1919’da geliştirmişti (Zedde ve Pascarella, 2025a). Bengt Liliequist de 1956’da zarı bu yöntemle inceledi (Zedde ve Pascarella, 2025a). Zarın öyküsü “Örümcek ağı zar” bölümünde. Pnömoensefalografi bırakılınca perdeler görüntülerde rutin olarak görülmez oldu. Radyologların bu anatomiyi bilmesi de azaldı (Zedde ve Pascarella, 2025a). Liliequist zarının MR’da ne sıklıkla görüldüğünü ölçen çalışmalar da “Örümcek ağı zar” bölümündedir.

**Perde ve hidrosefali.** İltihap ya da kanamayla kalınlaşan perdeler, prepontin ve interpedinküler sisternalarda BOS akımını engelleyebilir. Sonuç, dört karıncığın da genişlediği bir hidrosefalidir. Zedde ve Pascarella’ya göre buna “karıncık dışı, sisterna içi tıkayıcı hidrosefali” demek daha doğrudur (Zedde ve Pascarella, 2025a).

Bu perdeler ince kesitli MR’da aranır. Zedde ve Pascarella iki seriyi aktarır. Laitt ve arkadaşları 43 hidrosefali hastasının 18’inde taban sisternalarında “karmaşık zarlar” gördü. Bu zarlar, endoskopik üçüncü karıncık açılımı (ETV) ameliyatında doğrulandı (Zedde ve Pascarella, 2025a). ETV’nin başarısız olduğu hastalarda taban sisternalarında, özellikle prepontin sisternada, BOS akım izi çoğu kez yoktu (Zedde ve Pascarella, 2025a). İstanbul’dan Dinçer ve arkadaşları 134 hidrosefali hastasının 28’inde akımı tıkayan sisterna zarları buldu. Zarların çoğu prepontin ve interpedinküler sisternalardaydı (Zedde ve Pascarella, 2025a). Bu hastalar şant yerine ETV’ye aday olabilir. Cerrah kalınlaşmış zarları ETV sırasında delebilir (Zedde ve Pascarella, 2025a).`,
    },

    // ——— Sinüs görüntüleme tuzakları ———
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Toplardamar sinüslerinde görüntü tuzakları',
      md: `MR ya da BT ile yapılan toplardamar çekiminde (venografi) her dolma kusuru bir pıhtı değildir.

- **Granülasyonlar:** Araknoid granülasyonlar genellikle belirti vermez ve birkaç milimetre çaplıdır. Büyüyünce sinüs içinde düğüm biçimli bir dolma kusuru yapabilir (Mehta ve Mehta, 2023). Mehta ve Mehta’nın derlediği olgularda tanı, içi BOS’a benzer yoğunlukta ya da sinyalde olan yapılar görülerek konmuştu. Bu yapılar subaraknoid boşlukla bağlantılıydı (Mehta ve Mehta, 2023). Ama bu bir kural değildir. Erzurum’dan bir seride 45 dev granülasyonun 32’sinde sıvının sinyali T1 ve FLAIR’de BOS’la aynı değildi. Yazarlar bunu çoğunlukla granülasyonun içindeki BOS akımına bağladı (Ogul ve ark., 2019). Bazı hastalarda dev granülasyon yanlışlıkla sinüs pıhtısı (tromboz) sanılmış ve gereksiz tedavi başlanmıştır (Mehta ve Mehta, 2023).
- **Enine sinüs asimetrisi:** Erzurum’dan bir çalışmanın özetine göre enine sinüste akım boşluğu ya da gelişmemişlik (aplazi), normal toplumun yaklaşık %24’ünde görülebilir. Bu görüntü tromboz sanılabilir (Alper ve ark., 2004).
- **Çekim yönteminin kendisi:** Muğla’dan bir çalışmanın özetine göre faz kontrast MR venografi, hastaların %27,2’sinde fizyolojik (hastalık olmayan) dolma kusuru gösterdi. Kusurların çoğu enine sinüsün orta kısmındaydı. Bu kusur, sinüsün yokluğu ya da tromboz sanılabilir (Doğan ve Apaydın, 2022).
- **Düşük basınç:** Kafa içi düşük basınçta sinüsler genişler ve yuvarlaklaşır (Patel ve ark., 2024).

Sinüslerin yapısı, ölçüleri ve varyasyonları “Sert zarın toplardamar sinüsleri” bölümünde.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den sinüs ve granülasyon görüntüleme çalışmaları',
      sutunlar: ['Şehir ve kurum', 'Örneklem ve yöntem', 'Bulgu'],
      satirlar: [
        [
          'Erzurum (Atatürk Üniversitesi)',
          '105 normal MR; TOF MR venografi',
          'Sol enine sinüs: aplazi %20, hipoplazi %39. Simetrik %31. Sağ enine sinüs: hipoplazi %6, aplazi %4 (özet)',
        ],
        [
          'Hatay (Mustafa Kemal Üniversitesi)',
          '211 hasta; 3B faz kontrast MR venografi',
          'Sağ enine sinüs 10 olguda (%4,73) görülmedi, 37’sinde (%17,53) hipoplastikti. Sol enine sinüs 26 olguda (%12,32) görülmedi, 85 olguda hipoplastikti (özet)',
        ],
        [
          'Muğla (Sıtkı Koçman Üniversitesi)',
          '136 hasta; faz kontrast MR venografi',
          'Alt sagital sinüs anatomik olarak hemen herkeste vardır. Bu yöntemle yalnızca hastaların %41,2’sinde görüldü (özet)',
        ],
        [
          'Ankara (Hacettepe)',
          '264 sağlıklı kişi',
          'Art kafa loblarının bükülme yönü (petalia) baskın enine sinüsün tarafını öngördü. Sağa bükülme olanların %72’sinde sağ, sola bükülme olanların %70’inde sol enine sinüs daha genişti. Sağa bükülme %27, sola bükülme %4 kişide görüldü (özet)',
        ],
        [
          'Erzurum',
          '45 dev araknoid granülasyon; 3 T, 3B MR',
          'En sık yer iki enine sinüstü. 32’sinde sıvı sinyali T1 ve FLAIR’de BOS ile aynı değildi. %22,2’sinde beyin fıtıklaşması, %73,3’ünde granülasyona giren merkezî toplardamar, %62,2’sinde 3B T2 SPACE’te sinyal boşluğu vardı (özet)',
        ],
        [
          'Erzincan–Ankara',
          'Çocuklarda MR venografi; tromboz ve kontrol grupları',
          'Varyant sıklığı tromboz grubunda %46,7, kontrolde %50 idi; fark yoktu. En sık varyant sol hipoplastik enine sinüstü',
        ],
      ],
      not: 'Kaynaklar: Alper ve ark. (2004); Bayaroğulları ve ark. (2018); Doğan ve Apaydın (2022); Arsava ve ark. (2019); Ogul ve ark. (2019); Bingol ve Ozdemir (2026). “Özet” yazan satırlarda yalnızca çalışmanın özeti okundu. Hatay çalışmasının özeti sol hipoplazi oranını %49,09 yazar. Oysa 85/211 yaklaşık %40,3 eder; bu yüzden yüzde verilmedi.',
    },

    // ——— Zar lenf damarlarının MR’ı ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Zar lenf damarlarını MR’da görmek',
      md: `Sert zarda gerçek lenf damarları vardır. Bunlar üst sagital ve enine sinüsler gibi büyük kan damarlarının yanında uzanır (Absinta ve ark., 2017). Keşfin öyküsü ve tartışması “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde. Burada yalnızca görüntüleme yolları var:

- **Damardan kontrastla.** Absinta ve arkadaşları kontrast sonrası yüksek çözünürlüklü T2-FLAIR ve T1 “siyah kan” çekimleri kullandı. Düzlem içi çözünürlük 270 × 270 μm ya da daha iyiydi (Absinta ve ark., 2017). Sert zar lenf damarları 5 sağlıklı gönüllünün 5’inde görüldü. En büyük görünür çap yaklaşık 1 mm idi (Absinta ve ark., 2017). Damarlar, kolay sızan gadobutrol ile parladı. Kanda kalan gadofosveset ile ise parlamadı. Bu, görülenin kan damarı değil lenf damarı olduğunu destekler (Absinta ve ark., 2017).
- **BOS’a verilen izleyiciyle.** Ringstad ve Eide 18 hastada gadobutrolü BOS’a, yani kılıf içine (intratekal) verdi. İzleyici, kortikal toplardamarların sinüse girdiği yerlerin yakınında sinüs yanındaki (parasagital) sert zara geçti (Ringstad ve Eide, 2020). Ama 1 mm’lik görüntü noktalarıyla, lenf damarına benzeyen borusal yapılar öteki boyanan dokudan ayırt edilemedi (Ringstad ve Eide, 2020).
- **Kontrastsız.** Albayram ve arkadaşları kontrast vermeden, 3B T2-FLAIR ile 81 kişide (15–80 yaş) zar lenf yapılarını gösterdi. Boyun lenf düğümlerine bağlantıları da görüldü (Albayram ve ark., 2022). Gerekçeleri şuydu: gadolinyum vücutta birikebilir ve yalnızca ulaşabildiği bölmeleri gösterir (Albayram ve ark., 2022).
- **Akışın yönü.** Kuo ve arkadaşları 6 sağlıklı gönüllüde, üst sagital sinüsün yanındaki lenf akımının arkadan öne aktığını gösterdi. Bu yön, sinüsteki toplardamar akımına terstir (Kuo ve ark., 2018).

İnsanda bu yapının varlığı gösterilmiştir. Ama akış miktarı ve işlevi gibi sayısal bilgiler hâlâ sınırlıdır (Ishikawa ve ark., 2026).`,
    },

    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kan, subaraknoid boşluğun bölmelerini gösterebilir mi?',
      md: `Farelerde subaraknoid boşluğu iki bölmeye ayıran tek hücre katmanlı bir zar tanımlandı. Adı SLYM’dir ve 3 kilodaltondan büyük molekülleri geçirmediği bildirildi (Almohaimede ve ark., 2025). İnsanda bu zarı canlıda göstermek zordur. İyotlu ya da gadolinyumlu kontrast maddelerin molekülleri bunun için fazla küçüktür (Almohaimede ve ark., 2025). Zar, kadavra diseksiyonunda da kolayca parçalanır (Almohaimede ve ark., 2025).

Almohaimede ve arkadaşları bu yüzden kanı doğal bir kontrast gibi kullandı. Anevrizma kanaması olan 97 hastanın BT’sine baktılar. Hastaların %64,9’unda kan, beyin sapı boyunca yalnızca yumuşak zara yakın “derin” bölmedeydi. Hiçbir hastada kan yalnızca sert zara yakın “yüzeyel” bölmede değildi (Almohaimede ve ark., 2025). BT’de kanı çok olanlarda (yüksek Fisher puanı) kanın yüzeyel bölmede de bulunma olasılığı yaklaşık 7,6 kat yüksekti (Almohaimede ve ark., 2025). Yazarlar bunun, insanda SLYM’in dolaylı bir görüntü karşılığı olabileceğini öne sürdü. SLYM’in varlığı tartışmalıdır; tartışma “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde.`,
    },

    // ——— Ameliyatta zarlar (temel) ———
    {
      tur: 'metin',
      md: `**Ameliyatta zarlar.** Beyin cerrahı beyne ulaşmak için önce kafatasında bir pencere açar. Kafatasının bir parçası geçici olarak çıkarılır ve ameliyat sonunda yerine konur. Buna **kraniyotomi** denir. Kemik yerine konmazsa işlemin adı **kraniyektomidir** (Munakomi ve Hall, 2026).

Kemik kalkınca altta sert zar görünür. Cerrah sert zarı keser ve bir kapak gibi katlar. Kesinin biçimi, beyne hangi yoldan gidileceğine göre değişir. Örneğin şakak bölgesinden yapılan pteriyonel yaklaşımda sert zar C harfi biçiminde açılır (Yilmaz ve Durmus, 2025). Sert zarın altında örümcek ağı zar ve BOS dolu subaraknoid boşluk vardır. Beynin yüzeyini ise yumuşak zar örter (Mahendru ve Chong, 2009).

İş bitince sert zar yeniden dikilir. Amaç, BOS’un dışarı kaçmasını ve enfeksiyonu önlemektir (Wang ve ark., 2023). Ünlü beyin cerrahı Harvey Cushing 1908’de bunu şöyle yazmıştı: sert zarın iki katı “özenle” yaklaştırılmalıdır (Wang ve ark., 2023). Sert zar bazen tam kapanmaz. O zaman eksik yere bir yama konur. Yama kişinin kendi dokusundan yapılabilir. Örnekler kas zarı (fasya) ve kafatasını dıştan saran zardır (perikranyum). Başka bir insandan, hayvandan ya da yapay malzemeden yamalar da vardır (Splavski ve Frol, 2025).`,
    },
    {
      tur: 'sahne',
      baslik: 'Pterion ve altındaki beyin',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Kafatası yarı saydam bırakıldı. Beyin loblara göre boyandı: mavi alın lobu, sarı yan kafa lobu, yeşil şakak lobu, pembe art kafa lobu. İşaretli nokta pterion; Anatominin dili dersinde bu adresi tanımıştık. Altında, frontal lob ile temporal lobu ayıran derin yarık uzanır: lateral oluk (Sylvius yarığı). Pteriyonel yaklaşım bu bölgeden açılır. Modelde zarlar yoktur. Gerçekte örümcek ağı zar bu yarığın üstünden bir köprü gibi geçer. Altta kalan genişliğe Sylvius sisternası denir; içinde orta beyin atardamarı vardır (Gray, 1918).',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'kemik'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        bakis: 'sol',
        etiketler: [
          { yapi: 'alt-frontal-girus-sol', metin: 'Alt frontal girus' },
          { yapi: 'ust-temporal-girus-sol', metin: 'Üst temporal girus' },
        ],
        noktalar: [{ nokta: 'yan-kafa-kama-kosesi-sol', metin: 'Pterion' }],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Türkiye’den bir öncü: Gazi Yaşargil.** M. Gazi Yaşargil 6 Temmuz 1925’te Anadolu’da, Lice’de doğdu. Genç Türkiye Cumhuriyeti’nin ilk yıllarıydı (Serra ve ark., 2025). Ameliyat mikroskobuyla yapılan beyin cerrahisinin, yani mikronöroşirürjinin öncüsüdür (Serra ve ark., 2025).

Mikroskop altında beyin düzenli bir harita gibi göründü. Kıvrımların arasında oluklar, yarıklar ve sisternalar bir ağ kuruyordu. İnce damarlar da bu doğal yolları izliyordu (Serra ve ark., 2025). Yaşargil, ameliyattaki diseksiyonun bu doğal düzlemler boyunca yapılmasını savundu (Ramirez ve ark., 2025). Örümcek ağı zarın perdelerinin, sisternalar arasında yol bulmadaki önemini vurguladı (Zedde ve Pascarella, 2025a). 1999’da “Yüzyılın Beyin Cerrahı” seçildi (Ramirez ve ark., 2025). 10 Haziran 2025’te, 100. doğum gününe günler kala hayatını kaybetti (Serra ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yaşargil 1969’da ameliyat mikroskobu için dengeli, yüzen bir ayaklık geliştirdi. Bu ayaklık sayesinde mikroskop bütün beyin ameliyatlarında düzenli olarak kullanılabildi (Pamir ve ark., 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Kontrastlı MR:** Sağlıklı sert zar da ince ve kesik kesik boyanır. Çünkü sert zarda kan-beyin engeli yoktur.
- **BT:** Taze kanı iyi gösterir. Zar boyanmasını göstermekte MR daha iyidir.
- **FLAIR:** BOS’u karanlık gösterir. Olukların içi parlarsa oraya kan, iltihap ya da kanser hücreleri karışmış olabilir. Ama yüksek oksijen, propofol ve BOS boşaltılması da aynı görüntüyü verebilir.
- **Ameliyat:** kemik penceresi → sert zarın açılması → sisternalardan doğal yollarla derine ulaşma → sert zarın özenle kapatılması, gerekirse yama.`,
    },

    // ——— Sert zarı açmak ve kapatmak ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kraniyotomi ve sert zarın açılması.** Bugünkü kraniyotomi tekniği, 19. yüzyılın sonunda Wilhelm Wagner’in tanıttığı yönteme dayanır. Önce birkaç küçük delik (burr deliği) açılır. Sonra delikler birleştirilir ve kemik bir kapak gibi kaldırılır (Munakomi ve Hall, 2026).

Sert zarın kesisi yaklaşıma göre planlanır. Samsun’dan (Ondokuz Mayıs Üniversitesi) bir kadavra çalışması iki örnek verir. Pteriyonel yaklaşımda C biçimli kesi, ikinci burr deliğinden şakak tabanına uzanır. Öne, elmacık kemiğine doğru kıvrılır (Yilmaz ve Durmus, 2025). Orbitozigomatik yaklaşımda C biçimli kesi göz çukurunun üst kenarından şakak pulunun ortasına uzanır. Sert zar sonra öne katlanır (Yilmaz ve Durmus, 2025).

Açıkta kalan sert zar kurur. Kuruyan sert zarı dikmek zorlaşır. Bu yüzden çoğu kez kas zarı, kemik zarı ya da yapay zarla bir yama gerekir. Sert zara yama konmasına **duraplasti** denir (Yasuoka ve ark., 2024).

**Kapatma.** Cushing’den beri sert zarın bütünlüğünü yeniden kurmak vurgulanır. Amaç BOS kaçağını ve enfeksiyonu önlemektir (Wang ve ark., 2023). Birçok beyin cerrahı su geçirmez kapatmayı bazı ameliyatlarda zorunlu sayar: kafa tabanı cerrahisi, beyincik çadırının altındaki (infratentoryal) kraniyotomi ve omurga kanalında sert zarın içine girilen ameliyatlar. Çadırın üstündeki ameliyatlarda ise konu tartışmalıdır (Wang ve ark., 2023).

**BOS kaçağı** şöyle tanımlanır: sert zardaki bir açıklıktan subaraknoid boşluk epidural boşlukla, bazen de deriyle bağlantı kurar. Kaçak menenjite yol açabilir (Hall ve ark., 2025). Planlı (seçmeli) çadır üstü ameliyatlardan sonra kaçak hastaların yaklaşık %2,9’unda görülür (Yasuoka ve ark., 2024). Kaçan BOS bazen sağlam derinin altında, deri altı dokuda birikir. Buna psödomeningosel denir (Maulana ve ark., 2025).

**Asma dikişleri.** Walter Dandy, sert zarı kemiğin kenarına asan dikişleri tanıttı (asma dikişi, *tenting*). Bu dikişlerin ameliyattan sonra epidural kanamayı önlediği öne sürülür. Ama bu iddia kanıta dayanmaz (Przepiorka ve ark., 2025). Çok merkezli, 490 hastalık randomize bir çalışma bunu sınadı. Planlı çadır üstü kraniyotomilerde dikiş koymamak daha kötü sonuç vermedi. Epidural kanama için yeniden ameliyat dikiş konmayanlarda %0,8, konanlarda %0,4 idi (Przepiorka ve ark., 2025). Yazarlara göre bu ameliyatlarda rutin asma dikişini bırakmak güvenlidir (Przepiorka ve ark., 2025).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarı onarmak: yama malzemeleri',
      sutunlar: ['Tür', 'Örnekler', 'Ne biliniyor?'],
      satirlar: [
        [
          'Kişinin kendi dokusu (otolog)',
          'Kas zarı (fasya lata, şakak fasyası); kafatası dış zarı (perikranyum)',
          'Walter Dandy 1926’da sert zarı ilk kez kişinin kendi fasya latasıyla onardı. Bir meta-analizde menenjiti (OR 0,31) ve psödomeningoseli (OR 0,50) azalttı. BOS kaçağı, hidrosefali ve yeniden ameliyatta fark yoktu. İstanbul’dan bir otopsi çalışmasının özetine göre kalınlığı ve mekaniği insan sert zarına benzemedi',
        ],
        [
          'Başka bir insandan (allojenik)',
          'Kadavra sert zarı; amniyon zarı',
          'Kadavra sert zarı, ameliyatla bulaşan (iatrojenik) Creutzfeldt–Jakob hastalığı ve prion benzeri amiloid birikimiyle ilişkilendirildi. Kullanımı son 30 yılda önemli ölçüde kısıtlandı',
        ],
        [
          'Hayvandan (ksenojenik)',
          'Domuz, sığır ya da at perikardı; balık kolajeni',
          'Hemikraniyektomide BOS kaçağı bu yamayla %3,5, yamasız grupta %3,6 idi. Yara enfeksiyonu yamalı grupta daha yüksek eğilimdeydi: %11,6’ya karşı %3,5 (p = 0,07)',
        ],
        [
          'Yapay malzeme',
          'Doğal ve sentetik polimerler; emilebilen ya da emilmeyen yapay sert zar',
          'Dekompresif kraniyektomide emilebilen yapay sert zarda, kafatası dışına beyin fıtıklaşması (%43,59’a karşı %17,19) ve BOS kaçağı (%15,38’e karşı %1,56) daha sıktı',
        ],
        [
          'Yapıştırıcı (sızdırmazlık maddesi)',
          'Polietilen glikol (PEG) yapıştırıcısı; sentetik hidrojeller; TissuePatchDural',
          'PEG ameliyat sırasında su geçirmez kapanmayı artırdı (RR 1,44). Ama kontrollü çalışmalarda BOS kaçağını ve enfeksiyonu anlamlı azaltmadı. 3094 hastalık bir ağ meta-analizinde TissuePatchDural, otolog malzemeler ve sentetik hidrojeller kaçak riskini tek başına dikişe göre azalttı',
        ],
      ],
      not: 'Kaynaklar: Splavski ve Frol (2025); Maulana ve ark. (2025); Çavdar ve ark. (2022); Tanrikulu ve ark. (2026); Zhang ve ark. (2022b); Diab ve ark. (2021); Yu ve ark. (2026). OR (olasılık oranı) ve RR (göreli risk) 1’den küçükse o yöntemde olay daha seyrek görülmüştür. Kaynaklara göre hiçbir malzemenin kesin üstünlüğü kanıtlanmamıştır (Splavski ve Frol, 2025).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'İdeal bir sert zar yaması nasıl olmalı?',
      md: `Splavski ve Frol’e göre ideal bir yama dört şeyi sağlamalıdır (Splavski ve Frol, 2025):

- Bağ dokusu hücrelerinin (fibroblast) üzerine göçebileceği bir iskele olmalıdır.
- Mekanik olarak insan sert zarına benzemelidir.
- Beyne yapışmamalı ve kabukta yara izi bırakmamalıdır. Kabuktaki yara izi nöbete yol açabilir.
- Amiloid gibi hastalık yapan proteinleri kafa içine taşımamalıdır.

Kadavra sert zarı son ölçütte sorun yarattı. Bu yamalar, iatrojenik Creutzfeldt–Jakob hastalığı ve prion benzeri amiloid birikimiyle ilişkilendirildi. Bu yüzden kullanımları son 30 yılda önemli ölçüde kısıtlandı (Splavski ve Frol, 2025).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Sayılarla sert zarı kapatmak',
      ogeler: [
        { deger: '%2,9', aciklama: 'Planlı çadır üstü ameliyatlardan sonra BOS kaçağı görülen hastalar (sistematik derleme).' },
        { deger: '%0,8', aciklama: 'Asma dikişi konmayanlarda epidural kanama için yeniden ameliyat; konanlarda %0,4.' },
        { deger: '1926', aciklama: 'Walter Dandy’nin sert zarı ilk kez kişinin kendi kas zarıyla (fasya lata) onardığı yıl.' },
        { deger: '1908', aciklama: 'Harvey Cushing’in sert zarın “özenle” kapatılması gerektiğini yazdığı yıl.' },
      ],
      not: 'Kaynaklar: Yasuoka ve ark. (2024); Przepiorka ve ark. (2025); Splavski ve Frol (2025); Wang ve ark. (2023).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Açma ve kapatma: kanıt ne diyor?',
      md: `- **Su geçirmez kapatma:** Pekin’de 10 yılda yapılan 698 çadır üstü kraniyotomi incelendi. Su geçirmez kapatma yapılmayanlarda enfeksiyon %10,9, yapılanlarda %4,5 idi (Wang ve ark., 2023). Kafa derisinin altında (galea altında) sıvı birikimi ise %11,3’e karşı %9,7 idi. Bu fark anlamlı değildi (Wang ve ark., 2023).
- **Asma dikişi ve kaçak:** Asma dikişi çalışmasında BOS kaçağı dikiş konmayanlarda %1,3, konanlarda %4,4 idi. Bu fark ilk hesapta anlamlıydı (p = 0,039). Çok sayıda sonuç birlikte sınandığı için bir düzeltme yapıldı; düzeltmeden sonra fark anlamlı değildi (Przepiorka ve ark., 2025).
- **Dekompresif kraniyektomi:** 56 hastalık randomize bir çalışmada, su geçirmez olmayan kapatma daha kısa sürdü ve sonuçlar benzerdi (Kumar ve ark., 2026). 106 travma hastasında dikişsiz duraplasti, ameliyat süresini 205 dakikadan 150 dakikaya indirdi. Kan kaybı da dikişsiz grupta azdı: 1000 mL’ye karşı 1500 mL (Jeong ve ark., 2020).
- **Krank biçimli kesi:** Kafa içi basınç yüksekken sert zar merkezden köşelere kesilirse beyin kemik kenarından taşabilir. Dekompresyonda bu istenmez (Nishiyama ve ark., 2021). Nishiyama ve arkadaşları “krank biçimli” kesiler önerdi. Ortada kare bir sert zar örtüsü korunur; kesiler bu kareden köşelere doğru uzatılır (Nishiyama ve ark., 2021).
- **Rulo tekniği:** Sert zarı U biçiminde kesip rulo yapma (roll-up) tekniği denendi. Yama gerekmeden kapatma 27 hastanın 26’sında (%96,3) başarıldı (Yasuoka ve ark., 2024).
- **Arka çukurda hazırlık:** Deri kesisinden sonra, sert zarı kapatmada kullanmak için kafatası dış zarından bir flep alınabilir (Keles ve ark., 2021).
- **Yapıştırıcılar:** Bir meta-analize göre PEG yapıştırıcısının enfeksiyonu önlediği bilimsel olarak gösterilmemiştir. Sert zarın bütünlüğünden kuşku duyulduğunda yardımcı olarak kabul edilebilir (Diab ve ark., 2021). Bir ağ meta-analizinde kişinin kendi dokusundan yapılan malzemeler, menenjiti önlemede de olumlu bir işaret verdi (RR 0,13) (Yu ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Arka çukur: kemik yerine konmalı mı?** Bir meta-analiz beyincik ve beyin sapı bölgesindeki (arka çukur) ameliyatları karşılaştırdı. BOS kaçağı kraniyotomide %5,79 (484 ameliyatın 28’i), kraniyektomide %11,00 (518 ameliyatın 57’si) idi. Havuzlanmış analizde bu fark anlamlı değildi (Alhantoobi ve ark., 2023). Psödomeningosel ise kraniyotomide %7,40 (338’in 25’i), kraniyektomide %23,36 (214’ün 50’si) idi. Bu fark havuzlanmış analizde anlamlıydı (Alhantoobi ve ark., 2023). Kemik kapağın yerine konması, yerçekimine bağlı kemik ve deri kusurunu azaltır. Bu da kaçak ve psödomeningosel riskini düşürebilir. Ama kanıtın yanlılık riski yüksektir (Alhantoobi ve ark., 2023).

**Sert zarı koruyarak.** İzmir’den (Ege Üniversitesi) bir ekip, Chiari I hastalığında sert zarı açmadan bir yöntem tanıttı: “bir parmak genişliğinde baklava hamuru” tekniği. Sert zar katmanlarına ayrılır. Meningeal katman, mikroskop altında baklava yufkası inceliğine kadar inceltilir. İnceltme, BOS’un atımı zarın içinden görülene dek sürer (Biçeroğlu ve ark., 2026). Çalışmanın özetine göre 32 hastada BOS fistülü, psödomeningosel, yara enfeksiyonu ya da yeniden ameliyat olmadı (Biçeroğlu ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Ense yarasının altında yumuşak bir şişlik',
      oyku: `47 yaşında bir kadın, beyinciğin yanındaki bir tümör için arka çukurdan ameliyat edildi. Kemik parçası yerine konmadı; yani kraniyektomi yapıldı. Sert zar dikildi, ama tam kapanmadı. İki hafta sonra ense yarasının altında yumuşak, ağrısız bir şişlik fark ediliyor. MR’da şişliğin içi BOS ile aynı sinyalde. Sert zardaki bir açıklıkla da bağlantılı.`,
      soru: 'Bu birikimin adı nedir? Arka çukur ameliyatında bu riski hangi seçimler etkiler?',
      cozum: `**Adı.** Sert zardaki bir açıklıktan subaraknoid boşluk dışarıyla bağlantı kurmuştur. Bu bir BOS kaçağıdır (Hall ve ark., 2025). Kaçan BOS sağlam derinin altında, deri altı dokuda birikmiştir. Buna psödomeningosel denir (Maulana ve ark., 2025).

**Kemik kapağı.** Bir meta-analizde arka çukurda psödomeningosel kraniyotomide %7,40, kraniyektomide %23,36 oranında görüldü; fark anlamlıydı. BOS kaçağı da kraniyotomide %5,79, kraniyektomide %11,00 idi (Alhantoobi ve ark., 2023). Kemiğin yerine konması, yerçekimine bağlı kemik ve deri kusurunu azaltarak riski düşürebilir. Ama bu kanıtın yanlılık riski yüksektir (Alhantoobi ve ark., 2023).

**Kapatma ve yama.** Çadır altı kraniyotomide su geçirmez kapatma birçok cerrahça zorunlu sayılır (Wang ve ark., 2023). Ameliyatın başında, kapatmada kullanmak için bir kafatası dış zarı flebi alınabilir (Keles ve ark., 2021). Bir meta-analizde kişinin kendi dokusundan yapılan yamalar psödomeningoseli azalttı (OR 0,50) (Maulana ve ark., 2025). PEG yapıştırıcısı ameliyatta su geçirmezliği artırdı. Ama kontrollü çalışmalarda kaçağı anlamlı azaltmadı (Diab ve ark., 2021).

Tedavi kararını beyin cerrahisi ekibi verir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Sisternalar yoluyla cerrahi ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Doğal koridorlar.** Mikroskop altında beyin rastgele bir yumak gibi görünmez. Kıvrımların arasında oluklar, yarıklar ve sisternalar düzenli bir ağ kurar. İnce damarlar da bu ağı izler (Serra ve ark., 2025). Sisternalar ve onları ayıran örümcek ağı zar perdeleri, cerrahiye doğal diseksiyon yolları sağlar (Zedde ve Pascarella, 2025a). Yaşargil’in derindeki beyin tümörlerine sisternalar yoluyla (trans-sisternal) yaklaşımları bu fikre dayanır (Serra ve ark., 2025).

Sisternaları ayıran duvarlar tam değildir. Değişik büyüklükte delikleri olan, gözenekli duvarlardır. Trabeküllerin yapışıklıkları, sisterna diseksiyonunun asıl zorluğudur (Villanueva ve ark., 2023). Trabekül ağı düzensizdir ve çoğunlukla damarların yakınında yoğunlaşır. Bir derlemenin özetine göre bu yüzden mikrocerrahide küt değil, keskin diseksiyon önerilir (Mortazavi ve ark., 2018). Liliequist zarı, interpedinküler sisternaya giden yolda ameliyattaki temel işaretlerden biridir (Volovici ve ark., 2020).

**BOS’u boşaltmak beyni gevşetir.** Taban sisternaları erkenden açılıp BOS boşaltılırsa beyin gevşer. Böylece sert zar nazikçe açılabilir. Korteksteki toplardamarların bükülmesi ve korteksin kemik kenarında yırtılması önlenir (Ciobanu-Caraus ve ark., 2024).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Alttan bakış: sisternalarda yatan yapılar',
      aciklama:
        'Beyne alttan bakıyoruz; ön taraf ekranın üstünde, hastanın sağı ekranın solunda. Beyin kabuğu saydam bırakıldı. Kırmızı yapılar atardamarlar ve Willis halkasıdır. Turuncu yapılar görme sinirleri, kiazma ve görme yollarıdır. Ortada beyin sapı uzanır. Modelde örümcek ağı zar ve sisternalar yoktur. Gerçekte bu yapıların her biri BOS dolu bir sisternada yatar. Optik kiazma kiazma sisternasında, orta beyin atardamarı Sylvius sisternasında durur (Gray, 1918). Willis halkası tek bir sisternada değildir. İç karotis atardamarı ve arka bağlantı atardamarının başlangıcı karotis sisternasındadır. Ön bağlantı atardamarı lamina terminalis sisternasındadır. Baziler atardamarın tepesi ve çatallanması interpedinküler sisternadadır. Baziler atardamarın gövdesi ponsun önündeki prepontin sisternadadır (Villanueva ve ark., 2023). Gray (1918) ise bu bölgeyi tek ve geniş bir taban sisternası sayar ve Willis halkasını onun içine koyar. Cerrah bu yapılara sisternaları açarak ulaşır.',
      sahne: {
        katmanlar: ['damar', 'derin', 'sap', 'kabuk'],
        renk: 'dogal',
        goster: ['katman:kabuk', 'katman:damar', 'bolge:beyin-sapi', 'optik-sinir', 'optik-kiazma', 'optik-traktus', 'mamiller-cisimler'],
        saydam: ['katman:kabuk'],
        vurgula: ['katman:damar', 'optik-sinir', 'optik-kiazma', 'optik-traktus', 'bolge:beyin-sapi'],
        boya: [{ secici: ['optik-sinir', 'optik-kiazma', 'optik-traktus'], renk: GORME }],
        bakis: 'alt',
        etiketler: [
          { yapi: 'optik-kiazma', metin: 'Optik kiazma' },
          { yapi: 'ic-karotis-arter-sag', metin: 'İç karotis atardamarı' },
          { yapi: 'orta-beyin-arteri-sol', metin: 'Orta beyin atardamarı' },
          { yapi: 'arka-beyin-arteri-sag', metin: 'Arka beyin atardamarı' },
          { yapi: 'baziler-arter', metin: 'Baziler atardamar' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Serebral pedinkül' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Cerrahın karşılaştığı sisternalar',
      sutunlar: ['Sisterna', 'İçinde ne var?', 'Cerrahide nerede karşına çıkar?'],
      satirlar: [
        [
          'Sylvius sisternası (*cisterna fossae lateralis cerebri*)',
          'Orta beyin atardamarı',
          'Yaşargil’in trans-silviyen amigdalohipokampektomisi Sylvius yarığından geçerek amigdala ve hipokampusa ulaşır',
        ],
        [
          'Kiazma sisternası',
          'Görme sinirleri ve kiazma, hipofiz sapı, hipofiz ve infundibulum atardamarları',
          'Orta hattaki sisterna kavşağıdır. Üstünde lamina terminalis sisternası, arkasında Liliequist zarının ardında interpedinküler sisterna vardır',
        ],
        [
          'İnterpedinküler sisterna',
          'Baziler atardamarın tepesi ve çatallanması; arka beyin ve üst beyincik atardamarları; arka bağlantı atardamarının sonu; okülomotor sinir',
          'Yolu Liliequist zarından geçer. Sisternostomide dren ucu buraya ya da prepontin sisternaya konur',
        ],
        [
          'Prepontin sisterna',
          'Baziler atardamar; abdusens siniri; ön alt beyincik atardamarının başlangıcı',
          'Sisternostomide bütün taban sisternalarıyla birlikte açılır ve dren buraya bırakılır',
        ],
        [
          'Kuadrigeminal sisterna',
          'Çok sayıda atardamar ve toplardamar',
          'Paramedian supraserebellar transtentoryal yaklaşım bu sisternayı, pineal bölgeyi ve çadır çentiğini engelsiz açar',
        ],
        [
          'Sisterna magna (beyincik–omurilik soğanı sisternası)',
          'Bazı kafa sinirleri ve atardamarlar; en büyük sisternadır',
          'Beyin sapı ameliyatından sonra örümcek ağı zarı dikilerek yeniden kurulabilir',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); Villanueva ve ark. (2023); Zedde ve Pascarella (2025a); Serra ve ark. (2025); Volovici ve ark. (2020); Ciobanu-Caraus ve ark. (2024); Keles ve ark. (2021); Keleş ve ark. (2019). Willis halkasının parçaları birkaç sisternaya dağılır (Villanueva ve ark., 2023); Gray (1918) halkayı tek bir geniş taban sisternasına koyar. Sisternaların bütün listesi ve sınırları “Zarlar arası boşluklar ve sisternalar” bölümünde.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yaşargil’in yolu.** Tıp eğitimine 1944’te Almanya’da, Jena’da başladı. 1945–1949 arasında İsviçre’de, Basel’de sürdürdü ve 1950’de mezun oldu (Serra ve ark., 2025). Beyin cerrahisi eğitimine 1953’te başladı. Hocası, İsviçre beyin cerrahisinin kurucusu Hugo Krayenbühl’dü (Serra ve ark., 2025). 1965–1967 arasında ABD’de, Burlington’da R. M. Peardon Donaghy’nin yanında çalıştı. Orada mikroskop altında çok ince damarları dikmeyi çalıştı (Serra ve ark., 2025).

18 Ocak 1967’de Zürih Üniversite Hastanesi’nde insanda ilk kafa dışı–kafa içi (EC-IC) baypas ameliyatını yaptı (Serra ve ark., 2025). 1973’te Zürih’te profesör ve bölüm başkanı oldu. Emekli olana dek dünyanın her yerinden 3000’den fazla beyin cerrahı onu izlemeye ve ondan öğrenmeye geldi (Serra ve ark., 2025). Emeklilik yılı kaynaklarda farklıdır: Serra ve arkadaşları 1992, Ramirez ve arkadaşları 1993 yazar (Serra ve ark., 2025; Ramirez ve ark., 2025). Sonra ABD’de, Little Rock’ta Arkansas Üniversitesi’nde çalıştı. 2013’ten sonra İstanbul’da Yeditepe Üniversitesi Beyin Cerrahisi Bölümü’nde profesördü (Serra ve ark., 2025).

Katkıları arasında şunlar sayılır (Serra ve ark., 2025):

- Derindeki beyin tümörlerine sisternalar yoluyla yaklaşımlar.
- Bipolar koagülasyonla ve kendi geliştirdiği klipslerle anevrizma tedavisi.
- Atardamar–toplardamar şekil bozukluklarının (AVM) mikrocerrahisi.
- Sylvius yarığından geçerek amigdala ve hipokampusa ulaşan ameliyat (trans-silviyen amigdalohipokampektomi).

Birikimini çok ciltli “Microneurosurgery” kitap dizisine aktardı. Dizi, Roth’un çizimleriyle resimlendi (Serra ve ark., 2025). Ramirez ve arkadaşlarına göre dizi altı ciltten oluşur (Ramirez ve ark., 2025). Bugünkü sisterna adlandırması da büyük ölçüde Yaşargil’in 1970’lerin ortasındaki tanımlarına dayanır (Villanueva ve ark., 2023).

Bir yayının özetine göre İstanbul Yaşargil Mikronöroşirürji Kursları, Yeditepe Üniversitesi’nin mikronöroşirürji laboratuvarında doğdu (Kabakcı ve ark., 2026). Laboratuvarın öyküsü “Zarların gelişimi ve keşif tarihi” bölümünde.`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'Orta hattan: Liliequist zarının gerildiği yer',
      aciklama:
        'Kafatası tabanı, beyin sapı ve derin yapılar orta hattan ikiye ayrıldı. Sol yarıya içeriden bakıyoruz; yüz sağda. Hipofiz Türk eyerinin çukurunda oturur; üstünde optik kiazma görülür. Mamiller cisimler kiazmanın arkasındadır. Altta orta beyin ve pons uzanır; ponsun önünde baziler atardamar vardır. Kemik soluk bırakıldı. Modelde zarlar yoktur. Liliequist zarı eyer sırtından başlar ve iki yaprağa ayrılır (Zedde ve Pascarella, 2025a). Yaprakların hangi sisternaları ayırdığı “Örümcek ağı zar” bölümünde anlatıldı. Endoskopik üçüncü karıncık açılımında (ETV) cerrah önce üçüncü karıncığın ince tabanını geçer. Zarın üst yaprağı da delinince üçüncü karıncık taban sisternalarıyla bağlanır (Villanueva ve ark., 2023). Prepontin sisternanın önünde klivus, arkasında pons vardır. Baziler atardamar bu sisternanın içinde, ponsun önündeki olukta uzanır (Villanueva ve ark., 2023).',
      sahne: {
        katmanlar: ['kemik', 'derin', 'sap', 'damar'],
        renk: 'dogal',
        bakis: 'ic-sol',
        yarim: 'sol',
        goster: [
          'katman:kemik',
          'hipofiz',
          'optik-sinir',
          'optik-kiazma',
          'mamiller-cisimler',
          'hipotalamus',
          'baziler-arter',
          'orta-beyin',
          'pons',
          'omurilik-sogani',
        ],
        vurgula: ['hipofiz', 'optik-kiazma', 'mamiller-cisimler', 'baziler-arter', 'orta-beyin', 'pons'],
        etiketler: [
          { yapi: 'hipofiz', metin: 'Hipofiz' },
          { yapi: 'optik-kiazma', metin: 'Optik kiazma' },
          { yapi: 'mamiller-cisimler', metin: 'Mamiller cisimler' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'baziler-arter', metin: 'Baziler atardamar' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Perdelerle çalışmak',
      md: `- **Liliequist zarı:** Zarın yaprakları ve tutunduğu yerler “Örümcek ağı zar” bölümünde. Zarın önündeki anevrizmalara en iyi pteriyonel yolla ulaşılır. Arkasındakiler için başka yollar daha uygun olabilir: orbitozigomatik yol ya da şakak lobunun önünden kavernöz sinüsü geçen yol (pretemporal transkavernöz) (Volovici ve ark., 2020). Prepontin sisternayı genişçe açmak için zarın iki yaprağının da açılması önerilir (Volovici ve ark., 2020). Okülomotor sinir, kavernöz sinüse girene dek bu zarın uzantısı olan bir örümcek ağı zar manşonuyla sarılıdır (Volovici ve ark., 2020).
- **Anevrizma ve perde:** Yaşargil’e göre anevrizmalar çoğu kez sisterna duvarlarının örümcek ağı zarıyla sarılır. Bu yüzden ameliyatta zarlar anevrizmadan uzakta açılırken bile, zarlardaki gerilim anevrizmanın tepesine iletilebilir ve kanamaya yol açabilir (Volovici ve ark., 2020).
- **Perdeler ve kanama:** Perdelerin gözenekliliği yerden yere değişir. Subaraknoid kanamadan sonra tıkanabilirler (Zedde ve Pascarella, 2025a). Yaşargil’e göre trabeküller subaraknoid boşluktaki sinirlere de tutunur (Zedde ve Pascarella, 2025a).
- **Endoskopik üçüncü karıncık açılımı (ETV):** Başarı için Liliequist zarının üst (diensefalik) yaprağının da delinmesi gerekir; nedeni “Örümcek ağı zar” bölümünde (Zedde ve Pascarella, 2025a). Yüksek çözünürlüklü T2 ağırlıklı çekimler, üçüncü karıncıktan interpedinküler sisternaya giden BOS akım izlerini iyi gösterir. Bu, ameliyatın planlanmasına yardım eder (Zedde ve Pascarella, 2025a). Ameliyattan sonra açılan delikten geçen akım da MR’da güçlü akım izleri olarak görülebilir (Zedde ve Pascarella, 2025a).
- **Sisterna magnayı yeniden kurmak:** Yeditepe’den Türe ekibi, beyin sapı cerrahisinde sisterna magnanın örümcek ağı zarını 10-0 tek iplikle dikti. Hasta omurilik soğanında hemanjiyoblastomu olan bir von Hippel–Lindau hastasıydı (Keleş ve ark., 2019). Yazarlara göre başarılı bir kapatma için zarın keskin diseksiyon ve mikrocerrahi teknikleriyle açılması önemlidir (Keleş ve ark., 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sisternostomi: umut ve kanıt',
      md: `Bazal sisternostomiyi orta-ağır kafa travmasında yeni bir tedavi olarak 2013’te Cherian ve arkadaşları tanıttı (Ciobanu-Caraus ve ark., 2024). İşlem şu adımlardan oluşur: kraniyotomi, prepontin sisterna dahil bütün taban sisternalarının açılması, BOS’un kendiliğinden boşalması ve prepontin sisternaya bir dren bırakılması (Ciobanu-Caraus ve ark., 2024).

Dayandığı model şudur. Travmatik subaraknoid kanama, taban sisternalarındaki damar çevresi boşlukları tıkayabilir. Sisterna basıncı artınca BOS beyin dokusuna geri itilebilir; buna “BOS kayması ödemi” denir (Ciobanu-Caraus ve ark., 2024). Cerrahi hedef, dren ucunu interpedinküler ya da prepontin sisternaya koymaktır. Bu sisterna, hem yandan ortaya hem de çadır altından üstüne doğru merkezî bir bağlantı noktasıdır (Villanueva ve ark., 2023). Önceki randomize çalışmalarda frontotemporal (pteriyonel ya da değiştirilmiş pteriyonel) yaklaşım kullanıldı (Villanueva ve ark., 2023).

Kanıt henüz kesin değildir:

- Bir sistematik derlemede, dekompresif hemikraniyektomiye eklenen sisternostomi iyi nörolojik sonuç olasılığını anlamlı artırmadı: OR 2,50, p = 0,06 (Ciobanu-Caraus ve ark., 2024).
- Hindistan’dan randomize bir çalışmada hastane içi ölüm yalnız dekompresyonda %64, sisternostomi eklenince %48 idi. Fark anlamlı değildi. Mekanik ventilasyon ve yoğun bakım süresi ise kısaldı (Kumari ve ark., 2023).
- Dünya Beyin Cerrahisi Dernekleri Federasyonunun (WFNS) nörotravma komitesi 16 uzmanla bir uzlaşı kurdu. Sisternostomiyi, belirgin travmatik subaraknoid kanaması olan seçilmiş hastalarda yardımcı bir işlem olarak tanımladı (Rubiano ve ark., 2026).`,
    },

    // ——— Sinüs yaralanması ve köprü toplardamarları ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sinüs yaralanması.** Toplardamar sinüsleri, sert zarın meningeal ve kemik zarı katmanlarının ayrılmasıyla oluşan kanallardır. İç yüzleri endotelle döşelidir. Kapakçıkları ve kas duvarları yoktur. Bu yüzden yırtılınca büyük kanama yaparlar (Levin-Carrion ve ark., 2026). Üst sagital sinüsün arka üçte birinin yan dolaşımı azdır. Bu bölüm tıkanırsa iki yanda yan kafa ve alın loblarında toplardamar enfarktları olur (Levin-Carrion ve ark., 2026). Sinüslerin yapısı “Sert zarın toplardamar sinüsleri” bölümünde.

**Köprü toplardamarları.** Beyin yüzeyindeki toplardamarlar sinüslere köprü toplardamarlarıyla ulaşır. Bunlar, sert zar ile örümcek ağı zar arasındaki düzlemi geçen ince duvarlı damarlardır. Karşıt mekanik kuvvetlerle yırtılırlarsa subdural hematom oluşur (Pierre ve ark., 2026). Beyin hacmi azalınca sert zar ile beyin arasındaki uzaklık artar. Köprü toplardamarları gerilir ve yırtılmaya yatkın olur (Pierre ve ark., 2026).

Ameliyatta da korunmaları gerekir. Yarımküreler arası yaklaşımlarda köprü toplardamarı hasarı ameliyatta kanamaya yol açabilir. Ameliyattan sonra toplardamar enfarktı ya da yarım felç de gelişebilir (Ye ve ark., 2024). Taban sisternalarından erken BOS boşaltılması bu yüzden de değerlidir. Beyin gevşer ve korteksteki toplardamarların bükülmesi önlenir (Ciobanu-Caraus ve ark., 2024). Köprü toplardamarlarının sayısı, sinüse giriş tipleri, duvar kalınlıkları ve giriş noktaları “Sert zarın toplardamar sinüsleri” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sinüs yaralanmasında sayılar',
      md: `- Sinüs tutulan kafa travmalarında ölüm oranının %40’ı aştığı tahmin edilir (Levin-Carrion ve ark., 2026). Kim ve arkadaşlarına göre ölüm ameliyat döneminde %20’ye, genel olarak %41’e çıkabilir (Kim ve ark., 2015).
- Travmatik sinüs yaralanmasının sıklığı savaşta %4–12, sivil yaşamda %1–4 olarak bildirilir (Kim ve ark., 2015).
- Sinüs yaralanmasının en sık yeri, üst sagital sinüsün ön ve orta üçte biridir (Kim ve ark., 2015).
- Sinüs üstündeki çökmüş kırıkların ameliyatında ciddi kanama iki seride %23 ve %20 oranında bildirildi (Kim ve ark., 2015).
- Delici sinüs yaralanmalarında toplardamara hava kaçabilir (hava embolisi). Bu risk özellikle baş kalpten yüksekteyken vardır (Levin-Carrion ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Üst sagital sinüsün üstünde bir yaralanma',
      oyku: `26 yaşında bir motosiklet sürücüsü düşüyor ve başını çarpıyor. BT’de kafa tepesinde, orta hatta, üst sagital sinüsün orta üçte birinin üstünde bir kırık var. Kırık sinüs boyunca uzanıyor. Altında ince bir epidural kan birikimi var. Ekip ameliyata hazırlanıyor.`,
      soru: 'Bu yerleşim neden ameliyatta büyük kanama riski taşır? Ekip hangi sorunlara hazırlıklı olmalıdır?',
      cozum: `**Sinüsün duvarı.** Sert zar sinüsleri kapakçıksız ve kas duvarsız kanallardır. Yırtılınca büyük kanama yaparlar (Levin-Carrion ve ark., 2026). Sinüs yaralanmasının en sık yeri de üst sagital sinüsün ön ve orta üçte biridir (Kim ve ark., 2015).

**Sinüs boyunca uzanan yaralanma.** Kim ve arkadaşlarına göre böyle bir yaralanmada sinüsün duvarı boyuna yırtılabilir. Serilerinde bu durumdaki 5 hastanın hepsinde kanama basit parmak basısıyla durmadı. Yazarlar, kan birikimi olmasa bile cerrahın ölümcül olabilecek bir sinüs yaralanmasına hazırlıklı olmasını önerir (Kim ve ark., 2015).

**Hazırlık.** En sık kullanılan basit yol parmak basısıdır. Bası Gelfoam, sert zar, kafatası dış zarı, şakak kası ya da kas zarıyla yapılır. Öteki yöntemler doğrudan dikiş, sert zarın kemiğe asılması, bağlama, kişinin kendi toplardamarından yama ve TachoSil’dir (Kim ve ark., 2015). Sinüs yaralanmalı hastalarda trombosit düşüklüğü %85, pıhtılaşma proteinlerinin tükenmesi (defibrinasyon) %69 oranında bildirilmiştir. Bu yüzden pıhtılaşma izlenir (Kim ve ark., 2015). Sinüsün arka üçte biri tıkanırsa iki yanlı toplardamar enfarktı gelişebilir (Levin-Carrion ve ark., 2026).

Ölüm sinüs yaralanmasında ameliyat döneminde %20’ye, genel olarak %41’e çıkabilir (Kim ve ark., 2015). Kararları beyin cerrahisi ekibi verir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Beyin orağı ve çadır ameliyatta.** Beyin orağı, yarımküreler arası yaklaşımlarda sert bir orta hat işaretidir. Ameliyatta beynin kaymasını ve yön bulma (navigasyon) sisteminin doğruluğunu etkiler (Munakomi ve Jozsa, 2026). Beyincik çadırının ön kenarından çentiğe uzanan bölge az sinir taşır. Bu yüzden güvenli bir giriş noktası sayılır (Ishikawa ve ark., 2026). Sert zarla oynamak trigeminokardiyak refleksi tetikleyebilir. Bu refleks açık ameliyatların %8–18’inde bildirilmiştir (Ishikawa ve ark., 2026). Refleksin kendisi “Sert zarın atardamarları, sinirleri ve ağrı” bölümünde. Çadır çentiğinin hemen iç yanında, bazal toplardamar (Rosenthal toplardamarı) gibi çok sayıda damar ve sinir yapısı bulunur (Rai ve ark., 2018). Çentiğin iç tarafındaki tümörlere en iyi art kafadan, çadırın içinden geçen (oksipital transtentoryal) yolla yaklaşılır (Rai ve ark., 2018).`,
    },

    // ——— Menenjiyom cerrahisinde sert zar ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Menenjiyom ve sert zar.** Menenjiyomlar örümcek ağı zarın örtü hücrelerinden (*arachnoid cap cell*) gelir. Kanlarını sert zar damarlarından, çoğunlukla dış karotis atardamarının dallarından alırlar (Doddamani ve ark., 2018). Bu yüzden ameliyatta yalnızca tümör değil, tutunduğu sert zar da önemlidir. Simpson’ın beş dereceli ölçeği, çıkarımın genişliğini nüksle ilişkilendirir (Chotai ve Schwartz, 2022). En iyi derecede tümör, tutulan sert zar ve kemikle birlikte çıkarılır. Tümör bir sinüsün duvarından çıkıyorsa sinüsün de çıkarılması gerekir (Chotai ve Schwartz, 2022). Derecelerin tablosu ve nüks oranları “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.

**Sert zar kuyruğu.** MR’da bazı tümörlerin kenarından sert zar boyunca uzanan bir kalınlaşma görülür. Buna sert zar kuyruğu denir. İlk kez 1989’da Wilms ve arkadaşları radyolojik olarak tanımladı. Bu kalınlaşmaya bazen “meningeal işaret” ya da İngilizce adıyla “flare sign” de denir (Cordia ve ark., 2025). Kuyruk menenjiyomu çok düşündürür, ama tanı koydurucu değildir (Doddamani ve ark., 2018). Kuyruğun ne sıklıkla ve hangi başka kitlelerde görüldüğü de aynı bölümde anlatılır.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kuyruk ve sert zar: cerrahın sorusu',
      md: `- Menenjiyomlarda nüks %20’ye varır. Kuyruğun çıkarılmaması nüks için bir risk olabilir (Cordia ve ark., 2025).
- Ama kuyruğun klinik kararlardaki yeri konusunda bir uzlaşı yoktur. Kuyruğun geniş (radikal) çıkarılmasının klinik yararı da kanıtlanmamıştır (Cordia ve ark., 2025).
- Işın tedavisi çalışmalarında kuyruğa ışın vermek, 3,3 ile 7,5 yıl arasındaki izlemde nüksü azaltmadı (Cordia ve ark., 2025).
- Sert zardaki gizli tümör odakları, “Simpson derece 0” önerisi ve çadır menenjiyomlarının sayıları “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.
- Çadır, tümörün tabanı boyunca kesilerek koridor genişletilebilir. Bu sırada arka iç şakak lobu, arka beyin atardamarının dalları ve bazal şakak toplardamarları korunmalıdır (Keles ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den zar cerrahisi çalışmaları',
      sutunlar: ['Şehir ve kurum', 'Konu', 'Ne yapıldı, ne bulundu?'],
      satirlar: [
        [
          'İstanbul (Yeditepe; Türe ekibi)',
          'Sisterna magnanın yeniden kurulması',
          'Beyin sapı cerrahisinde örümcek ağı zar 10-0 tek iplikle dikildi. Yedi yıl sonraki ameliyatta zar sağlamdı; zar ile beyin arasında yapışıklık yoktu',
        ],
        [
          'İstanbul (Marmara)',
          'Retrosigmoid yaklaşım',
          'Sert zara gömülü ön alt beyincik atardamarı kıvrımı, taşlı kemik çıkıntısından “petröz sert zar kesisi” ile güvenle serbestleştirildi',
        ],
        [
          'İzmir (Ege Üniversitesi)',
          'Chiari I’de sert zarı koruyan dekompresyon',
          '“Bir parmak genişliğinde baklava hamuru” tekniği: meningeal katman inceltildi. 32 hastada BOS fistülü, psödomeningosel, yara enfeksiyonu ya da yeniden ameliyat olmadı (özet)',
        ],
        [
          'İstanbul (Koç Üniversitesi)',
          'Sert zar ve yama malzemeleri',
          '30 otopside; fasya lata, şakak fasyası, galea ve yapay sert zar kalınlık ve mekanik bakımdan insan sert zarına benzemedi (özet)',
        ],
        [
          'Gaziantep',
          'Yama olarak şakak fasyası',
          '12 formalinli kadavrada şakak fasyası sert zar greftinden daha sert ve dayanıklıydı. Kolajen ve elastik lif yoğunlukları benzerdi (özet)',
        ],
        [
          'Samsun (Ondokuz Mayıs)',
          'Sert zar kesisi',
          'Kadavrada pteriyonel ve orbitozigomatik yaklaşımlarda C biçimli kesiler tarif edildi',
        ],
      ],
      not: 'Kaynaklar: Keleş ve ark. (2019); Sakar ve ark. (2026); Biçeroğlu ve ark. (2026); Çavdar ve ark. (2022); Güven ve ark. (2026); Yilmaz ve Durmus (2025). “Özet” yazan satırlarda yalnızca çalışmanın özeti okundu. Liliequist zarıyla ilgili Türkiye çalışmaları (Antalya’dan anevrizma cerrahisi, Kocaeli’den hidrosefali) “Örümcek ağı zar” bölümündeki tablodadır. İstanbul’dan iki çadır menenjiyomu çalışması “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Normal sert zar boyanması:** ince, düzgün, kesintili; konveksitede belirgin. Nedeni: sert zarda kan-beyin engeli yoktur.
- **İki örüntü (Meltzer):** sert zar–örümcek ağı zar örüntüsü kalın zar boyanmasıdır ve kafatası iç yüzünü izler. Yumuşak zar–subaraknoid örüntü ince zar boyanmasıdır ve oluk diplerine dalgalı iner. Yumuşak zar örüntüsünde BOS’ta tümör hücresi daha sık bulunur.
- **Zar hastalığında en duyarlı çekim:** üç düzlemde kontrastlı T1. Kontrastlı FLAIR yardımcıdır.
- **FLAIR’de oluk parlaklığı:** subaraknoid kanama, menenjit, kanserin BOS’a yayılması. Tuzaklar: yüksek oksijen, propofol, BOS boşaltılması.
- **Taze subaraknoid kanama:** Muayenesi normal, ani baş ağrılı yetişkinde ilk 6 saatte çekilen BT %100 duyarlı (yeni kuşak BT, deneyimli radyolog). 6 saatten sonra duyarlılık düşer; bütün zamanlarda %92,9. FLAIR ile SWI birlikte BT’den üstün.
- **İnce kesitli MR:** Liliequist zarı gibi ince perdeler için bugün tercih edilen çekim CISS’tir.
- **Kapatma:** Cushing 1908. Su geçirmez kapatma kafa tabanı, çadır altı ve omurga içi ameliyatlarda zorunlu sayılır; çadır üstünde tartışmalıdır. Asma dikişinin yararı kanıtlanmamıştır.
- **Yamalar:** otolog (fasya lata, perikranyum), allojenik (kadavra sert zarı: iatrojenik Creutzfeldt–Jakob riski), ksenojenik, yapay. Kesin üstünlük yoktur.
- **Yaşargil:** Lice 1925 – 2025. İlk EC-IC baypas 18 Ocak 1967. Mikroskop ayaklığı 1969. Sisternalar yoluyla yaklaşımlar. “Yüzyılın Beyin Cerrahı” 1999.`,
    },
  ],
};
