/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Bearer — Three-Act Cinematic
 *
 * Three full-viewport sections stacked vertically. Each act reveals its
 * content via whileInView as it enters the viewport. Framer Motion stagger
 * variants handle word-level reveals in Act II. Acts use once:false so they
 * replay when the user scrolls back up. No sticky, no useScroll, no RAF loop
 * — fully compatible with Lenis's custom scroll management.
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CornerBrackets } from '../shared/CornerBrackets';

// ─── Stat counter ─────────────────────────────────────────────────────────────

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const ref  = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
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
  }, [inView, value]);

  return (
    <div ref={ref} className="relative p-4 border border-bone-faded/10 bg-ink-deep/80 flex flex-col">
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

// ─── Word stagger variant ─────────────────────────────────────────────────────

const sentenceVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show:   { opacity: 1, y:  0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const About: React.FC = () => {
  const line1Words = 'I build AI agents and automation systems for regulated environments.'.split(' ');
  const line2Words = 'Places where code has to be right the first time — and every time after.'.split(' ');

  return (
    <section id="about">

      {/* ══════════════════════════════════════════════════════════════════════
          ACT I — The Arrival
          Full-viewport image, "THE BEARER" title slams in.
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Background image */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          whileInView={{ scale: 1.0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
        >
          <img
            src="/blackmaiden.jpg"
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t  from-ink-void via-ink-void/40 to-ink-void/60" />
          <div className="absolute inset-0 bg-gradient-to-r  from-ink-void/70 to-ink-void/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(7,7,10,0.65)_100%)]" />
        </motion.div>

        {/* Title */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.45em' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-mono text-[11px] text-bone-faded uppercase mb-6"
          >
            II.
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display uppercase text-bone-white leading-none tracking-[0.1em]"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 9.5rem)' }}
          >
            The Bearer
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            className="mt-6 h-px bg-ember-blood origin-center"
            style={{ width: 'clamp(3rem, 8vw, 6rem)' }}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] text-bone-faded/40 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-bone-faded/15 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 32] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-2 bg-ember-blood"
            />
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ACT II — The Statement
          Dark void, opening statement word by word.
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Ghost image at very low opacity */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <img
            src="/blackmaiden.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'blur(2px) grayscale(80%)' }}
          />
          <div className="absolute inset-0 bg-ink-void/80" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">

          {/* Line 1 */}
          <motion.div
            variants={sentenceVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.6 }}
            className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)' }}
          >
            {line1Words.map((w, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="font-body italic text-bone-white inline-block"
              >
                {w}
              </motion.span>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
            className="mx-auto my-7 h-px bg-ember-blood origin-left w-16"
          />

          {/* Line 2 */}
          <motion.div
            variants={sentenceVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.6 }}
            transition={{ delayChildren: 0.7 }}
            className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1"
            style={{ fontSize: 'clamp(1.1rem, 2.8vw, 2rem)' }}
          >
            {line2Words.map((w, i) => {
              const isAccent = w === 'first' || w === 'time';
              return (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className={`font-body italic inline-block ${isAccent ? 'text-gilt not-italic' : 'text-bone-dim'}`}
                >
                  {w}
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ACT III — The Identity
          Portrait + career + philosophy, three columns staggered.
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative py-24 overflow-hidden">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-start">

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="md:col-span-4 hidden md:block"
          >
            <div className="relative">
              <img
                src="/blackmaiden.jpg"
                alt="Maximilian Wikström"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain opacity-85 transition-opacity duration-700 hover:opacity-100"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 88%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 88%)',
                  maxHeight: '55vh',
                  objectPosition: 'center top',
                }}
              />
            </div>
            {/* Status panel */}
            <div className="mt-4 p-4 border border-bone-faded/10 bg-ink-deep relative">
              <CornerBrackets className="text-bone-faded/20" size={7} />
              {[
                ['Location', 'Stockholm',  false],
                ['Status',   'Active',     true ],
                ['Domain',   'DNB Bank',   false],
                ['Focus',    'Agentic AI', false],
              ].map(([k, v, pulse]) => (
                <div key={String(k)} className="flex justify-between items-center py-1">
                  <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">{k}</span>
                  <span className={`font-mono text-[10px] flex items-center gap-1.5 ${pulse ? 'text-gilt' : 'text-bone-white'}`}>
                    {pulse && <span className="w-1.5 h-1.5 rounded-full bg-gilt animate-pulse inline-block" />}
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="md:col-span-4 flex flex-col gap-7"
          >
            <div className="border-l border-gilt/40 pl-5">
              <div className="font-mono text-[9px] text-gilt uppercase tracking-widest mb-2">Current</div>
              <div className="font-display text-xl text-bone-white uppercase tracking-wider mb-1">
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

            <div className="border-l border-ember-blood/30 pl-5">
              <div className="font-mono text-[9px] text-ember-blood/70 uppercase tracking-widest mb-2">
                Thesis — SEB
              </div>
              <div className="font-display text-base text-bone-white uppercase tracking-wider mb-1">
                Agentic AI in Regulated Finance
              </div>
              <p className="font-body text-bone-dim text-xs italic leading-relaxed">
                How to make autonomous agents reliable enough to trust inside a bank.
              </p>
            </div>

            <div className="border-l border-bone-faded/20 pl-5">
              <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-2">
                Education
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
                    Nuremberg · 2024–2025
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Stat value={6}  label="Years Active"  />
              <Stat value={19} label="Systems Tamed" />
              <Stat value={8}  label="Lingua Franca" />
            </div>
          </motion.div>

          {/* Philosophy + projects */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="md:col-span-4 flex flex-col gap-7"
          >
            <blockquote className="border-l border-ember-blood/40 pl-5">
              <p className="font-body text-bone-dim text-base italic leading-relaxed">
                "Software that is well-specified, well-verified, and built
                to outlast the people who wrote it."
              </p>
            </blockquote>

            <div>
              <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-4">
                Forged Outside of Work
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Tessera',       desc: 'ISO/IEC 18004 verified QR generator built for tattoo QRs.', href: 'https://tessera-neon.vercel.app/' },
                  { name: 'Cursed Echoes', desc: 'Dark Souls–flavored browser typing survival game.',         href: 'https://cursedechoes.vercel.app/' },
                  { name: 'Subdermal',     desc: 'Collaborative canvas behind a QR tattoo on my arm.',        href: 'https://max-wik.com/' },
                ].map(({ name, desc, href }) => (
                  <motion.a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-ember-blood/50 mt-0.5 flex-shrink-0 font-mono text-xs">›</span>
                    <div>
                      <span className="font-display text-sm text-bone-white uppercase tracking-wider group-hover:text-gilt transition-colors duration-300">
                        {name}
                      </span>
                      <p className="font-body text-bone-faded text-xs italic leading-snug mt-0.5">{desc}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
};
