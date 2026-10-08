import Link from 'next/link';
import { BeyinSahnesi } from '@/components/beyin/beyin-sahnesi';
import { ModelNotu } from '@/components/beyin/model-notu';
import { JsonLd } from '@/components/seo/json-ld';
import { PageGuide } from '@/components/site/page-guide';
import { BEYIN_YOLU, DALLAR } from '@/content/beyin';
import { siteUrl } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Beyin Akademisi: beyin anatomisi ve beynin çalışması, üç boyutlu modelle',
  description:
    'Beyni sıfırdan, gerçek bir üç boyutlu modelle öğrenin: beyin anatomisi ve beynin nasıl çalıştığı, sade Türkçe, hareketli çizimler ve kaynaklarla.',
  path: BEYIN_YOLU,
});

const OZELLIKLER = [
  {
    baslik: 'Gerçek bir beyin modeli',
    metin: 'Bir insan beyninin üç boyutlu modelini parmağınla döndür, yakınlaştır, kes ve parçalarına ayır. Her yapıya dokununca adı ve görevi açılır.',
  },
  {
    baslik: 'Hareketli çizimler',
    metin: 'Sinir sinyalinin yolculuğu, yön terimleri, gri ve beyaz cevher… Okuduğunu hareket ederken gör.',
  },
  {
    baslik: 'Sıfırdan, sade Türkçe',
    metin: 'Hiç bilmeyen biri için yazıldı. Tıpta kullanılan terimler ve Latince adları da yanında; tıp öğrencisine de yeter.',
  },
  {
    baslik: 'Kendini dene',
    metin: 'Her dersin sonunda açıklamalı sorular ve bir sözlük var. Cevapların hiçbir yere kaydedilmez.',
  },
  {
    baslik: 'Kaynakları belli',
    metin: 'Her bilgi açık ve güvenilir kaynaklardan denetlenir; kaynaklar dersin sonunda yazılıdır.',
  },
];

export default function BeyinAkademisiPage() {
  const ilk = DALLAR[0].program[0];
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Beyin Akademisi', path: BEYIN_YOLU },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: DALLAR.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Course',
              name: d.ad,
              description: d.aciklama,
              url: siteUrl(`${BEYIN_YOLU}/${d.id}`),
              inLanguage: 'tr-TR',
              isAccessibleForFree: true,
              provider: { '@type': 'Organization', name: 'Ölçekhane', url: siteUrl('/') },
            },
          })),
        }}
      />

      <header className="relative overflow-hidden border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="sayfa-sekil" />
        </div>
        <div className="container-page relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col gap-6">
            <p className="kicker">Beyin Akademisi</p>
            <h1 className="t-section">
              Beyni gerçek bir modelde, <span className="tayf-yazi">adım adım</span> öğren
            </h1>
            <p className="t-lede measure">
              İki dal, kırk derslik bir program: beynin bütün parçaları ve beynin nasıl çalıştığı. Hiç bilmeyen biri için sade Türkçeyle; tıp
              öğrencisine yetecek ayrıntıyla. Her derste döndürüp kesebileceğin üç boyutlu bir beyin ve hareketli çizimler var.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`${BEYIN_YOLU}/anatomi/${ilk.slug}`} className="btn btn-primary btn-tayf" data-magnet>
                İlk derse başla
              </Link>
              <Link href={`${BEYIN_YOLU}/beyin-gezgini`} className="btn btn-secondary">
                Beyin gezginini aç
              </Link>
            </div>
          </div>
          <BeyinSahnesi
            sahne={{ katmanlar: ['kabuk', 'sap', 'derin'], renk: 'lob', gizle: ['bolge:sinir'], bakis: 'egik', donme: true }}
            araclar={[]}
            buyuk
            basliksiz
          />
        </div>
      </header>

      <div className="container-page flex flex-col gap-16 py-12 md:py-16">
        <PageGuide
          steps={[
            'Bir dal seç: önce anatomi, sonra beynin işleyişi önerilir.',
            'Dersleri sırayla oku; üç boyutlu sahneleri döndür ve parçalara dokun.',
            'Her dersin sonunda kendini dene ve sözlüğe göz at.',
          ]}
          next={[
            { href: `${BEYIN_YOLU}/anatomi`, label: 'Beyin Anatomisi' },
            { href: `${BEYIN_YOLU}/nasil-calisir`, label: 'Beyin Nasıl Çalışır?' },
          ]}
        >
          <p>
            Burada beyni sıfırdan öğrenebilirsin. Dersler hazırlandıkça eklenir; hazır olanlar aşağıdaki listelerde
            bağlantılıdır. Hiçbir şey kaydedilmez; ilerlemen işaretlenmez.
          </p>
        </PageGuide>

        <section aria-labelledby="dallar" className="flex flex-col gap-6">
          <h2 id="dallar" className="t-h2">
            İki dal
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {DALLAR.map((d, i) => {
              const hazir = d.program.filter((p) => p.ders).length;
              return (
                <article key={d.id} className="panel flex flex-col gap-4 p-6 md:p-8">
                  <p className="kicker">
                    {i + 1}. dal · {d.program.length} ders · {hazir} ders hazır
                  </p>
                  <h3 className="font-display text-[1.9rem] font-bold leading-tight">
                    <Link href={`${BEYIN_YOLU}/${d.id}`} className="no-underline hover:underline">
                      {d.ad}
                    </Link>
                  </h3>
                  <p className="text-ink-2">{d.aciklama}</p>
                  <ol className="flex flex-col gap-1.5 text-[0.95rem]">
                    {d.program.slice(0, 6).map((p) => (
                      <li key={p.slug} className="flex gap-2">
                        <span className="w-6 shrink-0 text-right font-bold text-ink-3 tabular">{p.sira}</span>
                        {p.ders ? (
                          <Link href={`${BEYIN_YOLU}/${d.id}/${p.slug}`}>{p.baslik}</Link>
                        ) : (
                          <span className="text-ink-2">{p.baslik}</span>
                        )}
                      </li>
                    ))}
                    <li className="pl-8 text-ink-3">ve {d.program.length - 6} ders daha</li>
                  </ol>
                  <div className="mt-auto pt-2">
                    <Link href={`${BEYIN_YOLU}/${d.id}`} className="btn btn-secondary">
                      Bütün dersleri gör
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="her-derste" className="flex flex-col gap-6">
          <h2 id="her-derste" className="t-h2">
            Her derste neler var?
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OZELLIKLER.map((o) => (
              <li key={o.baslik} className="beyin-kutu flex flex-col gap-2">
                <p className="font-bold">{o.baslik}</p>
                <p className="t-small text-ink-2">{o.metin}</p>
              </li>
            ))}
            <li className="beyin-kutu flex flex-col gap-2">
              <p className="font-bold">Beyin gezgini</p>
              <p className="t-small text-ink-2">
                Bütün yapılar tek sayfada: katmanları aç-kapa, istediğin yerden kes, ara.{' '}
                <Link href={`${BEYIN_YOLU}/beyin-gezgini`}>Gezgini aç</Link>
              </p>
            </li>
          </ul>
        </section>

        <ModelNotu />
      </div>
    </>
  );
}
