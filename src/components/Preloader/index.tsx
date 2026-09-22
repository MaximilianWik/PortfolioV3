/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');

  const phrases = [
    'Awakening...',
    'Challenging the Abyss...',
    'Collecting Cursed Echoes...',
    'Kindling the Flame...',
    'Binding the Ledger...',
  ];

  const getPhrase = (p: number) => {
    const index = Math.floor((p / 100) * phrases.length);
    return phrases[Math.min(index, phrases.length - 1)];
  };

  useEffect(() => {
    const fullText = 'Ashes of automation. Dreams of silicon.';
    const duration = 1250;
    let frame = 0;
    let completionTimeout = 0;
    let completed = false;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min(100, Math.floor((elapsed / duration) * 50) * 2);
      const textLength = Math.min(fullText.length, Math.floor(elapsed / 50));

      setProgress(current => current === nextProgress ? current : nextProgress);
      setText(current => {
        const next = fullText.slice(0, textLength);
        return current === next ? current : next;
      });

      if (elapsed < duration) {
        frame = requestAnimationFrame(tick);
      } else if (!completed) {
        completed = true;
        completionTimeout = window.setTimeout(onComplete, 300);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-preloader bg-ink-void flex flex-col items-center justify-center font-subdisplay"
    >
      <div className="text-bone-white text-lg tracking-[0.4em] uppercase mb-8 h-8">
        {text}
      </div>

      <div className="w-64 h-[1px] bg-ember-blood/20 overflow-hidden relative">
        <motion.div
          className="absolute inset-y-0 left-0 bg-ember-blood shadow-[0_0_8px_rgba(139,26,26,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 font-mono text-[10px] text-bone-faded tracking-widest uppercase">
        {Math.round(progress)}% – {getPhrase(progress)}
      </div>
    </motion.div>
  );
};
