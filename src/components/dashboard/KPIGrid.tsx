import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Share2, AlertTriangle, Layers } from 'lucide-react';
import { KPICard } from '../common/KPICard';
import { analyticsService, NetworkSummary } from '../../services/analyticsService';
import { useInvestigation } from '../../context/InvestigationContext';

export const KPIGrid: React.FC = () => {
  const { navigateTo } = useInvestigation();
  const [summary, setSummary] = useState<NetworkSummary | null>(null);

  useEffect(() => {
    analyticsService.getNetworkSummary()
      .then(setSummary)
      .catch(err => console.warn('Network summary fallback:', err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <KPICard
        title="Active Cases"
        value="4"
        subtitle="Across MHA Cyber Cells"
        trend="+1"
        trendDirection="up"
        icon={Briefcase}
        accentColor="indigo"
        onClick={() => navigateTo('cases')}
      />

      <KPICard
        title="Entities Analyzed"
        value={summary ? summary.total_nodes.toLocaleString() : '1,247'}
        subtitle="Extracted & Discovered"
        trend="+14%"
        trendDirection="up"
        icon={Users}
        accentColor="cyan"
        onClick={() => navigateTo('entities')}
      />

      <KPICard
        title="Relationships"
        value={summary ? summary.total_edges.toLocaleString() : '3,842'}
        subtitle={`Density: ${summary ? summary.baseline_density : '0.18'}`}
        trend="+28%"
        trendDirection="up"
        icon={Share2}
        accentColor="emerald"
        onClick={() => navigateTo('network')}
      />

      <KPICard
        title="Communities"
        value={summary ? summary.communities_count.toString() : '4'}
        subtitle={`${summary ? summary.bridges_count : '6'} Cross-Cluster Bridges`}
        trend="Calculated"
        trendDirection="neutral"
        icon={Layers}
        accentColor="purple"
        onClick={() => navigateTo('network')}
      />

      <KPICard
        title="Flagged Patterns"
        value={summary ? summary.patterns_detected_count.toString() : '17'}
        subtitle={`${summary ? summary.active_alerts_count : '6'} Explainable Alerts`}
        trend="Active"
        trendDirection="up"
        icon={AlertTriangle}
        accentColor="rose"
        onClick={() => navigateTo('alerts')}
      />
    </div>
  );
};
