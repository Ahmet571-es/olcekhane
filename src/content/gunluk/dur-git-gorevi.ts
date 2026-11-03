import type { SkillsDaily } from './types';

/**
 * Dur-Git Görevi: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("alışkanlık hâline gelmiş bir tepkiyi (basmayı) gerektiğinde vermeden durabilmek"; "hızlı bir
 * işin içinde bir kuralı uygulamak"). Örneklerin hepsinde süren ya da kendiliğinden gelen bir hareket bir işaretle durdurulur
 * ("süre bitti" denince yazmayı kesmek, müzik durunca kıpırdamamak, şarkıda belli bir kelimede susmak); yerine başka bir
 * cevap verilmez (alışkanlıkla gelen cevabın yerine başka bir cevap vermeyi Renk-Kelime Görevi ölçer). Raporun ikinci ölçüsü
 * (öteki harflerde kaçırmadan basmak) tanımın ikinci cümlesindedir. Test "gündelik hayattaki dürtüsellik ya da dikkat
 * hakkında" bilgi vermez ve DEHB için tanı koymaz: örnekler kişiyi tanımlamaz ("sabırsız", "aceleci" yok) ve dürtüsellik
 * belirtilerini andıran davranışları (sırasını beklemek, cevabı ortaya atmak, söz kesmek, araya girmek) kullanmaz (EXCLUDED;
 * tanıtım ve yol haritası da bu örnekleri kullanmaz). 3. sınıfa açık bir testte telefon ve mesaj varsayılmaz.
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
        school: 'Kalemi hemen bırakmak',
        friends: 'Heykel oyunu',
        home: 'Şarkıda bir yerde susmak',
      },
      student: {
        school: 'Derste “süre bitti” denince yazmayı hemen kesmek bu tür bir iştir.',
        friends: 'Heykel oyununda müzik durur durmaz hareketi kesip kıpırdamamak bu beceriyi kullanır.',
        home: 'Bildiğin bir şarkıyı söylerken belli bir kelimede susup o kelimeyi söylememek bu beceriyi kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun derste “süre bitti” denince yazmayı hemen kesmesi bu tür bir iştir.',
        friends: 'Heykel oyununda müzik durur durmaz hareketi kesip kıpırdamamak bu beceriyi kullanır.',
        home: 'Bilinen bir şarkı söylenirken belli bir kelimede susup o kelimeyi söylememek bu beceriyi kullanır.',
      },
    },
  ],
};
