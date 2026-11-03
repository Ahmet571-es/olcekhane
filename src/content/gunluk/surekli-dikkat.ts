import type { SkillsDaily } from './types';

/**
 * Sürekli Dikkat: Harf İşaretleme: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("aranan harfleri benzer harfler arasından ayırt edebilmeyi (seçici dikkat), bunu birkaç dakika
 * boyunca aynı hız ve özenle sürdürebilmeyi (sürekli dikkat) ve çalışma hızını"; "uzun bir metni dikkatle okumak, sınavda
 * soruları gözden kaçırmadan çözmek") ve yol haritası (src/content/roadmaps/gorevler.ts, surekliDikkat: uzun ve tekdüze bir
 * işte odağı korumak). Rapor bu ölçüleri dört kartta verir (çalışma hızı, hedefleri bulma, net doğru, dikkati sürdürme);
 * hepsi tek bir görevden gelir ve günlük karşılıkları aynı işlerdir: burada tek kart vardır. Örneklerin hepsi uzun süren ve
 * benzerleri arasından aranan şeyi ayırt etmeyi isteyen işlerdir. Tanıtımdaki "yazılan bir metindeki hataları fark etmek"
 * örneği Simge Bulma'nın örneğine ("bir yazıda hata aramak") çok yakın olduğu için kullanılmaz. Test tanı koymaz; örnekler
 * tanımlayıcıdır, sonucun bu işlerde ne olacağını söylemez.
 */
export const surekliDikkatDaily: SkillsDaily = {
  kind: 'skills',
  version: 'surekli-dikkat-gunluk-1',
  skills: [
    {
      key: 'harf',
      title: 'Sürekli dikkat',
      short: 'Sürekli dikkat',
      text: 'Bu beceri, uzun süre aynı işe odaklanıp hem hızlı hem dikkatli çalışmayı gerektiren işlerde kullanılır. Benzer şeyler arasından aranan şeyi ayırt etmek de bunun bir parçasıdır.',
      branches: {
        school: 'Uzun çalışmada özeni korumak',
        friends: 'Kelime avı bulmacası',
        home: 'Pirinç ayıklamak',
      },
      student: {
        school: 'Uzun bir ödevde ya da sınavda son sorulara kadar aynı özenle çalışmak bu beceriyi kullanır.',
        friends: 'Kelime avı bulmacasında uzun süre harfler arasında kelime aramak bu beceriyi kullanır.',
        home: 'Pirinç ayıklarken taşları sonuna kadar gözden kaçırmamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun uzun bir ödevde ya da sınavda son sorulara kadar aynı özenle çalışması bu beceriyi kullanır.',
        friends: 'Kelime avı bulmacasında uzun süre harfler arasında kelime aramak bu beceriyi kullanır.',
        home: 'Pirinç ayıklarken taşları sonuna kadar gözden kaçırmamak bu tür bir iştir.',
      },
    },
  ],
};
