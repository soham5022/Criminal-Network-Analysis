import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Check, 
  X, 
  Sparkles, 
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Clock,
  Download
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { caseService } from '../../services/caseService';
import { analyticsService, NetworkSummary, CommunityDetail } from '../../services/analyticsService';
import { alertService } from '../../services/alertService';
import { evidenceRegistryService } from '../../services/evidenceRegistryService';
import { Case, Alert } from '../../types';

export const ReportGenerator: React.FC = () => {
  const { activeCaseId } = useInvestigation();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId);
  const [viewMode, setViewMode] = useState<'list' | 'report'>('list');
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Generation options checkboxes
  const [includeOptions, setIncludeOptions] = useState({
    summary: true,
    findings: true,
    evidence: true,
    timeline: true,
    network: true,
    notes: true
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [communities, setCommunities] = useState<CommunityDetail[]>([]);

  useEffect(() => {
    Promise.all([
      caseService.getCases(),
      analyticsService.getCommunities(),
      alertService.getAlerts({ caseId: selectedCaseId })
    ])
      .then(([cList, comms, alrts]) => {
        setCases(cList);
        setCommunities(comms);
        setAlerts(alrts);
      })
      .catch(err => console.warn('Report data fetch error:', err));
  }, [selectedCaseId]);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0] || {
    id: 'CASE-1024',
    name: 'Operation Meridian',
    leadInvestigator: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    department: 'Special Cyber & Financial Crimes Division',
    dateOpened: '2026-08-10',
    description: 'This case contains communication, financial and location records that may contain related activity. The system has identified several relationships requiring review.',
    keyFindings: [
      'Person_044 identified as sole structural bridge linking northern and western distribution cells.',
      'Smurfing velocity: 6 rapid transfers under regulatory threshold detected on Account_103.',
      'Multi-modal convergence: Encrypted voice call followed by physical location meeting within 8 hours.'
    ]
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await analyticsService.runAnalytics(selectedCaseId, false);
    } catch (err) {
      console.warn('Generate fallback:', err);
    } finally {
      setIsGenerating(false);
      setShowGenerateModal(false);
      setViewMode('report');
    }
  };

  const toggleOption = (key: keyof typeof includeOptions) => {
    setIncludeOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // View Report (Dossier)
  if (viewMode === 'report') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 select-none animate-in fade-in py-2">
        {/* Top Controls */}
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Reports List</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
            >
              Generate New Report
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Formal Printable Intelligence Dossier */}
        <div className="intel-card p-8 border border-slate-800 bg-[#090f1d] shadow-2xl space-y-7 print:p-0 print:border-none print:bg-white print:text-black">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                CONFIDENTIAL // SIH PROTOTYPE
              </span>
              <div className="font-mono text-sm font-bold text-blue-400">TraceNet</div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI-Powered Criminal Network Analysis System
              </h2>
              <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider text-slate-400">
                Investigation Report
              </div>
              <p className="text-xs text-slate-300 pt-1">
                CASE: <strong className="text-blue-400 font-mono">{activeCase.id} — {activeCase.name}</strong>
              </p>
            </div>


            <div className="text-right text-xs space-y-1 text-slate-400 font-mono">
              <div>Investigator: <strong className="text-white">{activeCase.leadInvestigator || 'Officer'}</strong></div>
              <div>Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Section: Case Summary */}
          {includeOptions.summary && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1">
                Case Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeCase.description}
              </p>
            </div>
          )}

          {/* Section: Important Findings */}
          {includeOptions.findings && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1">
                Important Findings
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {activeCase.keyFindings?.map((finding, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Network Overview */}
          {includeOptions.network && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1">
                Network Overview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {communities.map((comm) => (
                  <div key={comm.community_id} className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-1">
                    <div className="flex justify-between font-semibold text-white">
                      <span>{comm.label || comm.community_id}</span>
                      <span className="text-blue-400 font-mono">{comm.size} Entities</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Central Coordinator: <strong className="text-amber-300">{comm.most_central_entities?.[0]?.id || 'Person_044'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Supporting Evidence */}
          {includeOptions.evidence && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1">
                Supporting Evidence & Registered Records
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                {evidenceRegistryService.getEvidenceByCase(selectedCaseId).map(ev => (
                  <div key={ev.id} className="p-2.5 rounded bg-[#090e1a] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-blue-400 font-bold">{ev.id}: </span>
                      <span className="text-white font-medium">{ev.title}</span>
                      <span className="text-slate-500 font-mono text-[10px] ml-2">({ev.policeStation})</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px] shrink-0">
                      {ev.status === 'VERIFIED' ? 'SHA-256 Verified' : 'Registered in Ledger'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Timeline */}
          {includeOptions.timeline && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1">
                Timeline Chronology
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between p-2 rounded bg-[#090e1a]">
                  <span>09:42 — Encrypted VoLTE Call</span>
                  <span>Vikram Singh → Rahul Sharma</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#090e1a]">
                  <span>11:15 — Physical Rendezvous</span>
                  <span>Rahul Sharma → Thane West Logistics Hub</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#090e1a]">
                  <span>14:32 — Structured Transfer (₹48,000)</span>
                  <span>Account ending 4821 → Account ending 7316</span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Investigator Notes */}
          {includeOptions.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1">
                Investigator Notes
              </h4>
              <p className="text-xs text-slate-300 italic bg-[#090e1a] p-3 rounded-lg border border-slate-800">
                "Subpoena filed for Account_103 beneficiary records. Corroborated with surveillance observations at Location A."
              </p>
            </div>
          )}

          {/* Law Enforcement Disclaimer */}
          <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong>Official Notice:</strong> This intelligence brief provides synthesized investigative leads based on multi-source data relationships. Information is prepared for authorized law enforcement operations.
          </div>

        </div>
      </div>
    );
  }

  // Reports List (Default Clean Screen)
  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6 select-none animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
        <p className="text-xs text-slate-400 mt-0.5">Formal investigation briefs and case dossiers</p>
      </div>

      {/* Reports Case Cards List */}
      <div className="space-y-4">
        {cases.map((c) => {
          return (
            <div 
              key={c.id}
              className="intel-card p-6 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              <div className="space-y-1.5">
                <div className="font-mono text-xs font-bold text-blue-400">
                  {c.id}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {c.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Last report: <strong className="text-slate-300">Today, 11:42 AM</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setViewMode('report');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  View Report
                </button>

                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setShowGenerateModal(true);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  Generate New Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate Investigation Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="intel-card w-full max-w-md border border-slate-700 p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Generate Investigation Report</h3>
                <p className="text-xs text-slate-400">{activeCase.id} — {activeCase.name}</p>
              </div>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                Include in Report:
              </span>

              {[
                { key: 'summary' as const, label: 'Case summary' },
                { key: 'findings' as const, label: 'Important findings' },
                { key: 'evidence' as const, label: 'Supporting evidence' },
                { key: 'timeline' as const, label: 'Timeline' },
                { key: 'network' as const, label: 'Network overview' },
                { key: 'notes' as const, label: 'Investigator notes' }
              ].map(({ key, label }) => {
                const checked = includeOptions[key];
                return (
                  <label 
                    key={key}
                    onClick={() => toggleOption(key)}
                    className="flex items-center gap-3 cursor-pointer py-1 text-slate-200 hover:text-white"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      checked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 bg-slate-900'
                    }`}>
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="font-medium">{label}</span>
                  </label>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
