import type { SkillsDaily } from './types';

/**
 * Harf Dizileri: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (harfler arasında "aynı harf" ve "sıradaki harf" gibi ilişkileri aramak,
 * dizinin kaç harfte bir tekrarlandığını bulmak, kuralı sürdürmek; "alfabede rahatça ileri geri sayabilmek işi
 * kolaylaştırır") ve yol haritası (src/content/roadmaps/gorevler.ts, harfDizileri: örneklerden bir kural çıkarmak ve onu yeni
 * durumlarda denemek). Test "akıl yürütmenin yalnızca harf dizileriyle yapılan yönünü ölçer … Şekillerle ve sayılarla akıl
 * yürütme, bilgi, bellek ve hız … hakkında bilgi vermez": şekil ve sayı örneği yoktur. Kelimelerin anlamı Kelime Bilgisi'nin
 * konusudur; örnekler kelimelere değil, harflerin alfabedeki sırasına dayanır. Bir sözlükte kelime aramak ya da bir listeyi
 * alfabe sırasıyla dizmek kural bulmayı değil, bilinen sırayı uygulamayı ister: kullanılmaz; raf örneğinde de harfler birer
 * harf atlanarak verilir, yani önce kuralın bulunması gerekir. Harf dizisi bir Türkçe dersi etkinliği değildir: okul örneği bir
 * etkinlik kâğıdıdır. Şifreli not örneğinde harflerin
 * alfabede kaydırıldığı kural çözülerek bulunur. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const harfDizileriDaily: SkillsDaily = {
  kind: 'skills',
  version: 'harf-dizileri-gunluk-1',
  skills: [
    {
      key: 'harf-dizileri',
      title: 'Harflerle kural bulma',
      short: 'Harflerle kural',
      text: 'Bu beceri, harfler arasındaki ilişkiyi bulup kuralı sürdürmeyi gerektiren işlerde kullanılır. Alfabede ileri ve geri sayarak harfler arasındaki adımı bulmak da buna girer.',
      branches: {
        school: 'Harf bulmacaları',
        friends: 'Şifreli notlar',
        home: 'Harf söyleme oyunu',
        work: 'Raflardaki harf düzeni',
      },
      student: {
        school: 'Bir etkinlik kâğıdında bir harf dizisinin kuralını bulup eksik harfi yazmak bu beceriyi ister.',
        friends: 'Bir arkadaşının şifreli notundaki harf kuralını bulup notu çözmek bu beceriyi kullanır.',
        home: 'Evdekilerden birinin alfabede atlayarak söylediği harflerin kuralını bulmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun bir etkinlik kâğıdında bir harf dizisinin kuralını bulup eksik harfi yazması bu beceriyi ister.',
        friends: 'Bir arkadaşının şifreli notundaki harf kuralını bulup notu çözmek bu beceriyi kullanır.',
        home: 'Evdekilerden birinin alfabede atlayarak söylediği harflerin kuralını bulmak bu tür bir iştir.',
      },
      adult: {
        work: 'Rafların harfleri birer harf atlanarak verilmişse bu düzeni bulup aranan rafı kestirmek bu tür bir iştir.',
      },
    },
  ],
};
