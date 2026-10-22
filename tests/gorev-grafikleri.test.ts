import { describe, expect, it } from 'vitest';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { getInstrumentDef } from '@/content/instruments';
import { ADULT_GRADE } from '@/lib/config';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import type { DrawnVisual } from '@/lib/reports/visual-draw';
import { checkDrawn } from './helpers/visual-check';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * Görev (zekâ ve dikkat) testlerinin kart grafikleri (site sahibinin 2026-10-22 isteği: her başlık sözel açıklamanın yanında
 * grafikle de anlatılır). Her testin her kartında grafik var; grafik kartın sayılarıyla aynı şeyi söyler; yazılar ekranda ve
 * PDF'te taşmaz, üst üste binmez. Her test birkaç farklı sonuç örüntüsüyle (çok iyi, orta, zorlanan, rastgele) denenir.
 */

/**
 * Grafiği olmayabilecek kartların rozetleri: sonuç hesaplanamadı, karşılaştırma yapılmadı ya da kart yorumlanmadı (grafik,
 * kartın yapmadığı bir karşılaştırmayı yapmış olurdu), hiç cevap verilmedi ya da çizilecek hata yok.
 */
const NO_DATA = [
  'Süre hesaplanamadı',
  'Hesaplanamadı',
  'Karşılaştırılamadı',
  'Karşılaştırılmadı',
  'Yorumlanmadı',
  'Cevap verilmedi',
  'Hiç basılmadı',
  'Hata yok',
  'Tuzaklı sorularda yanlış yok',
  'Ayna görüntüsü seçilmedi',
  'Belirgin kayma yok',
  '“Hatırlamıyorum” denen desenler',
  'Kısımlar karşılaştırılmadı',
];

function reportsOf(slug: string, body: AnswersBody): SimpleReport[] {
  const def = getInstrumentDef(slug)!;
  const r = evaluate(slug, body);
  return [r.student, r.parent, ...('adults' in def && def.adults ? [evaluateAdult(slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
}

describe('çizim türleri: uç durumlarda da yazılar taşmaz', () => {
  const long = 'Çok uzun bir satır adı: iki satıra bölünmesi gereken açıklama';
  const samples: DrawnVisual[] = [
    { type: 'dots', label: 'x', rows: [{ label: long, filled: 0, total: 90, valueLabel: '0/90' }], legend: ['zamanında basıldı', 'kaçırıldı ya da geç basıldı'] },
    { type: 'dots', label: 'x', rows: [1, 2, 3, 4, 5].map((l) => ({ label: `${l}. düzey`, filled: l, total: 5, valueLabel: `${l}/5` })), legend: ['doğru', 'yanlış ya da boş'] },
    { type: 'bars', label: 'x', scale: 'share', rows: [{ label: long, value: 0, max: 6, valueLabel: '0/6' }, { label: 'Kısa', value: 6, max: 6, valueLabel: '6/6' }] },
    { type: 'bars', label: 'x', scale: 'scale', unit: 'sn', rows: [{ label: 'A', value: 0.42, valueLabel: '0,42 sn' }, { label: long, value: 3.1, valueLabel: '3,10 sn' }] },
    { type: 'bars', label: 'x', scale: 'scale', unit: '°', max: 180, reference: { value: 90, label: 'Rastgele gösterilen yönler: 90°' }, rows: [{ label: 'A', value: 180, valueLabel: '180°' }] },
    { type: 'stack', label: 'x', total: 50, parts: [{ label: long, value: 0 }, { label: 'B', value: 49 }, { label: 'C', value: 1 }, { label: 'D', value: 0 }] },
    { type: 'steps', label: 'x', steps: ['1.', '2.', '3.', '4.', '5.'], reached: 5, valueLabel: '5. düzey', caption: 'Düzeyler, kolaydan zora' },
    { type: 'steps', label: 'x', steps: ['1.', '2.', '3.', '4.'], reached: 1, valueLabel: '1. düzey', caption: 'Düzeyler, kolaydan zora' },
    { type: 'steps', label: 'x', steps: ['1.', '2.', '3.', '4.'], reached: 0, valueLabel: 'Düzey belirtilmedi', caption: 'Düzeyler, kolaydan zora' },
    { type: 'columns', label: 'x', max: 15, caption: '15 kelimeden', rows: [{ label: 'İkinci liste (bir kez)', value: 15, valueLabel: '15' }, { label: 'Araya giren listeden sonra', value: 0, valueLabel: '0' }, { label: '1.', value: 7, valueLabel: '7' }] },
    { type: 'columns', label: 'x', max: 60, rows: [1, 2, 3, 4].map((i) => ({ label: `${i}. bölüm`, value: i * 15, valueLabel: String(i * 15) })) },
    { type: 'strip', label: 'x', min: 0, max: 180, unit: '°', points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 180], marker: { value: 0, label: 'Ortalama 0°' }, zone: { from: 0, to: 20, label: 'Doğru yöne çok yakın' }, reference: { value: 90, label: 'Rastgele: 90°' } },
    { type: 'strip', label: 'x', min: 0, max: 1.5, unit: 'sn', points: [], marker: { value: 1.5, label: 'Tipik 1,50 sn' }, box: { low: 1.2, high: 1.5 } },
    { type: 'ladder', label: 'x', unit: 'kutu', reached: 9, rows: [3, 4, 5, 6, 7, 8, 9].map((l) => ({ length: l, results: [true, true] })) },
    { type: 'ladder', label: 'x', unit: 'rakam', reached: null, rows: [{ length: 3, results: [false, false] }] },
    { type: 'ladder', label: 'x', unit: 'harf', reached: 5, legend: ['tam', 'eksik'], rows: [3, 4, 5, 6, 7].map((l) => ({ length: l, results: [l <= 5, false] })) },
  ];
  it('her örnek', () => {
    samples.forEach((v, i) => checkDrawn(v, `${v.type} ${i}`));
  });
});

describe('görev testlerinin kart grafikleri', () => {
  for (const [slug, variants] of Object.entries(TASK_VARIANTS)) {
    it(slug, async () => {
      let cards = 0;
      for (const [name, make] of Object.entries(variants) as [string, () => AnswersBody][]) {
        for (const rep of reportsOf(slug, make())) {
          // Nicelik sözleri sayılarla uyuşur: "8 sorunun 8 tanesi", "0 tanesi", "1 tanesi" denmez.
          const all = [...rep.items.flatMap((i) => [i.badge ?? '', i.text]), ...rep.cautions].join(' ');
          expect(all, `${slug} ${name} ${rep.audience}`).not.toMatch(/\b(\d+) \S+ \1 tanes|(^|\s)[01] tanes/);
          for (const it of rep.items) {
            const label = `${slug} ${name} ${rep.audience} ${it.title}`;
            // Sonucu hesaplanamayan ya da karşılaştırılamayan kartın çizecek bir verisi yoktur (ör. süreler alınamadı).
            if (!it.visual && NO_DATA.includes(it.badge ?? '')) continue;
            expect(it.visual, label).toBeDefined();
            checkDrawn(it.visual!, label);
            cards++;
          }
        }
      }
      expect(cards).toBeGreaterThan(0);
      const [student] = reportsOf(slug, (Object.values(variants) as (() => AnswersBody)[])[0]());
      const pdf = await renderSimpleReportPdf(student, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }, 120_000);
  }
});
