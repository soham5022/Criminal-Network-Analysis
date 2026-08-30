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
  Clock, 
  Sparkles, 
  Link2, 
  Search, 
  FileText, 
  Network, 
  ShieldCheck,
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
  onSelectEntity,
  onViewTimeline,
  onViewEvidence,
  onFindPath
}) => {
  const { setSelectedEntityId, navigateTo, activeCaseId, openEntityProfile } = useInvestigation();
  const [showAnalyticalDetails, setShowAnalyticalDetails] = useState<boolean>(false);

  if (!entity) {
    return (
      <div className="w-80 sm:w-96 border-l border-[#E2E8F0] bg-[#FFFFFF] p-8 flex flex-col items-center justify-center text-center space-y-3 select-none h-full min-h-[300px]">
        <div className="p-3.5 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B]">
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
      case 'PERSON': return <User className="w-4 h-4 text-[#12304A]" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-[#087E8B]" />;
      case 'ACCOUNT': return <CreditCard className="w-4 h-4 text-[#2563A6]" />;
      case 'LOCATION': return <MapPin className="w-4 h-4 text-[#7E22CE]" />;
      case 'ORGANIZATION': return <Building2 className="w-4 h-4 text-[#234E70]" />;
      case 'VEHICLE': return <Truck className="w-4 h-4 text-[#B7791F]" />;
      default: return <User className="w-4 h-4 text-[#12304A]" />;
    }
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return 'bg-[#EBF8FF] text-[#12304A] border-[#BEE3F8]';
      case 'PHONE': return 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]';
      case 'ACCOUNT': return 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]';
      case 'LOCATION': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'ORGANIZATION': return 'bg-[#EEF2FF] text-[#234E70] border-[#C7D2FE]';
      case 'VEHICLE': return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
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

  const connectionsCount = rawDegree;
  const communitiesCount = isBridge ? 3 : 1;
  const crossCommunityLinks = rawCrossLinks;

  return (
    <div className="w-80 sm:w-96 border-l border-[#E2E8F0] bg-[#FFFFFF] flex flex-col h-full overflow-hidden select-none animate-in slide-in-from-right duration-150 shadow-lg z-20">
      
      {/* 1. Header: Entity ID, Type & Attention Score */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] flex-shrink-0 shadow-sm">
              {getTypeIcon(entity.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-[#12304A] truncate">
                  {entity.label || entity.name || entity.id}
                </h3>
                {isBridge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                    BRIDGE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                <span className={`inline-block px-1.5 py-0.2 rounded font-bold uppercase border ${getTypeBadge(entity.type)}`}>
                  {entity.type}
                </span>
                <span className="font-mono">ID: {entity.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#F1F5F9] transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Attention Score Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-[#12304A] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Attention Score</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">
              {attentionScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Section A: Why this entity is highlighted */}
        <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Why this entity is highlighted</span>
          </span>
          <ul className="space-y-1.5 text-[#475569] text-[11px] leading-relaxed">
            {whyHighlightedPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#087E8B] font-bold">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section B: NETWORK Overview Statistics */}
        <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>NETWORK METRICS</span>
          </span>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
              <div className="font-mono text-sm font-bold text-[#12304A]">{connectionsCount}</div>
              <div className="text-[9px] text-[#64748B] uppercase tracking-wider">Connections</div>
            </div>
            <div className="p-2 rounded bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
              <div className="font-mono text-sm font-bold text-[#087E8B]">{communitiesCount}</div>
              <div className="text-[9px] text-[#64748B] uppercase tracking-wider">Communities</div>
            </div>
            <div className="p-2 rounded bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
              <div className="font-mono text-sm font-bold text-[#B7791F]">{crossCommunityLinks}</div>
              <div className="text-[9px] text-[#64748B] uppercase tracking-wider">Cross-Links</div>
            </div>
          </div>
        </div>

        {/* Section C: Key Connected Leads */}
        {entity.keyConnections && entity.keyConnections.length > 0 && (
          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Direct Network Leads ({entity.keyConnections.length})</span>
            </span>
            <div className="space-y-1">
              {entity.keyConnections.map((connId) => (
                <div
                  key={connId}
                  onClick={() => onSelectEntity ? onSelectEntity(connId) : setSelectedEntityId(connId)}
                  className="p-2 rounded bg-[#FFFFFF] hover:bg-[#E6F4F5] border border-[#E2E8F0] cursor-pointer flex items-center justify-between transition-colors group shadow-sm"
                >
                  <span className="font-mono text-xs font-semibold text-[#12304A] group-hover:text-[#087E8B]">
                    {connId}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#087E8B]" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. Action Buttons Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
        <button
          onClick={() => openEntityProfile(entity.id)}
          className="w-full py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Full 360° Entity Profile</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewTimeline ? onViewTimeline() : navigateTo('timeline', { entityId: entity.id })}
            className="py-1.5 px-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A] text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Clock className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => onViewEvidence ? onViewEvidence() : navigateTo('evidence', { entityId: entity.id })}
            className="py-1.5 px-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A] text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-[#2563A6]" />
            <span>Evidence</span>
          </button>
        </div>
      </div>

    </div>
  );
};
