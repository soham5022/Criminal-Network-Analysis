import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  PhoneCall, 
  MapPin, 
  CreditCard, 
  Building2, 
  Search, 
  AlertTriangle, 
  Filter, 
  FileText, 
  FileSpreadsheet, 
  UserCheck, 
  Eye, 
  Calendar 
} from 'lucide-react';
import { 
  timelineService, 
  DetailedTimelineEvent, 
  TimelineCategory, 
  TimelineStats 
} from '../../services/timelineService';
import { useInvestigation } from '../../context/InvestigationContext';
import { mockCases } from '../../data/mockCases';
import { TimelineEventDetailsModal } from './TimelineEventDetailsModal';

export const InvestigationTimeline: React.FC = () => {
  const { navigateTo, openEntityProfile, activeCaseId, setActiveCaseId } = useInvestigation();
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
    const caseId = activeCaseId || mockCases[0]?.id || 'CASE-1024';
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
      <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#087E8B]">{activeCaseId}</span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                CASE INVESTIGATION TIMELINE
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#12304A] tracking-tight">
              Chronological Multi-Source Event Stream
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium">Case Scope:</span>
            <select
              value={activeCaseId}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#12304A] focus:outline-none focus:border-[#087E8B] shadow-sm cursor-pointer"
            >
              {mockCases.map((c) => (
                <option key={c.id} value={c.id}>
                  📁 {c.id} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic 5 KPI Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#12304A] font-mono">{stats.totalEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Total Events</div>
          </div>
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#087E8B] font-mono">{stats.evidenceEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Evidence Events</div>
          </div>
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#16805C] font-mono">{stats.witnessEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Witness Events</div>
          </div>
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#2563A6] font-mono">{stats.investigationEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Investigation Actions</div>
          </div>
          <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-0.5">
            <div className="text-lg font-bold text-[#B7791F] font-mono">{stats.alertEvents}</div>
            <div className="text-[10px] text-[#64748B] uppercase">Alerts</div>
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search timeline events, subjects, locations..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B]"
              />
              <span className="text-[#64748B]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B]"
              />
            </div>

            {(startDate || endDate || search || selectedCategory !== 'ALL') && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSearch('');
                  setSelectedCategory('ALL');
                }}
                className="text-[11px] text-[#087E8B] hover:text-[#06636E] font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#E2E8F0]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                  : 'bg-[#FFFFFF] text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Chronological Events Stream */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E8F0] shadow-sm relative space-y-6">
        {/* Continuous Center Timeline Spine */}
        <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-[#CBD5E1]" />

        {events.length === 0 ? (
          <div className="py-12 text-center text-[#64748B] text-xs">
            No chronological records found matching selected filters for {activeCaseId}.
          </div>
        ) : (
          events.map((evt) => {
            const Icon = getCategoryIcon(evt.category);
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="relative flex items-start gap-5 cursor-pointer group"
              >
                {/* Event Icon Pin on Timeline Spine */}
                <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border-2 border-[#087E8B] flex items-center justify-center text-[#087E8B] shrink-0 z-10 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Event Details Card */}
                <div className="flex-1 p-4 rounded-lg bg-[#F8FAFC] group-hover:bg-[#E6F4F5] border border-[#E2E8F0] group-hover:border-[#A7DFE3] transition-all shadow-sm space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#12304A] text-sm">{evt.title}</span>
                      <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-[#FFFFFF] text-[#087E8B] border border-[#CBD5E1] uppercase">
                        {evt.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748B]">
                      <span>{evt.dateFormatted}</span>
                      <span>•</span>
                      <span>{evt.timeFormatted}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed font-sans">{evt.description}</p>

                  <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                    <div className="flex items-center gap-3">
                      <span>Source: <strong className="text-[#12304A]">{evt.sourceType || evt.sourceId}</strong></span>
                      {evt.location && <span>Location: <strong className="text-[#12304A]">{evt.location}</strong></span>}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(evt);
                      }}
                      className="text-[#087E8B] hover:text-[#06636E] font-semibold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Event</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <TimelineEventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </div>
  );
};
