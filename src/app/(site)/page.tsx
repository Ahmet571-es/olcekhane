import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { ReportPreview } from '@/components/site/report-preview';
import { TestShelf } from '@/components/site/test-shelf';
import { GUIDE_CATEGORIES, guideBySlug } from '@/content/rehber';
import { HeroVisual } from '@/components/three/hero-visual';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from '@/lib/config';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: `${SITE_NAME}: ${SITE_TAGLINE}`,
  absoluteTitle: true,
  ogTitle: `${SITE_NAME}: Tahmin değil, ölçüm.`,
  description: SITE_DESCRIPTION,
  path: '/',
});

const PRINCIPLES = [
  {
    t: 'Kaynağı belli ölçekler',
    d: 'Her test, yayımlanmış ve kullanım izni uygun bir ölçeğe ya da bizim geliştirip açıkça belgelediğimiz bir göreve dayanır. Ticari kullanım izni olmayan ölçekleri kullanmıyoruz.',
  },
  {
    t: 'Norm durumunu saklamıyoruz',
    d: 'Türkiye normu henüz hazır olmayan testlerde bunu raporda açıkça yazıyoruz. Normları, velilerin isteğe bağlı izniyle, anonimleştirilmiş verilerden oluşturuyoruz.',
  },
  {
    t: 'Tanı koymuyoruz',
    d: 'Raporlar çocuğu etiketlemez; güçlü yanları ve gelişim alanlarını anlatır. Gerektiğinde okulun rehberlik servisine ya da bir uzmana başvurmanızı öneririz.',
  },
  {
    t: 'Veriler Türkiye’de',
    d: 'Sunucularımız Türkiye’de. Çocuk verisini reklam, pazarlama ya da yapay zekâ eğitimi için kullanmıyoruz. Açık rızanızı dilediğiniz an geri alabilirsiniz.',
  },
];

const FEATURED_GUIDES = ['sinav-kaygisi', 'etkili-ders-calisma-yontemleri', 'kisilik-testleri-guvenilir-mi']
  .map((slug) => guideBySlug(slug))
  .filter((g) => g !== undefined);

const FAQ = [
  {
    q: 'Testler tanı koyar mı?',
    a: 'Hayır. Ölçekhane’deki testler öğrencinin kendini nasıl gördüğünü, ilgilerini ve bazı becerilerini ölçer. Bir psikolojik ya da tıbbi tanı değildir. Endişe verici bir durum fark ederseniz okulun rehberlik servisine ya da bir uzmana başvurmanızı öneririz.',
  },
  {
    q: 'Hangi yaşlar için uygun?',
    a: 'Okuma görevi 3. sınıftan, kişilik profili ve öz-saygı ölçeği 6. sınıftan itibaren uygulanabilir. Her testin uygun olduğu sınıf aralığı test sayfasında yazıyor; sistem yalnızca çocuğunuzun sınıfına uygun testleri gösterir.',
  },
  {
    q: 'Bir test ne kadar sürüyor?',
    a: 'Şu anki testler 3 ile 8 dakika arasında sürüyor. İstediğiniz an ara verebilir, kaldığınız yerden devam edebilirsiniz.',
  },
  {
    q: 'Sonuçları kimler görebilir?',
    a: 'Veli hesabında sonuçları yalnızca siz görürsünüz. Okul hesaplarında, velinin onayıyla, okulun rehber öğretmeni bireysel raporu görebilir; öğretmenler yalnızca en az beş öğrencilik grupların özetini görür.',
  },
  {
    q: '"Pilot" etiketi ne anlama geliyor?',
    a: 'Pilot testlerin Türkçe geçerlik ve norm çalışması sürüyor. Bu testler ücretsizdir ve raporlarında bu durum açıkça belirtilir.',
  },
  {
    q: 'Ücretli mi?',
    a: 'Veli hesabı ve şu anda yayında olan testler ücretsizdir. İleride eklenecek kapsamlı paketler ücretli olacak; ücretli bir test başlatmadan önce fiyat açıkça gösterilir.',
  },
];

export default function Home() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl('/'),
      logo: siteUrl('/icon.svg'),
      description: SITE_DESCRIPTION,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: siteUrl('/'),
      inLanguage: 'tr-TR',
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Açılış */}
      <section className="relative overflow-hidden border-b border-rule">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 80% at 72% 40%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 72% 40%, black 30%, transparent 75%)',
          }}
        />
        <div className="container-page relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
          <div className="flex flex-col gap-7">
            <h1 className="flex flex-col gap-5">
              <span className="t-display">Tahmin değil, ölçüm.</span>
              <span className="font-body text-[clamp(1.2rem,2vw,1.45rem)] font-bold tracking-normal text-brass-ink">
                Öğrenciler için bilimsel kişilik, ilgi ve öğrenme testleri
              </span>
            </h1>
            <p className="t-lede measure">
              Çocuğunuzun güçlü yanlarını, ilgi alanlarını ve öğrenme alışkanlıklarını araştırmalarla desteklenmiş ölçeklerle inceliyoruz.
              Sonucu öğrenciye ve veliye ayrı ayrı, herkesin anlayacağı bir dille anlatıyoruz.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/kayit" className="btn btn-primary btn-lg">
                Ücretsiz başla
              </Link>
              <Link href="/testler" className="btn btn-secondary btn-lg">
                Testleri incele
              </Link>
            </div>
            <p className="t-meta measure">Kişilik profili, öz-saygı ölçeği ve okuma görevi ücretsiz. Kredi kartı bilgisi istemiyoruz.</p>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Ölçek rafı */}
      <section className="container-page py-20 md:py-28" aria-labelledby="raf">
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <h2 id="raf" className="t-h1">
            Neyi, hangi araçla ölçüyoruz?
          </h2>
          <p className="t-lede measure">
            Her testin hangi bilimsel ölçeğe dayandığını, Türkçe sürümünün durumunu ve sınırlarını açıkça yazıyoruz. Hazırlanan testleri de
            saklamıyoruz.
          </p>
        </div>
        <TestShelf />
      </section>

      {/* Rapor önizleme */}
      <section className="border-y border-rule bg-surface-2/60" aria-labelledby="rapor">
        <div className="container-page py-20 md:py-28">
          <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <h2 id="rapor" className="t-h1">
              Aynı sonuç, iki ayrı dil
            </h2>
            <p className="t-lede measure">
              On üç yaşındaki bir öğrencinin okuyacağı rapor ile velisinin okuyacağı rapor aynı olmamalı. Her sonucu öğrenciye kendi diliyle,
              veliye de evde neler yapılabileceğiyle birlikte anlatıyoruz.
            </p>
          </div>
          <ReportPreview />
        </div>
      </section>

      {/* İlkeler */}
      <section className="container-page py-20 md:py-28" aria-labelledby="ilkeler">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-5">
            <h2 id="ilkeler" className="t-h1">
              Neden güvenebilirsiniz?
            </h2>
            <p className="t-lede">Çocuğunuz hakkında söylenen her cümlenin arkasında durabilmemiz gerekiyor.</p>
            <Link href="/bilimsel-yaklasim" className="self-start font-bold">
              Bilimsel yaklaşımımızı okuyun
            </Link>
          </div>
          <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
                <dt className="font-display text-xl font-bold">{p.t}</dt>
                <dd className="text-ink-2">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Veliler ve okullar */}
      <section className="container-page pb-20 md:pb-28" aria-label="Kimler için">
        <div className="grid overflow-hidden rounded-2xl border border-rule md:grid-cols-2">
          <div className="flex flex-col gap-4 bg-surface p-8 md:p-10">
            <h2 className="t-h2">Veliler için</h2>
            <p className="text-ink-2">
              Çocuğunuzun kendini nasıl gördüğünü, nelerden hoşlandığını ve nasıl öğrendiğini anlamak için. Profil oluşturun, testi birlikte
              başlatın, raporu birlikte okuyun. Zaman içinde tekrarlayarak gelişimini izleyin.
            </p>
            <div className="mt-auto pt-2">
              <Link href="/kayit" className="btn btn-primary">
                Veli hesabı aç
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-ink p-8 text-paper md:p-10">
            <h2 className="t-h2">Okullar için</h2>
            <p className="opacity-85">
              Rehberlik servisleri için sınıf düzeyinde uygulama: veli onayı çevrim içi alınır, rehber öğretmen bireysel raporları görür,
              öğretmenler yalnızca grup özetlerini görür.
            </p>
            <div className="mt-auto pt-2">
              <Link href="/okullar-icin" className="btn border-paper/40 bg-transparent text-paper hover:border-paper">
                Okullar için ayrıntılar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rehber */}
      <section className="container-page pb-20 md:pb-28" aria-labelledby="rehberden">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="rehberden" className="t-h1">
            Rehberden
          </h2>
          <Link href="/rehber" className="font-bold">
            Bütün yazılar
          </Link>
        </div>
        <ul className="grid gap-x-10 gap-y-10 md:grid-cols-3">
          {FEATURED_GUIDES.map((g) => (
            <li key={g.slug} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
              <p className="t-meta font-bold text-brass-ink">{GUIDE_CATEGORIES[g.category]}</p>
              <h3 className="font-display text-xl font-bold leading-snug">
                <Link href={`/rehber/${g.slug}`} className="no-underline hover:underline">
                  {g.title}
                </Link>
              </h3>
              <p className="text-ink-2">{g.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* SSS */}
      <section className="container-page pb-8" aria-labelledby="sss">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <h2 id="sss" className="t-h1">
            Sık sorulanlar
          </h2>
          <div className="divide-y divide-rule border-y border-rule">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-bold">
                  {f.q}
                  <span aria-hidden="true" className="mt-1 text-ink-3 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="measure mt-3 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
