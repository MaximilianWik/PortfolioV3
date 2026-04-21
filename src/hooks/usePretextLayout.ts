/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useLayoutEffect, useMemo } from 'react';
// Pretext might be imported differently depending on the package type
// We'll try to import and handle if it's doesn't exist
import * as Pretext from '@chenglou/pretext';

interface PretextLayout {
  height: number;
  lineCount: number;
  tightestWidth: number;
}

export function usePretextLayout(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number = 1.4
): PretextLayout {
  const [layout, setLayout] = useState<PretextLayout>({
    height: 0,
    lineCount: 0,
    tightestWidth: 0,
  });

  useLayoutEffect(() => {
    if (!Pretext || !text) return;

    try {
      // @ts-ignore - API version might vary
      const prepared = Pretext.prepare(text, font);
      // @ts-ignore
      const res = Pretext.layout(prepared, maxWidth, lineHeight);
      
      // Calculate tightest width for "shrink-wrapped" look
      let maxLineWidth = 0;
      // @ts-ignore
      if (Pretext.measureLineStats) {
        // @ts-ignore
        const stats = Pretext.measureLineStats(res);
        maxLineWidth = stats.maxLineWidth;
      }

      setLayout({
        height: res.height,
        lineCount: res.lineCount,
        tightestWidth: maxLineWidth || maxWidth,
      });
    } catch (e) {
      console.warn('Pretext layout failed:', e);
      // Fallback behavior handles the rendering if Pretext fails
    }
  }, [text, font, maxWidth, lineHeight]);

  return layout;
}
