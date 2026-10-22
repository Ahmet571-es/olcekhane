import { ItemVisualView } from '@/components/report/item-visual';
import type { OralReportBlock } from '@/lib/reports/oral';
import type { SimpleReport } from '@/lib/reports/simple';
import { MarkedText, UnclearSample } from './oral-word';

/**
 * Sesli okuma raporunun ekrandaki bölümleri (PDF'teki raporla aynı içerik): metnin öğrenci için düzeyi, işaretli metin,
 * hata türleri, duraklamalar, okumanın yönleri, akıcılık, anlama, yeniden anlatma ve öneriler. Otomatik analizde önce
 * okumanın nasıl incelendiği anlatılır; akıcılık ve yeniden anlatma yoktur, net anlaşılamayan kelimeler ayrıca gösterilir.
 */

export function OralLevelBanner({ oral, you }: { oral: OralReportBlock; you: boolean }) {
  return (
    <section aria-labelledby="duzey" className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-brass/50 bg-brass-soft/40 p-6">
      <p className="t-meta">
        {you ? 'Okuduğun metin' : 'Okunan metin'}: “{oral.passage.title}” · {oral.passage.gradeLabel} · {oral.passage.genre} · {oral.passage.words} kelime
      </p>
      <h2 id="duzey" className="font-display text-[clamp(1.6rem,4vw,2.2rem)] font-bold leading-tight">
        {oral.level.label}
      </h2>
      <p className="measure text-[1.0625rem]">{oral.level.text}</p>
      {oral.level.profile && <p className="measure text-ink-2">{oral.level.profile}</p>}
    </section>
  );
}

function Timeline({ t }: { t: NonNullable<OralReportBlock['timeline']> }) {
  const W = 600;
  const H = 70;
  const bw = W / Math.max(1, t.contour.length);
  const secs = Math.round(t.totalMs / 1000);
  const step = secs > 120 ? 30 : secs > 40 ? 10 : 5;
  const ticks: number[] = [];
  for (let s = 0; s <= secs; s += step) ticks.push(s);
  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H + 18}`} className="h-auto w-full" role="img" aria-label={`Okuma boyunca ses yüksekliği ve ${t.pauses.length} duraklama`}>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="var(--surface-2)" />
        {t.pauses.map(([a, b]) => (
          <rect key={a} x={(a / t.totalMs) * W} y={0} width={Math.max(3, ((b - a) / t.totalMs) * W)} height={H} fill="var(--dim-ext)" opacity={0.35} />
        ))}
        {t.contour.map((v, i) => {
          const h = Math.max(1.5, (v / 100) * (H - 10));
          return <rect key={i} x={i * bw + bw * 0.15} y={(H - h) / 2} width={bw * 0.7} height={h} rx={1} fill="var(--ink)" opacity={0.75} />;
        })}
        {ticks.map((s) => (
          <text key={s} x={Math.min(W - 14, (s / secs) * W)} y={H + 14} fontSize="11" fill="var(--ink-3)" textAnchor={s === 0 ? 'start' : 'middle'}>
            {s === 0 ? '0 sn' : `${s}`}
          </text>
        ))}
      </svg>
      <figcaption className="t-meta">{t.caption}</figcaption>
    </figure>
  );
}

function Dots({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={`size-2.5 rounded-full ${i <= value ? 'bg-ink' : 'bg-surface-2 ring-1 ring-rule-strong'}`} />
      ))}
    </span>
  );
}

export function OralReportSections({ report }: { report: SimpleReport }) {
  const oral = report.oral!;
  const you = report.audience !== 'parent';
  const anyMark = oral.counted.some((c) => c.value > 0) || oral.notCounted.some((c) => c.value > 0) || (oral.unclear?.value ?? 0) > 0;
  return (
    <>
      {oral.method && (
        <section aria-labelledby="inceleme" className="notice notice-info flex flex-col gap-2">
          <h2 id="inceleme" className="font-bold">
            {oral.method.title}
          </h2>
          <p className="measure">{oral.method.text}</p>
        </section>
      )}

      <section aria-labelledby="olcutler" className="flex flex-col gap-3">
        <h2 id="olcutler" className="t-h2">
          Düzey nasıl belirlendi?
        </h2>
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-rule-strong text-[0.8125rem] text-ink-3">
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Ölçüt
                </th>
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Sonuç
                </th>
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Bu metin için
                </th>
              </tr>
            </thead>
            <tbody>
              {oral.criteria.map((c) => (
                <tr key={c.label} className="border-b border-rule align-top last:border-0">
                  <th scope="row" className="px-4 py-3 font-bold">
                    {c.label}
                    <p className="t-meta mt-0.5 font-normal">{c.rule}</p>
                  </th>
                  <td className="tabular px-4 py-3 font-bold">{c.value}</td>
                  <td className="px-4 py-3">{c.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-meta measure">Metnin düzeyi, iki ölçütten düşük olanıdır. Eşikler Ölçekhane’nin pilot ölçütleridir; bir norm değildir.</p>
      </section>

      <section aria-labelledby="isaretli" className="flex flex-col gap-4">
        <h2 id="isaretli" className="t-h2">
          {you ? 'Okuman, kelime kelime' : 'Okuma, kelime kelime'}
        </h2>
        <p className="measure text-ink-2">
          {oral.auto
            ? anyMark
              ? you
                ? 'Kırmızı kelimeler hata sayılanlar, sarılar hata sayılmayan gözlemlerdir; gri, noktalı çizgili kelimeler net anlaşılamadı ve hata sayılmadı. Her işaretin adı kelimenin üstünde yazıyor.'
                : 'Kırmızı kelimeler hata sayılanlar (yanlış okuma, atlama, ekleme), sarılar hata sayılmayan gözlemlerdir (kendi düzeltme, tekrar, heceleme, duraksama); gri, noktalı çizgili kelimeler net anlaşılamadı ve hata sayılmadı. Her işaretin adı kelimenin üstünde yazılıdır.'
              : you
                ? 'Hiçbir kelimede işaret yok: Yapay zekâ okumanda hata bulmadı.'
                : 'Hiçbir kelimede işaret yok: Otomatik analiz okumada hata bulmadı.'
            : anyMark
              ? you
                ? 'Kırmızı kelimeler hata sayılanlar, sarılar hata sayılmayan gözlemlerdir. Her işaretin adı kelimenin üstünde yazıyor.'
                : 'Kırmızı kelimeler hata sayılanlar (yanlış okuma, atlama, yardımla okuma, ekleme), sarılar hata sayılmayan gözlemlerdir (kendi düzeltme, tekrar, heceleme, duraksama). Her işaretin adı kelimenin üstünde yazılıdır.'
              : you
                ? 'Hiçbir kelimede işaret yok: Metni hatasız okudun.'
                : 'Hiçbir kelimede işaret yok: Metin hatasız okundu.'}
        </p>
        <div className="panel p-5 text-[1.125rem] sm:p-6">
          <MarkedText paragraphs={oral.marked} />
        </div>
        {oral.unclear && (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <UnclearSample>kelime</UnclearSample>
            <span>
              {oral.unclear.label}: <span className="tabular font-bold">{oral.unclear.value}</span>
            </span>
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-danger">Hata sayılanlar</h3>
            <ul className="flex flex-col divide-y divide-rule rounded-xl border border-rule bg-surface">
              {oral.counted.map((c) => (
                <li key={c.label} className="flex items-center justify-between px-4 py-2">
                  <span>{c.label}</span>
                  <span className="tabular font-bold">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-warn">Hata sayılmayanlar</h3>
            <ul className="flex flex-col divide-y divide-rule rounded-xl border border-rule bg-surface">
              {oral.notCounted.map((c) => (
                <li key={c.label} className="flex items-center justify-between px-4 py-2">
                  <span>{c.label}</span>
                  <span className="tabular font-bold">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {oral.substitutions.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">{you ? 'Yanlış okuduğun kelimeler' : 'Yanlış okunan kelimeler'}</h3>
            <ul className="flex flex-wrap gap-2">
              {oral.substitutions.map((s, i) => (
                <li key={i} className="chip">
                  {s.word}
                  {s.said ? (
                    <>
                      {' '}
                      <span aria-hidden="true">→</span>
                      <span className="sr-only">yerine</span> <span className="text-danger">{s.said}</span>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {oral.timeline && (
        <section aria-labelledby="ritim" className="flex flex-col gap-3">
          <h2 id="ritim" className="t-h2">
            {you ? 'Okumanın ritmi' : 'Okumanın ritmi'}
          </h2>
          <Timeline t={oral.timeline} />
        </section>
      )}

      <section aria-labelledby="yonler" className="flex flex-col gap-4">
        <h2 id="yonler" className="t-h2">
          {report.itemsTitle}
        </h2>
        <ul className="flex flex-col divide-y divide-rule border-y border-rule">
          {report.items.map((it) => (
            // Kartın grafiği telefonda başlığın altında, geniş ekranda açıklamanın yanında (öteki raporlardaki gibi).
            <li key={it.title} className={it.visual ? 'grid gap-x-8 gap-y-3 py-5 md:grid-cols-[minmax(0,1fr)_16.5rem]' : 'flex flex-col gap-1.5 py-5'}>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 md:col-start-1">
                <span className="font-display text-lg font-bold">{it.title}</span>
                {it.badge && <span className="t-small font-bold text-brass-ink">{it.badge}</span>}
              </p>
              {it.visual && (
                <div className="max-w-[22rem] md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-none md:pt-1">
                  <ItemVisualView visual={it.visual} />
                </div>
              )}
              <p className="measure text-ink-2 md:col-start-1">{it.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {oral.prosodyTotal !== null && (
        <section aria-labelledby="akicilik" className="flex flex-col gap-3">
          <h2 id="akicilik" className="t-h2">
            Akıcılık: {oral.prosodyTotal} / 16 · {oral.prosodyLabel}
          </h2>
          <ul className="flex flex-col divide-y divide-rule border-y border-rule">
            {oral.prosody.map((p) => (
              <li key={p.name} className="grid gap-1 py-3.5 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <p className="flex flex-col gap-1">
                  <span className="font-bold">{p.name}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <Dots value={p.value} /> <span className="tabular t-small text-ink-3">{p.value} / 4</span>
                  </span>
                </p>
                <p className="text-ink-2">{p.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="anlama" className="flex flex-col gap-4">
        <h2 id="anlama" className="t-h2">
          {you ? 'Okuduğunu anlaman' : 'Okuduğunu anlama'}
        </h2>
        <ul className="flex flex-col gap-4">
          {oral.skills.map((s) => (
            <li key={s.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
              <span>{s.label}</span>
              <span className="tabular font-bold">
                {s.correct} / {s.total}
              </span>
              <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                <div className="h-full rounded-full bg-ink" style={{ width: `${(s.correct / s.total) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        {oral.retell && (
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">{you ? 'Metni anlatırken söylediğin fikirler' : 'Yeniden anlatmada söylenen fikirler'}</h3>
            <ul className="flex flex-col gap-1.5">
              {oral.retell.map((x) => (
                <li key={x.text} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded text-[0.8rem] font-bold ${x.said ? 'bg-ok text-paper' : 'bg-surface-2 text-ink-3 ring-1 ring-rule-strong'}`}
                    aria-hidden="true"
                  >
                    {x.said ? '✓' : '–'}
                  </span>
                  <span className={x.said ? '' : 'text-ink-3'}>
                    {x.text}
                    {x.core && <span className="t-small ml-2 font-bold text-brass-ink">temel</span>}
                    <span className="sr-only">{x.said ? ' (söylendi)' : ' (söylenmedi)'}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section aria-labelledby="sonraki" className="panel flex flex-col gap-2 p-6">
        <h2 id="sonraki" className="t-h3">
          Sonraki değerlendirme
        </h2>
        <p>{oral.next}</p>
        <p className="t-small text-ink-2">
          {you ? 'Okumanı geliştirmek için öneriler aşağıdaki gelişim yol haritasında.' : 'Okumayı geliştirmek için öneriler aşağıdaki gelişim yol haritasındadır.'}
        </p>
      </section>
    </>
  );
}
