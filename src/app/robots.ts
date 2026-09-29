import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';
import { indexingAllowed } from '@/lib/seo';

// ALLOW_INDEXING ve APP_URL sunucu çalışırken okunur (derleme anında değil).
export const dynamic = 'force-dynamic';

/**
 * Hesaba bağlı alanlar (panel, test uygulaması, yönetim, API) taranmaz. Giriş ve kayıt sayfaları
 * taranabilir ama "noindex" etiketi taşır; engellenirse arama motoru bu etiketi göremez.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/panel', '/uygulama', '/yonetim', '/api/', '/ogrenci/', '/eposta-dogrula'],
    },
    sitemap: siteUrl('/sitemap.xml'),
  };
}
