import 'server-only';
import { and, eq, gt, inArray, isNull, ne } from 'drizzle-orm';
import { db } from '@/db';
import { memberships, orgInvites, organizations, users } from '@/db/schema';
import { hashToken, randomToken } from '@/lib/auth/tokens';
import { sendEmail } from '@/lib/email/send';
import { inviteTemplate, newCounselorTemplate } from '@/lib/email/templates';
import { appUrl } from '@/lib/request';
import { ROLE_LABELS, type OrgRole } from './access';

export const INVITE_DAYS = 14;

/** Davet oluşturup e-postasını gönderir (okul yöneticisi ve platform yönetimi ortak kullanır). */
export async function sendInvite(p: { orgId: string; orgName: string; email: string; role: OrgRole; inviterId: string; inviterName: string }) {
  // Aynı adrese aynı görev için bekleyen eski davetler geçersiz olur.
  await db
    .update(orgInvites)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(orgInvites.orgId, p.orgId),
        eq(orgInvites.email, p.email),
        eq(orgInvites.role, p.role),
        isNull(orgInvites.acceptedAt),
        isNull(orgInvites.revokedAt),
      ),
    );
  const token = randomToken();
  await db.insert(orgInvites).values({
    orgId: p.orgId,
    email: p.email,
    role: p.role,
    tokenHash: hashToken(token),
    invitedByUserId: p.inviterId,
    expiresAt: new Date(Date.now() + INVITE_DAYS * 86400_000),
  });
  const mail = inviteTemplate({
    orgName: p.orgName,
    roleLabel: ROLE_LABELS[p.role],
    inviterName: p.inviterName,
    link: appUrl(`/davet/${token}`),
    days: INVITE_DAYS,
  });
  await sendEmail({ to: p.email, ...mail });
}


/** Bekleyen davetleri listelemek için (yalnızca geçerli olanlar). */
export async function pendingInvites(orgId: string) {
  return db
    .select({ id: orgInvites.id, email: orgInvites.email, role: orgInvites.role, createdAt: orgInvites.createdAt, expiresAt: orgInvites.expiresAt })
    .from(orgInvites)
    .where(and(eq(orgInvites.orgId, orgId), isNull(orgInvites.acceptedAt), isNull(orgInvites.revokedAt), gt(orgInvites.expiresAt, new Date())))
    .orderBy(orgInvites.createdAt);
}

/** Davet sayfası için: geçerli davetin okul ve görev bilgisi. Geçersizse null. */
export async function inviteDetails(token: string) {
  if (!token || token.length > 100) return null;
  const [inv] = await db
    .select({
      email: orgInvites.email,
      role: orgInvites.role,
      expiresAt: orgInvites.expiresAt,
      orgName: organizations.name,
      orgSlug: organizations.slug,
    })
    .from(orgInvites)
    .innerJoin(organizations, eq(organizations.id, orgInvites.orgId))
    .where(
      and(
        eq(orgInvites.tokenHash, hashToken(token)),
        isNull(orgInvites.acceptedAt),
        isNull(orgInvites.revokedAt),
        gt(orgInvites.expiresAt, new Date()),
        eq(organizations.isActive, true),
      ),
    )
    .limit(1);
  return inv ?? null;
}

/**
 * Yeni bir rehber öğretmen katıldığında okulun diğer yöneticilerine, rehber öğretmenlerine ve platform
 * yöneticilerine haber verilir: bu görev bireysel sonuçları gördüğü için görev değişikliği görünür olmalıdır.
 */
export async function notifyNewCounselor(orgId: string, newUserId: string) {
  const [org] = await db.select({ name: organizations.name, slug: organizations.slug }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const [u] = await db.select({ fullName: users.fullName, email: users.email }).from(users).where(eq(users.id, newUserId)).limit(1);
  if (!org || !u) return;
  const team = await db
    .selectDistinct({ email: users.email })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(and(eq(memberships.orgId, orgId), inArray(memberships.role, ['org_admin', 'counselor']), ne(memberships.userId, newUserId), isNull(users.deletedAt)));
  const platformAdmins = await db
    .select({ email: users.email })
    .from(users)
    .where(and(eq(users.role, 'admin'), ne(users.id, newUserId), isNull(users.deletedAt)));
  const recipients = [
    ...team.map((r) => ({ email: r.email, link: appUrl(`/okul/${org.slug}`) })),
    ...platformAdmins.map((r) => ({ email: r.email, link: appUrl(`/yonetim/okullar/${orgId}`) })),
  ];
  const seen = new Set<string>();
  for (const r of recipients) {
    const key = r.email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    await sendEmail({ to: r.email, ...newCounselorTemplate({ orgName: org.name, name: u.fullName, email: u.email, link: r.link }) });
  }
}
