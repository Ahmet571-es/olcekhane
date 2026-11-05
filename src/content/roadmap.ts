/**
 * Hazırlanan testler. Katalogda "Hazırlanıyor" etiketiyle gösterilir; bağlantı verilmez.
 * Burada yalnızca lisans durumu netleşmiş ya da özgün olarak geliştirilen araçlar yer alır.
 */
export interface UpcomingTest {
  key: string;
  name: string;
  domain: 'personality' | 'career' | 'academic' | 'reading' | 'cognitive' | 'wellbeing' | 'skills';
  measures: string;
  basedOn: string;
  grades: string;
}

// Site sahibinin 2026-11-05 kararıyla bilgi ölçen akademik test eklenmiyor (Matematik Konu Tarama kaldırıldı); Türkçe Konu
// Tarama Testi planı da buradan çıktı. Liste boşken "Hazırlanıyor" satırı hiçbir yerde görünmez.
export const UPCOMING: UpcomingTest[] = [];
