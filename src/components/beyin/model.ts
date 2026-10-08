import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { BufferAttribute, BufferGeometry } from 'three';
import { MODEL_YOLU } from '@/content/beyin/model-surum';
import type { Katman } from '@/content/beyin/yapilar';

/**
 * Beyin modelinin paketlerini indirip çözer (biçim: araclar/beyin-modeli.mjs). Her paket sayfa açık kaldığı sürece
 * bir kez indirilir; aynı sayfadaki bütün sahneler aynı geometriyi kullanır. Hiçbir şey tarayıcı deposuna yazılmaz;
 * dosyalar sürümlü adresleriyle olağan HTTP önbelleğinde kalır.
 */

interface ParcaKaydi {
  k: Katman;
  kv: [number, number];
  ki: [number, number];
  v: number;
  i: number;
  min: [number, number, number];
  olcek: [number, number, number];
}

export interface ModelDizini {
  boyut: [number, number, number];
  katmanlar: Record<Katman, number>;
  parcalar: Record<string, ParcaKaydi>;
}

let dizinSozu: Promise<ModelDizini> | null = null;
const katmanSozleri = new Map<Katman, Promise<Map<string, BufferGeometry>>>();

export function modelDizini(): Promise<ModelDizini> {
  dizinSozu ??= fetch(`${MODEL_YOLU}/dizin.json`).then((r) => {
    if (!r.ok) throw new Error(`Model dizini indirilemedi (${r.status})`);
    return r.json() as Promise<ModelDizini>;
  });
  dizinSozu.catch(() => {
    dizinSozu = null;
  });
  return dizinSozu;
}

/** İlerlemeyi bayt olarak bildirerek indirir. */
async function indir(adres: string, ilerleme: (alinan: number) => void): Promise<Uint8Array> {
  const r = await fetch(adres);
  if (!r.ok || !r.body) throw new Error(`${adres} indirilemedi (${r.status})`);
  const okuyucu = r.body.getReader();
  const parcalar: Uint8Array[] = [];
  let alinan = 0;
  for (;;) {
    const { done, value } = await okuyucu.read();
    if (done) break;
    parcalar.push(value);
    alinan += value.length;
    ilerleme(alinan);
  }
  const tum = new Uint8Array(alinan);
  let o = 0;
  for (const p of parcalar) {
    tum.set(p, o);
    o += p.length;
  }
  return tum;
}

function coz(bin: Uint8Array, p: ParcaKaydi): BufferGeometry {
  const kv = bin.subarray(p.kv[0], p.kv[0] + p.kv[1]);
  const ki = bin.subarray(p.ki[0], p.ki[0] + p.ki[1]);
  const q = new Uint16Array(p.v * 4);
  MeshoptDecoder.decodeVertexBuffer(new Uint8Array(q.buffer), p.v, 8, kv);
  const ucgen = new Uint32Array(p.i);
  MeshoptDecoder.decodeIndexBuffer(new Uint8Array(ucgen.buffer), p.i, 4, ki);
  const konum = new Float32Array(p.v * 3);
  for (let j = 0; j < p.v; j++) {
    konum[j * 3] = p.min[0] + q[j * 4] * p.olcek[0];
    konum[j * 3 + 1] = p.min[1] + q[j * 4 + 1] * p.olcek[1];
    konum[j * 3 + 2] = p.min[2] + q[j * 4 + 2] * p.olcek[2];
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(konum, 3));
  g.setIndex(new BufferAttribute(p.v < 65536 ? Uint16Array.from(ucgen) : ucgen, 1));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

/**
 * Bir paketteki bütün parçaların geometrisi (FJ kimliğine göre). `ilerleme` bu paketin indirilen bayt sayısını bildirir.
 */
export function katmanYukle(k: Katman, ilerleme: (alinan: number) => void = () => {}): Promise<Map<string, BufferGeometry>> {
  let soz = katmanSozleri.get(k);
  if (!soz) {
    soz = (async () => {
      const [dizin, bin] = await Promise.all([modelDizini(), indir(`${MODEL_YOLU}/${k}.bin`, ilerleme), MeshoptDecoder.ready]);
      const sonuc = new Map<string, BufferGeometry>();
      for (const [id, p] of Object.entries(dizin.parcalar)) if (p.k === k) sonuc.set(id, coz(bin, p));
      return sonuc;
    })();
    soz.catch(() => katmanSozleri.delete(k));
    katmanSozleri.set(k, soz);
  }
  return soz;
}
