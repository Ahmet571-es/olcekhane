/**
 * Gelişimini karşılaştır (site sahibinin 2026-10-30 isteği): bir anket testinin (kişilik, ilgi, öğrenme, beceri ölçekleri) ya
 * da (2026-10-31'den) bir görev testinin raporu PDF olarak indirilince, PDF'in belge bilgilerine (anahtar sözcükler)
 * sonuçların küçük bir sayısal özeti yazılır. Kişi aynı testi daha sonra yeniden çözüp eski PDF'ini seçince, dosya yalnızca
 * tarayıcıda okunur ve iki sonuç ölçek ölçek (görevlerde sonuç sonuç) karşılaştırılır. Sunucuya hiçbir şey gitmez, hiçbir
 * şey saklanmaz; özet yalnızca kişinin kendi dosyasındadır.
 *
 * Değişimin ölçüm payını aşıp aşmadığı, ölçeğin bilinen güvenirliğinden (Cronbach α ve başvuru standart sapması; ölçüm
 * payı SEM = SD·√(1−α)) güvenilir değişim ölçütüyle hesaplanır: |fark| / (√2·SEM) ≥ 1,96 (Jacobson ve Truax, 1991).
 * Güvenirliği bilinmeyen ölçekte yalnızca farkın yönü söylenir, belirgin olup olmadığı söylenmez.
 *
 * Görev (zekâ ve dikkat) testlerinde de raporun ana sonuçları (doğru sayısı ya da oranı, düzey, en uzun dizi, tipik süre)
 * özete yazılır (lib/compare/tasks.ts); bu testlerin ölçüm payı bilinmediği için yalnızca farkın yönü söylenir ve testi
 * yeniden çözmenin sonucu yükseltebileceği (alıştırma etkisi) ayrıca belirtilir.
 */

/** PDF'teki özetin başı: sürüm 1. */
export const RECORD_MARK = 'olcekhane-sonuc:1:';
/** Güvenilir değişim ölçütü (iki yönlü %95). */
export const RCI_CRITERION = 1.96;

/** Sayının birimi: boş (sayı, puan), yüzde, saniye ya da derece. */
export type CompareUnit = '' | '%' | 'sn' | 'derece';
/**
 * Sayının yazımı (görev testlerinde, raporla aynı): "clock" tam saniye (0 → "1 sn’den kısa", 60 ve üstü dakikayla), "trim"
 * ondalıktaki sondaki sıfırlar yazılmaz ("4 sn", "4,2 sn"); verilmezse `decimals` kadar ondalık.
 */
export type CompareFormat = 'clock' | 'trim';

/** Sayının gösterimiyle ilgili alanlar (görev testlerinde; anket testlerinde hiçbiri yoktur). */
export interface CompareDisplay {
  /** Birim (verilmezse birimsiz sayı). */
  unit?: CompareUnit;
  format?: CompareFormat;
  /** Süre: büyümesi yavaşlamak demektir ("Süre uzadı/kısaldı" denir). */
  time?: true;
  /** "18/24" gibi, en çok değerle birlikte yazılır. */
  outOf?: true;
  /** Üst sınır yalnızca bozuk değeri ayıklar: çizimde aralık iki değere göre seçilir (süreler, dakikadaki harf). */
  open?: true;
}

export interface CompareScale extends CompareDisplay {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  /** Ölçüm payı (SEM, puanla aynı ölçekte); ölçeğin güvenirliği bilinmiyorsa null. */
  sem: number | null;
  /** Puanın gösterildiği ondalık sayısı (anketlerde ortalama puanda 1, toplam puanda 0; görevlerde sürelerde 1 ya da 2). */
  decimals: 0 | 1 | 2;
  /** Düzeyin rapordaki adı ("Orta" gibi). */
  band: string | null;
}

/** Raporun karşılaştırma bilgisi (anket ve görev testlerinde; okuma ve konu tarama testlerinde yoktur). */
export interface CompareInfo {
  slug: string;
  version: number;
  /** Raporun tarihi (ISO). */
  date: string;
  scales: CompareScale[];
  /**
   * Görev testi: yeniden çözünce alıştırma etkisiyle sonuç biraz yükselebilir. "items": her seferinde aynı sorular (ya da
   * aynı kelimeler) gelir, hatırlananlar da sonucu etkileyebilir; "practice": sorular ya da denemeler hatırlanacak türden
   * değildir ya da her seferinde yeniden üretilir. Anket testlerinde yoktur.
   */
  retest?: 'items' | 'practice';
  /** Bu testin özetinin PDF'lere yazılmaya başlandığı gün (ISO tarih; verilmezse 2026-10-30). */
  since?: string;
}

/** PDF'e yazılan özet: test, sürüm, tarih ve ölçek ölçek [anahtar, puan, düzey]. */
export interface ResultRecord {
  s: string;
  v: number;
  d: string;
  r: [string, number, string | null][];
}

export const toRecord = (c: CompareInfo): ResultRecord => ({ s: c.slug, v: c.version, d: c.date, r: c.scales.map((x) => [x.key, x.value, x.band]) });

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** PDF'in anahtar sözcükleri: işaret ve özetlerin (bir ya da, pakette, birkaç test) kodlanmış hâli. */
export const encodeRecords = (records: ResultRecord[]) => `${RECORD_MARK}${toBase64Url(JSON.stringify(records))}`;

const isRecord = (x: unknown): x is ResultRecord => {
  if (!x || typeof x !== 'object') return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.s === 'string' &&
    typeof r.v === 'number' &&
    typeof r.d === 'string' &&
    !Number.isNaN(Date.parse(r.d)) &&
    Array.isArray(r.r) &&
    r.r.every((e) => Array.isArray(e) && typeof e[0] === 'string' && typeof e[1] === 'number' && Number.isFinite(e[1]) && (e[2] === null || typeof e[2] === 'string'))
  );
};

/**
 * Bir PDF dosyasının baytlarından özetleri okur (dosya tarayıcıda okunur). Özet yoksa (bu özellikten önce indirilmiş
 * raporlar ya da başka bir dosya) ya da bozuksa null.
 */
export function readRecords(bytes: Uint8Array): ResultRecord[] | null {
  // Belge bilgileri sıkıştırılmaz; işaret ve kod ASCII olduğu için baytlar doğrudan metin olarak aranabilir.
  let text = '';
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) text += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  const m = new RegExp(`${RECORD_MARK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([A-Za-z0-9_-]+)`).exec(text);
  if (!m) return null;
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(m[1]));
    return Array.isArray(parsed) && parsed.length > 0 && parsed.every(isRecord) ? parsed : null;
  } catch {
    return null;
  }
}

export type ChangeVerdict = 'up' | 'down' | 'stable' | 'up-unknown' | 'down-unknown' | 'same';

export interface CompareRow extends CompareDisplay {
  key: string;
  label: string;
  before: number;
  after: number;
  min: number;
  max: number;
  decimals: 0 | 1 | 2;
  bandBefore: string | null;
  bandAfter: string | null;
  /**
   * up/down: fark ölçüm payını aşıyor (güvenilir değişim); stable: ölçüm payı içinde; up-unknown/down-unknown: fark var ama
   * ölçeğin güvenirliği bilinmediği için belirgin olup olmadığı söylenemez; same: gösterilen puan aynı.
   */
  verdict: ChangeVerdict;
}

export type CompareOutcome =
  | { status: 'ok'; rows: CompareRow[]; days: number; known: boolean }
  /** Dosyada bu testin özeti yok; `many`: dosyada birden çok testin özeti var (paket raporu). */
  | { status: 'other-test'; many?: true }
  | { status: 'version' };

const shown = (x: number, decimals: 0 | 1 | 2) => Math.round(x * 10 ** decimals) / 10 ** decimals;

/** Şimdiki sonucu PDF'teki özetlerden aynı teste ait olanla karşılaştırır. */
export function compareResults(current: CompareInfo, records: ResultRecord[]): CompareOutcome {
  const same = records.filter((r) => r.s === current.slug);
  if (same.length === 0) return records.length > 1 ? { status: 'other-test', many: true } : { status: 'other-test' };
  const prev = same.find((r) => r.v === current.version);
  if (!prev) return { status: 'version' };
  const before = new Map(prev.r.map(([k, v, b]) => [k, { v, b }]));
  const rows: CompareRow[] = [];
  for (const s of current.scales) {
    const p = before.get(s.key);
    if (!p || p.v < s.min - 1e-9 || p.v > s.max + 1e-9) continue;
    const diff = s.value - p.v;
    let verdict: ChangeVerdict;
    if (shown(s.value, s.decimals) === shown(p.v, s.decimals)) verdict = 'same';
    else if (s.sem && s.sem > 0) verdict = Math.abs(diff) / (Math.SQRT2 * s.sem) >= RCI_CRITERION ? (diff > 0 ? 'up' : 'down') : 'stable';
    else verdict = diff > 0 ? 'up-unknown' : 'down-unknown';
    rows.push({
      key: s.key,
      label: s.label,
      before: p.v,
      after: s.value,
      min: s.min,
      max: s.max,
      decimals: s.decimals,
      ...(s.unit ? { unit: s.unit } : {}),
      ...(s.format ? { format: s.format } : {}),
      ...(s.time ? { time: true as const } : {}),
      ...(s.outOf ? { outOf: true as const } : {}),
      ...(s.open ? { open: true as const } : {}),
      bandBefore: p.b,
      bandAfter: s.band,
      verdict,
    });
  }
  const days = Math.round((Date.parse(current.date) - Date.parse(prev.d)) / 86_400_000);
  return { status: 'ok', rows, days, known: current.scales.some((s) => !!s.sem) };
}

/** İki sonuç arasındaki süre: "aynı gün", "12 gün", "yaklaşık 3 ay", "yaklaşık 1,5 yıl". */
export function gapText(days: number): string {
  const d = Math.abs(days);
  if (d < 1) return 'aynı gün';
  if (d < 45) return `${d} gün`;
  if (d < 365) return `yaklaşık ${Math.round(d / 30.4)} ay`;
  const years = Math.round((d / 365) * 2) / 2;
  return `yaklaşık ${new Intl.NumberFormat('tr-TR').format(years)} yıl`;
}
