import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '@/content/instruments';

// Yayın iş akışının dış sınaması sitedeki testlerle uyumlu kalmalı: yeni bir test incelemeye alınınca ya da hoca
// onaylayınca .github/workflows/yayin.yml da güncellenir (CLAUDE.md, "Yeni test").

const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');

describe('yayın iş akışının dış sınaması', () => {
  it('uzman incelemesindeki testlerin hepsi, yalnızca onlar, önizleme olarak sınanır (ONIZLEME)', () => {
    const m = yml.match(/^\s*ONIZLEME="([^"]*)"/m);
    expect(m).not.toBeNull();
    const liste = m![1].split(/\s+/).filter(Boolean).sort();
    const inceleme = INSTRUMENTS.filter((i) => i.status === 'review')
      .map((i) => i.slug)
      .sort();
    expect(liste).toEqual(inceleme);
  });

  it('sesli okuma: mikrofon izni, kayıt işleyicisi ve örnek rapor dışarıdan sınanır', () => {
    expect(yml).toContain('/okuma/kayit-isleyici.js');
    expect(yml).toContain('microphone=(self)');
    expect(yml).toContain('/api/rapor/sesli-okuma-degerlendirmesi');
  });

  it('site haritasındaki her sayfa dışarıdan açılır (yeni rehber yazıları dahil)', () => {
    expect(yml).toMatch(/sitemap\.xml" \| grep -o '<loc>/);
  });

  it('dış sınama adımında en çok 10 bilgi notu vardır (sondaki "Site dışarıdan sınandı" görünsün diye)', () => {
    const bas = yml.indexOf('- name: Site dışarıdan açılıyor mu');
    expect(bas).toBeGreaterThan(-1);
    const son = yml.indexOf('\n      - name:', bas + 1);
    const adim = yml.slice(bas, son === -1 ? undefined : son);
    expect((adim.match(/::notice /g) ?? []).length).toBeLessThanOrEqual(10);
  });
});
