import type { SkillsDaily } from './types';

/**
 * Şekil Akıl Yürütme: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("kuralı bulup yeni bir duruma uygulayabilmek") ve yol haritası (src/content/roadmaps/gorevler.ts,
 * sekilAkilYurutme: bir örüntüyü fark etmek, bir problemi adımlara ayırmak, yeni bir durumda ne yapılacağını kestirmek;
 * takvim, döşeme desenleri, bir şarkıdaki tekrarlar; sudoku, tangram, satranç gibi kurallı oyunlar). Örnekler tanımlayıcıdır;
 * zekâ puanı ya da sonucun bu işlerde ne olacağı söylenmez.
 */
export const sekilAkilYurutmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sekil-akil-yurutme-gunluk-1',
  skills: [
    {
      key: 'sekil-akil-yurutme',
      title: 'Kural bulma ve uygulama',
      short: 'Kural bulma',
      text: 'Bu beceri, bir örüntüyü fark etmek, bir problemi adımlara ayırmak ve yeni bir durumda ne yapılacağını kestirmek gibi işlerde kullanılır.',
      branches: {
        school: 'Sayı örüntüleri',
        friends: 'Kurallı oyunlar',
        home: 'Desendeki tekrar',
        work: 'İşin adımlarını çıkarmak',
      },
      student: {
        school: 'Bir sayı dizisinin kuralını bulmak bu tür bir iştir. Bir problemi adımlara ayırmak da kural aramayı ister.',
        friends: 'Sudoku ya da satranç gibi kurallı oyunlar da kural bulmayı ister.',
        home: 'Bir kumaş desenindeki ya da bir şarkıdaki tekrarı fark etmek de örüntü bulmaktır.',
      },
      parent: {
        school: 'Çocuğunuzun bir sayı dizisinin kuralını bulması bu tür bir iştir. Bir problemi adımlara ayırmak da kural aramayı ister.',
        friends: 'Sudoku ya da satranç gibi kurallı oyunlar da kural bulmayı ister.',
        home: 'Bir kumaş desenindeki ya da bir şarkıdaki tekrarı fark etmek de örüntü bulmaktır.',
      },
      adult: {
        work: 'Yeni bir işin hangi adımlarla yürüdüğünü çıkarmak bu tür bir iştir.',
      },
    },
  ],
};
