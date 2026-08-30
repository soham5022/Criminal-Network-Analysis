import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { AuditEvent } from '../../services/auditService';
import { useInvestigation } from '../../context/InvestigationContext';

interface AuditEventDetailsModalProps {
  event: AuditEvent;
  onClose: () => void;
}

export const AuditEventDetailsModal: React.FC<AuditEventDetailsModalProps> = ({ event, onClose }) => {
  const { navigateTo, openEntityProfile, setActiveCaseId, setActiveCaseTab } = useInvestigation();

  const handleOpenCase = () => {
    if (event.caseId) {
      setActiveCaseId(event.caseId);
      navigateTo('case-details', { caseId: event.caseId, tab: 'overview' });
      onClose();
    }
  };

  const handleOpenRecord = () => {
    if (!event.recordId && !event.recordType) return;

    if (event.recordType === 'PERSON' || event.recordType === 'PHONE' || event.recordType === 'ACCOUNT' || event.recordType === 'VEHICLE') {
      openEntityProfile(event.recordId || 'Person_044');
      onClose();
    } else if (event.recordType === 'EVIDENCE') {
      if (event.caseId) setActiveCaseId(event.caseId);
      navigateTo('evidence');
      onClose();
    } else if (event.recordType === 'REPORT') {
      if (event.caseId) setActiveCaseId(event.caseId);
      navigateTo('reports');
      onClose();
    } else if (event.recordType === 'WITNESS' || event.recordType === 'STATEMENT') {
      if (event.caseId) setActiveCaseId(event.caseId);
      setActiveCaseTab('witnesses');
      onClose();
    } else if (event.recordType === 'ALERT') {
      if (event.caseId) setActiveCaseId(event.caseId);
      navigateTo('alerts', { alertId: event.recordId });
      onClose();
    } else if (event.caseId) {
      handleOpenCase();
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#087E8B]">{event.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#475569] border border-[#E2E8F0] font-bold uppercase">
                  {event.module}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${
                  event.status === 'SUCCESS'
                    ? 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]'
                    : 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]'
                }`}>
                  {event.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#12304A] mt-0.5">
                {event.actionLabel}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Officer / User</span>
              <span className="text-[#12304A] font-semibold">{event.userName}</span>
              <div className="text-[10px] text-[#64748B] font-mono">Badge: {event.userBadge}</div>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Timestamp</span>
              <span className="font-mono text-[#12304A] font-semibold">{event.dateFormatted}</span>
              <div className="text-[10px] text-[#64748B] font-mono">{event.timeFormatted}</div>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Node IP & Terminal</span>
              <span className="font-mono text-[#475569] text-[11px]">{event.ipAddress}</span>
            </div>
          </div>

          {/* Action Details Narrative */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Audit Event Log Details
            </span>
            <div className="p-3.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] leading-relaxed font-sans shadow-sm">
              {event.details}
            </div>
          </div>

          {/* Target Associations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Case Association */}
            <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Associated Case</span>
                <span className="font-mono text-[#087E8B] font-bold">{event.caseId || 'None (System-Level)'}</span>
              </div>

              {event.caseId && (
                <button
                  onClick={handleOpenCase}
                  className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#087E8B] text-[11px] font-semibold flex items-center gap-1 border border-[#CBD5E1] transition-colors shadow-sm"
                >
                  <span>Open Case</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Record Association */}
            <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Referenced Target Record</span>
                <span className="font-bold text-[#12304A] truncate block">
                  {event.recordLabel || event.recordId || 'None'}
                </span>
                {event.recordId && event.recordType && (
                  <span className="text-[10px] font-mono text-[#64748B]">{event.recordType}: {event.recordId}</span>
                )}
              </div>

              {event.recordId && (
                <button
                  onClick={handleOpenRecord}
                  className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#087E8B] text-[11px] font-semibold flex items-center gap-1 border border-[#CBD5E1] transition-colors shrink-0 shadow-sm"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Security Compliance Note */}
          <div className="p-3 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-[11px] text-[#475569] font-sans leading-relaxed">
            <strong className="text-[#12304A]">Immutable LEA Ledger:</strong> This audit event was recorded automatically at the application execution layer. Cryptographic integrity is verified against unauthorized alteration.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B] font-mono">
            Role: {event.userRole} • Verified
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
