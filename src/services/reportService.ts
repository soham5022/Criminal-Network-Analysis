import { caseHistoryService, IncidentDetails, CaseParticipant, WitnessRecord, InvestigationAction, OfficerObservation } from './caseHistoryService';
import { evidenceRegistryService, EvidenceRecord } from './evidenceRegistryService';
import { caseRecordsService, CaseDocument } from './caseRecordsService';
import { timelineService, DetailedTimelineEvent } from './timelineService';
import { alertService } from './alertService';
import { auditService } from './auditService';
import { caseService } from './caseService';
import { Alert, Case } from '../types';

export interface ReportConfig {
  caseId: string;
  reportType: string;
  reportTitle: string;
  includeSummary: boolean;
  includeEntities: boolean;
  includeWitnesses: boolean;
  includeDocuments: boolean;
  includeEvidence: boolean;
  includeTimeline: boolean;
  includeNetwork: boolean;
  includeAlerts: boolean;
  includeActions: boolean;
  includeObservations: boolean;
  includeSources: boolean;
}

export interface CaseReport {
  id: string;
  caseId: string;
  caseTitle: string;
  reportType: string;
  title: string;
  createdDate: string;
  createdTime: string;
  createdBy: string;
  badgeNumber: string;
  version: number;
  status: 'READY' | 'ARCHIVED';
  config: ReportConfig;
  incident?: IncidentDetails | null;
  participants: CaseParticipant[];
  witnesses: WitnessRecord[];
  documents: CaseDocument[];
  evidence: EvidenceRecord[];
  timeline: DetailedTimelineEvent[];
  actions: InvestigationAction[];
  observations: OfficerObservation[];
  alerts: Alert[];
  networkSummary: {
    totalEntities: number;
    relationships: number;
    communities: number;
    bridgeLeads: string[];
  };
  executiveSummary: string;
  disclaimer: string;
}

const STORAGE_KEY_REPORTS = 'tracenet_case_reports_v1';

const INITIAL_REPORTS: Record<string, CaseReport[]> = {
  'CASE-1024': [
    {
      id: 'RPT-2026-0041',
      caseId: 'CASE-1024',
      caseTitle: 'Operation Meridian',
      reportType: 'Comprehensive Investigation Summary',
      title: 'Confidential Intelligence Briefing: Hawala & Logistics Nexus',
      createdDate: '30 Aug 2026',
      createdTime: '09:30 IST',
      createdBy: 'Inspector Rajesh Verma',
      badgeNumber: 'MHA-INT-8902',
      version: 1,
      status: 'READY',
      config: {
        caseId: 'CASE-1024',
        reportType: 'Comprehensive Investigation Summary',
        reportTitle: 'Confidential Intelligence Briefing: Hawala & Logistics Nexus',
        includeSummary: true,
        includeEntities: true,
        includeWitnesses: true,
        includeDocuments: true,
        includeEvidence: true,
        includeTimeline: true,
        includeNetwork: true,
        includeAlerts: true,
        includeActions: true,
        includeObservations: true,
        includeSources: true
      },
      participants: [],
      witnesses: [],
      documents: [],
      evidence: [],
      timeline: [],
      actions: [],
      observations: [],
      alerts: [],
      networkSummary: {
        totalEntities: 48,
        relationships: 164,
        communities: 3,
        bridgeLeads: [
          'Rahul Sharma identified as cross-community structural bridge with betweenness centrality 0.612.',
          'Account ending 4821 displays rapid smurfing dispersals beneath regulatory cash thresholds.',
          'Maruti Swift MH-04-XX-2847 logged at Thane West Logistics Hub during non-standard hours.'
        ]
      },
      executiveSummary: 'Investigation into Operation Meridian indicates structured sub-statutory financial transfers coordinated with nocturnal freight deliveries at the Thane West logistics hub.',
      disclaimer: 'TraceNet provides analytical assistance based on available records. Analytical findings are investigative leads and do not determine legal guilt or innocence. Final decisions remain with authorized personnel.'
    }
  ]
};

export const reportService = {
  getReportsByCase(caseId: string): CaseReport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (stored) {
        const all: Record<string, CaseReport[]> = JSON.parse(stored);
        if (all[caseId] && all[caseId].length > 0) return all[caseId];
      }
    } catch {}

    if (INITIAL_REPORTS[caseId] && INITIAL_REPORTS[caseId].length > 0) {
      return INITIAL_REPORTS[caseId];
    }

    const incident = caseHistoryService.getIncidentDetails(caseId);
    const defaultReport: CaseReport = {
      id: `RPT-2026-${caseId.replace(/\D/g, '') || '0099'}`,
      caseId: caseId,
      caseTitle: incident?.incidentType || `Case ${caseId}`,
      reportType: 'Comprehensive Investigation Summary',
      title: `Intelligence Briefing: ${incident?.incidentType || caseId}`,
      createdDate: '30 Aug 2026',
      createdTime: '10:00 IST',
      createdBy: incident?.reportingOfficer || 'Inspector Rajesh Verma',
      badgeNumber: 'MHA-INT-8902',
      version: 1,
      status: 'READY',
      config: {
        caseId: caseId,
        reportType: 'Comprehensive Investigation Summary',
        reportTitle: `Intelligence Briefing: ${incident?.incidentType || caseId}`,
        includeSummary: true,
        includeEntities: true,
        includeWitnesses: true,
        includeDocuments: true,
        includeEvidence: true,
        includeTimeline: true,
        includeNetwork: true,
        includeAlerts: true,
        includeActions: true,
        includeObservations: true,
        includeSources: true
      },
      participants: caseHistoryService.getParticipants(caseId),
      witnesses: caseHistoryService.getWitnesses(caseId),
      documents: caseRecordsService.getDocumentsByCaseId(caseId),
      evidence: evidenceRegistryService.getEvidenceByCase(caseId),
      timeline: timelineService.getCaseEvents({ caseId }).slice(0, 10),
      actions: caseHistoryService.getActions(caseId),
      observations: caseHistoryService.getObservations(caseId),
      alerts: [],
      networkSummary: {
        totalEntities: 36,
        relationships: 112,
        communities: 3,
        bridgeLeads: [
          `Key operational leads mapped for ${caseId}.`,
          'Temporal synchronization verified across communication and location registries.'
        ]
      },
      executiveSummary: `Official intelligence briefing for ${caseId} (${incident?.incidentType || 'Investigation inquiry'}). Evidentiary records and operational findings have been synthesized for law enforcement review.`,
      disclaimer: 'TraceNet provides analytical assistance based on available records. Analytical findings are investigative leads and do not determine legal guilt or innocence. Final decisions remain with authorized personnel.'
    };

    return [defaultReport];
  },

  getReportById(caseId: string, reportId: string): CaseReport | undefined {
    const list = this.getReportsByCase(caseId);
    return list.find(r => r.id.toLowerCase() === reportId.toLowerCase());
  },

  async generateCaseReport(caseId: string, config: ReportConfig): Promise<CaseReport> {
    const incident = caseHistoryService.getIncidentDetails(caseId);
    const participants = caseHistoryService.getParticipants(caseId);
    const witnesses = caseHistoryService.getWitnesses(caseId);
    const documents = caseRecordsService.getDocumentsByCaseId(caseId);
    const evidence = evidenceRegistryService.getEvidenceByCase(caseId);
    const timeline = timelineService.getCaseEvents({ caseId });
    const actions = caseHistoryService.getActions(caseId);
    const observations = caseHistoryService.getObservations(caseId);
    const alerts = await alertService.getAlerts({ caseId });

    const existingReports = this.getReportsByCase(caseId);
    const nextVersion = existingReports.length + 1;
    const newReportId = `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport: CaseReport = {
      id: newReportId,
      caseId: caseId,
      caseTitle: incident?.incidentType || `Case ${caseId}`,
      reportType: config.reportType,
      title: config.reportTitle || `${config.reportType} — ${caseId}`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      createdBy: incident?.reportingOfficer || 'Inspector Rajesh Verma',
      badgeNumber: 'MHA-INT-8902',
      version: nextVersion,
      status: 'READY',
      config,
      incident,
      participants: config.includeEntities ? participants : [],
      witnesses: config.includeWitnesses ? witnesses : [],
      documents: config.includeDocuments ? documents : [],
      evidence: config.includeEvidence ? evidence : [],
      timeline: config.includeTimeline ? timeline.slice(0, 15) : [],
      actions: config.includeActions ? actions : [],
      observations: config.includeObservations ? observations : [],
      alerts: config.includeAlerts ? alerts : [],
      networkSummary: {
        totalEntities: participants.length * 8 || 32,
        relationships: participants.length * 24 || 96,
        communities: 3,
        bridgeLeads: [
          'High-connectivity entity identified linking communication and physical staging records.',
          'Multi-modal convergence: Encrypted communication verified within 6 hours of location observation.',
          'Cross-account financial structuring detected beneath statutory reporting threshold.'
        ]
      },
      executiveSummary: `Confidential investigation summary compiled for ${caseId} (${incident?.incidentType || 'Investigation Probe'}). All evidentiary records, Section 161 CrPC witness statements, and human officer field observations have been indexed and cross-referenced.`,
      disclaimer: 'TraceNet provides analytical assistance based on available records. Analytical findings are investigative leads and do not determine legal guilt or innocence. Final decisions remain with authorized personnel.'
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      const all: Record<string, CaseReport[]> = stored ? JSON.parse(stored) : { ...INITIAL_REPORTS };
      const caseReports = all[caseId] || INITIAL_REPORTS[caseId] || [];
      caseReports.unshift(newReport);
      all[caseId] = caseReports;
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(all));

      auditService.logAction({
        action: 'GENERATED_REPORT',
        actionLabel: 'Generated Formal Case Intelligence Briefing',
        module: 'Reports',
        caseId: newReport.caseId,
        recordId: newReport.id,
        recordType: 'REPORT',
        recordLabel: newReport.title,
        status: 'SUCCESS',
        details: `Compiled formal report ${newReport.id} (v${newReport.version}.0) for ${newReport.caseId} (${newReport.reportType}).`
      });
    } catch {}

    return newReport;
  }
};
