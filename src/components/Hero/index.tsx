/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sigil } from '../shared/Sigil';
import { DispersingText } from '../shared/DispersingText';
import { PROFILE } from '../../lib/data';

export const Hero: React.FC = () => {
  const [isBonfireLit, setIsBonfireLit] = useState(false);

  return (
    <section className="relative min-h-screen py-20 flex flex-col items-center justify-center overflow-hidden bg-ink-void">
      
      {/* Background Sigil Glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[60vh] h-[60vh] text-gilt pointer-events-none sigil-bg flex items-center justify-center -z-10"
      >
        <Sigil variant="runes" className="w-full h-full animate-[spin_60s_linear_infinite]" />
      </motion.div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
        {/* Left Pillar: Bio & Status */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 md:col-span-4 flex flex-col pt-8 min-w-0"
        >
          <div>
            <div className="font-subdisplay text-bone-dim text-[10px] tracking-widest mb-4 uppercase">II. THE BEARER</div>
            <DispersingText 
              text="“A seeker of order in regulated dark. Binder of agents. Keeper of the ledger. He who makes the machine toil so that men may rest.”"
              className="text-lg leading-relaxed italic md:pr-8"
              baseColor="#9A968B"
            />
            <div className="mt-8 space-y-4">
              <div className="border-l border-ember-blood pl-4 py-2">
                <div className="font-mono text-[10px] text-bone-faded uppercase tracking-tighter">Current Domain</div>
                <div className="font-display text-xl text-bone-white truncate">DNB Bank — AI & Automation</div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 relative bg-ink-deep border border-bone-faded/10">
                <div className="font-mono text-2xl text-bone-white">06</div>
                <div className="font-subdisplay text-[9px] tracking-tighter text-bone-faded uppercase">Years Active</div>
              </div>
              <div className="p-4 relative bg-ink-deep border border-bone-faded/10">
                <div className="font-mono text-2xl text-bone-white">14</div>
                <div className="font-subdisplay text-[9px] tracking-tighter text-bone-faded uppercase">Systems Tamed</div>
              </div>
            </div>
            
            <motion.a 
              href="/CV_Maximilian_WikstromPDF.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ 
                backgroundColor: 'rgba(184,147,90,0.05)', 
                borderColor: '#B8935A', 
                color: '#B8935A', 
                y: -5,
                textShadow: '0px 0px 8px rgba(184,147,90,0.8)',
                boxShadow: '0px 0px 15px rgba(184,147,90,0.2)'
              }}
              transition={{ duration: 0.3 }}
              className="block text-center border border-bone-faded/40 py-3 font-subdisplay text-[11px] tracking-widest uppercase text-bone-white"
            >
              Download Resume (PDF)
            </motion.a>
            
            <div className="grid grid-cols-3 gap-2 w-full pt-2">
              <motion.a 
                href={`mailto:${PROFILE.email}`} 
                whileHover={{ y: -5, borderColor: '#B8935A', backgroundColor: 'rgba(184,147,90,0.05)', boxShadow: '0px 0px 15px rgba(184,147,90,0.2)' }}
                className="group flex flex-col items-center justify-between gap-4 p-4 border border-bone-faded/10 bg-ink-deep"
              >
                <Sigil variant="eye" className="w-10 h-10 text-bone-dim transition-all duration-300 group-hover:text-gilt" />
                <div className="text-center w-full">
                  <span className="block font-subdisplay text-[9px] text-bone-white tracking-widest uppercase mb-1 truncate transition-all duration-300 group-hover:text-gilt">Initiate Rite</span>
                  <span className="block font-mono text-[8px] text-bone-faded tracking-[0.2em] uppercase truncate">(Email)</span>
                </div>
              </motion.a>
              <motion.a 
                href={PROFILE.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ y: -5, borderColor: '#B8935A', backgroundColor: 'rgba(184,147,90,0.05)', boxShadow: '0px 0px 15px rgba(184,147,90,0.2)' }}
                className="group flex flex-col items-center justify-between gap-4 p-4 border border-bone-faded/10 bg-ink-deep"
              >
                <Sigil variant="serpent" className="w-10 h-10 text-bone-dim transition-all duration-300 group-hover:text-gilt" />
                <div className="text-center w-full">
                  <span className="block font-subdisplay text-[9px] text-bone-white tracking-widest uppercase mb-1 truncate transition-all duration-300 group-hover:text-gilt">The Web</span>
                  <span className="block font-mono text-[8px] text-bone-faded tracking-[0.2em] uppercase truncate">(LinkedIn)</span>
                </div>
              </motion.a>
              <motion.a 
                href={PROFILE.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ y: -5, borderColor: '#B8935A', backgroundColor: 'rgba(184,147,90,0.05)', boxShadow: '0px 0px 15px rgba(184,147,90,0.2)' }}
                className="group flex flex-col items-center justify-between gap-4 p-4 border border-bone-faded/10 bg-ink-deep"
              >
                <Sigil variant="runes" className="w-10 h-10 text-bone-dim transition-all duration-300 group-hover:text-gilt" />
                <div className="text-center w-full">
                  <span className="block font-subdisplay text-[9px] text-bone-white tracking-widest uppercase mb-1 truncate transition-all duration-300 group-hover:text-gilt">The Forge</span>
                  <span className="block font-mono text-[8px] text-bone-faded tracking-[0.2em] uppercase truncate">(GitHub)</span>
                </div>
              </motion.a>
            </div>
            
            <motion.a 
              href="https://cursedechoes.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ y: -5, borderColor: '#8B1A1A', backgroundColor: 'rgba(139,26,26,0.05)', boxShadow: '0px 0px 20px rgba(139,26,26,0.3)' }}
              className="group flex items-center justify-center gap-4 py-4 px-6 border border-bone-faded/10 bg-ink-deep w-full mt-2 cursor-pointer"
            >
              <Sigil variant="sword" className="w-6 h-6 text-bone-dim transition-all duration-300 group-hover:text-ember-blood flex-shrink-0 -rotate-45" />
              <span className="font-display text-[clamp(12px,1.5vw,18px)] tracking-[0.2em] text-bone-white uppercase transition-all duration-300 group-hover:text-ember-blood whitespace-nowrap">Play Minigame</span>
              <Sigil variant="sword" className="w-6 h-6 text-bone-dim transition-all duration-300 group-hover:text-ember-blood flex-shrink-0 rotate-45" />
            </motion.a>
          </div>
        </motion.div>

        {/* Center Pillar: Main Identity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-1 md:col-span-4 flex flex-col items-center justify-between md:border-x border-bone-faded/20 py-12 md:py-0 min-w-0"
        >
          <div className="flex flex-col items-center flex-1 justify-center pt-8 px-4 md:px-0">
            <h1 className="font-display text-[clamp(2.5rem,5.2vw,6.8rem)] text-center leading-[0.82] tracking-[0.08em] sm:tracking-[0.1em] md:tracking-[0.2em] uppercase flex flex-col items-center">
              <DispersingText as="span" text="MAXIMILIAN" baseColor="#E6E0D4" className="flex-nowrap justify-center text-bone-white whitespace-nowrap" />
              <DispersingText as="span" text="WIKSTRÖM" baseColor="#9A968B" className="flex-nowrap justify-center text-bone-dim whitespace-nowrap" />
            </h1>
            <div className="h-px w-20 sm:w-24 md:w-32 bg-ember-blood my-6 md:my-8"></div>
            <DispersingText 
              text="AI & Automation Specialist"
              className="font-subdisplay text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.4em] text-center uppercase justify-center whitespace-nowrap"
              baseColor="#B8935A" 
              style={{ color: '#B8935A' }} 
            />
          </div>

          <div 
            className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px] aspect-square mt-10 sm:mt-12 md:mt-16 mx-auto flex items-center justify-center cursor-pointer"
            onMouseEnter={() => {
              setIsBonfireLit(true);
              (window as any).playDarkSoulsMusic?.();
            }}
            onMouseLeave={() => setIsBonfireLit(false)}
          >
            <motion.img 
              src="/bonfire.jpg" 
              alt="Bonfire" 
              initial={false}
              animate={{
                opacity: isBonfireLit ? 0.95 : 0.6,
                scale: isBonfireLit ? 1.05 : 1,
                filter: isBonfireLit ? "grayscale(0%)" : "grayscale(30%)",
                mixBlendMode: isBonfireLit ? "normal" : "luminosity"
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute w-full h-full object-contain"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)'
              }}
            />
            
            {/* The classic interactive text */}
            <AnimatePresence>
              {isBonfireLit && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <div className="font-display text-2xl sm:text-4xl tracking-[0.3em] text-[#ffcf40] drop-shadow-[0_0_20px_rgba(255,69,0,0.8)] scale-y-110 whitespace-nowrap">
                    BONFIRE LIT
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Soft lighting bleed on hover */}
            <AnimatePresence>
              {isBonfireLit && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,100,0,0.25)_0%,transparent_65%)] pointer-events-none" 
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Pillar: Recent Deeds */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 md:col-span-4 flex flex-col pt-8 min-w-0"
        >
          <div>
            <div className="font-subdisplay text-bone-dim text-[10px] tracking-widest mb-4 uppercase">III. RECENT DEEDS</div>
            <div className="space-y-6">
              {[
                { 
                  title: "DNB Bank — AI & Automation", 
                  num: "I", 
                  desc: "Binding Copilot Studio agents and Power Automate flows into the secure foundations of DNB. Scaling identity governance and automation in the regulated shadows.", 
                  tags: ["AI AGENTS", "POWER AUTOMATE"] 
                },
                { 
                  title: "SEB — Agentic Thesis", 
                  num: "II", 
                  desc: "A scholar's pursuit into Agentic AI within the iron-clad walls of SEB. Developing frameworks for autonomous reasoning where failure is not an option.", 
                  tags: ["AGENTIC AI", "LLMS"],
                  pdfLink: "/Integrating%20Agentic%20AI%20into%20Software%20Development%20A%20Sociotechnical%20Case%20Study%20in%20a%20Large%20Nordic%20Bank.pdf"
                }
              ].map((deed, i) => (
                <div key={i} className="group relative p-6 bg-ink-deep border border-bone-faded/10 transition-colors hover:bg-ink-iron">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-xl text-bone-white uppercase tracking-wider">{deed.title}</h3>
                    <span className="font-subdisplay text-[10px] text-bone-faded">{deed.num}</span>
                  </div>
                  <p className="text-xs text-bone-dim mt-2 font-body italic leading-relaxed">
                    {deed.desc}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {deed.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono border border-bone-faded/30 px-2 py-0.5 text-bone-faded uppercase">{tag}</span>
                    ))}
                  </div>
                  {deed.pdfLink && (
                    <div className="mt-6 flex">
                      <motion.a 
                        href={deed.pdfLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        whileHover={{ y: -3, color: '#B8935A', textShadow: '0px 0px 8px rgba(184,147,90,0.8)', borderColor: '#B8935A' }}
                        transition={{ duration: 0.3 }}
                        className="inline-block font-subdisplay text-[9px] text-bone-white tracking-[0.3em] uppercase border-b border-bone-faded/30 pb-1"
                      >
                        View Document
                      </motion.a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-12 border-t border-bone-faded/30">
            <div className="font-subdisplay text-[10px] tracking-[0.2em] text-gilt mb-2 uppercase">Inquiries</div>
            <div className="font-mono text-sm text-bone-white">MAX.WIK@ICLOUD.COM</div>
            <div className="font-mono text-[10px] text-bone-faded mt-1 tracking-widest uppercase">+46 70 736 0515</div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 flex flex-col items-center"
      >
        <div className="w-[1px] h-8 bg-bone-faded/30 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 32] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-2 bg-ember-blood"
          />
        </div>
      </motion.div>
    </section>
  );
};
