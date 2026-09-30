import { getInstrumentDef, solvableInstruments } from '@/content/instruments';
import { DOMAIN_LABELS } from '@/lib/config';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane test tanıtımı';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const dynamicParams = false;

export function generateStaticParams() {
  return solvableInstruments().map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = getInstrumentDef(slug);
  if (!def) return renderOgImage({ title: 'Testler' });
  return renderOgImage({
    eyebrow: `${DOMAIN_LABELS[def.domain]} · yaklaşık ${def.estimatedMinutes} dakika${def.isFree ? ' · ücretsiz' : ''}`,
    title: def.name,
    subtitle: def.tagline,
    marker: 5.8,
  });
}
