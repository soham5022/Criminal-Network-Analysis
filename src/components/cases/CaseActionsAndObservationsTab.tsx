import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  MapPin, 
  Eye, 
  Plus, 
  User, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { 
  InvestigationAction, 
  OfficerObservation, 
  caseHistoryService 
} from '../../services/caseHistoryService';
import { useInvestigation } from '../../context/InvestigationContext';

interface CaseActionsAndObservationsTabProps {
  caseId: string;
}

export const CaseActionsAndObservationsTab: React.FC<CaseActionsAndObservationsTabProps> = ({ caseId }) => {
  const { openEntityProfile, navigateTo } = useInvestigation();
  const [actions, setActions] = useState<InvestigationAction[]>([]);
  const [observations, setObservations] = useState<OfficerObservation[]>([]);

  // Modals state
  const [showAddActionModal, setShowAddActionModal] = useState<boolean>(false);
  const [showAddObsModal, setShowAddObsModal] = useState<boolean>(false);

  // Add action form state
  const [newActionTitle, setNewActionTitle] = useState<string>('');
  const [newActionOfficer, setNewActionOfficer] = useState<string>('Inspector Rajesh Verma');
  const [newActionSubject, setNewActionSubject] = useState<string>('Rahul Sharma (Person_044)');
  const [newActionDueDate, setNewActionDueDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Add observation form state
  const [newObsOfficer, setNewObsOfficer] = useState<string>('Inspector Rajesh Verma');
  const [newObsBadge, setNewObsBadge] = useState<string>('MHA-INT-8902');
  const [newObsLocation, setNewObsLocation] = useState<string>('Sector 4 Transshipment Yard, Thane West');
  const [newObsText, setNewObsText] = useState<string>('');
  const [newObsEntity, setNewObsEntity] = useState<string>('Person_044');

  const loadData = () => {
    setActions(caseHistoryService.getActions(caseId));
    setObservations(caseHistoryService.getObservations(caseId));
  };

  useEffect(() => {
    loadData();
  }, [caseId]);

  const handleToggleActionStatus = (actionId: string, currentStatus: InvestigationAction['status']) => {
    const nextStatus: InvestigationAction['status'] = 
      currentStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    caseHistoryService.updateActionStatus(caseId, actionId, nextStatus);
    loadData();
  };

  const handleAddActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;

    caseHistoryService.addAction(caseId, {
      title: newActionTitle,
      assignedOfficer: newActionOfficer,
      targetSubject: newActionSubject,
      dueDate: newActionDueDate,
      status: 'IN_PROGRESS',
      caseId: caseId
    });

    loadData();
    setShowAddActionModal(false);
    setNewActionTitle('');
  };

  const handleAddObsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsText.trim()) return;

    caseHistoryService.addObservation(caseId, {
      officer: newObsOfficer,
      badge: newObsBadge,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      location: newObsLocation,
      observation: newObsText,
      relatedEntityIds: [newObsEntity],
      caseId: caseId
    });

    loadData();
    setShowAddObsModal(false);
    setNewObsText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      
      {/* 1. SECTION: INVESTIGATION ACTIONS */}
      <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0c1322] space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
              <ClipboardList className="w-4 h-4" />
              <span>INVESTIGATION DIRECTIVES & ACTIONS</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Assigned Field Actions & Verification Tasks ({actions.length})
            </h3>
          </div>

          <button
            onClick={() => setShowAddActionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Action</span>
          </button>
        </div>

        {actions.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-sans text-xs">
            No active investigation directives recorded for this case file.
          </div>
        ) : (
          <div className="space-y-2.5">
            {actions.map((act) => {
              const isDone = act.status === 'COMPLETED';
              return (
                <div 
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#090e1a] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-400">{act.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                        isDone 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {act.status}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs">{act.title}</div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-sans">
                      <span>Officer: <strong className="text-slate-300">{act.assignedOfficer}</strong></span>
                      <span>Target: <strong className="text-blue-300">{act.targetSubject}</strong></span>
                      <span>Due: <strong className="font-mono text-slate-300">{act.dueDate}</strong></span>
                    </div>

                    {act.findings && (
                      <div className="text-[11px] text-emerald-400/90 italic pt-0.5 font-sans">
                        Findings: {act.findings}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleActionStatus(act.id, act.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      isDone 
                        ? 'bg-slate-800 text-slate-400 hover:text-white' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm'
                    }`}
                  >
                    {isDone ? 'Mark In Progress' : 'Mark Completed'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. SECTION: OFFICER FIELD OBSERVATIONS */}
      <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0c1322] space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
              <Eye className="w-4 h-4" />
              <span>OFFICER FIELD OBSERVATIONS (HUMAN VERIFIED)</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Primary Investigator Field Logs ({observations.length})
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Direct physical surveillance and tactical observations stamped with officer service credentials. Distinct from automated AI findings.
            </p>
          </div>

          <button
            onClick={() => setShowAddObsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Observation</span>
          </button>
        </div>

        {observations.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-sans text-xs">
            No manual officer field observations recorded for this case file yet.
          </div>
        ) : (
          <div className="space-y-3">
            {observations.map((obs) => (
              <div 
                key={obs.id}
                className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-400">{obs.id}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      OFFICER OBSERVATION
                    </span>
                    <span className="text-[11px] text-slate-300 font-semibold">{obs.officer}</span>
                    <span className="text-[10px] font-mono text-slate-500">({obs.badge})</span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-400">
                    {obs.date} • {obs.time}
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {obs.observation}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    <span>Location: {obs.location}</span>
                  </div>

                  {obs.relatedEntityIds.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Linked:</span>
                      {obs.relatedEntityIds.map((entId) => (
                        <button
                          key={entId}
                          onClick={() => openEntityProfile(entId)}
                          className="px-1.5 py-0.2 rounded bg-slate-900 text-blue-300 hover:text-white border border-slate-800 text-[10px] font-mono transition-colors"
                        >
                          {entId}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Add Action Modal */}
      {showAddActionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
          <div 
            className="w-full max-w-md intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Add Investigation Directive / Action</h3>
              <button onClick={() => setShowAddActionModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddActionSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Action Directive Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct perimeter reconnaissance on warehouse"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Assigned Officer</label>
                <input
                  type="text"
                  value={newActionOfficer}
                  onChange={(e) => setNewActionOfficer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Target Subject / Entity</label>
                <input
                  type="text"
                  value={newActionSubject}
                  onChange={(e) => setNewActionSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Target Completion Date</label>
                <input
                  type="date"
                  value={newActionDueDate}
                  onChange={(e) => setNewActionDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddActionModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Observation Modal */}
      {showAddObsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
          <div 
            className="w-full max-w-md intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Record Officer Field Observation</h3>
              <button onClick={() => setShowAddObsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddObsSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Officer Name</label>
                  <input
                    type="text"
                    value={newObsOfficer}
                    onChange={(e) => setNewObsOfficer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Badge Number</label>
                  <input
                    type="text"
                    value={newObsBadge}
                    onChange={(e) => setNewObsBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Field Location</label>
                <input
                  type="text"
                  value={newObsLocation}
                  onChange={(e) => setNewObsLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Observation Narrative</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record factual physical observation, movement, rendezvous, or asset sighting..."
                  value={newObsText}
                  onChange={(e) => setNewObsText(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Primary Linked Entity ID</label>
                <input
                  type="text"
                  value={newObsEntity}
                  onChange={(e) => setNewObsEntity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddObsModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
