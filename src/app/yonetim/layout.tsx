import type { Metadata } from 'next';
import { AppHeader, type NavItem } from '@/components/app/app-header';
import { requireAdmin } from '@/lib/auth/dal';
import { userOrgs } from '@/lib/school/access';

export const metadata: Metadata = { title: 'Yönetim', robots: { index: false, follow: false } };

const NAV: NavItem[] = [
  { href: '/yonetim', label: 'Genel bakış' },
  { href: '/yonetim/okullar', label: 'Okullar' },
  { href: '/yonetim/psikometri', label: 'Psikometri' },
  { href: '/yonetim/mesajlar', label: 'Mesajlar' },
  { href: '/yonetim/eposta', label: 'E-postalar' },
  { href: '/yonetim/denetim', label: 'Denetim kaydı' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const orgs = await userOrgs(user.id);
  const switchLinks: NavItem[] = [{ href: '/hesap', label: 'Hesabım' }];
  if (orgs.length > 0) switchLinks.unshift({ href: '/okul', label: 'Okul paneli' });
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader homeHref="/yonetim" context="Yönetim" nav={NAV} userName={user.fullName} switchLinks={switchLinks} />
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
