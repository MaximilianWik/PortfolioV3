/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Integer → Roman numeral. Used for the "Last Sync" stamp so it stays correct
// across year boundaries without manual edits.
const toRoman = (n: number): string => {
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [value, symbol] of table) {
    while (n >= value) { out += symbol; n -= value; }
  }
  return out;
};

export const Footer: React.FC = () => {
  const currentYearRoman = toRoman(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="px-6 md:px-12 py-8 md:py-6 border-t border-bone-faded/30 flex flex-col gap-6 text-[10px] font-mono text-bone-faded">
      {/* Cross-links to my other shrines — bidirectional identity graph for SEO. */}
      <nav
        aria-label="Other works by Maximilian Wikström"
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-6 pb-4 border-b border-bone-faded/15"
      >
        <span className="font-subdisplay uppercase tracking-[0.2em] text-bone-faded/70">
          Other Shrines
        </span>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 uppercase tracking-[0.15em]">
          <li>
            <a href="https://max-wik.com/" rel="author me" className="hover:text-gilt transition-colors">
              max-wik.com
            </a>
          </li>
          <li>
            <a href="https://tessera-neon.vercel.app/" rel="me" className="hover:text-gilt transition-colors">
              Tessera
            </a>
          </li>
          <li>
            <a href="https://cursedechoes.vercel.app/" rel="me" className="hover:text-gilt transition-colors">
              Cursed Echoes
            </a>
          </li>
          <li>
            <a href="https://github.com/MaximilianWik" rel="me" className="hover:text-gilt transition-colors">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/max_wik/" rel="me" className="hover:text-gilt transition-colors">
              Instagram
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 uppercase items-center md:items-start">
          <span>Status: <span className="text-gilt">Available</span></span>
          <span>Loc: Stockholm, Sweden</span>
          <span>Last Sync: {currentYearRoman}</span>
        </div>

        <button
          onClick={scrollToTop}
          className="group font-subdisplay hover:text-gilt transition-colors flex items-center gap-2 uppercase tracking-[0.2em]"
        >
          <span className="transition-transform group-hover:-translate-y-1">^</span>
          Return to the Ledger
        </button>

        <a
          href="/the-void-calls"
          className="font-mono text-[8px] text-bone-faded/25 hover:text-ember-blood/50 transition-colors tracking-widest uppercase"
          title="Test 404 page"
        >
          [404]
        </a>

        <div className="font-subdisplay tracking-widest uppercase text-center md:text-right">
          Set in Cormorant & Cinzel // Forged in Shadow
        </div>
      </div>
    </footer>
  );
};
