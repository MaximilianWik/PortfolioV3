/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import VanillaTilt from 'vanilla-tilt';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';
import { PROJECTS } from '../../lib/data';
import { RevealOnScroll } from '../shared/RevealOnScroll';

const RelicCard: React.FC<{ project: typeof PROJECTS[0], index: number }> = ({ project, index }) => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 5,
        speed: 600,
        reverse: true,
        glare: true,
        'max-glare': 0.1,
      });
    }
  }, []);

  return (
    <RevealOnScroll delay={index * 0.1}>
      <div 
        ref={tiltRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-ink-deep border border-bone-faded/10 p-10 transition-colors duration-500 hover:bg-ink-iron cursor-pointer overflow-hidden"
      >
        {/* Fill Outline Effects */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-ember-blood scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20" />
        <div className="absolute top-0 right-0 h-full w-[1px] bg-ember-blood scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top z-20" />
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-ember-blood scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right z-20" />
        <div className="absolute bottom-0 left-0 h-full w-[1px] bg-ember-blood scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom z-20" />

        <div className="absolute top-6 right-8 font-subdisplay text-3xl text-bone-faded/20 group-hover:text-gilt/20 transition-colors pointer-events-none">
          {project.id}
        </div>
        
        <h4 className="font-display text-2xl text-bone-white mb-2 uppercase tracking-wide transition-colors group-hover:text-soul-pale">
          {project.title}
        </h4>
        
        <p className="font-body italic text-bone-dim text-sm mb-8 max-w-xs leading-relaxed">
          "{project.subtitle}"
        </p>
        
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tech.map((t, j) => (
            <span key={j} className="font-mono text-[9px] text-bone-faded uppercase tracking-widest px-2 py-1 bg-ink-void/50 border border-bone-faded/10 group-hover:border-gilt/30 transition-colors relative z-10">
              {t}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <motion.a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ y: -3, color: '#B8935A', textShadow: '0px 0px 8px rgba(184,147,90,0.8)', borderColor: '#B8935A' }}
            transition={{ duration: 0.3 }}
            className="inline-block font-subdisplay text-[10px] text-bone-white tracking-[0.3em] uppercase border-b border-bone-faded/30 pb-1"
          >
            View Artifact
          </motion.a>
          <span className="font-mono text-[8px] text-bone-faded uppercase tracking-widest opacity-50">
            // Representative
          </span>
        </div>

        <CornerBrackets className="text-bone-faded/10 group-hover:text-gilt transition-colors duration-500" />
      </div>
    </RevealOnScroll>
  );
};

export const Projects: React.FC = () => {
  return (
    <section id="relics" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading 
          numeral="V" 
          title="Relics Unearthed" 
          sigil="trefoil"
        />
        
        <div className="grid md:grid-cols-2 gap-10">
          {PROJECTS.map((project, i) => (
            <RelicCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
