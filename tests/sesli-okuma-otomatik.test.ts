import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { TARGET_RATE, analyzeRecording } from '@/lib/oral/audio';
import type { AsrRequest, AsrWord } from '@/lib/oral/auto';
import { oralTokens } from '@/lib/oral/words';
import { UNCLEAR_MAX } from '@/lib/scoring/oral';
import { AsrClient, AsrError } from '../src/components/runner/oral/asr-client';
import { AutoAnalysisError, runAutoAnalysis } from '../src/components/runner/oral/auto-analysis';

/**
 * Sesli okumada otomatik analizin sayfa tarafı (components/runner/oral): Worker'la konuşan istemci ve incelemenin
 * akışı. Konuşma tanıma burada sahte bir istemciyle yerine konur; asıl model tarayıcıda uçtan uca denenir.
 */

const passage = sesliOkuma.passages.find((p) => p.key === 'g1-kacan-top')!;
const tokens = oralTokens(passage.paragraphs).flat();

/**
 * Yapay kayıt: 1 sn sessizlik, sonra her kelime 0,3 sn ses + 0,1 sn boşluk; `gapAfter` kelimesinden sonra 1,5 sn
 * duraklama; sonunda 2 sn sessizlikten sonra 0,6 sn konuşma ("bitti"; tanınan kelimelerin dışında). Kelime zamanları
 * kaydın başından saniye.
 */
function recording(gapAfter: number) {
  const words: AsrWord[] = [];
  const spans: [number, number][] = [];
  let t = 1;
  tokens.forEach((tok, k) => {
    words.push({ text: tok.text, start: +t.toFixed(2), end: +(t + 0.3).toFixed(2) });
    spans.push([t, t + 0.3]);
    t += 0.4;
    if (k === gapAfter) t += 1.5;
  });
  const lastWordEnd = t - 0.1;
  spans.push([t + 2, t + 2.6]);
  const total = t + 3.5;
  const samples = new Float32Array(Math.round(total * TARGET_RATE));
  let seed = 7;
  for (let i = 0; i < samples.length; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    samples[i] = ((seed / 2147483648) * 2 - 1) * 0.001; // gürültü tabanı
  }
  for (const [a, b] of spans) {
    for (let i = Math.round(a * TARGET_RATE); i < Math.round(b * TARGET_RATE); i++) samples[i] += 0.3 * Math.sin((2 * Math.PI * 220 * i) / TARGET_RATE);
  }
  return { words, samples, lastWordEnd };
}

/** Konuşma tanımanın yerine: okumayı ve doğrulama parçalarını önceden verilen kelimelerle "yazıya döker". */
function fakeClient(words: AsrWord[]) {
  return {
    transcribe: async () => words,
    transcribeClips: async (clips: Float32Array[]) => clips.map(() => null),
  } as unknown as AsrClient;
}

describe('otomatik analiz akışı', () => {
  it('ses özeti okuma süresinin aralığından: eğri ve duraklamalar ilk ve son tanınan kelimeye göre', async () => {
    const { words, samples } = recording(5);
    const analysis = analyzeRecording(samples, TARGET_RATE);
    const r = await runAutoAnalysis({ client: fakeClient(words), paragraphs: passage.paragraphs, samples, analysis, onProgress: () => {} });
    expect(r.unclear).toBe(0);
    // Hata yok; 6. kelimeden önceki 1,5 sn'lik duraklama (cümle içinde) duraksama.
    expect(r.marks).toEqual({ 6: { hes: true } });
    const first = words[0].start * 1000;
    const last = words[words.length - 1].end * 1000;
    expect(Math.abs(r.readingMs - (last - first))).toBeLessThanOrEqual(1);
    // Bütün kaydın çözümlemesi sondaki "bitti"yi de okuma sayar; incelemeninki saymaz.
    expect(analysis.speechEndMs! - analysis.speechStartMs!).toBeGreaterThan(r.readingMs + 2000);
    expect(r.audio.speechStartMs).toBe(Math.round(first / 20) * 20);
    expect(r.audio.speechEndMs! - r.audio.speechStartMs!).toBeCloseTo(r.readingMs, -2);
    expect(r.audio.contour).toHaveLength(120);
    // 6. kelimeden sonraki 1,5 sn'lik duraklama, okumanın başından ölçülür ve okuma süresinin içinde kalır.
    const long = r.audio.pauses.filter(([a, b]) => b - a >= 1000);
    expect(long).toHaveLength(1);
    const expected = words[5].end * 1000 - first;
    expect(Math.abs(long[0][0] - expected)).toBeLessThanOrEqual(60);
    for (const [a, b] of r.audio.pauses) expect(a >= 0 && b <= r.readingMs + 20).toBe(true);
    // Kalite ve düzeyler bütün kayıttan.
    expect([r.audio.quality, r.audio.noiseDb, r.audio.speechDb]).toEqual([analysis.quality, analysis.noiseDb, analysis.speechDb]);
  });

  it(`kelimelerin %${UNCLEAR_MAX * 100}'undan çoğu net anlaşılamazsa rapor verilmez: yeniden okuma istenir`, async () => {
    const { words, samples } = recording(-1);
    const analysis = analyzeRecording(samples, TARGET_RATE);
    // Kelimelerin çoğunda yalnızca ek farkı (konuşma tanımanın sık yanlışı; doğrulama da sonuç vermedi): net anlaşılamadı.
    const garbled = words.map((w, k) => (k % 5 < 3 && w.text.replace(/[^\p{L}]/gu, '').length >= 3 ? { ...w, text: `${w.text.replace(/[^\p{L}]/gu, '')}ler` } : w));
    const run = (ws: AsrWord[]) =>
      runAutoAnalysis({ client: fakeClient(ws), paragraphs: passage.paragraphs, samples, analysis, onProgress: () => {} });
    const ok = await run(words);
    expect(ok.unclear).toBe(0);
    // Sınırın altında: rapor verilir, net anlaşılamayanlar sayılır.
    const few = await run(words.map((w, k) => (k === 10 || k === 20 ? { ...w, text: `${w.text.replace(/[^\p{L}]/gu, '')}ler` } : w)));
    expect(few.unclear).toBe(2);
    const bad = run(garbled);
    await expect(bad).rejects.toBeInstanceOf(AutoAnalysisError);
    await expect(bad).rejects.toMatchObject({ kind: 'nomatch' });
  });

  it('ekrandaki metin yerine başka bir metin okunduysa rapor verilmez', async () => {
    const { words, samples } = recording(-1);
    const analysis = analyzeRecording(samples, TARGET_RATE);
    const other = sesliOkuma.passages.find((p) => p.key !== passage.key && p.grade === passage.grade)!;
    const said = other.paragraphs.join(' ').split(/\s+/);
    const ws = words.map((w, k) => ({ ...w, text: said[k % said.length] }));
    const run = runAutoAnalysis({ client: fakeClient(ws), paragraphs: passage.paragraphs, samples, analysis, onProgress: () => {} });
    await expect(run).rejects.toMatchObject({ kind: 'nomatch' });
  });
});

/* ---------- İstemci: tek iş parçacığına geri dönüş ---------- */

const made: string[] = [];

class FakeWorker {
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onerror: unknown = null;
  onmessageerror: unknown = null;
  private threads: number;
  constructor(url: string, options?: { type?: string }) {
    void options?.type;
    if (!url.startsWith('/')) throw new Error('geçersiz adres');
    made.push(url);
    const th = new URL(url, 'https://x').searchParams.get('th');
    this.threads = th ? Number(th) : 4;
  }
  postMessage(req: AsrRequest) {
    const reply = (data: unknown) => queueMicrotask(() => this.onmessage?.({ data }));
    if (req.type === 'load') {
      if (this.threads > 1) reply({ id: req.id, type: 'error', kind: 'memory', message: 'Out of memory', threads: this.threads });
      else reply({ id: req.id, type: 'loaded', backend: 'wasm', threads: 1 });
    } else if (req.type === 'transcribe') {
      reply({ id: req.id, type: 'words', words: [] });
    }
  }
  terminate() {}
}

describe('yapay zekâ istemcisi', () => {
  beforeAll(() => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('Worker', FakeWorker);
  });
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('çok iş parçacığıyla kurulurken bellek yetmezse bir kez tek iş parçacığıyla yeniden kurar', async () => {
    expect(AsrClient.supported()).toBe(true);
    made.length = 0;
    const c = new AsrClient();
    await expect(c.load()).resolves.toMatchObject({ threads: 1 });
    expect(made).toHaveLength(2);
    expect(new URL(made[0], 'https://x').searchParams.get('th')).toBeNull();
    expect(new URL(made[1], 'https://x').searchParams.get('th')).toBe('1');
    c.dispose();
  });

  it('tek iş parçacığında da bellek yetmezse hata bellek hatasıdır', async () => {
    class AlwaysOom extends FakeWorker {
      postMessage(req: AsrRequest) {
        queueMicrotask(() => this.onmessage?.({ data: { id: req.id, type: 'error', kind: 'memory', message: 'oom', threads: 1 } }));
      }
    }
    vi.stubGlobal('Worker', AlwaysOom);
    const c = new AsrClient();
    const err = await c.load().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(AsrError);
    expect((err as AsrError).kind).toBe('memory');
    vi.stubGlobal('Worker', FakeWorker);
  });
});
