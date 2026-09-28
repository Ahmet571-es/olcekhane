import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/site/logo';
import { requireUser } from '@/lib/auth/dal';
import { logoutAction } from '../(auth)/actions';

export const metadata: Metadata = { title: 'Panelim', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/panel');
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-rule bg-surface">
        <div className="container-page flex min-h-[4.25rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <Link href="/panel" className="no-underline" aria-label="Panel ana sayfası">
            <Logo />
          </Link>
          <nav aria-label="Panel menüsü" className="order-3 w-full sm:order-none sm:w-auto">
            <ul className="flex gap-1">
              <li>
                <Link href="/panel" className="btn btn-quiet min-h-10">
                  Çocuklarım
                </Link>
              </li>
              <li>
                <Link href="/panel/hesap" className="btn btn-quiet min-h-10">
                  Hesabım
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link href="/yonetim" className="btn btn-quiet min-h-10">
                    Yönetim
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <span className="t-small hidden text-ink-2 md:inline">{user.fullName}</span>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-secondary min-h-10 px-3.5">
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
