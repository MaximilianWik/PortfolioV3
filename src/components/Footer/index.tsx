/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Footer: React.FC = () => {
  const currentYearRoman = "MMXXVI"; // Manual for 2026 as per prompt, or I could use a helper

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="px-6 md:px-12 py-12 md:py-6 border-t border-bone-faded/30 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono text-bone-faded">
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

      <div className="font-subdisplay tracking-widest uppercase text-center md:text-right">
        Set in Cormorant & Cinzel // Forged in Shadow
      </div>
    </footer>
  );
};
