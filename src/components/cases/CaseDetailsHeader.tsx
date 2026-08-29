import React from 'react';
import { 
  ArrowLeft,
  LayoutDashboard,
  Network,
  Users,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  StickyNote,
  UploadCloud,
  ShieldAlert,
  User
} from 'lucide-react';
import { Case } from '../../types';
import { useInvestigation, CaseWorkspaceTab } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';

interface CaseDetailsHeaderProps {
  caseData: Case;
}

export const CaseDetailsHeader: React.FC<CaseDetailsHeaderProps> = ({ caseData }) => {
  const { activeCaseTab, setActiveCaseTab, setIsIngestionModalOpen, navigateTo } = useInvestigation();
  const { canIngest } = useAuth();

  const tabs: { id: CaseWorkspaceTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'entities', label: 'Entities', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'evidence', label: 'Evidence', icon: FileSpreadsheet },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'reports', label: 'Report', icon: FileText }
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Back to Cases link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('cases')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cases Directory</span>
        </button>

        {canIngest && (
          <button
            onClick={() => setIsIngestionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Add Case Data</span>
          </button>
        )}
      </div>

      {/* Case Header Card */}
      <div className="intel-card p-5 border border-slate-800 space-y-3 bg-[#0d1527]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400">
                {caseData.id}
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STATUS: {caseData.status || 'ACTIVE'}
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PRIORITY: {caseData.priority || 'HIGH'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {caseData.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#090e1a] px-3 py-1.5 rounded-lg border border-slate-800 font-medium">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>Assigned Officer: <strong className="text-white">{caseData.leadInvestigator || 'Inspector Rajesh Verma'}</strong></span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {caseData.description || 'Cross-source investigation involving communication, financial and location records.'}
        </p>
      </div>

      {/* 8-Tab Navigation Bar */}
      <div className="border-b border-slate-800 bg-[#090e1a] rounded-lg p-1 flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeCaseTab === t.id ||
            (t.id === 'network' && (activeCaseTab === 'investigation' as any));

          return (
            <button
              key={t.id}
              onClick={() => setActiveCaseTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

