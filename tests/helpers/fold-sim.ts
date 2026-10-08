import type { Fold, Pt } from '@/lib/instruments/folding';

/**
 * Kâğıt katlamanın bağımsız denetleyicisi (tests/kagit-katlama.test.ts). Soruların üretildiği yoldan (kâğıdı sondan başa
 * açmak) farklı olarak kâğıdı ileri doğru katlar: kâğıdın her noktasını (ince bir ızgara) katlamalar boyunca taşır;
 * katlanmış hâlde deliğe düşen noktalar açık kâğıttaki delikleri verir. Delikler, bu noktaların kümelerinin ortasıdır.
 * Geometri burada ayrıca yazılmıştır (lib/instruments/folding.ts kullanılmaz).
 */
export function holesBySimulation(folds: readonly Fold[], punches: readonly Pt[], radius: number, paper = 12, step = 0.05): Pt[] {
  const hits: Pt[] = [];
  for (let x = step / 2; x < paper; x += step) {
    for (let y = step / 2; y < paper; y += step) {
      let px = x;
      let py = y;
      for (const f of folds) {
        const dx = f.b[0] - f.a[0];
        const dy = f.b[1] - f.a[1];
        const cross = (qx: number, qy: number) => (qx - f.a[0]) * dy - (qy - f.a[1]) * dx;
        // Nokta kanadın yanındaysa çizgiye göre aynalanır (katlanır).
        if (cross(px, py) * cross(f.moving[0], f.moving[1]) > 0) {
          const t = ((px - f.a[0]) * dx + (py - f.a[1]) * dy) / (dx * dx + dy * dy);
          const fx = f.a[0] + t * dx;
          const fy = f.a[1] + t * dy;
          px = 2 * fx - px;
          py = 2 * fy - py;
        }
      }
      if (punches.some((p) => Math.hypot(px - p[0], py - p[1]) < radius)) hits.push([x, y]);
    }
  }
  // Birbirine yakın noktalar aynı deliktir.
  const clusters: { sx: number; sy: number; n: number; first: Pt }[] = [];
  for (const h of hits) {
    const c = clusters.find((k) => Math.hypot(k.first[0] - h[0], k.first[1] - h[1]) < 2.5 * radius);
    if (c) {
      c.sx += h[0];
      c.sy += h[1];
      c.n++;
    } else clusters.push({ sx: h[0], sy: h[1], n: 1, first: h });
  }
  return clusters.map((c): Pt => [c.sx / c.n, c.sy / c.n]);
}
