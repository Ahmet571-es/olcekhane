import type { InterestProfile, ReportContent } from '@/lib/reports/build';
import { ScaleRuler } from './scale-ruler';

const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * Holland altıgeni: altı ilgi alanı bir altıgenin köşelerindedir; komşu alanlar birbirine benzer.
 * Öğrencinin ortalama puanları (1–5) merkezden köşelere doğru çizilir; en belirgin üç alan vurgulanır.
 */
export function InterestHexagon({ profile, forStudent }: { profile: InterestProfile; forStudent: boolean }) {
  const cx = 230;
  const cy = 200;
  const rMax = 132;
  const angle = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
  const pt = (i: number, v: number) => {
    const r = (rMax * v) / 5;
    return [r2(cx + Math.cos(angle(i)) * r), r2(cy + Math.sin(angle(i)) * r)] as const;
  };
  const ring = (v: number) =>
    profile.types.map((_, i) => pt(i, v).join(',')).join(' ');
  const poly = profile.types.map((t, i) => pt(i, t.mean ?? 1).join(',')).join(' ');
  const top = new Set(profile.code.split(''));
  const label = profile.types
    .map((t) => `${t.name} ${t.mean === null ? 'hesaplanamadı' : nf1.format(t.mean)}`)
    .join(', ');

  return (
    <svg
      viewBox="0 0 460 400"
      className="h-auto w-full max-w-[30rem]"
      role="img"
      aria-label={`${forStudent ? 'İlgi profilin' : 'İlgi profili'}: ${label}. En belirgin alanlar: ${profile.top.map((t) => t.name).join(', ')}.`}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <polygon key={v} points={ring(v)} fill="none" stroke="var(--rule)" strokeWidth={v === 5 ? 1.5 : 1} />
      ))}
      {profile.types.map((_, i) => {
        const [x, y] = pt(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--rule)" strokeWidth={1} />;
      })}
      {[3, 5].map((v) => {
        const [x, y] = pt(0, v);
        return (
          <text key={v} x={x + 6} y={y + 4} fontSize="11" fill="var(--ink-3)">
            {v}
          </text>
        );
      })}
      <polygon points={poly} fill="color-mix(in oklab, var(--brass) 22%, transparent)" stroke="var(--brass)" strokeWidth={2.5} strokeLinejoin="round" />
      {profile.types.map((t, i) => {
        if (t.mean === null) return null;
        const [x, y] = pt(i, t.mean);
        const isTop = top.has(t.key);
        return <circle key={t.key} cx={x} cy={y} r={isTop ? 6 : 4} fill={isTop ? 'var(--marker)' : 'var(--ink)'} />;
      })}
      {profile.types.map((t, i) => {
        const a = angle(i);
        const lx = r2(cx + Math.cos(a) * (rMax + 34));
        const ly = r2(cy + Math.sin(a) * (rMax + 30));
        const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
        const isTop = top.has(t.key);
        return (
          <g key={t.key}>
            <text x={lx} y={ly} textAnchor={anchor} fontSize="15" fontWeight={isTop ? 700 : 500} fill={isTop ? 'var(--ink)' : 'var(--ink-2)'}>
              {t.name}
            </text>
            <text x={lx} y={ly + 17} textAnchor={anchor} fontSize="12" fill="var(--ink-3)">
              {t.key} · {t.mean === null ? '—' : nf1.format(t.mean)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function InterestReport({ report }: { report: ReportContent }) {
  const p = report.interests!;
  const forStudent = report.audience === 'student';
  const sorted = [...report.sections].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="ilgi-kodu" className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-4">
          <h2 id="ilgi-kodu" className="t-h2">
            {forStudent ? 'İlgi kodun' : 'İlgi kodu'}
          </h2>
          <p className="font-display text-[clamp(3rem,8vw,4.5rem)] font-bold leading-none tracking-[0.08em]">{p.code}</p>
          <p className="text-lg">
            {p.top.map((t, i) => (
              <span key={t.key}>
                {i > 0 && (i === p.top.length - 1 ? ' ve ' : ', ')}
                <strong>{t.name}</strong>
              </span>
            ))}
          </p>
          <p className="measure text-ink-2">
            {forStudent
              ? 'Harfler, en çok hoşlandığın üç ilgi alanını büyükten küçüğe gösterir. Altıgende yan yana duran alanlar birbirine benzer.'
              : 'Harfler, çocuğunuzun en çok hoşlandığını belirttiği üç ilgi alanını büyükten küçüğe gösterir. Altıgende yan yana duran alanlar birbirine benzer.'}
          </p>
          {p.exploration && (
            <p className="notice notice-info measure">
              {forStudent
                ? 'Senin yaşında ilgiler hâlâ gelişiyor ve değişebiliyor. Bu sonucu bir karar değil, keşfe başlamak için bir yol haritası olarak düşün.'
                : 'Bu yaşta ilgiler hâlâ gelişmekte ve değişebilmektedir. Sonucu bir karar olarak değil, keşfe başlamak için bir yol haritası olarak görmenizi öneririz.'}
            </p>
          )}
        </div>
        <div className="panel flex justify-center p-4">
          <InterestHexagon profile={p} forStudent={forStudent} />
        </div>
      </section>

      {(p.flat || p.allLow || p.closeCall) && (
        <div className="notice notice-warn measure flex flex-col gap-2">
          {p.allLow && (
            <p>
              {forStudent
                ? 'Etkinliklerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu olağan bir durum: Henüz pek çok şeyi denememiş olabilirsin. Farklı etkinlikleri denedikçe ilgilerin netleşecek.'
                : 'Çocuğunuz etkinliklerin çoğundan pek hoşlanmayacağını belirtmiş. Bu durum, henüz yeterince deneyim fırsatı olmamasından ya da o dönemdeki isteksizlikten kaynaklanabilir. Farklı etkinlikleri denemesi için fırsat yaratmanızı öneririz.'}
            </p>
          )}
          {p.flat && !p.allLow && (
            <p>
              {forStudent
                ? 'Alanlar arasındaki farklar küçük; yani ilgilerin henüz belirgin bir yöne ayrışmamış. Bu senin yaşında çok olağan. En üstteki alanları denemeye başlamak iyi bir adım olur.'
                : 'Alanlar arasındaki farklar küçüktür; ilgiler henüz belirgin bir yöne ayrışmamış görünüyor. Bu yaşta olağandır. En üstteki alanlarda deneyim fırsatları yaratmak ilgilerin netleşmesine yardım eder.'}
            </p>
          )}
          {p.closeCall && <p>{p.closeCall}</p>}
        </div>
      )}

      <section aria-labelledby="ilgi-alanlari" className="flex flex-col gap-6">
        <h2 id="ilgi-alanlari" className="t-h2">
          {forStudent ? 'En belirgin ilgi alanların' : 'En belirgin ilgi alanları'}
        </h2>
        <ol className="flex flex-col gap-6">
          {p.top.map((t, i) => (
            <li key={t.key} className="panel flex flex-col gap-4 p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-brass-ink">{i + 1}</span>
                <h3 className="t-h3">
                  {t.name} <span className="t-meta font-normal">({t.key})</span>
                </h3>
              </div>
              <p className="measure">{t.text}</p>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 font-bold">{forStudent ? 'Bu alandakiler neleri sever?' : 'Bu alandaki insanlar neleri sever?'}</p>
                  <ul className="flex list-disc flex-col gap-1 pl-5 text-ink-2">
                    {t.likes.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-bold">{forStudent ? 'Keşfetmek için' : 'Keşif için öneriler'}</p>
                  <ul className="flex list-disc flex-col gap-1 pl-5 text-ink-2">
                    {t.explore.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <dl className="grid gap-2 border-t border-rule pt-4 text-[0.975rem] md:grid-cols-[8rem_1fr]">
                <dt className="font-bold">Lise</dt>
                <dd className="text-ink-2">{t.paths.lise}</dd>
                <dt className="font-bold">Üniversite</dt>
                <dd className="text-ink-2">{t.paths.universite}</dd>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      {p.occupations.length > 0 && (
        <section aria-labelledby="meslekler" className="flex flex-col gap-4">
          <h2 id="meslekler" className="t-h2">
            {forStudent ? 'Sana uyabilecek örnek meslekler' : 'Profile uyan örnek meslekler'}
          </h2>
          <p className="measure text-ink-2">
            Bu liste, meslekleri en çok hitap ettikleri ilgi alanlarına göre sınıflandıran Holland kodlarına dayanır. Kodlar yaklaşıktır ve
            liste yol göstermek içindir; bir meslek seçimi önerisi değildir.
          </p>
          <div className="overflow-x-auto rounded-xl border border-rule bg-surface">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-rule-strong text-[0.875rem] text-ink-3">
                  <th scope="col" className="px-5 py-3 font-bold">
                    Meslek
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    Holland kodu
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    Tipik eğitim
                  </th>
                </tr>
              </thead>
              <tbody className="text-[0.975rem]">
                {p.occupations.map((o) => (
                  <tr key={o.name} className="border-b border-rule last:border-0">
                    <th scope="row" className="px-5 py-3 font-bold">
                      {o.name}
                    </th>
                    <td className="tabular px-5 py-3 tracking-[0.06em]">{o.code}</td>
                    <td className="px-5 py-3 text-ink-2">{o.education}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section aria-labelledby="tum-alanlar" className="flex flex-col gap-4">
        <h2 id="tum-alanlar" className="t-h2">
          Altı alanın tamamı
        </h2>
        <p className="measure text-ink-2">
          {forStudent
            ? `Her satır bir ilgi alanını gösteriyor; puan 1 ile 5 arasında. En az ilgi duyduğun alanlar ${p.lowest.map((l) => l.name).join(' ve ')}. Bu, o alanlarda başarılı olamayacağın anlamına gelmez; yalnızca şu an o etkinlikler sana daha az çekici geliyor.`
            : `Her satır bir ilgi alanını gösterir; puan 1 ile 5 arasındadır. En düşük ilgi ${p.lowest.map((l) => l.name).join(' ve ')} alanlarındadır. Bu, bu alanlarda başarısız olunacağı anlamına gelmez; yalnızca şu an bu etkinliklerin daha az çekici geldiğini gösterir.`}
        </p>
        <div className="panel divide-y divide-rule">
          {sorted.map((s) => (
            <div key={s.scaleKey} className="grid gap-3 p-5 md:grid-cols-[13rem_1fr] md:items-center md:gap-8">
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="t-meta">{s.value === null ? 'Hesaplanamadı' : `${nf1.format(s.value)} / 5`}</p>
              </div>
              <ScaleRuler
                min={1}
                max={5}
                value={s.value}
                majorStep={1}
                minorStep={0.25}
                poles={{ low: 'Hiç hoşlanmam', high: 'Çok hoşlanırım' }}
                srLabel={`${s.name}: ${s.valueLabel}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
