import type { DersBolumu } from '../../../types';

/** 4. bölüm: sayılarla sinir sistemi — ağırlık, hacim ve MR eğrileri, kabuk yüzeyi ve kalınlığı, sinaps, miyelinli lif, enerji, miyelinleşme takvimi. */
export const sayilarlaSinirSistemi: DersBolumu = {
  id: 'sayilarla-sinir-sistemi',
  baslik: 'Sayılarla sinir sistemi',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyinle ilgili sayılar çoğu zaman tek bir değer gibi söylenir: "beyin 1,4 kg’dır", "100 milyar nöron vardır". Gerçekte her sayı **kimde, hangi yaşta, hangi yöntemle ve hangi tanımla** ölçüldüğüne bağlıdır. Bu bölümde sayıları aralıklarıyla ve nereden geldikleriyle birlikte veriyoruz; birbirini tutmayan sayıların çoğu, aslında farklı şeyleri ölçer.

Yetişkin bir insan beyni kabaca 1200 ile 1500 gram arasında tartılır ve yaklaşık 1400 cm³ yer kaplar; bu, vücut ağırlığının yalnızca %2’si kadardır. Buna karşılık vücuda verilen oksijenin ve enerjinin yaklaşık %20’si beyne gider (Dafny, 2020). Kalbin pompaladığı kandan beynin aldığı pay için kaynaklar farklı sayılar verir: dinlenmede yaklaşık %14 (Wilson, 2016) ya da yaklaşık %20 (Dafny, 2020; Khartabil ve ark., 2026); bu payı %14–20 diye bilmek yeterlidir. Ortalama 1,5 kg ağırlığındaki erişkin erkek beyninde yaklaşık **86 milyar nöron** ve neredeyse bir o kadar nöron olmayan hücre vardır (Herculano-Houzel, 2009); bu sayımın ve "100 milyar nöron, on kat glia" efsanesinin öyküsü dersin Sinir dokusu bölümünde. Burada beynin ağırlığına, hacmine, yüzeyine, bağlantılarına ve enerjisine bakıyoruz.`,
    },
    {
      tur: 'sahne',
      baslik: 'İki kabuk, iki yüzey',
      aciklama:
        'Beyne arkadan bakıyoruz. Mavi büyük beyin, turuncu beyincik, mor beyin sapı. Etiketlerdeki sayılar kabuk yüzeyi için yapılmış ölçüm ve tahminlerdir: hacmi büyük beynin yanında küçücük kalan beyincik, çok sık katlanmış kabuğu sayesinde neredeyse büyük beyin kabuğu kadar geniş bir yüzeye sahiptir. Model sadeleştirilmiştir; beyinciğin ince yaprakları modelde görünmez. Bakış düğmesiyle beyni yandan ve alttan da incele.',
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
      md: `- **Ağırlık:** erişkinde yaklaşık 1,2–1,5 kg; vücut ağırlığının %2’si.
- **Enerji:** vücudun enerji bütçesinin yaklaşık %20’si; glikozun %25’i, oksijenin yaklaşık %20’si.
- **Hücre:** yaklaşık 86 milyar nöron ve bir o kadar nöron olmayan hücre; nöronların çoğu beyincikte.
- **Kabuk:** ortalama 2,5–3 mm kalınlığında; yüzeyinin üçte ikisi oluklarda gizli.
- **Gelişim:** kabuk gri cevheri hacmi ~6, beyaz cevher hacmi ~29 yaşında en yüksek; miyelinleşme ilişkilendirme yollarında 20’li yaşlarda, bazı bölgelerde 30’lu yaşlarda da sürer.
- **Her sayı bir ortalamadır:** cinsiyete, yaşa, boya ve ölçüm yöntemine göre değişir.`,
    },
    {
      tur: 'sayilar',
      baslik: 'Dört şaşırtıcı sayı',
      ogeler: [
        {
          deger: '%2 → %20',
          aciklama:
            'Beyin vücut kütlesinin %2’si kadardır ama vücudun enerji bütçesinin yaklaşık %20’sini tüketir (Herculano-Houzel, 2011).',
        },
        {
          deger: '164',
          birim: 'trilyon',
          aciklama: 'Beş genç erkek beyninde yalnızca neokortekste sayılan ortalama sinaps sayısı (Tang ve ark., 2001).',
        },
        {
          deger: '176.000',
          birim: 'km',
          aciklama:
            '20 yaşındaki bir erkeğin beyaz cevherindeki miyelinli liflerin toplam uzunluğu; 80 yaşında 97.200 km’ye iner (Marner ve ark., 2003).',
        },
        {
          deger: '1590',
          birim: 'cm²',
          aciklama:
            'Tek bir beyincik örneğinde ölçülen kabuk yüzeyi: neokorteks için hesaplanan yüzeyin %78’i kadar, oysa hacmi onun yaklaşık sekizde biri (Sereno ve ark., 2020).',
        },
      ],
      not: 'Sayılar ortalamadır; ölçüm yöntemi ve incelenen kişilere göre değişir.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kabuk mu, neokorteks mi?** "Kabuk 16 milyar nöron taşır" cümlesindeki kabuk, izotropik fraksiyonatör (*isotropic fractionator*) sayımında bütün olarak alınan yapıdır; bu çalışmada kabuk ortalama 1233 g gelir ve beyin kütlesinin %82’sini oluşturur, ama nöronların yalnızca %19’unu taşır (Herculano-Houzel, 2009; Azevedo ve ark., 2009). %82 gibi yüksek bir oran, tartılan kütleye kabuğun altındaki beyaz cevherin de girdiğini düşündürür; bu yüzden sayı "yalnızca gri cevher" diye okunmamalıdır. Neokorteksin gri cevherinde stereolojiyle yapılan sayımlar ise kadında ortalama 19, erkekte 23 milyar nöron verir (%16 fark; 94 Danimarkalı beyin) (Pakkenberg ve Gundersen, 1997). Aynı seride neokortikal nöron sayısının ana belirleyicileri cinsiyet ile yaştı; vücut büyüklüğünün tek başına etkisi yoktu (Pakkenberg ve Gundersen, 1997). Yöntemlerin ayrıntısı Sinir dokusu bölümündeki "Nöron saymak" kutusunda.`,
    },
    {
      tur: 'metin',
      md: `**Ağırlık cinsiyete, boya ve yaşa göre değişir.** Erkek beyni ortalamada kadın beyninden biraz ağırdır: Dekaban’ın 2773 erkek ve 1963 kadın beynini kapsayan otopsi serisinde fark %9,8’di (Dekaban, 1978); bu bölümde verilen öteki serilerin ortalamalarında fark %10–14 dolayındadır. Türkiye’den bir örnek: Denizli’de Pamukkale Üniversitesi Tıp Fakültesi Adli Tıp Anabilim Dalı’nda 18–75 yaş arasındaki 230 adli otopside ortalama beyin ağırlığı kadınlarda yaklaşık 1255 g, erkeklerde yaklaşık 1403 g’dı (Ata Öztürk ve ark., 2025). Boy da önemlidir: boy her santimetre uzadıkça beyin ağırlığı, cinsiyetten bağımsız olarak, ortalama 3,7 g artar (Hartmann ve ark., 1994).

Beyin en hızlı doğumdan sonraki ilk yıllarda büyür: ağırlığı ilk 3 yılda doğumdakinin dört katına çıkar. En yüksek ağırlığa genç erişkinlikte, yaklaşık 19 yaşında ulaşılır; 45–50 yaş dolayında ilerleyici bir azalma başlar ve 86 yaşın üstündeki ortalama, gençlikteki en yüksek değerin yaklaşık %11 altındadır (Dekaban, 1978). Gray de bir yüzyıl önce benzer bir tablo çizmişti: hızlı büyüme ilk dört yılda, en yüksek ağırlık yaklaşık 20 yaşında (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Seriler neden farklı sayılar verir?** Çünkü her seri farklı insanları tartar. Hartmann ve arkadaşları beyin hastalığı olmayan 8000’i aşkın otopside erkekte ortalama 1336 g, kadında 1198 g buldu; beyin yaşla her yıl erkekte 2,7 g, kadında 2,2 g hafifliyordu (Hartmann ve ark., 1994). Molina ve DiMaio ise ani travmatik ölümle kaybedilen sağlıklı genç erişkinleri (18–35 yaş) tarttı: erkeklerde (n = 232) ortalama 1407 g (1070–1767 g), kadınlarda (n = 102) 1233 g (1000–1618 g). Önerdikleri %95 başvuru aralığı erkekte 1179–1621 g, kadında 1033–1404 g’dır (Molina ve DiMaio, 2012, 2015). Bu aralıklar yalnızca genç erişkinler içindir. 2773 erkek ve 1963 kadın beyni üzerindeki geniş taramada erkek beyni ortalama %9,8 daha ağırdı (Dekaban, 1978). Gray’in verdiği değerler, erkekte yaklaşık 1380 g ve kadında yaklaşık 1250 g, bugünkü serilerin aralığındadır (Gray, 1918).

**Türkiye verileri.** Pamukkale serisi Ocak 2020–Ocak 2021 arasında yapılan 230 adli otopsiye dayanır; kadınlarda ortalama 1254,88 ± 125,13 g, erkeklerde 1403,25 ± 159,10 g ölçüldü. Kadınlarda beyin ağırlığı beden kitle indeksi, bel-kalça oranı ve deri altı yağ kalınlığıyla ters yönde ilişkiliydi; erkeklerde bu ilişki görülmedi. Yazarlar kadın örnekleminin küçük olduğunu (n = 43) ve bu bulgunun genellenmesinin sınırlı olduğunu belirtir (Ata Öztürk ve ark., 2025). Bebekler için Şanlıurfa Adli Tıp Şube Müdürlüğü’nde 2017–2020 arasında incelenen 0–1 yaş 324 Türk ve Suriyeli bebeğin otopsisinde beyin ağırlığı, vücut ağırlığıyla en güçlü ilişkili organlardan biriydi (ρ = 0,833; karaciğerde 0,847) (Altın ve ark., 2026). Bu Türk serileri adli olgulardır; bir "normal başvuru değeri" olarak değil, kendi toplumundan gelen bir ölçüm olarak okunmalıdır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Erişkin beyin ağırlığı: seriler ve tanımlar',
      sutunlar: ['Seri', 'Kimler tartıldı?', 'Erkek', 'Kadın', 'Not'],
      satirlar: [
        ['Gray (1918)', 'Ders kitabı ortalaması', '~1380 g', '~1250 g', 'En yüksek ağırlık ~20 yaşında'],
        ['Dekaban (1978)', '2773 erkek, 1963 kadın otopsisi', '—', '—', 'Erkek %9,8 ağır; zirve ~19 yaş; azalma 45–50 yaşta başlar'],
        [
          'Hartmann ve ark. (1994)',
          '8000’i aşkın otopsi, beyin hastalığı yok',
          '1336 g',
          '1198 g',
          'Yılda −2,7 g (erkek), −2,2 g (kadın); boyun her cm’si +3,7 g',
        ],
        [
          'Molina ve DiMaio (2012, 2015)',
          'Ani travmatik ölüm, 18–35 yaş (232 erkek, 102 kadın)',
          '1407 g (%95 aralık 1179–1621)',
          '1233 g (%95 aralık 1033–1404)',
          'Yalnızca genç erişkinler için',
        ],
        [
          'Ata Öztürk ve ark. (2025), Denizli',
          '230 adli otopsi, 18–75 yaş (43 kadın)',
          '1403,25 ± 159,10 g',
          '1254,88 ± 125,13 g',
          'Kafa içi aterom plağı olanlarda daha hafif',
        ],
      ],
      not: 'Ortalama ve aralıklar seriye, yaşa, boya ve otopsiye alınan olgulara göre değişir. Dekaban (1978) serisinden burada yalnızca iki cinsiyet arasındaki fark verildi.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Otopside beyin ağırlığı ne söyler?',
      md: `Pamukkale serisinde kafa içi atardamarlarında aterom plağı olanlarda beyin ağırlığı anlamlı olarak düşük, kalp ağırlığı anlamlı olarak yüksekti (Ata Öztürk ve ark., 2025). Bu, beyin ağırlığının yalnızca cinsiyet ve yaşla değil damar sağlığıyla da ilişkili olabileceğini düşündürür; ama bir ilişki tek başına neden-sonuç göstermez.

Bir beynin "hafif" ya da "ağır" sayılabilmesi için karşılaştırma, kişinin yaşına, cinsiyetine ve boyuna uygun bir başvuru değeriyle yapılmalıdır. Genç erişkinler için önerilen %95 aralığı (Molina ve DiMaio, 2012, 2015) yaşlı bir kişiye doğrudan uygulanamaz; çünkü beyin yaşla her yıl birkaç gram hafifler ve boy da ağırlığı etkiler (Hartmann ve ark., 1994).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Adli otopside "hafif" bir beyin',
      oyku: `Adli tıp asistanı, evinde ölü bulunan 78 yaşında, 152 cm boyunda bir kadının otopsisinde beyni 1080 g tartıyor. Makroskopik incelemede kitle, kanama ya da yumuşama yok; kafa içi atardamarlarında yer yer aterom plakları var. Asistan ders kitabındaki "kadında yaklaşık 1250 g" değerine bakarak raporuna "belirgin beyin küçülmesi" yazmak istiyor.`,
      soru: 'Bu ağırlık hangi başvuru değerleriyle karşılaştırılmalıdır ve "belirgin küçülme" yorumu neden aceleci olabilir?',
      cozum: `**Başvuru değerinin kaynağı:** Gray’in yaklaşık 1250 g’ı yaşa göre ayrılmamış bir ortalamadır (Gray, 1918). Genç kadınlar için önerilen %95 aralığı (1033–1404 g) ise 18–35 yaş arasında ani ölümle kaybedilmiş kişilerden gelir (Molina ve DiMaio, 2015); 78 yaşındaki birine doğrudan uygulanamaz. Üstelik 1080 g bu genç erişkin aralığının bile içindedir.

**Yaş:** Beyin ağırlığında ilerleyici azalma 45–50 yaş dolayında başlar; 86 yaşın üstünde ortalama, genç erişkinlikteki en yüksek değerin yaklaşık %11 altındadır (Dekaban, 1978). Hartmann serisinde kadınlarda beyin her yıl ortalama 2,2 g hafifler (Hartmann ve ark., 1994).

**Boy:** Boyun her santimetresi beyin ağırlığına cinsiyetten bağımsız olarak yaklaşık 3,7 g ekler (Hartmann ve ark., 1994); kısa boylu bir kişide beklenen ağırlık da düşüktür.

**Damar hastalığı:** Pamukkale serisinde kafa içi aterom plağı olanlarda beyin ağırlığı anlamlı olarak düşüktü (Ata Öztürk ve ark., 2025). Bu bulgu raporda ayrıca yazılmalı; ama tek başına bir hastalık tanısı yerine geçmez.

**Sonuç:** Ağırlık yaş, cinsiyet ve boya uygun değerlerle karşılaştırılmalıdır; tek başına ağırlığa dayanarak "belirgin küçülme" demek doğru olmaz. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'metin',
      md: `**MR ile yaşam boyu.** Bugün beynin büyüklüğü çoğunlukla terazide değil MR’da ölçülür. 100’ü aşkın çalışmadan 101.457 kişinin 123.984 MR taramasını birleştiren "beyin grafikleri" çalışması, anne karnındaki 115. günden 100 yaşa kadar bütün yaşam boyunu kapsadı (Bethlehem ve ark., 2022). Sonuç, beynin farklı dokularının farklı takvimle büyüyüp küçüldüğünü gösterir: toplam **kabuk (kortikal) gri cevheri** hacmi yaklaşık 6 yaşında (5,9) en yüksektir ve sonra neredeyse düz bir çizgiyle azalır; **beyaz cevher** hacmi ise yaklaşık 29 yaşına (28,7) dek artar ve 50 yaşından sonra azalması hızlanır (Bethlehem ve ark., 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yaşam boyu MR eğrilerinde zirve yaşları',
      sutunlar: ['Ölçü', 'Zirve yaşı (%95 güven aralığı)', 'Zirveden sonra'],
      satirlar: [
        ['Toplam kabuk (kortikal) gri cevheri hacmi', '5,9 yaş (5,8–6,1)', 'Neredeyse doğrusal azalma'],
        ['Beyaz cevher hacmi', '28,7 yaş (28,1–29,2)', '50 yaşından sonra hızlanan azalma'],
        ['Derin (subkortikal) gri cevher hacmi', '14,4 yaş (ergenlik)', 'Gri ve beyaz cevherin arasında bir örüntü'],
        ['Toplam serebrum hacmi', '12,5 yaş (12,14–12,89)', '—'],
        ['Toplam kabuk yüzey alanı', '10,97 yaş (10,42–11,51)', '—'],
        ['Ortalama kabuk kalınlığı', '1,7 yaş (1,3–2,1)', 'Çok erken zirve, sonra incelme'],
        [
          'Beyin-omurilik sıvısı hacmi',
          'Zirve yok',
          '2 yaşa dek artar, 30 yaşa dek düz seyreder, sonra artar; 50’li yaşlarda artış üstel hızlanır',
        ],
      ],
      not: 'Kaynak: Bethlehem ve ark. (2022); 101.457 kişide 123.984 MR taraması.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gri ve beyaz cevherin yarışı.** Doğumdan sonraki ilk ayda kabuk gri cevheri beyaz cevherin önüne geçerek beynin hacimce baskın dokusu olur; iki hacim arasındaki fark yaklaşık 3 yaşında en büyüktür (Bethlehem ve ark., 2022). Kabuğun bölgeleri de aynı anda olgunlaşmaz: 34 kabuk alanında bölgesel gri cevher hacminin zirve yaşı yaklaşık 2 ile 10 yaş arasında değişir; birincil duyu alanları zirveye en erken ulaşır ve sonra daha hızlı küçülür, ilişkilendirme alanları ise daha geç olgunlaşır (Bethlehem ve ark., 2022).

**Zirve kaçta?** Beyin ağırlığının zirvesi için kaynaklar farklı yaşlar verir: otopside yaklaşık 19 (Dekaban, 1978), Gray’e göre yaklaşık 20 yaş (Gray, 1918); bir derlemeye göre ise beyin ağırlığı 10–12 yaşta erişkin değerine ulaşır (Buyanova ve Arsalidou, 2021). MR’da toplam serebrum hacmi 12,5 yaşında zirve yapar (Bethlehem ve ark., 2022). Ölçüt (ağırlık ya da hacim), yöntem (otopsi ya da MR) ve incelenen kişiler farklı olduğundan en doğru özet, zirvenin **çocukluğun sonu ile genç erişkinlik arasında** olduğudur.`,
    },
    {
      tur: 'metin',
      md: `**İnce ama geniş bir örtü.** Beyin kabuğu ortalama 2,5–3 mm kalınlığındadır; bölgeye göre 0,5 ile 4,5 mm arasında değişir (Demirci ve Holland, 2022). Bu ince örtü kıvrılarak kafatasına sığar: kıvrımlar sınırlı kafatası hacmine daha çok gri cevher sığdırır (OpenStax 13.2) ve kabuk yüzeyinin yaklaşık üçte ikisi olukların içinde gizli kalır (Lee, 2019).

Yüzey ne kadar büyük? Sabitlenmiş beyinlerde yapılan ölçümde erkeklerde iki yarımkürenin kabuk yüzeyi yaklaşık 1640 cm² bulundu (Henery ve Mayhew, 1989). MR’a dayanan bir hesaba göre kadınlarda iki yarımkürenin dış (pial) yüzeyi yaklaşık 2038 cm²’dir; bu sayı, başka çalışmalarda MR ile ölçülen gri-beyaz cevher sınırı yüzeyinin ortalaması 1,2 katsayısıyla büyütülerek bulunmuştur (Sereno ve ark., 2020). Yani kabuğu açıp yaysak kabaca 0,16–0,2 m² tutar. Asıl sürpriz beyinciktir: hacmi neokorteksin yaklaşık sekizde biri olduğu hâlde, çok ince yapraklar hâlinde katlanır. Tek bir kadın beyincik örneğinin ölüm sonrası 9,4 teslalık MR’ında, en küçük yaprakçıklarına kadar çıkarılan kabuğun yüzeyi 1590 cm² bulundu; bu, neokorteks için hesaplanan yüzeyin %78’i kadardır (Sereno ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Bir metrekare değil',
      md: `Bazı ders kitaplarında beyin kabuğu açılıp yayılırsa yaklaşık **1 m²** tutacağı yazar (OpenStax 13.2). Ölçümler ve MR’a dayanan tahminler bunun yaklaşık beşte biri kadar bir alan gösterir: 1640–2040 cm², yani 0,16–0,2 m² (Henery ve Mayhew, 1989; Sereno ve ark., 2020). Bir yüzey sayısı okurken nasıl ölçüldüğüne de bak: kabuğun dış (pial) yüzeyi, gri-beyaz cevher sınırında ölçülen yüzeyden yaklaşık 1,2 kat büyüktür (Sereno ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Beyinciğin kabuğu bilgisayarda açılıp düzleştirildiğinde yaklaşık **10 cm eninde ama 1 metreye yakın boyunda** dar bir şerit ortaya çıktı (Sereno ve ark., 2020). Beyincik bu uzun şeridi, hacmi neokorteksin yaklaşık sekizde biri kadar olan bir yapıya çok sık katlanarak sığdırır (Sereno ve ark., 2020).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Üstten kesit: kıvrımları izleyen ince şerit',
      aciklama:
        'Beynin üst bölümü yatay (aksiyel) bir düzlemle kesilip kaldırıldı; kesit yüzüne üstten bakıyoruz, ön taraf yukarıda. Renkler gerçeğe yakın: dışta kıvrımları izleyerek olukların içine dalan pembemsi ince şerit gri cevher (kabuk), içteki krem renkli geniş alan beyaz cevherdir. Şeridin oyuklara ne kadar derin girdiğine bak: kabuk yüzeyinin üçte ikisi bu oyuklarda saklıdır. Kesit düğmesiyle kesiti aşağı indirip derindeki çekirdekleri ve karıncıkları da görebilirsin. Model sadeleştirilmiştir; kabuğun gerçek kalınlığı için metindeki sayılara bak.',
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
      md: `**Kalınlığı nasıl ölçüyoruz?** Fischl ve Dale (2000) kabuk kalınlığını MR görüntülerinden otomatik ölçen bir yöntem geliştirdi; ölçümlerin kişiler arası standart sapması 0,5 mm’nin altındaydı. Bu tür ölçümlerle yapılan bir çalışmada ortalama kalınlık 2,71 ± 0,8 mm bulundu; yazarlar başka çalışmalardaki biraz daha düşük ortalamaları da anar (Demirci ve Holland, 2022). Kalınlık kıvrımın neresinde ölçüldüğüne bağlıdır: neokorteks 1–3 mm kalınlıktadır ve girusların tepesinde olukların dibine göre daha kalındır (Lee, 2019). Sabitlenmiş yaşlı beyinlerde (76–81 yaşında 6 erkek, 70–98 yaşında 6 kadın) erkek büyük beyninin hacmi 840 cm³, kabuğunun hacmi 320 cm³, ortalama kabuk kalınlığı 2,2 mm ölçüldü; kadınlarda kabuğun yüzeyi daha küçük, hacmi ise erkeklerdeki kadardı (Henery ve Mayhew, 1989). Örneklem, sabitleme ve yöntem farklı olduğu için bu sayılar birbirinin yerine kullanılamaz.

**Yaşam boyu kalınlık.** Ortalama kabuk kalınlığı şaşırtıcı biçimde erken, yaklaşık 1,7 yaşında zirve yapar (Bethlehem ve ark., 2022). ENIGMA konsorsiyumunun 3–90 yaş arası 17.075 sağlıklı kişisinde çoğu bölgede kalınlık çocuklukta en yüksekti; incelme 20’li yaşlara dek daha dik, sonra daha yavaş ilerledi (Frangou ve ark., 2022).`,
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
          'MR’a dayalı tahmin: literatürdeki gri-beyaz sınırı yüzeyi ortalaması × 1,2',
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
      not: 'Tek bir "doğru" sayı yoktur: yüzeyin hangi sınırda ölçüldüğü, beynin sabitlenip sabitlenmediği ve kişilerin yaşı sonucu değiştirir.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Yüzeyi ölçmek neden zor?',
      md: `Beyincik kabuğunun yüzeyi için daha önceki en büyük tahmin 1128 cm²’ydi; canlı MR’dan yapılan tahminler (125–540 cm²) ise çok daha küçüktü, çünkü bu görüntülerde tek tek yapraklar ayırt edilemiyordu (Sereno ve ark., 2020). Tek bir örnekte yapılan yeni ölçümde beyincik yüzeyinin, neokorteks için hesaplanan yüzeye neredeyse eşit çıkması, katlanmanın çözünürlüğe ne kadar duyarlı olduğunu gösterir. Büyük beyin kabuğunda da dış (pial) yüzey ile gri-beyaz cevher sınırındaki yüzey arasında yaklaşık 1,2 kat fark vardır (Sereno ve ark., 2020).

Kalınlıkta da genel kural her bölgeye uymaz: 17.075 kişilik ENIGMA verisinde çoğu bölge çocuklukta en kalınken entorinal, temporopolar ve ön singulat kabuk bu örüntünün dışında kaldı (Frangou ve ark., 2022). Bu yüzden kabuk yüzeyi ve kalınlığı için tek bir "normal" sayı yerine, sayıları tanımlarıyla birlikte veriyoruz.`,
    },
    {
      tur: 'metin',
      md: `**Bağlantıların sayısı.** Beş genç erkek beyninde yalnızca neokortekste ortalama **164 trilyon** sinaps sayıldı (Tang ve ark., 2001). Sinaps oluşumu (sinaptogenez) gebeliğin ortasında başlar, 2–3 yaş dolayında doruğa ulaşır ve ergenlikte, özellikle prefrontal kabukta yeniden hızlanır; sinaps budaması ise doğum dolayında başlar, çocuklukta yoğunlaşır ve 10–20 yaş arasında doruğa ulaşır (Khartabil ve ark., 2026). Başlangıç için kaynaklar farklı zamanlar verir: başka bir derleme sinaps oluşumunun 12. gebelik haftasında başladığını yazar (AlRayahi ve ark., 2026).

Nöronları birbirine bağlayan miyelinli lifler de şaşırtıcı uzunluktadır: 20 yaşındaki bir erkeğin beyaz cevherindeki miyelinli liflerin toplam uzunluğu yaklaşık **176.000 km**, aynı yaştaki bir kadınınki yaklaşık 149.000 km’dir. 80 yaşında bu uzunluk erkekte 97.200, kadında 82.000 km’ye iner (Marner ve ark., 2003).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Marner ve arkadaşlarının (2003) bulguları on yılda yaklaşık %10, 20 ile 80 yaş arasında toplam %45 kayba karşılık gelir; iki cinsiyet arasındaki fark %16’dır. Kaybedilenler daha çok ince liflerdir, kalın lifler görece korunur. Beyaz cevher, yaşla en çok küçülen beyin yapısıdır: yaklaşık %30 (Marner ve ark., 2003). Neokortekste nöron sayısı ise yaşla çok daha az azalır: 20 ile 90 yaş arasında yaklaşık %10 (Pakkenberg ve Gundersen, 1997). Tang ve arkadaşlarının (2001) sayımında beş beyin arasındaki değişkenlik katsayısı 0,17’ydi; yazarların hassasiyet çözümlemesine göre bu değişkenliğin bir bölümü ölçümün kendi belirsizliğinden, özellikle her beyinden örneklenen doku bloklarından geliyordu. 164 trilyon da bir ortalamadır.`,
    },
    {
      tur: 'metin',
      md: `**Pahalı bir organ.** Beyin vücut kütlesinin %2’si kadarken vücudun enerji bütçesinin yaklaşık %20’sini tüketir (Herculano-Houzel, 2011). Enerji depolamaz; ihtiyacının neredeyse tamamını kanla gelen glikozun oksijenle yakılmasından karşılar (Dash, 2026). Bu yakıtı getiren kan akımının sayıları, beynin kan akımını nasıl sabit tuttuğu ve kansız kalan beynin ne kadar dayanabildiği bu dersin Beyni koruyanlar ve besleyenler bölümünde anlatılıyor.

Peki bu kadar enerji nereye gider? Beyinde üretilen enerjinin %75–80’ini nöronlar tüketir (Watts ve ark., 2018); enerjinin yarıdan biraz fazlası nöronların sinyal iletmesine, yarıya yakını da hücreyi ayakta tutan "ev işlerine" harcanır (Engl ve Attwell, 2015). Herculano-Houzel’e göre beynin bu yüksek payı insana özgü "pahalı" nöronlardan değil, insan beynindeki nöronların çokluğundan kaynaklanır (Herculano-Houzel, 2011).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '"Beynimizin %10’unu kullanırız" efsanesi',
      md: 'Bu bilgi yanlıştır. Doku kan akımına dayanan bazı kanıtlar, iyi tanımlanmış bir görev sırasında beynin yaklaşık **%80’inin** enerji kullandığını düşündürür (OpenStax 12.1). Beyin dinlenirken de çalışır: görsel bir uyarı, uyanık bir insanın görme kabuğunda ATP üretimini yalnızca %8–12 artırır (Herculano-Houzel, 2011); yani enerjinin büyük kısmı zaten her an harcanmaktadır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gri ve beyaz cevherin bütçesi.** Hayvan ölçümlerinde gri cevherin glikoz kullanımı beyaz cevherinkinin yaklaşık beş katıdır (Dash, 2026). Beyaz cevherde sinaptik iletime ve aksiyon potansiyellerine çok daha az enerji gider. Hücreyi ayakta tutan işlere birim hacimde gri cevherdeki kadar enerji gittiği varsayılırsa, bu işlerin payı beyaz cevherde toplamın yaklaşık %60’ına çıkar (Engl ve Attwell, 2015). Nöron başına bakıldığında da fark büyüktür: kabuktaki bir nöron, beyincikteki bir nörondan en az 10 kat fazla glikoz kullanır (Herculano-Houzel, 2011).

**Yaş ve kişi farkı.** PET ölçümlerinde "saf" gri ve beyaz cevher bölgelerinde oksijen tüketimi, kan akımı ve kan hacmi yaşla birlikte yılda yaklaşık %0,5 azalır (Leenders ve ark., 1990). Beyin kan akımı erken çocuklukta en yüksektir ve sonra yaşam boyunca azalır (Khartabil ve ark., 2026). Kişiler arası fark büyüktür: aynı yaş ve cinsiyetteki kişiler arasında perfüzyon farkı %100’e varabilir; tüm beyin perfüzyonu kadınlarda erkeklerden %13 yüksek bulunmuştur (Parkes ve ark., 2004).

**Çocuk beyninin bedeli.** Beynin glikoz kullanımı, vücudun dinlenme metabolizma hızına oranla doğumda erkeklerde %52,5, kızlarda %59,8’dir. Bu oran doğumda değil çocuklukta en yüksektir: yaklaşık üçte iki (%66,3 ve %65,0) (Kuzawa ve ark., 2014).`,
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
      not: 'Kan akımı, oksijen tüketimi ve otoregülasyon sayıları Beyni koruyanlar ve besleyenler bölümünde. Değerler ortalamadır; kişiler arası fark büyüktür (Parkes ve ark., 2004).',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Enerji nereye gider?',
      md: `**Pahalı nöron değil, çok nöron.** İnsan dahil altı kemirgen ve primat türünde nöron başına tahmini glikoz kullanımı yalnızca %40 kadar değişir; yani nöron başına enerji bütçesi dikkat çekici biçimde sabittir. Bölgeler arasında ise fark büyüktür: nöron başına glikoz tüketimi kabukta beyincikteki nöronlardan en az 10 kat fazladır. Uyarının ek maliyeti küçüktür: görsel uyarı uyanık insanın görme kabuğunda ATP üretimini yalnızca %8–12 artırır (Herculano-Houzel, 2011).

**Sinyal mi, "ev işi" mi?** Beyinde üretilen enerjinin %75–80’ini nöronlar tüketir (Watts ve ark., 2018). Beyin enerjisinin yarıya yakını sinyal dışı süreçlere gider; önceki enerji bütçeleri protein ve lipit yapımı, mitokondrideki proton kaçağı ve hücre iskeletinin yenilenmesi gibi bu "ev işlerine" toplamın %25–50’sini ayırmıştı. Halotanla uyutulmuş hayvanlarda yapılan deneylerde sodyum pompası beynin oksijen tüketiminin %55’inden sorumluydu; halotanın nöronların ateşlemesini azalttığı varsayılırsa, uyanık hayvanda bu pay %55’ten fazladır. Ev işlerine birim hacimde gri cevherdeki kadar enerji gittiği varsayılırsa, sinaptik iletime ve aksiyon potansiyellerine çok daha az enerji harcayan beyaz cevherde bu pay toplamın yaklaşık %60’ına çıkar (Engl ve Attwell, 2015).

**İki bütçe, iki sonuç.** Kemirgen gri cevheri için hazırlanan ilk bütçede en büyük kalem aksiyon potansiyelleriydi (%47); glutamatın sinaps sonrası etkileri %34, dinlenim potansiyeli %13, glutamatın geri dönüşümü %3 tutuyordu. Bu bütçe, enerji tasarrufu için aynı anda nöronların en fazla %15’inin etkin olduğu dağıtık bir kodlamayı öngörüyordu (Attwell ve Laughlin, 2001). Memeli nöronlarında aksiyon potansiyelinin sanıldığından çok daha verimli olduğu anlaşılınca güncellenen bütçede beyin kabuğunda sinyal enerjisinin %50’si sinaps sonrası glutamat almaçlarına, %21’i aksiyon potansiyellerine, %20’si dinlenim potansiyeline, %5’i sinaps öncesi salıma ve %4’ü haberci maddenin geri dönüşümüne gider (Howarth ve ark., 2012). 2001 bütçesi bu yüzden "güncel" diye anlatılmamalıdır.`,
    },
    {
      tur: 'metin',
      md: `**Miyelin: yavaş kurulan bir yalıtım.** İnsan, merkezî sinir sistemi neredeyse miyelinsiz olarak doğar; miyelinleşme çocukluğun ilk birkaç yılında hızla yayılır, ergenlik boyunca ve erişkinliğe dek belirli bir sırayla sürer (Williamson ve Lyons, 2018). Bir derlemeye göre ilk miyelin gebeliğin 12–14. haftasında omurilikte belirir (Buyanova ve Arsalidou, 2021); başka bir derleme miyelinlenmenin başlangıcını en erken 16. gebelik haftası olarak verir (AlRayahi ve ark., 2026). En hızlı dönem gebeliğin ortasından doğum sonrası ikinci yılın sonuna kadardır. Frontal, parietal ve oksipital loblardaki lifler doğumdan sonraki 8–12. aylarda miyelinlenmiş olur; ama ilişkilendirme yollarının çoğu 20’li yaşlarda miyelinlenmeyi sürdürür ve en son miyelinlenen yer kabuğun kendi içindeki liflerdir (Buyanova ve Arsalidou, 2021).`,
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
        ['Doğumdan önce ve sonra', 'Demetler anne karnında doğumdan sonrakinden daha hızlı miyelinlenir', 'Grotheer ve ark. (2023)'],
        ['Doğum sonrası 1. yılın başı', 'Kafa siniri köklerinin miyelinleşmesi tamamlanır', 'Buyanova ve Arsalidou (2021)'],
        ['6. ay', 'Korpus kallozumun dizi (genu) miyelinlenmiştir', 'Buyanova ve Arsalidou (2021)'],
        ['8–12. ay', 'Frontal, parietal ve oksipital loblardaki lifler miyelinlenmiştir', 'Buyanova ve Arsalidou (2021)'],
        ['İlk 3 yıl', 'Bütün MR yöntemlerinde hızlı beyaz cevher gelişimi', 'Lebel ve Deoni (2018)'],
        ['20’li yaşlar', 'İlişkilendirme yollarının çoğunun miyelinleşmesi sürer', 'Buyanova ve Arsalidou (2021)'],
        ['20–42 yaş', 'Fraksiyonel anizotropi (FA) zirvesi; sonra azalma', 'Lebel ve ark. (2012)'],
        ['Kabaca 20–40 yaş', 'Prefrontal bölgeler ve optik radyasyon miyelin zirvesinde', 'Buyanova ve Arsalidou (2021)'],
        [
          'Erişkinlik',
          'Kabukta erişkinlikte doğmuş oligodendrositler; kabuk içi lifler en son miyelinlenir',
          'Williamson ve Lyons (2018); Buyanova ve Arsalidou (2021)',
        ],
      ],
      not: '"8–12. ayda miyelinlenmiş" ilk miyelinleşmeyi, "20–40 yaşta zirve" ise olgunlaşmanın sonunu anlatır; iki bilgi çelişmez, ölçütleri farklıdır. Başlangıç haftaları kaynağa göre değişir: Buyanova ve Arsalidou (2021) ilk miyelini omurilikte 12–14. gebelik haftasında, AlRayahi ve ark. (2026) yer belirtmeden miyelinlenmenin başlangıcını en erken 16. gebelik haftasında, sinaps oluşumununkini 12. haftada verir. İki derleme de haftaların son adetten mi döllenmeden mi sayıldığını belirtmez; bu haftalar embriyolojideki döllenme sonrası günlerle doğrudan karşılaştırılmamalıdır.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sıra:** omurilik ve kökler önce, kabuk içi lifler en son; motor kökler duyu köklerinden daha hızlı ve daha kısa sürede miyelinlenir (Buyanova ve Arsalidou, 2021).
- **Duyu önce:** talamusa ve kabuğa duyu girdisi taşıyan lifler, duyuyu harekete bağlayan bütünleştirici liflerden önce miyelinlenir (Buyanova ve Arsalidou, 2021).
- **Arkadan öne:** gelişim boyunca miyelin göstergesi (MTR) arkadan öne doğru artar; projeksiyon ve komissür lifleri ilişkilendirme liflerinden hızlıdır (Buyanova ve Arsalidou, 2021).
- **Erken ve geç:** korpus kallozum ve forniks erken; singulum, unsinat ve üst longitudinal demet geç olgunlaşır ve geç bozulur (Lebel ve ark., 2012).
- **Zirveler:** kabuk gri cevheri hacmi ~6 yaş, beyaz cevher hacmi ~29 yaş (Bethlehem ve ark., 2022); FA 20–42 yaş (Lebel ve ark., 2012).
- **Yaşlanma:** 20–80 yaş arasında miyelinli lif uzunluğu %45 azalır; en çok ince lifler kaybolur (Marner ve ark., 2003).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'MR’da miyelini görmek',
      md: `Beyaz cevher miyelin nedeniyle yağdan zengin olduğu için MR’da gri cevherden kolayca ayrılır (OpenStax 12.1). Beyaz cevherin olgunlaşmasını izlemek için difüzyon tensör görüntülemedeki **fraksiyonel anizotropi (FA)** gibi ölçüler kullanılır: 5–83 yaş arası 403 sağlıklı kişide FA çocukluk ve ergenlikte arttı, 20–42 yaş arasında zirve yaptı, sonra azaldı (Lebel ve ark., 2012). Bu ölçüler yalnızca miyelini değil aksonların sıkı dizilişini de yansıtır (Lebel ve Deoni, 2018); bu yüzden "FA = miyelin" diye okunmamalıdır. Yenidoğanlarda T1 ve T2 ağırlıklı görüntülerin oranı (T1w/T2w) gibi başka ölçüler de kullanılır (Grotheer ve ark., 2023).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Erken doğan bebeğin miyelini',
      oyku: `Gebeliğin 30. haftasında doğan bir bebek yenidoğan yoğun bakımda büyüyor. Doğum tarihinin asıl gelmesi gereken haftada çekilen araştırma amaçlı MR’da, miyeline duyarlı ölçüm aynı haftada zamanında doğmuş bebeklerinkinden düşük çıkıyor. Anne ve baba, bebeklerinin beyninde "eksik" bir şey olup olmadığını soruyor.`,
      soru: 'Miyelinleşmenin takvimi ve hızı hakkında bilinenler, bu bebeğin miyelin ölçümünün akranlarından neden düşük olduğunu nasıl açıklar?',
      cozum: `**Takvim:** İnsan, merkezî sinir sistemi neredeyse miyelinsiz olarak doğar; miyelinleşme ilk yıllarda hızla yayılır ve erişkinliğe dek sürer (Williamson ve Lyons, 2018). En hızlı dönem gebeliğin ortasından doğum sonrası ikinci yılın sonuna kadardır (Buyanova ve Arsalidou, 2021); bütün MR yöntemleri ilk 3 yılda hızlı bir beyaz cevher gelişimi gösterir (Lebel ve Deoni, 2018).

**Anne karnı ve dışarısı:** Yenidoğanlarda yapılan bir çalışmada ak madde demetlerinin hepsinde miyeline duyarlı ölçüm (T1w/T2w) anne karnında doğumdan hemen sonrakine göre daha hızlı arttı; doğumdan sonra yavaşlayan bu hız, erken doğan bebeklerdeki düşük miyelin içeriğini açıklıyordu (Grotheer ve ark., 2023). Bu bebek, akranlarının anne karnında geçirdiği 10 haftayı dışarıda geçirdi.

**Ölçümü okumak:** Bu tür ölçümler miyelinin yanında aksonların sıkı dizilişini de yansıtabilir (Lebel ve Deoni, 2018); tek bir ölçüm bebeğin gelişimi hakkında kesin bir yargı vermez, gelişimi izleyen hekimle birlikte değerlendirilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Miyelin ömür boyu değişir',
      md: `Karbon tarihlemesi, insan kabuğunda erişkinlikte doğmuş oligodendrositler olduğunu gösterdi; aynı çalışmalara göre korpus kallozumdaki oligodendrositlerin çoğu ise erken çocukluktan kalmadır (Williamson ve Lyons, 2018). Ak madde demetleri anne karnında doğumdan sonrakine göre daha hızlı miyelinlenir; doğumdan sonra yavaşlayan hız, erken doğan bebeklerde görülen düşük miyelin içeriğini açıklar (Grotheer ve ark., 2023). Şempanzeyle karşılaştırıldığında insanda neokortikal miyelinleşme çocuklukta daha yavaştır ve geç ergenliğin ötesine uzanır (Miller ve ark., 2012).

Bebeklikteki miyelinleşme sırasının klasik otopsi temeli, 1972–1984 arasında farklı hastalıklarla kaybedilen 162 bebekte 62 merkezî sinir sistemi bölgesinin derecelendirilmesine dayanır (Brody ve ark., 1987). Gray, yarımküre liflerinin kılıflanmasının doğum dolayında başlayıp ergenliğe dek sürdüğünü yazmıştı (Gray, 1918); bugünkü MR çalışmaları bu sürecin yaşamın üçüncü, hatta dördüncü on yılına uzandığını gösterir (Buyanova ve Arsalidou, 2021; Lebel ve ark., 2012).`,
    },
  ],
};
