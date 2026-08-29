import { EntityType, CaseStatus, CasePriority } from '../types';
import { mockEntities } from '../data/mockEntities';
import { mockCases } from '../data/mockCases';

export type CaseDocumentType = 
  | 'FIR'
  | 'COMPLAINT'
  | 'WITNESS_STATEMENT'
  | 'INVESTIGATION_REPORT'
  | 'SEIZURE_MEMO'
  | 'EVIDENCE_REPORT'
  | 'FORENSIC_REPORT'
  | 'CASE_DIARY'
  | 'COURT_DOCUMENT'
  | 'CLOSURE_REPORT'
  | 'OTHER';

export interface ExtractedEntityReference {
  id: string;
  label: string;
  type: EntityType;
  roleInDocument: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  firNumber: string;
  title: string;
  documentType: CaseDocumentType;
  policeStation: string;
  investigatingOfficer: string;
  createdDate: string;
  uploadedDate: string;
  version: string;
  status: 'VERIFIED_IN_RECORD' | 'PENDING_FORENSIC_REVIEW' | 'SEALED_ARCHIVE';
  integrityHash: string;
  pageCount: number;
  content: string;
  extractedEntities: ExtractedEntityReference[];
  summary: string;
}

export interface CaseRecordItem {
  id: string;
  firNumber: string;
  title: string;
  caseType: string;
  policeStation: string;
  investigatingOfficer: string;
  badgeNumber: string;
  dateRegistered: string;
  lastUpdated: string;
  status: CaseStatus;
  priority: CasePriority;
  description: string;
  documentCount: number;
  entityCount: number;
  evidenceCount: number;
  locationsCount: number;
  vehiclesCount: number;
  alertsCount: number;
  tags: string[];
}

export interface RelatedCaseReference {
  caseId: string;
  caseTitle: string;
  firNumber: string;
  policeStation: string;
  sharedEntityId: string;
  sharedEntityLabel: string;
  sharedEntityType: EntityType;
  correlationReason: string;
}

const STORAGE_KEY_CUSTOM_DOCS = 'tracenet_case_custom_documents_v1';

// Rich Synthetic Cases Database (10+ Cases)
const SYNTHETIC_CASE_RECORDS: CaseRecordItem[] = [
  {
    id: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Operation Meridian',
    caseType: 'Cyber & Financial Smurfing',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    investigatingOfficer: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    dateRegistered: '10 Jun 2026',
    lastUpdated: '12 mins ago',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    description: 'Multi-jurisdictional intelligence probe analyzing coordinated financial structuring, Hawala layers, and logistics transshipment hubs linking Rahul Sharma, Vikram Singh, and Amit Patil.',
    documentCount: 6,
    entityCount: 48,
    evidenceCount: 14,
    locationsCount: 7,
    vehiclesCount: 4,
    alertsCount: 12,
    tags: ['Financial Smurfing', 'Multi-Cluster Bridge', 'Cross-Border Shells', 'Encrypted CDR']
  },
  {
    id: 'CASE-1031',
    firNumber: 'FIR-2026-MUM-0198',
    title: 'Project Shadowline',
    caseType: 'Burner Telecom Network & Infiltration',
    policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
    investigatingOfficer: 'Deputy Director Neha Sengupta',
    badgeNumber: 'MHA-INT-4411',
    dateRegistered: '02 Jul 2026',
    lastUpdated: '2 hours ago',
    status: 'ACTIVE',
    priority: 'HIGH',
    description: 'Investigation into coordinated short-burst communication rings using dynamic IMEI rotation across northern metropolitan corridors.',
    documentCount: 4,
    entityCount: 36,
    evidenceCount: 9,
    locationsCount: 4,
    vehiclesCount: 2,
    alertsCount: 7,
    tags: ['Burner SIM Network', 'Cell Tower Triangulation', 'Encrypted VOIP']
  },
  {
    id: 'CASE-1042',
    firNumber: 'FIR-2026-NCR-0881',
    title: 'Operation Northstar',
    caseType: 'Transit Fleet Route Anomaly',
    policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
    investigatingOfficer: 'ACP Vikramaditya Roy',
    badgeNumber: 'MHA-INT-7104',
    dateRegistered: '15 Jul 2026',
    lastUpdated: '1 day ago',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    description: 'Surveillance analysis focused on vehicle fleet movements between transit checkpoints and unlisted private logistics yards.',
    documentCount: 3,
    entityCount: 29,
    evidenceCount: 6,
    locationsCount: 5,
    vehiclesCount: 6,
    alertsCount: 5,
    tags: ['Automated ANPR Track', 'Fleet Route Anomalies', 'Staging Warehouses']
  },
  {
    id: 'CASE-1057',
    firNumber: 'FIR-2026-BLR-0342',
    title: 'Project Crosslink',
    caseType: 'Corporate Beneficial Ownership Fraud',
    policeStation: 'Economic Offenses & Fraud Analytics Unit, Bengaluru',
    investigatingOfficer: 'Superintendent Ananya Sharma',
    badgeNumber: 'MHA-INT-9930',
    dateRegistered: '01 Aug 2026',
    lastUpdated: '3 hours ago',
    status: 'ACTIVE',
    priority: 'HIGH',
    description: 'Corporate registry cross-matching and multi-layer beneficial ownership analysis across 12 newly incorporated shell entities.',
    documentCount: 5,
    entityCount: 52,
    evidenceCount: 18,
    locationsCount: 6,
    vehiclesCount: 3,
    alertsCount: 9,
    tags: ['Shell Company Network', 'Director Overlap', 'Offshore Inflow']
  },
  {
    id: 'CASE-1068',
    firNumber: 'FIR-2026-KOL-0219',
    title: 'Operation Bluefin',
    caseType: 'Maritime Cargo & Transit Smuggling',
    policeStation: 'Maritime Intelligence & Border Post, Eastern Docklands',
    investigatingOfficer: 'Inspector Debashish Paul',
    badgeNumber: 'MHA-INT-3021',
    dateRegistered: '08 Aug 2026',
    lastUpdated: '5 hours ago',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    description: 'Port manifest discrepancy analysis tracking unmanifested containerized cargo between Eastern port terminals.',
    documentCount: 4,
    entityCount: 24,
    evidenceCount: 8,
    locationsCount: 3,
    vehiclesCount: 5,
    alertsCount: 4,
    tags: ['Maritime Manifest', 'Container Logistics', 'Customs Relay']
  },
  {
    id: 'CASE-1075',
    firNumber: 'FIR-2026-HYD-0551',
    title: 'Sector 9 Hawala Intercept',
    caseType: 'Financial Structuring & Hawala Ledger',
    policeStation: 'Special Financial Intelligence Cell, Hyderabad',
    investigatingOfficer: 'Senior Inspector K. R. Rao',
    badgeNumber: 'MHA-INT-5542',
    dateRegistered: '12 Aug 2026',
    lastUpdated: 'Yesterday',
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    description: 'Intercepted encrypted ledger spreadsheets detailing sub-threshold cash distribution relays.',
    documentCount: 3,
    entityCount: 18,
    evidenceCount: 11,
    locationsCount: 2,
    vehiclesCount: 1,
    alertsCount: 6,
    tags: ['Hawala Books', 'Cash Couriers', 'IMPS Burst']
  },
  {
    id: 'CASE-1082',
    firNumber: 'FIR-2026-PUN-0104',
    title: 'Project Blackthorn',
    caseType: 'Hardware Signature & Encrypted Device Ring',
    policeStation: 'Special Cyber Task Force, Pune',
    investigatingOfficer: 'Inspector Priya Deshmukh',
    badgeNumber: 'MHA-INT-8819',
    dateRegistered: '18 Aug 2026',
    lastUpdated: '2 days ago',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    description: 'Forensic extraction of synchronized hardware IMEI rotations originating from unverified mobile retail distributors.',
    documentCount: 2,
    entityCount: 14,
    evidenceCount: 5,
    locationsCount: 3,
    vehiclesCount: 0,
    alertsCount: 2,
    tags: ['IMEI Spoofing', 'Distributor Relay', 'Cell Dumps']
  },
  {
    id: 'CASE-1099',
    firNumber: 'FIR-2026-DEL-0992',
    title: 'Operation Vayu',
    caseType: 'Air Cargo Waybill Discrepancy',
    policeStation: 'Aviation Security & Air Cargo Intelligence, IGI Airport',
    investigatingOfficer: 'ACP Tarun Malhotra',
    badgeNumber: 'MHA-INT-6640',
    dateRegistered: '20 Aug 2026',
    lastUpdated: '6 hours ago',
    status: 'ACTIVE',
    priority: 'HIGH',
    description: 'Analysis of automated air cargo waybills exhibiting altered consignee designations in transit.',
    documentCount: 3,
    entityCount: 21,
    evidenceCount: 7,
    locationsCount: 4,
    vehiclesCount: 3,
    alertsCount: 3,
    tags: ['Air Freight', 'Consignee Swap', 'SEZ Hubs']
  },
  {
    id: 'CASE-1104',
    firNumber: 'FIR-2026-AMD-0711',
    title: 'Transit Hub Intercept',
    caseType: 'Logistics Warehouse Surveillance',
    policeStation: 'Western Corridor Crime Branch, Ahmedabad',
    investigatingOfficer: 'Inspector Harshil Mehta',
    badgeNumber: 'MHA-INT-1190',
    dateRegistered: '22 Aug 2026',
    lastUpdated: '3 days ago',
    status: 'CLOSED',
    priority: 'ROUTINE',
    description: 'Automated ANPR surveillance archive verifying route travel times between warehouse terminals.',
    documentCount: 2,
    entityCount: 11,
    evidenceCount: 4,
    locationsCount: 2,
    vehiclesCount: 2,
    alertsCount: 0,
    tags: ['ANPR Audit', 'Transit Checkpoint', 'Routine Archive']
  },
  {
    id: 'CASE-1118',
    firNumber: 'FIR-2026-CHN-0409',
    title: 'Cyber Smurfing Probe',
    caseType: 'E-Payment Mule Ring',
    policeStation: 'Cyber Crime Investigation Division, Chennai',
    investigatingOfficer: 'Inspector V. Ramanathan',
    badgeNumber: 'MHA-INT-9012',
    dateRegistered: '25 Aug 2026',
    lastUpdated: 'Today',
    status: 'ACTIVE',
    priority: 'HIGH',
    description: 'Probe into coordinated payment gateway mule accounts receiving micro-transfers from overseas gaming portals.',
    documentCount: 4,
    entityCount: 32,
    evidenceCount: 12,
    locationsCount: 3,
    vehiclesCount: 1,
    alertsCount: 5,
    tags: ['UPI Mules', 'Payment Gateway', 'Micro-Structuring']
  }
];

// Rich Synthetic Case Documents
const SYNTHETIC_CASE_DOCUMENTS: CaseDocument[] = [
  {
    id: 'DOC-1024-01',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'First Information Report (FIR) - Operation Meridian',
    documentType: 'FIR',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    investigatingOfficer: 'Inspector Rajesh Verma',
    createdDate: '10 Jun 2026, 11:30 UTC',
    uploadedDate: '10 Jun 2026, 12:15 UTC',
    version: '1.0 (Official Record)',
    status: 'VERIFIED_IN_RECORD',
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78524821',
    pageCount: 4,
    extractedEntities: [
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInDocument: 'Named Key Subject & Logistics Coordinator' },
      { id: 'Person_001', label: 'Vikram Singh', type: 'PERSON', roleInDocument: 'Financial Signatory / Account Controller' },
      { id: 'Account_103', label: 'Account ending 4821', type: 'ACCOUNT', roleInDocument: 'Intermediary Hawala Relay Ledger' },
      { id: 'Location_A', label: 'Thane West Logistics Hub', type: 'LOCATION', roleInDocument: 'Staging & Consignment Meeting Yard' },
      { id: 'Organization_X', label: 'Meridian Logistics Pvt. Ltd.', type: 'ORGANIZATION', roleInDocument: 'Front Corporate Entity' }
    ],
    summary: 'Initial police FIR detailing unauthorized fund diversion and multi-cell logistics relay.',
    content: `STATE POLICE CRIMINAL INVESTIGATION DEPARTMENT
SPECIAL CYBER & FINANCIAL CRIMES DIVISION
FIRST INFORMATION REPORT (Under Section 154 Cr.P.C.)

1. FIR Number: FIR-2026-DEL-0412
2. District / Station: Central Cyber Division, New Delhi
3. Date & Time of Occurrence: Continuous between 01 May 2026 and 09 Jun 2026
4. Acts & Sections: Sec. 420, 120-B IPC read with Sec. 66D IT Act, 2000

DETAILS OF OCCURRENCE & NARRATIVE:
On based intelligence received from regulatory financial intelligence units, it is reported that subject Rahul Sharma coordinated multiple physical transshipments through Thane West Logistics Hub. Financial forensic monitoring shows simultaneous high-velocity disbursements from Account ending 4821 controlled by Vikram Singh, routing through entity Meridian Logistics Pvt. Ltd.

Telecommunication intercepts confirm frequent multi-burst voice calls connecting Rahul Sharma with Amit Patil prior to each nocturnal consignment dispatch.

[SYNTHETIC DEMO DOCUMENT — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  },
  {
    id: 'DOC-1024-02',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Surveillance & ANPR Seizure Memo - Thane West Logistics Hub',
    documentType: 'SEIZURE_MEMO',
    policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
    investigatingOfficer: 'ACP Vikramaditya Roy',
    createdDate: '18 Jun 2026, 09:15 UTC',
    uploadedDate: '18 Jun 2026, 10:00 UTC',
    version: '1.2 (Forensic Sealed)',
    status: 'VERIFIED_IN_RECORD',
    integrityHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc321942',
    pageCount: 3,
    extractedEntities: [
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInDocument: 'Observed at Checkpoint' },
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', roleInDocument: 'Seized Transport Asset' },
      { id: 'Location_A', label: 'Thane West Logistics Hub', type: 'LOCATION', roleInDocument: 'Surveillance Checkpoint' }
    ],
    summary: 'Automated ANPR capture and checkpoint seizure ledger documenting physical movement of Maruti Swift MH-04-XX-2847.',
    content: `MEMORANDUM OF SEIZURE AND ANPR INTERCEPT LOG
LOCATION: State Highway Toll Gate 4B / Thane West Logistics Yard
DATE OF ACTION: 18 June 2026

At 07:10 UTC, automated optical recognition cameras logged vehicle Maruti Swift (MH-04-XX-2847) entering the perimeter of Thane West Logistics Hub. Surveillance team verified driver identity corresponding to Rahul Sharma. Telecommunication tower triangulations confirm SIM line +91 XXXXX 28471 co-located with vehicle dashboard GPS unit.

Seizure of digital storage media and toll receipts conducted in the presence of authorized forensic witnesses.

[SYNTHETIC DEMO DOCUMENT — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  },
  {
    id: 'DOC-1024-03',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Forensic CDR & Intercept Investigation Report',
    documentType: 'INVESTIGATION_REPORT',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    investigatingOfficer: 'Inspector Rajesh Verma',
    createdDate: '24 Jul 2026, 16:45 UTC',
    uploadedDate: '24 Jul 2026, 17:30 UTC',
    version: '2.0 (Analytical Synthesis)',
    status: 'VERIFIED_IN_RECORD',
    integrityHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f9821',
    pageCount: 6,
    extractedEntities: [
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInDocument: 'Primary Bridge Node' },
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', roleInDocument: 'Eastern Terminal Coordinator' },
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', roleInDocument: 'Primary Device' }
    ],
    summary: 'Detailed CDR graph analytics proving Rahul Sharma functions as a sole structural bridge across 3 clusters.',
    content: `CYBER FORENSIC & NETWORK TOPOLOGY REPORT
CASE REFERENCE: CASE-1024 / OPERATION MERIDIAN

ANALYTICAL FINDINGS:
1. Betweenness Centrality Index for Rahul Sharma calculated at 0.612, representing the highest bridging coefficient across all indexed persons in the case.
2. Cross-community communications between Cluster 01 (Financial) and Cluster 03 (Transport) are exclusively mediated through phone device +91 XXXXX 28471 held by Rahul Sharma.
3. Call logs show 18 direct interactions with Amit Patil prior to scheduled Hawala disbursements.

[SYNTHETIC DEMO DOCUMENT — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  },
  {
    id: 'DOC-1031-01',
    caseId: 'CASE-1031',
    firNumber: 'FIR-2026-MUM-0198',
    title: 'FIR - Project Shadowline Telecom Investigation',
    documentType: 'FIR',
    policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
    investigatingOfficer: 'Deputy Director Neha Sengupta',
    createdDate: '02 Jul 2026, 10:00 UTC',
    uploadedDate: '02 Jul 2026, 10:30 UTC',
    version: '1.0',
    status: 'VERIFIED_IN_RECORD',
    integrityHash: 'b4a1c5d98fe21c149afbf4c8996fb92427ae41e4649b934ca495991b78521031',
    pageCount: 3,
    extractedEntities: [
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', roleInDocument: 'Target Device' },
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', roleInDocument: 'Intercepted Counterparty' },
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInDocument: 'Shared Associate' }
    ],
    summary: 'Registration of investigation into rapid burner SIM rotation in transit corridor.',
    content: `FIRST INFORMATION REPORT — PROJECT SHADOWLINE
POLICE STATION: Cyber Forensics Cell, Mumbai

Summary of Complaint:
Unidentified operational cell deploying rotating IMEI hardware across western transit hubs. Direct communication link identified targeting device +91 XXXXX 28471, linking into regional contact Amit Patil.

[SYNTHETIC DEMO DOCUMENT — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  },
  {
    id: 'DOC-1042-01',
    caseId: 'CASE-1042',
    firNumber: 'FIR-2026-NCR-0881',
    title: 'Fleet Surveillance Case Diary - Operation Northstar',
    documentType: 'CASE_DIARY',
    policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
    investigatingOfficer: 'ACP Vikramaditya Roy',
    createdDate: '15 Jul 2026, 14:00 UTC',
    uploadedDate: '15 Jul 2026, 14:45 UTC',
    version: '1.0',
    status: 'VERIFIED_IN_RECORD',
    integrityHash: 'c7d2e3f498fa1c149afbf4c8996fb92427ae41e4649b934ca495991b78521042',
    pageCount: 5,
    extractedEntities: [
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', roleInDocument: 'Target Fleet Asset' },
      { id: 'Location_B', label: 'Vashi Safehouse Facility', type: 'LOCATION', roleInDocument: 'Rendezvous Point' }
    ],
    summary: 'Chronological case diary logs detailing nighttime movements of Maruti Swift MH-04-XX-2847.',
    content: `CASE DIARY ENTRY — 15 JULY 2026
OFFICER: ACP Vikramaditya Roy

Surveillance unit confirms vehicle MH-04-XX-2847 made 14 round-trips between Thane West Hub and Vashi Safehouse Facility during non-operational hours between 01:00 and 04:30 AM.

[SYNTHETIC DEMO DOCUMENT — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
  }
];

export const caseRecordsService = {
  getCaseRecords(filter?: {
    search?: string;
    policeStation?: string;
    caseType?: string;
    status?: string;
    priority?: string;
  }): CaseRecordItem[] {
    let result = [...SYNTHETIC_CASE_RECORDS];

    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter(c => c.status === filter.status);
    }
    if (filter?.priority && filter.priority !== 'ALL') {
      result = result.filter(c => c.priority === filter.priority);
    }
    if (filter?.policeStation && filter.policeStation !== 'ALL') {
      result = result.filter(c => c.policeStation.toLowerCase().includes(filter.policeStation!.toLowerCase()));
    }
    if (filter?.caseType && filter.caseType !== 'ALL') {
      result = result.filter(c => c.caseType.toLowerCase().includes(filter.caseType!.toLowerCase()));
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(c => 
        c.id.toLowerCase().includes(q) ||
        c.firNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.caseType.toLowerCase().includes(q) ||
        c.policeStation.toLowerCase().includes(q) ||
        c.investigatingOfficer.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  },

  getCaseRecordById(caseId: string): CaseRecordItem | undefined {
    return SYNTHETIC_CASE_RECORDS.find(c => c.id.toLowerCase() === caseId.toLowerCase());
  },

  getDocumentsByCaseId(caseId: string): CaseDocument[] {
    let list = SYNTHETIC_CASE_DOCUMENTS.filter(d => d.caseId.toLowerCase() === caseId.toLowerCase());

    try {
      const customDocs = localStorage.getItem(STORAGE_KEY_CUSTOM_DOCS);
      if (customDocs) {
        const parsed: CaseDocument[] = JSON.parse(customDocs);
        const filtered = parsed.filter(d => d.caseId.toLowerCase() === caseId.toLowerCase());
        list = [...filtered, ...list];
      }
    } catch {}

    return list;
  },

  getDocumentById(docId: string): CaseDocument | undefined {
    const all = this.getAllDocuments();
    return all.find(d => d.id.toLowerCase() === docId.toLowerCase());
  },

  getAllDocuments(): CaseDocument[] {
    let list = [...SYNTHETIC_CASE_DOCUMENTS];
    try {
      const customDocs = localStorage.getItem(STORAGE_KEY_CUSTOM_DOCS);
      if (customDocs) {
        const parsed: CaseDocument[] = JSON.parse(customDocs);
        list = [...parsed, ...list];
      }
    } catch {}
    return list;
  },

  getRelatedCases(caseId: string): RelatedCaseReference[] {
    if (caseId.toUpperCase() === 'CASE-1024') {
      return [
        {
          caseId: 'CASE-1031',
          caseTitle: 'Project Shadowline',
          firNumber: 'FIR-2026-MUM-0198',
          policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
          sharedEntityId: 'Phone_021',
          sharedEntityLabel: '+91 XXXXX 28471',
          sharedEntityType: 'PHONE',
          correlationReason: 'Shared burner mobile line logged across both case intercepts.'
        },
        {
          caseId: 'CASE-1042',
          caseTitle: 'Operation Northstar',
          firNumber: 'FIR-2026-NCR-0881',
          policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
          sharedEntityId: 'Vehicle_017',
          sharedEntityLabel: 'MH-04-XX-2847',
          sharedEntityType: 'VEHICLE',
          correlationReason: 'Transport vehicle logged transiting between case warehouses.'
        },
        {
          caseId: 'CASE-1057',
          caseTitle: 'Project Crosslink',
          firNumber: 'FIR-2026-BLR-0342',
          policeStation: 'Economic Offenses & Fraud Analytics Unit, Bengaluru',
          sharedEntityId: 'Organization_X',
          sharedEntityLabel: 'Meridian Logistics Pvt. Ltd.',
          sharedEntityType: 'ORGANIZATION',
          correlationReason: 'Common corporate entity holding bank accounts in both probes.'
        }
      ];
    }

    if (caseId.toUpperCase() === 'CASE-1031') {
      return [
        {
          caseId: 'CASE-1024',
          caseTitle: 'Operation Meridian',
          firNumber: 'FIR-2026-DEL-0412',
          policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
          sharedEntityId: 'Person_044',
          sharedEntityLabel: 'Rahul Sharma',
          sharedEntityType: 'PERSON',
          correlationReason: 'Direct telecommunication link with burner SIM device.'
        }
      ];
    }

    return [];
  },

  addDocument(doc: Omit<CaseDocument, 'id' | 'createdDate' | 'uploadedDate' | 'version' | 'status' | 'integrityHash'>): CaseDocument {
    const docId = `DOC-${doc.caseId.replace('CASE-', '')}-${Date.now().toString().slice(-3)}`;
    const newDoc: CaseDocument = {
      ...doc,
      id: docId,
      createdDate: new Date().toISOString(),
      uploadedDate: 'Just now',
      version: '1.0 (Investigator Ingested)',
      status: 'VERIFIED_IN_RECORD',
      integrityHash: `c7e4a1b9${Date.now()}996fb92427ae41e4649b934ca495991b7852${doc.caseId.replace(/\D/g, '')}`
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_DOCS);
      const list: CaseDocument[] = stored ? JSON.parse(stored) : [];
      list.unshift(newDoc);
      localStorage.setItem(STORAGE_KEY_CUSTOM_DOCS, JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to persist custom document:', err);
    }

    return newDoc;
  }
};
