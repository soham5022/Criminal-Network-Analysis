import React, { useState } from 'react';
import { 
  FolderPlus, 
  X, 
  Sparkles, 
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Shield,
  User,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  ArrowRight
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';
import { auditService } from '../../services/auditService';
import { timelineService } from '../../services/timelineService';
import { Case, CasePriority, CaseStatus } from '../../types';

export const CreateCaseModal: React.FC = () => {
  const { 
    isCreateCaseModalOpen, 
    setIsCreateCaseModalOpen, 
    navigateTo, 
    setActiveCaseId,
    setIsIngestionModalOpen
  } = useInvestigation();
  const { user } = useAuth();

  // Section 1: Case Information
  const [name, setName] = useState<string>('');
  const [firNumber, setFirNumber] = useState<string>(`FIR-2026-${Math.floor(100 + Math.random() * 900)}/DEL`);
  const [caseCategory, setCaseCategory] = useState<string>('Cyber Fraud & Financial Layering');
  const [offenceType, setOffenceType] = useState<string>('IPC Sec 420, 468, 471, 120B & IT Act 66D');
  const [description, setDescription] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>('14:30');
  const [incidentLocation, setIncidentLocation] = useState<string>('Terminal 3 Cargo Area / Connaught Place Transit Hub');
  const [policeStation, setPoliceStation] = useState<string>('Special Cyber & Financial Crimes Division, Central Delhi');
  const [jurisdiction, setJurisdiction] = useState<string>('Central Police District, Delhi NCT');
  const [priority, setPriority] = useState<CasePriority>('HIGH');
  const [status, setStatus] = useState<CaseStatus>('ACTIVE');

  // Section 2: Investigation Details
  const [leadInvestigator, setLeadInvestigator] = useState<string>(user?.name || 'Inspector Rajesh Verma');
  const [supportingOfficers, setSupportingOfficers] = useState<string>('SI Amit Patil, ASI Sunita Rao');
  const [department, setDepartment] = useState<string>('Special Operations & Intelligence Wing');
  const [caseReferenceNumber, setCaseReferenceNumber] = useState<string>(`MHA-INT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [notes, setNotes] = useState<string>('Priority multi-source investigation initiated following supervisory intelligence advisory.');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdCase, setCreatedCase] = useState<Case | null>(null);

  if (!isCreateCaseModalOpen) return null;

  const resetForm = () => {
    setName('');
    setDescription('');
    setCreatedCase(null);
    setErrorMsg(null);
  };

  const handleClose = () => {
    resetForm();
    setIsCreateCaseModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Case Title / Operation Name is required.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const newCase = await caseService.createCase({
        name,
        description: description || `Formal criminal investigation into ${caseCategory}. Incident registered at ${incidentLocation}.`,
        priority,
        lead_investigator: leadInvestigator,
        tags: [caseCategory, offenceType.split('&')[0].trim()]
      });

      // Add timeline event
      timelineService.addTimelineEvent({
        caseId: newCase.id,
        timestamp: `${incidentDate} ${incidentTime}`,
        entityId: 'SYSTEM',
        entityType: 'EVENT',
        eventType: 'CASE_REGISTERED',
        description: `New investigation dossier ${newCase.id} registered under ${firNumber} at ${policeStation}. Priority: ${priority}.`,
        confidence: 1.0,
        significance: 'CRITICAL',
        sourceType: 'POLICE_RECORD',
        caseCode: newCase.id
      });

      // Audit log entry
      auditService.logAction({
        action: 'CREATED_CASE',
        actionLabel: 'Registered New Case File',
        module: 'Cases',
        caseId: newCase.id,
        recordId: newCase.id,
        recordType: 'CASE',
        recordLabel: newCase.name,
        status: 'SUCCESS',
        details: `Investigator registered case ${newCase.id} (${newCase.name}), FIR: ${firNumber}, Police Station: ${policeStation}, Priority: ${priority}.`,
        user: user ? {
          id: user.id,
          name: user.name,
          badge_number: user.badge_number,
          role: user.role
        } : undefined
      });

      setActiveCaseId(newCase.id);
      setCreatedCase(newCase);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create case.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWorkspace = () => {
    if (!createdCase) return;
    const caseId = createdCase.id;
    handleClose();
    navigateTo('case-details', { caseId, tab: 'overview' });
  };

  const handleAddRecords = () => {
    if (!createdCase) return;
    const caseId = createdCase.id;
    handleClose();
    navigateTo('case-records');
  };

  const handleAddEvidence = () => {
    if (!createdCase) return;
    const caseId = createdCase.id;
    handleClose();
    navigateTo('evidence');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-[#087E8B]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider">
                Register New Criminal Investigation Case
              </h3>
              <p className="text-xs text-[#64748B] font-mono">
                Official Law Enforcement Filing Protocol • TraceNet (SIH26189)
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {createdCase ? (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="p-4 rounded-lg bg-[#E8F7F0] border border-[#A3E0C8] text-[#16805C] space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#A3E0C8] text-[#16805C] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#12304A]">
                Case Successfully Registered in Registry
              </h4>
              <p className="text-xs text-[#16805C] font-mono font-bold">
                Unique Case Identifier Assigned: {createdCase.id}
              </p>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Investigation file has been initialized into the Central Case Repository, Knowledge Graph directory, and Security Audit Trail.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-[#64748B]">Case Title:</span> <span className="font-bold text-[#12304A]">{createdCase.name}</span></div>
                <div><span className="text-[#64748B]">FIR Number:</span> <span className="font-mono font-bold text-[#12304A]">{firNumber}</span></div>
                <div><span className="text-[#64748B]">Investigating Officer:</span> <span className="font-medium text-[#12304A]">{leadInvestigator}</span></div>
                <div><span className="text-[#64748B]">Police Station:</span> <span className="font-medium text-[#12304A]">{policeStation}</span></div>
              </div>
            </div>

            {/* Direct Workflow Next Steps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Immediate Investigative Actions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleAddRecords}
                  className="p-3 rounded-lg border border-[#CBD5E1] hover:border-[#087E8B] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-left transition-all group shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#087E8B] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-[#12304A]">Register Record</div>
                  <div className="text-[10px] text-[#64748B]">Add FIR, Diary, or Statements</div>
                </button>

                <button
                  onClick={handleAddEvidence}
                  className="p-3 rounded-lg border border-[#CBD5E1] hover:border-[#087E8B] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-left transition-all group shadow-sm"
                >
                  <UploadCloud className="w-4 h-4 text-[#2563A6] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-[#12304A]">Add Evidence</div>
                  <div className="text-[10px] text-[#64748B]">Attach CCTV, Audio, or Files</div>
                </button>

                <button
                  onClick={handleOpenWorkspace}
                  className="p-3 rounded-lg border border-[#087E8B] bg-[#E6F4F5] hover:bg-[#d8eff1] text-left transition-all group shadow-sm"
                >
                  <ArrowRight className="w-4 h-4 text-[#087E8B] mb-1 group-hover:translate-x-1 transition-transform" />
                  <div className="text-xs font-bold text-[#087E8B]">Open Dossier</div>
                  <div className="text-[10px] text-[#475569]">Navigate to Case Overview</div>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={handleOpenWorkspace}
                className="px-5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold tracking-wide shadow-sm"
              >
                Proceed to Case Dossier →
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Section Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#C24141]">
                <AlertCircle className="w-4 h-4 text-[#C24141] shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SECTION 1: CASE INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">
                  1. Case Information
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">• Statutory Offence & Jurisdiction</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Case Title / Operation Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Operation Bluefin — Hawala Smuggling Relay"
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    FIR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={firNumber}
                    onChange={(e) => setFirNumber(e.target.value)}
                    placeholder="FIR-2026-XXX/DEL"
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Case Category
                  </label>
                  <select
                    value={caseCategory}
                    onChange={(e) => setCaseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  >
                    <option value="Cyber Fraud & Financial Layering">Cyber Fraud & Financial Layering</option>
                    <option value="Organized Smuggling & Transit">Organized Smuggling & Transit</option>
                    <option value="Hawala Relay & Money Laundering">Hawala Relay & Money Laundering</option>
                    <option value="Burner SIM Syndicate">Burner SIM Syndicate</option>
                    <option value="Cargo Theft & Logistics Tampering">Cargo Theft & Logistics Tampering</option>
                    <option value="Counterfeit Documentation">Counterfeit Documentation</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Offence Type & Applicable Sections
                  </label>
                  <input
                    type="text"
                    value={offenceType}
                    onChange={(e) => setOffenceType(e.target.value)}
                    placeholder="IPC 420, 468, 120B / IT Act 66D"
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Description & Circumstances of Offence
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the suspect network, staging locations, and preliminary evidentiary leads..."
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Incident Time
                  </label>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Incident Location
                  </label>
                  <input
                    type="text"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    placeholder="e.g. Sector 4 Logistics Warehouse / Terminal 3"
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Police Station
                  </label>
                  <input
                    type="text"
                    value={policeStation}
                    onChange={(e) => setPoliceStation(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as CasePriority)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-bold text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-bold text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: INVESTIGATION DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">
                  2. Investigation Details
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">• Officers & Administrative Scope</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Investigating Officer
                  </label>
                  <input
                    type="text"
                    required
                    value={leadInvestigator}
                    onChange={(e) => setLeadInvestigator(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Supporting Officers
                  </label>
                  <input
                    type="text"
                    value={supportingOfficers}
                    onChange={(e) => setSupportingOfficers(e.target.value)}
                    placeholder="Names & ranks"
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Department / Unit
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Case Reference Number
                  </label>
                  <input
                    type="text"
                    value={caseReferenceNumber}
                    onChange={(e) => setCaseReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                    Investigation Strategy & Lead Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter preliminary instructions for field units..."
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#64748B] font-mono">
                Auto-assigned unique Case ID on submission
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? 'Registering Case...' : 'Register Case File'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
