import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  ExternalLink
} from 'lucide-react';
import { DetailedTimelineEvent } from '../../services/timelineService';
import { useInvestigation } from '../../context/InvestigationContext';

interface TimelineEventDetailsModalProps {
  event: DetailedTimelineEvent;
  onClose: () => void;
}

export const TimelineEventDetailsModal: React.FC<TimelineEventDetailsModalProps> = ({ event, onClose }) => {
  const { openEntityProfile, navigateTo, setActiveCaseTab } = useInvestigation();

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#087E8B]">{event.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#475569] border border-[#E2E8F0] font-bold uppercase">
                  {event.category}
                </span>
                {event.isAnomaly && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5] font-bold">
                    ANALYTICAL ANOMALY
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#12304A] mt-0.5">
                {event.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Timestamp</span>
              <span className="font-mono text-[#12304A] font-semibold">{event.dateFormatted} • {event.timeFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Case Scope</span>
              <span className="font-mono text-[#087E8B] font-bold">{event.caseId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Recorded By</span>
              <span className="text-[#12304A]">{event.recordedBy}</span>
            </div>
          </div>

          {/* Description Narrative */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Event Narrative & Investigation Context
            </span>
            <div className="p-3.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] leading-relaxed font-sans shadow-sm">
              {event.description}
            </div>
          </div>

          {/* Location if present */}
          {event.location && (
            <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7E22CE] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Location / Jurisdiction</span>
                  <span className="text-[#12304A] font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Linked Subject / Entity */}
          {event.primaryEntityLabel && (
            <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Related Entity / Subject</span>
                <span className="font-bold text-[#12304A] text-xs">{event.primaryEntityLabel}</span>
                {event.primaryEntityId && (
                  <span className="text-[10px] text-[#64748B] font-mono block">ID: {event.primaryEntityId}</span>
                )}
              </div>

              {event.primaryEntityId && (
                <button
                  onClick={handleOpenEntity}
                  className="px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>View 360° Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Source Attribution Box */}
          <div className="p-3.5 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087E8B] block">
                Verifiable Source Record
              </span>
              <div className="font-mono text-xs font-bold text-[#12304A]">
                {event.sourceType}: {event.sourceId}
              </div>
            </div>

            <button
              onClick={handleOpenSource}
              className="px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#087E8B] hover:text-[#06636E] text-xs font-semibold flex items-center gap-1.5 border border-[#CBD5E1] transition-colors shadow-sm"
            >
              <span>View Source Record</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B] font-mono">
            Confidence: {Math.round((event.confidence || 1) * 100)}% Verified
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
