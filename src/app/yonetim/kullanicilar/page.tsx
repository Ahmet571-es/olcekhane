import { and, count, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { guardianships, memberships, organizations, users } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/dal';
import { ROLE_LABELS } from '@/lib/school/access';
import { resetTwoFactorAction } from '../actions';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
const PLATFORM_ROLES: Record<string, string> = { parent: 'Kullanıcı', staff: 'Personel', admin: 'Platform yöneticisi' };

const NOTICES: Record<string, { ok: boolean; text: string }> = {
  sifirlandi: { ok: true, text: 'İki aşamalı doğrulama sıfırlandı, oturumları kapatıldı ve kullanıcıya e-postayla bildirildi.' },
  kendi: { ok: false, text: 'Kendi hesabınızın ayarını Hesabım sayfasından değiştirin.' },
  onay: { ok: false, text: 'Sıfırlamak için kullanıcının kimliğini doğruladığınızı belirten kutuyu işaretleyin.' },
};

/**
 * Destek için kullanıcı arama (yalnızca tam e-posta adresiyle): hesap durumu, görevler ve iki aşamalı
 * doğrulamanın sıfırlanması. Liste halinde bütün kullanıcıları göstermez.
 */
export default async function AdminUsers(props: PageProps<'/yonetim/kullanicilar'>) {
  await requireAdmin();
  const q = await props.searchParams;
  const email = typeof q.e === 'string' ? q.e.trim().toLowerCase().slice(0, 200) : '';
  const [u] = email
    ? await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          createdAt: users.createdAt,
          lastLoginAt: users.lastLoginAt,
          emailVerifiedAt: users.emailVerifiedAt,
          totpEnabledAt: users.totpEnabledAt,
        })
        .from(users)
        .where(and(eq(users.email, email), isNull(users.deletedAt)))
        .limit(1)
    : [];
  const [teams, [kids]] = u
    ? await Promise.all([
        db
          .select({ org: organizations.name, role: memberships.role })
          .from(memberships)
          .innerJoin(organizations, eq(organizations.id, memberships.orgId))
          .where(eq(memberships.userId, u.id)),
        db.select({ n: count() }).from(guardianships).where(eq(guardianships.userId, u.id)),
      ])
    : [[], [{ n: 0 }]];
  const notice = q.sifirlandi === '1' ? NOTICES.sifirlandi : typeof q.hata === 'string' && q.hata !== 'sifirlandi' ? (NOTICES[q.hata] ?? null) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Kullanıcılar</h1>
        <p className="measure text-ink-2">Destek talepleri için bir hesabı tam e-posta adresiyle bulun.</p>
      </div>
      <form className="flex flex-wrap items-end gap-3" role="search">
        <div className="field min-w-0 flex-1 sm:max-w-md">
          <label htmlFor="e" className="field-label">
            E-posta adresi
          </label>
          <input id="e" name="e" type="email" defaultValue={email} className="input" autoComplete="off" />
        </div>
        <button type="submit" className="btn btn-secondary">
          Bul
        </button>
      </form>
      {notice && (
        <p className={`notice ${notice.ok ? 'notice-ok' : 'notice-danger'}`} role="status">
          {notice.text}
        </p>
      )}
      {email && !u && <p className="text-ink-2">Bu adresle kayıtlı etkin bir hesap yok.</p>}
      {u && (
        <section className="panel flex flex-col gap-5 p-6 md:p-8" aria-labelledby="hesap">
          <div className="flex flex-col gap-1">
            <h2 id="hesap" className="t-h3">
              {u.fullName}
            </h2>
            <p className="t-small break-all text-ink-2">{u.email}</p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-[12rem_1fr]">
            <dt className="t-meta">Platform rolü</dt>
            <dd>{PLATFORM_ROLES[u.role] ?? u.role}</dd>
            <dt className="t-meta">Okul görevleri</dt>
            <dd>{teams.length ? teams.map((t) => `${t.org} (${ROLE_LABELS[t.role]})`).join(', ') : 'yok'}</dd>
            <dt className="t-meta">Bağlı çocuk profili</dt>
            <dd>{kids.n}</dd>
            <dt className="t-meta">Hesap açılışı</dt>
            <dd>{dateFmt.format(u.createdAt)}</dd>
            <dt className="t-meta">Son giriş</dt>
            <dd>{u.lastLoginAt ? dateFmt.format(u.lastLoginAt) : 'yok'}</dd>
            <dt className="t-meta">E-posta doğrulaması</dt>
            <dd>{u.emailVerifiedAt ? 'Doğrulandı' : 'Doğrulanmadı'}</dd>
            <dt className="t-meta">İki aşamalı doğrulama</dt>
            <dd>{u.totpEnabledAt ? `Açık (${dateFmt.format(u.totpEnabledAt)})` : 'Kapalı'}</dd>
          </dl>
          {u.totpEnabledAt && (
            <details className="border-t border-rule pt-4">
              <summary className="cursor-pointer font-bold">İki aşamalı doğrulamayı sıfırla</summary>
              <form action={resetTwoFactorAction.bind(null, u.id)} className="mt-4 flex flex-col gap-4">
                <p className="t-small measure text-ink-2">
                  Telefonuna ve kurtarma kodlarına erişemeyen kullanıcı için. Başvuranın hesabın sahibi olduğunu doğrulamadan sıfırlamayın (ör.
                  okulun resmî yazısı ya da kayıtlı adresten gelen başvuru). Kullanıcının bütün oturumları kapanır; zorunlu görevdeyse bir sonraki
                  girişte yeniden kurar.
                </p>
                <div className="field max-w-md">
                  <label htmlFor="reason" className="field-label">
                    Gerekçe (denetim kaydına yazılır)
                  </label>
                  <input id="reason" name="reason" maxLength={300} className="input" />
                </div>
                <label className="check">
                  <input type="checkbox" name="confirm" />
                  <span className="t-small">Başvuranın hesabın sahibi olduğunu doğruladım.</span>
                </label>
                <div>
                  <button type="submit" className="btn btn-danger">
                    Sıfırla
                  </button>
                </div>
              </form>
            </details>
          )}
        </section>
      )}
    </div>
  );
}
