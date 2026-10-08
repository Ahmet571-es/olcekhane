import { SEVIYE_ADLARI, type Seviye } from '@/content/beyin/types';

/**
 * Okuma düzeylerinin sayfadaki görünüşü: her düzeyin rengi (`--katman-*`, globals.css), üç noktalı simgesi
 * (●○○ Temel, ●●○ Lisans, ●●● Uzman) ve yeni gelenin anlayacağı kısa tanımı. Hem sunucu hem tarayıcı bileşenleri
 * kullanır; bu yüzden bu dosya "use client" değildir ve durum tutmaz.
 */
export const DUZEY_SIRASI: Seviye[] = ['temel', 'lisans', 'ileri'];

export const DUZEY_KARTI: Record<Seviye, { kim: string; kitle: string; icerik: string; grupKitlesi: string }> = {
  temel: {
    kim: 'Yeni başlıyorum',
    kitle: 'Meraklı herkes, lise ve sağlık lisesi öğrencisi',
    icerik: 'Sade anlatım, üç boyutlu sahneler ve hareketli çizimler.',
    grupKitlesi: 'herkes için',
  },
  lisans: {
    kim: 'Tıp, nörobilim ya da psikoloji okuyorum',
    kitle: 'Üniversite öğrencisi',
    icerik: 'Temel anlatıma ek olarak ayrıntılar, tablolar, hastalıklarla bağlantılar, klinik vakalar ve sınav notları.',
    grupKitlesi: 'tıp, nörobilim ve psikoloji öğrencisi için',
  },
  ileri: {
    kim: 'Hekim, beyin cerrahı ya da araştırmacıyım',
    kitle: 'Asistan hekim, uzman, akademisyen',
    icerik: 'Dersin tamamı; ayrıca beyin cerrahisinden ve güncel araştırmalardan bölümler, ileri vakalar.',
    grupKitlesi: 'hekim, beyin cerrahı ve araştırmacı için',
  },
};

/** Adresteki düzey adı (`?duzey=lisans`, `?duzey=uzman`); Temel için adreste bir şey yazmaz. */
export const DUZEY_ADRESI: Record<Seviye, string> = {
  temel: 'temel',
  lisans: 'lisans',
  ileri: 'uzman',
};

export function adrestenDuzey(deger: string | null | undefined): Seviye | null {
  const bul = DUZEY_SIRASI.find((d) => DUZEY_ADRESI[d] === deger);
  return bul ?? null;
}

/** Düzeyin üç noktalı simgesi; renk, içinde bulunduğu öğenin `--k` rengidir. */
export function DuzeyNoktalari({ d, className = '' }: { d: Seviye; className?: string }) {
  const dolu = DUZEY_SIRASI.indexOf(d) + 1;
  return (
    <span className={`duzey-noktalari ${className}`} aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= dolu ? 'dolu' : undefined} />
      ))}
    </span>
  );
}

/** Küçük düzey etiketi (hedeflerde ve sorularda): renkli noktalar ve düzeyin adı. */
export function DuzeyCipi({ d, className = '' }: { d: Seviye; className?: string }) {
  return (
    <span className={`duzey-cip duzey-renk-${d} ${className}`}>
      <DuzeyNoktalari d={d} />
      {SEVIYE_ADLARI[d]}
    </span>
  );
}

/** Beyin Akademisi ana sayfasında üç düzeyin kısa tanıtımı (ders sayfasındaki seçicinin aynısı, düğmesiz). */
export function DuzeyTanitimi() {
  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {DUZEY_SIRASI.map((d) => {
        const k = DUZEY_KARTI[d];
        return (
          <li key={d} className={`duzey-kart duzey-renk-${d}`}>
            <span className="duzey-kart-ad">
              <DuzeyNoktalari d={d} />
              {SEVIYE_ADLARI[d]}
            </span>
            <span className="font-display text-lg font-bold leading-snug">{k.kim}</span>
            <span className="t-small text-ink-2">{k.kitle}.</span>
            <span className="t-small">{k.icerik}</span>
          </li>
        );
      })}
    </ol>
  );
}
