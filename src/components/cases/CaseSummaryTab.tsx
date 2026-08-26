import React from 'react';
import { 
  Target, 
  CheckCircle, 
  Layers, 
  FileText, 
  Share2, 
  ArrowRight, 
  ShieldCheck, 
  Network,
  Cpu
} from 'lucide-react';
import { Case } from '../../types';
import { mockCommunityClusters } from '../../data/mockAnalytics';
import { useInvestigation } from '../../context/InvestigationContext';

export const CaseSummaryTab: React.FC<{ caseData: Case }> = ({ caseData }) => {
  const { setActiveCaseTab, navigateTo } = useInvestigation();

  return (
    <div className="space-y-6">
      {/* Investigation Objectives & Scope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Primary Investigation Objective
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {caseData.objective}
          </p>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {caseData.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-cyan-300 border border-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Key AI-Synthesized Findings
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">4 Points Verified</span>
          </div>

          <div className="space-y-2">
            {caseData.keyFindings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Clusters Identified in this Case */}
      <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" />
              <span>Decomposed Community Clusters (Modularity Algorithm)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              The automated Louvain community detection partition maps functional sub-syndicates.
            </p>
          </div>
          <button
            onClick={() => setActiveCaseTab('network')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Graph View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {mockCommunityClusters.map((cluster) => (
            <div
              key={cluster.clusterId}
              onClick={() => {
                setActiveCaseTab('network');
              }}
              className="p-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/30 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{cluster.clusterId}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {cluster.nodeCount} Nodes
                </span>
              </div>
              <h5 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                {cluster.name}
              </h5>
              <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800/80 font-mono">
                <div className="flex justify-between">
                  <span>Modularity:</span>
                  <span className="text-emerald-400">{cluster.modularityScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Bridge:</span>
                  <span className="text-amber-300 font-bold">{cluster.dominantBridge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
