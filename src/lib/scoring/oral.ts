import type { OralPassage, OralReadingInstrument, ReadingQuestion } from '@/lib/instruments/types';
import { oralTokens } from '@/lib/oral/words';
import { round } from './stats';

/**
 * Sesli okuma değerlendirmesinin puanlanması. Yetişkinin dinleyerek koyduğu işaretlerden, okuma süresinden, soruların
 * cevaplarından, yeniden anlatmada söylenen fikirlerden ve akıcılık derecelendirmesinden hesaplanır. Ses kaydı sunucuya
 * hiç gelmez; buraya yalnızca bu bilgiler gelir ve hiçbir yere yazılmaz.
 *
 * Hata sayılanlar (kelime tanıma hatası): yanlış okuma, atlama, yardımla okuma (kelimeyi yetişkin söyledi) ve ekleme
 * (metinde olmayan bir kelime söyleme; her ekleme bir hata). Hata sayılmayanlar (ayrıca gösterilir): öğrencinin kendi
 * düzelttiği okuma, tekrar, heceleyerek okuma ve kelimeden önce duraksama.
 *
 * Otomatik analiz (`auto`, bkz. lib/oral/auto.ts): işaretleri öğrencinin cihazındaki konuşma tanıma modelinin çıktısı
 * verir; yetişkin yoktur. Bu yüzden akıcılık derecelendirmesi, yeniden anlatma, "yardımla okuma" ve dinleme oranı
 * gelmez. Konuşma tanımanın net ayırt edemediği kelimeler (`unclear`) hata sayılmaz: doğru okuma oranında ve dakikada
 * doğru kelimede doğru okunmuş gibi hesaba katılır (öğrencinin lehine), ayrıca sayılır ve raporda gösterilir.
 */

/**
 * Kelimenin durumu: yanlış okudu, atladı, yardımla okudu, önce yanlış okuyup kendisi düzeltti; otomatik analizde
 * `unclear`: konuşma tanıma bu kelimeyi net ayırt edemedi (hata sayılmaz, ayrıca gösterilir).
 */
export type OralStatus = 'sub' | 'omit' | 'help' | 'self' | 'unclear';

/** Yanlış okumanın türü (isteğe bağlı ayrıntı). */
export type OralSubKind = 'suffix' | 'similar' | 'reversal' | 'nonword';

export interface OralMark {
  s?: OralStatus;
  /** Yanlış okumada öğrencinin ne söylediği (isteğe bağlı). */
  said?: string;
  kind?: OralSubKind;
  /** Yanlış okuma cümlenin anlamını bozdu mu (isteğe bağlı). */
  meaning?: boolean;
  /** Tekrar etti, heceleyerek okudu, kelimeden önce duraksadı. */
  rep?: true;
  syl?: true;
  hes?: true;
  /** Bu kelimeden sonra eklediği kelime sayısı. */
  ins?: number;
}

export interface OralAudioSummary {
  quality: 'good' | 'quiet' | 'noisy' | 'clipped' | 'silent';
  /** Okuma içindeki sessizlikler: [başlangıç, bitiş] ms, okumanın başından itibaren. */
  pauses: [number, number][];
  speechMs: number;
  contour: number[];
  /** Kayıt sırasında kesinti oldu mu (ekran kapandı, başka bir uygulama mikrofonu aldı…). */
  interrupted: boolean;
}

export interface OralProsody {
  expression: number;
  phrasing: number;
  smoothness: number;
  pace: number;
}

export interface OralInput {
  passageKey: string;
  /**
   * Otomatik analiz: işaretleri cihazdaki konuşma tanıma verdi, yetişkin dinlemedi. Bu durumda `prosody` ve `retell`
   * null, `listened` gönderilmez (gönderilirse yok sayılır), işaretlerde `help` olmaz, `unclear` olabilir.
   */
  auto?: boolean;
  /** Kaydın tamamı ve okuma süresi (ilk sesten son sese; bulunamazsa düğmeler arası). */
  recordMs: number;
  readingMs: number;
  timingAuto: boolean;
  audio: OralAudioSummary | null;
  marks: Record<string, OralMark>;
  /** İşaretleme sırasında kaydın ne kadarının dinlendiği (0–1); yetişkinin işaretlediği sürümde zorunlu. */
  listened?: number;
  retell: { recorded: boolean; ideas: string[] } | null;
  answers: Record<string, string>;
  /** Yetişkinin akıcılık derecelendirmesi; yalnızca otomatik analizde null. */
  prosody: OralProsody | null;
}

/** Bu metin öğrenci için: rahat (tek başına), destekle, şimdilik zor. */
export type OralLevel = 'easy' | 'support' | 'hard';

/**
 * Ölçekhane'nin pilot ölçütleri. Doğru okunan kelime oranı ve sorulardaki doğru oranı, her biri ayrı bir düzey verir;
 * metnin öğrenci için düzeyi ikisinden düşük olanıdır.
 */
export const ORAL_CRITERIA = {
  accuracy: { easy: 97, support: 90 },
  comprehension: { easy: 80, support: 60 },
} as const;

/** Sesli okumada bundan hızlısı (dakikada kelime) metnin tamamının okunmadığını ya da sürenin yanlış ölçüldüğünü düşündürür. */
export const ORAL_MAX_WPM = 250;
/** İşaretleme sırasında kaydın en az bu kadarı dinlenmeli. */
export const MIN_LISTENED = 0.9;
/** Otomatik analizde kelimelerin bundan çoğu net anlaşılamadıysa sonuçlar yaklaşıktır (uyarı verilir). */
export const UNCLEAR_HIGH = 0.1;
/** Duraklama sayımı: bu süreden uzun sessizlikler; ve uzun duraklamalar. */
export const PAUSE_MS = 1000;
export const LONG_PAUSE_MS = 3000;

export interface OralCounts {
  sub: number;
  omit: number;
  help: number;
  ins: number;
  self: number;
  rep: number;
  syl: number;
  hes: number;
  /** Otomatik analizde konuşma tanımanın net ayırt edemediği kelimeler (hata sayılmaz). */
  unclear: number;
  /** Anlamı bozan yanlış okumalar (yalnızca anlam sorusu cevaplananlar arasında). */
  meaningChanged: number;
  meaningKept: number;
  kinds: Record<OralSubKind, number>;
}

export interface OralMarkedToken {
  text: string;
  s?: OralStatus;
  said?: string;
  rep?: boolean;
  syl?: boolean;
  hes?: boolean;
  ins?: number;
}

export interface OralResult {
  passageKey: string;
  passageGrade: number;
  genre: OralPassage['genre'];
  title: string;
  wordCount: number;
  recordMs: number;
  readingMs: number;
  timingAuto: boolean;
  counts: OralCounts;
  errors: number;
  wordsCorrect: number;
  accuracyPct: number;
  wpm: number;
  wcpm: number;
  accuracyLevel: OralLevel;
  comprehension: {
    correct: number;
    total: number;
    pct: number;
    level: OralLevel;
    skills: Record<ReadingQuestion['skill'], { correct: number; total: number }>;
  };
  retell: { recorded: boolean; mentioned: string[]; total: number; core: number; coreTotal: number } | null;
  /** Akıcılık derecelendirmesi; otomatik analizde yoktur (null). */
  prosody: (OralProsody & { total: number }) | null;
  level: OralLevel;
  pauses: { count: number; long: number; longestMs: number; perMinute: number } | null;
  audio: OralAudioSummary | null;
  marked: OralMarkedToken[][];
  flags: {
    /** Otomatik analiz: işaretleri cihazdaki konuşma tanıma verdi. */
    auto: boolean;
    /** Otomatik analizde kelimelerin %10'undan çoğu net anlaşılamadı: sonuçlar yaklaşıktır. */
    unclearHigh: boolean;
    /** Kaydın tamamı dinlenmeden işaretlendi (yalnızca yetişkinin işaretlediği sürümde). */
    partialListen: boolean;
    interrupted: boolean;
    /** Okuma süresi metne göre çok kısa. */
    tooFast: boolean;
    /** Okuma süresi düğmelere göre ölçüldü (kayıtta konuşmanın başı ve sonu bulunamadı). */
    manualTiming: boolean;
    /** Ses kalitesi duraklamaları ölçmeye elverişli değil. */
    pausesUnreliable: boolean;
  };
}

export class OralInputError extends Error {}

const LEVEL_RANK: Record<OralLevel, number> = { hard: 0, support: 1, easy: 2 };

export function accuracyLevel(pct: number): OralLevel {
  if (pct >= ORAL_CRITERIA.accuracy.easy) return 'easy';
  if (pct >= ORAL_CRITERIA.accuracy.support) return 'support';
  return 'hard';
}

export function comprehensionLevel(pct: number): OralLevel {
  if (pct >= ORAL_CRITERIA.comprehension.easy) return 'easy';
  if (pct >= ORAL_CRITERIA.comprehension.support) return 'support';
  return 'hard';
}

export function lowerLevel(a: OralLevel, b: OralLevel): OralLevel {
  return LEVEL_RANK[a] <= LEVEL_RANK[b] ? a : b;
}

/** Öğrencinin sınıfı için seçilebilecek metinler: kendi sınıfı ve bir alt ile bir üst sınıfın metinleri. */
export function oralPassagesFor(def: OralReadingInstrument, grade: number): OralPassage[] {
  return def.passages.filter((p) => Math.abs(p.grade - grade) <= 1);
}

export function scoreOral(def: OralReadingInstrument, grade: number, input: OralInput): OralResult {
  const passage = oralPassagesFor(def, grade).find((p) => p.key === input.passageKey);
  if (!passage) throw new OralInputError('Metin bu sınıf düzeyi için seçilemez.');
  const tokens = oralTokens(passage.paragraphs);
  const n = tokens.reduce((k, p) => k + p.length, 0);
  const auto = input.auto === true;
  if (auto) {
    if (input.prosody !== null) throw new OralInputError('Otomatik analizde akıcılık derecelendirmesi gönderilmez.');
    if (input.retell !== null) throw new OralInputError('Otomatik analizde yeniden anlatma gönderilmez.');
  } else {
    if (!input.prosody) throw new OralInputError('Akıcılık derecelendirmesi gerekiyor.');
    if (input.listened === undefined) throw new OralInputError('Dinleme oranı gerekiyor.');
  }

  const counts: OralCounts = {
    sub: 0,
    omit: 0,
    help: 0,
    ins: 0,
    self: 0,
    rep: 0,
    syl: 0,
    hes: 0,
    unclear: 0,
    meaningChanged: 0,
    meaningKept: 0,
    kinds: { suffix: 0, similar: 0, reversal: 0, nonword: 0 },
  };
  for (const [k, m] of Object.entries(input.marks)) {
    const i = Number(k);
    if (!Number.isInteger(i) || i < 0 || i >= n || String(i) !== k) throw new OralInputError('Geçersiz işaret.');
    // "Net anlaşılamadı" yalnızca konuşma tanımadan, "yardımla okuma" yalnızca yanındaki yetişkinden gelebilir.
    if ((m.s === 'unclear' && !auto) || (m.s === 'help' && auto)) throw new OralInputError('Geçersiz işaret.');
    if (m.s) counts[m.s] += 1;
    if (m.s === 'sub') {
      if (m.kind) counts.kinds[m.kind] += 1;
      if (m.meaning === true) counts.meaningChanged += 1;
      if (m.meaning === false) counts.meaningKept += 1;
    }
    if (m.rep) counts.rep += 1;
    if (m.syl) counts.syl += 1;
    if (m.hes) counts.hes += 1;
    if (m.ins) counts.ins += m.ins;
  }
  // Net anlaşılamayan kelimeler hata sayılmaz (doğru okunmuş gibi hesaba katılır).
  const missed = counts.sub + counts.omit + counts.help;
  const errors = missed + counts.ins;
  const wordsCorrect = n - missed;
  const accuracy = Math.max(0, ((n - errors) / n) * 100);
  const minutes = Math.max(input.readingMs, 1000) / 60000;
  const wpm = n / minutes;
  const wcpm = wordsCorrect / minutes;

  const skills: OralResult['comprehension']['skills'] = {
    literal: { correct: 0, total: 0 },
    inference: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    main_idea: { correct: 0, total: 0 },
  };
  let correct = 0;
  for (const q of passage.questions) {
    const a = input.answers[q.key];
    if (a === undefined) throw new OralInputError('Bütün soruların cevaplanması gerekiyor.');
    if (!q.options.some((o) => o.key === a)) throw new OralInputError('Geçersiz cevap.');
    skills[q.skill].total += 1;
    if (a === q.answer) {
      correct += 1;
      skills[q.skill].correct += 1;
    }
  }
  for (const k of Object.keys(input.answers)) {
    if (!passage.questions.some((q) => q.key === k)) throw new OralInputError('Geçersiz cevap.');
  }
  const total = passage.questions.length;
  const compPct = (correct / total) * 100;

  let retell: OralResult['retell'] = null;
  if (input.retell) {
    const keys = new Set(passage.ideas.map((x) => x.key));
    for (const k of input.retell.ideas) if (!keys.has(k)) throw new OralInputError('Geçersiz fikir.');
    const said = new Set(input.retell.ideas);
    const mentioned = passage.ideas.filter((x) => said.has(x.key)).map((x) => x.key);
    retell = {
      recorded: input.retell.recorded,
      mentioned,
      total: passage.ideas.length,
      core: passage.ideas.filter((x) => x.core && said.has(x.key)).length,
      coreTotal: passage.ideas.filter((x) => x.core).length,
    };
  }

  const p = input.prosody;
  const prosody = p ? { ...p, total: p.expression + p.phrasing + p.smoothness + p.pace } : null;
  const accLevel = accuracyLevel(accuracy);
  const compLevel = comprehensionLevel(compPct);

  const audio = input.audio;
  const pausesUnreliable = !audio || audio.quality !== 'good' || audio.interrupted || !input.timingAuto;
  let pauses: OralResult['pauses'] = null;
  if (!pausesUnreliable && audio) {
    const lens = audio.pauses.map(([a, b]) => b - a);
    const count = lens.filter((l) => l >= PAUSE_MS).length;
    pauses = {
      count,
      long: lens.filter((l) => l >= LONG_PAUSE_MS).length,
      longestMs: lens.length ? Math.max(...lens) : 0,
      perMinute: round(count / minutes, 1),
    };
  }

  const marked: OralMarkedToken[][] = tokens.map((para) =>
    para.map((t) => {
      const m = input.marks[String(t.i)];
      if (!m) return { text: t.text };
      const out: OralMarkedToken = { text: t.text };
      if (m.s) out.s = m.s;
      if (m.s === 'sub' && m.said) out.said = m.said;
      if (m.rep) out.rep = true;
      if (m.syl) out.syl = true;
      if (m.hes) out.hes = true;
      if (m.ins) out.ins = m.ins;
      return out;
    }),
  );

  return {
    passageKey: passage.key,
    passageGrade: passage.grade,
    genre: passage.genre,
    title: passage.title,
    wordCount: n,
    recordMs: Math.round(input.recordMs),
    readingMs: Math.round(input.readingMs),
    timingAuto: input.timingAuto,
    counts,
    errors,
    wordsCorrect,
    accuracyPct: round(accuracy, 1),
    wpm: round(wpm, 0),
    wcpm: round(wcpm, 0),
    accuracyLevel: accLevel,
    comprehension: { correct, total, pct: round(compPct, 0), level: compLevel, skills },
    retell,
    prosody,
    level: lowerLevel(accLevel, compLevel),
    pauses,
    audio,
    marked,
    flags: {
      auto,
      unclearHigh: auto && counts.unclear > n * UNCLEAR_HIGH,
      partialListen: !auto && (input.listened ?? 0) < MIN_LISTENED,
      interrupted: !!audio?.interrupted,
      tooFast: wpm > ORAL_MAX_WPM,
      manualTiming: !input.timingAuto,
      pausesUnreliable,
    },
  };
}
