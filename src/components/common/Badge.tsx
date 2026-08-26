import React from 'react';
import { EntityType, AnalyticalPriority, CasePriority, CaseStatus, AlertStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'indigo' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const variantClasses = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    critical: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    high: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    medium: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    low: 'bg-slate-700/40 text-slate-300 border border-slate-600/30',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
  };

  const dotColorClasses = {
    default: 'bg-slate-400',
    critical: 'bg-rose-400 animate-pulse',
    high: 'bg-amber-400',
    medium: 'bg-cyan-400',
    low: 'bg-slate-400',
    success: 'bg-emerald-400',
    indigo: 'bg-indigo-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full uppercase tracking-wider ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColorClasses[variant]}`} />}
      {children}
    </span>
  );
};

export const EntityTypeBadge: React.FC<{ type: EntityType; size?: 'sm' | 'md' }> = ({ type, size = 'sm' }) => {
  const mapping: Record<EntityType, { label: string; variant: 'cyan' | 'success' | 'high' | 'purple' | 'indigo' | 'critical' }> = {
    PERSON: { label: 'Person', variant: 'cyan' },
    PHONE: { label: 'Phone', variant: 'success' },
    ACCOUNT: { label: 'Account', variant: 'high' },
    LOCATION: { label: 'Location', variant: 'purple' },
    ORGANIZATION: { label: 'Organization', variant: 'indigo' },
    VEHICLE: { label: 'Vehicle', variant: 'critical' }
  };

  const config = mapping[type] || { label: type, variant: 'default' };
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: AnalyticalPriority | CasePriority; size?: 'sm' | 'md' }> = ({ priority, size = 'sm' }) => {
  const variantMap: Record<string, 'critical' | 'high' | 'medium' | 'low' | 'default'> = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    ROUTINE: 'low',
    INFORMATIONAL: 'low'
  };

  return (
    <Badge variant={variantMap[priority] || 'default'} size={size} dot={priority === 'CRITICAL' || priority === 'HIGH'}>
      {priority}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: CaseStatus | AlertStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const variantMap: Record<string, 'cyan' | 'critical' | 'high' | 'low' | 'success' | 'default'> = {
    ACTIVE: 'cyan',
    CRITICAL_LEAD: 'critical',
    UNDER_REVIEW: 'high',
    CLOSED: 'low',
    ARCHIVED: 'low',
    NEW: 'critical',
    INVESTIGATING: 'high',
    REVIEWED: 'success',
    DISMISSED: 'low'
  };

  const labelMap: Record<string, string> = {
    ACTIVE: 'Active',
    CRITICAL_LEAD: 'Critical Lead',
    UNDER_REVIEW: 'Under Review',
    CLOSED: 'Closed',
    ARCHIVED: 'Archived',
    NEW: 'New Alert',
    INVESTIGATING: 'Investigating',
    REVIEWED: 'Reviewed',
    DISMISSED: 'Dismissed'
  };

  return (
    <Badge variant={variantMap[status] || 'default'} size={size} dot={status === 'ACTIVE' || status === 'NEW'}>
      {labelMap[status] || status}
    </Badge>
  );
};
