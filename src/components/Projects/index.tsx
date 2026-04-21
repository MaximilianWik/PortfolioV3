/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';
import { PROJECTS } from '../../lib/data';
import { RevealOnScroll } from '../shared/RevealOnScroll';

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
            <RevealOnScroll 
              key={project.id} 
              delay={i * 0.1}
              className="group relative bg-ink-deep border border-bone-faded/10 p-10 transition-all duration-500 hover:bg-ink-iron hover:-translate-y-1"
            >
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
                  <span key={j} className="font-mono text-[9px] text-bone-faded uppercase tracking-widest px-2 py-1 bg-ink-void/50 border border-bone-faded/10 group-hover:border-gilt/30 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-subdisplay text-[10px] text-bone-white tracking-[0.3em] uppercase hover:text-gilt transition-colors border-b border-bone-faded/30 pb-1"
                >
                  View Artifact
                </a>
                <span className="font-mono text-[8px] text-bone-faded uppercase tracking-widest opacity-50">
                  // Representative
                </span>
              </div>

              <CornerBrackets className="text-bone-faded/10 group-hover:border-gilt transition-colors duration-500" />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
