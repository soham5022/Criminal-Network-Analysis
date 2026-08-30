import React from 'react';
import { 
  X, 
  Printer, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Info
} from 'lucide-react';
import { CaseDocument } from '../../services/caseRecordsService';
import { useInvestigation } from '../../context/InvestigationContext';

interface DocumentViewerModalProps {
  document: CaseDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  const { openEntityProfile } = useInvestigation();

  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'PERSON': return 'bg-[#EBF8FF] text-[#12304A] border-[#BEE3F8]';
      case 'PHONE': return 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]';
      case 'ACCOUNT': return 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]';
      case 'LOCATION': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'ORGANIZATION': return 'bg-[#EEF2FF] text-[#234E70] border-[#C7D2FE]';
      case 'VEHICLE': return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
      default: return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087E8B] bg-[#E6F4F5] px-2 py-0.5 rounded border border-[#A7DFE3]">
                {document.documentType} RECORD
              </span>
              <span className="text-xs text-[#64748B] font-mono">ID: {document.id}</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#12304A] tracking-tight">
              {document.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Dual-Panel Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Panel: Legal Document Preview (8 Cols) */}
          <div className="lg:col-span-8 p-6 overflow-y-auto space-y-4 bg-[#F8FAFC] border-r border-[#E2E8F0] text-xs font-mono">
            {/* Synthetic Document Disclaimer Banner */}
            <div className="p-3 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[#B7791F] text-[11px] flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>SYNTHETIC DEMO DOCUMENT — Authorized police record representation for SIH26189 prototype evaluation.</span>
            </div>

            {/* Document Content Box (Legal Paper Style) */}
            <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] space-y-4 text-[#17212B] leading-relaxed shadow-sm">
              <div className="border-b border-[#E2E8F0] pb-3 text-center space-y-1">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">
                  STATE POLICE INVESTIGATION ARCHIVE
                </div>
                <div className="text-sm font-bold text-[#12304A] uppercase">
                  {document.policeStation}
                </div>
                <div className="text-[10px] text-[#087E8B] font-mono">
                  CASE FILE: {document.caseId} // FIR: {document.firNumber}
                </div>
              </div>

              <div className="whitespace-pre-wrap font-mono text-[11px] text-[#334155] leading-relaxed">
                {document.content}
              </div>

              <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                <span>Page 1 of {document.pageCount}</span>
                <span>Officer Signature: {document.investigatingOfficer}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Metadata & Clickable Extracted Entities (4 Cols) */}
          <div className="lg:col-span-4 p-5 overflow-y-auto space-y-5 bg-[#FFFFFF] text-xs">
            
            {/* Document Verification & Provenance */}
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16805C]" />
                <span>INTEGRITY & PROVENANCE</span>
              </span>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="text-[#16805C] font-bold">VERIFIED (SHA-256)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Version:</span>
                  <span className="text-[#12304A]">{document.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Created:</span>
                  <span className="text-[#17212B]">{document.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Station:</span>
                  <span className="text-[#17212B] truncate max-w-[150px]">{document.policeStation}</span>
                </div>
                <div className="pt-1 border-t border-[#E2E8F0] text-[10px] text-[#64748B] break-all font-mono">
                  Hash: <span className="text-[#475569]">{document.integrityHash}</span>
                </div>
              </div>
            </div>

            {/* Extracted Entities List (Clickable!) */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#087E8B]" />
                <span>Extracted Entities in Document ({document.extractedEntities.length})</span>
              </span>

              <div className="space-y-2">
                {document.extractedEntities.map((ent) => (
                  <div
                    key={ent.id}
                    onClick={() => {
                      onClose();
                      openEntityProfile(ent.id);
                    }}
                    className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#087E8B] hover:bg-[#E6F4F5] cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#12304A] font-mono text-xs group-hover:text-[#087E8B]">
                        {ent.id} ({ent.label})
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${getTypeBadge(ent.type)}`}>
                        {ent.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] font-sans">{ent.roleInDocument}</p>
                    <div className="text-[10px] text-[#087E8B] font-mono flex items-center gap-1 pt-0.5 group-hover:underline">
                      <span>Inspect 360° Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-mono">
            Document Repository // Case File: <strong className="text-[#12304A]">{document.caseId}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] font-semibold transition-colors shadow-sm"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
