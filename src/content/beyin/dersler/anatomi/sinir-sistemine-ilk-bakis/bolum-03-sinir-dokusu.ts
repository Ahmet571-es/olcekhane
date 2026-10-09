import type { DersBolumu } from '../../../types';

/**
 * 03. bölüm: sinir dokusu genel bakış düzeyinde: nöronun bölümleri ve biçim türleri, MSS ve ÇSS gliası, miyelin ve
 * sinir lifleri, çevresel sinirin kılıfları, gangliyonlar ve pleksuslar, sayılar (86 milyar nöron, glia–nöron oranı
 * ve 10:1 efsanesi), sinyale kısa bir köprü, Gray 1918’in eskimiş görüşleri ve bugünkü bilgi.
 */
export const sinirDokusu: DersBolumu = {
  id: 'sinir-dokusu',
  baslik: 'Sinir dokusu: nöronlar, glia, miyelin ve sinirler',
  bloklar: [
    // ——— İki hücre ailesi ve nöron ———
    {
      tur: 'metin',
      md: `Sinir dokusu, MSS’de de ÇSS’de de iki temel hücre ailesinden oluşur: **nöronlar** ve **glia hücreleri** (OpenStax 12.1). Sinir sisteminin hesaplamasını ve haberleşmesini nöronlar yapar; ama glia desteği olmadan bu işi yapamazlar (OpenStax 12.2).

Tipik bir nöronun üç bölümü vardır: başka hücrelerden gelen bilgiyi alan **dendritler**, **hücre gövdesi** (soma) ve gövdeden çıkıp hedef hücrelere uzanan **akson**. Ders kitapları nöronu genellikle tek aksonlu olarak anlatır. Bilgi nöronun içinde belli bir yönde akar: dendritlerden gövdeye, oradan aksona (OpenStax 12.2). Sinyal bir hücreden ötekine **sinaps** denen bağlantılardan geçer; sinapslar kimyasal ya da elektriksel olabilir (OpenStax 12.5).

Gövdeler ve dendritler gri cevheri, aksonlar beyaz cevheri yapar (OpenStax 12.1). Aşağıdaki çizimde kabuktaki nöron gövdelerinden çıkan aksonların beyaz cevherden geçişini izleyebilirsin.`,
    },
    {
      tur: 'animasyon',
      ad: 'gri-beyaz-cevher',
      baslik: 'Gri cevherdeki gövdeler, beyaz cevherdeki aksonlar',
      aciklama:
        'Kabukta (gri cevher) nöron gövdeleri ve dendritleri durur; gövdelerden çıkan aksonlar miyelinle sarılı olarak beyaz cevherden geçer: kimi komşu kıvrıma, kimi aşağıya, beyin sapına ve omuriliğe gider. Sarı noktalar akan sinyalleri gösterir. “Miyelin kılıfını göster” kutusuyla miyelini kaldırıp geri getirebilirsin: beyaz cevherin rengi bu kılıftan gelir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Nöronun bölgeleri.** Aksiyon potansiyeli, **akson tepeciği** ile aksonun **başlangıç segmentinin** birlikte oluşturduğu **tetik bölgesinde** doğar (OpenStax 12.2). Dendrit ağacı binlerce bağlantı alabilir: orta büyüklükte dendrit ağacı olan ortalama bir omurilik motor nöronu yaklaşık 10.000 sinaptik temas alır; bunların 2.000’i gövdede, 8.000’i dendritlerdedir (Waymire, 2026). Işık mikroskobunda gövdede görülen **Nissl maddesi**, katmanlar hâlinde dizilmiş ve aralarına ribozomlar serpilmiş granüllü endoplazma retikulumudur (Waymire, 2026).

**Biçim türleri.** Nöronlar gövdeden çıkan uzantıların sayısına göre sınıflanır (Gray, 1918; OpenStax 12.2). İnsanda gerçek unipolar hücre yoktur; insandaki “unipolar” duyu hücreleri **psödounipolardır**. OpenStax bu hücrelerin yalnızca duyu nöronu olduğunu ve gövdelerinin her zaman bir gangliyonda bulunduğunu yazar (OpenStax 12.2). Gray (1918) ise bir istisna anlatır: trigeminal sinirin mezensefalik (orta beyin) kökü, dördüncü karıncığın üst ucunu ve beyin su yolunu (*aqueductus mesencephali*) çevreleyen merkezi gri maddedeki unipolar hücrelerden çıkar. Gray bu hücrelerin duyu tipinde olduğunu Johnston’a dayanarak aktarır; yani gövdeleri bir gangliyonda değil, MSS’nin içindedir. **Bipolar** nöronlar azdır; başlıca koku epitelinde ve retinada bulunur. Bu ikisinin dışındaki bütün nöronlar **multipolardır** (OpenStax 12.2).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Nöronların biçim türleri',
      sutunlar: ['Tür', 'Uzantılar', 'Nerede bulunur?', 'Not'],
      satirlar: [
        [
          'Multipolar',
          'Bir akson, çok sayıda dendrit',
          'Psödounipolar ve bipolar olanların dışındaki bütün nöronlar; örneğin sempatik gangliyon nöronları',
          'En yaygın tür',
        ],
        ['Bipolar', 'İki uzantı', 'Başlıca koku epiteli ve retina', 'Az bulunur'],
        [
          'Psödounipolar',
          'Gövdeden tek uzantı çıkar; kısa bir seyirden sonra T biçiminde ikiye ayrılır',
          'Duyusal gangliyonlar (örneğin arka kök gangliyonu)',
          'Yalnızca duyu nöronu; insanda gerçek unipolar hücre yoktur',
        ],
      ],
      not: 'Kaynaklar: OpenStax 12.2; Gray (1918).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Nöron kuramı: Gray’in sayfasındaki tartışma',
      md: `Gray’in 1918 baskısı Waldeyer’in **nöron kuramını** anlatır: bir nöronun uzantıları başka nöronlarınkine yalnızca **temas eder**, onlarla hiçbir zaman doğrudan süreklilik göstermez; uyarılar bu temas noktalarından, yani sinapslardan geçer. Gray sinapsın uyarıyı tek yönde, akson uçlarından dendritlere geçirdiğini de yazar; ama aynı sayfada kuramın geçerliliğinin son yıllarda bazı seçkin histologlarca sorgulandığını aktarır (Gray, 1918). Bugünkü ders kitapları nöronu ayrı bir hücre, nöronlar arası iletişimi de kimyasal ve elektriksel sinapslar olarak anlatır (OpenStax 12.2; OpenStax 12.5).

Gray’in biçim sınıflaması da üç türlüdür: unipolar, bipolar ve multipolar. Ona göre spinal gangliyon hücresinin tek uzantısı kısa bir seyirden sonra T biçiminde ikiye ayrılır; erişkinde bipolar biçim yalnızca akustik (vestibülokoklear) sinirin gangliyonlarında korunur (Gray, 1918). Bugün bu “unipolar” hücrelere **psödounipolar** denir, çünkü gerçek unipolar hücreler yalnızca omurgasızlarda bulunur; bipolar nöronların başlıca örnekleri de koku epiteli ve retinadır (OpenStax 12.2). Sempatik gangliyonlardaki nöronlar ise Gray’e göre de multipolardır: her birinin bir aksonu ve birkaç dendriti vardır (Gray, 1918).`,
    },

    // ——— Sayılar ———
    {
      tur: 'sayilar',
      baslik: 'Sayılarla sinir dokusu',
      ogeler: [
        {
          deger: '86',
          birim: 'milyar',
          aciklama: 'Erişkin erkek beyninde doğrudan sayımla bulunan ortalama nöron sayısı (86,1 ± 8,1 milyar).',
        },
        {
          deger: '≈85',
          birim: 'milyar',
          aciklama:
            'Aynı beyinlerde nöron olmayan hücreler (84,6 ± 9,8 milyar): nöronlarla aşağı yukarı eşit. Glia, beyindeki bütün hücrelerin en çok yarısıdır.',
        },
        {
          deger: '69',
          birim: 'milyar',
          aciklama: '154 gramlık beyincikteki nöron sayısı: beynin bütün nöronlarının yaklaşık beşte dördü.',
        },
        {
          deger: '%19',
          aciklama:
            'Büyük beyin kabuğunun (altındaki yapıyla birlikte) taşıdığı nöron payı (16 milyar). Oysa bu bölge beyin kütlesinin %82’sidir.',
        },
      ],
      not: 'Kaynaklar: Azevedo ve ark. (2009); Herculano-Houzel (2009). Sayılar ortalamadır; yöntem ve tanım farkları uzman düzeyinde.',
    },
    {
      tur: 'sahne',
      baslik: 'Nöronlar nerede? Küçük beyincik, kalabalık nüfus',
      aciklama:
        'Beyne soldan bakıyoruz; renkler bölgeleri tanıtır: mavi büyük beyin, turuncu beyincik, mor beyin sapı. Beyincik beyin kütlesinin yaklaşık onda biri kadardır (OpenStax 13.2), ama beynin 86 milyar nöronunun 69 milyarını taşır. Büyük beyin kabuğu altındaki yapıyla birlikte beyin kütlesinin %82’sini oluşturduğu hâlde nöronların yalnızca %19’unu, yaklaşık 16 milyarını barındırır (Azevedo ve ark., 2009; Herculano-Houzel, 2009).',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'bolge',
        bakis: 'sol',
        etiketler: [
          { yapi: 'ust-parietal-lobul-sol', metin: 'Büyük beyin kabuğu: 16 milyar nöron' },
          { yapi: 'beyincik', metin: 'Beyincik: 69 milyar nöron' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Efsane: “100 milyar nöron ve on kat glia”',
      md: 'Pek çok ders kitabı ve makale, insan beyninde 100 milyar nöron ve bunun on katı glia hücresi bulunduğunu çoğu zaman hiçbir kaynak göstermeden yineler (Herculano-Houzel, 2009). Yarım yüzyıl boyunca beyinde 1 trilyon glia hücresi ve 10:1 glia–nöron oranı olduğu sanıldı (von Bartheld ve ark., 2016). Hücreleri doğrudan sayan bir yöntem bu sayıları düzeltti: yaklaşık **86 milyar nöron** ve aşağı yukarı aynı sayıda nöron olmayan hücre; glia, beyindeki bütün hücrelerin en çok yarısıdır (Azevedo ve ark., 2009; Herculano-Houzel, 2009). Oran ise bölgeden bölgeye çok değişir (lisans düzeyinde).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Bölgelere göre glia–nöron oranı',
      sutunlar: ['Bölge', 'Glia : nöron', 'Not', 'Kaynak'],
      satirlar: [
        [
          'Bütün beyin',
          '1:1’den küçük',
          'Toplam glia 100 milyardan az; glia bütün hücrelerin en çok %50’si',
          'von Bartheld ve ark. (2016); Herculano-Houzel (2009)',
        ],
        ['Büyük beyin kabuğunun gri cevheri', '2’den küçük', 'Glia nöronlardan en çok 2 kat fazla', 'Herculano-Houzel (2009)'],
        ['Beyincik', '1:25’ten küçük', 'Nöronlar gliadan en az 25 kat fazla', 'Herculano-Houzel (2009)'],
        ['Talamus', '17', 'Nöron başına 17 glia', 'Herculano-Houzel (2009)'],
        ['Ventral pallidum', '12', 'Nöron başına 12 glia', 'Herculano-Houzel (2009)'],
        [
          'Omurilik',
          '5,6–7,1',
          '1,5–1,7 milyar hücre, 197–222 milyon nöron; hücrelerin %13,4’ü nöron, %74,8’i glia',
          'Bahney ve von Bartheld (2018)',
        ],
        ['Enterik sinir sistemi', '2–3', 'Enterik glia nöronlardan 2–3 kat fazla', 'Fleming ve ark. (2020)'],
      ],
      not: 'Talamus ve ventral pallidum değerleri Herculano-Houzel’in (2009) aktardığı stereoloji sayımlarındandır. Omurilikte servikal, torakal ve lomber düzeyler arasında hücre bileşiminde anlamlı fark bulunmadı; eski raporlar bu bölgedeki oranı da abartmıştı (Bahney ve von Bartheld, 2018). Neokortekste nöron ve sinaps sayıları ile miyelinli lif uzunluğu “Sayılarla sinir sistemi” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Nöron saymak: yöntem, tanım ve 150 yıl',
      md: `**Yöntem.** Azevedo ve arkadaşları (2009), dokuyu homojenize ederek hücreleri sayan **izotropik fraksiyonatörle** (Herculano-Houzel, 2009) erişkin erkek beyinlerinde ortalama 86,1 ± 8,1 milyar nöron (NeuN pozitif hücre) ve 84,6 ± 9,8 milyar nöron olmayan hücre buldu. 150 yıllık hücre sayımlarını gözden geçiren derlemeye göre doğrulanmış izotropik fraksiyonatör glia–nöron oranının 1:1’in altında ve toplam glianın 100 milyardan az olduğunu gösterir; eski histolojik veriler de aslında hep yaklaşık 1:1 oranını ve 40–130 milyar glia sayısını desteklemişti (von Bartheld ve ark., 2016). Herculano-Houzel (2012), “100 milyar nöron ve 10–50 kat fazla glia” gibi kanıtsız “olguları” ayrıca eleştirir.

**Yöntem ve tanım farkı.** Başka çalışmaların bölgesel sayımları toplanınca (büyük beyin kabuğunda 21–26 milyar, beyincikte 101 milyar nöron) toplam 120 milyarı aşar; izotropik fraksiyonatörle doğrudan sayım ise 86 milyar verir (Herculano-Houzel, 2009). Sayımlar farklı yöntemlerle ve farklı tanımlanmış bölgelerde (bütün kabuk mu, yalnızca neokorteks mi) yapıldığı için bölgesel sayımları toplamak ya da doğrudan karşılaştırmak yanıltıcı olur. Yalnızca neokortekste stereolojiyle yapılan bir sayımda nöron ve glianın toplamı kadında 49,3 milyar, erkekte 65,2 milyardı (31 kişi, 18–93 yaş) (Pelvig ve ark., 2008). Kabuk ve neokorteks sayılarının ayrıntısı “Sayılarla sinir sistemi” bölümünde.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Ders kitaplarındaki sayılar ve ölçülen değerler',
      sutunlar: ['Kaynak', 'Verdiği sayı', 'Değerlendirme'],
      satirlar: [
        ['OpenStax 12.2', 'Sinir sisteminde “trilyonlarca” nöron', 'Ölçümle bağdaşmaz'],
        ['Spielman ve ark. (2020)', 'Doğumda yaklaşık 100 milyar nöron', 'Yuvarlak sayı; ölçülen erişkin değeri 86 ± 8 milyar'],
        ['Byrne (2025)', 'Beyinde 80–100 milyar nöron', 'Ölçülen değeri içine alan geniş bir aralık'],
        [
          'Waymire (2026)',
          'Sinir sisteminde yaklaşık 360 milyar glia ve 90 milyar nöron; glia MSS hücrelerinin %80–90’ı',
          'Ölçümle bağdaşmaz: bütün beyinde glia hücrelerin en çok yarısıdır',
        ],
        [
          'Dafny (2020)',
          'Erişkin beyninde yaklaşık 1 trilyon hücre',
          'Ölçümle bağdaşmaz: nöron ve nöron olmayan hücreler toplam ~171 milyar',
        ],
        [
          'Azevedo ve ark. (2009)',
          '86,1 ± 8,1 milyar nöron; 84,6 ± 9,8 milyar nöron olmayan hücre',
          'İzotropik fraksiyonatörle doğrudan sayım',
        ],
      ],
      not: 'Bu derste 86 milyar nöron ve yaklaşık 1:1 (glia için 1:1’in altı) oranı kullanılır (Herculano-Houzel, 2009; von Bartheld ve ark., 2016). Ders kitabının verdiği sayı ile ölçülen sayı ayrışınca ölçümü yapan çalışma esas alınır.',
    },

    // ——— Glia ———
    {
      tur: 'metin',
      md: `**Glia** adı Yunanca “tutkal” anlamındaki sözcükten gelir; terimi 1856’da Alman patolog Rudolf Virchow koymuştur (OpenStax 12.2). Altı glia türü vardır: dördü MSS’de (**astrosit**, **oligodendrosit**, **mikroglia** ve **ependim hücresi**), ikisi ÇSS’de (**Schwann hücresi** ve **satellit hücre**) (OpenStax 12.2).

Her birinin ayrı bir işi vardır. Astrositler nöronların çevresindeki kimyasal ortamı korur; oligodendrositler (MSS’de) ve Schwann hücreleri (ÇSS’de) aksonların çevresine miyelin sarar; mikroglia MSS’nin yerleşik makrofajlarıdır; ependim hücreleri beynin içindeki dört karıncığı (ventrikül) döşer; satellit hücreler gangliyonlardaki nöron gövdelerini sarar (OpenStax 12.2).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Glia hücreleri',
      sutunlar: ['Hücre', 'Yer', 'Başlıca görev'],
      satirlar: [
        [
          'Astrosit',
          'MSS',
          'Hücre dışı kimyasal ortamı korur, fazla sinyal moleküllerini uzaklaştırır, doku hasarına tepki verir, kan-beyin bariyerine katkıda bulunur; MSS’nin dış yüzünde (glia limitans) ve damarların çevresinde (perivasküler ayaklar) kesintisiz bir örtü yapar',
        ],
        ['Oligodendrosit', 'MSS', 'Miyelin yapar; bir hücre birden çok akson segmentine, aynı ya da ayrı aksonlara miyelin verir'],
        ['Mikroglia', 'MSS', 'MSS’ye yerleşik makrofaj: sağlıklı dokuda da hasarlı hücreleri ve hastalık etkenlerini yutup sindirebilir'],
        ['Ependim hücresi (*ependyma*)', 'MSS', 'Nöral tüpün boşluğundan kalan dört karıncığı döşer'],
        ['Schwann hücresi', 'ÇSS', 'Miyelin yapar; tek bir aksonun yalnızca bir segmentini sarar'],
        ['Satellit (uydu) hücre', 'ÇSS', 'Duyusal ve otonom gangliyonlarda nöron gövdelerini sarar'],
      ],
      not: 'Kaynaklar: OpenStax 12.2; Waymire (2026); FIPAT (2019). Glia enterik sinir sisteminde de bulunur (Fleming ve ark., 2020). Ependimin beyin-omurilik sıvısıyla ilişkisi Anatomi bölümünün karıncıklar ve BOS dersinde.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Hasardan sonra glia: skar',
      md: 'MSS’de bir yaralanmadan sonra astrositler çoğalır, ölü hücreleri yutar ve çoğu zaman bir **glial skar** oluşur (Waymire, 2026). Gliotik doku rejenerasyonun önünde de bir engeldir: erişkin hayvan deneylerinde çevresel kökte iyi büyüyen aksonlar, MSS–ÇSS geçiş bölgesindeki gliotik dokuya ulaşınca durur (Fraher, 2000). Geçiş bölgesi bu dersin “Sinir sistemi ne yapar, nasıl bölünür?” bölümünde anlatıldı.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Oligodendrositlerin alanı: beyaz cevher',
      aciklama:
        'Beynin sağ yarısı kaldırıldı; sol yarımküreye orta hattan, içeriden bakıyoruz. Kabuk, derin çekirdekler ve beyin sapı soluk bırakıldı; gerçeğe yakın renkler kullanıldı. Krem renkli kitle yarımkürenin beyaz cevheri, ortadaki beyaz kemer iki yarımküreyi bağlayan korpus kallozumdur (OpenStax 13.2). Burada aksonların miyelinini oligodendrositler yapar ve bir oligodendrosit birden çok akson segmentine miyelin verir (OpenStax 12.2). Önde, aşağıda uzanan sarımsı şerit optik sinirdir: adı sinir olsa da onu da oligodendrositler miyelinler (Romano ve ark., 2019).',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'dogal',
        vurgula: ['katman:beyaz', 'korpus-kallozum', 'optik-sinir'],
        gizle: ['hipofiz'],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'beyaz-cevher-sol', metin: 'Yarımkürenin beyaz cevheri' },
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
          { yapi: 'optik-sinir-sol', metin: 'Optik sinir' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Glia üzerine: biçimler, köken ve ömür boyu değişim',
      md: `**İki tür astrosit.** Protoplazmik astrositler başlıca gri cevherde, fibröz astrositler başlıca beyaz cevherde bulunur. Astrositler sinaptik aralıktaki glutamatı alıp glutamine çevirerek etkisiz kılar (Waymire, 2026).

**Köken.** UTHealth kitabına göre makroglia (astrosit, oligodendrosit ve ependim hücresi) ektodermal kökenlidir; mikroglia ise “büyük olasılıkla” mezodermal kökenlidir (Waymire, 2026). OpenStax mikroglianın makrofaj kökenli olabileceğini yazar (OpenStax 12.2). İki ders kitabı da mikroglianın kökeni konusunda kesin konuşmaz.

**Ömür boyu değişim.** Erişkin yaşam boyunca neokortikal oligodendrosit sayısı %27 azalır ve toplam nöron sayısıyla güçlü bir ilişki gösterir; astrosit sayısı ise yaşam boyu sabit kalır (Pelvig ve ark., 2008).`,
    },

    // ——— Miyelin ve sinir lifi ———
    {
      tur: 'metin',
      md: `Birçok akson, glia hücrelerinin yaptığı yalıtkan bir kılıfla sarılıdır: **miyelin**. Miyelin, bir glia hücresinin zarının aksonun çevresine kat kat sarılmasıyla oluşur; yağları esas olarak bu zarın fosfolipitleridir (OpenStax 12.2). MSS’de miyelini **oligodendrositler**, ÇSS’de **Schwann hücreleri** yapar (OpenStax 12.2).

Kılıf kesintisiz değildir: aradaki küçük boşluklara **Ranvier düğümü** denir ve sinyalin akson boyunca ilerleyişinde önemlidir (OpenStax 12.2). Miyelinsiz bir aksonda sinyal sürekli ilerler; miyelinli bir aksonda ise düğümden düğüme atlayarak ilerler (**saltatoryal iletim**) (OpenStax 12.4).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İletim hızını ne belirler?** Miyelinin yanında aksonun çapı da iletim hızını etkiler; kalın akson daha hızlı iletir (OpenStax 12.4). Bir oligodendrosit birden çok akson segmentine, aynı ya da ayrı aksonlara miyelin verir; bir Schwann hücresi ise tek bir aksonun yalnızca bir segmentini sarar (OpenStax 12.2).

**Miyelinsiz lifler azımsanmamalı.** Sempatik liflerin çoğu ve bazı serebrospinal lifler miyelinsizdir; Gray bunlara gri ya da jelatinimsi lifler, **Remak lifleri** der (Gray, 1918). Organ bağışçılarından alınan boyun vagus sinirinde ortalama 111.984 lif sayıldı ve bunların yaklaşık %80’i miyelinsizdi (Havton ve ark., 2021).

**Miyelinleşme takvimi.** İnsan neredeyse miyelinsiz bir MSS ile doğar; oligodendrosit sayısı doğumdan sonra hızla artar (Williamson ve Lyons, 2018). Miyelinleşmenin bölge bölge takvimi “Sayılarla sinir sistemi” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Miyelin hastalanınca: MS ve Guillain–Barré',
      md: 'Miyelini yapan hücrenin MSS’de ve ÇSS’de farklı olması iki hastalığı ayırmayı kolaylaştırır. **Multipl sklerozda** (MS) beyin ve omuriliğin beyaz cevherinde çok sayıda iz (skar) bulunur; belirtiler hem somatik hem otonom bozuklukları kapsar (OpenStax 12.2). **Guillain–Barré sendromu** ise çevresel sinir sisteminin miyelin yıkıcı (demiyelinizan) bir hastalığıdır (OpenStax 12.2). Beyaz cevher miyelin nedeniyle yağdan zengin olduğu için MR’da gri cevherden kolayca ayrılır (OpenStax 12.1).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: İki hasta, iki ayrı miyelin',
      oyku: 'Nöroloji polikliniğinde aynı gün iki hasta görülüyor. 29 yaşında bir kadın, son iki yılda farklı zamanlarda başlayıp geçen görme bulanıklığı, bacakta uyuşma ve idrar sıkışması atakları anlatıyor; beyin MR’ında beyaz cevherde çok sayıda leke var. 45 yaşında bir erkekte ise birkaç gün içinde iki bacakta başlayıp yukarı doğru yayılan güçsüzlük gelişmiş; sinir iletim çalışmaları çevresel sinirlerde miyelin hasarını düşündürüyor.',
      soru: 'Bu iki hastada miyelin hasarı sinir sisteminin hangi bölümündedir ve hasar gören miyelini hangi hücre yapar?',
      cozum: `**Birinci hasta:** Lekeler beyin MR’ında beyaz cevherdedir, yani MSS’dedir. Beyin ve omuriliğin beyaz cevherinde çok sayıda iz **multipl skleroza** uyar; belirtilerin hem somatik (görme, uyuşma) hem otonom (idrar sıkışması) olması da MS’in özelliğidir (OpenStax 12.2). MSS’de miyelini **oligodendrositler** yapar ve bir oligodendrosit birden çok akson segmentine miyelin verir (OpenStax 12.2). Beyaz cevher yağdan zengin olduğu için MR’da gri cevherden kolayca ayrılır (OpenStax 12.1); miyelin yıkıcı hastalıklarda beyaz cevherdeki lekeler T2 ağırlıklı görüntülerde parlak görünür ve FLAIR’de karıncıklardaki beyin-omurilik sıvısının parlak sinyali bastırılınca daha iyi seçilir (Simha ve ark., 2012).

**İkinci hasta:** Hasar çevresel sinirlerdedir; tablo ÇSS’nin demiyelinizan bir hastalığı olan **Guillain–Barré sendromunu** düşündürür (OpenStax 12.2). ÇSS’de miyelini **Schwann hücreleri** yapar; her Schwann hücresi tek bir aksonun yalnızca bir segmentini sarar (OpenStax 12.2).

**Ortak ders:** Belirtilerin dağılımı ve beyaz cevherin MR’daki görünümü, hasarın MSS’de mi ÇSS’de mi olduğunu, dolayısıyla hangi hücrenin yaptığı miyelinin bozulduğunu ayırt etmeye yardım eder. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Gray’in sinir lifi: ölçüler ve terimler',
      md: `Gray (1918) miyelinli lifi ortada bir akson (“axis-cylinder”) ve çevresinde osmik asitle siyah boyanan yağlı bir kılıf (“medullary sheath”, Schwann’ın beyaz maddesi) olarak anlatır. Ona göre sinir liflerinin çapı 2 ile 16 µm arasında değişir ve bu fark esas olarak miyelinin miktarından gelir (Gray, 1918). Bugün iletim hızının miyelinle birlikte akson çapına da bağlı olduğu vurgulanır (OpenStax 12.4).

Gray’e göre Schwann kılıfı (nörilemma) beyin ve omurilikteki miyelinli liflerde yoktur (Gray, 1918); bu gözlem, MSS’de miyelini Schwann hücrelerinin değil oligodendrositlerin yaptığı bugünkü bilgiyle uyumludur (OpenStax 12.2). Gray’in miyelini “akışkan hâlde yağlı bir madde” sayması ise eskimiştir: miyelin, glia hücre zarının akson çevresine çok kat sarılmasıyla oluşan bir kılıftır (Gray, 1918; OpenStax 12.2).`,
    },

    // ——— Çevresel sinir, gangliyon, pleksus ———
    {
      tur: 'metin',
      md: `Bir **sinir** (*nervus*), ÇSS’deki akson demetidir ve iç içe üç bağ dokusu kılıfıyla sarılıdır (OpenStax 13.4):

- **Endonöryum:** tek tek aksonları saran gevşek bağ dokusu.
- **Perinöryum:** aksonları demetler (**fasiküller**) hâlinde toplayan, her fasikülü ayrı ayrı saran lifli bağ dokusu.
- **Epinöryum:** bütün sinirin dış yüzünü saran lifli bağ dokusu.

ÇSS’deki nöron gövdesi kümelerine **gangliyon** denir. Gangliyonlar çoğunlukla iki türdür: **duyusal** gangliyonlar (örneğin omurilik sinirlerinin arka köklerindeki gangliyonlar) ve **otonom** gangliyonlar (OpenStax 13.4; Gray, 1918). Sinir dalları bazı yerlerde birbirine katılarak ağlar oluşturur; bunlara **pleksus** (*plexus nervosi*) denir (Gray, 1918; FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kılıflar aynı zamanda bariyerdir.** Epinöryum çoğunlukla kollajenden oluşur; sinire gerilmeye karşı dayanıklılık verir ama bariyer yapmaz. **Perinöryum** ise akson–Schwann hücresi birimlerini fasiküllere ayırır ve endonöryum ile fasikül dışındaki dokular arasındaki ana difüzyon bariyeridir (Peltonen ve ark., 2013).

**Gangliyonlar nerede?** Gray (1918) gangliyonları omurilik sinirlerinin arka köklerinde, trigeminal, fasiyal, glossofaringeal ve vagus sinirlerinin duyusal köklerinde ve akustik sinirde sayar; ayrıca sempatik sinirlerle ilişkili gangliyonlar vardır. Arka kök gangliyonu gibi duyusal gangliyonlar başlıca psödounipolar nöronlardan oluşur (Gray, 1918; OpenStax 13.4). Akustik (vestibülokoklear) sinirin gangliyonlarında ise bipolar biçim korunur; sempatik gangliyonlardaki nöronlar multipolardır (Gray, 1918). Her iki türde nöron gövdelerini satellit hücreler sarar (OpenStax 12.2). Arka kök gangliyonunun TA2 adı *ganglion spinale*’dir; eş anlamlısı *ganglion sensorium nervi spinalis* (FIPAT, 2019).

**Pleksuslar.** Bir pleksustan çıkan her dal, pleksusu oluşturan bütün ana sinir gövdelerinden lif taşıyabilir; ama lifler birbiriyle kaynaşmaz, ayrı kalır (Gray, 1918). Boyun, kol, bel ve sakral ağların ayrıntısı ünitenin 3. ve 4. derslerinde.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sinir hasarı: Waller dejenerasyonu ve iyileşme',
      md: 'Gray’in anlatımıyla bir sinir lifi kesildiğinde merkeze bakan uç yalnızca ilk Ranvier düğümüne kadar, çevredeki uç ise bütün boyunca aynı anda yıkılır (**Waller dejenerasyonu**); kesik uçlar dikilirse rejenerasyon, merkezi uçtan aksonların aşağı doğru büyümesiyle olur (Gray, 1918). Seddon sınıflamasındaki en hafif hasar **nörapraksidir**: çoğunlukla basıyla oluşan, akson sağlamken miyelinin bir kesiminin bozulmasıdır; geçici bir iletim bloğu olur ve miyelin onarılınca 12 hafta içinde tamamen düzelir. Aksonun da koptuğu **aksonotmeziste** Waller dejenerasyonu gelişir ve aksonlar günde yaklaşık 1 mm hızla, yavaşça yeniden büyür (Grinsell ve Keating, 2014).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Sabah kalkmayan bilek',
      oyku: '32 yaşında bir erkek, bir gece kolunu sandalyenin sert kenarına dayayarak uyuyakalıyor. Sabah bileğini ve parmaklarını kaldıramıyor; kolunun arka yüzünde uyuşukluk var. Muayenede baskının üst kolda tek bir noktada olduğu düşünülüyor; kaslarda erime yok.',
      soru: 'Bu hastada iyileşme beklentisi sinir hasarının türüne göre nasıl değişir?',
      cozum: `**Olası tablo:** Kısa süreli bir basıdan sonra ortaya çıkan, tek noktaya sınırlı güçsüzlük en hafif sinir hasarına, **nörapraksiye** uyar: miyelinin bir kesimi bozulmuştur ama akson sağlamdır. Geçici bir iletim bloğu vardır ve miyelin onarılınca 12 hafta içinde tamamen düzelir (Grinsell ve Keating, 2014). ÇSS’de bu miyelini Schwann hücreleri yapar (OpenStax 12.2).

**Ya akson da koptuysa?** **Aksonotmezis** olsaydı baskı noktasının ötesinde Waller dejenerasyonu gelişir, aksonlar günde yaklaşık 1 mm hızla yeniden büyürdü (Grinsell ve Keating, 2014). Basıdan önkol kaslarına örneğin 20 cm yol varsa, bu kabaca 200 günlük, yani altı ayı aşan bir bekleyiş demektir.

**Ders:** Aynı belirti, hasarın miyelinle mi sınırlı kaldığına yoksa aksona mı ulaştığına göre haftalar ya da aylar süren bir iyileşmeye işaret edebilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sinirin iç mimarisi: cerrah ve mühendis için sayılar',
      md: `- **Perinöryum katmanları:** Perinöryum yassı hücrelerin eş merkezli katmanlarından oluşur; siyatik sinir gibi büyük sinirlerin en büyük fasiküllerinde katman sayısı 15’e varabilir (Peltonen ve ark., 2013).
- **Perinöral bariyer:** üç yapısal ve işlevsel bileşeni vardır: her katmanı saran bazal membran, hücreler arasındaki sıkı bağlantılar ve hücre içinden etkin taşıma. İnsanda perinöral sıkı bağlantıların ilk izleri fetal 12.–14. haftalarda görülür (Peltonen ve ark., 2013).
- **Vagus siniri:** İnsan vagusunda boyunda ortalama 7, diyafram altında 5 fasikül vardır; çapı boyunda yaklaşık 2 mm, diyafram altında yaklaşık 1,6 mm’dir. Domuz vagusu benzer çapta olduğu hâlde yaklaşık yedi kat fazla ve daha küçük fasikül taşır (boyunda 47’ye 7, diyafram altında 38’e 5); bu fark vagus sinir uyarımı (VNS) için kurulan hayvan modellerinde önemlidir (Pelot ve ark., 2020). İnsan boyun vagusundaki liflerin yaklaşık %80’i miyelinsizdir (Havton ve ark., 2021).
- **Sinirin kendi siniri:** Gray (1918), Horsley’in epinöryumda uçlanan miyelinli lifler gösterdiğini, Marshall’ın bunları duyu lifi sayıp *nervi nervorum* adını verdiğini ve bazı sinir ağrılarıyla ilişkilendirdiğini aktarır.`,
    },

    // ——— Sinyale köprü ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sinyale kısa bir köprü.** Dinlenim zar potansiyeli hücreden hücreye değişir, ama en sık kullanılan değer −70 mV’tur. Zar yaklaşık −55 mV’luk eşiğe ulaşırsa bir aksiyon potansiyeli doğar ve zar +30 mV’a çıkar: yaklaşık 100 mV’luk bir değişim (OpenStax 12.4). Elektriksel olarak etkin hücreler arasında iki tür bağlantı vardır: kimyasal ve elektriksel sinaps (OpenStax 12.5). Kimyasal sinapsta bir nörotransmitterin etkisi tümüyle onu karşılayan reseptöre bağlıdır; örneğin glutamat, erişkinde reseptörleri sinaps sonrası hücreyi depolarize ettiği için uyarıcı sayılır (OpenStax 12.5). İyon kanalları, aksiyon potansiyeli, sinaps ve nörotransmitterler Hücreden Sinyale bölümünün derslerinde ayrıntılı işlenecek.`,
    },

    // ——— Gray 1918 ve bugün ———
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Yeni nöron doğar mı?',
      md: 'Gray’in 1918 baskısı, erişkindeki bütün nöronların doğumda var olduğunu ve gövdesi yıkılan bir nöronun yenilenmediğini yazıyordu (Gray, 1918). Bugün bunun mutlak bir kural olmadığı biliniyor: burnun koku epitelindeki duyu nöronları yaklaşık 1–4 ay yaşar ve düzenli olarak yenileri yapılır; bu yenilenme yeteneği yaşla kaybolur ve yaşa bağlı koku kaybı bundan kaynaklanır (OpenStax 13.4). Sinir sisteminin değişip uyum sağlama yeteneği (**nöroplastisite**) yeni sinapsları, glia değişikliklerini ve hatta yeni nöronların doğumunu kapsayabilir (Spielman ve ark., 2020).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**İki hücre ailesi:** nöronlar (hesaplama ve haberleşme) + glia (destek; MSS’de 4, ÇSS’de 2 tür).\n\n**Nöron:** dendrit → gövde → akson; bilgi bu yönde akar.\n\n**Sayılar:** yaklaşık 86 milyar nöron; glia nöronlardan on kat fazla değildir, bütün beyinde onlardan azdır.\n\n**Miyelin:** MSS’de oligodendrosit, ÇSS’de Schwann hücresi yapar; sinyal düğümden düğüme atlar.\n\n**Sinir:** akson → fasikül → sinir; kılıflar içten dışa endonöryum, perinöryum, epinöryum.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Gray 1918 ve bugün: sinir dokusu',
      sutunlar: ['Gray 1918', 'Bugünkü bilgi', 'Kaynak'],
      satirlar: [
        [
          'Neuroglia yalnızca beyin ve omurilikte bulunur.',
          'ÇSS’de de glia vardır: Schwann hücreleri ve satellit hücreler.',
          'Gray (1918); OpenStax 12.2',
        ],
        [
          'Nissl granülleri bir “sinirsel enerji deposu”dur; canlı hücrede Nissl cisimcikleri ve nörofibriller görülmez.',
          'Nissl maddesi, ışık mikroskobunda görülen granüllü endoplazma retikulumudur.',
          'Gray (1918); Waymire (2026)',
        ],
        [
          'Sinir uyarısını nörofibriller iletir.',
          'Uyarı, tetik bölgesinde doğan ve akson boyunca ilerleyen aksiyon potansiyeliyle iletilir.',
          'Gray (1918); OpenStax 12.2; OpenStax 12.4',
        ],
        [
          'Miyelin akışkan hâlde yağlı bir maddedir.',
          'Miyelin, glia hücre zarının akson çevresine çok kat sarılmasıyla oluşur; yağları bu zarın fosfolipitleridir.',
          'Gray (1918); OpenStax 12.2',
        ],
        [
          'Nöron kuramının geçerliliği bazı histologlarca sorgulanmaktadır.',
          'Nöronlar ayrı hücrelerdir; birbirleriyle kimyasal ve elektriksel sinapslarla haberleşir.',
          'Gray (1918); OpenStax 12.2; OpenStax 12.5',
        ],
        [
          'Erişkindeki bütün nöronlar doğumda vardır; gövdesi yıkılan nöron yenilenmez.',
          'Koku epitelinin duyu nöronları yenilenir (yaşla bu yetenek kaybolur); nöroplastisite yeni nöron doğumunu da kapsayabilir.',
          'Gray (1918); OpenStax 13.4; Spielman ve ark. (2020)',
        ],
        [
          'Spinal gangliyon hücresi “unipolar”dır.',
          'İnsanda gerçek unipolar hücre yoktur; bu hücreler psödounipolardır.',
          'Gray (1918); OpenStax 12.2',
        ],
      ],
      not: 'Gray’in 20. baskısı (1918) tarihsel bir belge olarak okunur: tablo, dönemin görüşlerini güncel ders kitaplarıyla karşılaştırır. Gray’in sinir lifi ölçüleri ve nöron kuramına ilişkin anlatımı yukarıdaki uzman kutularında.',
    },
  ],
};
