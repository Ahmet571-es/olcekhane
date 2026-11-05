import Link from 'next/link';
import type { CSSProperties } from 'react';
import { publicInstruments } from '@/content/instruments';
import { UPCOMING } from '@/content/roadmap';
import { DOMAIN_LABELS, gradeRangeLabel } from '@/lib/config';
import { DOMAIN_ORDER, domainColor } from '@/lib/domain-style';
import type { InstrumentDef } from '@/lib/instruments/types';
import { cardInfo, type TestCardInfo } from './test-card';
import { TestEmblem } from './test-emblem';

/** Ana sayfadaki bölümlerin adresteki adı (#galeri-…) ve kısa tanıtımı. */
export const GALLERY_SECTIONS: Record<string, { anchor: string; lede: string }> = {
  personality: {
    anchor: 'galeri-kisilik',
    lede: 'Nasıl biri olduğunu; insanlarla, işlerle ve kendinle nasıl ilişki kurduğunu anlatan ölçekler.',
  },
  cognitive: {
    anchor: 'galeri-zeka',
    lede: 'Akıl yürütme, sözel, sayısal ve uzamsal beceriler, bellek, dikkat ve hız. Her beceri ayrı ölçülür; tek bir zekâ puanı verilmez.',
  },
  reading: {
    anchor: 'galeri-okuma',
    lede: 'Okuma hızı, okuduğunu anlama ve sesli okuma. Metin sınıfa göre seçilir.',
  },
  academic: {
    anchor: 'galeri-ogrenme',
    lede: 'Ders çalışma alışkanlıkları, motivasyon, zaman yönetimi, öğrenmeye dair inançlar ve matematikte konu taraması.',
  },
  career: {
    anchor: 'galeri-ilgi',
    lede: 'Nelerden hoşlandığını ve çalışırken neye değer verdiğini keşfet. Testler meslek seçmez; keşfedilecek alanları gösterir.',
  },
  wellbeing: {
    anchor: 'galeri-iyi-olus',
    lede: 'Kendini nasıl hissettiğine dair ölçekler.',
  },
  skills: {
    anchor: 'galeri-sosyal-duygusal',
    lede: 'Duyguları fark etme, anlama ve yönetme; başkalarının duygularına ortak olma.',
  },
};

/**
 * Zekâ ve zihinsel beceriler bölümünün alt grupları ("Hangi test bana uygun?" sayfasındaki becerilerin adlarıyla).
 * Yeni bir zihinsel görev buraya yazılır; yazılmazsa "Öteki zihinsel görevler" altında görünür (tests/galeri.test.ts).
 */
export const COGNITIVE_GROUPS: { name: string; slugs: string[] }[] = [
  { name: 'Akıl yürütme', slugs: ['sekil-akil-yurutme', 'sekil-benzetmeleri', 'harf-dizileri'] },
  { name: 'Sözel beceri', slugs: ['kelime-bilgisi', 'sozel-akil-yurutme'] },
  { name: 'Sayısal beceri', slugs: ['sayi-dizileri', 'sayisal-akil-yurutme', 'zihinden-hesaplama-hizi'] },
  {
    name: 'Uzamsal beceri',
    slugs: ['kagit-katlama', 'zihinde-dondurme', 'kup-acinimi', 'uc-boyutlu-zihinde-dondurme', 'bakis-acisi-alma', 'gizli-sekiller', 'parcalardan-sekil'],
  },
  {
    name: 'Bellek',
    slugs: ['desen-hatirlama', 'harf-sayi-siralama', 'kelime-listesi-hatirlama', 'hesapla-ve-hatirla', 'geriye-donuk-hatirlama'],
  },
  { name: 'Planlama ve karar verme', slugs: ['planlama-kule-gorevi', 'mantiksal-akil-yurutme', 'dusunerek-karar-verme'] },
  {
    name: 'Dikkat ve kendini yönetme',
    slugs: ['surekli-dikkat', 'dikkat-ve-bellek', 'dur-git-gorevi', 'renk-kelime-gorevi', 'kural-degistirme', 'sirayla-birlestirme-gorevi', 'tepki-hizi', 'simge-bulma'],
  },
];
export const OTHER_COGNITIVE = 'Öteki zihinsel görevler';

export interface GalleryItem {
  info: TestCardInfo;
  /** Ayrı puanlanan ölçek sayısı (bileşikler hariç): kişilik profillerinde amblemin köşe sayısı. */
  dims: number;
}

export interface GallerySection {
  domain: string;
  count: number;
  groups: { name?: string; items: GalleryItem[] }[];
}

const toItem = (t: InstrumentDef): GalleryItem => ({ info: cardInfo(t), dims: t.scales.filter((s) => !s.of).length });

/** Yayındaki testler alanlarına göre, sitedeki sırayla; zihinsel beceriler alt gruplarıyla. */
export function gallerySections(): GallerySection[] {
  const live = publicInstruments();
  return DOMAIN_ORDER.map((domain) => {
    const here = live.filter((t) => t.domain === domain);
    let groups: GallerySection['groups'];
    if (domain === 'cognitive') {
      const known = new Set(COGNITIVE_GROUPS.flatMap((g) => g.slugs));
      groups = [
        ...COGNITIVE_GROUPS.map((g) => ({
          name: g.name,
          items: g.slugs
            .map((s) => here.find((t) => t.slug === s))
            .filter((t) => t !== undefined)
            .map(toItem),
        })),
        { name: OTHER_COGNITIVE, items: here.filter((t) => !known.has(t.slug)).map(toItem) },
      ].filter((g) => g.items.length > 0);
    } else {
      groups = [{ items: here.map(toItem) }];
    }
    return { domain, count: here.length, groups };
  }).filter((s) => s.count > 0);
}

const two = (n: number) => String(n).padStart(2, '0');

/**
 * Galeri kartı: üstte testin amblemi, altta süresi ve kimler için olduğu, adı, ne ölçtüğü. Kartın tamamı test sayfasına
 * götürür ("İncele"); "Çöz" düğmesi testi doğrudan başlatır.
 */
function GalleryCard({ item, index, total }: { item: GalleryItem; index: number; total: number }) {
  const t = item.info;
  const color = domainColor(t.domain);
  return (
    <article className="kart galeri-kart group flex h-full flex-col overflow-hidden" data-tilt style={{ '--vurgu': color } as CSSProperties}>
      <div className="galeri-sahne relative">
        <TestEmblem slug={t.slug} domain={t.domain} name={t.name} dims={item.dims} />
        <span className="galeri-sira tabular" aria-hidden="true">
          {two(index)}
          <span className="galeri-sira-toplam">/{two(total)}</span>
        </span>
        {t.status === 'pilot' && <span className="galeri-etiket glass">Pilot</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-4">
        <p className="galeri-meta">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="8" cy="8" r="6.2" />
            <path d="M8 4.6V8l2.4 1.6" />
          </svg>
          <span>{t.minutes} dk</span>
          <span aria-hidden="true">·</span>
          <span>{gradeRangeLabel(t.minGrade, t.maxGrade, t.adults)}</span>
        </p>
        <h4 className="font-display text-[1.3rem] font-bold leading-[1.12] tracking-[-0.012em]">
          <Link href={`/testler/${t.slug}`} className="galeri-baglanti no-underline after:absolute after:inset-0 after:z-[1] after:content-['']">
            {t.name}
          </Link>
        </h4>
        <p className="line-clamp-2 text-[0.94rem] leading-snug text-ink-2">{t.tagline}</p>
        {t.perGrade && (
          <p>
            <span className="chip">{t.domain === 'reading' ? 'Sınıfa göre metin' : 'Sınıfa göre sorular'}</span>
          </p>
        )}
        <div className="galeri-alt mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="galeri-incele" aria-hidden="true">
            İncele
          </span>
          <Link href={`/testler/${t.slug}/coz`} className="galeri-coz relative z-[2] shrink-0 no-underline" aria-label={`${t.name}: hemen çöz`}>
            Çöz
            <svg viewBox="0 0 16 16" aria-hidden="true" className="galeri-ok size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function CardRow({ items, start, total }: { items: GalleryItem[]; start: number; total: number }) {
  return (
    <ul className="galeri-ray -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
      {items.map((item, i) => (
        <li
          key={item.info.slug}
          className="w-[82%] max-w-[21rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
          data-reveal
          style={{ '--reveal-gecikme': `${(i % 3) * 70}ms` } as CSSProperties}
        >
          <GalleryCard item={item} index={start + i + 1} total={total} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Ana sayfadaki test galerisi: yayındaki bütün testler, alanlarına göre bölüm bölüm kart olarak. Telefonda her bölüm (ve
 * zihinsel becerilerin her alt grubu) yana kaydırılan bir şerittir; geniş ekranda bölümün başlığı solda durur, kartlar
 * sağda ızgara olur.
 */
export function TestGallery() {
  const sections = gallerySections();
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <nav aria-label="Test bölümleri" className="galeri-icindekiler -mx-5 overflow-x-auto px-5 pb-1 md:mx-0 md:overflow-visible md:px-0" data-reveal>
        <ul className="flex w-max gap-2.5 md:w-auto md:flex-wrap">
          {sections.map(({ domain, count }) => (
            <li key={domain}>
              <a href={`#${GALLERY_SECTIONS[domain].anchor}`} className="galeri-sekme" style={{ '--vurgu': domainColor(domain) } as CSSProperties}>
                <span className="galeri-sekme-nokta" aria-hidden="true" />
                {DOMAIN_LABELS[domain]}
                <span className="galeri-sekme-sayi tabular">{count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map(({ domain, count, groups }, si) => {
        const color = domainColor(domain);
        const meta = GALLERY_SECTIONS[domain];
        const headingId = `${meta.anchor}-baslik`;
        const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0));
        return (
          <section
            key={domain}
            id={meta.anchor}
            aria-labelledby={headingId}
            className="galeri-bolum grid scroll-mt-24 gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-12"
            style={{ '--vurgu': color } as CSSProperties}
          >
            <header className="galeri-baslik flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start" data-reveal>
              <p className="flex items-center gap-2.5 text-[0.8125rem] font-bold tracking-[0.08em] text-ink-3">
                <span className="size-2.5 rounded-full" style={{ background: color }} aria-hidden="true" />
                <span className="tabular">
                  {two(si + 1)} / {two(sections.length)}
                </span>
              </p>
              <h3 id={headingId} className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.025em]">
                {DOMAIN_LABELS[domain]}
              </h3>
              <p className="text-ink-2">{meta.lede}</p>
              <p className="flex items-baseline gap-2 pt-1">
                <span className="galeri-sayi font-display font-bold tabular" style={{ color }}>
                  {count}
                </span>
                <span className="font-bold text-ink-2">test</span>
                {count > 1 && (
                  <span className="t-meta ml-1 sm:hidden" aria-hidden="true">
                    · yana kaydır
                  </span>
                )}
              </p>
            </header>
            <div className="flex min-w-0 flex-col gap-9">
              {groups.map((g, gi) => {
                const row = <CardRow items={g.items} start={starts[gi]} total={count} />;
                if (!g.name) return <div key="hepsi">{row}</div>;
                return (
                  <div key={g.name} className="flex flex-col gap-4">
                    <p className="galeri-altgrup">
                      <span>{g.name}</span>
                      <span className="galeri-altgrup-sayi tabular">{g.items.length}</span>
                    </p>
                    {row}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {UPCOMING.length > 0 && (
        <p className="t-small flex flex-wrap items-center gap-2 text-ink-2" data-reveal>
          <span className="font-bold text-ink">Hazırlanıyor:</span>
          {UPCOMING.map((u) => (
            <span key={u.key} className="chip">
              {u.name}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
