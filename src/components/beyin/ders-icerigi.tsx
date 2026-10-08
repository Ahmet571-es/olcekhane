import { type Blok, blokDuzeyi, type DersBolumu, type KutuCesidi, type Seviye } from '@/content/beyin/types';
import { renderMarkdown } from '@/lib/markdown';
import { Animasyon } from './animasyon';
import { BeyinSahnesi } from './beyin-sahnesi';
import { DUZEY_KARTI, DuzeyNoktalari } from './duzey';
import { KatmanIpucu } from './okuma-duzeyi';
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

/** Kutunun üst satırındaki kısa tanım. */
const KUTU_TANIMI: Partial<Record<KutuCesidi, string>> = {
  derinles: 'ayrıntı',
  klinik: 'hastalıkla bağlantı, eğitim amaçlı',
  'sinav-notu': 'sınavlarda en çok sorulanlar',
  goruntuleme: 'BT ve MR okuma',
  cerrahi: 'ameliyathaneden, eğitim amaçlı',
  arastirma: 'bilimin bugün tartıştıkları',
};

/** Katmanın adı (düzey seçicide ve katman gruplarının başında). */
export const KATMAN_ADI: Record<Exclude<Seviye, 'temel'>, string> = {
  lisans: 'Lisans düzeyi',
  ileri: 'Uzman düzeyi',
};

const buyukHarfle = (t: string) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);

/**
 * Bloğun kendisi. Hangi düzeye ait olduğu bloğun üstünde yazmaz: aynı düzeydeki ardışık bloklar bir grupta toplanır ve
 * grubun kenarında o düzeyin renkli çizgisi, başında adı görünür (DersIcerigi).
 */
function BlokGoster({ blok }: { blok: Blok }) {
  switch (blok.tur) {
    case 'metin':
      return <div className="prose-olc" dangerouslySetInnerHTML={{ __html: renderMarkdown(blok.md) }} />;
    case 'sahne':
      return <BeyinSahnesi sahne={blok.sahne} baslik={blok.baslik} aciklama={blok.aciklama} araclar={blok.araclar} />;
    case 'animasyon':
      return (
        <figure className="beyin-cizim flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="kicker">Hareketli çizim</p>
            <h3 className="font-display text-xl font-bold leading-tight">{blok.baslik}</h3>
          </div>
          <Animasyon ad={blok.ad} />
          <figcaption className="t-small text-ink-2">{blok.aciklama}</figcaption>
        </figure>
      );
    case 'kutu': {
      const tanim = KUTU_TANIMI[blok.cesit];
      const ust = tanim && buyukHarfle(tanim);
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
          ust="Klinik vaka"
          baslik={blok.baslik}
          oykuHtml={renderMarkdown(blok.oyku)}
          soru={blok.soru}
          cozumHtml={renderMarkdown(blok.cozum)}
        />
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

/** Aynı düzeydeki ardışık blokları bir araya toplar. */
function grupla(bloklar: Blok[]): { duzey: Seviye; bloklar: Blok[] }[] {
  const gruplar: { duzey: Seviye; bloklar: Blok[] }[] = [];
  for (const b of bloklar) {
    const d = blokDuzeyi(b);
    const son = gruplar.at(-1);
    if (son && son.duzey === d) son.bloklar.push(b);
    else gruplar.push({ duzey: d, bloklar: [b] });
  }
  return gruplar;
}

/**
 * Dersin bölümleri. Herkes için olan (temel) bloklar çizgisiz akar; Lisans ve Uzman blokları ardışık gruplar hâlinde,
 * kenarında düzeyin renkli çizgisi ve başında düzeyin adıyla gösterilir; seçili düzeyin üstündekiler gizlenir (CSS,
 * `data-duzey`). Her bölümün sonunda gizli kalan kısım haber verilir. `data-capa`: düzey değişince okunan yer kaymasın
 * diye her düzeyde görünen öğeler.
 */
export function DersIcerigi({ bolumler }: { bolumler: DersBolumu[] }) {
  return (
    <div className="flex flex-col gap-16">
      {bolumler.map((b, i) => {
        const sayi = (d: Seviye) => b.bloklar.filter((k) => blokDuzeyi(k) === d).length;
        return (
          <section key={b.id} id={b.id} aria-labelledby={`${b.id}-baslik`} className="flex scroll-mt-24 flex-col gap-7">
            <h2 id={`${b.id}-baslik`} data-capa className="t-h2 font-display font-bold">
              <span className="mr-3 text-ink-3">{i + 1}.</span>
              {b.baslik}
            </h2>
            {grupla(b.bloklar).map((g, j) =>
              g.duzey === 'temel' ? (
                g.bloklar.map((blok, k) => (
                  <div key={`${j}-${k}`} data-capa data-katman="temel" className="flex min-w-0 flex-col">
                    <BlokGoster blok={blok} />
                  </div>
                ))
              ) : (
                <div key={j} data-katman={g.duzey} className={`katman-${g.duzey} katman-grup duzey-renk-${g.duzey} scroll-mt-24`}>
                  <p className="katman-grup-baslik">
                    <DuzeyNoktalari d={g.duzey} />
                    <b>{KATMAN_ADI[g.duzey]}</b>
                    <span className="katman-grup-kitle">{DUZEY_KARTI[g.duzey].grupKitlesi}</span>
                  </p>
                  {g.bloklar.map((blok, k) => (
                    <div key={k} className="flex min-w-0 flex-col">
                      <BlokGoster blok={blok} />
                    </div>
                  ))}
                </div>
              ),
            )}
            <KatmanIpucu bolumId={b.id} lisans={sayi('lisans')} uzman={sayi('ileri')} />
          </section>
        );
      })}
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
      else if (k.tur === 'sayilar')
        kelime += k.ogeler
          .map((o) => o.aciklama)
          .join(' ')
          .split(/\s+/).length;
    }
  }
  return Math.max(5, Math.round(kelime / 170 + ek));
}

/** Hedefin metni ve katmanı. */
export function hedefBilgisi(h: string | { metin: string; duzey: Seviye }): {
  metin: string;
  duzey: Seviye;
} {
  return typeof h === 'string' ? { metin: h, duzey: 'temel' } : h;
}
