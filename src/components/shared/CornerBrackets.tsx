/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CornerBracketsProps {
  className?: string;
  size?: number;
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({ className, size = 10 }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Top Left */}
      <div 
        className="absolute top-0 left-0 border-t border-l border-inherit"
        style={{ width: size, height: size }}
      />
      {/* Top Right */}
      <div 
        className="absolute top-0 right-0 border-t border-r border-inherit"
        style={{ width: size, height: size }}
      />
      {/* Bottom Left */}
      <div 
        className="absolute bottom-0 left-0 border-b border-l border-inherit"
        style={{ width: size, height: size }}
      />
      {/* Bottom Right */}
      <div 
        className="absolute bottom-0 right-0 border-b border-r border-inherit"
        style={{ width: size, height: size }}
      />
    </div>
  );
};
