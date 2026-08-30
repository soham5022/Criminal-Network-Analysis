import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  Sparkles
} from 'lucide-react';
import { EvidenceRecord, evidenceRegistryService } from '../../services/evidenceRegistryService';

interface SoftCopyUploadModalProps {
  evidence: EvidenceRecord;
  onClose: () => void;
  onSuccess: (updated: EvidenceRecord) => void;
}

export const SoftCopyUploadModal: React.FC<SoftCopyUploadModalProps> = ({
  evidence,
  onClose,
  onSuccess
}) => {
  const [filename, setFilename] = useState<string>(
    `${evidence.id}_Scanned_SoftCopy_${new Date().toISOString().slice(0, 10)}.pdf`
  );
  const [officer, setOfficer] = useState<string>('Inspector Rajesh Verma');
  const [badge, setBadge] = useState<string>('MHA-INT-8902');
  const [content, setContent] = useState<string>(
    `CENTRAL POLICE CASE RECORDS & EVIDENCE REPOSITORY
SCANNED SOFT-COPY RECORD ATTACHMENT
EVIDENCE ID: ${evidence.id} // CASE ID: ${evidence.caseId} // FIR: ${evidence.firNumber}

EVIDENCE TITLE: ${evidence.title}
TYPE: ${evidence.evidenceType}
REGISTERED LOCATION: ${evidence.location}
POLICE STATION: ${evidence.policeStation}

DIGITIZATION SCAN NOTES:
This digital soft-copy represents an authorized, scanned forensic reproduction of registered physical/digital evidence item ${evidence.id}.
Integrity verified under Section 65B of Indian Evidence Act.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename.trim() || !content.trim()) {
      setError('Please provide a valid document filename and document content payload.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      const updated = evidenceRegistryService.uploadSoftCopy(evidence.id, {
        filename,
        content,
        officer,
        badge
      });

      setIsProcessing(false);
      if (updated) {
        onSuccess(updated);
      } else {
        setError('Failed to ingest digital soft copy. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{evidence.id}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DIGITIZATION WORKFLOW
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Upload Scanned Soft Copy</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpload} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Workflow Info Callout */}
          <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Physical Evidence → Digital Soft Copy Workflow</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Attaching this soft copy generates an immutable SHA-256 hash seal and increments the document version. It will be immediately available for authorized review and report inclusion.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Scanned File Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Ingesting Officer
              </label>
              <input
                type="text"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Badge / Service ID
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Document Text / Payload Preview <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Cryptographic Compliance Notice */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Bitwise Seal will be calculated automatically</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">Section 65B Compliant</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isProcessing ? 'Ingesting Soft Copy...' : 'Upload & Seal Soft Copy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
