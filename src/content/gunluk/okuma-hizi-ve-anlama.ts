import type { SkillsDaily } from './types';

/**
 * Okuma Hızı ve Anlama: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("önemli olan anlayarak okumaktır"), raporun soru türleri (metinde açıkça yazan bilgiyi hatırlama,
 * çıkarım, kelime anlamı, ana fikir; lib/reports/reading-parts.ts) ve yol haritası (src/content/roadmaps/okuma.ts: öykü,
 * haber, bilgilendirici yazı). Bu testte sorular metne bakmadan cevaplanır: örnekler metinde bilgi aramayı değil, okunanı
 * anlamayı ve hatırlamayı anlatır. Okuma hızı dakikada okunan kelime sayısıdır; "akıcılık" Sesli Okuma testinin ayrı bir
 * ölçüsü olduğu için burada kullanılmaz. Kartlar raporun iki ölçüsüne karşılık gelir: anlama ve okuma hızı. Örnekler 3.
 * sınıftaki bir çocuğun da tanıyacağı işlerdir; telefon ya da mesaj varsayılmaz; hız ile anlamanın birlikte düşünüldüğü
 * söylenir (hız tek başına bir hedef değildir).
 */
export const okumaHiziDaily: SkillsDaily = {
  kind: 'skills',
  version: 'okuma-hizi-gunluk-1',
  skills: [
    {
      key: 'comprehension',
      title: 'Okuduğunu anlama',
      short: 'Okuduğunu anlama',
      text: 'Bu beceri, metinde yazan bilgiyi hatırlamayı, açıkça yazmayanı ipuçlarından çıkarmayı, kelimelerin anlamını ve ana fikri kavramayı kapsar.',
      branches: {
        school: 'Ders kitabını anlamak',
        friends: 'Oyun kurallarını okumak',
        home: 'Tarifi izlemek',
      },
      student: {
        school: 'Ders kitabında okuduğun bir konuyla ilgili soruları cevaplamak bu beceriyi kullanır. Bir problemin ne sorduğunu anlamak da bunu ister.',
        friends: 'Bir oyunun kurallarını okuyup anlamak bu tür bir iştir. Bir fıkranın esprisini anlamak da bu beceriyi ister.',
        home: 'Bir tarifteki adımları sırayla izlemek bu tür bir iştir. Bir öyküde birinin neden öyle davrandığını anlamak da bunu ister.',
      },
      parent: {
        school: 'Çocuğunuzun ders kitabında okuduğu bir konuyla ilgili soruları cevaplaması bu beceriyi kullanır. Bir problemin ne sorduğunu anlamak da bunu ister.',
        friends: 'Bir oyunun kurallarını okuyup anlamak bu tür bir iştir. Bir fıkranın esprisini anlamak da bu beceriyi ister.',
        home: 'Bir tarifteki adımları sırayla izlemek bu tür bir iştir. Bir öyküde birinin neden öyle davrandığını anlamak da bunu ister.',
      },
    },
    {
      key: 'speed',
      title: 'Okuma hızı',
      short: 'Okuma hızı',
      text: 'Bu ölçü, bir dakikada okunan kelime sayısıdır. Hız tek başına bir hedef değildir; anlamayla birlikte düşünülür.',
      branches: {
        school: 'Soruları okumak',
        friends: 'Altyazıları okumak',
        home: 'Kitap okumak',
      },
      student: {
        school: 'Bir sınavda soruları süre içinde okuyup bitirmek okuma hızını kullanır.',
        friends: 'Bir filmin altyazısını ekrandan kaybolmadan okumak da okuma hızını kullanır.',
        home: 'Bir kitabı okurken metnin akışını kaçırmadan ilerlemek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun bir sınavda soruları süre içinde okuyup bitirmesi okuma hızını kullanır.',
        friends: 'Bir filmin altyazısını ekrandan kaybolmadan okumak da okuma hızını kullanır.',
        home: 'Bir kitabı okurken metnin akışını kaçırmadan ilerlemek bu tür bir iştir.',
      },
    },
  ],
};
