import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app/app-header';
import { requireUser } from '@/lib/auth/dal';
import { ROLE_LABELS, userOrgs } from '@/lib/school/access';

export const metadata: Metadata = { title: 'Okul paneli', robots: { index: false, follow: false } };

export default async function SchoolChooser() {
  const user = await requireUser('/okul');
  const orgs = await userOrgs(user.id);
  if (orgs.length === 1) redirect(`/okul/${orgs[0].slug}`);
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader homeHref="/okul" nav={[]} userName={user.fullName} switchLinks={[{ href: '/panel', label: 'Veli paneli' }]} />
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <h1 className="t-h1">Okul paneli</h1>
          {orgs.length === 0 ? (
            <div className="panel flex flex-col gap-3 p-6">
              <p>Henüz bir okul ekibinde değilsiniz.</p>
              <p className="text-ink-2">
                Okul yöneticiniz sizi e-postayla davet ettiğinde, davet bağlantısını açarak ekibe katılabilirsiniz. Okulunuz Ölçekhane’yi
                kullanmak istiyorsa <Link href="/okullar-icin">okullar için sayfamızdan</Link> başvurabilir.
              </p>
            </div>
          ) : (
            <ul className="panel divide-y divide-rule">
              {orgs.map((o) => (
                <li key={o.id}>
                  <Link href={`/okul/${o.slug}`} className="flex flex-wrap items-center justify-between gap-3 p-5 no-underline hover:bg-surface-2">
                    <span className="font-display text-xl font-bold">{o.name}</span>
                    <span className="t-meta">{o.roles.map((r) => ROLE_LABELS[r]).join(', ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
