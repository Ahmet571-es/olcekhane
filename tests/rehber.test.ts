import { readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '@/content/instruments';
import { allGuides, GUIDE_CATEGORIES } from '@/content/rehber';

// Rehber yazıları sırayla eklenir (DURUM.md). Her yeni yazının kayıtlı olduğunu, arama sonuçlarında doğru
// görüneceğini ve kaynaklarının bulunduğunu denetler.

const YAZILAR = path.resolve(import.meta.dirname, '..', 'src', 'content', 'rehber', 'yazilar');
const guides = allGuides();
/** Dosya adı yazının adresinden farklı olan eski yazılar (adres değişirse yönlendirme gerekir; dokunulmaz). */
const FARKLI_DOSYA_ADI: Record<string, string> = { 'okuma-hizi-ve-anlama': 'okuma-hizi-ve-okudugunu-anlama' };

describe('rehber yazıları', () => {
  it('yazilar/ altındaki her dosya index.ts\'e kayıtlıdır ve dosya adı yazının adresidir', () => {
    const dosyalar = readdirSync(YAZILAR)
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.replace(/\.ts$/, ''))
      .map((ad) => FARKLI_DOSYA_ADI[ad] ?? ad)
      .sort();
    expect(guides.map((g) => g.slug).sort()).toEqual(dosyalar);
  });

  it('adresler tekildir', () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
  });

  it.each(guides.map((g) => [g.slug, g] as const))('%s: alanlar eksiksiz', (_, g) => {
    expect(g.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(g.title.trim().length).toBeGreaterThan(10);
    // Arama sonuçlarındaki açıklama: yeni yazılarda ~155 karakter hedeflenir; 180'i geçen kesinlikle kesilir.
    expect(g.description.length).toBeGreaterThanOrEqual(70);
    expect(g.description.length).toBeLessThanOrEqual(180);
    expect(Object.keys(GUIDE_CATEGORIES)).toContain(g.category);
    expect(g.keyPoints.length).toBeGreaterThanOrEqual(3);
    expect(g.keyPoints.length).toBeLessThanOrEqual(4);
    expect(g.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(g.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(g.updatedAt >= g.publishedAt).toBe(true);
  });

  it.each(guides.map((g) => [g.slug, g] as const))('%s: gövde ## başlıklarla bölünür, ilk düzey başlık yoktur', (_, g) => {
    expect(g.body).toMatch(/^## \S/m);
    expect(g.body).not.toMatch(/^# /m);
  });

  it.each(guides.map((g) => [g.slug, g] as const))('%s: kaynaklar APA künyeli, bağlantılar https', (_, g) => {
    expect(g.sources.length).toBeGreaterThanOrEqual(3);
    for (const s of g.sources) {
      // Yıl (2023), (2023a), tarihli künye (2023, 5 Mayıs) ya da tarihsiz (n.d.) / (t.y.).
      expect(s.text).toMatch(/\((\d{4}[a-z]?|n\.d\.|t\.y\.)(,[^)]*)?\)/);
      if (s.url) expect(s.url).toMatch(/^https:\/\/\S+$/);
    }
  });

  it.each(guides.map((g) => [g.slug, g] as const))('%s: ilgili testler sitede vardır', (_, g) => {
    const slugs = INSTRUMENTS.map((i) => i.slug);
    for (const t of g.relatedTests ?? []) expect(slugs).toContain(t);
  });
});
