/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
    let currentText = '';
    let i = 0;
    const fullText = 'Ashes of automation. Dreams of silicon.';

    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setText(currentText);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    // Track the completion timeout so it can be cleared if the component unmounts
    // before it fires (e.g. parent forcibly unmounts while progress reaches 100).
    let completionTimeout: ReturnType<typeof setTimeout> | null = null;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          completionTimeout = setTimeout(() => onCompleteRef.current(), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => {
      clearInterval(typingInterval);
      clearInterval(progressInterval);
      if (completionTimeout !== null) clearTimeout(completionTimeout);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[10000] bg-ink-void flex flex-col items-center justify-center font-subdisplay"
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
