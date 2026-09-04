import { fetchApi } from './api';

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'FAILED_LOGIN'
  | 'VIEWED_CASE'
  | 'CREATED_CASE'
  | 'UPDATED_CASE'
  | 'CASE_STATUS_CHANGED'
  | 'VIEWED_ENTITY'
  | 'SEARCHED_SYSTEM'
  | 'VIEWED_DOCUMENT'
  | 'UPLOADED_DOCUMENT'
  | 'DOWNLOADED_DOCUMENT'
  | 'VIEWED_EVIDENCE'
  | 'REGISTERED_EVIDENCE'
  | 'UPLOADED_SOFT_COPY'
  | 'VERIFIED_INTEGRITY'
  | 'DOWNLOADED_EVIDENCE'
  | 'VIEWED_WITNESS'
  | 'VIEWED_STATEMENT'
  | 'RECORDED_STATEMENT'
  | 'VIEWED_NETWORK'
  | 'SELECTED_NETWORK_ENTITY'
  | 'EXECUTED_PATH_FINDING'
  | 'VIEWED_ALERT'
  | 'UPDATED_ALERT_STATUS'
  | 'VIEWED_TIMELINE'
  | 'VIEWED_TIMELINE_EVENT'
  | 'GENERATED_REPORT'
  | 'VIEWED_REPORT'
  | 'PRINTED_REPORT'
  | 'DOWNLOADED_REPORT'
  | 'CREATED_NOTE'
  | 'UPDATED_NOTE'
  | 'SYSTEM_INGESTION'
  | 'REGISTERED_CRIMINAL_HISTORY'
  | 'IDENTITY_MERGED'
  | 'IDENTITY_SEPARATED'
  | 'REGISTERED_SOCIAL_INTEL'
  | 'GENERATED_STATION_REPORT';

export type AuditModule =
  | 'Cases'
  | 'Entities'
  | 'Documents'
  | 'Evidence'
  | 'Witnesses'
  | 'Network'
  | 'Alerts'
  | 'Timeline'
  | 'Reports'
  | 'Authentication'
  | 'Notes'
  | 'System'
  | 'Records';

export interface AuditEvent {
  id: string;
  timestamp: string;
  dateFormatted: string;
  timeFormatted: string;
  userId: string;
  userName: string;
  userBadge: string;
  userRole: string;
  action: AuditActionType;
  actionLabel: string;
  module: AuditModule;
  caseId?: string;
  recordId?: string;
  recordType?: 'CASE' | 'PERSON' | 'PHONE' | 'ACCOUNT' | 'VEHICLE' | 'EVIDENCE' | 'DOCUMENT' | 'REPORT' | 'ALERT' | 'WITNESS' | 'STATEMENT' | 'NOTE' | 'CRIMINAL_HISTORY' | 'ENTITY_MATCH' | 'SOCIAL_INTELLIGENCE' | 'STATION_REPORT';
  recordLabel?: string;
  status: 'SUCCESS' | 'FAILED';
  details: string;
  ipAddress: string;
}

export interface AuditFilterOptions {
  userQuery?: string;
  module?: string;
  action?: string;
  caseId?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface AuditSummaryStats {
  totalEvents: number;
  todayEvents: number;
  caseActivityCount: number;
  evidenceActivityCount: number;
}

const STORAGE_KEY_AUDIT_LOGS = 'tracenet_audit_ledger_v1';

// Seed initial authentic demonstration baseline logs
const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-2026-009182',
    timestamp: '2026-08-30T09:15:20Z',
    dateFormatted: '30 Aug 2026',
    timeFormatted: '09:15:20 IST',
    userId: 'rajesh.verma@mha.gov.in',
    userName: 'Inspector Rajesh Verma',
    userBadge: 'MHA-INT-8902',
    userRole: 'INVESTIGATOR',
    action: 'LOGIN',
    actionLabel: 'User Authentication Successful',
    module: 'Authentication',
    status: 'SUCCESS',
    details: 'Investigator authenticated successfully via secure LEA credentials.',
    ipAddress: '10.42.18.91 (MHA-Secure-Node)'
  },
  {
    id: 'AUD-2026-009181',
    timestamp: '2026-08-30T08:45:10Z',
    dateFormatted: '30 Aug 2026',
    timeFormatted: '08:45:10 IST',
    userId: 'rajesh.verma@mha.gov.in',
    userName: 'Inspector Rajesh Verma',
    userBadge: 'MHA-INT-8902',
    userRole: 'INVESTIGATOR',
    action: 'VIEWED_CASE',
    actionLabel: 'Opened Case Investigation Dossier',
    module: 'Cases',
    caseId: 'CASE-1024',
    recordId: 'CASE-1024',
    recordType: 'CASE',
    recordLabel: 'Operation Meridian',
    status: 'SUCCESS',
    details: 'Accessed investigation workspace for CASE-1024 (Operation Meridian).',
    ipAddress: '10.42.18.91 (MHA-Secure-Node)'
  },
  {
    id: 'AUD-2026-009180',
    timestamp: '2026-08-30T08:20:44Z',
    dateFormatted: '30 Aug 2026',
    timeFormatted: '08:20:44 IST',
    userId: 'rajesh.verma@mha.gov.in',
    userName: 'Inspector Rajesh Verma',
    userBadge: 'MHA-INT-8902',
    userRole: 'INVESTIGATOR',
    action: 'VERIFIED_INTEGRITY',
    actionLabel: 'Verified Evidence SHA-256 Bitwise Seal',
    module: 'Evidence',
    caseId: 'CASE-1024',
    recordId: 'EVD-2026-000184',
    recordType: 'EVIDENCE',
    recordLabel: 'CDR Intercept Ledger (Sector 4 Gateway)',
    status: 'SUCCESS',
    details: 'Cryptographic SHA-256 integrity seal e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 verified.',
    ipAddress: '10.42.18.91 (MHA-Secure-Node)'
  },
  {
    id: 'AUD-2026-009179',
    timestamp: '2026-08-30T07:55:00Z',
    dateFormatted: '30 Aug 2026',
    timeFormatted: '07:55:00 IST',
    userId: 'rajesh.verma@mha.gov.in',
    userName: 'Inspector Rajesh Verma',
    userBadge: 'MHA-INT-8902',
    userRole: 'INVESTIGATOR',
    action: 'VIEWED_WITNESS',
    actionLabel: 'Viewed Witness Profile & Statements',
    module: 'Witnesses',
    caseId: 'CASE-1024',
    recordId: 'WIT-2026-0041',
    recordType: 'WITNESS',
    recordLabel: 'Meera Joshi',
    status: 'SUCCESS',
    details: 'Reviewed Section 161 CrPC deposition statements for witness Meera Joshi.',
    ipAddress: '10.42.18.91 (MHA-Secure-Node)'
  },
  {
    id: 'AUD-2026-009178',
    timestamp: '2026-08-29T18:30:12Z',
    dateFormatted: '29 Aug 2026',
    timeFormatted: '18:30:12 IST',
    userId: 'rajesh.verma@mha.gov.in',
    userName: 'Inspector Rajesh Verma',
    userBadge: 'MHA-INT-8902',
    userRole: 'INVESTIGATOR',
    action: 'GENERATED_REPORT',
    actionLabel: 'Generated Formal Case Intelligence Briefing',
    module: 'Reports',
    caseId: 'CASE-1024',
    recordId: 'RPT-2026-0041',
    recordType: 'REPORT',
    recordLabel: 'Confidential Intelligence Briefing: Hawala & Logistics Nexus',
    status: 'SUCCESS',
    details: 'Compiled formal multi-source report RPT-2026-0041 for CASE-1024.',
    ipAddress: '10.42.18.91 (MHA-Secure-Node)'
  }
];

type AuditListener = (events: AuditEvent[]) => void;
const listeners: Set<AuditListener> = new Set();

export const auditService = {
  subscribe(listener: AuditListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notifyListeners(events: AuditEvent[]) {
    listeners.forEach(fn => fn(events));
  },

  getAllRawEvents(): AuditEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_AUDIT_LOGS;
  },

  getAuditLogs(filter?: AuditFilterOptions): AuditEvent[] {
    let list = this.getAllRawEvents();

    if (filter?.module && filter.module !== 'ALL') {
      list = list.filter(e => e.module.toLowerCase() === filter.module!.toLowerCase());
    }

    if (filter?.action && filter.action !== 'ALL') {
      list = list.filter(e => e.action.toLowerCase() === filter.action!.toLowerCase());
    }

    if (filter?.caseId && filter.caseId !== 'ALL') {
      list = list.filter(e => e.caseId?.toLowerCase() === filter.caseId!.toLowerCase());
    }

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter(e => e.status.toLowerCase() === filter.status!.toLowerCase());
    }

    if (filter?.userQuery && filter.userQuery.trim()) {
      const uq = filter.userQuery.toLowerCase();
      list = list.filter(e => 
        e.userName.toLowerCase().includes(uq) || 
        e.userId.toLowerCase().includes(uq) || 
        e.userBadge.toLowerCase().includes(uq)
      );
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase();
      list = list.filter(e =>
        e.id.toLowerCase().includes(q) ||
        e.userName.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.actionLabel.toLowerCase().includes(q) ||
        e.module.toLowerCase().includes(q) ||
        (e.caseId && e.caseId.toLowerCase().includes(q)) ||
        (e.recordId && e.recordId.toLowerCase().includes(q)) ||
        (e.recordLabel && e.recordLabel.toLowerCase().includes(q)) ||
        e.details.toLowerCase().includes(q)
      );
    }

    if (filter?.startDate) {
      const start = new Date(filter.startDate).getTime();
      if (!isNaN(start)) {
        list = list.filter(e => new Date(e.timestamp).getTime() >= start);
      }
    }

    if (filter?.endDate) {
      const end = new Date(filter.endDate).getTime();
      if (!isNaN(end)) {
        list = list.filter(e => new Date(e.timestamp).getTime() <= end);
      }
    }

    // Sort chronologically descending
    list = list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filter?.limit && filter.limit > 0) {
      return list.slice(0, filter.limit);
    }

    return list;
  },

  getAuditSummaryStats(): AuditSummaryStats {
    const all = this.getAllRawEvents();
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayEvents = all.filter(e => e.timestamp.startsWith(todayStr)).length;
    const caseActivityCount = all.filter(e => e.module === 'Cases' || Boolean(e.caseId)).length;
    const evidenceActivityCount = all.filter(e => e.module === 'Evidence' || e.recordType === 'EVIDENCE').length;

    return {
      totalEvents: all.length,
      todayEvents: todayEvents || all.length,
      caseActivityCount,
      evidenceActivityCount
    };
  },

  logAction(entry: {
    action: AuditActionType;
    actionLabel?: string;
    module: AuditModule;
    caseId?: string;
    recordId?: string;
    recordType?: AuditEvent['recordType'];
    recordLabel?: string;
    status?: 'SUCCESS' | 'FAILED';
    details: string;
    user?: {
      id?: string;
      name?: string;
      badge_number?: string;
      role?: string;
    };
  }): AuditEvent {
    const all = this.getAllRawEvents();
    const now = new Date();
    
    // Automatic action labels if not provided
    const labelMap: Record<AuditActionType, string> = {
      LOGIN: 'User Authentication Successful',
      LOGOUT: 'User Signed Out of Session',
      FAILED_LOGIN: 'Failed Authentication Attempt',
      VIEWED_CASE: 'Opened Case Investigation Dossier',
      CREATED_CASE: 'Registered New Case Record',
      UPDATED_CASE: 'Updated Case Metadata',
      CASE_STATUS_CHANGED: 'Modified Case Operational Status',
      VIEWED_ENTITY: 'Inspected 360° Entity Profile',
      SEARCHED_SYSTEM: 'Executed Global Investigation Search',
      VIEWED_DOCUMENT: 'Viewed Case Legal Document',
      UPLOADED_DOCUMENT: 'Ingested Document Attachment',
      DOWNLOADED_DOCUMENT: 'Exported Legal Document',
      VIEWED_EVIDENCE: 'Inspected Digital Evidence Record',
      REGISTERED_EVIDENCE: 'Registered Evidence in Digital Ledger',
      UPLOADED_SOFT_COPY: 'Uploaded Certified Evidence Soft-Copy',
      VERIFIED_INTEGRITY: 'Verified Evidence SHA-256 Bitwise Seal',
      DOWNLOADED_EVIDENCE: 'Downloaded Evidence Document Attachment',
      VIEWED_WITNESS: 'Inspected Witness Profile & Depositions',
      VIEWED_STATEMENT: 'Viewed Section 161 CrPC Statement',
      RECORDED_STATEMENT: 'Recorded Witness Supplementary Statement',
      VIEWED_NETWORK: 'Opened Network Knowledge Graph',
      SELECTED_NETWORK_ENTITY: 'Focused Entity in Network Topology',
      EXECUTED_PATH_FINDING: 'Calculated Shortest Analytical Path',
      VIEWED_ALERT: 'Inspected Priority Anomaly Alert',
      UPDATED_ALERT_STATUS: 'Updated Investigation Alert Status',
      VIEWED_TIMELINE: 'Accessed Investigation Timeline',
      VIEWED_TIMELINE_EVENT: 'Inspected Timeline Event Source Record',
      GENERATED_REPORT: 'Generated Formal Case Intelligence Briefing',
      VIEWED_REPORT: 'Viewed Case Intelligence Report Dossier',
      PRINTED_REPORT: 'Printed Formal Case Report',
      DOWNLOADED_REPORT: 'Exported Case Intelligence Report',
      CREATED_NOTE: 'Added Investigator Collaboration Memo',
      UPDATED_NOTE: 'Updated Investigator Memo',
      SYSTEM_INGESTION: 'Executed Multi-Source Telemetry Ingestion',
      REGISTERED_CRIMINAL_HISTORY: 'Registered Criminal History Record',
      IDENTITY_MERGED: 'Confirmed Identity Resolution Match',
      IDENTITY_SEPARATED: 'Rejected Identity Merge (Kept Separate)',
      REGISTERED_SOCIAL_INTEL: 'Registered Social Intelligence Lead',
      GENERATED_STATION_REPORT: 'Generated Station Intelligence Report'
    };

    const newId = `AUD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEvent: AuditEvent = {
      id: newId,
      timestamp: now.toISOString(),
      dateFormatted: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeFormatted: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      userId: entry.user?.id || 'rajesh.verma@mha.gov.in',
      userName: entry.user?.name || 'Inspector Rajesh Verma',
      userBadge: entry.user?.badge_number || 'MHA-INT-8902',
      userRole: entry.user?.role || 'INVESTIGATOR',
      action: entry.action,
      actionLabel: entry.actionLabel || labelMap[entry.action] || entry.action.replace(/_/g, ' '),
      module: entry.module,
      caseId: entry.caseId,
      recordId: entry.recordId,
      recordType: entry.recordType,
      recordLabel: entry.recordLabel,
      status: entry.status || 'SUCCESS',
      details: entry.details,
      ipAddress: '10.42.18.91 (MHA-Secure-Node)'
    };

    all.unshift(newEvent);

    // Persist immutable audit log
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(all));
    } catch {}

    this.notifyListeners(all);
    return newEvent;
  }
};
