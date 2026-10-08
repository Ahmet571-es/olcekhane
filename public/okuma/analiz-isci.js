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
// Büyük model dosyaları 8 MiB'lık parçalar hâlinde sunulur (araclar/model-hazirla.mjs; liste: model klasöründeki
// parcalar.json): tarayıcılar HTTP önbelleğine çok büyük dosyaları almaz, parçaları alır. transformers.js'in istekleri
// (env.fetch) bu dosyalar için parçaları sırayla indirip tek akış olarak verir; kopan parça kaldığı yerden yeniden istenir.
//
// Uzun okumalar için önlemler (Node'da FLEURS ve yanlış okuma kayıtlarıyla denendi):
//  - Ses önce 90 Hz yüksek geçiren süzgeçten geçer (iş makinesi, trafik uğultusu, rüzgâr gibi alçak frekanslı
//    gürültü atılır; konuşma etkilenmez; src/lib/oral/audio.ts'teki highPass ile aynı).
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
//  - transformers.js 4.3.0'da kelime zamanları (çapraz dikkat + DTW) sesin gerçek boyuyla değil, 30 sn'ye doldurulmuş
//    girdinin tamamıyla hesaplanıyor (_generate_with_seek, num_frames = 1500). Kısa seste kelimeler sesin sonrasına,
//    30. saniyeye kadar yayılıyordu: doğrulama parçalarının kelimeleri "sesin bitiminden sonra" diye atılıyor,
//    doğrulama hiç sonuç vermiyordu. Worker hesaplamayı sesin gerçek boyuyla sınırlar (fixWordTimes).

const SR = 16000;
const FRAME = 320; // 20 ms
const MAX_SEC = 28;
const MIN_SEC = 15;
/** Kısa parçalar birleştirilirken araya konan sessizlik (sn). */
const CLIP_GAP_SEC = 1;
/**
 * Doğrulama parçalarında üretilecek en çok belirteç: saniyede 16 (hızlı bir okumanın üstünde) + 16. Kısa parçada
 * Whisper döngüye girer ya da sessizlikte metin uydurursa 448 belirtece kadar uzar (telefonda dakikalar); sınır bunu
 * keser, döngü yine looksLooped ile anlaşılır.
 */
const clipTokens = (samples) => Math.min(400, Math.ceil((samples / SR) * 16) + 16);
/** ONNX Runtime Web dosyalarının adı (ORT_BASE altında .mjs ve .wasm). Yalnızca WebAssembly kullanıldığı için WebGPU'suz derleme. */
const ORT_FILE = 'ort-wasm-simd-threaded';
const GEN = { language: 'turkish', task: 'transcribe', return_timestamps: 'word' };
const HALLUCINATIONS = /altyazı|abone ol|izlediğiniz için|teşekkür ederim\.?$|www\.|\.com/i;
const DTYPES = new Set(['auto', 'fp32', 'fp16', 'q8', 'int8', 'uint8', 'q4', 'bnb4', 'q4f16']);
const PARTS_FILE = 'parcalar.json';
/** Bir parça en çok bu kadar kez istenir (mobil bağlantı koparsa). */
const PART_TRIES = 3;

class AsrFail extends Error {
  constructor(kind, message, fatal = false) {
    super(message);
    this.kind = kind;
    /** Yeniden denemekle düzelmez (ör. parça beklenenden büyük). */
    this.fatal = fatal;
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
/** Şu an yazıya dökülen sesin kodlayıcı çerçevesi sayısı (20 ms; bkz. fixWordTimes). */
let realFrames = Infinity;
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

/** Gelen ses (Worker'a devredilmiş ya da kopyalanmış; yerinde değiştirilir) yüksek geçiren süzgeçten geçmiş olarak. */
function toAudio(x) {
  if (x instanceof Float32Array) return highPass(x);
  if (x instanceof Float64Array) return highPass(new Float32Array(x));
  throw new AsrFail('unknown', 'Ses Float32Array olmalı (16 kHz, tek kanal)');
}

/** 4. dereceden Butterworth yüksek geçiren süzgeç, 90 Hz, yerinde (src/lib/oral/audio.ts: highPass). */
function highPass(x, fc = 90) {
  const w0 = (2 * Math.PI * fc) / SR;
  const cos = Math.cos(w0);
  for (const q of [0.5412, 1.3066]) {
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    const b0 = (1 + cos) / 2 / a0;
    const b1 = -(1 + cos) / a0;
    const a1 = (-2 * cos) / a0;
    const a2 = (1 - alpha) / a0;
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const v = x[i];
      const y = b0 * v + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
      x2 = x1;
      x1 = v;
      y2 = y1;
      y1 = y;
      x[i] = y;
    }
  }
  return x;
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

  parts = await loadParts();
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
  fixWordTimes(p);
  meter.finish();
  asr = p;
  info = { backend: 'wasm', threads, loadMs: Math.round(performance.now() - t0), downloadedBytes: meter.bytes() };
  post({ id, type: 'progress', stage: 'load', ratio: 1 });
  return info;
}

// ---- Parçalı dosyalar ---------------------------------------------------------------------------------------------

/** Parçalı sunulan dosyalar: tam adres → { size, count, partSize } (parcalar.json). */
let parts = new Map();

async function loadParts() {
  const base = new URL(cfg.modelBase + cfg.id + '/', self.location.origin);
  const url = new URL(PARTS_FILE, base).href;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new AsrFail('network', `İndirilemedi: ${url} (${(err && err.message) || err})`);
  }
  if (!res.ok) throw new AsrFail('network', `HTTP ${res.status}: ${url}`);
  let j;
  try {
    j = await res.json();
  } catch (err) {
    throw new AsrFail('network', `${PARTS_FILE} okunamadı (${(err && err.message) || err})`);
  }
  const map = new Map();
  const ps = j && j.parcaBoyu;
  const files = j && j.dosyalar;
  if (!Number.isInteger(ps) || ps <= 0 || !files || typeof files !== 'object') throw new AsrFail('unknown', `${PARTS_FILE} geçersiz`);
  for (const [path, e] of Object.entries(files)) {
    const ok = /^[\w./-]+$/.test(path) && !path.includes('..') && e && Number.isInteger(e.boyut) && e.boyut > 0 && e.adet === Math.ceil(e.boyut / ps);
    if (!ok) throw new AsrFail('unknown', `${PARTS_FILE} geçersiz: ${path}`);
    map.set(new URL(path, base).href, { size: e.boyut, count: e.adet, partSize: ps });
  }
  return map;
}

/** transformers.js'in istekleri: parçalı dosyalar birleştirilerek, ötekiler olduğu gibi. */
function fetchAny(input, init) {
  const href = new URL(input instanceof Request ? input.url : String(input), self.location.href).href;
  const p = parts.get(href);
  return p ? fetchParts(href, p) : fetch(input, init);
}

/**
 * Parçaları sırayla indirip tek dosya gibi akıtır (Content-Length: dosyanın tamamı). İlk parçanın sunucu hatası
 * (ör. 404) olduğu gibi döner. Bir parça yarıda koparsa ya da eksik inerse kaldığı yerden (Range) yeniden istenir;
 * sunucu aralık desteklemezse parça baştan gelir ve alınmış baytlar atlanır.
 */
async function fetchParts(url, p) {
  const partUrl = (k) => `${url}.parca-${String(k).padStart(2, '0')}`;
  const partLen = (k) => (k < p.count - 1 ? p.partSize : p.size - p.partSize * (p.count - 1));
  const first = await fetch(partUrl(0));
  if (!first.ok || !first.body) return first;
  let k = 0;
  let got = 0; // bu parçadan alınan bayt
  let skip = 0;
  let tries = 1;
  let reader = first.body.getReader();
  const open = async () => {
    const u = partUrl(k);
    const res = await fetch(u, got > 0 ? { headers: { Range: `bytes=${got}-` } } : undefined);
    if (got > 0 && res.status === 206) skip = 0;
    else if (res.status === 200) skip = got;
    else throw new AsrFail('network', `HTTP ${res.status}: ${u}`);
    if (!res.body) throw new AsrFail('network', `Boş yanıt: ${u}`);
    reader = res.body.getReader();
  };
  const body = new ReadableStream({
    async pull(c) {
      for (;;) {
        try {
          if (!reader) await open();
          const { done, value } = await reader.read();
          if (done) {
            reader = null;
            if (got < partLen(k)) throw new AsrFail('network', `Eksik indi: ${partUrl(k)} (${got}/${partLen(k)} bayt)`);
            k++;
            got = 0;
            tries = 1;
            if (k >= p.count) {
              c.close();
              return;
            }
            continue;
          }
          let v = value;
          if (skip > 0) {
            const n = Math.min(skip, v.byteLength);
            skip -= n;
            v = v.subarray(n);
            if (!v.byteLength) continue;
          }
          if (got + v.byteLength > partLen(k)) throw new AsrFail('network', `Parça beklenenden büyük: ${partUrl(k)}`, true);
          got += v.byteLength;
          c.enqueue(v);
          return;
        } catch (err) {
          if (reader) reader.cancel().catch(() => {});
          reader = null;
          if ((err && err.fatal) || tries >= PART_TRIES) {
            throw err instanceof AsrFail ? err : new AsrFail('network', `İndirilemedi: ${partUrl(k)} (${(err && err.message) || err})`);
          }
          tries++;
        }
      }
    },
    cancel(reason) {
      if (reader) reader.cancel(reason).catch(() => {});
    },
  });
  return new Response(body, { status: 200, headers: { 'content-type': 'application/octet-stream', 'content-length': String(p.size) } });
}

// ---- İndirme ilerlemesi -------------------------------------------------------------------------------------------

/**
 * Kelime zamanlarının hesabını (çapraz dikkat + DTW) sesin gerçek boyuyla sınırlar: transformers.js 4.3.0 30 sn'ye
 * doldurulmuş girdinin 1500 çerçevesinin hepsini kullanıyor (Python'daki gibi gerçek boy değil); kısa seste kelimeler
 * sesin sonrasına yayılıyordu. transformers.js değişip bu yöntem kalmazsa düzeltme atlanır (zamanlar yine
 * transcribePiece'te sesin süresine kırpılır).
 */
function fixWordTimes(p) {
  const model = p && p.model;
  if (!model || typeof model._extract_token_timestamps !== 'function' || model.__realFrames) return;
  const orig = model._extract_token_timestamps;
  model._extract_token_timestamps = function (outputs, heads, numFrames, ...rest) {
    const n = Math.min(numFrames == null ? Infinity : numFrames, realFrames);
    return orig.call(this, outputs, heads, Number.isFinite(n) ? n : numFrames, ...rest);
  };
  model.__realFrames = true;
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
        res = await fetchAny(input, init);
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

/**
 * Çözümleme döngüye girmiş: aynı 1–2 kelimelik öbek art arda ≥ 4 kez, 3–10 kelimelik öbek ≥ 3 kez ya da saniyede
 * 6'dan çok kelime. (Öğrenci bir cümleyi en çok bir iki kez yeniden okur.)
 */
function looksLooped(words, sec) {
  const t = words.map((w) => w.text.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]/gu, ''));
  for (let n = 1; n <= 10; n++) {
    const need = n <= 2 ? 4 : 3;
    for (let i = 0; i + need * n <= t.length; i++) {
      let rep = 1;
      while (i + (rep + 1) * n <= t.length && t.slice(i, i + n).join(' ') === t.slice(i + rep * n, i + (rep + 1) * n).join(' ')) rep++;
      if (rep >= need) return true;
    }
  }
  return sec > 0 && words.length / sec > 6;
}

/**
 * audio[s, e) parçasını yazıya döker; zamanlar audio'nun başından itibaren saniye. Sesin son 60 ms'sinde ya da
 * sonrasında başlayan "kelimeler" alınmaz (`overflow`): zamanlar sesin boyuyla sınırlı olduğundan (fixWordTimes) sesin
 * karşılığı olmayan sözler sona yığılır; ya metin uydurulmuştur (ör. okumanın sonundaki nefeste "Bu sefer de
 * nektidir?") ya da parçanın sonunda kesilen kelime tamamlanmıştır.
 */
async function transcribePiece(audio, s, e, ticker, maxTokens = 0) {
  realFrames = Math.max(1, Math.ceil((e - s) / FRAME)); // 20 ms'lik çerçeve = kodlayıcının bir çıktısı
  let out;
  try {
    const opts = { ...GEN, streamer: ticker.streamer };
    if (maxTokens > 0) opts.max_new_tokens = maxTokens;
    out = await asr(audio.subarray(s, e), opts);
  } finally {
    realFrames = Infinity;
  }
  const pieceSec = (e - s) / SR;
  const words = [];
  const overflow = [];
  for (const c of out.chunks || []) {
    const text = String(c.text || '').trim();
    if (!text) continue;
    if ((c.timestamp[0] ?? 0) >= pieceSec - 0.06) {
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

/**
 * Konuşma sesi olan bir parçayı tek başına yazıya döker; zamanlar parçanın başından itibaren. Kısa parçalar
 * dengelenmez (bkz. transcribeClips). Sonuç güvenilir değilse (döngü, bilinen uydurma metin, hiç kelime) `words` null:
 * boş liste "parçada kelime yok" diye okunup atlamayı doğrulamasın.
 */
async function transcribeOne(clip, ticker, base) {
  ticker.offset = base;
  if (clip.length > MAX_SEC * SR) {
    const r = await transcribeReading(clip, ticker);
    return { words: r.words.length ? r.words : null, warnings: r.warnings };
  }
  const dur = clip.length / SR;
  ticker.begin(0, dur);
  const r = await transcribePiece(clip, 0, clip.length, ticker, clipTokens(clip.length));
  ticker.end(0, dur, true);
  const warnings = [];
  if (r.overflow.length) warnings.push(`dropped words past the end: ${r.overflow.join(' ')}`);
  if (looksLooped(r.words, clip.length / SR)) {
    warnings.push('loop in clip: no result');
    return { words: null, warnings };
  }
  if (HALLUCINATIONS.test(r.text)) {
    warnings.push(`hallucination in clip: no result: ${r.text.trim()}`);
    return { words: null, warnings };
  }
  if (!r.words.length) warnings.push('no words in clip: no result');
  return { words: r.words.length ? r.words : null, warnings };
}

/**
 * Kısa parçalar, araya 1 sn sessizlik konarak ≤ 28 sn'lik tamponlarda birlikte yazıya dökülür (kodlayıcı daha az
 * çalışır); kelimeler ortalarının düştüğü parçaya dağıtılır. Konuşma enerjisi olmayan parça boş liste, güvenilir sonuç
 * çıkmayan parça null döner (transcribeOne).
 * Tampon döngüye girerse ya da bilinen bir uydurma metin çıkarsa bütün parçalar; kelimesi çıkmayan ya da kelimesi
 * aradaki sessizliğe düşen parçalar ise tek tek yeniden işlenir (Whisper birleştirilmiş kısa parçalarda bazen ilk
 * birkaç parçadan sonra durur; kalan sözler sona yığılır ve atılır, bkz. transcribePiece). Parçalar dengelenmez:
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
  // Konuşma payı %15'ten az olan parça işlenmez (boş döner): ör. okumanın sonundaki atlamada son kelimenin kuyruğu ve
  // sessizlik; kısa sessizlikte Whisper metin uyduruyor. Atlama ve yanlış okuma parçalarında komşu kelimeler vardır.
  const speech = clips.map((c, i) => c.length >= 0.3 * SR && speechRatio({ rms: rmsOf[i], thr }, 0, c.length) >= 0.15);

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
    const r = await transcribePiece(buf, 0, len, ticker, clipTokens(len));
    ticker.end(first, last, true);
    // Sona yığılan çok sayıda söz de döngüdür (Whisper son parçadan sonra tekrara düşmüş; parçalara yanlış kelime dağılır).
    const bad =
      looksLooped(r.words, len / SR) || r.overflow.length >= 4 ? 'loop' : HALLUCINATIONS.test(r.text) ? 'hallucination' : '';
    if (bad) {
      warnings.push(`${bad} in clip group ${g.join(',')}: clips redone one by one`);
      for (const i of g) await single(i);
      continue;
    }
    // Sona yığılan sözler (son parçanın kesilen kelimesinin tamamlanması ya da erken durma) atılır; kelimesi çıkmayan
    // parçalar aşağıda tek tek yeniden işlenir.
    if (r.overflow.length) warnings.push(`clip group ${g.join(',')}: dropped words past the end: ${r.overflow.join(' ')}`);
    const redo = new Set();
    for (const w of r.words) {
      const mid = ((w.start + w.end) / 2) * SR;
      let j = 0;
      while (j + 1 < g.length && mid >= offs[j + 1] - gap / 2) j++;
      const i = g[j];
      const dur = clips[i].length / SR;
      const o = offs[j] / SR;
      // Kelimenin yarısından çoğu aradaki sessizliğe düşüyorsa sesin karşılığı yoktur: parçanın kenarında kesilen bir
      // kelimenin tamamlanması ya da uydurma. Alınmaz (parçanın kelimesi kalmazsa parça aşağıda tek başına işlenir).
      const ws = w.start * SR;
      const we = w.end * SR;
      const cs = offs[j];
      const ce = offs[j] + clips[i].length;
      const inGap = we - ws > 0.02 * SR ? Math.min(we, ce) - Math.max(ws, cs) < 0.5 * (we - ws) : mid < cs - 0.1 * SR || mid > ce + 0.1 * SR;
      if (inGap) {
        warnings.push(`clip ${i}: dropped word in the gap: ${w.text}`);
        continue;
      }
      const st = Math.min(dur, Math.max(0, w.start - o));
      const en = Math.min(dur, Math.max(st, w.end - o));
      out[i].push({ text: w.text, start: +st.toFixed(2), end: +en.toFixed(2) });
    }
    for (const i of g) if (!out[i].length && clips[i].length >= 0.5 * SR) redo.add(i);
    for (const i of g) if (!out[i].length && !redo.has(i)) out[i] = null; // çok kısa ve kelimesiz: sonuç yok
    for (const i of g) {
      if (!redo.has(i)) continue;
      warnings.push(`clip ${i}: no words in group, redone alone`);
      await single(i);
    }
  }
  return { words: out, warnings };
}
