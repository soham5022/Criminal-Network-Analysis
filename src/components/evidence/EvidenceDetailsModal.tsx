import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Download, 
  Printer, 
  UploadCloud, 
  ExternalLink, 
  User, 
  Clock, 
  MapPin, 
  Building2, 
  Radio, 
  Layers, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Eye,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { EvidenceRecord, evidenceRegistryService } from '../../services/evidenceRegistryService';
import { useInvestigation } from '../../context/InvestigationContext';
import { SoftCopyUploadModal } from './SoftCopyUploadModal';

interface EvidenceDetailsModalProps {
  evidence: EvidenceRecord;
  onClose: () => void;
  onUpdate: (updated: EvidenceRecord) => void;
}

export const EvidenceDetailsModal: React.FC<EvidenceDetailsModalProps> = ({
  evidence,
  onClose,
  onUpdate
}) => {
  const { navigateTo, openEntityProfile, setActiveCaseId } = useInvestigation();
  const [currentEvidence, setCurrentEvidence] = useState<EvidenceRecord>(evidence);
  const [showFullHash, setShowFullHash] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; timestamp: string } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showPrintNotification, setShowPrintNotification] = useState<boolean>(false);

  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = evidenceRegistryService.verifyIntegrity(currentEvidence.id);
      setIsVerifying(false);
      if (res) {
        setVerificationResult({ verified: true, timestamp: res.timestamp });
        const refreshed = evidenceRegistryService.getEvidenceById(currentEvidence.id);
        if (refreshed) {
          setCurrentEvidence(refreshed);
          onUpdate(refreshed);
        }
      }
    }, 600);
  };

  const handleDownload = () => {
    if (!currentEvidence.digitalDocument) return;
    const blob = new Blob([currentEvidence.digitalDocument.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentEvidence.digitalDocument.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setShowPrintNotification(true);
    setTimeout(() => setShowPrintNotification(false), 3000);
    window.print();
  };

  const handleSoftCopySuccess = (updated: EvidenceRecord) => {
    setCurrentEvidence(updated);
    onUpdate(updated);
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'DIGITAL_COPY_AVAILABLE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'UNDER_REVIEW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
        <div 
          className="w-full max-w-4xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Header Bar */}
          <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{currentEvidence.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(currentEvidence.status)}`}>
                    {currentEvidence.status.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                    {currentEvidence.evidenceType.replace(/_/g, ' ')}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-lg mt-0.5">
                  {currentEvidence.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Body Tabs / Sections */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            
            {/* Section A: Primary Metadata Grid */}
            <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#090e1a] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Primary Evidence Attributes</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-sans">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Case ID</span>
                  <div 
                    onClick={() => {
                      setActiveCaseId(currentEvidence.caseId);
                      onClose();
                      navigateTo('case-details', { caseId: currentEvidence.caseId });
                    }}
                    className="font-mono text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{currentEvidence.caseId}</span>
                    <ExternalLink className="w-3 h-3 text-blue-500" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">FIR Number</span>
                  <span className="font-mono text-white font-bold">{currentEvidence.firNumber}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Registration Station</span>
                  <span className="text-slate-300 leading-snug">{currentEvidence.policeStation}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Registering Officer</span>
                  <div className="text-slate-200">
                    <div>{currentEvidence.registeringOfficer}</div>
                    <div className="text-[10px] font-mono text-slate-500">{currentEvidence.badgeNumber}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Collected Timestamp</span>
                  <div className="font-mono text-slate-300">
                    {currentEvidence.collectedDate} • {currentEvidence.collectedTime}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Location / Source</span>
                  <div className="text-slate-300 truncate" title={currentEvidence.location}>
                    {currentEvidence.location}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate" title={currentEvidence.source}>
                    Source: {currentEvidence.source}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Description & Evidentiary Value:</span>
                <p className="text-slate-300 leading-relaxed font-sans">{currentEvidence.description}</p>
                {currentEvidence.remarks && (
                  <p className="text-[11px] text-slate-400 italic font-sans pt-1 border-t border-slate-800/50">
                    Remarks: {currentEvidence.remarks}
                  </p>
                )}
              </div>
            </div>

            {/* Section B: Digital Soft Copy & Viewer */}
            <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#090e1a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Digital Soft Copy Repository</span>
                </span>
                
                {currentEvidence.hasDigitalCopy && currentEvidence.digitalDocument ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                      title="Download document text"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                      title="Print certified soft copy"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-md"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Soft Copy</span>
                  </button>
                )}
              </div>

              {currentEvidence.hasDigitalCopy && currentEvidence.digitalDocument ? (
                <div className="space-y-3">
                  {/* File Metadata Bar */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="font-mono font-bold text-white">{currentEvidence.digitalDocument.filename}</span>
                      <span className="text-slate-500">({currentEvidence.digitalDocument.fileSize})</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px]">
                      <span>Uploaded: {currentEvidence.digitalDocument.uploadDate}</span>
                      <span>Version: {currentEvidence.digitalDocument.version}</span>
                    </div>
                  </div>

                  {/* Document Text Viewer */}
                  <div className="p-4 rounded-lg bg-[#060a12] border border-slate-800 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                    {currentEvidence.digitalDocument.content}
                  </div>

                  {/* Previous Versions If Any */}
                  {currentEvidence.previousVersions.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Previous Ingestion Versions:</span>
                      {currentEvidence.previousVersions.map((ver, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-400 py-0.5">
                          <span>{ver.filename} ({ver.version})</span>
                          <span className="font-mono text-[10px]">{ver.uploadDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-lg bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
                  <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 w-12 h-12 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Digital Soft Copy Not Available</h4>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                    This physical evidence record is currently indexed in the registry. Authorized personnel can upload a high-resolution scan to attach the digital copy.
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Scanned Copy</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section C: Digital Cryptographic Integrity Verification */}
            <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#090e1a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Digital Integrity Verification (SHA-256)</span>
                </span>
                
                <button
                  onClick={handleVerifyIntegrity}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Calculating Checksum...' : 'Verify Bitwise Integrity'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Algorithm: SHA-256 Cryptographic Digest</span>
                    <div className="font-mono text-emerald-400 text-[11px]">
                      {showFullHash ? (
                        <span className="break-all">
                          {currentEvidence.digitalDocument?.integrityHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78524821'}
                        </span>
                      ) : (
                        <span>
                          {currentEvidence.digitalDocument?.integrityHash 
                            ? `${currentEvidence.digitalDocument.integrityHash.slice(0, 16)}...${currentEvidence.digitalDocument.integrityHash.slice(-12)}`
                            : 'e3b0c44298fc1c14...91b78524821'}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFullHash(!showFullHash)}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700 transition-colors"
                  >
                    {showFullHash ? 'Hide Full Hash' : 'View Full Hash'}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-sans leading-relaxed">
                  Notice: Digital integrity verification calculates the exact bitwise SHA-256 checksum against initial repository seal. Compliant with Section 65B procedures for digital evidence continuity.
                </div>
              </div>

              {verificationResult && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Bitwise integrity check successful: Cryptographic hash matches certified master copy (Verified at {new Date(verificationResult.timestamp).toLocaleTimeString()}).</span>
                </div>
              )}
            </div>

            {/* Section D: Chain of Custody Audit Stream */}
            <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#090e1a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chain of Custody & Access History</span>
                </span>

                <button
                  onClick={() => {
                    onClose();
                    navigateTo('audit');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>View Full System Audit Trail</span>
                </button>
              </div>

              <div className="space-y-2">
                {currentEvidence.chainOfCustody.map((custody, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>{custody.action}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Officer: {custody.officer} <span className="font-mono text-slate-500">({custody.badge})</span>
                      </div>
                      {custody.notes && (
                        <div className="text-[11px] text-slate-500 italic pt-0.5">{custody.notes}</div>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                      {custody.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section E: Related Entities Deep-Link Bar */}
            <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#090e1a] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Linked Entities (Click to View 360° Profile)</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {currentEvidence.relatedEntities.map((ent) => (
                  <div
                    key={ent.id}
                    onClick={() => {
                      onClose();
                      openEntityProfile(ent.id);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 cursor-pointer flex items-center gap-2.5 transition-all group"
                  >
                    <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs group-hover:text-blue-300 transition-colors">
                        {ent.label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {ent.role} • ID: {ent.id}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors ml-1" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3. Footer Bar */}
          <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-sans">
              TraceNet Central Digital Evidence Registry • Authorized Access Only
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Upload Soft Copy Modal */}
      {showUploadModal && (
        <SoftCopyUploadModal
          evidence={currentEvidence}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleSoftCopySuccess}
        />
      )}
    </>
  );
};
