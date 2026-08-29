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
  Filter
} from 'lucide-react';
import { TimelineEvent } from '../../types';
import { timelineService } from '../../services/timelineService';
import { useInvestigation } from '../../context/InvestigationContext';

export const InvestigationTimeline: React.FC = () => {
  const { navigateTo, setSelectedEntityId, activeCaseId } = useInvestigation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterEntity, setFilterEntity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await timelineService.getEvents({
        caseId: activeCaseId || 'CASE-1024',
        entityId: filterEntity || undefined,
        relationshipType: filterType !== 'ALL' ? filterType : undefined
      });
      setEvents(data);
    } catch (err) {
      console.warn('Timeline fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [filterType, filterEntity, activeCaseId]);

  const getEventIcon = (category?: string) => {
    switch (category) {
      case 'COMMUNICATION': return PhoneCall;
      case 'PHYSICAL_SURVEILLANCE': return MapPin;
      case 'FINANCIAL': return CreditCard;
      case 'INTELLIGENCE_REPORT': return Building2;
      default: return Users;
    }
  };

  const handleInspectEntity = (entityId?: string) => {
    if (!entityId) return;
    setSelectedEntityId(entityId);
    navigateTo('network', { entityId });
  };

  return (
    <div className="max-w-5xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* Filter and Search Bar */}
      <div className="intel-card p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1527]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Chronological Multi-Source Event Timeline ({events.length} Events)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              placeholder="Filter by entity (e.g. Person_044)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="CALLED">Calls (CDR)</option>
            <option value="TRANSFERRED">Transactions (Swift/UPI)</option>
            <option value="VISITED">Locations (ANPR/CCTV)</option>
            <option value="ASSOCIATED_WITH">FIR / Incident Text</option>
          </select>
        </div>
      </div>

      {/* Vertical Timeline Card Feed */}
      <div className="intel-card p-6 border border-slate-800 space-y-6">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading chronological event sequence...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No events match the specified filter.
          </div>
        ) : (
          <div className="relative border-l border-slate-800 ml-4 space-y-6">
            {events.map((event, idx) => {
              const Icon = getEventIcon(event.category);
              const srcId = event.sourceEntity || event.sourceEntityId || 'Source';
              const tgtId = event.targetEntity || event.targetEntityId || 'Target';
              return (
                <div key={event.id || idx} className="relative pl-6 group">
                  {/* Timeline Dot Icon */}
                  <div className={`absolute -left-3 top-1.5 p-1 rounded-full border ${
                    event.flaggedAnomaly 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                      : 'bg-slate-900 border-slate-700 text-blue-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Event Detail Card */}
                  <div className="p-4 rounded-lg bg-[#090e1a] hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {event.timeFormatted || event.timeDisplay || '10:30'} • {event.dateFormatted || event.dateDisplay || '26 Aug 2026'}
                        </span>
                        {event.flaggedAnomaly && (
                          <span className="px-2 py-0.2 rounded text-[10px] bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>ANOMALY DETECTED</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{event.sourceRecord || event.sourceCategory}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-white">
                      <button
                        onClick={() => handleInspectEntity(srcId)}
                        className="text-blue-300 hover:underline font-bold"
                      >
                        {srcId}
                      </button>
                      <span className="text-slate-500 font-sans text-xs">→ [{event.relationship}] →</span>
                      <button
                        onClick={() => handleInspectEntity(tgtId)}
                        className="text-blue-300 hover:underline font-bold"
                      >
                        {tgtId}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {event.summary || event.description}
                    </p>

                    {event.metadata && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
                        {event.metadata.duration && <span>Duration: <strong className="text-slate-300">{event.metadata.duration}</strong></span>}
                        {event.metadata.amount && <span>Amount: <strong className="text-emerald-400">{event.metadata.amount}</strong></span>}
                        {event.metadata.location && <span>Location: <strong className="text-purple-300">{event.metadata.location}</strong></span>}
                        {event.metadata.tower && <span>Tower: <strong className="text-slate-300">{event.metadata.tower}</strong></span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
