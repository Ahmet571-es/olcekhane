import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';
import sitemap from '@/app/sitemap';
import { adrestenDuzey, DUZEY_ADRESI, DUZEY_KARTI, DUZEY_SIRASI } from '@/components/beyin/duzey';
import { etiketDuzeni } from '@/components/beyin/etiket-duzeni';
import { BEYIN_YOLU, DALLAR, hazirDersler, SEVIYE_ADLARI, toplamDers } from '@/content/beyin';
import { MODEL_SURUMU, MODEL_YOLU } from '@/content/beyin/model-surum';
import { NOKTALAR, noktaById } from '@/content/beyin/noktalar';
import { blokDuzeyi, KUTU_DUZEYI, type Sahne } from '@/content/beyin/types';
import { BOLGE_ADLARI, KATMAN_ADLARI, LOB_ADLARI, YAPILAR } from '@/content/beyin/yapilar';

/**
 * Beyin Akademisi: yapı kataloğu, üç boyutlu model dosyaları ve dersler birbiriyle tutarlı olmalı. Bir sahnede adı
 * geçen her yapı katalogda, kataloğun her parçası model dosyasında bulunur; dersin soruları, kaynakları ve sözlüğü
 * eksiksizdir.
 */

const KOK = path.resolve(import.meta.dirname, '..');
const MODEL = path.join(KOK, 'public', MODEL_YOLU);

interface Dizin {
  katmanlar: Record<string, number>;
  parcalar: Record<string, { k: string; kv: [number, number]; ki: [number, number]; v: number; i: number }>;
}

const dizin = JSON.parse(readFileSync(path.join(MODEL, 'dizin.json'), 'utf8')) as Dizin;

function seciciGecerli(s: string): boolean {
  const i = s.indexOf(':');
  if (i > 0) {
    const [tur, deger] = [s.slice(0, i), s.slice(i + 1)];
    if (tur === 'bolge') return deger in BOLGE_ADLARI;
    if (tur === 'lob') return deger in LOB_ADLARI;
    if (tur === 'katman') return deger in KATMAN_ADLARI;
    if (tur === 'taraf') return deger === 'sol' || deger === 'sag';
    return false;
  }
  return YAPILAR.some((y) => y.id === s || y.id.replace(/-(sol|sag)$/, '') === s);
}

/** Parçaların üçgenleri (köşe koordinatları art arda: 9 sayı bir üçgen), model dosyasından çözülür. */
function yuzeyUcgenleri(parcalar: string[]): Float64Array {
  const sonuc: number[] = [];
  for (const id of parcalar) {
    const p = dizin.parcalar[id] as Dizin['parcalar'][string] & { min: number[]; olcek: number[] };
    const bin = new Uint8Array(readFileSync(path.join(MODEL, `${p.k}.bin`)));
    const q = new Uint16Array(p.v * 4);
    MeshoptDecoder.decodeVertexBuffer(new Uint8Array(q.buffer), p.v, 8, bin.subarray(p.kv[0], p.kv[0] + p.kv[1]));
    const u = new Uint32Array(p.i);
    MeshoptDecoder.decodeIndexBuffer(new Uint8Array(u.buffer), p.i, 4, bin.subarray(p.ki[0], p.ki[0] + p.ki[1]));
    for (const j of u) for (let d = 0; d < 3; d++) sonuc.push(p.min[d] + q[j * 4 + d] * p.olcek[d]);
  }
  return Float64Array.from(sonuc);
}

/** Noktanın üçgenlere en kısa uzaklığı (üçgen üzerindeki en yakın nokta: Ericson, Real-Time Collision Detection 5.1.5). */
function yuzeyeUzaklik(p: [number, number, number], t: Float64Array): number {
  const fark = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const ic = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const yuru = (a: number[], v: number[], k: number) => [a[0] + v[0] * k, a[1] + v[1] * k, a[2] + v[2] * k];
  let enAz = Infinity;
  for (let i = 0; i < t.length; i += 9) {
    const a = [t[i], t[i + 1], t[i + 2]];
    const b = [t[i + 3], t[i + 4], t[i + 5]];
    const c = [t[i + 6], t[i + 7], t[i + 8]];
    const ab = fark(b, a);
    const ac = fark(c, a);
    const ap = fark(p, a);
    const d1 = ic(ab, ap);
    const d2 = ic(ac, ap);
    const bp = fark(p, b);
    const d3 = ic(ab, bp);
    const d4 = ic(ac, bp);
    const cp = fark(p, c);
    const d5 = ic(ab, cp);
    const d6 = ic(ac, cp);
    const vc = d1 * d4 - d3 * d2;
    const vb = d5 * d2 - d1 * d6;
    const va = d3 * d6 - d5 * d4;
    let q: number[];
    if (d1 <= 0 && d2 <= 0) q = a;
    else if (d3 >= 0 && d4 <= d3) q = b;
    else if (d6 >= 0 && d5 <= d6) q = c;
    else if (vc <= 0 && d1 >= 0 && d3 <= 0) q = yuru(a, ab, d1 / (d1 - d3));
    else if (vb <= 0 && d2 >= 0 && d6 <= 0) q = yuru(a, ac, d2 / (d2 - d6));
    else if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) q = yuru(b, fark(c, b), (d4 - d3) / (d4 - d3 + (d5 - d6)));
    else {
      const den = 1 / (va + vb + vc);
      q = yuru(yuru(a, ab, vb * den), ac, vc * den);
    }
    const f = fark(p, q);
    enAz = Math.min(enAz, Math.sqrt(ic(f, f)));
  }
  return enAz;
}

function sahneler(): { ders: string; sahne: Sahne }[] {
  return hazirDersler().flatMap((d) =>
    d.bolumler.flatMap((b) => b.bloklar.flatMap((k) => (k.tur === 'sahne' ? [{ ders: `${d.dal}/${d.slug}`, sahne: k.sahne }] : []))),
  );
}

describe('yapı kataloğu ve model', () => {
  it('kimlikler benzersiz; her yapının adı, Latince adı ve açıklaması var', () => {
    const ids = YAPILAR.map((y) => y.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const y of YAPILAR) {
      expect(y.ad.length, y.id).toBeGreaterThan(2);
      expect(y.latince.length, y.id).toBeGreaterThan(2);
      expect(y.gorev.length, y.id).toBeGreaterThan(30);
      expect(y.gorev, y.id).toMatch(/[.!]$/);
      expect(y.parcalar.length, y.id).toBeGreaterThan(0);
    }
  });

  it('model sürümü klasörü ve paket dosyaları var; boyutları dizinle aynı', () => {
    expect(MODEL_YOLU).toBe(`/beyin/model/${MODEL_SURUMU}`);
    for (const [k, boy] of Object.entries(dizin.katmanlar)) {
      const dosya = path.join(MODEL, `${k}.bin`);
      expect(existsSync(dosya), dosya).toBe(true);
      expect(statSync(dosya).size).toBe(boy);
    }
    // Sitede yalnızca güncel sürüm durur.
    expect(readFileSync(path.join(KOK, 'src', 'content', 'beyin', 'model-surum.ts'), 'utf8')).toContain(MODEL_SURUMU);
  });

  it('katalogdaki her parça modelde, doğru pakette; modelde fazladan parça yok', () => {
    const kullanilan = new Set<string>();
    for (const y of YAPILAR) {
      for (const p of y.parcalar) {
        kullanilan.add(p);
        expect(dizin.parcalar[p], `${y.id}: ${p}`).toBeDefined();
        expect(dizin.parcalar[p].k, `${y.id}: ${p}`).toBe(y.katman);
      }
    }
    expect(Object.keys(dizin.parcalar).sort()).toEqual([...kullanilan].sort());
    for (const [id, p] of Object.entries(dizin.parcalar)) {
      expect(p.i % 3, id).toBe(0);
      expect(p.v, id).toBeGreaterThan(2);
      expect(p.kv[0] + p.kv[1], id).toBeLessThanOrEqual(dizin.katmanlar[p.k]);
      expect(p.ki[0] + p.ki[1], id).toBeLessThanOrEqual(dizin.katmanlar[p.k]);
    }
  });

  it('model sayfada hızlı açılacak kadar küçük', () => {
    const toplam = Object.values(dizin.katmanlar).reduce((t, x) => t + x, 0);
    expect(toplam).toBeLessThan(4 * 1024 * 1024);
  });

  it('etiket yerleşimi: yazılar ekranda kalır, birbirine ve noktalara binmez', () => {
    // Birbirine yakın yedi nokta (kalabalık bir kemik sahnesi gibi).
    const noktalar = [
      [400, 300],
      [430, 310],
      [415, 340],
      [380, 330],
      [450, 280],
      [360, 260],
      [470, 360],
    ].map(([x, y]) => ({ x, y, gen: 130, yuk: 24 }));
    const W = 860;
    const H = 520;
    const yerler = etiketDuzeni(noktalar, { x: 420, y: 300 }, W, H);
    expect(yerler).toHaveLength(noktalar.length);
    yerler.forEach((k, i) => {
      expect(k.sol).toBeGreaterThanOrEqual(6);
      expect(k.sol + noktalar[i].gen).toBeLessThanOrEqual(W - 6);
      expect(k.ust).toBeGreaterThanOrEqual(58);
      expect(k.ust + noktalar[i].yuk).toBeLessThanOrEqual(H - 6);
      for (const n of noktalar) {
        const altinda = n.x > k.sol && n.x < k.sol + noktalar[i].gen && n.y > k.ust && n.y < k.ust + noktalar[i].yuk;
        expect(altinda, `yazı ${i} bir noktanın üstünde`).toBe(false);
      }
      for (let j = 0; j < i; j++) {
        const b = yerler[j];
        const cakisir =
          k.sol < b.sol + noktalar[j].gen && b.sol < k.sol + noktalar[i].gen && k.ust < b.ust + noktalar[j].yuk && b.ust < k.ust + noktalar[i].yuk;
        expect(cakisir, `yazı ${i} ile ${j} çakışıyor`).toBe(false);
      }
    });
  });

  it('işaret noktaları: kimlikler benzersiz, kemikleri katalogda ve her nokta kendi kemiğinin yüzeyinde', async () => {
    const ids = NOKTALAR.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    await MeshoptDecoder.ready;
    const ucgenler = new Map<string, Float64Array>();
    for (const p of NOKTALAR) {
      expect(p.ad.length, p.id).toBeGreaterThan(2);
      expect(p.latince.length, p.id).toBeGreaterThan(2);
      const y = YAPILAR.find((x) => x.id === p.yapi);
      expect(y, `${p.id}: ${p.yapi}`).toBeDefined();
      expect(['kemik', 'yuz'], p.id).toContain(y!.katman);
      if (!ucgenler.has(p.yapi)) ucgenler.set(p.yapi, yuzeyUcgenleri(y!.parcalar));
      // Nokta yüzeyin üstündedir; delik noktası ise deliğin ağzının ortasında durur (en büyüğü foramen magnum).
      const uzaklik = yuzeyeUzaklik(p.konum, ucgenler.get(p.yapi)!);
      expect(uzaklik, p.id).toBeLessThanOrEqual(p.tur === 'delik' ? 18 : 0.6);
    }
  });
});

describe('dersler', () => {
  // 2026-10-08: 100 ders; 2026-10-09: üniteler eklenip 110'a çıktı, sonra bölüm yalnızca beyne odaklandı (kafatası dersleri ve kol-bacak sinirleri çıktı): 100
  // (site sahibinin istekleri).
  it('program 8 bölüm, 100 derstir; sıralar ardışık, adresler benzersiz', () => {
    expect(DALLAR).toHaveLength(8);
    expect(DALLAR.map((d) => d.sira)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(DALLAR.map((d) => d.id)).size).toBe(8);
    expect(toplamDers()).toBe(100);
    expect(DALLAR.reduce((t, d) => t + d.program.length, 0)).toBe(100);
    for (const d of DALLAR) {
      expect(d.renk, d.id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(d.aciklama.length, d.id).toBeGreaterThan(60);
      expect(new Set(d.program.map((p) => p.slug)).size, d.id).toBe(d.program.length);
      expect(d.program.map((p) => p.sira)).toEqual(Array.from({ length: d.program.length }, (_, i) => i + 1));
      for (const p of d.program) {
        expect(p.slug, p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(p.seviye in SEVIYE_ADLARI, p.slug).toBe(true);
        expect(p.ozet.length, p.slug).toBeGreaterThan(20);
      }
    }
  });

  it('eski "nasıl çalışır" adresleri yeni bölüme kalıcı yönlenir', async () => {
    const yonler = await nextConfig.redirects!();
    const eski = yonler.filter((y) => y.source.startsWith(`${BEYIN_YOLU}/nasil-calisir`));
    expect(eski.length).toBeGreaterThan(0);
    for (const y of eski) {
      expect(y.permanent).toBe(true);
      expect(y.destination).toBe(`${BEYIN_YOLU}/hucre-ve-molekul`);
    }
  });

  it('hazır dersler programdaki yerinde ve eksiksiz', () => {
    expect(hazirDersler().length).toBeGreaterThan(0);
    for (const d of hazirDersler()) {
      const yer = DALLAR.find((x) => x.id === d.dal)!.program.find((p) => p.slug === d.slug)!;
      expect(yer.sira, d.slug).toBe(d.sira);
      expect(yer.seviye, d.slug).toBe(d.seviye);
      expect(yer.baslik.length).toBeGreaterThan(5);
      expect(d.yayin, d.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.guncelleme >= d.yayin, d.slug).toBe(true);
      for (const u of d.ucep ?? []) {
        expect(u.no, d.slug).toBeGreaterThan(0);
        expect(u.duzey, d.slug).toMatch(/^(A|ÖnT|T|TT|İ|K)(-(A|ÖnT|T|TT|İ|K))*$/);
      }
      expect(d.aciklama.length, d.slug).toBeLessThanOrEqual(160);
      expect(d.hedefler.length).toBeGreaterThanOrEqual(3);
      expect(d.bolumler.length).toBeGreaterThanOrEqual(3);
      expect(new Set(d.bolumler.map((b) => b.id)).size).toBe(d.bolumler.length);
      expect(d.sozluk.length).toBeGreaterThanOrEqual(10);
      expect(new Set(d.sozluk.map((t) => t.terim)).size).toBe(d.sozluk.length);
      expect(d.kaynaklar.length).toBeGreaterThanOrEqual(3);
      for (const k of d.kaynaklar) expect(k.url, k.metin).toMatch(/^https:\/\//);
      // Her derste en az bir üç boyutlu sahne ve bir hareketli çizim.
      const turler = d.bolumler.flatMap((b) => b.bloklar.map((k) => k.tur));
      expect(turler).toContain('sahne');
      expect(turler).toContain('animasyon');
      expect(JSON.stringify(d)).not.toMatch(/\bTODO\b|\bXXX\b|\blorem\b/i);
    }
  });

  it('katmanlı ders: temel anlatım tek başına da tamdır; kutular, vakalar ve katmanlar geçerli', () => {
    for (const d of hazirDersler()) {
      for (const b of d.bolumler) {
        const bloklar = b.bloklar;
        // Her bölümde temel okuyucunun gördüğü en az bir metin bloğu bulunur.
        expect(
          bloklar.some((k) => k.tur === 'metin' && blokDuzeyi(k) === 'temel'),
          `${d.slug}#${b.id}`,
        ).toBe(true);
        for (const k of bloklar) {
          if (k.tur === 'kutu') {
            expect(k.cesit in KUTU_DUZEYI, `${d.slug}#${b.id}`).toBe(true);
            expect(k.md.length, `${d.slug}#${b.id}`).toBeGreaterThan(40);
          }
          if (k.tur === 'vaka') {
            expect(k.oyku.length, k.baslik).toBeGreaterThan(80);
            expect(k.soru, k.baslik).toMatch(/\?$/);
            expect(k.cozum.length, k.baslik).toBeGreaterThan(120);
          }
          if (k.tur === 'tablo') for (const r of k.satirlar) expect(r.length, k.baslik).toBe(k.sutunlar.length);
        }
      }
      // Temel düzeyde de en az bir sahne ve bir hareketli çizim kalır.
      const temel = d.bolumler.flatMap((b) => b.bloklar).filter((k) => blokDuzeyi(k) === 'temel');
      expect(temel.some((k) => k.tur === 'sahne'), d.slug).toBe(true);
      expect(temel.some((k) => k.tur === 'animasyon'), d.slug).toBe(true);
    }
  });

  it('sorular: doğru cevap seçeneklerde, açıklaması var, doğru şıklar tek bir yere yığılmamış', () => {
    for (const d of hazirDersler()) {
      expect(d.sorular.length, d.slug).toBeGreaterThanOrEqual(6);
      const yerler = new Map<number, number>();
      for (const s of d.sorular) {
        expect(s.secenekler.length).toBeGreaterThanOrEqual(3);
        expect(new Set(s.secenekler).size).toBe(s.secenekler.length);
        expect(s.dogru).toBeGreaterThanOrEqual(0);
        expect(s.dogru).toBeLessThan(s.secenekler.length);
        expect(s.aciklama.length).toBeGreaterThan(20);
        expect(s.seviye in SEVIYE_ADLARI, s.soru).toBe(true);
        yerler.set(s.dogru, (yerler.get(s.dogru) ?? 0) + 1);
      }
      expect(Math.max(...yerler.values()), d.slug).toBeLessThanOrEqual(Math.ceil(d.sorular.length / 2));
      // Her okuma düzeyinde sınanacak kadar soru olsun.
      expect(d.sorular.filter((s) => s.seviye === 'temel').length, d.slug).toBeGreaterThanOrEqual(5);
      for (const sev of ['temel', 'lisans', 'ileri'] as const) {
        const grup = d.sorular.filter((s) => s.seviye === sev);
        if (grup.length < 4) continue;
        const yer = new Map<number, number>();
        for (const s of grup) yer.set(s.dogru, (yer.get(s.dogru) ?? 0) + 1);
        // Her katmanın kendi içinde de doğru şıklar tek yere yığılmaz.
        expect(Math.max(...yer.values()), `${d.slug} ${sev}`).toBeLessThanOrEqual(Math.ceil(grup.length / 2));
      }
    }
  });

  it('sahnelerdeki seçiciler ve etiketler katalogdaki yapılara karşılık gelir', () => {
    for (const { ders, sahne } of sahneler()) {
      expect(sahne.katmanlar.length, ders).toBeGreaterThan(0);
      for (const s of [...(sahne.goster ?? []), ...(sahne.gizle ?? []), ...(sahne.vurgula ?? []), ...(sahne.saydam ?? [])]) {
        expect(seciciGecerli(s), `${ders}: ${s}`).toBe(true);
      }
      for (const e of sahne.etiketler ?? []) {
        expect(seciciGecerli(e.yapi), `${ders}: etiket ${e.yapi}`).toBe(true);
        const y = YAPILAR.find((x) => x.id === e.yapi || x.id.replace(/-(sol|sag)$/, '') === e.yapi)!;
        expect(sahne.katmanlar, `${ders}: ${e.yapi} paketi yüklenmiyor`).toContain(y.katman);
      }
      for (const b of sahne.boya ?? []) {
        expect(b.renk, ders).toMatch(/^#[0-9a-f]{6}$/i);
        for (const s of b.secici) expect(seciciGecerli(s), `${ders}: boya ${s}`).toBe(true);
      }
      for (const e of sahne.noktalar ?? []) {
        const p = noktaById(e.nokta);
        expect(p, `${ders}: nokta ${e.nokta}`).toBeDefined();
        expect(sahne.katmanlar, `${ders}: ${e.nokta} kemiğinin paketi yüklenmiyor`).toContain(YAPILAR.find((y) => y.id === p!.yapi)!.katman);
      }
      if (sahne.kesit) expect(Math.abs(sahne.kesit.konum)).toBeLessThanOrEqual(1);
      // Etiketli sahneler dönmez (dönerken etiketler gizlenir).
      if (sahne.etiketler?.length || sahne.noktalar?.length) expect(sahne.donme ?? false, ders).toBe(false);
    }
  });

  it('site haritasında hazır dersler var, hazırlananlar yok', () => {
    const adresler = sitemap().map((s) => new URL(s.url).pathname);
    expect(adresler).toContain(BEYIN_YOLU);
    expect(adresler).toContain(`${BEYIN_YOLU}/beyin-gezgini`);
    for (const d of DALLAR) {
      expect(adresler).toContain(`${BEYIN_YOLU}/${d.id}`);
      for (const p of d.program) expect(adresler.includes(`${BEYIN_YOLU}/${d.id}/${p.slug}`), p.slug).toBe(Boolean(p.ders));
    }
  });

  it('okuma düzeyleri: üç düzey, adresteki adları geri çözülür, Temel adreste yazmaz', () => {
    expect(DUZEY_SIRASI).toEqual(['temel', 'lisans', 'ileri']);
    for (const d of DUZEY_SIRASI) {
      expect(adrestenDuzey(DUZEY_ADRESI[d])).toBe(d);
      expect(DUZEY_KARTI[d].kim.length, d).toBeGreaterThan(5);
      expect(DUZEY_KARTI[d].icerik.length, d).toBeGreaterThan(20);
    }
    expect(adrestenDuzey('uzman')).toBe('ileri');
    expect(adrestenDuzey('ileri')).toBeNull();
    expect(adrestenDuzey(null)).toBeNull();
    // Kutuların türünü gösteren üst kenar renkleri düzey renkleriyle (mavi, mor, yeşil) karışmamalı.
    const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    for (const m of css.matchAll(/\.beyin-kutu-[a-z-]+ \{([^}]*)\}/g)) {
      expect(m[1], m[0]).not.toMatch(/var\(--(dim-con|dim-int|dim-emo|katman-[a-z]+)\)/);
    }
  });
});
