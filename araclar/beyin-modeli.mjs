#!/usr/bin/env node
// Beyin Akademisi'nin üç boyutlu beyin modelini hazırlar: BodyParts3D 4.0'ın (IS-A ağacı, %99 sadeleştirilmiş OBJ)
// içinden yalnızca src/content/beyin/yapilar.ts'te adı geçen parçaları alır, küçültüp paketler ve
// public/beyin/model/<içerik özeti>/ altına yazar. Çıktı git'e girer (birkaç MB); Docker derlemesi bu betiği çalıştırmaz,
// böylece yayın, kaynak sitenin o anki durumuna bağlı kalmaz.
//
//   node araclar/beyin-modeli.mjs                       arşivi indirir (SHA-256 ile doğrular) ve paketler
//   BODYPARTS3D_ZIP=<yol> node araclar/beyin-modeli.mjs  önceden indirilmiş arşivi kullanır
//
// Kaynak: BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.
// https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html (lisans sayfası 2025-02-27'de CC BY 4.0'a güncellendi).
// Yapılan uyarlamalar (sayfada da yazar): eksen ve merkez değişimi, köşe sırasının dışa bakacak biçimde düzeltilmesi,
// konumların 16 bit nicelenmesi ve meshoptimizer ile sıkıştırma. Biçim değişirse src/components/beyin/model.ts ile
// tests/beyin.test.ts birlikte güncellenir.
//
// Paket biçimi (her katman ayrı .bin; dizin.json hepsini anlatır):
//   konumlar: parça başına 16 bit (x, y, z, boş) köşeler, meshopt encodeVertexBuffer ile (köşe boyu 8 bayt);
//             gerçek konum = en_kucuk + deger * olcek (milimetre, beynin merkezine göre).
//   üçgenler: meshopt encodeIndexBuffer (4 bayt), köşe önbelleği ve okuma sırasına göre yeniden dizilmiş.
// Eksenler: BodyParts3D'de x sola, y arkaya, z yukarı; burada X sola, Y yukarı, Z öne (sağ el kuralı korunur).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MeshoptEncoder } from 'meshoptimizer/encoder';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARSIV_ADRESI = 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip';
const ARSIV_SHA256 = '40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e';
const CIKTI = path.join(KOK, 'public', 'beyin', 'model');
const SURUM_DOSYASI = path.join(KOK, 'src', 'content', 'beyin', 'model-surum.ts');
// Merkez, beynin kendisine göre (kabuk, beyaz cevher, beyin sapı ve beyincik) hesaplanır; kemik ve damarlar bu
// eksenlere göre yerleşir.
const MERKEZ_KATMANLARI = new Set(['kabuk', 'beyaz', 'sap']);

function sha256(dosya) {
  return createHash('sha256').update(readFileSync(dosya)).digest('hex');
}

async function arsiv() {
  const verilen = process.env.BODYPARTS3D_ZIP;
  const yer = verilen ?? path.join(os.tmpdir(), 'isa_BP3D_4.0_obj_99.zip');
  if (!existsSync(yer)) {
    if (verilen) throw new Error(`Arşiv bulunamadı: ${verilen}`);
    console.log(`BodyParts3D 4.0 indiriliyor (~143 MB): ${ARSIV_ADRESI}`);
    execFileSync('curl', ['-sS', '--fail', '-o', yer, ARSIV_ADRESI], { stdio: 'inherit' });
  }
  const ozet = sha256(yer);
  if (ozet !== ARSIV_SHA256) throw new Error(`Arşivin SHA-256 değeri beklenenden farklı: ${ozet}`);
  return yer;
}

/**
 * Aynalanmış parça: kimliğin sonu `~ayna` ise asıl parça okunur ve orta hatta yakın kenarı boyunca aynalanır (yalnızca
 * bir yarısı modellenmiş yapılar için, ör. beyincik çadırı). Aynalama BodyParts3D eksenlerinde (x sola) yapılır; üçgenlerin
 * yönü aşağıdaki hacim denetimiyle düzelir. Sayfadaki model notu bu uyarlamayı anlatır.
 */
const AYNA = '~ayna';

/**
 * Aynalanan yarının altında kalan yapılar. İnsanın iki yanı tam simetrik olmadığı için aynalanmış beyincik çadırı yer
 * yer sol beyincik yarımküresinin (FJ1781) içinde kalır ve beyincik yaprağın içinden taşar. Bu yüzden aynalanan yarı,
 * yalnızca gereken yerlerde ve yumuşak bir tümsekle, beyinciğin üst yüzünün biraz üstüne kaldırılır. Ayrıca iki yarı,
 * çentiğin arkasında orta hatta birleşsin diye aynalanan yarının iç kenarı asıl yarının kenarına kaydırılır; kaldırma
 * orta hatta da sürüyorsa asıl yarının kenarı aynı miktarda kaldırılır (birleşme yeri açılmasın diye).
 */
const AYNA_ENGEL = { FJ1843: ['FJ1781'] };

/** Yüzey (v, BodyParts3D: z yukarı) engelin üst yüzünün PAY mm üstüne kalkar; kaldırma YARICAP mm içinde azalarak yayılır. */
function engeldenKaldir(v, engel) {
  const H = 1.5;
  const PAY = 0.8;
  const YARICAP = 8;
  const hucre = (x, y) => `${Math.floor(x / H)},${Math.floor(y / H)}`;
  const enUst = (dizi) => {
    const m = new Map();
    for (let i = 0; i < dizi.length; i += 3) {
      const k = hucre(dizi[i], dizi[i + 1]);
      if (!m.has(k) || dizi[i + 2] > m.get(k)) m.set(k, dizi[i + 2]);
    }
    return m;
  };
  const yuzey = enUst(v);
  const ustu = enUst(engel);
  const gerek = [];
  for (const [k, z] of yuzey) {
    const e = ustu.get(k);
    if (e !== undefined && e + PAY > z) {
      const [i, j] = k.split(',').map(Number);
      gerek.push([(i + 0.5) * H, (j + 0.5) * H, e + PAY - z]);
    }
  }
  const kalkma = new Float64Array(v.length / 3);
  for (let i = 0; i < v.length; i += 3) {
    let kaldir = 0;
    for (const [x, y, d] of gerek) {
      const r = Math.hypot(v[i] - x, v[i + 1] - y);
      if (r < YARICAP) kaldir = Math.max(kaldir, d * 0.5 * (1 + Math.cos((Math.PI * r) / YARICAP)));
    }
    v[i + 2] += kaldir;
    kalkma[i / 3] = kaldir;
  }
  console.log(`  aynalanmış yarı: ${gerek.length} hücrede engelin üstüne kaldırıldı (en çok ${Math.max(...kalkma).toFixed(2)} mm)`);
  return kalkma;
}

const aynaOnbellek = new Map();

/** Asıl yarı (sag) ve aynalanmış yarı (sol), birleşme yeri kapatılmış ve engelden kaldırılmış olarak. */
function aynaCifti(zip, taban) {
  if (aynaOnbellek.has(taban)) return aynaOnbellek.get(taban);
  const asil = hamOku(zip, taban);
  const n = asil.v.length / 3;
  let ort = 0;
  let enKucukX = Infinity;
  let enBuyukX = -Infinity;
  let enKucukY = Infinity;
  let enBuyukY = -Infinity;
  for (let i = 0; i < asil.v.length; i += 3) {
    ort += asil.v[i];
    enKucukX = Math.min(enKucukX, asil.v[i]);
    enBuyukX = Math.max(enBuyukX, asil.v[i]);
    enKucukY = Math.min(enKucukY, asil.v[i + 1]);
    enBuyukY = Math.max(enBuyukY, asil.v[i + 1]);
  }
  ort /= n;
  // s = 1: asıl yarı eksi x yanında, aynası artı x yanında.
  const s = ort < 0 ? 1 : -1;
  const duzlem = ort < 0 ? enBuyukX : enKucukX;
  // İç kenarın y boyunca yeri (4 mm'lik dilimler) ve iki yarı arasındaki aralık.
  const DILIM = 4;
  const dilimSay = Math.ceil((enBuyukY - enKucukY) / DILIM) + 1;
  const kenar = new Array(dilimSay).fill(null);
  for (let i = 0; i < asil.v.length; i += 3) {
    const d = Math.floor((asil.v[i + 1] - enKucukY) / DILIM);
    const x = asil.v[i];
    if (kenar[d] === null || s * x > s * kenar[d]) kenar[d] = x;
  }
  for (let d = 0; d < dilimSay; d++) if (kenar[d] === null) kenar[d] = kenar[d - 1] ?? duzlem;
  const ara = (dizi, y) => {
    const t = (y - enKucukY) / DILIM - 0.5;
    const d = Math.max(0, Math.min(dilimSay - 1, Math.floor(t)));
    const e = Math.min(dilimSay - 1, d + 1);
    const w = Math.max(0, Math.min(1, t - d));
    return dizi[d] * (1 - w) + dizi[e] * w;
  };
  // Aralık 4 mm'ye kadar kapatılır; 4–8 mm arasında kapatma azalır (çentik açık kalır).
  const kapat = kenar.map((x) => {
    const g = 2 * Math.abs(duzlem - x);
    return g <= 4 ? 1 : g < 8 ? (8 - g) / 4 : 0;
  });
  const sol = new Float64Array(asil.v);
  const kenardanUzak = new Float64Array(n);
  for (let i = 0; i < sol.length; i += 3) {
    const y = sol[i + 1];
    const xe = ara(kenar, y);
    const yeni = 2 * duzlem - sol[i];
    const d = s * (yeni - (2 * duzlem - xe));
    kenardanUzak[i / 3] = d;
    const kayma = 2 * Math.abs(duzlem - xe) * ara(kapat, y) * Math.max(0, 1 - d / 12);
    sol[i] = yeni - s * kayma;
  }
  let kalkma = new Float64Array(n);
  const engel = AYNA_ENGEL[taban];
  if (engel) kalkma = engeldenKaldir(sol, engel.flatMap((e) => Array.from(hamOku(zip, e).v)));
  // Birleşme yerindeki kaldırma, asıl yarının kenarına da uygulanır.
  const kenarKalkma = new Float64Array(dilimSay);
  for (let k = 0; k < n; k++) {
    if (kenardanUzak[k] > 1.5) continue;
    const d = Math.max(0, Math.min(dilimSay - 1, Math.floor((sol[k * 3 + 1] - enKucukY) / DILIM)));
    kenarKalkma[d] = Math.max(kenarKalkma[d], kalkma[k] * kapat[d]);
  }
  const sag = new Float64Array(asil.v);
  let enCok = 0;
  for (let i = 0; i < sag.length; i += 3) {
    const y = sag[i + 1];
    const uzak = s * (ara(kenar, y) - sag[i]);
    const z = ara(kenarKalkma, y) * Math.max(0, 1 - uzak / 6);
    sag[i + 2] += z;
    enCok = Math.max(enCok, z);
  }
  console.log(`  asıl yarı: birleşme yerinde en çok ${enCok.toFixed(2)} mm kaldırıldı`);
  const sonuc = { sag: { v: sag, f: asil.f }, sol: { v: sol, f: asil.f } };
  aynaOnbellek.set(taban, sonuc);
  return sonuc;
}

function objOku(zip, id) {
  const taban = id.endsWith(AYNA) ? id.slice(0, -AYNA.length) : id;
  if (id.endsWith(AYNA) || AYNA_ENGEL[taban]) {
    const cift = aynaCifti(zip, taban);
    return id.endsWith(AYNA) ? cift.sol : cift.sag;
  }
  return hamOku(zip, id);
}

function hamOku(zip, id) {
  const metin = execFileSync('unzip', ['-p', zip, `isa_BP3D_4.0_obj_99/${id}.obj`], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
  const v = [];
  const f = [];
  for (const satir of metin.split('\n')) {
    if (satir.startsWith('v ')) {
      const [, x, y, z] = satir.trim().split(/\s+/).map(Number);
      v.push(x, y, z);
    } else if (satir.startsWith('f ')) {
      const k = satir
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((s) => Number(s.split('/')[0]) - 1);
      for (let i = 1; i + 1 < k.length; i++) f.push(k[0], k[i], k[i + 1]);
    }
  }
  if (v.length === 0 || f.length === 0) throw new Error(`${id}: boş parça`);
  return { v: new Float64Array(v), f: new Uint32Array(f) };
}

/** BodyParts3D (x sol, y arka, z yukarı) → sahne (X sol, Y yukarı, Z ön). */
function eksen(v) {
  const o = new Float64Array(v.length);
  for (let i = 0; i < v.length; i += 3) {
    o[i] = v[i];
    o[i + 1] = v[i + 2];
    o[i + 2] = -v[i + 1];
  }
  return o;
}

/** Kapalı bir yüzeyin işaretli hacmi: eksiyse üçgenler içe bakıyordur (aynalanmış parçalarda olur). */
function hacim(v, f) {
  let t = 0;
  for (let i = 0; i < f.length; i += 3) {
    const a = f[i] * 3;
    const b = f[i + 1] * 3;
    const c = f[i + 2] * 3;
    t +=
      v[a] * (v[b + 1] * v[c + 2] - v[b + 2] * v[c + 1]) -
      v[a + 1] * (v[b] * v[c + 2] - v[b + 2] * v[c]) +
      v[a + 2] * (v[b] * v[c + 1] - v[b + 1] * v[c]);
  }
  return t / 6;
}

async function main() {
  const { YAPILAR } = await import(pathToFileURL(path.join(KOK, 'src', 'content', 'beyin', 'yapilar.ts')).href);
  const parcaKatmani = new Map();
  for (const y of YAPILAR) {
    for (const p of y.parcalar) {
      const once = parcaKatmani.get(p);
      if (once && once !== y.katman) throw new Error(`${p} iki katmanda: ${once}, ${y.katman}`);
      parcaKatmani.set(p, y.katman);
    }
  }
  const zip = await arsiv();
  await MeshoptEncoder.ready;

  const ham = new Map();
  for (const [id, katman] of parcaKatmani) ham.set(id, { katman, ...objOku(zip, id) });

  // Merkez: beyin katmanlarının sınır kutusunun ortası (sahne eksenlerinde).
  const enKucuk = [Infinity, Infinity, Infinity];
  const enBuyuk = [-Infinity, -Infinity, -Infinity];
  for (const [, p] of ham) {
    p.v = eksen(p.v);
    if (!MERKEZ_KATMANLARI.has(p.katman)) continue;
    for (let i = 0; i < p.v.length; i += 3) {
      for (let d = 0; d < 3; d++) {
        enKucuk[d] = Math.min(enKucuk[d], p.v[i + d]);
        enBuyuk[d] = Math.max(enBuyuk[d], p.v[i + d]);
      }
    }
  }
  const merkez = enKucuk.map((m, d) => (m + enBuyuk[d]) / 2);
  const boyut = enKucuk.map((m, d) => enBuyuk[d] - m);

  const katmanlar = new Map();
  const dizin = {};
  for (const [id, p] of [...ham].sort(([a], [b]) => a.localeCompare(b))) {
    const { v } = p;
    for (let i = 0; i < v.length; i += 3) for (let d = 0; d < 3; d++) v[i + d] -= merkez[d];
    let f = p.f;
    if (hacim(v, f) < 0) {
      f = f.slice();
      for (let i = 0; i < f.length; i += 3) [f[i + 1], f[i + 2]] = [f[i + 2], f[i + 1]];
    }
    // Köşe önbelleği ve okuma sırası: sıkıştırma ve çizim hızı için.
    const ucgen = f.slice();
    const [eslem, essiz] = MeshoptEncoder.reorderMesh(ucgen, true, false);
    const yeniV = new Float64Array(essiz * 3);
    for (let i = 0; i < eslem.length; i++) {
      const j = eslem[i];
      if (j === 0xffffffff) continue;
      yeniV[j * 3] = v[i * 3];
      yeniV[j * 3 + 1] = v[i * 3 + 1];
      yeniV[j * 3 + 2] = v[i * 3 + 2];
    }
    const mn = [Infinity, Infinity, Infinity];
    const mx = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < yeniV.length; i += 3) {
      for (let d = 0; d < 3; d++) {
        mn[d] = Math.min(mn[d], yeniV[i + d]);
        mx[d] = Math.max(mx[d], yeniV[i + d]);
      }
    }
    const olcek = mn.map((m, d) => Math.max(mx[d] - m, 1e-6) / 65535);
    const q = new Uint16Array(essiz * 4);
    for (let i = 0; i < essiz; i++) {
      for (let d = 0; d < 3; d++) q[i * 4 + d] = Math.round((yeniV[i * 3 + d] - mn[d]) / olcek[d]);
    }
    const kv = MeshoptEncoder.encodeVertexBuffer(new Uint8Array(q.buffer), essiz, 8);
    const ki = MeshoptEncoder.encodeIndexBuffer(new Uint8Array(ucgen.buffer), ucgen.length, 4);
    const liste = katmanlar.get(p.katman) ?? [];
    const once = liste.reduce((t, b) => t + b.length, 0);
    liste.push(kv, ki);
    katmanlar.set(p.katman, liste);
    dizin[id] = {
      k: p.katman,
      kv: [once, kv.length],
      ki: [once + kv.length, ki.length],
      v: essiz,
      i: ucgen.length,
      min: mn.map((x) => Number(x.toFixed(4))),
      olcek: olcek.map((x) => Number(x.toPrecision(8))),
    };
  }

  const katmanBoyu = {};
  const dosyalar = new Map();
  for (const [k, liste] of katmanlar) {
    const toplam = liste.reduce((t, b) => t + b.length, 0);
    const bin = new Uint8Array(toplam);
    let o = 0;
    for (const b of liste) {
      bin.set(b, o);
      o += b.length;
    }
    dosyalar.set(`${k}.bin`, bin);
    katmanBoyu[k] = toplam;
  }
  const govde = {
    kaynak: 'BodyParts3D 4.0 (isa_BP3D_4.0_obj_99), © The Database Center for Life Science, CC BY 4.0',
    birim: 'mm',
    eksen: 'X sol, Y yukarı, Z ön; merkez beynin sınır kutusunun ortası',
    boyut: boyut.map((x) => Number(x.toFixed(2))),
    katmanlar: katmanBoyu,
    parcalar: dizin,
  };
  const ozet = createHash('sha256');
  ozet.update(JSON.stringify(govde));
  for (const [ad, bin] of [...dosyalar].sort(([a], [b]) => a.localeCompare(b))) ozet.update(ad).update(bin);
  const surum = ozet.digest('hex').slice(0, 10);

  await mkdir(CIKTI, { recursive: true });
  for (const eski of await readdir(CIKTI)) if (eski !== surum) await rm(path.join(CIKTI, eski), { recursive: true, force: true });
  const yer = path.join(CIKTI, surum);
  await mkdir(yer, { recursive: true });
  for (const [ad, bin] of dosyalar) await writeFile(path.join(yer, ad), bin);
  await writeFile(path.join(yer, 'dizin.json'), `${JSON.stringify(govde)}\n`);
  await writeFile(
    SURUM_DOSYASI,
    `// araclar/beyin-modeli.mjs yazar; elle değiştirmeyin.\nexport const MODEL_SURUMU = '${surum}';\nexport const MODEL_YOLU = '/beyin/model/${surum}';\n`,
  );

  const ucgenler = Object.values(dizin).reduce((t, p) => t + p.i / 3, 0);
  console.log(`Sürüm ${surum}: ${Object.keys(dizin).length} parça, ${ucgenler} üçgen, boyut ${govde.boyut.join(' × ')} mm`);
  for (const [k, b] of Object.entries(katmanBoyu)) console.log(`  ${k.padEnd(9)} ${(b / 1024).toFixed(0).padStart(6)} KB`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
