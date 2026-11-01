import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { QuizInstrument } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import { likertBody, quizBody, readingBody } from './helpers/bodies';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * PDF'te yazılar üst üste binmez. react-pdf, bir `View`in ilk çocuğundaki bölünmez blok sayfaya sığmayınca bütün bölümü
 * kalan yere sıkıştırabiliyordu (kartlar üst üste, sayfa dışındakiler kayıp; 2026-11-01'de 11 raporda görüldü). Her
 * yayındaki testin bir raporu (öğrenci, veli, yetişkin) çizilir; `pdftotext -bbox` ile kelime kutularının çakışması
 * aranır. pdftotext yoksa (poppler-utils) test atlanır.
 */
const HAS_PDFTOTEXT = spawnSync('pdftotext', ['-v']).status === 0;

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

/** Alanlarının en az %30'u çakışan kelime çiftleri (sayfa, örnek). */
function overlaps(pdf: string): string[] {
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

describe.skipIf(!HAS_PDFTOTEXT)('PDF: yazılar üst üste binmez', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pdf-ust-uste-'));
  for (const d of publicInstruments()) {
    if (d.engine === 'oral') continue; // sesli okumanın cevap gövdesi kayıt ölçümleri ister; burada denenmez
    it(d.slug, async () => {
      let body: AnswersBody;
      if (d.engine === 'likert') body = likertBody(d.slug, d.minGrade, (i) => (i * 3 + 1) % 5);
      else if (d.engine === 'tasks') {
        const first = Object.values(TASK_VARIANTS[d.slug] as Record<string, () => AnswersBody>)[0]();
        body = { ...first, grade: Math.max(first.grade, d.minGrade) };
      } else if (d.engine === 'reading') body = readingBody(6);
      else body = quizBody((d as QuizInstrument).forms[1].grade, 3);
      const r = evaluate(d.slug, body);
      const reps: [string, SimpleReport][] = [
        ['student', r.student],
        ['parent', r.parent],
      ];
      if (d.adults) reps.push(['adult', evaluateAdult(d.slug, { ...body, grade: ADULT_GRADE }).adult]);
      for (const [a, rep] of reps) {
        const file = join(dir, `${d.slug}-${a}.pdf`);
        writeFileSync(file, await renderSimpleReportPdf(rep, 'olcekhane.com'));
        expect(overlaps(file).slice(0, 5), `${d.slug} ${a}`).toEqual([]);
      }
    }, 120_000);
  }
});
