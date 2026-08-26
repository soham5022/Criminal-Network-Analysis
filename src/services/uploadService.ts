import { fetchApi } from './api';

export interface UploadResponse {
  status: string;
  filename: string;
  category: string;
  records_received: number;
  records_valid: number;
  records_rejected: number;
  validation_errors?: string[];
  sample_entities?: Array<{ id: string; name: string; type: string }>;
}

export interface GraphBuildResponse {
  status: string;
  case_id: string;
  nodes_created: number;
  relationships_created: number;
  communities_detected: number;
  execution_time_ms: number;
  message: string;
}

export const uploadService = {
  async uploadFile(file: File, caseId: string = 'CASE-1024'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('case_id', caseId);

    return fetchApi<UploadResponse>('/uploads', {
      method: 'POST',
      body: formData
    });
  },

  async buildGraph(caseId: string = 'CASE-1024', reset: boolean = true): Promise<GraphBuildResponse> {
    return fetchApi<GraphBuildResponse>(`/network/build?case_id=${encodeURIComponent(caseId)}&reset=${reset}`, {
      method: 'POST'
    });
  }
};
