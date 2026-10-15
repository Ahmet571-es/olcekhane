import type { DersBolumu } from '../../../types';

/**
 * 01. bölüm: dersin kapısı. Üç zarın sırası ve görevleri, boşluklar (hangileri gerçekten var), beynin korunması,
 * adların anlamı, omurilikteki devamı ve dersin haritası; lisans düzeyinde TA2 adları, sınıflama, boşluk tablosu,
 * Gray 1918 ile bugünkü görüş; uzman düzeyinde iki bölme (sert zar ve ince zarlar), doku hazırlığının tuzakları ve
 * interdural düzleme kısa bir gönderme (tam anlatımı 8. bölümde). Bilgiler S2 kaynak notlarından (A, B, C, D).
 */
export const zarlaraIlkBakis: DersBolumu = {
  id: 'zarlara-ilk-bakis',
  baslik: 'Üç zar, iki gerçek boşluk',
  bloklar: [
    // ——— Giriş ———
    {
      tur: 'metin',
      md: `İlk derste beyni saran zarları kısaca tanıdık. Bu derste onları yakından inceleyeceğiz. Önce bütün sistemi bir kez baştan sona görelim.

Beyin ve omurilik üç zarla sarılıdır. Dıştan içe sıraları şöyledir: **sert zar** (*dura mater*), **örümcek ağı zar** (*arachnoidea mater*; kısaca araknoid) ve **yumuşak zar** (*pia mater*) (Gray, 1918). Bu zarlar bağ dokusundan yapılmıştır. Üçünün ortak adı **beyin zarlarıdır** (*meninges*) (OpenStax 13.3).

Zarlar, kafatası ile beyin arasındaki ince alanı doldurur. Kafatası ve omurgayla birlikte beyni darbelere, mikroplara ve başka yaralanmalara karşı korur (Joost ve ark., 2026). Zarlar eskiden yalnızca bir örtü sanılırdı. Bugün beynin gelişimi ve dengesi için gerekli bir sınır olarak görülüyor (Derk ve ark., 2021).`,
    },
    {
      tur: 'animasyon',
      ad: 'zar-katmanlari',
      baslik: 'Kemikten kabuğa: zarlar ve boşluklar',
      aciklama:
        'Kemikten beyin kabuğuna zarlar ve boşluklar: sert zarın katları, sinüs ve granülasyon, gerçek ve normalde olmayan boşluklar, kanın hangi katta biriktiği.',
    },

    // ——— Üç zar ———
    {
      tur: 'metin',
      md: `**Sert zar** en dıştaki zardır. Kalın, yoğun ve esnemeyen bir zardır (Gray, 1918). Bütün beyni ve omuriliği güçlü bir kılıf gibi sarar ve kafatasının iç yüzüne tutunur (OpenStax 13.3). Kafatasında iki iş görür: kemiklerin iç kemik zarı olur ve beyni korur (Gray, 1918).

Sert zar düz bir torba değildir. İçeri doğru dört kıvrım yapar (Gray, 1918). Bu kıvrımlar kafatasının içini birbirine açılan bölmelere ayırır (Gray, 1918). En büyüğü **beyin orağıdır** (*falx cerebri*) (Ishikawa ve ark., 2026). İki beyin yarımküresinin arasındaki yarığa iner (Gray, 1918). İkinci büyüğü **beyincik çadırıdır** (*tentorium cerebelli*) (Ishikawa ve ark., 2026). Beyinciğin üstünü örter ve büyük beynin arka loblarını taşır (Gray, 1918).

Sert zarın iki ana katı vardır: kemiğe bakan dış kat ve beyne bakan iç kat. İki kat çoğu yerde birbirine kaynaşıktır. Bazı yerlerde ayrılırlar ve aralarında toplardamar kanalları kalır (Mahendru ve Chong, 2009). Bu kanallara **sert zar sinüsleri** ya da **toplardamar sinüsleri** denir (*sinus venosi durales*) (FIPAT, 2019). Onları burun çevresindeki hava boşluklarıyla, yani burun sinüsleriyle karıştırma.`,
    },
    {
      tur: 'metin',
      md: `**Örümcek ağı zar** ortadaki zardır. İnce, saydam ve damarsızdır (Joost ve ark., 2026). Dış yüzü sert zarın iç yüzüne yapışıktır (Joost ve ark., 2026). Beynin çevresinde kapalı bir kese gibi durur (OpenStax 13.3).

Bu zar beynin oluklarına girmez. Bir kıvrımdan ötekine köprü kurarak geçer (Mahendru ve Chong, 2009). Tek istisnası iki yarımküreyi ayıran büyük boylamsal yarıktır. Zar bu yarığa iner (Gray, 1918; Zedde ve Pascarella, 2025a).

Zarın altında ince ipliklerden bir ağ vardır. Bu ağ örümcek ağına benzer; zar da adını buradan alır (OpenStax 13.3). İpliklere **araknoid trabeküller** denir. Trabeküller örümcek ağı zarı yumuşak zara bağlar (Joost ve ark., 2026). Örümcek ağı zarın dış katı bir **engel** gibi de çalışır. Damarlı sert zar ile sıvı dolu iç boşluk arasında maddelerin geçişini sınırlar (Joost ve ark., 2026).`,
    },
    {
      tur: 'metin',
      md: `**Yumuşak zar** en içteki zardır. İncecik bir zardır ve beyin dokusuna sıkıca tutunur (Joost ve ark., 2026). Beynin her kıvrımını izler ve her oluğun içine kadar iner (OpenStax 13.3). Beyne giren damarları da en küçük dallarına kadar izler (Villanueva ve ark., 2023).

Örümcek ağı zar ile yumuşak zar ince oldukları için birlikte anılır. İkisine birden **ince zarlar** (*leptomeninges*) denir. Sert zarın öteki adı ise **kalın zardır** (*pachymeninx*) (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'sahne',
      baslik: 'Zarların sardığı beyin',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Beyin kabuğu yarı saydam. Turuncu: beyincik çadırı, sert zarın bir kıvrımı. Turkuaz: karıncıklar; içleri beyin-omurilik sıvısıyla doludur. Beyincik ve beyin sapı gerçeğe yakın renkte. Modelde zarlardan yalnızca beyincik çadırı vardır. Öteki zarlar bütün bu yüzeyi ince bir örtü gibi sarar. Bakış düğmesiyle çadıra başka yönlerden de bak.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'karincik', 'zar'],
        renk: 'dogal',
        saydam: ['katman:kabuk'],
        gizle: ['bolge:sinir'],
        boya: [
          { secici: ['beyincik-cadiri'], renk: '#f08c3a' },
          { secici: ['katman:karincik'], renk: '#25b9a3' },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı (sert zarın kıvrımı)' },
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık: içi BOS dolu' },
          { yapi: 'beyincik', metin: 'Beyincik: çadırın altında' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı: zarlar omuriliğe devam eder' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Boşluklar ———
    {
      tur: 'metin',
      md: `Zarlarla ilgili üç boşluk adı duyarsın: epidural, subdural ve subaraknoid. Ama sağlıklı bir insanın kafasında bunlardan yalnızca biri gerçekten açıktır.

- **Epidural boşluk** (sert zarın üstü). Kafatasının içinde normalde yoktur. Çünkü sert zar kemiğe yapışıktır (FIPAT, 2019). Omurga kanalında ise gerçek bir boşluktur. Sert zar orada omurların kemik zarından ayrılır ve arada yağla dolu bir boşluk kalır (Joost ve ark., 2026).
- **Subdural boşluk** (sert zarın altı). Normalde yoktur. Örümcek ağı zar sert zara yapışıktır (FIPAT, 2019). Bir yaralanma ya da hastalık iki zarı ayırırsa burada bir yarık açılır (FIPAT, 2019).
- **Subaraknoid boşluk** (örümcek ağı zarın altı). Gerçek bir boşluktur. Örümcek ağı zar ile yumuşak zarın arasındadır. İçi **beyin-omurilik sıvısıyla** (BOS) doludur (Gray, 1918).

Beynin tabanında subaraknoid boşluk yer yer genişler. Bu geniş yerlere **sisterna** denir. Sisternalar birbirine açılır (Gray, 1918). İçlerindeki BOS bir depo gibi de iş görür (Villanueva ve ark., 2023).

Kısacası bu üç addan yalnızca ikisi sağlıklı insanda gerçek bir boşluktur. Biri beyni ve omuriliği saran subaraknoid boşluktur. Öteki yalnızca omurga kanalında bulunan epidural boşluktur.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Kitaplardaki “subdural boşluk”',
      md: 'İlk derste kısaca değinmiştik. Birçok çizimde sert zar ile örümcek ağı zar arasında ince bir “subdural boşluk” görürsün. Güncel anatomiye göre sağlıklı insanda böyle bir boşluk yoktur. Bu boşluk yalnızca hastalıkta oluşur (Joost ve ark., 2026). Bir darbe ya da kanama, sert zarın en iç hücre katını yararak bir yarık açar (Ishikawa ve ark., 2026). Klinikte “subdural” denen yer bu yarıktır.',
    },

    // ——— Koruma ———
    {
      tur: 'metin',
      md: `**Zarlar beyni nasıl korur?** Birkaç yoldan:

- **Sağlam bir kılıf.** Sert zar kalın ve güçlüdür. Bütün beyni sarar (OpenStax 13.3).
- **Bölmeler.** Sert zarın kıvrımları kafatasının içini bölmelere ayırır. Baş birden hızlandığında beynin fazla oynamasını azaltır (Ishikawa ve ark., 2026).
- **Sıvı bir yastık.** Subaraknoid boşluktaki BOS, beyne ve omuriliğe sıvı bir yastık olur (OpenStax 13.3). Baş hareket ettiğinde ya da darbe aldığında beynin biçimini ve yerini korur (Saboori ve Sadegh, 2015).
- **Asma ipleri.** Beyin, BOS dolu boşlukta trabeküllerle asılı durur (Mortazavi ve ark., 2018). Trabeküller, darbede beynin kafatasına göre kaymasını yumuşatır (Saboori ve Sadegh, 2015).
- **Kimyasal bir sınır.** Örümcek ağı zarın dış katı, sert zarın kanından gelen maddelerin BOS’a geçişini sınırlar (Joost ve ark., 2026; Brøchner ve ark., 2015).

Zarlar beyni ve omuriliği kafatası ile omurgaya bağlar. Böylece onları yerinde de tutar (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Arakne’nin ağı',
      md: '“Araknoid” sözcüğü Yunanca *arachne*, yani “örümcek” sözcüğünden gelir (Zedde ve Pascarella, 2025a). Ad, Ovidius’un *Dönüşümler* adlı yapıtındaki bir efsaneyi de hatırlatır. Usta dokumacı Arakne, tanrıça Athena ile yarışır. Athena sonunda onu sonsuza dek ağ örmeye mahkûm bir örümceğe dönüştürür (Woo ve ark., 2022). Zarın altındaki ince iplik ağı da gerçekten bir örümcek ağını andırır (OpenStax 13.3).',
    },

    // ——— Adlar ———
    {
      tur: 'metin',
      md: `**Adlar ne anlatır?** Beyin zarlarının Latince adlarının çoğunda *mater*, yani “ana” sözcüğü geçer (Ghannam ve Al Kharazi, 2023). *Dura* “sert” demektir. *Dura mater* ise “sert ana”dır (Ishikawa ve ark., 2026). Bir ders kitabı *pia mater*’i “narin ana” diye çevirir; zar beyni nazikçe örter (OpenStax 13.3). Zarların hepsine birden verilen Yunanca ad *meninx*’tir (Ishikawa ve ark., 2026).

Peki zara neden “ana” denir? Bu adlar Arapça çevirilerden gelir. Öyküsünü “Zarların gelişimi ve keşif tarihi” bölümünde anlatıyoruz.

Türk Dil Kurumu sözlüğünde bu üç zarın adı sert zar, örümceksi zar ve ince zardır (TDK, 2026). Bu derste ortadaki zara **örümcek ağı zar**, içtekine **yumuşak zar** diyoruz.`,
    },

    // ——— Omurilikte ———
    {
      tur: 'metin',
      md: `**Omurilikte de aynı üç zar.** Gray’e göre beyin ve omurilik aynı üç zarla sarılıdır (Gray, 1918). Omurilik zarları, kafatasının büyük deliğinde (*foramen magnum*) beyin zarlarıyla birleşir (Byrne ve Dafny, 2026).

Sert zar ile örümcek ağı zar, sağrı kemiğinin ikinci omuru (S2) hizasına kadar iner. Omurilik ise daha yukarıda, üst bel omurları hizasında biter. Bu yüzden ikinci bel omurunun altında geniş bir sıvı deposu kalır: **bel sisternası** (Byrne ve Dafny, 2026). Hekim BOS örneğini buradan alır. İğne sert zarı ve örümcek ağı zarı geçerek sıvıya ulaşır (OpenStax 13.3). Bu işleme **bel delme** (lomber ponksiyon) denir.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Sıra (dıştan içe):** kafatası → sert zar → örümcek ağı zar → subaraknoid boşluk (BOS) → yumuşak zar → beyin.

**Üç addan iki gerçek boşluk:** subaraknoid boşluk (beynin ve omuriliğin çevresinde) ve epidural boşluk (yalnızca omurga kanalında).

**Normalde olmayanlar:** kafa içindeki epidural boşluk ve subdural boşluk. Bunlar ancak kanama ya da yaralanmayla açılır.

**Adlar:** sert zar = kalın zar (*pachymeninx*). Örümcek ağı zar + yumuşak zar = ince zarlar (*leptomeninges*).`,
    },
    {
      tur: 'tablo',
      baslik: 'Dersin haritası: sonraki bölümler',
      sutunlar: ['Bölüm', 'Ne öğreneceksin?'],
      satirlar: [
        ['Sert zar: yapısı', 'Sert zarın katları, lifleri, kalınlığı ve kemiğe nasıl yapıştığı'],
        [
          'Sert zarın kıvrımları ve bölmeleri',
          'Beyin orağı, beyincik çadırı, beyincik orağı, hipofiz çadırı ve kafatası içindeki bölmeler',
        ],
        ['Sert zarın toplardamar sinüsleri', 'Beynin kanını toplayan kanallar ve beyinden onlara uzanan köprü toplardamarları'],
        ['Sert zarın atardamarları, sinirleri ve ağrı', 'Sert zarı besleyen damarlar, sinirleri ve baş ağrısıyla bağı'],
        ['Örümcek ağı zar', 'Katları, engel görevi, trabeküller ve araknoid granülasyonlar'],
        ['Yumuşak zar ve damar çevresi boşluklar', 'Beyin yüzeyiyle sınırı, damarları saran boşluklar ve koroid pleksus'],
        ['Zarlar arası boşluklar ve sisternalar', 'Boşlukların ayrıntısı, sisternalar ve bel sisternası'],
        [
          'Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar',
          'Zarlardaki lenf damarları, bağışıklık hücreleri ve süren tartışmalar',
        ],
        ['Zarların gelişimi ve keşif tarihi', 'Zarların anne karnında oluşumu ve adlarının öyküsü'],
        ['Kanamalar ve fıtıklaşmalar', 'Zarlarla ilgili kanamalar ve beynin bölmeler arasında kayması'],
        ['Zar iltihapları, tümörler ve basınç bozuklukları', 'Menenjit, menenjiyom, düşük kafa içi basıncı ve araknoid kist'],
        ['Zarları görüntülemek ve ameliyatta zarlar', 'BT ve MR’da zarlar; ameliyatta sert zarın açılıp kapatılması'],
      ],
      not: 'Bölüm adları, dersin içindekiler listesindeki adlardır.',
    },

    // ——— Lisans: adlar ve sınıflama ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Resmî adlar.** Uluslararası anatomi terimleri listesinin bugünkü baskısına TA2 denir. TA2’de beyin zarları (*meninges*) merkezî sinir sisteminin bir parçası sayılır. İki dala ayrılır: sert zar (*dura*) ve ince zarlar (*leptomeninges*) (FIPAT, 2019).

TA2 birincil adları kısa tutar. Sert zara *dura*, örümcek ağı zara *arachnoidea*, yumuşak zara *pia* der. Bildiğimiz *dura mater*, *arachnoidea mater* ve *pia mater* biçimleri eş anlamlı olarak listelenir (FIPAT, 2019). Kafa ve omurilik bölümleri de ayrı adlandırılır: *dura cranialis* ve *dura spinalis* gibi (FIPAT, 2019). Gray (1918) kafa içi sert zara *dura mater encephali* der. TA2 bu eski adı yalnızca ilişkili terim olarak tutar (FIPAT, 2019).

**İki bölme.** Sert zarın “kalın zar” anlamındaki adı *pachymeninx*’tir (Zedde ve Pascarella, 2025a). Bu adı ilk kez Galenos kullandı (Ishikawa ve ark., 2026). Örümcek ağı zar ile yumuşak zar ise “ince” anlamında *leptomeninx* adını alır (Zedde ve Pascarella, 2025a). Bu ayrım yalnızca kalınlıkla ilgili değildir. İki bölmenin damarları, bağ dokusu hücreleri ve bağışıklık hücreleri de farklıdır (Derk ve ark., 2021).

**Boşluğun adı.** TA2’nin resmî bir notuna göre subaraknoid boşluk içten yumuşak zarın dış katıyla sınırlanır. Bu yüzden en doğru ad “ince zarlar boşluğu” (*spatium leptomeningeum*) olurdu (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zarların ve boşlukların resmî adları',
      sutunlar: ['Türkçe ad', 'TA2’deki Latince ad', 'TA2 kimliği', 'Eş anlamlı ya da ilişkili ad'],
      satirlar: [
        ['Beyin zarları', '*meninges*', '5369', '—'],
        ['Sert zar', '*dura*', '5370', '*dura mater*, *pachymeninx*'],
        ['Kafa içi sert zar', '*dura cranialis*', '5371', '*dura mater cranialis*; ilişkili: *dura mater encephali*'],
        ['Sert zarın kemiğe bakan katı', '*pars periostea durae cranialis*', '5372', '*endocranium*'],
        ['Sert zarın beyne bakan katı', '*pars meningea durae cranialis*', '5373', '—'],
        ['Omurilik sert zarı', '*dura spinalis*', '5382', '*dura mater spinalis*'],
        ['İnce zarlar', '*leptomeninges*', '5385', '—'],
        ['Örümcek ağı zar', '*arachnoidea*', '5386', '*arachnoidea mater*'],
        ['Yumuşak zar', '*pia*', '5405', '*pia mater*'],
        ['Subaraknoid boşluk', '*spatium subarachnoidale*', '5387', '*spatium leptomeningeum*'],
        ['Subdural boşluk', '*spatium subdurale*', '5380', '“Her zaman bulunmayan” (*inconstant*) diye işaretli'],
        ['Kafa içi epidural boşluk', '*spatium epidurale craniale*', '5381', '*spatium extradurale*; “her zaman bulunmayan” diye işaretli'],
        ['Omurilik epidural boşluğu', '*spatium epidurale spinale*', '5383', '*spatium peridurale*'],
        ['Sert zar sinüsleri', '*sinus venosi durales*', '4846', '*sinus durae matris*'],
      ],
      not: 'Kaynak: FIPAT (2019). TA2, sert zarın en iç hücre katı olan sınır hücre katmanı için ayrı bir terim vermez. Kimlik numaraları TA2’nin çevrim içi listesindeki numaralardır.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Boşluklar: gerçek mi, yapay mı?',
      sutunlar: ['Aralık', 'Sağlıklı insanda', 'Ne vardır, ne olur?', 'Gray (1918) ne der?'],
      satirlar: [
        [
          'Kafa içi epidural boşluk (kemik ile sert zar arası)',
          'Yok. Sert zar kemiğe yapışıktır',
          'Travma ya da hastalık sert zarı kemikten ayırınca açılır. Epidural kanama burada toplanır',
          'Sert zarın dış yüzü pürüzlüdür ve kemiğin iç yüzüne sıkıca yapışır',
        ],
        [
          'Sert zarın iki katı arası',
          'Katlar çoğu yerde kaynaşıktır',
          'Ayrıldıkları yerlerde toplardamar sinüsleri uzanır',
          'İki kat sıkıca birleşiktir; yalnızca bazı yerlerde ayrılır',
        ],
        [
          'Subdural boşluk (sert zar ile örümcek ağı zar arası)',
          'Yok. Örümcek ağı zar sert zara yapışıktır',
          'Sert zarın sınır hücre katmanı yarılınca bir yarık açılır. “Subdural” kanama çoğu zaman bu katmanın içindedir',
          'Omurilikte “olası bir boşluk” vardır. Bu boşluk BOS yollarının parçasıdır ve seröz bir boşluğa benzer',
        ],
        [
          'Subaraknoid boşluk (örümcek ağı zar ile yumuşak zar arası)',
          'Var',
          'BOS, trabeküller, atardamarlar ve toplardamarlar. Kılcal damar yoktur',
          'Süngerimsi bir doku ve birbirine açılan sıvı kanallarıyla doludur',
        ],
        [
          'Sisternalar',
          'Var; subaraknoid boşluğun parçasıdır',
          'Beynin tabanındaki geniş aralıklar. Yerlerine göre adlandırılır, ama keskin sınırları yoktur',
          'Tabanda örümcek ağı zar, yumuşak zardan geniş aralıklarla ayrılır',
        ],
        [
          'Pia altı boşluk (yumuşak zar ile beyin dokusu arası)',
          'Var; yumuşak zar ile beyin yüzeyindeki sınır katının (glia limitans) bazal zarı arasında',
          'Kolajen demetleri, fibroblasta benzeyen hücreler ve damarlar',
          '—',
        ],
        [
          'Damar çevresi boşluk',
          'Var',
          'Beyne giren ve çıkan damarları saran sıvı dolu aralık. Subaraknoid boşlukla bağlantısı tartışmalıdır',
          'Yumuşak zar bu boşluğa bir astar olarak girer; bir süre sonra bu hücreler seçilemez',
        ],
        [
          'Omurilik epidural boşluğu',
          'Var',
          'Yağ ve toplardamar ağı. Sinir kökleri bu boşluğu geçer',
          'Gevşek bağ dokusu ve toplardamar ağı içerir',
        ],
      ],
      not: 'Kaynaklar: FIPAT (2019), resmî TA2 notu 770; Khairat ve ark. (2025); Mahendru ve Chong (2009); Haines (1991); Ishikawa ve ark. (2026); Joost ve ark. (2026); Byrne ve Dafny (2026); Gray (1918). Bazı ders kitapları hâlâ eski anlatımı verir: kafatası ile sert zar arası epidural boşluk, sert zar ile örümcek ağı zar arası subdural boşluktur (Dafny, 2020). Haines’e göre subdural boşluk “olası” bir boşluk bile değildir. Çünkü bu bölgede yarık ancak doku hasarıyla açılır (Haines, 1991).',
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Sayılarla katmanlar: kalından inceye',
      ogeler: [
        { deger: '0,33–0,56', birim: 'mm', aciklama: 'Sert zarın ortalama kalınlığı (Ishikawa ve ark., 2026).' },
        {
          deger: '< 10',
          birim: 'µm',
          aciklama: 'Sert zarın en iç katı, sınır hücre katmanı. 3–8 sıra yassı hücreden oluşur (Ishikawa ve ark., 2026).',
        },
        {
          deger: '1–3',
          birim: 'hücre katı',
          aciklama: 'Örümcek ağı zarın dıştaki engel katmanı. Hücreleri sıkı bağlantılarla kenetlidir (Brøchner ve ark., 2015).',
        },
        {
          deger: '20–40',
          birim: 'µm',
          aciklama: 'Yetişkin beyin kabuğunda glia limitans: beyin dokusunun yumuşak zara bakan sınır katı (Brøchner ve ark., 2015).',
        },
      ],
      not: 'Bir mikrometre (µm) milimetrenin binde biridir. Sert zarın kalınlığı ölçüm yerine ve yöntemine göre değişir; ayrıntısı “Sert zar: yapısı” bölümünde.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Ağırlığı kim taşır?** Beyincik çadırı, üstünde duran büyük beynin yükünü yanlara, kafatası duvarına aktarır (Rai ve ark., 2018). Beyin orağı ve çadır gergin yapılardır. Beynin hareketini sınırlar ve orta hat boyunca biçim değişikliğini azaltır (Rai ve ark., 2018). Yükün sayılarla hesabı “Sert zarın kıvrımları ve bölmeleri” bölümünde.

**Trabeküller.** Trabeküller, örümcek ağı zar ile yumuşak zar arasında gerilen ve kolajenle güçlenmiş sütunlardır (Mortazavi ve ark., 2018). Yedi kadavra beyninde, trabeküllerin boşluktaki hacim payı beyin başına ortalama %22,0 ile %29,2 arasında bulundu. Bu pay beynin üst yüzüne yakın yerlerde %12 daha fazlaydı (Benko ve ark., 2020).

**Damarlar nerede?** Beyin yüzeyindeki damarlar yumuşak zarın üstünde, subaraknoid boşlukta uzanır (Dafny, 2020). Bu boşlukta çeşitli kalınlıkta atardamar ve toplardamar vardır, ama kılcal damar yoktur (Joost ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Zar anatomisi klinikte nerede karşına çıkar?',
      md: `- **Kanamalar.** Kafa içi kanamaların adı, kanın toplandığı katmandan gelir. Epidural kanama, sert zarın dış yaprağı ile kafatasının iç yüzü arasındaki normalde kapalı aralıkta birikir (Khairat ve ark., 2025). Subdural kanama sert zar ile örümcek ağı zar arasındaki düzlemde toplanır (Pierre ve ark., 2026). Haines’e göre bu kanama çoğu zaman sert zarın sınır hücre katmanının içindedir (Haines, 1991). Subaraknoid kanama ise örümcek ağı zar ile yumuşak zar arasındaki boşluktadır (Ziu ve ark., 2023). Ayrıntılar “Kanamalar ve fıtıklaşmalar” bölümünde.
- **Menenjit.** Beyni ve omuriliği saran zarların iltihabıdır (OpenStax 13.3). Bakteriler subaraknoid boşluğa ulaşınca ince zarların yüzeyinde hızla çoğalır ve yayılır (Joost ve ark., 2026).
- **Menenjiyom.** Beyin ya da omurilik zarlarından gelişen bir tümördür. Çoğu iyi huyludur (Alruwaili ve Hall, 2026). Menenjit ve menenjiyom “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.
- **Bel delme.** Kafa ve omurilik zarları ile subaraknoid boşlukları büyük delikte süreklidir. Bu yüzden beyin çevresindeki kanama ya da iltihap, belden alınan BOS’ta görülebilir (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Görüntülemede iki bölme',
      md: 'Sert zarda kan-beyin engeli yoktur. Bu yüzden damardan verilen kontrast maddeyle normalde boyanır (Mahendru ve Chong, 2009). Sağlıklı kişide bu boyanma ince ve çoğu zaman kesintilidir (Absinta ve ark., 2017). Yumuşak zar olukları izler. Örümcek ağı zar ise kıvrımdan kıvrıma atlar. Bu fark, ince zar hastalıklarındaki boyanma örüntülerini anlamanın anahtarıdır (Mahendru ve Chong, 2009). BOS dolu boşluk beynin üst yüzünde dardır. Kafa tabanında ise geniş sisternalar yapar (Mahendru ve Chong, 2009). Kalın zar ve ince zar boyanmasının ayrıntısı “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Gray 1918 ve bugünkü görüş',
      sutunlar: ['Konu', 'Gray (1918)', 'Bugünkü görüş'],
      satirlar: [
        [
          'Sert zarın katları',
          'İki kat: kemiğe bakan endosteal kat ve beyne bakan meningeal kat',
          'Üç kat: endosteal kat, meningeal kat ve en içte sınır hücre katmanı. Bu katmanı ilk kez 1975’te Nabeshima ve arkadaşları tanımladı (Ishikawa ve ark., 2026)',
        ],
        [
          'Sert zarın iç yüzü',
          'Seröz zarlardaki gibi yassı mezotelle döşelidir; başka bir yerde “endotel” der',
          'Bu yüz mezotel değildir. Sıkı bağlantısız, fibroblasta benzeyen sınır hücrelerinden oluşur (Ishikawa ve ark., 2026)',
        ],
        [
          'Subdural boşluk',
          'Omurilikte olası bir boşluk; BOS yollarının parçası',
          'Sağlıklı insanda yoktur; yarık ancak hastalıkta açılır (Joost ve ark., 2026; FIPAT, 2019)',
        ],
        [
          'Örümcek ağı zarın damarları',
          'Az sayıda ama büyükçe damar; Bochdalek’e göre zengin bir sinir ağı',
          'Damarsız bir zardır (Joost ve ark., 2026). Bochdalek’in zengin sinir ağı, bu derste okunan güncel kaynaklarda doğrulanmadı. Bir derleme ise zarda ve trabeküllerde sinir uçları bulunduğunu yazar (Zedde ve Pascarella, 2025a)',
        ],
        [
          'Örümcek ağı zarın dış yüzü',
          'Alçak kübik mezotelle örtülüdür',
          'Değişime uğramış fibroblastlardan oluşan, sıkı bağlantılı bir engel katmanıdır (Joost ve ark., 2026)',
        ],
        [
          'Sert zarın dört kıvrımı',
          'Dördü de meningeal katın ikiye katlanmasıdır',
          'Beyin orağı, beyincik çadırı ve beyincik orağı çift katlıdır. Ishikawa ve arkadaşlarına göre hipofiz çadırı tek katlı bir yapraktır (Ishikawa ve ark., 2026). Başka bir derleme onu iki katlı anlatır (Shah ve Mohamed Elsanafiry, 2018)',
        ],
        [
          'Araknoid villuslar',
          'BOS villuslardan sert zar sinüslerine geçer',
          'BOS’un bu yapılardan nasıl geçtiğini açıklayan, genel kabul görmüş bir model yoktur (Joost ve ark., 2026)',
        ],
        [
          'Luschka delikleri',
          'Gerçek açıklık mı, geçirgen bir zar alanı mı, belirsizdir',
          'Dördüncü karıncığı subaraknoid boşluğa bağlayan açıklıklardır (Zedde ve Pascarella, 2025a)',
        ],
      ],
      not: 'Gray (1918) bu dersin en eski kaynağıdır. Onun bilgileri her zaman güncel kaynaklarla karşılaştırılarak kullanılır. BOS’un emilimi “Karıncıklar ve beyin-omurilik sıvısı” dersinde ayrıntılı anlatılacak.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Beyin için belden sıvı',
      oyku: '22 yaşında bir üniversite öğrencisi ateş, şiddetli baş ağrısı ve ense sertliğiyle acil servise geliyor. Hekim menenjitten şüpheleniyor ve BOS incelemesi istiyor. Hasta yan yatırılıyor; iğne belin alt bölümünden giriliyor. Bir stajyer şaşırıyor: “İltihap beynin çevresinde. Neden belden sıvı alıyoruz?”',
      soru: 'Belden alınan sıvı beynin çevresini neden yansıtır? İğne hangi katmanları geçer?',
      cozum: `**Süreklilik.** Kafa ve omurilik zarları ile subaraknoid boşlukları büyük delikte birbirine devam eder. Bu yüzden beyin çevresindeki kanama, enfeksiyon ya da iltihap, belden alınan BOS’ta görülebilir (Byrne ve Dafny, 2026).

**Neden bel?** Sert zar ile örümcek ağı zar S2 hizasına kadar iner. Omurilik ise üst bel omurları hizasında biter. Böylece ikinci bel omurunun altında geniş bir bel sisternası kalır ve iğne buradan güvenle girer (Byrne ve Dafny, 2026). Bu yol, omuriliğin dokusuna zarar verme riskinden kaçınır (OpenStax 13.3).

**Katmanlar.** İğne önce omurilik epidural boşluğunu geçer. Bu boşlukta yağ ve toplardamarlar vardır (Byrne ve Dafny, 2026). Sonra sert zarı ve örümcek ağı zarı geçerek subaraknoid boşluğa girer (OpenStax 13.3). Bu iki zarın arasında ayrı bir boşluk geçilmez. İnsan omurilik zarları üzerine yapılan bir çalışmada iki zar, doğal bir “subdural boşluk” olmadan birbirine sıkıca yapışıktı (Vandenabeele ve ark., 1996).

Tanı ve tedavi kararını hekim verir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Dıştan içe: sert zar (*pachymeninx*) → örümcek ağı zar → yumuşak zar. Son ikisi ince zarlardır (*leptomeninges*).
- TA2’nin birincil adları *dura*, *arachnoidea*, *pia*’dır. “Mater”li biçimler eş anlamlıdır.
- TA2, subdural boşluğu ve kafa içi epidural boşluğu “her zaman bulunmayan” diye işaretler. Omurilik epidural boşluğu gerçektir: yağ ve toplardamar ağı.
- Subaraknoid boşlukta BOS, trabeküller, atardamarlar ve toplardamarlar vardır; kılcal damar yoktur.
- Örümcek ağı zar olukların üstünden köprü kurar (boylamsal yarık hariç). Yumuşak zar her oluğa iner.
- Sert zarda kan-beyin engeli yoktur; damardan verilen kontrastla normalde boyanır.
- Sert zar ve örümcek ağı zar S2’ye kadar iner; omurilik üst bel omurlarında biter → bel sisternası.`,
    },

    // ——— Uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Sınır nerede?** Zarları iki bölme olarak düşünmek, katmanları tek tek saymaktan daha çok şey anlatır. Bir yanda damarlı sert zar, öbür yanda BOS dolu ince zarlar vardır. Aralarındaki sınırı örümcek ağı zarın engel hücre katmanı çizer. Bu katman, sert zarın pencereli damarları ile merkezî sinir sistemi arasında bir sınır kurar (Derk ve ark., 2021).

Sert zar damarları pencerelidir (fenestralı) ve sıkı bağlantı taşımaz. Bu özellik, bağışıklık gözetimi ve BOS boşaltımı görevleriyle uyumludur (Joost ve ark., 2026). Yumuşak zar damarları ise sıkı bağlantılıdır (Derk ve ark., 2021). Ama bu damarların çevresinde astrosit ayakları yoktur (Derk ve ark., 2021). Bu yüzden onları kan-beyin engelinin aynısı saymak yanlıştır. Çünkü subaraknoid boşlukta engeli tamamlayan sinir-damar birimi bulunmaz (Brøchner ve ark., 2015).

Brøchner ve arkadaşları örümcek ağı zarın engelini, kan ile BOS arasındaki üçüncü önemli engel sayar. Öteki ikisi kan-beyin engeli ve koroid pleksus engelidir (Brøchner ve ark., 2015). Bu engeli gösteren boya ve işaretleyici deneyleri “Örümcek ağı zar” bölümünde anlatılıyor. Aşağıdaki tablo iki bölmeyi yan yana koyar.

Joost ve arkadaşlarına göre zarlar edilgen bir örtü değildir. İltihabı, madde temizliğini ve hastalığın seyrini etkileyen etkin bir sinir-bağışıklık organıdır (Joost ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sert zar bölmesi ve ince zar bölmesi',
      sutunlar: ['Özellik', 'Sert zar (kalın zar)', 'İnce zarlar (örümcek ağı zar ve yumuşak zar)'],
      satirlar: [
        [
          'Kan damarları',
          'Pencereli; sıkı bağlantı yok (Joost ve ark., 2026)',
          'Sıkı bağlantılı; çevrelerinde astrosit ayağı yok (Derk ve ark., 2021)',
        ],
        [
          '44 kD işaretleyici (damardan)',
          'Damarlardan geçer (Derk ve ark., 2021)',
          'Yumuşak zar damarlarından geçmez (Derk ve ark., 2021)',
        ],
        ['Kana verilen boya', 'Sert zarı boyar', 'Örümcek ağı zarı boyamaz (Brøchner ve ark., 2015)'],
        [
          'Kılcal damarlar',
          'Sınır katmanının birkaç mikrometre üstünde yoğun bir kılcal yatak (Joost ve ark., 2026)',
          'Subaraknoid boşlukta kılcal damar yok (Joost ve ark., 2026)',
        ],
        [
          'Lenf damarları',
          'Var; başlıca üst sagital ve enine sinüsler boyunca (Joost ve ark., 2026)',
          'Farede beyin dokusunda ve yumuşak zarda görülmedi (Aspelund ve ark., 2015)',
        ],
        [
          'Bağışıklık hücreleri',
          'Makrofaj, mast hücresi, B ve T hücreleri, nötrofil ve merkezî sinir sisteminin en büyük dendritik hücre topluluğu (Derk ve ark., 2021)',
          'Başlıca makrofajlar ve göç etmeyen dendritik hücreler (Derk ve ark., 2021)',
        ],
        [
          'Sınırdaki makrofajlar',
          'Kandan gelen monositlerle sürekli yenilenir (Derk ve ark., 2021)',
          'Uzun ömürlüdür (Derk ve ark., 2021)',
        ],
        [
          'Bağ dokusu hücreleri',
          'Sert zar fibroblastları; en içte sınır hücreleri',
          'Farede beş ayrı fibroblast benzeri hücre tipi. Bunlar yumuşak zar, iç araknoid, dış araknoid engeli ve sert zar sınır katmanıyla eşleştirildi (Pietilä ve ark., 2023)',
        ],
      ],
      not: 'Bulguların bir kısmı fareden gelir. Türler arasında zarların engel özellikleri, damarları ve bağışıklık hücreleri farklıdır; fare bulguları insana dikkatle aktarılmalıdır (Joost ve ark., 2026). Lenf damarları ve bağışıklık hücreleri “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Zarlar neden hâlâ tartışılıyor?',
      md: `Zarlar ince ve narindir. Onları incelemek için doku sabitlenir, kesilir ve boyanır. Her adım yapay bir görüntü yaratabilir:

- **Ölüm sonrası ayrılma.** Ölümden sonra örümcek ağı zar ile sert zar arasındaki bağ bozulur ve katlar ayrılır. Tarihte “subdural boşluk” sanılan yarık bu yapay ayrılmadır (Joost ve ark., 2026).
- **Eski kesitler.** Weed’in 1914’teki kedi kesitlerinde örümcek ağı zar ile sert zar arasında geniş bir “subdural boşluk” görülür. Proulx’a göre bu boşluk doku hazırlığının yarattığı bir yapaydır (Proulx, 2021).
- **Formalin.** Formalinle sabitlenmiş kafalarda örümcek ağı zar perdeleri kısmen erir. Bazı çalışmalardaki “fazladan yaprak” tanımları buradan gelebilir (Volovici ve ark., 2020).
- **Yoğun çözeltiler.** Yoğun (hiperozmotik) sabitleyiciler dokuyu kurutup büzüştürür; narin zarlar yerinden oynayabilir (Plá ve ark., 2023). Kemikten kireci çözmek için %10’luk bir EDTA çözeltisi kullanılır. Bu çözeltideki çözünmüş tanecik yoğunluğu (ozmolarite) 806 mOsm ölçüldü. Bu, yaklaşık 300 mOsm olan normal değerin neredeyse üç katıdır (Neuhuber, 2024).
- **Çöken boşluklar.** Canlı farede atardamar çevresindeki boşluğun kesit alanı, atardamarınkinin yaklaşık 1,4 katıdır. Sabitlemeden sonra bu oran 0,14’e düşer (Mestre ve ark., 2018).

Bu örnekler, aynı yapının farklı yöntemlerle neden farklı tanımlandığını açıklar. Dördüncü bir zar olup olmadığı tartışmasında da bu sorun önemli bir yer tutar. Neuhuber’e göre önerilen zar, yoğun çözeltilerle yerinden ayrılmış iç araknoid katı olabilir (Neuhuber, 2024). Zarı önerenler ise çalışmalarının canlı farede sıvı taşınmasını incelemeye dayandığını vurgular (Plá ve ark., 2024). Ayrıntısı “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Boşluk mu, düzlem mi?',
      md: `- Omurilik sert zarında kemiğe bakan endosteal kat yoktur. Bu yüzden omurilikteki epidural boşluk, kafa içinde iki kat arasındaki “interdural” aralığın karşılığı sayılabilir (Ishikawa ve ark., 2026). Bu eşleşme ve bu aralıkta nadiren biriken kanama “Zarlar arası boşluklar ve sisternalar” bölümünde.
- Kronik “subdural” kanamanın gerçek yeri sert zarın sınır hücre katmanıdır. Bu yüzden bazı yazarlar “sert zar sınır hematomu” adını önerir (De Simone ve ark., 2026). Ayrıntılar “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Otopside açılan aralık',
      oyku: 'Bir patoloji asistanı otopside beyni çıkarıyor. Ölüm ile otopsi arasında uzun bir süre geçmiş. Kafatası açılınca sert zar ile örümcek ağı zar kolayca ayrılıyor ve aralarında belirgin bir aralık görülüyor. Kanama yok. Asistan raporuna “subdural boşluk normal görünümde” yazmak istiyor.',
      soru: 'Bu aralık sağlıklı insanda var olan bir boşluk mudur? Rapora ne yazmak daha doğru olur?',
      cozum: `**Aralık büyük olasılıkla yapaydır.** Canlıda örümcek ağı zar, sert zarın sınır hücre katmanına sıkıca tutunur (Joost ve ark., 2026). Ölümden sonra bu arayüz bozulur ve katlar ayrılır. Tarihte “subdural boşluk” sanılan yarık bu yapay ayrılmadır (Joost ve ark., 2026). Haines de araknoid engel katmanı ile sınır hücre katmanı arasında böyle bir aralığa dair kanıt bulmamıştır (Haines, 1991).

**Resmî terim ne der?** TA2 subdural boşluğu “her zaman bulunmayan” diye işaretler. Notuna göre normalde örümcek ağı zar sert zara yapışıktır ve bu arayüzde doğal bir boşluk yoktur. Boşluk, yaralanma ya da hastalık katları yapay olarak ayırınca oluşur (FIPAT, 2019).

**Rapor.** “Sert zar ile örümcek ağı zar arasında ölüm sonrası ayrılma; kanama yok” gibi betimleyici bir ifade daha doğrudur. Sınır hücre katmanı kırılgandır; küçük kesme kuvvetleri bile onu yarabilir (Ishikawa ve ark., 2026). Bu yüzden ayrılmanın ölüm sonrası değişimle açıklanabileceği raporda belirtilmelidir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
