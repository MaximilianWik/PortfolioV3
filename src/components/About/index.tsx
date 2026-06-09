/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { CornerBrackets } from '../shared/CornerBrackets';

// ─── Stat counter ─────────────────────────────────────────────────────────────

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    const dur = 1200, t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <div ref={ref} className="relative p-3 border border-bone-faded/10 bg-ink-deep/80 flex flex-col">
      <CornerBrackets className="text-bone-faded/20" size={5} />
      <span className="font-mono text-bone-dim text-xl mb-0.5">{String(count).padStart(2, '0')}</span>
      <span className="font-subdisplay text-[8px] tracking-tighter text-bone-faded uppercase">{label}</span>
    </div>
  );
};

// ─── Word stagger ─────────────────────────────────────────────────────────────

const sentence = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};
const word = {
  hidden: { opacity: 0, y: 16, filter: 'blur(3px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Tab data ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'craft',    label: 'Craft'    },
  { id: 'rites',    label: 'Rites'    },
  { id: 'doctrine', label: 'Doctrine' },
  { id: 'forged',   label: 'Forged'   },
] as const;
type TabId = typeof TABS[number]['id'];

const PROJECTS = [
  { name: 'Tessera',              desc: 'ISO/IEC 18004 verified QR generator for tattoo QRs.',    tags: ['JavaScript', 'ISO/IEC 18004'],           href: 'https://tessera-neon.vercel.app/' },
  { name: 'Cursed Echoes',        desc: 'Dark Souls–flavored browser typing survival.',            tags: ['TypeScript', 'React 19'],                href: 'https://cursedechoes.vercel.app/' },
  { name: 'Subdermal',            desc: 'Collaborative canvas behind a QR tattoo.',               tags: ['React 19', 'Cloudflare D1'],             href: 'https://max-wik.com/' },
  { name: 'Paleblood Vigil',      desc: 'Generative N-body attractor algorithmic art.',           tags: ['p5.js', 'Seeded PRNG'],                  href: 'https://paleblood-vigil.vercel.app/' },
  { name: 'Studio Panic Attack',  desc: 'GPU-accelerated 3D immersive web experience.',           tags: ['React Three Fiber', 'GSAP'],             href: 'https://studio-panic-attack-maximilian.vercel.app/' },
  { name: 'Carpet Eater',         desc: 'Audio-mangling desktop tool for an artist.',             tags: ['Python', 'PySide6', 'NumPy'],            href: 'https://github.com/MaximilianWik/Carpet-Eater' },
] as const;

// ─── Tab content ──────────────────────────────────────────────────────────────

const CraftTab: React.FC = () => (
  <div className="space-y-6">
    <div className="border-l border-gilt/40 pl-5">
      <div className="font-mono text-[9px] text-gilt uppercase tracking-widest mb-1.5">Current</div>
      <div className="font-display text-xl text-bone-dim uppercase tracking-wider mb-0.5">
        AI & Automation Specialist
      </div>
      <div className="font-subdisplay text-[10px] text-bone-faded tracking-widest mb-3">
        Consulting IT — DNB Bank
      </div>
      <p className="font-body text-bone-dim/80 text-sm italic leading-relaxed mb-3">
        Copilot Studio agents, Power Automate workflows, SailPoint identity governance. 
        Enterprise automation where the cost of failure is real.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {['Copilot Studio','Power Automate','SailPoint','AI Agents','Python'].map(t => (
          <span key={t} className="px-2 py-0.5 border border-gilt/20 font-mono text-[9px] text-gilt/70 uppercase tracking-tighter">{t}</span>
        ))}
      </div>
    </div>
    <div className="border-l border-ember-blood/25 pl-5">
      <div className="font-mono text-[9px] text-ember-blood/60 uppercase tracking-widest mb-1.5">Thesis — SEB</div>
      <div className="font-display text-base text-bone-dim uppercase tracking-wider mb-1">
        Agentic AI in Regulated Finance
      </div>
      <p className="font-body text-bone-dim/70 text-xs italic leading-relaxed">
        How to make autonomous agents reliable enough to trust inside a bank.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-2 pt-2">
      <Stat value={6}  label="Years Active" />
      <Stat value={19} label="Systems Tamed" />
      <Stat value={8}  label="Lingua Franca" />
    </div>
  </div>
);

const RitesTab: React.FC = () => (
  <div className="space-y-6">
    {[
      {
        period: '2023–2026', place: 'Örebro University',
        title: 'BSc — Information Systems',
        body: 'Full-stack systems in C# / .NET and Java. PDF invoicing, ASP.NET Core Identity, role-based access control, team-based delivery. BI internship modernising Power BI along Medallion principles.',
        tags: ['C# / .NET', 'Java', 'ASP.NET Core', 'Power BI', 'SQL'],
      },
      {
        period: '2024–2025', place: 'Nuremberg Institute of Technology',
        title: 'Exchange — International Business',
        body: 'Exchange semester in Germany. International management, business strategy, and cross-cultural systems thinking.',
        tags: ['International Management', 'Exchange'],
      },
    ].map(({ period, place, title, body, tags }) => (
      <div key={place} className="border-l border-bone-faded/20 pl-5">
        <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-1.5">{period} · {place}</div>
        <div className="font-display text-base text-bone-dim uppercase tracking-wider mb-2">{title}</div>
        <p className="font-body text-bone-dim/75 text-xs italic leading-relaxed mb-3">{body}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} className="px-2 py-0.5 border border-bone-faded/20 font-mono text-[9px] text-bone-faded uppercase tracking-tighter">{t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const DoctrineTab: React.FC = () => (
  <div className="space-y-6">
    <blockquote className="border-l-2 border-ember-blood/50 pl-5">
      <p className="font-body text-bone-dim text-lg italic leading-relaxed">
        "Software that is well-specified, well-verified, and built to outlast 
        the people who wrote it."
      </p>
    </blockquote>
    <p className="font-body text-bone-dim/70 text-sm italic leading-relaxed pl-5">
      Based in Stockholm. Open to conversations about agentic AI, automation, 
      and durable software.
    </p>
    <div className="pl-5">
      <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-3">Toolkit</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {[
          ['Agentic AI',    'Copilot Studio · LLM Orchestration'],
          ['Automation',    'Power Automate · SailPoint · Power Apps'],
          ['Intelligence',  'Power BI · DAX · Medallion · Python'],
          ['Front-end',     'TypeScript · React · Vite'],
          ['Back-end',      'C# / .NET · Java · ASP.NET Core'],
          ['Data',          'SQL · Entity Framework · Azure'],
        ].map(([cat, tools]) => (
          <div key={cat}>
            <div className="font-mono text-[8px] text-gilt/60 uppercase tracking-widest mb-0.5">{cat}</div>
            <div className="font-body text-bone-faded/80 text-xs">{tools}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ForgedTab: React.FC = () => (
  <div className="grid grid-cols-1 gap-1">
    {PROJECTS.map(({ name, desc, tags, href }) => (
      <motion.a
        key={name}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 px-4 py-3 border border-transparent hover:border-bone-faded/10 hover:bg-ink-deep/60 transition-colors duration-300 rounded-sm"
        whileHover={{ x: 6 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-ember-blood/40 font-mono text-xs mt-1 flex-shrink-0 group-hover:text-ember-blood/70 transition-colors duration-300">›</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display text-sm text-bone-dim uppercase tracking-wider group-hover:text-bone-white transition-colors duration-300">
              {name}
            </span>
            <span className="font-mono text-[8px] text-bone-faded/50 group-hover:text-gilt/50 transition-colors duration-300">↗</span>
          </div>
          <p className="font-body text-bone-faded/70 text-xs italic leading-snug mt-0.5 truncate">{desc}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.map(t => (
              <span key={t} className="font-mono text-[8px] text-bone-faded/40 uppercase tracking-tighter">{t}</span>
            ))}
          </div>
        </div>
      </motion.a>
    ))}
  </div>
);

const TAB_CONTENT: Record<TabId, React.FC> = {
  craft: CraftTab, rites: RitesTab, doctrine: DoctrineTab, forged: ForgedTab,
};

// ─── About ────────────────────────────────────────────────────────────────────

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('craft');

  const line1 = 'I build AI agents and automation systems for regulated environments.'.split(' ');
  const line2 = 'Places where code has to be right the first time — and every time after.'.split(' ');

  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <section id="about">

      {/* ── ACT I — The Arrival ─────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          whileInView={{ scale: 1.0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
        >
          <img src="/blackmaiden.jpg" alt="" aria-hidden="true" loading="eager" decoding="async"
            className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-void via-ink-void/45 to-ink-void/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-void/75 to-ink-void/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(7,7,10,0.7)_100%)]" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.45em' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-mono text-[11px] text-bone-faded/60 uppercase mb-6"
          >
            II.
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display uppercase leading-none tracking-[0.1em] text-bone-dim"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 9.5rem)' }}
          >
            The Bearer
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 h-px bg-ember-blood origin-center"
            style={{ width: 'clamp(3rem, 8vw, 6rem)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: false }} transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] text-bone-faded/35 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-bone-faded/15 relative overflow-hidden">
            <motion.div animate={{ y: [0, 32] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-2 bg-ember-blood" />
          </div>
        </motion.div>
      </div>

      {/* ── ACT II — The Statement ──────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <img src="/blackmaiden.jpg" alt="" aria-hidden="true"
            className="w-full h-full object-cover object-center" style={{ filter: 'blur(3px) grayscale(90%)' }} />
          <div className="absolute inset-0 bg-ink-void/85" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div variants={sentence} initial="hidden" whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1"
            style={{ fontSize: 'clamp(1.3rem, 3.2vw, 2.4rem)' }}>
            {line1.map((w, i) => (
              <motion.span key={i} variants={word} className="font-body italic text-bone-dim inline-block">{w}</motion.span>
            ))}
          </motion.div>

          <motion.div initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mx-auto my-7 h-px bg-ember-blood origin-left w-14" />

          <motion.div variants={sentence} initial="hidden" whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            style={{ fontSize: 'clamp(1rem, 2.6vw, 1.85rem)' } as React.CSSProperties}
            className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1">
            {line2.map((w, i) => {
              const accent = w === 'first' || w === 'time';
              return (
                <motion.span key={i} variants={word}
                  className={`font-body italic inline-block ${accent ? 'text-gilt not-italic' : 'text-bone-dim/70'}`}>
                  {w}
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── ACT III — The Identity ──────────────────────────────────────────── */}
      <div className="relative py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-10 items-start">

            {/* Portrait + status */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.2 }}
              className="md:col-span-4 hidden md:flex flex-col gap-4"
            >
              <div className="relative">
                <img src="/blackmaiden.jpg" alt="Maximilian Wikström" loading="lazy" decoding="async"
                  className="w-full h-auto object-contain opacity-80 hover:opacity-95 transition-opacity duration-700"
                  style={{
                    maskImage: 'radial-gradient(ellipse at center, black 38%, transparent 85%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 38%, transparent 85%)',
                    maxHeight: '52vh', objectPosition: 'center top',
                  }}
                />
              </div>
              <div className="relative p-4 border border-bone-faded/10 bg-ink-deep">
                <CornerBrackets className="text-bone-faded/20" size={7} />
                {[['Location','Stockholm',false],['Status','Active',true],['Domain','DNB Bank',false],['Focus','Agentic AI',false]].map(([k,v,p]) => (
                  <div key={String(k)} className="flex justify-between items-center py-1.5 border-b border-bone-faded/5 last:border-0">
                    <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">{k}</span>
                    <span className={`font-mono text-[10px] flex items-center gap-1.5 ${p ? 'text-gilt' : 'text-bone-dim'}`}>
                      {p && <span className="w-1.5 h-1.5 rounded-full bg-gilt animate-pulse inline-block" />}
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tabbed panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.2, delay: 0.15 }}
              className="md:col-span-8"
            >
              {/* Tab nav */}
              <div className="flex gap-0 border-b border-bone-faded/10 mb-6">
                {TABS.map(({ id, label }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="relative px-5 py-3 font-subdisplay text-[10px] uppercase tracking-widest transition-colors duration-300"
                      style={{ color: isActive ? '#B8935A' : '#5C584F' }}
                    >
                      {label}
                      {isActive && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-px bg-gilt"
                          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content — animated on switch */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <ActiveContent />
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  );
};
