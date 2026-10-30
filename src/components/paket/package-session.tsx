'use client';

import { useCallback, useMemo, useState } from 'react';
import { LikertRunner } from '@/components/runner/likert-runner';
import { useLeaveWarning } from '@/components/runner/tasks/common';
import { TaskRunner } from '@/components/runner/tasks/task-runner';
import { SharePanel } from '@/components/share/share-panel';
import { PageGuide } from '@/components/site/page-guide';
import { RoadmapView } from '@/components/test/roadmap-view';
import { SimpleReportView } from '@/components/test/simple-report-view';
import { uuid4, type TestPayload } from '@/components/test/test-session';
import { AUDIENCE_LABELS } from '@/lib/config';
import { packageSummary, summaryIntro, type PackageEntry } from '@/lib/reports/package';
import type { SimpleReport } from '@/lib/reports/simple';
import { packageShareCard } from '@/lib/share/card';

/**
 * Kendini Tanı Paketi'nin oturumu. Testler art arda bu sayfada çözülür; her test bitince cevapları bir kez gönderilir,
 * sunucu puanlayıp raporu döndürür (tek testteki gibi). Cevaplar ve raporlar yalnızca bu sayfada durur: hiçbir yere
 * kaydedilmez, sayfa kapanınca silinir. Sonunda başta bir özet, ardından her testin kendi raporu ve tek PDF.
 */

export interface PackageClientTest {
  slug: string;
  name: string;
  skill: string;
  areaName: string;
  minutes: number;
  why: string;
  pilot: boolean;
  payload: TestPayload;
}

type Audience = 'student' | 'parent' | 'adult';
type Reports = Partial<Record<Audience, SimpleReport>>;
type Solved = { slug: string; data: Record<string, unknown>; reports: Reports };
type Phase = 'plan' | 'run' | 'pause' | 'result';

const PACKAGE_LEAVE_TEXT = 'Paketten ayrılırsan bütün cevapların ve raporların silinir; hiçbir yere kaydedilmez. Yine de ayrılmak istiyor musun?';

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

const minutesOf = (tests: PackageClientTest[]) => tests.reduce((s, t) => s + t.minutes, 0);

export function PackageSession({
  grade,
  gradeLabel,
  adult,
  tests,
  siteUrl,
  packagePath,
}: {
  grade: number;
  gradeLabel: string;
  /** Paketi yetişkin kendisi için çözüyor: tek, kişisel rapor. */
  adult: boolean;
  tests: PackageClientTest[];
  siteUrl: string;
  packagePath: string;
}) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [chosen, setChosen] = useState<Set<string>>(() => new Set(tests.map((t) => t.slug)));
  const [order, setOrder] = useState<PackageClientTest[]>([]);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState<Solved[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [seeds] = useState<Record<string, string>>(() => Object.fromEntries(tests.map((t) => [t.slug, uuid4()])));

  // Bir test bittikten sonra ayrılmak paketteki bütün sonuçları sildirir; testin içindeki uyarıdan önce gelir.
  useLeaveWarning(solved.length > 0 && phase !== 'result', PACKAGE_LEAVE_TEXT, 1);

  const go = useCallback((p: Phase) => {
    setPhase(p);
    window.scrollTo({ top: 0 });
  }, []);

  const current = order[index];

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      const res = await post(`/api/rapor/${current.slug}`, { grade, data });
      if (!res.ok) throw await failure(res, 'Rapor hazırlanamadı. Lütfen tekrar deneyin.');
      const reports = (await res.json()) as Reports;
      setSolved((s) => [...s, { slug: current.slug, data, reports }]);
      if (index + 1 < order.length) go('pause');
      else go('result');
    },
    [current, grade, index, order.length, go],
  );

  function start() {
    setOrder(tests.filter((t) => chosen.has(t.slug)));
    setSkipped(tests.filter((t) => !chosen.has(t.slug)).map((t) => t.slug));
    setIndex(0);
    go('run');
  }

  function next() {
    setIndex((i) => i + 1);
    go('run');
  }

  /** Sıradaki testi atlar; başka test kalmadıysa rapora geçer. */
  function skipNext() {
    const nextIndex = index + 1;
    setSkipped((s) => [...s, order[nextIndex].slug]);
    if (nextIndex + 1 < order.length) {
      // Atlanan testten sonraki test "sıradaki" olur; ara ekran onu gösterir.
      setIndex(nextIndex);
    } else go('result');
  }

  /** Kalan testleri atlayıp rapora geçer. */
  function finishNow() {
    setSkipped((s) => [...s, ...order.slice(index + 1).map((t) => t.slug)]);
    go('result');
  }

  if (phase === 'plan') {
    const picked = tests.filter((t) => chosen.has(t.slug));
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-7">
        <div className="flex flex-col gap-3">
          <p className="t-meta">
            {gradeLabel} · {tests.length} test · yaklaşık {minutesOf(tests)} dakika
          </p>
          <h1 className="t-h1">Kendini Tanı Paketi</h1>
          <p className="t-lede">Kişiliğin, ilgilerin, çalışma alışkanlıkların ve zihinsel becerilerin için testler art arda açılır. Sonunda hepsi tek raporda.</p>
        </div>

        <PageGuide plain title="Paket nasıl ilerler?">
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-ink-2">
            <li>İstemediğin testin işaretini kaldır, sonra “Paketi başlat” düğmesine bas.</li>
            <li>Testler sırayla açılır. Bir test bitince istersen mola ver; sıradaki testi sen başlatırsın.</li>
            <li>Son test bitince özet ve her testin raporu açılır. Saklamak için tek PDF olarak indir.</li>
          </ol>
        </PageGuide>

        <fieldset className="flex flex-col gap-3">
          <legend className="t-h3 mb-3">Paketteki testler</legend>
          {tests.map((t) => {
            const on = chosen.has(t.slug);
            return (
              <label key={t.slug} className={`panel flex cursor-pointer items-start gap-4 p-4 sm:p-5 ${on ? '' : 'opacity-60'}`}>
                <input
                  type="checkbox"
                  className="mt-1.5 size-5 shrink-0"
                  checked={on}
                  onChange={(e) =>
                    setChosen((c) => {
                      const n = new Set(c);
                      if (e.target.checked) n.add(t.slug);
                      else n.delete(t.slug);
                      return n;
                    })
                  }
                />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="t-meta">
                    {t.areaName === t.skill ? t.skill : `${t.areaName} · ${t.skill}`} · yaklaşık {t.minutes} dakika
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-bold">{t.name}</span>
                    {t.pilot && <span className="chip chip-brass">Pilot</span>}
                  </span>
                  <span className="text-ink-2">{t.why}</span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="notice notice-ok flex flex-col gap-2">
          <p className="font-bold">Hiçbir bilgin saklanmaz.</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>Cevapların ve raporların yalnızca bu sayfada durur. Paket bitene kadar bu sayfayı kapatma ve yenileme.</li>
            <li>Aralarda mola verebilirsin; telefonu kilitlemek sayfayı kapatmaz, ama tarayıcı uzun süre arka planda kalırsa sayfayı yenileyebilir.</li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-primary btn-lg" disabled={picked.length === 0} onClick={start}>
            Paketi başlat
          </button>
          <p className="t-meta">
            {picked.length === tests.length ? `${picked.length} test` : `${picked.length} / ${tests.length} test`} · yaklaşık {minutesOf(picked)} dakika
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'run' && current) {
    const payload = current.payload;
    return (
      <div className="flex flex-col gap-6">
        <PackageProgress order={order} index={index} solved={solved} skipped={skipped} />
        {payload.engine === 'likert' ? (
          <LikertRunner
            key={current.slug}
            intro={payload.intro}
            prompt={payload.prompt}
            options={payload.options}
            items={payload.items}
            itemNoun={payload.itemNoun}
            minAnswered={payload.minAnswered}
            onFinish={(answers) => submit({ engine: 'likert', answers })}
          />
        ) : payload.engine === 'tasks' ? (
          <TaskRunner
            key={current.slug}
            intro={payload.intro}
            tasks={payload.tasks}
            seed={seeds[current.slug]}
            onFinish={(blocks) => submit({ engine: 'tasks', seed: seeds[current.slug], blocks })}
          />
        ) : (
          <p className="notice notice-danger mx-auto w-full max-w-2xl">Bu test pakette çözülemiyor.</p>
        )}
      </div>
    );
  }

  if (phase === 'pause') {
    // Son biten test (araya atlanan test girmiş olabilir) ve sıradaki test.
    const last = tests.find((t) => t.slug === solved[solved.length - 1]?.slug);
    const upcoming = order[index + 1];
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <PackageProgress order={order} index={index + 1} solved={solved} skipped={skipped} />
        <div className="flex flex-col gap-3">
          <p className="t-meta">
            {solved.length} / {order.length} test tamam
          </p>
          <h1 className="t-h1">{last ? `${last.name} bitti` : 'Sıradaki test'}</h1>
          <p className="t-lede">
            Sıradaki: <strong>{upcoming.name}</strong> ({upcoming.skill}, yaklaşık {upcoming.minutes} dakika).
          </p>
        </div>
        <p className="notice notice-info">
          İstersen kısa bir mola ver: su iç, gözlerini dinlendir. Bu sayfayı kapatma ve yenileme; cevapların yalnızca burada duruyor.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" onClick={next}>
            Sıradaki teste başla
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={skipNext}>
            Bu testi atla
          </button>
        </div>
        <button type="button" className="btn btn-quiet self-start" onClick={finishNow}>
          Paketi şimdi bitir ve raporu gör
        </button>
      </div>
    );
  }

  return (
    <PackageResult
      grade={grade}
      gradeLabel={gradeLabel}
      adult={adult}
      tests={tests}
      solved={solved}
      skipped={skipped}
      siteUrl={siteUrl}
      packagePath={packagePath}
    />
  );
}

/** Paketin ilerleme çizgisi: biten, atlanan, sıradaki testler. */
function PackageProgress({ order, index, solved, skipped }: { order: PackageClientTest[]; index: number; solved: Solved[]; skipped: string[] }) {
  const done = new Set(solved.map((s) => s.slug));
  const skip = new Set(skipped);
  return (
    <nav aria-label="Paketteki testler" className="mx-auto w-full max-w-3xl">
      <p className="t-meta mb-2">
        Kendini Tanı Paketi · {Math.min(index + 1, order.length)}. test / {order.length}
      </p>
      <ol className="flex gap-1.5">
        {order.map((t, i) => {
          const state = done.has(t.slug) ? 'done' : skip.has(t.slug) ? 'skipped' : i === index ? 'current' : 'todo';
          const label = { done: 'bitti', skipped: 'atlandı', current: 'şimdi', todo: 'sırada' }[state];
          return (
            <li
              key={t.slug}
              title={`${t.name}: ${label}`}
              className={`h-2 flex-1 rounded-full ${
                state === 'done' ? 'bg-ink' : state === 'current' ? 'bg-brass' : state === 'skipped' ? 'bg-rule' : 'bg-surface-2 ring-1 ring-rule'
              }`}
            >
              <span className="sr-only">
                {t.name}: {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PackageResult({
  grade,
  gradeLabel,
  adult,
  tests,
  solved,
  skipped,
  siteUrl,
  packagePath,
}: {
  grade: number;
  gradeLabel: string;
  adult: boolean;
  tests: PackageClientTest[];
  solved: Solved[];
  skipped: string[];
  siteUrl: string;
  packagePath: string;
}) {
  const audiences: Audience[] = adult ? ['adult'] : ['student', 'parent'];
  const [audience, setAudience] = useState<Audience>(audiences[0]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Set<Audience>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const you = audience !== 'parent';

  useLeaveWarning(solved.length > 0 && saved.size === 0, 'Raporu PDF olarak indirmeden ayrılırsan paketteki bütün raporlar silinir; hiçbir yere kaydedilmez. Yine de ayrılmak istiyor musun?', 1);

  const byslug = useMemo(() => new Map(tests.map((t) => [t.slug, t])), [tests]);
  const entriesFor = useCallback(
    (a: Audience): PackageEntry[] =>
      solved.flatMap((s) => {
        const t = byslug.get(s.slug);
        const report = s.reports[a];
        return t && report ? [{ slug: s.slug, skill: t.skill, areaName: t.areaName, report }] : [];
      }),
    [solved, byslug],
  );
  const entries = entriesFor(audience);
  const summary = packageSummary(entries);
  const own = adult ? 'adult' : 'student';
  const card = useMemo(() => packageShareCard(entriesFor(own).map((e) => ({ slug: e.slug, report: e.report })), packagePath), [entriesFor, own, packagePath]);
  const skippedNames = tests.filter((t) => skipped.includes(t.slug)).map((t) => t.name);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const res = await post('/api/paket/pdf', { grade, audience, tests: solved.map((s) => ({ slug: s.slug, data: s.data })), skipped });
      if (!res.ok) throw await failure(res, 'PDF hazırlanamadı. Lütfen tekrar deneyin.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `olcekhane-kendini-tani-paketi-${AUDIENCE_LABELS[audience].file}-raporu.pdf`;
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

  function openReport(slug: string) {
    setOpen((o) => new Set(o).add(slug));
    // Bölüm açıldıktan sonra kaydırılır.
    window.setTimeout(() => document.getElementById(`rapor-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  if (solved.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <h1 className="t-h1">Hiç test çözülmedi</h1>
        <p className="t-lede">Paketteki bütün testleri atladın; rapor hazırlanmadı.</p>
        <a href={packagePath} className="btn btn-primary btn-lg self-start">
          Pakete baştan başla
        </a>
      </div>
    );
  }

  const label = (a: Audience) => (a === 'adult' ? 'Raporunu' : a === 'student' ? 'Öğrenci raporunu' : 'Veli raporunu');
  const downloadBox = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary btn-lg" onClick={download} disabled={busy}>
          {busy ? 'PDF hazırlanıyor…' : `${label(audience)} tek PDF olarak indir`}
        </button>
        {saved.has(audience) && <span className="chip chip-ok">İndirildi</span>}
      </div>
      {error && <p className="notice notice-danger">{error}</p>}
      <p className="t-small text-ink-3">PDF’te önce özet, ardından her testin raporu ve gelişim yol haritası var. İndirme başlamazsa sayfayı Safari ya da Chrome gibi bir tarayıcıda açıp tekrar dene.</p>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="notice notice-ok flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Paket raporun hazır. Bu rapor hiçbir yerde saklanmıyor.</p>
          <p>Sayfayı kapatınca rapor kaybolur. Saklamak için tek PDF olarak indir{audiences.length > 1 ? '; veli raporunu da ayrıca indirebilirsin.' : '.'}</p>
        </div>
        {downloadBox}
      </div>

      {audiences.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-rule-strong bg-surface p-1" role="tablist" aria-label="Rapor türü">
            {audiences.map((a) => (
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

      <section aria-labelledby="ozet" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 id="ozet" className="t-h1">
            {you ? 'Sonuçlarına kısa bir bakış' : 'Sonuçlara kısa bir bakış'}
          </h1>
          <p className="text-ink-2">{summaryIntro(you, summary.length)}</p>
        </div>
        <ul className="flex flex-col gap-3">
          {summary.map((t) => (
            <li key={t.slug} className="panel flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-bold">{t.name}</span>
                  {t.pilot && <span className="chip chip-brass">Pilot</span>}
                </p>
                <p className="t-meta">{t.skill}</p>
              </div>
              <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-[minmax(0,14rem)_1fr]">
                {t.lines.map((l) => (
                  <div key={l.label} className="contents">
                    <dt className="text-ink-2">{l.label}</dt>
                    <dd className="mb-1 font-bold sm:mb-0">{l.value}</dd>
                  </div>
                ))}
              </dl>
              {t.cautions > 0 && (
                <p className="notice notice-warn t-small">{you ? 'Bu testin raporunda okuman gereken bir uyarı var.' : 'Bu testin raporunda okumanız gereken bir uyarı var.'}</p>
              )}
              <button type="button" className="btn btn-quiet self-start px-0" onClick={() => openReport(t.slug)}>
                Raporun tamamını aç →
              </button>
            </li>
          ))}
        </ul>
        {skippedNames.length > 0 && (
          <p className="t-small text-ink-2">
            Pakette olup çözülmeyen {skippedNames.length === 1 ? 'test' : 'testler'}: {skippedNames.join(', ')}.
          </p>
        )}
      </section>

      {card && audience !== 'parent' && <SharePanel card={card} siteUrl={siteUrl} student={audience === 'student'} />}

      <section aria-labelledby="raporlar" className="flex flex-col gap-4">
        <h2 id="raporlar" className="t-h2">
          Testlerin raporları
        </h2>
        {entries.map((e) => (
          <details
            key={e.slug}
            id={`rapor-${e.slug}`}
            className="panel scroll-mt-6"
            open={open.has(e.slug)}
            onToggle={(ev) => {
              const isOpen = (ev.currentTarget as HTMLDetailsElement).open;
              setOpen((o) => {
                if (o.has(e.slug) === isOpen) return o;
                const n = new Set(o);
                if (isOpen) n.add(e.slug);
                else n.delete(e.slug);
                return n;
              });
            }}
          >
            <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-5">
              <span className="font-display text-xl font-bold">{e.report.instrumentName}</span>
              <span className="t-meta">{e.skill}</span>
            </summary>
            <div className="flex flex-col gap-8 border-t border-rule p-5 sm:p-6">
              <SimpleReportView report={e.report} />
              {e.report.roadmap && <RoadmapView roadmap={e.report.roadmap} you={you} />}
            </div>
          </details>
        ))}
      </section>

      <section aria-labelledby="indir" className="panel flex flex-col gap-4 p-6">
        <h2 id="indir" className="t-h3">
          Raporu sakla
        </h2>
        {downloadBox}
      </section>

      <div className="flex flex-wrap gap-3">
        {/* Tam sayfa geçişi: PDF indirilmediyse "sayfadan ayrılıyorsunuz" uyarısı çıksın. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/testler" className="btn btn-secondary btn-lg">
          Başka bir test çöz
        </a>
      </div>
    </div>
  );
}
