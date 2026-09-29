import type { Metadata } from 'next';
import { AppHeader, type NavItem } from '@/components/app/app-header';
import { requireAccountHolder } from '@/lib/auth/dal';
import { homeFor } from '@/lib/auth/home';
import { userOrgs } from '@/lib/school/access';

export const metadata: Metadata = { title: 'Hesabım', robots: { index: false, follow: false } };

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Doğrulanmamış oturumlar da çerçeveyi görür: oturumu doğrulama sayfası (/hesap/iki-asamali) buradadır.
  // Sayfalar kendileri requireUser ile korunur.
  const user = await requireAccountHolder('/hesap');
  const [orgs, home] = await Promise.all([userOrgs(user.id), homeFor(user)]);
  const switchLinks: NavItem[] = [{ href: '/panel', label: 'Veli paneli' }];
  if (orgs.length > 0) switchLinks.push({ href: '/okul', label: 'Okul paneli' });
  if (user.role === 'admin') switchLinks.push({ href: '/yonetim', label: 'Yönetim' });
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader homeHref={home} nav={[{ href: '/hesap', label: 'Hesabım', current: true }]} userName={user.fullName} switchLinks={switchLinks} />
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
