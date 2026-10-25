import React from 'react';
import clsx from 'clsx';

interface DoubleBezelProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const DoubleBezel: React.FC<DoubleBezelProps> = ({
  children,
  className,
  innerClassName,
  padding = 'md',
}) => {
  const paddingMap = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl border border-[#E6E0D6] bg-black/[0.02]',
        paddingMap[padding],
        className
      )}
    >
      <div
        className={clsx(
          'rounded-[calc(1rem-2px)] bg-[#FFFDFA] border border-[#E6E0D6]/70 shadow-whisper',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
