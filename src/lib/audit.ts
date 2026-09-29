import 'server-only';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { errorSummary } from '@/lib/log';
import { clientIp } from '@/lib/request';

export async function audit(entry: {
  actorUserId?: string | null;
  actorStudentId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      actorUserId: entry.actorUserId ?? null,
      actorStudentId: entry.actorStudentId ?? null,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId ?? null,
      meta: entry.meta,
      ip: await clientIp(),
    });
  } catch (err) {
    // Denetim kaydı yazılamazsa işlemi durdurmayız ama sunucu günlüğüne düşeriz (parametreler olmadan).
    console.error(`denetim kaydı yazılamadı (${entry.action}): ${errorSummary(err)}`);
  }
}
