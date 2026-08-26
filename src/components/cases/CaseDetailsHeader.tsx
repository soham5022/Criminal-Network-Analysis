import React from 'react';
import { 
  Briefcase, 
  Share2, 
  Users, 
  AlertTriangle, 
  FileCheck, 
  UploadCloud, 
  FileText,
  Clock,
  Layers,
  FileSpreadsheet,
  Activity,
  RotateCcw
} from 'lucide-react';
import { Case } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useInvestigation, CaseWorkspaceTab } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';

interface CaseDetailsHeaderProps {
  caseData: Case;
}

export const CaseDetailsHeader: React.FC<CaseDetailsHeaderProps> = ({ caseData }) => {
  const { activeCaseTab, setActiveCaseTab, setIsIngestionModalOpen, navigateTo } = useInvestigation();
  const { canIngest } = useAuth();

  const tabs: { id: CaseWorkspaceTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'network', label: 'Network', icon: Share2, count: caseData.entityCount },
    { id: 'entities', label: 'Entities', icon: Users, count: caseData.entityCount },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: caseData.flaggedAlertsCount },
    { id: 'evidence', label: 'Evidence', icon: FileSpreadsheet },
    { id: 'reports', label: 'Reports', icon: FileCheck },
    { id: 'activity', label: 'Notes & Activity', icon: Activity }
  ];

  return (
    <div className="intel-card rounded-xl border border-slate-800 space-y-5 select-none">
      {/* Top Banner Information */}
      <div className="p-6 pb-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xl lg:text-2xl font-extrabold text-white tracking-wide">
              {caseData.id} — {caseData.name}
            </span>
            <PriorityBadge priority={caseData.priority} size="md" />
            <StatusBadge status={caseData.status} size="md" />
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {caseData.description}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {canIngest && (
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Ingest Case Data</span>
            </button>
          )}
          <button
            onClick={() => setActiveCaseTab('reports')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Generate Dossier</span>
          </button>
        </div>
      </div>

      {/* Case Metadata Telemetry Grid */}
      <div className="px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 py-3 border-y border-slate-800/80 bg-slate-950/40 text-xs">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Lead Investigator</span>
          <span className="font-semibold text-slate-200">{caseData.leadInvestigator}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Badge / Dept</span>
          <span className="font-mono text-slate-300">{caseData.badgeNumber}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Date Opened</span>
          <span className="font-mono text-slate-300">{caseData.dateOpened}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Entities Mapped</span>
          <span className="font-mono font-bold text-cyan-400">{caseData.entityCount}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Relationships</span>
          <span className="font-mono font-bold text-emerald-400">{caseData.relationshipCount}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Identified Clusters</span>
          <span className="font-mono font-bold text-indigo-400">{caseData.clustersIdentified} Communities</span>
        </div>
      </div>

      {/* Case Navigation 8 Tabs */}
      <div className="px-6 flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCaseTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCaseTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
