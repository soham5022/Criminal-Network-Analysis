import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  ExternalLink 
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
  const { openEntityProfile } = useInvestigation();
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
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl">
      
      {/* 1. Top Section: Investigation Actions Ledger */}
      <div className="p-6 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#12304A] flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#087E8B]" />
              <span>Investigation Directives & Action Tracker</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Operational tasks, surveillance authorizations, and court summons.
            </p>
          </div>

          <button
            onClick={() => setShowAddActionModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Action Directive</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {actions.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#64748B]">No operational actions pending for this case.</div>
          ) : (
            actions.map((act) => {
              const isCompleted = act.status === 'COMPLETED';
              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleActionStatus(act.id, act.status)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        isCompleted ? 'bg-[#16805C] border-[#16805C] text-white' : 'border-[#CBD5E1] bg-[#FFFFFF]'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1">
                      <div className={`font-semibold text-xs text-[#12304A] ${isCompleted ? 'line-through opacity-70' : ''}`}>
                        {act.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B]">
                        <span>Assigned: <strong className="text-[#12304A]">{act.assignedOfficer}</strong></span>
                        <span>•</span>
                        <span>Target: <strong className="text-[#087E8B]">{act.targetSubject}</strong></span>
                        <span>•</span>
                        <span>Due: <strong className="font-mono text-[#17212B]">{act.dueDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-auto border ${
                    isCompleted
                      ? 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]'
                      : 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]'
                  }`}>
                    {act.status.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Bottom Section: Officer Field Observations Log */}
      <div className="p-6 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#12304A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#087E8B]" />
              <span>Officer Field Observations Log</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Field reports and human intelligence observations recorded by authorized personnel.
            </p>
          </div>

          <button
            onClick={() => setShowAddObsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#087E8B]" />
            <span>Add Observation</span>
          </button>
        </div>

        <div className="space-y-3">
          {observations.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#64748B]">No field observations logged yet.</div>
          ) : (
            observations.map((obs) => (
              <div key={obs.id} className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#12304A]">{obs.officer}</span>
                    <span className="font-mono text-[10px] text-[#64748B]">({obs.badge})</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#64748B]">
                    {obs.date} • {obs.time}
                  </div>
                </div>

                <p className="text-xs text-[#334155] leading-relaxed font-sans">{obs.observation}</p>

                <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7E22CE]" />
                    <span>{obs.location}</span>
                  </div>

                  {obs.relatedEntityIds && obs.relatedEntityIds.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {obs.relatedEntityIds.map(entId => (
                        <button
                          key={entId}
                          onClick={() => openEntityProfile(entId)}
                          className="px-2 py-0.5 rounded bg-[#FFFFFF] hover:bg-[#E6F4F5] border border-[#CBD5E1] hover:border-[#A7DFE3] text-[#087E8B] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>{entId}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Add Directive */}
      {showAddActionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="font-bold text-sm text-[#12304A]">New Investigation Directive</h3>
              <button onClick={() => setShowAddActionModal(false)} className="text-[#64748B] hover:text-[#12304A]">✕</button>
            </div>

            <form onSubmit={handleAddActionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Action Directive Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Issue Section 91 CrPC notice for bank transaction records"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Assigned Officer</label>
                <input
                  type="text"
                  value={newActionOfficer}
                  onChange={(e) => setNewActionOfficer(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Target Subject / Focus</label>
                <input
                  type="text"
                  value={newActionSubject}
                  onChange={(e) => setNewActionSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddActionModal(false)}
                  className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold shadow-sm"
                >
                  Save Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Observation */}
      {showAddObsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="font-bold text-sm text-[#12304A]">New Field Observation Entry</h3>
              <button onClick={() => setShowAddObsModal(false)} className="text-[#64748B] hover:text-[#12304A]">✕</button>
            </div>

            <form onSubmit={handleAddObsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Location / Surveillance Point</label>
                <input
                  type="text"
                  value={newObsLocation}
                  onChange={(e) => setNewObsLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Observation Narrative</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of physical surveillance, spot check, or lead verification..."
                  value={newObsText}
                  onChange={(e) => setNewObsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddObsModal(false)}
                  className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold shadow-sm"
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
