import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEGAL_DOCS, legalDocBySlug } from '@/content/legal';
import { renderMarkdown } from '@/lib/markdown';
import { fillCompany } from '@/lib/site';

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<'/yasal/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = legalDocBySlug(slug);
  return doc ? { title: doc.title, alternates: { canonical: `/yasal/${slug}` } } : {};
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
      </header>
      <div className="prose-olc" dangerouslySetInnerHTML={{ __html: renderMarkdown(fillCompany(doc.bodyMd)) }} />
    </article>
  );
}
