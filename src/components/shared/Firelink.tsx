import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { DispersingText } from './DispersingText';
import firekeeperImg from '../../assets/images/fire_keeper_1776757154663.png';

export const Firelink: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={containerRef} className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center my-32">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
        <img 
          src={firekeeperImg} 
          alt="Fire Keeper" 
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity grayscale-[50%]"
        />
      </motion.div>

      {/* Dark gradient bleeds into the sections above and below */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-void via-ink-void/40 to-ink-void" />
      <div className="absolute inset-0 bg-ink-void/20" /> {/* Slight extra darkening */}

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6 flex flex-col items-center">
        <div className="w-[1px] h-12 bg-ember-blood/50 mb-8" />
        <div className="font-mono text-[9px] text-bone-faded uppercase tracking-[0.4em] mb-6">
          A Moment of Respite
        </div>
        <DispersingText 
          text="“Touch the darkness within me. Take nourishment from these sovereignless souls.”"
          className="font-body text-bone-dim text-xl md:text-2xl leading-relaxed italic"
        />
        <div className="w-[1px] h-12 bg-ember-blood/50 mt-8" />
      </div>
    </section>
  );
};
