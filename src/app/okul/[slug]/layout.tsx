import type { Metadata } from 'next';
import { count, eq } from 'drizzle-orm';
import { AppHeader, type NavItem } from '@/components/app/app-header';
import { db } from '@/db';
import { guardianships } from '@/db/schema';
import { requireOrg, userOrgs } from '@/lib/school/access';

export const metadata: Metadata = { title: 'Okul paneli', robots: { index: false, follow: false } };

export default async function OrgLayout(props: LayoutProps<'/okul/[slug]'>) {
  const { slug } = await props.params;
  const ctx = await requireOrg(slug);
  const nav: NavItem[] = [{ href: `/okul/${slug}`, label: 'Sınıflar' }];
  if (ctx.can.manageMembers) nav.push({ href: `/okul/${slug}/ekip`, label: 'Ekip' });
  nav.push({ href: '/hesap', label: 'Hesabım' });
  const [orgs, [kids]] = await Promise.all([
    userOrgs(ctx.user.id),
    db.select({ n: count() }).from(guardianships).where(eq(guardianships.userId, ctx.user.id)),
  ]);
  const switchLinks: NavItem[] = [];
  if (orgs.length > 1) switchLinks.push({ href: '/okul', label: 'Okul değiştir' });
  if (kids.n > 0) switchLinks.push({ href: '/panel', label: 'Veli paneli' });
  if (ctx.user.role === 'admin') switchLinks.push({ href: '/yonetim', label: 'Yönetim' });
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader homeHref={`/okul/${slug}`} context={ctx.org.name} nav={nav} userName={ctx.user.fullName} switchLinks={switchLinks} />
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        {props.children}
      </main>
    </div>
  );
}
