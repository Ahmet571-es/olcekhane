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
      md: `Sinir sistemi embriyonun ilk haftalarında kurulmaya başlar. Döllenmeden 16 gün sonra embriyonun hücreleri, bedenin bütün dokularını yapacak üç **germ yaprağından** birine aittir; en dıştaki **ektoderm** hem deriyi hem de sinir sistemini yapar (OpenStax 13.1). Gray, gliası dahil sinir sisteminin tamamını ektodermden türetir (Gray, 1918). Bugün bunun bir istisnası olabileceği düşünülür: merkezî sinir sisteminin yerleşik makrofajları olan **mikroglia** büyük olasılıkla mezodermal kökenlidir (Waymire, 2026). OpenStax de mikroglianın erken gelişimde merkezî sinir sistemine katılan akyuvarlardan (makrofajlardan) gelebileceğini, ama kökeninin kesin olarak belirlenmediğini yazar (OpenStax 12.2). Sinir sisteminin oluşumu döllenmeden sonraki 3. ve 4. haftalarda başlar. İlk olay **nöral indüksiyondur**: ektoderm, sinir dokusunu yapacak **nöroektoderm** ve deriyi yapacak **yüzey ektodermi** olarak ikiye ayrılır (Catala, 2021).

Moleküler sinyallerin etkisiyle nöroektodermdeki hücreler sinir dokusunun öncüsü olan nöroepitele dönüşür ve bir levha oluşur: **nöral plak** (OpenStax 13.1). Hücreler biçim değiştirdikçe plak içeri doğru katlanır ve sırt boyunca bir çizgi gibi uzanan **nöral oluk** belirir; oluğun iki yanındaki kabarık kenarlara **nöral kıvrım** denir. Kıvrımlar orta hatta buluşup birleşince ektodermin hemen altında içi boş bir boru oluşur: **sinir borusu** ya da **nöral tüp** (OpenStax 13.1). Plaktan boruya giden bu sürece **nörülasyon** denir. Borunun ön ucu beyni, arka bölümü omuriliği yapar (OpenStax 13.1).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İndüksiyondan nörülasyona.** İnsan embriyosunun üçüncü haftası **gastrülasyonla**, yani ektoderm, mezoderm ve endodermin oluşmasıyla belirlenir (Isaković ve ark., 2022). Ardından gelen nöral indüksiyon ilkel ektodermi nöroektoderm ve yüzey ektodermine ayırır. Nöroektodermden gelişen nöral plak merkezî sinir sistemini ve çevresel sinir sisteminin büyük kısmını yapar; yüzey ektodermi ise epidermisi oluşturur, ayrıca baş bölgesindeki çevresel sinir sisteminin bazı öğelerine ve ağız ile burun epiteline katkı verir (Catala, 2021).

Borunun karın–sırt (ventral–dorsal) düzeni karşıt sinyallerle kurulur. Plağın altındaki **notokorddan** gelen Shh gibi sinyallerin güçlü bir ventralleştirici etkisi vardır; yüzey ektodermi ve alttaki mezodermin salgıladığı BMP’ler ise boru kapanırken sırt bölümlerinin farklılaşmasını etkiler (Isaković ve ark., 2022). Notokord önce borunun karın tarafındaki orta şeridi, **taban plağını** indükler; tavan plağından gelen sinyallerle birlikte öteki boylamsal bölgelerin yerini de dolaylı olarak belirler (Puelles, 2024).

Gelişen borunun duvarında Gray üç tabaka ayırt eder: içte **ependimal**, ortada **manto** ve dışta **marjinal** tabaka; manto tabakası omuriliğin gelecekteki gri kolonlarının tamamını temsil eder (Gray, 1918). Gray’in tüp duvarını bir “sinsityum” olarak anlatması ise eskimiştir: güncel kaynaklar nöral plağın tek katlı, psödostratifiye silindirik hücrelerden oluştuğunu ve çekirdeklerin interkinetik göç yaptığını anlatır (Ravi ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'İlk haftaların takvimi',
      sutunlar: ['Zaman', 'Olay', 'Kaynak'],
      satirlar: [
        ['16. gün', 'Embriyonun hücreleri üç germ yaprağına ayrılmıştır', 'OpenStax 13.1'],
        ['3. hafta', 'Gastrülasyon: ektoderm, mezoderm ve endoderm oluşur', 'Isaković ve ark., 2022'],
        ['3.–4. hafta', 'Nöral indüksiyon; sinir sisteminin oluşumunun ilk evreleri', 'Catala, 2021'],
        ['21.–28. gün', 'Nöral tüpün kapanma penceresi; kapanmazsa nöral tüp defekti oluşur', 'Çaylan ve ark., 2022'],
        ['~24. ve ~26. gün', 'Otik plakod çukurlaşarak önce otik çanağı, sonra otik kisti yapar', 'Zine ve Fritzsch, 2023'],
        ['~25. gün', 'Ön nöropor kapanır; yeri son lamina (*lamina terminalis*) olur', 'Ravi ve ark., 2021'],
        ['~27. gün', 'Arka nöropor kapanır (klasik kaynaklara göre Carnegie evre 12)', 'Ravi ve ark., 2021; Catala, 2021'],
        ['4. haftanın sonu', 'Birincil nörülasyon tamamlanır', 'Santos ve ark., 2024'],
        ['Carnegie evre 13’ten (~28. gün) itibaren', 'İkincil nörülasyon: omuriliğin en alt ucu oluşur', 'Santos ve ark., 2024'],
        ['3. haftadan 5. haftanın sonuna', 'Servikal büküm artar; arka beyin omurilikle neredeyse dik açı yapar', 'Gray, 1918'],
        [
          '4., 12. ve 16. hafta (sayılış biçimi belirtilmemiş)',
          'Sırasıyla nörogenez, sinaps oluşumu ve miyelinlenme başlar; başka kaynaklar farklı haftalar verir (bkz. not)',
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
      not: 'Haftalar iki farklı biçimde sayılır. Embriyoloji kaynakları döllenmeden sonraki günleri ve haftaları sayar (Catala, 2021; Santos ve ark., 2024; Çaylan ve ark., 2022). Gebelik haftası ise çoğunlukla annenin son adet döneminden sayılır: son adet, tam belirlenmesi zor olan döllenme zamanının yerine yaygın olarak kullanılır (Grotheer ve ark., 2023). AlRayahi ve ark. (2026) haftaları “gebelik haftası” (*weeks of gestation*) diye verir ama hangi biçimde saydığını belirtmez; bu satırlar ötekilerle doğrudan karşılaştırılmamalıdır. Sinaps oluşumunun ve miyelinleşmenin başladığı hafta da kaynaktan kaynağa değişir: bir derlemeye göre ilk miyelin omurilikte gebeliğin 12–14. haftasında belirir (Buyanova ve Arsalidou, 2021); bir başkasına göre sinaps oluşumu gebeliğin ortasında, miyelinleşme gebeliğin son döneminde başlar (Khartabil ve ark., 2026). Bu iki kaynak da haftaların nasıl sayıldığını belirtmez. Gray (1918) satırlarındaki haftalar ve aylar o dönemin yaşlandırmasına dayanır: aynı kaynak ön nöroporun “üçüncü haftanın sonuna doğru” kapandığını yazar, güncel değer ise ~25. gündür. Gray’in bu satırları güncel bir kaynakla karşılaştırılamadı; tarihsel bilgi olarak okunmalıdır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Birincil ve ikincil nörülasyon.** Kıvrımların birleşmesiyle boru oluşmasına **birincil nörülasyon** denir. Nöral tüp bir süre iki ucundaki açıklıklarla, **ön** ve **arka nöroporla**, amniyon boşluğuna açılır (Ravi ve ark., 2021). Ön nöropor yaklaşık 25. günde kapanır ve **son lamina** (*lamina terminalis*) olur; arka nöropor yaklaşık 27. günde kapanır ve kapanmazsa borunun alt ucunda nöral tüp defekti oluşur (Ravi ve ark., 2021). Catala’nın aktardığı klasik kaynaklara göre arka nöropor Carnegie evre 12’de kapanır (Catala, 2021); insanda birincil nörülasyon döllenmeden sonraki 4. haftanın sonunda tamamlanır (Santos ve ark., 2024).

Nöropor kapandığında omurilik henüz tamamlanmamıştır: en alt (kaudal) ucu farklı bir mekanizmayla, **ikincil nörülasyonla** oluşur (Catala, 2021). Birincil nörülasyonda boru kıvrımların kapanmasıyla, ikincil nörülasyonda ise içinde boşluk açılmasıyla (**kanalizasyon**) meydana gelir (Santos ve ark., 2024). Bu ayrımın klinikte karşılığı vardır: açık spina bifida (miyelomeningosel) çoğunlukla bel ve üst sağrı düzeylerinde birincil borunun kapanma kusurundan doğar; deriyle örtülü “disrafik” durumlar ise alt sağrı ve kuyruk sokumu düzeylerinde, nöral kıvrım oluşmadan boru yapan ikincil nörülasyonun bozulmasından kaynaklanır (Santos ve ark., 2024).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kapanmanın mekaniği.** Nöral tüpün kapanması çok yönlü bir süreçtir: yakınsamalı uzama, apikal daralma ve çekirdeklerin interkinetik göçü gibi hücresel olayları içerir; kanonik olmayan Wnt/düzlemsel hücre polaritesi yolu, Shh/BMP sinyali ve Grhl2/3, Pax3, Cdx2, Zic2 gibi transkripsiyon etkenleri gerekir (Ravi ve ark., 2021). Gray, kıvrımların önce arka beyin bölgesinde birleştiğini ve kapanmanın oradan öne ve arkaya ilerlediğini yazar (Gray, 1918); güncel bir derlemeye göre insanda fermuar gibi kapanmanın aynı anda sürdüğü en az dört bölge vardır (Isaković ve ark., 2022).

Santos ve arkadaşları Carnegie evre 10–18 arasındaki 108 insan embriyosunu inceledi. Evre 12’de arka nöropor kapanırken plak, notokordun üstündeki orta menteşe noktasından ve iki yandaki dorsolateral menteşe noktalarından bükülüyordu; bu, faredeki “2. tip” omurilik nörülasyonunun doğrudan karşılığıdır. Arka nöropor giderek kısalır ve kapanma yaklaşık 30 somit evresinde tamamlanır; embriyoların çoğunda evre 13’te (döllenmeden yaklaşık 28 gün sonra) kapalıydı. İnsanda yaklaşık her 7 saatte bir somit oluşur, farede ise her 2 saatte bir. İkincil nörülasyon evre 13’ten itibaren, civcivdeki gibi birden çok boşluğun birleşmesiyle değil, faredeki gibi tek bir lümenle ilerliyordu ve birincilden ikincile bir “geçiş bölgesi”ne dair kanıt yoktu (Santos ve ark., 2024).

İnsandaki veriler yine de tartışmalıdır. Catala’ya göre insan verileri yalnızca tanımlayıcıdır ve birbiriyle çelişir; kaudal malformasyonların mekanizmasını bunlarla açıklamaya çalışırken çok dikkatli olmak gerekir. Catala, birincil ve ikincil boruların lümenlerinin oluşum sırasında kesintisiz olduğunu ve kaudal lümenin ayrıca öne açılmadığını yazar (Catala, 2021). Civciv işaretleme verileri insana uyarlandığında iki borunun birleşim bölgesi alt göğüs ile üst sağrı omurilik bölümleri arasında değişir; ikincil nörülasyonun erken döneminde oluşan bir hasar medüller kordun hiç oluşmamasına yol açar (Yang ve ark., 2021). Ravi ve arkadaşlarının ikincil nörülasyon için verdiği 45–53. günler, insan embriyolarındaki bu doğrudan gözlemlerle uyuşmadığı için bu derste kullanılmadı.`,
    },
    {
      tur: 'metin',
      md: `Borunun ön ucu genişler ve önce üç **birincil kesecik** (vezikül) belirir: **ön beyin** (*prosencephalon*), **orta beyin** (*mesencephalon*) ve **arka beyin** (*rhombencephalon*). Sonra üç kesecik beşe çıkar: ön beyin **uç beyin** (*telencephalon*) ve **ara beyin** (*diencephalon*) olarak ikiye ayrılır; orta beyin daha ince bölümlere ayrılmaz; arka beyin **metensefalon** (*metencephalon*) ve **miyelensefalon** (*myelencephalon*) olur (OpenStax 13.1). Yetişkin beynin bütün büyük bölümleri bu beş keseciğe kadar izlenebilir. Ara beyinden talamus ve hipotalamus, metensefalondan pons ve beyincik gelişir; orta beyin, pons ve omurilik soğanına birlikte **beyin sapı** (*truncus encephali*) denir (OpenStax 13.1).

Boru içi boş olduğu için beynin içinde de boşluklar kalır: beynin **karıncıkları** (ventriküller), nöral tüpün iç boşluğunun kalıntısıdır (OpenStax 13.1). Borunun duvarında da bir düzen kurulur: sırt tarafındaki dokular duyu, karın tarafındakiler hareket işleriyle ilişkili olur (OpenStax 13.1). Kıvrımların kenarından ayrılan bir hücre topluluğu ise borunun iki yanına yerleşir: **nöral krista** (OpenStax 13.1). Bu hücreler göç edebilen, çok yönlü bir kök hücre topluluğudur (Mehrotra ve ark., 2020); çevresel sinir sisteminin gangliyonlarından yüzün kemiklerine kadar pek çok dokuyu yapar (Simões-Costa ve Bronner, 2013).`,
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
      not: 'Kaynak: OpenStax 13.1. Beyincik metensefalondan gelişir ama beyin sapına sayılmaz; beyin sapı orta beyin, pons ve omurilik soğanıdır.',
    },
    {
      tur: 'sahne',
      baslik: 'Beş keseciğin bugünkü yeri',
      aciklama:
        'Beynin sağ yarısı kaldırıldı; sol yarıya içeriden, orta hattan bakıyoruz; ön taraf sağda. Her yapı geldiği keseciğin renginde: mavi uç beyin (büyük beyin ve yan karıncık), turkuaz ara beyin (talamus, hipotalamus ve üçüncü karıncık), mor orta beyin (orta beyin su yolu dahil), sarı metensefalon (pons ve beyincik), pembe miyelensefalon (omurilik soğanı). Turuncu dördüncü karıncık, arka beynin iki keseciğinin ortak boşluğudur. Beyin sapı ile ön beyin arasındaki belirgin açıya dikkat et: yetişkin beyninin ekseni burada kırılır. Hipofiz bezi, ön bölümü başka bir kökenden geldiği için gizlendi.',
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
      md: '**Ektoderm → nöral plak → nöral oluk ve kıvrımlar → nöral tüp.** Borunun ön ucu beyin, arka bölümü omurilik olur.\n\n**3 kesecik → 5 kesecik:** ön beyin → uç beyin + ara beyin; orta beyin → orta beyin; arka beyin → metensefalon + miyelensefalon.\n\n**Borunun boşluğu → karıncıklar ve merkezî kanal.** Sırt tarafı duyu, karın tarafı hareket. Kıvrımların kenarından **nöral krista** ayrılır.\n\nBoru **4. haftada** kapanır; kapanmazsa **nöral tüp defekti** oluşur.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yüzündeki kemiklerin büyük bölümü, beynin doğduğu yerin hemen yanından gelir. Kafa bölgesindeki **nöral krista** hücreleri yüz iskeletinin büyük bölümünü ve pigment hücrelerini yapar (Simões-Costa ve Bronner, 2013). Bu kadar çok dokuya kaynaklık ettiği için nöral krista sık sık “dördüncü germ yaprağı” diye anılır (Mehrotra ve ark., 2020).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Keseciklerin ayrışması.** Ön beyin genişlerken orta hattında yüksek oranda programlı hücre ölümü (apoptoz) olur ve kesecik ikiye bölünerek uç beyni ve ara beyni verir (AlRayahi ve ark., 2026). Ara beyinden talamus ve hipotalamus gelişir; embriyonik ara beyinde beliren **göz çanağı** ileride retinaya dönüşür (OpenStax 13.1). Arka beyin metensefalona ve miyelensefalona ayrılır: metensefalon pons ve beyinciği, miyelensefalon omurilik soğanını yapar (OpenStax 13.1; AlRayahi ve ark., 2026).

Terminologia Anatomica arka beyni “miyelensefalon + metensefalon” diye tanımlar ve *myelencephalon* terimini omurilik soğanının (*medulla oblongata*) eş anlamlısı olarak verir. Aynı terminolojide *prosencephalon*, yetişkindeki *cerebrum*’un, yani uç beyin ile ara beynin toplamının eş anlamlısıdır (FIPAT, 2019). Bu yüzden “serebrum” sözcüğü kaynaktan kaynağa farklı kapsamda kullanılır: OpenStax’in tablosunda yalnızca uç beyni karşılar (OpenStax 13.1).

Gray’e göre yarımküreler büyüdükçe geriye doğru taşar: üçüncü ayda ara beyni, altıncı ayda orta beyni, sekizinci ayda arka beyni örter. Kabuğun kıvrım ve oluklarının çoğu fetal yaşamın altıncı ya da yedinci ayında belirir; yarımküreleri birbirine bağlayan büyük lif köprüleri (korpus kallozum, forniks ve ön komissür) son laminadan gelişir (Gray, 1918). Bu aylar Gray’in döneminin yaşlandırmasına dayanır ve burada güncel bir kaynakla karşılaştırılamadı. Bu konular Anatomi bölümünün **Beyin nasıl oluşur?** dersinde ayrıntılı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Üç büküm ve karıştırılan bir ad',
      md: `Gelişen tüp aynı dönemde üç yerden bükülür: ön beyin ile beyin sapı arasında **sefalik**, omurilik soğanı ile omuriliğin birleştiği yerde **servikal** ve dördüncü karıncığa biçimini veren **pontin** büküm (AlRayahi ve ark., 2026). Gray’e göre ilk büküm orta beyin bölgesinde belirir (ventral sefalik büküm). Gray’in eski yaşlandırmasına göre servikal büküm üçüncü haftadan beşinci haftanın sonuna kadar artar (bu tarih güncel bir kaynakla karşılaştırılamadı); bu sırada arka beyin omurilikle neredeyse dik açı yapar. Pontin büküm ise ötekilerden farklı olarak öne doğru dışbükeydir ve başın biçimini etkilemez (Gray, 1918). Pontin büküm oluşurken alar plaklar birbirinden ayrılmaya başlar ve borunun kanalı dördüncü karıncığa dönüşür (AlRayahi ve ark., 2026).

**Karıştırılmaması gereken:** OpenStax, yetişkin beyninde beyin sapı ile ön beyin arasındaki belirgin eğime de “sefalik büküm” der (OpenStax 13.1). Bu, yetişkindeki eksenin kırıldığı yerdir; embriyodaki bükümle aynı şey sanılmamalıdır. Bu kırılmanın yön terimlerini nasıl değiştirdiği ünitenin 1. dersinde (Anatominin dili) işlenecek.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Borunun boşluğu: karıncık sistemi',
      aciklama:
        'Beyin ve beyin sapı yarı saydam; önden, soldan ve yukarıdan bakıyoruz. İçerideki karıncıklar geldikleri keseciğin rengiyle boyandı: mavi yan karıncıklar uç beynin, turkuaz üçüncü karıncık ara beynin, mor orta beyin su yolu orta beynin, turuncu dördüncü karıncık arka beynin boşluğudur. Hepsi bir zamanlar tek bir borunun içindeki kesintisiz kanaldı. Omurilik ve onun merkezî kanalı modelde yoktur.',
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
      md: `**Karıncıklar nereden gelir?** Nöral tüpün boşluğu sonradan beynin karıncıklarına ve omuriliğin merkezî kanalına (*canalis centralis*) dönüşür (Gray, 1918). Dört karıncık ve onlara bağlı kanallar embriyonik beynin içindeki bu boşluğa kadar izlenebilir: uç beynin boşluğu yan karıncıklar (*ventriculus lateralis*), ara beyninki üçüncü karıncık (*ventriculus tertius*), orta beyninki orta beyin su yolu (*aquaeductus mesencephali*), arka beyninki dördüncü karıncık (*ventriculus quartus*), borunun arka bölümününki merkezî kanaldır (OpenStax 13.1; Gray, 1918). Gray’in tablosu dördüncü karıncığı üçe böler: alt kısmı miyelensefalona, ara kısmı metensefalona, üst kısmı ise arka beynin boğumuna (*isthmus rhombencephali*) aittir (Gray, 1918). Karıncıkların ayrıntısı Anatomi bölümünün **Karıncıklar ve beyin-omurilik sıvısı** dersinde işlenecek.

**Alar ve bazal plak.** Wilhelm His (1891, 1893), merkezî sinir sisteminin yan duvarlarının boydan boya iki boylamsal plaktan oluştuğunu gösterdi: karın tarafında **bazal plak**, sırt tarafında **alar plak**. His’e göre bazal plak birincil hareket merkezlerini, alar plak birincil duyu merkezlerini içerir; ikisinin sınırını karıncık yüzündeki bir oluk çizer, **sınır oluğu** (*sulcus limitans*) (Nieuwenhuys, 2011). Gray de kanalın en geniş yerinin yan duvarı sırttaki alar ve karındaki bazal laminaya ayırdığını yazar (Gray, 1918).

Omurilikte bu düzen yetişkinde de okunur: bazal plak karın tarafındaki orta hatta yakındır ve hareket nöronlarını verir; alar plak sırt taraftadır ve çevreden duyu girdisi alacak nöronları yapar (OpenStax 13.2). Alar plak daha sonra beyinciği de oluşturur (AlRayahi ve ark., 2026). Pontin büküm oluşurken alar plaklar birbirinden ayrılır ve kanal dördüncü karıncığa dönüşür (AlRayahi ve ark., 2026); yetişkinde dördüncü karıncığın tabanındaki sınır oluğu, alar ve bazal laminayı ayıran oluğun kalıntısıdır (Gray, 1918). Omurilik soğanında bazal laminanın hareket nöronları omurilikteki gibi sürekli bir sütun değil, ayrı çekirdekler hâlinde dizilir (Gray, 1918).`,
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
        ['Vagal nöral krista', 'Kalp kapakçıkları ve bölmelerine katkı; enterik sinir sistemi', 'Simões-Costa ve Bronner, 2013'],
        [
          'Gövde nöral kristası',
          'Arka kök (spinal) gangliyonlarının duyu nöronları ve satellit gliası; sempatik gangliyonlar; omurilik sinirleri boyunca Schwann hücreleri; böbrek üstü bezinin kromafin hücreleri; salgı hücreleri ve melanositler',
          'Simões-Costa ve Bronner, 2013; Mehrotra ve ark., 2020',
        ],
        [
          'Kafa plakodları',
          'Ön hipofiz; koku epiteli; göz merceği; trigeminal, fasiyal, glossofaringeal (petrozal) ve vagus (nodoz) gangliyonlarındaki büyük nöronlar',
          'Zine ve Fritzsch, 2023',
        ],
        ['Otik plakod', 'Çukurlaşarak ~24. günde otik çanağı, ~26. günde otik kisti yapar', 'Zine ve Fritzsch, 2023'],
      ],
      not: 'Nöral krista ve plakodlar, nöral plak kapanıp tavan plağını yaptığında hemen bitişikteki ektodermden gelişir (Zine ve Fritzsch, 2023). Gray (1918) kafa siniri gangliyonlarını da nöral kristaya bağlar; güncel kaynaklara göre bu gangliyonların büyük nöronları plakodlardan gelir. Gray’e göre nöral kristadan gelişen spinal gangliyonlar, kuyruk bölgesi dışında, ilkel segmentlerle aynı sayıdadır.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Nöral krista ve ön beyin bozuklukları',
      md: `Nöral krista, kök hücreye benzer özellikler (çok yönlülük ve kendini yenileme) taşıyan, omurgalılara özgü bir embriyonik hücre topluluğudur (Simões-Costa ve Bronner, 2013). Gelişimindeki bozukluklar, yani **nörokristopatiler**, kafa-yüz malformasyonlarının büyük çoğunluğundan sorumludur ve bu grupta 700’den fazla sendrom tanımlanmıştır (Simões-Costa ve Bronner, 2013). Böbrek üstü bezinin iç kısmındaki kromafin hücreler sempatik gangliyonlarla birlikte nöral kristadan geliştiği için bu bez, işlev bakımından bir sempatik gangliyon gibidir (OpenStax 15.1).

Ön beyinde orta hattaki bölünme gerçekleşmezse ön beyin iki ayrı yarıya ayrılamaz: **holoprosensefali**. AlRayahi ve arkadaşları derlemenin metninde bu bölünmeyi gebeliğin 3.–4. haftalarına koyar; öğretim noktalarında ise holoprosensefaliyi uç beynin 5. haftadaki bölünmesinin aksamasına bağlar. Derleme haftaların son adetten mi döllenmeden mi sayıldığını belirtmez (AlRayahi ve ark., 2026). Bu yüzden bu haftalar, bu dersteki döllenme sonrası takvimle doğrudan karşılaştırılmamalıdır (bkz. “İlk haftaların takvimi” tablosunun notu).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Ön nöropor ~25. gün → son lamina; arka nöropor ~27. gün (Ravi ve ark., 2021). Birincil nörülasyon 4. haftanın sonunda biter (Santos ve ark., 2024).
- **Birincil nörülasyon = kapanma, ikincil nörülasyon = kanalizasyon.** Açık spina bifida birincil, deriyle örtülü alt sağrı-kuyruk sokumu disrafizmi ikincil nörülasyonla ilişkilidir (Santos ve ark., 2024).
- Uç beyin → yan karıncıklar; ara beyin → 3. karıncık; orta beyin → su yolu; metensefalon (pons, beyincik) ve miyelensefalon (omurilik soğanı) → 4. karıncık; arka tüp → merkezî kanal (OpenStax 13.1).
- Bükümler: sefalik, servikal, pontin; pontin büküm öne dışbükeydir (Gray, 1918; AlRayahi ve ark., 2026).
- **Bazal plak hareket, alar plak duyu;** sınırları sınır oluğu (Nieuwenhuys, 2011).
- Nöral krista: arka kök ve otonom gangliyonlar, Schwann hücreleri, kromafin hücreler, melanositler, yüz iskeleti. Plakodlar: ön hipofiz, koku epiteli, mercek, V, VII, IX ve X gangliyonlarının büyük nöronları (Simões-Costa ve Bronner, 2013; Mehrotra ve ark., 2020; Zine ve Fritzsch, 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sınır oluğu nerede biter? Sütunlardan prosomerlere',
      md: `His’in modelinde gelişen beyin dört boylamsal plağa ayrılır, taban, bazal, alar ve tavan plakları; hepsi nöral tüp boyunca paralel uzanır (Puelles, 2024). Herrick ve Johnston beyin sapında her plağı ikiye böldü: bazal plakta somatomotor ve visseromotor, alar plakta visserosensitif ve somatosensitif sütunlar (Nieuwenhuys, 2011).

Sınır oluğunun ne kadar öne uzandığı ise tartışmalıdır. Nieuwenhuys’a göre karıncık yüzünde alar ve bazal plağın sınırını gösteren sınır oluğu rombensefalonla sınırlıdır; bu sonuç 16 anamniyot türünün beyin sapının topolojik analizine dayanır (Nieuwenhuys, 2011). Puelles ise His’e dayanarak sınır oluğunun bükümleri aşarak izlenebildiğini ve optik kiazmanın yakınında sona erdiğini yazar (Puelles, 2024). Terminologia Anatomica sınır oluğunu yalnızca dördüncü karıncığın tabanında (*fossa rhomboidea*) tanımlar (FIPAT, 2019). Pratik özet: yetişkinde sınır oluğu dördüncü karıncığın tabanında görülür; embriyoda alar–bazal sınır daha önde de izlenir.

Puelles’in savunduğu **prosomerik model**, beynin bütün bölümlerini kuran gelişimsel birimler olarak 20 enine **nöromer** önerir. Nöromerler bulundukları keseciğe göre prosomer (ön beyin), mezomer (orta beyin), rombomer (arka beyin) ve miyelomer (omurilik) diye adlandırılır. Bu modelde uç beyin, hipotalamusun hp2 prosomerinden çift taraflı ve sırt taraflı (alar) bir dışa keselenme olarak yorumlanır; yani klasik beş kesecik şemasından farklı bir düzen önerilir. Bazal plak bu modelde de esas olarak hareketle ilgili nöronları üretir: motor nöronlar, onlarla ilişkili ara nöronlar ve retiküler motor öğeler (Puelles, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Wilhelm His, rombik dudak ve beyinciğin kökeni',
      md: `Wilhelm His nöral kristayı 1868’de “Zwischenstrang” adıyla tanımladı; arka beyni ve beyin taslağının taban, bazal, alar ve tavan plakları, sınır oluğu ve istmus gibi temel öğelerini de o tarif etti (Glover ve Fritzsch, 2022). İnsan embriyosunun arka beyin kesitlerinde alar plakların uçlarının boylamsal bir pial olukla sınırlandığını gördü ve bunlara “Rautenlippen”, yani **rombik dudaklar** dedi. His rombik dudağı pontin çekirdekler, üst ve alt olivler ve koklear çekirdekler gibi göçmen hücre topluluklarının kaynağı olarak tanımladı. Fasiyal sinirin genikulat gangliyonunun Zwischenstrang’dan gelmediğini de erken fark etti ve bu “visseral gangliyonlar” için farklı bir köken düşündü (Glover ve Fritzsch, 2022). Bugün bu gangliyonların büyük nöronlarının plakodlardan geldiği bilinir (Zine ve Fritzsch, 2023); Gray’in (1918) kafa siniri gangliyonlarını bütünüyle nöral kristaya bağlayan anlatımı bu bakımdan eskimiştir.

Beyincikte ise Gray’in anlatımı güncel anlatımla çelişmez. Gray beyinciği bir yerde metensefalon tavanının kalınlaşması diye özetler; ayrıntılı anlatımında ise bu bölgedeki alar laminaların kalınlaşıp orta hatta kaynaştığını, flocculus ile nodulusun da rombik dudaktan geliştiğini yazar (Gray, 1918). Güncel anlatım da beyinciği alar plağa bağlar: pontin büküm alar plakları ayırır, ayrılan alar plağın kenarlarından yükselen rombik dudaklar orta hatta kaynaşarak beyincik plağını ve sonunda beyinciği yapar (AlRayahi ve ark., 2026).

Aynı derlemeye göre beyincik 5. haftada gelişmeye başlar ve farklılaşması iki yaşına kadar sürer; nörogenez 4. haftada başlar ve üçüncü üç aylık döneme kadar büyük ölçüde tamamlanır; sinaps oluşumu 12. haftada, miyelinlenme 16. haftada başlar ve doğumdan sonra sürer (AlRayahi ve ark., 2026). Derleme bu haftaları gebelik haftası (*weeks of gestation*) diye verir ama son adetten mi döllenmeden mi saydığını belirtmez; başka kaynaklar sinaps oluşumu ve miyelinleşme için farklı başlangıçlar verir (bkz. “İlk haftaların takvimi” tablosunun notu).

Dördüncü karıncığın alt örtüsünden (alt medüller velum) gelişen Blake kesesi delinerek orta açıklığı, Magendie deliğini açar: en erken 10. haftada, çoğunlukla 24–25. gebelik haftasından önce (AlRayahi ve ark., 2026). Omurilik kanalının alt ucunda ise konik bir genişleme bulunur: **son karıncık** (*ventriculus terminalis*) (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `**Boru kapanmazsa.** Nöral tüpün kapanması döllenmeden sonraki 21. ile 28. günler arasında olur; kapanma başarısız olursa **nöral tüp defektleri** (NTD) ortaya çıkar (Çaylan ve ark., 2022). NTD’ler sık görülen ve ağır doğumsal anomaliler arasındadır; yüz binlerce ölüme ve yaşayanlarda ömür boyu süren engelliliğe yol açar (Çaylan ve ark., 2022). Dünya Sağlık Örgütü (DSÖ) en sık görülen ağır doğumsal bozuklukları kalp defektleri, NTD’ler ve Down sendromu olarak sayar (DSÖ, 2023).

Klasik olarak iki grup vardır: beyni etkileyenler (**anensefali** ve **ensefalosel**) ve omuriliği etkileyenler (**spina bifida** biçimleri) (Çaylan ve ark., 2022). Anensefalide yalnızca borunun kafa kısmı etkilenir; ön beyin ve kafatası kubbesi yoktur (Isaković ve ark., 2022). Spina bifidanın üç sınıfı vardır: okülta, meningosel ve miyelomeningosel (OpenStax 13.1). **Spina bifida okültada** omur kemerinde bir açıklık vardır ama dışarıya bir fıtıklaşma ya da kese çıkmaz (Isaković ve ark., 2022). **Miyelomeningoselde** ise zarlar dışarı çıkar ve omurilik sinirleri de tutulduğu için ağır nörolojik belirtiler olabilir (OpenStax 13.1).

Dünyada 2015 yılı için 260.100 NTD’li doğum sonucu tahmin edildi; sıklık 10.000 canlı doğumda 18,6 idi (Blencowe ve ark., 2018, aktaran Çaylan ve ark., 2022). Türkiye’de ulusal sağlık veri sistemlerine dayanan çalışmada 2018’de doğanlar arasında 3475 NTD olgusu bulundu: 10.000 doğumda 27,5 (Çaylan ve ark., 2022).

Bu kusurların önemli bir bölümü önlenebilir. 1991’de yayımlanan MRC Vitamin Çalışması’nda, daha önce NTD’li bir gebelik geçirdiği için riski yüksek olan 1817 kadın rastgele gruplara ayrıldı; folik asit alanlarda koruyucu etki %72 bulundu (MRC Vitamin Study Research Group, 1991). ABD Önleyici Hizmetler Görev Gücü (USPSTF), gebelik planlayan ya da gebe kalabilecek herkese her gün 0,4–0,8 mg (400–800 mikrogram) folik asit içeren bir takviye önerir (USPSTF, 2023). Gebeliklerin çoğu plansız olduğu için birçok ülke temel gıdaları folik asitle zenginleştirir (Quinn ve ark., 2024); Çaylan ve arkadaşlarının yazdığı dönemde (2022) Türkiye’de böyle bir zenginleştirme programı uygulanmıyordu (Çaylan ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Folik asit gebelikten önce',
      md: 'Sinir borusu, döllenmeden sonraki dördüncü haftanın sonunda kapanmış olur (Santos ve ark., 2024). Bu yüzden takviyeye gebelikten **en az bir ay önce** başlanması ve gebeliğin **en az ilk 12 haftası** boyunca sürdürülmesi önerilir (Samaniego-Vaesken ve ark., 2024). Nöral tüp defekti riski yüksek olanlar bu aralığın üstünde dozlara gerek duyabilir ve bunu hekimleriyle konuşmalıdır (USPSTF, 2023). Buradaki bilgiler eğitim amaçlıdır; kişiye özel doz önerisi değildir.',
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
          'Beyin ve/veya zarlar kafatasındaki bir açıklıktan kese biçiminde fıtıklaşır',
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
      not: 'Açık ve kapalı defekt ayrımı beynin ya da omuriliğin açıkta kalıp kalmamasına dayanır (Isaković ve ark., 2022). Ensefaloselin hangi gruba konacağı kaynaklarda değişir; Isaković ve ark. onu kapalı defektlerin yanında anlatır. Ravi ve ark. (2021) açık ve kapalı defektleri kendi içinde tutarsız sınıflandırdığı için bu tabloda o sınıflama kullanılmadı.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Doğumdan önce tanı: limon, muz ve alfa-fetoprotein',
      md: `**Chiari tip II malformasyonu** çoğunlukla miyelomeningosel ve miyeloselle birliktedir: beyin sapı, omurlardaki açıklıktan aşağı doğru çekilir. Miyelomeningosel ve miyeloselin ultrason tanısı, rutin kontrolde görülen dolaylı “limon” ve “muz” işaretlerine dayanır (Isaković ve ark., 2022). Biyokimyasal olarak açık defektler amniyon sıvısında alfa-fetoprotein ve asetilkolinesteraz yüksekliğiyle saptanabilir; kapalı defektlerde bu biyokimyasal bozukluk yoktur (Ravi ve ark., 2021).`,
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
          'Medyanlar: Doğu Akdeniz 21,9; Güneydoğu Asya 15,8; Afrika 11,7; Amerika 11,5; Avrupa 9,0; Batı Pasifik 6,9',
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
          'Afyonkarahisar, 2003–2004; hastane kayıtları (canlı ve ölü doğumlar, terapötik düşükler)',
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
          '1,95; 2,05; 1,54 (yaşa göre standart insidans)',
          '100.000 kişide (nüfus)',
        ],
      ],
      not: 'Doğum başına sıklık, fetüs başına oran ve GBD’nin nüfus başına yaşa göre standart insidansı farklı ölçülerdir; aynı tabloda durmaları birbiriyle karşılaştırılabilecekleri anlamına gelmez. Zaganjor ve ark. bölge değerlerini medyan ve aralık olarak verir; aralıklar çok geniştir (Batı Pasifik’te 0,3–199,4). Afyonkarahisar değeri Zaganjor ve ark. tablosunda 35,9 diye geçer.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Türkiye’de NTD’nin yükü.** 2018 kohortundaki olguların %82,6’sı spina bifida, %12,2’si anensefali, %4,9’u ensefalosel, %0,3’ü tanımlanmamış NTD idi. Canlı doğan NTD’li bebeklerin %13,5’i ilk yılında, %15,6’sı Mart 2022 sonuna kadar öldü. 2014–2019 arasında NTD; fetal anomali nedeniyle yapılan gebelik sonlandırmalarının %11,7’sinde, ölü doğumların %2,5’inde ve bebek ölümlerinin %2,8’inde yer aldı. NTD’ye bağlı ölü doğum (10.000 doğumda 3,64) ve bebek ölüm hızı (10.000 canlı doğumda 4,65) en yüksek Doğu bölgesindeydi (Çaylan ve ark., 2022).

**Folik asit: kanıt.** MRC Vitamin Çalışması 7 ülkede 33 merkezde yürütüldü; 1817 yüksek riskli kadın dört gruba rastgele ayrıldı. Sonucu bilinen gebeliklerde 27 NTD vardı: folik asit alan gruplarda 6, öteki iki grupta 21. Bu, %72’lik bir koruyucu etkiye karşılık gelir (göreli risk 0,28); diğer vitaminlerin anlamlı bir koruyucu etkisi yoktu (MRC Vitamin Study Research Group, 1991). Çalışmada kullanılan doz günde 4 mg’dı (Wald, 2022). Bir şemsiye derlemede annenin folik asit kullanımı, doğumda NTD ile (göreli risk 0,31) ve NTD’nin tekrarlamasıyla anlamlı biçimde ters ilişkiliydi (Yoo ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Folik asit: doz.** Ortalama riskte ACOG, AAFP ve AAP, gebelik planlayan üreme çağındaki kişilere günde 400 µg (0,4 mg) önerir; USPSTF, gebelik planlayan ya da gebe kalabilecek herkes için günde 0,4–0,8 mg önerir (USPSTF, 2023). İngiltere ve ABD gibi ülkelerde daha önce NTD’li gebelik geçirmemiş olanlara 0,4 mg, geçirmiş olanlara 4 mg (ya da 5 mg) önerilir (Wald, 2022). Önceki NTD’li gebelik, ailede NTD öyküsü, ikiz gebelik, insüline bağımlı diyabet ve obezite (beden kitle indeksi 30’un üstü) gibi yüksek risk durumlarında 1–5 mg/gün önerilir (Samaniego-Vaesken ve ark., 2024).

**Zenginleştirme.** Zorunlu zenginleştirme ilk kez 1998’de ABD’de (100 g tahılda 140 µg folik asit) ve Kanada’da (100 g tahılda 150 µg) başladı. 31 Temmuz 2023’e kadar incelenen 193 ülkeden 69’u zorunlu, 47’si gönüllü zenginleştirme uyguluyordu; 77’sinde hiç yoktu. Zenginleştirme, hiç olmamasına göre %50–100 daha yüksek ortalama plazma folatı ve %25–50 daha düşük NTD sıklığıyla ilişkilidir; 75 ülkenin verisinde ortalama NTD sıklığı zorunlu, gönüllü ve zenginleştirmesiz ülkelerde sırasıyla 10.000 nüfusta (kaynaktaki birimle) 4,19; 7,61 ve 9,66’dır (Quinn ve ark., 2024).

**Türkiye’de durum.** Çaylan ve arkadaşlarına göre gebelik öncesi folik asit takviyesi 2014’ten beri Sağlık Bakanlığı rehberlerinde önerilir; ama yazdıkları dönemde (2022) temel gıdaların folik asitle zenginleştirilmesi programı uygulanmıyordu. Türkiye Beslenme Rehberi 2015’e göre doğurganlık çağındaki kadınların %30’dan fazlasında folat alımı tahmini ortalama gereksinimin altındadır; bir çalışmada 15 yaşın üstündeki kadınların %40,2’sinde folat eksikliği ya da yetersizliği (<5,9 ng/mL) bulundu. Yazarlar, NTD sıklığını ve buna bağlı ölümleri azaltmak için zorunlu zenginleştirmenin düşünülmesi gerektiği sonucuna varır (Çaylan ve ark., 2022).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Rutin ultrasonda limon ve muz',
      oyku: `29 yaşında, ilk gebeliğindeki bir kadının rutin ultrason kontrolünde fetüste dolaylı “limon” ve “muz” işaretleri görülüyor. Amniyon sıvısında alfa-fetoprotein ve asetilkolinesteraz yüksek bulunuyor. Gebeliğin plansız olduğunu, gebelikten önce folik asit kullanmadığını söylüyor.`,
      soru: 'Bulgular hangi gelişim basamağındaki bir aksaklığı düşündürür; doğumdan sonra ve bir sonraki gebelikte neler konuşulmalıdır?',
      cozum: `**Ne düşündürür?** Limon ve muz işaretleri, Chiari tip II malformasyonuyla birlikte görülen miyelomeningosel ve miyeloselin ultrasondaki dolaylı işaretleridir (Isaković ve ark., 2022). Amniyon sıvısında alfa-fetoprotein ve asetilkolinesteraz yüksekliği de **açık** bir defekti gösterir; kapalı defektlerde bu bozukluk yoktur (Ravi ve ark., 2021). Açık spina bifida çoğunlukla bel ve üst sağrı düzeyinde **birincil nörülasyonun** kapanma kusurundan doğar (Santos ve ark., 2024); arka nöropor normalde yaklaşık 27. günde kapanır (Ravi ve ark., 2021).

**Doğumdan sonra:** Ravi ve arkadaşlarının aktarımına göre açık defekt, enfeksiyon tehlikesini azaltmak için doğumdan sonraki 24–48 saat içinde onarılmalıdır; Chiari II malformasyonu doğumda sık görülen hidrosefaliyi büyük olasılıkla açıklar (Ravi ve ark., 2021).

**Bir sonraki gebelik:** Daha önce NTD’li gebelik geçirmiş olmak yüksek risk demektir; MRC çalışması tam da bu grupta folik asidin %72’lik koruyucu etkisini göstermiştir (MRC Vitamin Study Research Group, 1991). Bu durumda İngiltere ve ABD gibi ülkelerde 4 mg (ya da 5 mg) gibi yüksek dozlar önerilir (Wald, 2022) ve takviyeye gebelikten en az bir ay önce başlanması gerekir (Samaniego-Vaesken ve ark., 2024). Doz kararı hekimle verilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Açık spina bifida: ameliyat zamanı, hidrosefali ve Türkiye verisi',
      md: `Ravi ve arkadaşlarının aktarımına göre açık defekt doğumdan sonraki 24–48 saat içinde onarılmalıdır; ameliyat edilmeyen bebeklerin yalnızca %20’si iki yaşına ulaşır. Miyelomeningoselde görülen Chiari II malformasyonu, doğumda olguların büyük bölümünde bulunan hidrosefaliyi büyük olasılıkla açıklar; ancak aynı makale bu oranı bir yerde yaklaşık %80, başka bir yerde %90’ın üzerinde verir (Ravi ve ark., 2021). Chiari II’de beyin sapı omurlardaki açıklıktan aşağı doğru çekilir (Isaković ve ark., 2022).

Türkiye’de 2015–2021 arasında NTD tanısı alan 7606 canlı doğan yenidoğanı kapsayan, hastane kayıtlarına dayanan ulusal geriye dönük kohortta olguların %30,3’üne cerrahi girişim yapıldı. Cerrahi oranı bölgeden bölgeye belirgin biçimde değişiyordu ve en yüksek Güneydoğu Anadolu’daydı (Korkmaz ve Bilge, 2025). Çalışmanın sağkalım süresine ilişkin bulguları, bu dersin değerlendirmesine göre izlem süresinden etkilenebileceği için burada kullanılmadı.

Kapalı defektlerde düzey ve mekanizma farklıdır: deriyle örtülü disrafik durumlar alt sağrı ve kuyruk sokumu düzeyinde ikincil nörülasyonun bozulmasından doğar (Santos ve ark., 2024). Civciv verilerinin insana uyarlanmasına göre birincil ve ikincil boruların birleşim bölgesi alt göğüs ile üst sağrı omurilik bölümleri arasında değişir (Yang ve ark., 2021).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'NTD ve folik asit sayılarını okurken',
      md: `**Birimler.** Doğum başına sıklık (Türkiye’de 2018’de 10.000 doğumda 27,5; dünyada 2015’te 10.000 canlı doğumda 18,6; Çaylan ve ark., 2022) ile GBD’nin nüfus başına yaşa göre standart insidansı (Babaei-Ghazani ve ark., 2025) farklı ölçülerdir; bu yüzden birbiriyle karşılaştırılmamalıdır. Quinn ve arkadaşlarının değerleri de kaynakta “10.000 nüfusta” diye yazılır (Quinn ve ark., 2024); bunlar da doğum başına sıklıkla doğrudan karşılaştırılmamalıdır. GBD 2021’e göre Türkiye’de yaşa göre standart NTD insidansı 1990’da 100.000 kişide 3,82 iken 2021’de 1,54’e, ölüm hızı 3,29’dan 0,5’e, DALY hızı 296,29’dan 48,52’ye indi. Ortadoğu ve Kuzey Afrika bölgesinde yaşa göre standart DALY hızı aynı dönemde %72,72 azaldı (Babaei-Ghazani ve ark., 2025). GBD, folik asit takviyesinin ve tahıl zenginleştirmesinin, bunu uygulayan ülkelerde NTD insidansındaki düşüşe katkı verdiğini yazar (GBD 2021 Nervous System Disorders Collaborators, 2024).

**Eşitsizlik.** NTD kayıt ya da sürveyans sistemi bulunma oranı ülke geliriyle artar: düşük gelirli ülkelerde %0, alt-orta gelirde %25, üst-orta gelirde %70, yüksek gelirde %91 (Zaganjor ve ark., 2016). NTD’ye bağlı ölümlerin %85’i GSYH’si en düşük çeyrekteki ülkelerdedir (Isaković ve ark., 2022).

**Çelişen sayılar.** MRC çalışmasının etkisi özetinde %72 (göreli risk 0,28) diye geçer; Wald aynı çalışma için vitaminsiz kapsül alanlara göre %71, gebelikten önce başlayıp gebeliğin ilk haftalarında da sürdürenlerle sınırlı “tedavi altında” analizde %83 azalma yazar (MRC Vitamin Study Research Group, 1991; Wald, 2022). Isaković ve arkadaşlarının (2022) 1991 sonucunu 0,4 mg’lık doza bağlaması yanlıştır: MRC dozu 4 mg’dır (Wald, 2022). Babaei-Ghazani ve arkadaşlarının (2025) DSÖ önerisi diye verdiği “günde en az 300 µg” değeri de öteki bütün kaynakların 400 µg değeriyle uyuşmaz. Zorunlu zenginleştirme yapan ülke sayısı Quinn ve arkadaşlarına göre Temmuz 2023’te 69’dur (Quinn ve ark., 2024); başka bir derleme “90’dan fazla” der (Yoo ve ark., 2026); fark tanım ve tarihten kaynaklanabilir. Wald’a göre hiçbir Avrupa ülkesi folik asit zenginleştirmesi başlatmamıştır (Wald, 2022); burada zorunlu zenginleştirme kastedilir, çünkü Quinn ve arkadaşları Avrupa’nın çoğunda gönüllü zenginleştirme olduğunu yazar (Quinn ve ark., 2024).

**Güvenlik ve eşikler.** Erişkinler için, gebe ve emzirenler dahil, folik asidin tolere edilebilir üst alım düzeyi genel kabulle 1000 µg/gündür (Samaniego-Vaesken ve ark., 2024). Wald ise folik aside yanlışlıkla nörolojik toksisite atfedilmesinin birçok ülkede zenginleştirmenin önünde engel olduğunu savunur (Wald, 2022). Annede eritrosit folatı için “yetersiz” eşiği <906 nmol/L olarak belirlenmiştir; bu düzeyin üstünde NTD riskinde ek yarar görülmemiştir (Yoo ve ark., 2026).`,
    },
  ],
};
