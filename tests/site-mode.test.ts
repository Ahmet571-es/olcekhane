import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INSTRUMENTS } from '@/content/instruments';
import { LEGAL_DOCS, legalDocBySlug } from '@/content/legal';
import { ACCOUNTS_CLOSED_MESSAGE, accountsOpen } from '@/lib/site';

// Site hızlı test modunda açılır: hesaplar kapalı, hiçbir test cevabı saklanmaz, sunucu Almanya'da.
// Bu testler, sitedeki metinlerin bu gerçekle çelişen sözler içermediğini de denetler.

describe('hesap bölümü anahtarı', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('varsayılan kapalıdır; yalnızca ACCOUNTS_ENABLED=true açar', () => {
    vi.stubEnv('ACCOUNTS_ENABLED', '');
    expect(accountsOpen()).toBe(false);
    for (const v of ['false', '0', '1', 'yes', 'evet']) {
      vi.stubEnv('ACCOUNTS_ENABLED', v);
      expect(accountsOpen()).toBe(false);
    }
    vi.stubEnv('ACCOUNTS_ENABLED', ' TRUE ');
    expect(accountsOpen()).toBe(true);
  });

  it('hesaplar kapalıyken hesap açan ya da hesaba giren sunucu işlemleri reddedilir', async () => {
    vi.stubEnv('ACCOUNTS_ENABLED', 'false');
    const { registerAction } = await import('@/app/(auth)/actions');
    const { studentLoginAction } = await import('@/app/(auth)/ogrenci-girisi/actions');
    const { acceptInviteAction, registerFromInviteAction } = await import('@/app/(auth)/davet/actions');

    const reg = new FormData();
    for (const [k, v] of Object.entries({ fullName: 'Deneme Veli', email: 'veli@ornek.test', password: 'uzun-ve-guclu-bir-sifre-42', notice: 'on', adult: 'on' })) reg.set(k, v);
    await expect(registerAction({}, reg)).resolves.toEqual({ message: ACCOUNTS_CLOSED_MESSAGE });

    const code = new FormData();
    code.set('code', 'ABCD-EFGH-JK');
    await expect(studentLoginAction({}, code)).resolves.toEqual({ message: ACCOUNTS_CLOSED_MESSAGE });

    await expect(registerFromInviteAction('belirtec', {}, reg)).resolves.toEqual({ message: ACCOUNTS_CLOSED_MESSAGE });
    // Davet kabulü veritabanına hiç bakmadan davet sayfasına (kapalı sayfası) yönlendirir.
    await expect(acceptInviteAction('belirtec')).rejects.toMatchObject({ digest: expect.stringContaining('NEXT_REDIRECT') });
  });
});

describe('hukuki metinler', () => {
  it('aydınlatma metni hızlı testi ve sunucunun yerini doğru anlatır', () => {
    const doc = legalDocBySlug('aydinlatma-metni')!;
    expect(doc.version).toBeGreaterThanOrEqual(2);
    expect(doc.bodyMd).toContain('Almanya');
    expect(doc.bodyMd).toContain('Hostinger');
    expect(doc.bodyMd).toContain('yurt dışına aktarılmış olur');
    expect(doc.bodyMd).toContain('Hızlı test cevapları ve raporlar: saklanmaz.');
    expect(doc.bodyMd).toContain('en geç 11 dakika');
    expect(doc.bodyMd).not.toMatch(/Türkiye[’']de/);
  });

  it('hesap bölümüne özgü metinler işaretlidir (hesaplar kapalıyken yayımlanmaz)', () => {
    const only = LEGAL_DOCS.filter((d) => d.accountsOnly).map((d) => d.kind).sort();
    expect(only).toEqual(['child_info', 'consent_assessment', 'consent_research']);
    for (const kind of ['privacy_notice', 'terms', 'cookie_policy']) expect(LEGAL_DOCS.find((d) => d.kind === kind)?.accountsOnly).toBeFalsy();
  });
});

/** src altındaki bütün .ts ve .tsx dosyaları. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(name) ? [p] : [];
  });
}

describe('sitedeki sözler', () => {
  const SRC = path.resolve(import.meta.dirname, '../src');

  it('verilerin Türkiye’de tutulduğu ya da yurt dışına aktarılmadığı söylenmez (sunucu Almanya’da)', () => {
    const forbidden = [/Türkiye[’']de(ki)? sunucu/i, /Sunucu(lar|larımız)? Türkiye/i, /Veriler Türkiye/i, /yurt dışına aktarılmaz/i, /Türkiye[’']dedir/i];
    const hits: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const text = readFileSync(file, 'utf8');
      for (const re of forbidden) if (re.test(text)) hits.push(`${path.relative(SRC, file)}: ${re}`);
    }
    expect(hits).toEqual([]);
  });

  it('test yönergeleri ara verme ya da kaydetme sözü vermez (hızlı testte cevaplar saklanmaz)', () => {
    for (const d of INSTRUMENTS) {
      for (const p of d.intro.paragraphs) expect(p, d.slug).not.toMatch(/ara ver|kaldığın yerden|kaydedilir/i);
      expect(d.description, d.slug).not.toMatch(/ara verilebilir|ara verip/i);
    }
  });

  it('bilim kartları yapılmayan çalışmaları sürüyormuş gibi anlatmaz', () => {
    for (const d of INSTRUMENTS) {
      const s = d.science;
      const texts = [s.turkishVersion, s.reliability, s.normNote, ...s.limitations];
      for (const t of texts) expect(t, d.slug).not.toMatch(/platform verisi|sürmektedir|sürüyor|sürdürülüyor|incelenmekte|inceleniyor|oluşturuluyor|hazırlanıyor/i);
    }
  });
});
