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
    objective: 'Map the complete hierarchy connecting shell account Account_103 with transport hubs (Location_A) and pinpoint the bridge coordinators between Cluster 01 and Cluster 03.',
    keyFindings: [
      'Person_044 identified as primary multi-cluster bridge (betweenness centrality: 0.61).',
      'Account_103 disbursed ₹48,000 sub-threshold transfers within 22 minutes of deposit.',
      'Physical rendezvous verified via CCTV at Location_A between Person_044 and Person_078.',
      'Organization_X acts as front aggregator holding lease contracts on transshipment hubs.'
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
      'High temporal correlation between Phone_021 and four rotating burner SIMs.',
      'Geographic overlap detected near Terminal 2 logistics perimeter.'
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
      'Vehicle_017 logged recurring nocturnal route patterns along State Highway 4.',
      'Direct linkage confirmed to Location_B staging facility.'
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
      'Organization_X shares registered office coordinates with 3 previously blacklisted entities.',
      'Beneficial capital traced through multiple commercial banking gateways.'
    ],
    evidencePointers: {
      firCount: 8,
      cdrLogsCount: 3890,
      bankTransactionsCount: 2940,
      incidentReportsCount: 11
    }
  }
];
