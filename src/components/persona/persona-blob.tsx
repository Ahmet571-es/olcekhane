'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { TRAITS, shapeParams, type ShapeParams, type Traits } from '@/lib/persona-shape';
import { icosphere } from './icosphere';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';

/**
 * Canlı kişilik şekli: beş boyutun değerine göre biçim ve renk değiştiren üç boyutlu form.
 * Doğrudan WebGL ile çizilir; hiçbir kütüphane, model, doku ya da yazı tipi yüklenmez. Ekranda
 * görünmediğinde çizim durur; hareketi azaltmayı seçenlerde şekil kendiliğinden hareket etmez ve
 * imleci izlemez, yalnızca kaydırıcılar değişince yeniden çizilir.
 */

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

const FOV = 38;
const CAMERA_Z = 3.6;
const SCALE = 0.74;
const MAX_DPR = 1.75;

// --- Küçük matris yardımcıları (sütun öncelikli, WebGL'in beklediği düzen) ---

function perspective(fovDeg: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

/** R = Rx(ax) · Ry(ay), satır öncelikli 3×3. */
function rotationXY(ax: number, ay: number): number[] {
  const a = Math.cos(ax);
  const b = Math.sin(ax);
  const c = Math.cos(ay);
  const d = Math.sin(ay);
  return [c, 0, d, b * d, a, -b * c, -a * d, b, a * c];
}

// --- Renkler: CSS değişkenlerindeki tayf renkleri doğrusal RGB'ye çevrilir ---

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function readColors(): Float32Array {
  const style = getComputedStyle(document.documentElement);
  const ctx = document.createElement('canvas').getContext('2d');
  const out = new Float32Array(TRAITS.length * 3);
  TRAITS.forEach((t, i) => {
    let hex = '#8a8f99';
    if (ctx) {
      // Tarayıcı her renk yazımını #rrggbb biçimine çevirir.
      ctx.fillStyle = hex;
      ctx.fillStyle = style.getPropertyValue(t.cssVar).trim() || hex;
      if (/^#[0-9a-f]{6}$/i.test(ctx.fillStyle)) hex = ctx.fillStyle;
    }
    for (let k = 0; k < 3; k++) out[i * 3 + k] = srgbToLinear(parseInt(hex.slice(1 + k * 2, 3 + k * 2), 16) / 255);
  });
  return out;
}

// --- WebGL kurulumu ---

interface Scene {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  count: number;
  indexType: number;
  u: Record<string, WebGLUniformLocation | null>;
  /** Sahneden çıkarken GPU belleğini boşaltır. */
  dispose: () => void;
}

const UNIFORMS = [
  'modelViewMatrix',
  'projectionMatrix',
  'normalMatrix',
  'uTime',
  'uAmp',
  'uFreq',
  'uSym',
  'uJitter',
  'uDetail',
  'uPointer',
  'uPointerAmt',
  'uColors',
  'uWeights',
  'uDark',
];

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
  }
  return shader;
}

function createScene(canvas: HTMLCanvasElement, detail: number): Scene | null {
  const attrs: WebGLContextAttributes = { antialias: true, alpha: true, premultipliedAlpha: true, depth: true, powerPreference: 'default' };
  const gl = (canvas.getContext('webgl2', attrs) ?? canvas.getContext('webgl', attrs)) as WebGLRenderingContext | WebGL2RenderingContext | null;
  if (!gl) return null;

  const program = gl.createProgram();
  if (!program) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(gl.getProgramInfoLog(program) ?? 'program');
  gl.useProgram(program);

  const mesh = icosphere(detail);
  let indexType: number = gl.UNSIGNED_SHORT;
  if (mesh.indices instanceof Uint32Array) {
    // WebGL 1'de 32 bitlik sıralar için eklenti gerekir (ağ normalde bu sınırın altında kalır).
    const webgl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    if (!webgl2 && !gl.getExtension('OES_element_index_uint')) return null;
    indexType = gl.UNSIGNED_INT;
  }
  const position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);

  const index = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

  const u: Record<string, WebGLUniformLocation | null> = {};
  for (const name of UNIFORMS) u[name] = gl.getUniformLocation(program, name);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  gl.uniformMatrix4fv(u.projectionMatrix, false, perspective(FOV, 1, 0.1, 20));
  const dispose = () => {
    gl.deleteBuffer(position);
    gl.deleteBuffer(index);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
  return { gl, count: mesh.indices.length, indexType, u, dispose };
}

export default function PersonaBlob({
  traits,
  pointer,
  onReady,
  onLost,
}: {
  traits: Traits;
  pointer: RefObject<PointerState>;
  onReady?: () => void;
  onLost?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traitsRef = useRef<Traits>(traits);
  const requestDraw = useRef<() => void>(() => {});
  const callbacks = useRef({ onReady, onLost });

  useEffect(() => {
    callbacks.current = { onReady, onLost };
  }, [onReady, onLost]);

  useEffect(() => {
    traitsRef.current = traits;
    requestDraw.current();
  }, [traits]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = wrap.current;
    if (!canvas || !box) return;

    const detail = window.innerWidth < 768 ? 40 : 64;
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
    let reduced = reducedMq.matches;
    let visible = true;
    let scene: Scene | null = null;
    let colors = readColors();
    let raf = 0;
    let last = 0;
    let readySent = false;

    // Canlandırma durumu
    const start = shapeParams(traitsRef.current);
    const cur: ShapeParams = { ...start };
    const weights = [...traitsRef.current];
    let clock = 0;
    let spin = 0.5;
    let tiltX = -0.18;
    let tiltY = 0;
    let pointerAmt = 0;

    const init = () => {
      try {
        scene = createScene(canvas, detail);
      } catch {
        scene = null;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(box.clientWidth * dpr));
      const h = Math.max(1, Math.round(box.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const render = (dt: number, animate: boolean) => {
      if (!scene || scene.gl.isContextLost()) return;
      const { gl, u } = scene;
      const target = shapeParams(traitsRef.current);
      const k = reduced ? 1 : 1 - Math.exp(-dt * 4);
      (Object.keys(target) as (keyof ShapeParams)[]).forEach((key) => {
        cur[key] += (target[key] - cur[key]) * k;
      });
      for (let i = 0; i < 5; i++) weights[i] += (traitsRef.current[i] - weights[i]) * k;

      const p = pointer.current;
      const follow = p.active && !reduced;
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
      if (animate) {
        clock += dt * cur.speed;
        spin += dt * 0.14;
      }
      tiltX += ((follow ? p.y * 0.35 : 0) - 0.18 - tiltX) * ease;
      tiltY += ((follow ? p.x * 0.55 : 0) - tiltY) * ease;
      pointerAmt += ((follow ? 1 : 0) - pointerAmt) * ease;

      const r = rotationXY(tiltX, spin + tiltY);
      // modelView = öteleme(0, 0, −z) · R · ölçek (sütun öncelikli)
      const mv = new Float32Array([
        r[0] * SCALE, r[3] * SCALE, r[6] * SCALE, 0,
        r[1] * SCALE, r[4] * SCALE, r[7] * SCALE, 0,
        r[2] * SCALE, r[5] * SCALE, r[8] * SCALE, 0,
        0, 0, -CAMERA_Z, 1,
      ]);
      const normal = new Float32Array([r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]]);
      // İmlecin yönü, şeklin kendi eksenlerine çevrilir (R⁻¹ = Rᵀ).
      const ax = p.x * 1.1;
      const ay = p.y * 1.1;
      const inv = 1 / Math.hypot(ax, ay, 1);
      const px = ax * inv;
      const py = ay * inv;
      const pz = inv;
      const aim = [r[0] * px + r[3] * py + r[6] * pz, r[1] * px + r[4] * py + r[7] * pz, r[2] * px + r[5] * py + r[8] * pz];

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(u.modelViewMatrix, false, mv);
      gl.uniformMatrix3fv(u.normalMatrix, false, normal);
      gl.uniform1f(u.uTime, clock);
      gl.uniform1f(u.uAmp, cur.amplitude);
      gl.uniform1f(u.uFreq, cur.frequency);
      gl.uniform1f(u.uSym, cur.symmetry);
      gl.uniform1f(u.uJitter, cur.jitter);
      gl.uniform1f(u.uDetail, cur.detail);
      gl.uniform3f(u.uPointer, aim[0], aim[1], aim[2]);
      gl.uniform1f(u.uPointerAmt, pointerAmt);
      gl.uniform3fv(u.uColors, colors);
      gl.uniform1fv(u.uWeights, new Float32Array(weights));
      gl.uniform1f(u.uDark, darkMq.matches ? 1 : 0);
      gl.drawElements(gl.TRIANGLES, scene.count, scene.indexType, 0);

      if (!readySent) {
        readySent = true;
        callbacks.current.onReady?.();
      }
    };

    const running = () => visible && !reduced && !document.hidden;

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      render(dt, true);
      if (running()) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running()) {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      } else if (visible) {
        // Hareketsiz çizim: kaydırıcı ya da tema değişince tek kare.
        render(1, false);
      }
    };
    requestDraw.current = kick;

    init();
    if (!scene) return;
    resize();
    kick();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running()) render(1, false);
    });
    ro.observe(box);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        kick();
      },
      { threshold: 0.01 },
    );
    io.observe(box);
    const onMotion = () => {
      reduced = reducedMq.matches;
      kick();
    };
    const onScheme = () => {
      colors = readColors();
      kick();
    };
    const onVisibility = () => kick();
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      readySent = false;
      callbacks.current.onLost?.();
    };
    const onRestored = () => {
      init();
      resize();
      kick();
    };
    reducedMq.addEventListener('change', onMotion);
    darkMq.addEventListener('change', onScheme);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      cancelAnimationFrame(raf);
      requestDraw.current = () => {};
      ro.disconnect();
      io.disconnect();
      reducedMq.removeEventListener('change', onMotion);
      darkMq.removeEventListener('change', onScheme);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      scene?.dispose();
    };
  }, [pointer]);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="block size-full" style={{ touchAction: 'pan-y' }} />
    </div>
  );
}
