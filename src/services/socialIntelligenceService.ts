/**
 * socialIntelligenceService.ts
 * Manages authorized social intelligence records.
 * NOTE: No direct social-media scraping. Records represent authorized imported intelligence / demo data.
 * SYNTHETIC DEMO ENVIRONMENT — TraceNet SIH Prototype
 */

import { SocialIntelRecord } from '../types';
import { auditService } from './auditService';

const STORAGE_KEY = 'tracenet_social_intel_v1';

const INITIAL_RECORDS: SocialIntelRecord[] = [
  {
    id: 'SI-001',
    caseId: 'CASE-1024',
    platform: 'Encrypted Messaging Platform (Authorized Intercept Reference)',
    accountRef: 'ACC-REF-8821-ALPHA',
    subject: 'Rahul Sharma',
    subjectEntityId: 'Person_044',
    date: '2026-08-18',
    time: '21:14 IST',
    location: 'Thane, Maharashtra',
    relatedEntities: ['Person_044', 'Person_017'],
    content: 'Analytical lead: Authorized intercept reference indicates coordination between identified accounts regarding logistics schedule. Content: scheduling references consistent with known MO. Source: Authorized IMEI correlation reference.',
    sourceReference: 'AUTH-INTERCEPT-REF-TN-2026-0818',
    confidence: 'HIGH',
    status: 'REQUIRES_REVIEW',
    registeredBy: 'Inspector Rajesh Verma',
    registeredDate: '20 Aug 2026',
    tags: ['logistics', 'coordination', 'scheduling']
  },
  {
    id: 'SI-002',
    caseId: 'CASE-1024',
    platform: 'Open Source Intelligence — Forum Reference',
    accountRef: 'OSINT-REF-0334',
    subject: 'Operation Meridian Network — Logistics Forum Activity',
    date: '2026-08-12',
    time: '14:30 IST',
    location: 'Unknown',
    relatedEntities: ['Organization_003'],
    content: 'OSINT analytical lead: Open-source forum post references freight services matching description of suspect organization. Post author unidentified. Content archived for investigator review. Treat as unverified until cross-referenced.',
    sourceReference: 'OSINT-FORUM-AUG2026-334',
    confidence: 'LOW',
    status: 'UNVERIFIED',
    registeredBy: 'SI Priya Nair',
    registeredDate: '14 Aug 2026',
    tags: ['osint', 'freight', 'unverified']
  },
  {
    id: 'SI-003',
    caseId: 'CASE-1031',
    platform: 'Authorized Digital Forensics — Device Extract',
    accountRef: 'DFX-REF-CASE1031-007',
    subject: 'Arjun Reddy',
    subjectEntityId: 'Person_029',
    date: '2026-07-28',
    time: '09:00 IST',
    location: 'Delhi',
    relatedEntities: ['Person_029', 'Account_091'],
    content: 'Authorized forensic extract from seized device. References to financial account coordination across jurisdictions. Specific transaction identifiers cross-referenced with registered CDR records.',
    sourceReference: 'DFX-DEL-2026-0728-007',
    confidence: 'HIGH',
    status: 'CONFIRMED_LEAD',
    registeredBy: 'Inspector Rajesh Verma',
    registeredDate: '30 Jul 2026',
    tags: ['forensics', 'device-extract', 'financial']
  },
  {
    id: 'SI-004',
    caseId: 'CASE-1057',
    platform: 'Intelligence Report — Inter-Agency Reference',
    accountRef: 'IB-REF-2026-0224',
    subject: 'Mohammed Rafi Sheikh',
    subjectEntityId: 'Person_061',
    date: '2026-06-15',
    time: '11:00 IST',
    location: 'Mumbai',
    relatedEntities: ['Person_061', 'Organization_007'],
    content: 'Inter-agency intelligence reference indicates subject may have re-established financial network contacts post-FEMA compounding. Reference only — requires authorized investigator follow-up and independent verification.',
    sourceReference: 'IB-INTEL-REF-2026-0224',
    confidence: 'MEDIUM',
    status: 'REQUIRES_REVIEW',
    registeredBy: 'DC Anand Pillai',
    registeredDate: '20 Jun 2026',
    tags: ['inter-agency', 'financial-network', 'requires-verification']
  }
];

function getStoredRecords(): SocialIntelRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: SocialIntelRecord[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...INITIAL_RECORDS];
}

function saveRecords(records: SocialIntelRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export const socialIntelligenceService = {
  getAllRecords(): SocialIntelRecord[] {
    return getStoredRecords();
  },

  getRecordsByCaseId(caseId: string): SocialIntelRecord[] {
    return getStoredRecords().filter(r => r.caseId === caseId);
  },

  getRecordsByEntity(entityId: string): SocialIntelRecord[] {
    return getStoredRecords().filter(r =>
      r.subjectEntityId === entityId || r.relatedEntities.includes(entityId)
    );
  },

  addRecord(record: Omit<SocialIntelRecord, 'id'>): SocialIntelRecord {
    const records = getStoredRecords();
    const newRecord: SocialIntelRecord = {
      ...record,
      id: `SI-${String(records.length + 1).padStart(3, '0')}-${Date.now().toString(36).toUpperCase()}`
    };
    records.unshift(newRecord);
    saveRecords(records);

    auditService.logAction({
      action: 'REGISTERED_SOCIAL_INTEL',
      actionLabel: 'Registered Social Intelligence Record',
      module: 'Records',
      caseId: record.caseId,
      recordId: newRecord.id,
      recordType: 'SOCIAL_INTELLIGENCE',
      recordLabel: `${record.platform} — ${record.subject}`,
      status: 'SUCCESS',
      details: `Social intelligence record ${newRecord.id} registered for ${record.caseId}. Platform: ${record.platform}. Confidence: ${record.confidence}.`
    });

    return newRecord;
  },

  updateStatus(id: string, status: SocialIntelRecord['status']): void {
    const records = getStoredRecords();
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) {
      records[idx].status = status;
      saveRecords(records);
    }
  }
};
