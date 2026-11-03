import type { SkillsDaily } from './types';

/**
 * Tepki Hızı: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("bir şeyi görür görmez tepki verme hızını (basit tepki süresi)" ve "iki seçenekten doğrusunu seçip
 * tepki verme hızını ve doğruluğunu (seçmeli tepki süresi)"). Görevin iki bölümü tek bir görevdir; rapor iki bölümü ve
 * aralarındaki farkı ayrı kartlarda verse de günlük karşılıkları birlikte anlatılır: tek kart, tanımda iki yön. Örneklerden
 * ikisi basit tepkidir (bir hareket görülünce eli çekmek, düşen bir şeyi yakalamak), biri seçmeli tepkidir (koridorda
 * karşıdan gelene göre sağa ya da sola geçmek). Test "okul başarısı ya da spordaki beceri hakkında" bilgi vermez: spor ve maç
 * örneği yoktur; araç kullanma, trafik, çarpışma ve kaza örneği de yoktur (bu görev sürüş ya da kaza güvenliği hakkında bir
 * şey söylemez; yol haritasındaki "bisiklet sürerken" örneği bu yüzden kullanılmaz). Alışkanlık hâline gelmiş bir hareketi durdurmayı Dur-Git
 * Görevi ölçer: durma örneği yoktur. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağını söylemez.
 */
export const tepkiHiziDaily: SkillsDaily = {
  kind: 'skills',
  version: 'tepki-hizi-gunluk-1',
  skills: [
    {
      key: 'tepki-hizi',
      title: 'Tepki hızı',
      short: 'Tepki hızı',
      text: 'Bu beceri, bir şey görülür görülmez harekete geçmeyi ve iki seçenekten doğrusunu hızla seçmeyi gerektiren işlerde kullanılır.',
      branches: {
        school: 'Koridorda yol vermek',
        friends: 'El kaçırma oyunu',
        home: 'Düşen kalemi yakalamak',
      },
      student: {
        school: 'Koridorda karşıdan gelene göre hemen sağa ya da sola geçmek bu beceriyi kullanır.',
        friends: 'Biri senin elini yakalamaya uzanınca elini hemen çekmen gereken oyunlar bu beceriyi kullanır.',
        home: 'Masadan düşen bir kalemi yere değmeden yakalamaya çalışmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun koridorda karşıdan gelene göre hemen sağa ya da sola geçmesi bu beceriyi kullanır.',
        friends: 'Biri çocuğunuzun elini yakalamaya uzanınca elini hemen çekmesi gereken oyunlar bu beceriyi kullanır.',
        home: 'Masadan düşen bir kalemi yere değmeden yakalamaya çalışmak bu tür bir iştir.',
      },
    },
  ],
};
