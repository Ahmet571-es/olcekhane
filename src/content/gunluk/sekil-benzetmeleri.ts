import type { SkillsDaily } from './types';

/**
 * Şekil Benzetmeleri: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` ("iki şekil arasındaki ilişkiyi bulup aynı ilişkiyi başka bir şekle
 * uygulayabilmek"; "Bu ona neyse, şu da …") ve yol haritası (src/content/roadmaps/gorevler.ts, sekilBenzetmeleri). Test
 * "yalnızca şekillerle kurulan benzetmeler yoluyla yapılan yönünü ölçer; sözel ve sayısal akıl yürütme, bilgi, bellek ve hız
 * … hakkında bilgi vermez": kelime benzetmesi (Sözel Akıl Yürütme ölçer) ve sayılı örnek yoktur. Yol haritasındaki "yeni bir
 * konuyu bildiğin bir konuya benzeterek anlamak" ve "bir problemin çözüm yolunu benzer bir probleme aktarmak" sözel ya da
 * sayısal benzetmedir: kullanılmaz. Örüntünün devamını bulmak Şekil Akıl Yürütme'nin örneğidir; burada yoktur. Değişiklik
 * türlerinden döndürme ve ayna görüntüsü örneklerde anılmaz (şekli zihinde döndürmeyi Zihinde Döndürme ölçer; karışmasın).
 * Örnekler A : B :: C : ? düzenindedir: bir şekilden ötekine olan değişikliği bulup başka biçimdeki bir şekle uygulamak (ev
 * örneğinde düz kurabiye : süslü kurabiye :: başka biçimdeki kurabiye : ?; işte bir başlığa yapılan biçim değişikliği öteki
 * başlıklara). Birbirine "uyan" şeyleri eşlemek (kaba kapak) bir değişiklik değil, Sözel Akıl Yürütme'nin sorduğu türden bir
 * ilişkidir: kullanılmaz. Örnekler tanımlayıcıdır; zekâ puanı ya da sonucun bu işlerde ne olacağı söylenmez.
 */
export const sekilBenzetmeleriDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sekil-benzetmeleri-gunluk-1',
  skills: [
    {
      key: 'sekil-benzetmeleri',
      title: 'Şekillerle benzetme kurma',
      short: 'Benzetme kurma',
      text: 'Bu beceri, iki şekil arasındaki değişikliği bulup aynı değişikliği başka bir şekle uygulamak gereken işlerde kullanılır. “Bu ona neyse, şu da …” diye düşünmeyi ister.',
      branches: {
        school: 'Örnekteki değişiklik',
        friends: 'Benzetme bulmacaları',
        home: 'Kurabiyede aynı süsleme',
        work: 'Başlıklarda aynı değişiklik',
      },
      student: {
        school: 'Derste örnekteki şekle yapılan değişikliği bulup başka bir şekle uygulamak bu tür bir iştir.',
        friends: '“Bu ona neyse, şu da …?” diye sorulan şekil bulmacalarını çözmek bu beceriyi ister.',
        home: 'Bir kurabiyeye yapılan süslemeyi görüp aynısını başka biçimdeki bir kurabiyeye uygulamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun derste örnekteki şekle yapılan değişikliği bulup başka bir şekle uygulaması bu tür bir iştir.',
        friends: '“Bu ona neyse, şu da …?” diye sorulan şekil bulmacalarını çözmek bu beceriyi ister.',
        home: 'Bir kurabiyeye yapılan süslemeyi görüp aynısını başka biçimdeki bir kurabiyeye uygulamak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir belgede bir başlığa yapılan biçim değişikliğini görüp aynısını öteki başlıklara uygulamak bu tür bir iştir.',
      },
    },
  ],
};
