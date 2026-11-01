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
 * Örnekler A : B :: C : ? düzenindedir: bir değişikliği ya da ilişkiyi bir çiftte bulup başka bir şekle uygulamak (ev
 * örneğinde büyüklük ilişkisi: büyük kap : büyük kapak :: küçük kap : küçük kapak). Örnekler tanımlayıcıdır; zekâ puanı ya da
 * sonucun bu işlerde ne olacağı söylenmez.
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
        home: 'Kaplara kapak eşlemek',
        work: 'Tasarımda aynı değişiklik',
      },
      student: {
        school: 'Derste örnekteki şekle yapılan değişikliği bulup başka bir şekle uygulamak bu tür bir iştir.',
        friends: '“Bu ona neyse, şu da …?” diye sorulan şekil bulmacalarını çözmek bu beceriyi ister.',
        home: 'Büyük kaba büyük kapak gidiyorsa küçük kaba küçük kapağın gideceğini görmek de bir benzetmedir.',
      },
      parent: {
        school: 'Çocuğunuzun derste örnekteki şekle yapılan değişikliği bulup başka bir şekle uygulaması bu tür bir iştir.',
        friends: '“Bu ona neyse, şu da …?” diye sorulan şekil bulmacalarını çözmek bu beceriyi ister.',
        home: 'Büyük kaba büyük kapak gidiyorsa küçük kaba küçük kapağın gideceğini görmek de bir benzetmedir.',
      },
      adult: {
        work: 'Bir tasarımda bir öğeye yapılan değişikliği bulup aynısını başka bir öğeye uygulamak bu tür bir iştir.',
      },
    },
  ],
};
