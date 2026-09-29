import 'server-only';
import { processEmailQueue } from '@/lib/email/send';
import { errorSummary } from '@/lib/log';
import { lastSuccessfulRun, runPurgeJob } from './purge';

const HOUR = 3600_000;
const MINUTE = 60_000;
const globalForJobs = globalThis as unknown as {
  __olcekhaneJobs?: ReturnType<typeof setInterval>;
  __olcekhaneMail?: ReturnType<typeof setInterval>;
};

/**
 * Sunucu içinde çalışan basit zamanlayıcı:
 * - saatte bir, son başarılı temizlik 20 saatten eskiyse temizlik görevini çalıştırır;
 * - dakikada bir, kuyrukta bekleyen e-postaları gönderim sınırı izin verdiği kadar gönderir.
 * Birden çok sunucu örneği varsa veritabanı kilitleri görevlerin aynı işi iki kez yapmasını önler.
 * Dışarıdan zamanlayıcı (cron) gerekmez.
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
      console.error(`[görevler] temizlik başarısız: ${errorSummary(err)}`);
    }
  };
  globalForJobs.__olcekhaneJobs = setInterval(tick, HOUR);
  // Sunucu açıldıktan kısa süre sonra ilk denetim.
  setTimeout(tick, MINUTE);

  let mailBusy = false;
  const mailTick = async () => {
    if (mailBusy) return;
    mailBusy = true;
    try {
      const n = await processEmailQueue();
      if (n > 0) log(`kuyruktan ${n} e-posta gönderimi denendi`);
    } catch (err) {
      console.error(`[görevler] e-posta kuyruğu: ${errorSummary(err)}`);
    } finally {
      mailBusy = false;
    }
  };
  globalForJobs.__olcekhaneMail = setInterval(mailTick, MINUTE);
}
