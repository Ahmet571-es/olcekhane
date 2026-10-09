import type { DersBolumu } from '../../../types';

/** Kesecikler ve boşlukları için renkler (yalnızca tanıtır, anlam taşımaz). */
const UC_BEYIN = '#5b84f2';
const ARA_BEYIN = '#25b9a3';
const ORTA_BEYIN = '#a98cf6';
const METENSEFALON = '#f2b544';
const MIYELENSEFALON = '#ee6a92';
/** Dördüncü karıncık iki keseciğin (metensefalon ve miyelensefalon) ortak boşluğudur. */
const ARKA_BEYIN_BOSLUGU = '#f08a4b';

/** 7. bölüm: sinir borusundan beyne; nörülasyon, kesecikler, bükümler, plaklar, nöral krista, nöral tüp defektleri ve folik asit. */
export const gelisim: DersBolumu = {
  id: 'sinir-borusundan-beyne',
  baslik: 'Sinir borusundan beyne: sinir sistemi nasıl oluşur?',
  bloklar: [
    {
      tur: 'metin',
      md: `Sinir sistemi, embriyonun ilk haftalarında kurulmaya başlar. Döllenmeden 16 gün sonra embriyonun hücreleri üç gruba ayrılmıştır. Bu gruplara **germ yaprağı** denir; bedenin bütün dokuları bunlardan yapılır. En dıştaki yaprak **ektodermdir**. Ektoderm hem deriyi hem de sinir sistemini yapar (OpenStax 13.1). Gray, sinir sisteminin tamamını, gliası dahil, ektodermden türetir (Gray, 1918). Bugün bunun bir istisnası olabileceği düşünülür. **Mikroglia**, merkezî sinir sisteminin yerleşik makrofajlarıdır; yani artıkları ve yabancı maddeleri yutan hücreleridir. Mikroglia büyük olasılıkla mezodermden, yani orta yapraktan gelir (Waymire, 2026). OpenStax de benzer bir şey yazar. Ona göre mikroglia, erken gelişimde merkezî sinir sistemine katılan akyuvarlardan (makrofajlardan) gelebilir. Ama kökeni kesin olarak belirlenmemiştir (OpenStax 12.2).

Sinir sisteminin oluşumu, döllenmeden sonraki 3. ve 4. haftalarda başlar. İlk olay **nöral indüksiyondur**. Bu olayda ektoderm ikiye ayrılır: sinir dokusunu yapacak **nöroektoderm** ve deriyi yapacak **yüzey ektodermi** (Catala, 2021).

Sonra moleküler sinyaller devreye girer. Bu sinyallerle nöroektodermdeki hücreler nöroepitele dönüşür; nöroepitel sinir dokusunun öncüsüdür. Böylece bir levha oluşur: **nöral plak** (OpenStax 13.1). Hücreler biçim değiştirdikçe plak içeri doğru katlanır. Sırt boyunca bir çizgi gibi uzanan bir oluk belirir: **nöral oluk**. Oluğun iki yanındaki kabarık kenarlara **nöral kıvrım** denir. Kıvrımlar orta hatta buluşup birleşir. Böylece ektodermin hemen altında içi boş bir boru oluşur: **sinir borusu** ya da **nöral tüp** (OpenStax 13.1). Plaktan boruya giden bu sürece **nörülasyon** denir. Borunun ön ucu beyni, arka bölümü omuriliği yapar (OpenStax 13.1).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İndüksiyondan nörülasyona.** İnsan embriyosunun üçüncü haftasındaki ana olay **gastrülasyondur**. Bu süreçte üç germ yaprağı oluşur: ektoderm, mezoderm ve endoderm (Isaković ve ark., 2022). Ardından nöral indüksiyon gelir. Bu adım ilkel ektodermi ikiye ayırır: nöroektoderm ve yüzey ektodermi. Nöral plak, nöroektodermden gelişir. Merkezî sinir sistemini ve çevresel sinir sisteminin büyük kısmını yapar. Yüzey ektodermi ise derinin dış katını (epidermis) oluşturur. Ayrıca iki yere katkı verir: baş bölgesindeki çevresel sinir sisteminin bazı öğelerine ve ağız ile burun epiteline (Catala, 2021).

Borunun karın–sırt (ventral–dorsal) düzeni karşıt sinyallerle kurulur. Plağın altında **notokord** adlı bir çubuk vardır. Notokorddan Shh gibi sinyaller gelir. Bu sinyaller dokuyu güçlü biçimde karın tarafına özgü bir gelişime iter (ventralleştirici etki). Yüzey ektodermi ve alttaki mezoderm ise BMP adlı sinyaller salgılar. BMP’ler, boru kapanırken sırt bölümlerinin farklılaşmasını etkiler (Isaković ve ark., 2022). Notokord önce borunun karın tarafındaki orta şeridin oluşmasını tetikler (indükler). Bu şeride **taban plağı** denir. Notokord, tavan plağından gelen sinyallerle birlikte öteki boylamsal bölgelerin yerini de dolaylı olarak belirler (Puelles, 2024).

Gray, gelişen borunun duvarında üç tabaka ayırt eder: içte **ependimal**, ortada **manto** ve dışta **marjinal** tabaka. Manto tabakası, omuriliğin ileride oluşacak gri kolonlarının tamamını temsil eder (Gray, 1918). Gray tüp duvarını bir “sinsityum” olarak anlatır. Sinsityum, hücre sınırları kaybolmuş, çok çekirdekli tek bir kütledir. Bu anlatım eskimiştir. Güncel kaynaklara göre nöral plak tek katlı bir hücre tabakasıdır. Hücreler silindir biçimlidir. Çekirdekleri farklı yüksekliklerde durduğu için tabaka çok katlı gibi görünür (psödostratifiye). Çekirdekler, hücre döngüsü boyunca aşağı yukarı yer değiştirir (interkinetik göç) (Ravi ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'İlk haftaların takvimi',
      sutunlar: ['Zaman', 'Olay', 'Kaynak'],
      satirlar: [
        ['16. gün', 'Embriyonun hücreleri üç germ yaprağına ayrılmıştır', 'OpenStax 13.1'],
        ['3. hafta', 'Gastrülasyon: ektoderm, mezoderm ve endoderm oluşur', 'Isaković ve ark., 2022'],
        ['3.–4. hafta', 'Nöral indüksiyon; sinir sistemi oluşmaya başlar', 'Catala, 2021'],
        ['21.–28. gün', 'Nöral tüp bu günlerde kapanır; kapanmazsa nöral tüp defekti oluşur', 'Çaylan ve ark., 2022'],
        [
          '~24. ve ~26. gün',
          'İç kulağın taslağı (otik plakod) çukurlaşır: önce otik çanak, sonra otik kist oluşur',
          'Zine ve Fritzsch, 2023',
        ],
        ['~25. gün', 'Ön nöropor kapanır; yeri son lamina (*lamina terminalis*) olur', 'Ravi ve ark., 2021'],
        ['~27. gün', 'Arka nöropor kapanır (klasik kaynaklara göre Carnegie evre 12)', 'Ravi ve ark., 2021; Catala, 2021'],
        ['4. haftanın sonu', 'Birincil nörülasyon tamamlanır', 'Santos ve ark., 2024'],
        ['Carnegie evre 13’ten (~28. gün) itibaren', 'İkincil nörülasyon: omuriliğin en alt ucu oluşur', 'Santos ve ark., 2024'],
        [
          '3. haftadan 5. haftanın sonuna',
          'Boyun bükümü (servikal büküm) artar; arka beyin omurilikle neredeyse dik açı yapar',
          'Gray, 1918',
        ],
        [
          '4., 12. ve 16. hafta (sayılış biçimi belirtilmemiş)',
          'Sırasıyla nöron üretimi (nörogenez), sinaps oluşumu ve miyelinlenme başlar; başka kaynaklar farklı haftalar verir (bkz. not)',
          'AlRayahi ve ark., 2026',
        ],
        [
          '5. hafta (sayılış biçimi belirtilmemiş) → 2 yaş',
          'Beyincik gelişmeye başlar; farklılaşması iki yaşına kadar sürer',
          'AlRayahi ve ark., 2026',
        ],
        ['3., 6. ve 8. ay', 'Büyüyen yarımküreler sırasıyla ara beyni, orta beyni ve arka beyni örter', 'Gray, 1918'],
        ['6.–7. ay', 'Kabuğun kıvrım ve oluklarının çoğu belirir', 'Gray, 1918'],
      ],
      not: 'Haftalar iki farklı biçimde sayılır. Embriyoloji kaynakları döllenmeden sonraki günleri ve haftaları sayar (Catala, 2021; Santos ve ark., 2024; Çaylan ve ark., 2022). Gebelik haftası ise çoğunlukla annenin son adet döneminden sayılır. Çünkü döllenmenin zamanını tam belirlemek zordur; son adet onun yerine yaygın olarak kullanılır (Grotheer ve ark., 2023). AlRayahi ve ark. (2026) haftaları “gebelik haftası” (*weeks of gestation*) diye verir. Ama hangi biçimde saydığını belirtmez. Bu yüzden o satırları ötekilerle doğrudan karşılaştırma. Sinaps oluşumunun ve miyelinleşmenin başladığı hafta da kaynaktan kaynağa değişir. Bir derlemeye göre ilk miyelin omurilikte gebeliğin 12–14. haftasında belirir (Buyanova ve Arsalidou, 2021). Bir başkasına göre sinaps oluşumu gebeliğin ortasında, miyelinleşme ise gebeliğin son döneminde başlar (Khartabil ve ark., 2026). Bu iki kaynak da haftaların nasıl sayıldığını belirtmez. Gray (1918) satırlarındaki haftalar ve aylar, o dönemin yaşlandırma yöntemine dayanır. Örneğin Gray ön nöroporun “üçüncü haftanın sonuna doğru” kapandığını yazar; güncel değer ise ~25. gündür. Gray’in bu satırları güncel bir kaynakla karşılaştırılamadı. Onları tarihsel bilgi olarak oku.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Birincil ve ikincil nörülasyon.** Kıvrımlar birleşerek boruyu yapar; buna **birincil nörülasyon** denir. Nöral tüpün iki ucunda bir süre birer açıklık kalır: **ön** ve **arka nöropor**. Tüp bu açıklıklarla amniyon boşluğuna açılır (Ravi ve ark., 2021). Ön nöropor yaklaşık 25. günde kapanır ve **son lamina** (*lamina terminalis*) olur. Arka nöropor yaklaşık 27. günde kapanır. Kapanmazsa borunun alt ucunda nöral tüp defekti oluşur (Ravi ve ark., 2021). Catala klasik kaynakları da aktarır. Onlara göre arka nöropor Carnegie evre 12’de kapanır (Catala, 2021). Carnegie evreleri, embriyoyu görünüşüne göre basamaklara ayıran bir sıralamadır. İnsanda birincil nörülasyon, döllenmeden sonraki 4. haftanın sonunda tamamlanır (Santos ve ark., 2024).

Nöropor kapandığında omurilik henüz tamamlanmamıştır. En alt (kaudal) ucu başka bir yolla oluşur: **ikincil nörülasyonla** (Catala, 2021). İki yol arasındaki fark şudur. Birincil nörülasyonda boru, kıvrımların kapanmasıyla oluşur. İkincil nörülasyonda ise boru, içinde boşluk açılmasıyla oluşur (**kanalizasyon**) (Santos ve ark., 2024). Bu ayrımın klinikte karşılığı vardır. Açık spina bifida (miyelomeningosel) çoğunlukla bel ve üst sağrı düzeylerinde görülür. Birincil borunun kapanma kusurundan doğar. Deriyle örtülü “disrafik” durumlar ise alt sağrı ve kuyruk sokumu düzeylerinde görülür. Disrafik, orta hatta tam kapanmamış demektir. Bu durumlar ikincil nörülasyonun bozulmasından kaynaklanır; bu süreç boruyu nöral kıvrım oluşmadan yapar (Santos ve ark., 2024).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Boru nasıl kapanır?** Nöral tüpün kapanmasında birçok şey birlikte çalışır. Önce hücrelerin kendi davranışları vardır:

- Doku bir yönde daralır, öteki yönde uzar (yakınsamalı uzama).
- Hücrelerin üst yüzü büzülür (apikal daralma).
- Çekirdekler hücre içinde aşağı yukarı yer değiştirir (interkinetik göç).

Bunun için bazı sinyal yolları da gerekir: kanonik olmayan Wnt/düzlemsel hücre polaritesi yolu ve Shh/BMP sinyali. Ayrıca bazı transkripsiyon etkenleri, yani genleri açıp kapatan proteinler gerekir: Grhl2/3, Pax3, Cdx2, Zic2 gibi (Ravi ve ark., 2021). Kapanma nereden başlar? Gray’e göre kıvrımlar önce arka beyin bölgesinde birleşir. Kapanma oradan öne ve arkaya ilerler (Gray, 1918). Güncel bir derlemeye göre ise insanda en az dört bölge vardır. Bu bölgelerde kapanma aynı anda, fermuar gibi sürer (Isaković ve ark., 2022).

Santos ve arkadaşları Carnegie evre 10–18 arasındaki 108 insan embriyosunu inceledi. Evre 12’de arka nöropor kapanırken plak üç noktadan bükülüyordu. Biri, notokordun üstündeki orta menteşe noktasıydı. Ötekiler, iki yandaki sırt-yan (dorsolateral) menteşe noktalarıydı. Bu, faredeki “2. tip” omurilik nörülasyonunun doğrudan karşılığıdır. Arka nöropor giderek kısalır. Kapanma yaklaşık 30 somit evresinde tamamlanır. Somitler, nöral tüpün iki yanında sırayla beliren doku bloklarıdır. Embriyoların çoğunda nöropor evre 13’te kapalıydı; bu, döllenmeden yaklaşık 28 gün sonrasıdır. İnsanda yaklaşık her 7 saatte bir somit oluşur, farede ise her 2 saatte bir. İkincil nörülasyon evre 13’ten itibaren tek bir boşlukla (lümen) ilerliyordu, faredeki gibi. Civcivdeki gibi birden çok boşluğun birleşmesiyle ilerlemiyordu. Birincilden ikincile bir “geçiş bölgesi”ne dair kanıt da yoktu (Santos ve ark., 2024).

İnsandaki veriler yine de tartışmalıdır. Catala’ya göre insan verileri yalnızca tanımlayıcıdır ve birbiriyle çelişir. Alt uçtaki (kaudal) malformasyonların nasıl oluştuğunu bu verilerle açıklarken çok dikkatli olmak gerekir. Catala bir şey daha yazar: birincil ve ikincil boruların boşlukları (lümenleri) oluşurken kesintisizdir. Alttaki boşluk ayrıca öne doğru açılmaz (Catala, 2021). Civcivde hücreleri işaretleyen çalışmalar da vardır. Bu veriler insana uyarlanınca iki borunun birleşim yeri bir aralıkta değişir: alt göğüs ile üst sağrı omurilik bölümleri arasında. İkincil nörülasyonun erken döneminde bir hasar olursa medüller kord hiç oluşmaz (Yang ve ark., 2021). Medüller kord, ikincil nörülasyonda içinde boşluk açılacak olan hücre çubuğudur. Ravi ve arkadaşları ikincil nörülasyon için 45–53. günleri verir. Bu günler, insan embriyolarındaki bu doğrudan gözlemlerle uyuşmaz. Bu yüzden bu derste kullanılmadı.`,
    },
    {
      tur: 'metin',
      md: `Borunun ön ucu genişler. Önce üç kabarcık belirir; bunlara **birincil kesecik** (vezikül) denir:

- **ön beyin** (*prosencephalon*),
- **orta beyin** (*mesencephalon*),
- **arka beyin** (*rhombencephalon*).

Sonra üç kesecik beşe çıkar:

- Ön beyin ikiye ayrılır: **uç beyin** (*telencephalon*) ve **ara beyin** (*diencephalon*).
- Orta beyin daha ince bölümlere ayrılmaz.
- Arka beyin de ikiye ayrılır: **metensefalon** (*metencephalon*) ve **miyelensefalon** (*myelencephalon*) (OpenStax 13.1).

Yetişkin beynin bütün büyük bölümleri bu beş keseciğe kadar izlenebilir. Ara beyinden talamus ve hipotalamus gelişir. Metensefalondan pons ve beyincik gelişir. Orta beyin, pons ve omurilik soğanına birlikte **beyin sapı** (*truncus encephali*) denir (OpenStax 13.1).

Boru içi boş olduğu için beynin içinde de boşluklar kalır. Beynin **karıncıkları** (ventriküller), nöral tüpün iç boşluğunun kalıntısıdır (OpenStax 13.1). Borunun duvarında da bir düzen kurulur. Sırt tarafındaki dokular duyu işleriyle ilişkili olur. Karın tarafındakiler ise hareket işleriyle ilişkili olur (OpenStax 13.1). Kıvrımların kenarından bir hücre topluluğu ayrılır ve borunun iki yanına yerleşir: **nöral krista** (OpenStax 13.1). Bu hücreler göç edebilir. Çok yönlü bir kök hücre topluluğudur; yani birçok farklı hücre türüne dönüşebilir (Mehrotra ve ark., 2020). Çevresel sinir sisteminin gangliyonlarından yüzün kemiklerine kadar pek çok dokuyu yapar (Simões-Costa ve Bronner, 2013).`,
    },
    {
      tur: 'tablo',
      baslik: 'Üç kesecikten yetişkin beyne',
      sutunlar: ['Birincil kesecik', 'İkincil kesecik', 'Yetişkindeki karşılığı', 'İçindeki boşluk'],
      satirlar: [
        ['Ön beyin (*prosencephalon*)', 'Uç beyin (*telencephalon*)', 'Büyük beyin (iki yarımküre)', 'Yan karıncıklar'],
        ['Ön beyin (*prosencephalon*)', 'Ara beyin (*diencephalon*)', 'Talamus, hipotalamus; göz çanağından retina', 'Üçüncü karıncık'],
        ['Orta beyin (*mesencephalon*)', 'Orta beyin (bölünmez)', 'Orta beyin', 'Orta beyin su yolu'],
        ['Arka beyin (*rhombencephalon*)', 'Metensefalon (*metencephalon*)', 'Pons ve beyincik', 'Dördüncü karıncık'],
        ['Arka beyin (*rhombencephalon*)', 'Miyelensefalon (*myelencephalon*)', 'Omurilik soğanı', 'Dördüncü karıncık'],
        ['Borunun arka bölümü', '—', 'Omurilik', 'Merkezî kanal'],
      ],
      not: 'Kaynak: OpenStax 13.1. Beyincik metensefalondan gelişir, ama beyin sapına sayılmaz. Beyin sapı; orta beyin, pons ve omurilik soğanıdır.',
    },
    {
      tur: 'sahne',
      baslik: 'Beş keseciğin bugünkü yeri',
      aciklama:
        'Beynin sağ yarısı kaldırıldı. Sol yarıya içeriden, orta hattan bakıyoruz; ön taraf sağda. Her yapı, geldiği keseciğin renginde. Mavi uç beyindir: büyük beyin ve yan karıncık. Turkuaz ara beyindir: talamus, hipotalamus ve üçüncü karıncık. Mor orta beyindir; orta beyin su yolu da buna dahil. Sarı metensefalondur: pons ve beyincik. Pembe miyelensefalondur: omurilik soğanı. Turuncu dördüncü karıncıktır; arka beynin iki keseciğinin ortak boşluğudur. Beyin sapı ile ön beyin arasındaki belirgin açıya dikkat et. Yetişkin beyninin ekseni burada kırılır. Hipofiz bezi gizlendi, çünkü ön bölümü başka bir kökenden gelir.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'karincik'],
        renk: 'bolge',
        gizle: ['bolge:sinir', 'hipofiz', 'karinciklar-arasi-delik'],
        yarim: 'sol',
        bakis: 'ic-sol',
        boya: [
          { secici: ['bolge:serebrum', 'yan-karincik'], renk: UC_BEYIN },
          { secici: ['bolge:diensefalon', 'ucuncu-karincik'], renk: ARA_BEYIN },
          { secici: ['orta-beyin', 'serebral-pedinkul', 'ust-tepecik', 'alt-tepecik', 'beyin-su-yolu'], renk: ORTA_BEYIN },
          { secici: ['pons', 'beyincik'], renk: METENSEFALON },
          { secici: ['omurilik-sogani'], renk: MIYELENSEFALON },
          { secici: ['dorduncu-karincik'], renk: ARKA_BEYIN_BOSLUGU },
        ],
        etiketler: [
          { yapi: 'singulat-girus-sol', metin: 'Uç beyin' },
          { yapi: 'talamus-sol', metin: 'Ara beyin' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'beyincik', metin: 'Metensefalon: beyincik' },
          { yapi: 'pons', metin: 'Metensefalon: pons' },
          { yapi: 'omurilik-sogani', metin: 'Miyelensefalon' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Ektoderm → nöral plak → nöral oluk ve kıvrımlar → nöral tüp.** Borunun ön ucu beyin, arka bölümü omurilik olur.\n\n**3 kesecik → 5 kesecik:** ön beyin → uç beyin + ara beyin; orta beyin → orta beyin; arka beyin → metensefalon + miyelensefalon.\n\n**Borunun boşluğu → karıncıklar ve merkezî kanal.** Sırt tarafı duyu, karın tarafı hareket. Kıvrımların kenarından **nöral krista** ayrılır.\n\nBoru **4. haftada** kapanır. Kapanmazsa **nöral tüp defekti** oluşur.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yüzündeki kemiklerin büyük bölümü, beynin doğduğu yerin hemen yanından gelir. Kafa bölgesindeki **nöral krista** hücreleri yüz iskeletinin büyük bölümünü yapar. Pigment hücrelerini de bunlar yapar (Simões-Costa ve Bronner, 2013). Nöral krista bu kadar çok dokuya kaynaklık eder. Bu yüzden sık sık “dördüncü germ yaprağı” diye anılır (Mehrotra ve ark., 2020).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Keseciklerin ayrışması.** Ön beyin genişlerken orta hattında yoğun bir hücre ölümü olur. Bu ölüm, hücrenin kendi programıyla gerçekleşir (programlı hücre ölümü, apoptoz). Sonunda kesecik ikiye bölünür ve uç beyni ve ara beyni verir (AlRayahi ve ark., 2026). Ara beyinden talamus ve hipotalamus gelişir. Embriyonik ara beyinde bir de **göz çanağı** belirir; ileride retinaya dönüşür (OpenStax 13.1). Arka beyin metensefalona ve miyelensefalona ayrılır. Metensefalon pons ve beyinciği, miyelensefalon da omurilik soğanını yapar (OpenStax 13.1; AlRayahi ve ark., 2026).

Uluslararası anatomi terimleri listesine Terminologia Anatomica denir. Bu liste arka beyni “miyelensefalon + metensefalon” diye tanımlar. *Myelencephalon* terimini de omurilik soğanının (*medulla oblongata*) eş anlamlısı olarak verir. Aynı listede *prosencephalon*, yetişkindeki *cerebrum*’un eş anlamlısıdır. Buradaki *cerebrum*, uç beyin ile ara beynin toplamıdır (FIPAT, 2019). Bu yüzden “serebrum” sözcüğü kaynaktan kaynağa farklı kapsamda kullanılır. Örneğin OpenStax’in tablosunda yalnızca uç beyni karşılar (OpenStax 13.1).

Gray’e göre yarımküreler büyüdükçe geriye doğru taşar. Üçüncü ayda ara beyni, altıncı ayda orta beyni, sekizinci ayda arka beyni örter. Kabuğun kıvrım ve oluklarının çoğu, fetal yaşamın altıncı ya da yedinci ayında belirir. Yarımküreleri birbirine bağlayan büyük lif köprüleri de son laminadan gelişir: korpus kallozum, forniks ve ön komissür (Gray, 1918). Bu aylar, Gray’in dönemindeki yaşlandırma yöntemine dayanır. Burada güncel bir kaynakla karşılaştırılamadı. Bu konuları Anatomi bölümünün **Beyin nasıl oluşur?** dersinde ayrıntılı göreceğiz.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Üç büküm ve karıştırılan bir ad',
      md: `Gelişen tüp aynı dönemde üç yerden bükülür:

- **Sefalik büküm:** ön beyin ile beyin sapı arasında.
- **Servikal büküm:** omurilik soğanı ile omuriliğin birleştiği yerde.
- **Pontin büküm:** dördüncü karıncığa biçimini verir (AlRayahi ve ark., 2026).

Gray’e göre ilk büküm orta beyin bölgesinde belirir (ventral sefalik büküm). Gray’in eski yaşlandırmasına göre servikal büküm üçüncü haftadan beşinci haftanın sonuna kadar artar. Bu tarih güncel bir kaynakla karşılaştırılamadı. Bu sırada arka beyin omurilikle neredeyse dik açı yapar. Pontin büküm ise ötekilerden farklıdır: öne doğru dışbükeydir ve başın biçimini etkilemez (Gray, 1918). Pontin büküm oluşurken alar plaklar, yani borunun sırt tarafındaki şeritler, birbirinden ayrılmaya başlar. Borunun kanalı da dördüncü karıncığa dönüşür (AlRayahi ve ark., 2026).

**Bu adı karıştırma:** OpenStax, yetişkin beyninde beyin sapı ile ön beyin arasındaki belirgin eğime de “sefalik büküm” der (OpenStax 13.1). Bu, yetişkindeki eksenin kırıldığı yerdir. Onu embriyodaki bükümle aynı şey sanma. Bu kırılmanın yön terimlerini nasıl değiştirdiğini bir sonraki derste (Anatominin dili) göreceğiz.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Borunun boşluğu: karıncık sistemi',
      aciklama:
        'Beyin ve beyin sapı yarı saydam. Önden, soldan ve yukarıdan bakıyoruz. İçerideki karıncıklar, geldikleri keseciğin rengiyle boyandı. Mavi yan karıncıklar uç beynin boşluğudur. Turkuaz üçüncü karıncık ara beynin, mor orta beyin su yolu orta beynin boşluğudur. Turuncu dördüncü karıncık da arka beynin boşluğudur. Hepsi bir zamanlar tek bir borunun içindeki kesintisiz kanaldı. Omurilik ve onun merkezî kanalı modelde yoktur.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'karincik'],
        renk: 'bolge',
        saydam: ['katman:kabuk', 'katman:sap'],
        gizle: ['bolge:sinir', 'karinciklar-arasi-delik'],
        vurgula: ['katman:karincik'],
        boya: [
          { secici: ['yan-karincik'], renk: UC_BEYIN },
          { secici: ['ucuncu-karincik'], renk: ARA_BEYIN },
          { secici: ['beyin-su-yolu'], renk: ORTA_BEYIN },
          { secici: ['dorduncu-karincik'], renk: ARKA_BEYIN_BOSLUGU },
        ],
        bakis: 'egik',
        etiketler: [
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık: uç beyin' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık: ara beyin' },
          { yapi: 'beyin-su-yolu', metin: 'Su yolu: orta beyin' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık: arka beyin' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Karıncıklar nereden gelir?** Nöral tüpün boşluğu sonradan iki şeye dönüşür: beynin karıncıklarına ve omuriliğin merkezî kanalına (*canalis centralis*) (Gray, 1918). Dört karıncık ve onlara bağlı kanallar, embriyonik beynin içindeki bu boşluğa kadar izlenebilir:

- Uç beynin boşluğu yan karıncıklardır (*ventriculus lateralis*).
- Ara beyninki üçüncü karıncıktır (*ventriculus tertius*).
- Orta beyninki orta beyin su yoludur (*aquaeductus mesencephali*).
- Arka beyninki dördüncü karıncıktır (*ventriculus quartus*).
- Borunun arka bölümününki merkezî kanaldır (OpenStax 13.1; Gray, 1918).

Gray’in tablosu dördüncü karıncığı üç kısma böler. Alt kısmı miyelensefalona, ara kısmı metensefalona aittir. Üst kısmı ise arka beynin boğumuna (*isthmus rhombencephali*) aittir (Gray, 1918). Karıncıkların ayrıntısını Anatomi bölümünün **Karıncıklar ve beyin-omurilik sıvısı** dersinde göreceğiz.

**Alar ve bazal plak.** Wilhelm His (1891, 1893) önemli bir düzen gösterdi. Merkezî sinir sisteminin yan duvarları boydan boya iki uzun şeritten (boylamsal plak) oluşur. Karın tarafındakine **bazal plak**, sırt tarafındakine **alar plak** denir. His’e göre bazal plak birincil hareket merkezlerini içerir. Alar plak ise birincil duyu merkezlerini içerir. İkisinin sınırını karıncık yüzündeki bir oluk çizer: **sınır oluğu** (*sulcus limitans*) (Nieuwenhuys, 2011). Gray de buna benzer yazar. Kanalın en geniş yerinde yan duvar ikiye ayrılır: sırtta alar, karında bazal lamina (Gray, 1918).

Omurilikte bu düzen yetişkinde de okunur. Bazal plak karın tarafında, orta hatta yakındır ve hareket nöronlarını verir. Alar plak sırt taraftadır. Çevreden duyu girdisi alacak nöronları yapar (OpenStax 13.2). Alar plak daha sonra beyinciği de oluşturur (AlRayahi ve ark., 2026). Pontin büküm oluşurken alar plaklar birbirinden ayrılır. Kanal da dördüncü karıncığa dönüşür (AlRayahi ve ark., 2026). Yetişkinde dördüncü karıncığın tabanında bir sınır oluğu görülür. Bu oluk, alar ve bazal laminayı ayıran oluğun kalıntısıdır (Gray, 1918). Omurilik soğanında bazal laminanın hareket nöronları farklı dizilir. Omurilikteki gibi sürekli bir sütun oluşturmazlar; ayrı çekirdekler hâlinde dururlar (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Nöral krista ve kafa plakodlarının türevleri',
      sutunlar: ['Köken', 'Başlıca türevleri', 'Kaynak'],
      satirlar: [
        [
          'Kafa (kraniyal) nöral kristası',
          'Yüz iskeletinin büyük bölümü; kafa gangliyonları; düz kas; pigment hücreleri',
          'Simões-Costa ve Bronner, 2013',
        ],
        [
          'Vagal nöral krista',
          'Kalp kapakçıklarına ve bölmelerine katkı; bağırsağın sinir sistemi (enterik sinir sistemi)',
          'Simões-Costa ve Bronner, 2013',
        ],
        [
          'Gövde nöral kristası',
          'Arka kök (spinal) gangliyonlarının duyu nöronları ve satellit gliası; sempatik gangliyonlar; omurilik sinirleri boyunca Schwann hücreleri; böbrek üstü bezinin kromafin hücreleri; salgı hücreleri ve melanositler (pigment hücreleri)',
          'Simões-Costa ve Bronner, 2013; Mehrotra ve ark., 2020',
        ],
        [
          'Kafa plakodları',
          'Ön hipofiz; koku epiteli; göz merceği; trigeminal, fasiyal, glossofaringeal (petrozal) ve vagus (nodoz) gangliyonlarındaki büyük nöronlar',
          'Zine ve Fritzsch, 2023',
        ],
        ['Otik plakod', 'Çukurlaşarak ~24. günde otik çanağı, ~26. günde otik kisti yapar', 'Zine ve Fritzsch, 2023'],
      ],
      not: 'Nöral plak kapanıp tavan plağını yapar. Nöral krista ve plakodlar o sırada hemen bitişikteki ektodermden gelişir (Zine ve Fritzsch, 2023). Plakod, ektodermde kalınlaşmış küçük bir alandır. Gray (1918) kafa siniri gangliyonlarını da nöral kristaya bağlar. Güncel kaynaklara göre ise bu gangliyonların büyük nöronları plakodlardan gelir. Gray’e göre spinal gangliyonlar nöral kristadan gelişir. Sayıları, kuyruk bölgesi dışında, ilkel segmentlerin sayısına eşittir.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Nöral krista ve ön beyin bozuklukları',
      md: `Nöral krista, omurgalılara özgü bir embriyonik hücre topluluğudur. Kök hücreye benzer özellikler taşır: birçok hücre türüne dönüşebilir (çok yönlülük) ve kendini yenileyebilir (Simões-Costa ve Bronner, 2013). Gelişimindeki bozukluklara **nörokristopati** denir. Kafa-yüz malformasyonlarının büyük çoğunluğundan bunlar sorumludur. Bu grupta 700’den fazla sendrom tanımlanmıştır (Simões-Costa ve Bronner, 2013). Böbrek üstü bezinin iç kısmında kromafin hücreler bulunur. Bu hücreler, sempatik gangliyonlarla birlikte nöral kristadan gelişir. Bu yüzden bez, işlev bakımından bir sempatik gangliyon gibidir (OpenStax 15.1).

Ön beyinde orta hattaki bölünme gerçekleşmeyebilir. O zaman ön beyin iki ayrı yarıya ayrılamaz: **holoprosensefali**. AlRayahi ve arkadaşlarının derlemesi burada iki farklı zaman verir. Metinde bu bölünmeyi gebeliğin 3.–4. haftalarına koyar. Öğretim noktalarında ise holoprosensefaliyi uç beynin 5. haftadaki bölünmesinin aksamasına bağlar. Derleme, haftaların son adetten mi döllenmeden mi sayıldığını da belirtmez (AlRayahi ve ark., 2026). Bu yüzden bu haftaları, bu dersteki döllenme sonrası takvimle doğrudan karşılaştırma (bkz. “İlk haftaların takvimi” tablosunun notu).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Ön nöropor ~25. gün → son lamina; arka nöropor ~27. gün (Ravi ve ark., 2021). Birincil nörülasyon 4. haftanın sonunda biter (Santos ve ark., 2024).
- **Birincil nörülasyon = kapanma, ikincil nörülasyon = kanalizasyon.** Açık spina bifida birincil nörülasyonla ilişkilidir. Deriyle örtülü alt sağrı-kuyruk sokumu disrafizmi ise ikincil nörülasyonla ilişkilidir (Santos ve ark., 2024).
- Uç beyin → yan karıncıklar; ara beyin → 3. karıncık; orta beyin → su yolu; metensefalon (pons, beyincik) ve miyelensefalon (omurilik soğanı) → 4. karıncık; arka tüp → merkezî kanal (OpenStax 13.1).
- Bükümler: sefalik, servikal, pontin. Pontin büküm öne dışbükeydir (Gray, 1918; AlRayahi ve ark., 2026).
- **Bazal plak hareket, alar plak duyu.** Sınırları sınır oluğudur (Nieuwenhuys, 2011).
- Nöral krista: arka kök ve otonom gangliyonlar, Schwann hücreleri, kromafin hücreler, melanositler, yüz iskeleti. Plakodlar: ön hipofiz, koku epiteli, mercek, V, VII, IX ve X gangliyonlarının büyük nöronları (Simões-Costa ve Bronner, 2013; Mehrotra ve ark., 2020; Zine ve Fritzsch, 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sınır oluğu nerede biter? Sütunlardan prosomerlere',
      md: `His’in modelinde gelişen beyin dört uzun şeride (boylamsal plak) ayrılır: taban, bazal, alar ve tavan plakları. Hepsi nöral tüp boyunca paralel uzanır (Puelles, 2024). Herrick ve Johnston beyin sapında her plağı ikiye böldü. Bazal plakta iki hareket sütunu ayırdılar: somatomotor ve visseromotor. Alar plakta da iki duyu sütunu ayırdılar: visserosensitif ve somatosensitif (Nieuwenhuys, 2011). Adlardaki “somato-” beden, “visser-” iç organ demektir.

Sınır oluğunun ne kadar öne uzandığı ise tartışmalıdır. Nieuwenhuys’a göre sınır oluğu, karıncık yüzünde alar ve bazal plağın sınırını gösterir ve arka beyinle (rombensefalon) sınırlıdır. Bu sonuç, 16 anamniyot türünün beyin sapının topolojik analizine dayanır (Nieuwenhuys, 2011). Anamniyotlar, balıklar ve kurbağalar gibi embriyosu amniyon zarı taşımayan omurgalılardır. Puelles ise His’e dayanarak başka bir şey yazar. Ona göre sınır oluğu bükümleri aşarak izlenebilir ve optik kiazmanın yakınında sona erer (Puelles, 2024). Optik kiazma, görme sinirlerinin çaprazlaştığı yerdir. Terminologia Anatomica ise sınır oluğunu yalnızca dördüncü karıncığın tabanında (*fossa rhomboidea*) tanımlar (FIPAT, 2019). Kısacası yetişkinde sınır oluğu dördüncü karıncığın tabanında görülür. Embriyoda ise alar–bazal sınır daha önde de izlenir.

Puelles bir model daha savunur: **prosomerik model**. Bu model, beynin bütün bölümlerini kuran 20 enine gelişim birimi önerir. Bu birimlere **nöromer** denir. Nöromerler bulundukları keseciğe göre adlandırılır: ön beyinde prosomer, orta beyinde mezomer, arka beyinde rombomer, omurilikte miyelomer. Bu modelde uç beyin farklı yorumlanır. Hipotalamusun hp2 prosomerinden dışa doğru çıkan bir kese olarak görülür. Bu kese çift taraflıdır ve sırt tarafından (alar) çıkar. Yani klasik beş kesecik şemasından farklı bir düzen önerilir. Bazal plak bu modelde de esas olarak hareketle ilgili nöronları üretir: motor nöronlar, onlarla ilişkili ara nöronlar ve retiküler motor öğeler (Puelles, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Wilhelm His, rombik dudak ve beyinciğin kökeni',
      md: `Wilhelm His nöral kristayı 1868’de “Zwischenstrang” adıyla tanımladı. Arka beyni ve beyin taslağının temel öğelerini de o tarif etti: taban, bazal, alar ve tavan plakları, sınır oluğu ve istmus gibi (Glover ve Fritzsch, 2022). His, insan embriyosunun arka beyin kesitlerine baktı. Alar plakların uçlarını, dış yüzde (pia tarafında) boylamsal bir oluk sınırlıyordu. His bu uçlara “Rautenlippen”, yani **rombik dudaklar** dedi. Rombik dudağı göçmen hücre topluluklarının kaynağı olarak tanımladı. Pontin çekirdekler, üst ve alt olivler ve koklear çekirdekler bunlara örnektir. His bir şeyi de erken fark etti: fasiyal sinirin genikulat gangliyonu Zwischenstrang’dan gelmiyordu. Bu “visseral gangliyonlar” için farklı bir köken düşündü (Glover ve Fritzsch, 2022). Bugün bu gangliyonların büyük nöronlarının plakodlardan geldiği bilinir (Zine ve Fritzsch, 2023). Gray’in (1918) anlatımı ise kafa siniri gangliyonlarını bütünüyle nöral kristaya bağlar. Bu bakımdan eskimiştir.

Beyincik konusunda ise Gray’in anlatımı güncel anlatımla çelişmez. Gray beyinciği bir yerde kısaca metensefalon tavanının kalınlaşması diye özetler. Ayrıntılı anlatımında ise iki şey yazar. Bu bölgedeki alar laminalar kalınlaşır ve orta hatta kaynaşır. Flocculus ile nodulus da rombik dudaktan gelişir (Gray, 1918). Güncel anlatım da beyinciği alar plağa bağlar. Pontin büküm alar plakları birbirinden ayırır. Ayrılan alar plağın kenarlarından rombik dudaklar yükselir. Bunlar orta hatta kaynaşarak beyincik plağını, sonunda da beyinciği yapar (AlRayahi ve ark., 2026).

Aynı derlemeye göre beyincik 5. haftada gelişmeye başlar. Farklılaşması iki yaşına kadar sürer. Nöron üretimi (nörogenez) 4. haftada başlar ve üçüncü üç aylık döneme kadar büyük ölçüde tamamlanır. Sinaps oluşumu 12. haftada, miyelinlenme 16. haftada başlar ve doğumdan sonra da sürer (AlRayahi ve ark., 2026). Derleme bu haftaları gebelik haftası (*weeks of gestation*) diye verir. Ama son adetten mi döllenmeden mi saydığını belirtmez. Başka kaynaklar sinaps oluşumu ve miyelinleşme için farklı başlangıçlar verir (bkz. “İlk haftaların takvimi” tablosunun notu).

Dördüncü karıncığın alt örtüsünden (alt medüller velum) Blake kesesi gelişir. Bu kese delinir ve karıncığın orta açıklığını açar: Magendie deliği. Bu en erken 10. haftada, çoğunlukla da 24–25. gebelik haftasından önce olur (AlRayahi ve ark., 2026). Omurilik kanalının alt ucunda ise konik bir genişleme bulunur: **son karıncık** (*ventriculus terminalis*) (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `**Boru kapanmazsa.** Nöral tüp, döllenmeden sonraki 21. ile 28. günler arasında kapanır. Kapanma başarısız olursa **nöral tüp defektleri** (NTD) ortaya çıkar (Çaylan ve ark., 2022). NTD’ler sık görülen ve ağır doğumsal anomaliler arasındadır. Yüz binlerce ölüme yol açarlar. Yaşayanlarda da ömür boyu süren engelliliğe neden olurlar (Çaylan ve ark., 2022). Dünya Sağlık Örgütü (DSÖ) en sık görülen ağır doğumsal bozuklukları sayar: kalp defektleri, NTD’ler ve Down sendromu (DSÖ, 2023).

Klasik olarak iki grup vardır. Bir grup beyni etkiler: **anensefali** ve **ensefalosel**. Öteki grup omuriliği etkiler: **spina bifida** biçimleri (Çaylan ve ark., 2022). Anensefalide yalnızca borunun kafa kısmı etkilenir. Ön beyin ve kafatası kubbesi yoktur (Isaković ve ark., 2022). Spina bifidanın üç sınıfı vardır: okülta, meningosel ve miyelomeningosel (OpenStax 13.1). **Spina bifida okültada** omur kemerinde bir açıklık vardır. Ama dışarıya bir fıtıklaşma ya da kese çıkmaz (Isaković ve ark., 2022). **Miyelomeningoselde** ise zarlar dışarı çıkar. Omurilik sinirleri de tutulur; bu yüzden ağır nörolojik belirtiler olabilir (OpenStax 13.1).

Dünyada 2015 yılı için 260.100 NTD’li doğum sonucu tahmin edildi. Bu, 10.000 canlı doğumda 18,6 demekti (Blencowe ve ark., 2018, aktaran Çaylan ve ark., 2022). Türkiye’de ulusal sağlık veri sistemlerine dayanan bir çalışma yapıldı. 2018’de doğanlar arasında 3475 NTD olgusu bulundu: 10.000 doğumda 27,5 (Çaylan ve ark., 2022).

Bu kusurların önemli bir bölümü önlenebilir. MRC Vitamin Çalışması 1991’de yayımlandı. Çalışmaya 1817 kadın katıldı. Hepsi daha önce NTD’li bir gebelik geçirmişti; bu yüzden riskleri yüksekti. Kadınlar rastgele gruplara ayrıldı. Folik asit alanlarda koruyucu etki %72 bulundu (MRC Vitamin Study Research Group, 1991). ABD Önleyici Hizmetler Görev Gücü’nün (USPSTF) önerisi şudur: gebelik planlayan ya da gebe kalabilecek herkes her gün bir takviye almalıdır. Takviye günde 0,4–0,8 mg (400–800 mikrogram) folik asit içermelidir (USPSTF, 2023). Gebeliklerin çoğu plansızdır. Bu yüzden birçok ülke temel gıdaları folik asitle zenginleştirir (Quinn ve ark., 2024). Türkiye’de ise Çaylan ve arkadaşlarının yazdığı dönemde (2022) böyle bir zenginleştirme programı uygulanmıyordu (Çaylan ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Folik asit gebelikten önce',
      md: 'Sinir borusu, döllenmeden sonraki dördüncü haftanın sonunda kapanmış olur (Santos ve ark., 2024). Bu yüzden takviyeye gebelikten **en az bir ay önce** başlanması önerilir. Takviyenin gebeliğin **en az ilk 12 haftası** boyunca sürdürülmesi de önerilir (Samaniego-Vaesken ve ark., 2024). Nöral tüp defekti riski yüksek olanlar bu aralığın üstünde dozlara gerek duyabilir. Bunu hekimleriyle konuşmalıdırlar (USPSTF, 2023). Buradaki bilgiler eğitim amaçlıdır. Kişiye özel doz önerisi değildir.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Nöral tüp defektlerinin başlıca türleri',
      sutunlar: ['Defekt', 'Ne olur?', 'Sinir dokusu açıkta mı?', 'Kaynak'],
      satirlar: [
        ['Kraniyoraşişizis', 'En ağır defekt: nöral tüpün hem kafa hem omurilik kısmı tutulur', 'Evet (açık)', 'Isaković ve ark., 2022'],
        ['Anensefali', 'Yalnızca kafa kısmı tutulur; ön beyin ve kafatası kubbesi yoktur', 'Evet (açık)', 'Isaković ve ark., 2022'],
        [
          'Ensefalosel',
          'Beyin, zarlar ya da ikisi birden kafatasındaki bir açıklıktan kese gibi dışarı taşar',
          'Sınıflaması kaynağa göre değişir',
          'Isaković ve ark., 2022',
        ],
        [
          'Miyelomeningosel (açık spina bifida)',
          'Arka nöral tüp oluşamaz; sinir plakodu içeren zar kesesi dışarı çıkar; çoğunlukla bel ve üst sağrı düzeyinde',
          'Evet (açık)',
          'Isaković ve ark., 2022; Santos ve ark., 2024',
        ],
        [
          'Spina bifida okülta',
          'Omur kemerinde açıklık; fıtıklaşma ya da kistik kitle yok; nüfusun yaklaşık %10’unda L5 ya da S1 omurunda',
          'Hayır',
          'Isaković ve ark., 2022; Ravi ve ark., 2021',
        ],
        [
          'Deriyle örtülü disrafik durumlar',
          'Alt sağrı ve kuyruk sokumu düzeyinde; ikincil nörülasyonun bozulmasından',
          'Hayır (deriyle örtülü)',
          'Santos ve ark., 2024',
        ],
      ],
      not: 'Açık ve kapalı defekt ayrımı, beynin ya da omuriliğin açıkta kalıp kalmamasına dayanır (Isaković ve ark., 2022). Ensefaloselin hangi gruba konacağı kaynaklarda değişir. Isaković ve ark. onu kapalı defektlerin yanında anlatır. Ravi ve ark. (2021) açık ve kapalı defektleri kendi içinde tutarsız sınıflandırır. Bu yüzden bu tabloda o sınıflama kullanılmadı.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Doğumdan önce tanı: limon, muz ve alfa-fetoprotein',
      md: `**Chiari tip II malformasyonu** çoğunlukla miyelomeningosel ve miyeloselle birlikte görülür. Bu malformasyonda beyin sapı, omurlardaki açıklıktan aşağı doğru çekilir. Miyelomeningosel ve miyeloselin ultrason tanısı dolaylı iki işarete dayanır: “limon” ve “muz”. Bu işaretler rutin kontrolde görülür (Isaković ve ark., 2022). “Limon”, kafatasının limona benzeyen biçimidir; “muz”, beyinciğin muza benzeyen biçimidir. Açık defektler biyokimyasal olarak da saptanabilir. Amniyon sıvısında alfa-fetoprotein ve asetilkolinesteraz yüksek bulunur. Kapalı defektlerde bu biyokimyasal bozukluk yoktur (Ravi ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Nöral tüp defektlerinin sıklığı: hangi sayı neyi ölçer?',
      sutunlar: ['Çalışma', 'Yer, dönem ve örneklem', 'Değer', 'Payda'],
      satirlar: [
        [
          'Blencowe ve ark. (2018), aktaran Çaylan ve ark. (2022)',
          'Dünya, 2015',
          '18,6 (260.100 NTD’li doğum sonucu)',
          '10.000 canlı doğumda',
        ],
        [
          'Zaganjor ve ark. (2016)',
          '75 ülkeden 160 kaynak; DSÖ bölgeleri',
          'Ortanca değerler (medyan): Doğu Akdeniz 21,9; Güneydoğu Asya 15,8; Afrika 11,7; Amerika 11,5; Avrupa 9,0; Batı Pasifik 6,9',
          '10.000 doğumda',
        ],
        ['Çaylan ve ark. (2022)', 'Türkiye, 2018 doğum kohortu; ulusal sağlık veri sistemleri', '27,5 (3475 olgu)', '10.000 doğumda'],
        ['Çaylan ve ark. (2022)’nin aktardığı çalışmalar', 'Türkiye’nin çeşitli illeri, 2000 öncesi', '30–58', '10.000 doğumda'],
        [
          'Aynı kaynağın aktarımı',
          'Türkiye; Haziran 1993–Temmuz 1994, üniversite klinikleri, ulusal temsilî çok merkezli, 21.907 çocuk',
          '30,1',
          '10.000 doğumda',
        ],
        ['Aynı kaynağın aktarımı', 'İzmir, 2000; bölgesel iç içe vaka-kontrol çalışması', '15,0', '10.000 doğumda'],
        [
          'Aynı kaynağın aktarımı',
          'Afyonkarahisar, 2003–2004; hastane kayıtları (canlı ve ölü doğumlar, tıbbi nedenle sonlandırılan gebelikler)',
          '35,8',
          '10.000 doğumda',
        ],
        [
          'Aynı kaynağın aktarımı',
          'Doğu Türkiye’nin düşük gelirli bölgesinde bir üçüncü basamak sevk perinatoloji ünitesi, 2016–2018',
          '130,0 (151/11.552)',
          '10.000 fetüste',
        ],
        [
          'Babaei-Ghazani ve ark. (2025), GBD 2021',
          'Dünya; Ortadoğu ve Kuzey Afrika; Türkiye; 2021',
          '1,95; 2,05; 1,54 (yaşa göre standart yeni olgu hızı, insidans)',
          '100.000 kişide (nüfus)',
        ],
      ],
      not: 'Bu tablodaki sayılar üç farklı ölçüdür: doğum başına sıklık, fetüs başına oran ve GBD’nin nüfus başına yaşa göre standart insidansı. Aynı tabloda durmaları, birbiriyle karşılaştırılabilecekleri anlamına gelmez. Zaganjor ve ark. bölge değerlerini ortanca (medyan) ve aralık olarak verir. Aralıklar çok geniştir (Batı Pasifik’te 0,3–199,4). Afyonkarahisar değeri Zaganjor ve ark. tablosunda 35,9 diye geçer.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Türkiye’de NTD’nin yükü.** 2018’de doğan bebeklerdeki (kohort) olgular şöyle dağılıyordu: %82,6 spina bifida, %12,2 anensefali, %4,9 ensefalosel, %0,3 tanımlanmamış NTD. Canlı doğan NTD’li bebeklerin %13,5’i ilk yılında öldü. Mart 2022 sonuna kadar ölenlerin payı %15,6’ydı. 2014–2019 arasında NTD üç tabloda yer aldı:

- fetüsteki anomali nedeniyle sonlandırılan gebeliklerin %11,7’sinde,
- ölü doğumların %2,5’inde,
- bebek ölümlerinin %2,8’inde.

NTD’ye bağlı ölü doğum hızı en yüksek Doğu bölgesindeydi: 10.000 doğumda 3,64. Bebek ölüm hızı da en yüksek oradaydı: 10.000 canlı doğumda 4,65 (Çaylan ve ark., 2022).

**Folik asit: kanıt.** MRC Vitamin Çalışması 7 ülkede 33 merkezde yürütüldü. 1817 yüksek riskli kadın dört gruba rastgele ayrıldı. Sonucu bilinen gebeliklerde 27 NTD vardı. Bunların 6’sı folik asit alan gruplardaydı, 21’i öteki iki gruptaydı. Bu, %72’lik bir koruyucu etkiye karşılık gelir (göreli risk 0,28). Öteki vitaminlerin anlamlı bir koruyucu etkisi yoktu (MRC Vitamin Study Research Group, 1991). Çalışmada kullanılan doz günde 4 mg’dı (Wald, 2022). Bir şemsiye derlemeye de bakalım; şemsiye derleme, birçok derlemeyi birlikte inceleyen çalışmadır. Bu derlemede annenin folik asit kullanımı iki şeyle anlamlı biçimde ters ilişkiliydi: doğumda NTD (göreli risk 0,31) ve NTD’nin tekrarlaması (Yoo ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Folik asit: doz.** Ortalama riskte ACOG, AAFP ve AAP aynı dozu önerir. Bunlar ABD’deki kadın doğum, aile hekimliği ve çocuk hekimliği kuruluşlarıdır. Öneri, gebelik planlayan üreme çağındaki kişiler içindir: günde 400 µg (0,4 mg). USPSTF ise gebelik planlayan ya da gebe kalabilecek herkes için günde 0,4–0,8 mg önerir (USPSTF, 2023). İngiltere ve ABD gibi ülkelerde doz, önceki gebeliğe göre değişir. Daha önce NTD’li gebelik geçirmemiş olanlara 0,4 mg önerilir. Geçirmiş olanlara 4 mg (ya da 5 mg) önerilir (Wald, 2022). Yüksek risk durumlarında ise 1–5 mg/gün önerilir. Bu durumlara örnekler şunlardır: önceki NTD’li gebelik, ailede NTD öyküsü, ikiz gebelik, insüline bağımlı diyabet ve obezite (beden kitle indeksi 30’un üstü) (Samaniego-Vaesken ve ark., 2024).

**Zenginleştirme.** Zorunlu zenginleştirme ilk kez 1998’de ABD’de ve Kanada’da başladı. ABD’de 100 g tahılda 140 µg folik asit bulunur; Kanada’da 100 g tahılda 150 µg. 31 Temmuz 2023’e kadar 193 ülke incelendi. Bunların 69’u zorunlu, 47’si gönüllü zenginleştirme uyguluyordu. 77’sinde hiç zenginleştirme yoktu. Zenginleştirme, hiç olmamasına göre iki şeyle ilişkilidir. Kandaki ortalama folat düzeyi (plazma folatı) %50–100 daha yüksektir. NTD sıklığı ise %25–50 daha düşüktür. 75 ülkenin verisinde ortalama NTD sıklığı ülke grubuna göre değişir. Zorunlu, gönüllü ve zenginleştirmesiz ülkelerde sırasıyla 4,19; 7,61 ve 9,66’dır. Bu değerlerin birimi kaynakta “10.000 nüfusta” diye yazılır (Quinn ve ark., 2024).

**Türkiye’de durum.** Çaylan ve arkadaşlarına göre gebelik öncesi folik asit takviyesi 2014’ten beri Sağlık Bakanlığı rehberlerinde önerilir. Ama yazdıkları dönemde (2022) temel gıdaları folik asitle zenginleştiren bir program uygulanmıyordu. Türkiye Beslenme Rehberi 2015’e bakalım. Buna göre doğurganlık çağındaki kadınların %30’dan fazlasında folat alımı, tahmini ortalama gereksinimin altındadır. Bir çalışmada 15 yaşın üstündeki kadınların %40,2’sinde folat eksikliği ya da yetersizliği bulundu (<5,9 ng/mL). Yazarlar bir sonuca varır: NTD sıklığını ve buna bağlı ölümleri azaltmak için zorunlu zenginleştirme düşünülmelidir (Çaylan ve ark., 2022).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Rutin ultrasonda limon ve muz',
      oyku: `29 yaşında bir kadın, ilk gebeliğinde rutin ultrason kontrolüne geliyor. Fetüste dolaylı “limon” ve “muz” işaretleri görülüyor. Amniyon sıvısında alfa-fetoprotein ve asetilkolinesteraz yüksek bulunuyor. Kadın gebeliğin plansız olduğunu söylüyor. Gebelikten önce folik asit kullanmamış.`,
      soru: 'Bulgular hangi gelişim basamağındaki bir aksaklığı düşündürür? Doğumdan sonra ve bir sonraki gebelikte neler konuşulmalıdır?',
      cozum: `**Ne düşündürür?** Limon ve muz işaretleri, miyelomeningosel ve miyeloselin ultrasondaki dolaylı işaretleridir. Bu durumlar Chiari tip II malformasyonuyla birlikte görülür (Isaković ve ark., 2022). Amniyon sıvısında alfa-fetoprotein ve asetilkolinesteraz yüksekliği de **açık** bir defekti gösterir. Kapalı defektlerde bu bozukluk yoktur (Ravi ve ark., 2021). Açık spina bifida çoğunlukla bel ve üst sağrı düzeyinde olur. **Birincil nörülasyonun** kapanma kusurundan doğar (Santos ve ark., 2024). Arka nöropor normalde yaklaşık 27. günde kapanır (Ravi ve ark., 2021).

**Doğumdan sonra:** Ravi ve arkadaşlarının aktarımına göre açık defekt hızla onarılmalıdır: doğumdan sonraki 24–48 saat içinde. Amaç, enfeksiyon tehlikesini azaltmaktır. Doğumda hidrosefali, yani karıncıklarda beyin-omurilik sıvısı birikmesi sık görülür. Bunu büyük olasılıkla Chiari II malformasyonu açıklar (Ravi ve ark., 2021).

**Bir sonraki gebelik:** Daha önce NTD’li gebelik geçirmiş olmak yüksek risk demektir. MRC çalışması tam da bu grupta folik asidin %72’lik koruyucu etkisini göstermiştir (MRC Vitamin Study Research Group, 1991). Bu durumda İngiltere ve ABD gibi ülkelerde yüksek dozlar önerilir: 4 mg (ya da 5 mg) gibi (Wald, 2022). Takviyeye gebelikten en az bir ay önce başlanmalıdır (Samaniego-Vaesken ve ark., 2024). Doz kararı hekimle verilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Açık spina bifida: ameliyat zamanı, hidrosefali ve Türkiye verisi',
      md: `Ravi ve arkadaşlarının aktarımına göre açık defekt, doğumdan sonraki 24–48 saat içinde onarılmalıdır. Ameliyat edilmeyen bebeklerin yalnızca %20’si iki yaşına ulaşır. Doğumda olguların büyük bölümünde hidrosefali bulunur. Bunu büyük olasılıkla miyelomeningoselde görülen Chiari II malformasyonu açıklar. Ama aynı makale bu oran için iki farklı değer verir: bir yerde yaklaşık %80, başka bir yerde %90’ın üzerinde (Ravi ve ark., 2021). Chiari II’de beyin sapı, omurlardaki açıklıktan aşağı doğru çekilir (Isaković ve ark., 2022).

Türkiye’de ulusal bir çalışma yapıldı. Çalışma hastane kayıtlarına dayanır ve geriye dönüktür (geriye dönük kohort). 2015–2021 arasında NTD tanısı alan 7606 canlı doğan yenidoğanı kapsar. Olguların %30,3’üne cerrahi girişim yapıldı. Cerrahi oranı bölgeden bölgeye belirgin biçimde değişiyordu. En yüksek oran Güneydoğu Anadolu’daydı (Korkmaz ve Bilge, 2025). Çalışma sağkalım süresine de bakar. Ama bu dersin değerlendirmesine göre o bulgular izlem süresinden etkilenebilir. Bu yüzden burada kullanılmadı.

Kapalı defektlerde düzey ve oluşum yolu farklıdır. Deriyle örtülü disrafik durumlar alt sağrı ve kuyruk sokumu düzeyinde görülür. İkincil nörülasyonun bozulmasından doğarlar (Santos ve ark., 2024). Civciv verileri insana uyarlanınca birincil ve ikincil boruların birleşim yeri bir aralıkta değişir: alt göğüs ile üst sağrı omurilik bölümleri arasında (Yang ve ark., 2021).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'NTD ve folik asit sayılarını okurken',
      md: `**Birimler.** İki ölçüyü birbirine karıştırma. Biri doğum başına sıklıktır (Türkiye’de 2018’de 10.000 doğumda 27,5; dünyada 2015’te 10.000 canlı doğumda 18,6; Çaylan ve ark., 2022). Öteki GBD’nin nüfus başına, yaşa göre standart insidansıdır (Babaei-Ghazani ve ark., 2025). Bunlar farklı ölçülerdir; birbiriyle karşılaştırılmamalıdır. Quinn ve arkadaşlarının değerleri de kaynakta “10.000 nüfusta” diye yazılır (Quinn ve ark., 2024). Bunları da doğum başına sıklıkla doğrudan karşılaştırma. GBD 2021’e göre Türkiye’de yaşa göre standart göstergeler şöyle değişti:

- NTD insidansı 1990’da 100.000 kişide 3,82 iken 2021’de 1,54’e indi.
- Ölüm hızı 3,29’dan 0,5’e indi.
- DALY hızı 296,29’dan 48,52’ye indi.

Ortadoğu ve Kuzey Afrika bölgesinde yaşa göre standart DALY hızı aynı dönemde %72,72 azaldı (Babaei-Ghazani ve ark., 2025). GBD bir katkıdan da söz eder. Folik asit takviyesi ve tahıl zenginleştirmesi, bunları uygulayan ülkelerde NTD insidansının düşmesine katkı vermiştir (GBD 2021 Nervous System Disorders Collaborators, 2024).

**Eşitsizlik.** NTD’leri kaydeden ya da izleyen (sürveyans) bir sistemi olan ülkelerin oranı, gelirle artar. Bu oran düşük gelirli ülkelerde %0, alt-orta gelirde %25, üst-orta gelirde %70, yüksek gelirde %91’dir (Zaganjor ve ark., 2016). NTD’ye bağlı ölümlerin %85’i, GSYH’si en düşük çeyrekteki ülkelerdedir (Isaković ve ark., 2022). GSYH (gayrisafi yurt içi hasıla), bir ülkenin ekonomik büyüklüğünün ölçüsüdür.

**Kaynaklar her zaman aynı sayıyı vermez.** MRC çalışmasının özetinde etki %72 diye geçer (göreli risk 0,28). Wald aynı çalışma için iki sayı daha yazar. Vitaminsiz kapsül alanlara göre azalma %71’dir. “Tedavi altında” analizde ise azalma %83’tür. Bu analiz, takviyeye gebelikten önce başlayıp gebeliğin ilk haftalarında da sürdürenlerle sınırlıdır (MRC Vitamin Study Research Group, 1991; Wald, 2022). Isaković ve arkadaşları (2022) 1991 sonucunu 0,4 mg’lık doza bağlar. Bu yanlıştır: MRC dozu 4 mg’dır (Wald, 2022). Babaei-Ghazani ve arkadaşları (2025), DSÖ önerisi diye “günde en az 300 µg” değerini verir. Bu değer, öteki bütün kaynakların 400 µg değeriyle uyuşmaz. Zorunlu zenginleştirme yapan ülke sayısı da kaynağa göre değişir. Quinn ve arkadaşlarına göre bu sayı Temmuz 2023’te 69’dur (Quinn ve ark., 2024). Başka bir derleme “90’dan fazla” der (Yoo ve ark., 2026). Fark, tanımdan ve tarihten kaynaklanabilir. Wald’a göre hiçbir Avrupa ülkesi folik asit zenginleştirmesi başlatmamıştır (Wald, 2022). Burada zorunlu zenginleştirme kastedilir. Çünkü Quinn ve arkadaşları, Avrupa’nın çoğunda gönüllü zenginleştirme olduğunu yazar (Quinn ve ark., 2024).

**Güvenlik ve eşikler.** Folik asit için bir üst sınır vardır: tolere edilebilir üst alım düzeyi. Yetişkinler için, gebe ve emzirenler dahil, bu düzey genel kabulle 1000 µg/gündür (Samaniego-Vaesken ve ark., 2024). Wald ise başka bir noktayı savunur. Ona göre folik aside yanlışlıkla sinir sistemine zarar verme (nörolojik toksisite) özelliği yüklenir. Wald’a göre bu yanlış, birçok ülkede zenginleştirmenin önünde engel olmuştur (Wald, 2022). Annede alyuvar (eritrosit) folatı için bir “yetersiz” eşiği belirlenmiştir: <906 nmol/L. Bu düzeyin üstünde NTD riskinde ek yarar görülmemiştir (Yoo ve ark., 2026).`,
    },
  ],
};
