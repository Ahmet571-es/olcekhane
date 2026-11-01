import type { SkillsDaily } from './types';

/**
 * Sesli Okuma Değerlendirmesi: günlük hayatta nerede kullanılır (1–8. sınıf; yetişkinlere açık değil).
 * Kartlar testin ölçülerini iki beceride toplar (`covers`): doğru okuma, hız ve akıcılık → sesli ve akıcı okuma; anlama ve
 * yeniden anlatma → okuduğunu anlama ve anlatma. Kaynak: testin tanıtımı (metni sesli okumak, kendi cümleleriyle anlatmak,
 * soruları cevaplamak) ve ölçülerin tanımları (src/content/instruments/sesli-okuma/index.ts). Öğrenci metni 1. sınıftaki bir
 * çocuğun da anlayacağı kadar kısadır. Veli ve öğretmen raporu raporun geri kalanı gibi öğrenciden üçüncü kişi olarak söz eder
 * ("öğrenci", "çocuğunuz" değil).
 */
export const sesliOkumaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sesli-okuma-gunluk-1',
  skills: [
    {
      key: 'sesli-okuma',
      covers: ['accuracy', 'rate', 'prosody'],
      title: 'Sesli ve akıcı okuma',
      short: 'Sesli okuma',
      text: 'Sesli okuma; kelimeleri doğru okumayı, akıcı ilerlemeyi ve anlama uygun bir sesle okumayı kapsar.',
      branches: { school: 'Sınıfta okumak', friends: 'Oyun kartı okumak', home: 'Masal okumak' },
      student: {
        school: 'Sınıfta bir metni yüksek sesle okumak bu tür bir iştir.',
        friends: 'Bir oyunun kartındaki yazıyı arkadaşlarına okumak da sesli okumadır.',
        home: 'Bir masalı ya da gelen bir mesajı yüksek sesle okumak bu beceriyi kullanır.',
      },
      parent: {
        school: 'Öğrencinin sınıfta bir metni yüksek sesle okuması bu tür bir iştir.',
        friends: 'Bir oyunun kartındaki yazıyı arkadaşlarına okumak da sesli okumadır.',
        home: 'Bir masalı ya da gelen bir mesajı yüksek sesle okumak bu beceriyi kullanır.',
      },
    },
    {
      key: 'anlama',
      covers: ['comprehension', 'retell'],
      title: 'Okuduğunu anlama ve anlatma',
      short: 'Anlama ve anlatma',
      text: 'Bu beceri; okunan metindeki bilgiyi hatırlamayı, ipuçlarından çıkarım yapmayı ve metni kendi cümleleriyle anlatmayı kapsar.',
      branches: { school: 'Okuduğunu anlatmak', friends: 'Kuralı anlatmak', home: 'Öyküyü anlatmak' },
      student: {
        school: 'Okuduğun bir metni kendi cümlelerinle anlatmak bu tür bir iştir.',
        friends: 'Bir oyunun kurallarını okuyup arkadaşlarına anlatmak da bu beceriyi ister.',
        home: 'Okuduğun bir öyküyü evde birine anlatmak bu beceriyi kullanır.',
      },
      parent: {
        school: 'Öğrencinin okuduğu bir metni kendi cümleleriyle anlatması bu tür bir iştir.',
        friends: 'Bir oyunun kurallarını okuyup arkadaşlarına anlatmak da bu beceriyi ister.',
        home: 'Okunan bir öyküyü evde birine anlatmak bu beceriyi kullanır.',
      },
    },
  ],
};
