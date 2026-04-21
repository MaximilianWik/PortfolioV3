/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';
import { Sigil } from '../shared/Sigil';
import { usePretextLayout } from '../../hooks/usePretextLayout';
import { DispersingText } from '../shared/DispersingText';

const StatItem: React.FC<{ label: string; value: number; prefix?: string }> = ({ label, value, prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1400;
    const stepTime = Math.abs(Math.floor(duration / value));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="p-4 relative bg-ink-deep border border-bone-faded/10 flex flex-col justify-center">
      <CornerBrackets className="text-bone-faded/20" size={6} />
      <span className="font-mono text-bone-white text-2xl mb-1">
        {prefix}{count.toString().padStart(2, '0')}
      </span>
      <span className="font-subdisplay text-[9px] tracking-tighter text-bone-faded uppercase">{label}</span>
    </div>
  );
};

export const About: React.FC = () => {
  const bio = "You find the signatory's mark in the margin. Maximilian Wikström, holder of the Information Systems rite, keeps the ledgers at DNB. His hand binds Copilot and Power Automate into instruments that spare others from repetition. He writes Python in the night hours.";
  // We use Pretext to pre-calculate the layout height for visual stability
  const layout = usePretextLayout(bio, 'italic 18px "EB Garamond"', 500, 1.6);

  return (
    <section id="about" className="py-32 px-6 max-w-6xl mx-auto">
      <SectionHeading 
        numeral="II" 
        title="The Bearer" 
        sigil="eye"
      />
      
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative flex w-full"
        >
          <div className="relative w-full mx-auto flex items-center justify-center">
            <div className="w-full relative group flex items-center justify-center">
              <img 
                src="/blackmaiden.jpg" 
                alt="Maiden in Black" 
                className="w-full h-auto object-contain opacity-85 mix-blend-luminosity grayscale-[20%] transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)'
                }}
              />
              
              {/* Extra vertical fade for the absolute top and bottom just in case it hits grid edges */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-void to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-void to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-void to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-void to-transparent pointer-events-none" />
              
              {/* Radial dark backing to ensure text remains highly legible over any image */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,5,0.75)_0%,transparent_50%)] pointer-events-none" />

              {/* Text Center Overlay */}
              <div className="absolute inset-0 text-center px-8 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="font-mono text-[9px] text-bone-faded uppercase tracking-[0.4em] mb-4">
                  The Nexus
                </div>
                <DispersingText 
                  text="“Soul of the mind, key to life's ether. Soul of the lost, withdrawn from its vessel. Let strength be granted, so the world might be mended.”"
                  className="font-body text-bone-white text-base leading-relaxed italic drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-l border-ember-blood pl-6 py-4"
            style={{ minHeight: layout.height || 'auto' }}
          >
            <div className="font-mono text-[10px] text-bone-faded uppercase tracking-widest mb-4">The Ledger Mark</div>
            <DispersingText 
              text={bio}
              className="font-body text-bone-dim text-lg leading-relaxed italic"
              style={{ width: layout.tightestWidth || 'auto' }}
            />
          </motion.div>

          <div className="grid grid-cols-3 gap-4 mt-12">
            <StatItem label="Years Active" value={6} />
            <StatItem label="Systems Tamed" value={14} />
            <StatItem label="Lingua Franca" value={7} />
          </div>
        </div>
      </div>
    </section>
  );
};
