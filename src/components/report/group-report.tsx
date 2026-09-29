import { MathText } from '@/components/quiz/math-text';
import type { GroupReport } from '@/lib/school/group';
import type { BandCell } from '@/lib/school/suppress';

const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** Düzeylere göre öğrenci sayıları; küçük gruplar varsa düzeyler birleşik gelir ya da dağılım hiç gösterilmez. */
function BandBar({ bands, n }: { bands: BandCell[] | null; n: number }) {
  if (!bands) return <p className="t-meta">Düzeylere göre dağılım, küçük gruplar nedeniyle gösterilmiyor.</p>;
  const shades = bands.length > 1 ? bands.map((_, i) => 25 + Math.round((i * 55) / (bands.length - 1))) : [55];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-3 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        {bands.map((b, i) =>
          b.count ? (
            <span
              key={b.key}
              className="block h-full"
              style={{ width: `${(b.count / n) * 100}%`, background: `color-mix(in oklab, var(--ink) ${shades[i]}%, var(--surface))` }}
            />
          ) : null,
        )}
      </div>
      <p className="t-meta flex flex-wrap gap-x-3 gap-y-1">
        {bands.map((b) => (
          <span key={b.key}>
            {b.label}: <span className="tabular font-bold text-ink-2">{b.count}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

export function GroupReportView({ report }: { report: GroupReport }) {
  const r = report;
  return (
    <div className="flex flex-col gap-8">
      {r.likert && (
        <section className="flex flex-col gap-4" aria-label="Ölçek sonuçları">
          <ul className="panel divide-y divide-rule">
            {r.likert.scales.map((s) => (
              <li key={s.key} className="grid gap-3 p-5 md:grid-cols-[14rem_1fr] md:gap-8">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="t-meta">{s.plain}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="tabular">
                    Grup ortalaması <strong>{s.mean === null ? '—' : nf1.format(s.mean)}</strong>{' '}
                    <span className="t-meta">
                      ({s.min}–{s.max} arası)
                    </span>
                  </p>
                  <BandBar bands={s.bands} n={r.n} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {r.riasec && (
        <section className="flex flex-col gap-4" aria-label="İlgi alanları">
          <p className="t-small text-ink-2">Sınıfın ilgi alanlarına göre ortalamaları, en yüksekten başlayarak (1–5 arası).</p>
          <ul className="panel divide-y divide-rule">
            {[...r.riasec.types]
              .sort((a, b) => (b.mean ?? -1) - (a.mean ?? -1))
              .map((t) => (
                <li key={t.key} className="grid grid-cols-[minmax(0,12rem)_1fr_auto] items-center gap-4 p-4">
                  <span className="font-bold">{t.name}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <span className="block h-full rounded-full bg-ink" style={{ width: `${t.mean === null ? 0 : ((t.mean - 1) / 4) * 100}%` }} />
                  </span>
                  <span className="t-small tabular text-ink-2">{t.mean === null ? '—' : nf1.format(t.mean)}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {r.quiz && (
        <section className="flex flex-col gap-6" aria-label="Akademik sonuçlar">
          <div className="grid gap-5 md:grid-cols-[14rem_1fr]">
            <div className="panel flex flex-col gap-1 p-5">
              <p className="t-meta">Ortalama başarı</p>
              <p className="font-display text-4xl font-bold tabular">%{r.quiz.meanPct}</p>
              {r.quiz.contentGrade && <p className="t-meta">{r.quiz.contentGrade}. sınıf konuları</p>}
            </div>
            <div className="panel flex flex-col gap-3 p-5">
              <p className="font-bold">Düzeylere göre dağılım</p>
              <BandBar bands={r.quiz.bands} n={r.n} />
            </div>
          </div>
          <div className="panel flex flex-col gap-3 p-5">
            <p className="font-bold">Konu alanlarına göre ortalama</p>
            <ul className="flex flex-col gap-3">
              {r.quiz.domains.map((d) => (
                <li key={d.key} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[16rem_1fr_auto]">
                  <span>{d.name}</span>
                  <span className="hidden h-2 overflow-hidden rounded-full bg-surface-2 sm:block" aria-hidden="true">
                    <span className="block h-full rounded-full bg-ink" style={{ width: `${d.meanPct}%` }} />
                  </span>
                  <span className="tabular t-small">%{d.meanPct}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="t-h3">Sınıfta sık görülen hata türleri</h2>
            {r.quiz.misconceptions.length === 0 ? (
              <p className="text-ink-2">Belirgin biçimde yaygın bir hata türü görülmedi.</p>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {r.quiz.misconceptions.map((m) => (
                  <li key={m.key} className="panel flex flex-col gap-2 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold">{m.name}</p>
                      <span className="chip">{m.pct === null || m.students === null ? '3’ten az öğrenci' : `%${m.pct} · ${m.students} öğrenci`}</span>
                    </div>
                    <p className="t-small text-ink-2">
                      <MathText text={m.tip} />
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {r.cognitive && (
        <ul className="panel divide-y divide-rule">
          {r.cognitive.rows.map((c) => (
            <li key={c.key} className="grid gap-1 p-5 sm:grid-cols-[16rem_1fr]">
              <span className="font-bold">{c.name}</span>
              <span className="tabular">{c.value}</span>
            </li>
          ))}
        </ul>
      )}

      {r.reading && (
        <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2">
          <div className="bg-surface p-5">
            <dt className="t-meta">Ortalama anlama</dt>
            <dd className="font-display text-3xl font-bold tabular">%{r.reading.meanComprehensionPct}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="t-meta">Ortanca okuma hızı</dt>
            <dd className="font-display text-3xl font-bold tabular">{r.reading.medianWpm} kelime/dk</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
