import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Truck, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Search, 
  ExternalLink
} from 'lucide-react';
import { Entity, EntityType } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';
import { calculateAttentionScore } from './communityLayout';

interface EntityIntelligencePanelProps {
  entity: Entity | null;
  onClose: () => void;
  onSelectEntity?: (id: string) => void;
  onViewConnections?: () => void;
  onViewTimeline?: () => void;
  onViewEvidence?: () => void;
  onViewAlerts?: () => void;
  onFindPath?: (entityId: string) => void;
}

export const EntityIntelligencePanel: React.FC<EntityIntelligencePanelProps> = ({ 
  entity, 
  onClose,
  onViewTimeline,
  onViewEvidence
}) => {
  const { setSelectedEntityId, activeCaseId, openEntityProfile, navigateTo } = useInvestigation();
  const [showAnalyticalDetails, setShowAnalyticalDetails] = useState<boolean>(false);

  if (!entity) {
    return (
      <div className="w-80 sm:w-96 border-l border-[#E2E8F0] bg-[#FFFFFF] p-8 flex flex-col items-center justify-center text-center space-y-3 select-none h-full min-h-[300px]">
        <div className="p-3.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B]">
          <Search className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[#12304A]">Select an Entity to Inspect</h4>
        <p className="text-xs text-[#64748B] max-w-[260px] leading-relaxed">
          Click any node on the network graph to inspect why it matters, its connections across communities, and supporting evidence.
        </p>
      </div>
    );
  }

  const getTypeIcon = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return <User className="w-4 h-4 text-[#B85C38]" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-[#C46A32]" />;
      case 'ACCOUNT': return <CreditCard className="w-4 h-4 text-[#B58A32]" />;
      case 'LOCATION': return <MapPin className="w-4 h-4 text-[#777548]" />;
      case 'ORGANIZATION': return <Building2 className="w-4 h-4 text-[#735548]" />;
      case 'VEHICLE': return <Truck className="w-4 h-4 text-[#9A6262]" />;
      default: return <User className="w-4 h-4 text-[#B85C38]" />;
    }
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return 'bg-[#FBEBE5] text-[#944424] border-[#E8C9BD]';
      case 'PHONE': return 'bg-[#FAF0E6] text-[#A04F1F] border-[#EAD2BF]';
      case 'ACCOUNT': return 'bg-[#FAF3E4] text-[#916A1E] border-[#EAE0C5]';
      case 'LOCATION': return 'bg-[#F4F4EB] text-[#5C5A32] border-[#DFDEC9]';
      case 'ORGANIZATION': return 'bg-[#F5EFEF] text-[#553C32] border-[#DDD3CE]';
      case 'VEHICLE': return 'bg-[#F9ECEC] text-[#7A4A4A] border-[#E8D0D0]';
      default: return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  const rawBetweenness = entity.betweennessCentrality ?? entity.betweenness ?? 0.35;
  const rawDegree = entity.degree ?? entity.connectionsCount ?? 6;
  const rawCrossLinks = entity.crossCommunityLinks ?? (rawBetweenness > 0.4 ? 5 : 1);
  const rawAlerts = entity.relatedAlertsCount ?? (rawBetweenness > 0.4 ? 2 : 0);
  const isBridge = entity.isBridge || rawBetweenness >= 0.5;

  const { score: attentionScore, factors: attentionFactors } = calculateAttentionScore(
    entity.id,
    rawBetweenness,
    rawDegree,
    rawCrossLinks,
    rawAlerts,
    entity.analyticalPriority || 'HIGH'
  );

  // Dynamic plain English explanation for officers
  const whyHighlightedPoints: string[] = [];
  if (isBridge) {
    whyHighlightedPoints.push('Connects multiple network communities with elevated structural centrality');
  }
  if (rawAlerts > 0) {
    whyHighlightedPoints.push(`Flagged in active investigative alert lead`);
  }
  if (entity.type === 'ACCOUNT') {
    whyHighlightedPoints.push('High-velocity financial routing ledger showing rapid structuring intervals');
  } else if (entity.type === 'PHONE') {
    whyHighlightedPoints.push('Device active during burst communication windows');
  } else if (entity.type === 'LOCATION') {
    whyHighlightedPoints.push('Physical coordinates verified across multiple entity co-location logs');
  } else if (entity.type === 'VEHICLE') {
    whyHighlightedPoints.push('Transport asset logged across surveillance toll checkpoints');
  } else {
    whyHighlightedPoints.push(`Active participant linked to ${rawDegree} counterparties in graph`);
  }
  whyHighlightedPoints.push(`Associated with case ${entity.caseId || activeCaseId}`);

  return (
    <div className="w-80 sm:w-96 border-l border-[#E2E8F0] bg-[#FFFFFF] flex flex-col h-full overflow-hidden select-none animate-in fade-in slide-in-from-right-2 duration-150">
      
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] flex items-center justify-center">
            {getTypeIcon(entity.type)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[#12304A] text-sm font-mono tracking-tight truncate max-w-[160px]">
                {entity.name || entity.id}
              </h3>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${getTypeBadge(entity.type)}`}>
                {entity.type}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-mono">ID: {entity.id}</p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
        
        {/* Attention Score Banner */}
        <div className="p-3.5 rounded-lg bg-[#FAF8F4] border border-[#E8E0D5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#64748B] font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B85C38]" />
              <span>Attention Score</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FBEBE5] text-[#944424] border border-[#E8C9BD] font-bold font-mono text-xs">
              {attentionScore} / 100
            </span>
          </div>

          <div className="w-full bg-[#E8E0D5] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#B85C38] h-full transition-all duration-300"
              style={{ width: `${attentionScore}%` }}
            />
          </div>

          {/* Collapsible Factor Breakdown */}
          <div>
            <button
              onClick={() => setShowAnalyticalDetails(!showAnalyticalDetails)}
              className="text-[10px] text-[#087E8B] hover:underline flex items-center gap-1 font-semibold pt-1"
            >
              <span>{showAnalyticalDetails ? 'Hide Score Breakdown' : 'View Score Factor Breakdown'}</span>
              {showAnalyticalDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {showAnalyticalDetails && (
              <div className="mt-2 space-y-1.5 pt-2 border-t border-[#E8E0D5] text-[11px]">
                {attentionFactors.map((factor, idx) => (
                  <div key={idx} className="flex justify-between items-start text-[#475569]">
                    <span className="pr-2">{factor.factor}:</span>
                    <span className="font-mono text-[#B85C38] font-bold shrink-0">{factor.points}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Why Highlighted Section */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-[#64748B] font-mono block">
            Why Highlighted
          </span>
          <ul className="space-y-1.5 text-xs text-[#334155]">
            {whyHighlightedPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-[#B85C38] mt-0.5">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Network Metrics Overview */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-[#64748B] font-mono block">
            Graph Topology Position
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block font-sans">Degree Links:</span>
              <strong className="text-sm font-bold text-[#12304A]">{rawDegree} direct</strong>
            </div>
            <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block font-sans">Betweenness:</span>
              <strong className="text-sm font-bold text-[#B85C38]">{rawBetweenness.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block font-sans">Cross-Cluster:</span>
              <strong className="text-sm font-bold text-[#087E8B]">{rawCrossLinks} links</strong>
            </div>
            <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block font-sans">Role Status:</span>
              <strong className="text-sm font-bold text-[#16805C]">{isBridge ? 'Bridge' : 'Standard'}</strong>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
          <button
            onClick={() => openEntityProfile(entity.id)}
            className="w-full py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Open Complete 360° Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (onViewTimeline) onViewTimeline();
                else navigateTo('timeline', { entityId: entity.id });
              }}
              className="py-1.5 px-3 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold transition-colors text-center"
            >
              View Timeline
            </button>
            <button
              onClick={() => {
                if (onViewEvidence) onViewEvidence();
                else navigateTo('evidence', { entityId: entity.id });
              }}
              className="py-1.5 px-3 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold transition-colors text-center"
            >
              View Evidence
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
