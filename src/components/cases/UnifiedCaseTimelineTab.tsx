import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  FileText, 
  UserCheck, 
  Eye, 
  ClipboardList, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  Search, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
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
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'INCIDENT_REPORT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'EVIDENCE_REGISTRY':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'OFFICER_OBSERVATION':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'ACTION_LOG':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in select-none">
      
      {/* 1. Header & Filters Bar */}
      <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0d1527] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
            <Clock className="w-4 h-4" />
            <span>UNIFIED INVESTIGATION EVENT LOG</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Case Chronology & Source Attribution Stream
          </h2>
          <p className="text-xs text-slate-400">
            Complete chronological event log linking incidents, witness interviews, evidence collections, and field observations to their verifiable sources.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event log..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Source Types ({events.length})</option>
            <option value="WITNESS_STATEMENT">Witness Statements</option>
            <option value="OFFICER_OBSERVATION">Officer Observations</option>
            <option value="INCIDENT_REPORT">Incident Reports</option>
            <option value="ACTION_LOG">Investigation Actions</option>
          </select>
        </div>
      </div>

      {/* 2. Events Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="intel-card p-12 border border-slate-800 rounded-xl bg-[#0c1322] text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Investigation Events Recorded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No events match your current filter parameters for this case.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <div 
              key={ev.id}
              className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0c1322] hover:bg-slate-800/40 transition-colors space-y-2.5 text-xs shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getSourceBadge(ev.sourceType)}`}>
                    {ev.sourceType.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm">{ev.title}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{ev.date} • {ev.time}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                {ev.description}
              </p>

              {/* Source Attribution & Deep Link Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate max-w-xs">{ev.location}</span>
                </div>

                {/* Explicit Source Chip */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">Verifiable Source:</span>
                  
                  {ev.sourceWitnessRef ? (
                    <button
                      onClick={() => setActiveCaseTab('witnesses')}
                      className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Witness: {ev.sourceWitnessRef}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  ) : ev.sourceEvidenceRef ? (
                    <button
                      onClick={() => navigateTo('evidence')}
                      className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 hover:text-white border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Evidence: {ev.sourceEvidenceRef}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono">
                      {ev.sourceId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
