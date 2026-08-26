import { EntityType, RelationshipType } from '../types';
import { mockEntities } from '../data/mockEntities';
import { mockRelationships } from '../data/mockRelationships';
import { fetchApi } from './api';

export interface CytoscapeNodeData {
  id: string;
  label: string;
  type: EntityType;
  community: string;
  priority: string;
  centrality: number;
  betweenness: number;
  connectionsCount: number;
  isFlagged?: boolean;
}

export interface CytoscapeEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  type: RelationshipType;
  confidence: number;
  isAnomaly?: boolean;
  frequency?: number;
  sourceType: string;
}

export interface NetworkGraphPayload {
  nodes: { data: CytoscapeNodeData }[];
  edges: { data: CytoscapeEdgeData }[];
  metrics: {
    totalNodes: number;
    totalEdges: number;
    density: number;
    clusterCount: number;
    avgDegree: number;
  };
}

export const networkService = {
  async getGraphData(filter?: {
    caseId?: string;
    entityTypes?: EntityType[];
    relationshipTypes?: RelationshipType[];
    minConfidence?: number;
    selectedCommunity?: string;
  }): Promise<NetworkGraphPayload> {
    const caseId = filter?.caseId || 'CASE-1024';

    try {
      // 1. Fetch live graph from FastAPI backend
      const response = await fetchApi<NetworkGraphPayload>(`/network/${caseId}`);
      
      let nodes = response.nodes || [];
      let edges = response.edges || [];

      // Apply client-side filters if specified
      if (filter?.entityTypes && filter.entityTypes.length > 0) {
        nodes = nodes.filter(n => filter.entityTypes!.includes(n.data.type));
      }

      if (filter?.selectedCommunity && filter.selectedCommunity !== 'ALL') {
        nodes = nodes.filter(n => n.data.community === filter.selectedCommunity);
      }

      const validNodeIds = new Set(nodes.map(n => n.data.id));
      edges = edges.filter(e => validNodeIds.has(e.data.source) && validNodeIds.has(e.data.target));

      if (filter?.minConfidence) {
        edges = edges.filter(e => e.data.confidence >= filter.minConfidence!);
      }

      return {
        nodes,
        edges,
        metrics: response.metrics || {
          totalNodes: nodes.length,
          totalEdges: edges.length,
          density: 0.0,
          clusterCount: 1,
          avgDegree: 0.0
        }
      };
    } catch (err) {
      console.warn('FastAPI backend not reachable, using local fallback dataset:', err);

      // 2. Graceful Fallback
      let entities = [...mockEntities];
      let relationships = [...mockRelationships];

      if (filter?.caseId) {
        entities = entities.filter(e => e.associatedCaseIds.includes(filter.caseId!));
      }

      if (filter?.entityTypes && filter.entityTypes.length > 0) {
        entities = entities.filter(e => filter.entityTypes!.includes(e.type));
      }

      if (filter?.selectedCommunity && filter.selectedCommunity !== 'ALL') {
        entities = entities.filter(e => e.community === filter.selectedCommunity);
      }

      const validEntityIds = new Set(entities.map(e => e.id));
      relationships = relationships.filter(r => validEntityIds.has(r.source) && validEntityIds.has(r.target));

      const nodes = entities.map(e => ({
        data: {
          id: e.id,
          label: e.id,
          fullLabel: e.label,
          type: e.type,
          community: e.community,
          priority: e.analyticalPriority,
          centrality: e.degreeCentrality,
          betweenness: e.betweennessCentrality,
          connectionsCount: e.connectionsCount,
          isFlagged: e.analyticalPriority === 'HIGH' || e.analyticalPriority === 'CRITICAL'
        }
      }));

      const edges = relationships.map(r => ({
        data: {
          id: r.id,
          source: r.source,
          target: r.target,
          label: r.type,
          type: r.type,
          confidence: r.confidence,
          isAnomaly: !!r.flaggedAnomaly,
          frequency: r.frequency,
          sourceType: r.sourceType
        }
      }));

      const communities = new Set(entities.map(e => e.community));
      const avgDegree = entities.length > 0 ? (relationships.length * 2) / entities.length : 0;

      return {
        nodes,
        edges,
        metrics: {
          totalNodes: nodes.length,
          totalEdges: edges.length,
          density: Number((relationships.length / Math.max(1, (nodes.length * (nodes.length - 1)) / 2)).toFixed(3)),
          clusterCount: communities.size,
          avgDegree: Number(avgDegree.toFixed(2))
        }
      };
    }
  }
};
