/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export const Navigation: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-bone-faded/30 z-50 sticky top-0 bg-ink-void/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-subdisplay text-[10px] md:text-xs tracking-[0.3em] font-bold text-bone-white"
      >
        MAXIMILIAN WIKSTRÖM
      </motion.div>
      
      <div className="hidden md:flex gap-6 lg:gap-8 font-subdisplay text-[10px] tracking-widest text-bone-dim">
        <a href="#" className="hover:text-gilt transition-colors">I. THE ASHEN ONE</a>
        <a href="#about" className="hover:text-gilt transition-colors">II. ABOUT</a>
        <a href="#highlights" className="hover:text-gilt transition-colors">III. DEEDS</a>
        <a href="#chronicle" className="hover:text-gilt transition-colors">IV. CHRONICLE</a>
        <a href="#relics" className="hover:text-gilt transition-colors">V. RELICS</a>
        <a href="#resume" className="hover:text-gilt transition-colors">VI. FORMAL HAND</a>
        <a href="#invocation" className="hover:text-gilt transition-colors">VII. INVOCATION</a>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-mono text-[9px] text-bone-faded"
      >
        STHLM // 59.3293° N
      </motion.div>
    </nav>
  );
};
