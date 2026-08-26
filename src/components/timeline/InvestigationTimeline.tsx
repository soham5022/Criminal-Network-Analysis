import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  PhoneCall, 
  MapPin, 
  CreditCard, 
  Building2, 
  Users, 
  Search,
  AlertTriangle
} from 'lucide-react';
import { TimelineEvent } from '../../types';
import { timelineService } from '../../services/timelineService';
import { useInvestigation } from '../../context/InvestigationContext';

export const InvestigationTimeline: React.FC = () => {
  const { navigateTo, setSelectedEntityId } = useInvestigation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filterRelType, setFilterRelType] = useState<string>('ALL');
  const [filterEntity, setFilterEntity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await timelineService.getEvents({
        caseId: 'CASE-1024',
        entityId: filterEntity || undefined,
        relationshipType: filterRelType !== 'ALL' ? filterRelType : undefined
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
  }, [filterRelType, filterEntity]);

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
    <div className="space-y-4 select-none">
      {/* Filter and Search Bar */}
      <div className="intel-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Chronological Multi-Source Event Stream ({events.length} Events)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              placeholder="Filter by entity (e.g. Person_044)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={filterRelType}
            onChange={(e) => setFilterRelType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="CALLED">Calls (CDR)</option>
            <option value="TRANSFERRED">Transfers (Swift)</option>
            <option value="VISITED">Visits (ANPR/CCTV)</option>
            <option value="ASSOCIATED_WITH">FIR / Incident Text</option>
          </select>
        </div>
      </div>

      {/* Vertical Timeline Card Feed */}
      <div className="intel-card p-6 rounded-xl border border-slate-800 space-y-6">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Extracting timestamped events directly from graph relationships...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
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
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
                      : 'bg-slate-900 border-slate-700 text-cyan-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Event Detail Card */}
                  <div className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-300">
                          {event.timeFormatted || event.timeDisplay || '12:00'} // {event.dateFormatted || event.dateDisplay || '26 Aug 2026'}
                        </span>
                        {event.flaggedAnomaly && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono text-rose-300 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>ANOMALY LEAD</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{event.sourceRecord || event.sourceCategory}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono text-white">
                      <button
                        onClick={() => handleInspectEntity(srcId)}
                        className="hover:text-cyan-400 underline decoration-cyan-500/40 font-bold"
                      >
                        {srcId}
                      </button>
                      <span className="text-slate-500">─[ {event.relationship} ]─▶</span>
                      <button
                        onClick={() => handleInspectEntity(tgtId)}
                        className="hover:text-cyan-400 underline decoration-cyan-500/40 font-bold"
                      >
                        {tgtId}
                      </button>
                    </div>

                    {event.notes && (
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
                        {event.notes}
                      </p>
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
