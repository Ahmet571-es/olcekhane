import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader, Section } from '@/components/site/page-header';
import { EXPERTS } from '@/content/experts';
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from '@/lib/config';
import { pageMeta } from '@/lib/seo';
import { getOwner } from '@/lib/site';
import { PageGuide } from '@/components/site/page-guide';

export const metadata = pageMeta({
  title: 'Hakkımızda',
  description:
    'Ölçekhane neden kuruldu, testleri nasıl seçiyor ve çocukların verilerini nasıl koruyor? Çalışma ilkelerimiz ve sitenin sahibi.',
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
    d: 'Raporlar çocuğu etiketlemez, tanı koymaz. Test ekranları öğrencinin anlayacağı sade bir dille yazılır; öğrenci istemezse testi istediği an bırakabilir.',
  },
  {
    t: 'Sade dil',
    d: 'Bilimsel doğruluktan ödün vermeden, raporları öğrencinin ve velinin anlayacağı dille yazıyoruz. Teknik ayrıntılar isteyenler için test sayfalarındaki bilim kartında yer alıyor.',
  },
  {
    t: 'Gizlilik',
    d: 'Sitemizde hesap, veritabanı ve çerez yok. Testler hesap açmadan çözülür; ad, e-posta ya da telefon istemiyoruz. Cevaplar yalnızca raporu hazırlamak için kullanılır ve hiçbir yere kaydedilmez. Sunucumuz Almanya’dadır (Avrupa Birliği). Kimsenin verisini reklam, pazarlama ya da yapay zekâ eğitimi için kullanmıyoruz; satmıyoruz.',
  },
];

export default function AboutPage() {
  const owner = getOwner();

  // Yapılandırılmış veride site sahibinin yalnızca adı ve sitenin e-posta adresi yer alır; adres ve telefon
  // yasa gereği İletişim sayfasında gösterilir, arama motorlarına ayrıca bildirilmez.
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl('/'),
    logo: siteUrl('/icon.svg'),
    description: SITE_DESCRIPTION,
  };
  if (owner.name) org.founder = { '@type': 'Person', name: owner.name };
  if (owner.email) org.email = owner.email;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'AboutPage', url: siteUrl('/hakkimizda'), inLanguage: 'tr-TR', mainEntity: org };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Hakkımızda"
        lede="Ölçekhane, öğrencilerin kendini tanımasına yardım eden testleri bilimsel bir temele oturtmak ve sonuçlarını herkesin anlayacağı bir dille anlatmak için kuruldu."
      >
        <PageGuide next={[{ href: '/testler', label: 'Testlere göz at' }, { href: '/iletisim', label: 'Bize yazın' }]}>
          <p>Bu sayfada Ölçekhane’nin neden kurulduğunu, nasıl çalıştığını ve kimlerin emeğiyle hazırlandığını okuyabilirsiniz.</p>
        </PageGuide>
      </PageHeader>

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

      <Section id="site-sahibi" title="Sitenin sahibi" className="border-t border-rule">
        <p className="measure">
          {owner.name ? <>Ölçekhane’yi {owner.name} bireysel olarak işletir.</> : <>Ölçekhane’yi bir kişi bireysel olarak işletir.</>} Sitenin
          içeriğinden ve kişisel verilerin korunmasından (KVKK kapsamında veri sorumlusu olarak) site sahibi sorumludur.
        </p>
        <p>
          Adres, telefon ve e-posta: <Link href="/iletisim">İletişim</Link>
        </p>
      </Section>
    </>
  );
}
