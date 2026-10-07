'use client';

import { useCallback, useState } from 'react';
import { LikertRunner } from '@/components/runner/likert-runner';
import { QuizRunner, type QuizClientItem } from '@/components/runner/quiz-runner';
import { ReadingRunner } from '@/components/runner/reading-runner';
import { useLeaveWarning } from '@/components/runner/tasks/common';
import { TaskRunner } from '@/components/runner/tasks/task-runner';
import { PageGuide } from '@/components/site/page-guide';
import { AUDIENCE_LABELS } from '@/lib/config';
import type { ItemNoun } from '@/lib/instruments/nouns';
import type { CognitiveTask, LikertOption } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import { RoadmapView } from './roadmap-view';
import { SimpleReportView } from './simple-report-view';

type Intro = { title: string; paragraphs: string[] };

/** Testi çözmek için tarayıcıya gönderilenler (cevap anahtarı ve puanlama yok). */
export type TestPayload =
  | { engine: 'likert'; intro: Intro; prompt: string; options: LikertOption[]; items: { key: string; text: string }[]; itemNoun: ItemNoun; minAnswered: number }
  | { engine: 'quiz'; intro: Intro; contentGrade: number; items: QuizClientItem[] }
  | {
      engine: 'reading';
      intro: Intro;
      passage: { key: string; title: string; paragraphs: string[]; questions: { key: string; text: string; options: { key: string; text: string }[] }[] };
    }
  | { engine: 'tasks'; intro: Intro; tasks: CognitiveTask[] };

type Audience = 'student' | 'parent' | 'adult';
/** Okul çağındaki biri için öğrenci ve veli raporu, yetişkin için yalnızca kişisel rapor gelir. */
type Reports = Partial<Record<Audience, SimpleReport>>;
type Body = { grade: number; data: Record<string, unknown>; roadmapPreview?: true };

const AUDIENCES: Audience[] = ['student', 'parent', 'adult'];
/** İndirme düğmesi ve bilgilendirme cümlesi ("Saklamak için … PDF olarak indir"). */
const DOWNLOAD: Record<Audience, { button: string; object: string }> = {
  student: { button: 'Öğrenci raporunu PDF olarak indir', object: 'öğrenci raporunu' },
  parent: { button: 'Veli raporunu PDF olarak indir', object: 'veli raporunu' },
  adult: { button: 'Raporunu PDF olarak indir', object: 'raporunu' },
};

/** Raporun başındaki yol gösterici kutu: raporun nasıl okunacağı (öğrenciye ve yetişkine "sen", veliye "siz"). */
function readingGuide(audience: Audience, report: SimpleReport) {
  const parent = audience === 'parent';
  const steps: string[] = [];
  if (report.cautions.length > 0) {
    steps.push(
      parent
        ? 'Önce uyarıları okuyun: sonucu dikkatle yorumlamayı gerektiren bir durum var.'
        : 'Önce uyarıları oku: sonucu dikkatle yorumlamanı gerektiren bir durum var.',
    );
  }
  const when = steps.length > 0 ? 'Sonra' : 'Önce';
  if (report.chart) steps.push(parent ? `${when} grafiğe bakın: sonuçların genel resmini gösterir.` : `${when} grafiğe bak: sonuçlarının genel resmini gösterir.`);
  else steps.push(parent ? `${when} öne çıkan sayılara bakın.` : `${when} öne çıkan sayılara bak.`);
  steps.push(parent ? 'Ardından her başlığın altındaki açıklamayı okuyun.' : 'Ardından her başlığın altındaki açıklamayı oku.');
  steps.push(
    audience === 'student'
      ? 'Merak ettiklerini velinle ya da öğretmeninle konuş; veli raporunu birlikte okuyabilirsiniz.'
      : parent
        ? 'Raporu çocuğunuzla sakin bir zamanda konuşun; sonuçları bir etiket gibi kullanmayın.'
        : 'Sonuçları bir etiket değil, kendini tanımak için bir başlangıç olarak düşün.',
  );
  return (
    <PageGuide plain title={parent ? 'Raporu nasıl okumalısınız?' : 'Raporunu nasıl okumalısın?'} steps={steps}>
      <p>Bu rapor bir tanı değildir; {parent ? 'çocuğunuzun' : 'yalnızca'} bu testteki cevaplarına dayanır.</p>
    </PageGuide>
  );
}

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
export function TestSession({
  slug,
  grade,
  gradeLabel,
  payload,
  roadmapPreview = false,
}: {
  slug: string;
  grade: number;
  gradeLabel: string;
  payload: TestPayload;
  /** Uzman incelemesindeki gelişim yol haritasının önizlemesi (`?onizleme=yol-haritasi`). */
  roadmapPreview?: boolean;
}) {
  const [seed] = useState(uuid4);
  const [result, setResult] = useState<{ reports: Reports; body: Body } | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      const body: Body = roadmapPreview ? { grade, data, roadmapPreview: true } : { grade, data };
      const res = await post(`/api/rapor/${slug}`, body);
      if (!res.ok) throw await failure(res, 'Rapor hazırlanamadı. Lütfen tekrar deneyin.');
      const reports = (await res.json()) as Reports;
      setResult({ reports, body });
      window.scrollTo({ top: 0 });
    },
    [grade, slug, roadmapPreview],
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
          itemNoun={payload.itemNoun}
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
  const available = AUDIENCES.filter((a) => reports[a]);
  const [chosen, setAudience] = useState<Audience>(available[0] ?? 'student');
  const audience = reports[chosen] ? chosen : (available[0] ?? chosen);
  const report = reports[audience];
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Set<Audience>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  // Rapor saklanmadığı için PDF indirilmeden sayfadan ayrılmak raporu kaybettirir.
  useLeaveWarning(!!report && saved.size === 0);

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
      a.download = `olcekhane-${slug}-${AUDIENCE_LABELS[audience].file}-raporu.pdf`;
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

  if (!report) {
    return <p className="notice notice-danger mx-auto w-full max-w-3xl">Rapor gösterilemedi. Lütfen sayfayı yenileyip testi yeniden çözmeyi dene.</p>;
  }
  const other = available.find((a) => a !== audience);
  const downloadBox = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary btn-lg" onClick={download} disabled={busy}>
          {busy ? 'PDF hazırlanıyor…' : DOWNLOAD[audience].button}
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
          <p>
            Sayfayı kapatınca rapor kaybolur. Saklamak için {DOWNLOAD[audience].object} PDF olarak indir
            {other ? `; istersen ${DOWNLOAD[other].object} da indirebilirsin.` : '.'}
          </p>
        </div>
        {downloadBox}
      </div>

      {/* Tek rapor (yetişkin) varsa sekme gerekmez; raporun başlığı türünü ve tarihini zaten gösterir. */}
      {available.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-rule-strong bg-surface p-1" role="tablist" aria-label="Rapor türü">
            {available.map((a) => (
              <button
                key={a}
                type="button"
                role="tab"
                aria-selected={audience === a}
                onClick={() => setAudience(a)}
                className={`rounded-md px-4 py-2 text-[0.95rem] font-bold ${audience === a ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-surface-2'}`}
              >
                {AUDIENCE_LABELS[a].name}
              </button>
            ))}
          </div>
          <p className="t-meta">{gradeLabel}</p>
        </div>
      )}

      {readingGuide(audience, report)}

      <SimpleReportView report={report} />

      {report.roadmap && <RoadmapView roadmap={report.roadmap} you={audience !== 'parent'} />}

      <section aria-labelledby="indir" className="panel flex flex-col gap-4 p-6">
        <h2 id="indir" className="t-h3">
          Raporu sakla
        </h2>
        {downloadBox}
      </section>

      {/* Kapsamlı rapor öğrenci ve veli için hazırlanıyor; yetişkinlere yönelik bir sürümü henüz planlanmadı. */}
      {!reports.adult && !report.roadmap && (
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
      )}

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
