/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const fullText = "Ashes of automation. Dreams of silicon.";

  useEffect(() => {
    let currentText = "";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setText(currentText);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => {
      clearInterval(typingInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

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
      
      <div className="w-64 h-[1px] bg-bone-faded/20 overflow-hidden relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-bone-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-4 font-mono text-[10px] text-bone-faded tracking-widest uppercase">
        {Math.round(progress)}% — Initializing Ledger
      </div>
    </motion.div>
  );
};
