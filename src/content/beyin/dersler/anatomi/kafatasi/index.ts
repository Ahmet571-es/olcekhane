import type { Ders } from '../../../types';
import { kafatasinaGenelBakis } from './bolum-1-genel';
import { kubbeVeDikisler } from './bolum-2-kubbe';
import { katmanlar } from './bolum-3-katmanlar';
import { kafatasininTabani } from './bolum-4-taban';
import { yuzVeBoyun } from './bolum-5-yuz';
import { bebeklikten } from './bolum-6-gelisim';
import { kiriklarVeCerrahi } from './bolum-7-kiriklar-cerrahi';
import { kaynaklar } from './kaynaklar';
import { sorular } from './sorular';
import { sozluk } from './sozluk';

/**
 * Anatomi 2: Kafatası. Üç düzeyli ders (Temel, Lisans, Uzman): kemikler, dikişler, kafa derisi ve kemiğin katmanları,
 * kafatası tabanı ve delikleri, yüz ve sinüsler, gelişim ve kraniosinostoz, kırıklar, görüntüleme ve kafatası cerrahisi.
 * Üç boyutlu sahneler BodyParts3D kafatası, yüz kemikleri ve ilk iki boyun omuruyla çizilir.
 */
export const kafatasi: Ders = {
  dal: 'anatomi',
  slug: 'kafatasi',
  sira: 6,
  seviye: 'temel',
  baslik: 'Kafatası: beynin kemik kalesi',
  aciklama:
    'Üç düzeyli ders: kafatasının 22 kemiği, dikişler ve pterion, kafa tabanı ve delikleri, bıngıldaklar, kraniosinostoz, kırıklar ve kafatası cerrahisi.',
  giris:
    'Beyin yumuşak bir dokudur ve katman katman korunur: önce beş katlı kafa derisi, sonra iki tablalı bir kemik kalkan, en içte zarlar. Bu derste o kalkanı tanıyacağız: kemiklerini, dikişlerini, tabanındaki delikleri ve bebeklikten yaşlılığa nasıl değiştiğini. Temel ile başla; Lisans ve Uzman düzeylerinde kafa tabanı sendromları, kırıklar, görüntüleme ve kafatasının cerrahi anatomisi var. Bu ders kafatası ünitesinin genel bakışıdır; her konu ünitenin sonraki altı dersinde çok daha ayrıntılı işlenecek; hazır olanlar bölüm sayfasında açılır.',
  hedefler: [
    'Kafatasının 22 kemiğini beyin kutusu ve yüz olarak ayırmak; hareket eden tek kemiği bilmek',
    'Beyin kutusunun sekiz kemiğini üç boyutlu modelde bulmak',
    'Dört büyük dikişi ve pterionu tanımak; pterionun neden önemli olduğunu açıklamak',
    'Kafa derisinin beş katmanını ve kemiğin sandviç yapısını sıralamak',
    'Kafatası tabanının üç çukurunu ve en önemli deliklerini tanımak',
    'Bıngıldakları, kafatasının büyümesini ve kırık türlerini açıklamak',
    { metin: 'Kafa tabanındaki deliklerden geçen sinirleri ve damarları eşleştirmek; delik sendromlarını tanımak', duzey: 'lisans' },
    { metin: 'Kraniometrik noktaları ve dikişlerin kaynaşma zamanlarını bilmek', duzey: 'lisans' },
    { metin: 'Kraniosinostoz türlerini pozisyonel plajiyosefaliden ayırmak', duzey: 'lisans' },
    { metin: 'Kafa tabanı kırığının işaretlerini, BOS sızıntısının tanısını ve BT karar kurallarını uygulamak', duzey: 'lisans' },
    { metin: 'Göz çukuru, burun bölmesi, sinüsler ve kraniovertebral bileşkenin anatomisini klinikle ilişkilendirmek', duzey: 'lisans' },
    {
      metin: 'Pterion ve asterion çeşitliliğini ve pterional, anahtar deliği ve retrosigmoid yaklaşımların işaretlerini değerlendirmek',
      duzey: 'ileri',
    },
    { metin: 'Orta çukur üçgenlerini, foramen ovale girişimlerini ve endonazal koridorun işaretlerini tanımak', duzey: 'ileri' },
    { metin: 'Dekompresif kraniektomi ve kranioplasti kanıtlarını yorumlamak', duzey: 'ileri' },
    { metin: 'Kafatası iliği kanalları ve dikiş kök hücreleri üzerine güncel araştırmaları değerlendirmek', duzey: 'ileri' },
  ],
  bolumler: [kafatasinaGenelBakis, kubbeVeDikisler, katmanlar, kafatasininTabani, yuzVeBoyun, bebeklikten, kiriklarVeCerrahi],
  sozluk,
  sorular,
  kaynaklar,
  ucep: [
    { no: 138, ad: 'Hidrosefali', duzey: 'ÖnT' },
    { no: 164, ad: 'Kafa içi basınç artması sendromu', duzey: 'A' },
    { no: 165, ad: 'Kafa içi yer kaplayan lezyonlar', duzey: 'ÖnT' },
    { no: 166, ad: 'Kafa travması', duzey: 'A' },
  ],
  yayin: '2026-10-08',
  guncelleme: '2026-10-09',
};
