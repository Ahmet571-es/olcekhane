import type { Ders } from '../../../types';
import { haberlesmeAgi } from './bolum-1-haberlesme';
import { beyninBolumleri } from './bolum-2-bolumler';
import { yariklarVeLoblar } from './bolum-3-loblar';
import { griVeBeyazCevher } from './bolum-4-cevher';
import { yonTerimleri } from './bolum-5-yonler';
import { kesitDuzlemleri } from './bolum-6-kesitler';
import { koruyanlarVeBesleyenler } from './bolum-7-koruyanlar';
import { kaynaklar } from './kaynaklar';
import { sorular } from './sorular';
import { sozluk } from './sozluk';

/**
 * Anatomi 1: Sinir sistemine ilk bakış ve anatominin dili. Üç katmanlı ders (Temel, Lisans, Uzman): temel anlatım
 * meraklı herkes içindir; lisans ve uzman katmanları tıp, nörobilim ve psikoloji öğrencisine, asistan hekime, beyin
 * cerrahına ve araştırmacıya seslenir. Bölümler ayrı dosyalardadır.
 */
export const sinirSistemineIlkBakis: Ders = {
  dal: 'anatomi',
  slug: 'sinir-sistemine-ilk-bakis',
  sira: 1,
  seviye: 'temel',
  baslik: 'Sinir sistemine ilk bakış ve anatominin dili',
  aciklama:
    'Üç düzeyli giriş: sinir sisteminin bölümleri, gelişim, loblar, beyaz cevher yolları, yönler, MR ve BT, zarlar, BOS, kafa içi basıncı ve beyin dolaşımı.',
  giris:
    'Beynin ayrıntılarına dalmadan önce haritanın tamamına bakalım: sinir sistemi hangi parçalardan oluşur, beyin bu sistemin neresindedir, onu ne korur ve besler, anatomistler bir yapının yerini nasıl tarif eder? Ders üç düzeyde okunur: Temel ile başla; hazır olduğunda Lisans ve Uzman düzeylerinde hasta vakalarına, görüntülemeye ve beyin cerrahisine geç.',
  hedefler: [
    'Merkezî ve çevresel sinir sistemini; somatik ve otonom sistemi ayırt etmek',
    'Omurilik sinirlerinin sayısını, köklerini ve karma yapısını açıklamak',
    'Beynin büyük bölümlerini ve gelişimdeki kökenlerini üç boyutlu modelde bulmak',
    'Büyük yarıkları, olukları ve lobları tanımak',
    'Gri ve beyaz cevheri, beyaz cevherin üç lif türünü ayırt etmek',
    'Yön terimlerini ve kesit düzlemlerini doğru kullanmak; MR’da sağı ve solu okumak',
    'Beyni koruyan ve besleyen yapılara ilk kez bakmak',
    { metin: 'Otonom çıkışı, gangliyonları, haberci maddeleri ve almaçları sıralamak', duzey: 'lisans' },
    { metin: 'Dermatomlar, refleks bölümleri ve üst/alt motor nöron bulgularıyla hasarın yerini kestirmek', duzey: 'lisans' },
    { metin: 'Sinir borusunu, kesecikleri, karıncıkları, alar/bazal plağı ve sinir kabartısı türevlerini ilişkilendirmek', duzey: 'lisans' },
    { metin: 'Kabuğun katmanlarını, beyaz cevher demetlerini, iç kapsülü ve çaprazlaşmaları açıklamak', duzey: 'lisans' },
    { metin: 'Zarlar arası aralıkları, BOS dolaşımını, kafa içi kanamaları ve Willis halkasını karşılaştırmak', duzey: 'lisans' },
    { metin: 'BT ve MR’da dokuları, MR’da merkezî oluğu tanımak', duzey: 'ileri' },
    { metin: 'Kafa içi basınç–hacim ilişkisini, perfüzyon basıncını ve herniasyonu yorumlamak', duzey: 'ileri' },
    { metin: 'Stereotaksik koordinatları (AC–PC, Talairach, MNI) ve derin beyin uyarımının hedeflerini tanımak', duzey: 'ileri' },
    { metin: 'Uyanık kraniyotomi, traktografi ve kallozotomi gibi cerrahi yaklaşımların anatomik temelini anlamak', duzey: 'ileri' },
    { metin: 'Nöron sayıları, kabuk haritaları ve miyelinleşme üzerine güncel araştırmaları değerlendirmek', duzey: 'ileri' },
  ],
  bolumler: [haberlesmeAgi, beyninBolumleri, yariklarVeLoblar, griVeBeyazCevher, yonTerimleri, kesitDuzlemleri, koruyanlarVeBesleyenler],
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
    { no: 224, ad: 'Multipl skleroz', duzey: 'ÖnT' },
    { no: 227, ad: 'Nöral tüp defektleri', duzey: 'T-K' },
    { no: 291, ad: 'Spinal kord bası sendromu', duzey: 'ÖnT' },
  ],
  yayin: '2026-10-08',
  guncelleme: '2026-10-08',
};
