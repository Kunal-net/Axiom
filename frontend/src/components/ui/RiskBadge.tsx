import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import clsx from 'clsx';
import { RiskSeverity } from '../../types/contract';

interface RiskBadgeProps {
  severity: RiskSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  count?: number;
  label?: string;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
  count,
  label,
  className
}) => {
  const styles = {
    high: 'bg-[#FCE4DF] text-[#A83224] border-[#F7C6BE]',
    medium: 'bg-[#FFF0D8] text-[#92530C] border-[#F5DEC2]',
    low: 'bg-[#E1EFE4] text-[#286344] border-[#C6DFC9]',
    info: 'bg-[#E5EBF5] text-[#365B91] border-[#C7D7EC]',
  };

  const defaultLabels = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    info: 'Informational',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium rounded-md border',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium rounded-lg border',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium rounded-lg border',
  };

  const icons = {
    high: <AlertTriangle className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />,
    medium: <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />,
    low: <CheckCircle2 className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />,
    info: <Info className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />,
  };

  const displayLabel = label || defaultLabels[severity];

  return (
    <span
      className={clsx(
        'inline-flex items-center select-none',
        styles[severity],
        sizeStyles[size],
        className
      )}
    >
      {showIcon && icons[severity]}
      <span>{count !== undefined ? `${count} ${displayLabel}` : displayLabel}</span>
    </span>
  );
};
