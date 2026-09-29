'use server';

import { and, count, eq, gte, lte, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { normSets, normStats, scores } from '@/db/schema';
import { audit } from '@/lib/audit';
import { requireAdmin } from '@/lib/auth/dal';
import { gradeRangeLabel } from '@/lib/config';
import { NORM_MIN_N } from '@/lib/psychometrics/analysis';
import type { LikertInstrument } from '@/lib/instruments/types';
import { currentVersionDef } from '@/lib/psychometrics/data';
import { likertNormPreview } from '@/lib/psychometrics/lab';

export type NormFormState = { ok?: boolean; message?: string; errors?: Record<string, string>; values?: Record<string, string> };

const monthFmt = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });

const schema = z
  .object({
    gradeMin: z.coerce.number().int().min(1).max(13),
    gradeMax: z.coerce.number().int().min(1).max(13),
    name: z.string().trim().max(120, 'En fazla 120 karakter.').optional(),
  })
  .refine((d) => d.gradeMin <= d.gradeMax, { message: 'Sınıf aralığını kontrol edin.', path: ['gradeMax'] });

/**
 * Platform verisinden ön norm oluşturur. Platformu kullananlar temsilî bir örneklem olmadığı için bu
 * yolla yalnızca “ön norm” oluşturulabilir; raporlar bunu açıkça söyler. Kesin norm, temsilî bir
 * örneklem çalışmasının yayımlanmış istatistikleri girilerek oluşturulur (createPublishedNormAction).
 * İstatistikler istemciden gelmez: seçilen sınıf aralığı için sunucuda yeniden hesaplanır. Yeni norm
 * etkin başlamaz; etkinleştirilince yalnızca sonraki uygulamalar bu normla puanlanır.
 */
export async function createNormSetAction(slug: string, _: NormFormState, formData: FormData): Promise<NormFormState> {
  const admin = await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0] ?? 'form')] ??= i.message;
    return { errors, message: errors.form };
  }
  const d = parsed.data;
  const preview = await likertNormPreview(slug, d.gradeMin, d.gradeMax);
  if (!preview) return { message: 'Norm yalnızca ölçek (likert) testleri için oluşturulabilir.' };
  const min = NORM_MIN_N.provisional;
  const smallest = Math.min(...preview.scales.map((s) => s.n));
  if (preview.n < min || smallest < min) {
    return { message: `Ön norm için her ölçekte en az ${min} öğrenci gerekiyor; bu aralıkta ${smallest} öğrenci var.` };
  }
  if (preview.scales.some((s) => !s.sd || s.mean === null)) return { message: 'Bir ölçekte puanların hepsi aynı; norm hesaplanamaz.' };

  const range = gradeRangeLabel(d.gradeMin, d.gradeMax);
  const [from, to] = [preview.firstAt, preview.lastAt].map((d) => (d ? monthFmt.format(d) : ''));
  const period = from && to ? (from === to ? from : `${from} – ${to}`) : '';
  const source = `Ölçekhane araştırma örneklemi: araştırma rızası veren velilerin çocuklarının ilk uygulamaları, geçerlik uyarısı olanlar hariç${period ? `, ${period}` : ''}.`;
  const name = d.name || `${range} ön normu (${preview.n} öğrenci)`;

  const [set] = await db
    .insert(normSets)
    .values({
      versionId: preview.versionId,
      name,
      description: period ? `Veri dönemi: ${period}` : null,
      gradeMin: d.gradeMin,
      gradeMax: d.gradeMax,
      n: preview.n,
      status: 'provisional',
      source,
      isActive: false,
    })
    .returning({ id: normSets.id });
  await db.insert(normStats).values(
    preview.scales.map((s) => ({
      normSetId: set.id,
      scaleKey: s.scaleKey,
      n: s.n,
      mean: s.mean!,
      sd: s.sd!,
      reliability: s.alpha,
    })),
  );
  await audit({
    actorUserId: admin.id,
    action: 'norm.create',
    entity: 'norm_set',
    entityId: set.id,
    meta: { slug, gradeMin: d.gradeMin, gradeMax: d.gradeMax, n: preview.n, status: 'provisional' },
  });
  redirect(`/yonetim/psikometri/${slug}?norm=olusturuldu#normlar`);
}

/**
 * Temsilî bir örneklem çalışmasının yayımlanmış norm istatistiklerini “kesin norm” olarak girer
 * (ör. Türkiye örnekleminde yapılmış bir uyarlama çalışması). Her ölçek için n, ortalama, standart
 * sapma ve varsa güvenirlik katsayısı; kaynak künyesi zorunludur. Değerler, raporlamadaki puan
 * ölçeğinde olmalıdır (ortalama puanlı ölçeklerde madde ortalaması, toplam puanlılarda toplam).
 */
export async function createPublishedNormAction(slug: string, _: NormFormState, formData: FormData): Promise<NormFormState> {
  const admin = await requireAdmin();
  const cv = await currentVersionDef(slug);
  if (!cv || cv.def.engine !== 'likert') return { message: 'Norm yalnızca ölçek (likert) testleri için girilebilir.' };
  const def = cv.def as LikertInstrument;
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const errors: Record<string, string> = {};
  const gradeMin = Number(raw.gradeMin);
  const gradeMax = Number(raw.gradeMax);
  if (!Number.isInteger(gradeMin) || !Number.isInteger(gradeMax) || gradeMin < 1 || gradeMax > 13 || gradeMin > gradeMax) {
    errors.gradeMax = 'Sınıf aralığını kontrol edin.';
  }
  const name = (raw.name ?? '').trim();
  const source = (raw.source ?? '').trim();
  if (name.length < 3 || name.length > 120) errors.name = 'Normun adını yazın (en fazla 120 karakter).';
  if (source.length < 30 || source.length > 400) errors.source = 'Kaynağın künyesini yazın: yazarlar, yıl, başlık, örneklemin nasıl seçildiği (30–400 karakter).';
  const values = def.options.map((o) => o.value);
  const optMin = Math.min(...values);
  const optMax = Math.max(...values);
  const isMean = def.scoring.method === 'mean';
  const num = (v: string | undefined) => (v === undefined || v.trim() === '' ? NaN : Number(v.replace(',', '.')));
  const rows: { scaleKey: string; n: number; mean: number; sd: number; reliability: number | null }[] = [];
  for (const sc of def.scales) {
    const k = def.items.filter((i) => i.scale === sc.key).length;
    const lo = isMean ? optMin : optMin * k;
    const hi = isMean ? optMax : optMax * k;
    const n = num(raw[`n_${sc.key}`]);
    const mean = num(raw[`mean_${sc.key}`]);
    const sd = num(raw[`sd_${sc.key}`]);
    const relRaw = raw[`rel_${sc.key}`];
    const rel = relRaw && relRaw.trim() ? num(relRaw) : null;
    if (!Number.isInteger(n) || n < NORM_MIN_N.provisional) errors[`n_${sc.key}`] = `En az ${NORM_MIN_N.provisional} kişi.`;
    else if (!Number.isFinite(mean) || mean < lo || mean > hi) errors[`mean_${sc.key}`] = `Ortalama ${lo}–${hi} arasında olmalı.`;
    else if (!Number.isFinite(sd) || sd <= 0 || sd > hi - lo) errors[`sd_${sc.key}`] = 'Standart sapmayı kontrol edin.';
    else if (rel !== null && (!Number.isFinite(rel) || rel <= 0 || rel >= 1)) errors[`rel_${sc.key}`] = 'Güvenirlik 0 ile 1 arasında olmalı.';
    else rows.push({ scaleKey: sc.key, n, mean, sd, reliability: rel });
  }
  if (Object.keys(errors).length) return { errors, message: 'Formdaki işaretli alanları düzeltin.', values: raw };
  const [set] = await db
    .insert(normSets)
    .values({
      versionId: cv.versionId,
      name,
      description: 'Yayımlanmış norm çalışmasından girildi.',
      gradeMin,
      gradeMax,
      n: Math.min(...rows.map((r) => r.n)),
      status: 'final',
      source,
      isActive: false,
    })
    .returning({ id: normSets.id });
  await db.insert(normStats).values(rows.map((r) => ({ normSetId: set.id, ...r })));
  await audit({ actorUserId: admin.id, action: 'norm.create_published', entity: 'norm_set', entityId: set.id, meta: { slug, gradeMin, gradeMax } });
  redirect(`/yonetim/psikometri/${slug}?norm=olusturuldu#normlar`);
}

async function ownedSet(slug: string, id: string) {
  const cv = await currentVersionDef(slug);
  if (!cv || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [set] = await db.select().from(normSets).where(and(eq(normSets.id, id), eq(normSets.versionId, cv.versionId))).limit(1);
  return set ?? null;
}

export async function setNormActiveAction(slug: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const set = await ownedSet(slug, String(formData.get('normSetId') ?? ''));
  if (!set) redirect(`/yonetim/psikometri/${slug}#normlar`);
  const active = formData.get('active') === '1';
  await db.transaction(async (tx) => {
    if (active) {
      // Aynı sınıf düzeyi için tek bir etkin norm olur: çakışan etkin normlar kapatılır.
      await tx
        .update(normSets)
        .set({ isActive: false })
        .where(
          and(
            eq(normSets.versionId, set.versionId),
            eq(normSets.isActive, true),
            ne(normSets.id, set.id),
            lte(normSets.gradeMin, set.gradeMax),
            gte(normSets.gradeMax, set.gradeMin),
          ),
        );
    }
    await tx.update(normSets).set({ isActive: active }).where(eq(normSets.id, set.id));
  });
  await audit({ actorUserId: admin.id, action: active ? 'norm.activate' : 'norm.deactivate', entity: 'norm_set', entityId: set.id, meta: { slug } });
  redirect(`/yonetim/psikometri/${slug}?norm=${active ? 'etkin' : 'kapali'}#normlar`);
}

export async function deleteNormSetAction(slug: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const set = await ownedSet(slug, String(formData.get('normSetId') ?? ''));
  if (!set) redirect(`/yonetim/psikometri/${slug}#normlar`);
  const [used] = await db.select({ n: count() }).from(scores).where(eq(scores.normSetId, set.id));
  if (set.isActive || used.n > 0) redirect(`/yonetim/psikometri/${slug}?norm=silinemez#normlar`);
  await db.delete(normSets).where(eq(normSets.id, set.id));
  await audit({ actorUserId: admin.id, action: 'norm.delete', entity: 'norm_set', entityId: set.id, meta: { slug } });
  redirect(`/yonetim/psikometri/${slug}?norm=silindi#normlar`);
}
