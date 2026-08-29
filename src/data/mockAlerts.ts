import { Alert } from '../types';

export const mockAlerts: Alert[] = [
  // ==========================================
  // CASE-1024 (Operation Meridian) Alerts
  // ==========================================
  {
    id: 'ALT-9041',
    title: 'Unusual Network Connectivity (Bridge Lead)',
    category: 'NETWORK_TOPOLOGY',
    severity: 'HIGH',
    status: 'NEW',
    timestamp: '18 mins ago (26 Aug, 18:45)',
    reason: 'Rahul Sharma connects multiple otherwise separated network clusters with high betweenness centrality.',
    explanation: 'Rahul Sharma participates in relationships spanning 3 distinct network communities (Cluster 01, Cluster 02, Cluster 03). In network topology analysis, this structural position indicates a key inter-group bridge or coordinator rather than an isolated peripheral node.',
    analyticalMetrics: [
      { metricName: 'Betweenness Centrality', baselineValue: '0.14 (Network Avg)', observedValue: '0.61 (99th Percentile)' },
      { metricName: 'Cluster Span', baselineValue: '1.1 Communities', observedValue: '3 Distinct Clusters' },
      { metricName: 'Bridge Edge Count', baselineValue: '0-2 links', observedValue: '8 Cross-Cluster Edges' }
    ],
    relatedEntities: [
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInAlert: 'Primary Bridge Node' },
      { id: 'Person_001', label: 'Vikram Singh', type: 'PERSON', roleInAlert: 'Cluster 01 Node' },
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', roleInAlert: 'Cluster 02 Node' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Inspect communication logs between Rahul Sharma and linked cluster heads to confirm operational synchronization.'
  },
  {
    id: 'ALT-9042',
    title: 'Structured Rapid Transaction Velocity',
    category: 'FINANCIAL_ANOMALY',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    timestamp: '2 hours ago (26 Aug, 14:35)',
    reason: 'Account ending 4821 shows an unusual concentration of transfers during a short period.',
    explanation: 'Rapid fund relay detected where ₹48,000 was moved to Account ending 7316 within 22 minutes of an inbound deposit. The amounts fall consistently just below mandatory automated reporting thresholds (₹50,000).',
    analyticalMetrics: [
      { metricName: 'Velocity Interval', baselineValue: '12 - 24 Hours', observedValue: '22 Minutes' },
      { metricName: 'Threshold Proximity', baselineValue: 'Normal Distribution', observedValue: '96.8% of ₹50k Cap' }
    ],
    relatedEntities: [
      { id: 'Account_103', label: 'Account ending 4821', type: 'ACCOUNT', roleInAlert: 'Disbursing Relay Account' },
      { id: 'Account_221', label: 'Account ending 7316', type: 'ACCOUNT', roleInAlert: 'Beneficiary Account' },
      { id: 'Person_001', label: 'Vikram Singh', type: 'PERSON', roleInAlert: 'Authorized Signatory' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Request expedited bank statement logs for Account ending 4821 to verify origin of cash deposits.'
  },
  {
    id: 'ALT-9043',
    title: 'New Cross-Cluster Affiliation Documented',
    category: 'CROSS_CLUSTER',
    severity: 'MEDIUM',
    status: 'NEW',
    timestamp: '3 hours ago (26 Aug, 16:10)',
    reason: 'A new relationship has appeared between Cluster 02 and Cluster 03.',
    explanation: 'A newly indexed incident report confirms formal corporate affiliation between Amit Patil (Cluster 02) and Meridian Logistics Pvt. Ltd. (holding lease on Thane West Logistics Hub in Cluster 03).',
    analyticalMetrics: [
      { metricName: 'Cluster Distance', baselineValue: '2 Hops', observedValue: 'Direct 1st-Degree Link' },
      { metricName: 'Edge Confidence', baselineValue: '> 0.70', observedValue: '0.93 (Verified Document)' }
    ],
    relatedEntities: [
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', roleInAlert: 'Cluster 02 Operational Lead' },
      { id: 'Organization_X', label: 'Meridian Logistics Pvt. Ltd.', type: 'ORGANIZATION', roleInAlert: 'Cluster 03 Asset Holder' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Cross-reference corporate registry CIN filings with previous customs consignments at Thane West.'
  },
  {
    id: 'ALT-9044',
    title: 'Burner SIM Burst Activity',
    category: 'COMMUNICATION_SPIKE',
    severity: 'HIGH',
    status: 'REVIEWED',
    timestamp: '5 hours ago (26 Aug, 13:00)',
    reason: 'Primary Mobile (+91 XXXXX 28471) logged 14 short-duration calls within a 45-minute window before going silent.',
    explanation: 'Communication pattern matches tactical coordination signatures. Tower triangulations align with movements of vehicle MH-04-XX-2847 along Northern Industrial Expressway.',
    analyticalMetrics: [
      { metricName: 'Call Frequency Spike', baselineValue: '1.2 calls/hr', observedValue: '18.6 calls/hr' },
      { metricName: 'Tower Trajectory Alignment', baselineValue: 'Random', observedValue: '92% Vector Match' }
    ],
    relatedEntities: [
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', roleInAlert: 'Source Device' },
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInAlert: 'Associated Carrier' }
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
    reason: 'Multiple entities logged at Thane West Logistics Hub within an 8-minute arrival interval.',
    explanation: 'ANPR camera hits matched vehicle MH-04-XX-2847 while CCTV facial analytics confirmed Rahul Sharma and Amit Patil on premises.',
    analyticalMetrics: [
      { metricName: 'Temporal Coincidence Window', baselineValue: '> 60 mins', observedValue: '7.5 mins' },
      { metricName: 'Facial Match Confidence', baselineValue: 'Threshold 85%', observedValue: '94.2%' }
    ],
    relatedEntities: [
      { id: 'Location_A', label: 'Thane West Logistics Hub', type: 'LOCATION', roleInAlert: 'Rendezvous Site' },
      { id: 'Person_044', label: 'Rahul Sharma', type: 'PERSON', roleInAlert: 'Visitor' },
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', roleInAlert: 'Visitor' },
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', roleInAlert: 'Transport Asset' }
    ],
    associatedCaseId: 'CASE-1024',
    recommendedAction: 'Archive perimeter CCTV footage for 25 Aug 20:00 - 22:00.'
  },

  // ==========================================
  // CASE-1031 (Project Shadowline) Alerts
  // ==========================================
  {
    id: 'ALT-9051',
    title: 'Dynamic IMEI Rotation Detected',
    category: 'COMMUNICATION_SPIKE',
    severity: 'CRITICAL',
    status: 'NEW',
    timestamp: '1 hour ago (26 Aug, 15:30)',
    reason: 'Multiple SIM cards operating on single IMEI hardware profile.',
    explanation: 'Telecommunication forensic analysis identified 4 distinct SIM cards sequentially activated on the same radio transceiver within 3 hours.',
    analyticalMetrics: [
      { metricName: 'SIM Turnover Interval', baselineValue: '30+ Days', observedValue: '42 Minutes' },
      { metricName: 'Hardware Fingerprint Match', baselineValue: '< 50%', observedValue: '99.8%' }
    ],
    relatedEntities: [
      { id: 'Phone_021', label: '+91 XXXXX 28471', type: 'PHONE', roleInAlert: 'Primary IMEI Profile' },
      { id: 'Phone_045', label: '+91 XXXXX 73142', type: 'PHONE', roleInAlert: 'Rotated Secondary Line' }
    ],
    associatedCaseId: 'CASE-1031',
    recommendedAction: 'Issue preservation request to telecom operator for IMEI hardware telemetry logs.'
  },

  // ==========================================
  // CASE-1042 (Operation Northstar) Alerts
  // ==========================================
  {
    id: 'ALT-9061',
    title: 'Nocturnal Transit Route Anomaly',
    category: 'GEO_TEMPORAL',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    timestamp: '4 hours ago (26 Aug, 12:15)',
    reason: 'Vehicle MH-04-XX-2847 logged recurring off-hours transit between unlisted staging yards.',
    explanation: 'Automated ANPR surveillance correlated 8 nighttime checkpoint crossings between Thane West Hub and Vashi Safehouse between 02:00 and 04:30 AM.',
    analyticalMetrics: [
      { metricName: 'Standard Operating Hours', baselineValue: '08:00 - 20:00', observedValue: '02:15 - 04:45 AM' },
      { metricName: 'Route Recurrence', baselineValue: '1-2 monthly', observedValue: '8 consecutive nights' }
    ],
    relatedEntities: [
      { id: 'Vehicle_017', label: 'Maruti Swift (MH-04-XX-2847)', type: 'VEHICLE', roleInAlert: 'Tracked Asset' },
      { id: 'Person_027', label: 'Rohan Deshmukh', type: 'PERSON', roleInAlert: 'Registered Driver' },
      { id: 'Location_B', label: 'Vashi Safehouse Facility', type: 'LOCATION', roleInAlert: 'Destination Depot' }
    ],
    associatedCaseId: 'CASE-1042',
    recommendedAction: 'Deploy physical surveillance team at KM-42 expressway checkpoint.'
  },

  // ==========================================
  // CASE-1057 (Project Crosslink) Alerts
  // ==========================================
  {
    id: 'ALT-9071',
    title: 'Shared Corporate Director & Shell Network',
    category: 'CROSS_CLUSTER',
    severity: 'HIGH',
    status: 'NEW',
    timestamp: '6 hours ago (26 Aug, 10:00)',
    reason: 'Meridian Logistics Pvt. Ltd. shares registered office coordinates with 3 blacklisted entities.',
    explanation: 'Registrar of Companies database cross-matching identified overlapping signatory authorities between Meridian Logistics and previously seized offshore shell accounts.',
    analyticalMetrics: [
      { metricName: 'Director Overlap Ratio', baselineValue: '0.00', observedValue: '0.85' },
      { metricName: 'Capital Dispersal Ratio', baselineValue: '< 20%', observedValue: '94% Outflow in 24h' }
    ],
    relatedEntities: [
      { id: 'Organization_X', label: 'Meridian Logistics Pvt. Ltd.', type: 'ORGANIZATION', roleInAlert: 'Shell Aggregator' },
      { id: 'Person_078', label: 'Amit Patil', type: 'PERSON', roleInAlert: 'Managing Director' },
      { id: 'Account_103', label: 'Account ending 4821', type: 'ACCOUNT', roleInAlert: 'Associated Escrow' }
    ],
    associatedCaseId: 'CASE-1057',
    recommendedAction: 'Submit formal enquiry to Financial Intelligence Unit regarding offshore wire transfers.'
  }
];
