import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FolderArchive, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight,
  Plus,
  RefreshCw,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { caseRecordsService, CaseRecordItem } from '../../services/caseRecordsService';
import { useInvestigation } from '../../context/InvestigationContext';

interface CaseRecordsListProps {
  onSelectCase: (caseId: string) => void;
}

export const CaseRecordsList: React.FC<CaseRecordsListProps> = ({ onSelectCase }) => {
  const { searchQuery } = useInvestigation();

  const [search, setSearch] = useState<string>(searchQuery || '');
  const [stationFilter, setStationFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [records, setRecords] = useState<CaseRecordItem[]>([]);

  const loadData = () => {
    const list = caseRecordsService.getCaseRecords({
      search,
      policeStation: stationFilter !== 'ALL' ? stationFilter : undefined,
      caseType: typeFilter !== 'ALL' ? typeFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      priority: priorityFilter !== 'ALL' ? priorityFilter : undefined
    });
    setRecords(list);
  };

  useEffect(() => {
    loadData();
  }, [search, stationFilter, typeFilter, statusFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setStationFilter('ALL');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ACTIVE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">UNDER REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">CLOSED</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Header Banner */}
      <div className="intel-card p-6 border border-slate-800 bg-[#090f1e] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-mono">
            <FolderArchive className="w-6 h-6 text-blue-400" />
            <span>CENTRAL CASE & POLICE RECORDS REPOSITORY</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Search and access authorized police case dossiers, FIR filings, and digital evidence records.
          </p>
        </div>

        <div className="text-right text-xs font-mono text-slate-400">
          <div>Repository Scale: <strong className="text-white">{records.length} Case Files</strong></div>
          <div className="text-[10px] text-slate-500 font-sans">Synthetic Demo Dataset</div>
        </div>
      </div>

      {/* 2. Omnipresent Search & Filters Bar */}
      <div className="intel-card p-4 border border-slate-800 bg-[#0d1527] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by FIR No / Case ID / Person / Phone / Location / Document / Station..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-400" />
            <span>Filters:</span>
          </span>

          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Police Station: All</option>
            <option value="Delhi">Delhi Central Division</option>
            <option value="Mumbai">Mumbai Cyber Cell</option>
            <option value="NCR">NCR Intelligence Bureau</option>
            <option value="Bengaluru">Bengaluru Fraud Unit</option>
            <option value="Docklands">Eastern Docklands</option>
            <option value="Hyderabad">Hyderabad Financial</option>
          </select>

          {/* Case Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Case Type: All</option>
            <option value="Financial">Financial Smurfing</option>
            <option value="Telecom">Burner Telecom Ring</option>
            <option value="Fleet">Transit Fleet Anomaly</option>
            <option value="Beneficial">Corporate Ownership</option>
            <option value="Smuggling">Maritime Smuggling</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Priority: All</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="ROUTINE">ROUTINE</option>
          </select>

          {(search || stationFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Records Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        {records.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-slate-500" />
            <div>No case records found matching your filter criteria.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono font-semibold">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">FIR Number</th>
                  <th className="py-3 px-4">Case Title & Type</th>
                  <th className="py-3 px-4">Police Station</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-center">Docs</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => onSelectCase(rec.id)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {rec.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300 whitespace-nowrap text-[11px]">
                      {rec.firNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{rec.title}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{rec.caseType}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans text-xs max-w-xs truncate">
                      {rec.policeStation}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {rec.dateRegistered}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(rec.status)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(rec.priority)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {rec.documentCount}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectCase(rec.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Case File</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
