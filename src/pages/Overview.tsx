import React from 'react';
import { KPIGrid } from '../components/dashboard/KPIGrid';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { EntityDistributionChart } from '../components/dashboard/EntityDistributionChart';
import { RelationshipChart } from '../components/dashboard/RelationshipChart';
import { RecentCasesTable } from '../components/dashboard/RecentCasesTable';
import { LiveAlertsFeed } from '../components/dashboard/LiveAlertsFeed';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <div className="space-y-6 select-none">
      {/* Top Banner Notice */}
      <div className="intel-card p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-cyan-400 border border-indigo-500/40">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              NEXUS INTEL — Automated Multi-Source Criminal Syndicate Analysis
            </h2>
            <p className="text-xs text-slate-300">
              AI graph reasoning synthesizes CDR intercepts, banking smurfing paths, and CCTV co-presence into actionable leads.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-cyan-400 px-3 py-1 rounded bg-slate-900 border border-slate-800 self-start sm:self-auto">
          MHA Prototype // SIH26189
        </div>
      </div>

      {/* 5 Core KPI Metrics */}
      <KPIGrid />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Activity Trend (8 Cols) */}
        <div className="lg:col-span-8">
          <ActivityChart />
        </div>

        {/* Entity Distribution Donut (4 Cols) */}
        <div className="lg:col-span-4">
          <EntityDistributionChart />
        </div>
      </div>

      {/* Relationship Edge Types & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Relationship Types Bar Chart (6 Cols) */}
        <div className="lg:col-span-6">
          <RelationshipChart />
        </div>

        {/* Live Alerts Queue (6 Cols) */}
        <div className="lg:col-span-6">
          <LiveAlertsFeed />
        </div>
      </div>

      {/* Active Cases Section (Section 8) */}
      <RecentCasesTable />
    </div>
  );
};
