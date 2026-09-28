import type { Metadata } from 'next';
import { SITE_NAME, siteUrl } from './config';

/**
 * Sayfa üst verisi yardımcıları.
 *
 * Next.js üst verileri katmanlar arasında sığ birleştirir: bir sayfa `openGraph` tanımlarsa kök
 * düzendeki `openGraph` alanlarının tamamı düşer. Bu yüzden her herkese açık sayfa, site adı ve dil
 * gibi ortak alanları bu yardımcıyla yeniden ekler.
 */
export const OG_DEFAULTS = { siteName: SITE_NAME, locale: 'tr_TR' } as const;

/** Arama motorlarına açık mı? Hazırlık (staging) sunucularında ALLOW_INDEXING=false verilir. */
export function indexingAllowed(): boolean {
  return (process.env.ALLOW_INDEXING ?? 'true').toLowerCase() !== 'false';
}

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  /** Başlığa " | Ölçekhane" eklenmesin. */
  absoluteTitle?: boolean;
  ogTitle?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Sayfanın klasöründe kendi opengraph-image dosyası var: varsayılan görsel eklenmez. */
  ownImage?: boolean;
}): Metadata {
  const { title, description, path, absoluteTitle, ogTitle, type = 'website' } = opts;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...OG_DEFAULTS,
      type,
      url: path,
      title: ogTitle ?? title,
      description,
      // Kök düzendeki paylaşım görseli, sayfa kendi openGraph'ını tanımlayınca düşer; burada yeniden
      // eklenir. Bu alan dosya tabanlı görseli de ezdiği için kendi görseli olan sayfalar ownImage verir.
      ...(opts.ownImage ? {} : { images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }] }),
      ...(type === 'article'
        ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime, authors: opts.authors }
        : {}),
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: siteUrl(it.path),
    })),
  };
}
