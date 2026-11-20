import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TestEmblem } from '@/components/site/test-emblem';
import { publicInstruments } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { DOMAIN_COLOR } from '@/lib/domain-style';
import type { LikertInstrument } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import type { SimpleReport } from '@/lib/reports/simple';
import { oralPassagesFor, type OralInput } from '@/lib/scoring/oral';
import { SUMMARY_MAX_CARDS, SUMMARY_W, reportSummary, summaryText, type ReportSummary } from '@/lib/share/summary';
import { drawSummary, summaryHeight } from '@/lib/share/summary-draw';
import { DOMAIN_HEX, EMBLEM_H, EMBLEM_W, domainHex, standaloneEmblem } from '@/lib/share/summary-emblem';
import { likertBody, readingBody } from './helpers/bodies';
import { fakeContext } from './helpers/fake-canvas';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * Özet görsel (site sahibinin 2026-11-20 isteği): her raporun yanında, raporu tek sayfada özetleyen görsel. Bütün testlerde
 * ve bütün rapor türlerinde vardır. Görsel rapora yeni yorum eklemez: üstündeki her yazı raporun kendisinde yazar; maddeler,
 * cevaplar ve destek kutusu görsele girmez. Bütün sonuç örüntülerinde çizilir, yazılar görselin dışına taşmaz; ad yalnızca
 * yazıldıysa görseldedir.
 */

const root = path.resolve(import.meta.dirname, '..');
const reportsOf = (slug: string, body: Parameters<typeof evaluateReports>[1]) => Object.values(evaluateReports(slug, body)) as SimpleReport[];
const LIKERT = publicInstruments().filter((d) => d.engine === 'likert') as LikertInstrument[];

/** Anket testlerinde cevap örüntüleri: karışık, hep en düşük, hep en yüksek, ölçeklere göre ayrışan. */
function likertReports(d: LikertInstrument): SimpleReport[] {
  const vals = d.options.map((o) => o.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const picks: ((i: number) => number)[] = [(i) => vals[(i * 3 + 1) % vals.length], () => lo, () => hi, (i) => (i % 4 < 2 ? hi : lo)];
  const out: SimpleReport[] = [];
  for (const pick of picks) {
    out.push(...reportsOf(d.slug, likertBody(d.slug, d.minGrade, pick)));
    if (d.adults) out.push(...reportsOf(d.slug, likertBody(d.slug, ADULT_GRADE, pick)));
  }
  return out;
}

function oralReports(): SimpleReport[] {
  const p = oralPassagesFor(sesliOkuma, 3)[0];
  const input: OralInput = {
    passageKey: p.key,
    recordMs: 70_000,
    readingMs: Math.round((oralWordCount(p.paragraphs) / 70) * 60_000),
    timingAuto: true,
    audio: { quality: 'good', pauses: [[1000, 1400]], speechMs: 40_000, contour: Array.from({ length: 60 }, (_, i) => (i * 7) % 100), interrupted: false },
    marks: {},
    listened: 1,
    retell: { recorded: true, ideas: p.ideas.slice(0, 2).map((x) => x.key) },
    answers: Object.fromEntries(p.questions.map((q) => [q.key, q.answer])),
    prosody: { expression: 3, phrasing: 2, smoothness: 4, pace: 3 },
  };
  const reps = evaluate(sesliOkuma.slug, { grade: 3, data: { engine: 'oral', ...input } });
  return [reps.student, reps.parent] as SimpleReport[];
}

/** Bir değerin içindeki bütün yazılar. */
function strings(v: unknown, out = new Set<string>()): Set<string> {
  if (typeof v === 'string') out.add(v);
  else if (Array.isArray(v)) for (const x of v) strings(x, out);
  else if (v && typeof v === 'object') for (const x of Object.values(v)) strings(x, out);
  return out;
}

const bare = (t: string) => t.replace(/^\d+\.\s*/, '');

/** Özetin her yazısı raporda yazar ve raporun aynı yerinden gelir. */
function checkSummary(slug: string, r: SimpleReport, label: string): ReportSummary {
  const s = reportSummary(slug, r);
  const known = strings(r);
  const inReport = (t: string, what: string) => expect(known.has(t), `${label}: ${what} raporda yok: ${t}`).toBe(true);

  expect(s.title, label).toBe(r.instrumentName);
  expect(s.gradeLabel, label).toBe(r.gradeLabel);
  expect(s.pilot, label).toBe(r.isPilot);
  expect(s.path, label).toBe(`/testler/${slug}`);
  expect(s.disclaimer, label).toBe(r.disclaimer.title);
  expect(s.tiles, label).toEqual(r.keyFigures.slice(0, 4).map((k) => ({ label: k.label, value: k.value, note: k.note ?? null })));

  if (r.cautions.length === 0) expect(s.caution, label).toBeNull();
  else {
    expect(s.caution!.text, label).toBe(r.cautions[0]);
    expect(s.caution!.more, label).toBe(r.cautions.length - 1);
    expect(s.caution!.title, label).toBe(r.audience === 'parent' ? 'Bu sonucu dikkatle yorumlayın' : 'Sonucunu okurken dikkat');
  }

  const badges = [...r.items, ...(r.groups ?? [])].map((it) => it.badge ?? '');
  if (s.chart) {
    expect(s.chart.title, label).toBe(r.chartTitle);
    const c = s.chart.chart;
    if (c.kind === 'rows') {
      expect(r.chart!.type, label).toBe('rulers');
      const rows = (r.chart as Extract<NonNullable<SimpleReport['chart']>, { type: 'rulers' }>).rows;
      expect(c.rows.map((x) => [x.label, x.band]), label).toEqual(rows.map((x) => [x.label, x.band]));
      c.rows.forEach((row, i) => {
        // Puanın yeri cetvelin içindedir; hesaplanamayan ölçekte işaret yoktur.
        if (rows[i].value === null) expect(row.t, label).toBeNull();
        else {
          expect(row.t, label).toBeGreaterThanOrEqual(0);
          expect(row.t, label).toBeLessThanOrEqual(1);
        }
        // Betimleme, o ölçeğin kartındaki rozetin parçasıdır.
        if (row.note) expect(badges.some((b) => b.endsWith(row.note!) || b.includes(`${row.note} ·`)), `${label}: ${row.note}`).toBe(true);
      });
    } else if (c.kind === 'radar') {
      for (const a of c.axes) inReport(a.label, 'eksen');
    } else if (c.kind === 'bars') {
      for (const row of c.rows) {
        inReport(row.label, 'çubuk');
        inReport(row.valueLabel, 'çubuk değeri');
      }
    } else if (c.kind === 'columns') inReport(c.caption, 'sütun açıklaması');
  } else if (r.chart) {
    // Grafik yalnızca satırı ya da ekseni yoksa atlanır.
    expect(r.chart.type === 'quadrant' ? 1 : ('rows' in r.chart ? r.chart.rows : r.chart.axes).length, label).toBe(0);
  }

  if (s.cards) {
    expect(s.cards.title, label).toBe(r.itemsTitle);
    expect(s.cards.items.length, label).toBeLessThanOrEqual(SUMMARY_MAX_CARDS);
    expect(s.cards.more, label).toBeGreaterThanOrEqual(0);
    for (const c of s.cards.items) {
      const src = [...r.items, ...(r.groups ?? [])].find((it) => it.title === c.title);
      expect(src, `${label}: kart ${c.title}`).toBeDefined();
      expect(c.badge, label).toBe(src!.badge || null);
      // Yorumlanmayan kartın grafiği yoktur (rapordaki gibi).
      if ('interpreted' in src! && src.interpreted === false) expect(c.visual, label).toBeNull();
      else expect(c.visual, label).toBe(src!.visual ?? null);
    }
  }

  const rm = r.roadmap;
  if (s.points) {
    expect(rm, label).toBeDefined();
    for (const p of s.points.items) expect(rm!.standout.some((x) => x.title === p.title && x.text === p.text), `${label}: kısaca ${p.title}`).toBe(true);
    if (s.points.items.length === 0) expect(s.points.note, label).toBe(rm!.standoutNote);
    else expect(s.points.note, label).toBeNull();
  }
  if (s.tips) {
    expect(s.tips.title, label).toBe(rm!.study.title);
    const titles = rm!.study.items.map((x) => x.title);
    expect(s.tips.items, label).toEqual(titles.slice(0, s.tips.items.length));
    // Öneri başlıkları ölçek adı değildir (ölçek adı önerinin metni olmadan bir şey anlatmaz).
    for (const t of s.tips.items) expect(r.items.some((it) => bare(it.title) === t), `${label}: ${t}`).toBe(false);
  }
  if (rm && rm.weeks.length > 0) {
    expect(s.steps!.items, label).toEqual(rm.weeks.map((w) => ({ label: w.label, title: w.title, fromResult: w.fromResult })));
    inReport(s.steps!.legend.result, 'lejant');
    inReport(s.steps!.legend.general, 'lejant');
  } else expect(s.steps, label).toBeNull();

  // Destek kutusu (hassas) özete girmez.
  const mine = strings(s);
  if (r.support) for (const line of [r.support.title, ...r.support.lines]) expect(mine.has(line), `${label}: destek kutusu özette`).toBe(false);
  return s;
}

/** Görsel çizilir: ölçülen yükseklik çizimle aynıdır, ölçüm geçişi bir şey çizmez, yazılar görselin içinde kalır. */
function checkDrawing(s: ReportSummary, label: string, name = '') {
  const { ctx, texts } = fakeContext();
  const o = { host: 'olcekhane.com', name };
  const h = summaryHeight(ctx, s, o);
  expect(texts.length, `${label}: ölçüm geçişi yazı çizdi`).toBe(0);
  expect(h, label).toBeGreaterThan(1000);
  expect(h, label).toBeLessThan(6500);
  expect(drawSummary(ctx, s, { ...o, height: h }), label).toBe(h);
  for (const t of texts) {
    expect(t.left, `${label}: ${t.text}`).toBeGreaterThanOrEqual(0);
    expect(t.right, `${label}: ${t.text}`).toBeLessThanOrEqual(SUMMARY_W);
    expect(t.y, `${label}: ${t.text}`).toBeGreaterThan(0);
    expect(t.y, `${label}: ${t.text}`).toBeLessThan(h);
    // En küçük yazı (kart grafiklerinin eksen sayıları) da okunur boyda kalır.
    expect(t.size, `${label}: ${t.text}`).toBeGreaterThanOrEqual(13);
  }
  const drawn = texts.map((t) => t.text);
  // Testin adresi görselde tam yazar (kısaltılmaz); başlık ve rapor bilgileri yerindedir.
  expect(drawn, label).toContain(`olcekhane.com${s.path}`);
  expect(drawn, label).toContain('RAPOR ÖZETİ');
  expect(drawn, label).toContain(s.dateLabel);
  expect(drawn.join(' '), label).toContain(s.title.split(' ')[0]);
  if (s.caution) expect(drawn, label).toContain(s.caution.title);
  // Öne çıkan sayıların değeri hiçbir zaman kısaltılmaz: her sözcüğü görselde yazar.
  const words = new Set(drawn.flatMap((t) => t.split(/\s+/)));
  for (const t of s.tiles) for (const w of t.value.split(/\s+/)) expect(words.has(w), `${label}: ${t.value}`).toBe(true);
  for (const w of s.steps?.items ?? []) expect(drawn, label).toContain(w.label);
  return { h, drawn };
}

describe('özet görsel', () => {
  it('anket testleri: bütün cevap örüntülerinde özet raporla aynıdır ve çizilir', () => {
    let n = 0;
    for (const d of LIKERT) {
      const items = d.items.map((it) => it.text);
      for (const r of likertReports(d)) {
        const label = `${d.slug} ${r.audience}`;
        const s = checkSummary(d.slug, r, label);
        checkDrawing(s, label);
        // Maddeler (testteki cümleler) özete girmez.
        const mine = strings(s);
        for (const text of items) expect(mine.has(text), `${label}: madde özette`).toBe(false);
        n++;
      }
    }
    expect(n).toBeGreaterThan(250);
  }, 180_000);

  it('görev testleri: bütün sonuç örüntülerinde (yorumlanmayanlar dahil)', () => {
    let n = 0;
    for (const [slug, variants] of Object.entries(TASK_VARIANTS)) {
      for (const [name, make] of Object.entries(variants)) {
        for (const r of reportsOf(slug, make())) {
          const label = `${slug} ${name} ${r.audience}`;
          checkDrawing(checkSummary(slug, r, label), label);
          n++;
        }
      }
    }
    expect(n).toBeGreaterThan(100);
  }, 180_000);

  it('okuma ve sesli okuma', () => {
    for (const g of [3, 6]) for (const r of reportsOf('okuma-hizi-ve-anlama', readingBody(g))) checkDrawing(checkSummary('okuma-hizi-ve-anlama', r, `okuma ${g}`), `okuma ${g}`);
    for (const r of oralReports()) checkDrawing(checkSummary(sesliOkuma.slug, r, `sesli okuma ${r.audience}`), `sesli okuma ${r.audience}`);
  });

  it('yayındaki her testin özeti var (anket, görev, okuma, sesli okuma)', () => {
    const covered = new Set([...LIKERT.map((d) => d.slug), ...Object.keys(TASK_VARIANTS), 'okuma-hizi-ve-anlama', sesliOkuma.slug]);
    for (const d of publicInstruments()) expect(covered.has(d.slug), d.slug).toBe(true);
  });

  it('ad yalnızca yazıldıysa görseldedir; uzun ad taşmaz', () => {
    const r = reportsOf('bes-faktor-kisilik', likertBody('bes-faktor-kisilik', 6, (i) => (i % 2 ? 4 : 2)))[0];
    const s = reportSummary('bes-faktor-kisilik', r);
    expect(JSON.stringify(s)).not.toContain('Elif');
    expect(checkDrawing(s, 'adsız').drawn.join(' ')).not.toContain('Elif');
    const named = checkDrawing(s, 'adlı', 'Elif Yıldız');
    expect(named.drawn).toContain('Elif Yıldız');
    // Uzun ad iki satıra bölünür, görselin dışına taşmaz (checkDrawing denetler).
    const long = checkDrawing(s, 'uzun ad', 'Abdurrahman Gazi Karaosmanoğlu Yılmaztürk');
    expect(long.drawn.join(' ')).toContain('Abdurrahman');
    expect(long.h).toBeGreaterThan(named.h);
    // Yazı tipi yüklemesi için toplanan metinde ad ve bütün başlıklar vardır.
    expect(summaryText(s, 'olcekhane.com', 'Elif Yıldız')).toContain('Elif Yıldız');
  });

  it('yinelenen bölümler atlanır: grafikteki ölçeklerin kartları ve kartlarla aynı olan "Kısaca"', () => {
    // Kişilik profilinde her boyutun kartı grafiğin satırıyla aynı ölçektir: kart bölümü yok, betimleme satırda.
    const big = reportSummary('bes-faktor-kisilik', reportsOf('bes-faktor-kisilik', likertBody('bes-faktor-kisilik', 6, (i) => (i % 5 === 0 ? 5 : i % 5 === 1 ? 1 : 3)))[0]);
    expect(big.cards).toBeNull();
    expect(big.chart!.chart.kind).toBe('rows');
    // Görev testinde kartlar rapordaki grafikleriyle görünür; "Kısaca" aynı başlık ve rozetleri yinelediği için yoktur,
    // öneri başlıkları vardır.
    const task = reportSummary('sekil-akil-yurutme', reportsOf('sekil-akil-yurutme', Object.values(TASK_VARIANTS['sekil-akil-yurutme'])[0]())[0]);
    expect(task.cards!.items.length).toBeGreaterThan(2);
    expect(task.cards!.items.every((c) => c.visual !== null)).toBe(true);
    expect(task.points).toBeNull();
    expect(task.tips!.items.length).toBeGreaterThan(2);
  });

  it('veli raporunun özeti veliye seslenir, dosya adı rapor türünü taşır', () => {
    const [student, parent] = reportsOf('surekli-dikkat', Object.values(TASK_VARIANTS['surekli-dikkat'])[0]());
    expect(reportSummary('surekli-dikkat', student).fileBase).toBe('olcekhane-surekli-dikkat-ogrenci-ozet');
    const p = reportSummary('surekli-dikkat', parent);
    expect(p.fileBase).toBe('olcekhane-surekli-dikkat-veli-ozet');
    expect(p.audienceLabel).toBe('Veli raporu');
  });

  it('başlıktaki çizim: her testin amblemi tek başına çizilebilir görsele çevrilir', () => {
    for (const d of publicInstruments()) {
      const svg = renderToStaticMarkup(createElement(TestEmblem, { slug: d.slug, domain: d.domain, name: d.name, dims: d.scales.filter((x) => !x.of).length }));
      const alone = standaloneEmblem(svg, domainHex(d.domain));
      expect(alone, d.slug).not.toBeNull();
      expect(alone!, d.slug).toContain(`width="${EMBLEM_W}" height="${EMBLEM_H}"`);
      expect(alone!, d.slug).toContain('xmlns="http://www.w3.org/2000/svg"');
      // Renk taşıyan hiçbir CSS değişkeni kalmaz (görsel sayfanın stilinden bağımsız çizilir).
      expect(/var\(--(?:e\d|surface|dim-|vurgu)/.test(alone!), d.slug).toBe(false);
    }
    expect(standaloneEmblem('<div></div>', '#7a4ee6')).toBeNull();
    expect(standaloneEmblem('<svg viewBox="0 0 1 1"><rect style="fill:var(--bilinmeyen)"/></svg>', '#7a4ee6')).toBeNull();
  });

  it('alan renkleri sitenin açık temasıyla aynıdır', () => {
    const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
    for (const [domain, hex] of Object.entries(DOMAIN_HEX)) {
      const name = /var\((--dim-[a-z]+)\)/.exec(DOMAIN_COLOR[domain])![1];
      // İlk tanım açık temanınkidir (koyu tema sonra gelir).
      expect(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`).exec(css)![1], domain).toBe(hex);
    }
    expect(Object.keys(DOMAIN_HEX).sort()).toEqual(Object.keys(DOMAIN_COLOR).sort());
  });

  it('özet görsel her rapor ekranındadır; bileşeni hiçbir yere bir şey göndermez', () => {
    const read = (f: string) => readFileSync(path.join(root, f), 'utf8');
    expect(read('src/components/test/test-session.tsx')).toContain('<SummaryPanel slug={slug} report={report}');
    expect(read('src/components/paket/package-session.tsx')).toContain('<SummaryPanel slug={e.slug} report={e.report}');
    const panel = read('src/components/share/summary-panel.tsx');
    for (const banned of ['fetch(', 'post(', 'XMLHttpRequest', 'sendBeacon', 'localStorage', 'sessionStorage', 'indexedDB', 'document.cookie']) {
      expect(panel.includes(banned), banned).toBe(false);
    }
    // Ad alanı tarayıcının otomatik doldurmasına ve önerilerine kapalıdır.
    expect(panel).toContain('autoComplete="off"');
  });
});
