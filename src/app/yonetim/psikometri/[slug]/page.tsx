import Link from 'next/link';
import { notFound } from 'next/navigation';
import { plainMath } from '@/components/quiz/math-text';
import { requireAdmin } from '@/lib/auth/dal';
import { GRADE_LABELS, gradeRangeLabel } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import {
  NORM_MIN_N,
  RATING_LABELS,
  THRESHOLDS,
  normSizeRating,
  reliabilityRating,
  type DichotomousStat,
  type LikertScaleStat,
  type Rating,
} from '@/lib/psychometrics/analysis';
import { normSetsFor } from '@/lib/psychometrics/data';
import { labReport, likertNormPreview, type TaskScaleStat } from '@/lib/psychometrics/lab';
import { deleteNormSetAction, setNormActiveAction } from '../actions';
import { NormCreateForm, PublishedNormForm } from './norm-form';

const nf = new Intl.NumberFormat('tr-TR');
const f2 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const f1 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const r2 = (x: number | null | undefined) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : f2.format(x));
const pct = (x: number) => `%${Math.round(x * 100)}`;

const RATING_CHIP: Record<Rating, string> = {
  inadequate: 'chip chip-danger',
  adequate: 'chip chip-brass',
  good: 'chip chip-ok',
  excellent: 'chip chip-ok',
};

const NORM_MESSAGES: Record<string, { ok: boolean; text: string }> = {
  olusturuldu: { ok: true, text: 'Norm grubu oluşturuldu. Gözden geçirip etkinleştirebilirsiniz.' },
  etkin: { ok: true, text: 'Norm etkinleştirildi. Bundan sonra tamamlanan uygulamalar bu normla puanlanacak.' },
  kapali: { ok: true, text: 'Norm kapatıldı. Yeni uygulamalar ölçeğin kendi aralığıyla yorumlanacak.' },
  silindi: { ok: true, text: 'Norm grubu silindi.' },
  silinemez: { ok: false, text: 'Etkin ya da puanlamada kullanılmış bir norm grubu silinemez; önce kapatın. Kullanılmış normlar iz sürülebilirlik için saklanır.' },
};

function Rel({ value, label = 'α' }: { value: number | null; label?: string }) {
  if (value === null) return <span className="t-meta">{label} hesaplanamadı</span>;
  const r = reliabilityRating(value);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="tabular font-bold">
        {label} = {r2(value)}
      </span>
      <span className={RATING_CHIP[r]}>{RATING_LABELS[r]}</span>
    </span>
  );
}

function Flags({ flags }: { flags: string[] }) {
  if (!flags.length) return null;
  return (
    <ul className="flex flex-col gap-0.5">
      {flags.map((f) => (
        <li key={f} className="t-meta text-danger">
          {f}
        </li>
      ))}
    </ul>
  );
}

export default async function LabPage(props: PageProps<'/yonetim/psikometri/[slug]'>) {
  await requireAdmin();
  const { slug } = await props.params;
  const q = await props.searchParams;
  const report = await labReport(slug);
  if (!report) notFound();
  const s = report.sample;
  const normMsg = typeof q.norm === 'string' ? NORM_MESSAGES[q.norm] : undefined;

  // Norm önizlemesi (yalnızca likert): ?onizleme=5-8
  const isLikert = report.engine === 'likert';
  const pm = typeof q.onizleme === 'string' ? /^(\d{1,2})-(\d{1,2})$/.exec(q.onizleme) : null;
  const pMin = pm ? Math.min(Number(pm[1]), Number(pm[2])) : null;
  const pMax = pm ? Math.max(Number(pm[1]), Number(pm[2])) : null;
  const [sets, preview] = await Promise.all([
    isLikert ? normSetsFor(report.versionId) : Promise.resolve([]),
    isLikert && pMin !== null && pMax !== null && pMin >= 1 && pMax <= 13 ? likertNormPreview(slug, pMin, pMax) : Promise.resolve(null),
  ]);
  const scaleName = new Map(report.def.scales.map((x) => [x.key, x.name]));
  const likertDef = report.engine === 'likert' ? (report.def as LikertInstrument) : null;
  const likertScales = likertDef
    ? likertDef.scales.map((sc) => {
        const vals = likertDef.options.map((o) => o.value);
        const k = likertDef.items.filter((i) => i.scale === sc.key).length;
        const isMean = likertDef.scoring.method === 'mean';
        return { key: sc.key, name: sc.name, min: isMean ? Math.min(...vals) : Math.min(...vals) * k, max: isMean ? Math.max(...vals) : Math.max(...vals) * k };
      })
    : [];
  const grades = s.byGrade.map((g) => g.grade);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Link href="/yonetim/psikometri" className="t-small">
          Psikometri
        </Link>
        <h1 className="t-h1">{report.name}</h1>
        <p className="text-ink-2">
          Sürüm {report.version} · analiz {dateFmt.format(new Date())} tarihindeki verilerle
        </p>
      </div>

      <section aria-labelledby="orneklem" className="flex flex-col gap-4">
        <h2 id="orneklem" className="t-h2">
          Örneklem
        </h2>
        <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ['Tamamlanan uygulama (tümü)', s.totalAttempts],
              ['Araştırma rızalı ilk uygulama', s.consented],
              ['Geçerlik uyarısı nedeniyle dışarıda', s.flagged],
              ['Analize giren', s.used],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="bg-surface p-5">
              <dt className="t-meta">{label}</dt>
              <dd className="font-display text-3xl font-bold tabular">{nf.format(value)}</dd>
            </div>
          ))}
        </dl>
        {s.used > 0 && (
          <p className="t-small text-ink-2">
            Sınıflar: {s.byGrade.map((g) => `${GRADE_LABELS[g.grade] ?? g.grade} (${g.n})`).join(', ')} · Kız {s.byGender.female}, erkek{' '}
            {s.byGender.male}, belirtilmemiş {s.byGender.unknown}
          </p>
        )}
        {s.used < THRESHOLDS.minStableN && (
          <p className="notice notice-warn">
            Analize giren uygulama sayısı {THRESHOLDS.minStableN}’dan az. Aşağıdaki korelasyon ve güvenirlik değerleri bu kadar az veriyle
            kararsızdır; yalnızca ön fikir verir.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <a href={`/yonetim/psikometri/${slug}/csv`} className="btn btn-secondary">
            Veriyi indir (CSV)
          </a>
          <a href={`/yonetim/psikometri/${slug}/csv?bicim=excel`} className="btn btn-quiet">
            Excel için (noktalı virgüllü)
          </a>
          <a href={`/yonetim/psikometri/${slug}/sozluk`} className="btn btn-quiet">
            Değişken sözlüğü
          </a>
        </div>
        <p className="t-meta measure">
          Dosyada ad, okul ya da kimlik numarası yoktur: her öğrenciye bu dosyaya özgü rastgele bir katılımcı kodu verilir. Dosya yalnızca
          araştırma rızalı verileri içerir; her indirme denetim kaydına yazılır.
        </p>
      </section>

      {report.engine === 'likert' && <LikertView scales={report.scales} def={report.def as LikertInstrument} />}
      {report.engine === 'quiz' &&
        report.forms.map((f) => (
          <DichotomousView
            key={f.key}
            id={`form-${f.key}`}
            title={`${GRADE_LABELS[f.grade] ?? f.grade} formu`}
            subtitle={`${f.contentGrade}. sınıf konuları · ${f.k} soru`}
            stat={f}
            math
          />
        ))}
      {report.engine === 'reading' &&
        report.passages.map((p) => (
          <DichotomousView key={p.key} id={`metin-${p.key}`} title={p.title} subtitle={`${gradeRangeLabel(p.minGrade, p.maxGrade)} · ${p.k} soru`} stat={p} />
        ))}
      {report.engine === 'tasks' && <TasksView tasks={report.tasks} />}

      {isLikert && (
        <section id="normlar" aria-labelledby="normlar-baslik" className="flex scroll-mt-6 flex-col gap-5">
          <h2 id="normlar-baslik" className="t-h2">
            Normlar
          </h2>
          {normMsg && (
            <p className={`notice ${normMsg.ok ? 'notice-ok' : 'notice-danger'}`} role="status">
              {normMsg.text}
            </p>
          )}
          <p className="measure text-ink-2">
            Norm, bir öğrencinin puanını aynı sınıf düzeyindeki öğrencilerle karşılaştırmayı sağlar. Norm grubu en az{' '}
            {NORM_MIN_N.provisional} öğrenciden oluşmalıdır (EFPA ölçütünde “yeterli”). Platform verisinden yalnızca ön norm oluşturulur;
            kesin norm, temsilî bir örneklem çalışmasının yayımlanmış istatistikleri girilerek kaydedilir. Yüzdelikler normal dağılım varsayımıyla
            hesaplanır.
          </p>
          {sets.length > 0 && (
            <ul className="panel divide-y divide-rule">
              {sets.map((set) => (
                <li key={set.id} className="flex flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold">
                        {set.name} {set.isActive && <span className="chip chip-ok ml-1 align-middle">Etkin</span>}
                      </p>
                      <p className="t-meta">
                        {gradeRangeLabel(set.gradeMin, set.gradeMax)} · {nf.format(set.n)} öğrenci ({RATING_LABELS[normSizeRating(set.n)].toLocaleLowerCase('tr-TR')}) ·{' '}
                        {set.status === 'final' ? 'kesin norm' : 'ön norm'} · {dateFmt.format(set.createdAt)}
                      </p>
                      <p className="t-small text-ink-2">{set.source}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <form action={setNormActiveAction.bind(null, slug)}>
                        <input type="hidden" name="normSetId" value={set.id} />
                        <input type="hidden" name="active" value={set.isActive ? '0' : '1'} />
                        <button type="submit" className={set.isActive ? 'btn btn-secondary min-h-10' : 'btn btn-primary min-h-10'}>
                          {set.isActive ? 'Kapat' : 'Etkinleştir'}
                        </button>
                      </form>
                      {!set.isActive && (
                        <form action={deleteNormSetAction.bind(null, slug)}>
                          <input type="hidden" name="normSetId" value={set.id} />
                          <button type="submit" className="btn btn-quiet min-h-10">
                            Sil
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[30rem] border-collapse text-left text-[0.9rem]">
                      <thead>
                        <tr className="text-ink-2">
                          <th className="py-1.5 pr-4 font-bold">Ölçek</th>
                          <th className="py-1.5 pr-4 text-right font-bold">n</th>
                          <th className="py-1.5 pr-4 text-right font-bold">Ortalama</th>
                          <th className="py-1.5 pr-4 text-right font-bold">Standart sapma</th>
                          <th className="py-1.5 text-right font-bold">α</th>
                        </tr>
                      </thead>
                      <tbody>
                        {set.stats.map((st) => (
                          <tr key={st.scaleKey} className="border-t border-rule">
                            <td className="py-1.5 pr-4">{scaleName.get(st.scaleKey) ?? st.scaleKey}</td>
                            <td className="py-1.5 pr-4 text-right tabular">{nf.format(st.n)}</td>
                            <td className="py-1.5 pr-4 text-right tabular">{r2(st.mean)}</td>
                            <td className="py-1.5 pr-4 text-right tabular">{r2(st.sd)}</td>
                            <td className="py-1.5 text-right tabular">{r2(st.reliability)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="panel flex flex-col gap-5 p-6">
            <h3 className="t-h3">Platform verisinden ön norm</h3>
            <form className="flex flex-wrap items-end gap-3" action={`/yonetim/psikometri/${slug}#normlar`}>
              <div className="field">
                <label htmlFor="onizleme" className="field-label">
                  Sınıf aralığı
                </label>
                <select id="onizleme" name="onizleme" className="input" defaultValue={pm ? `${pMin}-${pMax}` : ''}>
                  <option value="" disabled>
                    Seçin
                  </option>
                  {rangeOptions(grades, report.def.minGrade, report.def.maxGrade).map(([a, b]) => (
                    <option key={`${a}-${b}`} value={`${a}-${b}`}>
                      {gradeRangeLabel(a, b)}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-secondary">
                Önizle
              </button>
            </form>
            {preview && pMin !== null && pMax !== null && (
              <div className="flex flex-col gap-4">
                <p>
                  <span className="font-bold">{gradeRangeLabel(pMin, pMax)}</span> · {nf.format(preview.n)} öğrenci ·{' '}
                  <span className={RATING_CHIP[normSizeRating(preview.n)]}>{RATING_LABELS[normSizeRating(preview.n)]}</span>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[38rem] border-collapse text-left text-[0.9rem]">
                    <thead>
                      <tr className="text-ink-2">
                        <th className="py-1.5 pr-4 font-bold">Ölçek</th>
                        <th className="py-1.5 pr-4 text-right font-bold">n</th>
                        <th className="py-1.5 pr-4 text-right font-bold">Ortalama</th>
                        <th className="py-1.5 pr-4 text-right font-bold">S. sapma</th>
                        <th className="py-1.5 pr-4 text-right font-bold">Çarpıklık</th>
                        <th className="py-1.5 pr-4 text-right font-bold">α</th>
                        <th className="py-1.5 font-bold">Not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.scales.map((p) => (
                        <tr key={p.scaleKey} className="border-t border-rule align-top">
                          <td className="py-1.5 pr-4">{p.name}</td>
                          <td className="py-1.5 pr-4 text-right tabular">{nf.format(p.n)}</td>
                          <td className="py-1.5 pr-4 text-right tabular">{r2(p.mean)}</td>
                          <td className="py-1.5 pr-4 text-right tabular">{r2(p.sd)}</td>
                          <td className="py-1.5 pr-4 text-right tabular">{r2(p.skew)}</td>
                          <td className="py-1.5 pr-4 text-right tabular">{r2(p.alpha)}</td>
                          <td className="py-1.5">
                            <Flags flags={p.flags} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {preview.n >= NORM_MIN_N.provisional ? (
                  <NormCreateForm slug={slug} gradeMin={pMin} gradeMax={pMax} />
                ) : (
                  <p className="notice notice-info">
                    Norm grubu oluşturmak için bu aralıkta en az {NORM_MIN_N.provisional} öğrenci gerekiyor. Şu anda {nf.format(preview.n)} öğrenci
                    var.
                  </p>
                )}
              </div>
            )}
          </div>
          <details className="panel p-6">
            <summary className="cursor-pointer font-bold">Yayımlanmış bir norm çalışmasını gir (kesin norm)</summary>
            <div className="mt-4 flex flex-col gap-4">
              <p className="t-small measure text-ink-2">
                Temsilî bir Türkiye örnekleminde yapılmış bir çalışmanın ortalama ve standart sapmalarını girin. Değerler raporlamadaki puan
                ölçeğinde olmalıdır: {likertDef?.scoring.method === 'mean' ? 'madde ortalaması' : 'toplam puan (ters maddeler çevrilmiş)'}.
              </p>
              {likertDef && <PublishedNormForm slug={slug} scales={likertScales} grades={[report.def.minGrade, Math.min(report.def.maxGrade, 12)]} />}
            </div>
          </details>
        </section>
      )}
    </div>
  );
}

/** Önizleme için sınıf aralığı seçenekleri: tek tek sınıflar ve testin bütün aralığı. */
function rangeOptions(grades: number[], min: number, max: number): [number, number][] {
  const out: [number, number][] = [];
  const all = new Set<number>();
  for (let g = min; g <= max; g++) all.add(g);
  for (const g of grades) all.add(g);
  const list = [...all].filter((g) => g >= 1 && g <= 13).sort((a, b) => a - b);
  for (const g of list) out.push([g, g]);
  for (let i = 0; i < list.length - 1; i++) out.push([list[i], list[i + 1]]);
  if (list.length > 2) out.push([list[0], list[list.length - 1]]);
  return out;
}

function LikertView({ scales, def }: { scales: LikertScaleStat[]; def: LikertInstrument }) {
  return (
    <section aria-labelledby="maddeler" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 id="maddeler" className="t-h2">
          Güvenirlik ve madde analizi
        </h2>
        <p className="t-small measure text-ink-2">
          Alfa ve madde-toplam korelasyonları, ters maddeler çevrildikten sonra ölçeğin bütün maddelerini cevaplayan öğrencilerle hesaplanır.
          Düzeltilmiş madde-toplam korelasyonu {f2.format(THRESHOLDS.discrimination)}’nin altındaki maddeler işaretlenir.
        </p>
      </div>
      {scales.map((sc) => (
        <div key={sc.key} className="panel flex flex-col gap-4 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="t-h3">{sc.name}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Rel value={sc.alpha} />
              <span className="t-meta">
                {sc.nItems} madde · {nf.format(sc.nComplete)} tam cevaplı kişi
              </span>
            </div>
          </div>
          <Flags flags={sc.flags} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left text-[0.9rem]">
              <thead>
                <tr className="text-ink-2">
                  <th className="py-2 pr-3 font-bold">Madde</th>
                  <th className="py-2 pr-3 text-right font-bold">n</th>
                  <th className="py-2 pr-3 text-right font-bold">Ort.</th>
                  <th className="py-2 pr-3 text-right font-bold">S.s.</th>
                  <th className="py-2 pr-3 font-bold">Dağılım ({def.options.map((o) => o.value).join('·')})</th>
                  <th className="py-2 pr-3 text-right font-bold">r (düz.)</th>
                  <th className="py-2 pr-3 text-right font-bold">Çıkınca α</th>
                </tr>
              </thead>
              <tbody>
                {sc.items.map((it) => (
                  <tr key={it.key} className="border-t border-rule align-top">
                    <td className="max-w-[26rem] py-2 pr-3">
                      <span className="font-mono text-[0.8rem] text-ink-3">{it.key}</span> {it.text}
                      {it.reverse && <span className="chip ml-1">ters</span>}
                      <Flags flags={it.flags} />
                    </td>
                    <td className="py-2 pr-3 text-right tabular">{nf.format(it.n)}</td>
                    <td className="py-2 pr-3 text-right tabular">{r2(it.mean)}</td>
                    <td className="py-2 pr-3 text-right tabular">{r2(it.sd)}</td>
                    <td className="py-2 pr-3">
                      <DistBar dist={it.dist} />
                    </td>
                    <td className={`py-2 pr-3 text-right tabular ${it.citc !== null && it.citc < THRESHOLDS.discrimination ? 'font-bold text-danger' : ''}`}>{r2(it.citc)}</td>
                    <td className="py-2 pr-3 text-right tabular">{r2(it.alphaIfDeleted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}

function DistBar({ dist }: { dist: number[] }) {
  return (
    <span className="flex items-end gap-0.5" role="img" aria-label={dist.map((d) => pct(d)).join(', ')}>
      {dist.map((d, i) => (
        <span key={i} className="flex w-7 flex-col items-center gap-0.5">
          <span className="block w-full rounded-sm bg-ink" style={{ height: `${Math.max(2, Math.round(d * 28))}px`, opacity: 0.35 + d * 0.65 }} />
          <span className="text-[0.7rem] tabular text-ink-3">{Math.round(d * 100)}</span>
        </span>
      ))}
    </span>
  );
}

function DichotomousView({ id, title, subtitle, stat, math }: { id: string; title: string; subtitle: string; stat: DichotomousStat; math?: boolean }) {
  return (
    <section aria-labelledby={id} className="panel flex flex-col gap-4 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id={id} className="t-h3">
            {title}
          </h2>
          <p className="t-meta">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Rel value={stat.kr20} label="KR-20" />
          <span className="t-meta tabular">
            n = {nf.format(stat.n)}
            {stat.meanCorrect !== null && ` · ortalama ${f1.format(stat.meanCorrect)} doğru`}
            {stat.sdCorrect !== null && ` · s.s. ${f1.format(stat.sdCorrect)}`}
            {stat.sem !== null && ` · ölçme hatası ${f1.format(stat.sem)}`}
          </span>
        </div>
      </div>
      {stat.n === 0 ? (
        <p className="text-ink-2">Bu form için henüz veri yok.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] border-collapse text-left text-[0.9rem]">
            <thead>
              <tr className="text-ink-2">
                <th className="py-2 pr-3 font-bold">Soru</th>
                <th className="py-2 pr-3 text-right font-bold">p</th>
                <th className="py-2 pr-3 text-right font-bold">r (düz.)</th>
                <th className="py-2 pr-3 text-right font-bold">D</th>
                <th className="py-2 pr-3 font-bold">Seçenekler (anahtar kalın · çeldirici r)</th>
              </tr>
            </thead>
            <tbody>
              {stat.items.map((it) => (
                <tr key={it.key} className="border-t border-rule align-top">
                  <td className="max-w-[24rem] py-2 pr-3">
                    <span className="font-bold tabular">{it.no}.</span> <span className="t-meta">{it.group}</span>
                    <span className="block text-[0.85rem] text-ink-2">{truncate(math ? plainMath(it.text) : it.text, 110)}</span>
                    <Flags flags={it.flags} />
                  </td>
                  <td className="py-2 pr-3 text-right tabular">{r2(it.p)}</td>
                  <td className={`py-2 pr-3 text-right tabular ${it.pbis !== null && it.pbis < THRESHOLDS.discrimination ? 'font-bold text-danger' : ''}`}>{r2(it.pbis)}</td>
                  <td className="py-2 pr-3 text-right tabular">{r2(it.d)}</td>
                  <td className="py-2 pr-3">
                    <span className="flex flex-wrap gap-x-3 gap-y-1">
                      {it.choices.map((c) => (
                        <span key={c.key} className={`tabular ${c.isKey ? 'font-bold' : 'text-ink-2'}`} title={c.note}>
                          {c.label} {pct(c.share)}
                          {!c.isKey && c.share > 0 && c.pbis !== null && <span className="text-[0.75rem] text-ink-3"> ({r2(c.pbis)})</span>}
                        </span>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function TasksView({ tasks }: { tasks: TaskScaleStat[] }) {
  return (
    <section aria-labelledby="gorevler" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 id="gorevler" className="t-h2">
          Görev puanları
        </h2>
        <p className="t-small measure text-ink-2">
          Sınıf düzeyine göre betimsel istatistikler. Güvenirliğin nasıl hesaplandığı ya da neden hesaplanmadığı her puanın altında yazılıdır:
          yarılama yalnızca denemeleri ya da bölümleri ayrı ayrı puanlanabilen görevlerde yapılır; tek süreli ve uyarlamalı görevler için test-tekrar
          test çalışması gerekir.
        </p>
      </div>
      {tasks.map((t) => (
        <div key={t.key} className="panel flex flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="t-h3">{t.name}</h3>
            <div className="flex flex-wrap gap-4">
              {t.splitHalf.map((sh) => (
                <span key={sh.label} className="inline-flex flex-wrap items-center gap-2">
                  <span className="t-meta">{sh.label}:</span>
                  <Rel value={sh.r} label="r" />
                  <span className="t-meta tabular">n = {nf.format(sh.n)}</span>
                </span>
              ))}
            </div>
          </div>
          {t.note && <p className="t-meta">{t.note}</p>}
          {t.byGrade.length === 0 ? (
            <p className="text-ink-2">Henüz veri yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-left text-[0.9rem]">
                <thead>
                  <tr className="text-ink-2">
                    <th className="py-1.5 pr-4 font-bold">Sınıf</th>
                    <th className="py-1.5 pr-4 text-right font-bold">n</th>
                    <th className="py-1.5 pr-4 text-right font-bold">Ortalama ({t.unit})</th>
                    <th className="py-1.5 pr-4 text-right font-bold">S. sapma</th>
                    <th className="py-1.5 text-right font-bold">Ortanca</th>
                  </tr>
                </thead>
                <tbody>
                  {t.byGrade.map((g) => (
                    <tr key={g.grade} className="border-t border-rule">
                      <td className="py-1.5 pr-4">{GRADE_LABELS[g.grade] ?? g.grade}</td>
                      <td className="py-1.5 pr-4 text-right tabular">{nf.format(g.n)}</td>
                      <td className="py-1.5 pr-4 text-right tabular">{g.mean === null ? '—' : f1.format(g.mean)}</td>
                      <td className="py-1.5 pr-4 text-right tabular">{g.sd === null ? '—' : f1.format(g.sd)}</td>
                      <td className="py-1.5 text-right tabular">{g.median === null ? '—' : f1.format(g.median)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
