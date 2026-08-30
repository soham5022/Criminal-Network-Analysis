import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink,
  Eye
} from 'lucide-react';
import { Entity, EntityType } from '../../types';
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF8FF] text-[#12304A] border border-[#BEE3F8]">PERSON</span>;
      case 'PHONE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">PHONE</span>;
      case 'ACCOUNT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF8FF] text-[#2563A6] border border-[#BEE3F8]">ACCOUNT</span>;
      case 'LOCATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">LOCATION</span>;
      case 'ORGANIZATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] text-[#234E70] border border-[#C7D2FE]">ORGANIZATION</span>;
      case 'VEHICLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">VEHICLE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">{type}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* Search and Filters Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Entity name, ID, alias, account..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
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
              className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
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
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            Loading extracted entities...
          </div>
        ) : entities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            No entities match current filters in this case.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                  <th className="py-3 px-4">Entity Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Alias / Details</th>
                  <th className="py-3 px-4 text-center">Community</th>
                  <th className="py-3 px-4 text-right">Degree (Links)</th>
                  <th className="py-3 px-4 text-right">Betweenness</th>
                  <th className="py-3 px-4 text-center">Attention Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
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
                      className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-[#12304A] text-xs font-bold">{entity.label || entity.name || entity.id}</div>
                        <div className="text-[10px] text-[#64748B] font-mono">ID: {entity.id}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getTypeBadge(entity.type)}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-[#475569]">
                        {entity.metadata?.alias || entity.metadata?.description || 'Primary investigation subject.'}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono text-[#64748B]">
                        {entity.community}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#12304A] whitespace-nowrap">
                        {rawDegree}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#64748B] whitespace-nowrap">
                        {Number(rawBetweenness).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          attentionScore >= 85
                            ? 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]'
                            : attentionScore >= 70
                            ? 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]'
                            : 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]'
                        }`}>
                          {attentionScore} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openEntityProfile(entity.id)}
                            className="p-1.5 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white transition-colors"
                            title="Open 360° Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleInspect(entity.id)}
                            className="p-1.5 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#12304A] transition-colors"
                            title="Inspect in Graph"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
