import type { SkillsDaily } from './types';

/**
 * Parçalardan Şekil: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (ayrı ayrı gösterilen parçaları zihinde kaydırıp döndürerek bir bütüne
 * yerleştirmek ve her parçanın bütün şekilde nereye oturduğunu görmek; parçalar ters çevrilemez) ve yol haritası
 * (src/content/roadmaps/gorevler.ts, parcalardanSekil: bir yapbozu tamamlamak, geometride bir şekli parçalarına ayırmak;
 * yetişkinde bir odaya eşya yerleştirmeyi tasarlamak; yapboz, tangram, kâğıdı kesip yeniden birleştirmek). Test "uzamsal
 * becerilerin yalnızca bir yönünü (parçaları zihinde birleştirmeyi) ölçer; yön bulma ya da sözel ve sayısal akıl yürütme
 * hakkında bilgi vermez": harita ve yön bulma örneği yoktur. Yol haritasındaki "bir eşyayı parçalarından kurmak" ve "bir
 * odaya eşya yerleştirmek" üç boyutlu cisimleri çevirmeyi de ister (Üç Boyutlu Zihinde Döndürme): kullanılmaz; örneklerin
 * parçaları düzdür. Katlamak (Kâğıt Katlama, Küp Açınımı) ve karmaşık bir çizimde şekil aramak (Gizli Şekiller) burada
 * yoktur. Örneklerde parçaların ters çevrilmesi gerekmez. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const parcalardanSekilDaily: SkillsDaily = {
  kind: 'skills',
  version: 'parcalardan-sekil-gunluk-1',
  skills: [
    {
      key: 'parcalardan-sekil',
      title: 'Parçaları zihinde birleştirme',
      short: 'Parça birleştirme',
      text: 'Bu beceri, ayrı parçaları zihinde kaydırıp döndürerek hangi bütünü oluşturacaklarını görmeyi gerektiren işlerde kullanılır. Her parçanın bütünde nereye oturacağını görmek de buna girer.',
      branches: {
        school: 'Parçalardan şekil kurmak',
        friends: 'Yapboz ve tangram',
        home: 'Kâğıt parçalarla resim',
        work: 'Parçaları sayfaya sığdırmak',
      },
      student: {
        school: 'Matematikte birkaç parçanın birleşince hangi şekli oluşturacağını görmek bu tür bir iştir.',
        friends: 'Yapboz ya da tangramda bir parçanın yerini ve yönünü bulmak bu beceriyi ister.',
        home: 'Kâğıttan kesilmiş üçgen ve karelerle bir resim oluşturmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte birkaç parçanın birleşince hangi şekli oluşturacağını görmesi bu tür bir iştir.',
        friends: 'Yapboz ya da tangramda bir parçanın yerini ve yönünü bulmak bu beceriyi ister.',
        home: 'Kâğıttan kesilmiş üçgen ve karelerle bir resim oluşturmak bu tür bir iştir.',
      },
      adult: {
        work: 'Birkaç parçanın bir sayfaya boşluksuz nasıl sığacağını önceden görmek bu tür bir iştir.',
      },
    },
  ],
};
