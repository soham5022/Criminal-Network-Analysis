import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Truck, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  Link2, 
  Search, 
  FileText, 
  Layers, 
  Network, 
  Navigation, 
  CheckCircle2, 
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
      <div className="w-80 sm:w-96 border-l border-slate-800 bg-[#0c1322] p-8 flex flex-col items-center justify-center text-center space-y-3 select-none h-full min-h-[300px]">
        <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          <Search className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Select an Entity to Inspect</h4>
        <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
          Click any node on the network graph to inspect why it matters, its connections across communities, and supporting evidence.
        </p>
      </div>
    );
  }

  const getTypeIcon = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return <User className="w-4 h-4 text-blue-400" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'ACCOUNT': return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'LOCATION': return <MapPin className="w-4 h-4 text-purple-400" />;
      case 'ORGANIZATION': return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'VEHICLE': return <Truck className="w-4 h-4 text-rose-400" />;
      default: return <User className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'PHONE': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ACCOUNT': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOCATION': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'ORGANIZATION': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'VEHICLE': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
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
    <div className="w-80 sm:w-96 border-l border-slate-800 bg-[#0c1322] flex flex-col h-full overflow-hidden select-none animate-in slide-in-from-right duration-150 shadow-2xl z-20">
      
      {/* 1. Header: Entity ID, Type & Attention Score */}
      <div className="p-4 border-b border-slate-800 bg-[#090e1a] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0">
              {getTypeIcon(entity.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-white truncate font-mono">
                  {entity.label || entity.name || entity.id}
                </h3>
                {isBridge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    BRIDGE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className={`inline-block px-1.5 py-0.2 rounded font-bold uppercase border ${getTypeBadge(entity.type)}`}>
                  {entity.type}
                </span>
                <span>ID: {entity.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Attention Score Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#060a12] border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Attention Score</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {attentionScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Section A: Why this entity is highlighted */}
        <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Why this entity is highlighted</span>
          </span>
          <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            {whyHighlightedPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section B: NETWORK Overview Statistics */}
        <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>NETWORK</span>
          </span>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-mono text-sm font-bold text-white">{connectionsCount}</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Connections</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-mono text-sm font-bold text-cyan-300">{communitiesCount}</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Communities</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-mono text-sm font-bold text-amber-300">{crossCommunityLinks}</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Cross-Links</div>
            </div>
          </div>
        </div>

        {/* Section C: Key Direct Relationships */}
        <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Key Direct Relationships</span>
          </span>
          <div className="space-y-1.5">
            <div 
              onClick={() => (onSelectEntity ? onSelectEntity('Person_078') : setSelectedEntityId('Person_078'))}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-mono font-semibold text-white">Person_078 (Logistics Lead)</div>
                <div className="text-[10px] text-slate-400">MET (6 physical rendezvous)</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div 
              onClick={() => (onSelectEntity ? onSelectEntity('Account_103') : setSelectedEntityId('Account_103'))}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-mono font-semibold text-white">Account_103 (Escrow Relay)</div>
                <div className="text-[10px] text-slate-400">TRANSFERRED (₹48,500)</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div 
              onClick={() => (onSelectEntity ? onSelectEntity('Location_A') : setSelectedEntityId('Location_A'))}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-mono font-semibold text-white">Location_A (Sector 4 Hub)</div>
                <div className="text-[10px] text-slate-400">VISITED (14 ANPR & CCTV hits)</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Section D: Collapsible Analytical Details (Centrality & Technical Metrics) */}
        <div className="rounded-lg bg-[#090e1a] border border-slate-800 overflow-hidden">
          <button
            onClick={() => setShowAnalyticalDetails(!showAnalyticalDetails)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Analytical Details & Metrics
            </span>
            {showAnalyticalDetails ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showAnalyticalDetails && (
            <div className="p-3 pt-0 space-y-1.5 text-xs border-t border-slate-800/60 animate-in fade-in">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Betweenness Centrality:</span>
                <span className="font-mono text-white font-semibold">
                  {entity.betweennessCentrality?.toFixed(3) || (entity.id === 'Person_044' ? '0.612' : '0.145')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Degree Centrality:</span>
                <span className="font-mono text-white font-semibold">
                  {entity.degreeCentrality?.toFixed(3) || (entity.id === 'Person_044' ? '0.720' : '0.480')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Closeness Centrality:</span>
                <span className="font-mono text-white font-semibold">
                  {entity.closenessCentrality?.toFixed(3) || '0.680'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Ingestion Evidence Sources:</span>
                <span className="font-mono text-cyan-300 font-semibold">CDR, SWIFT, CCTV</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. Footer Action Buttons */}
      <div className="p-3 border-t border-slate-800 bg-[#090e1a] space-y-2">
        <button
          onClick={() => openEntityProfile(entity.id)}
          className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Complete 360° Profile</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (onViewTimeline) onViewTimeline();
              else navigateTo('timeline', { entityId: entity.id });
            }}
            className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>View Timeline</span>
          </button>

          <button
            onClick={() => {
              if (onViewEvidence) onViewEvidence();
              else navigateTo('evidence', { entityId: entity.id });
            }}
            className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Evidence</span>
          </button>
        </div>
      </div>

    </div>
  );
};
