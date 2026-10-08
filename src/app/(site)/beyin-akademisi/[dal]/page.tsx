import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dersSuresi } from '@/components/beyin/ders-icerigi';
import { JsonLd } from '@/components/seo/json-ld';
import { PageGuide } from '@/components/site/page-guide';
import { BEYIN_YOLU, DALLAR, dalBul } from '@/content/beyin';
import { siteUrl } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return DALLAR.map((d) => ({ dal: d.id }));
}

export async function generateMetadata(props: PageProps<'/beyin-akademisi/[dal]'>): Promise<Metadata> {
  const { dal } = await props.params;
  const d = dalBul(dal);
  if (!d) return {};
  return pageMeta({ title: `${d.ad} | Beyin Akademisi`, description: d.aciklama.slice(0, 158), path: `${BEYIN_YOLU}/${d.id}` });
}

export default async function DalPage(props: PageProps<'/beyin-akademisi/[dal]'>) {
  const { dal } = await props.params;
  const d = dalBul(dal);
  if (!d) notFound();
  const hazir = d.program.filter((p) => p.ders);
  const ilkHazir = hazir[0];
  const sonraki = DALLAR.find((x) => x.sira === d.sira + 1) ?? DALLAR[0];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Beyin Akademisi', path: BEYIN_YOLU },
          { name: d.ad, path: `${BEYIN_YOLU}/${d.id}` },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: d.ad,
          description: d.aciklama,
          url: siteUrl(`${BEYIN_YOLU}/${d.id}`),
          inLanguage: 'tr-TR',
          isAccessibleForFree: true,
          provider: { '@type': 'Organization', name: 'Ölçekhane', url: siteUrl('/') },
          hasPart: hazir.map((p) => ({
            '@type': 'LearningResource',
            name: p.baslik,
            url: siteUrl(`${BEYIN_YOLU}/${d.id}/${p.slug}`),
          })),
        }}
      />
      <header className="relative overflow-hidden border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="sayfa-sekil" />
        </div>
        <div className="container-page relative flex flex-col gap-5 py-14 md:py-20">
          <nav aria-label="Konum" className="t-small text-ink-3">
            <Link href={BEYIN_YOLU}>Beyin Akademisi</Link>
          </nav>
          <p className="kicker">
            {d.sira}. bölüm · {d.program.length} ders · {hazir.length > 0 ? `${hazir.length} ders hazır` : 'hazırlanıyor'}
          </p>
          <h1 className="t-section max-w-4xl">{d.ad}</h1>
          <p className="t-lede measure">{d.aciklama}</p>
          <PageGuide
            next={[
              ...(ilkHazir ? [{ href: `${BEYIN_YOLU}/${d.id}/${ilkHazir.slug}`, label: `${ilkHazir.sira}. derse başla` }] : []),
              { href: `${BEYIN_YOLU}/${sonraki.id}`, label: `${sonraki.sira}. bölüm: ${sonraki.kisaAd}` },
            ]}
          >
            <p>
              Dersler birbirinin üstüne kurulur; sırayla okuman önerilir. Bağlantılı olanlar hazırdır, ötekiler hazırlanıyor.
              Her ders üç düzeyde okunur: dersin başında sana uyan düzeyi seçersin; emin değilsen Temel ile başla.
            </p>
          </PageGuide>
        </div>
      </header>

      <div className="container-page py-12 md:py-16">
        <ol className="grid gap-3 md:grid-cols-2">
          {d.program.map((p) => (
            <li key={p.slug}>
              {p.ders ? (
                <Link
                  href={`${BEYIN_YOLU}/${d.id}/${p.slug}`}
                  className="panel group flex h-full gap-4 p-5 no-underline transition-colors hover:border-ink"
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold text-white"
                    style={{ background: d.renk }}
                  >
                    {p.sira}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-lg font-bold leading-snug group-hover:underline">{p.baslik}</span>
                    <span className="t-small text-ink-2">{p.ozet}</span>
                    <span className="t-meta mt-1">
                      Temel {dersSuresi(p.ders.bolumler, 'temel')} dk · Lisans {dersSuresi(p.ders.bolumler, 'lisans')} dk · Uzman{' '}
                      {dersSuresi(p.ders.bolumler, 'ileri')} dk
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="flex h-full gap-4 rounded-xl border border-dashed border-rule-strong p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] border-rule-strong font-display text-lg font-bold text-ink-3">
                    {p.sira}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-lg font-bold leading-snug text-ink-2">{p.baslik}</span>
                    <span className="t-small text-ink-3">{p.ozet}</span>
                    <span className="t-meta">Hazırlanıyor</span>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
