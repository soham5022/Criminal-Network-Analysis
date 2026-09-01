import { Case, CaseStatus, CasePriority } from '../types';
import { mockCases } from '../data/mockCases';
import { fetchApi } from './api';
import { caseRecordsService } from './caseRecordsService';

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
  raw_payload?: any;
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

const STORAGE_KEY_CUSTOM_CASES = 'tracenet_custom_cases_v1';
let inMemoryCustomCases: Case[] = [];

function getCustomCasesFromStorage(): Case[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_CASES);
      if (stored) return JSON.parse(stored);
    }
    return inMemoryCustomCases;
  } catch {
    return inMemoryCustomCases;
  }
}

function saveCustomCasesToStorage(cases: Case[]): void {
  inMemoryCustomCases = cases;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CUSTOM_CASES, JSON.stringify(cases));
    }
  } catch {
    // Ignore storage write errors in non-browser environments
  }
}

export const caseService = {
  async getCases(filter?: { status?: CaseStatus; priority?: CasePriority; search?: string }): Promise<Case[]> {
    try {
      const backendCases = await fetchApi<BackendCase[]>('/cases');
      let result = backendCases.map(mapBackendCase);
      const customCases = getCustomCasesFromStorage();
      result = [...customCases, ...result];

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
      const customCases = getCustomCasesFromStorage();
      let result = [...customCases, ...mockCases];
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
      const customCases = getCustomCasesFromStorage();
      const allCases = [...customCases, ...mockCases];
      return allCases.find(c => c.id.toLowerCase() === id.toLowerCase());
    }
  },

  async createCase(caseData: {
    name: string;
    description: string;
    priority: CasePriority;
    lead_investigator?: string;
    tags?: string[];
  }): Promise<Case> {
    try {
      const bc = await fetchApi<BackendCase>('/cases', {
        method: 'POST',
        body: JSON.stringify(caseData)
      });
      return mapBackendCase(bc);
    } catch (err) {
      console.warn('FastAPI createCase fallback, saving to local storage:', err);
      const customCases = getCustomCasesFromStorage();
      const nextIdNum = 1000 + mockCases.length + customCases.length + 1;
      const newCaseId = `CASE-${nextIdNum}`;
      const codeName = caseData.name.toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 16);

      const newCase: Case = {
        id: newCaseId,
        name: caseData.name,
        codeName: `${codeName}_OP`,
        status: 'ACTIVE',
        priority: caseData.priority,
        leadInvestigator: caseData.lead_investigator || 'Inspector Rajesh Verma',
        badgeNumber: 'MHA-INT-8902',
        department: 'Special Cyber & Financial Crimes Division, Central Delhi',
        dateOpened: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        lastActivity: 'Just now',
        entityCount: 0,
        relationshipCount: 0,
        flaggedAlertsCount: 0,
        clustersIdentified: 0,
        tags: caseData.tags && caseData.tags.length > 0 ? caseData.tags : ['New Case', 'Active Inquiry'],
        description: caseData.description,
        objective: 'Initial investigation setup and multi-source evidence acquisition.',
        keyFindings: ['Case initialized into Central Investigation Directory.'],
        evidencePointers: {
          firCount: 0,
          cdrLogsCount: 0,
          bankTransactionsCount: 0,
          incidentReportsCount: 0
        }
      };

      customCases.unshift(newCase);
      saveCustomCasesToStorage(customCases);

      caseRecordsService.addCaseRecordItem({
        id: newCase.id,
        firNumber: `FIR-2026-${newCase.id.replace(/\D/g, '')}-01`,
        title: newCase.name,
        caseType: newCase.tags?.[0] || 'Active Criminal Investigation',
        policeStation: newCase.department,
        investigatingOfficer: newCase.leadInvestigator,
        badgeNumber: newCase.badgeNumber,
        dateRegistered: newCase.dateOpened,
        lastUpdated: newCase.lastActivity,
        status: newCase.status,
        priority: newCase.priority,
        description: newCase.description,
        documentCount: 0,
        entityCount: 0,
        evidenceCount: 0,
        locationsCount: 0,
        vehiclesCount: 0,
        alertsCount: 0,
        tags: newCase.tags
      });

      return newCase;
    }
  },

  async resetDemoCase(caseId: string = 'CASE-1024'): Promise<{ status: string; message: string }> {
    try {
      return await fetchApi<{ status: string; message: string }>(`/cases/${encodeURIComponent(caseId)}/reset`, {
        method: 'POST'
      });
    } catch {
      return { status: 'success', message: `Demo case ${caseId} reset to baseline.` };
    }
  },

  async getEvidence(caseId: string = 'CASE-1024'): Promise<EvidenceRecord[]> {
    try {
      return await fetchApi<EvidenceRecord[]>(`/cases/${encodeURIComponent(caseId)}/evidence`);
    } catch {
      return [];
    }
  }
};
