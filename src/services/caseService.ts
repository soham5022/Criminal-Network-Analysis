import { Case, CaseStatus, CasePriority } from '../types';
import { mockCases } from '../data/mockCases';
import { fetchApi } from './api';

export interface EvidenceRecord {
  record_id: string;
  case_id: string;
  source_dataset: string;
  record_type: string;
  timestamp: string;
  primary_entity: string;
  counterparty_entity: string;
  summary: string;
  confidence: number;
  sha256_hash: string;
}

interface BackendCase {
  id: string;
  name: string;
  code_name: string;
  status: CaseStatus;
  priority: CasePriority;
  lead_investigator: string;
  badge_number: string;
  department: string;
  date_opened: string;
  last_activity: string;
  entity_count: number;
  relationship_count: number;
  flagged_alerts_count: number;
  clusters_identified: number;
  tags: string[];
  description: string;
  objective: string;
  key_findings: string[];
  evidence_pointers: {
    fir_count?: number;
    cdr_logs_count?: number;
    bank_transactions_count?: number;
    incident_reports_count?: number;
  };
}

function mapBackendCase(bc: BackendCase): Case {
  return {
    id: bc.id,
    name: bc.name,
    codeName: bc.code_name,
    status: bc.status,
    priority: bc.priority,
    leadInvestigator: bc.lead_investigator,
    badgeNumber: bc.badge_number,
    department: bc.department,
    dateOpened: bc.date_opened,
    lastActivity: bc.last_activity,
    entityCount: bc.entity_count,
    relationshipCount: bc.relationship_count,
    flaggedAlertsCount: bc.flagged_alerts_count,
    clustersIdentified: bc.clusters_identified,
    tags: bc.tags,
    description: bc.description,
    objective: bc.objective,
    keyFindings: bc.key_findings,
    evidencePointers: {
      firCount: bc.evidence_pointers?.fir_count || 6,
      cdrLogsCount: bc.evidence_pointers?.cdr_logs_count || 2410,
      bankTransactionsCount: bc.evidence_pointers?.bank_transactions_count || 1820,
      incidentReportsCount: bc.evidence_pointers?.incident_reports_count || 14
    }
  };
}

export const caseService = {
  async getCases(filter?: { status?: CaseStatus; priority?: CasePriority; search?: string }): Promise<Case[]> {
    try {
      const backendCases = await fetchApi<BackendCase[]>('/cases');
      let result = backendCases.map(mapBackendCase);

      if (filter?.status) result = result.filter(c => c.status === filter.status);
      if (filter?.priority) result = result.filter(c => c.priority === filter.priority);
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(c => 
          c.id.toLowerCase().includes(q) || 
          c.name.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return result;
    } catch (err) {
      console.warn('FastAPI backend cases fallback:', err);
      let result = [...mockCases];
      if (filter?.status) result = result.filter(c => c.status === filter.status);
      if (filter?.priority) result = result.filter(c => c.priority === filter.priority);
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(c => 
          c.id.toLowerCase().includes(q) || 
          c.name.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return result;
    }
  },

  async getCaseById(id: string): Promise<Case | undefined> {
    try {
      const bc = await fetchApi<BackendCase>(`/cases/${encodeURIComponent(id)}`);
      return mapBackendCase(bc);
    } catch (err) {
      console.warn(`FastAPI backend case ${id} fallback:`, err);
      return mockCases.find(c => c.id.toLowerCase() === id.toLowerCase());
    }
  },

  async createCase(caseData: {
    name: string;
    description: string;
    priority: CasePriority;
    lead_investigator?: string;
    tags?: string[];
  }): Promise<Case> {
    const bc = await fetchApi<BackendCase>('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData)
    });
    return mapBackendCase(bc);
  },

  async resetDemoCase(caseId: string = 'CASE-1024'): Promise<{ status: string; message: string }> {
    return fetchApi<{ status: string; message: string }>(`/cases/${encodeURIComponent(caseId)}/reset`, {
      method: 'POST'
    });
  },

  async getEvidence(caseId: string = 'CASE-1024'): Promise<EvidenceRecord[]> {
    return fetchApi<EvidenceRecord[]>(`/cases/${encodeURIComponent(caseId)}/evidence`);
  }
};
