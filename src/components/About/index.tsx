/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Bearer — Soul Constellation
 *
 * An SVG-based orbiting node constellation. Three rings of nodes (career,
 * disciplines, projects) orbit a central ember-soul. Animation runs in a
 * single RAF loop that updates SVG element attributes directly — zero React
 * re-renders per frame. Mouse movement tilts the whole scene in 3D via a
 * CSS perspective wrapper. Hover pauses a node's orbit; click opens a
 * slide-in detail panel with the node's full info.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { CornerBrackets } from '../shared/CornerBrackets';
import { Sigil } from '../shared/Sigil';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

type NodeDef = {
  id:         string;
  label:      string;
  sublabel:   string;
  ring:       0 | 1 | 2;
  startAngle: number; // radians
  rgb:        [number, number, number];
  title:      string;
  subtitle:   string;
  body:       string;
  tags:       string[];
  link:       string | null;
};

const NODES: NodeDef[] = [
  // ── Ring 0 — Identity / Career (gilt) ────────────────────────────────────
  {
    id: 'dnb', label: 'DNB Bank', sublabel: 'Present', ring: 0,
    startAngle: 0.5, rgb: [184, 147, 90],
    title: 'AI & Automation Specialist',
    subtitle: 'Consulting IT — embedded at DNB Bank',
    body: 'Designing Microsoft Copilot agents, Power Automate workflows, and SailPoint identity governance for enterprise-scale banking operations. Code that has to be right the first time — and every time after.',
    tags: ['Copilot Studio', 'Power Automate', 'SailPoint', 'AI Agents', 'Python'],
    link: null,
  },
  {
    id: 'seb', label: 'SEB', sublabel: 'Thesis', ring: 0,
    startAngle: 2.6, rgb: [184, 147, 90],
    title: 'Agentic AI in Regulated Finance',
    subtitle: 'MSc Thesis — SEB Bank · 2025–2026',
    body: 'How to make autonomous agents reliable enough to trust inside a bank. Agentic AI frameworks in highly regulated financial environments, focusing on risk mitigation, explainability, and failure modes.',
    tags: ['Agentic AI', 'LLMs', 'Risk Mitigation', 'Regulated Finance'],
    link: null,
  },
  {
    id: 'edu', label: 'Örebro', sublabel: 'Education', ring: 0,
    startAngle: 4.7, rgb: [184, 147, 90],
    title: 'BSc in Information Systems',
    subtitle: 'Örebro University · 2023–2026 · Nuremberg Exchange',
    body: 'Full-stack systems in C#/.NET and Java, data architecture, and enterprise software design. BI internship modernising Power BI architecture along Medallion principles and developing decay-curve resource allocation models.',
    tags: ['Information Systems', 'C# / .NET', 'Java', 'Power BI', 'Medallion'],
    link: null,
  },

  // ── Ring 1 — Disciplines (ember-blood) ───────────────────────────────────
  {
    id: 'agentic', label: 'Agentic AI', sublabel: 'Discipline', ring: 1,
    startAngle: 0.8, rgb: [139, 26, 26],
    title: 'Agentic Systems',
    subtitle: 'Making AI reliable before making it capable',
    body: 'LLM orchestration in regulated environments where failure is not an option. Copilot Studio, autonomous reasoning, agentic workflow design. The goal is not capability — it is trustworthiness.',
    tags: ['LLM Orchestration', 'Copilot Studio', 'Claude', 'GPT-4', 'Agentic Workflows'],
    link: null,
  },
  {
    id: 'automation', label: 'Automation', sublabel: 'Discipline', ring: 1,
    startAngle: 2.35, rgb: [139, 26, 26],
    title: 'Automation & Governance',
    subtitle: 'Enterprise-scale process automation',
    body: 'Wiring enterprise systems together so they stop asking humans to repeat themselves. Identity governance, access management, and process automation at banking scale via Power Automate and SailPoint.',
    tags: ['Power Automate', 'SailPoint', 'Identity Governance', 'Power Apps', 'Cloud Integration'],
    link: null,
  },
  {
    id: 'data', label: 'BI & Data', sublabel: 'Discipline', ring: 1,
    startAngle: 3.9, rgb: [139, 26, 26],
    title: 'Intelligence & Data',
    subtitle: 'Turning operations into decisions',
    body: 'Power BI semantic models on Medallion architecture. Decay-curve resource allocation models. DAX, SQL, Python. Data infrastructure that tells the truth about what the organisation is doing.',
    tags: ['Power BI', 'DAX', 'Medallion Architecture', 'Python', 'SQL'],
    link: null,
  },
  {
    id: 'eng', label: 'Engineering', sublabel: 'Discipline', ring: 1,
    startAngle: 5.45, rgb: [139, 26, 26],
    title: 'Engineering',
    subtitle: 'Front-to-back. Spec to ship.',
    body: 'TypeScript, React, C#/.NET, Java. Software that is well-specified, well-verified, and built to outlast the people who wrote it. ASP.NET Core Identity, Entity Framework, Vite, SQL Server.',
    tags: ['TypeScript', 'React', 'C# / .NET', 'Java', 'ASP.NET Core', 'Vite'],
    link: null,
  },

  // ── Ring 2 — Projects (bone) ──────────────────────────────────────────────
  {
    id: 'tessera', label: 'Tessera', sublabel: 'Project', ring: 2,
    startAngle: 1.0, rgb: [154, 150, 139],
    title: 'Tessera',
    subtitle: 'QR codes built to last a lifetime',
    body: 'Zero-dependency, client-side QR generator verified against ISO/IEC 18004 Annex I test vectors and round-trip decoded through three independent decoders. Stress-tested with blot damage overlays. Built for tattoo QRs.',
    tags: ['JavaScript', 'ISO/IEC 18004', 'Canvas', 'Zero-Dependency', 'Vercel'],
    link: 'https://tessera-neon.vercel.app/',
  },
  {
    id: 'cursed', label: 'Cursed Echoes', sublabel: 'Project', ring: 2,
    startAngle: 3.1, rgb: [154, 150, 139],
    title: 'Cursed Echoes',
    subtitle: 'Dark Souls–flavored browser typing survival',
    body: 'Type lore-dictionary waves of enemies to cast spells and survive. Combo multipliers, difficulty scaling, hidden easter eggs, animated character states. TypeScript, React 19, Vite, Framer Motion.',
    tags: ['TypeScript', 'React 19', 'Vite', 'Framer Motion', 'Game Design'],
    link: 'https://cursedechoes.vercel.app/',
  },
  {
    id: 'subdermal', label: 'Subdermal', sublabel: 'Project', ring: 2,
    startAngle: 5.2, rgb: [154, 150, 139],
    title: 'Subdermal',
    subtitle: 'A collaborative canvas behind a QR tattoo',
    body: 'A 16384×24576 shared canvas reachable via a QR-code on my arm. Nine brushes, undo/redo, per-browser ownership, token-gated admin moderation. React on Cloudflare Workers + D1. Re-skinnable from a phone in under a minute.',
    tags: ['React 19', 'Cloudflare Workers', 'D1 / SQLite', 'Hono 4', 'Canvas API'],
    link: 'https://max-wik.com/',
  },
];

const RING_RADII_FRAC = [0.21, 0.37, 0.51]; // fraction of min(cx, cy)
const RING_SPEEDS     = [0.000052, 0.000036, 0.000026]; // rad/ms
const RING_NODE_R     = [8, 7, 6]; // SVG px

// ─────────────────────────────────────────────────────────────────────────────
// Detail panel
// ─────────────────────────────────────────────────────────────────────────────

const NodeDetail: React.FC<{
  node: NodeDef;
  onClose: () => void;
}> = ({ node, onClose }) => (
  <motion.div
    key={node.id}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 40 }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="w-full md:w-80 lg:w-96 flex-shrink-0 relative"
  >
    <div className="relative p-6 border border-bone-faded/15 bg-ink-deep h-full">
      <CornerBrackets className="text-gilt/30" size={12} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-mono text-[10px] text-bone-faded hover:text-bone-white transition-colors tracking-widest z-10"
      >
        ✕ CLOSE
      </button>

      {/* Ring / sublabel badge */}
      <div className="font-mono text-[9px] tracking-widest mb-4 mt-1"
        style={{ color: `rgb(${node.rgb.join(',')})` }}>
        {node.sublabel.toUpperCase()} · RING {node.ring + 1}
      </div>

      {/* Title */}
      <h3 className="font-display text-xl text-bone-white uppercase tracking-wider mb-1 leading-tight">
        {node.title}
      </h3>
      <div className="font-subdisplay text-[10px] text-bone-faded tracking-widest mb-5">
        {node.subtitle}
      </div>

      {/* Divider */}
      <div className="h-px mb-5" style={{ background: `rgba(${node.rgb.join(',')},0.3)` }} />

      {/* Body */}
      <p className="font-body text-bone-dim text-sm italic leading-relaxed mb-5">
        {node.body}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {node.tags.map(tag => (
          <span key={tag}
            className="px-2 py-0.5 border text-[9px] font-mono uppercase tracking-tighter"
            style={{
              borderColor: `rgba(${node.rgb.join(',')},0.35)`,
              color:       `rgba(${node.rgb.join(',')},0.8)`,
            }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Link (projects only) */}
      {node.link && (
        <motion.a
          href={node.link}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 4 }}
          className="inline-flex items-center gap-2 font-subdisplay text-[10px] tracking-[0.25em] uppercase border-b pb-0.5 transition-colors"
          style={{ color: `rgb(${node.rgb.join(',')})`, borderColor: `rgba(${node.rgb.join(',')},0.4)` }}
        >
          Visit Project
          <span>→</span>
        </motion.a>
      )}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Constellation canvas
// ─────────────────────────────────────────────────────────────────────────────

const Constellation: React.FC<{
  selectedId:   string | null;
  onNodeSelect: (node: NodeDef | null) => void;
}> = ({ selectedId, onNodeSelect }) => {
  const svgRef        = useRef<SVGSVGElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const tiltInnerRef  = useRef<HTMLDivElement>(null);

  // Mutable RAF state — never causes React re-renders
  const angleRef      = useRef<number[]>(NODES.map(n => n.startAngle));
  const posRef        = useRef<{ x: number; y: number }[]>(NODES.map(() => ({ x: 0, y: 0 })));
  const hoveredRef    = useRef<string | null>(null);
  const selectedRef   = useRef<string | null>(selectedId);
  const tilt          = useRef({ rx: 0, ry: 0, txRx: 0, txRy: 0 });
  const lastTimeRef   = useRef<number>(0);

  // Keep selectedRef in sync with prop (read by RAF loop without stale closure)
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    const tiltInner = tiltInnerRef.current;
    if (!svg || !wrapper || !tiltInner) return;

    // ── SVG helpers ──────────────────────────────────────────────────────────
    const el = (id: string) => svg.getElementById(id) as SVGElement | null;

    // ── Sizing ───────────────────────────────────────────────────────────────
    let VW = 900, VH = 560, CX = 450, CY = 280;

    const applySizing = () => {
      const rect = wrapper.getBoundingClientRect();
      VW = rect.width;
      VH = Math.max(rect.width * 0.6, 400);
      CX = VW / 2;
      CY = VH / 2;
      svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
      svg.setAttribute('width',  String(VW));
      svg.setAttribute('height', String(VH));
      // Reposition orbit rings and central orb
      const minR = Math.min(CX, CY);
      for (let r = 0; r < 3; r++) {
        const ringEl = el(`ring-${r}`);
        if (ringEl) {
          ringEl.setAttribute('cx', String(CX));
          ringEl.setAttribute('cy', String(CY));
          ringEl.setAttribute('r',  String(minR * RING_RADII_FRAC[r]));
        }
      }
      const orbGroup = el('central-orb');
      if (orbGroup) orbGroup.setAttribute('transform', `translate(${CX},${CY})`);
    };

    const onResize = () => { applySizing(); };
    window.addEventListener('resize', onResize);
    applySizing();

    // ── Mouse move — parallax tilt ────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width  - 0.5;
      const ny = (e.clientY - rect.top)  / rect.height - 0.5;
      tilt.current.txRx = ny * -10;
      tilt.current.txRy = nx *  14;

      // Hit test for hover
      const minR = Math.min(CX, CY);
      let hit: string | null = null;
      for (let i = 0; i < NODES.length; i++) {
        const p = posRef.current[i];
        const nr = RING_NODE_R[NODES[i].ring] * 3; // generous hit radius
        const dx = e.clientX - rect.left - p.x;
        const dy = e.clientY - rect.top  - p.y;
        if (dx*dx + dy*dy < nr*nr) { hit = NODES[i].id; break; }
      }
      if (hit !== hoveredRef.current) {
        hoveredRef.current = hit;
        wrapper.style.cursor = hit ? 'pointer' : 'default';
      }
    };

    // ── Click ─────────────────────────────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const minR = Math.min(CX, CY);
      for (let i = 0; i < NODES.length; i++) {
        const p = posRef.current[i];
        const nr = RING_NODE_R[NODES[i].ring] * 4;
        const dx = e.clientX - rect.left - p.x;
        const dy = e.clientY - rect.top  - p.y;
        if (dx*dx + dy*dy < nr*nr) {
          onNodeSelect(selectedRef.current === NODES[i].id ? null : NODES[i]);
          return;
        }
      }
      onNodeSelect(null);
    };

    wrapper.addEventListener('mousemove', onMouseMove, { passive: true });
    wrapper.addEventListener('click', onClick);

    // ── RAF loop ──────────────────────────────────────────────────────────────
    let rafId = 0;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(now - (lastTimeRef.current || now), 50);
      lastTimeRef.current = now;
      const t = now * 0.001;
      const minR = Math.min(CX, CY);

      // Smooth tilt toward target
      tilt.current.rx += (tilt.current.txRx - tilt.current.rx) * 0.06;
      tilt.current.ry += (tilt.current.txRy - tilt.current.ry) * 0.06;
      tiltInner.style.transform =
        `rotateX(${tilt.current.rx}deg) rotateY(${tilt.current.ry}deg)`;

      const hId = hoveredRef.current;
      const sId = selectedRef.current;

      // Update each node
      for (let i = 0; i < NODES.length; i++) {
        const node = NODES[i];
        const paused = hId === node.id || sId === node.id;
        if (!paused) angleRef.current[i] += RING_SPEEDS[node.ring] * dt;

        const angle = angleRef.current[i];
        const radius = minR * RING_RADII_FRAC[node.ring];
        const x = CX + Math.cos(angle) * radius;
        const y = CY + Math.sin(angle) * radius;
        posRef.current[i] = { x, y };

        const isHovered  = hId === node.id;
        const isSelected = sId === node.id;
        const isDimmed   = !!sId && !isSelected;

        // Update connection line
        const lineEl = el(`line-${i}`);
        if (lineEl) {
          lineEl.setAttribute('x2', String(x));
          lineEl.setAttribute('y2', String(y));
          const lineAlpha = isSelected ? 0.35 : isHovered ? 0.2 : isDimmed ? 0.02 : 0.06;
          lineEl.setAttribute('stroke', `rgba(${node.rgb.join(',')},${lineAlpha})`);
        }

        // Update node group position
        const groupEl = el(`node-${i}`);
        if (groupEl) groupEl.setAttribute('transform', `translate(${x},${y})`);

        // Update glow
        const glowEl = el(`glow-${i}`);
        if (glowEl) {
          const glowR     = isSelected ? 32 : isHovered ? 26 : 18;
          const glowAlpha = isSelected ? 0.22 : isHovered ? 0.16 : isDimmed ? 0.02 : 0.06;
          glowEl.setAttribute('r', String(glowR));
          glowEl.setAttribute('fill', `rgba(${node.rgb.join(',')},${glowAlpha})`);
        }

        // Update node circle
        const circEl = el(`circ-${i}`);
        if (circEl) {
          const bodyAlpha = isDimmed ? 0.15 : isSelected ? 1 : isHovered ? 0.95 : 0.65;
          circEl.setAttribute('fill',   `rgba(${node.rgb.join(',')},${bodyAlpha * 0.35})`);
          circEl.setAttribute('stroke', `rgba(${node.rgb.join(',')},${bodyAlpha * 0.9})`);
          circEl.setAttribute('r', String(isSelected || isHovered ? RING_NODE_R[node.ring] + 1.5 : RING_NODE_R[node.ring]));
        }

        // Update label
        const labelEl = el(`label-${i}`);
        if (labelEl) {
          const labelAlpha = isDimmed ? 0.12 : isSelected ? 1 : isHovered ? 0.95 : 0.5;
          labelEl.setAttribute('fill', `rgba(230,224,216,${labelAlpha})`);
          labelEl.setAttribute('font-size', String(isSelected || isHovered ? 9 : 8));
        }
      }

      // Pulse central orb
      const orbPulse = el('orb-pulse');
      if (orbPulse) {
        const pr = 24 + Math.sin(t * 1.4) * 3;
        const pa = 0.12 + Math.sin(t * 1.4) * 0.05;
        orbPulse.setAttribute('r', String(pr));
        orbPulse.setAttribute('stroke', `rgba(184,147,90,${pa})`);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      wrapper.removeEventListener('mousemove', onMouseMove);
      wrapper.removeEventListener('click', onClick);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrapperRef} className="relative w-full select-none"
      style={{ minHeight: 400 }}>
      <div ref={tiltInnerRef} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        <svg
          ref={svgRef}
          className="w-full"
          style={{ display: 'block' }}
          aria-label="Interactive skill constellation — click nodes to explore"
        >
          {/* ── Orbit rings ───────────────────────────────────────────────── */}
          {[0, 1, 2].map(r => (
            <circle
              key={r} id={`ring-${r}`}
              cx="450" cy="280" r="100"
              fill="none"
              stroke={`rgba(184,147,90,${[0.10, 0.07, 0.05][r]})`}
              strokeWidth="0.5"
              strokeDasharray={`${[4, 3, 2][r]} ${[10, 12, 15][r]}`}
            />
          ))}

          {/* ── Connection lines (positions updated via RAF) ───────────────── */}
          {NODES.map((node, i) => (
            <line
              key={node.id} id={`line-${i}`}
              x1="450" y1="280" x2="450" y2="280"
              stroke={`rgba(${node.rgb.join(',')},0.06)`}
              strokeWidth="0.5"
            />
          ))}

          {/* ── Central soul orb ──────────────────────────────────────────── */}
          <g id="central-orb" transform="translate(450,280)">
            <circle r="52" fill="rgba(184,147,90,0.04)" />
            <circle r="38" fill="rgba(184,147,90,0.07)" />
            <circle r="26" fill="rgba(184,147,90,0.12)" />
            <circle id="orb-pulse" r="24" fill="none"
              stroke="rgba(184,147,90,0.12)" strokeWidth="1" />
            <circle r="16" fill="rgba(184,147,90,0.22)"
              stroke="rgba(184,147,90,0.65)" strokeWidth="0.75" />
            <circle r="6" fill="rgba(255,246,215,0.9)" />
            <text textAnchor="middle" dy="34"
              fontFamily="Cinzel, serif" fontSize="6.5"
              fill="rgba(184,147,90,0.55)" letterSpacing="2">
              M.WIKSTRÖM
            </text>
          </g>

          {/* ── Nodes (positions updated via RAF) ─────────────────────────── */}
          {NODES.map((node, i) => (
            <g key={node.id} id={`node-${i}`} transform="translate(450,280)"
              style={{ cursor: 'pointer' }}>
              {/* Glow halo */}
              <circle id={`glow-${i}`} r="18"
                fill={`rgba(${node.rgb.join(',')},0.06)`} />
              {/* Body */}
              <circle id={`circ-${i}`}
                r={RING_NODE_R[node.ring]}
                fill={`rgba(${node.rgb.join(',')},0.25)`}
                stroke={`rgba(${node.rgb.join(',')},0.7)`}
                strokeWidth="1"
              />
              {/* Bright core */}
              <circle r="2.5" fill="rgba(255,246,215,0.85)" />
              {/* Label */}
              <text id={`label-${i}`}
                textAnchor="middle"
                dy={-RING_NODE_R[node.ring] - 5}
                fontFamily="Cinzel, serif"
                fontSize="8"
                fill="rgba(230,224,216,0.5)"
                letterSpacing="1">
                {node.label.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Hint — fades after first interaction */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="font-mono text-[9px] text-bone-faded/35 tracking-widest uppercase">
          Hover to pause · Click to explore
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────

export const About: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeDef | null>(null);

  const handleSelect = useCallback((node: NodeDef | null) => {
    setSelectedNode(node);
  }, []);

  return (
    <section id="about" className="py-32 px-6 max-w-6xl mx-auto">
      <SectionHeading numeral="II" title="The Bearer" sigil="eye" />

      {/* Opening line */}
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="font-body text-bone-dim text-base italic mb-12 max-w-xl border-l border-ember-blood pl-6"
      >
        I build AI agents and automation systems for regulated environments.
        Places where code has to be right{' '}
        <span className="text-gilt not-italic">the first time</span>
        {' '}— and every time after.
      </motion.p>

      {/* Constellation + detail panel */}
      <div className="flex flex-col md:flex-row gap-0 items-stretch"
        style={{ perspective: '1200px' }}>

        {/* Constellation — shrinks when panel is open */}
        <motion.div
          animate={{ flex: selectedNode ? '1 1 0%' : '1 1 100%' }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="min-w-0"
        >
          <Constellation
            selectedId={selectedNode?.id ?? null}
            onNodeSelect={handleSelect}
          />
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedNode && (
            <NodeDetail
              key={selectedNode.id}
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
