/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotatingSigil3D } from './RotatingSigil3D';

const NAV_LINKS = [
  { label: 'I. The Ashen One',      href: '#' },
  { label: 'II. The Bearer',        href: '#about' },
  { label: 'III. The Chronicle',    href: '#chronicle' },
  { label: 'IV. Relics',            href: '#relics' },
  { label: 'V. The Arcane Tongue',  href: '#arcane' },
  { label: 'VI. The Formal Hand',   href: '#resume' },
  { label: 'VII. The Invocation',   href: '#invocation' },
];

// Ordered section ids matched against the viewport probe line for active-chapter
// detection. Hero is the implicit top chapter ('#').
const SECTION_IDS = ['about', 'chronicle', 'relics', 'arcane', 'resume', 'invocation'];

// ─── Cinders toggle - a small glowing flame button ─────────────────────────────
// Off by default. A soft ember pulse ring breathes outward while off to draw
// the eye toward the control; once lit, the flame itself flickers in place.
const CindersToggle: React.FC<{ on: boolean; onToggle: () => void; size?: number }> = ({
  on, onToggle, size = 30,
}) => (
  <motion.button
    onClick={onToggle}
    aria-pressed={on}
    aria-label="Toggle cinders overlay"
    title={on ? 'Cinders: burning' : 'Cinders: dormant - click to ignite'}
    className="relative flex items-center justify-center rounded-full flex-shrink-0"
    style={{ width: size, height: size }}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.88 }}
  >
    {/* Attention-drawing pulse ring - only while dormant */}
    {!on && (
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: 'rgba(139,26,26,0.7)' }}
        animate={{ scale: [1, 1.8], opacity: [0.65, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
      />
    )}

    {/* Base ring + glow */}
    <span
      aria-hidden="true"
      className="absolute inset-0 rounded-full border transition-colors duration-500"
      style={{
        borderColor: on ? '#B8935A' : 'rgba(92,88,79,0.55)',
        background: on
          ? 'radial-gradient(circle, rgba(139,26,26,0.5), rgba(139,26,26,0.05) 70%)'
          : 'transparent',
        boxShadow: on ? '0 0 14px 2px rgba(139,26,26,0.55)' : 'none',
      }}
    />

    {/* Flame glyph - flickers continuously once lit */}
    <motion.svg
      viewBox="0 0 24 24"
      width={size * 0.5}
      height={size * 0.5}
      className="relative z-10"
      animate={on ? { opacity: [0.82, 1, 0.82], scale: [1, 1.1, 1] } : { opacity: 0.5, scale: 1 }}
      transition={on ? { duration: 1.3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
    >
      <path
        d="M12 2C9 6 6 9 6 13a6 6 0 1 0 12 0c0-4-3-7-6-11z"
        fill={on ? '#F0A25C' : 'none'}
        stroke={on ? '#B8935A' : '#5C584F'}
        strokeWidth={1.4}
      />
    </motion.svg>
  </motion.button>
);

interface NavigationProps {
  cindersOn: boolean;
  onToggleCinders: () => void;
  showBearer: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ cindersOn, onToggleCinders, showBearer }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#');
  const navLinks = showBearer ? NAV_LINKS : NAV_LINKS.filter(link => link.href !== '#about');
  const sectionIds = showBearer ? SECTION_IDS : SECTION_IDS.filter(id => id !== 'about');

  // rAF-throttled scroll/resize handler drives the active-chapter highlight.
  // Sections are queried live each frame so lazily-mounted ones
  // (Timeline/Projects/Resume/Contact) are picked up the moment they enter the DOM.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = window.innerHeight * 0.4;
      let current = '#';
      for (const id of sectionIds) {
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
  }, [showBearer]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Spacer reserves the nav's height in document flow so content doesn't
          hide behind the fixed bar. Height matches py-4 + ~32px content. */}
      <div style={{ height: '57px' }} aria-hidden="true" />

      <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-bone-faded/30 fixed top-0 inset-x-0 z-[90] bg-ink-void/90 backdrop-blur-sm">

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
          {navLinks.map(l => {
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

        {/* Right: cinders toggle + coordinates + mobile hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <CindersToggle on={cindersOn} onToggle={onToggleCinders} size={30} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[9px] text-bone-faded hidden md:block"
          >
            STHLM // 59.3293° N
          </motion.div>

          {/* Hamburger - mobile only */}
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
              {navLinks.map((l, i) => {
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.07 }}
                className="flex flex-col items-center gap-2"
              >
                <CindersToggle on={cindersOn} onToggle={onToggleCinders} size={44} />
                <span className="font-subdisplay text-[10px] tracking-[0.3em] uppercase text-bone-faded">
                  Cinders {cindersOn ? 'Burning' : 'Dormant'}
                </span>
              </motion.div>

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
