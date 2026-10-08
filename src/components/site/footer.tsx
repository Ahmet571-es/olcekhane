import Link from 'next/link';
import { liveGroups } from '@/content/age-groups';
import { publicInstruments } from '@/content/instruments';
import { HOSTING_PROVIDER, getOwner } from '@/lib/site';
import { Logo } from './logo';

export function SiteFooter() {
  const owner = getOwner();
  const tests = publicInstruments();

  return (
    <footer className="gece relative mt-28 overflow-hidden">
      {/* Tayf ışıltısı */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-60">
        <div className="bulut left-[8%] top-10 size-72" style={{ background: 'var(--dim-con)' }} />
        <div className="bulut left-[38%] top-0 size-80" style={{ background: 'var(--dim-int)', animationDelay: '-6s' }} />
        <div className="bulut right-[10%] top-12 size-72" style={{ background: 'var(--dim-agr)', animationDelay: '-11s' }} />
      </div>

      <div className="container-page relative flex flex-col gap-8 pt-20 pb-14 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4" data-reveal>
          <p className="kicker text-[color:var(--gece-soluk)]">Hazır mısın?</p>
          <p className="t-section max-w-[14ch]">
            Kendi <span className="tayf-yazi">şeklini</span> keşfet.
          </p>
        </div>
        <Link href="/testler" className="btn btn-lg btn-tayf btn-acik self-start md:self-auto" data-magnet>
          Ücretsiz test çöz
        </Link>
      </div>

      <div className="container-page relative grid gap-10 border-t border-[color:var(--gece-cizgi)] py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="t-small max-w-[34ch] text-[color:var(--gece-soluk)]">
            Araştırmalarla desteklenen ölçekler, Türkçeye özenle uyarlanmış hâliyle. Tanı koymaz, tanımaya yardım eder.
          </p>
        </div>
        <FooterCol title="Grubuna göre">
          {liveGroups().map(({ group }) => (
            <FooterLink key={group.key} href={group.path}>
              {group.name}
            </FooterLink>
          ))}
        </FooterCol>
        <FooterCol title="Testler">
          {tests.map((t) => (
            <FooterLink key={t.slug} href={`/testler/${t.slug}`}>
              {t.shortName}
            </FooterLink>
          ))}
          <FooterLink href="/testler">Tüm testler</FooterLink>
        </FooterCol>
        <FooterCol title="Ölçekhane">
          <FooterLink href="/okuma">Okuma</FooterLink>
          <FooterLink href="/beyin-akademisi">Beyin Akademisi</FooterLink>
          <FooterLink href="/rehber">Rehber</FooterLink>
          <FooterLink href="/bilimsel-yaklasim">Bilimsel yaklaşım</FooterLink>
          <FooterLink href="/veliler-icin">Veliler için</FooterLink>
          <FooterLink href="/hakkimizda">Hakkımızda</FooterLink>
          <FooterLink href="/iletisim">İletişim</FooterLink>
        </FooterCol>
        <FooterCol title="Yasal">
          <FooterLink href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</FooterLink>
          <FooterLink href="/yasal/kullanim-kosullari">Kullanım koşulları</FooterLink>
          <FooterLink href="/yasal/cerez-politikasi">Çerez politikası</FooterLink>
        </FooterCol>
      </div>

      <div className="relative border-t border-[color:var(--gece-cizgi)]">
        <div className="container-page flex flex-col gap-3 py-6 text-[0.8125rem] leading-relaxed text-[color:var(--gece-soluk)] md:flex-row md:items-start md:justify-between">
          {/* 5651 Yönetmeliği m.5: site sahibinin bilgileri İletişim sayfasında, yer sağlayıcının bilgileri
              onlarla birlikte ana sayfada gösterilir (bkz. lib/site.ts). */}
          <p>
            {owner.name && <>Ölçekhane’yi {owner.name} bireysel olarak işletir. </>}
            Adres, telefon ve e-posta{' '}
            <Link href="/iletisim" className="text-[color:var(--gece-yazi)]">
              İletişim
            </Link>{' '}
            sayfasındadır. Yer sağlayıcı: {HOSTING_PROVIDER.name}, {HOSTING_PROVIDER.address}.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} Ölçekhane</p>
        </div>
      </div>

      {/* Büyük yazı: yalnızca süs; altı sayfanın kenarında kesilir */}
      <div className="container-page relative select-none" aria-hidden="true">
        {/* Üst boşluk "Ö" noktalarının da renklenmesi için: yazı rengi yalnızca kutunun içine boyanır. */}
        <p className="dev-yazi -mb-[0.2em] pt-[0.16em] bg-gradient-to-b from-[color:var(--gece-yazi)] via-[color:color-mix(in_oklab,var(--gece-yazi)_45%,transparent)] to-transparent bg-clip-text text-center text-transparent">
          Ölçekhane
        </p>
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
      <Link href={href} className="t-small text-[color:var(--gece-soluk)] no-underline transition-colors hover:text-[color:var(--gece-yazi)] hover:underline">
        {children}
      </Link>
    </li>
  );
}
