import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  accentColor?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'up',
  icon: Icon,
  accentColor = 'cyan',
  onClick
}) => {
  const accentStyles = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
    },
    indigo: {
      border: 'hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]'
    },
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
    }
  };

  const style = accentStyles[accentColor];

  return (
    <div
      onClick={onClick}
      className={`group relative intel-card p-5 rounded-xl border transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${style.border} ${style.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-lg border ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
        {trend && (
          <span className={`inline-flex items-center gap-1 font-medium ${
            trendDirection === 'up' ? 'text-emerald-400' :
            trendDirection === 'down' ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-slate-400 truncate max-w-[170px]" title={subtitle}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
