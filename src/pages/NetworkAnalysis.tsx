import React, { useEffect, useState } from 'react';
import { useInvestigation } from '../context/InvestigationContext';
import { networkService, NetworkGraphPayload } from '../services/networkService';
import { entityService } from '../services/entityService';
import { Entity, EntityType } from '../types';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { EntityIntelligencePanel } from '../components/network/EntityIntelligencePanel';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  Search, 
  RotateCcw, 
  Layers, 
  Filter, 
  UserCheck, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Car,
  Check
} from 'lucide-react';

export const NetworkAnalysis: React.FC = () => {
  const { selectedEntityId, setSelectedEntityId, activeCaseId } = useInvestigation();
  const [graphData, setGraphData] = useState<NetworkGraphPayload | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([
    'PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE'
  ]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const data = await networkService.getGraphData({
        caseId: activeCaseId,
        entityTypes: selectedTypes,
        minConfidence: 0.75
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
  }, [activeCaseId, selectedTypes]);

  useEffect(() => {
    if (selectedEntityId) {
      entityService.getEntityById(selectedEntityId)
        .then(ent => setSelectedEntity(ent || null))
        .catch(() => setSelectedEntity(null));
    } else {
      setSelectedEntity(null);
    }
  }, [selectedEntityId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !graphData) return;

    const q = searchQuery.toLowerCase().trim();
    const match = graphData.nodes.find(n => 
      n.data.id.toLowerCase().includes(q) || 
      n.data.label.toLowerCase().includes(q)
    );

    if (match) {
      setSelectedEntityId(match.data.id);
    }
  };

  const handleToggleType = (t: EntityType) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(type => type !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedTypes(['PERSON', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION', 'VEHICLE']);
    setSelectedEntityId('Person_044');
  };

  return (
    <div className="space-y-4 select-none animate-in fade-in">
      
      {/* 1. Hero Search & Quick Filters Bar */}
      <div className="intel-card p-4 border border-slate-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search person, phone number, bank account, vehicle, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090e1a] border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isFilterOpen 
                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-300' 
                  : 'bg-[#090e1a] border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Types</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-lg bg-[#090e1a] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 mr-1 text-xs">Show Entities:</span>
            {[
              { type: 'PERSON' as EntityType, label: 'Persons', icon: UserCheck },
              { type: 'PHONE' as EntityType, label: 'Phones', icon: Phone },
              { type: 'ACCOUNT' as EntityType, label: 'Accounts', icon: CreditCard },
              { type: 'LOCATION' as EntityType, label: 'Locations', icon: MapPin },
              { type: 'ORGANIZATION' as EntityType, label: 'Organizations', icon: Building2 },
              { type: 'VEHICLE' as EntityType, label: 'Vehicles', icon: Car }
            ].map(({ type, label, icon: Icon }) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggleType(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                    active
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium'
                      : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {active && <Check className="w-3 h-3 text-blue-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Main Two-Column Graph & Entity Detail Workspace */}
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

        {/* Entity Intelligence Details Panel (4 Cols on Desktop) */}
        <div className="lg:col-span-4 h-full">
          <EntityIntelligencePanel
            entity={selectedEntity}
            onClose={() => setSelectedEntityId(null)}
            onSelectEntity={(id) => setSelectedEntityId(id)}
          />
        </div>
      </div>
    </div>
  );
};
