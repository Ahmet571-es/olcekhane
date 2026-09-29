/**
 * Sunucu günlüğüne ya da görev kayıtlarına yazılacak hata özeti. Drizzle'ın sorgu hataları iletide
 * sorgu parametrelerini (ör. e-posta ve IP adresleri) taşır; özet yalnızca yer tutuculu sorgu metnini,
 * PostgreSQL hata kodunu ve ayrıntı satırı içermeyen hata iletisini verir.
 */
export function errorSummary(err: unknown): string {
  if (!(err instanceof Error)) return String(err).slice(0, 300);
  const e = err as Error & { query?: unknown; params?: unknown; cause?: unknown };
  if (typeof e.query === 'string' && 'params' in e) {
    const cause = e.cause as { code?: unknown; message?: unknown } | undefined;
    const code = typeof cause?.code === 'string' ? ` [${cause.code}]` : '';
    const message = typeof cause?.message === 'string' ? cause.message : 'sorgu başarısız';
    return `${message}${code} — sorgu: ${e.query.replace(/\s+/g, ' ').slice(0, 300)}`;
  }
  return `${e.name}: ${e.message}`.slice(0, 500);
}
