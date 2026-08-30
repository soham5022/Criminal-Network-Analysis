import { TimelineEvent, EntityType } from '../types';
import { caseHistoryService } from './caseHistoryService';
import { evidenceRegistryService } from './evidenceRegistryService';
import { caseRecordsService, CaseDocument } from './caseRecordsService';
import { alertService } from './alertService';
import { mockCases } from '../data/mockCases';

export type TimelineCategory = 
  | 'ALL'
  | 'INCIDENT'
  | 'PEOPLE'
  | 'WITNESSES'
  | 'EVIDENCE'
  | 'DOCUMENTS'
  | 'COMMUNICATION'
  | 'FINANCIAL'
  | 'LOCATION'
  | 'INVESTIGATION'
  | 'ALERTS';

export interface DetailedTimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  dateFormatted: string;
  timeFormatted: string;
  category: TimelineCategory;
  eventType: string;
  title: string;
  description: string;
  location?: string;
  primaryEntityId?: string;
  primaryEntityLabel?: string;
  primaryEntityType?: EntityType;
  secondaryEntityId?: string;
  secondaryEntityLabel?: string;
  secondaryEntityType?: EntityType;
  sourceType: string;
  sourceId: string;
  sourceDocumentRef?: string;
  sourceEvidenceRef?: string;
  sourceWitnessRef?: string;
  recordedBy: string;
  isAnomaly?: boolean;
  confidence?: number;
}

export interface TimelineFilterOptions {
  caseId: string;
  category?: TimelineCategory;
  search?: string;
  startDate?: string;
  endDate?: string;
  entityId?: string;
}

export interface TimelineStats {
  totalEvents: number;
  evidenceEvents: number;
  witnessEvents: number;
  investigationEvents: number;
  alertEvents: number;
}

export const timelineService = {
  getCaseEvents(filter: TimelineFilterOptions): DetailedTimelineEvent[] {
    const caseId = filter.caseId || 'CASE-1024';
    const events: DetailedTimelineEvent[] = [];

    // 1. Incident & Incident Chronology Updates
    const incident = caseHistoryService.getIncidentDetails(caseId);
    if (incident) {
      events.push({
        id: `EVT-${incident.incidentId}`,
        caseId,
        timestamp: `${incident.date}T08:30:00Z`,
        dateFormatted: incident.date,
        timeFormatted: incident.time,
        category: 'INCIDENT',
        eventType: 'INCIDENT_REPORTED',
        title: `Incident Registered: ${incident.incidentType}`,
        description: incident.description,
        location: incident.location,
        sourceType: 'INCIDENT_REPORT',
        sourceId: incident.incidentId,
        sourceDocumentRef: incident.firNumber,
        recordedBy: incident.reportingOfficer,
        confidence: 1.0
      });

      incident.chronologicalUpdates.forEach((upd, idx) => {
        events.push({
          id: `EVT-UPD-${caseId}-${idx + 1}`,
          caseId,
          timestamp: `2026-06-${10 + idx}T${upd.time.replace(/\D/g, '').slice(0, 2) || '10'}:00:00Z`,
          dateFormatted: upd.date,
          timeFormatted: upd.time,
          category: 'INVESTIGATION',
          eventType: 'INCIDENT_UPDATE',
          title: `Milestone Update: ${upd.note}`,
          description: `Investigative milestone officially entered into case diary by ${upd.officer}.`,
          sourceType: 'CASE_DIARY',
          sourceId: `DIARY-${caseId}-${idx + 1}`,
          recordedBy: upd.officer,
          confidence: 1.0
        });
      });
    }

    // 2. Legal Case Documents
    const docs: CaseDocument[] = caseRecordsService.getDocumentsByCaseId(caseId);
    docs.forEach(doc => {
      events.push({
        id: `EVT-DOC-${doc.id}`,
        caseId,
        timestamp: `${doc.createdDate}T10:00:00Z`,
        dateFormatted: doc.createdDate,
        timeFormatted: '10:00 IST',
        category: 'DOCUMENTS',
        eventType: `DOCUMENT_${doc.documentType}`,
        title: `Legal Document Ingested: ${doc.title}`,
        description: doc.summary,
        location: doc.policeStation,
        sourceType: 'LEGAL_DOCUMENT',
        sourceId: doc.id,
        sourceDocumentRef: doc.id,
        recordedBy: doc.investigatingOfficer,
        confidence: 1.0
      });
    });

    // 3. Registered Digital Evidence
    const evidenceList = evidenceRegistryService.getEvidenceByCase(caseId);
    evidenceList.forEach(ev => {
      let cat: TimelineCategory = 'EVIDENCE';
      if (ev.evidenceType === 'CALL_RECORD') cat = 'COMMUNICATION';
      else if (ev.evidenceType === 'TRANSACTION_RECORD') cat = 'FINANCIAL';
      else if (ev.evidenceType === 'VEHICLE_ANPR_RECORD' || ev.evidenceType === 'LOCATION_RECORD') cat = 'LOCATION';

      events.push({
        id: `EVT-EVD-${ev.id}`,
        caseId,
        timestamp: `${ev.collectedDate}T${ev.collectedTime.replace(/\D/g, '').slice(0, 2) || '12'}:00:00Z`,
        dateFormatted: ev.collectedDate,
        timeFormatted: ev.collectedTime,
        category: cat,
        eventType: `EVIDENCE_${ev.evidenceType}`,
        title: `Evidence Registered: ${ev.title}`,
        description: `${ev.description} | Source: ${ev.source}. Status: ${ev.status}.`,
        location: ev.location,
        primaryEntityId: ev.relatedEntities[0]?.id,
        primaryEntityLabel: ev.relatedEntities[0]?.label,
        primaryEntityType: ev.relatedEntities[0]?.type,
        sourceType: 'EVIDENCE_REGISTRY',
        sourceId: ev.id,
        sourceEvidenceRef: ev.id,
        recordedBy: `${ev.registeringOfficer} (${ev.badgeNumber})`,
        confidence: 0.98
      });
    });

    // 4. Witness Profiles & Statements
    const witnesses = caseHistoryService.getWitnesses(caseId);
    witnesses.forEach(w => {
      // Witness Registration event
      events.push({
        id: `EVT-WIT-${w.id}`,
        caseId,
        timestamp: `${w.interviewDate}T09:00:00Z`,
        dateFormatted: w.interviewDate,
        timeFormatted: w.interviewTime,
        category: 'WITNESSES',
        eventType: 'WITNESS_RECORDED',
        title: `Witness Interviewed: ${w.name}`,
        description: `Witness identified as ${w.relationshipToIncident}. Interview conducted at ${w.interviewLocation}.`,
        location: w.interviewLocation,
        primaryEntityLabel: w.name,
        sourceType: 'WITNESS_REGISTRY',
        sourceId: w.id,
        sourceWitnessRef: w.id,
        recordedBy: `${w.recordingOfficer} (${w.badgeNumber})`,
        confidence: 1.0
      });

      // Statements
      w.statements.forEach(st => {
        events.push({
          id: `EVT-STAT-${st.id}`,
          caseId,
          timestamp: `${st.date}T${st.time.replace(/\D/g, '').slice(0, 2) || '11'}:00:00Z`,
          dateFormatted: st.date,
          timeFormatted: st.time,
          category: 'WITNESSES',
          eventType: `WITNESS_STATEMENT_${st.type}`,
          title: `Section 161 CrPC Statement #${st.statementNumber} — ${w.name}`,
          description: st.summary,
          location: st.location,
          primaryEntityLabel: w.name,
          sourceType: 'WITNESS_STATEMENT',
          sourceId: st.id,
          sourceWitnessRef: w.id,
          recordedBy: st.recordingOfficer,
          confidence: 1.0
        });
      });
    });

    // 5. Investigation Actions
    const actions = caseHistoryService.getActions(caseId);
    actions.forEach(act => {
      events.push({
        id: `EVT-ACT-${act.id}`,
        caseId,
        timestamp: `${act.completedDate || act.dueDate}T14:00:00Z`,
        dateFormatted: act.completedDate || act.dueDate,
        timeFormatted: '14:00 IST',
        category: 'INVESTIGATION',
        eventType: 'INVESTIGATION_ACTION',
        title: `Action: ${act.title}`,
        description: act.findings || `Directive assigned to ${act.assignedOfficer} on target ${act.targetSubject}. Status: ${act.status}.`,
        sourceType: 'ACTION_LOG',
        sourceId: act.id,
        recordedBy: act.assignedOfficer,
        confidence: 1.0
      });
    });

    // 6. Officer Field Observations
    const obsList = caseHistoryService.getObservations(caseId);
    obsList.forEach(obs => {
      events.push({
        id: `EVT-OBS-${obs.id}`,
        caseId,
        timestamp: `${obs.date}T${obs.time.replace(/\D/g, '').slice(0, 2) || '16'}:00:00Z`,
        dateFormatted: obs.date,
        timeFormatted: obs.time,
        category: 'INVESTIGATION',
        eventType: 'OFFICER_FIELD_OBSERVATION',
        title: `Field Observation by ${obs.officer}`,
        description: obs.observation,
        location: obs.location,
        primaryEntityId: obs.relatedEntityIds[0],
        sourceType: 'OFFICER_OBSERVATION',
        sourceId: obs.id,
        sourceEvidenceRef: obs.relatedEvidenceId,
        recordedBy: `${obs.officer} (${obs.badge})`,
        confidence: 1.0
      });
    });

    // 7. Anomaly Alerts for the Case
    if (caseId === 'CASE-1024') {
      events.push({
        id: 'EVT-ALERT-01',
        caseId,
        timestamp: '2026-08-26T11:15:00Z',
        dateFormatted: '26 Aug 2026',
        timeFormatted: '11:15 IST',
        category: 'ALERTS',
        eventType: 'ANOMALOUS_BRIDGE_DETECTED',
        title: 'Algorithmic Anomaly: Cross-Community Bridge Coordination',
        description: 'Topology analysis detected Rahul Sharma as the critical gateway between Community 1 (Distribution) and Community 2 (Logistics).',
        primaryEntityId: 'Person_044',
        primaryEntityLabel: 'Rahul Sharma',
        primaryEntityType: 'PERSON',
        sourceType: 'SYSTEM_ANALYTICAL_ENGINE',
        sourceId: 'ALERT-001',
        recordedBy: 'TraceNet Analytics Core',
        isAnomaly: true,
        confidence: 0.96
      });
    }

    // Sort chronologically descending
    let sorted = events.sort((a, b) => new Date(b.dateFormatted).getTime() - new Date(a.dateFormatted).getTime());

    // Apply Category Filter
    if (filter.category && filter.category !== 'ALL') {
      sorted = sorted.filter(ev => ev.category === filter.category);
    }

    // Apply Search Filter
    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase();
      sorted = sorted.filter(ev => 
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.id.toLowerCase().includes(q) ||
        ev.sourceId.toLowerCase().includes(q) ||
        (ev.location && ev.location.toLowerCase().includes(q)) ||
        (ev.primaryEntityLabel && ev.primaryEntityLabel.toLowerCase().includes(q)) ||
        (ev.primaryEntityId && ev.primaryEntityId.toLowerCase().includes(q)) ||
        (ev.recordedBy && ev.recordedBy.toLowerCase().includes(q))
      );
    }

    // Apply Date Range Filter
    if (filter.startDate) {
      const start = new Date(filter.startDate).getTime();
      if (!isNaN(start)) {
        sorted = sorted.filter(ev => new Date(ev.dateFormatted).getTime() >= start);
      }
    }
    if (filter.endDate) {
      const end = new Date(filter.endDate).getTime();
      if (!isNaN(end)) {
        sorted = sorted.filter(ev => new Date(ev.dateFormatted).getTime() <= end);
      }
    }

    return sorted;
  },

  getTimelineStats(caseId: string): TimelineStats {
    const all = this.getCaseEvents({ caseId });
    return {
      totalEvents: all.length,
      evidenceEvents: all.filter(e => e.category === 'EVIDENCE' || e.category === 'COMMUNICATION' || e.category === 'FINANCIAL' || e.category === 'LOCATION').length,
      witnessEvents: all.filter(e => e.category === 'WITNESSES').length,
      investigationEvents: all.filter(e => e.category === 'INVESTIGATION' || e.category === 'INCIDENT').length,
      alertEvents: all.filter(e => e.category === 'ALERTS').length
    };
  }
};
