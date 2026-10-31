import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getInstrumentDef } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { prosodyLabel } from '@/content/reports/sesli-okuma';
import { SimpleReportView } from '@/components/test/simple-report-view';
import { evaluate } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import type { OralPassage, QuizInstrument, ReadingInstrument } from '@/lib/instruments/types';
import { MIN_MATCH_SHARE } from '@/lib/oral/auto';
import { oralTokens, oralWordCount } from '@/lib/oral/words';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { partCards, type PartCard, type ReportPart } from '@/lib/reports/parts';
import { oralSentences } from '@/lib/reports/reading-parts';
import type { SimpleReport } from '@/lib/reports/simple';
import { drawVisual } from '@/lib/reports/visual-draw';
import { cellRange, type CellsVisual, type GridVisual, type WordMapVisual } from '@/lib/reports/visual-cells';
import type { BarsVisual, GaugeVisual, MeterVisual, StackVisual, StripVisual } from '@/lib/reports/visuals';
import { MIN_LISTENED, ORAL_MAX_WPM, UNCLEAR_HIGH, UNCLEAR_MAX, oralPassagesFor, scoreOral, type OralInput, type OralMark } from '@/lib/scoring/oral';
import { QUIZ_LETTER_SHARE, QUIZ_TOO_FAST_MS, formForGrade } from '@/lib/scoring/quiz';
import { READING_TOO_SLOW, chanceLike, countWords, passageForGrade, readingPace } from '@/lib/scoring/reading';
import { MAX_UTTERANCE, reportSpeech, speakable, utterancesOf } from '@/lib/speech/report-text';
import { checkDrawn } from './helpers/visual-check';

/**
 * Okuma, sesli okuma ve konu tarama raporlarının ek bölümleri (site sahibinin 2026-10-31 isteği; lib/reports/reading-parts.ts,
 * lib/reports/quiz-parts.ts): "Düzeylerin ve ölçülerin anlamı", soru soru (sesli okumada cümle cümle) cevaplar, "Sonuca ne
 * kadar güvenebiliriz?". Her kartın kendi grafiği; kartlar raporun kendi kartlarıyla ve uyarı kutusuyla çelişmez; veli
 * raporunda da cevaplar vardır (performans); ekranda, PDF'te ve sesli dinlemede aynı içerik.
 */

const READING = getInstrumentDef('okuma-hizi-ve-anlama') as ReadingInstrument;
const QUIZ = getInstrumentDef('matematik-konu-tarama-testi') as QuizInstrument;
const ORAL = sesliOkuma;

const partOf = (r: SimpleReport, key: ReportPart['key']) => r.parts!.find((p) => p.key === key)!;
const cardOf = (r: SimpleReport, key: ReportPart['key'], card: string) => partCards(partOf(r, key)).find((c) => c.key === card);
const both = (res: { student: SimpleReport; parent: SimpleReport }) => [res.student, res.parent];

/* ---------- Okuma: cevap örüntüleri ---------- */

type ReadingCase = { grade: number; correct: number; wpm: number; skip?: number };

function readingBody(c: ReadingCase): AnswersBody {
  const p = passageForGrade(READING, c.grade);
  const words = countWords(p.paragraphs);
  const answers: Record<string, string> = {};
  p.questions.forEach((q, i) => {
    if (c.skip !== undefined && i === c.skip) return;
    answers[q.key] = i < c.correct ? q.answer : q.options.find((o) => o.key !== q.answer)!.key;
  });
  return { grade: c.grade, data: { engine: 'reading', passageKey: p.key, readingMs: Math.max(1000, Math.round((words / c.wpm) * 60_000)), answers } };
}

function readingCases(): ReadingCase[] {
  const out: ReadingCase[] = [];
  for (const grade of [3, 5, 7, 9, 13]) {
    const lim = readingPace(passageForGrade(READING, grade));
    for (const correct of [8, 6, 4, 3, 0])
      for (const wpm of [lim.slow - 10, (lim.slow + lim.fast) / 2, lim.fast + 10, lim.max + 80, READING_TOO_SLOW - 5]) out.push({ grade, correct, wpm });
  }
  out.push({ grade: 5, correct: 7, wpm: 120, skip: 7 });
  return out;
}

/* ---------- Konu tarama: cevap örüntüleri ---------- */

type QuizKind = 'right' | 'wrong' | 'dk';
function quizBody(grade: number, kind: (i: number) => QuizKind, rtMs: (i: number) => number | null = () => 40_000, letter?: 'A' | 'B' | 'C' | 'D'): AnswersBody {
  const form = formForGrade(QUIZ, grade);
  return {
    grade,
    data: {
      engine: 'quiz',
      answers: Object.fromEntries(
        form.items.map((it, i) => {
          const k = kind(i);
          const choice = letter ?? (k === 'dk' ? 'X' : k === 'right' ? it.answer : (it.options.find((o) => o.key !== it.answer)!.key as 'A' | 'B' | 'C' | 'D'));
          return [it.key, { choice, rtMs: rtMs(i) }];
        }),
      ),
    },
  };
}

const QUIZ_CASES: [string, (g: number) => AnswersBody][] = [
  ['hepsi doğru', (g) => quizBody(g, () => 'right')],
  ['üçte bir yanlış', (g) => quizBody(g, (i) => (i % 3 === 0 ? 'wrong' : 'right'))],
  ['yarısı yanlış', (g) => quizBody(g, (i) => (i % 2 ? 'wrong' : 'right'))],
  ['çoğu yanlış', (g) => quizBody(g, (i) => (i % 5 === 0 ? 'right' : 'wrong'))],
  ['bazen bilmiyorum', (g) => quizBody(g, (i) => (i % 4 === 0 ? 'dk' : i % 3 ? 'right' : 'wrong'))],
  ['yarıdan çok bilmiyorum', (g) => quizBody(g, (i) => (i < 11 ? 'dk' : 'right'))],
  ['tam yarısı bilmiyorum', (g) => quizBody(g, (i) => (i < 10 ? 'dk' : 'right'))],
  ['hepsi bilmiyorum', (g) => quizBody(g, () => 'dk')],
  ['çok hızlı', (g) => quizBody(g, (i) => (i % 2 ? 'wrong' : 'right'), () => 2000)],
  ['hep A', (g) => quizBody(g, () => 'right', () => 30_000, 'A')],
  ['süre yok', (g) => quizBody(g, (i) => (i % 3 === 0 ? 'wrong' : 'right'), () => null)],
  ['az seçenek', (g) => quizBody(g, (i) => (i < 13 ? 'dk' : 'right'), () => 2000)],
];

/* ---------- Sesli okuma: girdiler ---------- */

function oralInput(p: OralPassage, o: Partial<OralInput> = {}): OralInput {
  const words = oralWordCount(p.paragraphs);
  return {
    passageKey: p.key,
    recordMs: 120_000,
    readingMs: Math.round((words / 70) * 60_000),
    timingAuto: true,
    audio: { quality: 'good', pauses: [[1000, 1400], [5000, 6200], [9000, 12_500], [15_000, 15_300]], speechMs: 40_000, contour: Array.from({ length: 60 }, (_, i) => (i * 7) % 100), interrupted: false },
    marks: {},
    listened: 1,
    retell: { recorded: true, ideas: p.ideas.filter((_, i) => i % 2 === 0).map((x) => x.key) },
    answers: Object.fromEntries(p.questions.map((q, i) => [q.key, i === 1 ? q.options.find((o) => o.key !== q.answer)!.key : q.answer])),
    prosody: { expression: 3, phrasing: 2, smoothness: 3, pace: 3 },
    ...o,
  };
}

const autoOf = (i: OralInput, marks: Record<string, OralMark> = i.marks): OralInput => {
  const out: OralInput = { ...i, auto: true, prosody: null, retell: null, marks };
  delete out.listened;
  return out;
};

/** Karışık işaretler: yanlış okuma (söylenenle ve söylenmeden), atlama, yardım, kendi düzeltme, gözlemler, ekleme. */
function mixedMarks(n: number, auto = false): Record<string, OralMark> {
  const m: Record<string, OralMark> = {};
  for (let i = 1; i < n - 4; i += 7) {
    const k = (i / 7) % 6;
    m[String(i)] =
      k === 0
        ? { s: 'sub', said: 'kelime' }
        : k === 1
          ? { s: 'omit' }
          : k === 2
            ? auto
              ? { s: 'unclear' }
              : { s: 'help' }
            : k === 3
              ? { s: 'self', rep: true }
              : k === 4
                ? { hes: true, syl: true, ins: 2 }
                : { s: 'sub', kind: 'suffix', meaning: true };
  }
  return m;
}

const trailing = (n: number, k: number): Record<string, OralMark> => Object.fromEntries(Array.from({ length: k }, (_, i) => [String(n - 1 - i), { s: 'omit' as const }]));

interface OralCase {
  name: string;
  grade: number;
  input: OralInput;
}

function oralCases(): OralCase[] {
  const out: OralCase[] = [];
  for (const grade of [1, 2, 3, 5, 7, 8]) {
    const own = ORAL.passages.find((p) => p.grade === grade)!;
    const n = oralWordCount(own.paragraphs);
    const base = oralInput(own);
    out.push(
      { name: 'olağan', grade, input: base },
      { name: 'karışık işaretler', grade, input: { ...base, marks: mixedMarks(n) } },
      { name: 'metin bitmeden (az)', grade, input: { ...base, marks: trailing(n, 5) } },
      { name: 'metin bitmeden (yarıdan çok)', grade, input: { ...base, marks: trailing(n, Math.ceil(n * 0.6)) } },
      { name: 'kesinti', grade, input: { ...base, audio: { ...base.audio!, interrupted: true } } },
      { name: 'düğmeyle süre', grade, input: { ...base, timingAuto: false } },
      { name: 'çok hızlı', grade, input: { ...base, readingMs: Math.max(1000, Math.round((n / (ORAL_MAX_WPM + 40)) * 60_000)), timingAuto: false } },
      { name: 'yavaş', grade, input: { ...base, readingMs: Math.round((n / 25) * 60_000) } },
      { name: 'yarım dinleme', grade, input: { ...base, listened: 0.5 } },
      { name: 'ses yok', grade, input: { ...base, audio: null, retell: null } },
      { name: 'akıcılık düşük', grade, input: { ...base, prosody: { expression: 1, phrasing: 2, smoothness: 2, pace: 1 }, retell: { recorded: true, ideas: own.ideas.map((x) => x.key) } } },
      { name: 'otomatik', grade, input: autoOf(base) },
      { name: 'otomatik karışık', grade, input: autoOf(base, mixedMarks(n, true)) },
      {
        name: 'otomatik net değil çok',
        grade,
        input: autoOf(base, Object.fromEntries(Array.from({ length: Math.floor(n * (UNCLEAR_HIGH + 0.05)) }, (_, i) => [String(i), { s: 'unclear' as const }]))),
      },
    );
  }
  // Bir alt sınıfın metni, yavaş: hız sınıf ortalamasıyla karşılaştırılmaz ama "çoğundan az" söylenir.
  const lower = ORAL.passages.find((p) => p.grade === 2)!;
  out.push({ name: 'alt sınıf metni, yavaş', grade: 3, input: oralInput(lower, { readingMs: Math.round((oralWordCount(lower.paragraphs) / 30) * 60_000) }) });
  return out;
}

const oralReports = (c: OralCase) => both(evaluate(ORAL.slug, { grade: c.grade, data: { engine: 'oral', ...c.input } }));

/* ---------- Ortak denetimler ---------- */

/** Bölümün kendi metinleri (soru, seçenek, cümle ve fikir metinleri hariç: onlar testin içeriğidir). */
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
      c.activeLabel ?? '',
      ...(c.spoken ?? []),
      ...(c.levels ?? []).flatMap((l) => [l.label, l.text, l.spoken ?? '']),
      ...(c.rows ?? []).flatMap((r) => r.tags.filter((t) => !t.startsWith('doğru cevap:') && !t.startsWith('hata türü:') && !t.includes('“'))),
    ]),
  ].filter(Boolean);
}

/** Cümleler; tırnak içindeki ifade tek sözcük sayılır, kaynak gösterimi sayılmaz. */
function sentences(text: string): string[] {
  return text
    .replace(/“[^”]*”/g, 'X')
    .replace(/\s*\([^()]*\d{4}\)/g, '')
    .split(/(?<=[.!?])\s+(?=[\p{Lu}\d“])/u)
    .filter((s) => s.trim());
}

function checkLanguage(r: SimpleReport, label: string, oral: boolean) {
  for (const p of r.parts!) {
    const texts = ownTexts(p);
    const joined = texts.join(' ');
    const at = `${label} ${p.key}`;
    expect(joined, at).not.toMatch(/(?<!\p{L})(?:tanı|teşhis|IQ|hastalık|bozukluk|disleksi)(?!\p{L})/iu);
    expect(joined, at).not.toMatch(/norm|zekâ puanı/i);
    if (r.audience === 'parent') {
      expect(joined, at).not.toMatch(/(?<!\p{L})(?:senin|sen|verdiğin|dedin|cevapladın|okudun|okuduğun|okuman|ayırdığın|indirdiğin|çözersen|söyledin)(?!\p{L})/iu);
      // Sesli okumanın veli ve öğretmen raporu öğrenciden üçüncü kişi olarak söz eder.
      if (oral) expect(joined, at).not.toMatch(/çocuğunuz/i);
    } else {
      expect(joined, at).not.toMatch(/çocuğunuz|(?<!\p{L})öğrencinin(?!\p{L})/iu);
    }
    // Sıfır ve bir sözle: "0 soru", "1 hata" yazılmaz (grafikteki sayılar ve aralıklar hariç).
    expect(joined.replace(/\d+\/\d+ doğru/g, ''), at).not.toMatch(/(?<![\d,/–-])[01] (?:soru|kelime|hata|fikir|duraklama|cümle|ekleme)(?!\p{L})/u);
    for (const t of texts)
      for (const s of sentences(t)) {
        const words = s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
        expect(words, `${at}: ${s}`).toBeLessThanOrEqual(22);
      }
    // Grafikteki kişinin değeri kartın metninde yinelenmez.
    for (const c of partCards(p)) {
      if (!c.visual || !c.text) continue;
      const own = personValues(c);
      for (const n of own) expect(c.text, `${at} ${c.title}: ${n}`).not.toMatch(new RegExp(`(?<![\\d,])${n}(?![\\d,])`));
    }
  }
}

/** Grafikte kişinin değeri olarak yazan sayılar (2 ve üstü; yıllar hariç). */
function personValues(c: PartCard): string[] {
  const v = c.visual!;
  const labels: string[] =
    v.type === 'gauge' || v.type === 'cells'
      ? [v.valueLabel]
      : v.type === 'meter'
        ? v.rows.map((r) => r.valueLabel)
        : v.type === 'bars'
          ? v.rows.map((r) => r.valueLabel)
          : v.type === 'strip'
            ? [v.marker?.label ?? '']
            : v.type === 'stack'
              ? v.parts.map((p) => String(p.value))
              : [];
  return [...new Set(labels.flatMap((l) => l.match(/\d+(?:,\d+)?/g) ?? []))].filter((n) => Number(n.replace(',', '.')) >= 2);
}

/** Sesli okuma: ek bölümler eksiksiz, okunuşa uygun; notlar okunmaz; bölüm tek "geçilebilir" bölüm. */
/** Sesli okunan metin: sayıdan sonraki nokta parçanın sonunda okunmaz (sıra sayısı gibi okunmasın); karşılaştırmada yok sayılır. */
const plain = (t: string) => t.replace(/(\d)\./g, '$1');

function checkSpeech(r: SimpleReport, label: string) {
  const utter = utterancesOf(reportSpeech(r).results);
  const text = plain(utter.map((u) => u.text).join(' '));
  const titles = new Set(r.parts!.map((p) => p.title.replace(/[.:?]$/, '')));
  for (const u of utter) {
    const at = `${label}: ${u.text}`;
    expect(u.text.length, at).toBeLessThanOrEqual(MAX_UTTERANCE);
    expect(u.text, at).not.toMatch(/[%“”"→←·°×≥≤{}/÷□]|\bsn\b|\bve ark\.|\((?=[^)]*\b(?:19|20)\d{2}\b)[^)]*\)|\s[=+]\s|\([A-ZÇĞİÖŞÜ]{1,2}\)/u);
    expect(u.text, at).not.toMatch(/\d\.$/);
  }
  // Ek bölümlerde grafiğin görünüşünü anlatan cümleler okunmaz.
  // (Soru, seçenek, cümle ve fikir metinleri testin içeriğidir: "Kırmızı bir atkı" okunur.)
  const content = r.parts!.flatMap((p) => partCards(p).flatMap((c) => (c.rows ?? []).flatMap((x) => [x.text, x.value, ...x.tags]))).map((x) => plain(speakable(x)).replace(/[.!?]$/, ''))
    // Uzunlar önce: kısa bir etiket ("doğru") uzun bir etiketin parçasını silmesin.
    .sort((a, b) => b.length - a.length);
  const low = (t: string) => t.toLocaleLowerCase('tr-TR');
  const own = content.reduce((t, x) => t.split(low(x)).join(' '), low(plain(utter.filter((u) => u.section && titles.has(u.section)).map((u) => u.text).join(' '))));
  const seen = own.match(/(?<!\p{L})(?:kırmızı|sarı bant|kesikli|renkli bölge|dolu kutu|vurgulu)(?!\p{L})/iu);
  expect(seen ? own.slice(Math.max(0, seen.index! - 80), seen.index! + 40) : undefined, label).toBeUndefined();
  for (const p of r.parts!) {
    const title = p.title.replace(/[.:?]$/, '');
    const mine = utter.filter((u) => u.section === title);
    expect(mine.length, `${label} ${p.key}`).toBeGreaterThan(0);
    for (const c of partCards(p)) {
      expect(mine.some((u) => u.segment === c.title), `${label} ${c.title}`).toBe(true);
      for (const s of c.spoken ?? []) expect(text, `${label} ${s}`).toContain(plain(speakable(s)).replace(/\.$/, ''));
      if (c.note) expect(text, label).not.toContain(speakable(c.note).slice(0, 30));
      for (const row of c.rows ?? []) {
        if (row.spoken === undefined) expect(text, `${label} ${row.text}`).toContain(plain(speakable(row.text)).replace(/[.!?]$/, ''));
        else expect(text, `${label} ${row.text}`).not.toContain(plain(speakable(row.text)).slice(0, 30));
        expect(text, `${label} ${row.value}`).toContain(plain(speakable(row.value)).replace(/[.!?]$/, ''));
      }
      if (c.levels?.some((l) => l.active)) expect(text, label).toContain(plain(speakable(`${c.activeLabel ?? (r.audience === 'parent' ? 'Çocuğunuzun düzeyi' : 'Senin düzeyin')}: ${c.badge}`)));
    }
  }
}

function checkVisuals(r: SimpleReport, label: string) {
  expect(r.parts?.map((p) => p.key), label).toEqual(['levels', 'answers', 'quality']);
  for (const p of r.parts!) {
    expect(p.intro, label).toBeTruthy();
    for (const c of partCards(p)) if (c.visual) checkDrawn(c.visual, `${label} ${p.key} ${c.title}`);
  }
  const answers = partOf(r, 'answers');
  expect([answers.collapsed, answers.appendix], label).toEqual([true, true]);
  // Soru soru kartlarının hepsinin grafiği var; denetimlerde grafiksiz kart yalnızca denetim yapılamadıysa.
  for (const c of partCards(answers)) expect(c.visual, `${label} ${c.title}`).toBeDefined();
  for (const c of partCards(partOf(r, 'quality'))) if (c.status !== 'none') expect(c.visual, `${label} ${c.title}`).toBeDefined();
}

/* ======================= Okuma ======================= */

describe('Okuma Hızı ve Anlama: ek bölümler', () => {
  it('bütün sınıflarda ve örüntülerde üç bölüm, grafikleri taşmaz; dil, sesli okuma', () => {
    let n = 0;
    for (const c of readingCases()) {
      const res = evaluate(READING.slug, readingBody(c));
      for (const r of both(res)) {
        const label = `okuma ${c.grade} ${c.correct} ${Math.round(c.wpm)} ${r.audience}`;
        checkVisuals(r, label);
        checkLanguage(r, label, false);
        checkSpeech(r, label);
        n++;
      }
    }
    expect(n).toBeGreaterThan(200);
  }, 240_000);

  it('Düzeylerin ve ölçülerin anlamı: anlama ve hız raporun kartlarıyla aynı; sınırlar testin kendi ölçütleri', () => {
    for (const c of readingCases()) {
      for (const r of both(evaluate(READING.slug, readingBody(c)))) {
        const label = `okuma ${c.grade} ${c.correct} ${Math.round(c.wpm)} ${r.audience}`;
        const p = passageForGrade(READING, c.grade);
        const lim = readingPace(p);
        const x = r.items.find((i) => i.title === 'Anlama')!;
        const comp = cardOf(r, 'levels', 'comprehension')!;
        const cells = comp.visual as CellsVisual;
        expect(comp.badge, label).toBe(x.badge);
        expect(cells.zones[cells.active!].label, label).toBe(x.badge);
        expect(comp.levels!.filter((l) => l.active).map((l) => l.label), label).toEqual([x.badge]);
        expect(cells.value, label).toBe((x.visual as { rows: { filled: number }[] }).rows[0].filled);
        // Sınırlar: tam sayı aralıkları boşluksuz ve testin eşikleriyle (%50, %75, hepsi).
        expect(cells.zones.map(cellRange), label).toEqual(['0–3', '4–5', '6–7', '8']);
        const speed = cardOf(r, 'levels', 'speed')!;
        const g = speed.visual as GaugeVisual;
        expect(g.zones.slice(1).map((z) => z.from), label).toEqual([lim.slow, lim.fast, lim.max]);
        const main = r.items.find((i) => i.title === 'Okuma hızı')!;
        expect(speed.badge, label).toBe(main.badge);
        const tooSlow = r.cautions.some((s) => s.startsWith('Okuma süresi çok uzun ölçüldü'));
        const tooFast = r.cautions.some((s) => s.startsWith('Metin çok hızlı geçilmiş'));
        expect(g.active === null, label).toBe(tooSlow);
        if (tooFast) expect(g.zones[g.active!].label, label).toBe('Çok hızlı');
        if (!tooFast && !tooSlow) expect(g.zones[g.active!].label, label).toBe(g.value! < lim.slow ? 'Yavaş' : g.value! < lim.fast ? 'Olağan' : 'Hızlı');
        const eff = cardOf(r, 'levels', 'effective')!;
        expect(eff.badge === 'Hesaplanmadı', label).toBe(r.keyFigures[2].value === '—');
      }
    }
  });

  it('Cevaplar soru soru: her soru, verilen ve doğru cevap, türü; veli raporunda da (performans)', () => {
    for (const c of [{ grade: 3, correct: 5, wpm: 90 }, { grade: 9, correct: 7, wpm: 200, skip: 7 }]) {
      const body = readingBody(c);
      const p = passageForGrade(READING, c.grade);
      const answers = body.data.engine === 'reading' ? body.data.answers : {};
      for (const r of both(evaluate(READING.slug, body))) {
        const card = cardOf(r, 'answers', 'questions')!;
        expect(card.rows!.map((x) => x.text)).toEqual(p.questions.map((q) => q.text));
        p.questions.forEach((q, i) => {
          const row = card.rows![i];
          const chosen = answers[q.key];
          if (chosen === undefined) expect([row.value, row.muted]).toEqual(['Cevaplanmadı', true]);
          else expect(row.value).toBe(q.options.find((o) => o.key === chosen)!.text);
          expect(row.tags.includes('doğru')).toBe(chosen === q.answer);
          expect(row.tags.includes(`doğru cevap: ${q.options.find((o) => o.key === q.answer)!.text}`)).toBe(chosen !== q.answer);
        });
        const grid = card.visual as GridVisual;
        expect(grid.rows.flatMap((x) => x.cells).length).toBe(p.questions.length);
        expect(grid.rows.flatMap((x) => x.cells).filter((x) => x.mark === 'on').length).toBe(r.keyFigures[0].value.split('/').map(Number)[0]);
        expect(card.rowsHead!.value).toBe(r.audience === 'parent' ? 'Verilen cevap' : 'Cevabın');
      }
    }
  });

  it('Sonuca ne kadar güvenebiliriz: uyarı kutusuyla ve anlama kartıyla aynı sınırlar', () => {
    const seen = new Set<string>();
    for (const c of readingCases()) {
      for (const r of both(evaluate(READING.slug, readingBody(c)))) {
        for (const k of partCards(partOf(r, 'quality'))) seen.add(`${k.key} ${k.status}`);
        const label = `okuma ${c.grade} ${c.correct} ${Math.round(c.wpm)} ${r.audience}`;
        const warn = (k: string) => cardOf(r, 'quality', k)!.status === 'warn';
        expect(warn('fast'), label).toBe(r.cautions.some((s) => s.startsWith('Metin çok hızlı geçilmiş')));
        expect(warn('slow'), label).toBe(r.cautions.some((s) => s.startsWith('Okuma süresi çok uzun ölçüldü')));
        const comp = r.items.find((i) => i.title === 'Anlama')!;
        expect(warn('chance'), label).toBe(/rastgele işaretle/.test(comp.text));
        expect(warn('chance'), label).toBe(chanceLike(c.skip === undefined ? c.correct : Math.min(c.correct, c.skip), 8));
        // Grafiğin bölgeleri denetimin sınırıyla aynı: kişinin değeri "Dikkat" bölgesindeyse kart da "Dikkat".
        const meter = cardOf(r, 'quality', 'chance')!.visual as MeterVisual;
        const inWarn = meter.zones.find((z) => meter.rows[0].value >= z.from && meter.rows[0].value < z.to + (z === meter.zones.at(-1) ? 1 : 0))!.warn;
        expect(inWarn, label).toBe(warn('chance'));
        if (r.cautions.some((s) => s.startsWith('Hiçbir soru doğru'))) expect(cardOf(r, 'quality', 'chance')!.text, label).toContain('Hiçbir soru doğru değil');
        if (r.cautions.some((s) => s.startsWith('Metin çok kısa sürede geçildiği hâlde'))) expect(cardOf(r, 'quality', 'fast')!.text, label).toContain('önceden');
        const intro = partOf(r, 'levels').intro;
        expect(intro.includes('“Dikkat”'), label).toBe(warn('fast') || warn('slow') || warn('chance'));
      }
    }
    // Örüntüler her denetimin iki durumunu da dener.
    expect([...seen].sort()).toEqual(['chance ok', 'chance warn', 'fast ok', 'fast warn', 'slow ok', 'slow warn']);
  });
});

/* ======================= Konu tarama ======================= */

describe('Matematik Konu Tarama: ek bölümler', () => {
  it('bütün formlarda ve örüntülerde üç bölüm, grafikleri taşmaz; dil, sesli okuma', () => {
    let n = 0;
    for (const grade of [5, 6, 7, 8])
      for (const [name, make] of QUIZ_CASES) {
        for (const r of both(evaluate(QUIZ.slug, make(grade)))) {
          const label = `matematik ${grade} ${name} ${r.audience}`;
          checkVisuals(r, label);
          checkLanguage(r, label, false);
          checkSpeech(r, label);
          n++;
        }
      }
    expect(n).toBe(96);
  }, 240_000);

  it('Düzeylerin anlamı: genel sonuç ve alanlar raporun kartlarıyla aynı; yorumlanmayınca grafik ve düzey yok', () => {
    for (const grade of [5, 8])
      for (const [name, make] of QUIZ_CASES) {
        for (const r of both(evaluate(QUIZ.slug, make(grade)))) {
          const label = `matematik ${grade} ${name} ${r.audience}`;
          const total = cardOf(r, 'levels', 'total')!;
          const main = r.items.find((i) => i.title === 'Genel sonuç')!;
          expect(total.badge, label).toBe(main.badge);
          if (main.visual) {
            expect(total.visual, label).toEqual(main.visual);
            expect(total.levels!.filter((l) => l.active).map((l) => l.label), label).toEqual([main.badge]);
          } else {
            expect([total.visual, total.levels!.some((l) => l.active)], label).toEqual([undefined, false]);
          }
          const domains = cardOf(r, 'levels', 'domains')!;
          if (main.visual) {
            const rows = (domains.visual as { rows: { label: string; value: number }[] }).rows;
            for (const row of rows) {
              const item = r.items.find((i) => i.title === row.label)!;
              expect(row.value, `${label} ${row.label}`).toBe((item.visual as { rows: { filled: number }[] }).rows[0].filled);
            }
          } else expect(domains.visual, label).toBeUndefined();
          const kinds = cardOf(r, 'levels', 'kinds')!.visual as StackVisual;
          expect(kinds.parts.reduce((s, p) => s + p.value, 0), label).toBe(20);
          expect(String(kinds.parts[2].value), label).toBe(r.keyFigures[1].value);
          expect(!!cardOf(r, 'levels', 'errors'), label).toBe((r.quiz?.errors.length ?? 0) > 0);
        }
      }
  });

  it('Cevaplar soru soru: bütün sorular alan alan; verilen ve doğru cevap, hata türü, süre; soru metni sesli okunmaz', () => {
    const body = quizBody(6, (i) => (i % 4 === 0 ? 'dk' : i % 3 ? 'right' : 'wrong'));
    const form = formForGrade(QUIZ, 6);
    for (const r of both(evaluate(QUIZ.slug, body))) {
      const cards = partCards(partOf(r, 'answers'));
      expect(cards.map((c) => c.title)).toEqual(form.domains.map((d) => d.name));
      const rows = cards.flatMap((c) => c.rows!);
      expect(rows.map((x) => x.no)).toEqual(form.items.map((_, i) => i + 1));
      form.items.forEach((it, i) => {
        const row = rows[i];
        const a = body.data.engine === 'quiz' ? body.data.answers[it.key] : undefined;
        expect(row.text).toBe(it.text);
        expect(row.spoken).toBe('');
        if (a?.choice === 'X') expect([row.value, row.muted]).toEqual(['“Bilmiyorum”', true]);
        else expect(row.value).toBe(`${a!.choice}) ${it.options.find((o) => o.key === a!.choice)!.text}`);
        expect(row.tags).toContain('40 sn');
        const review = r.quiz!.questions.find((q) => q.no === i + 1);
        if (review) {
          expect(row.tags).toContain(`doğru cevap: ${review.answer}`);
          if (review.misconception) expect(row.tags).toContain(`hata türü: ${review.misconception}`);
        } else expect(row.tags[0]).toBe('doğru');
      });
      // Grafik: alanın soruları sırayla; dolu kutu doğru, çerçeveli yanlış, gri "Bilmiyorum".
      for (const c of cards) {
        const g = c.visual as GridVisual;
        expect(g.rows[0].cells.map((x) => Number(x.text))).toEqual(c.rows!.map((x) => x.no));
        expect(g.rows[0].cells.map((x) => x.mark)).toEqual(c.rows!.map((x) => (x.tags[0] === 'doğru' ? 'on' : x.value === '“Bilmiyorum”' ? 'skip' : 'off')));
      }
      // Çözümler yinelenmez: yukarıdaki incelemeye gönderilir.
      expect(partOf(r, 'answers').intro).toContain('çözümleri yukarıda');
      for (const q of r.quiz!.questions) expect(JSON.stringify(r.parts), q.explain.slice(0, 20)).not.toContain(q.explain.slice(0, 40));
    }
  });

  it('Sonuca ne kadar güvenebiliriz: uyarı kutusuyla aynı (hız, aynı seçenek, "Bilmiyorum")', () => {
    const seen = new Set<string>();
    for (const grade of [5, 6, 7, 8])
      for (const [name, make] of QUIZ_CASES) {
        for (const r of both(evaluate(QUIZ.slug, make(grade)))) {
          for (const k of partCards(partOf(r, 'quality'))) seen.add(`${k.key} ${k.status}`);
          const label = `matematik ${grade} ${name} ${r.audience}`;
          const card = (k: string) => cardOf(r, 'quality', k)!;
          const has = (s: string) => r.cautions.some((x) => x.startsWith(s));
          expect(card('speed').status === 'warn', label).toBe(has('Sorular çok hızlı cevaplanmış'));
          expect(card('letter').status === 'warn', label).toBe(has('Cevapların çoğu aynı seçenekte'));
          expect(card('dontknow').status === 'warn', label).toBe(has('Bütün sorularda “Bilmiyorum”') || has('Soruların yarısından çoğunda “Bilmiyorum”'));
          if (card('speed').status !== 'none') {
            const v = card('speed').visual as StripVisual;
            expect(v.zone!.to, label).toBe(QUIZ_TOO_FAST_MS / 1000);
          }
          if (card('letter').status !== 'none') {
            const v = card('letter').visual as MeterVisual;
            expect(v.zones[1].from, label).toBe(QUIZ_LETTER_SHARE * 100);
            expect(v.rows[0].value >= v.zones[1].from, label).toBe(card('letter').status === 'warn');
          }
          const dk = card('dontknow').visual as MeterVisual;
          expect(dk.rows[0].value > dk.zones[0].to, label).toBe(card('dontknow').status === 'warn');
          if (name === 'süre yok') expect(card('speed').status, label).toBe('none');
          if (name === 'az seçenek') expect([card('speed').status, card('letter').status], label).toEqual(['none', 'none']);
        }
      }
    expect([...seen].sort()).toEqual(['dontknow ok', 'dontknow warn', 'letter none', 'letter ok', 'letter warn', 'speed none', 'speed ok', 'speed warn']);
  });
});

/* ======================= Sesli okuma ======================= */

describe('Sesli Okuma Değerlendirmesi: ek bölümler', () => {
  it('bütün örüntülerde (yetişkinin işaretlediği ve otomatik analiz) üç bölüm, grafikleri taşmaz; dil, sesli okuma', () => {
    let n = 0;
    for (const c of oralCases()) {
      for (const r of oralReports(c)) {
        const label = `sesli ${c.grade} ${c.name} ${r.audience}`;
        checkVisuals(r, label);
        checkLanguage(r, label, true);
        checkSpeech(r, label);
        n++;
      }
    }
    expect(n).toBeGreaterThan(160);
  }, 240_000);

  it('metnin cümleleri bütün kelimeleri kapsar; konuşma cümlesi tek cümledir', () => {
    for (const p of ORAL.passages) {
      const tokens = oralTokens(p.paragraphs);
      const s = oralSentences(p, tokens.map((para) => para.map((t) => ({ text: t.text }))));
      expect(s.flat().map((w) => w.i), p.key).toEqual(tokens.flat().map((t) => t.i));
      for (const sent of s) expect(/[.!?…]["”’»)]*$/u.test(sent[sent.length - 1].text) || sent === s[s.length - 1], `${p.key}: ${sent.map((w) => w.text).join(' ')}`).toBe(true);
    }
    const demo = { paragraphs: ['“Hadi!” dedi Ali. Sonra koştu. “Bekle!” Ayşe güldü.'] };
    const marked = oralTokens(demo.paragraphs).map((para) => para.map((t) => ({ text: t.text })));
    expect(oralSentences(demo, marked).map((x) => x.map((w) => w.text).join(' '))).toEqual(['“Hadi!” dedi Ali.', 'Sonra koştu.', '“Bekle!”', 'Ayşe güldü.']);
  });

  it('Düzeylerin ve ölçülerin anlamı: raporun kartlarıyla aynı düzeyler, eşikler ve karşılaştırma', () => {
    for (const c of oralCases()) {
      const result = scoreOral(ORAL, c.grade, c.input);
      for (const r of oralReports(c)) {
        const label = `sesli ${c.grade} ${c.name} ${r.audience}`;
        const acc = cardOf(r, 'levels', 'accuracy')!;
        const main = r.items.find((i) => i.title === 'Doğru okuma')!;
        expect(acc.visual, label).toEqual(main.visual);
        expect(acc.badge, label).toBe(main.badge);
        expect(acc.activeLabel, label).toBe(r.audience === 'parent' ? 'Öğrencinin düzeyi' : undefined);
        const comp = cardOf(r, 'levels', 'comprehension')!;
        expect(comp.badge, label).toBe(r.items.find((i) => i.title === 'Okuduğunu anlama')!.badge);
        const cv = comp.visual as CellsVisual;
        expect(cv.zones[cv.active!].label, label).toBe(comp.badge);
        const rate = cardOf(r, 'levels', 'rate')!;
        const rateItem = r.items.find((i) => i.title === 'Okuma hızı')!;
        if (result.flags.tooFast) expect([rate.badge, rate.visual], label).toEqual(['Hesaplanmadı', undefined]);
        else {
          expect(rate.badge, label).toBe(rateItem.badge);
          // Sınıf ortalamasıyla karşılaştırma yalnızca raporun hız kartı da karşılaştırıyorsa.
          const compared = !!(rateItem.visual as BarsVisual).reference;
          expect(rate.visual!.type, label).toBe(compared ? 'strip' : 'bars');
          if (compared) {
            const ref = ORAL.referenceRates.find((x) => x.grade === c.grade)!;
            const s = rate.visual as StripVisual;
            expect([s.zone!.from, s.zone!.to, s.reference!.value, s.marker!.value], label).toEqual([Math.max(0, ref.wpm - ref.sd), ref.wpm + ref.sd, ref.wpm, result.wcpm]);
            expect(rate.text!.includes('çoğundan az'), label).toBe(result.fluency.slowRate);
            expect(partOf(r, 'levels').sources?.[0].text, label).toMatch(/^Erden/);
          }
          if (result.fluency.slowRate) expect(rate.text, label).toContain('çoğundan az');
        }
        const prosody = cardOf(r, 'levels', 'prosody');
        expect(!!prosody, label).toBe(!!result.prosody);
        if (prosody) {
          expect(prosody.badge, label).toBe(prosodyLabel(result.prosody!.total));
          expect((prosody.visual as CellsVisual).zones.map(cellRange), label).toEqual(['4–7', '8–12', '13–16']);
        }
        const retell = cardOf(r, 'levels', 'retell');
        expect(!!retell, label).toBe(!!result.retell && !result.flags.auto);
        if (retell) {
          const t = result.retell!;
          const text = r.items.find((i) => i.title === 'Yeniden anlatma')!.text;
          const label2 = retell.badge;
          if (t.core === t.coreTotal) expect(label2).toBe('Temel fikirlerin hepsi');
          else if (t.core * 2 >= t.coreTotal) expect([label2, text.includes('ana hatlarını')], label).toEqual(['Ana hatlar', true]);
          else expect(label2, label).toBe('Temel fikirlerin azı');
        }
        expect(!!cardOf(r, 'levels', 'pauses'), label).toBe(!!result.pauses);
      }
    }
  });

  it('Okuma ve cevaplar tek tek: metin haritası, işaretli cümleler, sorular, fikirler; net anlaşılamadı hata sayılmaz', () => {
    for (const c of oralCases()) {
      const result = scoreOral(ORAL, c.grade, c.input);
      const p = ORAL.passages.find((x) => x.key === c.input.passageKey)!;
      for (const r of oralReports(c)) {
        const label = `sesli ${c.grade} ${c.name} ${r.audience}`;
        const text = cardOf(r, 'answers', 'text')!;
        const map = text.visual as WordMapVisual;
        const words = map.rows.flatMap((x) => x.words);
        expect(words.length, label).toBe(result.wordCount);
        // Hata sayılan kelimeler ve eklemeler, raporun hata sayısıyla aynı.
        const errs = words.filter((w) => w.mark === 'error').length + words.reduce((k, w) => k + (w.ins ?? 0), 0);
        expect(errs, label).toBe(result.errors);
        expect(words.filter((w) => w.mark === 'unclear').length, label).toBe(result.counts.unclear);
        const rowErrors = (text.rows ?? []).reduce((k, x) => k + (x.value === 'Hata yok' ? 0 : x.value === 'Bir hata' ? 1 : Number(x.value.split(' ')[0])), 0);
        expect(rowErrors, label).toBe(result.errors);
        // İşaretsiz cümleler listede yok; işaretli her cümle var.
        const marked = map.rows.filter((x) => x.words.some((w) => w.mark !== 'ok' || w.ins)).map((x) => Number(x.label));
        expect((text.rows ?? []).map((x) => x.no), label).toEqual(marked);
        for (const row of text.rows ?? []) expect(row.tags.length, label).toBeGreaterThan(0);
        if (result.counts.unclear) expect(text.rows!.some((x) => x.tags.some((t) => t.endsWith('net anlaşılamadı'))), label).toBe(true);
        // Sorular.
        const qs = cardOf(r, 'answers', 'questions')!;
        expect(qs.rows!.map((x) => x.text), label).toEqual(p.questions.map((q) => q.text));
        expect(qs.rows!.filter((x) => x.tags[0] === 'doğru').length, label).toBe(result.comprehension.correct);
        // Yeniden anlatma yalnızca yetişkinin işaretlediği sürümde; söylenen fikirler raporla aynı.
        const ideas = cardOf(r, 'answers', 'retell');
        expect(!!ideas, label).toBe(!!result.retell && !result.flags.auto);
        if (ideas) {
          expect(ideas.rows!.map((x) => x.text), label).toEqual(p.ideas.map((x) => x.text));
          expect(ideas.rows!.filter((x) => !x.muted).length, label).toBe(result.retell!.mentioned.length);
          expect(ideas.rows!.filter((x) => x.tags[0] === 'temel fikir').length, label).toBe(result.retell!.coreTotal);
        }
      }
    }
  });

  it('Sonuca ne kadar güvenebiliriz: uyarı kutusuyla aynı (net anlaşılamadı, dinleme, süre, metnin sonu)', () => {
    const seen = new Set<string>();
    for (const c of oralCases()) {
      const result = scoreOral(ORAL, c.grade, c.input);
      for (const r of oralReports(c)) {
        for (const k of partCards(partOf(r, 'quality'))) seen.add(`${k.key} ${k.status}`);
        const label = `sesli ${c.grade} ${c.name} ${r.audience}`;
        const card = (k: string) => cardOf(r, 'quality', k);
        const has = (...s: string[]) => r.cautions.some((x) => s.some((y) => x.startsWith(y)));
        expect(!!card('unclear'), label).toBe(result.flags.auto);
        expect(!!card('listen'), label).toBe(!result.flags.auto);
        if (card('unclear')) {
          expect(card('unclear')!.status === 'warn', label).toBe(has('Yapay zekâ metindeki'));
          const v = card('unclear')!.visual as MeterVisual;
          expect([v.zones[1].from, v.zones[2].from], label).toEqual([UNCLEAR_HIGH * 100, UNCLEAR_MAX * 100]);
          expect(card('unclear')!.text, label).toContain(`%${Math.round(MIN_MATCH_SHARE * 100)}`);
        }
        if (card('listen')) {
          expect(card('listen')!.status === 'warn', label).toBe(has('İşaretleme yapılırken kaydın tamamı', 'Kaydının tamamı dinlenmeden'));
          expect((card('listen')!.visual as MeterVisual).zones[0].to, label).toBe(MIN_LISTENED * 100);
        }
        expect(card('timing')!.status === 'warn', label).toBe(
          has('Kayıt sırasında bir kesinti', 'Okuma süresi metnin uzunluğuna göre', 'Okuma süren metnin uzunluğuna göre', 'Kayıtta okumanın başı', 'Okuma süren, düğmelere'),
        );
        expect(card('finish')!.status === 'warn', label).toBe(has('Metnin son'));
        expect(((card('finish')!.visual as StackVisual).parts[1].value), label).toBe(result.unread);
      }
    }
    expect([...seen].sort()).toEqual(['finish ok', 'finish warn', 'listen ok', 'listen warn', 'timing ok', 'timing warn', 'unclear ok', 'unclear warn']);
  });

  it('ekranda: bölümler destek kutusundan sonra, notlardan önce; yeniden anlatma listesi yalnızca ek bölümde', () => {
    const c = oralCases().find((x) => x.name === 'karışık işaretler' && x.grade === 3)!;
    for (const r of oralReports(c)) {
      const html = renderToStaticMarkup(createElement(SimpleReportView, { report: r }));
      const at = (s: string) => html.indexOf(s);
      const order = [at('id="sonraki"'), ...r.parts!.map((p) => at(`id="bolum-${p.key}"`)), at(r.disclaimer.title)];
      for (const i of order) expect(i).toBeGreaterThan(-1);
      expect([...order].sort((a, b) => a - b)).toEqual(order);
      expect(html).toContain('<details');
      // Fikirler bir kez, ek bölümde (eski liste yerine bir yönlendirme cümlesi).
      const idea = ORAL.passages.find((x) => x.key === c.input.passageKey)!.ideas[0].text;
      expect(html.split(idea.replace(/'/g, '&#x27;')).length - 1).toBe(1);
      expect(html).toContain(r.audience === 'parent' ? '“Okuma ve cevaplar tek tek” bölümünde' : '“Okuman ve cevapların tek tek” bölümünde');
    }
  });
});

/* ======================= Çizimler, okunuş, ekran ve PDF ======================= */

describe('Okuma ve konu tarama bölümleri: çizimler, okunuş, ekran ve PDF', () => {
  it('yeni çizimler uçlarda da taşmaz: uzun adlı soru kutuları, kalabalık metin haritası, çok değerli sayı kutuları', () => {
    const grid: GridVisual = {
      type: 'grid',
      label: 'Deneme',
      rows: [
        { label: 'Metindeki bilgiyi hatırlama', cells: Array.from({ length: 25 }, (_, i) => ({ text: String(i + 1), mark: (['on', 'off', 'skip'] as const)[i % 3] })) },
        { label: 'Ana fikir', cells: [{ text: '99', mark: 'on' }] },
      ],
      legend: [
        { mark: 'on', text: 'doğru' },
        { mark: 'off', text: 'yanlış' },
        { mark: 'skip', text: '“Bilmiyorum”' },
      ],
    };
    checkDrawn(grid, 'kutular');
    checkDrawn({ ...grid, rows: [{ label: '', cells: grid.rows[0].cells.slice(0, 4) }] }, 'kutular adsız');
    const p = ORAL.passages.find((x) => x.grade === 8)!;
    const n = oralWordCount(p.paragraphs);
    const marks = Object.fromEntries(Array.from({ length: n }, (_, i) => [String(i), (i % 3 === 0 ? { s: 'sub' } : i % 5 === 0 ? { ins: 3 } : i % 7 === 0 ? { s: 'unclear' } : { hes: true }) as OralMark]));
    const r = evaluate(ORAL.slug, { grade: 8, data: { engine: 'oral', ...autoOf(oralInput(p), marks) } }).parent;
    checkDrawn(cardOf(r, 'answers', 'text')!.visual!, 'harita');
    const longWord: WordMapVisual = { type: 'wordmap', label: 'Uzun', rows: [{ label: '1', words: [{ len: 80, mark: 'error', ins: 9 }, { len: 3, mark: 'unread' }] }], legend: [{ mark: 'ok', text: 'doğru' }] };
    checkDrawn(longWord, 'uzun kelime');
    for (const value of [0, 10, 20]) {
      const cells: CellsVisual = {
        type: 'cells',
        label: 'Deneme',
        min: 0,
        max: 20,
        value,
        valueLabel: `${value}/20`,
        zones: [
          { from: 0, to: 9, label: 'Öncelikli' },
          { from: 10, to: 14, label: 'Pekiştirilmeli' },
          { from: 15, to: 19, label: 'Sağlam' },
          { from: 20, to: 20, label: 'Hepsi doğru' },
        ],
        active: value < 10 ? 0 : value < 15 ? 1 : 3,
      };
      checkDrawn(cells, `sayı kutuları ${value}`);
      // Kişinin değeri tek dolu kutu.
      expect(drawVisual(cells, 240, 10).shapes.filter((s) => s.k === 'rect' && s.fill === 'fill').length).toBe(1);
    }
    checkDrawn({ type: 'cells', label: 'Az', min: 0, max: 1, value: null, valueLabel: '', zones: [{ from: 0, to: 0, label: 'Temel fikirlerin azı' }, { from: 1, to: 1, label: 'Temel fikirlerin hepsi' }], active: null }, 'iki kutu');
  });

  it('okunuş: tam sayılı kesirler ve üçerli gruplanmış sayılar', () => {
    expect(speakable('D) {1 3/4}')).toBe('D) 1 tam 3 bölü 4');
    expect(speakable('Cevabın: B) 72 405 060.')).toBe('Cevabın: B) 72405060.');
    expect(speakable('102 045 ile 3, 4 ve 5')).toBe('102045 ile 3, 4 ve 5');
    expect(speakable('0,25 125')).toBe('0,25 125');
  });

  it('konu taramada kesirler ekranda alt alta, PDF’te düz yazıyla', async () => {
    const r = evaluate(QUIZ.slug, quizBody(5, (i) => (i % 2 ? 'wrong' : 'right'))).student;
    const html = renderToStaticMarkup(createElement(SimpleReportView, { report: r }));
    const rows = partCards(partOf(r, 'answers')).flatMap((c) => c.rows!);
    expect(rows.some((x) => x.text.includes('{') || x.value.includes('{') || x.tags.some((t) => t.includes('{')))).toBe(true);
    expect(html).toContain('frac-stack');
    const pdf = await renderSimpleReportPdf(r, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('PDF: üç test, öğrenci ve veli; ek bölümler PDF’i uzatır (soru soru cevaplar ekte)', async () => {
    const pages = (b: Buffer) => (b.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    const reports = [
      ...both(evaluate(READING.slug, readingBody({ grade: 7, correct: 5, wpm: 150 }))),
      ...both(evaluate(QUIZ.slug, quizBody(8, (i) => (i % 4 === 0 ? 'dk' : i % 3 ? 'right' : 'wrong')))),
      ...oralReports(oralCases().find((x) => x.name === 'karışık işaretler' && x.grade === 5)!),
      ...oralReports(oralCases().find((x) => x.name === 'otomatik karışık' && x.grade === 2)!),
    ];
    for (const r of reports) {
      const t0 = performance.now();
      const pdf = await renderSimpleReportPdf(r, 'olcekhane.com');
      expect(performance.now() - t0).toBeLessThan(30_000);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
      const without = await renderSimpleReportPdf({ ...r, parts: undefined }, 'olcekhane.com');
      expect(pages(pdf), `${r.instrumentName} ${r.audience}`).toBeGreaterThan(pages(without));
    }
  }, 240_000);

  it('hiçbir şey saklanmaz: bölümler raporla birlikte kurulur, ses ve kimlik bilgisi taşımaz', () => {
    const c = oralCases().find((x) => x.name === 'karışık işaretler' && x.grade === 3)!;
    for (const r of oralReports(c)) {
      const json = JSON.stringify(r.parts);
      expect(json).not.toMatch(/contour|audio|blob|data:audio/i);
    }
    // Sesli okumada ses yalnızca cihazda: rapor ses kaydı istemez (şema yalnızca özet alır).
    const p = oralPassagesFor(ORAL, 3)[0];
    expect(Object.keys(oralInput(p)).sort()).not.toContain('recording');
  });
});
