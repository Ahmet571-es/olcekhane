import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { TARGET_RATE, analyzeRecording, highPass } from '@/lib/oral/audio';
import type { AsrRequest, AsrWord } from '@/lib/oral/auto';
import { oralTokens } from '@/lib/oral/words';
import { UNCLEAR_MAX } from '@/lib/scoring/oral';
import { AsrClient, AsrError } from '../src/components/runner/oral/asr-client';
import { AutoAnalysisError, runAutoAnalysis } from '../src/components/runner/oral/auto-analysis';
import { SENTENCE_MS, judgeSentence } from '../src/components/runner/oral/mic-check';

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

/* ---------- Gürültüye dayanıklılık ---------- */

describe('gürültülü ortam', () => {
  const sine = (hz: number, sec: number, amp: number) =>
    Float32Array.from({ length: Math.round(sec * TARGET_RATE) }, (_, i) => amp * Math.sin((2 * Math.PI * hz * i) / TARGET_RATE));
  const rmsDb = (x: Float32Array, from = 0) => {
    let s = 0;
    for (let i = from; i < x.length; i++) s += x[i] * x[i];
    return 10 * Math.log10(s / (x.length - from));
  };

  it('yüksek geçiren süzgeç makine uğultusunu atar, konuşma bandını geçirir; Worker’daki süzgeçle aynı', () => {
    const skip = TARGET_RATE / 2; // süzgecin oturması
    expect(rmsDb(sine(300, 2, 0.3), skip) - rmsDb(highPass(sine(300, 2, 0.3), TARGET_RATE), skip)).toBeLessThan(1);
    expect(rmsDb(sine(40, 2, 0.3), skip) - rmsDb(highPass(sine(40, 2, 0.3), TARGET_RATE), skip)).toBeGreaterThan(20);
    // Worker (paketlenmeyen düz JS) aynı katsayılarla süzer.
    const src = readFileSync(path.join(import.meta.dirname, '..', 'public/okuma/analiz-isci.js'), 'utf8');
    const fn = src.slice(src.indexOf('function highPass('), src.indexOf('\n}\n', src.indexOf('function highPass(')) + 2);
    const workerHighPass = new Function('SR', `${fn}; return highPass;`)(TARGET_RATE) as (x: Float32Array) => Float32Array;
    let seed = 3;
    const noise = Float32Array.from({ length: 16000 }, () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 0.4);
    const a = highPass(noise, TARGET_RATE);
    const b = workerHighPass(Float32Array.from(noise));
    expect(Math.max(...a.map((v, i) => Math.abs(v - b[i])))).toBeLessThan(1e-5);
  });

  it('ses çözümlemesi konuşmayı yüksek makine uğultusundan ayırır (duraklamalar bulunur)', () => {
    // 1 sn konuşma, 1,5 sn duraklama, 1 sn konuşma; üstünde konuşmadan yüksek 40 Hz uğultu.
    const speech = new Float32Array(TARGET_RATE * 4.5);
    const on = (a: number, b: number) => {
      for (let i = Math.round(a * TARGET_RATE); i < Math.round(b * TARGET_RATE); i++) speech[i] = 0.2 * Math.sin((2 * Math.PI * 220 * i) / TARGET_RATE);
    };
    on(0.5, 1.5);
    on(3, 4);
    const rumble = sine(40, 4.5, 0.5);
    const a = analyzeRecording(speech.map((v, i) => v + rumble[i]), TARGET_RATE);
    expect(a.quality).not.toBe('silent');
    expect(a.pauses.filter(([x, y]) => y - x >= 1000)).toHaveLength(1);
    expect(Math.abs((a.speechStartMs ?? 0) - 500)).toBeLessThanOrEqual(40);
  });

  it('mikrofon denemesi: gürültü cümleyi engellemez, yapay zekâya gider; yalnızca kesinti ve hiç ses gelmemesi engeller', () => {
    const rec = (samples: Float32Array, interrupted = false) => ({
      samples,
      sampleRate: TARGET_RATE,
      durationMs: (samples.length / TARGET_RATE) * 1000,
      wallMs: (samples.length / TARGET_RATE) * 1000,
      interrupted,
    });
    let seed = 11;
    const noise = (amp: number) =>
      Float32Array.from({ length: Math.round(TARGET_RATE * (SENTENCE_MS / 1000)) }, () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 2 * amp);
    const withSpeech = (base: Float32Array, amp: number) => {
      const x = Float32Array.from(base);
      const s = sine(220, 2.5, amp);
      x.set(s.map((v, i) => v + x[TARGET_RATE + i]), TARGET_RATE);
      return x;
    };
    expect(judgeSentence(rec(withSpeech(noise(0.001), 0.2)))).toEqual({ fail: null, hint: null });
    // Sürekli yüksek gürültünün üstünde konuşma: engel değil, ipucu.
    expect(judgeSentence(rec(withSpeech(noise(0.1), 0.15)))).toEqual({ fail: null, hint: 'noisy' });
    // Kısık ama sesi gelen konuşma: yapay zekâ karar verir.
    expect(judgeSentence(rec(withSpeech(noise(0.0003), 0.008))).fail).toBeNull();
    expect(judgeSentence(rec(noise(0.0005)))).toEqual({ fail: 'silent', hint: null });
    expect(judgeSentence(rec(withSpeech(noise(0.001), 0.2), true))).toEqual({ fail: 'interrupted', hint: null });
  });
});
