import type { DersBolumu } from '../../../types';

/** Kemiklerin sahnelerdeki renkleri (yalnızca tanıtır). */
export const KEMIK_RENGI = {
  alin: '#f4a261',
  yanKafa: '#8ecae6',
  sakak: '#90be6d',
  artKafa: '#b8a6e6',
  kama: '#e76f51',
  kalbur: '#f9c74f',
  ustCene: '#f7a8b8',
  altCene: '#c9ada7',
  elmacik: '#5fb3a8',
  kucukYuz: '#d8c99b',
  omur: '#9db4c0',
};

/** 1. bölüm: kafatasının bölümleri ve kemikleri. */
export const kafatasinaGenelBakis: DersBolumu = {
  id: 'kafatasina-genel-bakis',
  baslik: 'Kafatasına genel bakış: beyin kutusu ve yüz',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyin, vücudun en kırılgan organlarından biridir: yumuşak dokusu kemikten bir kutunun içinde durur. Bu kutuya **kafatası** denir. Yetişkinde kafatası **22 kemikten** oluşur. Bunların 21’i birbirine sıkıca kaynaşmış, hareketsiz bir bütündür; 22. kemik olan **alt çene**, kafatasının hareket edebilen tek kemiğidir (OpenStax 7.2).

Kafatası iki bölüme ayrılır:

- **Beyin kutusu (nörokranyum):** beyni saran **sekiz kemik**. Çift olanlar yan kafa (parietal) ve şakak (temporal) kemikleri; tek olanlar alın (frontal), art kafa (oksipital), kama (sfenoid) ve kalbur (etmoid) kemikleridir.
- **Yüz kemikleri (viserokranyum):** üst ve alt çeneyi, burnu ve göz çukurlarını yapan **14 kemik**. Altısı çifttir: üst çene, damak, elmacık, burun, gözyaşı kemikleri ve alt burun kavkası. İkisi tektir: sapan kemiği (vomer) ve alt çene.

Beyin kutusunun yuvarlak tepesine **kalvarya** (kafa takkesi), altındaki kemik zemine de **kafatası tabanı** denir. Başa ait yedi kemik daha vardır ama kafatasına sayılmaz: boynun üst kısmındaki **dil kemiği** (hiyoid) ve her orta kulaktaki üçer küçük **kulak kemikçiği** (OpenStax 7.1). Dil kemiği hiçbir kemikle eklem yapmaz; bu yüzden kafatasının parçası değildir.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kafatasının kemikleri',
      aciklama:
        'Her kemik kendi renginde: turuncu alın, mavi yan kafa, yeşil şakak, mor art kafa, kırmızı kama, sarı kalbur kemiği; yüzde pembe üst çene, kahverengi alt çene, deniz yeşili elmacık kemiği. “Ayrıştır” ile kemikleri birbirinden uzaklaştırabilir, “Yapılar” listesinden birine dokunarak adını ve görevini okuyabilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'egik',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['alin-kemigi'], renk: '#f4a261' },
          { secici: ['yan-kafa-kemigi'], renk: '#8ecae6' },
          { secici: ['sakak-kemigi'], renk: '#90be6d' },
          { secici: ['art-kafa-kemigi'], renk: '#b8a6e6' },
          { secici: ['kama-kemigi'], renk: '#e76f51' },
          { secici: ['kalbur-kemigi'], renk: '#f9c74f' },
          { secici: ['ust-cene-kemigi'], renk: '#f7a8b8' },
          { secici: ['alt-cene-kemigi'], renk: '#c9ada7' },
          { secici: ['elmacik-kemigi'], renk: '#5fb3a8' },
          { secici: ['burun-kemigi', 'gozyasi-kemigi', 'damak-kemigi', 'sapan-kemigi', 'alt-burun-kavkasi'], renk: '#d8c99b' },
        ],
        etiketler: [
          { yapi: 'alin-kemigi' },
          { yapi: 'yan-kafa-kemigi-sol', metin: 'Yan kafa kemiği' },
          { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
          { yapi: 'elmacik-kemigi-sol', metin: 'Elmacık kemiği' },
          { yapi: 'ust-cene-kemigi-sol', metin: 'Üst çene' },
          { yapi: 'alt-cene-kemigi', metin: 'Alt çene' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'katman', 'liste'],
    },
    {
      tur: 'tablo',
      baslik: 'Beyin kutusunun sekiz kemiği',
      sutunlar: ['Kemik', 'Latince adı', 'Sayı', 'Nerede, ne yapar?'],
      satirlar: [
        [
          'Alın kemiği',
          '*Os frontale*',
          'Tek',
          'Alnı yapar. İçe uzanan yassı kısmı hem göz çukurunun tavanı hem ön kafa çukurunun tabanıdır. Kaşların hemen üstünde içinde frontal sinüs bulunur.',
        ],
        [
          'Yan kafa kemiği',
          '*Os parietale*',
          'Çift',
          'Kafatasının üst-yan duvarının çoğunu yapar; sağ ve sol yan kafa kemikleri tepede birleşir.',
        ],
        [
          'Şakak kemiği',
          '*Os temporale*',
          'Çift',
          'Yan-alt duvarı yapar. Sert kayalık kısmı orta ve iç kulağı içinde taşır; kulak memesinin arkasındaki mastoid çıkıntı elle hissedilir.',
        ],
        [
          'Art kafa kemiği',
          '*Os occipitale*',
          'Tek',
          'Kafatasının arkasını ve tabanının arka kısmını yapar. Foramen magnum ve birinci boyun omuruyla eklem yapan kondiller bu kemiktedir.',
        ],
        [
          'Kama kemiği',
          '*Os sphenoidale*',
          'Tek',
          'Tabanın ortasında, kanatlarını açmış bir kelebeğe ya da yarasaya benzer. Neredeyse bütün kafatası kemikleriyle eklem yaptığı için “kilit taşı” kemiktir.',
        ],
        [
          'Kalbur kemiği',
          '*Os ethmoidale*',
          'Tek',
          'Burun boşluğunun tavanıdır; elek gibi delikli plağından koku sinirinin lifleri geçer. Burun bölmesine ve göz çukurunun iç duvarına da katılır.',
        ],
      ],
      not: 'Kaynak: OpenStax 7.2; Jamil ve Callahan (2023). Sfenoid adı Yunanca “kama biçimli” anlamındaki sözcükten gelir.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Kafatası = 8 beyin kutusu kemiği + 14 yüz kemiği = 22 kemik.**\n\nHareket eden tek kemik: **alt çene**. Dil kemiği ve kulak kemikçikleri kafatasına sayılmaz.\n\nTek kemikler: alın, art kafa, kama, kalbur (beyin kutusu); sapan kemiği ve alt çene (yüz).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Şakak kemiğinin Latince adı “zaman” anlamına gelen sözcükten türer. Yaygın bir anlatıya göre bunun nedeni, saçların ilk ağardığı yerin şakaklar olmasıdır (OpenStax 7.2). Kama kemiğinin üst yüzündeki eyer biçimli çukurun adı ise **sella turcica**, yani “Türk eyeri”dir: önü ve arkası yüksek Osmanlı at eyerine benzetilmiştir.',
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla kafatası',
      ogeler: [
        {
          deger: '22',
          birim: 'kemik',
          aciklama: 'Yetişkin kafatası: 8 beyin kutusu kemiği ve 14 yüz kemiği. Yalnızca alt çene hareket eder.',
        },
        {
          deger: '≈6,3',
          birim: 'mm',
          aciklama: 'Kuru kafataslarında ölçülen ortalama kafatası kubbesi kalınlığı (bölgeye göre yaklaşık 5,3–7,5 mm).',
        },
        {
          deger: '≈3',
          birim: 'mm',
          aciklama: 'Şakaktaki pterionun kalınlığı; şakak kemiğinin yassı kısmının ortası ortalama yalnızca ~2 mm’dir.',
        },
        { deger: '6', birim: 'bıngıldak', aciklama: 'Yenidoğanda: bir ön, bir arka, iki sfenoid ve iki mastoid bıngıldak.' },
        { deger: '12', birim: 'cm', aciklama: 'İlk yılda baş çevresinin ortalama artışı: beyin büyüdükçe kafatası da büyür.' },
        { deger: '≈826', birim: 'mm²', aciklama: 'Foramen magnumun ortalama alanı: kafatasının en büyük deliği.' },
      ],
      not: 'Kaynaklar: OpenStax 7.2; Moreira-Gonzalez ve ark. (2006); Hwang ve ark. (1999); Direk ve ark. (2022); Jones ve ark. (2026); Edwards ve ark. (2018b).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yüzün 14 kemiği',
      sutunlar: ['Kemik', 'Latince adı', 'Sayı', 'Görevi'],
      satirlar: [
        [
          'Üst çene kemiği',
          '*Maxilla*',
          'Çift',
          'Üst çeneyi ve üst dişleri taşır; sert damağın ön dörtte üçünü ve göz çukuru tabanının bir kısmını yapar. İçinde en büyük sinüs, maksiller sinüs bulunur.',
        ],
        [
          'Damak kemiği',
          '*Os palatinum*',
          'Çift',
          'Yatay plağı sert damağın arka dörtte biridir; burun boşluğunun yan duvarına ve göz çukurunun tabanının iç kısmına küçük bir katkı verir.',
        ],
        [
          'Elmacık kemiği',
          '*Os zygomaticum*',
          'Çift',
          'Yanak kemiği: göz çukurunun dış duvarının çoğunu yapar; şakak çıkıntısı elmacık kemerinin ön kısmıdır.',
        ],
        ['Burun kemiği', '*Os nasale*', 'Çift', 'İkisi birleşerek burun kemerinin kemik tabanını yapar.'],
        [
          'Gözyaşı kemiği',
          '*Os lacrimale*',
          'Çift',
          'Göz çukurunun ön iç duvarındaki küçük dikdörtgen kemik; gözyaşını buruna ileten kanal buradan başlar.',
        ],
        [
          'Alt burun kavkası',
          '*Concha nasalis inferior*',
          'Çift',
          'Burun boşluğunun yan duvarından içeri kıvrılan en büyük kavka. Üst ve orta kavkalar kalbur kemiğinin parçasıdır; bu ayrı bir kemiktir.',
        ],
        [
          'Sapan kemiği',
          '*Vomer*',
          'Tek',
          'Burun bölmesinin arka-alt kısmı. Üst kısmını kalbur kemiğinin dik plağı, önünü bölme kıkırdağı yapar.',
        ],
        [
          'Alt çene kemiği',
          '*Mandibula*',
          'Tek',
          'Alt dişleri taşır; kondili şakak kemiğiyle çene eklemini (temporomandibular eklem) yapar. Doğumda iki yarımdır, ilk yılda kaynaşır.',
        ],
      ],
      not: 'Kaynak: OpenStax 7.2.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Kemik iki yoldan oluşur',
      md: `Kafatası kemikleri iki farklı yoldan kemikleşir. **Zar içi (intramembranöz) kemikleşmede** mezenşim hücreleri kümelenip kemikleşme merkezleri oluşturur ve doğrudan kemik yapan hücrelere dönüşür; yüzün yassı kemikleri ve kafatası kubbesinin kemiklerinin çoğu böyle oluşur. **Kıkırdak içi (endokondral) kemikleşme** önce bir kıkırdak taslağı ister ve daha uzun sürer; kafatası tabanının kemikleri bu yolla oluşur (OpenStax 6.4).

Bu ayrıma göre beyin kutusu iki parçaya ayrılır (Spazzapan ve Velnar, 2024):

- **Zar kökenli nörokranyum:** alın kemiği, yan kafa kemikleri, şakak kemiğinin yassı (skuamöz) kısmı ve art kafa kemiğinin iki yan kafa kemiği arasındaki (interparietal) üst parçası.
- **Kıkırdak kökenli nörokranyum (kondrokranyum):** kalbur ve kama kemikleri, şakak kemiğinin kayalık ve mastoid kısımları ve art kafa kemiğinin geri kalanı.

Kafatası hem mezodermden hem nöral krestten (sinir kabartısı) gelişir (Anderson ve ark., 2023). Farede yapılan hücre soyu izleme çalışmasında alın kemiklerinin nöral krestten, yan kafa kemiklerinin mezodermden geliştiği gösterildi (Jiang ve ark., 2002); kubbe dikişlerinin çoğu da bu iki dokunun sınırında yer alır (Stanton ve ark., 2022). Şakak kemiği doğumdan önce beş parçadan oluşur ve toplam 10 birincil kemikleşme merkezinden gelişir (Grzonkowska ve ark., 2023).`,
    },
  ],
};
