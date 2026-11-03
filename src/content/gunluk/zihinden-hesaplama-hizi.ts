import type { SkillsDaily } from './types';

/**
 * Zihinden Hesaplama Hızı: günlük hayatta nerede kullanılır (4. sınıftan yetişkine).
 * Rapor dört işlemi dört ayrı bölümde, her birini kendi sonucu ve düzeyiyle anlatır (görevler: zh-add, zh-sub, zh-mul,
 * zh-div); bu yüzden her işlemin kendi kartı vardır ve her kartın örnekleri yalnızca o işlemi ister. Hepsinde ortak olan,
 * testin ölçtüğü şeydir: işlemi kâğıt kalem kullanmadan, doğru ve çabuk yapmak (aritmetik akıcılık).
 * Kaynak: testin tanıtımı ve `whatItMeasures` ("dört işlemi zihinden hem doğru hem hızlı yapabilmek"; sonuçlar sayarak
 * hesaplanmaktan bellekten hatırlanmaya geçer), işlemlerin düzeyleri (tek basamaklı işlemler ve çarpım tablosundan iki
 * basamaklı sayılara) ve yol haritası (src/content/roadmaps/gorevler.ts, zihindenHesaplama: alışverişte para üstünü
 * hesaplamak). Test "matematik bilgisinin ya da problem çözmenin tamamını ölçmez": örnekler problem çözmeyi değil, işlemin
 * kendisini anlatır. Yol haritasındaki "bir tarifi ikiye katlamak" orantıdır (Sayısal Akıl Yürütme): kullanılmaz. Matematik
 * Konu Tarama Testi'nin örnekleri (sınıfı eşit gruplara ayırmak, kurabiyeyi paylaştırmak) yinelenmez; puan farkı Sayısal Akıl
 * Yürütme'nin örneğidir (burada kazanmak için kalan puan). Saate bakıp kalan süreyi bulmak saat okumayı ve saati aşmayı da
 * ister: kullanılmaz.
 * Sayılar elle denetlendi: beşer puanlık 7 kart 35 puan eder; 30 sayfa 5 güne bölününce günde 6 sayfa düşer; günde 3
 * yumurta kullanılırsa 12 yumurta 4 gün yeter. Bu işlemlerin hiçbiri testteki işlemlerden değildir (4 × 5 testte olduğu için
 * 4 kart yazılmaz). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const zihindenHesaplamaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'zihinden-hesaplama-gunluk-1',
  skills: [
    {
      key: 'zh-add',
      short: 'Toplama',
      text: 'Bu beceri, birkaç sayıyı kâğıt kalem kullanmadan, doğru ve çabuk toplamayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'İki basamaklı toplamalar',
        friends: 'Zarları toplamak',
        home: 'Fiyatları toplamak',
        work: 'Tutarları toplamak',
      },
      student: {
        school: 'Matematikte iki basamaklı sayıları kâğıda yazmadan toplamak bu tür bir iştir.',
        friends: 'Bir oyunda iki zarın toplamını hemen söylemek bu tür bir iştir.',
        home: 'Alışverişte birkaç ürünün fiyatını zihinden toplamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte iki basamaklı sayıları kâğıda yazmadan toplaması bu tür bir iştir.',
        friends: 'Bir oyunda iki zarın toplamını hemen söylemek bu tür bir iştir.',
        home: 'Alışverişte birkaç ürünün fiyatını zihinden toplamak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir siparişteki birkaç tutarı kâğıda yazmadan toplamak bu tür bir iştir.',
      },
    },
    {
      key: 'zh-sub',
      short: 'Çıkarma',
      text: 'Bu beceri, kalanı ya da iki sayı arasındaki farkı kâğıt kalem kullanmadan, doğru ve çabuk bulmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Kalan sayfayı bulmak',
        friends: 'Kalan puanı bulmak',
        home: 'Para üstünü bulmak',
        work: 'Kalan bütçeyi bulmak',
      },
      student: {
        school: 'Okuduğun kitabın bitmesine kaç sayfa kaldığını zihinden bulmak bu tür bir iştir.',
        friends: 'Bir oyunda kazanmak için kaç puan kaldığını zihinden bulmak bu tür bir iştir.',
        home: 'Alışverişte para üstünü zihinden hesaplamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun okuduğu kitabın bitmesine kaç sayfa kaldığını zihinden bulması bu tür bir iştir.',
        friends: 'Bir oyunda kazanmak için kaç puan kaldığını zihinden bulmak bu tür bir iştir.',
        home: 'Alışverişte para üstünü zihinden hesaplamak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir bütçeden harcananı çıkarıp kalanı kâğıda yazmadan bulmak bu tür bir iştir.',
      },
    },
    {
      key: 'zh-mul',
      short: 'Çarpma',
      text: 'Bu beceri, aynı miktardan birkaç tane olduğunda toplamı kâğıt kalem kullanmadan, doğru ve çabuk bulmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Çarpım tablosu',
        friends: 'Kartların puanı',
        home: 'Birkaç ürünün tutarı',
        work: 'Haftalık saatler',
      },
      student: {
        school: 'Matematikte çarpım tablosundaki sonuçları sayarak bulmak yerine hemen hatırlamak bu tür bir iştir.',
        friends: 'Beşer puanlık 7 kartın kaç puan ettiğini zihinden bulmak bu tür bir iştir.',
        home: 'Aynı fiyattan birkaç ürünün tutarını zihinden bulmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte çarpım tablosundaki sonuçları sayarak bulmak yerine hemen hatırlaması bu tür bir iştir.',
        friends: 'Beşer puanlık 7 kartın kaç puan ettiğini zihinden bulmak bu tür bir iştir.',
        home: 'Aynı fiyattan birkaç ürünün tutarını zihinden bulmak bu tür bir iştir.',
      },
      adult: {
        work: 'Her gün aynı süre çalışılan bir haftanın toplam saatini kâğıda yazmadan bulmak bu tür bir iştir.',
      },
    },
    {
      key: 'zh-div',
      short: 'Bölme',
      text: 'Bu beceri, bir miktarı eşit parçalara ayırmayı kâğıt kalem kullanmadan, doğru ve çabuk yapmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Ödevi günlere bölmek',
        friends: 'Kartları dağıtmak',
        home: 'Kaç gün yeteceği',
        work: 'Tutarı paylaştırmak',
      },
      student: {
        school: '30 sayfalık bir ödev 5 güne eşit bölünebilir. Günde kaç sayfa düştüğünü zihinden bulmak bu tür bir iştir.',
        friends: 'Kartları oyunculara eşit dağıtırken kaçar tane düşeceğini zihinden bulmak bu tür bir iştir.',
        home: '12 yumurtalık bir koliden günde 3 yumurta kullanılırsa kaç gün yeteceğini zihinden bulmak bu beceriyi ister.',
      },
      parent: {
        school: 'Çocuğunuzun 30 sayfalık bir ödevi 5 güne eşit bölmesi gerekebilir. Günde kaç sayfa düştüğünü zihinden bulmak bu tür bir iştir.',
        friends: 'Kartları oyunculara eşit dağıtırken kaçar tane düşeceğini zihinden bulmak bu tür bir iştir.',
        home: '12 yumurtalık bir koliden günde 3 yumurta kullanılırsa kaç gün yeteceğini zihinden bulmak bu beceriyi ister.',
      },
      adult: {
        work: 'Bir tutarı birkaç kişi arasında eşit bölmeyi kâğıda yazmadan yapmak bu tür bir iştir.',
      },
    },
  ],
};
