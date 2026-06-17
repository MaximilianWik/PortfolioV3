/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Number of tape cells captured per snapshot (display window). */
export const TAPE_DISPLAY_SIZE = 20;

/** Hard cap on steps to prevent infinite loops from locking the UI. */
const MAX_STEPS = 20_000;

export interface BFSnapshot {
  /** Current instruction pointer (index into cleaned source). */
  ip: number;
  /** Current data pointer. */
  dp: number;
  /** First TAPE_DISPLAY_SIZE cells at this moment. */
  tape: number[];
  /** Accumulated output string. */
  output: string;
  /** Step index (0 = initial state before any instruction executes). */
  step: number;
  /** True once ip has advanced past the last instruction. */
  done: boolean;
}

export interface BFProgram {
  /** Source with all non-BF characters stripped. */
  clean: string;
  /** Precomputed bracket pairs: open→close and close→open. */
  brackets: Map<number, number>;
  /** Error string if source has unmatched brackets; null if valid. */
  error: string | null;
}

/** Strip non-BF characters and build bracket map. */
export function compileBF(source: string): BFProgram {
  const clean = source.replace(/[^<>+\-.,[\]]/g, '');
  const brackets = new Map<number, number>();
  const stack: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === '[') {
      stack.push(i);
    } else if (clean[i] === ']') {
      const open = stack.pop();
      if (open === undefined) {
        return { clean, brackets, error: `Unmatched ] at position ${i}` };
      }
      brackets.set(open, i);
      brackets.set(i, open);
    }
  }

  if (stack.length > 0) {
    return { clean, brackets, error: `Unmatched [ at position ${stack[0]}` };
  }

  return { clean, brackets, error: null };
}

/**
 * Run a compiled BF program and return every step as a snapshot array.
 * Index 0 is the initial state (before any instruction executes).
 * The final snapshot has `done: true`.
 */
export function runBF(program: BFProgram, input = ''): BFSnapshot[] {
  if (program.error) return [];

  const { clean, brackets } = program;
  const tape = new Array(30_000).fill(0) as number[];
  let dp = 0;
  let ip = 0;
  let inputPos = 0;
  let output = '';
  const snapshots: BFSnapshot[] = [];

  const snap = (done = false): BFSnapshot => ({
    ip,
    dp,
    tape: tape.slice(0, TAPE_DISPLAY_SIZE),
    output,
    step: snapshots.length,
    done,
  });

  snapshots.push(snap()); // step 0: initial state

  for (let guard = 0; guard < MAX_STEPS; guard++) {
    if (ip >= clean.length) {
      snapshots.push(snap(true));
      break;
    }

    const cmd = clean[ip];

    switch (cmd) {
      case '>': dp = (dp + 1) % 30_000; ip++; break;
      case '<': dp = (dp - 1 + 30_000) % 30_000; ip++; break;
      case '+': tape[dp] = (tape[dp] + 1) & 0xff; ip++; break;
      case '-': tape[dp] = (tape[dp] - 1 + 256) & 0xff; ip++; break;
      case '.': output += String.fromCharCode(tape[dp]); ip++; break;
      case ',':
        tape[dp] = inputPos < input.length ? input.charCodeAt(inputPos++) : 0;
        ip++;
        break;
      case '[':
        // if current cell is 0, jump past matching ]
        ip = tape[dp] === 0 ? brackets.get(ip)! + 1 : ip + 1;
        break;
      case ']':
        // if current cell is non-zero, jump back to matching [
        ip = tape[dp] !== 0 ? brackets.get(ip)! : ip + 1;
        break;
      default:
        ip++;
    }

    snapshots.push(snap(ip >= clean.length));

    if (ip >= clean.length) break;
  }

  return snapshots;
}

// ── Text → Brainfuck compiler ────────────────────────────────────────────────

/**
 * Find the best (a, b, remainder) such that `a * b + r = v`, minimising
 * total BF characters needed (a counter increments + b inner increments + |r|).
 */
function bestFactors(v: number): { a: number; b: number; r: number } {
  // Baseline: pure direct increments (no loop), cost = v
  let bestA = 1, bestB = v, bestR = 0, bestCost = v;

  for (let a = 2; a <= Math.ceil(Math.sqrt(v)) + 2; a++) {
    const b = Math.round(v / a);
    if (b < 1) continue;
    const r = v - a * b;
    const cost = a + b + Math.abs(r);
    if (cost < bestCost) {
      bestA = a; bestB = b; bestR = r; bestCost = cost;
    }
  }

  return { a: bestA, b: bestB, r: bestR };
}

/**
 * Compile a plain-text string into a Brainfuck program that prints it.
 *
 * Uses two cells: cell[0] as the loop counter (scratch), cell[1] as the
 * output register. For each character the pointer bounces between them,
 * making the tape animation visually interesting.
 *
 * Pattern per character:
 *   - (not first) `[-]<`     reset output cell, return to scratch cell
 *   - if loop:    `+`×a `[>` `+`×b `<-]` `>` `+/-`×r `.`
 *   - if direct:  `>` `+`×v `.`   (for very small ASCII values)
 */
export function textToBF(text: string): string {
  let out = '';

  for (let i = 0; i < text.length; i++) {
    const v = text.charCodeAt(i);
    if (v > 255) continue; // skip non-Latin-1

    if (i > 0) out += '[-]<'; // reset output cell → back to scratch

    const { a, b, r } = bestFactors(v);

    if (a === 1) {
      // Direct: move to output cell and increment
      out += '>' + '+'.repeat(v) + '.';
    } else {
      out += '+'.repeat(a) + '[>' + '+'.repeat(b) + '<-]>';
      if (r > 0) out += '+'.repeat(r);
      else if (r < 0) out += '-'.repeat(-r);
      out += '.';
    }
  }

  return out;
}

// ── Preset programs ──────────────────────────────────────────────────────────

/**
 * Prints "Hello, World!\n".
 * Classic — interesting tape movement due to nested loops.
 */
export const BF_HELLO_WORLD =
  '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';

/**
 * Prints "YOU DIED".
 * Uses cells 0–2; pointer dances between them — designed for visual appeal.
 *
 * Verified output: Y(89) O(79) U(85) sp(32) D(68) I(73) E(69) D(68)
 */
export const BF_YOU_DIED =
  '++++++++++[>+++++++++<-]>-.----------.++++++.>++++++[<--------->-]<+.>++++[<+++++++++>-]<.+++++.----.-.';
