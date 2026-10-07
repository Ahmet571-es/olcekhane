import Link from 'next/link';
import type { ReactNode } from 'react';

export interface GuideLink {
  href: string;
  label: string;
}

/**
 * Yol gösterici kutu: sayfanın başında "Bu sayfada ne yapabilirsiniz?" sorusunu kısaca cevaplar, gerekirse adımları
 * sıralar ve sıradaki adımı gösterir. Sitenin her sayfasında bulunur (tests/age-groups.test.ts denetler).
 * Hareketli efekt taşımaz; `plain` ile test çözme ve rapor ekranlarında da kullanılır.
 */
export function PageGuide({
  title = 'Bu sayfada',
  children,
  steps,
  next,
  plain = false,
  className = '',
}: {
  title?: string;
  /** Sayfada ne yapılabileceği: bir iki cümle. */
  children: ReactNode;
  /** Sırayla yapılacaklar (en çok dört kısa adım). */
  steps?: ReactNode[];
  /** Sıradaki adım: en çok üç bağlantı; ilki öne çıkar. */
  next?: GuideLink[];
  plain?: boolean;
  className?: string;
}) {
  return (
    <aside
      aria-label={title}
      className={`${plain ? 'panel' : 'glass rounded-[1.5rem]'} flex gap-4 p-5 sm:gap-5 sm:p-6 ${className}`}
    >
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper" aria-hidden="true">
        {/* Pusula */}
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6Z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="kicker">{title}</p>
        <div className="measure flex flex-col gap-2 text-[1.0625rem] leading-relaxed">{children}</div>
        {steps && steps.length > 0 && (
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border-[1.5px] border-ink text-[0.875rem] font-bold" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="text-ink-2">{s}</span>
              </li>
            ))}
          </ol>
        )}
        {next && next.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="t-small mr-1 font-bold text-ink-2">Sıradaki adım:</span>
            {next.map((n, i) => (
              <Link key={n.href} href={n.href} className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'} min-h-10 px-4 text-[0.9375rem]`}>
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
