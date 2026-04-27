/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';

const MAX_PARTICLES = 220;

export const CindersOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Cap DPR at 1.5 — the overlay is intentionally low-detail, and rendering
    // a fullscreen canvas at native 2x/3x is pure waste for an ambient effect.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    class Particle {
      x: number;
      y: number;
      size: number;
      density: number;
      color: string;
      angle: number;
      velocity: number;
      isGlow: boolean;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.density = Math.random() * 30 + 1;
        this.isGlow = Math.random() > 0.8;
        this.color = this.isGlow ? '#B8935A' : '#8B1A1A';
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = Math.random() * 0.5 + 0.2;
      }

      draw() {
        if (this.isGlow) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update(width: number, height: number) {
        this.y -= this.velocity;
        this.x += Math.sin(this.angle) * 0.5;
        this.angle += 0.01;

        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }

        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.hypot(dx, dy) || 1; // guard against distance===0
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          this.x -= (dx / distance) * force * this.density;
          this.y -= (dy / distance) * force * this.density;
        }
      }
    }

    const init = () => {
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = cssWidth + 'px';
      canvas.style.height = cssHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.floor((cssWidth * cssHeight) / 8000);
      const count = Math.min(target, MAX_PARTICLES);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(cssWidth, cssHeight));
      }
    };

    const animate = () => {
      const cssWidth = canvas.width / dpr;
      const cssHeight = canvas.height / dpr;
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update(cssWidth, cssHeight);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[70] opacity-40"
    />
  );
};
