import React, { useState } from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  CreditCard, 
  FileText, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  User,
  Clock,
  Calendar,
  Building2,
  FolderArchive,
  UserCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Case } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';
import { caseHistoryService, CaseParticipant, IncidentDetails } from '../../services/caseHistoryService';

export const CaseSummaryTab: React.FC<{ caseData: Case }> = ({ caseData }) => {
  const { setActiveCaseTab, setSelectedEntityId, setSelectedAlertId, openEntityProfile } = useInvestigation();

  const incident = caseHistoryService.getIncidentDetails(caseData.id);
  const participants = caseHistoryService.getParticipants(caseData.id);
  const witnesses = caseHistoryService.getWitnesses(caseData.id);
  const totalStatements = witnesses.reduce((acc, w) => acc + w.statements.length, 0);

  const handleReviewLead = (entityId?: string, alertId?: string, targetTab: 'network' | 'timeline' | 'evidence' = 'network') => {
    if (entityId) setSelectedEntityId(entityId);
    if (alertId) setSelectedAlertId(alertId);
    setActiveCaseTab(targetTab);
  };

  const getParticipantBadge = (role: string) => {
    switch (role) {
      case 'INVESTIGATOR':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'COMPLAINANT':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'VICTIM':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'PERSON_OF_INTEREST':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'ASSOCIATED_PERSON':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl">
      
      {/* 1. Dynamic Case Summary Statistics Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 font-mono">
        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-blue-400">{caseData.entityCount || 48}</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Persons</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-emerald-400">{witnesses.length}</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Witnesses</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-cyan-400">{totalStatements}</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Statements</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-indigo-400">{caseData.evidencePointers?.firCount || 6}</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Documents</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-purple-400">14</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Evidence</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-amber-400">7</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Locations</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-rose-400">4</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Vehicles</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-teal-400">{caseData.relationshipCount || 164}</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Events</div>
        </div>

        <div className="intel-card p-3 rounded-xl border border-slate-800 bg-[#0c1322] text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-amber-400">{caseData.flaggedAlertsCount || 12}</div>
          <div className="text-[9px] text-slate-400 uppercase font-sans">Alerts</div>
        </div>
      </div>

      {/* 2. Structured Incident Dossier */}
      {incident && (
        <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0c1322] space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{incident.incidentId}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {incident.firNumber}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {incident.currentStatus}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Incident Dossier: {incident.incidentType}
              </h3>
            </div>

            <div className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{incident.date} • {incident.time}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Incident Location</span>
              <span className="text-slate-200">{incident.location}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Reporting Officer & Station</span>
              <span className="text-slate-200">{incident.reportingOfficer} • {incident.policeStation}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-1.5 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Incident Narrative:</span>
            <p className="text-slate-200 leading-relaxed font-sans">{incident.description}</p>
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60 font-sans">
              Initial Information: {incident.initialInformation}
            </p>
          </div>

          {/* Chronological Incident Updates Ledger */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Incident Investigation Chronology ({incident.chronologicalUpdates.length} Milestone Updates)
            </span>
            <div className="space-y-1.5 text-xs">
              {incident.chronologicalUpdates.map((upd, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{upd.note}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0">
                    {upd.date} • {upd.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Case Participants Grid (Neutral Classifications) */}
      <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0c1322] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-purple-400">
              <User className="w-4 h-4" />
              <span>CASE PARTICIPANTS DIRECTORY</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Identified Case Participants ({participants.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-sans">
            Neutral Classification Standards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {participants.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                if (p.linkedEntityId) openEntityProfile(p.linkedEntityId);
              }}
              className={`p-3.5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2 text-xs transition-all ${
                p.linkedEntityId ? 'hover:border-blue-500/60 cursor-pointer group' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getParticipantBadge(p.role)}`}>
                  {p.role.replace(/_/g, ' ')}
                </span>
                {p.linkedEntityId && (
                  <span className="text-[10px] font-mono text-blue-400 group-hover:underline flex items-center gap-1">
                    <span>{p.linkedEntityId}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                  {p.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{p.roleDescription}</div>
              </div>

              <div className="text-[11px] text-slate-300 font-sans leading-tight bg-slate-950 p-2 rounded border border-slate-800/80">
                {p.relevance}
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60 flex items-center justify-between">
                <span>{p.contact}</span>
                {p.badgeNumber && <span>Badge: {p.badgeNumber}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Key Findings (Investigative Leads) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Key Findings & Analytical Leads</span>
          </h2>
        </div>

        <div className="space-y-3">
          {caseData.keyFindings?.map((findingText, idx) => (
            <div 
              key={idx}
              className="intel-card p-4 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 bg-[#0c1322] text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-400">LEAD-0{idx + 1}</span>
                <button
                  onClick={() => handleReviewLead(undefined, undefined, 'network')}
                  className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Review Graph Lead</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans">{findingText}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
