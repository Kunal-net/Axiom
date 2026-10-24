import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'nested';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  withArrow?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  withArrow = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs h-8 px-3 rounded-lg gap-1.5',
    md: 'text-sm h-10 px-4 rounded-xl gap-2',
    lg: 'text-base h-12 px-6 rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#1C1B19] text-white hover:bg-[#34312C] shadow-sm',
    secondary: 'bg-[#F0ECE4] text-[#1D1B18] hover:bg-[#EAE5DC] border border-[#E6E0D6]',
    outline: 'bg-transparent text-[#1D1B18] hover:bg-[#F0ECE4] border border-[#E6E0D6]',
    ghost: 'bg-transparent text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4]',
    danger: 'bg-[#FCE4DF] text-[#A83224] hover:bg-[#F7C6BE] border border-[#F7C6BE]',
    nested: 'btn-nested',
  };

  if (variant === 'nested') {
    return (
      <button
        disabled={disabled || loading}
        className={clsx('btn-nested', className)}
        {...props}
      >
        <span>{children}</span>
        <span className="btn-nested-icon">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      disabled={disabled || loading}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      <span>{children}</span>
      {!loading && withArrow && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
};
