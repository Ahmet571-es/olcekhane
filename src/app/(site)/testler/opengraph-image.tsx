import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane: Testler';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Testler',
    subtitle: 'Kişilik, ilgi ve öğrenme testleri. Her testin kaynağı, güvenirliği ve sınırları açıkça yazılı.',
    marker: 6.4,
  });
}
