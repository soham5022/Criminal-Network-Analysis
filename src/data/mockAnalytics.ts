export interface ActivityDataPoint {
  date: string;
  dayDisplay: string;
  cdrEvents: number;
  financialTransactions: number;
  geoSightings: number;
  flaggedAnomalies: number;
  totalActivity: number;
}

export interface EntityDistributionDataPoint {
  type: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RelationshipDistributionDataPoint {
  type: string;
  name: string;
  count: number;
  avgConfidence: number;
  color: string;
}

export interface CommunityClusterMetric {
  clusterId: string;
  name: string;
  nodeCount: number;
  primaryCategory: string;
  density: number;
  modularityScore: number;
  dominantBridge: string;
}

export const mockOverviewKPIs = {
  activeCases: {
    value: 24,
    formatted: '24',
    trend: '+3 this month',
    trendDirection: 'up' as const,
    subtitle: '4 high-priority operations'
  },
  entitiesAnalyzed: {
    value: 1284,
    formatted: '1,284',
    trend: '+142 from new ingestion',
    trendDirection: 'up' as const,
    subtitle: 'Across 6 domain types'
  },
  relationships: {
    value: 4821,
    formatted: '4,821',
    trend: '+530 verified links',
    trendDirection: 'up' as const,
    subtitle: 'Avg 3.75 links per entity'
  },
  flaggedPatterns: {
    value: 37,
    formatted: '37',
    trend: '8 high severity alerts',
    trendDirection: 'neutral' as const,
    subtitle: 'Topology & transaction anomalies'
  },
  reportsProcessed: {
    value: 156,
    formatted: '156',
    trend: '+19 this week',
    trendDirection: 'up' as const,
    subtitle: '98.4% AI extraction confidence'
  }
};

export const mockActivityTrends: ActivityDataPoint[] = [
  { date: '2026-07-28', dayDisplay: '28 Jul', cdrEvents: 120, financialTransactions: 45, geoSightings: 32, flaggedAnomalies: 2, totalActivity: 199 },
  { date: '2026-07-30', dayDisplay: '30 Jul', cdrEvents: 145, financialTransactions: 52, geoSightings: 41, flaggedAnomalies: 3, totalActivity: 241 },
  { date: '2026-08-01', dayDisplay: '01 Aug', cdrEvents: 190, financialTransactions: 80, geoSightings: 60, flaggedAnomalies: 5, totalActivity: 335 },
  { date: '2026-08-03', dayDisplay: '03 Aug', cdrEvents: 160, financialTransactions: 70, geoSightings: 48, flaggedAnomalies: 4, totalActivity: 282 },
  { date: '2026-08-05', dayDisplay: '05 Aug', cdrEvents: 220, financialTransactions: 110, geoSightings: 75, flaggedAnomalies: 8, totalActivity: 413 },
  { date: '2026-08-07', dayDisplay: '07 Aug', cdrEvents: 280, financialTransactions: 140, geoSightings: 89, flaggedAnomalies: 11, totalActivity: 520 },
  { date: '2026-08-09', dayDisplay: '09 Aug', cdrEvents: 240, financialTransactions: 95, geoSightings: 65, flaggedAnomalies: 6, totalActivity: 406 },
  { date: '2026-08-11', dayDisplay: '11 Aug', cdrEvents: 310, financialTransactions: 165, geoSightings: 102, flaggedAnomalies: 14, totalActivity: 591 },
  { date: '2026-08-13', dayDisplay: '13 Aug', cdrEvents: 290, financialTransactions: 130, geoSightings: 88, flaggedAnomalies: 9, totalActivity: 517 },
  { date: '2026-08-15', dayDisplay: '15 Aug', cdrEvents: 260, financialTransactions: 115, geoSightings: 70, flaggedAnomalies: 7, totalActivity: 452 },
  { date: '2026-08-17', dayDisplay: '17 Aug', cdrEvents: 340, financialTransactions: 180, geoSightings: 115, flaggedAnomalies: 16, totalActivity: 651 },
  { date: '2026-08-19', dayDisplay: '19 Aug', cdrEvents: 390, financialTransactions: 210, geoSightings: 130, flaggedAnomalies: 19, totalActivity: 749 },
  { date: '2026-08-21', dayDisplay: '21 Aug', cdrEvents: 420, financialTransactions: 240, geoSightings: 148, flaggedAnomalies: 23, totalActivity: 831 },
  { date: '2026-08-23', dayDisplay: '23 Aug', cdrEvents: 380, financialTransactions: 195, geoSightings: 125, flaggedAnomalies: 17, totalActivity: 717 },
  { date: '2026-08-25', dayDisplay: '25 Aug', cdrEvents: 460, financialTransactions: 275, geoSightings: 160, flaggedAnomalies: 28, totalActivity: 923 },
  { date: '2026-08-26', dayDisplay: '26 Aug', cdrEvents: 495, financialTransactions: 310, geoSightings: 185, flaggedAnomalies: 34, totalActivity: 1024 }
];

export const mockEntityDistribution: EntityDistributionDataPoint[] = [
  { type: 'PERSON', name: 'Persons', count: 486, percentage: 37.8, color: '#38bdf8' },
  { type: 'PHONE', name: 'Phones / SIMs', count: 324, percentage: 25.2, color: '#10b981' },
  { type: 'ACCOUNT', name: 'Accounts / Ledgers', count: 218, percentage: 17.0, color: '#f59e0b' },
  { type: 'LOCATION', name: 'Locations & Hubs', count: 128, percentage: 10.0, color: '#a855f7' },
  { type: 'ORGANIZATION', name: 'Organizations', count: 76, percentage: 5.9, color: '#6366f1' },
  { type: 'VEHICLE', name: 'Vehicles / Assets', count: 52, percentage: 4.1, color: '#f43f5e' }
];

export const mockRelationshipDistribution: RelationshipDistributionDataPoint[] = [
  { type: 'CALLED', name: 'Called (Telephony/VOIP)', count: 1842, avgConfidence: 0.94, color: '#38bdf8' },
  { type: 'TRANSFERRED', name: 'Transferred (Financial)', count: 1120, avgConfidence: 0.97, color: '#f59e0b' },
  { type: 'VISITED', name: 'Visited (Geo/ANPR)', count: 785, avgConfidence: 0.91, color: '#a855f7' },
  { type: 'ASSOCIATED_WITH', name: 'Associated With (Corp)', count: 460, avgConfidence: 0.89, color: '#6366f1' },
  { type: 'OWNED', name: 'Owned (Asset/SIM)', count: 342, avgConfidence: 0.95, color: '#10b981' },
  { type: 'MET', name: 'Met (Physical Rendezvous)', count: 272, avgConfidence: 0.88, color: '#f43f5e' }
];

export const mockCommunityClusters: CommunityClusterMetric[] = [
  { clusterId: 'Cluster 01', name: 'Financial Layering & Shell Accounts', nodeCount: 18, primaryCategory: 'ACCOUNT', density: 0.42, modularityScore: 0.74, dominantBridge: 'Person_001' },
  { clusterId: 'Cluster 02', name: 'Freight Logistics & Staging Hubs', nodeCount: 14, primaryCategory: 'LOCATION', density: 0.38, modularityScore: 0.69, dominantBridge: 'Person_078' },
  { clusterId: 'Cluster 03', name: 'Tactical Coordination & Relay Grid', nodeCount: 12, primaryCategory: 'PERSON', density: 0.51, modularityScore: 0.82, dominantBridge: 'Person_044' },
  { clusterId: 'Cluster 04', name: 'Corporate Escrow & Front Holdings', nodeCount: 8, primaryCategory: 'ORGANIZATION', density: 0.31, modularityScore: 0.65, dominantBridge: 'Organization_X' }
];
