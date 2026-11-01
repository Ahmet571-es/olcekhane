import type { SkillsDaily } from './types';

/**
 * Okuma Hızı ve Anlama: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("önemli olan anlayarak okumaktır"), raporun soru türleri (metindeki bilgiyi bulma, çıkarım,
 * kelime anlamı, ana fikir; lib/reports/reading-parts.ts) ve yol haritası (src/content/roadmaps/okuma.ts: öykü, haber,
 * bilgilendirici yazı). Kartlar raporun iki ölçüsüne karşılık gelir: anlama ve okuma hızı. Örnekler 3. sınıftaki bir
 * çocuğun da tanıyacağı işlerdir; hız ile anlamanın birlikte düşünüldüğü söylenir (hız tek başına bir hedef değildir).
 */
export const okumaHiziDaily: SkillsDaily = {
  kind: 'skills',
  version: 'okuma-hizi-gunluk-1',
  skills: [
    {
      key: 'comprehension',
      title: 'Okuduğunu anlama',
      short: 'Okuduğunu anlama',
      text: 'Okuduğunu anlamak; metindeki bir bilgiyi bulmayı, açıkça yazmayanı ipuçlarından çıkarmayı ve metnin ana fikrini görmeyi kapsar.',
      branches: {
        school: 'Kitapta bilgi bulmak',
        friends: 'Oyun kurallarını okumak',
        home: 'Tarifi izlemek',
      },
      student: {
        school: 'Ders kitabında aradığın bilgiyi bulmak bu beceriyi kullanır. Bir problemin ne sorduğunu anlamak da bunu ister.',
        friends: 'Bir oyunun kurallarını okuyup anlamak bu tür bir iştir. Bir mesajdaki şakayı anlamak da bu beceriyi ister.',
        home: 'Bir tarifteki adımları sırayla izlemek bu tür bir iştir. Bir öyküde birinin neden öyle davrandığını anlamak da bunu ister.',
      },
      parent: {
        school: 'Çocuğunuzun ders kitabında aradığı bilgiyi bulması bu beceriyi kullanır. Bir problemin ne sorduğunu anlamak da bunu ister.',
        friends: 'Bir oyunun kurallarını okuyup anlamak bu tür bir iştir. Bir mesajdaki şakayı anlamak da bu beceriyi ister.',
        home: 'Bir tarifteki adımları sırayla izlemek bu tür bir iştir. Bir öyküde birinin neden öyle davrandığını anlamak da bunu ister.',
      },
    },
    {
      key: 'speed',
      title: 'Okuma hızı',
      short: 'Okuma hızı',
      text: 'Okuma hızı, bir metni okumak için gereken süreyi gösterir. Hız tek başına bir hedef değildir; anlamayla birlikte düşünülür.',
      branches: {
        school: 'Soruları okumak',
        friends: 'Altyazıları okumak',
        home: 'Kitap okumak',
      },
      student: {
        school: 'Bir sınavda soruları zamanında okuyup bitirmek akıcı okumayı ister.',
        friends: 'Bir filmin altyazısını zamanında okumak da akıcı okumayı ister.',
        home: 'Bir kitabı okurken metnin akışını kaçırmadan ilerlemek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun bir sınavda soruları zamanında okuyup bitirmesi akıcı okumayı ister.',
        friends: 'Bir filmin altyazısını zamanında okumak da akıcı okumayı ister.',
        home: 'Bir kitabı okurken metnin akışını kaçırmadan ilerlemek bu tür bir iştir.',
      },
    },
  ],
};
