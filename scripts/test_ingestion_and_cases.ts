import { mockCases } from '../src/data/mockCases';
import { caseService } from '../src/services/caseService';
import { caseRecordsService } from '../src/services/caseRecordsService';
import { evidenceRegistryService } from '../src/services/evidenceRegistryService';
import { timelineService } from '../src/services/timelineService';
import { reportService } from '../src/services/reportService';
import { entityService } from '../src/services/entityService';

console.log('=== TRACENET DATA INGESTION & MULTI-CASE ISOLATION AUDIT ===\n');

let errors = 0;

// Test 1: Ingestion into CASE-1068
console.log('Test 1: Ingesting CDR and Document data into CASE-1068 (Operation Bluefin)...');
const newDoc1068 = caseRecordsService.addDocument({
  caseId: 'CASE-1068',
  firNumber: 'FIR-2026-KOL-0209',
  title: 'Ingested Maritime Telecom Dump — Vessel Carrier Gateway',
  documentType: 'CASE_DIARY',
  policeStation: 'Coastal & Maritime Security Division, Kolkata',
  investigatingOfficer: 'ACP Debabrata Mukherjee',
  pageCount: 4,
  content: 'Ingested 1,247 telecommunication records from offshore relay.',
  summary: 'Offshore telemetry packet stream for Operation Bluefin.',
  extractedEntities: [
    { id: 'Ent_1068_991', label: 'Offshore Vessel Relay', type: 'PHONE', roleInDocument: 'Carrier Transceiver' }
  ]
});

// Check that newDoc1068 is in CASE-1068 and NOT in CASE-1024
const docs1068 = caseRecordsService.getDocumentsByCaseId('CASE-1068');
const docs1024 = caseRecordsService.getDocumentsByCaseId('CASE-1024');

const in1068 = docs1068.some(d => d.id === newDoc1068.id);
const in1024 = docs1024.some(d => d.id === newDoc1068.id);

if (in1068 && !in1024) {
  console.log('  ✓ Ingested document stored strictly in CASE-1068 (0 leak into CASE-1024)');
} else {
  console.error('  ✗ Ingestion isolation failed: in1068=', in1068, 'in1024=', in1024);
  errors++;
}

// Test 2: Evidence registration into CASE-1031
console.log('\nTest 2: Registering Evidence into CASE-1031 (Project Shadowline)...');
const newEvidence1031 = evidenceRegistryService.registerEvidence({
  caseId: 'CASE-1031',
  firNumber: 'FIR-2026-MUM-0198',
  title: 'Seized SIM Hardware Router Box',
  evidenceType: 'FORENSIC_REPORT',
  description: 'Physical multichannel SIM hardware seized from electronics shop.',
  collectedDate: '2026-08-26',
  collectedTime: '15:30 IST',
  policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
  registeringOfficer: 'Deputy Director Neha Sengupta',
  badgeNumber: 'MHA-INT-4411',
  relatedEntities: [
    { id: 'Phone_045', label: '+91 XXXXX 73142', type: 'PHONE', role: 'Extracted Profile' }
  ],
  location: 'Lamington Road Electronics Market',
  source: 'Physical Raid Panchnama',
  remarks: 'Sealed with tamper proof tag #TAG-9912.'
});

const evList1031 = evidenceRegistryService.getEvidenceList({ caseId: 'CASE-1031' });
const evList1024 = evidenceRegistryService.getEvidenceList({ caseId: 'CASE-1024' });

const inEv1031 = evList1031.some(e => e.id === newEvidence1031.id);
const inEv1024 = evList1024.some(e => e.id === newEvidence1031.id);

if (inEv1031 && !inEv1024) {
  console.log('  ✓ Evidence registered strictly in CASE-1031 (0 leak into CASE-1024)');
} else {
  console.error('  ✗ Evidence isolation failed: inEv1031=', inEv1031, 'inEv1024=', inEv1024);
  errors++;
}

// Test 3: Timeline synchronization for CASE-1068
console.log('\nTest 3: Timeline event auto-aggregation for CASE-1068...');
const timeline1068 = timelineService.getCaseEvents({ caseId: 'CASE-1068' });
const timeline1024 = timelineService.getCaseEvents({ caseId: 'CASE-1024' });

const docEventIn1068 = timeline1068.some(t => t.description.includes('Maritime Telecom') || t.title.includes('Maritime Telecom'));
const docEventIn1024 = timeline1024.some(t => t.description.includes('Maritime Telecom') || t.title.includes('Maritime Telecom'));

if (docEventIn1068 && !docEventIn1024) {
  console.log('  ✓ Timeline event for CASE-1068 aggregated dynamically (0 leak into CASE-1024)');
} else {
  console.error('  ✗ Timeline aggregation failed: docEventIn1068=', docEventIn1068, 'docEventIn1024=', docEventIn1024);
  errors++;
}

// Test 4: Custom Case Creation & Queryability
console.log('\nTest 4: Creating new custom case...');
caseService.createCase({
  name: 'Operation Thunderstrike',
  description: 'Multi-jurisdictional raid on unauthorized spectrum transceivers.',
  priority: 'CRITICAL',
  lead_investigator: 'ACP Vikramaditya Roy',
  tags: ['Spectrum Intercept', 'Counter-Infiltration']
}).then(newCase => {
  console.log(`  ✓ Created Case: ${newCase.id} — ${newCase.name} (Priority: ${newCase.priority})`);

  // Verify getCases includes newCase
  caseService.getCases().then(allCases => {
    const found = allCases.some(c => c.id === newCase.id);
    if (found) {
      console.log(`  ✓ New case ${newCase.id} is immediately listed in caseService.getCases()`);
    } else {
      console.error(`  ✗ New case ${newCase.id} not found in getCases()`);
      errors++;
    }

    // Verify caseRecordsService.getCaseRecords()
    const allRecords = caseRecordsService.getCaseRecords();
    const foundRecord = allRecords.some(r => r.id === newCase.id);
    if (foundRecord) {
      console.log(`  ✓ New case ${newCase.id} is immediately listed in caseRecordsService.getCaseRecords()`);
    } else {
      console.error(`  ✗ New case ${newCase.id} not found in getCaseRecords()`);
      errors++;
    }

    console.log('\n====================================================');
    console.log(`Ingestion & Isolation Tests Completed. Total Errors: ${errors}`);
    console.log('====================================================');
    if (errors === 0) {
      console.log('ALL INGESTION AND CASE SELECTION TESTS PASSED WITH 100% ISOLATION!');
    }
  });
}).catch(err => {
  console.error('Create case failed:', err);
  errors++;
});
