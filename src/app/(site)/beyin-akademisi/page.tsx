import Link from 'next/link';
import { BeyinSahnesi } from '@/components/beyin/beyin-sahnesi';
import { ModelNotu } from '@/components/beyin/model-notu';
import { JsonLd } from '@/components/seo/json-ld';
import { PageGuide } from '@/components/site/page-guide';
import { BEYIN_YOLU, DALLAR, SEVIYE_ADLARI, hazirDersler, toplamDers } from '@/content/beyin';
import { YAPILAR } from '@/content/beyin/yapilar';
import { siteUrl } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Beyin Akademisi: Türkçe beyin atlası, ansiklopedisi ve dersleri',
  description:
    'Beyni sıfırdan uzman düzeyine: anatomi, hücresel nörobilim, sistemler, bilişsel nörobilim ve klinik bağlantılar. Üç boyutlu model, hareketli çizimler, kaynaklar.',
  path: BEYIN_YOLU,
});

const AYAKLAR = [
  {
    baslik: 'Dersler',
    durum: 'Hazırlanıyor: her işlemede bir ders',
    metin:
      '8 bölüm, 100 ders. Her ders katmanlı: herkes için sade anlatım, tıp ve nörobilim düzeyi için "Derinleş", "Klinik bağlantı" ve "Sınav notu" kutuları.',
    href: `${BEYIN_YOLU}/anatomi/sinir-sistemine-ilk-bakis`,
    bag: 'İlk derse başla',
  },
  {
    baslik: 'Atlas',
    durum: 'Üç boyutlu atlas açık; kesit, yol ve damar atlasları hazırlanıyor',
    metin: 'Beyni döndür, kes, parçalarına ayır. Dilim dilim kesit atlası, sinir yolları ve damar alanları ders ders eklenecek.',
    href: `${BEYIN_YOLU}/beyin-gezgini`,
    bag: 'Beyin gezginini aç',
  },
  {
    baslik: 'Ansiklopedi',
    durum: 'Hazırlanıyor',
    metin:
      'Her yapı ve her kavram için ayrı madde: nerede durur, bağlantıları, görevi, kanlanması, hasar görünce ne olur. Dersler ilerledikçe maddeler eklenecek.',
  },
  {
    baslik: 'Pratik',
    durum: 'Her dersin sonunda açık; soru bankası hazırlanıyor',
    metin:
      'Seviyesi belli, açıklamalı sorular. Sırada üç boyutlu modelde "yapıyı bul", kesit tanıma ve pratik anatomi sınavına benzer çalışmalar var.',
  },
];

export default function BeyinAkademisiPage() {
  const ilk = DALLAR[0].program[0];
  const hazir = hazirDersler().length;
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
              Beyni sıfırdan, <span className="tayf-yazi">uzman düzeyine</span> öğren
            </h1>
            <p className="t-lede measure">
              Türkçe beyin atlası, ansiklopedisi ve dersleri. Anatomiden hücreye, duyulardan belleğe, gelişimden klinik
              bağlantılara: beyni hiç bilmeyen biri için sade bir dille başlar, tıp ve nörobilim öğrencisinin ihtiyaç
              duyduğu ayrıntıya kadar iner. Her derste döndürüp kesebileceğin gerçek bir beyin modeli var.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`${BEYIN_YOLU}/anatomi/${ilk.slug}`} className="btn btn-primary btn-tayf" data-magnet>
                İlk derse başla
              </Link>
              <Link href={`${BEYIN_YOLU}/beyin-gezgini`} className="btn btn-secondary">
                Beyin gezginini aç
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2 text-[0.9rem]">
              <li className="beyin-seviye">8 bölüm · {toplamDers()} ders</li>
              <li className="beyin-seviye">{hazir} ders hazır</li>
              <li className="beyin-seviye">Modelde {YAPILAR.length} yapı</li>
              <li className="beyin-seviye">Ücretsiz, kayıt yok</li>
            </ul>
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
            'Yeni başlıyorsan 1. bölümün ilk dersinden başla.',
            'Her derste önce temel anlatımı oku; hazırsan "Derinleş" ve "Klinik bağlantı" kutularına geç.',
            'Üç boyutlu sahneleri döndür, parçalara dokun, kesit al.',
            'Ders sonunda kendini dene ve sözlüğe göz at.',
          ]}
          next={[
            { href: `${BEYIN_YOLU}/anatomi/${ilk.slug}`, label: 'İlk derse başla' },
            { href: `${BEYIN_YOLU}/beyin-gezgini`, label: 'Beyin gezgini' },
          ]}
        >
          <p>
            Beyin Akademisi, beyni sıfırdan uzman düzeyine öğretmek için kuruluyor: dersler, atlas, ansiklopedi ve pratik.
            Dersler sırayla hazırlanır; hazır olanlar bağlantılıdır, ötekiler “Hazırlanıyor” diye görünür. Hiçbir şey
            kaydedilmez.
          </p>
        </PageGuide>

        <section aria-labelledby="dort-ayak" className="flex flex-col gap-6">
          <h2 id="dort-ayak" className="t-h2">
            Dört ayak
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {AYAKLAR.map((a) => (
              <li key={a.baslik} className="panel flex flex-col gap-2 p-6">
                <p className="kicker">{a.durum}</p>
                <h3 className="font-display text-2xl font-bold">{a.baslik}</h3>
                <p className="text-ink-2">{a.metin}</p>
                {a.href && (
                  <div className="mt-auto pt-2">
                    <Link href={a.href} className="btn btn-secondary">
                      {a.bag}
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="bolumler" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="bolumler" className="t-h2">
              Sekiz bölüm, yüz ders
            </h2>
            <p className="measure text-ink-2">
              Bölümler birbirinin üstüne kurulur. Seviyeler: {SEVIYE_ADLARI.temel} (meraklı herkes, lise ve sağlık lisesi),{' '}
              {SEVIYE_ADLARI.lisans} (tıp, psikoloji ve nörobilimin ilk yılları), {SEVIYE_ADLARI.ileri} (ayrıntılı nöroanatomi
              ve hastalıklarla bağlantılar).
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {DALLAR.map((d) => {
              const hazirSayi = d.program.filter((p) => p.ders).length;
              return (
                <li key={d.id}>
                  <Link href={`${BEYIN_YOLU}/${d.id}`} className="panel group flex h-full gap-4 p-5 no-underline hover:border-ink">
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-full font-display text-xl font-bold text-white"
                      style={{ background: d.renk }}
                      aria-hidden="true"
                    >
                      {d.sira}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-xl font-bold leading-snug group-hover:underline">{d.ad}</span>
                      <span className="t-small text-ink-2">{d.aciklama}</span>
                      <span className="t-meta">
                        {d.program.length} ders{hazirSayi > 0 ? ` · ${hazirSayi} ders hazır` : ' · hazırlanıyor'}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <ModelNotu />
      </div>
    </>
  );
}
