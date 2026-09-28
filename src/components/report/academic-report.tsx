import { MathText } from '@/components/quiz/math-text';
import { QuizVisual } from '@/components/quiz/quiz-visuals';
import type { AcademicReport, ReportContent } from '@/lib/reports/build';

type ReviewItem = AcademicReport['review'][number];

function numberList(ns: number[]): string {
  if (ns.length === 1) return `${ns[0]}. soru`;
  return `${ns.slice(0, -1).join(', ')} ve ${ns[ns.length - 1]}. sorular`;
}

/** Bir alandaki soruların sonucu: dolu kare doğru, boş kare yanlış, kesikli kare “Bilmiyorum”. */
function DomainMarks({ items }: { items: ReviewItem[] }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.key}
          className={`block h-4 w-4 rounded-[3px] border-[1.5px] ${
            it.correct ? 'border-ink bg-ink' : it.choice === 'X' ? 'border-dashed border-rule-strong' : 'border-rule-strong bg-surface'
          }`}
        />
      ))}
    </span>
  );
}

function bandChip(band: string) {
  return band === 'high' ? 'chip chip-ok' : band === 'average' ? 'chip chip-brass' : 'chip';
}

function ItemReview({ it, forStudent }: { it: ReviewItem; forStudent: boolean }) {
  const status = it.correct ? 'Doğru' : it.choice === 'X' ? 'Bilmiyorum' : it.choice === null ? 'Boş' : 'Yanlış';
  return (
    <article className="panel flex flex-col gap-4 p-5 md:p-6" aria-labelledby={`soru-${it.no}`}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={`soru-${it.no}`} className="font-body text-base font-bold">
          {it.no}. soru <span className="font-normal text-ink-3">· {it.domainName}</span>
        </h3>
        <span className={it.correct ? 'chip chip-ok' : 'chip'}>{status}</span>
      </header>
      <QuizVisual item={it} />
      <p className="text-[1.0625rem] leading-relaxed">
        <MathText text={it.text} />
      </p>
      <ul className="flex flex-col gap-1.5">
        {it.options.map((o) => {
          const isAnswer = o.key === it.answer;
          const isChoice = o.key === it.choice;
          return (
            <li
              key={o.key}
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2 ${
                isAnswer ? 'border-ok bg-ok-bg' : isChoice ? 'border-danger bg-danger-bg' : 'border-rule'
              }`}
            >
              <span className="font-bold">{o.key})</span>
              <span className="tabular">
                <MathText text={o.text} />
              </span>
              {isAnswer && <span className="ml-auto text-[0.875rem] font-bold text-ok">✓ Doğru cevap</span>}
              {isChoice && !isAnswer && (
                <span className="ml-auto text-[0.875rem] font-bold text-danger">✗ {forStudent ? 'Senin cevabın' : 'Verilen cevap'}</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="rounded-lg bg-surface-2 p-4">
        <p className="font-bold">Açıklama</p>
        <p className="mt-1">
          <MathText text={it.explain} />
        </p>
      </div>
    </article>
  );
}

export function AcademicReportView({ report }: { report: ReportContent }) {
  const a = report.academic!;
  const forStudent = report.audience === 'student';
  const missed = a.review.filter((r) => !r.correct);
  const right = a.review.filter((r) => r.correct);
  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="genel-sonuc" className="flex flex-col gap-5">
        <h2 id="genel-sonuc" className="t-h2">
          Genel sonuç
        </h2>
        <div className="grid gap-6 md:grid-cols-[14rem_1fr] md:items-start">
          <div className="panel flex flex-col gap-2 p-5">
            <p className="font-display text-5xl font-bold tabular leading-none">
              {a.correct}
              <span className="text-2xl text-ink-3">/{a.n}</span>
            </p>
            <p className="t-meta">doğru cevap</p>
            <p className="t-small tabular text-ink-2">
              {a.wrong} yanlış · {a.dontKnow} bilmiyorum
            </p>
            <span className={`${bandChip(a.band)} self-start`}>{a.bandLabel}</span>
          </div>
          <div className="flex flex-col gap-3">
            <p className="measure text-[1.0625rem]">{a.text}</p>
            <p className="t-meta measure">
              Sorular {a.contentGrade}. sınıfın konularındandır. Düzeyler ölçüt temellidir: 4 sorudan en az 3’ü doğruysa “Sağlam”, 2’si doğruysa
              “Pekiştirilmeli”, daha azı doğruysa “Öncelikli”.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="alanlar" className="flex flex-col gap-5">
        <h2 id="alanlar" className="t-h2">
          Konu alanlarına göre
        </h2>
        <div className="panel divide-y divide-rule">
          {a.domains.map((d) => (
            <div key={d.key} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
              <div>
                <p className="font-bold">{d.name}</p>
                <p className="t-meta">{d.plain}</p>
              </div>
              <div className="flex items-center gap-4">
                <DomainMarks items={a.review.filter((r) => r.domain === d.key)} />
                <span className="tabular font-bold" aria-label={`${d.n} sorudan ${d.correct} doğru`}>
                  {d.correct}/{d.n}
                </span>
                <span className={`${bandChip(d.band)} min-w-[7.5rem] justify-center`}>{d.bandLabel}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="t-meta">Dolu kare doğru, boş kare yanlış, kesikli kare “Bilmiyorum” cevabını gösterir.</p>
      </section>

      <section aria-labelledby="hatalar" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id="hatalar" className="t-h2">
            {forStudent ? 'Yanlışların neyi gösteriyor?' : 'Yanlışlar neyi gösteriyor?'}
          </h2>
          <p className="measure text-ink-2">{a.misconceptionNote}</p>
        </div>
        {a.misconceptions.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {a.misconceptions.map((m) => (
              <article key={m.key} className="panel flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="t-h3">{m.name}</h3>
                  <span className={m.count > 1 ? 'chip chip-brass' : 'chip'}>{m.count > 1 ? `${m.count} soruda` : '1 soruda'}</span>
                </div>
                <p className="text-ink-2">
                  <MathText text={m.explain} />
                </p>
                <p>
                  <span className="font-bold">{forStudent ? 'Ne yapabilirsin? ' : 'Ne yapılabilir? '}</span>
                  <MathText text={m.tip} />
                </p>
                <p className="t-meta">Görüldüğü yer: {numberList(m.itemNumbers)}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="inceleme" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id="inceleme" className="t-h2">
            Soru soru inceleme
          </h2>
          <p className="measure text-ink-2">
            {missed.length === 0
              ? forStudent
                ? 'Bütün soruları doğru cevapladın!'
                : 'Bütün sorular doğru cevaplanmış.'
              : forStudent
                ? 'Yanlış yaptığın ve “Bilmiyorum” dediğin sorular aşağıda, doğru cevapları ve açıklamalarıyla birlikte. Açıklamayı okuduktan sonra soruyu birkaç gün içinde yeniden çözmeyi dene.'
                : 'Yanlış cevaplanan ve “Bilmiyorum” olarak işaretlenen sorular aşağıda, doğru cevapları ve açıklamalarıyla birlikte yer alıyor.'}
          </p>
        </div>
        {missed.map((it) => (
          <ItemReview key={it.key} it={it} forStudent={forStudent} />
        ))}
        {right.length > 0 && (
          <details className="panel p-5">
            <summary className="cursor-pointer font-bold">
              {forStudent ? 'Doğru cevapladığın sorular' : 'Doğru cevaplanan sorular'} ({right.length})
            </summary>
            <div className="mt-5 flex flex-col gap-5">
              {right.map((it) => (
                <ItemReview key={it.key} it={it} forStudent={forStudent} />
              ))}
            </div>
          </details>
        )}
      </section>

      <section aria-labelledby="oneriler" className="flex flex-col gap-3">
        <h2 id="oneriler" className="t-h2">
          {forStudent ? 'Bundan sonra ne yapabilirsin?' : 'Bundan sonra ne yapılabilir?'}
        </h2>
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          {a.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
