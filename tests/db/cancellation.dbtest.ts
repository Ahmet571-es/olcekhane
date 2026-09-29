import { and, eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { harfIsaretleme } from '@/content/instruments/harf-isaretleme';
import { db } from '@/db';
import { scores, taskTrials } from '@/db/schema';
import { AssessmentError, completeTaskAttempt, getReport, saveTaskBlock, startOrResumeAttempt } from '@/lib/assessment/service';
import { recordConsent } from '@/lib/consent';
import { cancellationSheet } from '@/lib/instruments/cancellation';
import type { CancellationTask } from '@/lib/instruments/types';

// Veritabanı gerektirir: npm run test:db. Harf işaretleme görevinin sunucu yolu: sayfa uygulama
// kimliğinden sunucuda yeniden üretilir, bölümler puanlanır, dört ölçek puanı ve rapor yazılır.
const task = harfIsaretleme.tasks[0] as CancellationTask;

describe('harf işaretleme: kayıt, puanlama ve rapor', () => {
  let studentId = '';
  let attemptId = '';
  beforeAll(async () => {
    const [st] = await db.execute<{ id: string }>(sql`insert into students (first_name, grade) values ('Dikkat Testi', 5) returning id`);
    studentId = st.id;
    await recordConsent({ kind: 'explicit_consent', docKind: 'consent_assessment', granted: true, studentId, actorEmail: 'veli@ornek.test' });
    attemptId = await startOrResumeAttempt({ studentId, grade: 5, slug: harfIsaretleme.slug, startedByUserId: null });
  });
  afterAll(async () => {
    if (studentId) await db.execute(sql`delete from students where id = ${studentId}`);
  });

  it('sunucu sayfayı kendisi üretir: işaretler sayfadaki harflere göre puanlanır', async () => {
    const sheet = cancellationSheet(task, attemptId);
    // Her bölümde ilk 200 harfteki hedeflerin hepsi ve 3 çeldirici işaretlenir; son bölümler daha kısa.
    const sections = sheet.map((letters, index) => {
      const upTo = index < 2 ? 200 : 120;
      const targets = letters.slice(0, upTo).flatMap((l, i) => (task.targets.includes(l) ? [i] : []));
      const wrong = letters.slice(0, upTo).flatMap((l, i) => (task.targets.includes(l) ? [] : [i])).slice(0, 3);
      const marks = [...targets, ...wrong].sort((a, b) => a - b);
      return { index, response: { marks, times: marks.map((_, k) => 400 + k * 500), unmarks: 1 }, rtMs: task.sectionMs };
    });
    await saveTaskBlock(attemptId, task.key, sections);

    const trials = await db.select().from(taskTrials).where(and(eq(taskTrials.attemptId, attemptId), eq(taskTrials.block, task.key)));
    expect(trials).toHaveLength(4);
    const first = trials.find((t) => t.trialIndex === 0)!;
    expect((first.stimulus as { letters: string }).letters).toBe(sheet[0].join(''));
    expect(first.rtMs).toBe(task.sectionMs);

    await completeTaskAttempt(attemptId);
    const rows = await db.select().from(scores).where(eq(scores.attemptId, attemptId));
    const by = Object.fromEntries(rows.map((r) => [r.scaleKey, r]));
    expect(Object.keys(by).sort()).toEqual(['isabet', 'net', 'surdurme', 'tempo']);
    const expectedHits = sheet.reduce((a, letters, i) => a + letters.slice(0, i < 2 ? 200 : 120).filter((l) => task.targets.includes(l)).length, 0);
    expect(by.isabet.nAnswered).toBe(expectedHits);
    expect(by.isabet.raw).toBe(100);
    expect(by.net.raw).toBe(expectedHits - 12);
    expect(by.tempo.nAnswered).toBeLessThanOrEqual(2 * 200 + 2 * 120);
    expect(by.surdurme.raw!).toBeLessThan(-15);

    const report = await getReport(attemptId, 'parent');
    expect(report?.cognitive?.blocks.map((b) => b.key)).toEqual(['tempo', 'isabet', 'net', 'surdurme']);
    expect(report?.cognitive?.blocks[3].headline).toBe('Son bölümlerde düştü');
  });

  it('eksik ya da bozuk bölüm verisi reddedilir', async () => {
    const [st] = await db.execute<{ id: string }>(sql`insert into students (first_name, grade) values ('Dikkat Testi 2', 6) returning id`);
    try {
      await recordConsent({ kind: 'explicit_consent', docKind: 'consent_assessment', granted: true, studentId: st.id, actorEmail: 'veli@ornek.test' });
      const id = await startOrResumeAttempt({ studentId: st.id, grade: 6, slug: harfIsaretleme.slug, startedByUserId: null });
      const one = { index: 0, response: { marks: [0], times: [100], unmarks: 0 }, rtMs: task.sectionMs };
      await expect(saveTaskBlock(id, task.key, [one])).rejects.toBeInstanceOf(AssessmentError);
      const dup = [0, 1, 2, 3].map((index) => ({ index, response: { marks: [5, 5], times: [1, 2], unmarks: 0 }, rtMs: task.sectionMs }));
      await expect(saveTaskBlock(id, task.key, dup)).rejects.toBeInstanceOf(AssessmentError);
      // Görev tamamlanmadan sonuç hesaplanamaz.
      await expect(completeTaskAttempt(id)).rejects.toBeInstanceOf(AssessmentError);
    } finally {
      await db.execute(sql`delete from students where id = ${st.id}`);
    }
  });
});
