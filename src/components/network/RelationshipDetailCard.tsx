import React from 'react';
import { 
  X, 
  ArrowRight, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  PhoneCall, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { CytoscapeEdgeData } from '../../services/networkService';
import { RelationshipType } from '../../types';

interface RelationshipDetailCardProps {
  edgeData: CytoscapeEdgeData | null;
  onClose: () => void;
  onSelectEntity: (id: string) => void;
}

export const RelationshipDetailCard: React.FC<RelationshipDetailCardProps> = ({
  edgeData,
  onClose,
  onSelectEntity
}) => {
  if (!edgeData) return null;

  const formatRelType = (type: RelationshipType | string) => {
    switch (type) {
      case 'CALLED': return 'CALLED (Telephony)';
      case 'TRANSFERRED': return 'TRANSFERRED FUNDS';
      case 'VISITED': return 'VISITED LOCATION';
      case 'ASSOCIATED_WITH': return 'ASSOCIATED WITH';
      case 'OWNED': return 'OWNS / OPERATES';
      case 'MET': return 'PHYSICAL RENDEZVOUS';
      case 'CO_LOCATED': return 'CO-LOCATED AT';
      default: return type;
    }
  };

  const getSourceTypeLabel = (sourceType?: string) => {
    if (!sourceType) return 'INTELLIGENCE_LEDGER';
    switch (sourceType) {
      case 'CDR': return 'CDR_00441 (Telephony Ledger)';
      case 'BANKING_SWIFT': return 'BANKING_SWIFT (Ledger)';
      case 'CCTV_FACIAL': return 'CCTV_FACIAL (Optical Feed)';
      case 'SURVEILLANCE_LOG': return 'SURVEILLANCE_LOG (Field Team)';
      case 'INCIDENT_FIR': return 'FIR_LOG (Police Records)';
      default: return sourceType;
    }
  };

  // Format timestamp nicely if present in ISO/string
  const displayTime = (edgeData as any).timestamp 
    ? new Date((edgeData as any).timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '26 Aug 2026 — 14:10';

  return (
    <div className="absolute bottom-4 left-4 z-30 max-w-sm w-full bg-[#0b1326]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            RELATIONSHIP INSPECTOR
          </span>
          {edgeData.isAnomaly && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Flagged Anomaly</span>
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Relationship Flow: Source -> Type -> Target */}
      <div className="bg-[#070b14] border border-slate-800 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelectEntity(edgeData.source)}
            className="font-mono font-bold text-white hover:text-blue-400 flex items-center gap-1 group transition-colors"
          >
            <span>{edgeData.source}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-blue-400" />
          </button>
          
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold tracking-wide">
            {formatRelType(edgeData.type)}
          </span>

          <button
            onClick={() => onSelectEntity(edgeData.target)}
            className="font-mono font-bold text-white hover:text-blue-400 flex items-center gap-1 group transition-colors"
          >
            <span>{edgeData.target}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-blue-400" />
          </button>
        </div>

        <div className="flex items-center justify-center text-slate-500 py-0.5">
          <ArrowRight className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      {/* Structured Details */}
      <div className="space-y-1.5 text-[11px]">
        {/* Timestamp */}
        <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Timestamp:</span>
          </span>
          <span className="font-mono text-slate-200 font-medium">{displayTime}</span>
        </div>

        {/* Source Ledger */}
        <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-slate-400" />
            <span>Source:</span>
          </span>
          <span className="font-mono text-cyan-300 font-medium">
            {getSourceTypeLabel(edgeData.sourceType)}
          </span>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Confidence:</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {Math.round((edgeData.confidence || 0.92) * 100)}% Verified
          </span>
        </div>

        {/* Amount (if financial) */}
        {(edgeData as any).amount && (
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>Transferred Amount:</span>
            </span>
            <span className="font-mono text-amber-300 font-bold">
              ₹{Number((edgeData as any).amount).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Frequency / Calls (if telephony or visited) */}
        {edgeData.frequency && (
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>Recorded Frequency:</span>
            </span>
            <span className="font-mono text-slate-200 font-medium">
              {edgeData.frequency} interactions
            </span>
          </div>
        )}

        {/* Location (if location/visited) */}
        {(edgeData as any).locationName && (
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span>Location:</span>
            </span>
            <span className="font-medium text-purple-300 truncate max-w-[180px]">
              {(edgeData as any).locationName}
            </span>
          </div>
        )}

        {/* Analyst / Evidence Notes */}
        {(edgeData as any).notes && (
          <div className="pt-1.5 text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase block mb-0.5">Evidence Note:</span>
            {(edgeData as any).notes}
          </div>
        )}
      </div>
    </div>
  );
};
