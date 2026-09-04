import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  AlertCircle, 
  FolderLock,
  UploadCloud
} from 'lucide-react';
import { EvidenceRecord, EvidenceType, evidenceRegistryService } from '../../services/evidenceRegistryService';
import { mockCases } from '../../data/mockCases';
import { mockEntities } from '../../data/mockEntities';
import { EntityType } from '../../types';
import { FileUploadDropbox, UploadedFileItem } from '../common/FileUploadDropbox';

interface EvidenceRegistrationModalProps {
  onClose: () => void;
  onSuccess: (newRecord: EvidenceRecord) => void;
  initialCaseId?: string;
}

const EVIDENCE_TYPES: { id: EvidenceType; label: string }[] = [
  { id: 'DOCUMENT', label: 'Document / Memo' },
  { id: 'PHOTOGRAPH', label: 'Photograph / Surveillance Image' },
  { id: 'VIDEO', label: 'Video Surveillance Footage' },
  { id: 'AUDIO', label: 'Audio Wiretap Intercept' },
  { id: 'CALL_RECORD', label: 'Call Record (CDR Extract)' },
  { id: 'TRANSACTION_RECORD', label: 'Transaction Record (Banking / SWIFT)' },
  { id: 'LOCATION_RECORD', label: 'Location Record (Cell Tower / Beacon)' },
  { id: 'VEHICLE_ANPR_RECORD', label: 'Vehicle / ANPR Record' },
  { id: 'PHYSICAL_EVIDENCE', label: 'Physical Evidence Record' },
  { id: 'FORENSIC_REPORT', label: 'Forensic Lab Report' },
  { id: 'STATEMENT', label: 'Witness / Accused Statement' },
  { id: 'OTHER', label: 'Other Authorized Evidence' }
];

const POLICE_STATIONS = [
  'Special Cyber & Financial Crimes Division, Central Delhi',
  'Inter-State Crime Intelligence Bureau, NCR Zone',
  'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
  'Economic Offenses & Fraud Analytics Unit, State HQ',
  'Traffic & ANPR Surveillance Monitoring Cell'
];

export const EvidenceRegistrationModal: React.FC<EvidenceRegistrationModalProps> = ({
  onClose,
  onSuccess,
  initialCaseId = mockCases[0]?.id || 'CASE-1024'
}) => {
  const [caseId, setCaseId] = useState<string>(initialCaseId);
  const [firNumber, setFirNumber] = useState<string>(`FIR-2026-${initialCaseId.replace(/\D/g, '')}-01`);
  const [title, setTitle] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('DOCUMENT');
  const [description, setDescription] = useState<string>('');
  const [collectedDate, setCollectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [collectedTime, setCollectedTime] = useState<string>('14:30 IST');
  const [policeStation, setPoliceStation] = useState<string>(
    mockCases.find(c => c.id === initialCaseId)?.department || POLICE_STATIONS[0]
  );
  const [registeringOfficer, setRegisteringOfficer] = useState<string>(
    mockCases.find(c => c.id === initialCaseId)?.leadInvestigator || 'Inspector Rajesh Verma'
  );
  const [badgeNumber, setBadgeNumber] = useState<string>('MHA-INT-8902');
  const [location, setLocation] = useState<string>('Perimeter Checkpoint Security Office');
  const [source, setSource] = useState<string>('Official Panchnama Seizure');
  const [remarks, setRemarks] = useState<string>('Sealed and indexed in accordance with departmental evidentiary standards.');
  
  // Available entities for selected case
  const availableEntities = mockEntities.filter(e => e.associatedCaseIds.includes(caseId));
  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    availableEntities[0]?.id || mockEntities[0]?.id || ''
  );

  // Digital soft copy attachment toggle
  const [attachSoftCopy, setAttachSoftCopy] = useState<boolean>(false);
  const [initialFilename, setInitialFilename] = useState<string>('Evidence_Scan_Document.pdf');
  const [initialContent, setInitialContent] = useState<string>(
    `CENTRAL POLICE DIGITAL EVIDENCE REGISTRY
CERTIFIED SOFT COPY RECORD
CASE FILE: ${caseId}

EVIDENCE TITLE: Document scan attachment
REGISTRATION DATE: ${new Date().toISOString().slice(0, 10)}
REGISTERING OFFICER: Inspector Rajesh Verma (MHA-INT-8902)

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCaseChange = (newCaseId: string) => {
    setCaseId(newCaseId);
    setFirNumber(`FIR-2026-${newCaseId.replace(/\D/g, '')}-01`);
    const caseObj = mockCases.find(c => c.id === newCaseId);
    if (caseObj) {
      setPoliceStation(caseObj.department || POLICE_STATIONS[0]);
      setRegisteringOfficer(caseObj.leadInvestigator || 'Inspector Rajesh Verma');
    }
    const caseEnts = mockEntities.filter(e => e.associatedCaseIds.includes(newCaseId));
    if (caseEnts.length > 0) {
      setSelectedEntityId(caseEnts[0].id);
    }
    setInitialContent(
      `CENTRAL POLICE DIGITAL EVIDENCE REGISTRY\nCERTIFIED SOFT COPY RECORD\nCASE FILE: ${newCaseId}\n\nEVIDENCE TITLE: Document scan attachment\nREGISTRATION DATE: ${new Date().toISOString().slice(0, 10)}\n\n[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    );
  };

  const handleFilesDropped = (uploaded: UploadedFileItem[]) => {
    if (uploaded.length > 0) {
      const first = uploaded[0];
      setAttachSoftCopy(true);
      setInitialFilename(first.name);

      // Auto-populate title if investigator hasn't typed one
      if (!title.trim()) {
        const cleanName = first.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Auto-detect evidence type based on file extension and MIME
      const n = first.name.toLowerCase();
      const t = first.type.toLowerCase();
      if (t.startsWith('video/') || n.match(/\.(mp4|mov|avi|mkv)$/)) {
        setEvidenceType('VIDEO');
      } else if (t.startsWith('audio/') || n.match(/\.(mp3|wav|aac|m4a)$/)) {
        setEvidenceType('AUDIO');
      } else if (t.startsWith('image/') || n.match(/\.(jpg|jpeg|png|webp|bmp)$/)) {
        setEvidenceType('PHOTOGRAPH');
      } else if (n.includes('cdr') || n.includes('call')) {
        setEvidenceType('CALL_RECORD');
      } else if (n.includes('transaction') || n.includes('bank') || n.includes('swift')) {
        setEvidenceType('TRANSACTION_RECORD');
      } else if (n.includes('anpr') || n.includes('vehicle')) {
        setEvidenceType('VEHICLE_ANPR_RECORD');
      } else if (n.includes('forensic') || n.includes('lab') || n.includes('ballistic')) {
        setEvidenceType('FORENSIC_REPORT');
      } else if (n.endsWith('.pdf') || n.endsWith('.doc') || n.endsWith('.docx')) {
        setEvidenceType('DOCUMENT');
      }

      setInitialContent(
        first.textContent || 
        `CENTRAL POLICE DIGITAL EVIDENCE REGISTRY\nCERTIFIED DIGITAL SOFT COPY ATTACHMENT\nFILE: ${first.name}\nFILE SIZE: ${first.sizeFormatted}\nSHA-256 BITWISE SEAL: ${first.sha256Hash}\nCASE FILE: ${caseId} // FIR: ${firNumber}\n\nEVIDENCE TITLE: ${title || first.name}\nCOLLECTED DATE: ${collectedDate} ${collectedTime}\nREGISTERING OFFICER: ${registeringOfficer} (${badgeNumber})\nPOLICE STATION: ${policeStation}\nLOCATION: ${location}\n\n[CERTIFIED SECTION 65B INDIAN EVIDENCE ACT COMPLIANT RECORD]`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !source.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const relatedEnt = mockEntities.find(e => e.id === selectedEntityId) || availableEntities[0] || mockEntities[0];
    const relatedEntitiesList = relatedEnt ? [
      {
        id: relatedEnt.id,
        label: relatedEnt.label || relatedEnt.name || relatedEnt.id,
        type: relatedEnt.type as EntityType,
        role: 'Key Linked Subject'
      }
    ] : [];

    setTimeout(() => {
      const newRecord = evidenceRegistryService.registerEvidence({
        caseId,
        firNumber,
        title,
        evidenceType,
        description,
        collectedDate,
        collectedTime,
        policeStation,
        registeringOfficer,
        badgeNumber,
        relatedEntities: relatedEntitiesList,
        location,
        source,
        remarks,
        hasDigitalCopy: attachSoftCopy,
        initialFilename: attachSoftCopy ? initialFilename : undefined,
        initialFileContent: attachSoftCopy ? initialContent : undefined
      });

      setIsSubmitting(false);
      onSuccess(newRecord);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                OFFICIAL REGISTRATION
              </span>
              <h3 className="text-sm font-bold text-[#12304A]">Register Investigation Evidence</h3>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Case Association & FIR Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Case Association <span className="text-rose-600">*</span>
              </label>
              <select
                value={caseId}
                onChange={(e) => handleCaseChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              >
                {mockCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                FIR Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          {/* Row 2: Title & Evidence Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Evidence Title / Summary <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CCTV Optical Facial Capture at Checkpoint 4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Evidence Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              >
                {EVIDENCE_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Detailed Evidentiary Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe physical/digital context, acquisition parameters, and evidentiary value..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B] leading-relaxed"
            />
          </div>

          {/* Row 4: Police Station & Registering Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Registering Police Station / Dept
              </label>
              <select
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              >
                {POLICE_STATIONS.map((st, i) => (
                  <option key={i} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Registering Officer & Badge
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={registeringOfficer}
                  onChange={(e) => setRegisteringOfficer(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Date, Time, Location & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Collected Date
              </label>
              <input
                type="date"
                value={collectedDate}
                onChange={(e) => setCollectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Collected Time
              </label>
              <input
                type="text"
                value={collectedTime}
                onChange={(e) => setCollectedTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Source Instrument
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          {/* Row 6: Related Entity Linking */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Primary Related Subject / Entity
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
            >
              {mockEntities.map(ent => (
                <option key={ent.id} value={ent.id}>
                  {ent.label || ent.name || ent.id} ({ent.type} — ID: {ent.id})
                </option>
              ))}
            </select>
          </div>

          {/* Row 7: Attach Digital Soft Copy Option & Dropbox */}
          <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="attachCopy"
                  checked={attachSoftCopy}
                  onChange={(e) => setAttachSoftCopy(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#087E8B] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="attachCopy" className="text-xs font-semibold text-[#12304A] cursor-pointer flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span>Attach Certified Digital Soft Copy / Forensics File</span>
                </label>
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">
                {attachSoftCopy ? 'Digital File Attached' : 'Physical Only / Pending Upload'}
              </span>
            </div>

            {/* Drag and drop dropbox */}
            <div className="pt-1">
              <FileUploadDropbox
                onFilesChange={handleFilesDropped}
                maxFiles={1}
                allowMultiple={false}
                label="Drop evidence file here (CCTV, Audio, Image, PDF, CDR), or"
                sublabel="Automatic file type detection and real-time SHA-256 bitwise hash generation"
              />
            </div>

            {attachSoftCopy && (
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] animate-in fade-in">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#64748B]">
                    Attached File Name
                  </label>
                  <input
                    type="text"
                    value={initialFilename}
                    onChange={(e) => setInitialFilename(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#64748B]">
                    Document Forensic Certification Payload
                  </label>
                  <textarea
                    rows={3}
                    value={initialContent}
                    onChange={(e) => setInitialContent(e.target.value)}
                    className="w-full p-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>
            )}
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Evidence'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
