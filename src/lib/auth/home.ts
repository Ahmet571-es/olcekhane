import 'server-only';
import { count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { guardianships } from '@/db/schema';
import { userOrgs } from '@/lib/school/access';
import { accountsOpen } from '@/lib/site';
import type { SessionUser } from './session';

/**
 * Girişten sonra kullanıcının ilk göreceği panel: okul ekibindeyse okul paneli, velisi olduğu bir
 * çocuk varsa veli paneli, yalnızca platform yöneticisiyse yönetim paneli, hiçbiri değilse veli
 * paneli. Paneller arasında üst çubuktaki bağlantılarla geçilir.
 */
export async function homeFor(user: Pick<SessionUser, 'id' | 'role'>): Promise<string> {
  // Hesaplar kapalıyken veli ve okul panelleri kapalıdır (oturumu yalnızca yöneticiler açabilir).
  if (!accountsOpen()) return user.role === 'admin' ? '/yonetim' : '/';
  const [orgs, [kids]] = await Promise.all([
    userOrgs(user.id),
    db.select({ n: count() }).from(guardianships).where(eq(guardianships.userId, user.id)),
  ]);
  if (orgs.length === 1) return `/okul/${orgs[0].slug}`;
  if (orgs.length > 1) return '/okul';
  if (kids.n > 0) return '/panel';
  if (user.role === 'admin') return '/yonetim';
  return '/panel';
}

export { safeNextPath } from './next-path';
