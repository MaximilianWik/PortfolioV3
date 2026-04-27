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

type CharSetter = (targetX: number, targetY: number, force: number) => void;

/**
 * ONE pointermove listener, ONE RAF loop for the entire text instance.
 *
 * Previous implementation:
 *   - 1 window listener (fine)
 *   - N per-character RAF loops, each calling getBoundingClientRect() every
 *     frame. For a paragraph of ~80 characters this was ~80 RAFs + 80 synchronous
 *     layout reads per frame = guaranteed forced-reflow thrash.
 *
 * Now:
 *   - Character centers are measured once on mount and re-measured on scroll /
 *     resize / container resize. They're not read inside the hot loop.
 *   - The parent runs a single RAF that computes dx/dy/force for every character
 *     and forwards the result to a registered setter on each character. Each
 *     character still owns its own motion values + springs, so the visual motion
 *     is unchanged.
 */
export const DispersingText: React.FC<InteractiveTextProps> = ({
  text,
  className = '',
  style,
  as: Component = 'p',
  baseColor = '#9A968B',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const charCenters = useRef<Array<{ x: number; y: number }>>([]);
  const setters = useRef<Array<CharSetter | null>>([]);

  // Split once per text change — cheap, stable indices for registration.
  const words = text.split(' ');

  useEffect(() => {
    const measure = () => {
      charCenters.current = charRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };

    // Measure after layout is stable. rAF here covers the common case where
    // the component mounts before fonts or images finish settling.
    const initMeasure = requestAnimationFrame(measure);

    const handleMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const maxDist = 120;
    let rafId = 0;

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const centers = charCenters.current;
      const setterList = setters.current;

      for (let i = 0; i < setterList.length; i++) {
        const setter = setterList[i];
        const c = centers[i];
        if (!setter || !c) continue;

        const dx = mx - c.x;
        const dy = my - c.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const f = (maxDist - dist) / maxDist;
          setter(-dx * f * 1.5, -dy * f * 1.5 - f * 60, f);
        } else {
          setter(0, 0, 0);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    let ro: ResizeObserver | undefined;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(containerRef.current);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(initMeasure);
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [text]);

  const isNoWrap = className.includes('flex-nowrap');

  // Walk the word/char grid and assign each character a stable global index.
  let globalIndex = 0;

  return (
    <Component
      ref={containerRef}
      className={`flex cursor-default ${isNoWrap ? '' : 'flex-wrap'} gap-x-[0.25em] ${className}`}
      style={style}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex whitespace-nowrap">
          {Array.from(word).map((char, i) => {
            const idx = globalIndex++;
            return (
              <Character
                key={i}
                char={char}
                baseColor={baseColor}
                registerEl={(el) => { charRefs.current[idx] = el; }}
                registerSetter={(fn) => { setters.current[idx] = fn; }}
              />
            );
          })}
        </span>
      ))}
    </Component>
  );
};

interface CharacterProps {
  char: string;
  baseColor: string;
  registerEl: (el: HTMLSpanElement | null) => void;
  registerSetter: (fn: CharSetter | null) => void;
}

const Character: React.FC<CharacterProps> = ({ char, baseColor, registerEl, registerSetter }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const force = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 15 });
  const springForce = useSpring(force, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const setter: CharSetter = (tx, ty, f) => {
      // Short-circuit when character is already at rest and the new target is
      // also zero — keeps the spring solver idle.
      if (f === 0 && force.get() === 0) return;
      mouseX.set(tx);
      mouseY.set(ty);
      force.set(f);
    };
    registerSetter(setter);
    return () => registerSetter(null);
  }, [registerSetter, mouseX, mouseY, force]);

  const color = useTransform(
    springForce,
    [0, 0.2, 0.6, 0.9, 1],
    [baseColor, '#B8935A', '#8B1A1A', '#3D2B1F', '#050505'],
  );

  const filter = useTransform(
    springForce,
    [0, 0.3, 1],
    ['blur(0px)', 'blur(2px)', 'blur(10px)'],
  );

  const opacity = useTransform(springForce, [0, 0.7, 1], [1, 0.8, 0]);
  const scale = useTransform(springForce, [0, 0.2, 1], [1, 1.2, 0.3]);

  return (
    <motion.span
      ref={registerEl}
      style={{
        x: springX,
        y: springY,
        color,
        filter,
        opacity,
        scale,
        display: 'inline-block',
        whiteSpace: char === ' ' ? 'pre' : 'normal',
      }}
      className="select-none shrink-0"
    >
      {char}
    </motion.span>
  );
};
