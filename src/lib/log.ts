/**
 * Sunucu günlüğüne ya da görev kayıtlarına yazılacak hata özeti. Drizzle'ın sorgu hataları iletide
 * sorgu parametrelerini (ör. e-posta ve IP adresleri) taşır; özet yalnızca yer tutuculu sorgu metnini,
 * PostgreSQL hata kodunu ve ayrıntı satırı içermeyen hata iletisini verir.
 */
export function errorSummary(err: unknown): string {
  if (!(err instanceof Error)) return String(err).slice(0, 300);
  const e = err as Error & { query?: unknown; params?: unknown; cause?: unknown };
  if (isQueryError(e)) {
    const cause = e.cause as { code?: unknown; message?: unknown } | undefined;
    const code = typeof cause?.code === 'string' ? ` [${cause.code}]` : '';
    const message = typeof cause?.message === 'string' ? cause.message : 'sorgu başarısız';
    return `${message}${code} — sorgu: ${String(e.query).replace(/\s+/g, ' ').slice(0, 300)}`;
  }
  return `${e.name}: ${e.message}`.slice(0, 500);
}

function isQueryError(e: Error): e is Error & { query: string; params: unknown } {
  return typeof (e as { query?: unknown }).query === 'string' && 'params' in e;
}

/**
 * Günlüğe yazılacak değer bir sorgu hatasıysa, parametreleri ve PostgreSQL ayrıntısı olmadan yeniden
 * kurulur (yığın izi ve Next.js hata kimliği korunur). Diğer değerler olduğu gibi döner.
 */
export function sanitizeForLog(value: unknown): unknown {
  if (!(value instanceof Error) || !isQueryError(value)) return value;
  const clean = new Error(errorSummary(value));
  clean.name = value.name;
  const frames = (value.stack ?? '').split('\n').filter((line) => /^\s+at /.test(line));
  clean.stack = [`${clean.name}: ${clean.message}`, ...frames].join('\n');
  const digest = (value as { digest?: unknown }).digest;
  if (digest !== undefined) Object.assign(clean, { digest });
  return clean;
}

const LOG_SANITIZER = Symbol.for('olcekhane.logSanitizer');

/**
 * console.error'u, sorgu hatalarını parametrelerinden arındıracak biçimde sarar. Next.js beklenmeyen
 * sunucu hatalarını console.error ile yazar; böylece bu hatalar da kapsayıcı günlüğüne kişisel veri
 * taşımaz. Sunucu açılışında bir kez çağrılır (instrumentation).
 */
export function installLogSanitizer(): void {
  const g = globalThis as unknown as Record<symbol, boolean>;
  if (g[LOG_SANITIZER]) return;
  g[LOG_SANITIZER] = true;
  const original = console.error.bind(console);
  console.error = (...args: unknown[]) => original(...args.map(sanitizeForLog));
}
