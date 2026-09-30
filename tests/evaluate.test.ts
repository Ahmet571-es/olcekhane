import { inflateSync } from 'node:zlib';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssessmentError, evaluate } from '@/lib/assessment/evaluate';
import { answersBody, pdfBody, type AnswersBody } from '@/lib/assessment/schemas';
import type { LikertInstrument, QuizInstrument } from '@/lib/instruments/types';
import { memoryRateLimit, memoryRateLimitSize, resetMemoryRateLimit } from '@/lib/memory-rate-limit';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { formForGrade } from '@/lib/scoring/quiz';
import { cancellationBody, def, likertBody, memoryTasksBody, quizBody, readingBody } from './helpers/bodies';

describe('test raporları', () => {
  it('kişilik: cetvel grafiği, her boyut için düzey ve yorum; öğrenci ve veli ayrı', () => {
    const r = evaluate('bes-faktor-kisilik', likertBody('bes-faktor-kisilik', 8, (i) => (i * 7) % 5));
    const d = def<LikertInstrument>('bes-faktor-kisilik');
    expect(r.student.audience).toBe('student');
    expect(r.parent.audience).toBe('parent');
    expect(r.student.chart?.type).toBe('rulers');
    expect(r.student.items).toHaveLength(d.scales.length);
    for (const it of r.student.items) {
      expect(it.badge).toBeTruthy();
      expect(it.text.length).toBeGreaterThan(40);
    }
    expect(r.student.studentName).toBe('');
    expect(r.student.gradeLabel).toBe('8. sınıf');
    expect(r.parent.items[0].text).not.toBe(r.student.items[0].text);
    // Güvenirliği bilinen ölçeklerde cetvelde ölçüm payı da gösterilir (bilimsel yaklaşım sayfasındaki söz).
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows).toHaveLength(d.scales.length);
    for (const row of rows) {
      expect(row.ciLow).not.toBeNull();
      expect(row.ciHigh).not.toBeNull();
      expect(row.ciLow!).toBeLessThanOrEqual(row.value!);
      expect(row.ciHigh!).toBeGreaterThanOrEqual(row.value!);
    }
    expect(r.student.chartNote).toContain('sarı bant');
    expect(r.parent.chartNote).toContain('sarı bant');
  });

  it('güvenirliği bilinmeyen ölçekte ölçüm payı gösterilmez', () => {
    const r = evaluate('calisma-aliskanliklari', likertBody('calisma-aliskanliklari', 8, (i) => i % 5));
    const rows = r.parent.chart?.type === 'rulers' ? r.parent.chart.rows : [];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.ciLow === null && row.ciHigh === null)).toBe(true);
    expect(r.parent.chartNote ?? '').not.toContain('bant');
  });

  it('mesleki ilgi: altıgen grafik ve üç harfli ilgi kodu', () => {
    const r = evaluate('mesleki-ilgi-profili', likertBody('mesleki-ilgi-profili', 10, (i) => (i % 6 === 0 ? 4 : i % 3)));
    expect(r.student.chart?.type).toBe('hexagon');
    expect(r.student.keyFigures[0].value).toMatch(/^[RIASEC]{3}$/);
    // En belirgin üç alan ve profile uyan örnek meslekler (test sayfasındaki söz).
    expect(r.student.items).toHaveLength(4);
    expect(r.student.items[3].title).toBe('Sana uyabilecek örnek meslekler');
    expect(r.parent.items[3].title).toBe('Profile uyan örnek meslekler');
    expect(r.parent.items[3].text).toContain(' · ');
  });

  it('okuma: anlama, hız ve soru türleri', () => {
    const r = evaluate('okuma-hizi-ve-anlama', readingBody(5));
    expect(r.parent.keyFigures.map((f) => f.label)).toEqual(['Anlama', 'Okuma hızı', 'Anlayarak okuma']);
    expect(r.parent.keyFigures[0].value).toBe('8/8');
    expect(r.parent.chart?.type).toBe('bars');
  });

  it('matematik: konu alanlarına göre doğru sayıları; cevap anahtarı sunucuda', () => {
    const r = evaluate('matematik-konu-tarama-testi', quizBody(6, 4));
    expect(r.student.chart?.type).toBe('bars');
    const total = r.student.keyFigures.find((f) => f.label === 'Doğru')!.value;
    const form = formForGrade(def<QuizInstrument>('matematik-konu-tarama-testi'), 6);
    const wrong = form.items.filter((_, i) => i % 4 === 0).length;
    expect(total).toBe(`${form.items.length - wrong}/${form.items.length}`);
  });

  it('harf işaretleme: sayfa tohumdan sunucuda üretilir, bölüm grafiği', () => {
    const r = evaluate('surekli-dikkat', cancellationBody());
    expect(r.student.chart?.type).toBe('columns');
    expect(r.student.items.map((i) => i.title)).toEqual(['Çalışma hızı', 'Hedefleri bulma', 'Net doğru', 'Dikkati sürdürme']);
    expect(r.student.items[3].badge).toBe('Son bölümlerde düştü');
  });

  it('dikkat ve bellek görevleri', () => {
    const r = evaluate('dikkat-ve-bellek', memoryTasksBody());
    expect(r.student.items).toHaveLength(5);
    expect(r.student.chart?.type).toBe('bars');
  });

  it('geçersiz istekler reddedilir', () => {
    expect(() => evaluate('yok-boyle-test', likertBody('oz-saygi', 8, () => 0))).toThrow(AssessmentError);
    expect(() => evaluate('oz-saygi', { ...likertBody('oz-saygi', 8, () => 0), grade: 3 })).toThrow('sınıf düzeyine uygun değil');
    expect(() => evaluate('oz-saygi', readingBody(8))).toThrow(AssessmentError);
    const half = likertBody('oz-saygi', 8, () => 1);
    if (half.data.engine === 'likert') half.data.answers = Object.fromEntries(Object.entries(half.data.answers).slice(0, 2));
    expect(() => evaluate('oz-saygi', half)).toThrow('maddelerin çoğunu');
    const quiz = quizBody(6);
    if (quiz.data.engine === 'quiz') delete quiz.data.answers[Object.keys(quiz.data.answers)[0]];
    expect(() => evaluate('matematik-konu-tarama-testi', quiz)).toThrow('Bütün soruları');
    const bad = cancellationBody();
    if (bad.data.engine === 'tasks') bad.data.blocks = {};
    expect(() => evaluate('surekli-dikkat', bad)).toThrow(AssessmentError);
  });

  it('istek şeması: ad gibi alanlar kabul edilmez, gövde sınırları uygulanır', () => {
    const ok = likertBody('oz-saygi', 8, () => 2);
    expect(answersBody.safeParse(ok).success).toBe(true);
    expect(answersBody.parse({ ...ok, name: 'Deniz' })).not.toHaveProperty('name');
    expect(pdfBody.safeParse({ ...ok, audience: 'teacher' }).success).toBe(false);
    expect(pdfBody.safeParse({ ...ok, audience: 'adult' }).success).toBe(true);
    // 14: testi kendisi için çözen yetişkin; daha büyük değer yok.
    expect(answersBody.safeParse({ ...ok, grade: 14 }).success).toBe(true);
    expect(answersBody.safeParse({ ...ok, grade: 15 }).success).toBe(false);
    expect(answersBody.safeParse({ ...ok, grade: 0 }).success).toBe(false);
    const many = { grade: 8, data: { engine: 'likert', answers: Object.fromEntries(Array.from({ length: 301 }, (_, i) => [`m${i}`, { value: 1, rtMs: 1 }])) } };
    expect(answersBody.safeParse(many).success).toBe(false);
  });
});

/** PDF'teki yazı tiplerinin karakter eşlemeleri (ToUnicode): boş eşleme, o harfin kopyalanamadığı anlamına gelir. */
function toUnicodeMaps(pdf: Buffer): string[] {
  const maps: string[] = [];
  let at = 0;
  for (;;) {
    const start = pdf.indexOf('stream', at);
    if (start === -1) break;
    const dataStart = pdf[start + 6] === 0x0d ? start + 8 : start + 7;
    const end = pdf.indexOf('endstream', dataStart);
    if (end === -1) break;
    at = end + 9;
    try {
      const text = inflateSync(pdf.subarray(dataStart, end)).toString('latin1');
      if (text.includes('begincmap')) maps.push(text);
    } catch {
      // sıkıştırılmamış ya da başka türden akış
    }
  }
  return maps;
}

describe('PDF rapor', () => {
  it('her grafik türü için Türkçe PDF üretilir', async () => {
    const bodies: [string, AnswersBody][] = [
      ['oz-saygi', likertBody('oz-saygi', 8, (i) => i % 4)],
      ['mesleki-ilgi-profili', likertBody('mesleki-ilgi-profili', 10, (i) => i % 5)],
      ['okuma-hizi-ve-anlama', readingBody(7)],
      ['matematik-konu-tarama-testi', quizBody(7, 3)],
      ['surekli-dikkat', cancellationBody()],
    ];
    for (const [slug, body] of bodies) {
      const r = evaluate(slug, body);
      for (const audience of ['student', 'parent'] as const) {
        const pdf = await renderSimpleReportPdf(r[audience], 'olcekhane.com');
        expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
        expect(pdf.length).toBeGreaterThan(8_000);
        // Yazı tipleri gömülüdür (Türkçe harfler için).
        expect(pdf.includes(Buffer.from('AtkinsonHyperlegibleNext'))).toBe(true);
        // Bütün harfler seçilip kopyalanabilir: eşlemesi boş kalan harf yok (bileşik harflerin bileşenleri dahil).
        const maps = toUnicodeMaps(pdf);
        expect(maps.length).toBeGreaterThan(0);
        for (const m of maps) expect(m).not.toContain('<>');
      }
    }
  }, 60_000);
});

describe('bellekte hız sınırı', () => {
  beforeEach(() => resetMemoryRateLimit());
  it('süresi dolan sayaçlar istek gelmese de en geç bir dakika sonra bellekten silinir', () => {
    vi.useFakeTimers();
    try {
      memoryRateLimit('rapor:203.0.113.7', 30, 600);
      expect(memoryRateLimitSize()).toBe(1);
      vi.advanceTimersByTime(10 * 60_000 - 1_000);
      expect(memoryRateLimitSize()).toBe(1);
      // Aydınlatma metni: IP adresi en geç 11 dakika içinde silinir.
      vi.advanceTimersByTime(61_000);
      expect(memoryRateLimitSize()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it('pencere içinde sınırı aşan istek reddedilir, pencere dolunca yeniden açılır', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) expect(memoryRateLimit('a', 3, 60, t0 + i)).toBe(true);
    expect(memoryRateLimit('a', 3, 60, t0 + 10)).toBe(false);
    expect(memoryRateLimit('b', 3, 60, t0 + 10)).toBe(true);
    expect(memoryRateLimit('a', 3, 60, t0 + 60_001)).toBe(true);
  });
});
