import type { QuizChart, QuizFigure, QuizForm } from '@/lib/instruments/types';
import { q } from './helpers';

/**
 * 6. sınıf formu: 5. sınıf konuları. Konular, Türkiye Yüzyılı Maarif Modeli 5. sınıf matematik
 * programının temalarına göre seçilmiştir (kesirlerle dört işlem bu programda 6. sınıftadır, bu
 * yüzden burada yalnızca kesirlerin gösterimi ve karşılaştırılması sorulur).
 */

const SPOR: QuizChart = {
  kind: 'pie',
  title: 'Öğrencilerin en sevdiği spor',
  labels: ['Futbol', 'Basketbol', 'Voleybol'],
  values: [12, 6, 6],
};

const IKI_CEMBER: QuizFigure = {
  kind: 'two-circles',
  alt: 'Eşit büyüklükte iki çember. Soldaki çemberin merkezi A, sağdakinin merkezi B’dir; her çember diğerinin merkezinden geçer. Çemberlerin kesiştiği iki noktadan üstteki C ile gösterilmiştir. A, B ve C noktaları birleştirilerek bir üçgen çizilmiştir.',
};

const FIDAN: QuizChart = {
  kind: 'bar',
  title: 'Bir fidanlıkta bir haftada satılan fidanlar',
  labels: ['Çam', 'Meşe', 'Çınar', 'Ihlamur'],
  values: [30, 15, 45, 25],
  yLabel: 'Fidan sayısı',
  step: 5,
  max: 50,
};

export const form6: QuizForm = {
  key: 'mat-6',
  grade: 6,
  contentGrade: 5,
  domains: [
    { key: 'sayilar', name: 'Doğal sayılar ve problemler', plain: 'Çok basamaklı sayılar, basamak değeri ve dört işlem gerektiren problemler.' },
    { key: 'cebir', name: 'İşlemler ve örüntüler', plain: 'İşlem önceliği, eşitliğin korunumu, işlem özellikleri ve örüntüler.' },
    { key: 'kesirler', name: 'Kesirler, ondalık gösterim ve yüzde', plain: 'Kesirlerin farklı gösterimleri, denk kesirler ve karşılaştırma.' },
    { key: 'geometri', name: 'Geometri ve ölçme', plain: 'Açılar, çember ve üçgen, dikdörtgenin çevresi ve alanı.' },
    { key: 'veri', name: 'Veri ve olasılık', plain: 'Daire ve sütun grafikleri, olasılığın 0 ile 1 arasında olması.' },
  ],
  items: [
    /* ---------- Doğal sayılar ve problemler ---------- */
    q(
      'M6-01',
      'sayilar',
      '“Yetmiş iki milyon dört yüz beş bin altmış” sayısının rakamlarla yazılışı hangisidir?',
      [['7 240 560', 'basamak_degeri'], ['72 405 060', true], ['72 405 600', 'basamak_degeri'], ['72 450 060', 'basamak_degeri']],
      'Sayı bölüklerine ayrılarak yazılır: milyonlar bölüğü 72, binler bölüğü 405, birler bölüğü 060. Her bölük üç basamaklıdır; “altmış” birler bölüğünde 060 olarak yazılır: 72 405 060.',
    ),
    q(
      'M6-02',
      'sayilar',
      '3 × 1 000 000 + 5 × 10 000 + 8 × 100 + 4 biçiminde çözümlenmiş sayı hangisidir?',
      [['3584', 'basamak_degeri'], ['305 084', 'basamak_degeri'], ['3 050 804', true], ['3 500 804', 'basamak_degeri']],
      'Sayıda 3 milyon, 5 on bin, 8 yüz ve 4 bir vardır. Yüz binler, binler ve onlar basamaklarında rakam olmadığı için bu basamaklara 0 yazılır: 3 050 804.',
    ),
    q(
      'M6-03',
      'sayilar',
      'Bir okul, 18 sınıfın her birine 32’şer kitap, kütüphanesine ise ayrıca 240 kitap alacaktır. Kitapların tanesi 45 TL olduğuna göre okul toplam kaç TL ödeyecektir?',
      [['816', 'soru_okuma'], ['11 376', 'islem_onceligi'], ['25 920', 'soru_okuma'], ['36 720', true]],
      'Önce toplam kitap sayısı bulunur: 18 × 32 = 576 ve 576 + 240 = 816 kitap. Sonra bu sayı fiyatla çarpılır: 816 × 45 = 36 720 TL.',
    ),
    q(
      'M6-04',
      'sayilar',
      '1000 sayfalık bir kitabın her gün 35 sayfasını okuyan Elif, kitabı en az kaç günde bitirir?',
      [['20', 'kalan_yorum'], ['28', 'kalan_yorum'], ['29', true], ['30']],
      '1000 ÷ 35 = 28, kalan 20. 28 günde 980 sayfa okunur; kalan 20 sayfa için bir gün daha gerekir: 29 gün.',
    ),

    /* ---------- İşlemler ve örüntüler ---------- */
    q(
      'M6-05',
      'cebir',
      '40 − 4 × 6 + 8 ÷ 2 işleminin sonucu kaçtır?',
      [['12', 'islem_onceligi'], ['20', true], ['24', 'islem_onceligi'], ['112', 'islem_onceligi']],
      'Önce çarpma ve bölme yapılır: 4 × 6 = 24 ve 8 ÷ 2 = 4. Sonra toplama ve çıkarma soldan sağa yapılır: 40 − 24 + 4 = 20.',
    ),
    q(
      'M6-06',
      'cebir',
      '36 + 47 = 40 + □ eşitliğinde □ yerine hangi sayı gelmelidir?',
      [['43', true], ['51'], ['83', 'esitlik_anlami'], ['123', 'esitlik_anlami']],
      'Sol taraf 36 + 47 = 83’tür; sağ taraf da 83 olmalıdır: 40 + 43 = 83. Kısa yol: 36, 4 artırılıp 40 yapıldığında toplamın değişmemesi için 47’nin 4 azaltılması gerekir.',
    ),
    q(
      'M6-07',
      'cebir',
      '7 × 98 işlemini zihinden kolayca yapmak için aşağıdakilerden hangisi kullanılabilir?',
      [['7 × 100 − 7 × 2', true], ['7 × 100 − 2', 'dagilma'], ['7 × 100 + 7 × 2', 'dagilma'], ['7 × 90 + 8', 'dagilma']],
      '98 = 100 − 2 olduğundan 7 × 98 = 7 × (100 − 2) = 7 × 100 − 7 × 2 = 700 − 14 = 686. Dağılma özelliğinde parantezin içindeki her sayı 7 ile çarpılır.',
    ),
    q(
      'M6-08',
      'cebir',
      'Kibrit çöpleriyle oluşturulan bir şekil örüntüsünde 1. adımda 4, 2. adımda 7, 3. adımda 10 çöp kullanılmıştır. Örüntü aynı kuralla devam ederse 20. adımda kaç çöp kullanılır?',
      [['60', 'oruntu_kural'], ['61', true], ['64', 'oruntu_terim'], ['80', 'oruntu_kural']],
      'Her adımda 3 çöp eklenir. 1. adımda 4 çöp olduğuna göre 20. adıma kadar 19 kez 3 çöp eklenir: 4 + 19 × 3 = 61. Kural olarak da yazılabilir: adım sayısının 3 katının 1 fazlası (3 × 20 + 1 = 61).',
    ),

    /* ---------- Kesirler, ondalık gösterim ve yüzde ---------- */
    q(
      'M6-09',
      'kesirler',
      'Aşağıdaki kesirlerden hangisi {3/5} kesrine denktir?',
      [['{12/20}', true], ['{6/8}', 'genisletme'], ['{9/10}', 'genisletme'], ['{5/3}', 'kesir_pay_payda']],
      'Bir kesrin payı ve paydası aynı sayıyla çarpılırsa denk kesir elde edilir: pay ve payda 4 ile çarpılınca {3/5} = {12/20} olur. {6/8}’de paya ve paydaya aynı sayı eklenmiştir; toplama denk kesir vermez.',
    ),
    q(
      'M6-10',
      'kesirler',
      'Aşağıdaki sayılardan hangisi en büyüktür?',
      [['0,09'], ['0,125', 'ondalik_uzunluk'], ['0,65', 'ondalik_uzunluk'], ['0,7', true]],
      'Ondalık gösterimler basamak basamak karşılaştırılır. Onda birler basamağında en büyük rakam 7’dir: 0,7 = 0,700 > 0,650 > 0,125. Virgülden sonra çok basamak olması sayıyı büyük yapmaz: 0,125’te üç basamak olsa da onda birler basamağı yalnızca 1’dir.',
    ),
    q(
      'M6-11',
      'kesirler',
      '25 kişilik bir sınıfta 8 öğrenci gözlük takmaktadır. Gözlük takan öğrenciler sınıfın yüzde kaçıdır?',
      [['%8', 'yuzde_anlami'], ['%17', 'yuzde_anlami'], ['%25', 'yuzde_anlami'], ['%32', true]],
      'Gözlüklü öğrenciler sınıfın {8/25}’idir. Paydayı 100 yapmak için pay ve payda 4 ile çarpılır: {8/25} = {32/100}, yani %32.',
    ),
    q(
      'M6-12',
      'kesirler',
      '0,6 sayısı aşağıdaki kesirlerden hangisine eşittir?',
      [['{6/100}', 'ondalik_kesir'], ['{1/6}', 'ondalik_kesir'], ['{3/5}', true], ['{2/3}']],
      '0,6 “onda altı” demektir: {6/10}. Pay ve payda 2’ye bölünerek sadeleştirilirse {3/5} elde edilir. {6/100} ise 0,06’dır; {1/6} yaklaşık 0,17’dir.',
    ),

    /* ---------- Geometri ve ölçme ---------- */
    q(
      'M6-13',
      'geometri',
      'İki doğru bir noktada kesişiyor ve dört açı oluşuyor. Bu açılardan biri 65°’dir. Bu açının hemen yanındaki açı kaç derecedir?',
      [['25°', 'tumler_butunler'], ['65°', 'kesisen_dogrular'], ['90°', 'kesisen_dogrular'], ['115°', true]],
      'Yan yana duran iki açı birlikte düz bir çizgi oluşturur; toplamları 180°’dir: 180° − 65° = 115°. 65° ise bu açının tam karşısındaki açıdır.',
    ),
    q(
      'M6-14',
      'geometri',
      'Çevresi 30 cm olan bir dikdörtgenin uzun kenarı 9 cm’dir. Bu dikdörtgenin alanı kaç cm²’dir?',
      [['54', true], ['108', 'cevre_kenar'], ['189', 'cevre_kenar'], ['270', 'alan_cevre']],
      'Çevre 30 cm ise bir uzun ve bir kısa kenarın toplamı 15 cm’dir (çevrenin yarısı). Kısa kenar 15 − 9 = 6 cm olur. Alan: 9 × 6 = 54 cm².',
    ),
    q(
      'M6-15',
      'geometri',
      'Merkezleri A ve B, yarıçapları 4 cm olan iki çember, her biri diğerinin merkezinden geçecek biçimde çizilmiştir. Çemberlerin kesişim noktalarından biri C’dir. ABC üçgeninin çevresi kaç cm’dir?',
      [['8', 'cevre_kenar'], ['12', true], ['16', 'cap_yaricap'], ['24', 'cap_yaricap']],
      'B noktası A merkezli çemberin üzerinde olduğu için AB bir yarıçaptır: 4 cm. C noktası iki çemberin de üzerindedir; bu yüzden AC ve BC de yarıçaptır. Üç kenar da 4 cm’dir (eşkenar üçgen); çevre 12 cm’dir.',
      { figure: IKI_CEMBER },
    ),
    q(
      'M6-16',
      'geometri',
      'Kenar uzunlukları santimetre cinsinden birer doğal sayı olan ve alanı 36 cm² olan bütün dikdörtgenler düşünülüyor. Bunlardan çevresi en uzun olanın çevresi kaç cm’dir?',
      [['24', 'en_az_en_cok'], ['40'], ['74', true], ['144', 'alan_cevre']],
      'Alanı 36 cm² olan dikdörtgenler: 1 × 36, 2 × 18, 3 × 12, 4 × 9 ve 6 × 6. Kenarlar birbirinden ne kadar farklıysa çevre o kadar uzun olur. En uzun çevre 1 cm’ye 36 cm’lik dikdörtgenindir: 2 × (1 + 36) = 74 cm.',
    ),

    /* ---------- Veri ve olasılık ---------- */
    q(
      'M6-17',
      'veri',
      'Bir sınıftaki 24 öğrencinin en sevdiği spor daire grafiğinde gösterilmiştir. Futbol dilimi dairenin yarısını, basketbol dilimi dörtte birini kaplamaktadır. Geriye kalan dilim voleybolu gösterdiğine göre, en sevdiği spor voleybol olan kaç öğrenci vardır?',
      [['6', true], ['8', 'daire_grafik'], ['12'], ['18', 'soru_okuma']],
      'Futbol yarım, basketbol çeyrek daire olduğuna göre voleybola çeyrek daire kalır. 24 öğrencinin dörtte biri: 24 ÷ 4 = 6 öğrenci.',
      { chart: SPOR },
    ),
    q(
      'M6-18',
      'veri',
      'Grafiğe göre çınar fidanı, meşe fidanından kaç tane fazla satılmıştır?',
      [['3', 'islem_secimi'], ['6', 'grafik_okuma'], ['30', true], ['60', 'islem_secimi']],
      'Grafikte çınar 45, meşe 15 fidandır: 45 − 15 = 30. Dikey eksendeki her çizgi 5 fidanı gösterir; çizgi saymak yerine eksendeki sayılara bakmak gerekir.',
      { chart: FIDAN },
    ),
    q(
      'M6-19',
      'veri',
      'Bir torbada 5 kırmızı, 3 mavi ve 1 yeşil bilye vardır. Torbadan bakmadan bir bilye çekiliyor. Aşağıdakilerden hangisi doğrudur?',
      [
        ['Her rengin çekilme olasılığı eşittir.', 'olasilik_esit'],
        ['Kırmızı bilye çekme olasılığı, mavi bilye çekme olasılığından fazladır.', true],
        ['Yeşil bilye çekmek imkânsızdır.', 'olasilik_spektrum'],
        ['Sarı bilye çekme olasılığı 1’dir.', 'olasilik_spektrum'],
      ],
      'Torbada kırmızı bilye maviden çok olduğu için kırmızı çekme olasılığı daha fazladır. Yeşil bilye az ama vardır; çekilmesi imkânsız değil, az olasıdır. Torbada sarı bilye olmadığı için sarı çekme olasılığı 0’dır.',
    ),
    q(
      'M6-20',
      'veri',
      'Yüzlerinde 1’den 6’ya kadar sayılar bulunan bir zar ve bir madenî para var. Aşağıdaki olaylardan hangisinin olasılığı 1’dir, yani kesindir?',
      [
        ['Zar atıldığında 7 gelmesi', 'olasilik_spektrum'],
        ['Para atıldığında yazı gelmesi', 'olasilik_spektrum'],
        ['Zar atıldığında çift sayı gelmesi', 'olasilik_spektrum'],
        ['Zar atıldığında 6 ya da 6’dan küçük bir sayı gelmesi', true],
      ],
      'Zardaki en büyük sayı 6’dır; gelen sayı her zaman 6 ya da 6’dan küçüktür. Bu olay kesindir, olasılığı 1’dir. Zarda 7 olmadığı için 7 gelmesi imkânsızdır (olasılığı 0). Yazı gelmesi ya da çift sayı gelmesi olasıdır ama kesin değildir.',
    ),
  ],
};
