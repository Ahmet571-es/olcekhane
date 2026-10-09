import type { DersBolumu } from '../../../types';

/** 4. bölüm: sayılarla sinir sistemi — ağırlık, hacim ve MR eğrileri, kabuk yüzeyi ve kalınlığı, sinaps, miyelinli lif, enerji, miyelinleşme takvimi. */
export const sayilarlaSinirSistemi: DersBolumu = {
  id: 'sayilarla-sinir-sistemi',
  baslik: 'Sayılarla sinir sistemi',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyinle ilgili sayılar çoğu zaman tek bir değer gibi söylenir: "beyin 1,4 kg’dır", "100 milyar nöron vardır". Oysa her sayı birkaç şeye bağlıdır. Sayı **kimde, hangi yaşta, hangi yöntemle ve hangi tanımla** ölçüldü? Bu bölümde sayıları aralıklarıyla ve nereden geldikleriyle birlikte veriyoruz. Birbirini tutmayan sayıların çoğu aslında farklı şeyleri ölçer.

Yetişkin bir insan beyni kabaca 1200 ile 1500 gram arasında tartılır. Yaklaşık 1400 cm³ yer kaplar. Bu, vücut ağırlığının yalnızca %2’si kadardır. Buna karşılık vücuda verilen oksijenin ve enerjinin yaklaşık %20’si beyne gider (Dafny, 2020).

Kalbin pompaladığı kanın ne kadarı beyne gider? Burada kaynaklar farklı sayılar verir. Bir kaynağa göre dinlenmede bu pay yaklaşık %14’tür (Wilson, 2016). Başka kaynaklara göre yaklaşık %20’dir (Dafny, 2020; Khartabil ve ark., 2026). Bu payı %14–20 diye bilmek yeterlidir.

Erişkin bir erkek beyni ortalama 1,5 kg gelir. Böyle bir beyinde yaklaşık **86 milyar nöron** vardır. Nöron olmayan hücrelerin sayısı da neredeyse bir o kadardır (Herculano-Houzel, 2009). Bu sayımın öyküsünü ve "100 milyar nöron, on kat glia" efsanesini dersin Sinir dokusu bölümünde bulursun. Burada beynin ağırlığına, hacmine, yüzeyine, bağlantılarına ve enerjisine bakıyoruz.`,
    },
    {
      tur: 'sahne',
      baslik: 'İki kabuk, iki yüzey',
      aciklama:
        'Beyne arkadan bakıyoruz. Mavi büyük beyin, turuncu beyincik, mor beyin sapı. Etiketlerdeki sayılar kabuk yüzeyinin ölçüm ve tahminleridir. Beyinciğin hacmi, büyük beyninkinin yanında küçücük kalır. Ama kabuğu çok sık katlanmıştır. Bu yüzden yüzeyi neredeyse büyük beyin kabuğununki kadar geniştir. Model sadeleştirilmiştir: beyinciğin ince yaprakları modelde görünmez. Bakış düğmesiyle beyni yandan ve alttan da incele.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'bolge',
        bakis: 'arka',
        etiketler: [
          { yapi: 'oksipital-lob-sol', metin: 'Büyük beyin kabuğu: ~1640–2040 cm²' },
          { yapi: 'beyincik', metin: 'Beyincik kabuğu: ~1590 cm²' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Ağırlık:** erişkinde yaklaşık 1,2–1,5 kg. Bu, vücut ağırlığının %2’si.
- **Enerji:** vücudun enerji bütçesinin yaklaşık %20’si. Glikozun %25’i, oksijenin yaklaşık %20’si beyne gider.
- **Hücre:** yaklaşık 86 milyar nöron ve bir o kadar nöron olmayan hücre. Nöronların çoğu beyincikte.
- **Kabuk:** ortalama 2,5–3 mm kalınlığında. Yüzeyinin üçte ikisi oluklarda gizli.
- **Gelişim:** kabuktaki gri cevherin hacmi ~6 yaşında, beyaz cevherin hacmi ~29 yaşında en yüksektir. Bölgeleri birbirine bağlayan ilişkilendirme yollarında miyelinleşme 20’li yaşlarda sürer. Bazı bölgelerde 30’lu yaşlarda da sürer.
- **Her sayı bir ortalamadır:** cinsiyete, yaşa, boya ve ölçüm yöntemine göre değişir.`,
    },
    {
      tur: 'sayilar',
      baslik: 'Dört şaşırtıcı sayı',
      ogeler: [
        {
          deger: '%2 → %20',
          aciklama:
            'Beyin vücut kütlesinin %2’si kadardır. Ama vücudun enerji bütçesinin yaklaşık %20’sini tüketir (Herculano-Houzel, 2011).',
        },
        {
          deger: '164',
          birim: 'trilyon',
          aciklama:
            'Beş genç erkeğin beyninde sayıldı. Yalnızca neokorteksteki ortalama sinaps (bağlantı noktası) sayısıdır (Tang ve ark., 2001).',
        },
        {
          deger: '176.000',
          birim: 'km',
          aciklama:
            '20 yaşındaki bir erkeğin beyaz cevherindeki miyelinli liflerin toplam uzunluğu. Bu uzunluk 80 yaşında 97.200 km’ye iner (Marner ve ark., 2003).',
        },
        {
          deger: '1590',
          birim: 'cm²',
          aciklama:
            'Tek bir beyincik örneğinde ölçülen kabuk yüzeyi. Bu, neokorteks için hesaplanan yüzeyin %78’i kadardır. Oysa beyinciğin hacmi neokorteksin yaklaşık sekizde biridir (Sereno ve ark., 2020).',
        },
      ],
      not: 'Sayılar ortalamadır. Ölçüm yöntemine ve incelenen kişilere göre değişir.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kabuk mu, neokorteks mi?** "Kabuk 16 milyar nöron taşır" denince hangi kabuk kastedilir? Bu sayı, izotropik fraksiyonatör (*isotropic fractionator*) denen bir yöntemden gelir. Yöntem dokuyu ezip sıvı hâline getirir ve içindeki hücreleri sayar. Bu sayımda kabuk bir bütün olarak tartıldı: ortalama 1233 g. Bu, beynin ağırlığının %82’si demektir. Ama beynin nöronlarının yalnızca %19’u buradadır (Herculano-Houzel, 2009; Azevedo ve ark., 2009).

%82 çok yüksek bir orandır. Tartılan kütleye kabuğun altındaki beyaz cevherin de girdiğini düşündürür. Bu yüzden bu sayıyı "yalnızca gri cevher" diye okuma.

Neokorteksin gri cevherinde başka bir yöntemle de sayım yapıldı: stereoloji, yani ince kesitlerden örnek alarak sayma. Pakkenberg ile Gundersen 94 Danimarkalı beyinde bu yöntemi kullandı. Kadında ortalama 19, erkekte 23 milyar nöron buldular. Aradaki fark %16’dır (Pakkenberg ve Gundersen, 1997). Aynı seride nöron sayısını en çok cinsiyet ve yaş belirliyordu. Vücut büyüklüğünün tek başına etkisi yoktu (Pakkenberg ve Gundersen, 1997). Yöntemlerin ayrıntısı Sinir dokusu bölümündeki "Nöron saymak" kutusunda.`,
    },
    {
      tur: 'metin',
      md: `**Ağırlık cinsiyete, boya ve yaşa göre değişir.** Erkek beyni ortalamada kadın beyninden biraz ağırdır. Dekaban otopside 2773 erkek ve 1963 kadın beynini tarttı. Bu seride fark %9,8’di (Dekaban, 1978). Bu bölümdeki öteki serilerin ortalamalarında fark %10–14 dolayındadır.

Türkiye’den bir örnek de var. Denizli’de, Pamukkale Üniversitesi Tıp Fakültesi Adli Tıp Anabilim Dalı’nda 230 adli otopsi incelendi. Kişiler 18–75 yaş arasındaydı. Ortalama beyin ağırlığı kadınlarda yaklaşık 1255 g, erkeklerde yaklaşık 1403 g’dı (Ata Öztürk ve ark., 2025).

Boy da önemlidir. Boy her santimetre uzadıkça beyin, cinsiyet ne olursa olsun, ortalama 3,7 g ağırlaşır (Hartmann ve ark., 1994).

Beyin en hızlı doğumdan sonraki ilk yıllarda büyür. Ağırlığı ilk 3 yılda doğumdakinin dört katına çıkar. Dekaban’ın serisine göre beyin en ağır hâline genç erişkinlikte, yaklaşık 19 yaşında ulaşır. 45–50 yaş dolayında ağırlık yavaş yavaş azalmaya başlar. 86 yaşın üstünde ortalama, gençlikteki en yüksek değerin yaklaşık %11 altındadır (Dekaban, 1978).

Gray de bir yüzyıl önce benzer bir tablo çizmişti. Ona göre hızlı büyüme ilk dört yılda olur. Beyin en ağır hâline yaklaşık 20 yaşında ulaşır (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Seriler neden farklı sayılar verir?** Çünkü her seri farklı insanları tartar.

Hartmann ve arkadaşları 8000’i aşkın otopsiye baktı. Bu kişilerde beyin hastalığı yoktu. Ortalama beyin ağırlığı erkekte 1336 g, kadında 1198 g’dı. Beyin her yıl erkekte 2,7 g, kadında 2,2 g hafifliyordu (Hartmann ve ark., 1994).

Molina ve DiMaio ise sağlıklı genç erişkinleri tarttı. Bu kişiler 18–35 yaşındaydı ve bir yaralanmayla aniden ölmüştü. Erkeklerde (n = 232) ortalama 1407 g buldular (1070–1767 g). Kadınlarda (n = 102) ortalama 1233 g’dı (1000–1618 g). Bir de %95 başvuru aralığı önerdiler. Bu aralık erkekte 1179–1621 g, kadında 1033–1404 g’dır (Molina ve DiMaio, 2012, 2015). Bu aralıklar yalnızca genç erişkinler içindir.

Dekaban 2773 erkek ve 1963 kadın beynini taradı. Bu geniş seride erkek beyni ortalama %9,8 daha ağırdı (Dekaban, 1978). Gray’in verdiği değerler erkekte yaklaşık 1380 g, kadında yaklaşık 1250 g’dır (Gray, 1918). Bunlar bugünkü serilerin aralığına düşer.

**Türkiye verileri.** Pamukkale serisi Ocak 2020 ile Ocak 2021 arasında yapılan 230 adli otopsiye dayanır. Ortalama beyin ağırlığı kadınlarda 1254,88 ± 125,13 g, erkeklerde 1403,25 ± 159,10 g ölçüldü. Kadınlarda üç ölçü arttıkça beyin ağırlığı azalıyordu: beden kitle indeksi, bel-kalça oranı ve deri altı yağ kalınlığı. Erkeklerde bu ilişki görülmedi. Yazarlar bir sınırlılığa da dikkat çeker. Kadın örneklemi küçüktü (n = 43). Bu yüzden bulgu kolayca genellenemez (Ata Öztürk ve ark., 2025).

Bebekler için de bir seri var. Şanlıurfa Adli Tıp Şube Müdürlüğü’nde 2017–2020 arasında 324 bebeğin otopsisi incelendi. Bebekler 0–1 yaşındaydı. Türk ve Suriyeli bebeklerdi. Beyin ağırlığı ile vücut ağırlığı arasındaki ilişki çok güçlüydü (ρ = 0,833). Beyin bu bakımdan en güçlü ilişkili organlardan biriydi; karaciğerde değer 0,847’ydi (Altın ve ark., 2026).

Bu Türk serileri adli olgulardan gelir. Onları bir "normal başvuru değeri" gibi okuma. Kendi toplumumuzdan gelen bir ölçüm olarak oku.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Erişkin beyin ağırlığı: seriler ve tanımlar',
      sutunlar: ['Seri', 'Kimler tartıldı?', 'Erkek', 'Kadın', 'Not'],
      satirlar: [
        ['Gray (1918)', 'Ders kitabı ortalaması', '~1380 g', '~1250 g', 'En ağır hâli ~20 yaşında'],
        ['Dekaban (1978)', '2773 erkek, 1963 kadın otopsisi', '—', '—', 'Erkek %9,8 ağır; en ağır ~19 yaşta; azalma 45–50 yaşta başlar'],
        [
          'Hartmann ve ark. (1994)',
          '8000’i aşkın otopsi, beyin hastalığı yok',
          '1336 g',
          '1198 g',
          'Yılda −2,7 g (erkek), −2,2 g (kadın); boyun her cm’si +3,7 g',
        ],
        [
          'Molina ve DiMaio (2012, 2015)',
          'Yaralanmayla ani ölüm, 18–35 yaş (232 erkek, 102 kadın)',
          '1407 g (%95 aralık 1179–1621)',
          '1233 g (%95 aralık 1033–1404)',
          'Yalnızca genç erişkinler için',
        ],
        [
          'Ata Öztürk ve ark. (2025), Denizli',
          '230 adli otopsi, 18–75 yaş (43 kadın)',
          '1403,25 ± 159,10 g',
          '1254,88 ± 125,13 g',
          'Kafa içi atardamarında aterom plağı olanlarda daha hafif',
        ],
      ],
      not: 'Ortalama ve aralıklar seriye, yaşa, boya ve otopsiye alınan olgulara göre değişir. Dekaban (1978) serisinden burada yalnızca iki cinsiyet arasındaki fark verildi.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Otopside beyin ağırlığı ne söyler?',
      md: `Aterom plağı, atardamar duvarında biriken yağlı bir plaktır. Pamukkale serisinde bazı kişilerin kafa içi atardamarlarında böyle plaklar vardı. Bu kişilerde beyin anlamlı olarak daha hafif, kalp anlamlı olarak daha ağırdı (Ata Öztürk ve ark., 2025). Demek ki beyin ağırlığı yalnızca cinsiyet ve yaşla değil, damar sağlığıyla da ilişkili olabilir. Ama bir ilişki tek başına neden-sonuç göstermez.

Bir beyni "hafif" ya da "ağır" saymak için uygun bir başvuru değeri gerekir. Bu değer kişinin yaşına, cinsiyetine ve boyuna uymalıdır. Genç erişkinler için önerilen %95 aralığı (Molina ve DiMaio, 2012, 2015) yaşlı bir kişiye doğrudan uygulanamaz. Çünkü beyin yaşla her yıl birkaç gram hafifler. Boy da ağırlığı etkiler (Hartmann ve ark., 1994).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Adli otopside "hafif" bir beyin',
      oyku: `78 yaşında, 152 cm boyunda bir kadın evinde ölü bulunuyor. Otopsiyi yapan adli tıp asistanı beyni 1080 g tartıyor. Beyne çıplak gözle bakınca kitle, kanama ya da yumuşama görülmüyor. Kafa içi atardamarlarında yer yer aterom plakları var. Asistan ders kitabında "kadında yaklaşık 1250 g" yazdığını görüyor. Raporuna "belirgin beyin küçülmesi" yazmak istiyor.`,
      soru: 'Bu ağırlık hangi değerlerle karşılaştırılmalıdır? "Belirgin küçülme" demek neden aceleci olabilir?',
      cozum: `**Başvuru değeri nereden geliyor?** Gray’in yaklaşık 1250 g’ı yaşa göre ayrılmamış bir ortalamadır (Gray, 1918). Genç kadınlar için önerilen %95 aralığı ise 1033–1404 g’dır. Bu aralık, 18–35 yaşında ani ölümle kaybedilmiş kişilerden gelir (Molina ve DiMaio, 2015). Bu yüzden 78 yaşındaki birine doğrudan uygulanamaz. Üstelik 1080 g bu genç erişkin aralığının bile içindedir.

**Yaş:** Beyin ağırlığı 45–50 yaş dolayında yavaş yavaş azalmaya başlar. 86 yaşın üstünde ortalama, genç erişkinlikteki en yüksek değerin yaklaşık %11 altındadır (Dekaban, 1978). Hartmann serisinde kadınlarda beyin her yıl ortalama 2,2 g hafifler (Hartmann ve ark., 1994).

**Boy:** Boyun her santimetresi beyne, cinsiyet ne olursa olsun, yaklaşık 3,7 g ekler (Hartmann ve ark., 1994). Kısa boylu bir kişide beklenen ağırlık da düşüktür.

**Damar hastalığı:** Pamukkale serisinde kafa içi aterom plağı olanlarda beyin anlamlı olarak daha hafifti (Ata Öztürk ve ark., 2025). Bu bulgu raporda ayrıca yazılmalı. Ama tek başına bir hastalık tanısı yerine geçmez.

**Sonuç:** Ağırlık; yaşa, cinsiyete ve boya uygun değerlerle karşılaştırılmalıdır. Yalnızca ağırlığa bakıp "belirgin küçülme" demek doğru olmaz. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'metin',
      md: `**MR ile yaşam boyu.** Bugün beynin büyüklüğü çoğunlukla terazide değil, MR’da ölçülür. "Beyin grafikleri" adlı büyük bir çalışma 100’ü aşkın çalışmanın verisini birleştirdi. Toplam 101.457 kişinin 123.984 MR taraması incelendi. Veriler anne karnındaki 115. günden 100 yaşa kadar bütün yaşamı kapsar (Bethlehem ve ark., 2022).

Sonuç şunu gösterir: beynin dokuları farklı takvimlerle büyür ve küçülür. Hatırlatalım: gri cevherde nöron gövdeleri, beyaz cevherde miyelinli lifler toplanır. Kabuktaki (kortikal) toplam **gri cevherin** hacmi yaklaşık 6 yaşında (5,9) en yüksektir. Sonra neredeyse düz bir çizgiyle azalır. **Beyaz cevherin** hacmi ise yaklaşık 29 yaşına (28,7) dek artar. 50 yaşından sonra daha hızlı azalır (Bethlehem ve ark., 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yaşam boyu MR eğrilerinde zirve yaşları',
      sutunlar: ['Ölçü', 'En yüksek olduğu yaş (%95 güven aralığı)', 'Sonra ne olur?'],
      satirlar: [
        ['Kabuktaki (kortikal) toplam gri cevher hacmi', '5,9 yaş (5,8–6,1)', 'Neredeyse düz bir çizgiyle azalır'],
        ['Beyaz cevher hacmi', '28,7 yaş (28,1–29,2)', '50 yaşından sonra daha hızlı azalır'],
        ['Derin (subkortikal) gri cevher hacmi', '14,4 yaş (ergenlik)', 'Gri ve beyaz cevherin arasında bir eğri'],
        ['Toplam serebrum hacmi', '12,5 yaş (12,14–12,89)', '—'],
        ['Toplam kabuk yüzey alanı', '10,97 yaş (10,42–11,51)', '—'],
        ['Ortalama kabuk kalınlığı', '1,7 yaş (1,3–2,1)', 'Çok erken zirve, sonra incelme'],
        [
          'Beyin-omurilik sıvısı hacmi',
          'Zirve yok',
          '2 yaşa dek artar, 30 yaşa dek değişmez, sonra artar; 50’li yaşlarda artış çok hızlanır (üstel)',
        ],
      ],
      not: 'Kaynak: Bethlehem ve ark. (2022); 101.457 kişide 123.984 MR taraması.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gri ve beyaz cevherin yarışı.** Doğumdan sonraki ilk ayda kabuktaki gri cevher beyaz cevheri geçer. Böylece beynin hacimce en büyük dokusu olur. İki hacim arasındaki fark yaklaşık 3 yaşında en büyüktür (Bethlehem ve ark., 2022).

Kabuğun bölgeleri de aynı anda olgunlaşmaz. Çalışmada 34 kabuk alanına ayrı ayrı bakıldı. Her alandaki gri cevher hacmi en yüksek değerine yaklaşık 2 ile 10 yaş arasında ulaşır. Birincil duyu alanları, yani duyuyu kabukta ilk karşılayan alanlar, zirveye en erken ulaşır. Sonra daha hızlı küçülürler. Bilgileri birleştiren ilişkilendirme alanları ise daha geç olgunlaşır (Bethlehem ve ark., 2022).

**Zirve kaçta?** Beyin en ağır hâline kaç yaşında ulaşır? Kaynaklar farklı yaşlar verir. Otopside bu yaş yaklaşık 19’dur (Dekaban, 1978). Gray’e göre yaklaşık 20’dir (Gray, 1918). Bir derlemeye göre ise beyin ağırlığı 10–12 yaşta erişkin değerine ulaşır (Buyanova ve Arsalidou, 2021). MR’da toplam serebrum hacmi 12,5 yaşında en yüksektir (Bethlehem ve ark., 2022). Bu çalışmaların ölçütü (ağırlık ya da hacim) farklıdır. Yöntemi (otopsi ya da MR) ve incelediği kişiler de farklıdır. Bu yüzden en doğru özet şudur: zirve **çocukluğun sonu ile genç erişkinlik arasındadır**.`,
    },
    {
      tur: 'metin',
      md: `**İnce ama geniş bir örtü.** Beyin kabuğu ortalama 2,5–3 mm kalınlığındadır, ama bölgeye göre 0,5 ile 4,5 mm arasında değişir (Demirci ve Holland, 2022). Bu ince örtü kıvrılarak kafatasına sığar. Kıvrımlar sayesinde sınırlı kafatası hacmine daha çok gri cevher sığar (OpenStax 13.2). Kabuk yüzeyinin yaklaşık üçte ikisi olukların içinde gizli kalır (Lee, 2019).

Yüzey ne kadar büyük? Bir ölçüm sabitlenmiş beyinlerde yapıldı; yani bozulmasın diye kimyasalla korunmuş beyinlerde. Erkeklerde iki yarımkürenin kabuk yüzeyi yaklaşık 1640 cm² bulundu (Henery ve Mayhew, 1989).

MR’a dayanan bir hesap da var. Buna göre kadınlarda iki yarımkürenin dış (pial) yüzeyi yaklaşık 2038 cm²’dir. Bu sayı şöyle bulundu. Başka çalışmalar MR ile gri ve beyaz cevherin sınırındaki yüzeyi ölçmüştü. Bu ölçümlerin ortalaması 1,2 ile çarpıldı (Sereno ve ark., 2020). Yani kabuğu açıp yaysak kabaca 0,16–0,2 m² tutar.

Asıl sürpriz beyinciktir. Hacmi neokorteksin yaklaşık sekizde biri kadardır. Ama kabuğu çok ince yapraklar hâlinde katlanır. Araştırmacılar bir kadının beyinciğini ölümden sonra çok güçlü bir MR cihazında (9,4 tesla) taradı. Kabuğu en küçük yaprakçıklarına kadar ayırdılar. Yüzey 1590 cm² geldi. Bu, neokorteks için hesaplanan yüzeyin %78’i kadardır (Sereno ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Bir metrekare değil',
      md: `Bazı ders kitapları, kabuk açılıp yayılırsa yaklaşık **1 m²** tutacağını yazar (OpenStax 13.2). Ölçümler ve MR’a dayanan tahminler bunun yaklaşık beşte biri kadar bir alan gösterir: 1640–2040 cm², yani 0,16–0,2 m² (Henery ve Mayhew, 1989; Sereno ve ark., 2020). Bir yüzey sayısı okurken nasıl ölçüldüğüne de bak. Kabuğun dış (pial) yüzeyi, gri-beyaz cevher sınırındaki yüzeyden yaklaşık 1,2 kat büyüktür (Sereno ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Beyinciğin kabuğu bilgisayarda açılıp düzleştirildi. Ortaya yaklaşık **10 cm eninde ama 1 metreye yakın boyunda** dar bir şerit çıktı (Sereno ve ark., 2020). Beyinciğin hacmi ise neokorteksin yaklaşık sekizde biri kadardır. Bu uzun şerit, çok sık katlanarak bu küçük yapıya sığar (Sereno ve ark., 2020).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Üstten kesit: kıvrımları izleyen ince şerit',
      aciklama:
        'Beynin üst bölümü yatay (aksiyel) bir düzlemle kesilip kaldırıldı. Kesit yüzüne üstten bakıyoruz; ön taraf yukarıda. Renkler gerçeğe yakın. Dışta pembemsi ince bir şerit var: bu gri cevherdir, yani kabuk. Şerit kıvrımları izler ve olukların içine dalar. İçteki krem renkli geniş alan beyaz cevherdir. Şeridin oyuklara ne kadar derin girdiğine bak: kabuk yüzeyinin üçte ikisi bu oyuklarda saklıdır. Kesit düğmesiyle kesiti aşağı indir; derindeki çekirdekleri ve karıncıkları da görürsün. Model sadeleştirilmiştir. Kabuğun gerçek kalınlığı için metindeki sayılara bak.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'karincik'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'aksiyel', konum: 0.4 },
        bakis: 'ust',
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kalınlığı nasıl ölçüyoruz?** Fischl ve Dale (2000), kabuk kalınlığını MR görüntülerinden otomatik ölçen bir yöntem geliştirdi. Bu ölçümlerde kişiler arasındaki standart sapma 0,5 mm’nin altındaydı. Bu tür ölçümlerle yapılan bir çalışmada ortalama kalınlık 2,71 ± 0,8 mm bulundu (Demirci ve Holland, 2022). Yazarlar başka çalışmalardaki biraz daha düşük ortalamaları da anar.

Kalınlık, kıvrımın neresinde ölçüldüğüne de bağlıdır. Neokorteks 1–3 mm kalınlıktadır. Girusların (kabarık kıvrımların) tepesinde, olukların dibine göre daha kalındır (Lee, 2019).

Henery ile Mayhew yaşlı kişilerin sabitlenmiş beyinlerini ölçtü: 76–81 yaşında 6 erkek ve 70–98 yaşında 6 kadın. Erkeklerde büyük beynin hacmi 840 cm³, kabuğun hacmi 320 cm³ geldi. Ortalama kabuk kalınlığı 2,2 mm’ydi. Kadınlarda kabuğun yüzeyi daha küçüktü, ama hacmi erkeklerdeki kadardı (Henery ve Mayhew, 1989). Bu çalışmaların örneklemi, sabitlemesi ve yöntemi farklıdır. Bu yüzden sayılar birbirinin yerine kullanılamaz.

**Yaşam boyu kalınlık.** Ortalama kabuk kalınlığı şaşırtıcı biçimde erken, yaklaşık 1,7 yaşında en yüksektir (Bethlehem ve ark., 2022). ENIGMA adlı araştırma birliği 3–90 yaş arası 17.075 sağlıklı kişiyi inceledi. Çoğu bölgede kalınlık çocuklukta en yüksekti. Kabuk 20’li yaşlara dek daha hızlı, sonra daha yavaş inceldi (Frangou ve ark., 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kabuk yüzeyi ve kalınlığı: ölçüme göre değişen sayılar',
      sutunlar: ['Ölçü', 'Değer', 'Nasıl ölçüldü?', 'Kaynak'],
      satirlar: [
        [
          'Büyük beyin kabuğunun yüzeyi (erkek)',
          '~1640 cm²; üçte ikisi oluklarda ve insulada',
          'Sabitlenmiş yaşlı beyinlerde stereoloji',
          'Henery ve Mayhew (1989)',
        ],
        [
          'İki yarımkürenin dış (pial) yüzeyi (kadın)',
          '~2038 cm²',
          'MR’a dayalı tahmin: başka çalışmalardaki gri-beyaz sınırı yüzeyi ortalaması × 1,2',
          'Sereno ve ark. (2020)',
        ],
        [
          'Beyincik kabuğunun yüzeyi',
          '1590 cm² (neokorteksin %78’i)',
          'Tek bir kadın örneği; 9,4 T ölüm sonrası MR; yaprakçıkları ayırt eden yüzey modeli; büzülme düzeltmeli',
          'Sereno ve ark. (2020)',
        ],
        ['Ortalama kabuk kalınlığı', '2,5–3 mm (aralık 0,5–4,5 mm)', 'MR, otomatik ölçüm', 'Demirci ve Holland (2022)'],
        ['Neokorteks kalınlığı', '1–3 mm; girus tepesinde daha kalın', 'Gelişim ve doku derlemesi', 'Lee (2019)'],
        ['Ortalama kabuk kalınlığı (yaşlı erkek, sabitlenmiş)', '2,2 mm', 'Stereoloji', 'Henery ve Mayhew (1989)'],
      ],
      not: 'Tek bir "doğru" sayı yoktur. Sonucu üç şey değiştirir: yüzeyin hangi sınırda ölçüldüğü, beynin sabitlenip sabitlenmediği ve kişilerin yaşı.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Yüzeyi ölçmek neden zor?',
      md: `Beyincik kabuğunun yüzeyi için daha önceki en büyük tahmin 1128 cm²’ydi. Canlı insanda çekilen MR’lardan yapılan tahminler ise çok daha küçüktü: 125–540 cm². Çünkü bu görüntülerde yapraklar tek tek ayırt edilemiyordu (Sereno ve ark., 2020). Yeni ölçüm tek bir örnekte yapıldı. Bu ölçümde beyincik yüzeyi, neokorteks için hesaplanan yüzeye neredeyse eşit çıktı. Demek ki katlanmayı ölçmek, görüntünün ne kadar ince ayrıntı gösterdiğine (çözünürlüğe) çok bağlıdır. Büyük beyin kabuğunda da iki yüzey arasında yaklaşık 1,2 kat fark vardır: dış (pial) yüzey ve gri-beyaz cevher sınırındaki yüzey (Sereno ve ark., 2020).

Kalınlıkta da genel kural her bölgeye uymaz. 17.075 kişilik ENIGMA verisinde çoğu bölge çocuklukta en kalındı. Ama üç bölge bu örüntünün dışında kaldı: entorinal, temporopolar ve ön singulat kabuk (Frangou ve ark., 2022). Bu yüzden kabuk yüzeyi ve kalınlığı için tek bir "normal" sayı vermiyoruz. Sayıları tanımlarıyla birlikte veriyoruz.`,
    },
    {
      tur: 'metin',
      md: `**Bağlantıların sayısı.** Sinaps, iki sinir hücresinin bilgi aktardığı bağlantı noktasıdır. Beş genç erkeğin beyninde, yalnızca neokortekste ortalama **164 trilyon** sinaps sayıldı (Tang ve ark., 2001).

Bir derlemeye göre sinaps oluşumu (sinaptogenez) gebeliğin ortasında başlar. 2–3 yaş dolayında doruğa ulaşır. Ergenlikte yeniden hızlanır; bu en çok prefrontal kabukta, yani alnın arkasındaki kabukta olur. Beyin bir yandan da bazı sinapsları ortadan kaldırır. Buna sinaps budaması denir. Budama doğum dolayında başlar, çocuklukta yoğunlaşır ve 10–20 yaş arasında doruğa ulaşır (Khartabil ve ark., 2026). Başlangıç için kaynaklar farklı zamanlar verir. Başka bir derleme, sinaps oluşumunun 12. gebelik haftasında başladığını yazar (AlRayahi ve ark., 2026).

Nöronları birbirine bağlayan miyelinli lifler de şaşırtıcı uzunluktadır. Miyelin, lifi saran yağlı bir kılıftır. Marner ve arkadaşları bu liflerin toplam uzunluğunu hesapladı. 20 yaşındaki bir erkeğin beyaz cevherinde bu uzunluk yaklaşık **176.000 km**’dir. Aynı yaştaki bir kadında yaklaşık 149.000 km’dir. 80 yaşında uzunluk erkekte 97.200, kadında 82.000 km’ye iner (Marner ve ark., 2003).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Marner ve arkadaşlarının (2003) bulgularına göre lif uzunluğu her on yılda yaklaşık %10 azalır. 20 ile 80 yaş arasındaki toplam kayıp %45’tir. İki cinsiyet arasındaki fark %16’dır. Kaybolanlar daha çok ince liflerdir. Kalın lifler daha iyi korunur. Beyaz cevher, yaşla en çok küçülen beyin yapısıdır: yaklaşık %30 küçülür (Marner ve ark., 2003). Neokortekste nöron sayısı ise yaşla çok daha az azalır: 20 ile 90 yaş arasında yaklaşık %10 (Pakkenberg ve Gundersen, 1997).

Tang ve arkadaşlarının (2001) sayımında beş beyin arasındaki değişkenlik katsayısı 0,17’ydi. Bu katsayı, değerlerin ortalama çevresinde ne kadar dağıldığını gösterir. Yazarlar bu dağılmanın nereden geldiğini de inceledi. Bir bölümü ölçümün kendi belirsizliğinden geliyordu. Bu belirsizlik en çok, her beyinden örnek alınan doku bloklarından kaynaklanıyordu. Yani 164 trilyon da bir ortalamadır.`,
    },
    {
      tur: 'metin',
      md: `**Pahalı bir organ.** Beyin vücut kütlesinin %2’si kadardır, ama vücudun enerji bütçesinin yaklaşık %20’sini tüketir (Herculano-Houzel, 2011). Beyin enerji depolamaz ve ihtiyacının neredeyse tamamını kanla gelen glikozu oksijenle yakarak karşılar (Dash, 2026). Bu yakıtı kan getirir. Kan akımının sayılarını bu dersin Beyni koruyanlar ve besleyenler bölümünde bulursun. Orada beynin kan akımını nasıl sabit tuttuğu da anlatılıyor. Kansız kalan beynin ne kadar dayanabildiği de orada.

Peki bu kadar enerji nereye gider? Beyinde üretilen enerjinin %75–80’ini nöronlar tüketir (Watts ve ark., 2018). Enerjinin yarıdan biraz fazlası sinyal iletmeye gider. Yarıya yakını ise hücreyi ayakta tutan "ev işlerine" harcanır (Engl ve Attwell, 2015).

Beynin payı neden bu kadar yüksek? Herculano-Houzel’e göre insanın nöronları özellikle "pahalı" değildir. Pay yüksektir, çünkü insan beyninde çok sayıda nöron vardır (Herculano-Houzel, 2011).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '"Beynimizin %10’unu kullanırız" efsanesi',
      md: 'Bu bilgi yanlıştır. Bazı kanıtlar dokudaki kan akımının ölçülmesine dayanır. Bu kanıtlar, iyi tanımlanmış bir görev sırasında beynin yaklaşık **%80’inin** enerji kullandığını düşündürür (OpenStax 12.1). Beyin dinlenirken de çalışır. Bir görsel uyarı, uyanık bir insanın görme kabuğunda enerji (ATP) üretimini yalnızca %8–12 artırır (Herculano-Houzel, 2011). Yani enerjinin büyük kısmı zaten her an harcanır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gri ve beyaz cevherin bütçesi.** Hayvan ölçümlerinde gri cevherin glikoz kullanımı beyaz cevherinkinin yaklaşık beş katıdır (Dash, 2026). Beyaz cevherde sinaptik iletime ve aksiyon potansiyellerine çok daha az enerji gider. Engl ve Attwell burada bir varsayım yapar: hücreyi ayakta tutan işlere, aynı hacimde, gri cevherdeki kadar enerji gider. O zaman bu işlerin payı beyaz cevherde toplamın yaklaşık %60’ına çıkar (Engl ve Attwell, 2015). Nöron başına bakınca da fark büyüktür. Kabuktaki bir nöron, beyincikteki bir nörondan en az 10 kat fazla glikoz kullanır (Herculano-Houzel, 2011).

**Yaş ve kişi farkı.** PET, beynin oksijen tüketimini ve kan akımını görüntüleyebilen bir yöntemdir. PET ölçümlerinde "saf" gri ve beyaz cevher bölgelerine bakıldı. Bu bölgelerde oksijen tüketimi, kan akımı ve kan hacmi yaşla yılda yaklaşık %0,5 azalır (Leenders ve ark., 1990). Beyin kan akımı erken çocuklukta en yüksektir. Sonra yaşam boyunca azalır (Khartabil ve ark., 2026). Kişiler arası fark da büyüktür. Perfüzyon, dokuya ulaşan kan miktarıdır. Aynı yaş ve cinsiyetteki kişiler arasında perfüzyon farkı %100’e varabilir. Tüm beyin perfüzyonu kadınlarda erkeklerden %13 yüksek bulunmuştur (Parkes ve ark., 2004).

**Çocuk beyninin bedeli.** Vücut dinlenirken de enerji harcar. Bu harcamanın hızına dinlenme metabolizma hızı denir. Kuzawa ve arkadaşları beynin glikoz kullanımını bu hızla karşılaştırdı. Doğumda bu oran erkeklerde %52,5, kızlarda %59,8’dir. Oran en yüksek değerine doğumda değil, çocuklukta ulaşır: yaklaşık üçte iki (%66,3 ve %65,0) (Kuzawa ve ark., 2014).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beynin enerji bütçesi: sayılar',
      sutunlar: ['Ölçü', 'Değer', 'Kaynak ve not'],
      satirlar: [
        ['Vücut kütlesindeki / enerji bütçesindeki payı', '%2 / ~%20', 'Herculano-Houzel (2011)'],
        ['Glikozdaki / oksijendeki payı', '%25 / ~%20', 'Siwicka-Gieroba ve ark. (2022)'],
        ['Enerjiyi kim harcar?', 'Nöronlar %75–80', 'Beyinde üretilen enerjiden (Watts ve ark., 2018)'],
        ['Sinyal dışı ("ev işi") pay', 'Yarıya yakın; eski bütçelerde %25–50', 'Engl ve Attwell (2015)'],
        ['Sodyum pompasının payı', 'Oksijen tüketiminin %55’i', 'Hayvan deneyi, anestezi altında (Engl ve Attwell, 2015)'],
        ['Gri / beyaz cevher glikoz kullanımı', 'Yaklaşık 5 : 1', 'Hayvan ölçümleri (Dash, 2026)'],
        ['Nöron başına glikoz: kabuk / beyincik', 'En az 10 : 1', 'Herculano-Houzel (2011)'],
        ['Görsel uyarının ek maliyeti', 'ATP üretiminde %8–12 artış', 'Uyanık insanda görme kabuğu (Herculano-Houzel, 2011)'],
        ['Beyin glikozu / dinlenme metabolizması', 'Doğumda %52,5–59,8; çocuklukta %65–66', 'Kuzawa ve ark. (2014)'],
        ['Yaşla değişim', 'Yılda ~%0,5 azalma', 'Oksijen tüketimi, kan akımı ve kan hacmi; PET (Leenders ve ark., 1990)'],
      ],
      not: 'Kan akımı, oksijen tüketimi ve otoregülasyon (kan akımını sabit tutma) sayıları Beyni koruyanlar ve besleyenler bölümünde. Değerler ortalamadır. Kişiler arası fark büyüktür (Parkes ve ark., 2004).',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Enerji nereye gider?',
      md: `**Pahalı nöron değil, çok nöron.** Herculano-Houzel insan dahil altı kemirgen ve primat türüne baktı. Nöron başına tahmini glikoz kullanımı bu türler arasında yalnızca %40 kadar değişiyordu. Yani nöron başına enerji bütçesi dikkat çekici biçimde sabittir. Bölgeler arasında ise fark büyüktür. Kabuktaki bir nöron, beyincikteki bir nörondan en az 10 kat fazla glikoz tüketir. Uyarının ek maliyeti küçüktür. Görsel bir uyarı, uyanık insanın görme kabuğunda ATP üretimini yalnızca %8–12 artırır (Herculano-Houzel, 2011).

**Sinyal mi, "ev işi" mi?** Beyinde üretilen enerjinin %75–80’ini nöronlar tüketir (Watts ve ark., 2018). Engl ile Attwell’e göre beyin enerjisinin yarıya yakını sinyal dışı işlere gider. Bu "ev işleri" arasında protein ve lipit yapımı, mitokondrideki proton kaçağı ve hücre iskeletinin yenilenmesi vardır. Önceki enerji bütçeleri bu işlere toplamın %25–50’sini ayırmıştı.

Bir deneyde hayvanlar halotan adlı bir anestezi ilacıyla uyutuldu. Bu hayvanlarda beynin oksijen tüketiminin %55’i sodyum pompasına gidiyordu. Halotan nöronların ateşlemesini (sinyal üretmesini) azaltıyorsa, uyanık hayvanda bu pay %55’ten fazladır. Beyaz cevher, sinaptik iletime ve aksiyon potansiyellerine çok daha az enerji harcar. Ev işlerine aynı hacimde gri cevherdeki kadar enerji gittiği varsayılırsa, beyaz cevherde bu pay toplamın yaklaşık %60’ına çıkar (Engl ve Attwell, 2015).

**İki bütçe, iki sonuç.** İlk bütçe kemirgen gri cevheri için hazırlandı. Bu bütçede en büyük kalem aksiyon potansiyelleriydi (%47). Öteki kalemler şöyleydi: glutamatın sinaps sonrası etkileri %34, dinlenim potansiyeli %13, glutamatın geri dönüşümü %3. Bu bütçe, enerji tasarrufu için dağıtık bir kodlama öngörüyordu: aynı anda nöronların en fazla %15’i etkin olacaktı (Attwell ve Laughlin, 2001).

Sonra memeli nöronlarında aksiyon potansiyelinin sanıldığından çok daha verimli olduğu anlaşıldı. Bunun üzerine bütçe güncellendi. Güncel bütçede beyin kabuğundaki sinyal enerjisinin %50’si sinaps sonrası glutamat almaçlarına gider. Öteki kalemler: aksiyon potansiyelleri %21, dinlenim potansiyeli %20, sinaps öncesi salım %5, haberci maddenin geri dönüşümü %4 (Howarth ve ark., 2012). Bu yüzden 2001 bütçesi "güncel" diye anlatılmamalıdır.`,
    },
    {
      tur: 'metin',
      md: `**Miyelin: yavaş kurulan bir yalıtım.** Miyelin, aksonları saran yalıtıcı bir kılıftır. İnsan, merkezî sinir sistemi neredeyse miyelinsiz olarak doğar. Miyelinleşme çocukluğun ilk birkaç yılında hızla yayılır. Ergenlik boyunca ve erişkinliğe dek belirli bir sırayla sürer (Williamson ve Lyons, 2018).

Başlangıç zamanı kaynağa göre değişir. Bir derlemeye göre ilk miyelin gebeliğin 12–14. haftasında omurilikte belirir (Buyanova ve Arsalidou, 2021). Başka bir derleme başlangıcı en erken 16. gebelik haftası olarak verir (AlRayahi ve ark., 2026).

En hızlı dönem, gebeliğin ortasından doğum sonrası ikinci yılın sonuna kadardır. Frontal (alın), parietal (yan kafa) ve oksipital (art kafa) loblardaki lifler doğumdan sonraki 8–12. aylarda miyelinlenmiş olur. Ama ilişkilendirme yollarının çoğu 20’li yaşlarda da miyelinlenmeyi sürdürür. Bu yollar beynin farklı bölgelerini birbirine bağlar. En son miyelinlenen yer, kabuğun kendi içindeki liflerdir (Buyanova ve Arsalidou, 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Miyelinleşme takvimi',
      sutunlar: ['Ne zaman?', 'Ne olur?', 'Kaynak'],
      satirlar: [
        ['Gebeliğin 12–14. haftası', 'İlk miyelin: omurilik', 'Buyanova ve Arsalidou (2021)'],
        ['Fetal ~5. ay (Gray’e göre)', 'Ön ve arka kökler kılıflanır; kortikospinal lifler 9. aydan sonra', 'Gray (1918)'],
        ['Gebelik ortası – doğum sonrası 2. yılın sonu', 'En hızlı miyelinleşme dönemi', 'Buyanova ve Arsalidou (2021)'],
        ['Doğumdan önce ve sonra', 'Demetler anne karnında, doğumdan sonrakinden daha hızlı miyelinlenir', 'Grotheer ve ark. (2023)'],
        ['Doğum sonrası 1. yılın başı', 'Kafa siniri köklerinin miyelinleşmesi tamamlanır', 'Buyanova ve Arsalidou (2021)'],
        ['6. ay', 'Korpus kallozumun dizi (genu) miyelinlenmiştir', 'Buyanova ve Arsalidou (2021)'],
        ['8–12. ay', 'Frontal, parietal ve oksipital loblardaki lifler miyelinlenmiştir', 'Buyanova ve Arsalidou (2021)'],
        ['İlk 3 yıl', 'Bütün MR yöntemlerinde hızlı beyaz cevher gelişimi', 'Lebel ve Deoni (2018)'],
        ['20’li yaşlar', 'İlişkilendirme yollarının çoğunda miyelinleşme sürer', 'Buyanova ve Arsalidou (2021)'],
        ['20–42 yaş', 'Fraksiyonel anizotropi (FA) en yüksek; sonra azalır', 'Lebel ve ark. (2012)'],
        ['Kabaca 20–40 yaş', 'Prefrontal bölgeler ve optik radyasyon miyelin zirvesinde', 'Buyanova ve Arsalidou (2021)'],
        [
          'Erişkinlik',
          'Kabukta erişkinlikte doğmuş oligodendrositler; kabuk içi lifler en son miyelinlenir',
          'Williamson ve Lyons (2018); Buyanova ve Arsalidou (2021)',
        ],
      ],
      not: '"8–12. ayda miyelinlenmiş" ilk miyelinleşmeyi anlatır. "20–40 yaşta zirve" ise olgunlaşmanın sonunu anlatır. İki bilgi çelişmez, çünkü ölçütleri farklıdır. Başlangıç haftaları da kaynağa göre değişir. Buyanova ve Arsalidou (2021) ilk miyelini omurilikte, 12–14. gebelik haftasında verir. AlRayahi ve ark. (2026) yer belirtmez. Miyelinlenmenin başlangıcını en erken 16. gebelik haftası, sinaps oluşumununkini 12. hafta olarak verir. İki derleme de haftaların nereden sayıldığını belirtmez: son adetten mi, döllenmeden mi? Bu yüzden bu haftalar, embriyolojideki döllenme sonrası günlerle doğrudan karşılaştırılmamalıdır.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sıra:** önce omurilik ve kökler, en son kabuk içi lifler miyelinlenir. Hareket (motor) kökleri duyu köklerinden daha hızlı ve daha kısa sürede miyelinlenir (Buyanova ve Arsalidou, 2021).
- **Duyu önce:** talamusa ve kabuğa duyu bilgisi taşıyan lifler önce miyelinlenir. Duyuyu harekete bağlayan bütünleştirici lifler sonra gelir (Buyanova ve Arsalidou, 2021).
- **Arkadan öne:** gelişim boyunca miyelin göstergesi beynin arkasından önüne doğru artar. Bu gösterge manyetizasyon transfer oranıdır (MTR). Projeksiyon ve komissür lifleri, ilişkilendirme liflerinden hızlıdır (Buyanova ve Arsalidou, 2021).
- **Erken ve geç:** korpus kallozum ve forniks erken olgunlaşır. Singulum, unsinat demet ve üst longitudinal demet geç olgunlaşır ve geç bozulur (Lebel ve ark., 2012).
- **Zirveler:** kabuk gri cevheri hacmi ~6 yaş, beyaz cevher hacmi ~29 yaş (Bethlehem ve ark., 2022); FA 20–42 yaş (Lebel ve ark., 2012).
- **Yaşlanma:** 20–80 yaş arasında miyelinli liflerin uzunluğu %45 azalır. En çok ince lifler kaybolur (Marner ve ark., 2003).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'MR’da miyelini görmek',
      md: `Beyaz cevher, miyelin yüzünden yağdan zengindir. Bu yüzden MR’da gri cevherden kolayca ayrılır (OpenStax 12.1). Beyaz cevherin olgunlaşmasını izlemek için başka ölçüler de kullanılır. Bunlardan biri difüzyon tensör görüntülemedeki **fraksiyonel anizotropidir (FA)**. FA, suyun dokuda ne kadar tek bir yönde yayıldığını gösterir. Lebel ve arkadaşları 5–83 yaş arası 403 sağlıklı kişide FA’yı ölçtü. FA çocukluk ve ergenlikte arttı, 20–42 yaş arasında zirve yaptı, sonra azaldı (Lebel ve ark., 2012).

Bu ölçüler yalnızca miyelini değil, aksonların sıkı dizilişini de yansıtır (Lebel ve Deoni, 2018). Bu yüzden "FA = miyelin" diye okunmamalıdır. Yenidoğanlarda başka ölçüler de kullanılır. Örneğin T1 ve T2 ağırlıklı görüntülerin oranı (T1w/T2w) (Grotheer ve ark., 2023).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Erken doğan bebeğin miyelini',
      oyku: `Bir bebek gebeliğin 30. haftasında doğuyor ve yenidoğan yoğun bakımda büyüyor. Asıl doğum tarihinin geldiği hafta, araştırma amacıyla bir MR çekiliyor. Bu MR’da miyeline duyarlı ölçüm düşük çıkıyor. Değer, aynı haftada zamanında doğmuş bebeklerinkinden düşük. Anne ve baba, bebeklerinin beyninde "eksik" bir şey olup olmadığını soruyor.`,
      soru: 'Bu bebeğin miyelin ölçümü akranlarından neden düşük? Miyelinleşmenin takvimi ve hızı bunu nasıl açıklar?',
      cozum: `**Takvim:** İnsan, merkezî sinir sistemi neredeyse miyelinsiz olarak doğar. Miyelinleşme ilk yıllarda hızla yayılır ve erişkinliğe dek sürer (Williamson ve Lyons, 2018). En hızlı dönem, gebeliğin ortasından doğum sonrası ikinci yılın sonuna kadardır (Buyanova ve Arsalidou, 2021). Bütün MR yöntemleri ilk 3 yılda hızlı bir beyaz cevher gelişimi gösterir (Lebel ve Deoni, 2018).

**Anne karnı ve dışarısı:** Yenidoğanlarda yapılan bir çalışma beyaz cevher demetlerine baktı. Bütün demetlerde miyeline duyarlı ölçüm (T1w/T2w) anne karnında daha hızlı arttı. Doğumdan hemen sonra artış daha yavaştı. Doğumdan sonra yavaşlayan bu hız, erken doğan bebeklerdeki düşük miyelin içeriğini açıklıyordu (Grotheer ve ark., 2023). Bu bebek, akranlarının anne karnında geçirdiği 10 haftayı dışarıda geçirdi.

**Ölçümü okumak:** Bu tür ölçümler miyelinin yanında aksonların sıkı dizilişini de yansıtabilir (Lebel ve Deoni, 2018). Tek bir ölçüm, bebeğin gelişimi hakkında kesin bir yargı vermez. Gelişimi izleyen hekimle birlikte değerlendirilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Miyelin ömür boyu değişir',
      md: `Oligodendrositler, beyinde miyelini yapan hücrelerdir. Karbon tarihlemesi bir hücrenin ne zaman doğduğunu tahmin etmeye yarar. Bu yöntemle insan kabuğunda erişkinlikte doğmuş oligodendrositler bulundu. Aynı çalışmalara göre korpus kallozumdaki oligodendrositlerin çoğu ise erken çocukluktan kalmadır (Williamson ve Lyons, 2018).

Beyaz cevher demetleri anne karnında, doğumdan sonrakinden daha hızlı miyelinlenir. Doğumdan sonra yavaşlayan bu hız, erken doğan bebeklerde görülen düşük miyelin içeriğini açıklar (Grotheer ve ark., 2023). İnsanı şempanzeyle karşılaştıran bir çalışma da var. İnsanda neokorteksin miyelinleşmesi çocuklukta daha yavaştır ve geç ergenliğin ötesine uzanır (Miller ve ark., 2012).

Bebeklikteki miyelinleşme sırası klasik bir otopsi çalışmasına dayanır. Bu çalışmada 1972–1984 arasında farklı hastalıklarla kaybedilen 162 bebek incelendi. Her bebekte merkezî sinir sisteminin 62 bölgesi derecelendirildi (Brody ve ark., 1987). Gray’e göre yarımküre liflerinin kılıflanması doğum dolayında başlar ve ergenliğe dek sürer (Gray, 1918). Bugünkü MR çalışmaları ise bu sürecin yaşamın üçüncü, hatta dördüncü on yılına uzandığını gösterir (Buyanova ve Arsalidou, 2021; Lebel ve ark., 2012).`,
    },
  ],
};
