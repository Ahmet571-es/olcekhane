export interface CsvOptions {
  /**
   * Türkçe Excel biçimi: alan ayırıcı noktalı virgül, ondalık ayırıcı virgül. Varsayılan biçim
   * (virgül ve nokta) R, SPSS, JASP gibi analiz programları içindir.
   */
  excel?: boolean;
}

/** CSV alanı: sayılar olduğu gibi; metinler gerekirse tırnaklanır ve formül olarak yorumlanmaması için korunur. */
export function csvField(v: unknown, opts: CsvOptions = {}): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return '';
    return opts.excel ? String(v).replace('.', ',') : String(v);
  }
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(header: string[], rows: unknown[][], opts: CsvOptions = {}): string {
  const sep = opts.excel ? ';' : ',';
  const line = (r: unknown[]) => r.map((v) => csvField(v, opts)).join(sep);
  // Başlangıçtaki BOM, Excel’in Türkçe karakterleri doğru okuması içindir.
  return `\uFEFF${[line(header), ...rows.map(line)].join('\r\n')}\r\n`;
}
