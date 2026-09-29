import type { Metadata } from 'next';
import { AppHeader, type NavItem } from '@/components/app/app-header';
import { requireAccountsOpen, requireUser } from '@/lib/auth/dal';
import { userOrgs } from '@/lib/school/access';

export const metadata: Metadata = { title: 'Panelim', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  requireAccountsOpen();
  const user = await requireUser('/panel');
  const orgs = await userOrgs(user.id);
  const switchLinks: NavItem[] = [];
  if (orgs.length > 0) switchLinks.push({ href: '/okul', label: 'Okul paneli' });
  if (user.role === 'admin') switchLinks.push({ href: '/yonetim', label: 'Yönetim' });
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        homeHref="/panel"
        nav={[
          { href: '/panel', label: 'Çocuklarım' },
          { href: '/hesap', label: 'Hesabım' },
        ]}
        userName={user.fullName}
        switchLinks={switchLinks}
      />
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
