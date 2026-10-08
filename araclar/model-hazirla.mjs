#!/usr/bin/env node
// Sesli okumada otomatik analiz için tarayıcının indireceği dosyaları public/ altına hazırlar. Bu dosyalar büyüktür ve
// git'e girmez (.gitignore); Docker görüntüsü derlenirken ve yerel sunucu açılırken bu betikle oluşturulur. Hepsi kendi
// sunucumuzdan sunulur (site üçüncü taraf kaynak kullanmaz):
//
//   public/model/<sürümün ilk 8 harfi>/onnx-community/whisper-small_timestamped/...
//       Konuşma tanıma modeli (~250 MB): Hugging Face'ten sabit sürümüyle indirilir, her dosya aşağıdaki SHA-256 ile
//       doğrulanır. Adres sürümü içerdiği için tarayıcıda süresiz önbelleklenebilir (next.config.ts).
//   public/ort/<transformers sürümü>/      ONNX Runtime Web'in wasm dosyaları ve yükleyicileri (node_modules'tan)
//   public/vendor/<transformers sürümü>/   transformers.js'in tarayıcı derlemesi (node_modules'tan; tek parça, ONNX
//                                          Runtime'ın JavaScript tarafı içinde)
//
//   node araclar/model-hazirla.mjs              hepsi
//   node araclar/model-hazirla.mjs --model      yalnızca model (Dockerfile'da ayrı katman; node_modules gerekmez)
//   node araclar/model-hazirla.mjs --calisma    yalnızca ONNX Runtime ve transformers.js (npm ci'dan sonra)
//   node araclar/model-hazirla.mjs --adresler   sitede sunulan dosyaların adresleri ve model dosyalarının boyutları
//                                               (Denetim ve Yayın'daki dış sınama için; hiçbir şey indirmez)
//   MODEL_KAYNAK=<klasör> node araclar/model-hazirla.mjs
//       Model dosyaları indirilmez, bu klasörden kopyalanır (içinde config.json ve onnx/ bulunur); yine doğrulanır.
//
// Yeniden çalıştırmak güvenlidir: doğru dosya zaten varsa atlanır; yönetilen klasörlerdeki eski sürümler silinir.
// Modelin sürümü değişirse: MODEL_REVIZYON ve DOSYALAR'daki boyut ve SHA-256 değerleri
// (https://huggingface.co/api/models/<model>/tree/<sürüm>/onnx?expand=true; küçük dosyalar için indirip sha256sum) ile
// src/lib/oral/auto.ts'teki ASR_MODEL ve ASR_MODEL_BASE birlikte değişir; tests/model-dosyalari.test.ts denetler.
// transformers.js yükseltilirse package.json'daki sürüm, TRANSFORMERS_SURUMU ve auto.ts'teki ORT_BASE ile
// TRANSFORMERS_URL birlikte değişir.
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync, readFileSync } from 'node:fs';
import { copyFile, mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(KOK, 'public');

export const MODEL_ID = 'onnx-community/whisper-small_timestamped';
export const MODEL_REVIZYON = '65caa70f294b46e1c33ff820aae6b16d048ab818';
/** public/ altındaki model klasörü; sitedeki adresi `/${MODEL_KLASORU}/` (src/lib/oral/auto.ts: ASR_MODEL_BASE). */
export const MODEL_KLASORU = `model/${MODEL_REVIZYON.slice(0, 8)}`;

/**
 * transformers.js 4.3.0'ın konuşma tanıma için istediği dosyalar (dtype: encoder_model ve decoder_model_merged 'q8';
 * q8 dosya adında `_quantized` ekidir). Boyut ve SHA-256 Hugging Face'teki bu sürümden alınmıştır.
 */
export const DOSYALAR = [
  { yol: 'config.json', boyut: 2227, sha256: '457854d452f17661e197d74aee12b8e74fb75ba30ebfaa7426d0d61ea1e08a18' },
  { yol: 'generation_config.json', boyut: 3893, sha256: 'f538b28220c6a6d6f1af1458d4141cacb4ef4963df3de98a19490440c412ddf0' },
  { yol: 'preprocessor_config.json', boyut: 339, sha256: 'a6a76d28c93edb273669eb9e0b0636a2bddbb1272c3261e47b7ca6dfdbac1b8d' },
  { yol: 'tokenizer.json', boyut: 2480466, sha256: '27fc476bfe7f17299480be2273fc0608e4d5a99aba2ab5dec5374b4482d1a566' },
  { yol: 'tokenizer_config.json', boyut: 282683, sha256: '2a4c4281cf9f51ac6ccc406fdc711a087afe6530f671fa7b80953edc498275ce' },
  {
    yol: 'onnx/encoder_model_quantized.onnx',
    boyut: 92240498,
    sha256: '9f5635b596e6084045c7426ca6f6f99db8ce606ea895397c3b4a3c0aa3f9b070',
  },
  {
    yol: 'onnx/decoder_model_merged_quantized.onnx',
    boyut: 156795750,
    sha256: 'c831996a6d5a535cf17447b0d7ecc36da6b72696e6fb906852ba6136b9199abb',
  },
];

/** package.json'daki @huggingface/transformers sürümü (tam sürüm); ort/ ve vendor/ adresleri bunu içerir. */
export const TRANSFORMERS_SURUMU = '4.3.0';
export const ORT_KLASORU = `ort/${TRANSFORMERS_SURUMU}`;
export const VENDOR_KLASORU = `vendor/${TRANSFORMERS_SURUMU}`;

/**
 * node_modules'tan kopyalanan çalışma dosyaları. transformers.min.js, ONNX Runtime Web'in JavaScript tarafını içinde
 * taşır ve yalnızca wasm yükleyicisini (.mjs) ve wasm'ı ayrıca ister: varsayılan olarak asyncify sürümü, WebGPU'suz
 * Safari 26 öncesinde (transformers.js'in kendi seçimi) düz sürüm. Worker env.backends.onnx.wasm.wasmPaths'i
 * ORT_BASE'e yöneltir; yoksa transformers.js bu dosyaları jsDelivr'den ister.
 */
export const CALISMA_DOSYALARI = [
  { kaynak: '@huggingface/transformers/dist/transformers.min.js', hedef: `${VENDOR_KLASORU}/transformers.min.js` },
  { kaynak: 'onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.mjs', hedef: `${ORT_KLASORU}/ort-wasm-simd-threaded.asyncify.mjs` },
  { kaynak: 'onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.wasm', hedef: `${ORT_KLASORU}/ort-wasm-simd-threaded.asyncify.wasm` },
  { kaynak: 'onnxruntime-web/dist/ort-wasm-simd-threaded.mjs', hedef: `${ORT_KLASORU}/ort-wasm-simd-threaded.mjs` },
  { kaynak: 'onnxruntime-web/dist/ort-wasm-simd-threaded.wasm', hedef: `${ORT_KLASORU}/ort-wasm-simd-threaded.wasm` },
];

const INDIRME_DENEMESI = 3;
const INDIRME_SURESI_MS = 20 * 60 * 1000;

const satir = (etiket, metin) => console.log(`  ${etiket.padEnd(10)} ${metin}`);
const mb = (n) => (n < 1e6 ? `${Math.ceil(n / 1e3)} kB` : `${(n / 1e6).toFixed(1)} MB`);

class HazirlamaHatasi extends Error {}

async function sha256Dosya(dosya) {
  const h = createHash('sha256');
  await pipeline(createReadStream(dosya), h);
  return h.digest('hex');
}

/** Dosya var ve boyutu ile SHA-256'sı beklenen değerse true. */
async function dogruMu(dosya, beklenen) {
  try {
    const s = await stat(dosya);
    if (!s.isFile() || s.size !== beklenen.boyut) return false;
  } catch {
    return false;
  }
  return (await sha256Dosya(dosya)) === beklenen.sha256;
}

/** Hugging Face'ten indirir; dosyayı yazarken SHA-256'sını da hesaplar. */
async function indir(adres, hedef) {
  const yanit = await fetch(adres, { redirect: 'follow', signal: AbortSignal.timeout(INDIRME_SURESI_MS) });
  if (!yanit.ok || !yanit.body) throw new Error(`${adres}: HTTP ${yanit.status}`);
  const h = createHash('sha256');
  let boyut = 0;
  const say = new Transform({
    transform(parca, _kod, sonra) {
      h.update(parca);
      boyut += parca.length;
      sonra(null, parca);
    },
  });
  await pipeline(Readable.fromWeb(yanit.body), say, createWriteStream(hedef));
  return { boyut, sha256: h.digest('hex') };
}

async function modelDosyasi(dosya, kaynakKlasor) {
  const hedef = path.join(PUBLIC, MODEL_KLASORU, MODEL_ID, dosya.yol);
  if (await dogruMu(hedef, dosya)) {
    satir('hazır', dosya.yol);
    return;
  }
  await mkdir(path.dirname(hedef), { recursive: true });
  const gecici = `${hedef}.hazirlaniyor`;
  for (let deneme = 1; ; deneme++) {
    await rm(gecici, { force: true });
    let sonuc;
    try {
      if (kaynakKlasor) {
        await copyFile(path.join(kaynakKlasor, dosya.yol), gecici);
        sonuc = { boyut: (await stat(gecici)).size, sha256: await sha256Dosya(gecici) };
      } else {
        const adres = `https://huggingface.co/${MODEL_ID}/resolve/${MODEL_REVIZYON}/${dosya.yol}`;
        sonuc = await indir(adres, gecici);
      }
    } catch (hata) {
      await rm(gecici, { force: true });
      if (kaynakKlasor || deneme >= INDIRME_DENEMESI) {
        throw new HazirlamaHatasi(`${dosya.yol} alınamadı: ${hata instanceof Error ? hata.message : hata}`);
      }
      satir('yeniden', `${dosya.yol} (${deneme}. deneme başarısız: ${hata instanceof Error ? hata.message : hata})`);
      continue;
    }
    if (sonuc.boyut === dosya.boyut && sonuc.sha256 === dosya.sha256) {
      await rename(gecici, hedef);
      satir(kaynakKlasor ? 'kopyalandı' : 'indirildi', `${dosya.yol} (${mb(dosya.boyut)}, SHA-256 doğru)`);
      return;
    }
    await rm(gecici, { force: true });
    const ayrinti = `boyut ${sonuc.boyut} (beklenen ${dosya.boyut}), SHA-256 ${sonuc.sha256}`;
    if (kaynakKlasor || deneme >= INDIRME_DENEMESI) {
      throw new HazirlamaHatasi(`${dosya.yol} doğrulanamadı: ${ayrinti}. Dosya beklenen sürümün dosyası değil.`);
    }
    satir('yeniden', `${dosya.yol} (${deneme}. denemede doğrulanamadı: ${ayrinti})`);
  }
}

/** Yönetilen klasörde (public/model, public/ort, public/vendor) şimdiki sürümden başka ne varsa siler. */
async function eskileriSil(ust, kalacak) {
  const klasor = path.join(PUBLIC, ust);
  if (!existsSync(klasor)) return;
  for (const ad of await readdir(klasor)) {
    if (ad === kalacak) continue;
    await rm(path.join(klasor, ad), { recursive: true, force: true });
    satir('silindi', `public/${ust}/${ad} (eski sürüm)`);
  }
}

async function modeliHazirla() {
  const kaynak = process.env.MODEL_KAYNAK ? path.resolve(process.env.MODEL_KAYNAK) : '';
  if (kaynak && !existsSync(path.join(kaynak, 'config.json'))) {
    throw new HazirlamaHatasi(`MODEL_KAYNAK klasöründe config.json yok: ${kaynak} (modelin kendi klasörü verilmeli).`);
  }
  console.log(`Model: ${MODEL_ID}@${MODEL_REVIZYON.slice(0, 8)} → public/${MODEL_KLASORU}/ (${kaynak ? `kaynak: ${kaynak}` : 'Hugging Face'})`);
  await eskileriSil('model', MODEL_REVIZYON.slice(0, 8));
  for (const dosya of DOSYALAR) await modelDosyasi(dosya, kaynak);
}

function paketSurumu(ad) {
  const dosya = path.join(KOK, 'node_modules', ad, 'package.json');
  if (!existsSync(dosya)) throw new HazirlamaHatasi(`node_modules/${ad} yok: önce npm ci çalıştırılmalı.`);
  return JSON.parse(readFileSync(dosya, 'utf8')).version;
}

async function calismaDosyalariniHazirla() {
  const tf = paketSurumu('@huggingface/transformers');
  if (tf !== TRANSFORMERS_SURUMU) {
    throw new HazirlamaHatasi(
      `node_modules'taki transformers.js ${tf}, beklenen ${TRANSFORMERS_SURUMU}: sürüm değiştiyse TRANSFORMERS_SURUMU ve src/lib/oral/auto.ts birlikte güncellenmeli.`,
    );
  }
  // transformers.min.js'in içindeki ONNX Runtime ile wasm dosyaları aynı sürümden olmalı.
  const ort = paketSurumu('onnxruntime-web');
  const tfKod = readFileSync(path.join(KOK, 'node_modules', CALISMA_DOSYALARI[0].kaynak), 'utf8');
  if (!tfKod.includes(`"${ort}"`)) {
    throw new HazirlamaHatasi(`node_modules'taki onnxruntime-web ${ort}, transformers.min.js'in içindeki ONNX Runtime sürümüyle aynı değil.`);
  }
  console.log(`transformers.js ${tf} ve ONNX Runtime Web ${ort} → public/${VENDOR_KLASORU}/, public/${ORT_KLASORU}/`);
  await eskileriSil('ort', TRANSFORMERS_SURUMU);
  await eskileriSil('vendor', TRANSFORMERS_SURUMU);
  for (const { kaynak, hedef } of CALISMA_DOSYALARI) {
    const k = path.join(KOK, 'node_modules', kaynak);
    const h = path.join(PUBLIC, hedef);
    const ks = await stat(k);
    if (existsSync(h) && (await stat(h)).size === ks.size && (await sha256Dosya(h)) === (await sha256Dosya(k))) {
      satir('hazır', hedef);
      continue;
    }
    await mkdir(path.dirname(h), { recursive: true });
    await copyFile(k, `${h}.hazirlaniyor`);
    await rename(`${h}.hazirlaniyor`, h);
    satir('kopyalandı', `${hedef} (${mb(ks.size)})`);
  }
}

/** Sitede sunulan dosyaların adresleri; model dosyalarında beklenen boyutla ("-": boyut node_modules'a bağlı). */
export function adresler() {
  return [
    ...DOSYALAR.map((d) => `/${MODEL_KLASORU}/${MODEL_ID}/${d.yol} ${d.boyut}`),
    ...CALISMA_DOSYALARI.map((d) => `/${d.hedef} -`),
  ];
}

async function ana(argv) {
  const secenek = argv[0] ?? '';
  if (secenek === '--adresler') {
    console.log(adresler().join('\n'));
    return;
  }
  if (!['', '--model', '--calisma'].includes(secenek) || argv.length > 1) {
    throw new HazirlamaHatasi(`Bilinmeyen seçenek: ${argv.join(' ')} (kullanım: betiğin başındaki açıklama)`);
  }
  if (secenek !== '--calisma') await modeliHazirla();
  if (secenek !== '--model') await calismaDosyalariniHazirla();
  console.log('Otomatik analiz dosyaları hazır.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  ana(process.argv.slice(2)).catch((hata) => {
    console.error(hata instanceof HazirlamaHatasi ? `Hata: ${hata.message}` : hata);
    process.exit(1);
  });
}
