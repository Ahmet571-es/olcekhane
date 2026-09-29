import { NextResponse, type NextRequest } from 'next/server';

/**
 * İyimser oturum kontrolü: korunan sayfalara oturum çerezi olmadan gelen ziyaretçiyi giriş
 * sayfasına yönlendirir. Asıl yetki kontrolü her sayfada ve API'de veritabanıyla yapılır.
 */
const PROTECTED = ['/panel', '/uygulama', '/yonetim', '/ogrenci', '/okul', '/hesap'];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();
  if (req.cookies.has('olc_oturum')) return NextResponse.next();
  const target = pathname.startsWith('/ogrenci') ? '/ogrenci-girisi' : '/giris';
  const url = new URL(target, req.url);
  url.searchParams.set('sonra', `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/panel/:path*', '/uygulama/:path*', '/yonetim/:path*', '/ogrenci/:path*', '/okul/:path*', '/hesap/:path*'],
};
