import {
  ASR_MODEL,
  ASR_MODEL_BASE,
  ASR_WORKER_URL,
  ORT_BASE,
  TRANSFORMERS_URL,
  type AsrRequest,
  type AsrResponse,
  type AsrWord,
} from '@/lib/oral/auto';

/**
 * Sesli okumada otomatik analizin sayfa tarafı: konuşma tanımayı yapan Worker'ı (public/okuma/analiz-isci.js) açar,
 * isteklerini sırayla gönderir ve cevaplarını Promise olarak döndürür. Ses cihazdan çıkmaz; Worker yalnızca kendi
 * sunucumuzdaki model dosyalarını indirir ve tarayıcı deposuna hiçbir şey yazmaz.
 *
 * Kullanım:
 *   if (!AsrClient.supported()) → elle işaretlemeye dön
 *   const asr = new AsrClient();
 *   await asr.load((p) => ...);               // indirme (stage 'download', loadedBytes/totalBytes) ve kurulum ('load')
 *   const words = await asr.transcribe(samples, (p) => ...);   // 16 kHz tek kanal; zamanlar kaydın başından saniye
 *   const perClip = await asr.transcribeClips([a, b], (p) => ...); // her parça için ayrı kelimeler, zamanlar parçanın başından
 *   asr.dispose();                            // Worker kapanır, bellek boşalır; bekleyen istekler 'aborted' ile reddedilir
 * load() çağrılmadan transcribe() da modeli yükler; o zaman indirme ilerlemesi transcribe()'ın onProgress'ine gelir.
 *
 * Hatalar `AsrError` ile gelir; `kind`: 'memory' (cihazın belleği yetmedi; Worker kapatılır), 'network' (dosyalar
 * inemedi), 'unsupported' (tarayıcı desteklemiyor), 'aborted' (dispose çağrıldı), 'unknown'.
 */

type ErrorResponse = Extract<AsrResponse, { type: 'error' }>;
type ProgressResponse = Extract<AsrResponse, { type: 'progress' }>;

export type AsrErrorKind = ErrorResponse['kind'] | 'aborted';

export class AsrError extends Error {
  /** Hata sırasında Worker'ın kullandığı iş parçacığı sayısı (Worker bildirirse). */
  threads?: number;

  constructor(
    readonly kind: AsrErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'AsrError';
  }
}

export type AsrProgress = Omit<ProgressResponse, 'id' | 'type'>;
export type AsrProgressHandler = (progress: AsrProgress) => void;

export interface AsrLoadInfo {
  backend: 'wasm' | 'webgpu';
  threads: number;
  /** Worker'ın ölçtüğü yükleme süresi (indirme dâhil, ms). */
  loadMs?: number;
}

export interface AsrSendOptions {
  /**
   * true: sesin belleği kopyalanmadan Worker'a devredilir; verilen dizi(ler) bundan sonra boş (kullanılamaz) olur.
   * Varsayılan false: önce kopyalanır (90 sn'lik okuma ~6 MB), çağıran sesi dinletmeye devam edebilir.
   */
  transfer?: boolean;
}

/** Worker'ın adresi: yollar auto.ts'teki sabitlerden gelir (Worker paketlenmediği için TS sabitlerini okuyamaz). */
export function asrWorkerUrl(maxThreads?: number): string {
  const q = new URLSearchParams({
    m: ASR_MODEL_BASE,
    o: ORT_BASE,
    t: TRANSFORMERS_URL,
    id: ASR_MODEL.id,
    q: JSON.stringify(ASR_MODEL.dtype),
  });
  if (maxThreads) q.set('th', String(maxThreads));
  return `${ASR_WORKER_URL}?${q.toString()}`;
}

/** WebAssembly SIMD sınaması (ONNX Runtime Web yalnızca SIMD derlemesini kullanır). */
const SIMD_PROBE = [
  0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11,
];

function moduleWorkersSupported(): boolean {
  let used = false;
  const options = {
    get type(): WorkerType {
      used = true;
      return 'module';
    },
  };
  try {
    // Geçersiz adres: Worker hiç açılmaz, istek gitmez; tarayıcı `type` seçeneğini tanıyorsa okumuş olur.
    new Worker('http://[', options).terminate();
  } catch {
    // beklenen
  }
  return used;
}

let supportedCache: boolean | null = null;

interface Pending {
  resolve: (res: AsrResponse) => void;
  reject: (err: AsrError) => void;
  onProgress?: AsrProgressHandler;
}

type WorkerReply = AsrResponse & { warnings?: string[]; threads?: number };

export class AsrClient {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private maxThreads: number | undefined;
  private loaded: AsrLoadInfo | null = null;
  /** Son yazıya dökmenin tanılama notları (döngü bölme, kaldığı yerden devam, olası uydurma metin). */
  lastWarnings: string[] = [];

  /**
   * Bu tarayıcıda otomatik analiz çalışabilir mi: Worker (modül), WebAssembly SIMD, BigInt64Array; cihaz belleğini
   * bildiren tarayıcılarda en az 2 GB. Yalnızca tarayıcıda çağrılır (sunucuda false).
   */
  static supported(): boolean {
    if (supportedCache !== null) return supportedCache;
    if (typeof window === 'undefined') return false;
    let ok = false;
    try {
      ok =
        typeof Worker === 'function' &&
        typeof WebAssembly === 'object' &&
        typeof WebAssembly.validate === 'function' &&
        WebAssembly.validate(new Uint8Array(SIMD_PROBE)) &&
        typeof BigInt64Array === 'function' &&
        moduleWorkersSupported();
    } catch {
      ok = false;
    }
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (ok && typeof memory === 'number' && memory > 0 && memory < 2) ok = false;
    supportedCache = ok;
    return ok;
  }

  /**
   * Modeli indirir ve kurar (bir kez; sonraki çağrılar hemen döner). Çok iş parçacığıyla kurulamazsa (bellek yetmedi,
   * ör. iOS'ta paylaşılan bellek ayrılamadı; ya da başka bir hata) bir kez tek iş parçacığıyla yeniden dener.
   */
  async load(onProgress?: AsrProgressHandler): Promise<AsrLoadInfo> {
    if (this.loaded && this.worker) return this.loaded;
    const single = this.maxThreads === 1; // bellek hatasında onMessage bunu 1 yapar: önceki değer gerekir
    try {
      return await this.loadOnce(onProgress);
    } catch (err) {
      const e = err as AsrError;
      const retry = e instanceof AsrError && (e.kind === 'unknown' || e.kind === 'unsupported' || e.kind === 'memory');
      if (retry && (e.threads ?? 1) > 1 && !single) {
        this.terminate();
        this.maxThreads = 1;
        return this.loadOnce(onProgress);
      }
      throw err;
    }
  }

  /** Okumanın tamamını yazıya döker (16 kHz tek kanal). Kelime zamanları kaydın başından itibaren saniye. */
  async transcribe(samples: Float32Array, onProgress?: AsrProgressHandler, options?: AsrSendOptions): Promise<AsrWord[]> {
    const audio = prepare(samples, options?.transfer);
    const res = await this.request({ id: 0, type: 'transcribe', audio }, [audio.buffer as ArrayBuffer], onProgress);
    if (res.type !== 'words') throw new AsrError('unknown', `Beklenmeyen cevap: ${res.type}`);
    return res.words;
  }

  /**
   * Kısa parçaları (ör. doğrulama ya da mikrofon denemesi) yazıya döker; her parça için zamanlar o parçanın başından.
   * Bir parçanın sonucu null ise Worker orada güvenilir bir sonuç çıkaramadı (döngü, uydurma metin, konuşma varken
   * kelime yok); boş dizi, parçada konuşma sesi olmadığı anlamına gelir.
   */
  async transcribeClips(
    clips: Float32Array[],
    onProgress?: AsrProgressHandler,
    options?: AsrSendOptions,
  ): Promise<(AsrWord[] | null)[]> {
    if (!clips.length) return [];
    const list = clips.map((c) => prepare(c, options?.transfer));
    const res = await this.request(
      { id: 0, type: 'transcribeClips', clips: list },
      [...new Set(list.map((c) => c.buffer as ArrayBuffer))],
      onProgress,
    );
    if (res.type !== 'clipWords') throw new AsrError('unknown', `Beklenmeyen cevap: ${res.type}`);
    return res.words;
  }

  /** Worker'ı kapatır (modelin belleği boşalır). Bekleyen istekler `aborted` ile reddedilir; sonra load() yeniden açar. */
  dispose(): void {
    this.terminate(new AsrError('aborted', 'Analiz durduruldu'));
  }

  private async loadOnce(onProgress?: AsrProgressHandler): Promise<AsrLoadInfo> {
    let res: AsrResponse;
    try {
      res = await this.request({ id: 0, type: 'load' }, [], onProgress);
    } catch (err) {
      // Yarım kalan kurulumdan sonra çalışma ortamı yeniden kurulamaz: Worker kapatılır, sonraki load() yenisini açar.
      if (err instanceof AsrError && err.kind !== 'aborted') this.terminate(err);
      throw err;
    }
    if (res.type !== 'loaded') throw new AsrError('unknown', `Beklenmeyen cevap: ${res.type}`);
    const extra = res as typeof res & { loadMs?: number };
    this.loaded = { backend: res.backend, threads: res.threads, loadMs: extra.loadMs };
    return this.loaded;
  }

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;
    if (!AsrClient.supported()) throw new AsrError('unsupported', 'Bu tarayıcı otomatik analizi desteklemiyor');
    const worker = new Worker(asrWorkerUrl(this.maxThreads), { type: 'module', name: 'okuma-analiz' });
    worker.onmessage = (ev: MessageEvent<WorkerReply>) => this.onMessage(ev.data);
    worker.onerror = (ev) => {
      ev.preventDefault();
      // Ayrıntısız hata: Worker dosyası (ya da içe aktardığı dosya) yüklenemedi. Ayrıntılıysa Worker içinde yakalanmamış hata.
      const message = ev instanceof ErrorEvent && ev.message ? ev.message : '';
      this.terminate(new AsrError(message ? 'unknown' : 'network', message || 'Analiz dosyası yüklenemedi'));
    };
    worker.onmessageerror = () => this.terminate(new AsrError('unknown', 'Worker iletisi okunamadı'));
    this.worker = worker;
    return worker;
  }

  private request(req: AsrRequest, transfer: Transferable[], onProgress?: AsrProgressHandler): Promise<AsrResponse> {
    let worker: Worker;
    try {
      worker = this.ensureWorker();
    } catch (err) {
      return Promise.reject(err instanceof AsrError ? err : new AsrError('unsupported', String(err)));
    }
    const id = this.nextId++;
    return new Promise<AsrResponse>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      try {
        worker.postMessage({ ...req, id }, transfer);
      } catch (err) {
        this.pending.delete(id);
        reject(new AsrError('unknown', err instanceof Error ? err.message : String(err)));
      }
    });
  }

  private onMessage(msg: WorkerReply): void {
    const p = this.pending.get(msg.id);
    if (!p) return;
    if (msg.type === 'progress') {
      try {
        p.onProgress?.({ stage: msg.stage, ratio: msg.ratio, loadedBytes: msg.loadedBytes, totalBytes: msg.totalBytes });
      } catch {
        // arayüzün hatası analizi durdurmasın
      }
      return;
    }
    this.pending.delete(msg.id);
    if (msg.type === 'words' || msg.type === 'clipWords') this.lastWarnings = msg.warnings ?? [];
    if (msg.type === 'error') {
      const err = new AsrError(msg.kind, msg.message);
      err.threads = msg.threads;
      p.reject(err);
      // Bellek yetmediyse Worker'ın belleği ancak kapatılınca boşalır; sonraki istek yenisini açar. Çok iş
      // parçacığı daha çok bellek ister: yeni Worker tek iş parçacığıyla açılır.
      if (msg.kind === 'memory') {
        if ((msg.threads ?? 1) > 1) this.maxThreads = 1;
        this.terminate(new AsrError('memory', msg.message));
      }
      return;
    }
    p.resolve(msg);
  }

  private terminate(reason?: AsrError): void {
    this.worker?.terminate();
    this.worker = null;
    this.loaded = null;
    const pending = [...this.pending.values()];
    this.pending.clear();
    for (const p of pending) p.reject(reason ?? new AsrError('aborted', 'Analiz durduruldu'));
  }
}

/** Worker'a gidecek ses: kopya (varsayılan) ya da devredilebilecekse dizinin kendisi. */
function prepare(samples: Float32Array, transfer?: boolean): Float32Array {
  const whole =
    samples.buffer instanceof ArrayBuffer && samples.byteOffset === 0 && samples.byteLength === samples.buffer.byteLength;
  return transfer && whole ? samples : samples.slice();
}
