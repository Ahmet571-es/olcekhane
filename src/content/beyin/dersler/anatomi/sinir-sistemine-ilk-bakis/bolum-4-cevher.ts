import type { DersBolumu, Sahne } from '../../../types';

const KESIT_KATMANLARI: Sahne['katmanlar'] = ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'];

/** 4. bölüm: gri ve beyaz cevher, kabuk katmanları, lif demetleri, iç kapsül. */
export const griVeBeyazCevher: DersBolumu = {
  id: 'gri-ve-beyaz-cevher',
  baslik: 'Gri cevher ve beyaz cevher',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyin kesildiğinde iki ayrı renk görülür. **Gri cevher**, nöronların gövdelerinin ve dendritlerinin yoğun olduğu bölgelerdir; aslında pembemsi ya da açık kahverengidir, beyaz cevherin yanında koyu durduğu için bu adı alır. **Beyaz cevher** ise aksonların yoğun olduğu bölgelerdir: aksonları saran, yağdan zengin **miyelin** kılıfı bu bölgeye beyaz rengini verir.

Büyük beyinde gri cevher dışta, kabukta; beyaz cevher içte durur. Beyaz cevherin derinliklerinde de gri cevher adacıkları, yani **çekirdekler** bulunur. Omurilikte düzen tersinedir: gri cevher içte, kelebek biçiminde; beyaz cevher dıştadır.`,
    },
    {
      tur: 'animasyon',
      ad: 'gri-beyaz-cevher',
      baslik: 'Kabuktan geçen bir kesit',
      aciklama:
        'Gri cevherdeki nöron gövdelerinden çıkan aksonlar, miyelinle sarılı olarak beyaz cevherden geçer: kimisi komşu kıvrıma, kimisi aşağıya, beyin sapına ve omuriliğe gider. Sarı noktalar akan sinyalleri gösterir.',
    },
    {
      tur: 'metin',
      md: 'Aynı türden yapılar merkezî ve çevresel sinir sisteminde farklı adlar alır:',
    },
    {
      tur: 'tablo',
      baslik: 'Aynı yapı, iki ayrı ad',
      sutunlar: ['Yapı', 'Merkezî sinir sisteminde', 'Çevresel sinir sisteminde'],
      satirlar: [
        ['Nöron gövdelerinin kümesi', 'Çekirdek (nukleus)', 'Gangliyon'],
        ['Akson demeti', 'Yol (traktus)', 'Sinir'],
      ],
      not: 'İki istisnayı bil: Beynin derinindeki "bazal gangliyonlar" merkezî sinir sisteminde olduğu hâlde eski adını korur; bu yüzden birçok kaynak onlara "bazal çekirdekler" der. Görme siniri de optik kiazmada çaprazlaştıktan sonra adını değiştirir ve "görme yolu" (optik traktus) olur.',
    },
    {
      tur: 'sahne',
      baslik: 'Gerçek bir kesitte gri ve beyaz',
      aciklama:
        'Beyin önden arkaya doğru (koronal) kesildi; gerçeğe yakın renkler kullanıldı. Dıştaki pembemsi kabuk gri cevher, içteki krem renkli bölge beyaz cevher, derindeki koyu adacıklar gri cevher çekirdekleri, mavi boşluklar karıncıklardır. Kesitin yerini kaydırarak değiştir.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'koronal', konum: 0.12 },
        bakis: 'on',
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Kabuğun altı katmanı',
      md: `Kabuğun yüzeyinin %90’dan fazlası altı katmanlı **neokorteks**tir (izokorteks) (Lee, 2019). Katmanlar yüzeyden derine şöyle sıralanır:

| Katman | Adı |
| --- | --- |
| I | Moleküler katman |
| II | Dış granüler katman |
| III | Dış piramidal katman |
| IV | İç granüler katman |
| V | İç piramidal katman |
| VI | Çok biçimli (multiform, fuziform) katman |

IV. katman talamustan gelen lifleri alır (Lee, 2019). Kabuk nöronlarının yaklaşık %80’i piramidal nörondur (Lee, 2019). Birincil duyu alanlarında IV. katman en kalındır (Sancha-Velasco ve ark., 2023); birincil hareket kabuğu ise belirgin bir IV. katmanı olmadığı için **agranüler** kabuk diye anılır ve V. katmanında dev **Betz hücreleri** bulunur (Knierim, UTHealth; Zilles, 2018). Hipokampus ve birincil koku kabuğu gibi **allokorteks** bölgeleri ise yalnızca 2–3 katmanlıdır (Sancha-Velasco ve ark., 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Beyaz cevherin üç lif türü',
      md: `Beyaz cevherdeki akson demetleri, bağladıkları yerlere göre üç türe ayrılır:

- **Komissür lifleri** iki yarımküre arasında karşıya geçer. Bu liflerin büyük çoğunluğu **korpus kallozumdan** geçer; ön komissür de küçük bir komissürdür.
- **Bağlantı (asosiyasyon) lifleri** aynı yarımkürenin farklı bölgelerini birbirine bağlar.
- **Projeksiyon lifleri** kabuk ile alttaki yapılar (talamus, beyin sapı, omurilik) arasında aşağı yukarı uzanır. Beyin sapının üstünde, talamus ile bazal çekirdekler arasında yoğun bir tabaka oluştururlar: **iç kapsül**.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Adı olan demetler',
      md: `**Korpus kallozum** önden arkaya dört bölüme ayrılır: **rostrum**, **genu** (diz), **gövde** ve **splenium**; gövde ile splenium arasındaki dar yere **istmus** denir. Yaklaşık 200 milyon, yoğun miyelinli aksondan oluşur. Genudan çıkıp ön lobları birbirine bağlayan liflere **küçük forseps**, spleniumdan çıkıp oksipital lobları bağlayanlara **büyük forseps** denir. Gelişimi 4 yaşında tamamlanır ama 30’lu yaşlara kadar yavaşça büyümeyi sürdürür (Goldstein ve ark., 2023).

**Uzun bağlantı demetleri** (Buyanova ve Arsalidou, 2021; Shekari ve Nozari, 2023):

- **Üst uzunlamasına demet** (superior longitudinal fasikül, SLF) ve **kavisli demet** (arkuat fasikül, AF): AF, üst temporal girusun arka ve orta bölümünü frontal lobun alt yan bölgesine ve Broca alanının arka kısmına (44) bağlar. AF çoğu zaman SLF’nin bir alt bölümü sayılır; bazı yazarlar ayrı bir demet olduğunu savunur.
- **Kanca biçimli demet** (unsinat fasikül): temporal kutbu ve amigdalayı ön lobun alt yüzüne (orbitofrontal kabuk) bağlar.
- **Singulum:** korpus kallozumun üstünden temporal loba kadar uzanır.
- **Alt uzunlamasına demet** (ILF) ön temporal lobu oksipital kabuğa, **alt fronto-oksipital demet** (IFOF) oksipital kabuğu ön loba bağlar.
- **U lifleri:** komşu kıvrımları bağlayan, kabuğun hemen altındaki kısa demetler.

**İç kapsül** üç bölümdür: kaudat çekirdeğin başı ile lentiform çekirdek arasındaki **ön bacak**, en içteki **diz** (genu) ve lentiform çekirdek ile talamus arasındaki **arka bacak**. Talamus ile kabuk arasındaki lifler iç kapsülden geçer; kabuktan inen hareket lifleri (kortikospinal yol) arka bacaktan ilerler (Neuroanatomy Online, UTHealth). Dış ve en dış kapsüller ise bağlantı lifleri taşır.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Lif türleri modelde',
      aciklama:
        'Kabuk kaldırıldı; derindeki çekirdekler ve beyin sapı soluk bırakıldı. Sarı: iki yarımküreyi bağlayan komissür lifleri (korpus kallozum ve ön komissür). Mavi: kabuktan aşağı inen ve yukarı çıkan projeksiyon liflerinin geçtiği iç kapsül. Bağlantı lifleri modelde ayrı bir parça olarak bulunmaz.',
      sahne: {
        katmanlar: ['derin', 'sap'],
        renk: 'yapi',
        goster: ['bolge:beyin-sapi', 'korpus-kallozum', 'on-komissur', 'ic-kapsul', 'talamus', 'kaudat-cekirdek', 'putamen'],
        vurgula: ['korpus-kallozum', 'on-komissur', 'ic-kapsul'],
        boya: [
          { secici: ['korpus-kallozum', 'on-komissur'], renk: '#f2b544' },
          { secici: ['ic-kapsul'], renk: '#5b84f2' },
        ],
        bakis: 'egik',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum (komissür)' },
          { yapi: 'on-komissur', metin: 'Ön komissür' },
          { yapi: 'ic-kapsul-sol', metin: 'İç kapsül (projeksiyon)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Aksiyel kesitte iç kapsül',
      aciklama:
        'Beyin, bazal çekirdeklerin hizasından yatay kesildi ve üstten bakılıyor. Mavi iç kapsül, kaudat çekirdek ile talamusun dışında, lentiform çekirdeğin (putamen ve globus pallidus) içinde ok ucu gibi bükülür: önde ön bacak, ortada diz, arkada arka bacak. Kesit düzeyini kaydırarak bacakların nasıl değiştiğini izle.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'yapi',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'aksiyel', konum: 0.02 },
        boya: [
          { secici: ['ic-kapsul'], renk: '#5b84f2' },
          { secici: ['bolge:serebrum'], renk: '#efe4d6' },
          { secici: ['kaudat-cekirdek'], renk: '#36c48f' },
          { secici: ['putamen', 'globus-pallidus'], renk: '#f2a65a' },
          { secici: ['talamus'], renk: '#ee6a92' },
        ],
        bakis: 'ust',
        etiketler: [
          { yapi: 'kaudat-cekirdek-sag', metin: 'Kaudat çekirdek' },
          { yapi: 'putamen-sol', metin: 'Lentiform çekirdek' },
          { yapi: 'talamus-sag', metin: 'Talamus' },
          { yapi: 'ic-kapsul-sol', metin: 'İç kapsül' },
        ],
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Küçük bir enfarkt, yarım bir beden',
      md: `İç kapsülün arka bacağı kabuktan inen hareket liflerini ve kabuğa çıkan duyu liflerini dar bir alanda toplar. Bu yüzden orada küçük bir hasar bile karşı yanda bütün bedenin ve yüzün hareketini ya da duyusunu bozabilir. Bu bölgeyi orta beyin arterinin ince **lentikülostriat** dalları besler; ön koroid arter de iç kapsülün arka bölümüne kan verir (Neuroanatomy Online, UTHealth). Bu delici arterler arasında yedek (kollateral) bağlantı yoktur (Venkataraman ve ark., 2024).

Delici bir arterin tıkanmasıyla oluşan küçük enfarktlara **laküner enfarkt** denir. En sık laküner tablo **saf motor inmedir**: başka bir inme belirtisi olmadan yüzde, kolda ve bacakta aynı yanda ani güçsüzlük. Laküner tabloların yaklaşık yarısını oluşturur ve iç kapsülde, korona radiatada ya da ponsta yerleşebilir (Singh ve ark., 2023). Yüz hareket liflerinin iç kapsülün dizinden geçtiği öğretilir; ama difüzyon MR çalışmaları bu liflerin arka bacakta ilerlediğini gösteriyor (Yim ve ark., 2013).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Miyelin hastalanınca: MS ve Guillain–Barré',
      md: `Merkezî sinir sisteminde miyelini **oligodendrositler**, çevresel sinir sisteminde **Schwann hücreleri** yapar (OpenStax 12.2). Bu ayrım iki hastalığı ayırmayı kolaylaştırır:

- **Multipl skleroz (MS):** Bağışıklık sistemi merkezî sinir sistemindeki miyeline saldırır; iltihap gelişir ve miyelin yıkılır. Beynin ve omuriliğin beyaz cevherinde çok sayıda iz (skar) bulunur; hastalık sinir hücrelerinin gövdelerine ve aksonlarına da zarar verir. Belirtiler hasarın yerine ve büyüklüğüne göre kişiden kişiye değişir (NINDS, 2025).
- **Guillain–Barré sendromu:** Bağışıklık sistemi yanlışlıkla çevresel sinir sistemine saldırır. En sık türünde (akut inflamatuvar demiyelinizan poliradikülonöropati) miyelin kılıfı zarar görür; bazı türlerde aksonların kendisi hasar görür (NINDS, 2026). OpenStax bu hastalığı çevresel sinir sisteminin miyelin hastalığına örnek verir.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      duzey: 'ileri',
      baslik: 'Beyaz cevheri görmek: difüzyon tensör görüntüleme',
      md: `Beyaz cevherde su molekülleri akson boyunca kolay, akson zarlarına dik yönde zor yayılır: yayılım **anizotropiktir**. Difüzyon tensör görüntüleme (DTI) her vokselde en hızlı yayılım yönünü hesaplar; bu yön, demetlerin dallanmadığı ve kesişmediği yerlerde lif yönünü gösterir (Buyanova ve Arsalidou, 2021). **Fraksiyonel anizotropi** (FA) 0 (her yöne eşit yayılım) ile 1 (tek yöne yayılım) arasında değişir. Renkli FA haritalarında kırmızı sağ-sol, yeşil ön-arka, mavi alt-üst yönündeki lifleri gösterir (Soares ve ark., 2013).

Beyin cerrahisinde **traktografi**, tümör ile kortikospinal yol, kavisli demet ya da kanca biçimli demet gibi işlevsel yollar arasındaki ilişkiyi göstererek en güvenli girişin planlanmasına yardım eder; yüksek ve düşük dereceli gliomlarda işlevi korumak ile tümörü en çok çıkarmak arasındaki dengeyi kurmakta değerli bir araç kabul edilir (Essayed ve ark., 2017). Sınırları da vardır: klasik DTI her vokselde tek bir lif yönü varsayar, bu da anatomik olarak gerçekçi değildir; ameliyat sırasında beynin kayması da planı bozabilir (Essayed ve ark., 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Korpus kallozumu kesmek ve ayrık beyin',
      md: `**Korpus kallozotomi**, ilaçla durmayan epilepside, çoğunlukla bir yarımkürede başlayıp ötekine yayılan ağır nöbetleri olan çocuklarda yapılır; düşme nöbetlerini ve öteki yaygın nöbetleri durdurabilir, ama nöbetin başladığı yarımküredeki odak nöbetleri durdurmaz, hatta bunlar artabilir (NINDS, 2026). 1742 hastayı kapsayan bir meta-analizde ameliyattan sonra hastaların %18,8’i bütün nöbetlerden, %55,3’ü düşme nöbetlerinden kurtuldu; kısmi değil tam kesi, düşme nöbetlerinden kurtulmayı öngören etkenlerden biriydi (Chan ve ark., 2019). Ön üçte iki kesi spleniumu korur ve daha büyük yaştaki hastalarda kopukluk sendromundan kaçınmak için seçilir (Uda ve ark., 2021).

Bu ameliyatlar bilim tarihini de değiştirdi. Beyin cerrahları Joseph Bogen ve Phillip Vogel’in hastalarıyla yapılan "ayrık beyin" çalışmaları, iki yarımkürenin işlevsel uzmanlaşmasını gösterdi; Roger Sperry bu buluşlar için 1981 Nobel Fizyoloji veya Tıp Ödülü’nün yarısını aldı. Sperry, hastalarla ilk çalışanın Michael Gazzaniga olduğunu Nobel konuşmasında anar (Sperry, 1981; NobelPrize.org, 1981).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Miyelinleşme otuzlu yaşlara kadar sürer',
      md: 'Beyaz cevher çocuklukta tamamlanmaz. DTI çalışmaları bağlantı demetlerinin çoğunun miyelinleşmesinin üçüncü on yıla kadar sürdüğünü, prefrontal bölgeler ve görme ışınımı gibi alanların miyelinleşmede doruğa 24–39 yaşları arasında ulaştığını gösterir (Buyanova ve Arsalidou, 2021). 5–32 yaş arası 103 kişinin izlendiği bir çalışmada projeksiyon ve komissür yollarının olgunlaşması büyük ölçüde ergenliğin sonunda bitti; bağlantı yolları ise ergenlikten sonra da olgunlaşmayı sürdürdü (Lebel ve Beaulieu, 2011).',
    },
  ],
};
