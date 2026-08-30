import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Activity, 
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Folder,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
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
      <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0d1527] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>IMMUTABLE LAW ENFORCEMENT AUDIT SYSTEM</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Audit Log & Activity Ledger
            </h1>
            <p className="text-xs text-slate-400">
              Cryptographically timestamped compliance ledger tracking all user access, case inquiries, and evidentiary actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
              REAL-TIME LOGGING ACTIVE
            </span>
          </div>
        </div>

        {/* Dynamic 4 KPI Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-blue-400">{stats.totalEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Total Recorded Events</div>
          </div>

          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-emerald-400">{stats.todayEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Today's Activity</div>
          </div>

          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-indigo-400">{stats.caseActivityCount}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Case File Actions</div>
          </div>

          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-purple-400">{stats.evidenceActivityCount}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Evidence Operations</div>
          </div>
        </div>
      </div>

      {/* 2. Filter and Search Bar */}
      <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0c1322] space-y-3 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {/* Main Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPageNum(1);
              }}
              placeholder="Search by officer, action, module, case ID, or record..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Module Filter */}
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setCurrentPageNum(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Modules</option>
            <option value="Cases">Cases</option>
            <option value="Entities">Entities</option>
            <option value="Evidence">Evidence</option>
            <option value="Witnesses">Witnesses</option>
            <option value="Network">Network Graph</option>
            <option value="Alerts">Alerts</option>
            <option value="Timeline">Timeline</option>
            <option value="Reports">Reports</option>
            <option value="Authentication">Authentication</option>
            <option value="Notes">Notes</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPageNum(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold">Case:</span>
            <select
              value={caseFilter}
              onChange={(e) => {
                setCaseFilter(e.target.value);
                setCurrentPageNum(1);
              }}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white font-mono"
            >
              <option value="ALL">All Cases</option>
              <option value="CASE-1024">CASE-1024 (Operation Meridian)</option>
              <option value="CASE-1031">CASE-1031 (Shadowline)</option>
              <option value="CASE-1042">CASE-1042 (Transit Network)</option>
              <option value="CASE-1057">CASE-1057 (Shell Companies)</option>
            </select>

            <span className="text-slate-400 text-[11px] font-semibold ml-2">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPageNum(1);
              }}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
            />
            <span className="text-slate-400 text-[11px] font-semibold">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPageNum(1);
              }}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
            />
          </div>

          {(search || moduleFilter !== 'ALL' || caseFilter !== 'ALL' || statusFilter !== 'ALL' || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Master Audit Ledger Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Audit Activity Recorded</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              No events match the selected filters. Actions performed inside TraceNet are logged automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-4">Officer / User</th>
                  <th className="py-3 px-4">Action & Module</th>
                  <th className="py-3 px-4">Case Association</th>
                  <th className="py-3 px-4">Referenced Record</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {paginatedLogs.map((ev) => (
                  <tr 
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap text-[11px]">
                      <div>{ev.dateFormatted}</div>
                      <div className="text-[10px] text-slate-500">{ev.timeFormatted}</div>
                    </td>

                    {/* Officer & Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-white">{ev.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Badge: {ev.userBadge}
                      </div>
                    </td>

                    {/* Action & Module */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{ev.actionLabel}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-700 uppercase">
                          {ev.module}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">{ev.id}</span>
                      </div>
                    </td>

                    {/* Case Association */}
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      {ev.caseId ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCaseId(ev.caseId!);
                            navigateTo('case-details', { caseId: ev.caseId, tab: 'overview' });
                          }}
                          className="font-bold text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>{ev.caseId}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Referenced Record */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ev.recordId ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRecord(ev);
                          }}
                          className="text-left font-semibold text-slate-300 hover:text-blue-300 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-xs">{ev.recordLabel || ev.recordId}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </button>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        ev.status === 'SUCCESS'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        {ev.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {logs.length > 0 && (
          <div className="p-3.5 bg-[#090e1a] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing <strong className="text-white">{(currentPageNum - 1) * pageSize + 1}</strong> to <strong className="text-white">{Math.min(currentPageNum * pageSize, logs.length)}</strong> of <strong className="text-white">{logs.length}</strong> events
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="font-mono text-white text-xs px-2">
                Page {currentPageNum} of {totalPages}
              </span>

              <button
                disabled={currentPageNum >= totalPages}
                onClick={() => setCurrentPageNum(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Inspection Modal */}
      {selectedEvent && (
        <AuditEventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </div>
  );
};
