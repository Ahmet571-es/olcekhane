import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane Rehber';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Rehber',
    subtitle: 'Kişilik, öğrenme, sınav kaygısı ve meslek seçimi üzerine araştırmalara dayanan sade yazılar.',
    marker: 2.6,
  });
}
