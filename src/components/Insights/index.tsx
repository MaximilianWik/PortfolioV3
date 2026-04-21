/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';
import { SkillRadar, DomainsBar, ToolsDonut, CareerArea } from './Charts';
import { RevealOnScroll } from '../shared/RevealOnScroll';
import { DispersingText } from '../shared/DispersingText';

export const Insights: React.FC = () => {
  return (
    <section id="glyphs" className="relative py-32 px-6 overflow-hidden">
      {/* Background Imagery */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div className="w-full h-[120%] relative opacity-[0.15]">
          <img 
            src="/bonfire.jpg" 
            alt="Bonfire Background" 
            className="w-full h-full object-cover object-bottom mix-blend-luminosity grayscale-[50%]"
          />
        </div>
        <div className="absolute inset-0 bg-ink-void/60 backdrop-blur-[2px]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-void to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-void to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <SectionHeading 
          numeral="V" 
          title="The Glyphs Laid Bare" 
          sigil="runes"
        />

        {/* Thematic Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="w-[1px] h-8 bg-ember-blood/50 mx-auto mb-6" />
          <DispersingText 
            text="“The flow of time itself is convoluted; with heroes centuries old phasing in and out. The very fabric wavers, and relations shift and obscure.”"
            className="font-body text-bone-dim text-lg leading-relaxed italic drop-shadow-xl"
          />
          <p className="mt-6 font-mono text-[10px] text-gilt uppercase tracking-widest">
            A distillation of profound attributes, etched into the dark.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative">
          <RevealOnScroll className="bg-ink-void/40 backdrop-blur-md p-8 md:p-12 border border-gilt/20 drop-shadow-2xl relative h-[450px] group transition-all duration-700 hover:bg-ink-void/60 hover:border-gilt/40">
            <h3 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-10 border-b border-gilt/10 pb-4 text-center">V.a — Skill Proficiency</h3>
            <div className="h-[280px]">
              <SkillRadar />
            </div>
            <CornerBrackets className="text-gilt/20 transition-colors group-hover:text-gilt/50" />
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className="bg-ink-void/40 backdrop-blur-md p-8 md:p-12 border border-gilt/20 drop-shadow-2xl relative h-[450px] group transition-all duration-700 hover:bg-ink-void/60 hover:border-gilt/40">
             <h3 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-10 border-b border-gilt/10 pb-4 text-center">V.b — The Domains of Assembly</h3>
             <div className="h-[280px]">
               <DomainsBar />
             </div>
             <CornerBrackets className="text-gilt/20 transition-colors group-hover:text-gilt/50" />
          </RevealOnScroll>

          <RevealOnScroll delay={0.4} className="bg-ink-void/40 backdrop-blur-md p-8 md:p-12 border border-gilt/20 drop-shadow-2xl relative h-[450px] group transition-all duration-700 hover:bg-ink-void/60 hover:border-gilt/40">
             <h3 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-10 border-b border-gilt/10 pb-4 text-center">V.c — Arsenal of the Ashen</h3>
             <div className="h-[280px]">
               <ToolsDonut />
             </div>
             <CornerBrackets className="text-gilt/20 transition-colors group-hover:text-gilt/50" />
          </RevealOnScroll>

          <RevealOnScroll delay={0.6} className="bg-ink-void/40 backdrop-blur-md p-8 md:p-12 border border-gilt/20 drop-shadow-2xl relative h-[450px] group transition-all duration-700 hover:bg-ink-void/60 hover:border-gilt/40">
             <h3 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-10 border-b border-gilt/10 pb-4 text-center">V.d — Ascendant Velocity</h3>
             <div className="h-[280px]">
               <CareerArea />
             </div>
             <CornerBrackets className="text-gilt/20 transition-colors group-hover:text-gilt/50" />
          </RevealOnScroll>
        </div>

        <div className="hidden">
          {/* SR fallbacks */}
          <table>
            <caption>Skill Proficiency Data</caption>
            <thead>
              <tr><th>Domain</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>AI</td><td>95</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
