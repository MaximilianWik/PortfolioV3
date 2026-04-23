/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'motion/react';

// Sections
import { Preloader } from './components/Preloader';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Highlights } from './components/Highlights';
import { Timeline } from './components/Timeline';
import { Projects } from './components/Projects';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { HumanityRestored } from './components/HumanityRestored';
import { Footer } from './components/Footer';

// Shared
import { CustomCursor } from './components/shared/CustomCursor';
import { Navigation } from './components/shared/Navigation';
import { CindersOverlay } from './components/shared/CindersOverlay';

import { Firelink } from './components/shared/Firelink';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const attemptPlay = () => {
    if (!audioRef.current) return;
    
    // If it's already playing, do nothing
    if (!audioRef.current.paused) return;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio playing successfully.");
          hasAttemptedPlay.current = true;
        })
        .catch((error) => {
          console.warn("Audio play failed, waiting for user interaction:", error);
        });
    }
  };

  useEffect(() => {
    // Attempt auto-play when loading finishes
    if (!isLoading) {
      attemptPlay();
    }
  }, [isLoading]);

  // Global window listeners for fallback, capturing phase to catch them early
  useEffect(() => {
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        attemptPlay();
      }
    };

    const events = ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'];
    events.forEach(e => window.addEventListener(e, handleInteraction, { capture: true, passive: true }));

    return () => {
      events.forEach(e => window.removeEventListener(e, handleInteraction, { capture: true }));
    };
  }, []);

  useEffect(() => {
    // Initialize Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main 
      className="min-h-screen bg-ink-void overflow-x-hidden selection:bg-ember-blood/30 flex flex-col"
      // Added inline handlers as absolute fallbacks 
      onClick={attemptPlay}
      onTouchStart={attemptPlay}
      onMouseMove={attemptPlay}
      onScroll={attemptPlay}
      onKeyDown={attemptPlay}
    >
      {/* Native audio element */}
      <audio ref={audioRef} src="/DarkSouls3.mp3" loop preload="auto" />

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
              <Timeline />
              <Projects />
              <Resume />
              <Contact />
            </div>
            <HumanityRestored />
            <Footer />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

