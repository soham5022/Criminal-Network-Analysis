import React from 'react';
import { 
  ArrowRight, 
  Building2, 
  UserCheck, 
  ExternalLink 
} from 'lucide-react';
import { Case } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';
import { caseHistoryService } from '../../services/caseHistoryService';

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
        return 'bg-[#EBF8FF] text-[#12304A] border-[#BEE3F8]';
      case 'COMPLAINANT':
        return 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]';
      case 'VICTIM':
        return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'PERSON_OF_INTEREST':
        return 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]';
      case 'ASSOCIATED_PERSON':
        return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl">
      
      {/* 1. Dynamic Case Summary Statistics Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 font-mono">
        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#12304A]">{caseData.entityCount || 48}</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Persons</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#16805C]">{witnesses.length}</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Witnesses</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#087E8B]">{totalStatements}</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Statements</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#2563A6]">{caseData.evidencePointers?.firCount || 6}</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Documents</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#7E22CE]">14</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Evidence</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#B7791F]">7</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Locations</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#C24141]">4</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Vehicles</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#087E8B]">{caseData.relationshipCount || 164}</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Events</div>
        </div>

        <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-center space-y-0.5">
          <div className="text-base sm:text-lg font-bold text-[#C24141]">{caseData.flaggedAlertsCount || 3}</div>
          <div className="text-[9px] text-[#64748B] uppercase font-sans">Alerts</div>
        </div>
      </div>

      {/* 2. Main Executive Summary Card */}
      <div className="p-6 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#12304A]">
          Case Executive Summary
        </h3>
        <p className="text-xs text-[#334155] leading-relaxed font-sans">
          {caseData.description}
        </p>
      </div>

      {/* 3. Incident Details & Statutory Reference Dossier */}
      {incident && (
        <div className="p-6 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#087E8B]" />
              <span>Incident Details & Police Station Records</span>
            </h3>
            <span className="font-mono text-xs text-[#087E8B] font-bold">{incident.firNumber}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Incident Classification</span>
              <span className="font-semibold text-[#12304A]">{incident.incidentType}</span>
            </div>

            <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Jurisdiction Station</span>
              <span className="text-[#17212B] truncate">{incident.policeStation}</span>
            </div>

            <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Date & Time</span>
              <span className="font-mono text-[#17212B]">{incident.date} • {incident.time}</span>
            </div>

            <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Reporting Officer</span>
              <span className="text-[#17212B]">{incident.reportingOfficer}</span>
            </div>
          </div>

          <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Incident Occurrence Narrative</span>
            <p className="text-[#334155] leading-relaxed font-sans">{incident.description}</p>
          </div>
        </div>
      )}

      {/* 4. Case Participants Directory */}
      <div className="p-6 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#087E8B]" />
            <span>Case Participants Directory ({participants.length})</span>
          </h3>
          <span className="text-xs text-[#64748B]">Complainants, Victims & Subject Leads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {participants.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                if (p.linkedEntityId) openEntityProfile(p.linkedEntityId);
              }}
              className="p-3.5 rounded-lg bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] cursor-pointer transition-all space-y-2 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#12304A] text-xs group-hover:text-[#087E8B]">
                  {p.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getParticipantBadge(p.role)}`}>
                  {p.role.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-[11px] text-[#475569] line-clamp-2">{p.roleDescription}</p>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                <span>{p.linkedEntityId ? `Linked: ${p.linkedEntityId}` : p.contact}</span>
                <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#087E8B]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Key Analytical Leads Strip */}
      <div className="p-6 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#12304A]">
          Key Findings & Analytical Leads
        </h3>

        <div className="space-y-2">
          {caseData.keyFindings?.map((finding, idx) => (
            <div
              key={idx}
              onClick={() => handleReviewLead(undefined, undefined, 'network')}
              className="p-3 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] flex items-center justify-between cursor-pointer transition-colors group shadow-sm"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-[#12304A] group-hover:text-[#087E8B]">
                  Lead Finding #{idx + 1}
                </div>
                <div className="text-[11px] text-[#64748B] font-sans">
                  {finding}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#087E8B] text-xs font-semibold">
                <span>Analyze in Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
