import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles,
  GitFork,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { NetworkGraphPayload } from '../../services/networkService';

interface CytoscapeGraphProps {
  graphData: NetworkGraphPayload;
  selectedEntityId: string | null;
  onSelectEntity: (entityId: string | null) => void;
  showLabels?: boolean;
  viewMode?: 'normal' | 'community' | 'alert';
  showBridgesOnly?: boolean;
  layoutName?: 'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid';
  onLayoutChange?: (layout: 'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid') => void;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  graphData,
  selectedEntityId,
  onSelectEntity,
  showLabels = true,
  viewMode = 'normal',
  showBridgesOnly = false,
  layoutName = 'cose',
  onLayoutChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [currentLayout, setCurrentLayout] = useState<'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid'>(layoutName);
  const [displayLabels, setDisplayLabels] = useState<boolean>(showLabels);
  const [activeViewMode, setActiveViewMode] = useState<'normal' | 'community' | 'alert'>(viewMode);
  const [highlightBridges, setHighlightBridges] = useState<boolean>(showBridgesOnly);

  // Initialize Cytoscape Instance
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autounselectify: false,
      wheelSensitivity: 0.25,
      style: [
        // Base Node Style
        {
          selector: 'node',
          style: {
            'background-color': '#1e293b',
            'border-width': 2,
            'border-color': '#475569',
            'label': displayLabels ? 'data(label)' : '',
            'color': '#f8fafc',
            'font-size': '10px',
            'font-family': 'JetBrains Mono, monospace',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-opacity': 0.85,
            'text-background-color': '#090e1b',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'text-border-opacity': 0.6,
            'text-border-width': 1,
            'text-border-color': '#1e2e4e',
            'width': 'mapData(centrality, 0, 1, 28, 56)',
            'height': 'mapData(centrality, 0, 1, 28, 56)',
            'transition-property': 'background-color, border-color, border-width, opacity, width, height',
            'transition-duration': 0.2
          }
        },
        // Entity Type Specific Styling (Default)
        {
          selector: 'node[type = "PERSON"]',
          style: {
            'background-color': '#0284c7',
            'border-color': '#38bdf8',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type = "PHONE"]',
          style: {
            'background-color': '#059669',
            'border-color': '#34d399',
            'shape': 'round-diamond'
          }
        },
        {
          selector: 'node[type = "ACCOUNT"]',
          style: {
            'background-color': '#d97706',
            'border-color': '#fbbf24',
            'shape': 'hexagon'
          }
        },
        {
          selector: 'node[type = "LOCATION"]',
          style: {
            'background-color': '#7c3aed',
            'border-color': '#a78bfa',
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type = "ORGANIZATION"]',
          style: {
            'background-color': '#4f46e5',
            'border-color': '#818cf8',
            'shape': 'octagon'
          }
        },
        {
          selector: 'node[type = "VEHICLE"]',
          style: {
            'background-color': '#e11d48',
            'border-color': '#fb7185',
            'shape': 'diamond'
          }
        },

        // Phase 3 Community View Color Map Overrides
        ...(activeViewMode === 'community' ? [
          {
            selector: 'node[community = "Cluster 01"]',
            style: { 'background-color': '#0284c7', 'border-color': '#38bdf8' }
          },
          {
            selector: 'node[community = "Cluster 02"]',
            style: { 'background-color': '#9333ea', 'border-color': '#c084fc' }
          },
          {
            selector: 'node[community = "Cluster 03"]',
            style: { 'background-color': '#059669', 'border-color': '#34d399' }
          },
          {
            selector: 'node[community = "Cluster 04"]',
            style: { 'background-color': '#d97706', 'border-color': '#fbbf24' }
          },
          {
            selector: 'node[community = "Cluster 05"]',
            style: { 'background-color': '#db2777', 'border-color': '#f472b6' }
          },
          {
            selector: 'node[community = "Cluster 06"]',
            style: { 'background-color': '#4f46e5', 'border-color': '#818cf8' }
          }
        ] : []),

        // Phase 3 Bridge Entity Visual Accent
        {
          selector: 'node[isBridge = true]',
          style: {
            'border-width': highlightBridges ? 4 : 3,
            'border-color': '#f59e0b',
            'underlay-color': '#fbbf24',
            'underlay-padding': '4px',
            'underlay-opacity': highlightBridges ? 0.45 : 0.2
          }
        },

        // Base Edge Style
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#334155',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.8,
            'curve-style': 'bezier',
            'opacity': 0.7,
            'label': displayLabels ? 'data(label)' : '',
            'color': '#94a3b8',
            'font-size': '8px',
            'font-family': 'JetBrains Mono, monospace',
            'text-rotation': 'autorotate',
            'text-background-opacity': 0.8,
            'text-background-color': '#090e1b',
            'text-background-padding': '2px',
            'transition-property': 'line-color, target-arrow-color, width, opacity',
            'transition-duration': 0.2
          }
        },

        // Cross-Community Edges (Dashed)
        {
          selector: 'edge[isCrossCommunity = true]',
          style: {
            'line-style': 'dashed',
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'width': 2,
            'opacity': 0.85
          }
        },

        // Flagged Anomaly Edges
        {
          selector: 'edge[isAnomaly = true]',
          style: {
            'line-color': '#f43f5e',
            'target-arrow-color': '#f43f5e',
            'width': 2.5,
            'opacity': 0.95
          }
        },

        // Selection & Focus Highlights
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#38bdf8',
            'underlay-color': '#06b6d4',
            'underlay-padding': '8px',
            'underlay-opacity': 0.4,
            'opacity': 1.0,
            'z-index': 999
          }
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#38bdf8',
            'opacity': 1.0,
            'z-index': 99
          }
        },
        {
          selector: 'node.faded',
          style: {
            'opacity': 0.15
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#38bdf8',
            'target-arrow-color': '#38bdf8',
            'width': 3,
            'opacity': 1.0,
            'z-index': 99
          }
        },
        {
          selector: 'edge.faded',
          style: {
            'opacity': 0.08
          }
        }
      ],
      layout: {
        name: currentLayout,
        animate: true,
        animationDuration: 600,
        randomize: false,
        padding: 50
      }
    });

    cyRef.current = cy;

    // Node click handler
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const entityId = node.data('id');
      onSelectEntity(entityId);
    });

    // Canvas background click handler
    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        onSelectEntity(null);
      }
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [activeViewMode, highlightBridges]);

  // Update Elements when graphData changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(graphData.nodes as any);
      cy.add(graphData.edges as any);
    });

    const layout = cy.layout({
      name: currentLayout,
      animate: true,
      animationDuration: 500,
      padding: 60
    } as any);

    layout.run();
  }, [graphData, currentLayout]);

  // Handle Selected Entity Focus & Neighborhood Highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().removeClass('highlighted faded');

      if (selectedEntityId) {
        const targetNode = cy.getElementById(selectedEntityId);
        if (targetNode.length > 0) {
          const neighborhood = targetNode.neighborhood();
          const firstDegree = neighborhood.nodes();
          const connectedEdges = targetNode.connectedEdges();

          cy.elements().addClass('faded');
          targetNode.removeClass('faded').addClass('highlighted');
          firstDegree.removeClass('faded').addClass('highlighted');
          connectedEdges.removeClass('faded').addClass('highlighted');

          targetNode.select();
        }
      } else {
        cy.elements().unselect();
      }
    });
  }, [selectedEntityId]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 40);
  const handleResetLayout = () => {
    cyRef.current?.layout({ name: currentLayout, animate: true, animationDuration: 400, padding: 50 } as any).run();
  };

  return (
    <div className="relative w-full h-full min-h-[550px] bg-[#070b14] rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl flex flex-col select-none">
      
      {/* Top Floating View Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center p-1 rounded-lg bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setActiveViewMode('normal')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeViewMode === 'normal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Normal View
          </button>
          <button
            onClick={() => setActiveViewMode('community')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeViewMode === 'community'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Community View</span>
          </button>
          <button
            onClick={() => setHighlightBridges(!highlightBridges)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              highlightBridges
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Bridges</span>
          </button>
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFit}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Fit Network"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetLayout}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Layout"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={() => setDisplayLabels(!displayLabels)}
          className={`p-2 rounded-lg transition-colors ${
            displayLabels ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'
          }`}
          title={displayLabels ? 'Hide Labels' : 'Show Labels'}
        >
          {displayLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Cytoscape Canvas */}
      <div ref={containerRef} className="w-full h-full flex-1" />

      {/* Bottom Graph Stats Footer */}
      <div className="absolute bottom-3 left-4 z-10 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-md">
        <span>Nodes: <strong className="text-white">{graphData.metrics.totalNodes}</strong></span>
        <span>•</span>
        <span>Edges: <strong className="text-white">{graphData.metrics.totalEdges}</strong></span>
        <span>•</span>
        <span>Density: <strong className="text-cyan-400">{graphData.metrics.density}</strong></span>
        <span>•</span>
        <span>Communities: <strong className="text-purple-400">{graphData.metrics.clusterCount}</strong></span>
      </div>
    </div>
  );
};
