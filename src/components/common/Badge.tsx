import React from 'react';
import { VerificationStatus } from '../../types/index.js';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface BadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  const config = {
    Verified: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
      label: 'Verified',
    },
    Fake: {
      bg: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      icon: XCircle,
      label: 'Fake Certificate',
    },
    'Manual Review': {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: AlertTriangle,
      label: 'Manual Review',
    },
    'Already Uploaded': {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: RefreshCw,
      label: 'Already Uploaded',
    },
  };

  const curr = config[status] || config['Manual Review'];
  const Icon = curr.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-colors whitespace-nowrap ${sizeClasses[size]} ${curr.bg}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{curr.label}</span>
    </span>
  );
};
