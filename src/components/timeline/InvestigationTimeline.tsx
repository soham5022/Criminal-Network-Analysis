import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  PhoneCall, 
  MapPin, 
  CreditCard, 
  Building2, 
  Users, 
  Search,
  AlertTriangle,
  ExternalLink,
  Filter,
  FileText,
  FileSpreadsheet,
  UserCheck,
  Calendar,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { 
  timelineService, 
  DetailedTimelineEvent, 
  TimelineCategory, 
  TimelineStats 
} from '../../services/timelineService';
import { useInvestigation } from '../../context/InvestigationContext';
import { TimelineEventDetailsModal } from './TimelineEventDetailsModal';

export const InvestigationTimeline: React.FC = () => {
  const { navigateTo, openEntityProfile, activeCaseId } = useInvestigation();
  const [events, setEvents] = useState<DetailedTimelineEvent[]>([]);
  const [stats, setStats] = useState<TimelineStats>({
    totalEvents: 0,
    evidenceEvents: 0,
    witnessEvents: 0,
    investigationEvents: 0,
    alertEvents: 0
  });

  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory>('ALL');
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<DetailedTimelineEvent | null>(null);

  const loadTimeline = () => {
    const caseId = activeCaseId || 'CASE-1024';
    const data = timelineService.getCaseEvents({
      caseId,
      category: selectedCategory,
      search,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
    setEvents(data);
    setStats(timelineService.getTimelineStats(caseId));
  };

  useEffect(() => {
    loadTimeline();
  }, [activeCaseId, selectedCategory, search, startDate, endDate]);

  const categories: { id: TimelineCategory; label: string }[] = [
    { id: 'ALL', label: 'All Events' },
    { id: 'INCIDENT', label: 'Incident' },
    { id: 'WITNESSES', label: 'Witnesses' },
    { id: 'EVIDENCE', label: 'Evidence' },
    { id: 'DOCUMENTS', label: 'Documents' },
    { id: 'COMMUNICATION', label: 'Communication (CDR)' },
    { id: 'FINANCIAL', label: 'Financial (SWIFT)' },
    { id: 'LOCATION', label: 'Location (ANPR)' },
    { id: 'INVESTIGATION', label: 'Investigation' },
    { id: 'ALERTS', label: 'Alerts' }
  ];

  const getCategoryIcon = (category: TimelineCategory) => {
    switch (category) {
      case 'COMMUNICATION': return PhoneCall;
      case 'FINANCIAL': return CreditCard;
      case 'LOCATION': return MapPin;
      case 'WITNESSES': return UserCheck;
      case 'EVIDENCE': return FileSpreadsheet;
      case 'DOCUMENTS': return FileText;
      case 'ALERTS': return AlertTriangle;
      case 'INCIDENT': return Building2;
      default: return Clock;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* 1. Header & Dynamic KPI Tiles */}
      <div className="intel-card p-5 border border-slate-800 rounded-xl bg-[#0d1527] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400">{activeCaseId}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                CASE INVESTIGATION TIMELINE
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Chronological Multi-Source Event Stream
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Case Scope:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
              {activeCaseId}
            </span>
          </div>
        </div>

        {/* Dynamic 5 KPI Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-blue-400">{stats.totalEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Total Events</div>
          </div>
          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-purple-400">{stats.evidenceEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Evidence Events</div>
          </div>
          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-emerald-400">{stats.witnessEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Witness Events</div>
          </div>
          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-indigo-400">{stats.investigationEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Investigation Actions</div>
          </div>
          <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-center space-y-0.5">
            <div className="text-lg font-bold text-amber-400">{stats.alertEvents}</div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Alerts</div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0c1322] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search timeline by entity, witness, evidence ID, location, or keyword..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Date Pickers */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 text-[11px] font-semibold">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            {(startDate || endDate || search) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSearch('');
                }}
                className="px-2.5 py-1 text-slate-400 hover:text-white text-xs underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Chronological Event Feed */}
      {events.length === 0 ? (
        <div className="intel-card p-12 border border-slate-800 rounded-xl bg-[#0c1322] text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Investigation Events Recorded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No events match your current filter parameters for {activeCaseId}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => {
            const Icon = getCategoryIcon(ev.category);
            return (
              <div 
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="intel-card p-4 border border-slate-800 rounded-xl bg-[#0c1322] hover:bg-slate-800/40 hover:border-slate-700 cursor-pointer transition-all space-y-2.5 text-xs shadow-lg group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-blue-400 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-blue-400">{ev.id}</span>
                        <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700 uppercase">
                          {ev.category}
                        </span>
                        {ev.isAnomaly && (
                          <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            ANOMALY
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors">
                        {ev.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{ev.dateFormatted} • {ev.timeFormatted}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {ev.description}
                </p>

                {/* Footer Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                  <div className="flex items-center gap-3 text-slate-400">
                    {ev.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate max-w-xs">{ev.location}</span>
                      </div>
                    )}
                    {ev.primaryEntityLabel && (
                      <div className="flex items-center gap-1 font-semibold text-slate-300">
                        <Users className="w-3 h-3 text-blue-400" />
                        <span>{ev.primaryEntityLabel}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Source:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-500/20 text-[10px] font-mono font-bold">
                      {ev.sourceType}: {ev.sourceId}
                    </span>
                    <button className="px-2 py-0.5 rounded bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white text-[10px] font-semibold flex items-center gap-1 transition-colors">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Event Details Modal */}
      {selectedEvent && (
        <TimelineEventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </div>
  );
};
