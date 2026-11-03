import type { SkillsDaily } from './types';

/**
 * Planlama: Kule Görevi: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("bir hedefe ulaşmak için gereken adımları başlamadan önce kafada sıraya koyabilmek"; bazı
 * problemlerde "bir topun önce geçici bir yere konması gerekir ve bu, ileriyi düşünmeyi gerektirir") ve yol haritası
 * (src/content/roadmaps/gorevler.ts, planlamaKuleGorevi: dama ya da satrançta bir hamle sonrasını düşünmek, adımları sırayla
 * söylemek). Test "günlük hayattaki planlama (bir işi zamana yaymak gibi) hakkında doğrudan bilgi vermez": zaman planı
 * örneği yoktur (yol haritasındaki "bir yere zamanında varmak için ne zaman yola çıkmak gerektiği" örneği bu yüzden
 * kullanılmaz). Her seferinde aynı problemler gelir: örnekler problemlerin konusunu (renkli toplar, çubuklar) anmaz. Evdeki
 * örnek (rafı düzenlerken bir eşyayı önce kenara almak) görevdeki "geçici bir yere koyma"nın günlük karşılığıdır. Örnekler
 * tanımlayıcıdır; sonucun bu işlerde ne olacağını söylemez.
 */
export const kuleDaily: SkillsDaily = {
  kind: 'skills',
  version: 'planlama-kule-gorevi-gunluk-1',
  skills: [
    {
      key: 'planlama-kule-gorevi',
      title: 'Planlama',
      short: 'Planlama',
      text: 'Bu beceri, bir hedefe ulaşmak için gereken adımları başlamadan önce kafada sıraya koymayı gerektiren işlerde kullanılır. Bir şeyi önce geçici bir yere koymanın gerektiğini görmek de bunun bir parçasıdır.',
      branches: {
        school: 'Soruda adımları sıralamak',
        friends: 'Hamleyi önceden düşünmek',
        home: 'Rafı düzenlemek',
        work: 'Adımları önceden sıralamak',
      },
      student: {
        school: 'Çok adımlı bir soruya başlamadan adımları kafanda sıralamak bu beceriyi kullanır.',
        friends: 'Dama ya da satrançta bir hamlenin sonrasını önceden düşünmek de bu beceriyi kullanır.',
        home: 'Rafı düzenlerken hangi eşyayı önce kenara alacağını düşünmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun çok adımlı bir soruya başlamadan adımları kafasında sıralaması bu beceriyi kullanır.',
        friends: 'Dama ya da satrançta bir hamlenin sonrasını önceden düşünmek de bu beceriyi kullanır.',
        home: 'Rafı düzenlerken hangi eşyanın önce kenara alınacağını düşünmek bu tür bir iştir.',
      },
      adult: {
        work: 'Bir işe başlamadan önce adımları kafanda sıraya koymak bu tür bir iştir.',
      },
    },
  ],
};
