import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PageHeader, Section } from '@/components/site/page-header';
import { PageGuide } from '@/components/site/page-guide';
import { TestCard, cardInfo } from '@/components/site/test-card';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { ORAL_CRITERIA } from '@/lib/scoring/oral';
import { oralAdultUrl } from '@/lib/oral/auto';
import { oralWordCount } from '@/lib/oral/words';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Okuma: sesli okuma değerlendirmesi ve okuma testleri',
  description:
    '1–8. sınıflar için sesli okuma değerlendirmesi: öğrenci metni sesli okur, cihazdaki yapay zekâ okumayı inceler, hatalı okunan kelimeleri ekranda gösterir ve hata raporu hazırlar. Ses kaydı cihazdan çıkmaz, kimse dinlemez.',
  path: '/okuma',
});

const ORAL = sesliOkuma;

const STEPS = [
  { t: 'Metni seç', d: 'Öğrenci, sınıfına göre yazılmış metinlerden birini seçer. Her sınıfa üç metin vardır: öykü ve bilgilendirici metin.' },
  {
    t: 'Mikrofonu dene',
    d: 'Öğrenci kısa bir cümle söyler; yapay zekâ cümleyi anlayınca okumaya geçilir. Yapay zekâ ilk seferde cihaza bir kez iner (yaklaşık 250 MB); sonraki açılışlarda inmez.',
  },
  { t: 'Öğrenci okur', d: 'Öğrenci metni tek başına sesli okur ve “Bitirdim” düğmesine basar. Okurken kimse yardım etmez, kaydı kimse dinlemez.' },
  {
    t: 'Yapay zekâ inceler',
    d: 'Öğrenci isterse (“Evet, analiz et”) kayıt yalnızca bu cihazda incelenir: Okunan kelimeler metinle tek tek karşılaştırılır, hız ve duraklamalar ölçülür. Öğrenci bu sırada soruları cevaplar; inceleme bitince ses kaydı silinir.',
  },
  {
    t: 'Hatalı yerler ekranda, rapor hazır',
    d: 'Metin kelime kelime ekranda gösterilir: yanlış okunan, atlanan ve eklenen kelimeler kırmızı; kendi düzeltme, tekrar, heceleme ve duraksama sarı işaretlidir. Hata türleri, yanlış okunan kelimeler, okuma hızı ve anlama raporda yazar; öğrenciye ve veliye ayrı rapor hazırlanır, PDF olarak indirilir.',
  },
];

const MEASURES = [
  { t: 'Doğru okuma', d: 'Metindeki kelimelerin ne kadarının doğru okunduğu; hangi kelimelerde, nasıl hata yapıldığı (yanlış okuma, atlama, ekleme) ve hata sayılmayan gözlemler (kendi düzeltme, tekrar, heceleme, duraksama).' },
  { t: 'Okuma hızı', d: 'Dakikada doğru okunan kelime sayısı; okuma süresi kayıttan, ilk sesten son sese ölçülür.' },
  { t: 'Okumanın ritmi', d: 'Kayıttan ölçülen duraklamalar ve ses yüksekliği eğrisi. Vurgu ve tonlama derecelendirmesi yalnızca yetişkinin dinlediği sürümde vardır.' },
  { t: 'Okuduğunu anlama', d: 'Metindeki bilgiyi hatırlama, çıkarım yapma, kelime anlamı ve ana fikir soruları.' },
];

export default function ReadingPage() {
  const live = publicInstruments().filter((t) => t.domain === 'reading');
  const oralLive = live.some((t) => t.slug === ORAL.slug);
  const grades = Array.from({ length: ORAL.maxGrade - ORAL.minGrade + 1 }, (_, i) => ORAL.minGrade + i);
  const silent = getInstrumentDef('okuma-hizi-ve-anlama');

  return (
    <>
      <PageHeader
        kicker="Okuma bölümü"
        title="Okuma değerlendirmesi"
        lede="Okuma becerisini en iyi gösteren yollardan biri, çocuğun bir metni sesli okumasıdır. Burada öğrenci metni tek başına okur; cihazdaki yapay zekâ okumayı kelime kelime inceler, hatalı okunan yerleri ekranda gösterir ve hata raporunu hazırlar. Kaydı kimse dinlemez."
      >
        <PageGuide
          steps={['Aşağıdan öğrencinin sınıfını seçin.', 'Öğrenci metni seçsin, mikrofonu denesin ve metni sesli okusun.', 'Yapay zekâ okumayı incelesin; hatalı yerler ekranda, rapor PDF olarak elinizde.']}
          next={oralLive ? [{ href: `/testler/${ORAL.slug}/coz`, label: 'Sesli okumaya başla' }, { href: '#nasil', label: 'Nasıl işler?' }] : undefined}
        >
          <p>
            Bu bölümde okuma becerisini ölçen değerlendirmeler var. Asıl değerlendirme <strong>Sesli Okuma Değerlendirmesi</strong>: Öğrenci okur,
            okumayı cihazdaki yapay zekâ inceler ve hataları gösterir. Kişilik ve zihinsel beceri testleri <Link href="/testler">Testler</Link> sayfasındadır.
          </p>
        </PageGuide>
      </PageHeader>

      {oralLive && (
        <section className="container-page py-14 md:py-20" aria-labelledby="sinif-sec">
          <div className="flex flex-col gap-3" data-reveal>
            <h2 id="sinif-sec" className="t-h2">
              Öğrencinin sınıfı
            </h2>
            <p className="measure text-ink-2">Sınıfı seçince değerlendirme o sınıfa göre açılır; metinler sınıf düzeyine göre yazılmıştır.</p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {grades.map((g, i) => (
              <li key={g} data-reveal style={{ '--reveal-gecikme': `${i * 40}ms` } as CSSProperties}>
                <Link
                  href={`/testler/${ORAL.slug}/coz?secili=${g}`}
                  className="kart flex min-h-24 flex-col items-start justify-center gap-0.5 p-5 no-underline"
                  style={{ '--vurgu': 'var(--dim-agr)' } as CSSProperties}
                >
                  <span className="font-display text-3xl font-bold">{g}.</span>
                  <span className="font-bold text-ink-2">sınıf</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Section id="nasil" title="Nasıl işler?" intro="Değerlendirme yaklaşık 20 dakika sürer ve düğmelerle adım adım ilerler; öğrenci tek başına yapabilir." className="border-t border-rule">
        <ol className="flex flex-col gap-6">
          {STEPS.map((s, i) => (
            <li key={s.t} className="grid grid-cols-[2.75rem_1fr] gap-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink font-display text-xl font-bold tabular" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="t-h3">{s.t}</h3>
                <p className="measure mt-1 text-ink-2">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="olcer"
        title="Neyi ölçer?"
        intro="Akıcı okuma; doğru, yeterince hızlı ve anlama uygun vurgu ve tonlamayla okumaktır (National Reading Panel, 2000). Amaç en hızlı okumak değil, anlayarak rahat okumaktır."
        className="border-t border-rule"
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {MEASURES.map((m) => (
            <li key={m.t} className="panel flex flex-col gap-1.5 p-5">
              <h3 className="t-h3">{m.t}</h3>
              <p className="text-ink-2">{m.d}</p>
            </li>
          ))}
        </ul>
        <p className="measure text-ink-2">
          Raporda metnin öğrenci için düzeyi de yazar: <strong>rahat</strong> (tek başına okuyabilir), <strong>destekle</strong> (bir yetişkinle birlikte
          çalışmaya uygun) ya da <strong>şimdilik zor</strong>. Bu düzey, doğru okunan kelime oranına (%{ORAL_CRITERIA.accuracy.easy} ve üzeri rahat, %
          {ORAL_CRITERIA.accuracy.support}’ın altı zor) ve sorulardaki doğru oranına göre Ölçekhane’nin pilot ölçütleriyle belirlenir; bir norm değildir.
        </p>
      </Section>

      <Section id="gizlilik" title="Ses kaydı cihazdan çıkmaz, kimse dinlemez" className="border-t border-rule">
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          <li>Mikrofon yalnızca düğmeye basılınca ve tarayıcı izin istedikten sonra açılır; okuma bitince kapanır.</li>
          <li>
            Kayıt yalnızca açık olan sayfada, cihazın belleğinde durur. Sunucumuza ya da başka bir yere gönderilmez; inceleme bitince (ya da öğrenci “Hayır”
            derse hemen) silinir.
          </li>
          <li>
            Okumayı, öğrencinin cihazında (tarayıcıda) çalışan bir konuşma tanıma modeli inceler; okunan kelimeleri yazıya döküp metinle karşılaştırır. Yapay
            zekânın net anlayamadığı kelimeler hata sayılmaz. Rapor için yalnızca kelime işaretleri, cevaplar ve süreler gönderilir; onlar da saklanmaz.
          </li>
          <li>
            Cihaz yapay zekâyı çalıştıramıyorsa yedek yol: bir yetişkin (öğretmen ya da veli) kaydı dinleyip hataları kendisi işaretler. Bu sürüm yalnızca{' '}
            {oralLive ? <Link href={oralAdultUrl(ORAL.slug)}>ayrı bir bağlantıyla</Link> : 'ayrı bir bağlantıyla'} açılır.
          </li>
        </ul>
        <p className="t-small text-ink-2">
          Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
        </p>
      </Section>

      <Section id="metinler" title="Metin kütüphanesi" intro="Her metin özgündür ve sınıf düzeyine göre yazılmıştır. Yeni metinler eklendikçe burada görünür." className="border-t border-rule">
        <div className="flex flex-col gap-5">
          {grades.map((g) => (
            <div key={g} className="flex flex-col gap-2">
              <h3 className="font-bold">{g}. sınıf</h3>
              <ul className="flex flex-wrap gap-2">
                {ORAL.passages
                  .filter((p) => p.grade === g)
                  .map((p) => (
                    <li key={p.key} className="chip">
                      {p.title} · {p.genre === 'narrative' ? 'öykü' : 'bilgilendirici'} · {oralWordCount(p.paragraphs)} kelime
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="t-small text-ink-2">
          Aynı öğrenciyi birkaç hafta sonra aynı sınıf düzeyinden başka bir metinle yeniden değerlendirerek gelişimini izleyebilirsiniz.
        </p>
      </Section>

      {live.length > 0 && (
        <section className="border-t border-rule bg-surface-2/55" aria-labelledby="okuma-testleri">
          <div className="container-page flex flex-col gap-8 py-14 md:py-20">
            <h2 id="okuma-testleri" className="t-h2">
              Okuma testleri
            </h2>
            <ul className="grid gap-5 md:grid-cols-2">
              {live.map((t) => (
                <li key={t.slug}>
                  <TestCard t={cardInfo(t)} />
                </li>
              ))}
            </ul>
            {silent && live.includes(silent) && (
              <p className="t-small measure text-ink-2">
                {silent.name} sessiz okumayı ölçer; Sesli Okuma Değerlendirmesinde ise öğrenci metni sesli okur ve okumayı cihazdaki yapay zekâ inceler. İkisini de öğrenci tek başına çözebilir.
              </p>
            )}
            <p className="t-small text-ink-2">
              Okuma hızı ve anlama üzerine velilere yazılmış rehber yazısı:{' '}
              <Link href="/rehber/okuma-hizi-ve-okudugunu-anlama">Okuma hızı mı, okuduğunu anlama mı?</Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
