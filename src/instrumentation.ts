export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;
  if (process.env.SYNC_ON_START === 'false') return;
  try {
    const { syncDefinitions } = await import('./lib/instruments/sync');
    await syncDefinitions((m) => console.log(`[tanımlar] ${m}`));
  } catch (err) {
    console.error('[tanımlar] eşitleme başarısız', err);
  }
}
