import Link from 'next/link';
import { closeAssignmentAction, deleteClassAction, setClassTeacherAction } from '@/app/okul/actions';
import { publicInstruments } from '@/content/instruments';
import { GRADE_LABELS } from '@/lib/config';
import { requireClass, requireOrg } from '@/lib/school/access';
import { assignmentStatusMap, classAssignmentProgress, classRoster, classTeacherList, orgMembers } from '@/lib/school/queries';
import { AssignForm, ConsentRequestForm } from './forms';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });

function ConsentChip({ r }: { r: { consent: boolean; lastDecision: string | null; lastRequestAt: Date | null; guardianEmail: string | null } }) {
  if (r.consent) return <span className="chip chip-ok">Verildi</span>;
  if (r.lastDecision === 'declined') return <span className="chip">Verilmedi</span>;
  if (r.lastDecision === 'revoked') return <span className="chip">Geri alındı</span>;
  if (r.lastRequestAt) return <span className="chip chip-brass">Bekleniyor · {dateFmt.format(new Date(r.lastRequestAt))}</span>;
  if (!r.guardianEmail) return <span className="chip">E-posta yok</span>;
  return <span className="chip">İstenmedi</span>;
}

export default async function ClassPage(props: PageProps<'/okul/[slug]/sinif/[classId]'>) {
  const { slug, classId } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireOrg(slug);
  const cls = await requireClass(ctx, classId);
  const [roster, progress, statusMap, teachers, members] = await Promise.all([
    ctx.can.seeRoster ? classRoster(classId) : Promise.resolve([]),
    classAssignmentProgress(classId),
    ctx.can.seeRoster ? assignmentStatusMap(classId) : Promise.resolve(new Map<string, 'done' | 'started'>()),
    classTeacherList(classId),
    ctx.can.manageClasses ? orgMembers(ctx.org.id) : Promise.resolve([]),
  ]);
  const open = progress.filter((p) => !p.closedAt);
  const closed = progress.filter((p) => p.closedAt);
  const tests = publicInstruments()
    .filter((t) => cls.grade >= t.minGrade && cls.grade <= t.maxGrade && !open.some((o) => o.slug === t.slug))
    .map((t) => ({ slug: t.slug, name: t.name, minutes: t.estimatedMinutes }));
  const consented = roster.filter((r) => r.consent).length;
  const withCode = roster.filter((r) => r.loginCodeIssuedAt).length;
  const teacherIds = new Set(teachers.map((t) => t.userId));
  const addable = [...new Map(members.filter((m) => !teacherIds.has(m.userId)).map((m) => [m.userId, m])).values()];
  const base = `/okul/${slug}/sinif/${classId}`;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Link href={`/okul/${slug}`} className="t-small">
          Sınıflar
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="t-h1">{cls.name}</h1>
            <p className="mt-1 text-ink-2">
              {GRADE_LABELS[cls.grade]} · {cls.academicYear}
            </p>
          </div>
        </div>
        {q.yeni === '1' && <p className="notice notice-ok">Sınıf oluşturuldu. Şimdi öğrenci listesini aktarabilirsiniz.</p>}
        {q.hata === 'silme-onayi' && <p className="notice notice-danger">Sınıfı silmek için kutuya sınıfın adını aynen yazın.</p>}
      </div>

      {ctx.can.seeRoster && (
        <section aria-labelledby="ogrenciler" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="ogrenciler" className="t-h2">
                Öğrenciler
              </h2>
              <p className="t-meta tabular mt-1">
                {roster.length} öğrenci · {consented} veli onayı · {withCode} giriş kodu
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {ctx.can.manageClasses && (
                <Link href={`${base}/aktar`} className="btn btn-secondary">
                  Öğrenci aktar
                </Link>
              )}
              {ctx.can.issueCodes && roster.length > 0 && (
                <Link href={`${base}/kodlar`} className="btn btn-secondary">
                  Giriş kodları
                </Link>
              )}
            </div>
          </div>
          {roster.length === 0 ? (
            <div className="panel flex flex-col items-start gap-3 p-6">
              <p>Bu sınıfta henüz öğrenci yok.</p>
              {ctx.can.manageClasses && (
                <Link href={`${base}/aktar`} className="btn btn-primary">
                  Öğrenci listesini aktar
                </Link>
              )}
            </div>
          ) : (
            <>
              {ctx.can.sendConsent && consented < roster.length && (
                <div className="panel flex flex-col gap-3 p-5">
                  <p className="font-bold">Veli onayı</p>
                  <p className="t-small text-ink-2">
                    Veli e-postası kayıtlı ve henüz onay vermemiş velilere, aydınlatma metni ile açık rıza metnini içeren bir bağlantı gönderilir.
                    Aynı veliye üç gün içinde tekrar gönderilmez.
                  </p>
                  <ConsentRequestForm slug={slug} classId={classId} />
                </div>
              )}
              <div className="overflow-x-auto rounded-xl border border-rule bg-surface">
                <table className="w-full min-w-[40rem] border-collapse text-left text-[0.95rem]">
                  <thead>
                    <tr className="border-b border-rule-strong text-[0.8125rem] text-ink-3">
                      <th scope="col" className="px-4 py-3 font-bold">
                        Öğrenci
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        No
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Veli onayı
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Giriş kodu
                      </th>
                      {open.map((a) => (
                        <th key={a.id} scope="col" className="px-3 py-3 font-bold" title={a.name}>
                          {a.shortName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((r) => (
                      <tr key={r.id} className="border-b border-rule last:border-0">
                        <th scope="row" className="px-4 py-3 font-bold">
                          {ctx.can.seeIndividual ? (
                            <Link href={`/okul/${slug}/ogrenci/${r.id}?sinif=${classId}`}>
                              {r.firstName} {r.lastName ?? ''}
                            </Link>
                          ) : (
                            <>
                              {r.firstName} {r.lastName ?? ''}
                            </>
                          )}
                        </th>
                        <td className="tabular px-4 py-3 text-ink-2">{r.schoolStudentNo ?? '—'}</td>
                        <td className="px-4 py-3">
                          <ConsentChip r={r} />
                        </td>
                        <td className="px-4 py-3 text-ink-2">{r.loginCodeIssuedAt ? 'Var' : 'Yok'}</td>
                        {open.map((a) => {
                          const st = statusMap.get(`${r.id}:${a.id}`);
                          return (
                            <td key={a.id} className="px-3 py-3">
                              {st === 'done' ? (
                                <span className="font-bold text-ok" aria-label="tamamladı">
                                  ✓
                                </span>
                              ) : st === 'started' ? (
                                <span className="text-brass-ink" aria-label="devam ediyor">
                                  ◐
                                </span>
                              ) : (
                                <span className="text-ink-3" aria-label="başlamadı">
                                  –
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {open.length > 0 && <p className="t-meta">✓ tamamladı · ◐ başladı, bitirmedi · – başlamadı</p>}
            </>
          )}
        </section>
      )}

      <section aria-labelledby="testler" className="flex flex-col gap-5">
        <h2 id="testler" className="t-h2">
          Atanan testler
        </h2>
        {open.length === 0 ? (
          <p className="text-ink-2">Bu sınıfa atanmış açık bir test yok.</p>
        ) : (
          <ul className="panel divide-y divide-rule">
            {open.map((a) => {
              const pct = a.students ? Math.round((a.completed / a.students) * 100) : 0;
              return (
                <li key={a.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex flex-col gap-2">
                    <p className="font-display text-xl font-bold">{a.name}</p>
                    <p className="t-meta">
                      {dateFmt.format(a.createdAt)} tarihinde atandı{a.dueAt ? ` · son gün ${dateFmt.format(a.dueAt)}` : ''}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-40 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                        <span className="block h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="t-small tabular">
                        {a.completed}/{a.students} tamamladı{a.started ? ` · ${a.started} devam ediyor` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {ctx.can.seeGroupReports &&
                      (a.completed >= ctx.org.minGroupSize ? (
                        <Link href={`${base}/grup/${a.slug}`} className="btn btn-secondary">
                          Grup raporu
                        </Link>
                      ) : (
                        <span className="t-meta">Grup raporu en az {ctx.org.minGroupSize} öğrenci tamamlayınca açılır</span>
                      ))}
                    {ctx.can.assign && (
                      <form action={closeAssignmentAction.bind(null, slug, classId)}>
                        <input type="hidden" name="assignmentId" value={a.id} />
                        <button type="submit" className="btn btn-quiet">
                          Atamayı kapat
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {ctx.can.assign && tests.length > 0 && (
          <div className="panel flex flex-col gap-3 p-5 md:p-6">
            <p className="font-bold">Yeni test ata</p>
            <p className="t-small text-ink-2">Yalnızca bu sınıf düzeyine uygun testler listelenir. Öğrenciler kendi kodlarıyla giriş yaptıklarında testi görür.</p>
            <AssignForm slug={slug} classId={classId} tests={tests} />
          </div>
        )}
        {closed.length > 0 && (
          <details className="panel p-5">
            <summary className="cursor-pointer font-bold">Kapatılan atamalar ({closed.length})</summary>
            <ul className="mt-3 flex flex-col gap-2">
              {closed.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    {a.name} <span className="t-meta">· {dateFmt.format(a.createdAt)}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="t-small tabular">
                      {a.completed}/{a.students} tamamladı
                    </span>
                    {ctx.can.seeGroupReports && a.completed >= ctx.org.minGroupSize && (
                      <Link href={`${base}/grup/${a.slug}`} className="t-small">
                        Grup raporu
                      </Link>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {ctx.can.manageClasses && (
        <section aria-labelledby="ogretmenler" className="flex flex-col gap-4">
          <h2 id="ogretmenler" className="t-h2">
            Sınıfın öğretmenleri
          </h2>
          <p className="measure text-ink-2">
            Burada eklenen öğretmenler bu sınıfın grup raporlarını görebilir. Bireysel sonuç göremezler.
          </p>
          {teachers.length > 0 && (
            <ul className="panel divide-y divide-rule">
              {teachers.map((t) => (
                <li key={t.userId} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <span>
                    <span className="font-bold">{t.fullName}</span> <span className="t-meta">{t.email}</span>
                  </span>
                  <form action={setClassTeacherAction.bind(null, slug, classId)}>
                    <input type="hidden" name="userId" value={t.userId} />
                    <input type="hidden" name="remove" value="1" />
                    <button type="submit" className="btn btn-quiet">
                      Çıkar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          {addable.length > 0 ? (
            <form action={setClassTeacherAction.bind(null, slug, classId)} className="flex flex-wrap items-end gap-3">
              <div className="field min-w-[16rem]">
                <label htmlFor="userId" className="field-label">
                  Ekipten öğretmen ekle
                </label>
                <select id="userId" name="userId" className="input" required defaultValue="">
                  <option value="" disabled>
                    Seçin
                  </option>
                  {addable.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.fullName} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-secondary">
                Ekle
              </button>
            </form>
          ) : (
            teachers.length === 0 && (
              <p className="t-small text-ink-2">
                Önce öğretmenleri {ctx.can.manageMembers ? <Link href={`/okul/${slug}/ekip`}>ekip sayfasından</Link> : 'okul yöneticisinin ekip sayfasından'}{' '}
                davet edin.
              </p>
            )
          )}
        </section>
      )}

      {ctx.can.manageClasses && (
        <details className="panel p-6">
          <summary className="cursor-pointer font-bold text-danger">Sınıfı sil</summary>
          <form action={deleteClassAction.bind(null, slug, classId)} className="mt-4 flex flex-col gap-4">
            <p className="measure">
              Sınıf, öğrenci listesi ve atamalar silinir. Öğrenci kayıtları ve tamamlanmış sonuçlar silinmez. Onaylamak için kutuya sınıfın adını (
              <strong>{cls.name}</strong>) yazın.
            </p>
            <input name="confirm" className="input max-w-48" aria-label="Onay" autoComplete="off" />
            <div>
              <button type="submit" className="btn btn-danger">
                Sınıfı sil
              </button>
            </div>
          </form>
        </details>
      )}
    </div>
  );
}
