import React, { useState, useEffect } from 'react';
import {
  Globe, Plus, X, Eye, CheckCircle2, AlertCircle, Clock, Shield,
  ExternalLink, Tag, User, Calendar, MapPin
} from 'lucide-react';
import { socialIntelligenceService } from '../../services/socialIntelligenceService';
import { SocialIntelRecord } from '../../types';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';

const CONFIDENCE_COLORS = {
  HIGH: 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]',
  MEDIUM: 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]',
  LOW: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
};

const STATUS_COLORS = {
  UNVERIFIED: 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]',
  REQUIRES_REVIEW: 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]',
  CONFIRMED_LEAD: 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]',
  DISMISSED: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
};

const STATUS_LABELS = {
  UNVERIFIED: 'Unverified',
  REQUIRES_REVIEW: 'Requires Review',
  CONFIRMED_LEAD: 'Confirmed Lead',
  DISMISSED: 'Dismissed'
};

interface Props {
  caseId: string;
}

const EMPTY_FORM: Omit<SocialIntelRecord, 'id'> = {
  caseId: '',
  platform: '',
  accountRef: '',
  subject: '',
  date: '',
  time: '',
  location: '',
  relatedEntities: [],
  content: '',
  sourceReference: '',
  confidence: 'MEDIUM',
  status: 'REQUIRES_REVIEW',
  registeredBy: 'Inspector Rajesh Verma',
  registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  tags: []
};

export const SocialIntelligenceTab: React.FC<Props> = ({ caseId }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<SocialIntelRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<SocialIntelRecord, 'id'>>({ ...EMPTY_FORM, caseId });
  const [selectedRecord, setSelectedRecord] = useState<SocialIntelRecord | null>(null);
  const [tagInput, setTagInput] = useState('');

  const load = () => {
    setRecords(socialIntelligenceService.getRecordsByCaseId(caseId));
  };

  useEffect(() => { load(); }, [caseId]);

  const handleSave = () => {
    if (!form.platform || !form.subject || !form.content) return;
    socialIntelligenceService.addRecord({
      ...form,
      caseId,
      registeredBy: user?.name || 'Inspector Rajesh Verma',
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    load();
    setShowModal(false);
    setForm({ ...EMPTY_FORM, caseId });
  };

  const handleStatusChange = (id: string, status: SocialIntelRecord['status']) => {
    socialIntelligenceService.updateStatus(id, status);
    load();
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm(f => ({ ...f, tags: [...(f.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">

      {/* Header */}
      <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#087E8B]" />
            <h2 className="text-sm font-bold text-[#12304A]">Social Intelligence Records</h2>
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            Authorized imported intelligence. No direct social-media scraping.
            All records are analytical leads requiring investigator verification.
          </p>
        </div>
        <button
          onClick={() => { setForm({ ...EMPTY_FORM, caseId }); setShowModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Intelligence Record
        </button>
      </div>

      {/* Disclaimer banner */}
      <div className="p-3 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[11px] text-[#92400E] flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Analytical Lead — Investigator Review Required.</strong> Social intelligence records represent authorized intelligence imports and OSINT references.
          They are investigative leads, not evidence of guilt. All findings require independent investigator verification.
        </span>
      </div>

      {/* Records list */}
      {records.length === 0 ? (
        <div className="bg-[#FFFFFF] p-10 border border-[#E2E8F0] rounded-lg text-center space-y-2 shadow-sm">
          <Globe className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-bold text-[#12304A]">No Social Intelligence Records</p>
          <p className="text-xs text-[#64748B]">No authorized intelligence records have been registered for {caseId} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {records.map(r => (
            <div key={r.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-4 shadow-sm space-y-3 hover:border-[#087E8B] transition-all">
              {/* Record header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#087E8B]">{r.id}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${STATUS_COLORS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${CONFIDENCE_COLORS[r.confidence]}`}>
                      {r.confidence} Confidence
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#12304A]">{r.platform}</div>
                  <div className="text-[11px] text-[#64748B]">
                    <span>Ref: {r.accountRef}</span>
                    {r.subject && <span> • Subject: {r.subject}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setSelectedRecord(r)}
                    className="p-1.5 rounded hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12304A] transition-colors"
                    title="View full record"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content preview */}
              <p className="text-xs text-[#334155] leading-relaxed line-clamp-3 bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
                {r.content}
              </p>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B]">
                {r.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {r.date} {r.time}
                  </span>
                )}
                {r.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {r.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {r.registeredBy}
                </span>
                <span className="font-mono">{r.sourceReference}</span>
              </div>

              {/* Tags */}
              {r.tags && r.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {r.tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">{t}</span>
                  ))}
                </div>
              )}

              {/* Status actions */}
              {r.status !== 'CONFIRMED_LEAD' && r.status !== 'DISMISSED' && (
                <div className="flex items-center gap-2 pt-1 border-t border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] font-semibold">Review:</span>
                  <button
                    onClick={() => handleStatusChange(r.id, 'CONFIRMED_LEAD')}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8] hover:bg-[#D1F0E2] transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Confirm Lead
                  </button>
                  <button
                    onClick={() => handleStatusChange(r.id, 'DISMISSED')}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#087E8B]">{caseId}</span>
                <h3 className="font-bold text-sm text-[#12304A]">Register Social Intelligence Record</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#64748B] hover:text-[#12304A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded bg-[#FEF3C7] border border-[#FCD34D] text-[11px] text-[#92400E]">
              Record authorized intelligence imports only. No direct platform scraping. Treat all records as analytical leads.
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Platform / Source Type *</label>
                  <input
                    value={form.platform}
                    onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    placeholder="e.g. Open Source Intelligence — Forum Reference"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Account / Reference ID</label>
                  <input
                    value={form.accountRef}
                    onChange={e => setForm(f => ({ ...f, accountRef: e.target.value }))}
                    placeholder="e.g. OSINT-REF-0334"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Subject / Entity *</label>
                  <input
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Person or entity name"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Location (if available)</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="City, region"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#64748B]">Content / Intelligence Summary *</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Describe the intelligence content. Be precise about the source nature and what was observed/reported."
                  className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#64748B]">Source Reference</label>
                <input
                  value={form.sourceReference}
                  onChange={e => setForm(f => ({ ...f, sourceReference: e.target.value }))}
                  placeholder="e.g. AUTH-INTERCEPT-REF-TN-2026-0818"
                  className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Confidence</label>
                  <select value={form.confidence} onChange={e => setForm(f => ({ ...f, confidence: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]">
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#64748B]">Initial Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]">
                    <option value="REQUIRES_REVIEW">Requires Review</option>
                    <option value="UNVERIFIED">Unverified</option>
                    <option value="CONFIRMED_LEAD">Confirmed Lead</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#64748B]">Tags</label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag and press Enter"
                    className="flex-1 px-3 py-2 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#087E8B]"
                  />
                  <button onClick={addTag} className="px-3 py-2 rounded border border-[#CBD5E1] text-xs text-[#087E8B] hover:bg-[#F8FAFC]">Add</button>
                </div>
                {form.tags && form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {form.tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                        {t}
                        <button onClick={() => setForm(f => ({ ...f, tags: f.tags?.filter(x => x !== t) }))}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-[#CBD5E1] text-xs text-[#475569] hover:bg-[#F8FAFC] font-semibold">
                Cancel
              </button>
              <button onClick={handleSave}
                className="px-4 py-2 rounded bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold shadow-sm">
                Register Intelligence Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#087E8B]">{selectedRecord.id}</span>
                <h3 className="font-bold text-sm text-[#12304A]">Social Intelligence Record</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-[#64748B] hover:text-[#12304A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2.5">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Platform</span>
                  <span className="font-semibold text-[#12304A]">{selectedRecord.platform}</span>
                </div>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2.5">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Source Reference</span>
                  <span className="font-mono text-[#087E8B]">{selectedRecord.sourceReference}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Intelligence Content</span>
                <p className="text-[#334155] leading-relaxed">{selectedRecord.content}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] text-[#64748B]">
                <span>Date: {selectedRecord.date} {selectedRecord.time}</span>
                {selectedRecord.location && <span>Location: {selectedRecord.location}</span>}
                <span>Registered: {selectedRecord.registeredDate} by {selectedRecord.registeredBy}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-[10px] font-mono font-bold rounded border ${STATUS_COLORS[selectedRecord.status]}`}>
                  {STATUS_LABELS[selectedRecord.status]}
                </span>
                <span className={`px-2 py-1 text-[10px] font-mono font-bold rounded border ${CONFIDENCE_COLORS[selectedRecord.confidence]}`}>
                  {selectedRecord.confidence} Confidence
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <button onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded border border-[#CBD5E1] text-xs text-[#475569] font-semibold hover:bg-[#F8FAFC]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
