/** Oturum listesinde cihazı tanıtmak için kaba ama anlaşılır bir tarayıcı/işletim sistemi adı. */
export function describeAgent(ua: string | null | undefined): string {
  if (!ua) return 'Bilinmeyen cihaz';
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\/|Opera/.test(ua)
      ? 'Opera'
      : /YaBrowser/.test(ua)
        ? 'Yandex Browser'
        : /SamsungBrowser/.test(ua)
          ? 'Samsung Internet'
          : /Firefox\//.test(ua)
            ? 'Firefox'
            : /Chrome\/|CriOS/.test(ua)
              ? 'Chrome'
              : /Safari\//.test(ua)
                ? 'Safari'
                : null;
  const os = /iPhone/.test(ua)
    ? 'iPhone'
    : /iPad/.test(ua)
      ? 'iPad'
      : /Android/.test(ua)
        ? 'Android'
        : /Windows/.test(ua)
          ? 'Windows'
          : /Mac OS X|Macintosh/.test(ua)
            ? 'Mac'
            : /CrOS/.test(ua)
              ? 'Chromebook'
              : /Linux/.test(ua)
                ? 'Linux'
                : null;
  if (browser && os) return `${browser}, ${os}`;
  return browser ?? os ?? 'Bilinmeyen cihaz';
}

/** IP adresinin yalnızca ilk kısmını gösterir (ör. 85.105.x.x); tam adres ekrana yazılmaz. */
export function maskIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const v4 = ip.replace(/^::ffff:/, '');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(v4)) {
    const [a, b] = v4.split('.');
    return `${a}.${b}.x.x`;
  }
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    return `${parts.slice(0, 2).join(':')}:…`;
  }
  return null;
}
