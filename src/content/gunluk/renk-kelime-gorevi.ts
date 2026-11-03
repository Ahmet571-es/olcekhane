import type { SkillsDaily } from './types';

/**
 * Renk-Kelime Görevi: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("otomatik hâle gelmiş bir cevabı (kelimeyi okumayı) durdurup göreve uygun cevabı (yazının
 * rengini) verebilmek"; "bir kuralı uygularken alışkanlıklara kapılmamak") ve yol haritası (src/content/roadmaps/gorevler.ts,
 * renkKelime: "değildir", "yanlıştır" gibi soru köklerinde alışkanlıkla verilen cevap). Örneklerin hepsinde alışkanlıkla gelen
 * bir cevap vardır ve yerine başka bir cevap verilir; bu, bu görevi Dur-Git Görevi'nden ayırır (orada alışkanlık hâline
 * gelmiş hareket hiç yapılmaz: sıra beklemek, heykel oyunu). İki kural arasında gidip gelmeyi Kural Değiştirme ölçer: burada
 * kural tektir. Renk-kelime etkisi raporda yalnızca betimleyici olarak verilir; örnekler tanımlayıcıdır, sonucun bu işlerde ne
 * olacağını söylemez.
 */
export const renkKelimeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'renk-kelime-gorevi-gunluk-1',
  skills: [
    {
      key: 'renk-kelime',
      title: 'Alışkanlıkla gelen cevabı durdurma',
      short: 'Cevabı durdurma',
      text: 'Bu beceri, alışkanlıkla gelen ilk cevabı durdurup durumun istediği cevabı vermeyi gerektiren işlerde kullanılır.',
      branches: {
        school: 'Olumsuz soruyu cevaplamak',
        friends: 'Ters komut oyunları',
        home: 'Yeri değişen eşyayı bulmak',
      },
      student: {
        school: 'Soruda “değildir” yazınca alışkanlıkla doğru olan şıkkı seçmemek bu tür bir iştir.',
        friends: '“Sağ” denince sola, “sol” denince sağa dönülen ters oyunlar da bu beceriyi kullanır.',
        home: 'Yeri değişen bir eşyayı alışkanlıkla eski yerinde aramamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun soruda “değildir” yazınca alışkanlıkla doğru olan şıkkı seçmemesi bu tür bir iştir.',
        friends: '“Sağ” denince sola, “sol” denince sağa dönülen ters oyunlar da bu beceriyi kullanır.',
        home: 'Yeri değişen bir eşyayı alışkanlıkla eski yerinde aramamak bu tür bir iştir.',
      },
    },
  ],
};
