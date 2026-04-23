/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const Bonfire: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
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

      update(intensity: number) {
        this.y += this.speedY * intensity;
        this.x += (this.speedX + Math.sin(Date.now() * 0.01 + this.flicker)) * 0.5 * intensity;
        this.life--;
        this.size *= 0.96;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.color === '#B8935A') { // Cinders glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#B8935A';
        } else {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#8B1A1A';
        }
      }
    }

    const init = () => {
      canvas.width = 200;
      canvas.height = 300;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      
      const intensity = isHovered ? 2.5 : 1;
      
      // Spawn new particles
      if (Math.random() < 0.6 * intensity) {
        particles.push(new Particle(canvas.width / 2 + (Math.random() - 0.5) * 20, canvas.height - 50, true));
      }
      if (Math.random() < 0.4 * intensity) {
        particles.push(new Particle(canvas.width / 2 + (Math.random() - 0.5) * 40, canvas.height - 50, false));
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(intensity);
        particles[i].draw(ctx);
        if (particles[i].life <= 0 || particles[i].size < 0.5) {
          particles.splice(i, 1);
          i--;
        }
      }

      // Draw coiled sword silhouette (Simplified)
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#1A1A20';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width/2 - 5, canvas.height - 20);
      ctx.lineTo(canvas.width/2 + 5, canvas.height - 180);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="block mx-auto" />
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-subdisplay text-[10px] tracking-[0.4em] text-gilt/60 uppercase"
      >
        Bonfire Lit
      </motion.div>
    </div>
  );
};
