import type { ReactNode } from 'react';

interface StatBadgeProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatBadge({ icon, label, value, size = 'md' }: StatBadgeProps) {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };
  
  const valueSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  return (
    <div className={`card ${sizeClasses[size]} flex flex-col items-center justify-center text-center`}>
      <div className="mb-2 opacity-60">
        {icon}
      </div>
      <div className={`${valueSizes[size]} font-bold mb-1`} style={{ color: 'var(--color-text)' }}>
        {value}
      </div>
      <div className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}