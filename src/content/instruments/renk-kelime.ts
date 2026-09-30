import { constrainedOrder, rng } from '@/lib/instruments/sequences';
import type { ColorWordTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Renk-Kelime Görevi
 *
 * Stroop'un (1935) renk-kelime düzenine dayanan özgün bir görevdir: renk adları bazen kendi renginde, bazen başka
 * bir renkte yazılır ve kelimenin anlamına değil, yazının rengine göre cevap verilir. Kelimeler, renkler, deneme
 * sırası, puanlama ve rapor Ölçekhane'nindir; ticari Stroop testlerinin kartları, puanlama kuralları ya da normları
 * kullanılmaz.
 *
 * Her bölümde 48 deneme: 24 uyumlu (her renk kendi adıyla 6 kez) ve 24 uyumsuz (her kelime-renk çifti 2 kez).
 * Art arda iki denemede aynı renk ya da aynı kelime gelmez (tekrarın kolaylaştırıcı etkisi olmasın); aynı koşul
 * en çok üç kez art arda gelir. Deneme sırası sabit bir tohumla üretilir: herkes aynı denemeleri görür. Üretim
 * kuralı değişirse testin sürüm numarası artırılmalıdır.
 */

/**
 * Renkler koyu, sabit bir zemin üzerinde gösterilir (her temada aynı). Tonlar, kırmızı-yeşil renk körlüğünün
 * (protan ve deutan) benzetiminde de birbirinden belirgin biçimde ayrılacak biçimde seçildi: yeşil biraz maviye,
 * kırmızı biraz turuncuya çekiktir ve ikisinin açıklığı farklıdır. Yine de renk körlüğü olanlar için görev uygun
 * değildir (bilim kartı); görevin başındaki renk denemesi, renklerin bu ekranda ayırt edilip edilmediğine bakar.
 */
const COLORS: ColorWordTask['colors'] = [
  { name: 'KIRMIZI', ink: '#F23D2E' },
  { name: 'MAVİ', ink: '#4C8DFF' },
  { name: 'YEŞİL', ink: '#12B886' },
  { name: 'SARI', ink: '#FFE14D' },
];

type Trial = { word: number; ink: number };
const congruent = (t: Trial) => t.word === t.ink;

/** Art arda aynı renk ya da aynı kelime yok; aynı koşul en çok üç kez art arda. */
function allowed(before: Trial[], next: Trial): boolean {
  const last = before[before.length - 1];
  if (last && (last.ink === next.ink || last.word === next.word)) return false;
  const tail = before.slice(-3);
  return !(tail.length === 3 && tail.every((t) => congruent(t) === congruent(next)));
}

function block(rand: () => number): Trial[] {
  const cells: Trial[] = [];
  for (let c = 0; c < COLORS.length; c++) for (let k = 0; k < 6; k++) cells.push({ word: c, ink: c });
  for (let w = 0; w < COLORS.length; w++)
    for (let i = 0; i < COLORS.length; i++) if (w !== i) for (let k = 0; k < 2; k++) cells.push({ word: w, ink: i });
  return constrainedOrder(cells, rand, allowed);
}

const r = rng(20261101);
const trials = [...block(r), ...block(r)];

/** Alıştırma: her renk bir kez uyumlu, bir kez uyumsuz. */
const practice = constrainedOrder(
  [
    { word: 0, ink: 0 },
    { word: 1, ink: 1 },
    { word: 2, ink: 2 },
    { word: 3, ink: 3 },
    { word: 1, ink: 0 },
    { word: 3, ink: 1 },
    { word: 0, ink: 2 },
    { word: 2, ink: 3 },
  ],
  rng(20261102),
  allowed,
);

const renkKelime: ColorWordTask = {
  key: 'renk-kelime',
  kind: 'color_word',
  name: 'Renk-Kelime',
  measures: 'Ketleme: alışkanlıkla gelen cevabı (kelimeyi okumayı) durdurup doğru cevabı verebilme.',
  instructions: [
    'Ekranda renk adları göreceksin: KIRMIZI, MAVİ, YEŞİL ve SARI. Kelimeler bazen kendi renginde, bazen başka bir renkte yazılmış olacak.',
    'Kelimeyi okumaya değil, yazının rengine bak ve o rengin düğmesine bas. Örneğin MAVİ kelimesi kırmızı renkte yazılmışsa KIRMIZI düğmesine basmalısın. Bilgisayarda 1, 2, 3 ve 4 tuşlarını da kullanabilirsin.',
    'Hem hızlı hem doğru olmaya çalış. Önce renkleri tanımak için kısa bir renk denemesi ve bir alıştırma yapacaksın. Görev iki bölümden oluşur; arada kısa bir mola var.',
  ],
  colors: COLORS,
  fixationMs: 500,
  timeoutMs: 3000,
  itiMs: [500, 900],
  blocks: 2,
  // Her renk iki kez; art arda aynı renk yok.
  check: [2, 0, 3, 1, 0, 2, 1, 3],
  checkLimit: 2,
  practice,
  trials,
};

export const renkKelimeGorevi: TaskInstrument = {
  slug: 'renk-kelime-gorevi',
  version: 1,
  engine: 'tasks',
  name: 'Renk-Kelime Görevi',
  shortName: 'Renk-kelime',
  domain: 'cognitive',
  status: 'review',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 6,
  sortOrder: 56,
  tagline: 'Renk adlarının yazıldığı rengi bularak, alışkanlıkla gelen cevabı durdurup doğru cevabı verebilmeyi (ketleme) ölçer.',
  description:
    'Bu görev, psikolojide 1935’ten beri kullanılan renk-kelime düzenine dayanır: KIRMIZI, MAVİ, YEŞİL ve SARI kelimeleri bazen kendi renginde, bazen başka bir renkte yazılır ve kelimenin kendisine değil, yazıldığı renge göre cevap verilir. Okumak çok otomatik bir alışkanlık olduğu için kelime ile renk farklı olduğunda çoğu kişi biraz yavaşlar ve daha çok hata yapar. Görev iki bölümden oluşur ve yaklaşık 6 dakika sürer. Rapor; doğru cevapları, cevap hızını ve bu yavaşlamanın büyüklüğünü sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Rengi bul, kelimeyi değil',
    paragraphs: [
      'Birazdan renk adları göreceksin; her biri bir renkte yazılmış olacak. Görevin, kelimeyi değil, yazının rengini bulmak.',
      'Önce renkleri tanımak için kısa bir renk denemesi ve bir alıştırma yapacaksın. Görev iki bölümden oluşur; arada kısa bir mola var.',
      'Renkleri birbirinden ayırt etmekte zorlanıyorsan (renk körlüğü) bu görev sana uygun değildir. Renk denemesinde renkleri karıştırırsan raporuna bununla ilgili bir not eklenir.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'renk_dogruluk', name: 'Doğru cevaplar', plain: 'Yazının rengini doğru bulma oranı; kelime ile renk aynıyken ve farklıyken ayrı ayrı.' },
    { key: 'renk_hiz', name: 'Cevap hızı', plain: 'Doğru cevaplarda tipik cevap süresi: işi ne kadar hızlı yürütebildiği.' },
    {
      key: 'renk_etki',
      name: 'Renk-kelime etkisi',
      plain: 'Kelime ile renk farklıyken cevapların ne kadar yavaşladığı: okuma alışkanlığını durdurup rengi bulmanın ne kadar çaba istediği.',
    },
  ],
  tasks: [renkKelime],
  science: {
    basedOn:
      'Stroop’un (1935) renk-kelime düzeni. Kelimeler, renkler, deneme sırası, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari Stroop testlerinin kartları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Ketlemeyi, yani otomatik hâle gelmiş bir cevabı (kelimeyi okumayı) durdurup göreve uygun cevabı (yazının rengini) verebilmeyi ölçer. Bu beceri; dikkat dağıtan bir şeye rağmen işine odaklanmak ya da bir kuralı uygularken alışkanlıklara kapılmamak gibi durumlarda kullanılır. Rapor ayrıca doğruluğu ve cevap hızını verir.',
    turkishVersion: 'Özgün görev. Kelimeler Türkçedir (KIRMIZI, MAVİ, YEŞİL, SARI); yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Renk-kelime etkisi grup düzeyinde psikolojinin en sağlam bulgularından biridir (MacLeod, 1991); ancak iki koşul arasındaki farka dayanan bu tür puanlarda aynı kişinin iki uygulaması arasındaki tutarlılık (test-tekrar test güvenirliği) sınırlıdır (Hedge ve ark., 2018). Bu yüzden raporda bu fark, doğruluk ve cevap süresiyle birlikte ve yalnızca betimleyici olarak verilir; 0,05 saniyeden küçük farklar belirgin sayılmaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Renk-kelime etkisi çocuklukta büyüktür, gençlikte azalır ve yaşlılıkta yeniden artar (Comalli ve ark., 1962); bu yüzden bir norm yaş gruplarına göre ayrı ayrı oluşturulmalıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır: kelimelerin akıcı okunması gerekir. Dokunmatik ekranla, fareyle ya da klavyeyle (1–4 tuşları) yapılabilir; aynı kişinin sonuçları karşılaştırılacaksa aynı tür cihaz kullanılmalıdır.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Dikkat eksikliği ve hiperaktivite bozukluğu (DEHB) gibi durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Renk körlüğü (özellikle kırmızı ile yeşili ayırt etme güçlüğü) olan kişilerde sonuç geçerli değildir. Renkler, kırmızı-yeşil renk körlüğünde de daha kolay ayrılacak biçimde seçildi ve görev kısa bir renk denemesiyle başlar; bu deneme bir renk körlüğü testi değildir, yalnızca renklerin o ekranda ayırt edilip edilmediğine bakar.',
      'Okumayı yeni öğrenen ya da yavaş okuyan çocuklarda kelime yeterince otomatik okunmadığı için renk-kelime etkisi küçük çıkabilir; bu, ketlemenin güçlü olduğu anlamına gelmez.',
      'Sonuç; yorgunluk, ortamdaki gürültü, isteklilik ve cihaz (dokunmatik ekran ya da fare) gibi etkenlerden etkilenir.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Stroop, J. R. (1935). Studies of interference in serial verbal reactions. Journal of Experimental Psychology, 18(6), 643–662.',
        url: 'https://doi.org/10.1037/h0054651',
      },
      {
        text: 'MacLeod, C. M. (1991). Half a century of research on the Stroop effect: An integrative review. Psychological Bulletin, 109(2), 163–203.',
        url: 'https://doi.org/10.1037/0033-2909.109.2.163',
      },
      {
        text: 'Comalli, P. E., Wapner, S. ve Werner, H. (1962). Interference effects of Stroop color-word test in childhood, adulthood, and aging. The Journal of Genetic Psychology, 100(1), 47–53.',
        url: 'https://doi.org/10.1080/00221325.1962.10533572',
      },
      {
        text: 'Hedge, C., Powell, G. ve Sumner, P. (2018). The reliability paradox: Why robust cognitive tasks do not produce reliable individual differences. Behavior Research Methods, 50(3), 1166–1186.',
        url: 'https://doi.org/10.3758/s13428-017-0935-1',
      },
    ],
  },
};
