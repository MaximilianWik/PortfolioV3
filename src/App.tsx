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
import { Navigation } from './components/shared/Navigation';
import { Firelink } from './components/shared/Firelink';

const Timeline = React.lazy(() => import('./components/Timeline').then(m => ({ default: m.Timeline })));
const Projects = React.lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Resume = React.lazy(() => import('./components/Resume').then(m => ({ default: m.Resume })));
const Contact = React.lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const HumanityRestored = React.lazy(() =>
  import('./components/HumanityRestored').then(m => ({ default: m.HumanityRestored })),
);

// CustomCursor and CindersOverlay are pure ambience — defer them so they don't
// compete with the hero bundle on first paint. They mount after the preloader
// resolves anyway, and a lazy import keeps them out of the entry chunk.
const CustomCursor = React.lazy(() =>
  import('./components/shared/CustomCursor').then(m => ({ default: m.CustomCursor })),
);
const CindersOverlay = React.lazy(() =>
  import('./components/shared/CindersOverlay').then(m => ({ default: m.CindersOverlay })),
);

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

  // Smooth scroll — opt-out for users who prefer reduced motion. Lenis adds a
  // rAF loop that runs every frame regardless of user input, so gating it on
  // the OS preference is both a perf and accessibility win.
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

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
    <main className="min-h-screen overflow-x-hidden selection:bg-ember-blood/30 flex flex-col">
      {/* Ambient music. preload="none" — we never fetch the file until the user interacts. */}
      <audio ref={audioRef} src="/DarkSouls3.mp3" loop preload="none" />

      <React.Suspense fallback={null}>
        <CustomCursor />
        <CindersOverlay />
      </React.Suspense>

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
