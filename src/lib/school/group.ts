import 'server-only';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { RIASEC_ORDER, RIASEC_TYPES } from '@/content/careers/riasec';
import { REPORT_TEMPLATES } from '@/content/reports';
import { db } from '@/db';
import { groupReportSnapshots, scores } from '@/db/schema';
import { BANDS, type Band, type InstrumentDef } from '@/lib/instruments/types';
import { DEFAULT_BAND_LABELS, nearestBand } from '@/lib/reports/bands';
import type { QuizResult } from '@/lib/scoring/quiz';
import type { FlankerResult, SpanResult, SymbolResult } from '@/lib/scoring/tasks';
import { activeConsentSql } from './queries';
import { SUPPRESS_BELOW, safeBands, suppress, type BandCell, type Cell } from './suppress';

/**
 * Sınıf grup raporu. Kimlik içermez: en az `minGroupSize` öğrencinin sonucu yoksa hiçbir şey
 * gösterilmez. Dağılımlarda 1 ya da 2 öğrencilik hücreler gizlenir; gizli hücre toplamdan
 * hesaplanamasın diye gerekirse bir hücre daha gizlenir (tamamlayıcı gizleme).
 */

export { SUPPRESS_BELOW, safeBands, suppress, type Cell } from './suppress';

/** Rapor yapısı değişince artırılır; eski biçimde kaydedilmiş yayımlanmış raporlar yeniden hesaplanır. */
export const GROUP_REPORT_FORMAT = 2;

export interface GroupReport {
  format: number;
  n: number;
  insufficient: boolean;
  minGroupSize: number;
  firstCompleted: Date | null;
  lastCompleted: Date | null;
  likert?: {
    /** bands null: küçük gruplar nedeniyle dağılım gösterilmez. */
    scales: { key: string; name: string; plain: string; mean: number | null; min: number; max: number; bands: BandCell[] | null }[];
  };
  riasec?: { types: { key: string; name: string; mean: number | null }[] };
  quiz?: {
    meanPct: number;
    bands: BandCell[] | null;
    domains: { key: string; name: string; meanPct: number }[];
    misconceptions: { key: string; name: string; tip: string; students: Cell; pct: number | null }[];
    contentGrade: number | null;
  };
  cognitive?: { rows: { key: string; name: string; value: string }[] };
  reading?: { meanComprehensionPct: number; medianWpm: number };
}

const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
}
function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Sınıftaki her öğrencinin bu testteki en son tamamlanmış uygulaması (rızası geçerli olanlar). */
async function latestAttempts(classId: string, instrumentId: string) {
  const rows = await db.execute<{ id: string; student_id: string; completed_at: Date }>(sql`
    select distinct on (a.student_id) a.id, a.student_id, a.completed_at
    from attempts a
    join instrument_versions v on v.id = a.version_id
    join class_students cs on cs.student_id = a.student_id and cs.class_id = ${classId}
    join students s on s.id = a.student_id and s.deleted_at is null
    where v.instrument_id = ${instrumentId} and a.status = 'completed' and ${activeConsentSql(sql`a.student_id`)}
    order by a.student_id, a.completed_at desc
  `);
  return rows.map((r) => ({ id: r.id, studentId: r.student_id, completedAt: new Date(r.completed_at) }));
}

type LatestAttempt = Awaited<ReturnType<typeof latestAttempts>>[number];

export async function buildGroupReport(
  def: InstrumentDef,
  instrumentId: string,
  classId: string,
  minGroupSize: number,
  precomputed?: LatestAttempt[],
): Promise<GroupReport> {
  const list = precomputed ?? (await latestAttempts(classId, instrumentId));
  const n = list.length;
  const times = list.map((l) => l.completedAt.getTime());
  const base: GroupReport = {
    format: GROUP_REPORT_FORMAT,
    n,
    insufficient: n < minGroupSize,
    minGroupSize,
    firstCompleted: times.length ? new Date(Math.min(...times)) : null,
    lastCompleted: times.length ? new Date(Math.max(...times)) : null,
  };
  if (base.insufficient) return base;

  const rows = await db
    .select({ attemptId: scores.attemptId, scaleKey: scores.scaleKey, raw: scores.raw, mean: scores.mean, band: scores.band, extra: scores.extra })
    .from(scores)
    .where(inArray(scores.attemptId, list.map((l) => l.id)));
  const byScale = new Map<string, typeof rows>();
  for (const r of rows) byScale.set(r.scaleKey, [...(byScale.get(r.scaleKey) ?? []), r]);
  const labels = REPORT_TEMPLATES[def.slug]?.bandLabels ?? {};

  if (def.engine === 'likert' && def.profile === 'riasec') {
    // İlgi alanlarında yalnızca ortalamalar gösterilir: “en belirgin ilgisi X olan öğrenci sayısı”
    // gibi toplamı bilinen sayılar küçük gruplarda tek tek öğrencileri açığa çıkarabilir.
    return {
      ...base,
      riasec: {
        types: RIASEC_ORDER.map((k) => ({
          key: k,
          name: RIASEC_TYPES[k].name,
          mean: mean((byScale.get(RIASEC_TYPES[k].scaleKey) ?? []).map((r) => r.mean).filter((x): x is number => x !== null)),
        })),
      },
    };
  }

  if (def.engine === 'likert') {
    const opt = def.options.map((o) => o.value);
    const isMean = def.scoring.method === 'mean';
    return {
      ...base,
      likert: {
        scales: def.scales.map((s) => {
          const rs = byScale.get(s.key) ?? [];
          const nItems = def.items.filter((i) => i.scale === s.key).length;
          const vals = rs.map((r) => (isMean ? r.mean : r.raw)).filter((x): x is number => x !== null);
          // Raporda kullanılan düzeyler gösterilir; norm varken oluşan uç düzeyler en yakın düzeyde sayılır.
          const shown = BANDS.filter((b) => (Object.keys(labels).length ? labels[b] : def.anchoredBands.thresholds.some((t) => t.band === b)));
          const bands = safeBands(
            shown.map((b) => ({
              key: b,
              label: labels[b] ?? DEFAULT_BAND_LABELS[b],
              count: rs.filter((r) => r.band && nearestBand(r.band as Band, (x) => shown.includes(x)) === b).length,
            })),
          );
          return {
            key: s.key,
            name: s.name,
            plain: s.plain,
            mean: mean(vals),
            min: isMean ? Math.min(...opt) : Math.min(...opt) * nItems,
            max: isMean ? Math.max(...opt) : Math.max(...opt) * nItems,
            bands,
          };
        }),
      },
    };
  }

  if (def.engine === 'quiz') {
    const totals = (byScale.get('total') ?? []).map((r) => r.extra as unknown as QuizResult).filter(Boolean);
    const formKeys = new Map<string, number>();
    for (const t of totals) formKeys.set(t.formKey, (formKeys.get(t.formKey) ?? 0) + 1);
    const formKey = [...formKeys.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const form = def.forms.find((f) => f.key === formKey);
    const studentsWith = new Map<string, number>();
    for (const t of totals) for (const m of t.misconceptions) studentsWith.set(m.key, (studentsWith.get(m.key) ?? 0) + 1);
    const misconceptions = [...studentsWith.entries()]
      .filter(([k]) => def.misconceptions[k])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, c]) => ({
        key: k,
        name: def.misconceptions[k].name,
        tip: def.misconceptions[k].tip,
        students: suppress(c),
        pct: c >= SUPPRESS_BELOW ? Math.round((c / totals.length) * 100) : null,
      }));
    return {
      ...base,
      quiz: {
        meanPct: Math.round((mean(totals.map((t) => t.ratio)) ?? 0) * 100),
        bands: safeBands(
          (['high', 'average', 'low'] as Band[]).map((b) => ({ key: b, label: labels[b] ?? DEFAULT_BAND_LABELS[b], count: totals.filter((t) => t.band === b).length })),
        ),
        domains: (form?.domains ?? []).map((d) => ({
          key: d.key,
          name: d.name,
          meanPct: Math.round((mean(totals.map((t) => t.domains.find((x) => x.key === d.key)?.ratio ?? 0)) ?? 0) * 100),
        })),
        misconceptions,
        contentGrade: form?.contentGrade ?? null,
      },
    };
  }

  if (def.engine === 'tasks') {
    const out: { key: string; name: string; value: string }[] = [];
    for (const s of def.scales) {
      const rs = byScale.get(s.key) ?? [];
      const ex = rs.map((r) => r.extra).filter(Boolean);
      const raw = rs.map((r) => r.raw).filter((x): x is number => x !== null);
      if (!ex.length) continue;
      if (s.key === 'attention') {
        const acc = mean(ex.map((e) => (e as unknown as FlankerResult).accuracy));
        const rt = median(ex.map((e) => (e as unknown as FlankerResult).meanRt).filter((x): x is number => x !== null));
        out.push({ key: s.key, name: s.name, value: `ortalama %${nf0.format(Math.round((acc ?? 0) * 100))} doğru${rt ? `, ortanca tepki süresi ${nf0.format(rt)} ms` : ''}` });
      } else if (s.key === 'speed') {
        const pm = mean(ex.map((e) => (e as unknown as SymbolResult).perMinute));
        out.push({ key: s.key, name: s.name, value: `dakikada ortalama ${nf1.format(pm ?? 0)} doğru eşleştirme` });
      } else if (s.key === 'tempo') {
        out.push({ key: s.key, name: s.name, value: `dakikada ortalama ${nf0.format(mean(raw) ?? 0)} harf` });
      } else if (s.key === 'isabet') {
        out.push({ key: s.key, name: s.name, value: `aranan harflerin ortalama %${nf0.format(mean(raw) ?? 0)} kadarı bulundu` });
      } else if (s.key === 'net') {
        out.push({ key: s.key, name: s.name, value: `ortanca ${nf0.format(median(raw) ?? 0)} net doğru` });
      } else if (s.key === 'surdurme') {
        // Değişim, ilk bölümlerde net doğrusu olmayanlarda hesaplanmaz.
        const md = median(raw);
        out.push({
          key: s.key,
          name: s.name,
          value: md === null ? '—' : `son bölümlerde ilk bölümlere göre ortanca %${nf0.format(Math.abs(md))} ${md < 0 ? 'düşüş' : 'artış'}`,
        });
      } else {
        const spans = ex.map((e) => (e as unknown as SpanResult).span).filter((x) => x > 0);
        const md = median(spans);
        out.push({ key: s.key, name: s.name, value: md ? `ortanca dizi uzunluğu ${nf1.format(md)}` : '—' });
      }
    }
    return { ...base, cognitive: { rows: out } };
  }

  // Okuma
  const comp = (byScale.get('comprehension') ?? []).map((r) => r.mean).filter((x): x is number => x !== null);
  const wpm = (byScale.get('speed') ?? []).map((r) => r.raw).filter((x): x is number => x !== null);
  return { ...base, reading: { meanComprehensionPct: Math.round((mean(comp) ?? 0) * 100), medianWpm: Math.round(median(wpm) ?? 0) } };
}

/* ---------- Öğretmen görünümü: fark almaya karşı yayımlanmış rapor ---------- */

/** Yayımlanmış rapor, en az bu kadar öğrencilik değişiklik birikince güncellenir. */
export const RELEASE_MIN_CHANGE = 3;

export type ReleasedGroupReport =
  | { state: 'report'; report: GroupReport; releasedAt: Date | null; pending: number }
  | { state: 'updating'; n: number };

function reviveReport(raw: Record<string, unknown>): GroupReport {
  const r = raw as unknown as GroupReport & { firstCompleted: string | null; lastCompleted: string | null };
  return { ...r, firstCompleted: r.firstCompleted ? new Date(r.firstCompleted) : null, lastCompleted: r.lastCompleted ? new Date(r.lastCompleted) : null };
}

/**
 * Öğretmenlere gösterilen grup raporu. Rapor her yeni sonuçla yeniden hesaplansaydı, öncesi ve
 * sonrası karşılaştırılarak telafi sınavına giren tek bir öğrencinin sonucu bulunabilirdi. Bu yüzden:
 * - rapor bir kez yayımlanır ve kaydedilir;
 * - yeni sonuçlar en az RELEASE_MIN_CHANGE öğrenci birikince rapora eklenir (o zamana kadar eski
 *   rapor gösterilir);
 * - bir sonuç rapordan çıkmışsa (rıza geri alındı, öğrenci sınıftan çıktı, test yeniden çözüldü)
 *   eski rapor artık gösterilemez; yeterli değişiklik birikene kadar rapor “güncelleniyor” olur.
 * Rehber öğretmen bireysel sonuçları zaten gördüğü için ona her zaman güncel rapor gösterilir.
 */
export async function releasedGroupReport(
  def: InstrumentDef,
  instrumentId: string,
  classId: string,
  minGroupSize: number,
): Promise<ReleasedGroupReport> {
  const current = await latestAttempts(classId, instrumentId);
  const ids = current.map((a) => a.id).sort();
  if (ids.length < minGroupSize) {
    return { state: 'report', report: await buildGroupReport(def, instrumentId, classId, minGroupSize, current), releasedAt: null, pending: 0 };
  }
  const [snap] = await db
    .select()
    .from(groupReportSnapshots)
    .where(and(eq(groupReportSnapshots.classId, classId), eq(groupReportSnapshots.instrumentId, instrumentId)))
    .orderBy(desc(groupReportSnapshots.createdAt))
    .limit(1);
  if (snap) {
    const before = new Set(snap.attemptIds);
    const now = new Set(ids);
    const added = ids.filter((id) => !before.has(id)).length;
    const removed = snap.attemptIds.filter((id) => !now.has(id)).length;
    if (removed === 0 && added < RELEASE_MIN_CHANGE) {
      if (snap.n < minGroupSize) return { state: 'updating', n: ids.length };
      if ((snap.report as { format?: number }).format === GROUP_REPORT_FORMAT) {
        return { state: 'report', report: reviveReport(snap.report), releasedAt: snap.createdAt, pending: added };
      }
      // Rapor biçimi değiştiyse yayımlanmış rapor, AYNI sonuç kümesinden yeni biçimde yeniden hesaplanır:
      // güncel kümeden hesaplansaydı öğretmen, eski raporla karşılaştırarak tek bir yeni sonucu ayırt edebilirdi.
      const report = await buildGroupReport(def, instrumentId, classId, minGroupSize, current.filter((a) => before.has(a.id)));
      await db
        .update(groupReportSnapshots)
        .set({ report: report as unknown as Record<string, unknown> })
        .where(eq(groupReportSnapshots.id, snap.id));
      return { state: 'report', report, releasedAt: snap.createdAt, pending: added };
    }
    if (added + removed < RELEASE_MIN_CHANGE) return { state: 'updating', n: ids.length };
  }
  const report = await buildGroupReport(def, instrumentId, classId, minGroupSize, current);
  await db.insert(groupReportSnapshots).values({
    classId,
    instrumentId,
    attemptIds: ids,
    n: ids.length,
    report: report as unknown as Record<string, unknown>,
  });
  return { state: 'report', report, releasedAt: new Date(), pending: 0 };
}
