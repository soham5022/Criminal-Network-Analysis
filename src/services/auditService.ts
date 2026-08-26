import { fetchApi } from './api';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_email: string;
  user_name: string;
  user_role: string;
  action: string;
  case_id?: string;
  entity_id?: string;
  details: string;
}

export const auditService = {
  async getAuditLogs(filter?: {
    userEmail?: string;
    action?: string;
    caseId?: string;
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    const params = new URLSearchParams();
    if (filter?.userEmail) params.append('user_email', filter.userEmail);
    if (filter?.action && filter.action !== 'ALL') params.append('action', filter.action);
    if (filter?.caseId) params.append('case_id', filter.caseId);
    if (filter?.limit) params.append('limit', filter.limit.toString());

    return fetchApi<AuditLogEntry[]>(`/audit?${params.toString()}`);
  }
};
