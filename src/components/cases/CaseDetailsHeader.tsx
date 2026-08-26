import React from 'react';
import { 
  Briefcase, 
  Search, 
  AlertTriangle, 
  FileSpreadsheet, 
  FileText,
  UploadCloud, 
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';
import { Case } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useInvestigation, CaseWorkspaceTab } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';

interface CaseDetailsHeaderProps {
  caseData: Case;
}

export const CaseDetailsHeader: React.FC<CaseDetailsHeaderProps> = ({ caseData }) => {
  const { activeCaseTab, setActiveCaseTab, setIsIngestionModalOpen, navigateTo } = useInvestigation();
  const { canIngest } = useAuth();

  // Simplified 5 Focused Tabs
  const tabs: { id: CaseWorkspaceTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Case Overview', icon: FileText },
    { id: 'investigation', label: 'Investigation & Graph', icon: Search, count: caseData.entityCount },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: caseData.flaggedAlertsCount },
    { id: 'evidence', label: 'Source Evidence', icon: FileSpreadsheet },
    { id: 'reports', label: 'Report', icon: FileText }
  ];

  return (
    <div className="intel-card border border-slate-800 space-y-4 select-none">
      {/* Top Header Information & Actions */}
      <div className="p-6 pb-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xl font-bold text-white tracking-wide">
              {caseData.id} — {caseData.name}
            </span>
            <PriorityBadge priority={caseData.priority} size="md" />
            <StatusBadge status={caseData.status} size="md" />
          </div>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {caseData.description}
          </p>
        </div>

        {/* 3 Main Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveCaseTab('investigation')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Investigate</span>
          </button>

          {canIngest && (
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>Add Data</span>
            </button>
          )}

          <button
            onClick={() => setActiveCaseTab('reports')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Case Key Metadata Bar */}
      <div className="px-6 py-3 border-y border-slate-800 bg-[#090e1a] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Lead Investigator</span>
          <span className="font-semibold text-slate-200">{caseData.leadInvestigator} ({caseData.badgeNumber || 'MHA-INT-8902'})</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Date Opened</span>
          <span className="font-medium text-slate-300">{caseData.dateOpened}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Entities Discovered</span>
          <span className="font-bold text-blue-400">{caseData.entityCount} Entities</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Network Groups</span>
          <span className="font-bold text-amber-400">{caseData.clustersIdentified || 4} Identified Groups</span>
        </div>
      </div>

      {/* 5 Focused Navigation Tabs */}
      <div className="px-6 flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCaseTab === tab.id || 
            (tab.id === 'investigation' && (activeCaseTab === 'network' || activeCaseTab === 'entities')) ||
            (tab.id === 'overview' && activeCaseTab === 'activity');

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCaseTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
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
