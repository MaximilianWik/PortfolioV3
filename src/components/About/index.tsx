/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Bearer — Scroll Cinematic
 *
 * Three acts, one sticky viewport. The section is 280vh tall; the inner
 * container stays fixed at 100svh and the Framer Motion scroll transforms
 * play out as the user scrolls through the extra height.
 *
 * Act I   (0.00 – 0.35): blackmaiden full-bleed, "THE BEARER" slams in.
 * Act II  (0.32 – 0.66): image fades back, opening statement fills the void.
 * Act III (0.63 – 1.00): image left-column, identity/education/philosophy.
 *
 * No sticky polyfill needed — `position: sticky` is supported in all targets.
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import { CornerBrackets } from '../shared/CornerBrackets';
import { Sigil } from '../shared/Sigil';

// ─── Counting stat ────────────────────────────────────────────────────────────

const Stat: React.FC<{ value: number; label: string; trigger: boolean }> = ({
  value, label, trigger,
}) => {
  const [count, setCount] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    if (!trigger || fired.current) return;
    fired.current = true;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, value]);

  return (
    <div className="relative p-4 border border-bone-faded/10 bg-ink-deep/80 flex flex-col">
      <CornerBrackets className="text-bone-faded/20" size={5} />
      <span className="font-mono text-bone-white text-xl mb-0.5">
        {String(count).padStart(2, '0')}
      </span>
      <span className="font-subdisplay text-[9px] tracking-tighter text-bone-faded uppercase">
        {label}
      </span>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Drive progress manually so it works with Lenis's custom RAF loop.
  // useScroll reads window.scrollY via browser scroll events which fire
  // one frame after Lenis updates the position — causing missed thresholds.
  // A raw scroll listener on window always reads the current scrollY.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const compute = () => {
      const sectionTop    = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const vh            = window.innerHeight;
      const raw = (window.scrollY - sectionTop) / (sectionHeight - vh);
      scrollYProgress.set(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    // Delay slightly so the page has finished its first layout pass.
    const t = setTimeout(compute, 80);

    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
      clearTimeout(t);
    };
  }, [scrollYProgress]);

  // ── Act I — background image + title ────────────────────────────────────────
  const bgOpacity    = useTransform(scrollYProgress, [0, 0.08, 0.50, 0.66], [0, 1, 1, 0]);
  const bgScale      = useTransform(scrollYProgress, [0, 0.55], [1.07, 1.0]);
  const bgBlur       = useTransform(
    scrollYProgress, [0, 0.09, 0.36, 0.52],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'],
  );
  const titleY       = useTransform(scrollYProgress, [0.04, 0.15], [80, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.04, 0.15, 0.27, 0.36], [0, 1, 1, 0]);
  const numeralOp    = useTransform(scrollYProgress, [0.02, 0.11, 0.27, 0.36], [0, 1, 1, 0]);

  // ── Act II — opening statement ───────────────────────────────────────────────
  const line1Op = useTransform(scrollYProgress, [0.32, 0.43, 0.58, 0.66], [0, 1, 1, 0]);
  const line1Y  = useTransform(scrollYProgress, [0.32, 0.43], [28, 0]);
  const line2Op = useTransform(scrollYProgress, [0.39, 0.50, 0.58, 0.66], [0, 1, 1, 0]);
  const line2Y  = useTransform(scrollYProgress, [0.39, 0.50], [28, 0]);
  const dividerX = useTransform(scrollYProgress, [0.44, 0.54], [0, 1]);

  // ── Act III — content ────────────────────────────────────────────────────────
  const ch3Op     = useTransform(scrollYProgress, [0.63, 0.76], [0, 1]);
  const imgColY   = useTransform(scrollYProgress, [0.63, 0.76], [50, 0]);
  const colAOp    = useTransform(scrollYProgress, [0.66, 0.78], [0, 1]);
  const colAY     = useTransform(scrollYProgress, [0.66, 0.78], [50, 0]);
  const colBOp    = useTransform(scrollYProgress, [0.70, 0.82], [0, 1]);
  const colBY     = useTransform(scrollYProgress, [0.70, 0.82], [50, 0]);

  // Trigger stat counters once Act III is visible
  const [statsTrigger, setStatsTrigger] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.72) setStatsTrigger(true);
  });

  return (
    // Extra height gives the scroll room for all three acts
    <section id="about" ref={sectionRef} style={{ height: '280vh' }}>

      {/* ── Sticky viewport ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Background image (Act I & II) ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: bgOpacity, scale: bgScale, filter: bgBlur }}
        >
          <img
            src="/blackmaiden.jpg"
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          {/* Edge vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t  from-ink-void via-transparent   to-ink-void/70" />
          <div className="absolute inset-0 bg-gradient-to-r  from-ink-void/80 to-ink-void/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,7,10,0.7)_100%)]" />
        </motion.div>

        {/* ── Act I — Title ─────────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            style={{ opacity: numeralOp }}
            className="font-mono text-[11px] text-bone-faded tracking-[0.5em] uppercase mb-6"
          >
            II.
          </motion.div>
          <motion.h2
            style={{ opacity: titleOpacity, y: titleY }}
            className="font-display text-center uppercase"
            aria-label="The Bearer"
          >
            <span className="block text-[clamp(3.5rem,10vw,9rem)] tracking-[0.12em] text-bone-white leading-none">
              The Bearer
            </span>
          </motion.h2>
        </div>

        {/* ── Act II — Statement ────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none">
          <div className="max-w-3xl w-full text-center">
            <motion.p
              style={{ opacity: line1Op, y: line1Y, fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)' }}
              className="font-body italic leading-snug text-bone-white"
            >
              I build AI agents and automation systems
              <br className="hidden md:block" /> for regulated environments.
            </motion.p>

            <motion.div
              style={{ scaleX: dividerX, opacity: line1Op, maxWidth: '6rem' }}
              className="mx-auto my-6 h-px bg-ember-blood origin-left"
              aria-hidden="true"
            />

            <motion.p
              style={{ opacity: line2Op, y: line2Y, fontSize: 'clamp(1.1rem, 2.8vw, 2rem)' }}
              className="font-body italic leading-snug text-bone-dim"
            >
              Places where code has to be right{' '}
              <em className="not-italic text-gilt">the first time</em>
              {' '}— and every time after.
            </motion.p>
          </div>
        </div>

        {/* ── Act III — Content ─────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: ch3Op }}
          className="absolute inset-0 flex items-center"
        >
          <div className="w-full max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-center">

            {/* Portrait + status */}
            <motion.div
              style={{ opacity: ch3Op, y: imgColY }}
              className="md:col-span-4 hidden md:block"
            >
              <div className="relative">
                <img
                  src="/blackmaiden.jpg"
                  alt="Maximilian Wikström"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain opacity-90"
                  style={{
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
                    maxHeight: '55vh',
                    objectPosition: 'center top',
                  }}
                />
              </div>
              {/* Status panel */}
              <div className="mt-4 p-4 border border-bone-faded/10 bg-ink-deep/80 relative">
                <CornerBrackets className="text-bone-faded/20" size={7} />
                <div className="space-y-2.5">
                  {[
                    ['Location', 'Stockholm'],
                    ['Status', 'Active'],
                    ['Domain', 'DNB Bank'],
                    ['Focus', 'Agentic AI'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">{k}</span>
                      <span className={`font-mono text-[10px] ${k === 'Status' ? 'text-gilt flex items-center gap-1.5' : 'text-bone-white'}`}>
                        {k === 'Status' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gilt animate-pulse inline-block" />
                        )}
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Current role + education */}
            <motion.div
              style={{ opacity: colAOp, y: colAY }}
              className="md:col-span-4 flex flex-col gap-7"
            >
              {/* Current */}
              <div className="border-l border-gilt/40 pl-5">
                <div className="font-mono text-[9px] text-gilt uppercase tracking-widest mb-2">
                  Current Domain
                </div>
                <div className="font-display text-xl text-bone-white uppercase tracking-wider mb-0.5">
                  AI & Automation Specialist
                </div>
                <div className="font-subdisplay text-[10px] text-bone-faded tracking-widest mb-3">
                  Consulting IT — DNB Bank
                </div>
                <p className="font-body text-bone-dim text-sm italic leading-relaxed">
                  Copilot Studio agents, Power Automate workflows, SailPoint
                  identity governance. Enterprise automation where the cost
                  of failure is real.
                </p>
              </div>

              {/* Thesis */}
              <div className="border-l border-ember-blood/30 pl-5">
                <div className="font-mono text-[9px] text-ember-blood/70 uppercase tracking-widest mb-2">
                  Thesis — SEB Bank
                </div>
                <div className="font-display text-base text-bone-white uppercase tracking-wider mb-1">
                  Agentic AI in Regulated Finance
                </div>
                <p className="font-body text-bone-dim text-xs italic leading-relaxed">
                  How to make autonomous agents reliable enough to trust
                  inside a bank.
                </p>
              </div>

              {/* Education */}
              <div className="border-l border-bone-faded/20 pl-5">
                <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-2">
                  Rites of Study
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-display text-sm text-bone-white uppercase tracking-wider">
                      BSc — Information Systems
                    </div>
                    <div className="font-subdisplay text-[9px] text-bone-faded tracking-widest">
                      Örebro University · 2023–2026
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-sm text-bone-white uppercase tracking-wider">
                      Exchange — International Business
                    </div>
                    <div className="font-subdisplay text-[9px] text-bone-faded tracking-widest">
                      Nuremberg Institute of Technology · 2024–2025
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Philosophy + projects + stats */}
            <motion.div
              style={{ opacity: colBOp, y: colBY }}
              className="md:col-span-4 flex flex-col gap-7"
            >
              {/* Philosophy */}
              <blockquote className="border-l border-ember-blood/40 pl-5">
                <p className="font-body text-bone-dim text-base italic leading-relaxed">
                  "Software that is well-specified, well-verified, and built
                  to outlast the people who wrote it."
                </p>
              </blockquote>

              {/* Side projects */}
              <div>
                <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-3">
                  Forged Outside of Work
                </div>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Tessera',
                      desc: 'ISO/IEC 18004 verified QR generator — built for tattoo QRs.',
                      href: 'https://tessera-neon.vercel.app/',
                    },
                    {
                      name: 'Cursed Echoes',
                      desc: 'Dark Souls–flavored browser typing survival game.',
                      href: 'https://cursedechoes.vercel.app/',
                    },
                    {
                      name: 'Subdermal',
                      desc: 'Collaborative canvas behind a QR tattoo on my arm.',
                      href: 'https://max-wik.com/',
                    },
                  ].map(({ name, desc, href }) => (
                    <motion.a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-3 group"
                    >
                      <span className="text-ember-blood/60 font-mono text-xs mt-0.5 flex-shrink-0">›</span>
                      <div>
                        <span className="font-display text-sm text-bone-white uppercase tracking-wider group-hover:text-gilt transition-colors duration-300">
                          {name}
                        </span>
                        <p className="font-body text-bone-faded/80 text-xs italic leading-snug mt-0.5">
                          {desc}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <Stat value={6}  label="Years Active"   trigger={statsTrigger} />
                <Stat value={19} label="Systems Tamed"  trigger={statsTrigger} />
                <Stat value={8}  label="Lingua Franca"  trigger={statsTrigger} />
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Scroll indicator (Act I only) */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[9px] text-bone-faded/50 tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-bone-faded/20 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 32] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-2 bg-ember-blood"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
