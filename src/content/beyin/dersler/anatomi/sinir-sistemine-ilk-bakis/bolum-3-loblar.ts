import type { DersBolumu } from '../../../types';

/** 3. bölüm: yarıklar, oluklar, loblar, işlev alanları, MR işaretleri ve uyanık cerrahi. */
export const yariklarVeLoblar: DersBolumu = {
  id: 'yariklar-ve-loblar',
  baslik: 'Büyük beynin yüzü: yarıklar, oluklar ve loblar',
  bloklar: [
    {
      tur: 'metin',
      md: `Büyük beynin yüzü kıvrım kıvrımdır. Her kabarık kıvrıma **girus** (çoğulu girusler), iki kıvrım arasındaki çukura **sulkus** (oluk), derin oluklara **fissür** (yarık) denir. Bu kıvrılma, kafatasının sınırlı hacmine çok daha geniş bir kabuk sığdırmayı sağlar: kabuk yüzeyinin yaklaşık üçte ikisi oyukların içinde gizlidir.

Dört büyük işaret yüzeyi haritalamaya yeter:

- **Uzunlamasına yarık:** iki yarımküreyi birbirinden ayırır.
- **Lateral oluk (yan yarık):** temporal lobu, üstündeki frontal ve parietal loblardan ayırır.
- **Merkezî oluk:** frontal lobu parietal lobdan ayırır. Önündeki **presantral girus** hareket kabuğunu, arkasındaki **postsentral girus** bedensel duyu kabuğunu taşır.
- **Parieto-oksipital oluk:** beynin iç yüzünde, parietal lobu oksipital lobdan ayırır.

Bu sınırlar dört lobu belirler: **frontal (alın)**, **parietal (yan kafa)**, **temporal (şakak)** ve **oksipital (art kafa)** lob. Lateral oluğun derininde, dışarıdan görünmeyen beşinci bir kabuk bölgesi daha vardır: **insula**. İç yüzde ise korpus kallozumu kuşak gibi saran **limbik lob** bulunur. Her lobu Anatomi bölümünde ayrı bir derste işleyeceğiz.`,
    },
    {
      tur: 'sahne',
      baslik: 'Dört lob ve iki merkez kıvrımı',
      aciklama:
        'Her lob ayrı renkte: mavi frontal, sarı parietal, yeşil temporal, pembe oksipital. Merkezî oluk, presantral ve postsentral girusların arasındadır. Bakış düğmesiyle beyni üstten de incele.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'lob',
        bakis: 'sol',
        etiketler: [
          { yapi: 'orta-frontal-girus-sol', metin: 'Frontal lob' },
          { yapi: 'ust-parietal-lobul-sol', metin: 'Parietal lob' },
          { yapi: 'orta-temporal-girus-sol', metin: 'Temporal lob' },
          { yapi: 'oksipital-lob-sol', metin: 'Oksipital lob' },
          { yapi: 'presantral-girus-sol', metin: 'Presantral girus' },
          { yapi: 'postsentral-girus-sol', metin: 'Postsentral girus' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Üstten bakış: uzunlamasına yarık',
      aciklama: 'Beyne tepeden bakınca iki yarımküreyi ayıran uzunlamasına yarık ön-arka yönde uzanır. Ön taraf ekranın üstündedir.',
      sahne: {
        katmanlar: ['kabuk'],
        renk: 'lob',
        bakis: 'ust',
        etiketler: [
          { yapi: 'ust-frontal-girus-sol', metin: 'Sol yarımküre' },
          { yapi: 'ust-frontal-girus-sag', metin: 'Sağ yarımküre' },
          { yapi: 'presantral-girus-sol', metin: 'Merkezî oluğun önü' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Gizli lob: insula',
      aciklama:
        'Sol yarımkürede lateral oluğu örten kıvrımlar kaldırıldı: alt frontal girus, üst temporal girus ve supramarjinal girus. Altlarındaki mor insula görünür hâle geldi; kaldırılan kıvrımların yerinde krem renkli beyaz cevher görünür.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'sap'],
        renk: 'lob',
        gizle: ['alt-frontal-girus-sol', 'ust-temporal-girus-sol', 'supramarjinal-girus-sol'],
        bakis: 'sol',
        etiketler: [{ yapi: 'insula-sol', metin: 'İnsula' }],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Adların arkasındaki tarih ve ölçüler',
      md: `- Lateral oluğa **Sylvius yarığı**, merkezî oluğa **Rolando oluğu** da denir (Dafny, 2020). Yarık Sylvius’un adını taşısa da onu ilk kez gösteren, Sylvius’un tanımından 40 yıl önce, 1600’de renkli çizimlerinde resmeden Fabrici d’Acquapendente’dir (Collice ve ark., 2008). Rolando oluğu, hareket ve duyu kabuğunu ayıran oluğu inceleyen İtalyan anatomist Luigi Rolando’nun (1773–1831) adını taşır (Caputi ve ark., 1995).
- Erkek beyninde iki yarımkürenin kabuk yüzeyi yaklaşık **1640 cm²**’dir; bunun üçte ikisi oluklarda ve insulada gizlidir. Beyincik kabuğu da 550 cm² kadardır ve %86’sı yarıklarda gizlidir (Henery ve Mayhew, 1989).
- Üst temporal girusun lateral oluğun içine uzanan üst yüzünde enine uzanan kıvrımlar vardır: **enine temporal girus (Heschl girusu)**; birincil işitme kabuğu buradadır. Birincil görme kabuğu iç yüzdeki **kalkarin yarığın** iki yanındadır (Dafny, 2020; Dragoi, UTHealth).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Loblar: başlıca alanlar ve hasarın izleri',
      sutunlar: ['Lob', 'Başlıca alanlar (Brodmann numarası)', 'Hasarında görülebilecekler'],
      satirlar: [
        [
          'Frontal',
          'Birincil hareket kabuğu (4; presantral girus); premotor kabuk ve ek motor alan (6); Broca alanı (44, 45; sol alt frontal girus); prefrontal kabuk',
          'Karşı yanda güçsüzlük; sol alt frontal hasarda kısa ve zorlanarak kurulan cümlelerle akıcı olmayan konuşma (Broca afazisi); yargı, soyut düşünme ve çalışma belleğinde güçlük, kişilik değişikliği',
        ],
        [
          'Parietal',
          'Birincil bedensel duyu kabuğu (3, 1, 2; postsentral girus)',
          'Karşı yanda his kaybı; özellikle sağ yarımküre hasarından sonra bedenin ve uzayın sol yarısını görmezden gelme (yarı-uzay ihmali)',
        ],
        [
          'Temporal',
          'Birincil işitme kabuğu (41, 42; Heschl girusu); Wernicke alanı (22’nin arka bölümü, solda); iç yüzde bellekle ilgili yapılar',
          'Sol hasarda akıcı ama anlamı az konuşma, uydurma sözcükler ve anlamada güçlük (Wernicke afazisi); bellek sorunları',
        ],
        [
          'Oksipital',
          'Birincil görme kabuğu (17; kalkarin yarık çevresi, çizgili kabuk); görme çağrışım alanları (18, 19)',
          'Karşı görme alanında, iki gözde aynı yanı kapsayan yarım görme kaybı (homonim hemianopi); görme alanının merkezi çoğu zaman korunur',
        ],
      ],
      not: 'Kaynaklar: OpenStax 13.2 ve 16.2; Wright (UTHealth, dil); Dragoi (UTHealth, görme); Shah ve ark. (2015); NIDCD (2025); Li ve Malhotra (2015). Afazide sol yarımkürenin etkilenmesi çoğu kişi için geçerlidir; dilin solda yerleşmesi nüfusun yaklaşık %95–96’sında görülür.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Birincil alanlar ve dil bölgeleri',
      aciklama:
        'Kırmızı: birincil hareket kabuğunu taşıyan presantral girus. Mavi: birincil bedensel duyu kabuğunu taşıyan postsentral girus. Sarı: Broca alanının bulunduğu alt frontal girus. Yeşil: işitme kabuğuna komşu ve arka ucunda Wernicke alanını barındıran üst temporal girus. Pembe: görme kabuğunu taşıyan oksipital lob. Modelde girusların tamamı boyanmıştır; işlev alanlarının sınırları girus sınırlarıyla birebir örtüşmez.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'lob',
        bakis: 'sol',
        vurgula: ['presantral-girus-sol', 'postsentral-girus-sol', 'alt-frontal-girus-sol', 'ust-temporal-girus-sol', 'oksipital-lob-sol'],
        boya: [
          { secici: ['presantral-girus'], renk: '#e5484d' },
          { secici: ['postsentral-girus'], renk: '#4f8de0' },
          { secici: ['alt-frontal-girus'], renk: '#f2b544' },
          { secici: ['ust-temporal-girus'], renk: '#25b98f' },
          { secici: ['oksipital-lob'], renk: '#ee6a92' },
        ],
        etiketler: [
          { yapi: 'presantral-girus-sol', metin: 'Hareket kabuğu (4)' },
          { yapi: 'postsentral-girus-sol', metin: 'Duyu kabuğu (3, 1, 2)' },
          { yapi: 'alt-frontal-girus-sol', metin: 'Broca (44, 45)' },
          { yapi: 'ust-temporal-girus-sol', metin: 'Wernicke (22)' },
          { yapi: 'oksipital-lob-sol', metin: 'Görme (17, 18, 19)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      duzey: 'ileri',
      baslik: 'MR’da merkezî oluğu bulmak',
      md: `Bir tümörün hareket kabuğuna ne kadar yakın olduğunu söylemek için önce merkezî oluk bulunmalıdır. Başlıca işaretler:

- **El düğmesi:** Presantral girusun eli yöneten bölümü, aksiyel kesitte omega (Ω) ya da epsilon biçiminde, sagital kesitte kanca biçiminde bir düğme yapar; merkezî oluğun "orta dizi"ni oluşturur ve presantral oluk ile merkezî oluğun kesiştiği yerin hemen yanındadır (Yousry ve ark., 1997).
- **Üst frontal oluk – presantral oluk birleşimi:** Üst frontal oluk arkaya doğru presantral oluğa açılır ("T" işareti); hemen arkasındaki girus presantral girustur (Kiss-Bodolay ve ark., 2024).
- **Ayraç işareti:** Singulat oluğun marjinal dalları yarımküreler arası yarıktan çıkarak öne doğru içbükey bir ayraç biçimi oluşturur (Kiss-Bodolay ve ark., 2024).

Hiçbir işaret her beyinde görülmez: yüzey MR’larıyla yapılan bir çalışmada en seyrek görülen işaret Ω biçimli el düğmesiydi (%54,5) (Wagner ve ark., 2013). Hastalıklı yarımkürelerde ayraç işareti en kolay tanınanıydı (%70 sıklık, %95 kolaylık) (Kiss-Bodolay ve ark., 2024). Gliomlarla ilgili bir çalışmaya göre en güvenilir işaretler el düğmesi ve singulat oluğun marjinal dalıdır (Shah ve ark., 2015). Bu yüzden radyolog ve cerrah birden çok işareti birlikte kullanır.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Konuşan hasta, haritalanan beyin: uyanık kraniyotomi',
      md: `Dil ya da hareket alanlarına yakın gliomlar ve epilepsi odakları, hasta ameliyat sırasında uyandırılarak çıkarılabilir: **uyanık kraniyotomi** (Kanno ve Mikuni, 2015). Cerrah kabuğu ve altındaki beyaz cevher yollarını küçük elektrik akımlarıyla uyararak işlev haritası çıkarır (**doğrudan elektrik uyarımı**); bu sırada hasta sayı sayma, resimdeki nesneyi adlandırma ve duyduğunu anlama gibi görevler yapar (Kanno ve Mikuni, 2015). Yaygın ayarlar 50–60 Hz frekans ve 1–10 mA akımdır (Mamadaliev ve ark., 2024). Uyanık kraniyotomi, ameliyat sırasında dilin korunduğunu doğrulamanın kabul görmüş tek yoludur (Kanno ve Mikuni, 2015).

Yöntemin tarihi eskidir: Sir Victor Horsley 1886’da kabuğu elektrikle uyararak uyanık kraniyotomi yaptı (Kanno ve Mikuni, 2015). Ünlü "homunkulus", yani hareket ve duyu kabuğundaki beden haritası, ilk kez 1 Aralık 1937’de Wilder Penfield ve Edwin Boldrey’in *Brain* dergisindeki makalesinde yayımlandı; veriler 1928–1936 arasında yerel anestezi altında ameliyat edilen 126 hastadan geliyordu (Catani, 2017). İlginç bir ayrıntı: hareket yanıtı veren uyarımların bir bölümü postsentral girustaydı; iki alan işlevce birbirine karışır (Catani, 2017).

8091 hastayı kapsayan bir meta-analizde, ameliyat sırasında uyarımla haritalama yapılan glioma ameliyatlarında geç dönemde ağır nörolojik kayıp %3,4, yapılmayanlarda %8,2 bulundu; tümörün tamamının çıkarılma oranı da haritalamayla daha yüksekti (%75’e karşı %58) (De Witt Hamer ve ark., 2012). Ek motor alanın hasarından sonra görülen tablo ise hareket kabuğu hasarından farklı olarak geçicidir (Shah ve ark., 2015).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Brodmann’dan 180 alana: kabuk haritaları',
      md: `Korbinian Brodmann 1909’da kabuğu, hücrelerin katman düzenine (sitoarkitektoni) göre alanlara ayırdı. Kaç alan olduğu kaynaktan kaynağa değişir: ders kitapları 52 bölgeden söz eder (OpenStax 13.2); Brodmann’ın insan haritasını inceleyen Zilles ve Amunts (2010) bu haritada 43 alan sayar. Brodmann’ın numaraları bugün de kullanılır: birincil duyu alanlarında (3 ve 17) IV. katman geniştir, birincil hareket alanında (4) ise açıkça görülen bir IV. katman yoktur ve dev Betz hücreleri yalnızca bu alanda bulunur (Zilles, 2018).

Glasser ve arkadaşları (2016), İnsan Bağlantı Haritası Projesi’nin (Human Connectome Project) çok kipli MR görüntülerinde kabuğun yapısının, işlevinin, bağlantılarının ve yerleşiminin keskin biçimde değiştiği sınırları izleyerek, 210 sağlıklı genç yetişkinin ortalamasında her yarımkürede **180 alan** ayırdı. Bunların **97’si yeni**, 83’ü daha önce ölüm sonrası mikroskopiyle ya da başka yöntemlerle tanımlanmış alanlardı. Her alanın çok kipli "parmak izini" tanımayı öğrenen bir sınıflandırıcı, yeni kişilerde alanların %96,6’sını buldu ve alışılmadık haritası olan kişilerde de alanların yerini doğru gösterdi. Brodmann tek bir ölçüte, hücre dizilimine dayanıyordu; yeni haritalar birden çok ölçütü birlikte kullanır ve kişiden kişiye farkları da görebilir.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Uzunlamasına yarık** iki yarımküreyi, **lateral oluk (Sylvius)** temporal lobu frontal ve parietal loblardan, **merkezî oluk (Rolando)** frontal lobu parietal lobdan, **parieto-oksipital oluk** (iç yüzde) parietal lobu oksipital lobdan ayırır.
- Presantral girus = birincil hareket kabuğu (4); postsentral girus = birincil bedensel duyu kabuğu (3, 1, 2).
- Broca 44–45 (sol alt frontal girus), Wernicke 22’nin arka bölümü; işitme 41–42 (Heschl), görme 17 (kalkarin).
- İnsula lateral oluğun derinindedir; frontal, parietal ve temporal lobların kapakçıkları (operkulum) onu örter.`,
    },
  ],
};
