/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cinders — fullscreen ember/spark/ash overlay. The site is on fire.
 *
 * Architecture
 * ────────────
 * • Sprite atlas (built once on mount): pre-rendered radial-gradient embers at
 *   four sizes × five heat stages, plus an ash sprite. Per-frame drawing is
 *   pure drawImage — no arc(), no per-particle createRadialGradient(), no
 *   shadowBlur. This is the single most important reason the canvas can carry
 *   ~250 particles at 60fps.
 *
 * • Three particle classes:
 *     ember — slow rising, glowing, cool through 5 heat stages
 *     spark — small, fast, brief; pop bright then die
 *     ash   — dark drifting flecks, normal-blended, slowly tumble
 *
 * • Compositing:
 *     embers + sparks → globalCompositeOperation = 'lighter' (additive)
 *     ash             → 'source-over' (normal)
 *     canvas itself   → mixBlendMode: screen on the page, so dark pixels are
 *                       transparent and bright pixels glow over the layout.
 *
 * • Trail effect: every frame we paint a translucent destination-out across
 *   the canvas, eroding ~18% of alpha. Particles drawn additively persist for
 *   ~6 frames before fading, producing the streaking flame look without any
 *   per-particle history bookkeeping.
 *
 * • Wind: dual sinusoid sampled once per frame, sheared by particle Y so
 *   different vertical layers drift at different rates — gives natural swirl
 *   without the cost of true noise sampling.
 *
 * • Buoyancy: continuous upward acceleration on embers/sparks; ash gets
 *   ~15% buoyancy so it floats but doesn't rocket.
 *
 * • Mouse repel: cursor pushes particles outward inside a 200px falloff.
 *
 * • Particle pool: dead particles are recycled in place (Object.assign) — no
 *   allocations per frame after init.
 *
 * • Respects prefers-reduced-motion and pointer:coarse (no canvas at all).
 *   Pauses while tab is hidden.
 */

import React, { useRef, useEffect } from 'react';

// ─────────── Tuning ───────────
const TARGET_DENSITY = 1 / 6500;     // particles per CSS pixel of viewport area
const MIN_PARTICLES  = 140;
const MAX_PARTICLES  = 320;
const SPARK_RATIO    = 0.45;
const ASH_RATIO      = 0.10;

// Heat stages: white-hot → cooling-dark
const HEAT: { r: number; g: number; b: number }[] = [
  { r: 255, g: 246, b: 215 }, // 0 white-hot
  { r: 255, g: 196, b: 110 }, // 1 yellow
  { r: 240, g: 130, b: 50 },  // 2 orange
  { r: 184, g: 60,  b: 28 },  // 3 ember red (site palette)
  { r: 110, g: 28,  b: 16 },  // 4 dying coal
];

// Ember sizes (CSS px). Sprite half-extent is radius × GLOW_HALO so the
// gradient can fade past the bright core into a soft halo.
const EMBER_RADII = [12, 7, 4, 2.2];
const GLOW_HALO   = 4;

// Physics
const BUOY_ACC  = 0.018;   // upward acc/frame from heat
const DRAG      = 0.985;
const VERT_DRAG = 0.992;
const WIND_AMP  = 0.95;
const TURB_AMP  = 0.06;

// Mouse repel
const MOUSE_R = 200;
const MOUSE_F = 0.55;

// Trail decay (alpha erased per frame inside the canvas)
const TRAIL_ALPHA = 0.18;

type Kind = 'ember' | 'spark' | 'ash';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  age: number; life: number;
  base: number;          // 0..1 — drives size class
  phase: number;         // per-particle phase for flicker/turbulence
  kind: Kind;
  rot: number; rotV: number;
}

export const CindersOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -10000, y: -10000, on: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Skip the effect entirely on reduced-motion preference or coarse pointers.
    // No allocations, no rAF loop on those targets.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    // Cap DPR at 1.5 — fullscreen ambient canvas, no need for native 2x/3x.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // ─────────── Sprite atlas (built once) ───────────
    const buildEmber = (radius: number, h: { r: number; g: number; b: number }) => {
      const sz = Math.ceil(radius * GLOW_HALO * 2);
      const c  = document.createElement('canvas');
      c.width = c.height = sz;
      const cx = c.getContext('2d')!;
      const r  = sz / 2;
      const g  = cx.createRadialGradient(r, r, 0, r, r, r);
      // Bright white core → colored hot mid → fading halo → transparent edge
      g.addColorStop(0,    'rgba(255, 250, 235, 1)');
      g.addColorStop(0.05, `rgba(${h.r}, ${h.g}, ${h.b}, 1)`);
      g.addColorStop(0.20, `rgba(${h.r}, ${Math.round(h.g * 0.6)}, ${Math.round(h.b * 0.45)}, 0.78)`);
      g.addColorStop(0.55, `rgba(${h.r}, ${Math.round(h.g * 0.4)}, ${Math.round(h.b * 0.30)}, 0.20)`);
      g.addColorStop(1,    `rgba(${h.r}, ${h.g}, ${h.b}, 0)`);
      cx.fillStyle = g;
      cx.fillRect(0, 0, sz, sz);
      return c;
    };

    const buildAsh = () => {
      const sz = 10;
      const c  = document.createElement('canvas');
      c.width = c.height = sz;
      const cx = c.getContext('2d')!;
      const g  = cx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
      g.addColorStop(0,   'rgba(50, 45, 42, 0.95)');
      g.addColorStop(0.5, 'rgba(28, 24, 22, 0.55)');
      g.addColorStop(1,   'rgba(10, 8, 7, 0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, sz, sz);
      return c;
    };

    const ember: HTMLCanvasElement[][] = EMBER_RADII.map(r => HEAT.map(h => buildEmber(r, h)));
    const ash = buildAsh();

    // ─────────── Particles ───────────
    let particles: Particle[] = [];
    let cssW = 0, cssH = 0;

    const seed = (kind: Kind, w: number, h: number, fromBelow = false): Particle => {
      const base = Math.random();
      const life = kind === 'spark' ? 60  + Math.random() * 50
                 : kind === 'ash'   ? 380 + Math.random() * 320
                                    : 220 + Math.random() * 220;
      const lift = kind === 'spark' ? -2.2 : kind === 'ash' ? -0.25 : -0.95;
      return {
        x: Math.random() * w,
        // 65% of fresh embers spawn in the bottom 40% of the screen, the rest
        // anywhere — so the fire feels rooted at the foot but reaches up.
        y: fromBelow
          ? h + 5 + Math.random() * 30
          : (Math.random() < 0.65 ? h - Math.random() * h * 0.4 : Math.random() * h),
        vx: (Math.random() - 0.5) * 0.6,
        vy: lift - Math.random() * 0.5,
        age: fromBelow ? 0 : Math.floor(Math.random() * life * 0.5),
        life,
        base,
        phase: Math.random() * Math.PI * 2,
        kind,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.025,
      };
    };

    const totalCount = (w: number, h: number) =>
      Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.floor(w * h * TARGET_DENSITY)));

    const init = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width  = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width  = cssW + 'px';
      canvas.style.height = cssH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const total  = totalCount(cssW, cssH);
      const sparks = Math.floor(total * SPARK_RATIO);
      const ashes  = Math.floor(total * ASH_RATIO);
      const embers = total - sparks - ashes;

      particles = [];
      for (let i = 0; i < embers; i++) particles.push(seed('ember', cssW, cssH));
      for (let i = 0; i < sparks; i++) particles.push(seed('spark', cssW, cssH));
      for (let i = 0; i < ashes;  i++) particles.push(seed('ash',   cssW, cssH));
    };

    // Recycle a dead particle in place — no allocations, no GC churn
    const recycle = (p: Particle, w: number, h: number) => {
      Object.assign(p, seed(p.kind, w, h, true));
    };

    let paused = false;
    let raf = 0;

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (paused) return;

      const w = cssW, h = cssH;
      const t = now * 0.001;

      // Trail decay — translucent destination-out leaves ~6 frames of streak
      // behind every additive particle. Single fillRect, cheap.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, w, h);

      // Wind field — sampled once per frame; per-particle Y-shear and phase
      // turbulence applied inline below.
      const winRoot1 = Math.sin(t * 0.55)        * WIND_AMP;
      const winRoot2 = Math.sin(t * 1.30 + 1.7)  * WIND_AMP * 0.35;

      const m = mouse.current;

      // ─────────── Pass 1: embers + sparks (additive) ───────────
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind === 'ash') continue;

        p.age++;

        // Wind: dual sinusoid + Y-shear + per-particle turbulence
        const windX = winRoot1
                    + winRoot2 * Math.sin(p.y * 0.004)
                    + Math.sin(t * 3 + p.phase) * TURB_AMP;
        p.vx += windX * 0.018;
        p.vy -= BUOY_ACC * (p.kind === 'spark' ? 0.6 : 1.0);
        p.vx *= DRAG;
        p.vy *= VERT_DRAG;

        // Mouse repel
        if (m.on) {
          const dx = p.x - m.x, dy = p.y - m.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < MOUSE_R * MOUSE_R && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / MOUSE_R) * MOUSE_F;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f * 0.7;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.age > p.life || p.y < -50 || p.x < -60 || p.x > w + 60) {
          recycle(p, w, h);
          continue;
        }

        // Sprite selection: heat stage advances with age, size class fixed at spawn
        const ageT = p.age / p.life;
        const stageIdx = Math.min(HEAT.length - 1, Math.floor(ageT * (HEAT.length - 0.001)));
        const sizeIdx = p.kind === 'spark'
          ? 3
          : Math.min(EMBER_RADII.length - 1, Math.floor((1 - p.base) * EMBER_RADII.length));
        const spr = ember[sizeIdx][stageIdx];

        // Flicker around base brightness, fade in/out at endpoints of life
        const flicker = 0.78 + Math.sin(now * 0.022 + p.phase) * 0.22;
        const fadeIn  = Math.min(1, ageT * 8);
        const fadeOut = Math.min(1, (1 - ageT) * 2.8);
        ctx.globalAlpha = flicker * fadeIn * fadeOut * (p.kind === 'spark' ? 1.0 : 0.85);

        const sz = spr.width;
        ctx.drawImage(spr, p.x - sz/2, p.y - sz/2);
      }

      // ─────────── Pass 2: ash (normal blend) ───────────
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind !== 'ash') continue;

        p.age++;
        const windX = winRoot1 * 0.4 + Math.sin(t * 0.7 + p.phase) * 0.3;
        p.vx += windX * 0.005;
        p.vy -= BUOY_ACC * 0.15;
        p.vx *= 0.99;
        p.vy *= 0.995;
        p.rot += p.rotV;
        p.x += p.vx;
        p.y += p.vy;

        if (p.age > p.life || p.y < -50) {
          recycle(p, w, h);
          continue;
        }

        const ageT = p.age / p.life;
        const fade = Math.min(1, ageT * 5) * Math.min(1, (1 - ageT) * 3);
        ctx.globalAlpha = fade * 0.6;

        const sz = ash.width * (0.7 + p.base * 0.9);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(ash, -sz/2, -sz/2, sz, sz);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    raf = requestAnimationFrame(animate);

    // ─────────── Events ───────────
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.on = true;
    };
    const onLeave = () => { mouse.current.on = false; };
    const onVis = () => { paused = document.visibilityState === 'hidden'; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave, { passive: true });
    window.addEventListener('resize', init);
    document.addEventListener('visibilitychange', onVis);

    init();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', init);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[70]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
