import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import { EvidenceRecord, evidenceRegistryService } from '../../services/evidenceRegistryService';
import { FileUploadDropbox, UploadedFileItem } from '../common/FileUploadDropbox';

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#087E8B]">{evidence.id}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                  DIGITIZATION WORKFLOW
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#12304A]">Upload Scanned Soft Copy</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpload} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Workflow Info Callout */}
          <div className="p-3.5 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] space-y-1.5">
            <div className="text-[11px] font-semibold text-[#12304A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Physical Evidence → Digital Soft Copy Workflow</span>
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed font-sans">
              Attaching this soft copy generates an immutable SHA-256 hash seal and increments the document version. It will be immediately available for authorized review and report inclusion.
            </p>
          </div>

          {/* Drag & Drop File Upload */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Attach Scanned File / Forensic Artifact
            </label>
            <FileUploadDropbox
              onFilesChange={(files: UploadedFileItem[]) => {
                if (files.length > 0) {
                  const first = files[0];
                  setFilename(first.name);
                  setContent(
                    first.textContent || 
                    `CENTRAL POLICE CASE RECORDS & EVIDENCE REPOSITORY\nSCANNED SOFT-COPY RECORD ATTACHMENT\nFILE: ${first.name}\nSIZE: ${first.sizeFormatted}\nSHA-256 CHECK-SUM: ${first.sha256Hash}\nEVIDENCE ID: ${evidence.id} // CASE ID: ${evidence.caseId} // FIR: ${evidence.firNumber}\n\nEVIDENCE TITLE: ${evidence.title}\nTYPE: ${evidence.evidenceType}\nREGISTERED LOCATION: ${evidence.location}\nPOLICE STATION: ${evidence.policeStation}\n\nDIGITIZATION FORENSIC SCAN NOTES:\nAttached digital copy verified under Section 65B of Indian Evidence Act.\nSHA-256 integrity seal applied automatically.\n\n[CERTIFIED POLICE DIGITAL REPOSITORY ATTACHMENT]`
                  );
                }
              }}
              maxFiles={1}
              allowMultiple={false}
              label="Drop scanned soft-copy or forensic file here, or"
              sublabel="Upload PDF, Image, Video, Audio, or Text (Auto SHA-256 hash applied)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Scanned File Name <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Ingesting Officer
              </label>
              <input
                type="text"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Badge / Service ID
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Document Text / Payload Preview <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B] leading-relaxed"
            />
          </div>

          {/* Cryptographic Compliance Notice */}
          <div className="p-3 rounded-md bg-[#E8F7F0] border border-[#A3E0C8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#16805C]">
              <ShieldCheck className="w-4 h-4 text-[#16805C]" />
              <span>SHA-256 Bitwise Seal will be calculated automatically</span>
            </div>
            <span className="font-mono text-[10px] text-[#16805C] font-semibold">Section 65B Compliant</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
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
