import { Case } from '../types';

export const mockCases: Case[] = [
  {
    id: 'CASE-1024',
    name: 'Operation Meridian',
    codeName: 'MERIDIAN_ALPHA',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    leadInvestigator: 'Inspector Rajesh Verma',
    badgeNumber: 'MHA-INT-8902',
    department: 'Special Cyber & Financial Crimes Division',
    dateOpened: '2026-06-10',
    lastActivity: '12 mins ago (New CDR Intercept Added)',
    entityCount: 48,
    relationshipCount: 164,
    flaggedAlertsCount: 12,
    clustersIdentified: 4,
    tags: ['Financial Smurfing', 'Multi-Cluster Bridge', 'Cross-Border Shells', 'Encrypted CDR'],
    description: 'Multi-jurisdictional intelligence probe analyzing coordinated financial structuring and physical transshipment anomalies linked to synthetic enterprise accounts.',
    objective: 'Map the complete hierarchy connecting shell account Account ending 4821 with transport hubs (Thane West Logistics Hub) and pinpoint the bridge coordinators between Cluster 01 and Cluster 03.',
    keyFindings: [
      'Rahul Sharma identified as primary multi-cluster bridge (betweenness centrality: 0.61).',
      'Account ending 4821 disbursed ₹48,000 sub-threshold transfers within 22 minutes of deposit.',
      'Physical rendezvous verified via CCTV at Thane West Logistics Hub between Rahul Sharma and Amit Patil.',
      'Meridian Logistics Pvt. Ltd. acts as front aggregator holding lease contracts on transshipment hubs.'
    ],
    evidencePointers: {
      firCount: 6,
      cdrLogsCount: 2410,
      bankTransactionsCount: 1820,
      incidentReportsCount: 14
    }
  },
  {
    id: 'CASE-1031',
    name: 'Project Shadowline',
    codeName: 'SHADOWLINE_SEC',
    status: 'ACTIVE',
    priority: 'HIGH',
    leadInvestigator: 'Deputy Director Neha Sengupta',
    badgeNumber: 'MHA-INT-4411',
    department: 'Cyber Forensics & Counter-Infiltration Cell',
    dateOpened: '2026-07-02',
    lastActivity: '2 hours ago (Graph Sync Completed)',
    entityCount: 36,
    relationshipCount: 118,
    flaggedAlertsCount: 7,
    clustersIdentified: 3,
    tags: ['Burner SIM Network', 'Cell Tower Triangulation', 'Encrypted VOIP'],
    description: 'Investigation into coordinated short-burst communication rings using dynamic IMEI rotation across northern metropolitan corridors.',
    objective: 'Trace hardware signatures and identify common procurement channels for burner SIM clusters.',
    keyFindings: [
      'High temporal correlation between +91 XXXXX 28471 and four rotating burner SIMs.',
      'Geographic overlap detected near Vashi Safehouse Facility perimeter.'
    ],
    evidencePointers: {
      firCount: 3,
      cdrLogsCount: 4200,
      bankTransactionsCount: 310,
      incidentReportsCount: 8
    }
  },
  {
    id: 'CASE-1042',
    name: 'Operation Northstar',
    codeName: 'NORTHSTAR_GRID',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    leadInvestigator: 'ACP Vikramaditya Roy',
    badgeNumber: 'MHA-INT-7104',
    department: 'Inter-State Crime Intelligence Bureau',
    dateOpened: '2026-07-15',
    lastActivity: '1 day ago (Forensic Audit Report)',
    entityCount: 29,
    relationshipCount: 82,
    flaggedAlertsCount: 5,
    clustersIdentified: 2,
    tags: ['Automated ANPR Track', 'Fleet Route Anomalies', 'Staging Warehouses'],
    description: 'Surveillance analysis focused on vehicle fleet movements between transit checkpoints and unlisted private logistics yards.',
    objective: 'Correlate automatic number-plate recognition (ANPR) timestamp logs with telecommunication tower co-locations.',
    keyFindings: [
      'Vehicle MH-04-XX-2847 logged recurring nocturnal route patterns along State Highway 4.',
      'Direct linkage confirmed to Vashi Safehouse Facility staging yard.'
    ],
    evidencePointers: {
      firCount: 4,
      cdrLogsCount: 1150,
      bankTransactionsCount: 420,
      incidentReportsCount: 19
    }
  },
  {
    id: 'CASE-1057',
    name: 'Project Crosslink',
    codeName: 'CROSSLINK_NET',
    status: 'ACTIVE',
    priority: 'HIGH',
    leadInvestigator: 'Superintendent Ananya Sharma',
    badgeNumber: 'MHA-INT-9930',
    department: 'Economic Offenses & Fraud Analytics Unit',
    dateOpened: '2026-08-01',
    lastActivity: '3 hours ago (Entity Resolution Flag)',
    entityCount: 52,
    relationshipCount: 198,
    flaggedAlertsCount: 9,
    clustersIdentified: 5,
    tags: ['Shell Company Network', 'Director Overlap', 'Offshore Inflow'],
    description: 'Corporate registry cross-matching and multi-layer beneficial ownership analysis across 12 newly incorporated shell entities.',
    objective: 'Expose the underlying beneficial owners utilizing common proxy directors across corporate holdings.',
    keyFindings: [
      'Meridian Logistics Pvt. Ltd. shares registered office coordinates with 3 previously blacklisted entities.',
      'Beneficial capital traced through multiple commercial banking gateways.'
    ],
    evidencePointers: {
      firCount: 8,
      cdrLogsCount: 3890,
      bankTransactionsCount: 2940,
      incidentReportsCount: 11
    }
  },
  {
    id: 'CASE-1068',
    name: 'Operation Bluefin',
    codeName: 'BLUEFIN_MARITIME',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    leadInvestigator: 'Inspector Debashish Paul',
    badgeNumber: 'MHA-INT-3021',
    department: 'Maritime Intelligence & Border Post, Eastern Docklands',
    dateOpened: '2026-08-08',
    lastActivity: '5 hours ago (Port Manifest Ingested)',
    entityCount: 24,
    relationshipCount: 76,
    flaggedAlertsCount: 4,
    clustersIdentified: 2,
    tags: ['Maritime Manifest', 'Container Logistics', 'Customs Relay'],
    description: 'Port manifest discrepancy analysis tracking unmanifested containerized cargo between Eastern port terminals.',
    objective: 'Map shipping consignees, container logistics coordinates, and freight forwarder contact clusters.',
    keyFindings: [
      'Discrepancy identified between shipping weights and declaration bills of lading.',
      'Logistics relay links Eastern port container yard to inland transport staging point.'
    ],
    evidencePointers: {
      firCount: 4,
      cdrLogsCount: 1840,
      bankTransactionsCount: 920,
      incidentReportsCount: 8
    }
  },
  {
    id: 'CASE-1075',
    name: 'Sector 9 Hawala Intercept',
    codeName: 'HAWALA_SECTOR9',
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    leadInvestigator: 'Senior Inspector K. R. Rao',
    badgeNumber: 'MHA-INT-5542',
    department: 'Special Financial Intelligence Cell, Hyderabad',
    dateOpened: '2026-08-12',
    lastActivity: 'Yesterday (Encrypted Ledger Decrypted)',
    entityCount: 18,
    relationshipCount: 54,
    flaggedAlertsCount: 6,
    clustersIdentified: 2,
    tags: ['Hawala Books', 'Cash Couriers', 'IMPS Burst'],
    description: 'Intercepted encrypted ledger spreadsheets detailing sub-threshold cash distribution relays.',
    objective: 'Trace token distribution codes to physical cash collection nodes.',
    keyFindings: [
      'Cash collection codes synchronized with IMPS confirmation timestamps.',
      'Two primary couriers operated rotating collection points.'
    ],
    evidencePointers: {
      firCount: 3,
      cdrLogsCount: 1290,
      bankTransactionsCount: 1450,
      incidentReportsCount: 6
    }
  },
  {
    id: 'CASE-1082',
    name: 'Project Blackthorn',
    codeName: 'BLACKTHORN_IMEI',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    leadInvestigator: 'Inspector Priya Deshmukh',
    badgeNumber: 'MHA-INT-8819',
    department: 'Special Cyber Task Force, Pune',
    dateOpened: '2026-08-18',
    lastActivity: '2 days ago (IMEI Cluster Flagged)',
    entityCount: 22,
    relationshipCount: 68,
    flaggedAlertsCount: 3,
    clustersIdentified: 2,
    tags: ['Hardware Signature', 'Encrypted Device Ring', 'IMEI Cloning'],
    description: 'Forensic extraction of synchronized hardware IMEI rotations originating from unverified mobile retail distributors.',
    objective: 'Map the supply chain of pre-activated handsets used in coordinated fraud campaigns.',
    keyFindings: [
      'Batch of 40 SIMs activated under forged retailer credentials.',
      'Identical tower cell IDs registered across 12 simultaneous device handshakes.'
    ],
    evidencePointers: {
      firCount: 2,
      cdrLogsCount: 2100,
      bankTransactionsCount: 380,
      incidentReportsCount: 5
    }
  },
  {
    id: 'CASE-1090',
    name: 'Operation Falcon',
    codeName: 'FALCON_EXTORT',
    status: 'ACTIVE',
    priority: 'HIGH',
    leadInvestigator: 'ACP Rakesh Malhotra',
    badgeNumber: 'MHA-INT-6201',
    department: 'Anti-Extortion & Organized Crime Syndicate Cell',
    dateOpened: '2026-08-21',
    lastActivity: '4 hours ago (Voice Note Forensic Analysis)',
    entityCount: 31,
    relationshipCount: 94,
    flaggedAlertsCount: 5,
    clustersIdentified: 3,
    tags: ['VoIP Spoofing', 'Threat Relay', 'Escrow Laundering'],
    description: 'Investigation into coordinated extortion calls using international virtual numbers and domestic mule account cash-outs.',
    objective: 'Identify local call originators and trace payment gateway disbursement links.',
    keyFindings: [
      'VoIP gateway proxy traced through unverified hosting service.',
      'Mule account withdrawals occurred within 15 minutes of victim transfers.'
    ],
    evidencePointers: {
      firCount: 5,
      cdrLogsCount: 1650,
      bankTransactionsCount: 890,
      incidentReportsCount: 7
    }
  },
  {
    id: 'CASE-1095',
    name: 'Project Silverline',
    codeName: 'SILVERLINE_AUTO',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    leadInvestigator: 'Inspector Sanjay Kulkarni',
    badgeNumber: 'MHA-INT-4109',
    department: 'Inter-State Vehicle Theft & Chassis Tampering Squad',
    dateOpened: '2026-08-24',
    lastActivity: '6 hours ago (Chassis Registry Alert)',
    entityCount: 26,
    relationshipCount: 72,
    flaggedAlertsCount: 4,
    clustersIdentified: 2,
    tags: ['ANPR Correlation', 'Chassis Cloning', 'Scrapyard Hubs'],
    description: 'Intelligence analysis linking automated toll ANPR scans with fraudulent vehicle re-registration documentation.',
    objective: 'Dismantle inter-state stolen vehicle transit conduit operating across state border toll plazas.',
    keyFindings: [
      'Three luxury SUVs detected passing border tolls with duplicate registration plates.',
      'Staging garage located near industrial transit corridor.'
    ],
    evidencePointers: {
      firCount: 4,
      cdrLogsCount: 1420,
      bankTransactionsCount: 510,
      incidentReportsCount: 9
    }
  },
  {
    id: 'CASE-1102',
    name: 'Operation Sentinel',
    codeName: 'SENTINEL_CYBER',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    leadInvestigator: 'Deputy Director Neha Sengupta',
    badgeNumber: 'MHA-INT-4411',
    department: 'Special Cyber & Financial Crimes Division',
    dateOpened: '2026-08-27',
    lastActivity: '30 mins ago (Live Infiltration Alert)',
    entityCount: 38,
    relationshipCount: 122,
    flaggedAlertsCount: 8,
    clustersIdentified: 3,
    tags: ['Malware C2', 'Credential Harvester', 'Crypto Structuring'],
    description: 'Cross-agency response to targeted phishing campaigns against regional cooperative banks and rapid cryptocurrency conversion.',
    objective: 'Isolate Command & Control infrastructure and freeze associated cryptocurrency wallet addresses.',
    keyFindings: [
      'Spear-phishing emails originated from compromised vendor email server.',
      'Stolen funds routed through decentralized mixer services.'
    ],
    evidencePointers: {
      firCount: 6,
      cdrLogsCount: 3100,
      bankTransactionsCount: 2150,
      incidentReportsCount: 12
    }
  }
];
