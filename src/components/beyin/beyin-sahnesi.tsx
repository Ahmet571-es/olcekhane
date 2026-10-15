'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { noktaById } from '@/content/beyin/noktalar';
import type { Bakis, KesitDuzlemi, Sahne, SahneAraci } from '@/content/beyin/types';
import { BOLGE_ADLARI, KATMAN_ADLARI, LOB_ADLARI, type Katman, type Yapi, yapiAdi, yapiById } from '@/content/beyin/yapilar';
import type { BeyinMotoru } from './motor';
import { birakildi, gorunurlukBildir, mesgulBildir, sahiplen, sahipMi, yeniNo } from './paylasim';
import { sahneRengi } from './renkler';
import { oneCikanlar, sahnedekiYapilar } from './secici';

/**
 * Üç boyutlu beyin sahnesi. Sayfadaki bütün sahneler tek çiziciyi paylaşır (bkz. paylasim.ts): ekranda en çok görünen
 * sahne canlıdır; ötekilerde son görüntü durur ve dokununca canlanır. Alttaki araçlarla bakış açısı, katmanlar, kesit
 * ve parçalara ayırma değiştirilir; bir yapıya dokununca adı, Latince adı ve görevi açılır.
 */

const BAKISLAR: { b: Bakis; ad: string }[] = [
  { b: 'sol', ad: 'Soldan' },
  { b: 'sag', ad: 'Sağdan' },
  { b: 'on', ad: 'Önden' },
  { b: 'arka', ad: 'Arkadan' },
  { b: 'ust', ad: 'Üstten' },
  { b: 'alt', ad: 'Alttan' },
];

const DUZLEMLER: { d: KesitDuzlemi; ad: string; aciklama: string }[] = [
  { d: 'sagital', ad: 'Sagital', aciklama: 'sağ ve sol diye ayırır' },
  { d: 'koronal', ad: 'Koronal', aciklama: 'ön ve arka diye ayırır' },
  { d: 'aksiyel', ad: 'Aksiyel', aciklama: 'üst ve alt diye ayırır' },
];

const KATMAN_SIRASI: Katman[] = ['kabuk', 'beyaz', 'derin', 'sap', 'karincik', 'zar', 'damar', 'kemik', 'yuz', 'omurga'];

type Panel = 'bakis' | 'katman' | 'kesit' | 'ayristir' | 'renk' | 'liste';

const PANEL_ADI: Record<Panel, string> = {
  bakis: 'Bakış',
  katman: 'Katmanlar',
  kesit: 'Kesit',
  ayristir: 'Ayır',
  renk: 'Renkler',
  liste: 'Yapılar',
};

const RENKLER: { r: NonNullable<Sahne['renk']>; ad: string }[] = [
  { r: 'lob', ad: 'Loblara göre' },
  { r: 'bolge', ad: 'Bölgelere göre' },
  { r: 'yapi', ad: 'Her yapı ayrı' },
  { r: 'dogal', ad: 'Gerçeğe yakın' },
];

const ARAC_PANELI: Partial<Record<SahneAraci, Panel>> = {
  bakis: 'bakis',
  katman: 'katman',
  kesit: 'kesit',
  ayristir: 'ayristir',
  renk: 'renk',
  liste: 'liste',
};

type Durum = 'bos' | 'yukleniyor' | 'etkin' | 'pasif' | 'hata';

/** 768 piksel ve üstünde bilgi kartı sahnenin üstünde, daha dar ekranlarda sahnenin altında durur. */
function useGenisEkran(): boolean {
  const [genis, setGenis] = useState(true);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    const guncelle = () => setGenis(m.matches);
    guncelle();
    m.addEventListener('change', guncelle);
    return () => m.removeEventListener('change', guncelle);
  }, []);
  return genis;
}

export function BeyinSahnesi({
  sahne,
  baslik,
  aciklama,
  araclar = ['bakis', 'liste'],
  buyuk = false,
  basliksiz = false,
}: {
  sahne: Sahne;
  baslik?: string;
  aciklama?: string;
  araclar?: SahneAraci[];
  buyuk?: boolean;
  /** Başlık ve açıklama sayfada başka yerde yazıyorsa. */
  basliksiz?: boolean;
}) {
  const no = useMemo(() => yeniNo(), []);
  const kimlik = useId();
  const sahneRef = useRef<HTMLDivElement>(null);
  const kapRef = useRef<HTMLDivElement>(null);
  const motorRef = useRef<BeyinMotoru | null>(null);
  const [durum, setDurum] = useState<Durum>('bos');
  const [ilerleme, setIlerleme] = useState(0);
  const [resim, setResim] = useState<string | null>(null);
  const [secili, setSecili] = useState<string | null>(null);
  const [yalniz, setYalniz] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [tamEkran, setTamEkran] = useState(false);
  /** İlk dokunuştan sonra "nasıl döndürülür" ipucu kalkar. */
  const [dokunuldu, setDokunuldu] = useState(false);
  const [bakis, setBakis] = useState<Bakis>(sahne.bakis ?? 'sol');
  const [katmanlar, setKatmanlar] = useState<Katman[]>(sahne.katmanlar);
  const [kesitAcik, setKesitAcik] = useState(Boolean(sahne.kesit));
  const [duzlem, setDuzlem] = useState<KesitDuzlemi>(sahne.kesit?.duzlem ?? 'koronal');
  const [konum, setKonum] = useState(sahne.kesit?.konum ?? 0);
  const [ayristir, setAyristir] = useState(sahne.ayristir ?? 0);
  const [yarim, setYarim] = useState<Sahne['yarim']>(sahne.yarim);
  const [etiket, setEtiket] = useState(true);
  const [renk, setRenk] = useState<NonNullable<Sahne['renk']>>(sahne.renk ?? 'lob');
  const [ilkKez, setIlkKez] = useState(true);
  const genis = useGenisEkran();

  const etkinAyar = useMemo<Sahne>(
    () => ({
      ...sahne,
      renk,
      katmanlar,
      yarim,
      kesit: kesitAcik ? { duzlem, konum } : undefined,
      ayristir,
      bakis,
      donme: sahne.donme && ilkKez,
    }),
    [sahne, renk, katmanlar, yarim, kesitAcik, duzlem, konum, ayristir, bakis, ilkKez],
  );
  const ayarRef = useRef(etkinAyar);
  useEffect(() => {
    ayarRef.current = etkinAyar;
  }, [etkinAyar]);

  const etkinlestir = useCallback(async () => {
    const kap = kapRef.current;
    if (!kap) return;
    if (sahipMi(no) && motorRef.current) return;
    setDurum((d) => (d === 'pasif' ? 'pasif' : 'yukleniyor'));
    try {
      const m = await sahiplen(no, kap, (r) => {
        if (r) setResim(r);
        setDurum('pasif');
        setPanel(null);
        motorRef.current = null;
      });
      motorRef.current = m;
      m.onSecim((id) => setSecili(id));
      await m.uygula(ayarRef.current, { anlik: true, ilerleme: setIlerleme });
      if (!sahipMi(no)) return;
      m.etiketAyarla(true);
      setEtiket(true);
      setSecili(null);
      setYalniz(null);
      setDurum('etkin');
      setIlkKez(false);
    } catch {
      setDurum('hata');
    }
  }, [no]);

  useEffect(() => {
    const el = sahneRef.current;
    if (!el) return;
    const g = new IntersectionObserver(
      (kayitlar) => {
        for (const k of kayitlar) gorunurlukBildir(no, k.isIntersecting ? k.intersectionRatio : 0, () => void etkinlestir());
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] },
    );
    g.observe(el);
    return () => {
      g.disconnect();
      if (sahipMi(no)) motorRef.current?.ayril();
      birakildi(no);
    };
  }, [no, etkinlestir]);

  // Araç paneli açıkken kullanıcı bu sahneyle uğraşıyordur: çizici başka kutuya kolay kolay geçmesin.
  useEffect(() => {
    mesgulBildir(no, panel !== null);
  }, [no, panel]);

  // Tam ekranda sayfa kaymasın; Esc ile çıkılır.
  useEffect(() => {
    if (!tamEkran) return;
    const once = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const tus = (e: KeyboardEvent) => e.key === 'Escape' && setTamEkran(false);
    window.addEventListener('keydown', tus);
    return () => {
      document.documentElement.style.overflow = once;
      window.removeEventListener('keydown', tus);
    };
  }, [tamEkran]);

  const motor = () => (sahipMi(no) ? motorRef.current : null);

  const bakisSec = (b: Bakis) => {
    setBakis(b);
    motor()?.bakisaGit(b);
  };
  const katmanDegis = (k: Katman, acik: boolean) => {
    const yeni = acik ? [...new Set([...katmanlar, k])] : katmanlar.filter((x) => x !== k);
    setKatmanlar(yeni);
    void motor()?.katmanAyarla(k, acik);
  };
  const kesitDegis = (acik: boolean, d = duzlem, c = konum) => {
    setKesitAcik(acik);
    setDuzlem(d);
    setKonum(c);
    const m = motor();
    if (!m) return;
    if (acik) m.kesitAyarla(d, c);
    else m.kesitKaldir();
  };
  const ayristirDegis = (x: number) => {
    setAyristir(x);
    motor()?.ayristirAyarla(x);
  };
  const yarimDegis = (y: Sahne['yarim']) => {
    setYarim(y);
    const m = motor();
    if (!m) return;
    m.yarimAyarla(y);
    const b: Bakis = y === 'sol' ? 'ic-sol' : y === 'sag' ? 'ic-sag' : 'sol';
    setBakis(b);
    m.bakisaGit(b);
  };
  const sifirla = () => {
    setBakis(sahne.bakis ?? 'sol');
    setKatmanlar(sahne.katmanlar);
    setKesitAcik(Boolean(sahne.kesit));
    setDuzlem(sahne.kesit?.duzlem ?? 'koronal');
    setKonum(sahne.kesit?.konum ?? 0);
    setAyristir(sahne.ayristir ?? 0);
    setYarim(sahne.yarim);
    setRenk(sahne.renk ?? 'lob');
    setSecili(null);
    setYalniz(null);
    const m = motor();
    m?.sec(null);
    void m?.uygula({ ...sahne, donme: false });
  };
  const yapiSec = (id: string | null) => {
    setSecili(id);
    motor()?.sec(id);
  };
  const yalnizDegis = (id: string | null) => {
    setYalniz(id);
    void motor()?.yalnizGoster(id, { ...etkinAyar, donme: false });
  };

  const yapilar = useMemo(() => sahnedekiYapilar(etkinAyar), [etkinAyar]);
  const listedekiler = useMemo(() => {
    const one = oneCikanlar(etkinAyar);
    const gruplar = new Map<string, Yapi[]>();
    for (const y of one) {
      const g = y.lob && y.katman === 'kabuk' ? LOB_ADLARI[y.lob] : BOLGE_ADLARI[y.bolge];
      gruplar.set(g, [...(gruplar.get(g) ?? []), y]);
    }
    return [...gruplar];
  }, [etkinAyar]);
  const isaretler = useMemo(
    () =>
      (sahne.noktalar ?? []).flatMap((e) => {
        const p = noktaById(e.nokta);
        const y = p && yapiById(p.yapi);
        return p && y ? [{ id: p.id, metin: e.metin ?? p.ad, latince: p.latince, kemik: yapiAdi(y) }] : [];
      }),
    [sahne.noktalar],
  );
  const seciliYapi = secili ? yapiById(secili) : undefined;
  const paneller = [...new Set(araclar.map((a) => ARAC_PANELI[a]).filter((p): p is Panel => Boolean(p)))];
  const yukleniyor = durum === 'yukleniyor' || durum === 'bos';
  const bilgiKarti = seciliYapi ? (
    <div className={`beyin-bilgi ${genis ? 'beyin-bilgi-ust' : 'beyin-bilgi-alt'}`} role="dialog" aria-label={yapiAdi(seciliYapi)}>
      <div className="flex items-start gap-3">
        <span className="mt-1.5 size-3 shrink-0 rounded-full" style={{ background: sahneRengi(seciliYapi, etkinAyar) }} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">{yapiAdi(seciliYapi)}</p>
          <p className="t-small text-[var(--beyin-soluk)]">
            {seciliYapi.sade ? `${seciliYapi.sade} · ` : ''}
            <i lang="la">{seciliYapi.latince}</i>
          </p>
        </div>
        <button type="button" className="beyin-kapat" onClick={() => yapiSec(null)} aria-label="Kapat">
          ×
        </button>
      </div>
      <p className="mt-2 text-[0.95rem] leading-relaxed">{seciliYapi.gorev}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="beyin-cip">{seciliYapi.lob && seciliYapi.katman === 'kabuk' ? LOB_ADLARI[seciliYapi.lob] : BOLGE_ADLARI[seciliYapi.bolge]}</span>
        <button type="button" className="beyin-cip beyin-cip-dugme" onClick={() => yalnizDegis(yalniz ? null : seciliYapi.id)}>
          {yalniz ? 'Bütün sahneye dön' : 'Yalnız bunu göster'}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <figure
      ref={sahneRef}
      className={`beyin-figur ${tamEkran ? 'beyin-tam-ekran' : ''}`}
      aria-labelledby={baslik && !basliksiz ? `${kimlik}-b` : undefined}
    >
      {baslik && !basliksiz && (
        <div className="flex flex-col gap-1 px-1 pb-3">
          <p className="kicker">Üç boyutlu sahne</p>
          <h3 id={`${kimlik}-b`} className="font-display text-xl font-bold leading-tight">
            {baslik}
          </h3>
        </div>
      )}
      <div className={`beyin-sahne ${buyuk ? 'beyin-sahne-buyuk' : ''}`} onPointerDown={() => setDokunuldu(true)}>
        <div ref={kapRef} className="absolute inset-0" />
        {durum === 'pasif' && (
          <button type="button" className="beyin-pasif" onClick={() => void etkinlestir()} aria-label="Bu sahneyi canlandır">
            {resim && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resim} alt="" className="absolute inset-0 size-full object-contain" />
            )}
            <span className="beyin-pasif-etiket">Dokun, döndür</span>
          </button>
        )}
        {yukleniyor && (
          <div className="beyin-yukleme" role="status">
            <div className="beyin-yukleme-halka" aria-hidden="true" />
            <p>{durum === 'bos' ? 'Üç boyutlu beyin hazırlanıyor' : `Beyin modeli yükleniyor · %${Math.round(ilerleme * 100)}`}</p>
            <div className="beyin-yukleme-cubuk" aria-hidden="true">
              <span style={{ width: `${Math.round(ilerleme * 100)}%` }} />
            </div>
          </div>
        )}
        {durum === 'hata' && (
          <div className="beyin-yukleme" role="status">
            <p className="max-w-sm text-center">
              Bu cihazda üç boyutlu çizim açılamadı. Sahnedeki yapıları aşağıdaki listeden okuyabilirsiniz.
            </p>
          </div>
        )}

        {durum === 'etkin' && (
          <div className="beyin-ust-araclar">
            {(sahne.etiketler?.length ?? 0) + (sahne.noktalar?.length ?? 0) > 0 && (
              <button
                type="button"
                className="beyin-yuvarlak"
                aria-pressed={etiket}
                onClick={() => {
                  setEtiket(!etiket);
                  motor()?.etiketAyarla(!etiket);
                }}
                title={etiket ? 'Etiketleri gizle' : 'Etiketleri göster'}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 7h10l4 5-4 5H4z" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{etiket ? 'Etiketleri gizle' : 'Etiketleri göster'}</span>
              </button>
            )}
            <button type="button" className="beyin-yuvarlak" onClick={sifirla} title="Başa döndür">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
              </svg>
              <span className="sr-only">Başa döndür</span>
            </button>
            <button type="button" className="beyin-yuvarlak" onClick={() => setTamEkran(!tamEkran)} aria-pressed={tamEkran} title={tamEkran ? 'Tam ekrandan çık' : 'Tam ekran'}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {tamEkran ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
              </svg>
              <span className="sr-only">{tamEkran ? 'Tam ekrandan çık' : 'Tam ekran'}</span>
            </button>
          </div>
        )}

        {durum === 'etkin' && !dokunuldu && !seciliYapi && (
          <p className="beyin-dokunma-ipucu" aria-hidden="true">
            <span className="ipucu-dokunmatik">☝ Parmağınla döndür</span>
            <span className="ipucu-fare">Sürükle: döndür · tekerlek: yakınlaştır</span>
          </p>
        )}

        {seciliYapi && durum === 'etkin' && genis && bilgiKarti}
      </div>

      {seciliYapi && durum === 'etkin' && !genis && bilgiKarti}

      {paneller.length > 0 && (
        <div className="beyin-arac-cubugu">
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Sahne araçları">
            {paneller.map((p) => (
              <button
                key={p}
                type="button"
                className="beyin-arac"
                aria-expanded={panel === p}
                aria-controls={`${kimlik}-${p}`}
                onClick={() => {
                  setPanel(panel === p ? null : p);
                  if (durum === 'pasif') void etkinlestir();
                }}
              >
                {PANEL_ADI[p]}
              </button>
            ))}
            {araclar.includes('yarim') && (
              <button
                type="button"
                className="beyin-arac"
                aria-pressed={Boolean(yarim)}
                onClick={() => {
                  if (durum === 'pasif') void etkinlestir();
                  yarimDegis(yarim ? undefined : 'sol');
                }}
              >
                {yarim ? 'İki yarımküre' : 'İç yüzü göster'}
              </button>
            )}
          </div>

          {panel === 'bakis' && (
            <div id={`${kimlik}-bakis`} className="beyin-panel">
              <p className="t-small text-ink-2">Beyne hangi yönden bakılsın? Parmağınla ya da fareyle de döndürebilirsin.</p>
              <div className="flex flex-wrap gap-2">
                {BAKISLAR.map(({ b, ad }) => (
                  <button key={b} type="button" className="beyin-secenek" aria-pressed={bakis === b} onClick={() => bakisSec(b)}>
                    {ad}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === 'katman' && (
            <div id={`${kimlik}-katman`} className="beyin-panel">
              <p className="t-small text-ink-2">Katmanları açıp kapatarak içeriye bak.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {KATMAN_SIRASI.map((k) => (
                  <label key={k} className="beyin-onay">
                    <input type="checkbox" checked={katmanlar.includes(k)} onChange={(e) => katmanDegis(k, e.target.checked)} />
                    <span>{KATMAN_ADLARI[k]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {panel === 'kesit' && (
            <div id={`${kimlik}-kesit`} className="beyin-panel">
              {/* Telefonda sahne ile kaydırıcı aynı ekrana sığsın diye panel kısa tutulur. */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="beyin-onay">
                  <input type="checkbox" checked={kesitAcik} onChange={(e) => kesitDegis(e.target.checked)} />
                  <span>Kes</span>
                </label>
                {DUZLEMLER.map(({ d, ad, aciklama: a }) => (
                  <button key={d} type="button" className="beyin-secenek" aria-pressed={kesitAcik && duzlem === d} onClick={() => kesitDegis(true, d, konum)} title={a}>
                    {ad}
                  </button>
                ))}
              </div>
              <label className="flex flex-col gap-1">
                <span className="t-small text-ink-2" aria-live="polite">
                  {kesitAcik
                    ? `${DUZLEMLER.find((x) => x.d === duzlem)?.ad} kesit ${DUZLEMLER.find((x) => x.d === duzlem)?.aciklama}. Kaydırarak kesitin yerini değiştir.`
                    : 'Bir düzlem seç; sonra kaydırarak kesitin yerini değiştir.'}
                </span>
                <input
                  type="range"
                  min={-0.95}
                  max={0.95}
                  step={0.01}
                  value={konum}
                  disabled={!kesitAcik}
                  onChange={(e) => kesitDegis(true, duzlem, Number(e.target.value))}
                  className="beyin-kaydirac"
                />
              </label>
            </div>
          )}

          {panel === 'ayristir' && (
            <div id={`${kimlik}-ayristir`} className="beyin-panel">
              <label className="flex flex-col gap-1">
                <span className="t-small text-ink-2">Parçaları birbirinden uzaklaştır: aralarındaki yapılar görünür.</span>
                <input type="range" min={0} max={1} step={0.01} value={ayristir} onChange={(e) => ayristirDegis(Number(e.target.value))} className="beyin-kaydirac" />
              </label>
            </div>
          )}

          {panel === 'renk' && (
            <div id={`${kimlik}-renk`} className="beyin-panel">
              <p className="t-small text-ink-2">Renkler yapıları tanıtır; iyi ya da kötü anlamı taşımaz.</p>
              <div className="flex flex-wrap gap-2">
                {RENKLER.map(({ r, ad }) => (
                  <button
                    key={r}
                    type="button"
                    className="beyin-secenek"
                    aria-pressed={renk === r}
                    onClick={() => {
                      setRenk(r);
                      motor()?.renkAyarla(r);
                    }}
                  >
                    {ad}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === 'liste' && (
            <div id={`${kimlik}-liste`} className="beyin-panel">
              <p className="t-small text-ink-2">Bir yapıya dokun: sahnede parlar ve bilgisi açılır.</p>
              <div className="flex flex-col gap-3">
                {listedekiler.map(([grup, ys]) => (
                  <div key={grup} className="flex flex-col gap-1.5">
                    <p className="t-small font-bold">{grup}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ys.map((y) => (
                        <button key={y.id} type="button" className="beyin-secenek" aria-pressed={secili === y.id} onClick={() => yapiSec(secili === y.id ? null : y.id)}>
                          <span className="inline-block size-2.5 rounded-full" style={{ background: sahneRengi(y, etkinAyar) }} aria-hidden="true" /> {yapiAdi(y)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {aciklama && !basliksiz && <figcaption className="t-small px-1 pt-3 text-ink-2">{aciklama}</figcaption>}
      <div className="sr-only">
        <p>Bu sahnedeki yapılar:</p>
        <ul>
          {yapilar.map((y) => (
            <li key={y.id}>
              {yapiAdi(y)}: {y.gorev}
            </li>
          ))}
        </ul>
        {isaretler.length > 0 && (
          <>
            <p>Sahnede işaretli noktalar:</p>
            <ul>
              {isaretler.map((p) => (
                <li key={p.id}>
                  {p.metin} (<i lang="la">{p.latince}</i>), {p.kemik}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {durum === 'hata' && (
        <ul className="mt-3 flex flex-col gap-2 px-1">
          {oneCikanlar(etkinAyar).map((y) => (
            <li key={y.id}>
              <b>{yapiAdi(y)}</b> (<i lang="la">{y.latince}</i>): {y.gorev}
            </li>
          ))}
          {isaretler.map((p) => (
            <li key={p.id}>
              <b>{p.metin}</b> (<i lang="la">{p.latince}</i>), {p.kemik}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
