import 'server-only';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/db';
import { classTeachers, classes, memberships, organizations } from '@/db/schema';
import { requireUser } from '@/lib/auth/dal';
import type { SessionUser } from '@/lib/auth/session';

export type OrgRole = 'org_admin' | 'counselor' | 'teacher';

export const ROLE_LABELS: Record<OrgRole, string> = {
  org_admin: 'Okul yöneticisi',
  counselor: 'Rehber öğretmen',
  teacher: 'Öğretmen',
};

/**
 * Okul içi yetkiler. Rol dağılımı “Okullar için” sayfasındaki tabloyla aynıdır:
 * - Rehber öğretmen bireysel sonuçları görür, test atar, sınıfları ve öğrencileri yönetir.
 * - Okul yöneticisi ekibi ve sınıfları yönetir; bireysel sonuç ve puan özeti görmez, yalnızca katılımı görür.
 *   Öğrenci giriş kodu da üretemez (kodla öğrenci olarak girilip raporlar görülebilir).
 * - Öğretmen yalnızca kendi sınıflarının en az beş öğrencilik grup özetlerini görür.
 */
export interface OrgCapabilities {
  manageMembers: boolean;
  manageClasses: boolean;
  seeAllClasses: boolean;
  seeRoster: boolean;
  seeIndividual: boolean;
  assign: boolean;
  sendConsent: boolean;
  issueCodes: boolean;
  seeGroupReports: boolean;
}

export function capabilities(roles: OrgRole[]): OrgCapabilities {
  const has = (r: OrgRole) => roles.includes(r);
  const counselor = has('counselor');
  const admin = has('org_admin');
  return {
    manageMembers: admin,
    manageClasses: admin || counselor,
    seeAllClasses: admin || counselor,
    seeRoster: admin || counselor,
    seeIndividual: counselor,
    assign: counselor,
    // Onay isteği, testleri yürüten ve veliye açıklama yapacak rehber öğretmenden gider.
    sendConsent: counselor,
    // Kod üreten kişi öğrenci olarak girip öğrencinin raporlarını görebileceği için kodları yalnızca
    // bireysel sonuçları zaten gören rehber öğretmen üretir.
    issueCodes: counselor,
    seeGroupReports: counselor || has('teacher'),
  };
}

export interface OrgContext {
  user: SessionUser;
  org: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    district: string | null;
    minGroupSize: number;
  };
  roles: OrgRole[];
  can: OrgCapabilities;
}

/** Kullanıcının üyesi olduğu okullar (her okul bir kez, rolleriyle). */
export const userOrgs = cache(async (userId: string) => {
  const rows = await db
    .select({ id: organizations.id, name: organizations.name, slug: organizations.slug, role: memberships.role })
    .from(memberships)
    .innerJoin(organizations, eq(organizations.id, memberships.orgId))
    .where(and(eq(memberships.userId, userId), eq(organizations.isActive, true), isNull(organizations.deletedAt)))
    .orderBy(asc(organizations.name));
  const byOrg = new Map<string, { id: string; name: string; slug: string; roles: OrgRole[] }>();
  for (const r of rows) {
    const o = byOrg.get(r.id) ?? { id: r.id, name: r.name, slug: r.slug, roles: [] };
    o.roles.push(r.role);
    byOrg.set(r.id, o);
  }
  return [...byOrg.values()];
});

/** Okul sayfaları için: kullanıcı bu okulun ekibinde değilse sayfa yokmuş gibi davranılır. */
export const requireOrg = cache(async (slug: string): Promise<OrgContext> => {
  const user = await requireUser(`/okul/${slug}`);
  const orgs = await userOrgs(user.id);
  const o = orgs.find((x) => x.slug === slug);
  if (!o) notFound();
  // Rehber öğretmen bireysel sonuçları gördüğü için iki aşamalı doğrulama zorunlu (KVKK Kurulu 2018/10).
  if (o.roles.includes('counselor') && !user.twoFactor) {
    redirect(`/hesap/iki-asamali?zorunlu=1&sonra=${encodeURIComponent(`/okul/${slug}`)}`);
  }
  const [org] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      city: organizations.city,
      district: organizations.district,
      settings: organizations.settings,
    })
    .from(organizations)
    .where(eq(organizations.id, o.id))
    .limit(1);
  return {
    user,
    org: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      city: org.city,
      district: org.district,
      minGroupSize: Math.max(5, org.settings?.minGroupSize ?? 5),
    },
    roles: o.roles,
    can: capabilities(o.roles),
  };
});

/** Sınıf bu okula mı ait ve kullanıcı görebilir mi? Öğretmen yalnızca kendi sınıflarını görür. */
export async function classInOrg(ctx: OrgContext, classId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(classId)) return null;
  const [cls] = await db
    .select({ id: classes.id, name: classes.name, grade: classes.grade, academicYear: classes.academicYear, orgId: classes.orgId })
    .from(classes)
    .where(and(eq(classes.id, classId), eq(classes.orgId, ctx.org.id)))
    .limit(1);
  if (!cls) return null;
  if (ctx.can.seeAllClasses) return cls;
  const [t] = await db
    .select({ classId: classTeachers.classId })
    .from(classTeachers)
    .where(and(eq(classTeachers.classId, classId), eq(classTeachers.userId, ctx.user.id)))
    .limit(1);
  return t ? cls : null;
}

export async function requireClass(ctx: OrgContext, classId: string) {
  const cls = await classInOrg(ctx, classId);
  if (!cls) notFound();
  return cls;
}

/** Eğitim-öğretim yılı: Eylül’den itibaren yeni yıl başlar (ör. 2026-2027). */
export function currentAcademicYear(d = new Date()): string {
  const y = d.getFullYear();
  return d.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}
