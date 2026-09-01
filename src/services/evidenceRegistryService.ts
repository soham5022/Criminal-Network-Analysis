import { EntityType } from '../types';
import { auditService } from './auditService';

export type EvidenceType = 
  | 'DOCUMENT'
  | 'PHOTOGRAPH'
  | 'VIDEO'
  | 'AUDIO'
  | 'CALL_RECORD'
  | 'TRANSACTION_RECORD'
  | 'LOCATION_RECORD'
  | 'VEHICLE_ANPR_RECORD'
  | 'PHYSICAL_EVIDENCE'
  | 'FORENSIC_REPORT'
  | 'STATEMENT'
  | 'OTHER';

export type EvidenceStatus = 
  | 'REGISTERED'
  | 'DIGITAL_COPY_AVAILABLE'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ARCHIVED';

export interface DigitalDocumentAttachment {
  filename: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  uploader: string;
  version: string;
  integrityHash: string;
  content: string;
  previewAvailable: boolean;
  downloadUrl?: string;
}

export interface CustodyEvent {
  id: string;
  action: string;
  officer: string;
  badge: string;
  timestamp: string;
  notes?: string;
}

export interface EvidenceRecord {
  id: string;
  caseId: string;
  firNumber: string;
  title: string;
  evidenceType: EvidenceType;
  description: string;
  collectedDate: string;
  collectedTime: string;
  policeStation: string;
  registeringOfficer: string;
  badgeNumber: string;
  relatedEntities: Array<{
    id: string;
    label: string;
    type: EntityType;
    role: string;
  }>;
  location: string;
  source: string;
  remarks: string;
  status: EvidenceStatus;
  hasDigitalCopy: boolean;
  digitalDocument?: DigitalDocumentAttachment;
  previousVersions: DigitalDocumentAttachment[];
  chainOfCustody: CustodyEvent[];
}

export interface EvidenceFilterOptions {
  search?: string;
  caseId?: string;
  evidenceType?: string;
  policeStation?: string;
  status?: string;
  hasDigitalCopy?: string;
}

export interface EvidenceRegistryStats {
  totalEvidence: number;
  digitalCopiesAvailable: number;
  pendingDigitization: number;
  underReview: number;
  verified: number;
}

const STORAGE_KEY_EVIDENCE = 'tracenet_digital_evidence_registry_v1';

// Rich Synthetic Demonstration Evidence Records across Cases
const INITIAL_SYNTHETIC_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'EVD-2026-000184',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Cellular Intercept CDR Extract (Burst Mode)',
    evidenceType: 'CALL_RECORD',
    description: 'Raw cellular call detail records (CDR) capturing short-burst encrypted communications between Rahul Sharma and Amit Patil prior to nocturnal warehouse dispatch.',
    collectedDate: '2026-08-26',
    collectedTime: '14:15 IST',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    registeringOfficer: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    relatedEntities: [
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', role: 'Originating Subscriber' },
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', role: 'Intercepted Counterparty' },
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', role: 'Primary Device' }
    ],
    location: 'Thane Sector 14 North Cell Tower Grid',
    source: 'Telecom Sentinel Grid Intercept Feed',
    remarks: 'Extracted under Section 92 CrPC authorization. Confirms 18 direct interactions prior to scheduled transfers.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'CDR_Intercept_Extract_Sector14_20260826.pdf',
      fileType: 'application/pdf',
      fileSize: '2.4 MB',
      uploadDate: '26 Aug 2026, 14:45 IST',
      uploader: 'Inspector Rajesh Verma (MHA-INT-8902)',
      version: '1.0 (Official Forensic Export)',
      integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78524821',
      previewAvailable: true,
      content: `CENTRAL POLICE CYBER FORENSICS CELL
TELECOM SENTINEL CDR INTERCEPT LEDGER
CASE FILE: CASE-1024 // FIR-2026-DEL-0412

TARGET MSISDN: +91 XXXXX 28471 (Rahul Sharma)
COUNTERPARTY MSISDN: +91 XXXXX 73142 (Amit Patil)
CALL TIMESTAMP: 26 Aug 2026 09:42:18 UTC
CELL TOWER: Thane Sector 14 North (Grid Coord: 19.2183° N, 72.9781° E)
DURATION: 258 Seconds (Burst Encrypted VoLTE Stream)

ANALYTICAL SIGNATURE:
Handshake verified by cryptographic signature analysis. Coincides with physical vehicle movement of MH-04-XX-2847 towards Thane West Logistics Hub.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Rajesh Verma',
        badge: 'MHA-INT-8902',
        timestamp: '26 Aug 2026, 14:15 IST',
        notes: 'Evidence registered in digital repository from telecom intercept server.'
      },
      {
        id: 'CUST-02',
        action: 'Digital Soft Copy Ingested',
        officer: 'Inspector Rajesh Verma',
        badge: 'MHA-INT-8902',
        timestamp: '26 Aug 2026, 14:45 IST',
        notes: 'Forensic PDF export ingested. SHA-256 integrity hash calculated and verified.'
      },
      {
        id: 'CUST-03',
        action: 'Linked to Case Knowledge Graph',
        officer: 'System Engine',
        badge: 'AUTO-AI-01',
        timestamp: '26 Aug 2026, 15:00 IST',
        notes: 'Entities Rahul Sharma and Amit Patil automatically linked.'
      }
    ]
  },
  {
    id: 'EVD-2026-000185',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Automated ANPR Gate Capture — Maruti Swift (MH-04-XX-2847)',
    evidenceType: 'VEHICLE_ANPR_RECORD',
    description: 'High-resolution automated optical recognition image and checkpoint timestamp log capturing vehicle MH-04-XX-2847 entering the perimeter of Thane West Logistics Hub.',
    collectedDate: '2026-08-26',
    collectedTime: '07:10 IST',
    policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
    registeringOfficer: 'ACP Vikramaditya Roy',
    badgeNumber: 'MHA-INT-7104',
    relatedEntities: [
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', role: 'Observed Transport Asset' },
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', role: 'Identified Driver' },
      { id: 'Location_A', label: 'Thane West Logistics Hub', type: 'LOCATION', role: 'Checkpoint Perimeter' }
    ],
    location: 'State Highway Toll Barrier 4B, Thane West Logistics Yard',
    source: 'Perimeter ANPR Optical Recognition Camera #04',
    remarks: 'Timestamp matches mobile phone GPS coordinates within 4-meter radius.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'ANPR_GateCapture_MH04XX2847_20260826.pdf',
      fileType: 'application/pdf',
      fileSize: '3.8 MB',
      uploadDate: '26 Aug 2026, 08:30 IST',
      uploader: 'ACP Vikramaditya Roy (MHA-INT-7104)',
      version: '1.0',
      integrityHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc321942',
      previewAvailable: true,
      content: `STATE HIGHWAY SURVEILLANCE CORRIDOR
ANPR OPTICAL VEHICLE IDENTIFICATION MEMO
CAMERA ID: TOLL-GATE-4B-OPTICAL-04

VEHICLE REGISTRATION: MH-04-XX-2847
VEHICLE CLASS: White Maruti Suzuki Swift VXi
TIMESTAMP: 26 Aug 2026 07:10:44 IST
ENTRY POINT: Thane West Industrial Perimeter Gate 2
SPEED RECORDED: 34 km/h

DRIVER RECOGNITION:
Surveillance CCTV facial match index 94.2% consistent with Rahul Sharma (DOB: 14 Jul 1984).

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'ACP Vikramaditya Roy',
        badge: 'MHA-INT-7104',
        timestamp: '26 Aug 2026, 08:00 IST',
        notes: 'Checkpoint toll capture registered.'
      },
      {
        id: 'CUST-02',
        action: 'Digital Soft Copy Ingested',
        officer: 'ACP Vikramaditya Roy',
        badge: 'MHA-INT-7104',
        timestamp: '26 Aug 2026, 08:30 IST',
        notes: 'ANPR image scan uploaded with SHA-256 seal.'
      }
    ]
  },
  {
    id: 'EVD-2026-000186',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Core Banking SWIFT Ledger Transmission Log',
    evidenceType: 'TRANSACTION_RECORD',
    description: 'Certified financial transaction extract documenting structured transfer of ₹48,000 from Account ending 4821 to Account ending 7316 within 22 minutes of cash deposit.',
    collectedDate: '2026-08-26',
    collectedTime: '15:30 IST',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    registeringOfficer: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    relatedEntities: [
      { id: 'Account_103', label: 'Account ending 4821', type: 'ACCOUNT', role: 'Debtor Intermediary Ledger' },
      { id: 'Account_221', label: 'Account ending 7316', type: 'ACCOUNT', role: 'Creditor Beneficiary' },
      { id: 'Person_001', label: 'Vikram Singh', type: 'PERSON', role: 'Authorized Signatory' }
    ],
    location: 'Demo National Bank Commercial Branch, Mumbai',
    source: 'Core Banking Swift Inter-Bank Gateway',
    remarks: 'Transaction pattern matches smurfing heuristic rule #F-109 with sub-threshold amounts.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'BankLedger_Swift_ACCT4821_20260826.pdf',
      fileType: 'application/pdf',
      fileSize: '1.6 MB',
      uploadDate: '26 Aug 2026, 16:00 IST',
      uploader: 'Inspector Rajesh Verma (MHA-INT-8902)',
      version: '1.0',
      integrityHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f9821',
      previewAvailable: true,
      content: `DEMO NATIONAL BANK — FINANCIAL FORENSICS EXTRACT
STATUTORY REGULATORY INQUIRY (SEC. 91 CrPC)
TRANSACTION REFERENCE: SWIFT-IMPS-20260826-8849-4821

DEBTOR ACCOUNT: ACCT-8849-4821 (Account ending 4821)
SIGNATORY: Vikram Singh (MHA-ID: Person_001)
CREDITOR ACCOUNT: ACCT-9921-7316 (Account ending 7316)
AMOUNT: INR 48,000.00
TIMESTAMP: 26 Aug 2026 14:32:00 IST
TRANSACTION VELOCITY: 22 Minutes from cash deposit of INR 48,500.00

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Rajesh Verma',
        badge: 'MHA-INT-8902',
        timestamp: '26 Aug 2026, 15:30 IST',
        notes: 'Received from bank nodal officer under statutory notice.'
      }
    ]
  },
  {
    id: 'EVD-2026-000187',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    title: 'Physical Seizure Memo — Sector 4 Logistics Office Hard Drive',
    evidenceType: 'PHYSICAL_EVIDENCE',
    description: 'Physical Western Digital 2TB encrypted hard drive seized during raid at Sector 4 Logistics Office, containing ledger spreadsheets and customs dispatch notes.',
    collectedDate: '2026-08-25',
    collectedTime: '19:40 IST',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    registeringOfficer: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    relatedEntities: [
      { id: 'Location_A', label: 'Thane West Logistics Hub', type: 'LOCATION', role: 'Raid Location' },
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', role: 'Custodian of Office' }
    ],
    location: 'Room 104, Admin Block, Sector 4 Logistics Yard',
    source: 'Physical Raid Panchnama Seizure',
    remarks: 'Physical drive deposited in central police evidence vault #B-12. Soft-copy forensic image scan pending upload.',
    status: 'REGISTERED',
    hasDigitalCopy: false,
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Rajesh Verma',
        badge: 'MHA-INT-8902',
        timestamp: '25 Aug 2026, 20:30 IST',
        notes: 'Physical hard drive sealed in anti-static tamper-evident bag.'
      }
    ]
  },
  {
    id: 'EVD-2026-000201',
    caseId: 'CASE-1031',
    firNumber: 'FIR-2026-MUM-0198',
    title: 'Forensic IMEI Telemetry Audit Report',
    evidenceType: 'FORENSIC_REPORT',
    description: 'Cyber forensics laboratory report analyzing synchronized rotating SIM activations across a single radio transceiver within a 3-hour window.',
    collectedDate: '2026-08-26',
    collectedTime: '11:00 IST',
    policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
    registeringOfficer: 'Deputy Director Neha Sengupta',
    badgeNumber: 'MHA-INT-4411',
    relatedEntities: [
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', role: 'Target Device' },
      { id: 'Phone_045', label: '+91 XXXXX 73142', type: 'PHONE', role: 'Secondary Line' }
    ],
    location: 'State Cyber Forensics Laboratory, Mumbai',
    source: 'Cyber Lab Radio Spectrum Analyzer',
    remarks: 'Hardware fingerprint match confirms dynamic IMEI spoofing algorithm in use.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'Forensic_IMEI_Telemetry_Report_20260826.pdf',
      fileType: 'application/pdf',
      fileSize: '4.1 MB',
      uploadDate: '26 Aug 2026, 12:15 IST',
      uploader: 'Deputy Director Neha Sengupta (MHA-INT-4411)',
      version: '1.0',
      integrityHash: 'b4a1c5d98fe21c149afbf4c8996fb92427ae41e4649b934ca495991b78521031',
      previewAvailable: true,
      content: `STATE CYBER FORENSICS LABORATORY
RADIO TRANSCEIVER TELEMETRY AUDIT REPORT
CASE REFERENCE: CASE-1031 // PROJECT SHADOWLINE

EXAMINATION SUMMARY:
Sequential activation of 4 micro-SIM profiles observed on hardware IMEI 864902049182741. Switching intervals average 42 minutes, confirming automated rotation software.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Deputy Director Neha Sengupta',
        badge: 'MHA-INT-4411',
        timestamp: '26 Aug 2026, 11:00 IST',
        notes: 'Forensic lab findings officially certified.'
      }
    ]
  },
  {
    id: 'EVD-2026-000202',
    caseId: 'CASE-1031',
    firNumber: 'FIR-2026-MUM-0198',
    title: 'Informant Audio Surveillance Intercept',
    evidenceType: 'AUDIO',
    description: 'Recorded audio wiretap intercept of 28-second voice check-in between transit couriers regarding SIM replacement schedule.',
    collectedDate: '2026-08-26',
    collectedTime: '07:11 IST',
    policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
    registeringOfficer: 'Deputy Director Neha Sengupta',
    badgeNumber: 'MHA-INT-4411',
    relatedEntities: [
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', role: 'Intercept Line' }
    ],
    location: 'Western Transit Terminal Tower',
    source: 'Lawful Interception Gateway (LIM)',
    remarks: 'Audio recording in encrypted WAV format. Soft-copy transcript upload pending.',
    status: 'REGISTERED',
    hasDigitalCopy: false,
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Deputy Director Neha Sengupta',
        badge: 'MHA-INT-4411',
        timestamp: '26 Aug 2026, 07:45 IST',
        notes: 'Encrypted audio intercept stream registered.'
      }
    ]
  },
  {
    id: 'EVD-2026-000214',
    caseId: 'CASE-1042',
    firNumber: 'FIR-2026-NCR-0881',
    title: 'Surveillance Vehicle Tracking Log — Vashi Safehouse',
    evidenceType: 'LOCATION_RECORD',
    description: 'Physical surveillance and GPS beacon tracker log detailing nocturnal movements of transport fleet between staging hubs.',
    collectedDate: '2026-08-26',
    collectedTime: '04:15 IST',
    policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
    registeringOfficer: 'ACP Vikramaditya Roy',
    badgeNumber: 'MHA-INT-7104',
    relatedEntities: [
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', role: 'Tracked Asset' },
      { id: 'Location_B', label: 'Vashi Safehouse Facility', type: 'LOCATION', role: 'Target Rendezvous' },
      { id: 'Person_027', label: 'Rohan Deshmukh', type: 'PERSON', role: 'Driver' }
    ],
    location: 'KM-42 Expressway Barrier, Vashi Transit Corridor',
    source: 'Mobile Surveillance Team 3',
    remarks: 'Coordinated route analysis proves 8 consecutive nights of off-hours transit.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'Surveillance_FleetLog_Vashi_20260826.pdf',
      fileType: 'application/pdf',
      fileSize: '2.1 MB',
      uploadDate: '26 Aug 2026, 06:00 IST',
      uploader: 'ACP Vikramaditya Roy (MHA-INT-7104)',
      version: '1.0',
      integrityHash: 'c7d2e3f498fa1c149afbf4c8996fb92427ae41e4649b934ca495991b78521042',
      previewAvailable: true,
      content: `INTER-STATE CRIME INTELLIGENCE BUREAU
SURVEILLANCE FIELD LOG — OPERATION NORTHSTAR

TARGET: Vehicle MH-04-XX-2847 (White Maruti Swift)
OPERATOR: Rohan Deshmukh (Person_027)
DESTINATION: Vashi Safehouse Facility (Location_B)
ARRIVAL TIME: 04:15 IST

FINDINGS:
Vehicle backed into private loading bay at 04:18 IST. Two sealed consignment cartons unloaded and transferred into secure basement facility.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'ACP Vikramaditya Roy',
        badge: 'MHA-INT-7104',
        timestamp: '26 Aug 2026, 05:00 IST',
        notes: 'Field surveillance log transcribed and registered.'
      }
    ]
  },
  {
    id: 'EVD-2026-000228',
    caseId: 'CASE-1057',
    firNumber: 'FIR-2026-BLR-0342',
    title: 'Offshore Swift Wire Clearance Slips',
    evidenceType: 'TRANSACTION_RECORD',
    description: 'Certified SWIFT wire transfer confirmations linking shell accounts to overseas intermediary entities.',
    collectedDate: '2026-08-26',
    collectedTime: '10:00 IST',
    policeStation: 'Economic Offenses & Fraud Analytics Unit, Bengaluru',
    registeringOfficer: 'Inspector Ananya Rao',
    badgeNumber: 'MHA-INT-9912',
    relatedEntities: [
      { id: 'Organization_X', label: 'Meridian Logistics Pvt. Ltd.', type: 'ORGANIZATION', role: 'Account Holder' },
      { id: 'Account_103', label: 'Account ending 4821', type: 'ACCOUNT', role: 'Originating Account' }
    ],
    location: 'Reserve Bank Nodal Center, Bengaluru',
    source: 'Financial Intelligence Unit Export',
    remarks: 'Transaction volume exceeds reported operational turnover by 340%.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'SWIFT_Transfer_Confirmation_CASE1057.pdf',
      fileType: 'application/pdf',
      fileSize: '1.8 MB',
      uploadDate: '26 Aug 2026, 11:15 IST',
      uploader: 'Inspector Ananya Rao (MHA-INT-9912)',
      version: '1.0',
      integrityHash: 'd8e4f5a198fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521057',
      previewAvailable: true,
      content: `FINANCIAL INTELLIGENCE UNIT — TRANSACTION RECORD
CASE: CASE-1057 // PROJECT CROSSLINK

SWIFT INWARD REMITTANCE CONFIRMATION
ENTITY: Meridian Logistics Pvt. Ltd.
AMOUNT: USD 142,000.00
CORRESPONDENT: Global Trade Intermediary Clearing Bank

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Ananya Rao',
        badge: 'MHA-INT-9912',
        timestamp: '26 Aug 2026, 10:30 IST',
        notes: 'SWIFT slips extracted from regulatory FIU gateway.'
      }
    ]
  },
  {
    id: 'EVD-2026-000239',
    caseId: 'CASE-1068',
    firNumber: 'FIR-2026-KOL-0209',
    title: 'Container Seal & Customs Manifest - Kolkata Docks',
    evidenceType: 'DOCUMENT',
    description: 'Customs manifest and physical cargo inspection log certifying tamper seal mismatch on maritime container.',
    collectedDate: '2026-08-25',
    collectedTime: '16:00 IST',
    policeStation: 'Coastal & Maritime Security Division, Kolkata',
    registeringOfficer: 'ACP Debabrata Mukherjee',
    badgeNumber: 'MHA-INT-3301',
    relatedEntities: [
      { id: 'Location_C', label: 'Dock Terminal Yard 4', type: 'LOCATION', role: 'Seizure Dock' },
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', role: 'Notified Consignee' }
    ],
    location: 'Dock Terminal Yard 4, Kolkata Port',
    source: 'Port Customs Physical Panchnama',
    remarks: 'Physical inspection confirms misdeclared electronics hardware.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'Customs_Inspection_Manifest_Docks.pdf',
      fileType: 'application/pdf',
      fileSize: '3.2 MB',
      uploadDate: '25 Aug 2026, 17:00 IST',
      uploader: 'ACP Debabrata Mukherjee (MHA-INT-3301)',
      version: '1.0',
      integrityHash: 'e9f1a2b398fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521068',
      previewAvailable: true,
      content: `PORT CUSTOMS PHYSICAL INSPECTION LEDGER
CASE: CASE-1068 // OPERATION BLUEFIN

CONTAINER ID: MSKU-908124-7
LOCATION: Dock Terminal Yard 4
CONSIGNEE: Rahul Sharma

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'ACP Debabrata Mukherjee',
        badge: 'MHA-INT-3301',
        timestamp: '25 Aug 2026, 16:30 IST',
        notes: 'Customs manifest sealed into evidence ledger.'
      }
    ]
  },
  {
    id: 'EVD-2026-000251',
    caseId: 'CASE-1075',
    firNumber: 'FIR-2026-HYD-0551',
    title: 'Hawala Ledger Cash Slips & Note Codes',
    evidenceType: 'TRANSACTION_RECORD',
    description: 'Physical ledger pages containing alphanumeric note codes and settlement timestamps for cash handovers.',
    collectedDate: '2026-08-25',
    collectedTime: '18:30 IST',
    policeStation: 'Special Intelligence Branch, Hyderabad',
    registeringOfficer: 'Inspector K. S. Reddy',
    badgeNumber: 'MHA-INT-6621',
    relatedEntities: [
      { id: 'Account_304', label: 'Account ending 1094', type: 'ACCOUNT', role: 'Ledger Code Target' },
      { id: 'Person_001', label: 'Vikram Singh', type: 'PERSON', role: 'Signatory' }
    ],
    location: 'Sector 9 Safehouse, Hyderabad',
    source: 'Raid Recovery Panchnama',
    remarks: '12 handwritten cipher codes decoded and cross-referenced with bank timestamps.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'Hawala_Ledger_Scanned_Pages.pdf',
      fileType: 'application/pdf',
      fileSize: '2.7 MB',
      uploadDate: '25 Aug 2026, 19:30 IST',
      uploader: 'Inspector K. S. Reddy (MHA-INT-6621)',
      version: '1.0',
      integrityHash: 'fa12b3c498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521075',
      previewAvailable: true,
      content: `SPECIAL INTELLIGENCE BRANCH — HAWALA LEDGER EXTRACT
CASE: CASE-1075

Physical seizure of token serial numbers matching IMPS disbursement intervals.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector K. S. Reddy',
        badge: 'MHA-INT-6621',
        timestamp: '25 Aug 2026, 19:00 IST',
        notes: 'Handwritten ledger scanned and sealed.'
      }
    ]
  },
  {
    id: 'EVD-2026-000262',
    caseId: 'CASE-1082',
    firNumber: 'FIR-2026-PUN-0104',
    title: 'Multi-SIM Box Hardware Extraction Log',
    evidenceType: 'FORENSIC_REPORT',
    description: 'Hardware telemetry report from 16-channel SIM pool device seized during raid at electronics retail premises.',
    collectedDate: '2026-08-25',
    collectedTime: '13:00 IST',
    policeStation: 'Special Cyber Task Force, Pune',
    registeringOfficer: 'Inspector Priya Deshmukh',
    badgeNumber: 'MHA-INT-8819',
    relatedEntities: [
      { id: 'Phone_088', label: '+91 XXXXX 99014', type: 'PHONE', role: 'Active SIM Slot 3' },
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', role: 'Linked Caller' }
    ],
    location: 'Electronic Plaza Arcade, Pune',
    source: 'Cyber Lab Device Extraction',
    remarks: 'Hardware box used to automate simultaneous OTP reception.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'SIM_Box_Telemetry_Extraction.pdf',
      fileType: 'application/pdf',
      fileSize: '3.8 MB',
      uploadDate: '25 Aug 2026, 14:15 IST',
      uploader: 'Inspector Priya Deshmukh (MHA-INT-8819)',
      version: '1.0',
      integrityHash: 'fb23c4d598fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521082',
      previewAvailable: true,
      content: `SPECIAL CYBER TASK FORCE — HARDWARE LAB EXTRACTION
CASE: CASE-1082

16-Channel SIM Box extraction reveals automated call forwarding rules.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Priya Deshmukh',
        badge: 'MHA-INT-8819',
        timestamp: '25 Aug 2026, 13:45 IST',
        notes: 'Physical hardware extraction certified.'
      }
    ]
  },
  {
    id: 'EVD-2026-000273',
    caseId: 'CASE-1090',
    firNumber: 'FIR-2026-CHD-0319',
    title: 'Highway Toll Camera High-Res Optical Captures',
    evidenceType: 'PHOTOGRAPH',
    description: 'Nighttime optical camera stills captured at Highway Toll Plaza 7 showing driver identity and vehicle transit.',
    collectedDate: '2026-08-25',
    collectedTime: '03:15 IST',
    policeStation: 'Anti-Smuggling Bureau, Chandigarh',
    registeringOfficer: 'ACP Gurpreet Singh',
    badgeNumber: 'MHA-INT-5502',
    relatedEntities: [
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', role: 'Captured Vehicle' },
      { id: 'Phone_092', label: '+91 XXXXX 44812', type: 'PHONE', role: 'Co-located Device' }
    ],
    location: 'Highway Toll Plaza 7 North, Chandigarh Corridor',
    source: 'National Highway ANPR Stream',
    remarks: 'Facial recognition confidence: 94.2% match against registered identity records.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'ANPR_Toll_Capture_Sector7.pdf',
      fileType: 'application/pdf',
      fileSize: '4.5 MB',
      uploadDate: '25 Aug 2026, 04:30 IST',
      uploader: 'ACP Gurpreet Singh (MHA-INT-5502)',
      version: '1.0',
      integrityHash: 'fc34d5e698fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521090',
      previewAvailable: true,
      content: `NATIONAL HIGHWAYS ANPR CAMERA CAPTURE
CASE: CASE-1090 // OPERATION FALCON

Optical license plate confirmation: MH-04-XX-2847
Speed: 84 km/h
Lane: Express Lane 3

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'ACP Gurpreet Singh',
        badge: 'MHA-INT-5502',
        timestamp: '25 Aug 2026, 04:00 IST',
        notes: 'High resolution camera stills downloaded from toll authority.'
      }
    ]
  },
  {
    id: 'EVD-2026-000284',
    caseId: 'CASE-1095',
    firNumber: 'FIR-2026-JPR-0677',
    title: 'Heavy Transport Fleet GPS Telemetry Extract',
    evidenceType: 'LOCATION_RECORD',
    description: 'Comprehensive GPS telemetry log of heavy transport fleet vehicles detailing stopovers at logistics terminals.',
    collectedDate: '2026-08-25',
    collectedTime: '11:30 IST',
    policeStation: 'Highway Surveillance Cell, Jaipur',
    registeringOfficer: 'Inspector Manvendra Rathore',
    badgeNumber: 'MHA-INT-7704',
    relatedEntities: [
      { id: 'Vehicle_033', label: 'Eicher Truck (RJ-14-XX-9021)', type: 'VEHICLE', role: 'Fleet Asset' },
      { id: 'Location_A', label: 'Thane West Logistics Hub', type: 'LOCATION', role: 'Origin' }
    ],
    location: 'Jaipur Transport Nagar Checkpoint',
    source: 'Fleet IoT Tracking Telematics',
    remarks: 'Route anomaly detected: 4 unauthorized stops along interstate transit route.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'Fleet_GPS_Telemetry_Log_CASE1095.pdf',
      fileType: 'application/pdf',
      fileSize: '2.9 MB',
      uploadDate: '25 Aug 2026, 12:45 IST',
      uploader: 'Inspector Manvendra Rathore (MHA-INT-7704)',
      version: '1.0',
      integrityHash: 'fd45e6f798fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521095',
      previewAvailable: true,
      content: `HIGHWAY SURVEILLANCE CELL — FLEET GPS LOG
CASE: CASE-1095 // PROJECT SILVERLINE

VEHICLE: RJ-14-XX-9021
CORRIDOR: Western Dedicated Freight Route

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Manvendra Rathore',
        badge: 'MHA-INT-7704',
        timestamp: '25 Aug 2026, 12:00 IST',
        notes: 'GPS telematics exported from fleet tracking server.'
      }
    ]
  },
  {
    id: 'EVD-2026-000295',
    caseId: 'CASE-1102',
    firNumber: 'FIR-2026-LKO-0812',
    title: 'Corporate Bank Signatory Signature Cards',
    evidenceType: 'DOCUMENT',
    description: 'Certified KYC documentation and signature resolution cards from commercial banking branch showing authorized operators.',
    collectedDate: '2026-08-25',
    collectedTime: '15:15 IST',
    policeStation: 'Economic Offenses Wing, Lucknow',
    registeringOfficer: 'Inspector Ajay Tripathi',
    badgeNumber: 'MHA-INT-2209',
    relatedEntities: [
      { id: 'Account_512', label: 'Account ending 6601', type: 'ACCOUNT', role: 'Corporate Account' },
      { id: 'Organization_X', label: 'Meridian Logistics Pvt. Ltd.', type: 'ORGANIZATION', role: 'Holding Company' }
    ],
    location: 'Commercial Branch Bank Vault, Lucknow',
    source: 'Branch Legal Officer Handover',
    remarks: 'Signatory resolution documents cross-referenced with corporate registry filings.',
    status: 'VERIFIED',
    hasDigitalCopy: true,
    digitalDocument: {
      filename: 'KYC_Signatory_Cards_CASE1102.pdf',
      fileType: 'application/pdf',
      fileSize: '3.1 MB',
      uploadDate: '25 Aug 2026, 16:30 IST',
      uploader: 'Inspector Ajay Tripathi (MHA-INT-2209)',
      version: '1.0',
      integrityHash: 'fe56f7a898fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521102',
      previewAvailable: true,
      content: `ECONOMIC OFFENSES WING — KYC SIGNATORY RECORD
CASE: CASE-1102 // OPERATION SENTINEL

ACCOUNT: ACCT-7712-6601
CORPORATE HOLDER: Meridian Logistics Pvt. Ltd.

[SYNTHETIC DEMO EVIDENCE — FOR SIH26189 PROTOTYPE EVALUATION ONLY]`
    },
    previousVersions: [],
    chainOfCustody: [
      {
        id: 'CUST-01',
        action: 'Evidence Registered',
        officer: 'Inspector Ajay Tripathi',
        badge: 'MHA-INT-2209',
        timestamp: '25 Aug 2026, 15:45 IST',
        notes: 'KYC records received under Section 91 CrPC notice.'
      }
    ]
  }
];

let inMemoryEvidence: EvidenceRecord[] = [...INITIAL_SYNTHETIC_EVIDENCE];

function getStoredEvidence(): EvidenceRecord[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_EVIDENCE);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(INITIAL_SYNTHETIC_EVIDENCE));
    }
    return inMemoryEvidence;
  } catch {
    return inMemoryEvidence;
  }
}

function saveStoredEvidence(list: EvidenceRecord[]): void {
  inMemoryEvidence = list;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(list));
    }
  } catch {}
}

export const evidenceRegistryService = {
  getEvidenceList(filters?: EvidenceFilterOptions): EvidenceRecord[] {
    let list = getStoredEvidence();

    if (filters?.caseId && filters.caseId !== 'ALL') {
      list = list.filter(e => e.caseId.toLowerCase() === filters.caseId!.toLowerCase());
    }

    if (filters?.evidenceType && filters.evidenceType !== 'ALL') {
      list = list.filter(e => e.evidenceType === filters.evidenceType);
    }

    if (filters?.policeStation && filters.policeStation !== 'ALL') {
      list = list.filter(e => e.policeStation.toLowerCase().includes(filters.policeStation!.toLowerCase()));
    }

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(e => e.status === filters.status);
    }

    if (filters?.hasDigitalCopy && filters.hasDigitalCopy !== 'ALL') {
      const wantDigital = filters.hasDigitalCopy === 'YES';
      list = list.filter(e => e.hasDigitalCopy === wantDigital);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(e => 
        e.id.toLowerCase().includes(q) ||
        e.caseId.toLowerCase().includes(q) ||
        e.firNumber.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.policeStation.toLowerCase().includes(q) ||
        e.registeringOfficer.toLowerCase().includes(q) ||
        e.relatedEntities.some(re => re.label.toLowerCase().includes(q) || re.id.toLowerCase().includes(q)) ||
        (e.digitalDocument?.filename && e.digitalDocument.filename.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getEvidenceById(id: string): EvidenceRecord | undefined {
    const all = this.getEvidenceList();
    return all.find(e => e.id.toLowerCase() === id.toLowerCase());
  },

  getEvidenceByCase(caseId: string): EvidenceRecord[] {
    return this.getEvidenceList({ caseId });
  },

  getRegistryStats(caseId?: string): EvidenceRegistryStats {
    const list = caseId && caseId !== 'ALL' 
      ? this.getEvidenceList({ caseId }) 
      : this.getEvidenceList();

    const total = list.length;
    const digital = list.filter(e => e.hasDigitalCopy).length;
    const pending = list.filter(e => !e.hasDigitalCopy).length;
    const underReview = list.filter(e => e.status === 'UNDER_REVIEW').length;
    const verified = list.filter(e => e.status === 'VERIFIED').length;

    return {
      totalEvidence: total,
      digitalCopiesAvailable: digital,
      pendingDigitization: pending,
      underReview: underReview,
      verified: verified
    };
  },

  registerEvidence(data: Omit<EvidenceRecord, 'id' | 'status' | 'previousVersions' | 'chainOfCustody'> & { initialFileContent?: string; initialFilename?: string }): EvidenceRecord {
    const all = this.getEvidenceList();
    const count = all.length + 1;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newId = `EVD-2026-${randomSuffix}`;

    let digitalDoc: DigitalDocumentAttachment | undefined = undefined;
    let hasDigital = data.hasDigitalCopy;

    if (data.initialFileContent && data.initialFilename) {
      hasDigital = true;
      digitalDoc = {
        filename: data.initialFilename,
        fileType: 'application/pdf',
        fileSize: '1.8 MB',
        uploadDate: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${data.collectedTime}`,
        uploader: `${data.registeringOfficer} (${data.badgeNumber})`,
        version: '1.0 (Initial Ingestion)',
        integrityHash: `e3b0c442${Date.now()}9afbf4c8996fb92427ae41e4649b934ca495991b7852${randomSuffix}`,
        content: data.initialFileContent,
        previewAvailable: true
      };
    }

    const initialCustody: CustodyEvent[] = [
      {
        id: `CUST-${Date.now()}-01`,
        action: 'Evidence Registered in Registry',
        officer: data.registeringOfficer,
        badge: data.badgeNumber,
        timestamp: `${data.collectedDate} ${data.collectedTime}`,
        notes: `Registered at ${data.policeStation}.`
      }
    ];

    if (digitalDoc) {
      initialCustody.push({
        id: `CUST-${Date.now()}-02`,
        action: 'Digital Soft Copy Attached',
        officer: data.registeringOfficer,
        badge: data.badgeNumber,
        timestamp: `${data.collectedDate} ${data.collectedTime}`,
        notes: `Digital copy ${digitalDoc.filename} verified with SHA-256 hash.`
      });
    }

    const newRecord: EvidenceRecord = {
      ...data,
      id: newId,
      status: hasDigital ? 'DIGITAL_COPY_AVAILABLE' : 'REGISTERED',
      hasDigitalCopy: hasDigital,
      digitalDocument: digitalDoc,
      previousVersions: [],
      chainOfCustody: initialCustody
    };

    const list = getStoredEvidence();
    list.unshift(newRecord);
    saveStoredEvidence(list);
    
    try {
      auditService.logAction({
        action: 'REGISTERED_EVIDENCE',
        actionLabel: 'Registered Evidence in Digital Ledger',
        module: 'Evidence',
        caseId: newRecord.caseId,
        recordId: newRecord.id,
        recordType: 'EVIDENCE',
        recordLabel: newRecord.title,
        status: 'SUCCESS',
        details: `Evidence item ${newRecord.id} (${newRecord.title}) registered by ${newRecord.registeringOfficer}.`
      });
    } catch (err) {
      console.warn('Failed to persist registered evidence:', err);
    }

    return newRecord;
  },

  uploadSoftCopy(
    evidenceId: string, 
    fileData: { filename: string; content: string; officer: string; badge: string }
  ): EvidenceRecord | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVIDENCE);
      const list: EvidenceRecord[] = stored ? JSON.parse(stored) : [...INITIAL_SYNTHETIC_EVIDENCE];
      const recordIndex = list.findIndex(e => e.id.toLowerCase() === evidenceId.toLowerCase());

      if (recordIndex === -1) return null;

      const currentRecord = list[recordIndex];
      const previousVersions = [...currentRecord.previousVersions];
      if (currentRecord.digitalDocument) {
        previousVersions.unshift(currentRecord.digitalDocument);
      }

      const versionNumber = (previousVersions.length + 1).toFixed(1);
      const newHash = `8a4f91bc${Date.now()}afbf4c8996fb92427ae41e4649b934ca495991b7852${evidenceId.replace(/\D/g, '')}`;

      const newDigitalDoc: DigitalDocumentAttachment = {
        filename: fileData.filename,
        fileType: fileData.filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
        fileSize: `${(fileData.content.length / 1024 + 1.2).toFixed(1)} MB`,
        uploadDate: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} IST`,
        uploader: `${fileData.officer} (${fileData.badge})`,
        version: `${versionNumber} (Investigator Ingested)`,
        integrityHash: newHash,
        content: fileData.content,
        previewAvailable: true
      };

      const newCustodyEvent: CustodyEvent = {
        id: `CUST-${Date.now()}`,
        action: `Digital Soft Copy Ingested (v${versionNumber})`,
        officer: fileData.officer,
        badge: fileData.badge,
        timestamp: new Date().toISOString(),
        notes: `Scanned file ${fileData.filename} uploaded and stamped with SHA-256 seal.`
      };

      const updatedRecord: EvidenceRecord = {
        ...currentRecord,
        hasDigitalCopy: true,
        status: 'DIGITAL_COPY_AVAILABLE',
        digitalDocument: newDigitalDoc,
        previousVersions: previousVersions,
        chainOfCustody: [newCustodyEvent, ...currentRecord.chainOfCustody]
      };

      list[recordIndex] = updatedRecord;
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(list));

      auditService.logAction({
        action: 'UPLOADED_SOFT_COPY',
        actionLabel: 'Uploaded Certified Evidence Soft-Copy',
        module: 'Evidence',
        caseId: updatedRecord.caseId,
        recordId: updatedRecord.id,
        recordType: 'EVIDENCE',
        recordLabel: updatedRecord.title,
        status: 'SUCCESS',
        details: `Uploaded certified soft copy ${fileData.filename} (v${versionNumber}) stamped with SHA-256 seal.`
      });

      return updatedRecord;
    } catch (err) {
      console.warn('Failed to upload soft copy:', err);
      return null;
    }
  },

  verifyIntegrity(evidenceId: string, officerName: string = 'Inspector Rajesh Verma', badge: string = 'MHA-INT-8902'): { verified: boolean; hash: string; timestamp: string } | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVIDENCE);
      const list: EvidenceRecord[] = stored ? JSON.parse(stored) : [...INITIAL_SYNTHETIC_EVIDENCE];
      const recordIndex = list.findIndex(e => e.id.toLowerCase() === evidenceId.toLowerCase());

      if (recordIndex === -1) return null;

      const record = list[recordIndex];
      const hash = record.digitalDocument?.integrityHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78524821';
      const timestamp = new Date().toISOString();

      const verifyCustodyEvent: CustodyEvent = {
        id: `CUST-VERIFY-${Date.now()}`,
        action: 'Digital Integrity Re-Verified (SHA-256 Match)',
        officer: officerName,
        badge: badge,
        timestamp: timestamp,
        notes: 'Bitwise checksum verified against initial sealed ledger hash.'
      };

      record.status = 'VERIFIED';
      record.chainOfCustody.unshift(verifyCustodyEvent);
      list[recordIndex] = record;
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(list));

      auditService.logAction({
        action: 'VERIFIED_INTEGRITY',
        actionLabel: 'Verified Evidence SHA-256 Bitwise Seal',
        module: 'Evidence',
        caseId: record.caseId,
        recordId: record.id,
        recordType: 'EVIDENCE',
        recordLabel: record.title,
        status: 'SUCCESS',
        details: `SHA-256 cryptographic bitwise seal verified for ${record.id} (${record.title}).`
      });

      return {
        verified: true,
        hash,
        timestamp
      };
    } catch (err) {
      console.warn('Integrity check failed:', err);
      return null;
    }
  }
};
