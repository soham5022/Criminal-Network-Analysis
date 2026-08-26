import { fetchApi } from './api';

export interface SystemHealth {
  api_status: string;
  neo4j_status: string;
  analysis_engine_status: string;
  uptime_seconds: number;
  database_nodes: number;
  database_edges: number;
  active_communities: number;
  environment: string;
}

export const healthService = {
  async getHealth(): Promise<{ status: string; api: string; neo4j: string; analysis_engine: string }> {
    return fetchApi<{ status: string; api: string; neo4j: string; analysis_engine: string }>('/health');
  },

  async getNeo4jHealth(): Promise<{ neo4j_connected: boolean; engine_mode: string; driver_status: string; latency_ms: number }> {
    return fetchApi<{ neo4j_connected: boolean; engine_mode: string; driver_status: string; latency_ms: number }>('/health/neo4j');
  },

  async getSystemHealth(): Promise<SystemHealth> {
    return fetchApi<SystemHealth>('/health/system');
  }
};
