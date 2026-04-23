/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { Sigil } from '../shared/Sigil';
import { EXPERIENCE } from '../../lib/data';
import { DispersingText } from '../shared/DispersingText';

const TimelineEntry: React.FC<{ entry: typeof EXPERIENCE[0]; index: number }> = ({ entry, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <div className={`relative mb-20 md:flex ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
      {/* Date - Desktop */}
      <div className={`hidden md:flex w-1/2 ${isLeft ? 'justify-start pl-12' : 'justify-end pr-12'}`}>
        <motion.span 
          initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-mono text-bone-faded tracking-widest text-xs"
        >
          {entry.year}
        </motion.span>
      </div>

      {/* Center Sigil Marker */}
      <div className="absolute left-0 md:left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center">
        <Sigil variant="runes" className="w-8 h-8 text-bone-dim bg-ink-void p-1 rounded-full border border-bone-faded/20" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={`md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
      >
        <div className="md:hidden font-mono text-bone-faded text-[10px] tracking-widest mb-2">
          {entry.year}
        </div>
        
        <h4 className="font-display text-2xl text-bone-white mb-1 uppercase tracking-wider">
          {entry.role}
        </h4>
        
        <div className="font-subdisplay text-xs text-gilt/80 mb-4 tracking-widest">
          {entry.company}
        </div>
        
        <DispersingText 
          text={entry.description}
          className="font-body text-bone-dim text-sm italic mb-6 leading-relaxed max-w-lg md:mx-0 mx-auto"
        />
        
        <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
          {entry.skills.map((skill, i) => (
            <span 
              key={i} 
              className="px-3 py-1 border border-bone-faded/20 text-[10px] font-mono text-bone-faded uppercase tracking-tighter"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const bgGifs = useMemo(() => {
    return [
      {
        id: 0,
        x: 15,
        y: 20,
        size: 600,
        rotate: 15,
        opacity: 0.4,
        duration: 45,
        mirrored: false
      },
      {
        id: 1,
        x: 65,
        y: 50,
        size: 700,
        rotate: -15,
        opacity: 0.4,
        duration: 60,
        mirrored: true
      }
    ];
  }, []);

  return (
    <section id="chronicle" className="relative py-32 px-6 overflow-hidden">
      {/* Background Scattered GIFs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {bgGifs.map((gif) => (
          <motion.div
            key={gif.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: gif.opacity }}
            viewport={{ once: false }}
            animate={{
              y: [0, -120, 40, -80, 0],
              x: [0, 100, -60, 40, 0],
              rotate: [gif.rotate, gif.rotate + 15, gif.rotate - 15, gif.rotate],
            }}
            transition={{
              y: { duration: gif.duration, repeat: Infinity, ease: "easeInOut" },
              x: { duration: gif.duration * 1.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: gif.duration * 0.8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3 }
            }}
            style={{
              position: 'absolute',
              left: `${gif.x}%`,
              top: `${gif.y}%`,
              width: `${gif.size}px`,
              height: 'auto',
              transform: `rotate(${gif.rotate}deg)${gif.mirrored ? ' scaleX(-1)' : ''}`,
              mixBlendMode: 'screen',
              filter: 'blur(3px) grayscale(60%) contrast(110%)',
              maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)'
            }}
          >
            <img 
              src="/HumanityNoBg.gif" 
              alt="" 
              className="w-full h-auto opacity-100"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
        {/* Vignette Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-void via-transparent to-ink-void opacity-100" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-void to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-void to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading 
          numeral="IV" 
          title="The Chronicle" 
          sigil="runes"
        />
        
        <div className="relative mt-20">
          {/* Central Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-bone-faded/20 -translate-x-1/2" />
          
          <div className="space-y-12">
            {EXPERIENCE.map((entry, i) => (
              <TimelineEntry key={i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
