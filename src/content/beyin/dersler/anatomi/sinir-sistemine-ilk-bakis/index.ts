import type { Ders } from '../../../types';
import { neYapar } from './bolum-01-ne-yapar';
import { yonBulma } from './bolum-02-yon-bulma';
import { sinirDokusu } from './bolum-03-sinir-dokusu';
import { sayilarlaSinirSistemi } from './bolum-04-sayilarla';
import { beyninBolumleri } from './bolum-05-beynin-bolumleri';
import { yariklarVeLoblar } from './bolum-06-loblar';
import { gelisim } from './bolum-07-gelisim';
import { omurilikVeOmurga } from './bolum-08-omurilik';
import { cevreselSinirSistemi } from './bolum-09-cevresel';
import { otonomVeEnterik } from './bolum-10-otonom';
import { koruyanlarVeBesleyenler } from './bolum-11-koruyanlar';
import { hasarinYeri } from './bolum-12-hasarin-yeri';
import { bugunNasilInceliyoruz } from './bolum-13-bugun';
import { kaynaklar } from './kaynaklar';
import { sorular } from './sorular';
import { sozluk } from './sozluk';

/**
 * Anatomi 1: Sinir sistemine ilk bakış (bölümün genel bakışı: bütün sinir sisteminin haritası). Üç düzeyli ders (Temel, Lisans,
 * Uzman); bilgiler açık erişimli ders kitaplarından (Gray 1918, OpenStax, UTHealth, TA2) ve makalelerin tam
 * metinlerinden alındı. Bölümler ayrı dosyalardadır.
 */
export const sinirSistemineIlkBakis: Ders = {
  dal: 'anatomi',
  slug: 'sinir-sistemine-ilk-bakis',
  sira: 1,
  seviye: 'temel',
  baslik: 'Sinir sistemine ilk bakış',
  aciklama:
    'Sinir sisteminin üç düzeyli haritası: bölümler, sinir dokusu, sayılar, loblar, gelişim, omurilik, sinirler, otonom sistem, zarlar, BOS, damarlar, hasarın yeri.',
  giris:
    'Beynin ayrıntılarına dalmadan önce haritanın tamamına bakalım. Sinir sistemi ne yapar ve nasıl bölünür? Hangi hücrelerden kurulur? Beyin hangi parçalardan oluşur ve nasıl gelişir? Omurilik ve sinirler bedene nasıl yayılır? Beyni ne korur, ne besler? Bir hasarın yeri belirtilerden nasıl bulunur? Ders üç düzeyde okunur. Temel ile başla. Hazır olduğunda Lisans ve Uzman düzeylerine geç: orada ders kitaplarının ayrıntısı, birbirini tutmayan kaynaklar, hasta vakaları, görüntüleme ve beyin cerrahisi var. Bu ders bütün sinir sisteminin haritasıdır; sonraki dersler beynin yapılarını tek tek ayrıntılı işler.',
  hedefler: [
    'Sinir sisteminin üç işini (duyu, bütünleştirme, yanıt) ve yerine, işine ve bilginin yönüne göre bölümlerini açıklamak',
    'Yön terimlerini ve kesit düzlemlerini kullanmak; beyinde ve omurilikte “dorsal” ile “rostral”ın farkını söylemek',
    'Nöronu, glia hücrelerini, miyelini ve sinirin kılıflarını tanımak; “100 milyar nöron, on kat glia” efsanesini düzeltmek',
    'Beynin büyük bölümlerini, loblarını ve karıncıklarını üç boyutlu modelde bulmak',
    'Sinir borusundan beş keseciğe uzanan gelişimi ve nöral tüp defektlerini folik asitle birlikte açıklamak',
    'Omuriliğin omurgaya göre yerini, 31 çift omurilik sinirini, 12 çift kafa sinirini ve otonom sistemin iki kolunu tanımak',
    'Beyni koruyan zarları, BOS’u, kan-beyin engelini ve beyni besleyen atardamarları tanımak',
    { metin: 'MSS–ÇSS geçiş bölgesini, işlevsel lif bileşenlerini ve enterik sistemin sınırlarını açıklamak', duzey: 'lisans' },
    {
      metin: 'Beyin ağırlığı, kabuk yüzeyi ve kalınlığı, sinaps, miyelinli lif ve enerji sayılarını kaynağı ve tanımıyla okumak',
      duzey: 'lisans',
    },
    {
      metin: 'Konusun yerini, bel ponksiyonunun hizasını, sinir ağlarını ve dermatom haritalarının sınırlarını değerlendirmek',
      duzey: 'lisans',
    },
    { metin: 'Otonom çıkışı, gangliyonları, haberci maddeleri ve Horner sendromunun anatomisini sıralamak', duzey: 'lisans' },
    { metin: 'Üst ve alt motor nöron bulgularıyla ve lokalizasyon merdiveniyle hasarın yerini kestirmek', duzey: 'lisans' },
    { metin: 'Normal BOS ve kafa içi basıncı değerlerini, Willis halkası varyantlarını ve iskemi eşiklerini yorumlamak', duzey: 'lisans' },
    { metin: 'Gray 1918’in eskimiş bilgilerini ve kaynaklar arası çelişkileri güncel kanıtla karşılaştırmak', duzey: 'ileri' },
    {
      metin: 'Sert zarın katmanlarını, “subdural aralık” tartışmasını, glimfatik hipotezi ve SLYM tartışmasını değerlendirmek',
      duzey: 'ileri',
    },
    {
      metin:
        'Stereotaksik koordinatları (AC–PC, Talairach, MNI), görüntü dosyalarındaki eksen kurallarını ve geçiş bölgesinin cerrahi anlamını tanımak',
      duzey: 'ileri',
    },
    {
      metin:
        'Sinir sistemi hastalıklarının yükünü, beyin ölümü ölçütlerini ve güncel haritalama çalışmalarını (BICCN, HCP, konnektomlar) değerlendirmek',
      duzey: 'ileri',
    },
  ],
  bolumler: [
    neYapar,
    yonBulma,
    sinirDokusu,
    sayilarlaSinirSistemi,
    beyninBolumleri,
    yariklarVeLoblar,
    gelisim,
    omurilikVeOmurga,
    cevreselSinirSistemi,
    otonomVeEnterik,
    koruyanlarVeBesleyenler,
    hasarinYeri,
    bugunNasilInceliyoruz,
  ],
  sozluk,
  sorular,
  kaynaklar,
  ucep: [
    { no: 127, ad: 'Guillain-Barré sendromu', duzey: 'ÖnT' },
    { no: 138, ad: 'Hidrosefali', duzey: 'ÖnT' },
    { no: 154, ad: 'İnme', duzey: 'A-K-İ' },
    { no: 156, ad: 'İntrakraniyal kanamalar', duzey: 'A' },
    { no: 164, ad: 'Kafa içi basınç artması sendromu', duzey: 'A' },
    { no: 166, ad: 'Kafa travması', duzey: 'A' },
    { no: 216, ad: 'Merkezi sinir sistemi enfeksiyonları', duzey: 'A' },
    { no: 224, ad: 'Multipl skleroz', duzey: 'ÖnT' },
    { no: 225, ad: 'Myastenia gravis ve kolinerjik kriz', duzey: 'A' },
    { no: 227, ad: 'Nöral tüp defektleri', duzey: 'T-K' },
    { no: 246, ad: 'Parkinson hastalığı', duzey: 'ÖnT' },
    { no: 252, ad: 'Periferik nöropati', duzey: 'ÖnT' },
    { no: 291, ad: 'Spinal kord bası sendromu', duzey: 'ÖnT' },
  ],
  yayin: '2026-10-08',
  guncelleme: '2026-10-09',
};
