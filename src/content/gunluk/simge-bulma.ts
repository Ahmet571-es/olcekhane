import type { SkillsDaily } from './types';

/**
 * İşlem Hızı: Simge Bulma: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("basit görsel bilgiyi hızlı ve doğru karşılaştırıp karar verebilmek") ve yol haritasındaki örnekler
 * (src/content/roadmaps/gorevler.ts, simgeBulma: bir listede bir adı bulmak, iki numaranın aynı olup olmadığını kontrol etmek,
 * bir yazıdaki yazım hatalarını görmek). Test "yazma ya da okuma hızı hakkında doğrudan bilgi vermez": yazı yazmaya dayanan
 * örnek (tahtadakini deftere geçirmek) ve hesap gerektiren örnek kullanılmaz. Örnekler tanımlayıcıdır: bu işler becerinin
 * kullanıldığı yerlerdir; sonucun bu işlerde ne olacağını söylemez.
 */
export const simgeBulmaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'simge-bulma-gunluk-1',
  skills: [
    {
      key: 'simge-bulma',
      title: 'İşlem hızı',
      short: 'İşlem hızı',
      text: 'Bu beceri, basit görsel bilgiyi çabuk fark edip karar vermeyi gerektiren işlerde kullanılır. Bu işlerde hız kadar doğruluk da önemlidir.',
      branches: {
        school: 'Tahtayla karşılaştırmak',
        friends: 'Farkı bul oyunu',
        home: 'Listede ad bulmak',
        work: 'Tabloda kayıt bulmak',
      },
      student: {
        school: 'Yazdığın bir cevabı tahtadakiyle karşılaştırmak ya da bir yazıda hata aramak bu tür işlerdir.',
        friends: 'İki resim arasındaki farkları bulma oyunu da bu beceriyi kullanır.',
        home: 'Bir listede bir adı aramak ya da iki numarayı karşılaştırmak bu tür işlerdir.',
      },
      parent: {
        school: 'Çocuğunuzun yazdığı bir cevabı tahtadakiyle karşılaştırması ya da bir yazıda hata araması bu tür işlerdir.',
        friends: 'İki resim arasındaki farkları bulma oyunu da bu beceriyi kullanır.',
        home: 'Bir listede bir adı aramak ya da iki numarayı karşılaştırmak bu tür işlerdir.',
      },
      adult: {
        work: 'Bir tabloda bir kaydı bulmak ya da bir yazıda hata aramak bu tür işlerdir.',
        home: 'Bir listede bir adı aramak ya da bir faturadaki numarayı başka bir belgeyle karşılaştırmak bu tür işlerdir.',
      },
    },
  ],
};
