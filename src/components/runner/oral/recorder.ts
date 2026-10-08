'use client';

import { Resampler, TARGET_RATE, chunkLevel, joinChunks } from '@/lib/oral/audio';

/**
 * Mikrofondan ses kaydı (yalnızca bu sayfada, cihazın belleğinde). Ses sıkıştırılmadan, örnek örnek alınır ve 16 kHz'e
 * indirilir; kayıt hiçbir yere gönderilmez, saklanmaz ve sayfa kapanınca silinir.
 *
 * Kayıt güvenilirliği için:
 * - AudioWorklet (yoksa eski ScriptProcessor) ile her örnek alınır; tarayıcıların sıkıştırılmış kayıt biçimlerindeki
 *   süre ve atlama sorunları yaşanmaz.
 * - Kesinti denetimi: kayıt süresince gelen örneklerin toplam süresi geçen gerçek süreyle karşılaştırılır; ekran
 *   kapanır, sekme arka plana geçer ya da başka bir uygulama mikrofonu alırsa kesinti olarak işaretlenir.
 */

export type MicErrorKind = 'unsupported' | 'denied' | 'notfound' | 'busy' | 'lost' | 'unknown';

export class MicError extends Error {
  constructor(readonly kind: MicErrorKind) {
    super(kind);
  }
}

export interface Recording {
  samples: Float32Array;
  sampleRate: number;
  /** Kayıttaki sesin süresi ve düğmeye basılmasından durdurulmasına kadar geçen gerçek süre (ms). */
  durationMs: number;
  wallMs: number;
  interrupted: boolean;
}

type AnyWindow = Window & { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };

const WORKLET_URL = '/okuma/kayit-isleyici.js';

export function micSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as AnyWindow;
  const md: Partial<MediaDevices> | undefined = navigator.mediaDevices;
  return !!(md && typeof md.getUserMedia === 'function' && (w.AudioContext || w.webkitAudioContext) && window.isSecureContext);
}

function toMicError(err: unknown): MicError {
  const name = err instanceof DOMException || err instanceof Error ? err.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') return new MicError('denied');
  if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError') return new MicError('notfound');
  if (name === 'NotReadableError' || name === 'AbortError' || name === 'TrackStartError') return new MicError('busy');
  return new MicError('unknown');
}

export class MicRecorder {
  private chunks: Float32Array[] = [];
  private resampler: Resampler | null = null;
  private recording = false;
  private startedAt = 0;
  private inSamples = 0;
  private lastChunkAt = 0;
  private maxGapMs = 0;
  private broken = false;
  /** Kayıt sürerken ekranın kararmasını önler (desteklenen tarayıcılarda); ekran kararırsa kayıt kesilebilir. */
  private wakeLock: { release: () => Promise<void> } | null = null;
  private hiddenListener = () => {
    if (this.recording && document.visibilityState === 'hidden') this.broken = true;
  };
  /** Son parçanın ses düzeyi (dBFS) ve tepe değeri; seviye göstergesi okur. */
  level = { db: -100, peak: 0 };
  /** Mikrofonun bağlantısı koptu (ör. kulaklık çıkarıldı, izin geri alındı). */
  lost = false;

  private constructor(
    private readonly ctx: AudioContext,
    private readonly stream: MediaStream,
    private readonly nodes: AudioNode[],
  ) {}

  get inRate(): number {
    return this.ctx.sampleRate;
  }

  /** Mikrofonu açar (tarayıcı izin ister). Bir düğmeye basılınca çağrılmalıdır: tarayıcılar sesi ancak öyle başlatır. */
  static async open(): Promise<MicRecorder> {
    if (!micSupported()) throw new MicError('unsupported');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      throw toMicError(err);
    }
    const w = window as AnyWindow;
    const Ctx = w.AudioContext ?? w.webkitAudioContext!;
    const ctx = new Ctx();
    try {
      if (ctx.state !== 'running') await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const mute = ctx.createGain();
      mute.gain.value = 0;
      let rec: MicRecorder;
      if (ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
        await ctx.audioWorklet.addModule(WORKLET_URL);
        const node = new AudioWorkletNode(ctx, 'olcekhane-kayit', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] });
        rec = new MicRecorder(ctx, stream, [source, node, mute]);
        node.port.onmessage = (e: MessageEvent<Float32Array>) => rec.onChunk(e.data);
        source.connect(node);
        node.connect(mute);
      } else {
        const node = ctx.createScriptProcessor(4096, 1, 1);
        rec = new MicRecorder(ctx, stream, [source, node, mute]);
        node.onaudioprocess = (e: AudioProcessingEvent) => rec.onChunk(new Float32Array(e.inputBuffer.getChannelData(0)));
        source.connect(node);
        node.connect(mute);
      }
      mute.connect(ctx.destination);
      for (const t of stream.getAudioTracks()) {
        t.addEventListener('ended', () => {
          rec.lost = true;
          rec.broken = true;
        });
      }
      ctx.addEventListener('statechange', () => {
        if (ctx.state !== 'running' && rec.recording) rec.broken = true;
      });
      document.addEventListener('visibilitychange', rec.hiddenListener);
      return rec;
    } catch (err) {
      for (const t of stream.getTracks()) t.stop();
      void ctx.close().catch(() => {});
      throw err instanceof MicError ? err : new MicError('unknown');
    }
  }

  private onChunk(x: Float32Array) {
    this.level = chunkLevel(x);
    if (!this.recording || !this.resampler) return;
    const now = performance.now();
    if (this.lastChunkAt) this.maxGapMs = Math.max(this.maxGapMs, now - this.lastChunkAt);
    this.lastChunkAt = now;
    this.inSamples += x.length;
    this.chunks.push(this.resampler.push(x));
  }

  /**
   * Ses bağlamı durmuşsa (iPhone'da ekran kilitlenince ya da arama gelince olur) yeniden başlatmayı dener. Bazı
   * tarayıcılarda resume() hiç sonuçlanmayabiliyor: en çok 2 sn beklenir, düğme takılı kalmaz.
   */
  async wake(): Promise<boolean> {
    if (this.ctx.state !== 'running') {
      await Promise.race([this.ctx.resume().catch(() => {}), new Promise((r) => setTimeout(r, 2000))]);
    }
    return this.ctx.state === 'running' && !this.lost;
  }

  async start(): Promise<void> {
    await this.wake();
    this.chunks = [];
    this.resampler = new Resampler(this.ctx.sampleRate, TARGET_RATE);
    this.inSamples = 0;
    this.lastChunkAt = 0;
    this.maxGapMs = 0;
    this.broken = this.lost || this.ctx.state !== 'running';
    this.startedAt = performance.now();
    this.recording = true;
    // Ekranın kararmaması istenir ama beklenmez: bazı tarayıcılarda istek geç ya da hiç sonuçlanmıyor, kayıt beklemesin.
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
      const req = nav.wakeLock?.request('screen');
      if (req) {
        req.then(
          (lock) => {
            if (this.recording && !this.wakeLock) this.wakeLock = lock;
            else void lock.release().catch(() => {});
          },
          () => {},
        );
      }
    } catch {
      this.wakeLock = null;
    }
  }

  private releaseWakeLock() {
    void this.wakeLock?.release().catch(() => {});
    this.wakeLock = null;
  }

  /** Geçen süre (ms), kayıt sürerken. */
  elapsedMs(): number {
    return this.recording ? performance.now() - this.startedAt : 0;
  }

  get isRecording(): boolean {
    return this.recording;
  }

  stop(): Recording {
    const wallMs = performance.now() - this.startedAt;
    this.recording = false;
    this.releaseWakeLock();
    const samples = joinChunks(this.chunks);
    this.chunks = [];
    const capturedMs = (this.inSamples / this.ctx.sampleRate) * 1000;
    const interrupted = this.broken || this.maxGapMs > 1500 || capturedMs < wallMs - Math.max(1500, wallMs * 0.05);
    return { samples, sampleRate: TARGET_RATE, durationMs: (samples.length / TARGET_RATE) * 1000, wallMs, interrupted };
  }

  /** Kaydı bırakır ve mikrofonu kapatır (tarayıcıdaki kayıt simgesi söner). */
  close(): void {
    this.recording = false;
    this.releaseWakeLock();
    document.removeEventListener('visibilitychange', this.hiddenListener);
    for (const n of this.nodes) {
      try {
        n.disconnect();
      } catch {
        /* zaten ayrılmış */
      }
    }
    for (const t of this.stream.getTracks()) t.stop();
    void this.ctx.close().catch(() => {});
  }
}
