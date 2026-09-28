import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader, Section } from '@/components/site/page-header';
import { EXPERTS } from '@/content/experts';
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from '@/lib/config';
import { pageMeta } from '@/lib/seo';
import { getCompany } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Hakkımızda',
  description:
    'Ölçekhane neden kuruldu, testleri nasıl seçiyor ve çocukların verilerini nasıl koruyor? Çalışma ilkelerimiz ve şirket bilgilerimiz.',
  path: '/hakkimizda',
});

const PRINCIPLES = [
  {
    t: 'Önce kanıt',
    d: 'Bir testi, arkasında hakemli araştırmalar varsa ve kullanım izni uygunsa yayına alıyoruz. Kendi geliştirdiğimiz görevlerde hangi aşamada olduğumuzu açıkça yazıyoruz.',
  },
  {
    t: 'Açıklık',
    d: 'Her testin sayfasında bir bilim kartı var: neyi ölçtüğü, kaynağı, güvenirliği, kimlerle karşılaştırıldığı ve sınırlılıkları.',
  },
  {
    t: 'Çocuğun yararı',
    d: 'Raporlar çocuğu etiketlemez, tanı koymaz. Çocuklar teste başlamadan önce kendi yaşlarına göre yazılmış bir bilgilendirmeyi okur ve istemezlerse devam etmezler.',
  },
  {
    t: 'Sade dil',
    d: 'Bilimsel doğruluktan ödün vermeden, raporları öğrencinin ve velinin anlayacağı dille yazıyoruz. Teknik ayrıntılar isteyenler için ayrıca yer alıyor.',
  },
  {
    t: 'Gizlilik',
    d: 'Veriler Türkiye’deki sunucularda tutulur. Çocuk verisini reklam, pazarlama ya da yapay zekâ eğitimi için kullanmıyoruz; satmıyoruz.',
  },
];

export default function AboutPage() {
  const c = getCompany();
  const rows = [
    ['Ticari unvan', c.legalName],
    ['Adres', c.address],
    ['MERSİS numarası', c.mersisNo],
    ['Vergi dairesi ve numarası', c.taxOffice && c.taxNo ? `${c.taxOffice} / ${c.taxNo}` : ''],
    ['Telefon', c.phone],
    ['E-posta', c.email],
    ['KVKK başvuruları', c.kvkkEmail],
    ['KEP adresi', c.kepAddress],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  const org: Record<string, unknown> = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl('/'),
    logo: siteUrl('/icon.svg'),
    description: SITE_DESCRIPTION,
  };
  if (c.legalName) org.legalName = c.legalName;
  if (c.email) org.email = c.email;
  if (c.phone) org.telephone = c.phone;
  if (c.address) org.address = { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'TR' };
  const jsonLd = { '@context': 'https://schema.org', '@type': 'AboutPage', url: siteUrl('/hakkimizda'), inLanguage: 'tr-TR', mainEntity: org };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Hakkımızda"
        lede="Ölçekhane, öğrencilerin kendini tanımasına yardım eden testleri bilimsel bir temele oturtmak ve sonuçlarını herkesin anlayacağı bir dille anlatmak için kuruldu."
      />

      <Section id="neden" title="Neden Ölçekhane?">
        <p className="measure">
          İnternette öğrencilere yönelik pek çok test var. Bir kısmının bilimsel bir dayanağı yok: öğrenme stilleri ya da sağ beyin, sol beyin
          testleri gibi. Bir kısmı ise bilimsel ölçekleri izinsiz, Türkiye’deki öğrencilere uygunluğu sınanmadan ve kimle karşılaştırıldığı
          belirtilmeden kullanıyor.
        </p>
        <p className="measure">Biz her test için üç soruyu açıkça cevaplıyoruz:</p>
        <ol className="measure flex list-decimal flex-col gap-2 pl-5 font-bold">
          <li>Bu test neyi ölçüyor?</li>
          <li>Ne kadar güvenilir?</li>
          <li>Sonuç kimle karşılaştırılıyor?</li>
        </ol>
        <p className="measure">
          Ayrıntılar için <Link href="/bilimsel-yaklasim">bilimsel yaklaşımımızı</Link> okuyabilirsiniz.
        </p>
      </Section>

      <Section id="ilkeler" title="Çalışma ilkelerimiz" className="border-t border-rule">
        <dl className="flex flex-col gap-7">
          {PRINCIPLES.map((p) => (
            <div key={p.t} className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="font-display text-xl font-bold">{p.t}</dt>
              <dd className="measure text-ink-2">{p.d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {EXPERTS.length > 0 && (
        <Section id="kurul" title="Bilim kurulu" className="border-t border-rule">
          <ul className="grid gap-6 sm:grid-cols-2">
            {EXPERTS.map((e) => (
              <li key={e.slug} className="flex flex-col gap-1 border-t-2 border-ink pt-4">
                <Link href={`/uzmanlar/${e.slug}`} className="font-display text-lg font-bold">
                  {e.fullName}
                </Link>
                <span className="text-ink-2">{e.title}</span>
                <span className="t-meta">{e.role}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="sirket" title="Şirket bilgileri" className="border-t border-rule">
        {rows.length > 0 ? (
          <dl className="panel divide-y divide-rule">
            {rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-bold">{k}</dt>
                <dd className="break-words text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="measure text-ink-2">Şirket bilgileri yakında burada yer alacak.</p>
        )}
        <p>
          Bize ulaşmak için: <Link href="/iletisim">İletişim formu</Link>
        </p>
      </Section>
    </>
  );
}
