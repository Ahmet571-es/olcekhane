import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { bandZones, compareGeometry, gaugeGeometry, textWidth, visualDescription, type ItemVisual, type LabelSpot } from '@/lib/reports/visuals';

/**
 * Rapor kartlarının grafikleri (site sahibinin 2026-10-22 isteği: her başlık sözel açıklamanın yanında grafikle de
 * anlatılır). Anket testlerinin bütün kartlarında: ölçek kartında düzey çubuğu, birlikte yorumda ve listelerde yan yana
 * grafik; grafik kartın rozetindeki düzeyle ve genel bakıştaki puanla aynıdır; yazılar ekranda ve PDF'te taşmaz, üst üste
 * binmez.
 */

const LIKERT = INSTRUMENTS.filter((d) => d.engine === 'likert') as LikertInstrument[];
/** Grafiği olmayan kartlar: bir puana dayanmayan genel bilgi ve öneri kartları. */
const NO_VISUAL = ['Bilmekte yarar var', 'Bu sonucu nasıl kullanabilirsin?', 'Bu sonuç nasıl kullanılabilir?'];
/** Ekrandaki ve PDF'teki çizim boyutları (components/report/item-visual.tsx, lib/pdf/simple-report.tsx). */
const SIZES = [
  { width: 240, font: 10 },
  { width: 176, font: 7 },
];

/** Bir testin cevap örüntüleri: hep en düşük, hep orta, hep en yüksek, ölçeklere göre yüksek ve düşük, karışık. */
function patterns(d: LikertInstrument) {
  const vals = d.options.map((o) => o.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const mid = vals[Math.floor(vals.length / 2)];
  const all = (v: number) => Object.fromEntries(d.items.map((it) => [it.key, { value: v, rtMs: 2600 }]));
  const keyed = (high: (i: number) => boolean) =>
    Object.fromEntries(
      d.items.map((it) => {
        const si = d.scales.findIndex((s) => s.key === it.scale);
        const up = high(si);
        return [it.key, { value: up !== !!it.reverse ? hi : lo, rtMs: 2600 }];
      }),
    );
  const mixed = (k: number) => Object.fromEntries(d.items.map((it, i) => [it.key, { value: vals[(i * k + 3) % vals.length], rtMs: 2600 }]));
  return [all(lo), all(mid), all(hi), keyed(() => true), keyed(() => false), keyed((i) => i % 2 === 0), mixed(3), mixed(7), mixed(11)];
}

function reportsOf(d: LikertInstrument, answers: Record<string, { value: number; rtMs: number }>): SimpleReport[] {
  const body = { grade: d.minGrade, data: { engine: 'likert' as const, answers } };
  const r = evaluate(d.slug, body);
  return [r.student, r.parent, ...(d.adults ? [evaluateAdult(d.slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
}

/** Aynı satırdaki yazılar üst üste binmez ve grafiğin dışına taşmaz. */
function checkLabels(labels: LabelSpot[], width: number, font: number, label: string) {
  const box = (l: LabelSpot) => {
    const w = textWidth(l.text, font);
    const left = l.anchor === 'start' ? l.x : l.anchor === 'end' ? l.x - w : l.x - w / 2;
    return { left, right: left + w, row: l.row };
  };
  const boxes = labels.map(box);
  for (const b of boxes) {
    expect(b.left, label).toBeGreaterThanOrEqual(-0.01);
    expect(b.right, label).toBeLessThanOrEqual(width + 0.01);
  }
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      if (boxes[i].row === boxes[j].row) expect(boxes[i].right <= boxes[j].left || boxes[j].right <= boxes[i].left, `${label}: ${labels[i].text} / ${labels[j].text}`).toBe(true);
}

function checkGeometry(v: ItemVisual, label: string) {
  for (const { width, font } of SIZES) {
    if (v.type === 'gauge') {
      const g = gaugeGeometry(v, width, font);
      checkLabels(g.labels, width, font, label);
      if (g.marker) {
        const w = textWidth(g.marker.text, font);
        const left = g.marker.anchor === 'start' ? g.marker.x : g.marker.anchor === 'end' ? g.marker.x - w : g.marker.x - w / 2;
        expect(left, label).toBeGreaterThanOrEqual(-0.01);
        expect(left + w, label).toBeLessThanOrEqual(width + 0.01);
      }
      expect(g.zones.reduce((n, z) => n + z.w, 0), label).toBeCloseTo(width - 4, 5);
    } else {
      const g = compareGeometry(v, width, font);
      checkLabels(g.labels, width, font * 0.92, label);
      for (const row of g.rows) {
        // Ad ve puan aynı satıra sığar; ad gerekirse küçülür ama okunaklı kalır.
        expect(textWidth(row.label, row.labelSize) + textWidth(row.valueText, font) + font * 0.99, `${label}: ${row.label}`).toBeLessThanOrEqual(width);
        expect(row.labelSize, `${label}: ${row.label}`).toBeGreaterThanOrEqual(font * 0.75);
      }
    }
  }
}

describe('Anket testlerinin kart grafikleri', () => {
  it('24 anket testinin hepsi kapsanır', () => {
    expect(LIKERT.length).toBeGreaterThanOrEqual(24);
  });

  it('düzey bölgeleri: ölçeğin bütün aralığını boşluksuz kaplar, adları şablondaki düzey adlarıdır', () => {
    for (const d of LIKERT) {
      const t = REPORT_TEMPLATES[d.slug];
      const vals = d.options.map((o) => o.value);
      for (const sc of d.scales) {
        const n = d.items.filter((it) => it.scale === sc.key || sc.of?.includes(it.scale)).length;
        const isMean = d.scoring.method === 'mean';
        const min = isMean ? Math.min(...vals) : Math.min(...vals) * n;
        const max = isMean ? Math.max(...vals) : Math.max(...vals) * n;
        const zones = bandZones(d.anchoredBands, t, sc.key, min, max);
        const label = `${d.slug}/${sc.key}`;
        expect(zones.length, label).toBeGreaterThanOrEqual(2);
        expect(zones.length, label).toBeLessThanOrEqual(5);
        expect(zones[0].from, label).toBe(min);
        expect(zones[zones.length - 1].to, label).toBe(max);
        for (let i = 1; i < zones.length; i++) {
          expect(zones[i].from, label).toBe(zones[i - 1].to);
          expect(zones[i].band, label).not.toBe(zones[i - 1].band);
        }
        for (const z of zones) expect(z.label, label).toBeTruthy();
      }
    }
  });

  it('her kartta grafik var; grafik rozetteki düzeyle ve genel bakıştaki puanla aynı; yazılar taşmaz (öğrenci, veli, yetişkin)', () => {
    let gauges = 0;
    let compares = 0;
    for (const d of LIKERT) {
      for (const answers of patterns(d)) {
        for (const rep of reportsOf(d, answers)) {
          const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
          const all = [...rep.items, ...(rep.groups ?? [])];
          for (const it of all) {
            const label = `${d.slug} ${rep.audience} ${it.title}`;
            if (NO_VISUAL.includes(it.title)) continue;
            expect(it.visual, label).toBeDefined();
            const v = it.visual!;
            checkGeometry(v, label);
            expect(visualDescription(v), label).not.toMatch(/undefined|NaN/);
            if (v.type === 'gauge') {
              gauges++;
              if (v.value !== null && v.active !== null) {
                const zone = v.zones[v.active];
                expect(v.value, label).toBeGreaterThanOrEqual(zone.from - 0.06);
                expect(v.value, label).toBeLessThanOrEqual(zone.to + 0.06);
                // Kartın rozeti kişinin bölgesinin adıyla başlar.
                if ('badge' in it && it.badge) expect(it.badge.startsWith(zone.label), `${label}: ${it.badge} / ${zone.label}`).toBe(true);
              }
              const row = rows.find((r) => r.label === v.label);
              if (row) {
                expect(v.value, label).toBe(row.value);
                expect(v.valueLabel, label).toBe(row.valueLabel);
              }
            } else {
              compares++;
              expect(v.rows.length, label).toBeGreaterThanOrEqual(2);
              for (const r of v.rows) {
                const row = rows.find((x) => x.label === r.label);
                if (row) {
                  expect(r.value, `${label}: ${r.label}`).toBe(row.value);
                  if (r.active !== null) expect(row.band.startsWith(v.zones[r.active].label) || v.zones[r.active].label.startsWith(row.band), `${label}: ${r.label}`).toBe(true);
                }
              }
            }
          }
        }
      }
    }
    expect(gauges).toBeGreaterThan(1000);
    expect(compares).toBeGreaterThan(100);
  }, 240_000);

  it('PDF her anket testinde grafiklerle üretilir', async () => {
    for (const d of LIKERT) {
      const [student] = reportsOf(d, patterns(d)[7]);
      const pdf = await renderSimpleReportPdf(student, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString(), d.slug).toBe('%PDF-');
    }
  }, 240_000);
});
