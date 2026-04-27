/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AnimatedOutlineProps {
  active: boolean;
  /** Tailwind bg-* class for the traveling line. Default: bg-ember-blood. */
  colorClass?: string;
  /** Duration per edge, in ms. Default: 300. */
  durationMs?: number;
  /** Stacking context. Default: z-50. */
  zClass?: string;
}

/**
 * Four-segment outline that sweeps around a container's edges when `active`
 * is true. Used on hover for Hero deed cards, Highlights deed cards, and
 * Projects relic cards.
 *
 * The parent must be `relative` and clip overflow — this component only renders
 * absolutely-positioned edge lines. It intentionally does not add its own
 * wrapper so it can coexist with other absolutely-positioned overlays.
 */
export const AnimatedOutline: React.FC<AnimatedOutlineProps> = ({
  active,
  colorClass = 'bg-ember-blood',
  durationMs = 300,
  zClass = 'z-50',
}) => {
  const transition = `all ${durationMs}ms`;
  return (
    <>
      <div
        className={`absolute top-0 left-0 h-[1px] origin-left ${colorClass} ${zClass}`}
        style={{ width: active ? '100%' : '0%', transition, transitionDelay: '0ms' }}
      />
      <div
        className={`absolute top-0 right-0 w-[1px] origin-top ${colorClass} ${zClass}`}
        style={{ height: active ? '100%' : '0%', transition, transitionDelay: `${durationMs}ms` }}
      />
      <div
        className={`absolute bottom-0 right-0 h-[1px] origin-right ${colorClass} ${zClass}`}
        style={{ width: active ? '100%' : '0%', transition, transitionDelay: `${durationMs * 2}ms` }}
      />
      <div
        className={`absolute bottom-0 left-0 w-[1px] origin-bottom ${colorClass} ${zClass}`}
        style={{ height: active ? '100%' : '0%', transition, transitionDelay: `${durationMs * 3}ms` }}
      />
    </>
  );
};
