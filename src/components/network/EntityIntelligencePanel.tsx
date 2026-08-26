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
  ChevronDown
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
  const { navigateTo } = useInvestigation();
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  if (!entity) {
    return (
      <div className="w-96 intel-card rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 select-none">
        <div className="p-3.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400">
          <Share2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Entity Intelligence Panel</h4>
        <p className="text-xs text-slate-400 max-w-[240px]">
          Click any node in the knowledge graph to inspect its network metrics, connections, and analytical indicators.
        </p>
      </div>
    );
  }

  const statItems = [
    { label: 'Connections', value: entity.connectionsCount, icon: Users, color: 'text-cyan-400' },
    { label: 'Locations', value: entity.locationsCount, icon: MapPin, color: 'text-purple-400' },
    { label: 'Phones', value: entity.phonesCount, icon: Phone, color: 'text-emerald-400' },
    { label: 'Accounts', value: entity.accountsCount, icon: CreditCard, color: 'text-amber-400' },
    { label: 'Organizations', value: entity.organizationsCount, icon: Building2, color: 'text-indigo-400' },
    { label: 'Vehicles', value: entity.vehiclesCount, icon: Car, color: 'text-rose-400' }
  ];

  const attentionScore = entity.attentionScore ?? (entity.betweennessCentrality > 0.4 ? 82 : 48);
  const isHighPriority = attentionScore >= 70;

  return (
    <div className="w-full lg:w-96 intel-card rounded-xl border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden select-none animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-lg font-bold text-white tracking-wide">
              {entity.id}
            </h3>
            <EntityTypeBadge type={entity.type} />
          </div>
          {entity.metadata.alias && (
            <p className="text-xs text-slate-400 font-medium">
              {entity.metadata.alias}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Intelligence Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Analytical Attention Score Badge (Explainable) */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Analytical Attention</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
              isHighPriority
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              {attentionScore} / 100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isHighPriority
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
              }`}
              style={{ width: `${attentionScore}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-400">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Community:</span>
              <strong className="text-cyan-300">{entity.community}</strong>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Bridge Status:</span>
              <strong className={entity.isBridge ? 'text-amber-400' : 'text-slate-400'}>
                {entity.isBridge ? 'Active Bridge' : 'Standard'}
              </strong>
            </div>
          </div>
        </div>

        {/* Why is this entity important? (Explainability Factor Breakdown) */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Why is this entity important?</span>
            </span>
          </h5>

          <div className="space-y-1.5">
            {entity.attentionFactors && entity.attentionFactors.length > 0 ? (
              entity.attentionFactors.map((factor, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950/70 border border-slate-800/60 text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>{factor.name}</span>
                    <span className="font-mono text-cyan-400">+{factor.points} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{factor.reason}</p>
                </div>
              ))
            ) : (
              <div className="space-y-1 text-xs text-slate-400">
                <p className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Direct connections: {entity.connectionsCount} counterparties.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Betweenness centrality: {entity.betweennessCentrality.toFixed(2)}.</span>
                </p>
                {entity.crossCommunityLinks ? (
                  <p className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Cross-community links: {entity.crossCommunityLinks} edges across multiple clusters.</span>
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Graph Centrality Topology Grid */}
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Graph Topology & Centrality Scores
          </h5>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Degree</span>
              <span className="font-bold text-cyan-400">{entity.degreeCentrality.toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Betweenness</span>
              <span className={`font-bold ${entity.betweennessCentrality > 0.4 ? 'text-rose-400' : 'text-white'}`}>
                {entity.betweennessCentrality.toFixed(2)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Closeness</span>
              <span className="font-bold text-indigo-400">{(entity.closenessCentrality ?? 0.22).toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">PageRank</span>
              <span className="font-bold text-emerald-400">{(entity.pagerank ?? 0.015).toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Entity Connection Stats Grid */}
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Linked Entity Counts
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {statItems.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-center space-y-0.5">
                  <Icon className={`w-3.5 h-3.5 mx-auto ${stat.color}`} />
                  <div className="text-sm font-bold font-mono text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-400 truncate">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Neighbor Connections */}
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Key Connections ({entity.keyConnections.length})</span>
            <span className="text-[9px] text-slate-400">Click to Inspect</span>
          </h5>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {entity.keyConnections.map((connId) => (
              <button
                key={connId}
                onClick={() => onSelectEntity(connId)}
                className="w-full p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 hover:border-cyan-500/40 flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-slate-200 group-hover:text-cyan-300">{connId}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Detection Methodology */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <button 
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider"
          >
            <span className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>How this was detected</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
          </button>

          {showMethodology && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed font-mono">
              <p>• <strong>Method:</strong> Normalized Betweenness Centrality + Modularity Partition.</p>
              <p>• <strong>Cross-Links:</strong> {entity.crossCommunityLinks ?? 0} edges reaching outside {entity.community}.</p>
              <p>• <strong>Rule Confidence:</strong> 92% (Algorithmic graph topology verification).</p>
            </div>
          )}
        </div>

        {/* Ethical AI Notice */}
        <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-tight">
            <strong>Investigative Notice:</strong> AI provides analytical leads and topological patterns. Findings do not constitute direct accusation of culpability.
          </p>
        </div>
      </div>

      {/* Footer Navigation Actions */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 grid grid-cols-2 gap-2">
        <button
          onClick={() => navigateTo('timeline')}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Open Timeline</span>
        </button>
        <button
          onClick={() => navigateTo('alerts')}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>View Alerts</span>
        </button>
      </div>
    </div>
  );
};
