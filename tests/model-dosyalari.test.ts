import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ASR_MODEL, ASR_MODEL_BASE, ORT_BASE, TRANSFORMERS_URL } from '@/lib/oral/auto';
import nextConfig from '../next.config';
import {
  CALISMA_DOSYALARI,
  DOSYALAR,
  MODEL_ID,
  MODEL_KLASORU,
  MODEL_REVIZYON,
  ORT_KLASORU,
  PARCA_BOYU,
  PARCA_LISTESI,
  TRANSFORMERS_SURUMU,
  VENDOR_KLASORU,
  adresler,
  parcaListesi,
  parcalari,
} from '../araclar/model-hazirla.mjs';

// Sesli okumada otomatik analiz: konuşma tanıma modeli ve tarayıcıda çalıştıran dosyalar kendi sunucumuzdan sunulur.
// Hazırlayan betik (araclar/model-hazirla.mjs), Worker'ın kullandığı adresler (src/lib/oral/auto.ts), sunucu başlıkları
// (next.config.ts), Docker görüntüsü ve yayın denetimleri birbiriyle uyumlu kalmalı.

const ROOT = path.resolve(import.meta.dirname, '..');
const oku = (dosya: string) => readFileSync(path.join(ROOT, dosya), 'utf8');

describe('model dosyaları', () => {
  it('betikteki model, sürüm ve adres src/lib/oral/auto.ts ile aynı; adres sürümü içerir', () => {
    expect(MODEL_ID).toBe(ASR_MODEL.id);
    expect(MODEL_REVIZYON).toBe(ASR_MODEL.revision);
    expect(ASR_MODEL_BASE).toBe(`/model/${ASR_MODEL.revision.slice(0, 8)}/`);
    expect(`/${MODEL_KLASORU}/`).toBe(ASR_MODEL_BASE);
  });

  it("transformers.js'in istediği dosyaların hepsi, yalnızca onlar, boyut ve SHA-256 ile sabitlenmiş", () => {
    // q8 dosya adında `_quantized` ekidir (transformers.js 4.3.0, utils/dtypes.js).
    expect(ASR_MODEL.dtype).toEqual({ encoder_model: 'q8', decoder_model_merged: 'q8' });
    expect(DOSYALAR.map((d) => d.yol).sort()).toEqual(
      [
        'config.json',
        'generation_config.json',
        'preprocessor_config.json',
        'tokenizer.json',
        'tokenizer_config.json',
        'onnx/encoder_model_quantized.onnx',
        'onnx/decoder_model_merged_quantized.onnx',
      ].sort(),
    );
    for (const d of DOSYALAR) {
      expect(d.sha256, d.yol).toMatch(/^[0-9a-f]{64}$/);
      expect(d.boyut, d.yol).toBeGreaterThan(0);
    }
  });

  it('büyük model dosyaları HTTP önbelleğine sığan parçalar hâlinde sunulur; Worker parçaları birleştirir', () => {
    // Chrome HTTP önbelleğine tek dosya olarak önbellek boyunun en çok 1/8'ini alır (en az 5 MB); Firefox 50 MB.
    expect(PARCA_BOYU).toBeLessThanOrEqual(8 * 1024 * 1024);
    const buyukler = DOSYALAR.filter((d) => d.boyut > PARCA_BOYU);
    expect(buyukler.map((d) => d.yol).sort()).toEqual(['onnx/decoder_model_merged_quantized.onnx', 'onnx/encoder_model_quantized.onnx']);
    for (const d of DOSYALAR) {
      const p = parcalari(d);
      if (d.boyut <= PARCA_BOYU) {
        expect(p, d.yol).toEqual([]);
        continue;
      }
      expect(p.reduce((n, x) => n + x.boyut, 0), d.yol).toBe(d.boyut);
      expect(p.every((x, i) => x.yol === `${d.yol}.parca-${String(i).padStart(2, '0')}` && x.boyut > 0 && x.boyut <= PARCA_BOYU)).toBe(true);
      expect(parcaListesi().dosyalar[d.yol]).toEqual({ boyut: d.boyut, adet: p.length });
      expect(adresler()).toContain(`${ASR_MODEL_BASE}${ASR_MODEL.id}/${p[0].yol} ${PARCA_BOYU}`);
      expect(adresler().some((a) => a.startsWith(`${ASR_MODEL_BASE}${ASR_MODEL.id}/${d.yol} `)), d.yol).toBe(false);
    }
    expect(parcaListesi().parcaBoyu).toBe(PARCA_BOYU);
    expect(adresler().some((a) => a.startsWith(`${ASR_MODEL_BASE}${ASR_MODEL.id}/${PARCA_LISTESI} `))).toBe(true);
    const isci = oku('public/okuma/analiz-isci.js');
    expect(isci).toContain(`const PARTS_FILE = '${PARCA_LISTESI}';`);
    expect(isci).toContain('.parca-${String(k).padStart(2, \'0\')}');
    expect(isci).toMatch(/res = await fetchAny\(input, init\)/);
  });

  it('ONNX Runtime ve transformers.js adresleri package.json’daki tam sürümü içerir', () => {
    const pkg = JSON.parse(oku('package.json')) as { devDependencies: Record<string, string>; dependencies: Record<string, string> };
    expect(pkg.devDependencies['@huggingface/transformers']).toBe(TRANSFORMERS_SURUMU);
    expect(pkg.dependencies['@huggingface/transformers']).toBeUndefined();
    expect(ORT_BASE).toBe(`/${ORT_KLASORU}/`);
    expect(TRANSFORMERS_URL).toBe(`/${VENDOR_KLASORU}/transformers.min.js`);
    expect(CALISMA_DOSYALARI.map((d) => `/${d.hedef}`)).toContain(TRANSFORMERS_URL);
    for (const d of CALISMA_DOSYALARI.filter((x) => x.hedef.startsWith(ORT_KLASORU))) {
      expect(`/${d.hedef}`.startsWith(ORT_BASE)).toBe(true);
    }
  });

  it('kopyalanan dosyalar node_modules’ta var; wasm dosyaları transformers.min.js içindeki ONNX Runtime sürümünden', () => {
    const nm = path.join(ROOT, 'node_modules');
    expect(JSON.parse(readFileSync(path.join(nm, '@huggingface/transformers/package.json'), 'utf8')).version).toBe(TRANSFORMERS_SURUMU);
    for (const d of CALISMA_DOSYALARI) expect(existsSync(path.join(nm, d.kaynak)), d.kaynak).toBe(true);
    const ort = JSON.parse(readFileSync(path.join(nm, 'onnxruntime-web/package.json'), 'utf8')).version as string;
    const tf = readFileSync(path.join(nm, '@huggingface/transformers/dist/transformers.min.js'), 'utf8');
    expect(tf).toContain(`"${ort}"`);
    // Tek parça: dışarıdan (çıplak adla) modül içe aktarmaz; ONNX Runtime'ın wasm yükleyicisini ve wasm'ı ister.
    expect(tf).not.toMatch(/\bfrom\s*"(onnxruntime-[a-z/]+|@huggingface\/[a-z]+)"/);
    expect(tf).toContain('ort-wasm-simd-threaded.asyncify.wasm');
  });

  it('büyük dosyalar git’e ve Docker derleme bağlamına girmez; betik görüntüde kullanılır', () => {
    const gitignore = oku('.gitignore');
    const dockerignore = oku('.dockerignore').split('\n');
    for (const k of ['model', 'ort', 'vendor']) {
      expect(gitignore).toContain(`/public/${k}/`);
      expect(dockerignore).toContain(`public/${k}`);
    }
    expect(dockerignore).toContain('!araclar/model-hazirla.mjs');
    // onnxruntime-node (transformers.js bağımlılığı) kurulurken GPU dosyalarını indirmez.
    expect(oku('.npmrc')).toMatch(/^onnxruntime-node-install=skip$/m);
    const dockerfile = oku('Dockerfile');
    expect(dockerfile).toContain('COPY package.json package-lock.json .npmrc ./');
    expect(dockerfile).toContain('RUN node araclar/model-hazirla.mjs --model');
    expect(dockerfile).toContain('RUN node araclar/model-hazirla.mjs --calisma && npm run build');
    expect(dockerfile).toContain('COPY --from=model --chown=olcekhane:olcekhane /app/public/model ./public/model');
    expect(oku('araclar/yerel-sunucu.sh')).toContain('araclar/model-hazirla.mjs');
  });

  it('Denetim ve Yayın sitedeki dosyaları betiğin verdiği adreslerle sınar', () => {
    expect(adresler()).toContain(`${ASR_MODEL_BASE}${ASR_MODEL.id}/config.json 2227`);
    expect(adresler()).toContain(`${ORT_BASE}ort-wasm-simd-threaded.asyncify.wasm -`);
    for (const yml of ['.github/workflows/denetim.yml', '.github/workflows/yayin.yml']) {
      expect(oku(yml), yml).toContain('node araclar/model-hazirla.mjs --adresler');
    }
  });
});

describe('sunucu başlıkları', () => {
  async function basliklar(yol: string): Promise<Record<string, string>> {
    const kurallar = (await nextConfig.headers?.()) ?? [];
    const sonuc: Record<string, string> = {};
    for (const k of kurallar) {
      const desen = new RegExp(`^${k.source.replace(/:path\*/g, '.*')}$`);
      if (desen.test(yol)) for (const h of k.headers) sonuc[h.key.toLowerCase()] = h.value;
    }
    return sonuc;
  }

  it("içerik güvenliği: WebAssembly derlemesine izin verilir, eval açılmaz; Worker'lar yalnızca kendi sunucumuzdan", async () => {
    const csp = (await basliklar('/'))['content-security-policy'];
    const yonerge = (ad: string) => csp.split('; ').find((y) => y.startsWith(`${ad} `));
    expect(yonerge('script-src')).toContain("'wasm-unsafe-eval'");
    expect(yonerge('worker-src')).toBe("worker-src 'self'");
    expect(yonerge('connect-src')).toMatch(/^connect-src 'self'/);
    expect(csp).not.toMatch(/https?:/);
  });

  it('cross-origin isolation yalnızca sesli okuma testinde; Worker ve ONNX Runtime dosyaları aynı COEP ile', async () => {
    const coep = async (yol: string) => (await basliklar(yol))['cross-origin-embedder-policy'];
    expect((await basliklar('/'))['cross-origin-opener-policy']).toBe('same-origin');
    for (const yol of [
      '/testler/sesli-okuma-degerlendirmesi/coz',
      '/okuma/analiz-isci.js',
      `${ORT_BASE}ort-wasm-simd-threaded.asyncify.mjs`,
      TRANSFORMERS_URL,
    ]) {
      expect(await coep(yol), yol).toBe('require-corp');
    }
    for (const yol of ['/', '/okuma', '/testler/oz-saygi/coz', '/testler/sesli-okuma-degerlendirmesi']) {
      expect(await coep(yol), yol).toBeUndefined();
    }
  });

  it('sürümlü adresler süresiz önbelleklenir; başka sayfalar değil', async () => {
    const cc = async (yol: string) => (await basliklar(yol))['cache-control'];
    for (const yol of [
      `${ASR_MODEL_BASE}${ASR_MODEL.id}/onnx/encoder_model_quantized.onnx.parca-00`,
      `${ASR_MODEL_BASE}${ASR_MODEL.id}/${PARCA_LISTESI}`,
      `${ORT_BASE}ort-wasm-simd-threaded.wasm`,
      TRANSFORMERS_URL,
    ]) {
      expect(await cc(yol), yol).toBe('public, max-age=31536000, immutable');
    }
    for (const yol of ['/', '/okuma/analiz-isci.js', '/okuma/kayit-isleyici.js']) {
      expect(await cc(yol), yol).toBeUndefined();
    }
  });
});
