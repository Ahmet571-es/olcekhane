/**
 * Sağlık denetimi (Docker ve çalışma süresi izleme için): uygulama ayaktaysa 200 döner. Başka bilgi
 * vermez.
 */
export function GET() {
  return Response.json({ durum: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
