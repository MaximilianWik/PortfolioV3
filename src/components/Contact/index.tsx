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
import { PROFILE } from '../../lib/data';

// ─── Field ────────────────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string;
  name:  string;
  type?: string;
  rows?: number;
  required?: boolean;
}> = ({ label, name, type = 'text', rows, required = true }) => {
  const [focused, setFocused] = useState(false);
  const [filled,  setFilled]  = useState(false);

  const baseClass =
    'w-full bg-transparent py-3.5 font-body text-bone-dim focus:outline-none ' +
    'transition-colors duration-300 placeholder:opacity-0 peer';

  return (
    <div className="relative">
      {/* Underline track */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-bone-faded/20" />
      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-ember-blood origin-left"
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {rows ? (
        <textarea
          name={name}
          rows={rows}
          required={required}
          className={`${baseClass} resize-none border-0`}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={e  => { setFocused(false); setFilled(e.target.value !== ''); }}
          onChange={e => setFilled(e.target.value !== '')}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className={`${baseClass} border-0`}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={e  => { setFocused(false); setFilled(e.target.value !== ''); }}
          onChange={e => setFilled(e.target.value !== '')}
        />
      )}

      <label
        className={`
          absolute left-0 font-subdisplay text-[10px] uppercase tracking-widest
          pointer-events-none transition-all duration-300
          ${focused || filled
            ? '-top-5 text-[9px] ' + (focused ? 'text-ember-blood' : 'text-bone-faded/60')
            : 'top-3.5 text-bone-faded/55'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

// ─── Contact link ─────────────────────────────────────────────────────────────

const ContactLink: React.FC<{
  href: string;
  sigil: 'eye' | 'serpent' | 'runes';
  sublabel: string;
  label: string;
  external?: boolean;
}> = ({ href, sigil, sublabel, label, external }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="relative flex items-center gap-4 py-3.5 border-b border-bone-faded/8 group overflow-hidden"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 bg-ink-deep pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      <Sigil
        variant={sigil}
        className={`w-5 h-5 flex-shrink-0 z-10 transition-colors duration-300 ${
          hovered ? 'text-gilt' : 'text-bone-faded/50'
        }`}
      />

      <div className="z-10 min-w-0">
        <div className="font-mono text-[8px] text-bone-faded/40 uppercase tracking-widest">{sublabel}</div>
        <div className={`font-body text-sm transition-colors duration-300 truncate ${hovered ? 'text-bone-white' : 'text-bone-dim'}`}>
          {label}
        </div>
      </div>

      <motion.span
        className="ml-auto z-10 font-mono text-[10px] text-bone-faded/30"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.a>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const Contact: React.FC = () => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [btnHovered, setBtnHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== 'idle') return;
    setState('sending');

    const fd   = new FormData(e.currentTarget);
    const name = (fd.get('name')    as string) || '';
    const mail = (fd.get('email')   as string) || '';
    const msg  = (fd.get('message') as string) || '';

    // Open the user's mail client with the content pre-filled
    const subject = encodeURIComponent(`Invocation from ${name}`);
    const body    = encodeURIComponent(`From: ${name} <${mail}>\n\n${msg}`);
    window.open(`mailto:${PROFILE.email}?subject=${subject}&body=${body}`);

    setTimeout(() => setState('sent'), 900);
  };

  return (
    <section id="invocation" className="relative py-28 px-6 overflow-hidden">

      {/* Atmospheric ember glow behind the section */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.08) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto">
        <SectionHeading numeral="VII" title="The Invocation" sigil="compass" />

        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* ── Left — info panel ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="md:col-span-5 flex flex-col gap-8"
          >
            {/* Quote */}
            <p className="font-body italic text-bone-dim text-lg leading-relaxed border-l-2 border-ember-blood pl-6">
              "Speak truly. The bearer answers all who come without veil."
            </p>

            {/* Bonfire — centrepiece */}
            <div className="flex justify-center">
              <Bonfire />
            </div>

            {/* Contact links */}
            <div className="relative border border-bone-faded/10 bg-ink-deep/60 px-5 py-2">
              <CornerBrackets className="text-bone-faded/15" size={9} />

              <div className="font-mono text-[8px] text-bone-faded/40 uppercase tracking-widest py-3 border-b border-bone-faded/8">
                Contact Channels
              </div>

              <ContactLink
                href={`mailto:${PROFILE.email}`}
                sigil="eye"
                sublabel="Email"
                label={PROFILE.email}
              />
              <ContactLink
                href={PROFILE.linkedin}
                sigil="serpent"
                sublabel="LinkedIn"
                label="Maximilian Wikström"
                external
              />
              <ContactLink
                href={PROFILE.github}
                sigil="runes"
                sublabel="GitHub"
                label="MaximilianWik"
                external
              />

              {/* Location row */}
              <div className="flex items-center gap-3 pt-4">
                <span className="font-mono text-[8px] text-bone-faded/40 uppercase tracking-widest">
                  Based in
                </span>
                <span className="font-mono text-[10px] text-bone-dim">
                  Stockholm, Sweden
                </span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gilt animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* ── Right — form ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="md:col-span-7"
          >
            <AnimatePresence mode="wait">

              {state !== 'sent' ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.4 } }}
                  onSubmit={handleSubmit}
                  className="space-y-10"
                >
                  <div className="grid md:grid-cols-2 gap-10">
                    <Field name="name"  label="The Speaker (Name)"  />
                    <Field name="email" label="The Sigil (Email)" type="email" />
                  </div>

                  <Field name="message" label="The Message" rows={5} />

                  {/* Submit */}
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      disabled={state === 'sending'}
                      onHoverStart={() => setBtnHovered(true)}
                      onHoverEnd={() => setBtnHovered(false)}
                      className="relative w-full py-4 border border-bone-faded/25 font-subdisplay text-[11px] tracking-[0.45em] uppercase overflow-hidden transition-colors duration-300 disabled:opacity-60"
                      animate={{
                        color: btnHovered ? '#B8935A' : '#9A968B',
                        borderColor: btnHovered ? 'rgba(184,147,90,0.55)' : 'rgba(92,88,79,0.25)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatedOutline
                        active={state === 'sending'}
                        colorClass="bg-ember-blood"
                        durationMs={300}
                      />

                      <AnimatePresence mode="wait">
                        {state === 'sending' ? (
                          <motion.span
                            key="sending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-3"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                              className="inline-block"
                            >
                              ◈
                            </motion.span>
                            Invoking
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Send Invocation
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <p className="mt-4 text-center font-mono text-[9px] text-bone-faded/35 tracking-widest">
                      Opens your mail client · No data stored here
                    </p>
                  </div>
                </motion.form>
              ) : (

                /* ── Success ─────────────────────────────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative border border-bone-faded/10 bg-ink-deep/60 p-12 text-center min-h-[360px] flex flex-col items-center justify-center gap-8"
                >
                  <CornerBrackets className="text-gilt/25" size={14} />

                  {/* Sigil ring */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border border-gilt/15"
                    />
                    <div className="w-20 h-20 rounded-full border border-gilt/30 flex items-center justify-center relative">
                      <Sigil variant="compass" className="w-8 h-8 text-gilt" />
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full"
                      style={{ boxShadow: '0 0 30px rgba(184,147,90,0.15)' }} />
                  </div>

                  <div>
                    <p className="font-display text-2xl text-bone-dim uppercase tracking-wider mb-3">
                      The Bell Has Rung
                    </p>
                    <p className="font-body italic text-bone-dim/70 text-base leading-relaxed max-w-sm mx-auto">
                      "The message travels. The bearer will hear."
                    </p>
                  </div>

                  <button
                    onClick={() => setState('idle')}
                    className="font-subdisplay text-[9px] text-bone-faded/40 hover:text-bone-faded uppercase tracking-widest transition-colors duration-300 underline underline-offset-4 decoration-bone-faded/20"
                  >
                    Invoke Again
                  </button>
                </motion.div>

              )}

            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
