import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; height?: string; className?: string }> = ({
  rows = 3,
  height = 'h-8',
  className = ''
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-slate-800/60 rounded-lg border border-slate-700/30 w-full`}
        />
      ))}
    </div>
  );
};
