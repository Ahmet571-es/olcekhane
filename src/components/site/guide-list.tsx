import Link from 'next/link';
import type { Guide } from '@/content/rehber';
import { GUIDE_CATEGORIES } from '@/content/rehber';
import { readingMinutes } from '@/lib/article';

/** Rehber yazılarının liste görünümü: kategori, başlık, açıklama ve okuma süresi. */
export function GuideList({ guides, showCategory = true }: { guides: Guide[]; showCategory?: boolean }) {
  return (
    <ul className="flex flex-col divide-y divide-rule border-y border-rule">
      {guides.map((g) => (
        <li key={g.slug} className="py-5">
          <article className="flex flex-col gap-1.5">
            {showCategory && <p className="t-meta font-bold text-brass-ink">{GUIDE_CATEGORIES[g.category]}</p>}
            <h3 className="t-h3">
              <Link href={`/rehber/${g.slug}`} className="no-underline hover:underline">
                {g.title}
              </Link>
            </h3>
            <p className="measure text-ink-2">{g.description}</p>
            <p className="t-meta">{readingMinutes(g.body)} dakikalık okuma</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
