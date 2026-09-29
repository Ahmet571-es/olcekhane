import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { requireAdmin } from '@/lib/auth/dal';
import { NewOrgForm } from './new-org-form';

const nf = new Intl.NumberFormat('tr-TR');
const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function AdminOrgs() {
  await requireAdmin();
  const rows = await db.execute<{
    id: string;
    name: string;
    slug: string;
    city: string | null;
    district: string | null;
    is_active: boolean;
    created_at: Date;
    members: number;
    pending: number;
    students: number;
    completed: number;
  }>(sql`
    select o.id, o.name, o.slug, o.city, o.district, o.is_active, o.created_at,
      (select count(distinct m.user_id)::int from memberships m where m.org_id = o.id) as members,
      (select count(*)::int from org_invites i where i.org_id = o.id and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()) as pending,
      (select count(*)::int from students s where s.org_id = o.id and s.deleted_at is null) as students,
      (select count(*)::int from attempts a join students s on s.id = a.student_id where s.org_id = o.id and a.status = 'completed') as completed
    from organizations o
    where o.deleted_at is null
    order by o.created_at desc
  `);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Okullar</h1>
        <p className="measure text-ink-2">
          Okul hesabı açıp ilk yöneticiyi ya da rehber öğretmeni davet edin. Okul başvuruları iletişim formundan “Okul” konusuyla gelir.
        </p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
        {rows.length === 0 ? (
          <p className="panel p-6 text-ink-2">Henüz okul yok.</p>
        ) : (
          <ul className="panel divide-y divide-rule">
            {rows.map((o) => (
              <li key={o.id}>
                <Link href={`/yonetim/okullar/${o.id}`} className="flex flex-col gap-1.5 p-5 no-underline hover:bg-surface-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-bold">{o.name}</span>
                    {!o.is_active && <span className="chip">Pasif</span>}
                    {o.members === 0 && o.pending > 0 && <span className="chip chip-brass">Davet bekleniyor</span>}
                  </span>
                  <span className="t-meta">
                    {[o.district, o.city].filter(Boolean).join(', ') || 'Konum girilmedi'} · {dateFmt.format(new Date(o.created_at))}
                  </span>
                  <span className="t-small tabular text-ink-2">
                    {nf.format(o.members)} ekip üyesi · {nf.format(o.students)} öğrenci · {nf.format(o.completed)} tamamlanan uygulama
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <section aria-labelledby="yeni-okul" className="panel flex flex-col gap-5 p-6">
          <h2 id="yeni-okul" className="t-h3">
            Okul ekle
          </h2>
          <NewOrgForm />
        </section>
      </div>
    </div>
  );
}
