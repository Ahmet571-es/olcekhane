import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';
import { indexingAllowed } from '@/lib/seo';

// ALLOW_INDEXING ve APP_URL sunucu çalışırken okunur (derleme anında değil).
export const dynamic = 'force-dynamic';

/**
 * API uçları taranmaz. Test çözme sayfaları (/testler/.../coz) taranabilir ama "noindex" etiketi taşır;
 * engellenirse arama motoru bu etiketi göremez.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: siteUrl('/sitemap.xml'),
  };
}
