import type { SkillsDaily } from './types';

/**
 * Dur-Git Görevi: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("alışkanlık hâline gelmiş bir tepkiyi (basmayı) gerektiğinde vermeden durabilmek"; "sırasını
 * beklemek, düşünmeden cevap vermemek ya da hızlı bir işin içinde bir kuralı uygulamak") ve yol haritası
 * (src/content/roadmaps/gorevler.ts, durGit: sözü kesmeden sırasını beklemek). Örneklerin hepsinde yapılmak üzere olan bir
 * hareket ya da söz durdurulur; yerine başka bir cevap verilmez (alışkanlıkla gelen cevabın yerine başka bir cevap vermeyi
 * Renk-Kelime Görevi ölçer). Raporun ikinci ölçüsü (öteki harflerde kaçırmadan basmak) tanımın ikinci cümlesindedir. Test
 * "gündelik hayattaki dürtüsellik ya da dikkat hakkında" bilgi vermez: örnekler kişiyi tanımlamaz ("sabırsız", "aceleci"
 * yok), yalnızca bu becerinin kullanıldığı yerleri söyler. Yol haritasındaki "mesajı göndermeden önce durmak" örneği 3.
 * sınıfa açık bir testte telefon varsaydığı için kullanılmaz.
 */
export const durGitDaily: SkillsDaily = {
  kind: 'skills',
  version: 'dur-git-gorevi-gunluk-1',
  skills: [
    {
      key: 'dur-git',
      title: 'Durabilme',
      short: 'Durabilme',
      text: 'Bu beceri, alışkanlık hâline gelmiş bir hareketi yeri gelince yapmadan durmayı gerektiren işlerde kullanılır. Bu sırada öteki işaretleri kaçırmamak da işin bir parçasıdır.',
      branches: {
        school: 'Söz için sıra beklemek',
        friends: 'Heykel oyunu',
        home: 'Sözü kesmemek',
      },
      student: {
        school: 'Derste aklına gelen cevabı söylemek için sıranı beklemek bu tür bir iştir.',
        friends: 'Heykel oyununda müzik durur durmaz hareketi kesip kıpırdamamak bu beceriyi kullanır.',
        home: 'Evdekilerden biri konuşurken araya girmek istesen de sözünü kesmemek bu beceriyi kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun derste aklına gelen cevabı söylemek için sırasını beklemesi bu tür bir iştir.',
        friends: 'Heykel oyununda müzik durur durmaz hareketi kesip kıpırdamamak bu beceriyi kullanır.',
        home: 'Evdekilerden biri konuşurken araya girmek istese de sözünü kesmemek bu beceriyi kullanır.',
      },
    },
  ],
};
