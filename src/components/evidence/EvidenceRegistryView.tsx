import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderLock, 
  Search, 
  Filter, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  UploadCloud, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Download, 
  Building2, 
  X 
} from 'lucide-react';
import { 
  EvidenceRecord, 
  EvidenceFilterOptions, 
  EvidenceRegistryStats, 
  evidenceRegistryService 
} from '../../services/evidenceRegistryService';
import { useInvestigation } from '../../context/InvestigationContext';
import { mockCases } from '../../data/mockCases';
import { EvidenceRegistrationModal } from './EvidenceRegistrationModal';
import { EvidenceDetailsModal } from './EvidenceDetailsModal';
import { SoftCopyUploadModal } from './SoftCopyUploadModal';

interface EvidenceRegistryViewProps {
  initialCaseId?: string;
}

export const EvidenceRegistryView: React.FC<EvidenceRegistryViewProps> = ({ 
  initialCaseId 
}) => {
  const { activeCaseId, navigateTo, openEntityProfile, setActiveCaseId } = useInvestigation();
  
  const effectiveCaseId = initialCaseId || activeCaseId || 'ALL';
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>(effectiveCaseId);
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDigitalCopy, setSelectedDigitalCopy] = useState<string>('ALL');
  
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [stats, setStats] = useState<EvidenceRegistryStats>({
    totalEvidence: 0,
    digitalCopiesAvailable: 0,
    pendingDigitization: 0,
    underReview: 0,
    verified: 0
  });

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedEvidenceForDetails, setSelectedEvidenceForDetails] = useState<EvidenceRecord | null>(null);
  const [selectedEvidenceForUpload, setSelectedEvidenceForUpload] = useState<EvidenceRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const filters: EvidenceFilterOptions = {
      search: search || undefined,
      caseId: selectedCaseFilter !== 'ALL' ? selectedCaseFilter : undefined,
      evidenceType: selectedType !== 'ALL' ? selectedType : undefined,
      policeStation: selectedStation !== 'ALL' ? selectedStation : undefined,
      status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      hasDigitalCopy: selectedDigitalCopy !== 'ALL' ? selectedDigitalCopy : undefined
    };

    const records = evidenceRegistryService.getEvidenceList(filters);
    setEvidenceList(records);
    setStats(evidenceRegistryService.getRegistryStats(selectedCaseFilter !== 'ALL' ? selectedCaseFilter : undefined));
  };

  useEffect(() => {
    loadData();
  }, [selectedCaseFilter, search, selectedType, selectedStation, selectedStatus, selectedDigitalCopy]);

  const pendingQueue = useMemo(() => {
    return evidenceList.filter(e => !e.hasDigitalCopy);
  }, [evidenceList]);

  const handleRegisterSuccess = (newRecord: EvidenceRecord) => {
    setShowRegisterModal(false);
    loadData();
    setNotification(`Evidence record ${newRecord.id} successfully registered.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSoftCopySuccess = (updated: EvidenceRecord) => {
    setSelectedEvidenceForUpload(null);
    loadData();
    setNotification(`Digital soft copy attached for ${updated.id}. SHA-256 seal generated.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDetailsUpdate = (updated: EvidenceRecord) => {
    loadData();
    if (selectedEvidenceForDetails && selectedEvidenceForDetails.id === updated.id) {
      setSelectedEvidenceForDetails(updated);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CALL_RECORD':
        return 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]';
      case 'TRANSACTION_RECORD':
        return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
      case 'VEHICLE_ANPR_RECORD':
        return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'FORENSIC_REPORT':
        return 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]';
      case 'SURVEILLANCE_FOOTAGE':
        return 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">VERIFIED</span>;
      case 'DIGITAL_COPY_AVAILABLE':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">SOFT COPY READY</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">UNDER REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">PENDING SCAN</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* Notifications */}
      {notification && (
        <div className="p-3.5 rounded-lg bg-[#E8F7F0] border border-[#A3E0C8] text-[#16805C] text-xs flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16805C]" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#16805C] hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-[#FFFFFF] p-6 border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-[#087E8B]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#12304A] tracking-tight">
              Digital Evidence Registry
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-sans">
            Centralized digital record of evidence associated with authorized investigation cases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Evidence</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm text-center space-y-0.5">
          <div className="text-lg font-bold text-[#12304A] font-mono">{stats.totalEvidence}</div>
          <div className="text-[10px] text-[#64748B] uppercase">Total Evidence</div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm text-center space-y-0.5">
          <div className="text-lg font-bold text-[#087E8B] font-mono">{stats.digitalCopiesAvailable}</div>
          <div className="text-[10px] text-[#64748B] uppercase">Digital Copies Ready</div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm text-center space-y-0.5">
          <div className="text-lg font-bold text-[#B7791F] font-mono">{stats.pendingDigitization}</div>
          <div className="text-[10px] text-[#64748B] uppercase">Pending Soft Copy</div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm text-center space-y-0.5">
          <div className="text-lg font-bold text-[#2563A6] font-mono">{stats.underReview}</div>
          <div className="text-[10px] text-[#64748B] uppercase">Under Review</div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm text-center space-y-0.5">
          <div className="text-lg font-bold text-[#16805C] font-mono">{stats.verified}</div>
          <div className="text-[10px] text-[#64748B] uppercase">Verified & Sealed</div>
        </div>
      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search evidence ID, description, officer, hash..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedCaseFilter}
              onChange={(e) => {
                setSelectedCaseFilter(e.target.value);
                if (e.target.value !== 'ALL') setActiveCaseId(e.target.value);
              }}
              className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
            >
              <option value="ALL">All Investigation Cases</option>
              {mockCases.map(c => (
                <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
            >
              <option value="ALL">All Evidence Types</option>
              <option value="CALL_RECORD">Call Records (CDR)</option>
              <option value="TRANSACTION_RECORD">Bank Ledgers</option>
              <option value="VEHICLE_ANPR_RECORD">Vehicle ANPR</option>
              <option value="FORENSIC_REPORT">Forensic Reports</option>
              <option value="SURVEILLANCE_FOOTAGE">Surveillance</option>
              <option value="PHYSICAL_SEIZURE">Physical Seizures</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Digital Evidence Repository Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Evidence ID & Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Case Scope</th>
                <th className="py-3.5 px-4">Seized / Collected</th>
                <th className="py-3.5 px-4">Integrity Hash</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {evidenceList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B]">
                    No evidence records match current filters.
                  </td>
                </tr>
              ) : (
                evidenceList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEvidenceForDetails(item)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#087E8B]">{item.id}</span>
                        <span className="font-semibold text-[#12304A]">{item.title}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] truncate max-w-xs">{item.description}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadge(item.evidenceType)}`}>
                        {item.evidenceType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#12304A] whitespace-nowrap">
                      {item.caseId}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748B] font-mono whitespace-nowrap">
                      <div>{item.collectedDate}</div>
                      <div className="text-[10px] text-[#94A3B8]">{item.policeStation}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#64748B] whitespace-nowrap">
                      {item.digitalDocument?.integrityHash ? (
                        <span className="text-[#16805C] bg-[#E8F7F0] px-1.5 py-0.5 rounded border border-[#A3E0C8]">
                          {item.digitalDocument.integrityHash.substring(0, 10)}...
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">Pending Seal</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {item.hasDigitalCopy ? (
                          <button
                            onClick={() => setSelectedEvidenceForDetails(item)}
                            className="px-2.5 py-1 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                            title="Inspect Digital Soft Copy"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedEvidenceForUpload(item)}
                            className="px-2.5 py-1 rounded-md bg-[#FEF3C7] hover:bg-[#B7791F] text-[#B7791F] hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm border border-[#FCD34D]"
                            title="Upload Digital Copy"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Attach Copy</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showRegisterModal && (
        <EvidenceRegistrationModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegisterSuccess}
          initialCaseId={selectedCaseFilter !== 'ALL' ? selectedCaseFilter : (activeCaseId && activeCaseId !== 'ALL' ? activeCaseId : (mockCases[0]?.id || 'CASE-1024'))}
        />
      )}

      {selectedEvidenceForDetails && (
        <EvidenceDetailsModal
          evidence={selectedEvidenceForDetails}
          onClose={() => setSelectedEvidenceForDetails(null)}
          onUpdate={handleDetailsUpdate}
        />
      )}

      {selectedEvidenceForUpload && (
        <SoftCopyUploadModal
          evidence={selectedEvidenceForUpload}
          onClose={() => setSelectedEvidenceForUpload(null)}
          onSuccess={handleSoftCopySuccess}
        />
      )}

    </div>
  );
};
