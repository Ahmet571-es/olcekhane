import 'server-only';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db, type Tx } from '@/db';
import { jobRuns } from '@/db/schema';
import { errorSummary } from '@/lib/log';

/**
 * Saklama süreleri. Aydınlatma metnindeki sözlerle uyumlu olmalıdır (src/content/legal: "Ne kadar
 * süre saklıyoruz?"). Görev her gün çalıştığı için "en geç 30 gün" sözü fazlasıyla karşılanır.
 */
export const RETENTION = {
  /** Silinmiş öğrenci profillerinin rıza kanıtı (rıza ve geri alma kayıtları, onay istekleri). */
  deletedProfileEvidenceDays: 730,
  /** Bu süre boyunca hiç cevap verilmeyen yarım uygulama "yarıda bırakıldı" sayılır. */
  stalledAttemptDays: 30,
  /** Yarıda bırakılmış uygulamalar, son cevaptan bu süre sonra silinir. */
  abandonedAttemptDays: 90,
  /** Gönderilemeyen e-postaların içeriği (tek kullanımlık bağlantılar içerir). */
  unsentEmailBodyDays: 30,
  /** E-posta gönderim kayıtları (alıcı ve konu). */
  emailLogDays: 90,
  /** Giriş denemeleri (IP adresiyle). */
  loginAttemptDays: 365,
  /** Denetim kaydı (işlem güvenliği). */
  auditLogDays: 730,
  /** İletişim formu mesajları. */
  contactMessageDays: 365,
  /** Kabul edilmiş, geri alınmış ya da süresi dolmuş okul davetleri. */
  finishedInviteDays: 90,
  /** Kullanılmış ya da süresi dolmuş doğrulama ve şifre yenileme belirteçleri. */
  finishedTokenDays: 30,
  /** Yanıtlanmamış ve süresi dolmuş veli onayı istekleri. */
  expiredConsentRequestDays: 30,
  /** Hız sınırı sayaçları (en uzun pencere 24 saat). */
  rateLimitHours: 48,
} as const;

export type PurgeReport = Record<string, number>;

/** Yönetim panelinde gösterilen adlar. */
export const PURGE_LABELS: Record<string, string> = {
  stalledAttempts: 'Yarıda bırakılmış sayılan uygulama',
  attempts: 'Silinen uygulama (cevaplar, puanlar ve raporlarla)',
  blankedSnapshots: 'İçeriği boşaltılan grup raporu',
  oldSnapshots: 'Silinen eski grup raporu',
  deletedProfileLinks: 'Silinmiş profillerden kaldırılan bağ',
  anonymizedProfiles: 'Anonimleştirilen silinmiş profil',
  expiredProfiles: 'Saklama süresi dolan silinmiş profil',
  expiredConsentRequests: 'Süresi dolmuş onay isteği',
  unsentEmailBodies: 'İçeriği silinen gönderilmemiş e-posta',
  emailLogs: 'Silinen e-posta kaydı',
  loginAttempts: 'Silinen giriş denemesi',
  auditLogs: 'Silinen denetim kaydı',
  contactMessages: 'Silinen iletişim mesajı',
  invites: 'Silinen okul daveti',
  authTokens: 'Silinen doğrulama belirteci',
  sessions: 'Silinen süresi dolmuş oturum',
  rateLimits: 'Silinen hız sınırı sayacı',
};

const PURGED_REPORT = sql`'{"format":0,"purged":true}'::jsonb`;

async function count(tx: Tx, query: ReturnType<typeof sql>): Promise<number> {
  const rows = await tx.execute<{ n: number }>(query);
  return Number(rows[0]?.n ?? 0);
}

/**
 * Temizlik adımları (tek veritabanı işleminde). Silinen uygulamaların cevapları, puanları, görev
 * kayıtları ve raporları veritabanı bağlarıyla birlikte silinir.
 */
async function purgeSteps(tx: Tx): Promise<PurgeReport> {
  const r: PurgeReport = {};
  const days = (n: number) => sql`now() - make_interval(days => ${n})`;

  // 1. Uzun süredir yarım kalan uygulamalar yarıda bırakılmış sayılır.
  r.stalledAttempts = await count(
    tx,
    sql`with x as (update attempts set status = 'abandoned'
          where status = 'in_progress' and last_activity_at < ${days(RETENTION.stalledAttemptDays)} returning 1)
        select count(*)::int as n from x`,
  );

  // 2. Geçersiz uygulamalar (rıza geri alındı ya da onay geçersiz sayıldı), silinmiş profillerin
  //    uygulamaları ve süresi geçmiş yarım uygulamalar silinir. Bunları içeren grup raporu kayıtlarının
  //    içeriği boşaltılır; kayıt, öğretmen raporunun ne zaman yenilenebileceğini belirlemek için kalır
  //    (boşaltılmış kayıt hiçbir zaman gösterilmez).
  const [gone] = await tx.execute<{ attempts: number; snapshots: number }>(sql`
    with gone as (
      delete from attempts a
      where a.status = 'invalidated'
         or (a.status = 'abandoned' and a.last_activity_at < ${days(RETENTION.abandonedAttemptDays)})
         or exists (select 1 from students s where s.id = a.student_id and s.deleted_at is not null)
      returning a.id::text as id
    ),
    blank as (
      update group_report_snapshots g set report = ${PURGED_REPORT}
      where coalesce(g.report->>'purged', 'false') <> 'true'
        and exists (select 1 from gone where g.attempt_ids ? gone.id)
      returning 1
    )
    select (select count(*)::int from gone) as attempts, (select count(*)::int from blank) as snapshots`);
  r.attempts = Number(gone?.attempts ?? 0);
  r.blankedSnapshots = Number(gone?.snapshots ?? 0);

  // 3. Yalnızca en son grup raporu kaydı kullanılır; eskileri silinir.
  r.oldSnapshots = await count(
    tx,
    sql`with x as (delete from group_report_snapshots g where exists (
          select 1 from group_report_snapshots n
          where n.class_id = g.class_id and n.instrument_id = g.instrument_id and n.created_at > g.created_at) returning 1)
        select count(*)::int as n from x`,
  );

  // 4. Silinmiş profiller: oturumlar, sınıf ve veli bağları, atamalar ve kullanım hakları silinir;
  //    kimlik bilgileri anonimleştirilir. Rıza kayıtları kanıt olarak saklama süresi boyunca kalır.
  const deleted = sql`(select id from students where deleted_at is not null)`;
  r.deletedProfileLinks = await count(
    tx,
    sql`with a as (delete from sessions where student_id in ${deleted} returning 1),
             b as (delete from class_students where student_id in ${deleted} returning 1),
             c as (delete from guardianships where student_id in ${deleted} returning 1),
             d as (delete from assignments where student_id in ${deleted} returning 1),
             e as (delete from entitlements where student_id in ${deleted} returning 1)
        select ((select count(*) from a) + (select count(*) from b) + (select count(*) from c)
              + (select count(*) from d) + (select count(*) from e))::int as n`,
  );
  r.anonymizedProfiles = await count(
    tx,
    sql`with x as (update students set first_name = 'Silinmiş profil', last_name = null, birth_year = null, gender = null,
          school_student_no = null, login_code_hash = null, login_code_issued_at = null
        where deleted_at is not null
          and (first_name <> 'Silinmiş profil' or last_name is not null or birth_year is not null or gender is not null
               or school_student_no is not null or login_code_hash is not null)
        returning 1)
        select count(*)::int as n from x`,
  );

  // 5. Saklama süresi dolan silinmiş profiller bütünüyle silinir (rıza kayıtları ve onay istekleriyle).
  r.expiredProfiles = await count(
    tx,
    sql`with x as (delete from students where deleted_at < ${days(RETENTION.deletedProfileEvidenceDays)} returning 1)
        select count(*)::int as n from x`,
  );

  // 6. Yanıtlanmamış ve süresi dolmuş veli onayı istekleri.
  r.expiredConsentRequests = await count(
    tx,
    sql`with x as (delete from consent_requests where responded_at is null
          and expires_at < ${days(RETENTION.expiredConsentRequestDays)}
          and not exists (select 1 from consent_records cr
            where cr.subject_student_id = consent_requests.student_id and cr.meta->>'requestId' = consent_requests.id::text)
        returning 1)
        select count(*)::int as n from x`,
  );

  // 7. E-postalar: gönderilemeyenlerin içeriği boşaltılır, eski kayıtlar silinir.
  r.unsentEmailBodies = await count(
    tx,
    sql`with x as (update email_outbox set html = '', text = ''
          where status <> 'sent' and created_at < ${days(RETENTION.unsentEmailBodyDays)} and (html <> '' or text <> '')
        returning 1)
        select count(*)::int as n from x`,
  );
  r.emailLogs = await count(
    tx,
    sql`with x as (delete from email_outbox where created_at < ${days(RETENTION.emailLogDays)} returning 1)
        select count(*)::int as n from x`,
  );

  // 8. Güvenlik kayıtları, mesajlar, davetler, belirteçler, oturumlar ve sayaçlar.
  r.loginAttempts = await count(
    tx,
    sql`with x as (delete from login_attempts where created_at < ${days(RETENTION.loginAttemptDays)} returning 1)
        select count(*)::int as n from x`,
  );
  r.auditLogs = await count(
    tx,
    sql`with x as (delete from audit_logs where created_at < ${days(RETENTION.auditLogDays)} returning 1)
        select count(*)::int as n from x`,
  );
  r.contactMessages = await count(
    tx,
    sql`with x as (delete from contact_messages where created_at < ${days(RETENTION.contactMessageDays)} returning 1)
        select count(*)::int as n from x`,
  );
  r.invites = await count(
    tx,
    sql`with x as (delete from org_invites
          where (accepted_at is not null or revoked_at is not null or expires_at < now())
            and created_at < ${days(RETENTION.finishedInviteDays)}
        returning 1)
        select count(*)::int as n from x`,
  );
  r.authTokens = await count(
    tx,
    sql`with x as (delete from auth_tokens
          where (used_at is not null or expires_at < now()) and created_at < ${days(RETENTION.finishedTokenDays)}
        returning 1)
        select count(*)::int as n from x`,
  );
  r.sessions = await count(
    tx,
    sql`with x as (delete from sessions where expires_at < now() returning 1) select count(*)::int as n from x`,
  );
  r.rateLimits = await count(
    tx,
    sql`with x as (delete from rate_limits where window_start < now() - make_interval(hours => ${RETENTION.rateLimitHours}) returning 1)
        select count(*)::int as n from x`,
  );
  return r;
}

export const PURGE_JOB = 'temizlik';

/**
 * Günlük temizlik görevini çalıştırır ve çalışma kaydı tutar. Aynı anda ikinci bir çalışma (başka
 * bir sunucu örneği ya da yönetici düğmesi) kilidi alamaz ve hiçbir şey yapmadan null döner.
 */
export async function runPurgeJob(trigger: 'zamanlayıcı' | 'yönetici'): Promise<PurgeReport | null> {
  const [run] = await db.insert(jobRuns).values({ job: PURGE_JOB, trigger }).returning({ id: jobRuns.id });
  try {
    const report = await db.transaction(async (tx) => {
      const [lock] = await tx.execute<{ ok: boolean }>(sql`select pg_try_advisory_xact_lock(hashtextextended(${`job:${PURGE_JOB}`}, 0)) as ok`);
      if (!lock?.ok) return null;
      return purgeSteps(tx);
    });
    if (!report) {
      await db.delete(jobRuns).where(eq(jobRuns.id, run.id));
      return null;
    }
    await db.update(jobRuns).set({ finishedAt: new Date(), ok: true, report }).where(eq(jobRuns.id, run.id));
    return report;
  } catch (err) {
    await db
      .update(jobRuns)
      .set({ finishedAt: new Date(), ok: false, error: errorSummary(err) })
      .where(eq(jobRuns.id, run.id));
    throw err;
  }
}

/** Görevin son çalışmaları (yönetim paneli için). */
export async function recentJobRuns(job = PURGE_JOB, limit = 5) {
  return db.select().from(jobRuns).where(eq(jobRuns.job, job)).orderBy(desc(jobRuns.startedAt)).limit(limit);
}

/** Son başarılı çalışma zamanı. */
export async function lastSuccessfulRun(job = PURGE_JOB): Promise<Date | null> {
  const [row] = await db
    .select({ at: jobRuns.startedAt })
    .from(jobRuns)
    .where(and(eq(jobRuns.job, job), eq(jobRuns.ok, true)))
    .orderBy(desc(jobRuns.startedAt))
    .limit(1);
  return row?.at ?? null;
}
