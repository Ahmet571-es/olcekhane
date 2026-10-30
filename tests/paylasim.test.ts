import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments } from '@/content/instruments';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import { NOT_SHAREABLE, SHARE_H, SHARE_W, SHAREABLE, shareCardFor, shareText, type ShareCard } from '@/lib/share/card';
import { drawShareCard } from '@/lib/share/draw';
import { fakeContext } from './helpers/fake-canvas';

/**
 * Paylaşım kartı (site sahibinin 2026-10-30 isteği): yalnızca kişilik ve ilgi testlerinde; veli raporundan kart çıkmaz;
 * kartta ad yazmaz; bütün cevap örüntülerinde kart çizilir ve yazılar görselin dışına taşmaz.
 */

const LIKERT = INSTRUMENTS.filter((d) => d.engine === 'likert') as LikertInstrument[];

function patterns(d: LikertInstrument) {
  const vals = d.options.map((o) => o.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const all = (v: number) => Object.fromEntries(d.items.map((it) => [it.key, { value: v, rtMs: 2600 }]));
  const keyed = (high: (i: number) => boolean) =>
    Object.fromEntries(
      d.items.map((it) => {
        const si = d.scales.findIndex((s) => s.key === it.scale);
        return [it.key, { value: high(si) !== !!it.reverse ? hi : lo, rtMs: 2600 }];
      }),
    );
  const mixed = (k: number) => Object.fromEntries(d.items.map((it, i) => [it.key, { value: vals[(i * k + 3) % vals.length], rtMs: 2600 }]));
  return [all(lo), all(hi), keyed(() => true), keyed((i) => i % 2 === 0), mixed(3), mixed(7)];
}

function reportsOf(d: LikertInstrument, answers: Record<string, { value: number; rtMs: number }>): SimpleReport[] {
  const body = { grade: d.minGrade, data: { engine: 'likert' as const, answers } };
  const r = evaluate(d.slug, body);
  return [r.student, r.parent, ...(d.adults ? [evaluateAdult(d.slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
}

function checkDrawing(card: ShareCard) {
  const { ctx, texts } = fakeContext();
  drawShareCard(ctx, card, 'olcekhane.com');
  for (const t of texts) {
    expect(t.left, t.text).toBeGreaterThanOrEqual(0);
    expect(t.right, t.text).toBeLessThanOrEqual(SHARE_W);
  }
  // Testin adresi görselde tam yazar (kısaltılmaz).
  expect(texts.some((t) => t.text === `olcekhane.com${card.path}`)).toBe(true);
}

describe('paylaşım kartı', () => {
  it('kart yalnızca yayındaki kişilik ve ilgi anket testlerinde', () => {
    const live = new Map(publicInstruments().map((d) => [d.slug, d]));
    for (const slug of Object.keys(SHAREABLE)) {
      const d = live.get(slug);
      expect(d, slug).toBeDefined();
      expect(d!.engine, slug).toBe('likert');
      expect(['personality', 'career'], slug).toContain(d!.domain);
    }
    // Her kişilik, ilgi ve beceri anket testi için karar verilmiştir: ya kartı vardır ya kartsız olmasının nedeni yazılıdır.
    for (const d of LIKERT.filter((x) => ['personality', 'career', 'skills'].includes(x.domain))) {
      expect(Object.hasOwn(SHAREABLE, d.slug) !== Object.hasOwn(NOT_SHAREABLE, d.slug), d.slug).toBe(true);
    }
  });

  it('öteki testlerde kart yok', () => {
    for (const d of LIKERT.filter((x) => !Object.hasOwn(SHAREABLE, x.slug))) {
      for (const r of reportsOf(d, patterns(d)[2])) expect(shareCardFor(d.slug, r), d.slug).toBeNull();
    }
  });

  it('bütün cevap örüntülerinde kart kurulur, veli raporundan kart çıkmaz, yazılar taşmaz', () => {
    for (const d of LIKERT.filter((x) => Object.hasOwn(SHAREABLE, x.slug))) {
      for (const answers of patterns(d)) {
        for (const r of reportsOf(d, answers)) {
          const card = shareCardFor(d.slug, r);
          if (r.audience === 'parent') {
            expect(card, d.slug).toBeNull();
            continue;
          }
          expect(card, `${d.slug} ${r.audience}`).not.toBeNull();
          expect(card!.title).toBe(d.name);
          expect(card!.path).toBe(`/testler/${d.slug}`);
          expect(card!.pilot).toBe(d.status === 'pilot');
          expect(card!.blocks.length).toBeGreaterThan(0);
          for (const b of card!.blocks) {
            if (b.kind === 'rows') {
              expect(b.rows.length).toBeGreaterThan(0);
              expect(b.rows.length).toBeLessThanOrEqual(16);
              for (const row of b.rows) {
                expect(row.label.length).toBeGreaterThan(0);
                expect(row.band.length).toBeGreaterThan(0);
                expect(row.value).toBeGreaterThanOrEqual(row.min);
                expect(row.value).toBeLessThanOrEqual(row.max);
                expect(row.note ?? '').not.toContain('eşit puan');
              }
            } else {
              expect(b.axes.length).toBeGreaterThanOrEqual(6);
              expect(b.axes.some((a) => a.value !== null)).toBe(true);
            }
          }
          // Kartta ad yok: raporun ad alanı (boş da olsa) karta geçmez.
          expect(JSON.stringify(card)).not.toContain('studentName');
          checkDrawing(card!);
        }
      }
    }
  });

  it('en yüksek alan kartı beş alanla sınırlı ve büyükten küçüğe', () => {
    const d = LIKERT.find((x) => x.slug === 'hobi-ve-serbest-zaman-ilgileri')!;
    const r = reportsOf(d, patterns(d)[4])[0];
    const card = shareCardFor(d.slug, r)!;
    const b = card.blocks[0];
    expect(b.kind).toBe('rows');
    if (b.kind !== 'rows') return;
    expect(b.rows.length).toBe(5);
    for (let i = 1; i < b.rows.length; i++) expect(b.rows[i - 1].value).toBeGreaterThanOrEqual(b.rows[i].value);
  });

  it('Holland profilinde ilgi kodu büyük yazılır', () => {
    const d = LIKERT.find((x) => x.slug === 'mesleki-ilgi-profili')!;
    const r = reportsOf(d, patterns(d)[2])[0];
    const card = shareCardFor(d.slug, r)!;
    const code = r.keyFigures.find((k) => k.label === 'İlgi kodu');
    expect(card.headline).toEqual(code ? { label: 'İlgi kodum', value: code.value } : null);
  });

  it('paylaşım metni testin tam adresini verir', () => {
    const d = LIKERT.find((x) => x.slug === 'bes-faktor-kisilik')!;
    const card = shareCardFor(d.slug, reportsOf(d, patterns(d)[3])[0])!;
    expect(shareText(card, 'https://olcekhane.com/')).toContain('https://olcekhane.com/testler/bes-faktor-kisilik');
    expect(SHARE_H / SHARE_W).toBeCloseTo(16 / 9, 5);
  });
});
