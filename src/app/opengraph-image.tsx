import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane: Öğrenciler için bilimsel kişilik, ilgi ve öğrenme testleri';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Tahmin değil, ölçüm.',
    subtitle: 'Öğrenciler için bilimsel kişilik, ilgi ve öğrenme testleri. Sonuçlar öğrenciye ve veliye sade bir dille.',
  });
}
