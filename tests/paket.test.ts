import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { PACKAGE_AREAS, PACKAGE_MIN_GRADE, PACKAGE_SLOTS, packageGrades, packageMinutes, packageTests } from '@/content/paket';
import { evaluateReports } from '@/lib/assessment/evaluate';
import { packagePdfResponse } from '@/lib/assessment/http';
import { payloadFor } from '@/lib/assessment/payload';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { resetMemoryRateLimit } from '@/lib/memory-rate-limit';
import { packageSummary, type PackageEntry } from '@/lib/reports/package';
import type { SimpleReport } from '@/lib/reports/simple';
import { renderPackageReportPdf } from '@/lib/pdf/simple-report';
import { SHARE_W, packageShareCard } from '@/lib/share/card';
import { drawShareCard } from '@/lib/share/draw';
import { fakeContext } from './helpers/fake-canvas';
import { foldingBody, likertBody, matrixBody, patternBody, rotationBody, vocabularyBody } from './helpers/bodies';

/**
 * Kendini Tanı Paketi (site sahibinin 2026-10-30 isteği): sınıfa göre test seçimi, özet (yalnızca testlerin kendi raporundaki
 * başlıklar ve düzeyler; yeni yorum yok), tek PDF ve PDF ucunun denetimleri, paylaşım kartı.
 */

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '198.51.100.23' }),
}));

const SITE = 'http://localhost:3000';

/** Paketteki her test için örnek cevaplar (birim testlerindeki yardımcılarla). */
function bodyFor(slug: string, grade: number): AnswersBody {
  const g = grade === ADULT_GRADE ? 9 : grade;
  const body = (() => {
    switch (slug) {
      case 'sekil-akil-yurutme':
        return matrixBody(undefined, g);
      case 'kelime-bilgisi':
        return vocabularyBody(undefined, g);
      case 'zihinde-dondurme':
        return rotationBody(undefined, g);
      case 'kagit-katlama':
        return foldingBody(undefined, g);
      case 'desen-hatirlama':
        return patternBody(undefined, g);
      default:
        return likertBody(slug, g, (i) => (i * 3 + 1) % 5);
    }
  })();
  return { ...body, grade };
}

function entriesFor(grade: number, audience: 'student' | 'parent' | 'adult'): PackageEntry[] {
  return packageTests(grade).map(({ slot, def }) => {
    const reports: Partial<Record<'student' | 'parent' | 'adult', SimpleReport>> = evaluateReports(def.slug, bodyFor(def.slug, grade));
    return { slug: def.slug, skill: slot.skill, areaName: PACKAGE_AREAS.find((a) => a.key === slot.area)!.name, report: reports[audience]! };
  });
}

describe('Kendini Tanı Paketi: testler', () => {
  it('paket 5. sınıftan mezuna ve yetişkinlere açık; daha küçük sınıflarda yok', () => {
    expect(packageGrades()).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, ADULT_GRADE]);
    for (let g = 1; g < PACKAGE_MIN_GRADE; g++) expect(packageTests(g)).toEqual([]);
  });

  it('her sınıfta testler yayında, sınıfa uygun, birer kez; anket ya da görev testi; dört zihinsel beceri hep var', () => {
    const live = new Set(publicInstruments().map((d) => d.slug));
    for (const g of packageGrades()) {
      const tests = packageTests(g);
      const slugs = tests.map((t) => t.def.slug);
      expect(new Set(slugs).size, String(g)).toBe(slugs.length);
      for (const t of tests) {
        expect(live.has(t.def.slug), t.def.slug).toBe(true);
        expect(gradeAllowed(t.def, g), `${t.def.slug} ${g}`).toBe(true);
        expect(['likert', 'tasks'], t.def.slug).toContain(t.def.engine);
      }
      expect(tests.filter((t) => t.slot.area === 'zihinsel').length, String(g)).toBe(4);
      expect(tests[0].slot.key, String(g)).toBe('kisilik');
      // Site sahibinin seçimi geniş paket: yaklaşık bir saat.
      const m = packageMinutes(tests);
      expect(m, String(g)).toBeGreaterThanOrEqual(45);
      expect(m, String(g)).toBeLessThanOrEqual(75);
    }
  });

  it('sınıfa göre seçilen testler', () => {
    const at = (g: number) => packageTests(g).map((t) => t.def.slug);
    const mind = ['sekil-akil-yurutme', 'kelime-bilgisi', 'zihinde-dondurme', 'desen-hatirlama'];
    expect(at(5)).toEqual(['cocuk-kisilik-profili', 'ders-calisma-motivasyonu', ...mind]);
    expect(at(6)).toEqual(['bes-faktor-kisilik', 'calisma-aliskanliklari', ...mind]);
    expect(at(7)).toEqual(['bes-faktor-kisilik', 'hobi-ve-serbest-zaman-ilgileri', 'calisma-aliskanliklari', ...mind]);
    expect(at(8)).toEqual(['bes-faktor-kisilik', 'mesleki-ilgi-profili', 'calisma-aliskanliklari', ...mind]);
    for (const g of [9, 10, 11, 12, 13]) expect(at(g)).toEqual(['bes-faktor-kisilik', 'meslek-ilgi-alanlari', 'calisma-aliskanliklari', ...mind]);
    expect(at(ADULT_GRADE)).toEqual([
      'ayrintili-kisilik-profili',
      'meslek-ilgi-alanlari',
      'erteleme-ve-zaman-yonetimi',
      'sekil-akil-yurutme',
      'kelime-bilgisi',
      'kagit-katlama',
      'desen-hatirlama',
    ]);
    // Her yuvanın adayları gerçekten var olan testler.
    const all = new Set(publicInstruments().map((d) => d.slug));
    for (const s of PACKAGE_SLOTS) for (const c of s.candidates) expect(all.has(c), c).toBe(true);
  });

  it('pakette testin yönergesine "tek seferde bitir" notu eklenmez (paketin kendi notu var); tek testte eklenir', () => {
    const def = packageTests(9)[0].def;
    expect(payloadFor(def, 9, { sessionNote: false }).intro.paragraphs).toEqual(def.intro.paragraphs);
    expect(payloadFor(def, 9).intro.paragraphs.length).toBe(def.intro.paragraphs.length + 1);
  });
});

describe('Kendini Tanı Paketi: özet, PDF ve paylaşım kartı', () => {
  it('özetteki her satır testin kendi raporunda aynen yazar (yeni yorum yok)', () => {
    for (const [g, audiences] of [
      [5, ['student', 'parent']],
      [9, ['student', 'parent']],
      [ADULT_GRADE, ['adult']],
    ] as const) {
      for (const a of audiences) {
        const entries = entriesFor(g, a);
        const summary = packageSummary(entries);
        expect(summary.map((s) => s.slug)).toEqual(entries.map((e) => e.slug));
        for (const [i, s] of summary.entries()) {
          const r = entries[i].report;
          expect(s.lines.length, s.slug).toBeGreaterThan(0);
          const own = [
            ...r.items.map((it) => `${it.title}|${it.badge}`),
            ...(r.groups ?? []).map((gr) => `${gr.title}|${gr.badge}`),
            ...r.keyFigures.map((k) => `${k.label}|${k.value}`),
          ];
          for (const l of s.lines) expect(own, `${s.slug}: ${l.label}`).toContain(`${l.label}|${l.value}`);
          expect(s.cautions).toBe(r.cautions.length);
          expect(s.name).toBe(r.instrumentName);
        }
      }
    }
  });

  it('paylaşım kartı yalnızca kişilik ve ilgiyi gösterir; zihinsel beceri ve çalışma alışkanlıkları karta girmez', () => {
    const card = packageShareCard(
      entriesFor(9, 'student').map((e) => ({ slug: e.slug, report: e.report })),
      '/kendini-tani-paketi',
    )!;
    expect(card.blocks.map((b) => b.title)).toEqual(['Kişiliğim', 'En çok ilgi duyduğum alanlar']);
    const second = card.blocks[1];
    expect(second.kind === 'rows' && second.rows.length).toBe(3);
    expect(card.path).toBe('/kendini-tani-paketi');
    // 5. sınıfta ilgi testi yok: yalnızca kişilik.
    const young = packageShareCard(entriesFor(5, 'student').map((e) => ({ slug: e.slug, report: e.report })), '/kendini-tani-paketi')!;
    expect(young.blocks.map((b) => b.title)).toEqual(['Kişiliğim']);
    // 8. sınıfta Holland profili: raporun öne çıkardığı alanlar satırlarla (altıgen iki bloklu kartta küçük kalır).
    const eighthEntries = entriesFor(8, 'student');
    const eighth = packageShareCard(eighthEntries.map((e) => ({ slug: e.slug, report: e.report })), '/kendini-tani-paketi')!;
    const holland = eighthEntries.find((e) => e.slug === 'mesleki-ilgi-profili')!.report;
    const hx = holland.chart?.type === 'hexagon' ? holland.chart : null;
    if (hx && hx.highlight.length > 0) {
      const b = eighth.blocks[1];
      expect(b.kind).toBe('rows');
      if (b.kind === 'rows') {
        const names = new Set(hx.axes.filter((a) => hx.highlight.includes(a.key)).map((a) => a.label));
        for (const r of b.rows) expect(names.has(r.label), r.label).toBe(true);
      }
    }
    // Her sınıfın paket kartı çizilir; yazılar görselden taşmaz ve satır başına en az 100 piksel düşer (kısaltma olmaz).
    for (const g of packageGrades()) {
      const own = g === ADULT_GRADE ? 'adult' : 'student';
      const c = packageShareCard(entriesFor(g, own).map((e) => ({ slug: e.slug, report: e.report })), '/kendini-tani-paketi')!;
      expect(c.headline).toBeNull();
      const { ctx, texts } = fakeContext();
      drawShareCard(ctx, c, 'olcekhane.com');
      for (const t of texts) {
        expect(t.left, `${g} ${t.text}`).toBeGreaterThanOrEqual(0);
        expect(t.right, `${g} ${t.text}`).toBeLessThanOrEqual(SHARE_W);
        expect(t.text.endsWith('…'), `${g} ${t.text}`).toBe(false);
      }
    }
    // Veli raporlarından kart çıkmaz.
    expect(packageShareCard(entriesFor(9, 'parent').map((e) => ({ slug: e.slug, report: e.report })), '/kendini-tani-paketi')).toBeNull();
  });

  it('tek PDF: özet sayfası ve bütün raporlar', async () => {
    const entries = entriesFor(ADULT_GRADE, 'adult');
    const pdf = await renderPackageReportPdf({ entries, skipped: [], gradeLabel: 'Yetişkin', completedAt: new Date() }, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    // Her rapor en az bir sayfa; yol haritaları ayrı sayfa.
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pages).toBeGreaterThan(entries.length);
  }, 120_000);
});

describe('Kendini Tanı Paketi: PDF ucu', () => {
  beforeEach(() => resetMemoryRateLimit());
  afterEach(() => vi.restoreAllMocks());

  const req = (body: unknown) =>
    new NextRequest(`${SITE}/api/paket/pdf`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: SITE, host: 'localhost:3000' },
      body: JSON.stringify(body),
    });
  const testsOf = (g: number) => packageTests(g).map((t) => ({ slug: t.def.slug, data: bodyFor(t.def.slug, g).data }));

  it('geçerli istek PDF döner; gövde sınırın altında', async () => {
    const tests = testsOf(9);
    const body = { grade: 9, audience: 'parent', tests: tests.slice(0, 2), skipped: tests.slice(2).map((t) => t.slug) };
    const res = await packagePdfResponse(req(body));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/pdf');
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('content-disposition')).toContain('olcekhane-kendini-tani-paketi-veli-raporu.pdf');
    // Bütün paketin cevapları 2 MB'lık sınırın çok altında.
    expect(JSON.stringify({ grade: 9, audience: 'student', tests }).length).toBeLessThan(600 * 1024);
  }, 120_000);

  it('pakette olmayan, iki kez gönderilen ya da sınıfa uymayan test reddedilir; yetişkin ve okul raporu karışmaz', async () => {
    const tests = testsOf(9);
    const bad = [
      { grade: 9, audience: 'student', tests: [{ slug: 'oz-saygi', data: likertBody('oz-saygi', 9, (i) => i % 4).data }] },
      { grade: 9, audience: 'student', tests: [tests[0], tests[0]] },
      { grade: 9, audience: 'adult', tests: tests.slice(0, 1) },
      { grade: ADULT_GRADE, audience: 'student', tests: testsOf(ADULT_GRADE).slice(0, 1) },
      { grade: 4, audience: 'student', tests: tests.slice(0, 1) },
      { grade: 9, audience: 'student', tests: tests.slice(0, 1), skipped: [tests[0].slug] },
      { grade: 9, audience: 'student', tests: [] },
    ];
    for (const b of bad) expect((await packagePdfResponse(req(b))).status, JSON.stringify(b).slice(0, 120)).toBe(400);
  }, 60_000);
});
