import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  Radio, 
  FolderLock,
  UploadCloud
} from 'lucide-react';
import { EvidenceRecord, EvidenceType, evidenceRegistryService } from '../../services/evidenceRegistryService';
import { mockCases } from '../../data/mockCases';
import { mockEntities } from '../../data/mockEntities';
import { EntityType } from '../../types';

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
  initialCaseId = 'CASE-1024'
}) => {
  const [caseId, setCaseId] = useState<string>(initialCaseId);
  const [firNumber, setFirNumber] = useState<string>(
    initialCaseId === 'CASE-1024' ? 'FIR-2026-DEL-0412' : `FIR-2026-${initialCaseId.replace(/\D/g, '')}-01`
  );
  const [title, setTitle] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('DOCUMENT');
  const [description, setDescription] = useState<string>('');
  const [collectedDate, setCollectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [collectedTime, setCollectedTime] = useState<string>('14:30 IST');
  const [policeStation, setPoliceStation] = useState<string>(POLICE_STATIONS[0]);
  const [registeringOfficer, setRegisteringOfficer] = useState<string>('Inspector Rajesh Verma');
  const [badgeNumber, setBadgeNumber] = useState<string>('MHA-INT-8902');
  const [location, setLocation] = useState<string>('Thane West Logistics Hub');
  const [source, setSource] = useState<string>('Perimeter Checkpoint Gate 2');
  const [remarks, setRemarks] = useState<string>('Sealed and indexed in accordance with departmental evidentiary standards.');
  
  // Selected related entity
  const [selectedEntityId, setSelectedEntityId] = useState<string>('Person_044');

  // Digital soft copy attachment toggle
  const [attachSoftCopy, setAttachSoftCopy] = useState<boolean>(false);
  const [initialFilename, setInitialFilename] = useState<string>('Evidence_Scan_Document.pdf');
  const [initialContent, setInitialContent] = useState<string>(
    `CENTRAL POLICE DIGITAL EVIDENCE REGISTRY
CERTIFIED SOFT COPY RECORD
CASE FILE: CASE-1024

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !source.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const relatedEnt = mockEntities.find(e => e.id === selectedEntityId);
    const relatedEntitiesList = relatedEnt ? [
      {
        id: relatedEnt.id,
        label: relatedEnt.label || relatedEnt.name || relatedEnt.id,
        type: relatedEnt.type as EntityType,
        role: 'Key Linked Subject'
      }
    ] : [
      {
        id: 'Person_044',
        label: 'Rahul Sharma',
        type: 'PERSON' as EntityType,
        role: 'Key Linked Subject'
      }
    ];

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-2xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                OFFICIAL REGISTRATION
              </span>
              <h3 className="text-sm font-bold text-white">Register Investigation Evidence</h3>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Case Association & FIR Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Case Association <span className="text-rose-400">*</span>
              </label>
              <select
                value={caseId}
                onChange={(e) => handleCaseChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              >
                {mockCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                FIR Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Title & Evidence Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Evidence Title / Summary <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CCTV Optical Facial Capture at Checkpoint 4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Evidence Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {EVIDENCE_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Detailed Evidentiary Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe physical/digital context, acquisition parameters, and evidentiary value..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Row 4: Police Station & Registering Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Registering Police Station / Dept
              </label>
              <select
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {POLICE_STATIONS.map((st, i) => (
                  <option key={i} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Registering Officer & Badge
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={registeringOfficer}
                  onChange={(e) => setRegisteringOfficer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Date, Time, Location & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Collected Date
              </label>
              <input
                type="date"
                value={collectedDate}
                onChange={(e) => setCollectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Collected Time
              </label>
              <input
                type="text"
                value={collectedTime}
                onChange={(e) => setCollectedTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Source Instrument
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 6: Related Entity Linking */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Primary Related Subject / Entity
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {mockEntities.map(ent => (
                <option key={ent.id} value={ent.id}>
                  {ent.label || ent.name || ent.id} ({ent.type} — ID: {ent.id})
                </option>
              ))}
            </select>
          </div>

          {/* Row 7: Attach Digital Soft Copy Option */}
          <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="attachCopy"
                  checked={attachSoftCopy}
                  onChange={(e) => setAttachSoftCopy(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="attachCopy" className="text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attach Scanned Digital Soft Copy Immediately</span>
                </label>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {attachSoftCopy ? 'Digital Copy Attached' : 'Pending Digitization'}
              </span>
            </div>

            {attachSoftCopy && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80 animate-in fade-in">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={initialFilename}
                    onChange={(e) => setInitialFilename(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">
                    Document Text Payload
                  </label>
                  <textarea
                    rows={3}
                    value={initialContent}
                    onChange={(e) => setInitialContent(e.target.value)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
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
