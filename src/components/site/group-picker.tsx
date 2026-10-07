import Link from 'next/link';
import type { CSSProperties } from 'react';
import { liveGroups, type AgeGroupKey } from '@/content/age-groups';

/**
 * Yaş grubu seçimi: "Kimsin?" sorusunun cevabı. Büyük kartlar (ana sayfa, test listesi) ya da küçük yuvarlak
 * düğmeler (`compact`: grup sayfaları, menü). Seçim yalnızca hangi sayfanın açılacağıdır; kaydedilmez.
 */
export function GroupPicker({ current, compact = false, headingLevel = 3 }: { current?: AgeGroupKey; compact?: boolean; headingLevel?: 2 | 3 }) {
  const groups = liveGroups();
  const H = headingLevel === 2 ? 'h2' : 'h3';

  if (compact) {
    return (
      <ul className="flex flex-wrap gap-2">
        {groups.map(({ group: g }) => (
          <li key={g.key}>
            <Link
              href={g.path}
              aria-current={current === g.key ? 'page' : undefined}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border-[1.5px] border-rule-strong bg-surface px-4 text-[0.9375rem] font-bold text-ink-2 no-underline transition-colors hover:border-ink aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-paper"
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: g.color }} aria-hidden="true" />
              {g.name}
              <span className="font-normal opacity-80">· {g.range}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${groups.length >= 5 ? 'lg:grid-cols-3 xl:grid-cols-5' : groups.length === 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {groups.map(({ group: g, count }, i) => (
        <li key={g.key} data-reveal style={{ '--reveal-gecikme': `${i * 70}ms` } as CSSProperties}>
          <article className="kart group flex h-full flex-col gap-3 overflow-hidden p-6" data-tilt style={{ '--vurgu': g.color } as CSSProperties}>
            <span
              aria-hidden="true"
              className="kart-sekil pointer-events-none absolute -right-10 -top-10 size-28 opacity-80 transition-transform duration-700 group-hover:scale-110"
              style={{ background: `radial-gradient(circle at 35% 35%, color-mix(in oklab, ${g.color} 75%, white), ${g.color} 70%)` }}
            />
            <p className="t-meta relative font-bold">{g.range}</p>
            <H className="relative pr-12 font-display text-[1.6rem] font-bold leading-tight">
              <Link href={g.path} aria-current={current === g.key ? 'page' : undefined} className="no-underline after:absolute after:inset-0 after:content-['']">
                {g.name}
              </Link>
            </H>
            <p className="relative mt-auto flex items-center justify-between gap-3 pt-2 font-bold">
              <span>{count} test</span>
              <span aria-hidden="true">→</span>
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
