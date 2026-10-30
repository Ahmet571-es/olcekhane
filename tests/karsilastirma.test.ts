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
import { rowText } from '@/components/test/compare-panel';
import { likertBody } from './helpers/bodies';
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

  it('anket dışındaki testlerde karşılaştırma bilgisi yok', () => {
    const others = publicInstruments().filter((d) => d.engine !== 'likert');
    expect(others.length).toBeGreaterThan(10);
    // Görev, okuma ve konu tarama testlerinin raporu kendi testlerinde ayrıntılı denenir; burada yalnızca alan kontrolü.
    const src = readFileSync(new URL('../src/lib/assessment/evaluate.ts', import.meta.url), 'utf8');
    expect(src).toContain("if (def.engine !== 'likert') return undefined;");
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
