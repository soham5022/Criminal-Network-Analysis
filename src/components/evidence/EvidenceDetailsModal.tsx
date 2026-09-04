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
  CheckCircle2, 
  History, 
  FileCheck2 
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
        return 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]';
      case 'DIGITAL_COPY_AVAILABLE':
        return 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]';
      case 'UNDER_REVIEW':
        return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
        <div 
          className="w-full max-w-4xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Header Bar */}
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-[#087E8B]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#12304A]">{currentEvidence.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(currentEvidence.status)}`}>
                    {currentEvidence.status.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                    {currentEvidence.evidenceType.replace(/_/g, ' ')}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#12304A] truncate max-w-lg mt-0.5">
                  {currentEvidence.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Body Tabs / Sections */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            
            {/* Section A: Primary Metadata Grid */}
            <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#087E8B]" />
                <span>Primary Evidence Attributes</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-sans">
                <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Case ID</span>
                  <div 
                    onClick={() => {
                      setActiveCaseId(currentEvidence.caseId);
                      onClose();
                      navigateTo('case-details', { caseId: currentEvidence.caseId });
                    }}
                    className="font-mono text-[#087E8B] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{currentEvidence.caseId}</span>
                    <ExternalLink className="w-3 h-3 text-[#087E8B]" />
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">FIR Number</span>
                  <span className="font-mono text-[#12304A] font-bold">{currentEvidence.firNumber}</span>
                </div>

                <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Registration Station</span>
                  <span className="text-[#17212B] leading-snug">{currentEvidence.policeStation}</span>
                </div>

                <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Registering Officer</span>
                  <div className="text-[#17212B]">
                    <div>{currentEvidence.registeringOfficer}</div>
                    <div className="text-[10px] font-mono text-[#64748B]">{currentEvidence.badgeNumber}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Collected Timestamp</span>
                  <div className="font-mono text-[#17212B]">
                    {currentEvidence.collectedDate} • {currentEvidence.collectedTime}
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Location / Source</span>
                  <div className="text-[#17212B] truncate" title={currentEvidence.location}>
                    {currentEvidence.location}
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate" title={currentEvidence.source}>
                    Source: {currentEvidence.source}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Description & Evidentiary Value:</span>
                <p className="text-[#17212B] leading-relaxed font-sans">{currentEvidence.description}</p>
                {currentEvidence.remarks && (
                  <p className="text-[11px] text-[#64748B] italic font-sans pt-1 border-t border-[#E2E8F0]">
                    Remarks: {currentEvidence.remarks}
                  </p>
                )}
              </div>
            </div>

            {/* Section B: Digital Soft Copy & Viewer */}
            <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#087E8B]" />
                    <span>Digital Evidence Artifact & Viewer</span>
                  </span>
                  {/* Status distinction badge */}
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                    {currentEvidence.hasDigitalCopy ? 'STORED • PREVIEW AVAILABLE' : 'STORED • AWAITING DIGITIZATION'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                    Stored — Analysis pending
                  </span>
                </div>
                
                {currentEvidence.hasDigitalCopy && currentEvidence.digitalDocument ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-[11px] font-semibold transition-colors shadow-sm"
                      title="Download document text"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-[11px] font-semibold transition-colors shadow-sm"
                      title="Print certified soft copy"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#087E8B]" />
                      <span>Print Document</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-[11px] font-bold transition-all shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Soft Copy</span>
                  </button>
                )}
              </div>

              {currentEvidence.hasDigitalCopy && currentEvidence.digitalDocument ? (
                <div className="space-y-3">
                  {/* File Metadata Bar */}
                  <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#087E8B]" />
                      <span className="font-mono font-bold text-[#12304A]">{currentEvidence.digitalDocument.filename}</span>
                      <span className="text-[#64748B]">({currentEvidence.digitalDocument.fileSize})</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#64748B] font-mono text-[10px]">
                      <span>Uploaded: {currentEvidence.digitalDocument.uploadDate}</span>
                      <span>Version: {currentEvidence.digitalDocument.version}</span>
                    </div>
                  </div>

                  {/* Multimedia Preview Players based on Evidence Type */}
                  {currentEvidence.evidenceType === 'VIDEO' || currentEvidence.digitalDocument.filename.endsWith('.mp4') ? (
                    <div className="p-3 rounded-md bg-[#0F172A] border border-[#334155] text-white space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pb-1 border-b border-[#1E293B]">
                        <span className="flex items-center gap-1.5 font-mono text-[#38BDF8]">
                          <span>● REC</span> <span>CAM-04 (Terminal 3 Logistics Gate)</span>
                        </span>
                        <span className="font-mono">1080p @ 30fps • H.264</span>
                      </div>
                      <div className="relative aspect-video bg-[#020617] rounded flex items-center justify-center border border-[#1E293B] overflow-hidden group">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center mx-auto cursor-pointer transition-colors">
                            <span className="text-white text-lg font-bold pl-1">▶</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] font-mono">
                            Timecode: 2026-08-18 21:10:44 IST | Boom Barrier Entry
                          </p>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-[#94A3B8] bg-black/60 px-2 py-1 rounded font-mono">
                          <span>00:14 / 04:30</span>
                          <span>Vehicle MH-04-XX-2847 in frame</span>
                        </div>
                      </div>
                    </div>
                  ) : currentEvidence.evidenceType === 'CALL_RECORD' && currentEvidence.digitalDocument.filename.endsWith('.mp3') ? (
                    <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#12304A] flex items-center gap-1.5">
                          <span>Surveillance Audio Wiretap</span>
                        </span>
                        <span className="font-mono text-[11px] text-[#64748B]">Channel: Ch-1 (Inbound) • 16kHz Mono</span>
                      </div>
                      <div className="p-3 rounded bg-[#FFFFFF] border border-[#E2E8F0] flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full bg-[#087E8B] text-white flex items-center justify-center shrink-0 shadow-sm">
                          ▶
                        </button>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-[#E2E8F0] rounded flex items-center px-1 gap-0.5 overflow-hidden">
                            {Array.from({ length: 40 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1 bg-[#087E8B] rounded-full" 
                                style={{ height: `${Math.max(20, Math.sin(i * 0.4) * 90 + 30)}%` }} 
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                            <span>00:32</span>
                            <span>02:45</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Document Text / Forensic Dump Viewer */}
                  <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-xs text-[#17212B] max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                    {currentEvidence.digitalDocument.content}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-md bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-2">
                  <div className="p-3 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] w-12 h-12 mx-auto flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-[#12304A]">Digital Soft Copy Not Available</h4>
                  <p className="text-[11px] text-[#64748B] max-w-md mx-auto">
                    This physical evidence record is currently indexed in the registry. Authorized personnel can upload a high-resolution scan, audio, video, or data package to attach the digital copy.
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Digital Evidence</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section C: Digital Cryptographic Integrity Verification */}
            <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16805C]" />
                  <span>Digital Integrity Verification (SHA-256)</span>
                </span>
                
                <button
                  onClick={handleVerifyIntegrity}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E8F7F0] hover:bg-[#D1FAE5] text-[#16805C] border border-[#A3E0C8] text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Calculating Checksum...' : 'Verify Bitwise Integrity'}</span>
                </button>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#64748B] uppercase font-mono">Algorithm: SHA-256 Cryptographic Digest</span>
                    <div className="font-mono text-[#16805C] font-semibold text-[11px]">
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
                    className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] text-[10px] font-mono border border-[#CBD5E1] transition-colors"
                  >
                    {showFullHash ? 'Hide Full Hash' : 'View Full Hash'}
                  </button>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] text-[10px] text-[#64748B] font-sans leading-relaxed">
                  Notice: Digital integrity verification calculates the exact bitwise SHA-256 checksum against initial repository seal. Compliant with Section 65B procedures for digital evidence continuity.
                </div>
              </div>

              {verificationResult && (
                <div className="p-2.5 rounded-md bg-[#E8F7F0] border border-[#A3E0C8] text-[#16805C] text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#16805C] flex-shrink-0" />
                  <span>Bitwise integrity check successful: Cryptographic hash matches certified master copy (Verified at {new Date(verificationResult.timestamp).toLocaleTimeString()}).</span>
                </div>
              )}
            </div>

            {/* Section D: Chain of Custody Audit Stream */}
            <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#B7791F]" />
                  <span>Chain of Custody & Access History</span>
                </span>

                <button
                  onClick={() => {
                    onClose();
                    navigateTo('audit');
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A] text-[10px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-[#087E8B]" />
                  <span>View Full System Audit Trail</span>
                </button>
              </div>

              <div className="space-y-2">
                {currentEvidence.chainOfCustody.map((custody, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#12304A] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#087E8B]" />
                        <span>{custody.action}</span>
                      </div>
                      <div className="text-[#64748B] text-[11px]">
                        Officer: {custody.officer} <span className="font-mono text-[#94A3B8]">({custody.badge})</span>
                      </div>
                      {custody.notes && (
                        <div className="text-[11px] text-[#64748B] italic pt-0.5">{custody.notes}</div>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[#64748B] whitespace-nowrap">
                      {custody.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section E: Related Entities Deep-Link Bar */}
            <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7E22CE]" />
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
                    className="p-2.5 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] cursor-pointer flex items-center gap-2.5 transition-all group shadow-sm"
                  >
                    <div className="p-1 rounded bg-[#EBF8FF] text-[#2563A6]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[#12304A] font-bold text-xs group-hover:text-[#087E8B] transition-colors">
                        {ent.label}
                      </div>
                      <div className="text-[10px] font-mono text-[#64748B]">
                        {ent.role} • ID: {ent.id}
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#087E8B] transition-colors ml-1" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3. Footer Bar */}
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-sans">
              TraceNet Central Digital Evidence Registry • Authorized Access Only
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold transition-colors shadow-sm"
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
