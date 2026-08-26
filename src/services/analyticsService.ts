import { fetchApi } from './api';
import { EntityType, AlertSeverity, PatternType } from '../types';

export interface CommunityDetail {
  community_id: string;
  label: string;
  size: number;
  internal_edges_count: number;
  internal_density: number;
  entity_type_distribution: Record<string, number>;
  dominant_relationship_types: Array<{ relationship: string; count: number }>;
  most_central_entities: Array<{
    id: string;
    label: string;
    type: EntityType;
    betweenness: number;
    degree: number;
  }>;
  is_unusually_dense: boolean;
  density_deviation_percent: number;
}

export interface BridgeEntity {
  entity_id: string;
  entity_type: EntityType;
  primary_community: string;
  communities_connected: string[];
  communities_connected_count: number;
  cross_community_links_count: number;
  betweenness_centrality: number;
  degree_centrality: number;
  attention_score: number;
  evidence_snippet: string;
}

export interface DetectedPattern {
  pattern_id: string;
  pattern_type: PatternType;
  severity: AlertSeverity;
  confidence: number;
  primary_entity_id?: string;
  involved_entity_ids: string[];
  title: string;
  timestamp: string;
  evidence: string[];
  explanation: string;
  metrics: Record<string, any>;
  methodology: Record<string, string>;
}

export interface NetworkSummary {
  total_nodes: number;
  total_edges: number;
  baseline_density: number;
  average_degree: number;
  average_betweenness: number;
  communities_count: number;
  bridges_count: number;
  patterns_detected_count: number;
  active_alerts_count: number;
}

export interface ExecutionTelemetry {
  status: string;
  case_id: string;
  records_processed: number;
  entities_discovered: number;
  relationships_found: number;
  communities_detected: number;
  patterns_detected: number;
  alerts_generated: number;
  analysis_duration_seconds: number;
  timestamp: string;
}

export const analyticsService = {
  async runAnalytics(caseId: string = 'CASE-1024', forceReload: boolean = false): Promise<ExecutionTelemetry> {
    return fetchApi<ExecutionTelemetry>(`/analytics/run?case_id=${encodeURIComponent(caseId)}&force_reload=${forceReload}`, {
      method: 'POST'
    });
  },

  async getCommunities(): Promise<CommunityDetail[]> {
    return fetchApi<CommunityDetail[]>('/analytics/communities');
  },

  async getBridges(): Promise<BridgeEntity[]> {
    return fetchApi<BridgeEntity[]>('/analytics/bridges');
  },

  async getPatterns(): Promise<DetectedPattern[]> {
    return fetchApi<DetectedPattern[]>('/analytics/patterns');
  },

  async getNetworkSummary(): Promise<NetworkSummary> {
    return fetchApi<NetworkSummary>('/analytics/network-summary');
  }
};
