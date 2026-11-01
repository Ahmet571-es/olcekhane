import { execFileSync, spawnSync } from 'node:child_process';

/**
 * PDF'te üst üste binen kelimeler (`pdftotext -bbox`: alanlarının en az %30'u çakışan kelime çiftleri). Kullananlar:
 * tests/pdf-ust-uste.test.ts, tests/gunluk-hayat.test.ts, tests/yol-haritasi-grafikleri.test.ts. pdftotext yoksa
 * (poppler-utils) `HAS_PDFTOTEXT` yanlıştır ve denetim atlanır.
 */
export const HAS_PDFTOTEXT = spawnSync('pdftotext', ['-v']).status === 0;

interface Word {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  t: string;
}

function pages(pdf: string): Word[][] {
  const out = execFileSync('pdftotext', ['-bbox', pdf, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const res: Word[][] = [];
  for (const line of out.split('\n')) {
    if (line.trim().startsWith('<page')) res.push([]);
    const m = /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*)<\/word>/.exec(line);
    if (m && res.length) res[res.length - 1].push({ x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4], t: m[5] });
  }
  return res;
}

/** Alanlarının en az %30'u çakışan kelime çiftleri ("s.3: Okulda / Evde"). */
export function pdfOverlaps(pdf: string): string[] {
  const found: string[] = [];
  pages(pdf).forEach((ws, pi) => {
    const sorted = [...ws].sort((a, b) => a.y0 - b.y0);
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      for (let j = i + 1; j < sorted.length; j++) {
        const b = sorted[j];
        if (b.y0 > a.y1) break;
        const ix = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const iy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        const area = Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0));
        if (ix > 1 && iy > 1 && ix * iy > 0.3 * area) found.push(`s.${pi + 1}: ${a.t} / ${b.t}`);
      }
    }
  });
  return found;
}
