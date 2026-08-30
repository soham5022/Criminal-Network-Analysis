import React from 'react';
import { EntityType, AnalyticalPriority, CasePriority, CaseStatus, AlertStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'indigo' | 'cyan' | 'purple' | 'teal';
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
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const variantClasses = {
    default: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    critical: 'bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]',
    high: 'bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]',
    medium: 'bg-[#EBF8FF] text-[#2563A6] border border-[#BEE3F8]',
    low: 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]',
    success: 'bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]',
    teal: 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]',
    cyan: 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]',
    indigo: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]',
    purple: 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]'
  };

  const dotColorClasses = {
    default: 'bg-[#64748B]',
    critical: 'bg-[#C24141]',
    high: 'bg-[#B7791F]',
    medium: 'bg-[#2563A6]',
    low: 'bg-[#94A3B8]',
    success: 'bg-[#16805C]',
    teal: 'bg-[#087E8B]',
    cyan: 'bg-[#087E8B]',
    indigo: 'bg-[#4338CA]',
    purple: 'bg-[#7E22CE]'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans rounded-full uppercase tracking-wider ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColorClasses[variant]}`} />}
      {children}
    </span>
  );
};

export const EntityTypeBadge: React.FC<{ type: EntityType; size?: 'sm' | 'md' }> = ({ type, size = 'sm' }) => {
  const mapping: Record<EntityType, { label: string; variant: 'teal' | 'success' | 'high' | 'purple' | 'indigo' | 'critical' }> = {
    PERSON: { label: 'Person', variant: 'teal' },
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
  const variantMap: Record<string, 'teal' | 'critical' | 'high' | 'low' | 'success' | 'default'> = {
    ACTIVE: 'teal',
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
