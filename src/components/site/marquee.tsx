const WORDS = ['Kişilik', 'İlgi alanları', 'Öz-saygı', 'Okuma hızı', 'Matematik', 'Çalışma alışkanlıkları', 'Dikkat', 'Çalışma belleği'];
const DOTS = ['var(--dim-ext)', 'var(--dim-agr)', 'var(--dim-con)', 'var(--dim-emo)', 'var(--dim-int)'];

/** Ölçülen alanların adları yavaşça kayar; üzerine gelince durur. Hareketi azaltmayı seçenlerde durur. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <li key={w} className="flex items-center">
          <span className={`px-6 font-display text-[clamp(2rem,5.2vw,4.2rem)] font-bold leading-none tracking-[-0.03em] ${i % 2 ? 'serit-kontur' : ''}`} style={{ fontStretch: '84%' }}>
            {w}
          </span>
          <span className="size-3 rounded-full md:size-4" style={{ background: DOTS[i % DOTS.length] }} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="serit border-y border-rule py-7 md:py-9" role="region" aria-label="Ölçtüğümüz alanlar">
      <div className="serit-ray">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
