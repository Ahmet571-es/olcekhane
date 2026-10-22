import type { Band, QuizForm, QuizInstrument, QuizOptionKey } from '@/lib/instruments/types';

/**
 * Akademik konu tarama testlerinin (çoktan seçmeli, cevap anahtarlı) puanlaması.
 * Öğrenci her soruda A–D seçeneklerinden birini ya da “Bilmiyorum”u (X) seçer. Puanlama ölçüt
 * temellidir: norm yoktur, doğru cevap oranı sabit eşiklerle yorumlanır.
 */

export const DONT_KNOW = 'X' as const;
export type QuizChoice = QuizOptionKey | typeof DONT_KNOW;
export const QUIZ_CHOICES: readonly QuizChoice[] = ['A', 'B', 'C', 'D', DONT_KNOW];

export function isQuizChoice(v: unknown): v is QuizChoice {
  return typeof v === 'string' && (QUIZ_CHOICES as readonly string[]).includes(v);
}

/** Doğru cevap oranı eşikleri: 4 sorudan 3’ü (%75) “sağlam”, 2’si (%50) “pekiştirilmeli”. */
export const QUIZ_THRESHOLDS = { high: 0.75, average: 0.5 } as const;

export function quizBand(ratio: number): Band {
  if (ratio >= QUIZ_THRESHOLDS.high) return 'high';
  if (ratio >= QUIZ_THRESHOLDS.average) return 'average';
  return 'low';
}

/** Soru başına ortanca süre bunun altındaysa cevapların bir kısmının okunmadan verildiği düşünülür. */
export const QUIZ_TOO_FAST_MS = 5000;

export interface QuizAnswer {
  choice: QuizChoice;
  rtMs: number | null;
}

export interface QuizDomainResult {
  key: string;
  correct: number;
  wrong: number;
  dontKnow: number;
  n: number;
  ratio: number;
  band: Band;
}

export interface QuizItemResult {
  key: string;
  domain: string;
  choice: QuizChoice | null;
  correct: boolean;
  /** Seçilen yanlış seçeneğin işaret ettiği hata türü (varsa). */
  misconception: string | null;
  rtMs: number | null;
}

export interface QuizMisconceptionHit {
  key: string;
  count: number;
  /** Hatanın görüldüğü soruların formdaki sıra numaraları (1’den başlar). */
  itemNumbers: number[];
}

export interface QuizResult {
  formKey: string;
  grade: number;
  contentGrade: number;
  n: number;
  correct: number;
  wrong: number;
  dontKnow: number;
  missing: number;
  ratio: number;
  band: Band;
  domains: QuizDomainResult[];
  items: QuizItemResult[];
  misconceptions: QuizMisconceptionHit[];
  medianRtMs: number | null;
  flags: { tooFast: boolean; sameLetter: boolean; notes: string[] };
}

/** Öğrencinin sınıfına göre form. Tam eşleşme yoksa en yakın sınıfın formu (eşitlikte alttaki). */
export function formForGrade(def: QuizInstrument, grade: number): QuizForm {
  const exact = def.forms.find((f) => f.grade === grade);
  if (exact) return exact;
  return [...def.forms].sort((a, b) => Math.abs(a.grade - grade) - Math.abs(b.grade - grade) || a.grade - b.grade)[0];
}

function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const round3 = (x: number) => Math.round(x * 1000) / 1000;

export function scoreQuiz(form: QuizForm, answers: Record<string, QuizAnswer | undefined>): QuizResult {
  const items: QuizItemResult[] = form.items.map((it) => {
    const a = answers[it.key];
    const choice = a?.choice ?? null;
    const correct = choice !== null && choice === it.answer;
    const opt = choice && choice !== DONT_KNOW ? it.options.find((o) => o.key === choice) : undefined;
    return {
      key: it.key,
      domain: it.domain,
      choice,
      correct,
      misconception: !correct && opt?.misconception ? opt.misconception : null,
      rtMs: a?.rtMs ?? null,
    };
  });

  const n = items.length;
  const correct = items.filter((i) => i.correct).length;
  const dontKnow = items.filter((i) => i.choice === DONT_KNOW).length;
  const missing = items.filter((i) => i.choice === null).length;
  const wrong = n - correct - dontKnow - missing;

  const domains: QuizDomainResult[] = form.domains.map((d) => {
    const ds = items.filter((i) => i.domain === d.key);
    const c = ds.filter((i) => i.correct).length;
    const dk = ds.filter((i) => i.choice === DONT_KNOW).length;
    const ratio = ds.length ? c / ds.length : 0;
    return {
      key: d.key,
      correct: c,
      dontKnow: dk,
      wrong: ds.length - c - dk - ds.filter((i) => i.choice === null).length,
      n: ds.length,
      ratio: round3(ratio),
      band: quizBand(ratio),
    };
  });

  const hits = new Map<string, number[]>();
  items.forEach((it, idx) => {
    if (it.misconception) hits.set(it.misconception, [...(hits.get(it.misconception) ?? []), idx + 1]);
  });
  const misconceptions: QuizMisconceptionHit[] = [...hits.entries()]
    .map(([key, itemNumbers]) => ({ key, count: itemNumbers.length, itemNumbers }))
    .sort((a, b) => b.count - a.count || a.itemNumbers[0] - b.itemNumbers[0]);

  // Kalite göstergeleri yalnızca bir seçenek işaretlenen sorulardan hesaplanır.
  const chosen = items.filter((i) => i.choice !== null && i.choice !== DONT_KNOW);
  const rts = chosen.map((i) => i.rtMs).filter((x): x is number => typeof x === 'number' && x > 0);
  const medianRtMs = median(rts);
  const tooFast = chosen.length >= 8 && medianRtMs !== null && medianRtMs < QUIZ_TOO_FAST_MS;
  const letterCounts = new Map<string, number>();
  for (const i of chosen) letterCounts.set(i.choice!, (letterCounts.get(i.choice!) ?? 0) + 1);
  const maxLetter = Math.max(0, ...letterCounts.values());
  const sameLetter = chosen.length >= 10 && maxLetter / chosen.length >= 0.6;

  const notes: string[] = [];
  if (tooFast) {
    notes.push(
      `Sorular çok hızlı cevaplanmış: bir soruya çoğunlukla ${QUIZ_TOO_FAST_MS / 1000} saniyeden az zaman ayrılmış. Bazı cevaplar okunmadan ya da tahminle verilmiş olabilir.`,
    );
  }
  if (sameLetter) {
    notes.push('Cevapların çoğu aynı seçenekte toplanmış; bu, soruların bir kısmının rastgele cevaplandığını gösterebilir.');
  }
  // "Bilmiyorum" cevapları hız ve seçenek denetimine girmez: soruların çoğunda "Bilmiyorum" denmişse ayrıca söylenir.
  if (dontKnow === n && n > 0) {
    notes.push('Bütün sorularda “Bilmiyorum” denmiş; bu yüzden sonuç yorumlanmadı.');
  } else if (dontKnow * 2 > n) {
    notes.push('Soruların yarısından çoğunda “Bilmiyorum” denmiş. Bu konuların bir kısmı okulda henüz işlenmemiş olabilir; sonuç dikkatle okunmalı.');
  }

  return {
    formKey: form.key,
    grade: form.grade,
    contentGrade: form.contentGrade,
    n,
    correct,
    wrong,
    dontKnow,
    missing,
    ratio: round3(n ? correct / n : 0),
    band: quizBand(n ? correct / n : 0),
    domains,
    items,
    misconceptions,
    medianRtMs,
    flags: { tooFast, sameLetter, notes },
  };
}
