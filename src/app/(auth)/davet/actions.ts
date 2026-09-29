'use server';

import { and, eq, gt, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { memberships, orgInvites, organizations, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { checkPasswordPolicy, hashPassword } from '@/lib/auth/password';
import { createUserSession, getSession } from '@/lib/auth/session';
import { hashToken } from '@/lib/auth/tokens';
import { recordConsent } from '@/lib/consent';
import { rateLimit } from '@/lib/rate-limit';
import { notifyNewCounselor } from '@/lib/school/invites';
import { clientIpBucket } from '@/lib/request';
import { ACCOUNTS_CLOSED_MESSAGE, accountsOpen } from '@/lib/site';

export type InviteFormState = { message?: string; errors?: Record<string, string>; values?: Record<string, string> };

async function validInvite(token: string) {
  if (!token || token.length > 100) return null;
  const [inv] = await db
    .select({
      id: orgInvites.id,
      orgId: orgInvites.orgId,
      email: orgInvites.email,
      role: orgInvites.role,
      slug: organizations.slug,
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
        isNull(organizations.deletedAt),
      ),
    )
    .limit(1);
  return inv ?? null;
}

async function completeInvite(inv: NonNullable<Awaited<ReturnType<typeof validInvite>>>, userId: string) {
  const added = await db.insert(memberships).values({ orgId: inv.orgId, userId, role: inv.role }).onConflictDoNothing().returning({ id: memberships.id });
  if (added.length && inv.role === 'counselor') await notifyNewCounselor(inv.orgId, userId);
  await db.update(orgInvites).set({ acceptedAt: new Date(), acceptedByUserId: userId }).where(eq(orgInvites.id, inv.id));
  // Davet bağlantısı e-posta adresine gönderildiği için adres doğrulanmış sayılır.
  await db.update(users).set({ emailVerifiedAt: new Date() }).where(and(eq(users.id, userId), isNull(users.emailVerifiedAt)));
  await audit({ actorUserId: userId, action: 'org.invite_accept', entity: 'organization', entityId: inv.orgId, meta: { role: inv.role } });
}

/** Oturum açmış ve davetin gönderildiği adresle aynı hesaptaki kullanıcı için. */
export async function acceptInviteAction(token: string): Promise<void> {
  if (!accountsOpen()) redirect(`/davet/${encodeURIComponent(token)}`);
  const inv = await validInvite(token);
  if (!inv) redirect(`/davet/${encodeURIComponent(token)}`);
  const s = await getSession();
  if (s?.kind !== 'user' || s.user.email !== inv.email) redirect(`/davet/${encodeURIComponent(token)}`);
  await completeInvite(inv, s.user.id);
  redirect(`/okul/${inv.slug}?katildiniz=1`);
}

const registerSchema = z.object({
  fullName: z.string().trim().min(3, 'Adınızı ve soyadınızı yazın.').max(120, 'En fazla 120 karakter.'),
  password: z.string(),
  notice: z.literal('on', { message: 'Devam etmek için kutuyu işaretleyin.' }),
});

/** Hesabı olmayan davetli için: hesap oluşturur ve daveti kabul eder. */
export async function registerFromInviteAction(token: string, _: InviteFormState, formData: FormData): Promise<InviteFormState> {
  if (!accountsOpen()) return { message: ACCOUNTS_CLOSED_MESSAGE };
  const inv = await validInvite(token);
  if (!inv) return { message: 'Davet bağlantısı geçersiz ya da süresi dolmuş.' };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { fullName: raw.fullName ?? '' };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  const policy = checkPasswordPolicy(parsed.data.password, inv.email);
  if (policy) return { errors: { password: policy }, values };
  const ip = await clientIpBucket();
  if (!(await rateLimit(`davet-kayit:${ip}`, 10, 3600))) return { message: 'Çok fazla deneme yapıldı. Bir saat sonra tekrar deneyin.', values };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, inv.email)).limit(1);
  if (existing) return { message: 'Bu e-posta adresiyle bir hesap zaten var. Giriş yapıp daveti kabul edin.', values };

  const [user] = await db
    .insert(users)
    .values({
      email: inv.email,
      fullName: parsed.data.fullName,
      passwordHash: await hashPassword(parsed.data.password),
      role: 'parent',
      emailVerifiedAt: new Date(),
    })
    .returning({ id: users.id });
  await recordConsent({ kind: 'notice_ack', docKind: 'privacy_notice', granted: true, actorUserId: user.id });
  await recordConsent({ kind: 'notice_ack', docKind: 'terms', granted: true, actorUserId: user.id });
  await audit({ actorUserId: user.id, action: 'user.register', entity: 'user', entityId: user.id, meta: { via: 'invite' } });
  await completeInvite(inv, user.id);
  await createUserSession(user.id);
  redirect(`/okul/${inv.slug}?katildiniz=1`);
}
