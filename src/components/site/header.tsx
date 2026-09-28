import Link from 'next/link';
import { AccountLinks } from './account-links';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';

export const NAV = [
  { href: '/testler', label: 'Testler' },
  { href: '/veliler-icin', label: 'Veliler için' },
  { href: '/okullar-icin', label: 'Okullar için' },
  { href: '/bilimsel-yaklasim', label: 'Bilimsel yaklaşım' },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-rule/70 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" className="no-underline" aria-label="Ölçekhane ana sayfa">
          <Logo />
        </Link>
        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="rounded-md px-3 py-2 text-[0.975rem] font-semibold text-ink-2 no-underline hover:bg-surface-2 hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:block">
          <AccountLinks />
        </div>
        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
