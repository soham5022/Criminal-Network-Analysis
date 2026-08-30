import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  Filter,
  User,
  Clock
} from 'lucide-react';
import { Case } from '../../types';
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF8FF] text-[#2563A6] border border-[#BEE3F8]">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">ROUTINE</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">ACTIVE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">UNDER REVIEW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">CLOSED</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none animate-in fade-in py-1">
      
      {/* Header with Search & New Case Button */}
      <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#12304A] tracking-tight">Active Investigation Cases</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Formal case dossiers registered under SIH26189 / Ministry of Home Affairs</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B] transition-colors"
            />
          </div>

          {canEdit && (
            <button
              onClick={() => setIsCreateCaseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#087E8B]" />
          <span>Filters:</span>
        </span>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
        >
          <option value="ALL">Status: All</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
        >
          <option value="ALL">Priority: All</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
        </select>

        <select
          value={officerFilter}
          onChange={(e) => setOfficerFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
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
            className="text-[11px] text-[#087E8B] hover:text-[#06636E] ml-auto font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Cases Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Case Details</th>
                <th className="py-3.5 px-4">Lead Investigator</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Key Metrics</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    Loading investigation files...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => handleOpenCase(c.id)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#087E8B] text-xs">{c.id}</span>
                        <span className="font-semibold text-[#12304A] text-xs">{c.name}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1 max-w-md">{c.description}</p>
                    </td>

                    <td className="py-3.5 px-4 text-[#17212B]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="font-medium text-xs text-[#12304A]">{c.leadInvestigator}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-mono">{c.badgeNumber}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(c.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getPriorityBadge(c.priority)}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748B]">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span>{c.entityCount} entities</span>
                        <span>•</span>
                        <span>{c.flaggedAlertsCount} alerts</span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{c.lastActivity}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCase(c.id);
                        }}
                        className="px-3.5 py-1.5 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white font-semibold transition-colors inline-flex items-center gap-1.5 text-xs shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Case</span>
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
