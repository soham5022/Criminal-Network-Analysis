import React from 'react';
import { 
  Target, 
  CheckCircle, 
  Layers, 
  FileText, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Case } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';

export const CaseSummaryTab: React.FC<{ caseData: Case }> = ({ caseData }) => {
  const { setActiveCaseTab, setSelectedEntityId, setSelectedAlertId } = useInvestigation();

  const handleReviewLead = (entityId: string, alertId?: string) => {
    setSelectedEntityId(entityId);
    if (alertId) setSelectedAlertId(alertId);
    setActiveCaseTab('investigation');
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* 1. Operational Scope & Key Analytical Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scope and Objectives */}
        <div className="intel-card p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Investigation Scope & Objective
            </h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {caseData.objective || caseData.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {caseData.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-slate-900 text-xs text-blue-300 border border-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Top 3 Verified Findings */}
        <div className="intel-card p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Important Findings
              </h4>
            </div>
            <span className="text-xs text-slate-400">Automated Synthesis</span>
          </div>

          <div className="space-y-2.5">
            {caseData.keyFindings.slice(0, 3).map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top Actionable Leads in this Case */}
      <div className="intel-card p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Priority Intelligence Leads Needing Review</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an entity or alert to inspect connections directly in the investigation network.
            </p>
          </div>
          <button
            onClick={() => setActiveCaseTab('investigation')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Network Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#090e1a] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                Cross-Group Coordinator
              </span>
              <span className="text-xs font-mono text-slate-400">Score: 82/100</span>
            </div>
            <h5 className="text-sm font-semibold text-white">
              Person_044 links 3 separate functional groups
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Maintains 7 direct connections spanning the supply logistics, telecom relay, and banking clusters.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleReviewLead('Person_044', 'ALT-9041')}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Investigate Person_044</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                Unusual Transaction Frequency
              </span>
              <span className="text-xs font-mono text-slate-400">Score: 76/100</span>
            </div>
            <h5 className="text-sm font-semibold text-white">
              Account_103 structured payment velocity
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              6 transfers structured below threshold limits recorded within 48 hours to 4 unique beneficiaries.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleReviewLead('Account_103', 'ALT-9044')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Investigate Account_103</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
