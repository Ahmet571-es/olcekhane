import type { SkillsDaily } from './types';

/**
 * Şekil Akıl Yürütme: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("daha önce görülmemiş bir düzende kuralı bulup onu yeni bir duruma uygulayabilmek") ve yol
 * haritası (src/content/roadmaps/gorevler.ts, sekilAkilYurutme: bir örüntüyü fark etmek, yeni bir durumda ne yapılacağını
 * kestirmek; döşeme desenleri, bir şarkıdaki tekrarlar). Test "yalnızca şekillerle yapılan yönünü ölçer; sözel ve sayısal akıl
 * yürütme … hakkında bilgi vermez": sayı dizisi ve sözel örnek yoktur (sayı dizilerini sitede Sayı Dizileri testi ölçer). Bir
 * işi adımlara ayırmak planlamadır (Kule Görevi); sudoku ve satrançta kurallar oyuncuya verilir, kural bulmayı değil
 * uygulamayı ister: bu örnekler de kullanılmaz. Örnekler tanımlayıcıdır; zekâ puanı ya da sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const sekilAkilYurutmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sekil-akil-yurutme-gunluk-1',
  skills: [
    {
      key: 'sekil-akil-yurutme',
      title: 'Kural bulma ve uygulama',
      short: 'Kural bulma',
      text: 'Bu beceri, şekillerdeki bir düzeni fark edip kuralını bulmak ve o kuralı yeni bir duruma uygulamak gereken işlerde kullanılır.',
      branches: {
        school: 'Şekil örüntüleri',
        friends: 'Örüntü bulmacaları',
        home: 'Desendeki tekrar',
        work: 'Düzeni fark edip kestirmek',
      },
      student: {
        school: 'Matematik dersinde bir şekil örüntüsünün devamını bulmak bu tür bir iştir.',
        friends: 'Arkadaşlarınla “Sıradaki hangisi?” bulmacaları çözmek de kural bulmayı ister.',
        home: 'Bir kumaş desenindeki ya da bir şarkıdaki tekrarı fark etmek de örüntü bulmaktır.',
      },
      parent: {
        school: 'Çocuğunuzun matematik dersinde bir şekil örüntüsünün devamını bulması bu tür bir iştir.',
        friends: 'Arkadaşlarıyla “Sıradaki hangisi?” bulmacaları çözmek de kural bulmayı ister.',
        home: 'Bir kumaş desenindeki ya da bir şarkıdaki tekrarı fark etmek de örüntü bulmaktır.',
      },
      adult: {
        work: 'Tekrar eden bir düzeni fark edip yeni bir durumda ne yapılacağını kestirmek bu tür bir iştir.',
      },
    },
  ],
};
