import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Users,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { caseService } from '../../services/caseService';
import { analyticsService, NetworkSummary, CommunityDetail } from '../../services/analyticsService';
import { alertService } from '../../services/alertService';
import { Case, Alert } from '../../types';

export const ReportGenerator: React.FC = () => {
  const { activeCaseId } = useInvestigation();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId);
  const [cases, setCases] = useState<Case[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [communities, setCommunities] = useState<CommunityDetail[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const loadData = async () => {
    try {
      const [cList, sum, comms, alrts] = await Promise.all([
        caseService.getCases(),
        analyticsService.getNetworkSummary(),
        analyticsService.getCommunities(),
        alertService.getAlerts({ caseId: selectedCaseId })
      ]);
      setCases(cList);
      setSummary(sum);
      setCommunities(comms);
      setAlerts(alrts);
    } catch (err) {
      console.warn('Report data fetch fallback:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCaseId]);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0] || {
    id: 'CASE-1024',
    name: 'Operation Meridian',
    leadInvestigator: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    department: 'Special Cyber & Financial Crimes Division',
    dateOpened: '2026-08-10',
    description: 'Cross-border narcotics distribution & hawala money-laundering syndicate operating across multiple regional hubs.',
    keyFindings: [
      'Person_044 identified as sole structural bridge linking northern and western distribution cells.',
      'Smurfing velocity: 6 rapid transactions under regulatory threshold detected on Account_103.',
      'Multi-modal convergence: Encrypted voice call followed by physical location meeting within 8 hours.'
    ]
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await analyticsService.runAnalytics(selectedCaseId, false);
    await loadData();
    setIsGenerating(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto animate-in fade-in">
      {/* 1. Header & Generator Controls */}
      <div className="intel-card p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Investigation Intelligence Report Generator</span>
          </h3>
          <p className="text-xs text-slate-400">
            Synthesizes case objectives, graph topology findings, explainable alerts, and evidence provenance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#090e1a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Print / Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {showToast && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Investigation report refreshed with current graph intelligence snapshot.</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">READY TO PRINT</span>
        </div>
      )}

      {/* 2. Formal Printable Investigation Intelligence Dossier */}
      <div className="intel-card p-8 border border-slate-800 bg-[#090f1d] shadow-xl space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Dossier Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                CONFIDENTIAL // OFFICIAL USE ONLY
              </span>
              <span className="text-xs text-slate-400 font-mono">CASE FILE: {activeCase.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              INVESTIGATION INTELLIGENCE DOSSIER
            </h2>
            <p className="text-xs text-slate-300">
              OPERATION: <strong className="text-blue-400 font-bold">{activeCase.name}</strong> • SPECIAL CYBER & FINANCIAL CRIMES CELL
            </p>
          </div>

          <div className="text-right text-xs space-y-1 font-mono text-slate-400">
            <div>Officer: <strong className="text-white">{activeCase.leadInvestigator}</strong></div>
            <div>Badge: <strong className="text-slate-300">{activeCase.badgeNumber || 'MHA-INT-8902'}</strong></div>
            <div>Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Section 1: Executive Case Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800/80 pb-1">
            1. Executive Case Summary & Operational Scope
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeCase.description}
          </p>
        </div>

        {/* Section 2: Important Analytical Findings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800/80 pb-1">
            2. Verified Graph Intelligence Findings
          </h4>
          <div className="space-y-2">
            {activeCase.keyFindings?.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Decomposed Operational Groups */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800/80 pb-1">
            3. Identified Network Groups ({communities.length || 4} Functional Clusters)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {communities.map((comm) => (
              <div key={comm.community_id} className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>{comm.label || comm.community_id}</span>
                  <span className="text-blue-400 font-mono">{comm.size} Entities</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Primary Bridge: <strong className="text-amber-300">{comm.most_central_entities?.[0]?.id || 'Person_044'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Actionable Anomaly Alerts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800/80 pb-1">
            4. Flagged Anomalies & Recommended Actions ({alerts.length} Items)
          </h4>
          <div className="space-y-2.5">
            {alerts.slice(0, 4).map((alt) => (
              <div key={alt.id} className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{alt.id} — {alt.title}</span>
                  <span className="text-amber-400 uppercase text-[10px]">{alt.severity}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{alt.reason}</p>
                <div className="text-[11px] text-blue-300 pt-0.5">
                  Action: {alt.recommendedAction || 'Subpoena subscriber records and transaction ledgers.'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Legal & Ethical AI Notice */}
        <div className="p-4 rounded-lg bg-[#090e1a] border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p>
            <strong>Official Law Enforcement Disclaimer:</strong> NEXUS INTEL provides automated analytical leads by identifying topological relationships, cross-group coordinators, and temporal correlations. Findings are intended solely to assist human case officers in prioritizing review and do not determine legal guilt without independent investigative corroboration.
          </p>
        </div>
      </div>
    </div>
  );
};
