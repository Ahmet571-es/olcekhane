import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane: Okullar ve rehberlik servisleri için';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Okullar ve rehberlik servisleri için',
    subtitle: 'Çevrim içi veli onayı, rehber öğretmene bireysel rapor, öğretmenlere grup özeti.',
    marker: 4.8,
  });
}
