import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource/atkinson-hyperlegible-next/400.css';
import '@fontsource/atkinson-hyperlegible-next/700.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from '@/lib/config';
import { OG_DEFAULTS, indexingAllowed } from '@/lib/seo';

/*
 * Sayfalar istek anında üretilir: site adresi (APP_URL), dizine ekleme ayarı (ALLOW_INDEXING) ve
 * aydınlatma metniyle altbilgideki şirket bilgileri (COMPANY_*) sunucunun çalışırken okuduğu ortam
 * değişkenlerinden gelir. Derleme anında sayfalara gömülselerdi Docker görüntüsü .env dosyası olmadan
 * derlendiği için boş kalır, .env değişince de güncellenmezdi.
 */
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${SITE_NAME}: ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: { ...OG_DEFAULTS, type: 'website' },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false },
    robots: indexingAllowed() ? undefined : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f5f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1424' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <html lang="tr">
      <body className="min-h-dvh antialiased">
        <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
