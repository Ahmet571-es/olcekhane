import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '@/content/instruments';
import { LEGAL_DOCS, legalDocBySlug } from '@/content/legal';

// Sitenin temel sözü: hiçbir veri saklanmaz. Veritabanı, hesap, iletişim formu ve çerez yoktur; sunucu
// Almanya'dadır. Bu testler hem kodun bu sözü bozacak bir şey içermediğini hem de sitedeki metinlerin
// bu gerçekle çelişmediğini denetler.

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

/** src altındaki bütün .ts ve .tsx dosyaları. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(name) ? [p] : [];
  });
}

/** Rapor uçlarının hata özetini yazan satırın numarası. */
function httpLogLine(): number {
  const lines = readFileSync(path.join(SRC, 'lib', 'assessment', 'http.ts'), 'utf8').split('\n');
  return lines.findIndex((l) => l.includes('console.error(')) + 1;
}

function scan(patterns: RegExp[], allow: (file: string) => boolean = () => false): string[] {
  const hits: string[] = [];
  for (const file of sourceFiles(SRC)) {
    const rel = path.relative(SRC, file);
    if (allow(rel)) continue;
    const text = readFileSync(file, 'utf8');
    for (const re of patterns) if (re.test(text)) hits.push(`${rel}: ${re}`);
  }
  return hits;
}

describe('hiçbir veri saklanmaz', () => {
  it('veritabanı, e-posta gönderimi ya da oturum kitaplığı yoktur', () => {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as Record<string, Record<string, string> | undefined>;
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    const storage = [
      'pg',
      'postgres',
      'drizzle-orm',
      'drizzle-kit',
      'prisma',
      '@prisma/client',
      'mysql',
      'mysql2',
      'sqlite3',
      'better-sqlite3',
      'mongodb',
      'mongoose',
      'redis',
      'ioredis',
      'knex',
      'sequelize',
      'typeorm',
      'nodemailer',
      'next-auth',
      'iron-session',
    ];
    expect(deps.filter((d) => storage.includes(d))).toEqual([]);
  });

  it('kod dosyaya yazmaz, çerez ve tarayıcı deposu kullanmaz', () => {
    const hits = scan([
      /\b(writeFile|writeFileSync|appendFile|appendFileSync|createWriteStream|mkdirSync|mkdir)\b/,
      /\b(localStorage|sessionStorage|indexedDB)\s*[.[]/,
      /document\.cookie/,
      /\bcookies\(\)/,
      /\.cookies\.(set|get)\b/,
      /Set-Cookie/i,
    ]);
    expect(hits).toEqual([]);
  });

  it('dosya sistemine yalnızca paylaşım görsellerinin yazı tiplerini okumak için erişilir', () => {
    const hits = scan([/from ['"](node:)?fs(\/promises)?['"]/], (rel) => rel === path.join('lib', 'og.tsx'));
    expect(hits).toEqual([]);
    expect(readFileSync(path.join(SRC, 'lib', 'og.tsx'), 'utf8')).toMatch(/import \{ readFile \} from 'node:fs\/promises';/);
  });

  it('günlüğe yalnızca hata özeti yazılır (istek gövdesi ya da cevaplar yazılmaz)', () => {
    // console'un her kullanımı (tek ya da çok satırlı çağrı, console.trace, console.dir…) ve doğrudan
    // standart çıktıya yazma aranır; izin verilen tek yer rapor uçlarının hata özetidir.
    const uses: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/\bconsole\s*(\.|\[)|process\.(stdout|stderr)|\bdebuglog\b|from ['"](node:)?util['"]/g)) {
        const line = text.slice(0, m.index).split('\n').length;
        uses.push(`${path.relative(SRC, file)}:${line}: ${text.split('\n')[line - 1].trim()}`);
      }
    }
    expect(uses).toEqual([`${path.join('lib', 'assessment', 'http.ts')}:${httpLogLine()}: console.error(\`[rapor] \${where}: \${errorSummary(err)}\`);`]);
  });
});

describe('hukuki metinler', () => {
  it('yalnızca aydınlatma metni, kullanım koşulları ve çerez politikası yayındadır', () => {
    expect(LEGAL_DOCS.map((d) => d.kind).sort()).toEqual(['cookie_policy', 'privacy_notice', 'terms']);
  });

  it('aydınlatma metni sitenin gerçek işleyişini anlatır', () => {
    const doc = legalDocBySlug('aydinlatma-metni')!;
    expect(doc.version).toBeGreaterThanOrEqual(3);
    expect(doc.bodyMd).toContain('hesap, üyelik, iletişim formu ve veritabanı yoktur');
    expect(doc.bodyMd).toContain('Almanya');
    expect(doc.bodyMd).toContain('Hostinger');
    expect(doc.bodyMd).toContain('yurt dışına aktarılmış olur');
    expect(doc.bodyMd).toContain('Test cevapları ve raporlar: saklanmaz');
    expect(doc.bodyMd).toContain('en geç 11 dakika');
    expect(doc.bodyMd).not.toMatch(/Türkiye[’']de/);
    // Artık var olmayan işleyişler anlatılmaz.
    expect(doc.bodyMd).not.toMatch(/iletişim formundan|giriş sayfası|oturum|yedek|şifrelenmiş|denetim kaydı|3 gün/i);
  });

  it('çerez politikası çerez kullanılmadığını söyler; artık olmayan çerezler anlatılmaz', () => {
    const doc = legalDocBySlug('cerez-politikasi')!;
    expect(doc.bodyMd.startsWith('Ölçekhane çerez kullanmaz.')).toBe(true);
    expect(doc.bodyMd).not.toMatch(/olc_oturum|olc_var|olc_iki_asama|giriş yap/i);
  });

  it('kullanım koşulları hesaplardan söz etmez', () => {
    const doc = legalDocBySlug('kullanim-kosullari')!;
    expect(doc.bodyMd).not.toMatch(/Veli hesabı|hesaplar şu an|Hesap bilgileriniz|Hesabınızın/i);
  });
});

describe('sitedeki sözler', () => {
  it('verilerin Türkiye’de tutulduğu ya da yurt dışına aktarılmadığı söylenmez (sunucu Almanya’da)', () => {
    expect(scan([/Türkiye[’']de(ki)? sunucu/i, /Sunucu(lar|larımız)? Türkiye/i, /Veriler Türkiye/i, /yurt dışına aktarılmaz/i, /Türkiye[’']dedir/i])).toEqual([]);
  });

  it('kaldırılan bölümlere bağlantı ya da söz yoktur (hesap, giriş, okul paneli, iletişim formu)', () => {
    const hits = scan([
      /href=["'{`]+\/(giris|kayit|panel|okul|okullar-icin|ogrenci-girisi|yonetim|hesap|uygulama|hizli-test)\b/,
      /\/api\/(attempts|hizli-test)\b/,
      /iletişim formundan|iletişim formunu|iletişim formuyla|formu doldur/i,
      /hızlı test/i,
      /ACCOUNTS_ENABLED|accountsOpen/,
    ]);
    expect(hits).toEqual([]);
  });

  it('test yönergeleri ara verme ya da kaydetme sözü vermez (cevaplar saklanmaz)', () => {
    for (const d of INSTRUMENTS) {
      for (const p of d.intro.paragraphs) expect(p, d.slug).not.toMatch(/ara ver|kaldığın yerden|kaydedilir/i);
      expect(d.description, d.slug).not.toMatch(/ara verilebilir|ara verip/i);
    }
  });

  it('bilim kartları yapılmayan çalışmaları sürüyormuş ya da yapılacakmış gibi anlatmaz', () => {
    for (const d of INSTRUMENTS) {
      const s = d.science;
      const texts = [s.turkishVersion, s.reliability, s.normNote, ...s.limitations];
      for (const t of texts) {
        expect(t, d.slug).not.toMatch(/platform verisi|sürmektedir|sürüyor|sürdürülüyor|incelenmekte|inceleniyor|oluşturuluyor|hazırlanıyor/i);
        expect(t, d.slug).not.toMatch(/yayımlanacak|oluşturulacak|hesaplanacak|toplanacak|incelenecek/i);
      }
    }
  });
});
