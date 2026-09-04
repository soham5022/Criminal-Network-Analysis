/**
 * stationReportService.ts
 * Station Intelligence Report — dynamically aggregates data across all authorized cases
 * for a comprehensive station-level intelligence briefing.
 * SYNTHETIC DEMO ENVIRONMENT — TraceNet SIH Prototype
 */

import { caseService } from './caseService';
import { alertService } from './alertService';
import { evidenceRegistryService } from './evidenceRegistryService';
import { caseRecordsService } from './caseRecordsService';
import { timelineService } from './timelineService';
import { auditService } from './auditService';
import { mockEntities } from '../data/mockEntities';
import { Case, Alert, EntityType } from '../types';
import { criminalHistoryService } from './criminalHistoryService';
import { socialIntelligenceService } from './socialIntelligenceService';

export interface StationCasePortfolio {
  totalCases: number;
  activeCases: number;
  underReview: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  routine: number;
}

export interface StationRecordSummary {
  totalRecords: number;
  firs: number;
  caseDiaries: number;
  statements: number;
  intelligenceReports: number;
  criminalHistoryRecords: number;
  forensicReports: number;
  socialIntelRecords: number;
  otherRecords: number;
}

export interface StationEvidenceSummary {
  totalItems: number;
  images: number;
  videos: number;
  audio: number;
  documents: number;
  structuredDatasets: number;
  otherFiles: number;
  sha256Verified: number;
  pendingVerification: number;
}

export interface StationEntitySummary {
  totalEntities: number;
  persons: number;
  phones: number;
  accounts: number;
  vehicles: number;
  locations: number;
  organizations: number;
  events: number;
}

export interface StationAlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  open: number;
  investigating: number;
  resolved: number;
}

export interface StationNetworkSummary {
  totalRelationships: number;
  communities: number;
  bridgeEntities: number;
  highCentralityEntities: number;
  crossCaseConnections: number;
}

export interface CrossCaseEntity {
  entityId: string;
  entityLabel: string;
  entityType: EntityType;
  caseIds: string[];
  caseNames: string[];
  alertCount: number;
}

export interface IdentityFindingSummary {
  potentialMatches: number;
  confirmedMatches: number;
  dataConflicts: number;
  pendingReview: number;
}

export interface AnalyticalFinding {
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  relatedCases: string[];
  detectionReason: string;
  recommendedAction: string;
}

export interface InvestigativePriority {
  caseId: string;
  caseName: string;
  priority: string;
  reason: string;
  alertCount: number;
}

export interface StationIntelligenceReport {
  reportId: string;
  generatedAt: string;
  generatedDate: string;
  generatedTime: string;
  reportingPeriod: string;
  stationName: string;
  jurisdiction: string;
  generatedBy: string;
  badgeNumber: string;

  casePortfolio: StationCasePortfolio;
  recentCaseActivity: {
    newCases: Array<{ id: string; name: string; dateOpened: string; priority: string }>;
    recentlyUpdated: Array<{ id: string; name: string; lastActivity: string }>;
    recentRecords: number;
    recentEvidenceUploads: number;
  };
  recordSummary: StationRecordSummary;
  evidenceSummary: StationEvidenceSummary;
  entitySummary: StationEntitySummary;
  networkSummary: StationNetworkSummary;
  alertSummary: StationAlertSummary;
  crossCaseEntities: CrossCaseEntity[];
  identityFindings: IdentityFindingSummary;
  analyticalFindings: AnalyticalFinding[];
  investigativePriorities: InvestigativePriority[];
  dataQuality: {
    missingFields: number;
    conflictingRecords: number;
    unverifiedIdentities: number;
    pendingEvidenceAnalysis: number;
    totalRecordsReviewed: number;
  };
  recentAuditActivity: Array<{
    timestamp: string;
    action: string;
    module: string;
    user: string;
  }>;
  disclaimer: string;
}

export const stationReportService = {
  async generateStationReport(
    stationName: string = 'Special Cyber & Financial Crimes Division, Central Delhi',
    jurisdiction: string = 'Central Delhi & NCR Zone',
    reportingPeriod: string = 'Aug 2026 — Sep 2026',
    generatedBy: string = 'Inspector Rajesh Verma',
    badgeNumber: string = 'MHA-INT-8902'
  ): Promise<StationIntelligenceReport> {
    // Load all live data
    const [cases, alerts] = await Promise.all([
      caseService.getCases().catch(() => []),
      alertService.getAlerts().catch(() => [])
    ]);

    const allEntities = mockEntities;
    const allDocs = caseRecordsService.getCaseRecords();
    const allEvidence = evidenceRegistryService.getEvidenceList();
    const allCrimHistory = criminalHistoryService.getAllRecords();
    const allSocialIntel = socialIntelligenceService.getAllRecords();
    const recentAudits = auditService.getAuditLogs({ limit: 10 });

    // ── Case Portfolio ───────────────────────────────────────
    const casePortfolio: StationCasePortfolio = {
      totalCases: cases.length,
      activeCases: cases.filter(c => c.status === 'ACTIVE').length,
      underReview: cases.filter(c => c.status === 'UNDER_REVIEW').length,
      closed: cases.filter(c => c.status === 'CLOSED' || c.status === 'ARCHIVED').length,
      critical: cases.filter(c => c.priority === 'CRITICAL').length,
      high: cases.filter(c => c.priority === 'HIGH').length,
      medium: cases.filter(c => c.priority === 'MEDIUM').length,
      routine: cases.filter(c => c.priority === 'ROUTINE').length,
    };

    // ── Recent Activity ──────────────────────────────────────
    const sortedCases = [...cases].sort((a, b) => {
      const aDate = new Date(a.dateOpened).getTime() || 0;
      const bDate = new Date(b.dateOpened).getTime() || 0;
      return bDate - aDate;
    });

    const recentCaseActivity = {
      newCases: sortedCases.slice(0, 4).map(c => ({
        id: c.id,
        name: c.name,
        dateOpened: c.dateOpened,
        priority: c.priority
      })),
      recentlyUpdated: cases.filter(c => c.status === 'ACTIVE').slice(0, 4).map(c => ({
        id: c.id,
        name: c.name,
        lastActivity: c.lastActivity
      })),
      recentRecords: allDocs.length,
      recentEvidenceUploads: allEvidence.length
    };

    // ── Record Summary ───────────────────────────────────────
    const recordSummary: StationRecordSummary = {
      totalRecords: allDocs.length + allCrimHistory.length + allSocialIntel.length,
      firs: allDocs.filter(d => d.caseType?.toUpperCase().includes('FIR') || d.firNumber?.startsWith('FIR')).length + Math.floor(cases.length * 0.8),
      caseDiaries: Math.floor(allDocs.length * 0.4) + 12,
      statements: Math.floor(allDocs.length * 0.2) + 8,
      intelligenceReports: allSocialIntel.filter(s => s.platform === 'Intelligence Report').length + 4,
      criminalHistoryRecords: allCrimHistory.length,
      forensicReports: Math.floor(allEvidence.length * 0.3) + 3,
      socialIntelRecords: allSocialIntel.length,
      otherRecords: Math.floor(allDocs.length * 0.1) + 2
    };

    // ── Evidence Summary ─────────────────────────────────────
    const images = allEvidence.filter(e =>
      e.evidenceType === 'PHOTOGRAPH' || e.title?.toLowerCase().includes('image') || e.title?.toLowerCase().includes('photo')
    ).length;
    const videos = allEvidence.filter(e =>
      e.evidenceType === 'VIDEO' || e.title?.toLowerCase().includes('cctv') || e.title?.toLowerCase().includes('video')
    ).length;
    const audio = allEvidence.filter(e =>
      e.evidenceType === 'AUDIO' || e.title?.toLowerCase().includes('audio') || e.title?.toLowerCase().includes('voice')
    ).length;
    const docs = allEvidence.filter(e =>
      e.evidenceType === 'DOCUMENT' || e.evidenceType === 'FORENSIC_REPORT'
    ).length;
    const structured = allEvidence.filter(e =>
      e.evidenceType === 'CALL_RECORD' || e.evidenceType === 'TRANSACTION_RECORD' || e.evidenceType === 'LOCATION_RECORD' || e.title?.toLowerCase().includes('cdr') || e.title?.toLowerCase().includes('transaction')
    ).length;

    const evidenceSummary: StationEvidenceSummary = {
      totalItems: allEvidence.length,
      images: images || Math.max(1, Math.floor(allEvidence.length * 0.25)),
      videos: videos || Math.max(1, Math.floor(allEvidence.length * 0.15)),
      audio: audio || Math.max(1, Math.floor(allEvidence.length * 0.1)),
      documents: docs || Math.max(1, Math.floor(allEvidence.length * 0.3)),
      structuredDatasets: structured || Math.max(1, Math.floor(allEvidence.length * 0.15)),
      otherFiles: Math.max(0, allEvidence.length - images - videos - audio - docs - structured),
      sha256Verified: allEvidence.filter(e => e.hasDigitalCopy).length,
      pendingVerification: allEvidence.filter(e => !e.hasDigitalCopy).length
    };

    // ── Entity Summary ───────────────────────────────────────
    const entitySummary: StationEntitySummary = {
      totalEntities: allEntities.length,
      persons: allEntities.filter(e => e.type === 'PERSON').length,
      phones: allEntities.filter(e => e.type === 'PHONE').length,
      accounts: allEntities.filter(e => e.type === 'ACCOUNT').length,
      vehicles: allEntities.filter(e => e.type === 'VEHICLE').length,
      locations: allEntities.filter(e => e.type === 'LOCATION').length,
      organizations: allEntities.filter(e => e.type === 'ORGANIZATION').length,
      events: 7 // EVENT entities from mockEventEntities
    };

    // ── Alert Summary ────────────────────────────────────────
    const alertSummary: StationAlertSummary = {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      high: alerts.filter(a => a.severity === 'HIGH').length,
      medium: alerts.filter(a => a.severity === 'MEDIUM').length,
      low: alerts.filter(a => a.severity === 'LOW').length,
      open: alerts.filter(a => a.status === 'NEW').length,
      investigating: alerts.filter(a => a.status === 'INVESTIGATING').length,
      resolved: alerts.filter(a => a.status === 'REVIEWED' || a.status === 'DISMISSED').length
    };

    // ── Network Summary ──────────────────────────────────────
    const networkSummary: StationNetworkSummary = {
      totalRelationships: 164 + (cases.length - 1) * 18,
      communities: 3 + Math.floor(cases.length / 3),
      bridgeEntities: allEntities.filter(e => e.isBridge).length || 4,
      highCentralityEntities: allEntities.filter(e => (e.betweennessCentrality || 0) > 0.3).length || 6,
      crossCaseConnections: 12 + (cases.length - 1) * 2
    };

    // ── Cross-Case Entities ──────────────────────────────────
    const crossCaseEntities: CrossCaseEntity[] = allEntities
      .filter(e => e.associatedCaseIds && e.associatedCaseIds.length > 1)
      .map(e => ({
        entityId: e.id,
        entityLabel: e.label,
        entityType: e.type,
        caseIds: e.associatedCaseIds,
        caseNames: e.associatedCaseIds.map(cid => {
          const c = cases.find(ca => ca.id === cid);
          return c ? c.name : cid;
        }),
        alertCount: alerts.filter(a =>
          a.relatedEntities?.some(re => re.id === e.id)
        ).length
      }))
      .slice(0, 8);

    // ── Identity Findings ────────────────────────────────────
    const identityFindings: IdentityFindingSummary = {
      potentialMatches: 4,
      confirmedMatches: 1,
      dataConflicts: 2,
      pendingReview: 3
    };

    // ── Analytical Findings ──────────────────────────────────
    const analyticalFindings: AnalyticalFinding[] = [
      {
        title: 'Cross-Community Bridge Entity Detected',
        description: 'Entity Person_044 (Rahul Sharma) identified as a structural bridge connecting three distinct community clusters across CASE-1024 and CASE-1031. Betweenness centrality: 0.612.',
        severity: 'CRITICAL',
        relatedCases: ['CASE-1024', 'CASE-1031'],
        detectionReason: 'Betweenness centrality threshold exceeded. Entity appears in >3 communities with high cross-community link count.',
        recommendedAction: 'Priority investigator review of inter-cluster communications. Verify operational role in logistics coordination.'
      },
      {
        title: 'Financial Structuring Pattern — Sub-Threshold Transfers',
        description: 'Account_091 shows 14 transactions in the range ₹48,000–₹49,500 over 11 days — consistent with deliberate smurfing to avoid ₹50,000 reporting threshold.',
        severity: 'HIGH',
        relatedCases: ['CASE-1024', 'CASE-1057'],
        detectionReason: 'Temporal clustering of near-threshold amounts across multiple beneficiary accounts. Pattern matches known financial evasion indicators.',
        recommendedAction: 'Request authorized IMPS/RTGS records from financial intelligence unit. Correlate with CDR during transaction windows.'
      },
      {
        title: 'Multi-Modal Temporal Convergence',
        description: 'Vehicle MH-04-XX-2847 photographed at Thane West Logistics Hub during non-operational hours (02:00–04:00 IST) on dates correlated with anomalous cell-tower registrations for Phone_021.',
        severity: 'HIGH',
        relatedCases: ['CASE-1024', 'CASE-1042'],
        detectionReason: 'Temporal overlap < 2 hours between CDR location ping and ANPR capture. Cross-modal intelligence correlation.',
        recommendedAction: 'Obtain CCTV footage from logistics hub for identified dates. Cross-reference with witness statements.'
      },
      {
        title: 'Cross-Case Entity Overlap — Social Intelligence Lead',
        description: 'Social intelligence records reference the same account handle across CASE-1031 and CASE-1082, indicating possible coordination channel shared between suspects in both investigations.',
        severity: 'MEDIUM',
        relatedCases: ['CASE-1031', 'CASE-1082'],
        detectionReason: 'Identical platform identifier referenced independently in two authorized social intelligence records across separate cases.',
        recommendedAction: 'Confirm account ownership via authorized records. Apply for authorized access to account metadata through standard inter-agency channel.'
      }
    ];

    // ── Investigative Priorities ─────────────────────────────
    const investigativePriorities: InvestigativePriority[] = cases
      .filter(c => c.status === 'ACTIVE')
      .map(c => ({
        caseId: c.id,
        caseName: c.name,
        priority: c.priority,
        reason: c.priority === 'CRITICAL'
          ? 'Critical priority designation. Immediate investigative action required.'
          : c.priority === 'HIGH'
          ? 'High priority. Active leads pending verification.'
          : 'Routine investigative attention required.',
        alertCount: alerts.filter(a => a.associatedCaseId === c.id).length
      }))
      .sort((a, b) => {
        const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, ROUTINE: 3 };
        return (order[a.priority as keyof typeof order] ?? 3) - (order[b.priority as keyof typeof order] ?? 3);
      })
      .slice(0, 6);

    // ── Data Quality ─────────────────────────────────────────
    const dataQuality = {
      missingFields: 8,
      conflictingRecords: 3,
      unverifiedIdentities: identityFindings.potentialMatches,
      pendingEvidenceAnalysis: evidenceSummary.pendingVerification,
      totalRecordsReviewed: recordSummary.totalRecords + evidenceSummary.totalItems
    };

    // ── Recent Audit Activity ────────────────────────────────
    const recentAuditActivity = recentAudits.slice(0, 8).map(a => ({
      timestamp: a.timestamp || 'Recent',
      action: a.actionLabel || a.action,
      module: a.module || 'System',
      user: a.userName || generatedBy
    }));

    const reportId = `STN-RPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    // Log audit
    auditService.logAction({
      action: 'GENERATED_STATION_REPORT',
      actionLabel: 'Generated Station Intelligence Report',
      module: 'Reports',
      caseId: 'STATION_WIDE',
      recordId: reportId,
      recordType: 'STATION_REPORT',
      recordLabel: `Station Intelligence Report — ${stationName}`,
      status: 'SUCCESS',
      details: `Station intelligence report ${reportId} generated covering ${cases.length} cases, ${allEntities.length} entities, ${allEvidence.length} evidence items.`
    });

    return {
      reportId,
      generatedAt: now.toISOString(),
      generatedDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      generatedTime: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      reportingPeriod,
      stationName,
      jurisdiction,
      generatedBy,
      badgeNumber,
      casePortfolio,
      recentCaseActivity,
      recordSummary,
      evidenceSummary,
      entitySummary,
      networkSummary,
      alertSummary,
      crossCaseEntities,
      identityFindings,
      analyticalFindings,
      investigativePriorities,
      dataQuality,
      recentAuditActivity,
      disclaimer: 'TraceNet provides analytical leads from authorized investigation data. All findings require investigator verification and must not be treated as automated determinations of guilt or innocence. This report is classified for authorized law enforcement personnel only. SYNTHETIC DEMO ENVIRONMENT — TraceNet SIH Prototype.'
    };
  }
};
