/**
 * Ölçekhane işareti: bir usturlap çeyreği. Derece çizgileri ölçümü, merkezden çıkan gösterge
 * ve ucundaki kırmızı nokta "sen buradasın" işaretini anlatır.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const ticks = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI * (i * 10 + 5)) / 180;
    const r1 = i % 3 === 0 ? 10.5 : 12;
    return {
      x1: r2(3 + Math.cos(a) * r1),
      y1: r2(29 - Math.sin(a) * r1),
      x2: r2(3 + Math.cos(a) * 14),
      y2: r2(29 - Math.sin(a) * 14),
    };
  });
  const p = (Math.PI * 38) / 180;
  const ex = r2(3 + Math.cos(p) * 21);
  const ey = r2(29 - Math.sin(p) * 21);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M3 29 L3 5 A24 24 0 0 1 27 29 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 13 A16 16 0 0 1 19 29" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      ))}
      <line x1="3" y1="29" x2={ex} y2={ey} stroke="var(--brass)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={ex} cy={ey} r="2.4" fill="var(--marker)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark size={30} />
      <span className="font-display text-[1.35rem] font-[750] tracking-[-0.02em]" style={{ fontStretch: '88%' }}>
        Ölçekhane
      </span>
    </span>
  );
}
