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
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  Download, 
  RefreshCw,
  Layers,
  Sparkles,
  Building2,
  FileCheck2,
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
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'TRANSACTION_RECORD':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'VEHICLE_ANPR_RECORD':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'FORENSIC_REPORT':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'PHYSICAL_EVIDENCE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 select-none animate-in fade-in py-1">
      
      {/* 1. Header Banner */}
      <div className="intel-card p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1527] rounded-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold font-mono">
            <FolderLock className="w-4 h-4" />
            <span>CENTRALIZED DIGITAL EVIDENCE REGISTRY</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SYNTHETIC REPOSITORY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Case Evidence & Digital Soft-Copy Ledger
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Centralized digital record of evidence associated with authorized investigation cases. Supports soft-copy document retrieval, cryptographic SHA-256 bitwise integrity verification, and continuous chain of custody tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Evidence</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs shadow-2xl flex items-center justify-between gap-2 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Dynamic KPI Dashboard Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="intel-card p-4 rounded-xl border border-slate-800 bg-[#0c1322] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Evidence</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalEvidence}</div>
          <div className="text-[10px] text-slate-500 font-sans">Indexed across all files</div>
        </div>

        <div className="intel-card p-4 rounded-xl border border-slate-800 bg-[#0c1322] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Digital Copies</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.digitalCopiesAvailable}</div>
          <div className="text-[10px] text-emerald-500 font-sans">Soft copies attached</div>
        </div>

        <div className="intel-card p-4 rounded-xl border border-slate-800 bg-[#0c1322] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Digitization</span>
            <UploadCloud className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{stats.pendingDigitization}</div>
          <div className="text-[10px] text-amber-500 font-sans">Awaiting scan uploads</div>
        </div>

        <div className="intel-card p-4 rounded-xl border border-slate-800 bg-[#0c1322] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">{stats.underReview}</div>
          <div className="text-[10px] text-purple-500 font-sans">Evidentiary scrutiny</div>
        </div>

        <div className="intel-card p-4 rounded-xl border border-slate-800 bg-[#0c1322] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>SHA-256 Verified</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{stats.verified}</div>
          <div className="text-[10px] text-cyan-500 font-sans">Bitwise verified</div>
        </div>
      </div>

      {/* 3. Pending Digitization Work Queue Callout */}
      {pendingQueue.length > 0 && (
        <div className="intel-card p-4 border border-amber-500/30 rounded-xl bg-amber-950/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Pending Digitization Work Queue ({pendingQueue.length} items)</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Action Required: Upload Scans
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {pendingQueue.slice(0, 2).map((item) => (
              <div 
                key={item.id} 
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-bold">{item.id}</span>
                    <span className="text-slate-400 truncate font-semibold">{item.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Case: {item.caseId} • Registered: {item.collectedDate}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvidenceForUpload(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors whitespace-nowrap"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Soft Copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Search and Multifaceted Filters Bar */}
      <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0d1527] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Evidence ID, FIR, person, entity, police station, filename..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Multifaceted Filters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            
            {/* Case Filter */}
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Cases</option>
              {mockCases.map(c => (
                <option key={c.id} value={c.id}>{c.id}: {c.name}</option>
              ))}
            </select>

            {/* Evidence Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Evidence Types</option>
              <option value="CALL_RECORD">Call Records (CDR)</option>
              <option value="TRANSACTION_RECORD">Transaction Records</option>
              <option value="VEHICLE_ANPR_RECORD">Vehicle / ANPR Records</option>
              <option value="LOCATION_RECORD">Location Records</option>
              <option value="PHYSICAL_EVIDENCE">Physical Evidence</option>
              <option value="FORENSIC_REPORT">Forensic Lab Reports</option>
              <option value="DOCUMENT">Documents / Memos</option>
            </select>

            {/* Digital Copy Availability */}
            <select
              value={selectedDigitalCopy}
              onChange={(e) => setSelectedDigitalCopy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Copy Statuses</option>
              <option value="YES">Digital Copy Available</option>
              <option value="NO">Pending Digitization</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified (SHA-256)</option>
              <option value="DIGITAL_COPY_AVAILABLE">Digital Copy Available</option>
              <option value="REGISTERED">Registered Only</option>
              <option value="UNDER_REVIEW">Under Review</option>
            </select>

          </div>
        </div>
      </div>

      {/* 5. Master Evidence Table */}
      <div className="intel-card border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Evidence ID</th>
                <th className="py-3.5 px-4">Case & FIR</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Title & Evidentiary Value</th>
                <th className="py-3.5 px-4">Police Station / Dept</th>
                <th className="py-3.5 px-4">Collected Date</th>
                <th className="py-3.5 px-4">Soft Copy</th>
                <th className="py-3.5 px-4 text-center">SHA-256 Seal</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {evidenceList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FolderLock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-slate-300">No Evidence Records Found</div>
                    <div className="text-xs text-slate-500 mt-1">Try adjusting your search query or case filters.</div>
                  </td>
                </tr>
              ) : (
                evidenceList.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => setSelectedEvidenceForDetails(item)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {item.id}
                    </td>

                    {/* Case & FIR */}
                    <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                      <div className="text-white font-bold">{item.caseId}</div>
                      <div className="text-slate-500 text-[10px]">{item.firNumber}</div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadge(item.evidenceType)}`}>
                        {item.evidenceType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Title & Description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400 truncate leading-relaxed">
                        {item.description}
                      </div>
                      {item.relatedEntities.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {item.relatedEntities.slice(0, 2).map(ent => (
                            <span 
                              key={ent.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEntityProfile(ent.id);
                              }}
                              className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] text-slate-300 hover:text-blue-300 border border-slate-800 transition-colors"
                            >
                              {ent.label}
                            </span>
                          ))}
                          {item.relatedEntities.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-mono">+{item.relatedEntities.length - 2}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Police Station */}
                    <td className="py-3.5 px-4 text-slate-300 text-[11px] max-w-[160px] truncate" title={item.policeStation}>
                      {item.policeStation}
                    </td>

                    {/* Collected Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      <div>{item.collectedDate}</div>
                      <div className="text-[10px] text-slate-500">{item.collectedTime}</div>
                    </td>

                    {/* Soft Copy Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.hasDigitalCopy ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1">
                          <FileCheck2 className="w-3 h-3" />
                          <span>Attached</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Scan</span>
                        </span>
                      )}
                    </td>

                    {/* SHA-256 Seal */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {item.status === 'VERIFIED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1 font-mono">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[100px]" title={item.digitalDocument?.integrityHash}>
                          {item.digitalDocument?.integrityHash ? `${item.digitalDocument.integrityHash.slice(0, 8)}...` : 'Pending'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEvidenceForDetails(item)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold transition-colors text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        {!item.hasDigitalCopy && (
                          <button
                            onClick={() => setSelectedEvidenceForUpload(item)}
                            className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white font-semibold transition-colors text-[11px] inline-flex items-center gap-1"
                            title="Upload Scanned Soft Copy"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Upload</span>
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

      {/* 6. Modals */}
      {showRegisterModal && (
        <EvidenceRegistrationModal
          initialCaseId={selectedCaseFilter !== 'ALL' ? selectedCaseFilter : 'CASE-1024'}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegisterSuccess}
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
