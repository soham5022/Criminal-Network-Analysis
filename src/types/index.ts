export type EntityType = 
  | 'PERSON' 
  | 'PHONE' 
  | 'ACCOUNT' 
  | 'LOCATION' 
  | 'ORGANIZATION' 
  | 'VEHICLE';

export type AnalyticalPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export interface AttentionScoreFactor {
  name: string;
  points: number;
  reason: string;
}

export interface Entity {
  id: string; // e.g. "Person_044"
  label: string; // Fictional display name or code
  type: EntityType;
  community: string; // e.g. "Cluster 03"
  analyticalPriority: AnalyticalPriority;
  attentionScore?: number; // 0 - 100
  degreeCentrality: number; // 0.00 - 1.00
  betweennessCentrality: number; // 0.00 - 1.00
  closenessCentrality?: number;
  eigenvectorCentrality?: number;
  pagerank?: number;
  crossCommunityLinks?: number;
  communitiesConnectedCount?: number;
  isBridge?: boolean;
  connectionsCount: number;
  locationsCount: number;
  phonesCount: number;
  accountsCount: number;
  organizationsCount: number;
  vehiclesCount: number;
  lastActivity: string; // ISO or relative timestamp
  firstSeen: string;
  associatedCaseIds: string[];
  keyConnections: string[]; // IDs of top linked entities
  attentionFactors?: AttentionScoreFactor[];
  relatedAlertsCount?: number;
  metadata: {
    description?: string;
    alias?: string;
    carrierOrBank?: string;
    jurisdiction?: string;
    ipOrCoordinates?: string;
    confidenceScore: number;
    flags?: string[];
  };
}

export type RelationshipType = 
  | 'CALLED' 
  | 'TRANSFERRED' 
  | 'VISITED' 
  | 'ASSOCIATED_WITH' 
  | 'OWNED' 
  | 'MET'
  | 'CO_LOCATED'
  | 'MEMBER_OF'
  | 'USES';

export interface Relationship {
  id: string;
  source: string; // Entity ID
  target: string; // Entity ID
  type: RelationshipType;
  timestamp: string;
  confidence: number; // 0.00 - 1.00
  frequency?: number;
  amount?: number; // For TRANSFERRED
  currency?: string;
  duration?: string; // For CALLED
  locationName?: string; // For VISITED
  flaggedAnomaly?: boolean;
  isCrossCommunity?: boolean;
  sourceCommunity?: string;
  targetCommunity?: string;
  sourceType: string;
  notes?: string;
}

export type CaseStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'CRITICAL_LEAD' | 'CLOSED' | 'ARCHIVED';
export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';

export interface Case {
  id: string; // e.g. "CASE-1024"
  name: string; // "Operation Meridian"
  codeName: string; // "MERIDIAN_ALPHA"
  status: CaseStatus;
  priority: CasePriority;
  leadInvestigator: string;
  badgeNumber: string;
  department: string;
  dateOpened: string;
  lastActivity: string;
  entityCount: number;
  relationshipCount: number;
  flaggedAlertsCount: number;
  clustersIdentified: number;
  patternsDetectedCount?: number;
  tags: string[];
  description: string;
  objective: string;
  keyFindings: string[];
  evidencePointers: {
    firCount: number;
    cdrLogsCount: number;
    bankTransactionsCount: number;
    incidentReportsCount: number;
  };
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'NEW' | 'INVESTIGATING' | 'REVIEWED' | 'DISMISSED';

export type PatternType = 
  | 'CROSS_COMMUNITY_BRIDGE'
  | 'DENSE_NETWORK_CLUSTER'
  | 'RAPID_RELATIONSHIP_EXPANSION'
  | 'TRANSACTION_ANOMALY'
  | 'TEMPORAL_CORRELATION'
  | 'HIGH_BETWEENNESS_ENTITY';

export interface AlertMetric {
  metricName: string;
  baselineValue: string;
  observedValue: string;
}

export interface AlertRelatedEntity {
  id: string;
  label: string;
  type: EntityType;
  roleInAlert: string;
}

export interface Alert {
  id: string; // "ALT-9041"
  title: string;
  category: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  reason: string;
  explanation: string;
  analyticalMetrics: AlertMetric[];
  relatedEntities: AlertRelatedEntity[];
  associatedCaseId: string;
  recommendedAction: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeDisplay?: string;
  dateDisplay?: string;
  dateFormatted?: string;
  timeFormatted?: string;
  sourceEntity?: string;
  sourceEntityId?: string;
  sourceEntityLabel?: string;
  sourceType?: EntityType;
  sourceEntityType?: string;
  relationship: RelationshipType | string;
  targetEntity?: string;
  targetEntityId?: string;
  targetEntityLabel?: string;
  targetType?: EntityType;
  targetEntityType?: string;
  sourceRecord?: string;
  sourceCategory?: string;
  importance?: string;
  summary?: string;
  details?: string;
  confidence: number;
  category?: 'COMMUNICATION' | 'FINANCIAL' | 'PHYSICAL_SURVEILLANCE' | 'INTELLIGENCE_REPORT' | string;
  associatedCaseId: string;
  flaggedAnomaly?: boolean;
  notes?: string;
}

export interface IntelligenceReport {
  id: string;
  title?: string;
  author?: string;
  agency?: string;
  reportNumber?: string;
  generatedDate?: string;
  caseId: string;
  caseName?: string;
  classificationLevel?: 'SECRET // LAW ENFORCEMENT ONLY' | 'CONFIDENTIAL' | 'RESTRICTED';
  classification?: string;
  preparedFor?: string;
  leadInvestigator?: string;
  executiveSummary?: string;
  networkSummary?: {
    totalEntities: number;
    totalRelationships: number;
    clustersIdentified: number;
    criticalBridgeNodes?: string[];
    topAnomalies?: string[];
  };
  keyFindings?: string[];
  priorityEntities?: Entity[];
  keyEntities?: any[];
  criticalAlerts?: Alert[];
  recommendations?: string[];
  disclaimer?: string;
  [key: string]: any;
}

export interface IngestionDataset {
  id: string;
  name: string;
  type?: 'CDR' | 'FIR' | 'FINANCIAL' | 'INCIDENT';
  category?: 'CDR' | 'FIR' | 'FINANCIAL' | 'INCIDENT';
  fileFormat?: 'CSV' | 'PDF' | 'XLSX' | 'JSON';
  fileSize?: string;
  recordCount: number;
  estimatedEntities?: number;
  estimatedRelationships?: number;
  uploadedAt?: string;
  status: 'READY' | 'INGESTING' | 'INDEXED' | 'FLAGGED_ERRORS' | 'COMPLETED' | 'PENDING';
  description?: string;
}
