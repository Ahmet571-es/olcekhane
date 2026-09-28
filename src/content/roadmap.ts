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
    grades: '9. sınıf ve üzeri',
  },
  {
    key: 'dikkat-bellek',
    name: 'Dikkat ve Çalışma Belleği Görevleri',
    domain: 'cognitive',
    measures: 'Seçici dikkat, tepki kontrolü, çalışma belleği ve işlem hızı',
    basedOn: 'Özgün görevler (sayı dizisi, blok dizisi, hedef tarama, git/dur); IQ testi değildir',
    grades: '4. sınıf ve üzeri',
  },
  {
    key: 'akademik-tani',
    name: 'Türkçe ve Matematik Tanı Testleri',
    domain: 'academic',
    measures: 'Sınıf düzeyindeki temel kazanımlarda güçlü ve eksik konular',
    basedOn: 'Özgün sorular, MEB öğretim programı kazanımlarına eşlenmiş',
    grades: '5.–8. sınıf',
  },
  {
    key: 'dayaniklilik',
    name: 'Psikolojik Dayanıklılık',
    domain: 'personality',
    measures: 'Zorluklardan sonra toparlanabilme',
    basedOn: 'Kısa Psikolojik Sağlamlık Ölçeği (Smith ve ark., 2008)',
    grades: '9. sınıf ve üzeri',
  },
];
