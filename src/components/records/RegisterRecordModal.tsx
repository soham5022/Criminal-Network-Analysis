import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Building2, 
  ShieldCheck, 
  User, 
  FolderArchive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  caseRecordsService, 
  CaseDocument, 
  CaseDocumentType, 
  ExtractedEntityReference 
} from '../../services/caseRecordsService';
import { auditService } from '../../services/auditService';
import { mockCases } from '../../data/mockCases';
import { mockEntities } from '../../data/mockEntities';
import { useInvestigation } from '../../context/InvestigationContext';

interface RegisterRecordModalProps {
  initialCaseId?: string;
  onClose: () => void;
  onSuccess: (newDoc: CaseDocument) => void;
}

const DOCUMENT_TYPES: { id: CaseDocumentType; label: string; template: (caseId: string, fir: string) => string }[] = [
  { 
    id: 'FIR', 
    label: 'FIR (First Information Report)',
    template: (caseId, fir) => `CENTRAL POLICE DEPARTMENT — FIRST INFORMATION REPORT
UNDER SECTION 154 CrPC (CRIMINAL PROCEDURE CODE)

CASE NUMBER: ${caseId}
FIR NUMBER: ${fir}
DATE & TIME OF REGISTRATION: ${new Date().toLocaleDateString('en-GB')}, 10:00 IST
POLICE STATION: Special Crime Branch / Cyber Division

1. OFFENSE NATURE: Criminal Conspiracy, Financial Fraud & Identity Misuse (IPC Sec 120B, 420, 468, 471 & IT Act 66D).
2. COMPLAINANT: Sub-Inspector Surveillance Unit.
3. SUSPECTS / INVOLVED PERSONS: Rahul Sharma (Person_044), Vikram Singh (Person_001), Amit Patil (Person_078).
4. BRIEF OCCURRENCE DESCRIPTION:
Intelligence reports and telecommunication intercepts confirmed structured fund relays and unauthorized shell entity usage across transit nodes. Investigation initiated under formal supervisory mandate.`
  },
  { 
    id: 'CASE_DIARY', 
    label: 'Case Diary (Investigation Diary Entry)',
    template: (caseId, fir) => `POLICE CASE DIARY ENTRY — SECTION 172 CrPC
INVESTIGATION DOSSIER: ${caseId} (${fir})
DATE OF ENTRY: ${new Date().toLocaleDateString('en-GB')}

OFFICER RECORDING: Inspector Rajesh Verma (Badge: MHA-INT-8902)
INVESTIGATION PROCEEDINGS:
1. Conducted surveillance inquiry at primary staging coordinates.
2. Verified cell tower dump data confirming device presence during the critical communication window.
3. Registered certified evidentiary extractions into repository.
4. Next Steps: Submit summons notices to identified account signatories.`
  },
  { 
    id: 'WITNESS_STATEMENT', 
    label: 'Witness Statement (Sec 161 CrPC)',
    template: (caseId, fir) => `RECORD OF STATEMENT OF WITNESS
RECORDED UNDER SECTION 161 OF THE CODE OF CRIMINAL PROCEDURE, 1973

CASE REFERENCE: ${caseId} (${fir})
DATE OF EXAMINATION: ${new Date().toLocaleDateString('en-GB')}, 14:30 IST
PLACE OF RECORDING: Investigating Office

WITNESS NAME: Subhash Nambiar
OCCUPATION: Logistics Terminal Operations Manager
AGE / ADDRESS: 46 Years, Sector 4 Industrial Estate

STATEMENT:
"I am employed as the operations shift manager. On the date in question, vehicle MH-04-XX-2847 arrived at the terminal gate around 22:40 hours. The driver presented shipping consignment manifests under Meridian Logistics Pvt. Ltd. I identified Rahul Sharma accompanying the transport agent."`
  },
  { 
    id: 'SEIZURE_MEMO', 
    label: 'Seizure Memo (Panchnama)',
    template: (caseId, fir) => `PANCHNAMA / SEIZURE MEMO (SEC 100 CrPC)
CASE IDENTIFIER: ${caseId}
FIR REFERENCE: ${fir}
DATE & TIME: ${new Date().toLocaleDateString('en-GB')}, 18:15 IST
PLACE OF SEIZURE: Logistics Warehouse Premise, Gate 2

RECOVERY PARTICULARS:
1. One Samsung Galaxy Smartphone (IMEI: 864201048291042) containing burner SIM (+91 XXXXX 28471).
2. Two Bank Passbooks and Ledger slips associated with Account ending 4821.
3. Vehicle registration documents for Maruti Swift (MH-04-XX-2847).

SEALED AND ATTESTED BY INDEPENDENT WITNESSES (PANCHAS).`
  },
  { 
    id: 'FORENSIC_REPORT', 
    label: 'Forensic Lab Report',
    template: (caseId, fir) => `STATE FORENSIC SCIENCE LABORATORY
DIGITAL FORENSICS & CYBER EXTRACTION REPORT
CASE REFERENCE: ${caseId} (${fir})
REPORT ID: FSL-CYBER-2026-${Date.now().toString().slice(-4)}

EXAMINATION DETAILS:
1. Evidence Received: Physical SIM Card & Device Image extraction.
2. Extraction Methodology: Bit-stream image extraction via write-blocker hardware.
3. Cryptographic Verification: SHA-256 Checksum verified.
4. Key Findings: Recovered deleted SMS payloads and contact entries correlating with coordinated fund transfers.`
  },
  { 
    id: 'COMPLAINT', 
    label: 'Complaint / Written Information',
    template: (caseId, fir) => `FORMAL WRITTEN COMPLAINT
SUBMITTED TO: Station House Officer
REGARDING: Unlawful financial structuring and layered bank account transfers
CASE INQUIRY: ${caseId} (${fir})

The undersigned submits formal notification regarding structured fund movements observed below the mandatory reporting threshold, executed in rapid succession across relay accounts.`
  },
  { 
    id: 'INVESTIGATION_REPORT', 
    label: 'Investigation Progress Report',
    template: (caseId, fir) => `SPECIAL INVESTIGATION TEAM — PROGRESS REPORT
CASE: ${caseId} (${fir})
STAGE: Comprehensive Network Correlation & Lead Consolidation
REPORT DATE: ${new Date().toLocaleDateString('en-GB')}

EXECUTIVE SUMMARY:
Multi-source entity linkages have been established across communication logs, banking registers, and location surveillance. All bridge nodes have been indexed in the central network intelligence graph.`
  },
  { 
    id: 'OTHER', 
    label: 'Other Authorized Document',
    template: (caseId, fir) => `OFFICIAL CASE RECORD ATTACHMENT
CASE FILE: ${caseId}
REFERENCE: ${fir}
DATE: ${new Date().toLocaleDateString('en-GB')}

Official evidentiary attachment and documentation registered by the investigating team.`
  }
];

export const RegisterRecordModal: React.FC<RegisterRecordModalProps> = ({
  initialCaseId = 'CASE-1024',
  onClose,
  onSuccess
}) => {
  const { activeCaseId, setActiveCaseId } = useInvestigation();
  
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId || activeCaseId || 'CASE-1024');
  const [documentType, setDocumentType] = useState<CaseDocumentType>('FIR');
  const [title, setTitle] = useState<string>('First Information Report (Initial Filing)');
  const [firNumber, setFirNumber] = useState<string>('FIR-2026-DEL-0412');
  const [policeStation, setPoliceStation] = useState<string>('Special Cyber & Financial Crimes Division, Central Delhi');
  const [investigatingOfficer, setInvestigatingOfficer] = useState<string>('Inspector Rajesh Verma');
  const [summary, setSummary] = useState<string>('Formal legal document registered in case repository.');
  const [content, setContent] = useState<string>('');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('Person_044');
  const [pageCount, setPageCount] = useState<number>(3);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync FIR and Police station when case changes
  useEffect(() => {
    const caseObj = mockCases.find(c => c.id === selectedCaseId);
    if (caseObj) {
      setFirNumber(`FIR-2026-${selectedCaseId.replace(/\D/g, '')}-01`);
      setPoliceStation(caseObj.department || 'Central Crime Investigation Division');
      setInvestigatingOfficer(caseObj.leadInvestigator || 'Inspector Rajesh Verma');
    }
  }, [selectedCaseId]);

  // Update content template when doc type changes
  useEffect(() => {
    const matchedType = DOCUMENT_TYPES.find(d => d.id === documentType);
    if (matchedType) {
      setContent(matchedType.template(selectedCaseId, firNumber));
      setTitle(`${matchedType.label.split('(')[0].trim()} (${selectedCaseId})`);
    }
  }, [documentType, selectedCaseId, firNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !firNumber.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const relatedEnt = mockEntities.find(ent => ent.id === selectedEntityId);
    const extractedEntities: ExtractedEntityReference[] = relatedEnt ? [
      {
        id: relatedEnt.id,
        label: relatedEnt.label || relatedEnt.name || relatedEnt.id,
        type: relatedEnt.type,
        roleInDocument: 'Primary Subject Referenced'
      }
    ] : [
      {
        id: 'Person_044',
        label: 'Rahul Sharma',
        type: 'PERSON',
        roleInDocument: 'Key Named Person'
      }
    ];

    setTimeout(() => {
      // 1. Add document to case records service
      const newDoc = caseRecordsService.addDocument({
        caseId: selectedCaseId,
        firNumber,
        title,
        documentType,
        policeStation,
        investigatingOfficer,
        pageCount,
        content,
        summary: summary || title,
        extractedEntities
      });

      // 2. Log action in audit log
      auditService.logAction({
        action: 'UPLOADED_DOCUMENT',
        actionLabel: `Registered Official ${documentType} Document`,
        module: 'Documents',
        caseId: selectedCaseId,
        recordId: newDoc.id,
        recordType: 'DOCUMENT',
        recordLabel: newDoc.title,
        status: 'SUCCESS',
        details: `Investigator registered new ${documentType} record (${newDoc.id}) in case file ${selectedCaseId}. Integrity hash: ${newDoc.integrityHash.slice(0, 16)}...`
      });

      setActiveCaseId(selectedCaseId);
      setIsSubmitting(false);
      onSuccess(newDoc);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3] font-bold">
                OFFICIAL RECORD INGESTION
              </span>
              <h3 className="text-sm font-bold text-[#12304A]">Register Investigation Document</h3>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Target Case & Document Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Target Investigation Case <span className="text-[#C24141]">*</span>
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] font-semibold text-[#12304A] focus:outline-none focus:border-[#087E8B]"
              >
                {mockCases.map(c => (
                  <option key={c.id} value={c.id}>
                    📁 {c.id} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Document Category / Type <span className="text-[#C24141]">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as CaseDocumentType)}
                className="w-full px-3 py-2 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] font-semibold text-[#12304A] focus:outline-none focus:border-[#087E8B]"
              >
                {DOCUMENT_TYPES.map(dt => (
                  <option key={dt.id} value={dt.id}>
                    {dt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Reference FIR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Document Title / Subject <span className="text-[#C24141]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., First Information Report (Initial Filing)"
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] font-medium focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                FIR / Ref Number <span className="text-[#C24141]">*</span>
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                placeholder="e.g., FIR-2026-DEL-0412"
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] font-mono font-bold focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          {/* Station & Investigating Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Police Station / Authority Unit
              </label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Investigating Officer / Submitting Authority
              </label>
              <input
                type="text"
                value={investigatingOfficer}
                onChange={(e) => setInvestigatingOfficer(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          {/* Linked Subject / Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Primary Referenced Entity / Lead
              </label>
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] font-medium text-[#12304A] focus:outline-none focus:border-[#087E8B]"
              >
                {mockEntities.map(ent => (
                  <option key={ent.id} value={ent.id}>
                    {ent.label || ent.name || ent.id} ({ent.id} • {ent.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Page Count
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] font-mono focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          {/* Official Document Content Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Official Document Text / Narrative Content <span className="text-[#C24141]">*</span>
              </label>
              <span className="text-[10px] text-[#64748B]">Pre-populated police standard template</span>
            </div>
            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#087E8B] focus:bg-[#FFFFFF]"
            />
          </div>

          {/* Integrity Guarantee */}
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-[11px] text-[#475569]">
            <ShieldCheck className="w-4 h-4 text-[#087E8B] shrink-0" />
            <span>
              Upon registration, this document will be cryptographically stamped with a SHA-256 seal and indexed into the case timeline & audit trail.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Document...' : 'Register Record in Case File'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
