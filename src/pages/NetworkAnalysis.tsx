import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useInvestigation } from '../context/InvestigationContext';
import { networkService, NetworkGraphPayload } from '../services/networkService';
import { entityService } from '../services/entityService';
import { Entity, EntityType, RelationshipType } from '../types';
import { mockCases } from '../data/mockCases';
import { mockEntities } from '../data/mockEntities';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { EntityIntelligencePanel } from '../components/network/EntityIntelligencePanel';
import { 
  Search, 
  RotateCcw,
  Network,
  Layers,
  Sparkles,
  Eye,
  X,
  ChevronDown,
  Check,
  Filter,
  Folder,
  Globe,
  SlidersHorizontal,
  Info
} from 'lucide-react';

import { 
  analyzeGraphTopology, 
  detectDynamicCommunities 
} from '../components/network/communityLayout';

export const NetworkAnalysis: React.FC = () => {
  const { 
    selectedEntityId, 
    setSelectedEntityId, 
    activeCaseId, 
    setActiveCaseId, 
    navigateTo,
    networkScopeCases,
    setNetworkScopeCases,
    currentPage
  } = useInvestigation();

  // Multi-case scope state (e.g. ['ALL'] or ['CASE-1024'] or ['CASE-1024', 'CASE-1057'])
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>(
    networkScopeCases && networkScopeCases.length > 0 ? networkScopeCases : ['ALL']
  );

  const [graphData, setGraphData] = useState<NetworkGraphPayload | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isBridgeView, setIsBridgeView] = useState<boolean>(false);
  const [isCommunityView, setIsCommunityView] = useState<boolean>(false);
  const [isStoryMode, setIsStoryMode] = useState<boolean>(false);
  const [connectionDepth, setConnectionDepth] = useState<number>(2); // 1, 2, 3
  
  // Entity and Relationship type filters
  const [activeEntityTypes, setActiveEntityTypes] = useState<EntityType[]>([
    'PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'
  ]);
  const [activeRelationshipTypes, setActiveRelationshipTypes] = useState<RelationshipType[]>([
    'CALLED', 'TRANSFERRED', 'VISITED', 'OWNED', 'MET', 'ASSOCIATED_WITH'
  ]);

  // Dropdown popover open states
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState<boolean>(false);
  const [isEntityTypeDropdownOpen, setIsEntityTypeDropdownOpen] = useState<boolean>(false);
  const [isRelTypeDropdownOpen, setIsRelTypeDropdownOpen] = useState<boolean>(false);
  const [caseSearchQuery, setCaseSearchQuery] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const caseDropdownRef = useRef<HTMLDivElement>(null);
  const entityTypeDropdownRef = useRef<HTMLDivElement>(null);
  const relTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Sync with context's networkScopeCases
  useEffect(() => {
    if (networkScopeCases && networkScopeCases.length > 0) {
      setSelectedCaseIds(networkScopeCases);
    }
  }, [networkScopeCases]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (caseDropdownRef.current && !caseDropdownRef.current.contains(e.target as Node)) {
        setIsCaseDropdownOpen(false);
      }
      if (entityTypeDropdownRef.current && !entityTypeDropdownRef.current.contains(e.target as Node)) {
        setIsEntityTypeDropdownOpen(false);
      }
      if (relTypeDropdownRef.current && !relTypeDropdownRef.current.contains(e.target as Node)) {
        setIsRelTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine active mode
  const isAllCases = selectedCaseIds.includes('ALL') || selectedCaseIds.length === 0;
  const isSingleCase = !isAllCases && selectedCaseIds.length === 1;
  const isMultiCase = !isAllCases && selectedCaseIds.length > 1;

  const currentCaseObj = isSingleCase ? mockCases.find(c => c.id === selectedCaseIds[0]) : null;

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
        caseIds: isAllCases ? ['ALL'] : selectedCaseIds,
        entityTypes: activeEntityTypes,
        relationshipTypes: activeRelationshipTypes,
        minConfidence: 0.7,
        depth: connectionDepth
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
  }, [selectedCaseIds, activeEntityTypes, activeRelationshipTypes, connectionDepth]);

  useEffect(() => {
    const targetId = selectedEntityId || bridgeNodeId;
    if (!targetId) {
      setSelectedEntity(null);
      return;
    }
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
            caseId: selectedCaseIds[0] !== 'ALL' ? selectedCaseIds[0] : (activeCaseId || 'CASE-1024'),
            associatedCaseIds: selectedCaseIds[0] !== 'ALL' ? [selectedCaseIds[0]] : (activeCaseId ? [activeCaseId] : ['CASE-1024'])
          } as Entity);
        }
      })
      .catch(() => setSelectedEntity(null));
  }, [selectedEntityId, bridgeNodeId, selectedCaseIds, activeCaseId]);

  // Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return mockEntities
      .filter(e => {
        // If single/multi case active, filter to entities matching scope or allow global jump
        const matchesScope = isAllCases || e.associatedCaseIds.some(c => selectedCaseIds.includes(c));
        const matchesQuery = e.id.toLowerCase().includes(q) ||
          (e.label && e.label.toLowerCase().includes(q)) ||
          (e.name && e.name.toLowerCase().includes(q)) ||
          (e.metadata?.alias && e.metadata.alias.toLowerCase().includes(q));
        return matchesScope && matchesQuery;
      })
      .slice(0, 8);
  }, [searchQuery, isAllCases, selectedCaseIds]);

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

  // Case Selection Handlers
  const handleSelectAllCases = () => {
    setSelectedCaseIds(['ALL']);
    setNetworkScopeCases(['ALL']);
    setIsCaseDropdownOpen(false);
  };

  const handleToggleCase = (caseId: string) => {
    if (isAllCases) {
      // Switching from ALL to a single specific case
      setSelectedCaseIds([caseId]);
      setNetworkScopeCases([caseId]);
      setActiveCaseId(caseId);
    } else {
      let updated: string[];
      if (selectedCaseIds.includes(caseId)) {
        updated = selectedCaseIds.filter(id => id !== caseId);
        if (updated.length === 0) {
          updated = ['ALL'];
        }
      } else {
        updated = [...selectedCaseIds, caseId];
      }
      setSelectedCaseIds(updated);
      setNetworkScopeCases(updated);
      if (updated.length === 1 && updated[0] !== 'ALL') {
        setActiveCaseId(updated[0]);
      }
    }
  };

  const handleSelectSingleCaseOnly = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCaseIds([caseId]);
    setNetworkScopeCases([caseId]);
    setActiveCaseId(caseId);
    setIsCaseDropdownOpen(false);
  };

  // Entity Type Filter Toggle
  const handleToggleEntityType = (type: EntityType) => {
    if (activeEntityTypes.includes(type)) {
      if (activeEntityTypes.length > 1) {
        setActiveEntityTypes(activeEntityTypes.filter(t => t !== type));
      }
    } else {
      setActiveEntityTypes([...activeEntityTypes, type]);
    }
  };

  // Relationship Type Filter Toggle
  const handleToggleRelType = (type: RelationshipType) => {
    if (activeRelationshipTypes.includes(type)) {
      if (activeRelationshipTypes.length > 1) {
        setActiveRelationshipTypes(activeRelationshipTypes.filter(t => t !== type));
      }
    } else {
      setActiveRelationshipTypes([...activeRelationshipTypes, type]);
    }
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
    setSelectedCaseIds(['ALL']);
    setNetworkScopeCases(['ALL']);
    setActiveEntityTypes(['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE']);
    setActiveRelationshipTypes(['CALLED', 'TRANSFERRED', 'VISITED', 'OWNED', 'MET', 'ASSOCIATED_WITH']);
    setSelectedEntityId(bridgeNodeId || null);
    fetchGraph();
  };

  const totalNodesCount = graphData?.nodes?.length || 0;
  const totalEdgesCount = graphData?.edges?.length || 0;
  const totalCommunitiesCount = dynamicCommunities.length || 1;
  const crossCaseNodesCount = graphData?.nodes?.filter(n => n.data.isCrossCase).length || 0;

  const filteredCasesForDropdown = mockCases.filter(c => {
    if (!caseSearchQuery.trim()) return true;
    const q = caseSearchQuery.toLowerCase();
    return c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3 select-none animate-in fade-in max-w-7xl mx-auto py-1">
      
      {/* 1. BREADCRUMBS & HEADER INTELLIGENCE BAR */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] shadow-sm space-y-2">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium">
          <span 
            className="cursor-pointer hover:text-[#12304A] transition-colors" 
            onClick={() => navigateTo('dashboard')}
          >
            TraceNet
          </span>
          <span>&gt;</span>
          {isSingleCase && currentCaseObj ? (
            <>
              <span 
                className="cursor-pointer hover:text-[#12304A] transition-colors" 
                onClick={() => navigateTo('cases')}
              >
                CASES
              </span>
              <span>&gt;</span>
              <span 
                className="font-mono text-[#087E8B] font-bold cursor-pointer hover:underline"
                onClick={() => navigateTo('case-details', { caseId: currentCaseObj.id, tab: 'overview' })}
              >
                {currentCaseObj.id}
              </span>
              <span>&gt;</span>
              <span className="text-[#12304A] font-bold">NETWORK</span>
            </>
          ) : (
            <span className="text-[#12304A] font-bold">NETWORK</span>
          )}
        </div>

        {/* Title & Dynamic Summary Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-[#F1F5F9]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087E8B]">
                {isSingleCase ? 'CASE NETWORK MODE' : isMultiCase ? 'CROSS-CASE NETWORK VIEW' : 'SYSTEM-WIDE NETWORK INTELLIGENCE'}
              </span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="text-[10px] font-semibold text-[#64748B]">
                {isAllCases ? 'Aggregated Global Multi-Source Synthesis' : isMultiCase ? `${selectedCaseIds.length} Cases Synthesized` : (currentCaseObj?.name || selectedCaseIds[0])}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#12304A] tracking-tight flex items-center gap-2">
              {isSingleCase && currentCaseObj ? (
                <>
                  <span className="font-mono text-[#087E8B]">{currentCaseObj.id}:</span>
                  <span>{currentCaseObj.name}</span>
                </>
              ) : (
                <>
                  <span>NETWORK</span>
                  <span className="text-[#CBD5E1] font-light">|</span>
                  <span className="text-base font-semibold text-[#475569]">Network Intelligence</span>
                </>
              )}
            </h1>
          </div>

          {/* Dynamic Summary KPI Metrics */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#12304A] flex items-center gap-1.5 shadow-sm">
              <Folder className="w-3.5 h-3.5 text-[#087E8B]" />
              <span className="font-mono font-bold">{isAllCases ? '10 Cases' : isSingleCase ? '1 Case' : `${selectedCaseIds.length} Cases`}</span>
            </div>

            <div className="px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#12304A] flex items-center gap-1.5 shadow-sm">
              <span className="font-mono font-bold text-[#12304A]">{totalNodesCount}</span>
              <span className="text-[#64748B]">Entities</span>
            </div>

            <div className="px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#12304A] flex items-center gap-1.5 shadow-sm">
              <span className="font-mono font-bold text-[#12304A]">{totalEdgesCount}</span>
              <span className="text-[#64748B]">Relationships</span>
            </div>

            <div className="px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#12304A] flex items-center gap-1.5 shadow-sm">
              <span className="font-mono font-bold text-[#087E8B]">{totalCommunitiesCount}</span>
              <span className="text-[#64748B]">Communities</span>
            </div>

            {crossCaseNodesCount > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-[#087E8B] flex items-center gap-1.5 shadow-sm">
                <Network className="w-3.5 h-3.5" />
                <span className="font-mono font-bold">{crossCaseNodesCount}</span>
                <span>Cross-Case Nodes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. GLOBAL FILTER & CONTROLS TOOLBAR */}
      <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Interactive Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* A. [ ALL CASES ▼ ] / Multi-Case Selector Dropdown Popover */}
          <div className="relative" ref={caseDropdownRef}>
            <button
              onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
                isAllCases
                  ? 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]'
                  : 'bg-[#12304A] text-white border-[#12304A]'
              }`}
            >
              {isAllCases ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>All Cases (10)</span>
                </>
              ) : isSingleCase ? (
                <>
                  <Folder className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span className="font-mono">{selectedCaseIds[0]}</span>
                </>
              ) : (
                <>
                  <Folder className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span>{selectedCaseIds.length} Cases Selected</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {isCaseDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-3 z-50 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <span className="font-bold text-xs text-[#12304A]">Investigation Scope</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAllCases}
                      className="text-[10px] font-bold text-[#087E8B] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-[#CBD5E1]">•</span>
                    <button
                      onClick={() => handleSelectAllCases()}
                      className="text-[10px] text-[#64748B] hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Case Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={caseSearchQuery}
                    onChange={(e) => setCaseSearchQuery(e.target.value)}
                    placeholder="Search registered cases..."
                    className="w-full pl-8 pr-2 py-1 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#12304A] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                {/* All Cases Button Option */}
                <div
                  onClick={handleSelectAllCases}
                  className={`p-2 rounded cursor-pointer flex items-center justify-between border transition-colors ${
                    isAllCases
                      ? 'bg-[#E6F4F5] border-[#A7DFE3] text-[#087E8B] font-bold'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#12304A] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>🌐 ALL CASES (Global Synthesis)</span>
                  </div>
                  {isAllCases && <Check className="w-3.5 h-3.5" />}
                </div>

                {/* Registered Cases Checklist */}
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 divide-y divide-[#F1F5F9]">
                  {filteredCasesForDropdown.map((c) => {
                    const isChecked = !isAllCases && selectedCaseIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleToggleCase(c.id)}
                        className={`p-2 rounded cursor-pointer flex items-center justify-between transition-colors pt-1.5 ${
                          isChecked 
                            ? 'bg-[#F0F9FA] text-[#087E8B]' 
                            : 'hover:bg-[#F8FAFC] text-[#12304A]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by container
                            className="rounded border-[#CBD5E1] text-[#087E8B] focus:ring-0 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs">{c.id}</span>
                              <span className="text-xs truncate">{c.name}</span>
                            </div>
                            <span className="text-[10px] text-[#64748B] block truncate">
                              {c.department || 'Investigation Bureau'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleSelectSingleCaseOnly(c.id, e)}
                          title="View only this case"
                          className="px-1.5 py-0.5 rounded text-[10px] bg-[#FFFFFF] border border-[#CBD5E1] text-[#64748B] hover:text-[#087E8B] hover:border-[#087E8B] shrink-0 ml-2"
                        >
                          Only
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* B. [ ALL ENTITY TYPES ▼ ] Dropdown Popover */}
          <div className="relative" ref={entityTypeDropdownRef}>
            <button
              onClick={() => setIsEntityTypeDropdownOpen(!isEntityTypeDropdownOpen)}
              className="px-3 py-1.5 rounded-md bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Types ({activeEntityTypes.length}/6)</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {isEntityTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-2.5 z-50 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5 text-[11px] font-bold text-[#12304A]">
                  <span>Entity Types</span>
                  <button
                    onClick={() => setActiveEntityTypes(['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'])}
                    className="text-[10px] text-[#087E8B] hover:underline"
                  >
                    All
                  </button>
                </div>
                {(['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'] as EntityType[]).map((type) => {
                  const isChecked = activeEntityTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-[#F8FAFC] cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleEntityType(type)}
                        className="rounded border-[#CBD5E1] text-[#087E8B] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-semibold text-[#12304A]">{type}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* C. [ ALL RELATIONSHIPS ▼ ] Dropdown Popover */}
          <div className="relative" ref={relTypeDropdownRef}>
            <button
              onClick={() => setIsRelTypeDropdownOpen(!isRelTypeDropdownOpen)}
              className="px-3 py-1.5 rounded-md bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Relations ({activeRelationshipTypes.length}/6)</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {isRelTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-2.5 z-50 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5 text-[11px] font-bold text-[#12304A]">
                  <span>Relationship Types</span>
                  <button
                    onClick={() => setActiveRelationshipTypes(['CALLED', 'TRANSFERRED', 'VISITED', 'OWNED', 'MET', 'ASSOCIATED_WITH'])}
                    className="text-[10px] text-[#087E8B] hover:underline"
                  >
                    All
                  </button>
                </div>
                {(['CALLED', 'TRANSFERRED', 'VISITED', 'OWNED', 'MET', 'ASSOCIATED_WITH'] as RelationshipType[]).map((type) => {
                  const isChecked = activeRelationshipTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-[#F8FAFC] cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRelType(type)}
                        className="rounded border-[#CBD5E1] text-[#087E8B] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-[#12304A]">{type}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* D. Autocomplete Search Input */}
          <div className="relative min-w-[240px]">
            <form onSubmit={handleSearchSubmit}>
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search entity, phone, account..."
                className="w-full pl-8 pr-7 py-1.5 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#12304A] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#12304A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Search Suggestions Popover */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#FFFFFF] rounded-md border border-[#CBD5E1] shadow-2xl p-1 z-50 space-y-1 animate-in fade-in">
                {searchSuggestions.map((ent) => (
                  <div
                    key={ent.id}
                    onClick={() => handleSelectSearchItem(ent.id)}
                    className="p-2 rounded hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[#12304A] truncate">{ent.label || ent.name || ent.id}</div>
                      <div className="text-[10px] text-[#64748B] flex items-center gap-1.5">
                        <span className="font-mono">{ent.id}</span>
                        <span>•</span>
                        <span>{ent.type}</span>
                        {ent.associatedCaseIds && (
                          <>
                            <span>•</span>
                            <span>{ent.associatedCaseIds.length} Cases</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#087E8B] font-bold">
                      {ent.connectionsCount || 0} links
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right: Graph Action Controls & Depth */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Depth Selector [ 1 ] [ 2 ] [ 3 ] */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-[11px]">
            <span className="text-[#64748B] font-semibold">Depth:</span>
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setConnectionDepth(d)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                  connectionDepth === d 
                    ? 'bg-[#087E8B] text-white' 
                    : 'text-[#64748B] hover:bg-[#FFFFFF] hover:text-[#12304A]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Bridge View Toggle */}
          <button
            onClick={handleToggleBridgeView}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isBridgeView 
                ? 'bg-[#087E8B] text-white border-[#087E8B]' 
                : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bridge View</span>
          </button>

          {/* Community View Toggle */}
          <button
            onClick={handleToggleCommunityView}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isCommunityView 
                ? 'bg-[#087E8B] text-white border-[#087E8B]' 
                : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Community View</span>
          </button>

          {/* Investigation View Toggle */}
          <button
            onClick={handleToggleStoryMode}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isStoryMode 
                ? 'bg-[#087E8B] text-white border-[#087E8B]' 
                : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Investigation View</span>
          </button>

          {/* Reset Filters */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#12304A] transition-colors shadow-sm"
            title="Reset Graph Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. MAIN GRAPH WORKSPACE & INTELLIGENCE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[640px]">
        
        {/* Cytoscape Graph Canvas Area */}
        <div className={`transition-all duration-300 ${selectedEntity ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="h-[640px] bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center">
                <div className="px-4 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] shadow-lg flex items-center gap-2 text-xs font-semibold text-[#12304A]">
                  <div className="w-4 h-4 border-2 border-[#087E8B] border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Network Intelligence...</span>
                </div>
              </div>
            )}

            <CytoscapeGraph
              graphData={graphData}
              selectedEntityId={selectedEntityId}
              bridgeNodeId={bridgeNodeId}
              isBridgeView={isBridgeView}
              isCommunityView={isCommunityView}
              isStoryMode={isStoryMode}
              onSelectEntity={(id) => setSelectedEntityId(id)}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right Entity Intelligence Inspector Panel */}
        {selectedEntity && (
          <div className="lg:col-span-4 transition-all duration-300">
            <div className="h-[640px] bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
              <EntityIntelligencePanel
                entity={selectedEntity}
                onClose={() => setSelectedEntityId(null)}
                onSelectEntity={(id) => setSelectedEntityId(id)}
                onViewTimeline={() => {
                  navigateTo('timeline', { entityId: selectedEntity.id });
                }}
                onViewEvidence={() => {
                  navigateTo('evidence', { entityId: selectedEntity.id });
                }}
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
