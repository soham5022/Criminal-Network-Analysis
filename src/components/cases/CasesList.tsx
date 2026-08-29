import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  Filter,
  User,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Case, CaseStatus, CasePriority } from '../../types';
import { caseService } from '../../services/caseService';
import { useInvestigation } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';

export const CasesList: React.FC = () => {
  const { navigateTo, setActiveCaseId, setIsCreateCaseModalOpen } = useInvestigation();
  const { canEdit } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [officerFilter, setOfficerFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    caseService.getCases()
      .then(setCases)
      .catch(err => console.warn('Cases list fallback:', err))
      .finally(() => setLoading(false));
  }, []);

  const officers = Array.from(new Set(cases.map(c => c.leadInvestigator))).filter(Boolean);

  const filtered = cases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (officerFilter !== 'ALL' && c.leadInvestigator !== officerFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.leadInvestigator.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigateTo('case-details', { caseId, tab: 'overview' });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">ROUTINE</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ACTIVE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">UNDER REVIEW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">CLOSED</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none animate-in fade-in py-1">
      
      {/* Header with Search & New Case Button */}
      <div className="intel-card p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Active Investigation Cases</h1>
          <p className="text-xs text-slate-400 mt-0.5">Formal case dossiers registered under SIH26189 / Ministry of Home Affairs</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {canEdit && (
            <button
              onClick={() => setIsCreateCaseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="intel-card p-3 border border-slate-800 flex flex-wrap items-center gap-3 text-xs bg-[#090e1a]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filters:</span>
        </span>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Status: All</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Priority: All</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
        </select>

        <select
          value={officerFilter}
          onChange={(e) => setOfficerFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Assigned Officer: All</option>
          {officers.map(off => (
            <option key={off} value={off}>{off}</option>
          ))}
        </select>

        {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || officerFilter !== 'ALL' || search) && (
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setOfficerFilter('ALL');
              setSearch('');
            }}
            className="text-[11px] text-blue-400 hover:text-blue-300 ml-auto font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Case Management Table */}
      <div className="intel-card border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Case Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    Loading cases...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No cases match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr 
                    key={c.id}
                    onClick={() => handleOpenCase(c.id)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs font-normal">{c.description}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(c.priority)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono">
                      {c.dateOpened || '12 Aug 2026'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {c.lastActivity || 'Today'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-medium">
                      {c.leadInvestigator || 'Inspector Rajesh Verma'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenCase(c.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

