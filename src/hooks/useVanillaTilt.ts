/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

type TiltOptions = Parameters<typeof VanillaTilt.init>[1];

const DEFAULTS: TiltOptions = {
  max: 5,
  speed: 600,
  reverse: true,
  glare: true,
  'max-glare': 0.1,
};

/**
 * Attaches vanilla-tilt to a div and tears it down on unmount.
 * Vanilla-tilt stores the instance on the element as `vanillaTilt`, which is
 * what `.destroy()` reads — without cleanup the handlers leak across renders.
 */
export function useVanillaTilt<T extends HTMLElement = HTMLDivElement>(
  options: TiltOptions = DEFAULTS,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    VanillaTilt.init(el, options);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any).vanillaTilt?.destroy();
    };
    // Options are intentionally only read on mount — matching every existing
    // call site, which passes a literal object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
