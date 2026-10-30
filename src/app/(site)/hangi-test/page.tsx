import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader, Section } from '@/components/site/page-header';
import { PageGuide } from '@/components/site/page-guide';
import { TestSecici } from '@/components/site/test-secici';
import { publicInstruments } from '@/content/instruments';
import { PACKAGE_NAME, PACKAGE_PATH, packageGrades, packageMinutes, packageTests } from '@/content/paket';
import { SECICI_NAME, SECICI_PATH } from '@/content/test-secici';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';
import type { SeciciTest } from '@/lib/test-secici';

export const metadata = pageMeta({
  title: 'Hangi test bana uygun? Amacına, yaşına ve vaktine göre test önerisi',
  description:
    'Kimin çözeceğini, ne öğrenmek istediğini ve ne kadar vaktin olduğunu seç; sana uygun kişilik, ilgi, okuma ve zihinsel beceri testleri sırasıyla önerilsin. Ücretsiz, seçimlerin saklanmaz.',
  path: SECICI_PATH,
});

const FAQ = [
  {
    q: 'Öneri neye göre hazırlanıyor?',
    a: 'Seçtiğin her alan birkaç beceriden ya da özellikten oluşur (ör. zihinsel güçlü yanlarda akıl yürütme, sözel, uzamsal, bellek ve sayısal beceri). Her biri için sınıfa uygun ve seçtiğin süreye sığan bir test seçilir; birden çok alan seçersen alanlar sırayla dönüşümlü doldurulur. Öneri yalnızca bu seçimlere dayanır, başka bir bilgi kullanılmaz.',
  },
  {
    q: 'Seçimlerim kaydediliyor mu?',
    a: 'Hayır. Öneri tarayıcında hesaplanır; seçimlerin hiçbir yere kaydedilmez, sunucuya gönderilmez. Sayfayı kapatınca kaybolur.',
  },
  {
    q: 'Önerilmeyen bir testi çözebilir miyim?',
    a: 'Elbette. Öneri yalnızca bir başlangıç noktası; bütün testler Testler sayfasında alan, sınıf ve süreye göre süzülebilir.',
  },
];

export default function SeciciPage() {
  const all = publicInstruments();
  const catalog: SeciciTest[] = all.map((d) => ({
    slug: d.slug,
    name: d.name,
    minutes: d.estimatedMinutes,
    minGrade: d.minGrade,
    maxGrade: d.maxGrade,
    adults: 'adults' in d && !!d.adults,
  }));
  // En az bir testin uygun olduğu sınıflar ve yetişkin.
  const grades = [...Array.from({ length: 13 }, (_, i) => i + 1), ADULT_GRADE].filter((g) => catalog.some((t) => gradeAllowed(t, g)));
  const pkgMinutes = Object.fromEntries(packageGrades().map((g) => [g, packageMinutes(packageTests(g))]));
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Testler', path: '/testler' },
          { name: SECICI_NAME, path: SECICI_PATH },
        ])}
      />
      <PageHeader
        kicker="Ücretsiz · bir dakikada"
        title={SECICI_NAME}
        lede="Sitede kişilikten okumaya, ilgi alanlarından zihinsel becerilere kadar onlarca test var. Üç kısa seçim yap; sana uygun testleri sırasıyla önerelim."
      >
        <PageGuide
          steps={['Testi kimin çözeceğini seç.', 'Ne öğrenmek istediğini seç; birden çok alan seçebilirsin.', 'Ne kadar vaktin olduğunu seç ve önerilen ilk testle başla.']}
          next={[{ href: '/testler', label: 'Bütün testler' }]}
        >
          <p>Seçimlerin hiçbir yere kaydedilmez; öneri yalnızca bu sayfada hesaplanır.</p>
        </PageGuide>
      </PageHeader>

      <div className="container-page py-12 md:py-16">
        <TestSecici catalog={catalog} grades={grades} pkg={{ path: PACKAGE_PATH, name: PACKAGE_NAME, minutes: pkgMinutes }} />
      </div>

      <Section id="sorular" title="Sık sorulanlar" className="border-t border-rule">
        <dl className="flex flex-col gap-5">
          {FAQ.map((f) => (
            <div key={f.q} className="flex flex-col gap-1">
              <dt className="font-bold">{f.q}</dt>
              <dd className="text-ink-2">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="text-ink-2">
          Bütün testleri görmek için <Link href="/testler">Testler</Link> sayfasına bak.
        </p>
      </Section>
    </>
  );
}
