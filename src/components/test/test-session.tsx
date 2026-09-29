'use client';

import { useCallback, useState } from 'react';
import { LikertRunner } from '@/components/runner/likert-runner';
import { QuizRunner, type QuizClientItem } from '@/components/runner/quiz-runner';
import { ReadingRunner } from '@/components/runner/reading-runner';
import { useLeaveWarning } from '@/components/runner/tasks/common';
import { TaskRunner } from '@/components/runner/tasks/task-runner';
import type { CognitiveTask, LikertOption } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import { SimpleReportView } from './simple-report-view';

type Intro = { title: string; paragraphs: string[] };

/** Testi çözmek için tarayıcıya gönderilenler (cevap anahtarı ve puanlama yok). */
export type TestPayload =
  | { engine: 'likert'; intro: Intro; prompt: string; options: LikertOption[]; items: { key: string; text: string }[]; minAnswered: number }
  | { engine: 'quiz'; intro: Intro; contentGrade: number; items: QuizClientItem[] }
  | {
      engine: 'reading';
      intro: Intro;
      passage: { key: string; title: string; paragraphs: string[]; questions: { key: string; text: string; options: { key: string; text: string }[] }[] };
    }
  | { engine: 'tasks'; intro: Intro; tasks: CognitiveTask[] };

type Reports = { student: SimpleReport; parent: SimpleReport };
type Body = { grade: number; data: Record<string, unknown> };
type Audience = 'student' | 'parent';

/** Rastgele UUID (v4). Harf işaretleme sayfalarının tohumu; kimseye bağlı değildir. */
function uuid4(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

async function post(url: string, body: unknown): Promise<Response> {
  try {
    return await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new Error('Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene; cevapların bu sayfada duruyor.');
  }
}

async function failure(res: Response, fallback: string): Promise<Error> {
  const j = (await res.json().catch(() => ({}))) as { error?: string };
  return new Error(j.error ?? fallback);
}

/**
 * Test oturumu: hesap açmadan çözülür. Cevaplar yalnızca bu sayfada tutulur ve test bitince bir kez
 * gönderilir; sunucu puanlayıp raporu döndürür, hiçbir şeyi kaydetmez. PDF istenince aynı cevaplar
 * yeniden gönderilir ve PDF bellekte üretilip indirilir.
 */
export function TestSession({ slug, grade, gradeLabel, payload }: { slug: string; grade: number; gradeLabel: string; payload: TestPayload }) {
  const [seed] = useState(uuid4);
  const [result, setResult] = useState<{ reports: Reports; body: Body } | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      const body: Body = { grade, data };
      const res = await post(`/api/rapor/${slug}`, body);
      if (!res.ok) throw await failure(res, 'Rapor hazırlanamadı. Lütfen tekrar deneyin.');
      const reports = (await res.json()) as Reports;
      setResult({ reports, body });
      window.scrollTo({ top: 0 });
    },
    [grade, slug],
  );

  if (result) return <ResultView slug={slug} gradeLabel={gradeLabel} reports={result.reports} body={result.body} />;

  switch (payload.engine) {
    case 'likert':
      return (
        <LikertRunner
          intro={payload.intro}
          prompt={payload.prompt}
          options={payload.options}
          items={payload.items}
          minAnswered={payload.minAnswered}
          onFinish={(answers) => submit({ engine: 'likert', answers })}
        />
      );
    case 'quiz':
      return (
        <QuizRunner
          intro={payload.intro}
          contentGrade={payload.contentGrade}
          items={payload.items}
          onFinish={(answers) => submit({ engine: 'quiz', answers })}
        />
      );
    case 'reading':
      return <ReadingRunner intro={payload.intro} passage={payload.passage} onFinish={(r) => submit({ engine: 'reading', ...r })} />;
    case 'tasks':
      return <TaskRunner intro={payload.intro} tasks={payload.tasks} seed={seed} onFinish={(blocks) => submit({ engine: 'tasks', seed, blocks })} />;
  }
}

function ResultView({ slug, gradeLabel, reports, body }: { slug: string; gradeLabel: string; reports: Reports; body: Body }) {
  const [audience, setAudience] = useState<Audience>('student');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Set<Audience>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  // Rapor saklanmadığı için PDF indirilmeden sayfadan ayrılmak raporu kaybettirir.
  useLeaveWarning(saved.size === 0);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const res = await post(`/api/rapor/${slug}/pdf`, { ...body, audience });
      if (!res.ok) throw await failure(res, 'PDF hazırlanamadı. Lütfen tekrar deneyin.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `olcekhane-${slug}-${audience === 'student' ? 'ogrenci' : 'veli'}-raporu.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setSaved((s) => new Set(s).add(audience));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF hazırlanamadı. Lütfen tekrar deneyin.');
    } finally {
      setBusy(false);
    }
  }

  const report = reports[audience];
  const label = audience === 'student' ? 'öğrenci raporunu' : 'veli raporunu';
  const downloadBox = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary btn-lg" onClick={download} disabled={busy}>
          {busy ? 'PDF hazırlanıyor…' : `${audience === 'student' ? 'Öğrenci' : 'Veli'} raporunu PDF olarak indir`}
        </button>
        {saved.has(audience) && <span className="chip chip-ok">İndirildi</span>}
      </div>
      {error && <p className="notice notice-danger">{error}</p>}
      <p className="t-small text-ink-3">İndirme başlamazsa sayfayı Safari ya da Chrome gibi bir tarayıcıda açıp tekrar dene.</p>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="notice notice-ok flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Raporun hazır. Bu rapor hiçbir yerde saklanmıyor.</p>
          <p>Sayfayı kapatınca rapor kaybolur. Saklamak için {label} PDF olarak indir; istersen veli raporunu da indirebilirsin.</p>
        </div>
        {downloadBox}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-rule-strong bg-surface p-1" role="tablist" aria-label="Rapor türü">
          {(['student', 'parent'] as const).map((a) => (
            <button
              key={a}
              type="button"
              role="tab"
              aria-selected={audience === a}
              onClick={() => setAudience(a)}
              className={`rounded-md px-4 py-2 text-[0.95rem] font-bold ${audience === a ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-surface-2'}`}
            >
              {a === 'student' ? 'Öğrenci raporu' : 'Veli raporu'}
            </button>
          ))}
        </div>
        <p className="t-meta">{gradeLabel}</p>
      </div>

      <SimpleReportView report={report} />

      <section aria-labelledby="indir" className="panel flex flex-col gap-4 p-6">
        <h2 id="indir" className="t-h3">
          Raporu sakla
        </h2>
        {downloadBox}
      </section>

      <section aria-labelledby="kapsamli" className="flex flex-col gap-2 rounded-xl border border-dashed border-rule-strong p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="kapsamli" className="t-h3">
            Kapsamlı rapor
          </h2>
          <span className="chip chip-brass">Çok yakında</span>
        </div>
        <p className="text-ink-2">
          Ayrıntılı açıklamalar, günlük hayat için öneriler, veliye özel rehber ve görsellerle zenginleştirilmiş PDF. Hazır olduğunda testi
          çözdükten sonra bu ekrandan alınabilecek.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        {/* Tam sayfa geçişi: PDF indirilmediyse tarayıcı "sayfadan ayrılıyorsunuz" uyarısını göstersin. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/testler" className="btn btn-secondary btn-lg">
          Başka bir test çöz
        </a>
      </div>
    </div>
  );
}
