import { alignWords, buildAutoMarks, foldWord, normalizeWord, planVerification, similarity } from '@/lib/oral/align';
import { TARGET_RATE, type AudioAnalysis } from '@/lib/oral/audio';
import { MIC_CHECK_SENTENCE, type AsrWord } from '@/lib/oral/auto';
import { oralWordCount } from '@/lib/oral/words';
import type { OralMark } from '@/lib/scoring/oral';
import type { AsrClient, AsrProgress } from './asr-client';

/**
 * Sesli okumanın cihazda otomatik incelenmesi (öğrencinin tek başına okuduğu akış). Kayıt bu cihazdaki konuşma tanıma
 * modeliyle yazıya dökülür, metinle karşılaştırılır, emin olunamayan yerler kısa parçalar hâlinde yeniden dinlenir ve
 * sonuç yetişkinin işaretlediği sürümle aynı biçimde kelime işaretlerine çevrilir. Ses hiçbir yere gönderilmez; buradan
 * yalnızca işaretler ve süreler döner. Sesi silmek çağıranın işidir (`wipeAudio`).
 */

export type AnalysisErrorKind = 'memory' | 'network' | 'unsupported' | 'unknown' | 'nomatch';

/** Yazıya dökülen kelimeler metnin bu oranından azsa (konuşma varken) tanıma başarısız sayılır: rapor yanıltmasın. */
const MIN_WORD_SHARE = 0.15;
/** Tek ilerleme çubuğunda yazıya dökmenin payı; kalanı belirsiz yerlerin yeniden dinlenmesi. */
const TRANSCRIBE_SHARE = 0.8;
/** Mikrofon denemesi: cümlenin kelimelerinin en az bu oranı tanınmalı; kelime benzerliği (katlanmış biçimde) en az bu kadar. */
export const MIC_PASS_RATIO = 0.6;
const MIC_WORD_SIMILARITY = 0.8;

/** Yapay zekâ okumayı metinle eşleştiremedi (ör. çok az kelime tanındı); yeniden incelemek sonucu değiştirmez. */
export class AutoAnalysisError extends Error {
  constructor(readonly kind: 'nomatch') {
    super(kind);
  }
}

/** Hatanın türü (AsrError ya da AutoAnalysisError); bilinmeyenler ve durdurulanlar 'unknown'. */
export function analysisErrorKind(err: unknown): AnalysisErrorKind {
  const k = (err as { kind?: unknown } | null)?.kind;
  return k === 'memory' || k === 'network' || k === 'unsupported' || k === 'nomatch' ? k : 'unknown';
}

/** Bellekteki sesi sıfırlar. Worker'a devredilip boşalmış (detached) bir dizide hata vermez. */
export function wipeAudio(a: Float32Array | null | undefined): void {
  if (!a) return;
  try {
    a.fill(0);
  } catch {
    // devredilmiş dizi: içinde ses kalmadı
  }
}

export interface AutoAnalysisResult {
  marks: Record<string, OralMark>;
  readingMs: number;
  timingAuto: true;
  /** Konuşma tanımanın net ayırt edemediği kelime sayısı (hata sayılmaz, raporda ayrıca gösterilir). */
  unclear: number;
}

/**
 * Okumayı inceler: yazıya dökme → metinle hizalama → belirsiz yerlerin kısa parçalar hâlinde yeniden dinlenmesi →
 * kelime işaretleri. `onProgress(oran, hazırlanıyor)`: tek çubuk için 0–1 (yazıya dökme ~%80, doğrulama ~%20);
 * `hazırlanıyor` Worker modeli yeniden kuruyorsa (ör. bellek hatasından sonra) true.
 */
export async function runAutoAnalysis({
  client,
  paragraphs,
  samples,
  analysis,
  onProgress,
}: {
  client: AsrClient;
  paragraphs: string[];
  /** Okuma kaydı, 16 kHz tek kanal. Değiştirilmez; istemci kendi kopyasını Worker'a devreder. */
  samples: Float32Array;
  /** Aynı kaydın cihazdaki ses çözümlemesi (konuşmanın başı, sonu ve duraklamalar). */
  analysis: AudioAnalysis;
  onProgress: (ratio: number, preparing: boolean) => void;
}): Promise<AutoAnalysisResult> {
  let shown = 0;
  const report = (r: number, preparing = false) => {
    shown = Math.max(shown, Math.min(1, r));
    onProgress(shown, preparing);
  };
  const stageOf = (from: number, share: number) => (p: AsrProgress) => {
    if (p.stage === 'transcribe') report(from + share * p.ratio);
    else report(from, true);
  };
  report(0);

  const words = await client.transcribe(samples, stageOf(0, TRANSCRIBE_SHARE));
  report(TRANSCRIBE_SHARE);
  if (analysis.speechMs > 0 && words.length < MIN_WORD_SHARE * oralWordCount(paragraphs)) throw new AutoAnalysisError('nomatch');

  const al = alignWords(paragraphs, words);
  const clips = planVerification(al, samples.length / TARGET_RATE);
  let clipWords: AsrWord[][] | null = null;
  if (clips.length > 0) {
    const parts = clips.map((c) =>
      samples.subarray(Math.max(0, Math.floor(c.start * TARGET_RATE)), Math.min(samples.length, Math.ceil(c.end * TARGET_RATE))),
    );
    try {
      const got = await client.transcribeClips(parts, stageOf(TRANSCRIBE_SHARE, 1 - TRANSCRIBE_SHARE));
      clipWords = got.length === clips.length ? got : null;
    } catch {
      // Doğrulama yapılamazsa ilk yazıya dökmeyle devam edilir (belirsiz yerler "net değil" kalır).
      clipWords = null;
    }
  }

  const start = analysis.speechStartMs;
  const auto = buildAutoMarks(al, clips, clipWords, {
    speechStartMs: start,
    speechEndMs: analysis.speechEndMs,
    pauses: start === null ? [] : analysis.pauses.map(([s, e]) => [s + start, e + start] as [number, number]),
  });
  report(1);
  return {
    marks: auto.marks,
    readingMs: Math.max(1000, Math.round(auto.readingEndMs - auto.readingStartMs)),
    timingAuto: true,
    unclear: auto.unclear,
  };
}

/**
 * Mikrofon denemesi: yapay zekâ ekrandaki cümleyi tanıdı mı? Cümlenin kelimelerinin kaçta kaçı tanınan kelimeler
 * arasında var (normalizeWord ve foldWord ile; hizalamadaki gibi, uzun kelimelerde tek harflik fark hoş görülür).
 * `heard`: tanınan metin.
 */
export function sentenceMatch(words: AsrWord[], sentence: string = MIC_CHECK_SENTENCE): { ratio: number; heard: string } {
  const fold = (s: string) => normalizeWord(s).split(' ').filter(Boolean).map(foldWord);
  const want = fold(sentence);
  const got = words.flatMap((w) => fold(w.text));
  const used = new Set<number>();
  let hit = 0;
  for (const w of want) {
    const i = got.findIndex((g, j) => !used.has(j) && (g === w || similarity(g, w) >= MIC_WORD_SIMILARITY));
    if (i >= 0) {
      used.add(i);
      hit++;
    }
  }
  return {
    ratio: want.length ? hit / want.length : 0,
    heard: words
      .map((w) => w.text.trim())
      .filter(Boolean)
      .join(' '),
  };
}
