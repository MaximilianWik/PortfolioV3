/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import VanillaTilt from 'vanilla-tilt';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';

interface DeedCardProps {
  index: string;
  title: string;
  description: string;
  delay: number;
  pdfLink?: string;
  tags?: string[];
}

const DeedCard: React.FC<DeedCardProps> = ({ index, title, description, delay, pdfLink, tags }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        ref={tiltRef}
        className={`relative p-8 md:p-10 border border-bone-faded/10 transition-colors duration-500 overflow-hidden ${isHovered ? 'bg-ink-iron' : 'bg-ink-deep'}`}
      >
        <span className={`absolute top-6 right-6 font-subdisplay text-xs transition-colors ${isHovered ? 'text-gilt' : 'text-bone-faded'}`}>
          {index}
        </span>
        
        <h3 className={`font-display text-2xl mb-4 tracking-wide uppercase transition-colors ${isHovered ? 'text-soul-pale' : 'text-bone-white'}`}>
          {title}
        </h3>
        
        <p className="font-body text-bone-dim leading-relaxed italic text-sm md:text-base mb-6">
          {description}
        </p>

        {tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, i) => (
              <span 
                key={i} 
                className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 bg-ink-void/50 border border-bone-faded/10 transition-colors ${isHovered ? 'text-gilt' : 'text-bone-faded'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {pdfLink && (
          <div className="flex relative z-20">
            <motion.a 
              href={pdfLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ y: -3, color: '#B8935A', textShadow: '0px 0px 8px rgba(184,147,90,0.8)', borderColor: '#B8935A' }}
              transition={{ duration: 0.3 }}
              className="inline-block font-subdisplay text-[10px] text-bone-white tracking-[0.3em] uppercase border-b border-bone-faded/30 pb-1"
            >
              View Document
            </motion.a>
          </div>
        )}

        <CornerBrackets className={`transition-colors duration-500 z-[70] ${isHovered ? 'border-gilt' : 'text-bone-faded/20'}`} />
        
        {/* State-Driven Outline Effects */}
        <div 
          className="absolute top-0 left-0 h-[1px] bg-ember-blood transition-all duration-300 origin-left z-50" 
          style={{ width: isHovered ? '100%' : '0%', transitionDelay: '0ms' }} 
        />
        <div 
          className="absolute top-0 right-0 w-[1px] bg-ember-blood transition-all duration-300 origin-top z-50" 
          style={{ height: isHovered ? '100%' : '0%', transitionDelay: '300ms' }} 
        />
        <div 
          className="absolute bottom-0 right-0 h-[1px] bg-ember-blood transition-all duration-300 origin-right z-50" 
          style={{ width: isHovered ? '100%' : '0%', transitionDelay: '600ms' }} 
        />
        <div 
          className="absolute bottom-0 left-0 w-[1px] bg-ember-blood transition-all duration-300 origin-bottom z-50" 
          style={{ height: isHovered ? '100%' : '0%', transitionDelay: '900ms' }} 
        />
      </div>
    </motion.div>
  );
};

export const Highlights: React.FC = () => {
  const deeds = [
    {
      index: "I",
      title: "DNB Bank — AI & Automation Specialist",
      description: "Binding Copilot Studio agents and Power Automate flows into the secure foundations of DNB. Scaling identity governance and automation in the regulated shadows.",
      tags: ["AI Agents", "Power Automate"]
    },
    {
      index: "II",
      title: "SEB — The Agentic Thesis",
      description: "A scholar's pursuit into Agentic AI within the iron-clad walls of SEB. Developing frameworks for autonomous reasoning where failure is not an option.",
      pdfLink: "/Integrating%20Agentic%20AI%20into%20Software%20Development%20A%20Sociotechnical%20Case%20Study%20in%20a%20Large%20Nordic%20Bank.pdf",
      tags: ["Agentic AI", "LLMs"]
    },
    {
      index: "III",
      title: "EduCal — Business Intelligence",
      description: "Modernizing data architecture through Medallion rites. Forging decay-curve models in Power BI to forecast the inevitable fade of resources.",
      pdfLink: "/Slutleverans.EduCal.pdf",
      tags: ["BI", "Data"]
    }
  ];

  return (
    <section id="highlights" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading 
          numeral="III" 
          title="The Deeds" 
          sigil="serpent"
        />
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {deeds.map((deed, i) => (
            <DeedCard 
              key={i} 
              {...deed} 
              delay={i * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
