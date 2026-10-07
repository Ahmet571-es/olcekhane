import Link from 'next/link';
import type { CSSProperties } from 'react';
import { DOMAIN_LABELS, gradeRangeLabel } from '@/lib/config';
import { domainColor } from '@/lib/domain-style';
import type { InstrumentDef } from '@/lib/instruments/types';

/**
 * Bir test kartının ihtiyaç duyduğu bilgiler. Kart tarayıcıda da çizilebilsin (yaş grubu sayfasındaki sınıf seçimi)
 * diye testin tamamı değil yalnızca bunlar taşınır; maddeler ve puanlama tarayıcıya gitmez.
 */
export interface TestCardInfo {
  slug: string;
  name: string;
  tagline: string;
  domain: string;
  status: InstrumentDef['status'];
  minutes: number;
  minGrade: number;
  maxGrade: number;
  adults: boolean;
  /** Metin ya da sorular sınıf düzeyine göre seçilir (okuma ve konu tarama testleri). */
  perGrade: boolean;
}

export function cardInfo(t: InstrumentDef): TestCardInfo {
  return {
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    domain: t.domain,
    status: t.status,
    minutes: t.estimatedMinutes,
    minGrade: t.minGrade,
    maxGrade: t.maxGrade,
    adults: !!t.adults,
    perGrade: t.engine === 'reading' || t.engine === 'quiz',
  };
}

/**
 * Bir testin kartı: alanının rengini taşır; üzerine gelince hafifçe eğilir (site-effects). Kartın tamamı test
 * sayfasına götürür; "Çöz" düğmesi testi başlatır (`solveHref`: yaş grubu sayfasında seçilen sınıfla).
 */
export function TestCard({ t, headingLevel = 3, solveHref }: { t: TestCardInfo; headingLevel?: 2 | 3; solveHref?: string }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const color = domainColor(t.domain);
  return (
    <article className="kart group flex h-full flex-col gap-4 overflow-hidden p-6" data-tilt style={{ '--vurgu': color } as CSSProperties}>
      {/* Köşede alanın renginde nefes alan küçük şekil */}
      <span
        aria-hidden="true"
        className="kart-sekil pointer-events-none absolute -right-12 -top-12 size-32 opacity-80 transition-transform duration-700 group-hover:scale-110"
        style={{ background: `radial-gradient(circle at 35% 35%, color-mix(in oklab, ${color} 75%, white), ${color} 70%)` }}
      />
      <p className="relative flex items-center gap-1.5 pr-16 text-[0.8125rem] font-bold leading-snug text-ink-2">
        <span className="size-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />
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
          <div className="flex flex-wrap gap-1.5">
            {t.status === 'pilot' && <span className="chip chip-brass">Pilot</span>}
            {t.perGrade && <span className="chip">Sınıfa göre sorular</span>}
          </div>
          <p className="t-meta leading-snug">
            {t.minutes} dk · {gradeRangeLabel(t.minGrade, t.maxGrade, t.adults)}
          </p>
        </div>
        <Link
          href={solveHref ?? `/testler/${t.slug}/coz`}
          className="relative z-10 inline-flex min-h-10 shrink-0 items-center rounded-full bg-ink px-4 text-[0.9rem] font-bold text-paper no-underline transition-transform hover:scale-105"
          aria-label={`${t.name}: hemen çöz`}
        >
          Çöz
        </Link>
      </div>
    </article>
  );
}
