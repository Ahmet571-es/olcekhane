import type { SkillsDaily } from './types';

/**
 * Bakış Açısı Alma: günlük hayatta nerede kullanılır (7. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (kendini zihinde başka bir yere ve yöne koyup çevredeki nesnelerin oradan hangi
 * yönde kaldığını kestirmek: önüm, sağım gibi) ve yol haritası (src/content/roadmaps/gorevler.ts, bakisAcisiAlma: birine yol
 * tarif etmek; karşıdaki birinin "sağımdaki" dediği şeyi bulmak). Test "uzamsal becerinin yalnızca bir yönünü … ölçer; gerçek
 * bir ortamda yol bulmayı doğrudan ölçmez": yolunu bulmak ya da kaybolmamak örneği yoktur; örnekler bir haritada ya da bir
 * tarifte başka birinin yerinden bakmayı anlatır. "Bakış açısı" burada uzamsaldır: başkasının duygusunu ya da düşüncesini
 * anlamak (Empati'nin konusu) değildir. Cismi çevirmek Üç Boyutlu Zihinde Döndürme'nin örneğidir; burada dönen cisim değil,
 * kişinin kendisidir (zihinde). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const bakisAcisiAlmaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'bakis-acisi-alma-gunluk-1',
  skills: [
    {
      key: 'bakis-acisi-alma',
      title: 'Zihinde bakış açısı alma',
      short: 'Bakış açısı',
      text: 'Bu beceri, kendini zihinde başka bir yere ve yöne koyup çevredeki şeylerin oradan hangi yanda kaldığını kestirmeyi gerektiren işlerde kullanılır.',
      branches: {
        school: 'Haritada yer ve yön',
        friends: 'Karşıdakinin sağı solu',
        home: 'Eşyanın yerini tarif etmek',
        work: 'Girişi tarif etmek',
      },
      student: {
        school: 'Derste haritada bir yerde durup bir yöne baktığını hayal etmek bu tür bir iştir. Öteki yerlerin oradan sağda mı solda mı kaldığını bulmak da bu beceriyi ister.',
        friends: 'Karşındaki birinin “sağımdaki” dediği şeyi bulmak bu beceriyi kullanır.',
        home: 'Birine bir eşyanın yerini, onun bakacağı yönden tarif etmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun derste haritada bir yerde durup bir yöne baktığını hayal etmesi bu tür bir iştir. Öteki yerlerin oradan sağda mı solda mı kaldığını bulmak da bu beceriyi ister.',
        friends: 'Karşısındaki birinin “sağımdaki” dediği şeyi bulmak bu beceriyi kullanır.',
        home: 'Birine bir eşyanın yerini, onun bakacağı yönden tarif etmek bu tür bir iştir.',
      },
      adult: {
        work: 'Gelecek birine binanın girişini, onun geleceği yönden bakarak tarif etmek bu tür bir iştir.',
      },
    },
  ],
};
