import type { QuizForm, QuizTable } from '@/lib/instruments/types';
import { q } from './helpers';

/**
 * 7. sınıf formu: 6. sınıf konuları. Konular, Türkiye Yüzyılı Maarif Modeli 6. sınıf matematik
 * programının temalarına göre seçilmiştir (tam sayılar ve oran bu programda 7. sınıftadır, bu
 * yüzden burada sorulmaz).
 */

const KARDES: QuizTable = {
  caption: 'Bir sınıftaki öğrencilerin kardeş sayıları',
  head: ['Kardeş sayısı', 'Öğrenci sayısı'],
  rows: [
    ['0', '3'],
    ['1', '8'],
    ['2', '6'],
    ['3', '2'],
    ['4', '1'],
  ],
};

export const form7: QuizForm = {
  key: 'mat-7',
  grade: 7,
  contentGrade: 6,
  domains: [
    { key: 'sayilar', name: 'Çarpanlar, katlar ve bölünebilme', plain: 'Bölünebilme kuralları, asal çarpanlar, ortak bölen ve ortak kat problemleri.' },
    { key: 'kesirler', name: 'Kesirler, ondalık gösterim ve yüzde', plain: 'Kesirlerle işlemler, kesir ile bölme arasındaki ilişki, ondalık gösterim ve yüzde problemleri.' },
    { key: 'cebir', name: 'Cebirsel ifadeler ve örüntüler', plain: 'Cebirsel ifade yazma ve değerini bulma, bilinmeyeni bulma, örüntünün kuralı.' },
    { key: 'geometri', name: 'Geometri ve ölçme', plain: 'Üçgende açılar, paralelkenarın alanı, alan birimleri ve çemberin uzunluğu.' },
    { key: 'veri', name: 'Veri ve olasılık', plain: 'Aritmetik ortalama, ortanca, tablodan ortalama hesaplama ve deneysel olasılık.' },
  ],
  items: [
    /* ---------- Çarpanlar, katlar ve bölünebilme ---------- */
    q(
      'M7-01',
      'sayilar',
      'Dört basamaklı 52□4 sayısı 9 ile kalansız bölünebildiğine göre □ yerine hangi rakam gelmelidir?',
      [['1', 'bolunebilme'], ['4', 'bolunebilme'], ['7', true], ['9']],
      'Bir sayının 9 ile kalansız bölünebilmesi için rakamlarının toplamı 9’un katı olmalıdır. 5 + 2 + 4 = 11; buna 7 eklenirse 18 olur ve 18, 9’un katıdır. 1 ya da 4 yazılırsa rakamların toplamı 3’ün katı olur ama 9’un katı olmaz.',
    ),
    q(
      'M7-02',
      'sayilar',
      '84 sayısının asal çarpanlarının çarpımı biçiminde yazılışı hangisidir?',
      [['2 × 3 × 7', 'asal_carpan'], ['2 × 6 × 7', 'asal_carpan'], ['4 × 3 × 7', 'asal_carpan'], ['2 × 2 × 3 × 7', true]],
      '84 = 2 × 42 = 2 × 2 × 21 = 2 × 2 × 3 × 7. Çarpanların hepsi asal olmalıdır; 4 ve 6 asal değildir. 2 × 3 × 7 ise 42 eder, 84 etmez.',
    ),
    q(
      'M7-03',
      'sayilar',
      'Bir duraktan A hattının otobüsleri 12 dakikada bir, B hattının otobüsleri 18 dakikada bir kalkmaktadır. İki hattın otobüsleri saat 08.00’de birlikte kalktığına göre bir sonraki birlikte kalkış saat kaçta olur?',
      [['08.06', 'ebob_ekok'], ['08.30', 'ebob_ekok'], ['08.36', true], ['11.36', 'ebob_ekok']],
      'Birlikte kalkış için geçen süre hem 12’nin hem 18’in katı olmalıdır. 12’nin katları 12, 24, 36…; 18’in katları 18, 36… Ortak katların en küçüğü 36’dır. Otobüsler 36 dakika sonra, saat 08.36’da birlikte kalkar.',
    ),
    q(
      'M7-04',
      'sayilar',
      'Uzunlukları 48 cm ve 60 cm olan iki çıta, hiç artmayacak biçimde, eşit uzunlukta ve olabildiğince uzun parçalara kesilecektir. Toplam kaç parça elde edilir?',
      [['5'], ['9', true], ['12', 'soru_okuma'], ['18', 'en_az_en_cok']],
      'Parça uzunluğu hem 48’i hem 60’ı tam bölmeli ve olabildiğince büyük olmalıdır. Ortak bölenlerin en büyüğü 12’dir. 48 cm’lik çıtadan 4, 60 cm’lik çıtadan 5 parça çıkar: toplam 9 parça. 12, parça sayısı değil, bir parçanın uzunluğudur.',
    ),

    /* ---------- Kesirler, ondalık gösterim ve yüzde ---------- */
    q(
      'M7-05',
      'kesirler',
      '{2/3} + {1/4} işleminin sonucu kaçtır?',
      [['{2/12}', 'kesir_islem'], ['{3/12}', 'genisletme'], ['{3/7}', 'kesir_toplama_payda'], ['{11/12}', true]],
      'Önce paydalar eşitlenir: {2/3} = {8/12} ve {1/4} = {3/12}. Sonra paylar toplanır: {8/12} + {3/12} = {11/12}. Paydaları eşitlerken pay da aynı sayıyla çarpılmalıdır.',
    ),
    q(
      'M7-06',
      'kesirler',
      '3 pizza, 4 kişi arasında eşit olarak paylaştırılıyor. Kişi başına kaç pizza düşer?',
      [['{1/12}', 'kesir_butun'], ['{1/4}', 'kesir_butun'], ['{3/4}', true], ['{4/3}', 'kesir_bolme']],
      '3 pizzayı 4 kişiye paylaştırmak 3 ÷ 4 işlemidir ve 3 ÷ 4 = {3/4}’tür. Her pizza 4 dilime bölünürse 12 dilim olur; her kişiye 3 dilim, yani {3/4} pizza düşer.',
    ),
    q(
      'M7-07',
      'kesirler',
      'Tanesi 2,75 TL olan kalemlerden 4 tane alan Zeynep kasaya 20 TL veriyor. Zeynep kaç TL para üstü alır?',
      [['9', true], ['11', 'soru_okuma'], ['17,25', 'soru_okuma'], ['18,9', 'ondalik_virgul']],
      '4 kalemin fiyatı 2,75 × 4 = 11 TL’dir. Para üstü: 20 − 11 = 9 TL.',
    ),
    q(
      'M7-08',
      'kesirler',
      'Etiket fiyatı 240 TL olan bir ayakkabıya %15 indirim yapılıyor. Ayakkabının indirimli fiyatı kaç TL’dir?',
      [['36', 'soru_okuma'], ['204', true], ['225', 'yuzde_anlami'], ['276', 'yuzde_artis_azalis']],
      '240’ın %15’i 240 × 15 ÷ 100 = 36 TL’dir; bu, indirim miktarıdır. İndirimli fiyat: 240 − 36 = 204 TL.',
    ),

    /* ---------- Cebirsel ifadeler ve örüntüler ---------- */
    q(
      'M7-09',
      'cebir',
      '“Bir sayının 3 katının 5 eksiği” ifadesi, sayı x ile gösterildiğinde aşağıdakilerden hangisidir?',
      [['3(x − 5)', 'sozel_cebir'], ['3x + 5', 'sozel_cebir'], ['5 − 3x', 'sozel_cebir'], ['3x − 5', true]],
      'Önce sayının 3 katı alınır: 3x. Sonra bundan 5 çıkarılır: 3x − 5. 3(x − 5) ise sayının 5 eksiğinin 3 katıdır; işlemlerin sırası farklıdır.',
    ),
    q(
      'M7-10',
      'cebir',
      'a = 4 için 3a + 2 ifadesinin değeri kaçtır?',
      [['9', 'cebir_yan_yana'], ['14', true], ['18', 'islem_onceligi'], ['36', 'cebir_yan_yana']],
      '3a, “3 çarpı a” demektir. a = 4 için 3 × 4 = 12 ve 12 + 2 = 14. 3a’yı 34 gibi yan yana yazılmış rakamlar olarak okumak yanlıştır.',
    ),
    q(
      'M7-11',
      'cebir',
      'Ayşe’nin yaşının 2 katının 7 fazlası 31’dir. Ayşe kaç yaşındadır?',
      [['12', true], ['19', 'denklem_ters_islem'], ['24', 'soru_okuma'], ['69', 'denklem_ters_islem']],
      'Yaşın 2 katının 7 fazlası 31 ise yaşın 2 katı 31 − 7 = 24’tür. Yaş ise 24 ÷ 2 = 12’dir. Kontrol: 2 × 12 + 7 = 31.',
    ),
    q(
      'M7-12',
      'cebir',
      '5, 8, 11, 14, … örüntüsünün n. terimini veren kural aşağıdakilerden hangisidir?',
      [['n + 3', 'oruntu_kural'], ['3n', 'oruntu_kural'], ['5n + 3', 'oruntu_kural'], ['3n + 2', true]],
      'Terimler 3’er arttığı için kuralda 3n bulunur. 1. terim için 3 × 1 = 3 olur, ama ilk terim 5’tir; bu yüzden 2 eklenir: 3n + 2. Kontrol: 2. terim için 3 × 2 + 2 = 8.',
    ),

    /* ---------- Geometri ve ölçme ---------- */
    q(
      'M7-13',
      'geometri',
      'Bir üçgenin iki iç açısının ölçüleri 47° ve 68°’dir. Üçüncü iç açının ölçüsü kaç derecedir?',
      [['65°', true], ['75°'], ['115°', 'soru_okuma'], ['245°', 'aci_toplami']],
      'Bir üçgenin iç açılarının toplamı 180°’dir. 47° + 68° = 115°; 180° − 115° = 65°.',
    ),
    q(
      'M7-14',
      'geometri',
      'Bir paralelkenarın kenar uzunlukları 12 cm ve 9 cm’dir. 12 cm’lik kenara ait yüksekliği 7 cm’dir. Bu paralelkenarın alanı kaç cm²’dir?',
      [['42', 'alan_formul'], ['63', 'alan_formul'], ['84', true], ['108', 'alan_formul']],
      'Paralelkenarın alanı, bir kenarı ile o kenara ait yüksekliğin çarpımıdır: 12 × 7 = 84 cm². Yan kenar (9 cm) yükseklik değildir; paralelkenar kesilip dikdörtgene dönüştürüldüğünde dikdörtgenin kısa kenarı yükseklik olur.',
    ),
    q(
      'M7-15',
      'geometri',
      '2 m² kaç cm²’dir?',
      [['20', 'alan_birim'], ['200', 'alan_birim'], ['2000', 'alan_birim'], ['20 000', true]],
      '1 m = 100 cm olduğu için kenarı 1 m olan bir kare, kenarı 100 cm olan bir karedir; alanı 100 × 100 = 10 000 cm²’dir. Buna göre 2 m² = 20 000 cm².',
    ),
    q(
      'M7-16',
      'geometri',
      'Çapı 60 cm olan bir bisiklet tekerleği bir tam tur döndüğünde kaç cm yol alır? (π yerine 3 alınız.)',
      [['90', 'cap_yaricap'], ['180', true], ['360', 'cap_yaricap'], ['2700', 'alan_cevre']],
      'Tekerlek bir tur döndüğünde çevresi kadar yol alır. Çemberin uzunluğu çapın π katıdır: 3 × 60 = 180 cm. 2 × π × 60 hesaplamak, çapı yarıçap yerine kullanmak demektir.',
    ),

    /* ---------- Veri ve olasılık ---------- */
    q(
      'M7-17',
      'veri',
      'Bir öğrencinin beş sınavdan aldığı puanlar 70, 85, 90, 65 ve 80’dir. Bu puanların aritmetik ortalaması kaçtır?',
      [['78', true], ['80', 'ortalama_ortanca'], ['97,5', 'ortalama_toplam'], ['390', 'ortalama_toplam']],
      'Aritmetik ortalama, verilerin toplamının veri sayısına bölümüdür: (70 + 85 + 90 + 65 + 80) ÷ 5 = 390 ÷ 5 = 78. 80 ise sıralanmış puanların ortasındaki değerdir (ortanca).',
    ),
    q(
      'M7-18',
      'veri',
      '9, 4, 12, 6, 3 ve 10 verilerinin ortancası kaçtır?',
      [['6', 'ortanca_cift'], ['7,5', true], ['9', 'ortanca_siralama'], ['15', 'ortanca_cift']],
      'Ortanca bulunmadan önce veriler sıralanır: 3, 4, 6, 9, 10, 12. Veri sayısı çift olduğu için ortadaki iki değerin ortalaması alınır: (6 + 9) ÷ 2 = 7,5.',
    ),
    q(
      'M7-19',
      'veri',
      'Tabloya göre bu sınıftaki öğrencilerin kardeş sayılarının aritmetik ortalaması kaçtır?',
      [['1,5', true], ['2', 'tablo_okuma'], ['4', 'tablo_okuma'], ['30', 'ortalama_toplam']],
      'Toplam kardeş sayısı: 0 × 3 + 1 × 8 + 2 × 6 + 3 × 2 + 4 × 1 = 30. Öğrenci sayısı: 3 + 8 + 6 + 2 + 1 = 20. Ortalama: 30 ÷ 20 = 1,5. Tablodaki 0, 1, 2, 3, 4 değerlerinin ortalamasını almak, her değere kaç öğrencinin sahip olduğunu hesaba katmamak olur.',
      { table: KARDES },
    ),
    q(
      'M7-20',
      'veri',
      'Bir zar 50 kez atılmış ve 6 sayısı 12 kez gelmiştir. Bu deneye göre 6 gelmesinin deneysel olasılığı kaçtır?',
      [['{1/6}', 'deneysel_teorik'], ['{12/38}', 'olasilik_oran'], ['{12/50}', true], ['{38/50}', 'soru_okuma']],
      'Deneysel olasılık, olayın deneyde gerçekleşme sayısının deneme sayısına bölümüdür: {12/50}. {1/6} ise zarın hilesiz olduğu varsayılarak hesaplanan teorik olasılıktır.',
    ),
  ],
};
