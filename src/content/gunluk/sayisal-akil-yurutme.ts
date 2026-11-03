import type { SkillsDaily } from './types';

/**
 * Sayısal Akıl Yürütme: günlük hayatta nerede kullanılır (5. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (bir durumdaki sayıların nasıl ilişkili olduğunu görmek: iki nicelik aynı
 * oranda mı büyüyor, aradaki fark mı korunuyor, bir başlangıç miktarı mı var, sonuç değişmiyor mu; eşittir işaretini iki
 * yanın aynı değerde olduğu biçiminde okumak) ve yol haritası (src/content/roadmaps/gorevler.ts, sayisalAkilYurutme: bir
 * tarifi kalabalık bir sofraya göre büyütmek; "tarif büyüyünce malzemeler artar ama pişme süresi aynı kalabilir"; tarif ve
 * "süre aynı kalır" ilkesi sy04, sy05, sy07 ve sy13'ün konusu olduğu için ev örneği çay demlemektir). Test
 * "sayılarla akıl yürütmenin yalnızca iki yönüne … bakar; matematik başarısını ya da konu bilgisini ölçmez": örnekler bir
 * konuyu değil, orantıyı farktan ayırmayı ve eşitliği dengelemeyi anlatır. Zihinden hızlı hesap (Zihinden Hesaplama Hızı) ve
 * sayı dizileri (Sayı Dizileri) burada yoktur. Testte her seferinde aynı sorular geldiği için örnekler soruların konularını
 * (simit, yaş farkı, limonata, gömlek kurutma, kek, taksi, koro, fidan, kumbara, koşu turları, terazi, boyacı, bisiklet…) ve
 * sayılarını kullanmaz (tests/gunluk-hayat.test.ts, `EXCLUDED`). Elle denetlendi: iki oyuncu her elde aynı sayıda puan alırsa
 * aradaki fark değişmez; iki kat çayın demlenme süresi iki katına çıkmaz; sabit bir başlangıç ücreti olan hizmette iki kat
 * kullanım iki kat ödeme değildir (sabit ücret bir kez ödenir). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const sayisalAkilYurutmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sayisal-akil-yurutme-gunluk-1',
  skills: [
    {
      key: 'sayisal-akil-yurutme',
      title: 'Sayılar arasındaki ilişki',
      short: 'Orantı ve denge',
      text: 'Bu beceri, bir durumdaki sayıların birbiriyle nasıl ilişkili olduğunu görmeyi gerektiren işlerde kullanılır. İki miktarın aynı oranda mı büyüdüğünü, aradaki farkın mı korunduğunu ayırt etmek ve eşitliği dengelemek buna girer.',
      branches: {
        school: 'Eşitliği dengelemek',
        friends: 'Puan farkı',
        home: 'Çayın demlenme süresi',
        work: 'Sabit ücretli hizmetler',
      },
      student: {
        school: 'Matematikte eşitliğin iki yanını dengeleyerek eksik sayıyı bulmak bu tür bir iştir.',
        friends: 'Bir oyunda iki oyuncu her elde aynı sayıda puan alabilir. Aradaki farkın değişmediğini görmek bu beceriyi ister.',
        home: 'Kalabalık bir sofra için iki kat çay demlerken demlenme süresinin iki katına çıkmadığını görmek bu beceriyi ister.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte eşitliğin iki yanını dengeleyerek eksik sayıyı bulması bu tür bir iştir.',
        friends: 'Bir oyunda iki oyuncu her elde aynı sayıda puan alabilir. Aradaki farkın değişmediğini görmek bu beceriyi ister.',
        home: 'Kalabalık bir sofra için iki kat çay demlerken demlenme süresinin iki katına çıkmadığını görmek bu beceriyi ister.',
      },
      adult: {
        work: 'Bazı hizmetlerde kullanımdan bağımsız sabit bir ücret vardır. İki kat kullanımın iki kat ödeme olmadığını görmek bu beceriyi ister.',
      },
    },
  ],
};
