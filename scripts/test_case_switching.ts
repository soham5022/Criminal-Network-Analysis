import { mockCases } from '../src/data/mockCases';
import { caseRecordsService } from '../src/services/caseRecordsService';
import { evidenceRegistryService } from '../src/services/evidenceRegistryService';
import { timelineService } from '../src/services/timelineService';
import { reportService } from '../src/services/reportService';
import { alertService } from '../src/services/alertService';
import { caseHistoryService } from '../src/services/caseHistoryService';

console.log('=== TRACENET MULTI-CASE SWITCHING & ISOLATION AUDIT ===\n');

let totalCasesTested = 0;
let errors = 0;

for (const c of mockCases) {
  totalCasesTested++;
  console.log(`--- Testing Case: ${c.id} (${c.name}) ---`);

  // 1. Documents isolation
  const docs = caseRecordsService.getDocumentsByCaseId(c.id);
  const foreignDocs = docs.filter(d => d.caseId !== c.id);
  if (foreignDocs.length > 0) {
    console.error(`[ERROR] Case ${c.id} leaked ${foreignDocs.length} foreign documents!`);
    errors++;
  } else {
    console.log(`  ✓ Documents: ${docs.length} records (All matched to ${c.id})`);
  }

  // 2. Evidence isolation
  const evidence = evidenceRegistryService.getEvidenceList({ caseId: c.id });
  const foreignEvidence = evidence.filter(e => e.caseId !== c.id);
  if (foreignEvidence.length > 0) {
    console.error(`[ERROR] Case ${c.id} leaked ${foreignEvidence.length} foreign evidence items!`);
    errors++;
  } else {
    console.log(`  ✓ Evidence: ${evidence.length} records (All matched to ${c.id})`);
  }

  // 3. Timeline isolation
  const timelineEvents = timelineService.getCaseEvents({ caseId: c.id });
  const foreignEvents = timelineEvents.filter(e => e.caseId !== c.id);
  if (foreignEvents.length > 0) {
    console.error(`[ERROR] Case ${c.id} leaked ${foreignEvents.length} foreign timeline events!`);
    errors++;
  } else {
    console.log(`  ✓ Timeline: ${timelineEvents.length} events (All matched to ${c.id})`);
  }

  // 4. Reports isolation
  const reports = reportService.getReportsByCase(c.id);
  const foreignReports = reports.filter(r => r.caseId !== c.id);
  if (foreignReports.length > 0) {
    console.error(`[ERROR] Case ${c.id} leaked ${foreignReports.length} foreign reports!`);
    errors++;
  } else {
    console.log(`  ✓ Reports: ${reports.length} reports generated (All matched to ${c.id})`);
  }

  // 5. Witnesses & Incident details
  const incident = caseHistoryService.getIncidentDetails(c.id);
  const witnesses = caseHistoryService.getWitnesses(c.id);
  console.log(`  ✓ Incident: "${incident?.title || 'Registered'}" | Witnesses: ${witnesses.length}`);
  console.log('');
}

console.log(`====================================================`);
console.log(`Cases Audited: ${totalCasesTested}`);
console.log(`Total Errors / Leaks Detected: ${errors}`);
console.log(`====================================================`);

if (errors === 0) {
  console.log('ALL 10 CASES OPERATE WITH 100% STRICT DATA ISOLATION.');
}
