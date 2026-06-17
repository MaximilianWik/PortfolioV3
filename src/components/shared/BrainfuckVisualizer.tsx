/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  compileBF, runBF, textToBF,
  BF_HELLO_WORLD, BF_YOU_DIED,
  type BFSnapshot,
} from './BrainfuckEngine';
import { CornerBrackets } from './CornerBrackets';

const PRESETS: Record<string, { label: string; code: string }> = {
  hello: { label: 'Hello, World!', code: BF_HELLO_WORLD },
  youdied: { label: 'YOU DIED', code: BF_YOU_DIED },
};

const TAPE_CELLS = 16;

const SPEED_LABELS: Record<number, string> = {
  200: 'SLOW',
  80: 'NORMAL',
  20: 'FAST',
  4: 'OVERDRIVE',
};

// ── Sub-components ────────────────────────────────────────────────────────────

const TapeCell: React.FC<{ index: number; value: number; active: boolean }> = ({
  index, value, active,
}) => (
  <motion.div
    layout
    animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`flex flex-col items-center gap-1 min-w-[36px] px-1 py-1.5 border transition-all duration-150
      ${active
        ? 'border-ember-blood bg-ember-blood/10 shadow-[0_0_10px_rgba(139,26,26,0.5)]'
        : 'border-bone-faded/15 bg-ink-void'
      }`}
  >
    <span className="font-mono text-[8px] text-bone-faded">{String(index).padStart(2, '0')}</span>
    <span className={`font-mono text-sm font-bold leading-none ${active ? 'text-ember-blood' : 'text-bone-dim'}`}>
      {String(value).padStart(3, '0')}
    </span>
    <span className="font-mono text-[7px] text-bone-faded/50">
      {value > 31 && value < 127 ? String.fromCharCode(value) : '·'}
    </span>
  </motion.div>
);

// ── Main component ────────────────────────────────────────────────────────────

interface BrainfuckVisualizerProps {
  /** If set, lock to this preset and hide the selector. */
  lockedCode?: string;
  /** Auto-start on mount. Default false. */
  autoPlay?: boolean;
  /** Initial speed in ms per step. Default 80. */
  initialSpeed?: number;
}

export const BrainfuckVisualizer: React.FC<BrainfuckVisualizerProps> = ({
  lockedCode,
  autoPlay = false,
  initialSpeed = 80,
}) => {
  const [presetKey, setPresetKey] = useState<string>('hello');
  const [customText, setCustomText] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const tapeContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const activeCellRef = useRef<HTMLDivElement | null>(null);

  const generatedBF = useMemo(() => textToBF(customText), [customText]);
  const code = lockedCode ?? (showCustom ? generatedBF : PRESETS[presetKey].code);

  const prog = useMemo(() => compileBF(code), [code]);

  const snapshots = useMemo<BFSnapshot[]>(() => {
    if (prog.error) return [];
    return runBF(prog);
  }, [prog]);

  const maxStep = snapshots.length - 1;
  const current: BFSnapshot | undefined = snapshots[Math.min(step, Math.max(0, maxStep))];

  // ── Scroll active char/cell within their container (never touches page scroll) ─
  useEffect(() => {
    if (step === 0) return;
    const container = codeContainerRef.current;
    const el = activeCharRef.current;
    if (!container || !el) return;
    const targetLeft = el.offsetLeft - container.offsetLeft;
    container.scrollLeft = targetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
  }, [step]);

  useEffect(() => {
    if (step === 0) return;
    const container = tapeContainerRef.current;
    const el = activeCellRef.current;
    if (!container || !el) return;
    const targetLeft = el.offsetLeft - container.offsetLeft;
    container.scrollLeft = targetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
  }, [step]);

  // ── Reset to step 0 whenever the source code changes ─────────────────────
  const prevCodeRef = useRef(code);
  useEffect(() => {
    if (prevCodeRef.current === code) return;
    prevCodeRef.current = code;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setStep(0);
  }, [code]);

  // ── Auto-play interval ───────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) { clearTimer(); return; }

    intervalRef.current = setInterval(() => {
      setStep(s => {
        const next = s + 1;
        if (next > maxStep || snapshots[next]?.done) {
          setIsRunning(false);
          return Math.min(next, maxStep);
        }
        return next;
      });
    }, speed);

    return clearTimer;
  }, [isRunning, speed, maxStep, snapshots, clearTimer]);

  // Auto-start if requested
  useEffect(() => {
    if (autoPlay && snapshots.length > 0) setIsRunning(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  // ── Controls ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setStep(0);
  }, [clearTimer]);

  const handleStepForward = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setStep(s => Math.min(s + 1, maxStep));
  }, [clearTimer, maxStep]);

  const handlePreset = (key: string) => {
    setPresetKey(key);
    setShowCustom(false);
    // step reset handled by the code-change effect
  };

  // ── Tape window: keep dp visible ─────────────────────────────────────────
  const dp = current?.dp ?? 0;
  const windowStart = Math.max(
    0,
    Math.min(dp - Math.floor(TAPE_CELLS / 2), (current?.tape.length ?? TAPE_CELLS) - TAPE_CELLS),
  );
  const visibleCells = current
    ? current.tape.slice(windowStart, windowStart + TAPE_CELLS)
    : Array(TAPE_CELLS).fill(0) as number[];

  const isDone = current?.done ?? false;
  const isNotStarted = step === 0;

  return (
    <div className="relative bg-ink-deep border border-bone-faded/20 overflow-hidden w-full">
      <CornerBrackets className="text-bone-faded/20" />

      {/* ── Header bar ─────────────────────────────────────────────────── */}
      {!lockedCode && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-bone-faded/15">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={`font-subdisplay text-[9px] tracking-widest uppercase border px-3 py-1 transition-colors
                ${!showCustom && presetKey === key
                  ? 'border-gilt text-gilt'
                  : 'border-bone-faded/30 text-bone-faded hover:text-gilt hover:border-gilt'
                }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(c => !c)}
            className={`font-subdisplay text-[9px] tracking-widest uppercase border px-3 py-1 transition-colors
              ${showCustom
                ? 'border-gilt text-gilt'
                : 'border-bone-faded/30 text-bone-faded hover:text-gilt hover:border-gilt'
              }`}
          >
            CUSTOM
          </button>

          <span className="ml-auto font-mono text-[9px] text-bone-faded">
            STEP {step}/{maxStep > 0 ? maxStep : '—'}
          </span>
        </div>
      )}

      {/* ── Custom textarea ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-bone-faded/15 flex flex-col gap-3">
              {/* Plain-text input */}
              <div>
                <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-1.5">
                  Your message
                </div>
                <input
                  type="text"
                  className="w-full bg-ink-void border border-bone-faded/20 font-mono text-sm text-bone-white px-3 py-2 outline-none focus:border-gilt/50 placeholder:text-bone-faded/30"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Type anything…"
                  spellCheck={false}
                />
              </div>

              {/* Generated BF — read-only, shown so the user can see what was compiled */}
              {customText && (
                <div>
                  <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-1.5">
                    Generated Brainfuck
                  </div>
                  <div className="bg-ink-void border border-bone-faded/10 px-3 py-2 overflow-x-auto">
                    <pre className="font-mono text-[11px] text-gilt/80 whitespace-pre-wrap break-all leading-relaxed">
                      {generatedBF}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {prog.error ? (
        <div className="px-4 py-6 font-mono text-xs text-ember-blood">{prog.error}</div>
      ) : !prog.clean ? (
        <div className="px-4 py-8 font-mono text-xs text-bone-faded/50 text-center">
          {showCustom ? 'Type a message above to generate Brainfuck.' : 'No program loaded.'}
        </div>
      ) : (
        <>
          {/* ── Code display ─────────────────────────────────────────────── */}
          <div className="px-4 pt-4 pb-2">
            <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-1.5">Source</div>
            <div ref={codeContainerRef} className="overflow-x-auto pb-1">
              <div className="font-mono text-sm leading-loose whitespace-nowrap">
                {prog.clean.split('').map((ch, i) => {
                  const isActive = current && i === current.ip && !isDone;
                  return (
                    <span
                      key={i}
                      ref={isActive ? el => { activeCharRef.current = el; } : undefined}
                      className={`transition-all duration-75 rounded-sm px-[1px]
                        ${isActive
                          ? 'bg-ember-blood text-bone-white shadow-[0_0_8px_rgba(139,26,26,0.8)]'
                          : i < (current?.ip ?? 0)
                          ? 'text-bone-faded/40'
                          : 'text-soul-pale'
                        }`}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Tape ─────────────────────────────────────────────────────── */}
          <div className="px-4 py-3 border-t border-bone-faded/10">
            <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-2">
              Memory Tape — DP: {dp}
            </div>
            <div ref={tapeContainerRef} className="overflow-x-auto">
              <div className="flex gap-1 pb-1">
                {visibleCells.map((val, i) => {
                  const cellIdx = windowStart + i;
                  const isActive = cellIdx === dp;
                  return (
                    <div
                      key={cellIdx}
                      ref={isActive ? el => { activeCellRef.current = el; } : undefined}
                    >
                      <TapeCell index={cellIdx} value={val} active={isActive} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Output ───────────────────────────────────────────────────── */}
          <div className="px-4 py-3 border-t border-bone-faded/10">
            <div className="font-mono text-[9px] text-bone-faded uppercase tracking-widest mb-1.5">Output</div>
            <div className="font-mono text-base text-gilt min-h-[1.5rem] tracking-wider">
              {current?.output
                ? current.output
                : <span className="text-bone-faded/30">·</span>
              }
            </div>
          </div>

          {/* ── Controls ─────────────────────────────────────────────────── */}
          <div className="px-4 py-3 border-t border-bone-faded/10 flex flex-wrap items-center gap-3">
            {/* Run / Stop / Restart */}
            <motion.button
              whileHover={{ borderColor: '#B8935A', color: '#B8935A' }}
              onClick={() => {
                if (isDone) { reset(); setTimeout(() => setIsRunning(true), 0); return; }
                setIsRunning(r => !r);
              }}
              className="font-subdisplay text-[10px] tracking-widest uppercase border border-bone-faded/40 text-bone-white px-4 py-2 min-w-[80px] transition-colors"
            >
              {isRunning ? 'STOP' : isDone ? 'RESTART' : 'RUN'}
            </motion.button>

            {/* Step — only when paused and not done */}
            <motion.button
              whileHover={{ borderColor: '#B8935A', color: '#B8935A' }}
              onClick={handleStepForward}
              disabled={isDone || isRunning}
              className="font-subdisplay text-[10px] tracking-widest uppercase border border-bone-faded/40 text-bone-dim px-4 py-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              STEP
            </motion.button>

            {/* Reset */}
            <motion.button
              whileHover={{ borderColor: '#8B1A1A', color: '#8B1A1A' }}
              onClick={reset}
              disabled={isNotStarted}
              className="font-subdisplay text-[10px] tracking-widest uppercase border border-bone-faded/30 text-bone-faded px-4 py-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              RESET
            </motion.button>

            {/* Speed */}
            <div className="ml-auto flex items-center gap-3">
              <span className="font-mono text-[9px] text-bone-faded uppercase tracking-widest">
                {SPEED_LABELS[speed] ?? 'CUSTOM'}
              </span>
              <div className="flex gap-1">
                {(Object.entries(SPEED_LABELS) as [string, string][]).map(([ms, label]) => (
                  <button
                    key={ms}
                    onClick={() => setSpeed(Number(ms))}
                    className={`font-mono text-[8px] uppercase border px-2 py-1 transition-colors
                      ${speed === Number(ms)
                        ? 'border-gilt text-gilt'
                        : 'border-bone-faded/20 text-bone-faded/50 hover:text-bone-faded'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
