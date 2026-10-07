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

export const UPCOMING: UpcomingTest[] = [
  {
    key: 'turkce-konu-tarama',
    name: 'Türkçe Konu Tarama Testi',
    domain: 'academic',
    measures: 'Bir önceki sınıfın dil bilgisi, yazım-noktalama ve sözcük bilgisi konularında güçlü ve eksik noktalar',
    basedOn: 'Özgün sorular; ortaokul Türkçe öğretim programının temel konularına göre, Matematik Konu Tarama Testi ile aynı yapıda',
    grades: '5.–8. sınıf',
  },
];
