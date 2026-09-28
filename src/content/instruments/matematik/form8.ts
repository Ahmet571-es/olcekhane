import type { QuizChart, QuizForm, QuizFigure } from '@/lib/instruments/types';
import { q } from './helpers';

/**
 * 8. sınıf formu: 7. sınıf konuları. 7. sınıf programı 2026–2027’den itibaren Türkiye Yüzyılı Maarif
 * Modeli’ne geçtiği için yalnızca iki programda da 7. sınıf sonuna kadar işlenen konular seçilmiştir
 * (ters orantı, olasılık ve dönüşüm geometrisi bu yüzden sorulmaz).
 */

const KOSU: QuizChart = {
  kind: 'line',
  title: 'Ali’nin haftalık koşu mesafesi',
  labels: ['1. hafta', '2. hafta', '3. hafta', '4. hafta', '5. hafta', '6. hafta'],
  values: [4, 9, 12, 15, 17, 19],
  yLabel: 'Mesafe (km)',
  step: 5,
  max: 20,
  showValues: true,
};

const PARALEL: QuizFigure = {
  kind: 'parallel',
  slope: 72,
  marks: [
    { at: 'top', region: 'above-right', label: '72°' },
    { at: 'bottom', region: 'above-left', label: 'x' },
  ],
  alt: 'Birbirine paralel, yatay d₁ ve d₂ doğruları ile ikisini de kesen eğik bir doğru. Kesen doğru soldan sağa doğru yükselir. Üstteki d₁ doğrusuyla kesiştiği noktada, d₁’in üstünde ve kesenin sağında kalan açı 72° olarak işaretlidir. Alttaki d₂ doğrusuyla kesiştiği noktada, d₂’nin üstünde ve kesenin solunda kalan açı x ile gösterilmiştir.',
};

export const form8: QuizForm = {
  key: 'mat-8',
  grade: 8,
  contentGrade: 7,
  domains: [
    { key: 'sayilar', name: 'Tam sayılar ve rasyonel sayılar', plain: 'Negatif sayıları sıralama, tam sayılar ve rasyonel sayılarla işlemler.' },
    { key: 'oran', name: 'Oran, orantı ve yüzdeler', plain: 'Oran, doğru orantı, yüzde hesapları ve art arda yapılan yüzde değişimleri.' },
    { key: 'cebir', name: 'Cebirsel ifadeler ve denklemler', plain: 'Cebirsel ifadeleri sadeleştirme, birinci dereceden denklemler ve problemler.' },
    { key: 'geometri', name: 'Geometri ve ölçme', plain: 'Dairenin alanı, çemberin uzunluğu, paralel doğrularda açılar ve prizmanın hacmi.' },
    { key: 'veri', name: 'Veri analizi', plain: 'Aritmetik ortalama, çizgi grafiği ve merkezî eğilim ölçüleri.' },
  ],
  items: [
    /* ---------- Tam sayılar ve rasyonel sayılar ---------- */
    q(
      'M8-01',
      'sayilar',
      'Aşağıdaki sayılardan hangisi en küçüktür?',
      [['−0,8', true], ['−0,75', 'ondalik_uzunluk'], ['−{1/2}', 'negatif_siralama'], ['0,1', 'negatif_siralama']],
      'Negatif sayılarda sıfırdan uzaklaştıkça sayı küçülür. −0,8 = −0,80; bu sayı sıfıra −0,75’ten ve −{1/2} = −0,50’den daha uzaktır. Bu yüzden en küçük sayı −0,8’dir.',
    ),
    q(
      'M8-02',
      'sayilar',
      'Sabah sıcaklığı −4 °C olan bir kentte hava öğlene kadar 9 °C ısınmış, akşam ise öğlene göre 7 °C soğumuştur. Akşam sıcaklığı kaç °C’dir?',
      [['−2', true], ['2', 'negatif_isaret'], ['6', 'negatif_isaret'], ['20', 'negatif_isaret']],
      'Öğlen sıcaklığı: −4 + 9 = 5 °C. Akşam sıcaklığı: 5 − 7 = −2 °C.',
    ),
    q(
      'M8-03',
      'sayilar',
      '−{1/2} + {3/4} işleminin sonucu kaçtır?',
      [['−{5/4}', 'negatif_isaret'], ['−{1/4}', 'negatif_isaret'], ['{1/4}', true], ['{2/6}', 'kesir_toplama_payda']],
      'Paydalar eşitlenir: −{1/2} = −{2/4}. Sonra −{2/4} + {3/4} = {1/4}. Sayı doğrusunda −{2/4}’ten başlayıp {3/4} birim sağa gidildiğinde {1/4}’e varılır.',
    ),
    q(
      'M8-04',
      'sayilar',
      '(−24) ÷ (−6) × (−2) işleminin sonucu kaçtır?',
      [['−8', true], ['−2', 'islem_onceligi'], ['2', 'islem_onceligi'], ['8', 'negatif_isaret']],
      'Bölme ve çarpma aynı önceliktedir; soldan sağa yapılır. (−24) ÷ (−6) = 4 (iki negatif sayının bölümü pozitiftir). Sonra 4 × (−2) = −8.',
    ),

    /* ---------- Oran, orantı ve yüzdeler ---------- */
    q(
      'M8-05',
      'oran',
      'Bir sınıfta kız öğrencilerin sayısının erkek öğrencilerin sayısına oranı {3/4}’tür. Sınıfta 28 öğrenci olduğuna göre kaç kız öğrenci vardır?',
      [['7'], ['12', true], ['16', 'soru_okuma'], ['21', 'oran_parca_butun']],
      'Oran {3/4} ise her 3 kıza karşılık 4 erkek vardır; sınıf 7 kişilik gruplardan oluşur. 28 ÷ 7 = 4 grup vardır; kız sayısı 3 × 4 = 12’dir. 28’in {3/4}’ünü almak yanlıştır, çünkü {3/4} kızların sınıfa değil, erkeklere oranıdır.',
    ),
    q(
      'M8-06',
      'oran',
      '3 kg elma 96 TL ise aynı elmadan 5 kg kaç TL’dir?',
      [['57,6', 'oran_ters'], ['98', 'oran_toplamsal'], ['160', true], ['480']],
      'Önce 1 kg’ın fiyatı bulunur: 96 ÷ 3 = 32 TL. 5 kg’ın fiyatı: 32 × 5 = 160 TL. Miktar kaç katına çıkarsa fiyat da o kadar katına çıkar (doğru orantı).',
    ),
    q(
      'M8-07',
      'oran',
      'Fiyatı 200 TL olan bir ürüne önce %20 zam, ardından yeni fiyat üzerinden %20 indirim yapılıyor. Ürünün son fiyatı kaç TL’dir?',
      [['160', 'soru_okuma'], ['192', true], ['200', 'yuzde_taban'], ['220', 'yuzde_anlami']],
      'Zamdan sonra fiyat 200 + 40 = 240 TL olur (200’ün %20’si 40’tır). İndirim yeni fiyat üzerinden yapılır: 240’ın %20’si 48 TL’dir; son fiyat 240 − 48 = 192 TL. Zam ve indirim farklı tutarlar üzerinden hesaplandığı için birbirini götürmez.',
    ),
    q(
      'M8-08',
      'oran',
      'Bir okuldaki öğrencilerin %35’i okula servisle gelmektedir. Servisle gelen öğrenci sayısı 140 olduğuna göre okulda kaç öğrenci vardır?',
      [['49', 'yuzde_taban'], ['175', 'yuzde_anlami'], ['189', 'yuzde_taban'], ['400', true]],
      'Okuldaki öğrencilerin %35’i 140 kişidir. Buna göre %5’i 140 ÷ 7 = 20 kişi, %100’ü 20 × 20 = 400 kişidir. 140’ın %35’ini almak yanlıştır; 140 bütün değil, bütünün bir parçasıdır.',
    ),

    /* ---------- Cebirsel ifadeler ve denklemler ---------- */
    q(
      'M8-09',
      'cebir',
      '3(2x − 4) − (x − 5) ifadesinin en sade biçimi hangisidir?',
      [['5x − 17', 'negatif_isaret'], ['5x − 9', 'dagilma'], ['5x − 7', true], ['5x + 1', 'dagilma']],
      'Parantezler açılır: 3(2x − 4) = 6x − 12 ve −(x − 5) = −x + 5. Sonra benzer terimler toplanır: 6x − 12 − x + 5 = 5x − 7. Parantezin önündeki eksi, içerideki her terimin işaretini değiştirir.',
    ),
    q(
      'M8-10',
      'cebir',
      'Kenar uzunlukları (2x + 1) cm ve (x − 3) cm olan bir dikdörtgenin çevresini gösteren ifade hangisidir?',
      [['3x − 2', 'cevre_kenar'], ['6x − 4', true], ['6x − 2', 'dagilma'], ['6x + 8', 'negatif_isaret']],
      'Dikdörtgenin çevresi, farklı iki kenarın toplamının 2 katıdır: 2 × [(2x + 1) + (x − 3)] = 2 × (3x − 2) = 6x − 4.',
    ),
    q(
      'M8-11',
      'cebir',
      '5x − 7 = 2x + 8 denkleminin çözümü kaçtır?',
      [['{1/3}', 'denklem_ters_islem'], ['{15/7}', 'denklem_ters_islem'], ['5', true], ['12', 'denklem_ters_islem']],
      'x’li terimler bir tarafta, sayılar öbür tarafta toplanır: 5x − 2x = 8 + 7, yani 3x = 15 ve x = 5. Bir terim eşitliğin öbür tarafına geçerken işareti değişir (−7, +7 olur). Kontrol: 5 × 5 − 7 = 18 ve 2 × 5 + 8 = 18.',
    ),
    q(
      'M8-12',
      'cebir',
      'Bir kırtasiyede bir defter, bir kalemden 3 TL pahalıdır. 4 defter ile 2 kalemin toplam fiyatı 72 TL olduğuna göre bir kalem kaç TL’dir?',
      [['10', true], ['11,5', 'dagilma'], ['12', 'sozel_cebir'], ['13', 'soru_okuma']],
      'Kalemin fiyatına x dersek defterin fiyatı x + 3 olur. 4(x + 3) + 2x = 72 → 4x + 12 + 2x = 72 → 6x = 60 → x = 10 TL. 13 TL ise defterin fiyatıdır.',
    ),

    /* ---------- Geometri ve ölçme ---------- */
    q(
      'M8-13',
      'geometri',
      'Yarıçapı 6 cm olan bir dairenin alanı kaç cm²’dir? (π yerine 3 alınız.)',
      [['18'], ['36', 'alan_cevre'], ['72', 'cap_yaricap'], ['108', true]],
      'Dairenin alanı π × r × r ile bulunur: 3 × 6 × 6 = 108 cm². 36 ise çemberin uzunluğudur (2 × 3 × 6 = 36 cm).',
    ),
    q(
      'M8-14',
      'geometri',
      'Şekilde d₁ ve d₂ doğruları birbirine paraleldir. Buna göre x kaç derecedir?',
      [['18°', 'tumler_butunler'], ['72°', 'paralel_aci'], ['108°', true], ['288°', 'kesisen_dogrular']],
      'Paralel iki doğruyu kesen bir doğrunun oluşturduğu açılar ya eşittir ya da toplamları 180°’dir. Üstteki 72°’lik açı, alttaki kesişimde aynı konumda (d₂’nin üstünde, kesenin sağında) da 72°’dir. x bu açının yanındaki açıdır; ikisi birlikte düz bir açı oluşturur: x = 180° − 72° = 108°.',
      { figure: PARALEL },
    ),
    q(
      'M8-15',
      'geometri',
      'Ayrıt uzunlukları 5 cm, 4 cm ve 3 cm olan dikdörtgenler prizması biçimindeki bir kutunun hacmi kaç cm³’tür?',
      [['12', 'hacim_alan'], ['20', 'hacim_formul'], ['47', 'hacim_alan'], ['60', true]],
      'Dikdörtgenler prizmasının hacmi üç ayrıt uzunluğunun çarpımıdır: 5 × 4 × 3 = 60 cm³. Taban alanı (5 × 4 = 20) yalnızca bir katmandaki birim küplerin sayısını verir; 3 kat olduğu için 3 ile de çarpılır.',
    ),
    q(
      'M8-16',
      'geometri',
      'Yarıçapı 14 m olan daire biçimindeki bir havuzun çevresine bir tur tel çekilecektir. Kaç metre tel gerekir? (π yerine {22/7} alınız.)',
      [['44', 'cap_yaricap'], ['88', true], ['176', 'cap_yaricap'], ['616', 'alan_cevre']],
      'Çemberin uzunluğu 2 × π × r ile bulunur: 2 × {22/7} × 14 = 88 m. 616 ise havuzun alanıdır (π × 14 × 14 = 616 m²).',
    ),

    /* ---------- Veri analizi ---------- */
    q(
      'M8-17',
      'veri',
      'Beş sayının aritmetik ortalaması 14’tür. Bu sayılardan dördü 10, 12, 15 ve 18 olduğuna göre beşinci sayı kaçtır?',
      [['11', 'ortalama_anlami'], ['13,75', 'ortalama_anlami'], ['14', 'ortalama_anlami'], ['15', true]],
      'Ortalama 14 ve 5 sayı varsa sayıların toplamı 14 × 5 = 70’tir. Dört sayının toplamı 10 + 12 + 15 + 18 = 55’tir. Beşinci sayı: 70 − 55 = 15.',
    ),
    q(
      'M8-18',
      'veri',
      '10 kişilik bir grubun yaş ortalaması 12’dir. Gruba 23 yaşında bir kişi katılırsa grubun yeni yaş ortalaması kaç olur?',
      [['12', 'ortalama_anlami'], ['13', true], ['14,3', 'ortalama_toplam'], ['17,5', 'ortalama_anlami']],
      'Grubun yaşları toplamı 10 × 12 = 120’dir. Yeni kişiyle toplam 120 + 23 = 143, kişi sayısı 11 olur. Yeni ortalama: 143 ÷ 11 = 13. (12 + 23) ÷ 2 = 17,5 yanlıştır; 12 tek bir kişinin değil, 10 kişinin ortalamasıdır.',
    ),
    q(
      'M8-19',
      'veri',
      'Grafiğe göre Ali’nin koştuğu mesafe, art arda gelen hangi iki hafta arasında en çok artmıştır?',
      [['1. ve 2. haftalar', true], ['2. ve 3. haftalar'], ['4. ve 5. haftalar'], ['5. ve 6. haftalar', 'degisim_deger']],
      'Artış, art arda iki haftanın farkıdır ve grafikte en dik yükselen parçada görülür. 1. haftadan 2. haftaya mesafe 4 km’den 9 km’ye, yani 5 km artmıştır; bu en büyük artıştır. 6. hafta en uzun koşudur ama 5. haftadan 6. haftaya artış yalnızca 2 km’dir.',
      { chart: KOSU },
    ),
    q(
      'M8-20',
      'veri',
      '4, 6, 6, 7 ve 8 verilerinden oluşan gruba 20 değeri ekleniyor. Aşağıdakilerden hangisi değişmez?',
      [['Aritmetik ortalama', 'ortalama_anlami'], ['Ortanca', 'ortanca_cift'], ['En büyük değer'], ['Tepe değer', true]],
      'Yeni veriler 4, 6, 6, 7, 8 ve 20’dir. En çok tekrar eden değer yine 6’dır; tepe değer değişmez. Ortalama 6,2’den 8,5’e, ortanca 6’dan 6,5’e çıkar; en büyük değer de 8’den 20’ye çıkar.',
    ),
  ],
};
