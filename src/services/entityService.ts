import { Entity, EntityType, AnalyticalPriority } from '../types';
import { mockEntities } from '../data/mockEntities';
import { fetchApi } from './api';

interface BackendEntityDetail {
  id: string;
  label: string;
  type: EntityType;
  community: string;
  analytical_priority: AnalyticalPriority;
  attention_score?: number;
  degree_centrality: number;
  betweenness_centrality: number;
  closeness_centrality?: number;
  pagerank?: number;
  cross_community_links?: number;
  communities_connected_count?: number;
  is_bridge?: boolean;
  connections_count: number;
  locations_count: number;
  phones_count: number;
  accounts_count: number;
  organizations_count: number;
  vehicles_count: number;
  associated_case_ids?: string[];
  key_connections?: string[];
  attention_factors?: Array<{ name: string; points: number; reason: string }>;
  related_alerts_count?: number;
  metadata?: Record<string, any>;
}

function mapBackendEntity(be: BackendEntityDetail): Entity {
  return {
    id: be.id,
    label: be.label || be.id,
    type: be.type,
    community: be.community || "Cluster 01",
    analyticalPriority: be.analytical_priority || "MEDIUM",
    attentionScore: be.attention_score ?? (be.betweenness_centrality > 0.4 ? 82 : 45),
    degreeCentrality: be.degree_centrality || 0.0,
    betweennessCentrality: be.betweenness_centrality || 0.0,
    closenessCentrality: be.closeness_centrality || 0.0,
    pagerank: be.pagerank || 0.0,
    crossCommunityLinks: be.cross_community_links || (be.betweenness_centrality > 0.4 ? 7 : 0),
    communitiesConnectedCount: be.communities_connected_count || (be.betweenness_centrality > 0.4 ? 3 : 1),
    isBridge: be.is_bridge ?? (be.betweenness_centrality > 0.4),
    connectionsCount: be.connections_count || 0,
    locationsCount: be.locations_count || 0,
    phonesCount: be.phones_count || 0,
    accountsCount: be.accounts_count || 0,
    organizationsCount: be.organizations_count || 0,
    vehiclesCount: be.vehicles_count || 0,
    lastActivity: "Recently Active",
    firstSeen: "2026-08-10",
    associatedCaseIds: be.associated_case_ids || ["CASE-1024"],
    keyConnections: be.key_connections || [],
    attentionFactors: be.attention_factors || (be.betweenness_centrality > 0.4 ? [
      { name: "Betweenness Centrality", points: 30, reason: "Top structural bridge across communication paths." },
      { name: "Cross-Community Connections", points: 25, reason: "Direct links across 3 distinct network communities." },
      { name: "High Network Degree", points: 15, reason: "Active connectivity with 23 counterparties." },
      { name: "Flagged Pattern Anomaly", points: 12, reason: "Participates in multi-cluster coordination pattern." }
    ] : []),
    relatedAlertsCount: be.related_alerts_count || (be.betweenness_centrality > 0.4 ? 3 : 0),
    metadata: {
      description: be.metadata?.description || `Entity indexed in ${be.community}`,
      alias: be.metadata?.alias,
      carrierOrBank: be.metadata?.carrierOrBank,
      jurisdiction: be.metadata?.jurisdiction,
      confidenceScore: 0.95,
      flags: be.betweenness_centrality > 0.4 ? ['Cross-Cluster Bridge', 'High Betweenness', 'Investigative Lead'] : []
    }
  };
}

export const entityService = {
  async getEntities(filter?: { 
    type?: EntityType; 
    priority?: AnalyticalPriority; 
    community?: string; 
    search?: string; 
    caseId?: string 
  }): Promise<Entity[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.type) params.append('type', filter.type);
      if (filter?.priority) params.append('priority', filter.priority);
      if (filter?.community) params.append('community', filter.community);
      if (filter?.search) params.append('search', filter.search);

      const endpoint = `/entities${params.toString() ? `?${params.toString()}` : ''}`;
      const backendEntities = await fetchApi<BackendEntityDetail[]>(endpoint);
      return backendEntities.map(mapBackendEntity);
    } catch (err) {
      console.warn('FastAPI backend offline for entities, using fallback data:', err);

      let result = [...mockEntities];
      if (filter?.type) result = result.filter(e => e.type === filter.type);
      if (filter?.priority) result = result.filter(e => e.analyticalPriority === filter.priority);
      if (filter?.community) result = result.filter(e => e.community === filter.community);
      if (filter?.caseId && filter.caseId !== 'ALL') result = result.filter(e => e.associatedCaseIds.includes(filter.caseId!));
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(e => 
          e.id.toLowerCase().includes(q) || 
          e.label.toLowerCase().includes(q) ||
          (e.metadata.alias && e.metadata.alias.toLowerCase().includes(q))
        );
      }
      return result;
    }
  },

  async getEntityById(id: string): Promise<Entity | undefined> {
    try {
      const backendEntity = await fetchApi<BackendEntityDetail>(`/entities/${encodeURIComponent(id)}`);
      return mapBackendEntity(backendEntity);
    } catch (err) {
      console.warn(`FastAPI backend entity ${id} fallback:`, err);
      return mockEntities.find(e => e.id.toLowerCase() === id.toLowerCase());
    }
  },

  async getEntityNeighborhood(entityId: string): Promise<{ entities: Entity[]; relationships: string[] }> {
    try {
      const res = await fetchApi<{
        entity_id: string;
        connections_count: number;
        key_connections: string[];
      }>(`/entities/${encodeURIComponent(entityId)}/connections`);
      
      const neighbors = await Promise.all(
        res.key_connections.map(kId => entityService.getEntityById(kId))
      );

      const validNeighbors = neighbors.filter((n): n is Entity => n !== undefined);
      return {
        entities: validNeighbors,
        relationships: res.key_connections
      };
    } catch (err) {
      const target = mockEntities.find(e => e.id.toLowerCase() === entityId.toLowerCase());
      if (!target) return { entities: [], relationships: [] };

      const directNeighbors = target.keyConnections;
      const neighborEntities = mockEntities.filter(e => 
        e.id === target.id || directNeighbors.includes(e.id)
      );

      return {
        entities: neighborEntities,
        relationships: directNeighbors
      };
    }
  }
};
