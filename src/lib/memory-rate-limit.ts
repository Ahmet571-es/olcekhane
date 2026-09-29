import 'server-only';

/**
 * Bellekte tutulan sabit pencereli hız sınırı. Hızlı testte hiçbir şey saklanmadığı için istemci adresi
 * veritabanına da yazılmaz; yalnızca pencere süresince bu süreçte tutulur. Süresi dolan sayaçlar her
 * dakika silinir: 10 dakikalık bir sayaç en geç 11 dakika sonra bellekten çıkar (aydınlatma metni bu
 * süreyi söyler). Uygulama tek süreç olarak çalıştığından (bkz. docker-compose.yml) sayaç bütün
 * istekleri görür.
 */
const buckets = new Map<string, { count: number; start: number; windowMs: number }>();
const SWEEP_MS = 60_000;
let lastSweep = 0;
let timer: ReturnType<typeof setInterval> | null = null;

function sweep(now: number) {
  for (const [k, b] of buckets) if (now - b.start >= b.windowMs) buckets.delete(k);
  lastSweep = now;
}

/** Sayaç varken dakikada bir temizlik yapar; sayaç kalmayınca durur. Süreci açık tutmaz. */
function ensureSweeper() {
  if (timer) return;
  timer = setInterval(() => {
    sweep(Date.now());
    if (buckets.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, SWEEP_MS);
  timer.unref?.();
}

export function memoryRateLimit(key: string, limit: number, windowSeconds: number, now = Date.now()): boolean {
  if (now - lastSweep > SWEEP_MS) sweep(now);
  const windowMs = windowSeconds * 1000;
  const b = buckets.get(key);
  if (!b || now - b.start >= b.windowMs) {
    buckets.set(key, { count: 1, start: now, windowMs });
    ensureSweeper();
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/** Testler için: bellekteki sayaç sayısı. */
export function memoryRateLimitSize(): number {
  return buckets.size;
}

/** Testler için. */
export function resetMemoryRateLimit() {
  buckets.clear();
  lastSweep = 0;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
