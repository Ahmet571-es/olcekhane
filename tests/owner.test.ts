import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ContactPage from '@/app/(site)/iletisim/page';
import { SiteFooter } from '@/components/site/footer';
import { LEGAL_DOCS, legalDocBySlug } from '@/content/legal';
import { renderMarkdown } from '@/lib/markdown';
import { HOSTING_PROVIDER, OWNER_FIELDS, fillOwner, ownerFromEnv, taxLine } from '@/lib/site';

// Ölçekhane'yi bir kişi bireysel olarak işletir. 5651 sayılı Kanun'a dayanan yönetmelik (m.5), site
// sahibinin adı ve soyadı, adresi, telefonu ve e-postasının "İletişim" başlığı altında; yer sağlayıcının
// bilgilerinin de onlarla birlikte ana sayfada gösterilmesini ister.

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (p: string) => readFileSync(path.join(ROOT, p), 'utf8');

const ENV = {
  OWNER_NAME: ' Ayşe Yılmaz ',
  OWNER_ADDRESS: 'Atatürk Cad. No: 5 D: 3, Çankaya/Ankara',
  OWNER_PHONE: '+90 555 000 00 00',
  OWNER_EMAIL: 'bilgi@olcekhane.test',
};
const OWNER = ownerFromEnv(ENV);

describe('site sahibinin bilgileri', () => {
  it('ortam değişkenlerinden okunur; KVKK için ayrı e-posta verilmediyse genel e-posta kullanılır', () => {
    expect(OWNER.name).toBe('Ayşe Yılmaz');
    expect(OWNER.kvkkEmail).toBe('bilgi@olcekhane.test');
    expect(OWNER.kepAddress).toBe('');
    expect(ownerFromEnv({ OWNER_EMAIL: 'a@b.test', OWNER_KVKK_EMAIL: 'kvkk@b.test' }).kvkkEmail).toBe('kvkk@b.test');
    expect(taxLine(OWNER)).toBe('');
    expect(taxLine({ ...OWNER, taxOffice: 'Çankaya', taxNo: '1234567890' })).toBe('Çankaya Vergi Dairesi, 1234567890');
  });

  it('aydınlatma metninde veri sorumlusu kişi olarak yazılır; boş kalan isteğe bağlı satırlar gösterilmez', () => {
    const md = fillOwner(legalDocBySlug('aydinlatma-metni')!.bodyMd, OWNER);
    expect(md).toContain('Ölçekhane’yi bir kişi bireysel olarak işletir');
    for (const line of [
      '- Adı ve soyadı: Ayşe Yılmaz',
      '- Adres: Atatürk Cad. No: 5 D: 3, Çankaya/Ankara',
      '- E-posta: bilgi@olcekhane.test',
      '- Telefon: +90 555 000 00 00',
      '- Yazılı olarak (posta ya da elden): Atatürk Cad. No: 5 D: 3, Çankaya/Ankara',
    ]) {
      expect(md).toContain(line);
    }
    // KEP adresi verilmediği için KEP satırları yok; şirkete özgü alanlar hiç yok.
    expect(md).not.toMatch(/KEP|MERSİS|unvan|Ticaret sicil/i);
    expect(md).not.toContain('{{');
    expect(md).not.toContain('—');

    const withKep = fillOwner(legalDocBySlug('aydinlatma-metni')!.bodyMd, { ...OWNER, kepAddress: 'ayse@hs01.kep.tr' });
    expect(withKep).toContain('- KEP adresi: ayse@hs01.kep.tr');
    expect(withKep).toContain('- KEP ile: ayse@hs01.kep.tr');
  });

  it('kullanım koşulları siteyi işleten kişiyi ve iletişim bilgilerini anar', () => {
    const md = fillOwner(legalDocBySlug('kullanim-kosullari')!.bodyMd, OWNER);
    expect(md).toContain('Platformu bir kişi bireysel olarak işletir:');
    for (const line of ['- Adı ve soyadı: Ayşe Yılmaz', '- Adres: Atatürk Cad. No: 5 D: 3, Çankaya/Ankara', '- E-posta: bilgi@olcekhane.test', '- Telefon: +90 555 000 00 00']) {
      expect(md).toContain(line);
    }
    expect(md).toContain('[İletişim](/iletisim)');
  });

  it('boş kalabilen alanların (KEP, vergi) satırı çıkarılır; girilmemiş zorunlu alanın yerinde "—" görünür', () => {
    const md = 'Ad: {{owner.name}}\nKEP: {{owner.kepAddress}}\nVergi: {{owner.taxOffice}} {{owner.taxNo}}\nİkisi: {{owner.name}} / {{owner.kepAddress}}\nSabit';
    expect(fillOwner(md, ownerFromEnv({}))).toBe('Ad: —\nİkisi: — / —\nSabit');
    expect(fillOwner(md, ownerFromEnv({ OWNER_NAME: 'Ayşe', OWNER_KEP: 'a@hs01.kep.tr' }))).toBe(
      'Ad: Ayşe\nKEP: a@hs01.kep.tr\nİkisi: Ayşe / a@hs01.kep.tr\nSabit',
    );
    // Bilgiler hiç girilmemişken aydınlatma metni yapısını korur: zorunlu alanlar "—", KEP satırları yok.
    const empty = fillOwner(legalDocBySlug('aydinlatma-metni')!.bodyMd, ownerFromEnv({}));
    expect(empty).toContain('- Adı ve soyadı: —');
    expect(empty).toContain('- E-postayla: —');
    expect(empty).not.toContain('KEP');
  });

  it('değerler Markdown biçimlendirmesi olarak yorumlanmaz', () => {
    const html = renderMarkdown(fillOwner('Ad: {{owner.name}}', ownerFromEnv({ OWNER_NAME: '*Ayşe* _Yılmaz_ [x] <b>kalın</b> | ç' })));
    expect(html).toContain('*Ayşe* _Yılmaz_ [x] &lt;b&gt;kalın&lt;/b&gt; | ç');
    expect(html).not.toMatch(/<em>|<strong>|<b>/);
  });

  it('hukuki metinlerdeki bütün yer tutucuları bilinen alanlardır', () => {
    const keys = new Set<string>(OWNER_FIELDS.map((f) => f.key));
    let count = 0;
    for (const d of LEGAL_DOCS) {
      for (const m of d.bodyMd.matchAll(/\{\{(\w+)\.(\w+)\}\}/g)) {
        count++;
        expect(m[1], d.slug).toBe('owner');
        expect(keys.has(m[2]), `${d.slug}: ${m[0]}`).toBe(true);
      }
    }
    expect(count).toBeGreaterThan(0);
  });

  it('aydınlatma metni yer sağlayıcıyı unvanıyla anar', () => {
    expect(legalDocBySlug('aydinlatma-metni')!.bodyMd).toContain(HOSTING_PROVIDER.name);
  });

  it('bütün alanlar ayar dosyalarında ve sunucu kurulumunda aynı sırayla yer alır; zorunlu olanlar kur.sh’de denetlenir', () => {
    const envs = OWNER_FIELDS.map((f) => f.env);
    for (const file of ['.env.example', 'yayin/ayarlar.env', '.github/workflows/prova.yml', 'sunucu/kur.sh']) {
      const text = read(file);
      for (const e of envs) expect(text, `${file}: ${e}`).toContain(e);
      expect(text, file).not.toMatch(/COMPANY_/);
    }
    for (const file of ['.env.example', 'yayin/ayarlar.env']) {
      const order = [...read(file).matchAll(/^(OWNER_\w+)=/gm)].map((m) => m[1]);
      expect(order, file).toEqual(envs);
    }
    const kur = read('sunucu/kur.sh');
    const sahip = /local -a sahip=\(([^)]*)\)/.exec(kur)?.[1].split(/\s+/).filter(Boolean);
    expect(sahip).toEqual(envs);
    const required = OWNER_FIELDS.filter((f) => f.required).map((f) => f.env);
    expect(kur).toContain(`"\${sahip[@]:0:${required.length}}"`);
    expect(envs.slice(0, required.length)).toEqual(required);
  });
});

describe('İletişim sayfası ve altbilgi', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('İletişim sayfası site sahibinin ve yer sağlayıcının bilgilerini gösterir', () => {
    for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
    vi.stubEnv('OWNER_TAX_OFFICE', 'Çankaya');
    vi.stubEnv('OWNER_TAX_NO', '1234567890');
    const html = renderToStaticMarkup(createElement(ContactPage));
    expect(html).toMatch(/<h1[^>]*>İletişim<\/h1>/);
    for (const text of [
      'Ayşe Yılmaz',
      'Atatürk Cad. No: 5 D: 3, Çankaya/Ankara',
      '+90 555 000 00 00',
      'href="tel:+905550000000"',
      'bilgi@olcekhane.test',
      'Çankaya Vergi Dairesi, 1234567890',
      HOSTING_PROVIDER.name,
      HOSTING_PROVIDER.address,
      HOSTING_PROVIDER.serverLocation,
    ]) {
      expect(html).toContain(text);
    }
    expect(html).not.toMatch(/KEP|MERSİS/);
  });

  it('bilgiler girilmemişken İletişim sayfası boş satır göstermez', () => {
    for (const f of OWNER_FIELDS) vi.stubEnv(f.env, '');
    const html = renderToStaticMarkup(createElement(ContactPage));
    expect(html).toContain('Site sahibinin bilgileri çok yakında burada yer alacak.');
    expect(html).toContain('E-posta adresimiz çok yakında burada yazacak.');
    expect(html).toContain(HOSTING_PROVIDER.name);
    expect(html).not.toContain('Adı ve soyadı');
  });

  it('altbilgi (ana sayfa dahil her sayfada) site sahibini, İletişim bağlantısını ve yer sağlayıcıyı gösterir', () => {
    for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
    const html = renderToStaticMarkup(createElement(SiteFooter));
    expect(html).toContain('Ölçekhane’yi Ayşe Yılmaz bireysel olarak işletir.');
    expect(html).toContain('href="/iletisim"');
    expect(html).toContain(`Yer sağlayıcı: ${HOSTING_PROVIDER.name}, ${HOSTING_PROVIDER.address}.`);
    // Ev adresi ve telefon yalnızca İletişim sayfasında; altbilgide yok.
    expect(html).not.toContain('Atatürk Cad.');
    expect(html).not.toContain('+90 555');
  });
});
