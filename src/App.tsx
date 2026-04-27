/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';

// Sections (code-split: all heavy non-hero sections load after first paint).
import { Preloader } from './components/Preloader';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Highlights } from './components/Highlights';
import { Footer } from './components/Footer';

const Timeline = React.lazy(() => import('./components/Timeline').then(m => ({ default: m.Timeline })));
const Projects = React.lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Resume = React.lazy(() => import('./components/Resume').then(m => ({ default: m.Resume })));
const Contact = React.lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const HumanityRestored = React.lazy(() =>
  import('./components/HumanityRestored').then(m => ({ default: m.HumanityRestored })),
);

// Shared
import { CustomCursor } from './components/shared/CustomCursor';
import { Navigation } from './components/shared/Navigation';
import { CindersOverlay } from './components/shared/CindersOverlay';
import { Firelink } from './components/shared/Firelink';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set initial volume when the <audio> element is created.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.4;
  }, []);

  // Lazy audio start: preload="none" keeps the 6.6MB mp3 off the network until
  // the user signals intent. A single pointerdown listener is enough for
  // autoplay gating — it self-removes on the first real interaction.
  useEffect(() => {
    if (isLoading) return;

    const start = () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
      const el = audioRef.current;
      if (!el || !el.paused) return;
      el.play().catch(() => {
        // Browser still blocks — re-arm until the next interaction.
        window.addEventListener('pointerdown', start, { once: true, passive: true });
        window.addEventListener('keydown', start, { once: true });
      });
    };

    window.addEventListener('pointerdown', start, { once: true, passive: true });
    window.addEventListener('keydown', start, { once: true });

    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, [isLoading]);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-ink-void overflow-x-hidden selection:bg-ember-blood/30 flex flex-col">
      {/* Ambient music. preload="none" — we never fetch the file until the user interacts. */}
      <audio ref={audioRef} src="/DarkSouls3.mp3" loop preload="none" />

      <CustomCursor />
      <CindersOverlay />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <div key="content" className="flex-1 flex flex-col">
            <Navigation />
            <div className="flex-1 px-6 md:px-12">
              <Hero />
              <About />
              <Highlights />
              <Firelink />
              <React.Suspense fallback={null}>
                <Timeline />
                <Projects />
                <Resume />
                <Contact />
              </React.Suspense>
            </div>
            <React.Suspense fallback={null}>
              <HumanityRestored />
            </React.Suspense>
            <Footer />
          </div>
        )}
      </AnimatePresence>

      <Analytics />
    </main>
  );
}
