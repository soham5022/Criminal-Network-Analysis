import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FolderArchive, 
  FolderOpen,
  Plus
} from 'lucide-react';
import { caseRecordsService, CaseRecordItem, CaseDocument } from '../../services/caseRecordsService';
import { useInvestigation } from '../../context/InvestigationContext';
import { RegisterRecordModal } from './RegisterRecordModal';

interface CaseRecordsListProps {
  onSelectCase: (caseId: string) => void;
}

export const CaseRecordsList: React.FC<CaseRecordsListProps> = ({ onSelectCase }) => {
  const { searchQuery, activeCaseId } = useInvestigation();

  const [search, setSearch] = useState<string>(searchQuery || '');
  const [stationFilter, setStationFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [records, setRecords] = useState<CaseRecordItem[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

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
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">ACTIVE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">UNDER REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">CLOSED</span>;
    }
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

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Header Banner */}
      <div className="bg-[#FFFFFF] p-6 border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#12304A] tracking-tight flex items-center gap-2.5">
            <FolderArchive className="w-6 h-6 text-[#087E8B]" />
            <span>Central Case & Police Records Repository</span>
          </h1>
          <p className="text-xs text-[#64748B] font-sans">
            Search and access authorized police case dossiers, FIR filings, and digital evidence records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Register Record</span>
          </button>
        </div>
      </div>

      {/* 2. Omnipresent Search & Filters Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by FIR Number, Case Title, Officer, Station..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
            </select>

            {(search || stationFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#087E8B] hover:text-[#06636E] font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Records Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3.5 px-4">FIR & Case Title</th>
                <th className="py-3.5 px-4">Police Station & IO</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No case records match the search filter.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => onSelectCase(rec.id)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#087E8B] text-xs">{rec.id}</span>
                        <span className="font-semibold text-[#12304A] text-xs">{rec.title}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] font-mono mt-0.5">{rec.firNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#12304A]">{rec.investigatingOfficer}</div>
                      <div className="text-[11px] text-[#64748B] truncate max-w-xs">{rec.policeStation}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(rec.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getPriorityBadge(rec.priority)}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748B] font-mono">
                      {rec.dateRegistered}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(rec.id);
                        }}
                        className="px-3.5 py-1.5 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white font-semibold transition-colors inline-flex items-center gap-1.5 text-xs shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open File</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Record Modal */}
      {showRegisterModal && (
        <RegisterRecordModal
          initialCaseId={activeCaseId || 'CASE-1024'}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={(newDoc) => {
            setShowRegisterModal(false);
            loadData();
          }}
        />
      )}

    </div>
  );
};
