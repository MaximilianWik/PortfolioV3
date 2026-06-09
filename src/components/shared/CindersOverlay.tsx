/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cinders — fullscreen ember/spark/ash overlay. Burning, behind everything.
 *
 * Architecture
 * ────────────
 * • Streak sprite atlas (built once on mount): each ember/spark draws a
 *   pre-rendered streak shape — bright radial-gradient head with a tapered
 *   linear-gradient tail. The streak shape IS the trail, so we don't need a
 *   per-frame full-viewport destination-out pass (the previous version's
 *   single biggest perf cost). 4 streak lengths × 5 heat stages = 20 sprites,
 *   plus a round ash sprite. Built lazily inside useEffect, ~40KB total.
 *
 * • Per-frame work is just clearRect + drawImage per particle. No fillRect
 *   trail buffer, no shadowBlur, no per-frame radial gradients.
 *
 * • Three particle classes:
 *     ember — slow rising streaks that cool through 5 heat stages
 *     spark — small, fast, brief; bright pop, short streak
 *     ash   — dark drifting flecks, normal-blended, tumble + fade
 *
 * • Compositing:
 *     embers + sparks → globalCompositeOperation = 'lighter' (additive)
 *     ash             → 'source-over' (normal)
 *     The canvas itself sits at zIndex: 1, opacity ~0.55 — between background
 *     imagery (which paints with the static section flow) and foreground
 *     text/cards (which use `relative z-10` to lift above the canvas via
 *     root stacking context). No mix-blend-mode (it produces transparent
 *     output when the canvas is in its own fixed-position stacking context).
 *
 * • Erratic motion: a global dual-sinusoid wind field, but each particle
 *   has its own windMult / turbAmp / turbFreq drawn at spawn, so two
 *   particles at the same position respond to wind very differently.
 *   Streak length also varies per spawn (size class 0..3).
 *
 * • Buoyancy + drag on both axes; spark buoyancy 60% of ember.
 *
 * • Mouse repel: cursor pushes particles outward inside MOUSE_R falloff.
 *
 * • Particle pool: dead particles recycle in place via Object.assign — no
 *   allocations per frame after init.
 *
 * • DPR clamped to 1 (was 1.5). Fullscreen ambient effect; halving pixel
 *   count is free perf.
 *
 * • Respects prefers-reduced-motion ONLY when the device also has no fine
 *   pointer (i.e. pure-touch + reduce-motion). Pauses on hidden tab.
 */

import React, { useRef, useEffect } from 'react';

// ─────────── Tuning ───────────
const TARGET_DENSITY = 1 / 9000;     // particles per CSS pixel of viewport
const MIN_PARTICLES  = 80;
const MAX_PARTICLES  = 200;
const SPARK_RATIO    = 0.40;
const ASH_RATIO      = 0.10;

// Heat stages (white-hot → cooling-dark coal)
const HEAT: { r: number; g: number; b: number }[] = [
  { r: 255, g: 246, b: 215 },
  { r: 255, g: 196, b: 110 },
  { r: 240, g: 130, b: 50 },
  { r: 184, g: 60,  b: 28 },
  { r: 110, g: 28,  b: 16 },
];

// Streak head radii (CSS px) and tail-length multipliers per size class.
// Size class 0 = biggest streak (long tail), class 3 = small (short tail).
const HEAD_RADII = [10, 7, 4.5, 2.5];
const TAIL_MULT  = [7,  6, 4.5, 3.0]; // tail length = headRadius × this

// Physics — gentler buoyancy + wind for slow, atmospheric drift
const BUOY_ACC  = 0.008;
const DRAG      = 0.985;
const VERT_DRAG = 0.992;
const WIND_AMP  = 0.45;

// Mouse repel
const MOUSE_R = 200;
const MOUSE_F = 0.55;

type Kind = 'ember' | 'spark' | 'ash';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  age: number; life: number;
  size: number;          // 0..3 size class (index into HEAD_RADII)
  phase: number;
  // Per-particle motion params for erratic, non-uniform drift
  windMult: number;      // 0.25..1.6 — response to global wind
  turbAmp: number;       // 0.04..0.18 — turbulence magnitude
  turbFreq: number;      // 0.6..4.5  — turbulence frequency
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

    // Only short-circuit if BOTH reduce-motion is on AND there's no fine
    // pointer — i.e. pure-touch users who explicitly asked for less motion.
    // Mouse-repel is gated separately at runtime via mouse.on.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches;
    if (reduce && !hasFinePointer) return;

    // DPR 1 — half the pixels of native 1.5x; the effect is intentionally
    // soft, sub-pixel detail is wasted here.
    const dpr = 1;

    // ─────────── Streak sprite atlas ───────────
    // Each sprite: bright radial head at top + tapered linear tail downward.
    // Drawn at (p.x - W/2, p.y - headR) so the head sits at the particle
    // position and the tail trails below.
    const buildStreak = (
      headR: number,
      tailLen: number,
      h: { r: number; g: number; b: number }
    ): { canvas: HTMLCanvasElement; headR: number } => {
      const w = Math.ceil(headR * 4);
      const totalH = Math.ceil(headR * 2 + tailLen);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = totalH;
      const cx2d = c.getContext('2d')!;
      const mx = w / 2;
      const headCY = headR; // head center y

      // Tail: linear gradient inside a narrowing trapezoid
      const tg = cx2d.createLinearGradient(0, headCY, 0, totalH);
      tg.addColorStop(0,   `rgba(${h.r}, ${h.g}, ${h.b}, 0.70)`);
      tg.addColorStop(0.4, `rgba(${h.r}, ${Math.round(h.g * 0.55)}, ${Math.round(h.b * 0.30)}, 0.30)`);
      tg.addColorStop(1,   `rgba(${h.r}, ${h.g}, ${h.b}, 0)`);
      cx2d.fillStyle = tg;
      cx2d.beginPath();
      cx2d.moveTo(mx - headR * 0.7, headCY);
      cx2d.lineTo(mx + headR * 0.7, headCY);
      cx2d.lineTo(mx + headR * 0.15, totalH);
      cx2d.lineTo(mx - headR * 0.15, totalH);
      cx2d.closePath();
      cx2d.fill();

      // Head: radial gradient — white-hot core, colored mid, soft halo
      const hg = cx2d.createRadialGradient(mx, headCY, 0, mx, headCY, headR * 1.9);
      hg.addColorStop(0,    'rgba(255, 250, 235, 1)');
      hg.addColorStop(0.06, `rgba(${h.r}, ${h.g}, ${h.b}, 1)`);
      hg.addColorStop(0.35, `rgba(${h.r}, ${Math.round(h.g * 0.5)}, ${Math.round(h.b * 0.35)}, 0.55)`);
      hg.addColorStop(1,    `rgba(${h.r}, ${h.g}, ${h.b}, 0)`);
      cx2d.fillStyle = hg;
      cx2d.fillRect(0, 0, w, Math.min(totalH, headR * 3));

      return { canvas: c, headR };
    };

    const buildAsh = () => {
      const sz = 10;
      const c = document.createElement('canvas');
      c.width = c.height = sz;
      const cx2d = c.getContext('2d')!;
      const g = cx2d.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
      g.addColorStop(0,   'rgba(50, 45, 42, 0.95)');
      g.addColorStop(0.5, 'rgba(28, 24, 22, 0.55)');
      g.addColorStop(1,   'rgba(10, 8, 7, 0)');
      cx2d.fillStyle = g;
      cx2d.fillRect(0, 0, sz, sz);
      return c;
    };

    // streaks[sizeClass][heatStage]
    const streaks = HEAD_RADII.map((r, i) =>
      HEAT.map(h => buildStreak(r, r * TAIL_MULT[i], h))
    );
    const ash = buildAsh();

    // ─────────── Particles ───────────
    let particles: Particle[] = [];
    let cssW = 0, cssH = 0;

    const seed = (kind: Kind, w: number, h: number, fromBelow = false): Particle => {
      const sizeClass = kind === 'spark'
        ? 3
        : Math.floor(Math.random() * HEAD_RADII.length);
      const life = kind === 'spark' ? 110 + Math.random() * 90
                 : kind === 'ash'   ? 480 + Math.random() * 400
                                    : 380 + Math.random() * 420;
      const lift = kind === 'spark' ? -1.2 : kind === 'ash' ? -0.15 : -0.45;

      // Per-particle motion — slower frequencies + smaller amplitudes for
      // smooth, drifting movement instead of jittery uniform wave-form drift.
      const windMult = 0.25 + Math.random() * 1.35;
      const turbAmp  = 0.02 + Math.random() * 0.07;
      const turbFreq = 0.25 + Math.random() * 1.55;

      return {
        x: Math.random() * w,
        // 65% spawn near the bottom band; 35% scattered everywhere
        y: fromBelow
          ? h + 5 + Math.random() * 30
          : (Math.random() < 0.65 ? h - Math.random() * h * 0.4 : Math.random() * h),
        vx: (Math.random() - 0.5) * 0.6,
        vy: lift - Math.random() * 0.5,
        age: fromBelow ? 0 : Math.floor(Math.random() * life * 0.5),
        life,
        size: sizeClass,
        phase: Math.random() * Math.PI * 2,
        windMult, turbAmp, turbFreq,
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

      // Clear rather than trail-decay — clearRect is dramatically cheaper than
      // a full-viewport destination-out fillRect and the streak sprites give
      // the trail look on their own.
      ctx.clearRect(0, 0, w, h);

      // Global wind field — slow primary cycle (~25s period) plus slower
      // counter-swirl (~10s). Per-particle windMult applied below.
      const winRoot1 = Math.sin(t * 0.25)       * WIND_AMP;
      const winRoot2 = Math.sin(t * 0.62 + 1.7) * WIND_AMP * 0.35;

      const m = mouse.current;

      // ─────────── Pass 1: embers + sparks (additive) ───────────
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind === 'ash') continue;

        p.age++;

        // Per-particle wind response + turbulence
        const windX = (winRoot1 + winRoot2 * Math.sin(p.y * 0.004)) * p.windMult
                    + Math.sin(t * p.turbFreq + p.phase) * p.turbAmp;
        p.vx += windX * 0.022;
        p.vy -= BUOY_ACC * (p.kind === 'spark' ? 0.6 : 1.0);
        p.vx *= DRAG;
        p.vy *= VERT_DRAG;

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

        if (p.age > p.life || p.y < -80 || p.x < -60 || p.x > w + 60) {
          recycle(p, w, h);
          continue;
        }

        const ageT = p.age / p.life;
        const stageIdx = Math.min(HEAT.length - 1, Math.floor(ageT * (HEAT.length - 0.001)));
        const sprite = streaks[p.size][stageIdx];

        // Slow flicker — period ~1.5s, gentle 0.78..1.0 brightness oscillation
        const flicker = 0.78 + Math.sin(now * 0.004 + p.phase) * 0.22;
        const fadeIn  = Math.min(1, ageT * 8);
        const fadeOut = Math.min(1, (1 - ageT) * 2.8);
        ctx.globalAlpha = flicker * fadeIn * fadeOut;

        const sw = sprite.canvas.width;
        ctx.drawImage(sprite.canvas, p.x - sw / 2, p.y - sprite.headR);
      }

      // ─────────── Pass 2: ash (normal blend) ───────────
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind !== 'ash') continue;

        p.age++;
        const windX = winRoot1 * 0.4 * p.windMult + Math.sin(t * p.turbFreq * 0.3 + p.phase) * 0.3;
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
        ctx.globalAlpha = fade * 0.55;

        const sz = ash.width * (0.7 + (3 - p.size) * 0.25);
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.55 }}
    />
  );
};
