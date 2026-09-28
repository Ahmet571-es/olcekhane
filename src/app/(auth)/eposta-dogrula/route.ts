import { and, eq, gt, isNull } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { authTokens, users } from '@/db/schema';
import { hashToken } from '@/lib/auth/tokens';
import { appUrl } from '@/lib/request';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') ?? '';
  if (!token || token.length > 100) return NextResponse.redirect(appUrl('/panel?dogrulama=gecersiz'));
  const [row] = await db
    .select({ id: authTokens.id, userId: authTokens.userId })
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(token)),
        eq(authTokens.kind, 'email_verify'),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!row?.userId) return NextResponse.redirect(appUrl('/panel?dogrulama=gecersiz'));
  await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, row.userId));
  await db.update(authTokens).set({ usedAt: new Date() }).where(eq(authTokens.id, row.id));
  return NextResponse.redirect(appUrl('/panel?dogrulama=tamam'));
}
