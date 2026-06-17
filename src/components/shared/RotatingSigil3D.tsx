/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * RotatingSigil3D — a tiny canvas rendering a rotating 3D icosahedron
 * wireframe. Pure Canvas 2D with manual 3D→2D perspective projection.
 * Zero extra dependencies. On hover: rotation accelerates + glow intensifies.
 * On click: triggers a burst effect.
 */

import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

// ── Icosahedron geometry (computed once at module level) ──────────────────────

const PHI = (1 + Math.sqrt(5)) / 2;
const NORM = Math.sqrt(1 + PHI * PHI);

const VERTS: [number, number, number][] = [
  [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
].map(([x, y, z]) => [x / NORM, y / NORM, z / NORM]);

// Auto-generate edges by proximity (adjacent ⟺ distance ≈ 2/NORM)
const EDGE_THRESH = (2 / NORM) * 1.02;
const EDGES: [number, number][] = [];
for (let i = 0; i < 12; i++) {
  for (let j = i + 1; j < 12; j++) {
    const [ax, ay, az] = VERTS[i];
    const [bx, by, bz] = VERTS[j];
    if (Math.sqrt((ax-bx)**2 + (ay-by)**2 + (az-bz)**2) < EDGE_THRESH)
      EDGES.push([i, j]);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  size?: number;
  /** Base rotation speed in radians/second */
  baseSpeed?: number;
  onClick?: () => void;
  className?: string;
}

export const RotatingSigil3D: React.FC<Props> = ({
  size = 44,
  baseSpeed = 0.6,
  onClick,
  className = '',
}) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const hovRef    = useRef(false);
  const burstRef  = useRef(0); // remaining burst frames
  const reduce    = useReducedMotion();

  useEffect(() => { hovRef.current = hovered; }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.38;
    const fov = size * 1.8;  // perspective constant

    let angleY = 0;
    let angleX = 0.35; // slight permanent tilt so it reads as 3D
    let rafId  = 0;
    let last   = performance.now();
    let paused = false;

    const project = (v: [number, number, number]): [number, number, number] => {
      // Rotate around Y axis
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const x1 = v[0] * cosY - v[2] * sinY;
      const z1 = v[0] * sinY + v[2] * cosY;
      // Rotate around X axis (fixed tilt)
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const y2 = v[1] * cosX - z1 * sinX;
      const z2 = v[1] * sinX + z1 * cosX;
      // Perspective project
      const scale = fov / (fov + z2 * radius);
      return [cx + x1 * radius * scale, cy - y2 * radius * scale, z2];
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Project all vertices
      const projected = VERTS.map(project);

      // Sort edges by average Z for painter's algorithm (back → front)
      const sortedEdges = [...EDGES].sort((a, b) => {
        const za = projected[a[0]][2] + projected[a[1]][2];
        const zb = projected[b[0]][2] + projected[b[1]][2];
        return za - zb;
      });

      // Draw edges — depth-tinted: back = faded, front = bright
      const isHov = hovRef.current;
      for (const [i, j] of sortedEdges) {
        const [x1, y1, z1] = projected[i];
        const [x2, y2, z2] = projected[j];
        const depth = ((z1 + z2) / 2 + 1) / 2; // 0=back 1=front

        const alpha  = isHov ? 0.25 + depth * 0.75 : 0.15 + depth * 0.55;
        const width  = isHov ? 0.4 + depth * 0.8 : 0.25 + depth * 0.5;

        // gilt core → ember-blood back face tint
        const r = Math.round(184 * depth + 139 * (1 - depth));
        const g = Math.round(147 * depth + 26  * (1 - depth));
        const b = Math.round(90  * depth + 26  * (1 - depth));

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth   = width;
        ctx.stroke();
      }

      // Glow ring on hover
      if (isHov || burstRef.current > 0) {
        const glowR = size * 0.46;
        const grd = ctx.createRadialGradient(cx, cy, glowR * 0.6, cx, cy, glowR);
        const glowAlpha = isHov ? 0.18 : Math.min(burstRef.current, 0.3);
        grd.addColorStop(0, `rgba(184,147,90,${glowAlpha})`);
        grd.addColorStop(1, 'rgba(184,147,90,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    };

    // Reduced motion: render one static frame, no rotation loop.
    if (reduce) {
      draw();
      return;
    }

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (paused) { last = now; return; }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const speed = hovRef.current ? baseSpeed * 3.5 : baseSpeed;
      if (burstRef.current > 0) {
        angleY  += dt * baseSpeed * 8;
        burstRef.current -= dt;
      } else {
        angleY += dt * speed;
      }

      draw();
    };

    const onVis = () => { paused = document.visibilityState === 'hidden'; };
    document.addEventListener('visibilitychange', onVis);

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [size, baseSpeed, reduce]);

  const handleClick = () => {
    burstRef.current = 0.5; // spin burst for 0.5s
    onClick?.();
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      role="button"
      aria-label="Return to top"
      tabIndex={0}
      className={`cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
      }}
    />
  );
};
