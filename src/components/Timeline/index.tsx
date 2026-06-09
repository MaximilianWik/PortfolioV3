/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { Sigil } from '../shared/Sigil';
import { AnimatedOutline } from '../shared/AnimatedOutline';
import { CornerBrackets } from '../shared/CornerBrackets';
import { useVanillaTilt } from '../../hooks/useVanillaTilt';
import { EXPERIENCE } from '../../lib/data';

interface EntryProps {
  entry: typeof EXPERIENCE[0];
  index: number;
  isActive: boolean;
  isAnyHovered: boolean;
  onHover: (i: number | null) => void;
}

const TimelineEntry: React.FC<EntryProps> = ({
  entry, index, isActive, isAnyHovered, onHover,
}) => {
  const isLeft = index % 2 === 0;

  // VanillaTilt only on the card content — gives depth on the main block
  const tiltRef = useVanillaTilt<HTMLDivElement>({
    max: 6,
    speed: 500,
    reverse: true,
    glare: false,
  });

  return (
    <motion.div
      animate={{
        opacity: isAnyHovered && !isActive ? 0.22 : 1,
        scale:   isAnyHovered && !isActive ? 0.97 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative mb-20 md:flex ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >

      {/* ── Date column ── */}
      <div className={`hidden md:flex w-1/2 ${isLeft ? 'justify-start pl-12' : 'justify-end pr-12'}`}>
        <motion.span
          initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          animate={{
            color: isActive ? '#B8935A' : '#5C584F',
            letterSpacing: isActive ? '0.25em' : '0.15em',
          }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs tracking-widest"
        >
          {entry.year}
        </motion.span>
      </div>

      {/* ── Centre sigil ── */}
      <motion.div
        className="absolute left-0 md:left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"
        animate={{ scale: isActive ? 1.25 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          animate={{
            boxShadow: isActive
              ? '0 0 16px 4px rgba(184,147,90,0.55)'
              : '0 0 0 0 rgba(184,147,90,0)',
          }}
          transition={{ duration: 0.4 }}
          className="rounded-full"
        >
          <Sigil
            variant="runes"
            className={`w-8 h-8 p-1 rounded-full border transition-colors duration-500 ${
              isActive
                ? 'text-gilt bg-ink-deep border-gilt/50'
                : 'text-bone-dim bg-ink-void border-bone-faded/20'
            }`}
          />
        </motion.div>
      </motion.div>

      {/* ── Content card ── */}
      <div
        className={`md:w-1/2 pl-12 md:pl-0 ${
          isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
        }`}
      >
        {/* Tilt wrapper — relative+overflow-hidden for AnimatedOutline */}
        <div
          ref={tiltRef}
          className="relative p-6 overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >

          {/* Sweep border on hover */}
          <AnimatedOutline
            active={isActive}
            colorClass="bg-gilt"
            durationMs={250}
            zClass="z-20"
          />

          {/* Corner brackets */}
          <CornerBrackets
            className={`transition-colors duration-500 ${
              isActive ? 'text-gilt' : 'text-transparent'
            }`}
            size={14}
          />

          {/* Ember glow backdrop */}
          <motion.div
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(139,26,26,0.13) 0%, transparent 75%)',
            }}
          />

          {/* ── Content ── */}
          <div className="relative z-10">

            {/* Mobile year */}
            <div className="md:hidden font-mono text-bone-faded text-[10px] tracking-widest mb-2">
              {entry.year}
            </div>

            {/* Role */}
            <motion.h4
              animate={{
                textShadow: isActive
                  ? '0 0 20px rgba(184,147,90,0.45)'
                  : '0 0 0px rgba(184,147,90,0)',
              }}
              transition={{ duration: 0.5 }}
              className="font-display text-2xl text-bone-white mb-1 uppercase"
            >
              {entry.role}
            </motion.h4>

            {/* Ember underline — draws from origin side */}
            <motion.div
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ originX: isLeft ? 1 : 0 }}
              className="h-px bg-ember-blood mb-3 w-full"
            />

            {/* Company */}
            <motion.div
              animate={{ color: isActive ? '#B8935A' : 'rgba(184,147,90,0.65)' }}
              transition={{ duration: 0.4 }}
              className="font-subdisplay text-xs mb-4 tracking-widest"
            >
              {entry.company}
            </motion.div>

            {/* Description */}
            <motion.p
              animate={{
                opacity: isActive ? 1 : 0.7,
                y: isActive ? 0 : 4,
              }}
              transition={{ duration: 0.4, delay: isActive ? 0.05 : 0 }}
              className="font-body text-bone-dim text-sm italic mb-6 leading-relaxed max-w-lg md:mx-0 mx-auto"
            >
              {entry.description}
            </motion.p>

            {/* Skills — staggered */}
            <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
              {entry.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  animate={{
                    borderColor: isActive
                      ? 'rgba(184,147,90,0.55)'
                      : 'rgba(92,88,79,0.3)',
                    color: isActive ? '#B8935A' : '#5C584F',
                    y: isActive ? 0 : 2,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: isActive ? 0.08 + i * 0.04 : 0,
                  }}
                  className="px-3 py-1 border text-[10px] font-mono uppercase tracking-tighter"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Timeline: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const bgGifs = useMemo(() => [
    { id: 0, x: 15, y: 20, size: 600, rotate: 15,  opacity: 0.4, duration: 45, mirrored: false },
    { id: 1, x: 65, y: 50, size: 700, rotate: -15, opacity: 0.4, duration: 60, mirrored: true  },
  ], []);

  return (
    <section id="chronicle" className="relative py-32 px-6 overflow-hidden">

      {/* Background GIFs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {bgGifs.map((gif) => (
          <motion.div
            key={gif.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: gif.opacity }}
            viewport={{ once: true }}
            animate={{ y: gif.id === 0 ? [0, -60, 0] : [-35, 25, -35] }}
            transition={{
              y: { duration: gif.duration, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 3 },
            }}
            style={{
              position: 'absolute',
              left: `${gif.x}%`,
              top: `${gif.y}%`,
              width: `${gif.size}px`,
              height: 'auto',
              transform: `rotate(${gif.rotate}deg)${gif.mirrored ? ' scaleX(-1)' : ''}`,
              filter: 'grayscale(60%)',
              willChange: 'transform',
              maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
            }}
          >
            <img src="/HumanityNoBg.gif" alt="" loading="lazy" decoding="async"
              className="w-full h-auto opacity-100" referrerPolicy="no-referrer" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-void via-transparent to-ink-void" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-void to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-void to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading numeral="IV" title="The Chronicle" sigil="runes" />

        <div className="relative mt-20">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-bone-faded/20 -translate-x-1/2" />

          <div className="space-y-12">
            {EXPERIENCE.map((entry, i) => (
              <TimelineEntry
                key={i}
                entry={entry}
                index={i}
                isActive={hoveredIndex === i}
                isAnyHovered={hoveredIndex !== null}
                onHover={setHoveredIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
