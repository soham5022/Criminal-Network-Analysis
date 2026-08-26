import React, { useEffect, useState } from 'react';
import { useInvestigation } from '../context/InvestigationContext';
import { networkService, NetworkGraphPayload } from '../services/networkService';
import { entityService } from '../services/entityService';
import { Entity, EntityType, RelationshipType } from '../types';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { EntityIntelligencePanel } from '../components/network/EntityIntelligencePanel';
import { NetworkControlBar } from '../components/network/NetworkControlBar';
import { NetworkLegend } from '../components/network/NetworkLegend';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const NetworkAnalysis: React.FC = () => {
  const { selectedEntityId, setSelectedEntityId, activeCaseId } = useInvestigation();
  const [graphData, setGraphData] = useState<NetworkGraphPayload | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<EntityType[]>([
    'PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'
  ]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(0.75);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const data = await networkService.getGraphData({
        caseId: activeCaseId,
        entityTypes: selectedEntityTypes,
        selectedCommunity,
        minConfidence
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
  }, [activeCaseId, selectedEntityTypes, selectedCommunity, minConfidence]);

  useEffect(() => {
    if (selectedEntityId) {
      entityService.getEntityById(selectedEntityId)
        .then(ent => setSelectedEntity(ent || null))
        .catch(() => setSelectedEntity(null));
    } else {
      setSelectedEntity(null);
    }
  }, [selectedEntityId]);

  const handleToggleEntityType = (type: EntityType) => {
    if (selectedEntityTypes.includes(type)) {
      if (selectedEntityTypes.length > 1) {
        setSelectedEntityTypes(selectedEntityTypes.filter(t => t !== type));
      }
    } else {
      setSelectedEntityTypes([...selectedEntityTypes, type]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEntityTypes(['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE']);
    setSelectedCommunity('ALL');
    setMinConfidence(0.75);
    setSelectedEntityId('Person_044');
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Filter & Query Controls Bar */}
      <NetworkControlBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && graphData) {
            const match = graphData.nodes.find(n => 
              n.data.id.toLowerCase().includes(q.toLowerCase()) || 
              n.data.label.toLowerCase().includes(q.toLowerCase())
            );
            if (match) setSelectedEntityId(match.data.id);
          }
        }}
        selectedEntityTypes={selectedEntityTypes}
        onToggleEntityType={handleToggleEntityType}
        selectedCommunity={selectedCommunity}
        onCommunityChange={setSelectedCommunity}
        minConfidence={minConfidence}
        onConfidenceChange={setMinConfidence}
        onResetFilters={handleResetFilters}
      />

      {/* Main Knowledge Graph Visualizer & Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[640px]">
        {/* Cytoscape Canvas (8 Cols on Desktop) */}
        <div className="lg:col-span-8 h-full">
          {loading || !graphData ? (
            <div className="h-full intel-card p-6 flex flex-col justify-center items-center">
              <LoadingSkeleton rows={5} height="h-10" />
            </div>
          ) : (
            <CytoscapeGraph
              graphData={graphData}
              selectedEntityId={selectedEntityId}
              onSelectEntity={(id) => setSelectedEntityId(id)}
            />
          )}
        </div>

        {/* Entity Intelligence Panel (4 Cols on Desktop) */}
        <div className="lg:col-span-4 h-full">
          <EntityIntelligencePanel
            entity={selectedEntity}
            onClose={() => setSelectedEntityId(null)}
            onSelectEntity={(id) => setSelectedEntityId(id)}
          />
        </div>
      </div>

      {/* Graph Visual Legend */}
      <NetworkLegend />
    </div>
  );
};
