import React, { useState, useEffect } from 'react';
import {
  Clock, Plus, X, Eye, AlertTriangle, ExternalLink, FileText,
  User, Calendar, Building2, Link2, BookOpen
} from 'lucide-react';
import { criminalHistoryService } from '../../services/criminalHistoryService';
import { CriminalHistoryRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useInvestigation } from '../../context/InvestigationContext';

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]',
  'Active — Bail granted': 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]',
  'Under Investigation': 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]',
  'Closed — Conviction': 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
  'Closed — Compounded': 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
};

const EMPTY_FORM: Omit<CriminalHistoryRecord, 'id'> = {
  personEntityId: '',
  personName: '',
  previousCaseId: '',
  firReference: '',
  offenceCategory: '',
  offenceDate: '',
  policeStation: '',
  caseStatus: 'Under Investigation',
  disposition: '',
  sourceReference: '',
  notes: '',
  linkedCurrentCaseId: '',
  registeredBy: 'Inspector Rajesh Verma',
  registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
};

interface Props {
  caseId: string;
}

export const CriminalHistoryTab: React.FC<Props> = ({ caseId }) => {
  const { user } = useAuth();
  const { navigateTo, setActiveCaseId } = useInvestigation();
  const [records, setRecords] = useState<CriminalHistoryRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CriminalHistoryRecord | null>(null);
  const [form, setForm] = useState<Omit<CriminalHistoryRecord, 'id'>>({ ...EMPTY_FORM, linkedCurrentCaseId: caseId });

  const load = () => setRecords(criminalHistoryService.getRecordsByCaseId(caseId));
  useEffect(() => { load(); }, [caseId]);

  const handleSave = () => {
    if (!form.personName || !form.offenceCategory || !form.previousCaseId) return;
    criminalHistoryService.addRecord({
      ...form,
      linkedCurrentCaseId: caseId,
      registeredBy: user?.name || 'Inspector Rajesh Verma',
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    load();
    setShowModal(false);
    setForm({ ...EMPTY_FORM, linkedCurrentCaseId: caseId });
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigateTo('case-details', { caseId, tab: 'overview' });
  };

  return (
    <div className="space-y-4 animate-in fade-in">

      {/* Header */}
      <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#087E8B]" />
            <h2 className="text-sm font-bold text-[#12304A]">Criminal History Records</h2>
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            Prior case associations for persons of interest in {caseId}. Cross-case analytical leads.
          </p>
        </div>
        <button
          onClick={() => { setForm({ ...EMPTY_FORM, linkedCurrentCaseId: caseId }); setShowModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Criminal History
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[11px] text-[#92400E] flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Historical association does not imply guilt.</strong> Criminal history records document prior authorized case associations for investigative reference only.
          All records require investigator verification before use in judicial proceedings.
        </span>
      </div>

      {/* Records */}
      {records.length === 0 ? (
        <div className="bg-[#FFFFFF] p-10 border border-[#E2E8F0] rounded-lg text-center space-y-2 shadow-sm">
          <BookOpen className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-bold text-[#12304A]">No Criminal History Records</p>
          <p className="text-xs text-[#64748B]">No prior case associations have been registered for subjects in {caseId}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-4 shadow-sm space-y-3 hover:border-[#087E8B] transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#087E8B]">{r.id}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${STATUS_COLORS[r.caseStatus] || 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'}`}>
                      {r.caseStatus}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#12304A]">{r.personName}</div>
                  <div className="text-xs text-[#64748B]">{r.offenceCategory}</div>
                </div>
                <button
                  onClick={() => setSelectedRecord(r)}
                  className="p-1.5 rounded hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12304A] transition-colors shrink-0"
                  title="View details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Case association */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2.5 py-1.5">
                  <Link2 className="w-3 h-3 text-[#087E8B]" />
                  <span className="text-[#64748B]">Current:</span>
                  <span className="font-mono font-bold text-[#087E8B]">{r.linkedCurrentCaseId}</span>
                </div>
                <span className="text-[#94A3B8]">←→</span>
                <button
                  onClick={() => handleOpenCase(r.previousCaseId)}
                  className="flex items-center gap-1.5 bg-[#FEF3C7] border border-[#FCD34D] rounded px-2.5 py-1.5 hover:bg-[#FEF9EC] transition-colors"
                >
                  <span className="text-[#B7791F] font-bold uppercase text-[10px]">Cross-Case:</span>
                  <span className="font-mono font-bold text-[#B7791F]">{r.previousCaseId}</span>
                  <ExternalLink className="w-3 h-3 text-[#B7791F]" />
                </button>
              </div>

              {/* FIR + Station */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">FIR Reference</span>
                  <span className="font-mono text-[#12304A]">{r.firReference}</span>
                </div>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Police Station</span>
                  <span className="text-[#12304A] font-semibold">{r.policeStation}</span>
                </div>
              </div>

              {/* Disposition */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2.5 text-xs">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Disposition</span>
                <span className="text-[#334155]">{r.disposition}</span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-[11px] text-[#64748B]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.offenceDate}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{r.registeredBy}</span>
                <span className="font-mono">{r.sourceReference}</span>
              </div>

              {r.notes && (
                <div className="text-[11px] text-[#64748B] italic border-t border-[#E2E8F0] pt-2">
                  <strong>Note:</strong> {r.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#087E8B]">{caseId}</span>
                <h3 className="font-bold text-sm text-[#12304A]">Register Criminal History Record</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#64748B] hover:text-[#12304A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Person Name *</label>
                  <input value={form.personName} onChange={e => setForm(f => ({ ...f, personName: e.target.value }))}
                    placeholder="Full name of subject"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Person Entity ID</label>
                  <input value={form.personEntityId} onChange={e => setForm(f => ({ ...f, personEntityId: e.target.value }))}
                    placeholder="e.g. Person_044"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Previous Case ID *</label>
                  <input value={form.previousCaseId} onChange={e => setForm(f => ({ ...f, previousCaseId: e.target.value }))}
                    placeholder="e.g. CASE-1031"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">FIR Reference</label>
                  <input value={form.firReference} onChange={e => setForm(f => ({ ...f, firReference: e.target.value }))}
                    placeholder="FIR/2024/THANE/0892"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#64748B]">Offence Category *</label>
                <input value={form.offenceCategory} onChange={e => setForm(f => ({ ...f, offenceCategory: e.target.value }))}
                  placeholder="e.g. Financial Fraud — Hawala Operations"
                  className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Offence Date</label>
                  <input value={form.offenceDate} onChange={e => setForm(f => ({ ...f, offenceDate: e.target.value }))}
                    placeholder="e.g. 12 Mar 2024"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Police Station</label>
                  <input value={form.policeStation} onChange={e => setForm(f => ({ ...f, policeStation: e.target.value }))}
                    placeholder="Station name"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Case Status</label>
                  <select value={form.caseStatus} onChange={e => setForm(f => ({ ...f, caseStatus: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]">
                    <option>Under Investigation</option>
                    <option>Active — Bail granted</option>
                    <option>Closed — Conviction</option>
                    <option>Closed — Acquittal</option>
                    <option>Closed — Compounded</option>
                    <option>Charge sheet filed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Source Reference</label>
                  <input value={form.sourceReference} onChange={e => setForm(f => ({ ...f, sourceReference: e.target.value }))}
                    placeholder="Reference ID"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#64748B]">Disposition</label>
                <input value={form.disposition} onChange={e => setForm(f => ({ ...f, disposition: e.target.value }))}
                  placeholder="e.g. Charge sheet filed — Under trial at Sessions Court"
                  className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B]" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#64748B]">Investigative Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Relevant notes for the current investigation"
                  className="w-full px-3 py-2 rounded border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#087E8B] resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-[#CBD5E1] text-xs text-[#475569] hover:bg-[#F8FAFC] font-semibold">
                Cancel
              </button>
              <button onClick={handleSave}
                className="px-4 py-2 rounded bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold shadow-sm">
                Register Criminal History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
