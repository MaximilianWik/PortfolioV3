/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

type SigilVariant = 'eye' | 'serpent' | 'trefoil' | 'runes' | 'compass';

interface SigilProps {
  variant: SigilVariant;
  className?: string;
}

export const Sigil: React.FC<SigilProps> = ({ variant, className }) => {
  const variants: Record<SigilVariant, React.ReactNode> = {
    eye: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50C10 50 25 20 50 20C75 20 90 50 90 50C90 50 75 80 50 80C25 80 10 50 10 50Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
        <path d="M50 10V20M50 80V90M10 50H20M80 50H90" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    serpent: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50" stroke="currentColor" strokeWidth="1" />
        <path d="M90 50C90 35 75 25 60 30C45 35 35 50 50 65C65 80 80 70 80 55" stroke="currentColor" strokeWidth="1" />
        <path d="M40 40L35 35M60 40L65 35" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    trefoil: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="20" stroke="currentColor" strokeWidth="1" />
        <circle cx="35" cy="65" r="20" stroke="currentColor" strokeWidth="1" />
        <circle cx="65" cy="65" r="20" stroke="currentColor" strokeWidth="1" />
        <path d="M50 50L50 55M45 52L40 54M55 52L60 54" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    runes: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 20L70 20L50 50L30 20ZM30 80L70 80L50 50L30 80Z" stroke="currentColor" strokeWidth="1" />
        <path d="M50 10V90M10 50H90" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    ),
    compass: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5L55 45L95 50L55 55L50 95L45 55L5 50L45 45L50 5Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    ),
  };

  return <div className={className}>{variants[variant]}</div>;
};
