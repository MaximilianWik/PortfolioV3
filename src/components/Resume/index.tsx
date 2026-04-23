/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { PROFILE, EDUCATION } from '../../lib/data';
import { motion } from 'motion/react';
import { RevealOnScroll } from '../shared/RevealOnScroll';

export const Resume: React.FC = () => {
  return (
    <section id="resume" className="relative py-32 px-6 overflow-hidden">
      {/* Background Eclipse */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <img 
            src="/eclipse.jpg" 
            alt="Eclipse Foreground" 
            className="w-full h-full object-cover object-top mix-blend-screen"
          />
          
          {/* Animated Bloom/Glow at the top (where the eclipse is) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] flex flex-col items-center">
            {/* Inner Core Glow */}
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-32 h-32 bg-amber-blood/40 blur-[60px] rounded-full translate-y-[10%]" 
            />
            
            {/* Outer Soft Bloom */}
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1 
              }}
              className="absolute top-0 w-full h-full bg-gilt/10 blur-[120px] rounded-full translate-y-[-20%]" 
            />

            {/* Pulsing Light Spire/Rays */}
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scaleY: [0.9, 1.1, 0.9],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-0 w-[2px] h-screen bg-gradient-to-b from-gilt/60 to-transparent blur-[4px]"
            />
          </div>
        </motion.div>
        
        {/* Dark overlays to guarantee text legibility and smooth out all four edges */}
        <div className="absolute inset-0 bg-ink-void/40" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-void to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-void to-transparent" />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-ink-void to-transparent" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-ink-void to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10 drop-shadow-2xl">
        <SectionHeading 
          numeral="VI" 
          title="The Formal Hand" 
          sigil="eye"
        />
        
        <div className="grid md:grid-cols-[1fr_2.5fr] gap-16 md:gap-24 relative z-10">
          {/* Left Metadata */}
          <RevealOnScroll className="space-y-12">
            <div>
              <h4 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-6">Identity</h4>
              <div className="space-y-2">
                <p className="font-display text-2xl text-bone-white uppercase tracking-wider">{PROFILE.name}</p>
                <p className="font-body italic text-bone-dim">{PROFILE.role}</p>
              </div>
            </div>

            <div>
              <h4 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-6">Contact</h4>
              <div className="space-y-4">
                <p className="flex flex-col">
                  <span className="font-subdisplay text-gilt text-[10px] tracking-widest uppercase mb-1">Email</span>
                  <a href={`mailto:${PROFILE.email}`} className="font-body italic text-bone-dim hover:text-bone-white transition-colors">{PROFILE.email}</a>
                </p>
                <p className="flex flex-col">
                  <span className="font-subdisplay text-gilt text-[10px] tracking-widest uppercase mb-1">Phone</span>
                  <a href={`tel:${PROFILE.phone}`} className="font-body italic text-bone-dim hover:text-bone-white transition-colors">{PROFILE.phone}</a>
                </p>
                <p className="flex flex-col">
                  <span className="font-subdisplay text-gilt text-[10px] tracking-widest uppercase mb-1">Location</span>
                  <span className="font-body italic text-bone-dim">{PROFILE.location}</span>
                </p>
              </div>
            </div>

            <motion.a 
              href="/CV_Maximilian_WikstromPDF.pdf"
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ backgroundColor: '#B8935A0D', borderColor: '#B8935A', scale: 1.02, textShadow: '0 0 8px rgba(184,147,90,0.5)' }}
              transition={{ duration: 0.3 }}
              className="inline-block px-10 py-4 border border-bone-faded/40 font-subdisplay text-xs text-bone-white tracking-[0.4em] uppercase transition-colors"
            >
              Download Resume (PDF)
            </motion.a>
          </RevealOnScroll>

          {/* Right Content */}
          <RevealOnScroll delay={0.2} className="space-y-20">
            <div>
              <h4 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-10 border-b border-gilt/20 pb-4">Education</h4>
              <div className="space-y-12">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="relative pl-8 border-l border-bone-faded/20">
                    <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-bone-faded/40" />
                    <p className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">{edu.period}</p>
                    <h5 className="font-display text-xl text-bone-white uppercase tracking-wide">{edu.institution}</h5>
                    <p className="font-body italic text-bone-dim">{edu.degree}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <motion.a 
                  href="/Degree%20of%20Bachelor%20of%20Science%20Maximilian%20Wikstrom.pdf"
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ backgroundColor: '#B8935A0D', borderColor: '#B8935A', scale: 1.02, textShadow: '0 0 8px rgba(184,147,90,0.5)' }}
                  transition={{ duration: 0.3 }}
                  className="inline-block px-8 py-3 border border-bone-faded/30 font-subdisplay text-[10px] text-bone-white tracking-[0.3em] uppercase transition-colors"
                >
                  View Degree (PDF)
                </motion.a>
              </div>
            </div>

            <div>
              <h4 className="font-subdisplay text-xs text-gilt uppercase tracking-widest mb-10 border-b border-gilt/20 pb-4">Knowledge Glyphs</h4>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h6 className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">Languages</h6>
                    <p className="font-body text-bone-dim italic text-sm">C#, Java, TypeScript, JavaScript, Python, SQL, HTML, CSS</p>
                  </div>
                  <div>
                    <h6 className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">Frameworks & Platforms</h6>
                    <p className="font-body text-bone-dim italic text-sm">.NET 6 / .NET 8, ASP.NET Core MVC, Windows Forms, Java Swing, Entity Framework Core, Razor, React 19, Vite, Tailwind CSS, Express / Node.js</p>
                  </div>
                  <div>
                    <h6 className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">Databases</h6>
                    <p className="font-body text-bone-dim italic text-sm">SQL Server, MySQL</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h6 className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">Frontend</h6>
                    <p className="font-body text-bone-dim italic text-sm">React, Tailwind CSS, Bootstrap, jQuery, Razor views, responsive design, animation (Motion / Framer Motion)</p>
                  </div>
                  <div>
                    <h6 className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">Architecture & Patterns</h6>
                    <p className="font-body text-bone-dim italic text-sm">MVC, Layered Architecture, Repository Pattern, Dependency Injection, Role-Based Access Control, Component-based UI</p>
                  </div>
                  <div>
                    <h6 className="font-subdisplay text-[10px] text-gilt uppercase tracking-widest mb-2">Authentication & Tools</h6>
                    <p className="font-body text-bone-dim italic text-sm">ASP.NET Core Identity, Visual Studio, NetBeans, Git & GitHub, NuGet, npm, Vite, Apache Ant, dotnet CLI, EF Core Migrations, Vercel deployment</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
