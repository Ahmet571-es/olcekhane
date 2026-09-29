'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { consentRequests, guardianships, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { getSession } from '@/lib/auth/session';
import { hasActiveConsent, lockStudentConsent, recordConsent, revokeConsent } from '@/lib/consent';
import { sendEmail } from '@/lib/email/send';
import { consentReceiptTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl, clientIpBucket } from '@/lib/request';
import { consentRequestByToken } from '@/lib/school/consent-requests';
import { accountsOpen } from '@/lib/site';

/**
 * Okulun e-postayla gönderdiği bağlantıdan velinin kararı. Aydınlatma metninin okunduğu beyanı ile
 * açık rıza ayrı ayrı kaydedilir (KVKK Kurulu 2026/347 sayılı ilke kararı). Rıza, aynı bağlantıdan
 * geri alınabilir; geri alınınca öğrencinin uygulamaları geçersiz sayılır.
 * Karar, öğrencinin rıza kilidiyle tek bir veritabanı işleminde yazılır ve bağlantının geçerliliği
 * kilitten sonra yeniden denetlenir (okul aynı anda onayı geçersiz sayıyor ya da adresi değiştiriyor olabilir).
 */
export async function consentDecisionAction(token: string, formData: FormData): Promise<void> {
  const first = await consentRequestByToken(token);
  const back = `/veli-onayi/${encodeURIComponent(token)}`;
  if (!first) redirect(back);
  const ip = await clientIpBucket();
  if (!(await rateLimit(`veli-onayi:${first.id}`, 20, 3600)) || !(await rateLimit(`veli-onayi-ip:${ip}`, 60, 3600))) {
    redirect(`${back}?hata=cok-deneme`);
  }
  const decision = String(formData.get('decision') ?? '');
  if (!['grant', 'decline', 'revoke', 'revoke_research'].includes(decision)) redirect(back);
  // Hesaplar kapalıyken yeni onay alınmaz; verilmiş rızayı geri almak ve onay vermemek her zaman mümkündür.
  if (decision === 'grant' && !accountsOpen()) redirect(`${back}?hata=kapali`);
  // Onay vermek ya da reddetmek için bağlantı güncel ve süresi dolmamış olmalı; geri almanın kuralı ayrıdır.
  if ((decision === 'grant' || decision === 'decline') && !first.canDecide) redirect(`${back}?hata=sure`);
  if ((decision === 'revoke' || decision === 'revoke_research') && !first.canRevoke) redirect(back);
  if (decision === 'grant' && (formData.get('notice') !== 'on' || formData.get('guardian') !== 'on')) redirect(`${back}?hata=beyan`);
  const wantsResearch = formData.get('research') === 'on';

  const outcome = await db.transaction(async (tx): Promise<'ok' | 'invalid' | 'expired' | 'noop'> => {
    await lockStudentConsent(tx, first.studentId);
    const req = await consentRequestByToken(token, tx);
    if (!req) return 'invalid';
    if ((decision === 'grant' || decision === 'decline') && !req.canDecide) return 'expired';
    if ((decision === 'revoke' || decision === 'revoke_research') && !req.canRevoke) return 'invalid';
    const actor = { email: req.email, method: 'email_link' as const, meta: { requestId: req.id, orgId: req.orgId } };
    const active = await hasActiveConsent(req.studentId, 'consent_assessment', tx);
    const record = (kind: 'notice_ack' | 'explicit_consent', docKind: 'privacy_notice' | 'consent_assessment' | 'consent_research', granted: boolean) =>
      recordConsent({ kind, docKind, granted, studentId: req.studentId, actorEmail: req.email, method: 'email_link', meta: actor.meta }, tx);

    if (decision === 'grant') {
      if (!active) {
        await record('notice_ack', 'privacy_notice', true);
        await record('explicit_consent', 'consent_assessment', true);
      }
      if (wantsResearch && !(await hasActiveConsent(req.studentId, 'consent_research', tx))) {
        await record('explicit_consent', 'consent_research', true);
      }
    } else if (decision === 'decline') {
      if (active) return 'noop';
      await record('explicit_consent', 'consent_assessment', false);
    } else if (decision === 'revoke') {
      // Geri alınacak bir rıza yoksa hiçbir şey yapılmaz (geri alma uygulamaları kalıcı olarak geçersiz kılar).
      if (!active) return 'noop';
      await revokeConsent(req.studentId, 'consent_assessment', actor, tx);
      if (await hasActiveConsent(req.studentId, 'consent_research', tx)) await revokeConsent(req.studentId, 'consent_research', actor, tx);
    } else {
      if (!(await hasActiveConsent(req.studentId, 'consent_research', tx))) return 'noop';
      await revokeConsent(req.studentId, 'consent_research', actor, tx);
    }
    const stored = decision === 'grant' ? 'granted' : decision === 'decline' ? 'declined' : decision === 'revoke' ? 'revoked' : null;
    if (stored) await tx.update(consentRequests).set({ respondedAt: new Date(), decision: stored }).where(eq(consentRequests.id, req.id));
    return 'ok';
  });
  if (outcome === 'expired') redirect(`${back}?hata=sure`);
  if (outcome !== 'ok') redirect(back);

  await audit({
    action: `consent.parent_${decision}`,
    entity: 'student',
    entityId: first.studentId,
    meta: { requestId: first.id, orgId: first.orgId, email: first.email },
  });
  if (decision === 'grant' || decision === 'decline') {
    const mail = consentReceiptTemplate({
      orgName: first.orgName ?? 'Okul',
      studentName: first.studentFirstName,
      granted: decision === 'grant',
      link: appUrl(back),
    });
    await sendEmail({ to: first.email, ...mail });
  }
  redirect(`${back}?karar=${decision}`);
}

const relationSchema = z.enum(['mother', 'father', 'legal_guardian', 'other']);

/**
 * Onay veren veli, okulun eklediği öğrenciyi kendi hesabına bağlar ve raporları veli panelinde görür.
 * Yalnızca onay bağlantısının gönderildiği e-posta adresiyle açılmış hesap bağlayabilir: bağlantı o
 * adrese gönderildiği için, bağlantıyı açan ve aynı adresle giriş yapan kişinin o adresin sahibi
 * olduğu kabul edilir (bu nedenle adres doğrulanmamışsa doğrulanmış sayılır).
 */
export async function linkStudentAction(token: string, formData: FormData): Promise<void> {
  const req = await consentRequestByToken(token);
  const back = `/veli-onayi/${encodeURIComponent(token)}`;
  if (!req) redirect(back);
  if (!accountsOpen()) redirect(`${back}?hata=kapali`);
  if (!req.canDecide) redirect(`${back}?hata=sure`);
  const s = await getSession();
  if (s?.kind !== 'user') redirect(`/giris?sonra=${encodeURIComponent(back)}`);
  if (s.user.email.toLowerCase() !== req.email.toLowerCase()) redirect(`${back}?hata=farkli-eposta`);
  if (!(await hasActiveConsent(req.studentId, 'consent_assessment'))) redirect(`${back}?hata=onay-yok`);
  const relation = relationSchema.safeParse(formData.get('relation'));
  if (!relation.success) redirect(`${back}?hata=yakinlik`);
  const ip = await clientIpBucket();
  if (!(await rateLimit(`veli-bagla:${s.user.id}`, 20, 3600)) || !(await rateLimit(`veli-bagla-ip:${ip}`, 60, 3600))) {
    redirect(`${back}?hata=cok-deneme`);
  }
  // Bağlantının geçerliliği ve rıza, öğrencinin rıza kilidinden sonra yeniden denetlenir: okul aynı anda
  // onayı geçersiz sayıyor ya da adresi değiştiriyorsa yanlış kişi yeniden bağlanamaz.
  const linked = await db.transaction(async (tx) => {
    await lockStudentConsent(tx, req.studentId);
    const fresh = await consentRequestByToken(token, tx);
    if (!fresh?.canDecide || fresh.email.toLowerCase() !== s.user.email.toLowerCase()) return false;
    if (!(await hasActiveConsent(req.studentId, 'consent_assessment', tx))) return false;
    await tx
      .insert(guardianships)
      .values({ studentId: req.studentId, userId: s.user.id, relation: relation.data, isPrimary: false })
      .onConflictDoNothing();
    return true;
  });
  if (!linked) redirect(`${back}?hata=sure`);
  if (!s.user.emailVerified) {
    await db.update(users).set({ emailVerifiedAt: new Date() }).where(and(eq(users.id, s.user.id), isNull(users.emailVerifiedAt)));
  }
  await audit({
    actorUserId: s.user.id,
    action: 'guardian.link',
    entity: 'student',
    entityId: req.studentId,
    meta: { requestId: req.id, orgId: req.orgId, relation: relation.data },
  });
  redirect(`/panel/cocuk/${req.studentId}?baglandi=1`);
}
