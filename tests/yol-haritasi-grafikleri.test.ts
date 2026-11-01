import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { ACADEMIC_ROADMAPS, INTEREST_ROADMAPS, ORAL_ROADMAPS, READING_ROADMAPS, ROADMAPS, TASK_ROADMAPS } from '@/content/roadmaps';
import { evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { LikertInstrument, QuizInstrument, ReadingInstrument } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import type { RoadmapGraphic } from '@/lib/reports/roadmap-graphics';
import type { SimpleReport } from '@/lib/reports/simple';
import type { ItemVisual } from '@/lib/reports/visuals';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';
import { oralPassagesFor, type OralInput } from '@/lib/scoring/oral';
import { def, likertBody } from './helpers/bodies';
import { HAS_PDFTOTEXT, pdfOverlaps } from './helpers/pdf-overlap';
import { schoolWords } from './helpers/school';
import { TASK_VARIANTS } from './helpers/task-variants';
import { checkDrawn } from './helpers/visual-check';

/**
 * Gelişim yol haritasının grafikleri (site sahibinin 2026-10-31 isteği: raporda açıklama yapan her bölümün, yol haritası
 * dahil, kendi içeriğine uygun bir grafiği olsun). Bütün yol haritalarında (anket, ilgi, konu tarama, okuma, sesli okuma,
 * zihinsel görev), öğrenci, veli ve yetişkin raporunda ve birçok sonuç örüntüsünde:
 *  - içeriği olan her bölümün grafiği vardır (kısaca, öneriler, ortamlar, yaklaşım, haftalar); herkese aynı verilen öneri
 *    listelerinde (zihinsel görevlerin önerileri, bilmekte yarar olanlar ve yaklaşımı; okuma alışkanlığı; haftalık düzen)
 *    sonuç grafiği yoktur;
 *  - grafiklerin değerleri ve düzeyleri raporun değerleri ve düzeyleriyle, çoğunda raporun kartındaki grafikle aynıdır;
 *  - grafiklerin dayandığı anahtarlar vardır; yorumlanmayan ya da hesaplanamayan sonucun grafiği yoktur;
 *  - yazılar taşmaz, sözlü anlatımı vardır ve sadedir; PDF'te kelimeler üst üste binmez.
 */

type Kind = 'likert' | 'interest' | 'academic' | 'reading' | 'oral' | 'task';
const kindOf = (slug: string): Kind | null =>
  ROADMAPS[slug]
    ? 'likert'
    : INTEREST_ROADMAPS[slug]
      ? 'interest'
      : ACADEMIC_ROADMAPS[slug]
        ? 'academic'
        : READING_ROADMAPS[slug]
          ? 'reading'
          : ORAL_ROADMAPS[slug]
            ? 'oral'
            : TASK_ROADMAPS[slug]
              ? 'task'
              : null;

/* ---------- Sonuç örüntüleri ---------- */

function likertBodies(slug: string): AnswersBody[] {
  const d = def<LikertInstrument>(slug);
  const grade = gradeAllowed(d, 9) ? 9 : d.minGrade;
  const n = d.options.length;
  // Karışık, hep orta (dengeli profil), hep en düşük, hep en yüksek ve ölçeklere göre iki uç.
  const byScale = (i: number) => {
    const it = d.items[i];
    const si = d.scales.findIndex((s) => s.key === it.scale);
    const high = si % 2 === 0;
    return high !== !!it.reverse ? n - 1 : 0;
  };
  return [
    likertBody(slug, grade, (i) => (i * 7 + 2) % n),
    likertBody(slug, grade, () => Math.floor(n / 2)),
    likertBody(slug, grade, () => 0),
    likertBody(slug, grade, () => n - 1),
    likertBody(slug, grade, byScale),
  ];
}

function readingBodies(): AnswersBody[] {
  const d = def<ReadingInstrument>('okuma-hizi-ve-anlama');
  const out: AnswersBody[] = [];
  for (const grade of [3, 6, 10]) {
    const p = passageForGrade(d, grade);
    const answers = (wrong: number) => Object.fromEntries(p.questions.map((q, i) => [q.key, i % wrong === 0 ? q.options.find((o) => o.key !== q.answer)!.key : q.answer]));
    const all = Object.fromEntries(p.questions.map((q) => [q.key, q.answer]));
    // Olağan hız, çok kısa süre (hız yorumlanmaz), çok uzun süre (hız yorumlanmaz), yanlışlı cevaplar.
    for (const [ms, a] of [
      [150_000, all],
      [4_000, all],
      [3_000_000, answers(2)],
      [90_000, answers(3)],
    ] as const) {
      out.push({ grade, data: { engine: 'reading', passageKey: p.key, readingMs: ms, answers: a } });
    }
  }
  return out;
}

function quizBodies(): AnswersBody[] {
  const d = def<QuizInstrument>('matematik-konu-tarama-testi');
  const out: AnswersBody[] = [];
  for (const grade of [5, 8]) {
    const form = formForGrade(d, grade);
    const body = (pick: (it: (typeof form.items)[number], i: number) => 'A' | 'B' | 'C' | 'D' | 'X', rtMs = 40_000): AnswersBody => ({
      grade,
      data: { engine: 'quiz', answers: Object.fromEntries(form.items.map((it, i) => [it.key, { choice: pick(it, i), rtMs }])) },
    });
    const wrong = (it: (typeof form.items)[number]) => it.options.find((o) => o.key !== it.answer)!.key as 'A' | 'B' | 'C' | 'D';
    out.push(
      body((it) => it.answer as 'A'),
      body((it, i) => (i % 3 === 0 ? wrong(it) : (it.answer as 'A'))),
      body((it, i) => (i % 2 === 0 ? wrong(it) : i % 5 === 1 ? 'X' : (it.answer as 'A'))),
      // Yorumlanmayan sonuç: bütün sorularda "Bilmiyorum" ya da çok hızlı ve hep aynı seçenek.
      body(() => 'X'),
      body(() => 'A', 1500),
    );
  }
  return out;
}

function oralBodies(): AnswersBody[] {
  const out: AnswersBody[] = [];
  for (const grade of [2, 4]) {
    const p = oralPassagesFor(sesliOkuma, grade)[0];
    const words = oralWordCount(p.paragraphs);
    const base: OralInput = {
      passageKey: p.key,
      recordMs: 70_000,
      readingMs: Math.round((words / 70) * 60_000),
      timingAuto: true,
      audio: { quality: 'good', pauses: [[1000, 1400]], speechMs: 40_000, contour: Array.from({ length: 60 }, (_, i) => (i * 7) % 100), interrupted: false },
      marks: {},
      listened: 1,
      retell: { recorded: true, ideas: p.ideas.slice(0, 2).map((x) => x.key) },
      answers: Object.fromEntries(p.questions.map((q) => [q.key, q.answer])),
      prosody: { expression: 3, phrasing: 2, smoothness: 4, pace: 3 },
    };
    const wrongAnswers = Object.fromEntries(p.questions.map((q, i) => [q.key, i % 2 ? q.answer : q.options.find((o) => o.key !== q.answer)!.key]));
    const variants: OralInput[] = [
      base,
      { ...base, answers: wrongAnswers, prosody: { expression: 1, phrasing: 2, smoothness: 1, pace: 2 } },
      // Süre metne göre çok kısa: hız hesaplanmaz, grafiği de yok.
      { ...base, readingMs: 3_000, recordMs: 4_000, audio: { ...base.audio!, speechMs: 2_500 } },
    ];
    for (const v of variants) out.push({ grade, data: { engine: 'oral', ...v } });
  }
  return out;
}

function bodiesFor(slug: string, kind: Kind): AnswersBody[] {
  if (kind === 'likert' || kind === 'interest') return likertBodies(slug);
  if (kind === 'reading') return readingBodies();
  if (kind === 'academic') return quizBodies();
  if (kind === 'oral') return oralBodies();
  return Object.values(TASK_VARIANTS[slug] ?? {}).map((make) => make());
}

/** Bir testin bütün raporları: her örüntüde öğrenci ve veli, yetişkinlere açıksa yetişkin. */
function reportsFor(slug: string, kind: Kind): SimpleReport[] {
  const d = publicInstruments().find((x) => x.slug === slug)!;
  const out: SimpleReport[] = [];
  for (const body of bodiesFor(slug, kind)) {
    const grade = Math.max(body.grade, d.minGrade);
    const b = { ...body, grade: gradeAllowed(d, grade) ? grade : d.minGrade };
    out.push(...(Object.values(evaluateReports(slug, b)) as SimpleReport[]));
    if (d.adults && kind !== 'oral') out.push(...(Object.values(evaluateReports(slug, { ...b, grade: ADULT_GRADE })) as SimpleReport[]));
  }
  return out.filter((r) => r.roadmap);
}

/* ---------- Denetimler ---------- */

/** Raporda görünen bütün grafikler (kartlar ve gruplar). */
const reportVisuals = (r: SimpleReport): { title: string; visual: ItemVisual }[] => [
  ...r.items.flatMap((it) => (it.visual ? [{ title: it.title, visual: it.visual }] : [])),
  ...(r.groups ?? []).flatMap((g) => (g.visual ? [{ title: g.title, visual: g.visual }] : [])),
];

/** Yol haritasının bütün grafikleri ve nerede oldukları. */
function graphicsOf(rm: Roadmap): { where: string; g: RoadmapGraphic }[] {
  const out: { where: string; g: RoadmapGraphic }[] = [];
  rm.standout.forEach((s) => s.graphic && out.push({ where: `kısaca ${s.title}`, g: s.graphic }));
  if (rm.standoutGraphic) out.push({ where: 'kısaca notu', g: rm.standoutGraphic });
  rm.study.items.forEach((it) => it.graphic && out.push({ where: `öneri ${it.title}`, g: it.graphic }));
  if (rm.settings?.graphic) out.push({ where: 'ortamlar', g: rm.settings.graphic });
  if (rm.approach?.graphic) out.push({ where: 'yaklaşım', g: rm.approach.graphic });
  out.push({ where: 'haftalar', g: rm.weeksGraphic });
  return out;
}

/** Düzey çubuğu ve yan yana grafik: değer, yazılışı ve bölgesi yol haritasının profilindeki (raporun) değerle aynıdır. */
function checkScaleValues(rm: Roadmap, v: ItemVisual, at: string) {
  const bar = (label: string) => rm.bars.find((b) => b.label === label);
  if (v.type === 'gauge') {
    const b = bar(v.label);
    expect(b, `${at}: ${v.label}`).toBeDefined();
    expect(v.value, at).toBe(b!.value);
    expect(v.valueLabel, at).toBe(b!.valueLabel);
    expect(v.active, at).not.toBeNull();
    expect(v.zones[v.active!].label, at).toBe(b!.band);
  } else if (v.type === 'compare') {
    for (const row of v.rows) {
      const b = bar(row.label);
      expect(b, `${at}: ${row.label}`).toBeDefined();
      expect(row.value, at).toBe(b!.value);
      expect(row.valueLabel, at).toBe(b!.valueLabel);
      expect(v.zones[row.active!].label, at).toBe(b!.band);
    }
  } else if (v.type === 'bars') {
    // Çok ölçekte düzeylere göre ölçek sayısı: her satır o düzeydeki ölçeklerin sayısı.
    for (const row of v.rows) expect(row.value, `${at}: ${row.label}`).toBe(rm.bars.filter((b) => b.value !== null && b.band === row.label).length);
    expect(v.rows.reduce((n, r) => n + r.value, 0), at).toBe(rm.bars.filter((b) => b.value !== null).length);
  } else {
    throw new Error(`${at}: beklenmeyen grafik ${v.type}`);
  }
}

/** Sözlü anlatım ve başlık: boş değil (rozet değeri söylemiyorsa), eksik değer yok, cümleler kısa, kişiye uygun dil. */
function checkSpoken(g: RoadmapGraphic, r: SimpleReport, at: string, mayBeSilent = false) {
  if (!mayBeSilent) expect(g.spoken.length, at).toBeGreaterThan(0);
  const you = r.audience !== 'parent';
  for (const line of [...g.spoken, g.caption ?? '']) {
    expect(line, at).not.toMatch(/undefined|null|NaN|Infinity|\s{2}/);
    for (const sentence of line.split(/(?<=[.!?])\s+/)) expect(sentence.split(/\s+/).length, `${at}: ${sentence}`).toBeLessThanOrEqual(22);
    if (you) expect(line, at).not.toMatch(/[Çç]ocuğunuz/);
    if (r.audience === 'adult') expect(schoolWords(line), at).toEqual([]);
  }
}

function checkRoadmap(r: SimpleReport, kind: Kind, label: string) {
  const rm = r.roadmap!;
  const parent = r.audience === 'parent';
  const at = `${label} ${r.audience}`;
  // Her grafik çizilebilir: yazılar taşmaz, üst üste binmez; ekran okuyucu metninde eksik değer yok.
  for (const { where, g } of graphicsOf(rm)) {
    checkDrawn(g.visual, `${at} ${where}`);
    // Sözlü anlatımı boş olabilen grafikler: değeri rozette ya da satırda zaten okunan öneri kartları ve kısaca satırları.
    const line = rm.standout.find((s) => s.graphic === g);
    checkSpoken(g, r, `${at} ${where}`, where.startsWith('öneri') || (!!line && /\d/.test(line.text)));
  }

  // Haftalar: zaman çizelgesi her zaman vardır; adımları haftalarla aynıdır.
  const tl = rm.weeksGraphic.visual;
  expect(tl.type, at).toBe('timeline');
  if (tl.type === 'timeline') {
    expect(tl.steps.map((s) => [s.label, s.title, s.result]), at).toEqual(rm.weeks.map((w) => [w.label, w.title, w.fromResult]));
    expect(tl.legend.result, at).toBe(parent ? 'Sonuca göre seçildi' : 'Sonucuna göre seçildi');
  }
  if (parent && rm.weeks.some((w) => w.fromResult)) expect(rm.weeksGraphic.spoken.join(' '), at).toContain('çocuğunuzun sonucuna göre');
  // Zihinsel görevlerde haftaların hepsi herkes için aynıdır; ilk hafta hiçbir yol haritasında sonuca göre değildir
  // (konu taramada yanlış soruların haftası hariç).
  if (kind === 'task') expect(rm.weeks.every((w) => !w.fromResult), at).toBe(true);
  if (kind !== 'academic') expect(rm.weeks[0].fromResult, at).toBe(false);

  const rv = reportVisuals(r);
  const same = (v: ItemVisual, title: string, where: string) => {
    const found = rv.find((x) => x.title === title);
    expect(found, `${at} ${where}: raporda "${title}" kartı`).toBeDefined();
    expect(v, `${at} ${where}`).toEqual(found!.visual);
  };

  if (kind === 'likert' || kind === 'interest') {
    const keys = new Set(rm.bars.map((b) => b.key));
    for (const s of rm.standout) {
      expect(s.keys?.length, at).toBe(1);
      expect(keys.has(s.keys![0]), `${at} ${s.keys}`).toBe(true);
      const b = rm.bars.find((x) => x.key === s.keys![0])!;
      // Hesaplanan ölçeğin grafiği var, hesaplanamayanın yok.
      expect(!!s.graphic, `${at} kısaca ${s.title}`).toBe(b.value !== null);
      if (s.graphic) checkScaleValues(rm, s.graphic.visual, `${at} kısaca`);
    }
    if (rm.standout.length === 0 && rm.bars.some((b) => b.value !== null)) {
      expect(rm.standoutGraphic, `${at} kısaca notu`).toBeDefined();
      checkScaleValues(rm, rm.standoutGraphic!.visual, `${at} kısaca notu`);
    }
    for (const it of rm.study.items) {
      expect(keys.has(it.key), at).toBe(true);
      const b = rm.bars.find((x) => x.key === it.key)!;
      expect(!!it.graphic, `${at} öneri ${it.title}`).toBe(b.value !== null);
      if (it.graphic) {
        checkScaleValues(rm, it.graphic.visual, `${at} öneri`);
        // Raporun kartındaki düzey çubuğunun aynısı (kartı olan ölçekte).
        const card = rv.find((x) => x.visual.type === 'gauge' && x.visual.label === b.label);
        if (card) expect(it.graphic.visual, `${at} öneri ${it.title}`).toEqual(card.visual);
      }
    }
    if (rm.settings) {
      expect(rm.settings.keys?.every((k) => keys.has(k)), at).toBe(true);
      if (rm.settings.keys!.some((k) => rm.bars.find((b) => b.key === k)!.value !== null)) {
        expect(rm.settings.graphic, `${at} ortamlar`).toBeDefined();
        checkScaleValues(rm, rm.settings.graphic!.visual, `${at} ortamlar`);
        expect(rm.settings.graphic!.caption, at).toMatch(/^Bu bölümün dayandığı/);
      }
    }
    if (rm.approach && rm.approach.items.length > 0) {
      expect(rm.approach.keys?.every((k) => keys.has(k)), at).toBe(true);
      expect(rm.approach.items.every((it) => it.keys?.length === 1 && rm.approach!.keys!.includes(it.keys[0])), at).toBe(true);
      expect(rm.approach.graphic, `${at} yaklaşım`).toBeDefined();
      checkScaleValues(rm, rm.approach.graphic!.visual, `${at} yaklaşım`);
    }
  }

  if (kind === 'academic') {
    const notRead = r.keyFigures.find((f) => f.label === 'Genel sonuç')?.value === 'Yorumlanmadı';
    const domains = new Set(rm.study.items.map((i) => i.key));
    for (const s of rm.standout) expect(s.keys?.every((k) => k === 'overall' || domains.has(k)), at).toBe(true);
    if (notRead) {
      // Yorumlanmayan sonucun grafiği yoktur.
      expect(graphicsOf(rm).map((x) => x.where), at).toEqual(['haftalar']);
    } else {
      same(rm.standout[0].graphic!.visual, 'Genel sonuç', 'genel sonuç');
      for (const s of rm.standout.slice(1)) {
        expect(s.graphic, `${at} ${s.title}`).toBeDefined();
        const rows = s.graphic!.visual.type === 'dots' ? s.graphic!.visual.rows : [];
        expect(rows.length, at).toBe(s.keys!.length);
      }
      for (const it of rm.study.items) same(it.graphic!.visual, it.title, `öneri ${it.title}`);
      if (rm.approach) {
        expect(rm.approach.graphic, `${at} yaklaşım`).toBeDefined();
        const rows = rm.approach.graphic!.visual.type === 'dots' ? rm.approach.graphic!.visual.rows.length : 1;
        expect(rows, at).toBe(rm.approach.keys!.length);
      }
    }
    // Haftalık çalışma düzeni herkese aynıdır: sonuç grafiği yok.
    expect(rm.settings?.graphic, at).toBeUndefined();
  }

  if (kind === 'reading') {
    same(rm.standout[0].graphic!.visual, 'Anlama', 'anlama');
    const speedItem = r.items.find((it) => it.title === 'Okuma hızı')!;
    const speedRead = speedItem.badge !== 'Yorumlanmadı';
    expect(!!rm.standout[1].graphic, `${at} hız`).toBe(speedRead);
    expect(!!rm.study.items.find((i) => i.key === 'pace')!.graphic, `${at} hız ve anlama`).toBe(speedRead);
    if (speedRead && speedItem.visual?.type === 'bars' && rm.standout[1].graphic?.visual.type === 'bars') {
      // Raporun hız grafiğinin satırları; hesaplanmayan anlayarak okuma hızı yol haritasında gösterilmez.
      const computed = speedItem.visual.rows.filter((x) => x.valueLabel !== 'hesaplanmadı');
      expect(rm.standout[1].graphic.visual.rows, at).toEqual(computed);
    }
    for (const it of rm.study.items.filter((i) => i.key !== 'pace')) expect(it.graphic, `${at} ${it.title}`).toBeDefined();
    if (rm.approach) {
      expect(rm.approach.keys, at).toEqual(['comprehension']);
      same(rm.approach.graphic!.visual, 'Anlama', 'yaklaşım');
    }
    expect(rm.settings?.graphic, at).toBeUndefined();
  }

  if (kind === 'oral') {
    const byTitle: Record<string, string> = { accuracy: 'Doğru okuma', comprehension: 'Okuduğunu anlama', prosody: 'Akıcılık', retell: 'Yeniden anlatma' };
    for (const it of rm.study.items) same(it.graphic!.visual, byTitle[it.key], `öneri ${it.key}`);
    const rate = rm.standout.find((s) => s.keys?.[0] === 'rate');
    const rateItem = r.items.find((it) => it.title === 'Okuma hızı');
    if (rate) same(rate.graphic!.visual, 'Okuma hızı', 'hız');
    else expect(rateItem?.visual, at).toBeUndefined();
    const level = rm.standout[0].graphic!.visual;
    expect(level.type === 'steps' && level.steps.length === 3 && level.reached >= 1, at).toBe(true);
    if (rm.approach) expect(rm.approach.graphic?.visual, at).toEqual(level);
    expect(rm.settings?.graphic, at).toBeUndefined();
  }

  if (kind === 'task') {
    // Kısaca: raporun kartları sırayla; yorumlanmayan kartın grafiği yok, ötekiler kartın grafiğinin aynısı.
    expect(rm.standout.map((s) => s.title), at).toEqual(r.items.map((it) => it.title));
    rm.standout.forEach((s, i) => {
      expect(s.keys?.length, at).toBe(1);
      const it = r.items[i];
      if (it.badge === 'Yorumlanmadı') expect(s.graphic, `${at} ${s.title}`).toBeUndefined();
      if (s.graphic) expect(s.graphic.visual, `${at} ${s.title}`).toEqual(it.visual);
    });
    // Öneriler, bilmekte yarar olanlar ve yaklaşım herkese aynı: sonuç grafiği yok.
    expect(rm.study.items.some((i) => i.graphic) || !!rm.settings?.graphic || !!rm.approach?.graphic, at).toBe(false);
  }
}

describe('Yol haritası: her bölümün grafiği', () => {
  const slugs = publicInstruments()
    .map((d) => d.slug)
    .filter((s) => kindOf(s));

  it('yol haritası olan yayındaki her test sınanır', () => {
    expect(slugs.length).toBeGreaterThan(40);
    for (const k of ['likert', 'interest', 'academic', 'reading', 'oral', 'task'] as const) expect(slugs.some((s) => kindOf(s) === k), k).toBe(true);
  });

  for (const slug of slugs) {
    it(slug, () => {
      const kind = kindOf(slug)!;
      const reps = reportsFor(slug, kind);
      expect(reps.length, slug).toBeGreaterThan(1);
      for (const [i, r] of reps.entries()) checkRoadmap(r, kind, `${slug} #${i}`);
    }, 120_000);
  }

  it('16 özellikte dengeli profil: kısaca grafiği düzeylere göre özellik sayısı; ortam yazılmayan uçtaki özellikte "dengeli" denmez', () => {
    const slug = '16-faktorlu-kisilik-profili';
    const mid = evaluate(slug, likertBody(slug, 10, () => 2)).parent.roadmap!;
    expect(mid.standout).toEqual([]);
    const v = mid.standoutGraphic!.visual;
    expect(v.type === 'bars' && v.rows.map((x) => x.valueLabel)).toEqual(['0 / 16', '16 / 16', '0 / 16']);
    expect(mid.standoutGraphic!.spoken).toEqual(['Düşük: 0 özellik.', 'Orta: 16 özellik.', 'Yüksek: 0 özellik.']);
    expect(mid.settings!.intro).toContain('profili dengeli');
  });
});

/* ---------- PDF ---------- */

/** Yol haritası sayfaları: raporun ana sayfası kısaltılır (yalnızca başlık ve notlar), PDF hızlı üretilsin. */
const roadmapOnly = (r: SimpleReport): SimpleReport => ({ ...r, items: [], groups: undefined, chart: null, keyFigures: [], cautions: [], quiz: undefined, oral: undefined, parts: undefined, support: null });

describe.skipIf(!HAS_PDFTOTEXT)('Yol haritası: PDF\'te yazılar üst üste binmez', () => {
  const dir = mkdtempSync(join(tmpdir(), 'yh-pdf-'));
  const slugs = publicInstruments()
    .map((d) => d.slug)
    .filter((s) => kindOf(s));
  for (const slug of slugs) {
    it(slug, async () => {
      const kind = kindOf(slug)!;
      const reps = reportsFor(slug, kind);
      // Her kişi için (öğrenci, veli, yetişkin) en çok iki örüntü: ilki ve grafikleri en çok olan.
      const picked = (['student', 'parent', 'adult'] as const).flatMap((a) => {
        const of = reps.filter((r) => r.audience === a);
        if (of.length === 0) return [];
        const most = [...of].sort((x, y) => graphicsOf(y.roadmap!).length - graphicsOf(x.roadmap!).length)[0];
        return most === of[0] ? [of[0]] : [of[0], most];
      });
      for (const [i, r] of picked.entries()) {
        const file = join(dir, `${slug}-${i}.pdf`);
        writeFileSync(file, await renderSimpleReportPdf(roadmapOnly(r), 'olcekhane.com'));
        expect(pdfOverlaps(file).slice(0, 5), `${slug} ${r.audience}`).toEqual([]);
      }
    }, 120_000);
  }
});
