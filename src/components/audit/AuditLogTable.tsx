import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Eye, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  auditService, 
  AuditEvent, 
  AuditModule, 
  AuditSummaryStats 
} from '../../services/auditService';
import { useInvestigation } from '../../context/InvestigationContext';
import { AuditEventDetailsModal } from './AuditEventDetailsModal';

export const AuditLogTable: React.FC = () => {
  const { navigateTo, openEntityProfile, setActiveCaseId } = useInvestigation();
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [stats, setStats] = useState<AuditSummaryStats>({
    totalEvents: 0,
    todayEvents: 0,
    caseActivityCount: 0,
    evidenceActivityCount: 0
  });

  // Filter state
  const [search, setSearch] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [caseFilter, setCaseFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination state
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const pageSize = 25;

  // Modal inspection state
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const loadData = () => {
    const list = auditService.getAuditLogs({
      search,
      userQuery: userFilter,
      module: moduleFilter !== 'ALL' ? moduleFilter : undefined,
      caseId: caseFilter !== 'ALL' ? caseFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
    setLogs(list);
    setStats(auditService.getAuditSummaryStats());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = auditService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [search, userFilter, moduleFilter, caseFilter, statusFilter, startDate, endDate]);

  const handleResetFilters = () => {
    setSearch('');
    setUserFilter('');
    setModuleFilter('ALL');
    setCaseFilter('ALL');
    setStatusFilter('ALL');
    setStartDate('');
    setEndDate('');
    setCurrentPageNum(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(logs.length / pageSize) || 1;
  const paginatedLogs = logs.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const handleOpenRecord = (ev: AuditEvent) => {
    if (ev.recordType === 'PERSON' || ev.recordType === 'PHONE' || ev.recordType === 'ACCOUNT' || ev.recordType === 'VEHICLE') {
      openEntityProfile(ev.recordId || 'Person_044');
    } else if (ev.recordType === 'EVIDENCE') {
      if (ev.caseId) setActiveCaseId(ev.caseId);
      navigateTo('evidence');
    } else if (ev.recordType === 'REPORT') {
      if (ev.caseId) setActiveCaseId(ev.caseId);
      navigateTo('reports');
    } else if (ev.caseId) {
      setActiveCaseId(ev.caseId);
      navigateTo('case-details', { caseId: ev.caseId, tab: 'overview' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* 1. Header & Dynamic 4-KPI Tiles */}
      <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#087E8B]">
              <ShieldCheck className="w-4 h-4" />
              <span>IMMUTABLE LAW ENFORCEMENT AUDIT SYSTEM</span>
            </div>
            <h1 className="text-xl font-bold text-[#12304A] tracking-tight">
              Audit Log & Activity Ledger
            </h1>
            <p className="text-xs text-[#64748B]">
              Cryptographically timestamped compliance ledger tracking all user access, case inquiries, and evidentiary actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8] text-xs font-mono font-bold">
              REAL-TIME LOGGING ACTIVE
            </span>
          </div>
        </div>

        {/* Dynamic 4 KPI Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#12304A] font-mono">{stats.totalEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Total Recorded Events</div>
          </div>

          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#087E8B] font-mono">{stats.todayEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Activity Logged Today</div>
          </div>

          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#2563A6] font-mono">{stats.caseActivityCount}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Case Investigations</div>
          </div>

          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#16805C] font-mono">{stats.evidenceActivityCount}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Evidentiary Actions</div>
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {/* Free Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action details..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          {/* Module Filter */}
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
          >
            <option value="ALL">All Modules</option>
            <option value="CASES">Cases</option>
            <option value="CASE_RECORDS">Case Records</option>
            <option value="EVIDENCE">Evidence</option>
            <option value="ENTITIES">Entities</option>
            <option value="NETWORK">Network Graph</option>
            <option value="TIMELINE">Timeline</option>
            <option value="ALERTS">Alerts</option>
            <option value="REPORTS">Reports</option>
            <option value="AUTH">Authentication</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILURE">FAILURE / DENIED</option>
          </select>

          {/* Reset Filters */}
          {(search || userFilter || moduleFilter !== 'ALL' || caseFilter !== 'ALL' || statusFilter !== 'ALL' || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#087E8B] text-xs font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Audit Ledger Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Case Scope</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B]">
                    No audit records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((ev) => (
                  <tr
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                      <div>{ev.dateFormatted}</div>
                      <div className="text-[10px] text-[#94A3B8]">{ev.timeFormatted}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#12304A]">{ev.userName}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">{ev.userRole}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-[#12304A]">{ev.actionLabel}</div>
                      <div className="text-[10px] text-[#64748B] truncate max-w-xs">{ev.details}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[#087E8B] font-bold whitespace-nowrap">
                      {ev.caseId || <span className="text-[#94A3B8] font-normal">N/A</span>}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#12304A] whitespace-nowrap">
                      {ev.recordLabel || ev.recordId || <span className="text-[#94A3B8]">None</span>}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        ev.status === 'SUCCESS'
                          ? 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]'
                          : 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]'
                      }`}>
                        {ev.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="px-2.5 py-1 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white font-semibold text-xs transition-colors shadow-sm inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <div>
              Showing {((currentPageNum - 1) * pageSize) + 1} to {Math.min(currentPageNum * pageSize, logs.length)} of {logs.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
                className="p-1 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-[#12304A]">{currentPageNum} / {totalPages}</span>
              <button
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum(p => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <AuditEventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </div>
  );
};
