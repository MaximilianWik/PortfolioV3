/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const Bonfire: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();
  // Mirror hovered state into a ref so the animation loop can read it without
  // the effect tearing down + spinning up a fresh RAF on every hover toggle.
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 300;

    const drawSilhouette = () => {
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#1A1A20';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 5, canvas.height - 20);
      ctx.lineTo(canvas.width / 2 + 5, canvas.height - 180);
      ctx.stroke();
    };

    // Reduced motion: paint a single static frame — a soft ember glow plus the
    // coiled-sword silhouette — and never start the RAF loop.
    if (reduce) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createRadialGradient(
        canvas.width / 2, canvas.height - 50, 4,
        canvas.width / 2, canvas.height - 50, 80,
      );
      g.addColorStop(0,   'rgba(184,147,90,0.55)');
      g.addColorStop(0.5, 'rgba(139,26,26,0.30)');
      g.addColorStop(1,   'rgba(139,26,26,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 50, 80, 0, Math.PI * 2);
      ctx.fill();
      drawSilhouette();
      return;
    }

    let animationFrameId: number;
    let paused = false;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      life: number;
      maxLife: number;
      color: string;
      flicker: number;

      constructor(x: number, y: number, isFlame: boolean = false) {
        this.x = x;
        this.y = y;
        this.size = isFlame ? Math.random() * 8 + 4 : Math.random() * 3 + 1;
        this.maxLife = isFlame ? Math.random() * 20 + 10 : Math.random() * 60 + 40;
        this.life = this.maxLife;
        this.speedY = isFlame ? -(Math.random() * 2 + 1) : -(Math.random() * 3 + 1);
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.color = isFlame ? '#8B1A1A' : '#B8935A';
        this.flicker = Math.random();
      }

      update(intensity: number, now: number) {
        this.y += this.speedY * intensity;
        this.x += (this.speedX + Math.sin(now * 0.01 + this.flicker)) * 0.5 * intensity;
        this.life--;
        this.size *= 0.96;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity;
        if (this.color === '#B8935A') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#B8935A';
        } else {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#8B1A1A';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (paused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;

      const intensity = isHoveredRef.current ? 2.5 : 1;

      if (Math.random() < 0.6 * intensity) {
        particles.push(new Particle(canvas.width / 2 + (Math.random() - 0.5) * 20, canvas.height - 50, true));
      }
      if (Math.random() < 0.4 * intensity) {
        particles.push(new Particle(canvas.width / 2 + (Math.random() - 0.5) * 40, canvas.height - 50, false));
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(intensity, now);
        particles[i].draw(ctx);
        if (particles[i].life <= 0 || particles[i].size < 0.5) {
          particles.splice(i, 1);
          i--;
        }
      }

      // Coiled sword silhouette
      drawSilhouette();
    };

    const onVis = () => { paused = document.visibilityState === 'hidden'; };
    document.addEventListener('visibilitychange', onVis);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduce]);

  return (
    <div
      className={`relative cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block mx-auto" />
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-subdisplay text-[10px] tracking-[0.4em] text-gilt/60 uppercase"
      >
        Bonfire Lit
      </motion.div>
    </div>
  );
};
