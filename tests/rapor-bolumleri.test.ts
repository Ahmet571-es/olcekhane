import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DAILY } from '@/content/gunluk';
import { publicInstruments } from '@/content/instruments';
import { PACKAGE_AREAS, packageTests } from '@/content/paket';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ReportParts } from '@/components/report/report-parts';
import { SimpleReportView } from '@/components/test/simple-report-view';
import { evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderPackageReportPdf, renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { PDF_ANSWER_VISUALS_MAX_ITEMS, unitOf } from '@/lib/reports/likert-parts';
import type { PackageEntry } from '@/lib/reports/package';
import { partCards, type ReportPart } from '@/lib/reports/parts';
import type { SimpleReport } from '@/lib/reports/simple';
import { drawVisual } from '@/lib/reports/visual-draw';
import { meterRange, type AnswersVisual, type GaugeVisual, type MeterVisual } from '@/lib/reports/visuals';
import { LIKERT_QUALITY, scaleItems } from '@/lib/scoring/likert';
import { LONG_PART_SECONDS, reportSpeech, speakable, utterancesOf } from '@/lib/speech/report-text';
import { foldingBody, likertBody, matrixBody, patternBody, rotationBody, vocabularyBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { checkDrawn } from './helpers/visual-check';

/**
 * Raporların ek bölümleri (site sahibinin 2026-10-31 isteği; lib/reports/parts.ts, lib/reports/likert-parts.ts): yayındaki
 * her anket testinde öğrenci, veli ve yetişkin raporunda "Düzeylerin anlamı", "Cevapların tek tek" ve "Cevaplarına ne kadar
 * güvenebiliriz?"; her kartın kendi grafiği; kartla, genel bakışla ve uyarı kutusuyla çelişmez; ekranda, PDF'te ve sesli
 * dinlemede aynı içerik. Öğrenci mahremiyeti (2026-11-01): veli raporunda maddeler ve cevaplar yoktur.
 */

const LIKERT = publicInstruments().filter((d): d is LikertInstrument => d.engine === 'likert');
const bySlug = (slug: string) => LIKERT.find((x) => x.slug === slug)!;
type Answers = Record<string, { value: number; rtMs: number | null }>;

function reportsOf(d: LikertInstrument, answers: Answers): SimpleReport[] {
  const body = { grade: d.minGrade, data: { engine: 'likert' as const, answers } };
  const r = evaluate(d.slug, body);
  return [r.student, r.parent, ...(d.adults ? [evaluateAdult(d.slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
}

const values = (d: LikertInstrument) => d.options.map((o) => o.value);
const lo = (d: LikertInstrument) => Math.min(...values(d));
const hi = (d: LikertInstrument) => Math.max(...values(d));
const mid = (d: LikertInstrument) => values(d)[Math.floor(values(d).length / 2)];
const all = (d: LikertInstrument, v: number, rtMs: number | null = 2600): Answers => Object.fromEntries(d.items.map((it) => [it.key, { value: v, rtMs }]));
const mixed = (d: LikertInstrument, k: number, rtMs: number | null = 2600): Answers =>
  Object.fromEntries(d.items.map((it, i) => [it.key, { value: values(d)[(i * k + 3) % values(d).length], rtMs: rtMs === null ? null : rtMs + ((i * 37) % 900) }]));
/** Ölçek ölçek yüksek ve düşük (ters maddeler çevrilerek): düzeyler uçlarda. */
const keyed = (d: LikertInstrument, up: (si: number) => boolean): Answers =>
  Object.fromEntries(
    d.items.map((it) => {
      const si = d.scales.findIndex((s) => s.key === it.scale);
      return [it.key, { value: up(si) !== !!it.reverse ? hi(d) : lo(d), rtMs: 3100 }];
    }),
  );
/** Maddelerin bir kısmı boş (testin en az cevap oranına uyarak). */
function withMissing(d: LikertInstrument, a: Answers): Answers {
  const keep = Math.ceil(d.items.length * d.scoring.minAnsweredRatio);
  const drop = Math.max(1, Math.min(d.items.length - keep, Math.ceil(d.items.length / 10)));
  const out = { ...a };
  for (let i = 0; i < drop; i++) delete out[d.items[(i * 7) % d.items.length].key];
  return out;
}

const partOf = (r: SimpleReport, key: ReportPart['key']) => r.parts?.find((p) => p.key === key);
const qualityCard = (r: SimpleReport, key: string) => partCards(partOf(r, 'quality')!).find((c) => c.key === key);

/** Bölümün metinleri (madde metinleri ve şablondan gelen düzey anlatımları hariç: onlar testin ve şablonun metinleridir). */
function ownTexts(p: ReportPart): string[] {
  return [
    p.title,
    p.intro,
    p.introNote ?? '',
    ...partCards(p).flatMap((c) => [
      c.title,
      c.badge ?? '',
      c.text ?? '',
      c.note ?? '',
      ...(c.spoken ?? []),
      ...(c.levels ?? []).flatMap((l) => l.spoken ?? []),
      ...(c.rows ?? []).flatMap((r) => [r.value, ...r.tags]),
    ]),
  ].filter(Boolean);
}

/** Cümleler; tırnak içindeki madde ya da seçenek tek sözcük sayılır, kaynak gösterimi sayılmaz. */
function sentences(text: string): string[] {
  return text
    .replace(/“[^”]*”/g, 'X')
    .replace(/\s*\([^()]*\d{4}\)/g, '')
    .split(/(?<=[.!?])\s+(?=[\p{Lu}\d“])/u)
    .filter((s) => s.trim());
}

/** Uyarı kutusundaki notlar (lib/scoring/likert.ts ve rapordaki tutarlılık denetimleri). */
function noteFor(key: string, r: SimpleReport, d: LikertInstrument): boolean {
  const c = r.cautions;
  switch (key) {
    case 'speed':
      return c.some((x) => x.startsWith('Cevaplar çok hızlı verilmiş'));
    case 'run':
      return c.some((x) => x.startsWith('Uzun bir bölümde hep aynı seçenek'));
    case 'pairs':
      return c.some((x) => x.startsWith('Birbirinin tersini söyleyen'));
    case 'missing':
      return c.some((x) => /^Bazı \p{L}+ cevaplanmamış/u.test(x));
    case 'same':
      return c.some((x) => /aynı cevap \(“/.test(x));
    case 'circle':
      return c.some((x) => x.startsWith('Birbirinin tersi olan bazı tarzlarda'));
    case 'contradiction': {
      const t = REPORT_TEMPLATES[d.slug].motivation!.contradiction;
      return c.includes(r.audience === 'parent' ? t.parent : t.student);
    }
  }
  throw new Error(key);
}

/** Bir çiftin iki maddesine verilecek cevaplar: ikisine de katılma, ikisine de karşı çıkma ya da tutarlı. */
function pairAnswers(d: LikertInstrument, kinds: ('agree' | 'disagree' | 'none')[]): Answers {
  const a = all(d, mid(d));
  d.oppositePairs!.forEach(([x, y], i) => {
    const k = kinds[i] ?? 'none';
    const v = k === 'agree' ? hi(d) : k === 'disagree' ? lo(d) : mid(d);
    a[x] = { value: v, rtMs: 2600 };
    a[y] = { value: v, rtMs: 2600 };
  });
  return a;
}

describe('Ek bölümler: bütün anket testleri', () => {
  it('yayındaki her anket testinde üç bölüm, doğru sırada; her kartın grafiği var ve taşmaz', () => {
    expect(LIKERT.length).toBeGreaterThanOrEqual(28);
    let cards = 0;
    for (const d of LIKERT) {
      for (const answers of [mixed(d, 7), keyed(d, (i) => i % 2 === 0)]) {
        for (const r of reportsOf(d, answers)) {
          const label = `${d.slug} ${r.audience}`;
          // "Günlük hayatta nasıl görünür" metni yazılmış testlerde (tests/gunluk-hayat.test.ts) ikinci bölümdür.
          expect(r.parts?.map((p) => p.key), label).toEqual(DAILY[d.slug] ? ['levels', 'daily', 'answers', 'quality'] : ['levels', 'answers', 'quality']);
          for (const p of r.parts!) {
            expect(p.intro, label).toBeTruthy();
            for (const c of partCards(p)) {
              cards++;
              // Grafiksiz kart yalnızca ölçülemeyen denetimde olur (cevap süreleri gelmediyse).
              if (c.status !== 'none') expect(c.visual, `${label} ${p.key} ${c.title}`).toBeDefined();
              if (c.visual) checkDrawn(c.visual, `${label} ${p.key} ${c.title}`);
            }
          }
        }
      }
    }
    expect(cards).toBeGreaterThan(1000);
  }, 240_000);

  it('Düzeylerin anlamı: kartla ve genel bakışla aynı düzey ve eşikler; anlatım düzeyin adını yinelemez; ölçümün doğal payı', () => {
    for (const d of LIKERT) {
      for (const answers of [all(d, lo(d)), all(d, hi(d)), mixed(d, 3), keyed(d, () => true), keyed(d, () => false)]) {
        for (const r of reportsOf(d, answers)) {
          const part = partOf(r, 'levels')!;
          const shown = new Map<string, GaugeVisual>();
          for (const it of [...r.items, ...(r.groups ?? [])]) if (it.visual?.type === 'gauge') shown.set(it.visual.label, it.visual);
          const rulers = r.chart?.type === 'rulers' ? r.chart.rows : [];
          const facetRows = (r.groups ?? []).flatMap((g) => g.facets);
          expect(partCards(part).map((c) => c.key).sort(), d.slug).toEqual(d.scales.map((s) => s.key).sort());
          for (const c of partCards(part)) {
            const label = `${d.slug} ${r.audience} ${c.title}`;
            const scale = d.scales.find((s) => s.key === c.key)!;
            const g = c.visual as GaugeVisual;
            expect(g.type, label).toBe('gauge');
            const card = shown.get(scale.name);
            if (card) expect(g, label).toEqual(card);
            const labels = c.levels!.flatMap((l) => l.label.split(' · '));
            expect(labels, label).toEqual(g.zones.map((z) => z.label));
            const active = c.levels!.filter((l) => l.active);
            // Düzeyin anlatımı düzeyin adını yinelemez; ya şablonun kısa başlığı ya da seçeneklerle anlatım.
            const t = REPORT_TEMPLATES[d.slug].scales[scale.key];
            for (const l of c.levels!) {
              expect(l.text.toLocaleLowerCase('tr-TR'), `${label}: ${l.text}`).not.toBe(l.label.toLocaleLowerCase('tr-TR'));
              if (l.text && t && Object.keys(t).length) expect(Object.values(t).some((b) => b?.summary === l.text) || l.text.startsWith('Cevapların ortalaması'), `${label}: ${l.text}`).toBe(true);
              expect(l.text.length, `${label}: ${l.text}`).toBeLessThan(90);
            }
            if (g.value === null) {
              expect(active.length, label).toBe(0);
              expect(c.badge, label).toBe('Hesaplanamadı');
            } else {
              expect(active.length, label).toBe(1);
              const zone = g.zones[g.active!];
              expect(active[0].label.split(' · '), label).toContain(zone.label);
              expect(c.badge, label).toBe(zone.label);
              const row = [...rulers, ...facetRows].find((x) => x.label === scale.name);
              if (row) expect(row.band, label).toBe(zone.label);
            }
            // Ölçümün doğal payı: yalnızca α ve başvuru standart sapması bilinen ölçekte; sözle de okunur.
            const sem = !!(scale.alpha && scale.sdRef);
            expect(g.ciLow !== null, label).toBe(sem && g.value !== null);
            if (sem && g.value !== null) expect(c.spoken?.join(' '), label).toContain('Ölçümün doğal payı hesaba katılınca');
            // "Bu da uyabilir": yalnızca kişinin düzeyinin komşusunda ve ölçümün doğal payı oraya uzanıyorsa.
            const near = c.levels!.filter((l) => l.near);
            if (g.ciLow === null || g.active === null) expect(near.length, label).toBe(0);
            else {
              const i = g.active;
              const expected = [
                ...(i > 0 && g.ciLow < g.zones[i].from - 1e-9 ? [g.zones[i - 1].label] : []),
                ...(i < g.zones.length - 1 && g.ciHigh! > g.zones[i].to + 1e-9 ? [g.zones[i + 1].label] : []),
              ].filter((z) => !active[0].label.split(' · ').includes(z));
              expect(near.flatMap((l) => l.label.split(' · ')).filter((z) => expected.includes(z)).sort(), label).toEqual(expected.sort());
              for (const l of near) expect(l.active, label).toBe(false);
              // İki komşuda da: tek cümle (kartın metninde); birinde: düzeyin ardından okunan cümle.
              if (expected.length === 2) expect(c.text, label).toMatch(/iki komşu düzeyin de sınırına yakın/);
              else for (const l of near) expect(l.spoken, label).toMatch(/bu düzeyin sınırına yakın/);
            }
          }
          const margin = d.scales.some((s) => s.alpha && s.sdRef);
          expect(part.intro.includes('ölçümün doğal payı denir'), d.slug).toBe(margin && partCards(part).some((c) => (c.visual as GaugeVisual).ciLow !== null));
          if (part.intro.includes('Sarı bant')) expect(part.introNote, d.slug).toContain('%90');
        }
      }
    }
  }, 240_000);

  it('Cevapların tek tek: öğrenci ve yetişkin raporunda her ölçeğin maddeleri, cevaplar, ters puanlananlar, boşlar, ortalama', () => {
    for (const d of LIKERT) {
      for (const answers of [mixed(d, 7), withMissing(d, mixed(d, 3)), keyed(d, (i) => i % 2 === 1)]) {
        for (const r of reportsOf(d, answers).filter((x) => x.audience !== 'parent')) {
          const part = partOf(r, 'answers')!;
          expect(part.collapsed, d.slug).toBe(true);
          expect(part.appendix, d.slug).toBe(true);
          expect(part.pdfVisuals === false, d.slug).toBe(d.items.length > PDF_ANSWER_VISUALS_MAX_ITEMS);
          const cards = partCards(part);
          const direct = d.scales.filter((s) => !s.of);
          expect(new Set(cards.map((c) => c.key)), d.slug).toEqual(new Set(direct.map((s) => s.key)));
          const seen = new Set<number>();
          for (const c of cards) {
            const label = `${d.slug} ${r.audience} ${c.title}`;
            const scale = d.scales.find((s) => s.key === c.key)!;
            const items = scaleItems(d, scale);
            const v = c.visual as AnswersVisual;
            expect(v.type, label).toBe('answers');
            expect(c.rows!.map((x) => x.no), label).toEqual(items.map((it) => d.items.indexOf(it) + 1));
            expect(v.rows.map((x) => x.label), label).toEqual(items.map((it) => String(d.items.indexOf(it) + 1)));
            items.forEach((it, i) => {
              const row = c.rows![i];
              const a = answers[it.key];
              seen.add(row.no);
              expect(row.text, label).toBe(it.text);
              expect(row.tags.includes('ters puanlanır'), `${label} ${it.key}`).toBe(!!it.reverse);
              expect(v.rows[i].reverse, label).toBe(!!it.reverse);
              if (!a) {
                expect(row.muted, label).toBe(true);
                expect(row.value, label).toBe('Cevaplanmadı');
                expect(v.rows[i].value, label).toBeNull();
              } else {
                expect(row.value, label).toBe(d.options.find((o) => o.value === a.value)!.label);
                expect(v.rows[i].value, label).toBe(it.reverse ? lo(d) + hi(d) - a.value : a.value);
              }
            });
            const sec = r.chart?.type === 'rulers' ? r.chart.rows.find((x) => x.label === scale.name) : undefined;
            if (sec && sec.value !== null && v.mean) {
              const per = d.scoring.method === 'mean' ? 1 : items.length;
              expect(v.mean.value, label).toBeCloseTo(sec.value / per, 2);
              // Toplam puanlı ölçekte işaret "Cümle başına" diye adlandırılır (kartın toplam puanıyla karışmasın).
              expect(v.mean.label.startsWith(d.scoring.method === 'sum' ? 'Cümle başına' : 'Ortalama'), label).toBe(true);
            }
          }
          expect(seen.size, d.slug).toBe(d.items.length);
          expect(part.title, d.slug).toBe('Cevapların tek tek');
          expect(cards[0].rowsHead?.value, d.slug).toBe('Cevabın');
          // Öğrenci raporu kendi kararını hatırlatır; yetişkinde bu cümle yok.
          expect(part.intro.includes('raporunu kiminle paylaşacağına sen karar verirsin'), d.slug).toBe(r.audience === 'student');
        }
      }
    }
  }, 240_000);

  it('öğrenci mahremiyeti: veli raporunda (ekranda, PDF verisinde, sesli okumada) maddeler ve cevaplar yok', () => {
    for (const d of LIKERT) {
      const a = withMissing(d, mixed(d, 3));
      const [, parent] = reportsOf(d, a);
      const part = partOf(parent, 'answers')!;
      expect(part.title, d.slug).toBe('Çocuğunuzun cevapları tek tek');
      expect(part.groups, d.slug).toEqual([]);
      expect(part.intro, d.slug).toBe('Cevaplar tek tek yalnızca öğrencinin kendi raporunda yer alır. Çocuğunuz isterse birlikte bakabilirsiniz.');
      for (const p of parent.parts!) for (const c of partCards(p)) expect(c.rows, `${d.slug} ${p.key}`).toBeUndefined();
      // Kalite kartları da maddeleri anmaz; boş madde kartı gizli bölüme yönlendirmez.
      const json = JSON.stringify(parent.parts);
      for (const it of d.items) expect(json.includes(`“${it.text.replace(/[.!?]$/, '')}”`), `${d.slug} ${it.key}`).toBe(false);
      expect(qualityCard(parent, 'missing')!.text, d.slug).not.toContain('tek tek');
      const html = renderToStaticMarkup(createElement(ReportParts, { parts: parent.parts!, you: false }));
      for (const it of d.items) expect(html.includes(it.text.replace(/'/g, '&#x27;').replace(/"/g, '&quot;')), `${d.slug} ${it.key}`).toBe(false);
      const spoken = utterancesOf(reportSpeech(parent).results).map((u) => u.text).join(' ');
      expect(spoken, d.slug).not.toContain('Cevabı:');
    }
  });

  it('ters puanlanan maddenin örneği girişte; hassas maddeler (destek kutusunu açabilen ölçekler) örnek gösterilmez', () => {
    for (const d of LIKERT) {
      const [r] = reportsOf(d, mixed(d, 3));
      const intro = partOf(r, 'answers')!.intro;
      const rev = d.items.filter((i) => i.reverse);
      expect(intro.includes('ters puanlanır'), d.slug).toBe(rev.length > 0);
      const t = REPORT_TEMPLATES[d.slug];
      const sensitiveScale = (k: string) =>
        [k, ...d.scales.filter((s) => s.of?.includes(k)).map((s) => s.key)].some((x) => Object.values(t.scales[x] ?? {}).some((b) => b?.support));
      for (const it of d.items) {
        const sensitive = d.supportItems?.some((x) => x.key === it.key) || sensitiveScale(it.scale);
        if (sensitive) expect(intro, `${d.slug} ${it.key}`).not.toContain(`“${it.text.replace(/[.!?]$/, '')}”`);
      }
      const pairs = qualityCard(r, 'pairs');
      for (const it of d.items.filter((i) => d.supportItems?.some((x) => x.key === i.key) || sensitiveScale(i.scale)))
        if (pairs) expect(pairs.text, `${d.slug} ${it.key}`).not.toContain(`“${it.text.replace(/[.!?]$/, '')}”`);
      // Örnek: “…” cümlesine verilen “Hiç doğru değil” cevabı … puanını yükseltir.
      if (intro.includes('Örneğin')) expect(intro, d.slug).toMatch(/cümlesine verilen “[^”]+” cevabı, .+ puanını yükseltir\./);
    }
  });

  it('kartların sırası: ilgi, etkinlik ve değer profillerinde raporun genel bakışındaki sırayla; ölçeklerin adı raporun kendi adı', () => {
    for (const d of LIKERT.filter((x) => x.profile === 'interests' || x.profile === 'activities' || x.profile === 'values')) {
      for (const r of reportsOf(d, mixed(d, 7))) {
        const rows = r.chart?.type === 'rulers' ? r.chart.rows.map((x) => x.label) : [];
        expect(partCards(partOf(r, 'levels')!).map((c) => c.title), d.slug).toEqual(rows);
        if (r.audience !== 'parent') expect(partCards(partOf(r, 'answers')!).map((c) => c.title), d.slug).toEqual(rows);
      }
    }
    for (const d of LIKERT) {
      const u = unitOf(d);
      const [r] = reportsOf(d, mixed(d, 7));
      const { parts: _p, ...rest } = r;
      void _p;
      const text = JSON.stringify(rest).toLocaleLowerCase('tr-TR');
      // Tek ölçekli testte "ölçek" (ör. "Testin cümleleri"); ötekilerde raporun kendi metninde geçen ad.
      if (d.scales.length === 1) expect(u.word, d.slug).toBe('ölçek');
      // Sözcüğün kökü ("özellik" → "özelli": özelliğin, özellikler).
      else expect(text.match(new RegExp(`(?<!\\p{L})${u.word.endsWith('k') ? u.word.slice(0, -1) : u.word}`, 'u')), `${d.slug} ${u.word}`).not.toBeNull();
    }
  });

  it('Holland profili: seçeneklerle düzey anlatımı girişte bir kez; kartlarda yinelenmez', () => {
    for (const d of LIKERT.filter((x) => x.profile === 'riasec')) {
      const [r] = reportsOf(d, mixed(d, 3));
      const part = partOf(r, 'levels')!;
      expect(part.intro, d.slug).toContain('Cevapların ortalamasına göre:');
      for (const o of d.options) expect(part.intro, d.slug).toContain(`“${o.label}”`);
      for (const c of partCards(part)) for (const l of c.levels!) expect(l.text, d.slug).toBe('');
    }
  });

  it('birleşik düzeyde kişinin düzeyi adıyla yazılır ve okunur ("Senin düzeyin: Sık kullanılıyor")', () => {
    const d = bySlug('calisma-aliskanliklari');
    let merged = 0;
    for (const answers of [all(d, 2), all(d, 4), all(d, 5), mixed(d, 3)]) {
      for (const r of reportsOf(d, answers)) {
        const part = partOf(r, 'levels')!;
        const html = renderToStaticMarkup(createElement(ReportParts, { parts: [part], you: r.audience !== 'parent' }));
        const text = utterancesOf(reportSpeech(r).results).map((u) => u.text).join(' ');
        for (const c of partCards(part)) {
          const active = c.levels!.find((l) => l.active);
          if (!active?.label.includes(' · ')) continue;
          merged++;
          const who = r.audience === 'parent' ? 'Çocuğunuzun düzeyi' : 'Senin düzeyin';
          expect(html, c.title).toContain(`${who}: ${c.badge}`);
          expect(text, c.title).toContain(`${who}: ${c.badge}.`);
        }
      }
    }
    expect(merged).toBeGreaterThan(5);
  });
});

describe('Cevaplarına ne kadar güvenebiliriz: uyarı kutusuyla aynı', () => {
  /** Kalite kartlarının durumu uyarı kutusundaki notlarla birebir aynı. */
  function check(d: LikertInstrument, answers: Answers, label: string) {
    for (const r of reportsOf(d, answers)) {
      const cards = partCards(partOf(r, 'quality')!);
      for (const c of cards) {
        if (c.status === 'none') {
          expect(c.key, label).toBe('speed');
          expect(noteFor('speed', r, d), label).toBe(false);
          continue;
        }
        expect(c.status === 'warn', `${label} ${r.audience} ${c.key}`).toBe(noteFor(c.key, r, d));
        expect(c.badge, label).toBe(c.status === 'warn' ? 'Dikkat' : 'Uygun');
      }
      const keys = cards.map((c) => c.key);
      expect(keys.includes('run'), label).toBe(d.items.length >= LIKERT_QUALITY.runMinItems);
      expect(keys.includes('pairs'), label).toBe(!!d.oppositePairs?.length);
      expect(keys.includes('same'), label).toBe(!!d.sameAnswerCheck);
      expect(keys.includes('circle'), label).toBe(d.profile === 'circumplex');
      expect(keys.includes('contradiction'), label).toBe(d.profile === 'motivation');
      // Özet cümlesi uyarı ve yapılamayan denetim sayısıyla aynı.
      const warns = cards.filter((c) => c.status === 'warn').length;
      const none = cards.filter((c) => c.status === 'none').length;
      const intro = partOf(r, 'quality')!.intro;
      if (warns === 0 && none === 0) expect(intro, label).toContain('denetimlerin hepsi uygun');
      else if (warns === 0) expect(intro, label).toContain('Denetimlerden biri yapılamadı; yapılanların hepsi uygun çıktı.');
      else if (warns === 1) expect(intro, label).toContain('Bir denetimde “Dikkat” yazıyor');
      else expect(intro, label).toMatch(/\p{Lu}\p{Ll}+ denetimde “Dikkat” yazıyor/u);
      // Bir denetimde "Dikkat" varsa düzeylerin anlamı da bunu söyler.
      expect(partOf(r, 'levels')!.intro.includes('Cevap denetimlerinde “Dikkat” olduğu için'), label).toBe(warns > 0);
    }
  }

  it('çok hızlı, hep aynı seçenek, hep "evet", hep "hayır", boş, süre ölçülmedi ve olağan cevaplar', () => {
    let warns = 0;
    for (const d of LIKERT) {
      const top = hi(d);
      const cases: [string, Answers][] = [
        ['olağan', mixed(d, 7)],
        ['hızlı', mixed(d, 7, 300)],
        ['hep aynı', all(d, top - 1)],
        ['evet', all(d, top)],
        ['hayır', all(d, lo(d))],
        ['boş', withMissing(d, mixed(d, 3))],
        ['süre yok', mixed(d, 3, null)],
        ['ölçek ölçek', keyed(d, (i) => i % 2 === 0)],
        ['hep aynı ve bir boş', withMissing(d, all(d, top))],
      ];
      for (const [name, a] of cases) {
        check(d, a, `${d.slug} ${name}`);
        warns += partCards(partOf(reportsOf(d, a)[0], 'quality')!).filter((c) => c.status === 'warn').length;
      }
    }
    expect(warns).toBeGreaterThan(80);
  }, 240_000);

  it('hızlı cevaplarda hız kartı "Dikkat"; hızlı ama sınırın üstünde "yine de hızlı"; süre gelmezse denetlenemedi', () => {
    const d = bySlug('empati');
    const fast = qualityCard(reportsOf(d, mixed(d, 7, 300))[0], 'speed')!;
    expect(fast.status).toBe('warn');
    const strip = fast.visual!;
    expect(strip.type).toBe('strip');
    if (strip.type === 'strip') {
      expect(strip.zone?.to).toBe(LIKERT_QUALITY.fastMs / 1000);
      expect(strip.points.length).toBe(d.items.length);
      expect(strip.marker!.value).toBeLessThan(LIKERT_QUALITY.fastMs / 1000);
    }
    const quick = reportsOf(d, all(d, 3, 850));
    expect(qualityCard(quick[0], 'speed')!.text).toContain('Tipik cevap süren, çok hızlı sayılan sürenin üstünde. Yine de hızlı; cümleleri okuyarak cevap verdiysen sorun yok.');
    expect(qualityCard(quick[1], 'speed')!.text).toContain('Yine de hızlı; çocuğunuz cümleleri okuyarak cevap verdiyse sorun yok.');
    expect(qualityCard(reportsOf(d, all(d, 3, 3000))[0], 'speed')!.text).not.toContain('Yine de hızlı');
    const none = qualityCard(reportsOf(d, mixed(d, 7, null))[0], 'speed')!;
    expect(none.status).toBe('none');
    expect(none.badge).toBe('Denetlenemedi');
    expect(none.visual).toBeUndefined();
  });

  it('karşıt çiftler: katılma ve karşı çıkma ayrı sayılır (1 + 1 uyarı vermez); sınır uyarıyla ve grafikle aynı', () => {
    for (const d of LIKERT.filter((x) => x.oppositePairs?.length)) {
      const n = d.oppositePairs!.length;
      const need = Math.ceil(n / 2);
      // Her türden sınırın bir eksiği: toplam sınırı aşsa da uyarı yok.
      const below = pairAnswers(d, [...Array(need - 1).fill('agree'), ...Array(Math.min(need - 1, n - (need - 1))).fill('disagree')]);
      for (const r of reportsOf(d, below)) {
        const c = qualityCard(r, 'pairs')!;
        expect(c.status, `${d.slug} ${r.audience}`).toBe('ok');
        expect(noteFor('pairs', r, d), d.slug).toBe(false);
        expect(c.text, d.slug).toContain('ayrı ayrı sayılır; biri çiftlerin yarısına ulaşırsa “Dikkat” yazar.');
      }
      const at = pairAnswers(d, Array(need).fill('agree'));
      const [r] = reportsOf(d, at);
      const c = qualityCard(r, 'pairs')!;
      expect(c.status, d.slug).toBe('warn');
      const m = c.visual as MeterVisual;
      expect(m.max, d.slug).toBe(n);
      // Sınır iki tam sayının arasında: kişinin işareti hiçbir zaman tam sınırın üstüne düşmez.
      expect(m.zones[1].from, d.slug).toBe(need - 0.5);
      expect(meterRange(m, 0), d.slug).toBe(need - 1 === 0 ? '0' : `0–${need - 1}`);
      expect(meterRange(m, 1), d.slug).toBe(need === n ? `${n}` : `${need}–${n}`);
      expect(m.rows[0].value, d.slug).toBe(need);
    }
  });

  it('çember: ikisi de yüksek ve ikisi de düşük çiftler ayrı sayılır (1 + 1 uyarı vermez; 2 verir)', () => {
    const d = bySlug('kisilerarasi-tarz');
    const angle = new Map(d.scales.map((s) => [s.key, s.angle!]));
    const opposite = (k: string) => d.scales.find((s) => s.angle === (angle.get(k)! + 180) % 360)!.key;
    const level = (pick: Record<string, number>): Answers => Object.fromEntries(d.items.map((it) => [it.key, { value: pick[it.scale] ?? 3, rtMs: 2600 }]));
    const [a, b] = d.scales.filter((s) => s.angle! < 180).map((s) => s.key);
    const oneOne = level({ [a]: 5, [opposite(a)]: 5, [b]: 1, [opposite(b)]: 1 });
    for (const r of reportsOf(d, oneOne)) {
      const c = qualityCard(r, 'circle')!;
      expect((c.visual as MeterVisual).rows.map((x) => x.value)).toEqual([1, 1]);
      expect(c.status).toBe('ok');
      expect(noteFor('circle', r, d)).toBe(false);
      expect(c.text).toContain('ayrı ayrı sayılır; biri iki çifte ulaşırsa “Dikkat” yazar.');
    }
    const twoHigh = level({ [a]: 5, [opposite(a)]: 5, [b]: 5, [opposite(b)]: 5 });
    const c = qualityCard(reportsOf(d, twoHigh)[0], 'circle')!;
    expect(c.status).toBe('warn');
    expect((c.visual as MeterVisual).zones[1].from).toBe(1.5);
  });

  it('motivasyon: yüksek çıkan bölümlerin adı söylenir (bir parça yüksekken de); çelişki yoksa "Uygun"', () => {
    const d = LIKERT.find((x) => x.profile === 'motivation')!;
    const m = REPORT_TEMPLATES[d.slug].motivation!;
    const xParts = d.scales.find((s) => s.key === m.x)!.of!;
    const [first, second] = xParts;
    // Yalnızca bir parça yüksek, bileşik ölçek yüksek değil, isteksizlik yüksek.
    const partHigh: Answers = Object.fromEntries(
      d.items.map((it) => [it.key, { value: it.scale === second || it.scale === m.alone ? hi(d) : it.scale === first ? lo(d) : 3, rtMs: 2600 }]),
    );
    for (const r of reportsOf(d, partHigh)) {
      const c = qualityCard(r, 'contradiction')!;
      expect(c.status, r.audience).toBe('warn');
      expect(noteFor('contradiction', r, d), r.audience).toBe(true);
      const name = (k: string) => d.scales.find((s) => s.key === k)!.name.toLocaleLowerCase('tr-TR');
      expect(c.text, r.audience).toContain(`${name(second)} ve ${name(m.alone)} yüksek çıktı`);
      expect(c.text, r.audience).not.toContain('ikisi de');
      expect(c.text, r.audience).toContain(`(ya da ${name(first)} ve ${name(second)})`);
      expect(c.visual?.type).toBe('compare');
    }
    const calm: Answers = Object.fromEntries(d.items.map((it) => [it.key, { value: it.scale === m.alone ? lo(d) : hi(d), rtMs: 2600 }]));
    expect(qualityCard(reportsOf(d, calm)[0], 'contradiction')!.status).toBe('ok');
  });

  it('hep aynı cevap: boş bırakılan madde denetimi bozmaz (uyarı ve kart birlikte)', () => {
    for (const d of LIKERT.filter((x) => x.sameAnswerCheck)) {
      const v = values(d).find((x) => x !== (lo(d) + hi(d)) / 2 && x !== lo(d))!;
      const a = all(d, v);
      delete a[d.items[0].key];
      for (const r of reportsOf(d, a)) {
        expect(qualityCard(r, 'same')!.status, `${d.slug} ${r.audience}`).toBe('warn');
        expect(r.cautions.some((x) => x.startsWith('Cevaplanan bütün')), d.slug).toBe(true);
        expect(qualityCard(r, 'missing')!.status, d.slug).toBe('warn');
      }
    }
  });

  it('ilgi testlerinde hep "Hiç hoşlanmam" dürüst bir cevaptır: hep aynı seçenek uyarısı çıkmaz', () => {
    for (const d of LIKERT.filter((x) => x.profile === 'riasec' || x.profile === 'interests')) {
      for (const r of reportsOf(d, all(d, lo(d)))) {
        expect(noteFor('run', r, d), d.slug).toBe(false);
        const c = qualityCard(r, 'run')!;
        expect(c.status, d.slug).toBe('ok');
        expect(c.text, d.slug).toContain(`“${d.options.find((o) => o.value === lo(d))!.label}” cevaplarının dizileri sayılmaz`);
      }
      // Başka bir seçenekle hep aynı cevap yine uyarı verir.
      for (const r of reportsOf(d, all(d, hi(d)))) expect(qualityCard(r, 'run')!.status, d.slug).toBe('warn');
    }
  });
});

describe('Ek bölümlerin dili', () => {
  it('öğrenciye ve yetişkine "sen", veliye "çocuğunuz"; yetişkinde okul sözcüğü yok; tanı ve zekâ puanı yok; cümleler kısa', () => {
    for (const d of LIKERT) {
      for (const answers of [mixed(d, 7), withMissing(d, all(d, hi(d), 300)), keyed(d, (i) => i % 2 === 0)]) {
        for (const r of reportsOf(d, answers)) {
          for (const p of r.parts!) {
            const texts = ownTexts(p);
            const joined = texts.join(' ');
            const label = `${d.slug} ${r.audience} ${p.key}`;
            expect(joined, label).not.toMatch(/(?<!\p{L})(?:tanı|teşhis|IQ|hastalık|bozukluk)(?!\p{L})/iu);
            expect(joined, label).not.toMatch(/zekâ puanı|norm/i);
            if (r.audience === 'parent') {
              expect(joined, label).not.toMatch(/(?<!\p{L})(?:senin|sen|verdiğin|bıraktın|cevapladın|vermişsin|katılmışsın|çözersen|çözebilirsin|indirdiğin)(?!\p{L})/iu);
            } else {
              expect(joined, label).not.toMatch(/Çocuğunuz/);
            }
            if (r.audience === 'adult') expect(schoolWords(joined.replace(/“[^”]*”/g, '')), label).toEqual([]);
            for (const t of texts)
              for (const s of sentences(t)) {
                const words = s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
                expect(words, `${label}: ${s}`).toBeLessThanOrEqual(22);
              }
          }
        }
      }
    }
  }, 240_000);
});

describe('Ek bölümler ekranda, PDF’te ve sesli dinlemede', () => {
  it('ekranda sıra: sonuç kartları, destek kutusu, ek bölümler, notlar; cevaplar kapalı kutularla başlar', () => {
    for (const slug of ['empati', 'oz-saygi', 'alti-boyutlu-kisilik-profili', 'ders-calisma-motivasyonu']) {
      const d = bySlug(slug);
      for (const r of reportsOf(d, all(d, lo(d)))) {
        const html = renderToStaticMarkup(createElement(SimpleReportView, { report: r }));
        const at = (s: string) => html.indexOf(s);
        const titles = r.parts!.map((p) => p.title.replace('?', ''));
        const order = [at('id="ogeler"'), ...(r.support ? [at(r.support.title)] : []), ...titles.map(at), at(r.disclaimer.title)];
        for (const i of order) expect(i, slug).toBeGreaterThan(-1);
        expect([...order].sort((a, b) => a - b), `${slug} ${r.audience}`).toEqual(order);
        // Öğrencinin ve yetişkinin cevapları kapalı kutularda; bütün maddeler sayfada.
        if (r.audience !== 'parent') {
          expect(html, slug).toContain('<details');
          for (const it of d.items.slice(0, 40)) expect(html, `${slug} ${it.key}`).toContain(it.text.replace(/'/g, '&#x27;').replace(/"/g, '&quot;'));
        }
        // Safari'nin kendi açılır kapanır işareti gizlidir (sayfanın kendi işareti var).
        if (html.includes('<details')) expect(html, slug).toContain('::-webkit-details-marker]:hidden');
      }
    }
  });

  it('sesli dinleme ek bölümleri eksiksiz okur; uzun bölümün süresi söylenir; bölüm tek bir "geçilebilir" bölümdür', () => {
    for (const d of LIKERT) {
      const answers = withMissing(d, mixed(d, 3));
      const reports = reportsOf(d, answers);
      for (const r of [reports[0], reports[1]]) {
        const utter = utterancesOf(reportSpeech(r).results);
        const text = utter.map((u) => u.text).join(' ');
        const segs = new Set(utter.map((u) => u.segment));
        for (const p of r.parts!) {
          const title = p.title.replace(/[.:?]$/, '');
          expect(segs.has(title), `${d.slug} ${p.title}`).toBe(true);
          // Bölümün bütün parçaları aynı "geçilebilir" bölümde.
          const mine = utter.filter((u) => u.section === title);
          expect(mine.length, d.slug).toBeGreaterThan(0);
          const seconds = mine.reduce((n, u) => n + u.text.length, 0) / 15;
          if (seconds > LONG_PART_SECONDS * 1.1) expect(mine.some((u) => u.text.startsWith('Bu bölüm yaklaşık')), `${d.slug} ${p.key}`).toBe(true);
          if (p.introNote) expect(text, d.slug).not.toContain(speakable(p.introNote).slice(0, 40));
          for (const c of partCards(p)) {
            expect(segs.has(c.title), `${d.slug} ${c.title}`).toBe(true);
            for (const l of c.levels ?? []) if (l.text) expect(text, `${d.slug} ${l.text}`).toContain(speakable(l.text));
            for (const row of c.rows ?? []) {
              expect(text, `${d.slug} ${row.text}`).toContain(speakable(row.text).replace(/[.!?]$/, ''));
              expect(text, `${d.slug} ${row.value}`).toContain(speakable(row.value));
            }
            if (c.note) expect(text, d.slug).not.toContain(speakable(c.note).slice(0, 30));
          }
        }
        // Grafiğin görünüşünü anlatan cümleler (sarı bant, kırmızı çizgi) okunmaz.
        expect(text, d.slug).not.toMatch(/(?<!\p{L})(?:kırmızı|sarı bant)/iu);
        if (r.audience === 'student') {
          expect(text, d.slug).toContain('Cevabın:');
          if (d.items.some((i) => i.reverse)) expect(text, d.slug).toContain('Ters puanlanır.');
          expect(text, d.slug).toContain('Cevaplanmadı.');
        }
      }
    }
  }, 240_000);

  it('yeni çizimler: çok satırlı cevap grafiği ve denetim çubuğu uçlarda da taşmaz', () => {
    const rows = Array.from({ length: 16 }, (_, i) => ({ label: String(200 + i * 3), value: i % 4 === 0 ? null : (i % 5) + 1, reverse: i % 3 === 0 }));
    const v: AnswersVisual = {
      type: 'answers',
      label: 'Deneme',
      min: 1,
      max: 5,
      rows,
      mean: { value: 4.96, label: 'Ortalama 5,0' },
      axis: ['düşük', 'puana katkı', 'yüksek'],
      legend: { filled: 'öteki cümleler', hollow: 'ters puanlanan cümleler', missing: 'boş: cevaplanmadı' },
    };
    checkDrawn(v, 'cevaplar');
    checkDrawn({ ...v, min: 0, max: 3, mean: { value: 0, label: 'Cümle başına 0,0' } }, 'cevaplar 0–3');
    for (const value of [0, 2, 3, 5]) {
      const m: MeterVisual = {
        type: 'meter',
        label: 'Deneme',
        min: 0,
        max: 5,
        zones: [
          { from: 0, to: 2.5, label: 'Uygun', warn: false },
          { from: 2.5, to: 5, label: 'Dikkat', warn: true },
        ],
        rows: [
          { label: 'İkisine de katılma', value, valueLabel: `${value} çift` },
          { label: 'Arka arkaya aynı cevabı verdiğin en uzun bölüm', value: 5 - value, valueLabel: `${5 - value} cümle` },
        ],
        discrete: true,
      };
      checkDrawn(m, `çubuk ${value}`);
      const d = drawVisual(m, 240, 10);
      expect(d.shapes.filter((s) => s.k === 'line' && s.stroke === 'marker').length).toBe(2);
      // Eksende yalnızca uçlar; bölgelerin adında aralıklar.
      const texts = d.shapes.flatMap((s) => (s.k === 'text' ? [s.text] : []));
      expect(texts).toContain('Uygun 0–2');
      expect(texts).toContain('Dikkat 3–5');
      expect(texts).not.toContain('2,5');
    }
  });

  it('PDF: cevaplar ekte (yol haritasından sonra); uzun testte grafiksiz; 240 madde ve paket makul sürede', async () => {
    const pages = (b: Buffer) => (b.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    // En uzun test (240 madde): öğrenci raporu bütün bölümlerle, cevaplar ekte ve grafiksiz.
    const alti = bySlug('alti-boyutlu-kisilik-profili');
    const [student, parent] = reportsOf(alti, withMissing(alti, mixed(alti, 3)));
    expect(partOf(student, 'answers')!.pdfVisuals).toBe(false);
    let t0 = performance.now();
    const pdf = await renderSimpleReportPdf(student, 'olcekhane.com');
    // Yerelde ~4 sn; GitHub'da daha yavaş olabilir.
    expect(performance.now() - t0).toBeLessThan(40_000);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pages(pdf)).toBeGreaterThan(10);
    // Veli PDF'i maddeleri içermez: daha kısa.
    const parentPdf = await renderSimpleReportPdf(parent, 'olcekhane.com');
    expect(pages(parentPdf)).toBeLessThan(pages(pdf));
    // Kısa testte cevaplar grafikli, ek sayfada.
    const oz = bySlug('oz-saygi');
    const [ozStudent] = reportsOf(oz, mixed(oz, 3));
    expect(partOf(ozStudent, 'answers')!.pdfVisuals).toBeUndefined();
    expect(pages(await renderSimpleReportPdf(ozStudent, 'olcekhane.com'))).toBeGreaterThan(pages(await renderSimpleReportPdf({ ...ozStudent, parts: undefined }, 'olcekhane.com')));
    // Kendini Tanı Paketi (yetişkin): bütün raporlar tek PDF'te.
    const bodyFor = (slug: string) => {
      switch (slug) {
        case 'sekil-akil-yurutme':
          return matrixBody(undefined, 9);
        case 'kelime-bilgisi':
          return vocabularyBody(undefined, 9);
        case 'zihinde-dondurme':
          return rotationBody(undefined, 9);
        case 'kagit-katlama':
          return foldingBody(undefined, 9);
        case 'desen-hatirlama':
          return patternBody(undefined, 9);
        default:
          return likertBody(slug, 9, (i) => (i * 3 + 1) % 5);
      }
    };
    const entries: PackageEntry[] = packageTests(ADULT_GRADE).map(({ slot, def }) => {
      const reports = evaluateReports(def.slug, { ...bodyFor(def.slug), grade: ADULT_GRADE }) as { adult: SimpleReport };
      return { slug: def.slug, skill: slot.skill, areaName: PACKAGE_AREAS.find((a) => a.key === slot.area)!.name, report: reports.adult };
    });
    t0 = performance.now();
    const pkg = await renderPackageReportPdf({ entries, skipped: [], gradeLabel: 'Yetişkin', completedAt: new Date() }, 'olcekhane.com');
    expect(performance.now() - t0).toBeLessThan(60_000);
    expect(pkg.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pages(pkg)).toBeGreaterThan(entries.length * 2);
  }, 240_000);
});
