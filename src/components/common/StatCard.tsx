import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme: 'blue' | 'emerald' | 'red' | 'amber' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  onClick,
}) => {
  const schemeClasses = {
    blue: {
      border: 'border-blue-100 dark:border-blue-900/50',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    emerald: {
      border: 'border-emerald-100 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    red: {
      border: 'border-red-100 dark:border-red-900/50',
      iconBg: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400',
      accent: 'text-red-600 dark:text-red-400',
    },
    amber: {
      border: 'border-amber-100 dark:border-amber-900/50',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    indigo: {
      border: 'border-indigo-100 dark:border-indigo-900/50',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      accent: 'text-indigo-600 dark:text-indigo-400',
    },
  };

  const curr = schemeClasses[colorScheme];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl p-5 border ${curr.border} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${curr.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
