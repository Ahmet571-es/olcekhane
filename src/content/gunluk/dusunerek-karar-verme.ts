import type { SkillsDaily } from './types';

/**
 * Düşünerek Karar Verme: günlük hayatta nerede kullanılır (5. sınıftan yetişkine).
 * Rapor doğru cevapları sayısal ve sözel sorularda ayrı gösterir, ama testin tek bir görevi vardır: bir kart, ikisini de
 * anlatır (tanımın ikinci cümlesi; okul ve oyun örnekleri dikkatli okumayı, ev ve iş örnekleri biraz hesabı ister).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (ilk akla gelen ama yanlış olan cevabı fark edip durup düşünerek doğru cevaba
 * ulaşmak; soruların bir kısmı biraz hesap, bir kısmı yalnızca dikkatli okuma ister) ve yol haritası
 * (src/content/roadmaps/gorevler.ts, dusunerekKararVerme: bir indirimin gerçekten ucuz olup olmadığını hesaplamak, bir
 * yönergeyi yanlış anlamamak; bir bilmecede ilk akla gelen cevabı sınamak). Test "kısa sorularla ölçer; günlük hayattaki bütün
 * kararlar hakkında bilgi vermez": örnekler kişinin kararlarının iyi ya da kötü olduğunu söylemez, yalnızca ilk akla gelen
 * cevabı durup denetlemeyi isteyen işleri anlatır. Yol haritasındaki "bir haberin ya da iddianın doğruluğunu sorgulamak"
 * Mantıksal Akıl Yürütme'nin de örneğidir (söylenenlerden kesin olarak ne çıkar?): karışmasın diye burada kullanılmaz. Testte
 * her seferinde aynı sorular geldiği için örnekler soruların konularını (tavuklar, koyunlar, horoz, koşu yarışı, makineler,
 * yosun, asansör, kuyruk…) kullanmaz (tests/helpers/gunluk-excluded.ts, `EXCLUDED`). Fiyat soruları da vardır (dk02 dergi ile muz,
 * dk19 defter ile kalem: "ikisi birlikte … lira, biri ötekinden … pahalı"); ev ve iş örneklerindeki fiyatlar bu düzende
 * değildir (indirim, teklifteki tutar). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const dusunerekKararVermeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'dusunerek-karar-verme-gunluk-1',
  skills: [
    {
      key: 'dusunerek-karar-verme',
      title: 'Düşünerek karar verme',
      short: 'Durup düşünme',
      text: 'Bu beceri, ilk akla gelen cevabı hemen kabul etmeyip durup denetlemeyi gerektiren işlerde kullanılır. Bu işlerin bir kısmı biraz hesap, bir kısmı dikkatli okuma ister.',
      branches: {
        school: 'Soruyu yeniden okumak',
        friends: 'Şaşırtmaca sorular',
        home: 'İndirimi hesaplamak',
        work: 'Tutarı denetlemek',
      },
      student: {
        school: 'Sınavda kolay görünen bir soruyu cevaplamadan önce yeniden okumak bu tür bir iştir.',
        friends: 'Şaşırtmaca sorularda ilk akla gelen cevabı durup denetlemek bu beceriyi ister.',
        home: '“İkincisi yarı fiyatına” gibi bir indirimde ödenecek tutarı durup hesaplamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun sınavda kolay görünen bir soruyu cevaplamadan önce yeniden okuması bu tür bir iştir.',
        friends: 'Şaşırtmaca sorularda ilk akla gelen cevabı durup denetlemek bu beceriyi ister.',
        home: '“İkincisi yarı fiyatına” gibi bir indirimde ödenecek tutarı durup hesaplamak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir teklifteki tutarı ilk bakışta kabul etmeyip durup hesaplamak bu tür bir iştir.',
      },
    },
  ],
};
