/**
 * Tuvalin yerine geçen kayıtçı (paylaşım kartı denetimleri: tests/paylasim.test.ts, tests/paket.test.ts): yazıların yerini ve
 * yaklaşık genişliğini (harf başına yazı boyunun 0,6'sı) tutar.
 */
export function fakeContext() {
  const texts: { text: string; left: number; right: number; size: number }[] = [];
  let size = 16;
  const ctx = {
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
    set font(f: string) {
      size = Number(/(\d+)px/.exec(f)![1]);
    },
    get font() {
      return `${size}px`;
    },
    measureText: (t: string) => ({ width: t.length * size * 0.6 }),
    fillText(t: string, x: number) {
      const w = t.length * size * 0.6;
      const left = this.textAlign === 'right' ? x - w : this.textAlign === 'center' ? x - w / 2 : x;
      texts.push({ text: t, left, right: left + w, size });
    },
    createRadialGradient: () => ({ addColorStop() {} }),
    save() {},
    restore() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    arcTo() {},
    fill() {},
    stroke() {},
    fillRect() {},
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, texts };
}
