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
      md: `Sinir dokusu iki temel hücre ailesinden oluşur: **nöronlar** (sinir hücreleri) ve **glia hücreleri**. Bu, merkezî sinir sisteminde (MSS) de çevresel sinir sisteminde (ÇSS) de böyledir (OpenStax 12.1). Sinir sisteminin hesaplamasını ve haberleşmesini nöronlar yapar. Ama glia desteği olmadan bu işi yapamazlar (OpenStax 12.2).

Tipik bir nöronun üç bölümü vardır:

- **Dendritler:** başka hücrelerden gelen bilgiyi alan dallar.
- **Hücre gövdesi** (soma).
- **Akson:** gövdeden çıkıp hedef hücrelere uzanan uzantı.

Ders kitapları nöronu genellikle tek aksonlu olarak anlatır. Bilgi nöronun içinde belli bir yönde akar: dendritlerden gövdeye, oradan aksona (OpenStax 12.2). Sinyal bir hücreden ötekine **sinaps** denen bağlantılardan geçer. Sinapslar kimyasal ya da elektriksel olabilir (OpenStax 12.5).

Gövdeler ve dendritler gri cevheri, aksonlar beyaz cevheri yapar (OpenStax 12.1). Aşağıdaki çizimde kabuktaki nöron gövdelerinden çıkan aksonları izle. Bu aksonlar beyaz cevherden geçer.`,
    },
    {
      tur: 'animasyon',
      ad: 'gri-beyaz-cevher',
      baslik: 'Gri cevherdeki gövdeler, beyaz cevherdeki aksonlar',
      aciklama:
        'Kabukta (gri cevher) nöron gövdeleri ve dendritleri durur. Gövdelerden çıkan aksonlar miyelinle sarılıdır ve beyaz cevherden geçer. Kimi komşu kıvrıma gider, kimi aşağıya, beyin sapına ve omuriliğe iner. Sarı noktalar akan sinyalleri gösterir. “Miyelin kılıfını göster” kutusuyla miyelini kaldırıp geri getirebilirsin. Beyaz cevherin rengi bu kılıftan gelir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Nöronun bölgeleri.** Sinir sinyali, yani aksiyon potansiyeli, belli bir yerde doğar: **tetik bölgesi**. Bu bölgeyi iki parça birlikte oluşturur. Biri, aksonun gövdeden çıktığı tümsektir (**akson tepeciği**). Öteki, aksonun ilk kesimidir (**başlangıç segmenti**) (OpenStax 12.2). Dendrit ağacı binlerce bağlantı alabilir. Omurilikteki ortalama bir hareket (motor) nöronunu düşün. Dendrit ağacı orta büyüklükte olsun. Böyle bir nöron yaklaşık 10.000 sinaptik temas alır. Bunların 2.000’i gövdede, 8.000’i dendritlerdedir (Waymire, 2026). Işık mikroskobunda gövdede **Nissl maddesi** görülür. Bu madde, granüllü endoplazma retikulumudur (hücrenin içindeki, ribozomlu bir zar ağı). Katmanlar hâlinde dizilmiştir ve aralarına ribozomlar serpilmiştir (Waymire, 2026).

**Biçim türleri.** Nöronlar gövdeden çıkan uzantıların sayısına göre sınıflanır (Gray, 1918; OpenStax 12.2). Tek uzantılı hücreye unipolar denir. İnsanda gerçek unipolar hücre yoktur. İnsandaki “unipolar” duyu hücreleri aslında **psödounipolardır** (sözde tek kutuplu). OpenStax bu hücreler için iki şey yazar: yalnızca duyu nöronudurlar ve gövdeleri her zaman bir gangliyondadır (OpenStax 12.2). Gray (1918) ise bir istisna anlatır. Trigeminal sinirin orta beyin (mezensefalik) kökü, MSS’nin içindeki unipolar hücrelerden çıkar. Bu hücreler, dördüncü karıncığın üst ucunu ve beyin su yolunu (*aqueductus mesencephali*) çevreleyen merkezi gri maddededir. Gray, Johnston’a dayanarak bu hücrelerin duyu tipinde olduğunu aktarır. Yani bu duyu hücrelerinin gövdeleri bir gangliyonda değil, MSS’nin içindedir. **Bipolar** (iki kutuplu) nöronlar azdır. Başlıca koku epitelinde ve gözün ağ tabakasında (retina) bulunur. Bu ikisinin dışındaki bütün nöronlar **multipolardır**, yani çok kutupludur (OpenStax 12.2).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Nöronların biçim türleri',
      sutunlar: ['Tür', 'Uzantılar', 'Nerede bulunur?', 'Not'],
      satirlar: [
        [
          'Multipolar (çok kutuplu)',
          'Bir akson, çok sayıda dendrit',
          'Psödounipolar ve bipolar olanların dışındaki bütün nöronlar; örneğin sempatik gangliyon nöronları',
          'En yaygın tür',
        ],
        ['Bipolar (iki kutuplu)', 'İki uzantı', 'Başlıca koku epiteli ve retina', 'Az bulunur'],
        [
          'Psödounipolar (sözde tek kutuplu)',
          'Gövdeden tek uzantı çıkar; kısa bir yoldan sonra T biçiminde ikiye ayrılır',
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
      md: `Gray’in 1918 baskısı Waldeyer’in **nöron kuramını** anlatır. Bu kurama göre bir nöronun uzantıları başka nöronlarınkine yalnızca **temas eder**. Onlarla hiçbir zaman kesintisiz bir bütün oluşturmaz. Uyarılar bu temas noktalarından, yani sinapslardan geçer. Gray, sinapsın uyarıyı tek yönde geçirdiğini de yazar: akson uçlarından dendritlere. Ama aynı sayfada bir kuşkuyu da aktarır. Son yıllarda bazı seçkin doku bilimciler (histologlar), kuramın geçerliliğini sorgulamıştır (Gray, 1918). Bugünkü ders kitapları nöronu ayrı bir hücre olarak anlatır. Nöronlar arası iletişim de kimyasal ve elektriksel sinapslarla olur (OpenStax 12.2; OpenStax 12.5).

Gray’in biçim sınıflaması da üç türlüdür: unipolar, bipolar ve multipolar. Ona göre omurilik gangliyonundaki (spinal gangliyon) hücrenin tek uzantısı vardır. Bu uzantı kısa bir yol aldıktan sonra T biçiminde ikiye ayrılır. Erişkinde bipolar biçim yalnızca akustik sinirin gangliyonlarında kalır (Gray, 1918). Bu sinirin bugünkü adı vestibülokoklear sinirdir (işitme-denge siniri). Bugün bu “unipolar” hücrelere **psödounipolar** denir. Çünkü gerçek unipolar hücreler yalnızca omurgasızlarda bulunur. Bipolar nöronların başlıca örnekleri de koku epiteli ve retinadır (OpenStax 12.2). Sempatik gangliyonlardaki nöronlar Gray’e göre de multipolardır. Her birinin bir aksonu ve birkaç dendriti vardır (Gray, 1918).`,
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
            'Aynı beyinlerdeki nöron olmayan hücreler (84,6 ± 9,8 milyar). Sayıları nöronlarla aşağı yukarı eşittir. Glia, beyindeki bütün hücrelerin en çok yarısıdır.',
        },
        {
          deger: '69',
          birim: 'milyar',
          aciklama: '154 gramlık beyincikteki nöron sayısı. Bu, beynin bütün nöronlarının yaklaşık beşte dördüdür.',
        },
        {
          deger: '%19',
          aciklama:
            'Büyük beyin kabuğunun (altındaki yapıyla birlikte) nöron payı: 16 milyar nöron. Oysa bu bölge beyin kütlesinin %82’sidir.',
        },
      ],
      not: 'Kaynaklar: Azevedo ve ark. (2009); Herculano-Houzel (2009). Sayılar ortalamadır. Yöntem ve tanım farkları uzman düzeyinde anlatılıyor.',
    },
    {
      tur: 'sahne',
      baslik: 'Nöronlar nerede? Küçük beyincik, kalabalık nüfus',
      aciklama:
        'Beyne soldan bakıyoruz. Renkler bölgeleri tanıtır: mavi büyük beyin, turuncu beyincik, mor beyin sapı. Beyincik, beyin kütlesinin yaklaşık onda biri kadardır (OpenStax 13.2). Ama beynin 86 milyar nöronunun 69 milyarını taşır. Büyük beyin kabuğu ise altındaki yapıyla birlikte beyin kütlesinin %82’sini oluşturur. Buna karşın nöronların yalnızca %19’unu, yaklaşık 16 milyarını barındırır (Azevedo ve ark., 2009; Herculano-Houzel, 2009).',
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
      md: 'Pek çok ders kitabı ve makale aynı sözü yineler: insan beyninde 100 milyar nöron ve bunun on katı glia hücresi vardır. Çoğu zaman bunun için hiçbir kaynak göstermez (Herculano-Houzel, 2009). Yarım yüzyıl boyunca beyinde 1 trilyon glia hücresi olduğu sanıldı. Glia–nöron oranının da 10:1 olduğu düşünüldü (von Bartheld ve ark., 2016). Hücreleri doğrudan sayan bir yöntem bu sayıları düzeltti. Beyinde yaklaşık **86 milyar nöron** ve aşağı yukarı aynı sayıda nöron olmayan hücre var. Glia, beyindeki bütün hücrelerin en çok yarısıdır (Azevedo ve ark., 2009; Herculano-Houzel, 2009). Oran ise bölgeden bölgeye çok değişir (lisans düzeyinde).',
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
      not: 'Talamus ve ventral pallidum değerleri, Herculano-Houzel’in (2009) aktardığı stereoloji sayımlarından gelir. Stereoloji, ince kesitlerden örnekleyerek hücre sayma yöntemidir. Omurilikte boyun (servikal), göğüs (torakal) ve bel (lomber) düzeyleri arasında hücre bileşiminde anlamlı fark bulunmadı. Eski raporlar bu bölgedeki oranı da abartmıştı (Bahney ve von Bartheld, 2018). Neokortekste nöron ve sinaps sayıları ile miyelinli lif uzunluğu “Sayılarla sinir sistemi” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Nöron saymak: yöntem, tanım ve 150 yıl',
      md: `**Yöntem.** Azevedo ve arkadaşları (2009) erişkin erkek beyinlerindeki hücreleri saydı. Kullandıkları yöntem **izotropik fraksiyonatördür**: dokuyu ezip sıvı hâline getirir ve içindeki hücreleri sayar (Herculano-Houzel, 2009). Ortalama 86,1 ± 8,1 milyar nöron buldular. Nöron olarak NeuN işaretiyle boyanan hücreler sayıldı. Nöron olmayan hücreler ise 84,6 ± 9,8 milyardı. 150 yıllık hücre sayımlarını gözden geçiren bir derleme şunu yazar. Doğrulanmış izotropik fraksiyonatör, glia–nöron oranının 1:1’in altında olduğunu gösterir. Toplam glia da 100 milyardan azdır. Eski doku incelemeleri (histoloji) de aslında hep iki şeyi desteklemişti: yaklaşık 1:1 oranını ve 40–130 milyar glia sayısını (von Bartheld ve ark., 2016). Herculano-Houzel (2012) kanıtsız “olguları” ayrıca eleştirir. Buna bir örnek: “100 milyar nöron ve 10–50 kat fazla glia”.

**Yöntem ve tanım farkı.** Başka çalışmaların bölgesel sayımları toplanınca farklı bir sonuç çıkar. Bu çalışmalarda büyük beyin kabuğu için 21–26 milyar, beyincik için 101 milyar nöron vardır. Toplam 120 milyarı aşar. İzotropik fraksiyonatörle doğrudan sayım ise 86 milyar verir (Herculano-Houzel, 2009). Fark şuradan gelir: Sayımlar farklı yöntemlerle yapıldı. Bölgeler de farklı tanımlandı: bütün kabuk mu, yalnızca yeni kabuk (neokorteks) mu? Bu yüzden bölgesel sayımları toplamak ya da doğrudan karşılaştırmak yanıltıcı olur. Bir çalışma yalnızca neokortekste stereolojiyle sayım yaptı. Nöron ve glianın toplamı kadında 49,3 milyar, erkekte 65,2 milyardı. Çalışmaya 18–93 yaş arası 31 kişi katıldı (Pelvig ve ark., 2008). Kabuk ve neokorteks sayılarının ayrıntısı “Sayılarla sinir sistemi” bölümünde.`,
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
      not: 'Bu derste 86 milyar nöron kullanılır. Glia–nöron oranı için yaklaşık 1:1 alınır; glia için oran 1:1’in altındadır (Herculano-Houzel, 2009; von Bartheld ve ark., 2016). Ders kitabının sayısı ile ölçülen sayı farklıysa ölçümü yapan çalışma esas alınır.',
    },

    // ——— Glia ———
    {
      tur: 'metin',
      md: `**Glia** adı Yunanca “tutkal” anlamındaki sözcükten gelir. Terimi 1856’da Alman patolog Rudolf Virchow koymuştur (OpenStax 12.2). Altı glia türü vardır. Dördü MSS’dedir: **astrosit**, **oligodendrosit**, **mikroglia** ve **ependim hücresi**. İkisi ÇSS’dedir: **Schwann hücresi** ve **satellit (uydu) hücre** (OpenStax 12.2).

Her birinin ayrı bir işi vardır (OpenStax 12.2):

- **Astrositler** nöronların çevresindeki kimyasal ortamı korur.
- **Oligodendrositler** (MSS’de) ve **Schwann hücreleri** (ÇSS’de) aksonların çevresine miyelin sarar.
- **Mikroglia**, MSS’ye yerleşmiş yutucu hücrelerdir (makrofaj).
- **Ependim hücreleri** beynin içindeki dört karıncığı (ventrikül) döşer.
- **Satellit hücreler** gangliyonlardaki nöron gövdelerini sarar.`,
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
          'Hücre dışı kimyasal ortamı korur. Fazla sinyal moleküllerini uzaklaştırır. Doku hasarına tepki verir. Kan-beyin bariyerine katkıda bulunur. MSS’nin dış yüzünde (glia limitans) ve damarların çevresinde (perivasküler ayaklar) kesintisiz bir örtü yapar.',
        ],
        ['Oligodendrosit', 'MSS', 'Miyelin yapar; bir hücre birden çok akson segmentine, aynı ya da ayrı aksonlara miyelin verir'],
        [
          'Mikroglia',
          'MSS',
          'MSS’ye yerleşik yutucu hücre (makrofaj): sağlıklı dokuda da hasarlı hücreleri ve hastalık etkenlerini yutup sindirebilir',
        ],
        ['Ependim hücresi (*ependyma*)', 'MSS', 'Nöral tüpün boşluğundan kalan dört karıncığı döşer'],
        ['Schwann hücresi', 'ÇSS', 'Miyelin yapar; tek bir aksonun yalnızca bir segmentini sarar'],
        ['Satellit (uydu) hücre', 'ÇSS', 'Duyusal ve otonom gangliyonlarda nöron gövdelerini sarar'],
      ],
      not: 'Kaynaklar: OpenStax 12.2; Waymire (2026); FIPAT (2019). Glia enterik sinir sisteminde de bulunur (Fleming ve ark., 2020). Ependimin beyin-omurilik sıvısıyla ilişkisi, Anatomi bölümünün karıncıklar ve BOS dersinde.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Hasardan sonra glia: yara izi',
      md: 'MSS’de bir yaralanmadan sonra astrositler çoğalır ve ölü hücreleri yutar. Çoğu zaman glia hücrelerinden bir yara izi (**glial skar**) oluşur (Waymire, 2026). Glia hücrelerinin sıklaştığı bu doku (gliotik doku), yeniden büyümenin de önünde bir engeldir. Erişkin hayvan deneylerinde aksonlar çevresel kökte iyi büyür. Ama MSS–ÇSS geçiş bölgesindeki gliotik dokuya ulaşınca durur (Fraher, 2000). Geçiş bölgesi bu dersin “Sinir sistemi ne yapar, nasıl bölünür?” bölümünde anlatıldı.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Oligodendrositlerin alanı: beyaz cevher',
      aciklama:
        'Beynin sağ yarısı kaldırıldı. Sol yarımküreye orta hattan, içeriden bakıyoruz. Kabuk, derin çekirdekler ve beyin sapı soluk bırakıldı. Gerçeğe yakın renkler kullanıldı. Krem renkli kitle yarımkürenin beyaz cevheridir. Ortadaki beyaz kemer, iki yarımküreyi bağlayan korpus kallozumdur (OpenStax 13.2). Burada aksonların miyelinini oligodendrositler yapar. Bir oligodendrosit birden çok akson segmentine miyelin verir (OpenStax 12.2). Önde, aşağıda uzanan sarımsı şerit optik sinirdir. Adı sinir olsa da onu da oligodendrositler miyelinler (Romano ve ark., 2019).',
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
      md: `**İki tür astrosit.** Protoplazmik astrositler başlıca gri cevherde bulunur. Lifli (fibröz) astrositler başlıca beyaz cevherde bulunur. Glutamat, nöronların kullandığı bir haberci maddedir. Astrositler sinaps aralığındaki glutamatı alır ve glutamine çevirir. Böylece onu etkisiz kılar (Waymire, 2026).

**Köken.** Ektoderm embriyonun dış hücre tabakasıdır, mezoderm orta tabakasıdır. UTHealth kitabına göre makroglia ektodermden gelir. Makroglia astrosit, oligodendrosit ve ependim hücresini kapsar. Mikroglia ise “büyük olasılıkla” mezodermden gelir (Waymire, 2026). OpenStax, mikroglianın makrofaj kökenli olabileceğini yazar (OpenStax 12.2). İki ders kitabı da mikroglianın kökeni konusunda kesin konuşmaz.

**Ömür boyu değişim.** Erişkin yaşam boyunca neokortekteki oligodendrosit sayısı %27 azalır. Bu sayı, toplam nöron sayısıyla güçlü bir ilişki gösterir. Astrosit sayısı ise yaşam boyu sabit kalır (Pelvig ve ark., 2008).`,
    },

    // ——— Miyelin ve sinir lifi ———
    {
      tur: 'metin',
      md: `Birçok akson yalıtkan bir kılıfla sarılıdır: **miyelin**. Bu kılıfı glia hücreleri yapar. Glia hücresinin zarı, aksonun çevresine kat kat sarılır. Miyelindeki yağlar esas olarak bu zarın yağlarıdır (fosfolipitler) (OpenStax 12.2). MSS’de miyelini **oligodendrositler**, ÇSS’de **Schwann hücreleri** yapar (OpenStax 12.2).

Kılıf kesintisiz değildir. Aradaki küçük boşluklara **Ranvier düğümü** denir. Bu düğümler, sinyalin akson boyunca ilerleyişinde önemlidir (OpenStax 12.2). Miyelinsiz bir aksonda sinyal sürekli ilerler. Miyelinli bir aksonda ise düğümden düğüme atlar. Buna **saltatoryal iletim** (sıçramalı iletim) denir (OpenStax 12.4).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İletim hızını ne belirler?** Miyelinin yanında aksonun çapı da iletim hızını etkiler. Kalın akson daha hızlı iletir (OpenStax 12.4). Bir oligodendrosit birden çok akson segmentine miyelin verir. Bu segmentler aynı aksonda da olabilir, ayrı aksonlarda da. Bir Schwann hücresi ise tek bir aksonun yalnızca bir segmentini sarar (OpenStax 12.2).

**Miyelinsiz lifler azımsanmamalı.** Sempatik liflerin çoğu miyelinsizdir. Beyin-omurilik (serebrospinal) sinirlerinin bazı lifleri de öyledir. Gray bunlara gri ya da jelatinimsi lifler, **Remak lifleri** der (Gray, 1918). Organ bağışçılarından alınan boyun vagus sinirlerinde lifler sayıldı. Ortalama 111.984 lif vardı ve bunların yaklaşık %80’i miyelinsizdi (Havton ve ark., 2021).

**Miyelinleşme takvimi.** İnsan neredeyse miyelinsiz bir MSS ile doğar. Oligodendrosit sayısı doğumdan sonra hızla artar (Williamson ve Lyons, 2018). Miyelinleşmenin bölge bölge takvimi “Sayılarla sinir sistemi” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Miyelin hastalanınca: MS ve Guillain–Barré',
      md: 'Miyelini yapan hücre MSS’de ve ÇSS’de farklıdır. Bu fark iki hastalığı ayırmayı kolaylaştırır. **Multipl sklerozda** (MS) beyin ve omuriliğin beyaz cevherinde çok sayıda iz (skar) bulunur. Belirtiler hem somatik hem otonom bozuklukları kapsar (OpenStax 12.2). **Guillain–Barré sendromu** ise çevresel sinir sisteminin bir hastalığıdır. Bu hastalıkta miyelin yıkılır (demiyelinizan hastalık) (OpenStax 12.2). Beyaz cevher miyelin sayesinde yağdan zengindir. Bu yüzden manyetik rezonans (MR) görüntülerinde gri cevherden kolayca ayrılır (OpenStax 12.1).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: İki hasta, iki ayrı miyelin',
      oyku: 'Nöroloji polikliniğinde aynı gün iki hasta görülüyor. 29 yaşında bir kadın, son iki yılda yaşadığı atakları anlatıyor. Görme bulanıklığı, bacakta uyuşma ve idrar sıkışması farklı zamanlarda başlayıp geçmiş. Beyin MR’ında beyaz cevherde çok sayıda leke var. 45 yaşında bir erkekte ise birkaç gün içinde güçsüzlük gelişmiş. Güçsüzlük iki bacakta başlamış ve yukarı doğru yayılmış. Sinir iletim çalışmaları, çevresel sinirlerde miyelin hasarını düşündürüyor.',
      soru: 'İki hastada miyelin hasarı sinir sisteminin hangi bölümündedir ve o miyelini hangi hücre yapar?',
      cozum: `**Birinci hasta:** Lekeler beyin MR’ında beyaz cevherdedir, yani MSS’dedir. Beyin ve omuriliğin beyaz cevherinde çok sayıda iz **multipl skleroza** uyar. Belirtilerin hem somatik (görme, uyuşma) hem otonom (idrar sıkışması) olması da MS’in özelliğidir (OpenStax 12.2). MSS’de miyelini **oligodendrositler** yapar. Bir oligodendrosit birden çok akson segmentine miyelin verir (OpenStax 12.2). Beyaz cevher yağdan zengin olduğu için MR’da gri cevherden kolayca ayrılır (OpenStax 12.1). Miyelin yıkıcı hastalıklarda beyaz cevherdeki lekeler, T2 ağırlıklı görüntülerde parlak görünür. FLAIR çekiminde karıncıklardaki beyin-omurilik sıvısının parlak sinyali bastırılır. Lekeler böylece daha iyi seçilir (Simha ve ark., 2012).

**İkinci hasta:** Hasar çevresel sinirlerdedir. Tablo **Guillain–Barré sendromunu** düşündürür. Bu, ÇSS’de miyelinin yıkıldığı (demiyelinizan) bir hastalıktır (OpenStax 12.2). ÇSS’de miyelini **Schwann hücreleri** yapar. Her Schwann hücresi tek bir aksonun yalnızca bir segmentini sarar (OpenStax 12.2).

**Ortak ders:** İki ipucu hasarın yerini gösterir: belirtilerin dağılımı ve beyaz cevherin MR’daki görünümü. Bunlar, hasarın MSS’de mi ÇSS’de mi olduğunu ayırt etmeye yardım eder. Böylece hangi hücrenin yaptığı miyelinin bozulduğu da anlaşılır. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Gray’in sinir lifi: ölçüler ve terimler',
      md: `Gray (1918) miyelinli lifi iki parçayla anlatır. Ortada bir akson vardır. Gray buna “axis-cylinder” der. Çevresinde yağlı bir kılıf vardır. Bu kılıf osmik asitle siyaha boyanır. Gray kılıfa “medullary sheath” ya da “Schwann’ın beyaz maddesi” der. Ona göre sinir liflerinin çapı 2 ile 16 mikrometre (µm) arasında değişir. Bu fark esas olarak miyelinin miktarından gelir (Gray, 1918). Bugün başka bir nokta da vurgulanır: iletim hızı miyelinle birlikte akson çapına da bağlıdır (OpenStax 12.4).

Gray’e göre Schwann kılıfı (nörilemma), beyin ve omurilikteki miyelinli liflerde yoktur (Gray, 1918). Bu gözlem bugünkü bilgiyle uyumludur: MSS’de miyelini Schwann hücreleri değil, oligodendrositler yapar (OpenStax 12.2). Gray’in miyelini “akışkan hâlde yağlı bir madde” sayması ise eskimiştir. Miyelin, glia hücre zarının akson çevresine çok kat sarılmasıyla oluşan bir kılıftır (Gray, 1918; OpenStax 12.2).`,
    },

    // ——— Çevresel sinir, gangliyon, pleksus ———
    {
      tur: 'metin',
      md: `Bir **sinir** (*nervus*), ÇSS’deki akson demetidir. Sinir, iç içe üç bağ dokusu kılıfıyla sarılıdır (OpenStax 13.4):

- **Endonöryum:** tek tek aksonları saran gevşek bağ dokusu.
- **Perinöryum:** aksonları demetler (**fasiküller**) hâlinde toplar ve her fasikülü ayrı ayrı sarar. Lifli bir bağ dokusudur.
- **Epinöryum:** bütün sinirin dış yüzünü saran lifli bağ dokusu.

ÇSS’deki nöron gövdesi kümelerine **gangliyon** denir. Gangliyonlar çoğunlukla iki türdür (OpenStax 13.4; Gray, 1918):

- **duyusal** gangliyonlar, örneğin omurilik sinirlerinin arka köklerindeki gangliyonlar;
- **otonom** gangliyonlar.

Sinir dalları bazı yerlerde birbirine katılarak ağlar oluşturur. Bunlara **pleksus** (*plexus nervosi*) denir (Gray, 1918; FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kılıflar aynı zamanda bir engeldir.** Epinöryum çoğunlukla kollajenden, yani sağlam bir bağ dokusu lifinden oluşur. Sinire gerilmeye karşı dayanıklılık verir, ama madde geçişine engel (bariyer) olmaz. **Perinöryum** ise akson–Schwann hücresi birimlerini fasiküllere ayırır. Asıl engel odur. Endonöryum ile fasikülün dışındaki dokular arasında maddelerin yayılmasını (difüzyon) sınırlar (Peltonen ve ark., 2013).

**Gangliyonlar nerede?** Gray (1918) gangliyonları şu yerlerde sayar:

- omurilik sinirlerinin arka köklerinde,
- trigeminal, fasiyal, glossofaringeal ve vagus sinirlerinin duyu köklerinde,
- akustik sinirde.

Bunlara ek olarak sempatik sinirlerle ilişkili gangliyonlar da vardır. Arka kök gangliyonu gibi duyusal gangliyonlar, başlıca psödounipolar nöronlardan oluşur (Gray, 1918; OpenStax 13.4). Akustik (vestibülokoklear) sinirin gangliyonlarında ise bipolar biçim korunur. Sempatik gangliyonlardaki nöronlar multipolardır (Gray, 1918). Her iki türde nöron gövdelerini satellit (uydu) hücreler sarar (OpenStax 12.2). Arka kök gangliyonunun TA2’deki adı *ganglion spinale*’dir. Aynı listede bir eş anlamlısı da vardır: *ganglion sensorium nervi spinalis* (FIPAT, 2019).

**Pleksuslar.** Bir pleksustan çıkan her dal, pleksusu oluşturan bütün ana sinir gövdelerinden lif taşıyabilir. Ama lifler birbiriyle kaynaşmaz, ayrı kalır (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sinir hasarı: Waller dejenerasyonu ve iyileşme',
      md: 'Gray, bir sinir lifi kesildiğinde ne olduğunu anlatır. Kesiğin iki ucu farklı davranır. Merkeze bakan uç yalnızca ilk Ranvier düğümüne kadar yıkılır. Çevredeki uç ise bütün boyunca aynı anda yıkılır. Buna **Waller dejenerasyonu** denir. Kesik uçlar dikilirse sinir yeniden büyür: aksonlar merkezi uçtan aşağı doğru uzanır (Gray, 1918). Seddon sınıflamasında en hafif hasar **nörapraksidir**. Çoğunlukla basıyla oluşur. Akson sağlamdır, ama miyelinin bir kesimi bozulmuştur. Geçici bir iletim bloğu olur, yani sinyal bir süre o noktadan geçemez. Miyelin onarılınca 12 hafta içinde tamamen düzelir. Akson da koparsa hasarın adı **aksonotmezistir**. Bu durumda Waller dejenerasyonu gelişir. Aksonlar günde yaklaşık 1 mm hızla, yavaşça yeniden büyür (Grinsell ve Keating, 2014).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Sabah kalkmayan bilek',
      oyku: '32 yaşında bir erkek, bir gece kolunu sandalyenin sert kenarına dayayarak uyuyakalıyor. Sabah bileğini ve parmaklarını kaldıramıyor. Kolunun arka yüzünde uyuşukluk var. Muayenede baskının üst kolda tek bir noktada olduğu düşünülüyor. Kaslarda erime yok.',
      soru: 'Bu hastada iyileşme beklentisi sinir hasarının türüne göre nasıl değişir?',
      cozum: `**Olası tablo:** Güçsüzlük kısa süreli bir basıdan sonra başlamış ve tek bir noktaya sınırlı. Bu, en hafif sinir hasarına, **nörapraksiye** uyar. Miyelinin bir kesimi bozulmuştur ama akson sağlamdır. Geçici bir iletim bloğu vardır. Miyelin onarılınca 12 hafta içinde tamamen düzelir (Grinsell ve Keating, 2014). ÇSS’de bu miyelini Schwann hücreleri yapar (OpenStax 12.2).

**Ya akson da koptuysa?** O zaman hasar **aksonotmezis** olurdu. Baskı noktasının ötesinde Waller dejenerasyonu gelişirdi. Aksonlar günde yaklaşık 1 mm hızla yeniden büyürdü (Grinsell ve Keating, 2014). Basıdan önkol kaslarına örneğin 20 cm yol olsun. Bu, kabaca 200 günlük, yani altı ayı aşan bir bekleyiş demektir.

**Ders:** Aynı belirti farklı iyileşme sürelerine işaret edebilir. Hasar miyelinle sınırlı kaldıysa iyileşme haftalar sürebilir. Aksona ulaştıysa aylar sürebilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sinirin iç yapısı: cerrah ve mühendis için sayılar',
      md: `- **Perinöryum katmanları:** Perinöryum, yassı hücrelerin iç içe (eş merkezli) katmanlarından oluşur. Siyatik sinir gibi büyük sinirlerin en büyük fasiküllerinde katman sayısı 15’e varabilir (Peltonen ve ark., 2013).
- **Perinöryumun engeli:** Üç yapısal ve işlevsel parçası vardır: her katmanı saran taban zarı (bazal membran), hücreler arasındaki sıkı bağlantılar ve hücre içinden etkin taşıma. İnsanda perinöryumdaki sıkı bağlantıların ilk izleri, fetüste 12.–14. haftalarda görülür (Peltonen ve ark., 2013).
- **Vagus siniri:** İnsan vagusunda boyunda ortalama 7, diyafram altında 5 fasikül vardır. Çapı boyunda yaklaşık 2 mm, diyafram altında yaklaşık 1,6 mm’dir. Domuz vagusunun çapı benzerdir. Ama yaklaşık yedi kat fazla ve daha küçük fasikül taşır: boyunda 47’ye 7, diyafram altında 38’e 5. Bu fark, vagus siniri uyarımı (VNS) için kurulan hayvan modellerinde önemlidir (Pelot ve ark., 2020). İnsan boyun vagusundaki liflerin yaklaşık %80’i miyelinsizdir (Havton ve ark., 2021).
- **Sinirin kendi siniri:** Gray (1918) bu konuda üç şey aktarır. Horsley, epinöryumda uçlanan miyelinli lifler göstermiştir. Marshall bunları duyu lifi saymış ve *nervi nervorum* (sinirlerin sinirleri) adını vermiştir. Marshall bu lifleri bazı sinir ağrılarıyla da ilişkilendirmiştir.`,
    },

    // ——— Sinyale köprü ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sinyale kısa bir köprü.** Dinlenen bir hücrenin zarının iki yanı arasında bir gerilim farkı vardır: dinlenim zar potansiyeli. Bu değer hücreden hücreye değişir, ama en sık kullanılan değer −70 mV’tur. Zar yaklaşık −55 mV’luk eşiğe ulaşırsa bir aksiyon potansiyeli doğar. Zar +30 mV’a çıkar; bu yaklaşık 100 mV’luk bir değişimdir (OpenStax 12.4). Elektriksel olarak etkin hücreler arasında iki tür bağlantı vardır: kimyasal ve elektriksel sinaps (OpenStax 12.5). Kimyasal sinapsta bir haberci madde (nörotransmitter) iş görür. Bu maddenin etkisi tümüyle onu karşılayan almaca (reseptör) bağlıdır. Örneğin glutamat erişkinde uyarıcı sayılır. Çünkü reseptörleri, sinaps sonrası hücrenin zarını daha az eksi yapar (depolarize eder) (OpenStax 12.5). İyon kanalları, aksiyon potansiyeli, sinaps ve nörotransmitterler Hücreden Sinyale bölümünün derslerinde ayrıntılı işlenecek.`,
    },

    // ——— Gray 1918 ve bugün ———
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Yeni nöron doğar mı?',
      md: 'Gray’in 1918 baskısı iki şey yazıyordu. Erişkindeki bütün nöronlar doğumda vardır. Gövdesi yıkılan bir nöron yenilenmez (Gray, 1918). Bugün bunun mutlak bir kural olmadığı biliniyor. Burnun koku epitelindeki duyu nöronları yaklaşık 1–4 ay yaşar ve düzenli olarak yenileri yapılır. Bu yenilenme yeteneği yaşla kaybolur. Yaşa bağlı koku kaybı da bundan kaynaklanır (OpenStax 13.4). Sinir sisteminin değişip uyum sağlama yeteneğine **nöroplastisite** denir. Bu yetenek yeni sinapsları, glia değişikliklerini ve hatta yeni nöronların doğumunu kapsayabilir (Spielman ve ark., 2020).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**İki hücre ailesi:** nöronlar (hesaplama ve haberleşme) + glia (destek; MSS’de 4, ÇSS’de 2 tür).

**Nöron:** dendrit → gövde → akson; bilgi bu yönde akar.

**Sayılar:** Yaklaşık 86 milyar nöron vardır. Glia nöronlardan on kat fazla değildir; bütün beyinde onlardan azdır.

**Miyelin:** MSS’de oligodendrosit, ÇSS’de Schwann hücresi yapar. Sinyal düğümden düğüme atlar.

**Sinir:** akson → fasikül → sinir. Kılıflar içten dışa endonöryum, perinöryum, epinöryum.`,
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
          'Uyarıyı aksiyon potansiyeli iletir. Aksiyon potansiyeli tetik bölgesinde doğar ve akson boyunca ilerler.',
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
      not: 'Gray’in 20. baskısı (1918) tarihsel bir belge olarak okunur. Tablo, dönemin görüşlerini güncel ders kitaplarıyla karşılaştırır. Gray’in sinir lifi ölçüleri ve nöron kuramı üzerine anlattıkları yukarıdaki uzman kutularında.',
    },
  ],
};
