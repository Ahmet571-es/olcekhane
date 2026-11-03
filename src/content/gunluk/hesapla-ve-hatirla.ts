import type { SkillsDaily } from './types';

/**
 * Çalışma Belleği: Hesapla ve Hatırla: günlük hayatta nerede kullanılır (5. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("bilgiyi kısa bir süre akılda tutarken aynı anda başka bir iş yapabilmeyi"; "dikkat başka bir işe
 * giderken bilgiyi koruyabilmeyi ve sonra geri getirebilmeyi") ve raporun kartı (src/lib/reports/build.ts: "birini dinlerken
 * söylenenleri aklında tutup bir yandan başka bir şey yapmak"). Örneklerin hepsinde bir bilgi akılda tutulurken araya başka
 * bir iş girer (yazmak, sohbet etmek, sofra kurmak, form doldurmak). Yetişkinin ev satırı evde başka birini varsaymaz. Testin işlem kısmı "matematik becerisini ölçmek için
 * değil, harfleri akılda tutmayı zorlaştırmak için vardır": hesap ya da zihinden işlem örneği yoktur (raporun ve yol
 * haritasının "zihinden işlem yaparken ara sonuçları akılda tutmak" örneği bu yüzden kullanılmaz). Bilgiyi yalnızca
 * kullanana kadar tutmak (sayfa numarası: Dikkat ve Bellek'teki sayı dizisi) ve sürekli güncellemek (skor: Geriye Dönük
 * Hatırlama) da burada yoktur. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağını söylemez.
 */
export const hesaplaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'hesapla-ve-hatirla-gunluk-1',
  skills: [
    {
      key: 'hesapla-ve-hatirla',
      title: 'Araya iş girerken akılda tutma',
      short: 'Akılda tutma',
      text: 'Bu beceri, bir bilgiyi akılda tutarken aynı anda başka bir iş yapmayı gerektiren işlerde kullanılır. Araya giren iş bitince bilgiyi geri getirmek de bunun bir parçasıdır.',
      branches: {
        school: 'Yazarken dinlemek',
        friends: 'Sohbette saati tutmak',
        home: 'Sofra kurarken tutmak',
        work: 'Form doldururken tutmak',
      },
      student: {
        school: 'Derste bir cümleyi yazarken söylenen sonraki cümleyi aklında tutmak bu beceriyi kullanır.',
        friends: 'Arkadaşının söylediği buluşma saatini, sohbet sürerken aklında tutmak bu beceriyi kullanır.',
        home: 'Sofrayı kurarken birinin istediği şeyi aklında tutmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun derste bir cümleyi yazarken söylenen sonraki cümleyi aklında tutması bu beceriyi kullanır.',
        friends: 'Bir arkadaşın söylediği buluşma saatini, sohbet sürerken akılda tutmak bu beceriyi kullanır.',
        home: 'Sofra kurulurken birinin istediği şeyi akılda tutmak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir form doldururken karşındakinin söylediği bir bilgiyi aklında tutmak bu tür bir iştir.',
        home: 'Sofrayı kurarken eksik bir şeyi, elindeki işi bitirene kadar aklında tutmak bu tür bir iştir.',
      },
    },
  ],
};
