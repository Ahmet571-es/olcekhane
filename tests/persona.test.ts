import { describe, expect, it } from 'vitest';
import { icosphere } from '@/components/persona/icosphere';
import { DEFAULT_TRAITS, TRAITS, randomTraits, shapeParams, traitValueText, type Traits } from '@/lib/persona-shape';

describe('Kişilik şekli ağı (icosphere)', () => {
  for (const n of [1, 4, 40, 64]) {
    it(`${n} bölmede nokta ve üçgen sayısı doğru, bütün noktalar birim kürede`, () => {
      const { positions, indices } = icosphere(n);
      const points = positions.length / 3;
      expect(points).toBe((20 * (n + 1) * (n + 2)) / 2);
      expect(indices.length).toBe(20 * n * n * 3);
      for (let i = 0; i < points; i++) {
        const len = Math.hypot(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        expect(Math.abs(len - 1)).toBeLessThan(1e-5);
      }
      let max = 0;
      for (const idx of indices) max = Math.max(max, idx);
      expect(max).toBe(points - 1);
    });
  }

  it('telefon ve masaüstü ağları 16 bitlik sıraya sığar (WebGL 1 uyumu)', () => {
    expect(icosphere(40).indices).toBeInstanceOf(Uint16Array);
    expect(icosphere(64).indices).toBeInstanceOf(Uint16Array);
  });

  it('üçgenler bozuk değil: her üçgenin üç köşesi farklı ve alanı sıfırdan büyük', () => {
    const { positions, indices } = icosphere(8);
    for (let t = 0; t < indices.length; t += 3) {
      const [a, b, c] = [indices[t], indices[t + 1], indices[t + 2]];
      expect(new Set([a, b, c]).size).toBe(3);
      const p = (k: number) => [positions[k * 3], positions[k * 3 + 1], positions[k * 3 + 2]];
      const [pa, pb, pc] = [p(a), p(b), p(c)];
      const u = pb.map((v, i) => v - pa[i]);
      const v = pc.map((w, i) => w - pa[i]);
      const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      expect(Math.hypot(...cross)).toBeGreaterThan(1e-6);
    }
  });
});

describe('Kaydırıcılardan şekle (persona-shape)', () => {
  const at = (i: number, v: number): Traits => {
    const t = [...DEFAULT_TRAITS] as [number, number, number, number, number];
    t[i] = v;
    return t;
  };

  it('dışadönüklük arttıkça şekil dışa uzanır', () => {
    expect(shapeParams(at(0, 1)).amplitude).toBeGreaterThan(shapeParams(at(0, 0)).amplitude);
  });
  it('uyumluluk arttıkça loblar büyür (sıklık azalır)', () => {
    expect(shapeParams(at(1, 1)).frequency).toBeLessThan(shapeParams(at(1, 0)).frequency);
  });
  it('sorumluluk arttıkça düzen artar', () => {
    expect(shapeParams(at(2, 1)).symmetry).toBeGreaterThan(shapeParams(at(2, 0)).symmetry);
  });
  it('duygusal denge arttıkça hareket yavaşlar ve titreşim azalır', () => {
    expect(shapeParams(at(3, 1)).speed).toBeLessThan(shapeParams(at(3, 0)).speed);
    expect(shapeParams(at(3, 1)).jitter).toBeLessThan(shapeParams(at(3, 0)).jitter);
  });
  it('merak arttıkça ayrıntı artar', () => {
    expect(shapeParams(at(4, 1)).detail).toBeGreaterThan(shapeParams(at(4, 0)).detail);
  });
  it('uç ve geçersiz değerlerde parametreler sınırlı kalır', () => {
    for (const t of [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [-5, 9, Number.NaN, Infinity, -Infinity],
    ] as unknown as Traits[]) {
      const p = shapeParams(t);
      for (const v of Object.values(p)) expect(Number.isFinite(v)).toBe(true);
      expect(p.amplitude).toBeGreaterThan(0);
      expect(p.amplitude).toBeLessThanOrEqual(0.3 + 1e-9);
      expect(p.speed).toBeGreaterThan(0);
      expect(p.frequency).toBeGreaterThan(0);
    }
  });
  it('rastgele şekil her boyutta 0,1 ile 0,95 arasında', () => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let k = 0; k < 200; k++) {
      for (const v of randomTraits(rand)) {
        expect(v).toBeGreaterThanOrEqual(0.1);
        expect(v).toBeLessThanOrEqual(0.95);
      }
    }
  });
  it('ekran okuyucu metni kutbu ve değeri söyler', () => {
    expect(traitValueText(TRAITS[0], 0.8)).toBe('Sosyal tarafa yakın (80/100)');
    expect(traitValueText(TRAITS[0], 0.2)).toBe('Sakin tarafa yakın (20/100)');
    expect(traitValueText(TRAITS[0], 0.5)).toBe('Ortada (50/100)');
  });
});
