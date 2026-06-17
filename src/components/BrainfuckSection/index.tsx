/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { RevealOnScroll } from '../shared/RevealOnScroll';
import { BrainfuckVisualizer } from '../shared/BrainfuckVisualizer';

export const BrainfuckSection: React.FC = () => (
  <section id="arcane" className="py-32 relative">
    {/* Faint ember glow behind the section */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 30% at 50% 50%, rgba(139,26,26,0.04) 0%, transparent 70%)',
      }}
    />

    <SectionHeading
      numeral="V"
      title="The Arcane Tongue"
      sigil="runes"
      subtitle="Eight sigils. Infinite torment. A Turing-complete incantation older than modern thought."
    />

    <RevealOnScroll>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Lore blurb */}
        <p className="font-body italic text-bone-dim text-center text-sm leading-relaxed">
          In 1993, Urban Müller forged a language of eight commands and nothing else.
          No variables. No types. No mercy. Behold the machine laid bare — every
          instruction, every cell, every step of the computation visible and unadorned.
        </p>

        {/* The visualizer */}
        <BrainfuckVisualizer />

        {/* Subtle hint — lore-flavoured, not a spoiler */}
        <p className="font-mono text-[9px] text-bone-faded/30 text-center uppercase tracking-[0.3em]">
          ↑↑↓↓←→ — Those who know the old codes may find deeper truths.
        </p>
      </div>
    </RevealOnScroll>
  </section>
);
