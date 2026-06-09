/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * FogBackground — CSS animated fog blobs for the Hero section.
 * Five large radial-gradient ellipses drift at different speeds.
 * mix-blend-mode: screen composites them over the black background
 * so the dark-navy / ember colours show through without WebGL.
 * On bonfire hover the blobs warm from navy → ember-blood via a
 * CSS transition on a data attribute colour override.
 */

import React from 'react';

interface Props { isBonfireLit: boolean }

export const FogBackground: React.FC<Props> = ({ isBonfireLit }) => {
  const blobs = [
    { w: '90vw',  h: '60vh', x: '5%',   y: '10%', dur: 38, delay: 0,   ox: '55%', oy: '45%' },
    { w: '75vw',  h: '55vh', x: '20%',  y: '35%', dur: 52, delay: -14, ox: '40%', oy: '60%' },
    { w: '65vw',  h: '70vh', x: '-10%', y: '5%',  dur: 44, delay: -8,  ox: '60%', oy: '40%' },
    { w: '80vw',  h: '45vh', x: '15%',  y: '50%', dur: 60, delay: -22, ox: '45%', oy: '55%' },
    { w: '55vw',  h: '65vh', x: '35%',  y: '15%', dur: 35, delay: -5,  ox: '50%', oy: '50%' },
  ] as const;

  // cool = dark navy, warm = dark ember-blood
  const coolStop1 = 'rgba(28, 38, 68, 0.55)';
  const coolStop2 = 'rgba(14, 18, 36, 0.20)';
  const warmStop1 = 'rgba(68, 18, 10, 0.55)';
  const warmStop2 = 'rgba(36, 10, 6,  0.20)';

  const s1 = isBonfireLit ? warmStop1 : coolStop1;
  const s2 = isBonfireLit ? warmStop2 : coolStop2;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width:  b.w,
            height: b.h,
            left:   b.x,
            top:    b.y,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at ${b.ox} ${b.oy}, ${s1} 0%, ${s2} 45%, transparent 72%)`,
            mixBlendMode: 'screen',
            transition: 'background 1.2s ease',
            animation: `fog-drift-${i} ${b.dur}s ${b.delay}s ease-in-out infinite alternate`,
            willChange: 'transform',
          }}
        />
      ))}

      <style>{`
        @keyframes fog-drift-0 { from { transform: translate(0,    0)    scale(1);    } to { transform: translate(4%,  3%)   scale(1.06); } }
        @keyframes fog-drift-1 { from { transform: translate(0,    0)    scale(1);    } to { transform: translate(-3%, 4%)   scale(0.94); } }
        @keyframes fog-drift-2 { from { transform: translate(0,    0)    scale(1);    } to { transform: translate(5%,  -2%)  scale(1.08); } }
        @keyframes fog-drift-3 { from { transform: translate(0,    0)    scale(1);    } to { transform: translate(-4%, -3%)  scale(1.04); } }
        @keyframes fog-drift-4 { from { transform: translate(0,    0)    scale(1);    } to { transform: translate(3%,  5%)   scale(0.96); } }
      `}</style>
    </div>
  );
};
