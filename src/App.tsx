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

  useEffect(() => {
    // Audio Playback logic
    if (!isLoading) {
      const playAudio = () => {
        if (!audioRef.current) {
          audioRef.current = new Audio('/DarkSouls3.mp3');
          audioRef.current.loop = true;
          audioRef.current.volume = 0.4;
          
          const startPlayback = () => {
            audioRef.current?.play().catch(console.error);
            // Clean up all trigger listeners
            window.removeEventListener('click', startPlayback);
            window.removeEventListener('touchstart', startPlayback);
            window.removeEventListener('scroll', startPlayback);
            window.removeEventListener('mousemove', startPlayback);
          };

          // Attach various interaction listeners as fallbacks
          window.addEventListener('click', startPlayback);
          window.addEventListener('touchstart', startPlayback);
          window.addEventListener('scroll', startPlayback);
          
          // Expose function for specific triggers (like the bonfire hover)
          (window as any).playDarkSoulsMusic = startPlayback;

          audioRef.current.play().catch(() => {
            console.log("Autoplay blocked, waiting for interaction...");
          });
        }
      };

      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isLoading]);

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
    <main className="min-h-screen bg-ink-void overflow-x-hidden selection:bg-ember-blood/30 flex flex-col">
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

