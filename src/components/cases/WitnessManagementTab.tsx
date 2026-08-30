import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  PlusCircle, 
  FileText, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Columns, 
  Eye, 
  ShieldCheck,
  User,
  Plus
} from 'lucide-react';
import { 
  WitnessRecord, 
  WitnessStatement, 
  caseHistoryService 
} from '../../services/caseHistoryService';
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
  const [showAddWitnessModal, setShowAddWitnessModal] = useState<boolean>(false);

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
      loadWitnesses();
      setShowAddStatementModal(false);
      setNewStatementSummary('');
      setNewStatementText('');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in select-none">
      
      {/* 1. Header Bar */}
      <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0d1527] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
            <UserCheck className="w-4 h-4" />
            <span>CASE WITNESS & STATEMENT REGISTRY</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Witness Statements & Deposition Log ({witnesses.length} Registered)
          </h2>
          <p className="text-xs text-slate-400">
            Official records of witness testimonies, Section 161 CrPC depositions, and chronological statement comparison.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search witnesses, statements..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* 2. Empty State */}
      {witnesses.length === 0 ? (
        <div className="intel-card p-12 border border-slate-800 rounded-xl bg-[#0c1322] text-center space-y-2">
          <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Witnesses Recorded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No witness profiles or statements have been recorded for this case file yet.
          </p>
        </div>
      ) : (
        /* 3. Main Master-Detail Split */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Witness List */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Witnesses ({filteredWitnesses.length})
            </span>
            <div className="space-y-2">
              {filteredWitnesses.map((w) => {
                const isSelected = selectedWitness?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWitness(w)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/30 border-blue-500/60 shadow-md shadow-blue-950/30'
                        : 'bg-[#0c1322] hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-400">{w.id}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {w.statements.length} {w.statements.length === 1 ? 'Statement' : 'Statements'}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs mt-1">{w.name}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {w.relationshipToIncident}
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
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
              <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0c1322] space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-blue-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">{selectedWitness.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-slate-300 border border-slate-700">
                          {selectedWitness.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{selectedWitness.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddStatementModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Statement</span>
                  </button>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Contact (Masked)</span>
                    <span className="font-mono text-white">{selectedWitness.contact}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Interview Timestamp</span>
                    <span className="font-mono text-slate-300">{selectedWitness.interviewDate} • {selectedWitness.interviewTime}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Recording Officer</span>
                    <span className="text-slate-300">{selectedWitness.recordingOfficer}</span>
                  </div>

                  <div className="sm:col-span-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Synthetic Address</span>
                    <span className="text-slate-300">{selectedWitness.address}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Interview Location</span>
                    <span className="text-slate-300">{selectedWitness.interviewLocation}</span>
                  </div>
                </div>

                {/* Observed Entities Connections */}
                {selectedWitness.observedEntities.length > 0 && (
                  <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Observed Subjects & Transport Assets
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedWitness.observedEntities.map((ent, idx) => (
                        <div
                          key={idx}
                          onClick={() => openEntityProfile(ent.entityId)}
                          className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer flex items-center justify-between gap-2 transition-all group"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-white text-xs group-hover:text-blue-300 transition-colors truncate">
                              {ent.label}
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans leading-tight line-clamp-2">
                              {ent.observation}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statements Chronology Section */}
              <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0c1322] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recorded Statements ({selectedWitness.statements.length})</span>
                  </span>
                  
                  {selectedWitness.statements.length > 1 && (
                    <button
                      onClick={() => setSelectedStatement(selectedWitness.statements[0])}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Compare All Statements</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedWitness.statements.map((st) => (
                    <div 
                      key={st.id} 
                      className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-400">{st.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                            Statement #{st.statementNumber} ({st.type.replace(/_/g, ' ')})
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                          {st.date} • {st.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {st.summary}
                      </p>

                      {st.inconsistenciesWithPrevious && st.inconsistenciesWithPrevious.length > 0 && (
                        <div className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Note: Subsequent statement expands on earlier recollections for officer review.</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                          Officer: {st.recordingOfficer}
                        </span>
                        <button
                          onClick={() => setSelectedStatement(st)}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Full Statement</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : null}

        </div>
      )}

      {/* Modal 1: Statement Viewer & Comparison Modal */}
      {selectedStatement && selectedWitness && (
        <StatementViewerModal
          witness={selectedWitness}
          statement={selectedStatement}
          allStatements={selectedWitness.statements}
          onClose={() => setSelectedStatement(null)}
        />
      )}

      {/* Modal 2: Record New Supplementary Statement Modal */}
      {showAddStatementModal && selectedWitness && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
          <div 
            className="w-full max-w-lg intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">{selectedWitness.id}</span>
                <h3 className="font-bold text-sm text-white">Record Statement for {selectedWitness.name}</h3>
              </div>
              <button 
                onClick={() => setShowAddStatementModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStatementSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Statement Type</label>
                <select
                  value={newStatementType}
                  onChange={(e) => setNewStatementType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="SUPPLEMENTARY_STATEMENT">Supplementary Statement (Sec 161 CrPC)</option>
                  <option value="SCENE_RECONSTRUCTION">Scene Reconstruction Statement</option>
                  <option value="INITIAL_INTERVIEW">Initial Deposition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Recording Officer</label>
                <input
                  type="text"
                  value={newStatementOfficer}
                  onChange={(e) => setNewStatementOfficer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Statement Summary</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of observations or testimony..."
                  value={newStatementSummary}
                  onChange={(e) => setNewStatementSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Full Deposition Text</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Certified deposition text..."
                  value={newStatementText}
                  onChange={(e) => setNewStatementText(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStatementModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
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

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
