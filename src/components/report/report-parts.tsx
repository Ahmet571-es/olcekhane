import { MathText } from '@/components/quiz/math-text';
import { ItemVisualView } from '@/components/report/item-visual';
import type { PartCard, PartLevel, PartRow, PartStatus, ReportPart } from '@/lib/reports/parts';

/**
 * Raporun ek bölümleri (lib/reports/parts.ts) ekranda: başlık, giriş, kartlar. Kartın grafiği telefonda başlığın altında,
 * geniş ekranda açıklamanın yanında (öteki kartlar gibi). Uzun bölümde (`collapsed`) her kart açılır kapanır bir kutudur;
 * kutunun başlığında kartın adı ve rozeti görünür. PDF'teki bölümlerle aynı içerik (lib/pdf/simple-report.tsx).
 */

const LEVEL_COLS: Record<number, string> = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5' };

function Badge({ text, status }: { text: string; status?: PartStatus }) {
  if (status === 'warn') return <span className="chip border-warn bg-warn-bg text-warn">{text}</span>;
  if (status === 'ok') return <span className="chip">{text}</span>;
  if (status === 'none') return <span className="chip text-ink-3">{text}</span>;
  return <span className="t-small font-bold text-brass-ink">{text}</span>;
}

/**
 * Düzeyler yan yana (telefonda alt alta); kişinin düzeyi vurgulu. Birleşik kutuda ("Çok az · Az kullanılıyor") kişinin düzeyi
 * adıyla yazılır; puanın sınırına yakın olduğu komşu düzeyde "Bu da uyabilir".
 */
function Levels({ levels, you, badge, whose }: { levels: PartLevel[]; you: boolean; badge?: string; whose?: string }) {
  return (
    <ul className={`grid gap-2 ${LEVEL_COLS[levels.length] ?? 'sm:grid-cols-3'}`}>
      {levels.map((l) => (
        <li
          key={l.label}
          aria-current={l.active ? 'true' : undefined}
          className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2 ${l.active ? 'border-brass bg-brass-soft' : 'border-rule'}`}
        >
          <span className={`text-[0.9375rem] font-bold ${l.active ? 'text-ink' : 'text-ink-2'}`}>{l.label}</span>
          {l.text && <span className="text-[0.9375rem] text-ink-2">{l.text}</span>}
          {l.active && (
            <span className="t-small font-bold text-brass-ink">
              {whose ?? (you ? 'Senin düzeyin' : 'Çocuğunuzun düzeyi')}
              {badge && l.label.includes(' · ') ? `: ${badge}` : ''}
            </span>
          )}
          {l.near && <span className="t-small font-bold text-ink-2">Bu da uyabilir</span>}
        </li>
      ))}
    </ul>
  );
}

/** Konu taramada soru ve seçenek metinlerindeki kesirler ({3/4}) alt alta yazılır; öteki metinler olduğu gibi. */
const Txt = ({ t }: { t: string }) => (t.includes('{') ? <MathText text={t} /> : <>{t}</>);

/** Madde madde liste: numara, metin, verilen cevap ve etiketler. */
function Rows({ rows, head }: { rows: PartRow[]; head?: PartCard['rowsHead'] }) {
  return (
    <ol className="flex flex-col divide-y divide-rule border-y border-rule">
      {rows.map((r) => (
        <li key={r.no} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-2.5">
          <span className="tabular pt-px text-[0.9375rem] text-ink-3">{r.label ? '' : `${r.no}.`}</span>
          <div className="flex flex-col gap-1">
            {/* Aynı soruların geldiği testlerde satırda soru yazılmaz: metin boş olabilir. */}
            {(r.label || r.text) && (
              <p className={r.muted ? 'text-ink-3' : ''}>
                {r.label && <span className="tabular">{r.label} </span>}
                <Txt t={r.text} />
              </p>
            )}
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem]">
              {head && <span className="sr-only">{head.value}:</span>}
              <span className={r.muted ? 'italic text-ink-3' : 'font-bold'}>
                <Txt t={r.value} />
              </span>
              {r.tags.map((t) => (
                // Uzun etiket (ör. "doğru cevap: …") telefonda satırı taşırmasın: alt satıra geçer.
                <span key={t} className="chip chip-brass max-w-full whitespace-normal">
                  <Txt t={t} />
                </span>
              ))}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CardBody({ card, you }: { card: PartCard; you: boolean }) {
  return (
    <div className={card.visual ? 'grid gap-x-8 gap-y-3 md:grid-cols-[minmax(0,1fr)_16.5rem]' : 'flex flex-col gap-3'}>
      {card.visual && (
        <div className="max-w-[22rem] md:col-start-2 md:row-span-3 md:row-start-1 md:max-w-none md:pt-1">
          <ItemVisualView visual={card.visual} />
        </div>
      )}
      {card.text && <p className="measure whitespace-pre-line text-ink-2 md:col-start-1 md:row-start-1">{card.text}</p>}
      {card.note && <p className="t-meta measure md:col-start-1">{card.note}</p>}
      {card.levels && (
        <div className="md:col-span-2">
          <Levels levels={card.levels} you={you} badge={card.badge} whose={card.activeLabel} />
        </div>
      )}
      {card.rows && (
        <div className="md:col-start-1">
          <Rows rows={card.rows} head={card.rowsHead} />
        </div>
      )}
    </div>
  );
}

function CardHead({ card }: { card: PartCard }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-display text-lg font-bold">{card.title}</span>
      {card.badge && <Badge text={card.badge} status={card.status} />}
    </span>
  );
}

function PartView({ part, you }: { part: ReportPart; you: boolean }) {
  const id = `bolum-${part.key}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="t-h2">
        {part.title}
      </h2>
      <p className="measure text-ink-2">{part.intro}</p>
      {part.introNote && <p className="t-meta measure">{part.introNote}</p>}
      {part.groups.map((g, i) => (
        <div key={g.title ?? i} className="flex flex-col gap-2">
          {g.title && <h3 className="font-display text-xl font-bold">{g.title}</h3>}
          <ul className="flex flex-col divide-y divide-rule border-y border-rule">
            {g.cards.map((card) => (
              <li key={card.key}>
                {part.collapsed ? (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-baseline gap-2.5 py-4 [&::-webkit-details-marker]:hidden">
                      <span aria-hidden="true" className="inline-block w-3 shrink-0 font-bold text-ink-3 group-open:rotate-90">
                        ›
                      </span>
                      <CardHead card={card} />
                    </summary>
                    <div className="pb-5">
                      <CardBody card={card} you={you} />
                    </div>
                  </details>
                ) : (
                  <div className="flex flex-col gap-3 py-5">
                    <p>
                      <CardHead card={card} />
                    </p>
                    <CardBody card={card} you={you} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {part.sources && part.sources.length > 0 && (
        <p className="t-small text-ink-3">
          Kaynak:{' '}
          {part.sources.map((s, i) => (
            <span key={s.text}>
              {i > 0 && ' · '}
              {s.text}{' '}
              {s.url && (
                <a href={s.url} className="underline" target="_blank" rel="noopener noreferrer">
                  {s.url.replace(/^https:\/\//, '')}
                </a>
              )}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}

export function ReportParts({ parts, you }: { parts: ReportPart[]; you: boolean }) {
  return (
    <>
      {parts.map((p) => (
        <PartView key={p.key} part={p} you={you} />
      ))}
    </>
  );
}
