import Link from 'next/link';
import type { CSSProperties } from 'react';
import { publicInstruments } from '@/content/instruments';
import { UPCOMING } from '@/content/roadmap';
import type { CatalogEntry } from '@/lib/catalog';
import { DOMAIN_LABELS, gradeRangeLabel } from '@/lib/config';
import { DOMAIN_ORDER, domainColor } from '@/lib/domain-style';
import type { InstrumentDef } from '@/lib/instruments/types';
import { TestFinder } from './test-finder';

/** Bir testin kartı: alanının rengini taşır; üzerine gelince hafifçe eğilir (site-effects). */
function TestCard({ t, headingLevel }: { t: InstrumentDef; headingLevel: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="kart group flex h-full flex-col gap-4 overflow-hidden p-6" data-tilt style={{ '--vurgu': domainColor(t.domain) } as CSSProperties}>
      {/* Köşede alanın renginde nefes alan küçük şekil */}
      <span
        aria-hidden="true"
        className="kart-sekil pointer-events-none absolute -right-12 -top-12 size-32 opacity-80 transition-transform duration-700 group-hover:scale-110"
        style={{ background: `radial-gradient(circle at 35% 35%, color-mix(in oklab, ${domainColor(t.domain)} 75%, white), ${domainColor(t.domain)} 70%)` }}
      />
      <p className="relative flex items-center gap-1.5 pr-16 text-[0.8125rem] font-bold leading-snug text-ink-2">
        <span className="size-2 shrink-0 rounded-full" style={{ background: domainColor(t.domain) }} aria-hidden="true" />
        {DOMAIN_LABELS[t.domain]}
      </p>
      <H className="relative font-display text-[1.45rem] font-bold leading-tight">
        <Link href={`/testler/${t.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
          {t.name}
        </Link>
      </H>
      <p className="relative line-clamp-3 text-[0.975rem] text-ink-2">{t.tagline}</p>
      <div className="relative mt-auto flex items-end justify-between gap-3 pt-2">
        <div className="flex flex-col items-start gap-1.5">
          {t.status === 'pilot' && <span className="chip chip-brass">Pilot</span>}
          <p className="t-meta leading-snug">
            {t.estimatedMinutes} dk · {gradeRangeLabel(t.minGrade, t.maxGrade, t.adults)}
          </p>
        </div>
        <Link
          href={`/testler/${t.slug}/coz`}
          className="relative z-10 inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-[0.9rem] font-bold text-paper no-underline transition-transform hover:scale-105"
          aria-label={`${t.name}: hemen çöz`}
        >
          Çöz
        </Link>
      </div>
    </article>
  );
}

/**
 * Test kartları. Kartın tamamı test sayfasına götürür; "Çöz" düğmesi doğrudan teste başlatır.
 * `filterable`: kartların üstünde alan, kimler için ve süre süzgeçleri (test listesi sayfası).
 */
export function TestCards({
  headingLevel = 3,
  showUpcoming = true,
  filterable = false,
}: {
  headingLevel?: 2 | 3;
  showUpcoming?: boolean;
  filterable?: boolean;
}) {
  const live = [...publicInstruments()].sort((a, b) => DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain));
  const upcoming = showUpcoming && UPCOMING.length > 0 && (
    <p className="t-small flex flex-wrap items-center gap-2 text-ink-2" data-reveal>
      <span className="font-bold text-ink">Hazırlanıyor:</span>
      {UPCOMING.map((u) => (
        <span key={u.key} className="chip">
          {u.name}
        </span>
      ))}
    </p>
  );

  if (filterable) {
    const items = live.map((t) => {
      const entry: CatalogEntry = {
        slug: t.slug,
        domain: t.domain,
        minutes: t.estimatedMinutes,
        minGrade: t.minGrade,
        maxGrade: t.maxGrade,
        adults: !!t.adults,
      };
      return { entry, card: <TestCard t={t} headingLevel={headingLevel} /> };
    });
    return (
      <div className="flex flex-col gap-8">
        <TestFinder items={items} />
        {upcoming}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {live.map((t, i) => (
          <li key={t.slug} data-reveal style={{ '--reveal-gecikme': `${(i % 4) * 70}ms` } as CSSProperties}>
            <TestCard t={t} headingLevel={headingLevel} />
          </li>
        ))}
      </ul>
      {upcoming}
    </div>
  );
}
