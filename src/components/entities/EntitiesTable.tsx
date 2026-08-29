import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Entity, EntityType, AnalyticalPriority } from '../../types';
import { entityService } from '../../services/entityService';
import { useInvestigation } from '../../context/InvestigationContext';

import { calculateAttentionScore } from '../network/communityLayout';

export const EntitiesTable: React.FC = () => {
  const { navigateTo, setSelectedEntityId, activeCaseId, openEntityProfile } = useInvestigation();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [communityFilter, setCommunityFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    entityService.getEntities({
      caseId: activeCaseId,
      type: typeFilter !== 'ALL' ? (typeFilter as EntityType) : undefined,
      community: communityFilter !== 'ALL' ? communityFilter : undefined,
      search: search || undefined
    })
      .then(setEntities)
      .catch(err => console.warn('Entities table fallback:', err))
      .finally(() => setIsLoading(false));
  }, [activeCaseId, typeFilter, communityFilter, search]);

  const handleInspect = (entityId: string) => {
    setSelectedEntityId(entityId);
    navigateTo('network', { entityId });
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'PERSON':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">PERSON</span>;
      case 'PHONE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PHONE</span>;
      case 'ACCOUNT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">ACCOUNT</span>;
      case 'LOCATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">LOCATION</span>;
      case 'ORGANIZATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">ORGANIZATION</span>;
      case 'VEHICLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">VEHICLE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">{type}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* Search and Filters Bar */}
      <div className="intel-card p-4 border border-slate-800 space-y-3 bg-[#0d1527]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Entity ID, alias, carrier, account..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Entity Types</option>
              <option value="PERSON">Persons</option>
              <option value="PHONE">Phones</option>
              <option value="ACCOUNT">Accounts</option>
              <option value="LOCATION">Locations</option>
              <option value="ORGANIZATION">Organizations</option>
              <option value="VEHICLE">Vehicles</option>
            </select>

            {/* Community Filter */}
            <select
              value={communityFilter}
              onChange={(e) => setCommunityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Communities</option>
              <option value="Cluster 01">Community 1</option>
              <option value="Cluster 02">Community 2</option>
              <option value="Cluster 03">Community 3</option>
              <option value="Cluster 04">Community 4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entities Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading extracted entities...
          </div>
        ) : entities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No entities match current filters in this case.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#090e1a] text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Alias / Details</th>
                  <th className="py-3 px-4 text-center">Community</th>
                  <th className="py-3 px-4 text-right">Degree (Links)</th>
                  <th className="py-3 px-4 text-right">Betweenness</th>
                  <th className="py-3 px-4 text-center">Attention Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {entities.map((entity) => {
                  const rawBetweenness = entity.betweennessCentrality ?? entity.betweenness ?? 0.35;
                  const rawDegree = entity.degree ?? entity.connectionsCount ?? 6;
                  const rawCross = entity.crossCommunityLinks ?? (rawBetweenness > 0.4 ? 4 : 1);
                  const isBridge = entity.isBridge || rawBetweenness >= 0.5;

                  const { score: attentionScore } = calculateAttentionScore(
                    entity.id,
                    rawBetweenness,
                    rawDegree,
                    rawCross,
                    entity.relatedAlertsCount || (isBridge ? 2 : 0),
                    entity.analyticalPriority || 'HIGH'
                  );

                  return (
                    <tr
                      key={entity.id}
                      onClick={() => handleInspect(entity.id)}
                      className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                        <div className="text-white text-xs font-bold">{entity.label || entity.name || entity.id}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {entity.id}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getTypeBadge(entity.type)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="text-xs text-slate-300">{entity.metadata?.alias || 'Primary Record'}</div>
                        {entity.metadata?.carrierOrBank && (
                          <div className="text-[10px] text-slate-500 font-mono">{entity.metadata.carrierOrBank}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-blue-300 border border-slate-800">
                          {entity.community !== undefined ? `Group ${entity.community}` : 'Group 1'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                        {rawDegree}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-300">
                        {rawBetweenness.toFixed(3)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          attentionScore >= 80 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {attentionScore} / 100 {isBridge && '• BRIDGE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEntityProfile(entity.id)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors inline-flex items-center gap-1 text-[11px] shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>360° Profile</span>
                        </button>
                        <button
                          onClick={() => handleInspect(entity.id)}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors inline-flex items-center gap-1 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Graph</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
