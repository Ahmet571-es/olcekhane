// Ölçekhane sesli okuma: otomatik analiz Worker'ı (modül Worker'ı; paketlenmeden, olduğu gibi sunulur).
//
// Öğrencinin okuması bu cihazda, bu Worker'ın belleğinde yazıya dökülür (Whisper, transformers.js + ONNX Runtime Web,
// yalnızca WebAssembly). Ses hiçbir yere gönderilmez ve kaydedilmez. Model ve çalışma dosyaları sitenin kendi
// sunucusundan iner; tarayıcı deposuna (Cache Storage, IndexedDB, localStorage) hiçbir şey yazılmaz, yalnızca olağan
// HTTP önbelleği kullanılır.
//
// Adres (src/components/runner/oral/asr-client.ts kurar; değerler src/lib/oral/auto.ts'teki sabitlerdir):
//   /okuma/analiz-isci.js?m=<ASR_MODEL_BASE>&o=<ORT_BASE>&t=<TRANSFORMERS_URL>&id=<model kimliği>&q=<dtype JSON>[&th=<en çok iş parçacığı>]
// İleti düzeni: auto.ts'teki AsrRequest / AsrResponse. İstekler sırayla işlenir; tek bir model örneği tutulur.
//
// Uzun okumalar için önlemler (Node'da FLEURS ve yanlış okuma kayıtlarıyla denendi):
//  - Ses yavaş bir otomatik kazançla dengelenir: Whisper her 30 sn'lik pencereyi kendi içinde ölçekler; yüksek sesli bir
//    cümlenin yanındaki kısık cümle hiç yazılmayabiliyordu.
//  - Ses en çok 28 sn'lik pencerelerle, sessiz yerlerden bölünerek yürünür; Whisper erken durursa son tanınan kelimeden
//    devam edilir; çıktı döngüye girerse pencere ikiye bölünüp yeniden işlenir.
//  - Konuşma enerjisi olmayan pencereler atlanır (yalnız gürültüde Whisper "Abone olmayı unutmayın." gibi metin uydurur).
//  - Kelime bitişleri sesin süresine kırpılır; kesme işaretiyle ayrılan ekler birleştirilir ("kovan" + "'a").
//  - Pencerenin bitiminde başlayan "kelimeler" atılır (tarayıcıda okumanın sonundaki nefeste "Bu sefer de nektidir?"
//    uyduruldu); 6 sn'den uzun pencerede bu olursa pencere bölünüp yeniden işlenir.
//  - Dil 'turkish', görev 'transcribe', kelime zamanları; ipucu (prompt) yok, tekrar cezası yok (öğrencinin
//    tekrarlarını görmek isteriz).

const SR = 16000;
const FRAME = 320; // 20 ms
const MAX_SEC = 28;
const MIN_SEC = 15;
/** Kısa parçalar birleştirilirken araya konan sessizlik (sn). */
const CLIP_GAP_SEC = 1;
/** ONNX Runtime Web dosyalarının adı (ORT_BASE altında .mjs ve .wasm). Yalnızca WebAssembly kullanıldığı için WebGPU'suz derleme. */
const ORT_FILE = 'ort-wasm-simd-threaded';
const GEN = { language: 'turkish', task: 'transcribe', return_timestamps: 'word' };
const HALLUCINATIONS = /altyazı|abone ol|izlediğiniz için|teşekkür ederim\.?$|www\.|\.com/i;
const DTYPES = new Set(['auto', 'fp32', 'fp16', 'q8', 'int8', 'uint8', 'q4', 'bnb4', 'q4f16']);

class AsrFail extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
  }
}

// ---- Adres parametreleri ------------------------------------------------------------------------------------------

function readConfig() {
  const q = new URL(self.location.href).searchParams;
  const origin = self.location.origin;
  /** Aynı kökenden, / ile başlayan bir yol (transformers.js localModelPath'i URL değil, yol olarak ister). */
  const samePath = (key, dir) => {
    const v = q.get(key) || '';
    const ok = v.startsWith('/') && !v.startsWith('//') && !/[\\\s]/.test(v) && new URL(v, origin).origin === origin && (!dir || v.endsWith('/'));
    if (!ok) throw new AsrFail('unknown', `Worker adresinde geçersiz "${key}" değeri`);
    return v;
  };
  const id = q.get('id') || '';
  if (!/^[\w.-]+\/[\w.-]+$/.test(id)) throw new AsrFail('unknown', 'Worker adresinde geçersiz model kimliği');
  let dtype;
  try {
    dtype = JSON.parse(q.get('q') || 'null');
  } catch {
    dtype = null;
  }
  const dtypeOk = dtype && typeof dtype === 'object' && !Array.isArray(dtype) && Object.keys(dtype).length > 0 &&
    Object.entries(dtype).every(([k, v]) => /^[a-z_]+$/.test(k) && DTYPES.has(v));
  if (!dtypeOk) throw new AsrFail('unknown', 'Worker adresinde geçersiz dtype');
  const th = Number(q.get('th') || 4);
  return {
    modelBase: samePath('m', true),
    ortBase: samePath('o', true),
    transformersUrl: samePath('t', false),
    id,
    dtype,
    maxThreads: Number.isInteger(th) && th >= 1 ? Math.min(th, 4) : 4,
  };
}

let cfg = null;
let cfgError = null;
try {
  cfg = readConfig();
} catch (err) {
  cfgError = err;
}

// ---- İleti döngüsü ------------------------------------------------------------------------------------------------

let asr = null;
let info = null;
let threads = 1;
let queue = Promise.resolve();

const post = (msg) => self.postMessage(msg);

self.addEventListener('message', (ev) => {
  const req = ev.data;
  queue = queue.then(() => handle(req));
});

async function handle(req) {
  const id = req && typeof req.id === 'number' ? req.id : -1;
  try {
    if (cfgError) throw cfgError;
    if (req.type === 'load') {
      post({ id, type: 'loaded', ...(await ensureLoaded(id)) });
    } else if (req.type === 'transcribe') {
      const audio = toAudio(req.audio);
      await ensureLoaded(id);
      const ticker = makeTicker(id, audio.length / SR);
      const { words, warnings } = await transcribeReading(audio, ticker);
      ticker.done();
      post({ id, type: 'words', words, warnings });
    } else if (req.type === 'transcribeClips') {
      if (!Array.isArray(req.clips)) throw new AsrFail('unknown', 'clips bir dizi olmalı');
      const clips = req.clips.map(toAudio);
      await ensureLoaded(id);
      const ticker = makeTicker(id, clips.reduce((a, c) => a + c.length, 0) / SR);
      const { words, warnings } = await transcribeClips(clips, ticker);
      ticker.done();
      post({ id, type: 'clipWords', words, warnings });
    } else {
      throw new AsrFail('unknown', `Bilinmeyen istek: ${req && req.type}`);
    }
  } catch (err) {
    const kind = classify(err);
    if (kind === 'memory') await dropPipeline();
    post({ id, type: 'error', kind, message: String((err && err.message) || err).slice(0, 500), threads });
  }
}

function toAudio(x) {
  if (x instanceof Float32Array) return x;
  if (x instanceof Float64Array) return new Float32Array(x);
  throw new AsrFail('unknown', 'Ses Float32Array olmalı (16 kHz, tek kanal)');
}

async function dropPipeline() {
  const p = asr;
  asr = null;
  info = null;
  try {
    if (p) await p.dispose();
  } catch {
    // bellek yetmediyse çalışma ortamı zaten bozuk olabilir; sayfa bu Worker'ı kapatır
  }
}

/** Hataları sayfanın anlayacağı türlere ayırır. */
function classify(err) {
  if (err && typeof err.kind === 'string') return err.kind;
  const msg = String((err && err.message) || err || '');
  const name = (err && err.name) || '';
  if (/out of memory|\boom\b|bad_alloc|bad allocation|allocation failed|could not allocate|cannot allocate|failed to allocate|cannot enlarge memory|maximum memory size|memory\.grow|array buffer allocation/i.test(msg)) return 'memory';
  if (name === 'RangeError' && /memory|allocation|buffer/i.test(msg)) return 'memory';
  if (/failed to fetch|networkerror|network error|load failed|dynamically imported module|importing a module script failed|not found locally|could not locate file|http \d{3}|err_network|connection/i.test(msg)) return 'network';
  if (/webassembly|simd|sharedarraybuffer|no available backend|not supported|unsupported/i.test(msg)) return 'unsupported';
  return 'unknown';
}

// ---- Model yükleme ------------------------------------------------------------------------------------------------

const SIMD_PROBE = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11,
]);

function checkFeatures() {
  if (typeof WebAssembly !== 'object' || typeof WebAssembly.validate !== 'function') throw new AsrFail('unsupported', 'WebAssembly yok');
  let simd = false;
  try {
    simd = WebAssembly.validate(SIMD_PROBE);
  } catch {
    simd = false;
  }
  if (!simd) throw new AsrFail('unsupported', 'WebAssembly SIMD yok');
  if (typeof BigInt64Array !== 'function') throw new AsrFail('unsupported', 'BigInt64Array yok');
}

async function ensureLoaded(id) {
  if (asr) return info;
  checkFeatures();
  const t0 = performance.now();
  let T;
  try {
    T = await import(new URL(cfg.transformersUrl, self.location.origin).href);
  } catch (err) {
    throw new AsrFail('network', `transformers.js yüklenemedi: ${(err && err.message) || err}`);
  }
  const { env, pipeline } = T;
  env.allowRemoteModels = false; // huggingface.co'ya hiç gidilmez
  env.allowLocalModels = true;
  env.localModelPath = cfg.modelBase;
  env.useBrowserCache = false; // Cache Storage yok: site tarayıcıya hiçbir şey kaydetmez
  env.useWasmCache = false;
  env.useFSCache = false;
  env.useCustomCache = false;
  const wasm = env.backends.onnx.wasm;
  const shared = self.crossOriginIsolated === true && typeof SharedArrayBuffer === 'function';
  threads = shared ? Math.max(1, Math.min(cfg.maxThreads, navigator.hardwareConcurrency || 1)) : 1;
  wasm.numThreads = threads;
  wasm.proxy = false;
  const ortBase = new URL(cfg.ortBase, self.location.origin).href;
  const wasmUrl = ortBase + ORT_FILE + '.wasm';
  wasm.wasmPaths = { mjs: ortBase + ORT_FILE + '.mjs', wasm: wasmUrl };

  const meter = makeMeter(id, Object.keys(cfg.dtype).length);
  env.fetch = meter.fetch;
  // ONNX Runtime'ın .wasm dosyası da indirme ilerlemesine girsin diye burada indirilir ve ORT'ye verilir; model
  // dosyalarının akışı, .wasm hazır olmadan kapanmaz (ORT .wasm'ı kendisi bir daha indirmesin).
  const wasmReady = meter
    .fetch(wasmUrl)
    .then((res) => {
      if (!res.ok) throw new AsrFail('network', `HTTP ${res.status}: ${wasmUrl}`);
      return res.arrayBuffer();
    })
    .then((buf) => {
      wasm.wasmBinary = buf;
    });
  wasmReady.catch(() => {});
  meter.gate = wasmReady;

  let p;
  try {
    p = await pipeline('automatic-speech-recognition', cfg.id, { device: 'wasm', dtype: cfg.dtype });
  } catch (err) {
    await wasmReady; // .wasm inemediyse asıl hata odur
    throw err;
  }
  await wasmReady;
  delete wasm.wasmBinary; // ORT derledi; 14 MB'lık kopya bellekte kalmasın
  meter.finish();
  asr = p;
  info = { backend: 'wasm', threads, loadMs: Math.round(performance.now() - t0), downloadedBytes: meter.bytes() };
  post({ id, type: 'progress', stage: 'load', ratio: 1 });
  return info;
}

/** İndirme ilerlemesi: transformers.js'in isteklerini (env.fetch) ve .wasm'ı sayar; toplam, Content-Length'lerden. */
function makeMeter(id, expectedOnnx) {
  const files = new Map(); // adres → { loaded, total, done }; aynı adres yeniden istenirse (ör. önce üst bilgi için) yenisi geçer
  let onnxSeen = 0;
  let last = 0;
  let lastAt = 0;
  let loadPosted = false;
  const sums = () => {
    let loaded = 0;
    let total = 0;
    for (const f of files.values()) {
      loaded += f.loaded;
      total += f.total == null ? f.loaded : Math.max(f.total, f.loaded);
    }
    return { loaded, total };
  };
  const report = (force) => {
    const { loaded, total } = sums();
    const known = onnxSeen >= expectedOnnx; // model dosyalarının boyu öğrenilmeden oran verilmez (geri gitmesin)
    const ratio = Math.max(last, known && total > 0 ? Math.min(1, loaded / total) : 0);
    const now = performance.now();
    if (!force && ratio - last < 0.005 && now - lastAt < 400) return;
    last = ratio;
    lastAt = now;
    post({ id, type: 'progress', stage: 'download', ratio, loadedBytes: loaded, totalBytes: known ? total : undefined });
    if (known && !loadPosted && [...files.values()].every((f) => f.done)) {
      loadPosted = true;
      post({ id, type: 'progress', stage: 'load', ratio: 0 });
    }
  };
  const meter = {
    gate: Promise.resolve(),
    async fetch(input, init) {
      let res;
      try {
        res = await fetch(input, init);
      } catch (err) {
        throw new AsrFail('network', `İndirilemedi: ${String(input)} (${(err && err.message) || err})`);
      }
      if (!res.ok || !res.body || typeof TransformStream !== 'function') return res;
      const url = String(res.url || input);
      const enc = (res.headers.get('content-encoding') || 'identity').toLowerCase();
      const len = Number(res.headers.get('content-length'));
      const f = { loaded: 0, total: enc === 'identity' && len > 0 ? len : null, done: false };
      const onnx = /\.onnx(\?|$)/.test(url);
      if (onnx && !files.has(url)) onnxSeen++;
      files.set(url, f);
      const ts = new TransformStream({
        transform(chunk, c) {
          f.loaded += chunk.byteLength;
          c.enqueue(chunk);
          report(false);
        },
        async flush() {
          f.done = true;
          report(true);
          if (onnx) await meter.gate;
        },
      });
      return new Response(res.body.pipeThrough(ts), { status: res.status, statusText: res.statusText, headers: res.headers });
    },
    finish() {
      if (!loadPosted) {
        last = 1;
        post({ id, type: 'progress', stage: 'download', ratio: 1, loadedBytes: sums().loaded, totalBytes: sums().total });
        loadPosted = true;
        post({ id, type: 'progress', stage: 'load', ratio: 0 });
      }
    },
    bytes: () => sums().loaded,
  };
  return meter;
}

// ---- İlerleme (yazıya dökme) --------------------------------------------------------------------------------------

/** Oran: işlenen sesin konumu; pencere içinde üretilen belirteç sayısından tahmin edilir. Hep ileri gider. */
function makeTicker(id, totalSec) {
  let a = 0;
  let b = 0;
  let expect = 1;
  let tokens = 0;
  let last = 0;
  let lastAt = 0;
  let rate = 5; // ses saniyesi başına beklenen belirteç (pencereler işlendikçe güncellenir)
  const emit = (force) => {
    const within = b > a ? Math.min(0.95, tokens / expect) * (b - a) : 0;
    const r = totalSec > 0 ? Math.min(0.99, Math.max(last, (a + within) / totalSec)) : 0;
    const now = performance.now();
    if (!force && r - last < 0.01 && now - lastAt < 500) return;
    if (r <= last && !force) return;
    last = r;
    lastAt = now;
    post({ id, type: 'progress', stage: 'transcribe', ratio: r });
  };
  return {
    offset: 0,
    streamer: {
      put() {
        tokens++;
        emit(false);
      },
      end() {},
    },
    begin(s, e) {
      a = this.offset + s;
      b = this.offset + e;
      tokens = 0;
      expect = Math.max(8, (e - s) * rate);
      emit(true);
    },
    end(s, e, hadSpeech) {
      if (hadSpeech && e - s > 3 && tokens > 0) rate = 0.5 * rate + 0.5 * (tokens / (e - s));
      a = b = this.offset + e;
      tokens = 0;
      emit(true);
    },
    done() {
      post({ id, type: 'progress', stage: 'transcribe', ratio: 1 });
    },
  };
}

// ---- Uzun okuma ---------------------------------------------------------------------------------------------------

/** 20 ms'lik çerçevelerin RMS'i ve uyarlanır konuşma eşiği (gürültü tabanı × 3, en az 0,001). */
function frameEnergy(audio) {
  const n = Math.floor(audio.length / FRAME);
  const rms = new Float32Array(n);
  for (let f = 0; f < n; f++) {
    let s = 0;
    for (let i = f * FRAME; i < (f + 1) * FRAME; i++) s += audio[i] * audio[i];
    rms[f] = Math.sqrt(s / FRAME);
  }
  const sorted = Float32Array.from(rms).sort();
  const floor = sorted[Math.floor(n * 0.1)] || 0;
  return { rms, thr: Math.max(0.001, floor * 3) };
}

/** Yavaş otomatik kazanç: her 0,4 sn'lik konuşma bloğu ~-26 dBFS'ye (en çok +30 dB, yumuşatılmış, tepe sınırlı). */
function levelAudio(audio, { target = 0.05, maxGain = 30, block = 6400 } = {}) {
  const nb = Math.ceil(audio.length / block);
  const rms = new Float32Array(nb);
  for (let b = 0; b < nb; b++) {
    let s = 0;
    let n = 0;
    for (let i = b * block; i < Math.min(audio.length, (b + 1) * block); i++, n++) s += audio[i] * audio[i];
    rms[b] = Math.sqrt(s / Math.max(1, n));
  }
  const floor = Math.max(1e-4, Float32Array.from(rms).sort()[Math.floor(nb * 0.1)]);
  const g = Array.from(rms, (r) => Math.min(maxGain, Math.max(0.25, target / Math.max(r, floor * 3))));
  const sm = g.map((_, b) => Math.min(...g.slice(Math.max(0, b - 1), b + 2))); // kelimeler arasında pompalamasın
  const out = new Float32Array(audio.length);
  for (let i = 0; i < audio.length; i++) {
    const x = i / block - 0.5;
    const b0 = Math.max(0, Math.floor(x));
    const b1 = Math.min(nb - 1, b0 + 1);
    const t = Math.min(1, Math.max(0, x - b0));
    out[i] = Math.max(-0.99, Math.min(0.99, audio[i] * (sm[b0] * (1 - t) + sm[b1] * t)));
  }
  return out;
}

function speechRatio({ rms, thr }, a, b) {
  const fa = Math.floor(a / FRAME);
  const fb = Math.min(rms.length, Math.floor(b / FRAME));
  let k = 0;
  for (let f = fa; f < fb; f++) if (rms[f] > thr) k++;
  return fb > fa ? k / (fb - fa) : 0;
}

/** a ile b örnekleri arasındaki en sessiz 200 ms'nin ortası. */
function quietestPoint({ rms }, a, b) {
  const fa = Math.floor(a / FRAME);
  const fb = Math.floor(b / FRAME);
  let best = fa;
  let bestE = Infinity;
  for (let f = fa; f + 10 <= fb; f++) {
    let s = 0;
    for (let k = 0; k < 10; k++) s += rms[f + k];
    if (s < bestE) {
      bestE = s;
      best = f + 5;
    }
  }
  return best * FRAME;
}

/** Aynı 1–4 kelimelik öbek art arda ≥ 4 kez ya da saniyede 6'dan çok kelime: çözümleme döngüye girmiş. */
function looksLooped(words, sec) {
  const t = words.map((w) => w.text.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]/gu, ''));
  for (let n = 1; n <= 4; n++) {
    for (let i = 0; i + 4 * n <= t.length; i++) {
      let rep = 1;
      while (i + (rep + 1) * n <= t.length && t.slice(i, i + n).join(' ') === t.slice(i + rep * n, i + (rep + 1) * n).join(' ')) rep++;
      if (rep >= 4) return true;
    }
  }
  return sec > 0 && words.length / sec > 6;
}

/**
 * audio[s, e) parçasını yazıya döker; zamanlar audio'nun başından itibaren saniye. Sesin bitiminde ya da sonrasında
 * başlayan "kelimeler" alınmaz (`overflow`): ya hizalama bozulmuştur ya da metin uydurulmuştur (ör. okumanın sonundaki
 * nefeste "Bu sefer de nektidir?").
 */
async function transcribePiece(audio, s, e, ticker) {
  const out = await asr(audio.subarray(s, e), { ...GEN, streamer: ticker.streamer });
  const pieceSec = (e - s) / SR;
  const words = [];
  const overflow = [];
  for (const c of out.chunks || []) {
    const text = String(c.text || '').trim();
    if (!text) continue;
    if ((c.timestamp[0] ?? 0) > pieceSec - 0.02) {
      overflow.push(text);
      continue;
    }
    const st = Math.min(c.timestamp[0] ?? 0, pieceSec);
    const en = Math.max(st, Math.min(c.timestamp[1] ?? pieceSec, pieceSec)); // son bitiş sesin dışına taşabilir
    const w = { text, start: +(s / SR + st).toFixed(2), end: +(s / SR + en).toFixed(2) };
    // Whisper kesme işaretinden sonraki eki bazen ayrı "kelime" verir: "kovan" + "'a" → "kovan'a"
    if (/^['’]/.test(text) && words.length) {
      const p = words[words.length - 1];
      p.text += text;
      p.end = w.end;
      continue;
    }
    words.push(w);
  }
  return { words, text: String(out.text || ''), overflow };
}

async function transcribeReading(input, ticker) {
  const en = frameEnergy(input); // konuşma kararları ham sesin enerjisiyle; Whisper dengelenmiş sesi alır
  const audio = levelAudio(input);
  const words = [];
  const warnings = [];
  const todo = []; // döngü yüzünden bölünen alt pencereler
  let pos = 0;
  while (pos < audio.length - SR * 0.3 || todo.length) {
    let s;
    let e;
    if (todo.length) [s, e] = todo.shift();
    else {
      s = pos;
      e = audio.length - s > MAX_SEC * SR ? quietestPoint(en, s + MIN_SEC * SR, s + MAX_SEC * SR) : audio.length;
      pos = e;
    }
    if (speechRatio(en, s, e) < 0.05) {
      ticker.end(s / SR, e / SR, false); // (neredeyse) konuşma yok: Whisper burada metin uydurur
      continue;
    }
    ticker.begin(s / SR, e / SR);
    const r = await transcribePiece(audio, s, e, ticker);
    const looped = looksLooped(r.words, (e - s) / SR);
    if ((looped || r.overflow.length) && e - s > 6 * SR) {
      const m = quietestPoint(en, s + 2 * SR, e - 2 * SR);
      warnings.push(`${looped ? 'loop' : 'words past the end'} at ${(s / SR).toFixed(1)}–${(e / SR).toFixed(1)} s, split at ${(m / SR).toFixed(1)}`);
      todo.unshift([s, m], [m, e]);
      continue;
    }
    if (r.overflow.length) warnings.push(`dropped words past the end of ${(s / SR).toFixed(1)}–${(e / SR).toFixed(1)} s: ${r.overflow.join(' ')}`);
    ticker.end(s / SR, e / SR, true);
    if (HALLUCINATIONS.test(r.text)) warnings.push(`possible hallucination: ${r.text.trim()}`);
    words.push(...r.words);
    // Erken durma: son tanınan kelimeden sonra konuşma kaldıysa oradan devam (yalnızca sıradaki pencerelerde)
    const last = r.words.length ? Math.round(r.words[r.words.length - 1].end * SR) : s;
    if (!todo.length && e === pos && last > s + SR && e - last > 2 * SR && speechRatio(en, last + 0.2 * SR, e) > 0.15) {
      warnings.push(`resumed at ${(last / SR).toFixed(1)} s (window ended ${(e / SR).toFixed(1)} s)`);
      pos = last;
    }
  }
  return { words, warnings };
}

// ---- Kısa parçalar (doğrulama) ------------------------------------------------------------------------------------

function rmsFrames(audio) {
  const n = Math.floor(audio.length / FRAME);
  const rms = new Float32Array(n);
  for (let f = 0; f < n; f++) {
    let s = 0;
    for (let i = f * FRAME; i < (f + 1) * FRAME; i++) s += audio[i] * audio[i];
    rms[f] = Math.sqrt(s / FRAME);
  }
  return rms;
}

/** Bir parçayı tek başına yazıya döker; zamanlar parçanın başından itibaren. Kısa parçalar dengelenmez (bkz. transcribeClips). */
async function transcribeOne(clip, ticker, base) {
  ticker.offset = base;
  if (clip.length > MAX_SEC * SR) return transcribeReading(clip, ticker);
  const dur = clip.length / SR;
  ticker.begin(0, dur);
  const r = await transcribePiece(clip, 0, clip.length, ticker);
  ticker.end(0, dur, true);
  const warnings = [];
  if (r.overflow.length) warnings.push(`dropped words past the end: ${r.overflow.join(' ')}`);
  if (looksLooped(r.words, clip.length / SR)) {
    warnings.push('loop in clip');
    return { words: [], warnings };
  }
  if (HALLUCINATIONS.test(r.text)) warnings.push(`possible hallucination: ${r.text.trim()}`);
  return { words: r.words, warnings };
}

/**
 * Kısa parçalar, araya 1 sn sessizlik konarak ≤ 28 sn'lik tamponlarda birlikte yazıya dökülür (kodlayıcı daha az
 * çalışır); kelimeler ortalarının düştüğü parçaya dağıtılır. Konuşma enerjisi olmayan parça boş döner.
 * Whisper birleştirilmiş kısa parçalarda bazen ilk birkaç parçadan sonra durur ve kelime zamanlarını sesin sonuna
 * (sessiz dolguya) yığar; tampon döngüye girerse ya da sesin bitiminden sonra başlayan kelime çıkarsa bütün parçalar,
 * kelimesi çıkmayan ya da kelimesi aradaki sessizliğe düşen parçalar ise tek tek yeniden işlenir. Parçalar dengelenmez:
 * kısa parçada yavaş kazancın gürültü tabanı yanlış ölçülüyor ve denemelerde birleştirilmiş tamponu bozdu.
 */
async function transcribeClips(clips, ticker) {
  const out = clips.map(() => []);
  const warnings = [];
  const n = clips.reduce((a, c) => a + Math.floor(c.length / FRAME), 0);
  const all = new Float32Array(n);
  const rmsOf = clips.map(rmsFrames);
  let k = 0;
  for (const r of rmsOf) {
    all.set(r, k);
    k += r.length;
  }
  const floor = Float32Array.from(all).sort()[Math.floor(n * 0.1)] || 0;
  const thr = Math.max(0.001, floor * 3);
  const speech = clips.map((c, i) => c.length >= 0.3 * SR && speechRatio({ rms: rmsOf[i], thr }, 0, c.length) >= 0.05);

  const base = []; // ilerleme için her parçanın sanal başlangıcı (sn)
  let acc = 0;
  for (const c of clips) {
    base.push(acc);
    acc += c.length / SR;
  }

  const gap = Math.round(CLIP_GAP_SEC * SR);
  const groups = [];
  let cur = [];
  let curLen = 0;
  for (let i = 0; i < clips.length; i++) {
    if (!speech[i]) continue;
    if (clips[i].length > MAX_SEC * SR) {
      groups.push([i]);
      continue;
    }
    const add = clips[i].length + (cur.length ? gap : 0);
    if (cur.length && curLen + add > MAX_SEC * SR) {
      groups.push(cur);
      cur = [];
      curLen = 0;
    }
    curLen += clips[i].length + (cur.length ? gap : 0);
    cur.push(i);
  }
  if (cur.length) groups.push(cur);

  const single = async (i) => {
    const r = await transcribeOne(clips[i], ticker, base[i]);
    out[i] = r.words;
    warnings.push(...r.warnings.map((w) => `clip ${i}: ${w}`));
  };

  for (const g of groups) {
    if (g.length === 1) {
      await single(g[0]);
      continue;
    }
    const offs = [];
    let len = 0;
    for (const i of g) {
      if (offs.length) len += gap;
      offs.push(len);
      len += clips[i].length;
    }
    const buf = new Float32Array(len);
    g.forEach((i, j) => buf.set(clips[i], offs[j]));
    ticker.offset = 0;
    const first = base[g[0]];
    const last = base[g[g.length - 1]] + clips[g[g.length - 1]].length / SR;
    ticker.begin(first, last);
    const r = await transcribePiece(buf, 0, len, ticker);
    ticker.end(first, last, true);
    if (looksLooped(r.words, len / SR) || r.overflow.length) {
      warnings.push(`${r.overflow.length ? 'words past the end' : 'loop'} in clip group ${g.join(',')}: clips redone one by one`);
      for (const i of g) await single(i);
      continue;
    }
    if (HALLUCINATIONS.test(r.text)) warnings.push(`possible hallucination: ${r.text.trim()}`);
    const redo = new Set();
    for (const w of r.words) {
      const mid = ((w.start + w.end) / 2) * SR;
      let j = 0;
      while (j + 1 < g.length && mid >= offs[j + 1] - gap / 2) j++;
      const i = g[j];
      const dur = clips[i].length / SR;
      const o = offs[j] / SR;
      // Kelimenin yarısından çoğu aradaki sessizliğe düşüyorsa hizalama güvenilmez: parça tek başına yeniden işlenir.
      const ws = w.start * SR;
      const we = w.end * SR;
      const cs = offs[j];
      const ce = offs[j] + clips[i].length;
      const inGap = we - ws > 0.02 * SR ? Math.min(we, ce) - Math.max(ws, cs) < 0.5 * (we - ws) : mid < cs - 0.1 * SR || mid > ce + 0.1 * SR;
      if (inGap) redo.add(i);
      const st = Math.min(dur, Math.max(0, w.start - o));
      const en = Math.min(dur, Math.max(st, w.end - o));
      out[i].push({ text: w.text, start: +st.toFixed(2), end: +en.toFixed(2) });
    }
    for (const i of g) if (!out[i].length && clips[i].length >= 0.5 * SR) redo.add(i);
    for (const i of g) {
      if (!redo.has(i)) continue;
      warnings.push(`clip ${i}: ${out[i].length ? 'word in the gap' : 'no words'} in group, redone alone`);
      await single(i);
    }
  }
  return { words: out, warnings };
}
