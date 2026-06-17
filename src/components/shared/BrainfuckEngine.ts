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
