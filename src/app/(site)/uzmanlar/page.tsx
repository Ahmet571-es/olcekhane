import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/site/page-header';
import { EXPERTS } from '@/content/experts';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Uzman kadromuz',
  description: 'Ölçekhane bilim kurulu ve rehber yazılarını inceleyen uzmanlar: unvanları, uzmanlık alanları ve özgeçmişleri.',
  path: '/uzmanlar',
});

export default function ExpertsPage() {
  if (EXPERTS.length === 0) notFound();
  return (
    <>
      <PageHeader
        title="Uzman kadromuz"
        lede="Testlerin seçimi, Türkçe uyarlamaları ve rehber yazıları alanında uzman kişiler tarafından incelenir."
      />
      <div className="container-page py-14">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTS.map((e) => (
            <li key={e.slug} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
              <Link href={`/uzmanlar/${e.slug}`} className="font-display text-xl font-bold">
                {e.fullName}
              </Link>
              <span className="text-ink-2">{e.title}</span>
              <span className="t-meta">{e.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
