import { Alert } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-9041',
    title: 'Unusual Network Connectivity',
    category: 'NETWORK_TOPOLOGY',
    severity: 'HIGH',
    status: 'NEW',
    timestamp: '18 mins ago (26 Aug, 18:45)',
    reason: 'Person_044 connects multiple otherwise separated network clusters with high betweenness centrality.',
    explanation: 'Entity participates in relationships spanning 3 distinct network communities (Cluster 01, Cluster 02, Cluster 03). In network topology analysis, this structural position indicates a key inter-group bridge or coordinator rather than an isolated peripheral node.',
    analyticalMetrics: [
      { metricName: 'Betweenness Centrality', baselineValue: '0.14 (Network Avg)', observedValue: '0.61 (99th Percentile)' },
      { metricName: 'Cluster Span', baselineValue: '1.1 Communities', observedValue: '3 Distinct Clusters' },
      { metricName: 'Bridge Edge Count', baselineValue: '0-2 links', observedValue: '8 Cross-Cluster Edges' }
    ],
    relatedEntities: [
      { id: 'Person_044', label: 'Person_044', type: 'PERSON', roleInAlert: 'Primary Bridge Node' },
      { id: 'Person_001', label: 'Person_001', type: 'PERSON', roleInAlert: 'Cluster 01 Node' },
      { id: 'Person_078', label: 'Person_078', type: 'PERSON', roleInAlert: 'Cluster 02 Node' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Inspect communication logs between Person_044 and linked cluster heads to confirm operational synchronization.'
  },
  {
    id: 'ALT-9042',
    title: 'Unusual Transaction Pattern',
    category: 'FINANCIAL_ANOMALY',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    timestamp: '2 hours ago (26 Aug, 14:35)',
    reason: 'Account_103 shows an unusual concentration of transfers during a short period.',
    explanation: 'Rapid fund relay detected where ₹48,000 was moved to Account_221 within 22 minutes of an inbound deposit. The amounts fall consistently just below mandatory automated reporting thresholds (₹50,000).',
    analyticalMetrics: [
      { metricName: 'Velocity Interval', baselineValue: '12 - 24 Hours', observedValue: '22 Minutes' },
      { metricName: 'Threshold Proximity', baselineValue: 'Normal Distribution', observedValue: '96.8% of ₹50k Cap' }
    ],
    relatedEntities: [
      { id: 'Account_103', label: 'ACCT-8849-103', type: 'ACCOUNT', roleInAlert: 'Disbursing Relay Account' },
      { id: 'Account_221', label: 'ACCT-9921-221', type: 'ACCOUNT', roleInAlert: 'Beneficiary Account' },
      { id: 'Person_001', label: 'Person_001', type: 'PERSON', roleInAlert: 'Authorized Signatory' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Request expedited bank statement logs for Account_103 to verify origin of cash deposits.'
  },
  {
    id: 'ALT-9043',
    title: 'New Cross-Cluster Connection',
    category: 'CROSS_CLUSTER',
    severity: 'MEDIUM',
    status: 'NEW',
    timestamp: '3 hours ago (26 Aug, 16:10)',
    reason: 'A new relationship has appeared between Cluster 02 and Cluster 03.',
    explanation: 'A newly indexed incident report confirms formal corporate affiliation between Person_078 (Cluster 02) and Organization_X (holding lease on Location_A in Cluster 03).',
    analyticalMetrics: [
      { metricName: 'Cluster Distance', baselineValue: '2 Hops', observedValue: 'Direct 1st-Degree Link' },
      { metricName: 'Edge Confidence', baselineValue: '> 0.70', observedValue: '0.93 (Verified Document)' }
    ],
    relatedEntities: [
      { id: 'Person_078', label: 'Person_078', type: 'PERSON', roleInAlert: 'Cluster 02 Operational Lead' },
      { id: 'Organization_X', label: 'Apex Maritime Holdings Ltd.', type: 'ORGANIZATION', roleInAlert: 'Cluster 03 Asset Holder' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Cross-reference corporate registry CIN filings with previous customs consignments at Sector 4.'
  },
  {
    id: 'ALT-9044',
    title: 'Burner SIM Burst Activity',
    category: 'COMMUNICATION_SPIKE',
    severity: 'HIGH',
    status: 'REVIEWED',
    timestamp: '5 hours ago (26 Aug, 13:00)',
    reason: 'Phone_021 logged 14 short-duration calls within a 45-minute window before going silent.',
    explanation: 'Communication pattern matches tactical coordination signatures. Tower triangulations align with movements of Vehicle_017 along Northern Industrial Expressway.',
    analyticalMetrics: [
      { metricName: 'Call Frequency Spike', baselineValue: '1.2 calls/hr', observedValue: '18.6 calls/hr' },
      { metricName: 'Tower Trajectory Alignment', baselineValue: 'Random', observedValue: '92% Vector Match' }
    ],
    relatedEntities: [
      { id: 'Phone_021', label: '+91-98700-00021', type: 'PHONE', roleInAlert: 'Source Device' },
      { id: 'Person_044', label: 'Person_044', type: 'PERSON', roleInAlert: 'Associated Carrier' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Extract Cell Tower Dump for Sector 14 north tower during the 09:00 - 10:00 window.'
  },
  {
    id: 'ALT-9045',
    title: 'Multi-Location Co-Presence Anomaly',
    category: 'GEO_TEMPORAL',
    severity: 'LOW',
    status: 'REVIEWED',
    timestamp: 'Yesterday (25 Aug, 21:15)',
    reason: 'Multiple entities logged at Location_A within an 8-minute arrival interval.',
    explanation: 'ANPR camera hits matched Vehicle_017 while CCTV facial analytics confirmed Person_044 and Person_078 on premises.',
    analyticalMetrics: [
      { metricName: 'Temporal Coincidence Window', baselineValue: '> 60 mins', observedValue: '7.5 mins' },
      { metricName: 'Facial Match Confidence', baselineValue: 'Threshold 85%', observedValue: '94.2%' }
    ],
    relatedEntities: [
      { id: 'Location_A', label: 'Sector 4 Logistics Warehouse', type: 'LOCATION', roleInAlert: 'Rendezvous Site' },
      { id: 'Person_044', label: 'Person_044', type: 'PERSON', roleInAlert: 'Visitor' },
      { id: 'Person_078', label: 'Person_078', type: 'PERSON', roleInAlert: 'Visitor' },
      { id: 'Vehicle_017', label: 'Armored SUV [DL-08-CC-9017]', type: 'VEHICLE', roleInAlert: 'Transport Asset' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Archive perimeter CCTV footage for 25 Aug 20:00 - 22:00.'
  }
];
