/**
 * Beyin Akademisi: üç boyutlu modeldeki yapıların kataloğu.
 *
 * Model, BodyParts3D 4.0'dır (Japonya Yaşam Bilimleri Veri Merkezi; CC BY 4.0; yetişkin bir erkeğin üç boyutlu
 * bütün vücut modeli). Her yapı modeldeki bir ya da birkaç parçadan (FJ… dosya kimlikleri) oluşur.
 * `araclar/beyin-modeli.mjs` bu dosyadaki FJ kimliklerini okuyup yalnızca bu parçaları paketler; yeni yapı
 * eklenince betik yeniden çalıştırılır (bkz. CLAUDE.md, "Beyin Akademisi").
 *
 * Görev cümleleri bilgilendirme amaçlıdır ve dersin kaynaklarına dayanır (OpenStax Anatomy and Physiology 2e,
 * NINDS Brain Basics ve ders sonlarında listelenen makaleler). Kesin olmayan yerlerde temkinli dil kullanılır.
 */

/** Modelin paket dosyaları: bir ders yalnızca gerektirdiği paketleri indirir. */
export type Katman = 'kabuk' | 'beyaz' | 'derin' | 'sap' | 'karincik' | 'damar' | 'kemik';

/** Gelişimsel ve anatomik bölge (Ders 1'deki dört ana bölüm ve ek gruplar). */
export type Bolge = 'serebrum' | 'diensefalon' | 'beyin-sapi' | 'beyincik' | 'karincik' | 'damar' | 'kemik' | 'sinir';

export type Lob = 'frontal' | 'parietal' | 'temporal' | 'oksipital' | 'insula' | 'limbik';

export type Taraf = 'sol' | 'sag';

export interface Yapi {
  /** Adres ve sahne tanımlarında kullanılan kısa ad, ör. `presantral-girus-sol`. */
  id: string;
  /** Türkçe adı (tıpta yaygın biçimi). */
  ad: string;
  /** Varsa sade Türkçe karşılığı. */
  sade?: string;
  /** Latince resmî adı (Terminologia Anatomica). */
  latince: string;
  taraf?: Taraf;
  bolge: Bolge;
  lob?: Lob;
  katman: Katman;
  /** BodyParts3D 4.0 (IS-A ağacı) parça dosyaları. */
  parcalar: string[];
  /** Bir iki cümlelik açıklama: nerede durur, ne işe yarar. */
  gorev: string;
}

type Ortak = Omit<Yapi, 'id' | 'taraf' | 'parcalar'> & { id: string };

/** Sol ve sağ yarımkürede ayrı parçası olan yapılar. */
function cift(o: Ortak, sol: string[], sag: string[]): Yapi[] {
  return [
    { ...o, id: `${o.id}-sol`, taraf: 'sol', parcalar: sol },
    { ...o, id: `${o.id}-sag`, taraf: 'sag', parcalar: sag },
  ];
}

function tek(o: Ortak, parcalar: string[]): Yapi {
  return { ...o, parcalar };
}

export const YAPILAR: Yapi[] = [
  // ——— Beyin kabuğu: kıvrımlar ve loblar ———
  ...cift(
    {
      id: 'ust-frontal-girus',
      ad: 'Üst frontal girus',
      sade: 'üst alın kıvrımı',
      latince: 'Gyrus frontalis superior',
      bolge: 'serebrum',
      lob: 'frontal',
      katman: 'kabuk',
      gorev:
        'Frontal (alın) lobun en üstteki kıvrımı. Frontal lobun ön bölümü olan prefrontal kabuk; planlama, geleceği düşünme, akıl yürütme ve kısa süreli bellekle ilişkilidir.',
    },
    ['FJ1833'],
    ['FJ1834'],
  ),
  ...cift(
    {
      id: 'orta-frontal-girus',
      ad: 'Orta frontal girus',
      sade: 'orta alın kıvrımı',
      latince: 'Gyrus frontalis medius',
      bolge: 'serebrum',
      lob: 'frontal',
      katman: 'kabuk',
      gorev: 'Frontal lobun ortadaki kıvrımı; prefrontal kabuğun bir parçasıdır.',
    },
    ['FJ1787'],
    ['FJ1788'],
  ),
  ...cift(
    {
      id: 'alt-frontal-girus',
      ad: 'Alt frontal girus',
      sade: 'alt alın kıvrımı',
      latince: 'Gyrus frontalis inferior',
      bolge: 'serebrum',
      lob: 'frontal',
      katman: 'kabuk',
      gorev:
        'Frontal lobun alt kıvrımı. İnsanların büyük çoğunluğunda sol yarımküredeki bu kıvrım, konuşmayı üretmeye yardım eden Broca alanını taşır.',
    },
    ['FJ1744'],
    ['FJ1745'],
  ),
  ...cift(
    {
      id: 'presantral-girus',
      ad: 'Presantral girus',
      sade: 'ön merkez kıvrımı',
      latince: 'Gyrus precentralis',
      bolge: 'serebrum',
      lob: 'frontal',
      katman: 'kabuk',
      gorev:
        'Birincil motor kabuk bu kıvrımdadır: istemli hareket komutları buradan çıkar. Sağ yarımküredeki kıvrım ağırlıklı olarak vücudun sol yarısını, soldaki sağ yarısını yönetir.',
    },
    ['FJ1800'],
    ['FJ1801'],
  ),
  ...cift(
    {
      id: 'postsentral-girus',
      ad: 'Postsentral girus',
      sade: 'arka merkez kıvrımı',
      latince: 'Gyrus postcentralis',
      bolge: 'serebrum',
      lob: 'parietal',
      katman: 'kabuk',
      gorev:
        'Birincil bedensel duyu (somatosensoriyel) kabuğu bu kıvrımdadır: dokunma, sıcaklık ve vücudun hareketiyle ilgili bilgiler buraya ulaşır. Merkezî oluk onu presantral girustan ayırır.',
    },
    ['FJ1797'],
    ['FJ1798'],
  ),
  ...cift(
    {
      id: 'ust-parietal-lobul',
      ad: 'Üst parietal lobül',
      sade: 'üst yan kafa lobcuğu',
      latince: 'Lobulus parietalis superior',
      bolge: 'serebrum',
      lob: 'parietal',
      katman: 'kabuk',
      gorev:
        'Parietal (yan kafa) lobun üst bölümü. Parietal lob bedenden gelen duyuları birleştirir; okuma ve aritmetik gibi işlere de katkı verir.',
    },
    ['FJ1835'],
    ['FJ1836'],
  ),
  ...cift(
    {
      id: 'supramarjinal-girus',
      ad: 'Supramarjinal girus',
      sade: 'kenar üstü kıvrımı',
      latince: 'Gyrus supramarginalis',
      bolge: 'serebrum',
      lob: 'parietal',
      katman: 'kabuk',
      gorev: 'Parietal lobun alt bölümünde, yan yarığın arka ucunu kemer gibi saran kıvrım.',
    },
    ['FJ1841'],
    ['FJ1842'],
  ),
  ...cift(
    {
      id: 'angular-girus',
      ad: 'Angular girus',
      sade: 'köşe kıvrımı',
      latince: 'Gyrus angularis',
      bolge: 'serebrum',
      lob: 'parietal',
      katman: 'kabuk',
      gorev: 'Parietal lobun alt bölümünde, supramarjinal girusun arkasındaki kıvrım.',
    },
    ['FJ1732'],
    ['FJ1733'],
  ),
  ...cift(
    {
      id: 'ust-temporal-girus',
      ad: 'Üst temporal girus',
      sade: 'üst şakak kıvrımı',
      latince: 'Gyrus temporalis superior',
      bolge: 'serebrum',
      lob: 'temporal',
      katman: 'kabuk',
      gorev:
        'Temporal (şakak) lobun en üst kıvrımı. Kulaktan gelen bilgiyi alan birincil işitme kabuğu bu kıvrımın üst yüzündedir. Çoğu insanda sol yarımküredeki arka bölümü, dili anlamayla ilişkili Wernicke alanını içerir.',
    },
    ['FJ1837', 'FJ1839'],
    ['FJ1838', 'FJ1840'],
  ),
  ...cift(
    {
      id: 'orta-temporal-girus',
      ad: 'Orta temporal girus',
      sade: 'orta şakak kıvrımı',
      latince: 'Gyrus temporalis medius',
      bolge: 'serebrum',
      lob: 'temporal',
      katman: 'kabuk',
      gorev: 'Temporal lobun ortadaki kıvrımı; lobun yan yüzünün büyük bölümünü oluşturur.',
    },
    ['FJ1789'],
    ['FJ1790'],
  ),
  ...cift(
    {
      id: 'alt-temporal-girus',
      ad: 'Alt temporal girus',
      sade: 'alt şakak kıvrımı',
      latince: 'Gyrus temporalis inferior',
      bolge: 'serebrum',
      lob: 'temporal',
      katman: 'kabuk',
      gorev: 'Temporal lobun alt kenarındaki kıvrım; beynin alt yüzüne doğru kıvrılır.',
    },
    ['FJ1746'],
    ['FJ1747'],
  ),
  ...cift(
    {
      id: 'fusiform-girus',
      ad: 'Fusiform girus',
      sade: 'iğ biçimli kıvrım',
      latince: 'Gyrus occipitotemporalis lateralis (gyrus fusiformis)',
      bolge: 'serebrum',
      lob: 'temporal',
      katman: 'kabuk',
      gorev:
        'Temporal ve oksipital lobların alt yüzünde uzanan kıvrım. Yüzlere bakarken belirgin biçimde çalışan bir bölge bu kıvrımdadır.',
    },
    ['FJ1783'],
    ['FJ1784'],
  ),
  ...cift(
    {
      id: 'oksipital-lob',
      ad: 'Oksipital lob',
      sade: 'art kafa lobu',
      latince: 'Lobus occipitalis',
      bolge: 'serebrum',
      lob: 'oksipital',
      katman: 'kabuk',
      gorev: 'Beynin en arkasındaki lob. Gözden gelen görüntüler burada, birincil görme kabuğunda işlenir.',
    },
    ['FJ1791'],
    ['FJ1792'],
  ),
  ...cift(
    {
      id: 'insula',
      ad: 'İnsula',
      sade: 'ada',
      latince: 'Insula (lobus insularis)',
      bolge: 'serebrum',
      lob: 'insula',
      katman: 'kabuk',
      gorev:
        'Yan yarığın derinliğinde, frontal, parietal ve temporal lobların kapakçıkları altında gizlenen kabuk bölgesi. Vücudun iç durumunu algılamada (iç algı) rol alır.',
    },
    ['FJ1748'],
    ['FJ1749'],
  ),
  ...cift(
    {
      id: 'singulat-girus',
      ad: 'Singulat girus',
      sade: 'kuşak kıvrımı',
      latince: 'Gyrus cinguli',
      bolge: 'serebrum',
      lob: 'limbik',
      katman: 'kabuk',
      gorev: 'Korpus kallozumun üstünde bir kuşak gibi uzanan kıvrım; limbik lobun bir parçasıdır.',
    },
    ['FJ1739'],
    ['FJ1740'],
  ),
  ...cift(
    {
      id: 'parahipokampal-girus',
      ad: 'Parahipokampal girus',
      sade: 'hipokampus yanı kıvrımı',
      latince: 'Gyrus parahippocampalis',
      bolge: 'serebrum',
      lob: 'limbik',
      katman: 'kabuk',
      gorev: 'Temporal lobun iç-alt yüzünde, hipokampusun hemen yanında uzanan kıvrım; limbik lobun bir parçasıdır.',
    },
    ['FJ1785'],
    ['FJ1786'],
  ),

  // ——— Beyaz cevher ———
  ...cift(
    {
      id: 'beyaz-cevher',
      ad: 'Yarımkürenin beyaz cevheri',
      latince: 'Substantia alba hemispherii cerebri',
      bolge: 'serebrum',
      katman: 'beyaz',
      gorev:
        'Kabuğun altında kalan, miyelinle kaplı aksonlardan oluşan beyaz bölge. Beynin bölgelerini birbirine bağlayan yolları taşır.',
    },
    ['FJ1758'],
    ['FJ1806'],
  ),

  // ——— Derin yapılar: bazal çekirdekler, limbik yapılar, lif demetleri ———
  ...cift(
    {
      id: 'kaudat-cekirdek',
      ad: 'Kaudat çekirdek',
      sade: 'kuyruklu çekirdek',
      latince: 'Nucleus caudatus',
      bolge: 'serebrum',
      katman: 'derin',
      gorev:
        'Yan karıncığın duvarında C harfi gibi kıvrılan çekirdek. Putamenle birlikte striatumu oluşturur; bazal çekirdeklerin bir parçası olarak hareketin başlatılmasını düzenler.',
    },
    ['FJ1754'],
    ['FJ1802'],
  ),
  ...cift(
    {
      id: 'putamen',
      ad: 'Putamen',
      latince: 'Putamen',
      bolge: 'serebrum',
      katman: 'derin',
      gorev: 'Bazal çekirdeklerin en dıştakisi. Kaudat çekirdekle birlikte striatumu oluşturur ve hareketin düzenlenmesinde rol alır.',
    },
    ['FJ1776'],
    ['FJ1823'],
  ),
  ...cift(
    {
      id: 'globus-pallidus',
      ad: 'Globus pallidus',
      sade: 'soluk küre',
      latince: 'Globus pallidus',
      bolge: 'serebrum',
      katman: 'derin',
      gorev: 'Putamenin iç yanında duran bazal çekirdek; hareketin düzenlenmesinde rol alır.',
    },
    ['FJ1757'],
    ['FJ1805'],
  ),
  ...cift(
    {
      id: 'hipokampus',
      ad: 'Hipokampus',
      sade: 'deniz atı',
      latince: 'Hippocampus',
      bolge: 'serebrum',
      lob: 'limbik',
      katman: 'derin',
      gorev:
        'Temporal lobun derininde, yan karıncığın alt boynuzunun tabanında uzanan yapı. Yeni bilgilerin uzun süreli belleğe kaydedilmesi için gereklidir.',
    },
    ['FJ1759'],
    ['FJ1807'],
  ),
  ...cift(
    {
      id: 'amigdala',
      ad: 'Amigdala',
      sade: 'badem çekirdek',
      latince: 'Corpus amygdaloideum',
      bolge: 'serebrum',
      lob: 'limbik',
      katman: 'derin',
      gorev:
        'Hipokampusun önünde, temporal lobun derinindeki badem biçimli çekirdek kümesi. Duygusal tepkilerde, korkunun öğrenilmesinde ve duygusal anılarda rol alır.',
    },
    ['FJ1753'],
    ['FJ1829'],
  ),
  ...cift(
    {
      id: 'forniks',
      ad: 'Forniks',
      sade: 'kemer',
      latince: 'Fornix',
      bolge: 'serebrum',
      katman: 'derin',
      gorev:
        'Hipokampustan çıkıp kemer gibi kıvrılarak talamusa ve mamiller cisimlere uzanan beyaz cevher demeti; anıları hatırlamada rol alan bir devrenin parçasıdır.',
    },
    ['FJ1756'],
    ['FJ1804'],
  ),
  tek(
    {
      id: 'forniks-komissuru',
      ad: 'Forniks komissürü',
      latince: 'Commissura fornicis',
      bolge: 'serebrum',
      katman: 'derin',
      gorev: 'İki yandaki forniks arasında karşıya geçen lifler.',
    },
    ['FJ1741'],
  ),
  tek(
    {
      id: 'korpus-kallozum',
      ad: 'Korpus kallozum',
      sade: 'nasırlı cisim',
      latince: 'Corpus callosum',
      bolge: 'serebrum',
      katman: 'derin',
      gorev:
        'İki yarımküreyi birbirine bağlayan en büyük lif köprüsü; yaklaşık 200 milyon sinir lifi içerir ve yarımküreler arasındaki ana iletişim yoludur.',
    },
    ['FJ1742'],
  ),
  tek(
    {
      id: 'on-komissur',
      ad: 'Ön komissür',
      latince: 'Commissura anterior',
      bolge: 'serebrum',
      katman: 'derin',
      gorev: 'İki yarımküreyi, özellikle temporal lobları ve koku bölgelerini birbirine bağlayan küçük lif demeti.',
    },
    ['FJ1734'],
  ),
  ...cift(
    {
      id: 'ic-kapsul',
      ad: 'İç kapsül',
      latince: 'Capsula interna',
      bolge: 'serebrum',
      katman: 'derin',
      gorev:
        'Kaudat çekirdek ile putamen arasından geçen kalın beyaz cevher bandı. Kabuktan beyin sapına ve omuriliğe inen ana hareket yolu buradan geçer.',
    },
    ['FJ1750'],
    ['FJ1751'],
  ),

  // ——— Ara beyin (diensefalon) ———
  ...cift(
    {
      id: 'talamus',
      ad: 'Talamus',
      latince: 'Thalamus',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev:
        'Ara beynin büyük bölümünü oluşturan çekirdek kümesi. Koku dışındaki bütün duyusal bilgiler, kabuğa ulaşmadan önce talamustan geçer.',
    },
    ['FJ1782'],
    ['FJ1827'],
  ),
  tek(
    {
      id: 'hipotalamus',
      ad: 'Hipotalamus',
      latince: 'Hypothalamus',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev:
        'Talamusun altındaki küçük bölge. Vücudun iç dengesini (homeostaz) korur; otonom sinir sistemini ve hipofiz bezi aracılığıyla hormon sistemini yönetir.',
    },
    ['FJ1760', 'FJ1808'],
  ),
  tek(
    {
      id: 'mamiller-cisimler',
      ad: 'Mamiller cisimler',
      latince: 'Corpora mammillaria',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev: 'Hipotalamusun arka-alt yüzündeki iki küçük yuvarlak çıkıntı; forniks yoluyla hipokampustan bilgi alan bellek devresinin bir durağıdır.',
    },
    ['FJ1768', 'FJ1815'],
  ),
  tek(
    {
      id: 'hipofiz',
      ad: 'Hipofiz bezi',
      latince: 'Hypophysis (glandula pituitaria)',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev:
        'Hipotalamusa ince bir sapla bağlı küçük bez. Hipotalamusun gönderdiği uyarıcı ve baskılayıcı hormonlara göre birçok hormon salgılar.',
    },
    ['FJ1796'],
  ),
  tek(
    {
      id: 'epifiz',
      ad: 'Epifiz bezi',
      sade: 'kozalak bezi',
      latince: 'Glandula pinealis',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev:
        'Ara beynin arka-üst yüzündeki küçük bez. Akşam ışık azalınca daha çok melatonin hormonu salgılar; bu da uyku hâlini getirir.',
    },
    ['FJ1795'],
  ),
  tek(
    {
      id: 'habenula',
      ad: 'Habenula',
      latince: 'Habenula',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev: 'Epifiz bezinin hemen önünde duran, epitalamusa ait küçük yapı.',
    },
    ['FJ1743'],
  ),
  tek(
    {
      id: 'arka-komissur',
      ad: 'Arka komissür',
      latince: 'Commissura posterior',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev:
        'Ara beyin ile orta beynin birleştiği yerde iki yanı birbirine bağlayan küçük lif demeti; göz bebeğinin ışık refleksi ve yukarı-aşağı bakış yollarıyla ilişkilidir.',
    },
    ['FJ1799'],
  ),
  ...cift(
    {
      id: 'lateral-genikulat-cisim',
      ad: 'Lateral genikulat cisim',
      latince: 'Corpus geniculatum laterale',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev: 'Talamusun görme istasyonu: görme yolundan gelen bilgiyi alır ve oksipital lobdaki görme kabuğuna iletir.',
    },
    ['FJ1766'],
    ['FJ1813'],
  ),
  ...cift(
    {
      id: 'medial-genikulat-cisim',
      ad: 'Medial genikulat cisim',
      latince: 'Corpus geniculatum mediale',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev: 'Talamusun işitme istasyonu: işitme bilgisini alır ve temporal lobdaki işitme kabuğuna iletir.',
    },
    ['FJ1816M'],
    ['FJ1816'],
  ),
  tek(
    {
      id: 'optik-kiazma',
      ad: 'Optik kiazma',
      sade: 'görme çaprazı',
      latince: 'Chiasma opticum',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev:
        'İki görme sinirinin buluştuğu yer. Her gözde retinanın iç (burun tarafı) yarısından gelen lifler burada karşı tarafa geçer.',
    },
    ['FJ1771', 'FJ1818'],
  ),
  ...cift(
    {
      id: 'optik-traktus',
      ad: 'Optik traktus',
      sade: 'görme yolu',
      latince: 'Tractus opticus',
      bolge: 'diensefalon',
      katman: 'derin',
      gorev: 'Optik kiazmadan sonra görme liflerinin aldığı ad; talamustaki lateral genikulat cisme uzanır.',
    },
    ['FJ1773'],
    ['FJ1820'],
  ),
  ...cift(
    {
      id: 'optik-sinir',
      ad: 'Optik sinir',
      sade: 'görme siniri',
      latince: 'Nervus opticus (II)',
      bolge: 'sinir',
      katman: 'derin',
      gorev: 'İkinci kafa siniri: gözün retinasından çıkan liflerden oluşur ve görme bilgisini beyne taşır.',
    },
    ['FJ1772'],
    ['FJ1819'],
  ),

  // ——— Beyin sapı ve beyincik ———
  tek(
    {
      id: 'orta-beyin',
      ad: 'Orta beyin',
      latince: 'Mesencephalon',
      bolge: 'beyin-sapi',
      katman: 'sap',
      gorev:
        'Beyin sapının en üst bölümü. Arka yüzünde görme, işitme ve dokunma bilgisini birleştiren tepecikler bulunur; içinden beyin su yolu geçer.',
    },
    ['FJ1770', 'FJ1817'],
  ),
  ...cift(
    {
      id: 'serebral-pedinkul',
      ad: 'Serebral pedinkül',
      sade: 'beyin sapçığı',
      latince: 'Pedunculus cerebri',
      bolge: 'beyin-sapi',
      katman: 'sap',
      gorev: 'Orta beynin ön yüzündeki iki kalın sütun; kabuktan omuriliğe inen ana hareket yolu bunların içinden geçer.',
    },
    ['FJ1774'],
    ['FJ1821'],
  ),
  ...cift(
    {
      id: 'ust-tepecik',
      ad: 'Üst tepecik',
      latince: 'Colliculus superior',
      bolge: 'beyin-sapi',
      katman: 'sap',
      gorev:
        'Orta beynin arka yüzündeki üst tümsek. Görme, işitme ve dokunma uzayını birleştirir; gözleri bir sese ya da dokunuşa çevirmede rol alır.',
    },
    ['FJ1779'],
    ['FJ1826'],
  ),
  ...cift(
    {
      id: 'alt-tepecik',
      ad: 'Alt tepecik',
      latince: 'Colliculus inferior',
      bolge: 'beyin-sapi',
      katman: 'sap',
      gorev: 'Orta beynin arka yüzündeki alt tümsek; beyin sapındaki işitme yolunun bir durağıdır.',
    },
    ['FJ1762'],
    ['FJ1810'],
  ),
  tek(
    {
      id: 'pons',
      ad: 'Pons',
      sade: 'köprü',
      latince: 'Pons',
      bolge: 'beyin-sapi',
      katman: 'sap',
      gorev:
        'Beyin sapının ortadaki kabarık bölümü; beyinciği beyin sapına bağlayan ana bağlantıdır. Omurilik soğanıyla birlikte solunumun ve dolaşımın düzenlenmesine katkı verir.',
    },
    ['FJ1775', 'FJ1822'],
  ),
  tek(
    {
      id: 'omurilik-sogani',
      ad: 'Omurilik soğanı',
      sade: 'medulla',
      latince: 'Medulla oblongata',
      bolge: 'beyin-sapi',
      katman: 'sap',
      gorev: 'Beyin sapının omuriliğe bağlanan en alt bölümü. Kalp atışını, kan basıncını ve solunumu düzenleyen merkezler buradadır.',
    },
    ['FJ1769', 'FJ1831'],
  ),
  tek(
    {
      id: 'beyincik',
      ad: 'Beyincik',
      sade: 'serebellum',
      latince: 'Cerebellum',
      bolge: 'beyincik',
      katman: 'sap',
      gorev:
        'Büyük beynin arkasında ve altında duran "küçük beyin". Beyin kütlesinin yaklaşık %10\'u kadardır ama nöronlarının çoğunu taşır; hareketleri düzenler ve öğrenilmiş hareketlerde rol alır.',
    },
    ['FJ1781', 'FJ1830'],
  ),

  // ——— Karıncıklar (ventrikül sistemi) ———
  ...cift(
    {
      id: 'yan-karincik',
      ad: 'Yan karıncık',
      sade: 'lateral ventrikül',
      latince: 'Ventriculus lateralis',
      bolge: 'karincik',
      katman: 'karincik',
      gorev: 'Her yarımkürenin içinde C harfi gibi kıvrılan, beyin-omurilik sıvısıyla dolu boşluk.',
    },
    ['FJ1767'],
    ['FJ1814'],
  ),
  tek(
    {
      id: 'karinciklar-arasi-delik',
      ad: 'Karıncıklar arası delik',
      sade: 'Monro deliği',
      latince: 'Foramen interventriculare',
      bolge: 'karincik',
      katman: 'karincik',
      gorev: 'Yan karıncıkları üçüncü karıncığa bağlayan açıklık.',
    },
    ['FJ1752'],
  ),
  tek(
    {
      id: 'ucuncu-karincik',
      ad: 'Üçüncü karıncık',
      latince: 'Ventriculus tertius',
      bolge: 'karincik',
      katman: 'karincik',
      gorev: 'İki talamusun arasında, orta hatta duran dar boşluk.',
    },
    ['FJ1730'],
  ),
  tek(
    {
      id: 'beyin-su-yolu',
      ad: 'Beyin su yolu',
      sade: 'Sylvius kanalı',
      latince: 'Aqueductus mesencephali',
      bolge: 'karincik',
      katman: 'karincik',
      gorev: 'Orta beynin içinden geçen ince kanal; üçüncü karıncığı dördüncü karıncığa bağlar.',
    },
    ['FJ1738'],
  ),
  tek(
    {
      id: 'dorduncu-karincik',
      ad: 'Dördüncü karıncık',
      latince: 'Ventriculus quartus',
      bolge: 'karincik',
      katman: 'karincik',
      gorev: 'Beyincik ile pons ve omurilik soğanının üst bölümü arasındaki boşluk.',
    },
    ['FJ1731'],
  ),

  // ——— Atardamarlar ———
  ...cift(
    {
      id: 'ic-karotis-arter',
      ad: 'İç karotis arter',
      latince: 'Arteria carotis interna',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'Boynun iki yanından kafatasına giren ve beyni besleyen iki ana atardamar çiftinden biri; dalları Willis halkasına katılır.',
    },
    ['FJ1682M'],
    ['FJ1682'],
  ),
  ...cift(
    {
      id: 'vertebral-arter',
      ad: 'Vertebral arter',
      latince: 'Arteria vertebralis',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'Boyun omurlarının içinden yükselen atardamar. İki vertebral arter birleşerek baziler arteri oluşturur.',
    },
    ['FJ1725M'],
    ['FJ1725'],
  ),
  tek(
    {
      id: 'baziler-arter',
      ad: 'Baziler arter',
      latince: 'Arteria basilaris',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'İki vertebral arterin birleşmesiyle oluşan, ponsun ön yüzünde uzanan atardamar; beyin sapına ve beyinciğe dallar verir.',
    },
    ['FJ1672'],
  ),
  ...cift(
    {
      id: 'on-beyin-arteri',
      ad: 'Ön beyin arteri',
      latince: 'Arteria cerebri anterior',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'İç karotis arterin dalı; yarımkürenin iç yüzüne doğru ilerler. Willis halkasının bir parçasıdır.',
    },
    ['FJ1654M'],
    ['FJ1654'],
  ),
  tek(
    {
      id: 'on-baglanti-arteri',
      ad: 'Ön bağlantı arteri',
      latince: 'Arteria communicans anterior',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'İki ön beyin arterini birbirine bağlayan kısa atardamar; Willis halkasının bir parçasıdır.',
    },
    ['FJ1655'],
  ),
  ...cift(
    {
      id: 'orta-beyin-arteri',
      ad: 'Orta beyin arteri',
      latince: 'Arteria cerebri media',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'İç karotis arterin en büyük dalı; dalları yarımkürenin yan yüzünün büyük bölümüne yayılır.',
    },
    ['FJ1692M', 'FJ1718M', 'FJ1729M', 'FJ1693M', 'FJ1717M', 'FJ1673M'],
    ['FJ1692', 'FJ1718', 'FJ1729', 'FJ1693', 'FJ1717', 'FJ1673'],
  ),
  ...cift(
    {
      id: 'arka-baglanti-arteri',
      ad: 'Arka bağlantı arteri',
      latince: 'Arteria communicans posterior',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'İç karotis arteri arka beyin arterine bağlar; Willis halkasının bir parçasıdır.',
    },
    ['FJ1713M'],
    ['FJ1713'],
  ),
  ...cift(
    {
      id: 'arka-beyin-arteri',
      ad: 'Arka beyin arteri',
      latince: 'Arteria cerebri posterior',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'Baziler arterin uç dalı; beynin arka ve alt bölümlerine doğru ilerler. Willis halkasının bir parçasıdır.',
    },
    ['FJ1723M', 'FJ1714M'],
    ['FJ1723', 'FJ1714'],
  ),
  ...cift(
    {
      id: 'ust-beyincik-arteri',
      ad: 'Üst beyincik arteri',
      latince: 'Arteria superior cerebelli',
      bolge: 'damar',
      katman: 'damar',
      gorev: 'Baziler arterin üst ucuna yakın çıkan dal; beyinciğin üst yüzüne doğru ilerler.',
    },
    ['FJ1726M', 'FJ1683M', 'FJ1688M', 'FJ1728M'],
    ['FJ1726', 'FJ1683', 'FJ1688', 'FJ1728'],
  ),

  // ——— Kafatası (beyni saran kemikler) ———
  tek(
    {
      id: 'alin-kemigi',
      ad: 'Alın kemiği',
      sade: 'frontal kemik',
      latince: 'Os frontale',
      bolge: 'kemik',
      katman: 'kemik',
      gorev: 'Alnı ve göz çukurlarının tavanını oluşturan kemik; frontal lobun önünü korur.',
    },
    ['FJ3200'],
  ),
  ...cift(
    {
      id: 'yan-kafa-kemigi',
      ad: 'Yan kafa kemiği',
      sade: 'parietal kemik',
      latince: 'Os parietale',
      bolge: 'kemik',
      katman: 'kemik',
      gorev: 'Kafatasının tavanını ve yan duvarlarını oluşturan çift kemik.',
    },
    ['FJ3274'],
    ['FJ3380'],
  ),
  ...cift(
    {
      id: 'sakak-kemigi',
      ad: 'Şakak kemiği',
      sade: 'temporal kemik',
      latince: 'Os temporale',
      bolge: 'kemik',
      katman: 'kemik',
      gorev: 'Kafatasının yan-alt duvarındaki çift kemik; işitme ve denge organlarını içinde taşır.',
    },
    ['FJ3281'],
    ['FJ3386'],
  ),
  tek(
    {
      id: 'art-kafa-kemigi',
      ad: 'Art kafa kemiği',
      sade: 'oksipital kemik',
      latince: 'Os occipitale',
      bolge: 'kemik',
      katman: 'kemik',
      gorev: 'Kafatasının arka ve alt bölümünü oluşturan kemik; omurilik, tabanındaki büyük delikten geçer.',
    },
    ['FJ3309'],
  ),
  tek(
    {
      id: 'kama-kemigi',
      ad: 'Kama kemiği',
      sade: 'sfenoid kemik',
      latince: 'Os sphenoidale',
      bolge: 'kemik',
      katman: 'kemik',
      gorev: 'Kafatası tabanının ortasında, kanatlarını açmış bir kelebeğe benzeyen kemik; hipofiz bezi üst yüzündeki çukurda oturur.',
    },
    ['FJ3394'],
  ),
  tek(
    {
      id: 'kalbur-kemigi',
      ad: 'Kalbur kemiği',
      sade: 'etmoid kemik',
      latince: 'Os ethmoidale',
      bolge: 'kemik',
      katman: 'kemik',
      gorev: 'Burun boşluğunun tavanındaki süngerimsi kemik; koku liflerinin geçtiği delikli bir plak taşır.',
    },
    ['FJ3199'],
  ),
];

export function yapiById(id: string): Yapi | undefined {
  return YAPILAR.find((y) => y.id === id);
}

/** Taraf adı ekiyle görünen ad: "Presantral girus (sol)". */
export function yapiAdi(y: Yapi): string {
  return y.taraf ? `${y.ad} (${y.taraf === 'sol' ? 'sol' : 'sağ'})` : y.ad;
}

export const KATMAN_ADLARI: Record<Katman, string> = {
  kabuk: 'Beyin kabuğu (kıvrımlar)',
  beyaz: 'Beyaz cevher',
  derin: 'Derin yapılar',
  sap: 'Beyin sapı ve beyincik',
  karincik: 'Karıncıklar',
  damar: 'Atardamarlar',
  kemik: 'Kafatası',
};

export const BOLGE_ADLARI: Record<Bolge, string> = {
  serebrum: 'Büyük beyin (serebrum)',
  diensefalon: 'Ara beyin (diensefalon)',
  'beyin-sapi': 'Beyin sapı',
  beyincik: 'Beyincik (serebellum)',
  karincik: 'Karıncıklar',
  damar: 'Atardamarlar',
  kemik: 'Kafatası kemikleri',
  sinir: 'Kafa sinirleri',
};

export const LOB_ADLARI: Record<Lob, string> = {
  frontal: 'Frontal (alın) lob',
  parietal: 'Parietal (yan kafa) lob',
  temporal: 'Temporal (şakak) lob',
  oksipital: 'Oksipital (art kafa) lob',
  insula: 'İnsula',
  limbik: 'Limbik lob',
};
