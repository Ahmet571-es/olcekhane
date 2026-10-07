import { describe, expect, it, vi } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { geriyeDonukHatirlama } from '@/content/instruments/geriye-donuk-hatirlama';
import { AssessmentError, evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { nBackRoles, nBackSequence, rng, type NBackRole } from '@/lib/instruments/sequences';
import type { NBackTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { TaskInputError, scoreNBack } from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { nBackBody } from './helpers/bodies';

const SLUG = 'geriye-donuk-hatirlama';
const task = geriyeDonukHatirlama.tasks[0] as NBackTask;
const LETTERS = ['B', 'F', 'H', 'K', 'M', 'R', 'S', 'T'];
const count = (roles: NBackRole[], r: NBackRole) => roles.filter((x) => x === r).length;
const all = (r: { items: { title: string; badge?: string; text: string }[]; cautions: string[] }) =>
  [...r.items.flatMap((i) => [i.title, i.badge ?? '', i.text]), ...r.cautions].join(' ');

/** Dizinin kurallara uyup uymadığı: uymayan kuralların listesi (boşsa uyar). */
function sequenceProblems(letters: string[], n: 1 | 2): string[] {
  const roles = nBackRoles(letters, n);
  const out: string[] = [];
  letters.forEach((l, i) => {
    if (!LETTERS.includes(l)) out.push(`${i}: harf listede yok`);
    const role = roles[i];
    if (role === 'target') {
      if (i <= n) out.push(`${i}: hedef çok erken`);
      if (roles[i - n] !== 'other') out.push(`${i}: hedefin ${n} önceki harfi diğer harf değil`);
      if (roles[i - 1] === 'lure') out.push(`${i}: tuzaktan hemen sonra hedef`);
    } else if (role === 'lure') {
      if (roles[i - 1] !== 'other') out.push(`${i}: tuzağın bir önceki harfi diğer harf değil`);
    } else if (letters.slice(Math.max(0, i - 3), i).includes(l)) {
      out.push(`${i}: diğer harf son üç harften biriyle aynı`);
    }
  });
  return out;
}

/** Her düzeyde istenen sayıda basış: önce hedeflerde, tuzaklarda ve diğer harflerde, sırayla. */
function counted(spec: Record<1 | 2, { hits: number; fa: number; lureFa?: number }>) {
  const seen = { 1: { t: 0, l: 0, o: 0 }, 2: { t: 0, l: 0, o: 0 } };
  return (role: NBackRole, n: 1 | 2) => {
    const s = seen[n];
    const want = spec[n];
    if (role === 'target') return s.t++ < want.hits ? 650 : null;
    if (role === 'lure') return s.l++ < (want.lureFa ?? 0) ? 700 : null;
    return s.o++ < want.fa ? 700 : null;
  };
}

describe('Geriye dönük hatırlama: diziler', () => {
  it('alıştırmalar ve bölümler: harf, hedef ve tuzak sayıları', () => {
    const shape = (b: { n: 1 | 2; letters: string[] }) => {
      const roles = nBackRoles(b.letters, b.n);
      return [b.n, b.letters.length, count(roles, 'target'), count(roles, 'lure')];
    };
    expect(task.practice.map(shape)).toEqual([
      [1, 9, 3, 0],
      [2, 12, 4, 1],
    ]);
    expect(task.blocks.map(shape)).toEqual([
      [1, 31, 10, 0],
      [2, 32, 10, 2],
      [2, 32, 10, 2],
    ]);
    expect(task.stimulusMs).toBe(800);
    expect(task.trialMs).toBe(2500);
  });

  it('diziler kurallara uyar: hedef ve tuzak yalnızca diğer bir harfin aynısı, zincirleme tekrar yok', () => {
    for (const b of [...task.practice, ...task.blocks]) expect(sequenceProblems(b.letters, b.n), b.letters.join('')).toEqual([]);
  });

  it('harfler bölümlerde dengeli dağılır', () => {
    for (const b of task.blocks) {
      const counts = LETTERS.map((l) => b.letters.filter((x) => x === l).length);
      expect(Math.max(...counts) - Math.min(...counts), b.letters.join('')).toBeLessThanOrEqual(2);
    }
  });

  it('üretim kuralı farklı tohumlarla da çalışır', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const r = rng(seed);
      const one = nBackSequence({ n: 1, length: 31, targets: 10, lures: 0, letters: LETTERS }, r);
      const two = nBackSequence({ n: 2, length: 32, targets: 10, lures: 2, letters: LETTERS }, r);
      expect(sequenceProblems(one, 1)).toEqual([]);
      expect(sequenceProblems(two, 2)).toEqual([]);
      expect(count(nBackRoles(one, 1), 'target')).toBe(10);
      expect([count(nBackRoles(two, 2), 'target'), count(nBackRoles(two, 2), 'lure')]).toEqual([10, 2]);
    }
    expect(() => nBackSequence({ n: 1, length: 20, targets: 5, lures: 1, letters: LETTERS }, rng(1))).toThrow();
  });

  it('roller harflerden çıkarılır: iki geride bir önceki harfin aynısı tuzaktır', () => {
    expect(nBackRoles(['K', 'M', 'K', 'K', 'S'], 2)).toEqual(['other', 'other', 'target', 'lure', 'other']);
    expect(nBackRoles(['K', 'K', 'M', 'K'], 1)).toEqual(['other', 'target', 'other', 'other']);
  });

  it('uyaranlar belirlenimci: yeniden yüklemede aynı', async () => {
    vi.resetModules();
    const again = await import('@/content/instruments/geriye-donuk-hatirlama');
    expect(JSON.stringify(again.geriyeDonukHatirlama.tasks)).toBe(JSON.stringify(geriyeDonukHatirlama.tasks));
  });
});

describe('Geriye dönük hatırlama: puanlama', () => {
  const input = (pick: (role: NBackRole, n: 1 | 2, i: number) => number | null) =>
    (nBackBody(pick).data as { blocks: Record<string, { index: number; response: number | null; rtMs: number | null }[]> }).blocks[task.key];

  it('hatasız: bir geri ve iki geri ayrı ayrı; iki geri bölümleri birleşir', () => {
    const { levels } = scoreNBack(task, input((role) => (role === 'target' ? 650 : null))).result;
    expect(levels).toEqual([
      expect.objectContaining({ n: 1, targets: 10, nonTargets: 21, lures: 0, hits: 10, misses: 0, falseAlarms: 0, hitRate: 1, falseAlarmRate: 0, pr: 1, medianRt: 650 }),
      expect.objectContaining({ n: 2, targets: 20, nonTargets: 44, lures: 4, hits: 20, misses: 0, falseAlarms: 0, lureFalseAlarms: 0, pr: 1 }),
    ]);
  });

  it('her harfte basan da hiç basmayan da ayırt etmede 0 alır', () => {
    const press = scoreNBack(task, input(() => 700)).result.levels;
    expect(press.map((l) => [l.hitRate, l.falseAlarmRate, l.pr])).toEqual([
      [1, 1, 0],
      [1, 1, 0],
    ]);
    expect(press[1].lureFalseAlarms).toBe(4);
    const idle = scoreNBack(task, input(() => null)).result.levels;
    expect(idle.map((l) => [l.hits, l.falseAlarms, l.pr, l.medianRt])).toEqual([
      [0, 0, 0, null],
      [0, 0, 0, null],
    ]);
  });

  it('çok erken basış harfe cevap sayılmaz; pencereden sonra gelen basış yok sayılır', () => {
    const r = scoreNBack(task, input((role, n) => (n === 1 ? (role === 'target' ? 100 : 2700) : role === 'target' ? 650 : null))).result.levels;
    expect(r[0]).toMatchObject({ hits: 0, anticipations: 10, falseAlarms: 0, pr: 0 });
    expect(r[1]).toMatchObject({ hits: 20, anticipations: 0 });
  });

  it('tipik süre en az beş yakalamadan hesaplanır', () => {
    const r = scoreNBack(task, input(counted({ 1: { hits: 4, fa: 0 }, 2: { hits: 5, fa: 0 } }))).result.levels;
    expect(r[0].medianRt).toBeNull();
    expect(r[1].medianRt).toBe(650);
  });

  it('eksik ya da geçersiz deneme reddedilir', () => {
    const full = input((role) => (role === 'target' ? 650 : null));
    expect(() => scoreNBack(task, full.slice(1))).toThrow(TaskInputError);
    expect(() => scoreNBack(task, [{ ...full[0], response: 2 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreNBack(task, [{ ...full[0], response: 1, rtMs: -3 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreNBack(task, [{ ...full[0], response: 1, rtMs: null }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreNBack(task, [...full, { index: 95, response: null, rtMs: null }])).toThrow(TaskInputError);
    // Aynı deneme iki kez gelirse ilki sayılır.
    const dup = scoreNBack(task, [...full, { ...full[1], response: 1, rtMs: 600 }]).result.levels;
    expect(dup[0].falseAlarms).toBe(0);
  });
});

describe('Geriye dönük hatırlama: rapor', () => {
  it('hatasız: grafik, üç sonuç kartı ve ayırt etme puanı', () => {
    const r = evaluate(SLUG, nBackBody());
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => x.label)).toEqual([
      'Bir geri: aynıları yakalama',
      'Bir geri: aynı olmayanlarda basmama',
      'İki geri: aynıları yakalama',
      'İki geri: aynı olmayanlarda basmama',
    ]);
    expect(rows.map((x) => x.valueLabel)).toEqual(['%100', '%100', '%100', '%100']);
    expect(r.student.chartTitle).toBe('Bir geri ve iki geri');
    expect(r.student.chartNote).not.toContain('Hiç basılmayan');
    expect(r.student.itemsTitle).toBe('Sonuçların');
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Bir geri', 'Yakalama %100 · yanlış basma %0'],
      ['İki geri', 'Yakalama %100 · yanlış basma %0'],
      ['Zorluk artınca', 'Belirgin bir fark yok'],
    ]);
    expect(r.student.items[0].text).toContain('Aynı olan 10 harfin 10 tanesi yakalandı · aynı olmayan 21 harfte hiç basılmadı.');
    expect(r.student.items[0].text).toContain('Bir önceki harfle aynı olan harflerin hepsini yakaladın; aynı olmayanlarda ise hiç basmadın.');
    expect(r.student.items[1].text).toContain('İki önceki harfle aynı olan harflerin hepsini yakaladın');
    expect(r.student.items[2].text).toContain('Ayırt etme puanı bir geride 100, iki geride 100 (100 üzerinden).');
    expect(r.student.items[2].text).toContain('hiç yanılmayan biri 100');
    expect(r.student.cautions).toEqual([]);
    expect(r.parent.items[0].text).toContain('Çocuğunuz bir önceki harfle aynı olan harflerin hepsini yakaladı');
    expect(r.parent.items[2].text).toContain('Çocuğunuz bir geride ve iki geride benzer sonuç aldı: akılda tutulacak harf sayısının artması, sonucunu');
    expect(all(r.student)).not.toContain('Çocuğunuz');
    expect(all(r.parent)).not.toMatch(/yakaladın|bastın|aldın|zorlandın/);
  });

  it('tipik sonuç: iki geride belirgin düşüş', () => {
    const r = evaluate(SLUG, nBackBody(counted({ 1: { hits: 10, fa: 1 }, 2: { hits: 14, fa: 3, lureFa: 1 } })));
    const rows = r.parent.chart?.type === 'bars' ? r.parent.chart.rows : [];
    expect(rows.map((x) => x.valueLabel)).toEqual(['%100', '%95', '%70', '%91']);
    expect(r.parent.items.map((i) => i.badge)).toEqual(['Yakalama %100 · yanlış basma %5', 'Yakalama %70 · yanlış basma %9', 'İki geride belirgin düşüş']);
    expect(r.parent.items[0].text).toContain('aynı olmayan 21 harfin 1 tanesinde basıldı');
    expect(r.parent.items[0].text).toContain('hepsini yakaladı; aynı olmayanlarda ise nadiren bastı.');
    expect(r.parent.items[1].text).toContain('çoğunu yakaladı; aynı olmayanlarda ise nadiren bastı.');
    expect(r.parent.items[1].text).toContain('büyük ölçüde başardı');
    expect(r.parent.items[1].text).not.toContain('tanıdık');
    expect(r.parent.items[2].text).toContain('Ayırt etme puanı bir geride 95, iki geride 61');
    expect(r.parent.items[2].text).toContain('tek başına yorumlanmamalıdır');
    expect(r.parent.cautions).toEqual([]);
  });

  it('tek bir kaçırma ya da yanlış basma karşılaştırmanın yorumunu değiştirmez', () => {
    const badge = (spec: Parameters<typeof counted>[0]) => evaluate(SLUG, nBackBody(counted(spec))).student.items[2].badge;
    expect(badge({ 1: { hits: 9, fa: 0 }, 2: { hits: 20, fa: 0 } })).toBe('Belirgin bir fark yok');
    expect(badge({ 1: { hits: 10, fa: 1 }, 2: { hits: 20, fa: 0 } })).toBe('Belirgin bir fark yok');
    expect(badge({ 1: { hits: 9, fa: 0 }, 2: { hits: 19, fa: 0 } })).toBe('Belirgin bir fark yok');
    expect(badge({ 1: { hits: 10, fa: 0 }, 2: { hits: 19, fa: 1 } })).toBe('Belirgin bir fark yok');
    expect(badge({ 1: { hits: 10, fa: 0 }, 2: { hits: 17, fa: 1 } })).toBe('İki geride biraz düşüş');
  });

  it('iki geride daha yüksek sonuç, sıklık iddiası olmadan söylenir', () => {
    const higher = evaluate(SLUG, nBackBody(counted({ 1: { hits: 7, fa: 2 }, 2: { hits: 20, fa: 0 } })));
    expect(higher.student.items[0].text).toContain('çoğunu yakaladın; aynı olmayanlarda ise nadiren bastın.');
    expect(higher.student.items[0].text).toContain('büyük ölçüde doğru yaptığını');
    expect(higher.student.items[2].badge).toBe('İki geride daha yüksek');
    expect(higher.student.items[2].text).toContain('genellikle bunun tersi olur');
    expect(higher.student.items[2].text).not.toContain('sık görülmez');
  });

  it('ikinci cümle hataların türüne uyar: sık yanlış basmada "ara sıra yanılmak" denmez', () => {
    const often = evaluate(SLUG, nBackBody(counted({ 1: { hits: 9, fa: 6 }, 2: { hits: 18, fa: 2 } })));
    expect(often.student.items[0].text).toContain('neredeyse hepsini yakaladın; aynı olmayanlarda da sık sık bastın.');
    expect(often.student.items[0].text).toContain('acele etmeden, harfi karşılaştırıp öyle basmak');
    expect(often.student.items[0].text).not.toContain('Ara sıra yanılmak');
    const most = evaluate(SLUG, nBackBody(counted({ 1: { hits: 9, fa: 11 }, 2: { hits: 17, fa: 23 } })));
    for (const k of [0, 1]) {
      expect(most.student.items[k].text).toContain('aynı olmayanların çoğunda da bastın.');
      expect(most.student.items[k].text).toContain('ayırt edebildiğini göstermez');
      expect(most.student.items[k].text).not.toMatch(/zaman zaman zorlandın|aklında tutmakta/);
    }
    // Hiç yanlış basmadan çok kaçırmak: "harfe bakmadan basmak" gerekçesi yazılmaz.
    const missed = evaluate(SLUG, nBackBody(counted({ 1: { hits: 1, fa: 0 }, 2: { hits: 18, fa: 0 } })));
    expect(missed.student.items[0].text).toContain('aynı harfleri yakalamakta zorlandın');
    expect(missed.student.items[0].text).not.toContain('bakmadan');
  });

  it('hiç basılmayan bölüm yorumlanmaz; karşılaştırma yapılmaz', () => {
    const r = evaluate(SLUG, nBackBody(() => null));
    expect(r.student.items[0].text).toContain('Bu bölümde hiç basmadın');
    expect(r.student.items[1].text).toContain('İki geri bölümlerinde hiç basmadın');
    expect(r.parent.items[1].text).toContain('Çocuğunuz iki geri bölümlerinde hiç basmadı');
    expect(r.parent.items[1].text).toContain('bu sonuç yorumlanmamalıdır');
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.items[2].text).toContain('Hiçbir bölümde basılmadığı için');
    expect(r.student.chartNote).toContain('Hiç basılmayan bir düzeyde');
    const notes = r.parent.cautions.join(' ');
    expect(notes).toContain('bir geri bölümünde hiç basılmamış');
    expect(notes).toContain('Bu bölümün sonucu yorumlanmamalıdır');
    expect(notes).toContain('iki geri bölümlerinde hiç basılmamış');
    expect(notes).toContain('Bu bölümlerin sonucu yorumlanmamalıdır');
  });

  it('yarıda bırakılan son bölüm: kartta ve uyarıda söylenir, karşılaştırma yapılmaz', () => {
    const r = evaluate(SLUG, nBackBody((role, _n, i) => (i < 63 && role === 'target' ? 650 : null)));
    expect(r.student.items[1].badge).toBe('Yakalama %50 · yanlış basma %0');
    expect(r.student.items[1].text).toContain('Üçüncü bölümde hiç basmadın; bu bölümü yarıda bırakmış olabilirsin.');
    expect(r.parent.items[1].text).toContain('Çocuğunuz üçüncü bölümde hiç basmadı');
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.items[2].text).toContain('Bölümlerden birinde hiç basılmadığı için');
    expect(r.parent.cautions.join(' ')).toContain('üçüncü bölümünde hiç basılmamış; bu bölüm yarıda bırakılmış olabilir');
  });

  it('her harfte basmak: ayırt etmeyi göstermez, uyarı var, karşılaştırma yok', () => {
    const r = evaluate(SLUG, nBackBody(() => 700));
    expect(r.student.items[0].badge).toBe('Yakalama %100 · yanlış basma %100');
    expect(r.student.items[0].text).toContain('hepsini yakaladın; aynı olmayanların çoğunda da bastın.');
    expect(r.student.items[0].text).toContain('ayırt edebildiğini göstermez');
    expect(r.student.items[0].text).toContain('tek başına bir şey söylemez');
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.items[2].text).toContain('aynı olmayan harflerin çoğunda da bastığın için');
    expect(r.parent.cautions.join(' ')).toContain('aynı olmayan harflerin yarısından çoğunda da basılmış');
    // Yalnızca iki geride her harfte basmak da karşılaştırılmaz.
    const two = evaluate(SLUG, nBackBody((role, n) => (n === 2 ? 700 : role === 'target' ? 650 : null)));
    expect(two.student.items[2].badge).toBe('Karşılaştırılamadı');
  });

  it('iki geride bir geri kuralına devam etmek: tuzak notu, uyarı ve karşılaştırma yok', () => {
    const r = evaluate(SLUG, nBackBody(counted({ 1: { hits: 10, fa: 0 }, 2: { hits: 0, fa: 0, lureFa: 4 } })));
    expect(r.student.items[1].text).toContain('hiçbirini yakalamadın; aynı olmayanlarda ise nadiren bastın.');
    expect(r.student.items[1].text).toContain('tanıdık geldiği için yanıltıcıdır');
    expect(r.parent.cautions.join(' ')).toContain('bir geri kuralına göre basılmaya devam edilmiş olabilir');
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.items[2].text).toContain('bir geri kuralına göre basmaya devam etmiş olabileceğin için');
  });

  it('bir geride zorlanınca karşılaştırma yapılmaz; gerekçe yalnızca bir geriyi anlatır', () => {
    const r = evaluate(SLUG, nBackBody(counted({ 1: { hits: 0, fa: 1 }, 2: { hits: 20, fa: 0 } })));
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.items[2].text).toBe('Bir geri bölümünde zorlandığın için bir geri ile iki geriyi karşılaştırmak anlamlı değil.');
  });

  it('raporlarda "herkes" diye genelleme yok', () => {
    for (const spec of [
      { 1: { hits: 10, fa: 0 }, 2: { hits: 14, fa: 2 } },
      { 1: { hits: 8, fa: 2 }, 2: { hits: 9, fa: 6, lureFa: 2 } },
      { 1: { hits: 5, fa: 4 }, 2: { hits: 6, fa: 10 } },
    ]) {
      const r = evaluate(SLUG, nBackBody(counted(spec)));
      expect(all(r.student) + all(r.parent)).not.toMatch(/herkes/i);
    }
    expect(task.instructions.join(' ')).not.toMatch(/herkes/i);
  });

  it('5. sınıftan itibaren; yetişkinlere açık değil', () => {
    expect(() => evaluate(SLUG, nBackBody(undefined, 4))).toThrow(AssessmentError);
    expect(() => evaluateReports(SLUG, nBackBody(undefined, ADULT_GRADE))).toThrow(AssessmentError);
    expect(evaluate(SLUG, nBackBody(undefined, 5)).student.gradeLabel).toBeTruthy();
    expect(evaluate(SLUG, nBackBody(undefined, 13)).parent.items).toHaveLength(3);
  });

  it('PDF raporu üretilir', async () => {
    const pdf = await renderSimpleReportPdf(evaluate(SLUG, nBackBody(counted({ 1: { hits: 9, fa: 2 }, 2: { hits: 13, fa: 5, lureFa: 2 } }))).parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('pilot olarak yayında (site sahibinin 2026-10-07 kararı: hoca onayı beklenmeden): listelerde ve site haritasında; adında "tanı" yok', () => {
    expect(geriyeDonukHatirlama.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(geriyeDonukHatirlama.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(geriyeDonukHatirlama.adults).toBeFalsy();
    expect(geriyeDonukHatirlama.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
  });
});
