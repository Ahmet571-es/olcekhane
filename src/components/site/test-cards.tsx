import type { CSSProperties } from 'react';
import { publicInstruments } from '@/content/instruments';
import { UPCOMING } from '@/content/roadmap';
import type { CatalogEntry } from '@/lib/catalog';
import { DOMAIN_ORDER } from '@/lib/domain-style';
import { TestCard, cardInfo } from './test-card';
import { TestFinder } from './test-finder';

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
      return { entry, card: <TestCard t={cardInfo(t)} headingLevel={headingLevel} /> };
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
            <TestCard t={cardInfo(t)} headingLevel={headingLevel} />
          </li>
        ))}
      </ul>
      {upcoming}
    </div>
  );
}
