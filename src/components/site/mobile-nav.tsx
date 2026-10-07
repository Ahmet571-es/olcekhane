'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

/**
 * Telefon ve tabletlerde tam ekran menü: büyük bağlantılar sırayla belirir; Esc ile kapanır.
 * Menü, üst çubuğun içine değil sayfanın gövdesine çizilir: üst çubuktaki bulanık cam efekti
 * (backdrop-filter) sabit konumlu içeriği kendi kutusuna hapsettiği için menü orada görünmezdi.
 * Menü açıkken sayfanın geri kalanı klavye ve ekran okuyucu için devre dışı kalır (inert).
 */
export function MobileNav({ items, groups = [] }: { items: { href: string; label: string }[]; groups?: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = document.getElementById('site-ust');
    if (header) header.dataset.menuAcik = open ? '1' : '0';
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const rest = Array.from(document.querySelectorAll<HTMLElement>('.site-shell > main, .site-shell > footer'));
    rest.forEach((el) => el.setAttribute('inert', ''));
    nav.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      rest.forEach((el) => el.removeAttribute('inert'));
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const all = [
    { href: '/', label: 'Ana sayfa' },
    ...items,
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <div className="xl:hidden">
      <button
        ref={button}
        type="button"
        className="menu-dugme"
        aria-expanded={open}
        aria-controls="mobil-menu"
        aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-dugme-cizgi" data-acik={open ? '1' : '0'} aria-hidden="true" />
        <span className="font-bold">{open ? 'Kapat' : 'Menü'}</span>
      </button>
      {open &&
        createPortal(
          <div id="mobil-menu" className="site-shell mobil-menu fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto">
            <nav ref={nav} aria-label="Mobil menü" className="container-page flex min-h-full flex-col justify-between gap-10 pb-10 pt-6">
              <ul className="flex flex-col">
                {all.map((n, i) => (
                  <li key={n.href} className="mobil-menu-oge" style={{ '--sira': i } as CSSProperties}>
                    <Link
                      href={n.href}
                      aria-current={pathname === n.href ? 'page' : undefined}
                      className="flex items-baseline justify-between border-b border-rule py-4 font-display text-[clamp(1.9rem,8vw,2.8rem)] font-bold leading-none no-underline"
                    >
                      {n.label}
                      <span aria-hidden="true" className="text-lg text-ink-3">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {groups.length > 0 && (
                <div className="mobil-menu-oge flex flex-col gap-3" style={{ '--sira': all.length } as CSSProperties}>
                  <p className="kicker">Grubuna göre testler</p>
                  <ul className="flex flex-wrap gap-2">
                    {groups.map((g) => (
                      <li key={g.href}>
                        <Link
                          href={g.href}
                          aria-current={pathname === g.href ? 'page' : undefined}
                          className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-rule-strong px-4 font-bold no-underline aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-paper"
                        >
                          {g.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href="/testler" className="btn btn-primary btn-lg btn-tayf self-start">
                Ücretsiz test çöz
              </Link>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
