/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sigil } from './Sigil';
import { motion } from 'motion/react';

interface SectionHeadingProps {
  numeral: string;
  title: string;
  subtitle?: string;
  sigil?: 'eye' | 'serpent' | 'trefoil' | 'runes' | 'compass';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  numeral, 
  title, 
  subtitle, 
  sigil = 'trefoil' 
}) => {
  return (
    <div className="flex flex-col items-center mb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-subdisplay text-bone-faded text-sm tracking-[0.3em] mb-4"
      >
        {numeral}.
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, letterSpacing: '0.1em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="font-display text-4xl md:text-5xl uppercase text-center mb-8"
      >
        {title}
      </motion.h2>

      <div className="flex items-center w-full max-w-sm gap-4">
        <div className="h-[1px] flex-1 bg-bone-faded opacity-30" />
        <Sigil variant={sigil} className="w-6 h-6 text-bone-dim" />
        <div className="h-[1px] flex-1 bg-bone-faded opacity-30" />
      </div>

      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 font-body italic text-bone-dim text-center max-w-md"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
