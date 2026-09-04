/**
 * criminalHistoryService.ts
 * Manages criminal history records with cross-case associations.
 * SYNTHETIC DEMO ENVIRONMENT — TraceNet SIH Prototype
 */

import { CriminalHistoryRecord } from '../types';
import { auditService } from './auditService';

const STORAGE_KEY = 'tracenet_criminal_history_v1';

// ── Initial synthetic demo data ──────────────────────────────
const INITIAL_RECORDS: CriminalHistoryRecord[] = [
  {
    id: 'CHR-001',
    personEntityId: 'Person_044',
    personName: 'Rahul Sharma',
    previousCaseId: 'CASE-1031',
    firReference: 'FIR/2024/THANE/0892',
    offenceCategory: 'Financial Fraud — Hawala Operations',
    offenceDate: '12 Mar 2024',
    policeStation: 'Thane West EOW',
    caseStatus: 'Under Investigation',
    disposition: 'Charge sheet filed — Under trial at Sessions Court',
    sourceReference: 'EOW Case File TW-2024-0892',
    notes: 'Subject previously flagged for sub-threshold cash structuring in 2024 operation. Same MO detected in current investigation.',
    linkedCurrentCaseId: 'CASE-1024',
    registeredBy: 'Inspector Rajesh Verma',
    registeredDate: '28 Aug 2026'
  },
  {
    id: 'CHR-002',
    personEntityId: 'Person_017',
    personName: 'Kavita Bose',
    previousCaseId: 'CASE-1042',
    firReference: 'FIR/2023/MUMBAI/1147',
    offenceCategory: 'Logistics Fraud — Misrepresentation of Cargo',
    offenceDate: '07 Sep 2023',
    policeStation: 'Mumbai Port Trust PS',
    caseStatus: 'Closed — Conviction',
    disposition: 'Convicted — 18 months custody, ₹2.5L fine. Sentence served.',
    sourceReference: 'MPT-PS Case 1147/2023',
    notes: 'Subject associated with logistics network implicated in current case. Released Jul 2025.',
    linkedCurrentCaseId: 'CASE-1024',
    registeredBy: 'SI Priya Nair',
    registeredDate: '02 Sep 2026'
  },
  {
    id: 'CHR-003',
    personEntityId: 'Person_029',
    personName: 'Arjun Reddy',
    previousCaseId: 'CASE-1057',
    firReference: 'FIR/2025/DELHI/0334',
    offenceCategory: 'Cybercrime — Unauthorized Account Access',
    offenceDate: '19 Jan 2025',
    policeStation: 'CyberCell Delhi',
    caseStatus: 'Active — Bail granted',
    disposition: 'On bail pending trial. Next court date: 12 Nov 2026.',
    sourceReference: 'CYBER-DEL-2025-0334',
    notes: 'Digital forensic examination confirmed unauthorized access to 3 banking portals. Currently on bail.',
    linkedCurrentCaseId: 'CASE-1031',
    registeredBy: 'Inspector Rajesh Verma',
    registeredDate: '03 Sep 2026'
  },
  {
    id: 'CHR-004',
    personEntityId: 'Person_061',
    personName: 'Mohammed Rafi Sheikh',
    previousCaseId: 'CASE-1068',
    firReference: 'FIR/2022/NAVI/0561',
    offenceCategory: 'Unlicensed Money Transfer — FEMA Violation',
    offenceDate: '30 Apr 2022',
    policeStation: 'Navi Mumbai Financial Crimes PS',
    caseStatus: 'Closed — Compounded',
    disposition: 'Compounded with ED. Penalty of ₹18.3L paid. Passport impounded till Dec 2026.',
    sourceReference: 'ED-NMFC-2022-0561',
    notes: 'FEMA compounding does not preclude IPC investigation. Passport restriction to be noted.',
    linkedCurrentCaseId: 'CASE-1057',
    registeredBy: 'DC Anand Pillai',
    registeredDate: '01 Sep 2026'
  }
];

function getStoredRecords(): CriminalHistoryRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: CriminalHistoryRecord[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...INITIAL_RECORDS];
}

function saveRecords(records: CriminalHistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export const criminalHistoryService = {
  getAllRecords(): CriminalHistoryRecord[] {
    return getStoredRecords();
  },

  getRecordsByCaseId(caseId: string): CriminalHistoryRecord[] {
    return getStoredRecords().filter(r => r.linkedCurrentCaseId === caseId);
  },

  getRecordsByPerson(personEntityId: string): CriminalHistoryRecord[] {
    return getStoredRecords().filter(r => r.personEntityId === personEntityId);
  },

  /** Cross-case: all cases a person appears in */
  getPersonCaseAssociations(personName: string): { caseId: string; role: string }[] {
    const records = getStoredRecords();
    const associations: { caseId: string; role: string }[] = [];
    records.forEach(r => {
      if (r.personName.toLowerCase().includes(personName.toLowerCase())) {
        associations.push({ caseId: r.previousCaseId, role: r.offenceCategory });
        associations.push({ caseId: r.linkedCurrentCaseId, role: 'Current Investigation Subject' });
      }
    });
    return [...new Map(associations.map(a => [a.caseId, a])).values()];
  },

  addRecord(record: Omit<CriminalHistoryRecord, 'id'>): CriminalHistoryRecord {
    const records = getStoredRecords();
    const newRecord: CriminalHistoryRecord = {
      ...record,
      id: `CHR-${String(records.length + 1).padStart(3, '0')}-${Date.now().toString(36).toUpperCase()}`
    };
    records.unshift(newRecord);
    saveRecords(records);

    auditService.logAction({
      action: 'REGISTERED_CRIMINAL_HISTORY',
      actionLabel: 'Registered Criminal History Record',
      module: 'Records',
      caseId: record.linkedCurrentCaseId,
      recordId: newRecord.id,
      recordType: 'CRIMINAL_HISTORY',
      recordLabel: `${record.personName} — ${record.offenceCategory}`,
      status: 'SUCCESS',
      details: `Criminal history record ${newRecord.id} registered for ${record.personName} linking CASE ${record.previousCaseId}.`
    });

    return newRecord;
  }
};
