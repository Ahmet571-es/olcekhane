import Link from 'next/link';
import { publicInstruments } from '@/content/instruments';
import { getCompany } from '@/lib/site';
import { Logo } from './logo';

export function SiteFooter() {
  const c = getCompany();
  const tests = publicInstruments();
  const companyLines = [
    c.legalName,
    c.address,
    c.mersisNo && `MERSİS: ${c.mersisNo}`,
    c.taxOffice && c.taxNo && `${c.taxOffice} V.D. ${c.taxNo}`,
    c.phone && `Telefon: ${c.phone}`,
    c.email && `E-posta: ${c.email}`,
    c.kepAddress && `KEP: ${c.kepAddress}`,
  ].filter(Boolean) as string[];

  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="t-small max-w-[34ch] text-ink-2">
            Araştırmalarla desteklenen ölçekler, Türkçeye özenle uyarlanmış hâliyle. Tanı koymaz, tanımaya yardım eder.
          </p>
        </div>
        <FooterCol title="Testler">
          {tests.map((t) => (
            <FooterLink key={t.slug} href={`/testler/${t.slug}`}>
              {t.shortName}
            </FooterLink>
          ))}
          <FooterLink href="/testler">Tüm testler</FooterLink>
        </FooterCol>
        <FooterCol title="Ölçekhane">
          <FooterLink href="/bilimsel-yaklasim">Bilimsel yaklaşım</FooterLink>
          <FooterLink href="/veliler-icin">Veliler için</FooterLink>
          <FooterLink href="/okullar-icin">Okullar için</FooterLink>
          <FooterLink href="/hakkimizda">Hakkımızda</FooterLink>
          <FooterLink href="/iletisim">İletişim</FooterLink>
        </FooterCol>
        <FooterCol title="Yasal">
          <FooterLink href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</FooterLink>
          <FooterLink href="/yasal/acik-riza-olcme">Açık rıza metinleri</FooterLink>
          <FooterLink href="/yasal/kullanim-kosullari">Kullanım koşulları</FooterLink>
          <FooterLink href="/yasal/cerez-politikasi">Çerez politikası</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-rule">
        <div className="container-page flex flex-col gap-3 py-6 text-[0.8125rem] leading-relaxed text-ink-3 md:flex-row md:items-start md:justify-between">
          <p>{companyLines.length ? companyLines.join(' · ') : 'Ölçekhane'}</p>
          <p className="shrink-0">© {new Date().getFullYear()} Ölçekhane</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-body text-[0.9375rem] font-bold tracking-normal">{title}</h2>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="t-small text-ink-2 no-underline hover:text-ink hover:underline">
        {children}
      </Link>
    </li>
  );
}
