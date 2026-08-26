import { IntelligenceReport } from '../types';

export const mockInvestigationReports: IntelligenceReport[] = [
  {
    id: 'REP-2026-1024-A',
    caseId: 'CASE-1024',
    caseName: 'Operation Meridian',
    title: 'Comprehensive Knowledge Graph & Network Syndicate Analysis',
    classification: 'CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE',
    generatedDate: '26 August 2026, 18:30 IST',
    author: 'Inspector Rajesh Verma (MHA-INT-8902)',
    agency: 'Ministry of Home Affairs — Special Cyber & Financial Crimes Division',
    executiveSummary: 'This intelligence dossier outlines algorithmic network analysis performed on multi-source ingestion data (2,410 CDR records, 1,820 banking ledger transactions, and 14 field surveillance incident reports). Graph topology algorithms identified a high-betweenness bridge node (Person_044) acting as an intermediary coordinator between financial layering syndicates (Cluster 01) and logistics transit nodes (Cluster 02 / Cluster 03). AI pattern recognition flagged structured transfers intentionally split beneath statutory reporting thresholds and synchronized physical rendezvous at unlisted warehouse facilities.',
    keyEntities: [
      {
        id: 'Person_044',
        label: 'Person_044',
        type: 'PERSON',
        priority: 'HIGH',
        centrality: 0.72,
        role: 'Multi-Cluster Bridge Coordinator (Betweenness: 0.61)'
      },
      {
        id: 'Account_103',
        label: 'ACCT-8849-103',
        type: 'ACCOUNT',
        priority: 'CRITICAL',
        centrality: 0.63,
        role: 'Layering Dispatch Account (Rapid Outflow Hub)'
      },
      {
        id: 'Person_078',
        label: 'Person_078',
        type: 'PERSON',
        priority: 'HIGH',
        centrality: 0.69,
        role: 'Logistics Cluster Lead (Direct Corporate Director Link)'
      },
      {
        id: 'Location_A',
        label: 'Sector 4 Logistics Warehouse',
        type: 'LOCATION',
        priority: 'HIGH',
        centrality: 0.55,
        role: 'Co-Location & Transit Meeting Hotspot'
      },
      {
        id: 'Organization_X',
        label: 'Apex Maritime Holdings Ltd.',
        type: 'ORGANIZATION',
        priority: 'HIGH',
        centrality: 0.61,
        role: 'Front Commercial Entity & Escrow Proxy'
      }
    ],
    networkFindings: [
      {
        title: 'High-Betweenness Inter-Cluster Gateway',
        description: 'Person_044 exhibits betweenness centrality of 0.61 (99th percentile across 1,284 entities). Removal of this single entity increases network diameter between Cluster 01 and Cluster 02 by 240%, indicating its vital role as a coordination funnel.',
        significance: 'Critical Lead for Intercept Authorization'
      },
      {
        title: 'Structured Smurfing & Velocity Anomaly',
        description: 'Account_103 executed rapid relay transactions where ₹48,000 was moved to Account_221 within 22 minutes of an inbound deposit. Over 83% of transfers fall precisely between ₹45,000 and ₹49,500.',
        significance: 'High Confidence Indicator of Structured Layering'
      },
      {
        title: 'Correlated Spatial-Temporal Rendezvous',
        description: 'Optical CCTV facial recognition and ANPR camera timestamps place Person_044, Person_078, and Vehicle_017 at Location_A (Sector 4 Logistics Warehouse) within an 8-minute window on 25 August 2026.',
        significance: 'Verifiable Physical Co-Presence Evidence'
      }
    ],
    patternAlertsSummary: {
      highCount: 3,
      mediumCount: 2,
      criticalObservations: [
        'Rapid fund relay between Account_103 and Account_221 matches financial laundering heuristic #F-109.',
        'Burst communication mode on Phone_021 coincides precisely with scheduled transit departure times of Vehicle_017.',
        'Shared proxy directors discovered between Organization_X and two blacklisted freight forwarders.'
      ]
    },
    timelineKeyPoints: [
      { time: '09:42 AM', event: 'Person_001 encrypted call to Person_044 (Duration: 4m 18s)', impact: 'Initial operational trigger' },
      { time: '11:15 AM', event: 'Person_044 co-location with Vehicle_017 at Location_A Gate 2', impact: 'Physical logistics link established' },
      { time: '02:32 PM', event: 'Account_103 ₹48,000 wire to Account_221', impact: 'Financial layering hop executed' },
      { time: '04:08 PM', event: 'Person_078 verified director filing with Organization_X', impact: 'Corporate hierarchy attributed' },
      { time: '06:45 PM', event: 'Automated graph engine linked meeting event between Person_044 & Person_078', impact: 'Cluster 03 to Cluster 02 bridge confirmed' }
    ],
    recommendations: [
      'Issue formal Section 91 CrPC notice to obtain full unmasked banking statements for Account_103 and Account_221.',
      'Deploy localized electronic perimeter surveillance on Sector 4 Logistics Warehouse (Location_A).',
      'Request Cell ID and IMEI tracking authorization for Phone_021.',
      'Initiate corporate registry audit on all registered directors of Apex Maritime Holdings Ltd. (Organization_X).'
    ]
  }
];
