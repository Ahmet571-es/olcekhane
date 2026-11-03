import type { SkillsDaily } from './types';

/**
 * Zihinde Döndürme: günlük hayatta nerede kullanılır (5. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("bir şeklin görüntüsünü zihinde döndürüp başka bir şekille karşılaştırabilmek"; "bir şeklin
 * döndürülünce nasıl görüneceğini düşünmeyi gerektiren durumlar") ve görevin kendisi (döndürülmüş iki düz şeklin aynı mı,
 * ayna görüntüsü mü olduğuna karar vermek). Görev "düz (iki boyutlu) şekillerle yapılır; üç boyutlu nesneleri zihinde
 * döndürme becerisini doğrudan ölçmez": küp, kutu, eşya ya da nesne döndürme örneği yoktur (bunu Üç Boyutlu Zihinde Döndürme
 * ölçer). Tanıtımdaki "bir yapboz parçasının nereye oturacağını görmek" örneği, parçaları bir bütüne yerleştirmeyi ölçen
 * Parçalardan Şekil'e çok yakın olduğu için kullanılmaz; harita ve yön bulma (Bakış Açısı Alma) ve kâğıt katlama (Kâğıt
 * Katlama) örnekleri de yoktur. Yol haritasındaki "eşyanın yerleşimini planlamak" örneği üç boyutlu olduğu için
 * kullanılmaz. Ters duran bir resmi tanımak çoğu zaman zihinde döndürme istemez; evdeki örnek bu yüzden ters duran bir
 * yazıyı okumaktır (harflerin yönü, ayna görüntüsüyle karıştırılmadan bulunur). Test "matematik ya da geometri başarısı
 * hakkında" bilgi vermez: okuldaki örnek yalnızca becerinin kullanıldığı bir yeri söyler. Örnekler tanımlayıcıdır; sonucun bu
 * işlerde ne olacağını söylemez.
 */
export const zihindeDondurmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'zihinde-dondurme-gunluk-1',
  skills: [
    {
      key: 'zihinde-dondurme',
      title: 'Şekilleri zihinde döndürme',
      short: 'Zihinde döndürme',
      text: 'Bu beceri, düz bir şeklin döndürülünce nasıl görüneceğini zihinde canlandırmayı gerektiren işlerde kullanılır. Döndürülmüş iki şeklin aynı mı, ayna görüntüsü mü olduğunu ayırt etmek de bunun bir parçasıdır.',
      branches: {
        school: 'Çevrilmiş şekli tanımak',
        friends: 'Şekil bulmacaları',
        home: 'Ters yazıyı okumak',
      },
      student: {
        school: 'Geometride döndürülmüş iki şeklin aynı olup olmadığını anlamak bu beceriyi kullanır.',
        friends: 'Bulmacalarda döndürülmüş şekiller arasından aynısını bulmak da bu beceriyi kullanır.',
        home: 'Masanın öbür yanında ters duran bir yazıyı kâğıdı çevirmeden okumak bu beceriyi kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun geometride döndürülmüş iki şeklin aynı olup olmadığını anlaması bu beceriyi kullanır.',
        friends: 'Bulmacalarda döndürülmüş şekiller arasından aynısını bulmak da bu beceriyi kullanır.',
        home: 'Masanın öbür yanında ters duran bir yazıyı kâğıdı çevirmeden okumak bu beceriyi kullanır.',
      },
    },
  ],
};
