/**
 * Hazırlanan testler. Katalogda "Hazırlanıyor" etiketiyle gösterilir; bağlantı verilmez.
 * Burada yalnızca lisans durumu netleşmiş ya da özgün olarak geliştirilen araçlar yer alır.
 */
export interface UpcomingTest {
  key: string;
  name: string;
  domain: 'personality' | 'career' | 'academic' | 'cognitive' | 'wellbeing' | 'skills';
  measures: string;
  basedOn: string;
  grades: string;
}

export const UPCOMING: UpcomingTest[] = [
  {
    key: 'sinav-kaygisi',
    name: 'Sınav Kaygısı (lise ve YKS)',
    domain: 'academic',
    measures: 'Sınav sırasında ve öncesinde yaşanan bilişsel kaygı',
    basedOn: 'Bilişsel Sınav Kaygısı Ölçeği (Cassady), Türkçe uyarlama: Bozkurt ve ark., 2017',
    grades: '11. sınıf ve üzeri',
  },
  {
    key: 'turkce-tani',
    name: 'Türkçe Tanı Testi',
    domain: 'academic',
    measures: 'Bir önceki sınıfın dil bilgisi, yazım-noktalama ve sözcük bilgisi konularında güçlü ve eksik noktalar',
    basedOn: 'Özgün sorular; ortaokul Türkçe öğretim programının temel konularına göre, Matematik Tanı Testi ile aynı yapıda',
    grades: '5.–8. sınıf',
  },
];
