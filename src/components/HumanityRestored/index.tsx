import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

// ─── Canvas particle burst ────────────────────────────────────────────────────
// One canvas element replaces 60 individual motion.div particles.
// Additive compositing (lighter) is applied at the canvas level, so no
// per-particle mix-blend-mode; the GPU composites once per frame total.

const ParticleBurst: React.FC<{ active: boolean }> = ({ active }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = W / 2;
    const cy = H / 2;

    // Teal, white and faint gilt — matches the site palette while staying
    // true to the original Soul restoration colour language.
    const COLORS = ['#FFFFFF', '#76C7A8', '#9FD9C2', '#FFFFFF', '#B8935A', '#76C7A8'];

    type P = {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; life: number; maxLife: number;
    };
    const particles: P[] = [];

    // Burst particles — tight horizontal spread, compressed vertical
    for (let i = 0; i < 140; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 260;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.35,
        size: 0.8 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: 1.2 + Math.random() * 1.8,
      });
    }

    // Drift particles — spawn across the beam, float upward slowly
    for (let i = 0; i < 90; i++) {
      const delay = 0.3 + Math.random() * 4;
      particles.push({
        x: cx + (Math.random() - 0.5) * W * 0.9,
        y: cy + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 25,
        vy: -15 - Math.random() * 35,
        size: 0.5 + Math.random() * 1.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: -delay,
        maxLife: 3 + Math.random() * 5,
      });
    }

    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      let alive = false;
      for (const p of particles) {
        p.life += dt;
        if (p.life < 0) continue;
        const t = p.life / p.maxLife;
        if (t >= 1) continue;
        alive = true;

        // Fast ramp-up, gradual decay
        const alpha = Math.min(1, t * 10) * Math.pow(1 - t, 1.4);

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= Math.pow(0.94, dt * 60);
        p.vy *= Math.pow(0.97, dt * 60);
        if (p.vy < 0) p.vy -= 8 * dt; // gentle upward buoyancy

        // Core dot
        ctx.globalAlpha = alpha * 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Soft halo for larger particles — cheap radial gradient alternative
        if (p.size > 1.2) {
          ctx.globalAlpha = alpha * 0.18;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (!alive) cancelAnimationFrame(rafId);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const HumanityRestored: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView    = useInView(containerRef, { once: false, amount: 0.4 });
  const [animKey, setAnimKey] = useState(0);
  const prevInView  = useRef(false);

  // Increment key on every fresh scroll-in — forces clean remount of all
  // animation children so the sequence restarts from scratch.
  useEffect(() => {
    if (isInView && !prevInView.current) setAnimKey(k => k + 1);
    prevInView.current = isInView;
  }, [isInView]);

  // All animation timing driven off a 9-second master
  const DUR = 9;
  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[65vh] flex items-center justify-center py-32 bg-ink-void overflow-x-clip cursor-pointer select-none"
      onClick={() => setAnimKey(k => k + 1)}
    >
      {/* Static vignette — no animation, no cost */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,7,10,0.85) 100%)' }} />

      {/* Particle canvas fills the full section height, not the inner text div */}
      {animKey > 0 && <ParticleBurst key={animKey} active />}

      <div className="relative w-full flex flex-col items-center justify-center">
        {animKey > 0 && (
          <React.Fragment key={animKey}>
            {/* ── L1: Dark ambient backdrop ──────────────────────────────────
                Opacity only — no filter animation.
                will-change promotes to its own GPU layer immediately.      */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '140vw', height: '280px',
                top: '50%', marginTop: '-140px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 45%, transparent 75%)',
                filter: 'blur(12px)',           // static — no animation cost
                willChange: 'opacity, transform',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0] }}
              transition={{ duration: DUR, times: [0, 0.12, 0.82, 1], ease: 'easeInOut' }}
            />

            {/* ── L2: Horizontal energy beam ─────────────────────────────────
                Wide teal glow — scaleX + opacity only.                      */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '100vw', height: '90px',
                top: '50%', marginTop: '-45px',
                background: 'radial-gradient(ellipse at center, rgba(118,199,168,0.75) 0%, rgba(118,199,168,0.25) 50%, transparent 85%)',
                filter: 'blur(10px)',           // static
                mixBlendMode: 'screen',
                willChange: 'opacity, transform',
              }}
              initial={{ opacity: 0, scaleX: 0, scaleY: 0.3 }}
              animate={{ opacity: [0, 1, 0.6, 0], scaleX: [0, 5, 2.5, 0], scaleY: [0.3, 1.8, 1, 0] }}
              transition={{ duration: DUR, times: [0, 0.06, 0.72, 1], ease: 'easeOut' }}
            />

            {/* ── L3: White blinding core flash ──────────────────────────────
                Fast, sharp, pure. No blur whatsoever.                        */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '80vw', maxWidth: '900px', height: '6px',
                top: '50%', marginTop: '-3px',
                background: 'radial-gradient(ellipse at center, #FFFFFF 0%, rgba(118,199,168,0.85) 45%, transparent 80%)',
                boxShadow: '0 0 24px 8px rgba(118,199,168,0.65)',
                willChange: 'opacity, transform',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 1, 0.7, 0], scaleX: [0, 2.8, 1, 0] }}
              transition={{ duration: DUR, times: [0, 0.05, 0.75, 1], ease: 'easeOut' }}
            />

            {/* ── L5: Text ───────────────────────────────────────────────────
                Single element — no bloom duplicate.
                Cinzel (font-subdisplay) is loaded; OptimusPrinceps was not. */}
            <motion.div
              className="relative pointer-events-none"
              style={{ zIndex: 10, willChange: 'opacity, transform' }}
              initial={{ opacity: 0, scaleX: 3, scale: 0.94 }}
              animate={{ opacity: [0, 1, 1, 0], scaleX: [3, 1, 1, 3], scale: [0.94, 1.04, 1.08, 1.08] }}
              transition={{ duration: DUR, times: [0, 0.08, 0.82, 1], ease }}
            >
              <h2
                className="font-subdisplay uppercase text-center leading-none tracking-widest"
                style={{
                  fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
                  color: '#76C7A8',
                  transform: 'scaleY(1.25)',
                  textShadow:
                    '0 0 18px rgba(118,199,168,0.7), ' +
                    '0 0 40px rgba(118,199,168,0.35), ' +
                    '0 8px 32px rgba(0,0,0,1)',
                  letterSpacing: '0.12em',
                }}
              >
                Humanity Restored
              </h2>
            </motion.div>

            {/* ── L6: Floor reflection ──────────────────────────────────────
                Flipped + mask gradient. Pure opacity animation.             */}
            <motion.div
              className="absolute pointer-events-none select-none"
              style={{
                zIndex: 9,
                top: '50%',
                marginTop: 'clamp(56px, 8vw, 100px)',
                willChange: 'opacity',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 55%)',
                maskImage:       'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 55%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0.45, 0] }}
              transition={{ duration: DUR, times: [0, 0.10, 0.80, 1], ease }}
            >
              <h2
                className="font-subdisplay uppercase text-center leading-none tracking-widest"
                style={{
                  fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
                  color: '#76C7A8',
                  transform: 'scaleY(-1.25)',
                  letterSpacing: '0.12em',
                }}
              >
                Humanity Restored
              </h2>
            </motion.div>

          </React.Fragment>
        )}
      </div>

      {animKey === 0 && <div style={{ height: '160px' }} />}
    </section>
  );
};
