/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Sigil } from '../shared/Sigil';
import { PROFILE } from '../../lib/data';
import { motion, AnimatePresence } from 'motion/react';
import { CornerBrackets } from '../shared/CornerBrackets';
import { Bonfire } from '../shared/Bonfire';

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => setIsSubmitted(true), 1200);
  };

  return (
    <section id="invocation" className="py-32 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <SectionHeading 
          numeral="VII" 
          title="The Invocation" 
          sigil="compass"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-display italic text-bone-faded text-2xl md:text-3xl text-center mb-4 tracking-widest"
        >
          "Speak the name. The bearer answers."
        </motion.p>

        <Bonfire className="mb-12" />

        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-24">
          <a href={`mailto:${PROFILE.email}`} className="group flex flex-col items-center gap-4 transition-transform hover:-translate-y-1">
            <Sigil variant="eye" className="w-10 h-10 text-bone-faded group-hover:text-gilt transition-colors" />
            <span className="font-subdisplay text-[10px] text-bone-faded tracking-[0.3em] uppercase group-hover:text-bone-white">Initiate Rite (Email)</span>
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-transform hover:-translate-y-1">
            <Sigil variant="serpent" className="w-10 h-10 text-bone-faded group-hover:text-gilt transition-colors" />
            <span className="font-subdisplay text-[10px] text-bone-faded tracking-[0.3em] uppercase group-hover:text-bone-white">The Web (LinkedIn)</span>
          </a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-transform hover:-translate-y-1">
            <Sigil variant="runes" className="w-10 h-10 text-bone-faded group-hover:text-gilt transition-colors" />
            <span className="font-subdisplay text-[10px] text-bone-faded tracking-[0.3em] uppercase group-hover:text-bone-white">The Forge (GitHub)</span>
          </a>
        </div>

        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                onSubmit={handleSubmit}
                className="space-y-12"
              >
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="relative group">
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-transparent border-b border-bone-faded/20 py-4 font-body placeholder:text-bone-faded/40 text-bone-white focus:outline-none focus:border-gilt transition-colors peer"
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-4 font-subdisplay text-[10px] text-bone-faded uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-gilt peer-[:not(:placeholder-shown)]:-top-6">
                      The Speaker (Name)
                    </label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" 
                      required 
                      className="w-full bg-transparent border-b border-bone-faded/20 py-4 font-body placeholder:text-bone-faded/40 text-bone-white focus:outline-none focus:border-gilt transition-colors peer"
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-4 font-subdisplay text-[10px] text-bone-faded uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-gilt peer-[:not(:placeholder-shown)]:-top-6">
                      The Sigil (Email)
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <textarea 
                    required 
                    rows={4}
                    className="w-full bg-transparent border-b border-bone-faded/20 py-4 font-body placeholder:text-bone-faded/40 text-bone-white focus:outline-none focus:border-gilt transition-colors peer resize-none"
                    placeholder=" "
                  />
                  <label className="absolute left-0 top-4 font-subdisplay text-[10px] text-bone-faded uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-gilt peer-[:not(:placeholder-shown)]:-top-6">
                    The Message
                  </label>
                </div>

                <div className="flex justify-center pt-8">
                  <motion.button 
                    type="submit"
                    whileHover={{ backgroundColor: '#3D2B1F', borderColor: '#B8935A' }}
                    className="relative px-12 py-5 border border-bone-faded/40 font-subdisplay text-xs text-bone-white tracking-[0.5em] uppercase overflow-hidden"
                  >
                    Banish Silence (Submit)
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 border border-gilt/40 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                   <Sigil variant="eye" className="w-8 h-8 text-gilt" />
                   <CornerBrackets className="text-gilt/20" size={4} />
                </div>
                <p className="font-body italic text-bone-white text-xl">
                  "The bell has been rung. He will hear."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
