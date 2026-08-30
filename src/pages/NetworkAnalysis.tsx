import React, { useEffect, useState, useMemo } from 'react';
import { useInvestigation } from '../context/InvestigationContext';
import { networkService, NetworkGraphPayload } from '../services/networkService';
import { entityService } from '../services/entityService';
import { Entity, EntityType } from '../types';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { EntityIntelligencePanel } from '../components/network/EntityIntelligencePanel';
import { NetworkLegend } from '../components/network/NetworkLegend';
import { 
  Search, 
  RotateCcw,
  Network,
  Layers,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

import { 
  analyzeGraphTopology, 
  detectDynamicCommunities 
} from '../components/network/communityLayout';

export const NetworkAnalysis: React.FC = () => {
  const { selectedEntityId, setSelectedEntityId, activeCaseId, navigateTo } = useInvestigation();
  const [graphData, setGraphData] = useState<NetworkGraphPayload | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isBridgeView, setIsBridgeView] = useState<boolean>(false);
  const [isCommunityView, setIsCommunityView] = useState<boolean>(false);
  const [isStoryMode, setIsStoryMode] = useState<boolean>(false);
  const [connectionDepth, setConnectionDepth] = useState<number>(2); // 1, 2, 3
  const [activeFilterTypes, setActiveFilterTypes] = useState<EntityType[]>([
    'PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  // Dynamic Graph Topology & Community Detection
  const { bridgeNodeId } = useMemo(() => 
    analyzeGraphTopology(graphData?.nodes || [], graphData?.edges || []), 
    [graphData]
  );
  
  const dynamicCommunities = useMemo(() => 
    detectDynamicCommunities(graphData?.nodes || [], graphData?.edges || []), 
    [graphData]
  );

  // Fetch Graph Data
  const fetchGraph = async () => {
    setLoading(true);
    try {
      const data = await networkService.getGraphData({
        caseId: activeCaseId,
        entityTypes: activeFilterTypes,
        minConfidence: 0.7
      });
      setGraphData(data);
    } catch (err) {
      console.warn('Network fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [activeCaseId, activeFilterTypes]);

  useEffect(() => {
    const targetId = selectedEntityId || bridgeNodeId || 'Person_044';
    entityService.getEntityById(targetId)
      .then(ent => {
        if (ent) {
          setSelectedEntity(ent);
        } else {
          setSelectedEntity({
            id: targetId,
            name: targetId,
            type: targetId.includes('Account') ? 'ACCOUNT' : targetId.includes('Phone') ? 'PHONE' : targetId.includes('Location') ? 'LOCATION' : 'PERSON',
            community: 'Cluster 01',
            degree: 10,
            betweenness: 0.5,
            risk_score: 0.75,
            caseId: activeCaseId
          } as Entity);
        }
      })
      .catch(() => setSelectedEntity(null));
  }, [selectedEntityId, bridgeNodeId, activeCaseId]);

  // Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    if (!graphData || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return graphData.nodes
      .filter(n => n.data.id.toLowerCase().includes(q) || (n.data.label && n.data.label.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [graphData, searchQuery]);

  const handleSelectSearchItem = (id: string) => {
    setSelectedEntityId(id);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    setSelectedEntityId(q);
    setIsSearchFocused(false);
  };

  const handleSelectEntity = (id: string | null) => {
    setSelectedEntityId(id);
  };

  const handleToggleBridgeView = () => {
    const next = !isBridgeView;
    setIsBridgeView(next);
    if (next) {
      setIsCommunityView(false);
      setIsStoryMode(false);
      if (bridgeNodeId) setSelectedEntityId(bridgeNodeId);
    }
  };

  const handleToggleCommunityView = () => {
    const next = !isCommunityView;
    setIsCommunityView(next);
    if (next) {
      setIsBridgeView(false);
    }
  };

  const handleToggleStoryMode = () => {
    const next = !isStoryMode;
    setIsStoryMode(next);
    if (next) {
      setIsBridgeView(false);
      if (bridgeNodeId) setSelectedEntityId(bridgeNodeId);
    }
  };

  const handleReset = () => {
    setIsBridgeView(false);
    setIsCommunityView(false);
    setIsStoryMode(false);
    setConnectionDepth(2);
    setSelectedEntityId(bridgeNodeId || 'Person_044');
    setActiveFilterTypes(['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE']);
    fetchGraph();
  };

  const totalNodesCount = graphData?.nodes?.length || 0;
  const totalEdgesCount = graphData?.edges?.length || 0;
  const totalCommunitiesCount = dynamicCommunities.length || 1;

  const selectedConnectionsCount = selectedEntity?.connectionsCount || (
    selectedEntityId && graphData 
      ? graphData.edges.filter(e => e.data.source === selectedEntityId || e.data.target === selectedEntityId).length 
      : 0
  );
  const selectedCrossCommunityCount = selectedEntity?.crossCommunityLinks || (
    selectedEntityId === bridgeNodeId ? Math.max(2, dynamicCommunities.length * 2 - 1) : 1
  );

  return (
    <div className="space-y-3 select-none animate-in fade-in max-w-7xl mx-auto py-1">
      
      {/* 1. NETWORK OVERVIEW Header Status Bar */}
      <div className="bg-[#FFFFFF] px-4 py-2.5 rounded-lg border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
            <Network className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold uppercase tracking-wider text-[#12304A]">
            NETWORK OVERVIEW:
          </span>
          <span className="text-[#64748B] font-medium font-mono">
            {totalNodesCount} Entities • {totalEdgesCount} Relationships • {totalCommunitiesCount} Communities
          </span>
        </div>

        {selectedEntityId && (
          <div className="flex items-center gap-3 text-[#475569] text-[11px]">
            <div>
              <span className="text-[#64748B] uppercase mr-1">Selected:</span>
              <span className="font-bold text-[#12304A] bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#E2E8F0] font-mono">
                {selectedEntityId}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] mr-1">Connections:</span>
              <span className="font-bold text-[#087E8B]">{selectedConnectionsCount}</span>
            </div>
            <div>
              <span className="text-[#64748B] mr-1">Cross-community:</span>
              <span className="font-bold text-[#B7791F]">{selectedCrossCommunityCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Streamlined Investigation Toolbar */}
      <div className="bg-[#FFFFFF] p-3 border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Entity Search Input with Autocomplete */}
          <div className="relative min-w-[220px]">
            <form onSubmit={handleSearchSubmit}>
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Inspect entity (e.g. Rahul Sharma, Thane West)..."
                className="w-full pl-8 pr-7 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#12304A]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown List */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-md shadow-xl z-50 overflow-hidden divide-y divide-[#E2E8F0] animate-in fade-in">
                {searchSuggestions.map((item) => (
                  <div
                    key={item.data.id}
                    onMouseDown={() => handleSelectSearchItem(item.data.id)}
                    className="p-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="font-bold text-[#12304A]">{item.data.id}</div>
                    <span className="text-[10px] text-[#64748B] font-mono">{item.data.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Bridge View Button */}
          <button
            onClick={handleToggleBridgeView}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
              isBridgeView
                ? 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]'
                : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] border-[#CBD5E1]'
            }`}
            title="Isolate cross-community pathways routed through central bridge node"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B7791F]" />
            <span>Bridge View ({bridgeNodeId || 'Bridge'})</span>
          </button>

          {/* Community Clusters View Button */}
          <button
            onClick={handleToggleCommunityView}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
              isCommunityView
                ? 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]'
                : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] border-[#CBD5E1]'
            }`}
            title="Organize network into detected modularity communities"
          >
            <Layers className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Community View ({totalCommunitiesCount} Clusters)</span>
          </button>

          {/* Investigation Story Mode Button */}
          <button
            onClick={handleToggleStoryMode}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
              isStoryMode
                ? 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]'
                : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] border-[#CBD5E1]'
            }`}
            title="Presentation-friendly view simplifying the core suspect-asset storyline"
          >
            <Eye className="w-3.5 h-3.5 text-[#16805C]" />
            <span>Investigation View</span>
          </button>

          {/* Connection Depth Control: [ 1 ] [ 2 ] [ 3 ] */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs">
            <span className="text-[#64748B] text-[10px] uppercase mr-1 hidden sm:inline">Depth:</span>
            {[1, 2, 3].map((depth) => (
              <button
                key={depth}
                onClick={() => setConnectionDepth(depth)}
                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                  connectionDepth === depth
                    ? 'bg-[#087E8B] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#12304A] hover:bg-[#F1F5F9]'
                }`}
                title={`Connection Depth ${depth}: ${
                  depth === 1 ? 'Direct links only' : depth === 2 ? 'Direct + 2nd degree' : 'Broader network'
                }`}
              >
                {depth}
              </button>
            ))}
          </div>

          {/* Reset Layout */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12304A] border border-[#CBD5E1] transition-colors shadow-sm"
            title="Reset Graph Layout, Depth & Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Graph Canvas & Intelligence Inspector Split Layout */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg overflow-hidden flex flex-col lg:flex-row h-[620px] shadow-sm">
        {/* Left Interactive Cytoscape Canvas */}
        <div className="flex-1 relative h-full bg-[#FAFCFD]">
          {graphData && (
            <CytoscapeGraph
              graphData={graphData}
              selectedEntityId={selectedEntityId || 'Person_044'}
              onSelectEntity={handleSelectEntity}
              activeFilterTypes={activeFilterTypes}
              onFilterChange={setActiveFilterTypes}
              isBridgeView={isBridgeView}
              isCommunityView={isCommunityView}
              isStoryMode={isStoryMode}
              connectionDepth={connectionDepth}
            />
          )}
        </div>

        {/* Right Entity Intelligence Inspector Panel */}
        <EntityIntelligencePanel
          entity={selectedEntity}
          onClose={() => setSelectedEntityId(null)}
          onSelectEntity={(id) => setSelectedEntityId(id)}
          onViewTimeline={() => navigateTo('timeline', { entityId: selectedEntity?.id || 'Person_044' })}
          onViewEvidence={() => navigateTo('evidence', { entityId: selectedEntity?.id || 'Person_044' })}
        />
      </div>

      {/* 4. Bottom Collapsible Legend */}
      <NetworkLegend />

    </div>
  );
};
