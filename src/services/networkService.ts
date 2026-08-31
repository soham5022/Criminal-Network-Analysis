import { EntityType, RelationshipType } from '../types';
import { mockEntities } from '../data/mockEntities';
import { mockRelationships } from '../data/mockRelationships';
import { fetchApi } from './api';

export interface CytoscapeNodeData {
  id: string;
  label: string;
  fullLabel: string;
  type: EntityType;
  community: string | number;
  priority: string;
  centrality: number;
  betweenness: number;
  connectionsCount: number;
  isFlagged?: boolean;
  associatedCaseIds: string[];
  isCrossCase: boolean;
  caseCount: number;
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
  associatedCaseIds?: string[];
}

export interface NetworkGraphPayload {
  nodes: { data: CytoscapeNodeData }[];
  edges: { data: CytoscapeEdgeData }[];
  metrics: {
    totalCases: number;
    totalNodes: number;
    totalEdges: number;
    density: number;
    clusterCount: number;
    avgDegree: number;
    crossCaseCount: number;
  };
}

export const networkService = {
  async getGraphData(filter?: {
    caseId?: string;
    caseIds?: string[];
    entityTypes?: EntityType[];
    relationshipTypes?: RelationshipType[];
    minConfidence?: number;
    selectedCommunity?: string;
    depth?: number;
  }): Promise<NetworkGraphPayload> {
    const requestedCaseIds = filter?.caseIds && filter.caseIds.length > 0 
      ? filter.caseIds 
      : (filter?.caseId ? [filter.caseId] : ['ALL']);

    const isAllCases = requestedCaseIds.includes('ALL');

    try {
      // 1. Fetch live graph from FastAPI backend if available
      const endpoint = isAllCases ? '/network' : `/network/${requestedCaseIds[0]}`;
      const response = await fetchApi<NetworkGraphPayload>(endpoint);
      
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

      if (filter?.relationshipTypes && filter.relationshipTypes.length > 0) {
        edges = edges.filter(e => filter.relationshipTypes!.includes(e.data.type));
      }

      if (filter?.minConfidence) {
        edges = edges.filter(e => e.data.confidence >= filter.minConfidence!);
      }

      return {
        nodes,
        edges,
        metrics: response.metrics || {
          totalCases: isAllCases ? 10 : requestedCaseIds.length,
          totalNodes: nodes.length,
          totalEdges: edges.length,
          density: 0.0,
          clusterCount: 1,
          avgDegree: 0.0,
          crossCaseCount: 0
        }
      };
    } catch (err) {
      // 2. Local Fallback Dataset with Multi-Case Aggregation
      let entities = [...mockEntities];
      let relationships = [...mockRelationships];

      // Multi-Case Filtering
      if (!isAllCases) {
        entities = entities.filter(e => 
          e.associatedCaseIds.some(cId => requestedCaseIds.includes(cId))
        );
      }

      // Entity Types Filter
      if (filter?.entityTypes && filter.entityTypes.length > 0) {
        entities = entities.filter(e => filter.entityTypes!.includes(e.type));
      }

      // Community Filter
      if (filter?.selectedCommunity && filter.selectedCommunity !== 'ALL') {
        entities = entities.filter(e => e.community === filter.selectedCommunity);
      }

      const validEntityIds = new Set(entities.map(e => e.id));
      relationships = relationships.filter(r => validEntityIds.has(r.source) && validEntityIds.has(r.target));

      // Relationship Types Filter
      if (filter?.relationshipTypes && filter.relationshipTypes.length > 0) {
        relationships = relationships.filter(r => filter.relationshipTypes!.includes(r.type));
      }

      // Min Confidence Filter
      if (filter?.minConfidence) {
        relationships = relationships.filter(r => r.confidence >= filter.minConfidence!);
      }

      const nodes = entities.map(e => {
        const isCrossCase = e.associatedCaseIds.length > 1;
        return {
          data: {
            id: e.id,
            label: e.label || e.name || e.id,
            fullLabel: e.label || e.name || e.id,
            type: e.type,
            community: e.community,
            priority: e.analyticalPriority,
            centrality: e.degreeCentrality,
            betweenness: e.betweennessCentrality,
            connectionsCount: e.connectionsCount,
            isFlagged: e.analyticalPriority === 'HIGH' || e.analyticalPriority === 'CRITICAL',
            associatedCaseIds: e.associatedCaseIds,
            isCrossCase,
            caseCount: e.associatedCaseIds.length
          }
        };
      });

      const entityCaseMap = new Map<string, string[]>();
      entities.forEach(e => entityCaseMap.set(e.id, e.associatedCaseIds));

      const edges = relationships.map(r => {
        const sourceCases = entityCaseMap.get(r.source) || [];
        const targetCases = entityCaseMap.get(r.target) || [];
        const commonCases = sourceCases.filter(c => targetCases.includes(c));

        return {
          data: {
            id: r.id,
            source: r.source,
            target: r.target,
            label: r.type,
            type: r.type,
            confidence: r.confidence,
            isAnomaly: !!r.flaggedAnomaly,
            frequency: r.frequency,
            sourceType: r.sourceType,
            associatedCaseIds: commonCases.length > 0 ? commonCases : sourceCases
          }
        };
      });

      const allInvolvedCases = new Set<string>();
      entities.forEach(e => e.associatedCaseIds.forEach(c => allInvolvedCases.add(c)));

      const communities = new Set(entities.map(e => e.community));
      const avgDegree = entities.length > 0 ? (relationships.length * 2) / entities.length : 0;
      const crossCaseNodesCount = entities.filter(e => e.associatedCaseIds.length > 1).length;

      return {
        nodes,
        edges,
        metrics: {
          totalCases: isAllCases ? 10 : requestedCaseIds.length,
          totalNodes: nodes.length,
          totalEdges: edges.length,
          density: Number((relationships.length / Math.max(1, (nodes.length * (nodes.length - 1)) / 2)).toFixed(3)),
          clusterCount: communities.size,
          avgDegree: Number(avgDegree.toFixed(2)),
          crossCaseCount: crossCaseNodesCount
        }
      };
    }
  }
};
