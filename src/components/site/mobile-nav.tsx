'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MobileNav({ items, cta }: { items: { href: string; label: string }[]; cta: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        className="btn btn-secondary min-h-10 px-3.5"
        aria-expanded={open}
        aria-controls="mobil-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Kapat' : 'Menü'}
      </button>
      {open && (
        <div id="mobil-menu" className="absolute inset-x-0 top-full border-b border-rule bg-paper shadow-[var(--shadow)]">
          <nav aria-label="Mobil menü" className="container-page py-4">
            <ul className="flex flex-col">
              {items.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="block border-b border-rule py-3.5 text-lg font-semibold no-underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">{cta}</div>
          </nav>
        </div>
      )}
    </div>
  );
}
