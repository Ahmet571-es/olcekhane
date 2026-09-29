import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { ReportPreview } from '@/components/site/report-preview';
import { TestShelf } from '@/components/site/test-shelf';
import { publicInstruments } from '@/content/instruments';
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
    t: 'Norm durumunu açıkça yazıyoruz',
    d: 'Sitedeki testlerin henüz Türkiye normu yok. Bunu raporda açıkça yazıyor, sonucu akranlarla karşılaştırıyormuş gibi göstermiyoruz.',
  },
  {
    t: 'Tanı koymuyoruz',
    d: 'Raporlar çocuğu etiketlemez; güçlü yanları ve gelişim alanlarını anlatır. Gerektiğinde okulun rehberlik servisine ya da bir uzmana başvurmanızı öneririz.',
  },
  {
    t: 'Hiçbir şey saklanmaz',
    d: 'Hesap açmanız gerekmez; ad, e-posta ya da telefon istemiyoruz. Cevaplar yalnızca raporu hazırlamak için kullanılır ve hiçbir yere kaydedilmez. Raporun tek kopyası size verilen PDF’tir.',
  },
];

const FEATURED_GUIDES = ['sinav-kaygisi', 'etkili-ders-calisma-yontemleri', 'kisilik-testleri-guvenilir-mi']
  .map((slug) => guideBySlug(slug))
  .filter((g) => g !== undefined);

const LIVE = publicInstruments();
const SHORTEST = Math.min(...LIVE.map((t) => t.estimatedMinutes));
const LONGEST = Math.max(...LIVE.map((t) => t.estimatedMinutes));

const FAQ = [
  {
    q: 'Testler tanı koyar mı?',
    a: 'Hayır. Ölçekhane’deki testler öğrencinin kendini nasıl gördüğünü, ilgilerini ve bazı becerilerini ölçer. Bir psikolojik ya da tıbbi tanı değildir. Endişe verici bir durum fark ederseniz okulun rehberlik servisine ya da bir uzmana başvurmanızı öneririz.',
  },
  {
    q: 'Hesap açmam gerekiyor mu?',
    a: 'Hayır. Sitede hesap ya da üyelik yok: testi seçer, sınıfı işaretler ve hemen başlarsınız. Ad, e-posta ya da telefon istemiyoruz.',
  },
  {
    q: 'Cevaplarım ve rapor saklanıyor mu?',
    a: 'Hayır. Sitemizin veritabanı yok. Cevaplar raporu hazırlamak için sunucumuza gönderilir ama hiçbir yere yazılmaz. Rapor ekranda gösterilir ve PDF olarak size verilir; sayfayı kapattıktan sonra raporu yeniden gösteremeyiz. Bu yüzden raporu PDF olarak indirmenizi öneririz. Sunucumuz Almanya’dadır; ayrıntılar KVKK aydınlatma metninde.',
  },
  {
    q: 'Hangi yaşlar için uygun?',
    a: 'Testlerin çoğu ortaokul ve lise öğrencileri içindir; okuma görevi ve harf işaretleme görevi 3. sınıftan itibaren uygulanabilir. Her testin uygun olduğu sınıf aralığı test sayfasında yazıyor; teste başlarken yalnızca bu aralıktaki sınıflar seçilebilir.',
  },
  {
    q: 'Bir test ne kadar sürüyor?',
    a: `Testler ${SHORTEST} ile ${LONGEST} dakika arasında sürüyor; her testin süresi test sayfasında yazıyor. Testi tek seferde bitirin: sayfa kapanırsa cevaplar silinir ve baştan başlamanız gerekir.`,
  },
  {
    q: 'Sonuçları kimler görebilir?',
    a: 'Rapor yalnızca sizin ekranınızda gösterilir ve PDF olarak size verilir. Biz saklamadığımız için başka hiç kimseye gösterilmez; PDF’i kiminle paylaşacağınıza siz karar verirsiniz.',
  },
  {
    q: '"Pilot" etiketi ne anlama geliyor?',
    a: 'Pilot testleri Ölçekhane geliştirdi; bu testlerin güvenirlik ve geçerlik çalışmaları henüz yapılmadı. Sonuçları dikkatle, bir norm grubuyla karşılaştırılmadan yorumlanır ve raporda bu durum açıkça belirtilir. Diğer testler, güvenirliği uluslararası araştırmalarla gösterilmiş ölçeklere dayanır; ancak Türkçe çevirilerimizin geçerlik çalışması da henüz yapılmadı.',
  },
  {
    q: 'Ücretli mi?',
    a: 'Testler ve ekranda gösterilen, PDF olarak indirilen rapor ücretsizdir. Önerilerle zenginleştirilmiş kapsamlı rapor ileride ücretli olarak sunulacak; ödeme yapmadan önce fiyatı açıkça göreceksiniz.',
  },
];

const STEPS = [
  {
    t: 'Testi seçin',
    d: 'Her testin neyi ölçtüğü, ne kadar sürdüğü ve hangi sınıflara uygun olduğu test sayfasında yazıyor.',
  },
  {
    t: 'Sınıfı işaretleyip çözün',
    d: 'Hesap açmadan hemen başlarsınız. Testi tek seferde bitirin: sayfa kapanırsa cevaplar silinir.',
  },
  {
    t: 'Raporu okuyun, PDF’i saklayın',
    d: 'Öğrenci ve veli raporu hemen ekranda. İkisini de PDF olarak indirebilirsiniz; biz hiçbir kopyasını saklamayız.',
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
              <Link href="/testler" className="btn btn-primary btn-lg">
                Ücretsiz test çöz
              </Link>
              <a href="#rapor" className="btn btn-secondary btn-lg">
                Örnek rapor
              </a>
            </div>
            <p className="t-meta measure">Bütün testler ücretsiz ve hesap açmadan çözülür. Ad, e-posta ya da kredi kartı bilgisi istemiyoruz; cevaplar saklanmaz.</p>
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
            Her testin hangi bilimsel ölçeğe dayandığını, Türkçe sürümünün durumunu ve sınırlarını açıkça yazıyoruz. Hazırlanmakta olan testleri
            de burada gösteriyoruz.
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
              veliye de ayrıca anlatıyoruz. İki raporu da PDF olarak indirebilirsiniz.
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

      {/* Nasıl çalışır */}
      <section className="container-page pb-20 md:pb-28" aria-labelledby="nasil">
        <div className="grid gap-10 rounded-2xl bg-ink p-8 text-paper md:p-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-4">
            <h2 id="nasil" className="t-h1">
              Nasıl çalışır?
            </h2>
            <p className="opacity-85">Testi çocuğunuzla birlikte seçin, o çözsün, raporu birlikte okuyun.</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <Link href="/testler" className="btn bg-paper text-ink hover:bg-surface-2">
                Testlere göz atın
              </Link>
              <Link href="/veliler-icin" className="btn border-paper/40 bg-transparent text-paper hover:border-paper">
                Veliler için
              </Link>
            </div>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((st, i) => (
              <li key={st.t} className="flex flex-col gap-2 border-t border-paper/30 pt-4">
                <span className="font-display text-3xl font-bold tabular opacity-70" aria-hidden="true">
                  {i + 1}
                </span>
                <p className="font-display text-xl font-bold">{st.t}</p>
                <p className="opacity-85">{st.d}</p>
              </li>
            ))}
          </ol>
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
