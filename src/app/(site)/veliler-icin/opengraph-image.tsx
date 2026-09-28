import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane: Veliler için';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Veliler için',
    subtitle: 'Çocuğunuzu bilimsel testlerle tanıyın; raporu onunla nasıl konuşacağınızı öğrenin.',
    marker: 7.6,
  });
}
