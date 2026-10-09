import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** Bu bölümün küçük kemiklerine sahnelerde verilen renkler (yalnızca tanıtır). */
const RENK = {
  burun: KEMIK_RENGI.kucukYuz,
  gozyasi: '#8d6e63',
  damak: '#577590',
  sapan: '#b56576',
  kavka: '#9c89b8',
};

/** 8. bölüm: alt çene dışındaki yüz kemikleri; göz çukuru, burun boşluğu ve sert damağın kuruluşu. */
export const yuzKemikleri: DersBolumu = {
  id: 'yuz-kemikleri',
  baslik: 'Yüz kemikleri: üst çene, elmacık kemiği ve beş küçük kemik',
  bloklar: [
    // ——— Giriş ———
    {
      tur: 'metin',
      md: `Yüzün iskeletini 14 kemik yapar. Bu bölümde alt çene dışındaki on üç kemiği tek tek ele alıyoruz: yüzün her yanında birer tane bulunan **üst çene**, **elmacık**, **burun**, **gözyaşı** ve **damak kemikleri** ile **alt burun kavkası**, bir de orta hatta tek duran **sapan kemiği** (*vomer*) (OpenStax 7.2). Alt çene kendi bölümünde anlatılıyor.

Bu kemikler üç boşluğun duvarlarını örer: göz çukuru, burun boşluğu ve ağzın tavanı olan sert damak. Kalbur kemiği beyin kutusu kemiklerinden sayılır ama burun bölmesine, burun boşluğunun ve göz çukurunun duvarlarına da katılır; bu yüzden aşağıda adı sık sık geçecek (OpenStax 7.2).

Yüz, beyin kutusundan geç büyür. Doğumda yüzün hacmi beyin kutusununkinin yalnızca sekizde biri kadardır; erişkinde yarısına ulaşır. Bebeğin yüzünün küçük olmasının başlıca nedenleri çenelerin henüz gelişmemiş, dişlerin çıkmamış ve sinüslerin küçük olmasıdır; doğumda burun boşlukları da neredeyse tümüyle iki göz çukurunun arasında kalır. Ergenliğe yaklaşırken yüzde ikinci bir büyüme atağı olur ve bu atak sinüslerin gelişmesiyle birlikte yürür. Yaşlılıkta en çarpıcı değişiklik, dişler döküldükçe diş yuvası çıkıntılarının erimesi ve çenelerin küçülmesidir (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Alt çene dışındaki on üç yüz kemiği',
      aciklama:
        'Kafatasına önden bakıyoruz. Bu bölümün kemikleri renkli: pembe üst çene, deniz yeşili elmacık kemiği, krem rengi burun kemiği, kahverengi gözyaşı kemiği, lila alt burun kavkası, gül kurusu sapan kemiği ve koyu mavi damak kemiği. Alt çene ve beyin kutusu kemikleri doğal renginde bırakıldı. Damak kemiği ile sapan kemiğinin büyük kısmı burnun derinliğinde saklıdır; “Ayrıştır” ile kemikleri birbirinden uzaklaştırınca daha iyi görünürler.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'on',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
          { secici: ['elmacik-kemigi'], renk: KEMIK_RENGI.elmacik },
          { secici: ['burun-kemigi'], renk: RENK.burun },
          { secici: ['gozyasi-kemigi'], renk: RENK.gozyasi },
          { secici: ['alt-burun-kavkasi'], renk: RENK.kavka },
          { secici: ['sapan-kemigi'], renk: RENK.sapan },
          { secici: ['damak-kemigi'], renk: RENK.damak },
        ],
        etiketler: [
          { yapi: 'ust-cene-kemigi-sol', metin: 'Üst çene' },
          { yapi: 'elmacik-kemigi-sol', metin: 'Elmacık kemiği' },
          { yapi: 'burun-kemigi-sol', metin: 'Burun kemiği' },
          { yapi: 'gozyasi-kemigi-sol', metin: 'Gözyaşı kemiği' },
          { yapi: 'alt-burun-kavkasi-sol', metin: 'Alt burun kavkası' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'liste'],
    },

    // ——— Üst çene ———
    {
      tur: 'metin',
      md: `**Üst çene kemiği** (*maxilla*) alt çeneden sonra yüzün en büyük kemiğidir; sağ ve sol üst çene birleşerek üst çenenin tamamını yapar. Her biri üç boşluğun sınırına katılır: ağzın tavanı, burun boşluğunun tabanı ve yan duvarı, göz çukurunun tabanı (Gray, 1918). Yüzün ortasındaki bu kemik bir taşıyıcı gibi de çalışır: çiğnerken doğan kuvvetler üst çenenin alın ve elmacık çıkıntıları üzerinden kafatasına iletilir (Soriano ve Brizuela, 2025).

Kemik bir **gövde** ve ondan uzanan **dört çıkıntıdan** oluşur (Gray, 1918):

- **Alın çıkıntısı** (*processus frontalis*): burnun yanından yukarı, alın kemiğine uzanan güçlü bir levha.
- **Elmacık çıkıntısı** (*processus zygomaticus*): gövdenin yan köşesindeki pürüzlü kabartı; elmacık kemiğiyle eklem yapar.
- **Diş yuvası çıkıntısı** (*processus alveolaris*): üst dişleri taşıyan kavisli alt kısım; her üst çenede sekiz diş yuvası vardır.
- **Damak çıkıntısı** (*processus palatinus*): gövdeden içeri uzanan yatay levha; karşı taraftakiyle sert damağın büyük kısmını yapar.

Gövde piramide benzer ve içi boştur: içinde büyük bir hava boşluğu, **maksiller sinüs** (*sinus maxillaris*) bulunur (Gray, 1918).

Önden bakınca en çok işe yarayan işaretler şunlardır:

- **Göz altı kenarı** (*margo infraorbitalis*): göz çukurunun alt kenarı; üst çene ile elmacık kemiği birlikte yapar (Gray, 1918).
- **Göz altı deliği** (*foramen infraorbitale*): göz altı kenarının ortalama 6–7 mm altında açılır (Singh, 2011; Nanayakkara ve ark., 2016). Göz altı siniri ve damarları buradan yüze çıkar (Gray, 1918); bu sinir burnun, üst dudağın ve yanağın ön kısmının duyusunu taşır (OpenStax 7.2).
- **Köpek dişi çukuru** (*fossa canina*): göz altı deliğinin altındaki çukurluk (Gray, 1918).
- **Ön burun dikeni** (*spina nasalis anterior*): iki üst çenenin burun çentiklerinin altta birleşerek yaptığı sivri çıkıntı; burnun kemik açıklığının alt kenarının ortasındadır (Gray, 1918).
- **Üst çene yumrusu** (*tuber maxillae*): gövdenin arka-alt kısmındaki kabarıklık; yirmi yaş dişi çıktıktan sonra belirginleşir (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Sol üst çene tek başına: önden',
      aciklama:
        'Sol üst çeneye önden bakıyoruz; kemik tek başına, pembe. Yukarı uzanan alın çıkıntısı, yana uzanan elmacık çıkıntısı ve dişleri taşıyan diş yuvası çıkıntısı görülüyor. Göz altı kenarının hemen altında göz altı deliği, iç-alt köşede ön burun dikeni var. Köpek dişi çukuru modelde çok sığdır (yalnızca bir düzleşme); nokta yerini gösterir. Damak çıkıntısı bu bakıştan görünmez; aşağıdaki “Sert damak alttan” sahnesinde işaretli.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['ust-cene-kemigi-sol'],
        vurgula: ['ust-cene-kemigi-sol'],
        boya: [{ secici: ['ust-cene-kemigi-sol'], renk: KEMIK_RENGI.ustCene }],
        noktalar: [
          { nokta: 'ust-cene-alin-cikintisi-sol' },
          { nokta: 'ust-cene-elmacik-cikintisi-sol' },
          { nokta: 'goz-alti-kenari-sol' },
          { nokta: 'goz-alti-deligi-sol' },
          { nokta: 'kopek-disi-cukuru-sol' },
          { nokta: 'on-burun-dikeni' },
          { nokta: 'ust-cene-dis-yuvasi-cikintisi-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      md: `**Maksiller sinüs** üst çenenin gövdesini dolduran, duvarları her yerde çok ince olan bir hava boşluğudur (Gray, 1918). Komşulukları onu klinikte önemli kılar:

- **Tavanı** göz çukurunun tabanıdır (Shumway ve ark., 2023).
- **İç duvarı** burun boşluğunun yan duvarıdır; sinüs burna bu duvarın üst kısmındaki küçük bir ağızla, orta burun yolundan (orta ve alt burun kavkaları arasındaki geçitten) açılır (Gray, 1918). Ağız yüksekte olduğu için sinüs zor boşalır (OpenStax 7.2).
- **Tabanı** diş yuvası çıkıntısıdır: birinci ve ikinci büyük azı dişlerinin köklerine karşılık gelen konik kabarıklıklar tabana doğru uzanır ve bazı kişilerde kökler tabanı deler (Gray, 1918).

Sinüsün büyüklüğü kişiden kişiye, hatta aynı kişinin iki yanı arasında değişir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yenidoğanın üst çenesi neredeyse yalnızca diş yuvası çıkıntısından ibarettir: diş yuvaları neredeyse göz çukurunun tabanına kadar uzanır, maksiller sinüs ise burnun yan duvarında küçük bir oluktur (Gray, 1918). Sinüs doğumda yaklaşık 7 × 4 × 3 mm iken 15–18 yaşında 34 × 32 × 28 mm’ye ulaşır; büyümesi ancak yirmili yaşlarda durur (Lee ve ark., 2022). Erişkinde üst çenenin en büyük çapı dikey çaptır; bunun nedeni diş yuvası çıkıntısının gelişmesi ve sinüsün büyümesidir (Gray, 1918).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Gövdenin dört yüzü vardır: ön, arka (infratemporal), üst (göz çukuru) ve iç (burun) yüzü. Üst çene ayrıca iki çukura (infratemporal ve pterigopalatin) ve iki yarığa (alt orbital ve pterigomaksiller) katılır (Gray, 1918).

**Ön yüz** (*facies anterior*). Alt kısmında diş köklerine karşılık gelen kabartılar sıralanır. Kesici dişlerin üstünde sığ **kesici çukur**, onun dışında köpek dişi yuvasına karşılık gelen dikey **köpek dişi kabartısı**, kabartının dışında da kesici çukurdan daha geniş ve derin **köpek dişi çukuru** bulunur. Çukurun üstünde, göz altı kanalının ucu olan göz altı deliği açılır. Yüzün iç kenarı derin **burun çentiğidir** (*incisura nasalis*); çentik aşağıda sivri bir uçla biter ve karşı taraftakiyle ön burun dikenini yapar (Gray, 1918).

**Arka (infratemporal) yüz** (*facies infratemporalis*). Ön yüzden elmacık çıkıntısı ve birinci büyük azı dişinin yuvasından yükselen güçlü bir sırtla ayrılır; infratemporal çukurun ön duvarına katılır. Ortasında **diş yuvası kanallarının** ağızları vardır; arka üst alveoler damarlar ve sinirler bunlardan geçer (Gray, 1918). Terminologia Anatomica’nın notuna göre üst çenede genellikle üç takım alveoler delik bulunur (FIPAT, 2019). Alt kısımdaki üst çene yumrusu dış yanında damak kemiğinin piramit çıkıntısıyla eklem yapar ve **medial pterigoid kasın** birkaç lifine başlangıç verir. Yumrunun hemen üstündeki düz alan pterigopalatin çukurun ön sınırıdır ve maksiller sinir için bir oluk taşır (Gray, 1918). Üst çene kama kemiğinin pterigoid çıkıntısından ayrılırken aralarında üçgen bir aralık kalır: **pterigomaksiller yarık**. Buradan maksiller atardamarın (Gray’de iç maksiller arter) son kısmı geçer (Gray, 1918); Terminologia Anatomica’ya göre *fissura pterygomaxillaris* adı, *fissura pterygopalatina*’dan daha doğrudur (FIPAT, 2019).

**Üst (göz çukuru) yüzü** (*facies orbitalis*). Düz ve üçgen biçimlidir; göz çukuru tabanının büyük kısmını yapar. Arka kenarı alt orbital yarığın (*fissura orbitalis inferior*) ön kenarıdır. Arka kısmının ortasına yakın başlayan **göz altı oluğu** (*sulcus infraorbitalis*) önde **göz altı kanalına** (*canalis infraorbitalis*) dönüşür; göz altı damarları ve siniri bu yoldan geçer. Kanaldan ayrılan ince bir kanal sinüsün ön duvarında ilerleyerek ön üst alveoler damar ve sinirleri ön dişlere götürür; bazen sinüsün yan duvarında, orta alveoler siniri küçük azı dişlerine götüren ikinci bir kanal bulunur. Gözyaşı oluğunun hemen dışındaki küçük çukurluktan **alt oblik kas** (*musculus obliquus inferior*) başlar (Gray, 1918); bu kas, göz çukurunun tepesinden başlamayan tek dış göz kasıdır (Shumway ve ark., 2023).

**İç (burun) yüzü** (*facies nasalis*). Maksiller sinüse açılan büyük, düzensiz bir delik, **sinüs açıklığı** (*hiatus maxillaris*) taşır. Açıklığın arkasındaki oluk damak kemiğiyle birlikte **büyük damak kanalına** (*canalis palatinus major*; Gray’de eski adıyla pterigopalatin kanal) dönüşür. Açıklığın önündeki derin **gözyaşı oluğu** (*sulcus lacrimalis*) gözyaşı kemiği ve alt burun kavkasıyla tamamlanarak **burun-gözyaşı kanalını** (*canalis nasolacrimalis*) yapar; kanal burun-gözyaşı yolunu taşır ve alt burun yoluna açılır. Daha önde eğik **kavka sırtı** (*crista conchalis*) alt burun kavkasıyla eklem yapar (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sol üst çene yandan: arka yüz ve yumru',
      aciklama:
        'Sol üst çeneye soldan bakıyoruz; kemik tek başına. Elmacık çıkıntısının arkasında kalan dışbükey yüz infratemporal yüzdür; alt-arka köşedeki kabarıklık üst çene yumrusudur ve damak kemiğinin piramit çıkıntısı buna yaslanır. Önde ön burun dikeni, yukarıda alın çıkıntısı, altta diş yuvası çıkıntısı görülür. Arka üst alveoler kanalların ağızları modelde yoktur; yerleri infratemporal yüzün ortasıdır.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['ust-cene-kemigi-sol'],
        vurgula: ['ust-cene-kemigi-sol'],
        boya: [{ secici: ['ust-cene-kemigi-sol'], renk: KEMIK_RENGI.ustCene }],
        noktalar: [
          { nokta: 'ust-cene-yumrusu-sol' },
          { nokta: 'ust-cene-govdesi-sol' },
          { nokta: 'ust-cene-elmacik-cikintisi-sol' },
          { nokta: 'ust-cene-alin-cikintisi-sol' },
          { nokta: 'on-burun-dikeni' },
          { nokta: 'ust-cene-dis-yuvasi-cikintisi-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sol üst çene içten: sinüs açıklığı',
      aciklama:
        'Sol üst çenenin burun boşluğuna bakan iç yüzünü görüyoruz (orta hattan, sağ yandan bakış). Ortadaki geniş delik sinüs açıklığıdır. Tek başına kemikte bu açıklık çok büyüktür; kafatasında dört komşu kemik onu daraltır ve canlıda genellikle yalnızca küçük bir ağız kalır. Açıklığın önünde gözyaşı oluğu, arkasında damak kemiğinin dik plağının oturduğu yüzey vardır; bu ayrıntılar modelde silik olduğu için yalnızca açıklık işaretlendi.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'ic-sol',
        goster: ['ust-cene-kemigi-sol'],
        vurgula: ['ust-cene-kemigi-sol'],
        boya: [{ secici: ['ust-cene-kemigi-sol'], renk: KEMIK_RENGI.ustCene }],
        noktalar: [{ nokta: 'ust-cene-sinusu-acikligi-sol' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Elmacık çıkıntısı** pürüzlü, üçgen bir kabartıdır; üst yüzü tırtıklıdır ve elmacık kemiğiyle eklem yapar. Maksiller sinüsün yana bakan tepesi bu çıkıntının içine uzanır (Gray, 1918).

**Alın çıkıntısı** burnun yanından yukarı, içe ve geriye uzanan güçlü bir levhadır. Dış yüzüne göz çevresi kası (*musculus orbicularis oculi*) ve iç göz kapağı bağı (*ligamentum palpebrale mediale*) tutunur. İç yüzündeki eğik **kalbur sırtının** (*crista ethmoidalis*) arka ucu orta burun kavkasıyla eklem yapar; ön kısmına **agger nasi** denir. Arka kenarındaki oluk, gözyaşı kemiğindeki olukla birleşerek **gözyaşı kesesi çukurunu** yapar. Oluğun dış kenarı **ön gözyaşı sırtıdır** (*crista lacrimalis anterior*) ve aşağıda göz çukuru kenarına devam eder; sırtın göz çukuru yüzüyle buluştuğu yerdeki küçük **gözyaşı tüberkülü**, gözyaşı kesesinin yerini bulmada kılavuzdur (Gray, 1918).

**Diş yuvası çıkıntısı** kemiğin en kalın ve en süngersi kısmıdır. Sekiz diş yuvası taşır: en derin yuva köpek dişininkidir, büyük azı dişlerininkiler en geniştir ve ince bölmelerle küçük odalara ayrılır. Dış yüzünden, birinci büyük azı dişine kadar, yanak kası (*musculus buccinator*) başlar. İki üst çenenin diş yuvası çıkıntıları birlikte **diş yuvası kemerini** yapar; kemerin ön kenarının ortasına **alveoler nokta** denir (Gray, 1918).

**Damak çıkıntısı** karşıdakiyle birlikte sert damağın ön dörtte üçünü yapar. Arka-dış kenarındaki oluk (bazen kanal) inen damak damarlarını ve **büyük damak sinirini** taşır (Gray, 1918). Gray bu siniri “ön damak siniri” diye anar; Terminologia Anatomica, adını içinde bulunduğu kanalın ve deliğin adına uydurmuştur (*nervus palatinus major*) (FIPAT, 2019). Kesici dişlerin hemen arkasında, orta hatta huni biçimli **kesici delik** açılır (Gray’de *incisive foramen*; Terminologia Anatomica’da *fossa incisiva*). Deliğin içinde iki yan kanalın (Stenson delikleri; *foramina incisiva*) ağzı görülür; her birinden inen damak atardamarının son dalı ve **nazopalatin sinir** geçer. Bazen orta hatta iki ek kanal (Scarpa delikleri) bulunur ve nazopalatin sinirleri taşır. Damak çıkıntısının iç kenarı yukarı doğru **burun sırtı** (*crista nasalis*) olarak yükselir; karşıdakiyle birlikte sapan kemiğinin oturduğu oluğu yapar (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üst çenenin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        ['Göz altı deliği', '*Foramen infraorbitale*', 'Ön yüz; göz altı kenarının ortalama 6–7 mm altı', 'Göz altı siniri ve damarları'],
        [
          'Köpek dişi çukuru ve kabartısı',
          '*Fossa canina*',
          'Ön yüz; çukur, köpek dişi kabartısının dışında ve göz altı deliğinin altında',
          'Kabartı köpek dişinin yuvasına karşılık gelir',
        ],
        [
          'Burun çentiği, ön burun dikeni',
          '*Incisura nasalis*, *Spina nasalis anterior*',
          'Ön yüzün iç kenarı; iki tarafın dikeni orta hatta birleşir',
          'Burnun kemik açıklığının yan ve alt kenarı',
        ],
        ['Diş yuvası kanalları', '*Foramina alveolaria*', 'Arka (infratemporal) yüzün ortası', 'Arka üst alveoler damarlar ve sinirler'],
        [
          'Üst çene yumrusu',
          '*Tuber maxillae*',
          'Arka yüzün alt kısmı',
          'Medial pterigoid kasın birkaç lifi; damak kemiğinin piramit çıkıntısıyla eklem',
        ],
        ['Maksiller sinir oluğu', '—', 'Yumrunun üstündeki düz alan (pterigopalatin çukurun ön sınırı)', 'Maksiller sinir'],
        [
          'Göz altı oluğu ve kanalı',
          '*Sulcus infraorbitalis*, *Canalis infraorbitalis*',
          'Göz çukuru yüzünün arka kısmından öne',
          'Göz altı siniri ve damarları; kanaldan ön (bazen orta) üst alveoler dallar ayrılır',
        ],
        ['Alt oblik kasın çukurcuğu', '—', 'Göz çukuru yüzünün ön-iç kısmı, gözyaşı oluğunun dışı', 'Alt oblik kas'],
        ['Sinüs açıklığı', '*Hiatus maxillaris*', 'İç (burun) yüzü', 'Maksiller sinüsün ağzı; eklemli kafatasında dört kemikle daralır'],
        [
          'Gözyaşı oluğu',
          '*Sulcus lacrimalis*',
          'İç yüz, sinüs açıklığının önü',
          'Gözyaşı kemiği ve alt kavka ile burun-gözyaşı kanalını yapar',
        ],
        ['Kavka sırtı', '*Crista conchalis*', 'İç yüz, gözyaşı oluğunun önü', 'Alt burun kavkası ile eklem'],
        [
          'Kalbur sırtı, agger nasi',
          '*Crista ethmoidalis*, *Agger nasi*',
          'Alın çıkıntısının iç yüzü',
          'Arka ucu orta burun kavkası ile eklem',
        ],
        [
          'Ön gözyaşı sırtı, gözyaşı tüberkülü',
          '*Crista lacrimalis anterior*',
          'Alın çıkıntısının arka kenarı',
          'Gözyaşı kesesi çukurunun dış kenarı; tüberkül kesenin yerini gösterir',
        ],
        ['Diş yuvaları', '*Alveoli dentales*', 'Diş yuvası çıkıntısı', 'Sekiz diş; dış yüzden yanak kası (birinci büyük azıya kadar)'],
        [
          'Kesici delik ve kanallar',
          '*Fossa incisiva*, *Foramina incisiva*, *Canales incisivi*',
          'Damak, kesici dişlerin arkası, orta hat',
          'Nazopalatin sinir; inen damak atardamarının son dalı',
        ],
        ['Büyük damak oluğu', '*Sulcus palatinus major*', 'Damak çıkıntısının arka-dış kenarı', 'İnen damak damarları, büyük damak siniri'],
        ['Burun sırtı', '*Crista nasalis*', 'Damak çıkıntısının iç kenarı', 'Karşıdakiyle sapan kemiğinin oturduğu oluk'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Singh (2011); Nanayakkara ve ark. (2016); Shumway ve ark. (2023). Gray’in kitabında bu yapıların çoğu İngilizce adlarıyla geçer; “—” olan satırlarda ayrı bir Latince terim verilmedi.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Eklemler.** Üst çene dokuz kemikle eklem yapar: beyin kutusundan alın ve kalbur kemikleri; yüzden burun, elmacık, gözyaşı ve damak kemikleri, alt burun kavkası, sapan kemiği ve karşı taraftaki üst çene (Gray, 1918).

**Kemikleşme.** Üst çene kıkırdak bir model olmadan, doğrudan zarda kemikleşir. Gray’in aktardığı Mall ve Fawcett’e göre yalnızca iki merkez vardır: biri asıl üst çene, biri **premaksilla** (*os incisivum*) için. Merkezler fetal 6. haftada belirir ve 3. ayın başında birleşir; ancak iki parça arasındaki dikiş damakta orta yaşa kadar görülebilir. Eskiden altı merkez tanımlanırdı (Gray, 1918). Premaksilla kesici dişlerin yuvalarını taşıyan küçük ön parçadır; genç kafataslarında kesici delikten yan kesici diş ile köpek dişinin arasına uzanan ince bir dikişle ayrılır ve çoğu omurgalıda ayrı bir kemiktir (Gray, 1918). Terminologia Anatomica’nın notu ise insanda ayrı bir kesici kemik ya da kesici dikiş bulunmasının olağan olmadığını vurgular (FIPAT, 2019); iki kaynak, dikişin ne kadar sık ve ne kadar uzun süre görüldüğü konusunda farklı vurgular yapar.

**Sinüsün gelişimi.** Gray’e göre maksiller sinüs fetal 4. ayda kemiğin burun yüzünde sığ bir oluk olarak belirir ve tam büyüklüğüne kalıcı dişler çıktıktan sonra ulaşır (Gray, 1918). Güncel bir derleme sinüsün gelişmeye başlayan ilk paranazal sinüs olduğunu ve gelişimin gebeliğin 3. ayında başladığını yazar (Lee ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Maksiller sinüsün ayrıntıları',
      md: `**Biçim.** Sinüs piramit biçimlidir: tepesi yana bakar ve elmacık çıkıntısının içindedir, tabanı içe bakar ve burnun yan duvarıdır. Göz altı kanalı tavandan ön duvara uzanan belirgin bir sırt olarak sinüsün içine kabarır (Gray, 1918).

**Ağız.** Tek başına kemikte burun duvarındaki açıklık büyüktür. Eklemli kafatasında dört komşu onu daraltır: üstte kalbur kemiğinin çengel çıkıntısı (*processus uncinatus*), altta alt burun kavkasının kalbur çıkıntısı, arkada damak kemiğinin dik kısmı, önde-üstte gözyaşı kemiğinin küçük bir parçası. Canlıda genellikle üst kısımda tek bir küçük ağız kalır, öbür aralık mukozayla kapanır (Gray, 1918). Gray’in *ostium maxillare* dediği bu ağız orta burun yolunda, kalbur kabarcığının (*bulla ethmoidalis*) altında ve çengel çıkıntının gerisinde gizlidir; hiatus semilunaris’in alt kısmına açılır ve hemen yakınında ikinci, ek bir ağız sık görülür (Gray, 1918).

**Taban.** Gray’in kemik bölümüne göre ortalama büyüklükteki sinüste taban burun tabanı hizasındadır, büyük sinüste daha aşağı iner. Aynı kitabın duyu organları bölümü ise tabanın genellikle burun tabanının ½–10 mm altında olduğunu yazar; iki bölüm burada birbirini tutmaz (Gray, 1918). Kitaptaki bir dipnot, sinüsün köpek dişinden yirmi yaş dişine kadar bütün üst dişlerle komşu olabileceğini belirtir (Gray, 1918).

**Büyüklük.** Gray erişkin hacmini 9,5–20 cc (ortalama yaklaşık 14,75 cc), ortalama ölçüleri birinci büyük azı hizasında 3,75 cm yükseklik, 2,5 cm genişlik ve 3 cm ön-arka derinlik olarak verir (Gray, 1918). Güncel bir derlemede hacim 1–3 yaşta yaklaşık 1,6 cm³, 22–25 yaşta 12,6 cm³’tür; büyüme 0–5 yaş arasında hızlı, 8 yaştan sonra sabit hızdadır (Lee ve ark., 2022).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Göz altı deliği: ölçülen yer ve çeşitlilik',
      ogeler: [
        { deger: '6,1–7,3', birim: 'mm', aciklama: 'Göz altı kenarına ortalama uzaklık (Hindistan’da 55, Sri Lanka’da 54 kuru kafatası)' },
        { deger: '2–11,5', birim: 'mm', aciklama: 'Aynı uzaklığın kişiler arasındaki aralığı (Hindistan serisi)' },
        { deger: '%7,4–18,2', aciklama: 'Ek (aksesuar) göz altı deliği sıklığı: Sri Lanka kafatası ve Kore kadavra serileri' },
        {
          deger: '%37,5–55,9',
          aciklama: 'Deliğin ikinci küçük azı dişinin yanak tüberkülü ucuyla aynı dikey eksende olma sıklığı (sağ–sol)',
        },
      ],
      not: 'Kaynaklar: Singh (2011); Nanayakkara ve ark. (2016); Shin ve ark. (2020). Ders kitaplarındaki “yaklaşık 1 cm” bilgisi bu ölçümlerden büyüktür.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Üst azı dişleri ve sinüs',
      md: `Üst büyük azı dişlerinin kökleri sinüs tabanına çok yakındır. Kore’de 83 hastanın 332 büyük azı dişini konik ışınlı BT (KIBT) ile inceleyen bir çalışmada köklerin sinüse doğru uzanması en sık yanak tarafındaki köklerde görüldü; sinüs tabanına en yakın kök ikinci büyük azı dişinin mezyobukkal köküydü (Jung ve Cho, 2012).

Bu yakınlığın iki sonucu olabilir. Ağız ile sinüs arasında istemeden bir bağlantı (**oroantral iletişim**) açılabilir. Dişin kök ucundaki ya da diş eti çevresindeki bir enfeksiyonun sinüse yayılması ya da sinüs tabanının işlem sırasında delinmesi de sinüzite yol açabilir (Jung ve Cho, 2012).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Kesici (nazopalatin) kanal',
      md: `**Kesici kanal** (*canalis incisivus*; nazopalatin kanal) ön üst çenede ağız ile burun boşluğunu birleştiren kemik içi bir geçittir; içinde nazopalatin sinir ile büyük damak ve sfenopalatin atardamarları arasındaki bağlantı (anastomoz) bulunur. Ağızda üst kesici dişlerin arkasında, kesici papillanın (*papilla incisiva*) altındaki çukurda biter; burun tarafında bölmenin iki yanında, burun deliğinin iç kenarının yaklaşık 2 cm arkasında açılır (Lake ve ark., 2018).

- **Uzunluk:** ortalama yaklaşık 10 mm (Lake ve ark., 2018); Hindistan’da 100 kişilik bir KIBT çalışmasında 10,08 mm (Thakur ve ark., 2013).
- **Burun tarafındaki ağızlar:** aynı çalışmada olguların %81’inde iki ağız (Stenson delikleri) vardı (Thakur ve ark., 2013).
- **Çap:** dişli çenede kesici delik ortalama 6 mm’den dardır (Lake ve ark., 2018). Zonguldak’ta 180 kişinin KIBT görüntülerini inceleyen bir Türk çalışması, literatüre dayanarak 6 mm’ye kadar çapı olağan, 6–10 mm’yi genişlemiş, 10 mm’nin üstünü kist şüphesi olarak sınıfladı (Hasırcı ve ark., 2026).
- **Kist:** nazopalatin kanal kisti, üst çenenin en sık görülen ve dişten kaynaklanmayan gelişimsel kistidir (Hasırcı ve ark., 2026).

Kanalın biçimi için tek bir “en sık biçim” yoktur: bir derleme en sık biçimi huni ya da Y olarak verirken (Lake ve ark., 2018), Hindistan serisinde en sık biçim silindirdi (Thakur ve ark., 2013); sıklık topluluğa ve kullanılan sınıflamaya göre değişir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 1: Su içerken burnundan su gelen hasta',
      oyku: `46 yaşında bir kadın, sol üst ikinci büyük azı dişi çekildikten iki gün sonra başvuruyor. Su içerken suyun sol burun deliğinden geldiğini fark etmiş. Bir hafta sonra sol yanağında dolgunluk ve basınç hissi, sol burun deliğinden kötü kokulu akıntı başlamış. Ağız içinde çekim boşluğunun tabanında küçük bir açıklık görülüyor.`,
      soru: 'Çekim yeri ile burun arasındaki bağlantı hangi anatomik yoldan oluşmuş olabilir ve sinüs neden kendiliğinden kolay boşalmaz?',
      cozum: `**Yol:** Maksiller sinüsün tabanı üst çenenin diş yuvası çıkıntısıdır; birinci ve ikinci büyük azı dişlerinin köklerine karşılık gelen konik kabarıklıklar tabana uzanır ve bazı kişilerde kökler tabanı deler (Gray, 1918). Kore’deki bir KIBT çalışmasında sinüs tabanına en yakın kök ikinci büyük azı dişinin mezyobukkal köküydü ve bu yakınlık istemeden ağız ile sinüs arasında bir bağlantıya (**oroantral iletişim**) yol açabilir (Jung ve Cho, 2012). Su çekim boşluğundan sinüse, sinüsten de sinüs ağzı yoluyla orta burun yoluna ve burun deliğine ulaşır.

**Boşalma:** Sinüsün burna açılan ağzı iç duvarın yüksek kısmındadır; bu yüzden sinüs zor boşalır ve sinüs enfeksiyonlarında en sık tutulan sinüstür (OpenStax 7.2). Canlıda bu ağız genellikle tek ve küçüktür, kalbur kemiğinin çengel çıkıntısının gerisinde gizlidir (Gray, 1918). Diş kaynaklı enfeksiyonun sinüse yayılması ya da tabanın delinmesi sinüzite yol açabilir (Jung ve Cho, 2012); hastanın sonradan başlayan yanak dolgunluğu ve burun akıntısı bu olasılığı düşündürür.

*Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Göz altı siniri: delik nerede, kaç tane?',
      md: `**Yer tahmini.** Ders kitaplarında göz altı deliğinin göz altı kenarının “yaklaşık 1 cm” altında olduğu yazar (Nanayakkara ve ark., 2016). Kuru kafatası ölçümleri daha kısa bir uzaklık verir: Hindistan’da 55 kafatasında ortalama sağda 6,12 mm, solda 6,19 mm, aralık 2–11,5 mm (Singh, 2011); Sri Lanka’da 54 kafatasında sağda 6,52 mm, solda 7,30 mm. Aynı Sri Lanka serisinde delik çoğunlukla üst ikinci küçük azı dişinin yanak tüberkülü ucuyla aynı dikey eksendeydi (sağ %37,5, sol %55,9) (Nanayakkara ve ark., 2016). Sinir bloğunda ya da yüz cerrahisinde “1 cm” kuralı deliğin olduğundan daha aşağıda aranmasına yol açabilir; ölçümler 6–7 mm, kişiye göre 2–11,5 mm gösteriyor.

**Ek delikler.** Sri Lanka serisinde kafatasların %92,6’sında tek, %7,4’ünde ek delik vardı. Kadanoff’un 1.400 kafatasında çift delik %9, üçlü delik %0,5 idi. Yazarlar kendi sıklıklarının Türk örneklemlerinde (Tezer ve ark.; Kazkayaşı ve ark.) bildirilenlere benzediğini belirtir (Nanayakkara ve ark., 2016). Kore’de 44 yarım yüz kadavrasında ek delik %18,2 sıklıkta ve ana deliğin ortalama 7,2 mm üst-içinde bulundu; bu delikten göz altı sinirinin kopya bir dalı geçebileceği için bölgede çalışan cerrahın ek deliğin yerini bilmesi gerekir (Shin ve ark., 2020).

**Kaş üstü deliğiyle hizalanma.** Kaş üstü (supraorbital) ve göz altı deliklerinin aynı sagittal düzlemde olduğu klasik bilgisi her toplumda geçerli değildir: Sri Lanka’daki bir seride supraorbital çıkışların %80,2’si göz altı deliğinden geçen dikey düzlemin iç (medial) tarafındaydı (Nanayakkara ve ark., 2018).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sinüs septaları ve çocukta sinüs',
      md: `**Septalar.** Maksiller sinüs septaları ilk kez 1910’da Underwood tarafından sinüs içindeki kortikal kemik duvarlar olarak tanımlandı; ters gotik kemer biçimindedirler ve sinüsü iki ya da daha çok bölmeye ayırabilirler. Krennmair’in sınıflamasına göre **birincil septalar** üst çenenin gelişiminden, **ikincil septalar** diş kaybından sonra sinüs tabanının düzensiz havalanmasından doğar (Orhan ve ark., 2013).

Türkiye’de 272 hastanın KIBT görüntülerinde 544 sinüs yarısının %58’inde septum vardı; septaların %69,1’i sinüsün orta bölgesindeydi. Ortalama septum yüksekliği erişkinde 5,5 mm, çocukta 4,33 mm idi. Önceki çalışmalardaki %16–33 sıklıktan yüksek olan bu oran, yazarlarca ince kesitli KIBT kullanımına bağlandı. Septalar sinüs tabanı yükseltme (sinüs lifting) ameliyatında sinüs zarının yırtılma riskini artırır (Orhan ve ark., 2013). Aynı çalışmanın özetinde 554, sonuçlarında 544 sinüs yarısı yazar; %58 oranı 544 üzerinden hesaplanmıştır.

**Çocukta sinüs.** 13 yaşından küçük sağlıklı çocukların yaklaşık yarısında görüntülemede sinüste bir miktar opasite görülebilir. Dudak-damak yarığı olanlarda maksiller sinüs hacmi üç BT çalışmasında kontrollere göre %7,3–33,3 daha küçük bulunmuştur (Lee ve ark., 2022).`,
    },

    // ——— Elmacık kemiği ———
    {
      tur: 'metin',
      md: `**Elmacık kemiği** (*os zygomaticum*) yanağın çıkıntısını yapan küçük, dörtgen bir kemiktir. Göz çukurunun dış duvarının ve tabanının bir kısmına, şakak çukuru ile infratemporal çukurun duvarlarına katılır (Gray, 1918). Göz çukurunun dış duvarını elmacık kemiği ile kama kemiğinin büyük kanadı birlikte yapar; bu duvar göz çukurunun en sağlam duvarıdır (Shumway ve ark., 2023). Elmacık kemiği göz çukurunun içindekileri korur ve yüzün, yanakların biçimini belirler (Yu ve Wang, 2023b).

Kemiğin dışa bakan **yanak yüzü** ve içe bakan **şakak yüzü** ile dört çıkıntısı vardır (Gray, 1918):

- **Alın çıkıntısı** (*processus frontalis*; Gray’de frontosfenoidal çıkıntı): kalın ve tırtıklıdır, yukarıda alın kemiğinin elmacık çıkıntısıyla eklem yapar.
- **Şakak çıkıntısı** (*processus temporalis*): uzun ve dardır; şakak kemiğinin elmacık çıkıntısıyla eğik bir dikişle birleşerek **elmacık kemerini** (*arcus zygomaticus*) yapar. Şakak kasının kirişi kemerin iç tarafından geçerek alt çenenin koronoid çıkıntısına yapışır; kemerin alt kenarından ve iç yüzünden çiğneme kası (*musculus masseter*) başlar (Gray, 1918).
- **Üst çene çıkıntısı** (Gray’de maksiller çıkıntı): üst çeneyle eklem yapan pürüzlü, üçgen yüzey.
- **Göz çukuru çıkıntısı**: göz çukuru kenarından arkaya ve içe uzanan kalın bir levha; göz çukurunun tabanına ve dış duvarına katılır.

Yanak yüzünün ortasına yakın açılan küçük **elmacık-yüz deliği** (*foramen zygomaticofaciale*) aynı adlı siniri ve damarları yüze çıkarır (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Sol elmacık kemiği tek başına',
      aciklama:
        'Sol elmacık kemiğine soldan bakıyoruz; kemik tek başına, deniz yeşili. Ortadaki kabarık gövde yanağın çıkıntısıdır. Yukarı uzanan alın çıkıntısı alın kemiğine, arkaya uzanan şakak çıkıntısı şakak kemiğine bağlanır; öndeki kavisli kenar göz çukurunun kenarıdır. Elmacık-yüz deliği çok küçük olduğu için modelde yoktur; yeri gövdenin ortasına yakındır.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['elmacik-kemigi-sol'],
        vurgula: ['elmacik-kemigi-sol'],
        boya: [{ secici: ['elmacik-kemigi-sol'], renk: KEMIK_RENGI.elmacik }],
        noktalar: [
          { nokta: 'elmacik-govdesi-sol' },
          { nokta: 'elmacik-alin-cikintisi-sol' },
          { nokta: 'elmacik-sakak-cikintisi-sol' },
          { nokta: 'elmacik-goz-kenari-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yüzler.** Dış yüzün bugünkü adı *facies lateralis*’tir; Gray’in kitabında eski adıyla “malar yüz” diye geçer (FIPAT, 2019). Ortasına yakın açılan elmacık-yüz deliğinin altındaki hafif kabartıdan bir yanak kası (Gray’de *Zygomaticus*) başlar. İçe ve geriye bakan şakak yüzünün ortasında **elmacık-şakak deliği** (*foramen zygomaticotemporale*) elmacık-şakak sinirini geçirir (Gray, 1918).

**Göz çukuru tüberkülü.** Alın çıkıntısının göz çukuruna bakan yüzünde, kenarın hemen içinde ve elmacık-alın dikişinin yaklaşık 11 mm altında, büyüklüğü ve biçimi değişen bir tüberkül vardır; Gray bunun kafatasların %95’inde bulunduğunu yazar (Gray, 1918). Terminologia Anatomica’daki adı *tuberculum orbitale*’dir ve çoğu elmacık kemiğinde bulunur (FIPAT, 2019); klinikte Whitnall tüberkülü ya da dış göz çukuru tüberkülü olarak anılır. Buraya dış düz kasın (*musculus rectus lateralis*) kısıtlayıcı bağı, üst göz kapağını kaldıran kasın aponevrozunun dış ucu, göz küresinin asıcı bağı (Lockwood bağı), dış göz kapağı bağı ve Whitnall bağı tutunur (Shumway ve ark., 2023); Gray bunlara üst ve alt tarsların dış uçlarını da ekler (Gray, 1918).

**Göz çukuru çıkıntısı.** Üst çenenin göz çukuru yüzü ve kama kemiğinin büyük kanadıyla birleşerek göz çukuru tabanının ve dış duvarının bir kısmını yapar. Üzerinde iki **elmacık-göz çukuru kanalının** ağzı vardır: biri şakak çukuruna açılır ve elmacık-şakak sinirini, öbürü yanak yüzüne açılır ve elmacık-yüz sinirini taşır. Çıkıntının kama ve üst çene kısımlarının birleştiği köşede genellikle eklem yapmayan küçük bir kenar kalır; bu kenar alt orbital yarığın ön sınırıdır (Gray, 1918). Elmacık siniri pterigopalatin çukurda doğar, alt orbital yarıktan göz çukuruna girer ve bu iki dala ayrılır; dallar kemik içindeki kanala elmacık-göz çukuru deliğinden girer (Kawata ve ark., 2024).

**Kenarlar.** Arka-üst (şakak) kenar italik bir *f* harfi gibi kıvrılır ve şakak fasyasına tutunma yeri verir; arka-alt (elmacık) kenarın pürüzlü yüzüne çiğneme kası tutunur (Gray, 1918).

**Eklemler.** Dört kemikle: alın, kama ve şakak kemikleri ile üst çene (Gray, 1918). Bu dört eklem yeri, kırıkların adlandırılmasında önemlidir.

**Kemikleşme.** Gray’e göre genellikle üç merkezden (biri yanak, ikisi göz çukuru kısmı için) kemikleştiği anlatılır; merkezler yaklaşık 8. haftada belirir ve fetal 5. ayda kaynaşır. Mall ise göz çukurunun hemen altında ve dışında beliren tek bir merkez tanımlar. Doğumdan sonra kemik bazen yatay bir dikişle büyük üst ve küçük alt parçaya ayrılır (Gray, 1918); bu iki parçalı elmacık kemiği (*os japonicum*) yaklaşık %4 sıklıkta görülür (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Elmacık kemiğinin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        [
          'Yanak yüzü (dış yüz)',
          '*Facies lateralis*',
          'Dışa bakan dışbükey yüz',
          'Bir yanak kası (elmacık-yüz deliğinin altındaki kabartıdan)',
        ],
        [
          'Elmacık-yüz deliği',
          '*Foramen zygomaticofaciale*',
          'Yanak yüzünün ortası; çoğunlukla gövde bölgesi',
          'Elmacık-yüz siniri ve damarları',
        ],
        ['Elmacık-şakak deliği', '*Foramen zygomaticotemporale*', 'Şakak yüzünün ortası', 'Elmacık-şakak siniri'],
        [
          'Elmacık-göz çukuru delikleri',
          '*Foramen zygomaticoorbitale*',
          'Göz çukuru çıkıntısı',
          'Elmacık sinirinin iki dalı (kemik içi kanallara girer)',
        ],
        [
          'Göz çukuru tüberkülü (Whitnall)',
          '*Tuberculum orbitale*',
          'Alın çıkıntısı, göz çukuru kenarının hemen içi; elmacık-alın dikişinin yaklaşık 11 mm altı',
          'Dış düz kasın kısıtlayıcı bağı, kapak kaldırıcı kasın aponevrozu, Lockwood bağı, dış göz kapağı bağı',
        ],
        ['Alın çıkıntısı', '*Processus frontalis*', 'Üst uç', 'Alın kemiğinin elmacık çıkıntısıyla eklem'],
        ['Göz çukuru çıkıntısı', '—', 'Göz çukuru kenarından arkaya-içe', 'Göz çukuru tabanı ve dış duvarı; alt orbital yarığın ön sınırı'],
        ['Şakak çıkıntısı', '*Processus temporalis*', 'Arka uç', 'Şakak kemiğinin elmacık çıkıntısıyla elmacık kemeri'],
        ['Şakak kenarı', '—', 'Arka-üst kenar; italik f biçimli', 'Şakak fasyası'],
        ['Elmacık kenarı', '—', 'Arka-alt kenar', 'Çiğneme kası (masseter)'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Shumway ve ark. (2023); Kawata ve ark. (2024).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Elmacık–üst çene kompleksi kırığı',
      md: `Elmacık kemiğinin yüz iskeleti ve beyin kutusuyla dört dikişi vardır. Kırık bu dört sınırın hepsinden geçtiğinde **elmacık–üst çene kompleksi kırığı** adını alır. Eskiden “tripod” (üç ayaklı) kırık denirdi, çünkü düz grafi bozulan sınırlardan yalnızca üçünü gösterebiliyordu; bugün “tetrapod” ya da “kuadripod” kırık adı kullanılır (Gómez Roselló ve ark., 2020).

Ankara’da acil serviste yüz BT’si çekilen 754 hastalık bir seride elmacık kemiği %20,2 ile üst çene ve burun kemiğinden sonra en sık kırılan üçüncü yüz kemiğiydi (Arslan ve ark., 2014). Yüz kırıklarının sınıflaması ve onarımı ünitenin 6. dersinde ayrıntılı anlatılır.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Elmacık-yüz deliğinin çeşitliliği',
      md: `Elmacık kemiğine yerleştirilen implantlarla yapılan tedaviye yol göstermek amacıyla, Japonya’da 52 kadavranın 104 elmacık kemiği mikro-BT ile incelendi (Kawata ve ark., 2024):

- **Sayı:** elmacık-yüz deliği hiç olmayabilir ya da bir kemikte 1–4 tane olabilir. Erkeklerde en sık 1, kadınlarda en sık 2 delik vardı; kadınlarda delik sayısı anlamlı olarak fazlaydı. Erkek kemiklerinin 52’sinin 3’ünde (%5,8) hiç delik yoktu.
- **Yer:** deliklerin erkekte %79,3’ü, kadında %77,5’i kemiğin gövde bölgesindeydi; şakak çıkıntısı bölgesinde hiç delik görülmedi.
- **Çap:** ortalama erkekte 1,09 mm, kadında 1,03 mm; çene deliğinden ve göz altı deliğinden küçüktür.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka 2: Yumruktan sonra düzleşen yanak',
      oyku: `28 yaşında bir erkek kavgada sol yanağına yumruk yiyor. Acilde sol yanağın çıkıntısı karşı tarafa göre düzleşmiş görünüyor; sol göz altında, yanağın ön kısmında, burnun yanında ve üst dudakta uyuşukluk tarif ediyor. Sol göz kapaklarının dış köşesi hafifçe aşağı kaymış. Görme keskinliği olağan. Yüz BT’sinde sol elmacık kemiğinin çevresindeki dikiş hatlarında ayrışma ve göz altı kenarında kırık görülüyor.`,
      soru: 'Kırık nasıl adlandırılır, uyuşukluk ve göz kapağı köşesinin kayması hangi anatomik yapılarla açıklanır?',
      cozum: `**Adlandırma:** Elmacık kemiği alın, kama ve şakak kemikleri ile üst çeneyle, yani dört kemikle eklem yapar (Gray, 1918). Bu dört sınırın hepsinden geçen kırığa elmacık–üst çene kompleksi (tetrapod) kırığı denir; düz grafi yalnızca üç sınırı gösterebildiği için eski adı “tripod”dur (Gómez Roselló ve ark., 2020). Le Fort kırıkları da yüzün orta kısmını tutar; ama üç Le Fort tipinin ortak noktası pterigoid levhaların kırılmasıdır ve elmacık kemeri Le Fort III’ün ayırt ettirici bileşenidir (Gómez Roselló ve ark., 2020). Bu yüzden BT’de pterigoid levhalara da bakılır.

**Uyuşukluk:** Göz altı siniri göz çukuru tabanındaki göz altı oluğu ve kanalından geçip göz altı deliğinden yüze çıkar (Gray, 1918); burnun, üst dudağın ve yanağın ön kısmının duyusunu taşır (OpenStax 7.2). Göz çukurunun tabanını esas olarak üst çene, önde ve dışta elmacık kemiği yapar; göz çukurunun alt kenarını da bu iki kemik, aralarındaki elmacık–üst çene dikişiyle birlikte yapar (Gray, 1918). Kırık hattı bu bölgeden geçtiği için sinirin kemik yolu etkilenmiş olabilir.

**Göz kapağı köşesi:** Elmacık kemiğinin göz çukuru tüberkülüne (Whitnall) dış göz kapağı bağı ve Lockwood bağı (Shumway ve ark., 2023), Gray’e göre de tarsların dış uçları tutunur (Gray, 1918). Kemik yer değiştirdiğinde bu tutunma noktası da onunla birlikte yer değiştirir.

**Bağlam:** Ankara’daki 754 hastalık acil servis serisinde en sık yaralanma nedeni şiddetti (%39,7) ve elmacık kemiği en sık kırılan üçüncü yüz kemiğiydi (%20,2) (Arslan ve ark., 2014). Sınıflama ve onarım ünitenin 6. dersinde ele alınır.

*Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Beş küçük kemik ———
    {
      tur: 'metin',
      md: `Üst çene ile elmacık kemiği yüzün orta kısmının ana iskeletini kurar; beş küçük kemik ise bu iskeletin aralarını tamamlar. **Burun kemikleri** burun köprüsünü, **gözyaşı kemikleri** göz çukurunun iç duvarının önünü, **damak kemikleri** sert damağın arkasını ve burun boşluğunun arka yan duvarını, **alt burun kavkaları** burun boşluğunun yan duvarındaki en büyük kıvrımları, **sapan kemiği** de burun bölmesinin arka-alt kısmını yapar (Gray, 1918; OpenStax 7.2). Damak kemiği ile sapan kemiği burnun derinliğinde durduğu için önden bakınca neredeyse görünmez; aşağıdaki sahnede çevrelerindeki kemikler kaldırıldı.`,
    },
    {
      tur: 'sahne',
      baslik: 'Beş küçük kemik bir arada',
      aciklama:
        'Üst çene, elmacık kemiği ve beyin kutusu kaldırıldı; yalnızca küçük yüz kemikleri kafatasındaki yerlerinde duruyor, önden bakıyoruz. En üstte krem rengi iki burun kemiği, onların arkasında ve yanında kahverengi gözyaşı kemikleri, aşağıda lila renkli alt burun kavkaları, ortada gül kurusu sapan kemiği, en arkada koyu mavi damak kemikleri var. “Bakış” düğmeleriyle arkadan bakınca damak kemiğinin L biçimi görülür.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['burun-kemigi', 'gozyasi-kemigi', 'damak-kemigi', 'sapan-kemigi', 'alt-burun-kavkasi'],
        vurgula: ['burun-kemigi', 'gozyasi-kemigi', 'damak-kemigi', 'sapan-kemigi', 'alt-burun-kavkasi'],
        boya: [
          { secici: ['burun-kemigi'], renk: RENK.burun },
          { secici: ['gozyasi-kemigi'], renk: RENK.gozyasi },
          { secici: ['damak-kemigi'], renk: RENK.damak },
          { secici: ['sapan-kemigi'], renk: RENK.sapan },
          { secici: ['alt-burun-kavkasi'], renk: RENK.kavka },
        ],
        noktalar: [
          { nokta: 'burun-kemigi-bolgesi-sol' },
          { nokta: 'gozyasi-kemigi-bolgesi-sol' },
          { nokta: 'alt-burun-kavkasi-bolgesi-sol' },
        ],
        etiketler: [
          { yapi: 'sapan-kemigi', metin: 'Sapan kemiği' },
          { yapi: 'damak-kemigi-sol', metin: 'Damak kemiği' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },

    // ——— Burun kemiği ———
    {
      tur: 'metin',
      md: `**Burun kemikleri** (*ossa nasalia*) yüzün orta-üst kısmında yan yana duran iki küçük, uzunca kemiktir; birleşerek burun köprüsünü yaparlar. Büyüklükleri ve biçimleri kişiden kişiye değişir (Gray, 1918). Burnun yan duvarlarını yapan kıkırdakları da taşırlar; burun kırıldığında hasar gören kemikler bunlardır (OpenStax 7.2). Yukarıda alın kemiğiyle birleştikleri dikişin orta noktasına **nasion** denir (Gray, 1918). Burnun kemik iskeleti yüzeyde durduğu ve ince olduğu için burun kemiği kırığı yüz iskeletinin en sık yaralanmasıdır (Gómez Roselló ve ark., 2020).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Her burun kemiğinin iki yüzü ve dört kenarı vardır (Gray, 1918):

- **Dış yüz** procerus kası ve burnun küçük bir kasıyla örtülüdür; ortasında küçük bir toplardamarın geçtiği bir delik bulunur.
- **İç yüzde** yukarıdan aşağı inen bir oluk nazosiliyer sinirin bir dalını taşır.
- **Üst kenar** dar, kalın ve tırtıklıdır; alın kemiğinin burun çentiğine oturur.
- **Alt kenar** incedir; burnun yan kıkırdağı buraya tutunur. Ön burun açıklığının üst sınırı burun kemiklerinin alt kenarlarıdır.
- **Dış kenar** üst çenenin alın çıkıntısıyla eklem yapar.
- **İç kenar** karşı burun kemiğiyle birleşir ve arkada dikey bir sırt olarak burun bölmesine katılır; bu sırt yukarıdan aşağı alın kemiğinin burun dikeni, kalbur kemiğinin dik levhası ve bölme kıkırdağıyla eklem yapar (Gray, 1918).

İki burun kemiği alın kemiğiyle **frontonazal dikişte**, üst çenenin alın çıkıntısıyla **nazomaksiller dikişte** birleşerek kemik burun piramidini yapar (Gómez Roselló ve ark., 2020). Burun köprüsünü ortada kalbur kemiğinin dik levhası, yanlarda üst çenelerin alın çıkıntıları destekler; burun boşluğunun tavanının ön kısmını da burun kemiği ile alın kemiğinin burun dikeni yapar (Gray, 1918).

**Eklemler:** dört kemik: alın ve kalbur kemikleri, karşı burun kemiği ve üst çene. **Kemikleşme:** her biri tek merkezden, fetal 3. ayın başında, kıkırdak burun kapsülünün ön kısmını örten zarda kemikleşir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'En sık kırılan yüz kemiği hangisi?',
      md: `Acile gelen yüz travmalı hastaların hepsi birlikte düşünüldüğünde en sık kırık, kapalı burun kemiği kırığıdır (%30,1–55,8); ameliyat gereken hastalarda ise en sık kırılan kemik alt çenedir (%41,6–75,2) (Gómez Roselló ve ark., 2020). Kore’de 2002–2017 arasında burun kırığı tanısı alan 2.092 hastanın incelendiği bir seride ağır burun kırıklarının oranı yıllar içinde arttı (Kim ve ark., 2018).

Ankara’da acil serviste yüz BT’si çekilen 754 hastada (%73,7’si erkek) ise üst çene %28 ile burun kemiğini (%25,3) geride bıraktı; onları elmacık kemiği (%20,2), alt çene (%8,4) ve alın kemiği (%8,1) izledi (Arslan ve ark., 2014). Fark büyük olasılıkla seçimden kaynaklanır: bu seri yalnızca yüz BT’si çekilen hastaları kapsar ve yalnızca burun ya da diş-alveol kırığı olan hastaları baştan dışarıda bırakmıştır (Arslan ve ark., 2014). Doğru özet şudur: burun kemiği en sık kırılan yüz kemiğidir, ama sıralama serinin kimleri kapsadığına göre değişir.`,
    },

    // ——— Gözyaşı kemiği ———
    {
      tur: 'metin',
      md: `**Gözyaşı kemiği** (*os lacrimale*) yüzün en küçük ve en kırılgan kemiğidir; göz çukurunun iç duvarının ön kısmında durur (Gray, 1918). Üst çenenin alın çıkıntısıyla birlikte **gözyaşı kesesi çukurunu** yapar: çukurun üst kısmında gözyaşı kesesi, alt kısmında burun-gözyaşı kanalı yer alır (Gray, 1918). Gözyaşı iç göz köşesinde toplanır, bu kanaldan aşağı iner ve alt burun kavkasının altında kalan alt burun yoluna açılır (OpenStax 7.2; Gray, 1918). Gözyaşı kemiğinin göz çukuruna bakan yüzünü dikey bir sırt, **arka gözyaşı sırtı** ikiye böler (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Kemiğin iki yüzü ve dört kenarı vardır (Gray, 1918).

**Göz çukuru yüzü.** Arka gözyaşı sırtının (*crista lacrimalis posterior*) önündeki boyuna oluk, **gözyaşı oluğu** (*sulcus lacrimalis*), iç kenarıyla üst çenenin alın çıkıntısına kavuşur ve gözyaşı kesesi çukurunu tamamlar. Sırttan göz çevresi kasının gözyaşı kısmı başlar. Sırt aşağıda çengel gibi küçük bir uçla, **gözyaşı çengeliyle** (*hamulus lacrimalis*) biter; çengel üst çenenin gözyaşı tüberkülüyle eklem yapar. Bu çengel bazen ayrı bir parçadır ve o zaman küçük gözyaşı kemiği adını alır (Gray, 1918).

**Burun yüzü.** Ön kısmı orta burun yolunun duvarına katılır; arka kısmı kalbur kemiğiyle eklem yapar ve bazı ön kalbur hücrelerini tamamlar (Gray, 1918).

**Kenarlar.** Ön kenar üst çenenin alın çıkıntısıyla, arka kenar kalbur kemiğinin göz çukuru levhasıyla (*lamina orbitalis*; Gray’de lamina papyracea), üst kenar alın kemiğiyle eklem yapar. Alt kenarın ön kısmı aşağı doğru **inen çıkıntı** olarak uzanır ve alt burun kavkasının gözyaşı çıkıntısıyla birleşerek burun-gözyaşı kanalını tamamlar (Gray, 1918).

Gözyaşı kemiğinin ön kenarının alın kemiğiyle buluştuğu noktaya **dakriyon** denir. Göz çukurunun iç duvarında üç dikey dikiş görülür: gözyaşı–üst çene, gözyaşı–kalbur ve kama–kalbur dikişleri (Gray, 1918).

**Eklemler:** dört kemik: alın ve kalbur kemikleri, üst çene ve alt burun kavkası. **Kemikleşme:** tek merkezden, yaklaşık 12. haftada, kıkırdak burun kapsülünü örten zarda (Gray, 1918). Terminologia Anatomica, eski baskıda gözyaşı kemiği başlığında yer alan gözyaşı kesesi çukurunu (*fossa sacci lacrimalis*) bugün “göz çukuru” başlığı altında listeler (FIPAT, 2019); çukuru gerçekten de iki kemik birlikte yapar.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Gözyaşı kesesi çukuru: iki kemiğin ortak yuvası',
      aciklama:
        'Sol göz çukurunun iç duvarının önüne soldan bakıyoruz; elmacık kemiği ve beyin kutusu kaldırıldı. Kahverengi gözyaşı kemiği ile pembe üst çenenin alın çıkıntısı arasında gözyaşı kesesinin oturduğu çukur var: çukurun arka sınırı gözyaşı kemiğindeki arka gözyaşı sırtı, ön sınırı üst çenedeki ön gözyaşı sırtıdır. Modelde sırt ve oluk yalnızca alt yarıda belirgindir; noktalar bu kısmı gösterir. Önde krem rengi burun kemiği görülür.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['gozyasi-kemigi-sol', 'ust-cene-kemigi-sol', 'burun-kemigi-sol'],
        vurgula: ['gozyasi-kemigi-sol', 'ust-cene-kemigi-sol', 'burun-kemigi-sol'],
        boya: [
          { secici: ['gozyasi-kemigi-sol'], renk: RENK.gozyasi },
          { secici: ['ust-cene-kemigi-sol'], renk: KEMIK_RENGI.ustCene },
          { secici: ['burun-kemigi-sol'], renk: RENK.burun },
        ],
        noktalar: [
          { nokta: 'gozyasi-kemigi-bolgesi-sol' },
          { nokta: 'gozyasi-olugu-sol' },
          { nokta: 'arka-gozyasi-sirti-sol' },
          { nokta: 'ust-cene-alin-cikintisi-sol' },
          { nokta: 'burun-kemigi-bolgesi-sol' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sulanan göz ve kemik kanal',
      md: `Gözyaşı yolunun tıkanması gözün aşırı sulanmasına (**epifora**) yol açar; bu durum çocuklarda özellikle sık, erişkinlerde de sıktır (Ducker ve Rivera, 2023). Erişkinde primer edinsel burun-gözyaşı kanalı tıkanıklığı genellikle 40 yaşın üstündeki kadınlarda görülür ve sulanmayla kendini gösterir (Bulbul ve ark., 2016).

Kemik kanalın genişliği bu tabloda rol oynayabilir. Balıkesir’de çok kesitli BT ile yapılan bir çalışmada kontrol grubunda kemik kanalın en dar enine çapı ortalama 4,1 mm (3–6 mm) idi. Tıkanıklığı olan hastalarda kanalın en dar yeri ve alt ucu, hem tıkalı hem sağlam tarafta kontrollerden darıydı; ancak yazarlar darlığın tek başına etken olmadığını vurgular (Bulbul ve ark., 2016). Sağlıklı kişilerde kemik kanalın uzunluğu erkekte ortalama 12,3 mm, kadında 10,8 mm olarak bildirilmiştir (Ramey ve ark.’ndan aktaran Bulbul ve ark., 2016).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 3: Yıllardır sulanan sol göz',
      oyku: `62 yaşında bir kadın, iki yıldır sol gözünün sürekli sulandığını ve gözyaşının yanağına aktığını söylüyor. Göz kapaklarının konumu ve göz yüzeyi olağan görünüyor. Gözyaşı yolunun yıkanması denendiğinde sıvı sol burun boşluğuna geçmiyor. Göz hekimi, gözyaşı kesesi ile burun boşluğu arasında kemikte yeni bir yol açan ameliyatı (dakriyosistorinostomi) planlıyor.`,
      soru: 'Gözyaşı hangi kemik yoldan buruna ulaşır ve ameliyatta açılacak kemik pencere hangi kemiklerden oluşur?',
      cozum: `**Yol:** Gözyaşı iç göz köşesinde toplanır ve burun-gözyaşı kanalıyla burun boşluğuna akar (OpenStax 7.2). Kemik kanalı üst çenenin gözyaşı oluğu yapar; oluk gözyaşı kemiğinin inen çıkıntısı ve alt burun kavkasının gözyaşı çıkıntısıyla tamamlanır ve kanal alt burun yolunun ön kısmına açılır (Gray, 1918). Hastanın yaşı ve cinsiyeti primer edinsel burun-gözyaşı kanalı tıkanıklığına uyar: bu tablo genellikle 40 yaş üstü kadınlarda görülür; hastalarda kemik kanal kontrollere göre daha dar bulunmuştur, ama darlık tek başına açıklama değildir (Bulbul ve ark., 2016).

**Kemik pencere:** Gözyaşı kesesi, kalın üst çene alın çıkıntısı ile ince gözyaşı kemiğinin birlikte yaptığı çukurda durur (Purevdorj ve ark., 2021; Gray, 1918); kese ile burun boşluğu arasındaki kemik bu iki kemikten oluşur. Moğolistan’da 292 hastalık bir dakriyosistorinostomi serisinde üst çenenin alın çıkıntısı başarısız ameliyat grubunda daha kalındı (4,97 mm’ye karşı 4,41 mm) (Purevdorj ve ark., 2021). Ön gözyaşı sırtı ve gözyaşı tüberkülü kesenin yerini bulmada kılavuzdur (Gray, 1918).

*Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Gözyaşı kesesi çukurunun cerrahi anatomisi',
      md: `- **Kalınlık:** Gözyaşı kesesi çukurunu kalın üst çene alın çıkıntısı ve ince gözyaşı kemiği birlikte yapar. Moğolistan’da primer burun-gözyaşı kanalı tıkanıklığı nedeniyle dakriyosistorinostomi yapılan 292 hastanın BT’lerinde alın çıkıntısının kalınlığı başarılı grupta ortalama 4,41 mm, başarısız grupta 4,97 mm idi (Purevdorj ve ark., 2021).
- **İki kemiğin sınırı:** Gray’e göre ön gözyaşı sırtı üst çenedeki oluğun dış kenarıdır; iki kemik çukurun içinde buluşur ve göz çukurunun iç duvarındaki gözyaşı–üst çene dikişini yapar (Gray, 1918). Aynı Moğol çalışmasının bir şekil açıklamasında iki kemiğin “ön gözyaşı sırtında” birleştiği yazar; bu anlatım Gray’in tarifiyle uyuşmaz.
- **Kırıklar:** Burun–göz çukuru–kalbur (NOE) kırıklarında iç göz köşesi kirişinin tutunma yeri, göz çukurunun ön-iç duvarında, gözyaşı kesesi çukuru hizasındadır. Markowitz–Manson sınıflamasında parçalanma bu tutunma yerini de içine alıp kirişi koparmışsa kırık Tip III olarak sınıflanır (Gómez Roselló ve ark., 2020).`,
    },

    // ——— Damak kemiği ———
    {
      tur: 'metin',
      md: `**Damak kemiği** (*os palatinum*) burun boşluğunun arka kısmında, üst çene ile kama kemiğinin pterigoid çıkıntısı arasında saklı duran küçük bir kemiktir. Biçimi **L harfine** benzer: yatay bir kısım, ona dik bağlanan dikey bir kısım ve üç çıkıntıdan oluşur (Gray, 1918).

- **Yatay plak** (*lamina horizontalis*): alt yüzü, karşı taraftakiyle birlikte sert damağın arka dörtte birini yapar. Arka kenarı serbesttir; yumuşak damak buraya tutunur (Gray, 1918).
- **Dik plak** (*lamina perpendicularis*): burun boşluğunun yan duvarının arka kısmına katılır.
- **Piramit çıkıntı** iki kısmın birleştiği köşeden arkaya ve dışa, **göz çukuru çıkıntısı** ile **kama çıkıntısı** dik plağın üst kenarından uzanır.

Bu küçük kemik üç boşluğun duvarına birden katılır: burun boşluğunun tabanı ve yan duvarı, ağzın tavanı ve göz çukurunun tabanı (Gray, 1918). Sert damağın iki arka köşesinde açılan **büyük damak delikleri** damağa damar ve sinir getirir (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yatay kısım.** Alt yüzünde, arka kenara yakın, az ya da çok belirgin enine bir sırt (*crista palatina*) damağı geren kasın (*musculus tensor veli palatini*) aponevrozunun bir kısmına tutunma yeri verir (Gray, 1918; FIPAT, 2019). İki yatay plağın iç uçları birleşerek **arka burun dikenini** (*spina nasalis posterior*) yapar; buraya küçük dil kası (*musculus uvulae*) tutunur (Gray, 1918). Terminologia Anatomica bu dikenin adını, üst çenedeki ön burun dikeniyle uyumlu olsun diye “arka” sıfatıyla düzeltmiştir (FIPAT, 2019). İç kenar karşıdakiyle **burun sırtını** yapar ve sapan kemiğinin alt kenarının arka kısmı buraya oturur (Gray, 1918).

**Dikey kısım.** Burun yüzünde iki sırt vardır: alttaki **kavka sırtı** alt burun kavkasıyla, üstteki **kalbur sırtı** orta burun kavkasıyla eklem yapar; kalbur sırtının üstündeki dar yatay oluk üst burun yoluna katılır (Gray, 1918). Üst çeneye bakan yüzün ön kısmı maksiller sinüsün iç duvarının arka bölümünü yapar. Bu yüzdeki dikey oluk üst çeneyle birlikte büyük damak kanalını oluşturur; kanal inen damak damarlarını ve büyük damak sinirini taşır (Gray, 1918). Gray oluğu “pterigopalatin oluk” diye anar; Terminologia Anatomica, pterigoid çıkıntılar bu oluğa katılmadığı için adı *sulcus palatinus major* olarak değiştirmiştir (FIPAT, 2019). Ön kenardaki **üst çene çıkıntısı** (*processus maxillaris*) sinüs açıklığının alt-arka kısmını kapatır (Gray, 1918); nadiren anılan bu çıkıntı, sinüs açıklığının kapanmasındaki önemi nedeniyle terminolojiye eklenmiştir (FIPAT, 2019). Arka kenar kama kemiğinin iç pterigoid levhasıyla eklem yapar (Gray, 1918).

**Üç çıkıntı.**

- **Piramit çıkıntı** (*processus pyramidalis*) pterigoid levhaların alt uçları arasındaki açıya oturur. Oluklu orta alanı pterigoid çukurun alt kısmını tamamlar ve medial pterigoid kasın birkaç lifine başlangıç verir. Tabanındaki **küçük damak delikleri** küçük damak sinirlerini geçirir (Gray, 1918); Terminologia Anatomica kanalların adını geçirdikleri sinirlere uydurmuştur (*canales palatini minores*) (FIPAT, 2019).
- **Göz çukuru çıkıntısı** (*processus orbitalis*) beş yüzlüdür ve bir hava hücresini çevreler; bu hücre genellikle sfenoid sinüse açılır. Üst yüzü üçgen biçimlidir ve göz çukuru tabanının arka kısmını yapar (Gray, 1918).
- **Kama çıkıntısı** (*processus sphenoidalis*) üst yüzündeki olukla faringeal kanala katılır (Gray, 1918).

**Sfenopalatin delik.** Göz çukuru ve kama çıkıntılarını ayıran **sfenopalatin çentik**, kama kemiği gövdesinin alt yüzüyle kapanarak **sfenopalatin deliğe** (*foramen sphenopalatinum*) dönüşür. Delik pterigopalatin çukurdan üst burun yolunun arka kısmına açılır; sfenopalatin damarları, üst burun sinirlerini ve nazopalatin siniri geçirir. Bazen iki çıkıntı üstte birleşir ve tam bir delik oluşur; bazen de çentiği bir ya da birkaç kemik dikeni geçerek iki ya da daha çok delik yapar (Gray, 1918).

**Komşu çukurlar.** Dikey kısım, göz çukuru ve kama çıkıntılarıyla birlikte pterigopalatin çukurun iç duvarını yapar; göz çukuru çıkıntısı alt orbital yarığın alt sınırına katılır (Gray, 1918).

**Kemikleşme ve büyüme.** Zarda, tek merkezden kemikleşir; merkez fetal 6.–8. haftada iki kısmın birleştiği köşede belirir. Doğumda dikey kısmın yüksekliği yatay kısmın genişliğine eşittir; erişkinde bunun yaklaşık iki katıdır (Gray, 1918).

**Eklemler.** Altı kemik: kama ve kalbur kemikleri, üst çene, alt burun kavkası, sapan kemiği ve karşı damak kemiği (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Damak kemiği ve alt burun kavkası: burun yan duvarının arkası',
      aciklama:
        'Sol damak kemiğine (koyu mavi) ve sol alt burun kavkasına (lila) orta hattan, burun boşluğunun içinden bakıyoruz; çevredeki kemikler kaldırıldı. Dik plak burun boşluğunun yan duvarının arka kısmıdır; üst ucundaki göz çukuru çıkıntısı göz çukuru tabanının en arka köşesine uzanır. Alt kavkanın üst kenarının arka kısmı dik plaktaki kavka sırtına yaslanır. Sfenopalatin çentik bu sahnede işaretli değildir; yeri göz çukuru ve kama çıkıntılarının arasıdır.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'ic-sol',
        goster: ['damak-kemigi-sol', 'alt-burun-kavkasi-sol'],
        vurgula: ['damak-kemigi-sol', 'alt-burun-kavkasi-sol'],
        boya: [
          { secici: ['damak-kemigi-sol'], renk: RENK.damak },
          { secici: ['alt-burun-kavkasi-sol'], renk: RENK.kavka },
        ],
        noktalar: [
          { nokta: 'damak-kemigi-dik-plak-sol' },
          { nokta: 'damak-kemigi-goz-cukuru-cikintisi-sol' },
          { nokta: 'alt-burun-kavkasi-bolgesi-sol' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Damak kemiğinin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        ['Yatay plak', '*Lamina horizontalis*', 'Sert damağın arka dörtte biri', 'Arka kenarına yumuşak damak tutunur'],
        ['Damak sırtı', '*Crista palatina*', 'Yatay plağın alt yüzü, arka kenara yakın', 'Damağı geren kasın aponevrozunun bir kısmı'],
        ['Arka burun dikeni', '*Spina nasalis posterior*', 'İki yatay plağın iç uçları', 'Küçük dil kası'],
        ['Burun sırtı', '*Crista nasalis*', 'Yatay plağın iç kenarı', 'Sapan kemiğinin alt kenarının arka kısmı'],
        ['Dik plak', '*Lamina perpendicularis*', 'Burun boşluğu yan duvarının arkası', 'Maksiller sinüs iç duvarının arka bölümü'],
        [
          'Kavka ve kalbur sırtları',
          '*Crista conchalis*, *Crista ethmoidalis*',
          'Dik plağın burun yüzü',
          'Alt ve orta burun kavkaları ile eklem; kalbur sırtı sfenopalatin deliğin endoskopik işareti',
        ],
        [
          'Büyük damak oluğu ve kanalı',
          '*Sulcus palatinus major*, *Canalis palatinus major*',
          'Dik plağın üst çeneye bakan yüzü + üst çene',
          'İnen damak damarları, büyük damak siniri',
        ],
        [
          'Büyük damak deliği',
          '*Foramen palatinum majus*',
          'Sert damağın arka köşesi; çoğunlukla üçüncü büyük azının karşısı',
          'İnen damak damarları (büyük damak atardamarı), büyük damak siniri',
        ],
        ['Üst çene çıkıntısı', '*Processus maxillaris*', 'Dik plağın ön kenarı', 'Sinüs açıklığının alt-arka kısmını kapatır'],
        [
          'Piramit çıkıntı',
          '*Processus pyramidalis*',
          'İki kısmın birleşim köşesinden arkaya-dışa',
          'Pterigoid çukurun alt kısmı; medial pterigoid kasın birkaç lifi',
        ],
        ['Küçük damak delikleri', '*Foramina palatina minora*', 'Piramit çıkıntının tabanı', 'Küçük damak sinirleri'],
        [
          'Göz çukuru çıkıntısı',
          '*Processus orbitalis*',
          'Dik plağın üst kenarı, önde',
          'Göz çukuru tabanının arka köşesi; içinde hava hücresi',
        ],
        ['Kama çıkıntısı', '*Processus sphenoidalis*', 'Dik plağın üst kenarı, arkada', 'Faringeal kanala katılır'],
        [
          'Sfenopalatin çentik ve delik',
          '*Incisura sphenopalatina*, *Foramen sphenopalatinum*',
          'İki üst çıkıntının arası; kama gövdesiyle kapanır',
          'Sfenopalatin damarlar, üst burun sinirleri, nazopalatin sinir',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Scanavine ve ark. (2009); Kim ve ark. (2023). Gray’in “ön damak siniri” bugünkü büyük damak siniri (*nervus palatinus major*), “arka ve orta damak sinirleri” bugünkü küçük damak sinirleridir (*nervi palatini minores*).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Büyük damak deliği ve sfenopalatin delik',
      md: `**Büyük damak deliği.** 75 çalışmayı (22.202 kişi) birleştiren bir meta-analize göre delik arka burun dikenine 17,21 mm, sert damağın arka kenarına 2,56 mm, orta hattaki damak dikişine 15,22 mm uzaklıktadır. Olguların %64,9’unda üçüncü büyük azı dişinin, %19,3’ünde ikinci ile üçüncü büyük azı dişlerinin arasının karşısındadır. Büyük damak kanalının ortalama uzunluğu 26,97 mm’dir (Kim ve ark., 2023). Kuzey Kıbrıs’ta 160 KIBT’de delik sağda %96,25, solda %96,9 oranında üçüncü büyük azı bölgesindeydi (Lafci Fahrioglu ve ark., 2024).

Sert damak mukozasını esas olarak büyük damak atardamarı besler; bu damar pterigopalatin çukurda inen damak atardamarından çıkar (Kim ve ark., 2023). Kanal yoluyla iki işlem yapılır: maksiller sinir bloğu için iğne 30 mm ilerletilir; sinüs cerrahisinde kanamayı azaltmak (hemostaz) için ise 25 mm’ye kadar ilerletilmesi önerilir (Kim ve ark., 2023).

**Sfenopalatin delik.** Brezilya’da 54 yarım yüz kadavrasında delik %87 tek, %11,1 çift, %1,9 üçlüydü ve %81,5’inde üst burun yolundaydı. Orta burun kavkasının arka ucunun bağlandığı damak kemiği kalbur sırtı, deliği endoskopla bulmada anatomik ve cerrahi bir işarettir (Scanavine ve ark., 2009). Türkiye’de 10 kadavra yarım başı ve 18 kuru kafatasından oluşan 28 örnekte delik ortalama 3,79 mm genişliğinde ve 6,44 mm uzunluğundaydı; sert damağa uzaklığı ortalama 15,58 mm idi. Bu çalışma, burun içinden pterigopalatin gangliyon bloğunun doğru yapılmasına yol göstermek amacıyla yürütüldü (Sir ve Eksert, 2019). Gangliyonun eski adı “sfenopalatin gangliyon”dur; bugünkü adı içinde bulunduğu kemik çukura uydurulmuştur (*ganglion pterygopalatinum*) (FIPAT, 2019).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka 4: Dişsiz damakta büyük damak deliğini bulmak',
      oyku: `68 yaşında, üst çenesinde hiç dişi kalmamış bir hastaya kronik sinüzit nedeniyle endoskopik sinüs cerrahisi planlanıyor. Ekip, ameliyat sırasında kanamayı azaltmak için büyük damak kanalı yoluyla damar daraltıcı bir enjeksiyon yapmayı düşünüyor. Ağızda azı dişleri bulunmadığı için deliği diş hizasına göre bulmak mümkün değil.`,
      soru: 'Büyük damak deliği hangi kemik işaretlere göre aranır ve iğne ne kadar ilerletilir?',
      cozum: `**Kemik:** Büyük damak deliği sert damağın arka köşesindedir; kanalını üst çenenin iç yüzündeki oluk ile damak kemiği dik plağındaki oluk birlikte yapar ve kanaldan inen damak damarları ile büyük damak siniri geçer (Gray, 1918).

**İşaretler:** Dişli hastada delik çoğunlukla üçüncü büyük azının karşısındadır (%64,9) (Kim ve ark., 2023); bu hastada diş işareti yoktur. Bu durumda kemik işaretlerine olan uzaklıklar kullanılabilir: meta-analize göre delik orta hattaki damak dikişine ortalama 15,22 mm, sert damağın arka kenarına 2,56 mm, arka burun dikenine 17,21 mm uzaklıktadır (Kim ve ark., 2023). Bunlar havuzlanmış ortalamalardır; tek tek kişilerde sapma beklenir.

**Derinlik:** Kanal ortalama 26,97 mm uzunluğundadır. Sinüs cerrahisinde hemostaz için iğnenin 25 mm’ye kadar ilerletilmesi önerilir; maksiller sinir bloğu için 30 mm gerekir (Kim ve ark., 2023). Kanaldan geçen büyük damak atardamarı sert damak mukozasının ana besleyicisidir (Kim ve ark., 2023); deliğin yerinin dikkatle belirlenmesi bu yüzden önemlidir.

*Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Alt burun kavkası ———
    {
      tur: 'metin',
      md: `**Alt burun kavkası** (*concha nasalis inferior*) burun boşluğunun yan duvarı boyunca yatay uzanan, tomar gibi kendi üstüne kıvrılmış süngerimsi bir kemik levhadır (Gray, 1918). Burun kavkalarının en büyüğüdür ve kafatasının bağımsız bir kemiğidir; daha küçük olan orta ve üst kavkalar ise kalbur kemiğinin parçalarıdır (OpenStax 7.2). Kavkalar burna giren havayı döndürerek ısıtır ve nemlendirir (OpenStax 7.2). Burun yan duvarındaki bu kıvrımların bütününe **türbinat** denir; kavka (konka), türbinatın kemik kısmının adıdır. Türbinatlar iltihaplandığında burun tıkanıklığına katkıda bulunabilir (Fakoya ve ark., 2024).

Alt kavka ile burun tabanı arasında kalan boşluk **alt burun yoludur** (*meatus nasi inferior*); burun yollarının en büyüğüdür ve ön kısmına burun-gözyaşı kanalı açılır (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Kemiğin iki yüzü, iki kenarı ve iki ucu vardır (Gray, 1918):

- **İç yüz** dışbükeydir; çok sayıda delikle delinmiştir ve damarların yerleştiği boyuna oluklar taşır.
- **Dış yüz** içbükeydir ve alt burun yolunun duvarına katılır.
- **Üst kenarın** ön kısmı üst çenenin kavka sırtıyla, arka kısmı damak kemiğinin kavka sırtıyla eklem yapar. Bu kenardan üç çıkıntı uzanır. Kemiğin ön dörtte biri ile arka dörtte üçünün birleştiği yerdeki **gözyaşı çıkıntısı** (*processus lacrimalis*), gözyaşı kemiğinin inen çıkıntısı ve üst çenenin oluğuyla burun-gözyaşı kanalını tamamlar. Onun arkasındaki geniş, ince **kalbur çıkıntısı** (*processus ethmoidalis*) yukarı kalkarak kalbur kemiğinin çengel çıkıntısına uzanır. **Üst çene çıkıntısı** (*processus maxillaris*) üst çeneyle eklem yapar ve maksiller sinüsün iç duvarının bir parçasını oluşturur.
- **Alt kenar** serbest ve kalındır; özellikle ortada hücreli bir yapıdadır.
- **İki uç** da az çok sivridir; arka uç daha incedir (Gray, 1918).

**Eklemler:** dört kemik: kalbur kemiği, üst çene, gözyaşı ve damak kemikleri. **Kemikleşme:** tek merkezden, fetal 5. ayda, kıkırdak burun kapsülünün yan duvarında (Gray, 1918).

Orta burun yolunda, alt kavkanın arka kısmının üstünde sık sık maksiller sinüsün **ek bir ağzı** bulunur (Gray, 1918). Kalbur kemiğindeki en üst (*suprema*) kavka ise yalnızca ara sıra görülür (FIPAT, 2019).`,
    },

    // ——— Sapan kemiği ———
    {
      tur: 'metin',
      md: `**Sapan kemiği** (*vomer*) orta düzlemde duran ince bir kemiktir; Gray onu dörtgene yakın bir levha olarak tarif eder. Burun bölmesinin arka-alt kısmını yapar ve ön kısmı sıklıkla bir yana bükülür (Gray, 1918). Kafatasına arkadan bakıldığında sapan kemiği burun bölmesinin bütün yüksekliğini oluşturur (OpenStax 7.2); serbest arka kenarı burun boşluğunun iki arka açıklığını, **koanaları** (*choanae*) birbirinden ayırır (Gray, 1918). Bölmenin ön kısmını, kalbur kemiğinin dik levhası ile sapan kemiği arasındaki boşluğu dolduran esnek **bölme kıkırdağı** tamamlar; bu kıkırdak kuru kafatasında bulunmaz (OpenStax 7.2).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yüzler.** Her iki yüzde aşağı ve öne doğru eğik uzanan **nazopalatin oluk**, nazopalatin siniri ve damarları barındırır (Gray, 1918).

**Kenarlar.**

- **Üst kenar** en kalın kenardır. Ortasında derin bir oluk, iki yanında yatay uzanan birer **kanat** (*ala vomeris*) vardır. Oluk kama kemiğinin gagasını (*rostrum sphenoidale*) alır; kanatların kenarları arkada kama kemiğinin iç pterigoid levhalarının vajinal çıkıntılarıyla, önde damak kemiklerinin kama çıkıntılarıyla eklem yapar (Gray, 1918). Sapan kemiği ile kama gagası arasında bir kanal (*canalis vomerorostralis*) bulunur (FIPAT, 2019).
- **Alt kenar** üst çeneler ve damak kemiklerinin yaptığı burun sırtına oturur.
- **Ön kenar** en uzun kenardır; aşağı ve öne eğimlidir. Üst yarısı kalbur kemiğinin dik levhasıyla kaynaşır, alt yarısı bölme kıkırdağının alt kenarı için olukludur.
- **Arka kenar** serbest ve içbükeydir; iki koanayı ayırır (Gray, 1918).

**Kemikleşme.** Gelişimin erken döneminde burun bölmesi tek bir kıkırdak levhadır (etmovomerin kıkırdak). Sapan kemiği bu kıkırdağın arka-alt kısmını örten zarda kemikleşir: yaklaşık 8. haftada orta hattın iki yanında birer merkez belirir, bu yüzden kemik başlangıçta iki ince levhadan (lamel) oluşur. Levhalar yaklaşık 3. ayda altta birleşir ve kıkırdağın yerleştiği derin bir oluk oluşur; ergenliğe kadar neredeyse tamamen kaynaşarak tek bir orta levhaya dönüşürler. Üst kenardaki dışa kıvrık kanatlar ve ön kenardaki oluk bu iki katlı kökenin izleridir (Gray, 1918).

**Eklemler.** Altı kemik: kama ve kalbur kemikleri, iki üst çene ve iki damak kemiği; ayrıca bölme kıkırdağıyla eklem yapar (Gray, 1918).

**Koanalar.** Her koana yaklaşık 2,5 cm yüksekliğinde ve 1,25 cm genişliğindedir. Üstte kama kemiği gövdesinin alt yüzü ve sapan kemiğinin kanadı, altta damak kemiği yatay kısmının arka kenarı, dışta iç pterigoid levha sınırlar; ikisini sapan kemiğinin arka kenarı ayırır (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sapan kemiği tek başına',
      aciklama:
        'Sapan kemiğine soldan bakıyoruz; kemik tek başına, gül kurusu renkte. Ön kenar ekranın solunda, arka kenar sağındadır. Üst kenarda kama kemiğinin gagasını saran kanat, arkada iki koanayı ayıran serbest kenar görülür. Yüzündeki nazopalatin oluk bu sahnede işaretli değildir; oluk yüzü aşağı ve öne doğru eğik geçer.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['sapan-kemigi'],
        vurgula: ['sapan-kemigi'],
        boya: [{ secici: ['sapan-kemigi'], renk: RENK.sapan }],
        noktalar: [{ nokta: 'sapan-kemigi-bolgesi' }, { nokta: 'sapan-kemigi-kanadi-sol' }, { nokta: 'sapan-kemigi-arka-kenari' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Burun, gözyaşı, alt kavka ve sapan kemiklerinin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        ['Burun kemiğinin damar deliği', '—', 'Burun kemiğinin dış yüzünün ortası', 'Küçük bir toplardamar'],
        ['Nazosiliyer oluk', '—', 'Burun kemiğinin iç yüzü', 'Nazosiliyer sinirin bir dalı'],
        ['Burun kemiğinin bölme sırtı', '—', 'İç kenarın arka uzantısı', 'Alın dikeni, kalbur dik levhası ve bölme kıkırdağı ile eklem'],
        ['Arka gözyaşı sırtı', '*Crista lacrimalis posterior*', 'Gözyaşı kemiğinin göz çukuru yüzü', 'Göz çevresi kasının gözyaşı kısmı'],
        [
          'Gözyaşı oluğu ve kesesi çukuru',
          '*Sulcus lacrimalis*, *Fossa sacci lacrimalis*',
          'Sırtın önü; üst çenenin alın çıkıntısıyla birlikte',
          'Üstte gözyaşı kesesi, altta burun-gözyaşı kanalı',
        ],
        ['Gözyaşı çengeli', '*Hamulus lacrimalis*', 'Arka gözyaşı sırtının alt ucu', 'Üst çenenin gözyaşı tüberkülü ile eklem'],
        ['İnen çıkıntı', '—', 'Gözyaşı kemiğinin alt kenarının önü', 'Alt kavkanın gözyaşı çıkıntısıyla burun-gözyaşı kanalı'],
        ['Dakriyon', '—', 'Gözyaşı kemiği ön kenarının alın kemiğiyle buluştuğu nokta', '—'],
        [
          'Alt kavkanın gözyaşı çıkıntısı',
          '*Processus lacrimalis*',
          'Üst kenarda, kemiğin ön dörtte biri ile arka dörtte üçünün sınırı',
          'Burun-gözyaşı kanalını tamamlar',
        ],
        ['Alt kavkanın kalbur çıkıntısı', '*Processus ethmoidalis*', 'Üst kenarın ortası', 'Kalbur kemiğinin çengel çıkıntısıyla birleşir'],
        [
          'Alt kavkanın üst çene çıkıntısı',
          '*Processus maxillaris*',
          'Kalbur çıkıntısının alt kenarı',
          'Maksiller sinüsün iç duvarının bir parçası',
        ],
        ['Nazopalatin oluk', '—', 'Sapan kemiğinin iki yüzü, eğik', 'Nazopalatin sinir ve damarlar'],
        [
          'Sapan kanatları',
          '*Ala vomeris*',
          'Sapan kemiğinin üst kenarı',
          'Kama gagasını sarar; iç pterigoid levhaların vajinal çıkıntıları ve damak kemiklerinin kama çıkıntılarıyla eklem',
        ],
        ['Vomerorostral kanal', '*Canalis vomerorostralis*', 'Sapan kemiği ile kama gagası arası', '—'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019). “—” olan satırlarda yapının ayrı bir Latince terimi verilmedi; Gray bu yapıları İngilizce adlarıyla anar.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Burun bölmesinin eğriliği ve burun kemikleri',
      md: `Gray burun bölmesinin sık sık bir yana saptığını ve bunun sağdan çok sola olduğunu yazar (Gray, 1918). Türkiye’de bölmesi eğri 203 erişkinin (111 erkek, 92 kadın; yaş 18–79, ortalama 36,23) BT’lerini inceleyen bir çalışmada ise sapma 107 hastada (%52,7) sağa, 96 hastada (%47,3) sola idi (Serifoglu ve ark., 2017). Bu seri yalnızca bölmesi eğri hastaları kapsadığı için toplumdaki genel yön dağılımı hakkında kesin bir sonuç çıkarılamaz.

Aynı çalışmada burun kemiği uzunluğu sagittal düzlemde frontonazal dikişten kemiğin ucuna kadar ölçüldü: sağ burun kemiğinin ortanca uzunluğu erkekte 22,9 mm, kadında 21,05 mm idi. Nazomaksiller dikiş hizasındaki kemik kalınlığının ortancası 1,8–1,9 mm’ydi. Bölmenin eğri olduğu taraftaki burun kemiği karşı taraftakinden anlamlı olarak daha kalın ve daha uzundu; yaşla artan tek ölçüm iki burun kemiği arasındaki açıydı (Serifoglu ve ark., 2017).`,
    },

    // ——— Üç boşluk: göz çukuru, burun boşluğu, sert damak ———
    {
      tur: 'metin',
      md: `Tek tek tanıdığımız kemikler üç boşlukta buluşur.

**Göz çukurunun tabanı ve iç duvarı.** Tabanı esas olarak üst çenenin göz çukuru yüzü yapar; önde ve dışta elmacık kemiği, arkada ve içte küçük bir parçayla damak kemiği katılır (Gray, 1918). Bu taban aynı zamanda maksiller sinüsün tavanıdır. İç duvarın önünü üst çenenin alın çıkıntısı ve gözyaşı kemiği yapar; iç duvarın en büyük kısmı ise kalbur kemiğidir (Shumway ve ark., 2023).

**Burun boşluğu.** Tabanını üst çenenin damak çıkıntısı ve damak kemiğinin yatay kısmı yapar. Yan duvarını önde üst çenenin alın çıkıntısı ve gözyaşı kemiği, ortada kalbur kemiği, üst çene ve alt burun kavkası, arkada damak kemiğinin dik levhası ve kama kemiğinin iç pterigoid levhası yapar (Gray, 1918). Önde, burun kemiklerinin altında ve iki üst çenenin arasında armut biçimli **ön burun açıklığı** (*apertura piriformis*) bulunur; dar ucu yukarı bakar (Gray, 1918).

**Sert damak.** Ağzın tavanını ön dörtte üçte üst çenelerin damak çıkıntıları, arka dörtte birde damak kemiklerinin yatay plakları yapar (Gray, 1918). Sert damak toplam damak yüzeyinin yaklaşık üçte ikisidir; geri kalanı yumuşak damaktır (Helwany ve Rathee, 2023). Önde kesici delik, arka köşelerde büyük damak delikleri ve ortada arkaya uzanan arka burun dikeni sert damağın başlıca işaretleridir (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Sert damak alttan',
      aciklama:
        'Sert damağa alttan, ağzın içinden bakar gibi bakıyoruz: yüz ekranın üst tarafında, hastanın sol yanı ekranın sağında. Pembe üst çenelerin damak çıkıntıları damağın ön büyük kısmını, koyu mavi damak kemiklerinin yatay plakları arka kısmını yapar. Önde orta hatta kesici delik, arka köşede piramit çıkıntı ve üst çene yumrusu, damağın gerisinde iki koanayı ayıran sapan kemiğinin (gül kurusu) serbest kenarı görülür. Büyük damak deliği modelde yoktur; yeri sert damağın arka köşesidir.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'alt',
        goster: ['ust-cene-kemigi', 'damak-kemigi', 'sapan-kemigi'],
        vurgula: ['ust-cene-kemigi', 'damak-kemigi', 'sapan-kemigi'],
        boya: [
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
          { secici: ['damak-kemigi'], renk: RENK.damak },
          { secici: ['sapan-kemigi'], renk: RENK.sapan },
        ],
        noktalar: [
          { nokta: 'kesici-delik' },
          { nokta: 'ust-cene-damak-cikintisi-sol' },
          { nokta: 'damak-kemigi-yatay-plak-sol' },
          { nokta: 'piramit-cikinti-sol' },
          { nokta: 'ust-cene-yumrusu-sol' },
          { nokta: 'sapan-kemigi-arka-kenari' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Üst çene:** gövde + 4 çıkıntı (alın, elmacık, diş yuvası, damak); gövdede maksiller sinüs; 9 kemikle eklem.

**Elmacık kemiği:** yanağın çıkıntısı; şakak çıkıntısıyla elmacık kemerini yapar; göz çukurunun dış duvarına katılır.

**Burun kemikleri:** burun köprüsü; en sık kırılan yüz kemiği.

**Gözyaşı kemiği:** yüzün en küçük kemiği; üst çeneyle gözyaşı kesesi çukurunu yapar.

**Damak kemiği:** L biçimli; sert damağın arka ¼’ü.

**Alt burun kavkası:** en büyük kavka, ayrı bir kemik; altındaki alt burun yoluna burun-gözyaşı kanalı açılır.

**Sapan kemiği:** bölmenin arka-alt kısmı; iki koanayı ayırır.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      md: 'Kuru bir kafatasında burnun yalnızca kemik kısmı görülür. Burnun yan duvarlarını yapan kıkırdaklar burun kemiklerinin alt kenarına tutunur (Gray, 1918), bölmenin ön kısmını da esnek bölme kıkırdağı yapar; bölme kıkırdağı kuru kafatasında bulunmaz (OpenStax 7.2).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Göz çukurunun tabanı yukarıdan',
      aciklama:
        'Alın kemiği, kama kemiği ve öteki beyin kutusu kemikleri kaldırıldı; sol göz çukurunun tabanına yukarıdan bakıyoruz (yüz ekranın üst tarafında). Pembe üst çenenin düz, üçgen göz çukuru yüzü tabanın büyük kısmını yapar; önde-dışta deniz yeşili elmacık kemiği, en arka-iç köşede koyu mavi damak kemiğinin göz çukuru çıkıntısı katılır. İç duvarda önde kahverengi gözyaşı kemiği ve kesesinin çukuru, arkada sarı kalbur kemiği yer alır. Göz altı oluğu modelde yoktur; tabanın arka kısmının ortasından öne uzanır.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'ust',
        goster: ['ust-cene-kemigi-sol', 'elmacik-kemigi-sol', 'gozyasi-kemigi-sol', 'damak-kemigi-sol', 'kalbur-kemigi'],
        vurgula: ['ust-cene-kemigi-sol', 'elmacik-kemigi-sol', 'gozyasi-kemigi-sol', 'damak-kemigi-sol', 'kalbur-kemigi'],
        boya: [
          { secici: ['ust-cene-kemigi-sol'], renk: KEMIK_RENGI.ustCene },
          { secici: ['elmacik-kemigi-sol'], renk: KEMIK_RENGI.elmacik },
          { secici: ['gozyasi-kemigi-sol'], renk: RENK.gozyasi },
          { secici: ['damak-kemigi-sol'], renk: RENK.damak },
          { secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur },
        ],
        noktalar: [
          { nokta: 'ust-cene-goz-cukuru-yuzu-sol' },
          { nokta: 'gozyasi-olugu-sol' },
          { nokta: 'arka-gozyasi-sirti-sol' },
          { nokta: 'elmacik-sakak-cikintisi-sol' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üç boşluğun duvarları: hangi kemik neyi yapar?',
      sutunlar: ['Boşluk ve duvar', 'Yüz kemiklerinin katkısı', 'Öteki kemikler', 'Ayrıntı'],
      satirlar: [
        [
          'Göz çukuru tabanı',
          'Üst çene (büyük kısmı), elmacık (ön-dış), damak (arka-iç, küçük)',
          '—',
          'Maksiller sinüsün tavanı; göz altı oluğu ve kanalı',
        ],
        [
          'Göz çukuru iç duvarı',
          'Üst çenenin alın çıkıntısı, gözyaşı kemiği',
          'Kalbur (en büyük kısım), kama',
          'Gözyaşı kesesi çukuru; üç dikey dikiş',
        ],
        ['Göz çukuru dış duvarı', 'Elmacık kemiği', 'Kama kemiğinin büyük kanadı', 'En sağlam duvar; göz çukuru tüberkülü'],
        [
          'Göz çukuru alt kenarı',
          'Elmacık kemiği ve üst çene (elmacık–üst çene dikişi)',
          '—',
          'Göz altı deliği kenarın ortalama 6–7 mm altında',
        ],
        [
          'Alt orbital yarık',
          'Üst çene ve damak kemiği (alt sınır), elmacık (dışta, küçük)',
          'Kama kemiğinin büyük kanadı (üst sınır)',
          'Maksiller sinir ve elmacık dalı, göz altı damarları, pterigopalatin gangliyonun yükselen dalları',
        ],
        ['Burun boşluğu tabanı', 'Üst çenenin damak çıkıntısı, damak kemiğinin yatay kısmı', '—', 'Önde kesici kanalın ağzı'],
        [
          'Burun boşluğu yan duvarı',
          'Önde üst çene alın çıkıntısı ve gözyaşı; ortada üst çene ve alt kavka; arkada damak dik levhası',
          'Kalbur (orta), kama iç pterigoid levhası (arka)',
          'Alt burun yoluna burun-gözyaşı kanalı, orta burun yoluna maksiller sinüs, üst burun yolunun arkasına sfenopalatin delik açılır',
        ],
        ['Burun boşluğu tavanı (ön)', 'Burun kemiği', 'Alın kemiğinin burun dikeni', '—'],
        [
          'Burun bölmesi',
          'Burun kemiklerinin sırtı (önde), sapan kemiği (arkada), üst çene ve damak sırtı (altta)',
          'Alın dikeni, kalbur dik levhası, kama gagası',
          'Önü bölme kıkırdağı; kuru kafatasında yok',
        ],
        [
          'Koanalar',
          'Damak yatay kısmının arka kenarı (alt), sapan kanadı (üst), sapan arka kenarı (ara)',
          'Kama gövdesi (üst), iç pterigoid levha (dış)',
          'Her biri yaklaşık 2,5 × 1,25 cm',
        ],
        [
          'Sert damak',
          'Üst çenenin damak çıkıntıları (ön ¾), damak kemiğinin yatay plakları (arka ¼)',
          '—',
          'Toplam damak yüzeyinin yaklaşık üçte ikisi',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); Shumway ve ark. (2023); OpenStax 7.2; Helwany ve Rathee (2023). İç duvardaki kama kemiği payını Shumway ve ark. küçük kanat, Gray kama gövdesinin optik kanalın önündeki küçük bir parçası olarak verir. OpenStax aynı bölümde üst çene için hem göz çukuru tabanının iç hem dış kısmı der; Gray ile Shumway ve ark.’na göre taban esas olarak üst çenedir.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Yüzün destekleri ve Le Fort desenleri',
      md: `Cerrahlar ve radyologlar yüz iskeletini **dört çift yatay ve dört çift dikey destek** (*buttress*) olarak basitleştirir. Dikey destekler iç maksiller, dış maksiller, arka maksiller ve arka mandibular desteklerdir. Desteklerdeki kemik yüzün geri kalanından kalındır; dişleri, burun boşluğunu, sinüsleri ve göz çukurunu koruyan sağlam bir çatı oluşturur (Gómez Roselló ve ark., 2020). Bu bölümde gördüğümüz ince levhalar, bu kalın sütunların arasını doldurur.

René Le Fort 1901’de kadavraların yüzüne künt kuvvet uygulayarak üç ortak kırık deseni tanımladı; üçünde de kama kemiğinin pterigoid levhaları kırılıyordu. Her tipin ayırt ettirici bileşeni farklıdır: **Le Fort I**’de burun boşluğunun ön-dış kenarı, **Le Fort II**’de göz çukurunun alt kenarı, **Le Fort III**’te elmacık kemeri. Yine de pterigoid levha kırığı olan hastaların %37,3’ünde kırık deseni Le Fort ile ilişkili değildir (Gómez Roselló ve ark., 2020). Yüz kırıklarının sınıflaması ve tedavisi ünitenin 6. dersinin konusudur.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Damağın gelişimi ve yarıklar',
      md: `Damak iki aşamada kapanır: **birincil damak** embriyonun 6. haftasında iç burun çıkıntılarının birleşmesiyle oluşur; birincil ve ikincil damağın tam birleşmesi 12. haftada tamamlanır (Lake ve ark., 2018). Sert damak, üst çenelerin damak çıkıntılarıyla damak kemiklerinin yatay plaklarının orta hatta kaynaşmasıyla oluşur (OpenStax 7.2). Bu süreçteki aksamalar yarık dudak ve yarık damağa yol açar; genel bakış dersinde sıklıkları ve sonuçları anlatıldı.

Yarık, yalnızca damağı değil çevredeki kemiklerin büyümesini de etkiler: dudak-damak yarığı olanlarda maksiller sinüs hacmi üç BT çalışmasında kontrollere göre %7,3–33,3 daha küçük bulunmuştur (Lee ve ark., 2022). Gelişim bozuklukları ünitenin 5. dersinde ele alınır.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Zar mı, kıkırdak mı? Yüz kemiklerinin kemikleşmesi',
      md: `Bazı ders kitapları yüz kemiklerini, kafatası tabanıyla birlikte kıkırdak modelden gelişen grupta anar (OpenStax 7.5). Gray’in ayrıntılı tarifi bu genellemeyi düzeltir: üst çene, damak ve sapan kemikleri zarda kemikleşir; burun ve gözyaşı kemiklerinin merkezleri kıkırdak burun kapsülünü örten zarda belirir; alt burun kavkası ise kapsülün kıkırdak yan duvarında gelişir (Gray, 1918).

Merkezlerin beliriş zamanları da farklıdır: üst çene 6. hafta, damak kemiği 6.–8. hafta, elmacık ve sapan kemikleri yaklaşık 8. hafta, burun kemiği 3. ayın başı, gözyaşı kemiği yaklaşık 12. hafta, alt burun kavkası 5. ay (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Üst çene:** 4 çıkıntı (alın, elmacık, diş yuvası, damak), 4 yüz (ön, infratemporal, göz çukuru, burun).
- **Eklem sayıları:** üst çene 9; damak ve sapan kemikleri 6; elmacık, burun, gözyaşı kemikleri ve alt kavka 4 (Gray, 1918).
- **Burun-gözyaşı kanalı** = üst çenenin gözyaşı oluğu + gözyaşı kemiğinin inen çıkıntısı + alt kavkanın gözyaşı çıkıntısı; **alt** burun yoluna açılır.
- **Maksiller sinüs** orta burun yoluna, hiatus semilunaris’in alt kısmına açılır; **sfenopalatin delik** üst burun yolunun arkasına açılır.
- **Alt oblik kas** göz çukurunun tepesinden değil, üst çenenin göz çukuru yüzünden başlar.
- **Göz altı deliği** kenarın ortalama 6–7 mm altındadır; “1 cm” ölçümlerden büyüktür.
- **Kemikleşme:** alt kavka kıkırdak burun kapsülünün duvarında; üst çene, damak ve sapan kemikleri zarda.
- **Gray → bugün:** ön damak siniri → büyük damak siniri; arka ve orta damak sinirleri → küçük damak sinirleri; sfenopalatin gangliyon → pterigopalatin gangliyon; malar yüz → *facies lateralis* (FIPAT, 2019).`,
    },
  ],
};
