import type { DersBolumu } from '../../../types';

const DAMAR = '#c62828';

/**
 * 06. bölüm: örümcek ağı zar. Genel yapı ve kalınlık farkları; araknoid engel hücre katmanı (sıkı bağlantılar, taşıyıcılar,
 * insanda dinamik MR); trabeküller; iç araknoid zarlar ve Liliequist zarı (Türkiye’den çalışmalar); araknoid granülasyonlar
 * (yapı, sinüse açılma, yaşla değişim, dev granülasyon ve beyin dokusunun fıtıklaşması); araknoid kistin yapısı. Modelde
 * zarlar yoktur; sahneler zarın köprü kurduğu ve tutunduğu yerleri etiketlerle gösterir. SLYM tartışması 09. bölümde,
 * kistlerin kliniği 12. bölümde, BOS emiliminin ayrıntısı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak.
 */
export const orumcekAgiZar: DersBolumu = {
  id: 'orumcek-agi-zar',
  baslik: 'Örümcek ağı zar',
  bloklar: [
    // ——— Genel bakış: temel ———
    {
      tur: 'metin',
      md: `Örümcek ağı zar (*arachnoidea mater*) üç zarın ortadakidir. Sert zarın hemen altında, yumuşak zarın üstünde durur (Ghannam ve Al Kharazi, 2023). İnce ve saydamdır. Kendi kan damarı yoktur (Joost ve ark., 2026). Beynin çevresinde kapalı bir kese gibi bir örtü oluşturur (OpenStax 13.3).

Yumuşak zar beynin her oluğuna iner. Örümcek ağı zar ise inmez. Kıvrımların tepesinden tepesine, olukların üstünden bir köprü gibi geçer (Zedde ve Pascarella, 2025a). Tek istisna, iki yarımküreyi ayıran derin yarıktır: **boylamsal yarık**. Örümcek ağı zar bu yarığın içine girer (Gray, 1918; Zedde ve Pascarella, 2025a). Köprünün altında kalan aralık beyin-omurilik sıvısıyla (BOS) doludur (Gray, 1918). Bu aralığa **subaraknoid boşluk**, yani “örümcek ağı zarın altındaki boşluk” denir.

Zarın kalınlığı her yerde aynı değildir. Beynin üst yüzünde ince ve saydamdır. Tabanda kalınlaşır ve ortaya doğru biraz donuklaşır (Gray, 1918). Yaş ilerledikçe üst yüzdeki zar da beyazlaşıp donuklaşabilir. Bu en çok orta hatta yakın yerlerde olur (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'metin',
      md: `Örümcek ağı zar yalnızca beyni sarmaz. Kafatası tabanındaki büyük delikte (*foramen magnum*) omuriliği saran örümcek ağı zarla devam eder (Zedde ve Pascarella, 2025a). Omurga kanalında sert zarla birlikte 2. sağrı omuru (S2) hizasına kadar iner (Byrne ve Dafny, 2026). Kafa içinde hipofiz çukurunun üst yüzünü de örter (Zedde ve Pascarella, 2025a).

Kafaya giren ve çıkan damarlar ile sinirler de bu zarın altından geçer. Zar onları gevşek kılıflarla sarar (Gray, 1918). Kafatasından çıktıkları yerde zar, sinirin ve damarın dış kılıfıyla kaynaşır (Zedde ve Pascarella, 2025a). Görme sinirinde durum farklıdır. Görme siniri gözden beyne giden sinirdir. Zar ve altındaki sıvı dolu boşluk bu sinirle birlikte göz çukuruna uzanır. Sonunda gözün beyaz dış kabuğuyla (*sclera*) birleşir (Zedde ve Pascarella, 2025a). Yani gözün hemen arkasında da beynin çevresindeki sıvıdan bir kılıf vardır.

Aşağıdaki sahnede beynin tabanına alttan bakıyorsun. Örümcek ağı zar modelde yoktur. Etiketler, zarın bu yüzeyde nerelerde köprü kurduğunu gösterir.`,
    },
    {
      tur: 'sahne',
      baslik: 'Tabanda örümcek ağı zar: köprüler ve altındaki boşluklar',
      aciklama:
        'Beynin tabanına alttan bakıyoruz: ön taraf ekranın üstünde, hastanın sağı ekranın solunda. Hipofiz gizlendi. Modelde zarlar yoktur; etiketler zarın bu yüzeyin üstünden nasıl geçtiğini söyler. Zar girintilere inmez; şakak lobları, beyin ayakları ve beyincik arasında köprü kurar. Köprülerin altında BOS dolu geniş yerler kalır. Bunlara sisterna denir. Sisternaların adları ve içerikleri “Zarlar arası boşluklar ve sisternalar” bölümündedir. Kırmızı: atardamarlar. Bu atardamarlar zarın altında, sıvının içinde uzanır.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'damar'],
        renk: 'dogal',
        gizle: ['hipofiz'],
        boya: [{ secici: ['katman:damar'], renk: DAMAR }],
        bakis: 'alt',
        etiketler: [
          { yapi: 'parahipokampal-girus-sol', metin: 'Zar iki şakak lobu arasında gerilir' },
          { yapi: 'serebral-pedinkul-sag', metin: 'Beyin ayakları: zarın altında, sıvının içinde' },
          { yapi: 'baziler-arter', metin: 'Baziler atardamar: köprünün önünde, zarın altında' },
          { yapi: 'orta-beyin-arteri-sol', metin: 'Orta beyin atardamarı: Sylvius yarığının köprüsü altında' },
          { yapi: 'beyincik', metin: 'Zar beyincikten soğana köprü kurar' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Katmanlar ve engel: temel ———
    {
      tur: 'metin',
      md: `Örümcek ağı zarın iki yüzü birbirine hiç benzemez. Dış yüzü sert zara yapışır (Joost ve ark., 2026). Burada hücreler birbirine sıkıca kenetlenmiş birkaç kat oluşturur. Bu kat bir duvar gibi çalışır. Damarlı sert zar ile BOS dolu boşluk arasında maddelerin yayılmasını sınırlar (Joost ve ark., 2026). Bu yüzden ona **araknoid engel hücre katmanı** denir.

İç yüzünden ise yumuşak zara doğru ince iplikler uzanır. Bu iplikleri biraz aşağıda göreceğiz. Dersin başındaki zar katmanları çiziminde sert zarın altındaki engel hücre katını, trabekülleri ve granülasyonları görebilirsin.`,
    },

    // ——— Katmanlar ve engel: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Üç kısım.** Joost ve arkadaşlarına göre örümcek ağı zar üç kısma ayrılabilir. Dışta mezotele benzeyen bir kat vardır. Mezotel, vücut boşluklarını döşeyen ince, yassı hücre örtüsüdür. Ortada bir ara kat bulunur. Derinde ise kollajen lifleri bol, gevşek dizilmiş hücreler yer alır (Joost ve ark., 2026).

**Dış yüz: engel katmanı.** Zarın dış yüzü, sert zarın en iç katına, yani **sınır hücre katmanına** yapışır (Joost ve ark., 2026). Bu sınırda zar, birkaç kat yassı hücreden özel bir örtü yapar. Hücreler birbirine sıkıca bağlıdır. Bu örtüye **nörotelyum** da denir (Joost ve ark., 2026). Hücreler arasında iki tür bağlantı vardır: **sıkı bağlantılar** (*tight junction*) ve **yapışma bağlantıları** (*adherens junction*). Bu bağlantılar mikropların, moleküllerin ve hücrelerin geçişini düzenler (Derk ve ark., 2021). Brøchner ve arkadaşlarına göre bu sürekli örtü 1–3 hücre katından oluşur. Sert zarın iç yüzünü sıkıca kapatır (Brøchner ve ark., 2015).

**Neden önemli?** Sert zar damarlıdır; altındaki boşluk ise BOS doludur. Engel katmanı bu ikisi arasında bir yayılma (difüzyon) engelidir (Joost ve ark., 2026). Epitele benzeyen bu hücre katı, kan ile BOS arasındaki engelin bir parçasıdır (Derk ve ark., 2021). Beyinde iki klasik engel bilinir. Kan-beyin engeli, kan ile beyin dokusu arasındadır. Kan-BOS engeli ise koroid pleksustadır. Brøchner ve arkadaşları araknoid engeli üçüncü bir engel sayar. Bu engel, kan ile BOS arasında önemli bir sınır kurar (Brøchner ve ark., 2015).

**İç yüz: retiküler kat.** İnsan omurilik zarlarının elektron mikroskobu çalışmasında engel katmanı sıkı paketlenmiş hücrelerden oluşuyordu. Çok sayıda sıkı bağlantı vardı; hücreler arasında kollajen yoktu (Vandenabeele ve ark., 1996). Engel katmanının iç yüzünde sürekli bir **bazal lamina** bulunur. Bunun altında kollajenli bir kat vardır: **araknoid retiküler hücre katmanı** (Vandenabeele ve ark., 1996). Trabekül hücreleri bu katın içinde dolaşır. Engel katmanına desmozom denen bağlantılarla tutunurlar (Vandenabeele ve ark., 1996). Yumuşak zar ile örümcek ağı zarın iç katı tek bir hücre tipinden yapılır: **leptomeningeal hücre** (Brøchner ve ark., 2015). Bu iki ince zara birlikte leptomeninks denir; hücrenin adı buradan gelir.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Örümcek ağı zarın katları (dıştan içe)',
      sutunlar: ['Kat', 'Nasıl görünür?', 'Ne işe yarar?'],
      satirlar: [
        [
          'Araknoid engel hücre katmanı (nörotelyum)',
          '1–3 kat yassı hücre; sıkı ve yapışma bağlantıları; hücreler arasında kollajen yok (Brøchner ve ark., 2015; Vandenabeele ve ark., 1996)',
          'Damarlı sert zar ile BOS arasında yayılma engeli (Joost ve ark., 2026)',
        ],
        [
          'Bazal lamina',
          'Engel katmanının iç yüzünde sürekli bir ince zar (Vandenabeele ve ark., 1996)',
          'Engel katmanı ile alttaki kollajenli kat arasındaki sınır',
        ],
        [
          'Araknoid retiküler hücre katmanı',
          'Kollajenli, gevşek dizilmiş hücreler (Vandenabeele ve ark., 1996; Joost ve ark., 2026)',
          'Trabekül hücreleri burada dolaşır ve engel katmanına desmozomlarla tutunur (Vandenabeele ve ark., 1996)',
        ],
        [
          'Trabeküller',
          'Tip I kollajen çekirdeği; üstü leptomeningeal hücrelerle örtülü (Joost ve ark., 2026; Zedde ve Pascarella, 2025a)',
          'Zarı yumuşak zara bağlar; beyni sıvının içinde asılı tutar (Joost ve ark., 2026; Mortazavi ve ark., 2018)',
        ],
      ],
      not: 'Engel katmanının ince yapısı kısmen insan omurilik zarlarından gelir (Vandenabeele ve ark., 1996); bu çalışma yalnızca özetinden okundu. Bazı araştırmacılar örümcek ağı zarın iç kısmında ayrı bir “dördüncü zar” tanımladı (SLYM). Bu iddia ve itirazlar “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümündedir.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Engel sert zarda değil, örümcek ağı zarda',
      md: `Sert zarın damarları pencerelidir; duvarlarında küçük açıklıklar vardır. Sıkı bağlantı da taşımazlar (Joost ve ark., 2026). Damar içine yaban turpu peroksidazı verilebilir; bu, 44 kD büyüklüğünde bir işaretleyici proteindir. Bu madde sert zarın damarlarından dışarı sızar. Yumuşak zarın damarları ise subaraknoid boşlukta uzanır. Bu damarlar sıkı bağlantılıdır ve aynı maddeyi geçirmez (Derk ve ark., 2021).

Peki sert zara sızan madde neden BOS’a karışmaz? Broman’ın 1949’daki deneyinde kana verilen boyalar sert zarı boyadı, örümcek ağı zarı boyamadı. Bu, kanla gelen maddeleri subaraknoid boşluğun dışında tutanın sert zar değil, örümcek ağı zar olduğunu gösterir (Brøchner ve ark., 2015).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Örümcek ağı zar damarsızdır. Dıştan içe: engel hücre katmanı → bazal lamina → retiküler kat → trabeküller (Vandenabeele ve ark., 1996; Joost ve ark., 2026).
- Engel hücreleri sıkı ve yapışma bağlantılarıyla kenetlenir (Derk ve ark., 2021).
- Beynin üç engeli: kan-beyin engeli (kan ile beyin dokusu arası), koroid pleksustaki kan-BOS engeli ve araknoid engel (kan ile BOS arası) (Brøchner ve ark., 2015).
- Sert zar damarları pencereli ve geçirgendir. Subaraknoid boşluktaki yumuşak zar damarları sıkı bağlantılıdır (Joost ve ark., 2026; Derk ve ark., 2021).
- Zar beynin üstünde ince, tabanda kalındır. Oluklara inmez; yalnızca boylamsal yarığa girer (Gray, 1918).
- Büyük delikte omurilik örümcek ağı zarıyla sürer; S2 hizasına kadar iner (Zedde ve Pascarella, 2025a; Byrne ve Dafny, 2026).`,
    },

    // ——— Katmanlar ve engel: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Engelin molekülleri ve kökeni',
      md: `- **Kenet proteinleri:** Engel hücreleri sıkı bağlantı proteini Claudin-11’i ve E-kaderini taşır. Bu, epitele benzeyen kimlikleriyle uyumludur (Derk ve ark., 2021).
- **Taşıyıcılar:** Engel hücrelerinde birçok taşıyıcı protein bol bulunur: P-glikoprotein (ABCB1), BCRP (ABCG2), MRP4 (ABCC4), OAT1 ve OAT3 (Derk ve ark., 2021). İşlev çalışmalarına göre OAT1 ve OAT3, BOS’tan madde temizliğine katılır (Derk ve ark., 2021).
- **Eski ve korunmuş bir yapı:** Engel hücrelerinin sıkı bağlantılarla dolu olduğunu 40 yılı aşkın süre önce elektron mikroskobu gösterdi. Bu ilk çalışmayı 1975’te Nabeshima ve arkadaşları yaptı (Derk ve ark., 2021). Sıkı bağlantılı engel hücreleri çenesiz balıklardan insana kadar birçok türde vardır (Derk ve ark., 2021).
- **Hücre tipleri:** Tek hücreli RNA çalışması fare leptomeninksinde beş ayrı fibroblast benzeri hücre tipi buldu. Bunları yumuşak zara, iç araknoide, dış araknoid engele ve sert zarın sınır katmanına bağladı (Pietilä ve ark., 2023).
- **Gelişim:** Farede engel doğumdan önce çalışır (Derk ve ark., 2023). Engelin nasıl kurulduğu ve insandaki gelişimi “Zarların gelişimi ve keşif tarihi” bölümündedir.
- **Başka işaretler:** Mapunda ve arkadaşları farede örümcek ağı zar ve yumuşak zar hücrelerinin bağlantılarında VE-kaderin buldu. VE-kaderin, E-kaderinli engel hücrelerinin altında ayrı bir Prox1 pozitif hücre katını da işaretledi (Mapunda ve ark., 2023).

Pietilä ve arkadaşları ile Derk ve arkadaşlarının 2023 çalışması yalnızca özetinden okundu.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Engeli canlı insanda izlemek',
      md: `Li ve arkadaşları 20 sağlıklı gönüllüde dinamik bir MR yöntemi kullandı. Gönüllülerin yaş ortalaması 30 ± 7 idi (Li ve ark., 2026). Damar içine kontrast madde verildi. Kontrast, sert zarın kanında 10 saniye içinde görüldü. Sert zardaki ve subaraknoid boşluktaki sıvıda ise yaklaşık 20–40 saniye sonra belirdi (Li ve ark., 2026). Yani engel boyunca madde geçişi canlı insanda ölçülebildi.

Geçiş her yerde aynı hızda değildi. Köprü toplardamarlarının çevresindeki subaraknoid boşlukta kontrastın gelişi ortalama 45,6 ± 18,2 saniyeydi. Üst sagital sinüs çevresinde ise 18,4 ± 4,6 saniyeydi (Li ve ark., 2026).

Farede yapılan başka bir çalışma, köprü toplardamarlarının engeli geçtiği yerlerde engelde açıklıklar buldu (Smyth ve ark., 2024). Bu açıklıklar “Yeni keşifler: lenf damarları, bağışıklık ve tartışmalar” bölümünde anlatılır.

Li ve arkadaşlarının ve Smyth ve arkadaşlarının çalışmaları yalnızca özetinden okundu.`,
    },

    // ——— Trabeküller: temel ———
    {
      tur: 'metin',
      md: `Örümcek ağı zarın iç yüzünden yumuşak zara doğru ince iplikler uzanır. Bunlara **araknoid trabeküller** denir. Bir örümcek ağına benzerler; zar adını bu ağdan alır (OpenStax 13.3). Trabeküller iki zarı birbirine bağlar ve aradaki boşluğa ağ görünüşü verir (Joost ve ark., 2026).

Bu iplikler yalnızca bir görüntü değildir. Beyin, BOS dolu subaraknoid boşlukta onlar sayesinde asılı durur (Mortazavi ve ark., 2018). Başa bir darbe geldiğinde beyin kafatasının içinde biraz kayar. Trabeküller bu kaymayı sönümler ve azaltır. Böylece darbenin yol açtığı beyin hasarını azaltmaya yardım ederler (Saboori ve Sadegh, 2015).

Bir benzetme düşün: su dolu bir kavanozun içinde, ipliklerle kapağa asılmış bir meyve. Kavanoz sarsılınca su ve iplikler meyvenin duvara çarpmasını yumuşatır. Bu yalnızca bir benzetmedir; gerçek trabeküller çok daha karmaşık bir ağ kurar.`,
    },

    // ——— Trabeküller: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Neyden yapılır?** Trabeküller, tip I kollajen üreten fibroblastlardan yapılır. Kollajen ve öteki hücre dışı maddeler trabekülün çekirdeğini oluşturur (Joost ve ark., 2026). Bu çekirdeğin üstünü leptomeningeal hücreler örter. Bu hücreler birbirine desmozomlarla ve oluklu bağlantılarla (*gap junction*) bağlanır (Zedde ve Pascarella, 2025a).

**Biçimleri.** Trabeküller tek tip değildir. İnce silindirlerden yassı, uzun yapraklara kadar değişirler. İncelerine “sütun” ya da “çubuk”, yassı ve uzun olanlarına “septa” denir (Zedde ve Pascarella, 2025a). Bir deney çalışması üç biçim tanımladı: ağaç biçimli çubuklar, sütunlar ve plakalar. Bazı bölgelerde trabeküller karmaşık bir ağ kurar (Saboori ve Sadegh, 2015). Ağaç biçimli bir trabekülün gövdesi yumuşak zarda durur. Dalları ise örümcek ağı zara karışır (Saboori ve Sadegh, 2015).

**Perdeler.** Bazı yerlerde septalar birbirine eklenir ve yarı sürekli tabakalar oluşturur. Bunlara **iç araknoid zarlar** denir. Subaraknoid boşluğu bölmelere ayırırlar ve BOS akımını belli yönlere çevirirler (Zedde ve Pascarella, 2025a).

**Boşluk ne kadar geniş?** Genişlik yerden yere çok değişir. Kıvrımların tepesinde yumuşak zar ile örümcek ağı zar birbirine değer. Oluklarda ise üçgen biçimli boşluklar kalır (Gray, 1918). Ölçülen genişlikler “Zarlar arası boşluklar ve sisternalar” bölümündedir.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Trabekül biçimleri',
      sutunlar: ['Biçim', 'Nasıl görünür?', 'Kaynak'],
      satirlar: [
        ['Sütun, çubuk', 'İnce silindir; tek tek iplikler', '(Zedde ve Pascarella, 2025a)'],
        ['Ağaç biçimli çubuk', 'Gövdesi yumuşak zarda, dalları örümcek ağı zarda', '(Saboori ve Sadegh, 2015)'],
        ['Plaka', 'Yassı yaprak; sıçanda 0,5–3 µm’lik delikleri olan, kendisi de geçirgen bir yapı', '(Saboori ve Sadegh, 2015)'],
        [
          'Septa ve iç araknoid zarlar',
          'Yassı, uzun yapraklar; yer yer yarı sürekli perdeler kurar ve boşluğu bölmelere ayırır',
          '(Zedde ve Pascarella, 2025a)',
        ],
      ],
      not: 'Delik ölçüsü sıçan dokusunda, taramalı elektron mikroskobuyla ölçüldü (Saboori ve Sadegh, 2015). İnsan ve sıçanda trabeküller fibroblastlarla çevrili kollajen sütunlardır; farede ise sütun görülmez (Derk ve ark., 2021).',
    },

    // ——— Trabeküller: uzman ———
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Trabekülleri ayırmak',
      md: `- Trabekül ağı düzensizdir ve çoğunlukla damarların yakınında yoğunlaşır. Bu yüzden mikrocerrahide trabekülleri küt değil, keskin bir aletle ayırmak önerilir (Mortazavi ve ark., 2018).
- Yaşargil’e göre trabeküller subaraknoid boşluktaki sinirlere de tutunur (Zedde ve Pascarella, 2025a). Örümcek ağı zarda ve trabeküllerde, özellikle büyük sisternada, sinir uçları bulunur. Bu uçlar BOS basıncı hakkında bilgi taşıyor olabilir (Zedde ve Pascarella, 2025a).
- Yaşargil’e göre anevrizmalar çoğu zaman sisterna duvarlarının örümcek ağı zarıyla sarılır. Bu yüzden ameliyatta zar anevrizmadan uzakta açılırken bile gerilim anevrizmanın tepesine iletilebilir. Bu da kanamaya yol açabilir (Volovici ve ark., 2020).
- Sisternalar arasındaki bölmeler, değişik büyüklükte delikleri olan eksik ve gözenekli duvarlardır. Trabekül yapışıklıkları sisternaları açmanın asıl zorluğudur (Villanueva ve ark., 2023).

Mortazavi ve arkadaşlarının derlemesi yalnızca özetinden okundu.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Trabeküller ne kadar yer kaplar?',
      md: `- Yedi insan kadavrasında trabeküller, ışıkla kesit alan bir yöntemle (optik koherens tomografi) görüntülendi. Trabeküllerin boşlukta kapladığı hacim oranı, beyin başına ortalama %22,0–29,2 bulundu (Benko ve ark., 2020).
- Oran bölgeye göre değişiyordu. Beynin üst yüzüne yakın yerlerde %12, alın loblarında %5–10 daha yüksekti (Benko ve ark., 2020).
- İnsan ve sıçanda trabeküller fibroblastlarla çevrili kollajen sütunlardır. Farede ise sütun görülmez; boşluğu fibroblastların uzun uzantıları geçer (Derk ve ark., 2021). Fare deneylerini okurken bu farkı aklında tut.
- Örümcek ağı zarın fibroblastları RALDH2 ve CRABP2 adlı iki protein taşır. Biri retinoik asit yapar, öteki onu bağlar (Derk ve ark., 2021). Bu retinoik asit beyin ve damar gelişimini düzenler (Derk ve ark., 2021).
- Joost ve arkadaşları bir varsayım öne sürer. Kollajenden zengin trabekül ağı, bağışıklık hücrelerinin boşlukta göçünü ve tutulmasını düzenleyen bir iskele olabilir (Joost ve ark., 2026). Bu varsayım, multipl sklerozda zarlarda biriken bağışıklık kümelerini açıklamaya yöneliktir.

Benko ve arkadaşlarının çalışması yalnızca özetinden okundu.`,
    },

    // ——— İç zarlar ve Liliequist zarı: temel ———
    {
      tur: 'metin',
      md: `Trabeküller bazı yerlerde birleşir ve ince perdeler yapar. Bunlara **iç araknoid zarlar** denir. Subaraknoid boşluğu odalara ayırırlar ve BOS’un akışını belli yönlere çevirirler (Zedde ve Pascarella, 2025a). Beynin tabanındaki sisternalar da çoğu zaman bu perdelerle birbirinden ayrılır (Zedde ve Pascarella, 2025a).

Bu perdelerin en bilineni **Liliequist zarıdır**. En basit tanımıyla, Türk eyerinin arka duvarından (eyer sırtı, *dorsum sellae*) mamiller cisimlere uzanan bir örümcek ağı zar perdesidir (Dias ve ark., 2014). Türk eyeri, hipofizin oturduğu kemik çukurdur. Mamiller cisimler (*corpora mammillaria*) ise beynin tabanındaki iki küçük yuvarlak çıkıntıdır. Beyin cerrahları beynin ortasındaki interpedinküler sisternaya ilerlerken bu zarı temel bir yol işareti olarak kullanır (Volovici ve ark., 2020).`,
    },

    // ——— İç zarlar ve Liliequist zarı: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Perdelerin türleri.** Lü ve Zhu kafa içindeki örümcek ağı zar perdelerini üç türe ayırdı: dış yüzdekiler (konveks), tabandakiler (bazal) ve trabeküler zarlar. Bu perdeler sisternaların sınırını çizer ve ameliyatta yol açmayı kolaylaştırır (Zedde ve Pascarella, 2025a). Görünüşleri çok değişkendir. Saydam ya da yarı saydam, zar ya da ağ biçiminde, delikli ya da sağlam olabilirler. Kalınlıkları da örnekten örneğe değişir (Zedde ve Pascarella, 2025a).

**Liliequist zarının seyri.** Zar arka klinoid çıkıntılardan ve eyer sırtından başlar (Zedde ve Pascarella, 2025a). Volovici ve arkadaşlarına göre tabandaki bazal zardan doğar. Önce tek bir yaprak olarak yukarı ve arkaya ilerler. Sonra iki yaprağa ayrılır: üstte **diensefalik**, altta **mezensefalik** yaprak (Volovici ve ark., 2020).
- **Diensefalik yaprak** mamiller cisimlerin yakınına tutunur. Kiazma sisternasını interpedinküler sisternadan ayırır (Zedde ve Pascarella, 2025a).
- **Mezensefalik yaprak** interpedinküler sisternayı alttaki prepontin sisternadan ayırır. Okülomotor sinirler onu iç ve dış parçalara böler. Daha ince ve daha eksiktir; bu yüzden görüntülemede daha zor seçilir (Zedde ve Pascarella, 2025a).

**Komşuları.** Mezensefalik yaprağın tutunmaya başladığı yer, baziler atardamarın tepesi ve çatallanmasıdır (Villanueva ve ark., 2023). Anik ve arkadaşlarına göre zarın yan kenarı beyincik çadırına ulaşır. Burada okülomotor sisternanın tabanını yapar (Volovici ve ark., 2020). Okülomotor sinir, kavernöz sinüse girene kadar bu zarın uzantısı olan bir örümcek ağı zar manşonuyla sarılıdır (Volovici ve ark., 2020). Liliequist zarı aşağıda köprünün ve soğanın önündeki zarlarla kesintisiz bir ağ kurar. Bu ağ beyin sapının ön-yan yüzünün tamamını örter (Volovici ve ark., 2020).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Liliequist zarının uzandığı yer',
      aciklama:
        'Sağ yarı kaldırıldı; sol yarıma içeriden, orta hattan bakıyoruz. Ön taraf ekranın sağında, tepe yukarıda. Kabuk, ak madde ve beyincik gizlendi. Liliequist zarı modelde yoktur. Zar, hipofizin arkasındaki eyer sırtından başlar ve ikiye ayrılır. Üstteki diensefalik yaprak mamiller cisimlere uzanır. Alttaki mezensefalik yaprak baziler atardamarın tepesi hizasında beyin sapına tutunur. Bu yaprak interpedinküler sisternayı alttaki prepontin sisternadan ayırır. Kırmızı: atardamarlar.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik', 'damar'],
        renk: 'dogal',
        goster: [
          'mamiller-cisimler',
          'optik-kiazma',
          'optik-sinir',
          'hipofiz',
          'hipotalamus',
          'talamus',
          'ucuncu-karincik',
          'orta-beyin',
          'pons',
          'omurilik-sogani',
          'katman:damar',
        ],
        boya: [{ secici: ['katman:damar'], renk: DAMAR }],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'hipofiz', metin: 'Hipofiz: zar arkasındaki eyer sırtından başlar' },
          { yapi: 'mamiller-cisimler', metin: 'Diensefalik yaprak buraya uzanır' },
          { yapi: 'optik-kiazma', metin: 'Zarın önü: kiazma sisternası' },
          { yapi: 'orta-beyin', metin: 'Orta beynin önü: interpedinküler sisterna' },
          { yapi: 'pons', metin: 'Köprünün önü: prepontin sisterna' },
          { yapi: 'baziler-arter', metin: 'Baziler tepe: mezensefalik yaprak burada tutunur' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık: ETV ile sisternalara bağlanır' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Liliequist zarının bölümleri ve MR’da görünüşü',
      sutunlar: ['Bölüm', 'Neyi neyden ayırır?', 'Sağlıklı 31 kişide 3B CISS ile görülme', '445 hastada 3B-SPACE ile tümüyle sağlam'],
      satirlar: [
        ['Sellar bölüm (eyer bölgesindeki başlangıç)', '—', '%81 (25 kişi)', '%63'],
        ['Diensefalik yaprak', 'Kiazma sisternası ↔ interpedinküler sisterna', '%52 (16 kişi)', '%60'],
        ['Mezensefalik yaprak', 'İnterpedinküler sisterna ↔ prepontin sisterna', '%16 (5 kişi)', '%95'],
      ],
      not: 'İkinci sütundaki bilgi Zedde ve Pascarella’dan alındı (Zedde ve Pascarella, 2025a). Üçüncü sütun, zarın sagital düzlemde görülme oranıdır (Fushimi ve ark., 2003). Dördüncü sütun Ankara, Bursa ve İstanbul’dan 3 teslalık bir MR çalışmasından, zarın delik olmadan bütün kalma oranıdır (Algin ve ark., 2016). Biri görülebilmeyi, öteki deliği ölçer; iki sütun doğrudan karşılaştırılamaz. Dias ve arkadaşlarına göre de en sık görülen bölüm sellar bölümdür (Dias ve ark., 2014). Fushimi ve Algin çalışmaları yalnızca özetinden okundu.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'İnce perdeleri MR’da görmek',
      md: `Örümcek ağı zar perdelerini göstermek için çok ince kesitli MR dizileri kullanılır. Siemens’te CISS, GE’de FIESTA, Philips’te Balanced FFE adını taşırlar (Zedde ve Pascarella, 2025a). Liliequist zarı gibi ince yapılar için bugün tercih edilen dizi CISS’tir (Zedde ve Pascarella, 2025a).

Normal perdeler, T2 ağırlıklı görüntüde BOS’u kesen ince karanlık çizgiler olarak görülür. Ama sağlıklı kişide birçoğu güçlü MR’da bile seçilemez (Zedde ve Pascarella, 2025a). Fushimi ve arkadaşlarının çalışmasında zar, görüldüğü 25 kişinin 22’sinde (%88) üçüncü karıncık tabanının yarı kalınlığından daha inceydi (Fushimi ve ark., 2003). Kanama, iltihap ya da tümörle kalınlaşan perdeler daha kolay görülür (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Liliequist zarı neden önemli?',
      md: `- **Endoskopik üçüncü ventrikülostomi (ETV):** Bu ameliyatta BOS’a, üçüncü karıncıktan aşağıdaki interpedinküler ve prepontin sisternalara giden bir yol açılır. Diensefalik yaprak bu akımı tıkayabilir. Bu yüzden iyi sonuç için yaprağın da delinmesi gerekir (Zedde ve Pascarella, 2025a). Zarın açılması işlemin başarısı için çok önemlidir (Etus ve ark., 2011). Zarın ya da köprü önündeki trabeküllerin akımı tıkaması, ETV başarısızlığının bilinen bir nedenidir (Dias ve ark., 2014).
- **Anevrizmasız kanama:** Bazı kanamalarda kan beyin sapının çevresindeki sisternalarda toplanır ve anevrizma bulunmaz. Bu kanamada kan genellikle Liliequist zarının altında kalır: interpedinküler, ambiens ve prepontin sisternalarda. Kiazma sisternasına geçmez (Zedde ve Pascarella, 2025a). Zarın üstüne çok kan geçmesi ise anevrizma kuşkusu doğurmalıdır (Dias ve ark., 2014). Kanamaların ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümündedir.

Etus ve arkadaşlarının çalışması yalnızca özetinden okundu.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Delik açıldı, ama sıvı akmıyor',
      oyku: 'On dokuz yaşında bir erkek, aylardır süren baş ağrısı ve bulanık görme ile başvuruyor. MR’da yan karıncıklar ve üçüncü karıncık genişlemiş; dördüncü karıncık normal. Beyin su yolunda (Sylvius kanalı) darlık var. Hastaya endoskopik üçüncü ventrikülostomi (ETV) yapılıyor. Birkaç hafta sonra yakınmalar geri dönüyor. Kontrol MR’ın ince kesitli 3B CISS görüntülerinde interpedinküler sisternada bütün kalmış ince bir perde seçiliyor.',
      soru: 'Ameliyatın başarısız olmasında hangi anatomik yapı rol oynamış olabilir, ve neden?',
      cozum:
        'Görülen perde büyük olasılıkla Liliequist zarıdır. ETV’de BOS’un üçüncü karıncıktan interpedinküler ve prepontin sisternalara geçmesi amaçlanır. Zarın diensefalik yaprağı bu akımı engelleyebilir; bu yüzden işlem sırasında yaprağın da delinmesi gerekir (Zedde ve Pascarella, 2025a). Liliequist zarının ya da köprü önündeki trabeküllerin akımı tıkaması, ETV başarısızlığının bilinen bir nedenidir (Dias ve ark., 2014). Zarın yapısı da her hastada aynı değildir. Kocaeli’deki küçük bir çalışmada uzun süreli hidrosefalide zar sert ve sıktı. Elektron mikroskobunda düzenli, sık tip I kollajen demetleri görüldü (Etus ve ark., 2011). İnce perdeleri göstermede tercih edilen MR dizisi CISS’tir (Zedde ve Pascarella, 2025a). *Vaka eğitim için kurgulanmıştır.*',
    },

    // ——— İç zarlar ve Liliequist zarı: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kaç yaprak?** Volovici ve arkadaşları Liliequist zarını inceleyen 13 anatomi çalışmasını derledi. Çalışmaların %54’ünde (7/13) zar iki yapraklıydı: üstte diensefalik, altta mezensefalik (Volovici ve ark., 2020). Başka yazarlar tek ya da üç yaprak tanımladı (Zedde ve Pascarella, 2025a). Farkın bir açıklaması doku hazırlığıdır. Birden çok yaprak bulan çalışmalar formalinle sabitlenmiş kafalarda yapıldı. Formalin örümcek ağı zarları kısmen eritir. Yazarlara göre zardan çıkan bazı trabeküller de fazladan yaprak sanılmış olabilir (Volovici ve ark., 2020).

**Nereye tutunur?** Diensefalik yaprağın arka-üst tutunma yeri de tartışmalıdır. 13 çalışmanın 8’i onu mamiller cisimlerin ön kenarına (premamiller) koyar. 2’si ise mamiller cisimlerin tepesine ya da arkasına (retromamiller) koyar (Volovici ve ark., 2020). Volovici ve arkadaşlarına göre en geçerli çalışma Kurucz’unkidir. Bu çalışma 110 taze kadavra başında küçük kafatası açıklıklarından endoskopla yapıldı. Ama PubMed’de dizinlenmediği için az bilinir (Volovici ve ark., 2020). Anik ve arkadaşları ise 24 taze kadavrada endoskopik ve mikrocerrahi diseksiyon yaptı (Volovici ve ark., 2020).

**Ölçü ve köken.** Liliequist zarı genellikle 1 mm’den incedir. Kalınlığı, üçüncü karıncık tabanındaki tuber cinereumdan her zaman azdır (Dias ve ark., 2014). Dias ve arkadaşlarına göre zar, embriyodaki ilkel çadırın (primer tentorium) bir kalıntısı sayılabilir (Dias ve ark., 2014). Zar, özellikle diensefalik yaprağıyla, olguların yaklaşık %10–30’unda interpedinküler sisternayı kiazma sisternasından tümüyle ayırır (Dias ve ark., 2014).

**Adı nereden?** Zarı ilk kez 1875’te Key ve Retzius tanımladı. Liliequist onu 1956’da kadavralarda havalı beyin filmiyle (pnömoensefalografi) inceledi (Dias ve ark., 2014). Havanın interpedinküler sisternada sık sık durakladığını görmüştü (Zedde ve Pascarella, 2025a).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den çalışmalar: Liliequist zarı ve sisterna perdeleri',
      sutunlar: ['Nerede, kimler?', 'Yöntem', 'Ne buldu?'],
      satirlar: [
        [
          'Ankara (Atatürk EAH), Bursa ve İstanbul; 445 hasta (Algin ve ark., 2016)',
          '3 tesla 3B-SPACE MR',
          'Hastaların %11’inde (48) zar delikli; tümüyle sağlam olma oranı: sellar bölüm %63, diensefalik %60, mezensefalik %95',
        ],
        [
          'Kocaeli; 11 hasta (Etus ve ark., 2011)',
          'Endoskopla alınan zarın elektron mikroskobu',
          'Uzun süreli hidrosefalide fibroblast benzeri hücreler arasında düzenli, sık tip I kollajen demetleri',
        ],
        [
          'Antalya; ön bağlantı atardamarı anevrizması kanamış 145 hasta (Akyuz ve Tuncer, 2006)',
          'İki grubun karşılaştırılması',
          'Lamina terminalise ek olarak zar açılınca şant gereken hidrosefali %9,8’den %4’e indi; fark anlamlı değildi (p = 0,203)',
        ],
        [
          'İstanbul; hidrosefalili 134 hasta; Dinçer ve arkadaşları (Zedde ve Pascarella, 2025a)',
          '3 tesla 3B CISS MR',
          '28 hastada akımı tıkayan sisterna perdesi; çoğu prepontin ve interpedinküler sisternada; 17’si ETV sırasında doğrulandı',
        ],
      ],
      not: 'Algin, Etus ve Akyuz çalışmaları yalnızca özetinden okundu. Dinçer ve arkadaşlarının bulguları Zedde ve Pascarella’nın (2025a) derlemesinden aktarıldı; özgün makale açılmadı. Bu çalışmanın yeri ve yöntemi, makalenin yayın kaydındaki yazar adresinden ve başlığından alındı.',
    },

    // ——— Araknoid granülasyonlar: temel ———
    {
      tur: 'metin',
      md: `Örümcek ağı zar bazı yerlerde sert zarı geçer ve toplardamar sinüslerinin içine doğru uzanır. Toplardamar sinüsleri (sert zar sinüsleri, *sinus durae matris*), sert zarın içinde uzanan büyük toplardamar kanallarıdır. Burun çevresindeki hava boşluklarıyla karıştırma. Toplardamar sinüslerini “Sert zarın toplardamar sinüsleri” bölümünde gördük. Zarın bu küçük çıkıntılarına **araknoid granülasyon** denir (OpenStax 13.3).

Ders kitaplarına göre BOS buradan kana süzülür (OpenStax 13.3). Ama bugün bu görüş tartışmalıdır. Granülasyonlardan BOS’un nasıl geçtiğini açıklayan, herkesçe kabul edilmiş bir model yoktur (Joost ve ark., 2026). BOS’un emilmesi “Karıncıklar ve beyin-omurilik sıvısı” dersinde ayrıntılı anlatılacak.

Çok küçük, ancak mikroskopla görülen çıkıntılara **araknoid villus** denir. Gözle görülen büyüklerine ise granülasyon denir. İkisi arasındaki tek önemli fark boyuttur (Proulx, 2021). Bu yapıları ilk kez 1705’te İtalyan anatomist Antonio Pacchioni anlattı (Proulx, 2021). Bu yüzden onlara **Pacchioni cisimcikleri** de denir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: `Pacchioni bu yapıları bez sandı ve onlara *glandulae conglobatae* adını verdi (Brunori ve ark., 1993; Radoš ve ark., 2021). Salgı yaptıklarını ve sıvılarıyla zarları ve beyni “yağladıklarını” düşündü (Radoš ve ark., 2021). Gray 1918 ise bunların bez olmadığını, büyümüş normal araknoid villuslar olduğunu yazar (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `Gray 1918, granülasyonların bebeklikte görülmediğini ve yaşla çoğaldığını yazmıştı (Gray, 1918). Bugünkü MR çalışmaları bu tabloyu kısmen doğruluyor, kısmen değiştiriyor.

Zagreb’de 120 kişinin beyni 3 teslalık MR ile incelendi. Kişiler yenidoğandan 80 yaşa kadar yedi yaş grubundaydı (Radoš ve ark., 2021). Yenidoğanların ve 2 yaşındaki çocukların %85’inde sinüslerde görünür granülasyon yoktu. Ama %15’inde vardı. En sık yer enine sinüstü (Radoš ve ark., 2021). **Üst sagital sinüs**, kafanın tepesinde iki yarımküre arasındaki yarığın üstünde uzanan büyük sinüstür (OpenStax 13.3). Bu sinüste granülasyonu olanların oranı yaşla arttı ve 40 yaşında %100’e ulaştı (Radoš ve ark., 2021). Ama 80 yaşında yeniden %65’e indi (Radoš ve ark., 2021). Yani granülasyonlar orta yaşa kadar çoğalır, ileri yaşta sinüste azalabilir. Bebeklikteki gelişim “Zarların gelişimi ve keşif tarihi” bölümünde anlatılır.

Granülasyonlar büyüdükçe önlerindeki incelmiş sert zarı iter. Basınçla kemiği de aşındırır ve kafatasının iç yüzünde küçük çukurcuklar açarlar (Gray, 1918). Zagreb çalışmasında kemiğin içindeki granülasyonlar ilk kez 10 yaşında görüldü. 60 yaşından sonra kemikte, sinüstekinden daha çok granülasyon vardı (Radoš ve ark., 2021).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Granülasyonlar ve yaş (Zagreb’de 120 kişi)',
      ogeler: [
        { deger: '%85', aciklama: 'yenidoğan ve 2 yaşındakilerde görünür granülasyon olmayanlar' },
        { deger: '%100', aciklama: '40 yaşında üst sagital sinüste granülasyonu olanlar' },
        { deger: '1–23', aciklama: '40 yaşında kişi başına granülasyon sayısının aralığı' },
        { deger: '%65', aciklama: '80 yaşında üst sagital sinüste granülasyonu olanlar' },
      ],
      not: 'Bütün sayılar Radoš ve arkadaşlarının 3 teslalık MR çalışmasındandır (Radoš ve ark., 2021). Kişiden kişiye fark çok büyüktür: 40 yaş grubunda bile bir kişide 1, bir başkasında 23 granülasyon sayıldı.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Yer:** Örümcek ağı zar, sert zar ile yumuşak zar arasındadır. İnce, saydam ve damarsızdır.

**Köprü:** Oluklara inmez, üstlerinden geçer; yalnızca boylamsal yarığa girer. Tabanda kalınlaşır ve altında geniş sisternalar bırakır.

**Engel:** Dış yüzündeki sıkı kenetli hücreler, sert zarın damarlarından gelen maddeleri BOS’tan ayırır.

**İplikler:** Trabeküller beyni sıvının içinde asılı tutar ve darbede kaymasını sönümler.

**Perdeler:** Liliequist zarı, eyer sırtından mamiller cisimlere uzanan en bilinen perdedir.

**Granülasyonlar:** Zarın sinüslere uzanan çıkıntılarıdır. Bebeklikte çoğunlukla görülmez. Orta yaşa kadar artar, ileri yaşta sinüste azalabilir. BOS emilimindeki payı tartışmalıdır.`,
    },

    // ——— Araknoid granülasyonlar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bir villusun katları.** Gray 1918’e göre villus, örümcek ağı zarın sert zarı delmesiyle oluşur. Böylece zarın hücreleri, büyük sinüslerin damar iç örtüsünün (endotel) hemen altına gelir (Gray, 1918). Villus üst sagital sinüse uzanıyorsa üstünü çok incelmiş sinüs duvarı örter. Bu duvar yalnızca endotelden ibaret olabilir (Gray, 1918). Villusun içinde bir subaraknoid doku çekirdeği vardır. Bu çekirdek dar bir sapla genel subaraknoid dokuya bağlanır (Gray, 1918).

**Bugünkü mikroskopla.** Shah ve arkadaşları insan granülasyonlarını yüksek çözünürlüklü mikroskopla inceledi. Granülasyon dışta bir kapsül ve içte bir doku çekirdeğinden (stromal çekirdek) oluşur (Shah ve ark., 2023). Tabanda bir sap vardır. Gövdede çekirdek, kapsül ve bir ya da daha çok tepe (kubbe) bulunur (Shah ve ark., 2023). İçteki kanal ağları sinüs çevresindeki boşluklarla bağlantılıdır (Shah ve ark., 2023).

**Sinüse nereden açılır?** Sert zarın toplardamarlarının birçoğu sinüse doğrudan değil, **venöz lakün** denen bir dizi genişlemeyle açılır. Granülasyonlar bu lakünlerin içine sık sık girer (Gray, 1918). Lakünler en çok üst sagital sinüsün orta kısmının iki yanındadır. Enine ve düz sinüslerin yakınında da bulunurlar (Gray, 1918). Yaşlılarda bu lakünler çoğu zaman birleşir. Her yanda, ince lifli bantların geçtiği ve çok sayıda granülasyon taşıyan tek, uzun bir yapı oluşur (Zedde ve Pascarella, 2025b). 100 kişilik bir MR çalışmasında granülasyonların yaklaşık %96’sına (431’in 414’üne) bir ya da daha çok toplardamar giriyordu (Zedde ve Pascarella, 2025b).

**Üç yerleşim tipi.** Bir kadavra çalışmasında üst sagital sinüs endoskopla içeriden incelendi (20 örnek). Granülasyonlar üç tipe ayrıldı (Ye ve ark., 2022):
- **Tip I:** sinüsün yan duvarına yapışıktır ve doğrudan sinüsün içine bakar.
- **Tip II:** sinüs içindeki lifli bantların (Willis bantları) oluşturduğu odacıklardadır.
- **Tip III:** subaraknoid boşluktadır.

Aynı grup 268 hastanın ince kesitli MR’ında üst sagital sinüs başına ortalama 1,36 granülasyon saydı. Tiplerin oranları sırasıyla %20,27, %45,20 ve %34,52 idi (Ye ve ark., 2022).

**Yalnızca kafa tepesinde değil.** Granülasyonlar trigeminal sinirin çevresindeki sert zar cebinde (Meckel boşluğu) de bulunur. İncelenen 26 örneğin hepsinde vardı. Çoğunda (18/26; %69,2) sinirin V2 ve V3 dalları arasındaki üçgen alanda iyi gelişmiş kümeler oluşturuyordu (Wysiadecki ve ark., 2023).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yaşa göre üst sagital sinüsteki granülasyonlar',
      sutunlar: ['Yaş', 'Ortalama sayı (± SS)', 'Öne çıkan bulgu'],
      satirlar: [
        ['Yenidoğan', '0,1 ± 0,3', '%85’inde hiçbir sinüste görünür granülasyon yok; %15’inde var, en çok enine sinüste'],
        ['2 yaş', '0,1 ± 0,3', 'Yenidoğandaki tablo aynen sürer: %85’inde görünür granülasyon yok'],
        ['10 yaş', '1,2 ± 2,5', 'Kemik içi granülasyon ilk kez görülür; granülasyonların %75’i 4 mm’den küçük'],
        ['20 yaş', '5,4 ± 4,4', '—'],
        ['40 yaş', '8,2 ± 5,7', 'Herkeste var (%100); kişi başına 1–23 granülasyon'],
        ['60 yaş', '6,1 ± 6,1', 'Bu yaştan sonra kemikte sinüstekinden çok granülasyon var'],
        ['80 yaş', '2,2 ± 2,2', 'Granülasyonu olanlar %65; 4 mm’den küçüklerin payı %25’e iner'],
      ],
      not: 'Hepsi Radoš ve arkadaşlarının 3 teslalık MR çalışmasındandır (Radoš ve ark., 2021). SS: standart sapma. Granülasyonlar 1 mm’den küçükten 10–15 mm’ye kadar değişiyordu. Enine ve sigmoid sinüslerde granülasyonu olanların oranı hiçbir yaşta %40 ve %25’i geçmedi. Kadınlar ve erkekler arasında sayı, büyüklük ve dağılım farkı yoktu (Radoš ve ark., 2021).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hangi sinüste daha çok?** Kaynaklar burada ayrışır. Zagreb çalışmasında granülasyonların en çoğu üst sagital sinüsteydi (Radoš ve ark., 2021). Ankara’da 300 hastanın kontrastlı, ince kesitli MR’ında ise 889 granülasyon sayıldı. Bunların 405’i enine sinüslerde (183 sağ, 222 sol), 265’i üst sagital sinüste, 185’i düz sinüste, 34’ü sinüslerin birleşim yerindeydi (Kaplanoğlu ve ark., 2023). Fark yöntemden ve kişi seçiminden gelebilir. Zagreb çalışması T2 kesitleri kullandı ve BOS sistemi normal kişileri aldı. Ankara çalışması ise yalnızca en az bir granülasyonu olan hastaları aldı.

**Herkeste var mı?** Kadavralarda granülasyonlar örneklerin üçte ikisinde görülür, başlıca üst sagital ve enine sinüste (Zedde ve Pascarella, 2025b). Eski anatomi çalışmalarına göre de yetişkinlerin yaklaşık üçte birinde sinüslerde granülasyon yoktur (Radoš ve ark., 2021). Embriyo ve fetüslerin doku çalışmalarında sinüslerde ne villus ne granülasyon bulundu (Radoš ve ark., 2021).

**Emilimdeki payı.** Radoš ve arkadaşlarına göre BOS sistemi tümüyle normal olan pek çok kişide sinüslerde granülasyon yoktur. Yazarlar bu yüzden granülasyonların BOS emiliminde sanıldığı kadar temel olmadığını düşünür (Radoš ve ark., 2021). Elektron mikroskobu, villusların sinüsün endotelini tümüyle delmediğini gösterdi. Arada sıkı bağlantılı bir endotel engeli kalır (Proulx, 2021). İnsanda BOS’un granülasyonlardan çıktığını gösteren ikna edici bir canlı görüntüleme de henüz yoktur (Albayram ve ark., 2022). Konunun ayrıntısı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Villus mikroskobik, granülasyon gözle görülür; tek büyük fark boyuttur (Proulx, 2021).
- İlk tanım: Antonio Pacchioni, 1705 (Proulx, 2021). TA2 adı *granulationes arachnoideae*; *granulationes Pacchioni* ilişkili addır (FIPAT, 2019).
- Granülasyonlar sık sık venöz lakünlere girer. Lakünler en çok üst sagital sinüsün orta kısmının iki yanındadır (Gray, 1918).
- Zagreb MR çalışması: yenidoğanların %85’inde görünür granülasyon yok; 40 yaşında üst sagital sinüste %100; 60 yaştan sonra kemikte daha çok (Radoš ve ark., 2021).
- Granülasyonların BOS emilimindeki payı tartışmalıdır (Radoš ve ark., 2021; Joost ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Sinüste düğüm: granülasyon mu, pıhtı mı?',
      md: `Granülasyonlar genellikle birkaç milimetre çapındadır. Ama 1 cm’yi aşan dev granülasyonlar da vardır (Kaplanoğlu ve ark., 2023). Büyüyünce toplardamar görüntülemesinde (venografi) sinüsün içinde düğüm biçimli bir dolma kusuru yapabilirler (Mehta ve Mehta, 2023). Dev granülasyon yuvarlak ya da ovaldir. MR’da subaraknoid boşlukla bağlantılı görünür (Mehta ve Mehta, 2023).

İçinin sinyali kaynaklarda farklı anlatılır. Alışılmış tanı ölçütü, içinin BT’de ve bütün MR dizilerinde BOS’a benzemesiydi (Ayaz ve ark., 2017). Mehta ve Mehta’nın derlediği olgularda tanı, içi BOS’a benzeyen bir yapı görülerek konmuştu. Aynı derleme, olguların çoğunda iç sinyalin BOS’tan farklı olduğunu da aktarır (Mehta ve Mehta, 2023). Erzurum’daki bir seride 45 dev granülasyonun 32’sinde sıvının sinyali T1 ve FLAIR’de BOS’tan farklıydı. Yazarlar bunu çoğunlukla granülasyonun içindeki BOS akımına bağladı (Ogul ve ark., 2019).

Bu görünüm, sinüsteki pıhtıyla (sinüs trombozu) karışabilir. Tromboz genellikle bir sinüs bölümünün tamamını ya da birden çok sinüsü tutar. Korteks toplardamarlarına da uzanabilir. Granülasyon ise odaksal, sınırları belli, düğümsü bir kusur yapar (Ayaz ve ark., 2017). Enine sinüsteki granülasyonlar en sık sinüsün orta ve dış üçte birinin birleştiği yerde görülür. Burası yüzeyel toplardamarların sinüse girdiği yerin yakınıdır (Ayaz ve ark., 2017). Dev granülasyonların içinde sıklıkla damar bulunur (Mehta ve Mehta, 2023). Bazı hastalarda dev granülasyon pıhtı sanılmış; pıhtılaşma araştırması ve ilaç tedavisi başlanmıştır (Mehta ve Mehta, 2023).`,
    },

    // ——— Araknoid granülasyonlar: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Granülasyonun iç yapısı.** Shah ve arkadaşları 20 ölüden 400 granülasyon inceledi. Granülasyonların %72’si dar boyunlu ve saplıydı (polipoid). %28’i ise plak gibi, geniş tabanlıydı (sesil) (Shah ve ark., 2023). Kapsülün yüzünü örten örümcek ağı zar hücreleri (meningotel) yaşla azalıyordu. Ortanca örtü gençlerde %90, orta yaşlılarda %71, yaşlılarda %27 idi (Shah ve ark., 2023). Granülasyonların yalnızca bir kısmı sinüs dokusuyla ilişkiliydi. Tepeleri sinüsün içinde, sert zarın dokusunda, kemiğin süngerimsi katında (diploe) ya da sert zarın dışında olabiliyordu (Shah ve ark., 2023). Alın kutbunda granülasyonlar ayrılırken 20 örneğin 14’ünde (%70) sert zar kendiliğinden ayrıldı (Shah ve ark., 2023).

Sinüs çevresinde gevşek bir doku vardır: sert zar-örümcek ağı zar stroması. Bu doku kollajen ve fibronektinden zengindir ve çeşitli bağışıklık hücreleri barındırır (Shah ve ark., 2023). Granülasyon çekirdeklerinde de bağışıklık hücreleri ve sitokinler bulundu. Yazarlar granülasyonların sinir-bağışıklık görevleri olabileceğini öne sürer (Shah ve ark., 2023). Bir başka öneriye göre granülasyonlar, sert zar ile beyin arasında antijenleri tutan yapışkan cepler olabilir. Bu cepler lenf düğümüne benzer biçimde çalışabilir (Joost ve ark., 2026). Bunlar öneridir; kanıtlanmış değildir.

**Sinüse doğrudan açılmayanlar.** Yağmurlu ve arkadaşları 8 kadavra başında granülasyonları ikiye ayırdı: sert zarın yaprakları içinde kalanlar (intradural) ve sert zardan ayrı duranlar (interdural). Baş başına ortalama 6 ± 1,30 intradural granülasyon vardı (Yağmurlu ve ark., 2022). Granülasyonlar, lakünler ve korteks toplardamarlarından üst sagital sinüse açılan ağızların sayısı baş başına 45 ± 5,62 idi (Yağmurlu ve ark., 2022). Bazı intradural granülasyonlar sinüse doğrudan açılmıyordu. Lenf işaretleriyle (Lyve-1, podoplanin) boyanan, sert zarın içindeki kanallarla toplardamar dolaşımına bağlanıyordu (Yağmurlu ve ark., 2022).

**Yaşlı beyinde.** Ölüm sonrası 882 beyin örneğinde granülasyonların biçimi incelendi. Ortalama ölüm yaşı 90,62 idi (Mehta ve ark., 2026). Granülasyon sayısı, beyindeki β-amiloid ve nörofibriler yumak birikimleriyle ters ilişkiliydi. Olasılık oranları sırasıyla 0,79 ve 0,84 idi (Mehta ve ark., 2026). Böyle bir ilişki, nedeni tek başına göstermez.

Yağmurlu ve arkadaşlarının çalışması yalnızca özetinden okundu.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Dev granülasyon.** “Dev” granülasyonun ortak bir tanımı yoktur. Bazı yazarlar en büyük boyutu 1 cm’yi aşanlara, bazıları yaklaşık 10 mm olanlara bu adı verir (Mehta ve Mehta, 2023). Bazıları ise sinüsü tıkayanları dev sayar (Mehta ve Mehta, 2023). Mehta ve Mehta’nın sistematik derlemesine göre literatürde 169 kişide 195 dev granülasyon bildirildi. Kişilerin yaşı 0,33 ile 91 arasındaydı (ortalama 43 ± 20); %54’ü kadındı (Mehta ve Mehta, 2023). Granülasyonlar 0,4–6 cm büyüklükteydi (ortalama 1,9 ± 1,1 cm). %84’ü sinüsün içinde, %15’i kemiğin süngerimsi katında (diploe) idi (Mehta ve Mehta, 2023). Otopsi çalışmaları ergen ve erişkinlerin %3,68–20’sinde dev granülasyon bulur. Canlı insanda gerçek sıklık bilinmiyor (Mehta ve Mehta, 2023).

**Beyin dokusu granülasyona fıtıklaşabilir.** Bazı kişilerde komşu beyin dokusu granülasyonun içine doğru uzanır. Buna beyin dokusunun araknoid granülasyona fıtıklaşması denir; İngilizce kısaltması BHAG’dir. Ankara’dan Ozer ve arkadaşları 695 hastanın ince kesitli 3 teslalık MR’ını (3B-DRIVE) inceledi. Hastaların %7,3’ünde (51) arka çukurda bu fıtıklaşma vardı (Ozer ve ark., 2025). Fıtıklaşan doku %47,1 beyincik, %45,1 şakak lobu ve %17,6 art kafa lobu dokusuydu (Ozer ve ark., 2025). Bu hastaların %25,5’inde fıtıklaşan dokuda hasar vardı (Ozer ve ark., 2025). Olguların %40’ı alışılmış MR dizilerinde görülemiyordu (Ozer ve ark., 2025).

Kulakta nabızla eş zamanlı bir uğultu duyulabilir; buna pulsatil kulak çınlaması denir. Bu yakınması olan 262 hastanın 16’sında (%6) toplam 18 fıtıklaşma bulundu (Smith ve ark., 2022). Bu 16 hastanın 11’inde (%69) fıtıklaşma tek yanlıydı. Şakak ya da art kafa lobundan, enine sinüse ya da enine-sigmoid birleşimine doğruydu (Smith ve ark., 2022). Fıtıklaşması olanlarda nedeni bilinmeyen kafa içi basınç artışı belirgin biçimde daha sıktı. Olasılık oranı (OR) 4,2 idi (Smith ve ark., 2022).

Denizli’den Kiroglu ve arkadaşları, baş ağrısı ve baş dönmesi olan bir erkekte üst sagital sinüste dev bir granülasyon bildirdi. Sinüs içinde ölçülen basınç, lezyonun iki yanında belirgin farklıydı (Kiroglu ve ark., 2008).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den çalışmalar: granülasyonlar ve beyin fıtıklaşması',
      sutunlar: ['Nerede, kimler?', 'Yöntem', 'Ne buldu?'],
      satirlar: [
        [
          'Ankara; sinüs içi granülasyonu olan 300 hasta, yaş 44,99 ± 15,81 (Kaplanoğlu ve ark., 2023)',
          'Kontrastlı, ince kesitli 3B T1 MR',
          '889 granülasyon; 8 hastada (%2,7) beyin fıtıklaşması; yaşla büyüklük (r = 0,181) ve sayı (r = 0,207) zayıf ama anlamlı arttı',
        ],
        [
          'Ankara; 695 hasta (Ozer ve ark., 2025)',
          '3 tesla 3B-DRIVE MR',
          'Arka çukurda %7,3 fıtıklaşma; %40’ı alışılmış dizilerde görülmüyor; %25,5’inde doku hasarı',
        ],
        [
          'Erzurum; 18 yaş altı 2320 hasta (Sade ve ark., 2019)',
          '3 tesla MR',
          '135 hastada (%5,81) enine sinüste granülasyon; bunların 15’inde beyin fıtıklaşması',
        ],
        [
          'Erzurum; 45 dev granülasyon (Ogul ve ark., 2019)',
          '3 tesla, yüksek çözünürlüklü 3B MR dizileri',
          'En sık yer iki enine sinüs; %22,2’sinde fıtıklaşma; %73,3’ünde içine giren merkezi toplardamar; 32’sinde sıvı sinyali T1 ve FLAIR’de BOS’tan farklı',
        ],
        [
          'Denizli; tek hasta (Kiroglu ve ark., 2008)',
          'Sinüs içi basınç ölçümü',
          'Üst sagital sinüste dev granülasyon; iki yanında belirgin basınç farkı',
        ],
        [
          'İstanbul; orta hatta epidural kanaması olan 9 hasta (Güçlü ve ark., 2022)',
          '2013–2018 ameliyat serisi',
          'Hepsinde kanama kaynağı, üst sagital sinüs duvarında ya da bir granülasyonda yırtık',
        ],
      ],
      not: 'Kaplanoğlu, Ozer ve Güçlü çalışmaları tam metinden; Sade, Ogul ve Kiroglu çalışmaları yalnızca özetinden okundu. Ogul ve arkadaşlarının serisinde 3B T2 SPACE dizisinde granülasyon içinde sinyal boşluğu %62,2 oranında görüldü (Ogul ve ark., 2019).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Granülasyon da kanayabilir',
      md: `İstanbul’da 2013–2018 arasında ameliyat edilen, orta hatta epidural kanaması olan 9 hasta incelendi. Hepsinde kanamanın kaynağı üst sagital sinüsün duvarında ya da bir araknoid granülasyonda yırtıktı (Güçlü ve ark., 2022). Sinüsü korumak için sinüsün üstünde 3 cm genişliğinde bir kemik şerit bırakıldı. Her yarımkürenin üstünden ayrı bir kemik kapağı kaldırıldı (Güçlü ve ark., 2022).

Granülasyonlar sinüs duvarıyla sınırlı kalmaz. Shah ve arkadaşlarına göre bazılarının tepesi kemiğin süngerimsi katında ya da sert zarın dışında yer alır (Shah ve ark., 2023). Dev granülasyonların %15’i de kemiğin süngerimsi katındadır (Mehta ve Mehta, 2023). Epidural kanamanın kendisi “Kanamalar ve fıtıklaşmalar” bölümünde anlatılır.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Kulakta nabız sesi',
      oyku: 'Otuz sekiz yaşında bir kadın, aylardır sağ kulağında nabzıyla birlikte atan bir uğultu duyuyor. Ara sıra baş ağrısı da oluyor. Kontrastlı MR venografide sağ enine sinüste, orta ve dış üçte bir arasında, sınırları belli, yuvarlak bir dolma kusuru görülüyor. Kusurun içi T2’de BOS gibi parlak. İnce kesitli görüntülerde komşu şakak lobu dokusunun bu yapının içine uzandığı seçiliyor. Acil serviste “sinüs trombozu” ön tanısı konmuş.',
      soru: 'Bu görüntü bir pıhtı mı, yoksa başka bir yapı mı, ve ayırt etmek için neye bakılır?',
      cozum:
        'Bulgu büyük olasılıkla dev bir araknoid granülasyondur ve içine beyin dokusu fıtıklaşmıştır. Enine sinüsteki granülasyonlar en sık sinüsün orta ve dış üçte birinin birleştiği yerde görülür. Burası yüzeyel toplardamarların girdiği yerin yakınıdır (Ayaz ve ark., 2017). Tromboz genellikle bir sinüs bölümünün tamamını tutar ve korteks toplardamarlarına uzanabilir. Granülasyon ise odaksal, sınırları belli, düğümsü bir kusur yapar (Ayaz ve ark., 2017). Dev granülasyon subaraknoid boşlukla bağlantılıdır (Mehta ve Mehta, 2023). İçinin sinyali her dizide BOS gibi olmayabilir. Erzurum serisinde 45 dev granülasyonun 32’sinde sinyal T1 ve FLAIR’de BOS’tan farklıydı. Aynı seride %73,3’ünün içine bir merkezi toplardamar giriyordu (Ogul ve ark., 2019). Pulsatil kulak çınlaması olan hastalarda bu fıtıklaşma %6 oranında bulundu. Bu hastalarda nedeni bilinmeyen kafa içi basınç artışı daha sıktı (Smith ve ark., 2022). Dev granülasyon pıhtı sanılırsa gereksiz pıhtılaşma araştırması ve ilaç tedavisi başlanabilir (Mehta ve Mehta, 2023). *Vaka eğitim için kurgulanmıştır.*',
    },

    // ——— Araknoid kist: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Araknoid kist.** Örümcek ağı zarla döşeli, içi BOS dolu, tümör olmayan boşluklara **araknoid kist** denir (Mustansir ve ark., 2018). Birincil (gelişimsel) kistler, rahimdeyken zarın ikiye ayrılmasından doğar. İkincil kistler ise travma, ameliyat, enfeksiyon ya da kanamadan sonra görülür (Mustansir ve ark., 2018).

Gelişimde ilkel zar önce boşluklanır; yani içinde sıvı dolu küçük boşluklar açılır. Bu evrede zarın ikilenmesi ya da zarların kaynaşamaması birincil kistlere yol açabilir (Zedde ve Pascarella, 2025a). Kistin kenarında zarın ikiye ayrıldığı görülür. Duvarda kalın kollajen katları ve aşırı çoğalmış örümcek ağı zar hücreleri bulunur; trabeküller ise yoktur (Carbone ve Sadasivan, 2021). Kistin nasıl büyüdüğü için üç açıklama önerildi: ozmotik fark, tek yönlü kapakçık gibi çalışan bir düzenek ve duvarın BOS benzeri sıvı yapması (Carbone ve Sadasivan, 2021).

Hipofiz çukurunun üstünde (suprasellar) görülen bir kist türü, delinmemiş Liliequist zarının bir cebi gibi anlaşılabilir. Bu cebe zamanla BOS birikir (Dias ve ark., 2014). Kistlerin sıklığı, belirtileri ve tedavisi “Zar iltihapları, tümörler ve basınç bozuklukları” bölümündedir. Kistin komşu sisternalarla bağlantısını MR ile araştıran çalışmalar o bölümde Uzman düzeyinde anlatılır.`,
    },
  ],
};
