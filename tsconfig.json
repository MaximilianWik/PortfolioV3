/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface InteractiveTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  baseColor?: string;
}

export const DispersingText: React.FC<InteractiveTextProps> = ({ 
  text, 
  className = '', 
  style, 
  as: Component = 'p',
  baseColor = '#9A968B' // bone-dim
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(' ');

  const isNoWrap = className.includes('flex-nowrap');

  return (
    <Component 
      ref={containerRef}
      className={`flex cursor-default ${isNoWrap ? '' : 'flex-wrap'} gap-x-[0.25em] ${className}`}
      style={style}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex whitespace-nowrap">
          {word.split('').map((char, i) => (
            <Character key={i} char={char} containerRef={containerRef} baseColor={baseColor} />
          ))}
        </span>
      ))}
    </Component>
  );
};

const Character: React.FC<{ char: string; containerRef: React.RefObject<HTMLElement>; baseColor: string }> = ({ char, containerRef, baseColor }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const force = useMotionValue(0);

  const charRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!charRef.current) return;
      
      const rect = charRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 120;
      
      if (dist < maxDist) {
        const f = (maxDist - dist) / maxDist;
        force.set(f);
        
        mouseX.set(-dx * f * 1.5);
        mouseY.set(-dy * f * 1.5 - f * 60);
      } else {
        force.set(0);
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, force]);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 15 });
  const springForce = useSpring(force, { stiffness: 40, damping: 20 });

  const color = useTransform(
    springForce,
    [0, 0.2, 0.6, 0.9, 1],
    [baseColor, '#B8935A', '#8B1A1A', '#3D2B1F', '#050505'] 
  );
  
  const filter = useTransform(
    springForce,
    [0, 0.3, 1],
    ['blur(0px)', 'blur(2px)', 'blur(10px)']
  );

  const opacity = useTransform(
    springForce,
    [0, 0.7, 1],
    [1, 0.8, 0]
  );
  
  const scale = useTransform(
    springForce,
    [0, 0.2, 1],
    [1, 1.2, 0.3] 
  );

  return (
    <motion.span
      ref={charRef}
      style={{ 
        x: springX, 
        y: springY,
        color,
        filter,
        opacity,
        scale,
        display: 'inline-block',
        whiteSpace: char === ' ' ? 'pre' : 'normal'
      }}
      className="select-none shrink-0"
    >
      {char}
    </motion.span>
  );
};
