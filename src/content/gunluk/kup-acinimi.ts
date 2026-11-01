import type { SkillsDaily } from './types';

/**
 * Küp Açınımı: günlük hayatta nerede kullanılır (5. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (düz bir açınımı zihinde katlayıp oluşan küpün nasıl görüneceğini bulmak:
 * yüzlerin yeri ve yüzlerdeki şekillerin yönü; açınımlar ve karşılıklı yüzler 4. sınıf matematik programında) ve yol haritası
 * (src/content/roadmaps/gorevler.ts, kupAcinimi: bir kutunun ya da ambalajın nasıl katlanacağını düşünmek; kâğıttan bir küp
 * açınımını katlamadan önce karşılıklı yüzleri tahmin etmek). Test "uzamsal becerinin yalnızca bir yönünü (zihinde katlamayı)
 * ölçer; zihinde döndürme ya da yön bulma hakkında bilgi vermez": cismi çevirmek ve harita örneği yoktur; yol haritasındaki
 * "bir cismin farklı yönlerden nasıl göründüğünü kestirmek" ve "bir eşyayı kurulum çizimine bakarak kurmak" bu yüzden
 * kullanılmaz (Üç Boyutlu Zihinde Döndürme ve Bakış Açısı Alma'nın örnekleridir). Katlanan kâğıdı delmek ya da kesmek Kâğıt
 * Katlama'nın örneğidir. Örneklerin hepsi düz bir kalıbın kutuya ya da küpe katlanmasıdır (zar yaparken karşılıklı yüzleri
 * bulmak, karton kutu kurmak, ambalaj kalıbındaki yazıların yönü). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const kupAcinimiDaily: SkillsDaily = {
  kind: 'skills',
  version: 'kup-acinimi-gunluk-1',
  skills: [
    {
      key: 'kup-acinimi',
      title: 'Açınımı zihinde katlama',
      short: 'Zihinde katlama',
      text: 'Bu beceri, düz bir kalıbı zihinde katlayıp oluşacak küpün ya da kutunun nasıl görüneceğini bulmayı gerektiren işlerde kullanılır. Hangi yüzlerin karşı karşıya geleceği ve yüzlerdeki şekillerin yönü de buna girer.',
      branches: {
        school: 'Küpün açınımı',
        friends: 'Kâğıttan zar yapmak',
        home: 'Karton kutu kurmak',
        work: 'Ambalaj kalıpları',
      },
      student: {
        school: 'Matematikte bir küp açınımında hangi yüzlerin karşı karşıya geleceğini bulmak bu beceriyi ister.',
        friends: 'Kâğıttan zar yaparken hangi yüzlerin karşılıklı geleceğini katlamadan bulmak bu beceriyi ister.',
        home: 'Düz bir karton kutuyu kurarken kapakların nereye geleceğini görmek bu beceriyi ister.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte bir küp açınımında hangi yüzlerin karşı karşıya geleceğini bulması bu beceriyi ister.',
        friends: 'Kâğıttan zar yaparken hangi yüzlerin karşılıklı geleceğini katlamadan bulmak bu beceriyi ister.',
        home: 'Düz bir karton kutuyu kurarken kapakların nereye geleceğini görmek bu beceriyi ister.',
      },
      adult: {
        work: 'Bir ambalajın düz kalıbındaki yazıların katlanınca hangi yönde duracağını kestirmek bu beceriyi ister.',
      },
    },
  ],
};
