import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  FileText, 
  ExternalLink, 
  Eye, 
  User, 
  Plus 
} from 'lucide-react';
import { 
  WitnessRecord, 
  WitnessStatement, 
  caseHistoryService 
} from '../../services/caseHistoryService';
import { auditService } from '../../services/auditService';
import { useInvestigation } from '../../context/InvestigationContext';
import { StatementViewerModal } from './StatementViewerModal';

interface WitnessManagementTabProps {
  caseId: string;
}

export const WitnessManagementTab: React.FC<WitnessManagementTabProps> = ({ caseId }) => {
  const { openEntityProfile, navigateTo } = useInvestigation();
  const [witnesses, setWitnesses] = useState<WitnessRecord[]>([]);
  const [selectedWitness, setSelectedWitness] = useState<WitnessRecord | null>(null);
  const [search, setSearch] = useState<string>('');
  
  // Modals state
  const [selectedStatement, setSelectedStatement] = useState<WitnessStatement | null>(null);
  const [showAddStatementModal, setShowAddStatementModal] = useState<boolean>(false);

  // New statement form state
  const [newStatementType, setNewStatementType] = useState<'INITIAL_INTERVIEW' | 'SUPPLEMENTARY_STATEMENT'>('SUPPLEMENTARY_STATEMENT');
  const [newStatementSummary, setNewStatementSummary] = useState<string>('');
  const [newStatementText, setNewStatementText] = useState<string>('');
  const [newStatementOfficer, setNewStatementOfficer] = useState<string>('Inspector Rajesh Verma');

  const loadWitnesses = () => {
    const list = caseHistoryService.getWitnesses(caseId);
    setWitnesses(list);
    if (list.length > 0 && !selectedWitness) {
      setSelectedWitness(list[0]);
    } else if (selectedWitness) {
      const refreshed = list.find(w => w.id === selectedWitness.id) || list[0] || null;
      setSelectedWitness(refreshed);
    }
  };

  useEffect(() => {
    loadWitnesses();
  }, [caseId]);

  const filteredWitnesses = witnesses.filter(w => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.relationshipToIncident.toLowerCase().includes(q) ||
      w.statements.some(s => s.summary.toLowerCase().includes(q))
    );
  });

  const handleAddStatementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWitness || !newStatementSummary.trim() || !newStatementText.trim()) return;

    const updated = caseHistoryService.recordWitnessStatement(caseId, selectedWitness.id, {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      location: selectedWitness.interviewLocation,
      recordingOfficer: newStatementOfficer,
      type: newStatementType,
      summary: newStatementSummary,
      fullText: newStatementText,
      status: 'VERIFIED',
      source: 'Recorded Witness Supplementary Memo'
    });

    if (updated) {
      auditService.logAction({
        action: 'RECORDED_STATEMENT',
        actionLabel: 'Recorded Witness Supplementary Statement',
        module: 'Witnesses',
        caseId: caseId,
        recordId: selectedWitness.id,
        recordType: 'WITNESS',
        recordLabel: selectedWitness.name,
        status: 'SUCCESS',
        details: `Recorded Section 161 CrPC supplementary statement for witness ${selectedWitness.name} (${selectedWitness.id}).`
      });

      loadWitnesses();
      setShowAddStatementModal(false);
      setNewStatementSummary('');
      setNewStatementText('');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in select-none max-w-6xl">
      
      {/* 1. Header Bar */}
      <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087E8B]">
            <UserCheck className="w-4 h-4" />
            <span>CASE WITNESS & STATEMENT REGISTRY</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#12304A] tracking-tight">
            Witness Statements & Deposition Log ({witnesses.length} Registered)
          </h2>
          <p className="text-xs text-[#64748B]">
            Official records of witness testimonies, Section 161 CrPC depositions, and statement repository.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search witnesses, statements..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>
        </div>
      </div>

      {/* 2. Empty State */}
      {witnesses.length === 0 ? (
        <div className="p-12 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] text-center space-y-2 shadow-sm">
          <UserCheck className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-bold text-[#12304A]">No Witnesses Recorded</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            No witness profiles or statements have been recorded for this case file yet.
          </p>
        </div>
      ) : (
        /* 3. Main Master-Detail Split */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Witness List */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block px-1">
              Witnesses ({filteredWitnesses.length})
            </span>
            <div className="space-y-2">
              {filteredWitnesses.map((w) => {
                const isSelected = selectedWitness?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWitness(w)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'bg-[#E6F4F5] border-[#A7DFE3]'
                        : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#087E8B]">{w.id}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">
                        {w.statements.length} {w.statements.length === 1 ? 'Statement' : 'Statements'}
                      </span>
                    </div>

                    <div className="font-bold text-[#12304A] text-xs mt-1">{w.name}</div>
                    <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {w.relationshipToIncident}
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                      <span>Interviewed: {w.interviewDate}</span>
                      <span>Age: {w.age}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Witness Dossier */}
          {selectedWitness ? (
            <div className="lg:col-span-8 space-y-4">
              
              {/* Profile Card */}
              <div className="p-5 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-[#12304A]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#087E8B]">{selectedWitness.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          {selectedWitness.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#12304A]">{selectedWitness.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddStatementModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Statement</span>
                  </button>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Contact</span>
                    <span className="font-mono text-[#12304A]">{selectedWitness.contact}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Interview Timestamp</span>
                    <span className="font-mono text-[#17212B]">{selectedWitness.interviewDate} • {selectedWitness.interviewTime}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Location</span>
                    <span className="text-[#17212B] truncate">{selectedWitness.interviewLocation}</span>
                  </div>
                </div>

                {/* Recorded Statements List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#12304A] block">
                    Recorded Statements ({selectedWitness.statements.length})
                  </span>

                  <div className="space-y-2.5">
                    {selectedWitness.statements.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStatement(st)}
                        className="p-3.5 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] cursor-pointer transition-all space-y-2 group shadow-sm"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#087E8B]">Statement #{st.statementNumber}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFFFFF] text-[#475569] border border-[#CBD5E1]">
                              {st.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#64748B]">{st.date} • {st.time}</span>
                        </div>

                        <p className="text-xs text-[#334155] leading-relaxed font-sans">{st.summary}</p>

                        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                          <span>Recording Officer: <strong className="text-[#12304A]">{st.recordingOfficer}</strong></span>
                          <span className="text-[#087E8B] group-hover:underline font-semibold flex items-center gap-1">
                            <span>Read Full Deposition</span>
                            <Eye className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 p-12 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] text-center text-[#64748B] text-xs">
              Select a witness from the left list to view recorded statements.
            </div>
          )}

        </div>
      )}

      {/* Statement Modal */}
      {selectedStatement && selectedWitness && (
        <StatementViewerModal
          witness={selectedWitness}
          statement={selectedStatement}
          allStatements={selectedWitness.statements}
          onClose={() => setSelectedStatement(null)}
        />
      )}

      {/* Record Statement Modal */}
      {showAddStatementModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#087E8B]">{selectedWitness?.id}</span>
                <h3 className="font-bold text-sm text-[#12304A]">Record Witness Statement (Sec 161 CrPC)</h3>
              </div>
              <button 
                onClick={() => setShowAddStatementModal(false)}
                className="text-[#64748B] hover:text-[#12304A]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStatementSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#64748B]">Statement Classification</label>
                <select
                  value={newStatementType}
                  onChange={(e) => setNewStatementType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                >
                  <option value="SUPPLEMENTARY_STATEMENT">Supplementary Deposition</option>
                  <option value="INITIAL_INTERVIEW">Initial Investigation Interview</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#64748B]">Brief Summary (1-2 sentences)</label>
                <input
                  type="text"
                  required
                  placeholder="Key observations or claims recorded..."
                  value={newStatementSummary}
                  onChange={(e) => setNewStatementSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#64748B]">Full Statement Transcript</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Verbatim or detailed deposition text..."
                  value={newStatementText}
                  onChange={(e) => setNewStatementText(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddStatementModal(false)}
                  className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold shadow-sm"
                >
                  Save Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
