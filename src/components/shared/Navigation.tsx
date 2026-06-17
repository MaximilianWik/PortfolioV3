/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotatingSigil3D } from './RotatingSigil3D';

const NAV_LINKS = [
  { label: 'I. The Ashen One', href: '#' },
  { label: 'II. The Bearer',   href: '#about' },
  { label: 'III. The Chronicle', href: '#chronicle' },
  { label: 'IV. Relics',       href: '#relics' },
  { label: 'V. The Formal Hand', href: '#resume' },
  { label: 'VI. The Invocation', href: '#invocation' },
  { label: 'VII. The Arcane Tongue', href: '#arcane' },
];

// Ordered section ids matched against the viewport probe line for active-chapter
// detection. Hero is the implicit top chapter ('#').
const SECTION_IDS = ['about', 'chronicle', 'relics', 'arcane', 'resume', 'invocation'];

export const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHref, setActiveHref] = useState('#');

  // Single rAF-throttled scroll/resize handler drives both the progress ember
  // bar and the active-chapter highlight. Sections are queried live each frame
  // so lazily-mounted ones (Timeline/Projects/Resume/Contact) are picked up
  // the moment they enter the DOM.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      const probe = window.innerHeight * 0.4;
      let current = '#';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) { current = '#' + id; break; }
      }
      setActiveHref(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Spacer reserves the nav's height in document flow so content doesn't
          hide behind the fixed bar. Height matches py-4 + ~32px content. */}
      <div style={{ height: '57px' }} aria-hidden="true" />

      <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-bone-faded/30 fixed top-0 inset-x-0 z-[90] bg-ink-void/90 backdrop-blur-sm">

        {/* Scroll-progress ember bar — fills along the nav's lower edge as the
            visitor descends the page. Pure transform, no layout cost. */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-[2px] bg-ember-blood origin-left shadow-[0_0_8px_rgba(139,26,26,0.7)] will-change-transform"
          style={{ transform: `scaleX(${progress})` }}
        />

        {/* Left: sigil + name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <RotatingSigil3D size={32} baseSpeed={0.55} onClick={scrollTop} />
          <button
            onClick={scrollTop}
            className="font-subdisplay text-[10px] md:text-xs tracking-[0.3em] font-bold text-bone-dim hover:text-gilt transition-colors duration-300"
          >
            MAXIMILIAN WIKSTRÖM
          </button>
        </motion.div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-6 lg:gap-8 font-subdisplay text-[10px] tracking-widest text-bone-dim">
          {NAV_LINKS.map(l => {
            const active = activeHref === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? 'true' : undefined}
                className={`relative transition-colors ${active ? 'text-gilt' : 'hover:text-gilt'}`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gilt"
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right: coordinates + mobile hamburger */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[9px] text-bone-faded hidden md:block"
          >
            STHLM // 59.3293° N
          </motion.div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 z-[110] relative"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-px bg-bone-dim"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-px bg-bone-dim"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-px bg-bone-dim"
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center md:hidden"
            style={{ background: 'rgba(7,7,10,0.97)', backdropFilter: 'blur(12px)' }}
            onClick={close}
          >
            {/* Decorative ember line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-ember-blood/40" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-ember-blood/20" />

            <nav className="flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
              {NAV_LINKS.map((l, i) => {
                const active = activeHref === l.href;
                return (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    aria-current={active ? 'true' : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    onClick={close}
                    className={`font-subdisplay text-sm tracking-[0.3em] transition-colors uppercase ${active ? 'text-gilt' : 'text-bone-dim hover:text-gilt'}`}
                  >
                    {l.label}
                  </motion.a>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 font-mono text-[9px] text-bone-faded tracking-widest"
              >
                STHLM // 59.3293° N
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
