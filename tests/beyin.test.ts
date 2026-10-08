import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';
import sitemap from '@/app/sitemap';
import { BEYIN_YOLU, DALLAR, hazirDersler, SEVIYE_ADLARI, toplamDers } from '@/content/beyin';
import { MODEL_SURUMU, MODEL_YOLU } from '@/content/beyin/model-surum';
import { ILERI_KUTULAR, type KutuCesidi, type Sahne } from '@/content/beyin/types';
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
});

describe('dersler', () => {
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
      expect(JSON.stringify(d)).not.toMatch(/TODO|XXX|lorem/i);
    }
  });

  it('katmanlı ders: temel anlatım tek başına da tamdır; ileri katman kutuları geçerli', () => {
    const CESITLER: KutuCesidi[] = ['aklinda-kalsin', 'biliyor-muydun', 'dikkat', ...ILERI_KUTULAR];
    for (const d of hazirDersler()) {
      for (const b of d.bolumler) {
        const bloklar = b.bloklar;
        // Her bölümde temel okuyucunun gördüğü en az bir metin bloğu bulunur.
        expect(bloklar.some((k) => k.tur === 'metin'), `${d.slug}#${b.id}`).toBe(true);
        for (const k of bloklar) {
          if (k.tur === 'kutu') {
            expect(CESITLER, `${d.slug}#${b.id}`).toContain(k.cesit);
            expect(k.md.length, `${d.slug}#${b.id}`).toBeGreaterThan(40);
          }
        }
      }
      // Temel düzeyde de en az bir sahne ve bir hareketli çizim kalır.
      const temel = d.bolumler.flatMap((b) => b.bloklar).filter((k) => !((k.tur === 'sahne' || k.tur === 'animasyon') && k.ileri));
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
      // "Yalnızca temel anlatım" seçen de sınanabilsin.
      expect(d.sorular.filter((s) => s.seviye === 'temel').length, d.slug).toBeGreaterThanOrEqual(5);
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
      if (sahne.kesit) expect(Math.abs(sahne.kesit.konum)).toBeLessThanOrEqual(1);
      // Etiketli sahneler dönmez (dönerken etiketler gizlenir).
      if (sahne.etiketler?.length) expect(sahne.donme ?? false, ders).toBe(false);
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
});
