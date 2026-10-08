'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { SEVIYE_ADLARI, type Seviye } from '@/content/beyin/types';
import { adrestenDuzey, DUZEY_ADRESI, DUZEY_KARTI, DUZEY_SIRASI, DuzeyNoktalari } from './duzey';

/**
 * Okuma düzeyi üç katmanlıdır: "Temel" yalnızca herkes için olan anlatımı, "Lisans" temel ve lisans katmanını (tıp,
 * nörobilim ve psikoloji öğrencisi), "Uzman" dersin tamamını gösterir (hekim, beyin cerrahı, araştırmacı). Hedefler
 * ve sorular da aynı düzeye göre süzülür.
 *
 * Yeni gelen için sayfa Temel ile açılır. Seçim hiçbir yere kaydedilmez: yalnızca sayfa açıkken geçerlidir ve
 * paylaşılabilsin diye adres çubuğuna yazılır (`?duzey=lisans`, `?duzey=uzman`); çerez ya da tarayıcı deposu yoktur.
 */
export type OkumaDuzeyi = Seviye;

const SIRA: Record<Seviye, number> = { temel: 0, lisans: 1, ileri: 2 };

/** Bu okuma düzeyinde bu katman görünür mü? */
export function gorunurMu(okuma: OkumaDuzeyi, katman: Seviye): boolean {
  return SIRA[katman] <= SIRA[okuma];
}

/** Düzey değişince sayfa nereye kaysın: okunan yer yerinde kalsın ya da bir bölümün yeni açılan kısmına gidilsin. */
type Secenek = { hedefBolum?: string };
type Baglam = {
  duzey: OkumaDuzeyi;
  setDuzey: (d: OkumaDuzeyi, s?: Secenek) => void;
};

const Baglam = createContext<Baglam>({ duzey: 'temel', setDuzey: () => {} });

export function useOkumaDuzeyi() {
  return useContext(Baglam);
}

function adresiDinle(f: () => void) {
  window.addEventListener('popstate', f);
  return () => window.removeEventListener('popstate', f);
}
const adrestekiDuzey = () => new URLSearchParams(window.location.search).get('duzey') ?? '';
const sunucuda = () => '';

/** Ekranın üstüne en yakın, her düzeyde görünen öğe (bölüm başlıkları ve temel anlatım); okunan yer korunsun diye. */
function capaBul(): { el: Element; ust: number } | null {
  let secilen: { el: Element; ust: number } | null = null;
  for (const el of document.querySelectorAll('[data-capa]')) {
    const r = el.getBoundingClientRect();
    if (r.height === 0) continue;
    if (r.top <= 140) secilen = { el, ust: r.top };
    else {
      secilen ??= { el, ust: r.top };
      break;
    }
  }
  return secilen;
}

export function OkumaDuzeyiSaglayici({ children, className = '' }: { children: ReactNode; className?: string }) {
  const adres = useSyncExternalStore(adresiDinle, adrestekiDuzey, sunucuda);
  const [secim, setSecim] = useState<OkumaDuzeyi | null>(null);
  const duzey = secim ?? adrestenDuzey(adres) ?? 'temel';
  const bekleyen = useRef<{
    capa: { el: Element; ust: number } | null;
    hedefBolum?: string;
    onceki: OkumaDuzeyi;
    duzey: OkumaDuzeyi;
  } | null>(null);

  const setDuzey = useCallback(
    (d: OkumaDuzeyi, s: Secenek = {}) => {
      if (d === duzey) return;
      bekleyen.current = {
        capa: s.hedefBolum ? null : capaBul(),
        hedefBolum: s.hedefBolum,
        onceki: duzey,
        duzey: d,
      };
      setSecim(d);
      const u = new URL(window.location.href);
      if (d === 'temel') u.searchParams.delete('duzey');
      else u.searchParams.set('duzey', DUZEY_ADRESI[d]);
      window.history.replaceState(window.history.state, '', u);
    },
    [duzey],
  );

  // Düzey değişince içerik uzar ya da kısalır: okunan yer kaymasın, ya da istenen bölümün yeni açılan kısmına gidilsin.
  useLayoutEffect(() => {
    const b = bekleyen.current;
    if (!b || b.duzey !== duzey) return;
    bekleyen.current = null;
    if (b.hedefBolum) {
      // Bölümde yeni açılan ilk kısım: önceki düzeyde gizli olan ilk katman grubu.
      const hedef = [...document.querySelectorAll(`#${CSS.escape(b.hedefBolum)} [data-katman]`)].find((el) => {
        const k = el.getAttribute('data-katman') as Seviye;
        return k in SIRA && SIRA[k] > SIRA[b.onceki] && el.getClientRects().length > 0;
      });
      if (hedef) {
        const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        hedef.scrollIntoView({
          block: 'start',
          behavior: azalt ? 'auto' : 'smooth',
        });
      }
    } else if (b.capa) {
      const fark = b.capa.el.getBoundingClientRect().top - b.capa.ust;
      if (Math.abs(fark) > 1) window.scrollBy(0, fark);
    }
  }, [duzey]);

  return (
    <Baglam.Provider value={{ duzey, setDuzey }}>
      <div data-duzey={duzey} className={className}>
        {children}
      </div>
    </Baglam.Provider>
  );
}

/** Dersin başındaki seçici: "Sen kimsin?" sorusu ve üç büyük kart. */
export function OkumaDuzeyiSecici({ sureler }: { sureler: Record<Seviye, number> }) {
  const { duzey, setDuzey } = useOkumaDuzeyi();
  return (
    <section id="duzey-secici" data-capa aria-labelledby="duzey-secici-baslik" className="duzey-secici flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 id="duzey-secici-baslik" className="font-display text-2xl font-bold leading-tight">
          Sen kimsin? Dersi sana göre açalım
        </h2>
        <p className="text-ink-2">Sana uyan kartı seç. Ders seçimine göre kısalır ya da derinleşir; istediğin an değiştirebilirsin.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="Okuma düzeyi">
        {DUZEY_SIRASI.map((d) => {
          const k = DUZEY_KARTI[d];
          const secili = duzey === d;
          return (
            <button key={d} type="button" className={`duzey-kart duzey-renk-${d}`} aria-pressed={secili} onClick={() => setDuzey(d)}>
              <span className="flex items-center justify-between gap-3">
                <span className="duzey-kart-ad">
                  <DuzeyNoktalari d={d} />
                  {SEVIYE_ADLARI[d]}
                </span>
                <span className="t-meta whitespace-nowrap">{sureler[d]} dk</span>
              </span>
              <span className="font-display text-lg font-bold leading-snug">{k.kim}</span>
              <span className="t-small text-ink-2">{k.kitle}.</span>
              <span className="t-small">{k.icerik}</span>
              {secili && <span className="duzey-kart-durum">✓ Şu an bu düzeydesin</span>}
            </button>
          );
        })}
      </div>
      <div className="duzey-aciklama t-small flex flex-col gap-1.5 text-ink-2">
        <p>
          <b className="text-ink">Nasıl okunur?</b> Kenarında çizgi olmayan anlatım herkes içindir.{' '}
          <span className="duzey-ornek duzey-renk-lisans">Mavi çizgili</span> bölümler Lisans,{' '}
          <span className="duzey-ornek duzey-renk-ileri">mor çizgili</span> bölümler Uzman düzeyidir ve yalnızca o düzeyi seçince görünür.
        </p>
        <p className="t-meta">Seçimin hiçbir yere kaydedilmez. Aşağı indikçe ekranın altında küçük bir düzey düğmesi kalır.</p>
      </div>
    </section>
  );
}

/** Okurken ekranın altında kalan küçük düzey şeridi; baştaki seçici görünürken gizlenir. */
export function DuzeySeridi() {
  const { duzey, setDuzey } = useOkumaDuzeyi();
  const [goster, setGoster] = useState(false);
  useEffect(() => {
    const secici = document.getElementById('duzey-secici');
    if (!secici) return;
    // Kaydırma dinlenir (yalnızca kesişme gözlenseydi, bağlantıyla doğrudan aşağı atlayınca şerit görünmezdi).
    let kare = 0;
    const bak = () => {
      kare = 0;
      // Baştaki kartlar geçilince görünür; sayfanın sonundaki alt bilgiye gelince çekilir.
      const alt = document.querySelector('body footer');
      setGoster(secici.getBoundingClientRect().bottom < 0 && (!alt || alt.getBoundingClientRect().top > window.innerHeight - 80));
    };
    const kaydi = () => {
      if (!kare) kare = requestAnimationFrame(bak);
    };
    window.addEventListener('scroll', kaydi, { passive: true });
    window.addEventListener('resize', kaydi);
    kaydi();
    return () => {
      window.removeEventListener('scroll', kaydi);
      window.removeEventListener('resize', kaydi);
      cancelAnimationFrame(kare);
    };
  }, []);
  return (
    <div className="duzey-seridi" data-acik={goster ? '1' : '0'} inert={!goster} role="group" aria-label="Okuma düzeyini değiştir">
      <span className="duzey-seridi-ad">Düzey</span>
      {DUZEY_SIRASI.map((d) => (
        <button
          key={d}
          type="button"
          className={`duzey-seridi-dugme duzey-renk-${d}`}
          aria-pressed={duzey === d}
          onClick={() => setDuzey(d)}
        >
          <DuzeyNoktalari d={d} />
          {SEVIYE_ADLARI[d]}
        </button>
      ))}
    </div>
  );
}

/** Bir konunun sonunda, seçili düzeyde gizli kalan kısımları haber verir ve tek dokunuşla açar. */
export function KatmanIpucu({ bolumId, lisans, uzman }: { bolumId: string; lisans: number; uzman: number }) {
  const { duzey, setDuzey } = useOkumaDuzeyi();
  if (duzey === 'ileri') return null;
  const gizliLisans = duzey === 'temel' ? lisans : 0;
  if (gizliLisans + uzman === 0) return null;
  const parcalar = [
    gizliLisans > 0 ? `Lisans düzeyinde ${gizliLisans} parça` : null,
    uzman > 0 ? `Uzman düzeyinde ${uzman} parça` : null,
  ].filter(Boolean);
  return (
    <aside className="katman-ipucu flex flex-col gap-2.5" aria-label="Bu konunun devamı">
      <p>
        <b>Bu konunun devamı var:</b> {parcalar.join(', ')} daha.
      </p>
      <div className="flex flex-wrap gap-2">
        {gizliLisans > 0 && (
          <button
            type="button"
            className="duzey-seridi-dugme duzey-renk-lisans"
            onClick={() => setDuzey('lisans', { hedefBolum: bolumId })}
          >
            <DuzeyNoktalari d="lisans" />
            Lisans düzeyini aç
          </button>
        )}
        {uzman > 0 && (
          <button type="button" className="duzey-seridi-dugme duzey-renk-ileri" onClick={() => setDuzey('ileri', { hedefBolum: bolumId })}>
            <DuzeyNoktalari d="ileri" />
            Uzman düzeyini aç
          </button>
        )}
      </div>
    </aside>
  );
}
