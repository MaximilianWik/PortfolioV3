/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Preloader — Canvas 2D sphere of ember particles that ignites as the page
 * loads. 500 particles are distributed on a Fibonacci sphere; as progress
 * rises they rise, burst, and shift from ember-blood → gilt → white.
 * Pure Canvas 2D with manual 3D→2D perspective — zero extra dependencies.
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

// ── Fibonacci sphere ──────────────────────────────────────────────────────────
const N = 500;
const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));

const SPHERE: [number, number, number][] = Array.from({ length: N }, (_, i) => {
  const theta = Math.acos(1 - 2 * (i + 0.5) / N);
  const phi   = GOLDEN_ANGLE * i;
  return [Math.sin(theta) * Math.cos(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(theta)];
});
const PHASES      = SPHERE.map(() => Math.random());
const BURST_DIRS  = SPHERE.map(() => {
  const a = Math.random() * Math.PI * 2;
  return [Math.cos(a) * (0.6 + Math.random()),
          0.6 + Math.random() * 1.2,            // mostly upward
          Math.sin(a) * (0.6 + Math.random())] as [number,number,number];
});

// ── Particle canvas ───────────────────────────────────────────────────────────

const ParticleSphere: React.FC<{ progressRef: React.RefObject<number> }> = ({ progressRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = window.innerWidth, H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    const cx = W / 2, cy = H / 2;
    const R   = Math.min(W, H) * 0.20;
    const fov = Math.min(W, H) * 0.85;

    let angle = 0, rafId = 0, last = performance.now();

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const p = (progressRef.current ?? 0) / 100;

      const riseP  = Math.max(0, Math.min(1, (p - 0.45) / 0.40));
      const burstP = Math.max(0, Math.min(1, (p - 0.82) / 0.18));

      angle += dt * (0.55 - burstP * 0.55);

      const cosY = Math.cos(angle), sinY = Math.sin(angle);

      // ── Background ───────────────────────────────────────────────────────
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      bg.addColorStop(0, burstP > 0 ? `rgba(18,10,8,1)` : 'rgba(10,10,16,1)');
      bg.addColorStop(1, 'rgba(7,7,10,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Flash ─────────────────────────────────────────────────────────────
      if (burstP > 0) {
        const fa = Math.sqrt(burstP) * (1 - burstP) * 2.2;
        const fl = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.8);
        fl.addColorStop(0,   `rgba(255,246,215,${fa * 0.9})`);
        fl.addColorStop(0.3, `rgba(184,147,90,${fa * 0.45})`);
        fl.addColorStop(1,   'rgba(139,26,26,0)');
        ctx.fillStyle = fl;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Particles ─────────────────────────────────────────────────────────
      type Pt = { sx: number; sy: number; z: number; ph: number; size: number; alpha: number; r: number; g: number; b: number };
      const pts: Pt[] = [];

      for (let i = 0; i < N; i++) {
        const [ox, oy, oz] = SPHERE[i];
        const ph            = PHASES[i];
        const [bdx, bdy, bdz] = BURST_DIRS[i];

        // Y rotation
        const rx = ox * cosY - oz * sinY;
        const rz = ox * sinY + oz * cosY;

        // Rise
        const rY = riseP * (ph * R * 1.6 + R * 0.6);
        const rX = riseP * Math.sin(ph * Math.PI * 4) * R * 0.25;

        // Burst
        const b  = Math.pow(burstP, 1.4);
        const fx = (rx * R + rX + bdx * b * R * 3.0);
        const fy = (oy * R - rY + bdy * b * R * 2.5);
        const fz = (rz * R + bdz * b * R * 1.0);

        const s  = fov / (fov + fz);
        const sx = cx + fx * s;
        const sy = cy + fy * s;

        // Color: ember → gilt → white
        const ct = Math.min(1, p * 1.6);
        let cr: number, cg: number, cb: number;
        if (ct < 0.5) {
          const tt = ct / 0.5;
          cr = lerp(139, 184, tt); cg = lerp(26, 147, tt); cb = lerp(26, 90, tt);
        } else {
          const tt = (ct - 0.5) / 0.5;
          cr = lerp(184, 255, tt); cg = lerp(147, 246, tt); cb = lerp(90, 215, tt);
        }

        const depth = (fz / R + 1) / 2;
        const size  = Math.max(0.4, (0.7 + depth * 1.5) * (1 + b * 1.8) * (0.55 + ph * 0.7));
        const alpha = (0.25 + depth * 0.75) * Math.max(0.1, 1 - b * 0.65);

        pts.push({ sx, sy, z: fz, ph, size, alpha, r: cr, g: cg, b: cb });
      }

      pts.sort((a, b) => a.z - b.z);

      for (const { sx, sy, size, alpha, r, g, b } of pts) {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// ── Main preloader ────────────────────────────────────────────────────────────

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText]         = useState('');
  const onCompleteRef  = useRef(onComplete);
  const progressRef    = useRef(0);
  onCompleteRef.current = onComplete;

  const phrases = [
    'Awakening...', 'Challenging the Abyss...', 'Collecting Cursed Echoes...',
    'Kindling the Flame...', 'Binding the Ledger...',
  ];
  const getPhrase = (p: number) =>
    phrases[Math.min(Math.floor((p / 100) * phrases.length), phrases.length - 1)];

  useEffect(() => {
    let i = 0;
    const full = 'Ashes of automation. Dreams of silicon.';
    const ti = setInterval(() => {
      if (i < full.length) { setText(prev => prev + full[i]); i++; }
      else clearInterval(ti);
    }, 50);

    let ct: ReturnType<typeof setTimeout> | null = null;
    const pi = setInterval(() => {
      setProgress(prev => {
        const next = prev >= 100 ? 100 : prev + 2;
        progressRef.current = next;
        if (next >= 100) {
          clearInterval(pi);
          ct = setTimeout(() => onCompleteRef.current(), 600);
        }
        return next;
      });
    }, 25);

    return () => { clearInterval(ti); clearInterval(pi); if (ct) clearTimeout(ct); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center font-subdisplay overflow-hidden"
    >
      <ParticleSphere progressRef={progressRef} />

      {/* Text overlay */}
      <div className="relative z-10 flex flex-col items-center gap-0">
        <div className="text-bone-dim text-sm tracking-[0.4em] uppercase mb-8 h-8">
          {text}
        </div>

        <div className="w-64 h-[1px] bg-ember-blood/15 overflow-hidden relative">
          <motion.div
            className="absolute inset-y-0 left-0 bg-ember-blood"
            style={{ boxShadow: '0 0 8px rgba(139,26,26,0.8)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 font-mono text-[10px] text-bone-faded/50 tracking-widest uppercase">
          {Math.round(progress)}% – {getPhrase(progress)}
        </div>
      </div>
    </motion.div>
  );
};
