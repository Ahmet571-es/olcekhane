import type { SymbolMatchTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Görsel Algı Hızı: Sembol Arama
 *
 * Tamamen özgün bir görevdir. Hedef bir sembol gösterilir ve öğrenci bunun satırdaki semboller arasında olup olmadığını hızlıca bulur.
 * Mevcut sembol eşleştirme altyapısı kullanılmıştır; ticari testlerin sayfaları, sembolleri veya normları kullanılmaz.
 */

const gorselAlgi: SymbolMatchTask = {
  key: 'gorsel-algi',
  kind: 'symbol_match',
  name: 'Sembol Arama',
  measures: 'Görsel algı hızı: hedef sembolü benzer semboller arasında hızlıca bulabilme.',
  instructions: [
    'Ekranda üstte bir hedef sembol göreceksin. Altında bir satır sembol var.',
    'Hedef sembol satırda varsa uygun düğmeye bas. Hem hızlı hem dikkatli ol.',
    'Görev süre sınırlıdır. Alıştırmadan sonra asıl bölüm başlar.',
  ],
  durationMs: 90_000,
  symbols: ['circle', 'square', 'triangle', 'diamond', 'star', 'cross', 'plus', 'hexagon', 'pentagon'],
  practice: [0, 2, 1, 4, 3],
  sequence: [1, 0, 3, 2, 5, 4, 7, 6, 8, 1, 2, 0, 4, 3, 6, 5, 8, 7, 1, 3, 2, 5, 4, 7, 6, 0, 8, 2, 1, 4],
};

export const gorselAlgiHizi: TaskInstrument = {
  slug: 'gorsel-algi-hizi',
  version: 1,
  engine: 'tasks',
  name: 'Görsel Algı Hızı',
  shortName: 'Görsel algı',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 6,
  sortOrder: 63,
  tagline: 'Hedef bir sembolü benzer semboller arasında hızlıca bulabilmeyi, yani görsel algı hızını ölçer.',
  description:
    'Bu görev, görsel algı hızını ölçer: üstte gösterilen bir hedef sembolü alttaki satırda hızlıca bulup doğru tepki vermek. Yaklaşık 6 dakika sürer. Rapor; doğru sayısını, hızı ve çalışma biçimini sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Sembolü bul!',
    paragraphs: [
      'Birazdan üstte bir hedef sembol göreceksin. Altında bir satır sembol var. Hedefi hızlıca bul.',
      'Önce kısa bir alıştırma yapacaksın, sonra asıl görev başlayacak.',
      'Sessiz bir yerde yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'ga_dogru', name: 'Doğru sayısı', plain: 'Doğru bulunan sembol sayısı.' },
    { key: 'ga_hiz', name: 'Algı hızı', plain: 'Dakikada doğru bulunan sembol sayısı.' },
    { key: 'ga_dogruluk', name: 'Doğruluk', plain: 'Verilen cevaplar içinde doğru olanların oranı.' },
  ],
  tasks: [gorselAlgi],
  science: {
    basedOn:
      'Klasik sembol arama ve görsel tarama görevlerine dayanan özgün bir düzen. Semboller, süre, puanlama ve rapor Ölçekhane tarafından hazırlanmıştır; ticari testlerin materyalleri kullanılmaz.',
    whatItMeasures:
      'Görsel algı hızını ve seçici dikkati ölçer: hedef bir sembolü benzerleri arasında hızlıca bulabilme becerisi. Bu beceri okuma, matematik sorularını tarama ve günlük görsel aramalarda kullanılır.',
    turkishVersion: 'Özgün görev. Yönergeler Türkçedir.',
    reliability:
      'Pilot aşamasındadır. Güvenirlik çalışması henüz yapılmadı. Benzer görsel tarama görevlerinde iç tutarlılık genellikle yüksektir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok. Sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır.',
    ageNote: '3. sınıftan itibaren uygulanır. Tablet veya bilgisayar önerilir.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Tanı koymaz. Dikkat veya öğrenme güçlüğü değerlendirmesi değildir.',
      'Sonuç yorgunluk, ortam ve cihazdan etkilenir.',
      'Pilot aşamasındadır; güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Treisman, A. M. ve Gelade, G. (1980). A feature-integration theory of attention. Cognitive Psychology, 12(1), 97–136.',
        url: 'https://doi.org/10.1016/0010-0285(80)90005-5',
      },
    ],
  },
};
