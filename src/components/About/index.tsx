/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';
import { AnimatedOutline } from '../shared/AnimatedOutline';
import { Sigil } from '../shared/Sigil';
import { useVanillaTilt } from '../../hooks/useVanillaTilt';
import { usePretextLayout } from '../../hooks/usePretextLayout';

// ── Data ─────────────────────────────────────────────────────────────────────

const DISCIPLINES = [
  {
    sigil: 'eye'     as const,
    title: 'Agentic Systems',
    desc:  'Building autonomous agents that are reliable enough to trust inside a bank. LLM orchestration in regulated environments where failure is not an option.',
    tools: ['Copilot Studio', 'LLM Orchestration', 'Agentic AI', 'Claude', 'GPT-4', 'Regulated Deployment'],
  },
  {
    sigil: 'runes'   as const,
    title: 'Automation & Governance',
    desc:  'Wiring enterprise systems together so they stop asking humans to repeat themselves. Identity, access, and process automation at scale.',
    tools: ['Power Automate', 'SailPoint', 'Identity Governance', 'Power Apps', 'Cloud Integration'],
  },
  {
    sigil: 'compass' as const,
    title: 'Intelligence & Data',
    desc:  'Turning raw operational data into decisions. Medallion architecture, semantic models, and decay-curve resource allocation.',
    tools: ['Power BI', 'DAX', 'Medallion Architecture', 'Python', 'SQL', 'Data Modelling'],
  },
  {
    sigil: 'serpent' as const,
    title: 'Engineering',
    desc:  'Front-to-back. Systems that ship, hold together under load, and can be understood by someone who wasn\'t there when they were written.',
    tools: ['TypeScript', 'React', 'C# / .NET', 'Java', 'Vite', 'ASP.NET Core'],
  },
] as const;

const SIDE_PROJECTS = [
  {
    id: 'I',
    title: 'Tessera',
    tagline: 'A QR code generator built for codes that have to work for life.',
    detail: 'Zero-dependency, client-side. Verified against ISO/IEC 18004 Annex I test vectors, round-trip decoded through three independent decoders, stress-tested with blot damage overlays. Built for tattoo QRs.',
    tech: ['JavaScript', 'ISO/IEC 18004', 'Canvas', 'Zero-Dependency'],
    link: 'https://tessera-neon.vercel.app/',
  },
  {
    id: 'II',
    title: 'Cursed Echoes',
    tagline: 'A Dark Souls–flavored browser typing survival game.',
    detail: 'Lore-dictionary waves, combo multipliers, difficulty scaling, hidden screens. TypeScript, React 19, Vite. Fully deployed on Vercel.',
    tech: ['TypeScript', 'React 19', 'Vite', 'Framer Motion'],
    link: 'https://cursedechoes.vercel.app/',
  },
  {
    id: 'III',
    title: 'Subdermal',
    tagline: 'A collaborative canvas reachable via a QR tattoo on my arm.',
    detail: '16384 × 24576 px shared canvas. Nine brushes, undo/redo, per-browser ownership, admin moderation. React on Cloudflare Workers + D1. Auto-deploys in under a minute.',
    tech: ['React 19', 'Cloudflare Workers', 'D1 / SQLite', 'Hono 4'],
    link: 'https://max-wik.com/',
  },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return (
    <div ref={ref} className="relative p-4 bg-ink-deep border border-bone-faded/10 flex flex-col justify-center">
      <CornerBrackets className="text-bone-faded/20" size={6} />
      <span className="font-mono text-bone-white text-2xl mb-1">{String(count).padStart(2, '0')}</span>
      <span className="font-subdisplay text-[9px] tracking-tighter text-bone-faded uppercase">{label}</span>
    </div>
  );
};

const DisciplineCard: React.FC<{
  sigil: 'eye' | 'serpent' | 'trefoil' | 'runes' | 'compass';
  title: string;
  desc: string;
  tools: readonly string[];
}> = ({ sigil, title, desc, tools }) => {
  const [hovered, setHovered] = useState(false);
  const tiltRef = useVanillaTilt<HTMLDivElement>({ max: 5, speed: 500, reverse: true, glare: false });

  return (
    <div
      ref={tiltRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative p-6 border border-bone-faded/10 bg-ink-deep overflow-hidden cursor-default"
    >
      <AnimatedOutline active={hovered} colorClass="bg-gilt" durationMs={200} />
      <CornerBrackets className={`transition-colors duration-300 ${hovered ? 'text-gilt' : 'text-bone-faded/15'}`} size={10} />

      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(184,147,90,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-lg uppercase tracking-wider text-bone-white">{title}</h3>
          <Sigil
            variant={sigil}
            className={`w-6 h-6 transition-colors duration-300 flex-shrink-0 ml-3 ${hovered ? 'text-gilt' : 'text-bone-faded/35'}`}
          />
        </div>
        <p className="font-body text-bone-dim text-xs italic leading-relaxed mb-4">{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tools.map(tool => (
            <span
              key={tool}
              className={`px-2 py-0.5 border text-[9px] font-mono uppercase tracking-tighter transition-colors duration-300 ${
                hovered ? 'border-gilt/30 text-gilt/70' : 'border-bone-faded/20 text-bone-faded'
              }`}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{
  id: string;
  title: string;
  tagline: string;
  detail: string;
  tech: readonly string[];
  link: string;
}> = ({ id, title, tagline, detail, tech, link }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block p-6 border border-bone-faded/10 bg-ink-deep overflow-hidden group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatedOutline active={hovered} colorClass="bg-ember-blood" durationMs={220} />
      <CornerBrackets className={`transition-colors duration-300 ${hovered ? 'text-ember-blood/70' : 'text-bone-faded/15'}`} size={10} />

      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(139,26,26,0.10) 0%, transparent 65%)' }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-[9px] text-bone-faded/50 tracking-widest">PROJECT {id}</span>
          <motion.span
            animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[9px] text-ember-blood tracking-widest"
          >
            VISIT →
          </motion.span>
        </div>

        <h3 className={`font-display text-xl uppercase tracking-wider mb-2 transition-colors duration-300 ${hovered ? 'text-bone-white' : 'text-bone-dim'}`}>
          {title}
        </h3>
        <p className="font-body text-bone-faded text-xs italic leading-relaxed mb-4">{tagline}</p>
        <p className="font-body text-bone-dim/70 text-xs leading-relaxed mb-4">{detail}</p>

        <div className="flex flex-wrap gap-1.5">
          {tech.map(t => (
            <span
              key={t}
              className={`px-2 py-0.5 border text-[9px] font-mono uppercase tracking-tighter transition-colors duration-300 ${
                hovered ? 'border-ember-blood/30 text-ember-blood/70' : 'border-bone-faded/20 text-bone-faded/60'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
};

// ── Main Section ──────────────────────────────────────────────────────────────

export const About: React.FC = () => {
  const bio = "AI & Automation Specialist with Consulting IT, embedded at DNB Bank. Designing Microsoft Copilot agents, Power Automate workflows, and SailPoint identity governance for enterprise-scale banking operations.";
  const layout = usePretextLayout(bio, 'italic 15px "EB Garamond"', 480, 1.6);

  return (
    <section id="about" className="py-32 px-6 max-w-6xl mx-auto">
      <SectionHeading numeral="II" title="The Bearer" sigil="eye" />

      {/* ── Opening statement ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="mb-20 border-l-2 border-ember-blood pl-8 max-w-3xl"
      >
        <p className="font-body text-2xl md:text-3xl text-bone-white italic leading-relaxed">
          I build AI agents and automation systems for{' '}
          <span className="text-bone-dim">regulated environments.</span>
        </p>
        <p className="font-body text-xl md:text-2xl text-bone-dim italic leading-relaxed mt-3">
          Places where code has to be right{' '}
          <span className="text-gilt not-italic font-normal">the first time</span>
          {' '}— and every time after.
        </p>
      </motion.div>

      {/* ── Main grid: content + image ── */}
      <div className="grid md:grid-cols-5 gap-12 mb-20 items-start">

        {/* Content: 3/5 */}
        <div className="md:col-span-3 flex flex-col gap-10">

          {/* Current role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="border-l border-gilt/40 pl-6"
          >
            <div className="font-mono text-[10px] text-gilt uppercase tracking-widest mb-3">Current Domain</div>
            <div className="font-display text-2xl text-bone-white mb-1 uppercase tracking-wider">
              AI & Automation Specialist
            </div>
            <div className="font-subdisplay text-xs text-bone-faded tracking-widest mb-4">
              Consulting IT — embedded at DNB Bank
            </div>
            <p
              className="font-body text-bone-dim text-sm italic leading-relaxed"
              style={{ minHeight: layout.height || 'auto' }}
            >
              {bio}
            </p>
            <p className="font-body text-bone-dim text-sm italic leading-relaxed mt-3">
              Before this, wrote a thesis at SEB on Agentic AI in regulated finance — specifically,
              how to make autonomous agents reliable enough to trust inside a bank.
            </p>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="border-l border-bone-faded/20 pl-6"
          >
            <div className="font-mono text-[10px] text-bone-faded uppercase tracking-widest mb-3">Rites of Study</div>
            <div className="space-y-3">
              <div>
                <div className="font-display text-base text-bone-white uppercase tracking-wider">BSc — Information Systems</div>
                <div className="font-subdisplay text-xs text-bone-faded tracking-widest">Örebro University · 2023–2026</div>
              </div>
              <div>
                <div className="font-display text-base text-bone-white uppercase tracking-wider">Exchange — International Business</div>
                <div className="font-subdisplay text-xs text-bone-faded tracking-widest">Nuremberg Institute of Technology · 2024–2025</div>
              </div>
            </div>
          </motion.div>

          {/* Philosophy */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="border-l border-ember-blood/40 pl-6"
          >
            <p className="font-body text-bone-dim text-base italic leading-relaxed">
              "Software that is well-specified, well-verified, and built to outlast the people who wrote it."
            </p>
          </motion.blockquote>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatItem label="Years Active" value={6} />
            <StatItem label="Systems Tamed" value={19} />
            <StatItem label="Lingua Franca" value={8} />
          </div>
        </div>

        {/* Image: 2/5 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="md:col-span-2 relative"
        >
          <div className="relative group">
            <img
              src="/blackmaiden.jpg"
              alt="The Bearer"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain opacity-80 transition-all duration-1000 group-hover:opacity-95"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 90%)',
              }}
            />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink-void to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-void to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-void to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-void to-transparent pointer-events-none" />
          </div>

          {/* Location + status panel */}
          <div className="mt-6 p-4 border border-bone-faded/10 bg-ink-deep relative">
            <CornerBrackets className="text-bone-faded/20" size={8} />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">Location</span>
                <span className="font-mono text-[10px] text-bone-white">Stockholm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">Status</span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-gilt">
                  <span className="w-1.5 h-1.5 rounded-full bg-gilt animate-pulse inline-block" />
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">Domain</span>
                <span className="font-mono text-[10px] text-bone-white">DNB Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">Focus</span>
                <span className="font-mono text-[10px] text-bone-white">Agentic AI</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Disciplines ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="mb-16"
      >
        <div className="font-mono text-[10px] text-bone-faded uppercase tracking-widest mb-6">
          Disciplines
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DISCIPLINES.map((d) => (
            <DisciplineCard key={d.title} {...d} />
          ))}
        </div>
      </motion.div>

      {/* ── Side projects ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.1 }}
      >
        <div className="font-mono text-[10px] text-bone-faded uppercase tracking-widest mb-6">
          Forged Outside of Work
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {SIDE_PROJECTS.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
