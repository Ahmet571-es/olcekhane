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
import { HAS_PDFTOTEXT, pdfOverlaps } from './helpers/pdf-overlap';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * PDF'te yazılar üst üste binmez. react-pdf, bir `View`in ilk çocuğundaki bölünmez blok sayfaya sığmayınca bütün bölümü
 * kalan yere sıkıştırabiliyordu (kartlar üst üste, sayfa dışındakiler kayıp; 2026-11-01'de 11 raporda görüldü). Her
 * yayındaki testin bir raporu (öğrenci, veli, yetişkin) çizilir; `pdftotext -bbox` ile kelime kutularının çakışması
 * aranır (tests/helpers/pdf-overlap.ts). pdftotext yoksa (poppler-utils) test atlanır.
 */
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
        expect(pdfOverlaps(file).slice(0, 5), `${d.slug} ${a}`).toEqual([]);
      }
    }, 120_000);
  }
});
