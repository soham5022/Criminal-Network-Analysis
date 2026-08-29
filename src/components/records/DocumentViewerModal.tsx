import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Printer, 
  Layers, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Truck, 
  Lock, 
  ExternalLink,
  Info
} from 'lucide-react';
import { CaseDocument, ExtractedEntityReference } from '../../services/caseRecordsService';
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
      case 'PERSON': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'PHONE': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ACCOUNT': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOCATION': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'ORGANIZATION': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'VEHICLE': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl intel-card rounded-2xl border border-slate-700 bg-[#090f1e] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                {document.documentType} RECORD
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {document.id}</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight font-mono">
              {document.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shadow-sm"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Dual-Panel Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Panel: Legal Document Preview (8 Cols) */}
          <div className="lg:col-span-8 p-6 overflow-y-auto space-y-4 bg-[#060a14] border-r border-slate-800 text-xs font-mono">
            {/* Synthetic Document Disclaimer Banner */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>SYNTHETIC DEMO DOCUMENT — Authorized police record representation for SIH26189 prototype evaluation.</span>
            </div>

            {/* Document Content Box (Legal Paper Style) */}
            <div className="p-6 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4 text-slate-200 leading-relaxed shadow-inner">
              <div className="border-b border-slate-800 pb-3 text-center space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  STATE POLICE INVESTIGATION ARCHIVE
                </div>
                <div className="text-sm font-bold text-white uppercase">
                  {document.policeStation}
                </div>
                <div className="text-[10px] text-blue-400 font-mono">
                  CASE FILE: {document.caseId} // FIR: {document.firNumber}
                </div>
              </div>

              <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed">
                {document.content}
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Page 1 of {document.pageCount}</span>
                <span>Officer Signature: {document.investigatingOfficer}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Metadata & Clickable Extracted Entities (4 Cols) */}
          <div className="lg:col-span-4 p-5 overflow-y-auto space-y-5 bg-[#090f1e] text-xs">
            
            {/* Document Verification & Provenance */}
            <div className="p-3.5 rounded-xl bg-[#060a14] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>INTEGRITY & PROVENANCE</span>
              </span>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED (SHA-256)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Version:</span>
                  <span className="text-white">{document.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Created:</span>
                  <span className="text-slate-300">{document.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Station:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{document.policeStation}</span>
                </div>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-500 break-all font-mono">
                  Hash: <span className="text-slate-400">{document.integrityHash}</span>
                </div>
              </div>
            </div>

            {/* Extracted Entities List (Clickable!) */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
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
                    className="p-3 rounded-xl bg-[#060a14] border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono text-xs group-hover:text-blue-300">
                        {ent.id} ({ent.label})
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${getTypeBadge(ent.type)}`}>
                        {ent.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{ent.roleInDocument}</p>
                    <div className="text-[10px] text-blue-400 font-mono flex items-center gap-1 pt-0.5 group-hover:underline">
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
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Document Repository // Case File: <strong className="text-white">{document.caseId}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
