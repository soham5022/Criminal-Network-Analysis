import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ArrowRight, 
  Filter,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Entity, EntityType, AnalyticalPriority } from '../../types';
import { entityService } from '../../services/entityService';
import { EntityTypeBadge, PriorityBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const EntitiesTable: React.FC = () => {
  const { navigateTo, setSelectedEntityId, activeCaseId } = useInvestigation();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [communityFilter, setCommunityFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    entityService.getEntities({
      caseId: activeCaseId,
      type: typeFilter !== 'ALL' ? (typeFilter as EntityType) : undefined,
      priority: priorityFilter !== 'ALL' ? (priorityFilter as AnalyticalPriority) : undefined,
      community: communityFilter !== 'ALL' ? communityFilter : undefined,
      search: search || undefined
    })
      .then(setEntities)
      .catch(err => console.warn('Entities table fallback:', err))
      .finally(() => setIsLoading(false));
  }, [activeCaseId, typeFilter, priorityFilter, communityFilter, search]);

  const handleInspect = (entityId: string) => {
    setSelectedEntityId(entityId);
    navigateTo('network', { entityId });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Search and Filters Bar */}
      <div className="intel-card p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Entity ID, label, carrier, alias..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Types</option>
              <option value="PERSON">Persons</option>
              <option value="PHONE">Phones</option>
              <option value="ACCOUNT">Accounts</option>
              <option value="LOCATION">Locations</option>
              <option value="ORGANIZATION">Organizations</option>
              <option value="VEHICLE">Vehicles</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Community Filter */}
            <select
              value={communityFilter}
              onChange={(e) => setCommunityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Communities</option>
              <option value="Cluster 01">Cluster 01</option>
              <option value="Cluster 02">Cluster 02</option>
              <option value="Cluster 03">Cluster 03</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entities Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Querying algorithmic entity intelligence from knowledge graph...
          </div>
        ) : entities.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            No entities match current filters in this case.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Alias / Label</th>
                  <th className="py-3 px-4 text-center">Community</th>
                  <th className="py-3 px-4 text-right">Connections</th>
                  <th className="py-3 px-4 text-right">Degree</th>
                  <th className="py-3 px-4 text-right">Betweenness</th>
                  <th className="py-3 px-4 text-center">Analytical Priority</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {entities.map((entity) => (
                  <tr
                    key={entity.id}
                    onClick={() => handleInspect(entity.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {entity.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <EntityTypeBadge type={entity.type} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{entity.label !== entity.id ? entity.label : (entity.metadata?.alias || '—')}</div>
                      {entity.metadata?.carrierOrBank && (
                        <div className="text-[10px] text-slate-500 font-mono">{entity.metadata.carrierOrBank}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-[11px] font-mono text-cyan-300 border border-slate-800">
                        {entity.community}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                      {entity.connectionsCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {entity.degreeCentrality.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-semibold">
                      {entity.betweennessCentrality.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <PriorityBadge priority={entity.analyticalPriority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {entity.lastActivity}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspect(entity.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 group-hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Graph</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
