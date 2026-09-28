import { GUIDE_CATEGORIES, allGuides, guideBySlug } from '@/content/rehber';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane rehber yazısı';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const dynamicParams = false;

export function generateStaticParams() {
  return allGuides().map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return renderOgImage({ title: 'Rehber' });
  return renderOgImage({ eyebrow: `Rehber · ${GUIDE_CATEGORIES[g.category]}`, title: g.title, marker: 3.4 });
}
