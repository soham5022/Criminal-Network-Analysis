import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  UploadCloud, 
  ArrowRight, 
  Clock, 
  Users, 
  Share2, 
  AlertTriangle, 
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { Case, CaseStatus, CasePriority } from '../../types';
import { mockCases } from '../../data/mockCases';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const CasesList: React.FC = () => {
  const { navigateTo, setIsIngestionModalOpen } = useInvestigation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = mockCases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.leadInvestigator.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 select-none">
      {/* Action Header & Search */}
      <div className="intel-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operations by ID, codename, tags, investigator..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses ({mockCases.length})</option>
            <option value="ACTIVE">Active Operations</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>

          <button
            onClick={() => setIsIngestionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Add Investigation Data</span>
          </button>
        </div>
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => navigateTo('case-details', { caseId: c.id })}
            className="intel-card p-6 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-4 group shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {c.id}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    — {c.name}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  {c.codeName} • {c.department}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {c.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {c.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-cyan-400 border border-slate-800">
                  #{tag}
                </span>
              ))}
              {c.tags.length > 3 && (
                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-400">
                  +{c.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Metrics Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <strong className="text-white">{c.entityCount}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <strong className="text-white">{c.relationshipCount}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <strong className="text-white">{c.flaggedAlertsCount}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1 text-cyan-400 group-hover:underline text-xs font-semibold">
                <span>Inspect Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
