export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  // Test tanımlarını ve hukuki metinleri veritabanına eşitle.
  if (process.env.SYNC_ON_START !== 'false') {
    try {
      const { syncDefinitions } = await import('./lib/instruments/sync');
      await syncDefinitions((m) => console.log(`[tanımlar] ${m}`));
    } catch (err) {
      console.error('[tanımlar] eşitleme başarısız', err);
    }
  }

  // Zamanlanmış görevler (günlük temizlik): üretimde varsayılan olarak açık, geliştirmede
  // SCHEDULED_JOBS=true ile açılır. Birden çok sunucu örneğinde yalnızca birinde açık tutmak yeterlidir.
  const jobs = process.env.SCHEDULED_JOBS ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false');
  if (jobs !== 'false') {
    const { startScheduler } = await import('./lib/jobs/scheduler');
    startScheduler((m) => console.log(`[görevler] ${m}`));
  }
}
