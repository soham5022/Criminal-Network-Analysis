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
  ShieldCheck,
  User,
  UserCheck,
  ClipboardList,
  Globe,
  BookOpen
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
    { id: 'witnesses', label: 'Witnesses', icon: UserCheck },
    { id: 'actions', label: 'Actions', icon: ClipboardList },
    { id: 'social-intel', label: 'Social Intel', icon: Globe },
    { id: 'criminal-history', label: 'Criminal History', icon: BookOpen },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'entities', label: 'Entities', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'evidence', label: 'Evidence', icon: FileSpreadsheet },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Back to Cases link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('cases')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#12304A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cases Directory</span>
        </button>

        {canIngest && (
          <button
            onClick={() => setIsIngestionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Add Case Data</span>
          </button>
        )}
      </div>

      {/* Case Header Card */}
      <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] space-y-3 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#087E8B]">
                {caseData.id}
              </span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">
                STATUS: {caseData.status || 'ACTIVE'}
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">
                PRIORITY: {caseData.priority || 'HIGH'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#12304A] tracking-tight">
              {caseData.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('audit')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A] text-xs font-semibold transition-colors shadow-sm"
              title="View immutable audit ledger for this case"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>View Audit Activity</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#475569] bg-[#F8FAFC] px-3 py-1.5 rounded-md border border-[#E2E8F0] font-medium">
              <User className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Lead IO: <strong className="text-[#12304A]">{caseData.leadInvestigator || 'Inspector Rajesh Verma'}</strong></span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed font-sans">
          {caseData.description || 'Cross-source investigation involving communication, financial and location records.'}
        </p>
      </div>

      {/* Complete Tabs Navigation Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm rounded-lg p-1 flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeCaseTab === t.id ||
            (t.id === 'network' && (activeCaseTab === 'investigation' as any)) ||
            (t.id === 'overview' && (activeCaseTab === 'activity' as any));

          return (
            <button
              key={t.id}
              onClick={() => setActiveCaseTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                  : 'text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#087E8B]' : 'text-[#64748B]'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
