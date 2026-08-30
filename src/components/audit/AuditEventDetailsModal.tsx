import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  User, 
  Folder, 
  FileSpreadsheet, 
  FileText, 
  ExternalLink, 
  AlertTriangle,
  MapPin,
  CheckCircle2,
  AlertCircle
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-2xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{event.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase">
                  {event.module}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${
                  event.status === 'SUCCESS'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {event.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {event.actionLabel}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#090e1a] border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Officer / User</span>
              <span className="text-white font-medium">{event.userName}</span>
              <div className="text-[10px] text-slate-400 font-mono">Badge: {event.userBadge}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Timestamp</span>
              <span className="font-mono text-slate-200">{event.dateFormatted}</span>
              <div className="text-[10px] text-slate-400 font-mono">{event.timeFormatted}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Node IP & Terminal</span>
              <span className="font-mono text-slate-300 text-[11px]">{event.ipAddress}</span>
            </div>
          </div>

          {/* Action Details Narrative */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Audit Event Log Details
            </span>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              {event.details}
            </div>
          </div>

          {/* Target Associations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Case Association */}
            <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Associated Case</span>
                <span className="font-mono text-blue-400 font-bold">{event.caseId || 'None (System-Level)'}</span>
              </div>

              {event.caseId && (
                <button
                  onClick={handleOpenCase}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Open Case</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Record Association */}
            <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Referenced Target Record</span>
                <span className="font-bold text-white truncate block">
                  {event.recordLabel || event.recordId || 'None'}
                </span>
                {event.recordId && event.recordType && (
                  <span className="text-[10px] font-mono text-slate-400">{event.recordType}: {event.recordId}</span>
                )}
              </div>

              {event.recordId && (
                <button
                  onClick={handleOpenRecord}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Security Compliance Note */}
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 text-[11px] text-slate-300 font-sans leading-relaxed">
            <strong>Immutable LEA Ledger:</strong> This audit event was recorded automatically at the application execution layer. Cryptographic integrity is verified against unauthorized alteration.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Role: {event.userRole} • Verified
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
