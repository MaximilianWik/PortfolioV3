/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainfuckVisualizer } from './BrainfuckVisualizer';
import { BF_YOU_DIED } from './BrainfuckEngine';

// ↑ ↑ ↓ ↓ ← →
const KONAMI: string[] = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
];

/**
 * Global easter egg overlay.
 * Mount once in App. Listens for the Konami code — when matched, slides in a
 * fullscreen BF interpreter running "YOU DIED". ESC or click-outside dismisses.
 */
export const KonamiTerminal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0); // how far through KONAMI we are

  const dismiss = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Dismiss on ESC regardless of sequence state
      if (e.key === 'Escape') { dismiss(); return; }

      const expected = KONAMI[progress];
      const pressed = e.key.toLowerCase() === expected.toLowerCase()
        || e.key === expected;

      if (pressed) {
        const next = progress + 1;
        if (next === KONAMI.length) {
          setProgress(0);
          setOpen(true);
        } else {
          setProgress(next);
        }
      } else {
        // Wrong key — restart sequence, but check if this key starts a new attempt
        const restart = e.key.toLowerCase() === KONAMI[0].toLowerCase() || e.key === KONAMI[0];
        setProgress(restart ? 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [progress, dismiss]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="konami-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(7,7,10,0.97)', backdropFilter: 'blur(16px)' }}
          onClick={dismiss}
        >
          {/* Decorative ember lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-ember-blood/50 shadow-[0_0_12px_rgba(139,26,26,0.8)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-ember-blood/30" />

          {/* Panel — stop propagation so clicks inside don't dismiss */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[9px] text-ember-blood uppercase tracking-[0.3em] mb-1">
                  // SEQUENCE ACKNOWLEDGED //
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-bone-white uppercase tracking-[0.2em]">
                  Arcane Tongue
                </h2>
                <p className="font-body italic text-bone-dim text-sm mt-1">
                  The machine speaks in pain. This is its confession.
                </p>
              </div>

              <button
                onClick={dismiss}
                className="font-mono text-[10px] uppercase tracking-widest text-bone-faded border border-bone-faded/20 px-3 py-1.5 hover:text-ember-blood hover:border-ember-blood/50 transition-colors mt-1"
              >
                ESC
              </button>
            </div>

            {/* ── BF visualizer ──────────────────────────────────────────── */}
            <BrainfuckVisualizer
              lockedCode={BF_YOU_DIED}
              autoPlay
              initialSpeed={30}
            />

            {/* ── Footer hint ────────────────────────────────────────────── */}
            <div className="flex justify-between items-center">
              <div className="font-mono text-[8px] text-bone-faded/40 uppercase tracking-widest">
                ↑↑↓↓←→
              </div>
              <div className="font-mono text-[8px] text-bone-faded/40 uppercase tracking-widest">
                [ ESC OR CLICK OUTSIDE TO DISPEL ]
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
