/**
 * Girişten sonra dönülecek yol: yalnızca site içi yolları kabul eder, dış adreslere yönlendirmeyi
 * önler (“//site.com”, “/\\site.com” ve denetim karakterli yollar reddedilir).
 */
export function safeNextPath(next: unknown): string | null {
  const v = typeof next === 'string' ? next : '';
  if (!v.startsWith('/') || v.startsWith('//') || v.startsWith('/\\')) return null;
  if (/[\u0000-\u001f\u007f]/.test(v) || v.length > 500) return null;
  return v;
}
