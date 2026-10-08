import Link from 'next/link';
import { liveGroups } from '@/content/age-groups';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';

export const NAV = [
  { href: '/testler', label: 'Testler' },
  { href: '/okuma', label: 'Okuma' },
  { href: '/beyin-akademisi', label: 'Beyin Akademisi' },
  { href: '/veliler-icin', label: 'Veliler için' },
  { href: '/rehber', label: 'Rehber' },
  { href: '/bilimsel-yaklasim', label: 'Bilimsel yaklaşım' },
];

/** Üst bölümdeki tek eylem düğmesi: hesap ya da giriş yoktur, testler doğrudan çözülür. */
export function TestsCta() {
  return (
    <Link href="/testler" className="btn btn-primary btn-tayf whitespace-nowrap" data-magnet>
      Ücretsiz test çöz
    </Link>
  );
}

/** Yapışkan, buzlu cam üst menü. Aşağı kaydırınca gizlenir, yukarı kaydırınca geri gelir (site-effects). */
export function SiteHeader() {
  return (
    <header id="site-ust" className="site-ust sticky top-0 z-30">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="no-underline" aria-label="Ölçekhane ana sayfa">
          <Logo />
        </Link>
        <nav aria-label="Ana menü" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="menu-baglanti">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden xl:block">
          <TestsCta />
        </div>
        <MobileNav items={NAV} groups={liveGroups().map(({ group }) => ({ href: group.path, label: group.name }))} />
      </div>
    </header>
  );
}
