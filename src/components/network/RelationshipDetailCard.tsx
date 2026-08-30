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
    <div className="absolute bottom-4 left-4 z-30 max-w-sm w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
            RELATIONSHIP INSPECTOR
          </span>
          {edgeData.isAnomaly && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Flagged Anomaly</span>
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#64748B] hover:text-[#12304A] p-0.5 rounded transition-colors"
          title="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Relationship Flow: Source -> Type -> Target */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelectEntity(edgeData.source)}
            className="font-mono font-bold text-[#12304A] hover:text-[#087E8B] flex items-center gap-1 group transition-colors"
          >
            <span>{edgeData.source}</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#64748B] group-hover:text-[#087E8B]" />
          </button>
          
          <span className="px-2 py-0.5 rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3] text-[10px] font-bold tracking-wide">
            {formatRelType(edgeData.type)}
          </span>

          <button
            onClick={() => onSelectEntity(edgeData.target)}
            className="font-mono font-bold text-[#12304A] hover:text-[#087E8B] flex items-center gap-1 group transition-colors"
          >
            <span>{edgeData.target}</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#64748B] group-hover:text-[#087E8B]" />
          </button>
        </div>

        <div className="flex items-center justify-center text-[#64748B] py-0.5">
          <ArrowRight className="w-4 h-4 text-[#087E8B]" />
        </div>
      </div>

      {/* Structured Details */}
      <div className="space-y-1.5 text-[11px]">
        {/* Timestamp */}
        <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#64748B]" />
            <span>Timestamp:</span>
          </span>
          <span className="font-mono text-[#17212B] font-medium">{displayTime}</span>
        </div>

        {/* Source Ledger */}
        <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-[#64748B]" />
            <span>Source:</span>
          </span>
          <span className="font-mono text-[#087E8B] font-medium">
            {getSourceTypeLabel(edgeData.sourceType)}
          </span>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#16805C]" />
            <span>Confidence:</span>
          </span>
          <span className="font-mono text-[#16805C] font-bold">
            {Math.round((edgeData.confidence || 0.92) * 100)}% Verified
          </span>
        </div>

        {/* Amount (if financial) */}
        {(edgeData as any).amount && (
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-[#B7791F]" />
              <span>Transferred Amount:</span>
            </span>
            <span className="font-mono text-[#B7791F] font-bold">
              ₹{Number((edgeData as any).amount).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Frequency / Calls (if telephony or visited) */}
        {edgeData.frequency && (
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-[#087E8B]" />
              <span>Recorded Frequency:</span>
            </span>
            <span className="font-mono text-[#17212B] font-medium">
              {edgeData.frequency} interactions
            </span>
          </div>
        )}

        {/* Location (if location/visited) */}
        {(edgeData as any).locationName && (
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0]">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#7E22CE]" />
              <span>Location:</span>
            </span>
            <span className="font-medium text-[#7E22CE] truncate max-w-[180px]">
              {(edgeData as any).locationName}
            </span>
          </div>
        )}

        {/* Analyst / Evidence Notes */}
        {(edgeData as any).notes && (
          <div className="pt-1.5 text-[10px] text-[#475569] bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]">
            <span className="text-[#64748B] font-semibold uppercase block mb-0.5">Evidence Note:</span>
            {(edgeData as any).notes}
          </div>
        )}
      </div>
    </div>
  );
};
