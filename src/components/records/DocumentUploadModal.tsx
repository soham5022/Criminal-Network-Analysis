import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  FileSpreadsheet 
} from 'lucide-react';
import { CaseDocumentType, caseRecordsService, CaseDocument } from '../../services/caseRecordsService';
import { useAuth } from '../../context/AuthContext';

interface DocumentUploadModalProps {
  caseId: string;
  firNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: CaseDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  caseId,
  firNumber,
  isOpen,
  onClose,
  onDocumentAdded
}) => {
  const { user } = useAuth();

  const [documentType, setDocumentType] = useState<CaseDocumentType>('INVESTIGATION_REPORT');
  const [title, setTitle] = useState<string>('');
  const [policeStation, setPoliceStation] = useState<string>('Special Cyber & Financial Crimes Division, Central Delhi');
  const [content, setContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsProcessing(true);

    // Simulate realistic document NLP parsing
    await new Promise(r => setTimeout(r, 600));

    // Automated entity extraction simulation based on content mentions
    const extractedEntities = [];
    if (content.includes('Person_044') || content.toLowerCase().includes('arjun mehta')) {
      extractedEntities.push({ id: 'Person_044', label: 'Arjun Mehta', type: 'PERSON' as const, roleInDocument: 'Named Subject' });
    }
    if (content.includes('Person_078') || content.toLowerCase().includes('ramesh patel')) {
      extractedEntities.push({ id: 'Person_078', label: 'Ramesh Patel', type: 'PERSON' as const, roleInDocument: 'Mentioned Counterparty' });
    }
    if (content.includes('Person_001') || content.toLowerCase().includes('vikram singhania')) {
      extractedEntities.push({ id: 'Person_001', label: 'Vikram Singhania', type: 'PERSON' as const, roleInDocument: 'Signatory' });
    }
    if (content.includes('Account_103')) {
      extractedEntities.push({ id: 'Account_103', label: 'ACCT-8849-103', type: 'ACCOUNT' as const, roleInDocument: 'Relay Account' });
    }
    if (content.includes('Location_A')) {
      extractedEntities.push({ id: 'Location_A', label: 'Sector 4 Logistics Hub', type: 'LOCATION' as const, roleInDocument: 'Incident Location' });
    }
    if (content.includes('Vehicle_017')) {
      extractedEntities.push({ id: 'Vehicle_017', label: 'DL-08-CC-9017', type: 'VEHICLE' as const, roleInDocument: 'Observed Asset' });
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
    onDocumentAdded(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl intel-card rounded-2xl border border-slate-700 bg-[#090f1e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 font-mono">
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>INGEST CASE RECORD / LEGAL DOCUMENT</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Case File: <strong className="text-blue-400 font-mono">{caseId}</strong> // FIR: {firNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Document Type:
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as CaseDocumentType)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
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
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Issuing Police Station:
              </label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                placeholder="e.g. Central Cyber Division, New Delhi"
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Document Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surveillance Intercept Report — Location_A and Person_044"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Document Text / Statement Content (Entities like Person_044, Location_A, etc. are automatically resolved):
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter official police narrative, witness testimony, or seizure statement text..."
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-36"
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-[#060a14] border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Automated Cryptographic Stamping:</span>
            </div>
            <p className="font-sans">
              Upon ingestion, TraceNet will compute a SHA-256 integrity hash, index extracted entities, and update the case repository.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
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
