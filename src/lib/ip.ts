/**
 * Hız sınırları için IP “kovası”. IPv6’da bir ev ya da abonelik genellikle bütün bir /64 bloğunu
 * kullanır; adresin tamamına göre sayılırsa tek bir cihaz sayısız adres üretip sınırları aşabilir.
 * Bu yüzden IPv6 adresleri /64 önekine, IPv4 (ve IPv4 eşlemeli IPv6) adresleri kendisine indirgenir.
 */
export function ipBucket(ip: string | null | undefined): string {
  if (!ip) return 'bilinmiyor';
  const v = ip.trim().replace(/^\[|\]$/g, '');
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(v);
  if (mapped) return mapped[1];
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(v)) return v;
  if (!v.includes(':')) return v;
  const [head, tail] = v.split('::');
  const h = head ? head.split(':') : [];
  const t = tail !== undefined && tail !== '' ? tail.split(':') : [];
  const groups = tail !== undefined ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h;
  if (groups.length < 4) return v.toLowerCase();
  return `${groups
    .slice(0, 4)
    .map((g) => (g || '0').toLowerCase().replace(/^0+(?=.)/, ''))
    .join(':')}::/64`;
}
