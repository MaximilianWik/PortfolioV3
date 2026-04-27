/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

const HOVER_SELECTOR = 'a, button, .hover-target, a *, button *';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Avoid putting isVisible in the effect deps — we only need a stable ref
  // guard to flip it once on first mouse activity.
  const visibleRef = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, restDelta: 0.001 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    // Event delegation: one mouseover listener, one matches() check.
    const handleHover = (e: MouseEvent) => {
      const t = e.target as Element | null;
      setIsHovering(!!t && typeof t.matches === 'function' && t.matches(HOVER_SELECTOR));
    };

    window.addEventListener('pointermove', moveMouse, { passive: true });
    window.addEventListener('mouseover', handleHover, { passive: true });

    return () => {
      window.removeEventListener('pointermove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-bone-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        borderColor: isHovering ? '#B8935A' : '#E8E4D8',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-bone-white rounded-full"
        style={{ translateX: '-50%', translateY: '-50%' }}
        animate={{
          backgroundColor: isHovering ? '#B8935A' : '#E8E4D8',
        }}
      />
    </motion.div>
  );
};
