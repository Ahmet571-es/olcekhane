import 'server-only';
import { lastSuccessfulRun, runPurgeJob } from './purge';

const HOUR = 3600_000;
const globalForJobs = globalThis as unknown as { __olcekhaneJobs?: ReturnType<typeof setInterval> };

/**
 * Sunucu içinde çalışan basit zamanlayıcı: saatte bir, son başarılı temizlik 20 saatten eskiyse görevi
 * çalıştırır. Birden çok sunucu örneği varsa veritabanı kilidi görevin aynı anda tek bir yerde
 * çalışmasını sağlar. Dışarıdan zamanlayıcı (cron) gerekmez.
 */
export function startScheduler(log: (m: string) => void = console.log): void {
  if (globalForJobs.__olcekhaneJobs) return;
  const tick = async () => {
    try {
      const last = await lastSuccessfulRun();
      if (last && Date.now() - last.getTime() < 20 * HOUR) return;
      const report = await runPurgeJob('zamanlayıcı');
      if (report) {
        const done = Object.entries(report).filter(([, n]) => n > 0);
        log(`temizlik tamam${done.length ? `: ${done.map(([k, n]) => `${k}=${n}`).join(', ')}` : ' (silinecek kayıt yoktu)'}`);
      }
    } catch (err) {
      console.error('[görevler] temizlik başarısız', err);
    }
  };
  globalForJobs.__olcekhaneJobs = setInterval(tick, HOUR);
  // Sunucu açıldıktan kısa süre sonra ilk denetim.
  setTimeout(tick, 60_000);
}
