import type { SkillsDaily } from './types';

/**
 * Matematik Konu Tarama Testi: konu alanları günlük hayatta nerede kullanılır (5–8. sınıf; yetişkinlere açık değil).
 * Her öğrenci sınıfının formunu çözer (mat-5 … mat-8; her formda beş konu alanı). Bir alanın içeriği formdan forma
 * değişiyorsa (ör. "sayilar" 5. sınıf formunda doğal sayılar, 7.'de çarpanlar ve katlar, 8.'de tam sayılar) her içerik için
 * ayrı bir kart vardır (`forms`); kartın başlığı formdaki alanın adıdır.
 * Kaynak: formların alan tanımları (src/content/instruments/matematik/form*.ts) ve yol haritasındaki gündelik örnekler
 * (src/content/roadmaps/matematik.ts: alışverişte tahmin, ortak kat sorusu, hava durumu ve asansör katları, tarifler, indirim
 * etiketleri, birim fiyat, harita ölçeği, "Aklımdan bir sayı tuttum", ölçme ve saat, uyku saatleri).
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
      short: 'Tam sayılar',
      text: 'Bu alan, sıfırın altına inen ölçümleri okumak ve negatif sayılarla hesap yapmak gereken işlerde kullanılır.',
      branches: { school: 'Sıcaklık farkı', friends: 'Eksi puanlar', home: 'Asansördeki katlar' },
      student: {
        school: 'Fen dersinde eksi derecelerle iki sıcaklık arasındaki farkı bulmak tam sayılarla işlemdir.',
        friends: 'Bir oyunda eksi puanları da sayarak toplamı bulmak negatif sayılarla hesap yapmaktır.',
        home: 'Asansördeki eksi katları ya da hava durumundaki eksi dereceleri okumak bu tür işlerdir.',
      },
      parent: {
        school: 'Çocuğunuzun fen dersinde eksi derecelerle iki sıcaklık arasındaki farkı bulması tam sayılarla işlemdir.',
        friends: 'Bir oyunda eksi puanları da sayarak toplamı bulmak negatif sayılarla hesap yapmaktır.',
        home: 'Asansördeki eksi katları ya da hava durumundaki eksi dereceleri okumak bu tür işlerdir.',
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
        friends: 'Bir pastayı arkadaşlarınla eşit dilimlere bölmek ve kaç dilim kaldığını bulmak bu tür işlerdir.',
        home: 'Bir tarifteki yarım bardak ya da çeyrek kaşık gibi ölçüleri anlamak kesirleri ister.',
      },
      parent: {
        school: 'Çocuğunuzun bir kâğıdı katlayarak yarım ve çeyrek parçalar oluşturması kesirleri kullanır.',
        friends: 'Bir pastayı arkadaşlarıyla eşit dilimlere bölmek ve kaç dilim kaldığını bulmak bu tür işlerdir.',
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
        home: 'Markette iki paketin birim fiyatını karşılaştırıp ucuz olanı bulmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun haritada 1 santimetrenin kaç kilometre olduğunu kullanarak bir uzaklığı bulması orantıdır.',
        friends: 'Arkadaşlarıyla bir tarifi iki kişilikten altı kişiliğe büyütmek doğru orantı kullanır.',
        home: 'Markette iki paketin birim fiyatını karşılaştırıp ucuz olanı bulmak bu tür bir iştir.',
      },
    },
    {
      key: 'cebir',
      forms: ['mat-5', 'mat-6'],
      short: 'İşlem ve örüntü',
      text: 'Bu alan, bir problemde hangi işlemin gerektiğini seçmek ve bir örüntünün kuralını bulmak gibi işlerde kullanılır.',
      branches: { school: 'Problem çözmek', friends: 'Sıradaki hamle', home: 'Büyümeyi tahmin' },
      student: {
        school: 'Bir problemde hangi işlemi neden seçtiğini adım adım yazmak bu tür bir iştir.',
        friends: 'Bir oyunda tekrar eden sırayı fark edip sıradaki hamleyi bulmak örüntü bulmaktır.',
        home: 'Her hafta 2 santimetre uzayan bir fidanın ileriki boyunu bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir problemde hangi işlemi neden seçtiğini anlatması bu tür bir iştir.',
        friends: 'Bir oyunda tekrar eden sırayı fark edip sıradaki hamleyi bulmak örüntü bulmaktır.',
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
        home: 'Belli bir parayla en çok kaç tane defter alınabileceğini bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bilinmeyen bir sayıyı x ile gösterip bulması bu tür bir iştir.',
        friends: '“Aklımdan bir sayı tuttum” oyununda tutulan sayıyı bulmak da bir denklem çözmektir.',
        home: 'Belli bir parayla en çok kaç tane defter alınabileceğini bulmak bu alanı kullanır.',
      },
    },
    {
      key: 'geometri',
      short: 'Geometri ve ölçme',
      text: 'Bu alan, uzunluk, alan, açı ve zaman ölçmek gereken işlerde kullanılır.',
      branches: { school: 'Şekil çizmek', friends: 'Oyun alanı çizmek', home: 'Eşyayı ölçmek' },
      student: {
        school: 'Cetvel ve açıölçerle bir şekil çizmek bu tür bir iştir. Bir çerçevenin çevresini hesaplamak da bu alanı kullanır.',
        friends: 'Bir oyun için yere kare bir alan çizmek ölçmeyi ister.',
        home: 'Bir kutunun rafa sığıp sığmayacağını ölçerek bulmak bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun cetvel ve açıölçerle bir şekil çizmesi bu tür bir iştir. Bir çerçevenin çevresini hesaplamak da bu alanı kullanır.',
        friends: 'Bir oyun için yere kare bir alan çizmek ölçmeyi ister.',
        home: 'Bir kutunun rafa sığıp sığmayacağını ölçerek bulmak bu alanı kullanır.',
      },
    },
    {
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
        school: 'Çocuğunuzun bir deneyin sonuçlarını tabloya yazması bu tür bir iştir.',
        friends: 'Arkadaşlarına en sevdikleri oyunu sorup sonuçları bir sütun grafiğine dökmek de veriyle çalışmaktır.',
        home: 'Hava durumundaki sıcaklıkları karşılaştırıp en sıcak günü bulmak bu alanı kullanır.',
      },
    },
    {
      key: 'veri',
      forms: ['mat-6', 'mat-7'],
      short: 'Veri ve olasılık',
      text: 'Bu alan, grafik okumak, ortalama bulmak ve bir olayın olma olasılığını düşünmek gereken işlerde kullanılır.',
      branches: { school: 'Ortalama bulmak', friends: 'Zar oyunları', home: 'Yağmur olasılığı' },
      student: {
        school: 'Bir deneyin ölçümlerini bir grafikte göstermek ve ortalamasını bulmak bu tür işlerdir.',
        friends: 'Bir zar oyununda hangi sayının gelme olasılığının daha yüksek olduğunu düşünmek olasılıktır.',
        home: 'Hava durumundaki yağmur olasılığına bakıp şemsiye alıp almamaya karar vermek bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir deneyin ölçümlerini bir grafikte göstermesi ve ortalamasını bulması bu tür işlerdir.',
        friends: 'Bir zar oyununda hangi sayının gelme olasılığının daha yüksek olduğunu düşünmek olasılıktır.',
        home: 'Hava durumundaki yağmur olasılığına bakıp şemsiye alıp almamaya karar vermek bu alanı kullanır.',
      },
    },
    {
      key: 'veri',
      forms: ['mat-8'],
      short: 'Veri analizi',
      text: 'Bu alan, verileri düzenlemek, ortalamasını bulmak ve bir grafiğin nasıl değiştiğini okumak gereken işlerde kullanılır.',
      branches: { school: 'Ortalama ve ortanca', friends: 'Maç sonuçları', home: 'Uyku saatleri grafiği' },
      student: {
        school: 'Bir deneyin ölçümlerinden ortalamayı ve ortancayı bulmak bu tür işlerdir.',
        friends: 'Bir takımın maçlarda attığı golleri tabloya yazıp ortalamasını bulmak da veri analizidir.',
        home: 'Bir hafta boyunca uyku saatlerini yazıp çizgi grafiğinde nasıl değiştiğini görmek bu alanı kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun bir deneyin ölçümlerinden ortalamayı ve ortancayı bulması bu tür işlerdir.',
        friends: 'Bir takımın maçlarda attığı golleri tabloya yazıp ortalamasını bulmak da veri analizidir.',
        home: 'Bir hafta boyunca uyku saatlerini yazıp çizgi grafiğinde nasıl değiştiğini görmek bu alanı kullanır.',
      },
    },
  ],
};
