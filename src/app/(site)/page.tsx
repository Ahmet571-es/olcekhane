import Link from 'next/link';
import type { CSSProperties } from 'react';
import { JsonLd } from '@/components/seo/json-ld';
import { CountUp } from '@/components/site/count-up';
import { GroupPicker } from '@/components/site/group-picker';
import { Marquee } from '@/components/site/marquee';
import { MeasureStory } from '@/components/site/measure-story';
import { PageGuide } from '@/components/site/page-guide';
import { ReportPreview } from '@/components/site/report-preview';
import { TestCards } from '@/components/site/test-cards';
import { PersonaHero } from '@/components/persona/persona-hero';
import { liveGroups } from '@/content/age-groups';
import { publicInstruments } from '@/content/instruments';
import { GUIDE_CATEGORIES, guideBySlug } from '@/content/rehber';
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
const GROUP_NAMES = liveGroups()
  .map(({ group }) => group.name)
  .join(', ');
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
    a: `Testler 3. sınıftan itibaren uygulanabilir. Ana sayfanın başında ya da Testler sayfasında grubunuzu (${GROUP_NAMES}) seçerseniz o gruba uygun testler bölüm bölüm listelenir. Her testin uygun olduğu sınıf aralığı test sayfasında da yazıyor; teste başlarken yalnızca bu aralıktaki sınıflar seçilebilir.`,
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
    a: 'Testler ve ekranda gösterilen, PDF olarak indirilen raporlar ücretsizdir. Bazı testlerin raporunun sonunda öneriler ve dört haftalık adımlarla bir gelişim yol haritası da ücretsiz olarak yer alır; bu bölüm zamanla öteki testlere de eklenecek. İleride ek, ücretli bir rapor seçeneği sunulursa ödeme yapmadan önce fiyatı açıkça göreceksiniz.',
  },
];

const STEPS = [
  {
    t: 'Testi seçin',
    d: 'Önce grubunuzu seçin; size uygun testler bölüm bölüm açılır. Her testin neyi ölçtüğü ve ne kadar sürdüğü test sayfasında yazıyor.',
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

const DOTS = ['var(--dim-ext)', 'var(--dim-agr)', 'var(--dim-con)', 'var(--dim-emo)', 'var(--dim-int)'];

function HeroIntro() {
  return (
    <div className="flex flex-col gap-7">
      <p className="kicker flex items-center gap-3">
        <span className="flex -space-x-1" aria-hidden="true">
          {DOTS.map((c) => (
            <span key={c} className="size-3 rounded-full ring-2 ring-paper" style={{ background: c }} />
          ))}
        </span>
        Öğrenciler için bilimsel kişilik, ilgi ve öğrenme testleri
      </p>
      <h1 className="t-hero">
        <span className="satir">
          <span style={{ '--i': 0 } as CSSProperties}>Her insanın</span>
        </span>
        <span className="satir">
          <span style={{ '--i': 1 } as CSSProperties}>şekli</span>
        </span>
        <span className="satir">
          <span className="tayf-yazi" style={{ '--i': 2 } as CSSProperties}>
            farklı.
          </span>
        </span>
      </h1>
      <p className="t-lede measure">
        Ölçekhane; kişiliği, ilgi alanlarını ve öğrenme becerilerini araştırmalarla desteklenmiş ölçeklerle ölçer. Sonucu öğrenciye ve
        veliye ayrı ayrı, herkesin anlayacağı bir dille anlatır.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/testler" className="btn btn-primary btn-lg btn-tayf" data-magnet>
          Ücretsiz test çöz
        </Link>
        <a href="#olcum-baslik" className="btn btn-secondary btn-lg">
          Nasıl ölçüyoruz?
        </a>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Kısaca">
        {['Hesap yok', 'Testler ücretsiz', 'Cevaplar saklanmaz'].map((b) => (
          <li key={b} className="glass rounded-full px-3.5 py-1.5 text-[0.875rem] font-bold text-ink-2">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

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

  const stats = [
    { n: LIVE.length, t: 'ücretsiz test, hepsi hesap açmadan' },
    { n: 0, t: 'saklanan cevap: cevaplar hiçbir yere yazılmaz' },
    { n: 0, t: 'çerez ya da izleme aracı' },
    { n: 2, t: 'ayrı rapor: öğrenciye ve veliye' },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Açılış: canlı kişilik şekli */}
      <section className="relative overflow-hidden" aria-label="Giriş">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bulut -left-32 top-4 size-[26rem]" style={{ background: 'var(--dim-con)', opacity: 0.16 }} />
          <div className="bulut -right-24 -top-20 size-[32rem]" style={{ background: 'var(--dim-int)', opacity: 0.2, animationDelay: '-7s' }} />
          <div className="bulut bottom-[-10rem] left-[38%] size-[26rem]" style={{ background: 'var(--dim-agr)', opacity: 0.13, animationDelay: '-12s' }} />
        </div>
        <div className="container-page relative pb-16 pt-4 sm:pt-8 md:pb-24 md:pt-12">
          <PersonaHero intro={<HeroIntro />} />
        </div>
      </section>

      {/* Nereden başlamalı: önce grup seçilir */}
      <section className="container-page pb-20 md:pb-28" aria-labelledby="baslangic-baslik">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end" data-reveal>
          <div>
            <p className="kicker">Nereden başlamalı?</p>
            <h2 id="baslangic-baslik" className="t-section mt-3">
              Önce sınıfını seç.
            </h2>
          </div>
          <p className="t-lede">Sana uygun testleri bölüm bölüm gösterelim. Veliyseniz çocuğunuzun sınıfını seçin.</p>
        </div>
        <GroupPicker />
        <PageGuide
          title="Bu sitede neler var?"
          className="mt-8"
          next={[
            { href: '/testler', label: 'Bütün testler' },
            { href: '/veliler-icin', label: 'Veliler için' },
            { href: '/rehber', label: 'Rehber' },
          ]}
        >
          <p>
            <strong>Testler:</strong> kişilik, zekâ ve zihinsel beceriler, okuma ve dersler, ilgi ve meslek. <strong>Rehber:</strong>{' '}
            öğrenciler ve veliler için bilimsel kaynaklara dayanan yazılar. <strong>Veliler için:</strong> raporu çocuğunuzla nasıl
            okuyacağınız ve ne zaman bir uzmana başvuracağınız.
          </p>
        </PageGuide>
      </section>

      <Marquee />

      <MeasureStory />

      {/* Testler */}
      <section className="container-page py-24 md:py-32" aria-labelledby="testler-baslik">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end" data-reveal>
          <div>
            <p className="kicker">Testler</p>
            <h2 id="testler-baslik" className="t-section mt-3">
              Neyi ölçüyoruz?
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="t-lede">
              Her test, yayımlanmış bir bilimsel ölçeğe ya da bizim geliştirip belgelediğimiz özgün bir göreve dayanır. Hepsi ücretsiz,
              hepsi hesap açmadan çözülür.
            </p>
            <Link href="/testler" className="self-start font-bold">
              Bütün testler ve bilimsel dayanakları →
            </Link>
          </div>
        </div>
        <TestCards />
      </section>

      {/* Rapor önizleme */}
      <section className="relative border-y border-rule bg-surface-2/55" aria-labelledby="rapor">
        <div className="container-page py-24 md:py-32">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end" data-reveal>
            <div>
              <p className="kicker">Rapor</p>
              <h2 id="rapor" className="t-section mt-3 scroll-mt-28">
                Aynı sonuç, <span className="tayf-yazi">iki ayrı dil.</span>
              </h2>
            </div>
            <p className="t-lede">
              On üç yaşındaki bir öğrencinin okuyacağı rapor ile velisinin okuyacağı rapor aynı olmamalı. Her sonucu öğrenciye kendi diliyle,
              veliye de ayrıca anlatıyoruz. İki raporu da PDF olarak indirebilirsiniz.
            </p>
          </div>
          <div data-reveal>
            <ReportPreview />
          </div>
        </div>
      </section>

      {/* Güven */}
      <section className="container-page py-24 md:py-32" aria-labelledby="ilkeler">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.55fr] lg:gap-16">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start" data-reveal>
            <p className="kicker">Güven</p>
            <h2 id="ilkeler" className="t-section">
              Neden güvenebilirsiniz?
            </h2>
            <p className="t-lede">Çocuğunuz hakkında söylenen her cümlenin arkasında durabilmemiz gerekiyor.</p>
            <Link href="/bilimsel-yaklasim" className="self-start font-bold">
              Bilimsel yaklaşımımızı okuyun →
            </Link>
          </div>
          <div>
            <ul className="grid gap-5 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <li key={p.t} data-reveal style={{ '--reveal-gecikme': `${(i % 2) * 90}ms` } as CSSProperties}>
                  <article className="kart flex h-full flex-col gap-3 p-6" data-tilt style={{ '--vurgu': DOTS[i + 1] } as CSSProperties}>
                    <span className="grid size-10 place-items-center rounded-full font-display text-lg font-bold text-white" style={{ background: DOTS[i + 1] }} aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-xl font-bold">{p.t}</h3>
                    <p className="text-ink-2">{p.d}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <dl className="mt-16 grid grid-cols-2 gap-y-10 border-y border-rule py-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.t}
              className={`flex flex-col-reverse gap-3 pr-4 lg:px-8 ${i > 0 ? 'lg:border-l lg:border-rule' : 'lg:pl-0'}`}
              data-reveal
              style={{ '--reveal-gecikme': `${i * 80}ms` } as CSSProperties}
            >
              <dt className="t-small max-w-[22ch] text-ink-2">{s.t}</dt>
              <dd className="font-display text-[clamp(3.6rem,6.4vw,6rem)] font-bold leading-[0.85] tracking-[-0.04em]" style={{ color: DOTS[(i + 2) % DOTS.length] }}>
                <CountUp to={s.n} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Nasıl çalışır */}
      <section className="container-page pb-24 md:pb-32" aria-labelledby="nasil">
        <div className="gece relative overflow-hidden rounded-[2.5rem] p-8 md:p-14" data-reveal>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="bulut -right-20 -top-24 size-80" style={{ background: 'var(--dim-int)', opacity: 0.35 }} />
            <div className="bulut -bottom-28 left-10 size-72" style={{ background: 'var(--dim-ext)', opacity: 0.25, animationDelay: '-9s' }} />
          </div>
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <div className="flex flex-col gap-4">
              <p className="kicker text-[color:var(--gece-soluk)]">Nasıl çalışır?</p>
              <h2 id="nasil" className="t-section">
                Üç adımda hazır.
              </h2>
              <p className="text-[color:var(--gece-soluk)]">Testi çocuğunuzla birlikte seçin, o çözsün, raporu birlikte okuyun.</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-4">
                <Link href="/testler" className="btn btn-acik btn-tayf" data-magnet>
                  Testlere göz atın
                </Link>
                <Link href="/veliler-icin" className="btn border-[color:var(--gece-cizgi)] bg-transparent text-[color:var(--gece-yazi)] hover:border-[color:var(--gece-yazi)]">
                  Veliler için
                </Link>
              </div>
            </div>
            <ol className="grid gap-8 sm:grid-cols-3">
              {STEPS.map((st, i) => (
                <li key={st.t} className="flex flex-col gap-3 border-t border-[color:var(--gece-cizgi)] pt-5">
                  <span className="font-display text-6xl font-bold leading-none tabular" style={{ color: DOTS[(i * 2) % DOTS.length] }} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <p className="font-display text-xl font-bold">{st.t}</p>
                  <p className="text-[color:var(--gece-soluk)]">{st.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Rehber */}
      <section className="container-page pb-24 md:pb-32" aria-labelledby="rehberden">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <p className="kicker">Rehber</p>
            <h2 id="rehberden" className="t-section mt-3">
              Rehberden
            </h2>
          </div>
          <Link href="/rehber" className="font-bold">
            Bütün yazılar →
          </Link>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {FEATURED_GUIDES.map((g, i) => (
            <li key={g.slug} data-reveal style={{ '--reveal-gecikme': `${i * 80}ms` } as CSSProperties}>
              <article className="kart flex h-full flex-col gap-3 p-6" data-tilt style={{ '--vurgu': DOTS[(i + 2) % DOTS.length] } as CSSProperties}>
                <p className="t-meta font-bold" style={{ color: DOTS[(i + 2) % DOTS.length] }}>
                  {GUIDE_CATEGORIES[g.category]}
                </p>
                <h3 className="font-display text-xl font-bold leading-snug">
                  <Link href={`/rehber/${g.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
                    {g.title}
                  </Link>
                </h3>
                <p className="text-ink-2">{g.description}</p>
                <span className="mt-auto pt-2 font-bold" aria-hidden="true">
                  Oku →
                </span>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* SSS */}
      <section className="container-page" aria-labelledby="sss">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div data-reveal>
            <p className="kicker">Sorular</p>
            <h2 id="sss" className="t-section mt-3">
              Sık sorulanlar
            </h2>
          </div>
          <div className="sss divide-y divide-rule border-y border-rule" data-reveal>
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-bold">
                  {f.q}
                  <span aria-hidden="true" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-rule-strong text-ink-2 transition-transform duration-300 group-open:rotate-45">
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
