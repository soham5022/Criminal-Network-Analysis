import React, { useEffect, useRef, useState, useCallback } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  Filter, 
  Check, 
  X, 
  Maximize2, 
  Sparkles, 
  Route, 
  Eye
} from 'lucide-react';
import { NetworkGraphPayload, CytoscapeEdgeData } from '../../services/networkService';
import { EntityType } from '../../types';
import { 
  getDynamicCommunityPositions, 
  detectDynamicCommunities, 
  analyzeGraphTopology
} from './communityLayout';
import { CommunityZoneOverlay } from './CommunityZoneOverlay';
import { RelationshipDetailCard } from './RelationshipDetailCard';
import { PathFinderModal } from './PathFinderModal';

interface CytoscapeGraphProps {
  graphData: NetworkGraphPayload;
  selectedEntityId: string | null;
  onSelectEntity: (entityId: string | null) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onReset?: () => void;
  activeFilterTypes?: EntityType[];
  onFilterChange?: (types: EntityType[]) => void;
  isBridgeView?: boolean;
  isCommunityView?: boolean;
  isStoryMode?: boolean;
  connectionDepth?: number; // 1, 2, or 3
  onSelectEdge?: (edgeData: CytoscapeEdgeData | null) => void;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  graphData,
  selectedEntityId,
  onSelectEntity,
  activeFilterTypes = ['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'],
  onFilterChange,
  isBridgeView = false,
  isCommunityView = false,
  isStoryMode = false,
  connectionDepth = 2,
  onSelectEdge
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Modals and interactive overlays
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showPathFinder, setShowPathFinder] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<EntityType[]>(activeFilterTypes);
  const [selectedEdge, setSelectedEdge] = useState<CytoscapeEdgeData | null>(null);
  const [activeCommunityFilter, setActiveCommunityFilter] = useState<string | null>(null);
  const [activePathSteps, setActivePathSteps] = useState<{ from: string; to: string; type: string }[] | null>(null);

  const communityStats = detectDynamicCommunities(graphData.nodes, graphData.edges);
  const { bridgeNodeId } = analyzeGraphTopology(graphData.nodes, graphData.edges);

  // Initialize Cytoscape Instance
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autounselectify: false,
      wheelSensitivity: 0.25,
      minZoom: 0.4,
      maxZoom: 2.5,
      style: [
        // ==========================================
        // 1. BASE NODE STYLES (Warm Earth-Tone Palette)
        // ==========================================
        {
          selector: 'node',
          style: {
            'background-color': '#B85C38', // Terracotta default
            'border-width': 2,
            'border-color': '#944424',
            'label': 'data(label)',
            'color': '#554D46',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-opacity': 0.95,
            'text-background-color': '#FFFDF9',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'text-border-opacity': 0.9,
            'text-border-width': 1,
            'text-border-color': '#D8D0C7',
            'width': 34,
            'height': 34,
            'transition-property': 'background-color, border-color, border-width, opacity, width, height',
            'transition-duration': 0.25
          }
        },

        // ==========================================
        // 2. ENTITY TYPE DISTINCT SHAPES & WARM PALETTE
        // ==========================================
        {
          selector: 'node[type = "PERSON"]',
          style: {
            'background-color': '#B85C38', // Terracotta
            'border-color': '#944424',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type = "PHONE"]',
          style: {
            'background-color': '#C46A32', // Burnt Orange
            'border-color': '#A04F1F',
            'shape': 'round-rectangle',
            'width': 38,
            'height': 32
          }
        },
        {
          selector: 'node[type = "ACCOUNT"]',
          style: {
            'background-color': '#B58A32', // Mustard Gold
            'border-color': '#916A1E',
            'shape': 'hexagon',
            'width': 38,
            'height': 34
          }
        },
        {
          selector: 'node[type = "LOCATION"]',
          style: {
            'background-color': '#777548', // Warm Olive
            'border-color': '#5C5A32',
            'shape': 'rectangle',
            'width': 34,
            'height': 34
          }
        },
        {
          selector: 'node[type = "ORGANIZATION"]',
          style: {
            'background-color': '#735548', // Warm Brown
            'border-color': '#553C32',
            'shape': 'diamond',
            'width': 40,
            'height': 40
          }
        },
        {
          selector: 'node[type = "VEHICLE"]',
          style: {
            'background-color': '#9A6262', // Dusty Rose
            'border-color': '#7A4A4A',
            'shape': 'round-diamond',
            'width': 36,
            'height': 36
          }
        },
        {
          selector: 'node[type = "EVIDENCE"], node[type = "DOCUMENT"]',
          style: {
            'background-color': '#766F67', // Warm Gray
            'border-color': '#5B554E',
            'shape': 'round-rectangle',
            'width': 34,
            'height': 34
          }
        },

        // ==========================================
        // 3. PERSON_044 CENTRAL BRIDGE STYLING
        // ==========================================
        {
          selector: 'node#Person_044',
          style: {
            'width': 46,
            'height': 46,
            'border-width': 3.5,
            'border-color': '#69301F',
            'border-style': 'solid',
            'background-color': '#8F432A', // Deep Terracotta
            'label': 'Rahul Sharma [BRIDGE]',
            'font-weight': 700,
            'color': '#8F432A',
            'text-background-color': '#FFFDF9',
            'text-background-opacity': 0.95,
            'text-border-color': '#D8D0C7',
            'z-index': 900
          }
        },

        // ==========================================
        // 4. BASE & TYPED EDGE STYLING (Warm Palette)
        // ==========================================
        {
          selector: 'edge',
          style: {
            'width': 1.6,
            'line-color': '#B9B0A6', // Normal Edge
            'target-arrow-color': '#B9B0A6',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.75,
            'curve-style': 'bezier',
            'opacity': 0.85,
            'font-size': '9px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': 600,
            'text-rotation': 'autorotate',
            'text-background-opacity': 0.95,
            'text-background-color': '#FFFDF9',
            'text-background-padding': '2.5px',
            'text-background-shape': 'roundrectangle',
            'text-border-opacity': 0.9,
            'text-border-width': 1,
            'text-border-color': '#D8D0C7',
            'color': '#554D46',
            'label': ''
          }
        },

        // Relationship-specific Edge Differentiations
        {
          selector: 'edge[type = "CALLED"]',
          style: {
            'line-color': '#C46A32', // Burnt Orange
            'target-arrow-color': '#C46A32',
            'line-style': 'dashed',
            'line-dash-pattern': [5, 3]
          }
        },
        {
          selector: 'edge[type = "TRANSFERRED"]',
          style: {
            'line-color': '#B58A32', // Mustard Gold
            'target-arrow-color': '#B58A32',
            'width': 2.2
          }
        },
        {
          selector: 'edge[type = "VISITED"]',
          style: {
            'line-color': '#777548', // Warm Olive
            'target-arrow-color': '#777548'
          }
        },
        {
          selector: 'edge[type = "ASSOCIATED_WITH"]',
          style: {
            'line-color': '#735548', // Warm Brown
            'target-arrow-color': '#735548'
          }
        },
        {
          selector: 'edge[type = "OWNED"]',
          style: {
            'line-color': '#A77A5E', // Important / Warm Tan
            'target-arrow-color': '#A77A5E'
          }
        },
        {
          selector: 'edge[type = "MET"]',
          style: {
            'line-color': '#A7463D', // Critical Relationship / Muted Red
            'target-arrow-color': '#A7463D',
            'width': 2.0
          }
        },
        {
          selector: 'edge[type = "CO_LOCATED"]',
          style: {
            'line-color': '#777548',
            'target-arrow-color': '#777548',
            'line-style': 'dotted'
          }
        },

        // ==========================================
        // 5. INTERACTION & FOCUS HIGHLIGHTS
        // ==========================================
        {
          selector: 'node:selected',
          style: {
            'background-color': '#8F432A', // Selected entity
            'border-width': 3.5,
            'border-color': '#69301F', // Outline
            'underlay-color': '#8F432A',
            'underlay-padding': '4px',
            'underlay-opacity': 0.15,
            'opacity': 1.0,
            'z-index': 999
          }
        },
        {
          selector: 'node.highlighted',
          style: {
            'opacity': 1.0,
            'border-width': 3,
            'border-color': '#69301F',
            'z-index': 100
          }
        },
        {
          selector: 'node.faded',
          style: {
            'opacity': 0.18
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#8F432A', // Selected relationship
            'target-arrow-color': '#8F432A',
            'width': 2.8,
            'opacity': 1.0,
            'label': 'data(label)',
            'color': '#554D46',
            'text-background-color': '#FFFDF9',
            'text-border-color': '#D8D0C7',
            'z-index': 999
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'opacity': 1.0,
            'width': 2.2,
            'label': 'data(label)',
            'color': '#554D46',
            'text-background-color': '#FFFDF9',
            'text-border-color': '#D8D0C7',
            'z-index': 80
          }
        },
        {
          selector: 'edge.faded',
          style: {
            'opacity': 0.08
          }
        },
        {
          selector: 'edge.path-highlight',
          style: {
            'line-color': '#8F432A',
            'target-arrow-color': '#8F432A',
            'width': 3.2,
            'opacity': 1.0,
            'label': 'data(label)',
            'color': '#554D46',
            'text-background-color': '#FFFDF9',
            'text-border-color': '#D8D0C7',
            'z-index': 999
          }
        },
        {
          selector: 'node.path-highlight',
          style: {
            'border-color': '#8F432A',
            'border-width': 3.5,
            'opacity': 1.0,
            'z-index': 999
          }
        }
      ],
      layout: {
        name: 'preset',
        positions: getDynamicCommunityPositions(graphData.nodes, graphData.edges)
      }
    });

    cyRef.current = cy;

    // Node click
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const entityId = node.data('id');
      onSelectEntity(entityId);
      setSelectedEdge(null);
      if (onSelectEdge) onSelectEdge(null);
    });

    // Edge click -> show RelationshipDetailCard
    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      const edgeData = edge.data() as CytoscapeEdgeData;
      setSelectedEdge(edgeData);
      if (onSelectEdge) onSelectEdge(edgeData);
      cy.elements().unselect();
      edge.select();
    });

    // Hover edge to reveal label dynamically
    cy.on('mouseover', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      if (!edge.hasClass('faded')) {
        edge.style('label', edge.data('label'));
      }
    });

    cy.on('mouseout', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      if (!edge.selected() && !edge.hasClass('highlighted') && !edge.hasClass('path-highlight')) {
        edge.style('label', '');
      }
    });

    // Background click
    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        onSelectEntity(null);
        setSelectedEdge(null);
        if (onSelectEdge) onSelectEdge(null);
        setActivePathSteps(null);
      }
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  // Update Graph Elements & Layout on Data / Filters / Mode Change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // 1. Filter Nodes based on entity type and investigation modes
    let filteredNodes = graphData.nodes.filter(n => 
      activeFilterTypes.includes(n.data.type as EntityType) || n.data.id === bridgeNodeId || n.data.id === selectedEntityId
    );

    // If Community view filter is active
    if (activeCommunityFilter) {
      const targetComm = communityStats.find(c => c.id === activeCommunityFilter);
      if (targetComm) {
        const commNodeSet = new Set(targetComm.nodeIds);
        filteredNodes = filteredNodes.filter(n => commNodeSet.has(n.data.id) || n.data.id === bridgeNodeId);
      }
    }

    // If Bridge View is enabled: show bridge node and its direct cross-community links
    if (isBridgeView && bridgeNodeId) {
      const bridgeNeighbors = new Set<string>([bridgeNodeId]);
      graphData.edges.forEach(e => {
        if (e.data.source === bridgeNodeId) bridgeNeighbors.add(e.data.target);
        if (e.data.target === bridgeNodeId) bridgeNeighbors.add(e.data.source);
      });
      filteredNodes = filteredNodes.filter(n => bridgeNeighbors.has(n.data.id));
    }

    // If Story Mode is enabled: prioritize top central nodes dynamically
    if (isStoryMode) {
      const topCentralNodes = [...graphData.nodes]
        .sort((a, b) => (b.data.betweenness || 0) - (a.data.betweenness || 0))
        .slice(0, 8)
        .map(n => n.data.id);
      const storySet = new Set<string>(topCentralNodes);
      filteredNodes = filteredNodes.filter(n => storySet.has(n.data.id));
    }

    const validNodeIds = new Set(filteredNodes.map(n => n.data.id));
    let filteredEdges = graphData.edges.filter(e => 
      validNodeIds.has(e.data.source) && validNodeIds.has(e.data.target)
    );

    // If Bridge View: only edges connected to the bridge node
    if (isBridgeView && bridgeNodeId) {
      filteredEdges = filteredEdges.filter(e => 
        e.data.source === bridgeNodeId || e.data.target === bridgeNodeId
      );
    }

    const positions = getDynamicCommunityPositions(filteredNodes, filteredEdges);

    cy.batch(() => {
      cy.elements().remove();
      cy.add(filteredNodes as any);
      cy.add(filteredEdges as any);
    });

    const layout = cy.layout({
      name: 'preset',
      positions: positions,
      animate: true,
      animationDuration: 350,
      fit: true,
      padding: 60
    } as any);

    layout.run();
  }, [
    graphData, 
    activeFilterTypes, 
    isBridgeView, 
    isCommunityView, 
    isStoryMode, 
    activeCommunityFilter
  ]);

  // Selected Entity, Depth Focus & Neighborhood Highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().removeClass('highlighted faded path-highlight');

      if (selectedEntityId) {
        const targetNode = cy.getElementById(selectedEntityId);
        if (targetNode.length > 0) {
          cy.elements().addClass('faded');
          targetNode.removeClass('faded').addClass('highlighted');

          // Depth 1: Direct 1st-degree neighbors
          const directNeighbors = targetNode.neighborhood();
          directNeighbors.nodes().removeClass('faded').addClass('highlighted');
          directNeighbors.edges().removeClass('faded').addClass('highlighted');

          // Depth 2: Direct + 2nd-degree neighbors
          if (connectionDepth >= 2) {
            const secondDegree = directNeighbors.nodes().neighborhood();
            secondDegree.nodes().removeClass('faded').addClass('highlighted');
            secondDegree.edges().removeClass('faded').addClass('highlighted');
          }

          // Depth 3: Full visible graph stays un-faded
          if (connectionDepth >= 3) {
            cy.elements().removeClass('faded');
          }

          targetNode.select();
        }
      } else {
        cy.elements().unselect();
      }
    });
  }, [selectedEntityId, connectionDepth]);

  // Path Finder Execution
  const handleFindPath = useCallback((src: string, tgt: string) => {
    const cy = cyRef.current;
    if (!cy) return;

    const srcNode = cy.getElementById(src);
    const tgtNode = cy.getElementById(tgt);
    if (!srcNode.length || !tgtNode.length) return;

    const dijkstra = cy.elements().dijkstra({
      root: srcNode,
      directed: false
    });

    const path = dijkstra.pathTo(tgtNode);

    if (path.length > 0) {
      cy.batch(() => {
        cy.elements().addClass('faded').removeClass('path-highlight highlighted');
        path.removeClass('faded').addClass('path-highlight');
      });

      // Extract step-by-step breadcrumbs
      const steps: { from: string; to: string; type: string }[] = [];
      const nodesInPath = path.nodes();
      for (let i = 0; i < nodesInPath.length - 1; i++) {
        const curr = nodesInPath[i];
        const next = nodesInPath[i + 1];
        const connectingEdge = path.edges().filter((e: any) => 
          (e.data('source') === curr.id() && e.data('target') === next.id()) ||
          (e.data('source') === next.id() && e.data('target') === curr.id())
        );
        const relType = connectingEdge.length > 0 ? connectingEdge.data('type') : 'LINKED_TO';
        steps.push({
          from: curr.id(),
          to: next.id(),
          type: relType
        });
      }
      setActivePathSteps(steps);

      // Fit camera on discovered path
      cy.animate({
        fit: {
          eles: path,
          padding: 60
        },
        duration: 400
      });
    }
  }, []);

  const handleClearPath = () => {
    const cy = cyRef.current;
    if (cy) {
      cy.elements().removeClass('path-highlight');
      if (selectedEntityId) {
        const targetNode = cy.getElementById(selectedEntityId);
        if (targetNode.length) targetNode.select();
      } else {
        cy.elements().removeClass('faded');
      }
    }
    setActivePathSteps(null);
  };

  const handleFitNetwork = () => {
    const cy = cyRef.current;
    if (cy) {
      cy.animate({
        fit: {
          eles: cy.elements(),
          padding: 50
        },
        duration: 350
      });
    }
  };

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange(tempFilters);
    }
    setShowFilterModal(false);
  };

  const toggleTypeCheckbox = (t: EntityType) => {
    if (tempFilters.includes(t)) {
      if (tempFilters.length > 1) {
        setTempFilters(tempFilters.filter(item => item !== t));
      }
    } else {
      setTempFilters([...tempFilters, t]);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[540px] bg-[#FAF8F4] rounded-lg overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col select-none">
      
      {/* Subtle Warm Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D8D0C7 1px, transparent 1px),
            linear-gradient(to bottom, #D8D0C7 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Explanatory Banner in Bridge View */}
      {isBridgeView && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-[#FAF3E4] border border-[#EAE0C5] text-[#916A1E] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#B58A32]" />
          <span>Bridge View shows relationships connecting otherwise separate groups.</span>
        </div>
      )}

      {/* Top Explanatory Banner in Story Mode */}
      {isStoryMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-[#FBEBE5] border border-[#E8C9BD] text-[#944424] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Eye className="w-3.5 h-3.5 text-[#B85C38]" />
          <span>Investigation View: Key suspect-asset connections around Rahul Sharma.</span>
        </div>
      )}

      {/* Community Zone Background Headers & Overlays */}
      <CommunityZoneOverlay 
        communityStats={communityStats}
        activeCommunity={activeCommunityFilter}
        onSelectCommunity={(commId) => setActiveCommunityFilter(commId)}
        isCommunityViewActive={isCommunityView}
      />

      {/* Primary Floating Quick-Action Controls */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
        {/* Path Finder Button */}
        <button
          onClick={() => setShowPathFinder(!showPathFinder)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border shadow-sm transition-all ${
            showPathFinder || activePathSteps
              ? 'bg-[#16805C] text-white border-[#116649]'
              : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] border-[#CBD5E1]'
          }`}
          title="Find shortest connection path between entities"
        >
          <Route className="w-3.5 h-3.5 text-[#16805C]" />
          <span>Path Finder</span>
        </button>

        {/* Entity Type Filter Modal Trigger */}
        <button
          onClick={() => {
            setTempFilters(activeFilterTypes);
            setShowFilterModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold shadow-sm transition-colors"
          title="Filter visible entity types"
        >
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Types ({activeFilterTypes.length})</span>
        </button>

        {/* Fit Network View */}
        <button
          onClick={handleFitNetwork}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#12304A] text-xs font-semibold shadow-sm transition-colors"
          title="Fit Network to Viewport"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fit</span>
        </button>
      </div>

      {/* Main Cytoscape Canvas */}
      <div ref={containerRef} className="w-full h-full flex-1 z-0 cursor-grab active:cursor-grabbing bg-[#FAF8F4]" />

      {/* Floating Relationship Detail Card (Edge Inspector) */}
      <RelationshipDetailCard
        edgeData={selectedEdge}
        onClose={() => {
          setSelectedEdge(null);
          if (onSelectEdge) onSelectEdge(null);
          const cy = cyRef.current;
          if (cy) cy.elements().unselect();
        }}
        onSelectEntity={(id) => {
          onSelectEntity(id);
          setSelectedEdge(null);
        }}
      />

      {/* Path Finder Modal / Popover */}
      <PathFinderModal
        isOpen={showPathFinder}
        onClose={() => setShowPathFinder(false)}
        nodes={graphData.nodes}
        sourceId={selectedEntityId || 'Person_044'}
        targetId="Account_103"
        onFindPath={handleFindPath}
        activePathSteps={activePathSteps}
        onClearPath={handleClearPath}
      />

      {/* Filter Modal Dialog */}
      {showFilterModal && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm border border-[#CBD5E1] bg-[#FFFFFF] p-5 rounded-lg shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-[#12304A] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#16805C]" />
                <span>Show Entity Types</span>
              </h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="text-[#64748B] hover:text-[#12304A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#17212B]">
              {[
                { type: 'PERSON' as EntityType, label: 'Persons (Suspects & Leads)' },
                { type: 'PHONE' as EntityType, label: 'Phones (Burner SIMs & Devices)' },
                { type: 'ACCOUNT' as EntityType, label: 'Accounts (Financial Ledgers)' },
                { type: 'LOCATION' as EntityType, label: 'Locations (Physical Coordinates)' },
                { type: 'ORGANIZATION' as EntityType, label: 'Organizations (Corporate Entities)' },
                { type: 'VEHICLE' as EntityType, label: 'Vehicles (Transit Assets)' }
              ].map(({ type, label }) => {
                const checked = tempFilters.includes(type);
                return (
                  <label 
                    key={type}
                    onClick={() => toggleTypeCheckbox(type)}
                    className="flex items-center gap-2.5 cursor-pointer py-1 hover:text-[#16805C]"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      checked ? 'bg-[#16805C] border-[#16805C] text-white' : 'border-[#CBD5E1] bg-[#FFFFFF]'
                    }`}>
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#475569]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilter}
                className="px-4 py-1.5 rounded-md bg-[#16805C] hover:bg-[#116649] text-xs font-semibold text-white shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
