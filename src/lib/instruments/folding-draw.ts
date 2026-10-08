import { PAPER, centroid, flap, layerPieces, reflect, shapes, type Fold, type Pt } from './folding';

/**
 * Kâğıt katlama sorularının çizimi (ekranda ve denemelerde aynı hesap). Her katlama için bir resim: katlamadan sonraki
 * kâğıt dolu, kanadın katlanmadan önceki yeri kesik çizgili, katlanma yönü kavisli bir okla gösterilir. Son resimde
 * katlanmış kâğıt ve delikler. Bütün resimlerde kâğıt aynı ölçekte ve aynı yerde çizilir (12 × 12 birim).
 */
export interface FoldPanel {
  /** Katlamadan sonraki kâğıt. */
  paper: string;
  /** Katlanan kanatların kâğıdın üstündeki yerleri (ince çizgiyle; son katlamanınki hafif koyu). */
  layers: { points: string; last: boolean }[];
  /** Kanadın katlanmadan önceki yeri (kesik çizgi); son resimde yok. */
  ghost?: string;
  /** Katlanma yönünü gösteren ok: kavisli yol ve ucundaki üçgen. */
  arrow?: { path: string; head: string };
  /** Son resimde delikler. */
  holes?: Pt[];
}

/** Resimlerin görünüm kutusu: kâğıdın çevresinde 1,5 birim boşluk. */
export const FOLD_VIEWBOX = `-1.5 -1.5 ${PAPER + 3} ${PAPER + 3}`;

const pts = (poly: Pt[]) => poly.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');

/** Kanadın ortasından katlandığı yerin ortasına kavisli ok. */
function arrowFor(f: Fold, from: Pt): FoldPanel['arrow'] {
  const to = reflect(f, from);
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  // Kavis, katlama çizgisi yönünde (oka dik) bükülür.
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(2.2, len * 0.35);
  const cx = mx - (dy / len) * bend;
  const cy = my + (dx / len) * bend;
  // Okun ucu: eğrinin sonundaki yön (kontrol noktasından bitişe).
  const ex = to[0] - cx;
  const ey = to[1] - cy;
  const el = Math.hypot(ex, ey) || 1;
  const ux = ex / el;
  const uy = ey / el;
  const size = 0.9;
  const tip: Pt = to;
  const left: Pt = [tip[0] - ux * size - uy * size * 0.6, tip[1] - uy * size + ux * size * 0.6];
  const right: Pt = [tip[0] - ux * size + uy * size * 0.6, tip[1] - uy * size - ux * size * 0.6];
  return {
    path: `M ${from[0].toFixed(2)} ${from[1].toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${(tip[0] - ux * size * 0.5).toFixed(2)} ${(tip[1] - uy * size * 0.5).toFixed(2)}`,
    head: pts([tip, left, right]),
  };
}

export function foldPanels(folds: Fold[], punches: Pt[]): FoldPanel[] {
  const sh = shapes(folds);
  const layers = (upTo: number) => {
    const all = layerPieces(folds, upTo);
    // Son katlamanın kanadı (listenin sonundaki tek parça) hafif koyu çizilir.
    return all.map((p, i) => ({ points: pts(p), last: i === all.length - 1 }));
  };
  const panels: FoldPanel[] = folds.map((f, k) => {
    const fl = flap(folds, k);
    return { paper: pts(sh[k + 1]), layers: layers(k + 1), ghost: pts(fl), arrow: arrowFor(f, centroid(fl)) };
  });
  panels.push({ paper: pts(sh[folds.length]), layers: layers(folds.length).map((l) => ({ ...l, last: false })), holes: punches });
  return panels;
}
