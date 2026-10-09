import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { dersCalismaMotivasyonu } from '@/content/instruments/ders-calisma-motivasyonu';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { quadrantGeometry, twoLines, type QuadrantChart, type SimpleReport } from '@/lib/reports/simple';
import { anchoredBand, likertQuality, scoreLikert, type LikertAnswer } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { likertBody } from './helpers/bodies';

const SLUG = 'ders-calisma-motivasyonu';
const d = dersCalismaMotivasyonu;
/** Beş tür, kuramdaki yelpaze sırasıyla (en çok kişinin kendisinden gelenden hiç nedeni olmayana). */
const TYPES = ['intrinsic', 'identified', 'introjected', 'external', 'amotivation'];
const NAMES = ['Merak ve keyif', 'Önemini görme', 'İç baskı', 'Dış baskı ve ödül', 'İsteksizlik'];
/** Uygulama sırasında türlerin dönüşü. */
const ORDER = ['intrinsic', 'external', 'identified', 'amotivation', 'introjected'];
const tpl = REPORT_TEMPLATES[SLUG];
const m = tpl.motivation!;

type Level = 'low' | 'average' | 'high';
const LEVEL_LABEL: Record<Level, string> = { low: 'Düşük', average: 'Orta', high: 'Yüksek' };
const level = (v: number): Level => (Math.round(v * 10) / 10 >= 3.5 ? 'high' : Math.round(v * 10) / 10 >= 2.5 ? 'average' : 'low');

/**
 * Tür → ortalama (bir ondalıklı; beş maddenin toplamı tam sayı olmalı): her türün beş maddesine, ortalamayı veren ve
 * aralarında en çok 1 fark olan değerler.
 */
function bodyFor(values: Record<string, number>, grade = 8) {
  const answers: Record<string, { value: number; rtMs: number }> = {};
  for (const t of TYPES) {
    const sum = Math.round(values[t] * 5);
    const its = d.items.filter((i) => i.scale === t);
    its.forEach((it, j) => (answers[it.key] = { value: Math.floor(sum / 5) + (j < sum % 5 ? 1 : 0), rtMs: 2500 }));
  }
  return { grade, data: { engine: 'likert' as const, answers } };
}

/**
 * Beklenen profil: bileşik ölçeklerin düzeyleri, profil yorumu ve eklenen cümleler (bileşik ölçek yüksek değilken bir
 * parçası yüksekse "tek başına yüksek" cümlesi; değilse parçalar arasında en az 1 puan fark ve baskın parça düşük
 * değilse eğilim cümlesi) ve ters düşen cevap uyarısı.
 */
function expected(values: Record<string, number>, aud: 'student' | 'parent') {
  const pick = (x: { student: string; parent: string }) => (aud === 'student' ? x.student : x.parent);
  const auto = (values.intrinsic + values.identified) / 2;
  const ctrl = (values.introjected + values.external) / 2;
  const pattern = `${level(auto)}-${level(ctrl)}`;
  const leans: string[] = [];
  for (const [a, b, axis] of [
    ['intrinsic', 'identified', level(auto)],
    ['introjected', 'external', level(ctrl)],
  ] as const) {
    const high = [a, b].find((k) => level(values[k]) === 'high');
    if (high && axis !== 'high') {
      leans.push(pick(m.hidden[high]).replace('{düzey}', axis === 'low' ? 'az' : 'orta düzeyde'));
      continue;
    }
    const gap = Math.round(values[a] * 10) / 10 - Math.round(values[b] * 10) / 10;
    const top = gap > 0 ? a : b;
    if (Math.abs(gap) >= 1 - 1e-9 && level(values[top]) !== 'low') leans.push(pick(m.lean[top]));
  }
  const xHigh = level(auto) === 'high' || level(values.intrinsic) === 'high' || level(values.identified) === 'high';
  return {
    auto,
    ctrl,
    pattern,
    text: [pick(m.patterns[pattern]), ...leans].join('\n\n'),
    caution: xHigh && level(values.amotivation) === 'high' ? pick(m.contradiction) : null,
  };
}

const text = (r: SimpleReport) => JSON.stringify(r);
/** Rapordaki bütün yazılar (sayılar ve boş alanlar dışında). */
function strings(x: unknown): string[] {
  if (typeof x === 'string') return [x];
  if (Array.isArray(x)) return x.flatMap(strings);
  if (x && typeof x === 'object') return Object.values(x).flatMap(strings);
  return [];
}

describe('Ders çalışma motivasyonu: maddeler', () => {
  it('25 özgün madde; her türde beş, hepsi düz yönlü; türler sırayla döner; iki bileşik ölçek', () => {
    expect(d.items).toHaveLength(25);
    expect(d.scales.filter((s) => !s.of).map((s) => s.key)).toEqual(TYPES);
    expect(d.scales.filter((s) => !s.of).map((s) => s.name)).toEqual(NAMES);
    expect(d.scales.filter((s) => s.of).map((s) => [s.key, s.name, s.of])).toEqual([
      ['autonomous', 'Kendi isteğiyle çalışma', ['intrinsic', 'identified']],
      ['controlled', 'Baskıyla çalışma', ['introjected', 'external']],
    ]);
    for (const t of TYPES) expect(d.items.filter((i) => i.scale === t), t).toHaveLength(5);
    d.items.forEach((it, i) => {
      expect(it.scale, it.key).toBe(ORDER[i % 5]);
      expect(it.reverse, it.key).toBeUndefined();
      expect(it.source, it.key).toBeUndefined();
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
      expect(it.text.length, it.key).toBeLessThanOrEqual(105);
    });
    expect(new Set(d.items.map((i) => i.text)).size).toBe(25);
    expect(new Set(d.items.map((i) => i.key)).size).toBe(25);
    // Nedenler "…için çalışırım" biçiminde; isteksizlik maddeleri bir neden değil, nedensizliği anlatır.
    for (const it of d.items.filter((i) => ['intrinsic', 'identified', 'introjected', 'external'].includes(i.scale))) {
      expect(it.text, it.key).toMatch(/için (ders )?çalışırım\.$/);
    }
    for (const it of d.items.filter((i) => i.scale === 'amotivation')) expect(it.text, it.key).not.toMatch(/için (ders )?çalışırım/);
  });

  it('beş seçenek; yetişkinlere açık değil (maddeler okula özgü)', () => {
    expect(d.options.map((o) => o.label)).toEqual(['Hiç uymuyor', 'Pek uymuyor', 'Biraz uyuyor', 'Çoğunlukla uyuyor', 'Tamamen uyuyor']);
    expect(d.adults).toBeUndefined();
    expect([d.minGrade, d.maxGrade]).toEqual([5, 13]);
    for (const g of [5, 8, 12, 13]) expect(() => evaluate(SLUG, bodyFor({ intrinsic: 3, identified: 3, introjected: 3, external: 3, amotivation: 3 }, g))).not.toThrow();
    for (const g of [3, 4, ADULT_GRADE]) {
      expect(() => evaluateReports(SLUG, bodyFor({ intrinsic: 3, identified: 3, introjected: 3, external: 3, amotivation: 3 }, g)), String(g)).toThrow(AssessmentError);
    }
  });
});

describe('Ders çalışma motivasyonu: puanlama', () => {
  it('düzeyler bir ondalıklı ortalamaya göre: 1–2,4 düşük, 2,5–3,4 orta, 3,5–5 yüksek; bileşik ölçekler on maddenin ortalaması', () => {
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('low');
    expect(anchoredBand(2.5, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.4, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.5, d.anchoredBands)).toBe('high');
    const scores = scoreLikert(d, bodyFor({ intrinsic: 5, identified: 2, introjected: 1, external: 4, amotivation: 3 }).data.answers);
    const by = Object.fromEntries(scores.map((s) => [s.scaleKey, s]));
    expect(by.autonomous.value).toBeCloseTo(3.5, 5);
    expect(by.autonomous.band).toBe('high');
    expect(by.controlled.value).toBeCloseTo(2.5, 5);
    expect(by.controlled.band).toBe('average');
    expect(by.amotivation.band).toBe('average');
  });

  it('en az dört maddesi cevaplanan tür ve en az sekiz maddesi cevaplanan bileşik ölçek hesaplanır; yoksa profil hesaplanamadı denir', () => {
    const answers: Record<string, { value: number; rtMs: number }> = bodyFor({ intrinsic: 4, identified: 4, introjected: 2, external: 2, amotivation: 1 }).data.answers;
    const drop = (keys: string[]) => Object.fromEntries(Object.entries(answers).filter(([k]) => !keys.includes(k)));
    const get = (a: Record<string, LikertAnswer>, k: string) => scoreLikert(d, a).find((s) => s.scaleKey === k)!;
    expect(get(drop(['IN1']), 'intrinsic').valid).toBe(true);
    expect(get(drop(['IN1', 'IN2']), 'intrinsic').valid).toBe(false);
    expect(get(drop(['IN1', 'IN2']), 'autonomous').valid).toBe(true);
    expect(get(drop(['IN1', 'IN2', 'ID1']), 'autonomous').valid).toBe(false);
    // Profil hesaplanamayınca harita noktasız, profil adı yok ve hesaplanamadığı söylenir; cevaplanan türler yine yorumlanır.
    const r = evaluate(SLUG, { grade: 8, data: { engine: 'likert', answers: drop(['IN1', 'IN2', 'ID1']) } });
    for (const [aud, rep] of [
      ['student', r.student],
      ['parent', r.parent],
    ] as const) {
      const c = rep.chart as QuadrantChart;
      expect(c.type).toBe('quadrant');
      expect(c.x.value, aud).toBeNull();
      expect(c.active, aud).toBeNull();
      expect(rep.items[0].badge, aud).toBeUndefined();
      expect(rep.items[0].text, aud).toContain('hesaplanamadı');
      expect(rep.groups![0].badge, aud).toBe('Hesaplanamadı');
      expect(rep.groups![1].badge, aud).toBe('Düşük · 2,0 / 5');
    }
  });

  it('cevap kalitesi: uzun aynı cevap dizisi uyarılır; hepsine "Tamamen uyuyor" denirse ters düşen cevaplar da uyarılır', () => {
    const all = Object.fromEntries(d.items.map((i) => [i.key, { value: 5, rtMs: 2500 }]));
    expect(likertQuality(d, all).straightLining).toBe(true);
    const r = evaluate(SLUG, { grade: 8, data: { engine: 'likert', answers: all } });
    for (const rep of [r.student, r.parent]) {
      expect(rep.cautions.some((c) => c.includes('hep aynı seçenek'))).toBe(true);
      expect(rep.cautions.some((c) => c.includes('birbirine ters düşüyor'))).toBe(true);
    }
    expect(r.student.cautions.join(' ')).toContain('dedin');
    expect(r.parent.cautions.join(' ')).toContain('denmiş');
  });
});

describe('Ders çalışma motivasyonu: rapor', () => {
  /** Tür başına değerler: her düzeyden iki değer dönüşümlü denenir (düşük 1–2, orta 3, yüksek 4–5). */
  const VALUES: Record<Level, number[]> = { low: [1, 2], average: [3], high: [4, 5] };

  it('bütün düzey birleşimlerinde öğrenci ve veli raporu eksiksiz ve tutarlı: harita, profil, eğilim cümleleri, gruplar, uyarı ve yol haritası', () => {
    const levels: Level[] = ['low', 'average', 'high'];
    let n = 0;
    const seenPatterns = new Set<string>();
    for (let k = 0; k < 3 ** 5; k++) {
      const combo = TYPES.map((_, i) => levels[Math.floor(k / 3 ** i) % 3]);
      const values = Object.fromEntries(TYPES.map((t, i) => [t, VALUES[combo[i]][(k + i) % VALUES[combo[i]].length]]));
      const r = evaluate(SLUG, bodyFor(values, 5 + (k % 9)));
      const { auto, ctrl, pattern } = expected(values, 'student');
      seenPatterns.add(pattern);
      for (const [aud, rep] of [
        ['student', r.student],
        ['parent', r.parent],
      ] as const) {
        const tag = `${combo.join('/')} ${aud}`;
        const pick = (x: { student: string; parent: string }) => (aud === 'student' ? x.student : x.parent);
        // Harita
        const c = rep.chart as QuadrantChart;
        expect(c.type, tag).toBe('quadrant');
        expect([c.x.label, c.y.label], tag).toEqual(['Kendi isteğiyle çalışma', 'Baskıyla çalışma']);
        expect(c.x.value, tag).toBeCloseTo(auto, 5);
        expect(c.y.value, tag).toBeCloseTo(ctrl, 5);
        expect(c.active, tag).toBe(pattern);
        expect(c.cuts, tag).toEqual([2.5, 3.5]);
        expect(rep.chartNote, tag).toBe(pick(m.chartNote));
        // Profil, "tek başına yüksek" ve eğilim cümleleri.
        const exp = expected(values, aud);
        expect(rep.items, tag).toHaveLength(1);
        expect(rep.items[0].title, tag).toBe(aud === 'student' ? 'Motivasyon profilin' : 'Motivasyon profili');
        expect(rep.items[0].badge, tag).toBe(m.patterns[pattern].name);
        expect(rep.items[0].text, tag).toBe(exp.text);
        expect(c.activeLabel, tag).toBe(m.patterns[pattern].name);
        // Gruplar: kendi isteğiyle, baskıyla, isteksizlik; her biri kendi açıklaması ve türlerin cetvelleriyle.
        const groups = rep.groups!;
        expect(groups.map((g) => g.title), tag).toEqual(['Kendi isteğiyle çalışma', 'Baskıyla çalışma', 'İsteksizlik']);
        expect(groups.map((g) => g.text), tag).toEqual(['autonomous', 'controlled', 'amotivation'].map((x) => pick(m.groupText[x])));
        expect(groups.map((g) => g.facets.map((f) => f.label)), tag).toEqual([NAMES.slice(0, 2), NAMES.slice(2, 4), NAMES.slice(4)]);
        expect(groups[0].badge, tag).toContain(LEVEL_LABEL[level(auto)]);
        expect(groups[1].badge, tag).toContain(LEVEL_LABEL[level(ctrl)]);
        const facets = groups.flatMap((g) => g.facets);
        TYPES.forEach((t, i) => {
          const bt = tpl.scales[t][combo[i]]!;
          expect(facets[i].band, tag).toBe(LEVEL_LABEL[combo[i]]);
          expect(facets[i].text, tag).toBe(pick(bt));
        });
        // Uyarılar: yalnızca kendi isteğiyle çalışma (ya da bir parçası) ve isteksizlik birlikte yüksekken; uzun aynı cevap
        // dizisi olağandır.
        expect(rep.cautions.filter((x) => !x.includes('hep aynı seçenek')), tag).toEqual(exp.caution ? [exp.caution] : []);
        // Destek kutusu (acil durum numarası) gösterilmez; yönlendirme metinlerin içindedir.
        expect(rep.support, tag).toBeNull();
        if (aud === 'student') expect(text(rep), tag).not.toMatch(/[Çç]ocuğunuz/);
        else expect(text(rep), tag).not.toMatch(/\b(çalışıyorsun|görüyorsun|dedin|buluyorsun|hissediyorsun)\b/);
        for (const x of strings(rep)) expect(x.replaceAll('\n\n', ' '), tag).not.toMatch(/undefined|null|\s{2}|\n|tembel(sin|dir)/);
        // Yol haritası: beş tür; 2. hafta "Neden önemli?"; 3. hafta isteksizlik, yoksa iç baskı yüksekse ona ayrılır.
        const rm = rep.roadmap!;
        expect(rm.bars.map((b) => b.key), tag).toEqual(TYPES);
        expect(rm.settings, tag).toBeNull();
        expect(rm.weeks.map((w) => w.title).slice(0, 2), tag).toEqual(['Fark et', 'Neden önemli?']);
        const third = combo[4] === 'high' ? 'İsteksizlik' : combo[2] === 'high' ? 'İç baskı' : null;
        if (third) expect(rm.weeks[2].title, tag).toBe(third);
        expect(rm.study.links.map((l) => l.href), tag).toEqual([
          '/rehber/etkili-ders-calisma-yontemleri',
          ...(combo[4] !== 'high' && combo[2] === 'high' ? ['/rehber/sinav-kaygisi'] : []),
        ]);
        n++;
      }
    }
    expect(n).toBe(3 ** 5 * 2);
    // Dokuz profilin hepsi en az bir kez görüldü.
    expect([...seenPatterns].sort()).toEqual(Object.keys(m.patterns).sort());
  }, 120_000);

  it('dokuz profil, dört köşe; profil adları birbirinden ve eksen adlarından farklı, haritada iki satıra sığar', () => {
    const keys = ['low', 'average', 'high'].flatMap((x) => ['low', 'average', 'high'].map((y) => `${x}-${y}`));
    expect(Object.keys(m.patterns).sort()).toEqual(keys.sort());
    const names = Object.values(m.patterns).map((p) => p.name);
    expect(new Set(names).size).toBe(9);
    for (const name of names) expect(['Kendi isteğiyle çalışma', 'Baskıyla çalışma', 'İsteksizlik']).not.toContain(name);
    expect(m.patterns['high-low'].name).toBe('İsteğe dayalı motivasyon');
    expect(m.patterns['low-high'].name).toBe('Baskıya dayalı motivasyon');
    for (const k of ['low-low', 'high-low', 'low-high', 'high-high']) {
      const lines = twoLines(m.patterns[k].name);
      expect(lines.length, k).toBe(2);
      for (const l of lines) expect(l.length, k).toBeLessThanOrEqual(14);
    }
    // Araştırma adları köşelerde anılır.
    expect(m.patterns['high-low'].student).toContain('iyi nitelikli motivasyon');
    expect(m.patterns['high-high'].student).toContain('yüksek miktarda motivasyon');
    expect(m.patterns['low-high'].student).toContain('düşük nitelikli motivasyon');
    expect(m.patterns['low-low'].student).toContain('düşük miktarda motivasyon');
  });

  it('harita çizimi: hücreler düzlemi tam kaplar, köşe adları dış köşelerde, nokta sınırların içinde', () => {
    const chart: QuadrantChart = {
      type: 'quadrant',
      x: { label: 'Kendi isteğiyle çalışma', value: 5 },
      y: { label: 'Baskıyla çalışma', value: 1 },
      min: 1,
      max: 5,
      cuts: [2.5, 3.5],
      corners: [
        { x: 'low', y: 'low', label: 'Düşük motivasyon' },
        { x: 'high', y: 'low', label: 'İsteğe dayalı motivasyon' },
        { x: 'low', y: 'high', label: 'Baskıya dayalı motivasyon' },
        { x: 'high', y: 'high', label: 'Hem istek hem baskı' },
      ],
      active: 'high-low',
      activeLabel: 'İsteğe dayalı motivasyon',
    };
    const g = quadrantGeometry(chart, { left: 10, top: 20, size: 400 });
    expect(g.cells).toHaveLength(9);
    expect(g.cells.reduce((s, c) => s + c.w * c.h, 0)).toBeCloseTo(400 * 400, 3);
    expect(g.cells.filter((c) => c.active).map((c) => c.key)).toEqual(['high-low']);
    expect(g.point).toEqual({ x: 410, y: 420 });
    const corner = Object.fromEntries(g.corners.map((c) => [c.key, c]));
    expect([corner['high-high'].x, corner['high-high'].y, corner['high-high'].anchor, corner['high-high'].top]).toEqual([410, 20, 'end', true]);
    // Nokta sağ alt köşede (5; 1): o hücrenin adı dış kenardan (alt) iç kenara (üst) alınır, nokta yazının üstüne binmez.
    expect([corner['high-low'].y, corner['high-low'].top]).toEqual([g.cells.find((c) => c.key === 'high-low')!.y, true]);
    // Nokta hücrenin ortasındayken ad dış kenarda kalır.
    const mid = quadrantGeometry({ ...chart, x: { ...chart.x, value: 4.25 }, y: { ...chart.y, value: 1.75 } }, { left: 10, top: 20, size: 400 });
    expect(mid.corners.find((c) => c.key === 'high-low')!.top).toBe(false);
    expect([corner['low-low'].x, corner['low-low'].y, corner['low-low'].anchor]).toEqual([10, 420, 'start']);
    expect(g.ticks.map((t) => t.v)).toEqual([1, 2, 3, 4, 5]);
    expect(g.cuts.map((c) => c.x)).toEqual([160, 260]);
    // Ölçeğin dışına taşan değer kenara çekilir; hesaplanamayan eksende nokta yok.
    expect(quadrantGeometry({ ...chart, x: { ...chart.x, value: 7 } }, { left: 0, top: 0, size: 100 }).point!.x).toBe(100);
    expect(quadrantGeometry({ ...chart, y: { ...chart.y, value: null } }, { left: 0, top: 0, size: 100 }).point).toBeNull();
  });

  it('metinler araştırmalara dayalı ve suçlamayan bir dille yazılmış; destek kutusu yok, yönlendirme metinde', () => {
    const all = JSON.stringify(tpl);
    expect(all).not.toMatch(/tembelsin|tembeldir|başarısızsın/);
    expect(Object.values(tpl.scales).flatMap((s) => Object.values(s)).filter((x) => x?.support)).toHaveLength(0);
    expect(tpl.scales.introjected.high!.student).toContain('bir rehber öğretmenle');
    expect(tpl.scales.amotivation.high!.parent).toContain('rehberlik servisiyle');
    expect(tpl.scales.external.high!.student).toContain('başarı ve vazgeçmeden sürdürmeyle ilişkili olmadığı');
    // Mezunlar da çözdüğü için "okulundaki" denmez; nedensellik ve kesinlik bildiren sözler yok.
    expect(all).not.toMatch(/okulundaki|öğrenmeye en çok yarayan|kısa vadede|Bu çok yaygın|\bsebat/);
    expect(tpl.scales.introjected.high!.student).toContain('kaygıyla en çok ilişkili');
  });

  it('kesirli ortalamalarda (rastgele 4000 birleşim) profil, "tek başına yüksek" ve eğilim cümleleri ve uyarı tutarlı', () => {
    // Her türün ortalaması 1,0–5,0 arasında 0,2'lik adımlarla; sınırlar (2,4/2,6, 3,4/3,6) ve 1 puanlık fark sık denenir.
    const MEANS = Array.from({ length: 21 }, (_, i) => 1 + i * 0.2);
    let seed = 20261009;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2 ** 31;
      return seed / 2 ** 31;
    };
    const seen = { hidden: 0, lean: 0, caution: 0 };
    for (let k = 0; k < 4000; k++) {
      const values = Object.fromEntries(TYPES.map((t) => [t, Math.round(MEANS[Math.floor(rand() * MEANS.length)] * 10) / 10]));
      const r = evaluate(SLUG, bodyFor(values));
      for (const [aud, rep] of [
        ['student', r.student],
        ['parent', r.parent],
      ] as const) {
        const tag = `${JSON.stringify(values)} ${aud}`;
        const exp = expected(values, aud);
        expect((rep.chart as QuadrantChart).active, tag).toBe(exp.pattern);
        expect(rep.items[0].text, tag).toBe(exp.text);
        expect(rep.cautions.filter((x) => !x.includes('hep aynı seçenek')), tag).toEqual(exp.caution ? [exp.caution] : []);
        // Anlam denetimi: bir baskı türü yüksekken profil yorumu bunu söyler (bileşik ölçek yüksek ya da "tek başına
        // yüksek"); kendi isteğine dayalı türlerde de aynı.
        const txt = rep.items[0].text;
        if (level(values.introjected) === 'high' && level(exp.ctrl) !== 'high') expect(txt, tag).toContain('iç baskı tek başına yüksek');
        if (level(values.external) === 'high' && level(exp.ctrl) !== 'high') expect(txt, tag).toContain('dış baskı ve ödül tek başına yüksek');
        if (level(values.intrinsic) === 'high' && level(exp.auto) !== 'high') expect(txt, tag).toContain('merak ve keyif tek başına yüksek');
        if (level(values.identified) === 'high' && level(exp.auto) !== 'high') expect(txt, tag).toContain('önemini görme tek başına yüksek');
        expect(txt, tag).not.toMatch(/baskı yok|ne istek ne de baskı|\{düzey\}/);
        if (txt.includes('tek başına yüksek')) seen.hidden++;
        if (txt.includes('belirgin bir fark var')) seen.lean++;
        if (exp.caution) seen.caution++;
      }
    }
    // Her yol yeterince denendi.
    expect(seen.hidden).toBeGreaterThan(500);
    expect(seen.lean).toBeGreaterThan(500);
    expect(seen.caution).toBeGreaterThan(100);
  }, 120_000);

  it('PDF raporu üretilir (öğrenci ve veli)', async () => {
    const r = evaluate(SLUG, bodyFor({ intrinsic: 4, identified: 5, introjected: 3, external: 2, amotivation: 1 }));
    for (const rep of [r.student, r.parent]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/ders-calisma-motivasyonu');
    const mm = /DM_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(mm![1])).toEqual(d.items.map((i) => i.key));
    // Gövdedeki cevaplar: sırayla 1, 2, 3, 4, 5, … (likertBody'de seçenek sırası 0–4): merak 1, dış baskı 2, önemini görme 3,
    // isteksizlik 4, iç baskı 5.
    const r = evaluate(SLUG, likertBody(SLUG, 8, (i) => i % 5));
    const c = r.student.chart as QuadrantChart;
    expect([c.type, c.active, r.student.items[0].badge]).toEqual(['quadrant', 'low-high', 'Baskıya dayalı motivasyon']);
    expect(r.student.groups!.map((g) => g.facets.length)).toEqual([2, 2, 1]);
    const rm = r.parent.roadmap!;
    expect([rm.bars.length, rm.approach!.items.length, rm.settings, rm.weeks[1].title, rm.weeks[2].title, rm.preview]).toEqual([
      5,
      5,
      null,
      'Neden önemli?',
      'İsteksizlik',
      false,
    ]);
  });
});

describe('Ders çalışma motivasyonu: yayın', () => {
  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; yol haritası var', () => {
    expect(d.status).toBe('pilot');
    expect(d.licenseStatus).toBe('original');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(ROADMAPS[SLUG].planningScale).toBe('identified');
  });

  it('kaynaklar: künyeler DOI bağlantılı ve bilim kartında anılıyor', () => {
    const cites = d.science.citations;
    expect(cites).toHaveLength(5);
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['Ryan ve Deci, 2000', 'Ryan ve Connell’in (1989)', 'Vansteenkiste ve ark., 2009', 'Howard ve ark., 2021', 'Bureau ve ark., 2022']) {
      expect(body, a).toContain(a);
    }
  });
});
