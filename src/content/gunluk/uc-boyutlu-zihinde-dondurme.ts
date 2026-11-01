import type { SkillsDaily } from './types';

/**
 * Üç Boyutlu Zihinde Döndürme: günlük hayatta nerede kullanılır (5. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (bir cismin döndürülünce nasıl görüneceğini zihinde canlandırıp onu ayna
 * görüntüsünden ayırmak; küplerden yapılmış şekiller) ve yol haritası (src/content/roadmaps/gorevler.ts,
 * ucBoyutluZihindeDondurme: bir eşyanın parçalarını kurulum çizimine bakarak birleştirmek, geometride cisimlerle çalışmak;
 * küplerden bir şekil kurup çevirmeden önce tahmin etmek). Test "uzamsal becerinin yalnızca bir yönünü (üç boyutlu şekilleri
 * zihinde döndürmeyi) ölçer; zihinde katlama ya da yön bulma hakkında bilgi vermez": katlama, açınım ve harita örneği yoktur.
 * Kardeş testlerle karışmasın diye: düz şekilleri döndürmek Zihinde Döndürme'nin, kendini başka bir yere koyup oradan bakmak
 * Bakış Açısı Alma'nın örneğidir; burada dönen kişi değil, cisimdir. Yol haritasındaki "bir cismin arkadan ya da yandan nasıl
 * görüneceğini kestirmek" bu yüzden "cismi çevirince" diye yazılır. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const ucBoyutluZihindeDondurmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'uc-boyutlu-zihinde-dondurme-gunluk-1',
  skills: [
    {
      key: 'uc-boyutlu-zihinde-dondurme',
      title: 'Cisimleri zihinde döndürme',
      short: 'Cismi döndürme',
      text: 'Bu beceri, bir cismin çevrilince nasıl görüneceğini zihinde canlandırmayı ve onu ayna görüntüsünden ayırmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Küplerden yapılar',
        friends: 'Yapı oyuncakları',
        home: 'Eşyayı kapıdan geçirmek',
        work: 'Kurulum çizimleri',
      },
      student: {
        school: 'Geometride küplerden bir yapının çevrilince nasıl görüneceğini bulmak bu beceriyi ister.',
        friends: 'Yapı oyuncağında bir parçanın çevrilince nasıl duracağını takmadan görmek bu beceriyi ister.',
        home: 'Büyük bir eşyayı kapıdan geçirmek için nasıl çevrilmesi gerektiğini düşünmek bu beceriyi ister.',
      },
      parent: {
        school: 'Çocuğunuzun geometride küplerden bir yapının çevrilince nasıl görüneceğini bulması bu beceriyi ister.',
        friends: 'Yapı oyuncağında bir parçanın çevrilince nasıl duracağını takmadan görmek bu beceriyi ister.',
        home: 'Büyük bir eşyayı kapıdan geçirmek için nasıl çevrilmesi gerektiğini düşünmek bu beceriyi ister.',
      },
      adult: {
        work: 'Kurulum çizimine bakıp bir parçanın hangi yöne çevrilerek takılacağını görmek bu beceriyi ister.',
      },
    },
  ],
};
