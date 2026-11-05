import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NAV } from '@/components/site/header';
import { hasOwnEmblem, TestEmblem } from '@/components/site/test-emblem';
import { COGNITIVE_GROUPS, GALLERY_SECTIONS, gallerySections, OTHER_COGNITIVE } from '@/components/site/test-gallery';
import { publicInstruments } from '@/content/instruments';
import { DOMAIN_ORDER } from '@/lib/domain-style';
import nextConfig from '../next.config';
import sitemap from '../src/app/sitemap';

/**
 * Ana sayfadaki test galerisi (site sahibinin 2026-11-05 isteği: yayındaki bütün testler ana sayfada, bölüm bölüm kart
 * olarak) ve Beyin Akademisi'nin kaldırılması (aynı gün: site yalnızca test platformu).
 */
describe('Ana sayfa test galerisi', () => {
  const live = publicInstruments();
  const sections = gallerySections();
  const items = sections.flatMap((s) => s.groups.flatMap((g) => g.items));

  it('yayındaki her test galeride tam bir kez görünür', () => {
    expect(items.map((i) => i.info.slug).sort()).toEqual(live.map((t) => t.slug).sort());
    for (const s of sections) expect(s.count).toBe(s.groups.reduce((n, g) => n + g.items.length, 0));
  });

  it('bölümler sitedeki alan sırasıyla gelir ve her alanın tanıtımı vardır', () => {
    const order = sections.map((s) => DOMAIN_ORDER.indexOf(s.domain as (typeof DOMAIN_ORDER)[number]));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    for (const d of DOMAIN_ORDER) {
      expect(GALLERY_SECTIONS[d], d).toBeDefined();
      expect(GALLERY_SECTIONS[d].lede.length).toBeGreaterThan(20);
    }
    expect(new Set(Object.values(GALLERY_SECTIONS).map((s) => s.anchor)).size).toBe(Object.keys(GALLERY_SECTIONS).length);
  });

  it('her zihinsel görev bir alt gruptadır; listede yayında olmayan ya da başka alandan test yoktur', () => {
    const cognitive = live.filter((t) => t.domain === 'cognitive').map((t) => t.slug);
    const listed = COGNITIVE_GROUPS.flatMap((g) => g.slugs);
    expect(new Set(listed).size, 'bir test iki grupta').toBe(listed.length);
    expect([...listed].sort()).toEqual([...cognitive].sort());
    const groups = sections.find((s) => s.domain === 'cognitive')!.groups;
    expect(groups.some((g) => g.name === OTHER_COGNITIVE)).toBe(false);
  });

  it('her testin kendine özgü, çizilebilen ve ötekilerden farklı bir amblemi vardır', () => {
    const seen = new Map<string, string>();
    for (const it of items) {
      expect(hasOwnEmblem(it.info.slug, it.info.domain, it.dims), `${it.info.slug}: test-emblem.tsx'teki BY_SLUG'a çizim ekleyin`).toBe(true);
      const svg = renderToStaticMarkup(createElement(TestEmblem, { slug: it.info.slug, domain: it.info.domain, name: it.info.name, dims: it.dims }));
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).toContain('aria-hidden="true"');
      expect(svg).not.toMatch(/NaN|undefined|Infinity/);
      expect(seen.get(svg), `${it.info.slug} ile ${seen.get(svg)} aynı çizildi`).toBeUndefined();
      seen.set(svg, it.info.slug);
      // Her açılışta aynı çizim (sunucu ve tarayıcı aynı sonucu verir).
      expect(renderToStaticMarkup(createElement(TestEmblem, { slug: it.info.slug, domain: it.info.domain, name: it.info.name, dims: it.dims }))).toBe(svg);
    }
  });

  it('amblem yalnızca alanın tonlarını kullanır (renk-kelime görevi dışında)', () => {
    for (const it of items) {
      const svg = renderToStaticMarkup(createElement(TestEmblem, { slug: it.info.slug, domain: it.info.domain, name: it.info.name, dims: it.dims }));
      const colors = new Set([...svg.matchAll(/(?:fill|stroke):(var\(--[a-z0-9-]+\)|#[0-9a-f]{3,8}|rgb[^;"]*)/gi)].map((m) => m[1]));
      for (const c of colors) {
        if (it.info.slug === 'renk-kelime-gorevi' && c.startsWith('var(--dim-')) continue;
        expect(['var(--e0)', 'var(--e1)', 'var(--e2)', 'var(--e3)', 'var(--e4)', 'var(--surface)'], `${it.info.slug}: ${c}`).toContain(c);
      }
    }
  });
});

describe('Beyin Akademisi kaldırıldı', () => {
  const SRC = path.join(import.meta.dirname, '..', 'src');
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = path.join(dir, n);
      return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(n) ? [p] : [];
    });

  it('sayfaları, bileşenleri, içeriği ve modeli yok', () => {
    for (const p of ['src/app/(site)/beyin-akademisi', 'src/components/beyin', 'src/content/beyin', 'public/beyin']) {
      expect(existsSync(path.join(import.meta.dirname, '..', p)), p).toBe(false);
    }
  });

  it('sitede hiçbir yer ona bağlantı vermez; menüde ve site haritasında yok', () => {
    for (const f of files(SRC)) expect(readFileSync(f, 'utf8'), path.relative(SRC, f)).not.toMatch(/beyin-akademisi|Beyin Akademisi|content\/beyin|components\/beyin/);
    expect(NAV.some((n) => n.href.includes('beyin'))).toBe(false);
    expect(sitemap().some((e) => e.url.includes('beyin'))).toBe(false);
  });

  it('eski adresler bütün testlerin sayfasına kalıcı olarak yönlenir', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    expect(redirects.find((x) => x.source === '/beyin-akademisi')).toMatchObject({ destination: '/testler', permanent: true });
    expect(redirects.find((x) => x.source === '/beyin-akademisi/:rest*')).toMatchObject({ destination: '/testler', permanent: true });
    expect(redirects.some((x) => x.destination.startsWith('/beyin-akademisi'))).toBe(false);
  });
});
