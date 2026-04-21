import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';

export const HumanityRestored: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  // Pre-calculate particles
  const particles = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => { // Double the particles
      // Initially they explode outwards, then drift up
      const isBurst = i < 40; // First 40 particles are the initial explosion burst
      return {
        id: i,
        xStart: 0,
        yStart: 0,
        xEnd: (Math.random() - 0.5) * (isBurst ? 250 : 150),
        yEnd: (Math.random() - 0.5) * (isBurst ? 100 : 180) - (isBurst ? 0 : 80),
        scale: Math.random() * 2 + 1, // Larger particles
        delay: isBurst ? Math.random() * 0.1 : Math.random() * 8, // Burst happens instantly
        duration: isBurst ? 0.8 + Math.random() : 4 + Math.random() * 4,
      };
    });
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[60vh] flex items-center justify-center py-32 bg-ink-void z-20"
    >
      {/* Background Dimming for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-void via-black to-ink-void opacity-80 pointer-events-none" />

      {/* Animation wrapper triggered by scroll */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {isInView && (
          <>
            {/* 1. Deep black/shadow ambient radial swell */}
            <motion.div
              initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 1, 1], 
                scaleY: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 10, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
              className="absolute h-[250px] w-[150vw]"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)',
                top: '50%',
                marginTop: '-125px',
                transformOrigin: 'center',
                zIndex: 0
              }}
            />

            {/* 2. Strong solid black horizontal band with vertical fading */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0, filter: 'blur(30px)' }}
              animate={{ 
                scaleX: [0, 1.2, 1.2, 0], 
                opacity: [0, 1, 1, 0],
                filter: ['blur(30px)', 'blur(12px)', 'blur(12px)', 'blur(30px)']
              }}
              transition={{ duration: 10, times: [0, 0.1, 0.9, 1], ease: "easeOut" }}
              className="absolute h-[160px] w-[150vw]"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 85%)',
                top: '50%',
                marginTop: '-80px',
                transformOrigin: 'center',
                zIndex: 1
              }}
            />

            {/* 3. The Teal Horizontal Ethereal Energy Smear - Vertical Fade Added */}
            <motion.div
              initial={{ scaleX: 0, scaleY: 0.1, opacity: 0, filter: 'blur(40px) brightness(3)' }}
              animate={{ 
                scaleX: [0, 5, 2, 7], 
                scaleY: [0.1, 5, 1, 0],
                opacity: [0, 1, 0.5, 0],
                filter: ['blur(40px) brightness(3)', 'blur(15px) brightness(2)', 'blur(20px) brightness(1.5)', 'blur(50px) brightness(0)']
              }}
              transition={{ duration: 10, times: [0, 0.05, 0.7, 1], ease: "easeOut" }}
              className="absolute h-[60px] w-full max-w-[100vw]"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(118,199,168,0.9) 0%, rgba(118,199,168,0.4) 40%, transparent 80%)',
                top: '50%',
                marginTop: '-30px',
                transformOrigin: 'center',
                mixBlendMode: 'screen',
                zIndex: 2
              }}
            />

            {/* 4. The blinding inner core flash - Softened and blended */}
            <motion.div
              initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 3, 1, 0], 
                scaleY: [0, 4, 1, 0],
                opacity: [0, 1, 0.4, 0],
              }}
              transition={{ duration: 10, times: [0, 0.05, 0.8, 1], ease: "easeOut" }}
              className="absolute h-[12px] w-full max-w-4xl"
              style={{
                background: 'radial-gradient(ellipse at center, #FFFFFF 0%, rgba(118, 199, 168, 0.8) 40%, transparent 80%)',
                boxShadow: '0 0 50px 25px rgba(118, 199, 168, 0.6), 0 0 120px 60px rgba(255, 255, 255, 0.3)',
                filter: 'blur(8px)',
                top: '50%',
                marginTop: '-6px',
                zIndex: 3
              }}
            />

            {/* 4.5. Particles (Ethereal Dust) bursting tracking horizontally and vertically - Allowed to overflow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[4] overflow-visible">
              <div className="relative w-full h-full overflow-visible flex items-center justify-center">
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: `${p.yStart}vh`, x: `${p.xStart}vw`, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      y: [`${p.yStart}vh`, `${p.yEnd}vh`],
                      x: [`${p.xStart}vw`, `${p.xEnd}vw`],
                      scale: [0, p.scale, p.scale * 0.2]
                    }}
                    transition={{ 
                      duration: p.duration,
                      delay: p.delay,
                      ease: "easeOut"
                    }}
                    className="absolute w-[6px] h-[6px] rounded-full mix-blend-screen"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 0 15px 5px rgba(118,199,168,1), 0 0 30px 10px rgba(118,199,168,0.5)',
                      filter: 'blur(0.5px)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 5. Extreme heavy bloom lens flare overlay */}
            <motion.div
              initial={{ scale: 0.95, scaleX: 6, opacity: 0, filter: 'blur(40px) brightness(3)' }}
              animate={{ 
                scale: [0.95, 1.05, 1.1], 
                scaleX: [6, 1, 1, 4], 
                opacity: [0, 1, 0.8, 0],
                filter: ['blur(40px) brightness(3)', 'blur(10px) brightness(2)', 'blur(12px) brightness(1)', 'blur(40px) brightness(0)']
              }}
              transition={{ duration: 10, times: [0, 0.08, 0.85, 1], ease: "easeOut" }}
              className="absolute z-[9] pointer-events-none mix-blend-screen"
            >
              <h2 
                className="uppercase text-4xl md:text-6xl lg:text-[5.5rem] text-center"
                style={{
                  fontFamily: '"OptimusPrinceps", "Times New Roman", serif',
                  color: '#76C7A8',
                  letterSpacing: '0.04em',
                  transform: 'scaleY(1.3)' 
                }}
              >
                Humanity Restored
              </h2>
            </motion.div>

            {/* 6. The "HUMANITY RESTORED" Text */}
            <motion.div
              initial={{ scale: 0.95, scaleX: 4, opacity: 0, filter: 'blur(25px) brightness(2)' }}
              animate={{ 
                scale: [0.95, 1.05, 1.1], 
                scaleX: [4, 1, 1, 4], 
                opacity: [0, 1, 1, 0],
                filter: ['blur(25px) brightness(2)', 'blur(0px) brightness(1)', 'blur(0px) brightness(1)', 'blur(20px) brightness(0)']
              }}
              transition={{ duration: 10, times: [0, 0.08, 0.85, 1], ease: "easeOut" }}
              className="relative z-10"
              style={{ zIndex: 10 }}
            >
              <h2 
                className="uppercase text-4xl md:text-6xl lg:text-[5.5rem] text-center"
                style={{
                  fontFamily: '"OptimusPrinceps", "Times New Roman", serif',
                  color: '#76C7A8',
                  letterSpacing: '0.04em',
                  WebkitTextStroke: '1px rgba(0, 0, 0, 0.9)',
                  textShadow: '0 0 20px rgba(118, 199, 168, 0.6), 0 5px 30px rgba(0, 0, 0, 1), 0 10px 40px rgba(0, 0, 0, 1)',
                  transform: 'scaleY(1.3)' 
                }}
              >
                Humanity Restored
              </h2>
            </motion.div>

            {/* 7. The Reflection (Floor bounce) */}
            <motion.div
              initial={{ scale: 0.95, scaleX: 4, opacity: 0, filter: 'blur(25px) brightness(2)' }}
              animate={{ 
                scale: [0.95, 1.05, 1.1], 
                scaleX: [4, 1, 1, 4], 
                opacity: [0, 0.5, 0.5, 0],
                filter: ['blur(25px) brightness(2)', 'blur(8px) brightness(1)', 'blur(8px) brightness(1)', 'blur(25px) brightness(0)']
              }}
              transition={{ duration: 10, times: [0, 0.08, 0.85, 1], ease: "easeOut" }}
              className="absolute z-0 mt-[140px] md:mt-[170px] lg:mt-[200px] pointer-events-none"
              style={{
                 transformOrigin: 'top',
                 WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 60%)',
                 maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 60%)',
              }}
            >
              <h2 
                className="uppercase text-4xl md:text-6xl lg:text-[5.5rem] text-center"
                style={{
                  fontFamily: '"OptimusPrinceps", "Times New Roman", serif',
                  color: '#76C7A8',
                  letterSpacing: '0.04em',
                  transform: 'scaleY(-1.3) skewX(-15deg)', // mirrored and skewed to lay flat
                }}
              >
                Humanity Restored
              </h2>
            </motion.div>
          </>
        )}
      </div>
      
      {/* Space placeholder */}
      {!isInView && (
         <div className="h-[150px] w-full" />
      )}
    </section>
  );
};
