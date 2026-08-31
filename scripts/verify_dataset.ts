import { mockCases } from '../src/data/mockCases';
import { mockEntities } from '../src/data/mockEntities';
import { mockRelationships } from '../src/data/mockRelationships';
import { mockAlerts } from '../src/data/mockAlerts';
import { caseRecordsService } from '../src/services/caseRecordsService';
import { evidenceRegistryService } from '../src/services/evidenceRegistryService';

console.log('=== TRACENET DATASET INTEGRITY AUDIT ===');

const caseIds = new Set(mockCases.map(c => c.id));
const entityIds = new Set(mockEntities.map(e => e.id));

console.log(`Cases registered: ${caseIds.size}`);
console.log(`Entities registered: ${entityIds.size}`);
console.log(`Relationships registered: ${mockRelationships.length}`);

let issues = 0;

// 1. Check Entity Cases
mockEntities.forEach(e => {
  e.associatedCaseIds.forEach(cId => {
    if (!caseIds.has(cId)) {
      console.error(`[ERROR] Entity ${e.id} references non-existent case ${cId}`);
      issues++;
    }
  });
  if (e.keyConnections) {
    e.keyConnections.forEach(targetId => {
      if (!entityIds.has(targetId)) {
        console.warn(`[WARN] Entity ${e.id} has keyConnection to missing entity ${targetId}`);
        issues++;
      }
    });
  }
});

// 2. Check Relationships
mockRelationships.forEach(r => {
  if (!entityIds.has(r.source)) {
    console.error(`[ERROR] Relationship ${r.id} has invalid source ${r.source}`);
    issues++;
  }
  if (!entityIds.has(r.target)) {
    console.error(`[ERROR] Relationship ${r.id} has invalid target ${r.target}`);
    issues++;
  }
});

// 3. Check Alerts
mockAlerts.forEach(a => {
  if (a.associatedCaseId && !caseIds.has(a.associatedCaseId)) {
    console.error(`[ERROR] Alert ${a.id} has invalid associatedCaseId ${a.associatedCaseId}`);
    issues++;
  }
  if (a.relatedEntities) {
    a.relatedEntities.forEach(rel => {
      if (!entityIds.has(rel.id)) {
        console.error(`[ERROR] Alert ${a.id} references invalid entity ${rel.id}`);
        issues++;
      }
    });
  }
});

// 4. Check Evidence
const allEvidence = evidenceRegistryService.getEvidenceList();
allEvidence.forEach(ev => {
  if (!caseIds.has(ev.caseId)) {
    console.error(`[ERROR] Evidence ${ev.id} references invalid caseId ${ev.caseId}`);
    issues++;
  }
});

// 5. Check Case Records
const allDocs = caseRecordsService.getAllDocuments();
allDocs.forEach(doc => {
  if (!caseIds.has(doc.caseId)) {
    console.error(`[ERROR] Document ${doc.id} references invalid caseId ${doc.caseId}`);
    issues++;
  }
});

console.log(`=== AUDIT COMPLETE: ${issues} ISSUES DETECTED ===`);
if (issues === 0) {
  console.log('ALL DATASET ENTITIES, CASES, RELATIONSHIPS, AND ALERTS ARE 100% VALID & INTEGRATED.');
}
