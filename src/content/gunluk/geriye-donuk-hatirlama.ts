import type { SkillsDaily } from './types';

/**
 * Geriye Dönük Hatırlama: günlük hayatta nerede kullanılır (5. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı ("çalışma belleğinin güncellenmesini, yani az önceki bilgiyi akılda tutup yeni gelen bilgiyle
 * sürekli karşılaştırabilmeyi"; "uzun bir cümleyi okurken başını akılda tutmak ya da bir konuşmayı izlemek") ve yol haritası
 * (src/content/roadmaps/gorevler.ts, geriyeDonuk: bir sohbeti takip etmek, bir oyunun skorunu takip etmek). Örneklerin hepsinde
 * akıldaki bilgi yeni gelen bilgiyle yenilenir. Tanıtımdaki "zihinden işlem yapmak" örneği kullanılmaz: hesap becerisini
 * Zihinden Hesaplama Hızı ölçer. Bilgiyi bir iş yaparken korumak (Hesapla ve Hatırla) ve sıraya koymak (Harf-Sayı Sıralama)
 * da bu dosyada yoktur. Test "gündelik hayattaki bellek hakkında" bilgi vermez: örnekler unutkanlıktan söz etmez; sonucun bu
 * işlerde ne olacağını söylemez.
 */
export const geriyeDonukDaily: SkillsDaily = {
  kind: 'skills',
  version: 'geriye-donuk-hatirlama-gunluk-1',
  skills: [
    {
      key: 'geriye-donuk',
      title: 'Akıldaki bilgiyi güncelleme',
      short: 'Güncelleme',
      text: 'Bu beceri, az önceki bilgiyi akılda tutup yeni gelen bilgiyle sürekli karşılaştırmayı gerektiren işlerde kullanılır. Akıldaki bilgi her yeni adımda yenilenir.',
      branches: {
        school: 'Anlatımı izlemek',
        friends: 'Skoru akılda tutmak',
        home: 'Uzun cümleyi izlemek',
      },
      student: {
        school: 'Derste az önce söyleneni yeni söylenenle karşılaştırarak anlatımı izlemek bu beceriyi kullanır.',
        friends: 'Bir oyunda skor her değiştiğinde aklındaki skoru yenilemek bu beceriyi kullanır.',
        home: 'Kitap okurken uzun bir cümlenin başını aklında tutmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun derste az önce söyleneni yeni söylenenle karşılaştırarak anlatımı izlemesi bu beceriyi kullanır.',
        friends: 'Bir oyunda skor her değiştiğinde akıldaki skoru yenilemek bu beceriyi kullanır.',
        home: 'Kitap okurken uzun bir cümlenin başını akılda tutmak bu tür bir iştir.',
      },
    },
  ],
};
