import React from 'react';

/**
 * Hero Red Ribbon Motif
 * Recreated with exact pixel geometry from IMAGE A reference.
 */
export const HeroRedRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} aria-hidden="true">
      <img
        src="/images/hero-ribbon.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
};

/**
 * FAQ Red Ribbon Motif
 * Recreated with exact pixel geometry from IMAGE A reference.
 */
export const FaqRedRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} aria-hidden="true">
      <img
        src="/images/faq-ribbon.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
};

/**
 * CTA Ribbon Motif
 * Recreated with exact pixel geometry from IMAGE A reference.
 */
export const CtaRedRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} aria-hidden="true">
      <img
        src="/images/cta-ribbon.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
};
