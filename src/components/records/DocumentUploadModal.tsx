import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';
import { CaseDocumentType, caseRecordsService, CaseDocument } from '../../services/caseRecordsService';
import { useAuth } from '../../context/AuthContext';

interface DocumentUploadModalProps {
  caseId: string;
  firNumber?: string;
  isOpen?: boolean;
  onClose: () => void;
  onDocumentAdded?: (doc: CaseDocument) => void;
  onSuccess?: (doc?: CaseDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  caseId,
  firNumber = 'FIR-2026-DEL-0412',
  onClose,
  onDocumentAdded,
  onSuccess
}) => {
  const { user } = useAuth();

  const [documentType, setDocumentType] = useState<CaseDocumentType>('INVESTIGATION_REPORT');
  const [title, setTitle] = useState<string>('');
  const [policeStation, setPoliceStation] = useState<string>('Special Cyber & Financial Crimes Division, Central Delhi');
  const [content, setContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsProcessing(true);

    // Simulate realistic document NLP parsing
    await new Promise(r => setTimeout(r, 600));

    // Automated entity extraction simulation based on content mentions
    const extractedEntities = [];
    if (content.includes('Person_044') || content.toLowerCase().includes('arjun mehta') || content.toLowerCase().includes('rahul sharma')) {
      extractedEntities.push({ id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON' as const, roleInDocument: 'Named Subject' });
    }
    if (content.includes('Person_078') || content.toLowerCase().includes('ramesh patel')) {
      extractedEntities.push({ id: 'Person_078', label: 'Ramesh Patel', type: 'PERSON' as const, roleInDocument: 'Mentioned Counterparty' });
    }
    if (content.includes('Person_001') || content.toLowerCase().includes('vikram singhania')) {
      extractedEntities.push({ id: 'Person_001', label: 'Vikram Singhania', type: 'PERSON' as const, roleInDocument: 'Signatory' });
    }

    if (extractedEntities.length === 0) {
      extractedEntities.push({ id: 'Person_001', label: 'Vikram Singhania', type: 'PERSON' as const, roleInDocument: 'Extracted Entity' });
    }

    const newDoc = caseRecordsService.addDocument({
      caseId,
      firNumber,
      title: title.trim(),
      documentType,
      policeStation,
      investigatingOfficer: user?.name || 'Inspector Rajesh Verma',
      pageCount: Math.max(1, Math.ceil(content.length / 500)),
      summary: content.slice(0, 160) + '...',
      content: content.trim(),
      extractedEntities
    });

    setIsProcessing(false);
    if (onDocumentAdded) onDocumentAdded(newDoc);
    if (onSuccess) onSuccess(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-[#12304A] tracking-tight flex items-center gap-2 font-mono">
              <UploadCloud className="w-4 h-4 text-[#087E8B]" />
              <span>INGEST CASE RECORD / LEGAL DOCUMENT</span>
            </h3>
            <p className="text-xs text-[#64748B] font-sans">
              Case File: <strong className="text-[#087E8B] font-mono">{caseId}</strong> // FIR: {firNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Document Type:
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as CaseDocumentType)}
                className="w-full p-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] font-mono text-[#17212B] text-xs focus:outline-none focus:border-[#087E8B]"
              >
                <option value="FIR">First Information Report (FIR)</option>
                <option value="COMPLAINT">Formal Police Complaint</option>
                <option value="WITNESS_STATEMENT">Witness / Suspect Statement</option>
                <option value="INVESTIGATION_REPORT">Investigation / Progress Report</option>
                <option value="SEIZURE_MEMO">Seizure & Panchnama Memo</option>
                <option value="EVIDENCE_REPORT">Evidence Ledger Report</option>
                <option value="FORENSIC_REPORT">Forensic / Cyber Lab Report</option>
                <option value="CASE_DIARY">Case Diary Entry</option>
                <option value="COURT_DOCUMENT">Court / Prosecution Record</option>
                <option value="CLOSURE_REPORT">Final / Closure Report</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Issuing Police Station:
              </label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                placeholder="e.g. Central Cyber Division, New Delhi"
                className="w-full p-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#17212B] text-xs focus:outline-none focus:border-[#087E8B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Document Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surveillance Intercept Report — Location_A and Person_044"
              className="w-full p-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#17212B] text-xs focus:outline-none focus:border-[#087E8B] font-mono"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Document Text / Statement Content (Entities like Rahul Sharma, ACCT-8849-103, etc. are automatically resolved):
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter official police narrative, witness testimony, or seizure statement text..."
              className="w-full p-3 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] h-36 leading-relaxed"
              required
            />
          </div>

          <div className="p-3 rounded-md bg-[#E8F7F0] border border-[#A3E0C8] text-[11px] text-[#16805C] space-y-1">
            <div className="text-[#16805C] font-bold flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Automated Cryptographic Stamping:</span>
            </div>
            <p className="font-sans text-[#475569]">
              Upon ingestion, TraceNet will compute a SHA-256 integrity hash, index extracted entities, and update the case repository.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#12304A] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>{isProcessing ? 'Extracting Entities & Ingesting...' : 'Ingest Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
