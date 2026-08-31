import { Relationship } from '../types';

export const mockRelationships: Relationship[] = [
  // Person_044 connections (Bridge Entity)
  {
    id: 'rel_001',
    source: 'Person_001',
    target: 'Person_044',
    type: 'CALLED',
    timestamp: '2026-08-26 09:42:15',
    confidence: 0.96,
    frequency: 47,
    duration: '4m 18s (Average)',
    sourceType: 'CDR',
    flaggedAnomaly: true,
    notes: 'High frequency burst calls right before fund transfers.'
  },
  {
    id: 'rel_002',
    source: 'Person_044',
    target: 'Location_A',
    type: 'VISITED',
    timestamp: '2026-08-26 11:15:30',
    confidence: 0.94,
    frequency: 14,
    locationName: 'Sector 4 Logistics Warehouse',
    sourceType: 'SURVEILLANCE_LOG',
    flaggedAnomaly: false,
    notes: 'Co-located with Vehicle_017 on 8 separate dates.'
  },
  {
    id: 'rel_003',
    source: 'Person_044',
    target: 'Phone_021',
    type: 'OWNED',
    timestamp: '2026-06-01 10:00:00',
    confidence: 0.92,
    sourceType: 'CDR',
    flaggedAnomaly: true,
    notes: 'Registered under alias; IMEI matching observed across cell towers.'
  },
  {
    id: 'rel_004',
    source: 'Person_044',
    target: 'Person_078',
    type: 'MET',
    timestamp: '2026-08-25 18:30:00',
    confidence: 0.89,
    frequency: 6,
    locationName: 'Sector 4 Logistics Warehouse',
    sourceType: 'CCTV_FACIAL',
    flaggedAnomaly: true,
    notes: 'Physical rendezvous between Cluster 03 bridge and Cluster 02 operational lead.'
  },
  {
    id: 'rel_005',
    source: 'Person_044',
    target: 'Account_103',
    type: 'TRANSFERRED',
    timestamp: '2026-08-26 14:10:00',
    confidence: 0.95,
    amount: 48500,
    currency: 'INR',
    sourceType: 'BANKING_SWIFT',
    flaggedAnomaly: true,
    notes: 'Sub-threshold structuring transfer.'
  },

  // Account_103 and Financial Network
  {
    id: 'rel_006',
    source: 'Account_103',
    target: 'Account_221',
    type: 'TRANSFERRED',
    timestamp: '2026-08-26 14:32:45',
    confidence: 0.99,
    amount: 48000,
    currency: 'INR',
    sourceType: 'BANKING_SWIFT',
    flaggedAnomaly: true,
    notes: 'Rapid relay transfer within 22 minutes of deposit from Person_044.'
  },
  {
    id: 'rel_007',
    source: 'Person_001',
    target: 'Account_103',
    type: 'OWNED',
    timestamp: '2026-05-10 14:00:00',
    confidence: 0.97,
    sourceType: 'BANKING_SWIFT',
    notes: 'Authorized signatory for account.'
  },
  {
    id: 'rel_008',
    source: 'Account_103',
    target: 'Organization_X',
    type: 'ASSOCIATED_WITH',
    timestamp: '2026-05-15 11:20:00',
    confidence: 0.95,
    sourceType: 'BANKING_SWIFT',
    notes: 'Corporate billing and escrow payee.'
  },

  // Cluster 01 internal connections
  {
    id: 'rel_009',
    source: 'Person_001',
    target: 'Person_014',
    type: 'CALLED',
    timestamp: '2026-08-26 08:15:00',
    confidence: 0.88,
    frequency: 18,
    sourceType: 'CDR'
  },
  {
    id: 'rel_010',
    source: 'Person_014',
    target: 'Phone_045',
    type: 'OWNED',
    timestamp: '2026-06-18 09:00:00',
    confidence: 0.91,
    sourceType: 'CDR'
  },
  {
    id: 'rel_011',
    source: 'Person_014',
    target: 'Account_221',
    type: 'ASSOCIATED_WITH',
    timestamp: '2026-06-22 16:00:00',
    confidence: 0.87,
    sourceType: 'BANKING_SWIFT',
    notes: 'Secondary recipient beneficiary.'
  },

  // Cluster 02 & Logistics connections
  {
    id: 'rel_012',
    source: 'Person_078',
    target: 'Organization_X',
    type: 'ASSOCIATED_WITH',
    timestamp: '2026-08-26 16:08:00',
    confidence: 0.93,
    sourceType: 'INCIDENT_FIR',
    notes: 'Listed managing director and shareholder.'
  },
  {
    id: 'rel_013',
    source: 'Person_078',
    target: 'Person_027',
    type: 'CALLED',
    timestamp: '2026-08-26 12:40:00',
    confidence: 0.90,
    frequency: 29,
    sourceType: 'CDR'
  },
  {
    id: 'rel_014',
    source: 'Person_027',
    target: 'Vehicle_017',
    type: 'OWNED',
    timestamp: '2026-07-01 12:00:00',
    confidence: 0.94,
    sourceType: 'SURVEILLANCE_LOG',
    notes: 'Driver and registered transport agent.'
  },
  {
    id: 'rel_015',
    source: 'Vehicle_017',
    target: 'Location_A',
    type: 'VISITED',
    timestamp: '2026-08-26 10:45:00',
    confidence: 0.96,
    frequency: 31,
    sourceType: 'SURVEILLANCE_LOG',
    notes: 'ANPR camera logging regular gate entries.'
  },
  {
    id: 'rel_016',
    source: 'Vehicle_017',
    target: 'Location_B',
    type: 'VISITED',
    timestamp: '2026-08-26 15:20:00',
    confidence: 0.88,
    frequency: 12,
    sourceType: 'SURVEILLANCE_LOG',
    notes: 'Transit route link between Location_A and Location_B.'
  },
  {
    id: 'rel_017',
    source: 'Person_027',
    target: 'Location_B',
    type: 'VISITED',
    timestamp: '2026-08-26 15:30:00',
    confidence: 0.89,
    frequency: 9,
    sourceType: 'CCTV_FACIAL'
  },
  {
    id: 'rel_018',
    source: 'Phone_021',
    target: 'Phone_045',
    type: 'CALLED',
    timestamp: '2026-08-26 07:11:00',
    confidence: 0.85,
    frequency: 7,
    sourceType: 'CDR',
    notes: 'Cross-cluster device handshake.'
  },
  {
    id: 'rel_019',
    source: 'Organization_X',
    target: 'Location_A',
    type: 'OWNED',
    timestamp: '2026-03-01 09:00:00',
    confidence: 0.98,
    sourceType: 'INCIDENT_FIR',
    notes: 'Lease agreement on warehouse facility.'
  },
  {
    id: 'rel_020',
    source: 'Person_052',
    target: 'Phone_021',
    type: 'ASSOCIATED_WITH',
    timestamp: '2026-07-05 11:30:00',
    confidence: 0.91,
    sourceType: 'RETAILER_LEDGER',
    notes: 'Retail vendor SIM activation batch record.'
  },
  {
    id: 'rel_021',
    source: 'Organization_X',
    target: 'Location_C',
    type: 'ASSOCIATED_WITH',
    timestamp: '2026-08-08 14:00:00',
    confidence: 0.93,
    sourceType: 'PORT_MANIFEST',
    notes: 'Consignee on maritime bills of lading at Eastern Docklands.'
  },
  {
    id: 'rel_022',
    source: 'Account_103',
    target: 'Account_304',
    type: 'TRANSFERRED',
    timestamp: '2026-08-12 16:45:00',
    confidence: 0.97,
    amount: 49500,
    currency: 'INR',
    sourceType: 'BANKING_SWIFT',
    notes: 'Structured Hawala book settlement transfer.'
  },
  {
    id: 'rel_023',
    source: 'Phone_021',
    target: 'Phone_088',
    type: 'CALLED',
    timestamp: '2026-08-18 19:20:00',
    confidence: 0.89,
    frequency: 11,
    sourceType: 'CDR',
    notes: 'Hardware IMEI handshake between primary burner and clone profile.'
  },
  {
    id: 'rel_024',
    source: 'Phone_092',
    target: 'Person_001',
    type: 'CALLED',
    timestamp: '2026-08-21 13:10:00',
    confidence: 0.92,
    frequency: 4,
    sourceType: 'VOIP_INTERCEPT',
    notes: 'Inbound virtual proxy routing threat calls.'
  },
  {
    id: 'rel_025',
    source: 'Vehicle_033',
    target: 'Location_A',
    type: 'VISITED',
    timestamp: '2026-08-24 23:45:00',
    confidence: 0.95,
    frequency: 8,
    sourceType: 'ANPR_CAMERA',
    notes: 'Duplicate plate toll hit at Thane West perimeter.'
  },
  {
    id: 'rel_026',
    source: 'Account_512',
    target: 'Account_103',
    type: 'TRANSFERRED',
    timestamp: '2026-08-27 17:30:00',
    confidence: 0.96,
    amount: 47800,
    currency: 'INR',
    sourceType: 'CRYPTO_SETTLEMENT',
    notes: 'Decentralized mixer cash-out into intermediary account.'
  }
];
