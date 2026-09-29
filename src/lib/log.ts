/**
 * Sunucu günlüğüne yazılacak hata özeti: yalnızca hatanın türü ve iletisi (en çok 300 karakter).
 * İstek gövdesi (test cevapları) ya da rapor metni günlüğe yazılmaz.
 */
export function errorSummary(err: unknown): string {
  if (!(err instanceof Error)) return String(err).slice(0, 300);
  return `${err.name}: ${err.message}`.slice(0, 300);
}
