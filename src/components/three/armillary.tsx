'use client';

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { HERO_RINGS, type HeroRing } from './rings';

/**
 * Halkalı küre (armillary sphere): gökyüzünü ölçmek için kullanılan tarihî alet.
 * Her halka bir ölçüm alanını temsil eder; halkanın üzerine gelince vurgulanır, tıklayınca
 * o alandaki testlere gider. Sahne tamamen kodla çizilir, dışarıdan model ya da doku yüklenmez.
 */

type Palette = { ink: string; brass: string; marker: string; rule: string };

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    ink: v('--ink', '#13203b'),
    brass: v('--brass', '#b07f22'),
    marker: v('--marker', '#c23a30'),
    rule: v('--rule-strong', '#a3b0c3'),
  };
}

function usePalette(): Palette | null {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setPalette(readPalette());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return palette;
}

function tickGeometry(radius: number): THREE.BufferGeometry {
  const pts: number[] = [];
  for (let i = 0; i < 72; i++) {
    const a = (i * 5 * Math.PI) / 180;
    const inner = radius - (i % 6 === 0 ? 0.1 : 0.045);
    pts.push(Math.cos(a) * inner, Math.sin(a) * inner, 0, Math.cos(a) * radius, Math.sin(a) * radius, 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

function Ring({
  ring,
  palette,
  active,
  onHover,
  onSelect,
  animate,
}: {
  ring: HeroRing;
  palette: Palette;
  active: boolean;
  onHover: (key: string | null) => void;
  onSelect: (ring: HeroRing) => void;
  animate: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  const ticks = useMemo(() => tickGeometry(ring.radius), [ring.radius]);
  useFrame((_, delta) => {
    if (animate && spin.current) spin.current.rotation.z += ring.speed * Math.min(delta, 0.05);
  });
  const color = active ? palette.brass : palette.ink;
  return (
    <group rotation={ring.tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[ring.radius, active ? 0.016 : 0.009, 8, 220]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <lineSegments geometry={ticks}>
          <lineBasicMaterial color={color} transparent opacity={active ? 1 : 0.55} />
        </lineSegments>
        {/* Görünmez, kalın halka: fareyle yakalamayı kolaylaştırır */}
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover(ring.key);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onSelect(ring);
          }}
        >
          <torusGeometry args={[ring.radius, 0.06, 6, 90]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function Scene({
  palette,
  hovered,
  setHovered,
  animate,
}: {
  palette: Palette;
  hovered: string | null;
  setHovered: (k: string | null) => void;
  animate: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const pointer = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const drag = useRef({ active: false, x: 0, y: 0, vx: 0, vy: 0, rx: -0.28, ry: 0.5 });

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.vy = (e.clientX - d.x) * 0.006;
      d.vx = (e.clientY - d.y) * 0.006;
      d.ry += d.vy;
      d.rx = THREE.MathUtils.clamp(d.rx + d.vx, -1.1, 1.1);
      d.x = e.clientX;
      d.y = e.clientY;
      invalidate();
    };
    const up = (e: PointerEvent) => {
      drag.current.active = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [gl, invalidate]);

  useFrame((state, delta) => {
    const d = drag.current;
    const dt = Math.min(delta, 0.05);
    if (!d.active) {
      d.vx *= 0.92;
      d.vy *= 0.92;
      d.ry += d.vy;
      d.rx = THREE.MathUtils.clamp(d.rx + d.vx, -1.1, 1.1);
      if (animate) d.ry += dt * 0.06;
    }
    if (root.current) {
      root.current.rotation.y = d.ry;
      root.current.rotation.x = d.rx;
    }
    if (pointer.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.2) * (animate ? 0.12 : 0);
      pointer.current.scale.setScalar(s);
    }
    if (!animate && (Math.abs(d.vx) > 1e-4 || Math.abs(d.vy) > 1e-4)) invalidate();
  });

  const alidade = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([-1.72, 0, 0, 1.72, 0, 0], 3));
    return g;
  }, []);

  return (
    <group ref={root}>
      {HERO_RINGS.map((r) => (
        <Ring
          key={r.key}
          ring={r}
          palette={palette}
          active={hovered === r.key}
          onHover={setHovered}
          onSelect={(ring) => router.push(ring.href)}
          animate={animate}
        />
      ))}
      {/* Eksen ve gösterge (alidat) */}
      <group rotation={[0, 0, 0.66]}>
        <lineSegments geometry={alidade}>
          <lineBasicMaterial color={palette.brass} />
        </lineSegments>
        <mesh ref={pointer} position={[1.72, 0, 0]}>
          <sphereGeometry args={[0.05, 20, 20]} />
          <meshBasicMaterial color={palette.marker} />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[0.16, 40, 40]} />
        <meshStandardMaterial color={palette.brass} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

export default function Armillary({
  hovered,
  setHovered,
}: {
  hovered: string | null;
  setHovered: (k: string | null) => void;
}) {
  const palette = usePalette();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const upd = () => setReducedMotion(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = visible && !reducedMotion;
  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true" style={{ cursor: hovered ? 'pointer' : 'grab' }}>
      {palette && (
        <Canvas
          dpr={[1, 2]}
          frameloop={animate ? 'always' : 'demand'}
          camera={{ position: [0, 0.15, 5.6], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          style={{ touchAction: 'pan-y' }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 4]} intensity={1.6} />
          <Scene palette={palette} hovered={hovered} setHovered={setHovered} animate={animate} />
        </Canvas>
      )}
    </div>
  );
}
