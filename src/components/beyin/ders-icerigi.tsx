import { type Blok, type DersBolumu, ILERI_KUTULAR, type KutuCesidi } from '@/content/beyin/types';
import { renderMarkdown } from '@/lib/markdown';
import { Animasyon } from './animasyon';
import { BeyinSahnesi } from './beyin-sahnesi';

const KUTU_BASLIGI: Record<KutuCesidi, string> = {
  'aklinda-kalsin': 'Aklında kalsın',
  'biliyor-muydun': 'Biliyor muydun?',
  dikkat: 'Dikkat',
  derinles: 'Derinleş',
  klinik: 'Klinik bağlantı',
  'sinav-notu': 'Sınav notu',
};

const KUTU_USTU: Partial<Record<KutuCesidi, string>> = {
  derinles: 'İleri katman · tıp ve nörobilim düzeyi',
  klinik: 'İleri katman · hastalıkla bağlantı (eğitim amaçlı)',
  'sinav-notu': 'İleri katman · sınavlarda en çok sorulanlar',
};

/** İleri katmandaki bloklar okuma düzeyi "Temel" seçilince gizlenir (globals.css: [data-duzey="temel"] .katman-ileri). */
function ileriMi(blok: Blok): boolean {
  if (blok.tur === 'kutu') return ILERI_KUTULAR.includes(blok.cesit);
  if (blok.tur === 'sahne' || blok.tur === 'animasyon') return Boolean(blok.ileri);
  return false;
}

function BlokGoster({ blok }: { blok: Blok }) {
  switch (blok.tur) {
    case 'metin':
      return <div className="prose-olc" dangerouslySetInnerHTML={{ __html: renderMarkdown(blok.md) }} />;
    case 'sahne':
      return <BeyinSahnesi sahne={blok.sahne} baslik={blok.baslik} aciklama={blok.aciklama} araclar={blok.araclar} ileri={blok.ileri} />;
    case 'animasyon':
      return (
        <figure className="beyin-cizim flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="kicker">{blok.ileri ? 'Hareketli çizim · ileri katman' : 'Hareketli çizim'}</p>
            <h3 className="font-display text-xl font-bold leading-tight">{blok.baslik}</h3>
          </div>
          <Animasyon ad={blok.ad} />
          <figcaption className="t-small text-ink-2">{blok.aciklama}</figcaption>
        </figure>
      );
    case 'kutu':
      return (
        <aside className={`beyin-kutu beyin-kutu-${blok.cesit} measure`}>
          {KUTU_USTU[blok.cesit] && <p className="kicker mb-1">{KUTU_USTU[blok.cesit]}</p>}
          <p className="mb-2 font-bold">{blok.baslik ?? KUTU_BASLIGI[blok.cesit]}</p>
          <div className="prose-olc text-[1rem]" dangerouslySetInnerHTML={{ __html: renderMarkdown(blok.md) }} />
        </aside>
      );
    case 'sayilar':
      return (
        <section className="flex flex-col gap-4" aria-label={blok.baslik}>
          <h3 className="font-display text-xl font-bold">{blok.baslik}</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {blok.ogeler.map((o) => (
              <li key={o.aciklama} className="beyin-kutu flex flex-col gap-1.5">
                <p className="font-display text-[2rem] font-bold leading-none tracking-tight">
                  {o.deger}
                  {o.birim && <span className="ml-1.5 text-lg text-ink-2">{o.birim}</span>}
                </p>
                <p className="t-small text-ink-2">{o.aciklama}</p>
              </li>
            ))}
          </ul>
          {blok.not && <p className="t-meta">{blok.not}</p>}
        </section>
      );
    case 'tablo':
      return (
        <figure className="flex flex-col gap-2">
          <figcaption className="font-bold">{blok.baslik}</figcaption>
          <div className="prose-olc max-w-none">
            <table>
              <thead>
                <tr>
                  {blok.sutunlar.map((s) => (
                    <th key={s} scope="col">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blok.satirlar.map((r) => (
                  <tr key={r.join('|')}>
                    {r.map((h, i) =>
                      i === 0 ? (
                        <th key={i} scope="row">
                          {h}
                        </th>
                      ) : (
                        <td key={i}>{h}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {blok.not && <p className="t-small text-ink-2">{blok.not}</p>}
        </figure>
      );
  }
}

export function DersIcerigi({ bolumler }: { bolumler: DersBolumu[] }) {
  return (
    <div className="flex flex-col gap-16">
      {bolumler.map((b, i) => (
        <section key={b.id} id={b.id} aria-labelledby={`${b.id}-baslik`} className="flex scroll-mt-24 flex-col gap-7">
          <h2 id={`${b.id}-baslik`} className="t-h2 font-display font-bold">
            <span className="mr-3 text-ink-3">{i + 1}.</span>
            {b.baslik}
          </h2>
          {b.bloklar.map((blok, j) =>
            ileriMi(blok) ? (
              <div key={j} className="katman-ileri">
                <BlokGoster blok={blok} />
              </div>
            ) : (
              <BlokGoster key={j} blok={blok} />
            ),
          )}
        </section>
      ))}
    </div>
  );
}

/** Dersteki bütün metinlerin kelime sayısından yaklaşık okuma süresi (dakikada ~170 kelime; sahneler için ek süre). */
export function dersSuresi(bolumler: DersBolumu[]): number {
  let kelime = 0;
  let ek = 0;
  for (const b of bolumler) {
    for (const k of b.bloklar) {
      if (k.tur === 'metin' || k.tur === 'kutu') kelime += k.md.split(/\s+/).length;
      else if (k.tur === 'sahne' || k.tur === 'animasyon') {
        kelime += k.aciklama.split(/\s+/).length;
        ek += 1.5;
      } else if (k.tur === 'tablo') kelime += k.satirlar.flat().join(' ').split(/\s+/).length;
      else if (k.tur === 'sayilar') kelime += k.ogeler.map((o) => o.aciklama).join(' ').split(/\s+/).length;
    }
  }
  return Math.max(5, Math.round(kelime / 170 + ek));
}
