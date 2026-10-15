import type { Ders } from '../../../types';
import { zarlaraIlkBakis } from './bolum-01-ilk-bakis';
import { sertZarinYapisi } from './bolum-02-sert-zar';
import { sertZarinKivrimlari } from './bolum-03-kivrimlar';
import { toplardamarSinusleri } from './bolum-04-sinusler';
import { sertZarinDamarlariVeSinirleri } from './bolum-05-damar-sinir';
import { orumcekAgiZar } from './bolum-06-orumcek-agi';
import { yumusakZar } from './bolum-07-yumusak-zar';
import { bosluklarVeSisternalar } from './bolum-08-bosluklar';
import { yeniKesifler } from './bolum-09-yeni-kesifler';
import { gelisimVeTarih } from './bolum-10-gelisim-tarih';
import { kanamalarVeFitiklasmalar } from './bolum-11-kanamalar';
import { iltihapTumorVeBasinc } from './bolum-12-iltihap-tumor';
import { goruntulemeVeCerrahi } from './bolum-13-goruntuleme-cerrahi';
import { kaynaklar } from './kaynaklar';
import { sorular } from './sorular';
import { sozluk } from './sozluk';

/**
 * Anatomi 3: Beyin zarları ve zarlar arası boşluklar. Üç düzeyli ders (Temel, Lisans, Uzman); bilgiler açık erişimli
 * ders kitaplarından (Gray 1918, OpenStax, UTHealth, TA2), açık kılavuzlardan ve makalelerin tam metinlerinden alındı.
 * Bölümler ayrı dosyalardadır.
 */
export const beyinZarlari: Ders = {
  dal: 'anatomi',
  slug: 'beyin-zarlari',
  sira: 3,
  seviye: 'lisans',
  baslik: 'Beyin zarları ve zarlar arası boşluklar',
  aciklama:
    'Beyni saran üç zar, kıvrımları, sinüsler, boşluklar ve sisternalar; yeni keşifler, gelişim ve tarih, kanamalar, menenjit, tümörler, görüntüleme ve cerrahi.',
  giris:
    'Beyin kafatasının içinde çıplak durmaz. Onu üç zar sarar: sert zar, örümcek ağı zar ve yumuşak zar. Bu zarlar beyni korur, beyin-omurilik sıvısının içinde asılı tutar, damarlarını taşır ve kafanın içini bölmelere ayırır. Bu derste zarları tek tek tanıyoruz. Sert zarın katları, kıvrımları ve içinden geçen toplardamar sinüsleri nelerdir? Zarların arasında gerçekten boşluk var mı? Sisterna nedir? Zarlarda lenf damarı olduğu ne zaman anlaşıldı? Kanamalar neden farklı biçim alır? Menenjit, menenjiyom ve düşük basınç zarlarda ne yapar? Ameliyatta zarlar nasıl açılıp kapanır? Temel ile başla; hazır olduğunda Lisans ve Uzman düzeylerinde ölçülere, tartışmalara, hasta vakalarına, görüntülemeye ve beyin cerrahisine geç.',
  hedefler: [
    'Beyni saran üç zarı içten dışa ve dıştan içe sırasıyla saymak ve her birinin görevini söylemek',
    'Hangi boşluğun gerçek, hangisinin normalde olmayan bir yarık olduğunu açıklamak',
    'Beyin orağını, beyincik çadırını ve çadır çentiğini tanımak; kafa içini nasıl bölmelere ayırdıklarını anlatmak',
    'Toplardamar sinüslerinin nerede olduğunu ve kanın hangi yolla kafatasından çıktığını izlemek',
    'Subaraknoid boşluğu ve sisternaları tanımak; bel delmenin neden belden yapıldığını açıklamak',
    'Zarların anne karnında ilkel zardan nasıl geliştiğini ve adlarının nereden geldiğini anlatmak',
    'Epidural, subdural ve subaraknoid kanamanın neden farklı yerde ve farklı biçimde biriktiğini zarlarla açıklamak',
    { metin: 'Sert zarın katlarını, sınır hücre katmanını ve araknoid engel hücre katmanını doku düzeyinde ayırt etmek', duzey: 'lisans' },
    { metin: 'Sert zarın atardamar ve sinirlerini, ağrı duyarlılığını ve baş ağrısıyla ilişkisini açıklamak', duzey: 'lisans' },
    { metin: 'Sisternaların sınırlarını ve içinden geçen damar ve sinirleri tabloyla tanımak', duzey: 'lisans' },
    {
      metin: 'Fıtıklaşma türlerini, menenjit bulgularını, menenjiyom derecelerini ve düşük basınç bulgularını tanımak',
      duzey: 'lisans',
    },
    { metin: 'Zar lenf damarları, glenfatik sistem ve SLYM tartışmalarında kanıtın gücünü değerlendirmek', duzey: 'ileri' },
    {
      metin: 'Zar boyanma örüntülerini, sert zar kapatma ve yama kanıtlarını ve sisternalar yoluyla cerrahiyi tartışmak',
      duzey: 'ileri',
    },
    { metin: 'Kaynaklar arasındaki ölçü ve tanım farklarını, eskimiş bilgileri ve tarihsel çelişkileri ayırt etmek', duzey: 'ileri' },
  ],
  bolumler: [
    zarlaraIlkBakis,
    sertZarinYapisi,
    sertZarinKivrimlari,
    toplardamarSinusleri,
    sertZarinDamarlariVeSinirleri,
    orumcekAgiZar,
    yumusakZar,
    bosluklarVeSisternalar,
    yeniKesifler,
    gelisimVeTarih,
    kanamalarVeFitiklasmalar,
    iltihapTumorVeBasinc,
    goruntulemeVeCerrahi,
  ],
  sozluk,
  sorular,
  kaynaklar,
  yayin: '2026-10-15',
  guncelleme: '2026-10-15',
};
