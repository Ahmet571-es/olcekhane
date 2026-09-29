import Link from 'next/link';
import { notFound } from 'next/navigation';
import { removeMemberAction, revokeInviteAction } from '@/app/okul/actions';
import { ROLE_LABELS, requireOrg, type OrgRole } from '@/lib/school/access';
import { pendingInvites } from '@/lib/school/invites';
import { orgMembers, orgTeacherClasses } from '@/lib/school/queries';
import { InviteForm } from './invite-form';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const ROLE_ORDER: OrgRole[] = ['org_admin', 'counselor', 'teacher'];

const WHO_SEES: [string, string, string, string][] = [
  ['Ekibi ve sınıfları yönetmek', 'Evet', 'Sınıfları', 'Hayır'],
  ['Öğrenci listesi ve katılım', 'Evet', 'Evet', 'Hayır'],
  ['Veli onayı istemek', 'Hayır', 'Evet', 'Hayır'],
  ['Öğrenci giriş kodu üretmek', 'Hayır', 'Evet', 'Hayır'],
  ['Test atamak', 'Hayır', 'Evet', 'Hayır'],
  ['Bireysel raporlar', 'Hayır', 'Evet', 'Hayır'],
  ['Sınıf grup özetleri (en az 5 öğrenci)', 'Hayır', 'Evet', 'Kendi sınıfları'],
];

export default async function TeamPage(props: PageProps<'/okul/[slug]/ekip'>) {
  const { slug } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageMembers) notFound();
  const [rows, invites, teacherClasses] = await Promise.all([orgMembers(ctx.org.id), pendingInvites(ctx.org.id), orgTeacherClasses(ctx.org.id)]);

  // Aynı kişinin birden çok görevi tek satırda gösterilir.
  const people = new Map<string, { userId: string; fullName: string; email: string; roles: { role: OrgRole; membershipId: string }[] }>();
  for (const r of rows) {
    const p = people.get(r.userId) ?? { userId: r.userId, fullName: r.fullName, email: r.email, roles: [] };
    p.roles.push({ role: r.role, membershipId: r.membershipId });
    people.set(r.userId, p);
  }
  const list = [...people.values()].map((p) => ({ ...p, roles: p.roles.sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)) }));

  return (
    <div className="flex flex-col gap-10">
      {q.hata === 'son-yonetici' && (
        <p className="notice notice-danger" role="alert">
          Okulun tek yöneticisini ekipten çıkaramazsınız. Önce başka birini okul yöneticisi olarak davet edin; davet kabul edilince bu görevi
          kaldırabilirsiniz.
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Link href={`/okul/${slug}`} className="t-small">
          {ctx.org.name}
        </Link>
        <h1 className="t-h1">Ekip</h1>
        <p className="measure text-ink-2">
          Okulunuzda Ölçekhane’yi kullanacak rehber öğretmenleri, öğretmenleri ve yöneticileri buradan davet edin. Her görev yalnızca işi için
          gereken bilgileri görür.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="uyeler" className="flex flex-col gap-4">
            <h2 id="uyeler" className="t-h2">
              Ekip üyeleri <span className="t-meta tabular">({list.length})</span>
            </h2>
            <ul className="panel divide-y divide-rule">
              {list.map((p) => {
                const self = p.userId === ctx.user.id;
                const cls = teacherClasses.get(p.userId);
                return (
                  <li key={p.userId} className="flex flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold">
                          {p.fullName}
                          {self && <span className="t-meta font-normal"> (siz)</span>}
                        </p>
                        <p className="t-small break-all text-ink-2">{p.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.roles.map((r) => (
                          <span key={r.membershipId} className="chip">
                            {ROLE_LABELS[r.role]}
                          </span>
                        ))}
                      </div>
                    </div>
                    {p.roles.some((r) => r.role === 'teacher') && (
                      <p className="t-small text-ink-2">
                        {cls?.length ? `Sınıfları: ${cls.join(', ')}` : 'Henüz bir sınıfa bağlanmadı. Sınıf sayfasından öğretmen olarak ekleyebilirsiniz.'}
                      </p>
                    )}
                    {!self && (
                      <details>
                        <summary className="t-small cursor-pointer font-bold text-ink-2">Görevden çıkar</summary>
                        <div className="mt-3 flex flex-col gap-3">
                          <p className="t-small text-ink-2">
                            Kişi bu görevle okul paneline erişemez. Hesabı ve daha önce yaptığı işlemlerin kayıtları silinmez.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {p.roles.map((r) => (
                              <form key={r.membershipId} action={removeMemberAction.bind(null, slug)}>
                                <input type="hidden" name="membershipId" value={r.membershipId} />
                                <button type="submit" className="btn btn-secondary min-h-10">
                                  {ROLE_LABELS[r.role]} görevini kaldır
                                </button>
                              </form>
                            ))}
                          </div>
                        </div>
                      </details>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="davetler" className="flex flex-col gap-4">
            <h2 id="davetler" className="t-h2">
              Bekleyen davetler
            </h2>
            {invites.length === 0 ? (
              <p className="text-ink-2">Bekleyen davet yok.</p>
            ) : (
              <ul className="panel divide-y divide-rule">
                {invites.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <p className="break-all font-bold">{i.email}</p>
                      <p className="t-meta">
                        {ROLE_LABELS[i.role]} · {dateFmt.format(i.createdAt)} tarihinde gönderildi · {dateFmt.format(i.expiresAt)} tarihine kadar geçerli
                      </p>
                    </div>
                    <form action={revokeInviteAction.bind(null, slug)}>
                      <input type="hidden" name="inviteId" value={i.id} />
                      <button type="submit" className="btn btn-secondary min-h-10">
                        Daveti geri al
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <p className="t-meta">Davet e-postası ulaşmadıysa aynı adrese yeniden davet gönderin; eski bağlantı geçersiz olur.</p>
          </section>
        </div>

        <section aria-labelledby="yeni-davet" className="panel flex flex-col gap-5 p-6 lg:sticky lg:top-6">
          <h2 id="yeni-davet" className="t-h3">
            Ekibe davet edin
          </h2>
          <InviteForm slug={slug} />
          <p className="t-meta">
            Rehber öğretmen görevi öğrencilerin bireysel sonuçlarını görür. Bu görevi yalnızca okulunuzun psikolojik danışmanlarına verin; her
            görev değişikliği kayda geçer.
          </p>
        </section>
      </div>

      <section aria-labelledby="kim-ne-gorur" className="flex flex-col gap-4">
        <h2 id="kim-ne-gorur" className="t-h2">
          Kim neyi görür?
        </h2>
        <div className="overflow-x-auto rounded-xl border border-rule">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="p-4 font-bold">
                  İş
                </th>
                <th scope="col" className="p-4 font-bold">
                  Okul yöneticisi
                </th>
                <th scope="col" className="p-4 font-bold">
                  Rehber öğretmen
                </th>
                <th scope="col" className="p-4 font-bold">
                  Öğretmen
                </th>
              </tr>
            </thead>
            <tbody>
              {WHO_SEES.map(([job, ...cells]) => (
                <tr key={job} className="border-t border-rule">
                  <th scope="row" className="p-4 font-normal">
                    {job}
                  </th>
                  {cells.map((c, i) => (
                    <td key={i} className={`p-4 ${c === 'Hayır' ? 'text-ink-3' : 'font-bold'}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
