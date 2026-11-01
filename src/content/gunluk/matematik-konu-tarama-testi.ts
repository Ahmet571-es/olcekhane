import type { SkillsDaily } from './types';

/**
 * Matematik Konu Tarama Testi: konu alanları günlük hayatta nerede kullanılır (5–8. sınıf; yetişkinlere açık değil).
 * Her öğrenci sınıfının formunu çözer (mat-5 … mat-8; her formda beş konu alanı). Bir alanın içeriği formdan forma
 * değişiyorsa (ör. "sayilar" 5. sınıf formunda doğal sayılar, 7.'de çarpanlar ve katlar, 8.'de tam sayılar ve rasyonel
 * sayılar; geometride her formun konuları başka) her içerik için ayrı bir kart vardır (`forms`); kartın başlığı formdaki alanın
 * adıdır. Her örnek, gösterildiği formun konu tanımındaki (`plain`, src/content/instruments/matematik/form*.ts) bir konunun
 * doğru bir örneğidir ve sayıları elle denetlendi: 6 ile 8'in ortak katı 24; 3x + 20 = toplam (bir bilinmeyenli denklem);
 * bisiklet tekerleğinin bir turu çemberin uzunluğudur; para atma deneyinde sayılan oran deneysel olasılıktır. Hiçbir örnek
 * misconceptions.ts'teki bir yanılgıyı beslemez (tek bir zarda bütün sayılar eşit olasılıklıdır: zar örneği kullanılmaz;
 * torbadaki renklerin sayısı farklı olduğu için hangi rengin daha olası olduğu sorulabilir).
 * Kaynak: formların alan tanımları ve yol haritasındaki gündelik örnekler (src/content/roadmaps/matematik.ts: alışverişte
 * tahmin, ortak kat sorusu, hava durumu, tarifler, indirim etiketleri, birim fiyat, harita ölçeği, "Aklımdan bir sayı
 * tuttum", ölçme ve saat, uyku saatleri).
 */
export const matematikDaily: SkillsDaily = {
  kind: 'skills',
  version: 'matematik-gunluk-1',
  skills: [
    {
      key: 'sayilar',
      forms: ['mat-5', 'mat-6'],
      short: 'Doğal sayılar',
      text: 'Bu alan, büyük sayıları okumak, karşılaştırmak ve bir sonucu önceden tahmin etmek gereken işlerde kullanılır.',
      branches: { school: 'Sayıları karşılaştırmak', friends: 'Puanları toplamak', home: 'Alışverişte tahmin' },
      student: {
        school: 'Bir haberdeki büyük bir sayıyı okuyup karşılaştırmak bu tür bir iştir.',
        friends: 'Bir oyunda puanları toplamak ya da kimin önde olduğunu bulmak da sayılarla çalışmaktır.',
        home: 'Alışverişte toplam tutarı önce tahmin etmek, sonra hesaplamak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir haberdeki büyük bir sayıyı okuyup karşılaştırması bu tür bir iştir.',
        friends: 'Bir oyunda puanları toplamak ya da kimin önde olduğunu bulmak da sayılarla çalışmaktır.',
        home: 'Alışverişte toplam tutarı önce tahmin etmek, sonra hesaplamak bu alanı kullanır.',
      },
    },
    {
      key: 'sayilar',
      forms: ['mat-7'],
      short: 'Çarpan ve katlar',
      text: 'Bu alan, bir şeyi eşit gruplara ayırmak ya da iki olayın ne zaman aynı güne denk geleceğini bulmak gibi işlerde kullanılır.',
      branches: { school: 'Eşit gruplar kurmak', friends: 'Ortak gün bulmak', home: 'Artansız paylaştırmak' },
      student: {
        school: 'Bir sınıfı artan kalmadan eşit gruplara ayırmak bölünebilmeyi kullanır.',
        friends: 'Biri 6, öteki 8 günde bir gelen iki arkadaşın buluşma gününü bulmak ortak kat sorusudur.',
        home: 'Bir paket kurabiyeyi evdekilere artan kalmadan paylaştırmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun bir sınıfı artan kalmadan eşit gruplara ayırması bölünebilmeyi kullanır.',
        friends: 'Biri 6, öteki 8 günde bir gelen iki arkadaşın buluşma gününü bulmak ortak kat sorusudur.',
        home: 'Bir paket kurabiyeyi evdekilere artan kalmadan paylaştırmak bu tür bir iştir.',
      },
    },
    {
      key: 'sayilar',
      forms: ['mat-8'],
      short: 'Tam ve rasyonel',
      text: 'Bu alan, sıfırın altına inen ölçümleri okumak, negatif ve kesirli sayılarla hesap yapmak gereken işlerde kullanılır.',
      branches: { school: 'Sıcaklık farkı', friends: 'Eksi puanlar', home: 'Zemin altındaki katlar' },
      student: {
        school: 'Fen dersinde eksi derecelerle iki sıcaklık arasındaki farkı bulmak tam sayılarla işlemdir.',
        friends: 'Bir oyunda eksi puanları da sayarak toplamı bulmak negatif sayılarla hesap yapmaktır.',
        home: 'Bir binada zemin katın altındaki katları eksi sayılarla göstermek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun fen dersinde eksi derecelerle iki sıcaklık arasındaki farkı bulması tam sayılarla işlemdir.',
        friends: 'Bir oyunda eksi puanları da sayarak toplamı bulmak negatif sayılarla hesap yapmaktır.',
        home: 'Bir binada zemin katın altındaki katları eksi sayılarla göstermek bu tür bir iştir.',
      },
    },
    {
      key: 'kesirler',
      forms: ['mat-5'],
      short: 'Kesirler',
      text: 'Bu alan, bir bütünü eş parçalara bölmek ve parçaları karşılaştırmak gereken işlerde kullanılır.',
      branches: { school: 'Kâğıdı eş bölmek', friends: 'Pastayı paylaşmak', home: 'Tarifte yarım ölçü' },
      student: {
        school: 'Bir kâğıdı katlayarak yarım ve çeyrek parçalar oluşturmak kesirleri kullanır.',
        friends: 'Bir pastayı arkadaşlarınla eşit dilimlere bölüp pastanın ne kadarının kaldığını kesirle söylemek bu tür işlerdir.',
        home: 'Bir tarifteki yarım bardak ya da çeyrek kaşık gibi ölçüleri anlamak kesirleri ister.',
      },
      parent: {
        school: 'Çocuğunuzun bir kâğıdı katlayarak yarım ve çeyrek parçalar oluşturması kesirleri kullanır.',
        friends: 'Bir pastayı arkadaşlarıyla eşit dilimlere bölüp pastanın ne kadarının kaldığını kesirle söylemek bu tür işlerdir.',
        home: 'Bir tarifteki yarım bardak ya da çeyrek kaşık gibi ölçüleri anlamak kesirleri ister.',
      },
    },
    {
      key: 'kesirler',
      forms: ['mat-6', 'mat-7'],
      short: 'Kesir ve yüzde',
      text: 'Bu alan, aynı miktarı kesir, ondalık sayı ya da yüzde olarak görmek gereken işlerde kullanılır.',
      branches: { school: 'Ondalık ölçümler', friends: 'Pastayı paylaşmak', home: 'İndirim etiketleri' },
      student: {
        school: 'Fen dersinde 1,5 litre gibi ondalık ölçümleri okumak ve karşılaştırmak bu tür işlerdir.',
        friends: 'Bir pastayı arkadaşlarınla paylaşırken her birine düşen parçayı kesirle söylemek de bu alanı kullanır.',
        home: 'Bir etiketteki %25 indirimin fiyattan ne kadar düşüreceğini bulmak yüzde hesabıdır.',
      },
      parent: {
        school: 'Çocuğunuzun fen dersinde 1,5 litre gibi ondalık ölçümleri okuması ve karşılaştırması bu tür işlerdir.',
        friends: 'Bir pastayı arkadaşlarıyla paylaşırken her birine düşen parçayı kesirle söylemek de bu alanı kullanır.',
        home: 'Bir etiketteki %25 indirimin fiyattan ne kadar düşüreceğini bulmak yüzde hesabıdır.',
      },
    },
    {
      key: 'oran',
      forms: ['mat-8'],
      short: 'Oran ve orantı',
      text: 'Bu alan, iki miktarın birlikte nasıl değiştiğini bulmak gereken işlerde kullanılır: fiyatlar, tarifler ve haritalar gibi.',
      branches: { school: 'Harita ölçeği', friends: 'Tarifi büyütmek', home: 'Birim fiyat' },
      student: {
        school: 'Haritada 1 santimetrenin kaç kilometre olduğunu kullanarak bir uzaklığı bulmak orantıdır.',
        friends: 'Arkadaşlarınla bir tarifi iki kişilikten altı kişiliğe büyütmek doğru orantı kullanır.',
        home: 'Markette iki paketin birim fiyatını karşılaştırıp hangisinin daha hesaplı olduğunu bulmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun haritada 1 santimetrenin kaç kilometre olduğunu kullanarak bir uzaklığı bulması orantıdır.',
        friends: 'Arkadaşlarıyla bir tarifi iki kişilikten altı kişiliğe büyütmek doğru orantı kullanır.',
        home: 'Markette iki paketin birim fiyatını karşılaştırıp hangisinin daha hesaplı olduğunu bulmak bu tür bir iştir.',
      },
    },
    {
      key: 'cebir',
      forms: ['mat-5', 'mat-6'],
      short: 'İşlem ve örüntü',
      text: 'Bu alan, bir problemde hangi işlemin gerektiğini seçmek ve bir sayı örüntüsünün kuralını bulmak gibi işlerde kullanılır.',
      branches: { school: 'Problem çözmek', friends: 'Puan örüntüsü', home: 'Büyümeyi tahmin' },
      student: {
        school: 'Bir problemde hangi işlemi neden seçtiğini adım adım yazmak bu tür bir iştir.',
        friends: 'Bir oyunda her turda toplamın 3 arttığını fark edip beşinci turdaki toplamı bulmak sayı örüntüsüdür.',
        home: 'Her hafta 2 santimetre uzayan bir fidanın ileriki boyunu bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir problemde hangi işlemi neden seçtiğini anlatması bu tür bir iştir.',
        friends: 'Bir oyunda her turda toplamın 3 arttığını fark edip beşinci turdaki toplamı bulmak sayı örüntüsüdür.',
        home: 'Her hafta 2 santimetre uzayan bir fidanın ileriki boyunu bulmak bu alanı kullanır.',
      },
    },
    {
      key: 'cebir',
      forms: ['mat-7', 'mat-8'],
      short: 'Cebir',
      text: 'Bu alan, bilinmeyen bir miktarı bir harfle gösterip bulmak gereken işlerde kullanılır.',
      branches: { school: 'Bilinmeyeni bulmak', friends: 'Sayı tutma oyunu', home: 'Alışveriş hesabı' },
      student: {
        school: 'Bilinmeyen bir sayıyı x ile gösterip bir denklemle bulmak bu tür bir iştir.',
        friends: '“Aklımdan bir sayı tuttum” oyununda tutulan sayıyı bulmak da bir denklem çözmektir.',
        home: 'Üç defter ile 20 liralık bir kalem için ödenen toplamdan bir defterin fiyatını bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bilinmeyen bir sayıyı x ile gösterip bulması bu tür bir iştir.',
        friends: '“Aklımdan bir sayı tuttum” oyununda tutulan sayıyı bulmak da bir denklem çözmektir.',
        home: 'Üç defter ile 20 liralık bir kalem için ödenen toplamdan bir defterin fiyatını bulmak bu alanı kullanır.',
      },
    },
    {
      // 5. sınıf: çevre, uzunluk ve zaman ölçme, açı türleri.
      key: 'geometri',
      forms: ['mat-5'],
      short: 'Ölçme ve açılar',
      text: 'Bu alan, uzunluk ve zaman ölçmek, çevre hesaplamak ve açıları tanımak gereken işlerde kullanılır.',
      branches: { school: 'Çerçevenin çevresi', friends: 'Oyunun süresi', home: 'Eşyayı ölçmek' },
      student: {
        school: 'Bir resim çerçevesinin kenarlarını cetvelle ölçüp çevresini hesaplamak bu tür bir iştir.',
        friends: 'Bir oyunun kaç dakika sürdüğünü saate bakarak bulmak zaman ölçmektir.',
        home: 'Bir kutunun rafa sığıp sığmayacağını ölçerek bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir resim çerçevesinin kenarlarını cetvelle ölçüp çevresini hesaplaması bu tür bir iştir.',
        friends: 'Bir oyunun kaç dakika sürdüğünü saate bakarak bulmak zaman ölçmektir.',
        home: 'Bir kutunun rafa sığıp sığmayacağını ölçerek bulmak bu alanı kullanır.',
      },
    },
    {
      // 6. sınıf: açılar, çember ve üçgen, dikdörtgenin çevresi ve alanı.
      key: 'geometri',
      forms: ['mat-6'],
      short: 'Açı, çevre, alan',
      text: 'Bu alan, açıları ölçmek ve bir dikdörtgenin çevresini ya da alanını bulmak gereken işlerde kullanılır.',
      branches: { school: 'Açıölçerle çizmek', friends: 'Oyun alanının çevresi', home: 'Örtünün alanı' },
      student: {
        school: 'Cetvel ve açıölçerle bir üçgen çizip açılarını ölçmek bu tür bir iştir.',
        friends: 'Bir oyun için yere dikdörtgen bir alan çizip etrafına ne kadar ip gerektiğini bulmak çevre hesabıdır.',
        home: 'Bir masayı kaplayacak örtünün ne kadar büyük olması gerektiğini bulmak alan hesabıdır.',
      },
      parent: {
        school: 'Çocuğunuzun cetvel ve açıölçerle bir üçgen çizip açılarını ölçmesi bu tür bir iştir.',
        friends: 'Bir oyun için yere dikdörtgen bir alan çizip etrafına ne kadar ip gerektiğini bulmak çevre hesabıdır.',
        home: 'Bir masayı kaplayacak örtünün ne kadar büyük olması gerektiğini bulmak alan hesabıdır.',
      },
    },
    {
      // 7. sınıf: üçgende açılar, paralelkenarın alanı, alan birimleri ve çemberin uzunluğu.
      key: 'geometri',
      forms: ['mat-7'],
      short: 'Açı, alan, çember',
      text: 'Bu alan, üçgenin açılarını, bir yüzeyin alanını ve bir çemberin uzunluğunu bulmak gereken işlerde kullanılır.',
      branches: { school: 'Üçgenin açıları', friends: 'Bisiklet tekerleği', home: 'Duvarın alanı' },
      student: {
        school: 'Bir üçgenin iki açısını bilip üçüncüsünü bulmak bu tür bir iştir.',
        friends: 'Bisiklet tekerleği bir tur döndüğünde ne kadar yol alındığını bulmak çemberin uzunluğunu kullanır.',
        home: 'Boyanacak bir duvarın alanını metrekare olarak bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir üçgenin iki açısını bilip üçüncüsünü bulması bu tür bir iştir.',
        friends: 'Bisiklet tekerleği bir tur döndüğünde ne kadar yol alındığını bulmak çemberin uzunluğunu kullanır.',
        home: 'Boyanacak bir duvarın alanını metrekare olarak bulmak bu alanı kullanır.',
      },
    },
    {
      // 8. sınıf: dairenin alanı, çemberin uzunluğu, paralel doğrularda açılar ve prizmanın hacmi.
      key: 'geometri',
      forms: ['mat-8'],
      short: 'Daire ve hacim',
      text: 'Bu alan, dairenin alanını, çemberin uzunluğunu, paralel doğrulardaki açıları ve bir prizmanın hacmini bulmak gereken işlerde kullanılır.',
      branches: { school: 'Paralel çizgiler', friends: 'Yuvarlak pist', home: 'Kutunun hacmi' },
      student: {
        school: 'Defterin paralel çizgilerini kesen bir doğrunun oluşturduğu açıları bulmak bu tür bir iştir.',
        friends: 'Yuvarlak bir koşu pistinin bir turunun kaç metre olduğunu bulmak çemberin uzunluğunu kullanır.',
        home: 'Bir süt kutusunun kaç litre aldığını ölçülerinden bulmak prizmanın hacmini kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun defterin paralel çizgilerini kesen bir doğrunun oluşturduğu açıları bulması bu tür bir iştir.',
        friends: 'Yuvarlak bir koşu pistinin bir turunun kaç metre olduğunu bulmak çemberin uzunluğunu kullanır.',
        home: 'Bir süt kutusunun kaç litre aldığını ölçülerinden bulmak prizmanın hacmini kullanır.',
      },
    },
    {
      // 5. sınıf: sütun grafiği ve tablo okuma, verilerden sonuç çıkarma.
      key: 'veri',
      forms: ['mat-5'],
      short: 'Veri',
      text: 'Bu alan, tablo ve grafik okuyup onlardan sonuç çıkarmak gereken işlerde kullanılır.',
      branches: { school: 'Tablo okumak', friends: 'Küçük bir anket', home: 'Hava durumu' },
      student: {
        school: 'Bir deneyin sonuçlarını tabloya yazıp en büyük değeri bulmak bu tür bir iştir.',
        friends: 'Arkadaşlarına en sevdikleri oyunu sorup sonuçları bir sütun grafiğine dökmek de veriyle çalışmaktır.',
        home: 'Hava durumundaki sıcaklıkları karşılaştırıp en sıcak günü bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir deneyin sonuçlarını tabloya yazıp en büyük değeri bulması bu tür bir iştir.',
        friends: 'Arkadaşlarına en sevdikleri oyunu sorup sonuçları bir sütun grafiğine dökmek de veriyle çalışmaktır.',
        home: 'Hava durumundaki sıcaklıkları karşılaştırıp en sıcak günü bulmak bu alanı kullanır.',
      },
    },
    {
      // 6. sınıf: daire ve sütun grafikleri, olasılığın 0 ile 1 arasında olması (ortalama yok).
      key: 'veri',
      forms: ['mat-6'],
      short: 'Veri ve olasılık',
      text: 'Bu alan, daire ve sütun grafiklerini okumak ve bir olayın olma olasılığını düşünmek gereken işlerde kullanılır.',
      branches: { school: 'Daire grafiği', friends: 'Torbadan taş çekmek', home: 'Yağmur olasılığı' },
      student: {
        school: 'Sınıfın en sevdiği meyveleri bir daire grafiğinde gösterip okumak bu tür bir iştir.',
        friends: 'Bir oyunda torbadan renkli taş çekerken hangi rengin çıkma olasılığının daha yüksek olduğunu bulmak olasılıktır.',
        home: 'Hava durumundaki yağmur olasılığına bakıp şemsiye alıp almamaya karar vermek bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun sınıfın en sevdiği meyveleri bir daire grafiğinde gösterip okuması bu tür bir iştir.',
        friends: 'Bir oyunda torbadan renkli taş çekerken hangi rengin çıkma olasılığının daha yüksek olduğunu bulmak olasılıktır.',
        home: 'Hava durumundaki yağmur olasılığına bakıp şemsiye alıp almamaya karar vermek bu alanı kullanır.',
      },
    },
    {
      // 7. sınıf: aritmetik ortalama, ortanca, tablodan ortalama hesaplama ve deneysel olasılık.
      key: 'veri',
      forms: ['mat-7'],
      short: 'Ortalama, olasılık',
      text: 'Bu alan, ortalama ve ortanca bulmak, bir deneyin sonuçlarından olasılığı hesaplamak gereken işlerde kullanılır.',
      branches: { school: 'Ortalama ve ortanca', friends: 'Para atma deneyi', home: 'Okunan sayfa ortalaması' },
      student: {
        school: 'Bir deneyin ölçümlerinden ortalamayı ve ortancayı bulmak bu tür işlerdir.',
        friends: 'Bir parayı arkadaşlarınla yirmi kez atıp kaç kez yazı geldiğini saymak deneysel olasılıktır.',
        home: 'Bir hafta boyunca her gün kaç sayfa kitap okuduğunu yazıp ortalamasını bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir deneyin ölçümlerinden ortalamayı ve ortancayı bulması bu tür işlerdir.',
        friends: 'Bir parayı arkadaşlarıyla yirmi kez atıp kaç kez yazı geldiğini saymak deneysel olasılıktır.',
        home: 'Bir hafta boyunca her gün kaç sayfa kitap okuduğunu yazıp ortalamasını bulmak bu alanı kullanır.',
      },
    },
    {
      // 8. sınıf: aritmetik ortalama, çizgi grafiği ve merkezî eğilim ölçüleri.
      key: 'veri',
      forms: ['mat-8'],
      short: 'Veri analizi',
      text: 'Bu alan, verileri düzenlemek, ortalamasını bulmak ve bir grafiğin nasıl değiştiğini okumak gereken işlerde kullanılır.',
      branches: { school: 'Ortalama ve ortanca', friends: 'Maç sonuçları', home: 'Uyku saatleri grafiği' },
      student: {
        school: 'Bir deneyin ölçümlerinden ortalamayı ve ortancayı bulup hangisinin daha uygun olduğunu düşünmek bu tür işlerdir.',
        friends: 'Bir takımın maçlarda attığı golleri tabloya yazıp ortalamasını bulmak da veri analizidir.',
        home: 'Bir hafta boyunca uyku saatlerini yazıp çizgi grafiğinde nasıl değiştiğini görmek bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir deneyin ölçümlerinden ortalamayı ve ortancayı bulup hangisinin daha uygun olduğunu düşünmesi bu tür işlerdir.',
        friends: 'Bir takımın maçlarda attığı golleri tabloya yazıp ortalamasını bulmak da veri analizidir.',
        home: 'Bir hafta boyunca uyku saatlerini yazıp çizgi grafiğinde nasıl değiştiğini görmek bu alanı kullanır.',
      },
    },
  ],
};
