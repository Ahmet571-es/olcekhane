import 'server-only';
import { createHash } from 'node:crypto';
import { and, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, instrumentVersions, instruments, items, legalDocuments, scales } from '@/db/schema';
import { INSTRUMENTS } from '@/content/instruments';
import { LEGAL_DOCS } from '@/content/legal';
import type { InstrumentDef } from './types';

function hashDef(def: InstrumentDef): string {
  return createHash('sha256').update(JSON.stringify(def)).digest('hex');
}

function itemRows(def: InstrumentDef, versionId: string) {
  if (def.engine === 'likert') {
    return def.items.map((it, i) => ({
      versionId,
      key: it.key,
      position: i + 1,
      text: it.text,
      scaleKey: it.scale,
      reverse: !!it.reverse,
    }));
  }
  let pos = 0;
  return def.passages.flatMap((p) =>
    p.questions.map((q) => ({
      versionId,
      key: `${p.key}.${q.key}`,
      position: ++pos,
      text: q.text,
      scaleKey: 'comprehension',
      reverse: false,
      meta: { passage: p.key, skill: q.skill, answer: q.answer },
    })),
  );
}

/**
 * Koddaki test tanımlarını ve hukuki metinleri veritabanına eşitler. Her sunucu açılışında
 * güvenle çalıştırılabilir. Bir sürümün içeriği değişmişse ve o sürümle tamamlanmış uygulama
 * varsa tanım üzerine yazılmaz: yeni sürüm numarası verilmesi gerekir.
 */
export async function syncDefinitions(log: (m: string) => void = console.log): Promise<void> {
  for (const def of INSTRUMENTS) {
    const values = {
      slug: def.slug,
      name: def.name,
      shortName: def.shortName,
      domain: def.domain,
      status: def.status,
      engine: def.engine,
      minGrade: def.minGrade,
      maxGrade: def.maxGrade,
      estimatedMinutes: def.estimatedMinutes,
      licenseStatus: def.licenseStatus,
      isFree: def.isFree,
      sortOrder: def.sortOrder,
    };
    const [inst] = await db
      .insert(instruments)
      .values(values)
      .onConflictDoUpdate({ target: instruments.slug, set: values })
      .returning({ id: instruments.id });

    const hash = hashDef(def);
    const [existing] = await db
      .select({ id: instrumentVersions.id, contentHash: instrumentVersions.contentHash })
      .from(instrumentVersions)
      .where(and(eq(instrumentVersions.instrumentId, inst.id), eq(instrumentVersions.version, def.version)))
      .limit(1);

    if (existing) {
      if (existing.contentHash === hash) continue;
      const [{ n }] = await db
        .select({ n: count() })
        .from(attempts)
        .where(and(eq(attempts.versionId, existing.id), eq(attempts.status, 'completed')));
      if (n > 0) {
        log(`UYARI: ${def.slug} v${def.version} değişmiş ama bu sürümle ${n} tamamlanmış uygulama var. Sürüm numarasını artırın.`);
        continue;
      }
      await db.transaction(async (tx) => {
        await tx
          .update(instrumentVersions)
          .set({ definition: def as unknown as Record<string, unknown>, contentHash: hash })
          .where(eq(instrumentVersions.id, existing.id));
        await tx.delete(scales).where(eq(scales.versionId, existing.id));
        await tx.delete(items).where(eq(items.versionId, existing.id));
        await tx.insert(scales).values(def.scales.map((s) => ({ versionId: existing.id, key: s.key, name: s.name })));
        await tx.insert(items).values(itemRows(def, existing.id));
      });
      log(`${def.slug} v${def.version} güncellendi (henüz uygulama yoktu).`);
      continue;
    }

    await db.transaction(async (tx) => {
      await tx
        .update(instrumentVersions)
        .set({ isCurrent: false })
        .where(eq(instrumentVersions.instrumentId, inst.id));
      const [v] = await tx
        .insert(instrumentVersions)
        .values({
          instrumentId: inst.id,
          version: def.version,
          definition: def as unknown as Record<string, unknown>,
          contentHash: hash,
          isCurrent: true,
        })
        .returning({ id: instrumentVersions.id });
      await tx.insert(scales).values(def.scales.map((s) => ({ versionId: v.id, key: s.key, name: s.name })));
      await tx.insert(items).values(itemRows(def, v.id));
    });
    log(`${def.slug} v${def.version} eklendi.`);
  }

  for (const doc of LEGAL_DOCS) {
    await db
      .insert(legalDocuments)
      .values({ kind: doc.kind, version: doc.version, title: doc.title, bodyMd: doc.bodyMd })
      .onConflictDoNothing({ target: [legalDocuments.kind, legalDocuments.version] });
  }
}
