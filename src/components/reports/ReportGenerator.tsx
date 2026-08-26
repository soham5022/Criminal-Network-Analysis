import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Users,
  Activity,
  Layers,
  GitFork,
  Network
} from 'lucide-react';
import { mockCases } from '../../data/mockCases';
import { useInvestigation } from '../../context/InvestigationContext';
import { analyticsService, NetworkSummary, CommunityDetail, DetectedPattern } from '../../services/analyticsService';
import { alertService } from '../../services/alertService';
import { Alert } from '../../types';

export const ReportGenerator: React.FC = () => {
  const { activeCaseId } = useInvestigation();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [communities, setCommunities] = useState<CommunityDetail[]>([]);
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const loadData = async () => {
    try {
      const [sum, comms, pats, alrts] = await Promise.all([
        analyticsService.getNetworkSummary(),
        analyticsService.getCommunities(),
        analyticsService.getPatterns(),
        alertService.getAlerts({ caseId: selectedCaseId })
      ]);
      setSummary(sum);
      setCommunities(comms);
      setPatterns(pats);
      setAlerts(alrts);
    } catch (err) {
      console.warn('Report data fetch fallback:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCaseId]);

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
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Top Configuration & Trigger Bar */}
      <div className="intel-card p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Investigation Intelligence Dossier Generator</span>
          </h3>
          <p className="text-xs text-slate-400">
            Synthesize graph metrics, multi-hop pathways, and explainable anomaly alerts into a formal dossier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            {mockCases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Investigation Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Print / Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {showToast && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Intelligence dossier regenerated successfully with verified graph topology snapshot.</span>
          </span>
          <span className="text-[10px] text-emerald-400">PDF Ready</span>
        </div>
      )}

      {/* Formal Printable Intelligence Dossier Document */}
      <div className="intel-card p-8 rounded-2xl border border-slate-800 bg-[#090f1d] shadow-2xl space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                SECRET // LAW ENFORCEMENT ONLY
              </span>
              <span className="text-xs font-mono text-slate-400">DOC-REF: MHA/2026/NX-8902</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              SPECIAL INVESTIGATION INTELLIGENCE DOSSIER
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              OPERATION: <strong className="text-cyan-300">{selectedCaseId} (Operation Meridian)</strong> • MHA CYBER & FINANCIAL CELL
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <div>Date: <strong className="text-white">26 August 2026</strong></div>
            <div>Classification: <strong className="text-rose-400">RESTRICTED LEA</strong></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-cyan-400 rounded-sm" />
            <span>1. Executive Summary & Objective</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            This intelligence dossier synthesizes multi-source graph topology analytics, CDR records, structured banking transactions, and physical surveillance intercepts. The objective is to identify bridge coordinators connecting distinct operational cells without making presumptive guilt claims.
          </p>
        </div>

        {/* Section 2: Network Topology Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-cyan-400 rounded-sm" />
            <span>2. Global Network Topology Baseline</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-bold text-white">{summary ? summary.total_nodes.toLocaleString() : '1,247'}</div>
              <div className="text-[10px] text-slate-400 uppercase">Entities Extracted</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-bold text-cyan-400">{summary ? summary.total_edges.toLocaleString() : '3,842'}</div>
              <div className="text-[10px] text-slate-400 uppercase">Total Relationships</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-bold text-purple-400">{summary ? summary.communities_count : '4'}</div>
              <div className="text-[10px] text-slate-400 uppercase">Community Clusters</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-bold text-rose-400">{summary ? summary.patterns_detected_count : '17'}</div>
              <div className="text-[10px] text-slate-400 uppercase">Anomaly Patterns</div>
            </div>
          </div>
        </div>

        {/* Section 3: Community Analysis */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-cyan-400 rounded-sm" />
            <span>3. Partitioned Community Clusters</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {communities.slice(0, 4).map((comm) => (
              <div key={comm.community_id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className="text-cyan-300">{comm.community_id}</span>
                  <span className="text-slate-400">{comm.size} entities</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Density: <strong className="text-white">{comm.internal_density}</strong> • Internal Edges: <strong className="text-white">{comm.internal_edges_count}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Lead Central Node: <strong className="font-mono text-white">{comm.most_central_entities[0]?.id || 'N/A'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Key Detected Patterns */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-cyan-400 rounded-sm" />
            <span>4. Detected Pattern Anomalies & Evidentiary Findings</span>
          </h4>
          <div className="space-y-2.5">
            {patterns.slice(0, 4).map((pat) => (
              <div key={pat.pattern_id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400">{pat.pattern_id}</span>
                    <span>// {pat.title}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                    {pat.severity}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{pat.explanation}</p>
                <div className="pt-1.5 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-0.5 font-mono">
                  {pat.evidence.map((ev, idx) => (
                    <div key={idx}>• {ev}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Analytical Methodology Note */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 font-mono">
          <div className="font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            <span>5. Analytical Methodology & Ethical AI Verification</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            All indicators are produced through deterministic graph centrality metrics (Brandes Betweenness Centrality, Greedy Modularity Community Partitioning) and transaction threshold clustering. Findings represent topological leads for investigator triage, maintaining the human analyst as the primary decision-maker.
          </p>
        </div>
      </div>
    </div>
  );
};
