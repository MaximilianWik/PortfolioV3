/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CornerBracketsProps {
  /**
   * Classes applied to the inner wrapper. Use a `text-*` utility to set the
   * bracket color — the bracket edges use `border-current`, so any Tailwind
   * text color (including text utilities with an opacity modifier) will drive
   * the border tint.
   */
  className?: string;
  size?: number;
}

/**
 * Four L-shaped corner brackets layered over the parent.
 *
 * Color is driven by the `currentColor` of this element, via `border-current`
 * on each bracket. Pass a `text-*` class (e.g. `text-gilt/20`, `text-gilt`) —
 * do not rely on `border-*` classes on the outer wrapper, they will not be
 * inherited through `border-inherit`.
 */
export const CornerBrackets: React.FC<CornerBracketsProps> = ({ className = '', size = 10 }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div
        className="absolute top-0 left-0 border-t border-l border-current"
        style={{ width: size, height: size }}
      />
      <div
        className="absolute top-0 right-0 border-t border-r border-current"
        style={{ width: size, height: size }}
      />
      <div
        className="absolute bottom-0 left-0 border-b border-l border-current"
        style={{ width: size, height: size }}
      />
      <div
        className="absolute bottom-0 right-0 border-b border-r border-current"
        style={{ width: size, height: size }}
      />
    </div>
  );
};
