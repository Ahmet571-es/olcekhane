import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { AssessmentError, evaluateReports } from '@/lib/assessment/evaluate';
import {
  RECORD_MARK,
  compareResults,
  encodeRecords,
  gapText,
  readRecords,
  toRecord,
  type CompareInfo,
  type CompareRow,
  type ResultRecord,
} from '@/lib/compare/record';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderPackageReportPdf, renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { retestNote, rowText, withUnit } from '@/components/test/compare-panel';
import { TASK_COMPARE, TASK_COMPARE_SINCE } from '@/lib/compare/tasks';
import type { TaskInstrument } from '@/lib/instruments/types';
import { likertBody, quizBody, readingBody } from './helpers/bodies';
import { TASK_VARIANTS } from './helpers/task-variants';
import { schoolWords } from './helpers/school';

const LIKERT = publicInstruments().filter((d): d is LikertInstrument => d.engine === 'likert');
const reportsOf = (slug: string, grade: number, pick: (i: number) => number) =>
  Object.values(evaluateReports(slug, likertBody(slug, grade, pick))) as SimpleReport[];
const gradeFor = (d: LikertInstrument) => (gradeAllowed(d, 9) ? 9 : d.minGrade);

const info = (scales: Partial<CompareInfo['scales'][number]>[], date = '2026-10-30T12:00:00.000Z'): CompareInfo => ({
  slug: 'deneme',
  version: 2,
  date,
  scales: scales.map((s, i) => ({ key: `k${i}`, label: `Ölçek ${i}`, value: 3, min: 1, max: 5, sem: 0.2, decimals: 1, band: 'Orta', ...s })),
});
const rec = (values: [number, string | null][], date = '2026-04-30T12:00:00.000Z', v = 2, s = 'deneme'): ResultRecord => ({
  s,
  v,
  d: date,
  r: values.map(([x, b], i) => [`k${i}`, x, b]),
});

describe('Gelişimini karşılaştır: raporlardaki bilgi', () => {
  it('her anket testinde öğrenci, veli ve yetişkin raporu ölçek ölçek puan, aralık, düzey ve (güvenirliği biliniyorsa) ölçüm payı taşır', () => {
    expect(LIKERT.length).toBeGreaterThan(20);
    for (const d of LIKERT) {
      for (const grade of [gradeFor(d), ...(gradeAllowed(d, ADULT_GRADE) ? [ADULT_GRADE] : [])]) {
        for (const r of reportsOf(d.slug, grade, (i) => (i * 3 + 1) % 5)) {
          const c = r.compare!;
          expect(c, `${d.slug} ${r.audience}`).toBeDefined();
          expect(c.slug).toBe(d.slug);
          expect(c.version).toBe(d.version);
          expect(Number.isNaN(Date.parse(c.date))).toBe(false);
          expect(c.scales.map((s) => s.key), d.slug).toEqual(d.scales.map((s) => s.key));
          for (const s of c.scales) {
            const scale = d.scales.find((x) => x.key === s.key)!;
            expect(s.label).toBe(scale.name);
            expect(s.value, `${d.slug} ${s.key}`).toBeGreaterThanOrEqual(s.min);
            expect(s.value, `${d.slug} ${s.key}`).toBeLessThanOrEqual(s.max);
            expect(s.decimals).toBe(d.scoring.method === 'mean' ? 1 : 0);
            expect(s.sem !== null, `${d.slug} ${s.key}`).toBe(!!(scale.alpha && scale.sdRef));
            if (s.sem !== null) expect(s.sem).toBeGreaterThan(0);
            expect(s.band, `${d.slug} ${s.key}`).toBeTruthy();
          }
        }
      }
    }
  });

  it('karşılaştırma yalnızca anket ve görev testlerinde: konu tarama, okuma ve sesli okumada yok', () => {
    const engines = new Set(publicInstruments().map((d) => d.engine));
    expect([...engines].sort()).toEqual(['likert', 'oral', 'quiz', 'reading', 'tasks']);
    for (const r of Object.values(evaluateReports('matematik-konu-tarama-testi', quizBody(6, 3))) as SimpleReport[]) expect(r.compare).toBeUndefined();
    for (const r of Object.values(evaluateReports('okuma-hizi-ve-anlama', readingBody(5))) as SimpleReport[]) expect(r.compare).toBeUndefined();
    // Sesli okumanın raporu kendi kurulumunda hazırlanır (karşılaştırma bilgisi eklenmeden döner).
    const src = readFileSync(new URL('../src/lib/assessment/evaluate.ts', import.meta.url), 'utf8');
    expect(src).toContain("if (def.engine === 'tasks') return taskCompareInfo(def, content, rows);");
    expect(src).toContain("if (def.engine !== 'likert') return undefined;");
    expect(src.indexOf("if (def.engine === 'oral')")).toBeLessThan(src.indexOf('const compare = compareInfo('));
  });
});

describe('Gelişimini karşılaştır: PDF', () => {
  it('tek testin PDF’i sonucun özetini taşır; dosyadan geri okunur ve aynı sonuçla karşılaştırınca her ölçek "Aynı"', async () => {
    const [student] = reportsOf('bes-faktor-kisilik', 8, (i) => i % 5);
    const pdf = await renderSimpleReportPdf(student, 'olcekhane.com');
    const records = readRecords(new Uint8Array(pdf));
    expect(records).toEqual([toRecord(student.compare!)]);
    // Özette ad, sınıf ya da cevap yok: yalnızca test, sürüm, tarih ve ölçek puanları.
    expect(Object.keys(records![0]).sort()).toEqual(['d', 'r', 's', 'v']);
    const out = compareResults(student.compare!, records!);
    expect(out.status).toBe('ok');
    if (out.status === 'ok') expect(out.rows.map((r) => r.verdict)).toEqual(student.compare!.scales.map(() => 'same'));
  }, 60_000);

  it('paket PDF’i anket testlerinin özetlerini taşır; her test kendi özetini bulur', async () => {
    const grade = 9;
    const entries = (['bes-faktor-kisilik', 'meslek-ilgi-alanlari'] as const).map((slug) => ({
      slug,
      skill: slug,
      areaName: slug,
      report: reportsOf(slug, grade, (i) => (i * 7) % 5)[0],
    }));
    const pdf = await renderPackageReportPdf({ entries, skipped: [], gradeLabel: '9. sınıf', completedAt: new Date() }, 'olcekhane.com');
    const records = readRecords(new Uint8Array(pdf))!;
    expect(records.map((r) => r.s)).toEqual(['bes-faktor-kisilik', 'meslek-ilgi-alanlari']);
    for (const e of entries) expect(compareResults(e.report.compare!, records).status).toBe('ok');
  }, 120_000);

  it('özeti olmayan, bozuk ya da başka biçimde dosyalar reddedilir', () => {
    const bytes = (s: string) => new TextEncoder().encode(s);
    expect(readRecords(bytes('%PDF-1.4 hiçbir şey yok'))).toBeNull();
    expect(readRecords(bytes(`(${RECORD_MARK}bozuk!!)`))).toBeNull();
    expect(readRecords(bytes(`(${encodeRecords([])})`))).toBeNull();
    expect(readRecords(bytes(`(${RECORD_MARK}${btoa(JSON.stringify([{ s: 'x', v: '1', d: 'tarih', r: [] }]))})`))).toBeNull();
    // Türkçe düzey adları (UTF-8) kodlanıp geri okunur.
    const r = rec([[3.4, 'Çok yüksek'], [2, null]]);
    expect(readRecords(bytes(`/Keywords (${encodeRecords([r])})`))).toEqual([r]);
  });
});

describe('Gelişimini karşılaştır: karşılaştırma', () => {
  it('güvenilir değişim: fark √2·SEM·1,96’yı aşınca belirgin; aşmayınca ölçüm payı içinde; ölçüm payı bilinmeyince yalnızca yön', () => {
    // SEM 0,2 → eşik 1,96·√2·0,2 ≈ 0,554.
    const cur = info([{ value: 3.6 }, { value: 3.5 }, { value: 2.4 }, { value: 3.5, sem: null }, { value: 3.04 }, { value: 2.5, sem: null }]);
    const out = compareResults(cur, [rec([[3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta']])]);
    expect(out.status).toBe('ok');
    if (out.status !== 'ok') return;
    expect(out.rows.map((r) => r.verdict)).toEqual(['up', 'stable', 'down', 'up-unknown', 'same', 'down-unknown']);
    expect(out.days).toBe(183);
    expect(out.known).toBe(true);
    expect(gapText(out.days)).toBe('yaklaşık 6 ay');
  });

  it('başka testin ya da başka sürümün özeti karşılaştırılmaz; pakette aynı testin özeti seçilir', () => {
    const cur = info([{ value: 3 }]);
    expect(compareResults(cur, [rec([[3, 'Orta']], undefined, 2, 'baska')])).toEqual({ status: 'other-test' });
    expect(compareResults(cur, [rec([[3, 'Orta']], undefined, 1)])).toEqual({ status: 'version' });
    expect(compareResults(cur, [rec([[3, 'Orta']], undefined, 2, 'baska'), rec([[2, 'Düşük']])]).status).toBe('ok');
    // Aralık dışındaki (bozuk) puan karşılaştırılmaz.
    const bad = compareResults(cur, [rec([[9, 'Orta']])]);
    expect(bad.status === 'ok' && bad.rows.length).toBe(0);
  });

  it('süre: aynı gün, gün, ay, yıl', () => {
    expect(gapText(0)).toBe('aynı gün');
    expect(gapText(12)).toBe('12 gün');
    expect(gapText(-12)).toBe('12 gün');
    expect(gapText(90)).toBe('yaklaşık 3 ay');
    expect(gapText(550)).toBe('yaklaşık 1,5 yıl');
  });

  it('satır metinleri: düzey değiştiyse söylenir; fark ölçüm payı içindeyken düzeyin değişmesi sınıra yakınlıkla açıklanır; çelişki yok', () => {
    const row = (verdict: CompareRow['verdict'], bandBefore: string | null, bandAfter: string | null): CompareRow => ({
      key: 'k',
      label: 'Ölçek',
      before: 3,
      after: 3.3,
      min: 1,
      max: 5,
      decimals: 1,
      bandBefore,
      bandAfter,
      verdict,
    });
    for (const v of ['up', 'down', 'stable', 'up-unknown', 'down-unknown', 'same'] as const) {
      for (const [a, b] of [['Orta', 'Orta'], ['Orta', 'Yüksek'], [null, 'Orta']] as const) {
        const t = rowText(row(v, a, b));
        expect(t, `${v} ${a} ${b}`).toMatch(/\.$/);
        expect(t.includes('“Orta” → “Yüksek”') || t.includes('“Orta” iken “Yüksek”'), `${v} ${a} ${b}`).toBe(a === 'Orta' && b === 'Yüksek');
        if (v === 'stable' && a !== b && a) expect(t).toContain('sınırına yakın');
        if (v.endsWith('unknown')) expect(t).toContain('söylenemez');
        expect(schoolWords(t)).toEqual([]);
      }
    }
  });

  it('ekran: dosya yalnızca tarayıcıda okunur; depo, çerez ya da istek yok; veli sekmesinde "siz" dili', () => {
    const ui = readFileSync(new URL('../src/components/test/compare-panel.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    expect(ui).toContain('Önceki sonuçla karşılaştırın');
    expect(ui).toContain('Jacobson ve Truax, 1991');
    for (const f of ['../src/components/test/test-session.tsx', '../src/components/paket/package-session.tsx']) {
      expect(readFileSync(new URL(f, import.meta.url), 'utf8')).toContain('<ComparePanel');
    }
  });

  it('yetişkin raporu okula özgü sözcük taşımaz; geçersiz sınıfta rapor zaten verilmez', () => {
    const d = LIKERT.find((x) => gradeAllowed(x, ADULT_GRADE))!;
    const [adult] = reportsOf(d.slug, ADULT_GRADE, (i) => i % 5);
    expect(schoolWords(JSON.stringify(adult.compare))).toEqual([]);
    expect(() => evaluateReports('oz-saygi', likertBody('oz-saygi', 2, (i) => i))).toThrow(AssessmentError);
  });
});

const TASKS = publicInstruments().filter((d): d is TaskInstrument => d.engine === 'tasks');
const UNREAD = /^(Yorumlanmadı|Hesaplanamadı|Süre hesaplanamadı|Cevap verilmedi|Hiç basılmadı|Süre içinde tamamlanamadı|Düzey belirtilmedi)$/;
const specKey = (s: { key: string; sub?: string }) => (s.sub ? `${s.key}.${s.sub}` : s.key);
const SAME_ITEMS_KINDS = ['matrix_reasoning', 'figural_analogy', 'number_series', 'letter_series', 'verbal_reasoning', 'logical_reasoning', 'paper_folding', 'numerical_reasoning', 'cube_net', 'mental_rotation_3d', 'perspective', 'hidden_figures', 'cognitive_reflection', 'vocabulary', 'tower', 'word_list'];

/** Görev testinin bütün örnek sonuçları: öğrenci, veli ve (açıksa) yetişkin raporları. */
function taskReports(d: TaskInstrument) {
  return Object.entries(TASK_VARIANTS[d.slug]).flatMap(([name, mk]) => {
    const body = mk();
    const grade = Math.max(body.grade, d.minGrade);
    const school = Object.values(evaluateReports(d.slug, { ...body, grade })) as SimpleReport[];
    const adult = gradeAllowed(d, ADULT_GRADE) ? (Object.values(evaluateReports(d.slug, { ...body, grade: ADULT_GRADE })) as SimpleReport[]) : [];
    return [...school, ...adult].map((r) => ({ name, r }));
  });
}

describe('Gelişimini karşılaştır: görev testleri', () => {
  it('yayındaki her görev testinin karşılaştırılan sayıları tanımlı; anahtarlar testin ölçekleri, testteki sırayla', () => {
    expect(TASKS.length).toBeGreaterThanOrEqual(28);
    expect(Object.keys(TASK_COMPARE).sort()).toEqual(TASKS.map((d) => d.slug).sort());
    for (const d of TASKS) {
      const keys = d.scales.map((s) => s.key);
      const idx = TASK_COMPARE[d.slug].map((s) => keys.indexOf(s.key));
      expect(idx.every((i) => i >= 0), d.slug).toBe(true);
      expect([...idx].sort((a, b) => a - b), d.slug).toEqual(idx);
      for (const s of TASK_COMPARE[d.slug]) expect(!!s.time, `${d.slug} ${specKey(s)}`).toBe(s.unit === 'sn');
    }
  });

  it('bütün örnek sonuçlarda: değerler aralıkta, birim ve ondalık tanımla aynı; yorumlanmayan kartın sayısı yok; üç raporda aynı sayılar', () => {
    for (const d of TASKS) {
      const spec = TASK_COMPARE[d.slug];
      const order = spec.map(specKey);
      const seen = new Set<string>();
      let none = 0;
      for (const { name, r } of taskReports(d)) {
        const label = `${d.slug} ${name} ${r.audience}`;
        const c = r.compare;
        if (!c) {
          none++;
          continue;
        }
        expect(c.slug, label).toBe(d.slug);
        expect(c.version, label).toBe(d.version);
        expect(Number.isNaN(Date.parse(c.date)), label).toBe(false);
        expect(c.since, label).toBe(TASK_COMPARE_SINCE);
        expect(c.retest, label).toBe(d.tasks.some((t) => SAME_ITEMS_KINDS.includes(t.kind)) ? 'items' : 'practice');
        const keys = c.scales.map((s) => s.key);
        expect(keys.map((k) => order.indexOf(k)), label).toEqual(keys.map((k) => order.indexOf(k)).filter((i) => i >= 0).sort((a, b) => a - b));
        for (const s of c.scales) {
          const sp = spec.find((x) => specKey(x) === s.key)!;
          seen.add(s.key);
          expect(s.value, `${label} ${s.key}`).toBeGreaterThanOrEqual(s.min);
          expect(s.value, `${label} ${s.key}`).toBeLessThanOrEqual(s.max);
          expect(s.decimals, label).toBe(sp.decimals);
          expect(s.unit ?? '', label).toBe(sp.unit);
          expect(!!s.time, label).toBe(!!sp.time);
          expect(s.sem, label).toBeNull();
          expect(s.band, label).toBeNull();
          expect(Math.round(s.value * 10 ** s.decimals) / 10 ** s.decimals, `${label} ${s.key}`).toBe(s.value);
        }
        // Kartı yorumlanmayan ölçeğin sayısı özette yok.
        for (const sp of spec) {
          const card = r.items.find((it) => it.title === d.scales.find((x) => x.key === sp.key)!.name);
          if (!card || !card.visual || UNREAD.test(card.badge ?? '')) expect(keys, `${label} ${specKey(sp)}`).not.toContain(specKey(sp));
        }
        if (r.audience === 'adult') expect(schoolWords(JSON.stringify(c)), label).toEqual([]);
      }
      // Her tanımlı sayı en az bir örnekte karşılaştırılır; her testte en az bir örnek karşılaştırılabilir.
      for (const k of order) expect(seen.has(k), `${d.slug} ${k} hiçbir örnekte yok`).toBe(true);
      expect(none, d.slug).toBeLessThan(Object.keys(TASK_VARIANTS[d.slug]).length * 3);
    }
    // Aynı sonucun öğrenci, veli ve yetişkin raporu aynı sayıları taşır.
    const body = TASK_VARIANTS['simge-bulma'].varsayilan();
    const [st, pa] = Object.values(evaluateReports('simge-bulma', { ...body, grade: 6 })) as SimpleReport[];
    const [ad] = Object.values(evaluateReports('simge-bulma', { ...body, grade: ADULT_GRADE })) as SimpleReport[];
    expect(pa.compare!.scales).toEqual(st.compare!.scales);
    expect(ad.compare!.scales).toEqual(st.compare!.scales);
  });

  it('hiçbir sonucu yorumlanmayan raporda karşılaştırma bölümü yok', () => {
    for (const v of ['az', 'hic', 'tekDugme', 'rastgele']) {
      for (const r of Object.values(evaluateReports('simge-bulma', TASK_VARIANTS['simge-bulma'][v]())) as SimpleReport[]) expect(r.compare, v).toBeUndefined();
    }
  });

  it('görev raporunun PDF’i özeti taşır; geri okunur; tek başına ve pakette', async () => {
    const [student] = Object.values(evaluateReports('simge-bulma', TASK_VARIANTS['simge-bulma'].varsayilan())) as SimpleReport[];
    const records = readRecords(new Uint8Array(await renderSimpleReportPdf(student, 'olcekhane.com')));
    expect(records).toEqual([toRecord(student.compare!)]);
    const out = compareResults(student.compare!, records!);
    expect(out.status === 'ok' && out.rows.map((r) => r.verdict)).toEqual(student.compare!.scales.map(() => 'same'));
    const grade = 9;
    const entries = [
      { slug: 'bes-faktor-kisilik', report: reportsOf('bes-faktor-kisilik', grade, (i) => (i * 7) % 5)[0] },
      { slug: 'sekil-akil-yurutme', report: (Object.values(evaluateReports('sekil-akil-yurutme', { ...TASK_VARIANTS['sekil-akil-yurutme'].varsayilan(), grade })) as SimpleReport[])[0] },
    ].map((e) => ({ ...e, skill: e.slug, areaName: e.slug }));
    const pkg = readRecords(new Uint8Array(await renderPackageReportPdf({ entries, skipped: [], gradeLabel: '9. sınıf', completedAt: new Date() }, 'olcekhane.com')))!;
    expect(pkg.map((r) => r.s)).toEqual(['bes-faktor-kisilik', 'sekil-akil-yurutme']);
    for (const e of entries) expect(compareResults(e.report.compare!, pkg).status).toBe('ok');
  }, 120_000);

  it('sürelerde "uzadı/kısaldı" denir; birimler; yargı bildiren sözcük yok', () => {
    const row = (verdict: CompareRow['verdict'], time: boolean): CompareRow => ({
      key: 'k',
      label: 'Süre',
      before: 1.5,
      after: 1.2,
      min: 0,
      max: 3600,
      decimals: 1,
      unit: 'sn',
      ...(time ? { time: true as const } : {}),
      bandBefore: null,
      bandAfter: null,
      verdict,
    });
    expect(rowText(row('up-unknown', true))).toMatch(/^Süre uzadı; .*söylenemez\.$/);
    expect(rowText(row('down-unknown', true))).toMatch(/^Süre kısaldı; .*söylenemez\.$/);
    expect(rowText(row('same', true))).toBe('Süre aynı.');
    expect(rowText(row('up-unknown', false))).toMatch(/^Arttı; /);
    expect(withUnit('88', '%')).toBe('%88');
    expect(withUnit('1,5', 'sn')).toBe('1,5 sn');
    expect(withUnit('8,2', '°')).toBe('8,2°');
    expect(withUnit('18', undefined)).toBe('18');
    const ui = readFileSync(new URL('../src/components/test/compare-panel.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/iyileşti|kötüleşti|geriledi/);
  });

  it('alıştırma etkisi notu yalnızca görev testlerinde; aynı soruların geldiği testlerde hatırlananlar da söylenir', () => {
    for (const you of [true, false]) {
      const p = retestNote('practice', you);
      const i = retestNote('items', you);
      expect(p).toContain('(Scharfen ve ark., 2018)');
      expect(i.startsWith(p)).toBe(true);
      expect(i).toContain('aynı sorular');
      expect(p).not.toContain('aynı sorular');
      expect(p).toMatch(you ? /sayma\.$/ : /saymayın\.$/);
      expect(schoolWords(i)).toEqual([]);
    }
    const ui = readFileSync(new URL('../src/components/test/compare-panel.tsx', import.meta.url), 'utf8');
    expect(ui).toContain('{compare.retest && <p className="text-ink-2">{retestNote(compare.retest, you)}</p>}');
    for (const d of LIKERT) expect(reportsOf(d.slug, gradeFor(d), (i) => i % 5)[0].compare?.retest, d.slug).toBeUndefined();
    // Künye, sitede başka bir testin bilim kartında da var.
    expect(readFileSync(new URL('../src/content/instruments/simge-bulma.ts', import.meta.url), 'utf8')).toContain('Scharfen, J., Peters, J. M. ve Holling, H. (2018).');
  });
});
