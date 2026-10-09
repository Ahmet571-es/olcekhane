import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * İçerik güvenliği politikası. Dış kaynaklardan komut dosyası, yazı tipi ya da görsel yüklenmez;
 * her şey kendi sunucumuzdan gelir. Next.js'in satır içi başlatma komutları için 'unsafe-inline'
 * gereklidir; geliştirme ortamında hızlı yenileme için 'unsafe-eval' eklenir. 'wasm-unsafe-eval' yalnızca
 * WebAssembly derlemesine izin verir (sesli okumada otomatik analiz: konuşma tanıma modeli tarayıcıda, ONNX Runtime
 * Web ile çalışır); JavaScript'te eval açılmaz. Worker'lar (analiz ve ONNX Runtime'ın iş parçacıkları) yalnızca
 * kendi sunucumuzdaki dosyalardan açılır.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''}`,
  "worker-src 'self'",
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
      // Beyin Akademisi 2026-10-08'de iki daldan sekiz bölüme geçti; "Beyin Nasıl Çalışır?" dalının yerini
      // "Hücreden Sinyale" bölümü aldı.
      { source: '/beyin-akademisi/nasil-calisir', destination: '/beyin-akademisi/hucre-ve-molekul', permanent: true },
      { source: '/beyin-akademisi/nasil-calisir/:rest*', destination: '/beyin-akademisi/hucre-ve-molekul', permanent: true },
      // 2026-10-09: kafatası dersleri yayından kaldırıldı (site sahibinin kararı: bölüm yalnızca beyni anlatır). Geri
      // gelebilecekleri için yönlendirme geçicidir.
      { source: '/beyin-akademisi/anatomi/kafatasi', destination: '/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis', permanent: false },
      { source: '/beyin-akademisi/anatomi/kafatasinin-kemikleri', destination: '/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis', permanent: false },
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
      // Sesli okumada otomatik analiz: konuşma tanıma modeli çok iş parçacığıyla (SharedArrayBuffer) ancak sayfa
      // "cross-origin isolated" olduğunda çalışır: COOP (yukarıda, bütün sitede) ve COEP birlikte. COEP yalnızca
      // test sayfasında açılır (yalnızca sayfa tam yüklenince geçerli olur; site içinde bağlantıyla gelinince önceki sayfanınki kalır).
      // Sayfanın açtığı Worker'ların betikleri de aynı COEP'i taşımalı; yoksa tarayıcı Worker'ı yüklemez.
      ...[
        '/testler/sesli-okuma-degerlendirmesi/coz',
        '/okuma/analiz-isci.js',
        '/ort/:path*',
        '/vendor/:path*',
      ].map((source) => ({
        source,
        headers: [{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' }],
      })),
      // Model ve çalışma dosyaları büyüktür ve adresleri sürümlerini içerir (src/lib/oral/auto.ts): tarayıcı bir kez
      // indirip HTTP önbelleğinde tutabilir; sürüm değişince adres de değişir.
      // Beyin Akademisi'nin üç boyutlu modeli de sürümlü adreste durur (araclar/beyin-modeli.mjs).
      ...['/model/:path*', '/ort/:path*', '/vendor/:path*', '/beyin/model/:path*'].map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      })),
    ];
  },
};

export default nextConfig;
