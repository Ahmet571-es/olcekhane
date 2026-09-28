import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { GuideList } from '@/components/site/guide-list';
import { expertBySlug } from '@/content/experts';
import { getInstrumentDef } from '@/content/instruments';
import { GUIDE_CATEGORIES, allGuides, guideBySlug, relatedGuides } from '@/content/rehber';
import { readingMinutes, renderArticle } from '@/lib/article';
import { SITE_NAME, gradeRangeLabel, siteUrl } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return allGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<'/rehber/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const g = guideBySlug(slug);
  if (!g) return {};
  const author = expertBySlug(g.authorSlug);
  return pageMeta({
    title: g.metaTitle ?? g.title,
    ogTitle: g.title,
    description: g.description,
    path: `/rehber/${g.slug}`,
    type: 'article',
    publishedTime: g.publishedAt,
    modifiedTime: g.updatedAt,
    authors: author ? [author.fullName] : undefined,
    ownImage: true,
  });
}

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
const fmt = (iso: string) => dateFmt.format(new Date(`${iso}T12:00:00+03:00`));

export default async function GuidePage(props: PageProps<'/rehber/[slug]'>) {
  const { slug } = await props.params;
  const g = guideBySlug(slug);
  if (!g) notFound();

  const { html, toc } = renderArticle(g.body);
  const minutes = readingMinutes(g.body);
  const author = expertBySlug(g.authorSlug);
  const reviewer = expertBySlug(g.reviewerSlug);
  const tests = (g.relatedTests ?? [])
    .map((s) => getInstrumentDef(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d && (d.status === 'active' || d.status === 'pilot')));
  const related = relatedGuides(g, 3);
  const url = siteUrl(`/rehber/${g.slug}`);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    inLanguage: 'tr-TR',
    datePublished: g.publishedAt,
    dateModified: g.updatedAt,
    mainEntityOfPage: url,
    articleSection: GUIDE_CATEGORIES[g.category],
    author: author
      ? { '@type': 'Person', name: author.fullName, jobTitle: author.title, url: siteUrl(`/uzmanlar/${author.slug}`) }
      : { '@type': 'Organization', name: `${SITE_NAME} Editörlüğü`, url: siteUrl('/hakkimizda') },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl('/'), logo: { '@type': 'ImageObject', url: siteUrl('/icon-512.png') } },
    citation: g.sources.map((s) => s.text),
  };

  return (
    <article className="container-page py-12 md:py-16">
      <JsonLd data={articleLd} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Rehber', path: '/rehber' },
          { name: g.title, path: `/rehber/${g.slug}` },
        ])}
      />
      <nav aria-label="Konum" className="t-small mb-8 text-ink-3">
        <Link href="/rehber">Rehber</Link> <span aria-hidden="true">/</span>{' '}
        <Link href={`/rehber#${g.category}`}>{GUIDE_CATEGORIES[g.category]}</Link>
      </nav>

      <header className="flex max-w-4xl flex-col gap-5 border-b border-rule pb-10">
        <h1 className="t-h1">{g.title}</h1>
        <p className="t-lede measure">{g.description}</p>
        <p className="t-meta flex flex-wrap gap-x-3 gap-y-1">
          <span>
            {author ? (
              <>
                Yazar: <Link href={`/uzmanlar/${author.slug}`}>{author.fullName}</Link>
              </>
            ) : (
              <>{SITE_NAME} Editörlüğü</>
            )}
          </span>
          {reviewer && (
            <span>
              · İnceleyen: <Link href={`/uzmanlar/${reviewer.slug}`}>{reviewer.fullName}</Link>
            </span>
          )}
          <span>
            · Güncelleme: <time dateTime={g.updatedAt}>{fmt(g.updatedAt)}</time>
          </span>
          <span>· {minutes} dakikalık okuma</span>
        </p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-10">
          <section aria-labelledby="kisaca" className="measure rounded-xl border border-rule border-l-4 border-l-brass bg-surface p-6">
            <h2 id="kisaca" className="mb-3 font-body text-base font-bold tracking-normal">
              Kısaca
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {g.keyPoints.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </section>

          <div className="prose-olc" dangerouslySetInnerHTML={{ __html: html }} />

          {g.healthNotice && (
            <div className="notice notice-info measure">
              <p>
                Bu yazı genel bilgilendirme amaçlıdır; bir tanı ya da tedavi önerisi değildir ve bir uzmanla görüşmenin yerini tutmaz.
              </p>
            </div>
          )}

          {tests.length > 0 && (
            <section aria-labelledby="ilgili-test" className="panel measure flex flex-col gap-4 p-6">
              <h2 id="ilgili-test" className="font-body text-base font-bold tracking-normal">
                Bu konuyla ilgili test
              </h2>
              <ul className="flex flex-col gap-4">
                {tests.map((t) => (
                  <li key={t.slug} className="flex flex-col gap-1">
                    <Link href={`/testler/${t.slug}`} className="font-display text-lg font-bold">
                      {t.name}
                    </Link>
                    <span className="text-ink-2">{t.tagline}</span>
                    <span className="t-meta">
                      Yaklaşık {t.estimatedMinutes} dakika · {gradeRangeLabel(t.minGrade, t.maxGrade)}
                      {t.isFree ? ' · ücretsiz' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="kaynaklar" className="measure">
            <h2 id="kaynaklar" className="t-h3 mb-4">
              Kaynaklar
            </h2>
            <ol className="flex list-decimal flex-col gap-3 pl-5 text-[0.95rem] text-ink-2">
              {g.sources.map((s) => (
                <li key={s.text}>
                  {s.text}{' '}
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all">
                      {s.url.replace(/^https:\/\//, '')}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <p className="t-meta measure">
            Bu yazı, kaynaklarda listelenen hakemli araştırmalara ve kurum yayınlarına dayanılarak hazırlanmıştır. İlk yayın:{' '}
            <time dateTime={g.publishedAt}>{fmt(g.publishedAt)}</time>. Bir hata fark ederseniz{' '}
            <Link href="/iletisim?konu=other">bize yazın</Link>.
          </p>
        </div>

        {toc.length > 2 && (
          <aside className="hidden lg:block" aria-label="Bu yazıda">
            <nav className="sticky top-8 flex flex-col gap-3 border-l border-rule pl-5">
              <p className="t-meta font-bold uppercase tracking-[0.06em]">Bu yazıda</p>
              <ol className="flex flex-col gap-2 text-[0.9375rem]">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-ink-2 no-underline hover:text-ink hover:underline">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="diger-yazilar" className="mt-16 border-t border-rule pt-12">
          <h2 id="diger-yazilar" className="t-h2 mb-6">
            Diğer yazılar
          </h2>
          <GuideList guides={related} />
        </section>
      )}
    </article>
  );
}
