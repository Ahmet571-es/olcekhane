import Link from 'next/link';
import { logoutAction } from '@/app/(auth)/actions';
import { Logo } from '@/components/site/logo';

export type NavItem = { href: string; label: string; current?: boolean };

/** Veli, okul ve yönetim panellerinin ortak üst çubuğu. */
export function AppHeader({
  homeHref,
  context,
  nav,
  userName,
  switchLinks = [],
}: {
  homeHref: string;
  /** Logonun yanında gösterilen bağlam (ör. okul adı). */
  context?: string;
  nav: NavItem[];
  userName: string;
  /** Başka bir panele geçiş bağlantıları (ör. “Veli paneli”, “Okul paneli”). */
  switchLinks?: NavItem[];
}) {
  return (
    <header className="border-b border-rule bg-surface print:hidden">
      <div className="container-page flex min-h-[4.25rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={homeHref} className="no-underline" aria-label="Panel ana sayfası">
            <Logo />
          </Link>
          {context && (
            <span className="hidden min-w-0 truncate border-l border-rule pl-3 text-[0.9375rem] font-bold text-ink-2 sm:inline">{context}</span>
          )}
        </div>
        <nav aria-label="Panel menüsü" className="order-3 w-full overflow-x-auto sm:order-none sm:w-auto">
          <ul className="flex gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={n.current ? 'page' : undefined}
                  className={`btn btn-quiet min-h-10 whitespace-nowrap ${n.current ? 'underline decoration-2 underline-offset-8' : ''}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {switchLinks.map((s) => (
            <Link key={s.href} href={s.href} className="t-small whitespace-nowrap font-bold">
              {s.label}
            </Link>
          ))}
          <span className="t-small hidden text-ink-2 lg:inline">{userName}</span>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-secondary min-h-10 px-3.5">
              Çıkış
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
