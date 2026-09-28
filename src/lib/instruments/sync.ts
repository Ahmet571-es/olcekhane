import 'server-only';
import { createHash } from 'node:crypto';
import { and, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, instrumentVersions, instruments, items, legalDocuments, scales } from '@/db/schema';
import { INSTRUMENTS } from '@/content/instruments';
import { LEGAL_DOCS } from '@/content/legal';
import { stableStringify } from '@/lib/stable-json';
import type { InstrumentDef } from './types';

function hashDef(def: InstrumentDef): string {
  return createHash('sha256').update(stableStringify(def)).digest('hex');
}

/**
 * Ölçmeyi etkileyen alanların özeti: madde metinleri, seçenekler, puanlama anahtarı ve eşikler.
 * Bunlar değişmeden yapılan düzeltmeler (bilim kartı, açıklama, yönerge, sıralama) mevcut sürümün
 * üzerine yazılabilir; eski cevapların anlamı değişmez. Madde metni değişirse yeni sürüm gerekir.
 */
function scoringHash(def: InstrumentDef): string {
  const core =
    def.engine === 'likert'
      ? {
          engine: def.engine,
          profile: def.profile ?? null,
          options: def.options.map((o) => o.value),
          items: def.items.map((i) => [i.key, i.scale, !!i.reverse, i.text]),
          prompt: def.prompt,
          scoring: def.scoring,
          anchoredBands: def.anchoredBands,
          scales: def.scales.map((s) => [s.key, s.alpha ?? null, s.sdRef ?? null]),
          totalScale: def.totalScale ?? null,
        }
      : def.engine === 'tasks'
        ? {
            engine: def.engine,
            // Görevlerin yönergeleri ve adları sunumdur; uyaranlar ve zamanlamalar ölçmeyi belirler.
            tasks: def.tasks.map((t) =>
              Object.fromEntries(Object.entries(t).filter(([k]) => k !== 'name' && k !== 'measures' && k !== 'instructions')),
            ),
            scales: def.scales.map((s) => s.key),
          }
        : {
          engine: def.engine,
          passages: def.passages.map((p) => [
            p.key,
            p.minGrade,
            p.maxGrade,
            p.paragraphs,
            p.questions.map((q) => [q.key, q.text, q.options, q.answer, q.skill]),
          ]),
          scales: def.scales.map((s) => s.key),
        };
  return createHash('sha256').update(stableStringify(core)).digest('hex');
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
  // Bilişsel görevlerde madde yoktur; deneme verisi task_trials tablosunda tutulur.
  if (def.engine === 'tasks') return [];
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
      .select({ id: instrumentVersions.id, contentHash: instrumentVersions.contentHash, definition: instrumentVersions.definition })
      .from(instrumentVersions)
      .where(and(eq(instrumentVersions.instrumentId, inst.id), eq(instrumentVersions.version, def.version)))
      .limit(1);

    if (existing) {
      if (existing.contentHash === hash) continue;
      const stored = existing.definition as unknown as InstrumentDef;
      if (scoringHash(stored) === scoringHash(def)) {
        // Yalnızca sunum metinleri değişmiş: aynı sürümün üzerine yaz.
        await db
          .update(instrumentVersions)
          .set({ definition: def as unknown as Record<string, unknown>, contentHash: hash })
          .where(eq(instrumentVersions.id, existing.id));
        log(`${def.slug} v${def.version}: açıklama metinleri güncellendi.`);
        continue;
      }
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
        const rowsForItems = itemRows(def, existing.id);
        if (rowsForItems.length) await tx.insert(items).values(rowsForItems);
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
      const newItems = itemRows(def, v.id);
      if (newItems.length) await tx.insert(items).values(newItems);
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
