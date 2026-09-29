/**
 * Öğrenci listesinin tablodan (Excel, e-Okul çıktısı, Google E-Tablolar) yapıştırılarak aktarılması.
 * Sütun sırası esnektir: e-posta içeren sütun veli e-postası, yalnızca rakamlardan oluşan sütun okul
 * numarası, kalan sütunlar ad ve soyad olarak okunur. Tek sütunda “Ad Soyad” yazılmışsa son kelime
 * soyadı, öncekiler ad kabul edilir (ör. “Ayşe Nur Yılmaz”).
 */

export const MAX_IMPORT_ROWS = 200;

export interface ImportRow {
  line: number;
  firstName: string;
  lastName: string | null;
  schoolNo: string | null;
  guardianEmail: string | null;
}

export interface ImportParseResult {
  rows: ImportRow[];
  errors: { line: number; message: string }[];
}

const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/;
/** Başlık hücreleri, Türkçe karakterler sadeleştirildikten sonra karşılaştırılır (ADI, Adı, ADİ aynı). */
const HEADER_WORDS =
  /^(s\.? ?no|sira( no)?|ad|adi|isim|soyad|soyadi|ad soyad|adi soyadi|ad-soyad|ogrenci|ogrenci adi|ogrenci no|ogrenci numarasi|no|numara|okul no|okul numarasi|e-?posta|veli|veli e-?posta(si)?|veli maili?|mail|sinif|sinifi|sube|subesi|cinsiyet|cinsiyeti)$/;
/** Cinsiyet ve sınıf/şube sütunları aktarılmaz (ör. “Kız”, “E”, “7-A”, “9/C”). */
const GENDER = /^(k|e|kiz|erkek)$/;
const CLASS_TOKEN = /^\d{1,2}\s*[-/.]?\s*[a-zçğıöşü]$/i;

function fold(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/\s+/g, ' ');
}

function tidyName(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => (w ? w[0].toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR') : w))
    .join(' ');
}

function detectDelimiter(lines: string[]): string | null {
  if (lines.some((l) => l.includes('\t'))) return '\t';
  if (lines.some((l) => l.includes(';'))) return ';';
  if (lines.some((l) => l.includes(','))) return ',';
  return null;
}

export function parseStudentList(text: string): ImportParseResult {
  const rawLines = text.split(/\r?\n/);
  const lines = rawLines.map((l, i) => ({ l: l.trim(), n: i + 1 })).filter((x) => x.l.length > 0);
  const delimiter = detectDelimiter(lines.map((x) => x.l));
  const rows: ImportRow[] = [];
  const errors: ImportParseResult['errors'] = [];

  for (const { l, n } of lines) {
    const cells = (delimiter ? l.split(delimiter) : [l]).map((c) => c.trim()).filter((c) => c.length > 0);
    if (cells.length === 0) continue;
    // Başlık satırı: ilk satırdaki bütün hücreler bilinen başlık kelimelerinden oluşuyorsa atla
    // (yalnızca ilk satırda bakılır; “Veli” gibi başlığa benzeyen adlar sonraki satırlarda öğrencidir).
    if (n === lines[0].n && cells.every((c) => HEADER_WORDS.test(fold(c)))) continue;

    let email: string | null = null;
    const numbers: string[] = [];
    const names: string[] = [];
    let idNumber = false;
    for (const c of cells) {
      if (c.includes('@')) {
        // E-posta adresleri ASCII’dir: Türkçe küçültme “I” harfini “ı” yapacağı için kullanılmaz.
        email = c.toLowerCase();
      } else if (/^\d{11}$/.test(c)) {
        idNumber = true;
      } else if (/^\d{1,10}$/.test(c)) {
        numbers.push(c);
      } else if (GENDER.test(fold(c)) || CLASS_TOKEN.test(c)) {
        continue;
      } else {
        names.push(c);
      }
    }
    if (idNumber) {
      errors.push({ line: n, message: 'T.C. kimlik numarasına benzeyen 11 haneli bir sayı var. Kimlik numarası istemiyoruz; bu sütunu çıkarıp yeniden yapıştırın.' });
      continue;
    }
    // Sıra numarası ile okul numarası birlikteyse daha uzun olan (eşitse sonraki) okul numarası sayılır.
    const schoolNo = numbers.reduce<string | null>((best, x) => (best === null || x.length >= best.length ? x : best), null);

    let firstName = '';
    let lastName: string | null = null;
    if (names.length >= 2) {
      firstName = names[0];
      lastName = names.slice(1).join(' ');
    } else if (names.length === 1) {
      const parts = names[0].split(/\s+/);
      if (parts.length >= 2) {
        firstName = parts.slice(0, -1).join(' ');
        lastName = parts[parts.length - 1];
      } else {
        firstName = parts[0];
      }
    }
    firstName = tidyName(firstName);
    lastName = lastName ? tidyName(lastName) : null;

    if (firstName.length < 2 || firstName.length > 60 || /\d/.test(firstName)) {
      errors.push({ line: n, message: 'Öğrencinin adı okunamadı.' });
      continue;
    }
    if (lastName && (lastName.length > 60 || /\d/.test(lastName))) {
      errors.push({ line: n, message: 'Soyadı okunamadı.' });
      continue;
    }
    if (email && (!EMAIL.test(email) || email.length > 200)) {
      errors.push({ line: n, message: `Veli e-postası geçersiz: ${email}` });
      continue;
    }
    rows.push({ line: n, firstName, lastName, schoolNo, guardianEmail: email });
  }

  if (rows.length > MAX_IMPORT_ROWS) {
    return { rows: [], errors: [{ line: 0, message: `Bir seferde en fazla ${MAX_IMPORT_ROWS} öğrenci aktarılabilir.` }] };
  }
  // Aynı listede tekrar eden okul numaraları.
  const seen = new Map<string, number>();
  for (const r of rows) {
    if (!r.schoolNo) continue;
    const prev = seen.get(r.schoolNo);
    if (prev !== undefined) errors.push({ line: r.line, message: `${r.schoolNo} numarası listede ${prev}. satırda da var.` });
    else seen.set(r.schoolNo, r.line);
  }
  const dupLines = new Set(errors.map((e) => e.line));
  return { rows: rows.filter((r) => !dupLines.has(r.line)), errors };
}
