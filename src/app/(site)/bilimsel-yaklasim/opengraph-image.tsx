import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Ölçekhane: Bilimsel yaklaşımımız';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Bilimsel yaklaşımımız',
    subtitle: 'Hangi testleri neden kullanıyoruz, neleri bilerek kullanmıyoruz?',
    marker: 8.1,
  });
}
