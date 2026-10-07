import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * İçerik güvenliği politikası. Dış kaynaklardan komut dosyası, yazı tipi ya da görsel yüklenmez;
 * her şey kendi sunucumuzdan gelir. Next.js'in satır içi başlatma komutları için 'unsafe-inline'
 * gereklidir; geliştirme ortamında hızlı yenileme için 'unsafe-eval' eklenir.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Sesli okuma: kayıt yalnızca sayfanın belleğinde (blob:) tutulup oradan dinlenir.
  "media-src 'self' blob:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  // Paylaşım görselleri derleme sırasında üretilir; yine de sunucuda yeniden üretilmeleri gerekirse
  // yazı tipi dosyalarının bağımsız (standalone) çıktıda bulunmasını garanti eder.
  // PDF raporlarının yazı tipleri (src/assets/fonts) de aynı nedenle eklenir; PDF sunucuda üretilir.
  outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin*-700-normal.woff',
      './node_modules/@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin*-{400,700}-normal.woff',
      './src/assets/fonts/*.ttf',
    ],
  },
  // Test adları değişince eski adresler kalıcı olarak yenisine yönlendirilir (arama motorları ve paylaşılmış bağlantılar için).
  async redirects() {
    return [
      { source: '/testler/matematik-tani-testi', destination: '/testler/matematik-konu-tarama-testi', permanent: true },
      { source: '/testler/matematik-tani-testi/:rest*', destination: '/testler/matematik-konu-tarama-testi/:rest*', permanent: true },
      // 2026-10-07'de indirilen Okuma Hızı ve Anlama PDF'lerinde rehber yazısının adresi yanlış basıldı.
      { source: '/rehber/okuma-hizi-ve-anlama', destination: '/rehber/okuma-hizi-ve-okudugunu-anlama', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            // Mikrofon yalnızca kendi sayfalarımızda açılabilir (sesli okuma); kayıt cihazdan çıkmaz.
            value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
