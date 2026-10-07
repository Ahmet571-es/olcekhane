import { describe, expect, it } from 'vitest';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { LEVEL_TEXT, PROFILE_TEXT, PROSODY_DIMENSIONS } from '@/content/reports/sesli-okuma';
import { hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { sesliOkumaRoadmap } from '@/content/roadmaps/sesli-okuma';
import { AssessmentError, evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { answersBody } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { Resampler, analyzeRecording, encodeWav, overviewContour } from '@/lib/oral/audio';
import { oralTokens, oralWordCount } from '@/lib/oral/words';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { needsSpecialistNote } from '@/lib/reports/oral';
import { oralAspects } from '@/lib/reports/oral-roadmap';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  ORAL_CRITERIA,
  OralInputError,
  accuracyLevel,
  comprehensionLevel,
  lowerLevel,
  oralPassagesFor,
  scoreOral,
  type OralInput,
  type OralLevel,
  type OralMark,
} from '@/lib/scoring/oral';
import sitemap from '../src/app/sitemap';

const SLUG = 'sesli-okuma-degerlendirmesi';
const def = sesliOkuma;
const LEVELS: OralLevel[] = ['easy', 'support', 'hard'];

/** Kelime sayısı sınırları (metin yazım kuralları). */
const WORDS: Record<number, [number, number]> = { 1: [45, 60], 2: [75, 95], 3: [110, 135], 4: [130, 155], 5: [150, 175], 6: [165, 190], 7: [180, 205], 8: [195, 220] };

function passage(key: string) {
  return def.passages.find((p) => p.key === key)!;
}

/** Bütün soruları doğru (ya da ilk `wrong` tanesini yanlış) cevaplar. */
function answersFor(key: string, wrong = 0): Record<string, string> {
  const p = passage(key);
  return Object.fromEntries(
    p.questions.map((q, i) => [q.key, i < wrong ? q.options.find((o) => o.key !== q.answer)!.key : q.answer]),
  );
}

/** İlk `n` kelimeyi yanlış okunmuş olarak işaretler. */
function subs(n: number): Record<string, OralMark> {
  return Object.fromEntries(Array.from({ length: n }, (_, i) => [String(i), { s: 'sub' as const }]));
}

function input(key: string, o: Partial<OralInput> = {}): OralInput {
  const p = passage(key);
  const words = oralWordCount(p.paragraphs);
  return {
    passageKey: key,
    recordMs: 70_000,
    // Dakikada ~70 kelime.
    readingMs: Math.round((words / 70) * 60_000),
    timingAuto: true,
    audio: { quality: 'good', pauses: [[1000, 1400], [5000, 6200], [9000, 12_500]], speechMs: 40_000, contour: Array.from({ length: 120 }, (_, i) => (i * 7) % 100), interrupted: false },
    marks: {},
    listened: 1,
    retell: { recorded: true, ideas: p.ideas.map((x) => x.key) },
    answers: answersFor(key),
    prosody: { expression: 3, phrasing: 3, smoothness: 3, pace: 3 },
    ...o,
  };
}

const body = (grade: number, i: OralInput) => ({ grade, data: { engine: 'oral' as const, ...i } });
const text = (r: SimpleReport) =>
  [
    ...r.cautions,
    ...r.items.flatMap((i) => [i.title, i.badge ?? '', i.text]),
    ...(r.oral ? [r.oral.level.label, r.oral.level.text, r.oral.level.profile ?? '', r.oral.next, ...r.oral.prosody.map((p) => p.text)] : []),
    ...(r.roadmap
      ? [
          r.roadmap.intro,
          ...r.roadmap.study.items.flatMap((i) => [i.title, i.badge, i.text]),
          ...(r.roadmap.settings?.items ?? []),
          ...(r.roadmap.approach?.items.flatMap((i) => [i.title, i.text]) ?? []),
          ...r.roadmap.weeks.flatMap((w) => [w.title, w.text]),
        ]
      : []),
    ...(r.support?.lines ?? []),
    r.disclaimer.text,
  ].join(' ');

describe('Sesli okuma: metinler', () => {
  it('1–8. sınıfların her birinde üç metin; en az bir öykü ve bir bilgilendirici metin', () => {
    for (let g = 1; g <= 8; g++) {
      const list = def.passages.filter((p) => p.grade === g);
      expect(list, `${g}. sınıf`).toHaveLength(3);
      expect(list.some((p) => p.genre === 'narrative'), `${g}. sınıf öykü`).toBe(true);
      expect(list.some((p) => p.genre === 'informational'), `${g}. sınıf bilgilendirici`).toBe(true);
    }
    expect(new Set(def.passages.map((p) => p.key)).size).toBe(def.passages.length);
    expect(new Set(def.passages.map((p) => p.title)).size).toBe(def.passages.length);
  });

  it('her metin kurallara uyar: uzunluk, yazım, sorular ve yeniden anlatma fikirleri', () => {
    for (const p of def.passages) {
      expect(p.key, p.key).toMatch(new RegExp(`^g${p.grade}-[a-z0-9-]+$`));
      const n = oralWordCount(p.paragraphs);
      const [lo, hi] = WORDS[p.grade];
      expect(n, `${p.key}: ${n} kelime`).toBeGreaterThanOrEqual(lo);
      expect(n, `${p.key}: ${n} kelime`).toBeLessThanOrEqual(hi);
      const all = p.paragraphs.join(' ');
      // Kesme işareti ’; konuşma çizgisi, parantez, tireli kelime yok; 1–4. sınıfta rakam yok.
      expect(all, p.key).not.toMatch(/['()—–]|\w-\w/);
      if (p.grade <= 4) expect(all, p.key).not.toMatch(/\d/);
      for (const para of p.paragraphs) expect(para.trim(), p.key).toBe(para);
      // Boşlukla ayrılan her parça bir kelime içerir: işaretler kelimelere birebir oturur.
      expect(all.split(/\s+/).every((t) => /[\p{L}\p{N}]/u.test(t)), p.key).toBe(true);

      const small = p.grade <= 2;
      expect(p.questions, p.key).toHaveLength(small ? 5 : 8);
      const skills = p.questions.map((q) => q.skill);
      expect(skills, p.key).toEqual(
        small
          ? expect.arrayContaining(['literal', 'literal', 'inference', 'vocabulary', 'main_idea'])
          : ['literal', 'literal', 'literal', 'inference', 'inference', 'vocabulary', 'vocabulary', 'main_idea'],
      );
      for (const q of p.questions) {
        expect(q.options, `${p.key} ${q.key}`).toHaveLength(small ? 3 : 4);
        expect(q.options.map((o) => o.key), `${p.key} ${q.key}`).toEqual(small ? ['a', 'b', 'c'] : ['a', 'b', 'c', 'd']);
        expect(q.options.some((o) => o.key === q.answer), `${p.key} ${q.key}`).toBe(true);
        expect(new Set(q.options.map((o) => o.text)).size, `${p.key} ${q.key}`).toBe(q.options.length);
      }
      expect(new Set(p.questions.map((q) => q.key)).size).toBe(p.questions.length);

      const [minIdeas, maxIdeas] = p.grade <= 2 ? [5, 6] : p.grade <= 5 ? [6, 8] : [7, 9];
      expect(p.ideas.length, p.key).toBeGreaterThanOrEqual(minIdeas);
      expect(p.ideas.length, p.key).toBeLessThanOrEqual(maxIdeas);
      const core = p.ideas.filter((x) => x.core).length;
      expect(core, p.key).toBeGreaterThanOrEqual(3);
      expect(core, p.key).toBeLessThanOrEqual(4);
      expect(new Set(p.ideas.map((x) => x.key)).size).toBe(p.ideas.length);
    }
  });

  it('doğru cevapların harfleri dengeli dağılır (hep aynı seçenek doğru değildir)', () => {
    for (const small of [true, false]) {
      const qs = def.passages.filter((p) => (p.grade <= 2) === small).flatMap((p) => p.questions);
      const keys = small ? ['a', 'b', 'c'] : ['a', 'b', 'c', 'd'];
      for (const k of keys) {
        const share = qs.filter((q) => q.answer === k).length / qs.length;
        expect(share, `${small ? '1–2' : '3–8'}: ${k}`).toBeGreaterThan(0.75 / keys.length);
        expect(share, `${small ? '1–2' : '3–8'}: ${k}`).toBeLessThan(1.25 / keys.length);
      }
    }
  });

  it('metin seçimi: öğrencinin sınıfı ile bir alt ve bir üst sınıfın metinleri', () => {
    expect(oralPassagesFor(def, 1).map((p) => p.grade).sort()).toEqual([1, 1, 1, 2, 2, 2]);
    expect(new Set(oralPassagesFor(def, 5).map((p) => p.grade))).toEqual(new Set([4, 5, 6]));
    expect(new Set(oralPassagesFor(def, 8).map((p) => p.grade))).toEqual(new Set([7, 8]));
  });

  it('kelimeler sırayla numaralanır; noktalama kelimeye bitişik kalır', () => {
    const t = oralTokens(['Bir gün, Elif’in kedisi kayboldu.', 'Sonra "bulundu" dedi.']);
    expect(t.flat().map((x) => x.i)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(t[0].map((x) => x.text)).toEqual(['Bir', 'gün,', 'Elif’in', 'kedisi', 'kayboldu.']);
    expect(oralWordCount(['Bir — iki'])).toBe(2);
  });
});

describe('Sesli okuma: ses çözümleme (cihazda)', () => {
  const sine = (f: number, sr: number, n: number, a = 0.5) => Float32Array.from({ length: n }, (_, i) => a * Math.sin((2 * Math.PI * f * i) / sr));
  const rms = (x: Float32Array) => Math.sqrt(x.reduce((s, v) => s + v * v, 0) / x.length);

  it('16 kHz’e indirme: konuşma frekansları korunur, yüksek frekanslar süzülür, parça parça vermek sonucu değiştirmez', () => {
    for (const sr of [48000, 44100]) {
      for (const f of [300, 1000, 3000]) expect(rms(new Resampler(sr).push(sine(f, sr, sr)).slice(200)) / (0.5 / Math.SQRT2), `${sr} ${f}`).toBeCloseTo(1, 1);
      expect(rms(new Resampler(sr).push(sine(10000, sr, sr)).slice(200)), `${sr} 10 kHz`).toBeLessThan(0.01);
      expect(new Resampler(sr).push(sine(440, sr, sr)).length).toBe(16000);
    }
    const x = sine(440, 48000, 48000);
    const whole = new Resampler(48000).push(x);
    const r = new Resampler(48000);
    const parts: number[] = [];
    for (let i = 0, n = 1; i < x.length; i += n, n = (n * 7) % 2999 + 1) parts.push(...r.push(x.slice(i, i + n)));
    expect(parts.length).toBe(whole.length);
    expect(Math.max(...parts.map((v, i) => Math.abs(v - whole[i])))).toBeLessThan(1e-6);
    expect(Array.from(new Resampler(16000).push(x.slice(0, 100)))).toEqual(Array.from(x.slice(0, 100)));
  });

  it('WAV dosyası: 16 bit, tek kanal, doğru uzunluk', () => {
    const w = new DataView(encodeWav(new Float32Array([0, 1, -1, 2]), 16000));
    expect(String.fromCharCode(...new Uint8Array(w.buffer, 0, 4))).toBe('RIFF');
    expect(w.getUint32(24, true)).toBe(16000);
    expect(w.getUint16(22, true)).toBe(1);
    expect(w.getUint32(40, true)).toBe(8);
    expect([w.getInt16(44, true), w.getInt16(46, true), w.getInt16(48, true), w.getInt16(50, true)]).toEqual([0, 32767, -32768, 32767]);
  });

  /** Konuşmaya benzer kayıt: arka plan gürültüsü üstünde ses parçaları ve aralar (ms). */
  function speechLike(plan: [kind: 'ses' | 'ara', ms: number][], noise = 0.002, loud = 0.3) {
    const sr = 16000;
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const out: number[] = [];
    for (const [kind, ms] of plan) {
      const n = (sr * ms) / 1000;
      for (let i = 0; i < n; i++) out.push((kind === 'ses' ? loud * Math.sin((2 * Math.PI * 220 * i) / sr) : 0) + rand() * noise);
    }
    return Float32Array.from(out);
  }

  it('okumanın başı ve sonu, duraklamalar ve kalite doğru bulunur', () => {
    const plan: ['ses' | 'ara', number][] = [['ara', 500]];
    for (let k = 0; k < 5; k++) plan.push(['ses', 600], ['ara', 300]);
    plan.push(['ara', 1200]);
    for (let k = 0; k < 3; k++) plan.push(['ses', 600], ['ara', 300]);
    plan.push(['ara', 400]);
    const a = analyzeRecording(speechLike(plan), 16000);
    expect(a.quality).toBe('good');
    expect(a.speechStartMs).toBe(500);
    expect(a.speechEndMs).toBe(500 + 8 * 600 + 7 * 300 + 1200);
    expect(a.pauses.map(([s, e]) => e - s)).toEqual([300, 300, 300, 300, 1500, 300, 300]);
    expect(a.pauses[4][0]).toBe(5 * 600 + 4 * 300);
    expect(a.speechMs).toBe(8 * 600);
    expect(a.contour).toHaveLength(120);
    expect(overviewContour(speechLike(plan), 16000)).toHaveLength(160);
  });

  it('kelime içindeki kısa duraklar (160 ms’ye kadar) ve kısa çıtırtılar duraklama ya da konuşma sayılmaz', () => {
    const a = analyzeRecording(
      speechLike([['ara', 400], ['ses', 300], ['ara', 120], ['ses', 300], ['ara', 600], ['ses', 40], ['ara', 600], ['ses', 300], ['ara', 400]]),
      16000,
    );
    expect(a.pauses.map(([s, e]) => e - s)).toEqual([1240]);
  });

  it('sessiz, kısık, gürültülü ve patlayan kayıtlar ayırt edilir', () => {
    expect(analyzeRecording(new Float32Array(16000 * 3), 16000).quality).toBe('silent');
    expect(analyzeRecording(speechLike([['ara', 2000]], 0.01), 16000).quality).toBe('silent');
    expect(analyzeRecording(speechLike([['ara', 500], ['ses', 2000], ['ara', 500]], 0.0001, 0.005), 16000).quality).toBe('quiet');
    expect(analyzeRecording(speechLike([['ara', 500], ['ses', 2000], ['ara', 500]], 0.1, 0.3), 16000).quality).toBe('noisy');
    expect(analyzeRecording(speechLike([['ara', 500], ['ses', 2000], ['ara', 500]], 0.002, 1.4), 16000).quality).toBe('clipped');
  });
});

describe('Sesli okuma: puanlama', () => {
  const key = 'g3-kus-yemligi';
  const n = oralWordCount(passage(key).paragraphs);

  it('hata sayılanlar ve sayılmayanlar ayrı tutulur; doğruluk ve dakikada doğru kelime', () => {
    const r = scoreOral(def, 3, {
      ...input(key),
      readingMs: 60_000,
      marks: {
        '0': { s: 'sub', said: 'kuş', kind: 'suffix', meaning: false },
        '1': { s: 'omit' },
        '2': { s: 'help', hes: true },
        '3': { s: 'self' },
        '4': { rep: true, syl: true },
        '5': { ins: 2 },
      },
    });
    expect([r.counts.sub, r.counts.omit, r.counts.help, r.counts.ins, r.counts.self, r.counts.rep, r.counts.syl, r.counts.hes]).toEqual([1, 1, 1, 2, 1, 1, 1, 1]);
    expect(r.errors).toBe(5);
    expect(r.wordsCorrect).toBe(n - 3);
    expect(r.accuracyPct).toBe(Math.round(((n - 5) / n) * 1000) / 10);
    expect(r.wpm).toBe(n);
    expect(r.wcpm).toBe(n - 3);
    expect(r.counts.kinds.suffix).toBe(1);
    expect(r.counts.meaningKept).toBe(1);
    expect(r.marked.flat()[0]).toEqual({ text: passage(key).paragraphs[0].split(/\s+/)[0], s: 'sub', said: 'kuş' });
    expect(r.marked.flat()[5].ins).toBe(2);
  });

  it('düzey eşikleri ve iki ölçütten düşük olanı', () => {
    expect([97, 96.9, 90, 89.9].map(accuracyLevel)).toEqual(['easy', 'support', 'support', 'hard']);
    expect([80, 79, 60, 59].map(comprehensionLevel)).toEqual(['easy', 'support', 'support', 'hard']);
    for (const a of LEVELS) for (const b of LEVELS) expect(lowerLevel(a, b)).toBe(LEVELS[Math.max(LEVELS.indexOf(a), LEVELS.indexOf(b))]);
  });

  it('geçersiz istekler reddedilir', () => {
    expect(() => scoreOral(def, 3, { ...input(key), marks: { [String(n)]: { s: 'sub' } } })).toThrow(OralInputError);
    expect(() => scoreOral(def, 3, { ...input(key), marks: { '01': { s: 'sub' } } })).toThrow(OralInputError);
    expect(() => scoreOral(def, 3, { ...input(key), answers: { q1: 'a' } })).toThrow(OralInputError);
    expect(() => scoreOral(def, 3, { ...input(key), answers: { ...answersFor(key), q99: 'a' } })).toThrow(OralInputError);
    expect(() => scoreOral(def, 3, { ...input(key), answers: { ...answersFor(key), q1: 'e' } })).toThrow(OralInputError);
    expect(() => scoreOral(def, 3, { ...input(key), retell: { recorded: true, ideas: ['yok'] } })).toThrow(OralInputError);
    // İki sınıf uzaktaki metin seçilemez.
    expect(() => scoreOral(def, 6, input(key))).toThrow(OralInputError);
    expect(() => evaluate(SLUG, body(6, input(key)))).toThrow(AssessmentError);
    expect(() => evaluateReports(SLUG, body(ADULT_GRADE, input(key)))).toThrow(AssessmentError);
    expect(() => evaluate(SLUG, body(9, input(key)))).toThrow(AssessmentError);
  });

  it('istek şeması: ses kaydı gönderilemez, yalnızca özet sayılar', () => {
    expect(answersBody.safeParse(body(3, input(key))).success).toBe(true);
    const withAudio = { ...body(3, input(key)) };
    (withAudio.data as Record<string, unknown>).wav = 'UklGRg==';
    expect(answersBody.safeParse(withAudio).success).toBe(true);
    // Fazladan alanlar ayıklanır: ses verisi puanlamaya ulaşmaz.
    expect('wav' in (answersBody.parse(withAudio).data as Record<string, unknown>)).toBe(false);
    expect(answersBody.safeParse(body(3, { ...input(key), marks: { '0': { s: 'sub', extra: 1 } as OralMark } })).success).toBe(false);
    expect(answersBody.safeParse(body(3, { ...input(key), prosody: { expression: 5, phrasing: 3, smoothness: 3, pace: 3 } })).success).toBe(false);
  });
});

describe('Sesli okuma: rapor', () => {
  /** Doğruluk düzeyi için hata sayısı ve anlama düzeyi için yanlış soru sayısı. */
  function errorsFor(level: OralLevel, words: number) {
    if (level === 'easy') return 0;
    if (level === 'support') return Math.ceil(words * 0.05);
    return Math.ceil(words * 0.15);
  }
  function wrongFor(level: OralLevel, total: number) {
    if (level === 'easy') return 0;
    return level === 'support' ? Math.round(total * 0.3) : total - 1;
  }

  it('bütün durum birleşimlerinde kartlar, uyarılar ve öneriler birbiriyle çelişmez', () => {
    let checked = 0;
    for (const key of ['g1-kacan-top', 'g4-deve', 'g7-peri-bacalari']) {
      const p = passage(key);
      const words = oralWordCount(p.paragraphs);
      for (const grade of [p.grade, Math.min(8, p.grade + 1)]) {
        for (const acc of LEVELS) {
          for (const comp of LEVELS) {
            for (const prosody of [4, 2, 1]) {
              for (const retell of ['all', 'few', 'none'] as const) {
                for (const flag of ['', 'partial', 'interrupted', 'fast', 'manual', 'noisy'] as const) {
                  const i = input(key, {
                    marks: subs(errorsFor(acc, words)),
                    answers: answersFor(key, wrongFor(comp, p.questions.length)),
                    prosody: { expression: prosody, phrasing: prosody, smoothness: prosody === 4 ? 4 : 3, pace: prosody },
                    retell: retell === 'none' ? null : { recorded: true, ideas: retell === 'all' ? p.ideas.map((x) => x.key) : [p.ideas[0].key] },
                    listened: flag === 'partial' ? 0.5 : 1,
                    readingMs: flag === 'fast' ? Math.round((words / 400) * 60_000) + 1000 : Math.round((words / 70) * 60_000),
                    timingAuto: flag !== 'manual',
                  });
                  if (flag === 'interrupted') i.audio = { ...i.audio!, interrupted: true };
                  if (flag === 'noisy') i.audio = { ...i.audio!, quality: 'noisy' };
                  const result = scoreOral(def, grade, i);
                  expect(result.accuracyLevel, key).toBe(acc);
                  expect(result.comprehension.level, key).toBe(comp);
                  const reps = evaluate(SLUG, body(grade, i));
                  for (const audience of ['student', 'parent'] as const) {
                    const r = reps[audience];
                    const o = r.oral!;
                    const all = text(r);
                    const tag = `${key} ${grade} ${acc}-${comp} ${prosody} ${retell} ${flag || '-'} ${audience}`;
                    expect(all, tag).not.toMatch(/undefined|NaN|null|\{|\}/);
                    expect(o.level.key, tag).toBe(lowerLevel(acc, comp));
                    expect(o.level.label, tag).toBe(LEVEL_TEXT[lowerLevel(acc, comp)].label);
                    expect(o.level.profile === null, tag).toBe(!PROFILE_TEXT[`${acc}-${comp}`]);
                    expect(!!PROFILE_TEXT[`${acc}-${comp}`], tag).toBe(acc !== comp);
                    // Uyarılar yalnızca gerçekten olan durumlarda.
                    expect(r.cautions.some((c) => /tamamı dinlenme/.test(c)), tag).toBe(flag === 'partial');
                    expect(r.cautions.some((c) => /kesinti/.test(c)), tag).toBe(flag === 'interrupted');
                    expect(r.cautions.some((c) => /çok kısa/.test(c)), tag).toBe(flag === 'fast');
                    expect(r.cautions.some((c) => /düğmelere/.test(c)), tag).toBe(flag === 'manual');
                    // Süre güvenilmezse ortalamayla karşılaştırma yapılmaz; karşılaştırma yalnızca 1–4. sınıfta ve kendi sınıfının metninde.
                    const rate = r.items.find((x) => x.title === 'Okuma hızı')!.text;
                    expect(/Erden/.test(rate), tag).toBe(flag !== 'fast' && grade <= 4 && grade === p.grade);
                    // Duraklamalar yalnızca ses kalitesi iyi ve süre kayıttan ölçüldüyse anlatılır ve çizilir.
                    const pausesShown = !['interrupted', 'manual', 'noisy'].includes(flag);
                    expect(/duraklama|kez durdun/.test(rate), tag).toBe(pausesShown);
                    expect(o.timeline !== null, tag).toBe(pausesShown);
                    // Uzmana danışma kutusu yalnızca yetişkin raporunda ve öğrenci kendi düzeyinde zorlandıysa.
                    expect(r.support !== null, tag).toBe(audience === 'parent' && needsSpecialistNote(result, grade));
                    if (r.support) expect(lowerLevel(acc, comp) === 'hard' || acc === 'hard', tag).toBe(true);
                    // Öneriler duruma uyar.
                    // Gelişim yol haritası: her durumda var; kartlar duruma uyar, haftalar yinelenmez.
                    const rm = r.roadmap!;
                    expect(rm, tag).toBeDefined();
                    const asp = oralAspects(result);
                    expect(rm.study.items.map((x) => x.key), tag).toEqual(asp.map((x) => x.key));
                    expect(asp.map((x) => x.key).includes('retell'), tag).toBe(retell !== 'none');
                    // Çalışılacak yönler önce gelir.
                    expect(asp.findIndex((x) => !x.need) === -1 || asp.slice(asp.findIndex((x) => !x.need)).every((x) => !x.need), tag).toBe(true);
                    for (const it of rm.study.items) {
                      const a = asp.find((x) => x.key === it.key)!;
                      const tpl = sesliOkumaRoadmap.aspects[a.key];
                      expect(it.text, tag).toBe((a.need ? tpl.need : tpl.full)[audience]);
                    }
                    expect(asp.find((x) => x.key === 'accuracy')!.need, tag).toBe(acc !== 'easy');
                    expect(asp.find((x) => x.key === 'comprehension')!.need, tag).toBe(comp !== 'easy');
                    expect(new Set(rm.weeks.map((w) => w.text)).size, tag).toBe(4);
                    expect(rm.approach !== null, tag).toBe(audience === 'parent');
                    expect(rm.bars.length, tag).toBe(retell === 'none' ? 3 : 4);
                    expect(rm.standout[0].text, tag).toBe(LEVEL_TEXT[lowerLevel(acc, comp)].label);
                    // Kişi dili: öğrenciye "sen", yetişkine üçüncü kişi.
                    if (audience === 'parent') expect(all, tag).not.toMatch(/\b(okudun|anladın|zorlandın|söyledin|cevapladın|durdun|düzelttin|sen)\b/);
                    else expect(all, tag).not.toMatch(/Öğrenci |öğrencinin|Okumadaki zorluk/);
                    // Sayılar kartlarla aynı.
                    expect(r.keyFigures[0].value, tag).toBe(String(result.wcpm));
                    expect(r.keyFigures[3].value, tag).toBe(`${result.comprehension.correct} / ${result.comprehension.total}`);
                    expect(r.keyFigures[4].value, tag).toBe(retell === 'none' ? '—' : `${result.retell!.mentioned.length} / ${result.retell!.total}`);
                    expect(o.prosodyTotal, tag).toBe(result.prosody.total);
                    expect(o.prosody.map((x) => x.name), tag).toEqual(PROSODY_DIMENSIONS.map((d) => d.name));
                    expect(r.audienceName, tag).toBe(audience === 'parent' ? 'Veli ve öğretmen raporu' : 'Öğrenci raporu');
                    checked++;
                  }
                }
              }
            }
          }
        }
      }
    }
    expect(checked).toBe(3 * 2 * 3 * 3 * 3 * 3 * 6 * 2);
  });

  it('hatasız okumada işaretli metin boş, ölçüt tablosu iki satır; PDF üretilir', async () => {
    const reps = evaluate(SLUG, body(5, input('g5-ahtapot')));
    expect(reps.parent.oral!.criteria).toHaveLength(2);
    expect(reps.parent.oral!.marked.flat().every((t) => Object.keys(t).length === 1)).toBe(true);
    expect(reps.parent.oral!.level.key).toBe('easy');
    const busy = evaluate(
      SLUG,
      body(2, input('g2-mavi-leke', { marks: { '0': { s: 'sub', said: 'mavili' }, '3': { s: 'omit', rep: true }, '7': { s: 'self', syl: true, hes: true }, '9': { ins: 1 } } })),
    );
    for (const r of [reps.student, reps.parent, busy.student, busy.parent]) {
      const pdf = await renderSimpleReportPdf(r, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);
});

describe('Sesli okuma: sitede', () => {
  it('yayında, okuma alanında, 1–8. sınıflar için; yetişkinlere kapalı', () => {
    const t = getInstrumentDef(SLUG)!;
    expect(publicInstruments()).toContain(t);
    expect([t.domain, t.engine, t.minGrade, t.maxGrade, !!t.adults]).toEqual(['reading', 'oral', 1, 8, false]);
    // Erden, Kurdoğlu ve Uslu (2002) 1–5. sınıfları bildirir.
    expect(def.referenceRates.map((r) => r.grade)).toEqual([1, 2, 3, 4, 5]);
    expect(def.science.normNote).toContain(`%${ORAL_CRITERIA.accuracy.easy}`);
  });

  it('herkese açık gelişim yol haritası var; test sayfası tanıtımı onu anlatır', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toContain('okumanın yönlerine göre');
  });

  it('Okuma sekmesi ve test sayfası site haritasında', () => {
    const urls = sitemap().map((x) => new URL(x.url).pathname);
    expect(urls).toContain('/okuma');
    expect(urls).toContain(`/testler/${SLUG}`);
    expect(urls).toContain('/ilkokul-1-2');
  });
});
