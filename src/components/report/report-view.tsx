import type { ReportContent, ReportSection } from '@/lib/reports/build';
import { AcademicReportView } from './academic-report';
import { CognitiveReportView } from './cognitive-report';
import { InterestReport } from './interest-report';
import { ScaleRuler } from './scale-ruler';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

function rulerSteps(s: ReportSection) {
  const span = s.max - s.min;
  if (span <= 4) return { major: 1, minor: 0.25 };
  if (span <= 10) return { major: 1, minor: 0.5 };
  if (span <= 40) return { major: 5, minor: 1 };
  return { major: 10, minor: 2 };
}

export function ReportView({ report }: { report: ReportContent }) {
  const forStudent = report.audience === 'student';
  const multi = report.sections.length > 1 && !report.reading && !report.interests;
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3 border-b border-rule pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{forStudent ? 'Öğrenci raporu' : 'Veli raporu'}</span>
          {report.isPilot && <span className="chip chip-brass">Pilot test</span>}
        </div>
        <h1 className="t-h1">{report.instrumentName}</h1>
        <p className="text-ink-2">
          {report.studentName} · {report.gradeLabel} · {dateFmt.format(new Date(report.completedAt))}
        </p>
      </header>

      {report.qualityNotes.length > 0 && (
        <div className="notice notice-warn">
          <p className="font-bold">Bu sonucu dikkatle yorumlayın</p>
          <ul className="mt-1 list-disc pl-5">
            {report.qualityNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="mt-2 t-small">
            {forStudent
              ? 'İstersen testi daha sonra, acele etmeden yeniden çözebilirsin.'
              : 'Çocuğunuz uygun bir zamanda testi acele etmeden yeniden çözebilir.'}
          </p>
        </div>
      )}

      {report.reading && <ReadingSummary report={report} />}

      {multi && (
        <section aria-labelledby="genel-bakis" className="flex flex-col gap-6">
          <div>
            <h2 id="genel-bakis" className="t-h2">
              Genel bakış
            </h2>
            <p className="measure mt-2 text-ink-2">
              {report.overview ??
                (forStudent
                  ? 'Her satır bir özelliği gösteriyor. Kırmızı işaret senin puanın; sarı bant ölçümün doğal payı. Uçlardan biri "iyi", öteki "kötü" değil; her ikisinin de güçlü yanları var.'
                  : 'Her satır bir kişilik boyutunu gösterir. Kırmızı işaret çocuğunuzun puanı, sarı bant ölçümün doğal payıdır. Uçlardan biri iyi, diğeri kötü değildir; her tarzın kendine özgü güçlü yanları vardır.')}
            </p>
          </div>
          {(report.strengths || report.growth) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="panel p-5">
                <p className="font-bold">{forStudent ? 'Güçlü alışkanlıkların' : 'Güçlü yanlar'}</p>
                {report.strengths && report.strengths.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1">
                    {report.strengths.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-ink-2">
                    {forStudent
                      ? 'Henüz belirgin biçimde güçlü bir alan yok; aşağıdaki önerilerle kısa sürede geliştirebilirsin.'
                      : 'Henüz belirgin biçimde güçlü bir alan görünmüyor; aşağıdaki önerilerle kısa sürede gelişme sağlanabilir.'}
                  </p>
                )}
              </div>
              <div className="panel p-5">
                <p className="font-bold">{forStudent ? 'Geliştirebileceğin alanlar' : 'Geliştirilebilecek alanlar'}</p>
                {report.growth && report.growth.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1">
                    {report.growth.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-ink-2">
                    {forStudent ? 'Belirgin biçimde zayıf bir alan görünmüyor.' : 'Belirgin biçimde zayıf bir alan görünmüyor.'}
                  </p>
                )}
              </div>
            </div>
          )}
          {report.highlights.length > 0 && (
            <div className="panel p-5">
              <p className="font-bold">{forStudent ? 'Sende öne çıkanlar' : 'Öne çıkanlar'}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {report.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="panel divide-y divide-rule">
            {report.sections.map((s) => {
              const st = rulerSteps(s);
              return (
                <div key={s.scaleKey} className="grid gap-3 p-5 md:grid-cols-[13rem_1fr] md:items-center md:gap-8">
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="t-meta">{s.bandLabel}</p>
                  </div>
                  <ScaleRuler
                    min={s.min}
                    max={s.max}
                    value={s.value}
                    ciLow={s.ciLow}
                    ciHigh={s.ciHigh}
                    majorStep={st.major}
                    minorStep={st.minor}
                    poles={s.poles}
                    srLabel={`${s.name}: ${s.valueLabel}, ${s.bandLabel}`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {report.academic ? (
        <AcademicReportView report={report} />
      ) : report.interests ? (
        <InterestReport report={report} />
      ) : report.cognitive ? (
        <CognitiveReportView report={report} />
      ) : (
        <section className="flex flex-col gap-8" aria-label="Ayrıntılı sonuçlar">
          {report.sections.map((s) => (
            <SectionDetail key={s.scaleKey} s={s} forStudent={forStudent} showRuler={!multi && !report.reading} />
          ))}
        </section>
      )}

      {report.support && (
        <aside className="notice notice-info" aria-labelledby="destek">
          <h2 id="destek" className="font-body text-base font-bold">
            {forStudent ? 'Konuşmak istersen' : 'Destek almak isterseniz'}
          </h2>
          {forStudent ? (
            <p className="mt-1">
              Kendini zor hissettiğinde bunu tek başına taşımak zorunda değilsin. Ailenle, okulundaki rehber öğretmeninle ya da güvendiğin bir
              yetişkinle konuşabilirsin. Acil bir durumda 112’yi arayabilirsin.
            </p>
          ) : (
            <ul className="mt-1 list-disc pl-5">
              <li>Okulun rehberlik servisi (psikolojik danışman) ilk başvuru adresidir ve ücretsizdir.</li>
              <li>Aile hekiminiz, gerekirse çocuk ve ergen ruh sağlığı uzmanına yönlendirebilir.</li>
              <li>Acil bir durum olduğunu düşünüyorsanız 112’yi arayın.</li>
            </ul>
          )}
        </aside>
      )}

      <footer className="flex flex-col gap-4 border-t border-rule pt-8">
        {report.academic ? (
          <p className="notice notice-info">
            <strong>Bu rapor bir sınav notu değildir.</strong>{' '}
            {forStudent
              ? 'Tek bir testteki cevaplarına dayanır ve bugün neyi bildiğini gösterir. Eksikler çalışarak tamamlanır.'
              : 'Tek bir testteki cevaplara dayanır ve bugünkü durumu gösterir. Öğretmenin gözlemleriyle birlikte değerlendirilmeli; sınıf geçme ya da okul seçimi gibi kararlarda tek başına dayanak olarak kullanılmamalıdır.'}
          </p>
        ) : (
          <p className="notice notice-info">
            <strong>Bu rapor bir tanı değildir.</strong>{' '}
            {forStudent
              ? 'Senin cevaplarına dayanır ve bugünkü hâlini anlatır. İnsanlar zamanla değişir ve gelişir.'
              : 'Çocuğunuzun kendi cevaplarına ya da görevdeki performansına dayanır; bugünkü hâlini anlatır. Eğitim ve kariyer kararlarında tek başına dayanak olarak kullanılmamalıdır.'}
          </p>
        )}
        <details className="panel p-5">
          <summary className="cursor-pointer font-bold">Bu testin bilimsel dayanağı</summary>
          <dl className="mt-4 grid gap-3 text-[0.975rem] md:grid-cols-[12rem_1fr]">
            <dt className="font-bold">Kaynak</dt>
            <dd>{report.science.basedOn}</dd>
            <dt className="font-bold">Güvenirlik</dt>
            <dd>{report.science.reliability}</dd>
            <dt className="font-bold">Norm durumu</dt>
            <dd>{report.normNote}</dd>
            <dt className="font-bold">Lisans</dt>
            <dd>{report.science.license}</dd>
            <dt className="font-bold">Sınırlılıklar</dt>
            <dd>
              <ul className="list-disc pl-5">
                {report.science.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </dd>
          </dl>
        </details>
      </footer>
    </article>
  );
}

function SectionDetail({ s, forStudent, showRuler }: { s: ReportSection; forStudent: boolean; showRuler: boolean }) {
  const st = rulerSteps(s);
  // Yüzdelik yalnızca norm varken vardır; uçlarda 1–99 aralığında gösterilir.
  const pct = s.percentile === null ? null : Math.min(99, Math.max(1, Math.round(s.percentile)));
  return (
    <section className="grid gap-4 md:grid-cols-[13rem_1fr] md:gap-8" aria-labelledby={`b-${s.scaleKey}`}>
      <div className="flex flex-col gap-1">
        <h2 id={`b-${s.scaleKey}`} className="t-h3">
          {s.name}
        </h2>
        <p className="t-meta">{s.plain}</p>
      </div>
      <div className="flex flex-col gap-4">
        {showRuler && (
          <ScaleRuler
            min={s.min}
            max={s.max}
            value={s.value}
            ciLow={s.ciLow}
            ciHigh={s.ciHigh}
            majorStep={st.major}
            minorStep={st.minor}
            poles={s.poles}
            srLabel={`${s.name}: ${s.valueLabel}, ${s.bandLabel}`}
          />
        )}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-xl font-bold">{s.summary || s.bandLabel}</p>
          <p className="t-meta tabular">
            {s.summary && s.summary !== s.bandLabel ? `${s.bandLabel} · ` : ''}puan {s.valueLabel}
            {pct !== null && ` · yüzdelik ${pct}`}
          </p>
        </div>
        {pct !== null && (
          <p className="t-small text-ink-2">
            {forStudent
              ? `Karşılaştırma grubunda bu puanın altında kalan öğrencilerin oranı yaklaşık %${pct}.`
              : `Karşılaştırma grubunda bu puanın altında kalan öğrencilerin oranı yaklaşık %${pct}. Grubun kimlerden oluştuğu raporun sonundaki “bilimsel dayanak” bölümünde yazılı.`}
          </p>
        )}
        <p className="measure">{s.text}</p>
        {s.tips.length > 0 && (
          <div>
            <p className="font-bold">{forStudent ? 'Deneyebileceklerin' : 'Evde neler yapılabilir?'}</p>
            <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
              {s.tips.map((t) => (
                <li key={t} className="measure">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function ReadingSummary({ report }: { report: ReportContent }) {
  const r = report.reading!;
  const forStudent = report.audience === 'student';
  return (
    <section aria-labelledby="okuma-ozet" className="flex flex-col gap-5">
      <h2 id="okuma-ozet" className="t-h2">
        {r.passageTitle ? `“${r.passageTitle}” metni` : 'Okuma sonucu'}
      </h2>
      <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
        <div className="bg-surface p-5">
          <dt className="t-meta">Anlama</dt>
          <dd className="font-display text-3xl font-bold tabular">
            {r.correct}/{r.total}
          </dd>
          <dd className="t-meta">doğru cevap</dd>
        </div>
        <div className="bg-surface p-5">
          <dt className="t-meta">Okuma hızı</dt>
          <dd className="font-display text-3xl font-bold tabular">{nf0.format(r.wpm)}</dd>
          <dd className="t-meta">kelime/dakika · {r.wordCount} kelime</dd>
        </div>
        <div className="bg-surface p-5">
          <dt className="t-meta">Anlayarak okuma</dt>
          <dd className="font-display text-3xl font-bold tabular">{nf0.format(r.effectiveWpm)}</dd>
          <dd className="t-meta">hız × anlama oranı</dd>
        </div>
      </dl>
      <p className="measure">{r.speedNote}</p>
      {r.referenceNote && <p className="measure t-small text-ink-2">{r.referenceNote}</p>}
      <div className="panel p-5">
        <p className="font-bold">{forStudent ? 'Soru türlerine göre' : 'Soru türlerine göre sonuç'}</p>
        <ul className="mt-3 flex flex-col gap-3">
          {r.skills.map((sk) => (
            <li key={sk.label} className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[14rem_1fr_auto]">
              <span>{sk.label}</span>
              <span className="hidden h-2 overflow-hidden rounded-full bg-surface-2 sm:block" aria-hidden="true">
                <span className="block h-full rounded-full bg-ink" style={{ width: `${sk.total ? (sk.correct / sk.total) * 100 : 0}%` }} />
              </span>
              <span className="tabular t-small">
                {sk.correct}/{sk.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
