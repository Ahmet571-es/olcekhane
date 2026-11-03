import type { SkillsDaily } from './types';

/**
 * Kelime Listesi Hatırlama: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("tekrarlarla bir kelime listesini öğrenebilmeyi ..., araya yeni bir liste girdikten sonra
 * öğrenileni koruyabilmeyi ve öğrenilen kelimeleri yeni ya da benzer kelimelerden ayırt edebilmeyi") ve raporun kartı
 * (src/lib/reports/build.ts: "bir alışveriş listesini ... akılda tutmak"). Testte kelimeler ekranda yazılı gösterilir,
 * birkaç dakika içinde hatırlanır ve yazılır. Bu yüzden örneklerin hepsinde yazılı bir liste okunur ve birkaç dakika içinde
 * bakmadan hatırlanır. Test "uzun süre sonra" hatırlamayı ölçmez ve "duyduğunu hatırlama ya da resim, yer ve yüz gibi sözel
 * olmayan bilgileri hatırlama hakkında" bilgi vermez: raporun ve yol haritasının "yeni tanışılan kişilerin adları" örneği
 * (adlar çoğu zaman duyulur ve yüzle birlikte hatırlanır) ve ertesi gün hatırlama örneği kullanılmaz. Kelimelerin anlamını
 * bilmeyi Kelime Bilgisi ölçer: "yeni kelime öğrenmek" örneği yoktur. Her seferinde aynı kelimeler gelir: örnekler listedeki
 * kelimeleri kullanmaz. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağını söylemez.
 */
export const kelimeListesiDaily: SkillsDaily = {
  kind: 'skills',
  version: 'kelime-listesi-hatirlama-gunluk-1',
  skills: [
    {
      key: 'kelime-listesi',
      title: 'Sözel öğrenme ve bellek',
      short: 'Liste öğrenme',
      text: 'Bu beceri, yazılı bir listeyi birkaç kez okuyarak öğrenmeyi ve birkaç dakika sonra bakmadan hatırlamayı gerektiren işlerde kullanılır. Listedeki kelimeleri benzerlerinden ayırt etmek de bunun bir parçasıdır.',
      branches: {
        school: 'Tahtadaki kelimeleri tutmak',
        friends: 'Kelime hatırlama oyunu',
        home: 'Alışveriş listesi',
        work: 'Yapılacakları hatırlamak',
      },
      student: {
        school: 'Tahtaya yazılan birkaç kelimeyi okuyup tahta silindikten sonra hatırlamak bu beceriyi kullanır.',
        friends: 'Kâğıttaki kelimelere bakıp, kâğıt kapanınca hatırladıklarını yazma oyunları bu beceriyi kullanır.',
        home: 'Okuduğun bir alışveriş listesini birkaç dakika sonra bakmadan hatırlamak bu beceriyi kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun tahtaya yazılan kelimeleri okuyup tahta silindikten sonra hatırlaması bu beceriyi kullanır.',
        friends: 'Kâğıttaki kelimelere bakıp, kâğıt kapanınca hatırlananları yazma oyunları bu beceriyi kullanır.',
        home: 'Okunan bir alışveriş listesini birkaç dakika sonra bakmadan hatırlamak bu beceriyi kullanır.',
      },
      adult: {
        work: 'Okuduğun yapılacaklar listesini birkaç dakika sonra bakmadan hatırlamak bu tür bir iştir.',
      },
    },
  ],
};
