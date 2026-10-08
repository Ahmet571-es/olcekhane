'use client';

import { useEffect, useRef, useState } from 'react';

/** Hareketi azaltmayı seçenlerde çizimler kendiliğinden oynamaz; adım adım ilerletilir. */
export function useHareketAzaltilmis(): boolean {
  const [azalt, setAzalt] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const guncelle = () => setAzalt(m.matches);
    guncelle();
    m.addEventListener('change', guncelle);
    return () => m.removeEventListener('change', guncelle);
  }, []);
  return azalt;
}

/** Öğe ekranda görünürken true (görünmeyen çizimler kare çizmesin diye). */
export function useGorunur<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [gorunur, setGorunur] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const g = new IntersectionObserver(([k]) => setGorunur(k.isIntersecting), { threshold: 0.15 });
    g.observe(el);
    return () => g.disconnect();
  }, []);
  return [ref, gorunur];
}

/** Bir yol üzerindeki noktayı 0–1 oranına göre verir. */
export function yolNoktasi(yol: SVGPathElement | null, oran: number): { x: number; y: number } {
  if (!yol) return { x: -100, y: -100 };
  const u = yol.getTotalLength();
  const p = yol.getPointAtLength(Math.max(0, Math.min(1, oran)) * u);
  return { x: p.x, y: p.y };
}

/** Sürekli zamanlayıcı: `oynuyor` iken her karede geçen süreyi (ms) bildirir. */
export function useKare(oynuyor: boolean, f: (gecen: number, toplam: number) => void) {
  const fRef = useRef(f);
  useEffect(() => {
    fRef.current = f;
  });
  useEffect(() => {
    if (!oynuyor) return;
    let id = 0;
    let once = performance.now();
    const bas = once;
    const kare = (t: number) => {
      fRef.current(t - once, t - bas);
      once = t;
      id = requestAnimationFrame(kare);
    };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, [oynuyor]);
}

export function Secenekler<T extends string>({
  secenekler,
  deger,
  onDegis,
  etiket,
}: {
  secenekler: { d: T; ad: string }[];
  deger: T;
  onDegis: (d: T) => void;
  etiket: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={etiket}>
      {secenekler.map((s) => (
        <button key={s.d} type="button" className="beyin-secenek" aria-pressed={deger === s.d} onClick={() => onDegis(s.d)}>
          {s.ad}
        </button>
      ))}
    </div>
  );
}
