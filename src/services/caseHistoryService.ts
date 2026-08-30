import { EntityType } from '../types';

export type ParticipantRole = 
  | 'COMPLAINANT'
  | 'VICTIM'
  | 'PERSON_OF_INTEREST'
  | 'ASSOCIATED_PERSON'
  | 'INVESTIGATOR'
  | 'OTHER';

export interface CaseParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  roleDescription: string;
  contact: string;
  address: string;
  relevance: string;
  linkedEntityId?: string;
  badgeNumber?: string;
}

export interface IncidentDetails {
  incidentId: string;
  caseId: string;
  firNumber: string;
  incidentType: string;
  date: string;
  time: string;
  location: string;
  description: string;
  reportingOfficer: string;
  policeStation: string;
  initialInformation: string;
  currentStatus: string;
  chronologicalUpdates: Array<{
    date: string;
    time: string;
    officer: string;
    note: string;
    statusChange?: string;
  }>;
}

export type StatementType = 
  | 'INITIAL_INTERVIEW'
  | 'SUPPLEMENTARY_STATEMENT'
  | 'SCENE_RECONSTRUCTION'
  | 'DEPOSITION';

export interface WitnessStatement {
  id: string;
  statementNumber: number;
  date: string;
  time: string;
  location: string;
  recordingOfficer: string;
  type: StatementType;
  summary: string;
  fullText: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'FLAGGED_VARIATION';
  source: string;
  inconsistenciesWithPrevious?: string[];
}

export interface WitnessRecord {
  id: string;
  caseId: string;
  name: string;
  age: number;
  contact: string;
  address: string;
  relationshipToIncident: string;
  interviewDate: string;
  interviewTime: string;
  interviewLocation: string;
  recordingOfficer: string;
  badgeNumber: string;
  status: 'STATEMENT_RECORDED' | 'SUPPLEMENTARY_PENDING' | 'DEPOSITION_COMPLETED';
  observedEntities: Array<{
    entityId: string;
    label: string;
    type: EntityType;
    observation: string;
  }>;
  statements: WitnessStatement[];
  notes?: string;
}

export interface InvestigationAction {
  id: string;
  caseId: string;
  title: string;
  assignedOfficer: string;
  targetSubject: string;
  dueDate: string;
  completedDate?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'SUPERSEDED';
  findings?: string;
}

export interface OfficerObservation {
  id: string;
  caseId: string;
  officer: string;
  badge: string;
  date: string;
  time: string;
  location: string;
  observation: string;
  relatedEntityIds: string[];
  relatedEvidenceId?: string;
}

export type EventSourceType = 
  | 'INCIDENT_REPORT'
  | 'FIR'
  | 'WITNESS_STATEMENT'
  | 'EVIDENCE_REGISTRY'
  | 'ANALYTICAL_ENGINE'
  | 'OFFICER_OBSERVATION'
  | 'ACTION_LOG'
  | 'CASE_DIARY';

export interface UnifiedCaseEvent {
  id: string;
  caseId: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  title: string;
  description: string;
  peopleInvolved: string[];
  sourceType: EventSourceType;
  sourceId: string;
  sourceDocumentRef?: string;
  sourceEvidenceRef?: string;
  sourceWitnessRef?: string;
}

export interface CaseLifecycleEvent {
  id: string;
  action: string;
  date: string;
  time: string;
  officer: string;
  details: string;
}

export interface CaseClosureInfo {
  isClosed: boolean;
  closureDate?: string;
  closingOfficer?: string;
  closureReason?: string;
  finalReportRef?: string;
}

const STORAGE_KEY_WITNESSES = 'tracenet_case_witnesses_v1';
const STORAGE_KEY_ACTIONS = 'tracenet_case_actions_v1';
const STORAGE_KEY_OBSERVATIONS = 'tracenet_case_observations_v1';

// Rich Synthetic Data across cases
const INITIAL_INCIDENTS: Record<string, IncidentDetails> = {
  'CASE-1024': {
    incidentId: 'INC-2026-DEL-0192',
    caseId: 'CASE-1024',
    firNumber: 'FIR-2026-DEL-0412',
    incidentType: 'Coordinated Financial Structuring & Freight Diversion',
    date: '2026-06-10',
    time: '08:30 IST',
    location: 'Sector 4 Transshipment Yard & Banking Gateway, Thane West',
    description: 'Multi-jurisdictional financial smurfing syndicate coordinating sub-statutory wire dispersals through enterprise escrow accounts linked to nocturnal freight transshipment at unlisted staging yards.',
    reportingOfficer: 'Inspector Rajesh Verma',
    policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
    initialInformation: 'Source report from Financial Intelligence Unit flagging 14 structured IMPS transfers beneath ₹50,000 threshold within 24 hours of cash deposits.',
    currentStatus: 'Under Active Cross-Jurisdictional Investigation',
    chronologicalUpdates: [
      { date: '10 Jun 2026', time: '09:00 IST', officer: 'Inspector Rajesh Verma', note: 'FIR registered under Sec 420, 120-B IPC and IT Act Sec 66D.' },
      { date: '14 Jun 2026', time: '14:20 IST', officer: 'Inspector Rajesh Verma', note: 'Telecom intercept authorization granted under Section 92 CrPC.' },
      { date: '14 Aug 2026', time: '11:00 IST', officer: 'Sub-Inspector K. Sharma', note: 'Key witness Meera Joshi interviewed regarding warehouse movements.' },
      { date: '26 Aug 2026', time: '18:45 IST', officer: 'Inspector Rajesh Verma', note: 'Graph analysis confirmed Rahul Sharma as primary multi-cluster bridge.' }
    ]
  },
  'CASE-1031': {
    incidentId: 'INC-2026-MUM-0081',
    caseId: 'CASE-1031',
    firNumber: 'FIR-2026-MUM-0198',
    incidentType: 'Dynamic IMEI Rotation & Burner SIM Syndicate',
    date: '2026-07-02',
    time: '11:15 IST',
    location: 'Western Transit Terminal Corridor, Mumbai',
    description: 'Automated IMEI spoofing ring rotating 4 micro-SIM cards sequentially across single radio transceivers at 42-minute intervals.',
    reportingOfficer: 'Deputy Director Neha Sengupta',
    policeStation: 'Cyber Forensics & Counter-Infiltration Cell, Mumbai',
    initialInformation: 'Automated spectrum analyzer telemetry flagged rapid subscriber turnover on hardware transceiver IMEI 864902049182741.',
    currentStatus: 'Forensic Hardware Telemetry Analysis',
    chronologicalUpdates: [
      { date: '02 Jul 2026', time: '12:00 IST', officer: 'Deputy Director Neha Sengupta', note: 'Cyber probe opened on rotating subscriber identities.' },
      { date: '18 Jul 2026', time: '16:30 IST', officer: 'Inspector S. Pillai', note: 'Tower dump analysis reveals co-location near Terminal 2.' }
    ]
  },
  'CASE-1042': {
    incidentId: 'INC-2026-NCR-0419',
    caseId: 'CASE-1042',
    firNumber: 'FIR-2026-NCR-0881',
    incidentType: 'Off-Hours Surveillance & Staging Yard Diversion',
    date: '2026-07-15',
    time: '04:15 IST',
    location: 'State Highway Toll Barrier 4B to Vashi Safehouse',
    description: 'Nocturnal transport fleet movements between private warehouse bays during 02:00 - 04:30 AM window avoiding scheduled inspections.',
    reportingOfficer: 'ACP Vikramaditya Roy',
    policeStation: 'Inter-State Crime Intelligence Bureau, NCR Zone',
    initialInformation: 'Surveillance cameras logged recurring nighttime crossings of vehicle MH-04-XX-2847.',
    currentStatus: 'Under Surveillance Review',
    chronologicalUpdates: [
      { date: '15 Jul 2026', time: '06:00 IST', officer: 'ACP Vikramaditya Roy', note: 'ANPR checkpoint hit logs indexed into case file.' }
    ]
  },
  'CASE-1057': {
    incidentId: 'INC-2026-EOD-0912',
    caseId: 'CASE-1057',
    firNumber: 'FIR-2026-EOD-0341',
    incidentType: 'Corporate Shell Director Overlap & Offshore Routing',
    date: '2026-08-01',
    time: '14:00 IST',
    location: 'Commercial Financial Center, Nariman Point, Mumbai',
    description: 'Corporate registry cross-matching revealed shared proxy directors between Meridian Logistics Pvt. Ltd. and blacklisted corporate entities.',
    reportingOfficer: 'Superintendent Ananya Sharma',
    policeStation: 'Economic Offenses & Fraud Analytics Unit, State HQ',
    initialInformation: 'Statutory corporate filings audit revealed common registered office coordinates across 12 commercial shells.',
    currentStatus: 'Corporate Beneficial Ownership Audit',
    chronologicalUpdates: [
      { date: '01 Aug 2026', time: '15:00 IST', officer: 'Superintendent Ananya Sharma', note: 'Corporate registry audit officially initiated.' }
    ]
  }
};

const INITIAL_PARTICIPANTS: Record<string, CaseParticipant[]> = {
  'CASE-1024': [
    {
      id: 'PART-01',
      name: 'Inspector Rajesh Verma',
      role: 'INVESTIGATOR',
      roleDescription: 'Lead Investigating Officer',
      contact: 'Internal Extension 4802',
      address: 'Special Cyber & Financial Crimes Division, Central Delhi',
      relevance: 'Authorizing officer for Sections 91/92 CrPC notices and graph builds.',
      badgeNumber: 'MHA-INT-8902'
    },
    {
      id: 'PART-02',
      name: 'Sunil Mehta',
      role: 'COMPLAINANT',
      roleDescription: 'Nodal Risk Officer, Demo National Bank',
      contact: '+91 XXXXX 39102',
      address: 'Bank Zonal Office, Nariman Point, Mumbai',
      relevance: 'Reported suspicious velocity structuring on Account ending 4821.',
      linkedEntityId: 'Account_103'
    },
    {
      id: 'PART-03',
      name: 'Rahul Sharma',
      role: 'PERSON_OF_INTEREST',
      roleDescription: 'Multi-Cluster Bridge Coordinator',
      contact: '+91 XXXXX 28471',
      address: 'Flat 402, Shanti Vihar, Sector 4, Thane West',
      relevance: 'Observed coordinating logistics and inter-account fund transfers.',
      linkedEntityId: 'Person_044'
    },
    {
      id: 'PART-04',
      name: 'Amit Patil',
      role: 'PERSON_OF_INTEREST',
      roleDescription: 'Logistics Terminal Coordinator',
      contact: '+91 XXXXX 73142',
      address: 'B-12 Eastern Industrial Corridor, Vashi',
      relevance: 'Managing Director of Meridian Logistics Pvt. Ltd. and counterparty.',
      linkedEntityId: 'Person_078'
    },
    {
      id: 'PART-05',
      name: 'Vikram Singh',
      role: 'ASSOCIATED_PERSON',
      roleDescription: 'Commercial Signatory',
      contact: '+91 XXXXX 81920',
      address: 'Commercial Finance Director Suite, BKC, Mumbai',
      relevance: 'Authorized signatory for intermediary accounts.',
      linkedEntityId: 'Person_001'
    }
  ]
};

const INITIAL_WITNESSES: Record<string, WitnessRecord[]> = {
  'CASE-1024': [
    {
      id: 'WIT-2026-0041',
      caseId: 'CASE-1024',
      name: 'Meera Joshi',
      age: 34,
      contact: '+91 XXXXX 19284',
      address: 'Flat 304, Gokul Residency, Sector 4, Thane West',
      relationshipToIncident: 'Administrative Supervisor, Adjacent Commercial Yard',
      interviewDate: '2026-08-14',
      interviewTime: '10:32 IST',
      interviewLocation: 'Sector 4 Police Chowki, Thane West',
      recordingOfficer: 'Inspector Rajesh Verma',
      badgeNumber: 'MHA-INT-8902',
      status: 'STATEMENT_RECORDED',
      observedEntities: [
        {
          entityId: 'Person_044',
          label: 'Rahul Sharma',
          type: 'PERSON',
          observation: 'Observed arriving at Sector 4 warehouse gate repeatedly around midnight.'
        },
        {
          entityId: 'Vehicle_017',
          label: 'Maruti Swift (MH-04-XX-2847)',
          type: 'VEHICLE',
          observation: 'Identified white Swift parked near private loading dock #2.'
        },
        {
          entityId: 'Location_A',
          label: 'Thane West Logistics Hub',
          type: 'LOCATION',
          observation: 'Confirmed off-hours unloading of unmanifested sealed crates.'
        }
      ],
      statements: [
        {
          id: 'STAT-2026-0041',
          statementNumber: 1,
          date: '2026-08-14',
          time: '10:32 IST',
          location: 'Sector 4 Police Chowki, Thane West',
          recordingOfficer: 'Inspector Rajesh Verma (MHA-INT-8902)',
          type: 'INITIAL_INTERVIEW',
          summary: 'Witness states that between 10 Aug and 13 Aug, a white Maruti Swift arrived around midnight at Warehouse 4. A male matching Rahul Sharma supervised unloading of cargo.',
          fullText: `STATEMENT UNDER SECTION 161 CrPC
NAME OF WITNESS: Meera Joshi (Age: 34)
OCCUPATION: Administrative Supervisor, Sector 4 Industrial Park
RECORDED BY: Inspector Rajesh Verma (MHA-INT-8902)
DATE & TIME: 14 August 2026, 10:32 IST

"I have been working as an administrative supervisor in the adjacent compound since 2024. Starting around 10 August 2026, I noticed unusual night activity at Gate 2 of the Thane West Logistics Hub. A white Maruti Swift (MH-04-XX-2847) would back into the cargo bay between 11:30 PM and 1:00 AM. 

The person driving was a tall male, approximately 38-42 years old, whom I later identified from photographs as Rahul Sharma. He spoke frequently on a mobile phone while workers transferred sealed corrugated boxes into the rear storage."

[RECORDED IN OFFICIAL CASE DIARY — SYNTHETIC DEMO EVIDENCE]`,
          status: 'VERIFIED',
          source: 'Section 161 CrPC Recorded Audio Memo'
        },
        {
          id: 'STAT-2026-0042',
          statementNumber: 2,
          date: '2026-08-20',
          time: '15:15 IST',
          location: 'Special Division HQ, Central Delhi',
          recordingOfficer: 'Sub-Inspector K. Sharma (MHA-INT-4412)',
          type: 'SUPPLEMENTARY_STATEMENT',
          summary: 'Supplementary statement clarifying presence of a second individual (Amit Patil) during the 18 August rendezvous.',
          fullText: `SUPPLEMENTARY STATEMENT UNDER SECTION 161 CrPC
NAME OF WITNESS: Meera Joshi
RECORDED BY: Sub-Inspector K. Sharma
DATE & TIME: 20 August 2026, 15:15 IST

"Further to my earlier statement of 14 August 2026, I wish to add that on the night of 18 August, Rahul Sharma was not alone. A second individual driving a dark SUV arrived at 00:45 AM. They examined documents under the yard floodlight for about 15 minutes before departure. From the photo array shown to me, this second individual strongly resembles Amit Patil."

[RECORDED IN OFFICIAL CASE DIARY — SYNTHETIC DEMO EVIDENCE]`,
          status: 'VERIFIED',
          source: 'Supplementary Investigation Diary Entry #18',
          inconsistenciesWithPrevious: [
            'Note for IO: Statement 1 initially stated individual operated alone during early August; Statement 2 details second vehicle and associate (Amit Patil) on 18 August. Deemed consistent with evolving timeline.'
          ]
        }
      ],
      notes: 'Reliable eye-witness with direct vantage point overlooking Gate 2.'
    },
    {
      id: 'WIT-2026-0042',
      caseId: 'CASE-1024',
      name: 'Ramesh Kulkarni',
      age: 52,
      contact: '+91 XXXXX 48192',
      address: 'Quarters #8, Thane Industrial Estate',
      relationshipToIncident: 'Security In-charge, Gate 1',
      interviewDate: '2026-08-16',
      interviewTime: '14:00 IST',
      interviewLocation: 'Thane West Logistics Hub Admin Office',
      recordingOfficer: 'Inspector Rajesh Verma',
      badgeNumber: 'MHA-INT-8902',
      status: 'STATEMENT_RECORDED',
      observedEntities: [
        {
          entityId: 'Location_A',
          label: 'Thane West Logistics Hub',
          type: 'LOCATION',
          observation: 'Maintained manual vehicle entry log for external transport vans.'
        }
      ],
      statements: [
        {
          id: 'STAT-2026-0043',
          statementNumber: 1,
          date: '2026-08-16',
          time: '14:00 IST',
          location: 'Admin Office, Thane West',
          recordingOfficer: 'Inspector Rajesh Verma',
          type: 'INITIAL_INTERVIEW',
          summary: 'Security guard confirms logbook entries were occasionally bypassed upon verbal instructions from management.',
          fullText: `STATEMENT UNDER SECTION 161 CrPC
NAME OF WITNESS: Ramesh Kulkarni (Age: 52)
OCCUPATION: Head Guard, Gate 1
DATE & TIME: 16 August 2026, 14:00 IST

"I manage the primary visitor and truck registry at Gate 1. While regular commercial carriers are entered in the computerized visitor management system, certain private vehicles entering through Gate 2 were permitted direct access by warehouse leaseholders without manual log entries."

[RECORDED IN OFFICIAL CASE DIARY — SYNTHETIC DEMO EVIDENCE]`,
          status: 'VERIFIED',
          source: 'Physical Gate Log Panchnama'
        }
      ]
    }
  ],
  'CASE-1031': [
    {
      id: 'WIT-2026-0051',
      caseId: 'CASE-1031',
      name: 'Anand Shinde',
      age: 29,
      contact: '+91 XXXXX 77319',
      address: 'Shop 12, Terminal Market Plaza, Mumbai',
      relationshipToIncident: 'Telecom Retail Store Owner',
      interviewDate: '2026-07-20',
      interviewTime: '11:45 IST',
      interviewLocation: 'Cyber Cell Precinct, Mumbai',
      recordingOfficer: 'Deputy Director Neha Sengupta',
      badgeNumber: 'MHA-INT-4411',
      status: 'STATEMENT_RECORDED',
      observedEntities: [
        {
          entityId: 'Phone_021',
          label: '+91 XXXXX 28471',
          type: 'PHONE',
          observation: 'Recognized retail SIM activation batches.'
        }
      ],
      statements: [
        {
          id: 'STAT-2026-0051',
          statementNumber: 1,
          date: '2026-07-20',
          time: '11:45 IST',
          location: 'Cyber Cell Precinct, Mumbai',
          recordingOfficer: 'Deputy Director Neha Sengupta',
          type: 'INITIAL_INTERVIEW',
          summary: 'Retailer confirms bulk purchase of pre-activated micro-SIMs using synthetic identity proofs.',
          fullText: `STATEMENT UNDER SECTION 161 CrPC
NAME: Anand Shinde (Age: 29)
OCCUPATION: Retail Mobile Vendor
DATE: 20 July 2026

"A customer purchased a batch of 8 pre-paid SIM cards using photocopied documentation in early July. All cards were activated within a 48-hour window."

[RECORDED IN OFFICIAL CASE DIARY — SYNTHETIC DEMO EVIDENCE]`,
          status: 'VERIFIED',
          source: 'Telecom Store Sales Ledger Memo'
        }
      ]
    }
  ]
};

const INITIAL_ACTIONS: Record<string, InvestigationAction[]> = {
  'CASE-1024': [
    {
      id: 'ACT-2026-0081',
      caseId: 'CASE-1024',
      title: 'Interview Witness Meera Joshi on Sector 4 Night Movements',
      assignedOfficer: 'Inspector Rajesh Verma',
      targetSubject: 'Meera Joshi (Witness WIT-2026-0041)',
      dueDate: '2026-08-14',
      completedDate: '2026-08-14',
      status: 'COMPLETED',
      findings: 'Statement STAT-2026-0041 successfully recorded under Sec 161 CrPC.'
    },
    {
      id: 'ACT-2026-0082',
      caseId: 'CASE-1024',
      title: 'Issue Statutory Notice to Demo National Bank for Account ending 4821',
      assignedOfficer: 'Inspector Rajesh Verma',
      targetSubject: 'Account ending 4821 (Account_103)',
      dueDate: '2026-08-15',
      completedDate: '2026-08-16',
      status: 'COMPLETED',
      findings: 'Bank provided SWIFT transmission ledger #SWIFT-IMPS-20260826-8849-4821.'
    },
    {
      id: 'ACT-2026-0083',
      caseId: 'CASE-1024',
      title: 'Verify ANPR Camera #04 Optical Hits on Maruti Swift MH-04-XX-2847',
      assignedOfficer: 'ACP Vikramaditya Roy',
      targetSubject: 'Maruti Swift (Vehicle_017)',
      dueDate: '2026-08-26',
      completedDate: '2026-08-26',
      status: 'COMPLETED',
      findings: 'Optical facial recognition confirmed Rahul Sharma driving at 07:10 AM.'
    },
    {
      id: 'ACT-2026-0084',
      caseId: 'CASE-1024',
      title: 'Conduct Registrar of Companies Beneficial Ownership Audit on Meridian Logistics',
      assignedOfficer: 'Inspector Rajesh Verma',
      targetSubject: 'Meridian Logistics Pvt. Ltd. (Organization_X)',
      dueDate: '2026-09-02',
      status: 'IN_PROGRESS',
      findings: 'Cross-checking DIN director filings for Amit Patil and associated shell proxies.'
    }
  ]
};

const INITIAL_OBSERVATIONS: Record<string, OfficerObservation[]> = {
  'CASE-1024': [
    {
      id: 'OBS-2026-0011',
      caseId: 'CASE-1024',
      officer: 'Inspector Rajesh Verma',
      badge: 'MHA-INT-8902',
      date: '2026-08-25',
      time: '20:15 IST',
      location: 'Sector 4 Logistics Hub Gate 2, Thane West',
      observation: 'During physical surveillance, observed vehicle MH-04-XX-2847 arriving without headlights. Two individuals exited matching profiles of Rahul Sharma and Amit Patil. Unloaded two sealed packages into basement lockup.',
      relatedEntityIds: ['Person_044', 'Person_078', 'Vehicle_017', 'Location_A'],
      relatedEvidenceId: 'EVD-2026-000185'
    },
    {
      id: 'OBS-2026-0012',
      caseId: 'CASE-1024',
      officer: 'ACP Vikramaditya Roy',
      badge: 'MHA-INT-7104',
      date: '2026-08-26',
      time: '08:45 IST',
      location: 'State Highway Toll Barrier 4B',
      observation: 'ANPR optical detection synchronized with live telecom cell sector ping on tower Sector 14 north. Strong operational co-location verified.',
      relatedEntityIds: ['Phone_021', 'Vehicle_017'],
      relatedEvidenceId: 'EVD-2026-000184'
    }
  ]
};

export const caseHistoryService = {
  getIncidentDetails(caseId: string): IncidentDetails | null {
    return INITIAL_INCIDENTS[caseId] || {
      incidentId: `INC-2026-${caseId.replace(/\D/g, '')}-01`,
      caseId: caseId,
      firNumber: `FIR-2026-${caseId.replace(/\D/g, '')}-01`,
      incidentType: 'General Investigation Inquiry',
      date: '2026-08-01',
      time: '10:00 IST',
      location: 'Metropolitan Investigation Jurisdiction',
      description: `Official investigation inquiry opened for ${caseId}. Multi-source evidentiary collection in progress.`,
      reportingOfficer: 'Inspector Rajesh Verma',
      policeStation: 'Special Cyber & Financial Crimes Division, Central Delhi',
      initialInformation: 'Preliminary intelligence report received from field monitoring unit.',
      currentStatus: 'Under Active Investigation',
      chronologicalUpdates: [
        { date: '01 Aug 2026', time: '10:00 IST', officer: 'Inspector Rajesh Verma', note: 'Case file officially indexed.' }
      ]
    };
  },

  getParticipants(caseId: string): CaseParticipant[] {
    return INITIAL_PARTICIPANTS[caseId] || [
      {
        id: 'PART-DEF-01',
        name: 'Inspector Rajesh Verma',
        role: 'INVESTIGATOR',
        roleDescription: 'Lead Investigating Officer',
        contact: 'Internal Ext 4802',
        address: 'Special Cyber & Financial Crimes Division',
        relevance: 'Primary case investigator and supervisor.'
      },
      {
        id: 'PART-DEF-02',
        name: 'Rahul Sharma',
        role: 'PERSON_OF_INTEREST',
        roleDescription: 'Subject of Inquiry',
        contact: '+91 XXXXX 28471',
        address: 'Sector 4, Thane West',
        relevance: 'Named in initial intelligence telemetry.',
        linkedEntityId: 'Person_044'
      }
    ];
  },

  getWitnesses(caseId: string): WitnessRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WITNESSES);
      if (stored) {
        const all: Record<string, WitnessRecord[]> = JSON.parse(stored);
        if (all[caseId]) return all[caseId];
      }
    } catch {}
    return INITIAL_WITNESSES[caseId] || [];
  },

  getWitnessById(caseId: string, witnessId: string): WitnessRecord | undefined {
    const list = this.getWitnesses(caseId);
    return list.find(w => w.id.toLowerCase() === witnessId.toLowerCase());
  },

  recordWitnessStatement(caseId: string, witnessId: string, statementData: Omit<WitnessStatement, 'id' | 'statementNumber'>): WitnessRecord | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WITNESSES);
      const all: Record<string, WitnessRecord[]> = stored ? JSON.parse(stored) : { ...INITIAL_WITNESSES };
      const caseWitnesses = all[caseId] || INITIAL_WITNESSES[caseId] || [];
      const witnessIndex = caseWitnesses.findIndex(w => w.id.toLowerCase() === witnessId.toLowerCase());

      if (witnessIndex === -1) return null;

      const witness = caseWitnesses[witnessIndex];
      const newStatementNumber = witness.statements.length + 1;
      const newStatementId = `STAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newStatement: WitnessStatement = {
        ...statementData,
        id: newStatementId,
        statementNumber: newStatementNumber
      };

      witness.statements.push(newStatement);
      witness.status = 'STATEMENT_RECORDED';
      caseWitnesses[witnessIndex] = witness;
      all[caseId] = caseWitnesses;
      localStorage.setItem(STORAGE_KEY_WITNESSES, JSON.stringify(all));
      return witness;
    } catch (err) {
      console.warn('Failed to record witness statement:', err);
      return null;
    }
  },

  getActions(caseId: string): InvestigationAction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIONS);
      if (stored) {
        const all: Record<string, InvestigationAction[]> = JSON.parse(stored);
        if (all[caseId]) return all[caseId];
      }
    } catch {}
    return INITIAL_ACTIONS[caseId] || [];
  },

  addAction(caseId: string, action: Omit<InvestigationAction, 'id'>): InvestigationAction {
    const newId = `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAction: InvestigationAction = { ...action, id: newId, caseId };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIONS);
      const all: Record<string, InvestigationAction[]> = stored ? JSON.parse(stored) : { ...INITIAL_ACTIONS };
      const list = all[caseId] || INITIAL_ACTIONS[caseId] || [];
      list.unshift(newAction);
      all[caseId] = list;
      localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(all));
    } catch {}

    return newAction;
  },

  updateActionStatus(caseId: string, actionId: string, status: InvestigationAction['status']): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIONS);
      const all: Record<string, InvestigationAction[]> = stored ? JSON.parse(stored) : { ...INITIAL_ACTIONS };
      const list = all[caseId] || INITIAL_ACTIONS[caseId] || [];
      const idx = list.findIndex(a => a.id === actionId);
      if (idx !== -1) {
        list[idx].status = status;
        if (status === 'COMPLETED') list[idx].completedDate = new Date().toISOString().slice(0, 10);
        all[caseId] = list;
        localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(all));
        return true;
      }
    } catch {}
    return false;
  },

  getObservations(caseId: string): OfficerObservation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OBSERVATIONS);
      if (stored) {
        const all: Record<string, OfficerObservation[]> = JSON.parse(stored);
        if (all[caseId]) return all[caseId];
      }
    } catch {}
    return INITIAL_OBSERVATIONS[caseId] || [];
  },

  addObservation(caseId: string, obs: Omit<OfficerObservation, 'id'>): OfficerObservation {
    const newId = `OBS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newObs: OfficerObservation = { ...obs, id: newId, caseId };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_OBSERVATIONS);
      const all: Record<string, OfficerObservation[]> = stored ? JSON.parse(stored) : { ...INITIAL_OBSERVATIONS };
      const list = all[caseId] || INITIAL_OBSERVATIONS[caseId] || [];
      list.unshift(newObs);
      all[caseId] = list;
      localStorage.setItem(STORAGE_KEY_OBSERVATIONS, JSON.stringify(all));
    } catch {}

    return newObs;
  },

  getUnifiedEvents(caseId: string): UnifiedCaseEvent[] {
    const incident = this.getIncidentDetails(caseId);
    const witnesses = this.getWitnesses(caseId);
    const actions = this.getActions(caseId);
    const observations = this.getObservations(caseId);

    const events: UnifiedCaseEvent[] = [];

    // 1. Incident
    if (incident) {
      events.push({
        id: `EVT-${incident.incidentId}`,
        caseId: caseId,
        eventType: 'INCIDENT_REPORTED',
        date: incident.date,
        time: incident.time,
        location: incident.location,
        title: `Incident Registered: ${incident.incidentType}`,
        description: incident.description,
        peopleInvolved: [incident.reportingOfficer],
        sourceType: 'INCIDENT_REPORT',
        sourceId: incident.incidentId,
        sourceDocumentRef: incident.firNumber
      });
    }

    // 2. Witness statements
    witnesses.forEach(w => {
      w.statements.forEach(st => {
        events.push({
          id: `EVT-${st.id}`,
          caseId: caseId,
          eventType: 'WITNESS_STATEMENT_RECORDED',
          date: st.date,
          time: st.time,
          location: st.location,
          title: `Witness Statement Recorded: ${w.name} (Statement #${st.statementNumber})`,
          description: st.summary,
          peopleInvolved: [w.name, st.recordingOfficer],
          sourceType: 'WITNESS_STATEMENT',
          sourceId: st.id,
          sourceWitnessRef: w.id
        });
      });
    });

    // 3. Observations
    observations.forEach(obs => {
      events.push({
        id: `EVT-${obs.id}`,
        caseId: caseId,
        eventType: 'OFFICER_OBSERVATION',
        date: obs.date,
        time: obs.time,
        location: obs.location,
        title: `Officer Field Observation by ${obs.officer}`,
        description: obs.observation,
        peopleInvolved: [obs.officer],
        sourceType: 'OFFICER_OBSERVATION',
        sourceId: obs.id,
        sourceEvidenceRef: obs.relatedEvidenceId
      });
    });

    // 4. Actions
    actions.forEach(act => {
      events.push({
        id: `EVT-${act.id}`,
        caseId: caseId,
        eventType: 'INVESTIGATION_ACTION',
        date: act.completedDate || act.dueDate,
        time: '12:00 IST',
        location: 'Jurisdictional Field Office',
        title: `Action: ${act.title} (${act.status})`,
        description: act.findings || `Investigation action assigned to ${act.assignedOfficer}.`,
        peopleInvolved: [act.assignedOfficer, act.targetSubject],
        sourceType: 'ACTION_LOG',
        sourceId: act.id
      });
    });

    // Sort chronologically descending
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};
