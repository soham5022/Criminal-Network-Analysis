import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  FileSpreadsheet, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { DetailedTimelineEvent } from '../../services/timelineService';
import { useInvestigation } from '../../context/InvestigationContext';

interface TimelineEventDetailsModalProps {
  event: DetailedTimelineEvent;
  onClose: () => void;
}

export const TimelineEventDetailsModal: React.FC<TimelineEventDetailsModalProps> = ({ event, onClose }) => {
  const { openEntityProfile, navigateTo, setActiveCaseTab, setSelectedEntityId } = useInvestigation();

  const handleOpenSource = () => {
    if (event.sourceWitnessRef) {
      setActiveCaseTab('witnesses');
      onClose();
    } else if (event.sourceEvidenceRef) {
      navigateTo('evidence');
      onClose();
    } else if (event.sourceDocumentRef) {
      navigateTo('case-records');
      onClose();
    } else if (event.category === 'ALERTS') {
      navigateTo('alerts');
      onClose();
    } else {
      setActiveCaseTab('overview');
      onClose();
    }
  };

  const handleOpenEntity = () => {
    if (event.primaryEntityId) {
      openEntityProfile(event.primaryEntityId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-2xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{event.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase">
                  {event.category}
                </span>
                {event.isAnomaly && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                    ANALYTICAL ANOMALY
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {event.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#090e1a] border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Timestamp</span>
              <span className="font-mono text-slate-200">{event.dateFormatted} • {event.timeFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Case Scope</span>
              <span className="font-mono text-blue-400 font-bold">{event.caseId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Recorded By</span>
              <span className="text-slate-200">{event.recordedBy}</span>
            </div>
          </div>

          {/* Description Narrative */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Event Narrative & Investigation Context
            </span>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              {event.description}
            </div>
          </div>

          {/* Location if present */}
          {event.location && (
            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Location / Jurisdiction</span>
                  <span className="text-slate-200 font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Linked Subject / Entity */}
          {event.primaryEntityLabel && (
            <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Related Entity / Subject</span>
                <span className="font-bold text-white text-xs">{event.primaryEntityLabel}</span>
                {event.primaryEntityId && (
                  <span className="text-[10px] text-slate-400 font-mono block">ID: {event.primaryEntityId}</span>
                )}
              </div>

              {event.primaryEntityId && (
                <button
                  onClick={handleOpenEntity}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>View 360° Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Source Attribution Box */}
          <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                Verifiable Source Record
              </span>
              <div className="font-mono text-xs font-bold text-white">
                {event.sourceType}: {event.sourceId}
              </div>
            </div>

            <button
              onClick={handleOpenSource}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>View Source Record</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Confidence: {Math.round((event.confidence || 1) * 100)}% Verified
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
