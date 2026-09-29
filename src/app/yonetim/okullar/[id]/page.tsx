import Link from 'next/link';
import { notFound } from 'next/navigation';
import { count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { classes, organizations } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/dal';
import { ROLE_LABELS } from '@/lib/school/access';
import { pendingInvites } from '@/lib/school/invites';
import { orgMembers, orgParticipation } from '@/lib/school/queries';
import { adminRevokeInviteAction, setOrgActiveAction } from '../../actions';
import { AdminInviteForm, OrgSettingsForm } from './forms';

const nf = new Intl.NumberFormat('tr-TR');
const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function AdminOrgPage(props: PageProps<'/yonetim/okullar/[id]'>) {
  await requireAdmin();
  const { id } = await props.params;
  const q = await props.searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [org] = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  if (!org || org.deletedAt) notFound();
  const [members, invites, part, [cls]] = await Promise.all([
    orgMembers(id),
    pendingInvites(id),
    orgParticipation(id),
    db.select({ n: count() }).from(classes).where(eq(classes.orgId, id)),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {q.yeni === '1' && (
        <p className="notice notice-ok" role="status">
          Okul oluşturuldu ve davet gönderildi. Davet kabul edildiğinde kişi ekip listesinde görünecek.
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Link href="/yonetim/okullar" className="t-small">
          Okullar
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="t-h1">{org.name}</h1>
          {org.isActive ? <span className="chip chip-ok">Etkin</span> : <span className="chip">Pasif</span>}
        </div>
        <p className="t-meta">
          Kısa adı: <span className="font-mono">{org.slug}</span> · {dateFmt.format(org.createdAt)} tarihinde oluşturuldu
        </p>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-4">
        {(
          [
            ['Sınıf', cls.n],
            ['Öğrenci', part.students],
            ['Veli onayı', part.consented],
            ['Tamamlanan uygulama', part.completed],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="bg-surface p-5">
            <dt className="t-meta">{label}</dt>
            <dd className="font-display text-3xl font-bold tabular">{nf.format(value)}</dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section aria-labelledby="ekip" className="flex flex-col gap-4">
          <h2 id="ekip" className="t-h2">
            Ekip
          </h2>
          {members.length === 0 ? (
            <p className="text-ink-2">Henüz kimse daveti kabul etmedi.</p>
          ) : (
            <ul className="panel divide-y divide-rule">
              {members.map((m) => (
                <li key={m.membershipId} className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <span className="min-w-0">
                    <span className="font-bold">{m.fullName}</span> <span className="t-meta break-all">{m.email}</span>
                  </span>
                  <span className="chip">{ROLE_LABELS[m.role]}</span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="t-h3 mt-4">Bekleyen davetler</h3>
          {invites.length === 0 ? (
            <p className="text-ink-2">Bekleyen davet yok.</p>
          ) : (
            <ul className="panel divide-y divide-rule">
              {invites.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <span className="min-w-0">
                    <span className="break-all font-bold">{i.email}</span>
                    <span className="t-meta block">
                      {ROLE_LABELS[i.role]} · {dateFmt.format(i.expiresAt)} tarihine kadar geçerli
                    </span>
                  </span>
                  <form action={adminRevokeInviteAction.bind(null, id)}>
                    <input type="hidden" name="inviteId" value={i.id} />
                    <button type="submit" className="btn btn-secondary min-h-10">
                      Geri al
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <div className="panel mt-2 flex flex-col gap-4 p-6">
            <h3 className="t-h3">Davet gönder</h3>
            <AdminInviteForm orgId={id} />
          </div>
        </section>

        <section aria-labelledby="ayarlar" className="flex flex-col gap-4">
          <h2 id="ayarlar" className="t-h2">
            Ayarlar
          </h2>
          <div className="panel p-6">
            <OrgSettingsForm
              orgId={id}
              initial={{
                name: org.name,
                city: org.city ?? '',
                district: org.district ?? '',
                minGroupSize: Math.max(5, org.settings?.minGroupSize ?? 5),
              }}
            />
          </div>
          <div className="panel flex flex-col gap-3 p-6">
            <h3 className="t-h3">{org.isActive ? 'Okulu pasif yap' : 'Okulu yeniden etkinleştir'}</h3>
            <p className="t-small text-ink-2">
              {org.isActive
                ? 'Pasif okulun ekibi okul paneline, öğrencileri kodlarıyla sisteme giremez. Veriler silinmez.'
                : 'Ekip ve öğrenciler yeniden giriş yapabilir.'}
            </p>
            <form action={setOrgActiveAction.bind(null, id)}>
              <input type="hidden" name="active" value={org.isActive ? '0' : '1'} />
              <button type="submit" className={org.isActive ? 'btn btn-secondary' : 'btn btn-primary'}>
                {org.isActive ? 'Pasif yap' : 'Etkinleştir'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
