import type { SkillsDaily } from './types';

/**
 * Desen Hatırlama: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("bir şeklin ya da desenin görünüşünü kısa bir süre akılda tutabilmek"; "tek bir bakışta görülen,
 * hareketsiz bir görüntüyü akılda tutmak") ve yol haritası (src/content/roadmaps/gorevler.ts, desenHatirlama: tahtadaki bir
 * şekli deftere çizmek, bir tablonun ya da sayfanın düzenini akılda tutmak, "Ne değişti?" oyunu). Örneklerin hepsinde
 * hareketsiz bir görüntüye kısa bir süre bakılır ve hemen ardından hatırlanır. Test "yerlerin sırasını hatırlamak, uzun
 * süreli bellek ya da günlük hayattaki unutkanlık hakkında bilgi vermez": sırayla gösterilen yerler (Dikkat ve Bellek'teki
 * kutu dizisi), yol tarifi ve uzun süre sonra hatırlama örneği yoktur. Yol haritasındaki "eşini bul" oyunu kartların yerini
 * oyun boyunca hatırlamayı istediği için kullanılmaz. İki resmi yan yana karşılaştırmak (farkı bul) Simge Bulma'nın, parçaları
 * birleştirmek (yapboz) Parçalardan Şekil'in örneğidir. Her seferinde aynı desenler gelir: örnekler kareli desenleri anmaz.
 * Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağını söylemez.
 */
export const desenDaily: SkillsDaily = {
  kind: 'skills',
  version: 'desen-hatirlama-gunluk-1',
  skills: [
    {
      key: 'desen-hatirlama',
      title: 'Kısa süreli görsel bellek',
      short: 'Görsel bellek',
      text: 'Bu beceri, kısa bir bakışta görülen bir şeklin ya da düzenin görünüşünü hemen ardından hatırlamayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Tahtadaki şekli aktarmak',
        friends: 'Ne değişti oyunu',
        home: 'Masanın düzenini kurmak',
        work: 'Şemanın düzenini tutmak',
      },
      student: {
        school: 'Tahtadaki şekle bakıp gözünü deftere çevirince onu aklında tutmak bu beceriyi kullanır.',
        friends: '“Ne değişti?” oyununda bir düzene kısaca bakıp değişeni bulmak bu beceriyi kullanır.',
        home: 'Masadaki şeylerin düzenine kısaca bakıp aynısını yeniden kurmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun tahtadaki şekle bakıp deftere dönünce onu aklında tutması bu beceriyi kullanır.',
        friends: '“Ne değişti?” oyununda bir düzene kısaca bakıp değişeni bulmak bu beceriyi kullanır.',
        home: 'Masadaki şeylerin düzenine kısaca bakıp aynısını yeniden kurmak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir şemaya kısaca bakıp düzenini aklında tutmak bu tür bir iştir.',
      },
    },
  ],
};
