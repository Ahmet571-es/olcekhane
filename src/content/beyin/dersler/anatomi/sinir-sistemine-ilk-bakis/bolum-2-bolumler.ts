import type { DersBolumu } from '../../../types';

/** Ara beyni gösteren sahnede gizlenen, büyük beynin derindeki yapıları. */
const DERIN_SEREBRUM = [
  'kaudat-cekirdek',
  'putamen',
  'globus-pallidus',
  'hipokampus',
  'amigdala',
  'forniks',
  'forniks-komissuru',
  'korpus-kallozum',
  'on-komissur',
  'ic-kapsul',
];

/** Beş kesecik ve boşlukları için renkler (yalnızca tanıtır). */
const TELENSEFALON = '#5b84f2';
const DIENSEFALON = '#25b9a3';
const MEZENSEFALON = '#a98cf6';
const METENSEFALON = '#f2b544';
const MIYELENSEFALON = '#ee6a92';

/** 2. bölüm: beynin büyük bölümleri, gelişim, sayılar. */
export const beyninBolumleri: DersBolumu = {
  id: 'beynin-bolumleri',
  baslik: 'Beynin büyük bölümleri ve gelişimi',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyin, kafatasının içinde duran ve merkezî sinir sisteminin üst ucunu oluşturan organdır. Anatomide dört büyük bölümde incelenir:

1. **Büyük beyin (serebrum):** Beynin en büyük bölümü. Kıvrımlı dış yüzüne **beyin kabuğu** (korteks) denir. Derin bir yarık onu sağ ve sol **yarımküre** diye ikiye ayırır; iki yarımküreyi en büyük lif köprüsü olan **korpus kallozum** birbirine bağlar. Bellek, duygular ve bilinç gibi en karmaşık işler büyük beynin çalışmasıyla ortaya çıkar.
2. **Ara beyin (diensefalon):** Büyük beynin altında, içeride saklıdır. En büyük parçası **talamustur**: koku dışındaki bütün duyusal bilgiler kabuğa ulaşmadan önce talamustan geçer. Talamusun altındaki **hipotalamus** vücudun iç dengesini korur; otonom sinir sistemini ve hormon sistemini yönetir.
3. **Beyin sapı:** **Orta beyin**, **pons** ve **omurilik soğanından** oluşur; beyni omuriliğe bağlar. Solunumu, kalp atışını ve kan basıncını düzenleyen merkezler buradadır.
4. **Beyincik (serebellum):** Büyük beynin arkasında ve altında duran "küçük beyin". Beyin kütlesinin yaklaşık onda biri kadardır. Hareketleri düzenler: büyük beynin planladığı hareketi bedenden gelen bilgilerle karşılaştırır ve gerekirse düzeltir.`,
    },
    {
      tur: 'sahne',
      baslik: 'Dört bölüm bir arada',
      aciklama:
        'Renkler dört bölümü gösterir: mavi büyük beyin, turkuaz ara beyin, mor beyin sapı, turuncu beyincik. Beyni parmağınla döndür; bir parçaya dokununca adı ve görevi açılır. Ara beyin içeride saklı olduğu için en iyi alttan görünür.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'sap'],
        renk: 'bolge',
        gizle: ['bolge:sinir'],
        bakis: 'sol',
        etiketler: [
          { yapi: 'ust-parietal-lobul-sol', metin: 'Büyük beyin' },
          { yapi: 'beyincik', metin: 'Beyincik' },
          { yapi: 'pons', metin: 'Beyin sapı' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Kabuğu saydamlaştıralım: içerideki ara beyin',
      aciklama:
        'Büyük beyin yarı saydam yapıldı. Ortada, beyin sapının hemen üstünde turkuaz renkli ara beyin görünür: iki yanda talamuslar, altlarında hipotalamus. Hipotalamusun altında sarkan küçük yapı hipofiz bezidir.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'sap'],
        renk: 'bolge',
        saydam: ['bolge:serebrum'],
        gizle: ['bolge:sinir', ...DERIN_SEREBRUM],
        bakis: 'egik',
        etiketler: [
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'hipotalamus', metin: 'Hipotalamus' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Adlar nereden geliyor? Sinir borusu ve kesecikler',
      md: `Embriyoda sinir sistemi önce düz bir tabaka olarak başlar: **sinir plağı**. Plağın ortası çöker (**sinir oluğu**), kenarları (sinir katlantıları) birbirine yaklaşıp birleşir ve içi boş bir boru oluşur: **sinir borusu** (OpenStax 13.1). Boru önce ortasından kapanır; kapanma bir fermuar gibi yukarı ve aşağı ilerler (NINDS, 2026). Ön açıklık (**rostral nöropor**) yaklaşık 25. günde, arka açıklık (**kaudal nöropor**) yaklaşık 27. günde kapanır (Saker ve ark., 2016; Ravi ve ark., 2021). Ön uçta önce üç, sonra beş kesecik belirir; borunun boşluğu da karıncıklara dönüşür (OpenStax 13.1):

| Birinci kesecik | İkinci kesecik | Yetişkindeki karşılığı | Boşluğu |
| --- | --- | --- | --- |
| Ön beyin (prosensefalon) | Telensefalon | Büyük beyin | Yan karıncıklar |
| | Diensefalon | Talamus, hipotalamus; göz kadehi ve retina | Üçüncü karıncık |
| Orta beyin (mezensefalon) | Mezensefalon | Orta beyin | Beyin su yolu (akuadukt) |
| Arka beyin (rombensefalon) | Metensefalon | Pons ve beyincik | Dördüncü karıncık |
| | Miyelensefalon | Omurilik soğanı | Dördüncü karıncık |
| Borunun arka bölümü | | Omurilik | Merkezî kanal |

Gelişen beyin üç yerden bükülür: ön beyin ile beyin sapı arasında **sefalik**, omurilik soğanı ile omuriliğin birleştiği yerde **servikal** ve arka beyinde **pontin** büküm; pontin büküm dördüncü karıncığa biçimini verir (AlRayahi ve ark., 2026). Orta beyin, pons ve omurilik soğanına birlikte **beyin sapı** denir; beyincik metensefalondan gelse de beyin sapına sayılmaz.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Beş kesecik modelde',
      aciklama:
        'Sağ yarımküre kaldırıldı; her yapı geldiği keseciğin renginde: mavi telensefalon (büyük beyin ve yan karıncık), turkuaz diensefalon (talamus, hipotalamus ve üçüncü karıncık), mor mezensefalon (orta beyin ve beyin su yolu), sarı metensefalon (pons, beyincik ve dördüncü karıncık), pembe miyelensefalon (omurilik soğanı).',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap', 'karincik'],
        renk: 'bolge',
        gizle: ['bolge:sinir', 'hipofiz'],
        yarim: 'sol',
        bakis: 'ic-sol',
        boya: [
          { secici: ['bolge:serebrum', 'yan-karincik', 'karinciklar-arasi-delik'], renk: TELENSEFALON },
          { secici: ['bolge:diensefalon', 'ucuncu-karincik'], renk: DIENSEFALON },
          { secici: ['orta-beyin', 'serebral-pedinkul', 'ust-tepecik', 'alt-tepecik', 'beyin-su-yolu'], renk: MEZENSEFALON },
          { secici: ['pons', 'beyincik', 'dorduncu-karincik'], renk: METENSEFALON },
          { secici: ['omurilik-sogani'], renk: MIYELENSEFALON },
        ],
        etiketler: [
          { yapi: 'singulat-girus-sol', metin: 'Telensefalon' },
          { yapi: 'talamus-sol', metin: 'Diensefalon' },
          { yapi: 'orta-beyin', metin: 'Mezensefalon' },
          { yapi: 'beyincik', metin: 'Metensefalon' },
          { yapi: 'omurilik-sogani', metin: 'Miyelensefalon' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Alar plak ve bazal plak: duyu arkada, hareket önde',
      md: `Gelişen sinir borusunun yan duvarı ince bir oluk, **sulkus limitans**, ile ikiye ayrılır. Sırt taraftaki **alar plak** duyu bilgisini alacak nöronları, karın taraftaki **bazal plak** hareket nöronlarını yapar (OpenStax 13.2; Diek ve ark., 2022). Omurilikte arka boynuzun duyu, ön boynuzun hareket işi yapması bu düzenin yetişkindeki karşılığıdır.

Beyin sapında da aynı düzen sürer ama yanlara açılmış biçimde: hareket çekirdekleri daha içte ve karına yakın (ventromedial), duyu çekirdekleri daha dışta ve sırta yakın (dorsolateral) durur. Örneğin gelişim sırasında vagusun iç organlara giden hareket çekirdeği daha içte ve önde, iç organ duyusunu alan soliter çekirdek daha dışta ve arkada yer alır (Emmi ve ark., 2021). Kafa siniri çekirdeklerinin yerini ezberlemek yerine bu kuralla akıl yürütmek, beyin sapı derslerinde çok işe yarar.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Sinir kabartısı (nöral krest): göçebe hücreler',
      md: 'Sinir borusu kapanırken kenarlarından ayrılan hücreler bedenin her yanına göç eder: **sinir kabartısı** (nöral krest). Bunlardan arka kök gangliyonlarının duyu nöronları, sempatik gangliyonlar, böbrek üstü bezinin kromafin hücreleri, derideki pigment hücreleri (melanositler) ve bağırsağın sinir ağı (enterik sinir sistemi) gelişir (Simões-Costa ve Bronner, 2013). Çevresel sinirlerin miyelinini yapan **Schwann hücreleri** ile yüz ve kafatasının kıkırdak ve kemiklerinin bir bölümü de sinir kabartısından gelir (Mehrotra ve ark., 2020). Yani çevresel sinir sisteminin büyük bölümü, merkezî sinir sistemiyle aynı başlangıçtan doğar.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sinir borusu kapanmazsa',
      md: `Borunun ön ucu kapanmazsa **anensefali** gelişir: beynin ve kafatasının büyük bölümü oluşmaz. Yaklaşık 1000 gebelikte 1 görülür; bebeklerin hemen hepsi doğumdan önce ya da doğumdan sonraki birkaç saat ya da gün içinde ölür (MedlinePlus Genetics, 2019). Borunun arka bölümü kapanmazsa **spina bifida** gelişir; en ağır biçimi olan miyelomeningosel dünyada yaklaşık 1000 doğumda 1 görülür (Copp ve ark., 2015).

Gebelikten önce ve gebeliğin başında **folik asit** almak bu kusurları belirgin biçimde azaltır. NINDS, gebelikten önce ve gebelik boyunca günde 400 mikrogram folik asit içeren bir vitamin önerir (NINDS, 2026). Daha önce sinir borusu kusuru olan bir gebelik geçirmiş 1817 kadınla yapılan MRC çalışmasında folik asidin koruyucu etkisi %72 bulundu (MRC Vitamin Study Research Group, 1991).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla beyin',
      ogeler: [
        { deger: '≈1,4', birim: 'kg', aciklama: 'Yetişkin bir beynin yaklaşık ağırlığı (üç libre kadar).' },
        {
          deger: '86',
          birim: 'milyar',
          aciklama: 'Yetişkin bir erkek beynindeki ortalama nöron sayısı. Nöron olmayan hücreler de (glia ve diğerleri) yaklaşık bu kadardır: 85 milyar.',
        },
        { deger: '%2 → %20', aciklama: 'Beyin vücut kütlesinin yalnızca %2’si kadardır ama vücudun enerjisinin yaklaşık %20’sini kullanır.' },
        { deger: '%15–20', aciklama: 'Kalbin her dakika pompaladığı kanın beyne giden yaklaşık payı.' },
        {
          deger: '%10 → %80',
          aciklama: 'Beyincik beyin kütlesinin yaklaşık %10’udur ama 86 milyar nöronun yaklaşık 69 milyarını, yani beşte dördünü taşır.',
        },
        { deger: '2,5', birim: 'mm', aciklama: 'Beyin kabuğunun ortalama kalınlığı (yaklaşık 2,55 mm). Bu ince tabaka çok kıvrımlıdır; böylece kafatasının sınırlı alanına sığar.' },
      ],
      not: 'Sayılar ortalamadır ve kişiden kişiye değişir. Kaynaklar dersin sonundadır.',
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Sayılarla beyin: ayrıntı',
      ogeler: [
        {
          deger: '16',
          birim: 'milyar',
          aciklama: 'Büyük beyin kabuğundaki nöron sayısı: bütün nöronların yalnızca %19’u. Oysa büyük beyin kabuğu, altındaki beyaz cevherle birlikte, beyin kütlesinin %82’sini oluşturur (Azevedo ve ark., 2009; Herculano-Houzel, 2009).',
        },
        {
          deger: '1640',
          birim: 'cm²',
          aciklama: 'Erkek beyninde iki yarımkürenin kabuk yüzeyi; bunun üçte ikisi oluklarda ve insulada gizlidir (Henery ve Mayhew, 1989).',
        },
        { deger: '180', aciklama: 'Çok kipli MR ile her yarımkürede ayırt edilen kabuk alanı sayısı; 97’si ilk kez tanımlandı (Glasser ve ark., 2016).' },
        { deger: '≈200', birim: 'milyon', aciklama: 'Korpus kallozumdaki akson sayısı (Goldstein ve ark., 2023; Paul ve ark., 2014).' },
        { deger: '500', birim: 'mL/gün', aciklama: 'Günde yapılan beyin-omurilik sıvısı; herhangi bir anda bulunan toplam miktar 125–150 mL’dir (OpenStax 13.3; Margetis ve ark., 2025).' },
        { deger: '50', birim: 'mL/100 g/dk', aciklama: 'Ortalama beyin kan akımı: toplamda dakikada yaklaşık 750 mL (Khartabil ve ark., 2026).' },
      ],
      not: 'Kabuk kalınlığı ölçüm yöntemine göre değişir: Henery ve Mayhew 2,2 mm, OpenStax 2,55 mm verir.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Uzun yıllar "beyinde 100 milyar nöron ve bunun on katı glia hücresi var" diye anlatıldı. Hücreleri tek tek sayan yeni bir yöntem gerçek sayıları ölçtü: yaklaşık **86 milyar nöron** ve onlarla aşağı yukarı aynı sayıda nöron olmayan hücre. Yani glia hücreleri nöronlardan on kat fazla değildir.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Nöronları saymak ve enerji bütçesi',
      md: `Azevedo ve arkadaşları (2009), **izotropik ayırıcı** (isotropic fractionator) yöntemiyle yetişkin erkek beyninde ortalama 86,1 ± 8,1 milyar nöron ve 84,6 ± 9,8 milyar nöron olmayan hücre saydı. Büyük beyin kabuğu, altındaki beyaz cevherle birlikte beyin kütlesinin %82’sini oluşturduğu hâlde nöronların yalnızca %19’unu taşır. Sonuç, insan beyninin hücre bileşimi bakımından kendi büyüklüğünde bir primat beyninden beklenen şey olduğunu gösterdi: "orantılı olarak büyütülmüş bir primat beyni" (Azevedo ve ark., 2009; Herculano-Houzel, 2009). 150 yıllık hücre sayımlarını gözden geçiren bir derlemeye göre izotropik ayırıcı glia–nöron oranını 1:1’in altında buldu; doku kesitlerine dayanan eski sayımlar da aslında hep yaklaşık 1:1 oranını destekliyordu. “Bir trilyon glia, oran 10:1” bilgisi yarım yüzyıl boyunca süren yanlış bir uzlaşıydı (von Bartheld ve ark., 2016).

Enerji tarafında da benzer bir sadelik bulundu: insan dahil altı kemirgen ve primat türünde nöron başına tahmini glikoz kullanımı yalnızca %40 kadar değişir; ortalama bir nöron dakikada yaklaşık 5,79 × 10⁻⁹ µmol glikoz harcar. Kütlenin %2’siyle enerjinin %20’sini kullanmak, sıra dışı bir metabolizmadan değil, nöron sayısının çokluğundan gelir. Yine de kabuk nöronları beyincik nöronlarından ortalama en az 10 kat fazla glikoz kullanır. Sinaptik etkinlik metabolik maliyetin başlıca belirleyicisi sayıldığından, nöron başına sabit bir enerji bütçesinin ateşleme hızlarının düzenlenmesi, sinaptik plastisite ve beyin görüntüleme için önemli sonuçları vardır (Herculano-Houzel, 2011).`,
    },
  ],
};
