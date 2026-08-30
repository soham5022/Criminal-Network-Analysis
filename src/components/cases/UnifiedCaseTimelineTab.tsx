import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  ExternalLink, 
  MapPin 
} from 'lucide-react';
import { UnifiedCaseEvent, caseHistoryService } from '../../services/caseHistoryService';
import { useInvestigation } from '../../context/InvestigationContext';

interface UnifiedCaseTimelineTabProps {
  caseId: string;
}

export const UnifiedCaseTimelineTab: React.FC<UnifiedCaseTimelineTabProps> = ({ caseId }) => {
  const { navigateTo, openEntityProfile, setActiveCaseTab } = useInvestigation();
  const [events, setEvents] = useState<UnifiedCaseEvent[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');

  useEffect(() => {
    setEvents(caseHistoryService.getUnifiedEvents(caseId));
  }, [caseId]);

  const filteredEvents = events.filter(ev => {
    if (selectedSourceFilter !== 'ALL' && ev.sourceType !== selectedSourceFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.sourceId.toLowerCase().includes(q) ||
      ev.peopleInvolved.some(p => p.toLowerCase().includes(q))
    );
  });

  const getSourceBadge = (sourceType: string) => {
    switch (sourceType) {
      case 'WITNESS_STATEMENT':
        return 'bg-[#EBF8FF] text-[#12304A] border-[#BEE3F8]';
      case 'INCIDENT_REPORT':
        return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
      case 'EVIDENCE_REGISTRY':
        return 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]';
      case 'OFFICER_OBSERVATION':
        return 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]';
      case 'ACTION_LOG':
        return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  const handleInspectSource = (ev: UnifiedCaseEvent) => {
    if (ev.sourceType === 'WITNESS_STATEMENT') {
      setActiveCaseTab('witnesses');
    } else if (ev.sourceType === 'EVIDENCE_REGISTRY') {
      navigateTo('evidence');
    } else if (ev.sourceType === 'INCIDENT_REPORT') {
      setActiveCaseTab('overview');
    } else {
      setActiveCaseTab('actions');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in select-none max-w-6xl">
      
      {/* 1. Header & Filters Bar */}
      <div className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087E8B]">
            <Clock className="w-4 h-4" />
            <span>UNIFIED INVESTIGATION EVENT LOG</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#12304A] tracking-tight">
            Case Chronology & Source Attribution Stream
          </h2>
          <p className="text-xs text-[#64748B]">
            Complete chronological event log linking incidents, witness interviews, evidence collections, and field observations to their verifiable sources.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event log..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] font-sans"
            />
          </div>

          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
          >
            <option value="ALL">All Source Types ({events.length})</option>
            <option value="WITNESS_STATEMENT">Witness Statements</option>
            <option value="INCIDENT_REPORT">Incident Reports</option>
            <option value="EVIDENCE_REGISTRY">Evidence Registry</option>
            <option value="OFFICER_OBSERVATION">Officer Observations</option>
            <option value="ACTION_LOG">Actions & Directives</option>
          </select>
        </div>
      </div>

      {/* 2. Unified Events Stream Container */}
      <div className="p-6 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm relative space-y-5">
        
        {/* Continuous Spine */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-[#CBD5E1]" />

        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-[#64748B] text-xs">
            No events found matching current filter for case {caseId}.
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div key={ev.id} className="relative flex items-start gap-4 group">
              {/* Event Pin Node */}
              <div className="w-6 h-6 rounded-full bg-[#FFFFFF] border-2 border-[#087E8B] flex items-center justify-center shrink-0 z-10 shadow-sm mt-1">
                <div className="w-2 h-2 rounded-full bg-[#087E8B]" />
              </div>

              {/* Event Card */}
              <div className="flex-1 p-4 rounded-lg bg-[#F8FAFC] group-hover:bg-[#E6F4F5] border border-[#E2E8F0] group-hover:border-[#A7DFE3] transition-all shadow-sm space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#12304A]">{ev.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getSourceBadge(ev.sourceType)}`}>
                      {ev.sourceType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-[#64748B]">{ev.date} • {ev.time}</span>
                </div>

                <p className="text-xs text-[#334155] leading-relaxed font-sans">{ev.description}</p>

                <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-3">
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#7E22CE]" />
                        <span>{ev.location}</span>
                      </span>
                    )}
                    <span>Source: <strong className="text-[#12304A]">{ev.sourceId}</strong></span>
                  </div>

                  <button
                    onClick={() => handleInspectSource(ev)}
                    className="text-[#087E8B] hover:text-[#06636E] font-semibold flex items-center gap-1"
                  >
                    <span>View Source Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
};
