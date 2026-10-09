import type { Ders } from '../../../types';
import { kemikDili } from './bolum-1-kemik-dili';
import { kemiklerBirlikte } from './bolum-10-birlikte';
import { alinKemigi } from './bolum-2-alin';
import { yanKafaKemikleri } from './bolum-3-yan-kafa';
import { sakakKemigi } from './bolum-4-sakak';
import { artKafaKemigi } from './bolum-5-art-kafa';
import { kamaKemigi } from './bolum-6-kama';
import { kalburKemigi } from './bolum-7-kalbur';
import { yuzKemikleri } from './bolum-8-yuz';
import { altCeneVeDilKemigi } from './bolum-9-alt-cene-dil';
import { kaynaklar } from './kaynaklar';
import { sorular } from './sorular';
import { sozluk } from './sozluk';

/**
 * Anatomi 3 (kafatası ünitesinin 1. dersi): kemikler tek tek. Her kemik ayrı bölümde, üç düzeyde (Temel, Lisans,
 * Uzman); her bölümde kemik üç boyutlu sahnede tek başına, işaret noktalarıyla (`noktalar.ts`). Kaynaklar açık erişimli
 * tam metinler, Gray 1918, OpenStax ve Terminologia Anatomica'dır (site sahibinin 2026-10-09 derinlik isteği).
 */
export const kafatasininKemikleri: Ders = {
  dal: 'anatomi',
  slug: 'kafatasinin-kemikleri',
  sira: 3,
  seviye: 'lisans',
  baslik: 'Kafatası 1: Kemikler tek tek',
  aciklama:
    'Kafatasının her kemiği ayrı bölümde, üç düzeyde: parçaları, çıkıntıları, delikleri, eklemleri, kemikleşmesi, varyasyonları; işaretli 3B modellerle.',
  giris:
    'Genel bakış dersinde kafatasını bütün olarak tanıdık. Şimdi kemikleri tek tek ele alıyoruz: her kemik kendi bölümünde, üç boyutlu sahnede tek başına; çıkıntıları, delikleri ve çukurları üzerinde işaretli. Temel düzey her kemiğin yerini, parçalarını ve en önemli işaretlerini anlatır. Lisans düzeyinde bütün işaretler, eklemler, kemikleşme ve varyasyonlar; Uzman düzeyinde ölçüler, görüntüleme ve cerrahi anatomi var. Bu ders kafatası ünitesinin ilk dersidir.',
  hedefler: [
    'Kemik işaretlerinin dilini (çıkıntı, delik, çukur, oluk, kanal, yarık) kullanmak',
    'Beyin kutusunun sekiz kemiğinin ve yüz kemiklerinin yerini, parçalarını ve görevini anlatmak',
    'Her kemiğin en önemli işaretlerini üç boyutlu modelde bulmak',
    'Kafatasının kalın ve ince yerlerini açıklamak',
    {
      metin: 'Her kemiğin yüzlerini, kenarlarını, işaretlerini ve neyin nereye tutunduğunu ya da nereden geçtiğini tablolamak',
      duzey: 'lisans',
    },
    { metin: 'Kemiklerin eklemlerini, kemikleşme merkezlerini ve kaynaşma zamanlarını bilmek', duzey: 'lisans' },
    { metin: 'Sinüslerin, mastoid hücrelerin ve yüz siniri kanalının kemikle ilişkisini klinikle bağlamak', duzey: 'lisans' },
    { metin: 'Varyasyonların sıklığını tanım ve toplum farklarıyla birlikte yorumlamak; Türk serilerini tanımak', duzey: 'lisans' },
    { metin: 'Kulak, kafa tabanı, sinüs ve çene cerrahisinin kemik işaretlerini ve güvenli mesafelerini değerlendirmek', duzey: 'ileri' },
    { metin: 'Gray 1918 ile güncel terminoloji ve kanıt arasındaki farkları ayırt etmek', duzey: 'ileri' },
    { metin: 'Kafatasından cinsiyet tahmininin ve pin tespitinin kemik sınırlarını tartışmak', duzey: 'ileri' },
  ],
  bolumler: [
    kemikDili,
    alinKemigi,
    yanKafaKemikleri,
    sakakKemigi,
    artKafaKemigi,
    kamaKemigi,
    kalburKemigi,
    yuzKemikleri,
    altCeneVeDilKemigi,
    kemiklerBirlikte,
  ],
  sozluk,
  sorular,
  kaynaklar,
  ucep: [
    { no: 166, ad: 'Kafa travması', duzey: 'A' },
    { no: 164, ad: 'Kafa içi basınç artması sendromu', duzey: 'A' },
  ],
  yayin: '2026-10-09',
  guncelleme: '2026-10-09',
};
