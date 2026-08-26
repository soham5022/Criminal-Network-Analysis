import React, { useState } from 'react';
import { 
  X, 
  Users, 
  MapPin, 
  Phone, 
  CreditCard, 
  Building2, 
  Car, 
  Activity, 
  Share2, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  Info,
  Network,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { Entity } from '../../types';
import { EntityTypeBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

interface EntityIntelligencePanelProps {
  entity: Entity | null;
  onClose: () => void;
  onSelectEntity: (id: string) => void;
}

export const EntityIntelligencePanel: React.FC<EntityIntelligencePanelProps> = ({
  entity,
  onClose,
  onSelectEntity
}) => {
  const { navigateTo, setActiveCaseTab, activeCaseId } = useInvestigation();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  if (!entity) {
    return (
      <div className="w-full lg:w-96 intel-card border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 select-none h-full min-h-[300px]">
        <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          <Share2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Entity Details</h4>
        <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
          Search or click any person, phone, account, or vehicle in the network to inspect findings and connections.
        </p>
      </div>
    );
  }

  const attentionScore = entity.attentionScore ?? (entity.betweennessCentrality > 0.4 ? 82 : 48);
  const isHighPriority = attentionScore >= 70;

  return (
    <div className="w-full lg:w-96 intel-card border border-slate-800 shadow-xl flex flex-col h-full max-h-[640px] overflow-hidden select-none animate-in slide-in-from-right-3 duration-150">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-base font-bold text-white tracking-wide">
              {entity.id}
            </h3>
            <EntityTypeBadge type={entity.type} />
          </div>
          {entity.metadata?.alias && (
            <p className="text-xs text-slate-300 font-medium">
              {entity.metadata.alias}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* 1. Quick Summary Indicators */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Connected</span>
            <strong className="text-sm font-bold text-white">{entity.connectionsCount}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Groups</span>
            <strong className="text-sm font-bold text-blue-400">{entity.communitiesConnectedCount || (entity.isBridge ? 3 : 1)}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Alerts</span>
            <strong className="text-sm font-bold text-amber-400">{entity.relatedAlertsCount || (entity.isBridge ? 2 : 0)}</strong>
          </div>
        </div>

        {/* 2. Plain-Language "Why is this important?" */}
        <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Why is this important?</span>
            </h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isHighPriority ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
            }`}>
              Priority Score: {attentionScore}/100
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {entity.isBridge ? (
              <>This person connects <strong>three otherwise separate network groups</strong>. The system detected <strong>7 cross-group connections</strong> linking supply, transit logistics, and hawala accounts.</>
            ) : (
              <>Direct counterparty in <strong>{entity.connectionsCount} recorded interactions</strong> within {entity.community}.</>
            )}
          </p>
        </div>

        {/* 3. Key Direct Connections */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Direct Connections ({entity.keyConnections?.length || 0})
            </span>
            <span className="text-[10px] text-slate-400">Click to inspect</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {entity.keyConnections && entity.keyConnections.length > 0 ? (
              entity.keyConnections.map((connId) => (
                <button
                  key={connId}
                  onClick={() => onSelectEntity(connId)}
                  className="w-full p-2 rounded-lg bg-[#090e1a] hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono text-slate-200 group-hover:text-blue-300">{connId}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-500">
                No direct counterparties recorded.
              </div>
            )}
          </div>
        </div>

        {/* 4. Collapsible Technical Analysis */}
        <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider"
          >
            <span>Technical Analysis & Graph Metrics</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} />
          </button>

          {showTechnicalDetails && (
            <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Network Group:</span>
                <span className="text-blue-300">{entity.community}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Betweenness Centrality:</span>
                <span className="font-bold text-amber-300">{entity.betweennessCentrality.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Degree Centrality:</span>
                <span>{entity.degreeCentrality.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PageRank:</span>
                <span>{(entity.pagerank ?? 0.015).toFixed(3)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ethical AI Notice */}
        <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-400 leading-tight flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>Findings are automated analytical leads to guide human investigation and require verified corroboration.</span>
        </div>
      </div>

      {/* Footer Navigation Actions */}
      <div className="p-3 border-t border-slate-800 bg-[#090e1a] grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setActiveCaseTab('evidence');
            navigateTo('case-details', { caseId: activeCaseId, tab: 'evidence' });
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
          <span>View Evidence</span>
        </button>
        <button
          onClick={() => {
            setActiveCaseTab('alerts');
            navigateTo('case-details', { caseId: activeCaseId, tab: 'alerts' });
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>View Alerts</span>
        </button>
      </div>
    </div>
  );
};
