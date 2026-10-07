import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { EXPERTS, expertBySlug } from '@/content/experts';
import { guidesByExpert } from '@/content/rehber';
import { siteUrl } from '@/lib/config';
import { pageMeta } from '@/lib/seo';
import { PageGuide } from '@/components/site/page-guide';

export const dynamicParams = false;

export function generateStaticParams() {
  return EXPERTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: PageProps<'/uzmanlar/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const e = expertBySlug(slug);
  if (!e) return {};
  return pageMeta({ title: `${e.fullName}, ${e.title}`, description: e.bio.slice(0, 155), path: `/uzmanlar/${slug}` });
}

export default async function ExpertPage(props: PageProps<'/uzmanlar/[slug]'>) {
  const { slug } = await props.params;
  const e = expertBySlug(slug);
  if (!e) notFound();
  const guides = guidesByExpert(e.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: siteUrl(`/uzmanlar/${e.slug}`),
    mainEntity: {
      '@type': 'Person',
      name: e.fullName,
      jobTitle: e.title,
      description: e.bio,
      sameAs: e.links?.map((l) => l.url),
      worksFor: { '@type': 'Organization', name: 'Ölçekhane', url: siteUrl('/') },
    },
  };
  return (
    <article className="container-page py-12 md:py-16">
      <JsonLd data={jsonLd} />
      <nav aria-label="Konum" className="t-small mb-8 text-ink-3">
        <Link href="/uzmanlar">Uzman kadromuz</Link>
      </nav>
      <header className="flex max-w-3xl flex-col gap-3 border-b border-rule pb-10">
        <h1 className="t-h1">{e.fullName}</h1>
        <p className="t-lede">{e.title}</p>
        <p className="t-meta">{e.role}</p>
        <PageGuide next={[{ href: '/uzmanlar', label: 'Bütün uzmanlar' }, { href: '/rehber', label: 'Rehber yazıları' }]}>
          <p>Bu sayfada uzmanımızın özgeçmişini, yazdığı ve incelediği yazıları bulabilirsiniz.</p>
        </PageGuide>
      </header>
      <div className="grid gap-12 pt-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="prose-olc">
          {e.bio.split('\n\n').map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          {guides.length > 0 && (
            <>
              <h2>Yazıları ve incelediği yazılar</h2>
              <ul>
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/rehber/${g.slug}`}>{g.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <aside className="flex flex-col gap-6">
          {e.credentials.length > 0 && (
            <div>
              <h2 className="mb-2 font-body text-base font-bold">Eğitim ve yetkinlikler</h2>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-ink-2">
                {e.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {e.links && e.links.length > 0 && (
            <div>
              <h2 className="mb-2 font-body text-base font-bold">Bağlantılar</h2>
              <ul className="flex flex-col gap-1">
                {e.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
