import { type Blok, blokDuzeyi, type DersBolumu, type KutuCesidi, type Seviye } from '@/content/beyin/types';
import { renderMarkdown } from '@/lib/markdown';
import { Animasyon } from './animasyon';
import { BeyinSahnesi } from './beyin-sahnesi';
import { Vaka } from './vaka';

const KUTU_BASLIGI: Record<KutuCesidi, string> = {
  'aklinda-kalsin': 'Aklında kalsın',
  'biliyor-muydun': 'Biliyor muydun?',
  dikkat: 'Dikkat',
  derinles: 'Derinleş',
  klinik: 'Klinik bağlantı',
  'sinav-notu': 'Sınav notu',
  goruntuleme: 'Görüntülemede',
  cerrahi: 'Beyin cerrahisinde',
  arastirma: 'Araştırma sınırı',
};

/** Kutunun üst satırındaki kısa tanım (katmanın adından sonra). */
const KUTU_TANIMI: Partial<Record<KutuCesidi, string>> = {
  derinles: 'ayrıntı',
  klinik: 'hastalıkla bağlantı, eğitim amaçlı',
  'sinav-notu': 'sınavlarda en çok sorulanlar',
  goruntuleme: 'BT ve MR okuma',
  cerrahi: 'ameliyathaneden, eğitim amaçlı',
  arastirma: 'bilimin bugün tartıştıkları',
};

/** Temel dışındaki katmanların adı (bloğun üstünde görünür). */
export const KATMAN_ADI: Record<Exclude<Seviye, 'temel'>, string> = {
  lisans: 'Lisans katmanı',
  ileri: 'Uzman katmanı',
};

function katmanUstu(d: Seviye, tanim?: string): string | undefined {
  if (d === 'temel') return tanim ? tanim.charAt(0).toLocaleUpperCase('tr') + tanim.slice(1) : undefined;
  return tanim ? `${KATMAN_ADI[d]} · ${tanim}` : KATMAN_ADI[d];
}

function BlokGoster({ blok }: { blok: Blok }) {
  const d = blokDuzeyi(blok);
  switch (blok.tur) {
    case 'metin':
      return (
        <div className="flex flex-col gap-1">
          {d !== 'temel' && <p className="kicker">{KATMAN_ADI[d]}</p>}
          <div className="prose-olc" dangerouslySetInnerHTML={{ __html: renderMarkdown(blok.md) }} />
        </div>
      );
    case 'sahne':
      return <BeyinSahnesi sahne={blok.sahne} baslik={blok.baslik} aciklama={blok.aciklama} araclar={blok.araclar} duzey={d} />;
    case 'animasyon':
      return (
        <figure className="beyin-cizim flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="kicker">{d === 'temel' ? 'Hareketli çizim' : `Hareketli çizim · ${KATMAN_ADI[d].toLocaleLowerCase('tr')}`}</p>
            <h3 className="font-display text-xl font-bold leading-tight">{blok.baslik}</h3>
          </div>
          <Animasyon ad={blok.ad} />
          <figcaption className="t-small text-ink-2">{blok.aciklama}</figcaption>
        </figure>
      );
    case 'kutu': {
      const ust = katmanUstu(d, KUTU_TANIMI[blok.cesit]);
      return (
        <aside className={`beyin-kutu beyin-kutu-${blok.cesit} measure`}>
          {ust && <p className="kicker mb-1">{ust}</p>}
          <p className="mb-2 font-bold">{blok.baslik ?? KUTU_BASLIGI[blok.cesit]}</p>
          <div className="prose-olc text-[1rem]" dangerouslySetInnerHTML={{ __html: renderMarkdown(blok.md) }} />
        </aside>
      );
    }
    case 'vaka':
      return (
        <Vaka
          ust={katmanUstu(d, 'klinik vaka') ?? 'Klinik vaka'}
          baslik={blok.baslik}
          oykuHtml={renderMarkdown(blok.oyku)}
          soru={blok.soru}
          cozumHtml={renderMarkdown(blok.cozum)}
        />
      );
    case 'sayilar':
      return (
        <section className="flex flex-col gap-4" aria-label={blok.baslik}>
          {d !== 'temel' && <p className="kicker -mb-3">{KATMAN_ADI[d]}</p>}
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
          {d !== 'temel' && <p className="kicker">{KATMAN_ADI[d]}</p>}
          <figcaption className="font-bold">{blok.baslik}</figcaption>
          <div className="prose-olc beyin-tablo max-w-none">
            <table style={blok.sutunlar.length >= 4 ? { minWidth: `${blok.sutunlar.length * 8.5}rem` } : undefined}>
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
                        <th key={i} scope="row" dangerouslySetInnerHTML={{ __html: satirIci(h) }} />
                      ) : (
                        <td key={i} dangerouslySetInnerHTML={{ __html: satirIci(h) }} />
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

/** Tablo hücresindeki kısa biçim: **kalın** ve *eğik* (Latince adlar için). */
function satirIci(h: string): string {
  const kacis = h.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return kacis.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
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
          {b.bloklar.map((blok, j) => {
            const d = blokDuzeyi(blok);
            return d === 'temel' ? (
              <BlokGoster key={j} blok={blok} />
            ) : (
              <div key={j} className={`katman-${d}`}>
                <BlokGoster blok={blok} />
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/**
 * Dersteki metinlerin kelime sayısından yaklaşık okuma süresi (dakikada ~170 kelime; sahne ve çizimler için ek süre).
 * `okuma` verilirse yalnızca o okuma düzeyinde görünen bloklar sayılır.
 */
export function dersSuresi(bolumler: DersBolumu[], okuma: Seviye = 'ileri'): number {
  const sira: Record<Seviye, number> = { temel: 0, lisans: 1, ileri: 2 };
  let kelime = 0;
  let ek = 0;
  for (const b of bolumler) {
    for (const k of b.bloklar) {
      if (sira[blokDuzeyi(k)] > sira[okuma]) continue;
      if (k.tur === 'metin' || k.tur === 'kutu') kelime += k.md.split(/\s+/).length;
      else if (k.tur === 'vaka') kelime += `${k.oyku} ${k.soru} ${k.cozum}`.split(/\s+/).length;
      else if (k.tur === 'sahne' || k.tur === 'animasyon') {
        kelime += k.aciklama.split(/\s+/).length;
        ek += 1.5;
      } else if (k.tur === 'tablo') kelime += k.satirlar.flat().join(' ').split(/\s+/).length;
      else if (k.tur === 'sayilar') kelime += k.ogeler.map((o) => o.aciklama).join(' ').split(/\s+/).length;
    }
  }
  return Math.max(5, Math.round(kelime / 170 + ek));
}

/** Hedefin metni ve katmanı. */
export function hedefBilgisi(h: string | { metin: string; duzey: Seviye }): { metin: string; duzey: Seviye } {
  return typeof h === 'string' ? { metin: h, duzey: 'temel' } : h;
}
