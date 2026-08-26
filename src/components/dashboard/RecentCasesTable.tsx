import React from 'react';
import { Briefcase, ArrowRight, Clock, ShieldAlert, FolderOpen } from 'lucide-react';
import { mockCases } from '../../data/mockCases';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const RecentCasesTable: React.FC = () => {
  const { navigateTo } = useInvestigation();

  return (
    <div className="intel-card rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Active Investigations</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-agency operations under active network graph synthesis.
          </p>
        </div>
        <button
          onClick={() => navigateTo('cases')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Cases</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Operation Name</th>
              <th className="py-3 px-4">Lead Investigator</th>
              <th className="py-3 px-4 text-center">Priority</th>
              <th className="py-3 px-4 text-right">Entities</th>
              <th className="py-3 px-4 text-right">Links</th>
              <th className="py-3 px-4">Last Activity</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {mockCases.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigateTo('case-details', { caseId: c.id })}
                className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 group-hover:underline">
                  {c.id}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-xs font-mono">
                    {c.codeName}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  <div>{c.leadInvestigator}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{c.department}</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <PriorityBadge priority={c.priority} />
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-200">
                  {c.entityCount}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                  {c.relationshipCount}
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span>{c.lastActivity}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('case-details', { caseId: c.id });
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 group-hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
