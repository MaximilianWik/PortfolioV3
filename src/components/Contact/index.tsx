/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from '../shared/SectionHeading';
import { Sigil } from '../shared/Sigil';
import { CornerBrackets } from '../shared/CornerBrackets';
import { AnimatedOutline } from '../shared/AnimatedOutline';
import { Bonfire } from '../shared/Bonfire';
import { useVanillaTilt } from '../../hooks/useVanillaTilt';
import { PROFILE } from '../../lib/data';

// ─── Field ────────────────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string; name: string; type?: string; rows?: number;
}> = ({ label, name, type = 'text', rows }) => {
  const [focused, setFocused] = useState(false);
  const [filled,  setFilled]  = useState(false);
  const raised = focused || filled;
  const cls = 'w-full bg-transparent py-3 font-body text-bone-dim focus:outline-none resize-none transition-colors duration-300';
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-bone-faded/15" />
      <motion.div className="absolute bottom-0 left-0 h-px bg-ember-blood origin-left"
        animate={{ scaleX: focused ? 1 : 0 }} transition={{ duration: 0.35 }} />
      {rows
        ? <textarea name={name} rows={rows} required placeholder=" " className={cls}
            onFocus={() => setFocused(true)}
            onBlur={e  => { setFocused(false); setFilled(!!e.target.value); }}
            onChange={e => setFilled(!!e.target.value)} />
        : <input name={name} type={type} required placeholder=" " className={cls}
            onFocus={() => setFocused(true)}
            onBlur={e  => { setFocused(false); setFilled(!!e.target.value); }}
            onChange={e => setFilled(!!e.target.value)} />
      }
      <label className={`absolute left-0 font-subdisplay text-[10px] uppercase tracking-widest pointer-events-none transition-all duration-300 ${
        raised ? '-top-4 text-[9px] ' + (focused ? 'text-ember-blood' : 'text-bone-faded/50') : 'top-3 text-bone-faded/45'}`}>
        {label}
      </label>
    </div>
  );
};

// ─── Form modal ───────────────────────────────────────────────────────────────

const FormModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  // ── Replace YOUR_FORMSPREE_ID with your form ID from formspree.io/forms
  const FORMSPREE = 'YOUR_FORMSPREE_ID';

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== 'idle') return;
    setState('sending');

    const fd = new FormData(e.currentTarget);

    if (FORMSPREE !== 'YOUR_FORMSPREE_ID') {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' },
        });
        if (res.ok) { setState('sent'); return; }
      } catch { /* fall through to mailto */ }
    }

    // Fallback: open mail client
    const name = fd.get('name') as string;
    const mail = fd.get('email') as string;
    const msg  = fd.get('message') as string;
    window.open(`mailto:${PROFILE.email}?subject=${encodeURIComponent(`Invocation from ${name}`)}&body=${encodeURIComponent(`From: ${name} <${mail}>\n\n${msg}`)}`);
    setTimeout(() => setState('sent'), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(7,7,10,0.88)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0, scale: 0.92,    y: 16 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg mx-6 bg-ink-deep border border-bone-faded/10 p-10"
        onClick={e => e.stopPropagation()}
      >
        <CornerBrackets className="text-gilt/20" size={14} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-5 font-mono text-[9px] text-bone-faded/40 hover:text-bone-faded uppercase tracking-widest transition-colors">
          ✕
        </button>

        <AnimatePresence mode="wait">
          {state !== 'sent' ? (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}>
              <div className="font-mono text-[9px] text-gilt/60 uppercase tracking-widest mb-1">Direct Rite</div>
              <h3 className="font-display text-2xl text-bone-dim uppercase tracking-wider mb-8">Speak Directly</h3>

              <form onSubmit={send} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <Field name="name"  label="The Speaker" />
                  <Field name="email" label="The Sigil" type="email" />
                </div>
                <Field name="message" label="The Message" rows={4} />

                <motion.button type="submit" disabled={state === 'sending'}
                  className="relative w-full mt-2 py-4 border border-bone-faded/20 font-subdisplay text-[11px] tracking-[0.45em] uppercase overflow-hidden disabled:opacity-50"
                  whileHover={{ borderColor: 'rgba(184,147,90,0.55)', color: '#B8935A' }}
                  transition={{ duration: 0.25 }}>
                  <AnimatedOutline active={state === 'sending'} colorClass="bg-ember-blood" durationMs={280} />
                  <AnimatePresence mode="wait">
                    {state === 'sending'
                      ? <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} className="inline-block">◈</motion.span>
                          Invoking
                        </motion.span>
                      : <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Send Invocation</motion.span>
                    }
                  </AnimatePresence>
                </motion.button>

                <p className="text-center font-mono text-[8px] text-bone-faded/25 tracking-widest">
                  Opens your mail client · No data stored
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div key="sent"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="py-8 text-center flex flex-col items-center gap-6">
              <div className="relative w-16 h-16 flex items-center justify-center border border-gilt/30 rounded-full">
                <motion.div className="absolute inset-0 rounded-full border border-gilt/15"
                  animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
                <Sigil variant="eye" className="w-7 h-7 text-gilt" />
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 28px rgba(184,147,90,0.18)' }} />
              </div>
              <div>
                <p className="font-display text-xl text-bone-dim uppercase tracking-wider mb-2">The Bell Has Rung</p>
                <p className="font-body italic text-bone-dim/65 text-sm leading-relaxed">"The bearer will hear."</p>
              </div>
              <button onClick={() => { setState('idle'); onClose(); }}
                className="font-subdisplay text-[9px] text-bone-faded/40 hover:text-bone-faded uppercase tracking-widest underline underline-offset-4 decoration-bone-faded/20 transition-colors">
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ─── Vessel ───────────────────────────────────────────────────────────────────

const Vessel: React.FC<{
  sigil: 'eye' | 'serpent' | 'runes';
  category: string;
  heading: string;
  value: string;
  tagline: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}> = ({ sigil, category, heading, value, tagline, href, external, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const tiltRef = useVanillaTilt<HTMLDivElement>({ max: 6, speed: 500, reverse: true, glare: false });

  const inner = (
    <div ref={tiltRef}
      className="relative h-full p-8 md:p-10 border border-bone-faded/10 bg-ink-deep overflow-hidden flex flex-col gap-5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <AnimatedOutline active={hovered} colorClass="bg-gilt" durationMs={220} />
      <CornerBrackets className={`transition-colors duration-400 ${hovered ? 'text-gilt/50' : 'text-bone-faded/12'}`} size={12} />

      {/* Inner ember glow */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(139,26,26,0.18) 0%, transparent 65%)' }} />

      {/* Sigil */}
      <motion.div animate={{ scale: hovered ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative z-10 w-fit">
        <Sigil variant={sigil} className={`w-9 h-9 transition-colors duration-300 ${hovered ? 'text-gilt' : 'text-bone-faded/40'}`} />
        <motion.div className="absolute inset-0 blur-sm"
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
          style={{ background: 'radial-gradient(circle, rgba(184,147,90,0.35) 0%, transparent 70%)' }} />
      </motion.div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-1.5 flex-1">
        <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-bone-faded/40">{category}</div>
        <div className={`font-display text-lg uppercase tracking-wider transition-colors duration-300 ${hovered ? 'text-bone-white' : 'text-bone-dim'}`}>{heading}</div>
        <div className={`font-mono text-[10px] transition-colors duration-300 truncate ${hovered ? 'text-gilt/80' : 'text-bone-faded/50'}`}>{value}</div>
      </div>

      {/* Tagline reveals on hover */}
      <motion.p
        className="relative z-10 font-body italic text-bone-dim/55 text-xs leading-relaxed border-t border-bone-faded/8 pt-4"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.3 }}>
        {tagline}
      </motion.p>
    </div>
  );

  if (onClick) return <div onClick={onClick} className="h-full">{inner}</div>;
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="h-full block">{inner}</a>;
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const Contact: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section id="invocation" className="relative min-h-screen flex flex-col justify-center py-24 px-6">

        {/* Background — rotating sigil at near-zero opacity, CSS-driven so it never touches the JS scheduler */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ animation: 'spin 120s linear infinite' }}>
          <Sigil variant="runes"
            className="w-[min(80vw,700px)] h-[min(80vw,700px)] text-bone-faded/[0.025]" />
        </div>

        {/* Radial glow at center */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.07) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">

          {/* Heading */}
          <SectionHeading numeral="VI" title="The Invocation" sigil="compass" />

          {/* Bonfire — hero element, scaled up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="my-4"
            style={{ transform: 'scale(1.5)', transformOrigin: 'center bottom', marginBottom: '3.5rem' }}>
            <Bonfire />
          </motion.div>

          {/* Quote */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-display italic text-bone-dim text-xl md:text-2xl text-center tracking-wider mb-16">
            "Speak the name. The bearer answers."
          </motion.p>

          {/* Three vessels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="w-full grid md:grid-cols-3 gap-4">

            <Vessel
              sigil="eye"
              category="Direct Rite"
              heading="Email"
              value={PROFILE.email}
              tagline="Open a direct channel. The bearer reads every word."
              onClick={() => setFormOpen(true)}
            />
            <Vessel
              sigil="serpent"
              category="The Web"
              heading="LinkedIn"
              value="Maximilian Wikström"
              tagline="Professional record. Open to conversations about agentic AI and durable software."
              href={PROFILE.linkedin}
              external
            />
            <Vessel
              sigil="runes"
              category="The Forge"
              heading="GitHub"
              value="MaximilianWik"
              tagline="Every project, every commit. The work speaks for itself."
              href={PROFILE.github}
              external
            />

          </motion.div>

        </div>
      </section>

      {/* Form modal */}
      <AnimatePresence>
        {formOpen && <FormModal onClose={() => setFormOpen(false)} />}
      </AnimatePresence>
    </>
  );
};
