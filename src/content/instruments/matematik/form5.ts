import type { QuizChart, QuizForm, QuizTable } from '@/lib/instruments/types';
import { q } from './helpers';

/**
 * 5. sınıf formu: ilkokul 4. sınıf konuları (ortaokula hazırbulunuşluk).
 * Seçenekler sayısal sırayla yazılmıştır; doğru cevaplar harflere eşit dağıtılmıştır.
 */

const MEYVE: QuizChart = {
  kind: 'bar',
  title: 'Sınıftaki öğrencilerin en sevdiği meyveler',
  labels: ['Elma', 'Muz', 'Portakal', 'Çilek'],
  values: [8, 6, 4, 10],
  yLabel: 'Öğrenci sayısı',
  step: 2,
  max: 12,
};

const KUTUPHANE: QuizTable = {
  caption: 'Bir kütüphaneye hafta içi gelen ziyaretçi sayıları',
  head: ['Gün', 'Ziyaretçi sayısı'],
  rows: [
    ['Pazartesi', '45'],
    ['Salı', '40'],
    ['Çarşamba', '52'],
    ['Perşembe', '38'],
    ['Cuma', '60'],
  ],
};

export const form5: QuizForm = {
  key: 'mat-5',
  grade: 5,
  contentGrade: 4,
  domains: [
    { key: 'sayilar', name: 'Doğal sayılar', plain: 'Çok basamaklı sayıları okuma ve yazma, basamak değeri, sıralama ve yuvarlama.' },
    { key: 'cebir', name: 'Dört işlem ve örüntüler', plain: 'Dört işlem gerektiren problemler, eşitlik ve sayı örüntüleri.' },
    { key: 'kesirler', name: 'Kesirler', plain: 'Kesirlerin anlamı, karşılaştırılması, bir çokluğun kesri ve paydaları eşit kesirlerle toplama.' },
    { key: 'geometri', name: 'Geometri ve ölçme', plain: 'Çevre, uzunluk ve zaman ölçme, açı türleri.' },
    { key: 'veri', name: 'Veri', plain: 'Sütun grafiği ve tablo okuma, verilerden sonuç çıkarma.' },
  ],
  items: [
    /* ---------- Doğal sayılar ---------- */
    q(
      'M5-01',
      'sayilar',
      '“Yüz iki bin kırk beş” sayısının rakamlarla yazılışı hangisidir?',
      [['102 045', true], ['102 450', 'basamak_degeri'], ['120 045', 'basamak_degeri'], ['1 002 045', 'basamak_degeri']],
      '“Yüz iki bin” 102 000, “kırk beş” 45 demektir: 102 000 + 45 = 102 045. Yüzler basamağında okunan bir rakam olmadığı için oraya 0 yazılır.',
    ),
    q(
      'M5-02',
      'sayilar',
      '485 216 sayısında 8 rakamının basamak değeri kaçtır?',
      [['8', 'basamak_degeri'], ['800', 'basamak_degeri'], ['8000', 'basamak_degeri'], ['80 000', true]],
      '8 rakamı on binler basamağındadır; basamak değeri 8 × 10 000 = 80 000’dir. Rakamın kendisi (8) ise sayı değeridir.',
    ),
    q(
      'M5-03',
      'sayilar',
      '4672 sayısı en yakın yüzlüğe yuvarlanırsa hangi sayı elde edilir?',
      [['4000', 'yuvarlama'], ['4600', 'yuvarlama'], ['4670', 'yuvarlama'], ['4700', true]],
      'Yüzler basamağındaki rakam 6’dır. Hemen sağındaki onlar basamağında 7 olduğu için (5 ya da daha büyük) yüzler basamağı bir artar ve sağındaki basamaklar 0 olur: 4700.',
    ),
    q(
      'M5-04',
      'sayilar',
      '0, 1, 3, 5 ve 7 rakamlarının her birini birer kez kullanarak yazılabilecek beş basamaklı en küçük doğal sayı hangisidir?',
      [['01357', 'basamak_degeri'], ['10 357', true], ['10 375'], ['75 310', 'soru_okuma']],
      'En küçük sayı için küçük rakamlar büyük basamaklara yazılır. Ancak 0 ile başlayan bir sayı beş basamaklı olmaz. Bu yüzden en başa 1, sonra 0, 3, 5 ve 7 yazılır: 10 357.',
    ),

    /* ---------- Dört işlem ve örüntüler ---------- */
    q(
      'M5-05',
      'cebir',
      'Bir kırtasiyeci, tanesi 18 TL olan defterlerden 24 tane satıyor. Kazandığı paranın 150 TL’sini harcarsa elinde kaç TL kalır?',
      [['82', 'carpma_algoritma'], ['282', true], ['432', 'soru_okuma'], ['582', 'islem_secimi']],
      'Önce toplam para bulunur: 18 × 24 = 432 TL. Sonra harcanan para çıkarılır: 432 − 150 = 282 TL.',
    ),
    q(
      'M5-06',
      'cebir',
      '125 öğrenci geziye gidecek. Her minibüse en fazla 8 öğrenci binebiliyor. Bütün öğrencilerin gidebilmesi için en az kaç minibüs gerekir?',
      [['5', 'kalan_yorum'], ['15', 'kalan_yorum'], ['16', true], ['17']],
      '125 ÷ 8 = 15, kalan 5. 15 minibüs 120 öğrenciyi taşır; kalan 5 öğrenci için bir minibüs daha gerekir: 16 minibüs.',
    ),
    q(
      'M5-07',
      'cebir',
      '36 + □ = 50 + 14 eşitliğinde □ yerine hangi sayı gelmelidir?',
      [['28', true], ['32', 'cikarma_algoritma'], ['64', 'esitlik_anlami'], ['100', 'esitlik_anlami']],
      'Eşittir işaretinin iki yanı aynı değerde olmalıdır. Sağ taraf 50 + 14 = 64’tür. 36’ya 28 eklenirse 64 olur: □ = 64 − 36 = 28.',
    ),
    q(
      'M5-08',
      'cebir',
      '3, 7, 11, 15, … sayı örüntüsü hep aynı kuralla devam etmektedir. Bu örüntüde baştan 10. sırada hangi sayı vardır?',
      [['36', 'oruntu_kural'], ['39', true], ['40', 'oruntu_kural'], ['43', 'oruntu_terim']],
      'Her sayı bir öncekinden 4 fazladır. İlk sayı 3 olduğuna göre 10. sayıya gelene kadar 9 kez 4 eklenir: 3 + 9 × 4 = 39.',
    ),

    /* ---------- Kesirler ---------- */
    q(
      'M5-09',
      'kesirler',
      '24 cevizin {3/8}’i kaç cevizdir?',
      [['3', 'kesir_cokluk'], ['8', 'kesir_cokluk'], ['9', true], ['15', 'soru_okuma']],
      '24’ün {1/8}’i 24 ÷ 8 = 3’tür. {3/8}’i bunun 3 katıdır: 3 × 3 = 9 ceviz.',
    ),
    q(
      'M5-10',
      'kesirler',
      'Aşağıdaki kesirlerden hangisi en büyüktür?',
      [['{1/3}', true], ['{1/5}'], ['{1/8}', 'kesir_buyukluk_payda'], ['{1/10}', 'kesir_buyukluk_payda']],
      'Payları aynı olan kesirlerde paydası küçük olan daha büyüktür: bir bütün 3 eşit parçaya bölündüğünde her parça, 10 eşit parçaya bölündüğündekinden büyük olur.',
    ),
    q(
      'M5-11',
      'kesirler',
      '{2/9} + {5/9} işleminin sonucu kaçtır?',
      [['{10/81}', 'kesir_islem'], ['{3/9}', 'islem_secimi'], ['{7/18}', 'kesir_toplama_payda'], ['{7/9}', true]],
      'Paydaları eşit kesirler toplanırken paylar toplanır, payda aynı kalır: 2 dokuzda bir ile 5 dokuzda bir, 7 dokuzda bir eder; yani {7/9}.',
    ),
    q(
      'M5-12',
      'kesirler',
      'Eşit büyüklükteki iki pizzanın her biri 4 eşit dilime bölünmüştür. Ayşe toplam 7 dilim yemiştir. Ayşe kaç pizza yemiştir?',
      [['{4/7}', 'kesir_pay_payda'], ['{3/4}'], ['{7/8}', 'kesir_butun'], ['{1 3/4}', true]],
      'Bir bütün (bir pizza) 4 dilimdir. 7 dilim = 4 dilim + 3 dilim, yani 1 bütün pizza ve {3/4} pizza: {1 3/4}. {7/8} yanlıştır, çünkü bütün 8 dilim değil, 4 dilimdir.',
    ),

    /* ---------- Geometri ve ölçme ---------- */
    q(
      'M5-13',
      'geometri',
      'Kısa kenarı 6 cm, uzun kenarı 9 cm olan bir dikdörtgenin çevresi kaç cm’dir?',
      [['15', 'cevre_kenar'], ['30', true], ['36'], ['54', 'alan_cevre']],
      'Çevre, bütün kenarların toplamıdır. Dikdörtgenin karşılıklı kenarları eşit olduğu için: 6 + 9 + 6 + 9 = 30 cm.',
    ),
    q(
      'M5-14',
      'geometri',
      '3 m 5 cm kaç santimetredir?',
      [['8', 'birim_donusum'], ['35', 'birim_donusum'], ['305', true], ['350', 'birim_donusum']],
      '1 m = 100 cm olduğundan 3 m = 300 cm’dir. 300 cm + 5 cm = 305 cm.',
    ),
    q(
      'M5-15',
      'geometri',
      'Bir film saat 14.45’te başlamış ve 1 saat 50 dakika sürmüştür. Film saat kaçta bitmiştir?',
      [['15.35', 'zaman_donusum'], ['15.95', 'zaman_donusum'], ['16.35', true], ['16.45']],
      '14.45’e önce 1 saat eklenir: 15.45. Sonra 50 dakika eklenir: 15 dakika sonra saat 16.00 olur, kalan 35 dakikayla 16.35. Bir saatin 60 dakika olduğunu unutmamak gerekir.',
    ),
    q(
      'M5-16',
      'geometri',
      'Saat tam 2.00’yi gösterirken akrep ile yelkovan arasındaki küçük açı hangi tür açıdır?',
      [['Dar açı', true], ['Dik açı', 'aci_turu'], ['Geniş açı', 'aci_turu'], ['Doğru açı', 'aci_turu']],
      'Saat 3.00’te akrep ile yelkovan dik açı yapar. Saat 2.00’de akrep 3’e varmamıştır; aradaki açı dik açıdan küçüktür. Dik açıdan küçük açılara dar açı denir.',
    ),

    /* ---------- Veri ---------- */
    q(
      'M5-17',
      'veri',
      'Grafiğe göre en sevdiği meyve çilek olan öğrencilerin sayısı, en sevdiği meyve muz olan öğrencilerin sayısından kaç fazladır?',
      [['2', 'grafik_okuma'], ['4', true], ['10', 'soru_okuma'], ['16', 'islem_secimi']],
      'Grafikte çilek 10, muz 6 öğrenci tarafından seçilmiştir: 10 − 6 = 4. Dikey eksendeki sayılar 2’şer arttığı için sütunları okurken çizgi saymak yerine eksendeki sayılara bakmak gerekir.',
      { chart: MEYVE },
    ),
    q(
      'M5-18',
      'veri',
      'Her öğrenci yalnızca bir meyve seçtiğine göre bu sınıfta kaç öğrenci vardır?',
      [['4', 'soru_okuma'], ['10'], ['14', 'grafik_okuma'], ['28', true]],
      'Sütunların gösterdiği sayılar toplanır: 8 + 6 + 4 + 10 = 28 öğrenci. 4 ise meyve türlerinin sayısıdır.',
      { chart: MEYVE },
    ),
    q(
      'M5-19',
      'veri',
      'Tabloya göre ziyaretçi sayısının 40’tan az olduğu kaç gün vardır?',
      [['1', true], ['2', 'en_az_en_cok'], ['3'], ['4']],
      '40’tan az olan tek sayı 38’dir (Perşembe). Salı günü tam 40 ziyaretçi gelmiştir; 40, 40’tan az değildir.',
      { table: KUTUPHANE },
    ),
    q(
      'M5-20',
      'veri',
      'Tabloya göre en çok ve en az ziyaretçi gelen günlerdeki ziyaretçi sayıları arasındaki fark kaçtır?',
      [['8'], ['20', 'tablo_okuma'], ['22', true], ['98', 'islem_secimi']],
      'En çok ziyaretçi Cuma (60), en az ziyaretçi Perşembe (38) günü gelmiştir. Fark: 60 − 38 = 22.',
      { table: KUTUPHANE },
    ),
  ],
};
