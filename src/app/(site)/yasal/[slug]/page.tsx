import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEGAL_DOCS, legalDocBySlug } from '@/content/legal';
import { renderMarkdown } from '@/lib/markdown';
import { pageMeta } from '@/lib/seo';
import { fillOwner } from '@/lib/site';
import { PageGuide } from '@/components/site/page-guide';

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<'/yasal/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = legalDocBySlug(slug);
  return doc ? pageMeta({ title: doc.title, description: doc.summary, path: `/yasal/${slug}` }) : {};
}

export default async function LegalPage(props: PageProps<'/yasal/[slug]'>) {
  const { slug } = await props.params;
  const doc = legalDocBySlug(slug);
  if (!doc) notFound();
  return (
    <article className="container-page py-12 md:py-16">
      <header className="mb-10 flex max-w-3xl flex-col gap-2">
        <h1 className="t-h1">{doc.title}</h1>
        <p className="t-meta">Sürüm {doc.version}</p>
        <PageGuide className="mt-4" next={[{ href: '/iletisim', label: 'Soru sormak için İletişim' }]}>
          <p>
            Bu sayfa sitenin hukuki metnidir. Kısaca: hesap yoktur, test cevapları kaydedilmez, çerez kullanılmaz. Ayrıntılar aşağıda.
          </p>
        </PageGuide>
      </header>
      <div className="prose-olc" dangerouslySetInnerHTML={{ __html: renderMarkdown(fillOwner(doc.bodyMd)) }} />
    </article>
  );
}
