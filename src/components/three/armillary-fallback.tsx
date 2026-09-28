/** Halkalı kürenin statik çizimi: 3B sahne yüklenene kadar ve WebGL olmayan cihazlarda görünür. */
export function ArmillaryFallback() {
  const rings = [
    { rx: 162, ry: 162, rot: 0 },
    { rx: 147, ry: 46, rot: -8 },
    { rx: 132, ry: 58, rot: 23 },
    { rx: 117, ry: 70, rot: -52 },
    { rx: 102, ry: 64, rot: 38 },
  ];
  // Sunucu ve tarayıcıda trigonometrik sonuçların son basamağı farklı olabilir; yuvarlamak
  // hidrasyon uyuşmazlığını önler.
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const inner = 162 - (i % 6 === 0 ? 10 : 4.5);
    return { x1: r2(Math.cos(a) * inner), y1: r2(Math.sin(a) * inner), x2: r2(Math.cos(a) * 162), y2: r2(Math.sin(a) * 162) };
  });
  const p = 0.66;
  const px = r2(Math.cos(p) * 172);
  const py = r2(Math.sin(p) * 172);
  return (
    <svg viewBox="-200 -200 400 400" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="var(--ink)">
        {rings.map((r, i) => (
          <ellipse key={i} rx={r.rx} ry={r.ry} transform={`rotate(${r.rot})`} strokeWidth={1.1} opacity={i === 0 ? 1 : 0.8} />
        ))}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={1} opacity={0.55} />
        ))}
      </g>
      <line x1={-px} y1={py} x2={px} y2={-py} stroke="var(--brass)" strokeWidth={1.4} />
      <circle cx={px} cy={-py} r={5} fill="var(--marker)" />
      <circle r={16} fill="var(--brass)" />
    </svg>
  );
}
